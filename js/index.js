// Aliases
// these make the rest of the code shorter, plus it puts all the "PIXI is not defined" errors up here in one place
// since I'm not using NPM or anything, so subl has no way of knowing these are being loaded before this file runs.
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    sound = PIXI.sound,
    Emitter = PIXI.particles.Emitter,
    Graphics = PIXI.Graphics;

// Create some basic objects
let stage = new Container();
stage.interactive = true;
let renderer = autoDetectRenderer(1, 1, {antialias: true, transparent: true});
document.body.appendChild(renderer.view);

// Make the game fit the entire window
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

// Window stuff
window.addEventListener("resize", resize);
window.addEventListener("click", onClick);
window.addEventListener("touchstart", onClick);
document.getElementById("start").addEventListener("click", start);

let buttons = document.getElementsByClassName("shop-item-buy");
for (let i = buttons.length - 1; i >= 0; i--) {
	buttons[i].addEventListener("click", buyButton);
}

// Load assets
loader
	// Images
	.add("background", "assets/background.png")
	.add("baddie", "assets/baddie.png")
	.add("baddieArmor", "assets/baddieArmor.png")
	.add("baddieRanged", "assets/baddieRanged.png")
	.add("baddieRangedArmor", "assets/baddieRangedArmor.png")
	.add("bar", "assets/bar.png")
	.add("coin", "assets/coin.png")
	.add("crystal", "assets/crystal.png")
	.add("fortress", "assets/fortress.png")
	.add("slime", "assets/slime.png")
	.add("slimeArmor", "assets/slime_armor.png")
	.add("smoke", "assets/smoke.png")
	// Sounds
	.add("deflect", "assets/deflect.mp3")
	.add("fly", "assets/fly.mp3")
	.add("impact", "assets/impact.mp3")
	.add("land", "assets/land.mp3")
	.add("squish", "assets/squish.mp3")
	.add("zap", "assets/zap.mp3")
	// Call setup after loading
	.load(setup);

// Constants
let squishTime = 0.1;
let enemyDuration = 10;

// General variables
let state;
let elapsed = Date.now();
let emitters = [];
let screenshake;

// Wave variables
let wave = 1;
let energy;
let maxEnergy;
let enemyFrequency;
let enemyHealth;
let slimeTimer;
let enemyTimer;

// Sprites
let background, fortress, crystal;
let slimes = [];
let enemies = [];

// Upgrades
let money = 0;
let upgrades = {
	// Cost: Initial Cost
	// Modifier: Cost modifier after each purchase
	// Diff: Value to be added after each purchase
	// Value: Current upgrade value
	spm: {cost: 1000, modifier: 1.5,  diff: 1,     value: 3},  // Slimes Per Minute
	ssd: {cost: 1000, modifier: 1.25, diff: - 0.1, value: 1},  // Slime Spawn Duration
	eps: {cost: 1000, modifier: 1.25,  diff: 0.1,   value: 1},  // Energy Per Slime
	is:  {cost: 1000, modifier: 1.5,  diff: 1,     value: 1},  // Initial Slimes
	sd:  {cost: 1000, modifier: 1.1,  diff: - 1,   value: 25}, // Slime Duration
	sa:  {cost: 1000, modifier: 1.25, diff: 1,     value: 0},  // Slime Armor
	fs:  {cost: 1000, modifier: 2,    diff: - 0.1, value: 1},  // Slime Closeness
	fw:  {cost: 1000, modifier: 1.1,  diff: 0.1,   value: 3}   // Fortress Weight
}

function setup() {
	background = new Sprite(TextureCache.background);
	background.anchor.x = 0.5;
	background.anchor.y = 0.815;
	stage.addChild(background);
	fortress = new Sprite(TextureCache.fortress);
	fortress.anchor.x = 0.5;
	fortress.anchor.y = 1;
	stage.addChild(fortress);
	crystal = new Sprite(TextureCache.crystal);
	crystal.anchor.x = 0.5;
	crystal.anchor.y = 1;
	stage.addChild(crystal);
	emitters[0] = new Emitter(stage,
		[TextureCache.smoke],
		{
			"alpha": {
				"start": 0.5,
				"end": 0
			},
			"scale": {
				"start": 0.01,
				"end": 0.15,
				"minimumScaleMultiplier": 1
			},
			"color": {
				"start": "#ffffff",
				"end": "#ffffff"
			},
			"speed": {
				"start": 250,
				"end": 50,
				"minimumSpeedMultiplier": 1
			},
			"acceleration": {
				"x": 0,
				"y": -250
			},
			"maxSpeed": 2000,
			"startRotation": {
				"min": 0,
				"max": 180
			},
			"noRotation": false,
			"rotationSpeed": {
				"min": 0,
				"max": 200
			},
			"lifetime": {
				"min": 0.5,
				"max": 0.8
			},
			"blendMode": "normal",
			"frequency": 0.001,
			"emitterLifetime": 0.2,
			"maxParticles": 100,
			"pos": {
				"x": 0,
				"y": 0
			},
			"addAtBack": false,
			"spawnType": "rect",
			"spawnRect": {
				"x": -125,
				"y": 0,
				"w": 250,
				"h": 0
			}
		});
	emitters[0].emit = false;

	state = paused; // play
	resize();
	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	state();

	renderer.render(stage);
}

function play() {
	let now = Date.now();
	let delta = (now - elapsed) * 0.001;
	elapsed = now;
	
	// Update particle emitters
	// The emitter requires the elapsed
	// number of seconds since the last update
	for (let i = emitters.length - 1; i >= 0; i--)
		emitters[i].update(delta);

	// Update screenshaking animation
	if (fortress.y < 0) {
		// Make fortress fall faster over time, and warp y scaling
		fortress.speed = (fortress.speed || 0) + 100 * delta * upgrades.fw.value;
		fortress.y += fortress.speed * delta * 100;
		fortress.scale.y = fortress.scale.x * (1 + fortress.speed / 100);
		fortress.pivot.y = - window.innerHeight * 0.835 / fortress.scale.y;
		if (fortress.y >= 0) {
			// Flash white for a frame, on impact
			// a bit divisive
			//stage.alpha = 0;
			fortress.y = 0;
			// Impact particle effect
			emitters[0].emit = true;
			emitters[0].spawnPos.x = fortress.x + window.innerWidth / 2;
			emitters[0].spawnPos.y = window.innerHeight * 0.835;
			// Screenshake on impact
			screenshake = fortress.speed / 200;
			// Make the fortress squish a bit on impact
			fortress.scale.y = fortress.scale.x * (0.5 + (1 / (fortress.speed / 25 + 1)) / 2);
			fortress.pivot.y = - window.innerHeight * 0.835 / fortress.scale.y;
			// Destroy things it landed on
			for (let i = slimes.length - 1; i >= 0; i--) {
				let slimeX;
				if (slimes[i].state === slimes[i].states.absorbing || slimes[i].state === slimes[i].states.flying)
					slimeX = slimes[i].sprite.x + crystal.pivot.x * crystal.scale.x;
				else
					slimeX = slimes[i].sprite.x;
				if (Math.abs(slimeX - fortress.x) < (fortress.width + slimes[i].sprite.width) / 2) {
					if (slimes[i].state === slimes[i].states.moving || slimes[i].state === slimes[i].states.spawning) {
						slimes[i].hit();
					} else {
						slimes[i].state = slimes[i].states.flying;
						slimes[i].sprite.x += slimes[i].sprite.pivot.x * slimes[i].sprite.scale.x;
						slimes[i].sprite.y -= slimes[i].sprite.pivot.y * slimes[i].sprite.scale.y;
						slimes[i].sprite.pivot.x = slimes[i].sprite.pivot.y = 0;
						if (!slimes[i].velocity) {
							slimes[i].velocity = {
								x: (Math.random() * 20 - 10) * fortress.speed,
								y: (Math.random() * 20 + 10) * fortress.speed,
								rotation: (Math.random() * Math.PI / 25) * fortress.speed
							};
						} else {
							slimes[i].velocity.x += (Math.random() * 20 - 10) * fortress.speed;
							slimes[i].velocity.y += (Math.random() * 20 + 10) * fortress.speed;
							slimes[i].velocity.rotation = (Math.random() * Math.PI / 25) * fortress.speed;
						}
						//sound.play("fly");
					}
				}
			}
			for (let i = enemies.length - 1; i >= 0; i--) {
				if (Math.abs(enemies[i].container.x + crystal.pivot.x * crystal.scale.x - fortress.x) < (fortress.width + Math.abs(enemies[i].container.width)) / 2) {
					enemies[i].hit(fortress.speed);
				}
			}
			// Reset velocity
			fortress.speed = 0;
			// Play impact sound
			sound.play("impact");
		}
	} else {
		if (fortress.scale.y < fortress.scale.x) {
			// Unsquish over time
			fortress.scale.y = Math.min(fortress.scale.y + 0.005, fortress.scale.x);
			fortress.pivot.y = - window.innerHeight * 0.835 / fortress.scale.y;
		}
		fortress.y = 0;
		//stage.alpha = 1;
	}
	if (screenshake) {
		// Move entire stage some amount of pixels
		stage.pivot.x = (Math.random() - 0.5) * screenshake * 200;
		stage.pivot.y = Math.random() * screenshake * 200;
		screenshake -= delta;
		if (screenshake <= 0) {
			screenshake = 0;
			stage.pivot.x = stage.pivot.y = 0;
		}
	}

	// Update slimes
	slimeTimer = slimeTimer + delta || 0;
	if (slimeTimer >= 60 / upgrades.spm.value) {
		slimes[slimes.length] = new Slime();
		stage.addChild(slimes[slimes.length - 1].sprite);
		slimeTimer = 0;
	}
	for (let i = slimes.length - 1; i >= 0; i--) {
		slimes[i].state(delta);
	}

	// Update enemies
	enemyTimer = enemyTimer + Math.random() * delta || 0;
	if (enemyTimer >= 60 / enemyFrequency) {
		let enemy;
		let type = Math.random() * enemyHealth;
		if (type < 25) {
			enemy = new Enemy();
		} else if (type < 50) {
			enemy = new EnemyArmor(1);
		} else if (type < 75) {
			enemy = new EnemyRanged();
		} else if (type < 100) {
			enemy = new EnemyArmor(2);
		} else if (type < 125) {
			enemy = new EnemyRangedArmor(1);
		} else if (type < 150) {
			enemy = new EnemyArmor(3);
		} else {
			enemy = new EnemyRangedArmor(2);
		}
		enemies.push(enemy);
		stage.addChild(enemy.container);
		enemyTimer = 0;
	}
	for (let i = enemies.length - 1; i >= 0; i--) {
		enemies[i].state(delta);
	}

	// Update charge UI
	document.getElementById("energy").style.width = (100 * energy / maxEnergy) + "%";
	if (energy >= maxEnergy && maxEnergy !== -1) {
		stop();
	}
}

function paused() {
	let now = Date.now();
	let delta = (now - elapsed) * 0.001;
	elapsed = now;
	
	// Update particle emitters
	// The emitter requires the elapsed
	// number of seconds since the last update
	for (let i = emitters.length - 1; i >= 0; i--)
		emitters[i].update(delta);

	// Update screenshaking animation
	if (fortress.y < 0) {
		// Make fortress fall faster over time, and warp y scaling
		fortress.speed = (fortress.speed || 0) + 100 * delta;
		fortress.y += fortress.speed * delta * 100;
		fortress.scale.y = fortress.scale.x * (1 + fortress.speed / 100);
		fortress.pivot.y = - window.innerHeight * 0.835 / fortress.scale.y;
		if (fortress.y >= 0) {
			// Flash white for a frame, on impact
			// a bit divisive
			//stage.alpha = 0;
			fortress.y = 0;
			// Impact particle effect
			emitters[0].emit = true;
			emitters[0].spawnPos.x = fortress.x + window.innerWidth / 2;
			emitters[0].spawnPos.y = window.innerHeight * 0.835;
			// Screenshake on impact
			screenshake = fortress.speed / 200;
			// Make the fortress squish a bit on impact
			fortress.scale.y = fortress.scale.x * (0.5 + (1 / (fortress.speed / 25 + 1)) / 2);
			fortress.pivot.y = - window.innerHeight * 0.835 / fortress.scale.y;
			// Reset velocity
			fortress.speed = 0;
			// Play impact sound
			sound.play("impact");
		}
	} else {
		if (fortress.scale.y < fortress.scale.x) {
			// Unsquish over time
			fortress.scale.y = Math.min(fortress.scale.y + 0.005, fortress.scale.x);
			fortress.pivot.y = - window.innerHeight * 0.835 / fortress.scale.y;
		}
		fortress.y = 0;
		//stage.alpha = 1;
	}
	if (screenshake) {
		// Move entire stage some amount of pixels
		stage.pivot.x = (Math.random() - 0.5) * screenshake * 200;
		stage.pivot.y = Math.random() * screenshake * 200;
		screenshake -= delta;
		if (screenshake <= 0) {
			screenshake = 0;
			stage.pivot.x = stage.pivot.y = 0;
		}
	}
}

function start() {
	state = play;

	for (let i = upgrades.is.value; i > 0; i--) {
		slimes[slimes.length] = new Slime();
		stage.addChild(slimes[slimes.length - 1].sprite);
		slimes[slimes.length - 1].sprite.x = 0;
		slimes[slimes.length - 1].state = slimes[slimes.length - 1].states.moving;
	}

	energy = 0;
	maxEnergy = 25 * (wave + 1);
	enemyFrequency = 100 + 10 * wave;
	enemyHealth = (10 + Math.random() * 15) * wave;
	slimeTimer = 0;
	enemyTimer = 0;

	document.getElementById("charge").style.display = "block";
	document.getElementById("start").style.display = "none";
	document.getElementById("greeting").style.display = "none";
	document.getElementById("shop").style.display = "none";
}

function stop() {
	for (let i = slimes.length - 1; i >= 0; i--) {
		stage.removeChild(slimes[i].sprite);
	}
	for (let i = enemies.length - 1; i >= 0; i--) {
		stage.removeChild(enemies[i].container);
	}
	slimes = [];
	enemies = [];
	document.getElementById("charge").style.display = "none";
	wave++;
	if (wave === 11) {
		document.getElementById("finish").style.display = "block";
		enemyFrequency = 0;
		upgrades.spm.value = 200;
		maxEnergy = -1;
	} else {
		document.getElementById("start").style.display = "block";
		document.getElementById("grats").style.display = "block";
		document.getElementById("shop").style.display = "block";
		document.getElementById("next-wave").innerText = "Press to start next wave (" + wave + ")";
		state = paused;
	}
}

function resize() { 
	renderer.resize(window.innerWidth, window.innerHeight);

	// Make the background cover the screen
	background.x = window.innerWidth * 0.5;
	background.y = window.innerHeight * 0.815;
	background.scale.x = background.scale.y = Math.max(window.innerWidth / 3840, window.innerHeight / 2160);

	// Make fortress an appropriate size
	fortress.scale.x = fortress.scale.y = Math.min((window.innerWidth / 5) / 1499, (window.innerHeight / 2) / 1046);
	fortress.pivot.x = - (window.innerWidth / 2) / fortress.scale.x;
	fortress.pivot.y = - window.innerHeight * 0.835 / fortress.scale.y;

	// Same thing, but for the crystal
	crystal.scale.x = crystal.scale.y = Math.min((window.innerWidth / 7) / 558, (window.innerHeight / 4) / 418);
	crystal.pivot.x = - (window.innerWidth / 2) / crystal.scale.x;
	crystal.pivot.y = - window.innerHeight * 0.835 / crystal.scale.y;

	// Same thing, but for the slimes
	for (let i = slimes.length - 1; i >= 0; i--) {
		slimes[i].resize();
	}

	// Same thing, but for the enemies
	for (let i = enemies.length - 1; i >= 0; i--) {
		enemies[i].resize();
	}

	// Modify particle emitter to scale with fortress size
	emitters[0].spawnRect.width = fortress.width;
	emitters[0].spawnRect.x = - fortress.width / 2;
	emitters[0].startScale = fortress.width / 25000;
	emitters[0].endScale = emitters[0].startScale * 15;
	emitters[0].startSpeed = fortress.width;
	emitters[0].endSpeed = fortress.width / 5;
	emitters[0].acceleration.y = - fortress.width;
}

function onClick(e) {
	// Get click/tap position
	let x = e.x || e.touches[0].clientX;
	let y = e.y || e.touches[0].clientY;
	// Move fortress to new position
	fortress.x = x - window.innerWidth / 2;
	fortress.y = - (window.innerHeight * 0.835 - y);
}

var Slime = function() {
	this.sprite = new Sprite(upgrades.sa.value === 0 ? TextureCache.slime : TextureCache.slimeArmor);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 1;
	this.sprite.x = (Math.random() - 0.5) * window.innerWidth * upgrades.fs.value;
	this.state = this.states.spawning;
	this.armor = upgrades.sa.value;
	this.resize();
}

Slime.prototype.resize = function() {
	if (this.state === this.states.absorbing) {
		this.sprite.scale.y = Math.min((window.innerWidth / 11) / 468, (window.innerHeight / 8) / 236);
		this.sprite.scale.x = this.sprite.scale.y * (Math.random() > 0.5 ? 1 : -1);
		this.sprite.x = (Math.random() - 0.5) * crystal.width / 2 - crystal.pivot.x * crystal.scale.x;
		this.sprite.y = (Math.random() - 1) * crystal.height / 2 - crystal.pivot.y * crystal.scale.y;
	} else {
		this.sprite.scale.x = this.sprite.scale.y = Math.min((window.innerWidth / 11) / 468, (window.innerHeight / 8) / 236);
		this.sprite.pivot.x = - (window.innerWidth / 2) / this.sprite.scale.x;
		this.sprite.pivot.y = - window.innerHeight * 0.835 / this.sprite.scale.y;
		if (this.sprite.x > 0) {
			this.sprite.scale.x *= -1;
			this.sprite.pivot.x *= -1;
		}
	}
}

Slime.prototype.states = {
	spawning: function(delta) {
		this.spawnTime = (this.spawnTime || 0) + delta;
		if (this.spawnTime > upgrades.ssd.value) {
			this.state = this.states.moving;
			this.sprite.scale.y = Math.abs(this.sprite.scale.x);
			this.sprite.pivot.y = - window.innerHeight * 0.835 / this.sprite.scale.y;
		} else {
			this.sprite.scale.y = Math.abs(this.sprite.scale.x) * this.spawnTime;
			this.sprite.pivot.y = - window.innerHeight * 0.835 / this.sprite.scale.y;
		}
	},
	moving: function(delta) {
		if (Math.abs(this.sprite.x) < crystal.width / 2) {
			this.state = this.states.absorbing;
			this.sprite.scale.x = this.sprite.scale.y * (Math.random() > 0.5 ? 1 : -1);
			this.sprite.pivot.x = this.sprite.pivot.y = 0;
			this.sprite.x = (Math.random() - 0.5) * crystal.width / 2 - crystal.pivot.x * crystal.scale.x;
			this.sprite.y = (Math.random() - 1) * crystal.height / 2 - crystal.pivot.y * crystal.scale.y;
			this.sprite.rotation = (Math.random() - 0.5) * Math.PI / 4;
		} else {
			this.moveTime = (this.moveTime || 0) + delta;
			this.sprite.x += delta * window.innerWidth / upgrades.sd.value * (this.sprite.x < 0 ? 1 : -1);
			this.sprite.scale.x = this.sprite.scale.y * (Math.sin(this.moveTime) / 2 + 1) * (this.sprite.x < 0 ? 1 : -1);
			this.sprite.pivot.x = - (window.innerWidth / 2) / Math.abs(this.sprite.scale.x) * (this.sprite.x < 0 ? 1 : -1);
		}
	},
	absorbing: function(delta) {
		energy += upgrades.eps.value * delta;
	},
	dying: function(delta) {
		this.deathTime = (this.deathTime || squishTime) - delta;
		if (this.deathTime <= 0) {
			stage.removeChild(this.sprite);
			slimes.splice(slimes.indexOf(this), 1);
		} else {
			this.sprite.scale.y = Math.abs(this.sprite.scale.x) * this.deathTime * (1 / squishTime);
			this.sprite.pivot.y = - window.innerHeight * 0.835 / this.sprite.scale.y;
		}
	},
	flying: function(delta) {
		this.sprite.x += this.velocity.x * delta;
		this.sprite.y -= this.velocity.y * delta;
		this.sprite.rotation += this.velocity.rotation * delta;
		if (this.sprite.y >= window.innerHeight * 0.835) {
			this.state = this.states.moving;
			this.sprite.y = 0;
			this.sprite.rotation = 0;
			this.velocity = null;
			this.resize();
			this.sprite.x += this.sprite.pivot.x * this.sprite.scale.x;
			sound.play("land");
		} else {
			this.velocity.x *= 0.99;
			this.velocity.y -= 1000 * delta;
		}
	}
}

Slime.prototype.hit = function() {
	if (this.armor > 0) {
		this.armor--;
		if (this.armor === 0)
			this.sprite.setTexture(TextureCache.slime);
		sound.play("deflect");
	} else {
		this.state = this.states.dying;
		//sound.play("squish");
	}
}

var Enemy = function() {
	this.container = new Container();
	this.sprite = new Sprite(TextureCache.baddie);
	this.container.addChild(this.sprite);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	
	this.healthcontainer = new Container();
	let outerbar = new Sprite(TextureCache.bar);
	this.healthcontainer.addChild(outerbar);
	this.healthbar = new Graphics();
	this.healthbar.beginFill(0xFF3300);
	this.healthbar.drawRect(24, 4, 368, 12);
	this.healthbar.endFill();
	this.healthcontainer.addChild(this.healthbar);
	this.container.addChild(this.healthcontainer);
	this.healthcontainer.alpha = 0;
	
	this.container.x = (Math.random() > 0.5 ? 0 : 1) * window.innerWidth;
	this.health = enemyHealth;
	this.resize();
	this.state = this.states.moving;
}

Enemy.prototype.resize = function() {
	this.container.scale.x = this.container.scale.y = Math.min((window.innerWidth / 11) / 273, (window.innerHeight / 8) / 701);
	this.container.y = window.innerHeight * 0.835 - this.container.height / 2;
	if (this.container.x > 0) {
		this.container.scale.x *= -1;
	}
	this.healthcontainer.x = -416;
	this.healthcontainer.y = - this.sprite.height * 0.8;
	this.healthcontainer.height = this.sprite.height * 0.1;
	this.healthcontainer.width = this.sprite.width * 2;
}

Enemy.prototype.states = {
	moving: function(delta) {
		this.moveTime = (this.moveTime || 0) + delta;
		this.container.x += delta * window.innerWidth / enemyDuration * (this.container.x < window.innerWidth / 2 ? 1 : -1);
		this.sprite.rotation = Math.sin(this.moveTime * 10) * Math.PI / 4;
		if (Math.abs(window.innerWidth / 2 - Math.abs(this.container.x)) < crystal.width / 2) {
			for (let i = slimes.length - 1; i >= 0; i--) {
				if (slimes[i].state === slimes[i].states.absorbing) {
					slimes[i].hit();
					this.state = this.states.dying;
					return;
				}
			}
		}
	},
	dying: function(delta) {
		this.deathTime = (this.deathTime || squishTime) - delta;
		if (this.deathTime <= 0) {
			stage.removeChild(this.container);
			enemies.splice(enemies.indexOf(this), 1);
		} else {
			this.container.scale.y = Math.abs(this.container.scale.x) * this.deathTime * (1 / squishTime);
		}
	}
}

Enemy.prototype.hit = function(damage) {
	this.health -= damage;
	this.healthbar.scale.x = this.health / enemyHealth;
	this.healthcontainer.alpha = 1;
	if (this.health <= 0) {
		this.sprite.anchor.y = 1;
		this.container.y = window.innerHeight * 0.835;
		this.state = this.states.dying;
		this.container.removeChild(this.healthcontainer);
		spawnCoins(this.container.x, this.container.y);
		money += enemyHealth;
		document.getElementById("gold").innerText = Math.round(money);
	}
}

var EnemyArmor = function(armor) {
	Enemy.call(this);
	this.armor = armor;
	this.sprite.setTexture(TextureCache.baddieArmor);
}

EnemyArmor.prototype = Object.create(Enemy.prototype);

EnemyArmor.prototype.hit = function(damage) {
	if (this.armor > 0) {
		this.armor--;
		sound.play("deflect");
		if (this.armor === 0)
			this.sprite.setTexture(TextureCache.baddie);
	} else {
		Enemy.prototype.hit.call(this, damage);
	}
}

var EnemyRanged = function() {
	Enemy.call(this);
	this.container.x = (Math.random() > 0.5 ? 0.25 : 0.75) * window.innerWidth;
	this.sprite.setTexture(TextureCache.baddieRanged);
	this.state = this.states.spawning;
	this.resize();
}

EnemyRanged.prototype = Object.create(Enemy.prototype);

EnemyRanged.prototype.states.spawning = function(delta) {
	this.spawnTime = (this.spawnTime || 0) + delta;
	if (this.spawnTime > 2) {
		this.state = this.states.attacking;
		this.sprite.scale.y = Math.abs(this.sprite.scale.x);
		this.container.y = window.innerHeight * 0.835 - this.container.height / 2;
	} else {
		this.sprite.scale.y = Math.abs(this.sprite.scale.x) * this.spawnTime / 2;
		this.container.y = window.innerHeight * 0.835 - this.container.height / 2;
	}
}

EnemyRanged.prototype.states.attacking = function(delta) {
	this.attackTime = (this.attackTime || 0) + delta;
	if (this.attackTime > 2) {
		this.attackTime = 0;
		let closest;
		let closestDistance;
		for (let i = slimes.length - 1; i >= 0; i--) {
			let slimeX;
			if (slimes[i].state === slimes[i].states.absorbing || slimes[i].state === slimes[i].states.flying)
				slimeX = slimes[i].sprite.x + crystal.pivot.x * crystal.scale.x;
			else
				slimeX = slimes[i].sprite.x;
			if (!closest || Math.abs(slimeX - window.innerWidth / 2) < closestDistance) {
				closest = slimes[i];
				closestDistance = slimeX;
			}
		}
		if (closest) {
			// TODO laser?
			closest.hit();
			sound.play("zap");
		}
	}
}

var EnemyRangedArmor = function(armor) {
	EnemyRanged.call(this);
	this.armor = armor;
	this.sprite.setTexture(TextureCache.baddieRangedArmor);
}

EnemyRangedArmor.prototype = Object.create(EnemyRanged.prototype);

EnemyRangedArmor.prototype.hit = function(damage) {
	if (this.armor > 0) {
		this.armor--;
		sound.play("deflect");
		if (this.armor === 0)
			this.sprite.setTexture(TextureCache.baddieRanged);
	} else {
		EnemyRanged.prototype.hit.call(this, damage);
	}
}

function spawnCoins(x, y) {
	let emitter = new Emitter(stage,
			[TextureCache.coin],
			{
				"alpha": {
					"start": 1,
					"end": 0
				},
				"scale": {
					"start": 0.01,
					"end": 0.8,
					"minimumScaleMultiplier": 0.5
				},
				"color": {
					"start": "#ffffff",
					"end": "#ffffff"
				},
				"speed": {
					"start": 600,
					"end": 400,
					"minimumSpeedMultiplier": 1
				},
				"acceleration": {
					"x": 0,
					"y": 1200
				},
				"maxSpeed": 0,
				"startRotation": {
					"min": 260,
					"max": 280
				},
				"noRotation": false,
				"rotationSpeed": {
					"min": 0,
					"max": 10
				},
				"lifetime": {
					"min": 0.5,
					"max": 1
				},
				"blendMode": "normal",
				"frequency": 0.008,
				"emitterLifetime": 0.15,
				"maxParticles": 500,
				"pos": {
					"x": x,
					"y": y
				},
				"addAtBack": false,
				"spawnType": "point"
			}
		);
	emitter.destroyWhenComplete = true;
	emitters.push(emitter);
}

function buyButton(e) {
	let upgrade = upgrades[e.target.id];
	if (money >= upgrade.cost) {
		money -= upgrade.cost;
		upgrade.cost *= upgrade.modifier;
		upgrade.value += upgrade.diff;
		document.getElementById("gold").innerText = Math.round(money);
		e.target.innerText = Math.round(upgrade.cost);
	}
}
