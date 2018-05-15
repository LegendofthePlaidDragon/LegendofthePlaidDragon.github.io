// The Battle Royale

round = 0;

module.exports = {
  royale: function (res,convo){
  convo.say("*----------------------------T H E   B A T T L E  R O Y A L E----------------------------*");
  convo.say("After closing the unmarked wooden door, you descend a steep stone staircase. The low hum of men shouting and cheering below grows into a din as you draw closer. \n" +
    "The raucous crowd surrounds a sunken pit, shouting and shaking pouches of gold while men in the middle brawl. The air tastes vaguely sour. Like blood.");
  if (user.level.level>=4){
    convo.say("Tox looks up respectfully as you approach his desk.");
    convo.say(">Hail, Champion! Feel free to bet on any of these lesser fighters in the ring today... there's money to be won here!");
  }
  convo.ask("You can `seek` out the Fightmaster, `bet` on the next bloodsport, or decide you've had enough and `return` to the Tavern.", function(res,convo){
    royalerouter(res,convo);
    convo.next();
    });
  }
}

royalerouter = function(res,convo){
  var temp = res.text.toLowerCase();
  quicksave();
  if (temp.includes("seek")){
    convo.say("Tox, the Battle Royale fightmaster, presides over the pit from a table stacked with gold, flanked by large men with fearsome swords.");
    if (user.level.level===3 && user.mission!="royale"){
      convo.say("Tox looks up at you and snorts loudly. \n" +
               ">You? Yeah, I've heard about you. But I don't care to turn this house into a mortuary. You look weak, little friend.");
      convo.say(">But then again... I've heard word of your deeds for the Abbey and Old Grannon. The contenders here always enjoy cutting down fresh meat. Are you now ready to prove yourself in our house? Keep in mind... once you enter the Pit, you only leave as the victor, or as the defeated.");
      convo.ask("You can `accept` the challenge of the Battle Royale, or `stay` on the sidelines, like a coward.", function (res, convo){
          rchallenge(res,convo);
          convo.next();
      });
    } else if (user.level.level===3 && user.mission==="royale"){
      convo.say("Tox looks up at you and snorts loudly. \n" +
                ">Back for more, eh, *" + user.username + "*? That's fine by me... the real champions here always need some sword fodder!");
      convo.say(">Are you now ready to prove yourself in our house? Keep in mind... once you enter the Pit, you only leave as the victor, or as the defeated.");
      convo.ask("You can `accept` the challenge of the Battle Royale, or `stay` on the sidelines, like a coward.", function (res, convo){
          rchallenge(res,convo);
          convo.next();
      });
    } else {
      convo.say("Tox looks up with admiration as you approach his desk and bows his head respectfully. \n" +
               ">Hail, Champion! You are welcome in this house!");
      convo.repeat();
    }
  } else if (temp.includes("bet")){
    betting(res,convo);
    convo.next();
  } else if (temp.includes("return")){
    convo.say("You tire of bloodsport, and turn back to return to the safety of the Tavern.");
    tavern.tavern(res,convo);
    convo.next();
  } else convo.repeat();
}

rchallenge = function(res,convo){
  var temp = res.text.toLowerCase();
  if (temp.includes("accept")){
    convo.say("Tox looks surprised. He roars and slams his fist on the table. \n" +
      ">So... you fancy yourself a fighter, then? I like the sound of that! \n" +
      ">You shall face three opponents, stranger. Each more formidable than the last. Prove your worth, and you shall be accepted in this house.");
    convo.say("*You have accepted the ordeal of the Battle Royale!*");
    user.mission="royale";
    user.missionname="The Battle Royale";
    quicksave();
    convo.say("Grubby hands push you through the crowd until you stumble out into the fighting pit, and you hear a heavy thud the thick wooden pit door is locked behind you. High above, Tox rings a bell, and the crowd roars for blood.");
    convo.say("*------------------ROUND ONE------------------*");
    rround1(res,convo);
    convo.next();
  } else if (temp.includes("stay")){
    convo.say("Tox sniffs.\n" +
             ">That's what I thought.");
    royale.royale(res,convo);
    convo.next();
  } else convo.repeat();
}

rround1 = function(res,convo,x){
  // round one: Brezlev
  if (x===1){
    // player turn
    var result = woods.userfight(monster);
		  // kill the monster
		  if (result === "k") {
			  console.log("(" + user.username + ") kill");
				convo.say("You cut down " + monster.name + " with a mighty blow, and he yields!");
				rwins(res,convo);
				convo.next();
			}	else if (result==="zip"){
		// strike, 0 damage
			convo.say("You strike at " + monster.name + " with your " + user.items.weapon.name + ", but your amateurish attack inflicts no damage!");
	    convo.say("The crowd bubbles over with guffawing, and " + monster.name + " chortles cruelly as he leisurely readies his counterattack.");
      rround1(res,convo,2);
			convo.next();
      }	else { 
      // strike don't kill
			convo.say("You strike at " + monster.name + " with your " + user.items.weapon.name + " and inflict " + result + " damage!");
      convo.say("The crowd goes wild, and " + monster.name + " roars in pain as he angrily readies his counterattack.");
			rround1(res,convo,2);
			convo.next();
		  }
    } else if (x===2){
      // opponent turn
      var result = woods.monsterfight(monster)
      if (result === "dead"){
        console.log("(" + user.username + ") dead");
        convo.say("Oh no! *" + monster.name + "* cuts you down with his javelin, and you sink to the floor!");
        convo.say("As the room fades, you hear the surrounding crowd cheering in adulation for your adversary.");
        death(res,convo);
        convo.next();
      }	else if (result==="zip"){
        convo.say("*" + monster.name + "* " + monster.strike1 + ", but your armor protects you! You throw off his futile attacks and sustain 0 damage! \n" +
          "```Your hitpoints: " + user.hp + "\n" +
          monster.name +"'s hitpoints: " + mhp + "```");
        convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
      } else {
        // monster strikes with damage, no kill
        if (shieldflag){
          convo.say("*" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage! Your Egregious Shield absorbs part of the blow.");
        } else {
          convo.say("The *" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage!");
        }
        convo.say("```Your hitpoints: " + user.hp + "\n" +
          monster.name +"'s hitpoints: " + mhp + "```");
        convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
      }
    } else {
    // fight begin
    round=1;
    monster = beasts.beasts.lev3bs[0];
	  mhp = monster.hp;
    convo.say("You stretch your arms and roll your shoulders, preparing for the first fight. As your first adversary is escorted into the pit, cheers go up from the crowd.\n" + 
      "Before you, a strange loincloth-wearing man with red stripes painted on his weathered face is lifting an ivory javelin...");
    if (utility.fortune("luck")){
      convo.say("Fortune is yours, and you ready yourself in time to strike first!");
      rround1(res,convo,1);
      convo.next();
    } else {
      convo.say("Chance is not on your side - Brezlev the javelin thrower launches into his attack!");
      rround1(res,convo,2);
      convo.next();
    }
  }
}

rround2 = function(res,convo,x){
  // round two: Dagger fighter
  if (x===1){
    // player turn
    var result = woods.userfight(monster);
		  // kill the monster
		  if (result === "k") {
			  console.log("(" + user.username + ") kill");
				convo.say("You cut down " + monster.name + " with a mighty blow, and she yields!");
				rwins(res,convo);
				convo.next();
			}	else if (result==="zip"){
		// strike, 0 damage
			convo.say("You strike at " + monster.name + " with your " + user.items.weapon.name + ", but your amateurish attack inflicts no damage!");
	    convo.say("The crowd bubbles over with guffawing, and " + monster.name + " curls her lip at you as she readies her counterattack.");
      rround2(res,convo,2);
			convo.next();
      }	else { 
      // strike don't kill
			convo.say("You strike at " + monster.name + " with your " + user.items.weapon.name + " and inflict " + result + " damage!");
      convo.say("The crowd goes wild, and " + monster.name + " roars in pain as she angrily grips her daggers for her next strike.");
			rround2(res,convo,2);
			convo.next();
		  }
    } else if (x===2){
      // opponent turn
      var result = woods.monsterfight(monster)
      if (result === "dead"){
        console.log("(" + user.username + ") dead");
        convo.say("Oh no! *" + monster.name + "*'s cuts overwhelm you, and you sink to the floor in defeat!");
        convo.say("As the room fades, you hear the surrounding crowd cheering in adulation for your adversary.");
        death(res,convo);
        convo.next();
      }	else if (result==="zip"){
        convo.say("*" + monster.name + "* " + monster.strike1 + ", but your armor protects you! You throw off her futile attacks and sustain 0 damage! \n" +
          "```Your hitpoints: " + user.hp + "\n" +
          monster.name +"'s hitpoints: " + mhp + "```");
        convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
      } else {
        // monster strikes with damage, no kill
        if (shieldflag){
          convo.say("*" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage! Your Egregious Shield absorbs part of the blow.");
        } else {
          convo.say("*" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage!");
        }
        convo.say("```Your hitpoints: " + user.hp + "\n" +
          monster.name +"'s hitpoints: " + mhp + "```");
        convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
      }
    } else {
    // begin the fight
    monster = beasts.beasts.lev3bs[1];
	  mhp = monster.hp;
    convo.say("You dust yourself off and stretch, preparing for the second fight. As the next adversary is escorted into the pit, cheers go up once again from the crowd.\n" + 
      "A lean young woman steps in, two gleaming daggers clutched in her fists. Several more line her belt. Her heavy brow is furrowed as she gives you a hard look, sizing you up.");
    if (utility.fortune("luck")){
      convo.say("Fortune is yours, and you ready yourself in time to strike first!");
      rround2(res,convo,1);
      convo.next();
    } else {
      convo.say("Chance is not on your side - the Dagger Fighter launches into her attack!");
      rround2(res,convo,2);
      convo.next();
    }
  }
}

rround3 = function(res,convo,x){
  // round three: Magus
  if (x===1){
    // player turn
    var result = woods.userfight(monster);
		  // kill the monster
		  if (result === "k") {
			  console.log("(" + user.username + ") kill");
				convo.say("You cut down " + monster.name + " with a mighty blow, and with a bleating siren, he... yields?");
				rwins(res,convo);
				convo.next();
			}	else if (result==="zip"){
		// strike, 0 damage
			convo.say("You strike at " + monster.name + " with your " + user.items.weapon.name + ", but your amateurish attack inflicts no damage!");
	    convo.say("The crowd bubbles over with guffawing, and " + monster.name + " still stands motionless, as if mocking your attack.");
      rround3(res,convo,2);
			convo.next();
      }	else { 
      // strike don't kill
			convo.say("You strike at " + monster.name + " with your " + user.items.weapon.name + " and inflict " + result + " damage!");
      convo.say("The crowd goes wild, and " + monster.name + " wavers in space, flickering in and out of existence, before standing upright once again and clutching its arms for a counterattack.");
			rround3(res,convo,2);
			convo.next();
		  }
    } else if (x===2){
      // opponent turn
      var result = woods.monsterfight(monster)
      if (result === "dead"){
        console.log("(" + user.username + ") dead");
        convo.say("Oh no! *" + monster.name + "*'s mysterious dark sorcery is too great, and you collapse!");
        convo.say("As your consciousness fades, you hear the crowd cheering in adulation for your adversary.");
        death(res,convo);
        convo.next();
      }	else if (result==="zip"){
        convo.say("*" + monster.name + "* " + monster.strike1 + ", but your armor protects you! You throw off its futile attacks and sustain 0 damage! \n" +
          "```Your hitpoints: " + user.hp + "\n" +
          monster.name +"'s hitpoints: " + mhp + "```");
        convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
      } else {
        // monster strikes with damage, no kill
        if (shieldflag){
          convo.say("*" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage! Your Egregious Shield absorbs part of the blow.");
        } else {
          convo.say("*" + monster.name + "* " + monster.strike1 + ", inflicting " + result + " damage!");
        }
        convo.say("```Your hitpoints: " + user.hp + "\n" +
          monster.name +"'s hitpoints: " + mhp + "```");
        convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
      }
    } else {
    // begin the fight
      monster = beasts.beasts.lev3bs[2];
	    mhp = monster.hp;
      convo.say("You're breathing hard, and your muscles ache. The last two fights have not been easy. Turning towards the opposite door, you steel yourself mentally for the third and final champion of the Battle Royale. Soon, the bell for your adversary is rung, and oddly... the crowd goes silent. Not a word. The creak of a wooden bleacher can be heard.");
      convo.say("A short, stout figure, its visage completely hidden in a thick, dark cloak, suddenly appears at the other end of the pit, as if out of thin air, where before there was nothing. The handlers by the opposite door give... it... a wide berth. \n" +
                "*The Magus* stands motionless at the other side of the pit.");
      if (utility.fortune("luck")){
        convo.say("Fortune is yours, and you ready yourself in time to strike first!");
        rround3(res,convo,1);
      convo.next();
    } else {
      convo.say("Chance is not on your side - *The Magus* launches into its attack!");
      rround3(res,convo,2);
      convo.next();
    }
  }
}

rfightrouter = function(res,convo,x){
  var temp = res.text.toLowerCase();
  if (x===2){
    // from rwins menu
    if (temp.includes("status")){
      convo.say(utility.status());
	    convo.ask("You can check your `status`, review your `supplies`, `plead` with Tox to end the ordeal early, or `begin` the next fight.", function(res,convo){
        rfightrouter(res,convo,2);
        convo.next();
      });
    } else if (temp.includes("supplies")){
      var temp = utility.showgear();
      if (temp === 0){
        convo.say("You have no items!");
        convo.ask("You can check your `status`, review your `supplies`, `plead` with Tox to end the ordeal early, or `begin` the next fight.", function(res,convo){
          rfightrouter(res,convo,2);
          convo.next();
        });
      } else {
        convo.say(temp)
        convo.ask("Enter the name of any item you want to use, or `none`.", function(res,convo){
            rusegear(res,convo);
            convo.next();
        });
	    }
    } else if (temp.includes("plead")){
      var temp = Math.random();
		  temp += user.attributes.charisma*0.1;
		  if (temp>0.4){
        convo.say("Tox rolls his eyes and snorts. \n" +
          ">Can't handle the heat of REAL competition, eh *" + user.username + "*? Fine - go! Come back when you're ready to fight!");
        convo.say("The crowd jeers and tosses rotten vegetables as you limp out of a side door in disgrace.");
        tavern.tavern(res,convo);
        convo.next();
		  } else {
        convo.say("Tox regards you, and slowly narrows his countenance with a cruel grin. \n" +
            ">I don't like your look, *" + user.username + "*. We won't let you get away that easily today! Bring on the next challenger!");
        if (round===1) {
          rround2(res,convo,1);
          convo.next();
        } else {
          rround3(res,convo,1);
          convo.next();
        }
      } 
    } else if (temp.includes("begin")){
        if (round===1) {
          round = 2;
          rround2(res,convo);
          convo.next();
        } else {
          round = 3;
          rround3(res,convo);
          convo.next();
        }
    } else {
      convo.repeat();
    }
  } else {
    if (temp.includes("magick")){
      if (user.items.magic.length===0){
        convo.say("You have no knowledge of magicks yet!");
        convo.repeat();
		  } else {
        var temp = utility.showmagic();
        convo.say(temp);
        convo.ask("Enter the name of the magick you wish to lance, or use no magick at all and `attack` the old fashioned way.", function(res,convo){
          rmagick(res,convo);
          convo.next();
        });
      }
    } else if (temp.includes("attack")){
      if (round===1) {
        rround1(res,convo,1);
        convo.next();
      } else if (round===2) {
        rround2(res,convo,1);
        convo.next();
      } else {
        rround3(res,convo,1);
        convo.next();
      }
    } else {
      convo.repeat();
    }
  }
}

rmagick = function(res,convo){
  var temp = res.text.toLowerCase();
	if (temp.includes('attack')){
		rfightrouter("attack",convo);
    convo.next();
	} else if (!utility.hasmagic(temp)){
		// check that user owns the spell they input
		convo.say("This magick is yet unknown to you!");
		convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
  } else if (temp.includes("thunderous")){
		if (user.turnsToday<=spellz.clap.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.repeat();
			// confirm that this goes back to "which magick" question
		} else {
			attackdamage = spellz.clap.attack - monster.defense;
			console.log("user attack: " + attackdamage);
			turns += spellz.clap.turnsreq;
			mhp = mhp - attackdamage;
			convo.say("Summoning up the old words, you lance the Thunderous Clap upon " + monster.name + ", bringing down a calamitous din that stuns the senses!" +
				"\n You inflict " + attackdamage + " damage!");
			if (mhp <= 0) {
				// damage the monster & kill
				console.log("(" + user.username + ") kill");
				convo.say("With a deafening crash, you vanquish " + monster.name + "!");
				rwins(res,convo);
        convo.next();
			} else {
				// damage the monster, don't kill
        convo.say("You steady your balance as " + monster.name + " recollects their senses for a counterattack...");
        if (round===1) {
          rround1(res,convo,2);
          convo.next();
        } else if (round===2) {
          rround2(res,convo,2);
          convo.next();
        } else {
          rround3(res,convo,2);
          convo.next();
        }
		  }
    }
	} else if (temp.includes("shield")){
		if (user.turnsToday<=spellz.shield.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
		} else if (shieldflag){
			convo.say("You have already invoked this magick.");
			convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
		} else if (utility.hasmagic(temp)){
		// check that user owns the spell they input
		convo.say("This magick is yet unknown to you!");
		convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });    
    } else {
			shieldflag=true;
			turns += spellz.shield.turnsreq;
			convo.say("Summoning up the old words, you lance the Egregious Shield incantation, cloaking yourself in a blue protective haze of magick.");
			convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
		}
	} else if (temp.includes("words")){
		if (user.turnsToday<=spellz.heal.turnsreq) {
			convo.say("You do not have enough turns left today to invoke this magick.")
			convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
		} else {
			turns += spellz.heal.turnsreq;
			user.hp = user.level.maxhp;
			quicksave();
			convo.say("Summoning up the old words, you lance the Curative Words incantation, and feel strength pouring once again into your body. You are fully healed.");
			convo.ask("Do you counter `attack`, or invoke `magick`?", function(res,convo){
          rfightrouter(res,convo);
          convo.next();
        });
		}
	} else if (temp.includes("sword")){
		// we don't have this level yet
	} else {
		convo.repeat();
	}
}

rwins = function(res,convo){ 
  if (round===1) {
    convo.say("Tox's voice booms over the pit. \n" +
             ">*We have a victor!*");
    convo.say("The crowd erupts in cheers as Brezlev is carried out of the pit on a stretcher and you dust yourself off. You have just a moment to catch your breath - the second challenger is already being led to the pit.");
    convo.ask("You can check your `status`, review your `supplies`, `plead` with Tox to end the ordeal early, or `begin` the next fight.", function(res,convo){
      rfightrouter(res,convo,2);
      convo.next();
    });
  } else if (round===2) {
    convo.say("Tox's voice booms over the pit. \n" +
             ">*We have a victor!*");
    convo.say("The crowd erupts in cheers as the Dagger Fighter is dragged limp out of the pit. You have a few precious moments to recover - the third and final challenger is already being led to the pit.");
    convo.ask("You can check your `status`, review your `supplies`, `plead` with Tox to end the ordeal early, or `begin` the next fight.", function(res,convo){
      rfightrouter(res,convo,2);
      convo.next();
    });
  } else {
    convo.say("Tox's voice booms over the pit as the crowd explodes with jubilation. \n" +
             ">*The Battle Royale has its new Champion!*");
    convo.say("The crowd erupts in cheers as the Magus, stumbling on its feet, begins to flicker, and soon evaporates into thin air, leaving you alone, victorious, in the arena. You stand, catching your breath as your opponent's sorcery fades, to face the adoring crowd. They are throwing flowers and coins down upon you, heralding your victory!");
    user.turnsToday -= turns;
    turns = 0;
    utility.levelup(4);
    convo.say("*You have advanced to Level 4: Journeyman.* Your maximum hitpoints have increased, and new areas of town are now open to you.");
    convo.say("After toweling off your face, you climb the steps out of the pit to see Tox, who nods sheepishly as he sees you approach. \n" +
      ">All right, all right... I admit, you are truly a worthy warrior, " + user.username + ". Here is your share of tonight's fight purse....");
    convo.say("Tox hands you a pouch with *" + monster.gold + " gold,* and you gain *" + monster.xp + " experience!*");
    convo.say(">You are welcome back to fight anytime, Champion. Cutting down your fellow town wanderers can be a great way of gaining experience... and you can even steal some of their gold! Not that I, er, know anything of that...");
    monster=undefined;
    quicksave();
    convo.ask("*Catch your breath, and then `continue`.*", function(res,convo){
      royale.royale(res,convo);
      convo.next();
    });
  }
}

rsupplies = function(res,convo){
	var temp = utility.showgear();
	if (temp === 0){
		convo.say("You have no items!");
		convo.ask("You can check your `status`, review your `supplies`, `plead` with Tox to end the ordeal early, or `begin` the next fight.", function(res,convo){
      rfightrouter(res,convo,2);
      convo.next();
    });
	} else {
		convo.say(temp)
		convo.ask("Enter the name of any item you want to use, or `none`.", function(res,convo){
      rusegear(res,convo);
      convo.next();
		});
	}
}

rusegear = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes('none')){
		convo.ask("You can check your `status`, review your `supplies`, `plead` with Tox to end the ordeal early, or `begin` the next fight.", function(res,convo){
      rfightrouter(res,convo,2);
      convo.next();
    });
	} else {
		var temp2=0;
		for (i=0;i<user.items.other.length;i++){
			if (user.items.other[i].name.includes(temp)){
				var temp2 = user.items.other.splice(i,1);
				break;
			}
		}
		if (temp2===0){
			convo.say("Come again?");
			convo.repeat();
		} else {
			var temp3 = utility.items(temp2[0].name);
			quicksave();
			convo.say(temp3);
			convo.ask("You can check your `status`, review your `supplies`, `plead` with Tox to end the ordeal early, or `begin` the next fight.", function(res,convo){
        rfightrouter(res,convo,2);
        convo.next();
      });
		}
	}
}

betting = function(res,convo){
  if (user.level.level===3){
    convo.say("You approach the betting window, only to be laughed and jeered at.");
    convo.say(">Look! The new " + user.level.name + " wants to wager on the fighting, but not enter the ring themselves!");
    convo.say("Rough hands shove you out the door, back up towards the Tavern.");
    tavern.tavern(res,convo);
    convo.next();
  } else {
    convo.say("At the betting window, a grizzled old man points at the upcoming match. \n" +
      ">Place yer bets! All bets are *20 Gold!* Pieces on the table, everyone!");
    convo.say("• In the *first* match, a ragged-looking swordfighter faces off against a man with a blowgun... \n" +
      "• In the *second* match, a woman wielding shining scythes prepares to battle a man in a snakelike mask... \n" +
      "• In the *third* match, a dark sorcerer's apprentice faces a scarred old duelfighter.");
    convo.ask("You can place a wager on the `first`, `second` or `third` match, check your `status` or `change` your mind.", function(res,convo){
      bettingrouter(res,convo)
      convo.next();
    });
  }
}

bettingrouter = function(res,convo){
  var temp = res.text.toLowerCase();
  if (user.gold<20){
    convo.say("The old man looks at you and sneers. \n" +
      ">This ain't a nursery, kid! We bet with Gold here! Come back when you have enough.");
    royale.royale(res,convo);
    convo.next();
  } else {
    var temp2 = Math.random();
    if (temp.includes("first")){
      convo.say("You throw your pieces of gold in the pot and wait for the match to commence.");
      if (temp2>0.5){
        convo.say("The swordfighter rushes his opponent, and the other man's blowgun is no match! The swordfighter cuts him down!");
        convo.say("The grizzled old betskeeper tosses you 40 Gold. \n" +
          ">Doubled yer money, eh? Not bad, kid!");
        convo.say("*You gain 20 Gold!*");
        user.gold += 20;
        betting(res,convo);
        convo.next();
      } else {
        convo.say("The man with the blowgun raises his weapon and covers the swordfighter in darts just as the bell rings. The swordfighter never knew what hit him, and he falls, writhing in dusty defeat.");
        convo.say("The grizzled old betskeeper tisks his tongue at you. \n" +
          ">Better luck next time, kid.");
        convo.say("*You lose 20 Gold!*");
        user.gold -= 20;
        betting(res,convo);
        convo.next();
      }
    } else if (temp.includes("second")){
      convo.say("You throw your pieces of gold in the pot and wait for the match to commence.");
      if (temp2>0.65){
        convo.say("The woman with scythes assumes a fighting stance, and at the bell, explodes in a flurry of shining slashes towards the man in the snake mask! She cuts him down with ease.");
        convo.say("The grizzled old betskeeper tosses you 60 Gold. \n" +
          ">Tripled yer money, eh? Not bad, kid!");
        convo.say("*You gain 60 Gold!*");
        user.gold += 60;
        betting(res,convo);
        convo.next();
      } else {
        convo.say("The man in the snake mask flashes his hands and chants some words, and the woman with the scythe immediately falls to her knees, clutching at her throat. A snake slithers out of her mouth...");
        convo.say("The grizzled old betskeeper tisks his tongue at you. \n" +
          ">Better luck next time, kid.");
        convo.say("*You lose 20 Gold!*");
        user.gold -= 20;
        betting(res,convo);
        convo.next();
      }
    } else if (temp.includes("third")){
      convo.say("You throw your pieces of gold in the pot and wait for the match to commence.");
      if (temp2>0.8){
        convo.say("The old duelfighter tries to distract the sorcerer's apprentice, but the younger man is ready. Locking his eyes, he casts down a dark magick that envelops the duelfighter in a haze of hornets. A regrettable way to go.");
        convo.say("The grizzled old betskeeper tosses you 100 Gold. \n" +
          ">Well, well - nice payday for you, eh kid?");
        convo.say("*You gain 100 Gold!*");
        user.gold += 100;
        betting(res,convo);
        convo.next();
      } else {
        convo.say("The old duelfighter readies himself in a fighting stance. As the bell rings, he distracts the sorcerer's apprentice with a handful of dust before feinting to the side and clubbing him over the head before the other man can whisper any incantations.");
        convo.say("The grizzled old betskeeper tisks his tongue at you. \n" +
          ">Better luck next time, kid.");
        convo.say("*You lose 20 Gold!*");
        user.gold -= 20;
        betting(res,convo);
        convo.next();
      }
    } else if (temp.includes("status")){
      royalestatus(res,convo);
      convo.next();
    } else if (temp.includes("change")){
      royale.royale(res,convo);
      convo.next();
    } else {
      convo.repeat();
    }
  }
}

royalestatus = function(res,convo){
	convo.say(utility.status());
	convo.ask("The air tastes vaguely sour. Like blood. What next? (Want a `reminder`?)", function(res,convo){
	    betting(res,convo);
	    convo.next();
	});
}