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
		paddedLength = length + (8 - length % 8);
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