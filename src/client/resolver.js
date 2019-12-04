const Class = require("../structures/Class.js");
const Weapon = require("../structures/Weapon.js");

module.exports = {
    classNameArray(arr) {
        arr = Array.from(new Set(arr));
        if (arr.some(v => Boolean(new Class(v)))) return arr.filter(v => Boolean(new Class(v)));
        if (arr.some(v => v instanceof Class && new Class(v.name))) return arr.filter(v => v instanceof Class && new Class(v.name)).map(v => v.name);
        if (arr.some(v => Boolean(new Weapon(v)))) return arr.filter(v => Boolean(new Class(v))).map(w => w.name);
    }
};
