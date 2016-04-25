// townsquare

var tavern = require('./tavern');

module.exports = {

townsquare: function(res, convo){
	convo.say("*-------------------------------------T H E  T O W N  S Q U A R E-------------------------------------*");
	convo.ask("The town square is calm. Merchants hawk their goods, neighbors greet each other, and a few children go chasing each other through the streets. \n\nYou may `hear` the town crier's news of the day, visit the `Tavern`, the `Smither` Shop, the `Apothecary` Cabin, the `Bank` of Doworth, the village `Abbey`, Old Grannon's `farm`, or venture into the Dark `Woods`. \n\nYou can also check your `status`, review your `supplies`, or `quit` to your campsite.", function(res,convo){
			townrouter(res,convo);
            convo.next();
        });
	}
}


/////////////////////


townrouter = function(res,convo){
	quicksave();
	var temp = res.text.toLowerCase();
    if (temp.includes('hear')){
    	convo.say("This will do things.");
        // hear(res.convo);
    } else if (temp.includes('tavern')){
        tavern.tavern(res,convo);
    } else if (temp.includes('smither')){
        smith.smithy(res,convo);
    } else if (temp.includes('apothecary')){
    	apot.apothecary(res,convo);
    } else if (temp.includes('bank')){
        bank.bank(res,convo);
    } else if (temp.includes('abbey')){
        abbey.abbey(res,convo);
    } else if (temp.includes('farm')){
        farm.farm(res,convo);
    } else if (temp.includes('woods')){
    	convo.say("You follow the dirt track that leads out of town and into the dark woods...");
        woods.woodsstart(res,convo);
    } else if (temp.includes('status')){
        townstatus(res,convo);
    } else if (temp.includes('supplies')){
        towngear(res,convo);
    } else if (temp.includes('reminder')){
        convo.ask("You may `hear` the town crier's news of the day, visit the `Tavern`, the `Smither` Shop, the `Apothecary` Cabin, the `Bank` of Doworth, the village `Abbey`, Old Grannon's `farm`, or venture into the Dark `Woods`. \n\nYou can also check your `status`, review your `supplies`, or `quit` to your campsite.", function(res,convo){
            townrouter(res,convo);
            convo.next();
        });
    } else if (temp.includes('quit')){
        quit(res,convo);
    } else {
        convo.repeat();
    }
}

///////////////


woods = function(x){
	clear();
	output(1, "You follow the dirt track that leads out of town and into the dark forest that surrounds the town.")
	setTimeout(function(){ woodsstart() }, 1000);
}

townstatus = function(res,convo){
	convo.say(status());
	convo.ask("The town square bustles around you. What next? (Want a `reminder`?)", function(res,convo){
	    townrouter(res,convo);
	    convo.next();
	});
}

towngear = function(res,convo){
	var temp = utility.showgear();
	if (temp === 0){
		convo.say("You have no items!");
		convo.ask("The town square bustles around you. What next? (Want a `reminder`?)", function(res,convo){
		    townrouter(res,convo);
		    convo.next();
		});
	} else {
		convo.say(temp)
		convo.ask("Enter the name of any item you want to use, or `none`.", function(res,convo){
		    townusegear(res,convo);
		    convo.next();
		});
	}
}

townusegear = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes('none')){
		convo.ask("The town square bustles around you. What next? (Want a `reminder`?)", function(res,convo){
		    townrouter(res,convo);
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
			convo.say(temp3);
			convo.ask("The town square bustles around you. What next? (Want a `reminder`?)", function(res,convo){
			    townrouter(res,convo);
			    convo.next();
			});
		}
	}
}

// duelflagger = function(){

// }

crier = function(){
	var temp = monthday.split("-");
	var yesterday = temp[1]-1
	var lastdate = month + "-" + yesterday;
}



///////////////

