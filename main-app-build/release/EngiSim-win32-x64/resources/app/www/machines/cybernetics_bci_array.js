import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatables = [];
    const signalPulses = [];
    const wirePaths = [];

    // ==========================================
    // CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.8 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.8 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 1.0 });
    const wireMat1 = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.2 });
    const wireMat2 = new THREE.MeshStandardMaterial({ color: 0x882222, roughness: 0.8, metalness: 0.2 });
    const glassEmissive = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, metalness: 0.1, roughness: 0.1, ior: 1.5, emissive: 0x00aaff, emissiveIntensity: 0.5 });
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 0.9, metalness: 0.5 });

    // Helper to register parts
    function addPart(name, desc, material, func, parentNode, origPos, explPos, mesh, cascade = []) {
        parts.push({
            name,
            description: desc,
            material: material ? (material.name || 'composite') : 'composite',
            function: func,
            assemblyOrder: parts.length + 1,
            connections: cascade,
            failureEffect: `Catastrophic loss of ${name} functionality.`,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
        mesh.userData = { partName: name, originalPosition: origPos, explodedPosition: explPos };
        parentNode.add(mesh);
    }

    // ==========================================
    // 1. CRANIAL PORT BASE & LOCKING MECHANISM
    // ==========================================
    const baseGroup = new THREE.Group();
    const baseOuterGeo = new THREE.TorusGeometry(3.5, 0.4, 64, 128);
    const baseOuterMesh = new THREE.Mesh(baseOuterGeo, darkSteel);
    baseOuterMesh.rotation.x = Math.PI / 2;
    addPart('Titanium Cranial Ring', 'Outer cranial anchoring ring bolted permanently into the skull.', darkSteel, 'Structural foundation for the BCI interface.', group, {x:0, y:0, z:0}, {x:0, y:-2, z:0}, baseGroup);
    baseGroup.add(baseOuterMesh);

    // Inner rim interface
    const innerRimGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.8, 128);
    const innerRimMesh = new THREE.Mesh(innerRimGeo, steel);
    baseGroup.add(innerRimMesh);

    // Bone Anchoring Screws
    const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 16);
    const boltGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(Math.cos(angle) * 3.5, 0.2, Math.sin(angle) * 3.5);
        
        // Add bolt heads
        const headGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 6);
        const head = new THREE.Mesh(headGeo, darkSteel);
        head.position.y = 0.55;
        bolt.add(head);
        
        boltGroup.add(bolt);
    }
    addPart('Cortical Anchoring Screws', 'Threaded titanium alloy screws connecting the port to the parietal bone.', chrome, 'Secures device rigidly to the skeletal structure.', baseGroup, {x:0, y:0, z:0}, {x:0, y:5, z:0}, boltGroup);

    // Rotary Locking Collar
    const collarGeo = new THREE.TorusGeometry(3.0, 0.25, 32, 64);
    const collarMesh = new THREE.Mesh(collarGeo, copper);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 0.4;
    addPart('Data Ribbon Locking Collar', 'Conductive copper alloy rotary collar.', copper, 'Locks neural cables mechanically and physically bridges data channels.', baseGroup, {x:0, y:0.4, z:0}, {x:0, y:3, z:0}, collarMesh);
    animatables.push({ mesh: collarMesh, type: 'rotateY', speed: 0.2 });

    // ==========================================
    // 2. UTAH ARRAY (Microelectrode Grid)
    // ==========================================
    const arrayGroup = new THREE.Group();
    arrayGroup.position.y = -1.2;
    
    // Substrate
    const substrateGeo = new THREE.BoxGeometry(2.5, 0.15, 2.5);
    const substrateMesh = new THREE.Mesh(substrateGeo, pcbMat);
    arrayGroup.add(substrateMesh);

    // Microelectrode Spikes (Massive Grid)
    const spikeGeo = new THREE.ConeGeometry(0.015, 0.6, 6);
    spikeGeo.translate(0, -0.3, 0); // Tip points down
    const spikeGridGroup = new THREE.Group();
    
    // 30x30 grid = 900 highly detailed spikes
    const spikeInstancedMesh = new THREE.InstancedMesh(spikeGeo, gold, 900);
    let spikeIndex = 0;
    const spikeDummy = new THREE.Object3D();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            spikeDummy.position.set((i - 14.5) * 0.08, -0.075, (j - 14.5) * 0.08);
            spikeDummy.updateMatrix();
            spikeInstancedMesh.setMatrixAt(spikeIndex++, spikeDummy.matrix);
        }
    }
    spikeGridGroup.add(spikeInstancedMesh);
    arrayGroup.add(spikeGridGroup);

    // Interface pins rising from substrate
    const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
    const pinInstanced = new THREE.InstancedMesh(pinGeo, chrome, 100);
    let pinIndex = 0;
    for (let i=0; i<10; i++) {
        for (let j=0; j<10; j++) {
            spikeDummy.position.set((i-4.5)*0.2, 0.2, (j-4.5)*0.2);
            spikeDummy.updateMatrix();
            pinInstanced.setMatrixAt(pinIndex++, spikeDummy.matrix);
        }
    }
    arrayGroup.add(pinInstanced);

    addPart('Deep-Brain Microelectrode Array', 'High-density gold-tipped penetrating electrodes (Utah Array variant).', gold, 'Direct motor-cortex interfacing and neural reading.', group, {x:0, y:-1.2, z:0}, {x:0, y:-5, z:0}, arrayGroup);

    // ==========================================
    // 3. SIGNAL AMPLIFIER COILS
    // ==========================================
    const ampGroup = new THREE.Group();
    const coilGeo = new THREE.TorusGeometry(0.4, 0.08, 16, 64);
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.position.set(Math.cos(angle)*2.2, 0.1, Math.sin(angle)*2.2);
        coil.rotation.x = Math.PI/2;
        coil.rotation.y = angle;
        
        // Add tiny capacitors to each coil
        const capGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
        const capacitor = new THREE.Mesh(capGeo, darkSteel);
        capacitor.position.set(0.4, 0, 0);
        coil.add(capacitor);
        
        ampGroup.add(coil);
        animatables.push({ mesh: coil, type: 'pulseScaleCoil', speed: 5, offset: i });
    }
    addPart('Electromagnetic Pre-Amplifier Coils', 'Induction coils wrapped in copper wire.', copper, 'Boosts raw microvolt neural signals prior to analog-digital conversion.', baseGroup, {x:0,y:0,z:0}, {x:0,y:1.5,z:3}, ampGroup);

    // ==========================================
    // 4. MAIN DATA TRUNK (Intricate Wires)
    // ==========================================
    const trunkGroup = new THREE.Group();
    const numWires = 48;
    for(let i=0; i<numWires; i++) {
        const angle = (i/numWires) * Math.PI * 2;
        const radiusStart = 1.0 + Math.random()*1.5;
        const radiusMid = 2.0 + Math.random()*2.0;
        const radiusEnd = 0.5 + Math.random()*1.0;
        
        const curvePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*radiusStart, 0.8, Math.sin(angle)*radiusStart),
            new THREE.Vector3(Math.cos(angle+0.5)*radiusStart*0.8, 3, Math.sin(angle+0.5)*radiusStart*0.8),
            new THREE.Vector3(Math.cos(angle+1.2)*radiusMid, 6, Math.sin(angle+1.2)*radiusMid),
            new THREE.Vector3(Math.cos(angle+0.2)*radiusEnd, 9, Math.sin(angle+0.2)*radiusEnd)
        ]);
        wirePaths.push(curvePath);
        
        const tubeGeo = new THREE.TubeGeometry(curvePath, 64, 0.05 + Math.random()*0.03, 8, false);
        const mat = i % 4 === 0 ? wireMat2 : (i % 3 === 0 ? copper : wireMat1);
        const tubeMesh = new THREE.Mesh(tubeGeo, mat);
        trunkGroup.add(tubeMesh);
    }
    addPart('Primary Neural Trunk Cable', 'Dense bundle of fiber-optic and super-cooled copper wiring.', rubber, 'Transmits petabytes of raw brain data to the exocranial processors.', group, {x:0,y:0,z:0}, {x:0,y:0,z:0}, trunkGroup);

    // ==========================================
    // 5. NEURAL SIGNAL PULSES (Glowing Orbs)
    // ==========================================
    const pulseGeo = new THREE.SphereGeometry(0.1, 16, 16);
    // Add inner bright core to pulses
    const pulseCoreGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const pulseCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for(let i=0; i<80; i++) {
        const pathIndex = Math.floor(Math.random() * numWires);
        const isErrorPulse = Math.random() > 0.9;
        
        const pulse = new THREE.Mesh(pulseGeo, isErrorPulse ? neonRed : neonBlue);
        const core = new THREE.Mesh(pulseCoreGeo, pulseCoreMat);
        pulse.add(core);

        pulse.userData = {
            path: wirePaths[pathIndex],
            progress: Math.random(),
            speed: 0.005 + Math.random() * 0.015,
            isError: isErrorPulse
        };
        trunkGroup.add(pulse);
        signalPulses.push(pulse);
    }

    // ==========================================
    // 6. EXOCRANIAL HARNESS / EEG CAP
    // ==========================================
    const capGroup = new THREE.Group();
    capGroup.position.y = 9;
    
    // Main Matrix
    const capGeo = new THREE.SphereGeometry(6, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.1);
    const capMesh = new THREE.Mesh(capGeo, plastic);
    capMesh.material.side = THREE.DoubleSide;
    capMesh.material.transparent = true;
    capMesh.material.opacity = 0.85;
    
    // Hexagonal Grid overlay on cap
    const hexGeo = new THREE.IcosahedronGeometry(6.05, 4);
    const hexWireMat = new THREE.LineBasicMaterial({color: 0x444444, opacity: 0.5, transparent: true});
    const capWireframe = new THREE.LineSegments(new THREE.WireframeGeometry(hexGeo), hexWireMat);
    
    // Bottom sealing rim
    const rimGeo = new THREE.TorusGeometry(5.9, 0.3, 32, 128);
    const rimMesh = new THREE.Mesh(rimGeo, rubber);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.1;
    
    capGroup.add(capMesh);
    capGroup.add(capWireframe);
    capGroup.add(rimMesh);
    addPart('Exocranial Polymer Sensor Matrix', 'Flexible semi-transparent polymer helmet with integrated micro-circuitry.', plastic, 'Houses superficial EEG nodes and isolates environmental interference.', group, {x:0,y:9,z:0}, {x:0,y:15,z:0}, capGroup);

    // ==========================================
    // 7. SUPERFICIAL EEG ELECTRODES
    // ==========================================
    const eegGroup = new THREE.Group();
    const eegGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const innerEegGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
    
    for(let i=0; i<45; i++) {
        // Fibonacci sphere distribution for even spread
        const phi = Math.acos(1 - 2 * (i + 0.5) / 100); 
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Only place on the top hemisphere
        if (phi < Math.PI / 2.3) {
            const x = 6.05 * Math.cos(theta) * Math.sin(phi);
            const y = 6.05 * Math.cos(phi);
            const z = 6.05 * Math.sin(theta) * Math.sin(phi);
            
            const node = new THREE.Mesh(eegGeo, darkSteel);
            node.position.set(x, y, z);
            node.lookAt(new THREE.Vector3(0,0,0));
            node.rotateX(Math.PI/2); 
            
            const innerNode = new THREE.Mesh(innerEegGeo, chrome);
            innerNode.position.y = -0.05;
            node.add(innerNode);
            
            // LED Status Ring
            const ledGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 16);
            const led = new THREE.Mesh(ledGeo, neonGreen);
            led.rotation.x = Math.PI/2;
            led.position.y = 0.1;
            node.add(led);
            animatables.push({ mesh: led, type: 'blink', speed: Math.random() * 2 + 1, offset: Math.random() * Math.PI });
            
            eegGroup.add(node);
        }
    }
    addPart('Non-Invasive EEG Nodes', 'Surface level electrical activity sensors distributed across the cranium.', chrome, 'Monitors alpha/beta wave patterns and localized cortical anomalies.', capGroup, {x:0,y:0,z:0}, {x:0,y:4,z:0}, eegGroup);

    // ==========================================
    // 8. NEUROMORPHIC CO-PROCESSORS
    // ==========================================
    const procLeftGroup = new THREE.Group();
    procLeftGroup.position.set(-6.3, 3, 0);
    procLeftGroup.rotation.z = -Math.PI / 4.5;
    
    const procRightGroup = new THREE.Group();
    procRightGroup.position.set(6.3, 3, 0);
    procRightGroup.rotation.z = Math.PI / 4.5;

    const procChassisGeo = new THREE.BoxGeometry(2, 4.5, 3.5);
    const procLeftMesh = new THREE.Mesh(procChassisGeo, darkSteel);
    const procRightMesh = new THREE.Mesh(procChassisGeo, darkSteel);
    
    // Add intricate details to chassis
    const chipGeo = new THREE.BoxGeometry(1.5, 3.5, 0.2);
    const chipL = new THREE.Mesh(chipGeo, pcbMat);
    chipL.position.x = 1.0;
    procLeftMesh.add(chipL);
    
    const chipR = new THREE.Mesh(chipGeo, pcbMat);
    chipR.position.x = -1.0;
    procRightMesh.add(chipR);

    procLeftGroup.add(procLeftMesh);
    procRightGroup.add(procRightMesh);

    addPart('Left Hemisphere Co-Processor', 'Quantum-optical neuromorphic computing chassis.', darkSteel, 'Processes logic, language, and analytical brain patterns instantly.', capGroup, {x:-6.3,y:3,z:0}, {x:-12,y:4,z:0}, procLeftGroup);
    addPart('Right Hemisphere Co-Processor', 'Quantum-optical neuromorphic computing chassis.', darkSteel, 'Processes spatial, creative, and parallel multi-sensory data.', capGroup, {x:6.3,y:3,z:0}, {x:12,y:4,z:0}, procRightGroup);

    // Heat Sinks & Fluid Pipes for Processors
    const finGeo = new THREE.BoxGeometry(2.2, 0.1, 3.2);
    for(let i=-2.0; i<=2.0; i+=0.3) {
        const finL = new THREE.Mesh(finGeo, aluminum);
        finL.position.y = i;
        procLeftGroup.add(finL);
        
        const finR = new THREE.Mesh(finGeo, aluminum);
        finR.position.y = i;
        procRightGroup.add(finR);
    }

    // High-speed Cooling Fans
    const fanGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
    
    // Left Fans
    const fanL1 = new THREE.Mesh(fanGeo, chrome);
    fanL1.position.set(1.1, 1, 0);
    fanL1.rotation.z = Math.PI/2;
    procLeftGroup.add(fanL1);
    
    const fanL2 = new THREE.Mesh(fanGeo, chrome);
    fanL2.position.set(1.1, -1, 0);
    fanL2.rotation.z = Math.PI/2;
    procLeftGroup.add(fanL2);
    
    animatables.push({ mesh: fanL1, type: 'rotateY', speed: 25 });
    animatables.push({ mesh: fanL2, type: 'rotateY', speed: -25 });

    // Right Fans
    const fanR1 = new THREE.Mesh(fanGeo, chrome);
    fanR1.position.set(-1.1, 1, 0);
    fanR1.rotation.z = Math.PI/2;
    procRightGroup.add(fanR1);
    
    const fanR2 = new THREE.Mesh(fanGeo, chrome);
    fanR2.position.set(-1.1, -1, 0);
    fanR2.rotation.z = Math.PI/2;
    procRightGroup.add(fanR2);

    animatables.push({ mesh: fanR1, type: 'rotateY', speed: -25 });
    animatables.push({ mesh: fanR2, type: 'rotateY', speed: 25 });
    
    // ==========================================
    // 9. MICRO-PNEUMATIC ADJUSTERS (For Cap tension)
    // ==========================================
    const pneumaticsGroup = new THREE.Group();
    const pistonCylGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
    const pistonRodGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.0, 16);
    
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const x = Math.cos(angle) * 5.9;
        const z = Math.sin(angle) * 5.9;
        
        const pGroup = new THREE.Group();
        pGroup.position.set(x, -0.5, z);
        pGroup.lookAt(new THREE.Vector3(0, 9, 0)); 
        pGroup.rotateX(Math.PI/2);
        
        const cyl = new THREE.Mesh(pistonCylGeo, darkSteel);
        const rod = new THREE.Mesh(pistonRodGeo, chrome);
        rod.position.y = 1.2; 
        
        // Add tiny hydraulic tubes
        const hydPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.2, -1, 0),
            new THREE.Vector3(0.5, 0, 0),
            new THREE.Vector3(0.2, 1, 0)
        ]);
        const hydTube = new THREE.Mesh(new THREE.TubeGeometry(hydPath, 16, 0.05, 8, false), rubber);
        cyl.add(hydTube);

        pGroup.add(cyl);
        pGroup.add(rod);
        animatables.push({ mesh: rod, type: 'piston', speed: 1.5, basePos: 1.2, range: 0.4, offset: i });
        
        pneumaticsGroup.add(pGroup);
    }
    addPart('Micro-Pneumatic Tensioners', 'Hydraulic active pistons for dynamic cap fitting and calibration.', steel, 'Maintains optimal electrode contact pressure against the scalp.', capGroup, {x:0,y:0,z:0}, {x:0,y:-4,z:0}, pneumaticsGroup);

    // ==========================================
    // 10. REAR DATA TRANSMITTER (Wireless Array)
    // ==========================================
    const txGroup = new THREE.Group();
    txGroup.position.set(0, 2, -6.5);
    txGroup.rotation.x = -Math.PI / 3.5;

    const txBaseGeo = new THREE.CylinderGeometry(1.8, 1.4, 2.0, 32);
    const txBase = new THREE.Mesh(txBaseGeo, plastic);
    txGroup.add(txBase);

    // Phased Array Dish
    const dishGeo = new THREE.SphereGeometry(2.5, 64, 16, 0, Math.PI*2, 0, Math.PI/3);
    const dish = new THREE.Mesh(dishGeo, gold);
    dish.position.y = 1.5;
    dish.material.side = THREE.DoubleSide;
    
    // Dish grid inner logic
    const innerDishGeo = new THREE.SphereGeometry(2.4, 16, 8, 0, Math.PI*2, 0, Math.PI/3);
    const innerDish = new THREE.Mesh(innerDishGeo, new THREE.WireframeGeometry(innerDishGeo));
    innerDish.material = new THREE.LineBasicMaterial({color: 0xffaa00, transparent: true, opacity: 0.6});
    dish.add(innerDish);

    txGroup.add(dish);

    const antennaGeo = new THREE.CylinderGeometry(0.08, 0.02, 4, 16);
    const antenna = new THREE.Mesh(antennaGeo, chrome);
    antenna.position.y = 3;
    txGroup.add(antenna);
    
    // Transmitter Rings & Wave Emitters
    const ringGeo = new THREE.TorusGeometry(0.8, 0.05, 16, 32);
    for(let i=0; i<6; i++) {
        const ring = new THREE.Mesh(ringGeo, neonBlue);
        ring.rotation.x = Math.PI/2;
        ring.position.y = 1.5 + i*0.4;
        txGroup.add(ring);
        animatables.push({ mesh: ring, type: 'pulseScaleTx', speed: 3, offset: i });
    }

    addPart('Quantum Uplink Transmitter Array', 'High-gain multidirectional microwave and optical transceiver.', gold, 'Facilitates wireless petabyte-scale data offloading to local server clusters.', capGroup, {x:0,y:2,z:-6.5}, {x:0,y:6,z:-12}, txGroup);

    // ==========================================
    // 11. POWER SUPPLY / BATTERY PACKS
    // ==========================================
    const batteryGroup = new THREE.Group();
    const batteryGeo = new THREE.BoxGeometry(1.5, 4, 1.5);
    
    const batL = new THREE.Mesh(batteryGeo, darkSteel);
    batL.position.set(-4.5, -0.5, 4.5);
    batL.rotation.z = Math.PI/8;
    batL.rotation.x = -Math.PI/6;
    
    const batR = new THREE.Mesh(batteryGeo, darkSteel);
    batR.position.set(4.5, -0.5, 4.5);
    batR.rotation.z = -Math.PI/8;
    batR.rotation.x = -Math.PI/6;

    // Glowing power indicators and cables
    const indGeo = new THREE.BoxGeometry(1.2, 0.2, 1.6);
    const indL = new THREE.Mesh(indGeo, neonGreen);
    indL.position.y = 2.0;
    batL.add(indL);
    
    const indR = new THREE.Mesh(indGeo, neonGreen);
    indR.position.y = 2.0;
    batR.add(indR);

    // Power Cables feeding to main hub
    const pwrPathL = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.5, 1, 4.5),
        new THREE.Vector3(-3, 3, 2),
        new THREE.Vector3(0, 6, 0)
    ]);
    const pwrCableL = new THREE.Mesh(new THREE.TubeGeometry(pwrPathL, 32, 0.15, 8, false), copper);
    batteryGroup.add(pwrCableL);

    const pwrPathR = new THREE.CatmullRomCurve3([
        new THREE.Vector3(4.5, 1, 4.5),
        new THREE.Vector3(3, 3, 2),
        new THREE.Vector3(0, 6, 0)
    ]);
    const pwrCableR = new THREE.Mesh(new THREE.TubeGeometry(pwrPathR, 32, 0.15, 8, false), copper);
    batteryGroup.add(pwrCableR);

    batteryGroup.add(batL);
    batteryGroup.add(batR);

    addPart('High-Density Graphene Batteries', 'Ultra-capacitor hybrid power storage units.', darkSteel, 'Provides independent, isolated power for continuous 48-hour operation.', capGroup, {x:0,y:0,z:0}, {x:0,y:-4,z:8}, batteryGroup);

    // ==========================================
    // 12. SENSOR FLUID TUBES (Cooling/Conductive Gel)
    // ==========================================
    const tubeGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const tubeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*3, 0.5, Math.sin(angle)*3),
            new THREE.Vector3(Math.cos(angle)*6.2, 4, Math.sin(angle)*6.2),
            new THREE.Vector3(Math.cos(angle)*6.5, 6, Math.sin(angle)*6.5),
            new THREE.Vector3(Math.cos(angle)*3, 8, Math.sin(angle)*3)
        ]);
        const tGeo = new THREE.TubeGeometry(tubeCurve, 64, 0.1, 8, false);
        const tMesh = new THREE.Mesh(tGeo, glassEmissive);
        
        // Fluid particles inside tubes
        const flowGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const flowMesh = new THREE.Mesh(flowGeo, neonBlue);
        tubeGroup.add(flowMesh);
        animatables.push({ mesh: flowMesh, type: 'flowTube', path: tubeCurve, speed: 0.5 + Math.random(), progress: Math.random() });

        tubeGroup.add(tMesh);
    }
    addPart('Conductive Gel and Coolant Lines', 'Transparent reinforced tubing flowing with active bio-gel.', glass, 'Regulates thermal output and optimizes localized signal conductivity.', capGroup, {x:0,y:0,z:0}, {x:0,y:3,z:0}, tubeGroup);

    // ==========================================
    // 13. CENTRAL CORTICAL HUB (Top of cap)
    // ==========================================
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 5.8, 0);
    
    // Base Core
    const hubCoreGeo = new THREE.CylinderGeometry(2.5, 3.0, 1.5, 64);
    const hubCore = new THREE.Mesh(hubCoreGeo, chrome);
    hubGroup.add(hubCore);

    // Synchronization Ring
    const hubRingGeo = new THREE.TorusGeometry(3.0, 0.2, 32, 64);
    const hubRing = new THREE.Mesh(hubRingGeo, neonRed);
    hubGroup.add(hubRing);
    animatables.push({ mesh: hubRing, type: 'pulseColor', speed: 1.5 });

    // Glass Dome enclosure
    const glassDomeGeo = new THREE.SphereGeometry(2.2, 64, 32, 0, Math.PI*2, 0, Math.PI/2);
    const glassDome = new THREE.Mesh(glassDomeGeo, tinted);
    glassDome.position.y = 0.75;
    hubGroup.add(glassDome);

    // Rotating Quantum Data Core inside Dome
    const dataCoreGroup = new THREE.Group();
    dataCoreGroup.position.y = 1.2;
    
    const coreShellGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreShell = new THREE.Mesh(coreShellGeo, new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true }));
    dataCoreGroup.add(coreShell);

    const innerCoreGeo = new THREE.OctahedronGeometry(0.8, 2);
    const innerCore = new THREE.Mesh(innerCoreGeo, gold);
    dataCoreGroup.add(innerCore);
    
    hubGroup.add(dataCoreGroup);
    animatables.push({ mesh: dataCoreGroup, type: 'rotateAll', speed: 1.5 });

    addPart('Central Cortical Multiplexer Hub', 'Main data aggregation and synchronization center housed under protective glass.', chrome, 'Merges shallow and deep brain signals into a unified neural datastream.', capGroup, {x:0,y:5.8,z:0}, {x:0,y:14,z:0}, hubGroup);


    // ==========================================
    // DESCRIPTIONS & QUIZ QUESTIONS
    // ==========================================
    const description = "The Mark VII Cybernetic Brain-Computer Interface (BCI) Array represents the pinnacle of neuro-technological engineering. It combines invasive deep-brain microelectrodes (Utah Array variant) bolted directly to the cranium with an exocranial polymer matrix cap. This cap houses high-speed neuromorphic co-processors, liquid-cooled data pipelines, and a quantum microwave uplink. Operating in perfect unison, this machine enables petabyte-scale bidirectional data transfer, capable of uploading consciousness segments, simulating motor functions, and augmenting intellectual processing in real-time. The massive wiring bundles stream raw neuro-electric impulses, visibly indicated by glowing photon-pulses.";

    const quizQuestions = [
        {
            question: "What is the primary function of the deep-brain Utah Array component?",
            options: [
                "Wireless power transmission",
                "Direct motor-cortex interfacing and neural reading",
                "Cooling the neuromorphic chips",
                "Monitoring localized skin temperature"
            ],
            correctAnswer: 1,
            explanation: "The Utah Array consists of hundreds of microelectrodes that penetrate the brain tissue for high-resolution, direct motor-cortex interfacing."
        },
        {
            question: "How does the BCI regulate thermal output from the neuromorphic processors?",
            options: [
                "Exclusively through aluminum passive heat sinks",
                "Through a combination of aluminum fins, high-speed rotary fans, and flowing bio-gel coolant lines",
                "By shutting down half the cortex",
                "Using the gold-tipped spikes to dissipate heat into the brain"
            ],
            correctAnswer: 1,
            explanation: "Thermal management is handled via aluminum heat sinks, active rotary cooling fans on the processors, and transparent coolant lines pumping bio-gel."
        },
        {
            question: "What is the role of the Micro-Pneumatic Tensioners on the cap?",
            options: [
                "To look aesthetically pleasing",
                "To store backup electrical power",
                "To maintain optimal electrode contact pressure against the scalp dynamically",
                "To lock the main data trunk into the cranial port"
            ],
            correctAnswer: 2,
            explanation: "The hydraulic active pistons dynamically adjust to ensure the superficial EEG nodes maintain perfect contact pressure."
        },
        {
            question: "Why are there dual co-processors on the left and right hemispheres of the cap?",
            options: [
                "One acts as a backup for the other",
                "Left processes logic/language, while Right processes spatial/creative sensory data",
                "They generate the wireless transmission signals",
                "They are batteries disguised as processors"
            ],
            correctAnswer: 1,
            explanation: "The co-processors mimic brain lateralization; the left chassis handles analytical/logic patterns, while the right handles parallel spatial/creative data."
        },
        {
            question: "Which component secures the massive data trunk mechanically to the skull?",
            options: [
                "The Quantum Uplink Transmitter",
                "The Cortical Anchoring Screws and Data Ribbon Locking Collar",
                "The Conductive Gel lines",
                "The Central Cortical Multiplexer Hub"
            ],
            correctAnswer: 1,
            explanation: "The Titanium Cranial Ring, anchored by cortical screws, utilizes a rotary copper locking collar to securely attach the primary data trunk."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        const delta = speed * 0.016; 
        
        // Animate raw data pulses surging through the main trunk
        signalPulses.forEach(pulse => {
            pulse.userData.progress += pulse.userData.speed * speed * 0.8;
            if (pulse.userData.progress > 1) {
                pulse.userData.progress = 0;
                pulse.userData.pathIndex = Math.floor(Math.random() * wirePaths.length);
                pulse.userData.path = wirePaths[pulse.userData.pathIndex];
            }
            const pos = pulse.userData.path.getPointAt(pulse.userData.progress);
            pulse.position.copy(pos);
            
            // Randomly flicker error pulses
            if (pulse.userData.isError) {
                pulse.material.emissiveIntensity = Math.random() > 0.8 ? 5.0 : 0.5;
            }
        });

        // Loop through all registered animatable components
        animatables.forEach(anim => {
            if (anim.type === 'rotateY') {
                anim.mesh.rotation.y += anim.speed * delta;
            } 
            else if (anim.type === 'rotateAll') {
                anim.mesh.rotation.x += anim.speed * delta;
                anim.mesh.rotation.y += anim.speed * delta * 1.3;
                anim.mesh.rotation.z += anim.speed * delta * 0.7;
            } 
            else if (anim.type === 'piston') {
                // Hydraulic pumping motion based on sine wave
                const offsetTime = time * 0.001 * anim.speed + anim.offset;
                anim.mesh.position.y = anim.basePos + Math.sin(offsetTime) * anim.range;
            } 
            else if (anim.type === 'pulseScaleTx') {
                // Expanding rings for transmitter
                const scale = 1 + ( (time * 0.002 * anim.speed + anim.offset) % 1.5 );
                anim.mesh.scale.set(scale, scale, scale);
                anim.mesh.material.opacity = Math.max(0, 1 - (scale - 1));
                anim.mesh.material.transparent = true;
            }
            else if (anim.type === 'pulseScaleCoil') {
                // Throbbing coils
                const scale = 1 + Math.sin(time * 0.005 * anim.speed + anim.offset) * 0.05;
                anim.mesh.scale.set(scale, scale, scale);
            }
            else if (anim.type === 'pulseColor') {
                // Throbbing light intensity
                const intensity = 1.5 + Math.sin(time * 0.003 * anim.speed) * 1.2;
                anim.mesh.material.emissiveIntensity = intensity;
            }
            else if (anim.type === 'blink') {
                // LED blinks
                const blinkState = Math.sin(time * 0.005 * anim.speed + anim.offset) > 0.8;
                anim.mesh.material.emissiveIntensity = blinkState ? 4.0 : 0.2;
            }
            else if (anim.type === 'flowTube') {
                // Particles moving along coolant paths
                anim.progress += anim.speed * delta * 0.2;
                if (anim.progress > 1) anim.progress = 0;
                const pos = anim.path.getPointAt(anim.progress);
                anim.mesh.position.copy(pos);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBCIArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
