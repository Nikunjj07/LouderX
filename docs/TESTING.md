# Frontend Testing Guide

## Prerequisites

1. **Backend server running**: Start the backend API server
   ```bash
   cd backend
   npm run dev
   ```

2. **MongoDB running**: Ensure MongoDB is running with seeded data
   ```bash
   cd backend
   npm run seed
   ```

3. **Frontend server running**: Start the frontend
   ```bash
   cd frontend
   npm start
   ```

## Test Scenarios

### 1. Page Load Test
- **Action**: Open `http://localhost:3000`
- **Expected**: 
  - Page loads with header and filters
  - Loading spinner shows briefly
  - Events display in grid layout
  - Events count shows correct number

### 2. Event Display Test
- **Action**: Verify event cards display correctly
- **Expected**:
  - Each card shows: title, date, location, description
  - Images load (or placeholder shown)
  - Source tag visible
  - "Get Tickets" button present

### 3. Search Filter Test
- **Action**: Type "festival" in search box
- **Expected**:
  - Events filter in real-time
  - Only matching events shown
  - Event count updates

### 4. Date Filter Test
- **Action**: Select "This Week" from date filter
- **Expected**:
  - Only events within next 7 days shown
  - Event count updates

### 5. Location Filter Test
- **Action**: Select a location from dropdown
- **Expected**:
  - Only events at that location shown
  - Event count updates

### 6. Reset Filters Test
- **Action**: Apply filters, then click "Reset Filters"
- **Expected**:
  - All filters clear
  - All events shown again

### 7. Email Modal Test
- **Action**: Click "Get Tickets" on any event
- **Expected**:
  - Modal opens with email form
  - Background darkens
  - Form has email input and consent checkbox

### 8. Email Validation Test
- **Action**: Submit form with invalid email
- **Expected**:
  - Error message shows
  - Form doesn't submit

### 9. Consent Validation Test
- **Action**: Enter email but don't check consent
- **Expected**:
  - Error message shows
  - Form doesn't submit

### 10. Successful Subscription Test
- **Action**: Enter valid email, check consent, submit
- **Expected**:
  - Loading state shows on button
  - Modal closes
  - Ticket URL opens in new tab (if available)

### 11. Modal Close Test
- **Action**: Click X button or overlay
- **Expected**:
  - Modal closes
  - Form resets

### 12. Error Handling Test
- **Action**: Stop backend server, refresh page
- **Expected**:
  - Error message displays
  - "Retry" button visible
  - Clicking retry attempts to reload

### 13. No Results Test
- **Action**: Search for "nonexistent"
- **Expected**:
  - "No events found" message shows
  - Suggestion to adjust filters

### 14. Responsive Design Test
- **Action**: Resize browser window
- **Expected**:
  - Mobile: Events stack vertically, filters stack
  - Tablet: 2 columns for events
  - Desktop: 3+ columns for events

## API Integration Verification

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Verify:
   - GET `/api/events/upcoming` - Status 200
   - Response contains event data
   - No CORS errors

### Check Console
1. Open Console tab
2. Verify:
   - No JavaScript errors
   - "Initializing Sydney Events Aggregator..." message
   - "Loaded X events" message

## Database Verification

After email subscription:
1. Check MongoDB database
2. Verify email record in `emails` collection
3. Check fields: email, eventId, consent, timestamp

## Common Issues

### Events not loading
- Check backend server is running on port 5000
- Verify `API_BASE_URL` in `api.js` is correct
- Check MongoDB has events (run `npm run seed`)

### CORS errors
- Ensure backend has CORS enabled
- Check `FRONTEND_URL` in backend `.env` file

### Modal not working
- Check for JavaScript errors in console
- Verify all modal DOM elements exist

### Filters not working
- Check `filteredEvents` and `allEvents` in console
- Verify filter event listeners attached

## Performance Testing

### Load Time
- Page should load in < 2 seconds
- Event rendering should complete in < 500ms

### Interaction
- Filters should respond instantly (< 100ms)
- Modal open/close should be smooth

## Browser Compatibility

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Success Criteria

All tests pass:
- Page loads and displays events
- Filters work correctly
- Email modal validates and submits
- Redirect to tickets works
- Error states show appropriately
- Responsive on all screen sizes
