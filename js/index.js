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

// DOM listeners
document.getElementById('units-tab-button').addEventListener('click', () => {
	document.getElementById('units-tab').style.display = ''
	document.getElementById('buildings-tab').style.display = 'none'
})
document.getElementById('buildings-tab-button').addEventListener('click', () => {
	document.getElementById('buildings-tab').style.display = ''
	document.getElementById('units-tab').style.display = 'none'
})
makeHorizontalScroll('buildings-tab')
makeHorizontalScroll('units-tab')

// Load assets
loader
	// Images
	.add("background", "assets/depth.jpg")
	// Sounds
	//.add("deflect", "assets/deflect.mp3")
	// Call setup after loading
	.load(setup);

// General variables
let state;
let emitters = [];

// Level specific variables
let map;

// Sprites
let background

function setup() {
	background = new Sprite(TextureCache.background);
	background.anchor.x = 0.5;
	background.x = 640
	background.scale.x = background.scale.y = 0.5
	app.stage.addChild(background);

	map = new Map({
		playerPath: [
			{x: 0, y: 360},
			{x: 320, y: 50},
			{x: 460, y: 200},
			{x: 640, y: 640},
			{x: 1280, y: 360},
		]
	})

	state = states.paused;
	app.ticker.add((delta) => {
		state.update(delta);
	})
}

let states = {
	paused: {
		update: (delta) => {
			// Update Particles

			// Update UI
		},
		enter: () => {

		},
		exit: () => {

		}
	},
	play: {
		update: (delta) => {
			// Update Particles

			// Update Entities

			// Update UI
		},
		enter: () => {

		},
		exit: () => {

		}
	}
}

let Map = function(settings) {
	let g = new Graphics()

	// Draw player path
	g.lineStyle(24, 0xffd900, 1);
	g.moveTo(settings.playerPath[0].x, settings.playerPath[0].y)
	for (let i = 1; i < settings.playerPath.length; i++) {
		g.lineTo(settings.playerPath[i].x, settings.playerPath[i].y)
	}
	g.beginFill(0xffd900);
	for (let i = 0; i < settings.playerPath.length; i++) {
		g.drawCircle(settings.playerPath[i].x, settings.playerPath[i].y, 15)
	}
	g.endFill();

	/*// Draw enemy path
	g.lineStyle(24, 0xff00d9, 1);
	g.drawCircle(settings.enemyPath[0].x, settings.enemyPath[0].y, 20)
	g.moveTo(settings.enemyPath[0].x, settings.enemyPath[0].y)
	for (let i = 1; i < settings.enemyPath.length; i++) {
		g.lineTo(settings.enemyPath[i].x, settings.enemyPath[i].y)
	}
	lastNode = settings.enemyPath[settings.enemyPath.length - 1]
	g.drawCircle(lastNode.x, lastNode.y, 20)
	*/

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
