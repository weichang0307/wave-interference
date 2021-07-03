'use strict';//嚴格模式
var fps=60;//動畫fps
var log=console.log;//簡化log

//------------老師作的萬用半成品(2020.12.01)-----------//

//-------------------開始做我的動畫-------------------//
//-------------------開始做我的動畫-------------------//
//-------------------開始做我的動畫-------------------//
//--SOP：A.宣告全域變數，B.定義init，C.定義tick，D.執行init--//


//A.宣告全域變數
var pts
var nn=300
var tt=0
var b1
var b2
var lambda=10
var period=1
var ttarray=[]
var ttnn=0
var dt=1/60
var xx0array=[]
var zz0array=[]
var lambdaarray=[]
var periodarray=[]
var wavearray=[]
var bbarray=[]
var arrow
var mmd=0
var aamd

//B.定義init
function init(){
	var name=new TEACHER.ObjTextPlane(100,10,'1545 20張博崴','z')
	scene.add(name)
	name.position.z=-80
	name.position.y=10


	skyBox.visible=false
	ground.visible=false
	logo.visible=false



	world2D.slCameraRR.value=200
	world2D.sl01.minimum=0.5
	world2D.sl01.maximum=5
	world2D.sl01.value=1
	world2D.sl01.digitN=1
	world2D.sl01.setLabel('週期')
	world2D.sl02.minimum=5
	world2D.sl02.maximum=20
	world2D.sl02.value=10

	world2D.sl02.setLabel('波長')
	world2D.sl03.minimum=2
	world2D.sl03.maximum=10
	world2D.sl03.setLabel('振幅')
	world2D.btn01.setLabel('加入波')
	world2D.btn02.setLabel('clear')
	world2D.ch01.setLabel('波源小球')
	world2D.ch02.setLabel('play')
	world2D.ch02.checked=true
	addwave(-5,0)
	addwave(5,0)
	world2D.btn01.on('click',add)
	world2D.btn02.on('click',clear)

	world2D.btnUp.on('mousedown',up)
	world2D.btnDown.on('mousedown',down)
	world2D.btnLeft.on('mousedown',left)
	world2D.btnRight.on('mousedown',right)
	world2D.on('pressup',btnup)


	arrow=new TEACHER.ObjArrow(2,0xff0000)
	arrow.setArrow(0,-20,0)
	arrow.position.y=30
	scene.add(arrow)
	

	pts=new TEACHER.Points(0x009999,2,90000)
	for(var i=0;i<nn*nn;i++){                //nn=300
		pts.addPoint(0.4*(i%nn-0.5*nn),0,0.4*(Math.floor(i/nn)-0.5*nn))
	}
	pts.update()
	scene.add(pts)

	
	setInterval(tick,1000/fps);
}


//C.定義tick                                                                                                                       
function tick(){
	if(world3D.cameraPhi>Math.PI*3/8){
		world3D.cameraPhi=Math.PI*3/8
	}
	if(world3D.cameraPhi<-Math.PI*3/8){
		world3D.cameraPhi=-Math.PI*3/8
	}
	if(world2D.ch02.checked===true){
		for(var i=0;i<ttnn;i++){
			ttarray[i]+=dt
		}
	}
	
	for(var i=0;i<ttnn;i++){
		var lambda=lambdaarray[i]
		var period=periodarray[i]
		var wave=wavearray[i]
		bbarray[i].position.y=-wave*4*Math.sin(2*Math.PI*ttarray[i]/period)
		bbarray[i].visible=world2D.ch01.checked
	}
	
	for(var i=0;i<nn*nn;i++){
		//提取編號為i的點及其位置
		var pt=pts.getPoint(i)
		var xx=pt.x
		var zz=pt.z
		var yy=0
		//將點i對於所有波的y軸(高低)變化量疊加
		for(var y=0;y<ttnn;y++){//ttnn為波的數量
			//提取編號為y的波的屬性資料
			var lambda=lambdaarray[y]//波長
			var period=periodarray[y]//週期
			var wave=wavearray[y]//振幅
			var xx0=xx0array[y]//波源x軸位置
			var zz0=zz0array[y]//波源z軸位置
			//以畢氏定理算出點i距離波y的距離
			var rr=Math.sqrt((xx-xx0)*(xx-xx0)+(zz-zz0)*(zz-zz0))
			//以波動方程式算出點i對應到波y所產生的y軸變化量
			yy+=wave*Math.sin(2*Math.PI*rr/lambda-2*Math.PI*ttarray[y]/period)
			//製造出波一開始向外傳遞的效果(若是波尚未到達就使Y軸變化量回歸0)
			if(rr>ttarray[y]*lambda/period){
				yy-=wave*Math.sin(2*Math.PI*rr/lambda-2*Math.PI*ttarray[y]/period)
			}
		}
		pts.setPoint(i,xx,yy,zz)
	}
	pts.update()


	if(mmd===1){
		arrow.position.z-=1
	}
	if(mmd===2){
		arrow.position.z+=1
	}
	if(mmd===3){
		arrow.position.x-=1
	}
	if(mmd===4){
		arrow.position.x+=1
	}
	if(aamd===1){
		arrow.position.y+=arrow.vy
		if(arrow.position.y<20&&arrow.vy<0){
			arrow.vy*=-1
		}
		if(arrow.position.y>30&&arrow.vy>0){
			world2D.btn01.visible=true
			arrow.position.y=30
			arrow.vy=0
			aamd=0
		}
	}
	//3D
	world3D.render();
	//2D
	world2D.stage.update();
}

function up(e){
	mmd=1
}
function down(e){
	mmd=2
	
}
function left(e){
	mmd=3
	
}
function right(e){
	mmd=4
	
}
function btnup(){
	mmd=0
}
function add(e){
	aamd=1
	arrow.vy=-1
	world2D.btn01.visible=false
	var zz=arrow.position.z
	var xx=arrow.position.x
	addwave(xx,zz)
}
function clear(e){
	xx0array=[]
 	zz0array=[]
	lambdaarray=[]
	periodarray=[]
	wavearray=[]
	for(var i=0;i<ttnn;i++){
		bbarray[i].visible=false
	}
	bbarray=[]
	ttarray=[]
	ttnn=0
}


function addwave(x,z){
	//設定新加入波源的屬性
	var period=world2D.sl01.value//週期
	var lambda=world2D.sl02.value//波長
	var wave=world2D.sl03.value//振幅
	//將其加入對應的陣列
	lambdaarray.push(lambda)
	periodarray.push(period)
	wavearray.push(wave)
	//設定波源位置
	xx0array.push(x)
	zz0array.push(z)

	ttarray.push(0)//加入新的時間線
	ttnn+=1//波的總數+1
	//加入波源小球
	var bb=new TEACHER.ObjSphere(1,0xff0000)
	bb.position.x=x
	bb.position.z=z
	scene.add(bb)
	bbarray.push(bb)
}




//resize
MyJS.myResize();















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































//--以下都是老師幫你寫的，可以參考，不要修改--//
//--以下都是老師幫你寫的，可以參考，不要修改--//
//--以下都是老師幫你寫的，可以參考，不要修改--//
//--以下都是老師幫你寫的，可以參考，不要修改--//


//TEACHER.Obj 老師幫你產生Object3D
//TEACHER.Obj 老師幫你產生Object3D
//TEACHER.Obj 老師幫你產生Object3D
//TEACHER.Obj 老師幫你產生Object3D
var TEACHER={};
//平面
/**
 * 老師幫你寫的平面，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjPlaneX
 * @param {number} _w 寬，預設10
 * @param {number} _h 高，預設10
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 * @param {string} _dir 方向，"x","y","z", 預設"z" 
 * @param {number} _side 顯示哪一面，0正面，1背面，2雙面，預設0正面 
 */
TEACHER.ObjPlane=function(_w,_h,_color,_dir,_side){
	let t=this;
	t.mat = new TEACHER.MSMat(_color , _side);
	t.geo = new THREE.PlaneGeometry(_w||10,_h||10,1,1);
	t.mesh=new THREE.Mesh(t.geo , t.mat);
	if(_dir==="x"){
		t.mesh.rotation.y=0.5*Math.PI;
	}else if(_dir==="y"){
		t.mesh.rotation.x=-0.5*Math.PI;
	}
	THREE.Object3D.call(this, t.geo, t.mat );
	t.add(t.mesh);
}
TEACHER.ObjPlane.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjPlane.prototype.constructor = TEACHER.ObjPlane;
//圓柱
/**
 * 老師幫你寫的圓柱，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjCylinder
 * @param {number} _r 半徑，預設10
 * @param {number} _h 柱高，預設10
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 * @param {boolean} _openEnd 是否兩端開，預設false
 * @param {string} _dir 方向，"x","y","z", 預設"y" 
 * @param {number} _side 顯示哪一面，0正面，1背面，2雙面，預設0正面 
 */
TEACHER.ObjCylinder=function(_r,_h,_color,_openEnd,_dir,_side){
	let t=this;
	t.mat = new TEACHER.MSMat(_color , _side);
	t.geo = new THREE.CylinderGeometry(_r||10, _r||10, _h||10, 32, 2, _openEnd);
	t.mesh=new THREE.Mesh(t.geo , t.mat);
	if(_dir==="x"){
		t.mesh.rotation.z=-0.5*Math.PI;
	}else if(_dir==="z"){
		t.mesh.rotation.x=0.5*Math.PI;
	}
	THREE.Object3D.call(this,t.geo,t.mat);
	t.add(t.mesh);
}
TEACHER.ObjCylinder.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjCylinder.prototype.constructor = TEACHER.ObjCylinder;
//圓球
/**
 * 老師幫你寫的圓球，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjSphere
 * @param {number} _r 半徑，預設10
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 * @param {number} _side 顯示哪一面，0正面，1背面，2雙面，預設0正面 
 */
TEACHER.ObjSphere=function(_r,_color,_side){
	let t=this;
	t.mat = new TEACHER.MSMat(_color , _side);
	t.geo = new THREE.SphereGeometry(_r||10, 32, 16);
	t.mesh=new THREE.Mesh(t.geo , t.mat);
	THREE.Object3D.call(this,t.geo,t.mat);
	t.add(t.mesh);
}
TEACHER.ObjSphere.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjSphere.prototype.constructor = TEACHER.ObjSphere;
//長方體
/**
 * 老師幫你寫的長方體，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjBox
 * @param {number} _w 寬，預設10
 * @param {number} _h 高，預設10
 * @param {number} _d 深，預設10
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 * @param {number} _side 顯示哪一面，0正面，1背面，2雙面，預設0正面 
 */
TEACHER.ObjBox=function(_w,_h,_d,_color,_side){
	let t=this;
	t.mat = new TEACHER.MSMat(_color , _side);
	t.geo = new THREE.BoxGeometry(_w||10,_h||10,_d||10);
	t.mesh=new THREE.Mesh(t.geo , t.mat);
	THREE.Object3D.call(this,t.geo,t.mat);
	t.add(t.mesh);
}
TEACHER.ObjBox.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjBox.prototype.constructor = TEACHER.ObjBox;
//---------------------------------------------
//老師的MSMat，繼承自 THREE.MeshStandardMaterial
TEACHER.MSMat=function(_color,_side){
	THREE.MeshStandardMaterial.call(this,{ color: _color||0xFF00FF , roughness: 0.4 , side:_side||0});
}
TEACHER.MSMat.prototype = Object.create(THREE.MeshStandardMaterial.prototype);
TEACHER.MSMat.prototype.constructor = TEACHER.MSMat;







//圖片平面
/**
 * 老師幫你寫的圖片平面，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjPicPlane
 * @param {number} _w 寬，預設10
 * @param {number} _h 高，預設10
 * @param {string} _pic base64 image string，讀取自pics.js，轉檔自https://www.base64-image.de/
 * @param {string} _dir 方向，"x","y","z", 預設"z" 
 * @param {number} _side 顯示哪一面，0正面，1背面，2雙面，預設0正面 
 */
TEACHER.ObjPicPlane=function(_w,_h,_pic,_dir,_side){
	let t=this;
	let texture = new THREE.TextureLoader().load( _pic );
	t.mat = new THREE.MeshBasicMaterial({ map: texture ,transparent:true, side:_side||0 });
	t.geo = new THREE.PlaneGeometry(_w,_h,1,1);	
	t.mesh=new THREE.Mesh(t.geo , t.mat);
	if(_dir==="x"){
		t.mesh.rotation.y=0.5*Math.PI;
	}else if(_dir==="y"){
		t.mesh.rotation.x=-0.5*Math.PI;
	}
	THREE.Object3D.call(this);
	t.add(t.mesh);
}
TEACHER.ObjPicPlane.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjPicPlane.prototype.constructor = TEACHER.ObjPicPlane;
//圖片圓柱
/**
 * 老師幫你寫的圖片圓柱，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjPicCylinder
 * @param {number} _r 半徑，預設10
 * @param {number} _h 柱高，預設10
 * @param {string} _pic base64 image string，讀取自pics.js，轉檔自https://www.base64-image.de/
 * @param {boolean} _openEnd 是否兩端開，預設false
 * @param {string} _dir 方向，"x","y","z", 預設"y" 
 * @param {number} _side 顯示哪一面，0正面，1背面，2雙面，預設0正面 
 */
TEACHER.ObjPicCylinder=function(_r,_h,_pic,_openEnd,_dir,_side){
	let t=this;
	let texture = new THREE.TextureLoader().load( _pic );
	t.mat = new THREE.MeshBasicMaterial({ map: texture , side:_side||0 });
	t.geo = new THREE.CylinderGeometry(_r||10, _r||10, _h||10, 32, 4, _openEnd);
	t.mesh=new THREE.Mesh(t.geo , t.mat);
	if(_dir==="x"){
		t.mesh.rotation.z=-0.5*Math.PI;
	}else if(_dir==="z"){
		t.mesh.rotation.y=0.5*Math.PI;
		t.mesh.rotation.x=0.5*Math.PI;
	}else if(_dir==="y"){
		t.mesh.rotation.y=0.5*Math.PI;
	}
	THREE.Object3D.call(this,t.geo,t.mat);
	t.add(t.mesh);
}
TEACHER.ObjPicCylinder.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjPicCylinder.prototype.constructor = TEACHER.ObjPicCylinder;
//圖片圓球
/**
 * 老師幫你寫的圖片圓球，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjPicSphere
 * @param {number} _r 半徑，預設10
 * @param {string} _pic base64 image string，讀取自pics.js，轉檔自https://www.base64-image.de/
 * @param {number} _side 顯示哪一面，0正面，1背面，2雙面，預設0正面 
 */
TEACHER.ObjPicSphere=function(_r,_pic,_side){
	let t=this;
	let texture = new THREE.TextureLoader().load( _pic );
	t.mat = new THREE.MeshBasicMaterial({ map: texture , side:_side||0 });
	t.geo = new THREE.SphereGeometry(_r||10, 32, 16);
	t.mesh=new THREE.Mesh(t.geo , t.mat);
	THREE.Object3D.call(this,t.geo,t.mat);
	t.add(t.mesh);
}
TEACHER.ObjPicSphere.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjPicSphere.prototype.constructor = TEACHER.ObjPicSphere;




//箭頭
/**
 * 老師幫你寫的箭頭，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjArrow
 * @param {number} _r 半徑，預設10
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 */
TEACHER.ObjArrow=function(_r,_color){
	let ratioHead=0.4;//頭佔全長
	let ratioBody=0.5;//身寬佔全長
	let material = new THREE.MeshStandardMaterial({ color: _color||0xFF00FF , roughness: 0.4 });
	let geometry = new THREE.ConeGeometry( _r||10, 100*ratioHead, 32 );
	this.ArrowHead=new THREE.Mesh(geometry,material);
	this.ArrowHead.position.y=100*(1-0.5*ratioHead);
	geometry = new THREE.CylinderGeometry( (_r||10)*ratioBody,(_r||10)*ratioBody, 100*(1-ratioHead), 32,2 );
	this.ArrowBody=new THREE.Mesh(geometry,material);
	this.ArrowBody.position.y=100*0.5*(1-ratioHead);
	THREE.Object3D.call(this);
	this.rotX=new THREE.Object3D();//in rotation.x for theta
	this.rotY=new THREE.Object3D();//out rotation.y for phi
	this.add(this.rotY);
	this.rotY.add(this.rotX);
	this.rotX.add(this.ArrowBody);
	this.rotX.add(this.ArrowHead);
}
TEACHER.ObjArrow.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjArrow.prototype.constructor = TEACHER.ObjArrow;
TEACHER.ObjArrow.prototype.setArrow = function(_x,_y,_z){
	let len2=_x*_x+_y*_y+_z*_z;
	let len=Math.sqrt(len2);
	if(len2>0){
		this.rotX.visible=true;
		this.rotX.scale.y=len/100;
	}else{
		this.rotX.visible=false;
	}
	this.rotX.rotation.x=Math.acos(_y/len);
	this.rotY.rotation.y=Math.atan2(_x,_z);
}
//彈簧
/**
 * 老師幫你寫的彈簧，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjSpring
 * @param {number} _len 長度，預設20
 * @param {number} _rB 大半徑，預設5
 * @param {number} _rS 小半徑，預設0.5
 * @param {number} _nn 圈數，預設8
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 */
TEACHER.ObjSpring=function(_len,_rB,_rS,_nn,_color){
	//curve
	let dd=_len||20;
	this.L0=dd;
	let arr=[];
	let nn=_nn||5;
	let rB=_rB||5;
	let rS=_rS||0.5;
	arr.push(new THREE.Vector3( 0, 0, 0 ));
	arr.push(new THREE.Vector3( 0, dd*0.05 ,0));
	for(var i=0;i<=nn*16;i++){
		arr.push(new THREE.Vector3( rB*Math.cos(i*2*Math.PI/16), dd*(0.05+0.9*i/nn/16) ,rB*Math.sin(i*2*Math.PI/16)));
	}
	arr.push(new THREE.Vector3( 0, dd*0.95 ,0));
	arr.push(new THREE.Vector3( 0, dd ,0));
	
	let myClosedSpline = new THREE.CatmullRomCurve3( arr );
	let material = new THREE.MeshStandardMaterial({ color: _color||0xFF00FF , roughness: 0.4 });
	let geometry=new THREE.TubeGeometry( myClosedSpline, 500, rS, 12 );
	this.mesh = new THREE.Mesh(geometry, material );
	THREE.Object3D.call(this);
	this.rotX=new THREE.Object3D();//in rotation.x for theta
	this.rotY=new THREE.Object3D();//out rotation.y for phi
	this.add(this.rotY);
	this.rotY.add(this.rotX);
	this.rotX.add(this.mesh);
}
TEACHER.ObjSpring.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjSpring.prototype.constructor = TEACHER.ObjSpring;
TEACHER.ObjSpring.prototype.setSpring = function(_x,_y,_z){
	let len2=_x*_x+_y*_y+_z*_z;
	let len=Math.sqrt(len2);
	if(len2>0){
		this.rotX.visible=true;
		this.rotX.scale.y=len/this.L0;
	}else{
		this.rotX.visible=false;
	}
	this.rotX.rotation.x=Math.acos(_y/len);
	this.rotY.rotation.y=Math.atan2(_x,_z);
}
//粒子系統
/**
 * 老師幫你寫的粒子系統，繼承自 THREE.Points
 * @constructor TEACHER.Points
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 * @param {number} _size 半徑，預設1
 * @param {number} _nnMax 最大點數，預設10000 
 */
TEACHER.Points=function(_color,_size,_nnMax){
	let tp=this;
	let ss=_size||1;
	let color=_color||0xFF00FF;
	let tColor=new THREE.Color(color);
	tp.nnMax=_nnMax||10000;
	tp.nnNow=0;
	tp.geometry = new THREE.BufferGeometry();
	tp.positions = [];
	tp.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( tp.positions, 3 ) );
	tp.geometry.computeBoundingSphere();
	let material = new THREE.PointsMaterial({
		size: ss,
    	map: tp.createCanvasMaterial('#'+tColor.getHexString(), 64),
      	transparent: true,
      	depthWrite: false
  	});
	THREE.Points.call(this, tp.geometry, material );
}
TEACHER.Points.prototype = Object.create(THREE.Points.prototype);
TEACHER.Points.prototype.constructor = TEACHER.Points;
TEACHER.Points.prototype.createCanvasMaterial = function(color , size){
	var matCanvas = document.createElement('canvas');
	matCanvas.width = matCanvas.height = size;
	var matContext = matCanvas.getContext('2d');
	matContext.imageSmoothingEnabled= false;
	// create exture object from canvas.
	var texture = new THREE.Texture(matCanvas);
	// Draw a circle
	var center = size / 2;
	matContext.beginPath();
	matContext.arc(center, center, size/2-3, 0, 2 * Math.PI, false);
	matContext.closePath();
	matContext.fillStyle = color;
	matContext.fill();
	// need to set needsUpdate
	texture.needsUpdate = true;
	// return a texture made from the canvas
	return texture;
}
//addPoint
TEACHER.Points.prototype.addPoint = function(_x , _y , _z){
	let tp=this;
	if(tp.nnNow<tp.nnMax){
		tp.nnNow++;
	}else{
		log('TEACHER.Points 到達最大點數');
		tp.positions.shift();
		tp.positions.shift();
		tp.positions.shift();
	}
	tp.positions.push(_x,_y,_z);
}
//clear
TEACHER.Points.prototype.clear = function(){
	let tp=this;
	tp.positions=[];
	tp.nnNow=0;
	tp.update();
}
//setPoint
TEACHER.Points.prototype.setPoint = function(_n, _x , _y , _z){
	let tp=this;
	if(_n>tp.nnMax){
		log('輸入的n值大於TEACHER.Points 最大點數 nnMax');
	}else if(_n>tp.nnNow){
		log('輸入的n值大於TEACHER.Points 現在點數 nnNow');
	}else{
		tp.positions[_n*3]=_x;	
		tp.positions[_n*3+1]=_y;	
		tp.positions[_n*3+2]=_z;	
	}
}
//getPoint
TEACHER.Points.prototype.getPoint = function(_n){
	let tp=this;
	let pt = new THREE.Vector3();
	if(_n>tp.nnMax){
		log('輸入的n值大於TEACHER.Points 最大點數 nnMax');
	}else if(_n>tp.nnNow){
		log('輸入的n值大於TEACHER.Points 現在點數 nnNow');
	}else{
		pt.x=tp.positions[_n*3];	
		pt.y=tp.positions[_n*3+1];	
		pt.z=tp.positions[_n*3+2];	
	}
	return pt;
}
//update
TEACHER.Points.prototype.update = function(){
	let tp=this;
	tp.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( tp.positions, 3 ) );
	tp.geometry.computeBoundingSphere();
	tp.geometry.attributes.position.needsUpdate = true;
}

//線條系統
/**
 * 老師幫你寫的線條系統，繼承自 THREE.Line2(可設線寬)
 * @constructor TEACHER.Line
 * @param {number} _color 顏色，預設洋紅0xFF00FF 
 * @param {number} _lineWidth 線寬，預設1 
 * @param {number} _nnMax 最大點數，預設10000 
 */
TEACHER.Line=function(_color , _lineWidth , _nnMax){
	let ln=this;
	ln.nnMax=_nnMax||10000;
	ln.lineWidth=_lineWidth||1;
	ln.nnNow=0;
	var material = new THREE.LineMaterial( { color: _color||0xFF00FF, linewidth: _lineWidth||1 } );
	material.resolution.set( window.innerWidth, window.innerHeight );
	
	
	ln.geometry = new THREE.LineGeometry();
	ln.positions = new Float32Array(ln.nnMax*3);
	ln.geometry.setPositions( ln.positions);

	THREE.Line2.call(this, ln.geometry, material );
}
TEACHER.Line.prototype = Object.create(THREE.Line2.prototype);
TEACHER.Line.prototype.constructor = TEACHER.Line;
//addPoint
TEACHER.Line.prototype.addPoint = function(_x , _y , _z){
	let ln=this;
	if(ln.nnNow<ln.nnMax){
		ln.nnNow++;
	}else{
		log('TEACHER.Line 到達最大點數');
		for(var i=0;i<ln.nnMax-1;i++){
			ln.positions[i*3]=ln.positions[i*3+3];	
			ln.positions[i*3+1]=ln.positions[i*3+4];	
			ln.positions[i*3+2]=ln.positions[i*3+5];	
		}
	}
	for(var i=ln.nnNow;i<=ln.nnMax;i++){
		ln.positions[(i-1)*3] = _x;
		ln.positions[(i-1)*3+1] = _y;
		ln.positions[(i-1)*3+2] = _z;
	}
	
}
//clear
TEACHER.Line.prototype.clear = function(){
	let ln=this;
	ln.positions=new Float32Array(ln.nnMax*3);;
	ln.nnNow=0;
	ln.update();
}
//setPoint
TEACHER.Line.prototype.setPoint = function(_n , _x , _y , _z){
	let ln=this;
	if(_n>ln.nnMax){
		log('輸入的n值大於TEACHER.Line 最大點數 nnMax');
	}else if(_n>ln.nnNow){
		log('輸入的n值大於TEACHER.Line 現在點數 nnNow');
	}else{
		ln.positions[_n*3]=_x;	
		ln.positions[_n*3+1]=_y;	
		ln.positions[_n*3+2]=_z;	
	}
}
//getPoint
TEACHER.Line.prototype.getPoint = function(_n){
	let ln=this;
	let pt = new THREE.Vector3();
	if(_n>ln.nnMax){
		log('輸入的n值大於TEACHER.Line 最大點數 nnMax');
	}else if(_n>ln.nnNow){
		log('輸入的n值大於TEACHER.Line 現在點數 nnNow');
	}else{
		pt.x=ln.positions[_n*3];	
		pt.y=ln.positions[_n*3+1];	
		pt.z=ln.positions[_n*3+2];	
	}
	return pt;
}
//update
TEACHER.Line.prototype.update = function(){
	let ln=this;
	let pt = ln.getPoint(ln.nnNow-1);
	for(var i=ln.nnNow;i<=ln.nnMax;i++){
		ln.positions[i*3] = pt.x;
		ln.positions[i*3+1] = pt.y;
		ln.positions[i*3+2] = pt.z;
	}
	ln.geometry.setPositions( ln.positions);
}

//文字平面
/**
 * 老師幫你寫的文字平面，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjTextPlane
 * @param {number} _w 寬(最好設為高的1,2,4,8倍)，預設20
 * @param {number} _h 高，預設10
 * @param {string} _text 文字內容
 * @param {string} _dir 方向，"x","y","z", 預設"z" 
 * @param {number} _textColor 文字顏色，預設白色0xffffff
 * @param {number} _bgColor 背景顏色，不輸入則為透明
 */
TEACHER.ObjTextPlane=function(_w,_h,_text,_dir,_textColor,_bgColor){
	let t=this;
	//texture
	let ratio=Math.round(Math.log2(_w/_h));
	let canvas = $("<canvas>").attr('width',String(128*Math.pow(2,ratio))).attr('height','128');
	t.stage = new createjs.Stage(canvas[0]);
	let container = new createjs.Container();
	if(_bgColor){   
		let rectShape = new createjs.Shape();
		let bgColor=new THREE.Color( _bgColor );
		rectShape.graphics.c().f("#"+bgColor.getHexString()).dr(0, 0, 128*Math.pow(2,ratio), 128);
		container.addChild(rectShape);
	}
	t.ctext = new createjs.Text();
	let textColor=new THREE.Color(_textColor||0xffffff);
    t.ctext.color = "#"+textColor.getHexString();
	t.ctext.font = '96px Arial';
	t.ctext.text = _text||"";

	t.ctext.textAlign = 'center';
    t.ctext.textBaseline = 'middle';
    t.ctext.x = 128*Math.pow(2,ratio) / 2;
    t.ctext.y = 128 / 2;

   	container.addChild(t.ctext);
 	t.stage.addChild(container);
	t.stage.update();
	
	//plane
	t.texture = new THREE.Texture(canvas[0]);
   	var material = new THREE.MeshBasicMaterial({ map: t.texture , transparent: true });
   	var geometry = new THREE.PlaneGeometry(_w||10,_h||10,1,1);
   	t.texture.needsUpdate = true;
   	t.plane1 = new THREE.Mesh( geometry, material );
   	t.plane2 = new THREE.Mesh( geometry, material );
	t.plane2.rotation.y=Math.PI;
	let objCon=new THREE.Object3D();
	objCon.add(t.plane1).add(t.plane2);
	if(_dir==="x"){
		objCon.rotation.y=0.5*Math.PI;
	}else if(_dir==="y"){
		objCon.rotation.x=-0.5*Math.PI;
	}
	THREE.Object3D.call(this);
	t.add(objCon);
}
TEACHER.ObjTextPlane.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjTextPlane.prototype.constructor = TEACHER.ObjTextPlane;
TEACHER.ObjTextPlane.prototype.setText = function(_text){
	let t=this;
	t.ctext.text = _text;
	t.stage.update();
	t.texture.needsUpdate = true;
}

//曲線圖
/**
 * 老師幫你寫的曲線圖，繼承自 THREE.Object3D
 * @constructor TEACHER.ObjGraph
 * @param {number} _xMin x最小值，預設0
 * @param {number} _xMax x最大值，預設10
 * @param {number} _yMin y最小值，預設0
 * @param {number} _yMax y最大值，預設10
 * @param {number} _frameColor 框線顏色，預設 0xffffff
 * @param {number} _lineColor 曲線顏色，預設 0xffff00
 * @param {number} _nnMax 最大點數，預設10000 (TEACHER.Line)
 */
TEACHER.ObjGraph=function(_xMin,_xMax,_yMin,_yMax,_frameColor,_lineColor,_nnMax){
	let t=this;
	t.objCon=new THREE.Object3D();
	
	//var
	t._xMin = _xMin||0;
	t._xMax = _xMax||10;
	t._yMin = _yMin||0;
	t._yMax = _yMax||10;
	t.divXN=5;
	t.divYN=4;

	//frame	
	t.frameMat = new THREE.LineBasicMaterial( { color: _frameColor||0xffffff } );
	var points = [];
	for(var ix=0;ix<=t.divXN;ix++){
		points.push( new THREE.Vector3( -50+ix*20, 0, 0 ) );
		points.push( new THREE.Vector3( -50+ix*20, 50, 0 ) );
	}
	for(var iy=0;iy<=t.divYN;iy++){
		points.push( new THREE.Vector3( -50, iy*12.5, 0 ) );
		points.push( new THREE.Vector3( 50, iy*12.5, 0 ) );
	}
	let geo = new THREE.BufferGeometry().setFromPoints( points );
	t.frame = new THREE.LineSegments(geo, t.frameMat);
	t.objCon.add(t.frame);

	//tick label
	t.labelXMin = new TEACHER.ObjTextPlane(20,5,String(t._xMin),"z",_frameColor||0xffffff);
	t.labelXMin.position.x=-50;
	t.labelXMin.position.y=-3;
	t.objCon.add(t.labelXMin);
	t.labelXMax = new TEACHER.ObjTextPlane(20,5,String(t._xMax),"z",_frameColor||0xffffff);
	t.labelXMax.position.x=50;
	t.labelXMax.position.y=-3;
	t.objCon.add(t.labelXMax);
	t.labelYMin = new TEACHER.ObjTextPlane(20,5,String(t._yMin),"z",_frameColor||0xffffff);
	t.labelYMin.position.x=-53;
	t.labelYMin.position.y=0;
	t.objCon.add(t.labelYMin);
	t.labelYMax = new TEACHER.ObjTextPlane(20,5,String(t._yMax),"z",_frameColor||0xffffff);
	t.labelYMax.position.x=-53;
	t.labelYMax.position.y=50;
	t.objCon.add(t.labelYMax);

	//axes label
	t.labelX = new TEACHER.ObjTextPlane(24,7,"x","z",_frameColor||0xffffff);
	t.labelX.position.x=60;
	t.labelX.position.y=4;
	t.labelX.position.z=1;
	t.labelY = new TEACHER.ObjTextPlane(24,7,"y","z",_frameColor||0xffffff);
	t.labelY.position.x=-60;
	t.labelY.position.y=25;
	t.labelY.position.z=1;
	t.labelY.rotation.z=Math.PI/2;
	t.labelTitle = new TEACHER.ObjTextPlane(40,10,"y-x","z",_frameColor||0xffffff);
	t.labelTitle.position.y=53;
	t.labelTitle.position.z=1;
	t.objCon.add(t.labelX).add(t.labelY).add(t.labelTitle);
	
	//line
	t._lineColor = _lineColor;
	t._nnMax = _nnMax;
	t.line = new TEACHER.Line(t._lineColor||0xffff00 ,2, t._nnMax);
	t.objCon.add(t.line);
	t.changeScale();

	
	THREE.Object3D.call(this);
	t.add(t.objCon);
}
TEACHER.ObjGraph.prototype = Object.create(THREE.Object3D.prototype);
TEACHER.ObjGraph.prototype.constructor = TEACHER.ObjGraph;
//xMin
Object.defineProperty(TEACHER.ObjGraph.prototype, 'xMin', {
    get: function(){
        return this._xMin;
    },
    set: function(value){
		this._xMin = value;
		this.changeScale();
    }
  });
//xMax
Object.defineProperty(TEACHER.ObjGraph.prototype, 'xMax', {
    get: function(){
        return this._xMax;
    },
    set: function(value){
		this._xMax = value;
		this.changeScale();
    }
  });
//yMin
Object.defineProperty(TEACHER.ObjGraph.prototype, 'yMin', {
    get: function(){
        return this._yMin;
    },
    set: function(value){
		this._yMin = value;
		this.changeScale();
    }
  });
//yMax
Object.defineProperty(TEACHER.ObjGraph.prototype, 'yMax', {
    get: function(){
        return this._yMax;
    },
    set: function(value){
		this._yMax = value;
		this.changeScale();
    }
  });
//addPoint
TEACHER.ObjGraph.prototype.addPoint = function(_x , _y){
	let tg=this;
	tg.line.addPoint(_x,_y,0);
	tg.line.update();
}
//clear
TEACHER.ObjGraph.prototype.clear = function(){
	let tg=this;
	tg.line.clear();	
}
//changeScale
TEACHER.ObjGraph.prototype.changeScale = function(){
	let tg=this;
	
	tg.line.scale.x = 100/(tg._xMax-tg._xMin);
	tg.line.scale.y = 50/(tg._yMax-tg._yMin);
	tg.line.position.x=-50-tg._xMin*tg.line.scale.x;
	tg.line.position.y=-tg._yMin*tg.line.scale.y;

	tg.labelXMin.setText(tg._xMin);
	tg.labelXMax.setText(tg._xMax);
	tg.labelYMin.setText(tg._yMin);
	tg.labelYMax.setText(tg._yMax);
}
//setLabel
/**
 * @method TEACHER.ObjGraph
 * @param {string} _title 標題，預設 y-x
 * @param {string} _y 標題，預設 y
 * @param {string} _x 標題，預設 x
 */
TEACHER.ObjGraph.prototype.setLabel=function(_title , _y , _x){
	let tg = this;

	tg.labelTitle.setText(_title||'y-x');
	tg.labelY.setText(_y||'y');
	tg.labelX.setText(_x||'x');
}
	

//--老師幫你產生天空盒，地板--//
//--老師幫你產生天空盒，地板--//
//--老師幫你產生天空盒，地板--//
//skyBox天空盒
var skyBox=new THREE.Object3D();
skyBox.wallU=new TEACHER.ObjPicPlane(10000,10000,pics.wallU,'y',1);
skyBox.wallD=new TEACHER.ObjPicPlane(10000,10000,pics.wallD,'y',0);
skyBox.wallS=new TEACHER.ObjPicCylinder(5000,10000,pics.wallSide,true,'y',1);
skyBox.wallU.position.y=5000;
skyBox.wallD.position.y=-5000;
skyBox.add(skyBox.wallU).add(skyBox.wallD).add(skyBox.wallS);
world3D.scene.add(skyBox);

//ground地板
var ground=new TEACHER.ObjPicPlane(100,100,pics.ground,'y');
world3D.scene.add(ground);

var logo=new TEACHER.ObjPicPlane(100,100/8,pics.logo,'z',2);
logo.position.z=-50;
logo.position.y=100/8/2;
world3D.scene.add(logo);


//取得滑鼠3D位置
/**
 * @function getMouse3D 取得滑鼠3D位置
 * @param {string} _plane 平面名稱 "x","y,'z"，預設為"y"
 * @param {number} _c 截距，預設為0 
 */
function getMouse3D(_plane , _c){

	let p=_plane||"y";
	let vecN;
	let vecM=new THREE.Vector3();//mouse3D to return
	if(p==="x"){vecN=new THREE.Vector3(1,0,0);}
	else if(p==="y"){vecN=new THREE.Vector3(0,1,0);}
	else if(p==="z"){vecN=new THREE.Vector3(0,0,1);}
	else{log('錯誤!!');}
	let mouse = new THREE.Vector2();
	mouse.x = ( world2D.stage.mouseX / 1600 ) * 2 - 1;
	mouse.y = - ( world2D.stage.mouseY / 900 ) * 2 + 1;
	world3D.raycaster.setFromCamera( mouse, world3D.camera );
	world3D.raycaster.ray.intersectPlane ( new THREE.Plane(vecN) ,vecM);

	return vecM;
}



//D.執行init，程式開始
init();
