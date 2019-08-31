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
		currIndex++;
		
		if (currIndex >= length)
			currIndex = 0;

		return newArr[currIndex];
    }

	Object.defineProperty(this, "index", {get(){return currIndex}});
	Object.defineProperty(this, "shuffledArray", {get(){return newArr}});
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

function getUDGen(lower, upper) {
	return function fromUD() {
		let range = Math.abs(upper - lower);
		return (range * Math.random()) + lower;
	};
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
	/*var Matrix = function(rows, columns, from) {
		let random = (from === "random");
		let number = (typeof from === "number");
		let applyFunc = (typeof from === "function");
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
				} else if (applyFunc) {
					row.push(from(i, j));
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
	
	var vectorize = function(A) {
		let vector = [];
		
		A.data.forEach(function(row) {
			row.forEach(function(column) {
				vector.push(column);
			});
		});
		
		return vector;
	}
	
	var copy = function(A) {
		return new Matrix(A.rows, A.columns, vectorize(A));
	}*/
	
	var networkDist = function(network1, network2) {
		let sum = 0;
		network1.weightMatrices.forEach(function(matrix, i) {
			matrix.data.forEach(function(row, j) {
				row.forEach(function(weight, k) {
					sum += Math.pow((weight - network2.weightMatrices[i].data[j][k]), 2);
				});
			});
		});
		network1.biasMatrices.forEach(function(matrix, i) {
			matrix.data.forEach(function(row, j) {
				row.forEach(function(weight, k) {
					sum += Math.pow((weight - network2.biasMatrices[i].data[j][k]), 2);
				});
			});
		});
		return Math.sqrt(sum);
	}
	
	var Network = function(numLayers, neuronArray) {
		let activationMatrices = [];
		let weightedSumMatrices = [];
		let weightMatrices = [];
		let biasMatrices = [];
		let outputs = [];
		let desiredOutputs = [];
		let learningRate = 0.1;
		
		Object.defineProperty(this, "numLayers", {get(){return numLayers}});
		Object.defineProperty(this, "neuronArray", {get(){return neuronArray}});
		Object.defineProperty(this, "activationMatrices", {get(){return activationMatrices}});
		Object.defineProperty(this, "weightedSumMatrices", {get(){return weightedSumMatrices}});
		Object.defineProperty(this, "weightMatrices", {get(){return weightMatrices}});
		Object.defineProperty(this, "biasMatrices", {get(){return biasMatrices}});
		Object.defineProperty(this, "outputs", {get(){return outputs}});
		Object.defineProperty(this, "desiredOutputs", {get(){return desiredOutputs}});
		Object.defineProperty(this, "learningRate", {get(){return learningRate}, set(num){learningRate = num}});
		
		neuronArray.forEach(function(neurons, i) {
			activationMatrices.push(new Matrix(neurons, 1));
			if (i >= 1) {
				let bound = Math.sqrt(6 / (neurons + neuronArray[i -1]));
				weightMatrices.push(new Matrix(neurons, neuronArray[i - 1], getUDGen(-bound, bound)));	
				biasMatrices.push(new Matrix(neurons, 1));
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
	
	function convolve(kernel, bias, imgMatrix, padding) {
		let rows = imgMatrix.rows;
		let columns = imgMatrix.columns;
		let result;
		let padOffset = (kernel.rows - 1) / 2;
		
		if (!padding) {
			rows -= kernel.rows - 1;
			columns -= kernel.columns - 1;
		}
		
		result = new Matrix(rows, columns);
		
		imgMatrix.data.forEach(function(row, iY) {
			if (iY < padOffset || iY >= imgMatrix.rows - padOffset)
				return;
			
			row.forEach(function(pixel, iX) {
				if (iX < padOffset || iX >= imgMatrix.rows - padOffset)
					return;
				
				let sum = 0;
				let norm = 0;
				
				kernel.data.forEach(function(kRow, kY) {
					let relY = Math.floor(kY - ((kernel.columns - 1) / 2));
					let y = iY + relY;
					kRow.forEach(function (kColumn, kX) {
						let relX = Math.floor(kX - ((kernel.rows - 1) / 2));
						let x = iX + relX;
						
						if (x < 0 || y < 0 || x >= imgMatrix.columns || y >= imgMatrix.rows)
							return;
						
						sum += kColumn * imgMatrix.data[y][x] + bias;
						//norm += kColumn;
					});
				});
				
				//if (norm === 0)
					result.data[iY - padOffset][iX - padOffset] = sum;
				//else
				//	result.data[iY - padOffset][iX - padOffset] = sum / norm;
			});
		});
		
		return result;
	}
	
	function poolImg(size, stride, imgMatrix) {
		let rows = Math.ceil(imgMatrix.rows / stride);
		let columns = Math.ceil(imgMatrix.columns / stride);
		let result = new Matrix(rows, columns);
		
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < columns; j++) {
				//let largest = -Infinity;
				let sum = 0;
				let norm = 0;
				
				for (var k = 0; k < size; k++) {
					let y = i * size + k;
					for (var l = 0; l < size; l++) {
						let x = j * size + l;
						
						if (x >= imgMatrix.columns || y >= imgMatrix.rows)
							continue;
						
						sum += imgMatrix.data[y][x];
						norm++;
						//largest = imgMatrix.data[y][x] > largest ? imgMatrix.data[y][x] : largest;
					}
				}
				
				result.data[i][j] = sum / norm;
				//result.data[i][j] = largest;
			}
		}
		
		return result;
	}
	
	function ReLU(x) {
		return x > 0 ? x : 0;
	}
	
	var LayerData = function(type, ...args) {
		this.type = type;
		if (type === "convolution") {
			this.numFeatures = args[0];
			this.featureSize = args[1];
			this.padding = args[2];
		} else if (type === "rectifier") {
			this.rectFunc = args[0];
		} else if (type === "pooling") {
			this.windowSize = args[0];
			this.windowStride = args[1];
		}
	}
	
	/**
	 * A constructor for a convolutional neural network that feeds into an artificial neural network of fully connected layers
	 * 
	 * @param numLayers - The number of layers (not including the layers in the artificial neural network)
	 * @param layerDataList - An array of LayerData objects
	 * @param network - The artificial neural network
	 */
	 
	var ConvolutionalNetwork = function(numLayers, layerDataList, ANNLayers, neuronArray) {
		let input;
		let layerInputs = [];
		let layerTypes = [];
		let layerFunctionList = [];
		let network = new Network(ANNLayers, neuronArray);
		
		Object.defineProperty(this, "input", {get(){return input}});
		Object.defineProperty(this, "layerInputs", {get(){return layerInputs}});
		Object.defineProperty(this, "layerTypes", {get(){return layerTypes}});
		Object.defineProperty(this, "layerFunctionList", {get(){return layerFunctionList}});
		Object.defineProperty(this, "network", {get(){return network}});
		
		let prevFeatures = 1;
		layerDataList.forEach(function(layer, i) {
				layerTypes.push(layer.type);
				if (layer.type === "convolution") {
					let convLayer = Object.create(null);
					let features = [];
					let biases = [];
					let bound = Math.sqrt(6 / ((layer.numFeatures + prevFeatures) * Math.pow(layer.featureSize, 2)));
					prevFeatures = layer.numFeatures;
					convLayer.features = features;
					convLayer.biases = biases;
					
					for (var j = 0; j < layer.numFeatures; j++) {
						features.push(new Matrix(layer.featureSize, layer.featureSize, getUDGen(-bound, bound)));
						biases.push(0);
					}
					
					layerFunctionList.push(convLayer);
				} else if (layer.type === "rectifier") {
					layerFunctionList.push(layer.rectFunc);
				} else if (layer.type === "pooling") {
					let windowData = Object.create(null);
					
					windowData.size = layer.windowSize;
					windowData.stride = layer.windowStride;
					
					layerFunctionList.push(windowData);
				}
		});
		
		function vectorization(imgMatrixList) {
			let vector = [];
			imgMatrixList.forEach(function(imgMatrix) {
				imgMatrix.data.forEach(function(row) {
					row.forEach(function(pixel) {
						vector.push(pixel);
					});
				});
			});
			return vector;
		}
		
		this.setInputImg = function(imgMatrix) {
			input = imgMatrix;
		}
		
		this.compute = function() {
			layerInputs = [[input]];
			
			layerTypes.forEach(function(type, i) {
				let nextImgs = [];
				
				if (type === "convolution") {
					layerFunctionList[i].features.forEach(function(feature, j) {
						let nextImg;
						layerInputs[i].forEach(function(img, k) {
							if (!nextImg)
								nextImg = convolve(feature, layerFunctionList[i].biases[j], img, layerDataList[i].padding);
							else
								nextImg = add(nextImg, convolve(feature, 0, img, layerDataList[i].padding));
						});
						nextImgs.push(nextImg);
					});
				} else if (type === "rectifier") {
					layerInputs[i].forEach(function(img, j) {
						nextImgs.push(applyFunc(img, layerFunctionList[i]));
					});
				} else if (type === "pooling") {
					layerInputs[i].forEach(function(img, j) {
						nextImgs.push(poolImg(layerFunctionList[i].size, layerFunctionList[i].stride, img));
					});
				}
				
				layerInputs.push(nextImgs);
			});
			
			layerInputs.push(vectorization(layerInputs.last));
			network.setInputs(layerInputs.last);
			network.compute();
		}
		
		this.getOutputs = function() {
			return network.getOutputs();
		}
	}
}

var layerDataList = [];
layerDataList.push(new LayerData("convolution", 6, 5, false));
layerDataList.push(new LayerData("rectifier", activFunc));
layerDataList.push(new LayerData("pooling", 2, 2));
layerDataList.push(new LayerData("convolution", 12, 5, false));
layerDataList.push(new LayerData("rectifier", activFunc));
layerDataList.push(new LayerData("pooling", 2, 2));
var conNet = new ConvolutionalNetwork(6, layerDataList, 2, [192, 10]);