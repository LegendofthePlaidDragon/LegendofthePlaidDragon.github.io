// user

var items = require('./items');
var levs = require('./levels');
var drinks = require('./drinks');

module.exports = {

    newPlayer : {

        username: "username",
        knownPlayer: false,
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
        turnsToday:20,
        lastPlayed: 0,
        logins:1,
        attributes: {
            luck: 0,
            strength: 0,
            charisma: 0,
            myst: 0
        },
        mission: undefined,
        missionname: "None",
        userid: "",
        granflag: true,
        duelflag: false,
        duel:{
          new:[],
          old:[]  
        },
        drinkflag: true,
        drinks: {
            recd:[
                {
                from: "Dean",
                type: drinks.beer,
                msg: "Greetings, friend. Welcome to the village of Dunshire! You've no doubt seen the other players around the bar. Feel free to say hi, brag, or even cut them down in battle as you like."
                }
            ],
            sent: []
        },
        bank: {
        deposit:0
        },
        profileStarted:0
    }
    // shadow: {
    //     duelflag: false,
    //     granflag: true,
    //     drinkflag: true,
    //     drinks: {
    //         recd:[
    //             {
    //             from: "Dean",
    //             type: drinks.beer,
    //             msg: "Greetings, friend. Welcome to the village of Dunshire! You've no doubt seen the other players around the bar. Feel free to say hi, brag, or even cut them down in battle as you like."
    //             }
    //         ],
    //         sent: []
    //     },
    //     duel:{
    //         new:[],
    //         old:[]  
    //     },
    //     loginsWeb:0,
    //     loginsSlack:0,
    //     profileStarted:0,
    //     platformStarted:"slack"
    // },
    // bank: {
    //     deposit:0
    // }
}
