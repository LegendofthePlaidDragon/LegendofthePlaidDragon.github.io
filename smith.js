// SMITHY

module.exports = {

	smithy: function (res,convo){
		convo.say("*-------------------------------------T H E  S M I T H E R Y-------------------------------------*");
		convo.say("The smell of burning iron fills your nose. Rolf the Smithy looks up from his workbench. \n>What do YOU want?");
		convo.ask("You may browse through Rolf's collection of `weaponry` and `armor`, or decide to return to the `street`.", function(res,convo){
            smithrouter(res,convo);
            convo.next();
        });
	}
}

smithrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("weaponry")){
		convo.say("Rolf scowls. \n>Well, all right then... here's what I got today: \n " + weaps());
		convo.say("Your current weapon: " + user.items.weapon.name);
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			smithmerchrouter(res,convo,1);
			convo.next();
		});
	} else if (temp.includes("armor")){
		convo.say("Rolf scowls. \n>Well, all right then... here's what I got today: \n " + arms());
		convo.say("Your current weapon: " + user.items.armor.name);
		convo.ask("Select your merchandise, or decide `none` of them interest you.", function(res,convo){
			smithmerchrouter(res,convo,2);
			convo.next();
		});
	} else if (temp.includes("street")){
		convo.say("Your business concluded, you nod to Rolf and make your way to the door.");
		town.townsquare(res,convo);
	} else if (temp.includes("reminder")){
		convo.ask("You may browse through Rolf's collection of `weaponry` and `armor`, or decide to return to the `street`.", function(res,convo){
			smithrouter(res,convo);
			convo.next();
		});
	} else {
		convo.repeat();
	}
}

smithmerchrouter = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (temp.includes("none")) {
		convo.say("Rolf grunts. \n>Fickle lil fella, ain't ya?");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            smithrouter(res,convo);
            convo.next();
        });
	} else if (x===1){
		// weapons
		if (temp.includes("1")){
			currentmerch = items.weapons.club;
			convo.ask("Are you sure you want the " + items.weapons.club.name + "? \n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("2")){
			currentmerch = items.weapons.sclub;
			convo.ask("Are you sure you want the " + items.weapons.sclub.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("3")){
			currentmerch = items.weapons.fsword;
			convo.ask("Are you sure you want the " + items.weapons.fsword.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("4") && user.level.level>=2){
			currentmerch = items.weapons.mace;
			convo.ask("Are you sure you want the " + items.weapons.mace.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo);
				convo.next();
			});
		} else if (temp.includes("5") && user.level.level>=3){
			currentmerch = items.weapons.oldsword;
			convo.ask("Are you sure you want the " + items.weapons.oldsword.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo);
				convo.next();
			});
		} else {
			convo.say("Come again?");
			convo.repeat();
		}
	} else if (x===2) {
		// armor
		if (temp.includes("1")){
			currentmerch = items.armor.canvas;
			convo.ask("Are you sure you want the " + items.armor.canvas.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo,2);
				convo.next();
			});
		} else if (temp.includes("2")){
			currentmerch = items.armor.leather;
			convo.ask("Are you sure you want the " + items.armor.leather.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo,2);
				convo.next();
			});
		} else if (temp.includes("3")){
			currentmerch = items.armor.stud;
			convo.ask("Are you sure you want the " + items.armor.stud.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo,2);
				convo.next();
			});
		} else if (temp.includes("4") && user.level.level>=2){
			currentmerch = items.armor.rivet;
			convo.ask("Are you sure you want the " + items.armor.rivet.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo,2);
				convo.next();
			});
		} else if (temp.includes("5") && user.level.level>=3){
			currentmerch = items.armor.steel;
			convo.ask("Are you sure you want the " + items.armor.steel.name + "?\n You may `confirm` your purchase, or `change` your mind.", function(res,convo){
				smithmerchconfirm(res,convo,2);
				convo.next();
			});
		} else {
			convo.say("Come again?");
			convo.repeat();
		}
	}
}

smithmerchconfirm = function(res,convo,x){
	var temp = res.text.toLowerCase();
	if (temp.includes("change")){
		convo.say("Rolf grunts. \n>Fickle lil fella, ain't ya?");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            smithrouter(res,convo);
            convo.next();
        });
	} else if (currentmerch.gold > user.gold) {
		// not enough simoleons
		convo.say("Rolf snorts. \n>This here ain't a charity! Come back when you got enough gold!");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            smithrouter(res,convo);
            convo.next();
        });
	} else if (temp.includes("confirm")) {
		sessionevents.minor.push["smithbuy"];
		user.gold -= currentmerch.gold;
		if (x===2){
			console.log("pre - armor name: " + user.items.armor.name);
			user.items.armor = currentmerch;
			console.log("post - armor name: " + user.items.armor.name);
		} else {
			console.log("pre - weaps name: " + user.items.weapon.name);
			user.items.weapon = currentmerch;
			console.log("post - weaps name: " + user.items.weapon.name);
		}
		convo.say("Rolf grunts, handing over the " + currentmerch.name + " and putting your pouch of gold under the counter. \n>Wield it well, " + user.level.name + ".");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            smithrouter(res,convo);
            convo.next();
        });
	} else {
		convo.repeat();
	}
}	

weaps = function(){
	var temp = "`1` - " + items.weapons.club.name + " (" + items.weapons.club.gold + " Gold)\n`2` - " + items.weapons.sclub.name + " (" + items.weapons.sclub.gold + " Gold)\n`3` - " + items.weapons.fsword.name +" (" + items.weapons.fsword.gold + " Gold)";
	if (user.level.level>=2){
		temp += "\n`4` - "+ items.weapons.mace.name +" (" + items.weapons.mace.gold + " Gold)";
	}
	if (user.level.level>=3){
		temp += "\n`5` - "+ items.weapons.oldsword.name +" (" + items.weapons.oldsword.gold + " Gold)";
	}
	// horizontal line here?
	return temp;
}

arms = function(){
	var temp = "`1` - " + items.armor.canvas.name + " (" + items.armor.canvas.gold + " Gold)\n`2` - " + items.armor.leather.name + " (" + items.armor.leather.gold + " Gold)\n`3` - " + items.armor.stud.name +" (" + items.armor.stud.gold + " Gold)";
	if (user.level.level>=2){
		temp += "\n`4` - "+ items.armor.rivet.name +" (" + items.armor.rivet.gold + " Gold)";
	}
	if (user.level.level>=3){
		temp += "\n`5` - "+ items.armor.steel.name +" (" + items.armor.steel.gold + " Gold)";
	}
	// horizontal line here?
	return temp;
}

