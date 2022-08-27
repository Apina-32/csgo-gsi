// ==UserScript==
// @name         CS:GO Finder Extra
// @namespace    https://greasyfork.org/users/779688
// @version      0.1
// @description  Uses a local NodeJS server to get player ids when spectating
// @author       Apina-32
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
                const input = document.querySelector('#searchField');
                input.value = "";
                JSON.parse(response.response).forEach(id => {
                    input.value += id + " ";
                });
                document.querySelector('#searchButton').click();
            }});
    }
})();