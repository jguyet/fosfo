var fosfo = function(canvas)
{
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.images = [];
	this.imagesDrawed = [];
	this.fps = 60;
	
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
				var ddd = _.find(tmp.images, { 'url': this.url });
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
		var img = _.find(this.images, { 'url': url });
		if (img == null)
			return (null);
		img.fw = fw;
		img.fh = fh;
		return (img);
	}
	
	this.drawframe = function(name, url, id, dx, dy, dLargeur, dHauteur, drotate)
	{
		var img = _.find(this.images, { 'url': url });
		if (img == null)
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
		var img = _.find(this.images, { 'url': url });
		if (img == null)
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
	
	this.update = function (dup)
	{
		dup = typeof dup !== 'undefined' ? dup : [];
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var tmp = this;
		_.forEach(this.imagesDrawed, function(value) {
				if (value.rotate != null)
				{
					tmp.updaterotate(dup, value);
				}
				else
				{
					tmp.ctx.drawImage(value.image, value.sx, value.sy, value.sLargeur,
						value.sHauteur, value.x, value.y, value.width, value.height);
					_.forEach(dup, function(duplicat) {
						tmp.ctx.drawImage(value.image, value.sx, value.sy, value.sLargeur,
							value.sHauteur, value.x + duplicat[0], value.y + duplicat[1], value.width, value.height);
					});
				}
		});
	}
	
	this.updaterotate = function (dup, value)
	{
		dup = typeof dup !== 'undefined' ? dup : [];
		this.ctx.save();
		this.ctx.translate(value.x, value.y);
		this.ctx.rotate(value.rotate * (Math.PI/180));
		this.ctx.drawImage(value.image, value.sx, value.sy, value.sLargeur, value.sHauteur, 0,  0, -(value.width), -(value.height));
		this.ctx.restore();
		var tmp = this;
		_.forEach(dup, function(duplicat) {
			tmp.ctx.save();
			tmp.ctx.translate(value.x + duplicat[0], value.y + duplicat[1]);
			tmp.ctx.rotate(value.rotate * (Math.PI/180));
			tmp.ctx.drawImage(value.image, value.sx, value.sy, value.sLargeur, value.sHauteur, 0,  0, -(value.width), -(value.height));
			tmp.ctx.restore();
		});
	}
	
	this.undraw = function(name)
	{
		var img = _.find(this.imagesDrawed, { 'name': name });
		if (img == null)
		{
			var tmp = this;
			setTimeout(function(){tmp.undraw(name);}, 2000);
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