/**
 * API Service
 * Handles all API communication with the backend
 */

// Import from config
const API_BASE_URL = CONFIG.API_BASE_URL;

class APIService {
    /**
     * Fetch all events
     */
    static async getEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    /**
     * Fetch upcoming events only
     */
    static async getUpcomingEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}/events/upcoming`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch upcoming events');
            }
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            throw error;
        }
    }

    /**
     * Subscribe email for an event
     */
    static async subscribeEmail(email, eventId, consent) {
        try {
            const response = await fetch(`${API_BASE_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    eventId,
                    consent
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to subscribe');
            }

            if (data.success) {
                return data;
            } else {
                throw new Error(data.message || 'Subscription failed');
            }
        } catch (error) {
            console.error('Error subscribing email:', error);
            throw error;
        }
    }

    /**
     * Search events
     */
    static async searchEvents(query) {
        try {
            const response = await fetch(`${API_BASE_URL}/events/search?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Search failed');
            }
        } catch (error) {
            console.error('Error searching events:', error);
            throw error;
        }
    }
}
