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
        let inputs = [0, 0];
        let output = Number(!Boolean(locked));
        let instUid = uid++;

        let loadInputs = function() {
            inputComps.forEach(function(comp, i) {
                if (comp !== undefined)
                    inputs[i] = comp.readOutput();
                else
                    inputs[i] = 0;
            });
        }

        let requestOutputs = function(history) {
            inputComps.forEach(function(comp, i) {
                if (comp !== undefined)
                    inputs[i] = comp.requestOutput(Object.assign(Object.create(null), history));
                else
                    inputs[i] = 0;
            });
        }

        let pushOutput = function(history) {
            outputComps.forEach(function(comp, i) {
                comp.computeOutput(history);
            });
        }

        Object.defineProperty(this, "inputComps", {get(){return inputComps}});
        Object.defineProperty(this, "uid", {get(){return instUid}});

        this.onOutputChange = function(){};
        this.onComputeOutput = function(){};

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
            output = 1 - Math.min(inputs[0], inputs[1]);

            console.blog(inputs, output);
            that.onComputeOutput(output);

            if (oldOutput !== output) {
                that.onOutputChange(output);
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
                return output;
            } else {
                history[instUid] = 1;
            }

            requestOutputs(history);

            output = 1 - Math.min(inputs[0], inputs[1]);
            console.blog(instUid, inputs, output);

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
    }
    nand.numInputs = 2;
    nand.numOutputs = 1;

    var toggleable = function() {
        let that = this;
        let outputComps = [];
        let output = 0;
        let locked = false;
        let instUid = uid++;

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

        this.onOutputChange = function(){};
        this.onComputeOutput = function(){};

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
            output = Number(state);

            that.onComputeOutput(output);

            if (oldOutput !== output) {
                that.onOutputChange(output);
                pushOutput(Object.create(null));
            }
        }
    }
    toggleable.numInputs = 0;
    toggleable.numOutputs = 1;

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

            Object.defineProperty(this, "inputComps", {get(){return [inputComp]}});

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

                outputComps.forEach(function(comp) {
                    comp.computeOutput(history);
                });
            }

            this.requestOutput = function(history) {
                if (locked)
                    return false;

                if (inputComp)
                    return inputComp.requestOutput(history);
                else
                    return false;
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
            let outputComps = [];
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

            this.setInputComp = function(comp, i, j) {
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

        customComponent.takeOutputFrom = function(comp, i, j) {
            if (comp === undefined)
                return;

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
                toggleables[j].setOutput(1);
                inputComb += "1";
            } else {
                toggleables[j].setOutput(0);
                inputComb += "0";
            }
        }
        console.log(inputComb, comp.readOutput());
    }
}

function setInputs(comp, inputs) {
    inputs.forEach(function(input, i) {
        let tog = new toggleable();
        tog.setOutput(input);
        comp.setInputComp(tog, 0, i);
    });
}