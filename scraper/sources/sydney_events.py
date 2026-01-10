"""
Sydney Events Scraper
Scrapes events from various Sydney event websites
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.base_scraper import BaseScraper
from utils.date_parser import parse_event_date, normalize_date_format
from utils.deduplicate import add_hash_to_event
from datetime import datetime, timedelta


class TimeOutScraper(BaseScraper):
    """
    Scraper for Time Out Sydney events.
    Note: This is a demo scraper with placeholder logic.
    Real implementation would need to analyze the actual website structure.
    """
    
    def __init__(self):
        super().__init__(
            source_name='timeout.com/sydney',
            base_url='https://www.timeout.com/sydney'
        )
    
    def scrape(self):
        """
        Scrape events from Time Out Sydney.
        
        Returns:
            list: List of scraped events
        """
        print(f"Scraping events from {self.source_name}...")
        
        # In a real implementation, this would fetch and parse the actual website
        # For demo purposes, we'll create sample events
        
        sample_events = self._create_demo_events()
        
        for event_data in sample_events:
            event = self.create_event(
                title=event_data['title'],
                date=event_data['date'],
                location=event_data['location'],
                description=event_data['description'],
                image_url=event_data['image_url'],
                ticket_url=event_data['ticket_url']
            )
            
            # Add hash for duplicate detection
            event = add_hash_to_event(event)
            
            self.add_event(event)
        
        self.print_summary()
        return self.events
    
    def _create_demo_events(self):
        """
        Create demo events for testing.
        In production, this would be replaced with actual web scraping logic.
        """
        return [
            {
                'title': 'Harbour Lights Festival',
                'date': datetime.now() + timedelta(days=10),
                'location': 'Sydney Harbour',
                'description': 'Experience stunning light installations and waterfront performances across Sydney Harbour.',
                'image_url': 'https://example.com/harbour-lights.jpg',
                'ticket_url': 'https://www.timeout.com/sydney/harbour-lights'
            },
            {
                'title': 'Jazz Night at The Basement',
                'date': datetime.now() + timedelta(days=5),
                'location': 'The Basement, Circular Quay',
                'description': 'Live jazz performances featuring local and international artists.',
                'image_url': 'https://example.com/jazz-night.jpg',
                'ticket_url': 'https://www.timeout.com/sydney/jazz-night'
            }
        ]


class EventbriteSydneyScraper(BaseScraper):
    """
    Scraper for Eventbrite Sydney events.
    Note: This is a demo scraper with placeholder logic.
    """
    
    def __init__(self):
        super().__init__(
            source_name='eventbrite.com.au/sydney',
            base_url='https://www.eventbrite.com.au'
        )
    
    def scrape(self):
        """
        Scrape events from Eventbrite Sydney.
        
        Returns:
            list: List of scraped events
        """
        print(f"Scraping events from {self.source_name}...")
        
        sample_events = self._create_demo_events()
        
        for event_data in sample_events:
            event = self.create_event(
                title=event_data['title'],
                date=event_data['date'],
                location=event_data['location'],
                description=event_data['description'],
                image_url=event_data['image_url'],
                ticket_url=event_data['ticket_url']
            )
            
            event = add_hash_to_event(event)
            self.add_event(event)
        
        self.print_summary()
        return self.events
    
    def _create_demo_events(self):
        """Create demo events for testing."""
        return [
            {
                'title': 'Sydney Tech Meetup',
                'date': datetime.now() + timedelta(days=7),
                'location': 'Stone & Chalk, Sydney',
                'description': 'Monthly meetup for tech enthusiasts and startups in Sydney.',
                'image_url': 'https://example.com/tech-meetup.jpg',
                'ticket_url': 'https://www.eventbrite.com.au/tech-meetup'
            },
            {
                'title': 'Food & Wine Festival',
                'date': datetime.now() + timedelta(days=20),
                'location': 'Darling Harbour',
                'description': 'Sample the best of Sydney\'s culinary scene with local chefs and wineries.',
                'image_url': 'https://example.com/food-wine.jpg',
                'ticket_url': 'https://www.eventbrite.com.au/food-wine'
            }
        ]


class WhatsonScraper(BaseScraper):
    """
    Scraper for What's On Sydney events.
    Note: This is a demo scraper with placeholder logic.
    """
    
    def __init__(self):
        super().__init__(
            source_name='whatson.cityofsydney.nsw.gov.au',
            base_url='https://whatson.cityofsydney.nsw.gov.au'
        )
    
    def scrape(self):
        """
        Scrape events from What's On Sydney.
        
        Returns:
            list: List of scraped events
        """
        print(f"Scraping events from {self.source_name}...")
        
        sample_events = self._create_demo_events()
        
        for event_data in sample_events:
            event = self.create_event(
                title=event_data['title'],
                date=event_data['date'],
                location=event_data['location'],
                description=event_data['description'],
                image_url=event_data['image_url'],
                ticket_url=event_data['ticket_url']
            )
            
            event = add_hash_to_event(event)
            self.add_event(event)
        
        self.print_summary()
        return self.events
    
    def _create_demo_events(self):
        """Create demo events for testing."""
        return [
            {
                'title': 'Art After Dark',
                'date': datetime.now() + timedelta(days=3),
                'location': 'Art Gallery of NSW',
                'description': 'Late-night gallery tours with live music and drinks.',
                'image_url': 'https://example.com/art-dark.jpg',
                'ticket_url': 'https://whatson.cityofsydney.nsw.gov.au/art-dark'
            }
        ]


# Example usage
if __name__ == "__main__":
    print("Sydney Events Scraper Demo\n")
    
    # Create scrapers
    scrapers = [
        TimeOutScraper(),
        EventbriteSydneyScraper(),
        WhatsonScraper()
    ]
    
    # Scrape all sources
    all_events = []
    for scraper in scrapers:
        events = scraper.scrape()
        all_events.extend(events)
    
    # Print summary
    print(f"\nTotal events scraped: {len(all_events)}")
    print("\nSample events:")
    for i, event in enumerate(all_events[:3], 1):
        print(f"\n{i}. {event['title']}")
        print(f"   Date: {event['date']}")
        print(f"   Location: {event['location']}")
        print(f"   Source: {event['source']}")
