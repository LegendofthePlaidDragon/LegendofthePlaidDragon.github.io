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
			gold: 150,
			attack: 6,
		},
		sclub: {
			name: "Spiked Club",
			gold: 250,
			attack: 7,
		},			
		fsword: {
			name: "Farmhand's Sword",
			gold: 400,
			attack: 8,
		},
		mace: {
			name: "Rusted Mace",
			gold: 650,
			attack: 10,
		},
		oldsword: {
			name: "Oldar's Steel Sword",
			gold: 1000,
			attack: 14,
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
			gold: 100,
			armor: 1
		},
		leather:{
			name: "Leather Jerkin",
			gold: 200,			
			armor: 2
		},
		stud:{
			name: "Studded Jerkin",
			gold: 350,
			armor: 3
		},
		rivet:{
			name: "Rivet Chainmaille",
			gold: 600,
			armor: 4
		},
		steel:{
			name: "Steel Plate",
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
		},
    mfc:{
      name: "Morgan's Fire Chanter",
      searchname: "morgan's fire chanter",
      desc: "A powerful incindiary potion that will immolate its target.",
      gold: 250,
      attack: 75
      }
  }
}