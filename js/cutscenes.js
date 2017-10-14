// Variables
let chatClicked = false // whether or not the chatbox has been clicked
let cutsceneIndex
let callback // callback to call after running the current cutscene

// Load the stage and characters and stuff
// Less than ideal process, but I don't know how to load JSON client side
let stage

let puppets = {
	gravy: {"deadbonesStyle":false,"body":[{"tab":"shirts","hash":"1879914476","x":1.5,"y":-54,"rotation":0,"scaleX":1,"scaleY":1}],"head":[{"tab":"skin","hash":"-925878550","x":1,"y":-210.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"hats","hash":"478565665","x":-6,"y":-305,"rotation":0,"scaleX":1,"scaleY":1}],"hat":[],"mouths":["2","3","4","5"],"eyes":["0","1","5","6"],"emotes":[{"name":"default","enabled":true,"mouth":[{"tab":"mouths","hash":"-1156489428","x":-15.5,"y":-125,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-1478408941","x":-6.5,"y":-210,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"happy","enabled":true,"mouth":[{"tab":"mouths","hash":"-1156489428","x":-16,"y":-125.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"94370077","x":-10.5,"y":-225,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"confused","enabled":true,"mouth":[{"tab":"mouths","hash":"256135152","x":-6,"y":-126.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-1370165314","x":-9,"y":-212.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"gasp","enabled":true,"mouth":[{"tab":"mouths","hash":"-2006318913","x":-5.5,"y":-123.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyebrows","hash":"94370077","x":-10.5,"y":-225,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"ooo","enabled":true,"mouth":[{"tab":"mouths","hash":"1802568030","x":-2,"y":-122.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyebrows","hash":"94370077","x":-9.5,"y":-220,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"sad","enabled":true,"mouth":[{"tab":"mouths","hash":"-1834200705","x":-14.5,"y":-125.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.75,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-894109551","x":-7.5,"y":-211.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"angry","enabled":true,"mouth":[{"tab":"mouths","hash":"256135152","x":-12,"y":-128.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-1624236206","x":-7,"y":-207,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"wink","enabled":false,"mouth":[],"eyes":[]},{"name":"kiss","enabled":false,"mouth":[],"eyes":[]}],"props":[{"tab":"glasses","hash":"-1259854622","x":-3,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"name":"Gravy","id":1,"position":0,"facingLeft":false,"emote":"0"},
	not_gravy: {"deadbonesStyle":false,"body":[{"tab":"shirts","hash":"1879914476","x":1.5,"y":-54,"rotation":0,"scaleX":1,"scaleY":1}],"head":[{"tab":"skin","hash":"-925878550","x":1,"y":-210.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-1624236206","x":-5,"y":-139,"rotation":0,"scaleX":0.6931818181818182,"scaleY":0.6470588235294116}],"hat":[],"mouths":["2","3","4","5"],"eyes":["0","1","5","6"],"emotes":[{"name":"default","enabled":true,"mouth":[{"tab":"mouths","hash":"-1156489428","x":-15.5,"y":-125,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-1478408941","x":-6.5,"y":-210,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"happy","enabled":true,"mouth":[{"tab":"mouths","hash":"-1156489428","x":-16,"y":-125.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"94370077","x":-10.5,"y":-225,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"confused","enabled":true,"mouth":[{"tab":"mouths","hash":"256135152","x":-6,"y":-126.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-1370165314","x":-9,"y":-212.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"gasp","enabled":true,"mouth":[{"tab":"mouths","hash":"-2006318913","x":-5.5,"y":-123.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyebrows","hash":"94370077","x":-10.5,"y":-225,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"ooo","enabled":true,"mouth":[{"tab":"mouths","hash":"1802568030","x":-2,"y":-122.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyebrows","hash":"94370077","x":-9.5,"y":-220,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"sad","enabled":true,"mouth":[{"tab":"mouths","hash":"-1834200705","x":-14.5,"y":-125.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.75,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-894109551","x":-7.5,"y":-211.5,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"angry","enabled":true,"mouth":[{"tab":"mouths","hash":"256135152","x":-12,"y":-128.5,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"tab":"eyes","hash":"-679379193","x":-7,"y":-187.5,"rotation":0,"scaleX":1,"scaleY":1},{"tab":"eyebrows","hash":"-1624236206","x":-7,"y":-207,"rotation":0,"scaleX":1,"scaleY":1}]},{"name":"wink","enabled":false,"mouth":[],"eyes":[]},{"name":"kiss","enabled":false,"mouth":[],"eyes":[]}],"props":[{"tab":"glasses","hash":"-1259854622","x":-3,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"name":"Not Gravy","id":2,"position":6,"facingLeft":true,"emote":"0"}
}

let cutscenes = {
	cutscene1: "delay 1000;\n" +
		"add gravy 1 0;\n" +
		"add not_gravy 2 6;\n" +
		"move 1 1,\n" +
		"move 2 5;\n" +
		"move 1 0,\n" +
		"move 2 6;\n" +
		"remove 1;\n" +
		"remove 2;",
	cutscene2: "delay 1000;\n" +
		"add gravy 1 0;\n" +
		"add not_gravy 2 6;\n" +
		"move 1 1,\n" +
		"move 2 5;\n" +
		"move 1 0,\n" +
		"move 2 6;\n" +
		"remove 1;\n" +
		"remove 2;\n" +
		"delay 1000;\n" +
		"add gravy 1 0;\n" +
		"move 1 1;\n" +
		"jiggle 1;\n" +
		"emote 1 8;\n" +
		"chat 1 0;\n" +
		"add not_gravy 2 6;\n" +
		"move 2 4;\n" +
		"emote 2 8;\n" +
		"chat 2 1;\n" + 
		"chat 1 2;\n" + 
		"emote 2 1;\n" +
		"chat 2 3,\n" +
		"jiggle 2;\n" +
		"delay 400;\n" +
		"jiggle 2;\n" +
		"delay 400;\n" +
		"jiggle 2;\n" +
		"delay 400;\n" +
		"babble 2;\n" +
		"move 1 0,\n" +
		"move 2 6;"
}

window.loadBabble = function() {
	stage = new babble.Stage("screen", {
	  "numCharacters": 5,
	  "puppetScale": 1,
	  "assets": [
	    {"name": "eyebrows"},
	    {"name": "eyes"},
	    {"name": "mouths"},
	    {"name": "shirts"},
	    {"name": "skin"},
	    {"name": "glasses"},
	    {"name": "hats"}
	  ]
	}, {
		"eyebrows": {"94370077":{"name":"brow_excited","location":"eyebrows/94370077.png"},"-1478408941":{"name":"brow_normal","location":"eyebrows/-1478408941.png"},"-1370165314":{"name":"brow_confused","location":"eyebrows/-1370165314.png"},"-894109551":{"name":"brow_sad","location":"eyebrows/-894109551.png"},"-1624236206":{"name":"brow_angry","location":"eyebrows/-1624236206.png"}},
		"eyes": {"-679379193":{"name":"eyes_normal","location":"eyes/-679379193.png"}},
		"mouths": {"256135152":{"name":"mouth_teeth","location":"mouths/256135152.png"},"1802568030":{"name":"mouth_ooo","location":"mouths/1802568030.png"},"-1156489428":{"name":"mouth_normal","location":"mouths/-1156489428.png"},"-2006318913":{"name":"mouth_open","location":"mouths/-2006318913.png"},"-1834200705":{"name":"mouth_sad","location":"mouths/-1834200705.png"}},
		"shirts": {"1879914476":{"name":"body","location":"shirts/1879914476.png"}},
		"skin": {"-925878550":{"name":"head","location":"skin/-925878550.png"}},
		"glasses": {"-1259854622":{"name":"glasses_normal","location":"glasses/-1259854622.png"}},
		"hats": {"208380174":{"name":"kobold","location":"hats/208380174.png"},"354769791":{"name":"seachef","location":"hats/354769791.png"},"478565665":{"name":"tophat","location":"hats/478565665.png"},"-479894397":{"name":"elf","location":"hats/-479894397.png"},"-1611255066":{"name":"petalwalker","location":"hats/-1611255066.png"},"-5576877":{"name":"porc","location":"hats/-5576877.png"},"-1485571036":{"name":"wizard","location":"hats/-1485571036.png"}}
	}, "assets", loaded);
}

window.startCutscene = function(i, cb) {
	cutsceneIndex = i
	callback = cb
    document.getElementById('chatbox').className = "chatbox"
	waitUntilLoaded()
}

function waitUntilLoaded() {
	if (stage) {
		let cutscene = new babble.Cutscene(stage, cutscenes[cutsceneIndex], puppets, stopCutscene)
		cutscene.actions.chat = function(callback, target, chatId) {
			let chats = [{
				name: "Protagonist",
				message: "Alright, I'm ready to start hacking!"
			}, {
				name: "Antagonist",
				message: "Not so fast! I can tell you're up to no good."
			}, {
				name: "Protagonist",
				message: "Ah shucks, I've been found out"
			}, {
				name: "Antagonist",
				message: "Bwahahahahahahahahhahahaha!"
			}]
			document.getElementById('current_chat').style.display = 'block'
			document.getElementById('name').innerText = chats[chatId].name
			this.stage.getPuppet(target).setBabbling(true)
			chatClicked = false
			chatter(callback, target, chats[chatId], this.stage, 0)
		}
		cutscene.start()
	} else requestAnimationFrame(waitUntilLoaded)
}

function loaded() {
	stage.resize(null, window.innerWidth, window.innerHeight / 2)
	window.onresize = () => {
		stage.resize(null, window.innerWidth, window.innerHeight / 2)
	}
	document.getElementById('start-button').disabled = false
}

function chatter(callback, target, chat, stage, textPos) {
	if (chatClicked && textPos < chat.message.length) {
		textPos = chat.message.length
		chatClicked = false
	}
	if (textPos++ > chat.message.length) {
		stage.getPuppet(target).setBabbling(false)
		if (chatClicked) {
			document.getElementById('current_chat').style.display = 'none'
			callback()
		}
		else setTimeout(() => {chatter(callback, target, chat, stage, textPos)}, 1)
	} else {
		document.getElementById('message').innerText = chat.message.substring(0, textPos) + "_"
		setTimeout(() => {chatter(callback, target, chat, stage, textPos)}, 20)
	}
}

function stopCutscene() {
	chatClicked = true
	document.getElementById('chatbox').className = "chatbox inactive"
	callback()
}

window.addEventListener('click', () => {
	chatClicked = true
})
