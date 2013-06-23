/*_______
with dances.plugins

	called: imgReady

	version: 1.0

	firstDate: 2013.06.17

	lastDate: 2013.06.23

	require: [
	],

	effect: [
		+. 嗅探图片尺寸
		+. {effects}
	],

	log: {
		"v1.0": [
			+. [local img] 在虚拟机纯粹 xp+ie8, 环境通过测试
		]
	}

_______*/

(function(dances, undefined){
	"use strict";
	var
		imgReady,
		imager,

		uc = function(fn){
			return function(){
				return Function.prototype.call.apply(fn, arguments);
			}
		},

		slice = uc(Array.prototype.slice),

		toString = uc(Object.prototype.toString)
	;

	imager = {

		add : function(){
			"[object Array]" !== toString(this.repo) && (this.repo = []);
			this.repo.push(arguments[0]);
			return this;
		},

		// 不能直接 invoke
		__scan: function(){
			var
				_this = this,
				len = this.repo.length - 1,

				fn,
				imgArr,

				_len,
				img
			;

			this.status = "process";

			// 遍历 __repo, 每个 __repo 包含 img 集群 和 一个事件回调
			do{
				imgArr = this.repo[len];
				fn = imgArr.__img2go;

				if(0 === imgArr.length){
					this.repo.splice(len, 1);
					continue;
				}

				_len = imgArr.length - 1;
				do{
					img = imgArr[_len];

					img._time > 30000 && (img.__error = true);

					if(img.__error){
						img.onload = img.error = null;
						img = null;
						imgArr.splice(_len, 1);
						continue;
					}

					// ie10 localEn .png files need img.naturalWidth detect size
					if(img.width > 0 || img.height > 0 || img.naturalWidth > 0 || img.naturalHeight > 0){
						img.__enabled || fn.call(img, img.width || img.naturalWidth, img.height || img.naturalHeight);
						img.onload = null;
						img = null;
						imgArr.splice(_len, 1);
						continue;
					}

					img._time = "number" == typeof img._time ?
						img._time + 80 :
						0
					;

				}while(_len--);

				0 === imgArr.length && this.repo.splice(len, 1);

			}while(len--);

			if(this.repo.length){
				setTimeout(function(){
					_this.__scan();
				}, 80);
			}else{
				this.status = "end";
			}

			return this;
		},

		launch: function(){
			if(this.repo.length && "process" !== this.status){
			 	this.__scan();
			}
			return this;
		}
	};

	imgReady = function(){
		var
			args = slice(arguments),
			urls = args.shift(),
			callback = args.pop(),

			imgArr,

			len,
			url,
			img
		;

		if("function" !== typeof callback){
			$$log("callback 缺失", "error");
			return this;
		}

		if("string" === typeof urls){
			urls = urls.indexOf(",") > -1 ?
				urls = urls.split(",") :
				[urls]
			;
		}

		if("[object Array]" !== (toString(urls)) || urls.length < 1){
			$$log("urls 缺失", "error");
			return this;
		}

		// new Image create will be pushed in the arr
		imgArr = [];
		imgArr.__img2go = callback;

		len = urls.length - 1;

		do{
			url = urls[len];

			if(!url){ continue; }

			img = new Image();
			img.src = url;
			img.removeAttribute("width");
			img.removeAttribute("height");

			if(img.complete){
				callback.call(img, img.width, img.height);

			}else{
				(function(img){

					img.onerror = function(){
						callback.call(img, -1, -1);
						img.onload = img.onerror = null;
						img.__error = true;
						img = null;
					};

					img.onload = function(){
						top.demo = img;
						img.__enabled || callback.call(img, img.width || img.naturalWidth, img.height || img.naturalHeight);
						img.onload = img.onerror = null;
						img.__enabled = true;
						img = null;
					};

				})(img);

				imgArr.push(img);
			}

		}while(len--);

		imager
			.add(imgArr)
			.launch()
		;

		urls = null;

		return this;
	};

	imgReady.getStatus = function(){
		return imager.status;
	};

	dances.imgReady = imgReady;

	"function" === typeof window.define && define.amd && define.amd.imgReady && define(function(){
		return imgReady;
	});

})(window.dances);