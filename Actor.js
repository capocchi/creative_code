class Actor {
  constructor(name, x, y, d) {
    this.name = name;
    this.x = x;
    this.y = y;
		this.d = d;
		this.c = null;
		this.fill_color = color(0, 0, 0);
		this.text_color = color(0, 0, 0);
		// start the song when the start button is pressed
		this.muted = false;
		this.song = null;
		this.fft = null;
  }
	
	drawCircle() {
		// petit cercle
		stroke(255);
		strokeWeight(2);
		if (this.muted) {
			this.fill_color = color(255,0,0);
		} else {
			this.fill_color = color(0,0,0);
		}
		fill(this.fill_color);
		//setLineDash([10, 10]); //longer stitches
		this.c = ellipse(this.x, this.y, 60, 60);
		// ajouter un texte centré dans le cercle
  	push();
		//drawingContext.setLineDash([0]);
		textSize(24);
  	textAlign(CENTER, CENTER);
  	//fill(0,0,0);
  	text(this.name, this.x, this.y);
		pop();
	}
	
	drawSprectum(){
		
		if (this.fft) {
			let spectrum = this.fft.analyze();
			// Save the current state (translation/rotation/etc)
			//push();
			// Translate to the origin of the shape
			//translate(xoffset, yoffset);
			// Rotate around the origin
			//rotate(millis() / 1000 * PI / 2);

			beginShape();
			for (var i = 0; i < spectrum.length; i++){
				var angle = map(i, 0, spectrum.length, 0, 360);
				var amp = spectrum[i];
				fill(0, 0, 0);
				var r = map(amp, 0, 256, this.d, 100);
				var x = r * cos(angle);
				var y = r * sin(angle);
			//  stroke(i, 255,255);
				//line(0,0,x,y);
				vertex(this.x+x,this.y+y);
				// var y = map(amp, 0, 256, height, 0);
				// fill(i, 255, 255);
				// rect(i * w, y, w , height - y);
			}			
			endShape();
			
			// ajouter un texte centré dans le cercle
			//drawingContext.setLineDash([0]);
			textSize(24);
  		textAlign(CENTER, CENTER);
  		//fill(0,0,0);
  		text(this.name, this.x, this.y);
		} else {
			console.log("FFT not defined");
		}
	}

	setSong(song){
		this.song = song;
	}
	
	getSong(){
		return this.song;
	}
	
	setFFT(fft){
		this.fft = fft;
	}
	
	getFFT(){
		return this.fft;
	}
}