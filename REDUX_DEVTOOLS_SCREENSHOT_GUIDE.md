# Redux DevTools Screenshot Guide

This guide explains how to capture Redux DevTools screenshots showing state changes for your Lab 2 report.

---

## Prerequisites

1. **Redux DevTools Extension**: Install in your browser
   - Chrome: [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
   - Firefox: [Redux DevTools Extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

2. **Application Running**: Make sure your frontend is running
   ```bash
   docker-compose up frontend
   # Or if running locally: npm start
   ```

3. **Access Application**: Open `http://localhost:3000` in your browser

---

## How to Open Redux DevTools

### Method 1: Browser Extension (Recommended)
1. Open your browser (Chrome/Firefox)
2. Look for the Redux DevTools icon in your browser toolbar
3. Click the icon to open the DevTools panel
4. The panel will appear at the bottom or side of your browser

### Method 2: Keyboard Shortcut
- **Chrome**: `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac) → Click "Redux" tab
- **Firefox**: `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac) → Click "Redux" tab

### Method 3: Right-Click Menu
- Right-click anywhere on the page
- Select "Inspect" or "Inspect Element"
- Navigate to the "Redux" tab in DevTools

---

## Screenshot Scenarios

### 1. Authentication Flow: Login → Redux Stores JWT

**Steps to Capture:**

1. **Before Login (Initial State)**
   - Open Redux DevTools
   - Navigate to "State" tab
   - Expand `auth` slice
   - Take screenshot showing:
     - `user: null`
     - `token: null`
     - `isAuthenticated: false`

2. **Perform Login**
   - Go to login page
   - Enter credentials and click "Login"

3. **After Login (Updated State)**
   - In Redux DevTools, you'll see a new action dispatched: `auth/login/fulfilled`
   - Click on the action in the "Action" tab
   - Take screenshot showing:
     - Action: `auth/login/fulfilled`
     - State diff showing:
       - `user: { id, name, email, userType: 'traveler' }`
       - `token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
       - `isAuthenticated: true`

4. **State Tab After Login**
   - Navigate to "State" tab
   - Expand `auth` slice
   - Take screenshot showing the complete auth state with user data and token

**What to Show in Screenshot:**
- Redux DevTools panel open
- Action list showing `auth/login/fulfilled`
- State diff highlighting the changes
- Final state showing `user` object and `token` string

---

### 2. Property Search Flow: Search → Redux Stores Results

**Steps to Capture:**

1. **Before Search (Initial State)**
   - Open Redux DevTools
   - Navigate to "State" tab
   - Expand `property` slice
   - Take screenshot showing:
     - `properties: []` (empty array)
     - `loading: false`
     - `searchResults: []`

2. **Perform Search**
   - Go to search page or use search bar
   - Enter search criteria (e.g., city, dates)
   - Click "Search"

3. **During Search (Loading State)**
   - In Redux DevTools, you'll see: `property/fetchProperties/pending`
   - Take screenshot showing:
     - Action: `property/fetchProperties/pending`
     - State: `loading: true`

4. **After Search (Results Stored)**
   - In Redux DevTools, you'll see: `property/fetchProperties/fulfilled`
   - Click on the action
   - Take screenshot showing:
     - Action: `property/fetchProperties/fulfilled`
     - State diff showing:
       - `properties: [array of property objects]`
       - `searchResults: [filtered results]`
       - `loading: false`

5. **State Tab After Search**
   - Navigate to "State" tab
   - Expand `property` slice
   - Expand `properties` array
   - Take screenshot showing multiple property objects stored in Redux

**What to Show in Screenshot:**
- Action list showing `property/fetchProperties/fulfilled`
- State diff showing properties array populated
- Final state showing properties with details (name, price, location, etc.)

---

### 3. Booking Process Flow: Create Booking → Redux Updates Booking State

**Steps to Capture:**

1. **Before Booking (Initial State)**
   - Open Redux DevTools
   - Navigate to "State" tab
   - Expand `booking` slice
   - Take screenshot showing:
     - `bookings: []` (empty array)
     - `loading: false`
     - `currentBooking: null`

2. **Navigate to Property**
   - Go to a property details page
   - Select dates and guests
   - Click "Reserve" or "Book Now"

3. **During Booking Creation (Loading State)**
   - In Redux DevTools, you'll see: `booking/createBooking/pending`
   - Take screenshot showing:
     - Action: `booking/createBooking/pending`
     - State: `loading: true`

4. **After Booking Created (State Updated)**
   - In Redux DevTools, you'll see: `booking/createBooking/fulfilled`
   - Click on the action
   - Take screenshot showing:
     - Action: `booking/createBooking/fulfilled`
     - State diff showing:
       - `bookings: [new booking object added]`
       - `currentBooking: { booking details }`
       - `loading: false`

5. **State Tab After Booking**
   - Navigate to "State" tab
   - Expand `booking` slice
   - Expand `bookings` array
   - Take screenshot showing the booking object with:
     - `propertyId`
     - `startDate`, `endDate`
     - `guests`, `totalPrice`
     - `status: 'PENDING'`

6. **Booking Status Update (Optional - if owner accepts)**
   - If owner accepts booking, you'll see: `booking/updateBookingStatus/fulfilled`
   - Take screenshot showing status change from `PENDING` to `ACCEPTED`

**What to Show in Screenshot:**
- Action list showing `booking/createBooking/fulfilled`
- State diff showing new booking added to array
- Final state showing booking details
- Optional: Status update action showing state change

---

## Best Practices for Screenshots

### 1. Clear and Readable
- Zoom in if needed to make text readable
- Use browser zoom (Ctrl/Cmd + Plus) if text is too small
- Ensure Redux DevTools panel is fully visible

### 2. Show Relevant Information
- **Action Tab**: Show the action name and payload
- **State Tab**: Show the relevant slice (auth/property/booking)
- **Diff Tab**: Highlight what changed (if available)

### 3. Multiple Angles
- Take screenshots from different tabs:
  - **Action List**: Shows the sequence of actions
  - **State**: Shows the current state
  - **Diff**: Shows what changed (if your DevTools supports it)

### 4. Include Context
- Show the browser URL in the screenshot (to show which page you're on)
- Include the action timestamp if visible
- Show the action payload/state clearly

---

## Step-by-Step: Taking Your First Screenshot

### Example: Login Flow Screenshot

1. **Open Application**
   ```
   http://localhost:3000
   ```

2. **Open Redux DevTools**
   - Click Redux DevTools icon in browser toolbar
   - Or press `Ctrl+Shift+I` → Click "Redux" tab

3. **Clear Previous Actions (Optional)**
   - Click the "Clear" button in Redux DevTools
   - This gives you a clean slate

4. **Navigate to Login Page**
   - Go to `/login` or click "Login" button

5. **Watch for Actions**
   - As you interact, you'll see actions appear in the left panel
   - Actions appear in chronological order

6. **Perform Login**
   - Enter email and password
   - Click "Login" button

7. **Capture Screenshot**
   - You'll see `auth/login/pending` appear
   - Then `auth/login/fulfilled` appears
   - Click on `auth/login/fulfilled`
   - The right panel shows:
     - **Action**: The action details
     - **State**: The state after this action
     - **Diff**: What changed (if available)

8. **Take Screenshot**
   - Use Windows Snipping Tool, or
   - Press `Windows + Shift + S` (Windows), or
   - Press `Cmd + Shift + 4` (Mac)
   - Capture the entire Redux DevTools panel

9. **Verify Screenshot**
   - Make sure you can see:
     - Action name: `auth/login/fulfilled`
     - State showing `user` object
     - State showing `token` string
     - `isAuthenticated: true`

---

## Screenshot Checklist

For each flow, capture:

### Authentication Flow ✅
- [ ] Initial state (no user, no token)
- [ ] Action: `auth/login/pending`
- [ ] Action: `auth/login/fulfilled`
- [ ] Final state (user object, token, isAuthenticated: true)

### Property Search Flow ✅
- [ ] Initial state (empty properties array)
- [ ] Action: `property/fetchProperties/pending`
- [ ] Action: `property/fetchProperties/fulfilled`
- [ ] Final state (properties array populated with search results)

### Booking Process Flow ✅
- [ ] Initial state (empty bookings array)
- [ ] Action: `booking/createBooking/pending`
- [ ] Action: `booking/createBooking/fulfilled`
- [ ] Final state (booking added to bookings array)
- [ ] Optional: Status update action (if owner accepts)

---

## Troubleshooting

### Redux DevTools Not Showing Actions

**Problem**: No actions appear in DevTools

**Solutions**:
1. Check if Redux DevTools extension is installed and enabled
2. Refresh the page
3. Check browser console for errors
4. Verify Redux store is configured with DevTools:
   ```javascript
   // frontend/src/store/store.js should have:
   devTools: process.env.NODE_ENV !== 'production'
   ```

### DevTools Panel Not Visible

**Problem**: Can't find Redux DevTools panel

**Solutions**:
1. Check browser toolbar for Redux icon
2. Try keyboard shortcut: `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac)
3. Look for "Redux" tab in browser DevTools
4. Try right-click → Inspect → Redux tab

### Actions Not Dispatching

**Problem**: Actions don't appear when you interact

**Solutions**:
1. Check if components are using Redux hooks:
   ```javascript
   import { useAppDispatch, useAppSelector } from '../store/hooks';
   ```
2. Verify actions are being dispatched:
   ```javascript
   const dispatch = useAppDispatch();
   dispatch(loginUser({ email, password }));
   ```
3. Check browser console for errors

---

## Example Screenshot Descriptions for Report

### Screenshot 1: Authentication - Login Success
**Caption**: "Redux DevTools showing authentication flow. After traveler logs in, the `auth/login/fulfilled` action dispatches, storing the JWT token and user data in Redux state. The state shows `isAuthenticated: true`, `user` object with traveler details, and `token` containing the JWT."

### Screenshot 2: Property Search - Results Stored
**Caption**: "Redux DevTools showing property search flow. When a traveler searches for properties, the `property/fetchProperties/fulfilled` action dispatches, storing the search results in Redux. The state shows the `properties` array populated with property objects containing details like name, price, location, and images."

### Screenshot 3: Booking Creation - State Updated
**Caption**: "Redux DevTools showing booking creation flow. When a traveler creates a booking, the `booking/createBooking/fulfilled` action dispatches, adding the new booking to the Redux state. The state shows the booking object with property details, dates, guests, total price, and status set to 'PENDING'."

---

## Quick Reference: Redux Actions in Your App

### Auth Actions
- `auth/login/pending` - Login request started
- `auth/login/fulfilled` - Login successful (stores JWT)
- `auth/login/rejected` - Login failed
- `auth/logout` - User logged out
- `auth/checkStatus` - Check if user is authenticated

### Property Actions
- `property/fetchProperties/pending` - Fetching properties
- `property/fetchProperties/fulfilled` - Properties loaded (stores results)
- `property/fetchProperties/rejected` - Fetch failed
- `property/fetchPropertyById/fulfilled` - Single property loaded

### Booking Actions
- `booking/createBooking/pending` - Creating booking
- `booking/createBooking/fulfilled` - Booking created (updates state)
- `booking/createBooking/rejected` - Booking failed
- `booking/fetchBookings/fulfilled` - Bookings loaded
- `booking/updateBookingStatus/fulfilled` - Status updated (e.g., ACCEPTED)

---

## Tips for Great Screenshots

1. **Use Full Screen**: Make Redux DevTools panel large enough to see details
2. **Highlight Changes**: Use the Diff view if available to show what changed
3. **Show Sequence**: Capture multiple actions in sequence to show the flow
4. **Include Timestamps**: If visible, include action timestamps
5. **Clear Labels**: Make sure action names and state keys are clearly visible
6. **Multiple Views**: Take screenshots from both Action and State tabs

---

## Ready to Capture?

1. ✅ Install Redux DevTools extension
2. ✅ Start your application
3. ✅ Open Redux DevTools
4. ✅ Follow the scenarios above
5. ✅ Take screenshots
6. ✅ Add to your report!

Good luck with your report! 🎉

