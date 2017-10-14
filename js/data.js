let levels = [
	{
		enemyPath: [
			{x: 0, y: 360},
			{x: 320, y: 50},
			{x: 460, y: 200},
			{x: 640, y: 640},
			{x: 1280, y: 360},
		],
		enemyHealth: 10,
		background: "depth",
		startCutscene: "cutscene1",
		endCutscene: "cutscene2",
		initialTowers: [
			{
				x: 640,
				y: 500,
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
						x: 1200,
						y: 360,
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
		name: "Marine",
		description: "A Basic Unit",
		cost: 10,
		sprite: "tower",
		speed: 1,
		health: 15,
		damage: 2
	},
	{
		name: "Cool Guy",
		description: "A Variant Unit",
		cost: 15,
		sprite: "tower",
		speed: 2,
		health: 15,
		damage: 1
	},
	{
		name: "The powerful one",
		description: "A Slow but Sturdy Unit",
		cost: 25,
		sprite: "tower",
		speed: 0.5,
		health: 30,
		damage: 2
	},
	{
		name: "the fast one",
		description: "A Fast but Frail Unit",
		cost: 20,
		sprite: "tower",
		speed: 3,
		health: 6,
		damage: 1
	}
]

let buildings = [
	{
		name: "Farm",
		description: "Increases Food Production",
		cost: 6,
		buy: function() {
			foodIncome += 0.005
		}
	},
	{
		name: "Big Farm",
		description: "Significantly Increases Food Production",
		cost: 30,
		buy: function() {
			foodIncome += 0.03
		}
	},
	{
		name: "Farm Planet",
		description: "Outrageously Increases Food Production",
		cost: 7777777,
		buy: function() {
			foodIncome += 77
		}
	},
	{
		name: "Armory",
		description: "Increases Unit Sturdiness",
		cost: 10,
		buy: function() {
			for (let i = 0; i < units.length; i++) {
				units[i].health *= 1.1
			}
		}
	}
]

let towers = [
	{
		sprite: "foxWizard",
		range: 200,
		speed: 0.2,
		health: 10,
		damage: 2,
		shoot: function(target) {
			this.shootProjectile(null, target)
		}
	}
]
