import { AuthSDK, AuthSDKError, AuthTypesEnum, passport } from '@dmxdev/auth-sdk';
import mongoose from 'mongoose';
import express from 'express';

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://digen21:Digenmore421@cluster0.9jqwume.mongodb.net/auth-sdk');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    password: String,
  }),
);

AuthSDK.configure(
  app,
  {
    authType: AuthTypesEnum.MANUAL,
    jwtSecret: 'demo',
    requireRefreshToken: true,
    tokenExpiry: '15m',
    refreshTokenExpiry: '7d',
  },
  {
    UserModel: User,
  },
);

app.post('/login', async (req, res) => {
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

app.post('/register', async (req, res) => {
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

app.get('/me', AuthSDK.authenticate, (req, res) => {
  const user = AuthSDK.getLoggedInUser(req);
  res.json(user);
});

app.listen(3000);
