{
    var inv = customComponent(1, 1);
    let nand0 = new nand();
    inv.sendInputTo(nand0, 0, 0);
    inv.sendInputTo(nand0, 1, 0);
    inv.takeOutputFrom(nand0, 0, 0);
}

{
    var and = customComponent(2, 1);
    let nand0 = new nand();
    let inv0 = new inv();
    inv0.setInputComp(nand0, 0, 0);
    and.sendInputTo(nand0, 0, 0);
    and.sendInputTo(nand0, 1, 1);
    and.takeOutputFrom(inv0, 0, 0);
}

{
    var or = customComponent(2, 1);
    let inv0 = new inv();
    let inv1 = new inv();
    let nand0 = new nand();
    nand0.setInputComp(inv0, 0, 0);
    nand0.setInputComp(inv1, 0, 1);
    or.sendInputTo(inv0, 0, 0);
    or.sendInputTo(inv1, 0, 1);
    or.takeOutputFrom(nand0, 0, 0);
}

{
    var or8Bit = customComponent(16, 8);
    let or0 = new or();
    let or1 = new or();
    let or2 = new or();
    let or3 = new or();
    let or4 = new or();
    let or5 = new or();
    let or6 = new or();
    let or7 = new or();

    or8Bit.sendInputTo(or0, 0, 0);
    or8Bit.sendInputTo(or1, 0, 1);
    or8Bit.sendInputTo(or2, 0, 2);
    or8Bit.sendInputTo(or3, 0, 3);
    or8Bit.sendInputTo(or4, 0, 4);
    or8Bit.sendInputTo(or5, 0, 5);
    or8Bit.sendInputTo(or6, 0, 6);
    or8Bit.sendInputTo(or7, 0, 7);

    or8Bit.sendInputTo(or0, 1, 8);
    or8Bit.sendInputTo(or1, 1, 9);
    or8Bit.sendInputTo(or2, 1, 10);
    or8Bit.sendInputTo(or3, 1, 11);
    or8Bit.sendInputTo(or4, 1, 12);
    or8Bit.sendInputTo(or5, 1, 13);
    or8Bit.sendInputTo(or6, 1, 14);
    or8Bit.sendInputTo(or7, 1, 15);

    or8Bit.takeOutputFrom(or0, 0, 0);
    or8Bit.takeOutputFrom(or1, 0, 1);
    or8Bit.takeOutputFrom(or2, 0, 2);
    or8Bit.takeOutputFrom(or3, 0, 3);
    or8Bit.takeOutputFrom(or4, 0, 4);
    or8Bit.takeOutputFrom(or5, 0, 5);
    or8Bit.takeOutputFrom(or6, 0, 6);
    or8Bit.takeOutputFrom(or7, 0, 7);
}

{
    var nor = customComponent(2, 1);
    let inv0 = new inv();
    let or0 = new or();
    inv0.setInputComp(or0, 0, 0);
    nor.sendInputTo(or0, 0, 0);
    nor.sendInputTo(or0, 1, 1);
    nor.takeOutputFrom(inv0, 0, 0);
}

{
    var xor = customComponent(2, 1);
    let nand0 = new nand();
    let nand1 = new nand();
    let nand2 = new nand();
    let nand3 = new nand();
    let nand4 = new nand();
    nand4.setInputComp(nand2, 0, 0);
    nand4.setInputComp(nand3, 0, 1);
    nand3.setInputComp(nand1, 0, 1);
    nand2.setInputComp(nand0, 0, 0);
    xor.sendInputTo(nand2, 1, 1);
    xor.sendInputTo(nand3, 0, 0);
    xor.sendInputTo(nand0, 0, 0);
    xor.sendInputTo(nand0, 1, 1);
    xor.sendInputTo(nand1, 0, 0);
    xor.sendInputTo(nand1, 1, 1);
    xor.takeOutputFrom(nand4, 0, 0);
}

{
    var xnor = customComponent(2, 1);
    let nand0 = new nand();
    let nand1 = new nand();
    let or0 = new or();
    nand1.setInputComp(nand0, 0, 0);
    nand1.setInputComp(or0, 0, 1);
    xnor.sendInputTo(nand0, 0, 0);
    xnor.sendInputTo(nand0, 1, 1);
    xnor.sendInputTo(or0, 0, 0);
    xnor.sendInputTo(or0, 1, 1);
    xnor.takeOutputFrom(nand1, 0, 0);
}

{
    var mux = customComponent(3, 1);
    let inv0 = new inv();
    let nand0 = new nand();
    let nand1 = new nand();
    let nand2 = new nand();
    nand0.setInputComp(inv0, 0, 0);
    nand2.setInputComp(nand0, 0, 0);
    nand2.setInputComp(nand1, 0, 1);
    mux.sendInputTo(inv0, 0, 0);
    mux.sendInputTo(nand1, 0, 0);
    mux.sendInputTo(nand0, 1, 1);
    mux.sendInputTo(nand1, 1, 2);
    mux.takeOutputFrom(nand2, 0, 0);
}

{
    var mux8Bit = customComponent(17, 8);
    let mux0 = new mux();
    let mux1 = new mux();
    let mux2 = new mux();
    let mux3 = new mux();
    let mux4 = new mux();
    let mux5 = new mux();
    let mux6 = new mux();
    let mux7 = new mux();

    mux8Bit.sendInputTo(mux0, 0, 0);
    mux8Bit.sendInputTo(mux1, 0, 0);
    mux8Bit.sendInputTo(mux2, 0, 0);
    mux8Bit.sendInputTo(mux3, 0, 0);
    mux8Bit.sendInputTo(mux4, 0, 0);
    mux8Bit.sendInputTo(mux5, 0, 0);
    mux8Bit.sendInputTo(mux6, 0, 0);
    mux8Bit.sendInputTo(mux7, 0, 0);

    mux8Bit.sendInputTo(mux0, 1, 1);
    mux8Bit.sendInputTo(mux1, 1, 2);
    mux8Bit.sendInputTo(mux2, 1, 3);
    mux8Bit.sendInputTo(mux3, 1, 4);
    mux8Bit.sendInputTo(mux4, 1, 5);
    mux8Bit.sendInputTo(mux5, 1, 6);
    mux8Bit.sendInputTo(mux6, 1, 7);
    mux8Bit.sendInputTo(mux7, 1, 8);

    mux8Bit.sendInputTo(mux0, 2, 9);
    mux8Bit.sendInputTo(mux1, 2, 10);
    mux8Bit.sendInputTo(mux2, 2, 11);
    mux8Bit.sendInputTo(mux3, 2, 12);
    mux8Bit.sendInputTo(mux4, 2, 13);
    mux8Bit.sendInputTo(mux5, 2, 14);
    mux8Bit.sendInputTo(mux6, 2, 15);
    mux8Bit.sendInputTo(mux7, 2, 16);

    mux8Bit.takeOutputFrom(mux0, 0, 0);
    mux8Bit.takeOutputFrom(mux1, 0, 1);
    mux8Bit.takeOutputFrom(mux2, 0, 2);
    mux8Bit.takeOutputFrom(mux3, 0, 3);
    mux8Bit.takeOutputFrom(mux4, 0, 4);
    mux8Bit.takeOutputFrom(mux5, 0, 5);
    mux8Bit.takeOutputFrom(mux6, 0, 6);
    mux8Bit.takeOutputFrom(mux7, 0, 7);
}

{
    var demux = customComponent(2, 2);
    let and0 = new and();
    let and1 = new and();
    let inv0 = new inv();
    and0.setInputComp(inv0, 0, 0);
    demux.sendInputTo(inv0, 0, 0);
    demux.sendInputTo(and0, 1, 1);
    demux.sendInputTo(and1, 0, 0);
    demux.sendInputTo(and1, 1, 1);
    demux.takeOutputFrom(and0, 0, 0);
    demux.takeOutputFrom(and1, 0, 1);
}

{
    var latch = customComponent(2, 1);
    let mux0 = new mux();
    mux0.setInputComp(mux0, 0, 1);
    latch.sendInputTo(mux0, 0, 0);
    latch.sendInputTo(mux0, 2, 1);
    latch.takeOutputFrom(mux0, 0, 0);
}

{
    var dFlipFlop = customComponent(3, 1);
    let latch0 = new latch();
    let latch1 = new latch();
    let and0 = new and();
    let inv0 = new inv();
    latch1.setInputComp(latch0, 0, 1);
    latch0.setInputComp(and0, 0, 0);
    and0.setInputComp(inv0, 0, 1);
    dFlipFlop.sendInputTo(and0, 0, 0);
    dFlipFlop.sendInputTo(latch0, 1, 1);
    dFlipFlop.sendInputTo(latch1, 0, 2);
    dFlipFlop.sendInputTo(inv0, 0, 2);
    dFlipFlop.takeOutputFrom(latch1, 0, 0);
}

{
    var register8Bit = customComponent(10, 8);
    let dFlipFlop0 = new dFlipFlop();
    let dFlipFlop1 = new dFlipFlop();
    let dFlipFlop2 = new dFlipFlop();
    let dFlipFlop3 = new dFlipFlop();
    let dFlipFlop4 = new dFlipFlop();
    let dFlipFlop5 = new dFlipFlop();
    let dFlipFlop6 = new dFlipFlop();
    let dFlipFlop7 = new dFlipFlop();

    register8Bit.sendInputTo(dFlipFlop0, 1, 1);
    register8Bit.sendInputTo(dFlipFlop1, 1, 2);
    register8Bit.sendInputTo(dFlipFlop2, 1, 3);
    register8Bit.sendInputTo(dFlipFlop3, 1, 4);
    register8Bit.sendInputTo(dFlipFlop4, 1, 5);
    register8Bit.sendInputTo(dFlipFlop5, 1, 6);
    register8Bit.sendInputTo(dFlipFlop6, 1, 7);
    register8Bit.sendInputTo(dFlipFlop7, 1, 8);

    register8Bit.sendInputTo(dFlipFlop0, 0, 0);
    register8Bit.sendInputTo(dFlipFlop1, 0, 0);
    register8Bit.sendInputTo(dFlipFlop2, 0, 0);
    register8Bit.sendInputTo(dFlipFlop3, 0, 0);
    register8Bit.sendInputTo(dFlipFlop4, 0, 0);
    register8Bit.sendInputTo(dFlipFlop5, 0, 0);
    register8Bit.sendInputTo(dFlipFlop6, 0, 0);
    register8Bit.sendInputTo(dFlipFlop7, 0, 0);

    register8Bit.sendInputTo(dFlipFlop0, 2, 9);
    register8Bit.sendInputTo(dFlipFlop1, 2, 9);
    register8Bit.sendInputTo(dFlipFlop2, 2, 9);
    register8Bit.sendInputTo(dFlipFlop3, 2, 9);
    register8Bit.sendInputTo(dFlipFlop4, 2, 9);
    register8Bit.sendInputTo(dFlipFlop5, 2, 9);
    register8Bit.sendInputTo(dFlipFlop6, 2, 9);
    register8Bit.sendInputTo(dFlipFlop7, 2, 9);

    register8Bit.takeOutputFrom(dFlipFlop0, 0, 0);
    register8Bit.takeOutputFrom(dFlipFlop1, 0, 1);
    register8Bit.takeOutputFrom(dFlipFlop2, 0, 2);
    register8Bit.takeOutputFrom(dFlipFlop3, 0, 3);
    register8Bit.takeOutputFrom(dFlipFlop4, 0, 4);
    register8Bit.takeOutputFrom(dFlipFlop5, 0, 5);
    register8Bit.takeOutputFrom(dFlipFlop6, 0, 6);
    register8Bit.takeOutputFrom(dFlipFlop7, 0, 7);
}

{
    var ram8Bit1a = customComponent(11, 8);
    let mux8Bit0 = new mux8Bit();
    let memCell0 = new register8Bit();
    let memCell1 = new register8Bit();
    let storeDemux = new demux();
    let clockDemux = new demux();

    mux8Bit0.setInputComp(memCell0, 0, 1);
    mux8Bit0.setInputComp(memCell0, 1, 2);
    mux8Bit0.setInputComp(memCell0, 2, 3);
    mux8Bit0.setInputComp(memCell0, 3, 4);
    mux8Bit0.setInputComp(memCell0, 4, 5);
    mux8Bit0.setInputComp(memCell0, 5, 6);
    mux8Bit0.setInputComp(memCell0, 6, 7);
    mux8Bit0.setInputComp(memCell0, 7, 8);

    mux8Bit0.setInputComp(memCell1, 0, 9);
    mux8Bit0.setInputComp(memCell1, 1, 10);
    mux8Bit0.setInputComp(memCell1, 2, 11);
    mux8Bit0.setInputComp(memCell1, 3, 12);
    mux8Bit0.setInputComp(memCell1, 4, 13);
    mux8Bit0.setInputComp(memCell1, 5, 14);
    mux8Bit0.setInputComp(memCell1, 6, 15);
    mux8Bit0.setInputComp(memCell1, 7, 16);

    memCell0.setInputComp(storeDemux, 0, 0);
    memCell1.setInputComp(storeDemux, 1, 0);
    memCell0.setInputComp(clockDemux, 0, 9);
    memCell1.setInputComp(clockDemux, 1, 9);

    ram8Bit1a.sendInputTo(mux8Bit0, 0, 0);
    ram8Bit1a.sendInputTo(storeDemux, 0, 0);
    ram8Bit1a.sendInputTo(storeDemux, 1, 1);
    ram8Bit1a.sendInputTo(clockDemux, 0, 0);
    ram8Bit1a.sendInputTo(clockDemux, 1, 10);

    ram8Bit1a.sendInputTo(memCell0, 1, 2);
    ram8Bit1a.sendInputTo(memCell0, 2, 3);
    ram8Bit1a.sendInputTo(memCell0, 3, 4);
    ram8Bit1a.sendInputTo(memCell0, 4, 5);
    ram8Bit1a.sendInputTo(memCell0, 5, 6);
    ram8Bit1a.sendInputTo(memCell0, 6, 7);
    ram8Bit1a.sendInputTo(memCell0, 7, 8);
    ram8Bit1a.sendInputTo(memCell0, 8, 9);

    ram8Bit1a.sendInputTo(memCell1, 1, 2);
    ram8Bit1a.sendInputTo(memCell1, 2, 3);
    ram8Bit1a.sendInputTo(memCell1, 3, 4);
    ram8Bit1a.sendInputTo(memCell1, 4, 5);
    ram8Bit1a.sendInputTo(memCell1, 5, 6);
    ram8Bit1a.sendInputTo(memCell1, 6, 7);
    ram8Bit1a.sendInputTo(memCell1, 7, 8);
    ram8Bit1a.sendInputTo(memCell1, 8, 9);

    ram8Bit1a.takeOutputFrom(mux8Bit0, 0, 0);
    ram8Bit1a.takeOutputFrom(mux8Bit0, 1, 1);
    ram8Bit1a.takeOutputFrom(mux8Bit0, 2, 2);
    ram8Bit1a.takeOutputFrom(mux8Bit0, 3, 3);
    ram8Bit1a.takeOutputFrom(mux8Bit0, 4, 4);
    ram8Bit1a.takeOutputFrom(mux8Bit0, 5, 5);
    ram8Bit1a.takeOutputFrom(mux8Bit0, 6, 6);
    ram8Bit1a.takeOutputFrom(mux8Bit0, 7, 7);
}

/*var nand0 = new nand();
var toggleable0 = new toggleable();
var toggleable1 = new toggleable();
nand0.setInputComp(toggleable0, 0, 0);
nand0.setInputComp(toggleable1, 0, 1);*/

var latch0 = new latch();
var toggleable0 = new toggleable();
var toggleable1 = new toggleable();
latch0.setInputComp(toggleable0, 0, 0);
latch0.setInputComp(toggleable1, 0, 1);