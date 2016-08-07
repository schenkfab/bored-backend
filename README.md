# Messaging Application
Udacity Capsone Project: Senior Web Development

## Installation

*Disclaimer* This is still under development and does not work correctly at the moment.

1. Create a MongoDb database on modulus.io and add the connection URI to the config.js file (see template: config.js-TEMPLATE) 
2. Create a Firebase Account and project and add the authorization key to the config.js file as gcm_key
3. Run

```
npm install
```

3. Execute

```
nodemon server.js
```

3. Execute localhost:8080/api/v1/users/setup to initially create a user with username: Admin and password: admin