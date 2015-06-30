var Game = (function() {

	var speed = 3000, speedOffset = 3000;

		width = document.body.clientWidth * 2,

		height = document.body.clientHeight * 2;

	canvas = document.createElement("canvas");

	canvas.width = width;

	canvas.height = height;

	canvas.id = "gameCanvas";

	var WINSCORE = 20, 

		imageData ,

		spriteData ,

	    cupSpriteData1 , 

	    cupSpriteData2 , 

	    bgData,

	    spriteSheet ,

	    cupSpriteData1,

	    cupSpriteData2,

	    icecount = 0 ,

		INITED = false;



	function _dataInit(){

		spriteData = {

			images: [ imageData.sprite ],

			frames: [
			    // x, y, width, height, imageIndex*, regX*, regY*
			    [0, 0, 76, 116],

			    [0, 142, 76, 124],

			    [0, 304, 48, 94]

			]

		}

		bgData = {

			hothead : imageData.hothead ,

			coldhead : imageData.coldhead ,

			halfhead : imageData.halfhead

		}

		cupSpriteData1 = {

			images : [ imageData.cup1 ] ,

			frames: [

				[0 , 0 , 386 , 586],

				[0 , 592 , 386 , 586]

			]

		}
		cupSpriteData2 = {

			images: [ imageData.cup2 ] ,

			frames : [

				[0 , 0 , 386, 138] ,

				[0 , 144 , 386 , 184 ] , 

				[0 , 334 , 386 , 230 ] , 

				[0 , 570 , 386 , 280 ] , 

				[0 , 856 , 386 , 328 ] , 

				[0 , 1190 , 386 , 376 ] , 

				[0 , 1572 , 386 , 424 ] , 

				[0 , 2002 , 386 , 472 ] , 

				[0 , 2498 , 386 , 490 ] 

			]

		}
		
		spriteSheet = new createjs.SpriteSheet(spriteData);

		cupSpriteSheet1 = new createjs.SpriteSheet(cupSpriteData1);

		cupSpriteSheet2 = new createjs.SpriteSheet(cupSpriteData2);

		// 计算元素缩放比
		var imageWidth = imageData.hothead.width ,

			imageHeight = imageData.hothead.height

		if( imageWidth / imageHeight > width / height){ //按高度缩放

			data.percent = height / imageHeight ;

		}else {

			data.percent = width / imageWidth ;

		}

	}

	var Entity = {

		canvas: canvas,

		stage: null,

		bg : null,

		fires: [] ,

		text : null 

	}

	var data = {

		makeCount : 0 ,

		runCount : 0 ,

		score : 0,

		oldscore : 0,

		bgState : 0,

		loopCount : Math.floor(3000 / 60)

	}


	function _makefire() {

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

		data.makeCount ++ ;

		return fire;

	}

	function _removefire(fire) {

		createjs.Tween.removeTweens(fire);

		Entity.fireContainer.removeChild(fire);

	}

	function _changeBg(imageBg,callback){

		imageBg.alpha = 0 ;

		console.log( imageBg );

		Entity.bgContainer.addChild(imageBg);

		createjs.Tween.get(imageBg)

		.to({

			alpha : 1,

		},500);

		createjs.Tween.get(Entity.bg)

		.to({

			alpha : 0 ,

			visible:false

		},500)

		.call( function(event){

			Entity.bg = imageBg;

			if(callback){

				callback();

			}

		});

	}

	function _makeBg(name){

		var imageBg = new createjs.Bitmap(name);

		imageBg.setTransform ( 0 , 0 , data.percent , data.percent );
	
		return imageBg;

	}

	function _clickEvent(event){

		var fire = event.target;

		if( 0 > fire.id.toString().indexOf("fire") ){

			return ;

		}

		_addIce();

		_updateScore();

		createjs.Tween.removeTweens(fire);

		createjs.Tween.get(fire)
	
		.to({

			alpha: 0

		}, 500 , createjs.Ease.linear)

		.call(function(){

			for(var i = 0 ; i < Entity.fires.length ; i++ ){
			
				if( Entity.fires[i].id === fire.id ){

					_removefire(fire);

					Entity.fires.splice(i,1);

					break;

				}
				
			}

		});

	}

	function _updateScore(){

		data.oldscore = data.score;

		++data.score ;

		if( data.score < 10 ){

			Entity.text.text = "0" + data.score.toString();;
		
		} else {

			Entity.text.text = data.score.toString();

		}

	}
	function _checkWin(){

		var trigerScore1 = Math.floor( WINSCORE / 2 ),

			trigerScore2 = WINSCORE;

		if( data.makeCount >= 40){

			game.end();

			if( cb_fail ){

				cb_success();

			}

		}

		else if( data.score == 5 && data.bgState == 0){

			data.bgState = 1;

			var newBg = _makeBg(bgData.halfhead);

			_changeBg( newBg );


		}

		else if( data.score == 10 && data.bgState == 1){

			data.bgState = 2;

			Entity.stage.removeEventListener("click", _clickEvent);

			var newBg = _makeBg(bgData.coldhead);

			_changeBg( newBg , function(){

				createjs.Tween.get( Entity.fireContainer )

				.to({

					alpha : 0,

					visible : false

				},500)

				.call(function(){

					Entity.fires = [];

					game.end();

					if( cb_success ){

						cb_success()

					}

				});

			});

		}

	}

	function _addIce(){

		if( icecount > cupSpriteData2.frames.length ){

			return ;

		} else if ( icecount == cupSpriteData2.frames.length ){

			var next = function(){

				Entity.cupContainer.removeChildAt(0 , 1);

			}

			var cup = new createjs.Sprite( cupSpriteSheet1 );

			cup.gotoAndStop( 1 );

			cup.x = ( width - cupSpriteData1.frames[1][2] ) / 2;

			cup.y = height - cupSpriteData1.frames[0][3] - 100;

		} else {

			var cup = new createjs.Sprite( cupSpriteSheet2 );

			cup.gotoAndStop( icecount );

			if( icecount >=  1){

				var next = function(){

					Entity.cupContainer.removeChildAt(1);

				}

			}

			cup.x = ( width - cupSpriteData1.frames[0][2] ) / 2 ;

			cup.y = height - 100 - cupSpriteData2.frames[icecount][3];

		}

		cup.alpha =  0;

		Entity.cupContainer.addChild( cup );

		createjs.Tween.get(cup)

		.to({

			alpha : 1

		},500)

		.call(next);

		icecount ++;

	}

	function _initCup(){

		var cup = new createjs.Sprite( cupSpriteSheet1 );

		cup.gotoAndStop( 0 );

		cup.x = ( width - cupSpriteData1.frames[0][2] ) / 2;

		cup.y = height - cupSpriteData1.frames[0][3] - 100;

		Entity.cupContainer.addChild( cup );

	}

	function _initLogo(){

		var logo = new createjs.Bitmap( imageData.logo );

		var logoWidth = imageData.logo.width ,

			logoHeight = imageData.logo.height ;

		logo.x = ( width - logoWidth ) / 2 ; 

		logo.y = ( height - cupSpriteData1.frames[0][3] )  ;

		console.log( logo.sourceRect );

		Entity.logoContrainer.addChild ( logo );

	}

	function _initScorePanel(){

		var panelWidth = 52,

			panelHeight = 64;

		var cupTop = height - cupSpriteData1.frames[0][3] ;

		var panel = new createjs.Shape();


		panel.graphics

		.f("#154869")

		.rr( width / 2 - panelWidth / 2 - 40 , ( cupTop + 120 ) , panelWidth , panelHeight , 5 ) 
		
		.rr( width / 2 - panelWidth / 2 + 40 , ( cupTop + 120 ) , panelWidth , panelHeight , 5 )

		.ef()

		.f("#154869")

		.dc( width / 2  , cupTop + 140 , 6)

		.dc( width / 2  , cupTop + 165 , 6)

		.ef();

		var text = new createjs.Text("00", "32px Arial", "#ffc600");

		text.x = width / 2 - 58 ;

		text.y = cupTop + 135;
		
		Entity.text = new createjs.Text( "00" , "32px Arial", "#ffc600");

		Entity.text.x = width / 2 + 22 ;

		Entity.text.y = cupTop + 135;

		Entity.logoContrainer.addChild( panel ); 

		Entity.logoContrainer.addChild( text ) ;

		Entity.logoContrainer.addChild( Entity.text );
	

	}

	function _createContainer(){

		var container = new createjs.Container();

		container.x = 0 ;

		container.y = 0 ;

		return container;

	}

	var cb_success,cb_fail;

	var game = {

		init: function( config ) {

			if(INITED ){

				return ;

			}

			config = config || {}

			imageData = config.imageData ;

			cb_success = config.success;

			cb_fail = config.fail;

			document.body.appendChild(Entity.canvas);

			_dataInit();

			Entity.stage = new createjs.Stage(Entity.canvas);

			/* Start 创建背景层容器 */

			Entity.bgContainer = _createContainer();

			Entity.stage.addChild( Entity.bgContainer );

			/* end 创建背景容器 */

			
			/* Start 创建杯子层容器 */

			Entity.cupContainer = _createContainer();

			Entity.stage.addChild( Entity.cupContainer );

			_initCup();

			/* End 创建被子层容器 */

			Entity.logoContrainer = _createContainer();

			Entity.stage.addChild( Entity.logoContrainer );

			_initScorePanel();

			_initLogo();

			Entity.readyContainer = _createContainer();

			Entity.stage.addChild( Entity.logoContrainer );

			/* Start 创建火焰层容器 */

			Entity.fireContainer = _createContainer();

			Entity.stage.addChild( Entity.fireContainer );

			/* End 创建火焰层容器 */


			createjs.Touch.enable( Entity.stage );

			createjs.Ticker.setFPS(60);

			Entity.bg = _makeBg( bgData.hothead );

			Entity.bgContainer.addChild(Entity.bg);

			INITED = true;
			
		},

		start: function() {

			Entity.stage.addEventListener("click", _clickEvent);

			createjs.Ticker.addEventListener("tick", this.update.bind(this));

		},

		end: function() {

			createjs.Ticker.removeAllEventListeners('tick' , this.update);

		},

		restart : function(){

			data = {

				makeCount : 0 ,

				runCount : 0 ,

				score : 0,

				oldscore : 0,

				bgState : 0,

				loopCount : Math.floor(3000 / 60)

			}

			this.start();

		},

		update: function(event) {

			var time = event;

			var fires = Entity.fires;

			checkForAdd();

			checkForDel();

			_checkWin();

			function checkForAdd(){

				if( ++data.runCount === data.loopCount ){

					data.runCount = 0 ;

					var fire = _makefire();

					Entity.fires.push(fire);

					Entity.fireContainer.addChild(fire);

				}

			}

			function checkForDel(){

				for( var i = 0 , fire = null ; i < fires.length ; i ++){

					fire = fires[i];

					if(fire.y > height + 50){

						_removefire(fire);

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

	return game;

})();
