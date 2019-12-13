// Variable for the backpack
var backpack;

// Object to hold information about the current component being displayed and current componentBlock or output being manipulated
var current = {
	component: undefined,
	workspace: undefined,
	componentBlock: undefined,
	inputNode: undefined,
	outputNode: undefined,
	overTrash: false,
}
current.resetCache = function() {
	let cache = Object.create(null);
	cache.whitelist = Object.create(null);
	cache.blacklist = Object.create(null);
	
	current.cache = cache;
}
current.resetCache();
current.setComponent = function(component) {
	if (component === current.component)
		return;
	
	current.resetCache();
	
	// Hides the soon-to-be-replaced current component
	if (current.component)
		current.component.hide();

	if (!component)
		return;

	// Sets the current component to the provided component
	current.component = component;

	// Shows the current component
	component.show();
}
current.setWorkspace = function(workspace) {
	current.workspace = workspace;
}
current.setComponentBlock = function(componentBlock) {
	current.componentBlock = componentBlock;
}
current.setInputNode = function(inputNode) {
	current.inputNode = inputNode;
}
current.setOutputNode = function(outputNode) {
	current.outputNode = outputNode;
}

// Object to hold functions that generate objects that contain HTML and functions to manipulate the HTML
var HTML = Object.create(null);
HTML.addButton = function() {
	let addDiv = document.createElement("div");
	let vertical = document.createElement("div");
	let horizontal = document.createElement("div");
				
	addDiv.className = "add";
	vertical.className = "vertical";
	horizontal.className = "horizontal";
				
	addDiv.appendChild(vertical);
	addDiv.appendChild(horizontal);
				
	return addDiv;
}
HTML.deleteButton = function() {
	let deleteDiv = document.createElement("div");
	let pos = document.createElement("div");
	let neg = document.createElement("div");

	deleteDiv.className = "del";
	pos.className = "pos";
	neg.className = "neg";

	deleteDiv.appendChild(pos);
	deleteDiv.appendChild(neg);

	return deleteDiv;
}
HTML.renameButton = function() {
	let rename = document.createElement("div");
	let renIcon = document.createElement("div");
				
	renIcon.innerHTML = "R";
				
	rename.className = "rename";
	renIcon.className = "renIcon";
				
	rename.appendChild(renIcon);
				
	return rename;
}
// Callbacks on tab are: onAddButtonClick, onDeleteButtonClick, onRenameButtonClick, and onNameClick
// No elements that can be added to
HTML.tab = function(name, isNand) {
	let componentTab = document.createElement("div"); // Div to hold everything
	let rowFlex = document.createElement("div"); // Row flex to handle positioning
	let compName = document.createElement("span"); // Span to hold the component's name
	let buttonDiv = document.createElement("div"); // Div to hold buttons
	let add = HTML.addButton(); // Add button
	let del = HTML.deleteButton(); // Del button
	let rename = HTML.renameButton(); // Rename button
				
	// Sets class names and other attributes
	componentTab.className = "componentTab";
	rowFlex.className = "rowFlex";
	buttonDiv.className = "rowFlex";
	compName.className = "compName";
	if (isNand)
		compName.id = "nandName";
	compName.innerHTML = name;
	if (isNand)
		buttonDiv.setAttribute("id", "nandButtonDiv");
				
	// Appends children as necessary
	buttonDiv.appendChild(add);
	if (!isNand) {
		buttonDiv.appendChild(rename);
		buttonDiv.appendChild(del);
	}
	rowFlex.appendChild(compName);
	rowFlex.appendChild(buttonDiv);
	componentTab.appendChild(rowFlex);

	componentTab.onAddButtonClick = function(){};
	componentTab.onDeleteButtonClick = function(){};
	componentTab.onRenameButtonClick = function(){};
	componentTab.onNameClick = function(){};

	add.onclick = function(e){componentTab.onAddButtonClick(e)};
	del.onclick = function(e){componentTab.onDeleteButtonClick(e)};
	rename.onclick = function(e){componentTab.onRenameButtonClick(e)};
	if (!isNand)
		compName.onclick = function(e){componentTab.onNameClick(e)};
	
	componentTab.rename = function(newName) {
		compName.innerHTML = newName;
	}

	return componentTab;
}
HTML.maxTextWidth = 13;
HTML.svgCircle = function() {
	let node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	node.setAttribute("class", "node");
				
	let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("cx", "9");
	circle.setAttribute("cy", "9");
	circle.setAttribute("r", "8");
	circle.setAttribute("stroke", "black");
	circle.setAttribute("fill", "white");
	circle.setAttribute("stroke-width", "2");
	
	let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", "50%");
	text.setAttribute("y", "50%");
	text.setAttribute("dy", ".3em");
	text.setAttribute("text-anchor", "middle");
	text.setAttribute("font-size", "11px");
	text.setAttribute("textLength", "13");
	text.setAttribute("lengthAdjust", "spacing");
				
	node.appendChild(circle);
	node.appendChild(text);
				
	node.setCostume = function(on) {
		if (on)
			circle.setAttribute("stroke", "blue");
		else
			circle.setAttribute("stroke", "black");
	}
	
	node.setText = function(str) {
		text.innerHTML = str;
		//console.log(str, text.getComputedTextLength());
		let len = text.getComputedTextLength();
		if (len > HTML.maxTextWidth) {
			len = HTML.maxTextWidth;
		}
		text.setAttribute("textLength", `${len}`);
	}
				
	return node;
}
HTML.svgTriangle = function() {
	let node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	node.setAttribute("class", "triangle");
					
	let triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	triangle.setAttribute("points", "2,10 14,10 8,2");
	triangle.setAttribute("stroke", "black");
	triangle.setAttribute("fill", "white");
	triangle.setAttribute("stroke-width", "2");
					
	node.appendChild(triangle);
	
	node.setCostume = function(on) {
		if (on)
			triangle.setAttribute("stroke", "blue");
		else
			triangle.setAttribute("stroke", "black");
	}
				
	return node;
}
HTML.svgPath = function() {
	let connectionPath = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

	connectionPath.setAttribute("class", "connectionPath");
	connectionPath.style.pointerEvents = "none";
	path.setAttribute("stroke", "black");
	path.setAttribute("stroke-width", "2");
	
	connectionPath.appendChild(path);
	
	connectionPath.update = function(topX, topY, bottomX, bottomY) {
		//console.log(topX, topY, bottomX, bottomY);
		let width = topX - bottomX;
		let height = topY - bottomY;
		let cWidth = Math.abs(width) + 4;
		let cHeight = Math.abs(height) + 4;
		let trueTopX = topX < bottomX ? topX : bottomX;
		let trueTopY = topY < bottomY ? topY : bottomY;
		trueTopX -= 2;
		trueTopY -= 2;

		connectionPath.style.left = (trueTopX + connectionPath.parentNode.offsetLeft) + "px";
		connectionPath.style.top = (trueTopY + connectionPath.parentNode.offsetTop) + "px";
		//connectionPath.setAttribute("left", (trueTopX + connectionPath.parentNode.offsetLeft) + "px");
		//connectionPath.setAttribute("top", (trueTopY + connectionPath.parentNode.offsetTop) + "px");
		connectionPath.setAttribute("width", cWidth.toString() + "px");
		connectionPath.setAttribute("height", cHeight.toString() + "px");

		if (width > 0 && height > 0) {
			path.setAttribute("d", "M2 2 L" + (width + 2) + " " + (height + 2));
		} else if (width < 0 && height > 0) {
			path.setAttribute("d", "M" + (-width + 2) + " 2 L2 " + (height + 2));
		} else if (width > 0 && height < 0) {
			path.setAttribute("d", "M2 " + (-height + 2) + " L" + (width + 2) + " 2");
		} else {
			path.setAttribute("d", "M" + (-width + 2) + " " + (-height + 2) + " L2 2");
		}
	}
	
	connectionPath.setCostume = function(on) {
		if (on)
			path.setAttribute("stroke", "blue");
		else
			path.setAttribute("stroke", "black");
	}
	
	return connectionPath;
}
// Callbacks on workspaceInput are: onCheckboxChange, onMouseEnter, onMouseLeave, onCircleClick
// No elements that can be added to
HTML.workspaceInput = function() {
	let input = document.createElement("div");
	let columnFlex = document.createElement("div");
	let node = HTML.svgCircle();
	let label = document.createElement("div");
	let checkbox = document.createElement("input");
				
	input.className = "workspaceInput";
	columnFlex.className = "columnFlex";
	label.className = "label";
	label.innerHTML = "0";
	checkbox.type = "checkbox";
				
	columnFlex.appendChild(node);
	columnFlex.appendChild(label);
	columnFlex.appendChild(checkbox);
	input.appendChild(columnFlex);

	// Callback for checkbox change events
	input.onCheckboxChanged = function(){};
	input.onMouseEnter = function(){};
	input.onMouseLeave = function(){};
	input.onCircleClick = function(){};
	
	checkbox.addEventListener("change", function(e){input.onCheckboxChange(e)});
	node.addEventListener("mouseenter", function(e){input.onMouseEnter(e)});
	node.addEventListener("mouseleave", function(e){input.onMouseLeave(e)});
	node.addEventListener("mousedown", function(e){input.onCircleClick(e)});

	input.setCostume = function(on) {
		node.setCostume(on);
	}
	
	input.setText = function(str){node.setText(str)};

	input.getNodeRect = function(){return node.getBoundingClientRect()};

	return input;
}
// Callbacks on workspaceOutput are: onTriangleClick
// No elements that can be added to
HTML.workspaceOutput = function() {
	let output = document.createElement("div");
	let columnFlex = document.createElement("div");
	let node = HTML.svgCircle();
	let triangle = HTML.svgTriangle();
	let label = document.createElement("div");
				
	output.className = "workspaceOutput";
	columnFlex.className = "columnFlex";
	label.className = "label";
	label.innerHTML = "0";
				
	columnFlex.appendChild(label);
	columnFlex.appendChild(node);
	columnFlex.appendChild(triangle);
	output.appendChild(columnFlex);

	output.onTriangleClick = function(){};

	triangle.addEventListener("mousedown", function(e){output.onTriangleClick(e)});

	output.setCostume = function(on) {
		node.setCostume(on);
		triangle.setCostume(on);
		label.innerHTML = Number(on);
	}

	output.setText = function(str){node.setText(str)};
	
	output.getNodeRect = function(){return triangle.getBoundingClientRect()};

	return output;
}
// Callbacks on workspace are: onAddInputClick and onAddOutputClick
// Elements that can be added to are: workspaceWrapper, outputsRowFlex, and inputsRowFlex
HTML.workspace = function(name) {
	let workspaceWrapper = document.createElement("div");
	let columnFlex = document.createElement("div");
	let workspaceOutputs = document.createElement("div");
	let outputsRowFlex = document.createElement("div");
	let addOutput = HTML.addButton();
	let workspace = document.createElement("div");
	let workspaceName = document.createElement("span");
	let workspaceInputs = document.createElement("div");
	let inputsRowFlex = document.createElement("div");
	let addInput = HTML.addButton();

	workspaceWrapper.className = "workspaceWrapper";
	columnFlex.className = "columnFlex";
	workspaceOutputs.className = "workspaceOutputRow";
	outputsRowFlex.className = "rowFlex";
	workspace.className = "workspace";
	workspaceName.innerHTML = name;
	workspaceInputs.className = "workspaceInputRow";
	inputsRowFlex.className = "rowFlex";
				
	outputsRowFlex.appendChild(addOutput);
	workspaceOutputs.appendChild(outputsRowFlex);
	workspace.appendChild(workspaceName);
	inputsRowFlex.appendChild(addInput);
	workspaceInputs.appendChild(inputsRowFlex);
	columnFlex.appendChild(workspaceOutputs);
	columnFlex.appendChild(workspace);
	columnFlex.appendChild(workspaceInputs);
	workspaceWrapper.appendChild(columnFlex);
	document.body.appendChild(workspaceWrapper);

	workspaceWrapper.onAddInputClick = function(){};
	workspaceWrapper.onAddOutputClick = function(){};

	addInput.onclick = function(e){workspaceWrapper.onAddInputClick(e)};
	addOutput.onclick = function(e){workspaceWrapper.onAddOutputClick(e)};


	workspaceWrapper.addPath = function(path) {
		workspace.appendChild(path);
	}

	workspaceWrapper.addComponentBlock = function(componentBlock) {
		workspace.appendChild(componentBlock);
	}

	workspaceWrapper.addOutput = function(output) {
		outputsRowFlex.insertBefore(output, addOutput);
	}

	workspaceWrapper.addInput = function(input) {
		inputsRowFlex.insertBefore(input, addInput);
	}

	workspaceWrapper.rename = function(newName) {
		workspaceName.innerHTML = newName;
	}
	
	workspaceWrapper.transformMousePos = function(pos) {
		let newPos = Object.create(null);
		let rect = workspace.getBoundingClientRect();
		
		newPos.x = pos.x - rect.left;
		newPos.y = pos.y - rect.top;
		
		return newPos;
	}
	
	workspaceWrapper.getWorkspaceRect = function(){return workspace.getBoundingClientRect()};

	return workspaceWrapper;
}
// Callbacks on blockOutput are: onMouseEnter, onMouseLeave
// No elements that can be added to
HTML.blockOutput = function() {
	let output = HTML.svgCircle();

	output.onMouseEnter = function(){};
	output.onMouseLeave = function(){};

	output.addEventListener("mouseenter", function(e){output.onMouseEnter(e)});
	output.addEventListener("mouseleave", function(e){output.onMouseLeave(e)});
	
	output.getNodeRect = function(){return output.getBoundingClientRect()};

	return output;
}
// Callbacks on blockInput are: onTriangleClick
// No elements that can be added to
HTML.blockInput = function() {
	let input = document.createElement("div");
	let inputColumnFlex = document.createElement("div");
	let inputNode = HTML.svgCircle();
	let inputTriangle = HTML.svgTriangle();

	input.className = "componentInput";
	inputColumnFlex.className = "columnFlex";
	
	inputColumnFlex.appendChild(inputNode);
	inputColumnFlex.appendChild(inputTriangle);
	input.appendChild(inputColumnFlex);
	
	input.onTriangleClick = function(){};

	inputTriangle.addEventListener("mousedown", function(e){input.onTriangleClick(e)});

	input.setCostume = function(on) {
		inputNode.setCostume(on);
		inputTriangle.setCostume(on);
	}

	input.setText = function(str){inputNode.setText(str)};
	
	input.getNodeRect = function(){return inputTriangle.getBoundingClientRect()};

	return input;
}
// Callbacks on componentBlock are: onMouseDown, onInfoButtonClick
// Elements that can be added to are: outputs, and inputs
HTML.componentBlock = function(name) {
	// Creates outer div
	let componentBlock = document.createElement("div");
	let componentInfo = document.createElement("span");
	
	// Inner flex column div to hold each part of the component block
	let spanSandwich = document.createElement("div");
				
	// Holds output nodes in a flex row div
	let outputsWrapper = document.createElement("div");
	let outputs = document.createElement("div");
				
	// Contains the name of the component block
	let span = document.createElement("span");

	// Holds input nodes in a flex row div
	let inputsWrapper = document.createElement("div");
	let inputs = document.createElement("div");
				
	// Sets class names and other attributes
	componentBlock.className = "component";
	componentInfo.className = "componentInfo"
	componentInfo.innerHTML = "i";
	componentInfo.style.display = "none";
	spanSandwich.className = "columnFlex";
	outputsWrapper.className = "componentOutputRow";
	outputs.className = "rowFlex";
	span.className = "componentLabel";
	span.innerHTML = name;
	inputsWrapper.className = "componentInputRow";
	inputs.className = "rowFlex";

	// Creates structure of component block
	outputsWrapper.appendChild(outputs);
	inputsWrapper.appendChild(inputs);
	spanSandwich.appendChild(outputsWrapper);
	spanSandwich.appendChild(span);
	spanSandwich.appendChild(inputsWrapper);
	componentBlock.appendChild(componentInfo);
	componentBlock.appendChild(spanSandwich);

	componentBlock.onMouseDown = function(){};
	componentBlock.onInfoButtonClick = function(){};

	componentBlock.addEventListener("mousedown", function(e){componentBlock.onMouseDown(e)});
	componentInfo.addEventListener("mousedown", function(e){componentBlock.onInfoButtonClick(e)});

	componentBlock.addOutput = function(output) {
		outputs.appendChild(output);
	}

	componentBlock.addInput = function(input) {
		inputs.appendChild(input);
	}

	componentBlock.spanOffsetHeight = function() {
		return spanSandwich.offsetHeight;
	}

	componentBlock.rename = function(newName) {
		span.innerHTML = newName;
	}
	
	componentBlock.showInfoButton = function() {
		componentInfo.style.display = "block";
	}
	
	componentBlock.hideInfoButton = function() {
		componentInfo.style.display = "none";
	}

	return componentBlock;
}

{
	var GetEventHandler = function(obj, eventTypes) {
		let events = Object.create(null);
		events.triggerEvent = function(eventName, e) {
			events[eventName].forEach(function(callback) {
				callback(e);
			});
		}
		
		eventTypes.forEach(function(type) {
			events[type] = [];
		});
		
		obj.addEventListener = function(eventName, callback) {
			if (events[eventName]) {
				events[eventName].push(callback);
			}
		}
		obj.removeEventListener = function(eventName, callback) {
			if (events[eventName]) {
				let callbacks = events[eventName];
				callbacks.splice(callbacks.indexOf(callback), 1);
			}
		}
		
		return events;
	}
}

// This code is meant to mediate the interactions between the Logic Gate code and the html
// It should handle calling all the functions necessary to create the internal structure of custom components
// such as setInputComp, sendInputTo, and takeOutputFrom
{
	let components = []; // List of all components
	let uid = 0;

	var nameInUse = function(name) {
		return components.find(function(component) {
			return name === component.name;
		});
	}

	// A custom component
	var Component = function(name, isNand = false) {
		if (isNand)
			name = "nand";
		components.push(this);

		let that = this;
		let instUid = uid++;

		let instances = []; // List of instances of this component
		let dependencies = Object.create(null); // Keeps track of components that this component uses. It must not include itself
		dependencies[instUid] = this;
		let depCount = Object.create(null);
		depCount[instUid] = 1;
		
		let tab = new Tab(name, isNand, this);
		let workspace;
		let logicGate; // Constructor for logic gate objects that handle the actual computations
		let eventHandler = GetEventHandler(this, ["onShow", "onHide"]);
		
		if (isNand) {
			logicGate = nand;
		} else {
			logicGate = customComponent(0, 0);
			workspace = new Workspace(name, logicGate, this);
		}

		Object.defineProperty(this, "uid", {get: function(){return instUid}});
		Object.defineProperty(this, "name", {get: function(){return name}});
		Object.defineProperty(this, "workspace", {get: function(){return workspace}});
		Object.defineProperty(this, "dependencies", {get: function(){return dependencies}});
		
		// Adds the dependencies of the component provided to this component, setting the dependency to 1 if it has not yet been added or incrementing the dependency if it has
		/*function addDependencies(component) {
			Object.keys(component.dependencies).forEach(function(newDep) {
				if (!dependencies[newDep])
					dependencies[newDep] = 1;
				else
					dependencies[newDep]++;
			});
		}*/
		
		this.addDependency = function(component) {
			let key = component.uid;
			if (dependencies[key]) {
				depCount[key]++;
			} else {
				dependencies[key] = component;
				depCount[key] = 1;
			}
		}
		
		this.findDependency = function(component) {
			if (dependencies[component.uid])
				return true;
			
			let that = this;
			let keys = Object.keys(dependencies);
			
			for (var i = 0; i < keys.length; i++) {
				if (dependencies[keys[i]] === that)
					continue;
				if (dependencies[keys[i]].findDependency(component)) {
					return true;
				}
			}
			
			return false;
		}
		
		this.updateInstances = function() {
			instances.forEach(function(instance) {
				instance.updateInternalComponent();
				instance.updateIO();
			});
		}
		
		/*this.updateInputName = function(id, name) {
			instances.forEach(function(instance) {
				instance.updateInputName(id, name);
			});
		}*/

		this.hide = function() {
			current.setWorkspace(undefined);
			workspace.hide();
			this.updateInstances();
			eventHandler.triggerEvent("onHide");
		}

		this.show = function() {
			current.setWorkspace(workspace);
			workspace.show();
			eventHandler.triggerEvent("onShow");
		}

		this.createComponentBlock = function() {
			//console.log(name, logicGate, current.component, this, workspace);
			let componentBlock;
			if (isNand) {
				componentBlock = new ComponentBlock(name, logicGate, current.component, this, ["", ""]);
			} else {
				componentBlock = new ComponentBlock(name, logicGate, current.component, this, workspace.inputNames);
			}
			instances.push(componentBlock);
			return componentBlock;
		}

		this.addComponentBlock = function(componentBlock) {
			let recursive;
			
			if (current.cache.whitelist[componentBlock.parent.uid]) {
				recursive = false;
			} else if (current.cache.blacklist[componentBlock.parent.uid]) {
				recursive = true;
			} else {
				recursive = componentBlock.parent.findDependency(this);
				if (recursive)
					current.cache.blacklist[componentBlock.parent.uid] = componentBlock.parent;
				else
					current.cache.whitelist[componentBlock.parent.uid] = componentBlock.parent;
			}
			
			if (recursive) {
				swal({
					title: "Recursion Detected",
					text: "The component you are attempting to add is defined in terms of the component you are currently working on. Such recursive definitions are not allowed",
					icon: "error"
				});
			} else {
				this.addDependency(componentBlock.parent);
				workspace.addComponentBlock(componentBlock);
			}
		}

		this.removeComponentBlock = function(componentBlock) {
			instances.splice(instances.indexOf(componentBlock), 1);
		}

		this.removeDependency = function(component) {
			let key = component.uid;
			if (depCount[key] <= 1) {
				delete depCount[key];
				delete dependencies[key];
			} else {
				depCount[key]--;
			}
		}

		this.delete = function() {
			while (instances.length > 0) {
				let affectedComponent = instances[0].residence;
				instances[0].delete();
				affectedComponent.updateInstances();
			}

			current.setWorkspace(components[components.indexOf(this) - 1]);

			components.splice(components.indexOf(this), 1);

			workspace.innerHTML.parentNode.removeChild(workspace.innerHTML);
			tab.innerHTML.parentNode.removeChild(tab.innerHTML);
		}

		this.rename = function() {
			swal("Rename component:", {
				content: "input",
				buttons: true
			})
			.then(function(newName) {
				if (newName === "" || newName === null)
					return;
					
				let usedBy = nameInUse(newName);
				if (!usedBy) {
					console.log("Renaming " + name + " to " + newName);
					tab.rename(newName);
					workspace.rename(newName);
					instances.forEach(function(instance){
						instance.rename(newName);
					});
					name = newName;
				} else {
					let gotoDef = document.createElement("u");
					gotoDef.innerHTML = "Go to definition";
					gotoDef.style.color = "blue";
					gotoDef.onclick = function() {
						current.setComponent(usedBy);
						swal.close();
					}
					
					let alert = {
						title: "Duplicate Name",
						text: "The name " + newName + " is already in use",
						icon: "warning"
					};
					
					if (newName !== "nand" && current.component !== usedBy)
						alert.content = gotoDef;
				
					swal(alert);
				}
			});
		}

		this.addOutput = function() {
			logicGate.addOutput();
		}

		this.addInput = function() {
			logicGate.addInput();
		}

		backpack.appendChild(tab.innerHTML);
		if (!isNand)
			document.body.appendChild(workspace.innerHTML);
	}

	var Tab = function(name, isNand, parent) {
		let innerHTML = HTML.tab(name, isNand);

		Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
		Object.defineProperty(this, "parent", {get(){return parent}});

		/////////////////////////////////Callbacks on HTML events/////////////////////////////////

		// Adds a component block created by the tab's parent to the current component
		innerHTML.onAddButtonClick = function() {
			if (current.component)
				current.component.addComponentBlock(parent.createComponentBlock());
		}

		// Selects the parent component as the current component
		innerHTML.onNameClick = function() {
			current.setComponent(parent);
		}

		innerHTML.onDeleteButtonClick = function() {
			swal({
				text: "Are you sure you want to delete this component? Doing so will remove all instances of it in other components",
				icon: "warning",
				buttons: true,
				dangerMode: true
			})
			.then(function(value) {
				if (value) {
					parent.delete();
				}
			});
		}

		innerHTML.onRenameButtonClick = function() {
			parent.rename();
		}

		this.rename = innerHTML.rename;
	}

	var Path = function(node, parent) {
		let innerHTML = HTML.svgPath();
		let topX = 0, topY = 0, bottomX = 0, bottomY = 0;

		Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
		Object.defineProperty(this, "node", {get(){return node}});
		Object.defineProperty(this, "parent", {get(){return parent}});

		this.updateTop = function(pos) {
			topX = pos.x;
			topY = pos.y;
			innerHTML.update(topX, topY, bottomX, bottomY);
		}

		this.updateBottom = function(pos) {
			if (!pos.x || !pos.y)
				throw new Error();
			
			bottomX = pos.x;
			bottomY = pos.y;
			innerHTML.update(topX, topY, bottomX, bottomY);
		}

		this.setCostume = function(on) {
			innerHTML.setCostume(on);
		}
	}

	var Workspace = function(name, logicGate, parent) {
		let that = this;
		let inputs = [];
		let outputs = [];
		let inputNames = [];
		let outUid = 0;
		let inUid = 0;
		let innerHTML = HTML.workspace(name);
		let eventHandler = GetEventHandler(this, ["onShow", "onHide"]);
		
		this.logicGate = logicGate;

		Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
		Object.defineProperty(this, "inputNames", {get(){return inputNames}});
		Object.defineProperty(this, "parent", {get(){return parent}});

		///////////////////////////////Internal object constructors///////////////////////////////

		// Constructor for workspace outputs
		let WorkspaceOutput = function() {
			console.log("Creating path");
			let self = this;
			let innerHTML = HTML.workspaceOutput();
			let workspace = true;
			let path = new Path(this, that);
			let uid = outUid++;
			let output = undefined;

			Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
			Object.defineProperty(this, "workspace", {get(){return workspace}});
			Object.defineProperty(this, "path", {get(){return path}});
			Object.defineProperty(this, "uid", {get(){return uid}});
			Object.defineProperty(this, "isNand", {get(){return false}});

			current.workspace.addPath(path);
			
			innerHTML.onTriangleClick = function(e) {
				current.setInputNode(self);
				self.setInput(undefined);
				path.updateBottom(self.getPosition());
			}

			this.setInput = function(newOutput) {
				if (!newOutput) {
					if (!output)
						return;
					
					if (output.workspace) {
						output.removeInputTo(this);
					} else {
						logicGate.takeOutputFrom(undefined, 0, uid);
					}
					setInternalCallbacks(setCostume, true);
					path.updateBottom(this.getPosition());
					output.removePath(path);
					setCostume(false);
					
					output = newOutput;
				} else {
					if (output)
						this.setInput(undefined);

					output = newOutput;
					
					if (!newOutput.workspace) {
						logicGate.takeOutputFrom(newOutput.internalComponent, newOutput.uid, uid);	
					} else {
						newOutput.sendInputTo(this);
					}
					setInternalCallbacks(setCostume);
					path.updateBottom(newOutput.getPosition());
					newOutput.addPath(path);
				}
			}

			this.getPosition = function() {
				let rect = innerHTML.getNodeRect();
				let wRect = that.innerHTML.getWorkspaceRect();
				let x = rect.x - wRect.x + 9;
				let y = rect.y - wRect.y + 12;
				
				let pos = Object.create(null);
				pos.x = x;
				pos.y = y;

				return pos;
			}
			
			this.addInternalCallbacks = function() {
				setInternalCallbacks(setCostume);
			}

			this.removeInternalCallbacks = function() {
				setInternalCallbacks(setCostume, true);
			}

			function setInternalCallbacks(func, remove = false) {
				if (!output)
					return;

				if (output.isNand || output.workspace) {
					if (remove)
						output.internalComponent.removeEventListener("onOutputChange", func);
					else
						output.internalComponent.addEventListener("onOutputChange", func);
				} else {
					if (remove)
						output.internalComponent.getOutputComp(output.uid).removeEventListener("onOutputChange", func);
					else
						output.internalComponent.getOutputComp(output.uid).addEventListener("onOutputChange", func);
				}
			}

			function setCostume(on) {
				innerHTML.setCostume(on);
				path.setCostume(on);
			}

		}

		// Constructor for workspace inputs
		let WorkspaceInput = function() {
			let self = this;
			let innerHTML = HTML.workspaceInput();
			let workspace = true;
			let internalComponent = new toggleable();
			let uid = inUid++;
			let paths = [];
			inputNames.push("");

			Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
			Object.defineProperty(this, "workspace", {get(){return workspace}});
			Object.defineProperty(this, "internalComponent", {get(){return internalComponent}});
			Object.defineProperty(this, "uid", {get(){return uid}});
			Object.defineProperty(this, "isNand", {get(){return false}});

			// Updates the input costume and the toggleable's state when the checkbox's value changes
			innerHTML.onCheckboxChange = function(e) {
				let on = e.target.checked;
				innerHTML.setCostume(on);
				internalComponent.setOutput(on);
			}
			
			innerHTML.onMouseEnter = function(e) {
				current.setOutputNode(self);
			}

			innerHTML.onMouseLeave = function(e) {
				if (current.outputNode === self)
					current.setOutputNode(undefined);
			}
			
			innerHTML.onCircleClick = function(e) {
				swal("Name input:", {
					content: "input",
					buttons: true
				})
				.then(function(name) {
					innerHTML.setText(name);
					that.updateInputName(uid, name);
				});
			}

			this.sendInputTo = function(input) {
				console.log(input, input.uid);
				if (!input.workspace) {
					logicGate.sendInputTo(input.internalComponent, input.uid, uid);
				} else {
					logicGate.sendInputTo(logicGate.outputsFrom[input.uid], 0, uid);
				}
			}

			this.removeInputTo = function(input) {
				console.log("Removing input");
				if (!input.workspace) {
					logicGate.removeInputTo(input.internalComponent, input.uid, uid);
				} else {
					logicGate.removeInputTo(logicGate.outputsFrom[input.uid], 0, uid);
				}
			}

			this.addPath = function(path) {
				paths.push(path);
			}
			
			this.removePath = function(path) {
				paths.splice(paths.indexOf(paths), 1);
			}

			this.getPosition = function() {
				let rect = innerHTML.getNodeRect();
				let wRect = that.innerHTML.getWorkspaceRect();
				let x = rect.x - wRect.x + 9;
				let y = rect.y - wRect.y;
				
				let pos = Object.create(null);
				pos.x = x;
				pos.y = y;

				return pos;
			}
		}

		////////////////////////////////Functions called by parent////////////////////////////////

		this.hide = function() {
			innerHTML.style.display = "none";
			eventHandler.triggerEvent("onHide");
		}

		this.show = function() {
			innerHTML.style.display = "block";
			eventHandler.triggerEvent("onShow");
		}

		this.addComponentBlock = function(componentBlock) {
			innerHTML.addComponentBlock(componentBlock.innerHTML);
			componentBlock.updatePathsPos();
		}

		this.addPath = function(path) {
			innerHTML.addPath(path.innerHTML);
		}
		
		this.updateInputName = function(id, name) {
			inputNames[id] = name;
			//parent.updateInputName(id, name);
		}
		
		this.rename = innerHTML.rename;

		this.transformMousePos = this.innerHTML.transformMousePos;
		
		/////////////////////////////////Callbacks on HTML events/////////////////////////////////

		innerHTML.onAddOutputClick = function() {
			let output = new WorkspaceOutput();
			outputs.push(output);
			innerHTML.addOutput(output.innerHTML);
			output.path.updateTop(output.getPosition());
			output.path.updateBottom(output.getPosition());
			parent.addOutput();
		}

		innerHTML.onAddInputClick = function() {
			let input = new WorkspaceInput();
			inputs.push(input);
			innerHTML.addInput(input.innerHTML);
			parent.addInput();
		}
	}

	// Parent refers to the component from which it is instantiated, not the component it is in
	var ComponentBlock = function(name, logicGate, residence, parent, inputNames) {
		let that = this;
		let isNand = (name === "nand");
		let numInputs = 0;
		let numOutputs = 0;
		let outUid = 0;
		let inUid = 0;
		let innerHTML = HTML.componentBlock(name);
		let internalComponent = new logicGate();
		let inputs = [];
		let outputs = [];
		let eventHandler = GetEventHandler(this, ["onShow", "onHide"]);
		
		residence.addEventListener("onShow", function(e){eventHandler.triggerEvent("onShow", e)});
		residence.addEventListener("onHide", function(e){eventHandler.triggerEvent("onHide", e)});
		
		Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
		Object.defineProperty(this, "internalComponent", {get(){return internalComponent}});
		Object.defineProperty(this, "residence", {get(){return residence}});
		Object.defineProperty(this, "parent", {get(){return parent}});
		Object.defineProperty(this, "inputs", {get(){return inputs}});
		Object.defineProperty(this, "outputs", {get(){return outputs}});

		let blockOutput = function() {
			let self = this;
			let innerHTML = HTML.blockOutput();
			let workspace = false;
			let uid = outUid++;
			let paths = [];

			Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
			Object.defineProperty(this, "workspace", {get(){return workspace}});
			Object.defineProperty(this, "uid", {get(){return uid}});
			Object.defineProperty(this, "internalComponent", {get(){return internalComponent}});
			Object.defineProperty(this, "isNand", {get(){return isNand}});

			innerHTML.onMouseEnter = function(e) {
				current.setOutputNode(self);
			}

			innerHTML.onMouseLeave = function(e) {
				if (current.outputNode === self)
					current.setOutputNode(undefined);
			}

			this.addInternalCallbacks = function() {
				setInternalCallbacks(innerHTML.setCostume);
			}

			this.removeInternalCallbacks = function() {
				setInternalCallbacks(innerHTML.setCostume, true);
			}

			this.getPosition = function() {
				let rect = innerHTML.getNodeRect();
				let wRect = current.workspace.innerHTML.getWorkspaceRect();
				let x = rect.x - wRect.x + 9;
				let y = rect.y - wRect.y;
				
				let pos = Object.create(null);
				pos.x = x;
				pos.y = y;

				return pos;
			}

			function setInternalCallbacks(func, remove = false) {
					if (isNand) {
						if (remove)
							internalComponent.removeEventListener("onOutputChange", func);
						else
							internalComponent.addEventListener("onOutputChange", func);	
					} else {
						if (remove)
							internalComponent.getOutputComp(uid).removeEventListener("onOutputChange", func);
						else
							internalComponent.getOutputComp(uid).addEventListener("onOutputChange", func);
					}
			}

			this.addPath = function(path) {
				paths.push(path);
			}
			
			this.removePath = function(path) {
				paths.splice(paths.indexOf(paths), 1);
			}

			this.updatePathsPos = function() {
				let that = this;

				paths.forEach(function(path) {
					path.updateBottom(that.getPosition());
				});
			}
			
			this.removePathsCallbacks = function() {
				paths.forEach(function(path) {
					path.node.removeInternalCallbacks();
				});
			}
			
			this.addPathsCallbacks = function() {
				paths.forEach(function(path) {
					path.node.addInternalCallbacks();
				});	
			}

			this.removeConnections = function() {
				paths.forEach(function(path) {
					path.node.setInput(undefined);
				});
			}

			setInternalCallbacks(innerHTML.setCostume);
		}

		let blockInput = function() {
			let self = this;
			let innerHTML = HTML.blockInput();
			let workspace = false;
			let uid = inUid++;
			let path = new Path(this, parent);
			let output = undefined;

			Object.defineProperty(this, "innerHTML", {get(){return innerHTML}});
			Object.defineProperty(this, "workspace", {get(){return workspace}});
			Object.defineProperty(this, "uid", {get(){return uid}});
			Object.defineProperty(this, "path", {get(){return path}});
			Object.defineProperty(this, "internalComponent", {get(){return internalComponent}});
			Object.defineProperty(this, "isNand", {get(){return isNand}});

			current.workspace.addPath(path);
			
			innerHTML.onTriangleClick = function(e) {
				current.setInputNode(self);
				self.setInput(undefined);
				path.updateBottom(self.getPosition());
			}
			
			this.setName = function(name){innerHTML.setText(name)};

			this.setInput = function(newOutput) {
				if (!newOutput) {
					if (!output)
						return;

					if (output.workspace) {
						output.removeInputTo(this);
					} else {
						internalComponent.setInputComp(undefined, 0, uid);
					}
					
					setInternalCallbacks(setCostume, true);
					path.updateBottom(this.getPosition());
					output.removePath(path);
					setCostume(false);
					
					output = newOutput;
				} else {
					if (output)
						this.setInput(undefined);

					output = newOutput;
					
					if (!newOutput.workspace) {
						internalComponent.setInputComp(newOutput.internalComponent, newOutput.uid, uid);
					} else {
						internalComponent.setInputComp(newOutput.internalComponent, 0, uid);
						newOutput.sendInputTo(this);
					}
					
					setInternalCallbacks(setCostume);
					path.updateBottom(newOutput.getPosition());
					newOutput.addPath(path);
				}
			}

			this.getPosition = function() {
				let rect = innerHTML.getNodeRect();
				let wRect = current.workspace.innerHTML.getWorkspaceRect();
				let x = rect.x - wRect.x + 9;
				let y = rect.y - wRect.y + 11;
				
				let pos = Object.create(null);
				pos.x = x;
				pos.y = y;

				return pos;
			}

			this.updatePath = function() {
				path.updateTop(this.getPosition());
				if (!output)
					path.updateBottom(this.getPosition());
			}

			this.removeConnection = function() {
				this.setInput(undefined);
			}

			this.addInternalCallbacks = function() {
				setInternalCallbacks(setCostume);
			}

			this.removeInternalCallbacks = function() {
				setInternalCallbacks(setCostume, true);
			}
			
			function setInternalCallbacks(func, remove = false) {
				if (!output)
					return;

				if (output.isNand || output.workspace) {
					if (remove)
						output.internalComponent.removeEventListener("onOutputChange", func);
					else
						output.internalComponent.addEventListener("onOutputChange", func);
				} else {
					if (remove)
						output.internalComponent.getOutputComp(output.uid).removeEventListener("onOutputChange", func);
					else
						output.internalComponent.getOutputComp(output.uid).addEventListener("onOutputChange", func);
				}
			}

			function setCostume(on) {
				innerHTML.setCostume(on);
				path.setCostume(on);
			}
		}

		innerHTML.onMouseDown = function(e) {
			//console.log("componentBlock click");
			
			current.setComponentBlock(that);
			
			if (current.inputNode)
				return;
			
			innerHTML.style.pointerEvents = "none";
		}
		
		innerHTML.onInfoButtonClick = function(e) {
			swal("This component is outdated");
		}

		this.onMouseUp = function(e) {
			//console.log("mouse up");
			
			if (current.inputNode)
				return;

			mousePosition = {
				x: e.clientX,
				y: e.clientY
			};

			let x = mousePosition.x + offset[0], y = mousePosition.y + offset[1];
			let parent = innerHTML.parentNode;
			let width = innerHTML.offsetWidth + 2;
			let height = innerHTML.spanOffsetHeight() - 4;

			//console.log("overTrash", current.overTrash);
			
			if (current.overTrash) {
				that.delete();
				return;
			}

			that.innerHTML.style.pointerEvents = "all";

			if (x < 0)
				x = 0;
			
			if (y < height)
				y = height;

			if (x > parent.offsetWidth - width)
				x = parent.offsetWidth - width;

			if (y > parent.offsetHeight)
				y = parent.offsetHeight;

			that.updatePos(x, y);
		}

		function addOutput() {
			let output = new blockOutput();
			outputs.push(output);
			that.innerHTML.addOutput(output.innerHTML);
			numOutputs++;
		}

		function addInput() {
			let input = new blockInput();
			inputs.push(input);
			that.innerHTML.addInput(input.innerHTML);	
			numInputs++;
		}
		
		/*this.updateInputName = function(id, name) {
			inputs[id].setName(name);
		}*/

		residence.addEventListener("onShow", function() {
			inputs.forEach(function(input, id) {
				//console.log(parent.workspace.inputNames[id]);
				//console.log(residence.name, parent.name, parent.workspace.inputNames[id]);
				input.setName(parent.workspace.inputNames[id]);
			});
		});
		
		this.updatePathsPos = function() {
			outputs.forEach(function(output) {
				output.updatePathsPos();
			});
			
			inputs.forEach(function(input) {
				input.updatePath();
			});
		}
		
		this.updatePos = function(x, y) {
			innerHTML.style.left = x + "px";
			innerHTML.style.top = y + "px";

			this.updatePathsPos();
		}

		this.delete = function() {
			outputs.forEach(function(output) {
				output.removeConnections();
			});

			inputs.forEach(function(input) {
				input.removeConnection();
			});

			innerHTML.parentNode.removeChild(innerHTML);

			parent.removeComponentBlock(this);
			residence.removeDependency(this.parent);
		}		

		this.updateInternalComponent = function() {
			outputs.forEach(function(output) {
				output.removeInternalCallbacks();
				output.removePathsCallbacks();
			});

			this.internalComponent.updateStructure();

			outputs.forEach(function(output) {
				output.addInternalCallbacks();
				output.addPathsCallbacks();
			});
		}
		
		this.invalid = function(invalid) {
			if (invalid) {
				this.innerHTML.className = "component invalid";
				this.innerHTML.showInfoButton();
			} else {
				this.innerHTML.className = "component";
				this.innerHTML.hideInfoButton();
			}
		}

		this.rename = innerHTML.rename;

		this.updateIO = function() {
			while (numOutputs < logicGate.numOutputs) {
				addOutput();
			}
			while (numInputs < logicGate.numInputs) {
				addInput();
			}
		}
		this.updateIO();
		
		setTimeout(function() {
			inputs.forEach(function(input, i) {
				input.setName(inputNames[i]);
			});
		}, 0);
	}

}