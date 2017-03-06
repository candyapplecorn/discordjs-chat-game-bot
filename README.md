# chat-game-bot

plays a chat-based game via discord API. 

takes the player's characters on adventures, performs sidequests, cracks geodes, catches desirable pets, heals both the player and pet and restocks healing potions. If using this bot, all the player need do is occasionally log in to upgrade their character's equipment and brag.

ideally this program would be run in a screen or tmux session on a server. [https://tmux.github.io/](https://tmux.github.io/)

one could configure their computer to have an alias or clickable executable which sends the command to start this program in a tmux/screen session via ssh + tmux sendkeys (ideally with an ssh key for passwordless execution).

the player's token, channel to run this bot, and hours to run this bot, must be in a config file named "__config.json__"; example:

```javascript
{
    "token":      "ndweilnhdqil123578129desiabndhjubn4k123",
    "channel_id": "3264789123046123046180",
    "hours":      2
}
```

##todo

<strike>make it so that the program is left on 24/7 (possibly with [pm2](https://www.npmjs.com/package/pm2)) and controlled via chat commands from within discord itself.
the benefit of this would be that the user can control the bot without access to a computer. this would be much more convenient</strike> Done!
