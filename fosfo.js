var Fosfo = function(canvas)
{
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.images = {};
	this.imagesDrawed = [];
	this.textDrawed = [];
	this.fps = 60;
	this.x = 0;
    this.y = 0;
    
    this.addImage = function(key, im) {
        let img = {'name': null, 'key': key, 'image': im, 'x': 0, 'y': 0, 'isloaded': false, 'id': null, 'rotate': null};
        img.isloaded = true;
        img.width = im.width;
        img.height = im.height;
        this.images[img.key] = img;
    }
	
	this.loadimage = function(urls) {
		urls = (typeof urls != "object") ? [urls] : urls;
		let loadedimages = 0;
		let resultFunction = () => {};
		const tmp = this;
		const imageloadpost = () => {
			loadedimages++;
			if (loadedimages == urls.length){
				resultFunction(tmp.images);
			}
		}
		for (let i=0; i < urls.length; i++)
		{
			this.addImage(urls[i].split("/").slice(-1)[0], (() => {
				let im = new Image();
				im.src = urls[i];
				im.onload = function() {
					console.log(`IMG ${this.src} loaded`);
					var ddd = tmp.images[this.src.split("/").slice(-1)[0]];
					ddd.isloaded = true;
					ddd.width = this.width;
					ddd.height = this.height;
					imageloadpost();
				}
				im.onerror = function() {
					console.warn(`IMG ${this.src} not found`);
					imageloadpost()
				}
				return im;
			})());
		}
		return { done: (f) => resultFunction = f || resultFunction }
	}
	
	this.clear = function() {
		this.imagesDrawed = [];
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.setFramesToImg = function(filename, fw, fh) {
		var img = this.images[filename];
		if (img !== undefined) {
			img.fw = fw;
			img.fh = fh;
		}
		return img;
	}
	
	this.drawframe = function(name, filename, id, dx, dy, dLargeur, dHauteur, drotate) {
		var img = this.images[filename];
		if (img === undefined) {
			return ;
		}
		if (img.isloaded == false) { // if image are not loaded draw to next frame
			const tmp = this;
			setTimeout(function() {
				tmp.drawframe(name, filename, id, dx, dy);
			}, 1000 / this.fps);
			return ;
		}
		let sizew = img.image.width / img.fw;
		let sizeh = img.image.height / img.fh;
		let total = img.fw * img.fh;
		
		img.id = id;
		if (id > total) id = 0;
		let line = 0;
		while (id >= img.fw) {
			line++;
			id -= img.fw;
		}
		dLargeur = typeof dLargeur !== 'undefined' ? dLargeur : sizew;
		dHauteur = typeof dHauteur !== 'undefined' ? dHauteur : sizeh;
		drotate = typeof drotate !== 'undefined' ? drotate : null;
		return this.draw(name, filename, dx, dy, dLargeur, dHauteur, id * sizew, line * sizeh, sizew, sizeh, drotate);
	}
	
	//void ctx.drawImage(image, dx, dy);
	//void ctx.drawImage(image, dx, dy, dLargeur, dHauteur);
	//void ctx.drawImage(image, sx, sy, sLargeur, sHauteur, dx, dy, dLargeur, dHauteur);
	this.draw = function(name, filename, dx, dy, dLargeur, dHauteur, sx = 0, sy = 0, sLargeur, sHauteur, drotate) {
		var img = this.images[filename];
		if (img === undefined) {
			console.log("IMG draw error " + filename + " === undefined");
			img = this.loadimage(filename);
		}
		if (img.isloaded == false) {
			var tmp = this;
			setTimeout(function() {
				tmp.draw(name, filename, dx, dy, dLargeur, dHauteur, sx, sy, sLargeur, sHauteur);
			}, 1000 / this.fps);
			return (img);
		}
		img.name = name;
		img.width = typeof dLargeur !== 'undefined' ? dLargeur : img.image.width;
		img.height = typeof dHauteur !== 'undefined' ? dHauteur : img.image.height;
		img.sLargeur = typeof sLargeur !== 'undefined' ? sLargeur : img.image.width;
		img.sHauteur = typeof sHauteur !== 'undefined' ? sHauteur : img.image.height;
		img.rotate = typeof drotate !== 'undefined' ? drotate : null;
		img.sx = sx;
		img.sy = sy;
		img.x = dx;
		img.y = dy;
		var onctx = this.cloneObj(img);
		this.imagesDrawed.push(onctx);
		return (onctx);
	};
	
	this.update = function () {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var tmp = this;
		this.imagesDrawed.forEach(function(value) {
			if (value.rotate != null) {
				tmp.updaterotate(value);
			} else {
				tmp.ctx.drawImage(value.image, value.sx, value.sy, value.sLargeur,
					value.sHauteur, tmp.x + value.x, (tmp.y + value.y), value.width, value.height);
			}
		});
		this.update_drawed_text();
	}
	
	this.updaterotate = function (value) {
		const rad = value.rotate * Math.PI / 180 || 0;
		
		this.ctx.save();
		// set to image center designed by v
		// ------------------------
		// -------o---o------------
		// ---------v--------------
		// -------o---o------------
		// ------------------------
		this.ctx.translate((value.width/2) + value.x, (value.height/2) + value.y);
		this.ctx.rotate(rad); // rotate v to angle you want
		// set to left top of image size designed by v
		// ------------------------
		// -------v---o------------
		// ------------------------
		// -------o---o------------
		// ------------------------
		this.ctx.translate(-(value.width/2), -(value.height/2));
		this.ctx.drawImage(value.image, value.sx, value.sy, value.sLargeur, value.sHauteur, 0, 0, value.width, value.height);//draw image to v left top of image size
		this.ctx.restore();
	}
	
	this.undraw = function(names = []) {
		if (!Array.isArray(names)) {
			names = [names];
		}
		var tmp = this;
		names.forEach((name) => {
			let img = tmp.imagesDrawed.filter(x => x.name == name)[0];
			let text = tmp.textDrawed.filter(x => x.name == name)[0];
			if (text != undefined) {
				tmp.ctx.clearRect(text.x, text.y, text.width, text.height);
				tmp.textDrawed.splice(tmp.textDrawed.indexOf(text), 1);
				if (img == undefined)
					return ;
			} else if (img == undefined) {
				setTimeout(function(){tmp.undraw(name);}, 2000);
				return ;
			}
			tmp.ctx.clearRect(img.x, img.y, img.width, img.height);
			tmp.imagesDrawed.splice(tmp.imagesDrawed.indexOf(img), 1);
		});
	}
	
	this.undrawimg = function(img) {
		this.ctx.clearRect(img.x, img.y, img.width, img.height);
		this.imagesDrawed.splice(this.imagesDrawed.indexOf(img), 1);
	}
	
	this.getelementPos = function(x, y) {
		x += 10;
		for (let i = 0; i < this.imagesDrawed.length; i++)
		{
			if (x > this.imagesDrawed[i].x && x < (this.imagesDrawed[i].x + this.imagesDrawed[i].width)
				&& y > this.imagesDrawed[i].y && y < (this.imagesDrawed[i].y + this.imagesDrawed[i].height))
			{
				return (this.imagesDrawed[i]);
			}
		}
		return (null);
	}
	this.drawtext = function(name, text, x, y, size, color, font) {
		font = typeof font !== 'undefined' ? font : "Arial";
		size = typeof size !== 'undefined' ? size : 10;
		color = typeof color !== 'undefined' ? color : "black";
		let textdraw = {'name': name, 'text': text, 'x': x, 'y': y, 'size': size, 'color': color, 'font': font};
		let clone = this.cloneObj(textdraw);
		this.textDrawed.push(clone);
	}

	this.update_drawed_text = function() {
		const tmp = this;

		this.textDrawed.forEach(function (value) {

			tmp.ctx.fillStyle = value.color;
			tmp.ctx.font = value.size + "px " + value.font;
			const metrics = tmp.ctx.measureText(value.text);
			value.width = metrics.width;
			value.height = metrics.height;
			tmp.ctx.fillText(value.text, value.x, value.y);
		});
	}
	this.img = function() {
		let image = new Image();
		image.id = "pic"
		image.src = this.canvas.toDataURL();
		return (image);
	};
	
	this.cloneObj = function(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		let copy = obj.constructor();
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
};