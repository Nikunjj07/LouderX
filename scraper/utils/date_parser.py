"""
Date Parser Utility
Handles parsing and normalization of dates from various event websites
"""

from dateutil import parser
from datetime import datetime, timedelta
import re


def parse_event_date(date_string):
    """
    Parse a date string from various formats into a standardized datetime object.
    
    Args:
        date_string (str): Date string in various formats
        
    Returns:
        datetime: Parsed datetime object or None if parsing fails
    """
    if not date_string:
        return None
    
    try:
        # Clean the string
        date_string = date_string.strip()
        
        # Try using dateutil parser first (handles most formats)
        parsed_date = parser.parse(date_string, fuzzy=True)
        return parsed_date
        
    except (ValueError, TypeError) as e:
        print(f"Failed to parse date: {date_string} - {str(e)}")
        return None


def parse_relative_date(relative_string):
    """
    Parse relative date strings like "Tomorrow", "Next Friday", etc.
    
    Args:
        relative_string (str): Relative date string
        
    Returns:
        datetime: Calculated datetime object
    """
    relative_string = relative_string.lower().strip()
    today = datetime.now()
    
    # Today
    if 'today' in relative_string:
        return today
    
    # Tomorrow
    if 'tomorrow' in relative_string:
        return today + timedelta(days=1)
    
    # This weekend (Saturday)
    if 'this weekend' in relative_string:
        days_until_saturday = (5 - today.weekday()) % 7
        return today + timedelta(days=days_until_saturday)
    
    # Next week
    if 'next week' in relative_string:
        return today + timedelta(weeks=1)
    
    # Next month
    if 'next month' in relative_string:
        return today + timedelta(days=30)
    
    return None


def extract_time_from_string(text):
    """
    Extract time from a text string.
    
    Args:
        text (str): Text containing time information
        
    Returns:
        str: Extracted time string or None
    """
    # Pattern for time formats like "7:00 PM", "19:00", "7pm"
    time_patterns = [
        r'\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)',
        r'\d{1,2}:\d{2}',
        r'\d{1,2}\s*(?:AM|PM|am|pm)'
    ]
    
    for pattern in time_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None


def combine_date_and_time(date_obj, time_string):
    """
    Combine a date object with a time string.
    
    Args:
        date_obj (datetime): Date object
        time_string (str): Time string (e.g., "7:00 PM")
        
    Returns:
        datetime: Combined datetime object
    """
    if not time_string:
        return date_obj
    
    try:
        # Parse the time string
        time_obj = parser.parse(time_string).time()
        
        # Combine date and time
        combined = datetime.combine(date_obj.date(), time_obj)
        return combined
        
    except (ValueError, TypeError):
        return date_obj


def normalize_date_format(date_obj):
    """
    Normalize a datetime object to ISO format string.
    
    Args:
        date_obj (datetime): Datetime object
        
    Returns:
        str: ISO format date string
    """
    if not date_obj:
        return None
    
    return date_obj.isoformat()


def is_past_date(date_obj):
    """
    Check if a date is in the past.
    
    Args:
        date_obj (datetime): Datetime object to check
        
    Returns:
        bool: True if date is in the past
    """
    if not date_obj:
        return False
    
    return date_obj < datetime.now()


def get_date_range(start_date_str, end_date_str=None):
    """
    Parse a date range from strings.
    
    Args:
        start_date_str (str): Start date string
        end_date_str (str, optional): End date string
        
    Returns:
        tuple: (start_datetime, end_datetime)
    """
    start_date = parse_event_date(start_date_str)
    end_date = parse_event_date(end_date_str) if end_date_str else start_date
    
    return (start_date, end_date)


# Example usage and testing
if __name__ == "__main__":
    # Test various date formats
    test_dates = [
        "2026-01-15",
        "15 January 2026",
        "Jan 15, 2026",
        "15/01/2026",
        "January 15th, 2026 at 7:00 PM",
        "Tomorrow",
        "Next Friday"
    ]
    
    print("Testing Date Parser:")
    print("=" * 50)
    
    for date_str in test_dates:
        parsed = parse_event_date(date_str)
        if parsed:
            print(f"Input: {date_str}")
            print(f"Parsed: {parsed}")
            print(f"ISO Format: {normalize_date_format(parsed)}")
            print("-" * 50)
