
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

const welcomeTemplate = (name, config) => `
    <html>
        <head>
            <title>Welcome</title>
            <style>${globalStyle}</style>
        </head>
        <body>
        <div class="container">
        <div style="display: flex; align-items: center; justify-content: center;"><a href="https://krastie.ai"><img src="https://${process.env.FRONTEND_URL}/krastie-ai-logo-color.png" style="width: 150px;"></img></a></div>
        <h1>Welcome to Krastie AI</h1>
        <p>Stat using Krastie AI today and write like a professional with our built in Krastie chatbot and AI autocomplete.:</p>
        <p><a class="button" href="https://${process.env.FRONTEND_URL}/dashboard" target="_blank">Start now</a></p>
        <p style="margin-top: 40px;">
            Sewell Stephens 👋<br/>
            <a href="https://krastie.ai" target="_blank">Krastie AI</a>
        </p>
        </div>
        </body>
    </html>
`;

const emailConfirmationTemplate = (activationToken, config) => `
    <html>
        <head>
            <title>Confirm Your Email</title>
            <style>${globalStyle}</style>
        </head>
        <body><div class="container">
        <div style="display: flex; align-items: center; justify-content: center;"><a href="https://krastie.ai"><img src="https://${process.env.FRONTEND_URL}/krastie-ai-logo-color.png" style="width: 150px;"></img></a></div>
            <h1>Confirm Your Email</h1>
            <p>Welcome to <strong>Krastie AI</strong>!</p>
            <p>Please click the link to confirm your email</p>
            <p><a class="button" href="https://api.krastie.ai/users/activate/${activationToken}" target="_blank">Confirm Email Address</a></p>
            <p>Or copy and paste the following link into your browser: https://api.krastie.ai/users/activate/${activationToken}</p>
            <p>Token expires in one hour</p>
            <p style="margin-top: 40px;">
                Sewell Stephens 👋<br/>
                <a href="https://krastie.ai" target="_blank">Krastie AI</a>
            </p>
            </div>
        </body>
    </html>
`;

const customEmailTemplate = (content, email) => `
    <html>
        <head>
            <title>Email</title>
            <style>${globalStyle}</style>
        </head>
        <body>
        <body><div class="container">
         ${content}
           <a href="https://api.krastie.ai/users/unsubscribe/${email}">Unsubscribe</a>
            <p style="margin-top: 40px;">
                Sewell Stephens 👋<br/>
                <a href="https://krastie.ai" target="_blank">Krastie AI</a>
            </p>
            </div>
        </body>
        </body>
    </html>
`;

exports.emailConfirmationTemplate = emailConfirmationTemplate;
exports.welcomeTemplate = welcomeTemplate;
exports.customEmailTemplate = customEmailTemplate;