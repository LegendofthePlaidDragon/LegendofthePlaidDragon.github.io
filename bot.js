/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Create a new app via the Slack Developer site:

    -> http://api.slack.com

  Get a Botkit Studio token from Botkit.ai:

    -> https://studio.botkit.ai/

  Run your bot from the command line:

    clientId=<MY SLACK TOKEN> clientSecret=<my client secret> PORT=<3000> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js

# USE THE BOT:

    Navigate to the built-in login page:

    https://<myhost.com>/login

    This will authenticate you with Slack.

    If successful, your bot will come online and greet you.


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var env = require('node-env-file');
env(__dirname + '/.env');


if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  usage_tip();
  // process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    // debug: true,
    scopes: ['bot'],
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
    var mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.MONGO_URI});
    bot_options.storage = mongoStorage;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

if (!process.env.clientId || !process.env.clientSecret) {

  // Load in some helpers that make running Botkit on Glitch.com better
  require(__dirname + '/components/plugin_glitch.js')(controller);

  webserver.get('/', function(req, res){
    res.render('installation', {
      studio_enabled: controller.config.studio_token ? true : false,
      domain: req.get('host'),
      protocol: req.protocol,
      glitch_domain:  process.env.PROJECT_DOMAIN,
      layout: 'layouts/default'
    });
  })

  var where_its_at = 'https://' + process.env.PROJECT_DOMAIN + '.glitch.me/';
  console.log('WARNING: This application is not fully configured to work with Slack. Please see instructions at ' + where_its_at);
}else {

  webserver.get('/', function(req, res){
    res.render('index', {
      domain: req.get('host'),
      protocol: req.protocol,
      glitch_domain:  process.env.PROJECT_DOMAIN,
      layout: 'layouts/default'
    });
  })
  // Set up a simple storage backend for keeping a record of customers
  // who sign up for the app via the oauth
  // require(__dirname + '/components/user_registration.js')(controller);

  // Send an onboarding message when a new team joins
  require(__dirname + '/components/onboarding.js')(controller);

  // Load in some helpers that make running Botkit on Glitch.com better
  require(__dirname + '/components/plugin_glitch.js')(controller);

  // enable advanced botkit studio metrics
  require('botkit-studio-metrics')(controller);

  var normalizedPath = require("path").join(__dirname, "skills");
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./skills/" + file)(controller);
  });

  /////////////////
  // KEY INITS
  /////////////////
newuser = require('./lib/user');
town = require('./town');
tavern = require('./tavern');
woods = require('./woods');
farm = require('./farm');
bank = require('./bank');
apot = require('./apot');
smith = require('./smith');
abbey = require('./abbey');
mage = require('./mage');
royale = require('./royale');
stalk = require('./stalk');
items = require('./lib/items');
levs = require('./lib/levels');
events = require('./lib/events');
utility = require('./utility');
beasts = require('./lib/beasts');
spellz = require('./lib/spellz');

// KEY PLAYER VARIABLES

currentuser = ""; 
userid = "";
msg = "";
username=""; 
user={};
shadow={};
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
    tobesaved:[]
};
today=0;
qturns=0;
target=undefined;
  
////////////////
// END INITS
////////////////
  
  
  // This captures and evaluates any message sent to the bot as a DM
  // or sent to the bot in the form "@bot message" and passes it to
  // Botkit Studio to evaluate for trigger words and patterns.
  // If a trigger is matched, the conversation will automatically fire!
  // You can tie into the execution of the script using the functions
  // controller.studio.before, controller.studio.after and controller.studio.validate
  if (process.env.studio_token) {
      controller.on('direct_mention', function(bot, message) {
          // controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then(function(convo) {
        console.log("direct mention");
        bot.reply(message, "Greetings, fellow wanderer. If you'd like to begin the journey of Dunquest, just direct message me.");
    });
    
    controller.on('mention', function(bot, message) {
        console.log("channel mention");
        bot.reply(message, "Greetings, fellow wanderers. If you'd like to begin the journey of Dunquest, just direct message me.");
              // if (!convo) {
              //     // no trigger was matched
              //     // If you want your bot to respond to every message,
              //     // define a 'fallback' script in Botkit Studio
              //     // and uncomment the line below.
              //     // controller.studio.run(bot, 'fallback', message.user, message.channel);
              // } else {
              //     // set variables here that are needed for EVERY script
              //     // use controller.studio.before('script') to set variables specific to a script
              //     convo.setVar('current_time', new Date());
              // }
      });
    
    controller.on('direct_message', function (bot, message) {

    utility.reboot();
    userid = message.user;
    user.userid = userid;
    team = message.team;
    today = utility.todaysdate();
      console.log("userid: " + userid);
      console.log("team:" + team);
      console.log("today: " + utility.todaysdate());
      var temp = new Date();
      console.log("time: " + temp.getHours() + " " + temp.getMinutes());

    // welcome function
    var welcome = function(res,convo){
        convo.ask("Welcome! Do you wish to venture on to the village of Dunshire?", [
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
          // this doesn't work
            default: true,
            callback: function(res,convo){
                convo.repeat();
                convo.next();
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
        if (user_data===undefined || user_data===null || user_data.profile.username===undefined){
            // no record for this user, so we'll set one up
            console.log("this is not a known player");
            user = newuser.newPlayer;
            user.userid = userid;
            drinkvar=true;
            // grab some user deets real quick, saves to user var
            bot.api.users.info({'user':user.userid},function(err,res){
                user.username = res.user.name;
                console.log("new user username: " + user.username + " (startup)");
            });
        } else {
            // found a record for user
            console.log("found a record for profile username: " + user_data.profile.username);
            user = user_data.profile;
            // could add bank info here
            if (user.drinkflag===true){
                drinkvar=true;
            }
        }
    });

    bot.startConversation(message, welcome);

  });
    
  }
}
 
enter = function(res, convo){
    convo.say("Great! Let's go! 🐲");
    convo.say("You're walking down a dirt path. It's nighttime, and cool out. The crickets are chirping around you. There's a soft light up ahead. As you get a little closer, the yellow light of a small country inn beckons. \n\nYou open the small metal gate and walk into the inn's yard. There are torches about lighting the way, and the sound of voices talking and laughing inside.");
    convo.say("As you enter, The Innkeeper looks up from where he's clearing a table.");
    if (!user.knownPlayer){
        console.log("setting up new player: " + user.username);
        convo.ask("The Innkeeper grunts. \n>Well met, *" + user.username + "*. Haven't seen you around here before. You mean to introduce yourself, and begin your adventure in Dunshire?", [
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
            console.log("(" + user.username + ") player returned but is dead");
            convo.say("You remain dead. But don't worry - try back tomorrow!");
            convo.next();
        } else {
            console.log("(" + user.username + ") player reboot");
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
    user.lastPlayed = today;
      // utlility thing isn't loading levels correctly?
    convo.say("The Innkeeper smacks the long bench with his palm and grins. \n>Excellent! I wish you luck and good fortune on your journies to come in the village of Dunshire - and the lands beyond... \n\n>As a last step before you go, you may choose to add 1 point to any of your four key character attributes. Which do you choose?");
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
        convo.ask("The Innkeeper nods his head. \n>Okay then. You probably lots of questions. What topic would you like explained? Let me pour you some ale, and I'll explain concepts like the `village` of Dunshire, `fighting`, Buying/using `merchandise`, interacting with `townsfolk` or other `wanderers`, `magick` or general `concepts`. Or you can just `continue` on to the Village of Dunshire.\"", function(res, convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp==="town"){
        // go on to town
        convo.say(">Good luck then, wanderer. You'll need it.\"");
        convo.say("You exit the inn. Leaving its warm light behind, you continue down the dirt path, the first shoots of sunlight beginning to break through the trees. Soon, you come upon the Village of Dunshire.");
        user.logins++;
        quicksave();
        // game lists: crierfetch gets list of daily activity, graballnames gets all user names
        // crierfetch();
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
        convo.say("Should you die here, don't panic. You will recover the next day. While you will not lose any of your supplies, you may lose some gold that is on your person, and not stored at the Bank. Gold stored at the Bank is safe... for the most part. \nIn Dunshire, as anywhere, the ultimate metric of progress is time. You begin with 20 turns in battle each day, which can be used in the Dark Woods, fighting other adventurers or in other places. Just spending time in the Village (for example, at the Tavern or in the Abbey) does not incur turns.If you run out of turns, don't worry - they reset each day. \nYou advance in rank by completing missions, which you qualify for by gaining experience (usually in the Dark Woods). As you gain experience, the weaker creatures in the Woods will flee, and the more powerful ones will be attracted to you. Beware. \nEvery adventurer has certain attributes that they can develop over the course of their time in Dunshire. They are Strength, Luck, Charisma and Mysticism. Strength is useful during combat. Luck makes you more likely to encounter good fortune. Charisma can trigger more favorable encounters with other characters. Mysticism increases a person's aptitude and stamina in magick.\n");
        convo.ask("What can I answer next? (Want a `reminder`?)", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('instructions')) {
        convo.say("I can explain concepts like the `village` of Dunshire, `Fighting`, Buying/using `merchandise`, `Interacting` with villagers, Interacting with other `wanderers`, `Magick` or General `Concepts`. Or you can just `continue` on to the Village of Dunshire.\"", function(res,convo){
            instructions(res,convo);
            convo.next();
        });
    } else if (temp.includes('continue')) {
        // go on to town
        // crierfetch();
        // grabAllNames();
        convo.say("\"Good luck, wanderer. You'll need it.\"");
        convo.say("You exit the inn. Leaving its warm light behind, you continue down the dirt path, the first shoots of sunlight beginning to break through the trees. Soon, you come upon the Village of Dunshire.");
        user.logins++;
        quicksave();
        town.townsquare(res, convo);
    } else if (temp.includes('reminder')) {
        // reminder of topics
        convo.ask("Sure. Have some more ale. I can explain concepts like the `village` of Dunshire, `fighting`, Buying/using `merchandise`, interacting with `townsfolk` or other `wanderers`, `magick` or general `concepts`. Or you can just `continue` on to the Village of Dunshire.\"", function(res,convo){
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
    console.log("(" + user.username + ") user quit: " + user.username);
    // utility.eventbus();
    convo.say("*-------------------------------------T H E  F I E L D S-------------------------------------*");
    convo.say("You make camp for the night and settle in.");
    convo.say("*See you tomorrow, fellow wanderer.*");
    bot.api.conversations.close({}, function(err, response){
    });
}

death = function(res,convo){
    var temp = res.text.toLowerCase();
    console.log("(" + user.username + ") user death: " + user.username);
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

////////////////////////////////////////////////////////////
//
// HANDY GAME-WIDE FUNCTIONS
//
////////////////////////////////////////////////////////////

grabAllNames = function(x,y){
    // grab list of all player names for use in Tavern
    controller.storage.users.all(function(err, all_user_data) {
        for (i=0;i<all_user_data.length;i++){
            allNames += "*" + all_user_data[i].profile.username + "*, ";
        }
        console.log("enter2 - allnames: " + allNames);
    }); 
}

quicksave = function(){
    // your standard game save 
    controller.storage.users.save({id: userid, profile:user}, function(err,res){
        if (err) console.log("save err: " + err);
        console.log("(" + user.username + ") user save");
    });
}

eventsave = function(){
    var temp = utility.todaysdate();
    controller.storage.activity.get(temp, function(err,res){
        if (err) console.log("event get err: " + err);
        if (res===null){
            console.log("(" + user.username + ") No record found, but we caught it... (eventsave)");
            var temp2 = sessionevents.tobesaved;
            controller.storage.activity.save({id:temp, activity:temp2}, function(err){
                if (err) console.log("event save err: " + err);
                else console.log("event save success");
            }); 
        } else {
            console.log("(" + user.username + ") appending to day's existing activity record");
            var temp2 = "blah"
            temp2.push(sessionevents.tobesaved);
            controller.storage.activity.save({id:temp, activity:temp2}, function(err){
                if (err) console.log("event save err: " + err);
                else console.log("(" + user.username + ") event save success");
            }); 
        }
    });
}

savedrink = function(drinkobject){
    // player sends a drink to another
  var temp;
  controller.storage.users.find({"profile.username":drinkobject.to}, function(err, res){
    // this code works
      if (err) {console.log("getrecord err: " + err)}
      else {
        console.log("pulled record for: " + res[0].profile.username);
        temp = res[0].profile;
        temp.drinks.recd.push(drinkobject);
        temp.drinkflag = true;
        controller.storage.users.save({id: temp.userid, profile:temp}, function(err,res){
          if (err) console.log("save err: " + err);
          console.log("drink sent to target");
        });
      }
  });  
}

crierfetch = function(){
    // fetch today's public activity log for the Crier
    var temp = utility.todaysdate();
    console.log("(" + user.username + ") attempting to save to activity log");
    controller.storage.activity.get(temp, function(err,res){
        console.log("res: " + res + " (crierfetch)");
        if (err) console.log("activity get err: " + err);
        else if (res===null) {
            // it's a new day - nothing here yet
            console.log("(" + user.username + ") No activity log yet today - populating");
            var placetemp = "place" + Math.round(Math.random()*3)
            var temp3 = events.eventReturner(placetemp);
            console.log("temp3: " + temp3 + "(crierfetch)");
            sessionevents.tobesaved.push(temp3);
            var temp2 = sessionevents.tobesaved;
            controller.storage.activity.save({id:temp, activity:temp2}, function(err){
                if (err) console.log("event save err: " + err);
                else console.log("event save success");
                hearings = temp2 + "\n"
            });
            sessionevents.tobesaved = [];
        }
        else {
            // grab today's activity
            hearings += res.activity;
            for (i=0;i<hearings.length;i++){
                hearings[i] += "\n"
            }
            console.log("hearings: " + hearings[0] + " (crierfetch)");
        }
    });
}

getrecord = function(tgt){
  controller.storage.users.find({"profile.username":tgt}, function(err, res){
    // this code works
      if (err) {console.log("getrecord err: " + err)}
      else {
        console.log("pulled record for: " + res[0].profile.username);
        target = res[0].profile;
      }
  });
}

saverecord = function(tgt){
  controller.storage.users.save({id: tgt.userid, profile:tgt}, function(err,res){
        if (err) console.log("save err: " + err);
        console.log("(" + tgt.username + ") saved target record");
    });
}