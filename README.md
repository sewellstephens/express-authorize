## Simple Express authorization

Simple Express authorization promises to make authorization in Express super easy.

### What it includes:

- Google Auth
- Email and password Auth
- Uses MongoDB

If you would like to use different database, or want more control you can clone the Github repository.

### How to set it up:

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

UPDATE: btw sorry for confusion, i had to fix some thing and their are mone env values required. Had to ship this env update in rush as i just posted about it...

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
MONGODB_URI= mongo url here
```

If you want to only offer password signin, you will need to add a config like so:

```

const {simpleExpressAuth} = require("simpler-express-authorize");

...

app.use(simpleExpressAuth({
    passwordOnly: true
}));

```

Or to only offer Google sign in, replace passwordOnly with googleOnly.



For even more control you can:

```
git clone https://github.com/sewellstephens/express-authorize.git
```

### Routes to get familiar with

/users/signup (POST)

Sent a post request to signup user with password.

Requires body formatted as follows:

```
{
    name: usersName,
    email: usersEmail,
    password: usersPassword
}
```

/users/login (POST)

Send a post request to login user with password.

Requires body formatted as follows:

```
{
    email: usersEmail,
    password: usersPassword
}
```

/users/google (GET)

Gets a Google authorization URL based on Client ID and Secret defined in ENV file.

/users/googleCallback (GET)

Add this in when setting up your Google consent prompt.

/users/logout (POST)

Logs out a user.

/users/account (GET)

Gets user information stored in MongoDB.

/users/account (PUT)

Updates user email, password, and/or name.

Requires body formatted as follows:

```
{
    name: usersName,
    email: usersEmail,
    password: usersPassword
}
```

/users/activate/:token (GET)

Used when activating account, or when two factor is enabled.

/users/resetToken (POST)

Used for sending password reset email.

/users/resetPassword (POST)

Used for reseting password.

/users/delete (POST)

Used for deleting user.

/users/activateTwoFactor

Used for activating two factor.

Requires body formatted as follows:

```
{
    enabledState: enabledState
}
```