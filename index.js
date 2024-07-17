const allRoutes = require('./routes/allRoutes');
const googleRoutes = require('./routes/onlyGoogle');
const passwordRoutes = require('./routes/onlyPassword');

exports.simpleExpressAuth = function(config) {
    if (!config) {
        return allRoutes;
    }
    else if (config.googleOnly) {
        return googleRoutes;
    }
    else if (config.passwordOnly) {
        return passwordRoutes;
    }
}