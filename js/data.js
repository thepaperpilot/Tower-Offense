let IntervalTimer = function (callback, interval) {
    var timerId, startTime, remaining = 0;
    var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

    this.pause = function () {
        if (state != 1) return;

        remaining = interval - (new Date() - startTime);
        window.clearInterval(timerId);
        state = 2;
    };

    this.resume = function () {
        if (state != 2) return;

        state = 3;
        window.setTimeout(this.timeoutCallback, remaining);
    };

    this.timeoutCallback = function () {
        if (state != 3) return;

        callback();

        startTime = new Date();
        timerId = window.setInterval(callback, interval);
        state = 1;
    };

    this.start = function () {
    	if (state !== 0) return;

	    startTime = new Date();
	    timerId = window.setInterval(callback, interval);
	    state = 1;
    };

    this.stop = function () {
    	if (state === 0) return;

	    window.clearInterval(timerId);
	    state = 0;
    };

}

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
		startCutscene: "startLevel1",
		endCutscene: "endLevel1",
		bgm: 'level1BGM',
		style: {
			left: "37.5%",
			top: "57.7%"
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
				interval: new IntervalTimer(function() {
					strategyManager.spawnTower({
						x: (Math.random() * 0.9 + 0.05) * 1920,
						y: (Math.random() * 0.8 + 0.15) * 768,
						type: 0
					})
				}, 45000)
			},
			"spawnTower1": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("spawnTower1")
					strategyManager.spawnTower({
						x: 1800,
						y: 500,
						type: 0
					})
				}, 25000)
			},
			"spawnTower2": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("spawnTower2")
					strategyManager.spawnTower({
						x: 320,
						y: 180,
						type: 0
					})
				}, 75000)
			}
		}
	},
	{
		enemyPath: [
			{x: 0, y: 420},
			{x: 404, y: 690},
			{x: 707, y: 100},
			{x: 1234, y: 666},
			{x: 1691, y: 388},
			{x: 1920, y: 398},
		],
		enemyHealth: 20,
		background: "background",
		startCutscene: "startLevel2",
		endCutscene: "endLevel2",
		bgm: 'level2BGM',
		style: {
			left: "51%",
			top: "63.3%"
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
				interval: new IntervalTimer(function() {
					strategyManager.spawnTower({
						x: (Math.random() * 0.9 + 0.05) * 1920,
						y: (Math.random() * 0.8 + 0.15) * 768,
						type: Math.floor(Math.random() * 2)
					})
				}, 45000)
			},
			"spawnTower1": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("spawnTower1")
					strategyManager.spawnTower({
						x: 1800,
						y: 500,
						type: 1
					})
				}, 25000)
			},
			"spawnTower2": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("spawnTower2")
					strategyManager.spawnTower({
						x: 320,
						y: 180,
						type: 0
					})
				}, 75000)
			}
		}
	},
	{
		enemyPath: [
			{x: 0, y: 650},
			{x: 666, y: 79},
			{x: 824, y: 222},
			{x: 1089, y: 155},
			{x: 1569, y: 505},
			{x: 1920, y: 218},
		],
		enemyHealth: 30,
		background: "background",
		startCutscene: "startLevel3",
		endCutscene: "endLevel3",
		bgm: 'level3BGM',
		style: {
			left: "53.6%",
			top: "46.3%"
		},
		below: true,
		initialTowers: [
			{
				x: 1000,
				y: 320,
				type: 0
			}
		],
		strategies: {
			"spawnTower": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.spawnTower({
						x: (Math.random() * 0.9 + 0.05) * 1920,
						y: (Math.random() * 0.8 + 0.15) * 768,
						type: Math.floor(Math.random() * 3)
					})
				}, 35000)
			},
			"spawnTower1": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("spawnTower1")
					strategyManager.spawnTower({
						x: 1800,
						y: 460,
						type: 1
					})
				}, 15000)
			},
			"spawnTower2": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("spawnTower2")
					strategyManager.spawnTower({
						x: 320,
						y: 180,
						type: 1
					})
				}, 85000)
			},
			"spawnTower3": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("spawnTower3")
					strategyManager.spawnTower({
						x: 1600,
						y: 450,
						type: 2
					})
					strategyManager.spawnTower({
						x: 1200,
						y: 600,
						type: 2
					})
					strategyManager.spawnTower({
						x: 800,
						y: 200,
						type: 2
					})
				}, 110000)
			},
			"startUprootTower": {
				enabled: true,
				interval: new IntervalTimer(function() {
					strategyManager.toggleStrategy("uprootTower")
				}, 110000)
			},
			"uprootTower": {
				enabled: false,
				interval: new IntervalTimer(function() {
					let towers = enemyTowers.filter(t => !t.point)
					if (towers.length > 0)
						towers[Math.floor(Math.random(towers.length))].uproot()
				}, 35000)
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
		sprite: "rabbit",
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
			buildingCosts[0] += 1
			this.button.innerText = buildingCosts[0]
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
			buildingCosts[1] += 5
			this.button.innerText = buildingCosts[1]
		}
	},
	{
		name: "Barn",
		description: "Increases Food Storage",
		type: "farm",
		enabled: false,
		cost: 70,
		buy: function() {
			maxFood += 50
			buildingCosts[2] += 7
			this.button.innerText = buildingCosts[2]
		}
	},
	{
		name: "Armory",
		description: "Increases Unit Sturdiness",
		type: "upgrade",
		enabled: true,
		cost: 10,
		buy: function() {
			healthModifier *= 1.1
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
			damageModifier *= 1.1
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
			speedModifier *= 1.1
			buildingCosts[5] *= 2
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
		movespeed: 1,
		health: 10,
		damage: 1,
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
		movespeed: 0.5,
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
					if (dx * dx + dy * dy < 25000) {
						playerUnits[i].health -= damage
						if (playerUnits[i].health <= 0) {
							createEmitter(playerUnits[i].sprite.x, playerUnits[i].sprite.y, 270, '#FF0000')
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
		movespeed: 0.35,
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
			if (delta * this.movespeed * delta * this.movespeed > magnitude * magnitude) {
				this.sprite.x = this.moveTarget.x
				this.sprite.y = this.moveTarget.y
				this.moveTarget = null
			} else {
				dx /= magnitude
				dy /= magnitude

				this.sprite.x += dx * delta * this.movespeed
				this.sprite.y += dy * delta * this.movespeed
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
