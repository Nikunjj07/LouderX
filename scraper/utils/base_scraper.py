"""
Base Scraper Class
Provides common functionality for all event scrapers
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time
import random


class BaseScraper:
    """
    Base class for all event scrapers.
    Provides common methods for HTTP requests, parsing, and error handling.
    """
    
    def __init__(self, source_name, base_url):
        """
        Initialize the scraper.
        
        Args:
            source_name (str): Name of the event source
            base_url (str): Base URL of the website
        """
        self.source_name = source_name
        self.base_url = base_url
        self.session = requests.Session()
        
        # Set user agent to avoid being blocked
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        self.events = []
        self.errors = []
    
    def fetch_page(self, url, retries=3, delay=1):
        """
        Fetch a webpage with retry logic.
        
        Args:
            url (str): URL to fetch
            retries (int): Number of retries on failure
            delay (int): Delay between retries in seconds
            
        Returns:
            Response object or None on failure
        """
        for attempt in range(retries):
            try:
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                
                # Random delay to be polite
                time.sleep(random.uniform(0.5, 1.5))
                
                return response
                
            except requests.exceptions.RequestException as e:
                error_msg = f"Attempt {attempt + 1}/{retries} failed for {url}: {str(e)}"
                print(error_msg)
                self.errors.append(error_msg)
                
                if attempt < retries - 1:
                    time.sleep(delay * (attempt + 1))
                else:
                    return None
    
    def parse_html(self, html_content):
        """
        Parse HTML content using BeautifulSoup.
        
        Args:
            html_content (str): HTML content to parse
            
        Returns:
            BeautifulSoup object
        """
        return BeautifulSoup(html_content, 'lxml')
    
    def extract_text(self, element):
        """
        Safely extract text from a BeautifulSoup element.
        
        Args:
            element: BeautifulSoup element
            
        Returns:
            str: Extracted text or empty string
        """
        if element:
            return element.get_text(strip=True)
        return ""
    
    def extract_attribute(self, element, attribute):
        """
        Safely extract an attribute from a BeautifulSoup element.
        
        Args:
            element: BeautifulSoup element
            attribute (str): Attribute name
            
        Returns:
            str: Attribute value or empty string
        """
        if element and element.has_attr(attribute):
            return element[attribute]
        return ""
    
    def clean_text(self, text):
        """
        Clean and normalize text content.
        
        Args:
            text (str): Text to clean
            
        Returns:
            str: Cleaned text
        """
        if not text:
            return ""
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove special characters that might cause issues
        text = text.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ')
        
        return text.strip()
    
    def make_absolute_url(self, relative_url):
        """
        Convert a relative URL to an absolute URL.
        
        Args:
            relative_url (str): Relative or absolute URL
            
        Returns:
            str: Absolute URL
        """
        if relative_url.startswith('http'):
            return relative_url
        
        # Remove leading slash if present
        if relative_url.startswith('/'):
            relative_url = relative_url[1:]
        
        # Combine with base URL
        return f"{self.base_url.rstrip('/')}/{relative_url}"
    
    def create_event(self, title, date, location, description, image_url, ticket_url):
        """
        Create a standardized event dictionary.
        
        Args:
            title (str): Event title
            date (datetime): Event date
            location (str): Event location
            description (str): Event description
            image_url (str): Event image URL
            ticket_url (str): Ticket purchase URL
            
        Returns:
            dict: Standardized event dictionary
        """
        return {
            'title': self.clean_text(title),
            'date': date,
            'location': self.clean_text(location),
            'description': self.clean_text(description),
            'image_url': self.make_absolute_url(image_url) if image_url else "",
            'ticket_url': self.make_absolute_url(ticket_url) if ticket_url else "",
            'source': self.source_name,
            'is_active': True,
            'last_updated': datetime.now()
        }
    
    def add_event(self, event):
        """
        Add an event to the events list.
        
        Args:
            event (dict): Event dictionary
        """
        self.events.append(event)
    
    def scrape(self):
        """
        Main scraping method.
        Must be implemented by subclasses.
        
        Returns:
            list: List of scraped events
        """
        raise NotImplementedError("Subclasses must implement scrape() method")
    
    def get_events(self):
        """
        Get the scraped events.
        
        Returns:
            list: List of events
        """
        return self.events
    
    def get_errors(self):
        """
        Get the errors encountered during scraping.
        
        Returns:
            list: List of error messages
        """
        return self.errors
    
    def print_summary(self):
        """
        Print a summary of the scraping session.
        """
        print("\n" + "=" * 60)
        print(f"Scraping Summary for {self.source_name}")
        print("=" * 60)
        print(f"Events scraped: {len(self.events)}")
        print(f"Errors encountered: {len(self.errors)}")
        
        if self.errors:
            print("\nErrors:")
            for error in self.errors:
                print(f"  - {error}")
        
        print("=" * 60 + "\n")


# Example usage
if __name__ == "__main__":
    # This is just a base class, cannot be used directly
    print("BaseScraper is a base class. Create a subclass to use it.")
    print("Example:")
    print("""
    class SydneyEventsScraper(BaseScraper):
        def __init__(self):
            super().__init__('example.com', 'https://example.com')
        
        def scrape(self):
            # Implementation here
            pass
    """)
