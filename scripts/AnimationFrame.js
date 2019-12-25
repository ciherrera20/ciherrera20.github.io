{
	let animationFrameTemplate = Object.create(null);

	var AnimationFrame = function(frame, fps) {
		if (this.constructor === AnimationFrame) {
			return AnimationFrame(...arguments);
		}
	
		let that = createObject(animationFrameTemplate, AnimationFrame);
	
		var requestID = 0;

		if (!fps)
		   var fps = 60;
		else
		   var fps = fps;
		
		var frame = frame;

		that.start = function() {
			var then = performance.now();
			var interval = 1000 / fps;
			var tolerance = 0.1;
					   
			var animateLoop = function(now) {
				requestID = requestAnimationFrame(animateLoop);
				var delta = now - then;

				if (delta >= interval - tolerance) {
					then = now - (delta % interval);
					frame(delta);
				}
			};
			requestID = requestAnimationFrame(animateLoop);
		}

		that.stop = function() {
			cancelAnimationFrame(requestID);
		}
		
		that.getFPS = function() {
			return fps;
		}
		
		return that;
	}
}