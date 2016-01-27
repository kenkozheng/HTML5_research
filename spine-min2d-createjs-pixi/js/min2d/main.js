
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
	this.xhr.send();
}

function atlasLoadHandler(event) {
	this.atlas = this.xhr.response;
    this.image = new Image();
    this.image.onload = this.imageLoadHandler.bind(this);
    this.image.src = "data/skeleton.png";
}

function imageLoadHandler() {
	this.xhr = new XMLHttpRequest();
	this.xhr.open("GET", "data/skeleton.json", true);
	this.xhr.onload = this.skeletonLoadHandler.bind(this);
	this.xhr.send();
}

function skeletonLoadHandler (event) {
    var stage = this.stage = new min2d.Stage(this.canvas, 30);
    var dancer = this.dancer = new min2d.Spine(this.atlas, this.xhr.response, this.image);
    stage.addChild(dancer);
    dancer.scaleX = dancer.scaleY = 0.8;
    dancer.x = this.canvasWidth/2;
    dancer.y = this.canvasHeight/2;

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
					dancer.stateData.setMixByName(moves[j], moves[k], 0.2);
				}
			}
		}

	}

    this.setSelectedStyle(this.genres[0]);
}

function doRandomDanceMove() {
	clearTimeout(this.danceMoveTimeOut);
	
	var move = this.selectedMoves.pop();
	this.dancer.state.addAnimationByName(0, move, true, 0);
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

function radioClick(event) {
    var value = event.target.value;
    var selected;
    for (var i = 0; i < this.genres.length; i++) {
        if (this.genres[i].id == value) {
            this.setSelectedStyle(this.genres[i]);
        }
    }
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
