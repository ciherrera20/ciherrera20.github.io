function getTree(message) {
	let characters = Object.create(null);
	let tree = [];
	let node = function(char) {
		this.leaf = true;
		this.children = [];
		this.parent = null;
		this.frequency = 1;
		this.char = char;
		this.newRep = "";
    }
	node.prototype = Object.create(null);

	let insertNode = function(node) {
		for (var i = 0; i < tree.length; i++) {
			if (tree[i].frequency <= node.frequency) {
				tree.splice(i, 0, node);
				return;
			}
		}
		tree.push(node);
	}
	
	let joinLast = function() {
		let last0 = tree[tree.length - 1];
		let last1 = tree[tree.length - 2];
		
		tree.splice(tree.length - 2, 2);
		
		function addPathInfo(node, pathInfo) {
			if (node.leaf) {
				node.newRep = pathInfo + node.newRep;
			} else {
				node.children.forEach(function(child) {
					addPathInfo(child, pathInfo);
				});
			}
		}
		
		addPathInfo(last0, "1");
		addPathInfo(last1, "0");
		
		let newNode = new node();
		
		newNode.children[0] = last1;
		newNode.children[1] = last0;
		
		newNode.leaf = false;
		newNode.frequency = last0.frequency + last1.frequency;
		
		last0.parent = newNode;
		
		last1.parent = newNode;
		
		insertNode(newNode);
	}
	
	for (var i = 0; i < message.length; i++) {
		if (characters[message[i]] === undefined) {
			characters[message[i]] = new node(message[i]);
        } else {
			characters[message[i]].frequency++;
        }
    }
	
	Object.keys(characters).forEach(function(key) {
		insertNode(characters[key]);
	});
	
	while (tree.length > 1) {
		joinLast();
	}
	
	return tree[0];
}

function compressWithTree(tree, message/*, subs*/) {
	let newMessage = "";
	
	//if (subs === undefined) {
		let subs = Object.create(null);
		function traverseTree(node) {
			if (node.leaf) {
				subs[node.char] = node.newRep;
				return;
			}
			
			node.children.forEach(function(child) {
				traverseTree(child);
			});
		}
		traverseTree(tree);
	//}
	
	for (var i = 0; i < message.length; i++) {
		newMessage += subs[message[i]];
	}
	
	return newMessage;
}

function encodeTree(tree) {
	function getCharString(char) {
		let charString = char.charCodeAt(0).toString(2);
		
		while (charString.length % 8 !== 0) {
			charString = "0" + charString;
		}
		
		return charString;
		//return char;
	}
	
	let string = "";
	function traverseTree(node) {
		string += getCharString("{");
		node.children.forEach(function(child) {
			if (child.leaf) {
				string += getCharString("{");
				if (child.char === "{" || child.char === "}" || child.char === "\\") {
					string += getCharString("\\");
				}
				string += getCharString(child.char);
				string += getCharString("}");
			} else {
				traverseTree(child);
			}
			
		});
		string += getCharString("}");
	}
	traverseTree(tree);
	return string;
}

function decompressWithTree(tree, message) {
	let currentNode = tree;
	let newMessage = "";
	for (var i = 0; i < message.length; i++) {
		currentNode = currentNode.children[message[i]];
		if (currentNode.leaf) {
			newMessage += currentNode.char;
			currentNode = tree;
		}
	}
	return newMessage;
}

function decodeTree(rawCharData) {
	let string = "";
	let tempCharData = "";
	for (var i = 0; i < rawCharData.length; i += 8) {
		let char = String.fromCharCode(Number("0b" + rawCharData.slice(i, i + 8)));
		
		if (char === "\\") {
			let nextChar = String.fromCharCode(Number("0b" + rawCharData.slice(i + 8, i + 16)));
			string += char;
			string += nextChar;
			i += 8;
			tempCharData = "";
		} else if (char !== "}" && char !== "{") {
			let nextChar = String.fromCharCode(Number("0b" + rawCharData.slice(i + 8, i + 16)));
			tempCharData += rawCharData.slice(i, i + 8);
			if (nextChar === "}") {
				string += String.fromCharCode(Number("0b" + tempCharData));
				tempCharData = "";
			}
		} else {
			string += char;
		}
	}
	
	function extractChildren(string) {
		let children = string.slice(1, string.length - 1);
		let child1, child2;
		let bracketCount = 0;
		let separationIndex;
		let skipCount = false;
		
		for (var i = 0; i < children.length; i++) {
			if (!skipCount) {
				if (children[i] === "{") {
					bracketCount++;
				} else if (children[i] === "}") {
					bracketCount--;
				} else if (children[i] === "\\") {
					skipCount = true;
				}
			} else {
				skipCount = false;
			}
			
			if (bracketCount === 0) {
				separationIndex = i + 1;
				break;
			}
		}
		
		child1 = children.slice(0, separationIndex);
		child2 = children.slice(separationIndex, children.length);
		
		function unwrap(child) {
			if (child.length > 4)
				return child;
			
			return child.slice(1, child.length - 1);
		}
		
		return [unwrap(child1), unwrap(child2)];
	}
	
	let node = function(char) {
		this.leaf = true;
		this.children = [];
		this.parent = null;
		this.char = char;
		this.newRep = "";
    }
	node.prototype = Object.create(null);
	
	let tree = new node();
	
	function parseNode(string, parent) {
		let children = extractChildren(string);
		children.forEach(function(child, i) {
			let childNode = new node();
			childNode.newRep = parent.newRep + i.toString();
			if (child[0] !== "{") {
				if (child[0] === "\\")
					childNode.char = child[1];
				else
					childNode.char = child;
			} else {
				childNode.leaf = false;
				parseNode(child, childNode);
			}
			parent.children.push(childNode);
		});
	}
	parseNode(string, tree);
	
	return tree;
}

function compressToString(message) {
	let tree = getTree(message);
	let encTree = encodeTree(tree);
	let newMessage = compressWithTree(tree, message);
	
	function padTo(string, length) {
		while (string.length < length) {
			string = "0" + string;
		}
		return string;
	}
	
	let treeLengthData = padTo((encTree.length / 8).toString(2), 16);
	let msgLengthData = padTo(newMessage.length.toString(2), 32);
	
	return treeLengthData + encTree + msgLengthData + newMessage;
}

function decompressFromString(message) {
	let treeLengthData = Number("0b" + message.slice(0, 16)) * 8;
	let encTree = message.slice(16, 16 + treeLengthData);
	let msgLengthData = Number("0b" + message.slice(16 + treeLengthData, 48 + treeLengthData));
	let cmMsg = message.slice(48 + treeLengthData, 48 + treeLengthData + msgLengthData);
	
	let tree = decodeTree(encTree);
	
	return decompressWithTree(tree, cmMsg);
}

function compressToBitArray(message) {
	let cmMsg = compressToString(message);
	let bitArray = new BitArray(cmMsg.length);
	
	bitArray.splice(0, cmMsg.length, cmMsg);
	
	return bitArray;
}

function decompressFromBitArray(bitArray) {
	return decompressFromString(bitArray.splice(0, bitArray.length));
}

function downloadBitArray(bitArray, name = "save.bin") {
	let blob = new Blob([bitArray.getUint8Array().buffer], {type: "application/octet-stream"});
	let url = window.URL.createObjectURL(blob);
	let a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	window.URL.revokeObjectURL(url);
}

function BitArray(length) {
	if (!(this instanceof BitArray))
		return new BitArray(length);
		
	var self = this, paddedLength, bitLength, uint8Array;
	
	if (length instanceof Uint8Array) {
		paddedLength = length.length * 8;
		bitLength = paddedLength;
		uint8Array = length;
	} else if (length instanceof DataView) {
		paddedLength = length.byteLength * 8;
		bitLength = paddedLength;
		uint8Array = new Uint8Array(length.byteLength);
		for (var i = 0; i < length.byteLength; i++) {
			uint8Array[i] = length.getUint8(i);
		}
	} else {
		paddedLength = length + length % 8;
		bitLength = length;
		uint8Array = new Uint8Array(paddedLength / 8);
	}
	
	var getterArray = [0b10000000, 0b01000000, 0b00100000, 0b00010000, 0b00001000, 0b00000100, 0b00000010, 0b00000001];

	this.getBit = function(index) {
		if (typeof index !== "number")
			throw new TypeError("First argument of BitArray.getBit must by a number");
		if (index > length - 1)
			throw new RangeError("Index is outside the bounds of the BitArray");
		var uint8Index = Math.floor(index / 8);
		var bitIndex = index - (uint8Index * 8);
		var uint8 = uint8Array[uint8Index];
		var getter = getterArray[bitIndex];
		return Number((uint8 & getter).toString(2)[0]);
	}

	this.setBit = function(index, value) {
		if (typeof index !== "number")
			throw new TypeError("First argument of BitArray.setBit must by a number");
		if (index > length - 1)
			throw new RangeError("Index is outside the bounds of the BitArray");
		if (value !== 0 && value !== 1)
			throw new Error("Second argument of BitArray.setBit must be equal to either 0 or 1");
		var uint8Index = Math.floor(index / 8);
		var bitIndex = index - (uint8Index * 8);
		var uint8 = uint8Array[uint8Index];
		var getter = getterArray[bitIndex];
		if (value === 0) {
			uint8 ^= 0b11111111;
			uint8Array[uint8Index] = (uint8 | getter) ^ 0b11111111;
			return;
		}
		uint8Array[uint8Index] = uint8 | getter;
	}

	this.splice = function(start, replaceCount, newValue) {
		replaceCount = !replaceCount ? length - start : replaceCount;
		newValue = !newValue ? "" : newValue;
		
		if (typeof start !== "number")
			throw new TypeError("First argument of BitArray.splice must by a number");
		if (typeof replaceCount !== "number")
			throw new TypeError("Second argument of BitArray.splice must by a number");
		if (typeof newValue !== "string")
			throw new TypeError("Third argument of BitArray.splice must by a string");
		if (start > length - 1 || start + replaceCount > length)
			throw new RangeError("Range of bits to replace is outside the bounds of the BitArray");
		
		var str = "";
		for (var i = 0; i < replaceCount; i++) {
			var val;
			if (newValue[i] === "1")
				self.setBit(start + i, 1);
			else if (newValue[i] === "0")
				self.setBit(start + i, 0);
			str += self.getBit(start + i);
		}
		return str;
	}
	
	this.getUint8Array = function() {
		return uint8Array;
	}
	
	Object.defineProperty(this, "length", {get(){return bitLength}});
}
