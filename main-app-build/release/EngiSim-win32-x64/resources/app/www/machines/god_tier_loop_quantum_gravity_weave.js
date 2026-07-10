import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // 1. ADVANCED LOOP QUANTUM GRAVITY MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff, 
        emissive: 0x0044ff, 
        emissiveIntensity: 2.0, 
        transparent: true, 
        opacity: 0.9, 
        wireframe: false 
    });
    const neonPink = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0xaa00ff, 
        emissiveIntensity: 2.5 
    });
    const neonGreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ffaa, 
        emissive: 0x00aa44, 
        emissiveIntensity: 1.5 
    });
    const fluxMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 3.5, 
        wireframe: true 
    });
    const darkEnergyMat = new THREE.MeshStandardMaterial({ 
        color: 0x110022, 
        emissive: 0x330066, 
        emissiveIntensity: 1.0,
        roughness: 0.1,
        metalness: 0.9
    });
    const pureEnergy = new THREE.MeshBasicMaterial({ 
        color: 0xffffff 
    });
    const quantumGold = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x442200,
        roughness: 0.2,
        metalness: 1.0
    });

    // ==========================================
    // 2. HELPER FUNCTIONS FOR PROCEDURAL GEN
    // ==========================================
    function createGear(radius, teeth, depth) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.8;
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? radius : innerRadius;
            if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        shape.closePath();
        return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    }

    function createFractalAntenna(iterations, scale) {
        const antGroup = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(0.1*scale, 0.1*scale, 2*scale, 8);
        const base = new THREE.Mesh(baseGeo, chrome);
        antGroup.add(base);
        if (iterations > 0) {
            const branch1 = createFractalAntenna(iterations - 1, scale * 0.7);
            branch1.position.set(0, scale, 0);
            branch1.rotation.z = Math.PI / 4;
            const branch2 = createFractalAntenna(iterations - 1, scale * 0.7);
            branch2.position.set(0, scale, 0);
            branch2.rotation.z = -Math.PI / 4;
            antGroup.add(branch1, branch2);
        }
        return antGroup;
    }

    // ==========================================
    // 3. COMPONENT GENERATION (15+ PARTS)
    // ==========================================

    // --- PART 1: Weaver Chassis ---
    const chassisGroup = new THREE.Group();
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-30, -15);
    chassisShape.lineTo(30, -15);
    chassisShape.lineTo(40, 0);
    chassisShape.lineTo(30, 15);
    chassisShape.lineTo(-30, 15);
    chassisShape.lineTo(-40, 0);
    chassisShape.closePath();
    
    // Add intricate cutouts
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 8, 0, Math.PI * 2, false);
    chassisShape.holes.push(holePath);

    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 8, bevelEnabled: true, bevelThickness: 1.0 });
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.y = 8;
    chassisGroup.add(chassisMesh);

    // Chassis micro-details (piping and heat sinks)
    for (let i = 0; i < 40; i++) {
        const tubePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-25 + i*1.2, 8, -15),
            new THREE.Vector3(-23 + i*1.2, 11, -18),
            new THREE.Vector3(-20 + i*1.2, 10, -15)
        ]);
        const tubeGeo = new THREE.TubeGeometry(tubePath, 16, 0.4, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, copper);
        chassisGroup.add(tubeMesh);
    }
    
    // Add heat sink fins
    for (let i = 0; i < 20; i++) {
        const finGeo = new THREE.BoxGeometry(0.5, 3, 10);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(-28 + i*2.5, 12, 12);
        chassisGroup.add(fin);
    }

    group.add(chassisGroup);
    parts.push({
        name: "Weaver_Chassis", 
        description: "Massive dark steel foundation anchoring the LQG Loom. Houses the main quantum routing buses and heat dissipation arrays.", 
        material: "darkSteel, copper, aluminum",
        function: "Structural Base & Cooling", 
        assemblyOrder: 1, 
        connections: ["Quantum_Treads", "Spacetime_Loom_Core", "Chronos_Synchronization_Gears"],
        failureEffect: "Macro-collapse of the physical structure into a singularity.", 
        cascadeFailures: ["All systems"], 
        originalPosition: {x:0, y:8, z:0}, 
        explodedPosition: {x:0, y:-20, z:0}
    });

    // --- PART 2: Quantum Treads ---
    const treadGroup = new THREE.Group();
    meshes.wheels = [];
    const wheelPositions = [
        [-25, 0, 18], [25, 0, 18], [-25, 0, -18], [25, 0, -18], 
        [-35, 0, 0], [35, 0, 0], [0, 0, 22], [0, 0, -22]
    ];
    
    wheelPositions.forEach((pos) => {
        const wheel = new THREE.Group();
        // Complex Tire
        const tireGeo = new THREE.TorusGeometry(6, 2.5, 48, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        
        // Massive off-road lugs (200 of them per tire)
        for(let l=0; l<200; l++) {
            const angle = (l / 200) * Math.PI * 2;
            const lugGeo = new THREE.BoxGeometry(1.5, 0.8, 4.0);
            const lug = new THREE.Mesh(lugGeo, rubber);
            const radiusOffset = 8.0;
            lug.position.set(Math.cos(angle)*radiusOffset, Math.sin(angle)*radiusOffset, 0);
            lug.rotation.z = angle;
            lug.rotation.y = Math.PI/2;
            
            // Alternating lug angles for realistic tread
            if(l%2 === 0) lug.rotation.x = Math.PI/12;
            else lug.rotation.x = -Math.PI/12;
            
            tire.add(lug);
        }
        
        // Complex Rims
        const rimGeo = new THREE.CylinderGeometry(4.5, 4.5, 5.5, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI/2;
        rim.rotation.z = Math.PI/2;
        
        // Double array of spokes
        for(let s=0; s<16; s++) {
            const spokeGeo = new THREE.CylinderGeometry(0.3, 0.4, 9, 16);
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.x = Math.PI/2;
            spoke.rotation.z = (s / 16) * Math.PI * 2;
            rim.add(spoke);
            
            const crossSpokeGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
            const crossSpoke = new THREE.Mesh(crossSpokeGeo, steel);
            crossSpoke.position.set(Math.cos(spoke.rotation.z)*2, Math.sin(spoke.rotation.z)*2, 1);
            crossSpoke.rotation.x = Math.PI/4;
            rim.add(crossSpoke);
        }
        
        // Glowing hubcap
        const hubGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const hub = new THREE.Mesh(hubGeo, neonBlue);
        rim.add(hub);

        wheel.add(tire);
        wheel.add(rim);
        wheel.position.set(...pos);
        treadGroup.add(wheel);
        meshes.wheels.push(wheel);
    });
    group.add(treadGroup);
    parts.push({
        name: "Quantum_Treads", 
        description: "Aggressive tread array traversing non-commutative geometric spaces. Equipped with sub-Planck adhesion.", 
        material: "rubber, darkSteel, chrome",
        function: "Locomotion and terrain anchoring", 
        assemblyOrder: 2, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Machine slips into a lower dimensional plane.", 
        cascadeFailures: ["Chassis alignment"], 
        originalPosition: {x:0, y:0, z:0}, 
        explodedPosition: {x:0, y:-40, z:0}
    });

    // --- PART 3: Spacetime Loom Core ---
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(10, 4);
    const coreMesh = new THREE.Mesh(coreGeo, glass);
    const innerCoreGeo = new THREE.IcosahedronGeometry(7, 3);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, fluxMat);
    coreGroup.add(coreMesh);
    coreGroup.add(innerCoreMesh);
    coreGroup.position.set(0, 30, 0);
    
    // Complex Core rings with gears attached
    meshes.coreRings = [];
    for(let r=0; r<6; r++) {
        const ringGeo = new THREE.TorusGeometry(12 + r*1.5, 0.4, 32, 128);
        const ring = new THREE.Mesh(ringGeo, r%2===0 ? neonBlue : quantumGold);
        
        // Add nodes to rings
        for(let n=0; n<12; n++) {
            const nodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
            const node = new THREE.Mesh(nodeGeo, pureEnergy);
            const angle = (n/12)*Math.PI*2;
            node.position.set(Math.cos(angle)*(12 + r*1.5), Math.sin(angle)*(12 + r*1.5), 0);
            ring.add(node);
        }
        
        coreGroup.add(ring);
        meshes.coreRings.push({
            mesh: ring, 
            speed: (Math.random()-0.5)*0.1, 
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
        });
    }
    group.add(coreGroup);
    meshes.core = coreGroup;
    parts.push({
        name: "Spacetime_Loom_Core", 
        description: "Central processing unit mapping spatial volume eigenstates. Acts as the brain of the loop weaving process.", 
        material: "glass, glowing flux, quantum gold",
        function: "Quantum computation and geometry routing", 
        assemblyOrder: 3, 
        connections: ["Weaver_Chassis", "Loop_Stabilizer_Ring"],
        failureEffect: "Loss of geometric volume, resulting in localized 2D space.", 
        cascadeFailures: ["Loop_Stabilizer_Ring", "Spin_Network_Extruder"], 
        originalPosition: {x:0, y:30, z:0}, 
        explodedPosition: {x:0, y:80, z:0}
    });

    // --- PART 4: Hydraulic Actuators ---
    const hydraulicGroup = new THREE.Group();
    meshes.pistons = [];
    for(let i=0; i<12; i++) {
        const arm = new THREE.Group();
        const angle = (i/12)*Math.PI*2;
        
        // Complex outer cylinder with ribs
        const outerCylGeo = new THREE.CylinderGeometry(1.5, 2.0, 15, 32);
        const outerCyl = new THREE.Mesh(outerCylGeo, darkSteel);
        outerCyl.position.y = 7.5;
        
        for(let r=0; r<10; r++) {
            const ribGeo = new THREE.TorusGeometry(1.8 + (r*0.02), 0.2, 16, 32);
            const rib = new THREE.Mesh(ribGeo, chrome);
            rib.rotation.x = Math.PI/2;
            rib.position.y = r*1.2 - 5;
            outerCyl.add(rib);
        }
        
        const innerCylGeo = new THREE.CylinderGeometry(1.0, 1.0, 15, 32);
        const innerCyl = new THREE.Mesh(innerCylGeo, chrome);
        innerCyl.position.y = 15;
        
        // Top joint
        const jointGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const joint = new THREE.Mesh(jointGeo, steel);
        joint.position.y = 7.5;
        innerCyl.add(joint);
        
        arm.add(outerCyl);
        arm.add(innerCyl);
        
        arm.position.set(Math.cos(angle)*18, 10, Math.sin(angle)*18);
        arm.lookAt(0, 30, 0); // Point at core
        arm.rotateX(Math.PI/2);
        
        hydraulicGroup.add(arm);
        meshes.pistons.push({inner: innerCyl, baseHeight: 15, offset: i, phaseSpeed: 2 + Math.random()});
    }
    group.add(hydraulicGroup);
    parts.push({
        name: "Hydraulic_Actuators", 
        description: "Massive dark steel actuators tuning the cosmological constant pressure dynamically.", 
        material: "darkSteel, chrome",
        function: "Pressure regulation & Core Support", 
        assemblyOrder: 4, 
        connections: ["Weaver_Chassis", "Spacetime_Loom_Core"],
        failureEffect: "Explosive expansion of local space.", 
        cascadeFailures: ["Spacetime_Loom_Core"], 
        originalPosition: {x:0, y:10, z:0}, 
        explodedPosition: {x:0, y:0, z:50}
    });

    // --- PART 5: Spin Network Extruder & Network ---
    const networkGroup = new THREE.Group();
    meshes.nodes = [];
    meshes.links = [];
    
    // Procedurally generate a massive 3D graph (Spin Network) - 500 nodes
    const nodeCount = 500;
    const nodes = [];
    
    // Use an advanced geometry for the quanta of volume
    const nodeGeo = new THREE.IcosahedronGeometry(0.6, 0); 
    
    for(let i=0; i<nodeCount; i++) {
        const x = (Math.random()-0.5)*60;
        const y = (Math.random()-0.5)*40 + 60; // Floating above the machine
        const z = (Math.random()-0.5)*60;
        nodes.push(new THREE.Vector3(x,y,z));
        
        const nodeMat = (i%3 === 0) ? neonPink : (i%3 === 1) ? neonBlue : neonGreen;
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(x,y,z);
        networkGroup.add(nodeMesh);
        
        meshes.nodes.push({
            mesh: nodeMesh, 
            orig: new THREE.Vector3(x,y,z), 
            phaseX: Math.random()*Math.PI*2,
            phaseY: Math.random()*Math.PI*2,
            phaseZ: Math.random()*Math.PI*2,
            speed: 1 + Math.random()*2
        });
    }
    
    const linkGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    // Connect nodes based on proximity to form a physical mesh
    for(let i=0; i<nodeCount; i++) {
        let connectionCount = 0;
        for(let j=i+1; j<nodeCount; j++) {
            const dist = nodes[i].distanceTo(nodes[j]);
            if(dist < 8.0 && connectionCount < 4) { // Max 4 links per node to avoid visual clutter
                const link = new THREE.Mesh(linkGeo, fluxMat);
                networkGroup.add(link);
                meshes.links.push({mesh: link, a: meshes.nodes[i], b: meshes.nodes[j]});
                connectionCount++;
            }
        }
    }
    
    // Extruder arm mechanism pointing at the network
    const extruderArm = new THREE.Group();
    const extBase = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 10, 32), darkSteel);
    extBase.position.y = 5;
    const extMid = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 32), chrome);
    extMid.position.y = 20;
    const extTip = new THREE.Mesh(new THREE.ConeGeometry(4, 10, 16), fluxMat);
    extTip.position.y = 35;
    extruderArm.add(extBase, extMid, extTip);
    extruderArm.position.set(0, 30, 0); // Originates from core
    group.add(extruderArm);
    meshes.extruder = extruderArm;

    group.add(networkGroup);
    parts.push({
        name: "Spin_Network_Extruder", 
        description: "Injects discrete quanta of area and volume into the void, constructing physical reality.", 
        material: "darkSteel, chrome, fluxMat",
        function: "Space Fabrication", 
        assemblyOrder: 5, 
        connections: ["Spacetime_Loom_Core"],
        failureEffect: "Tear in the fabric of reality, causing a vacuum decay event.", 
        cascadeFailures: ["The Universe"], 
        originalPosition: {x:0, y:60, z:0}, 
        explodedPosition: {x:0, y:120, z:0}
    });

    // --- PART 6: Planck Scale Calibrator ---
    const calibratorGroup = new THREE.Group();
    meshes.calibratorNeedles = [];
    for(let i=0; i<24; i++) {
        const needleBase = new THREE.Group();
        
        const needleGeo = new THREE.ConeGeometry(0.3, 15, 16);
        const needle = new THREE.Mesh(needleGeo, steel);
        needle.rotation.x = -Math.PI/2;
        
        // Glow ring on needle
        const ringGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
        const ring = new THREE.Mesh(ringGeo, neonBlue);
        ring.position.z = -5; // Since needle is rotated
        needle.add(ring);
        
        needleBase.add(needle);
        needleBase.position.set(Math.cos(i/24 * Math.PI*2)*15, 45, Math.sin(i/24 * Math.PI*2)*15);
        needleBase.lookAt(0, 60, 0);
        
        calibratorGroup.add(needleBase);
        meshes.calibratorNeedles.push({mesh: needleBase, origPos: needleBase.position.clone(), idx: i});
    }
    group.add(calibratorGroup);
    parts.push({
        name: "Planck_Scale_Calibrator", 
        description: "Ultra-precise needles that measure loop areas to the order of 10^-70 m^2.", 
        material: "steel, neonBlue",
        function: "Calibration of quantum geometry", 
        assemblyOrder: 6, 
        connections: ["Spin_Network_Extruder"],
        failureEffect: "Area quantization becomes continuous, breaking LQG rules.", 
        cascadeFailures: ["Spin_Network_Extruder"], 
        originalPosition: {x:0, y:45, z:0}, 
        explodedPosition: {x:50, y:45, z:0}
    });

    // --- PART 7: Operator Cabin ---
    const cabinGroup = new THREE.Group();
    // Complex faceted cabin
    const cabinGeo = new THREE.OctahedronGeometry(10, 1);
    const cabin = new THREE.Mesh(cabinGeo, tinted);
    cabinGroup.add(cabin);
    
    // Cabin frame
    const frameGeo = new THREE.OctahedronGeometry(10.2, 1);
    const frameMat = new THREE.MeshStandardMaterial({color: 0x222222, wireframe: true});
    const frame = new THREE.Mesh(frameGeo, frameMat);
    cabinGroup.add(frame);

    // Inner glowing console details visible through tinted glass
    const innerConsole = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), darkSteel);
    innerConsole.position.set(0, -3, 2);
    const innerScreen = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), neonGreen);
    innerScreen.position.set(0, -1, 3.5);
    innerScreen.rotation.x = -Math.PI/4;
    cabinGroup.add(innerConsole, innerScreen);
    
    cabinGroup.position.set(0, 15, 35);
    group.add(cabinGroup);
    parts.push({
        name: "Operator_Cabin", 
        description: "Shielded observation deck protected from severe time dilation and spatial warping.", 
        material: "tinted glass, steel frame",
        function: "Operator safety and control", 
        assemblyOrder: 7, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Operator ages infinitely in an instant.", 
        cascadeFailures: ["None"], 
        originalPosition: {x:0, y:15, z:35}, 
        explodedPosition: {x:0, y:15, z:80}
    });

    // --- PART 8: Loop Stabilizer Ring ---
    const stabRingGroup = new THREE.Group();
    const stabRingGeo = new THREE.TorusGeometry(25, 2, 64, 200);
    const stabRing = new THREE.Mesh(stabRingGeo, neonPurple);
    stabRingGroup.add(stabRing);
    
    // Add magnetic containment nodes along the ring
    for(let i=0; i<36; i++) {
        const magGeo = new THREE.BoxGeometry(3, 4, 6);
        const mag = new THREE.Mesh(magGeo, darkSteel);
        const angle = (i/36)*Math.PI*2;
        mag.position.set(Math.cos(angle)*25, Math.sin(angle)*25, 0);
        mag.rotation.z = angle;
        stabRingGroup.add(mag);
    }
    
    stabRingGroup.position.set(0, 40, 0);
    stabRingGroup.rotation.x = Math.PI/2;
    group.add(stabRingGroup);
    meshes.stabRing = stabRingGroup;
    parts.push({
        name: "Loop_Stabilizer_Ring", 
        description: "Massive glowing torus maintaining the superposition of loop states before collapse.", 
        material: "neonPurple, darkSteel",
        function: "Quantum State Stabilization", 
        assemblyOrder: 8, 
        connections: ["Spacetime_Loom_Core"],
        failureEffect: "Decoherence of the entire spin network.", 
        cascadeFailures: ["Spin_Network_Extruder"], 
        originalPosition: {x:0, y:40, z:0}, 
        explodedPosition: {x:0, y:90, z:0}
    });

    // --- PART 9: Dark Energy Turbine ---
    const turbineGroup = new THREE.Group();
    meshes.turbineBlades = [];
    const turbineCoreGeo = new THREE.CylinderGeometry(5, 5, 25, 32);
    const turbineCore = new THREE.Mesh(turbineCoreGeo, darkSteel);
    turbineCore.rotation.z = Math.PI/2;
    turbineGroup.add(turbineCore);
    
    // Dual counter-rotating blade stages
    for(let stage=0; stage<2; stage++) {
        const stageGroup = new THREE.Group();
        stageGroup.position.x = (stage===0) ? -6 : 6;
        for(let i=0; i<24; i++) {
            const bladeGeo = new THREE.BoxGeometry(0.8, 12, 3);
            // twist the blade
            const posAttr = bladeGeo.attributes.position;
            for(let v=0; v<posAttr.count; v++) {
                const y = posAttr.getY(v);
                const x = posAttr.getX(v);
                const z = posAttr.getZ(v);
                const angle = y * 0.1;
                posAttr.setX(v, x * Math.cos(angle) - z * Math.sin(angle));
                posAttr.setZ(v, x * Math.sin(angle) + z * Math.cos(angle));
            }
            bladeGeo.computeVertexNormals();
            
            const blade = new THREE.Mesh(bladeGeo, darkEnergyMat);
            blade.position.y = 8;
            
            const pivot = new THREE.Group();
            pivot.rotation.x = (i/24) * Math.PI*2;
            pivot.add(blade);
            stageGroup.add(pivot);
        }
        turbineGroup.add(stageGroup);
        meshes.turbineBlades.push({group: stageGroup, dir: stage===0 ? 1 : -1});
    }
    
    turbineGroup.position.set(0, -5, -25);
    group.add(turbineGroup);
    parts.push({
        name: "Dark_Energy_Turbine", 
        description: "Extracts expansion energy directly from the quantum vacuum to power the loom.", 
        material: "darkSteel, darkEnergyMat",
        function: "Power Generation via Vacuum Energy", 
        assemblyOrder: 9, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Power loss, spontaneous vacuum decay bubble creation.", 
        cascadeFailures: ["All"], 
        originalPosition: {x:0, y:-5, z:-25}, 
        explodedPosition: {x:0, y:-30, z:-60}
    });

    // --- PART 10: Graviton Resonator ---
    const resonatorGroup = new THREE.Group();
    const resBaseGeo = new THREE.CylinderGeometry(4, 8, 12, 32);
    const resBase = new THREE.Mesh(resBaseGeo, copper);
    resonatorGroup.add(resBase);
    
    meshes.resSpheres = [];
    // Nested emitting spheres
    for(let i=0; i<5; i++) {
        const sphereGeo = new THREE.SphereGeometry(3 - i*0.4, 32, 32);
        const sphere = new THREE.Mesh(sphereGeo, i%2===0 ? pureEnergy : neonBlue);
        sphere.position.y = 10 + i*6;
        resonatorGroup.add(sphere);
        
        // Add orbiting particles to each sphere
        const particles = new THREE.Group();
        for(let p=0; p<10; p++) {
            const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), neonPink);
            pMesh.position.set(4, 0, 0);
            const pPivot = new THREE.Group();
            pPivot.rotation.y = (p/10)*Math.PI*2;
            pPivot.rotation.z = Math.random()*Math.PI;
            pPivot.add(pMesh);
            particles.add(pPivot);
        }
        particles.position.copy(sphere.position);
        resonatorGroup.add(particles);
        
        meshes.resSpheres.push({mesh: sphere, particles: particles, offset: i});
    }
    resonatorGroup.position.set(-25, 15, -15);
    group.add(resonatorGroup);
    parts.push({
        name: "Graviton_Resonator", 
        description: "Channels speculative spin-2 particles into the weave to enforce metric continuity.", 
        material: "copper, pureEnergy, neonBlue",
        function: "Force Carrier Emitter", 
        assemblyOrder: 10, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Gravity becomes repulsive locally.", 
        cascadeFailures: ["Quantum_Treads"], 
        originalPosition: {x:-25, y:15, z:-15}, 
        explodedPosition: {x:-70, y:15, z:-15}
    });

    // --- PART 11: Tensor Field Projector ---
    const projectorGroup = new THREE.Group();
    // Use the fractal antenna function
    for(let i=0; i<6; i++) {
        const antenna = createFractalAntenna(4, 3);
        const angle = (i/6)*Math.PI*2;
        antenna.position.set(Math.cos(angle)*8, 0, Math.sin(angle)*8);
        projectorGroup.add(antenna);
    }
    const projBase = new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 4, 32), darkSteel);
    projBase.position.y = -2;
    projectorGroup.add(projBase);
    
    projectorGroup.position.set(25, 15, -15);
    group.add(projectorGroup);
    meshes.projector = projectorGroup;
    parts.push({
        name: "Tensor_Field_Projector", 
        description: "Fractal antenna array radiating metric tensors to govern local distance logic.", 
        material: "chrome, darkSteel",
        function: "Metric Field Broadcast", 
        assemblyOrder: 11, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Metric tensor becomes ill-defined, distance loses meaning.", 
        cascadeFailures: ["Graviton_Resonator"], 
        originalPosition: {x:25, y:15, z:-15}, 
        explodedPosition: {x:70, y:15, z:-15}
    });

    // --- PART 12: Entanglement Spools ---
    const spoolGroup = new THREE.Group();
    meshes.spools = [];
    for(let i=0; i<6; i++) {
        const spool = new THREE.Group();
        const coreGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
        const core = new THREE.Mesh(coreGeo, plastic);
        const capGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
        const capTop = new THREE.Mesh(capGeo, steel);
        capTop.position.y = 5;
        const capBot = new THREE.Mesh(capGeo, steel);
        capBot.position.y = -5;
        
        // Highly detailed thread wrapped around spool (Torus knot)
        const threadGeo = new THREE.TorusKnotGeometry(2.5, 0.4, 100, 16, 2, 25);
        const thread = new THREE.Mesh(threadGeo, neonPink);
        thread.scale.set(1, 1.8, 1);
        
        spool.add(core, capTop, capBot, thread);
        spool.position.set(-20 + i*8, 10, 25);
        spoolGroup.add(spool);
        meshes.spools.push({mesh: spool, speed: 0.05 + Math.random()*0.05});
    }
    group.add(spoolGroup);
    parts.push({
        name: "Entanglement_Spools", 
        description: "Massive reels holding raw, 1D entangled quantum threads before weaving into 3D volume.", 
        material: "steel, plastic, neonPink",
        function: "Raw Material Storage", 
        assemblyOrder: 12, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Spooky action at a distance becomes unspooled, causing instant paradox.", 
        cascadeFailures: ["Spin_Network_Extruder"], 
        originalPosition: {x:0, y:10, z:25}, 
        explodedPosition: {x:0, y:-10, z:60}
    });

    // --- PART 13: Holographic Display Console ---
    const consoleGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(8, 4, 2);
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    consoleGroup.add(panel);
    
    // Complex hologram inside cabin
    const holoGeo = new THREE.PlaneGeometry(7, 4);
    const holo = new THREE.Mesh(holoGeo, fluxMat);
    holo.position.set(0, 4, 0);
    
    // Add floating equations/symbols (simulated via small geometries)
    for(let k=0; k<15; k++){
        const sym = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2), pureEnergy);
        sym.position.set((Math.random()-0.5)*6, 4+(Math.random()-0.5)*3, 0.5 + Math.random());
        consoleGroup.add(sym);
    }
    
    consoleGroup.add(holo);
    consoleGroup.position.set(0, 12, 30); // Right in front of cabin
    consoleGroup.rotation.x = -Math.PI/6;
    group.add(consoleGroup);
    parts.push({
        name: "Holographic_Display_Console", 
        description: "Displays Feynman path integrals and node adjacency matrices in real-time.", 
        material: "darkSteel, fluxMat",
        function: "User Interface", 
        assemblyOrder: 13, 
        connections: ["Operator_Cabin"],
        failureEffect: "Operator blind to quantum fluctuations, weave drifts.", 
        cascadeFailures: ["None"], 
        originalPosition: {x:0, y:12, z:30}, 
        explodedPosition: {x:0, y:20, z:40}
    });

    // --- PART 14: Exotica Containment Vessel ---
    const vesselGroup = new THREE.Group();
    // Glass tank with ribbed supports
    const tankGeo = new THREE.CylinderGeometry(6, 6, 18, 32);
    const tank = new THREE.Mesh(tankGeo, glass);
    
    for(let i=0; i<8; i++){
        const rib = new THREE.Mesh(new THREE.BoxGeometry(1, 18, 1), steel);
        const angle = (i/8)*Math.PI*2;
        rib.position.set(Math.cos(angle)*6.2, 0, Math.sin(angle)*6.2);
        vesselGroup.add(rib);
    }
    
    // Bubbling internal fluid
    const fluidGeo = new THREE.CylinderGeometry(5.8, 5.8, 17, 32);
    const fluid = new THREE.Mesh(fluidGeo, neonGreen);
    vesselGroup.add(tank, fluid);
    
    meshes.bubbles = [];
    for(let b=0; b<40; b++){
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*0.5+0.2, 8,8), pureEnergy);
        bubble.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*16, (Math.random()-0.5)*10);
        vesselGroup.add(bubble);
        meshes.bubbles.push(bubble);
    }
    
    vesselGroup.position.set(-35, 18, 0);
    group.add(vesselGroup);
    parts.push({
        name: "Exotica_Containment_Vessel", 
        description: "Stores exotic matter with negative mass for topological stabilization of the spin network.", 
        material: "glass, steel, neonGreen",
        function: "Exotic Matter Storage", 
        assemblyOrder: 14, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Topological collapse, spontaneous wormhole generation.", 
        cascadeFailures: ["Hydraulic_Actuators"], 
        originalPosition: {x:-35, y:18, z:0}, 
        explodedPosition: {x:-80, y:18, z:0}
    });

    // --- PART 15: Chronos Synchronization Gears ---
    const gearsGroup = new THREE.Group();
    meshes.gears = [];
    for(let i=0; i<12; i++) {
        const teeth = 12 + (i%3)*6; // Varying teeth size
        const radius = teeth * 0.3;
        const gearGeo = createGear(radius, teeth, 2);
        const gear = new THREE.Mesh(gearGeo, copper);
        
        // Calculate interlocking positions
        const xPos = 35;
        const yPos = 10 + i*4.5;
        const zPos = (i%2===0) ? 0 : radius; 
        
        gear.position.set(xPos, yPos, zPos);
        gear.rotation.x = Math.PI/2;
        
        // Gear center hole
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(1,1,3,16), darkSteel);
        hole.rotation.x = Math.PI/2;
        gear.add(hole);
        
        gearsGroup.add(gear);
        // Interlocking gear speeds
        const speed = 0.1 * (24/teeth) * (i%2===0 ? 1 : -1);
        meshes.gears.push({mesh: gear, speed: speed});
    }
    group.add(gearsGroup);
    parts.push({
        name: "Chronos_Synchronization_Gears", 
        description: "Physical mechanism that aligns proper time across different reference frames of the quantum weave.", 
        material: "copper, darkSteel",
        function: "Temporal Sync", 
        assemblyOrder: 15, 
        connections: ["Weaver_Chassis"],
        failureEffect: "Time desynchronization; machine exists in multiple times simultaneously.", 
        cascadeFailures: ["Spacetime_Loom_Core"], 
        originalPosition: {x:35, y:15, z:0}, 
        explodedPosition: {x:80, y:15, z:0}
    });

    // --- PART 16: Geodesic Manipulator Claws ---
    const clawGroup = new THREE.Group();
    meshes.claws = [];
    for(let i=0; i<4; i++) {
        const clawBase = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(3, 10, 3);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        
        // Multi-jointed pincers
        const pincer1 = new THREE.Group();
        const p1Mesh = new THREE.Mesh(new THREE.ConeGeometry(0.8, 6, 16), chrome);
        p1Mesh.position.y = 3;
        pincer1.add(p1Mesh);
        pincer1.position.set(-1.5, 5, 0);
        
        const pincer2 = new THREE.Group();
        const p2Mesh = new THREE.Mesh(new THREE.ConeGeometry(0.8, 6, 16), chrome);
        p2Mesh.position.y = 3;
        pincer2.add(p2Mesh);
        pincer2.position.set(1.5, 5, 0);
        
        clawBase.add(base, pincer1, pincer2);
        
        const angle = (i/4)*Math.PI*2;
        clawBase.position.set(Math.cos(angle)*15, 25, Math.sin(angle)*15);
        clawBase.lookAt(0, 45, 0); // Aim at the weave
        clawBase.rotateX(Math.PI/2);
        
        clawGroup.add(clawBase);
        meshes.claws.push({mesh: clawBase, p1: pincer1, p2: pincer2, phase: i*Math.PI/2});
    }
    group.add(clawGroup);
    parts.push({
        name: "Geodesic_Manipulator_Claws", 
        description: "Directly manipulates the shortest paths through curved spacetime, acting as the physical hands of the loom.", 
        material: "darkSteel, chrome",
        function: "Weaving Hands", 
        assemblyOrder: 16, 
        connections: ["Weaver_Chassis", "Hydraulic_Actuators"],
        failureEffect: "Geodesics become chaotic, leading to infinite travel times.", 
        cascadeFailures: ["Spin_Network_Extruder"], 
        originalPosition: {x:0, y:25, z:0}, 
        explodedPosition: {x:0, y:50, z:30}
    });

    const description = "Ultra God Tier Loop Quantum Gravity Weave: A hyper-advanced macroscopic visualizer and fabricator of the discrete, woven nature of spacetime according to LQG. Featuring 16+ highly complex systems including functional chronos gears, a dynamically updating 500-node spin network, tensor field projectors, and sub-Planck calibrators. This machine physically embodies the Wheeler-DeWitt equations.";

    const quizQuestions = [
        {
            question: "In Loop Quantum Gravity, what does the Spin Network physically represent?",
            options: [
                "Strings vibrating in 11 dimensions.",
                "The quantum state of the gravitational field, dictating discrete quantum area and volume.",
                "A grid of dark matter interacting with baryonic matter.",
                "The paths of gravitons in continuous Minkowski space."
            ],
            correctAnswer: 1,
            explanation: "In LQG, space is not a continuous background but is formed by discrete, quantized chunks. The Spin Network is a graph whose nodes represent quantized volume and links represent quantized area."
        },
        {
            question: "How is the area spectrum quantized in LQG?",
            options: [
                "It is continuous and can take any value.",
                "It is proportional to the square root of the spin quantum number j(j+1).",
                "It is exponentially proportional to the mass of the black hole.",
                "It strictly follows the Fibonacci sequence."
            ],
            correctAnswer: 1,
            explanation: "The area operator in LQG has a discrete spectrum, proportional to the Planck length squared multiplied by sqrt(j(j+1)), where j is a half-integer spin from SU(2) representations."
        },
        {
            question: "What mathematical structure replaces the standard metric tensor in the canonical formulation of LQG?",
            options: [
                "Ashtekar variables (densitized triads and SU(2) connections).",
                "Ricci flow tensors.",
                "Kaluza-Klein scalar fields.",
                "Spinor helicity variables."
            ],
            correctAnswer: 0,
            explanation: "LQG is based on rewriting General Relativity using Ashtekar variables, which consist of a densitized triad field (conjugate momentum) and an SU(2) gauge connection, allowing gravity to be quantized like a gauge theory."
        },
        {
            question: "What is the physical interpretation of a node in a spin network graph?",
            options: [
                "A point where a graviton decays.",
                "A quantum of spatial volume.",
                "A micro black hole.",
                "A geometric singularity."
            ],
            correctAnswer: 1,
            explanation: "Nodes in the spin network graph possess a volume operator, acting as discrete 'atoms' or quanta of 3D volume."
        },
        {
            question: "Which equation governs the quantum dynamics (time evolution) of spin networks in Loop Quantum Gravity?",
            options: [
                "The Dirac Equation.",
                "The Wheeler-DeWitt Equation (Hamiltonian constraint).",
                "The Schrödinger Equation.",
                "The Navier-Stokes Equations."
            ],
            correctAnswer: 1,
            explanation: "The Wheeler-DeWitt equation describes the quantum state of the universe, and in the context of canonical quantum gravity (and its LQG realization), it represents the Hamiltonian constraint governing the physical dynamics."
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Treads / Wheels
        if (activeMeshes.wheels) {
            activeMeshes.wheels.forEach(w => {
                w.rotation.x -= speed * 0.15;
            });
        }
        
        // Core Rings
        if (activeMeshes.coreRings) {
            activeMeshes.coreRings.forEach(r => {
                r.mesh.rotateOnAxis(r.axis, r.speed * speed * 2);
            });
        }
        
        // Stabilizer Ring
        if (activeMeshes.stabRing) {
            activeMeshes.stabRing.rotation.z += speed * 0.05;
            // Pulsing scale
            activeMeshes.stabRing.scale.setScalar(1 + Math.sin(time*3)*0.03);
        }
        
        // Hydraulic Actuators
        if (activeMeshes.pistons) {
            activeMeshes.pistons.forEach(p => {
                p.inner.position.y = p.baseHeight + Math.sin(time*p.phaseSpeed + p.offset)*3;
            });
        }
        
        // Turbine Blades
        if (activeMeshes.turbineBlades) {
            activeMeshes.turbineBlades.forEach(b => {
                b.group.rotation.x += speed * 0.3 * b.dir;
            });
        }
        
        // Graviton Resonator
        if (activeMeshes.resSpheres) {
            activeMeshes.resSpheres.forEach(s => {
                s.mesh.scale.setScalar(1 + Math.sin(time*5 + s.offset)*0.2);
                s.particles.rotation.y += speed * 0.2;
                s.particles.rotation.z += speed * 0.1;
            });
        }
        
        // Tensor Field Projector Array
        if (activeMeshes.projector) {
            activeMeshes.projector.rotation.y += speed * 0.02;
        }

        // Entanglement Spools
        if (activeMeshes.spools) {
            activeMeshes.spools.forEach(s => {
                s.mesh.rotation.y += s.speed * speed;
            });
        }
        
        // Exotica Containment Bubbles
        if (activeMeshes.bubbles) {
            activeMeshes.bubbles.forEach((b, idx) => {
                b.position.y += speed * 0.5 * (1 + idx%3);
                if(b.position.y > 8) b.position.y = -8;
                b.position.x += Math.sin(time*5 + idx)*0.05;
            });
        }

        // Chronos Gears
        if (activeMeshes.gears) {
            activeMeshes.gears.forEach(g => {
                g.mesh.rotation.y += g.speed * speed;
            });
        }
        
        // Manipulator Claws
        if (activeMeshes.claws) {
            activeMeshes.claws.forEach((c) => {
                // Pincers open and close
                c.p1.rotation.z = -Math.PI/8 - Math.abs(Math.sin(time*3 + c.phase))*0.4;
                c.p2.rotation.z = Math.PI/8 + Math.abs(Math.sin(time*3 + c.phase))*0.4;
                // Base oscillates
                c.mesh.rotation.z = Math.sin(time*2 + c.phase)*0.15;
            });
        }

        // Extruder arm animation
        if (activeMeshes.extruder) {
            activeMeshes.extruder.rotation.y += Math.sin(time)*0.02;
            activeMeshes.extruder.rotation.z = Math.sin(time*2)*0.05;
        }
        
        // Calibrator Needles
        if (activeMeshes.calibratorNeedles) {
            activeMeshes.calibratorNeedles.forEach(n => {
                // In and out movement based on sine wave
                const offset = Math.sin(time*4 + n.idx)*1.5;
                n.mesh.position.copy(n.origPos).add(n.mesh.getWorldDirection(new THREE.Vector3()).multiplyScalar(offset));
            });
        }
        
        // SPIN NETWORK (Extreme calculation)
        if (activeMeshes.nodes && activeMeshes.links) {
            // Vibrate and breathe the nodes of space
            activeMeshes.nodes.forEach(n => {
                n.mesh.position.x = n.orig.x + Math.sin(time*n.speed + n.phaseX)*1.2;
                n.mesh.position.y = n.orig.y + Math.cos(time*n.speed*0.8 + n.phaseY)*1.2;
                n.mesh.position.z = n.orig.z + Math.sin(time*n.speed*1.1 + n.phaseZ)*1.2;
                n.mesh.scale.setScalar(1 + Math.sin(time*4 + n.phaseX)*0.3);
            });
            
            // Re-align area links dynamically
            activeMeshes.links.forEach(l => {
                const posA = l.a.mesh.position;
                const posB = l.b.mesh.position;
                const dist = posA.distanceTo(posB);
                
                // Position link exactly in the middle
                l.mesh.position.copy(posA).lerp(posB, 0.5);
                // Stretch cylinder to match distance
                l.mesh.scale.y = dist;
                // Orient towards target node
                l.mesh.lookAt(posB);
                // Cylinder default is Y-up, lookAt aligns Z-axis, so rotate to fix
                l.mesh.rotateX(Math.PI/2);
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
