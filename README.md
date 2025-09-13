# @dmxdev/auth-sdk

A simple, extensible authentication SDK for Node.js and Express applications.  
Supports manual login, JWT authentication, refresh tokens, and easy integration with Mongoose models.

## Features

- Manual authentication (username/email + password)
- JWT-based authentication middleware
- Refresh token support
- Easy integration with Express and Mongoose
- Error handling utilities

## Installation

```bash
npm install @dmxdev/auth-sdk
```

## Usage

### 1. Import and Setup

```javascript
import {
  AuthSDK,
  AuthSDKError,
  AuthTypesEnum,
  passport,
} from "@dmxdev/auth-sdk";
import mongoose from "mongoose";
import express from "express";

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://<your-mongo-uri>");

// Define your User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

// Configure AuthSDK
AuthSDK.configure(
  app,
  {
    authType: AuthTypesEnum.MANUAL,
    jwtSecret: "your-secret",
    requireRefreshToken: true,
    tokenExpiry: "15m",
    refreshTokenExpiry: "7d",
  },
  {
    UserModel: User,
  }
);
```

### 2. Register Route

```javascript
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const data = await AuthSDK.register({
      username,
      email,
      password,
    });
    res.json(data);
  } catch (error) {
    if (error instanceof AuthSDKError) {
      res.status(400).json({ error: error.message });
    }
  }
});
```

### 3. Login Route

```javascript
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await AuthSDK.login({
      username,
      password,
    });
    res.json(data);
  } catch (error) {
    if (error instanceof AuthSDKError) {
      res.status(400).json({ error: error.message });
    }
  }
});
```

### 4. Protected Route (Get Authenticated User)

```javascript
app.get("/me", AuthSDK.authenticate, (req, res) => {
  const user = AuthSDK.getLoggedInUser(req);
  res.json(user);
});
```

### 5. Start Server

```javascript
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## API Reference

### AuthSDK.configure(app, config, models)

Initializes the SDK with your Express app, configuration, and Mongoose models.

### AuthSDK.register(userData)

Registers a new user.

### AuthSDK.login(credentials)

Authenticates a user and returns JWT (and refresh token if enabled).

### AuthSDK.authenticate

Express middleware to protect routes using JWT.

### AuthSDK.getLoggedInUser(req)

Returns the authenticated user from the request.

### AuthSDKError

Base error class for SDK errors.

## Project Structure

```
Auth-SDK/
├── src/
│   ├── config.ts
│   ├── errors.ts
│   ├── index.ts
│   ├── types.ts
│   ├── strategies/
│   │   └── manual.login.ts
│   └── utils/
│       └── jwt.ts
├── dist/
├── Demo/
│   └── index.js
├── package.json
└── tsconfig.json
```

## License
