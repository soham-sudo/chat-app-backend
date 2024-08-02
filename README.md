# Chat Application Backend

## Overview

This project is the backend for a real-time chat application supporting both group and direct chat. It includes secure user authentication, real-time messaging, user search functionality, and secure communication.

## Features

- **User Authentication and Authorization**
  - Registration and login using JWT tokens
  - Password hashing with bcrypt
  - Session management with secure cookies

- **Real-time Messaging**
  - Send and receive messages in real-time using Socket.io
  - Support for both group and direct chat

- **Search Functionality**
  - Search users by name or email

- **Secure Communication**
  - Encrypted passwords
  - Secure token-based authentication

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- bcrypt
- Socket.io
- Cookies

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/chat-app-backend.git
    cd chat-app-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Run the application:
    ```sh
    npm start
    ```

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - Register a new user

- **POST /api/auth/login**
  - Login a user

### Messaging

- **POST /api/v1/messages**
  - Send a new message

- **GET /api/v1/messages/:chatId**
  - Get messages for a specific chat (group or direct)

### User Search

- **GET /api/users/search**
  - Search users by name or email

## License

This project is licensed under the MIT License.
