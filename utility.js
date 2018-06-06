// utility funcs

var items = require('./lib/items');

module.exports = {

	items: function(x){
		var temp2;
		if (x === "Healing elixir"){
			console.log("(" + user.username + ") (" + user.username + ") item use: healing elixir");
			if (user.hp + items.heals.basic.potency > user.level.maxhp){
				user.hp = user.level.maxhp;
			} else {
				user.hp += items.heals.basic.potency;
			}
			return "You uncork Morgan's " + items.heals.basic.name + " and swill it all. You feel stronger already!";
		} else if (x === "Extra potent healing elixir"){
			console.log("(" + user.username + ") (" + user.username + ") item use: potent healing elixir");
			if (user.hp + items.heals.potent.potency > user.level.maxhp){
				user.hp = user.level.maxhp;
			} else {
				user.hp += items.heals.potent.potency;
			}
			// user.items.other.splice(x,1);
			return "You uncork Morgan's " + items.heals.potent.name + " and swill it all. You feel stronger already!";
		} else if (x === "Antifester"){
			flag = undefined;
			return "You uncork Morgan's " + items.heals.antibiotic.name + " and swill it all. Your battle wounds regain a healthy pink color!";
		} else if (x === "Precious rubies"){
			user.items.other.push(items.stuff.gems.rubies)
			return "You can't use that here.";
			// var temp = user.items.other.splice(i,1);
		} else if (x === "Innoculated kola nuts"){
			console.log("(" + user.username + ") (" + user.username + ") item use: kola");
			user.turnsToday += 5;
			user.drugs += 1;
			return "You take a handful of Morgan's special kola nuts and crunch down on them. The bitterness almost makes you gag. \nYou are energized! Five turns are added to your daily limit!";
		} else if (x === "Berserker infusion"){
			console.log("(" + user.username + ") (" + user.username + ") item use: berserker");
			batpoints = 5;
			user.drugs += 2; 
			return "Steadying yourself, you gulp down the vial of Morgan's Berserker infusion. It burns going down. \nYou feel the strength of ten men, and crave battle!";
		}
	},

	levelup: function(x){
		// game-wide function for leveling up a player
		if (x===2){
			// Abbey completed - Level 2
			user.level = levs.levels.apprentice;
			user.hp = levs.levels.apprentice.maxhp;
			user.mission = "";
      user.missionname = "None";
			missioncomplete = false;
			sessionevents.majorflag=true;
			sessionevents.major.push("lev2");
		} else if (x===3){
			// Grannon completed - Level 3
			user.level = levs.levels.challenger;
			user.hp = levs.levels.challenger.maxhp;
      missioncomplete=false
      user.mission = "";
      user.missionname="None";
		} else if (x===4){
			// Royale completed - Level 4
			user.level = levs.levels.journeyman;
			user.hp = levs.levels.journeyman.maxhp
      missioncomplete=false
      user.mission = "";
      user.missionname="None";
      console.log("levelup4 fires");
		} else if (x===5){
			// Morgan's errand completed - Level 5
			user.level = levs.levels.rogue;
			user.hp = levs.levels.rogue.maxhp
      missioncomplete=false
      user.mission = "";
      user.missionname="None";
      console.log("levelup5 fires");
		} else if (x===6){
			// Abbey dark mission completed - Level 6
			user.level = levs.levels.corsair;
			user.hp = levs.levels.corsair.maxhp
		} else if (x===7){
			// Rolf's drugs completed - Level 7
			user.level = levs.levels.sensei;
			user.hp = levs.levels.sensei.maxhp
		} else if (x===8){
			// Pestilence completed - Level 8
			user.level = levs.levels.mchief;
			user.hp = levs.levels.mchief.maxhp
		} else if (x===9){
			// bank break-in completed - Level 9
			user.level = levs.levels.ronin;
			user.hp = levs.levels.ronin.maxhp
		} else if (x===10){
			// minstrel completed - Level 10
			user.level = levs.levels.wanderer;
			user.hp = levs.levels.wanderer.maxhp
		} 
	},

	dailyreboot: function(){
		if(user.lastPlayed != today){
			// user did not play today, so get 'em going with full hp & turns again
			user.hp = user.level.maxhp;
			user.turnsToday = 20;
			user.lastPlayed = today;
      console.log("(" + user.username + ") successful reboot");
			return 1; 
		} else if (user.hp <= 0) {
			console.log("(" + user.username + ") player is dead");
			// user is dead
			return 2;
		} else {
			// user played today, isn't dead yet, may/may not have turns left
			return 1;
		}
	},

	reboot: function(){
		username=undefined;
		currentuser=undefined;
		userid=undefined;
		msg=undefined;
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
		}
	},

	fortune: function(x){
		if (x==="luck"){
			var temp = Math.random();
			if (user.attributes.luck!=0){
				temp += user.attributes.luck * 0.1;
			}
			console.log("(" + user.username + ") luck var: " + temp);
			if (temp>=0.5){
				return true
			} else return false;
		} else if (x==="char"){
			var temp = Math.random();
			if (user.attributes.charisma!=0){
				temp += user.attributes.charisma * 0.25;
			}
			console.log("(" + user.username + ") charisma var: " + temp);
			if (temp>=0.6){
				return true
			} else return false;
		} else if (x==="duel"){
			var temp = Math.round(((Math.random()+1) + target.attributes.luck) + globalfortune);
			var temp2 = temp + batpoints;
			console.log("(" + target.username + ") fortune points: " + temp2);
			return temp2;
		} else {
			// for adding variables in battle
			// spirits; berzerk; 
			var temp = Math.round(((Math.random()+1) + user.attributes.luck) + globalfortune);
			var temp2 = temp + batpoints;
			console.log("(" + user.username + ") fortune points: " + temp2);
			return temp2;
		}
	}, 

	showgear: function(x){
	    if (user.items.other.length===0){
	        return 0;
	    } else {
	        var returnvar = "Your current supplies:\n";
	        for (i=0;i<user.items.other.length;i++){
	            returnvar += user.items.other[i].name + ", ";
	        }
	    returnvar += "and a bit of dust.\n";
	    return returnvar;
	    }
	},

	todaysdate: function(x){
		var date = new Date();
		var month = date.getMonth() + 1;
		var day = date.getDate(); 
		var monthday = month + "-" + day;
		if (x==="day"){
			// returns just day
			return day
		} else {
			// returns MM-DD format
			return monthday
		}
	},
  
  hasmagic: function(x){
	    for (i=0;i<user.items.magic.length;i++){
        if (user.items.magic[i].searchname.includes(x)) {
	         	 return true
	      }
	    }
	},

	ifmagic: function(){
	    if (user.items.magic.length===0){
	        return ("none")
	    } else {
	        var temp = "";
	        for (i=0;i<user.items.magic.length;i++){
	            temp += user.items.magic[i].name + ", ";
	        }
	        temp += "and ephemeral bits.";
	        return temp;
	    }
	},

	showmagic: function(x){
	    var returnvar = "You have knowledge of the following magicks:\n";
	        for (i=0;i<user.items.magic.length;i++){
	            returnvar += "   " + user.items.magic[i].name + ": " + user.items.magic[i].desc + "\n";
	        }
	    returnvar += " \n";
	    return returnvar
	},
  
  removemagic: function(x){
    for (i=0;i<user.items.magic.length;i++){
        if (user.items.magic[i].searchname.includes(x)) {
	         	 user.items.magic.splice([i],1);
            // check to be sure this works
	      }
	    }
  },

	status: function(){
    return ("Your current status: \n```Hitpoints: " + user.hp + "   Level: " + user.level.name + "\n" +
        "Gold: " + user.gold + "       Experience: " + user.xp + "\n" +
        "Weapon: " + user.items.weapon.name + "   Armor: " + user.items.armor.name + "\n" +
        "Magicks: " + utility.ifmagic() + "\n" +
        "Attributes: Charisma (" + user.attributes.charisma + ") Mysticism (" + user.attributes.myst + ") Luck (" + user.attributes.luck + ") Strength (" + user.attributes.strength + ")\n" + 
        "Battle turns remaining today: " + user.turnsToday + "\n" +
        "Mission: " + user.missionname + "```");
	},

	eventbus: function(x){
		var temp = "";
		if (sessionevents.major.length>0){
	        for (i=0;i<sessionevents.major.length;i++){
	        	var majoreventstemp = sessionevents.major[i];
	        	temp += events.eventReturner(majoreventstemp);
	        }
			// sessionevents.tobesaved.push(temp); 
		}
		if (sessionevents.minor.length>0){
			if (sessionevents.minor.length===1){
				console.log("(" + user.username + ") eventbus just 1 event");
				// pick up event 
				var minoreventstemp = sessionevents.minor[0];
				// pick up event description
		        temp += events.eventReturner(minoreventstemp);
			} else {
				console.log("(" + user.username + ") eventbus >1 event");
				// pick a minor event at random
				var minoreventsvar = Math.round(Math.random() * (sessionevents.minor.length-1) );
				// pick up event
				var minoreventstemp = sessionevents.minor[minoreventsvar];
		        temp += events.eventReturner(minoreventstemp);
			}
		}
		console.log("temp: " + temp + " (eventbus)");
		// sessionevents.tobesaved += temp;
		console.log("(" + user.username + ") sessionevents.tobesaved: " + sessionevents.tobesaved);
		eventsave();
	},

	confirmsameitem: function(x){
		if (x==="mag"){
			if (user.items.magic.length===0) return false;
			else {
				for (i=0;i<user.items.magic.length;i++){
		            if (user.items.magic[i].name===currentmerch.name) {return true}
		            else return false;
		        }
		    }
		}
	},

	findgems: function(x){
		if (user.items.rubies === 0) return false
		else return true;
	}
		// town, tavern, smither, smithbuy, apot, bank, abbey, farm, asking
		// lev2, magic, newplayer, death
}

