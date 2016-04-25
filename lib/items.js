// meds and stuff

module.exports = {

// MEDS

	heals : {
		basic:{
			name: "Healing elixir",
			potency: 20,
			gold: 50
		},
		potent:{
			name: "Extra potent healing elixir",
			potency: 40,
			gold: 100
		},
		antibiotic:{
			name: "Antifester",
			gold: 250
		}
	},
	meds : {
		sober:{
			name: "Sobriety potion",
			gold: 75
		},
		kola:{
			name: "Innoculated kola nuts",
			gold: 100
		},
		berserk:{
			name: "Berserker infusion",
			gold: 150
		}
	},

// WEAPONS

	weapons : {
		start: {
			hands: {
				name: "Hands",
				attack: 4
			}
		},
		club: {
			name: "Wooden Club",
			displayname: "<span id=letter>W</span>ooden Club",
			gold: 150,
			attack: 6,
			//key: 1
		},
		sclub: {
			name: "Spiked Club",
			displayname: "<span id=letter>S</span>piked Club",
			gold: 250,
			attack: 7,
			//key: 2
		},			
		fsword: {
			name: "Farmhand's Sword",
			displayname: "<span id=letter>F</span>armhand's Sword",
			gold: 400,
			attack: 8,
			// key: 3
		},
		mace: {
			name: "Rusted Mace",
			displayname: "<span id=letter>R</span>usted Mace",
			gold: 650,
			attack: 10,
			// key: 3
		},
		oldsword: {
			name: "Oldar's Steel Sword",
			displayname: "<span id=letter>O</span>ldar's Steel Sword",
			gold: 1000,
			attack: 14,
			key: 5
		}
	},

// ARMOR

	armor : {
		start: {
			shirt:{
				name: "Shirt",
				armor: 0
			}
		},
		canvas:{
			name: "Canvas Tunic",
			displayname: "<span id=letter>C</span>anvas Tunic",
			gold: 100,
			armor: 1
		},
		leather:{
			name: "Leather Jerkin",
			displayname: "<span id=letter>L</span>eather Jerkin",
			gold: 200,			
			armor: 2
		},
		stud:{
			name: "Studded Jerkin",
			displayname: "Studded <span id=letter>J</span>erkin",
			gold: 350,
			armor: 3
		},
		rivet:{
			name: "Rivet Chainmaille",
			displayname: "<span id=letter>R</span>ivet Chainmail",
			gold: 600,
			armor: 4
		},
		steel:{
			name: "Steel Plate",
			displayname: "<span id=letter>S</span>teel Plate",
			gold: 1000,
			armor: 6
		}
	},

// PRECIOUS

	stuff : {
		gems:{
			rubies: {
				name: "Precious rubies"
			}
		}
	}

}
