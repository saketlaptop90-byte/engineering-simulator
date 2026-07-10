import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animateMeshes = [];
    
    // ==========================================
    // CUSTOM HIGHLIGHT / HYPER-TECH MATERIALS
    // ==========================================
    
    const trueVacuumMat = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0xaa00ff,
        emissiveIntensity: 10.0,
        metalness: 1.0,
        roughness: 0.0,
        transmission: 0.9,
        thickness: 2.0,
        wireframe: true
    });

    const innerCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 20.0,
        metalness: 1.0,
        roughness: 0.2
    });

    const realityTearMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const quantumGold = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1,
        emissive: 0xaa8800,
        emissiveIntensity: 1.2
    });

    const darkMatterIron = new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 0.9,
        roughness: 0.8,
        emissive: 0x110000,
        emissiveIntensity: 0.5
    });

    const pulsingPlasma = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9
    });

    const exoticAlloy = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const activeCopper = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 1.0,
        roughness: 0.3,
        emissive: 0xb87333,
        emissiveIntensity: 1.5
    });

    // ==========================================
    // HELPER FUNCTIONS FOR PROCEDURAL GEOMETRY
    // ==========================================
    
    function createGearTeeth(innerRadius, outerRadius, teethCount, depth) {
        const shape = new THREE.Shape();
        const angleStep = (Math.PI * 2) / (teethCount * 2);
        for (let i = 0; i < teethCount * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const a = i * angleStep;
            if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        shape.closePath();
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createFractalStruts(levels, size) {
        const struts = new THREE.Group();
        const geom = new THREE.CylinderGeometry(size*0.05, size*0.05, size, 8);
        for (let i=0; i<levels; i++) {
            const mesh = new THREE.Mesh(geom, chrome);
            mesh.position.set((Math.random()-0.5)*size, (Math.random()-0.5)*size, (Math.random()-0.5)*size);
            mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            struts.add(mesh);
        }
        return struts;
    }

    // ==========================================
    // SUBSYSTEM 1: TRUE VACUUM BUBBLE CORE
    // ==========================================
    
    const coreGroup = new THREE.Group();
    
    const coreIcosahedronGeom = new THREE.IcosahedronGeometry(5, 3);
    const coreMesh = new THREE.Mesh(coreIcosahedronGeom, innerCoreMat);
    coreGroup.add(coreMesh);
    
    const wireframeIcosahedronGeom = new THREE.IcosahedronGeometry(5.5, 4);
    const wireframeMesh = new THREE.Mesh(wireframeIcosahedronGeom, trueVacuumMat);
    coreGroup.add(wireframeMesh);
    
    const energyShellGeom = new THREE.TorusKnotGeometry(6, 0.2, 300, 20, 7, 11);
    const energyShellMesh = new THREE.Mesh(energyShellGeom, realityTearMat);
    coreGroup.add(energyShellMesh);

    group.add(coreGroup);
    animateMeshes.push({ mesh: wireframeMesh, type: 'coreWireframe' });
    animateMeshes.push({ mesh: energyShellMesh, type: 'coreEnergyShell' });
    animateMeshes.push({ mesh: coreMesh, type: 'corePulse' });

    parts.push({
        name: "True Vacuum Nucleation Core",
        description: "The epicenter where the false vacuum is collapsing into the true vacuum, creating an expanding bubble of absolute lower energy state.",
        material: "Exotic Antimatter-laced Carbon",
        function: "Catalyzes and contains the nucleation event.",
        assemblyOrder: 1,
        connections: ["Inner Containment Ring Alpha", "Singularity Dampeners"],
        failureEffect: "Spontaneous total existence failure expanding at exactly the speed of light.",
        cascadeFailures: ["Complete Universe", "All Timelines"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // ==========================================
    // SUBSYSTEM 2: REALITY TEARS (FRACTURES)
    // ==========================================
    
    const fracturesGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
        const length = 5 + Math.random() * 10;
        const width = 0.1 + Math.random() * 0.5;
        const fracGeom = new THREE.PlaneGeometry(length, width, 10, 2);
        
        // distort vertices
        const posAttr = fracGeom.attributes.position;
        for(let j=0; j<posAttr.count; j++) {
            posAttr.setY(j, posAttr.getY(j) + (Math.random() - 0.5) * 1.5);
        }
        fracGeom.computeVertexNormals();
        
        const fracMesh = new THREE.Mesh(fracGeom, realityTearMat);
        fracMesh.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        fracMesh.lookAt(0,0,0);
        fracturesGroup.add(fracMesh);
        animateMeshes.push({ mesh: fracMesh, type: 'fracture', offset: Math.random() * 100 });
    }
    group.add(fracturesGroup);

    parts.push({
        name: "Spacetime Fractures",
        description: "Localized tearing of the cosmic manifold caused by the immense energy density gradient at the domain wall.",
        material: "Pure Energy / Broken Topology",
        function: "Visual byproduct of localized reality failure.",
        assemblyOrder: 2,
        connections: ["True Vacuum Nucleation Core"],
        failureEffect: "Expansion of rips into higher dimensions.",
        cascadeFailures: ["Local Topology", "Gravity Vectors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 50 }
    });

    // ==========================================
    // SUBSYSTEM 3: CONTAINMENT RINGS (MASSIVE ARRAY)
    // ==========================================
    
    const ringsGroup = new THREE.Group();
    const ringCount = 12;
    const ringParts = [];
    
    for (let i = 0; i < ringCount; i++) {
        const radius = 12 + i * 4;
        const tube = 1.5 + Math.random() * 2;
        const rGroup = new THREE.Group();

        // Base Ring
        const ringGeom = new THREE.TorusGeometry(radius, tube, 32, 100);
        const ringMesh = new THREE.Mesh(ringGeom, i % 2 === 0 ? darkMatterIron : exoticAlloy);
        rGroup.add(ringMesh);

        // Gear Teeth outer
        const gearGeom = createGearTeeth(radius + tube, radius + tube + 2, 30 + i * 5, 2);
        const gearMesh = new THREE.Mesh(gearGeom, steel);
        gearMesh.rotation.x = Math.PI / 2;
        gearMesh.position.y = -1;
        rGroup.add(gearMesh);

        // Inner focus nodes
        const nodes = 12;
        for (let j = 0; j < nodes; j++) {
            const angle = (j / nodes) * Math.PI * 2;
            const nodeGeom = new THREE.CylinderGeometry(0.8, 1.2, 4, 16);
            const nodeMesh = new THREE.Mesh(nodeGeom, activeCopper);
            nodeMesh.position.set(Math.cos(angle) * (radius - tube), 0, Math.sin(angle) * (radius - tube));
            nodeMesh.rotation.x = Math.PI / 2;
            nodeMesh.lookAt(0,0,0);
            rGroup.add(nodeMesh);
        }

        // Add heat sink fins
        const finCount = 60;
        const finGeom = new THREE.BoxGeometry(0.5, tube * 2.5, 3);
        for(let k=0; k<finCount; k++) {
            const fAngle = (k / finCount) * Math.PI * 2;
            const finMesh = new THREE.Mesh(finGeom, aluminum);
            finMesh.position.set(Math.cos(fAngle) * (radius), 0, Math.sin(fAngle) * (radius));
            finMesh.rotation.y = -fAngle;
            rGroup.add(finMesh);
        }

        rGroup.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        ringsGroup.add(rGroup);

        animateMeshes.push({ 
            mesh: rGroup, 
            type: 'strugglingRing', 
            baseSpeed: (Math.random() < 0.5 ? 1 : -1) * (0.005 + Math.random() * 0.02),
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
            struggleIntensity: i
        });

        ringParts.push(rGroup);

        parts.push({
            name: `Containment Ring ${String.fromCharCode(65 + i)}`,
            description: `A massive super-dense ring generating anti-metric tensors to push back the domain wall of the true vacuum.`,
            material: i % 2 === 0 ? "Dark Matter Iron" : "Exotic Alloy",
            function: "Counters the outward pressure of the false vacuum decay.",
            assemblyOrder: 3 + i,
            connections: ["Hydraulic Stabilizers", i === 0 ? "True Vacuum Nucleation Core" : `Containment Ring ${String.fromCharCode(64 + i)}`],
            failureEffect: "Ring shatters, instantly reducing containment pressure by " + (100 / ringCount).toFixed(2) + "%.",
            cascadeFailures: ["Adjacent Rings", "Reality Anchors"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: (i % 2 === 0 ? 100 : -100), y: i * 20 - 100, z: (i % 3 === 0 ? 100 : -100) }
        });
    }
    group.add(ringsGroup);

    // ==========================================
    // SUBSYSTEM 4: REALITY ANCHORS (MASSIVE PYLONS)
    // ==========================================
    
    const anchorsGroup = new THREE.Group();
    const anchorCount = 8;
    const anchorDistance = 75;

    // Profile for lathe geometry (creating a massive tech pylon)
    const points = [];
    for ( let i = 0; i < 50; i ++ ) {
        const y = (i - 25) * 2; // -50 to +50
        const x = 5 + Math.sin(i * 0.5) * 2 + (i < 10 || i > 40 ? 5 : 0) + (i % 5 === 0 ? 3 : 0);
        points.push( new THREE.Vector2( x, y ) );
    }
    const pylonGeom = new THREE.LatheGeometry(points, 32);
    
    for (let i = 0; i < anchorCount; i++) {
        const angle = (i / anchorCount) * Math.PI * 2;
        const pylon = new THREE.Group();
        
        const pylonMesh = new THREE.Mesh(pylonGeom, darkSteel);
        pylon.add(pylonMesh);

        // Add glowing inserts
        const insertGeom = new THREE.CylinderGeometry(4.5, 4.5, 90, 32);
        const insertMesh = new THREE.Mesh(insertGeom, pulsingPlasma);
        pylon.add(insertMesh);
        animateMeshes.push({ mesh: insertMesh, type: 'pulse', offset: i });

        // Add extreme detailing to pylons (hundreds of boxes)
        for (let j = 0; j < 100; j++) {
            const detGeom = new THREE.BoxGeometry(2, 1, 2);
            const detMesh = new THREE.Mesh(detGeom, chrome);
            const h = (Math.random() - 0.5) * 90;
            const r = 6 + Math.random() * 4;
            const a = Math.random() * Math.PI * 2;
            detMesh.position.set(Math.cos(a)*r, h, Math.sin(a)*r);
            detMesh.lookAt(0, h, 0);
            pylon.add(detMesh);
        }

        // Top and Bottom singularity dampeners
        const dampGeom = new THREE.IcosahedronGeometry(8, 1);
        const topDamp = new THREE.Mesh(dampGeom, trueVacuumMat);
        topDamp.position.y = 55;
        const botDamp = new THREE.Mesh(dampGeom, trueVacuumMat);
        botDamp.position.y = -55;
        pylon.add(topDamp);
        pylon.add(botDamp);
        
        animateMeshes.push({ mesh: topDamp, type: 'dampener' });
        animateMeshes.push({ mesh: botDamp, type: 'dampener' });

        pylon.position.set(Math.cos(angle) * anchorDistance, 0, Math.sin(angle) * anchorDistance);
        // Tilt slightly towards center
        pylon.lookAt(0, 50, 0);
        pylon.rotation.x -= Math.PI / 2;
        
        anchorsGroup.add(pylon);
        
        parts.push({
            name: `Reality Anchor ${i+1}`,
            description: `Pins the local spacetime metric to the cosmic background, preventing the false vacuum bubble from ripping the laboratory out of the universe.`,
            material: "Dark Steel & Pulsing Plasma",
            function: "Stabilizes the external coordinate system.",
            assemblyOrder: 15 + i,
            connections: ["Ground Framework", "Energy Extractors"],
            failureEffect: "Pylon is consumed by the vacuum; local spacetime distorts heavily.",
            cascadeFailures: ["Orbital Mechanics", "Gravity"],
            originalPosition: { x: pylon.position.x, y: pylon.position.y, z: pylon.position.z },
            explodedPosition: { x: pylon.position.x * 2.5, y: (i%2===0 ? 50 : -50), z: pylon.position.z * 2.5 }
        });
    }
    group.add(anchorsGroup);

    // ==========================================
    // SUBSYSTEM 5: ENERGY EXTRACTORS (INWARD SPIKES)
    // ==========================================
    
    const extractorGroup = new THREE.Group();
    const exCount = 24;
    
    // Extractor Geometry - extremely complex compound shape
    for(let i=0; i<exCount; i++) {
        const exPivot = new THREE.Group();
        
        // Main Shaft
        const shaftGeom = new THREE.CylinderGeometry(0.5, 2, 40, 16);
        const shaft = new THREE.Mesh(shaftGeom, steel);
        shaft.position.y = 20;
        exPivot.add(shaft);

        // Coils around shaft
        const coilGeom = new THREE.TorusGeometry(2.5, 0.3, 16, 50);
        for(let c=0; c<10; c++) {
            const coil = new THREE.Mesh(coilGeom, activeCopper);
            coil.position.y = 10 + c * 3;
            coil.rotation.x = Math.PI/2;
            exPivot.add(coil);
        }

        // Tip (Touches the true vacuum)
        const tipGeom = new THREE.ConeGeometry(1, 5, 16);
        const tip = new THREE.Mesh(tipGeom, quantumGold);
        tip.position.y = 0;
        exPivot.add(tip);

        // Complex hydraulic arms holding the extractor
        const armGeom = new THREE.BoxGeometry(1, 10, 1);
        const arm1 = new THREE.Mesh(armGeom, darkSteel);
        arm1.position.set(-3, 20, 0);
        arm1.rotation.z = 0.2;
        const arm2 = new THREE.Mesh(armGeom, darkSteel);
        arm2.position.set(3, 20, 0);
        arm2.rotation.z = -0.2;
        exPivot.add(arm1);
        exPivot.add(arm2);

        // Position spherically around the core, pointing inwards
        const phi = Math.acos( -1 + ( 2 * i ) / exCount );
        const theta = Math.sqrt( exCount * Math.PI ) * phi;
        
        exPivot.position.setFromSphericalCoords(45, phi, theta);
        exPivot.lookAt(0,0,0);
        exPivot.rotation.x -= Math.PI/2; // Align cylinder along radial vector

        extractorGroup.add(exPivot);
        animateMeshes.push({ mesh: exPivot, type: 'extractor', originalPos: exPivot.position.clone(), dir: exPivot.position.clone().normalize() });

        parts.push({
            name: `Vacuum Energy Extractor ${i+1}`,
            description: `Penetrates the domain wall to tap into the infinite negative energy density of the true vacuum.`,
            material: "Quantum Gold Tipped Steel",
            function: "Draws zero-point energy from the lower vacuum state.",
            assemblyOrder: 30 + i,
            connections: ["Containment Rings", "Power Conduits"],
            failureEffect: "Tip melts, causing a massive feedback loop of Hawking radiation.",
            cascadeFailures: ["Power Grid"],
            originalPosition: { x: exPivot.position.x, y: exPivot.position.y, z: exPivot.position.z },
            explodedPosition: { x: exPivot.position.x * 1.5, y: exPivot.position.y * 1.5, z: exPivot.position.z * 1.5 }
        });
    }
    group.add(extractorGroup);

    // ==========================================
    // SUBSYSTEM 6: HYDRAULIC STABILIZERS
    // ==========================================
    
    const hydraulicGroup = new THREE.Group();
    const hCount = 100;
    
    const hBaseGeom = new THREE.CylinderGeometry(1.5, 1.5, 10, 16);
    const hPistonGeom = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
    
    for (let i=0; i<hCount; i++) {
        const hyd = new THREE.Group();
        
        const base = new THREE.Mesh(hBaseGeom, darkMatterIron);
        base.position.y = 5;
        const piston = new THREE.Mesh(hPistonGeom, chrome);
        piston.position.y = 12;
        
        hyd.add(base);
        hyd.add(piston);
        
        // Randomly scatter between rings
        hyd.position.set(
            (Math.random() - 0.5) * 120,
            (Math.random() - 0.5) * 120,
            (Math.random() - 0.5) * 120
        );
        hyd.lookAt(0,0,0);
        hyd.rotation.x += Math.random() * Math.PI;

        hydraulicGroup.add(hyd);
        animateMeshes.push({ mesh: piston, type: 'piston', offset: Math.random() * Math.PI * 2 });
    }
    group.add(hydraulicGroup);

    parts.push({
        name: "Massive Hydraulic Stabilizer Network",
        description: "100 interdependent pneumatic and hydraulic rams providing dynamic kinetic resistance against ring torsion.",
        material: "Chrome and Dark Iron",
        function: "Dampens vibrations caused by quantum fluctuations.",
        assemblyOrder: 55,
        connections: ["All Containment Rings"],
        failureEffect: "Resonant cascade destroying the containment ring lattice.",
        cascadeFailures: ["Containment Ring Array"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // ==========================================
    // SUBSYSTEM 7: POWER CONDUITS
    // ==========================================
    
    const conduitGroup = new THREE.Group();
    for (let i = 0; i < 64; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20),
            new THREE.Vector3((Math.random()-0.5)*80, (Math.random()-0.5)*80, (Math.random()-0.5)*80),
            new THREE.Vector3((Math.random()-0.5)*150, (Math.random()-0.5)*150, (Math.random()-0.5)*150)
        ]);
        const tubeGeom = new THREE.TubeGeometry(curve, 20, 1.2, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, i%3===0 ? activeCopper : glass);
        
        // If glass, add an energy core inside
        if (i%3!==0) {
            const innerGeom = new THREE.TubeGeometry(curve, 20, 0.4, 8, false);
            const innerMesh = new THREE.Mesh(innerGeom, pulsingPlasma);
            tubeMesh.add(innerMesh);
        }

        conduitGroup.add(tubeMesh);
    }
    group.add(conduitGroup);

    parts.push({
        name: "Quantum Power Conduits",
        description: "Transfers the extracted infinite energy to the main output buffers while dissipating Hawking radiation.",
        material: "Active Copper and Containment Glass",
        function: "Energy routing.",
        assemblyOrder: 56,
        connections: ["Energy Extractors", "External Grid"],
        failureEffect: "Massive plasma blowout.",
        cascadeFailures: ["SubAtomic Injectors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // ==========================================
    // SUBSYSTEM 8: CONTROL NODES / OBSERVATION CABINS
    // ==========================================
    
    const controlGroup = new THREE.Group();
    const cCount = 16;
    for(let i=0; i<cCount; i++) {
        const node = new THREE.Group();
        
        // Cabin
        const cabinGeom = new THREE.BoxGeometry(8, 6, 8);
        const cabin = new THREE.Mesh(cabinGeom, plastic);
        node.add(cabin);

        // Windows
        const windowGeom = new THREE.BoxGeometry(8.2, 3, 6);
        const winMesh = new THREE.Mesh(windowGeom, tinted);
        node.add(winMesh);

        // Antennas
        const antGeom = new THREE.CylinderGeometry(0.1, 0.1, 10);
        const ant = new THREE.Mesh(antGeom, steel);
        ant.position.set(3, 8, 3);
        node.add(ant);

        // Screens inside (emissive)
        const screenGeom = new THREE.PlaneGeometry(2, 1.5);
        const screenMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const screen = new THREE.Mesh(screenGeom, screenMat);
        screen.position.set(0, 0, 3.5);
        screen.rotation.y = Math.PI;
        node.add(screen);

        const r = 100;
        const angle = (i / cCount) * Math.PI * 2;
        node.position.set(Math.cos(angle)*r, (i%2===0?20:-20), Math.sin(angle)*r);
        node.lookAt(0,0,0);
        
        controlGroup.add(node);

        parts.push({
            name: `Observation Node ${i+1}`,
            description: `Heavily shielded bunker for automated or desperate manual monitoring of the decay process.`,
            material: "Lead-Lined Plastic & Tinted Glass",
            function: "Telemetry and Override Controls.",
            assemblyOrder: 60 + i,
            connections: ["Reality Anchors"],
            failureEffect: "Loss of telemetry; operators instantly vaporized.",
            cascadeFailures: ["None"],
            originalPosition: { x: node.position.x, y: node.position.y, z: node.position.z },
            explodedPosition: { x: node.position.x * 1.5, y: node.position.y, z: node.position.z * 1.5 }
        });
    }
    group.add(controlGroup);

    // ==========================================
    // SUBSYSTEM 9: PHASE SHIFTERS (COMPLEX GEARS)
    // ==========================================
    
    const shifterGroup = new THREE.Group();
    const shifterCount = 12;
    for (let i = 0; i < shifterCount; i++) {
        const shape = new THREE.Shape();
        const teeth = 12;
        const outer = 6;
        const inner = 4;
        const step = (Math.PI*2)/(teeth*2);
        for(let j=0; j<teeth*2; j++) {
            const r = j%2===0?outer:inner;
            const a = j*step;
            if(j===0) shape.moveTo(Math.cos(a)*r, Math.sin(a)*r);
            else shape.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        shape.closePath();
        
        // Create 3 concentric holes
        const hole1 = new THREE.Path();
        hole1.absarc(0, 0, 1.5, 0, Math.PI * 2, false);
        shape.holes.push(hole1);

        const extrude = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
        const geom = new THREE.ExtrudeGeometry(shape, extrude);
        const mesh = new THREE.Mesh(geom, exoticAlloy);
        
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        
        shifterGroup.add(mesh);
        animateMeshes.push({ mesh: mesh, type: 'gear', speed: (Math.random() - 0.5) * 0.1 });

        parts.push({
            name: `Quantum Phase Shifter ${i+1}`,
            description: `Modulates the phase of the Higgs field locally to artificially elevate the barrier between false and true vacuums.`,
            material: "Exotic Alloy",
            function: "Prevents spontaneous global nucleation.",
            assemblyOrder: 80 + i,
            connections: ["Containment Rings"],
            failureEffect: "Barrier lowers, tunneling probability approaches 1.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: { x: mesh.position.x * 2, y: mesh.position.y * 2, z: mesh.position.z * 2 }
        });
    }
    group.add(shifterGroup);

    // ==========================================
    // SUBSYSTEM 10: HEAT EXCHANGERS
    // ==========================================
    
    const heatGroup = new THREE.Group();
    for(let h=0; h<8; h++) {
        const radiator = new THREE.Group();
        const pipeGeom = new THREE.CylinderGeometry(0.2, 0.2, 30, 8);
        for(let i=0; i<20; i++) {
            for(let j=0; j<20; j++) {
                if (Math.random() > 0.3) continue;
                const pipe = new THREE.Mesh(pipeGeom, copper);
                pipe.position.set(i*1.5 - 15, 0, j*1.5 - 15);
                radiator.add(pipe);
            }
        }
        radiator.position.set(
            (h%2===0? 80 : -80),
            (h%3===0? 80 : -80),
            (h%4===0? 80 : -80)
        );
        radiator.lookAt(0,0,0);
        heatGroup.add(radiator);

        parts.push({
            name: `Thermal Exhaust Grid ${h+1}`,
            description: `Dissipates the immense waste heat generated by resisting the strong nuclear force decoupling.`,
            material: "Copper Arrays",
            function: "Thermal Management.",
            assemblyOrder: 100 + h,
            connections: ["Coolant Lines"],
            failureEffect: "Core melts down into a quark-gluon plasma.",
            cascadeFailures: ["Containment Rings"],
            originalPosition: { x: radiator.position.x, y: radiator.position.y, z: radiator.position.z },
            explodedPosition: { x: radiator.position.x * 1.5, y: radiator.position.y * 1.5, z: radiator.position.z * 1.5 }
        });
    }
    group.add(heatGroup);


    // ==========================================
    // QUIZ QUESTIONS (5 PhD Level)
    // ==========================================

    const quizQuestions = [
        {
            question: "False vacuum decay proceeds via quantum tunneling. According to the Callan-Coleman formalism, what governs the nucleation rate per unit volume (Γ/V) of true vacuum bubbles in a scalar field theory at zero temperature?",
            options: [
                "The imaginary part of the Euclidean action of the bounce solution.",
                "The real part of the Minkowski space action evaluated at the domain wall.",
                "The topological winding number of the Higgs field.",
                "The expectation value of the stress-energy tensor trace."
            ],
            correctAnswer: 0,
            explanation: "In the semiclassical approximation, the decay rate is given by Γ/V = A exp(-S_E[bounce]), where S_E is the Euclidean action evaluated on the 'bounce' solution, representing the classically forbidden tunneling path. The prefactor A is related to the functional determinant of fluctuations around this bounce, which inherently possesses one negative eigenvalue, leading to an imaginary energy signifying instability."
        },
        {
            question: "In the context of the Standard Model, the stability of the electroweak vacuum is extremely sensitive to radiative corrections. Which two particle masses are the primary determinants of whether our universe is in a stable, metastable, or unstable state?",
            options: [
                "The W boson mass and the Z boson mass.",
                "The top quark mass and the Higgs boson mass.",
                "The electron mass and the electron neutrino mass.",
                "The up quark mass and the strong coupling constant."
            ],
            correctAnswer: 1,
            explanation: "The Higgs quartic coupling λ(μ) runs with the energy scale μ due to quantum corrections. The top quark, having the largest Yukawa coupling, contributes a large negative term to the beta function of λ, driving it towards negative values at high energies. The Higgs mass determines the initial value of λ. Current measurements suggest λ becomes negative around 10^10 GeV, implying metastability."
        },
        {
            question: "If a true vacuum bubble nucleates, its domain wall expands outward. Assuming the true vacuum has a significantly lower energy density than the false vacuum, what is the asymptotic kinematic behavior of the bubble wall as seen by an outside observer?",
            options: [
                "It expands at a constant terminal velocity determined by the friction of the surrounding plasma.",
                "It asymptotically approaches the speed of light, with the wall's Lorentz factor diverging.",
                "It expands at the speed of sound in the false vacuum medium.",
                "It oscillates, periodically expanding and contracting due to pressure gradients."
            ],
            correctAnswer: 1,
            explanation: "The constant volume energy density difference between the false and true vacuums provides a constant outward pressure on the wall. Since energy goes into accelerating the wall, and there is an infinite reservoir of volume energy, the wall accelerates indefinitely, asymptotically approaching the speed of light. Its Lorentz factor γ grows linearly with the bubble radius."
        },
        {
            question: "Consider a false vacuum state in a cosmological background. Which of the following mechanisms could theoretically suppress or completely halt the decay rate in a rapidly expanding early universe?",
            options: [
                "Gravitational lensing causing destructive interference of the bounce action.",
                "Hubble friction altering the effective potential and restoring symmetry.",
                "The chiral anomaly preventing the generation of a topological defect.",
                "The decoupling of dark matter increasing local energy density."
            ],
            correctAnswer: 1,
            explanation: "In a rapidly expanding universe, a scalar field experiences 'Hubble friction' (a term like 3H(dφ/dt) in the equation of motion). Furthermore, high temperature or high curvature (via non-minimal coupling Rφ^2) can provide effective mass terms that drive the field towards the origin, raising the barrier or even making the false vacuum the global minimum temporarily, thus stabilizing it."
        },
        {
            question: "Assuming the false vacuum has a cosmological constant strictly equal to zero (Minkowski space), what is the geometric nature of the spacetime interior of the nucleated true vacuum bubble?",
            options: [
                "It is a de Sitter (dS) space with a positive cosmological constant.",
                "It is an Anti-de Sitter (AdS) space due to the negative vacuum energy.",
                "It remains a Minkowski space, but with modified standard model couplings.",
                "It is a Schwarzschild black hole geometry."
            ],
            correctAnswer: 1,
            explanation: "If the false vacuum has exactly zero energy density (Minkowski), then the true vacuum, which by definition has a lower potential energy, must have a negative energy density. According to General Relativity, a spacetime with a negative cosmological constant is described by Anti-de Sitter (AdS) geometry. An observer inside would experience a rapid 'big crunch' collapse."
        }
    ];

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================

    function animate(time, speed, meshes) {
        // Group rotation
        group.rotation.y = time * 0.1 * speed;

        meshes.forEach(data => {
            if (data.type === 'coreWireframe') {
                data.mesh.rotation.x = time * 0.5 * speed;
                data.mesh.rotation.y = time * 0.7 * speed;
                const scale = 1 + Math.sin(time * 5) * 0.05;
                data.mesh.scale.set(scale, scale, scale);
                
                // Modify shader emissive intensity based on pulse
                data.mesh.material.emissiveIntensity = 5 + Math.sin(time * 10) * 5;
            }
            if (data.type === 'coreEnergyShell') {
                data.mesh.rotation.z = -time * 0.3 * speed;
                data.mesh.rotation.x = time * 0.2 * speed;
            }
            if (data.type === 'corePulse') {
                const scale = 1 + Math.sin(time * 20) * 0.02; // rapid shaking
                data.mesh.scale.set(scale, scale, scale);
            }
            if (data.type === 'fracture') {
                const t = time * 2 + data.offset;
                data.mesh.material.opacity = 0.4 + Math.sin(t) * 0.4;
                data.mesh.scale.x = 1 + Math.sin(t*0.5)*0.5;
                // Jitter position slightly
                data.mesh.position.y += Math.sin(t * 10) * 0.05;
            }
            if (data.type === 'strugglingRing') {
                // The ring attempts to rotate on its axis, but stutters
                const struggle = Math.sin(time * 10 + data.struggleIntensity) > 0 ? 1 : 0.2;
                data.mesh.rotateOnAxis(data.axis, data.baseSpeed * speed * struggle);
                
                // Occasionally vibrate violently
                if (Math.random() < 0.02) {
                    data.mesh.position.x = (Math.random() - 0.5) * 0.5;
                    data.mesh.position.y = (Math.random() - 0.5) * 0.5;
                    data.mesh.position.z = (Math.random() - 0.5) * 0.5;
                } else {
                    data.mesh.position.set(0,0,0);
                }
            }
            if (data.type === 'pulse') {
                data.mesh.material.opacity = 0.5 + Math.sin(time * 5 + data.offset) * 0.5;
                data.mesh.material.emissiveIntensity = 2 + Math.sin(time * 5 + data.offset) * 3;
            }
            if (data.type === 'dampener') {
                data.mesh.rotation.y = time * 2 * speed;
            }
            if (data.type === 'extractor') {
                // Spike pulses inward and outward slightly
                const distance = 45 + Math.sin(time * 2) * 2;
                data.mesh.position.copy(data.dir).multiplyScalar(distance);
            }
            if (data.type === 'piston') {
                // Hydraulic pistons expanding and contracting
                data.mesh.position.y = 12 + Math.sin(time * 8 + data.offset) * 4;
            }
            if (data.type === 'gear') {
                data.mesh.rotation.z += data.speed * speed;
            }
        });
    }

    return {
        group,
        parts,
        description: "The False Vacuum Catalyst is a God-Tier hyper-structure designed to artificially induce and contain the decay of the universe's false vacuum state into the true vacuum. By holding the expanding, light-speed domain wall in a state of suspended equilibrium using massive kinetic containment rings and reality anchors, the machine extracts infinite zero-point energy from the boundary gradient. A single failure will result in the immediate and irreversible destruction of the cosmos.",
        quizQuestions,
        animate: (time, speed) => animate(time, speed, animateMeshes)
    };
}
