const fetch = require('node-fetch');

const base = 'https://api.hypixel.net/';

async function verifyAccountName(username) {
    let mojang = 'https://api.mojang.com/';
    let method = `users/profiles/minecraft/${username}`;
    let response = await fetch(mojang + method);
    if (response.statusText === "OK") return true;
    return false;
}

async function verifyAccountUuid(uuid) {
    let mojang = 'https://api.mojang.com/';
    let method = `user/profile/${uuid}`;
    let response = await fetch(mojang + method);

    if (response.statusText === "OK") return true;
    return false;
}

async function nameToUuid(username) {
    let mojang = 'https://api.mojang.com/';
    let method = `users/profiles/minecraft/${username}`;
    let response = await fetch(mojang + method);

    if (response.statusText !== "OK") return response;

    let json = await response.json();

    if (json.id) return json.id;
    return json;
}

async function uuidToName(uuid) {
    let mojang = 'https://api.mojang.com/';
    let method = `user/profile/${uuid}`;
    let response = await fetch(mojang + method);

    if (response.statusText !== "OK") return response;

    let json = await response.json();

    if (json.name) return json.name;
    return json;
}

async function getFriendsByUuid(uuid, key) {
    if (!key) return "key required";
    let method = `friends?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json.records;
    return json;
}

async function getFriendsByName(name, key) {
    if (!key) return "key required";
    let uuid = await nameToUuid(name);
    if (!uuid) return json;
    let method = `friends?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json.records;
    return json;
}

async function getPlayerByName(username, key) {
    if (!key) return "key required";
    let uuid = await nameToUuid(username);

    if (!await verifyAccountName(username)) return null;
    let method = `player?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getPlayerByUuid(uuid, key) {
    if (!key) return "key required";
    if (!await verifyAccountUuid(uuid)) return null;
    let method = `player?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getGuildByName(name, key) {
    if (!key) return "key required";
    let method = `guild?name=${name}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getGuildByPlayer(uuid, key) {
    if (!key) return "key required";
    let method = `guild?player=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getGuildByPlayerName(username, key) {
    if (!key) return "key required";
    let uuid = await nameToUuid(username);
    let method = `guild?player=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getGuildById(id, key) {
    if (!key) return "key required";
    let method = `guild?id=${id}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getLevelByName(username, key) {
    if (!key) return "key required";
    if (await verifyAccountName(username)) return null;
    let player = await getPlayerByName(username, key);
    if (player === null) return json;

    let exp = player.networkExp;
    let base = 10000;
    let growth = 2500;
    let reversePqPrefix = -(base - 0.5 * growth) / growth;
    let reverseConst = reversePqPrefix ** 2;

    return exp < 0 ? 1 : Math.floor(1 + reversePqPrefix + Math.sqrt(reverseConst + 2 / growth * exp));
}

async function getLevelByUuid(uuid, key) {
    if (!key) return "key required";
    if (await verifyAccountUuid(uuid)) return json;
    let player = await getPlayerByUuid(uuid, key);
    if (player === null) return json;

    let exp = player.networkExp;
    let base = 10000;
    let growth = 2500;
    let reversePqPrefix = -(base - 0.5 * growth) / growth;
    let reverseConst = reversePqPrefix ** 2;

    return exp < 0 ? 1 : Math.floor(1 + reversePqPrefix + Math.sqrt(reverseConst + 2 / growth * exp));
}

async function getWatchdog(key) {
    if (!key) return "key required";
    let method = `watchdogstats?&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getGameCounts(key) {
    if (!key) return "key required";
    let method = `playerCount?&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json;
    return json;
}

async function getPlayerGamesByName(username, key) {
    if (!key) return "key required";
    if (await verifyAccountName(username)) return null;

    let uuid = await nameToUuid(username);

    let method = `recentGames?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json.games;
    return json;
}

async function getPlayerGamesByUuid(uuid, key) {
    if (!key) return "key required";
    if (await verifyAccountUuid(uuid)) return json;

    let method = `recentGames?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json.games;
    return json;
}

async function getKey(key) {
    if (!key) return "key required";
    let method = `key?key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json.record;
    return json;
}

async function getStatusByName(username, key) {
    if (!key) return "key required";
    if (await verifyAccountName(username)) return null;

    let uuid = await nameToUuid(username);

    let method = `status?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json.session;
    return json;
}

async function getStatusByUuid(uuid, key) {
    if (!key) return "key required";
    if (await verifyAccountUuid(uuid)) return json;

    let method = `status?uuid=${uuid}&key=${key}`;
    let json = await fetch(base + method).then(res => res.json());

    if (json.success === true) return json.session;
    return json;
}

module.exports = {
    getStatusByUuid, getStatusByName, getPlayerGamesByName, getPlayerGamesByUuid, getGuildByPlayerName, getPlayerByName, getPlayerByUuid, getLevelByName, getLevelByUuid, getKey, getWatchdog, getGameCounts, getGuildByName, getGuildByPlayer, getGuildById, getFriendsByUuid, getFriendsByName, nameToUuid, uuidToName, verifyAccountName, verifyAccountUuid
};