# 🧪 DishRated Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
- Backend running on: http://localhost:5000
- Frontend running on: http://localhost:8080

## 📱 Frontend Testing

### 1. **Homepage Testing**
1. Open http://localhost:8080
2. ✅ Check if the page loads properly
3. ✅ Verify "Nearby Trucks" section shows real data
4. ✅ Check "Trending Trucks" section displays trucks
5. ✅ Test "Upcoming Events" section

### 2. **Interactive Map Testing**
1. Navigate to the map section
2. ✅ Verify OpenStreetMap loads (not Google Maps)
3. ✅ Check truck markers appear on map
4. ✅ Click on truck markers to see popups
5. ✅ Test "View Details" button in popups
6. ✅ Verify truck count display in top-right corner

### 3. **Search & Filter Testing**
1. Use search bar to find trucks
2. ✅ Search by cuisine (e.g., "Indian", "Chinese")
3. ✅ Filter by status (Open/Closed)
4. ✅ Test location-based search

### 4. **Mobile Responsiveness**
1. Resize browser window to mobile size
2. ✅ Check if layout adapts properly
3. ✅ Test map view/list view toggle
4. ✅ Verify touch interactions work

## 🔧 Backend API Testing

### 1. **Health Check**
```bash
curl http://localhost:5000/api/health
```
Expected: `{"success": true, "message": "Server is running"}`

### 2. **Food Trucks API**
```bash
# Get all trucks
curl http://localhost:5000/api/trucks

# Get nearby trucks
curl "http://localhost:5000/api/trucks/nearby?lat=20.3538431&lng=85.8169059&maxDistance=10"

# Get trending trucks
curl http://localhost:5000/api/trucks/trending

# Search trucks
curl "http://localhost:5000/api/trucks?search=roll&cuisine=North Indian"
```

### 3. **Events API**
```bash
# Get all events
curl http://localhost:5000/api/events

# Get upcoming events
curl http://localhost:5000/api/events/upcoming
```

### 4. **Authentication Testing**
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"user"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🗺️ Map Integration Testing

### 1. **OpenStreetMap Verification**
1. Open browser developer tools (F12)
2. Go to Network tab
3. Refresh the page
4. ✅ Look for requests to `tile.openstreetmap.org` (NOT Google Maps)
5. ✅ Verify no Google Maps API calls

### 2. **Map Functionality**
1. ✅ Map loads without errors
2. ✅ Truck markers are visible
3. ✅ Clicking markers shows popups
4. ✅ Zoom controls work
5. ✅ Map is interactive (pan, zoom)

## 🔄 Real-time Data Testing

### 1. **Database Integration**
1. ✅ Trucks display real data from MongoDB
2. ✅ Events show actual event information
3. ✅ User registration creates database entries

### 2. **Location Services**
1. ✅ Nearby trucks based on coordinates
2. ✅ Distance calculations work
3. ✅ Location-based filtering functions

## 🛡️ Security Testing

### 1. **Authentication**
1. ✅ Protected routes require login
2. ✅ JWT tokens are generated
3. ✅ Invalid credentials are rejected

### 2. **Data Validation**
1. ✅ Invalid email formats rejected
2. ✅ Short passwords rejected
3. ✅ Required fields validated

## 📊 Performance Testing

### 1. **Load Time**
1. ✅ Homepage loads under 3 seconds
2. ✅ API responses under 1 second
3. ✅ Map renders quickly

### 2. **Concurrent Requests**
1. ✅ Multiple API calls work simultaneously
2. ✅ No blocking or timeouts

## 🐛 Error Handling Testing

### 1. **Invalid Requests**
```bash
# Test 404 error
curl http://localhost:5000/api/trucks/invalid-id

# Test unauthorized access
curl http://localhost:5000/api/auth/me
```

### 2. **Frontend Error States**
1. ✅ Loading states display properly
2. ✅ Error messages show when API fails
3. ✅ Graceful fallbacks for missing data

## ✅ Success Criteria

### Frontend ✅
- [ ] Homepage loads successfully
- [ ] OpenStreetMap displays (not Google Maps)
- [ ] Truck markers appear on map
- [ ] Popups show truck details
- [ ] Search and filtering work
- [ ] Mobile responsive design

### Backend ✅
- [ ] All API endpoints respond correctly
- [ ] Database integration working
- [ ] Authentication system functional
- [ ] Real data displayed
- [ ] Error handling implemented

### Integration ✅
- [ ] Frontend connects to backend
- [ ] Real-time data flow
- [ ] Map shows actual truck locations
- [ ] CORS configured properly
- [ ] No console errors

## 🚨 Common Issues & Solutions

### Map Not Loading
- Check browser console for errors
- Verify Leaflet CSS is loaded
- Ensure no ad blockers blocking map tiles

### API Errors
- Verify backend is running on port 5000
- Check MongoDB connection
- Ensure CORS is configured

### Data Not Showing
- Check network tab for API calls
- Verify database has seed data
- Check for JavaScript errors

## 🎯 Next Steps After Testing

1. ✅ Verify all tests pass
2. 🚀 Deploy to production
3. 📱 Test on real mobile devices
4. 🔧 Monitor performance
5. 📊 Gather user feedback
