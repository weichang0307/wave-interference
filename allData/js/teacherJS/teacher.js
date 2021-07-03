'use strict';//嚴格模式


//mainAnimation DIV
$('#mainAnimation').css('position','absolute')
					.css('top','0px')
					.css('left','0px')
					.css('width','1600px')
					.css('height','900px');
//myResize and myFullScreen
var MyJS = MyJS||{};
(function(){

	
	var browserInfo={};
					
	detectBrowser();

	//resize
	function myResize(){

		
		var oldWidth = 1600;
		var oldHeight= 900;

		//http://tech.colla.me/en/show/jquery_not_offer_right_window_height_on_iOS
		//This is a bug of safari. And on iOS device (both safari and chrome), do not trust jQuey $(window).height(), always use window.innerHeight.
		//while on Android, there seems no problem.

		/*
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		*/

		
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		
		var windowScale = Math.min(windowWidth/oldWidth , windowHeight/oldHeight);
		$('#mainAnimation').css('width' , windowScale*oldWidth).css('height' , windowScale*oldHeight);
		/*$('#mainAnimation').css({'-webkit-transform': 'scale(' + windowScale+')',
						            '-moz-transform': 'scale(' + windowScale + ')',
						            '-ms-transform': 'scale(' + windowScale + ')',
						            '-o-transform': 'scale(' + windowScale + ')',
						            'transform': 'scale(' + windowScale + ')',
						            '-webkit-transform': 'translateZ(0);'});*/
		//手工置中
		var _top=0 , _left=0;
		if(windowWidth/oldWidth < windowHeight/oldHeight){//上下有空白，計算top
			var _top = 0.5*(windowHeight- oldHeight *windowScale);
		}else{//左右有空白，計算left
			var _left = 0.5*(windowWidth- oldWidth*windowScale);
		}
		$('#mainAnimation').offset({top: _top , left: _left});

		//子物件scale, 並offset
		var childrenArray = $('#mainAnimation').children();
		var len = childrenArray.length;
		for(var i = 0 ; i<len ; i++){
			var domElement = childrenArray[i];
			var TwindowScale = windowScale;
			if($(domElement).attr('id')==='canvas'){
				TwindowScale/=resolutionScale;
			}
			$(domElement).css({'-webkit-transform': 'scale(' + TwindowScale+')',
						            '-moz-transform': 'scale(' + TwindowScale + ')',
						            '-ms-transform': 'scale(' + TwindowScale + ')',
						            '-o-transform': 'scale(' + TwindowScale + ')',
						            'transform': 'scale(' + TwindowScale + ');'})
							.offset({top: _top , left: _left});
			}
		/*$('#mouseCircle').css({'-webkit-transform': 'scale(' + windowScale+')',
						            '-moz-transform': 'scale(' + windowScale + ')',
						            '-ms-transform': 'scale(' + windowScale + ')',
						            '-o-transform': 'scale(' + windowScale + ')',
						            'transform': 'scale(' + windowScale + ');'});*/
		

			


		
	}

	MyJS.myResize = myResize;


	//resize
	myResize();

	//no drag
	$('#mainAnimation').on('dragstart', function(event) { event.preventDefault(); })
						.css('margin','0px auto')
						.css('overflow','hidden');

	$(window).resize(myResize);

	$('body').prop('scroll','no').css('overflow','hidden');

	

	//detectBrowser
	function detectBrowser(){

		//isMobile
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
			browserInfo.isMobile = true;
		}


		//browser version
		// Opera 8.0+
	    browserInfo.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	    // Firefox 1.0+
	    browserInfo.isFirefox = typeof InstallTrigger !== 'undefined';
	    // Safari 3.0+ "[object HTMLElementConstructor]" 
	    browserInfo.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
	    // Internet Explorer 6-11
	    browserInfo.isIE = /*@cc_on!@*/false || !!document.documentMode;
	    // Edge 20+
	    browserInfo.isEdge = !browserInfo.isIE && !!window.StyleMedia;
	    // Chrome 1+
	    browserInfo.isChrome = !!window.chrome && !!window.chrome.webstore;
	    // Blink engine detection
	    browserInfo.isBlink = (browserInfo.isChrome || browserInfo.isOpera) && !!window.CSS;




	    //os
	    var userAgent = window.navigator.userAgent,
      	    platform = window.navigator.platform,
      	    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      		iosPlatforms = ['iPhone', 'iPad', 'iPod'];
      
		if (macosPlatforms.indexOf(platform) !== -1) {
			browserInfo.isMacOS = true;
		} else if (iosPlatforms.indexOf(platform) !== -1) {
		    browserInfo.isIOS = true;
		} else if (windowsPlatforms.indexOf(platform) !== -1) {
		    browserInfo.isWondows = true;
		} else if (/Android/.test(userAgent)) {
		    browserInfo.isAndroid = true;
		} else if (!os && /Linux/.test(platform)) {
		    browserInfo.isLinux = true;
		}


		
	}


	function myFullScreen() {
		t=theWorld;
		var element=$('#mainAnimation').get(0);

		if(t.isFullscreened){//退出全螢幕
			if (document.exitFullscreen)document.exitFullscreen();
	        else if (document.webkitExitFullscreen)document.webkitExitFullscreen();
	        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
	        else if (document.msExitFullscreen)document.msExitFullscreen();
			t.isFullscreened=false;
		}else{//進入全螢幕
			if(element.requestFullscreen)element.requestFullscreen();
			else if(element.mozRequestFullScreen)element.mozRequestFullScreen();
			else if(element.webkitRequestFullscreen)element.webkitRequestFullscreen();
			else if(element.msRequestFullscreen)element.msRequestFullscreen();
			t.isFullscreened=true;
		}
	}
	MyJS.myFullScreen = myFullScreen;


})();


//world2D


//--老師幫你前置作業(開始)--//
var comp=AdobeAn.getComposition("98EA1A955B63F6489D0F00F6BFD1C4DE");//連結到animate/myAnimate.js
var lib=comp.getLibrary();
var world2D = new lib.myAnimate();//用 myAnimate 物件存取舞台
var canvas2D = $('<canvas>').attr('width','1600px').attr('height','900px');//產生 canvas
var canvas3D = $('<canvas>').attr('width','1600px').attr('height','900px');//產生 canvas
$('#mainAnimation').append(canvas3D).append(canvas2D);//將 canvas 加到 html 理
var stage2D = new createjs.Stage(canvas2D[0]);//產生舞台 stage
stage2D.enableMouseOver(1000/30);//讓 stage 可以 mouseover
stage2D.addChild(world2D);//把 myAnimate 加到 stage 上 
createjs.Touch.enable(stage2D);//讓 stage 可以 touch (觸控螢幕可用)
stage2D.update();//更新舞台


// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);



//world3D
var world3D={};
world3D.cameraRR=20;
world3D.cameraTheta=75*Math.PI/180;
world3D.cameraPhi=0*Math.PI/180;
//Three.js
world3D.scene = new THREE.Scene();
var scene = world3D.scene;
world3D.camera = new THREE.PerspectiveCamera( 45, 1600 / 900, 0.01, 100000 );
world3D.cameraTarget=new THREE.Vector3(0,0,0);
world3D.cameraDragAndRotate=true;
world3D.renderer = new THREE.WebGLRenderer({ canvas: canvas3D[0] , antialias: true });
world3D.renderer.setSize( 1600, 900 );
world3D.raycaster = new THREE.Raycaster();
//stats
var stats = new Stats();
$('#mainAnimation').append(stats.dom);
stats.dom.style.visibility='visible';
Object.defineProperty(stats, 'visible', {
	get:function () {
	  return (stats.dom.style.visibility==='visible');
	},
	set:function (_v){
		if(_v){
			stats.dom.style.visibility='visible';
		}else{
			stats.dom.style.visibility='hidden';
		}
	}
  });
stats.visible=false;

  
//stats.dom.style.visibility='hidden';

//light
var directionalLight=new THREE.DirectionalLight(0xFFFFFF , 1);
directionalLight.position.set(5,10,7.5);
world3D.scene.add(directionalLight);
var ambientLight = new THREE.AmbientLight( 0x666666 );
world3D.scene.add( ambientLight );


//mouse camera drag
world2D.btn3D.on('mousedown',myMouseDown);
world2D.btn3D.on('pressmove',myMouseMove);
world2D.btn3D.on('pressup',myMouseUp);
world3D.camera.isDraging=false;
world3D.camera.oldMouseX=0;
world3D.camera.oldMouseY=0;
//slCameraRR in world2D
world2D.slCameraRR.minimum=1;
world2D.slCameraRR.maximum=200;
world2D.slCameraRR.value=80;
world2D.slCameraRR.setLabel('遠近');

function myMouseDown(e){
	world3D.camera.isDraging=true;
	world3D.camera.oldMouseX=stage2D.mouseX;
	world3D.camera.oldMouseY=stage2D.mouseY;
}
function myMouseMove(e){
	if(world3D.camera.isDraging && world3D.cameraDragAndRotate){
		var nx=stage2D.mouseX;
		var ny=stage2D.mouseY;

		world3D.cameraPhi-=0.005*(nx-world3D.camera.oldMouseX);
		while(world3D.cameraPhi>Math.PI){world3D.cameraPhi-=2*Math.PI;}
		while(world3D.cameraPhi<-Math.PI){world3D.cameraPhi+=2*Math.PI;}

		world3D.cameraTheta-=0.005*(ny-world3D.camera.oldMouseY);
		if(world3D.cameraTheta>0.9999*Math.PI){world3D.cameraTheta=0.9999*Math.PI;}
		if(world3D.cameraTheta<0.0001*Math.PI){world3D.cameraTheta=0.0001*Math.PI;}

		world3D.camera.oldMouseX=nx;
		world3D.camera.oldMouseY=ny;
	}
	
}
function myMouseUp(e){
	world3D.camera.isDraging=false;
}

//render 3D 場景
world3D.render = function() {
	//設定攝影機位置
	world3D.cameraRR=world2D.slCameraRR.value;
	world3D.camera.position.x=world3D.cameraRR*Math.sin(world3D.cameraTheta)*Math.sin(world3D.cameraPhi)+world3D.cameraTarget.x;
	world3D.camera.position.z=world3D.cameraRR*Math.sin(world3D.cameraTheta)*Math.cos(world3D.cameraPhi)+world3D.cameraTarget.z;
	world3D.camera.position.y=world3D.cameraRR*Math.cos(world3D.cameraTheta)+world3D.cameraTarget.y;
	world3D.camera.lookAt(world3D.cameraTarget);
	//render
	world3D.renderer.render( world3D.scene, world3D.camera );
	//stats
	stats.update();
}