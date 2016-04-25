// tavern

var drinks = require('./lib/drinks');
var barlines = require('./lib/barlines');
stew = false, minst = false, list="";
tempdrinkobject = {};

module.exports = {

tavern: function(res,convo){
	grabAllNames();
 	convo.say("*-------------------------------------T H E  T A V E R N-------------------------------------*");
	convo.say("The heavy oaken tavern door swings open with a low squeal. The crowded tavern's patrons nurse their drinks and carry on while a Minstrel plays in the back. A man with a large, scratchy beard stands behind the bar with a towel.");
	convo.say(">Well met, " + user.username + "!");
	if (drinkvar){
		convo.say(">*A drink awaits you at the bar! You may `retrieve` it at your pleasure.*");
	}
	convo.ask("What to do? You can `talk` with Dean the barkeep, order a `drink`, sit and `listen` to the bar's goings-on, ask the minstrel to play a `song`, look `around` at the wanderers in the Tavern, `inquire` casually about someone's whereabouts, `send` a drink to another player, or return to the `street`.", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
	}
}

///////////////

tavernrouter = function(res,convo){
	quicksave();
	var temp = res.text.toLowerCase();
    if (temp.includes('talk')){
        talk(res,convo);
    } else if (temp.includes('drink')){
        drink(res,convo);
    } else if (temp.includes('listen')){
    	convo.say("You find a quiet seat out of the way, and take snippets of conversations from around the bar.");
        listen(res,convo);
    } else if (temp.includes('song')){
        minstrel(res,convo);
    } else if (temp.includes('around')){
        around(res,convo);
    } else if (temp.includes('inquire')){
        tavstalk(res,convo);
    } else if (temp.includes('send')){
        send(res,convo);
    } else if (temp.includes('street')){
    	convo.say("Tipping your head to Dean as you rise, you quit the Tavern for the street.");
        town.townsquare(res,convo);
    } else if (temp.includes('brunswick')){
        stew(res,convo);
    } else if (temp.includes('retrieve')){
    	if (drinkvar) { pickupdrink(res,convo) }
    	else { 
    		convo.say ("Dean is confused. No drinks await you!");
    		convo.repeat();
    	}
    } else if (temp.includes('reminder')){
        convo.ask("You can `talk` with Dean the barkeep, order a `drink`, sit and `listen` to the bar's goings-on, ask the minstrel to play a `song`, look `around` at the wanderers in the Tavern, `inquire` casually about someone's whereabouts, `send` a drink to another player, or return to the `street`.", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
    } else {
        convo.repeat();
    }
}

talk = function(res,convo){
	if (user.level.level===1){
		convo.say("You sidle up to the bar, catching Dean the Barkeep's eye. He saunters over to your end.")
		convo.say(">Great to see you, " + user.username + "! As a newcomer, you should explore town a bit. Understand what's here. Venturing into the Dark Forest will help you gain valuable skills, but be prepared to fight. After you have learned to use your " + user.items.weapon.name + " in combat, and gained some experience, I would recommend going to visit the Abbey. It's a terrible shame about the robbery there...");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
	} else if(user.level.level===2){
		convo.say("You sidle up to the bar, catching Dean the Barkeep's eye. He saunters over to your end.")
		convo.say(">If you hope to reach the level of Challenger, you'll have to arm yourself with something powerful. You should go see the Smithy about that. \nSome awful strange stories coming out of the goat farm east of town. Grannon, the farmer there, might be losing his mind. You should go and get to the bottom of it.</span>");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
        });
	} else if(user.level.level===3){
		// tipz
	}
}

drink = function(res, convo){
	convo.say("Dean nods slowly, not looking up from the glass he's polishing. \n>Here's what we've got... \n`1` - " + drinks.grog.name + " (" + drinks.grog.gold + " Gold)\n`2` - " + drinks.ale.name + " (" + drinks.ale.gold + " Gold)\n`3` - " + drinks.beer.name + " (" + drinks.beer.gold + " Gold)\n`4` - " + drinks.whiskey.name + " (" + drinks.whiskey.gold + " Gold)\n`5` - `None` of these?");
	convo.ask(">What'll you have, " + user.username + "?", function(res,convo){
		drinkrouter(res,convo);
		convo.next();
	});
}

drinkrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("1")) {
		if (user.gold < 5){ insufficientfunds() }
		else {		
			user.gold = user.gold - 5;
			convo.say("Dean grimaces. \n>That kind of day, eh friend? Well... cup of Greb's Grog... if you insist... coming right up. \nHe slides a small glass of lukewarm, putrid green liquid towards you. \nIt scorches your throat going down.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("2")) {
		if (user.gold < 10){ insufficientfunds() }
		else {		
			user.gold = user.gold - 10;
			convo.say("Dean nods. \n>Pint of Aemon's Ale, coming up! Important part of any day's honest work. There you go. \nHe slides a glass of opaque brown ale towards you. \nIt tastes wholesome.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("3")) {
		if (user.gold < 15){ insufficientfunds() }
		else {		
			user.gold = user.gold - 15;
			convo.say("Dean nods. \n>Tankard of Burt's Beer, coming up! Very tasty stuff, y'ask me. Enjoy. \nHe slides a glass of frothy cold beer towards you. \nYou feel refreshed.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("4")) {
		if (user.gold < 25){ insufficientfunds() }
		else {		
			user.gold = user.gold - 25;
			convo.say("Dean smiles. \n>Glass of our finest Top's White Whiskey, coming up! Great choice, that one. \nHe slides a glass of smooth, golden liquid towards you. \nIt tastes mysterious, yet inviting.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("none")) {
		convo.say("Dean shrugs. \n>Suit yourself.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
	    });
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

insufficientfunds = function(){
	convo.say("Dean looks at you askance. \n>Afraid this is a cash-only establishment, friend. And you don't seem to have it.");
	convo.repeat();
}

listen = function(res,convo){
	convo.say(barlines.line());
	convo.say(barlines.line());
	convo.say(barlines.line());
	convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	    tavernrouter(res,convo);
	    convo.next();
	});
}

minstrel = function(res,convo){
	convo.say("A jolly, bearded Minstrel strums his gittern near the tavern's corner fireplace. He bows deeply to you as you approach. \n>Sit, friend, and hear a song of adventure and woe...");
	convo.ask("You can `request` a song, give him a `tip` of precious stones, or `return` to the bar.", function(res,convo){
	        minstrelrouter(res,convo);
	        convo.next();
	    });
}

minstrelrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("request")){
		if (!minst){
			var rando = Math.random();
			if (rando <=0.33){
				convo.say("The Minstrel pauses for a moment, gazes wistfully into the distance, and strums his rendition of \"The Mummer's Lament.\"");
			} else if (rando >0.33 && rando <=0.66){
				convo.say("The Minstrel grins and excitedly launches into a rousing version of \"The Red Dragon's Tale.\" The bar goes wild and sings along!");
			} else if (rando >0.66){
				convo.say("The Minstrel thinks for a moment, and then yodles a heartfelt stanza of \"The Knight's Sweetheart.\"");
			}
			if (rando <=0.1){
				user.turnsToday += 3;
				convo.say("You receive 3 more turns today!");
			} else if (rando >=0.95) {
				var rando2 = Math.random();
				if (rando2<0.25){
					user.attributes.charisma += 1;
					convo.say("You suddenly feel witter, funnier, and more charming!");
				} else if (rando2>=0.25 && rando2<0.5){
					user.attributes.luck += 1;
					convo.say("You feel like playing the lottery...");
				} else if (rando2>=0.5 && rando2<0.75){
					user.attributes.strength += 1;
					convo.say("Your muscles bulge beneath your " +  user.items.armor.name + "!");
				} else {
					user.attributes.myst += 1;
					convo.say("You can hear the music of the spheres more clearly now...");
				}
			} else if (rando>0.1 && rando<0.15) {
				user.bank.deposit = user.bank.deposit * 2;
				convo.say("Somewhere, magic has happened!");
			} else {
				convo.say("Your spirit feels refreshed.");
			} 
			minst = true;
			convo.repeat();
		} else {
			// minst is true
			convo.say("The Minstrel has already played for you today, and now entertains other tavern patrons.");
			convo.repeat();
		}
	} else if (temp.includes("tip")){
		var temp;
		if (findgems()){
			var temp2 = Math.round((Math.random()*3));
			if (temp2===0){
				user.attributes.luck += 1;
			} else if (temp2===1){
				user.attributes.strength += 1;
			} else if (temp2===2){
				user.attributes.charisma += 1;
			} else if (temp2===3){
				user.attributes.myst += 1;
			}
			for (i=0;i<user.items.other.length;i++){
				if (user.items.other[i].name==="Precious rubies"){
					user.items.other.splice(i,1);
					break;
				}
			}
			user.items.rubies --;
			convo.say("You discreetly hand the Minstrel your small pouch of rubies. He bows deeply in receipt. \n>Why, dear Patron, you honor me. Allow me to sing this ballad in your honor! \nThe Minstrel sings a great, stirring tale of your bravery and courage!");
			convo.say("You are a patron of the arts. *1 point* has been added to one of your attributes!");
			convo.repeat();
		} else {
			convo.say("You have no gems to give him!");
			convo.repeat();
		}
	} else if (temp.includes("return")){
		convo.say("The heavy oaken tavern door swings open with a low squeal. The crowded tavern's patrons nurse their drinks and carry on while a Minstrel plays in the back. A man with a large, scratchy beard stands behind the bar with a towel.");
		convo.say(">Well met, " + user.username + "!");
		convo.ask("What to do? You can `talk` with Dean the barkeep, order a `drink`, sit and `listen` to the bar's goings-on, ask the minstrel to play a `song`, look `around` at the wanderers in the Tavern, `inquire` casually about someone's whereabouts, `send` a drink to another player, or return to the `street`.", function(res,convo){
            tavernrouter(res,convo);
            convo.next();
	    });
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

findgems = function(){
	if (user.items.rubies<=0){
		return false
	} else {
		return true
	}
}

around = function(res,convo){
	console.log("names around the bar: " + allNames);
    convo.say("You see " + allNames + "and others lurking about the bar.");
    convo.repeat();
}

tavstalk = function(res,convo){
	convo.ask("Which fellow wanderer do you wish to stalk: " + allNames + "or `none` of these?", function(res,convo){
		tavstalkrouter(res,convo);
		convo.next();
	});
}

tavstalkrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp===user.username){
		convo.say("Dean furrows his brow. \n>You tryin' to make a damn fool of me? You're standing right there!");
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
        });
	} else if (allNames.includes(temp)){
		convo.say("As casually as you can, you ask Dean about " + temp + "'s recent whereabouts.");
		if (user.level.level===1){
			convo.say("Dean narrows his bushy eyes at you, and then bursts out guffawing. \n>Have ye so much as slain a beast in the dark forest yet, stranger? I'd recommend cutting your teeth on the wee creatures out there before trying your hand at an opponent yer own size... ha!");
			convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	            tavernrouter(res,convo);
	            convo.next();
        	});
		} else {
			// TBD - this is if you're level 2 and can stalk people
		}
	} else if (temp.includes("none")){
		convo.say("Very well then.");
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
        });
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

stew = function(res,convo){
	if (stew){
		convo.say("Dean shrugs. \n>Sorry, friend. We're all out.");
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
		});
	} else {
		convo.say("Dean does a double take, and then smirks. \n>Who told you abou-... wait. Let me guess. Me damned brother, up the road! Well. I reckon, if he sent you, then I guess it's the least I can do. We still have some left. Here - enjoy. \nDean goes back to the kitchen, and returns with a steaming bowl of Brunswick stew. You can see the real chunks of squirrel mixed in. \nEating the stew fills you with warm comfort and pleasant memories of your home, far away. It also makes you feel re-energized! 5HP added!");
		stew = true;
		user.hp += 5;
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
		});
	}
}

send = function(res,convo){
	convo.ask("You wave Dean over. Who would you like to send a drink to: " + allNames + "or `none` of these?", function(res,convo){
		sendrouter(res,convo);
		convo.next();
	});
}

sendrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("none") || temp===user.username ) {
		convo.say("Dean looks at you, confused. \nStrange one, I see...");
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
		});
	} else if (allNames.includes(temp)){
		tempdrinkobject.to = temp;
		tempdrinkobject.from = user.username;
		convo.ask("Dean sniffs. \nSend a drink to *" + temp + "*. Got it. What do you want to send? Here's what we've got... \n`1` - " + drinks.grog.name + " (" + drinks.grog.gold + " Gold)\n`2` - " + drinks.ale.name + " (" + drinks.ale.gold + " Gold)\n`3` - " + drinks.beer.name + " (" + drinks.beer.gold + " Gold)\n`4` - " + drinks.whiskey.name + " (" + drinks.whiskey.gold + " Gold)\n`5` - `None` of these?", function(res,convo){
			sendrouter2(res,convo)
			convo.next();
		});
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

sendrouter2 = function(res,convo){
	console.log("tempdrinkobject: " + tempdrinkobject);
	var temp = res.text.toLowerCase();
	if (temp==="1"){ tempdrinkobject.type = drinks.grog;
			console.log("tempdrinkobject name: " + tempdrinkobject.type.name) }
	else if (temp===2) { tempdrinkobject.type = drinks.ale }
	else if (temp===3) { tempdrinkobject.type = drinks.beer }
	else if (temp===4) { tempdrinkobject.type = drinks.whiskey }
	else { 
		convo.say("Dean looks at you, confused. \nSuit yourself...");
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
		});
	}
	if (tempdrinkobject.type.gold > user.gold) {
		convo.say("Dean looks at you askance. \n>Afraid this is a cash-only establishment, friend. And you don't seem to have it.");
		convo.repeat();
	} else {
		convo.ask(">Okay. You can also leave a short message to *" + tempdrinkobject.to + "* - no longer than this napkin here, though. What would you like to say?", function (res,convo) {
			sendrouter3(res,convo)
			convo.next();
		});
	}
}

sendrouter3 = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.length>200){
		convo.say("Your message is too long. Try again.");
		convo.repeat();
	} else {
		tempdrinkobject.msg = temp;
		convo.say("Okay... we've got a glass of " + tempdrinkobject.type.name + " going to *" + tempdrinkobject.to + "* with the message: \"" + tempdrinkobject.msg + "\"\n>This sound good to you?");
		convo.ask("You can `confirm` with Dean, or `change` your mind.", function(res,convo){
			sendrouter4(res,convo);
			convo.next();
		});
	}
}

sendrouter4 = function(res,convo) {
	var temp = res.text.toLowerCase();
	if (temp.includes("confirm")){
		convo.say("Dean takes the napkin and sets it behind the counter. \n>I'll pass on your message - and the drink!");
		savedrink(tempdrinkobject);
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
		});
	} else if (temp.includes("change")){
		convo.say("Dean looks at you, confused. \nSuit yourself...");
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
		});
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

pickupdrink = function(res,convo){
	var temp="", temp2="";
	if (user.drinks.recd.length>1){
		for(i=0;i<user.drinks.recd.length;i++){
			temp += user.drinks.recd[i].type.name + " from *`" + user.drinks.recd[i].from + "`*, ";
		}
		convo.say("You have " + user.drinks.recd.length + " drinks awaiting you: " + temp + " and a pint of sad, warm leftover beer.");
	} else {
		temp += user.drinks.recd[0].type.name + " from *`" + user.drinks.recd[0].from + "`*";
		convo.say("You have one drink awaiting you: a " + temp + ".");
	}
	convo.ask("Whose drink shall you quaff first? (Or `none` of them?)", function(res,convo){
		pickup2(res,convo);
		convo.next();
	});
}

pickup2 = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("none")){
		convo.say("Dean looks at you, confused. \nSuit yourself...");
		convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
	        tavernrouter(res,convo);
	        convo.next();
		});
	} else {
		for(i=0;i<user.drinks.recd.length;i++){
			if (user.drinks.recd[i].from.toLowerCase()===temp){
				var temp2 = user.drinks.recd[i]
				convo.say("You happily take the " + temp2.type.name + " and tip it back as you read *" + temp2.from + "'s* message: \n>" + temp2.msg);
				var oldmsg = user.drinks.recd.splice(i,1);
				if (user.drinks.recd.length===0){
					user.drinkflag=false;
					drink=false;
				}
				quicksave();
				convo.say("You ponder *" + oldmsg[0].from + "'s* message and enjoy your tasty beverage.");
				convo.ask("The bar hums quietly around you. What next? (Want a `reminder`?)", function(res,convo){
			        tavernrouter(res,convo);
			        convo.next();
				});
			} else {
				convo.ask("Whose drink was that? Try the name again, or `none` to change your mind.");
				convo.repeat();
			}
		}
	}
}

