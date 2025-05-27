# DishRated API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Test Accounts
```
User: john@example.com / password123
Owner: jane@example.com / password123  
Admin: admin@dishrated.com / admin123
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "user", // optional: "user", "owner"
  "phone": "+1234567890" // optional
}
```

### Login User
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User Profile
**GET** `/auth/me`
*Requires authentication*

### Update User Profile
**PUT** `/auth/me`
*Requires authentication*

**Body:**
```json
{
  "name": "Updated Name",
  "phone": "+1234567890",
  "preferences": {
    "cuisines": ["North Indian", "Chinese"],
    "maxDistance": 10,
    "priceRange": "mid"
  }
}
```

---

## Food Truck Endpoints

### Get All Food Trucks
**GET** `/trucks`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- `cuisine` - Filter by cuisine type
- `status` - Filter by status (open/closed/opening-soon)
- `featured` - Filter featured trucks (true/false)
- `priceRange` - Filter by price range (budget/mid/premium)
- `lat` - Latitude for distance calculation
- `lng` - Longitude for distance calculation
- `maxDistance` - Maximum distance in km

**Example:**
```
GET /trucks?search=roll&cuisine=North Indian&lat=20.3538431&lng=85.8169059&maxDistance=10
```

### Get Single Food Truck
**GET** `/trucks/:id`

### Get Nearby Food Trucks
**GET** `/trucks/nearby`

**Query Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)
- `maxDistance` - Maximum distance in km (default: 10)

### Get Trending Food Trucks
**GET** `/trucks/trending`

**Query Parameters:**
- `limit` - Number of trucks to return (default: 10)

### Create Food Truck
**POST** `/trucks`
*Requires authentication (Owner/Admin)*

**Body:**
```json
{
  "name": "My Food Truck",
  "description": "Delicious food on wheels",
  "image": "https://example.com/image.jpg",
  "cuisine": "North Indian",
  "location": {
    "address": "123 Main St, City",
    "coordinates": {
      "latitude": 20.3538431,
      "longitude": 85.8169059
    }
  },
  "priceRange": "mid",
  "tags": ["spicy", "vegetarian"]
}
```

### Update Food Truck
**PUT** `/trucks/:id`
*Requires authentication (Owner/Admin)*

### Delete Food Truck
**DELETE** `/trucks/:id`
*Requires authentication (Owner/Admin)*

---

## Menu Endpoints

### Get Food Truck Menu
**GET** `/trucks/:truckId/menu`

### Add Menu Item
**POST** `/trucks/:truckId/menu`
*Requires authentication (Owner/Admin)*

**Body:**
```json
{
  "menuItem": {
    "name": "Chicken Roll",
    "description": "Spicy chicken wrapped in paratha",
    "price": 120,
    "category": "Rolls",
    "image": "https://example.com/image.jpg",
    "isAvailable": true,
    "allergens": ["gluten"],
    "isVegetarian": false,
    "isVegan": false
  }
}
```

### Update Menu Item
**PUT** `/trucks/:truckId/menu/:itemId`
*Requires authentication (Owner/Admin)*

### Delete Menu Item
**DELETE** `/trucks/:truckId/menu/:itemId`
*Requires authentication (Owner/Admin)*

### Toggle Menu Item Availability
**PATCH** `/trucks/:truckId/menu/:itemId/toggle`
*Requires authentication (Owner/Admin)*

---

## Event Endpoints

### Get All Events
**GET** `/events`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search term
- `status` - Filter by status
- `upcoming` - Show only upcoming events (true/false)

### Get Single Event
**GET** `/events/:id`

### Get Upcoming Events
**GET** `/events/upcoming`

**Query Parameters:**
- `limit` - Number of events to return (default: 10)

### Create Event
**POST** `/events`
*Requires authentication (Owner/Admin)*

**Body:**
```json
{
  "title": "Food Festival",
  "description": "A celebration of diverse cuisines",
  "image": "https://example.com/image.jpg",
  "date": "2025-12-25T10:00:00Z",
  "location": {
    "address": "Event Ground, City",
    "coordinates": {
      "latitude": 20.2961,
      "longitude": 85.8245
    }
  },
  "maxTrucks": 20,
  "registrationDeadline": "2025-12-20T23:59:59Z"
}
```

### Update Event
**PUT** `/events/:id`
*Requires authentication (Organizer/Admin)*

### Delete Event
**DELETE** `/events/:id`
*Requires authentication (Organizer/Admin)*

### Register Food Truck for Event
**POST** `/events/:id/register`
*Requires authentication (Owner)*

**Body:**
```json
{
  "truckId": "truck_id_here"
}
```

### Unregister Food Truck from Event
**DELETE** `/events/:id/unregister`
*Requires authentication (Owner)*

**Body:**
```json
{
  "truckId": "truck_id_here"
}
```

---

## Review Endpoints

### Get Reviews for Food Truck
**GET** `/reviews/truck/:truckId`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

### Get User's Reviews
**GET** `/reviews/user`
*Requires authentication*

### Create Review
**POST** `/reviews`
*Requires authentication*

**Body:**
```json
{
  "truck": "truck_id_here",
  "rating": 5,
  "comment": "Amazing food!",
  "images": ["https://example.com/image1.jpg"]
}
```

### Update Review
**PUT** `/reviews/:id`
*Requires authentication (Review owner)*

### Delete Review
**DELETE** `/reviews/:id`
*Requires authentication (Review owner/Admin)*

### Mark Review as Helpful
**PUT** `/reviews/:id/helpful`
*Requires authentication*

---

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
