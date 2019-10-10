{
	var Matrix = function(rows, columns, from) {
		let random = (from === "random");
		let number = (typeof from === "number");
		let applyFunc = (typeof from === "function");
		let array;
		if (from)
			array = Boolean(from.forEach);
		let data = [];
		
		Object.defineProperty(this, "columns", {get(){return columns}});
		Object.defineProperty(this, "rows", {get(){return rows}});
		//Object.defineProperty(this, "data", {get(){return data}});
		
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
		
		this.data = data;
	}
	
	/**
	 * Takes two matrices and multiplies them. Alternatively, takes a number and a matrix and multiplies them.
	 * If the two provided matrices cannot be multiplied because of incorrect dimensions, the function will return false
	 * 
	 * @param A - The first matrix
	 * @param B - The second matrix, or a number
	 * @param mutate - If true, A is changed. If false, a new matrix is created to which the output is stored into
	 *
	 * @return The resulting matrix if mutate is false, or true if it is true
	 */
	var multiply = function(A, B, mutate = false) {
		if (typeof B !== "number" && A.columns !== B.rows)
			return false;
		
		if (mutate) {
			if (typeof B !== "number") {
				for (var i = 0; i < A.rows; i++) {
					for (var j = 0; j < B.columns; j++) {
						let sum = 0;
						for (var k = 0; k < A.columns; k++) {
							sum += A.data[i][k] * B.data[k][j];
						}
						A.data[i][j] = sum;
					}
				}
			} else {
				A.data.forEach(function(row, i) {
					row.forEach(function(column, j) {
						A.data[i][j] = column * B;
					});
				});
			}
			
			return true;
		} else {
			let result;
		
			if (typeof B !== "number") {
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
				result = new Matrix(A.rows, A.columns);
			
				A.data.forEach(function(row, i) {
					row.forEach(function(column, j) {
						result.data[i][j] = column * B;
					});
				});
			}
		
			return result;
		}
	}
	
	/**
	 * Adds two matrices. Alternatively, adds a number to every element of a matrix
	 * If the two matrices cannot be added because of indirect dimensions, the function returns false
	 *
	 * @param A - The first matrix
	 * @param B - The second matrix
	 * @param subtract - If set to true, B will be subtracted from A, otherwise they will be added
	 * @param mutate - If set to true, the calculated values will be put directly into A, otherwise a new matrix will be created for the results
	 *
	 * @return False if A and B are not of the same dimensions, true if mutate is set to true, or the result if mutate is set to false
	 */
	var add = function(A, B, subtract = false, mutate = false) {
		if (typeof B !== "number" && (A.rows !== B.rows || A.columns !== B.columns))
			return false;
		
		let coef = Boolean(subtract) ? -1 : 1;
		
		if (mutate) {
			A.data.forEach(function(row, i) {
				row.forEach(function(column, j) {
					if (typeof B !== "number") {
						A.data[i][j] = column + (coef * B.data[i][j]);
					} else {
						A.data[i][j] = column + (coef * B);
					}
				});
			});
			
			return true;
		} else {
			let result = new Matrix(A.rows, A.columns);
		
			A.data.forEach(function(row, i) {
				row.forEach(function(column, j) {
					if (typeof A !== "number") {
						result.data[i][j] = column + (coef * B.data[i][j]);
					} else {
						result.data[i][j] = column + (coef * B);
					}
				});
			});
		
			return result;
		}
	}
	
	var applyFunc = function(A, func, mutate) {
		if (mutate) {
			A.data.forEach(function(row, i) {
				row.forEach(function(column, j) {
					A.data[i][j] = func(column);
				});
			});
			
			return true;
		} else {
			let result = new Matrix(A.rows, A.columns);
			
			A.data.forEach(function(row, i) {
				row.forEach(function(column, j) {
					result.data[i][j] = func(column);
				});
			});
			
			return result;
		}
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
	}
}