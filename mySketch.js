//https://nishanc.medium.com/audio-visualization-in-javascript-with-p5-js-cf3bc7f1be07

var fft1, fft2, fft3;

let diam // diametre du cercle
let centerX // coordonnée x du centre du cercle
let centerY // coordonnée y du centre du cercle
let a1, a2, a3;

let song1, song2, song3;
let reverb;

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
	let head = select('head');
	
	//let meta = createElement('meta');
	//meta.attribute('name', 'viewport');
	//meta.attribute('charset',"utf-8");
	//meta.attribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no');
	//meta.parent(head);
	
	// for pwa

	//let link0 = createElement('link');
	//link0.attribute('rel', 'canonical');
	//link0.attribute('href', 'https://capocchi.github.io/creative_code/');
	//link0.parent(head);

	//let link1 = createElement('link');
	//link1.attribute('rel', 'manifest');
	//link1.attribute('href', '/creative_code/manifest.json');
	//link1.parent(head);
	
	// for bootstrap
	let link2 = createElement('link');
	link2.attribute('rel', 'stylesheet');
	link2.attribute('type',"text/css");
	link2.attribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css');
	link2.attribute('integrity',"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm");
	link2.attribute('crossorigin',"anonymous");
	link2.parent(head);
	
	//favicon
	let link3 = createElement('link');
	link3.attribute('rel', 'shortcut icon');
	link3.attribute('href', 'favicon.ico');
	link3.attribute('type',"image/x-icon");
	link3.parent(head);

	let script1 =  createElement('script');
	script1.attribute('src', 'https://code.jquery.com/jquery-3.2.1.slim.min.js');
	script1.attribute('type', 'text/javascript');
	script1.attribute('integrity',"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN");
	script1.attribute('crossorigin',"anonymous");
	script1.parent(head);
	
	let script2 =  createElement('script');
	script2.attribute('src', 'https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js');
	script2.attribute('type', 'text/javascript');
	script2.attribute('integrity',"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q");
	script2.attribute('crossorigin',"anonymous");
	script2.parent(head);
	
	let script3 =  createElement('script');
	script3.attribute('src', 'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js');
	script3.attribute('type', 'text/javascript');
	script3.attribute('integrity',"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl");
	script3.attribute('crossorigin',"anonymous");
	script3.parent(head);
	
	
	
}

function touchEnded() {
	fullscreen(true);
}

function setup() {
	//loadStyle('style.css');
	
	createMetaTag();
	cnv = createCanvas(windowWidth, windowHeight, allowFullscreen=true); // Définit la taille initiale du canvas à 800x600 pixels
	
	colorMode(RGB);
  angleMode(DEGREES);
	background(100);
	
	// init the User Inteface (button, select, etc.)
	initUI();
	
	// define the large circle
	diam = width-100;
	if (diam > 600) {
		diam = 600;
	}
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
	controls.addClass("vh-100 container-fluid");
  	controls.position(20, 20);
	
	button_start = createButton('Start');
	//button_start.style('background-color', col);
  	button_start.addClass("btn btn-success mr-1");
	button_start.mouseClicked(onStartStopBtnClick);
  	button_start.parent(controls);
	
	sel = createSelect();
	sel.addClass("btn btn-secondary mr-1");
  	sel.option('Magnificat');
  	sel.option('Laudate-Dominum');
  	sel.changed(mySelectEvent);
	sel.parent(controls);
	
	button_reload = createButton('Reload');
	button_reload.addClass("btn btn-secondary mr-1");
	button_reload.mouseClicked(onReload);
	button_reload.parent(controls);
}

function initActors(){
	
	// Créer un objet de réverbération avec les paramètres souhaités
	reverb = new p5.Reverb();
	reverb.process(song1, 3, 2); // réverbération avec un temps de réverbération de 3 secondes et un niveau de 2
	reverb.process(song2, 3, 2); // réverbération avec un temps de réverbération de 3 secondes et un niveau de 2
	reverb.process(song3, 3, 2); // réverbération avec un temps de réverbération de 3 secondes et un niveau de 2

	// instanciate the Actor "Seconda" and add the song
	let angle1 = -150;
	let x1 = centerX + diam/2 * cos(angle1);
	let y1 = centerY + diam/2 * sin(angle1);
	a1 = new Actor("S",x1,y1,diam/10);
	a1.setSong(song1);
	
	// instanciate the Actor "Bassu" and add the song
	let angle2 = -230;
  let x2 = centerX + diam/2 * cos(angle2);
  let y2 = centerY + diam/2 * sin(angle2);	
	a2 = new Actor("B",x2,y2,diam/10);
	a2.setSong(song2);
	
	// instanciate the Actor "Terza" and add the song
	let angle3 = 0;
  let x3 = centerX + diam/2 * cos(angle3);
  let y3 = centerY + diam/2 * sin(angle3);
	a3 = new Actor("T",x3,y3,diam/10);
	a3.setSong(song3);
	
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

//function mousePressed() {
      
    // Set the value of fullscreen
    // into the variable
//    let fs = fullscreen();
      
    // Call to fullscreen function
//    fullscreen(!fs); 
//}

function onStartStopBtnClick(){
	if (!song1.isPlaying()) {
      	song1.loop();
		let val = int(!a1.muted)*(diam-dist(a1.x, a1.y, centerX, centerY))/1000
		song1.setVolume(val);
    } else {	
      	song1.stop();
    }
	
	if (!song2.isPlaying()) {
      	song2.loop();
		let val = (diam-dist(a2.x, a2.y, centerX, centerY))/1000
		song2.setVolume(val);
    } else {
      	song2.stop();
    }
	
	if (!song3.isPlaying()) {
      	song3.loop();
		let val = (diam-dist(a3.x, a3.y, centerX, centerY))/1000
		song3.setVolume(val);
    } else {
      song3.stop();
    }
		
	if (song1.isPlaying() && song2.isPlaying() && song3.isPlaying()) {
		button_start.html('Stop');
		button_start.class("btn btn-danger mr-1");
			//sel.disable();
	} else {
		button_start.html('Start');
		button_start.class("btn btn-success mr-1");
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
	
	// grand cercle en lignes discontinues et gris clair
	push();
	background(0);
	stroke(220, 220, 220, 60);
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