/**
 * Huffman Coding file format spec:
 * The file is separated into 4 sections:
 * 1st - 4 bytes whose value is the number of bytes used to encode the tree
 * 2nd - The tree encoded as utf-8 characters in JSON
 * 3rd - 1 byte storing the number of bits that the body exceeds a number divisible by 8 by. In other words, it is the number of bits in the message mod 8
 * 4th - The body
 */

var HCFile = (function() {
	/**
	 * Quick implementation of quicksort stolen off of wikipedia.
	 * The pivot is the middle value of the array
	 *
	 * @param A - The array to sort
	 * @param getVal - Function to get the value of an element of A used in comparisons. Defaults to returning the element if no function is provided
	 * @return - The sorted array
	 */
	function quicksort(A, getVal) {
		if (!getVal) {
			getVal = function(x) {
				return x;
			}
		}

		function sort(A, lo, hi) {
			if (lo < hi) {
				let p = partition(A, lo, hi);
				sort(A, lo, p);
				sort(A, p + 1, hi);
			}
		}

		function swap(A, lo, hi) {
			let x = A[lo];
			A[lo] = A[hi];
			A[hi] = x;
		}

		function partition(A, lo, hi) {
			let pivot = getVal(A[Math.floor(lo + (hi - lo) / 2)]);
			let i = lo - 1;
			let j = hi + 1;
			while (true) {
				do {
					i++;
				} while (getVal(A[i]) < pivot);
				do {
					j--;
				} while (getVal(A[j]) > pivot);
				if (i >= j) {
					return j;
				}
				swap(A, i, j);
			}
		}

		sort(A, 0, A.length - 1);
		return A;
	}

	/**
	 * Creates a Huffman Tree given a string.
	 * Counts the frequency of each character that appears in the string
	 *
	 * The returned tree object is a 2 element array of nested 2 element arrays. Each nested array has either a character or another array as its elements.
	 * Each nested array also has the sum of the frequencies of its elements as a property on it, called freq
	 * The top level array has an object with each character as its keys and their frequencies as its values in a property called chars
	 *
	 * @param str				The string
	 *
	 * @return					The Huffman Tree
	 */
	function getTree(str) {
		let chars = Object.create(null);

		// Iterate through each character and record the number of times it appears in the chars object
		for (var i = 0; i < str.length; i++) {
			let char = str[i];
			if (chars[char]) {
				chars[char]++;
			} else {
				chars[char] = 1;
			}
		}

		// Sort each character in the string by its frequency
		var keys = Object.keys(chars);
		quicksort(keys, function(x) {return chars[x]});
		
		/**
		 * Get the frequency of a node
		 * If the node is a character, just return its frequency, otherwise, return the freq property
		 *
		 * @param node			The node
		 *
		 * @return				The frequency
		 */
		function getFreq(node) {
			if (typeof node === "string") {
				return chars[node];
			} else {
				return node.freq;
			}
		}
		
		/**
		 * Group elements in an array into subgroups
		 */
		function group(A) {
			let subgroup = A.splice(0, 2);
			subgroup.freq = getFreq(subgroup[0]) + getFreq(subgroup[1]);
			
			let i = 0;
			while (i < A.length && getFreq(A[i]) < subgroup.freq) {
				i++;
			}
			
			A.splice(i, 0, subgroup);
		}
		
		// Group up all elements of the keys array
		while (keys.length > 2) {
			group(keys);
		}
		
		keys.chars = chars;
		return keys;
	}

	/**
	 * Traverses a tree using depth first search.
	 *
	 * @param onChar			Function run when a character is reached
	 *								@param subtree		The subtree being searched
	 *								@param char			The character reached
	 *								@param index		The index of the character in the subtree
	 *								@param path			A string representing the path of the character as a series of 0s and 1s
	 * @param onBranch			Function run when a branch is reached
	 *								@param subtree		The subtree being searched
	 *								@param branch		The branch reached
	 *								@param index		The index of the character in the subtree
	 *								@param path			A string representing the path of the character as a series of 0s and 1s
	 */
	function traverseTree(tree, onChar, onBranch) {
		function rec(tree, path) {
			tree.forEach(function(branch, i) {
				let newPath = path + i.toString();
				if (typeof branch === "string") {
					if (onChar)
						onChar(tree, branch, i, newPath);
				} else {
					if (onBranch)
						onBranch(tree, branch, i, newPath);
					rec(branch, newPath);
				}
			});
		}
		rec(tree, "");
	}

	/**
	 * Converts a character to a string of 0s and 1s whose length is divisible by 8
	 *
	 * @param char				The character
	 *
	 * @return					The string of 0s and 1s
	 */
	function getCharString(char) {
		let charString = char.charCodeAt(0).toString(2);
		
		while (charString.length % 8 !== 0) {
			charString = "0" + charString;
		}
		
		return charString;
	}

	/**
	 * Expands a character whose char code is greater than 1 byte into multiple characters whose concatenated char codes are equivalent
	 *
	 * @param char				The character
	 * @return					The equivalent string
	 */
	function expandChar(char) {
		let enc = getCharString(char[0]);
		let bytes = enc.length  / 8;
		let str = "";
		for (var i = 0; i < bytes; i++) {
			str += String.fromCharCode(Number("0b" + enc.slice(i * 8, (i + 1) * 8)));
		}
		return str;
	}

	/**
	 * Collapses a string of characters into a character with a char code equal to the concatenated char codes of the characters in the string
	 *
	 * @param str				The string
	 * @return					The character
	 */
	function collapseToChar(str) {
		let enc = "";
		for (var i = 0; i < str.length; i++) {
			enc += getCharString(str[i]);
		}
		return String.fromCharCode(Number("0b" + enc));
	}

	/**
	 * Runs the function expandChar on all characters stored in the tree
	 *
	 * @param tree				The tree to expand
	 *
	 * @return					The expanded tree
	 */
	function expandTree(tree) {
		traverseTree(tree, function(tree, char, i) {
			tree[i] = expandChar(char);
		});
		return tree;
	}

	/**
	 * Runs the function collapseToChar on all strings stored in the tree
	 *
	 * @param tree				The tree to collapse
	 *
	 * @return					The collapsed tree
	 */
	function collapseTree(tree) {
		traverseTree(tree, function(tree, char, i) {
			tree[i] = collapseToChar(char);
		});
		return tree;
	}

	/**
	 * Converts a tree to a Uint8Array
	 * The tree is first expanded, then converted into a JSON string, and finally encoded into a Uint8Array
	 *
	 * @param tree				The tree to encode
	 *
	 * @return					The Uint8Array encoding the tree
	 */
	function encodeTree(tree) {
		let str = JSON.stringify(expandTree(tree));
		//console.log(str);
		let encoder = new TextEncoder();
		return encoder.encode(str);
	}

	/**
	 * Decodes a Uint8Array into a tree
	 * The Uint8Array is decoded into a JSON string, which is then parsed into an expanded tree. The tree is then collapsed
	 *
	 * @param u8arr				The Uint8Array encoding the tree
	 *
	 * @return					The tree
	 */
	function decodeTree(u8arr) {
		let utf8decoder = new TextDecoder();
		let str = utf8decoder.decode(u8arr);
		//console.log(str);
		return collapseTree(JSON.parse(str));
	}

	/**
	 * Encodes a string into an ArrayBuffer using Huffman Coding
	 * First, a Huffman Tree is generated from the string
	 * The string is then traversed, and each character's encodings are added into a Uint8Array
	 * A 4 byte header, the Uint8Array encoding of the tree, and the Uint8Array encoding of the string are combined into a final ArrayBuffer
	 *
	 * @param str				The string to encode
	 *
	 * @return					The ArrayBuffer representing the Huffman Coding of the string
	 */
	function encodeString(str) {
		// Gets the Huffman Tree for the string
		let tree = getTree(str);
		
		// Creates an object with characters as the keys and their paths as the values
		let codes = Object.create(null);
		traverseTree(tree, function(tree, char, i, path) {
			codes[char] = path;
		});
		
		// Calculates the number of bits in the message
		let bits = Object.keys(codes).reduce(function(acc, char){
			return acc + (tree.chars[char] * codes[char].length);
		}, 0);
		
		// Calculates the number of bytes in the message, to the next number divisible by 8
		let bytes = Math.ceil(bits / 8);
		let byteOff = 1;
		let bodyArr = new Uint8Array(bytes + byteOff);
		
		// Create the body array
		let bitOff = (bits % 8).toString(2);
		while (bitOff.length < 8) {
			bitOff = "0" + bitOff;
		}
		bodyArr[0] = Number("0b" + bitOff);
		
		let j = byteOff;
		let bufferStr = "";
		
		for (var i = 0; i < str.length; i++) {
			bufferStr += codes[str[i]];
			while (bufferStr.length > 8) {
				let byteStr = bufferStr.slice(0, 8);
				bufferStr = bufferStr.slice(8);
				bodyArr[j] = Number("0b" + byteStr);
				j++;
			}
		}
		if (bufferStr.length !== 0) {
			while (bufferStr.length < 8) {
				bufferStr += "0";
			}
			bodyArr[j] = Number("0b" + bufferStr);
		}
		
		// Create the tree array
		let treeArr = encodeTree(tree);
		let treeBytes = treeArr.length.toString(2);
		let headerLength = 4;
		while (treeBytes.length < headerLength * 8) {
			treeBytes = "0" + treeBytes;
		}
		
		// Create the header array
		let headerArr = new Uint8Array(headerLength);
		for (var i = 0; i < headerLength; i++) {
			headerArr[i] = Number("0b" + treeBytes.slice(i * 8, (i + 1) * 8));
		}
		
		// Merge the header, tree, and body arrays
		mergedArr = new Uint8Array(headerArr.length + treeArr.length + bodyArr.length);
		mergedArr.set(headerArr);
		mergedArr.set(treeArr, headerArr.length)
		mergedArr.set(bodyArr, headerArr.length + treeArr.length)
		return mergedArr.buffer;
	}

	/**
	 * Decodes an ArrayBuffer into a string
	 * A Uint8Array is created from the ArrayBuffer
	 * The Uint8Array's header is read, providing the length of the tree's encoding.
	 * The tree is then decoded from the Unit8Array
	 * Finally, the message is decoded using the tree and the rest of the Uint8Array
	 *
	 * @param u8arr				The Unit8Array representing a Huffman Coded string
	 *
	 * @return					The decoded string
	 */
	function decodeBuffer(arrBuff) {
		let u8arr = new Uint8Array(arrBuff);
		
		function byteToStr(byte) {
			let str = byte.toString(2);
			while (str.length < 8) {
				str = "0" + str;
			}
			return str;
		}
		
		let headerLength = 4;
		let treeBytes = "";
		
		for (var i = 0; i < headerLength; i++) {
			treeBytes += byteToStr(u8arr[i]);
		}
		treeBytes = Number("0b" + treeBytes);
		
		let arrOff = headerLength;
		let treeArr = new Uint8Array(treeBytes);
		
		for (var i = 0; i < treeBytes; i++) {
			treeArr[i] = u8arr[i + arrOff];
		}
		
		let tree = decodeTree(treeArr);
		
		arrOff = headerLength + treeBytes;
		let bitOff = u8arr[arrOff]
		arrOff++;
		
		let codes = Object.create(null);
		traverseTree(tree, function(tree, char, i, path) {
			codes[path] = char;
		});
		
		let path = "";
		let body = "";
		for (var i = arrOff; i < u8arr.length; i++) {
			let str = byteToStr(u8arr[i]);
			let end = 8;
			if (i === u8arr.length - 1) {
				end -= (8 - bitOff);
				//console.log(end);
			}
			for (var j = 0; j < end; j++) {
				path += str[j];
				if (codes[path]) {
					body += codes[path];
					path = "";
				}
			}
		}
		
		return body;
	}

	/*function downloadBlob(blob, name = "save.bin") {
		let url = window.URL.createObjectURL(blob);
		let a = document.createElement("a");
		a.href = url;
		a.download = name;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	function huffmanBlobToString(blob, cb) {
		blob.arrayBuffer().then(function(buffer) {
			cb(decodeBuffer(buffer));
		});
	}*/
	
	/**
	 * Object to hold data and functions to convert strings to huffman compressed files and vice versa
	 * Functions go from string to blob, and array buffer to string. Blob to string is asynchronous
	 *
	 * @param data		Can be a string, Blob object, ArrayBuffer object, or File object
	 */
	var HCFile = function(data) {
		let string, buffer, blob, type;
		
		if (typeof data === "string") {
			string = data;
			type = "string";
		} else if (data.constructor === ArrayBuffer) {
			buffer = data;
			type = "buffer";
		} else {
			throw new Error("The given data must be a string or an ArrayBuffer");
		}
		
		/**
		 * Returns a new HCFile with the encoded ArrayBuffer as its data. Calling download on this returned HCFile will download the encoded file
		 */
		this.compress = function() {
			if (buffer) {
				return new HCFile(buffer)
			} else {
				buffer = encodeString(string);
				return new HCFile(buffer);
			}
		}
		
		/**
		 * Returns a new HCFile with the decoded string as its data. Calling download on this returned HCFile will download the decoded text file
		 */
		this.decompress = function() {
			if (string) {
				return new HCFile(string)
			} else {
				string = decodeBuffer(buffer)
				return new HCFile(string)
			}
		}
		
		/**
		 * Returns either an uncompressed string, if the given data was a string, or a compressed string, if the given data was an ArrayBuffer
		 */
		this.toString = function() {
			if (type === "string") {
				return string;
			} else {
				return new TextDecoder().decode(buffer);
			}
		}
		
		/**
		 * Returns either an uncompressed blob, if the given data was a string, or a compressed blob, if the given data was an ArrayBuffer
		 */
		this.toBlob = function() {
			if (!blob) {
				if (type === "string") {
					blob = new Blob([string], {type: "text/plain"})
				} else {
					blob = new Blob([buffer], {type: "application/octet-stream"})
				}
			}
			return blob;
		}
		
		/**
		 * Downloads either a text file, if the given data was a string, or a compressed file if the given data was an ArrayBuffer, with the given file name
		 */
		this.download = function(filename) {
			this.toBlob();
			let url = window.URL.createObjectURL(blob);
			let a = document.createElement("a");
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
		}
	}
	
	/**
	 * Returns an HCFile object given a file. If the asText flag is set to true, the file is assumed to be text and the string read from the file is the data given to the HCFile constructor. Otherwise, the file is assumed to be a huffman compressed file and the ArrayBuffer read from the file is given to the HCFile constructor.
	 */
	HCFile.fromFile = function(file, asText = false) {
		let fileReader = new FileReader();
		if (asText) {
			fileReader.readAsText(file);
		} else {
			fileReader.readAsArrayBuffer(file);
		}
		
		return new Promise(function(resolve, reject) {
			fileReader.onload = function(e) {
				resolve(new HCFile(fileReader.result))
			}
		});
	}
	
	/**
	 * Returns an HCFile object given a blob. If the asText flag is set to true, the blob is assumed to be text and the ArrayBuffer read from the blob is decoded into a string which is given to the HCFile constructor. Otherwise, just the ArrayBuffer read from the blob is given to the HCFile constructor.
	 */
	HCFile.fromBlob = function(blob, asText = false) {
		return blob.arrayBuffer().then(function(buffer) {
			if (asText) {
				return new HCFile(new TextDecoder().decode(buffer));
			} else {
				return new HCFile(buffer);
			}
		});
	}
	
	return HCFile;
}());