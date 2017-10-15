// Aliases
// these make the rest of the code shorter, plus it puts all the "PIXI is not defined" errors up here in one place
// since I'm not using NPM or anything, so subl has no way of knowing these are being loaded before this file runs.
let Application = PIXI.Application,
	Container = PIXI.Container,
    loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    sound = PIXI.sound,
    Emitter = PIXI.particles.Emitter,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text;

// Create some basic objects
let app = new Application(1920, 768, {antialias: true, transparent: true})
app.view.className += " inactive"
document.body.appendChild(app.view);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// Set up DOM
let unitsTab = document.getElementById('units-tab')
let buildingsTab = document.getElementById('buildings-tab')
document.getElementById('units-tab-button').addEventListener('click', () => {
	unitsTab.style.display = ''
	buildingsTab.style.display = 'none'
})
document.getElementById('buildings-tab-button').addEventListener('click', () => {
	unitsTab.style.display = 'none'
	buildingsTab.style.display = ''
})
document.getElementById('start-button').addEventListener('click', () => {
	document.getElementById('start').className = 'start inactive'
	openMap()
})
document.getElementById('continue-button').addEventListener('click', () => {
	document.getElementById('continue').className = 'start inactive'
	openMap()
})
makeHorizontalScroll('buildings-tab')
makeHorizontalScroll('units-tab')
for (let i = 0; i < units.length; i++) {
	let unit = document.createElement('div')
	unit.className = "shop-item"
	if (!units[i].enabled)
		unit.style.display = 'none'
	unit.innerHTML = '<p class="item-name">' + units[i].name + '</p><p class="item-desc">' + units[i].description + '</p><p class="food">' + units[i].cost + '</p>'
	let button = unit.querySelector('.food')
	units[i].element = unit
	units[i].button = button
	unit.i = i
	unit.addEventListener('click', purchaseUnit)
	unitsTab.appendChild(unit)
}
for (let i = 0; i < buildings.length; i++) {
	let building = document.createElement('div')
	building.className = "shop-item"
	building.innerHTML = '<p class="item-name">' + buildings[i].name + '</p><p class="item-desc">' + buildings[i].description + '</p><p class="gold">' + buildings[i].cost + '</p><div id="building ' + i + ' quantity" class="quantity ' + buildings[i].type + '" style="animation-name: none;">0</div>'
	let button = building.querySelector('.gold')
	buildings[i].element = building
	buildings[i].button = button
	building.i = i
	building.addEventListener('click', purchaseBuilding)
	building.querySelector('.quantity').addEventListener('animationend', removeAnimation)
	buildingsTab.appendChild(building)
}

// Constants
let PROJECTILE_SPEED = 10 // Speed of projectiles
let GOLD_INTERVAL = 250 // Interval in which units gain gold, in ms

// Load assets
loader
	// Images
	.add("background", "assets/Background.png")
	.add("tower", "assets/Tower.png")
	.add("fox", "assets/FoxWizard.png")
	.add("wolf", "assets/WolfKnight.png")
	.add("bear", "assets/Barbearian.png")
	.add("foxStatue", "assets/FoxWizardStatue.png")
	.add("wolfStatue", "assets/WolfKnightStatue.png")
	.add("bearStatue", "assets/BarbearianStatue.png")
	.add("spark", "assets/spark.png")
	// Sounds
	//.add("deflect", "assets/deflect.mp3")
	// Call setup after loading
	.load(setup);

// Game States
let states = {
	paused: {
		update: () => {},
		enter: () => {
			document.getElementById('continue').className = 'start'
		},
		exit: () => {
			document.getElementById('continue').className = 'start inactive'
		}
	},
	playing: {
		update: (delta) => {
			updateParticles(delta)
			updateGame(delta)
			updateUI()
		},
		enter: () => {
			app.view.className = ''
			document.getElementById('shop').className = 'shop'
		},
		exit: () => {
			app.view.className = 'inactive'
			document.getElementById('shop').className = 'shop inactive'
		}
	},
	cutscene: {
		update: () => {},
		enter: () => {},
		exit: () => {}
	}
}

// AI Controller
let strategyManager = {
	reset: function(strategies) {
		let keys
		if (this.strategies) {
			keys = Object.keys(this.strategies)
			for (let i = 0; i < keys.length; i++) {
				let strategy = this.strategies[keys[i]]
				if (strategy.instance)
					clearInterval(strategy.instance)
			}
		}
		this.strategies = strategies
		keys = Object.keys(this.strategies)
		for (let i = 0; i < keys.length; i++) {
			let strategy = this.strategies[keys[i]]
			if (strategy.enabled)
				strategy.instance = setInterval(strategy.fire, strategy.interval)
		}
	},
	toggleStrategy: function(name) {
		let strategy = strategyManager.strategies[name]
		strategy.enabled = !strategy.enabled
		if (strategy.enabled)
			strategy.instance = setInterval(strategy.fire, strategy.interval)
		else
			clearInterval(strategy.instance)
	},
	spawnTower: function(tower) {
		new Tower(towers[tower.type], tower.x, tower.y).playerOwned = false
	}
}

// General variables
let state = states.paused;
let emitters = [];
let nextLevel = 0;

// Level specific variables
let map, food, foodIncome, gold, enemyHealth, maxFood;
let buildingLevels = [], buildingCosts = []
let healthModifier, damageModifier, speedModifier
let emittersContainer;
let entitiesContainer, entities = [];
let playerUnits = [], enemyUnits = [];
let closestEnemy // TODO deal with enemies entering the path behind our creeps

// UI Variables
let foodDisplay = document.getElementById('curr-food')
let goldDisplay = document.getElementById('curr-gold')

// Sprites
let background, enemyPath

function setup() {
	app.ticker.add((delta) => {
		state.update(delta);
	})
	loadBabble()
}

function updateParticles(delta) {
	for (let i = 0; i < emitters.length; i++)
		emitters[i].update(delta / 100);
}

function updateGame(delta) {
	food += foodIncome * delta
	if (food > maxFood) food = maxFood

	for (let i = 0; i < entities.length; i++) {
		// if entities[i].state(delta) returns true, then 
		// the enemy was destroyed and we shouldn't increment i
		if (entities[i].state(delta)) i--
	}

	entitiesContainer.children.sort((a, b) => {
		return a.y - b.y
	})
}

function updateUI() {
	foodDisplay.innerText = Math.floor(food) + " Food"
	goldDisplay.innerText = Math.floor(gold) + " Gold"
}

function openMap() {
	let world = document.getElementById('world')
	world.className = "world"
	world.innerHTML = ''
	for (let i = 0; i < levels.length; i++) {
		let level = levels[i]
		let element = document.createElement('div')
		element.id = "level " + i
		element.className = "level"
		element.setAttribute("data-name", "Level " + (i + 1))
		Object.assign(element.style, level.style)
		if (level.below)
			element.className += " below"
		world.appendChild(element)
	}
	for (let i = 0; i < nextLevel; i++) {
		document.getElementById('level ' + i).className += " completed"
	}
	if (nextLevel < levels.length) {
		document.getElementById('level ' + nextLevel).className += " available"
		document.getElementById('level ' + nextLevel).addEventListener('click', () => {
			world.className = "world inactive"
			startLevel(nextLevel)
		})
	}
	for (let i = nextLevel + 1; i < levels.length; i++) {
		document.getElementById('level ' + i).className += " locked"	
	}
}

function startLevel(i) {
	let level = levels[i]

	// Reset level specific values
	food = 100
	maxFood = 100
	foodIncome = 0.01
	gold = 0
	enemyHealth = level.enemyHealth
	entities = [];
	playerUnits = [];
	enemyUnits = [];
	buildingLevels = [];
	buildingCosts = [];
	healthModifier = damageModifier = speedModifier = 1;
	for (let i = 0; i < buildings.length; i++) {
		buildingLevels.push(0)
		buildingCosts.push(buildings[i].cost)
		document.getElementById('building ' + i + ' quantity').innerText = '0'
		buildings[i].element.style.display = buildings[i].enabled ? '' : 'none'
	}
	for (let i = 0; i < units.length; i++) {
		units[i].element.style.display = units[i].enabled ? '' : 'none'
	}

	// Clean up old sprite
	if (background) background.parent.removeChild(background)
	if (enemyPath) enemyPath.parent.removeChild(enemyPath)
	if (entitiesContainer) entitiesContainer.parent.removeChild(entitiesContainer)
	if (emittersContainer) emittersContainer.parent.removeChild(emittersContainer)

	// Set up background
	background = new Sprite(TextureCache[level.background]);
	app.stage.addChild(background);

	// Set up enemy path
	map = level.enemyPath
	let g = new Graphics()
	g.lineStyle(24, 0xffd900, 1);
	g.moveTo(level.enemyPath[0].x, level.enemyPath[0].y)
	for (let i = 1; i < level.enemyPath.length; i++) {
		g.lineTo(level.enemyPath[i].x, level.enemyPath[i].y)
	}
	g.beginFill(0xffd900);
	for (let i = 0; i < level.enemyPath.length; i++) {
		g.drawCircle(level.enemyPath[i].x, level.enemyPath[i].y, 15)
	}
	g.endFill();
	app.stage.addChild(g)

	// Set up entities container
	entitiesContainer = new Container()
	app.stage.addChild(entitiesContainer)

	// Set up initial towers
	for (let i = 0; i < level.initialTowers.length; i++) {
		let tower = level.initialTowers[i]
		new Tower(towers[tower.type], tower.x, tower.y).playerOwned = false
	}

	// Set up emitters container
	emittersContainer = new Container()
	app.stage.addChild(emittersContainer)

	// Transition states
	state.exit()
	state = states.cutscene
	state.enter()
	startCutscene(level.startCutscene, () => {
		state.exit()
		state = states.playing
		// Set up new AI
		strategyManager.reset(level.strategies)
		state.enter()
	})
}

function purchaseUnit(e) {
	let unit = units[e.target.i]
	if (food >= unit.cost) {
		new Unit(unit, true)
		food -= unit.cost
	}
}

function purchaseBuilding(e) {
	let building = buildings[e.target.i]
	if (gold >= buildingCosts[e.target.i]) {
		buildingLevels[e.target.i]++
		gold -= buildingCosts[e.target.i]
		building.buy()
		let quantity = document.getElementById('building ' + e.target.i + ' quantity')
		quantity.innerText = buildingLevels[e.target.i]
		quantity.style.webkitAnimation = ''
	}
}

function createEmitter(x, y, angle) {
	let emitter = new Emitter(emittersContainer,
		[TextureCache.spark],
		{
		"alpha": {
			"start": 1,
			"end": 0.31
		},
		"scale": {
			"start": 1,
			"end": 0.001,
			"minimumScaleMultiplier": 0.5
		},
		"color": {
			"start": "#ffffff",
			"end": "#ffffff"
		},
		"speed": {
			"start": 400,
			"end": 50,
			"minimumSpeedMultiplier": 0.2
		},
		"acceleration": {
			"x": 0,
			"y": 0
		},
		"maxSpeed": 0,
		"startRotation": {
			"min": angle - 20,
			"max": angle + 20
		},
		"noRotation": false,
		"rotationSpeed": {
			"min": 0,
			"max": 20
		},
		"lifetime": {
			"min": 0.25,
			"max": 0.5
		},
		"blendMode": "normal",
		"frequency": 0.005,
		"emitterLifetime": 0.2,
		"maxParticles": 1000,
		"pos": {
			"x": x,
			"y": y
		},
		"addAtBack": false,
		"spawnType": "rect",
		"spawnRect": {
			"x": 0,
			"y": -32,
			"w": 16,
			"h": 32
		}
	})
	emitters.push(emitter)
}

function createSplashEmitter(x, y) {
	let emitter = new Emitter(emittersContainer,
		[TextureCache.spark],
		{
		"alpha": {
			"start": 1,
			"end": 0.31
		},
		"scale": {
			"start": 1,
			"end": 0.001,
			"minimumScaleMultiplier": 0.5
		},
		"color": {
			"start": "#ffffff",
			"end": "#0000ff"
		},
		"speed": {
			"start": 200,
			"end": 50,
			"minimumSpeedMultiplier": 0.2
		},
		"acceleration": {
			"x": 0,
			"y": 0
		},
		"maxSpeed": 0,
		"startRotation": {
			"min": 250,
			"max": 290
		},
		"noRotation": false,
		"rotationSpeed": {
			"min": 0,
			"max": 20
		},
		"lifetime": {
			"min": 0.25,
			"max": 0.5
		},
		"blendMode": "normal",
		"frequency": 0.001,
		"emitterLifetime": 0.2,
		"maxParticles": 1000,
		"pos": {
			"x": x,
			"y": y
		},
		"addAtBack": false,
		"spawnType": "circle",
		"spawnCircle": {
			"x": 0,
			"y": 0,
			"r": 50
		}
	})
	emitters.push(emitter)
}

// Utility Functions
function makeHorizontalScroll(divName) {
    function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        document.getElementById(divName).scrollLeft -= (delta*40); // Multiplied by 40
        e.preventDefault();
    }
    if (document.getElementById(divName).addEventListener) {
        // IE9, Chrome, Safari, Opera
        document.getElementById(divName).addEventListener("mousewheel", scrollHorizontally, false);
        // Firefox
        document.getElementById(divName).addEventListener("DOMMouseScroll", scrollHorizontally, false);
    } else {
        // IE 6/7/8
        document.getElementById(divName).attachEvent("onmousewheel", scrollHorizontally);
    }
}

function removeEntity(entity) {
	entitiesContainer.removeChild(entity.sprite)
	let index = playerUnits.indexOf(entity)
	if (index !== -1) playerUnits.splice(index, 1)
	index = enemyUnits.indexOf(entity)
	if (index !== -1) enemyUnits.splice(index, 1)
	entities.splice(entities.indexOf(entity), 1)
}

function removeAnimation(e) {
	e.target.style.webkitAnimation = 'none'
}

function enableBuilding(index, enabled) {
	if (buildingLevels[index] !== 0 && enabled) return
	buildings[index].element.style.display = enabled ? '' : 'none'
}

function enableUnit(index, enabled) {
	units[index].element.style.display = enabled ? '' : 'none'
}

let Unit = function(unit, playerOwned) {
	this.sprite = new Sprite(TextureCache[unit.sprite])
	this.sprite.x = map[0].x - 10
	this.sprite.y = map[0].y
	this.sprite.anchor.y = 1
	this.sprite.anchor.x = 0.5
	this.sprite.scale.x = 3
	this.point = 0
	this.speed = unit.speed
	this.health = unit.health
	this.damage = unit.damage
	if (playerOwned) {
		this.speed *= speedModifier
		this.health *= healthModifier
		this.damage *= damageModifier
	}
	this.animTime = 0
	this.goldTime = 0
	this.states = {
		moving: (delta) => {
			// Check if we reached the castle
			if (this.point === map.length) {
				createEmitter(this.sprite.x, this.sprite.y, 180)
				// TODO show enemyHealth to player
				enemyHealth -= this.damage
				if (playerOwned)
					new AddGold(this.damage, this.sprite.x, this.sprite.y)
				if (enemyHealth <= 0) {
					nextLevel++
					state.exit()
					state = states.paused
					state.enter()
				}
				removeEntity(this)
				return true
			}

			// Update current target
			let dx = this.sprite.x - map[this.point].x
			let dy = this.sprite.y - map[this.point].y
			let distancePoint = dx * dx + dy * dy
			let distance = distancePoint
			if (closestEnemy) {
				dx = this.sprite.x - closestEnemy.sprite.x
				dy = this.sprite.y - closestEnemy.sprite.y
				let distanceEnemy = dx * dx + dy * dy
				if (distanceEnemy < distancePoint) {
					this.target = {x: closestEnemy.sprite.x, y: closestEnemy.sprite.y}
					distance = distanceEnemy
				} else this.target = map[this.point]
			} else this.target = map[this.point]

			// Move towards current target
			dx = this.target.x - this.sprite.x
			dy = this.target.y - this.sprite.y

			let magnitude = Math.sqrt(dx * dx + dy * dy)
			if (delta * this.speed * delta * this.speed > distance) {
				this.sprite.x = this.target.x
				this.sprite.y = this.target.y
				if (distance === distancePoint) {
					this.point++
					if (playerOwned && this.point > 1)
						new AddGold(this.point, this.sprite.x, this.sprite.y)
				} else this.state = this.states.attacking
			} else {
				dx /= magnitude
				dy /= magnitude

				this.sprite.x += dx * delta * this.speed
				this.sprite.y += dy * delta * this.speed
			}
			this.animTime += delta
			this.sprite.scale.y = 3 + Math.cos(this.animTime / 10) * 0.2
			this.goldTime += delta
			if (this.goldTime >= GOLD_INTERVAL && playerOwned) {
				this.goldTime -= GOLD_INTERVAL
				new AddGold(this.point, this.sprite.x, this.sprite.y)
			}
		},
		attacking: (delta) => {
			// TODO
			// Make sure to award gold for doing this
		}
	}
	this.state = this.states.moving
	entitiesContainer.addChild(this.sprite)
	entities.push(this)
	if (playerOwned)
		playerUnits.push(this)
	else
		enemyUnits.push(this)
}

let Tower = function(tower, x, y) {
	this.sprite = new Container()
	let towerSprite = new Sprite(TextureCache.tower)
	towerSprite.anchor.x = 0.5
	towerSprite.anchor.y = 1
	let unitSprite = new Sprite(TextureCache[tower.sprite])
	unitSprite.anchor.x = 0.5
	unitSprite.anchor.y = 1
	unitSprite.y = -towerSprite.height / 2
	this.sprite.addChild(towerSprite)
	this.sprite.addChild(unitSprite)
	this.sprite.x = x
	this.sprite.y = y
	this.sprite.scale.x = -3
	this.range = tower.range
	this.speed = tower.speed
	this.health = tower.health
	this.damage = tower.damage
	this.animTime = 0
	this.shootTime = 0
	// helper methods for shooting
	this.shootProjectile = function(sprite, target, callback) {
		if (!sprite) {
			sprite = new Graphics()
			sprite.beginFill(0xFF0000, 1);
			sprite.drawRect(0, 0, 8, 8);
			sprite.endFill()
		}
		new Projectile(sprite, PROJECTILE_SPEED, this.damage, this.sprite, target, callback)
	}
	this.states = {
		idle: (delta) => {
			if (tower.update) {
				tower.update.call(this, delta)
			}
			if (this.target) {
				let dx = this.target.x - this.sprite.x
				let dy = this.target.y - this.sprite.y
				// Squaring is faster than square rooting
				if (entities.indexOf(this.target) === -1 || dx * dx + dy * dy > this.range * this.range) {
					this.target = null
				}
			}
			if (!this.target) {
				let targets = this.playerOwned ? enemyUnits : playerUnits
				for (let i = 0; i < targets.length; i++) {
					let dx = targets[i].sprite.x - this.sprite.x
					let dy = targets[i].sprite.y - this.sprite.y
					if (dx * dx + dy * dy <= this.range * this.range) {
						this.target = targets[i]
						break
					}		
				}
			}
			// Can I just mention I find this hilarious, flipping if statements for
			// whether or not target exists?
			if (this.target) {
				this.shootTime += delta / 100
				if (this.shootTime >= this.speed) {
					tower.shoot.call(this, this.target)
					this.shootTime -= this.speed
				}
			}
			this.animTime += delta
			this.sprite.scale.y = 3 + Math.cos(this.animTime / 10) * 0.2
		}
	}
	this.state = this.states.idle
	entitiesContainer.addChild(this.sprite)
	entities.push(this)
}

let Projectile = function(container, speed, damage, launcher, target, callback) {
	this.sprite = container
	this.speed = speed
	this.damage = damage
	this.sprite.x = launcher.x
	this.sprite.y = launcher.y - 36
	this.target = target
	this.states = {
		moving: (delta) => {
			if (!this.target || entities.indexOf(this.target) === -1) {
				removeEntity(this)
				return
			}

			let dx = this.target.sprite.x - this.sprite.x
			let dy = this.target.sprite.y - this.sprite.y

			// Technically magnitude is distance, and distance is distance^2
			let distance = dx * dx + dy * dy
			let magnitude = Math.sqrt(dx * dx + dy * dy)
			if (delta * this.speed * delta * this.speed > distance) {
				if (callback) callback(this.target, damage)
				this.target.health -= this.damage
				if (this.target.health <= 0) {
					createEmitter(this.target.sprite.x, this.target.sprite.y, 270)
					removeEntity(this.target)
				}
				removeEntity(this)
			} else {
				dx /= magnitude
				dy /= magnitude

				this.sprite.x += dx * delta * this.speed
				this.sprite.y += dy * delta * this.speed
			}
		}
	}
	this.state = this.states.moving
	entitiesContainer.addChild(this.sprite)
	entities.push(this)
}

let AddGold = function(amount, x, y) {
	gold += amount
	this.sprite = new Text("+" + amount + "G", {
		fill: "#FFDF00",
		stroke: '#000000',
		strokeThickness: 2
	})
	this.sprite.x = x
	this.sprite.y = y - 48
	this.animTime = 0
	this.states = {
		fading: function(delta) {
			this.animTime += delta / 100;
			if (this.animTime >= 0.5) {
				removeEntity(this)
				return
			}
			this.sprite.y -= delta * 2
			this.sprite.alpha = 1 - this.animTime * 2
		}
	}
	this.state = this.states.fading
	entitiesContainer.addChild(this.sprite)
	entities.push(this)
}
