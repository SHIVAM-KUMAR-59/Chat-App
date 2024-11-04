# Chat App

This is a full-stack chat application that supports real-time messaging, user authentication, and both one-on-one and group chats. The app is built using Node.js, Express, MongoDB for the backend, and utilizes WebSocket for real-time communication.

## Features

- **User Authentication**: Secure sign-up and login functionality.
- **One-on-One Chat**: Private conversations between two users.
- **Group Chat**: Create groups, add participants, and send messages to multiple people.
- **Real-time Messaging**: Instant messaging powered by WebSocket.
- **Media Sharing**: Send and receive images or other media files.

## Tech Stack

### Backend

- **Node.js**: Server runtime.
- **Express**: Web framework for Node.js.
- **MongoDB**: Database for storing user data, messages, and chat information.
- **Mongoose**: MongoDB ODM for schema and model management.
- **WebSocket**: Real-time communication.

### Frontend

- **React**: For user interface.
- **Socket.IO**: Real-time updates for the chat interface.
- **Tailwind CSS**: For styling.

## API Endpoints

### Auth Endpoints

| URL                  | Method | Endpoint      |
| -------------------- | ------ | ------------- |
| `/api/auth/register` | `POST` | Register User |
| `/api/auth/login`    | `POST` | Login User    |

### User Endpoints

| URL                              | Method   | Endpoint                                       |
| -------------------------------- | -------- | ---------------------------------------------- |
| `/api/user`                      | `GET`    | Get all Users                                  |
| `/api/user/:username`            | `GET`    | Get a particular User                          |
| `/api/user/:username/deactivate` | `PATCH`  | Toggle activate and deactivate user            |
| `/api/user/:username`            | `PATCH ` | Update User (change any field except password) |
| `/api/user/:username`            | `DELETE` | Delete User                                    |

### Chat Endpoints

| URL                                    | Method  | Endpoint                              |
| -------------------------------------- | ------- | ------------------------------------- |
| `/api/chat/private`                    | `POST`  | Create a Private Chat                 |
| `/api/chat/group`                      | `POST ` | Create a Group Chat                   |
| `/api/chat/group/:chatId/participants` | `PATCH` | Add/Remove participants in Group Chat |

### Message Endpoints

| URL             | Method | Endpoint      |
| --------------- | ------ | ------------- |
| `/api/messages` | `POST` | Send Messages |

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. Install Backend Dependencies:

   ```bash
   cd Backend
   npm install
   ```

3. Install Frontent Dependencies (make sure you are in the roo directory before doing this):

   ```bash
   cd Frontend
   npm install
   ```

4. Set up environment variables: Create a .env file in the root directory and add the following:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE_TIME=your_expiration_time
   ```

5. Start the servers:

   ```bash
   #start backend server
   nodemon start

   #start frontend server
   npm run dev
   ```

6. Your backend server will be running on: `http://localhost:8000` and your frontend server will be running on: `http://localhost:3000`

## Usage

1. **Register** a new user by sending a `POST `request to `/api/auth/register.`

2. **Login** to get a JWT token, which will be used for authorization in further requests.

3. Create **private** and **group** chats using the respective endpoints.

4. Send messages, retrieve messages, and manage chats.

## Future Enhancements

1. **File Uploads**: Allow file sharing beyond just text messages.
2. **Message Reactions**: React to messages with emojis.
3. **Push Notifications**: Notify users when they receive a new message.

## Contributing ✨

This repository is intended for personal learning, but if you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request!

1. Fork the repository.

2. Create a new branch for your feature:

   ```bash
   git checkout -b feature/new-concept
   ```

3. Commit your changes:

   ```bash
   git commit -m "Added new concept"
   ```

4. Push to the branch:

   ```
   git push origin feature/new-concept
   ```

5. Open a pull request, and I'll review your contribution!

## Acknowledgments 👏

A huge thank you to the community and various online resources that have been invaluable in my learning journey!
