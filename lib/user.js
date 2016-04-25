// user

var items = require('./items');
var levs = require('./levels');
var drinks = require('./drinks');

module.exports = {

    user_id: "userid",
    username: "something",
    knownPlayer: false,
    ///////
    level: levs.levels.naif,
    hp: 25,
    gold: 25,
    xp: 0,
    items: { 
        weapon: items.weapons.start.hands,
        armor: items.armor.start.shirt,
        magic: [],
        other: [],
        rubies:0
    },
    attributes: {
        luck: 0,
        strength: 0,
        charisma: 0,
        myst: 0
    },
    mission: "noob",
    bank:{
        deposit:0
    },
    duelflag: false,
    granflag: true,
    drinkflag: false,
    drinks: {
        recd:[
            {from: "Dean",
            type: drinks.beer,
            msg: "Greetings, friend. Welcome to Dunshire! You've no doubt seen the other players around the bar. Feel free to say hi, brag, or even cut them down in battle as you like."
            }
        ],
        sent: []
    },
    duel:{
        new:[],
        old:[]  
    },
    turnsToday: 20,
    lastPlayed: 0,
    logins:0
}


