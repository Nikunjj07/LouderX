"""
Main Scraper Runner
Coordinates all event scrapers and saves results to database
"""

import sys
import os
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sources.sydney_events import TimeOutScraper, EventbriteSydneyScraper, WhatsonScraper
from utils.deduplicate import remove_duplicates, add_hash_to_event
from utils.date_parser import is_past_date

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Import MongoDB connection
try:
    import pymongo
    from pymongo import MongoClient
    MONGODB_AVAILABLE = True
except ImportError:
    MONGODB_AVAILABLE = False
    print("Warning: pymongo not available. Will print events instead of saving to database.")


class ScraperRunner:
    """
    Main runner that coordinates all scrapers and saves to database.
    """
    
    def __init__(self):
        self.scrapers = [
            TimeOutScraper(),
            EventbriteSydneyScraper(),
            WhatsonScraper()
        ]
        self.all_events = []
        self.db = None
        
        if MONGODB_AVAILABLE:
            try:
                mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/sydney-events')
                self.client = MongoClient(mongodb_uri)
                self.db = self.client.get_database()
                print(f"[OK] Connected to MongoDB: {self.db.name}")
            except Exception as e:
                print(f"[ERROR] Failed to connect to MongoDB: {e}")
                self.db = None
    
    def run_all_scrapers(self):
        """
        Run all configured scrapers.
        
        Returns:
            list: Combined list of all scraped events
        """
        print("=" * 70)
        print("SYDNEY EVENTS SCRAPER")
        print("=" * 70)
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        for scraper in self.scrapers:
            try:
                events = scraper.scrape()
                self.all_events.extend(events)
                print(f"[OK] {scraper.source_name}: {len(events)} events scraped\n")
            except Exception as e:
                print(f"[ERROR] Error scraping {scraper.source_name}: {e}\n")
        
        return self.all_events
    
    def process_events(self):
        """
        Process scraped events: deduplicate and filter.
        
        Returns:
            list: Processed events
        """
        print("-" * 70)
        print("PROCESSING EVENTS")
        print("-" * 70)
        
        initial_count = len(self.all_events)
        print(f"Initial events: {initial_count}")
        
        # Remove duplicates
        self.all_events = remove_duplicates(self.all_events)
        print(f"After deduplication: {len(self.all_events)}")
        
        # Filter out past events
        self.all_events = [e for e in self.all_events if not is_past_date(e['date'])]
        print(f"After filtering past events: {len(self.all_events)}")
        
        duplicates_removed = initial_count - len(self.all_events)
        print(f"Total removed: {duplicates_removed}\n")
        
        return self.all_events
    
    def save_to_database(self):
        """
        Save events to MongoDB database.
        """
        if not self.db:
            print("[WARNING] Database not available. Printing events instead:\n")
            self.print_events()
            return
        
        print("-" * 70)
        print("SAVING TO DATABASE")
        print("-" * 70)
        
        events_collection = self.db.events
        
        inserted = 0
        updated = 0
        skipped = 0
        
        for event in self.all_events:
            try:
                # Check if event already exists by hash
                existing = events_collection.find_one({'event_hash': event.get('event_hash')})
                
                if existing:
                    # Update existing event
                    events_collection.update_one(
                        {'_id': existing['_id']},
                        {'$set': {
                            'last_updated': datetime.now(),
                            'is_active': True
                        }}
                    )
                    updated += 1
                else:
                    # Insert new event
                    events_collection.insert_one(event)
                    inserted += 1
                    
            except Exception as e:
                print(f"Error saving event: {event.get('title')} - {e}")
                skipped += 1
        
        print(f"[OK] Inserted: {inserted}")
        print(f"[OK] Updated: {updated}")
        print(f"[SKIP] Skipped: {skipped}\n")
    
    def print_events(self):
        """
        Print scraped events to console.
        """
        print("-" * 70)
        print("SCRAPED EVENTS")
        print("-" * 70)
        
        for i, event in enumerate(self.all_events, 1):
            print(f"\n{i}. {event['title']}")
            print(f"   Date: {event['date'].strftime('%Y-%m-%d %H:%M')}")
            print(f"   Location: {event['location']}")
            print(f"   Source: {event['source']}")
            print(f"   Ticket URL: {event['ticket_url']}")
    
    def run(self):
        """
        Main execution method.
        """
        # Run all scrapers
        self.run_all_scrapers()
        
        # Process events
        self.process_events()
        
        # Save to database
        self.save_to_database()
        
        # Print summary
        print("=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Total unique events: {len(self.all_events)}")
        print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70 + "\n")


def main():
    """
    Main entry point.
    """
    runner = ScraperRunner()
    runner.run()


if __name__ == "__main__":
    main()
