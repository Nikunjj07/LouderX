/**
 * Filters Module
 * Handles event filtering logic
 */

// DOM Elements
const searchInput = document.getElementById('search');
const dateFilter = document.getElementById('date-filter');
const locationFilter = document.getElementById('location-filter');
const resetButton = document.getElementById('reset-filters');

/**
 * Initialize filters
 */
function initFilters() {
    searchInput.addEventListener('input', handleFilterChange);
    dateFilter.addEventListener('change', handleFilterChange);
    locationFilter.addEventListener('change', handleFilterChange);
    resetButton.addEventListener('click', resetFilters);
}

/**
 * Handle filter change
 */
function handleFilterChange() {
    applyFilters();
}

/**
 * Apply all active filters
 */
function applyFilters() {
    let filtered = [...allEvents];

    // Search filter
    const searchQuery = searchInput.value.toLowerCase().trim();
    if (searchQuery) {
        filtered = filtered.filter(event =>
            event.title.toLowerCase().includes(searchQuery) ||
            event.description.toLowerCase().includes(searchQuery) ||
            event.location.toLowerCase().includes(searchQuery)
        );
    }

    // Date filter
    const dateValue = dateFilter.value;
    if (dateValue !== 'all') {
        filtered = filterByDate(filtered, dateValue);
    }

    // Location filter
    const locationValue = locationFilter.value;
    if (locationValue !== 'all') {
        filtered = filtered.filter(event => event.location === locationValue);
    }

    // Update display
    filteredEvents = filtered;
    renderEvents(filtered);
    updateEventsCount(filtered.length);
}

/**
 * Filter events by date range
 */
function filterByDate(events, dateRange) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const monthEnd = new Date(now);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    return events.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        switch (dateRange) {
            case 'today':
                return eventDate.getTime() === now.getTime();

            case 'tomorrow':
                return eventDate.getTime() === tomorrow.getTime();

            case 'this-week':
                return eventDate >= now && eventDate <= weekEnd;

            case 'this-month':
                return eventDate >= now && eventDate <= monthEnd;

            default:
                return true;
        }
    });
}

/**
 * Reset all filters
 */
function resetFilters() {
    searchInput.value = '';
    dateFilter.value = 'all';
    locationFilter.value = 'all';

    filteredEvents = [...allEvents];
    renderEvents(filteredEvents);
    updateEventsCount(filteredEvents.length);
}

// Initialize filters when module loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilters);
} else {
    initFilters();
}
