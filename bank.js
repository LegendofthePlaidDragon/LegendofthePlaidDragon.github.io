// BANK

module.exports = {

	bank: function(res,convo){
		convo.say("*-------------------------------------T H E  B A N K-------------------------------------*");
		convo.say("Inside the Bank's heavy iron doors, a hushed silence prevails. Chairs scrape on the stone floor. \nThe bespecled manager looks up disdainfully as you walk in. He sighs. \n>Can I... help you, sir?");	
		convo.ask("Do you wish to `deposit` your gold with the Bank, make a `withdrawal`, ask for `info`rmation on the Bank, inquire about your account `balance`, or return to the `street`.", function(res,convo){
			bankrouter(res,convo);
			convo.next();
		});
	}
}

bankrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("deposit")){
		convo.say("The teller sniffs. \n>Very well. How much will you be depositing today? You currently have " + user.gold + " gold in your pouch.");
		convo.ask("Input the amount of gold you wish to deposit.", function (res,convo){
			bdeposit(res,convo);
			convo.next();
		});
	} else if (temp.includes("withdrawal")){
		convo.say("The teller sniffs. \n>Very well. How much will you be withdrawing today? You currently have " + user.bank.deposit + " in your account.");
		convo.ask("Input the amount of gold you wish to withdraw.", function (res,convo){
			bwithdraw(res,convo);
			convo.next();
		});
	} else if (temp.includes("info")){
		convo.say(">We here at the Bank of Doworth keep your gold secure. Should you perish in battle, or out in the Dark Woods, the gold on your person could be lost, or even... looted. \nThe teller wrinkles his nose at the thought. \n>Your funds here at the Bank, however, are kept safe, and you can withdraw them yourself at any time.");
		convo.ask("Do you wish to `deposit` your gold with the Bank, make a `withdrawal`, ask for `info`rmation on the Bank, inquire about your account `balance`, or return to the `street`.", function(res,convo){
			bankrouter(res,convo);
			convo.next();
		});
	} else if (temp.includes("balance")){
		var temp = user.bank.deposit;
		if (temp === 0){
			convo.say(">I'm sorry - you don't have an account here yet. If you'd like to open one, please make a deposit.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            bankrouter(res,convo);
	            convo.next();
	        });
		} else {
			convo.say("Your bank balance is currently " + temp + " gold.");
			convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	            bankrouter(res,convo);
	            convo.next();
	        });
		}
	} else if (temp.includes("street")){
		convo.say("Your business concluded, you nod curtly to the Bank staff and make your way to the door.");
		town.townsquare(res,convo);
	} else if (temp.includes('reminder')){
        convo.ask("Do you wish to `deposit` your gold with the Bank, make a `withdrawal`, ask for `info`rmation on the Bank, inquire about your account `balance`, or return to the `street`.", function(res,convo){
			bankrouter(res,convo);
			convo.next();
		});
    } else {
        convo.repeat();
    }
}

bdeposit = function(res,convo){
	var temp = res.text;
	temp = Number(temp);
	if (isNaN(temp)){
		convo.say("The teller narrows his eyes. \n>Are you okay, sir?");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	        bankrouter(res,convo);
	        convo.next();
	    });
	} else if (temp>user.gold){
		convo.say("The clerk rolls his eyes. \n>Ahem - you do not appear to have enough gold for a deposit of that size.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            bankrouter(res,convo);
            convo.next();
        });
	} else {
		var y = Math.floor(temp);
		user.gold -= y;
		user.bank.deposit += y;
		convo.say("You have deposited " + y + " gold in your bank account. \nYou currently have " + user.bank.deposit + " gold total in your account.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            bankrouter(res,convo);
            convo.next();
        });
	}
}

bwithdraw = function(res,convo){
	var temp = res.text;
	temp = Number(temp);
	if (isNaN(temp)){
		convo.say("The teller narrows his eyes. \n>Are you okay, sir?");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
	        bankrouter(res,convo);
	        convo.next();
	    });
	} else if (temp>user.bank.deposit){
		convo.say("The clerk rolls his eyes. \n>I'm afraid you appear to have insufficient funds available. You currently have " + user.bank.deposit + " gold in your account.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            bankrouter(res,convo);
            convo.next();
        });
	} else {
		var y = Math.floor(temp);
		user.gold += y;
		user.bank.deposit -= y;
		convo.say("Very well - you have withdrawn " + y + " gold from your account. \nYou currently have " + user.bank.deposit + " gold in your account.");
		convo.ask("What next? (Want a `reminder`?)", function(res,convo){
            bankrouter(res,convo);
            convo.next();
        });
	}
}


