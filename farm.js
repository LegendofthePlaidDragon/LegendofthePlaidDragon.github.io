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
			if (user.mission==="grannon"){
				farm2();
			} else {
				convo.say("Thick mist sits atop the field of barley surrounding Old Grannon's Farm on the outskirts of town. \nSomewhere, a dog whimpers, as if running from something. Not you.");
				convo.say("The farm is not as abandoned as it seems. A slight figure staggers out of the barn door, clutching a crude spear and quavering in his speech. \n>Be on guard, stranger! I won't hesitate to gut ye wheres ye stand! State yer business here!");
				convo.ask("Try to explain that you come as a `friend`, `ready` your " + user.items.weapon.name + " for battle, or `slink` away back to town.", function(res,convo){
					farmrouter(res,convo);
					convo.next();
				});
			}
		} else if (user.level.level>2){
			farm3();
		} 
	}
}

farmrouter = function(res,convo){
	var temp = res.text.toLowerCase();
	if (temp.includes("friend")){
		// TBD
	} else if (temp.includes("ready")){

	} else if (temp.includes("slink")){

	} else {
		convo.say("Come again?");
		convo.repeat();
	}
}


