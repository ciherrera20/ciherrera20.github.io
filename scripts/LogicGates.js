// Last element of the array
Object.defineProperty(Array.prototype, "last", {get(){return this[this.length - 1]}});

// Remove a given element of the array
Array.prototype.remove = function(toRemove) {
	let that = this;
	this.forEach(function(element, i) {
		if (element === toRemove)
			that.splice(i, 1);
	});
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

// Scope for all components in which to store data about operations
{
	let objsVisited = []; // All objects visited when an output is evaluated are stored here in order to prevent infinite loops
	let frameInitialized = false; // The first time evaluate is called, this is set to true. When that component has finished evaluating its inputs, it sets it back to false
	
	// Create a scope for the connection variable
	{
		var connection = empty(); // Object to store the connection factory
		let that = connection;
		
		// Connection factory. Returns a connection object that returns its input when evaluated
		that.getInstance = function() {
			function connection() {};
			connection.prototype = empty();
			
			let parent = this;
			let inst = new connection();
			let that = inst;
			
			let numInputs = 1;
			let numOutputs = 1;
			let inputs = populate(["comp", "outputIndex"]);
			//let lastInput = [false];
			let lastOutputs = [false];
			let outputs = [];
			let outputComps = generateOutputComps(numOutputs);
			let name = "connection";
			let visited = false;
		
			that.clearVisit = function() {
				visited = false;
			};
		
			that.setInput = function(comp, outputIndex) {
				//console.log(inputs.comp, outputIndex);
				if (inputs.comp !== null)
					inputs.comp.removeOutput(that, outputIndex);
				
				inputs.comp = comp;
				if (comp === null)
					inputs.outputIndex = null;
				else
					inputs.outputIndex = outputIndex;
				
				if (comp !== null) {
					comp.addOutput(that, outputIndex);
				}
			};
			
			that.addOutput = function(comp, outputIndex) {
				outputComps[outputIndex].push(comp);
			};
			
			that.removeOutput = function(comp, outputIndex) {
				console.log(outputComps[outputIndex]);
				outputComps[outputIndex].remove(comp);
			};
		
			let evaluate = function() {
				if (!visited) {

					visited = true;
					objsVisited.push(that);
					
					if (inputs.comp === null) {
						lastOutputs = [false];
					} else {
						let in1 = inputs.comp.outputs[inputs.outputIndex];
						lastOutputs = [in1];
					}
					
					return lastOutputs;
				} else {
					return lastOutputs;
				}
			};
		
			Object.defineProperty(that, "inputs", {get() {return inputs}})
			Object.defineProperty(that, "outputs", {get() {
				if (!frameInitialized) {
					frameInitialized = true;
					let tempOutputs = evaluate();
					frameInitialized = false;
					
					objsVisited.forEach(function(obj) {
						obj.clearVisit();
					});
				
					return tempOutputs;
				}
				
				return evaluate();
			}});
			Object.defineProperty(that, "lastOutputs", {get() {return lastOutputs}});
			Object.defineProperty(that, "outputComps", {get() {return outputComps}});
			Object.defineProperty(that, "numInputs", {get() {return numInputs}});
			Object.defineProperty(that, "numOutputs", {get() {return numOutputs}});
			Object.defineProperty(that, "name", {get() {return name}});
			Object.defineProperty(that, "parent", {get() {return parent}});
			
			return that;
		}
	}
	
	// Create a scope for the toggleable variable
	{
		var toggleable = empty(); // Object to store the toggleable factory
		let that = toggleable;
		
		// Toggleable factory. Returns a toggleable component that outputs its own internal state which can be set by the user.
		that.getInstance = function() {
			function toggleable() {};
			toggleable.prototype = empty();
			
			let parent = this;
			let inst = new toggleable;
			let that = inst;	
			
			let numInputs = 0;
			let numOutputs = 1;
			let inputs = generateConnections(numInputs, that);
			let outputComps = generateOutputComps(numOutputs);
			let lastOutputs = [false];
			let state = false;
			let name = "toggleable";
			
			that.setState = function(newState, eval = true) {
				state = (newState === true);
				
				if (!eval)
					return;
				
				// let topComponents = [];
				
				// function findTopComponents(comp) {
					// if (comp.checkedForTop !== undefined) {
						// console.log("Already checked for top");
						// return;
					// }
					
					// comp.checkedForTop = true;
					// comp.visited = undefined;
				
					// let top = true;
					// comp.outputComps.forEach(function(outputs) {
						// outputs.forEach(function(outputComp) {
							// if (outputComp !== undefined) {
								// top = false;
								// findTopComponents(outputComp);
							// }
						// });
					// });
					
					// if (top) {
						// console.log("Found a " + comp.name);
						// topComponents.push(comp);
					// }
				// }
				
				// function clearVisits(comp) {
					// if (comp.visited !== undefined) {
						// console.log("Already visited");
						// return;
					// }
					
					// console.log("Clearing visit");
					
					// comp.visited = true;
					// comp.checkedForTop = undefined;
					
					// comp.outputComps.forEach(function(outputs) {
						// outputs.forEach(function(outputComp) {
							// clearVisits(outputComp);
						// });
					// });
				// }
				
				// findTopComponents(that);
				// clearVisits(that);
				
				// topComponents.forEach(function(comp) {
					// console.log("Evaluating top components, component is a " + comp.name);
					// console.log(comp.outputs);
					// comp.outputs;
				// });
				updateTop(that);
			};
			
			that.addOutput = function(comp, outputIndex) {
				outputComps[outputIndex].push(comp);
			};
			
			that.removeOutput = function(comp, outputIndex) {
				outputComps[outputIndex].remove(comp);
			};
			
			let evaluate = function() {
				lastOutputs = [state];
				return lastOutputs;
			};
			
			Object.defineProperty(that, "inputs", {get() {return inputs}});
			Object.defineProperty(that, "outputs", {get() {return evaluate()}});
			Object.defineProperty(that, "lastOutputs", {get() {return lastOutputs}});
			Object.defineProperty(that, "outputComps", {get() {return outputComps}});
			Object.defineProperty(that, "numInputs", {get() {return numInputs}});
			Object.defineProperty(that, "numOutputs", {get() {return numOutputs}});
			Object.defineProperty(that, "name", {get() {return name}});
			Object.defineProperty(that, "parent", {get() {return parent}});
		
			return inst;
		}
	}
	
	// Create a scope for the nand variable
	{
		var nand = empty(); // Object to store the nand factory
		let that = nand;
		
		// Nand factory. Returns a nand object that performs a logical nand on its outputs
		that.getInstance = function() {
			function nand() {};
			nand.prototype = empty();
			
			let parent = this;
			let inst = new nand();
			let that = inst;
			
			let numInputs = 2;
			let numOutputs = 1;
			let inputs = generateConnections(numInputs, that);
			let outputComps = generateOutputComps(numOutputs);
			//let lastInputs = inputs.map(function(input){return false});
			let lastOutputs = [false];
			let name = "nand";
			let visited = false;
			
			that.clearVisit = function() {
				visited = false;
			};
			
			that.setInput = function(i, value) {
				input[i] = value;
			};
			
			that.addOutput = function(comp, outputIndex) {
				outputComps[outputIndex].push(comp);
			};
			
			that.removeOutput = function(comp, outputIndex) {
				outputComps[outputIndex].remove(comp);
			};
			
			let evaluate = function() {
				if (!visited) {
					visited = true;
					objsVisited.push(that);
					
					//let lastInputs = inputs.map(function(input) {
					//	return input.outputs[0];
					//});
					
					let in1 = inputs[0].outputs[0];
					let in2 = inputs[1].outputs[0];
					lastOutputs = [!(in1 && in2)];
					
					//lastOutputs = [!(inputs[0].outputs[0] && inputs[1].outputs[0])];
					
					//let output = !(lastInputs[0] && lastInputs[1]);
					//return [output];
					
					return lastOutputs;
				} else {
					//return evaluateLast();
					return lastOutputs;
				}
			};
			
			//let evaluateLast = function() {
			//	return [!(lastInputs[0] && lastInputs[1])];
			//};
			
			Object.defineProperty(that, "inputs", {get() {return inputs}});
			Object.defineProperty(that, "outputs", {get() {
				if (!frameInitialized) {
					frameInitialized = true;
					let tempOutputs = evaluate();
					frameInitialized = false;
					
					objsVisited.forEach(function(obj) {
						obj.clearVisit();
					});
					
					return tempOutputs;
				}
				
				return evaluate();
			}});
			Object.defineProperty(that, "lastOutputs", {get() {return lastOutputs}});
			Object.defineProperty(that, "outputComps", {get() {return outputComps}});
			Object.defineProperty(that, "numInputs", {get() {return numInputs}});
			Object.defineProperty(that, "numOutputs", {get() {return numOutputs}});
			Object.defineProperty(that, "name", {get() {return name}});
			Object.defineProperty(that, "parent", {get() {return parent}});
			
			return inst;
		}
	}
	
	// Create a scope for the customComponent variable
	{
		var customComponent = empty(); // Object to store the customComponent factory
		let that = customComponent;
		
		// Custom component factory. Returns an object that contains methods for creating an internal structure of other components and a factory to create instances of this internal structure.
		that.getInstance = function(name, numInputs, numOutputs) {
			function customComponent() {};
			customComponent.prototype = empty();
			
			let parent = this;
			let comp = object(customComponent);
			let that = comp;
			
			let inputBuffer = generateConnections(numInputs);
			let outputBuffer = generateConnections(numOutputs);
			let instances = [];
			
			let evaluate = function() {
				var outputs = [];
				
				for (var i = 0; i < numOutputs; i++) {
					outputs[i] = outputBuffer.outputs[0];
				}
				
				return outputs;
			}
			
			function updateInstances() {
				instances.forEach(function(instance) {
					instance.update();
				});
			}
			
			comp.connectInputTo = function(connection, inputIndex) {
				/*let tempInput = empty();
				tempInput.inputIndex = inputIndex;
				
				connection.tempInput = tempInput;*/
				
				if (inputIndex !== null)
					connection.setInput(inputBuffer[inputIndex], 0);
				else
					connection.setInput(null, 0);
				
				updateInstances();
			}
			
			comp.connectOutputTo = function(comp, compOutputIndex, thisOutputIndex) {
				outputBuffer[thisOutputIndex].setInput(comp, compOutputIndex);
				updateInstances();
			}
			
			comp.addNewInput = function() {
				numInputs++;
				inputBuffer.push(connection.getInstance());
			}
			
			comp.addNewOutput = function() {
				numOutputs++;
				outputBuffer.push(connection.getInstance());
			}
			
			comp.getInstance = function() {
				let f = empty();
				f[name] = function(){};
				f[name].prototype = empty();
				
				let parent = this;
				let compInst = new f[name]();
				let that = compInst;
				
				let inputs = [];
				let outputComps = generateOutputComps(numOutputs);
				let lastOutputs = inputs.map(function(input){return false});
				let instOutputBuffer = [];
				
				function generateInternalStructure() {
					function duplicateComponent(comp) {
						if (comp === null) {
							return null;
						}
						
						//console.log("duplicating a " + comp.name);
						//console.log(comp === inputBuffer[0]);
						
						comp.visited = undefined;
						
						if (comp.duplicate !== undefined) {
							return comp.duplicate;
						}
						
						let duplicate = comp.parent.getInstance();
						comp.duplicate = duplicate;
						
						let index = inputBuffer.indexOf(comp);
						if (index !== -1) {
							//console.log("Found input");
							if (index[index] === undefined)
								inputs[index] = duplicate;
							
							return duplicate;
						}
						
						if (comp.parent !== connection) {
							comp.inputs.forEach(function(input, i) {
								let duplicateInput = duplicateComponent(input.inputs.comp);
								duplicate.inputs[i].setInput(duplicateInput, input.inputs.outputIndex);
								/*if (input.tempInput !== undefined) {
									duplicate.inputs[i].setInput(inputs[input.tempInput.inputIndex], 0);
								}*/
							});
						} else {
							let duplicateInput = duplicateComponent(comp.inputs.comp);
							duplicate.setInput(duplicateInput, comp.inputs.outputIndex);
						}
						
						return duplicate;
					}
					
					function clearDuplicates(comp) {
						if (comp === null)
							return;
							
						if (comp.visited !== undefined) {
							comp.visited = true;
							return;
						}
						
						comp.visited = true;
						
						comp.duplicate = undefined;
						if (comp.parent !== connection) {
							comp.inputs.forEach(function(input, i) {
								clearDuplicates(input.inputs.comp);
							});
						} else {
							clearDuplicates(comp.inputs.comp);
						}
					}
					
					outputBuffer.forEach(function(connection, i) {
						instOutputBuffer[i] = duplicateComponent(connection);
						instOutputBuffer[i].addOutput(that, 0);
					});
					
					outputBuffer.forEach(function(connection, i) {
						clearDuplicates(connection);
					});
				}
				generateInternalStructure();
				
				function evaluate() {
					let outputs = [];
					instOutputBuffer.forEach(function(connection, i) {
						outputs[i] = connection.outputs[0];
						lastOutputs[i] = outputs[i];
					});
					//console.log(lastOutputs);
					return outputs;
				}
				
				that.update = function() {
					inputs = [];
					outputComps = generateOutputComps(numOutputs);
					lastOutputs = inputs.map(function(input){return false});
					instOutputBuffer = [];
					generateInternalStructure();
				}
				
				that.addOutput = function(comp, outputIndex) {
					outputComps[outputIndex].push(comp);
				};
				
				that.removeOutput = function(comp, outputIndex) {
					outputComps[outputIndex].remove(comp);
				};
				
				Object.defineProperty(that, "inputs", {get() {return inputs}});
				Object.defineProperty(that, "outputs", {get() {
					if (!frameInitialized) {
						frameInitialized = true;
						let tempOutputs = evaluate();
						frameInitialized = false;
						
						objsVisited.forEach(function(obj) {
							obj.clearVisit();
						});
					
						return tempOutputs;
					}
					
					return evaluate();
				}});
				Object.defineProperty(that, "lastOutputs", {get() {return lastOutputs}});
				Object.defineProperty(that, "outputComps", {get() {return outputComps}});
				Object.defineProperty(that, "outputBuffer", {get() {return instOutputBuffer}});
				Object.defineProperty(that, "numInputs", {get() {return numInputs}});
				Object.defineProperty(that, "numOutputs", {get() {return numOutputs}});
				Object.defineProperty(that, "name", {get() {return name}});
				Object.defineProperty(that, "parent", {get() {return parent}});
				
				instances.push(that);
				
				return compInst;
			}
			
			Object.defineProperty(that, "numInputs", {get() {return numInputs}});
			Object.defineProperty(that, "numOutputs", {get() {return numOutputs}});
			Object.defineProperty(that, "inputs", {get() {return inputBuffer}});
			Object.defineProperty(that, "outputBuffer", {get() {return outputBuffer}});
			Object.defineProperty(that, "name", {get() {return name}});
			
			return comp;
		};
	}
}

// Returns an array of *numInputs* connectors
function generateConnections(numInputs, comp) {
	let inputs = [];
	
	for (var i = 0; i < numInputs; i++) {
		inputs.push(connection.getInstance());
		if (comp !== undefined)
			inputs[i].addOutput(comp, 0);
	}
	
	return inputs;
}

// Returns an array of *numOutputs* arrays
function generateOutputComps(numOutputs) {
	let outputComps = [];
	
	for (var i = 0; i < numOutputs; i++)
		outputComps.push([]);
		
	return outputComps;
}

// Returns an array containing all possible combinations of inputs and the resulting outputs calculated by *comp*
function getTruthTable(comp) {
	let togs = [];
	let table = []; // Table to be populated with rows of inputs and the component's corresponding outputs
	let numInputs = comp.numInputs;
	let tableLength = Math.pow(2, numInputs);
	
	// Creates toggleables and connects the given component to the toggleables
	comp.inputs.forEach(function(input, i) {
		let tog = toggleable.getInstance();
		input.setInput(tog, 0);
		togs.push(tog);
	});
	
	// Recursively iterates through all possible states of the toggleables
	function iterate(i) {
		if (i < 0)
			return;
		
		for (var j = 0; j < 2; j++) {
			togs[i].setState(Boolean(j), false);
			iterate(i - 1);
			
			if (i === 0) {
				//console.log("Oof");
				let row = populate(["inputs", "outputs"]);
				
				row.inputs = togs.map(function(tog) {
					return Number(tog.outputs[0]);
				});
				
				row.outputs = comp.outputs.map(function(output) {
					return Number(output);
				});
				
				table.push(row);
			}
		}
	}
	iterate(numInputs - 1);
	
	return table;
}

function evalInput(inputs, comp) {
	comp.inputs.forEach(function(input, i) {
		let tog = toggleable.getInstance();
		input.setInput(tog, 0);
		tog.setState(Boolean(inputs[i]), false);
	});
	return comp.outputs.map(function(output){return Number(output)});
}

function updateTop(comp) {
	let topComponents = [];
				
	function findTopComponents(comp) {
		if (comp.checkedForTop !== undefined) {
			//console.log("Already checked for top");
			return;
		}
		
		comp.checkedForTop = true;
		comp.visited = undefined;
	
		let top = true;
		comp.outputComps.forEach(function(outputs) {
			outputs.forEach(function(outputComp) {
				if (outputComp !== undefined) {
					top = false;
					findTopComponents(outputComp);
				}
			});
		});
		
		if (top) {
			//console.log("Found a " + comp.name);
			topComponents.push(comp);
		}
	}
	
	function clearVisits(comp) {
		if (comp.visited !== undefined) {
			//console.log("Already visited");
			return;
		}
		
		//console.log("Clearing visit");
		
		comp.visited = true;
		comp.checkedForTop = undefined;
		
		comp.outputComps.forEach(function(outputs) {
			outputs.forEach(function(outputComp) {
				clearVisits(outputComp);
			});
		});
	}
	
	findTopComponents(comp);
	clearVisits(comp);
	
	topComponents.forEach(function(comp) {
		console.log("Evaluating top components, component is a " + comp.name);
		comp.outputs;
	});
}