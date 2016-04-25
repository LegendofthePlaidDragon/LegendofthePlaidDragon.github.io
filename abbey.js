// ABBEY

module.exports = {

	abbey: function(res,convo){
		convo.say("*-------------------------------------T H E  V I L L A G E  A B B E Y-------------------------------------*");
		if (user.xp < 102) {
			convo.say("The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed. \nAn old man in a simple wool frock is sweeping debris on one side of the room. You can tell he has been weeping. He looks up as you enter the room, but shakes his head.");
			convo.say(">You can't help us yet! No one can...");	
			convo.say("Seeing nothing more for you here, you turn and return to town.");
			town.townsquare(res,convo);
		} else if (user.xp >=102 && user.level.level<2){
			if (user.mission==="abbey" && missioncomplete){
				// post-mission/level up
				utility.levelup(2);
				user.gold += 200;
				user.xp += 50;
				convo.say("The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed. The old Cleric lights up as you enter the Abbey. \n>You did it! You really did it! Verily, you were sent to us by the Great Father!");
				convo.say(">Our order will gratefully pray for your health and vitality. But in addition, please accept these most modest of tokens of our deepest thanks. \nYou receive 200 gold and 50 experience! \n*You have returned the Cleric's censer!*");
					abbeyup(res,convo);
					convo.next();
			} else if (user.mission==="abbey"){
				// during mission	
				convo.say("The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed. The old Cleric looks up from his cleaning as you enter the room, and his wet eyes brighten. \n>Greetings, wanderer. Our congregation cannot wait for the safe return of our precious censer... truly, you are most noble in taking on this dangerous task!");
				convo.say("Seeing nothing more for you here, you turn and return to town. \n");
				town.townsquare(res,convo);
			} else {
				// gives mission
				convo.say("The Abbey's door hangs a single hinge. Inside, broken benches are strewn about in disarray. The altar in the front of the room is smashed. An old Cleric in a simple wool frock is sweeping debris on one side of the room. You can tell he has been weeping. \nHe looks up as you enter the room, and his eyes light up. \n>Greetings, wanderer. You... you aren't here to loot us, are you? As you can see, we have nothing else of value here...");
				convo.ask("`Ask` the old man what happened, or turn and `return` to town.", function(res,convo){
					abbeyrouter(res,convo,1);
					convo.next();
				});
			}
		} else if (user.level.level>=2){
			// beyond level 1
			convo.say("The Abbey's new oak double doors gleam in the afternoon light. The new altar at the front is spit polished and gives a warm, inviting glow. The old Cleric, resplendent in soft robes, greets you with a smile. \n>Welcome again, child. What brings you back to our humble house?");
			convo.ask("You may inquire about The `Faith`, `rest` and reflect in the nave, ask the Cleric to `heal` you, or turn and `return` to town.", function(res,convo){
					abbeyrouter(res,convo);
					convo.next();
				});
		}
	}

}

abbeyrouter = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (x===1){
		// cleric gives the mission
		if (temp.includes('ask')){
			convo.say("The old Cleric pauses his sweeping and settles on one of the few benches left intact. \n>Well... as you can see, wanderer, we are but a humble village abbey here. As Cleric, I lead the people here in our observance of The Faith, as the Great Father requires. \n\n>The other day, this holy sanctuary was desecrated by marauders. They came in the night, stole our precious censer, and gave me quite a bump on the head in the process... they fled to the *Dark Woods* and haven't been seen since. \n\n>I see you do not wear the hood of a Keeper of our Faith. Even so, perhaps you would be willing to help catch these bandits and recover our lost censer? This Abbey would be greatly in your debt.");
			convo.ask("You may `accept` the Cleric's request, or opt to `decline` for now.", function(res,convo){
				abbey1(res,convo);
				convo.next();
			});
		} else if (temp.includes('return')){
			convo.say("Seeing nothing more for you here, you turn and return to town.");
			town.townsquare(res,convo);
		} else {
			convo.repeat();
		}
	} else {
		// level 2 or higher menu
		if (temp.includes('faith')){
			afaith(res,convo);
		} else if (temp.includes('rest')){
			convo.say("You quietly take a seat in the Abbey's nave. You are contemplative and silent for a while.");
			convo.ask("The Abbey is quiet and solumn. What next? (Want a `reminder`?)", function(res,convo){
			    abbeyrouter(res,convo);
			    convo.next();
			});
		} else if (temp.includes('heal')){
			abbeyheal(res,convo);
		} else if (temp.includes('return')){
			convo.say("Giving your respects to the Cleric, you rise and head for the door.");
        	town.townsquare(res,convo);
		} else if (temp.includes('reminder')){
			convo.ask("You may inquire about The `Faith`, `rest` and reflect in the nave, ask the Cleric to `heal` you, or turn and `return` to town.", function(res,convo){
					abbeyrouter(res,convo);
					convo.next();
				});
		} else {
			convo.repeat();
		}
	}
}

abbey1 = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes('accept')){
		convo.say("The old Cleric's face brightens and he claps his hands with quiet gratitude. \n>Truly, the Great Father sent you to us! Thank you, my child! With your formidable skills and the Great Father's guiding hand, how can you not succeed? \n\n>All I know is that the thieves fled into the *Dark Woods*. They were last seen by a farmer heading east. Be vigilant - they are armed, and do not likely fear meeting the Great Father in the world beyond!");
		convo.say("*You have accepted the Cleric's mission!* \nFilled with newfound purpose, you turn to leave the Abbey.\n\n");
		user.mission = "abbey"
		town.townsquare(res,convo);
	} else if (temp.includes('decline')) {
		convo.say("The old Cleric's face falls in disappointment. \n>Well... perhaps another time, then. Go with the Father, child.\n He stands up and goes back to sweeping the floor.");
		convo.say("Seeing nothing more for you here, you turn and return to town.");
			town.townsquare(res,convo);
	} else {
		convo.repeat();
	}
}

abbeyup = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (x===2){
		if (temp.includes('luck')){
			user.attributes.luck += 1;
			convo.say("1 point has been added to your luck. This will make fortune smile upon you!");
		} else if (temp.includes('strength')){
			user.attributes.strength += 1;
			convo.say("1 point has been added to your strength. This will make you more powerful in combat!");
		} else if (temp.includes('charisma')){
			user.attributes.charisma += 1;
			convo.say("1 point has been added to your charisma. This will make you wittier, funnier, and more charming!");
		} else if (temp.includes('mysticism')){
			user.attributes.myst += 1;
			convo.say("1 point has been added to your mysticism. But you already knew that, didn't you?");
		} else {
			convo.repeat();
		}
		convo.ask("You may inquire about The `Faith`, `rest` and reflect in the nave, ask the Cleric to `heal` you, or turn and `return` to town.", function(res,convo){
				abbeyrouter(res,convo);
				convo.next();
		});
	} else {
		convo.say("*You have advanced to Level 2: Apprentice.*");
		convo.ask("Your maximum hitpoints have increased, and new areas of town are now open to you. \nIn addition, you may add 1 point to any one of your following attributes: `Luck`, `Strength`, `Charisma` or `Mysticism`. \nWhich attribute would you like to add this point to?", function(res,convo){
			abbeyup(res,convo,2);
			convo.next();
		});
	}
}

afaith = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (x===1){
		convo.say("The Cleric smiles warmly and grasps your arm. \n>Truly, you honor us, child. But you are as yet inexperienced. Ask again when you achieve the level of Challenger - and we will consider your worthiness for the community of The Faithful.");
			convo.ask("The Abbey is quiet and solumn. What next? (Want a `reminder`?)", function(res,convo){
			    abbeyrouter(res,convo);
			    convo.next();
			});
		} // add faithful stuff here
	else {
		convo.say(">The Faithful are an order devoted to righteousness and the True Path. We also help our brothers and sisters in Faith however we can.");
		convo.ask(">Are you, my child, interested in one day taking the Cowl of our Faith?", function(res,convo){
			afaith(res,convo,1);
			convo.next();
		});
	}
}

abbeyheal = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (x===1){
		if (temp.includes("change")){
			convo.say(">Suit yourself, my child.");
			convo.ask("The Abbey is quiet and solumn. What next? (Want a `reminder`?)", function(res,convo){
				abbeyrouter(res,convo);
				convo.next();
			});
		} else if (temp.includes("heal")) {
			if (user.gold>=65){
				user.hp = user.level.maxhp;
				user.gold -= 65;
				convo.say("The Cleric hurries you over to an empty bench, and gives you an infusion from a vial hidden behind the altar. You breathe a deep sigh of relief as your health comes rushing back. You hardly notice that your gold pouch is a little lighter.");
				convo.ask("The Abbey is quiet and solumn. What next? (Want a `reminder`?)", function(res,convo){
				    abbeyrouter(res,convo);
				    convo.next();
				});
			} else if (user.gold<65){
				convo.say("The Cleric stammers uncomfortably. \n>You, ahem... seem to have misplaced your funds, my child. When you find them, please return so we can heal your wounds.")
				convo.ask("The Abbey is quiet and solumn. What next? (Want a `reminder`?)", function(res,convo){
				    abbeyrouter(res,convo);
				    convo.next();
				});
			}
		} else {
			convo.repeat();
		}
	} else {
		convo.say(">Do you require our aid to revive your health, my child? We stand ready to assist. All we ask is a small donation for... expenses. You understand, I'm sure.");
		convo.ask("Do you ask the Cleric to `heal` you completely for *65 gold*, or `change` your mind?", function(res,convo){
			abbeyheal(res,convo,1);
			convo.next();
		});
	}
}

