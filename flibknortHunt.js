"use strict"

/*
IF credentials.flibhunt == true
    IF after killing an enemy (SLAIN message):
        toggle global weapon type = IRON SWORD
    ELSE IF after combat
        toggle global weapon type = BEST WEAPON

    IF player.current_weapon !== global.weapon_type
        ENQUEUE ‘use global.weapon_type’
*/

var bestWeapon, worstWeapon, weaponShouldBe, currentWeapon;

function setGlobals(){
    try {
        var flibhunt = JSON.parse(global.credentials.flibhunt)

        bestWeapon  = credentials.bestWeapon;
        worstWeapon = credentials.worstWeapon; // should be Iron Sword
        weaponShouldBe = weaponShouldBe || worstWeapon;
        currentWeapon = currentWeapon || bestWeapon;

        return flibhunt;
    } catch (e) {
        console.log(e)
        return false;
    }
}

function flibhunt(message, ENQUEUE, content = message ? message.content : null){
    var hunting = setGlobals();

    if (hunting !== true ||
        !bestWeapon || !worstWeapon || !message) return !!console.log('Exiting flibhunt: 1')

    if (/en[^ ]*emy Flibknort/.test(content))
        console.log( ["", "Flibknort encountered", ""].join("\n".repeat(3))),
        process.exit() // WE'RE CRASHING THIS PROGRAM - WITH NO SURVIVORS! *WHEEZE* YES, IT WAS PART OF MY MASTER PLAN! *WHEEZE*

    if (/.ain/.test(content))
        weaponShouldBe = worstWeapon
    else if (/Damage/.test(content))
        weaponShouldBe = bestWeapon
    else return false;

    if (weaponShouldBe != currentWeapon)
        ENQUEUE('use ' + weaponShouldBe),
        console.log('Enqueing weapon change!');

    currentWeapon = weaponShouldBe;
}

module.exports = flibhunt;
