// utility funcs

var items = require('./lib/items');

module.exports = {

	items: function(x){
		var temp2;
		if (x === "Healing elixir"){
			console.log("item use: healing elixir");
			if (user.hp + items.heals.basic.potency > user.level.maxhp){
				user.hp = user.level.maxhp;
			} else {
				user.hp += items.heals.basic.potency;
			}
			return "You uncork Morgan's " + items.heals.basic.name + " and swill it all. You feel stronger already!";
		} else if (x === "Extra potent healing elixir"){
			console.log("item use: potent healing elixir");
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
			console.log("item use: kola");
			user.turnsToday += 5;
			user.drugs += 1;
			return "You take a handful of Morgan's special kola nuts and crunch down on them. The bitterness almost makes you gag. \nYou are energized! Five turns are added to your daily limit!";
		} else if (x === "Berserker infusion"){
			console.log("item use: berserker");
			batpoints = 5;
			user.drugs += 2; 
			return "Steadying yourself, you gulp down the vial of Morgan's Berserker infusion. It burns going down. \nYou feel the strength of ten men, and crave battle!";
		}
	},

	levelup: function(x){
		if (x===2){
			user.level = levs.levels.apprentice;
			user.hp = levs.levels.apprentice.maxhp;
			user.mission = "";
			missioncomplete = undefined;
		} else if (x===3){
			user.level = levs.levels.challenger;
			user.hp = levs.levels.challenger.maxhp
		} else if (x===4){
			user.level = levs.levels.journeyman;
			user.hp = levs.levels.journeyman.maxhp
		} else if (x===5){
			user.level = levs.levels.ranger;
			user.hp = levs.levels.ranger.maxhp
		}
	},

	dailyreboot: function(){
		var date = new Date();
		var today = date.getDate(); 
		if(user.lastPlayed != today){
			// user did not play today, so get 'em going with full hp & turns again
			user.hp = user.level.maxhp;
			user.turnsToday = 20;
			user.lastPlayed = today;
			user.logins++
			return 1; 
		} else if (user.hp <= 0) {
			// user is dead
			return 2;
		} else {
			// user played today, isn't dead yet, may/may not have turns left
			return 1;
		}
	},

	fortune: function(x){
		if (x==="luck"){
			var temp = Math.random();
			if (user.attributes.luck!=0){
				temp += user.attributes.luck * 0.1;
			}
			console.log("luck var: " + temp);
			if (temp>=0.5){
				return true
			} else return false;
		} 
		else if (x==="char"){
			var temp = Math.random();
			if (user.attributes.charisma!=0){
				temp += user.attributes.charisma * 0.25;
			}
			console.log("charisma var: " + temp);
			if (temp>=0.5){
				return true
			} else return false;
		} else {
			// for adding variables in battle
			// spirits; berzerk; 
			var temp = Math.round(((Math.random()+1) + user.attributes.luck) + globalfortune);
			var temp2 = temp + batpoints;
			console.log("fortune points: " + temp2);
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
	}

}


