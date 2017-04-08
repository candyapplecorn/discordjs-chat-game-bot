#!/home/user/.nvm/versions/node/v7.5.0/bin/node
/*
TO-DO:
    - fix cracking
    - add support for named pets
*/
var { randomInterval, stopRandomInterval } = require('./randomInterval.js')
var MessageBalancer = require('./MessageBalancer.js')
var petCatcher = require('./petCatcher.js')
var heal = require('./heal.js')
var flibhunt = require('./flibknortHunt.js')
const Discord = require('discord.js');
const client = new Discord.Client();
var messageBalancer = new MessageBalancer();


LOGGING = true;
var QUEUE = [];
function ENQUEUE(c){ !QUEUE.some(w => (new RegExp("^" + c)).test(w)) ? QUEUE.push(c) : null }
function DEQUEUE(c){ QUEUE = QUEUE.filter(w => !(new RegExp("^" + c)).test(w)) }
function ENQUEUE_READY(){ Object.keys(timestamps).forEach(command => command_is_ready(command) && ENQUEUE(command)) }
function command_is_ready(c){ return (c in timestamps && c in cooldowns) && timestamps[c] + cooldowns[c] < Date.now(); }
//var messageBalancer = { balance: 0, update(m){ /*!/tired to do that/.test(m.content) &&*/ this.balance++ }, dec(){ this.balance-- }, valueOf(){ return this.balance; } }
var prefix = "#!", add_prefix = m => (!(new RegExp(prefix)).test(m) ? prefix + m : m);
var cooldowns = { 'adv': 15000, 'mine': 300000, 'chop': 300000, 'fish': 300000, 'forage': 300000, 'crack' : 10000, 'catch': 30000 };
var timestamps = { 'adv': Date.now() + 10000,  'mine': Date.now(), 'chop': Date.now(), 'fish': Date.now(), 'forage': Date.now(), 'crack': Date.now(), 'heal': Date.now(), 'pheal': Date.now(), 'catch': Date.now() };
var stamp = command => timestamps[command.split(' ')[0]] = Date.now();

// next - level up auto assign points
client.on('ready', () => { console.log('I am ready!'); });

client.on('message', message => {
    control(message);
    if (!pmfromdbot(message)) return;
    //else messageBalancer.update(message); // UPDATE MESSAGE BALANCER +
    else messageBalancer.receivedMessage();

    global.message = message

    // Flibknort Hunt!
    if (global.credentials && JSON.parse(global.credentials.flibhunt) === true)
        flibhunt(message, ENQUEUE);
    else {
        try {
            console.log(global.credentials.flibhunt, JSON.parse(global.credentials.flibhunt) === true)
        } catch (e) { console.log(e) }
    }

    if (global.LAST_WAS_CRACK){
        global.DONE_CRACKING = !/cracked.*and got/.test(message);
        global.LAST_WAS_CRACK = false;
    }

    if (/HP left/.test(message.content)){
        global.lastCombat = message; // used for pet catching
        heal(message, ENQUEUE) // If we adventured, then upon response, attempt to heal.
    }

    if (global.LOGGING) console.log(message.content)
})

function sendCommand(content, message = global.message){
    if (!message) return console.log("There is no global message object yet")
    if (!content) return console.log("There's no content to send")
    //if (messageBalancer < 0) return console.log("Waiting for reply from server")
    if (messageBalancer.waiting) return console.log("Waiting for reply from server")

    if (!(content == 'catch' && !petCatcher(message)/*table_catch(message)*//*want_to_catch(message)*/) &&
        !(content == 'crack' && global.DONE_CRACKING)
    ){ // unless would be really nice here
        message.channel.sendMessage(add_prefix(content))

        if (content == 'crack') global.LAST_WAS_CRACK = true;

        //messageBalancer.dec() // UPDATE MESSAGE BALANCER -
        messageBalancer.sentMessage() // UPDATE MESSAGE BALANCER -
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
