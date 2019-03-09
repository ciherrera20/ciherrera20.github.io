// Create inverter gate
{
	var inv = customComponent.getInstance("inv", 1, 1);
	let nand1 = nand.getInstance();
	inv.connectOutputTo(nand1, 0, 0);
	inv.connectInputTo(nand1.inputs[0], 0);
	inv.connectInputTo(nand1.inputs[1], 0);
}

// Create and gate
{
	var and = customComponent.getInstance("and", 2, 1);
	let inv1 = inv.getInstance();
	let nand1 = nand.getInstance();
	inv1.inputs[0].setInput(nand1, 0);
	and.connectOutputTo(inv1, 0, 0);
	and.connectInputTo(nand1.inputs[0], 0);
	and.connectInputTo(nand1.inputs[1], 1);
}

// Create or gate
{
	var or = customComponent.getInstance("or", 2, 1);
	let inv1 = inv.getInstance();
	let inv2 = inv.getInstance();
	let nand1 = nand.getInstance();
	nand1.inputs[0].setInput(inv1, 0);
	nand1.inputs[1].setInput(inv2, 0)
	or.connectOutputTo(nand1, 0, 0);
	or.connectInputTo(inv1.inputs[0], 0);
	or.connectInputTo(inv2.inputs[0], 1);
}

// Create xor gate
{
	var xor = customComponent.getInstance("or", 2, 1);
	let nand1 = nand.getInstance();
	let or1 = or.getInstance();
	let and1 = and.getInstance();
	and1.inputs[0].setInput(nand1, 0);
	and1.inputs[1].setInput(or1, 0);
	xor.connectOutputTo(and1, 0, 0);
	xor.connectInputTo(nand1.inputs[0], 0);
	xor.connectInputTo(or1.inputs[0], 0);
	xor.connectInputTo(nand1.inputs[1], 1);
	xor.connectInputTo(or1.inputs[1], 1);	
}

// Create 1 bit multiplexer
{
	var mux = customComponent.getInstance("mux", 3, 1);
	let or1 = or.getInstance();
	let and1 = and.getInstance();
	let and2 = and.getInstance();
	let inv1 = inv.getInstance();
	or1.inputs[0].setInput(and1, 0);
	or1.inputs[1].setInput(and2, 0);
	and2.inputs[1].setInput(inv1, 0);
	mux.connectOutputTo(or1, 0, 0);
	mux.connectInputTo(inv1.inputs[0], 2);
	mux.connectInputTo(and1.inputs[1], 2);
	mux.connectInputTo(and1.inputs[0], 1);
	mux.connectInputTo(and2.inputs[0], 0);
}

// Create 1 bit 8 bit multiplexer
{
	var mux8Bit = customComponent.getInstance("mux8Bit", 17, 8);
	let mux1 = mux.getInstance();
	let mux2 = mux.getInstance();
	let mux3 = mux.getInstance();
	let mux4 = mux.getInstance();
	let mux5 = mux.getInstance();
	let mux6 = mux.getInstance();
	let mux7 = mux.getInstance();
	let mux8 = mux.getInstance();
	mux8Bit.connectOutputTo(mux1, 0, 0);
	mux8Bit.connectOutputTo(mux2, 0, 1);
	mux8Bit.connectOutputTo(mux3, 0, 2);
	mux8Bit.connectOutputTo(mux4, 0, 3);
	mux8Bit.connectOutputTo(mux5, 0, 4);
	mux8Bit.connectOutputTo(mux6, 0, 5);
	mux8Bit.connectOutputTo(mux7, 0, 6);
	mux8Bit.connectOutputTo(mux8, 0, 7);
	mux8Bit.connectInputTo(mux1.inputs[0], 0);
	mux8Bit.connectInputTo(mux2.inputs[0], 1);
	mux8Bit.connectInputTo(mux3.inputs[0], 2);
	mux8Bit.connectInputTo(mux4.inputs[0], 3);
	mux8Bit.connectInputTo(mux5.inputs[0], 4);
	mux8Bit.connectInputTo(mux6.inputs[0], 5);
	mux8Bit.connectInputTo(mux7.inputs[0], 6);
	mux8Bit.connectInputTo(mux8.inputs[0], 7);
	mux8Bit.connectInputTo(mux1.inputs[1], 8);
	mux8Bit.connectInputTo(mux2.inputs[1], 9);
	mux8Bit.connectInputTo(mux3.inputs[1], 10);
	mux8Bit.connectInputTo(mux4.inputs[1], 11);
	mux8Bit.connectInputTo(mux5.inputs[1], 12);
	mux8Bit.connectInputTo(mux6.inputs[1], 13);
	mux8Bit.connectInputTo(mux7.inputs[1], 14);
	mux8Bit.connectInputTo(mux8.inputs[1], 15);
	mux8Bit.connectInputTo(mux1.inputs[2], 16);
	mux8Bit.connectInputTo(mux2.inputs[2], 16);
	mux8Bit.connectInputTo(mux3.inputs[2], 16);
	mux8Bit.connectInputTo(mux4.inputs[2], 16);
	mux8Bit.connectInputTo(mux5.inputs[2], 16);
	mux8Bit.connectInputTo(mux6.inputs[2], 16);
	mux8Bit.connectInputTo(mux7.inputs[2], 16);
	mux8Bit.connectInputTo(mux8.inputs[2], 16);
}

// Create 1 bit demultiplexer
{
	var demux = customComponent.getInstance("demux", 2, 2);
	let and1 = and.getInstance();
	let and2 = and.getInstance();
	let inv1 = inv.getInstance();
	and1.inputs[1].setInput(inv1, 0);
	demux.connectOutputTo(and1, 0, 0);
	demux.connectOutputTo(and2, 0, 1);
	demux.connectInputTo(and1.inputs[0], 0);
	demux.connectInputTo(and2.inputs[0], 0);
	demux.connectInputTo(inv1.inputs[0], 1);
	demux.connectInputTo(and2.inputs[1], 1);
}

// Create outputTrue
{
	var outputTrue = customComponent.getInstance("outputTrue", 0, 1);
	let inv1 = inv.getInstance();
	outputTrue.connectOutputTo(inv1, 0, 0);
}

// Create clock
{
	var clock = customComponent.getInstance("clock", 0, 1);
	let inv1 = inv.getInstance();
	inv1.inputs[0].setInput(inv1, 0);
	clock.connectOutputTo(inv1, 0, 0);
}

// Create latch
{
	var latch = customComponent.getInstance("latch", 2, 1);
	let mux1 = mux.getInstance();
	mux1.inputs[0].setInput(mux1, 0);
	latch.connectOutputTo(mux1, 0, 0);
	latch.connectInputTo(mux1.inputs[1], 0);
	latch.connectInputTo(mux1.inputs[2], 1);
	
}

// Create D_FlipFlop
{
	var D_FlipFlop = customComponent.getInstance("D_FlipFlop", 3, 1);
	let latch1 = latch.getInstance();
	let latch2 = latch.getInstance();
	let and1 = and.getInstance();
	let inv1 = inv.getInstance();
	and1.inputs[0].setInput(inv1, 0);
	latch1.inputs[1].setInput(and1, 0);
	latch2.inputs[0].setInput(latch1, 0);
	D_FlipFlop.connectOutputTo(latch2, 0, 0);
	D_FlipFlop.connectInputTo(inv1.inputs[0], 0);
	D_FlipFlop.connectInputTo(latch2.inputs[1], 0);
	D_FlipFlop.connectInputTo(latch1.inputs[0], 1);
	D_FlipFlop.connectInputTo(and1.inputs[1], 2);
}

// Create 8 Bit Register
/*{
	var register8Bit = customComponent.getInstance("register8Bit", 10, 8);
	let D_FlipFlop1 = D_FlipFlop.getInstance();
	let D_FlipFlop2 = D_FlipFlop.getInstance();
	let D_FlipFlop3 = D_FlipFlop.getInstance();
	let D_FlipFlop4 = D_FlipFlop.getInstance();
	let D_FlipFlop5 = D_FlipFlop.getInstance();
	let D_FlipFlop6 = D_FlipFlop.getInstance();
	let D_FlipFlop7 = D_FlipFlop.getInstance();
	let D_FlipFlop8 = D_FlipFlop.getInstance();
	register8Bit.connectOutputTo(D_FlipFlop1, 0, 0);
	register8Bit.connectOutputTo(D_FlipFlop2, 0, 1);
	register8Bit.connectOutputTo(D_FlipFlop3, 0, 2);
	register8Bit.connectOutputTo(D_FlipFlop4, 0, 3);
	register8Bit.connectOutputTo(D_FlipFlop5, 0, 4);
	register8Bit.connectOutputTo(D_FlipFlop6, 0, 5);
	register8Bit.connectOutputTo(D_FlipFlop7, 0, 6);
	register8Bit.connectOutputTo(D_FlipFlop8, 0, 7);
	register8Bit.connectInputTo(D_FlipFlop1.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop2.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop3.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop4.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop5.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop6.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop7.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop8.inputs[0], 0);
	register8Bit.connectInputTo(D_FlipFlop1.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop2.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop3.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop4.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop5.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop6.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop7.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop8.inputs[2], 9);
	register8Bit.connectInputTo(D_FlipFlop1.inputs[1], 1);
	register8Bit.connectInputTo(D_FlipFlop2.inputs[1], 2);
	register8Bit.connectInputTo(D_FlipFlop3.inputs[1], 3);
	register8Bit.connectInputTo(D_FlipFlop4.inputs[1], 4);
	register8Bit.connectInputTo(D_FlipFlop5.inputs[1], 5);
	register8Bit.connectInputTo(D_FlipFlop6.inputs[1], 6);
	register8Bit.connectInputTo(D_FlipFlop7.inputs[1], 7);
	register8Bit.connectInputTo(D_FlipFlop8.inputs[1], 8);
}

// Create 256 8 Bit EEPROM
{
	let EEPROM_2_8_Bit = customComponent.getInstance("EEPROM_2_8_Bit", 11, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let register8Bit1 = register8Bit.getInstance();
		let register8Bit2 = register8Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		mux8Bit1.inputs[0].setInput(register8Bit1, 0);
		mux8Bit1.inputs[1].setInput(register8Bit1, 1);
		mux8Bit1.inputs[2].setInput(register8Bit1, 2);
		mux8Bit1.inputs[3].setInput(register8Bit1, 3);
		mux8Bit1.inputs[4].setInput(register8Bit1, 4);
		mux8Bit1.inputs[5].setInput(register8Bit1, 5);
		mux8Bit1.inputs[6].setInput(register8Bit1, 6);
		mux8Bit1.inputs[7].setInput(register8Bit1, 7);
		mux8Bit1.inputs[8].setInput(register8Bit2, 0);
		mux8Bit1.inputs[9].setInput(register8Bit2, 1);
		mux8Bit1.inputs[10].setInput(register8Bit2, 2);
		mux8Bit1.inputs[11].setInput(register8Bit2, 3);
		mux8Bit1.inputs[12].setInput(register8Bit2, 4);
		mux8Bit1.inputs[13].setInput(register8Bit2, 5);
		mux8Bit1.inputs[14].setInput(register8Bit2, 6);
		mux8Bit1.inputs[15].setInput(register8Bit2, 7);
		register8Bit1.inputs[0].setInput(demux1, 0);
		register8Bit2.inputs[0].setInput(demux1, 1);
		register8Bit1.inputs[9].setInput(demux2, 0);
		register8Bit2.inputs[9].setInput(demux2, 1);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_2_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		EEPROM_2_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_2_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[1], 1);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[2], 2);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[3], 3);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[4], 4);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[5], 5);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[6], 6);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[7], 7);
		EEPROM_2_8_Bit.connectInputTo(register8Bit1.inputs[8], 8);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[1], 1);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[2], 2);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[3], 3);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[4], 4);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[5], 5);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[6], 6);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[7], 7);
		EEPROM_2_8_Bit.connectInputTo(register8Bit2.inputs[8], 8);
		EEPROM_2_8_Bit.connectInputTo(demux1.inputs[1], 10);
		EEPROM_2_8_Bit.connectInputTo(demux2.inputs[1], 10);
		EEPROM_2_8_Bit.connectInputTo(mux8Bit1.inputs[16], 10);
	}
	let EEPROM_4_8_Bit = customComponent.getInstance("EEPROM_4_8_Bit", 12, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let EEPROM_2_8_Bit1 = EEPROM_2_8_Bit.getInstance();
		let EEPROM_2_8_Bit2 = EEPROM_2_8_Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		// Connect mux
		mux8Bit1.inputs[0].setInput(EEPROM_2_8_Bit1, 0);
		mux8Bit1.inputs[1].setInput(EEPROM_2_8_Bit1, 1);
		mux8Bit1.inputs[2].setInput(EEPROM_2_8_Bit1, 2);
		mux8Bit1.inputs[3].setInput(EEPROM_2_8_Bit1, 3);
		mux8Bit1.inputs[4].setInput(EEPROM_2_8_Bit1, 4);
		mux8Bit1.inputs[5].setInput(EEPROM_2_8_Bit1, 5);
		mux8Bit1.inputs[6].setInput(EEPROM_2_8_Bit1, 6);
		mux8Bit1.inputs[7].setInput(EEPROM_2_8_Bit1, 7);
		mux8Bit1.inputs[8].setInput(EEPROM_2_8_Bit2, 0);
		mux8Bit1.inputs[9].setInput(EEPROM_2_8_Bit2, 1);
		mux8Bit1.inputs[10].setInput(EEPROM_2_8_Bit2, 2);
		mux8Bit1.inputs[11].setInput(EEPROM_2_8_Bit2, 3);
		mux8Bit1.inputs[12].setInput(EEPROM_2_8_Bit2, 4);
		mux8Bit1.inputs[13].setInput(EEPROM_2_8_Bit2, 5);
		mux8Bit1.inputs[14].setInput(EEPROM_2_8_Bit2, 6);
		mux8Bit1.inputs[15].setInput(EEPROM_2_8_Bit2, 7);
		// Connect memory circuits to demuxes
		EEPROM_2_8_Bit1.inputs[0].setInput(demux1, 0);
		EEPROM_2_8_Bit2.inputs[0].setInput(demux1, 1);
		EEPROM_2_8_Bit1.inputs[9].setInput(demux2, 0);
		EEPROM_2_8_Bit2.inputs[9].setInput(demux2, 1);
		// Connect outputs
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_4_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		// Connect write lines
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[1], 1);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[2], 2);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[3], 3);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[4], 4);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[5], 5);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[6], 6);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[7], 7);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[8], 8);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[1], 1);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[2], 2);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[3], 3);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[4], 4);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[5], 5);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[6], 6);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[7], 7);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[8], 8);
		// Connect previous address lines
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit1.inputs[10], 10);
		EEPROM_4_8_Bit.connectInputTo(EEPROM_2_8_Bit2.inputs[10], 10);
		// Connect new address line
		EEPROM_4_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_4_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_4_8_Bit.connectInputTo(demux1.inputs[1], 11);
		EEPROM_4_8_Bit.connectInputTo(demux2.inputs[1], 11);
		EEPROM_4_8_Bit.connectInputTo(mux8Bit1.inputs[16], 11);
	}
	let EEPROM_8_8_Bit = customComponent.getInstance("EEPROM_8_8_Bit", 13, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let EEPROM_4_8_Bit1 = EEPROM_4_8_Bit.getInstance();
		let EEPROM_4_8_Bit2 = EEPROM_4_8_Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		// Connect mux
		mux8Bit1.inputs[0].setInput(EEPROM_4_8_Bit1, 0);
		mux8Bit1.inputs[1].setInput(EEPROM_4_8_Bit1, 1);
		mux8Bit1.inputs[2].setInput(EEPROM_4_8_Bit1, 2);
		mux8Bit1.inputs[3].setInput(EEPROM_4_8_Bit1, 3);
		mux8Bit1.inputs[4].setInput(EEPROM_4_8_Bit1, 4);
		mux8Bit1.inputs[5].setInput(EEPROM_4_8_Bit1, 5);
		mux8Bit1.inputs[6].setInput(EEPROM_4_8_Bit1, 6);
		mux8Bit1.inputs[7].setInput(EEPROM_4_8_Bit1, 7);
		mux8Bit1.inputs[8].setInput(EEPROM_4_8_Bit2, 0);
		mux8Bit1.inputs[9].setInput(EEPROM_4_8_Bit2, 1);
		mux8Bit1.inputs[10].setInput(EEPROM_4_8_Bit2, 2);
		mux8Bit1.inputs[11].setInput(EEPROM_4_8_Bit2, 3);
		mux8Bit1.inputs[12].setInput(EEPROM_4_8_Bit2, 4);
		mux8Bit1.inputs[13].setInput(EEPROM_4_8_Bit2, 5);
		mux8Bit1.inputs[14].setInput(EEPROM_4_8_Bit2, 6);
		mux8Bit1.inputs[15].setInput(EEPROM_4_8_Bit2, 7);
		// Connect memory circuits to demuxes
		EEPROM_4_8_Bit1.inputs[0].setInput(demux1, 0);
		EEPROM_4_8_Bit2.inputs[0].setInput(demux1, 1);
		EEPROM_4_8_Bit1.inputs[9].setInput(demux2, 0);
		EEPROM_4_8_Bit2.inputs[9].setInput(demux2, 1);
		// Connect outputs
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_8_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		// Connect write lines
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[1], 1);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[2], 2);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[3], 3);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[4], 4);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[5], 5);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[6], 6);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[7], 7);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[8], 8);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[1], 1);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[2], 2);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[3], 3);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[4], 4);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[5], 5);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[6], 6);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[7], 7);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[8], 8);
		// Connect previous address lines
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[10], 10);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit1.inputs[11], 11);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[10], 10);
		EEPROM_8_8_Bit.connectInputTo(EEPROM_4_8_Bit2.inputs[11], 11);
		// Connect new address line
		EEPROM_8_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_8_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_8_8_Bit.connectInputTo(demux1.inputs[1], 12);
		EEPROM_8_8_Bit.connectInputTo(demux2.inputs[1], 12);
		EEPROM_8_8_Bit.connectInputTo(mux8Bit1.inputs[16], 12);
	}
	let EEPROM_16_8_Bit = customComponent.getInstance("EEPROM_16_8_Bit", 14, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let EEPROM_8_8_Bit1 = EEPROM_8_8_Bit.getInstance();
		let EEPROM_8_8_Bit2 = EEPROM_8_8_Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		// Connect mux
		mux8Bit1.inputs[0].setInput(EEPROM_8_8_Bit1, 0);
		mux8Bit1.inputs[1].setInput(EEPROM_8_8_Bit1, 1);
		mux8Bit1.inputs[2].setInput(EEPROM_8_8_Bit1, 2);
		mux8Bit1.inputs[3].setInput(EEPROM_8_8_Bit1, 3);
		mux8Bit1.inputs[4].setInput(EEPROM_8_8_Bit1, 4);
		mux8Bit1.inputs[5].setInput(EEPROM_8_8_Bit1, 5);
		mux8Bit1.inputs[6].setInput(EEPROM_8_8_Bit1, 6);
		mux8Bit1.inputs[7].setInput(EEPROM_8_8_Bit1, 7);
		mux8Bit1.inputs[8].setInput(EEPROM_8_8_Bit2, 0);
		mux8Bit1.inputs[9].setInput(EEPROM_8_8_Bit2, 1);
		mux8Bit1.inputs[10].setInput(EEPROM_8_8_Bit2, 2);
		mux8Bit1.inputs[11].setInput(EEPROM_8_8_Bit2, 3);
		mux8Bit1.inputs[12].setInput(EEPROM_8_8_Bit2, 4);
		mux8Bit1.inputs[13].setInput(EEPROM_8_8_Bit2, 5);
		mux8Bit1.inputs[14].setInput(EEPROM_8_8_Bit2, 6);
		mux8Bit1.inputs[15].setInput(EEPROM_8_8_Bit2, 7);
		// Connect memory circuits to demuxes
		EEPROM_8_8_Bit1.inputs[0].setInput(demux1, 0);
		EEPROM_8_8_Bit2.inputs[0].setInput(demux1, 1);
		EEPROM_8_8_Bit1.inputs[9].setInput(demux2, 0);
		EEPROM_8_8_Bit2.inputs[9].setInput(demux2, 1);
		// Connect outputs
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_16_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		// Connect write lines
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[1], 1);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[2], 2);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[3], 3);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[4], 4);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[5], 5);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[6], 6);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[7], 7);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[8], 8);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[1], 1);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[2], 2);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[3], 3);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[4], 4);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[5], 5);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[6], 6);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[7], 7);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[8], 8);
		// Connect previous address lines
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[10], 10);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[11], 11);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit1.inputs[12], 12);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[10], 10);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[11], 11);
		EEPROM_16_8_Bit.connectInputTo(EEPROM_8_8_Bit2.inputs[12], 12);
		// Connect new address line
		EEPROM_16_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_16_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_16_8_Bit.connectInputTo(demux1.inputs[1], 13);
		EEPROM_16_8_Bit.connectInputTo(demux2.inputs[1], 13);
		EEPROM_16_8_Bit.connectInputTo(mux8Bit1.inputs[16], 13);
	}
	let EEPROM_32_8_Bit = customComponent.getInstance("EEPROM_32_8_Bit", 15, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let EEPROM_16_8_Bit1 = EEPROM_16_8_Bit.getInstance();
		let EEPROM_16_8_Bit2 = EEPROM_16_8_Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		// Connect mux
		mux8Bit1.inputs[0].setInput(EEPROM_16_8_Bit1, 0);
		mux8Bit1.inputs[1].setInput(EEPROM_16_8_Bit1, 1);
		mux8Bit1.inputs[2].setInput(EEPROM_16_8_Bit1, 2);
		mux8Bit1.inputs[3].setInput(EEPROM_16_8_Bit1, 3);
		mux8Bit1.inputs[4].setInput(EEPROM_16_8_Bit1, 4);
		mux8Bit1.inputs[5].setInput(EEPROM_16_8_Bit1, 5);
		mux8Bit1.inputs[6].setInput(EEPROM_16_8_Bit1, 6);
		mux8Bit1.inputs[7].setInput(EEPROM_16_8_Bit1, 7);
		mux8Bit1.inputs[8].setInput(EEPROM_16_8_Bit2, 0);
		mux8Bit1.inputs[9].setInput(EEPROM_16_8_Bit2, 1);
		mux8Bit1.inputs[10].setInput(EEPROM_16_8_Bit2, 2);
		mux8Bit1.inputs[11].setInput(EEPROM_16_8_Bit2, 3);
		mux8Bit1.inputs[12].setInput(EEPROM_16_8_Bit2, 4);
		mux8Bit1.inputs[13].setInput(EEPROM_16_8_Bit2, 5);
		mux8Bit1.inputs[14].setInput(EEPROM_16_8_Bit2, 6);
		mux8Bit1.inputs[15].setInput(EEPROM_16_8_Bit2, 7);
		// Connect memory circuits to demuxes
		EEPROM_16_8_Bit1.inputs[0].setInput(demux1, 0);
		EEPROM_16_8_Bit2.inputs[0].setInput(demux1, 1);
		EEPROM_16_8_Bit1.inputs[9].setInput(demux2, 0);
		EEPROM_16_8_Bit2.inputs[9].setInput(demux2, 1);
		// Connect outputs
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_32_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		// Connect write lines
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[1], 1);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[2], 2);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[3], 3);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[4], 4);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[5], 5);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[6], 6);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[7], 7);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[8], 8);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[1], 1);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[2], 2);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[3], 3);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[4], 4);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[5], 5);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[6], 6);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[7], 7);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[8], 8);
		// Connect previous address lines
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[10], 10);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[11], 11);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[12], 12);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit1.inputs[13], 13);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[10], 10);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[11], 11);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[12], 12);
		EEPROM_32_8_Bit.connectInputTo(EEPROM_16_8_Bit2.inputs[13], 13);
		// Connect new address line
		EEPROM_32_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_32_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_32_8_Bit.connectInputTo(demux1.inputs[1], 14);
		EEPROM_32_8_Bit.connectInputTo(demux2.inputs[1], 14);
		EEPROM_32_8_Bit.connectInputTo(mux8Bit1.inputs[16], 14);
	}
	let EEPROM_64_8_Bit = customComponent.getInstance("EEPROM_64_8_Bit", 16, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let EEPROM_32_8_Bit1 = EEPROM_32_8_Bit.getInstance();
		let EEPROM_32_8_Bit2 = EEPROM_32_8_Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		// Connect mux
		mux8Bit1.inputs[0].setInput(EEPROM_32_8_Bit1, 0);
		mux8Bit1.inputs[1].setInput(EEPROM_32_8_Bit1, 1);
		mux8Bit1.inputs[2].setInput(EEPROM_32_8_Bit1, 2);
		mux8Bit1.inputs[3].setInput(EEPROM_32_8_Bit1, 3);
		mux8Bit1.inputs[4].setInput(EEPROM_32_8_Bit1, 4);
		mux8Bit1.inputs[5].setInput(EEPROM_32_8_Bit1, 5);
		mux8Bit1.inputs[6].setInput(EEPROM_32_8_Bit1, 6);
		mux8Bit1.inputs[7].setInput(EEPROM_32_8_Bit1, 7);
		mux8Bit1.inputs[8].setInput(EEPROM_32_8_Bit2, 0);
		mux8Bit1.inputs[9].setInput(EEPROM_32_8_Bit2, 1);
		mux8Bit1.inputs[10].setInput(EEPROM_32_8_Bit2, 2);
		mux8Bit1.inputs[11].setInput(EEPROM_32_8_Bit2, 3);
		mux8Bit1.inputs[12].setInput(EEPROM_32_8_Bit2, 4);
		mux8Bit1.inputs[13].setInput(EEPROM_32_8_Bit2, 5);
		mux8Bit1.inputs[14].setInput(EEPROM_32_8_Bit2, 6);
		mux8Bit1.inputs[15].setInput(EEPROM_32_8_Bit2, 7);
		// Connect memory circuits to demuxes
		EEPROM_32_8_Bit1.inputs[0].setInput(demux1, 0);
		EEPROM_32_8_Bit2.inputs[0].setInput(demux1, 1);
		EEPROM_32_8_Bit1.inputs[9].setInput(demux2, 0);
		EEPROM_32_8_Bit2.inputs[9].setInput(demux2, 1);
		// Connect outputs
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_64_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		// Connect write lines
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[1], 1);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[2], 2);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[3], 3);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[4], 4);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[5], 5);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[6], 6);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[7], 7);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[8], 8);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[1], 1);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[2], 2);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[3], 3);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[4], 4);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[5], 5);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[6], 6);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[7], 7);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[8], 8);
		// Connect previous address lines
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[10], 10);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[11], 11);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[12], 12);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[13], 13);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit1.inputs[14], 14);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[10], 10);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[11], 11);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[12], 12);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[13], 13);
		EEPROM_64_8_Bit.connectInputTo(EEPROM_32_8_Bit2.inputs[14], 14);
		// Connect new address line
		EEPROM_64_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_64_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_64_8_Bit.connectInputTo(demux1.inputs[1], 15);
		EEPROM_64_8_Bit.connectInputTo(demux2.inputs[1], 15);
		EEPROM_64_8_Bit.connectInputTo(mux8Bit1.inputs[16], 15);
	}
	let EEPROM_128_8_Bit = customComponent.getInstance("EEPROM_128_8_Bit", 17, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let EEPROM_64_8_Bit1 = EEPROM_64_8_Bit.getInstance();
		let EEPROM_64_8_Bit2 = EEPROM_64_8_Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		// Connect mux
		mux8Bit1.inputs[0].setInput(EEPROM_64_8_Bit1, 0);
		mux8Bit1.inputs[1].setInput(EEPROM_64_8_Bit1, 1);
		mux8Bit1.inputs[2].setInput(EEPROM_64_8_Bit1, 2);
		mux8Bit1.inputs[3].setInput(EEPROM_64_8_Bit1, 3);
		mux8Bit1.inputs[4].setInput(EEPROM_64_8_Bit1, 4);
		mux8Bit1.inputs[5].setInput(EEPROM_64_8_Bit1, 5);
		mux8Bit1.inputs[6].setInput(EEPROM_64_8_Bit1, 6);
		mux8Bit1.inputs[7].setInput(EEPROM_64_8_Bit1, 7);
		mux8Bit1.inputs[8].setInput(EEPROM_64_8_Bit2, 0);
		mux8Bit1.inputs[9].setInput(EEPROM_64_8_Bit2, 1);
		mux8Bit1.inputs[10].setInput(EEPROM_64_8_Bit2, 2);
		mux8Bit1.inputs[11].setInput(EEPROM_64_8_Bit2, 3);
		mux8Bit1.inputs[12].setInput(EEPROM_64_8_Bit2, 4);
		mux8Bit1.inputs[13].setInput(EEPROM_64_8_Bit2, 5);
		mux8Bit1.inputs[14].setInput(EEPROM_64_8_Bit2, 6);
		mux8Bit1.inputs[15].setInput(EEPROM_64_8_Bit2, 7);
		// Connect memory circuits to demuxes
		EEPROM_64_8_Bit1.inputs[0].setInput(demux1, 0);
		EEPROM_64_8_Bit2.inputs[0].setInput(demux1, 1);
		EEPROM_64_8_Bit1.inputs[9].setInput(demux2, 0);
		EEPROM_64_8_Bit2.inputs[9].setInput(demux2, 1);
		// Connect outputs
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_128_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		// Connect write lines
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[1], 1);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[2], 2);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[3], 3);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[4], 4);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[5], 5);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[6], 6);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[7], 7);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[8], 8);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[1], 1);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[2], 2);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[3], 3);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[4], 4);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[5], 5);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[6], 6);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[7], 7);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[8], 8);
		// Connect previous address lines
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[10], 10);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[11], 11);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[12], 12);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[13], 13);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[14], 14);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit1.inputs[15], 15);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[10], 10);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[11], 11);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[12], 12);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[13], 13);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[14], 14);
		EEPROM_128_8_Bit.connectInputTo(EEPROM_64_8_Bit2.inputs[15], 15);
		// Connect new address line
		EEPROM_128_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_128_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_128_8_Bit.connectInputTo(demux1.inputs[1], 16);
		EEPROM_128_8_Bit.connectInputTo(demux2.inputs[1], 16);
		EEPROM_128_8_Bit.connectInputTo(mux8Bit1.inputs[16], 16);
	}
	var EEPROM_256_8_Bit = customComponent.getInstance("EEPROM_2_8_Bit", 18, 8);
	{
		let mux8Bit1 = mux8Bit.getInstance();
		let EEPROM_128_8_Bit1 = EEPROM_128_8_Bit.getInstance();
		let EEPROM_128_8_Bit2 = EEPROM_128_8_Bit.getInstance();
		let demux1 = demux.getInstance();
		let demux2 = demux.getInstance();
		// Connect mux
		mux8Bit1.inputs[0].setInput(EEPROM_128_8_Bit1, 0);
		mux8Bit1.inputs[1].setInput(EEPROM_128_8_Bit1, 1);
		mux8Bit1.inputs[2].setInput(EEPROM_128_8_Bit1, 2);
		mux8Bit1.inputs[3].setInput(EEPROM_128_8_Bit1, 3);
		mux8Bit1.inputs[4].setInput(EEPROM_128_8_Bit1, 4);
		mux8Bit1.inputs[5].setInput(EEPROM_128_8_Bit1, 5);
		mux8Bit1.inputs[6].setInput(EEPROM_128_8_Bit1, 6);
		mux8Bit1.inputs[7].setInput(EEPROM_128_8_Bit1, 7);
		mux8Bit1.inputs[8].setInput(EEPROM_128_8_Bit2, 0);
		mux8Bit1.inputs[9].setInput(EEPROM_128_8_Bit2, 1);
		mux8Bit1.inputs[10].setInput(EEPROM_128_8_Bit2, 2);
		mux8Bit1.inputs[11].setInput(EEPROM_128_8_Bit2, 3);
		mux8Bit1.inputs[12].setInput(EEPROM_128_8_Bit2, 4);
		mux8Bit1.inputs[13].setInput(EEPROM_128_8_Bit2, 5);
		mux8Bit1.inputs[14].setInput(EEPROM_128_8_Bit2, 6);
		mux8Bit1.inputs[15].setInput(EEPROM_128_8_Bit2, 7);
		// Connect memory circuits to demuxes
		EEPROM_128_8_Bit1.inputs[0].setInput(demux1, 0);
		EEPROM_128_8_Bit2.inputs[0].setInput(demux1, 1);
		EEPROM_128_8_Bit1.inputs[9].setInput(demux2, 0);
		EEPROM_128_8_Bit2.inputs[9].setInput(demux2, 1);
		// Connect outputs
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 0, 0);
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 1, 1);
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 2, 2);
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 3, 3);
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 4, 4);
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 5, 5);
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 6, 6);
		EEPROM_256_8_Bit.connectOutputTo(mux8Bit1, 7, 7);
		// Connect write lines
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[1], 1);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[2], 2);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[3], 3);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[4], 4);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[5], 5);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[6], 6);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[7], 7);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[8], 8);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[1], 1);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[2], 2);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[3], 3);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[4], 4);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[5], 5);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[6], 6);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[7], 7);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[8], 8);
		// Connect previous address lines
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[10], 10);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[11], 11);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[12], 12);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[13], 13);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[14], 14);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[15], 15);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit1.inputs[16], 16);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[10], 10);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[11], 11);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[12], 12);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[13], 13);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[14], 14);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[15], 15);
		EEPROM_256_8_Bit.connectInputTo(EEPROM_128_8_Bit2.inputs[16], 16);
		// Connect new address line
		EEPROM_256_8_Bit.connectInputTo(demux1.inputs[0], 0);
		EEPROM_256_8_Bit.connectInputTo(demux2.inputs[0], 9);
		EEPROM_256_8_Bit.connectInputTo(demux1.inputs[1], 17);
		EEPROM_256_8_Bit.connectInputTo(demux2.inputs[1], 17);
		EEPROM_256_8_Bit.connectInputTo(mux8Bit1.inputs[16], 17);
	}
}

// Create half-adder
{
	var halfAdder = customComponent.getInstance("halfAdder", 2, 2);
	let and1 = and.getInstance();
	let xor1 = xor.getInstance();
	halfAdder.connectOutputTo(xor1, 0, 0);
	halfAdder.connectOutputTo(and1, 0, 1);
	halfAdder.connectInputTo(and1.inputs[0], 0);
	halfAdder.connectInputTo(and1.inputs[1], 1);
	halfAdder.connectInputTo(xor1.inputs[0], 0);
	halfAdder.connectInputTo(xor1.inputs[1], 1);
}

// Create full-adder
{
	var fullAdder = customComponent.getInstance("halfAdder", 3, 2);
	let halfAdder1 = halfAdder.getInstance();
	let halfAdder2 = halfAdder.getInstance();
	let xor1 = xor.getInstance();
	xor1.inputs[0].setInput(halfAdder1, 1);
	xor1.inputs[1].setInput(halfAdder2, 1);
	halfAdder1.inputs[1].setInput(halfAdder2, 0);
	fullAdder.connectOutputTo(halfAdder1, 0, 0);
	fullAdder.connectOutputTo(xor1, 0, 1);
	fullAdder.connectInputTo(halfAdder1.inputs[0], 0);
	fullAdder.connectInputTo(halfAdder2.inputs[0], 1);
	fullAdder.connectInputTo(halfAdder2.inputs[1], 2);
}

// Create 8-bit ripple-carry adder
{
	var rippleCarryAdder8Bit = customComponent.getInstance("rippleCarryAdder8Bit", 17, 9);
	let fullAdder1 = fullAdder.getInstance();
	let fullAdder2 = fullAdder.getInstance();
	let fullAdder3 = fullAdder.getInstance();
	let fullAdder4 = fullAdder.getInstance();
	let fullAdder5 = fullAdder.getInstance();
	let fullAdder6 = fullAdder.getInstance();
	let fullAdder7 = fullAdder.getInstance();
	let fullAdder8 = fullAdder.getInstance();
	fullAdder8.inputs[0].setInput(fullAdder7, 1);
	fullAdder7.inputs[0].setInput(fullAdder6, 1);
	fullAdder6.inputs[0].setInput(fullAdder5, 1);
	fullAdder5.inputs[0].setInput(fullAdder4, 1);
	fullAdder4.inputs[0].setInput(fullAdder3, 1);
	fullAdder3.inputs[0].setInput(fullAdder2, 1);
	fullAdder2.inputs[0].setInput(fullAdder1, 1);
	rippleCarryAdder8Bit.connectInputTo(fullAdder1.inputs[0], 0);
	rippleCarryAdder8Bit.connectInputTo(fullAdder1.inputs[1], 1);
	rippleCarryAdder8Bit.connectInputTo(fullAdder2.inputs[1], 2);
	rippleCarryAdder8Bit.connectInputTo(fullAdder3.inputs[1], 3);
	rippleCarryAdder8Bit.connectInputTo(fullAdder4.inputs[1], 4);
	rippleCarryAdder8Bit.connectInputTo(fullAdder5.inputs[1], 5);
	rippleCarryAdder8Bit.connectInputTo(fullAdder6.inputs[1], 6);
	rippleCarryAdder8Bit.connectInputTo(fullAdder7.inputs[1], 7);
	rippleCarryAdder8Bit.connectInputTo(fullAdder8.inputs[1], 8);
	rippleCarryAdder8Bit.connectInputTo(fullAdder1.inputs[2], 9);
	rippleCarryAdder8Bit.connectInputTo(fullAdder2.inputs[2], 10);
	rippleCarryAdder8Bit.connectInputTo(fullAdder3.inputs[2], 11);
	rippleCarryAdder8Bit.connectInputTo(fullAdder4.inputs[2], 12);
	rippleCarryAdder8Bit.connectInputTo(fullAdder5.inputs[2], 13);
	rippleCarryAdder8Bit.connectInputTo(fullAdder6.inputs[2], 14);
	rippleCarryAdder8Bit.connectInputTo(fullAdder7.inputs[2], 15);
	rippleCarryAdder8Bit.connectInputTo(fullAdder8.inputs[2], 16);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder1, 0, 0);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder2, 0, 1);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder3, 0, 2);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder4, 0, 3);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder5, 0, 4);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder6, 0, 5);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder7, 0, 6);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder8, 0, 7);
	rippleCarryAdder8Bit.connectOutputTo(fullAdder8, 1, 8);
}

// Create 8-bit incrementor
{
	var inc8Bit = customComponent.getInstance("inc8Bit", 8, 8);
	let rippleCarryAdder8Bit1 = rippleCarryAdder8Bit.getInstance();
	let outputTrue1 = outputTrue.getInstance();
	rippleCarryAdder8Bit1.inputs[0].setInput(outputTrue1, 0);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 0, 0);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 1, 1);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 2, 2);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 3, 3);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 4, 4);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 5, 5);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 6, 6);
	inc8Bit.connectOutputTo(rippleCarryAdder8Bit1, 7, 7);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[9], 0);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[10], 1);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[11], 2);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[12], 3);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[13], 4);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[14], 5);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[15], 6);
	inc8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[16], 7);
}

// Create 8-bit negator 
{
	var negate8Bit = customComponent.getInstance("negate8Bit", 8, 8);
	let inc8Bit1 = inc8Bit.getInstance();
	let invs = [0, 0, 0, 0, 0, 0, 0, 0].map(function(){return inv.getInstance()});
	inc8Bit1.inputs[0].setInput(invs[0], 0);
	inc8Bit1.inputs[1].setInput(invs[1], 0);
	inc8Bit1.inputs[2].setInput(invs[2], 0);
	inc8Bit1.inputs[3].setInput(invs[3], 0);
	inc8Bit1.inputs[4].setInput(invs[4], 0);
	inc8Bit1.inputs[5].setInput(invs[5], 0);
	inc8Bit1.inputs[6].setInput(invs[6], 0);
	inc8Bit1.inputs[7].setInput(invs[7], 0);
	negate8Bit.connectOutputTo(inc8Bit1, 0, 0);
	negate8Bit.connectOutputTo(inc8Bit1, 1, 1);
	negate8Bit.connectOutputTo(inc8Bit1, 2, 2);
	negate8Bit.connectOutputTo(inc8Bit1, 3, 3);
	negate8Bit.connectOutputTo(inc8Bit1, 4, 4);
	negate8Bit.connectOutputTo(inc8Bit1, 5, 5);
	negate8Bit.connectOutputTo(inc8Bit1, 6, 6);
	negate8Bit.connectOutputTo(inc8Bit1, 7, 7);
	negate8Bit.connectInputTo(invs[0].inputs[0], 0);
	negate8Bit.connectInputTo(invs[1].inputs[0], 1);
	negate8Bit.connectInputTo(invs[2].inputs[0], 2);
	negate8Bit.connectInputTo(invs[3].inputs[0], 3);
	negate8Bit.connectInputTo(invs[4].inputs[0], 4);
	negate8Bit.connectInputTo(invs[5].inputs[0], 5);
	negate8Bit.connectInputTo(invs[6].inputs[0], 6);
	negate8Bit.connectInputTo(invs[7].inputs[0], 7);
}

// Create 8-bit subtractor
{
	var subtractor8Bit = customComponent.getInstance("subtractor8Bit", 16, 8);
	let rippleCarryAdder8Bit1 = rippleCarryAdder8Bit.getInstance();
	let negate8Bit1 = negate8Bit.getInstance();
	rippleCarryAdder8Bit1.inputs[1].setInput(negate8Bit1, 0);
	rippleCarryAdder8Bit1.inputs[2].setInput(negate8Bit1, 1);
	rippleCarryAdder8Bit1.inputs[3].setInput(negate8Bit1, 2);
	rippleCarryAdder8Bit1.inputs[4].setInput(negate8Bit1, 3);
	rippleCarryAdder8Bit1.inputs[5].setInput(negate8Bit1, 4);
	rippleCarryAdder8Bit1.inputs[6].setInput(negate8Bit1, 5);
	rippleCarryAdder8Bit1.inputs[7].setInput(negate8Bit1, 6);
	rippleCarryAdder8Bit1.inputs[8].setInput(negate8Bit1, 7);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 0, 0);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 1, 1);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 2, 2);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 3, 3);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 4, 4);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 5, 5);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 6, 6);
	subtractor8Bit.connectOutputTo(rippleCarryAdder8Bit1, 7, 7);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[0], 0);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[1], 1);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[2], 2);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[3], 3);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[4], 4);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[5], 5);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[6], 6);
	subtractor8Bit.connectInputTo(negate8Bit1.inputs[7], 7);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[9], 8);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[10], 9);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[11], 10);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[12], 11);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[13], 12);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[14], 13);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[15], 14);
	subtractor8Bit.connectInputTo(rippleCarryAdder8Bit1.inputs[16], 15);
} */