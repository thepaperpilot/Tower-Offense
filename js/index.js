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
    Graphics = PIXI.Graphics;

// Create some basic objects
let app = new Application(1280, 720, {antialias: true, transparent: true})
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
	startLevel(0);
})
makeHorizontalScroll('buildings-tab')
makeHorizontalScroll('units-tab')
for (let i = 0; i < units.length; i++) {
	let unit = document.createElement('div')
	unit.className = "shop-item"
	unit.innerHTML = '<p class="item-name">' + units[i].name + '</p><button>' + units[i].cost + '</button>'
	let button = unit.querySelector('button')
	button.i = i
	button.addEventListener('click', purchaseUnit)
	unitsTab.appendChild(unit)
}
for (let i = 0; i < buildings.length; i++) {
	let building = document.createElement('div')
	building.className = "shop-item"
	building.innerHTML = '<p class="item-name">' + buildings[i].name + '</p><button>' + buildings[i].cost + '</button><div id="building ' + i + ' quantity" class="quantity">0</div>'
	let button = building.querySelector('button')
	button.i = i
	button.addEventListener('click', purchaseBuilding)
	buildingsTab.appendChild(building)
}

// Constants
let PROJECTILE_SPEED = 10

// Load assets
loader
	// Images
	.add("depth", "assets/depth.jpg")
	.add("tower", "assets/Tower.png")
	.add("foxWizard", "assets/FoxWizard.png")
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
			document.getElementById('next-level').className = 'start'
		},
		exit: () => {
			document.getElementById('next-level').className = 'start inactive'
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

// General variables
let state = states.paused;
let emitters = [];

// Level specific variables
let map, food, gold, enemyHealth;
let buildingLevels = []
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
	food += Math.random() * delta * 20
	gold += Math.random() * delta / 2

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

function startLevel(i) {
	let level = levels[i]

	// Reset level specific values
	food = gold = 0
	enemyHealth = level.enemyHealth
	buildingLevels = []
	for (let i = 0; i < buildings.length; i++) {
		buildingLevels.push(0)
		document.getElementById('building ' + i + ' quantity').innerText = '0'
	}

	// Clean up old sprite
	if (background) background.remove()
	if (enemyPath) enemyPath.remove()
	if (entitiesContainer) entitiesContainer.remove()
	if (emittersContainer) emittersContainer.remove()

	// Set up background
	background = new Sprite(TextureCache[level.background]);
	// Temporary
	background.anchor.x = 0.5;
	background.x = 640
	background.scale.x = background.scale.y = 0.5
	// End Temporary
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
		state.enter()
	})
}

function purchaseUnit(e) {
	let unit = units[e.target.i]
	if (food >= unit.cost) {
		playerUnits.push(new Unit(unit))
		food -= unit.cost
	}
}

function purchaseBuilding(e) {
	let building = buildings[e.target.i]
	if (gold >= building.cost) {
		buildingLevels[e.target.i]++
		document.getElementById('building ' + e.target.i + ' quantity').innerText = buildingLevels[e.target.i]
		gold -= building.cost
	}
}

function createEmitter(x, y) {
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
			"min": 160,
			"max": 200
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

let Unit = function(unit) {
	this.sprite = new Sprite(TextureCache[unit.sprite])
	this.sprite.x = map[0].x - 10
	this.sprite.y = map[0].y
	this.sprite.anchor.y = 1
	this.sprite.anchor.x = 0.5
	this.sprite.scale.x = 2
	this.point = 0
	this.speed = unit.speed
	this.health = unit.health
	this.damage = unit.damage
	this.animTime = 0
	this.states = {
		moving: (delta) => {
			// Check if we reached the castle
			if (this.point === map.length) {
				createEmitter(this.sprite.x, this.sprite.y)
				enemyHealth -= this.damage
				if (enemyHealth <= 0) {
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
				if (distance === distancePoint) this.point++
				else this.state = this.states.attacking
			} else {
				dx /= magnitude
				dy /= magnitude

				this.sprite.x += dx * delta * this.speed
				this.sprite.y += dy * delta * this.speed
			}
			this.animTime += delta
			this.sprite.scale.y = 2 + Math.cos(this.animTime / 10) * 0.2
		},
		attacking: (delta) => {
			// TODO
		}
	}
	this.state = this.states.moving
	entitiesContainer.addChild(this.sprite)
	entities.push(this)
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
	this.sprite.scale.x = 2
	this.range = tower.range
	this.speed = tower.speed
	this.health = tower.health
	this.damage = tower.damage
	this.animTime = 0
	this.shootTime = 0
	// helper methods for shooting
	this.shootProjectile = function(sprite, target) {
		if (!sprite) {
			sprite = new Graphics()
			sprite.beginFill(0xFF700B, 1);
			sprite.drawRect(0, 0, 4, 4);
			sprite.endFill()
		}
		new Projectile(sprite, PROJECTILE_SPEED, this.damage, this.sprite, target)
	}
	this.states = {
		idle: (delta) => {
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
			this.sprite.scale.y = 2 + Math.cos(this.animTime / 10) * 0.2
		}
	}
	this.state = this.states.idle
	entitiesContainer.addChild(this.sprite)
	entities.push(this)
}

let Projectile = function(container, speed, damage, launcher, target) {
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
			let dy = this.target.sprite.y - 24 - this.sprite.y

			// Technically magnitude is distance, and distance is distance^2
			let distance = dx * dx + dy * dy
			let magnitude = Math.sqrt(dx * dx + dy * dy)
			if (delta * this.speed * delta * this.speed > distance) {
				this.target.health -= this.damage
				if (this.target.health <= 0) {
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
