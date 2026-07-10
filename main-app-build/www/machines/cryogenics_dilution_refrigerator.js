import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted, gold, brass } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.15,
        envMapIntensity: 2.0
    });
    const glowingCopper = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x331100,
        emissiveIntensity: 0.6
    });
    const brightChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.05
    });
    const frostedGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.95,
        transparent: true,
        opacity: 0.4,
        ior: 1.5,
        thickness: 0.5
    });
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9
    });
    const superConductorMat = new THREE.MeshStandardMaterial({
        color: 0x8888ff,
        metalness: 0.8,
        roughness: 0.4,
        emissive: 0x000033,
        emissiveIntensity: 1.0
    });

    const meshes = {};

    // Utility for adding hex bolts to flanges
    const addBolts = (plateRadius, yPos, thickness, count) => {
        const bolts = new THREE.Group();
        const boltGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 6);
        for(let i=0; i<count; i++) {
            const angle = (i/count) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, brightChrome);
            bolt.position.set((plateRadius - 1.5) * Math.cos(angle), yPos + thickness/2, (plateRadius - 1.5) * Math.sin(angle));
            bolts.add(bolt);
            
            const nut = new THREE.Mesh(boltGeo, brightChrome);
            nut.position.set((plateRadius - 1.5) * Math.cos(angle), yPos - thickness/2, (plateRadius - 1.5) * Math.sin(angle));
            bolts.add(nut);
        }
        return bolts;
    };

    // 1. Top Flange (Room Temperature Plate)
    const topPlateGroup = new THREE.Group();
    const topPlateGeo = new THREE.CylinderGeometry(18, 18, 3, 64);
    const topPlate = new THREE.Mesh(topPlateGeo, darkSteel);
    topPlate.position.set(0, 40, 0);
    topPlateGroup.add(topPlate);
    topPlateGroup.add(addBolts(18, 40, 3, 32));
    
    // Gas handling manifold on top plate
    const manifoldGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const pipeGeo = new THREE.CylinderGeometry(0.6, 0.6, 8, 16);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(0, 42.5 + i*1.2, 8);
        manifoldGroup.add(pipe);
        
        const valveGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 6); // Hex valve handle
        const valve = new THREE.Mesh(valveGeo, brass);
        valve.position.set(-3, 42.5 + i*1.2, 8);
        valve.rotation.x = Math.PI / 2;
        manifoldGroup.add(valve);
    }
    topPlateGroup.add(manifoldGroup);
    
    group.add(topPlateGroup);
    meshes.topPlateGroup = topPlateGroup;

    parts.push({
        name: "Room Temperature Flange & Gas Manifold",
        description: "The 300K top plate interfacing with the room environment, supporting all cryogenic stages and routing helium isotopes.",
        material: "Stainless Steel / Brass",
        function: "Structural support, vacuum sealing, and high-pressure gas distribution for the dilution refrigerator.",
        assemblyOrder: 1,
        connections: ["Support Frame", "Vacuum Canister", "Pulse Tube Refrigerator"],
        failureEffect: "Vacuum leak causing immediate thermal collapse of the cryostat.",
        cascadeFailures: ["Complete warmup", "Helium mixture loss to atmosphere"],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: 0, y: 65, z: 0}
    });

    // 2. Pulse Tube Refrigerator (PTR) Head
    const ptrGroup = new THREE.Group();
    const ptrBodyGeo = new THREE.CylinderGeometry(2.5, 2.5, 12, 32);
    const ptrBody = new THREE.Mesh(ptrBodyGeo, chrome);
    ptrBody.position.set(7, 46, 0);
    ptrGroup.add(ptrBody);
    
    // PTR cooling fins (Motor assembly)
    for(let i=0; i<15; i++) {
        const finGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.3, 32);
        const fin = new THREE.Mesh(finGeo, darkSteel);
        fin.position.set(7, 42 + i*0.8, 0);
        ptrGroup.add(fin);
    }
    
    // Rotary valve stepper motor
    const motorGeo = new THREE.BoxGeometry(4, 5, 4);
    const motor = new THREE.Mesh(motorGeo, steel);
    motor.position.set(7, 54, 0);
    ptrGroup.add(motor);

    group.add(ptrGroup);
    meshes.ptrGroup = ptrGroup;

    parts.push({
        name: "Pulse Tube Refrigerator (PTR) Head",
        description: "A mechanical cryocooler providing initial cooling power down to 4K using acoustic gas pulses.",
        material: "Chrome / Dark Steel / Neodymium",
        function: "Pre-cools the system and condenses the circulating helium mixture without consuming liquid cryogens.",
        assemblyOrder: 2,
        connections: ["Room Temperature Flange", "4K Plate", "Compressor Lines"],
        failureEffect: "Loss of 4K and 50K cooling stages.",
        cascadeFailures: ["Thermal runaway in lower stages", "Mixture boiling"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 20, y: 50, z: 0}
    });

    // 3. 50K Plate & Shield
    const plate50KGroup = new THREE.Group();
    const plate50KGeo = new THREE.CylinderGeometry(16, 16, 2, 64);
    const plate50K = new THREE.Mesh(plate50KGeo, copper);
    plate50K.position.set(0, 25, 0);
    plate50KGroup.add(plate50K);
    plate50KGroup.add(addBolts(16, 25, 2, 24));
    
    // Support pillars from RT to 50K
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 15, 16);
        const pillar = new THREE.Mesh(pillarGeo, glass); // G10 fiberglass
        pillar.position.set(13 * Math.cos(angle), 32.5, 13 * Math.sin(angle));
        plate50KGroup.add(pillar);
    }

    group.add(plate50KGroup);
    meshes.plate50KGroup = plate50KGroup;

    parts.push({
        name: "50K Radiation Shield Plate",
        description: "First stage cooling plate thermally coupled to the first stage of the PTR.",
        material: "High-Conductivity Copper",
        function: "Intercepts room temperature blackbody radiation and pre-cools wiring and coaxial cables.",
        assemblyOrder: 3,
        connections: ["PTR First Stage", "G10 Supports", "Radiation Shield"],
        failureEffect: "Excessive heat load on 4K stage.",
        cascadeFailures: ["4K plate overheating", "Quenching of superconducting components"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 35, z: 20}
    });

    // 4. 4K Plate
    const plate4KGroup = new THREE.Group();
    const plate4KGeo = new THREE.CylinderGeometry(15, 15, 2, 64);
    const plate4K = new THREE.Mesh(plate4KGeo, goldMaterial);
    plate4K.position.set(0, 10, 0);
    plate4KGroup.add(plate4K);
    plate4KGroup.add(addBolts(15, 10, 2, 24));

    // Pillars 50K to 4K
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2 + 0.3;
        const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 13, 16);
        const pillar = new THREE.Mesh(pillarGeo, glass);
        pillar.position.set(12 * Math.cos(angle), 17.5, 12 * Math.sin(angle));
        plate4KGroup.add(pillar);
    }

    group.add(plate4KGroup);
    meshes.plate4KGroup = plate4KGroup;

    parts.push({
        name: "4K Base Plate",
        description: "Highly polished gold-plated copper flange providing a 4 Kelvin environment.",
        material: "Gold-plated OFHC Copper",
        function: "Base temperature for conventional superconducting electronics and liquefies returning He3.",
        assemblyOrder: 4,
        connections: ["50K Plate", "Condensing Line", "Still Pumping Tube"],
        failureEffect: "Inability to condense He3 mixture.",
        cascadeFailures: ["Dilution cooling fails entirely", "Loss of base temperature"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 25}
    });

    // 5. The Still
    const stillGroup = new THREE.Group();
    const stillGeo = new THREE.CylinderGeometry(7, 7, 6, 32);
    const still = new THREE.Mesh(stillGeo, glowingCopper);
    stillGroup.add(still);
    
    // Still Heater Coil
    for(let i=0; i<8; i++) {
        const heaterGeo = new THREE.TorusGeometry(7.2, 0.15, 16, 64);
        const heater = new THREE.Mesh(heaterGeo, glowingBlue);
        heater.rotation.x = Math.PI / 2;
        heater.position.y = -2.5 + i*0.7;
        stillGroup.add(heater);
    }
    
    stillGroup.position.set(0, -2, 0);
    group.add(stillGroup);
    meshes.stillGroup = stillGroup;

    // Pillars 4K to Still
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 9, 16);
        const pillar = new THREE.Mesh(pillarGeo, darkSteel); // Graphite/Steel
        pillar.position.set(10 * Math.cos(angle), 4.5, 10 * Math.sin(angle));
        group.add(pillar);
    }

    parts.push({
        name: "The Still & RuO2 Heater",
        description: "Evaporator chamber where He3 is distilled from the liquid mixture using precise heating.",
        material: "Copper with Resistive Superconducting Heater",
        function: "Pumps away He3 gas to drive the continuous osmotic circulation in the dilution circuit.",
        assemblyOrder: 5,
        connections: ["Still Pumping Line", "Continuous Heat Exchanger"],
        failureEffect: "Circulation of mixture stops.",
        cascadeFailures: ["Loss of cooling power at mixing chamber"],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: -25, y: -2, z: 0}
    });

    // 6. Continuous Heat Exchanger (Spiraling Tubes)
    const hexGroup = new THREE.Group();
    
    // Outer tube (dilute phase)
    const curvePoints = [];
    for(let i = 0; i <= 300; i++) {
        const t = i / 300;
        const radius = 3.5 + t * 2.5; 
        const y = -6 - t * 12;
        const angle = t * Math.PI * 30; // 15 turns
        curvePoints.push(new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle)));
    }
    const hexCurve = new THREE.CatmullRomCurve3(curvePoints);
    const hexGeo = new THREE.TubeGeometry(hexCurve, 300, 0.3, 16, false);
    const hexMesh = new THREE.Mesh(hexGeo, brightChrome);
    hexGroup.add(hexMesh);
    
    // Inner tube / counter-flow (concentrated phase) - coiled tightly alongside
    const curvePoints2 = [];
    for(let i = 0; i <= 300; i++) {
        const t = i / 300;
        const radius = 3.5 + t * 2.5;
        const y = -6.2 - t * 12;
        const angle = t * Math.PI * 30 + 0.2; 
        curvePoints2.push(new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle)));
    }
    const hexCurve2 = new THREE.CatmullRomCurve3(curvePoints2);
    const hexGeo2 = new THREE.TubeGeometry(hexCurve2, 300, 0.15, 16, false);
    const hexMesh2 = new THREE.Mesh(hexGeo2, goldMaterial);
    hexGroup.add(hexMesh2);
    
    group.add(hexGroup);
    meshes.hexGroup = hexGroup;

    parts.push({
        name: "Continuous Counter-Flow Heat Exchangers",
        description: "Coiled concentric tubes facilitating counter-flow heat exchange between incoming and outgoing isotopes.",
        material: "Silver / Cupronickel Alloys",
        function: "Cools incoming concentrated He3 using the cold returning dilute phase from the mixing chamber.",
        assemblyOrder: 6,
        connections: ["Still", "Cold Plate", "Step Heat Exchangers"],
        failureEffect: "Severe heat leak, inability to reach sub-100mK temperatures.",
        cascadeFailures: ["Warming of the mixing chamber"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -25}
    });

    // 7. Cold Plate (100 mK)
    const coldPlateGroup = new THREE.Group();
    const coldPlateGeo = new THREE.CylinderGeometry(12, 12, 1.5, 64);
    const coldPlate = new THREE.Mesh(coldPlateGeo, goldMaterial);
    coldPlate.position.set(0, -18, 0);
    coldPlateGroup.add(coldPlate);
    coldPlateGroup.add(addBolts(12, -18, 1.5, 16));

    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.2;
        const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 14.5, 16);
        const pillar = new THREE.Mesh(pillarGeo, glass);
        pillar.position.set(9 * Math.cos(angle), -10.75, 9 * Math.sin(angle));
        coldPlateGroup.add(pillar);
    }

    group.add(coldPlateGroup);
    meshes.coldPlateGroup = coldPlateGroup;

    parts.push({
        name: "100mK Cold Plate",
        description: "Thermal intercept plate located midway down the continuous heat exchanger stack.",
        material: "Gold-plated Copper",
        function: "Thermalizes wiring and high-frequency coaxial cables before they reach the ultra-cold mixing chamber.",
        assemblyOrder: 7,
        connections: ["Still Supports", "Mixing Chamber Supports"],
        failureEffect: "Heat load transferred directly to the mixing chamber.",
        cascadeFailures: ["Loss of base temperature", "Qubit decoherence"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -25, y: -18, z: 25}
    });

    // 8. Sintered Step Heat Exchangers
    const stepHexGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        // Hexagonal block bodies
        const stepGeo = new THREE.CylinderGeometry(4.5, 4.5, 1.5, 6);
        const step = new THREE.Mesh(stepGeo, goldMaterial);
        step.position.set(0, -22 - i*3, 0);
        stepHexGroup.add(step);
        
        // Connecting pipes (manifold style)
        if (i < 4) {
            const pipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
            const pipeL = new THREE.Mesh(pipeGeo, brightChrome);
            pipeL.position.set(2.5, -23.5 - i*3, 0);
            stepHexGroup.add(pipeL);
            
            const pipeR = new THREE.Mesh(pipeGeo, brightChrome);
            pipeR.position.set(-2.5, -23.5 - i*3, 0);
            stepHexGroup.add(pipeR);
        }
    }
    group.add(stepHexGroup);
    meshes.stepHexGroup = stepHexGroup;

    parts.push({
        name: "Sintered Silver Step Heat Exchangers",
        description: "Massive solid blocks packed with microscopic sintered silver powder to maximize surface area.",
        material: "Gold-plated Silver",
        function: "Overcomes Kapitza boundary resistance to cool the mixture to ultra-low temperatures.",
        assemblyOrder: 8,
        connections: ["Continuous Heat Exchanger", "Mixing Chamber"],
        failureEffect: "Thermal bottleneck, base temperature stalls around 30mK.",
        cascadeFailures: ["Quantum decoherence from excess thermal phonons"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 25, y: -25, z: 0}
    });

    // 9. Mixing Chamber
    const mxChamberGroup = new THREE.Group();
    
    // Intricate flanged body
    const mxBodyGeo = new THREE.CylinderGeometry(9, 9, 6, 64);
    const mxBody = new THREE.Mesh(mxBodyGeo, goldMaterial);
    mxChamberGroup.add(mxBody);
    
    const mxFlangeGeo = new THREE.CylinderGeometry(10.5, 10.5, 1, 64);
    const mxFlange = new THREE.Mesh(mxFlangeGeo, goldMaterial);
    mxFlange.position.y = 3;
    mxChamberGroup.add(mxFlange);
    
    // Intricate ridges / cooling fins on Mixing Chamber
    for(let i=0; i<6; i++) {
        const ridgeGeo = new THREE.TorusGeometry(9.2, 0.25, 16, 64);
        const ridge = new THREE.Mesh(ridgeGeo, brightChrome);
        ridge.rotation.x = Math.PI / 2;
        ridge.position.y = -2 + i*0.8;
        mxChamberGroup.add(ridge);
    }
    
    mxChamberGroup.position.set(0, -38, 0);
    mxChamberGroup.add(addBolts(10.5, 3, 1, 16));
    
    group.add(mxChamberGroup);
    meshes.mxChamberGroup = mxChamberGroup;

    // Pillars Cold Plate to Mixing Chamber
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.7;
        const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 18, 16);
        const pillar = new THREE.Mesh(pillarGeo, darkSteel); // Graphite
        pillar.position.set(8 * Math.cos(angle), -28, 8 * Math.sin(angle));
        group.add(pillar);
    }

    parts.push({
        name: "15mK Mixing Chamber",
        description: "The coldest part of the refrigerator, housing the phase boundary.",
        material: "High-purity OFHC Copper / Gold Plated",
        function: "Phase separation of He3/He4 occurs here, causing immense endothermic cooling as He3 crosses the boundary.",
        assemblyOrder: 9,
        connections: ["Step Heat Exchangers", "Quantum Processor Package"],
        failureEffect: "Absolute failure to cool the quantum processor.",
        cascadeFailures: ["Complete loss of experimental capability"],
        originalPosition: {x: 0, y: -38, z: 0},
        explodedPosition: {x: 0, y: -38, z: 30}
    });

    // 10. Quantum Processor Package & Magnetic Shield
    const qpuGroup = new THREE.Group();
    
    // Magnetic Shield (Cryoperm)
    const shieldGeo = new THREE.CylinderGeometry(6, 6, 12, 64);
    const shield = new THREE.Mesh(shieldGeo, darkSteel);
    qpuGroup.add(shield);
    
    // Glowing QPU chip inside (protruding slightly for visual effect)
    const chipGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const chip = new THREE.Mesh(chipGeo, glowingBlue);
    chip.position.set(0, -4, 0);
    qpuGroup.add(chip);
    
    // Substrate / carrier
    const carrierGeo = new THREE.CylinderGeometry(4.5, 4.5, 1, 32);
    const carrier = new THREE.Mesh(carrierGeo, goldMaterial);
    carrier.position.set(0, -4.5, 0);
    qpuGroup.add(carrier);
    
    // Micro-coaxial wiring to the chip
    for(let i=0; i<8; i++) {
        const wGeo = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
        const wire = new THREE.Mesh(wGeo, superConductorMat);
        const a = (i/8)*Math.PI*2;
        wire.position.set(3*Math.cos(a), -1, 3*Math.sin(a));
        qpuGroup.add(wire);
    }
    
    qpuGroup.position.set(0, -48, 0);
    group.add(qpuGroup);
    meshes.qpuGroup = qpuGroup;

    parts.push({
        name: "Quantum Processor & Cryoperm Shield",
        description: "Superconducting transmon qubit array housed inside a nested magnetic shield.",
        material: "Cryoperm, Silicon, Superconducting Aluminum, Niobium",
        function: "Performs quantum computations while fiercely shielded from external magnetic fields and thermal noise.",
        assemblyOrder: 10,
        connections: ["Mixing Chamber", "Microwave Coaxial Cables"],
        failureEffect: "Qubit decoherence due to stray magnetic flux or thermal phonons.",
        cascadeFailures: ["Total loss of quantum fidelity", "Bit-flip errors"],
        originalPosition: {x: 0, y: -48, z: 0},
        explodedPosition: {x: 0, y: -65, z: 0}
    });

    // 11. Complex Microwave Coaxial Cable Array
    const coaxGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const coaxCurvePts = [
            new THREE.Vector3(15 * Math.cos(angle), 40, 15 * Math.sin(angle)), // RT
            new THREE.Vector3(14 * Math.cos(angle), 25, 14 * Math.sin(angle)), // 50K
            new THREE.Vector3(13 * Math.cos(angle), 10, 13 * Math.sin(angle)), // 4K
            new THREE.Vector3(10 * Math.cos(angle), -2, 10 * Math.sin(angle)), // Still
            new THREE.Vector3(9 * Math.cos(angle), -18, 9 * Math.sin(angle)),  // Cold Plate
            new THREE.Vector3(7 * Math.cos(angle), -35, 7 * Math.sin(angle)),  // MX
            new THREE.Vector3(5 * Math.cos(angle), -43, 5 * Math.sin(angle))   // QPU
        ];
        const coaxCurve = new THREE.CatmullRomCurve3(coaxCurvePts);
        const coaxGeo = new THREE.TubeGeometry(coaxCurve, 100, 0.2, 8, false);
        const coax = new THREE.Mesh(coaxGeo, superConductorMat);
        coaxGroup.add(coax);
        
        // Add attenuators (thick cylinders) at 4K and Cold plates
        const att4KGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
        const att4K = new THREE.Mesh(att4KGeo, brightChrome);
        att4K.position.copy(coaxCurvePts[2]);
        att4K.lookAt(coaxCurvePts[1]);
        coaxGroup.add(att4K);
        
        const attColdGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
        const attCold = new THREE.Mesh(attColdGeo, brightChrome);
        attCold.position.copy(coaxCurvePts[4]);
        attCold.lookAt(coaxCurvePts[3]);
        coaxGroup.add(attCold);
    }
    group.add(coaxGroup);
    meshes.coaxGroup = coaxGroup;

    parts.push({
        name: "Microwave Coaxial Lines & Attenuators",
        description: "Array of semi-rigid high-frequency transmission lines carrying quantum control pulses.",
        material: "CuNi, Superconducting NbTi, Beryllium Copper Connectors",
        function: "Transmits gigahertz microwave signals to qubits while heavily attenuating thermal noise from room temperature.",
        assemblyOrder: 11,
        connections: ["Room Temp Flange", "Attenuators", "QPU"],
        failureEffect: "Thermal noise travels down to qubits.",
        cascadeFailures: ["Rapid qubit excitation", "Loss of quantum coherence"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 35, y: 0, z: 35}
    });

    // 12. Main Pumping Line
    const pumpLinePts = [
        new THREE.Vector3(0, 40, 0),
        new THREE.Vector3(0, 25, 0),
        new THREE.Vector3(0, 10, 0),
        new THREE.Vector3(0, -1, 0)
    ];
    const pumpLineCurve = new THREE.CatmullRomCurve3(pumpLinePts);
    const pumpLineGeo = new THREE.TubeGeometry(pumpLineCurve, 64, 2.5, 32, false);
    const pumpLine = new THREE.Mesh(pumpLineGeo, steel);
    group.add(pumpLine);
    meshes.pumpLine = pumpLine;

    // Heavy Bellows/corrugations on the pumping line
    for(let i=0; i<45; i++) {
        const yPos = 3 + i*0.8;
        const ringGeo = new THREE.TorusGeometry(2.6, 0.25, 16, 32);
        const ring = new THREE.Mesh(ringGeo, chrome);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, yPos, 0);
        group.add(ring);
    }

    parts.push({
        name: "Massive Still Pumping Line",
        description: "Large diameter central tube pumping He3 gas out of the still to the external turbo-molecular pumps.",
        material: "Stainless Steel with Welded Bellows",
        function: "Maintains incredibly low vapor pressure in the still to continuously drive the distillation process.",
        assemblyOrder: 12,
        connections: ["Room Temp Flange", "Still Chamber"],
        failureEffect: "Blockage or leak immediately stops He3 circulation.",
        cascadeFailures: ["Total loss of cooling power"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: -35, y: 20, z: 0}
    });

    // 13. Outer Vacuum Chamber (OVC) & Radiation Shields
    const shieldGroup = new THREE.Group();
    
    // Outer Vacuum Chamber (Transparent to see inside)
    const ovcGeo = new THREE.CylinderGeometry(22, 22, 100, 64);
    const ovc = new THREE.Mesh(ovcGeo, frostedGlass);
    ovc.position.set(0, -10, 0);
    shieldGroup.add(ovc);
    
    // 50K Radiation Shield (Semi-transparent copper)
    const shield50KMat = new THREE.MeshPhysicalMaterial({
        color: 0xb87333, metalness: 0.8, roughness: 0.2, transmission: 0.8, transparent: true, opacity: 0.3
    });
    const shield50KGeo = new THREE.CylinderGeometry(16.5, 16.5, 80, 64);
    const shield50K = new THREE.Mesh(shield50KGeo, shield50KMat);
    shield50K.position.set(0, -15, 0);
    shieldGroup.add(shield50K);
    
    group.add(shieldGroup);
    meshes.shieldGroup = shieldGroup;

    parts.push({
        name: "Outer Vacuum Chamber & Radiation Shields",
        description: "Massive nested shells enveloping the entire cryostat in high vacuum and intercepting thermal radiation.",
        material: "Anodized Aluminum / Oxygen-Free Copper",
        function: "Provides extreme vacuum insulation to prevent convective and radiative heat transfer to the cryogenic stages.",
        assemblyOrder: 13,
        connections: ["Room Temp Flange", "50K Plate", "4K Plate"],
        failureEffect: "Vacuum leak leads to immediate massive heat load.",
        cascadeFailures: ["Violent explosive boiling of helium", "Catastrophic pressure spike"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -110, z: 0}
    });

    // 14. Support Rigging (Outer Heavy Frame)
    const frameGroup = new THREE.Group();
    const legPositions = [
        {x: 35, z: 35}, {x: -35, z: 35}, {x: 35, z: -35}, {x: -35, z: -35}
    ];
    legPositions.forEach(pos => {
        // Main vertical legs
        const legGeo = new THREE.CylinderGeometry(3, 3, 130, 32);
        const leg = new THREE.Mesh(legGeo, darkSteel);
        leg.position.set(pos.x, -20, pos.z);
        frameGroup.add(leg);
        
        // Pneumatic isolators at the base
        const isolatorGeo = new THREE.CylinderGeometry(5, 5, 10, 32);
        const isolator = new THREE.Mesh(isolatorGeo, rubber);
        isolator.position.set(pos.x, -80, pos.z);
        frameGroup.add(isolator);
        
        // Upper Crossbeams
        const beamGeo1 = new THREE.CylinderGeometry(2, 2, 70, 32);
        const beam1 = new THREE.Mesh(beamGeo1, darkSteel);
        beam1.rotation.z = Math.PI / 2;
        beam1.position.set(0, 40, pos.z);
        frameGroup.add(beam1);
        
        const beamGeo2 = new THREE.CylinderGeometry(2, 2, 70, 32);
        const beam2 = new THREE.Mesh(beamGeo2, darkSteel);
        beam2.rotation.x = Math.PI / 2;
        beam2.position.set(pos.x, 40, 0);
        frameGroup.add(beam2);
    });
    group.add(frameGroup);
    meshes.frameGroup = frameGroup;

    parts.push({
        name: "Heavy Structural Rigging & Vibration Isolators",
        description: "Massive vibration-isolated mechanical frame supporting the ton-scale cryostat system.",
        material: "Painted Structural Steel / Neoprene Rubber",
        function: "Isolates the highly sensitive quantum computer from seismic and acoustic vibrations.",
        assemblyOrder: 14,
        connections: ["Laboratory Floor", "Pneumatic Isolators", "Top Flange"],
        failureEffect: "Vibrational noise couples into the cryostat structure.",
        cascadeFailures: ["Microphonic heating", "Drastically reduced coherence times"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -60}
    });

    // 15. Helium Mixture Return Line & Condenser
    const returnLineGroup = new THREE.Group();
    const returnPts = [
        new THREE.Vector3(-10, 40, 0),
        new THREE.Vector3(-10, 25, 0),
        new THREE.Vector3(-8, 10, 0),
        new THREE.Vector3(-6, -2, 0),
        new THREE.Vector3(-4, -10, 0)
    ];
    const returnCurve = new THREE.CatmullRomCurve3(returnPts);
    const returnGeo = new THREE.TubeGeometry(returnCurve, 64, 0.6, 16, false);
    const returnMesh = new THREE.Mesh(returnGeo, chrome);
    returnLineGroup.add(returnMesh);
    
    // Condensing coils on 4K plate
    const coilPts = [];
    for(let i=0; i<100; i++) {
        const t = i/100;
        const angle = t * Math.PI * 10;
        const r = 2.5;
        coilPts.push(new THREE.Vector3(r * Math.cos(angle) - 8, 10.5 + t*3, r * Math.sin(angle)));
    }
    const coilCurve = new THREE.CatmullRomCurve3(coilPts);
    const coilGeo = new THREE.TubeGeometry(coilCurve, 100, 0.2, 16, false);
    const coilMesh = new THREE.Mesh(coilGeo, copper);
    returnLineGroup.add(coilMesh);

    group.add(returnLineGroup);
    meshes.returnLineGroup = returnLineGroup;

    parts.push({
        name: "Mixture Return Line & 4K Condensing Coils",
        description: "High-pressure line carrying room-temperature He3 gas back into the cryostat, passing through condensing coils.",
        material: "Stainless Steel / CuNi / Copper",
        function: "Pre-cools and condenses the returning He3 using the 50K and 4K stages before entering the continuous heat exchangers.",
        assemblyOrder: 15,
        connections: ["Gas Handling System", "4K Condenser", "Main Impedance"],
        failureEffect: "Blockage prevents He3 from re-entering the dilution circuit.",
        cascadeFailures: ["Depletion of mixture in mixing chamber", "Total loss of cooling"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -45, y: 0, z: -45}
    });

    // 16. Thermometry & Diagnostic Wiring Looms
    const wiringGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const wAngle = (i / 12) * Math.PI * 2;
        const wPts = [
            new THREE.Vector3(16 * Math.cos(wAngle), 40, 16 * Math.sin(wAngle)),
            new THREE.Vector3(15 * Math.cos(wAngle), 25, 15 * Math.sin(wAngle)),
            new THREE.Vector3(14 * Math.cos(wAngle), 10, 14 * Math.sin(wAngle)),
            new THREE.Vector3(11 * Math.cos(wAngle), -18, 11 * Math.sin(wAngle)),
            new THREE.Vector3(10 * Math.cos(wAngle), -38, 10 * Math.sin(wAngle))
        ];
        const wCurve = new THREE.CatmullRomCurve3(wPts);
        const wGeo = new THREE.TubeGeometry(wCurve, 64, 0.08, 8, false);
        const wire = new THREE.Mesh(wGeo, glowingBlue);
        wiringGroup.add(wire);
    }
    group.add(wiringGroup);
    meshes.wiringGroup = wiringGroup;

    parts.push({
        name: "Phosphor-Bronze Twisted Pair Diagnostic Looms",
        description: "Dense bundles of highly resistive wires for reading out RuO2 and Cernox thermometers.",
        material: "Phosphor-Bronze / Superconducting NbTi",
        function: "Carries low-frequency diagnostic and telemetry signals with absolute minimal thermal conductivity.",
        assemblyOrder: 16,
        connections: ["Thermometers", "Room Temp Connectors", "Mixing Chamber"],
        failureEffect: "Loss of temperature readout across stages.",
        cascadeFailures: ["Inability to monitor or automatically control the cool-down process"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 45, y: 0, z: -45}
    });

    const description = "Ultra-High-Tech Quantum Dilution Refrigerator. A massive, intensely complex cryogenic system designed to cool advanced quantum processors down to 10 millikelvin (near absolute zero). It features intricate golden heat exchangers, multi-stage radiation shields, dense arrays of microwave coaxial cables, and massive structural rigging. This machine harnesses the quantum thermodynamics of Helium-3/Helium-4 phase separation to overcome the cosmic microwave background and maintain extreme macroscopic quantum states.";

    const quizQuestions = [
        {
            question: "What specific physical process provides the immense cooling power in the Mixing Chamber?",
            options: [
                "Rapid evaporation of liquid Nitrogen in a vacuum",
                "Endothermic phase separation and osmotic dilution of He3 crossing into the He4 phase",
                "Peltier thermoelectric cooling using Bismuth Telluride",
                "Magnetic adiabatic demagnetization of paramagnetic salts"
            ],
            correctAnswer: 1,
            explanation: "The primary cooling mechanism at millikelvin temperatures is the endothermic process of He3 atoms crossing the phase boundary from the concentrated He3 phase into the dilute He3/He4 phase, absorbing heat akin to evaporation."
        },
        {
            question: "Why must the continuous and step heat exchangers be constructed with massive surface area (e.g., using sintered silver powder)?",
            options: [
                "To radically increase electrical conductivity",
                "To overcome Kapitza boundary thermal resistance between the liquid helium and the metal body",
                "To provide critical structural support for the heavy mixing chamber",
                "To physically filter out impurities from the circulating helium mixture"
            ],
            correctAnswer: 1,
            explanation: "At ultra-low temperatures, Kapitza resistance (a severe thermal boundary resistance between phonons in the liquid and electrons in the metal) becomes exceptionally high. Massive surface area is absolutely required to transfer heat effectively across the boundary."
        },
        {
            question: "What is the primary function of the Pulse Tube Refrigerator (PTR) Head in this system?",
            options: [
                "To compute quantum error correction algorithms",
                "To pump the He3 gas out of the still",
                "To provide initial pre-cooling to 50K and 4K without constantly consuming liquid helium",
                "To generate a massive magnetic field to shield the qubits"
            ],
            correctAnswer: 2,
            explanation: "The PTR is a mechanical cryocooler that uses compressed helium gas acoustic pulses to reach 4 Kelvin. It serves as a \"dry\" (cryogen-free) pre-cooling stage for the dilution circuit, intercepting massive heat loads."
        },
        {
            question: "Why are the intricate microwave coaxial cables equipped with attenuators at the various cold plates?",
            options: [
                "To dynamically boost the microwave signal strength for the qubits",
                "To convert microwave AC pulses into DC control voltages",
                "To physically thermalize the central conductor and drastically attenuate thermal blackbody noise from room temperature",
                "To prevent superfluid helium from creeping up the cables"
            ],
            correctAnswer: 2,
            explanation: "Attenuators physically heat-sink the center conductor of the coaxial line to the cold plates and reduce the amplitude of thermal blackbody radiation traveling down the line, preventing the qubits from being excited by heat."
        },
        {
            question: "What critical action occurs within the Still of a dilution refrigerator?",
            options: [
                "Water is continuously distilled and purified for the cooling process",
                "Precise heat is applied to preferentially evaporate He3 from the dilute mixture, driving the entire circulation",
                "The quantum processor executes its logic operations",
                "Helium-4 becomes a solid and is stored"
            ],
            correctAnswer: 1,
            explanation: "The Still is held around 0.7-0.9 K. Because He3 has a much higher vapor pressure than He4 at this temperature, heating it causes almost pure He3 gas to evaporate. This gas is pumped away, establishing the osmotic pressure gradient that pulls more He3 across the mixing chamber boundary."
        }
    ];

    // Animation loop variables
    let pulseTime = 0;

    const animate = (time, speed, meshesObj = meshes) => {
        const dt = speed * 0.03;
        pulseTime += dt;

        // Animate the Pulse Tube Refrigerator (high-frequency vibration/pulsing)
        if (meshesObj.ptrGroup) {
            meshesObj.ptrGroup.position.y = Math.sin(pulseTime * 20) * 0.1;
        }

        // Pulse the glowing superconducting heater in the still
        if (meshesObj.stillGroup) {
            meshesObj.stillGroup.children.forEach((child, index) => {
                if (index > 0) { // Heater coils
                    child.material.emissiveIntensity = 1.0 + Math.sin(pulseTime * 5 + index) * 0.5;
                }
            });
        }

        // Animate flow in the return line and condensing coils
        if (meshesObj.returnLineGroup) {
            meshesObj.returnLineGroup.children.forEach(mesh => {
                mesh.material.emissive.setHex(0x002255);
                mesh.material.emissiveIntensity = Math.abs(Math.sin(pulseTime * 4)) * 0.6;
            });
        }
        
        // Quantum Chip processing pulses (rapid erratic flickering)
        if (meshesObj.qpuGroup) {
            const chip = meshesObj.qpuGroup.children[1]; // The glowing chip
            if (chip) {
                chip.material.emissiveIntensity = 2.0 + Math.random() * 3.0; 
                // Color shift based on quantum state simulation
                chip.material.emissive.setHSL((pulseTime * 0.1) % 1, 1.0, 0.5);
            }
        }
        
        // Data transfer in diagnostic sensor wires
        if (meshesObj.wiringGroup) {
            meshesObj.wiringGroup.children.forEach((wire, index) => {
                wire.material.emissiveIntensity = 0.5 + Math.sin(pulseTime * 10 + index) * 0.8;
            });
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDilutionRefrigerator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
