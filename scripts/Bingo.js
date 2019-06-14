var Bingo = (function()
{
	var counter = 0;
	
	function incrementCounter() 
	{
		return counter++;
	}
	
	function nullify(obj)
	{
		var keys = Object.keys(obj);
		for (var i = 0; i < keys.length; i++)
			delete obj[keys[i]];
	}
	
	function Bingo() 
	{
		var instance = incrementCounter();
		
		this.getInstance = function()
		{
			return instance;
		};
//		this.toDelete = false;
		
		var tableValues = new Array(25);
		var inDOM = false;
		var tds = new Array(25);
		var inputs = new Array(25);
		
		this.addToDOM = function(paren)
		{
			if (inDOM)
				return;
				
			var table = document.createElement("table");
			table.id = this.getInstance() + ":BingoTable";
			table.className = "BingoTable";
			
			var tbody = document.createElement("tbody");
			tbody.id = this.getInstance() + ":BingoTbody";
			
			var trs = new Array(6);
			for (var i = 0; i < trs.length; i++) {
				trs[i] = document.createElement("tr");
				trs[i].id = this.getInstance() + ":" + i + ":BingoTr";
			}
			
			var ths = new Array(5);
			var str1 = "BINGO";
			for (var i = 0; i < ths.length; i++) {
				ths[i] = document.createElement("th");
				ths[i].id = this.getInstance() + ":" + i + ":BingoTh";
				ths[i].className = "BingoTable";
				ths[i].innerHTML = str1[i];
				if (i === 4) {
					var label = document.createElement("label");
					label.className = "delete";
					
					var del = document.createElement("input");
					del.type = "button";
					del.className = "deleteInput";
					del.addEventListener("click", deleteBingo);
					del.parentBingo = this;
					
					var img = document.createElement("img");
					img.src = "../images/Bingo/close.png";
					img.className = "deleteIcon";
					
					label.appendChild(img);
					label.appendChild(del);
					ths[i].appendChild(label);
				}
			}
			
			for (var i = 0; i < tds.length; i++) {
				tds[i] = document.createElement("td");
				tds[i].id = this.getInstance() + ":" + i + ":BingoTd";
				tds[i].className = "BingoTable";
				if (i === 12) {
					tds[i].className = "free";
					tds[i].innerHTML = "FREE";
				}
			}
			
			for (var i = 0; i < inputs.length; i++) {
				inputs[i] = document.createElement("input");
				inputs[i].id = this.getInstance() + ":" + i + ":BingoInput";
				inputs[i].type = "text";
				inputs[i].className = "BingoTable";
				inputs[i].addEventListener("input", editInput);
				if (i === 11)
					i++;
			}
			
			//var br = document.createElement("br");
			
			paren.appendChild(table);
			table.appendChild(tbody);
			
			for (var i = 0; i < trs.length; i++) {
				tbody.appendChild(trs[i]);
				
				if (i === 0) {
					for (var j = 0; j < ths.length; j++)
						trs[i].appendChild(ths[j]);
				} else {
					for (var j = 0; j < ths.length; j++) {
						var k = (i - 1) * 5 + j;
						
						trs[i].appendChild(tds[k]);
						
						if (k !== 12) {
							tds[k].appendChild(inputs[k]);
						}
					}
				}
			}
			
			//paren.appendChild(br);
			
			inDOM = true;
		}
		
		this.remove = function()
		{
			nullify(this);
		}
		
		function deleteBingo()
		{
			var that = this.parentBingo;
			swal({
				title: 'Warning!',
				text: 'Are you sure you want to delete this bingo? This cannot be undone!',
				icon: 'warning',
				buttons: true,
				dangerMode: true
			}).then(function(value) {
				if (!value)
					return;
				var bingoTable = document.getElementById(that.getInstance() + ":BingoTable");
				bingoTable.style.opacity = "0";
				setTimeout(function(){bingoTable.parentNode.removeChild(bingoTable)}, 500);
				that.remove();
			})
		}
		
		function getDataFromDOM()
		{
			if (!inDOM)
				return;
				
			for (var i = 0; i < tableValues.length; i++) {
				tableValues[i] = inputs[i].value;
				
				if (i === 11)
					i++;
			}
		}
		
		function getStateMap()
		{
			var stateMap = [[], [], [], [], []];
			for (var i = 0; i < tds.length; i++) {
				stateMap[i % 5][Math.floor(i / 5)] = tds[i].style.backgroundColor === "rgb(255, 255, 255)" ? 0b0 : 0b1;
				
				if (i === 11) {
					i++;
					stateMap[2][2] = 0b1;
				}
			}
			return stateMap;
		}
		
		function checkPattern(pattern, stateMap)
		{		
			var result = {bingo: false, oneDifference: false};
			var differences;
			
			//console.log(stateMap);
			
			function getDifferences(pattern, stateMap, x, y) {
				var differences = 0;
				
				for (var i = 0; i < pattern.width; i++) {
					for (var j = 0; j < pattern.height; j++) {
						if (x + i < 5 && y + j < 5) {
							if (!stateMap[x + i][y + j] && pattern.stateMap[i][j])
								differences++;
						}
					}
				}
				
				return differences;
			}
			
			for (var i = 0; i < 6 - pattern.width; i++) {
				for (var j = 0; j < 6 - pattern.height; j++) {
					differences = getDifferences(pattern, stateMap, i, j);
					
					if (differences === 0)
						result.bingo = true;
					else if (differences === 1)
						result.oneDifference = true;
				}
			}
			
			return result;
		}
		
		this.checkNumber = function(str)
		{
			if (inDOM)
				getDataFromDOM();
			
			var str2 = "BINGO";
			var match;
			
			for (var i = 0; i < 5; i++) {
				var j = str2.indexOf(str[0]) + i * 5;
				
				if (tableValues[j] === str.slice(1, 3))
					match = j;
				
				if (str[0] === "N" && i === 1)
					i++;
			}
				
			return match;
		}
		
		this.clearHighlights = function()
		{
			for (var i = 0; i < tds.length; i++) {
				tds[i].style.backgroundColor = "#ffffff";
				inputs[i].style.backgroundColor = "#ffffff";
				
				if (i === 11)
					i++;
			}
		}
	
		this.highlightNumber = function(index, last)
		{
			if (index === undefined)
				return;
			if (last) {
				tds[index].style.backgroundColor = "#f5fd5e";
				inputs[index].style.backgroundColor = "#f5fd5e";
			} else {
				tds[index].style.backgroundColor = "#6afb87";
				inputs[index].style.backgroundColor = "#6afb87";
			}
		}
	
		this.checkForBingo = function(pattern)
		{
			var stateMap = getStateMap();
			
			result = checkPattern(pattern, stateMap);
			return result;
		}
	}
	
	return Bingo;
})();

function editInput()
{
	var newValue = "";
	var code;
	
	for (var i = 0; i < this.value.length; i++) {
		code = this.value.charCodeAt(i);
		if (code >= 48 && code <= 57)
			newValue += this.value[i];
	}
	
	code = this.value.charCodeAt(0);
	if (code === 55) {
		code = this.value.charCodeAt(1);
		if (code > 53)
			newValue = newValue.slice(0, 1) + newValue.slice(2);
	} else if (code > 55)
		newValue = newValue.slice(0, 1);
	
	this.value = newValue.slice(0, 2);
}

if (!Array.prototype.last) 
{
	Array.prototype.last = function() {
		return this[this.length - 1];
	}
}