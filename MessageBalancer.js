"use strict"

// produces amount of minutes as milliseconds,
// and returns that doubled with every next()
// returns 5, 10, 20, 30, 60, 120, etc, minutes
function * waitGenerator(STARTMINUTES){
    const min2milli = m => m * 60 * 1000;
    var minutes2wait = STARTMINUTES || 5; // default params not on node v4.2 lol

    while (true){
        yield min2milli(minutes2wait)
        minutes2wait *= 2;
    }
}

/*
    Sending messages constantly without a reply would be an obvious sign of botting.

    In order to not appear as a bot (aka not get caught), MessageBalancer will wait
    5, 10, 20, 30 minutes, then an hour, two, and so on, before setting itself to
    ready, if it has not received a message from discordRPG.

    When MessageBalancer::waiting is true, the main program will not send messages.

    Whenever the bot receives a message from discordRPG, call receivedMessage,
    which sets waiting to false. Then create/overwrite a closure/generator which will
    produce minutes to wait before MessageBalancer sets itself to ready automatically.
*/
class MessageBalancer {
    constructor(){
        // old
        this.balance = 0
        // new
        this.ready = true

        try {
            this.context = global
        } catch (exception) {
            this.context = window
        }
    }
    // outdated
    valueOf(){ return this.balance }
    // new
    get waiting(){
        return !this.ready;
    }
    set waiting(x){ this.ready = !x; }

    sentMessage(){
        // old
        this.balance++
        // new
        this.ready = false

        if (this.minuteMaker)
            this.timeout = this.context.setTimeout(
                () => { this.waiting = false } // arrow functions preserve this - no global this error!
                , this.minuteMaker.next())
    }

    receivedMessage(){
        // old
        this.balance--
        // new
        this.ready = true
        this.minuteMaker = waitGenerator()

        if (this.timeout)
            this.context.clearInterval(this.timeout)
    }
}

module.exports = MessageBalancer;

/*var lb = new MessageBalancer();
console.log(lb)

lb.sentMessage();
console.log(lb)

lb.receivedMessage();
console.log(lb)

var generator = waitGenerator();
console.log(generator.next())
console.log(generator.next())
console.log(generator.next())
console.log(generator.next())*/
