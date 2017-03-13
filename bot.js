#!/home/user/.nvm/versions/node/v7.5.0/bin/node
/*
TO-DO:
- fix cracking
done. - fix catching pets catching shitty dynamic pets
    - calculate if enemy is NOT a dynamic monster (if IS, stop trying to catch)
        - get enemy's name. Look it up in a table of desired monsters.
    - calculate player's pet from adventure output hp
        - use that to calculate the pet's level, using table of desired monsters
        - if pet's hp not found in table, it's a dynamic pet, so try to catch! set pet level to 0
    - calculate player's level (divide hp from adventure output to get level)
        - using player's level and pet's level, decide if current opponent is a better pet
        - if so, try to catch.
done. - fix running this program without a config file
*/
const Discord = require('discord.js');
const client = new Discord.Client();
LOGGING = true;
var QUEUE = [];
function ENQUEUE(c){ !QUEUE.some(w => (new RegExp("^" + c)).test(w)) ? QUEUE.push(c) : null }
function DEQUEUE(c){ QUEUE = QUEUE.filter(w => !(new RegExp("^" + c)).test(w)) }
function ENQUEUE_READY(){ Object.keys(timestamps).forEach(command => command_is_ready(command) && ENQUEUE(command)) }
function command_is_ready(c){ return (c in timestamps && c in cooldowns) && timestamps[c] + cooldowns[c] < Date.now(); }
var messageBalancer = { balance: 0, update(m){ /*!/tired to do that/.test(m.content) &&*/ this.balance++ }, dec(){ this.balance-- }, valueOf(){ return this.balance; } }
var prefix = "#!", add_prefix = m => (!(new RegExp(prefix)).test(m) ? prefix + m : m);
var cooldowns = { 'adv': 15000, 'mine': 300000, 'chop': 300000, 'fish': 300000, 'forage': 300000, 'crack' : 10000, 'catch': 30000 };
var timestamps = { 'adv': Date.now() + 10000,  'mine': Date.now(), 'chop': Date.now(), 'fish': Date.now(), 'forage': Date.now(), 'crack': Date.now(), 'heal': Date.now(), 'pheal': Date.now(), 'catch': Date.now() };
var stamp = command => timestamps[command.split(' ')[0]] = Date.now();

// next - level up auto assign points
client.on('ready', () => { console.log('I am ready!'); });

client.on('message', message => {
    control(message);
    if (!pmfromdbot(message)) return;
    else messageBalancer.update(message); // UPDATE MESSAGE BALANCER +

    global.message = message

    if (global.LAST_WAS_CRACK){
        global.DONE_CRACKING = !/cracked.*and got/.test(message);
        global.LAST_WAS_CRACK = false;
    }

    if (/HP left/.test(message.content)){
        global.lastCombat = message; // used for pet catching
        heal(message) // If we adventured, then upon response, attempt to heal.
    }

    if (global.LOGGING) console.log(message.content)
})

function sendCommand(content, message = global.message){
    if (!message) return console.log("There is no global message object yet")
    if (!content) return console.log("There's no content to send")
    if (messageBalancer < 0) return console.log("Waiting for reply from server")

    if (!(content == 'catch' && !table_catch(message)/*want_to_catch(message)*/) &&
        !(content == 'crack' && global.DONE_CRACKING)
    ){ // unless would be really nice here
        message.channel.sendMessage(add_prefix(content))

        if (content == 'crack') global.LAST_WAS_CRACK = true;

        messageBalancer.dec() // UPDATE MESSAGE BALANCER -
    }
    else global.LOGGING && console.log("FAILED: ", content)// || console.log("both: ", !(content == 'catch' && !table_catch(message)), "catch: ", table_catch(message));

    stamp(content)
    DEQUEUE(content)
}
function control (message){
    if (!PMFromSelfToBot(message)) return;
    if (/#!stats/.test(message.content.toLowerCase())){
        stopRandomInterval();
        global.control_interval_timeout && clearTimeout(global.control_interval_timeout);
    } else if (/#!adventure \d/.test(message.content)){
        stopRandomInterval();
        global.control_interval_timeout && clearTimeout(global.control_interval_timeout);
        global.control_interval_timeout = setTimeout(stopRandomInterval, (process.argv[2] || credentials.hours) * 60 * 60 * 1000)
        main();
    }
}
var pmfromdbot = message =>
    message.author.username.toLowerCase().indexOf('discordrpg'.toLowerCase()) >= 0 && message.channel.id == credentials.channel_id;

var PMFromSelfToBot = message =>
    message.author.username.toLowerCase().indexOf(credentials.username.toLowerCase()) >= 0 && message.channel.id == credentials.channel_id;

// returns true if we're in combat and the enemy would make a better pet
/*function want_to_catch(message){
    if (!message) return null
    hps = message.content.replace(/,/g, '').match(/\d+/g);
    if (!hps) return null
    var [enemy, pet] = [hps[10], hps[6]];
    return enemy && pet && enemy * 0.75 > pet;
}*/

/* heals pet or player if under 30% health. Buys health potions after using */ POTION_RATE = 150 /* health potions */
function heal(message){
    if (!/\[.*adven.*?ture\]/.test(message.content)) return
    var nums = message.content.replace(/,/g, "").match(/\d+/g).map(n => Number(n))
    if (nums.length !== 13) return (global.IN_COMBAT = false); else global.IN_COMBAT = true
    var calcPercents = tuple => tuple[0] / tuple[1] * 100
    var calcPotionsNeeded = tuple => Math.floor((tuple[1] - tuple[0]) / 50)
    var pet = nums.slice(-8, -6)
    var player = nums.slice(-8 + 2, -6 + 2)

    if (calcPercents(player) < 30){
        ENQUEUE('heal ' + calcPotionsNeeded(player))
        global.POTIONS_USED = (global.POTIONS_USED || 0) + calcPotionsNeeded(player)
    }
    if (calcPercents(pet) < 30){
        ENQUEUE('pheal ' + calcPotionsNeeded(pet))
        global.POTIONS_USED = (global.POTIONS_USED || 0) + calcPotionsNeeded(pet)
    }

    if (global.POTIONS_USED > POTION_RATE) (global.POTIONS_USED -= POTION_RATE) && ENQUEUE(`buy health potion ${POTION_RATE}`)
}

function randomInterval(cb, min, max){
    global.RI = (global.RI || []).concat(setTimeout(function(){
        cb();
        randomInterval(cb, min, max);
    }, Math.floor(Math.random() * (max - min) + min)));
    global.RI.length > 40 && global.RI.shift(); // keep it from getting too big with stale intervals
}
function stopRandomInterval(){ global.RI && global.RI.forEach(ri => clearTimeout(ri)) || (global.RI = []) }

// Might as well be int main
var main = () => randomInterval(function(){
    if (QUEUE.length) sendCommand(QUEUE[0])

    ENQUEUE_READY();
}, 1 * 1000, 5 * 1000); // after waiting randomly from 1 to 5 seconds
//main();

// Make this all hinge on reading a config file. If the config file isn't found or is empty, abort
(require('fs')).readFile('config.json', 'utf8', (e, d) => {
    if (e) throw e;
    global.credentials = JSON.parse(d);

    //setTimeout(process.exit, (process.argv[2] || credentials.hours) * 60 * 60 * 1000);
    //setTimeout(stopRandomInterval, (process.argv[2] || credentials.hours) * 60 * 60 * 1000);
    client.login(process.argv[3] || credentials.token);
})

function table_catch (message){
// taken from catch function
    if (!message) return console.log("Message is empty");
    if (!global.lastCombat) return console.log("No combat to use yet!")
    //hps = message.content.replace(/,/g, '').match(/\d+/g);
    hps = global.lastCombat.content.replace(/,/g, '').match(/\d+/g);
    if (!hps) return console.log("Couldn't calculate hps from message")
    var [enemy, pet] = [hps[10], hps[6]]; // Gives the amount of MAX hp the enemy and pet have. We can use this to find the pet and enemy in our petTable
    var isPet = msg => !!pet_table.getBy({ attribute: 'name', value: msg.match(/[A-Z][a-z]+/g).pop() });
    
// taken from heal function
    //if (!/\[.*adven.*?ture\]/.test(message.content)) return console.log("last message wasn't an adventure. aborting catch");
    if (!global.IN_COMBAT) return console.log("We're not in combat! Can't catch.");
    //var nums = message.content.replace(/,/g, "").match(/\d+/g).map(n => Number(n))
    var nums = global.lastCombat.content.replace(/,/g, "").match(/\d+/g).map(n => Number(n))
    if (nums.length !== 13){ return console.log("nums.length !== 13, aborting catch"), (global.IN_COMBAT = false); } else global.IN_COMBAT = true // glitchy?
    var player_level = nums.slice(-8 + 2, -6 + 2).pop() / 50;

    //console.log("Enemy: ", enemy)
    //console.log("Pet: ", pet)
    //console.log("hps: ", hps);
    enemy = pet_table.getBy({ attribute: 'pethp', value: enemy });
    pet = pet_table.getBy({ attribute: 'pethp', value: pet });

    //console.log("Player level: ", player_level, "Enemy HP: ", (enemy ? enemy.level : enemy), "PetHP: ", (pet ? pet.level : pet));

    if (!enemy) return !!console.log("Enemy is a dynamic pet! Aborting catch"); // if enemy isn't in our table, don't catch. We don't want dynamic pets, they suck.

    if (!pet) return !console.log("Our pet is a dynamic pet - attempting catch!"); // if our pet is null it's a dynamic pet so attempt to replace it with a better, non-dynamic pet

    return Number(pet.level) < Number(enemy.level) && isPet(message.content); // Neither our pet nor the enemy is dynamic. If the enemy has a higher level it's better so catch.
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


