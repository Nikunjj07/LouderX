"""
Cleanup Utility
Marks expired events as inactive and performs database maintenance
"""

import sys
import os
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

# MongoDB connection
try:
    from pymongo import MongoClient
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/sydney-events')
    client = MongoClient(mongodb_uri)
    db = client.get_database()
    print(f"[OK] Connected to MongoDB: {db.name}\n")
except Exception as e:
    print(f"[ERROR] Failed to connect to MongoDB: {e}")
    exit(1)


def mark_expired_events():
    """
    Mark all past events as inactive.
    """
    print("Marking Expired Events")
    print("-" * 50)
    
    events_collection = db.events
    
    try:
        # Find and update past events
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
        
        print(f"[OK] Marked {result.modified_count} events as inactive")
        print(f"[OK] Total past events: {events_collection.count_documents({'date': {'$lt': datetime.now()}})}")
        print()
        
        return result.modified_count
        
    except Exception as e:
        print(f"[ERROR] Failed to mark expired events: {e}")
        return 0


def remove_old_events(days=90):
    """
    Remove events older than specified days.
    
    Args:
        days (int): Number of days to keep
    """
    print(f"Removing Events Older Than {days} Days")
    print("-" * 50)
    
    events_collection = db.events
    
    from datetime import timedelta
    cutoff_date = datetime.now() - timedelta(days=days)
    
    try:
        count = events_collection.count_documents({'date': {'$lt': cutoff_date}})
        
        if count > 0:
            response = input(f"Found {count} old events. Delete them? (y/n): ")
            if response.lower() == 'y':
                result = events_collection.delete_many({'date': {'$lt': cutoff_date}})
                print(f"[OK] Deleted {result.deleted_count} old events")
            else:
                print("[SKIP] Deletion cancelled")
        else:
            print("[OK] No old events to delete")
        
        print()
        
    except Exception as e:
        print(f"[ERROR] Failed to remove old events: {e}")


def get_database_stats():
    """
    Display database statistics.
    """
    print("Database Statistics")
    print("-" * 50)
    
    events_collection = db.events
    emails_collection = db.emails
    
    try:
        total_events = events_collection.count_documents({})
        active_events = events_collection.count_documents({'is_active': True})
        inactive_events = events_collection.count_documents({'is_active': False})
        upcoming_events = events_collection.count_documents({
            'is_active': True,
            'date': {'$gte': datetime.now()}
        })
        
        total_subscriptions = emails_collection.count_documents({})
        unique_emails = len(emails_collection.distinct('email'))
        
        print(f"Events:")
        print(f"  Total: {total_events}")
        print(f"  Active: {active_events}")
        print(f"  Inactive: {inactive_events}")
        print(f"  Upcoming: {upcoming_events}")
        print()
        print(f"Email Subscriptions:")
        print(f"  Total: {total_subscriptions}")
        print(f"  Unique Emails: {unique_emails}")
        print()
        
        # Sources breakdown
        sources = events_collection.aggregate([
            {'$group': {'_id': '$source', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ])
        
        print("Events by Source:")
        for source in sources:
            print(f"  {source['_id']}: {source['count']}")
        print()
        
    except Exception as e:
        print(f"[ERROR] Failed to get stats: {e}")


def main():
    """
    Main cleanup routine.
    """
    print("=" * 50)
    print("DATABASE CLEANUP UTILITY")
    print("=" * 50)
    print()
    
    # Mark expired events
    mark_expired_events()
    
    # Show stats
    get_database_stats()
    
    # Optional: Remove very old events
    # remove_old_events(days=90)
    
    print("=" * 50)
    print("Cleanup completed!")
    print("=" * 50)


if __name__ == "__main__":
    main()
