// Last element of the array
Object.defineProperty(Array.prototype, "last", {get(){return this[this.length - 1]}});

// Remove a given element of the array
Array.prototype.remove = function(toRemove) {
	let i = this.indexOf(toRemove);
	if (i !== -1)
		this.splice(i, 1);
}

// Returns an empty object with null as a prototype
function empty() {
	return Object.create(null);
}

// Returns an empty object with *o* as a prototype
function object(o) {
	return Object.create(o);
}

// Adds properties whose names are the elements in *array* to *object* and sets their values to *value*
function populate(array, object = empty(), value = null) {
	array.forEach(function(name) {
		object[name] = value;
	});
	return object;
}

{
	// Template for inputs for use in components
	{
		var input = populate(["sourceComp", "outputIndex", "parent"]);
		let that = input;

		that.set = function(sourceComp, outputIndex) {
			if (this.sourceComp !== null)
				this.sourceComp.removeOutput(that, outputIndex);
			
			this.sourceComp = sourceComp;
			if (sourceComp === null)
				this.outputIndex = null;
			else
				this.outputIndex = outputIndex;
					
			if (sourceComp !== null) {
				sourceComp.addOutput(that, outputIndex);
			}
		}

		that.getValue = function() {
			return this.sourceComp.outputs[this.outputIndex];
		}
	}
	
	{
		var nand = empty();
		let that = nand;
		
		let numInputs = 2;
		let numOutputs = 1;
		
		that.getInstance = function() {
			
		}
	}
}