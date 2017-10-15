// Variables
let chatClicked = false // whether or not the chatbox has been clicked
let cutsceneIndex
let callback // callback to call after running the current cutscene

// Load the stage and characters and stuff
// Less than ideal process, but I don't know how to load JSON client side
let stage

let puppets = {
	fox: {"deadbonesStyle":true,"body":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:30","x":29,"y":-157,"rotation":0,"scaleX":1,"scaleY":1}],"head":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:29","x":33,"y":-157,"rotation":0,"scaleX":1,"scaleY":1}],"hat":[],"mouths":[4,11,5,7,10,8],"eyes":[11,0,1,3,7,6],"emotes":[{"enabled":true,"mouth":[],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":33,"y":-157,"rotation":0,"scaleX":1,"scaleY":1}],"name":"default"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:32","x":82,"y":-162,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":32,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"name":"happy"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:27","x":60,"y":-160,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":45,"y":-135,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:28","x":42,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"name":"wink"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:23","x":32,"y":-156,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":24,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":29,"y":-162,"rotation":0,"scaleX":1,"scaleY":1}],"name":"kiss"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:22","x":34,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":32,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:26","x":30,"y":-150,"rotation":0,"scaleX":1,"scaleY":1}],"name":"angry"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":24,"y":-152,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":34,"y":-140,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":32,"y":-132,"rotation":0,"scaleX":1,"scaleY":1}],"name":"sad"},{"enabled":true,"mouth":[],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":34,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:28","x":32,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"name":"ponder"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:34","x":109,"y":-165,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":35,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":34,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"name":"gasp"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:34","x":49,"y":-157,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":19,"y":-155,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":30,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:26","x":28,"y":-146,"rotation":0,"scaleX":1,"scaleY":1}],"name":"veryangry"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:22","x":-16,"y":-144,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:24","x":34,"y":-136,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":40,"y":-122,"rotation":0,"scaleX":1,"scaleY":1}],"name":"verysad"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:22","x":0,"y":-150,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:28","x":36,"y":-153,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":36,"y":-154,"rotation":0,"scaleX":1,"scaleY":1}],"name":"confused"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:23","x":32,"y":-156,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":18,"y":-154,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":33,"y":-162,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:24","x":26,"y":-173,"rotation":0,"scaleX":1,"scaleY":1}],"name":"ooo"}],"props":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:37","x":-104,"y":-215,"rotation":-0.4433433627757828,"scaleX":1.042933810375671,"scaleY":0.964}],"name":"New Puppet","id":30,"position":1,"facingLeft":false,"emote":0},
	foxStatue: {"deadbonesStyle":true,"body":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:35","x":28,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"head":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:36","x":32,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"hat":[],"mouths":[4,11,5,7,10,8],"eyes":[11,0,1,3,7,6],"emotes":[{"enabled":true,"mouth":[],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":33,"y":-157,"rotation":0,"scaleX":1,"scaleY":1}],"name":"default"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:32","x":82,"y":-162,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":32,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"name":"happy"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:27","x":60,"y":-160,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":45,"y":-135,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:28","x":42,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"name":"wink"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:23","x":32,"y":-156,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":24,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":29,"y":-162,"rotation":0,"scaleX":1,"scaleY":1}],"name":"kiss"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:22","x":34,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":32,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:26","x":30,"y":-150,"rotation":0,"scaleX":1,"scaleY":1}],"name":"angry"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":24,"y":-152,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":34,"y":-140,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":32,"y":-132,"rotation":0,"scaleX":1,"scaleY":1}],"name":"sad"},{"enabled":true,"mouth":[],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":34,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:28","x":32,"y":-156,"rotation":0,"scaleX":1,"scaleY":1}],"name":"ponder"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:34","x":109,"y":-165,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":35,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":34,"y":-158,"rotation":0,"scaleX":1,"scaleY":1}],"name":"gasp"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:34","x":49,"y":-157,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":19,"y":-155,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":30,"y":-154,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:26","x":28,"y":-146,"rotation":0,"scaleX":1,"scaleY":1}],"name":"veryangry"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:22","x":-16,"y":-144,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:24","x":34,"y":-136,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:25","x":40,"y":-122,"rotation":0,"scaleX":1,"scaleY":1}],"name":"verysad"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:22","x":0,"y":-150,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:28","x":36,"y":-153,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":36,"y":-154,"rotation":0,"scaleX":1,"scaleY":1}],"name":"confused"},{"enabled":true,"mouth":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:23","x":32,"y":-156,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:33","x":18,"y":-154,"rotation":0,"scaleX":1,"scaleY":1}],"eyes":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:31","x":33,"y":-162,"rotation":0,"scaleX":1,"scaleY":1},{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:24","x":26,"y":-173,"rotation":0,"scaleX":1,"scaleY":1}],"name":"ooo"}],"props":[{"id":"055869ba-3404-45a3-8f39-21d2e96a90ac:38","x":-84,"y":-208,"rotation":-0.42735593833192964,"scaleX":1,"scaleY":1}],"name":"New Puppet","id":24,"position":1,"facingLeft":false,"emote":0}
}

let cutscenes = {
	intro: "delay 1000;\n" +
		"chat 0 0;\n" +
		"add fox 1 0;\n" +
		"emote 1 1;\n" +
		"move 1 2;\n" +
		"emote 1 5;\n" +
		"chat 0 1;\n" +
		"emote 1 7;\n" +
		"chat 0 2;\n" +
		"add fox 2 6;\n" + // TODO tower puppet
		"move 2 5;\n" +
		"add foxStatue 3 6;\n" +
		"emote 3 4;\n" +
		"move 3 4,\n" +
		"chat 0 3;\n" +
		"emote 1 5;\n" +
		"chat 1 4;\n" +
		"emote 3 8;\n" +
		"emote 1 9;\n" +
		"move 1 0,\n" +
		"move 3 0,\n" +
		"chat 0 5;\n" +
		"faceLeft 3 false;\n" +
		"emote 1 4;\n" +
		"move 1 -4,\n" +
		"chat 1 6;\n" +
		"faceLeft 1 false;\n" +
		"emote 3 4;\n" +
		"move 3 -2,\n" +
		"chat 1 7;\n" +
		"move 1 0,\n" +
		"move 2 6,\n" +
		"move 3 6;\n" +
		"remove 1;\n" +
		"remove 2;\n" +
		"remove 3;",
	startLevel1: "delay 1000;\n" +
		"add fox 1 0;\n" +
		"emote 1 4;\n" +
		"add fox 2 0;\n" + // TODO wolf
		"emote 2 8;\n" +
		"add fox 3 0;\n" + // TODO bear
		"add fox 4 6;\n" + // TODO tower
		"move 1 1,\n" +
		"move 2 2,\n" +
		"move 3 3,\n" +
		"move 4 5,\n" +
		"chat 0 8;\n" +
		"move 1 3,\n" +
		"move 2 1,\n" +
		"move 3 2;\n" +
		"move 1 2,\n" +
		"move 2 3,\n" +
		"move 3 1,\n" +
		"chat 0 9;\n" +
		"chat 2 10;\n" +
		"move 4 6,\n" +
		"move 3 6,\n" +
		"move 2 6,\n" +
		"move 1 6;\n" +
		"remove 1;\n" +
		"remove 2;\n" +
		"remove 3;\n" +
		"remove 4;",
	endLevel1: "delay 1000;\n" +
		"add fox 1 0;\n" + // TODO bear
		"emote 1 1;\n" +
		"add fox 2 0;\n" + // TODO wolf
		"emote 2 2;\n" +
		"add fox 3 0;\n" + // TODO rabbit
		"add fox 4 0;\n" +
		"emote 4 1;\n" +
		"move 1 1,\n" +
		"move 2 2,\n" +
		"move 3 3,\n" +
		"move 4 4;\n" +
		"chat 0 11;\n" +
		"emote 3 11;\n" +
		"faceLeft 2;\n" +
		"faceLeft 3;\n" +
		"faceLeft 4;\n" +
		"chat 1 12;\n" +
		"emote 3 7;\n" +
		"faceLeft 1 false;\n" +
		"faceLeft 2 false;\n" +
		"faceLeft 3;\n" +
		"faceLeft 4;\n" +
		"chat 3 13;\n" +
		"emote 1 1;\n" +
		"emote 2 1;\n" +
		"emote 3 1;\n" +
		"chat 2 14;\n" +
		"move 2 5;\n" +
		"move 4 6,\n" +
		"move 3 6,\n" +
		"move 2 6,\n" +
		"move 1 6;\n" +
		"remove 1;\n" +
		"remove 2;\n" +
		"remove 3;\n" +
		"remove 4;\n"
}

let scripts = [
	// Intro: Starting at index 0
	"In a strange forest at the break of daylight, the animals were happy and all was alright.",
	"Yet on a walk through a grassy green glade, a curious animal became quite afraid!",
	"Where once was the road to the watering spot, now stands walls of stone, a path there is not.",
	"The top of these towers held creatures of stone, who watched the approach with rocks nearly thrown.",
	"“But where will we drink?” the critter exclaimed.  “How could you come and destroy this terrain!”",
	"With nothing received but bashes near deathly, the critter ran home with speed quite expressly.",
	"But not before muttering a terrible promise, “I warn you, you demons, that I am quite honest.”",
	"“When I next appear, prepare your defense, for I will return with a Tower Offense!”",

	// Level 1 intro: Starting at index 8
	"As the critter had said, when the next day arose, it returned with its friends and a plan to bulldoze.",
	"They build their burrows and work all their farms, prepared to battle and to do some harm.",
	"“We’ve all come to drink and we will not find stall.  We’ll huff through your towers and blow down your wall!”",

	// Level 1 outro: Starting at index 11
	"The battle was bloody and all were quite shaken, but now they knew nothing from them could be taken.",
	"“I’m surprised we could do it, burst through that wall?  Perhaps we are not all that weak after all.”",
	"“Are we sure that we’re safe?  Those stones really hurt.”  A small critter added while staying alert.",
	"“We’ve passed through the worst, we mustn’t look back.  Lucky they don’t know we’re best in a pack.”"

	// Level 2 intro: Starting at index 15
]

window.loadBabble = function() {
	stage = new babble.Stage("screen", {
	  "numCharacters": 5,
	  "puppetScale": 1
	}, {"165e1af4-93ac-4566-a5eb-bddb4fbcd16c:11":{"name":"body","location":"165e1af4-93ac-4566-a5eb-bddb4fbcd16c/11.png","tab":"shirts","version":0},"165e1af4-93ac-4566-a5eb-bddb4fbcd16c:12":{"name":"head","location":"165e1af4-93ac-4566-a5eb-bddb4fbcd16c/12.png","tab":"skin","version":0},"055869ba-3404-45a3-8f39-21d2e96a90ac:23":{"tab":"New Asset List (5)","type":"sprite","version":0,"panning":[],"name":"mouth4","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\23.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:22":{"tab":"New Asset List (4)","type":"sprite","version":0,"panning":[],"name":"mouth3","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\22.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:24":{"tab":"New Asset List (6)","type":"sprite","version":0,"panning":[],"name":"mouth5","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\24.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:25":{"tab":"New Asset List (7)","type":"sprite","version":0,"panning":[],"name":"mouth6","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\25.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:26":{"tab":"New Asset List (8)","type":"sprite","version":0,"panning":[],"name":"mouth7","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\26.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:27":{"tab":"New Asset List (9)","type":"sprite","version":0,"panning":[],"name":"mouth8","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\27.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:28":{"tab":"New Asset List (10)","type":"sprite","version":0,"panning":[],"name":"mouth9","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\28.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:29":{"tab":"New Asset List (11)","type":"sprite","version":0,"panning":[],"name":"12","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\29.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:30":{"tab":"New Asset List (12)","type":"sprite","version":0,"panning":[],"name":"11","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\30.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:31":{"tab":"New Asset List (13)","type":"sprite","version":0,"panning":[],"name":"eyes","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\31.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:32":{"tab":"New Asset List","type":"sprite","version":0,"panning":[],"name":"mouth10","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\32.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:33":{"tab":"New Asset List (1)","type":"sprite","version":0,"panning":[],"name":"mouth1","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\33.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:34":{"tab":"New Asset List (2)","type":"sprite","version":0,"panning":[],"name":"mouth2","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\34.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:35":{"tab":"New Asset List (14)","type":"sprite","version":0,"panning":[],"name":"grey1","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\35.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:36":{"tab":"New Asset List (15)","type":"sprite","version":0,"panning":[],"name":"grey2","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\36.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:37":{"tab":"New Asset List (16)","type":"sprite","version":0,"panning":[],"name":"tail","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\37.png"},"055869ba-3404-45a3-8f39-21d2e96a90ac:38":{"tab":"New Asset List (3)","type":"sprite","version":0,"panning":[],"name":"grey3","location":"055869ba-3404-45a3-8f39-21d2e96a90ac\\38.png"}}, "assets", loaded);
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
			document.getElementById('current_chat').style.display = 'block'
			chatClicked = false
			chatter(callback, target, scripts[chatId], this.stage, 0)
		}
		cutscene.actions.faceLeft = function(callback, target, faceLeft) {
			let puppet = this.stage.getPuppet(target)
			puppet.facingLeft = faceLeft !== "false"
			puppet.container.scale.x = puppet.facingLeft ? -1 : 1
			callback()
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
	if (chatClicked && textPos < chat.length) {
		if (target && stage.getPuppet(target)) stage.getPuppet(target).setBabbling(false)
		textPos = chat.length
		chatClicked = false
	}
	if (textPos++ > chat.length) {
		if (chatClicked) {
			document.getElementById('current_chat').style.display = 'none'
			callback()
		}
		else setTimeout(() => {chatter(callback, target, chat, stage, textPos)}, 1)
	} else {
		if (target && stage.getPuppet(target)) {
			if (chat.charAt(textPos - 1) === '“')
				stage.getPuppet(target).setBabbling(true)
			else if (chat.charAt(textPos - 1) === '”')
				stage.getPuppet(target).setBabbling(false)
		}
		document.getElementById('message').innerText = chat.substring(0, textPos) + "_"
		setTimeout(() => {chatter(callback, target, chat, stage, textPos)}, 40)
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
