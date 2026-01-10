"""
Deduplication Utility
Handles detection and prevention of duplicate events
"""

import hashlib
import json


def generate_event_hash(title, date, location):
    """
    Generate a unique hash for an event based on title, date, and location.
    This helps identify duplicate events from different sources.
    
    Args:
        title (str): Event title
        date (str/datetime): Event date
        location (str): Event location
        
    Returns:
        str: MD5 hash of the event
    """
    # Normalize the inputs
    normalized_title = str(title).lower().strip()
    normalized_date = str(date).lower().strip()
    normalized_location = str(location).lower().strip()
    
    # Remove extra whitespace
    normalized_title = ' '.join(normalized_title.split())
    normalized_location = ' '.join(normalized_location.split())
    
    # Create a composite string
    composite = f"{normalized_title}{normalized_date}{normalized_location}"
    
    # Remove all spaces for more aggressive matching
    composite = composite.replace(' ', '')
    
    # Generate MD5 hash
    hash_object = hashlib.md5(composite.encode())
    return hash_object.hexdigest()


def normalize_title(title):
    """
    Normalize event title for comparison.
    
    Args:
        title (str): Event title
        
    Returns:
        str: Normalized title
    """
    if not title:
        return ""
    
    # Convert to lowercase
    normalized = title.lower().strip()
    
    # Remove common punctuation
    punctuation = [',', '.', '!', '?', ':', ';', '"', "'"]
    for char in punctuation:
        normalized = normalized.replace(char, '')
    
    # Replace multiple spaces with single space
    normalized = ' '.join(normalized.split())
    
    return normalized


def normalize_location(location):
    """
    Normalize location for comparison.
    
    Args:
        location (str): Event location
        
    Returns:
        str: Normalized location
    """
    if not location:
        return ""
    
    # Convert to lowercase
    normalized = location.lower().strip()
    
    # Common location abbreviations
    replacements = {
        'street': 'st',
        'avenue': 'ave',
        'road': 'rd',
        'sydney': 'syd',
        'australia': 'aus'
    }
    
    for full, abbr in replacements.items():
        normalized = normalized.replace(full, abbr)
    
    # Remove extra spaces
    normalized = ' '.join(normalized.split())
    
    return normalized


def are_events_duplicate(event1, event2):
    """
    Check if two events are duplicates based on their attributes.
    
    Args:
        event1 (dict): First event dictionary
        event2 (dict): Second event dictionary
        
    Returns:
        bool: True if events are duplicates
    """
    # Generate hashes for both events
    hash1 = generate_event_hash(
        event1.get('title', ''),
        event1.get('date', ''),
        event1.get('location', '')
    )
    
    hash2 = generate_event_hash(
        event2.get('title', ''),
        event2.get('date', ''),
        event2.get('location', '')
    )
    
    # Compare hashes
    return hash1 == hash2


def find_duplicates_in_list(events):
    """
    Find duplicate events in a list.
    
    Args:
        events (list): List of event dictionaries
        
    Returns:
        dict: Dictionary with hash as key and list of duplicate events as value
    """
    hash_map = {}
    duplicates = {}
    
    for event in events:
        event_hash = generate_event_hash(
            event.get('title', ''),
            event.get('date', ''),
            event.get('location', '')
        )
        
        if event_hash in hash_map:
            # Found a duplicate
            if event_hash not in duplicates:
                duplicates[event_hash] = [hash_map[event_hash]]
            duplicates[event_hash].append(event)
        else:
            hash_map[event_hash] = event
    
    return duplicates


def remove_duplicates(events):
    """
    Remove duplicate events from a list, keeping the first occurrence.
    
    Args:
        events (list): List of event dictionaries
        
    Returns:
        list: List of unique events
    """
    seen_hashes = set()
    unique_events = []
    
    for event in events:
        event_hash = generate_event_hash(
            event.get('title', ''),
            event.get('date', ''),
            event.get('location', '')
        )
        
        if event_hash not in seen_hashes:
            seen_hashes.add(event_hash)
            unique_events.append(event)
    
    return unique_events


def add_hash_to_event(event):
    """
    Add hash field to an event dictionary.
    
    Args:
        event (dict): Event dictionary
        
    Returns:
        dict: Event dictionary with added hash field
    """
    event_hash = generate_event_hash(
        event.get('title', ''),
        event.get('date', ''),
        event.get('location', '')
    )
    
    event['event_hash'] = event_hash
    return event


# Example usage and testing
if __name__ == "__main__":
    # Test events
    event1 = {
        'title': 'Sydney Festival 2026',
        'date': '2026-01-15',
        'location': 'Sydney Opera House'
    }
    
    event2 = {
        'title': 'sydney festival 2026',
        'date': '2026-01-15',
        'location': 'Sydney Opera House'
    }
    
    event3 = {
        'title': 'Vivid Sydney',
        'date': '2026-05-22',
        'location': 'Circular Quay'
    }
    
    print("Testing Deduplication:")
    print("=" * 50)
    
    # Test hash generation
    hash1 = generate_event_hash(event1['title'], event1['date'], event1['location'])
    hash2 = generate_event_hash(event2['title'], event2['date'], event2['location'])
    hash3 = generate_event_hash(event3['title'], event3['date'], event3['location'])
    
    print(f"Event 1 Hash: {hash1}")
    print(f"Event 2 Hash: {hash2}")
    print(f"Event 3 Hash: {hash3}")
    print(f"Event 1 and 2 are duplicates: {are_events_duplicate(event1, event2)}")
    print(f"Event 1 and 3 are duplicates: {are_events_duplicate(event1, event3)}")
    print("-" * 50)
    
    # Test duplicate removal
    events = [event1, event2, event3, event1]
    print(f"\nOriginal events count: {len(events)}")
    unique = remove_duplicates(events)
    print(f"Unique events count: {len(unique)}")
