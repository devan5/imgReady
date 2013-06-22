# dances.imgReady

### syntax

	dances.imgReady(srcKlass, fn);

### param
+ pseudoSrc 适当重载, 接受一个或多个src  
	+ src
		单个src
	+ src,src
		以 "," 分隔 src 集群
	+ [src, src]
		数组形式 src 集群

#### fn
+ ready 事件函数  
接受两个参数, width, height  

当 widht, heigth 接受 -1,-1 时表明图片加载失败.

### return
dances.imgReady