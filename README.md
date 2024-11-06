# 💬 Chat App

This is a full-stack chat application that supports real-time messaging, user authentication, and both one-on-one and group chats. The app is built using Node.js, Express, MongoDB for the backend, and utilizes WebSocket for real-time communication.

## 📜 Contents

- [✨ Features](#✨-features)
- [💻 Tech Stack](#💻-tech-stack)
  - [🔧 Backend](#🔧-backend)
  - [🌐 Frontend](#🌐-frontend)
- [📚 API Endpoints](#📚-api-endpoints)
  - [🔐 Auth Endpoints](#🔐-auth-endpoints)
  - [👤 User Endpoints](#👤-user-endpoints)
  - [💬 Chat Endpoints](#💬-chat-endpoints)
  - [📩 Message Endpoints](#📩-message-endpoints)
- [⚙️ Installation](#️⚙️-installation)
- [🚀 Usage](#🚀-usage)
- [🗼 Project Structure](#🗼-project-structure)
- [🔮 Future Enhancements](#🔮-future-enhancements)
- [🤝 Contributing](#🤝-contributing)
- [👏 Acknowledgments](#👏-acknowledgments)

## ✨ <a name="features">Features</a>

- **User Authentication**: Secure sign-up and login functionality.
- **One-on-One Chat**: Private conversations between two users.
- **Group Chat**: Create groups, add participants, and send messages to multiple people.
- **Real-time Messaging**: Instant messaging powered by WebSocket.
- **Media Sharing**: Send and receive images or other media files.

## 💻 <a name="tech-stack">Tech Stack</a>

### 🔧 <a name="backend">Backend</a>

- **Node.js**: Server runtime.
- **Express**: Web framework for Node.js.
- **MongoDB**: Database for storing user data, messages, and chat information.
- **Mongoose**: MongoDB ODM for schema and model management.
- **WebSocket**: Real-time communication.

### 🌐 <a name="frontend">Frontend</a>

- **React**: For user interface.
- **Socket.IO**: Real-time updates for the chat interface.
- **Tailwind CSS**: For styling.

## 📚 <a name="api-endpoints">API Endpoints</a>

### 🔐 <a name="auth-endpoints">Auth Endpoints</a>

| URL                  | Method | Endpoint      |
| -------------------- | ------ | ------------- |
| `/api/auth/register` | `POST` | Register User |
| `/api/auth/login`    | `POST` | Login User    |

### 👤 <a name="user-endpoints">User Endpoints</a>

| URL                              | Method   | Endpoint                                       |
| -------------------------------- | -------- | ---------------------------------------------- |
| `/api/user`                      | `GET`    | Get all Users                                  |
| `/api/user/:username`            | `GET`    | Get a particular User                          |
| `/api/user/:username/deactivate` | `PATCH`  | Toggle activate and deactivate user            |
| `/api/user/:username`            | `PATCH`  | Update User (change any field except password) |
| `/api/user/:username`            | `DELETE` | Delete User                                    |

### 💬 <a name="chat-endpoints">Chat Endpoints</a>

| URL                                    | Method  | Endpoint                              |
| -------------------------------------- | ------- | ------------------------------------- |
| `/api/chat/private`                    | `POST`  | Create a Private Chat                 |
| `/api/chat/group`                      | `POST`  | Create a Group Chat                   |
| `/api/chat/group/:chatId/participants` | `PATCH` | Add/Remove participants in Group Chat |

### 📩 <a name="message-endpoints">Message Endpoints</a>

| URL                        | Method   | Endpoint                   |
| -------------------------- | -------- | -------------------------- |
| `/api/messages`            | `POST`   | Send Messages              |
| `/api/messages/:chatId`    | `GET`    | Get All Messages of a Chat |
| `/api/messages/:messageId` | `DELETE` | Delete a Message           |

## ⚙️ <a name="installation">Installation</a>

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

6. Your backend server will be running on: `http://localhost:8000` and your frontend server will be running on: `http://localhost:5173`

## 🚀 <a name="Usage">Usage</a>

1. **Register** a new user by sending a `POST` request to `/api/auth/register.`

2. **Login** to get a JWT token, which will be used for authorization in further requests.

3. Create **private** and **group** chats using the respective endpoints.

4. Send messages, retrieve messages, and manage chats.

## 🗼 <a name="project-structure">Project Structure</a>

```bash
project-root
├── Backend
│   ├── config
│   │   └── configDB.js           # MongoDB connection settings.
│   ├── Controllers
│   │   ├── chat-controller.js     # Manages chat operations.
│   │   ├── message-controller.js  # Manages message operations.
│   │   ├── socket-controller.js   # Manages WebSocket events.
│   │   ├── user-controller.js     # Manages user operations.
│   └── Helpers
│   │   └── helpers.js             # Reusable utility functions.
│   └── Middlewares
│   │   ├── auth-middleware.js     # Authentication middleware.
│   │   ├── chat-middleware.js     # Middleware for chat permissions.
│   └── Routes
│   │   ├── chat-routes.js         # Chat routes.
│   │   ├── message-routes.js      # Message routes.
│   │   ├── user-routes.js         # User routes.
│   └── Schemas
│   │   ├── ChatSchema.js          # Defines chat schema.
│   │   ├── MessageSchema.js       # Defines message schema.
│   │   └── UserSchema.js          # Defines user schema.
│   └── index.js                   # Entry point for backend server.
│   └── package-lock.json          # Locks backend dependencies.
│   └── package.json               # Backend project metadata.
├── Frontend
│   └── public                     # Static assets.
│   └── src
│   │   ├── assets                 # Static files (e.g., images).
│   │   ├── App.jsx                # Main app component.
│   │   ├── index.css              # Global styles.
│   │   ├── main.jsx               # Frontend entry point.
│   │   └── VerifyConnection.jsx   # Checks socket connection.
│   └── eslint.config.js           # ESLint rules.
│   └── index.html                 # HTML template.
│   └── package-lock.json          # Locks frontend dependencies.
│   └── package.json               # Frontend project metadata.
│   └── postcss.config.js          # PostCSS settings.
│   └── tailwind.config.js         # Tailwind CSS config.
│   └── vite.config.js             # Vite build settings.
├── .gitignore                     # Git ignore rules.
└── README.md                      # Project overview and setup.

```

## Remaining Project Tasks

This project still requires the completion of the following tasks. Track progress by checking off tasks as they are completed.

- Step 1 ✅:

- [x] Implement User Schema
- [x] Implement Chat Schema
- [x] Implement Message Schema

- Step 2 ✅:

- [x] Implement Auth Routes
- [x] Implement User Routes
- [x] Implement Chat Routes
- [x] Implement Message Routes

- Step 3 ✅:

- [x] Integrate socket.io (Backend)
- [x] Integrate socket.io (Frontend)

- Step 4 [ ]:

  - [ ] Implement Login/Register Pages
  - [ ] Implement Chat Pages

- Step 5 [ ]:

  - [ ] Implement Real-time Messaging (Backend)
  - [ ] Implement Real-time Messaging (Frontend)
  - [ ] Implement Messaging

- Step 6 [ ]:
  - [ ] Implement Responsive Design

## 🔮 <a name="fututre-enhancements">Future Enhancements</a>

1. **File Uploads**: Allow file sharing beyond just text messages.
2. **Message Reactions**: React to messages with emojis.
3. **Push Notifications**: Notify users when they receive a new message.

## 🤝 <a name="contributing">Contributing</a>

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

## 👏 <a name="acknowledgement">Acknowledgments</a>

A huge thank you to the [ExpressJs](https://expressjs.com), [ReactJs](https://react.dev) and [Socket.io](https://socket.io) communities and various online resources that have been invaluable in my learning journey!
