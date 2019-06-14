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
		let numOutputs = 2;
		
		that.getInstance = function() {
			let parent = that;
			let that = empty();
			
			let inputs = generateInputs(numInputs, parent);
			let outputs = [];
			let outputComps = generateOutputComps(numOutputs);
			
			that.addOutput = function(outComp, outputIndex) {
				outputComps[outputIndex].push(outComp);
			}
			
			that.removeOutput = function(outComp, outputIndex) {
				outputComps[outputIndex].remove(outComp);
			}
			
			that.evaluate = function() {
				outputs[0] = !(inputs[0].getValue() && inputs[1].getValue());
			}
			
			that.propagateChange = function() {
				outputComps.forEach(function(outputIndex, i) {
					outputIndex.forEach(function(outComp, j) {
						outComp.evaluate();
					});
				});
			}

			Object.defineProperty(that, "numInputs", {get(){return numInputs}});
			Object.defineProperty(that, "numOutputs", {get(){return numOutputs}});
		}
		
		Object.defineProperty(that, "numInputs", {get(){return numInputs}});
		Object.defineProperty(that, "numOutputs", {get(){return numOutputs}});
	}

	{
		var toggleable = empty();
		let that = toggleable;

		let numInputs = 0;
		let numOutputs = 1;

		that.getInstance = function() {
			let parent = that;
			let that = empty();

			let inputs = generateInputs(numInputs);
			let outputComps = generateOutputComps(numOutputs);
		}
	}
}

function generateInputs(numInputs, parent) {
	let inputs = [];
	while (inputs.length < numInputs) {
		let input = object(input);
		input.parent = parent;
		inputs.push(input);
	}
	return inputs;
}

function generateOutputComps(numOutputs) {
	let outputs = [];
	while (outputs.length < numOutputs) {
		outputs.push([]);
	}
}