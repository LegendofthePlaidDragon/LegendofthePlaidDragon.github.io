// APOTHECARY

module.exports = {

	apothecary: function(res,convo){
		convo.say("*-------------------------------------M O R G A N ' S  A P O T H E C A R Y-------------------------------------*");
		convo.say("Beakers of queer liquid overflowing with vapor surround you. \nMorgan the Apothecary decants her latest concoction into a beaker.");
		if (user.level.level===4){
			if (user.mission==="morgan" && !missioncomplete){
				// intra-mission menu
				convo.say(">I do look forward to that Quercus root, " + user.username + "!");
				convo.ask(">Now, dear... what do you seek today?" + "\nPeruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
					apotrouter(res,convo);
					convo.next();
				});
			} else if (user.mission==="morgan" && missioncomplete){
				// finished mission - raise to level 5
				convo.say("Walking into the cabin, you meet Morgan's inquiring look by tossing the small bag containing the Quercus root down on her work table. Morgan removes the root, examining it in her hands with a specialist's eye.");
				convo.say(">This is remarkable... I've never seen such a specimen so well preserved! So fresh! You've done well, " + user.username + " - my thanks to you!" + "\n>And... as promised... you shall have your reward. Have a seat for just a moment.");
				apotlevel(res,convo);
        convo.next();
			} else {
				// before you've accepted mission
				convo.say("Sitting listlessly at her work bench, Morgan hardly looks up at you, her brow furrowed as she stares into the shimmering liquid before her. Bags hang under her eyes, and her hair is unkempt.");
				convo.ask("You may peruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
					apotrouter(res,convo);
					convo.next();
				});
			}
		} else {
		// if (flag==="drugs"){
		// 	output(3, "<span id=quote>\"Step carefully, fr...</span> she says, before looking up and seeing your tell-tale shaking and pale complexion. A thin, cruel smile spreads across her face. <span id=quote>Been taking a few too many of my remedies, have you?</span> she asks, knowingly.<br>" + 
		// 		"<span id=quote>The addiction you're experiencing now will only get worse. I promise you. And to beat it, you will require my help. Just let me know when.</span>");
		// 	output(4, "<span id=quote>Now, dear... what do you seek today?</span><br><br>" +
		// 		"<span id=menu>Press (<span id=letter>H</span>) to peruse Morgan's healing potions, (<span id=letter>M</span>) to browse her medicine list, (<span id=letter>A</span>) to ask what she's working on now, (<span id=letter>D</span>) to inquire about curing your addiction, or (<span id=letter>L</span>) to leave.</span><br>");
		// } else {
			convo.ask(">Step carefully, friend... We don't need an explosion in here. Unless, that is... uh... well, my dear, what is it you seek? \nPeruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
				apotrouter(res,convo);
				convo.next();
			});
		}
	},
	quercuswoodsturns: function(res,convo) {
		if (qturns<2){
			convo.say("Crossing a rise, you see a peculiar movement in the thicket of trees before you. Branches sway - is it the wind? Wary, you rest your hand on your " + user.items.weapon.name + " as you continue east.");
			qturns++;
			woods.gohunt(res,convo);
			convo.next();
		} else if (qturns===2){
			if (Math.random()>0.6) {
				quercus(res,convo);
			} else {
				convo.say("Crossing a rise, you see a peculiar movement in the thicket of trees before you. Branches sway - is it the wind? Wary, you rest your hand on your " + user.items.weapon.name + " as you continue east.");
				qturns++;
				woods.gohunt(res,convo);
				convo.next();
			}
		} else if (qturns===3){
			if (Math.random()>0.5){
				quercus(res,convo);
				convo.next();
			} else {
				convo.say("A distant crash in the hills around you. You sniff the wind but smell only cold air. You adjust your " + user.items.armor.name + " and check that it's tight. You note that you've seen no small game about...");
				qturns++;
				woods.gohunt(res,convo);
				convo.next();
			}
		} else if (qturns===4){
			if (Math.random()>0.4){
				quercus(res,convo);
				convo.next();
			} else {
				convo.say("In a small clearing, you pass the fresh carcass of a Wereharron. Its bones have been picked clean.");
				qturns++;
				woods.gohunt(res,convo);
				convo.next();
		  } 
	  } else {
      quercus(res,convo);
      convo.next();
    }
  }
}
  ////////////////////////////////////////////
//
// LEVEL 4 QUERCUS MISSION STUFF
//
////////////////////////////////////////////

quercus = function(res,convo){
	monster = beasts.beasts.lev4b;
	mhp = monster.hp;
	convo.say("The ground trembles beneath your feet as you hear a low boom behind you. You spin around and unsheath your " + user.items.weapon.name + ", but see only leaves falling from the trees around you. An empty forest surrounds you. And yet...");
	convo.say("A giant tree branch swings your way! You manage to duck and roll away, and it misses your head by inches. But looking up, you see a great, hulking, living tree trunk lumber your way, supported by a churning knot of roots, big and small. The great tree has no face, but its branches are streaked in blood.");
	convo.say("The Quercus tree bears down on you! Defend yourself!\n" +
				"```Your hitpoints: " + user.hp + "\n" +
				monster.name +"'s hitpoints: " + mhp + "```");
	convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
		qfightrouter(res,convo);
		convo.next();
	});
}

querfight = function(res,convo,turn){
	var temp = res.text.toLowerCase();
	if (turn===1){
		// player turn 
		convo.say("Readying your weapon, you steel yourself for battle.");
		var result = woods.userfight(monster);
		if (result === "k") {
		// kill the monster			
			if (turns === 0) {
				console.log("(" + user.username + ") kill single blow");
				convo.say("With a mighty yell, you cut down the Quercus in a single, reverberating blow!");
				qvictory(res,convo);
			} else { 
				console.log("(" + user.username + ") kill");
				convo.say("With a mighty yell, you cut down the Quercus in a final, reverberating blow! Chips of wood spray across the forest floor as the giant killer tree reels and crashes to the ground, dead.");
				qvictory(res,convo);
        convo.next();
			}	
		} else if (result==="zip"){
		// strike, 0 damage
			convo.say("You uselessly strike at " + monster.name + " with your " + user.items.weapon.name + " but hilariously inflict no damage!");
			querfight(res,convo,2);
			convo.next();
		} else { 
		// strike don't kill
			convo.say("You strike the Quercus with your " + user.items.weapon.name + ", inflicting " + result + " in damage! The great tree stumbles and roars back in wrath!");
			querfight(res,convo,2);
			convo.next();
			}
	} else if (turn===2){
		// monster turn
		var result = woods.monsterfight(monster)
		if (result === "dead"){
			console.log("(" + user.username + ") dead");
			convo.say("Zounds! The Quercus crushes you between two thick branches! You feel your chest crunching between its limbs. As the world fades, you feel roots beginning to envelop you to become the living tree's next meal...");
			death(res,convo);
			convo.next();
		}
		else if (result==="zip"){
			convo.say("The Quercus glances you with a thrusting root, but your armor protects you! You sustain 0 damage!\n " +
				"```Your hitpoints: " + user.hp + "\n" +
				monster.name +"'s hitpoints: " + mhp + "```");
			convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
				qfightrouter(res,convo);
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
				qfightrouter(res,convo);
				convo.next();
			});
		}
	} else if (turn==="m"){
		// invoke magick
		if (user.items.magic.length===0){
			convo.say("You have no knowledge of magicks yet!");
			convo.repeat();
		} else {
			var temp = utility.showmagic();
			convo.say(temp);
			convo.ask("Enter the name of the magick you wish to lance, or use no magick at all and `attack` the old fashioned way.", function(res,convo){
				qfightrouter(res,convo,3);
				convo.next();
			});
		}
	}
}

qfightrouter = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (temp.includes("run")){
		convo.say("You prefer your hide to your pride, and turn to run away!");
		if (Math.random()>0.75){
			// failed
			convo.say("You're not quick enough to avoid the Quercus root that shoots out and grabs your foot, dragging you back to face its wrath!");
			// 
		} else {
			convo.say("You manage to outrun the fearsome Quercus. You resolve to not tell anyone about this...");
			user.turnsToday -= turns;
			turns = 0;
      quicksave();
			woods.woodsstart(res,convo);
      convo.next();
		}
	} else if (temp.includes("magick")){
		querfight(res,convo,"m");
    convo.next();
	} else if (temp.includes("attack")){
		querfight(res,convo,1)
    convo.next();
	} else if (x===3){
		// lancing magic you have from middle of a fight
    if (temp.includes("thunderous")){
      if (!utility.hasmagic("thunderous")) {
        // user owns the spell they input
        convo.say("This magick is yet unknown to you!");
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          qfightrouter(res,convo);
          convo.next();
			  });
      } else if (user.turnsToday<=spellz.clap.turnsreq) {
        convo.say("You do not have enough turns left today to invoke this magick.")
        convo.repeat();
		  } else {
        attackdamage = spellz.clap.attack - monster.defense
        console.log("user attack: " + attackdamage);
        turns += spellz.clap.turnsreq;
        mhp = mhp - attackdamage;
        convo.say("Summoning up the old words, you lance the Thunderous Clap upon the " + monster.name + ", bringing down a calamitous din upon its ears!" +
          "\n You inflict " + attackdamage + " damage!");
        if (mhp <= 0) {
          // damage the monster & kill
          console.log("(" + user.username + ") kill");
          convo.say("With a heroic blow, you vanquish the " + monster.name + "!");
          qvictory(res,convo);
          convo.next();
        } else {
          // damage the monster, don't kill
          querfight(res,convo,2);
          convo.next();
        }
		  }
	  } else if (temp.includes("shield")){
      if (user.turnsToday<=spellz.shield.turnsreq) {
        convo.say("You do not have enough turns left today to invoke this magick.")
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          qfightrouter(res,convo);
          convo.next();
        });
      } else if (!utility.hasmagic("shield")) {
          // user owns the spell they input
        convo.say("This magick is yet unknown to you!");
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          qfightrouter(res,convo);
          convo.next();
        });
      } else if (shieldflag){
        convo.say("You have already invoked this magick.");
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          woodsfightrouter(res,convo);
          convo.next();
        });
      } else {
        shieldflag=true;
        turns += spellz.shield.turnsreq;
        convo.say("Summoning up the old words, you lance the Egregious Shield incantation, cloaking yourself in a blue protective haze of magick.");
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          qfightrouter(res,convo);
          convo.next();
        });
      }
    } else if (temp.includes("words")){
      if (user.turnsToday<=spellz.heal.turnsreq) {
        convo.say("You do not have enough turns left today to invoke this magick.")
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          qfightrouter(res,convo);
          convo.next();
        });
      } else if (!utility.hasmagic("words")) {
          // user owns the spell they input
        convo.say("This magick is yet unknown to you!");
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          qfightrouter(res,convo);
          convo.next();
        });
      } else {
        turns += spellz.heal.turnsreq;
        user.hp = user.level.maxhp;
        quicksave();
        convo.say("Summoning up the old words, you lance the Curative Words incantation, healing yourself fully.");
        convo.ask("Do you `attack`, attempt to `run` away, or invoke `magick`?", function(res,convo){
          qfightrouter(res,convo);
          convo.next();
        });
      }
    } else if (temp.includes("sword")){
      // we don't have this level yet
    } else {
      convo.repeat();
    }
  }
}

qvictory = function(res,convo){
  convo.say("Leaves flutter all around you as the branches of the Quercus settle on the ground. Its writhing roots lay still now, slowly sinking into the soil. Thinking quickly, you rush over and slice off a large section of root. It trembles a bit in your hand and then goes limp.");
	convo.say("*You should return the root to Morgan the Apothecary right away!*");
  missioncomplete=true;
  monster=undefined;
  turns=0;
  convo.ask("*Catch your breath, and then `continue`.*", function(res,convo){
      woods.woodsstart(res,convo);
      convo.next();
    });
}


////////////////////////////////////////////
//
// END QUERCUS MISSION FUNCTIONS
//
////////////////////////////////////////////

istherefire = function(){
	// checks to see if the player has any MFCs
	for (i=0;i<user.items.other.length;i++){
		if (user.items.other[i].name==="Morgan's Fire Chanter"){
			return true;
			break
		  }
	  }
	  return false;
}

apotrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("heal")){
		convo.say("Morgan looks you over quickly, and tisks her tongue. \n>Feel a wee bit peckish, eh dear? Don't worry... if you have the gold, I'll have you feeling better soon. \nHere's what I have today: \n`1` - " + items.heals.basic.name + " (" + items.heals.basic.gold + " Gold)\n`2` - " + items.heals.potent.name + " (" + items.heals.potent.gold + " Gold)");
			// future antibotic item:
			// \n`3` - " + items.heals.antibiotic.name + " (" + items.heals.antibiotic.gold + " Gold)");
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			apotmerchrouter(res,convo,1);
			convo.next();
		});
	} else if (temp.includes("medicines")){
		convo.say("Morgan nods her head. \n>If you have the gold, I have the medicines you need, my dear. Here's what I have today: \n`1` - " + items.meds.sober.name + " (" + items.meds.sober.gold + " Gold)\n`2` - " + items.meds.kola.name + " (" + items.meds.kola.gold + " Gold)\n`3` - " + items.meds.berserk.name + " (" + items.meds.berserk.gold + " Gold)");
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			apotmerchrouter(res,convo,2);
			convo.next();
		});
	} else if (temp.includes("ask")){
		if (user.level.level===4 && user.mission==="morgan"){
      convo.say("Morgan looks up at you, her eyebrows raised skeptically. \n" +
        ">The Quercus root? In the Dark Woods? Don't tell me you've forgotten already...");
      convo.ask("What next? (Want a `reminder`?)", function(res,convo){
        apotrouter(res,convo);
        convo.next();
      });
    } else if (user.level.level===4){
			convo.say("Morgan hesitates for a few beats, and then sighs deeply. She puts down the stirrer for the beaker before her. \n>I am working on a new potion for an idea I have, but... \nShe trails off, lost in thought.");
			convo.say("Only after you cough loudly does she startle, looking back up at you. \n>Oh! I... I'm sorry... this new project has kept me up nights. I think I may have stumbled on a new concoction that's quite... extraordinary... yet I'm missing a critical ingredient. Nothing I try acts as a proper substitute.");
			convo.say("Morgan tilts her head up to you and narrows her eyes. \n>Actually... there *is* a way you could help, if you wanted to... I could certainly make it worth your time. The ingredient I lack is a cutting of a *Quercus tree root.* I haven't seen one in a long time - they're exceedingly rare. I've heard word of a mature Quercus deep in a hollow of the Dark Woods, but... I don't dare venture there myself. You, however, might be ready.");
			convo.say(">So... are you interested?");
			convo.ask("Shall you `accept` Morgan's errand, or `decline` for now?", function(res,convo){
				apotrouter(res,convo,2);
				convo.next();
			});
		} else {
			convo.say("Ask another time, " + user.username + ". You never know what I may have for you.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            apotrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("street")){
		convo.say("Your business concluded, you give Morgan a bow and make your way to the door.");
		town.townsquare(res,convo);
	} else if (temp.includes("reminder")){
		convo.ask("You may peruse Morgan's `heal`ing potions, browse her `medicines` list, `ask` what she's working on now, or return to the `street`.", function(res,convo){
			apotrouter(res,convo);
			convo.next();
		});
	} else if (temp.includes("accept") && user.level.level===4) {
		// accept Morgan's request
		convo.say("Morgan's eyes light up. \n>Egads! Thank you! This potion will be like nothing you've ever seen... just you wait!");
		convo.say("*You have accepted Morgan's Request!* \nMorgan draws you a crude map of the eastern quarter of the Dark Woods. You'll begin your search there.");
		user.mission = "morgan";
    user.missionname = "Morgan's Request";
		convo.say("Morgan clears her throat and squints at you. \n>Just one more thing, " + user.username + " - have you ever... ahem... actually *seen* a Quercus?");
		convo.say("Seeing you shake your head, Morgan looks nervously around. \n>Ah. I see. Ah. Well... a word to the wise? Make sure you keep that " + user.items.weapon.name + " ready. I hear Quercus trees hate... strangers. Be safe, now. This one's on the house.");
		convo.say("Morgan slides a healing potion over to you!");
		user.items.other.push(items.heals.basic);
    quicksave();
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else if (temp.includes("decline") && user.level.level===4){
		// decline Morgan's request for now
		convo.say("Morgan shrugs. \n>Suit yourself... maybe another time.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else {
		convo.repeat();
	}
}

apotmerchrouter = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (temp.includes("none")) {
		convo.say("Morgan rolls her eyes. \n>I haven't got all day, you know.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else if (x===1){
		// heals 
		if (temp.includes("1")){
			currentmerch = items.heals.basic;
			convo.ask("Are you sure you want the " + items.heals.basic.name + "? \nThis is your standard-issue rejuvenating elixir. Restores up to 20 HP. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("2")){
			currentmerch = items.heals.potent;
			convo.ask("Are you sure you want the " + items.heals.potent.name + "? \nA more potent rejuvenating elixir. Restores up to 40 HP. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		// } else if (temp.includes("3")){
		// 	currentmerch = items.heals.antibiotic;
		// 	convo.ask("Are you sure you want the " + items.heals.basic.name + "? \nThis is your standard-issue rejuvenating elixir. Restores up to 20 HP. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
		// 		apotmerchconfirm(res,convo);
		// 		convo.next();
		// 	});
		} else {
			convo.say("Come again?");
			convo.repeat();
		}
	} else if (x===2){
		// meds
		if (temp.includes("1")){
			currentmerch = items.meds.sober;
			convo.ask("Are you sure you want the " + items.meds.sober.name + "? \nHad a few too many at the Tavern? This elixir will immediately clear your mind and put you back in fighting form. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("2")){
			currentmerch = items.meds.kola;
			convo.ask("Are you sure you want the " + items.meds.kola.name + "? \nHeading into the forest? Need to sharpen your senses? A few kola nuts will stimulate your senses, and give you 5 extra turns for the day. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("3")){
			currentmerch = items.meds.berserk;
			convo.ask("Are you sure you want the " + items.meds.berserk.name + "? \nBe wary with this one. The berserker infusion is powerful. It will temporarily make you extra-powerful, super strong and a terrifying battle opponent - but some of its... effects... will also linger after the battle ends. \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				apotmerchconfirm(res,convo);
				convo.next();
			});
		} else {
			convo.say("Come again?");
			convo.repeat();
		}
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

apotmerchconfirm = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("change")){
		convo.say("Morgan rolls her eyes. \n>I haven't got all day, you know.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
      apotrouter(res,convo);
      convo.next();
    });
	} else if (currentmerch.gold > user.gold) {
		// not enough simoleons
		convo.say("Morgan's eyebrow arches up. \n>This is not the tavern, and my medicines aren't cheap swill. Come back when you have enough gold.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
      apotrouter(res,convo);
      convo.next();
    });
	} else if (temp.includes("confirm")) {
		user.gold -= currentmerch.gold;
		user.items.other.push(currentmerch);
		convo.say("Morgan smiles, handing you the " + currentmerch.name + " and slipping your gold into one of her robe's deep pockets. \n>Feel better soon, " + user.level.name + ".");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            apotrouter(res,convo);
            convo.next();
        });
	} else {
		convo.repeat();
	}
}

apotlevel = function(res,convo){
  convo.say("Morgan disappears into the dark laboratory room separated by a thick shroud. You think you see something moving in there... She emerges a few minutes later and hands you a small, hard object inside a leather pouch. \n" +
    ">This is a vial of my newest creation, " + user.username + ". I call it, my *Fire Chanter.* You may use it in combat - but *beware.* It will engulf whatever you throw it at in a... well, really quite, uh, beautiful... fireball. It should vanquish all but _extremely_ formidable enemies. \n" +
    ">With this root sample you've given me, I will be able to synthesize more of this potion from now on, too. For... a reasonable price, of course.");
  convo.say("Morgan grins wanly and goes back to her experiments. \n" + 
    "You have fulfilled Morgan's Request! *You advance to Level 5: Rogue.* \n" +
		"Your maximum hitpoints have increased, and you receive an additional 100 experience!");
  utility.levelup(5);
  quicksave();
  convo.ask("*Catch your breath, and then `continue`.*", function(res,convo){
      apot.apothecary(res,convo);
      convo.next();
    });
}