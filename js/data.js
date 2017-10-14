let levels = [
	{
		enemyPath: [
			{x: 0, y: 384},
			{x: 420, y: 250},
			{x: 640, y: 150},
			{x: 960, y: 400},
			{x: 1280, y: 640},
			{x: 1920, y: 360},
		],
		enemyHealth: 10,
		background: "background",
		startCutscene: "cutscene1",
		endCutscene: "cutscene2",
		initialTowers: [
			{
				x: 1000,
				y: 360,
				type: 0
			}
		],
		strategies: {
			"spawnTower": {
				enabled: true,
				interval: 45000,
				fire: function() {
					strategyManager.spawnTower({
						x: Math.random() * 1000 + 140,
						y: Math.random() * 680 + 20,
						type: 0
					})
				}
			},
			"spawnTower1": {
				enabled: true,
				interval: 15000,
				fire: function() {
					strategyManager.toggleStrategy("spawnTower1")
					strategyManager.spawnTower({
						x: 1800,
						y: 500,
						type: 0
					})
				}
			},
			"spawnTower2": {
				enabled: true,
				interval: 75000,
				fire: function() {
					strategyManager.toggleStrategy("spawnTower2")
					strategyManager.spawnTower({
						x: 320,
						y: 180,
						type: 0
					})
				}
			}
		}
	}
]

let units = [
	{
		name: "Wolf",
		description: "A Basic Unit",
		enabled: true,
		cost: 10,
		sprite: "foxWizard",
		speed: 1,
		health: 15,
		damage: 2
	},
	{
		name: "Fox",
		description: "A Variant Unit",
		enabled: true,
		cost: 15,
		sprite: "foxWizard",
		speed: 2,
		health: 15,
		damage: 1
	},
	{
		name: "Bear",
		description: "A Slow but Sturdy Unit",
		enabled: false,
		cost: 25,
		sprite: "foxWizard",
		speed: 0.75,
		health: 30,
		damage: 2
	},
	{
		name: "Rabbit",
		description: "A Fast but Frail Unit",
		enabled: false,
		cost: 20,
		sprite: "foxWizard",
		speed: 3,
		health: 6,
		damage: 1
	}
]

let buildings = [
	{
		name: "Farm",
		description: "Increases Food Production",
		enabled: true,
		cost: 6,
		buy: function() {
			foodIncome += 0.005
			enableBuilding(1, true)
		}
	},
	{
		name: "Big Farm",
		description: "Significantly Increases Food Production",
		enabled: false,
		cost: 30,
		buy: function() {
			foodIncome += 0.03
			enableBuilding(2, true)
		}
	},
	{
		name: "Farm Planet",
		description: "Outrageously Increases Food Production",
		enabled: false,
		cost: 777,
		buy: function() {
			foodIncome += 0.77
		}
	},
	{
		name: "Armory",
		description: "Increases Unit Sturdiness",
		enabled: true,
		cost: 10,
		buy: function() {
			for (let i = 0; i < units.length; i++) {
				units[i].health *= 1.1
			}
			this.cost += 5
			this.button.innerText = this.cost
			enableBuilding(6, true)
			enableBuilding(7, true)
		}
	},
	{
		name: "Blacksmith",
		description: "Increases Unit Brawniness",
		enabled: true,
		cost: 10,
		buy: function() {
			for (let i = 0; i < units.length; i++) {
				units[i].damage *= 1.1
			}
			this.cost += 5
			this.button.innerText = this.cost
		}
	},
	{
		name: "Cobbler",
		description: "Increases Unit Quickness",
		enabled: true,
		cost: 100,
		buy: function() {
			for (let i = 0; i < units.length; i++) {
				units[i].speed *= 0.9
			}
			this.cost *= 2
			this.button.innerText = this.cost
		}
	},
	{
		name: "Bearracks",
		description: "Unlocks a Large Enemy",
		enabled: false,
		cost: 25,
		buy: function() {
			enableBuilding(6, false)
			enableUnit(2, true)
		}
	},
	{
		name: "Burrow",
		description: "Unlocks a Small Enemy",
		enabled: false,
		cost: 25,
		buy: function() {
			enableBuilding(7, false)
			enableUnit(3, true)
		}
	}
]

let towers = [
	{
		sprite: "foxWizardStatue",
		range: 200,
		speed: 0.2,
		health: 10,
		damage: 2,
		shoot: function(target) {
			this.shootProjectile(null, target)
		}
	}
]
