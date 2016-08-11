# Messaging Application
Udacity Capsone Project: Senior Web Development

## Installation

*Disclaimer* This is still under development and does not work correctly at the moment.

1. Create a MongoDb database on modulus.io or any other hosting service/local installation and add the connection URI to the config.js file (see template: config.js-TEMPLATE) 
2. Create a Firebase Account and project and add the authorization key to the config.js file as gcm_key
3. Set all the other config values according to the 
4. Run

```
npm install
```

5. Execute

```
nodemon server.js
```

6. Execute localhost:8080/api/v1/mock to initially create two users with some chat history.
Logins created: username: Admin and password: admin or username: John and password: john