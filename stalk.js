// stalking

module.exports = {
  stalk: function (res,convo){
    convo.say("*----------------------------T H E   C A M P S----------------------------*");
    convo.say("Nightime has fallen over the fields. You can smell the menace in the air. \n" +
      "You creep stealthily through the fields where people set their camps, searching for *" + target.username + "*. You keep your hand close to your weapon. Finally, you recognize *" + target.username + "* sleeping near a tree!");
    convo.ask("You can `attack` *" + target.username + "* in their sleep, or `slink` back into the darkness and return to the light of town.", function(res,convo){
      stalktopmenu(res,convo);
      convo.next();
    });
  }
}

stalktopmenu = function(res,convo){
  var temp = res.text.toLowerCase();
	if (temp.includes("attack")){
    if (user.attributes.luck >= target.attributes.luck){
      playerturn(res,convo);
      convo.next();
    } else {
      convo.say("Zounds! *" + target.username + "* is more alert than you thought! As you approach, their eyes snap wide open, and before you are ready, they spring into action!");
      oppturn(res,convo);
      convo.next();
    }
  } else if (temp.includes("slink")){
    convo.say("Thinking twice, you sheath your weapon and disappear back into the shadows.");
    town.townsquare(res,convo);
    convo.next();
  } else {
		convo.say("Come again?");
		convo.repeat();
	}
}

playerturn = function(res,convo){
  var result = dueling("p");
  if (result==="zip"){
    convo.say("You uselessly strike at *" + target.username + "* with your " + user.items.weapon.name + " but hilariously inflict no damage!");
    oppturn(res,convo);
		convo.next();
  } else if (result==="k"){
    console.log("(" + user.username + ") kill");
		convo.say("With a skillful parry, you cut down *" + target.username + "* where they stand!");
    duelreward(res,convo);
    convo.next();
  } else {
    // damage, no kill
    convo.say("You strike at *" + target.username + "* with your " + user.items.weapon.name + " and inflict " + result + " damage!");
    oppturn(res,convo,);
    convo.next();
  }

}

oppturn = function(res,convo){
  var result = dueling();
  if (result==="zip"){
    convo.say("*" + target.username + "* strikes at you, but your armor absorbs the blow! You sustain 0 damage! \n" +
      "```Your hitpoints: " + user.hp + "\n" +
      target.username +"'s hitpoints: " + target.hp + "```");
    convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
      duelfightrouter(res,convo);
      convo.next();
    });
  } else if (result==="k"){
    console.log("(" + target.username + ") kill");
    user.gold = Math.round(user.gold * 0.5);
    target.gold += user.gold
    target.xp += Math.round(user.xp*0.2);
    convo.say("With a great heave, " + target.username + " cuts you down with a final mighty blow. As you sink to the ground, and the world dissolves into darkness, you hear chuckling from the assembled crowd. *" + target.username + "* shakes their head and spits in your direction.");
		convo.say(">Serves you right, amateur.");
    convo.say("As everything goes black, you see *" + target.username + "* looting your goods. They take " + user.gold + " gold from your body, and win experience from having repelled your sneak attack.");
    duelresults("d");
    death(res,convo);
		convo.next();
  } else {
    // damage, no kill
    convo.say("Holding their ground, *" + target.username + "* heaves at you with their " + target.items.weapon.name + ", inflicting " + result + " damage!");
		convo.say("The assembled crowd exchanges bets on who will win... \n" +
      "```Your hitpoints: " + user.hp + "\n" +
      target.username +"'s hitpoints: " + target.hp + "```");
    convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
      duelfightrouter(res,convo);
      convo.next();
    });
  }
}

duelfightrouter = function(res,convo){
  var temp = res.text.toLowerCase();
	if (temp.includes("attack")){
    playerturn(res,convo);
    convo.next();
  } else if (temp.includes("run")){
    convo.say("You know when you're outmatched. Hoping to preserve your hide, you turn tail in the opposite direction!");
	var rando = Math.random();
	console.log("(" + user.username + ") run variable: " + rando);
	if (rando >= 0.75) {
		convo.say("Oh no! *" + target.username + "* is not having any of your cowardice, and pulls you back into the fight!");
		oppturn(res,convo);
    convo.next();
	}
	else { 
		convo.say("Having successfully escaped the fight, you hide your face in shame and head back to town.");
    duelresults("r");
		user.turnsToday -= turns;
		turns = 0;
    target=undefined;
		town.townsquare(res,convo);
    convo.next();
		}
  } else if (temp.includes("magick")){
    if (user.items.magic.length===0){
			convo.say("You have no knowledge of magicks yet!");
			convo.repeat();
		} else {
			var temp = utility.showmagic();
			convo.say(temp);
			convo.ask("Enter the name of the magick you wish to lance, or use no magick at all and `attack` the old fashioned way.", function(res,convo){
				duelmagic(res,convo);
				convo.next();
			});
    }
  } else {
		convo.say("Come again?");
		convo.repeat();
	}
}

dueling = function(x){
  if (x==="p"){
    // player turn
    attackdamage = Math.round((user.items.weapon.attack * (Math.random()+ 1)) + user.attributes.strength + utility.fortune() - target.items.armor.armor - utility.fortune("duel"));
		console.log("player attack: " + attackdamage);
		turns++;
		if (attackdamage<=0){
			return "zip"
		} else {
			target.hp = target.hp - attackdamage;
			if (target.hp <= 0) return "k";
			else return attackdamage;
		}
  } else {
    // opponent turn
    attackdamage = Math.round((target.items.weapon.attack * (Math.random()+ 1)) + target.attributes.strength + utility.fortune() - user.items.armor.armor - utility.fortune());
		console.log("opponent attack: " + attackdamage);
		if (attackdamage<=0){
			return "zip"
		} else {
			user.hp = user.hp - attackdamage;
			if (user.hp <= 0) return "k";
			else return attackdamage;
		}
  }
}

duelreward = function(res,convo){
	target.gold = Math.round(target.gold * 0.5);
	user.gold += target.gold;
	var temp = Math.round(target.xp * 0.2);
  user.xp += temp;
  user.turnsToday -= turns;
  if (user.turnsToday<0){
    user.turnsToday=0;
  }
  turns = 0;
  shieldflag=false;
  swordflag=false;
  duelresults("k");
  convo.say("While your adversary *" + target.username + "* lays at your feet, you catch your breath before looting their body. \n" + 
		"You find " + target.gold + " gold on their body, and gain " + temp + " experience!");
  convo.say("You hope *" + target.username + "* doesn't hold it against you... but you fear you might've made an enemy today.");
	convo.ask("*Catch your breath, and then `slip` back into town before you draw a bigger crowd.*", function(res,convo){
      target = undefined;
      town.townsquare(res,convo);
      convo.next();
    });
}

duelmagic = function(res,convo){
var temp = res.text.toLowerCase();
	if (temp.includes('attack')){
		playerturn(res,convo);
    convo.next();
	} else if (temp==="show"){
		convo.ask("Which magick do you wish to invoke?" +
			"\n " + utility.showmagic() + "\n Or you can `change` your mind.", function(res,convo){
				duelmagic(res,convo);
				convo.next();
		});
	} else if (temp.includes("change")){
		convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
		});
	} else if (temp.includes("thunderous")){
    if (!utility.hasmagic("thunderous")) {
        // user owns the spell they input
		  convo.say("This magick is yet unknown to you!");
		  convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
  } else if (user.turnsToday<=spellz.clap.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.repeat();
			// confirm that this goes back to "which magick" question
		} else {
			attackdamage = spellz.clap.attack - target.items.armor.armor - utility.fortune("duel");
			console.log("user attack: " + attackdamage);
			turns += spellz.clap.turnsreq;
			target.hp = target.hp - attackdamage;
			convo.say("Summoning up the old words, you lance the Thunderous Clap upon *" + target.username + "*, bringing down a calamitous din upon their ears!" +
				"\n You inflict " + attackdamage + " damage!");
			if (target.hp <= 0) {
				// damage the monster & kill
				console.log("(" + user.username + ") kill");
				convo.say("With a heroic blow, you vanquish *" + target.username + "*!");
				duelreward(res,convo);
        convo.next();
			} else {
				// inflict damage, don't kill
				oppturn(res,convo,);
        convo.next();
			}
		}
	} else if (temp.includes("shield")){
		if (user.turnsToday<=spellz.shield.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
		} else if (!utility.hasmagic("shield")) {
        // user owns the spell they input
		  convo.say("This magick is yet unknown to you!");
		  convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
    } else if (shieldflag){
			convo.say("You have already invoked this magick.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
		} else {
			shieldflag=true;
			turns += spellz.shield.turnsreq;
			convo.say("Summoning up the old words, you lance the Egregious Shield incantation, cloaking yourself in a blue protective haze of magick.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
		}
	} else if (temp.includes("words")){
		if (user.turnsToday<=spellz.heal.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
		} else if (!utility.hasmagic("words")) {
        // user owns the spell they input
		  convo.say("This magick is yet unknown to you!");
		  convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
    } else {
			turns += spellz.heal.turnsreq;
			user.hp = user.level.maxhp;
			quicksave();
			convo.say("Summoning up the old words, you lance the Curative Words incantation, healing yourself fully.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				duelfightrouter(res,convo);
				convo.next();
			});
		}
	// } else if (temp.includes("sword")){
		// we don't have this level yet
	} else {
		convo.repeat();
	}
}

duelresults = function(x){
  if (x==="k"){
    // player kills the target
    target.duelflag=true;
    target.duel.new.push({
      result: "L",
      opp: user.username
    });
  } else if (x==="d"){
    // target defeats the player
    target.duelflag=true;
    target.duel.new.push({
      result: "W",
      opp: user.username
    });
  } else if (x==="r"){
    // player runs away
    target.duelflag=true;
    target.duel.new.push({
      result: "R",
      opp: user.username
    });
  }
  quicksave();
  saverecord(target);
}

