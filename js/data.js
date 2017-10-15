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
		startCutscene: "cutscene2",
		endCutscene: "cutscene2",
		style: {
			left: "10%",
			bottom: "10%"
		},
		below: false,
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
						x: (Math.random() * 0.9 + 0.05) * 1920,
						y: (Math.random() * 0.9 + 0.05) * 768,
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
	},
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
		startCutscene: "cutscene2",
		endCutscene: "cutscene2",
		style: {
			left: "30%",
			top: "30%"
		},
		below: true,
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
						x: (Math.random() * 0.9 + 0.05) * 1920,
						y: (Math.random() * 0.9 + 0.05) * 768,
						type: Math.floor(Math.random() * 3)
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
	},
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
		style: {
			right: "40%",
			top: "40%"
		},
		below: true,
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
						x: (Math.random() * 0.9 + 0.05) * 1920,
						y: (Math.random() * 0.9 + 0.05) * 768,
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
		sprite: "wolf",
		speed: 1,
		health: 15,
		damage: 2
	},
	{
		name: "Fox",
		description: "A Variant Unit",
		enabled: true,
		cost: 15,
		sprite: "fox",
		speed: 2,
		health: 15,
		damage: 1
	},
	{
		name: "Bear",
		description: "A Slow but Sturdy Unit",
		enabled: false,
		cost: 25,
		sprite: "bear",
		speed: 0.75,
		health: 40,
		damage: 2
	},
	{
		name: "Rabbit",
		description: "A Fast but Frail Unit",
		enabled: false,
		cost: 20,
		sprite: "fox",
		speed: 3,
		health: 6,
		damage: 1
	}
]

let buildings = [
	{
		name: "Farm",
		description: "Increases Food Production",
		type: "farm",
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
		type: "farm",
		enabled: false,
		cost: 30,
		buy: function() {
			foodIncome += 0.03
			enableBuilding(2, true)
		}
	},
	{
		name: "Barn",
		description: "Increases Food Storage",
		type: "farm",
		enabled: false,
		cost: 77,
		buy: function() {
			maxFood += 100
		}
	},
	{
		name: "Armory",
		description: "Increases Unit Sturdiness",
		type: "upgrade",
		enabled: true,
		cost: 10,
		buy: function() {
			for (let i = 0; i < units.length; i++) {
				units[i].health *= 1.1
			}
			buildingCosts[3] += 5
			this.button.innerText = buildingCosts[3]
			enableBuilding(6, true)
			enableBuilding(7, true)
		}
	},
	{
		name: "Blacksmith",
		description: "Increases Unit Brawniness",
		type: "upgrade",
		enabled: true,
		cost: 10,
		buy: function() {
			for (let i = 0; i < units.length; i++) {
				units[i].damage *= 1.1
			}
			buildingCosts[4] += 5
			this.button.innerText = buildingCosts[4]
		}
	},
	{
		name: "Cobbler",
		description: "Increases Unit Quickness",
		type: "upgrade",
		enabled: true,
		cost: 100,
		buy: function() {
			for (let i = 0; i < units.length; i++) {
				units[i].speed *= 1.1
			}
			buildingCosts[5].cost *= 2
			this.button.innerText = buildingCosts[5]
		}
	},
	{
		name: "Bearracks",
		description: "Unlocks a Large Enemy",
		type: "unlock",
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
		type: "unlock",
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
		sprite: "foxStatue", // Base Tower
		range: 200,
		speed: 0.2,
		health: 10,
		damage: 2,
		shoot: function(target) {
			let sprite = new Graphics()
			sprite.beginFill(0xFF0000, 1);
			sprite.drawRect(0, 0, 8, 8);
			sprite.endFill()
			this.shootProjectile(sprite, target)
		}
	},
	{
		sprite: "wolfStatue", // AOE on projectile hit
		range: 200,
		speed: 0.2,
		health: 10,
		damage: 2,
		shoot: function(target) {
			let sprite = new Graphics()
			sprite.beginFill(0x0000FF, 1);
			sprite.drawRect(0, 0, 8, 8);
			sprite.endFill()
			this.shootProjectile(sprite, target, (target, damage) => {
				createSplashEmitter(target.sprite.x, target.sprite.y)
				for (let i = 0; i < playerUnits.length; i++) {
					if (playerUnits[i] == target) continue
					let dx = sprite.x - playerUnits[i].sprite.x
					let dy = sprite.y - playerUnits[i].sprite.y
					if (dx * dx + dy * dy < 50000) {
						playerUnits[i].health -= damage
						if (playerUnits[i].health <= 0) {
							createEmitter(playerUnits[i].sprite.x, playerUnits[i].sprite.y, 270)
							removeEntity(playerUnits[i])
						}
					}
				}
			})
		},
	},
	{
		sprite: "bearStatue", // Wanders Map
		range: 100,
		speed: 0.1,
		health: 50,
		damage: 4,
		update: function(delta) {
			if (!this.moveTarget) {
				this.moveTarget = {
					x: (Math.random() * 0.9 + 0.05) * 1920,
					y: (Math.random() * 0.9 + 0.05) * 768
				}
			}
			let dx = this.moveTarget.x - this.sprite.x
			let dy = this.moveTarget.y - this.sprite.y

			let magnitude = Math.sqrt(dx * dx + dy * dy)
			if (delta * delta > magnitude * magnitude) {
				this.sprite.x = this.moveTarget.x
				this.sprite.y = this.moveTarget.y
				this.moveTarget = null
			} else {
				dx /= magnitude
				dy /= magnitude

				this.sprite.x += dx * delta
				this.sprite.y += dy * delta
			}
		},
		shoot: function(target) {
			let sprite = new Graphics()
			sprite.beginFill(0x00FF00, 1);
			sprite.drawRect(0, 0, 8, 8);
			sprite.endFill()
			this.shootProjectile(sprite, target)
		}
	}
]
