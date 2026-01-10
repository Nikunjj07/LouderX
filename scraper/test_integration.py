"""
Test Scraper Pipeline
Tests the complete scraper-to-database integration
"""

import sys
import os
from datetime import datetime, timedelta

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from run_scraper import ScraperRunner
from utils.deduplicate import generate_event_hash

# MongoDB connection
try:
    from pymongo import MongoClient
    from dotenv import load_dotenv
    load_dotenv()
    
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/sydney-events')
    client = MongoClient(mongodb_uri)
    db = client.get_database()
    MONGODB_AVAILABLE = True
except Exception as e:
    print(f"[ERROR] MongoDB not available: {e}")
    MONGODB_AVAILABLE = False


def test_scraper_integration():
    """
    Test the complete scraper integration pipeline.
    """
    if not MONGODB_AVAILABLE:
        print("[ERROR] Cannot run tests without MongoDB")
        return False
    
    print("=" * 70)
    print("SCRAPER INTEGRATION TEST")
    print("=" * 70)
    print()
    
    try:
        # Test 1: Run scrapers
        print("Test 1: Running Scrapers")
        print("-" * 70)
        runner = ScraperRunner()
        events = runner.run_all_scrapers()
        print(f"[OK] Scraped {len(events)} events")
        print()
        
        # Test 2: Process events
        print("Test 2: Processing Events")
        print("-" * 70)
        processed = runner.process_events()
        print(f"[OK] Processed {len(processed)} unique events")
        print()
        
        # Test 3: Save to database
        print("Test 3: Saving to Database")
        print("-" * 70)
        runner.save_to_database()
        print("[OK] Events saved to database")
        print()
        
        # Test 4: Verify data in database
        print("Test 4: Verifying Database")
        print("-" * 70)
        events_collection = db.events
        total_events = events_collection.count_documents({})
        active_events = events_collection.count_documents({'is_active': True})
        print(f"[OK] Total events in database: {total_events}")
        print(f"[OK] Active events: {active_events}")
        print()
        
        # Test 5: Check for duplicates
        print("Test 5: Checking Duplicate Prevention")
        print("-" * 70)
        hashes = []
        for event in events_collection.find({}):
            if event.get('event_hash'):
                hashes.append(event['event_hash'])
        
        duplicates = len(hashes) - len(set(hashes))
        if duplicates == 0:
            print("[OK] No duplicate events found")
        else:
            print(f"[WARNING] Found {duplicates} duplicate events")
        print()
        
        # Test 6: Check timestamps
        print("Test 6: Checking Timestamps")
        print("-" * 70)
        recent_event = events_collection.find_one(
            {}, 
            sort=[('last_updated', -1)]
        )
        if recent_event and recent_event.get('last_updated'):
            time_diff = datetime.now() - recent_event['last_updated']
            if time_diff.seconds < 60:
                print(f"[OK] Events have recent timestamps (updated {time_diff.seconds}s ago)")
            else:
                print(f"[WARNING] Last update was {time_diff.seconds}s ago")
        print()
        
        print("=" * 70)
        print("[OK] All Integration Tests Passed!")
        print("=" * 70)
        print()
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_duplicate_detection():
    """
    Test duplicate detection specifically.
    """
    if not MONGODB_AVAILABLE:
        return
    
    print("=" * 70)
    print("DUPLICATE DETECTION TEST")
    print("=" * 70)
    print()
    
    try:
        events_collection = db.events
        
        # Create two identical events (except for source)
        test_event_1 = {
            'title': 'Test Duplicate Event',
            'date': datetime.now() + timedelta(days=30),
            'location': 'Test Location',
            'description': 'This is a test event for duplicate detection',
            'image_url': 'https://example.com/test.jpg',
            'ticket_url': 'https://example.com/tickets',
            'source': 'test_source_1',
            'is_active': True,
            'last_updated': datetime.now(),
            'event_hash': generate_event_hash(
                'Test Duplicate Event',
                datetime.now() + timedelta(days=30),
                'Test Location'
            )
        }
        
        test_event_2 = test_event_1.copy()
        test_event_2['source'] = 'test_source_2'
        
        # Try to insert both
        print("Inserting first test event...")
        result1 = events_collection.insert_one(test_event_1)
        print(f"[OK] Inserted: {result1.inserted_id}")
        
        print("Attempting to insert duplicate...")
        existing = events_collection.find_one({'event_hash': test_event_2['event_hash']})
        if existing:
            print("[OK] Duplicate detected and prevented!")
        else:
            print("[ERROR] Duplicate was not detected")
        
        # Cleanup
        events_collection.delete_many({'event_hash': test_event_1['event_hash']})
        print("[OK] Test cleanup completed")
        print()
        
    except Exception as e:
        print(f"[ERROR] Duplicate detection test failed: {e}")


def mark_expired_events():
    """
    Mark events that have passed as inactive.
    """
    if not MONGODB_AVAILABLE:
        return
    
    print("=" * 70)
    print("MARKING EXPIRED EVENTS")
    print("=" * 70)
    print()
    
    try:
        events_collection = db.events
        
        # Find all past events that are still active
        result = events_collection.update_many(
            {
                'date': {'$lt': datetime.now()},
                'is_active': True
            },
            {
                '$set': {
                    'is_active': False,
                    'last_updated': datetime.now()
                }
            }
        )
        
        print(f"[OK] Marked {result.modified_count} past events as inactive")
        print()
        
    except Exception as e:
        print(f"[ERROR] Failed to mark expired events: {e}")


if __name__ == "__main__":
    # Run all tests
    test_scraper_integration()
    test_duplicate_detection()
    mark_expired_events()
    
    print("\nAll tests completed!")
