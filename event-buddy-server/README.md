# Backend Installation Guide

This guide provides instructions for setting up and running the backend of the Event Buddy application, including database configuration, backend server setup, Postman configuration for API testing, and an overview of available APIs.

## Prerequisites

- **Node.js and npm**: Ensure Node.js and npm are installed on your system.
- **PostgreSQL**: Install PostgreSQL and pgAdmin for database management.
- **Postman**: Install Postman for testing APIs.
- **Backend Port**: Ensure `http://localhost:3000` is available for the backend server.
- **Database**: A PostgreSQL database named `event_buddy` must be created.

## Database Setup

1. Create a PostgreSQL database named `event_buddy`.
2. In pgAdmin, import the `event_buddy.sql` file located in the `Database` folder to set up the necessary tables and data.
3. Verify that the database is correctly populated with the initial data.

## Backend Setup

1. Navigate to the `event-buddy-server` directory:
   ```bash
   cd event-buddy-server
   ```
2. Open a terminal in this directory.
3. Install all required dependencies:
   ```bash
   npm install
   ```
4. Verify the database configuration:
   - Locate the `.env.db` file in the `event-buddy-server` directory.
   - Ensure the `password` and `port` values match your PostgreSQL configuration in pgAdmin.
   - Example `.env.db` configuration:
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=event_buddy
     ```
5. Start the backend development server:
   ```bash
   npm run start:dev
   ```
6. Confirm that the backend is running on `http://localhost:3000`.

## Postman Configuration

The Event Buddy backend uses JWT authentication. Configure Postman to test APIs by setting the `Bearer Token` in the Authorization header.

### Steps

1. Open Postman and create a new workspace or use an existing one.
2. Click **Import** in Postman and upload the `Event Buddy.postman_collection.json` file to import the API collection.
3. Click **Import** in Postman and upload the `Local API.postman_environment.json` file to import the Local API for auto save the accessToken.
4. Go to **Environments** tab and active the variable named **Local API**.
5. Sign in to obtain a `Bearer Token` using the `Sign In` API under the **Authentications** section of the collection.
6. Use the following test credentials to sign in:

   **User Login**

   ```json
   {
     "email": "user@gmail.com",
     "password": "User@123"
   }
   ```

   **Admin Login**

   ```json
   {
     "email": "admin@gmail.com",
     "password": "Admin@123"
   }
   ```

7. After signing in, the `accessToken` is automatically stored in Postman’s environment variable `{{accessToken}}` (configured in the `Sign In` API’s test script).
8. The `Bearer Token` is automatically applied to requests requiring authentication .

### Manual Token Setup (Optional)

If you prefer to set the `Bearer Token` manually:

1. Use the `Sign In` API or create a new account via the `Sign Up` API under **Authentications**.
2. Copy the `accessToken` from the `Sign In` response.
3. In Postman, set the `Authorization` header to `Bearer <accessToken>` for protected API requests.

### Account Creation (Optional)

To create a new account:

- Use the `Sign Up` API in the **Authentications** section.
- Example payload:
  ```json
  {
    "full_name": "Your Name",
    "email": "your.email@example.com",
    "password": "YourPassword@123",
    "role_id": 1
  }
  ```
- **Note**: Use `role_id: 1` for User role or `role_id: 2` for Admin role.

## API Descriptions

The Event Buddy backend provides APIs for managing events, bookings, users, roles, and authentication. Below is an overview of the available endpoints, organized by category, based on the Postman collection.

### Event Operations

| Endpoint            | Method | Description              | Authentication       |
| ------------------- | ------ | ------------------------ | -------------------- |
| `/event`            | GET    | Retrieve all events      | None                 |
| `/event/:id`        | GET    | Retrieve an event by ID  | None                 |
| `/event/create`     | POST   | Create a new event       | Bearer Token - Admin |
| `/event/update/:id` | PATCH  | Update an existing event | Bearer Token - Admin |
| `/event/delete/:id` | DELETE | Delete an event by ID    | Bearer Token - Admin |

**Example: Create Event Payload**

```json
{
  "title": "Decentralized Graphic Interface Workshop",
  "date": "2025-07-11",
  "start_time": "10:00:00",
  "end_time": "16:00:00",
  "description": "A hands-on workshop on building scalable applications.",
  "location": "30609 Nicole Corners, Thomasburgh, MO 50292",
  "total_seats": 147,
  "image": "path/to/image.png",
  "tags": [
    "Mobile",
    "Workshop",
    "JavaScript",
    "TypeScript",
    "Cloud",
    "Web Development"
  ]
}
```

### Booking Operations

| Endpoint                 | Method | Description                       | Authentication            |
| ------------------------ | ------ | --------------------------------- | ------------------------- |
| `/booking`               | GET    | Retrieve all bookings             | Bearer Token - User/Admin |
| `/booking/:id`           | GET    | Retrieve a booking by ID          | Bearer Token - User/Admin |
| `/booking/create`        | POST   | Create a new booking              | Bearer Token User/Admin   |
| `/booking/update/:id`    | PATCH  | Update an existing booking        | Bearer Token User/Admin   |
| `/booking/delete/:id`    | DELETE | Delete a booking by ID            | Bearer Token User/Admin   |
| `/booking/user/:user_id` | GET    | Retrieve a user’s booking history | Bearer Token Admin        |

**Example: Create Booking Payload**

```json
{
  "user_id": 3,
  "event_id": 49,
  "seat_booked": 5
}
```

### User Operations

| Endpoint           | Method | Description             | Authentication          |
| ------------------ | ------ | ----------------------- | ----------------------- |
| `/user`            | GET    | Retrieve all users      | Bearer Token Admin      |
| `/user/:id`        | GET    | Retrieve a user by ID   | Bearer Token User/Admin |
| `/user/update/:id` | PATCH  | Update an existing user | Bearer Token User/Admin |

**Example: Update User Payload**

```json
{
  "full_name": "Naimur Rahman",
  "password": "Naimur@5"
}
```

### Role Operations

| Endpoint           | Method | Description             | Authentication     |
| ------------------ | ------ | ----------------------- | ------------------ |
| `/role`            | GET    | Retrieve all roles      | Bearer Token Admin |
| `/role/:id`        | GET    | Retrieve a role by ID   | Bearer Token Admin |
| `/role/create`     | POST   | Create a new role       | Bearer Token Admin |
| `/role/update/:id` | PATCH  | Update an existing role | Bearer Token Admin |
| `/role/delete/:id` | DELETE | Delete a role by ID     | Bearer Token Admin |

**Example: Create Role Payload**

```json
{
  "role_name": "Admin"
}
```

### Authentication Operations

| Endpoint             | Method | Description                        | Authentication |
| -------------------- | ------ | ---------------------------------- | -------------- |
| `/user/create`       | POST   | Sign up a new user                 | None           |
| `/auth/signin`       | POST   | Sign in and obtain an access token | None           |
| `/auth/refreshToken` | POST   | Refresh an access token            | Bearer Token   |

**Example: Sign Up Payload**

```json
{
  "full_name": "Admin",
  "email": "admin@gmail.com",
  "password": "Admin@123",
  "role_id": 2
}
```

**Example: Sign In Payload**

```json
{
  "email": "user@gmail.com",
  "password": "User@123"
}
```

## Troubleshooting

- **Database Issues**: Ensure the `event_buddy` database is created and the `event_buddy.sql` file is imported correctly.
- **Port Conflicts**: Verify that `http://localhost:3000` is not used by another application.
- **Authentication Errors**: Ensure the correct `Bearer Token` is set in Postman for protected endpoints.
- **API Testing**: If an API request fails, check the endpoint URL, payload format, and authentication requirements in the Postman collection.
