"use strict"

/*
    petCatcher will take the last combat message
    and return true if we want to attempt to catch
    else false
*/
function petCatcher(message) {
    if (!message) return !!console.log('Not catching - no message argument.')
    var lines = message.content.split(/\n/)
    var plusPrefix = lines.filter(e => /\+/.test(e))

    if (plusPrefix.length == 5)
        var ownedPetName = plusPrefix[2].split(' ')[1],
            enemyName    = plusPrefix[4].split(' ')[3];
    else if (plusPrefix.length == 6 && plusPrefix.some(l => /Critical/.test(l)))
            ownedPetName = plusPrefix[2].split(' ')[1],
            enemyName    = plusPrefix[5].split(' ')[3];
    else
        return !!console.log("Not catching - not in combat.");

    var ownedPet = pet_table.getByName(ownedPetName)
    var enemy    = pet_table.getByName(enemyName)

    if (!enemy)
        return !!console.log('Not catching - enemy is dynamic.')

    if (!ownedPet)
        return !console.log('Owned pet is a dynamic pet - catching.')

    return enemy.level > ownedPet.level;
}

var pet_table = {
    // getBy takes an object with an attribute and value and returns a pet object who matches
    // the attribute's value.
    getBy(obj){
        if        (obj.attribute == 'health') {
            var health = Number(obj.value);
            return this.pets.find(pet => pet.health == obj.value);
        } else if (obj.attribute == 'pethp') {
            var pethp = Number(obj.value);
            return this.pets.find(pet => pet.pethp == obj.value);
        } else if (obj.attribute == 'level') {
            var level = Number(obj.value);
            return this.pets.find(pet => pet.level == obj.value);
        } else if (obj.attribute == 'damage') {
        } else if (obj.attribute == 'name') {
            return this.pets.find(pet => pet.name.toLowerCase().indexOf(obj.value.toLowerCase()) > -1);
        } else return null;
    },
    // extend old code
    getByName(name){
        return this.getBy({attribute: 'name', value: name })
    },
    pets: [
    {  health: "40",        level: "1",       pethp: "30",        damage: "0-1",          name: "Kloid Oglurth Ogre"  },
    {  health: "55",        level: "1",       pethp: "55",        damage: "0-3",          name: "Octocat"  },
    {  health: "80",        level: "2",       pethp: "60",        damage: "1-2",          name: "Zerp Zulp"  },
    {  health: "135",       level: "3",       pethp: "101",       damage: "2-4",          name: "Syrp Zarth"  },
    {  health: "185",       level: "4",       pethp: "138",       damage: "3-5",          name: "Lurght Ulgrth"  },
    {  health: "200",       level: "5",       pethp: "150",       damage: "4-6",          name: "Leirgth Zeil"  },
    {  health: "225",       level: "6",       pethp: "168",       damage: "5-6",          name: "Plirgh Ploirgh"  },
    {  health: "250",       level: "7",       pethp: "187",       damage: "5-7",          name: "Hulp Hylf"  },
    {  health: "300",       level: "8",       pethp: "225",       damage: "6-8",          name: "Serth Sirph"  },
    {  health: "310",       level: "9",       pethp: "232",       damage: "6-9",          name: "Bleght Blith"  },
    {  health: "350",       level: "10",      pethp: "262",       damage: "7-10",         name: "Plombth Polrght"  },
    {  health: "500",       level: "11",      pethp: "375",       damage: "8-11",         name: "Jerlp Larpf"  },
    {  health: "525",       level: "12",      pethp: "393",       damage: "9-12",         name: "Aregon Rezq"  },
    {  health: "600",       level: "13",      pethp: "450",       damage: "10-15",        name: "Gorgo Urgun"  },
    {  health: "625",       level: "14",      pethp: "468",       damage: "12-17",        name: "Brshek Deldu"  },
    {  health: "650",       level: "15",      pethp: "487",       damage: "15-20",        name: "Glognak Kotilon Manotor"  },
    {  health: "750",       level: "16",      pethp: "562",       damage: "17-22",        name: "Hylonin Plirgh"  },
    {  health: "800",       level: "17",      pethp: "600",       damage: "22-27",        name: "Deakon Velor"  },
    {  health: "825",       level: "18",      pethp: "618",       damage: "25-30",        name: "Otinonen Sigia"  },
    {  health: "900",       level: "19",      pethp: "675",       damage: "32-37",        name: "Largyfo Mytmat"  },
    {  health: "950",       level: "20",      pethp: "712",       damage: "37-42",        name: "Oginior Rectex"  },
    {  health: "1000",     level: "21",      pethp: "750",       damage: "42-47",        name: "Flibknort"  },
    {  health: "1500",     level: "31",      pethp: "1125",     damage: "45-58",        name: "Poxvader"  },
    {  health: "2000",     level: "41",      pethp: "1500",     damage: "55-68",        name: "Terist"  },
    {  health: "1600",     level: "51",      pethp: "1200",     damage: "50-100",       name: "Blinky"  },
    {  health: "2800",     level: "61",      pethp: "2100",     damage: "88-93",        name: "Apeldoom"  },
    {  health: "3500",     level: "71",      pethp: "2625",     damage: "95-105",       name: "Fenrir"  },
    {  health: "3000",     level: "81",      pethp: "2250",     damage: "100-123",     name: "Tokimeki"  },
    {  health: "4000",     level: "91",      pethp: "3000",     damage: "125",          name: "Clyde"  },
    {  health: "1800",     level: "100",     pethp: "1350",     damage: "60-155",       name: "Meltion"  },
    {  health: "6000",     level: "100",     pethp: "4500",     damage: "50-250",       name: "Overlord"  },
    {  health: "2100",     level: "125",     pethp: "1575",     damage: "150-175",     name: "Gelion"  },
    {  health: "2800",     level: "150",     pethp: "2100",     damage: "150-225",     name: "Baltion"  },
    {  health: "3900",     level: "175",     pethp: "2925",     damage: "225-300",     name: "Hellion"  },
    {  health: "10000",    level: "200",     pethp: "7500",     damage: "500",          name: "Colossus"  },
    {  health: "10000",    level: "211",     pethp: "7500",     damage: "500-1000",     name: "Bluerght"  }]
};

module.exports =  petCatcher;
