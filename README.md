# chat-game-bot

plays a chat-based game via discord API. 

takes the player's characters on adventures, performs sidequests, cracks geodes, catches desirable pets, heals both the player and pet and restocks healing potions. If using this bot, all the player need do is occasionally log in to upgrade their character's equipment and brag.

ideally this program would be run in a screen or tmux session on a server. [https://tmux.github.io/](https://tmux.github.io/)

<strike>one could configure their computer to have an alias or clickable executable which sends the command to start this program in a tmux/screen session via ssh + tmux sendkeys (ideally with an ssh key for passwordless execution).</strike> The bot can now be controlled from within Discord itself.

the player's token, channel to run this bot, and hours to run this bot, must be in a config file named "__config.json__"; example:

```javascript
{
    "token":      "ndweilnhdqil123578129desiabndhjubn4k123",
    "channel_id": "3264789123046123046180",
    "hours":      2,
    "username":   "BugsBunny"
}
```

## todo

<strike>make it so that the program is left on 24/7 (possibly with [pm2](https://www.npmjs.com/package/pm2)) and controlled via chat commands from within discord itself.
the benefit of this would be that the user can control the bot without access to a computer. this would be much more convenient</strike> Done!

### On Pet Catching

I've recently discovered that in this game, certain pets are broken AF. I always wondered why anyone would bother siphoning their valuable experience points into their pet rather than their own level. The character gains 5 attribute points for every level the character gains. Ten attribute points in strength gives 1 extra damage. So you could sorta estimate that 2 levels = 1 extra damage and 100 levels = 50 extra damage. The weapon upgrades every 50 levels give far more than 50 extra damage, so the character's damage progression is not entirely dependent on its stats. Rather, character level is mostly good for upgrading weapons, which bring the bulk of character damage.

Now compare that to pets. The 2nd highest leveled pet, Colossus, deals 500-500 damage @ level 200. 500 damage is certainly helpful when the character is only doing, say, 1200 damage or 2400 criticals. That's an extra 30% / 15% -ish damage depending on critical strikes. Which is significant. __However__ pets can do far more damage. The pet "Flibknort" apparently, when leveled up, does the most damage of any pet. At level 200 it deals 1,930 damage. That's almost four times what a level 200 collossus does, and near the damage my character deals *with* a critical strike. At the same level as my character, Flibknort would do nearly triple my character's damage, or over 12 times the damage of Colossus.

tl;dr: the single most important factor for dealing damage is having a pt Flibknort. So now I will write functionality into this program to catch it.

There's a problem though! My current power is so strong that if I encounter a Flibknort, I'll instantly kill it! I won't have time to stop and catch it, it'll already be dead. Seems like I'm in a catch-22, especially since Flibknorts are so rare, I encounter them less than once a day. More like twice a week. Why are they so rare? Every time the character levels up, the pool of pets to catch from increases by a few. The pool of pets gets increasingly diluted with non-Flibknort pets. At higher levels, those new additions are "dynamic" pets with equal HP to the player's - near 20,000 for me. So these new pets take the most time to kill.

It seems like I'm in a catch 22. On one hand, if I kill every Flibknort I encounter in the 1st strike (due to my high damage), I'll never catch one. On the other hand, if I lowered my damage output to the point that I *didn't* kill Flibknort when encountering it, then my character would take so long to kill __every other enemy__ that I'd go from encountering a Flibknort once every few days to once every few weeks.

What to do?

Here's the solution I'm going to implement; it's a set of rules:

1. By default, have an extremely weak weapon equipped - so that the character doesn't 1-shot Flibknort.
2. When encountering a new enemy, if it isn't Flibknort, equip the best weapon.
3. When encountering a new enemy, if it IS Flibknort (and the character's pet isn't), tell the program to stop adventuring; maybe even crash the program (that'd be the easiest implementation)

I think, based on the fact that only a high leveled character would have such a hard time catching a flibknort (a lower level character would encounter flibknort often); aka because flibknort is so rare; crashing the program upon encountering flibknort is the most effective solution. Yes, obviously, crashing the program is a lazy solution. However for lower-leveled characters who aren't encountering Flibknort so rarely, they'll only ever have to deal with this once. If the character has a flibknort, then all these features can just be disabled. In fact, I'll just add a "mode" to the program - "Flibknort catching mode". If in flibknort catching mode, obey rules 1, 2 and 3. If not in flibknort catching mode, act as before this patch/pull request. AKA go around with the best weapon killing everything as before.
