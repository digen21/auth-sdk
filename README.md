# Auth-SDK

A simple authentication SDK for Node.js projects. This SDK provides authentication strategies and utilities for secure login and token management.

## Features
- Manual login strategy
- JWT utilities
- Configurable authentication services
- Error handling

## Installation

```bash
npm install my-auth-sdk
```

## Usage

### Importing in your project

```js
const authSDK = require('my-auth-sdk');
```

Or, if using the local dist folder for development:

```js
const authSDK = require('../dist');
```

### Example: Manual Login

```js
const manualLogin = require('../dist/strategies/manual.login');

manualLogin.login({ username: 'user', password: 'pass' })
  .then(user => {
    // handle authenticated user
  })
  .catch(err => {
    // handle error
  });
```

## Project Structure

```
Auth-SDK/
├── src/
│   ├── config.ts
│   ├── errors.ts
│   ├── index.ts
│   ├── types.ts
│   ├── services/
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

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

ISC
