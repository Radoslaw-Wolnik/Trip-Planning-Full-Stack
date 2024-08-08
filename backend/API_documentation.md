## API Documentation

Our API provides endpoints for user authentication, trip management, and real-time collaboration. All endpoints are prefixed with `/api`.

### Authentication

#### Register a new user
- **POST** `/users/register`
- **Body**: `{ username, email, password }`
- **Response**: `{ message: "User registered successfully" }`

#### Login
- **POST** `/users/login`
- **Body**: `{ email, password }`
- **Response**: `{ token: "JWT_TOKEN", user: { ... } }`

#### Logout
- **POST** `/users/logout`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ message: "Logged out successfully" }`

#### Get user profile
- **GET** `/users/me`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ user: { ... } }`

### Trip Management

#### Create a new trip
- **POST** `/trips`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: `{ name, description, startDate, endDate }`
- **Response**: `{ trip: { ... } }`

#### Get all trips
- **GET** `/trips`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ trips: [ ... ] }`

#### Get trip details
- **GET** `/trips/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ trip: { ... } }`

#### Update a trip
- **PUT** `/trips/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: `{ name, description, startDate, endDate, places }`
- **Response**: `{ trip: { ... } }`

#### Delete a trip
- **DELETE** `/trips/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ message: "Trip deleted successfully" }`

### Collaboration

#### Invite to edit a trip
- **POST** `/trips/:id/invite`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ invitationCode: "..." }`

#### Join a trip (using invitation code)
- **POST** `/trips/join`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: `{ invitationCode }`
- **Response**: `{ trip: { ... } }`

#### Generate share link
- **POST** `/trips/:id/share`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ shareCode: "..." }`

#### Get shared trip (view-only)
- **GET** `/trips/shared/:shareCode`
- **Response**: `{ trip: { ... } }`

### Real-time Editing

Real-time editing is handled through WebSocket connections. When editing a trip, the frontend should:

1. Connect to the WebSocket server.
2. Join a trip's editing room: `socket.emit('join-trip', tripId)`
3. Listen for updates: `socket.on('trip-updated', (data) => { ... })`
4. Send updates: `socket.emit('update-trip', { tripId, updatedData })`
5. Notify when joining/leaving: 
   - `socket.emit('editor-joined', tripId)`
   - `socket.emit('editor-left', tripId)`

The server will automatically enable real-time editing when two or more users are editing the same trip.