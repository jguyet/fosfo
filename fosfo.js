var fosfo = function(canvas)
{
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.images = [];
	this.imagesDrawed = [];
	this.textDrawed = [];
	this.fps = 60;
	this.x = 0;
    this.y = 0;
    
    this.addImage = function(key, im) {
        var img = {'name': null, 'url': key, 'image': im, 'x': 0, 'y': 0, 'isloaded': false, 'id': null, 'rotate': null};
        img.isloaded = true;
        img.width = im.width;
        img.height = im.height;
        this.images.push(img);
    }
	
	this.loadimage = function(urls)
	{
		var loadedimages=0;
		var postaction=function(){};
		var urls = (typeof urls != "object") ? [urls] : urls;
		var tmp = this;
		function imageloadpost()
		{
			loadedimages++;
			if (loadedimages==urls.length){
				postaction(tmp.images);
			}
		}
		for (var i=0; i < urls.length; i++)
		{
			var im = new Image();
			im.src = urls[i];
			var img = {'name': null, 'url': urls[i], 'image': im, 'x': 0, 'y': 0, 'isloaded': false, 'id': null, 'rotate': null};
			this.images.push(img);
			var tmp = this;
			im.url = urls[i];
			im.onload = function()
			{
				console.log("IMG " + this.url + " loaded.");
				var ddd = tmp.images.filter(x => x.url == this.url)[0];
				ddd.isloaded = true;
				ddd.width = this.width;
				ddd.height = this.height;
				imageloadpost();
			}
			im.onerror = function()
			{
				imageloadpost()
			}
		}
		return {
			done:function(f){
				postaction=f || postaction
			}
		}
	}
	
	this.clear = function()
	{
		this.imagesDrawed = [];
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.setFramesToImg = function(url, fw, fh)
	{
		var img = this.images.filter(x => x.url == url)[0];
		if (img == undefined)
			return (null);
		img.fw = fw;
		img.fh = fh;
		return (img);
	}
	
	this.drawframe = function(name, url, id, dx, dy, dLargeur, dHauteur, drotate)
	{
		var img = this.images.filter(x => x.url == url)[0];
		if (img == undefined)
			return ;
		if (img.isloaded == false)
		{
			var tmp = this;
			setTimeout(function() {
				tmp.drawframe(name, url, id, dx, dy);
			}, 1000 / this.fps);
			return ;
		}
		var sizew = img.image.width / img.fw;
		var sizeh = img.image.height / img.fh;
		var total = img.fw * img.fh;
		
		img.id = id;
		if (id > total)
			id = 0;
		var line = 0;
		while (id >= img.fw)
		{
			line++;
			id -= img.fw;
		}
		dLargeur = typeof dLargeur !== 'undefined' ? dLargeur : sizew;
		dHauteur = typeof dHauteur !== 'undefined' ? dHauteur : sizeh;
		drotate = typeof drotate !== 'undefined' ? drotate : null;
		return this.draw(name, url, dx, dy, dLargeur, dHauteur, id * sizew, line * sizeh, sizew, sizeh, drotate);
	}
	
	//void ctx.drawImage(image, dx, dy);
	//void ctx.drawImage(image, dx, dy, dLargeur, dHauteur);
	//void ctx.drawImage(image, sx, sy, sLargeur, sHauteur, dx, dy, dLargeur, dHauteur);
	this.draw = function(name, url, dx, dy, dLargeur, dHauteur, sx = 0, sy = 0, sLargeur, sHauteur, drotate)
	{
		var img = this.images.filter(x => x.url == url)[0];
		if (img == undefined)
		{
			console.log("IMG " + url + " == null.");
			img = this.loadimage(url);
		}
		if (img.isloaded == false)
		{
			var tmp = this;
			setTimeout(function() {
				tmp.draw(name, url, dx, dy, dLargeur, dHauteur, sx, sy, sLargeur, sHauteur);
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
	
	this.update = function ()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var tmp = this;
		this.imagesDrawed.forEach(function(value) {
			if (value.rotate != null)
			{
				tmp.updaterotate(value);
			}
			else
			{
				tmp.ctx.drawImage(value.image, value.sx, value.sy, value.sLargeur,
					value.sHauteur, tmp.x + value.x, (tmp.y + value.y), value.width, value.height);
			}
		});
		this.update_drawed_text();
	}
	
	this.updaterotate = function (value)
	{
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
	
	this.undraw = function(names = [])
	{
		if (!Array.isArray(names)) {
			names = [names];
		}
		var tmp = this;
		names.forEach((name) => {
			var img = tmp.imagesDrawed.filter(x => x.name == name)[0];
			var text = tmp.textDrawed.filter(x => x.name == name)[0];
			if (text != undefined)
			{
				tmp.ctx.clearRect(text.x, text.y, text.width, text.height);
				tmp.textDrawed.splice(tmp.textDrawed.indexOf(text), 1);
				if (img == undefined)
					return ;
			}
			if (img == undefined)
			{
				setTimeout(function(){tmp.undraw(name);}, 2000);
				return ;
			}
			tmp.ctx.clearRect(img.x, img.y, img.width, img.height);
			tmp.imagesDrawed.splice(tmp.imagesDrawed.indexOf(img), 1);
		});
	}
	
	this.undrawimg = function(img)
	{
		if (img == null)
		{
			return ;
		}
		this.ctx.clearRect(img.x, img.y, img.width, img.height);
		this.imagesDrawed.splice(this.imagesDrawed.indexOf(img), 1);
	}
	
	this.getelementPos = function(x, y)
	{
		x += 10;
		for (var i = 0; i < this.imagesDrawed.length; i++)
		{
			if (x > this.imagesDrawed[i].x && x < (this.imagesDrawed[i].x + this.imagesDrawed[i].width)
				&& y > this.imagesDrawed[i].y && y < (this.imagesDrawed[i].y + this.imagesDrawed[i].height))
			{
				return (this.imagesDrawed[i]);
			}
		}
		return (null);
	}
	this.drawtext = function(name, text, x, y, size, color, font)
	{
		font = typeof font !== 'undefined' ? font : "Arial";
		size = typeof size !== 'undefined' ? size : 10;
		color = typeof color !== 'undefined' ? color : "black";
		var textdraw = {'name': name, 'text': text, 'x': x, 'y': y, 'size': size, 'color': color, 'font': font};
		var clone = this.cloneObj(textdraw);
		this.textDrawed.push(clone);
	}

	this.update_drawed_text = function()
	{
		var tmp = this;
		this.textDrawed.forEach(function (value) {

			tmp.ctx.fillStyle = value.color;
			tmp.ctx.font = value.size + "px " + value.font;
			var metrics = tmp.ctx.measureText(value.text);
			value.width = metrics.width;
			value.height = metrics.height;
			tmp.ctx.fillText(value.text, value.x, value.y);
		});
	}
	this.img = function()
	{
		var image = new Image();
		image.id = "pic"
		image.src = this.canvas.toDataURL();
		return (image);
	};
	
	this.cloneObj = function(obj)
	{
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
};