# Simple Express authorization

**PLEASE NOTE: UPDATES WILL CURRENTLY BE MINIMAL DUE TO LACK OF SUPPORT!!! TO KEEP THIS PROJECT ALIVE, PLEASE SUPPORT IT BY OPENING GITHUB ISSUES OR BETTER SPONSOR THE PROJECT [HERE](https://github.com/sponsors/sewellstephens)**

Simple Express authorization promises to make authorization in Express super easy. Its the most straightforward and minimal framework on the market. **No PassportJS used.**

### What it includes:

- Google Auth
- Email and password Auth
- Uses MongoDB

### How to set it up:

**Step 1: clone repo or copy desired code**

```
git clone https://github.com/sewellstephens/express-authorize.git
```

**Step 2: Install dependencies**

```
npm i
```

**Step 3: Update .env with your values**

IMPORTANT: MongoDB URI is required in order to connect to your database. Feel free to modify the code to use a different database.

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

Thats it! You're all set!

### Routes to get familiar with

**/users/signup (POST)**

Sent a post request to signup user with password.

Requires body formatted as follows:

```
{
    name: usersName,
    email: usersEmail,
    password: usersPassword
}
```

**/users/login (POST)**

Send a post request to login user with password.

Requires body formatted as follows:

```
{
    email: usersEmail,
    password: usersPassword
}
```

**/users/google (GET)**

Gets a Google authorization URL based on Client ID and Secret defined in ENV file.

**/users/googleCallback (GET)**

Add this in when setting up your Google consent prompt.

**/users/logout (POST)**

Logs out a user.

**/users/account (GET)**

Gets user information stored in MongoDB.

**/users/account (PUT)**

Updates user email, password, and/or name.

Requires body formatted as follows:

```
{
    name: usersName,
    email: usersEmail,
    password: usersPassword
}
```

**/users/activate/:token (GET)**

Used when activating account, or when two factor is enabled.

**/users/resetToken (POST)**

Used for sending password reset email.

**/users/resetPassword (POST)**

Used for reseting password.

**/users/delete (POST)**

Used for deleting user.

**/users/activateTwoFactor**

Used for activating two factor.

Requires body formatted as follows:

```
{
    enabledState: enabledState
}
```
