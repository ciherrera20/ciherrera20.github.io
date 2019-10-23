//TODO Add computeFeedback method to convolution layer

function createObject(prototype, constructor) {
	let obj = Object.create(prototype);
	
	obj.super = prototype;
	obj.super.constructor = constructor;
	
	return obj;
}

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
	
	/*var poolImg = function(size, imgMatrix, poolFunc) {
		let rows = Math.ceil(imgMatrix.rows / size);
		let columns = Math.ceil(imgMatrix.columns / size);
		let result = new Matrix(rows, columns);
		
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < columns; j++) {
				//let largest = -Infinity;
				//let sum = 0;
				//let norm = 0;
				let localPool = [];
				
				for (var k = 0; k < size; k++) {
					let y = i * size + k;
					for (var l = 0; l < size; l++) {
						let x = j * size + l;
						
						if (x >= imgMatrix.columns || y >= imgMatrix.rows)
							continue;
						
						localPool.push(imgMatrix.data[y][x]);
						//sum += imgMatrix.data[y][x];
						//norm++;
						//largest = imgMatrix.data[y][x] > largest ? imgMatrix.data[y][x] : largest;
					}
				}
				
				result.data[i][j] = poolFunc(localPool);
				//result.data[i][j] = sum / norm;
				//result.data[i][j] = largest;
			}
		}
		
		return result;
	}*/
	
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
	
	/** 
	 * Template for a generic layer. 
	 * Implements functions setInput and setFeedbackInput
	 * Requires implementations of validateInput, validateFeedbackInput, compute, and computeFeedback
	 */
	var Layer = function() {
		if (this.constructor === Layer) {
			return Layer(...arguments);
		}
		
		let that = createObject(Object.create(null), Layer);
		
		let input;
		let feedbackInput;
		
		Object.defineProperty(that, "input", {get(){return input}});
		Object.defineProperty(that, "feedbackInput", {get(){return feedbackInput}});
		
		that.setInput = function(data, compFlag = true) {
			let valid = this.validateInput(data);
			
			if (!valid) {
				throw new Error("Invalid input data");
			}
			
			input = data;
			if (compFlag) {
				this.compute(input);
			}
		}
		
		that.setFeedbackInput = function(data, compFlag = true) {
			let valid = this.validateFeedbackInput(data);
			
			if (!valid) {
				throw new Error("Invalid feedback input");
			}
			
			feedbackInput = data;
			if (compFlag) {
				this.computeFeedback(feedbackInput);
			}
		}
		
		return that;
	}
	
	/**
	 * Models a fully connected layer of neurons. 
	 * Takes a matrix with 1 column as an input, and returns a matrix with 1 column as an output
	 * Internal values are a weight matrix whose dimensions are *numOutputs* by *numInputs*, as well as a bias matrix whose dimensions are *numOutputs* by 1
	 * Each output is generated by taking a biased, weighted sum (weights and biases are given by rows in their respective matrices) of the inputs and passing it through an activation function
	 * 
	 * @param numInputs - The number of rows that the input matrix is expected to have. Also represents the number of neurons the previous layer has
	 * @param numOutputs - The number of rows that the output matrix will have. Also represents the number of neurons in the layer
	 * @param activFunc - The activation function to apply to the weighted sum
	 * @param dActivFunc - [Optional] The derivative of the activation function. If not given, the derivative will be calculated numerically
	 * @param weights - [Optional] A matrix to use as the weight matrix for the layer. If not given, or the matrix does not have the correct dimensions, a weight matrix will be randomly generated
	 * @param biases - [Optional] A matrix to use as the bias matrix for the layer. If not given, or the matrix does not have the correct dimensions, a bias matrix will be randomly generated
	 */
	var FullyConnectedLayer = function(numInputs, numOutputs, activFunc, dActivFunc, weights, biases) {
		if (this.constructor === FullyConnectedLayer) {
			return FullyConnectedLayer(...arguments);
		}
		
		let that = createObject(Layer(), FullyConnectedLayer);
		
		let weightRows = numOutputs;
		let weightColumns = numInputs;
		let weightedSums;
		let output;
		let feedbackOutput;
		let adjustments = Object.create(null);
		adjustments.weights = new Matrix(weightRows, weightColumns);
		adjustments.biases = new Matrix(numOutputs, 0);
		
		Object.defineProperty(that, "numInputs", {get(){return numInputs}});
		Object.defineProperty(that, "numOutputs", {get(){return numOutputs}});
		Object.defineProperty(that, "activFunc", {get(){return activFunc}});
		Object.defineProperty(that, "dActivFunc", {get(){return dActivFunc}});
		Object.defineProperty(that, "weights", {get(){return weights}});
		Object.defineProperty(that, "biases", {get(){return biases}});
		Object.defineProperty(that, "output", {get(){return output}});
		Object.defineProperty(that, "feedbackOutput", {get(){return feedbackOutput}});
		Object.defineProperty(that, "adjustments", {get(){return adjustments}});
		
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
		if (!dActivFunc) {
			// If not, create a function that performs a numerical derivative at a point
			dActivFunc = numDeriv(activFunc);
		}
		
		// Check if a weight matrix is given
		if (weights) {
			// Check if the given weight matrix has the correct dimensions
			if (weights.rows === weightRows && weights.columns === weightColumns) {
				// If so, make a copy of the given weight matrix and store it as the layer's weights
				weights = copy(weights);
			} else {
				// Otherwise, throw an error
				throw new Error("Improperly formatted weight matrix");
			}
		} else {
			// If no weight matrix is given, generate random weights
			weights = randomWeights();
		}
		
		// Check if a bias matrix is given
		if (biases) {
			// Check if the given bias matrix has the correct dimensions
			if (biases.rows === numOutputs && biases.columns === 1) {
				// If so, make a copy of the given bias matrix and store it as the layer's biases
				biases = copy(biases);
			} else {
				// Otherwise, throw an error
				throw new Error("Improperly formatted bias matrix");
			}
		} else {
			// If no bias matrix is given, generate biases initialized to 0
			biases = randomBiases();
		}
		
		// Makes sure the input has *numInputs* number of rows and 1 column
		that.validateInput = function(data) {			
			return (data.rows === numInputs && data.columns === 1);
		}
		
		// Makes sure the feedback input has *numOutputs* number of rows and 1 column
		that.validateFeedbackInput = function(data) {
			return (data.rows === numOutputs && data.columns === 1);
		}
		
		// Populates the output matrix
		that.compute = function() {
			let input = this.input;
			
			weightedSums = add(multiply(weights, input), biases);
			output = applyFunc(weightedSums, activFunc);
		}
		
		// Populates the feedbackOutput matrix
		that.computeFeedback = function() {
			let feedbackInput = this.feedbackInput;
			feedbackOutput = new Matrix(numInputs, 1);
			
			feedbackOutput.data.forEach(function(row, i) {
				row[0] = feedbackInput.data.reduce(function(acc, num, j) {
					return acc + (weights.data[j][i] * dActivFunc(weightedSums.data[j][0]) * feedbackInput.data[j][0]);
				}, 0);
			});
		}
		
		// Adjusts the weight and bias matrices using the feedbackInput
		that.adjustInternalValues = function(learningRate) {
			let input = this.input;
			let feedbackInput = this.feedbackInput;
			adjustments.learningRate = learningRate;
			
			// ith output, jth input
			weights.data.forEach(function(row, i) {
				let coef = dActivFunc(weightedSums.data[i][0]) * feedbackInput.data[i][0];
				row.forEach(function(weight, j) {
					let adjustment = coef * input.data[j][0];
					
					adjustments.weights.data[i][j] = adjustment;
					weights.data[i][j] -= learningRate * adjustment;
				});
				
				let adjustment = coef;
				adjustments.biases.data[i][0] = adjustment;
				biases.data[i][0] -= learningRate * adjustment;
			});
		}
		
		return that;
	}
	
	/**
	 * Models a vectorization layer that rearranges the values in a series of image matrices into a matrix with one column
	 * Takes an array of images as an input and returns a matrix with 1 column as the output
	 * Used to interface between convolutional layers and fully connected layers
	 * Has no internal values
	 *
	 * @param numImgs - The number of images the layer expects to receive
	 * @param imgRows - The number of rows in each image
	 * @param imgColumns - The number of columns in each image
	 */
	var VectorizationLayer = function(numImgs, imgRows, imgColumns) {
		if (this.constructor === VectorizationLayer) {
			return VectorizationLayer(...arguments);
		}
		
		let that = createObject(Layer(), VectorizationLayer);
		
		let outputSize = numImgs * imgRows * imgColumns;
		let output;
		let feedbackOutput;

		Object.defineProperty(that, "numImgs", {get(){return numImgs}});
		Object.defineProperty(that, "imgRows", {get(){return imgRows}});
		Object.defineProperty(that, "imgColumns", {get(){return imgColumns}});
		Object.defineProperty(that, "outputSize", {get(){return outputSize}});
		Object.defineProperty(that, "output", {get(){return output}});
		Object.defineProperty(that, "feedbackOutput", {get(){return feedbackOutput}});
		
		// Makes sure the input is an array of *numImgs* images, and each image has *imgRows* rows and *imgColumns* columns
		that.validateInput = function(data) {
			if (data.length !== numImgs) {
				return false;
			}
			
			return data.every(function(img) {
				return (img.rows === imgRows && img.columns === imgColumns);
			});
		}
		
		// Makes sure the feedbackInput is a matrix of *outputSize* rows and 1 column
		that.validateFeedbackInput = function(data) {
			return (data.rows === outputSize && data.columns === 1);
		}
		
		// Populates the output matrix
		that.compute = function() {
			let input = this.input;
			let vector = [];
			
			input.forEach(function(img) {
				let newVector = vectorize(img);
				newVector.forEach(function(num) {
					vector.push(num);
				});
			});
			
			output = new Matrix(vector.length, 1, vector);
		}
		
		// Populates the feedbackOutput array with *numImgs* matrices, each having *imgRows* rows and *imgColumns* columns
		that.computeFeedback = function() {
			let feedback = this.feedbackInput;
			let imgs = [];
			let vector = vectorize(feedback);
			
			for (var i = 0; i < numImgs; i++) {
				let vectorSize = imgRows * imgColumns;
				imgs.push(new Matrix(imgRows, imgColumns, vector.slice(i * vectorSize, (i + 1) * vectorSize)));
			}
			
			feedbackOutput = imgs;
		}
	
		// Does nothing
		that.adjustInternalValues = function() {
		}
	
		return that;
	}
	
	/**
	 * Template for pooling layers
	 * Implements functions mapToPool, validateInput, validateFeedbackInput, compute, and adjustInternalValues
	 * Requires implementation of addToPool and computeFeedbackOutput
	 *
	 * Takes an array of images as an input and returns an array of the same number of smaller images
	 * The input images are shrunk by grouping pixels into windows of size *winSize*, applying a function on each group of pixels, and keeping the result as a pixel in the shrunken image
	 * Has no internal values
	 *
	 * @param numImgs - The number of images the layer expects to receive
	 * @param imgRows - The rows in the images the layer expects to receive
	 * @param imgColumns - The columns in the images the layer expects to receive
	 * @param winSize - The size of the window with which to pool each image
	 */
	var PoolingLayer = function(numImgs, imgRows, imgColumns, winSize) {
		if (this.constructor === PoolingLayer) {
			return PoolingLayer(...arguments);
		}
		
		let that = createObject(Layer(), PoolingLayer);
		
		let outputRows = Math.ceil(imgRows / winSize);
		let outputColumns = Math.ceil(imgColumns / winSize);
		let output;
		
		Object.defineProperty(that, "numImgs", {get(){return numImgs}});
		Object.defineProperty(that, "imgRows", {get(){return imgRows}});
		Object.defineProperty(that, "winSize", {get(){return winSize}});
		Object.defineProperty(that, "imgColumns", {get(){return imgColumns}});
		Object.defineProperty(that, "outputRows", {get(){return outputRows}});
		Object.defineProperty(that, "outputColumns", {get(){return outputColumns}});
		Object.defineProperty(that, "output", {get(){return output}});
		
		that.mapToPool = function(row, column) {
			let pos = Object.create(null);
			pos.row = Math.floor(row / winSize);
			pos.column = Math.floor(column / winSize);
			return pos;
		}
		
		that.validateInput = function(data) {
			if (data.length !== numImgs) {
				return false;
			}
			
			return data.every(function(img) {
				return (img.rows === imgRows && img.columns === imgColumns);
			});
		}
		
		that.validateFeedbackInput = function(data) {
			if (data.length !== numImgs) {
				return false;
			}
			
			return data.every(function(img) {
				return (img.rows === outputRows && img.columns === outputColumns);
			});
		}
		
		that.compute = function() {
			let input = this.input;
			let results = [];
			let that = this;
			
			input.forEach(function(img) {
				let pooledImg = new Matrix(that.outputRows, that.outputColumns);
				img.data.forEach(function(row, i) {
					row.forEach(function(pixel, j) {
						let poolPos = that.mapToPool(i, j);
						that.addToPool(pixel, poolPos.row, poolPos.column, pooledImg);
					});
				});
				results.push(pooledImg);
			});
			
			output = results;
		}
		
		that.adjustInternalValues = function() {
		}

		return that;
	}
	
	/**
	 * A pooling layer which keeps the largest pixel in each group of pixels and discards the rest
	 * 
	 * @param numImgs - The number of images the layer expects to receive
	 * @param imgRows - The rows in the images the layer expects to receive
	 * @param imgColumns - The columns in the images the layer expects to receive
	 * @param winSize - The size of the window with which to pool each image
	 */
	var MaxPoolingLayer = function(numImgs, imgRows, imgColumns, winSize) {
		if (this.constructor === MaxPoolingLayer) {
			return MaxPoolingLayer(...arguments);
		}
		
		let that = createObject(PoolingLayer(...arguments), MaxPoolingLayer);
		
		let maxPool = function(pixel, row, column, pooledImg) {
			let poolPixel = pooledImg.data[row][column];
			if (pixel > poolPixel) {
				pooledImg.data[row][column] = pixel;
			}
		}
		let feedbackOutput;
		
		that.computeFeedback = function() {
			let feedbackInput = this.feedbackInput;
			let pooledImgs = this.output;
			let imgs = this.input;
			let feedback = [];
			
			imgs.forEach(function(img, i) {
				let pooledImg = pooledImgs[i];
				let feedbackImg = new Matrix(imgRows, imgColumns);
				img.data.forEach(function(row, j) {
					row.forEach(function(pixel, k) {
						let poolPos = that.mapToPool(j, k);
						let pooledPixel = pooledImg.data[poolPos.row][poolPos.column];
						if (pixel === pooledPixel) {
							feedbackImg.data[j][k] = feedbackInput[i].data[poolPos.row][poolPos.column];
						} else {
							feedbackImg.data[j][k] = 0;
						}
					});
				});
				feedback.push(feedbackImg);
			});
			
			feedbackOutput = feedback;
		}
		
		Object.defineProperty(that, "addToPool", {get(){return maxPool}});
		Object.defineProperty(that, "feedbackOutput", {get(){return feedbackOutput}});
		
		return that;
	}
	
	/**
	 * A pooling layer which averages the values of the pixels in each group of pixels
	 * 
	 * @param numImgs - The number of images the layer expects to receive
	 * @param imgRows - The rows in the images the layer expects to receive
	 * @param imgColumns - The columns in the images the layer expects to receive
	 * @param winSize - The size of the window with which to pool each image
	 */
	var AveragePoolingLayer = function(numImgs, imgRows, imgColumns, winSize) {
		if (this.constructor === AveragePoolingLayer) {
			return AveragePoolingLayer(...arguments);
		}
		
		let that = createObject(PoolingLayer(...arguments), AveragePoolingLayer);
		
		let avgPool = function(pixel, row, column, pooledImg) {
			pooledImg.data[row][column] += (pixel / Math.pow(winSize, 2));
		}
		let feedbackOutput;
		
		that.computeFeedback = function() {
			let feedbackInput = this.feedbackInput;
			let pooledImgs = this.output;
			let imgs = this.input;
			let feedback = [];
			
			imgs.forEach(function(img, i) {
				let pooledImg = pooledImgs[i];
				let feedbackImg = new Matrix(imgRows, imgColumns);
				img.data.forEach(function(row, j) {
					row.forEach(function(pixel, k) {
						let poolPos = that.mapToPool(j, k);
						feedbackImg.data[j][k] = (1 / Math.pow(that.winSize, 2)) * feedbackInput[i].data[poolPos.row][poolPos.column];
					});
				});
				feedback.push(feedbackImg);
			});
			
			feedbackOutput = feedback;
		}
		
		Object.defineProperty(that, "addToPool", {get(){return avgPool}});
		Object.defineProperty(that, "feedbackOutput", {get(){return feedbackOutput}});
		
		return that;
	}
	
	/**
	 * Takes an array of images as an input and outputs an array of smaller images
	 */
	var ConvolutionLayer = function(numImgs, imgRows, imgColumns, kernelsPerImg, kernelRows, kernelColumns, activFunc, dActivFunc, kernels, biases) {
		if (this.constructor === ConvolutionLayer) {
			return ConvolutionLayer(...arguments);
		}
		
		let that = createObject(Layer(), ConvolutionLayer);
		let output;
		
		Object.defineProperty(that, "numImgs", {get(){return numImgs}});
		Object.defineProperty(that, "imgRows", {get(){return imgRows}});
		Object.defineProperty(that, "imgColumns", {get(){return imgColumns}});
		Object.defineProperty(that, "kernelsPerImg", {get(){return kernelsPerImg}});
		Object.defineProperty(that, "kernelRows", {get(){return kernelRows}});
		Object.defineProperty(that, "kernelColumns", {get(){return kernelColumns}});
		Object.defineProperty(that, "kernels", {get(){return kernels}});
		Object.defineProperty(that, "biases", {get(){return biases}});
		Object.defineProperty(that, "output", {get(){return output}});
		
		// Validates a kernel matrix
		function validateKernels(kernels) {
			// The kernel matrix must have *numImgs* rows and *kernelsPerImg* columns
			if (kernels.rows !== numImgs || kernels.columns !== kernelsPerImg) {
				return false;
			}
			
			// Checks that each kernel in the kernel matrix has the right dimensions
			for (var i = 0; i < numImgs; i++) {
				for (var j = 0; j < kernelsPerImg; j++) {
					let kernel = kernels.data[i][j];
					
					// Each kernel must have *kernelRows* rows and *kernelColumns* columns
					if (kernel.rows !== kernelRows || kernel.columns !== kernelColumns) {
						return false;
					}
				}
			}
			
			return true;
		}
		
		// Returns a copy of the kernel matrix
		function copyKernels(data) {
			let kernels = new Matrix(numImgs, kernelsPerImg);
			data.forEach(function(row, i) {
				row.forEach(function(kernel, j) {
					kernels.data[i][j] = copy(kernel);
				});
			});
			return kernels;
		}
		
		// Returns a kernel matrix with randomly generated kernels
		function randomKernels() {
			let kernels = new Matrix(numImgs, kernelsPerImg);
			for (var i = 0; i < numImgs; i++) {
				for (var j = 0; j < kernelsPerImg; j++) {
					let bound = Math.sqrt(6 / ((numImgs + kernelsPerImg) + Math.pow(5, 2)));
					kernels.data[i][j] = new Matrix(kernelRows, kernelColumns, getUDGen(-bound, bound));
				}
			}
			return kernels;
		}
		
		// Returns a copy of the bias matrix
		function copyBiases(biases) {
			let copy = [];
			biases.forEach(function(bias) {
				copy.push(bias);
			});
			return copy;
		}
		
		// Returns a bias matrix with biases set to 0
		function randomBiases() {
			let biases = [];
			for (var i = 0; i < numImgs; i++) {
				biases.push(0);
			}
			return biases;
		}
		
		// Check if the activation function's derivative is provided
		if (!dActivFunc) {
			// If not, create a function that performs a numerical derivative at a point for the activation function
			dActivFunc = numDeriv(activFunc);
		}
		
		// Check if a kernel matrix is provided, and validate it if so
		if (kernels) {
			if (validateKernels(kernels)) {
				kernels = copyKernels(kernels);
			} else {
				throw new Error("Improperly formatted kernel matrix");
			}
		} else {
			kernels = randomKernels();
		}
		
		// Check if a bias matrix is provided, and validate it if so
		if (biases) {
			if (biases.length === numImgs) {
				biases = copyBiases(biases);
			} else {
				throw new Error("Improperly formatted biases");
			}
		} else {
			biases = randomBiases();
		}
		
		// Validates input data
		that.validateInput = function(data) {
			if (data.length !== numImgs) {
				return false;
			}
			
			for (var i = 0; i < data.length; i++) {
				if (data[i].rows !== imgRows || data[i].columns !== imgColumns) {
					return false;
				}
			}
			
			return true;
		}
		
		// Computes convolved images from input images
		that.compute = function() {
			let input = this.input;
			let results = [];
			
			// Loops through each row of the kernel matrix
			kernels.data.forEach(function(row, i) {
				let newImg;
				
				// Loops through each kernel in the row
				row.forEach(function(kernel, j) {
					// Convolves the input image with the kernel
					let convolvedImg = convolve(kernel, biases[j], input[j], false);
					
					// If this is not the first image, add together the convolved image with the previous ones
					if (j === 0) {
						newImg = convolvedImg;
					} else {
						add(newImg, convolvedImg, false, true);
					}
				});
				
				// Passes the new image through the activation function
				applyFunc(newImg, activFunc, true);
				
				// Pushes the new image to the results
				results.push(newImg);
			});
			
			output = results;
		}
		
		that.computeFeedback = function() {
			let feedback = [];
			
			// Loops through each image
			for (var img = 0; img < numImgs; img++) {
				feedbackImg = new Matrix(imgRows, imgColumns);
				
				// For each image, loops through each kernel in the kernel matrix column
				for (var kernel = 0; kernel < kernelsPerImg; kernel++) {
					feedbackImg.data.forEach(function(row, imgRow) {
						row.forEach(function(col, imgCol) {
							
						});
					});
				}
				
				feedback.push(feedbackImg);
			}
			
			feedbackOutput = feedback;
		}
		
		return that;
	}
	
	var LossFunction = function() {
		if (this.constructor === LossFunction) {
			return LossFunction(...arguments);
		}
		
		let that = createObject(Object.create(null), LossFunction);
		let prediction;
		let label;
		
		Object.defineProperty(that, "prediction", {get(){return prediction}});
		Object.defineProperty(that, "label", {get(){return label}});
		
		that.setInput = function(pData, lData, compFlag) {
			let pValid = this.validatePrediction(pData);
			let lValid = this.validateLabel(lData);
			
			if (!pValid) {
				throw new Error("Invalid prediction data");
			}
			
			if (!lValid) {
				throw new Error("Invalid label data");
			}
			
			prediction = pData;
			label = lData;
			
			if (compFlag) {
				this.computeLoss();
			}
		}
		
		return that;
	}
	
	var SquaredErrorLoss = function(numPredictions) {
		if (this.constructor === SquaredErrorLoss) {
			return SquaredErrorLoss(...arguments);
		}
		
		let that = createObject(LossFunction(), SquaredErrorLoss);
		let loss;
		let feedback;
		
		Object.defineProperty(that, "numPredictions", {get(){return numPredictions}});
		Object.defineProperty(that, "loss", {get(){return loss}});
		Object.defineProperty(that, "feedback", {get(){return feedback}});
		
		that.validatePrediction = function(data) {
			return (data.rows === numPredictions && data.columns === 1);
		}
		
		that.validateLabel = function(data) {
			return this.validatePrediction(data);
		}
		
		that.computeLoss = function() {
			let prediction = this.prediction;
			let label = this.label;
			let squaredError = 0;
			
			prediction.data.forEach(function(row, i) {
				squaredError += Math.pow(row[0] - label.data[i][0], 2);
			});
			
			loss = squaredError;
		}
		
		that.computeFeedback = function() {
			let prediction = this.prediction;
			let label = this.label;
			
			feedback = new Matrix(numPredictions, 1);
			
			feedback.data.forEach(function(row, i) {
				row[0] = 2 * (prediction.data[i][0] - label.data[i][0]);
			});
		}
		
		return that;
	}
	
	var MeanSquaredErrorLoss = function(numPredictions) {
		if (this.constructor === MeanSquaredErrorLoss) {
			return MeanSquaredErrorLoss(...arguments);
		}
		
		let that = createObject(LossFunction(), MeanSquaredErrorLoss);
		let loss;
		let feedback;
		
		Object.defineProperty(that, "numPredictions", {get(){return numPredictions}});
		Object.defineProperty(that, "loss", {get(){return loss}});
		Object.defineProperty(that, "feedback", {get(){return feedback}});
		
		that.validatePrediction = function(data) {
			return (data.rows === numPredictions && data.columns === 1);
		}
		
		that.validateLabel = function(data) {
			return this.validatePrediction(data);
		}
		
		that.computeLoss = function() {
			let prediction = this.prediction;
			let label = this.label;
			let squaredError = 0;
			
			prediction.data.forEach(function(row, i) {
				squaredError += Math.pow(row[0] - label.data[i][0], 2);
			});
			
			loss = squaredError / numPredictions;
		}
		
		that.computeFeedback = function() {
			let prediction = this.prediction;
			let label = this.label;
			
			feedback = new Matrix(numPredictions, 1);
			
			feedback.data.forEach(function(row, i) {
				row[0] = (2 * (prediction.data[i][0] - label.data[i][0])) / numPredictions;
			});
		}
		
		return that;
	}
	
	var Network = function(layers, lossFunction) {
		if (this.constructor === Network) {
			return Network(...arguments);
		}
		
		let that = createObject(Object.create(null), Network);
		let input;
		let output;
		let label;
		let loss;
		let validateInput;
		let compute;
		let learningRate = 0.1;
		let propagateToInput = false;
		
		Object.defineProperty(that, "layers", {get(){return layers}});
		Object.defineProperty(that, "lossFunction", {get(){return lossFunction}});
		Object.defineProperty(that, "input", {get(){return input}});
		Object.defineProperty(that, "output", {get(){return output}});
		Object.defineProperty(that, "label", {get(){return label}});
		Object.defineProperty(that, "loss", {get(){return loss}});
		Object.defineProperty(that, "validateInput", {get(){return validateInput}});
		Object.defineProperty(that, "compute", {get(){return compute}});
		Object.defineProperty(that, "learningRate", {get(){return learningRate}, set(num){learningRate = num}});
		Object.defineProperty(that, "propagateToInput", {get(){return propagateToInput}, set(bool){propagateToInput = bool}});
		
		validateInput = function(data) {
			return layers[0].validateInput(data);
		}
		
		compute = function() {
			let layerInput = input;
			layers.forEach(function(layer) {
				layer.setInput(layerInput);
				layerInput = layer.output;
			});
			output = layers.last.output;
		}
		
		that.backpropagate = function(adjustFlag = true) {
			lossFunction.computeFeedback();
			
			let layerFeedbackInput = lossFunction.feedback;
			for (var i = layers.length - 1; i >= 0; i--) {
				let layer = layers[i];
				if (i === 0 && !propagateToInput) {
					layer.setFeedbackInput(layerFeedbackInput, false);
				} else {
					layer.setFeedbackInput(layerFeedbackInput);
					layerFeedbackInput = layer.feedbackOutput;
				}
				
				if (adjustFlag) {
					layer.adjustInternalValues(learningRate);
				}
			}
		}
		
		that.setInput = function(data, compFlag = true) {
			let valid = validateInput(data);
			
			input = data;
			if (compFlag) {
				compute(input);
			}
		}
		
		that.setLabel = function(data, compFlag = true) {
			lossFunction.setInput(output, data, compFlag);
			
			label = data;
			loss = lossFunction.loss;
		}
		
		return that;
	}
	
	var FCNetwork = function(neuronArray, activFunc, dActivFunc) {
		if (this.constructor === FCNetwork) {
			return FCNetwork(...arguments);
		}
		
		let layers = [];
		let numInputs = neuronArray[0];
		let lossFunction;
		
		if (typeof neuronArray[0] === "number") {
			neuronArray.forEach(function(neurons, i) {
				if (i === 0) {
					return;
				}
				
				let layer = new FullyConnectedLayer(neuronArray[i - 1], neurons, activFunc, dActivFunc);
				
				layers.push(layer);
			});
			lossFunction = new SquaredErrorLoss(neuronArray.last);
		} else {
			layers = neuronArray;
			lossFunction = new SquaredErrorLoss(layers.last.numOutputs);
		}
		
		let that = createObject(Network(layers, lossFunction), FCNetwork);
		
		that.getJSON = function() {
			let obj = Object.create(null);
			
			obj.weightMatrices = [];
			obj.weightData = [];
			obj.biasMatrices = [];
			obj.biasData = [];
			
			for (var i = 0; i < layers.length; i++) {
				obj.weightData.push(layers[i].weights.columns);
				obj.biasData.push(layers[i].biases.columns);
				
				let weightMatrix = [];
				
				layers[i].weights.data.forEach(function(row) {
					row.forEach(function(weight) {
						weightMatrix.push(weight);
					});
				});
				
				let biasMatrix = [];
				
				layers[i].biases.data.forEach(function(row) {
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
		
		Object.defineProperty(that, "neuronArray", {get(){return neuronArray}});
		Object.defineProperty(that, "numInputs", {get(){return numInputs}});
		
		return that;
	}
}

/*var layerDataList = [];
layerDataList.push(new LayerData("convolution", 6, 5, false));
layerDataList.push(new LayerData("rectifier", activFunc));
layerDataList.push(new LayerData("pooling", 2, 2));
layerDataList.push(new LayerData("convolution", 12, 5, false));
layerDataList.push(new LayerData("rectifier", activFunc));
layerDataList.push(new LayerData("pooling", 2, 2));*/

/*var layers = [];
layers.push(new ConvolutionLayer(1, 28, 28, 6, 5, 5, activFunc));
layers.push(new MaxPoolingLayer(6, 24, 24, 2));
layers.push(new ConvolutionLayer(6, 12, 12, 12, 5, 5, activFunc));
layers.push(new MaxPoolingLayer(12, 8, 8, 2));
layers.push(new VectorizationLayer(12, 4, 4));
layers.push(new FullyConnectedLayer(192, 10, activFunc));
var lossFunction = new SquaredErrorLoss(10);
var conNet = new Network(layers, lossFunction);*/