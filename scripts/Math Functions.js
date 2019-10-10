//This function does synthetic division when given the divisor and a list of coefficients
function syntheticDivsion(a, list) {
	let coefs = [list[0]];
	for (var b = 1; b < list.length; b++)
		coefs.push((coefs[b - 1] * a) + list[b]);
	return {r: coefs.pop(), coef: coefs};
}

//This function reduces a fraction when given a numerator and denominator
function reduce(numerator, denominator) {
	let gcd = (a, b) => {
		return b ? gcd(b, a % b) : a;
	};
	gcd = gcd(numerator, denominator);
	return [numerator / gcd, denominator / gcd];
}

//This function returns the gcd of numbers in an array
function gcd(list) {
	let min = Math.min.apply(null, list.map(Math.abs));
	for (var a = 0; a < list.length; a++)
		list[a] = list[a] == min ? min : list[a] % min;
	while (list.indexOf(0) != -1)
		list.splice(list.indexOf(0), 1);
	return list.length == 1 ? list[0] : gcd(list);
}

//Finds a rational number (in fraction form) for a given input
function find_rational(value) {
	var best_numer = 1;
	var best_denom = 1;
	var best_err = Math.abs(value - best_numer / best_denom);
	for (var denom = 1; best_err > 0 && denom <= 10000; denom++) {
		var numer = Math.round(value * denom);
		var err = Math.abs(value - numer / denom);
		if (err < best_err) {
			best_numer = numer;
			best_denom = denom;
			best_err = err;
			//console.log(best_numer + " / " + best_denom + " = " + (best_numer/best_denom) + " error " + best_err);
		}
	}
	return [best_numer, best_denom];
}

//These functions work together to factor a polynomial. The output is a string
function reduce(num, dem) {
	let gcd = (a, b) => {
		return b ? gcd(b, a%b) : a;
	}
	gcd = gcd(num, dem);
	return [num / gcd, dem / gcd];
}

function solve(c, d) {
	return [(d + Math.sqrt((-4 * c) + (d * d))) / 2, d - (d + Math.sqrt((-4 * c) + (d * d))) / 2];
}

function factor(a, b, c) {
	return "(" + reduce(solve(a * c, b)[0], a)[1].toString() + "x + " + reduce(solve(a * c, b)[0], a)[0].toString() + ")(" + reduce(solve(a * c, b)[1], a)[1].toString() + "x + " + reduce(solve(a * c, b)[1], a)[0].toString() + ")";
}

//This function takes a whole number and returns its factorial
function factorial(n) {
	return n ? n * factorial(n - (Math.abs(n) / n)) : 1;
}

//This function takes a row and a column of pascal's triangle and tells you what the number at those coordinates is
function pascalsTriangle(n, r) {
	var nFact = function factorial(n) {
		return n ? n * factorial(n - (Math.abs(n) / n)) : 1;
	}
	var rFact = nFact(r);
	var nminrFact = nFact(n - r);
	nFact = nFact(n);
	return nFact / (rFact * nminrFact);
}

//This function finds the factors of a number
function factors(aN) {
 var length = (Math.round((aN - Math.floor(aN)) * Math.pow(10, 10)) / Math.pow(10, 10)).toString().replace("0.", "").length - 1;
 var factors = [aN];
 for (var i = 1; i < aN * Math.pow(10, length); i++)
  if (((aN * Math.pow(10, length)) / i) == Math.round((aN * Math.pow(10, length)) / i)){factors.push(i);}
 return factors;
}

//This function combines the numbers given in the lists as the parameters
function rationalRoots(a0, aN) {
	var possibleRoots = "";//[];
	for (var i = 0; i < aN.length; i++) { 
		for (var e = 0; e < a0.length; e++)
			possibleRoots += a0[e] + "/" + aN[i] + ", ";//possibleRoots.push([a0[e], aN[i]]);
	}
	return possibleRoots.slice(0, possibleRoots.length - 2);
}

//Matrix Functions:
//Note, some of the functions below require the function copyMatrix to work, which takes a matrix
//as an input and writes it to it's return.

//Takes an input of a matrix, copies it to a new variable, and returns the new variable
function copyMatrix(list) {
	var b = [];
	for (var a = 0; a < list.length; a++) {
		b.push([]);
		for (var c = 0; c < list[0].length; c++)
			b[a].push(list[a][c]);
	}
	return b;
}

//Takes a matrix as an input and returns the matrix's determinant (requires copyMatrix). 
function getDeterminant(matrix) {
	if (matrix.length != matrix[0].length)
		return "Invalid input";
	if (matrix.length == 2)
		return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
	else {
		var determinants = [];
		var b = [];
		for (var a = 0; a < matrix.length; a++) {
			b = copyMatrix(matrix);
			b.shift();
			for (var c = 0; c < matrix.length - 1; c++)
				b[c].splice(a, 1);
			determinants.push(getDeterminant(b));
		}
		b = 0;
		if (Math.round(matrix.length / 2) == (matrix.length / 2))
			coef = -1;
		else
			coef = 1;
		for (var a = 0; a < matrix.length; a++) {
			b += matrix[0][a] * determinants[a] * coef;
			coef *= -1;
		}
		if (Math.round(matrix.length / 2) == (matrix.length / 2))
			return -1 * b;
		else
			return b;
	}  
}

//Takes an input of two matrices and returns the product matrix (requires copyMatrix)
function multiplyMatrices(matrix1, matrix2) {
	if (Number(matrix1).toString() === "NaN" && matrix1[0].length !== matrix2.length)
		return "Cannot multiply";
	var matrix3 = [];
	if (Number(matrix1).toString() === "NaN") {
		for (var a = 0; a < matrix1.length; a++) {
			var matrixRow = [];
			for (var b = 0; b < matrix2[0].length; b++) {
				var d = 0;
				for (var c = 0; c < matrix2.length; c++)
					d += matrix1[a][c] * matrix2[c][b];
				matrixRow.push(d);
			}
			matrix3.push(matrixRow);
		}
		return matrix3;
	} else {
		matrix3 = copyMatrix(matrix2);
		for (var a = 0; a < matrix2.length; a++) {
			for (var b = 0; b < matrix2.length; b++)
				matrix3[a][b] = matrix2[a][b] * matrix1;
		}
		return matrix3;
	}
}

//Takes an input of two matrices and returns the sum
function addMatrices(matrix1, matrix2) {
	if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length)
		return "cannot add"
	var matrix3 = [];
	for (var a = 0; a < matrix1.length; a++) {
		matrix3.push([]);
		for (var b = 0; b < matrix1[0].length; b++)
			matrix3[a][b] = matrix1[a][b] + matrix2[a][b];
    }
	return matrix3
}

//Takes an input matrix and returns the transposed input matrix
function transposeMatrix(matrix1) {
	var matrix2 = [];
	for (var a = 0; a < matrix1[0].length; a++)
		matrix2.push([]);
	for (var a = 0; a < matrix1.length; a++) {
		for (var b = 0; b < matrix1[0].length; b++)
			matrix2[b].push(matrix1[a][b]);
	}
	return matrix2;
}

function fix(matrix) {
	var matrix2 = copyMatrix(matrix);
	for (var a = 0; a < matrix.length; a++) {
		for (var b = 0; b < matrix[0].length; b++)
			matrix2[a][b] = Math.round(matrix[a][b] * Math.pow(10, 14)) / Math.pow(10, 14);
	}
	return matrix2;
}

function displayMatrix(matrix) {
	for (var a = 0; a < matrix.length; a++) {
		if (a === 0)
			console.log('[[' + matrix[a].toString().replace(new RegExp(',', 'g'), ' ') + ']');
		else if (a === (matrix.length - 1))
			console.log(' [' + matrix[a].toString().replace(new RegExp(',', 'g'), ' ') + ']]');
		else
			console.log(' [' + matrix[a].toString().replace(new RegExp(',', 'g'), ' ') + ']');
	}
}

function getMatrixOfCofactors(matrix) {
	if (matrix.length != matrix[0].length)
		return "Invalid input";
	else {
		var coef = 1;
		var cofactorMatrix = copyMatrix(matrix);
		for (var a = 0; a < matrix.length; a++) {
			for (var b = 0; b < matrix.length; b++) {
				cofactorMatrix[a][b] *= Math.pow(-1, a + b + 2);
				//cofactorMatrix[a][b] *= coef;
				//coef *= -1;
			}
			/*if (Math.round(matrix.length / 2) == (matrix.length / 2))
				coef *= -1;*/
		}
		return cofactorMatrix;
	}
}

function getMatrixOfMinors(matrix) {
	if (matrix.length != matrix[0].length)
		return "Invalid input";
	else {
		if (matrix.length == 2)
			return [[matrix[1][1], matrix[1][0]], [matrix[0][1], matrix[0][0]]];
		else {
			var minorMatrix = copyMatrix(matrix);
			for (var a = 0; a < matrix.length; a++) {
				for (var b = 0; b < matrix.length; b++) {
					var d = copyMatrix(matrix);
					d.splice(a, 1);
					for (var c = 0; c < matrix.length - 1; c++)
						d[c].splice(b, 1);
					minorMatrix[a][b] = getDeterminant(d);
				}
			}
			return minorMatrix;
		}
	}
}

function adjugateMatrix(matrix) {
	if (matrix.length != matrix[0].length)
		return "Invalid input";
	else {
		var adjugatedMatrix = copyMatrix(matrix);
		for (var a = 0; a < matrix.length; a++) {
			for (var b = 0; b < matrix.length; b++)
				adjugatedMatrix[a][b] = matrix[b][a];
		}
		return adjugatedMatrix;
	}
}

//Takes a matrix and outputs its reciprocal. Requires multiplyMatrices, getDeterminant, adjugatMatrix, getMatrixOfCofactors, getMatrixOfMinors
function invertMatrix(matrix) {
	return multiplyMatrices((1 / getDeterminant(matrix)), adjugateMatrix(getMatrixOfCofactors(getMatrixOfMinors(matrix))));
}

//Takes a list of numbers and sums them
function sum(list) {
	var sum = 0;
	for (var a = 0; a < list.length; a++) {
		sum += list[a];
    }
	return sum;
}

//Takes two lists of numbers and multiplies the two lists
function multiplyLists(list1, list2) {
	var newList = [];
	for (var a = 0; a < list1.length; a++) {
		newList[a] = list1[a] * list2[a];
    }
	return newList;
}

//Takes a list of numbers and raises each number by a power p
function raiseList(list, p) {
	var newList = [];
	for (var a = 0; a < list.length; a++) {
		newList[a] = Math.pow(list[a], p);
    }
	return newList;
}

//Takes two lists of numbers, and a variable 'order' and returns the factors for a regression polynomial of order 'order' equation
//Requires sum, raiseList, multiplyLists, fix, invertMatrix (requires getDeterminant, getMatrixOfCofactors, getMatrixOfMinors, adjugateMatrix, copyMatrix), and multiplyMatrices
function getFactors(x, y, order) {
	var xMatrix = [];
	var xyMatrix = [];
	for (var a = 0; a < (order + 1); a++) {
		xMatrix.push([]);
		xyMatrix.push([]);
		for (var b = 0; b < (order + 1); b++) {
			xMatrix[a].push(sum(raiseList(x, (a + b))));
        }
		if (a === 0)
			xyMatrix[a].push(sum(y));
		else
			xyMatrix[a].push(sum(multiplyLists(raiseList(x, a), y)));
    }
	return fix(multiplyMatrices(invertMatrix(xMatrix), xyMatrix));
}

//This function checks if a number is prime
function checkPrime(num) {
 for (var b = 2; b < num; b++) {
  if ((num % b) == 0)
   return false;
 }
 return true;
}

//This function finds the prime numbers between 0 and its argument. It requires the checkPrime function
function generatePrimes(num) {
 var list = [];
 if (num >= 2)
  list.push(2);
 for (var a = 1; a < (Math.abs(num) + 1); a+=2) {
  if (checkPrime(a))
   list.push(a);
 }
 list.splice(list.indexOf(1), 1);
 return list;
}

//This function gets the prime factors of the input. It requires the checkPrime and generatePrimes function.
function getPrimeFactors(num, known = []) {
 if (checkPrime(num))
  return [num];
 var primes = [];
 if (known.length == 0)
  known = generatePrimes(num);
 for (var a = 0; a < num; a++) {
  if ((num % a) != 0 || known.indexOf(a) == -1)
   continue;
  primes.push(a);
  break;
 }
 var recPrimes = (getPrimeFactors(num / primes[primes.length - 1], known));
 for (var a = 0; a < recPrimes.length; a++)
  primes.push(recPrimes[a]);
 return primes;
}

//Gets all the factors (prime and composite) of a number. Requires getPrimeFactors (requires checkPrime and generatePrimes)
function getAllFactors(num) 
{
	var primeFactors = getPrimeFactors(num);
	var factors = [];
	for (var a = 0; a < primeFactors.length - 1; a++)
	{
		for (var b = a; b < primeFactors.length; b++)
		{
			factors.push(primeFactors[a] * primeFactors[b]);
		}
	}
	return factors;
}

//This function uses the law of sines to find a mising side or angle
//Given a list two sides and a list of one angle, it will find the missing angle
//Alternatively, given a list of one side and a list of two angles, it will find the missing side
//Examples: lawOfSines([2, 4], [Math.PI / 6, null]) will return a value for angles[1]
//Examples: lawOfSines([null, 4], [Math.PI / 6, Math.PI / 2]) will return a value for sides[0]
function lawOfSines(sides, angles) {
 if (sides.indexOf(null) == -1) {
  var kA = (angles.indexOf(null) * -1) + 1; //kA = knownAngle
  return Math.asin((sides[angles.indexOf(null)] * Math.sin(angles[kA])) / (sides[kA]));
 } else {
  var kS = (sides.indexOf(null) * -1) + 1; //kS = knownSide
  return (sides[kS] * Math.sin(angles[sides.indexOf(null)])) / (Math.sin(angles[kS]));
 }
}

//This function uses the law of cosines to find a missing side or angle
//Given a list of two sides, and an angle, it will find the missing side
//Alternatively, given a list of three sides, it will find the missing angle
function lawOfCosines(sides, C) {
 if (sides.length == 3) {
  return Math.acos((Math.pow(sides[0], 2) - Math.pow(sides[1], 2) - Math.pow(sides[2], 2)) / (-2 * sides[0] * sides[1]));
 } else {
  return Math.sqrt(Math.pow(sides[0], 2) + Math.pow(sides[1], 2) - (2 * sides[0] * sides[1] * Math.cos(C)));
 }
}

/**
 * Finds the sum of an arithmetic sequence 
 * @param {object} or {array} bounds - an array of the form [n1, n2] which instructs the function to find the sum between
 * the n1th term and n2th term or an object representing two terms in the sequence of the form {n1: v1, n2: v2} where 
 * n1 is the n1th term in the sequence with a value of v1 and n2 is the n2th term in the sequence with a value of v2
 *
 * @param {object} terms - an object representing two (or three) terms in the sequence of the form {n1: v1, n2: v2} where 
 * n1 is the n1th term in the sequence with a value of v1 and n2 is the n2th term in the sequence with a value of v2.
 * This parameter is only used if @param bounds is an array
 *
 * @param {string} type - specifies whether the sequence to be summed is an arithmetic sequence or geometric sequence.
 * If bounds is an object or values only has two terms, this parameter is necessary. It can be left undefined if @param 
 * values is given a third term. 
 *
 * Examples:
 * findSum({1: 1, 3: 3}, "arithmetic") would find the sum between the 1st term in the arithmetic sequence whose value is 1 and the 3rd term in 
 * the sequence whose value is 3 and would return 6
 *
 * findSum({1: 1, 3: 4}, "geometric") would find the sum between the 1st term in the geometric sequence whose value is 1 and the 3rd term in 
 * the sequence whose value is 3 and would return 7
 *
 * findSum([1, 3], {5: 5, 6: 6}, "arithmetic") would find the sum between the 1st term in the sequence and the 3rd term in the 
 * sequence given that the 5th term in the sequence is 5 and the 6th term is 6th and would return 6
 */
function findSum(bounds, terms, type) {;
	//Initialize variables
	let result, labels = [];
	
	//Check to make sure n is defined
	if (!bounds)
		return bounds;

	if (!!terms && typeof terms === "object") //If values is an object, get its keys
		labels = keys(terms);
	else if (typeof bounds === "object" && bounds[0] && bounds[1]) //If values is not defined and n is a list, return undefined since there is not enough information
		return undefined;
		
	let sum = (bounds, terms, type) => {
		let d, r, upperValue, lowerValue, labels = keys(terms);
		if (type === "arithmetic") {
			d = (terms[labels[1]] - terms[labels[0]]) / (labels[1] - labels[0]);
			upperValue = terms[labels[0]] + d * (bounds[1] - labels[0]);
			lowerValue = terms[labels[0]] + d * (bounds[0] - labels[0]);
			return {sum: 0.5 * (upperValue + lowerValue) * (bounds[1] - bounds[0] + 1), info: "d = " + d + ", a" + bounds[0] + " = " + lowerValue + ", " + "a" + bounds[1] + " = " + upperValue};
		} else {
			r = Math.pow(terms[labels[1]] / terms[labels[0]], 1 / (labels[1] - labels[0]));
			upperValue = terms[labels[0]] * Math.pow(r, bounds[1] - labels[0]);
			lowerValue = terms[labels[0]] * Math.pow(r, bounds[0] - labels[0]);
			return {sum: (r * upperValue - lowerValue) / (r - 1), info: "r = " + r + ", a" + bounds[0] + " = " + lowerValue + ", " + "a" + bounds[1] + " = " + upperValue};
		}
	};
		
	if (typeof bounds === "object" && bounds[0] && bounds[1]) { //Check is n is a list
		if (labels.length < 3 && !!type) {
			result = sum(bounds, terms, type);
		} else if (labels.length > 2) {
			if (((terms[labels[1]] - terms[labels[0]]) / (labels[1] - labels[0])) === ((terms[labels[2]] - terms[labels[1]]) / (labels[2] - labels[1]))) {
				result = sum(bounds, terms, "arithmetic");
			} else {
				result = sum(bounds, terms, "geometric");
			}
		} else {
			return undefined;
		}
    } else if (typeof bounds === "object") { //Check if n is an object
		labels = keys(bounds);
		if (labels.length < 2 || !terms) //Make sure n has more than one key
			return undefined;
		result = sum([labels[0], labels[1]], bounds, terms);
    }
	//If result is not a number, return undefined
	return !Number(result.sum) ? undefined : result;
}