// Function which squishes the number line into a range between 0 and 1
function activFunc(x) {
	return 1 / (1 + Math.pow(Math.E, -x));
	//return x > 0 ? x : 0;
}

// Derivative of the activation function
function dActivFunc(x, h) {
	if (!h)
		h = 0.001;
	
	return (activFunc(x + h) - activFunc(x)) / h;
}

function randomIterator(length) {
	let arr = [];
	for (var i = 0; i < length; i++) {
		arr.push(i);
    }

	let newArr = [];
	while (arr.length > 0) {
		let i = Math.round((arr.length - 1) * Math.random());
		newArr.push(arr[i]);
		arr.splice(i, 1);
    }

	let currIndex = 0;

	this.next = function() {
		if (currIndex >= length)
			currIndex = 0;

		currIndex++;

		return newArr[currIndex];
    }

	Object.defineProperty(this, "index", {get(){return currIndex}});
}

// Picks a random number between two values with a precision equal to the precision of the least precise value. Accepts strings
function pickRandom(first, last) {
	var findPrecision = function(num) {
		var num = num.toString();
		if(Math.floor(Number(num)).toString() !== num)
			return num.split(".")[1].length || 0;
		return 0;
	}
	var exp = findPrecision(first) > findPrecision(last) ? findPrecision(last) : findPrecision(first);
	
	first = Number(first);
	last = Number(last);
	
	return (Math.round(Math.random() * ((last * Math.pow(10, exp)) - (first * Math.pow(10, exp)))) + (first * Math.pow(10, exp))) / Math.pow(10, exp);
}

if (!Array.prototype.last) 
{
	Object.defineProperty(Array.prototype, "last", {get() {
		return this[this.length - 1];
	}});
}

if (!console.blog)
{
	var blog = false;
	console.blog = function(msg) {
		if(blog)
			console.log(msg);
	}
}

{
	var Matrix = function(rows, columns, from) {
		let random = (from === "random");
		let number = (typeof from === "number");
		let array;
		if (from)
			array = Boolean(from.forEach);
		let data = [];
		
		Object.defineProperty(this, "columns", {get(){return columns}});
		Object.defineProperty(this, "rows", {get(){return rows}});
		Object.defineProperty(this, "data", {get(){return data}});
		
		for (var i = 0; i < rows; i++) {
			let row = [];
			for (var j = 0; j < columns; j++) {
				if (random) {
					//row.push(pickRandom("-0.10", "0.10"));
					row.push(1 - 2 * Math.random());
				} else if (number) {
					row.push(from);
				} else if (array) {
					let elem = from[i * columns + j];
					row.push(Number(elem));
				} else {
					row.push(0);
				}
			}
			data.push(row);
		}
	}
	
	var multiply = function(A, B) {
		let result;
		
		if (typeof A !== "number") {
			if (A.columns !== B.rows)
				return;
		
			result = new Matrix(A.rows, B.columns);
			
			for (var i = 0; i < A.rows; i++) {
				for (var j = 0; j < B.columns; j++) {
					let sum = 0;
					for (var k = 0; k < A.columns; k++) {
						sum += A.data[i][k] * B.data[k][j];
					}
					result.data[i][j] = sum;
				}
			}
		} else {
			result = new Matrix(B.rows, B.columns);
			
			B.data.forEach(function(row, i) {
				row.forEach(function(column, j) {
					result.data[i][j] = column * A;
				});
			});
		}
		
		return result;
	}
	
	var add = function(A, B) {
		if (A.rows !== B.rows || A.columns !== B.columns)
			return;
		
		let result = new Matrix(A.rows, A.columns);
		
		A.data.forEach(function(row, i) {
			row.forEach(function(column, j) {
				result.data[i][j] = column + B.data[i][j];
			});
		});
		
		return result;
	}
	
	var applyFunc = function(A, func) {
		let result = new Matrix(A.rows, A.columns);
		
		A.data.forEach(function(row, i) {
			row.forEach(function(column, j) {
				result.data[i][j] = func(column);
			});
		});
		
		return result;
	}
	
	var Network = function(numLayers, neuronArray) {
		let activationMatrices = [];
		let weightedSumMatrices = [];
		let weightMatrices = [];
		let biasMatrices = [];
		let outputs = [];
		let desiredOutputs = [];
		
		const learningRate = 0.1;
		
		Object.defineProperty(this, "numLayers", {get(){return numLayers}});
		Object.defineProperty(this, "neuronArray", {get(){return neuronArray}});
		Object.defineProperty(this, "activationMatrices", {get(){return activationMatrices}});
		Object.defineProperty(this, "weightedSumMatrices", {get(){return weightedSumMatrices}});
		Object.defineProperty(this, "weightMatrices", {get(){return weightMatrices}});
		Object.defineProperty(this, "biasMatrices", {get(){return biasMatrices}});
		Object.defineProperty(this, "outputs", {get(){return outputs}});
		Object.defineProperty(this, "desiredOutputs", {get(){return desiredOutputs}});
		
		neuronArray.forEach(function(neurons, i) {
			activationMatrices.push(new Matrix(neurons, 1));
			if (i >= 1) {
				weightMatrices.push(new Matrix(neurons, neuronArray[i - 1], "random"));	
				biasMatrices.push(new Matrix(neurons, 1, "random"));
				weightedSumMatrices.push(new Matrix(neurons, 1));
			}
		});
		for (var i = 0; i < neuronArray.last; i++) {
			outputs[i] = 0;
			desiredOutputs[i] = 0;
		}
		
		/**
		 * Gets a neuron's activation
		 *
		 * @param l - The layer
		 * @param i - The index of the neuron in layer l
		 *
		 * @return - The activation
		 */
		function getActiv(l, i) {
			console.blog("getActiv", l, i);
			return activationMatrices[l].data[i][0];
		}
		
		/**
		 * Gets a weight
		 *
		 * @param l - The layer whose activations the weight affects
		 * @param i - The ith neuron in layer l
		 * @param j - The jth neuron in layer l - 1
		 *
		 * @return - The weight connecting the ith neuron in layer l to the jth neuron in layer l - 1
		 */
		function getWeight(l, i, j) {
			console.blog("getWeight", l, i, j);
			return weightMatrices[l - 1].data[i][j];
		}
		
		/**
		 * Gets a neuron's weighted sum
		 *
		 * @param l - The layer
		 * @param i - The index of the neuron in layer l
		 *
		 * @return - The weighted sum
		 */
		function getWsum(l, i) {
			console.blog("getWsum", l, i);
			return weightedSumMatrices[l - 1].data[i][0];
		}
		
		/**
		 * Calculates the partial derivative of the cost function with respect to the kth neuron's activation in layer l
		 *
		 * @param l - The layer of the activation
		 * @param i - The index of the activation in layer l
		 *
		 * @return - The partial derivative
		 */
		function dCostActiv(l, i) {
			console.blog("dCostActiv", l, i);
			
			let L = numLayers - 1;
			
			if (l === L) {
				return 2 * (getActiv(L, i) - desiredOutputs[i]);
			} else {
				let sum = 0;
				
				for (var j = 0; j < neuronArray[l + 1] - 1; j++) {
					sum += dWsumActiv(l + 1, j, i) * dActivWsum(l + 1, j) * dCostActiv(l + 1, j);
				}
				
				return sum;
			}
		}
		
		/**
		 * Calculates the partial derivative of a weighted sum with respect to an activation in the previous layer
		 *
		 * @param l - The layer of the weighted sum
		 * @param i - The index of the weighted sum in layer l
		 * @param j - The index of the activation in layer l - 1
		 *
		 * @return - The partial derivative
		 */
		function dWsumActiv(l, i, j) {
			console.blog("dWsumActiv", l, i, j);
			return getWeight(l, i, j);
		}
		
		/**
		 * Calculates the partial derivative of an activation with respect to its weighted sum
		 *
		 * @param l - The layer of both the activation and the weighted sum
		 * @param i - The index of both the activation and the weighted sum
		 *
		 * @return - The partial derivative
		 */
		function dActivWsum(l, i) {
			console.blog("dActivWsum", l, i);
			return dActivFunc(getWsum(l, i));
		}
		
		/**
		 * Calculates the partial derivative of a weighted sum with respect to a weight in the same layer
		 *
		 * @param l - The layer of the weighted sum
		 * @param i - The index of the neuron in layer l the weight is connected to
		 * @param j - The index of the neuron in layer l - 1 the weight is connected to
		 *
		 * @return - The partial derivative
		 */
		function dWsumWeight(l, i, j) {
			console.blog("dWsumWeight", l, i, j);
			return getActiv(l - 1, j);
		}
		
		/**
		 * Calculates the partial derivative of a weighted sum with respect to a bias in the same layer
		 *
		 * @param l - The layer of both the weighted sum and the bias
		 * @param i - The index of both the weighted sum and the bias
		 *
		 * @return - The partial derivative
		 */
		function dWsumBias(l, i) {
			return 1;
		}
		
		function dCostWeight(l, i, j) {
			console.blog("dCostWeight", l, i, j);
			return dWsumWeight(l, i, j) * dActivWsum(l, i) * dCostActiv(l, i);
		}
		
		function dCostBias(l, i) {
			console.blog("dCostBias", l, i);
			return dActivWsum(l, i) * dCostActiv(l, i);
		}
		
		this.dCostWeight = dCostWeight;
		this.dCostBias = dCostBias;
		this.dWsumBias = dWsumBias;
		this.dWsumWeight = dWsumWeight;
		this.dActivWsum = dActivWsum;
		this.dWsumActiv = dWsumActiv;
		this.dCostActiv = dCostActiv;
		this.getWsum = getWsum;
		this.getWeight = getWeight;
		this.getActiv = getActiv;
		
		this.generateGradient = function() {
			let gradient = Object.create(null);
			
			gradient.weightMatrices = [];
			gradient.biasMatrices = [];
			
			weightMatrices.forEach(function(matrix, l) {
				let weightGradient = new Matrix(matrix.rows, matrix.columns);
				let biasGradient = new Matrix(matrix.rows, 1);
				
				matrix.data.forEach(function(row, i) {
					row.forEach(function(weight, j) {
						weightGradient.data[i][j] = dCostWeight(l + 1, i, j);
					});
					biasGradient.data[i][0] = dCostBias(l + 1, i);
				});
				
				gradient.weightMatrices.push(weightGradient);
				gradient.biasMatrices.push(biasGradient);
			});
			
			return gradient;
		}
		
		this.adjustWeightsAndBiases = function() {
			/*weightMatrices.forEach(function(matrix, l) {
				matrix.data.forEach(function(row, i) {
					row.forEach(function(weight, j) {
						matrix.data[i][j] -= learningRate * dCostWeight(l + 1, i, j);
					});
					biasMatrices[l].data[i][0] -= learningRate * dCostBias(l + 1, i);
				});
			});*/
			
			// Holds the partial derivatives of the cost function with respect to all of the activations of the neurons
			let dActivationLayers = [];
			
			// Loops backwards through the layers, starting from the last layer L
			for (var i = numLayers - 1; i >= 1; i--) {
				let dActivations = [];
				
				// Loops through the neurons in the layer i, recording the partial derivative of the cost function with respect to the jth neuron in the ith layer's activation
				for (var j = 0; j < neuronArray[i]; j++) {
					if (i === numLayers - 1) {
						dActivations.push(2 * (getActiv(i, j) - desiredOutputs[j]));
					} else {
						let sum = 0;
						
						for (var k = 0; k < neuronArray[i + 1]; k++) {
							sum += getWeight(i + 1, k, j) * dActivFunc(getWsum(i + 1, k)) * dActivationLayers[0][k];
						}
						
						dActivations.push(sum);
					}
				}
				
				dActivationLayers.unshift(dActivations);
			}
			
			// Loops through each weight and bias uses the partial derivative of the cost function with respect to them to adjust their values
			weightMatrices.forEach(function(matrix, l) {
				matrix.data.forEach(function(row, i) {
					let coef = learningRate * dActivFunc(getWsum(l + 1, i)) * dActivationLayers[l][i];
					row.forEach(function(weight, j) {
						matrix.data[i][j] -= coef * getActiv(l, j);
					});
					biasMatrices[l].data[i][0] -= coef;
				});
			});
		}
		
		this.setInputs = function(activationArray) {
			activationMatrices[0] = new Matrix(neuronArray[0], 1, activationArray);
		}
		
		this.compute = function() {
			for (var i = 1; i < numLayers; i++) {
				weightedSumMatrices[i - 1] = add(
					multiply(
						weightMatrices[i - 1], 
						activationMatrices[i - 1]
					), 
					biasMatrices[i - 1]
				);
				activationMatrices[i] = applyFunc(weightedSumMatrices[i - 1], activFunc);
			}
			
			let lastLayer = activationMatrices[numLayers - 1];
			
			for (var i = 0; i < lastLayer.rows; i++) {
				outputs[i] = lastLayer.data[i][0];
			}
		}
		
		this.getOutputs = function() {
			return outputs;
		}
		
		this.setDesiredOutputs = function(newDesiredOutputs) {
			desiredOutputs.forEach(function(output, i) {
				desiredOutputs[i] = newDesiredOutputs[i];
			});
		}
		
		this.computeCost = function() {
			var cost = 0;
			for (var i = 0; i < outputs.length; i++) {
				cost += Math.pow(desiredOutputs[i] - outputs[i], 2);
			}
			return cost;
		}
		
		this.getJSON = function() {
			let obj = Object.create(null);
			
			obj.weightMatrices = [];
			obj.weightData = [];
			obj.biasMatrices = [];
			obj.biasData = [];
			
			for (var i = 0; i < numLayers - 1; i++) {
				obj.weightData.push(weightMatrices[i].columns);
				obj.biasData.push(biasMatrices[i].columns);
				
				let weightMatrix = [];
				
				weightMatrices[i].data.forEach(function(row) {
					row.forEach(function(weight) {
						weightMatrix.push(weight);
					});
				});
				
				let biasMatrix = [];
				
				biasMatrices[i].data.forEach(function(row) {
					row.forEach(function(bias) {
						biasMatrix.push(bias);
					});
				});
				
				obj.weightMatrices.push(weightMatrix);
				obj.biasMatrices.push(biasMatrix);
			}
			
			let str = JSON.stringify(obj);
			
			return str;
		}
		
		this.useJSONData = function(data) {
			let obj = JSON.parse(data);
			
			for (var i = 0; i < numLayers - 1; i++) {
				weightMatrices[i].data.forEach(function(row, j) {
					row.forEach(function(weight, k) {
						weightMatrices[i].data[j][k] = obj.weightMatrices[i][j * weightMatrices[i].columns + k];
					});
				});
				
				biasMatrices[i].data.forEach(function(row, j) {
					row.forEach(function(bias, k) {
						biasMatrices[i].data[j][k] = obj.biasMatrices[i][j * biasMatrices[i].columns + k];
					});
				});
			}
		}
	}
}