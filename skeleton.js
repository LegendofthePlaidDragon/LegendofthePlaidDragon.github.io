// Coneshire bot!

// KEY PLAYER VARIABLES

var reply, reply2, input, userid, msg;
var user = {};

//////////////////////////////////////

// boring stuff

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var Store = require('jfs');

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

// initialization

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}

controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});

// here's where the magic happens

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears(
    ['hello','hi','howdy'], 
    ['direct_message','mention'], function (bot, message) {
    userid = message.user;
    console.log("message.team: " + message.team);
    team = message.team;
    bot.startConversation(message, welcome);
    // grab some deets real quick
    bot.api.users.info({'user':userid},function(err,res){
        user.name = res.user.name;
        user.email = res.user.profile.email;
        controller.storage.teams.save({id: team, user:{
            user_id: userid,
            username: user.name,
            email: user.email
            }
        });
    })
});


welcome = function(res,convo){
    convo.ask("Welcome! Would you like to play a game?", function(res,convo){
        enter(res,convo);
        convo.next();
    });
    convo.on('end', function(convo){
        if (convo.status==='completed'){
            console.log("Looks like we're done here. Cheers! 🍺");
        } else if (convo.status==='stopped'){
            console.log("looks like the convo stopped");
        }
    });
}

enter = function(res, convo){
    if (res.text==="yes" || res.text==="yep"){
        convo.say("Good times. 😜");
        convo.ask("Say 'save' to save your input, or 'bazooka' to grab your data.", function(response,convo){
            enter2(response,convo);
            convo.next();
        });
    } else {
        convo.say("Okay then!");
    }
}

enter2 = function(res,convo){
    console.log("enter2 test: " + res.text);
    console.log("convo: " + Object.getOwnPropertyNames(convo));
    var temp = res.text;
    if (temp==='save'){
        // saves something
        convo.say("Cool - let's save your input.");
        convo.ask("Say anything here.", function(res, convo){
            saving(res,convo);
            convo.next();
        });
    } else if (temp==='bazooka'){
        // gets something
        convo.say("Cool - let's see what you had in your account.");
        controller.storage.teams.get(team,function(err,team_data){
            var temp = team_data.user.res1;
            console.log("retrieved: " + temp);
            convo.say("Looks like you had this: " + temp);
            welcome(res,convo);
            convo.next();
        });
    } else {
        // default
        convo.say("Say what?");
        convo.repeat();
    }
}

saving = function(res,convo){
    console.log("response1: " + res.text);
    controller.storage.teams.save({id: team, user:{
        res1: res.text
        }
    });
    convo.say("Okay, I think I got it.");
    welcome(res,convo);
    convo.next();
}

