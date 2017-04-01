'use strict'

/*
 * heals pet or player if under 30% health.
 * Buys health potions after using */ global.POTION_RATE = 150 /*
 * health potions
 */
function heal(message, ENQUEUE){
    if (!/\[.*adven.*?ture\]/.test(message.content)) return
    var nums = message.content.replace(/,/g, "").match(/\d+/g).map(n => Number(n))
    if (nums.length !== 13) return (global.IN_COMBAT = false); else global.IN_COMBAT = true
    var calcPercents = tuple => tuple[0] / tuple[1] * 100
    var calcPotionsNeeded = tuple => Math.floor((tuple[1] - tuple[0]) / 50)
    var pet = nums.slice(-8, -6)
    var player = nums.slice(-8 + 2, -6 + 2); //<-- IT FINALLY HAPPENED. A SITUATION WHERE NO SEMICOLON ACTUALLY CAUSED THE PROGRAM TO CRASH. CONGRATULATIONS ME

    [
        {entity: player, command: 'heal'}, {entity: pet, command: 'pheal'}
    ].forEach(({entity: e, command: c}) => { // ES6 parameter destructuring and aliasing
        if (calcPercents(e) < 30){
            ENQUEUE(c + ' ' + calcPotionsNeeded(e)) // exporting doesn't play nice with globals, who knew
            global.POTIONS_USED = (global.POTIONS_USED || 0) + calcPotionsNeeded(e)
        }
    })
    /*[[player, 'heal'], [pet, 'pheal']].forEach(tuple => {
        if (calcPercents(tuple[0]) < 30){
            ENQUEUE(tuple[1] + ' ' + calcPotionsNeeded(tuple[0]))
            global.POTIONS_USED = (global.POTIONS_USED || 0) + calcPotionsNeeded(tuple[0])
        }
    })*/

    if (global.POTIONS_USED > POTION_RATE) {
        global.POTIONS_USED -= POTION_RATE
        ENQUEUE(`buy health potion ${POTION_RATE}`)
        POTION_RATE = Math.floor(Math.random() * 50) + 150;
    }
}

module.exports = heal;
