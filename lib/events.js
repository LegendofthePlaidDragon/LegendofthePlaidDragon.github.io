// events

module.exports = {

	eventReturner: function(x){
		var currentuser = user.username;
		for (var prop in alltheevents) {
			if (prop===x){
				var blerg = alltheevents[prop].replace(/currentuser/, currentuser);
				return blerg;
			}
		}
	}
}

var alltheevents = {
	// minor
	// town, tavern, smither, smithbuy, apot, bank, abbey, farm, asking
	town: "*currentuser* was seen about Town...",
	tavern: "*currentuser* was spotted nursing a drink in the Tavern.",
	smither: "*currentuser* was last seen slipping into the Smither's shop.",
	smithbuy: "*currentuser* was seen sporting impressive new merchandise from the Smither...",
	apot: "*currentuser* visited Morgan's Apothecary for reasons unknown...",
	bank: "*currentuser* was seen smiling as they left the Bank...",
	abbey: "*currentuser* visited the Abbey.",
	farm: "*currentuser* was seen in the direction of Grannon's Farm.",
	asking: "*currentuser* was heard asking around about the location of other wanderers at the Tavern...",
	place0: "Strange winds come out of the north, and the countryside is uneasy.",
	place1: "That idiot Barzek tripped over his own feet and slept in the horse trough!",
	place2: "Frank the Gremlin stole Seth's lunch again.",
	place3: "This season's spoons competition will be held in the Fields on the next market day.",
	// major
	// lev2, magic, newplayer, death
	lev2: "*currentuser* cut down adversaries of great strength to advance to the level of Apprentice!",
	magic: "Somehow, magic has occurred at the Bank.",
	newplayer: "A new wanderer, *currentuser*, was seen entering Town.",
	death: "*currentuser* was cut down in battle with monstrous foes!"
}