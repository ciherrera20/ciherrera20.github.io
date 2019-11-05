var blog = false;
console.blog = function(...args) {
    if (blog) {
        console.log(...args);
    }
}

{
    let uid = 0;

    var nand = function(locked) {
        locked = Boolean(locked);

        let that = this;
        let inputComps = [undefined, undefined];
        let outputComps = [];
        let inputs = [false, false];
        let output = !Boolean(locked);
        let instUid = uid++;

		let events = Object.create(null);
		events.triggerEvent = function(eventName, e) {
			events[eventName].forEach(function(callback) {
				callback(e);
			});
		}
		events.onOutputChange = [];
		events.onComputeOutput = [];
		
        let loadInputs = function() {
            inputComps.forEach(function(comp, i) {
                if (comp !== undefined)
                    inputs[i] = Boolean(comp.readOutput());
                else
                    inputs[i] = false;
            });
        }

        let requestOutputs = function(history) {
            inputComps.forEach(function(comp, i) {
                if (comp !== undefined)
                    inputs[i] = Boolean(comp.requestOutput(Object.assign(Object.create(null), history)));
                else
                    inputs[i] = false;
            });
        }

        let pushOutput = function(history) {
            outputComps.forEach(function(comp, i) {
                comp.computeOutput(history);
            });
        }

        Object.defineProperty(this, "inputComps", {get(){return inputComps}});
        Object.defineProperty(this, "outputComps", {get(){return outputComps}});
		Object.defineProperty(this, "onOutputChange", {get(){return events.onOutputChange}});
        Object.defineProperty(this, "onComputeOutput", {get(){return events.onComputeOutput}});
        Object.defineProperty(this, "uid", {get(){return instUid}});
		
		this.addEventListener = function(eventName, callback) {
			if (events[eventName]) {
				events[eventName].push(callback);
				callback(output);
			}
		}
		
		this.removeEventListener = function(eventName, callback) {
			if (events[eventName]) {
				let callbacks = events[eventName];
				callbacks.splice(callbacks.indexOf(callback), 1);
				callback(false);
			}
		}

        this.free = function() {
            locked = false;
        }

        this.readOutput = function() {
            return output;
        }

        this.computeOutput = function(history) {
            if (locked)
                return;

            if (history === undefined)
                history = Object.create(null);

            console.blog(instUid, history);


            if (history[instUid]) {
                console.blog("Loop detected at " + instUid + ", propagation halted");
                return;
            } else {
                history[instUid] = 1;
            }

            loadInputs();

            let oldOutput = output;
            output = !(inputs[0] && inputs[1]);

            console.blog(inputs, output);

            if (oldOutput !== output) {
                events.triggerEvent("onOutputChange", output);
                pushOutput(history);
            }
        }

        this.requestOutput = function(history) {
            if (locked)
                return false;
            
            if (history === undefined)
                history = Object.create(null);

            console.blog(instUid, history);

            if (history[instUid]) {
                console.blog("Loop detected at " + instUid + ", supplying cached output");
                events.triggerEvent("onComputeOutput", output);
                return output;
            } else {
                history[instUid] = 1;
            }

            requestOutputs(history);

            output = !(inputs[0] && inputs[1]);
            console.blog(instUid, inputs, output);

            events.triggerEvent("onComputeOutput", output);
            return output;
        }

        this.setInputComp = function(comp, i, j) {
            if (inputComps[j] !== undefined)
                that.removeInputComp(j);
			
            if (comp === undefined)
                return;

            if (comp.getOutputComp !== undefined)
                comp = comp.getOutputComp(i);
			
            inputComps[j] = comp;
            comp.addOutputComp(this);

            if (inputs[j] !== comp.readOutput())
                that.computeOutput();
        }

        this.addOutputComp = function(comp) {
            let i = outputComps.indexOf(comp);
            if (i === -1)
                outputComps.push(comp);
        }

        this.removeInputComp = function(i) {
            if (inputComps[i] === undefined)
                return;

            inputComps[i].removeOutputComp(this);
            inputComps[i] = undefined;

            if (inputs[i] !== false)
                that.computeOutput();
        }

        this.removeOutputComp = function(comp) {
            let i = outputComps.indexOf(comp);
            if (i !== -1)
                outputComps.splice(i, 1);
        }

        this.displayInfo = function() {
            console.blog(inputComps);
            console.blog(outputComps);
            console.blog(inputs);
            console.blog(output);
        }

        Object.defineProperty(this, "numInputs", {get(){return 2}});
        Object.defineProperty(this, "numOutputs", {get(){return 1}});
    }
    Object.defineProperty(nand, "numInputs", {get(){return 2}});
    Object.defineProperty(nand, "numOutputs", {get(){return 1}});

    var toggleable = function() {
        let that = this;
        let outputComps = [];
        let output = false;
        let locked = false;
        let instUid = uid++;

		let events = Object.create(null);
		events.triggerEvent = function(eventName, e) {
			events[eventName].forEach(function(callback) {
				callback(e);
			});
		}
		events.onOutputChange = [];
		events.onComputeOutput = [];
		
        let pushOutput = function(history) {
            if (history[instUid]) {
                return;
            } else {
                history[instUid] = 1;
            }

            function push() {
                outputComps.forEach(function(comp, i) {
                    comp.computeOutput(Object.assign(Object.create(null), history));
                });
            }

            push();
        }

        Object.defineProperty(this, "uid", {get(){return instUid}});

		this.addEventListener = function(eventName, callback) {
			if (events[eventName]) {
				events[eventName].push(callback);
				callback(output);
			}
		}
		
		this.removeEventListener = function(eventName, callback) {
			if (events[eventName]) {
				let callbacks = events[eventName];
				callbacks.splice(callbacks.indexOf(callback), 1);
				callback(false);
			}
		}

        this.free = function() {
            locked = false;
        }

        this.readOutput = function() {
            return output;
        }

        this.requestOutput = function(history) {
            if (history[instUid]) {
                return output;
            } else {
                history[instUid] = 1;
            }

            events.triggerEvent("onComputeOutput", output);
            return output;
        }

        this.addOutputComp = function(comp) {
            let i = outputComps.indexOf(comp);
            if (i === -1)
                outputComps.push(comp);
        }

        this.removeOutputComp = function(comp) {
            let i = outputComps.indexOf(comp);
			if (i !== -1)
            	outputComps.splice(i, 1);
        }

        this.setOutput = function(state) {
            let oldOutput = output;
            output = state;

            if (oldOutput !== output) {
                events.triggerEvent("onOutputChange", output);
                pushOutput(Object.create(null));
            }
        }
        Object.defineProperty(this, "numInputs", {get(){return 0}});
        Object.defineProperty(this, "numOutputs", {get(){return 1}});
    }
    Object.defineProperty(toggleable, "numInputs", {get(){return 0}});
    Object.defineProperty(toggleable, "numOutputs", {get(){return 1}});

    let populateArray = function(array, num, elem) {
        for (let i = 0; i < num; i++) {
            if (elem !== undefined && elem.constructor !== undefined)
                array.push(new elem.constructor());
            else
                array.push(elem);
        }
        return array;
    }

    var customComponent = function(numInputs, numOutputs) {
        let connection = function(locked) {
            locked = Boolean(locked);

            let inputComp;
            let outputComps = [];
            let that = this;

			let events = Object.create(null);
			events.triggerEvent = function(eventName, e) {
				events[eventName].forEach(function(callback) {
					callback(e);
				});
			}
			events.onOutputChange = [];
			events.onComputeOutput = [];
			
            Object.defineProperty(this, "inputComps", {get(){return [inputComp]}});
            Object.defineProperty(this, "outputComps", {get(){return outputComps}});

			this.addEventListener = function(eventName, callback) {
				if (events[eventName]) {
					events[eventName].push(callback);
					callback(this.readOutput());
				}
			}
		
			this.removeEventListener = function(eventName, callback) {
				if (events[eventName]) {
					let callbacks = events[eventName];
					callbacks.splice(callbacks.indexOf(callback), 1);
					callback(false);
				}
			}
			
            this.connection = true;
			
            this.free = function() {
                locked = false;
            }

            this.readOutput = function() {
                if (inputComp)
                    return inputComp.readOutput();
                else
                    return false;
            }

            this.computeOutput = function(history) {
                if (locked)
                    return;

				events.triggerEvent("onOutputChange", this.readOutput());
				
                outputComps.forEach(function(comp) {
                    comp.computeOutput(history);
                });
            }

            this.requestOutput = function(history) {
                if (locked)
                    return false;

				let output;
				
                if (inputComp)
                    output = inputComp.requestOutput(history);
                else
                    output = false;
				
				events.triggerEvent("onComputeOutput", this.readOutput());
				
				return output;
            }

            this.setInputComp = function(comp, i, j) {
                let input = false;
                if (inputComp !== undefined) {
                    input = inputComp.readOutput();
                    that.removeInputComp();
                }
			
                if (comp === undefined)
                    return;

                if (comp.getOutputComp !== undefined)
                    comp = comp.getOutputComp(i);
			
                inputComp = comp;
                comp.addOutputComp(this);

                if (input !== comp.readOutput())
                    that.computeOutput();
            }

            this.addOutputComp = function(comp) {
                let i = outputComps.indexOf(comp);
                if (i === -1)
                    outputComps.push(comp);
            }

            this.removeInputComp = function() {
                if (inputComp === undefined)
                    return;

                let input = inputComp.readOutput();

                inputComp.removeOutputComp(this);
                inputComp = undefined;

                if (!input)
                    that.computeOutput();
            }

            this.removeOutputComp = function(comp) {
                let i = outputComps.indexOf(comp);
                if (i !== -1)
                    outputComps.splice(i, 1);
            }
        }

        let inputsTo = populateArray([], numInputs, []);
        let outputsFrom = populateArray([], numOutputs, new connection());

        let customComponent = function() {
            let that = this;

            let instInputsTo = populateArray([], numInputs, []);
            let instOutputsFrom = populateArray([], numOutputs);
            let outputs = populateArray([], numOutputs, false);

            let loadOutputs = function() {
                instOutputsFrom.forEach(function(comp, i) {
                    if (comp !== undefined)
                        outputs[i] = Number(comp.readOutput());
                    else
                        outputs[i] = 0;
                });
            }

            Object.defineProperty(this, "inputs", {get(){return inputs}});
            Object.defineProperty(this, "inputsTo", {get(){return instInputsTo}});
            Object.defineProperty(this, "outputsFrom", {get(){return instOutputsFrom}});
            Object.defineProperty(this, "numInputs", {get(){return numInputs}});
            Object.defineProperty(this, "numOutputs", {get(){return numOutputs}});

            // Creates a copy of the structure of components that the custom component is taking outputs from and sending inputs to
            function replicateStructure() {
                // Creates a locked copy of the given component, calls itself on each of the component's inputs, and then sets the given 
                // component's copy's inputs to the copies of the component's inputs. Used to create a copy of a structure given a starting component
                function traceInputs(comp) {
                    comp.copy = new comp.constructor(true);

                    comp.inputComps.forEach(function(comp) {
                        if (comp === undefined || comp.constructor === toggleable)
                            return;
                        if (comp.copy === undefined)
                            traceInputs(comp);
                    });

                    comp.inputComps.forEach(function(input, i) {
                        if (input !== undefined)
                            comp.copy.setInputComp(input.copy, 0, i);
                    });
                }

                // Frees the copy of a given component, removes the reference to the given component's copy, and then calls itself on the given component's inputs.
                // Used to remove references to the copies of components in a structure given a starting component
                function removeCopies(comp) {
                    comp.copy.free();
                    comp.copy = undefined;

                    comp.inputComps.forEach(function(comp) {
                        if (comp === undefined)
                            return;
                        if (comp.copy !== undefined)
                            removeCopies(comp);
                    });
                }

                // Calls trace inputs on each of the custom component's outputs, essentially creating a copy of the original structure given to the custom component
                outputsFrom.forEach(function(comp, i) {
                  //if (comp.connection)
                  //    return;

                    traceInputs(comp);
                    instOutputsFrom[i] = comp.copy;
                });

                // Attaches the copied structure to the correct inputs of the component
                inputsTo.forEach(function(customInput, i) {
                    customInput.forEach(function(receiver, j) {
                        instInputsTo[i][j] = {comp: receiver.comp.copy, input: receiver.input};
                    });
                });

                // Calls removeCopies on each of the custom component's outputs
                outputsFrom.forEach(function(comp) {
                  //if (comp.connection)
                  //    return;
                    removeCopies(comp);
                });

                // Goes through the component's outputs and requests an output from them in order to generate the component's initial state
                instOutputsFrom.forEach(function(comp) {
                  //if (!comp.connection)
                  //    return;

                    console.blog("Requesting output from component " + comp.uid);
                    let output = comp.requestOutput();
                    console.blog("Output from " + comp.uid + " is " + output);
                });
            }
            replicateStructure();

            // Updates the internal structure of the component while keeping the connections to and from outside the custom component
            this.updateStructure = function() {
                // Keeps track of which components are taking an output from the internal structure of the custom component
                let outputsTo = populateArray([], numOutputs, []);
                instOutputsFrom.forEach(function(comp, i) {
                    comp.outputComps.forEach(function(outputComp) {
                        outputsTo[i].push({comp: outputComp, input: outputComp.inputComps.indexOf(comp)});
                    });
                });

                // Keeps track of which components are being used as inputs by the internal structure of the custom component
                let inputsFrom = populateArray([], numInputs);
                inputsFrom.forEach(function(comp, i) {
					let receiver = instInputsTo[i][0];
                    if (receiver) {
						let inputComp = receiver.comp.inputComps[receiver.input];
						if (inputComp)
							inputsFrom[i] = inputComp;
					}
					console.log(receiver, inputsFrom[i]);
                });

                // Clears out references to the inputs and outputs of the internal structure
                instInputsTo = populateArray([], numInputs, []);
                instOutputsFrom = populateArray([], numOutputs);
                outputs = populateArray([], numOutputs, false);

                // Rebuilds the internal structure of the component
                replicateStructure();

                // Reconnects the new structure to the components that were taking an output from the old structure
                outputsTo.forEach(function(output, i) {
                    output.forEach(function(receiver) {
                        receiver.comp.setInputComp(instOutputsFrom[i], 0, receiver.input);
                    });
                });

                // Reconnects the inputs from the old structure to the new structure
                inputsFrom.forEach(function(comp, i) {
					if (comp)
						that.setInputComp(comp, 0, i);
                });
            }

            this.setInputComp = function(comp, i, j) {
				if (!comp) {
					this.removeInputComp(j);
					return;
				}
				
                if (comp.getOutputComp !== undefined)
                    comp = comp.getOutputComp(i)

                instInputsTo[j].forEach(function(receiver) {
                    receiver.comp.setInputComp(comp, 0, receiver.input);
                });
            }

            this.removeInputComp = function(i) {
                instInputsTo[i].forEach(function(receiver) {
                    receiver.comp.removeInputComp(receiver.input);
                });
            }

            this.getOutputComp = function(i) {
                return instOutputsFrom[i];
            }

            this.readOutput = function() {
                loadOutputs();
                return outputs;
            }
        }

        Object.defineProperty(customComponent, "inputs", {get(){return inputs}});
        Object.defineProperty(customComponent, "inputsTo", {get(){return inputsTo}});
        Object.defineProperty(customComponent, "outputsFrom", {get(){return outputsFrom}});
        Object.defineProperty(customComponent, "numInputs", {get(){return numInputs}});
        Object.defineProperty(customComponent, "numOutputs", {get(){return numOutputs}});

        customComponent.addInput = function() {
            numInputs++;
            inputsTo.push([]);
        }

        customComponent.addOutput = function() {
            numOutputs++;
            outputsFrom.push(new connection());
        }
		
		customComponent.getOutputComp = function(i) {
			return outputsFrom[i];
		}

        customComponent.sendInputTo = function(comp, i, j) {
            if (comp.connection) {
                inputsTo[j].push({comp: comp, input: 0});
            } else if (comp.getOutputComp === undefined) {
                inputsTo[j].push({comp: comp, input: i});
                comp.customInput = true;
            } else {
                comp.inputsTo[i].forEach(function(receiver) {
                    inputsTo[j].push(receiver);
                    receiver.comp.customInput = true;
                });
            }
        }

		customComponent.removeInputTo = function(comp, i, j) {
			for (var k = 0; k < inputsTo[j].length; k++) {
				if (inputsTo[j][k].comp === comp && inputsTo[j][k].input === i) {
					inputsTo[j].splice(k, 1);
					comp.setInputComp(undefined, 0, i);
					return;
				}
			}
		}

        customComponent.takeOutputFrom = function(comp, i, j) {
            if (comp === undefined) {
                outputsFrom[j] = new connection();
                return;
            }

            if (comp.getOutputComp !== undefined)
                comp = comp.getOutputComp(i);

            outputsFrom[j] = comp;
        }

        return customComponent;
    }
}

function generateTruthTable(comp) {
    let numInputs = comp.constructor.numInputs;
    let numCombinations = Math.pow(2, numInputs);
    let toggleables = [];

    for (let i = 0; i < numInputs; i++) {
        let tog = new toggleable();
        toggleables.push(tog);
        comp.setInputComp(tog, 0, i);
    }

    for (let i = 0; i < numCombinations; i++) {
        let bin = i.toString(2);
        let inputComb = "";
        for (let j = 0; j < numInputs; j++) {
            if (bin[bin.length - j - 1] === "1") {
                toggleables[j].setOutput(true);
                inputComb += "1";
            } else {
                toggleables[j].setOutput(false);
                inputComb += "0";
            }
        }
        console.log(inputComb, comp.readOutput());
    }
}

function setInputs(comp, inputs) {
    inputs.forEach(function(input, i) {
        let tog = new toggleable();
        tog.setOutput(Boolean(input));
        comp.setInputComp(tog, 0, i);
    });
}