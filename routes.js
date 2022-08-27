const responseUtils = require('./utils/responseUtils');
const {renderPublic} = require('./utils/render');
const requestUtils = require('./utils/requestUtils');
const usersController = require("./controllers/users");

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
    '/api/users': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response Http response
 */
const sendOptions = (filePath, response) => {
    if (filePath in allowedMethods) {
        response.writeHead(204, {
            'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
            'Access-Control-Allow-Headers': 'Content-Type,Accept',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Expose-Headers': 'Content-Type,Accept'
        });
        return response.end();
    }

    return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix sub path
 * @returns {boolean} True if url contains ID
 */
const matchIdRoute = (url, prefix) => {
    const idPattern = '[0-9a-z]{8,24}';
    const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
    return regex.test(url);
};

const handleRequest = async (request, response) => {
    const {url, method, headers} = request;
    const filePath = new URL(url, `http://${headers.host}`).pathname;
    // serve static files from public/ and return immediately
    if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
        const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
        return renderPublic(fileName, response);
    }

    if (method.toUpperCase() === 'POST') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        usersController.setUserData(await requestUtils.parseBodyJson(request));
    }

    // Default to 404 Not Found if unknown url
    if (!(filePath in allowedMethods)) {
        return responseUtils.notFound(response);
    }

    // See: http://restcookbook.com/HTTP%20Methods/options/
    if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

    // Check for allowable methods
    if (!allowedMethods[filePath].includes(method.toUpperCase())) return responseUtils.methodNotAllowed(response);

    // Require a correct accept header (require 'application/json' or '*/*')
    if (!requestUtils.acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
    }

    // GET all users
    if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
            return await usersController.getAllUsers(response);
    }
};

module.exports = {handleRequest};
