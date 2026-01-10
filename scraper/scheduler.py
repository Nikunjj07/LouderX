"""
Automated Scraper Scheduler
Runs the scraper at regular intervals using schedule library
"""

import schedule
import time
import logging
from datetime import datetime
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from run_scraper import ScraperRunner
from cleanup_db import mark_expired_events

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper_scheduler.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


def run_scraper_job():
    """
    Job function to run the scraper.
    """
    logger.info("=" * 70)
    logger.info("SCHEDULED SCRAPER RUN")
    logger.info("=" * 70)
    
    try:
        # Run the scraper
        runner = ScraperRunner()
        runner.run()
        
        logger.info("[OK] Scraper job completed successfully")
        
        # Mark expired events
        logger.info("Running cleanup...")
        mark_expired_events()
        
        logger.info("=" * 70)
        logger.info("JOB COMPLETED")
        logger.info("=" * 70)
        
    except Exception as e:
        logger.error(f"[ERROR] Scraper job failed: {e}")
        import traceback
        logger.error(traceback.format_exc())


def run_cleanup_job():
    """
    Job function to run database cleanup.
    """
    logger.info("Running scheduled cleanup...")
    try:
        mark_expired_events()
        logger.info("[OK] Cleanup job completed")
    except Exception as e:
        logger.error(f"[ERROR] Cleanup job failed: {e}")


def main():
    """
    Main scheduler loop.
    """
    logger.info("=" * 70)
    logger.info("SCRAPER SCHEDULER STARTED")
    logger.info("=" * 70)
    logger.info(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("Schedule: Every 6 hours")
    logger.info("=" * 70)
    
    # Schedule scraper to run every 6 hours
    schedule.every(6).hours.do(run_scraper_job)
    
    # Schedule cleanup to run daily at 2 AM
    schedule.every().day.at("02:00").do(run_cleanup_job)
    
    # Run immediately on startup
    logger.info("Running initial scraper job...")
    run_scraper_job()
    
    # Keep the scheduler running
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
            
    except KeyboardInterrupt:
        logger.info("\n[STOP] Scheduler stopped by user")
    except Exception as e:
        logger.error(f"[ERROR] Scheduler crashed: {e}")
        import traceback
        logger.error(traceback.format_exc())


if __name__ == "__main__":
    main()
