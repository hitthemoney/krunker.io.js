const ws = require("ws"); // socket for fetching players
const req = require("request"); // fetching games
const fetch = require("node-fetch"); // fetching txt file (changelog)
const { encode, decode } = require("msgpack-lite"); // encoding and decoding for the socket
const { Collection } = require("discord.js"); // credit to discord.js for Collections, a better version of JS Maps (discord.js.org)

 // more organized than the recieved data
const Player = require("../structures/Player.js");
const Game = require("../structures/Game.js");
const Changelog = require("../structures/Changelog.js");

const Weapon = require("../structures/Weapon.js");
const Class = require("../structures/Class.js");

// errors
const KrunkerAPIError = require("../errors/KrunkerAPIError.js");
const ArgumentError = require("../errors/ArgumentError.js");

Object.prototype.forEach = function (callback) {
    Object.keys(this).forEach((key, index) => {
        callback(key, this[key], index, this);
    });
}

module.exports = class Client {
    constructor () {
        this._cache = new Collection();
        Object.defineProperty(this, "_updateCache", {
            value: async () => {
                const usernames = this._cache.keyArray().map(d => d.username);
            
                for(const un of usernames) {
                    const u = await this.fetchPlayer(un);
                    this._cache.set(u.username + "_" + u.id, u);
                }
            },
            writable: false
        });
    }
    _connectToSocket () {
        this.ws = new ws("wss://krunker_social.krunker.io/ws", {
            handshakeTimeout: 10000
        });
    }
    _disconnectFromSocket () {
        if (this.ws && this.ws.readyState === 1) this.ws.close();
    }
    fetchPlayer(username) {
        this._connectToSocket();
        return new Promise((res, rej) => {
            if (!username) return rej(new ArgumentError("No username given."));
            this.ws.onopen = () => this.ws.send(encode(["r", ["profile", username, "000000", null]]).buffer);
            this.ws.onerror = err => {
                this.ws.terminate();
                rej(err);
            };
            
            this.ws.onmessage = buffer => {
                const userData = decode(new Uint8Array(buffer.data))[1][2];
                this._disconnectFromSocket();
                if (!userData || !userData.player_stats) return rej(new KrunkerAPIError("Player not found"));
                const p = new Player(userData);
                this._cache.set(p.username + "_" + p.id, p);
                res(p);
            };
        });
    }
    fetchClan(name) {
        this._connectToSocket();
        return new Promise((res, rej) => {
            if (!name) return rej(new ArgumentError("No clan name given."));
            this.ws.onopen = () => this.ws.send(encode(["r", ["clan", name, "000000", null]]).buffer);
            this.ws.onerror = err => {
                this.ws.terminate();
                rej(err);
            };
            
            this.ws.onmessage = buffer => {
                const clanData = decode(new Uint8Array(buffer.data))[1][2];
                this._disconnectFromSocket();
                if (!clanData) return rej(new KrunkerAPIError("Clan not found"));
                res(p);
            };
        });
    }
    getPlayer(nameOrID) {
        if (!nameOrID) throw new ArgumentError("No name or ID given.");
        const u = this._cache.find(obj => [obj.id, obj.username].includes(nameOrID));
        if (!u) return this.fetchPlayer(nameOrID);
        this._updateCache();
        return u;
    }
    fetchGame(id) {
        return new Promise((res, rej) => {
            if (!id) return rej(new ArgumentError("No ID given"));
            id = id.match(/[A-Z]{2,3}:[a-z0-9]+/);
            if (!id) return rej(new ArgumentError("Invalid ID given"));
            id = id[0];
            req("https://matchmaker.krunker.io/game-info?game=" + id, (err, _, body) => {
                body = JSON.parse(body);
                if (!body[0]) return rej(new KrunkerAPIError("Game not found"));
                
                res(new Game(body));
            });
        });
    }
    fetchChangelog() {
        return new Promise(async r => r(new Changelog(await (await fetch("https://krunker.io/docs/versions.txt")).text())));
    }
    getClass(name) {
        return new Class(name);
    }
    getWeapon(name) {
        return new Weapon(name);
    }
}
