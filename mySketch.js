//https://nishanc.medium.com/audio-visualization-in-javascript-with-p5-js-cf3bc7f1be07

var fft1, fft2, fft3;

let diam // diametre du cercle
let centerX // coordonnée x du centre du cercle
let centerY // coordonnée y du centre du cercle
let a1, a2, a3;

let song1, song2, song3;

var songs, actors;

let sel, button_start, button_reload;

function preload() {
  soundFormats('mp3', 'ogg');
	songs = {
	"Magnificat": [loadSound('Magnificat-Seconda.mp3'), loadSound('Magnificat-Bassu.mp3'), loadSound('Magnificat-Terza.mp3')],
  "Laudate-Dominum": [loadSound('Laudate-Dominum-Seconda.mp3'), loadSound('Laudate-Dominum-Bassu.mp3'), loadSound('Laudate-Dominum-Terza.mp3')]
	};
	
	song1 = songs["Magnificat"][0];
	song2 = songs["Magnificat"][1];
	song3 = songs["Magnificat"][2];
	
}

function isMouseInCircle(x, y, radius) {
  return dist(mouseX, mouseY, x, y) < radius
}

function isMouseInBox(x, y, w, h){
	return (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y + h);
}

function createMetaTag() {
	let meta = createElement('meta');
	meta.attribute('name', 'viewport');
	meta.attribute('content', 'user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height');

	let head = select('head');
	meta.parent(head);
}

function setup() {
	createMetaTag();
	cnv = createCanvas(window.innerWidth, window.innerHeight);
	
	colorMode(RGB);
  angleMode(DEGREES);
	background(100);
	
	// init the User Inteface (button, select, etc.)
	initUI();
	
	// define the large circle
	diam = 300;
	centerX = width/2; 
	centerY = height/2;
	
	// instanciate Actors
	initActors();
		
	// Event handler
	cnv.doubleClicked(onDBClick);
}

function initUI(){
	// UI
	let controls = createElement('div');
  controls.style('display', 'flex');
  controls.position(20, 20);
	
	button_start = createButton('Start');
	//button_start.style('background-color', col);
  button_start.mouseClicked(onStartStopBtnClick);
  button_start.parent(controls);
	
	sel = createSelect();
  sel.option('Magnificat');
  sel.option('Laudate-Dominum');
  sel.changed(mySelectEvent);
	sel.parent(controls);
	
	button_reload = createButton('Reload');
	button_reload.mouseClicked(onReload);
	button_reload.parent(controls);
}

function initActors(){
	
	// instanciate the Actor "Seconda" and add the song
	let angle1 = -150;
	let x1 = centerX + diam/2 * cos(angle1);
	let y1 = centerY + diam/2 * sin(angle1);
	a1 = new Actor("S",x1,y1,30);
	a1.setSong(song1);
	
	// instanciate the Actor "Bassu" and add the song
	let angle2 = -230;
  let x2 = centerX + diam/2 * cos(angle2);
  let y2 = centerY + diam/2 * sin(angle2);	
	a2 = new Actor("B",x2,y2,30);
	a2.setSong(song2);
	
	// instanciate the Actor "Terza" and add the song
	let angle3 = 0;
  let x3 = centerX + diam/2 * cos(angle3);
  let y3 = centerY + diam/2 * sin(angle3);
	a3 = new Actor("T",x3,y3,30);
	a3.setSong(song3);
		
	// define FFT
	//https://p5js.org/examples/sound-frequency-spectrum.html
	fft1 = new p5.FFT(0.4, 512);
	fft1.setInput(song1);
	a1.setFFT(fft1);
	
	fft2 = new p5.FFT(0.4, 512);
	fft2.setInput(song2);
	a2.setFFT(fft2);
	
	fft3 = new p5.FFT(0.4, 512);
	fft3.setInput(song3);
	a3.setFFT(fft3);
	
	actors = [a1,a2,a3];

}

function onReload(){
	if (song1.isPlaying()){
			song1.stop();
	}
	if (song2.isPlaying()){
			song2.stop();
	}
	if (song3.isPlaying()){
			song3.stop();
	}
	// reinit the UI
	initUI();	
	initActors();
}

function onStartStopBtnClick(){
	if (!song1.isPlaying()) {
      song1.play();
			let val = int(!a1.muted)*(diam-dist(a1.x, a1.y, centerX, centerY))/1000
			song1.setVolume(val);
    } else {
      song1.stop();
    }
		if (!song2.isPlaying()) {
      song2.play();
			let val = (diam-dist(a2.x, a2.y, centerX, centerY))/1000
			song2.setVolume(val);
    } else {
      song2.stop();
    }
		if (!song3.isPlaying()) {
      song3.play();
			let val = (diam-dist(a3.x, a3.y, centerX, centerY))/1000
			song3.setVolume(val);
    } else {
      song3.stop();
    }
		
		if (song1.isPlaying() && song2.isPlaying() && song3.isPlaying()) {
			button_start.html('Stop');
			//sel.disable();
		} else {
			button_start.html('Start');
			//initUI();
		}
}

// allows the mute of the song with the doubleClick
function onDBClick(){

	actors.forEach(function(actor) {
		// if double click in the circle
		if (isMouseInCircle(actor.x,actor.y,actor.d)) {
			// update the mute attribut of the Actor 
			actor.muted = !actor.muted;
			let val = (diam-dist(actor.x, actor.y, centerX, centerY))/1000;
			// mute or unmute
			actor.getSong().setVolume(val*int(!actor.muted));
		}

	});
	
}

// populate the select tag
function mySelectEvent() {
  let item = sel.value();
	switch (item) {
    case "Magnificat":
			console.log('Magnificat');
      song1 = songs["Magnificat"][0];      
			song2 = songs["Magnificat"][1];
			song3 = songs["Magnificat"][2];
			break;
    case "Laudate-Dominum":
      song1 = songs["Laudate-Dominum"][0];
			song2 = songs["Laudate-Dominum"][1];
			song3 = songs["Laudate-Dominum"][2];
			break;
    default:
      //  
	}
	initActors();
}

// for the drag and drop function
function mouseDragged() {
	
	actors.forEach(function(actor) {
		// if mouse collides circle
		if (isMouseInCircle(actor.x,actor.y,actor.d)) {
			let actor_collided = null;
			actors.forEach(function(other) {
				if (other != actor) {
					// now see if distance between two is less than sum of two radius'
					let d = dist(actor.x, actor.y, other.x, other.y);
					// find the actor collided
					if (d <= actor.d + other.d) {
						actor_collided = other;
					}
				}
			});
			// if actor collided is founded
			if (actor_collided == null){		
  			// change the position of the Actor depending on the mouse position
				actor.x = mouseX;
				actor.y = mouseY;
			}else{
				// rebound on the actor collided
				if (actor_collided.x > actor.x){
					actor.x -=1;
				} else {
					actor.x +=1;
				}
				if (actor_collided.y > actor.y){
					actor.y -=1;
				} else {
					actor.y +=1;
				}
			}
			
			// song change when the actor is near of the center fof the big circle
			let val = (diam-dist(actor.x, actor.y, centerX, centerY))/1000;
			if (val<0) {
				val=0;
			}
			actor.song.setVolume(val*int(!actor.muted));
	}

	});
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function draw() {
	
	// grand cercle en lignes discontinues
	push();
	background(0);
	stroke(255);
  strokeWeight(2);
  noFill();
	setLineDash([10, 10]); //longer stitches
  ellipse(centerX, centerY, diam, diam);
	pop();
	
	// display the circle before starting and the spectrum diagram for each song during the execution off the app	
	actors.forEach(function(actor) {
		(actor.getSong().isPlaying() && !actor.muted) ? actor.drawSprectum() : actor.drawCircle();
	});
	
}