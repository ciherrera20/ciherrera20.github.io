// Makes a elem draggable
function draggable(elem, onPosChange, onMousedown, onMouseup) {
	var mousePosition;
	var offset = [0, 0];
	var isDown = false; // Flag for the mousemove callback to start dragging
	
	// Detects when the elem has been clicked on to initiate dragging
	function mousedown(e) {
		e.stopPropagation();
		
		isDown = true;
		offset = [
			elem.offsetLeft - e.clientX,
			elem.offsetTop - e.clientY
		];
		
		if (onMousedown !== undefined)
			onMousedown(offset, e);
	}
	
	// Detects when the elem is released to stop dragging
	function mouseup(e) {
		if (isDown) {
			mousePosition = {
				x: e.clientX,
				y: e.clientY
			};
			
			// Calculated x and y for the elem
			var trueX = mousePosition.x + offset[0], trueY = mousePosition.y + offset[1];
			
			// Sets the elem's new position
			if (onMouseup !== undefined)
				onMouseup(trueX, trueY, e);
		}
		isDown = false;
	}
	
	// Detects mouse movement to perform the dragging action
	function mousemove(e) {
		e.preventDefault();
		if (isDown) {
			mousePosition = {
				x: e.clientX,
				y: e.clientY
			};
			
			// Calculated x and y for the elem
			var trueX = mousePosition.x + offset[0], trueY = mousePosition.y + offset[1];
			
			// Sets the elem's new position
			if (onPosChange !== undefined)
				onPosChange(trueX, trueY, e);
		}
	}
	
	elem.mouseup = mouseup;
	elem.mousemove = mousemove;
	
	elem.addEventListener("mousedown", mousedown); // Detects clicks on elem
	document.addEventListener("mouseup", mouseup); // Added to document in case mouse is separated from the elem
	document.addEventListener("mousemove", mousemove); // Detects mouse movement on the entire document
}