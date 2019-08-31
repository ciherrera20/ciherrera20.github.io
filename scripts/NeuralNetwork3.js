// Function which squishes the number line into a range between 0 and 1
function activFunc(x) {
	return 1 / (1 + Math.pow(Math.E, -x));
	//return x > 0 ? x : 0;
}

// Derivative of the activation function
function dActivFunc(x, h) {
	if (!h)
		h = 0.0001;
	
	return (activFunc(x + h) - activFunc(x)) / h;
}

function numDeriv(f, h) {
	if (!h)
		h = 0.0001;
	
	let df = function(x) {
		return ((f(x + h) - f(x)) / h);
	}
	
	return df;
}

function ReLU(x) {
	return x > 0 ? x : 0;
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

// Gets a random number from a uniform distribution between the lower and upper bounds provided
function getUDGen(lower, upper) {
	return function fromUD() {
		let range = Math.abs(upper - lower);
		return (range * Math.random()) + lower;
	};
}

// Adds the last property to the Array prototype
if (!Array.prototype.last) 
{
	Object.defineProperty(Array.prototype, "last", {get() {
		return this[this.length - 1];
	}});
}

// Optional console.log
if (!console.blog)
{
	var blog = false;
	console.blog = function(msg) {
		if(blog)
			console.log(msg);
	}
}

{
	var convolve = function(kernel, bias, imgMatrix, padding) {
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
					});
				});
				
				result.data[iY - padOffset][iX - padOffset] = sum;
			});
		});
		
		return result;
	}
	
	var poolImg = function(size, stride, imgMatrix) {
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
	
	/*var LayerData = function(type, ...args) {
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
		} else if (type === "")
	}*/
	
	var Layer = function(type, ...args) {
		let that = this;
		let input;
		let output;
		let compute;
		let validateInput;
		
		Object.defineProperty(that, "type", {get(){return type}});
		Object.defineProperty(that, "input", {get(){return input}});
		Object.defineProperty(that, "output", {get(){return output}});
		Object.defineProperty(that, "compute", {get(){return compute}});
		Object.defineProperty(that, "validateInput", {get(){return validateInput}});
		
		//this.prevLayer = prevLayer;
		
		if (type === "fully_connected") {
			let numInputs = args[0];
			let numOutputs = args[1];
			let activFunc = args[2];
			let dActivFunc;
			let weightRows = numOutputs;
			let weightColumns = numInputs;
			let weights;
			let biases;
			let weightedSums;
			
			Object.defineProperty(that, "numInputs", {get(){return numInputs}});
			Object.defineProperty(that, "numOutputs", {get(){return numOutputs}});
			Object.defineProperty(that, "activFunc", {get(){return activFunc}});
			Object.defineProperty(that, "dActivFunc", {get(){return dActivFunc}});
			Object.defineProperty(that, "weights", {get(){return weights}});
			Object.defineProperty(that, "biases", {get(){return biases}});
			
			// Generates random weights
			function randomWeights() {
				let bound = Math.sqrt(6 / (numInputs + numOutputs));
				return new Matrix(weightRows, weightColumns, getUDGen(-bound, bound));
			}
			
			// Generate random biases
			function randomBiases() {
				return new Matrix(numOutputs, 1);
			}
			
			// Check if the activation function's derivative is given
			if (args[3]) {
				// If so, store it in dActivFunc
				dActivFunc = args[3];
			} else {
				// Otherwise, create a function that performs a numerical derivative at a point
				dActivFunc = numDeriv(activFunc);
			}
			
			// Check if a weight matrix is given
			if (args[4]) {
				// Check if the given weight matrix has the correct dimensions
				if (args[4].rows === weightRows && args[4].columns === weightColumns) {
					// If so, make a copy of the given weight matrix and store it as the layer's weights
					weights = copy(args[4]);
				} else {
					// Otherwise, throw an error
					throw new Error("Improperly formatted weight matrix");
				}
			} else {
				// If no weight matrix is given, generate random weights
				weights = randomWeights();
			}
			
			// Check if a bias matrix is given
			if (args[5]) {
				// Check if the given bias matrix has the correct dimensions
				if (args[5].rows === numOutputs && args[5].columns === 1) {
					// If so, make a copy of the given bias matrix and store it as the layer's biases
					biases = copy(args[5]);
				} else {
					// Otherwise, throw an error
					throw new Error("Improperly formatted bias matrix");
				}
			} else {
				// If no bias matrix is given, generate biases initialized to 0
				biases = randomBiases();
			}
			
			validateInput = function(data) {
				if (data.rows !== numInputs || data.columns !== 1) {
					return false;
				}
				
				return true;
			}
			
			compute = function() {
				weightedSums = add(multiply(weights, input), biases);
				output = applyFunc(weightedSums, activFunc);
			}
		} else if (type === "vectorization") {
			let numImgs = args[0];
			let imgRows = args[1];
			let imgColumns = args[2];
			let outputSize = numImgs * imgRows * imgColumns;

			Object.defineProperty(that, "numImgs", {get(){return numImgs}});
			Object.defineProperty(that, "imgRows", {get(){return imgRows}});
			Object.defineProperty(that, "imgColumns", {get(){return imgColumns}});
			Object.defineProperty(that, "outputSize", {get(){return outputSize}});
			
			validateInput = function(data) {
				if (input.length !== numImgs) {
					return false;
				}
				
				for (var i = 0; i < input.length; i++) {
					if (input[i].rows !== imgRows || input[i].columns !== imgColumns) {
						return false;
					}
				}
				
				return true;
			}
			
			compute = function() {
				let imgs = [];
				
				input.forEach(function(img) {
					imgs.push(copy(img));
				});
				
				let vector = [];
				
				imgs.forEach(function(img) {
					let newVector = vectorize(img);
					newVector.forEach(function(num) {
						vector.push(num);
					});
				});
				
				output = new Matrix(vector.length, 1, vector);
			}
		} else if (type === "pooling") {
			let numImgs = args[0];
			let imgRows = args[1];
			let imgColumns = args[2];
			let winSize = args[3];
			let winStride = args[4];
			let outputRows = Math.ceil(imgRows / winStride);
			let outputColumns = Math.ceil(imgColumns / winStride);
			
			Object.defineProperty(that, "numImgs", {get(){numImgs}});
			Object.defineProperty(that, "imgRows", {get(){imgRows}});
			Object.defineProperty(that, "winSize", {get(){winSize}});
			Object.defineProperty(that, "winStride", {get(){winStride}});
			Object.defineProperty(that, "imgColumns", {get(){imgColumns}});
			Object.defineProperty(that, "outputRows", {get(){outputRows}});
			Object.defineProperty(that, "outputColumns", {get(){outputColumns}});
			
			validateInput = function(data) {
				if (input.length !== numImgs) {
					return false;
				}
				
				for (var i = 0; i < input.length; i++) {
					if (input[i].rows !== imgRows || input[i].columns !== imgColumns) {
						return false;
					}
				}
				
				return true;
			}
			
			compute = function() {
				let results = [];
				
				input.forEach(function(img) {
					results.push(poolImg(winSize, winStride, img));
				});
				
				output = result;
			}
		} else if (type === "convolution") {
			let numImgs = args[0];
			let imgRows = args[1];
			let imgColumns = args[2];
			let kernelRows = args[3];
			let kernelColumns = args[4];
			let numKernelRows = args[5];
			let kernels;
			
			Object.defineProperty(that, "numImgs", {get(){numImgs}});
			Object.defineProperty(that, "imgRows", {get(){imgRows}});
			Object.defineProperty(that, "imgColumns", {get(){imgColumns}});
			Object.defineProperty(that, "kernelRows", {get(){kernelRows}});
			Object.defineProperty(that, "kernelColumns", {get(){kernelColumns}});
			Object.defineProperty(that, "numKernelRows", {get(){numKernelRows}});
			Object.defineProperty(that, "kernels", {get(){kernels}});
			
			function validateKernels(kernels) {
				if (kernels.rows !== numKernelRows || kernels.columns !== numImgs) {
					return false;
				}
				
				for (var i = 0; i < numKernelRows; i++) {
					for (var j = 0; j < numImgs; j++) {
						let kernel = kernels.data[i][j];
						if (kernel.rows !== kernelRows || kernel.columns !== kernelColumns) {
							return false;
						}
					}
				}
				
				return true;
			}
			
			function copyKernels(data) {
				kernels = new Matrix(numKernels, numImgs);
				data.forEach(function(row, i) {
					row.forEach(function(kernel, j) {
						kernels.data[i][j] = copy(kernel);
					});
				});
			}
			
			function randomKernels() {
				kernels = new Matrix(numKernelRows, numImgs);
				for (var i = 0; i < numKernelRows; i++) {
					for (var j = 0; j < numImgs; j++) {
						let bound = Math.sqrt(6 / ((numKernelRows + numImgs) + Math.pow(5, 2)));
						kernels.data[i][j] = new Matrix(kernelRows, kernelColumns, getUDGen(-bound, bound));
					}
				}
			}
			
			if (args[6]) {
				if (validateKernels(args[6])) {
					kernels = copyKernels(args[6]);
				} else {
					throw new Error("Improperly formatted kernel matrices");
				}
			} else {
				kernels = randomKernels();
			}
		}
		
		this.setInput = function(data, compFlag = true) {
			let valid = validateInput(data);
			
			if (!valid) {
				throw new Error("Invalid input data");
			}
			
			input = data;
			if (compFlag) {
				compute(input);
			}
		}
	}
	
	var Network = function(layers) {
		let that = this;
		let input;
		let output;
		let validateInput;
		let compute;
		
		Object.defineProperty(that, "layers", {get(){return layers}});
		Object.defineProperty(that, "input", {get(){return input}});
		Object.defineProperty(that, "output", {get(){return output}});
		Object.defineProperty(that, "validateInput", {get(){return validateInput}});
		Object.defineProperty(that, "compute", {get(){return compute}});
		
		validateInput = function(data) {
			return layers[0].validateInput(data);
		}
		
		compute = function() {
			let layerInput = input;
			layers.forEach(function(layer) {
				layer.setInput(input);
				input = layer.output;
			});
			output = layers.last.output;
		}
		
		this.setInput = function(data, compFlag = true) {
			let valid = validateInput(data);
			
			input = data;
			if (compFlag) {
				compute(input);
			}
		}
	}
	
	var FCNetwork = function(neuronArray, activFunc, dActivFunc) {
		let that = this;
		let numInputs = neuronArray[0];
		let layers = [];
		
		Object.defineProperty(that, "numInputs", {get(){return numInputs}});
		
		if (typeof neuronArray[0] === "Number") {
			neuronArray.forEach(function(neurons, i) {
				if (i === 0) {
					return;
				}
				
				let layer = new Layer("fully_connected", neuronArray[i - 1], neurons, activFunc, dActivFunc);
				
				layers.push(layer);
			});
		} else {
			layers = neuronArray;
		}
		
		this.__proto__ = new Network(layers);
	}
}

/*var layerDataList = [];
layerDataList.push(new LayerData("convolution", 6, 5, false));
layerDataList.push(new LayerData("rectifier", activFunc));
layerDataList.push(new LayerData("pooling", 2, 2));
layerDataList.push(new LayerData("convolution", 12, 5, false));
layerDataList.push(new LayerData("rectifier", activFunc));
layerDataList.push(new LayerData("pooling", 2, 2));
var conNet = new ConvolutionalNetwork(6, layerDataList, 2, [192, 10]);*/