{
    let computationHandler = {};
    computationHandler.frameInit = false;
    computationHandler.compsToFree = [];
    computationHandler.onFrameEnd = function() {
        computationHandler.compsToFree.forEach(function(comp) {
            comp.free();
        });
        computationHandler.compsToFree = [];
        computationHandler.frameInit = false;
    }

    var nand = function() {
        var that = this;
        var inputComps = [undefined, undefined];
        var outputComps = [];
        var inputs = [false, false];
        var output = true;
		var inputsChanged = {0: false, 1: false};
		var toBeFreed = false;

        var loadInputs = function() {
            inputComps.forEach(function(comp, i) {
                if (comp !== undefined)
                    inputs[i] = Boolean(comp.readOutput());
                else
                    inputs[i] = false;
            });
        }

        var pushOutput = function() {
            function push() {
                outputComps.forEach(function(comp, i) {
                    comp.computeOutput(that);
                });
            }

            if (!computationHandler.frameInit) {
                computationHandler.frameInit = true;
                push();
                computationHandler.onFrameEnd();
            } else {
                push();
            }
        }

        Object.defineProperty(this, "inputComps", {get(){return inputComps}});

		this.onOutputChange = function(){};
		this.onComputeOutput = function(){};

        this.free = function() {
			inputsChanged[0] = false;
			inputsChanged[1] = false;
			toBeFreed = false;
        }

        this.readOutput = function() {
            return output;
        }

        this.computeOutput = function(from) {
			if (!toBeFreed) {
				computationHandler.compsToFree.push(that);
				toBeFreed = true;
            }

			if (inputComps[0] === from) {
				if (inputsChanged[0]) {
					console.log("Loop detected, computation halted");
					return;
                }
				inputsChanged[0] = true;
            }
			if (inputComps[1] === from) {
				if (inputsChanged[1]) {
					console.log("Loop detected, computation halted");
					return;
                }
				inputsChanged[1] = true;
            }

            loadInputs();

            let oldOutput = output;
            output = !(inputs[0] && inputs[1]);

			that.onComputeOutput(output);

            if (oldOutput !== output) {
				that.onOutputChange(output);
                pushOutput();
            }
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
        }

        this.removeOutputComp = function(comp) {
            let i = outputComps.indexOf(comp);
            if (i !== -1)
                outputComps.splice(i, 1);
        }

        this.displayInfo = function() {
            console.log(inputComps);
            console.log(outputComps);
            console.log(inputs);
            console.log(output);
        }

        this.parent = this.constructor;
    }

    var toggleable = function() {
        var that = this;
        var outputComps = [];
        var output = false;

        var pushOutput = function() {
            function push() {
                outputComps.forEach(function(comp, i) {
                    comp.computeOutput(that);
                });
            }

            if (!computationHandler.frameInit) {
                computationHandler.frameInit = true;
                push();
                computationHandler.onFrameEnd();
            } else {
                push();
            }
        }

		this.onOutputChange = function(){};
		this.onComputeOutput = function(){};

        this.readOutput = function() {
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

			that.onComputeOutput(output);

			if (oldOutput !== output) {
				that.onOutputChange(output);
            	pushOutput();
            }
        }

        this.parent = this.constructor;
    }

    let populateArray = function(array, num, elem) {
        for (var i = 0; i < num; i++) {
            if (elem !== undefined && elem.constructor !== undefined)
                array.push(new elem.constructor());
            else
                array.push(elem);
        }
        return array;
    }

    var customComponent = function(numInputs, numOutputs) {
        var numInputs = numInputs;
        var numOutputs = numOutputs;
        var inputsTo = populateArray([], numInputs, []);
        var outputsFrom = populateArray([], numOutputs);

        var inst = function() {
            var outputComps = [];
            var instInputsTo = populateArray([], numInputs, []);
            var instOutputsFrom = populateArray([], numOutputs);
            var outputs = populateArray([], numOutputs, false);

            var loadOutputs = function() {
                instOutputsFrom.forEach(function(comp, i) {
                    if (comp !== undefined)
                        outputs[i] = Boolean(comp.readOutput());
                    else
                        outputs[i] = false;
                });
            }

            Object.defineProperty(this, "inputs", {get(){return inputs}});
            Object.defineProperty(this, "inputsTo", {get(){return instInputsTo}});
            Object.defineProperty(this, "outputsFrom", {get(){return instOutputsFrom}});

            function replicateStructure() {
                function traceInputs(comp) {
                    comp.copy = new comp.parent();

                    inputsTo.forEach(function(customInput, i) {
                        customInput.forEach(function(receiver, j) {
                            if (receiver.comp === comp)
                                instInputsTo[i][j] = {comp: comp.copy, input: receiver.input};
                        });
                    });

                    comp.inputComps.forEach(function(comp) {
                        if (comp === undefined)
                            return;
                        if (comp.copy === undefined)
                            traceInputs(comp);
                    });

                    comp.inputComps.forEach(function(input, i) {
                        if (input !== undefined)
                            comp.copy.setInputComp(input.copy, 0, i);
                    });
                }

                function removeCopies(comp) {
                    comp.copy = undefined;

                    comp.inputComps.forEach(function(comp) {
                        if (comp === undefined)
                            return;
                        if (comp.copy !== undefined)
                            removeCopies(comp);
                    });
                }

                outputsFrom.forEach(function(comp, i) {
                    traceInputs(comp);
                    instOutputsFrom[i] = comp.copy;
                });

                outputsFrom.forEach(function(comp) {
                    removeCopies(comp);
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

            this.parent = this.constructor;
        }

        Object.defineProperty(inst, "inputs", {get(){return inputs}});
        Object.defineProperty(inst, "inputsTo", {get(){return inputsTo}});
        Object.defineProperty(inst, "outputsFrom", {get(){return outputsFrom}});

		inst.addInput = function() {
			numInputs++;
			inputsTo.push([]);
        }

		inst.addOutput = function() {
			numOutputs++;
			outputsFrom.push(undefined);
        }

        inst.sendInputTo = function(comp, i, j) {
            inputsTo[j].push({comp: comp, input: i});
        }

        inst.takeOutputFrom = function(comp, i, j) {
            if (comp.getOutputComp !== undefined)
                comp = comp.getOutputComp(i);

            outputsFrom[j] = comp;
        }

        inst.parent = this.constructor;

        return inst;
    }
}

{
    var inv = customComponent(1, 1);
    let nand0 = new nand();
    inv.sendInputTo(nand0, 0, 0);
    inv.sendInputTo(nand0, 1, 0);
    inv.takeOutputFrom(nand0, 0, 0);
}

{
    var and = customComponent(2, 1);
    let nand0 = new nand();
    let inv0 = new inv();
    inv0.setInputComp(nand0, 0, 0);
    and.sendInputTo(nand0, 0, 0);
    and.sendInputTo(nand0, 1, 1);
    and.takeOutputFrom(inv, 0, 0);
}

{
    var or = customComponent(2, 1);
    let inv0 = new inv();
    let inv1 = new inv();
    let nand0 = new nand();
    nand0.setInputComp(inv0, 0, 0);
    nand0.setInputComp(inv1, 0, 1);
    or.sendInputTo(inv0, 0, 0);
    or.sendInputTo(inv1, 0, 1);
    or.takeOutputFrom(nand0, 0, 0);
}

{
    var xor = customComponent(2, 1);
    let nand0 = new nand();
    let nand1 = new nand();
    let nand2 = new nand();
    let nand3 = new nand();
    let nand4 = new nand();
    nand4.setInputComp(nand2, 0, 0);
    nand4.setInputComp(nand3, 0, 1);
    nand3.setInputComp(nand1, 0, 1);
    nand2.setInputComp(nand0, 0, 0);
    xor.sendInputTo(nand2, 1, 1);
    xor.sendInputTo(nand3, 0, 0);
    xor.sendInputTo(nand0, 0, 0);
    xor.sendInputTo(nand0, 1, 1);
    xor.sendInputTo(nand1, 0, 0);
    xor.sendInputTo(nand1, 1, 1);
    xor.takeOutputFrom(nand4, 0, 0);
}