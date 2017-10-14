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
				x: 320,
				y: 180,
				type: 0
			}
		],
		strategies: {
			"spawnTower": {
				enabled: true,
				interval: 20000,
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
			}
		}
	}
]

let units = [
	{
		name: "Marine",
		cost: 1000,
		sprite: "tower",
		speed: 1,
		health: 10,
		damage: 2
	},
	{
		name: "Cool Guy",
		cost: 1001,
		sprite: "tower",
		speed: 2,
		health: 4,
		damage: 2
	},
	{
		name: "The powerful one",
		cost: 1002,
		sprite: "tower",
		speed: 0.5,
		health: 20,
		damage: 2
	},
	{
		name: "the fast one",
		cost: 1003,
		sprite: "tower",
		speed: 3,
		health: 3,
		damage: 1
	}
]

let buildings = [
	{
		name: "Farm",
		cost: 1000
	},
	{
		name: "Big Farm",
		cost: 100000
	},
	{
		name: "Farm Planet",
		cost: 77777777777777
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
