const Class = require("./Class.js");

// from my BetterJS
Object.prototype.forEach = function (callback) {
    Object.keys(this).forEach((key, index) => {
        callback(key, this[key], index, this);
    });
}

module.exports = class {
    constructor (data) {
        const stats = JSON.stringify(data.player_stats);
        
        const classes = ["Triggerman", "Hunter", "Run N Gun", "Spray N Pray", "Vince", "Detective", "Marksman", "Rocketeer", "Agent", "Runner", "Bowman", "Commando"];
        
        const obj = {
            username: data.player_name,
            level: Math.max(1, Math.floor(0.03 * Math.sqrt(data.player_score))),
            levelProgress: Math.round(100 * ((0.03 * Math.sqrt(data.player_score)) - Math.floor(0.03 * Math.sqrt(data.player_score)))),
            score: data.player_score,
            displayName: (data.player_clan ? data.player_name + " [" + data.player_clan + "]" : data.player_name)
            id: data.player_id,
            lastPlayedClass: new Class(classes[stats.c]),
            stats: {
                timePlayed: {
                    mins: Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) % 60,
                    hours: Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) % 24,
                    days: Math.floor(Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) / 24),
            
                    toString(){
                        return Math.floor(Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) / 60) % 24 + "h " + Math.floor(Math.floor(data.player_timeplayed / 1000) / 60) % 60 + "m"
                    }
                },
            
                shots: stats.s,
                hits: stats.h,
                accuracy: stats.s / stats.h,
                
                nukes: stats.n,
                
                kills: data.player_kills,
                deaths: data.player_deaths,
                kdr: (data.player_kills / data.player_deaths).toFixed(2),
                
                gamesPlayed: data.player_games_played,
                wins: data.player_wins,
                losses: data.player_games_played - data.player_wins,
                wlr: (data.player_wins / (data.player_games_played - data.player_wins)).toFixed(2),
            
                kpg: (data.player_games_played / data.player_kills).toFixed(2)
            },
            social: {
                clan: data.player_clan ? data.player_clan : null,
                following: data.player_following || 0,
                followers: data.player_followed || 0,
            }
        };

        obj.forEach((k, v) => {
            this[k] = v
        });
    }
}
