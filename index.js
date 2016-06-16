// Coneshire bot!

// get those modules

Botkit = require('botkit');
newuser = require('./lib/user');
town = require('./town');
tavern = require('./tavern');
woods = require('./woods');
farm = require('./farm');
bank = require('./bank');
apot = require('./apot');
smith = require('./smith');
abbey = require('./abbey');
items = require('./lib/items');
levs = require('./lib/levels');
events = require('./lib/events');
utility = require('./utility');
beasts = require('./lib/beasts');

// KEY PLAYER VARIABLES

var username, currentuser, userid, msg;
user={};
globalfortune=0;
batpoints=0;
shieldflag=false;
swordflag=false;
gran = true;
currentmerch = undefined;
allNames = "";
stew = false;
drinkvar=false;
channel=undefined;
aturns=0;
missioncomplete=false;
hearings="";
sessionevents={
    minor:[],
    majorflag:false,
    major:[],
    tobesaved:""
};
today=0;

//////////////////////////////////////

// boring stuff
// initialization

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} 

var mongo = require('botkit-storage-mongo')({mongoUri: process.env.MONGOLAB_URI});

var controller = Botkit.slackbot({storage: mongo}).configureSlackApp(
    {    
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['bot'],
    }
);

controller.setupWebserver(process.env.PORT,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success! Hurrah! Look for a new DM in your Slack team.');
    }
  });
});

// just a simple way to make sure we don't
// connect to the RTM twice for the same team
var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('create_bot',function(bot,config) {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {

      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
        if (err) {
          console.log(err);
        } else {
          convo.say("Greetings, wanderer. To begin your journey, you can say hello here via DM anytime.");
        }
      });

    });
  }

});

controller.storage.teams.all(function(err, teams) {
  if (err) {
    console.log(err)
  }

  if(teams && teams.length){
    console.log('Connecting ' + teams.length + ' teams');
    teams.forEach(function(team){
      var bot = controller.spawn(team).startRTM(function(rtmErr) {
        if (rtmErr) {
          console.log('Error connecting bot to Slack:', rtmErr);
          return;
        }
      });
    });
  }
});

//////////

controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});

// here's where the magic happens

controller.on('bot_channel_join', function (bot, message) {
    console.log("channel join");
    bot.reply(message, "Thanks for inviting me to the channel!");
});

controller.on('mention', function (bot,message) {
    console.log("mention in channel");
    bot.reply(message, "Greetings, fellow wanderers. If you'd like to enter the village of Coneshire, just direct message me.");
});

controller.on('direct_message', function (bot, message) {

    utility.reboot();
    userid = message.user;
    user.userid = userid;
    team = message.team;
    today = utility.todaysdate("day");

    // welcome function
    welcome = function(res,convo){
        convo.ask("Welcome! Do you wish to venture on to Coneshire?", [
        {
            pattern: bot.utterances.yes,
            callback: function(res,convo){
                enter(res,convo);
                convo.next();
           }
        },
        { 
            pattern: bot.utterances.no,
            callback: function(res,convo){
                convo.say("Okay then!");
                convo.next();
           }
        },
        { 
            default: true,
            callback: function(res,convo){
                convo.repeat();
           }
        }
        ]); 
        convo.on('end', function(convo){
            if (convo.status==='completed'){
                console.log("Looks like we're done here. Cheers! 🍺");
            } else if (convo.status==='stopped'){
                console.log("looks like the convo stopped");
            }
        });
    };

    // get user collection; check knownPlayer flag; if none, set basic info
    controller.storage.users.get(userid, function(err,user_data){
        if (err) console.log("err: " + err);
        console.log("user.userid: " + user.userid);
        if (user_data===undefined || user_data===null || user_data.user.username===undefined){
            // no record for this user, so we'll set one up
            console.log("this is not a known player");
            user = newuser.newPlayer;
            user.userid = userid;
            drinkvar=true;

            // grab some user deets real quick, saves to user var
            bot.api.users.info({'user':user.userid},function(err,res){
                user.username = res.user.name;
                console.log("new user username: " + user.username + " (startup)");
                controller.storage.users.save({id: userid, user:user}, function(err,res){
                    if (err) console.log("err: " + err);
                    else console.log("res: " + res);
                });
            });
        } else {
            console.log("found a record for username: " + user_data.user.username);
            // found a record for user
            user = user_data.user;
            if (user.drinkflag===true){
                drinkvar=true;
            }
        }
    });

    // channel = message.channel;

    bot.identifyTeam(function(err,team_id){
        if (err) console.log("err: " + err);
        else console.log("team_id: " + team_id);
        channel = team_id;
    })

    bot.startConversation(message, welcome);

});

// controller.hears('stop',['direct_message'],function(bot,message){

//     bot.startConversation(message, function(err,convo){
//         convo.say("🚨Yikes!🚨 We're going to try to stop this conversation now.");
//         convo.stop();
//     });
// });

enter = function(res, convo){
    user.lastPlayed = today;
    convo.say("Great! Let's go! 🐲");
    convo.say("You're walking down a dirt path. It's nighttime, and cool out. The crickets are chirping around you. There's a soft light up ahead. As you get a little closer, the yellow light of a small country inn beckons. \n\nYou open the small metal gate and walk into the inn's yard. There are torches about lighting the way, and the sound of voices talking and laughing inside.");
    convo.say("As you enter, The Innkeeper looks up from where he's clearing a table.");
    if (!user.knownPlayer){
        console.log("setting up new player: " + user.username);
        convo.ask("The Innkeeper grunts. \n>Well met, *" + user.username + "*. Haven't seen you around here before. You mean to introduce yourself, and begin your adventure in Coneshire?", [
        {
            pattern: convo.task.bot.utterances.yes,
            callback: function(res,convo){
                newplayer(res,convo);
                convo.next();
           }
        },
        { 
            pattern: convo.task.bot.utterances.no,
                callback: function(res,convo){
                convo.say("The Innkeeper's face falls. \"Sorry to hear that, stranger. Maybe another time.\"");
                console.log("END");
                convo.next();
           }
        },
        { 
            default: true,
            callback: function(res,convo){
                convo.repeat();
                convo.next();
           }
        }
        ]);
    } else {
        // known user continuing their quest
        var temp = utility.dailyreboot();
        if (temp===2){
            console.log("player returned but is dead");
            convo.say("You remain dead. But don't worry - try back tomorrow!");
            convo.next();
        } else {
            console.log("player reboot");
            convo.ask(">*Well met, " + user.username + "!* Good to see you again. Would you care to hear some `instructions`? Or just continue on to `town`?", function(response,convo){
            enter2(response,convo);
            convo.next();
            });
        }
    }
}

newplayer = function(res,convo){
    user.knownPlayer = true;
    user.profileStarted = today;
    user.logins++;
    convo.say("The Innkeeper smacks the long bench with his palm and grins. \n>Excellent! I wish you luck and good fortune on your journies to come in the village of Coneshire - and the lands beyond... \n>As a last step before you go, you may choose to add 1 point to any of your four key character attributes. Which do you choose?");
    convo.ask("`Charisma`: this will help you get along with other characters. \n`Luck`: this will grant you good fortune. \n`Mysticism`: this will build your mental fortitude. \n`Strength`: this will make you more powerful in combat.", function(res,convo){
                newplayer2(res,convo);
                convo.next();
    });
}

newplayer2 = function(res,convo){
    var temp = res.text.toLowerCase();
    sessionevents.major.push("newplayer");
    if (temp.includes("charisma")){
        user.attributes.charisma += 1;
        convo.say(">Outstanding! You are now wittier, funnier and more fun to be around!");
        convo.ask(">Would you care to hear some `instructions`? Or just continue on to `town`?", function(response,convo){
            enter2(response,convo);
            convo.next();
        });
    } else if (temp.includes('luck')){
        user.attributes.luck += 1;
        convo.say(">Outstanding! The fates shine upon you!");
        convo.ask(">Would you care to hear some `instructions`? Or just continue on to `town`?", function(response,convo){
            enter2(response,convo);
            convo.next();
        });        
    } else if (temp.includes('mysticism')){
        user.attributes.myst += 1;
        convo.say(">Outstanding! You can now hear the music of the spheres!");
        convo.ask(">Would you care to hear some `instructions`? Or just continue on to `town`?", function(response,convo){
            enter2(response,convo);
            convo.next();
        });        
    } else if (temp.includes('strength')){
        user.attributes.strength += 1;
        convo.say(">Outstanding! You are now more powerful than before!");
        convo.ask(">Would you care to hear some `instructions`? Or just continue on to `town`?", function(response,convo){
            enter2(response,convo);
            convo.next();
        });
    } else {
        convo.say("Come again?");
        convo.repeat();
    }
}

enter2 = function(res,convo){
    // instructions or town
    var temp = res.text.toLowerCase();
    if (temp==="instructions"){
        convo.ask("The Innkeeper nods his head. \n>Okay then. You probably lots of questions. What topic would you like explained? Let me pour you some ale, and I'll explain concepts like the `village` of Coneshire, `fighting`, Buying/using `merchandise`, interacting with `townsfolk` or other `wanderers`, `magick` or general `concepts`. Or you can just `continue` on to the Village of Coneshire.\"", function(res, convo){
            instructions(res,convo);
            convo.next();
    });
    } else if (temp==="town"){
        // go on to town
        convo.say(">Good luck then, wanderer. You'll need it.\"");
        convo.say("You exit the inn. Leaving its warm light behind, you continue down the dirt path, the first shoots of sunlight beginning to break through the trees. Soon, you come upon the Village of Coneshire.");
        quicksave();
        // game lists: crierfetch gets list of daily activity, graballnames gets all user names
        crierfetch();
        grabAllNames();
        town.townsquare(res, convo);
    } else {
        convo.repeat();
    }
}

instructions = function(res,convo){
    var temp = res.text.toLowerCase();
    if (temp.includes('village')){
        convo.say(">The Village of Dunshire is a peaceful place - mostly. There are several small merchants in town for you to meet, as well as places to explore. As you become more experienced, you will discover some that you hadn't noticed at first. The Village is surrounded by the Dark Woods. The Woods are inhabited by a fearsome variety of beasts - from the [insert beast name] to the [other beast name] and many more. You will need to acquire better weapons, armor and more to defeat them all as time goes on. \nThere are other towns beyond the Dark Woods, of course. But you needn't worry about them for now.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('fighting')) {
        convo.say(">As you make your way through the Village, the Dark Woods and elsewhere, you may be called upon to defend yourself. Fighting - whether it be with beasts in the Dark Woods or anywhere else - is straightforward. If you are lucky and/or skilled, you may have an opportunity to make the first strike - or not. You may be able to run away in the middle of a battle if your health runs low (but there's no guarantee you'll succeed). You cannot use your extra gear in the middle of a battle - doing so would require dropping your guard! Defeating opponents will earn you gold and experience. The more formidable the opponent, the more gold and experience. You may run around the Dark Woods slaying as many squirrels as you like, but it will not make you rich.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('merchandise')) {
        convo.say("There is a wide array of merchandise available to buy, both in the Village and... elsewhere. Weapons, armor, healing medications, food and drink, and much more. For merchandise that is not consumed immediately, they are available in your supplies, which are accessible whenever you are not actively in battle. If you die, your supplies remain with you when you recover the next day. See Game Concepts for more on... death.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('townsfolk')) {
        convo.say("There are many inhabitants of the Village for you to meet. Some are very friendly - like my brother Dean! Others... ahem, may not be. Every person in the village may be able to help - or harm - you, often in ways you may not expect. Look for clues as time goes on. In some cases, their responses may change, depending on your level of experience or actions elsewhere. Here's a free tip: ask my big brother, Dean, up in the Tavern for a cup of his famous *Brunswick Stew*.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('wanderers')) {
        convo.say("You are not the only wanderer to arrive here, " + user.username + ". There are others like you here. You can find out who else is wandering about the Village by asking at the Tavern. If you wish, you can send your fellow wanderer a drink. Or, if you're so inclined, you can attempt to go stalk another fighter in the fields where most strangers make camp, and murder them in their sleep. You will need to attain at least the rank of Apprentice (Level 2) to do this, however. We don't need a bloodbath on our hands. \nWhen one fighter defeats another in hand-to-hand combat, *half* of the defeated's gold goes to the victor. The victor also receives 20% of the defeated's experience points, though the latter *does not* lose any points.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('magick')) {
        convo.say("There is magick here. \nA person's aptitude for invoking magick is determined by their Mysticism (see Game concepts for more on attributes). Some magicks can only be invoked by a person powerful in Mysticism, while others are easier. Some magicks are defensive. Others are offensive. Some are neither. You may invoke magick during battles, except while challenging (or ambushing?) other players in the camps. Magick is taxing on the humours, and diminishes your stamina. Invoking magick in battle will cost a certain number of your daily turns - the exact amount depends on the magick. Because magick is so demanding, a requisite level of Mysticism is required for each one.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('concepts')) {
        convo.say("Should you die here, don't panic. You will recover the next day. While you will not lose any of your supplies, you may lose some gold that is on your person, and not stored at the Bank. Gold stored at the Bank is safe... for the most part. \nIn Coneshire, as anywhere, the ultimate metric of progress is time. You begin with 20 turns in battle each day, which can be used in the Dark Woods, fighting other adventurers or in other places. Just spending time in the Village (for example, at the Tavern or in the Abbey) does not incur turns.If you run out of turns, don't worry - they reset each day. \nYou advance in rank by completing missions, which you qualify for by gaining experience (usually in the Dark Woods). As you gain experience, the weaker creatures in the Woods will flee, and the more powerful ones will be attracted to you. Beware. \nEvery adventurer has certain attributes that they can develop over the course of their time in Dunshire. They are Strength, Luck, Charisma and Mysticism. Strength is useful during combat. Luck makes you more likely to encounter good fortune. Charisma can trigger more favorable encounters with other characters. Mysticism increases a person's aptitude and stamina in magick.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('instructions')) {
        convo.say("I can explain concepts like the `village` of Coneshire, `Fighting`, Buying/using `merchandise`, `Interacting` with villagers, Interacting with other `wanderers`, `Magick` or General `Concepts`. Or you can just `continue` on to the Village of Coneshire.\"", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('continue')) {
        // go on to town
        crierfetch();
        grabAllNames();
        convo.say("\"Good luck, wanderer. You'll need it.\"");
        convo.say("You exit the inn. Leaving its warm light behind, you continue down the dirt path, the first shoots of sunlight beginning to break through the trees. Soon, you come upon the Village of Coneshire.");
        town.townsquare(res, convo);
    } else if (temp.includes('reminder')) {
        // reminder of topics
        convo.ask("Sure. Have some more ale. I can explain concepts like the `village` of Coneshire, `fighting`, Buying/using `merchandise`, interacting with `townsfolk` or other `wanderers`, `magick` or general `concepts`. Or you can just `continue` on to the Village of Coneshire.\"", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else {
        convo.repeat();
    }
}

quit = function(res,convo){
    var temp = res.text.toLowerCase();
    quicksave();
    console.log("user quit: " + user.username);
    utility.eventbus();
    convo.say("*-------------------------------------T H E  F I E L D S-------------------------------------*");
    convo.say("You make camp for the night and settle in.");
    convo.say("*See you tomorrow, fellow wanderer.*");
    convo.next();
}

death = function(res,convo){
    var temp = res.text.toLowerCase();
    console.log("user death: " + user.username);
    sessionevents.major.push("death");
    convo.say("*-----------------------------------------D E A T H-----------------------------------------*");
    convo.say("_You are dead._ \n_Don't worry - it won't last long._");
    var temp = Math.random();
    if (temp<0.33){
        user.gold = Math.round(user.gold * 0.60);
    } else if (temp>0.50){
        user.gold = Math.round(user.gold * 0.90);
    } else {
        user.gold = 0;
    }
    quicksave();
    // utility.eventbus();
    convo.say("When you come to, you are back at the country inn outside of town. Everything is a bit hazy. \nYou go inside. The Innkeeper is still there, and as he sees you stagger in, he beckons you over and helps you down on to a bench. Your muscles ache. Your head throbs. \n>Looks like you had a bad encounter with that forest beast! No shame in that, *" + user.username + "*. It's happened to all of us. You'll be back in the action tomorrow. For now, sit a spell. Have a drink. \nHe plops a tankard of frothy ale down in front of you, and the pounding in your head begins to subside. You decide to get comfortable.");
    convo.say("Better luck tomorrow. *See you soon, fellow wanderer.*");
    convo.next();
}

// handy game-wide functions

grabAllNames = function(x,y){
    controller.storage.users.all(function(err, all_user_data) {
        for (i=0;i<all_user_data.length;i++){
            allNames += "*" + all_user_data[i].user.username + "*, ";
        }
    }); 
}

quicksave = function(){
    controller.storage.users.save({id: userid, user:user}, function(err,res){
        console.log("user save");
        if (err) console.log("save err: " + err);
    });
}

eventsave = function(){
    var temp = utility.todaysdate();
    controller.storage.activity.get(temp, function(err,res){
        if (err) console.log("event get err: " + err);
        if (res===null){
            console.log("No record found, but we caught it...");
            console.log("NOW adding to day's activity record");
            var temp2 = sessionevents.tobesaved;
            controller.storage.activity.save({id:temp, activity:temp2}, function(err){
                if (err) console.log("event save err: " + err);
                else console.log("event save success");
            }); 
        } else {
            console.log("appending to day's existing activity record");
            var temp2 = res.activity;
            temp2 += sessionevents.tobesaved;
            controller.storage.activity.save({id:temp, activity:temp2}, function(err){
                if (err) console.log("event save err: " + err);
                else console.log("event save success");
            }); 
        }
    });
}

savedrink = function(drinkobject){
    controller.storage.users.all(function(err, all_user_data) {
        for (i=0;i<all_user_data.length;i++){
            if (all_user_data[i].user.username===drinkobject.to) {
                var temp = all_user_data[i].user.userid;
                controller.storage.users.get(temp, function(err,user_data){
                    var targetData = user_data.user;
                    targetData.drinks.recd.push(drinkobject);
                    targetData.drinkflag = true;
                    controller.storage.users.save({id: temp, user:targetData},function(err,res){
                        if (err) console.log("err: " + err);
                        else console.log("target data saved (savedrink)");
                        user.drinks.sent.push(drinkobject);
                        quicksave();
                    });
                });
            }
        }
    });
}

crierfetch = function(){
    var temp = utility.todaysdate();
    controller.storage.activity.get(temp, function(err,res){
        if (err) console.log("activity get err: " + err);
        else if (res===null) {            
            // it's a new day - nothing here yet
            console.log("No activity log yet today - populating");
            var placetemp = "place" + Math.round(Math.random()*3)
            sessionevents.tobesaved += events.eventReturner(placetemp);
            var temp2 = sessionevents.tobesaved;
            controller.storage.activity.save({id:temp, activity:temp2}, function(err){
                if (err) console.log("event save err: " + err);
                else console.log("event save success");
                hearings = temp2
            });
            sessionevents.tobesaved = "";
        }
        else {
            // grab today's activity
            console.log("activity res: " + res.activity);
            hearings += res.activity;
        }
    });
}

// known bugs:
// - tavern minstrel true/false var is not persistent; restarting game resets the var
// - there's gotta be a better way of collecting all usernames for display, but asynch wasn't my friend
// - gotta add stalking for lev 2s at bar
// 


// grab some deets real quick
// bot.api.users.info({'user':userid},function(err,res){
// user.name = res.user.name;
// user.email = res.user.profile.email;
// controller.storage.users.save({id: userid, user});


