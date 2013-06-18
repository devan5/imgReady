/*_______
with dances.plugins

	called: imgReady

	version: 1.0

	firstDate: 2013.06.17

	lastDate: 2013.06.18

	require: [
		"dances.nativeExtend"
	],

	effect: [
		+. 嗅探图片尺寸
		+. {effects}
	],

	log: {
		"v1.0": [
			+. {logs},
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

		_ = require("dNative"),

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
				imgDom
			;

			do{
				imgArr = this.repo[len];
				fn = imgArr.__img2go;

				if(0 === imgArr.length){
					this.repo.splice(len, 1);
					continue;
				}

				do{
					_len = imgArr.length - 1;
					imgDom = imgArr[len];

					if(imgDom.width > 0 || imgDom.height > 0){
						fn.call(imgDom, imgDom.width, imgDom.height);
						imgDom.onload = null;
						imgDom = null;
						imgArr.splice(len, 1);
					}

				}while(_len--);

			}while(len--);

			1 && this.repo.length && setTimeout(function(){
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
			callback = args.pop()
		;

		if("string" === typeof urls){
			urls = urls.indexOf(",") > -1 ?
				urls = urls.split(",") :
				[urls]
			;
		}

		if("[object Array]" !== (toString(urls))){

			// check This errorRange
			return this;
		}


		imgArr = [];
		imgArr.__img2go = callback;
		_.forEach(urls, function(url){
			var
				img
			;

			img = new Image();
			img.src = url;
			img.removeAttribute("width");
			img.removeAttribute("height");

			if(img.complete){
				$$log("complete", "debug");
				callback.call(img, img.width, img.height);

			}else{
				img.onload = function(){
				$$log("onload", "debug");
					callback.call(img, img.width, img.height);
					img.onload = null;
				};

				imgArr.push(img);
			}

		});

		urls.length = 0;

		ctrlReady
			.add(imgArr)
			.launch()
		;

		return this;
	};


	module.exports = img2Ready;

});