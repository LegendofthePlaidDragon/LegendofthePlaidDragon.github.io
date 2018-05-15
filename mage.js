// Mage

module.exports = {

	mage: function(res,convo){
		convo.say("*-------------------------------------T H E  M A G E ' S  C A V E-------------------------------------*");
		convo.say("The dark cave is barely lit by a torch deep inside..." +
			"\nFollowing the torchlight, you soon come to a small hovel built into the cave wall. A low hum emanates from inside. As you peer in, a shrouded figure emerges from the shadows. It speaks with a gravelly rattle.");
		convo.say(">What brings you here? I wish no contact with your people!");
		convo.ask("Ask the Mage about its `sorcery` or `return` to the Dark Woods.", function(res,convo){
			magerouter(res,convo);
			convo.next();
		});
	}
}

magerouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("sorcery")){
		convo.say("The creature whispers." +
			"\n>Ah... yes... What sorcery I can teach you is limited only by your capacity to learn! Well... that, and how many shiny things you have brought me." +
			"\n>As your mind becomes stronger, and you gain in your Mysticism, I can teach you new curses to lance upon your enemies - or yourself. Each lesson will cost you in gold, plus one *precious gem.*" +
			"\n>Here's what you I'm willing to share with you for now...\n" + spellist());
		convo.say("Your current sorcery: " + showspells());
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			mageconfirm(res,convo);
			convo.next();
		});
	} else if (temp.includes("return")){
		convo.say("Wanting no more part of this place, you return to the Dark Woods.");
		woods.woodsstart(res,convo);
	} else if (temp.includes("reminder")){
		convo.ask("You can ask the Mage about its `sorcery` or `return` to the Dark Woods.", function(res,convo){
			magerouter(res,convo);
			convo.next();
		});
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

mageconfirm = function(res,convo,x){
  var temp = res.text.toLowerCase();  
	if (checkCunning(x)) {
		convo.say("The Mage shakes his great, hooded head." +
			"\n>You lack the Mysticism required for such advanced sorcery. Come back when you are more... mystical.");
		convo.say("Chastened by his scolding, you exit the cave in search of wisdom in the Dark Woods.");
		woods.woodsstart(res,convo);
	} else if (temp.includes("1")) {
		currentmerch = spellz.clap;
		convo.ask("Are you sure you want to learn the " + spellz.clap.opname + " curse? \nYou may `confirm` your purchase, or `change` your mind.", function(res,convo){
				mpurch(res,convo);
				convo.next();
			});
	} else if (temp.includes("2")){
		currentmerch = spellz.shield;
		convo.ask("Are you sure you want to learn the " + spellz.shield.opname + " curse? \nYou may `confirm` your purchase, or `change` your mind.", function(res,convo){
				mpurch(res,convo);
				convo.next();
			});
	} else if (temp.includes("3")){
		currentmerch = spellz.heal;
		convo.ask("Are you sure you want to learn the " + spellz.heal.opname + " incantation? \nYou may `confirm` your purchase, or `change` your mind.", function(res,convo){
				mpurch(res,convo);
				convo.next();
			});
	} else if (temp.includes("none")){
		convo.say("The Mage sighs." +
			"\n>Do not dawdle with me, " + user.level.name + "...");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
      magerouter(res,convo);
      convo.next();
    });
	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}

mpurch = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("change")){
		convo.say("The Mage sighs." +
			"\n>Do not dawdle with me, " + user.level.name + "...");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            magerouter(res,convo);
            convo.next();
        });
	} else if (currentmerch.gold > user.gold || !findgems()) {
		// not enough simoleons
		convo.say("The Mage sighs." +
			"\n>Knowledge is free, but education is not. Come back when you have gold and rubies equal to my enchantments, " + user.level.name +".");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            magerouter(res,convo);
            convo.next();
        });
	} else if (temp.includes("confirm")) {
    // FLAG - doesn't work?
		if (utility.confirmsameitem("mag")){
			convo.say("The Mage flickers in and out the air in the dim light." +
				"\n>Do you forget my lessons so easily, foolish one? I have already taught you this magick.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            magerouter(res,convo);
	            convo.next();
        	});
		} else {
			sessionevents.minor.push["magebuy"];
			user.gold -= currentmerch.gold;
			user.items.magic.push(currentmerch);
			console.log("magic assign: " + currentmerch.name);
			convo.say("The Mage nods solumnly, its shouded head dipping as you hear foreign-sounding chants too low for you to hear. Soon, you feel a spark of inspiration, and the " + currentmerch.name + " magick is suddenly familiar to you!");
			convo.say(">Wield this magick wisely, young one...");
			convo.say("Your gold pouch feels mysteriously lighter.");
			currentmerch=undefined;
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            magerouter(res,convo);
	            convo.next();
	        });
		}
	} else {
		convo.repeat();
	}
}

checkCunning = function(x){
	x = Number(x);
	if (x===1){
		if (user.attributes.myst<spellz.clap.cunningreq){
			return true
		}
	} else if (x===2){
		if (user.attributes.myst<spellz.shield.cunningreq){
			return true
		}
	} else if (x===3){
		if (user.attributes.myst<spellz.heal.cunningreq){
			return true
		}
	} else return false;
}

spellist = function(){
	var temp = "`1` - " + spellz.clap.name + " (" + spellz.clap.gold + " Gold)\n`2` - " + spellz.shield.name + " (" + spellz.shield.gold + " Gold)\n`3` - " + spellz.heal.name +" (" + spellz.heal.gold + " Gold)";
	if (user.level.level>=3){
		temp += "\n`4` - "+ spellz.sword.name +" (" + spellz.sword.gold + " Gold)";
	}
	if (user.level.level>=4){
		// temp += "\n`5` - "+ items.weapons.oldsword.name +" (" + items.weapons.oldsword.gold + " Gold";
	}
	// horizontal line here?
	return temp;
}

showspells = function(){
	if (user.items.magic.length===0){
		return "None!"
	} else {
		var returnvar = "";
		for (i=0;i<user.items.magic.length;i++){
	            returnvar += user.items.magic[i].name + ", ";
	        }
	    returnvar += "and some card tricks.";
	    return returnvar;
	}
}