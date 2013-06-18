/*_______
with dances.plugins

	called: imgReady

	version: 1.0

	firstDate: 2013.06.17

	lastDate: 2013.06.18

	require: [
	],

	effect: [
		+. 嗅探图片尺寸
		+. {effects}
	],

	log: {
		"v1.0": [
			+. TODO checkCode: gif 格式潜在的问题
			+. {logs}
		]
	}

_______*/

/*_______
# syntax:

	dances.imgReady(pseudoSrc, fn);

## param
### pseudoSrc 适当重载, 三种类型:

+ src
	单个src
+ src,src
	以 "," 分隔 src 集群
+ [src, src]
	数组形式 src 集群

### fn
imgReady 事件回调, 传入 width, height

## return
dances.imgReady 单例.

_______*/


"use strict";

"function" === typeof window.define && define.amd &&
define.amd.imgReady &&
(define.amd.dancesNative = true) &&
define(["require", "module", "dNative"], function(require, module){

	var
		img2Ready,
		ctrlReady,

		uc = function(fn){
			return function(){
				return Function.prototype.call.apply(fn, arguments);
			}
		},

		slice = uc(Array.prototype.slice),

		toString = uc(Object.prototype.toString)
	;

	ctrlReady = {
		status: "",

		add : function(){
			"[object Array]" !== toString(this.repo) && (this.repo = []);
			this.repo.push(arguments[0]);
			return this;
		},

		scan: function(){
			var
				_this = this,
				len = this.repo.length - 1,

				fn,
				imgArr,

				_len,
				img
			;

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

					if(img.__error){
						img.onload = img.error = null;
						img = null;
						imgArr.splice(_len, 1);
						continue;
					}


					if(img.width > 0 || img.height > 0){
						img.__enabled || fn.call(img, img.width, img.height);
						img.__enabled = true;
						img.error = null;
						img = null;
						imgArr.splice(_len, 1);
					}

				}while(_len--);

				0 === imgArr.length && this.repo.splice(len, 1);

			}while(len--);

			this.repo.length && setTimeout(function(){
				_this.scan();
			}, 50);
		},

		launch: function(){
			this.repo.length && this.scan();
			return this;
		}
	};

	img2Ready = function(){
		var
			args = slice(arguments),
			urls = args.shift(),
			imgArr,
			callback = args.pop(),

			len,
			url,
			img
		;

		if("string" === typeof urls){
			urls = urls.indexOf(",") > -1 ?
				urls = urls.split(",") :
				[urls]
			;
		}

		if("[object Array]" !== (toString(urls))){
			return this;
		}

		imgArr = [];
		imgArr.__img2go = callback;

		len = urls.length - 1;

		do{
			url = urls;

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
						img.__enabled || callback.call(img, img.width, img.height);
						img.onload = img.onerror = null;
						img.__enabled = true;
						img = null;
					};

				})(img);

				imgArr.push(img);
			}

		}while(len--);

		urls.length = 0;

		ctrlReady
			.add(imgArr)
			.launch()
		;

		return this;
	};


	module.exports = img2Ready;

});