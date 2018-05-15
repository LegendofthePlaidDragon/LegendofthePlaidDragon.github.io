// Grannon's farm

module.exports = {

	farm: function(res,convo){
		// farm output - go fight a spirit, discover mage's cave
		convo.say("*-------------------------------------G R A N N O N ' S  F A R M-------------------------------------*");
		if (user.level.level<2){
			convo.say("Thick mist sits atop the field of barley surrounding Old Grannon's Farm on the outskirts of town. \nSomewhere, a dog whimpers, as if running from something. Not you. \nThe farm is quiet. Nothing grows here...");
			convo.say("The Farm gives you cold chills. You turn and head back to town.");
			town.townsquare(res,convo);
		} else if (user.level.level===2){
			if (missioncomplete==true) {
				farmlevel(res,convo);
			} else if (user.mission==="grannon"){
				farm2(res, convo);
			} else {
				convo.say("Thick mist sits atop the field of barley surrounding Old Grannon's Farm on the outskirts of town. Somewhere, a dog whimpers, as if running from something. Not you.");
				convo.say("The farm is not as abandoned as it seems. A slight figure staggers out of the barn door, clutching a crude spear and quavering in his speech. \n>Be on guard, stranger! I won't hesitate to gut ye wheres ye stand! State yer business here!");
				convo.ask("Try to explain that you come as a `friend`, `ready` your " + user.items.weapon.name + " for battle, or `slink` away back to town.", function(res,convo){
					farmrouter(res,convo);
					convo.next();
				});
			}
		} else if (user.level.level>2){
			farm3(res, convo);
			convo.next();
		} 
	},
  granfight: function (res,convo){
    // encounter the geist
		monster = beasts.beasts.lev2b;
		mhp = monster.hp;
		console.log("(" + user.username + ") draws the Geist");
		convo.say("You stride into a clearing and hear a queer, empty howling from a nearby tree. Turning around, you see a gathering black cloud of smoke pouring out of a gap in the tree's trunk. It's the Geist from Old Grannon's farm!\n" +
			"*The " + monster.name + " streams toward you! Defend yourself!*\n");
    if (utility.fortune("luck")){
      // player gets the first shot
      convo.say("Your perception is sharp, and you ready yourself to land the first blow!");
      gfight(res,convo,1);
    } else {
      // Geist gets the surprise shot
      convo.say("The Geist is too fast for you, and manages to strike before you're prepared!");
      gfight(res,convo,2);          
    }
  }
}
// end module exports

farmrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("friend")){
		// talk to him
		convo.say("Old Grannon narrows his eyes suspiciously. \n>You... you haven't come to kill me sheep?");
		convo.say("His spear wavers between you two.");
		convo.ask("Do you `assure` Old Grannon that you haven't come for his sheep, or `change` your mind and say you're here to steal them?", function(res,convo){
					farmrouter2(res,convo);
					convo.next();
				});
	} else if (temp.includes("ready")){
		// cut a bitch
		convo.say("The old man growls as he sees you draw your weapon. \n>Aye, so I thought! Bandit! Brigand! Came here to kill more o' me sheep, did ye? I'll mount your head in my kitchen, I will!");
		convo.say("Grannon lunges unexpectedly with his spear, hitting you in the thigh! *You lose 5 HP!*");
		user.hp -= 5;
		quicksave();
		if (user.hp <= 0) {
			console.log("(" + user.username + ") dead");
			convo.say("Oh no! Old Man Grannon has struck you dead!");
			death(res,convo);
			convo.next();
		} else {
			convo.ask("Try `talking` to him again, or `strike` to counterattack.", function (res, convo){
				farmrouter3(res,convo);
				convo.next();
				});
		}
	} else if (temp.includes("slink")){
		// run scared
		convo.say("You are frightened. You turn tail and head back to town.");
		town.townsquare(res,convo);
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

farmrouter2 = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("assure")){
		// not here for his sheep
		convo.say("Old Grannon looks confused for a moment before the relief becomes obvious on his face. \n>Oh... thank goodness... well, if it's not you, then I suppose the Geist must still be out there. You see, it all started a few weeks ago. I would come out to feed me sheep in the morning, see, and one would always be missing. " 
			+ "\n The old man leans on his spear, looking defeated.");
		convo.say(">It was me dogs what found 'em, though. What remained of 'em, anyway. Whatever was picking off my flock, one at a time, was tearin' them apart and leaving their heads in the barley field. They was all chewed up, too. \n" +
			"Old Grannon leans in near you. \n>This here is dark sorcery... and not just that Mage coming out of his cave to cause mischief again. No, there's a bad creature out there. The Geist. I seen him. And I... I just ain't strong enough to kill it. Not no more.");
		convo.say(">If'n you'd be willing to hunt down that Geist for me... well, I'd be awful grateful, stranger. It's killing my farm. I... I don't have much, but I'd reward you with whatever I have.");
		convo.ask("You may `accept` the old man's request, or opt to `decline` for now.", function(res,convo){
				farmrouter3(res,convo);
				convo.next();
			});		
	} else if (temp.includes("change")){
		// here for his sheep
		convo.say(">I knew it! Sheep thief! \nHe shrieks at you and raises his spear again.");
		convo.ask("Do you `attack` or attempt to `run` back to town?", function(res,convo){
				farmrouter4(res,convo);
				convo.next();
			});
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

farmrouter3 = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("talking")){
		farmrouter2("assure",convo);
    convo.next();
	} else if (temp.includes("strike")){
		farmrouter4(res, convo);
    convo.next();
	} else if (temp.includes("accept")){
		convo.say("*You have accepted Grannon's mission!*");
		user.mission = "grannon";
    user.missionname = "Grannon and the Geist";
		convo.say("The old man continues. \n>To aid you in your hunt, you should go visit that damned old Mage in his cave. I'll tell you how to get there. I don't trust in sorcery... but the Geist isn't like men. It's otherworldly. Black as smoke, without form. Maybe the Mage can help you fight back." +
			"\n>I appreciate your help, stranger.");
		convo.say("For not slaughtering Old Grannon, you gain *1 point of Mysticism!*")
		user.attributes.myst += 1;
		convo.say("Old Grannon tips his hat as you turn and head back to town.");
		quicksave();
		town.townsquare(res,convo);
	} else if (temp.includes("decline")){
		convo.say("The old man sighs. \n>Ah, well... can't say I blame you... I'm scared for my skin too. Maybe another time, then.");
		convo.say("Old Grannon tips his hat as you turn and head back to town.");
		town.townsquare(res,convo);
	} else {
		convo.say("Come again?");
		convo.repeat();
	}	
}

farmrouter4 = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("strike")){
		convo.say("You strike with your " + user.items.weapon.name + " and the old man crumbles to the ground with a weak whimper. You have killed a scared old man, and feel brave." + 
			"The stench of rotting sheep reminds you that the creature that actually did kill his sheep still roams. You must track it down and kill it... before it moves on.");
		convo.say("*You have accepted Grannon's mission!*");
		user.mission = "grannon";
		user.granflag = false;
		quicksave();
		convo.say("Before anyone arrives to witness your act, you turn and head back to town.");
		town.townsquare(res,convo);
	} else if (temp.includes("run")){
		convo.say("You take mercy on the old man by not slaughtering him for his insane ramblings, and walk back to town.");
		town.townsquare(res,convo);
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

// Level 2 interactions
farm2 = function(res,convo){
	// make sure "shadow." is the right place to look here
	if (user.granflag === true){
		// grannons alive
		convo.say("Old Grannon leans on his spear, inspecting the latest sheep carcas left in his field. \n>You seen the Geist yet out there in the Dark Woods? It's a ghastly thing... black as smoke it is. No mortal form like you or me. Gives me the shivers.");
		convo.say(">Go visit the Mage in the forest. Tell him I sent you. Maybe he'll agree to help you... if he doesn't decide to kill you instead. Ha!" +
			"\n>I appreciate your help, stranger.");
		convo.say("Old Grannon tips his hat as you turn and head back to town.");
		town.townsquare(res,convo);
	} else {
		// grannons dead
		convo.say("Old Grannon's corpse still lies where you slew him. The dogs - or something else - appear to have begun their work on his body. You see the remains of a sheep lying in one of the nearby fields. The Geist that terrorized this farm is still active - who knows what it will attack next?");
		convo.say("There is a malignant stench in this place. You turn and head back to town.");
		town.townsquare(res,convo);
	}
}

farmlevel = function(res,convo){
	// when you beat the geist, set missioncomplete=true to get here
	if (user.granflag=true){
		// grannon is alive
		convo.ask("As you walk on to the farm, you see Old Grannon at work repairing the calving shed. He grins as he sees you approach, shuffling quickly down to meet you." +
			"\n>You did it, *" + user.username + "*! The Geist is gone, and my flock is recovering!" +
			"\n>Allow me to help you on your journey, " + user.level.name +". What would you like to be better at? `Luck`, `Strength`, `Charisma` or `Mysticism`?", function(res,convo){
					farmlevel2(res,convo);
					convo.next();
				});
	} else {
		// grannon is dead
		convo.say("Upon your return to the farm, you see signs of life returning. The grass is greener, and flowers grow. But Old Grannon's body - or what remains of it - still lays where you slew him." +
			"\nYou notice some objects in Old Grannon's pouch. The dead have no use of objects, so you decide to take a look, and discover *two vials of healing potion!*");
		utility.levelup(3)
		convo.say("*You have advanced to Level 3: Challenger.* Your maximum hitpoints have increased, and new areas of town are now open to you.");
		user.items.other.push(items.heals.basic);
		user.items.other.push(items.heals.basic);
		convo.say("There is something off about this place. You hide your loot and head back to town.");
		quicksave();
		town.townsquare(res,convo);
	}
}

farmlevel2 = function(res, convo){
	var temp = res.text.toLowerCase();
	utility.levelup(3)
	if (temp.includes("luck")){
		user.attributes.luck += 1;
		convo.say("*1 point* has been added to your Luck.");
		convo.say("*You have advanced to Level 3: Challenger.\n* " +
			"Old Grannon tips his hat to you.\n" +
			">I'll never forget what you did for me here, *" + user.username + "*!");
		convo.say("Your maximum hitpoints have increased, and new areas of town are now open to you. You feel more powerful, and the sun feels fine on your shoulders. It is a good day!");
		convo.say("Feeling good about yourself, you give Grannon a friendly nod and head back to town.");
		quicksave();
		town.townsquare(res,convo);
	} else if (temp.includes("strength")){
		user.attributes.strength += 1;
		convo.say("*1 point* has been added to your Strength.");
		convo.say("*You have advanced to Level 3: Challenger.\n*" +
			"Old Grannon tips his hat to you.\n" +
			">I'll never forget what you did for me here, *" + user.username + "*!");
		convo.say("Your maximum hitpoints have increased, and new areas of town are now open to you. You feel more powerful, and the sun feels fine on your shoulders. It is a good day!");
		convo.say("Feeling good about yourself, you give Grannon a friendly nod and head back to town.");
		quicksave();
		town.townsquare(res,convo);
	} else if (temp.includes("charisma")){
		user.attributes.charisma += 1;
		convo.say("*1 point* has been added to your Charisma.");
		convo.say("*You have advanced to Level 3: Challenger.*\n" +
			"Old Grannon tips his hat to you.\n" +
			">I'll never forget what you did for me here, *" + user.username + "*!");
		convo.say("Your maximum hitpoints have increased, and new areas of town are now open to you. You feel more powerful, and the sun feels fine on your shoulders. It is a good day!");
		convo.say("Feeling good about yourself, you give Grannon a friendly nod and head back to town.");
		quicksave();
		town.townsquare(res,convo);
	} else if (temp.includes("mysticism")){
		user.attributes.myst += 1;
		convo.say("*1 point* has been added to your Mysticism.");
		convo.say("*You have advanced to Level 3: Challenger.*\n" +
			"Old Grannon tips his hat to you.\n" +
			">I'll never forget what you did for me here, *" + user.username + "*!");
		convo.say("Your maximum hitpoints have increased, and new areas of town are now open to you. You feel more powerful, and the sun feels fine on your shoulders. It is a good day!");
		convo.say("Feeling good about yourself, you give Grannon a friendly nod and head back to town.");
		quicksave();
		town.townsquare(res,convo);
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

// Post-level-2 interactions
farm3 = function(res,convo){
	// all is good in the hood
	if (user.granflag){
		// grannon is still alive
		convo.say("The farm is verdant and pungent with the smell of freshly tilled soil and manure. The barley surrounding the farm rustles in the breeze. Old Grannon himself emerges from his shed with a hoe slung over his shoulder." +
			"\n>Well howdy there, *" + user.username + "*! Good to see you again! You're always welcome around these parts.");
		convo.say("Old Grannon tips his hat as you turn and head back to town.");
		town.townsquare(res,convo);
	} else {
		// grannon is dead
		convo.say("The farm is overgrown and eerily quiet. Thieves have looted most of Old Grannon's equipment and his house, and his body is now no where to be seen. You wonder if the lock to his barn is still intact...");
		convo.say("You turn and head back to town.");
		town.townsquare(res,convo);
	}
}	


gfight = function(res,convo,x){
  if (x===1){
    // player turn
    var result = woods.userfight(monster);
		  // kill the monster
		  if (result === "k") {
			  if (turns === 0) {
				console.log("(" + user.username + ") kill single blow");
				convo.say("You vanquished the " + monster.name + " in a single blow!");
			} else { 
				console.log("(" + user.username + ") kill");
				convo.say("With a deafening crash, you vanquish The " + monster.name + "!");
				greward(res,convo);
				convo.next();
			}	
		} else if (result==="zip"){
		// strike, 0 damage
			convo.say("Your attack is impotent against the " + monster.name + ", and you hilariously inflict no damage!");
      gfight(res,convo,2);
			convo.next();
    }	else { 
      // strike don't kill
			convo.say("You strike at *The " + monster.name + "* with your " + user.items.weapon.name + " and inflict " + result + " damage!");
      convo.say("You steady your balance as The Geist collects itself for a counterattack...");
			gfight(res,convo,2);
			convo.next();
			}
  } else if (x===2){
    // geist turn
    var result = woods.monsterfight(monster)
    if (result === "dead"){
			console.log("(" + user.username + ") dead");
			convo.say("Oh no! *The " + monster.name + "* " + monster.strike1 + ", and its darkness overwhelms you!");
      convo.say("As you fade out of consciousness, The Geist gargles on your lifeforce.");
			death(res,convo);
			convo.next();
		}
		else if (result==="zip"){
			convo.say("*The " + monster.name + "* " + monster.strike1 + ", but your armor protects you! You throw off its attacks and sustain 0 damage! \n" +
				"```Your hitpoints: " + user.hp + "\n" +
				monster.name +"'s hitpoints: " + mhp + "```");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
		} else {
			// monster strikes with damage, no kill
			if (shieldflag){
				convo.say("The *" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage! Your Egregious Shield absorbs part of the blow.");
			} else {
				convo.say("The *" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage!");
			}
			convo.say("```Your hitpoints: " + user.hp + "\n" +
				monster.name +"'s hitpoints: " + mhp + "```");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
		}
  } else if (x==="m"){
    if (user.items.magic.length===0){
			convo.say("You have no knowledge of magicks yet!");
			convo.repeat();
		} else {
			var temp = utility.showmagic();
			convo.say(temp);
			convo.ask("Enter the name of the magick you wish to lance, or use no magick at all and `attack` the old fashioned way.", function(res,convo){
				gmagic(res,convo);
				convo.next();
			});
		}
  }
}

gfightrouter = function(res,convo){
  var temp = res.text.toLowerCase();
	if (temp.includes("run")){
		grun(res,convo)
	} else if (temp.includes("magick")){
		if (user.items.magic.length===0){
			convo.say("You have no knowledge of magicks yet!");
			convo.repeat();
		} else {
			gfight(res, convo, "m");
		}
	} else if (temp.includes("attack")){
		gfight(res,convo,1)
	} else {
		convo.repeat();
	}
}

grun = function(res,convo){
  convo.say("Feeling a loosening in your bowels, you decide that today is not your day to die, and turn tail in the opposite direction.");
	var rando = Math.random();
	console.log("(" + user.username + ") run variable: " + rando);
	if (rando >= 0.75) {
		convo.say("Oh no! You failed to outrun The " + monster.name + "!\n");
		gfight(res,convo,2);
		}
	else { 
		convo.say("Whew - that was close!");
		user.turnsToday -= turns;
		turns = 0;
		woods.woodsstart(res,convo);
		}
}

gmagic = function(res,convo){
  var temp = res.text.toLowerCase();
	if (temp.includes('attack')){
		gfight(res,convo,1);
    convo.next();
	} else if (!utility.hasmagic(temp)){
		// check that user owns the spell they input
		convo.say("This magick is yet unknown to you!");
		convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
	} else if (temp.includes("thunderous")){
		if (user.turnsToday<=spellz.clap.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.repeat();
		} else {
			attackdamage = spellz.clap.attack - monster.defense
			console.log("user attack: " + attackdamage);
			turns += spellz.clap.turnsreq;
			mhp = mhp - attackdamage;
			convo.say("Summoning up the old words, you lance the Thunderous Clap upon The " + monster.name + ", bringing down a calamitous din upon its murky blackness!" +
				"\n You inflict " + attackdamage + " damage!");
			if (mhp <= 0) {
				// damage the monster & kill
				console.log("(" + user.username + ") kill");
				convo.say("With a deafening crash, you vanquish The " + monster.name + "!");
				greward(res,convo);
        convo.next();
			} else {
				// damage the monster, don't kill
        convo.say("You steady your balance as The Geist collects itself for a counterattack...");
				gfight(res,convo,2);
        convo.next();
			}
		}
	} else if (temp.includes("shield")){
		if (user.turnsToday<=spellz.shield.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
		} else if (shieldflag){
			convo.say("You have already invoked this magick.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
		} else {
			shieldflag=true;
			turns += spellz.shield.turnsreq;
			convo.say("Summoning up the old words, you lance the Egregious Shield incantation, cloaking yourself in a blue protective haze of magick.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
		}
	} else if (temp.includes("words")){
		if (user.turnsToday<=spellz.words.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
		} else {
			turns += spellz.heal.turnsreq;
			user.hp = user.level.maxhp;
			quicksave();
			convo.say("Summoning up the old words, you lance the Curative Words incantation, and feel strength pouring once again into your body. You are fully healed.");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				gfightrouter(res,convo);
				convo.next();
			});
		}
	} else if (temp.includes("sword")){
		// we don't have this level yet
	} else {
		convo.repeat();
	}
}

greward = function(res,convo){
  convo.say("With your final strike, a rushing buzz fills the wood grove, and The Geist suddenly disappates into a fine mist, eventually vanishing into the air");
  convo.say("The Geist is defeated! *You chould go tell Old Man Grannon right away!*");
  missioncomplete = true;
  monster=undefined;
  user.turnsToday -= turns;
  turns = 0;
  woods.woodsstart(res,convo);
  convo.next();
}

