// ==UserScript==
// @name         CS:GO Finder Extra
// @description  Uses a local NodeJS server to get player ids when spectating
// @version      0.2
// @author       Apina-32
// @namespace    https://greasyfork.org/users/779688
// @updateURL    https://github.com/Apina-32/csgo-gsi/raw/main/CSGO%20Finder%20Extra.user.js
// @downloadURL  https://github.com/Apina-32/csgo-gsi/raw/main/CSGO%20Finder%20Extra.user.js
// @match        http://localhost/
// @match        https://csgofinder.eu/
// @icon         https://icons.duckduckgo.com/ip2/undefined.localhost.ico
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("Get GOTV Players", getGOTVPlayers);

    function getGOTVPlayers(){
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://localhost:3001/api/users`,
            headers: {
                "Accept": "application/json" // If not specified, browser defaults will be used.
            },
            onload: response => {
                console.log(response.response)
                document.querySelector('#searchField').value = JSON.parse(response.response).join(' ');
                document.querySelector('#searchButton').click();
            }});
    }
})();
