## Simple Express authorization

Simple Express authorization promises to make authorization in Express super easy.

What it includes:

- Google Auth
- Email and password Auth

How to set it up:

Step 1: install from NPM

```
npm i simpler-express-authorize
```

Step 2: Add to your code as follows

```
const {simpleExpressAuth} = require("simpler-express-authorize");

...

app.use(simpleExpressAuth);
```

Step 3: Update .env with your values

```
DOMAIN= domain here
FRONTEND_URL= frontend url here
BACKEND_URL= backend url here
GOOGLE_CLIENT_ID= client id here
GOOGLE_CLIENT_SECRET= client secret here
GOOGLE_REDIRECT_URI= google redirect here
JWT_KEY= key here
MAIL_HOST= host here
MAIL_PASSWORD= password here
MAIL_PORT=587
MAIL_SENDER= sender here formatted as ME <hello@yoursite.com>
MAIL_USER= mail user here
```

Thats it. your done.