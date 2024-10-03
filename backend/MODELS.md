# Trip Planner Models Documentation

This document provides an overview of the data models used in the Trip Planner application. Each model represents a collection in the MongoDB database.

## Table of Contents
1. [User](#user)
2. [Trip](#trip)
3. [RevokedToken](#revokedtoken)

## User

The User model represents registered users of the application.

### Schema

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| username | String | User's chosen username | Required, Unique, Trimmed, Min length: 3, Max length: 30 |
| email | String | User's email address | Required, Unique, Validated as email |
| password | String | Hashed password | Required, Min length: 8 |
| profilePicture | String | URL to user's profile picture | Optional |
| isVerified | Boolean | Whether the user's email is verified | Default: false |
| verificationToken | String | Token for email verification | Optional |
| verificationTokenExpires | Date | Expiration date for verification token | Optional |
| lastTimeActive | Date | Last time user was active | Optional |
| deactivationToken | String | Token for account deactivation | Optional |
| deactivationExpires | Date | Expiration date for deactivation token | Optional |
| deactivated | Date | Date when account was deactivated | Optional |
| trips | [ObjectId] | References to Trip documents | Optional |

### Methods

- `comparePassword(candidatePassword: string): Promise<boolean>`
  - Compares the given password with the stored hashed password.

### Hooks

- Pre-save hook: Hashes the password before saving if it has been modified.

## Trip

The Trip model represents travel plans created by users.

### Schema

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| title | String | Title of the trip | Required |
| description | String | Description of the trip | Optional |
| startDate | Date | Start date of the trip | Optional |
| endDate | Date | End date of the trip | Optional |
| places | [PlaceSchema] | Array of places included in the trip | Required |
| creator | ObjectId | Reference to the User who created the trip | Required, ref: 'User' |
| sharedWith | [ObjectId] | References to Users the trip is shared with | Optional, ref: 'User' |
| invitationCode | String | Code for inviting others to the trip | Required, Unique |
| shareCode | String | Code for sharing the trip publicly | Required, Unique |
| activeEditors | Number | Number of users currently editing the trip | Default: 0 |

### Place Schema (Subdocument)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| name | String | Name of the place | Required |
| date | Date | Date of visit to the place | Required |
| latitude | Number | Latitude coordinate of the place | Required |
| longitude | Number | Longitude coordinate of the place | Required |

## RevokedToken

The RevokedToken model represents authentication tokens that have been invalidated.

### Schema

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| token | String | The revoked token | Required, Unique |
| expiresAt | Date | Expiration date of the token | Required |

## Relationships

- A User can have multiple Trips (one-to-many)
- A Trip belongs to one User (creator) and can be shared with multiple Users (many-to-many)

## Indexes

Consider adding indexes to frequently queried fields for better performance:

```javascript
// User model
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Trip model
tripSchema.index({ creator: 1 });
tripSchema.index({ invitationCode: 1 });
tripSchema.index({ shareCode: 1 });

// RevokedToken model
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
```

## Notes

1. All models use Mongoose for schema definition and validation.
2. Passwords are hashed using bcrypt before storage.
3. The `RevokedToken` model uses a TTL (Time To Live) index on the `expiresAt` field, which automatically removes expired tokens from the database.
4. The `Trip` model includes nested subdocuments for places, allowing for efficient storage of trip itineraries.
5. Proper error handling should be implemented when interacting with these models, especially for unique constraint violations.