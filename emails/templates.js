
const globalStyle = `
body {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin: 0 auto;
    color: #333333;
    background-color: white;
    padding: 20px;
}
.container {
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    height: 100%;
    padding: 20px;
}
p, h1, h2, h3, h4, h5, h6 {
    text-align: center;
}
h1 {
    font-size: 24px;
}
a {
    color: #0F2E53;
    text-decoration: none;
    font-weight: bold;
}
a.button {
    display: inline-block;
    margin: 16px 0;
    background-color: #6203fc;
    color: white;
    border-radius: 8px; 
    padding: 6px 12px;
}
`;

const resetPasswordTemplate = (resetToken) => `
    <html>
        <head>
            <title>Reset Your Password</title>
            <style>${globalStyle}</style>
        </head>
        <body>
        <div class="container">
        <div style="display: flex; align-items: center; justify-content: center;"><a href="https://krastie.ai"><img src="${process.env.FRONTEND_URL}/images/logo.png" style="width: 150px;"></img></a></div>
        
        <h1>Reset Your Password</h1>
        <p>Hey there!</p>
        <p>You are about to reset your password. Continue to do so by following this link:</p>
        <p><a class="button" href="${process.env.FRONTEND_URL}/reset?token=${resetToken}" target="_blank">Reset Password</a></p>
        <p>Or paste the url in your browser: ${process.env.FRONTEND_URL}/reset?token=${resetToken}</p>
        <p>You can ignore if you remembered your password</p>
        <p style="margin-top: 40px;">
            ${process.env.NAME} 👋<br/>
            <a href="${process.env.HOMEPAGE_URL}" target="_blank">${process.env.PRODUCT_NAME}</a>
        </p>
        </div>
        </body>
    </html>
`;

const emailConfirmationTemplate = (activationToken) => `
    <html>
        <head>
            <title>Confirm Your Email</title>
            <style>${globalStyle}</style>
        </head>
        <body><div class="container">
        <div style="display: flex; align-items: center; justify-content: center;"><a href="https://krastie.ai"><img src="${process.env.FRONTEND_URL}/images/logo.png" style="width: 150px;"></img></a></div>
            <h1>Confirm Your Email</h1>
            <p>Welcome to <strong>${process.env.PRODUCT_NAME}</strong>!</p>
            <p>Let's confirm your email address. Please click the button to confirm your email address:</p>
            <p><a class="button" href="${process.env.BACKEND_URL}/users/activate/${activationToken}" target="_blank">Confirm Email Address</a></p>
            <p>Or paste the url in your browser: ${process.env.BACKEND_URL}/users/activate/${activationToken}</p>
            <p>Please confirm within 1 hour</p>
            <p style="margin-top: 40px;">
                ${process.env.NAME} 👋<br/>
                <a href="${process.env.HOMEPAGE_URL}" target="_blank">${process.env.PRODUCT_NAME}</a>
            </p>
            </div>
        </body>
    </html>
`;

exports.resetPasswordTemplate = resetPasswordTemplate;
exports.emailConfirmationTemplate = emailConfirmationTemplate;