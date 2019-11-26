module.exports = class {
    constructor (name = "Assault Rifle") {
        const assaultRifle = {
            name: "Assault Rifle",
            swapTime: 300,
            aimSpeed: 130,
            speedMultiplier: 0.95,
            ammo: 30,
            reloadTime: 1200,
            damage: {
                dropoff: 5,
                damage: 23,
                toNumber(){
                    return 23;
                }
                toString(){
                    return "23";
                }
            },
            range: 700,
            rateOfFire: 110,
            spread: 100,
            zoom: 1.6,
            recoil: 0.003
        };
    
        const sniperRifle = {
            swapTime: 300,
            aimSpeed: 120,
            speedMultiplier: 0.95,
            ammo: 3,
            reloadTime: 1500,
            damage: {
                dropoff: 30,
                damage: 100
            },
            range: 1000
            rateOfFire: 900,
            spread: 260,
            zoom: 2.7,
            recoil: 0.009
        };
        
        return {
            assaultRifle, sniperRifle
        }[str.split(" ")[0].toLowerCase() + str.split(" ")[1][0].toUpperCase() + str.split(" ")[1].toLowerCase().substring(1)];
    }
}
