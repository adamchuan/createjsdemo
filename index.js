var Game = (function() {

	var speed = 3000, speedOffset = 3000;

		width = document.body.clientWidth * 2,

		height = document.body.clientHeight * 2;

	canvas = document.createElement("canvas");

	canvas.width = width;

	canvas.height = height;

	canvas.id = "gameCanvas";

	var WINSCORE = 10,

		INITED = false;

	var spriteData = {

		images: ["game/sprite.png"],

		frames: [
		    // x, y, width, height, imageIndex*, regX*, regY*
		    [0, 0, 76, 116],

		    [0, 142, 76, 124],

		    [0, 304, 48, 94]

		]

	}

	var spriteSheet = new createjs.SpriteSheet(spriteData);

	function makefire() {

		var fire = new createjs.Sprite(spriteSheet);

		var index = Math.floor( Math.random() * 3 ) ;

		fire.gotoAndStop( index );
		
		var fireWidth = spriteData.frames[index][2],

			fireHeight = spriteData.frames[index][3];

		fire.x = Math.floor( Math.random() *  (width - fireWidth ) );

		fire.y = -fireHeight;

		fire.id = "fire" + Date.now();

		createjs.Tween.get(fire)

		.to({

			y: height + fireHeight

		}, speed + Math.floor( Math.random() * speedOffset ), createjs.Ease.linear);

		createjs.Tween.get(fire,{

			loop : true

		})

		.to({

			alpha: 0.8,

			scaleX : 1.05 ,

			scaley : 1.05

		},300);

		data.makeCount ++ ;

		return fire;

	}

	function removefire(fire) {

		Entity.stage.removeChild(fire);

	}

	function _makeBg(){

		var imageBg = new createjs.Bitmap("game/cold_head.jpg");

		var imageSrc = imageBg.image;

		imageSrc.onload = function(){

			var imageWidth = imageSrc.naturalWidth ,

				imageHeight = imageSrc.naturalHeight

			if( imageWidth / imageHeight > width / height){ //按高度缩放

				var percent = height / imageHeight ;

			}else {

				var percent = width / imageWidth ;

			}
			imageBg.setTransform ( 0 , 0 , percent , percent )
			
			Entity.stage.addChild(imageBg);

			console.log(imageBg);

		}


	}

	function _clickEvent(event){

		var fire = event.target;

		console.log(fire);

		if( 0 > fire.id.indexOf("fire") ){

			return ;

		}

		createjs.Tween.get(fire)

		.to({

			alpha: 0

		}, 1000 , createjs.Ease.linear)

		.call(function(event){

			for(var i = 0 ; i < Entity.fires.length ; i++ ){
		
				if( Entity.fires[i].id === fire.id ){

					removefire(fire);

					Entity.fires.splice(i,1);

					console.log( ++data.score );

					break;

				}
				
			}

		});

		data.makeCount ++ ;

	}

	var Entity = {

		canvas: canvas,

		stage: null,

		fires: []

	}



	var data = {

		makeCount : 0 ,

		runCount : 0 ,

		score : 0,

		loopCount : Math.floor(3000 / 60)
	}

	return {

		init: function() {

			if(INITED){

				return ;

			}

			document.body.appendChild(Entity.canvas);

			Entity.stage = new createjs.Stage(Entity.canvas);

			createjs.Touch.enable(Entity.stage);

			createjs.Ticker.setFPS(60);

			_makeBg();

			Entity.stage.addEventListener('click', _clickEvent);

			INITED = true;
			
		},

		start: function() {

			var fire = makefire();

			Entity.stage.addChild(fire);

			Entity.fires.push(fire);
			//createjs.Ticker.addEventListener("tick", Entity.stage);

			createjs.Ticker.addEventListener("tick", this.update.bind(this));

		},

		end: function() {

			createjs.Ticker.removeAllEventListeners('tick');

		},

		update: function(event) {

			var time = event;

			var fires = Entity.fires;

			checkWin.bind(this)();

			checkForAdd();

			checkForDel();

			function checkWin(){

				if( data.score >= WINSCORE){

					this.end();

				}

			}

			function checkForAdd(){

				if( ++data.runCount === data.loopCount ){

					data.runCount = 0 ;

					var fire = makefire();

					Entity.fires.push(fire);

					Entity.stage.addChild(fire);

				}

			}

			function checkForDel(){

				for( var i = 0 , fire = null ; i < fires.length ; i ++){

					fire = fires[i];

					if(fire.y > height + 50){

						removefire(fire);

						fires.splice(i,1);

						i -- ;

					}



				}

			}



			Entity.stage.update();

		},

		disable: function() {


		},

		enable: function() {

		}

	}

})();

window.onload = function() {

	Game.init();

	Game.start();

}