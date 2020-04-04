let AgCl = 0.1; // Initial concentration of silver chloride before reaction occurs
let Ag = 0; // Initial concentration of silver in solution before reaction occurs
let Cl = 0; // Initial concentration of chlorine in solution before reaction occurs
let volume = 1; // Volume of solution in liters
let Ksp = 1.77 * Math.pow(10, -10);
let Kf = Ksp * 10000;
let Kr = 1 * 10000;

function timeStep(dt) {
	let dAgCl = -Kr * Ag * Cl;
	let dAg = Kf;
	let dCl = Kf;
	
	AgCl += dAgCl;
	Ag += dAg;
	Cl += dCl;
	
	console.log(AgCl, (Ag * Cl));
}
