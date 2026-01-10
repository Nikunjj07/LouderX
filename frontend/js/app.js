/**
 * Main Application
 * Coordinates UI rendering and event handling
 */

let allEvents = [];
let filteredEvents = [];
let currentEvent = null;

// DOM Elements
const eventsGrid = document.getElementById('events-grid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const noResults = document.getElementById('no-results');
const eventsCount = document.getElementById('events-count');
const retryBtn = document.getElementById('retry-btn');

/**
 * Initialize the application
 */
async function init() {
    console.log('Initializing Sydney Events Aggregator...');

    // Set up event listeners
    retryBtn.addEventListener('click', loadEvents);

    // Load events
    await loadEvents();
}

/**
 * Load events from API
 */
async function loadEvents() {
    showLoading();
    hideError();

    try {
        allEvents = await APIService.getUpcomingEvents();
        filteredEvents = [...allEvents];

        console.log(`Loaded ${allEvents.length} events`);

        renderEvents(filteredEvents);
        updateEventsCount(filteredEvents.length);

        // Populate location filter
        populateLocationFilter(allEvents);

    } catch (err) {
        console.error('Failed to load events:', err);
        showError(err.message);
    } finally {
        hideLoading();
    }
}

/**
 * Render events to the grid
 */
function renderEvents(events) {
    eventsGrid.innerHTML = '';

    if (events.length === 0) {
        showNoResults();
        return;
    }

    hideNoResults();

    events.forEach(event => {
        const card = createEventCard(event);
        eventsGrid.appendChild(card);
    });
}

/**
 * Create an event card element
 */
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.eventId = event._id;

    const date = new Date(event.date);
    const formattedDate = formatDate(date);

    card.innerHTML = `
        ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="event-image" onerror="this.src='https://via.placeholder.com/400x200?text=Event+Image'">` : '<div class="event-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>'}
        <div class="event-content">
            <h3 class="event-title">${escapeHtml(event.title)}</h3>
            <div class="event-date">📅 ${formattedDate}</div>
            <div class="event-location">📍 ${escapeHtml(event.location)}</div>
            <p class="event-description">${escapeHtml(event.description)}</p>
            <div class="event-footer">
                <span class="event-source">${escapeHtml(event.source)}</span>
                <button class="event-btn" onclick="handleGetTickets('${event._id}')">Get Tickets</button>
            </div>
        </div>
    `;

    return card;
}

/**
 * Handle get tickets button click
 */
function handleGetTickets(eventId) {
    const event = allEvents.find(e => e._id === eventId);
    if (event) {
        currentEvent = event;
        openModal();
    }
}

/**
 * Format date for display
 */
function formatDate(date) {
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-AU', options);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update events count display
 */
function updateEventsCount(count) {
    const countElement = eventsCount.querySelector('.count-number');
    if (countElement) {
        countElement.textContent = count;
    }
}

/**
 * Show loading state
 */
function showLoading() {
    loading.classList.remove('hidden');
    eventsGrid.classList.add('hidden');
}

/**
 * Hide loading state
 */
function hideLoading() {
    loading.classList.add('hidden');
    eventsGrid.classList.remove('hidden');
}

/**
 * Show error state
 */
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    error.classList.remove('hidden');
    eventsGrid.classList.add('hidden');
}

/**
 * Hide error state
 */
function hideError() {
    error.classList.add('hidden');
}

/**
 * Show no results message
 */
function showNoResults() {
    noResults.classList.remove('hidden');
}

/**
 * Hide no results message
 */
function hideNoResults() {
    noResults.classList.add('hidden');
}

/**
 * Populate location filter with unique locations
 */
function populateLocationFilter(events) {
    const locationFilter = document.getElementById('location-filter');
    const locations = [...new Set(events.map(e => e.location))].sort();

    // Clear existing options (except "All Locations")
    while (locationFilter.options.length > 1) {
        locationFilter.remove(1);
    }

    // Add location options
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
