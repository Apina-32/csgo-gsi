
const responseUtils = require("../utils/responseUtils");
const requestUtils = require("../utils/requestUtils");
let userIds = [];

/**
 *
 * @param response http response
 * @returns {Promise<*>} resolves to json of all users in game
 */
const getAllUsers = async (response)=>{
    return responseUtils.sendJson(response, userIds);
}

const setUserData = (data) => {
    if(data.allplayers !== undefined)userIds = Object.keys(data.allplayers);
}

module.exports = { getAllUsers, setUserData };
