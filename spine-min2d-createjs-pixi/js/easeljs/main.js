
function init() {
	this.canvasWidth = 640;
	this.canvasHeight = 671;
	
	this.wrapper = document.getElementById("wrapper");
	this.wrapper.style.width = this.canvasWidth + "px";
	this.wrapper.style.height = this.canvasHeight + "px";
	
	this.bg = document.getElementById("bg");
	
	this.canvas = document.getElementById("canvas");
	this.canvas.width = this.canvasWidth;
	this.canvas.height = this.canvasHeight;
	
	this.inputs = document.getElementById("inputs");
	
	this.xhr = new XMLHttpRequest();
	this.xhr.open("GET", "data/skeleton.atlas", true);
	this.xhr.onload = this.atlasLoadHandler.bind(this);
	this.xhr.onprogress = this.atlasProgressHandler.bind(this);
	this.xhr.send();
}

function atlasProgressHandler (event) {
	var progress = event.loaded / event.total;
	//console.log(progress);
}

function atlasLoadHandler(event) {
	this.atlas = new spine.Atlas(this.xhr.response, {load:this.textureLoaderLoad.bind(this), unload:this.textureLoaderUnLoad.bind(this)});
}

function textureLoaderUnLoad(texture) {
	this.texture.destroy();
}

function textureLoaderLoad(page, path, atlas) {
	this.page = page;
	this.path = path;
	this.atlas = atlas;

	this.image = new Image();
	this.image.onload = this.imageLoadHandler.bind(this);
	this.image.src = "data/" + path;
}

function imageLoadHandler() {
	this.stage = new createjs.Stage(this.canvas);
	this.dancerContainer = new createjs.Container();
	this.stage.addChild(this.dancerContainer);
	
	this.dancer = new createjs.Container();
	this.dancer.scaleX = this.dancer.scaleY = 0.80;
	this.dancer.x = this.canvasWidth / 2;
	this.dancer.y = this.canvasHeight / 2 + 20;
	this.dancerContainer.addChild(this.dancer);
	this.containers = [];
	for (var i = 0; i < this.atlas.regions.length; i++) {
		var region = this.atlas.regions[i];
		
		var canvas = document.createElement("canvas");
		canvas.id = region.name;
		canvas.width = region.width;
		canvas.height = region.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, -region.x, -region.y);

		var container = new createjs.Container();
		var rotationContainer = new createjs.Container();
		rotationContainer.name = "rotationContainer";
		container.addChild(rotationContainer);
		var bitmap = new createjs.Bitmap(canvas);
		bitmap.name = "bitmap";
		bitmap.x = region.width / -2;
		bitmap.y = region.height / -2;
		rotationContainer.addChild(bitmap);
		container.name = region.name;
		this.dancer.addChild(container);
		this.containers.push(container);
	}
	
	this.xhr = new XMLHttpRequest();
	this.xhr.open("GET", "data/skeleton.json", true);
	this.xhr.onload = this.skeletonLoadHandler.bind(this);
	this.xhr.onprogress = this.skeletonProgressHandler.bind(this);
	this.xhr.send();
}

function skeletonProgressHandler (event) {
	var progress = event.loaded / event.total;
	//console.log(progress);
}

function skeletonLoadHandler (event) {
	var jsonSkeleton = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.atlas));
	this.skeletonData = jsonSkeleton.readSkeletonData(eval("(" + this.xhr.response + ")"));
	
	spine.Bone.yDown = true;

	this.skeleton = new spine.Skeleton(skeletonData);
	this.skeleton.updateWorldTransform();

	this.stateData = new spine.AnimationStateData(this.skeletonData);
	this.state = new spine.AnimationState(this.stateData);
	
	var hiphop = {id:"hiphop", title:"Hip Hop", url:"http://d3se77qc9hn1xi.cloudfront.net/pocket_dancer_music/hiphop.mp3", bpm:96, battleURL:"http://d3se77qc9hn1xi.cloudfront.net/pocket_dancer_music/hiphopBattle.mp3"}
	hiphop.moves = ["hiphop01","hiphop02","hiphop03","hiphop04","hiphop05","hiphop06","hiphop07"];
	hiphop.idle = "hiphopIdle";
	
	var disco = {id:"disco", title:"Disco", url:"http://d3se77qc9hn1xi.cloudfront.net/pocket_dancer_music/disco.mp3", bpm:126, battleURL:"http://d3se77qc9hn1xi.cloudfront.net/pocket_dancer_music/discoBattle.mp3"}
	disco.moves = ["disco01","disco02","disco03","disco04","disco05","disco06","disco07", "disco08", "disco09", "disco10"];
	disco.idle = "discoIdle";
	
	var showgirl = {id:"showgirl", title:"Showgirl", url:"http://d3se77qc9hn1xi.cloudfront.net/pocket_dancer_music/showgirl.mp3", bpm:180, battleURL:"http://d3se77qc9hn1xi.cloudfront.net/pocket_dancer_music/showgirlsBattle.mp3"}
	showgirl.moves = ["vegas01","vegas02","vegas03","vegas04","vegas05","vegas06", "vegas07", "vegas08"];
	showgirl.idle = "vegasIdle";
	
	this.genres = [hiphop, disco, showgirl];
	
	this.danceMoveTimeOut = 0;

	for (var i = 0; i < this.genres.length; i++) {
		var music = this.genres[i];

		var radioDiv = document.createElement("div");
		radioDiv.style.display = "inline";
		radioDiv.style.paddingLeft = "10px";
		radioDiv.style.paddingRight = "10px";
		var radio = document.createElement("input");
		radio.id = music.id;
		radio.type = "radio";
		radio.name = "music";
		radio.value = music.id;
		radio.onclick = radioClick.bind(this);
		radioDiv.appendChild(radio);
		var textNode = document.createTextNode(music.title);
		radioDiv.appendChild(textNode);
		this.inputs.appendChild(radioDiv);

		var moves = music.moves.slice();
		moves.push(music.idle);
		for (j = 0; j < moves.length; j++) {
			for (k = 0; k < moves.length; k++) {
				if (j != k) {
					this.stateData.setMixByName(moves[j], moves[k], 0.2);
				}
			}
		}

	}
	
	this.state.onEvent = this.stateEvent.bind(this);
	
	this.setSelectedStyle(this.genres[0]);
	
	window.onresize = this.windowResize.bind(this);
	windowResize(null);
	
	this.update();
}

function windowResize(event) {
	var scale = Math.min(this.canvasWidth, window.innerWidth) / this.canvasWidth;
	
	var newWidth = Math.floor(this.canvasWidth * scale);
	var newHeight = Math.floor(this.canvasHeight * scale);
	
	this.wrapper.style.width = newWidth + "px";
	this.wrapper.style.height = newHeight + "px";
	
	this.canvas.width = newWidth;
	this.canvas.height = newHeight;
	
	this.dancerContainer.scaleX = this.dancerContainer.scaleY = scale;
	
	this.update();
}

function radioClick(event) {
	var value = event.target.value;
	var selected;
	for (var i = 0; i < this.genres.length; i++) {
		if (this.genres[i].id == value) {
			this.setSelectedStyle(this.genres[i]);
		}
	}
}

function stateEvent(trackIndex, event) {
	//console.log(trackIndex + " event: " + event.data.name)
}

function doRandomDanceMove() {
	clearTimeout(this.danceMoveTimeOut);
	
	var move = this.selectedMoves.pop();
	this.state.addAnimationByName(0, move, true, 0);
	if (this.selectedMoves.length == 0) {
		this.selectedMoves = this.selectedMusic.moves.slice();
		shuffle(this.selectedMoves);
	}
	
	var beatsPerSecond = 60000 / this.selectedMusic.bpm;
	var bars = Math.floor(Math.random() * 5) + 4;
	var time = Math.round(bars * beatsPerSecond);
	this.danceMoveTimeOut = setTimeout(this.doRandomDanceMove.bind(this), time);
}
	
function doIdleDanceMove() {
	clearTimeout(this.danceMoveTimeOut);
	this.state.addAnimationByName(0, this.selectedMusic.idle, true, 0);
}
	
function setSelectedStyle(genre) {
	this.selectedMusic = genre;
	this.bg.innerHTML = "";
	var bgImage = new Image();
	bgImage.style.width = "100%";
	bgImage.style.height = "100%";
	bgImage.src = "img/" + genre.id + ".jpg";
	bgImage.className = "fill";
	this.bg.appendChild(bgImage);

	this.selectedMoves = this.selectedMusic.moves.slice();
	shuffle(this.selectedMoves);
	
	var radio = document.getElementById(genre.id);
	radio.checked = 1;
	
	this.doRandomDanceMove();
}

function shuffle(o) {
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function update() {
	this.lastTime = this.lastTime || Date.now();
	var delta = (Date.now() - this.lastTime) * 0.001;
	this.lastTime = Date.now();
	this.state.update(delta);
	this.state.apply(this.skeleton);
	this.skeleton.updateWorldTransform();
	
	var invisibleContainers = this.containers.slice();
	var drawOrder = this.skeleton.drawOrder;
	for (var i = 0, n = drawOrder.length; i < n; i++) {
		var slot = drawOrder[i];
		var attachment = slot.attachment;
		var name = attachment.name;
		var bone = slot.bone;
		var container = this.dancer.getChildByName(name);
		if (container) {
			var rotationContainer = container.getChildByName("rotationContainer");
			var bitmap = rotationContainer.getChildByName("bitmap");
			container.visible = true;
			container.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
			container.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
			container.scaleX = bone.worldScaleX;
			container.scaleY = bone.worldScaleY;
			container.rotation = -slot.bone.worldRotation;
			rotationContainer.rotation = -attachment.rotation;
			this.dancer.addChild(container);
			invisibleContainers.splice(invisibleContainers.indexOf(container), 1);
		}
	}
	for (var k in invisibleContainers) {
		invisibleContainers[k].visible = false;
	}
	this.stage.update();
	setTimeout(this.update.bind(this), 30);
}
