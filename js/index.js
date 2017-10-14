// Aliases
// these make the rest of the code shorter, plus it puts all the "PIXI is not defined" errors up here in one place
// since I'm not using NPM or anything, so subl has no way of knowing these are being loaded before this file runs.
let Application = PIXI.Application,
    loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    sound = PIXI.sound,
    Emitter = PIXI.particles.Emitter,
    Graphics = PIXI.Graphics;

// Create some basic objects
let app = new Application(1280, 720, {antialias: true, transparent: true})
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
makeHorizontalScroll('buildings-tab')
makeHorizontalScroll('units-tab')
for (let i = 0; i < units.length; i++) {
	let unit = document.createElement('div')
	unit.className = "shop-item"
	unit.innerHTML = '<p class="item-name">' + units[i].name + '</p><button>' + units[i].cost + '</button><div class="quantity">0</div>'
	unitsTab.appendChild(unit)
}
for (let i = 0; i < buildings.length; i++) {
	let building = document.createElement('div')
	building.className = "shop-item"
	building.innerHTML = '<p class="item-name">' + buildings[i].name + '</p><button>' + buildings[i].cost + '</button><div class="quantity">0</div>'
	buildingsTab.appendChild(building)
}

// Load assets
loader
	// Images
	.add("depth", "assets/depth.jpg")
	// Sounds
	//.add("deflect", "assets/deflect.mp3")
	// Call setup after loading
	.load(setup);

// General variables
let state;
let emitters = [];

// Level specific variables
let map, food, gold, enemyHealth;

// UI Variables
let foodDisplay = document.getElementById('curr-food')
let goldDisplay = document.getElementById('curr-gold')

// Sprites
let background, enemyPath

function setup() {
	app.ticker.add((delta) => {
		state.update(delta);
	})

	state = states.playing;
	startLevel(0);
}

let states = {
	paused: {
		update: (delta) => {
			updateParticles()
			updateUI()
		},
		enter: () => {

		},
		exit: () => {

		}
	},
	playing: {
		update: (delta) => {
			updateParticles()
			updateGame(delta)
			updateUI()
		},
		enter: () => {

		},
		exit: () => {

		}
	}
}

function updateParticles() {

}

function updateGame(delta) {
	food += Math.random() * delta
	gold += Math.random() * delta / 2
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

	// Clean up old sprite
	if (background) background.remove()
	if (enemyPath) enemyPath.remove()

	// Set up background
	background = new Sprite(TextureCache[level.background]);
	// Temporary
	background.anchor.x = 0.5;
	background.x = 640
	background.scale.x = background.scale.y = 0.5
	// End Temporary
	app.stage.addChild(background);

	// Set up enemy path
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
