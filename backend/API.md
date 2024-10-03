# Trip Planner API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Auth Routes](#auth-routes)
3. [Trip Routes](#trip-routes)
4. [User Routes](#user-routes)

## Authentication

Most endpoints require authentication. Authentication is handled using HTTP-only cookies. When a user logs in successfully, the server will set a secure, HTTP-only cookie containing a session identifier. This cookie will be automatically included in subsequent requests to authenticated endpoints. Authentication requirement is indicated for each endpoint as follows:

- 🔓 No authentication required
- 🔒 User authentication required
- 👑 Owner authentication required
- 🔑 Admin authentication required

## Auth Routes

#### Register
```
🔓 POST /api/auth/register
Body: { username: string, email: string, password: string }
Response: { message: "User registered successfully" }
```

#### Login
```
🔓 POST /api/auth/login
Body: { email: string, password: string }
Response: { message: "Login successful", user: { id: string, role: string } }
```

#### Post-Registration Login
```
🔓 POST /api/auth/reg-login
Response: { message: "Login successful", user: { id: string, role: string, isVerified: boolean } }
```

#### Logout
```
🔒 POST /api/auth/logout
Response: { message: "Logout successful" }
```

#### Refresh Token
```
🔒 POST /api/auth/refresh-token
Response: { message: "Token refreshed successfully", user: { id: string, role: string } }
```

#### Send Verification Email
```
🔒 POST /api/auth/send-verification
Response: { message: "Verification email sent" }
```

#### Verify Email
```
🔓 GET /api/auth/verify-email/:token
Response: { message: "Email verified successfully" }
```

#### Change Password
```
🔒 PUT /api/auth/change-password
Body: { currentPassword: string, newPassword: string }
Response: { message: "Password changed successfully" }
```

#### Request Password Reset
```
🔓 POST /api/auth/request-password-reset
Body: { email: string }
Response: { message: "Password reset email sent" }
```

#### Reset Password
```
🔓 POST /api/auth/reset-password/:token
Body: { password: string }
Response: { message: "Password reset successful" }
```

#### Create Owner Account
```
🔑 POST /api/auth/create-owner
Body: { username: string, email: string, password: string }
Response: { message: "Owner account created successfully", ownerId: string }
```

#### Create Magic Link
```
🔓 POST /api/auth/magic-link
Body: { email: string }
Response: { message: "Magic link sent to your email" }
```

#### Login with Magic Link
```
🔓 GET /api/auth/magic-login/:token
Response: { message: "Login successful", user: { id: string, role: string } }
```

#### Request Account Deactivation
```
🔒 POST /api/auth/request-deactivation
Response: { message: "Account deactivation email sent" }
```

#### Deactivate Account
```
🔓 POST /api/auth/deactivate/:token
Response: { message: "Account deactivated successfully" }
```

## Trip Routes

#### Create Trip
```
🔒 POST /api/trips
Body: { title: string, description?: string, startDate?: Date, endDate?: Date, places: [{ name: string, date: Date, latitude: number, longitude: number }] }
Response: Trip
```

#### Get All User Trips
```
🔒 GET /api/trips
Response: [Trip]
```

#### Get Trip Details
```
🔒 GET /api/trips/:id
Response: Trip
```

#### Update Trip
```
🔒 PUT /api/trips/:id
Body: { title?: string, description?: string, startDate?: Date, endDate?: Date, places?: [{ name: string, date: Date, latitude: number, longitude: number }] }
Response: Trip
```

#### Delete Trip
```
🔒 DELETE /api/trips/:id
Response: { message: "Trip deleted successfully" }
```

#### Share Trip
```
🔒 POST /api/trips/:id/share
Body: { email: string }
Response: { message: "Trip shared successfully", invitationCode: string }
```

#### Join Trip
```
🔒 POST /api/trips/join
Body: { invitationCode: string }
Response: { message: "Successfully joined the trip", trip: Trip }
```

#### Leave Trip
```
🔒 POST /api/trips/:id/leave
Response: { message: "Successfully left the trip" }
```

#### Update Place
```
🔒 PUT /api/trips/:tripId/places/:placeId
Body: { name?: string, date?: Date, latitude?: number, longitude?: number }
Response: Trip
```

#### Add Place
```
🔒 POST /api/trips/:tripId/places
Body: { name: string, date: Date, latitude: number, longitude: number }
Response: Trip
```

#### Remove Place
```
🔒 DELETE /api/trips/:tripId/places/:placeId
Response: Trip
```

#### Update Real-Time Status
```
🔒 POST /api/trips/real-time-status
Body: { tripId: string, isEditing: boolean }
Response: { message: string, enableRealTime: boolean }
```

#### Get Trip by Share Code
```
🔓 GET /api/trips/share/:shareCode
Response: Trip
```

#### Regenerate Share Code
```
🔒 POST /api/trips/:id/regenerate-share-code
Response: { message: "Share code regenerated successfully", shareCode: string }
```

## User Routes

#### Get User Profile
```
🔒 GET /api/users/profile
Response: User
```

#### Update User Profile
```
🔒 PUT /api/users/profile
Body: { username?: string, email?: string }
Response: User
```

#### Deactivate Account
```
🔒 POST /api/users/deactivate
Response: { message: "Account deactivated successfully" }
```

#### Reactivate Account
```
🔓 POST /api/users/reactivate/:token
Response: { message: "Account reactivated successfully" }
```

#### Update Last Active Time
```
🔒 POST /api/users/update-last-active
Response: { message: "Last active time updated successfully" }
```

#### Upload Profile Picture
```
🔒 PUT /api/users/upload-profile-picture
Body: FormData
Response: { message: "Profile picture updated successfully", profilePicture: string }
```