var Game = (function() {

	var speed = 3000, speedOffset = 3000;

		width = document.body.clientWidth * 2,

		height = document.body.clientHeight * 2;

	canvas = document.createElement("canvas");

	canvas.width = width;

	canvas.height = height;

	canvas.id = "gameCanvas";

	var R = 50 , 

	MIN_X = R,

	MAX_X = width - R ,

	MIN_Y = - R,

	MAX_Y = height + R ,

	WINSCORE = 1;

	function makeCircle() {

		var circle = new createjs.Shape();

		circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);

		circle.x = 50 + Math.floor( Math.random() * MAX_X );

		circle.y = -50;

		circle.id = "circle" + Date.now();

		createjs.Tween.get(circle)

		.to({

			y: MAX_Y

		}, speed + Math.floor( Math.random() * speedOffset ), createjs.Ease.linear);

		data.makeCount ++ ;

		return circle;

	}

	function removeCircle(circle) {

		Entity.stage.removeChild(circle);

	}

	function _clickEvent(event){

		var circle = event.target;

		console.log(circle);

		if( 0 > circle.id.indexOf("circle") ){

			return ;

		}

		createjs.Tween.get(circle)

		.to({

			alpha: 0

		}, 1000 , createjs.Ease.linear)

		.call(function(event){

			for(var i = 0 ; i < Entity.circles.length ; i++ ){
		
				if( Entity.circles[i].id === circle.id ){

					removeCircle(circle);

					Entity.circles.splice(i,1);

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

		circles: []

	}



	var data = {

		makeCount : 0 ,

		runCount : 0 ,

		score : 0,

		loopCount : Math.floor(3000 / 60)
	}

	return {

		init: function() {

			document.body.appendChild(Entity.canvas);

			Entity.stage = new createjs.Stage(Entity.canvas);

			createjs.Touch.enable(Entity.stage);

			createjs.Ticker.setFPS(60);

			Entity.stage.addEventListener('click', _clickEvent);

		},

		start: function() {

			var circle = makeCircle();

			Entity.stage.addChild(circle);

			Entity.circles.push(circle);
			//createjs.Ticker.addEventListener("tick", Entity.stage);

			createjs.Ticker.addEventListener("tick", this.update.bind(this));

		},

		end: function() {

			createjs.Ticker.removeAllEventListeners('tick');

		},

		update: function(event) {

			var time = event;

			var circles = Entity.circles;

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

					var circle = makeCircle();

					Entity.circles.push(circle);

					Entity.stage.addChild(circle);

				}

			}

			function checkForDel(){

				for( var i = 0 , circle = null ; i < circles.length ; i ++){

					circle = circles[i];

					if(circle.y > height + 50){

						removeCircle(circle);

						circles.splice(i,1);

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