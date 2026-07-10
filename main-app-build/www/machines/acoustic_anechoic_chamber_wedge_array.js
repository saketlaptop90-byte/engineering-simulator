import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        wedges: [],
        energyFields: [],
        redshiftZones: [],
        hydraulics: [],
        pistons: [],
        rotors: [],
        tires: [],
        rims: [],
        lugs: [],
        suspensionArms: [],
        lights: [],
        screens: [],
        gears: [],
        conduits: []
    };

    const description = "Ultra God Tier Anechoic Wedge Array Mobile Platform: A god-like fractal structure engineered to perfectly absorb all scalar fields, including sound, gravitational waves, and quantum fluctuations. Mounted on an insanely complex, colossal off-road chassis for deployment in hostile multidimensional environments. Features recursive wedges that trap energy fields, redshifting them into absolute zero, alongside massive aggressive tread tires, multi-stage hydraulic suspensions, glowing redshift nodes, and an isolated observer cabin.";

    // --- CUSTOM ADVANCED MATERIALS ---
    const wedgeBaseMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.95, metalness: 0.2 });
    const fractalMat = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 1.0, metalness: 0.0 });
    const energyFieldMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, transparent: true, opacity: 0.35, wireframe: true });
    const redshiftMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xbb0000, emissiveIntensity: 1.5, transparent: true, opacity: 0.8 });
    const absoluteZeroMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1.0, metalness: 0.0 });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x0a0011, roughness: 0.3, metalness: 0.9 });
    const goldPlating = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.15 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.0 });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.0 });

    // --- UTILITY GEOMETRIES ---
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1, frequency = 1, phase = 0) {
            super();
            this.scale = scale;
            this.freq = frequency;
            this.phase = phase;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = (t - 0.5) * 2;
            const ty = Math.sin(Math.PI * t * this.freq + this.phase) * 0.5;
            const tz = Math.cos(Math.PI * t * this.freq + this.phase) * 0.5;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    // --- COMPLEX COMPONENT GENERATORS ---

    // 1. Fractal Wedges
    function createFractalWedge(depth) {
        const wedgeGroup = new THREE.Group();
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(1, 0);
        shape.lineTo(0.5, 3);
        shape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 4, steps: 3, bevelSize: 0.02, bevelThickness: 0.02 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.translate(-0.5, 0, -0.5);
        
        const baseMesh = new THREE.Mesh(geom, fractalMat);
        wedgeGroup.add(baseMesh);
        
        if (depth > 0) {
            const scale = 0.45;
            for (let i = 0; i < 5; i++) {
                const subWedge = createFractalWedge(depth - 1);
                subWedge.scale.set(scale, scale, scale);
                subWedge.position.set(
                    (Math.random() - 0.5) * 0.9,
                    Math.random() * 2.5 + 0.2,
                    (Math.random() - 0.5) * 0.9
                );
                subWedge.rotation.set(
                    (Math.random() - 0.5) * Math.PI * 0.3,
                    Math.random() * Math.PI * 2,
                    (Math.random() - 0.5) * Math.PI * 0.3
                );
                wedgeGroup.add(subWedge);
            }
        }
        return wedgeGroup;
    }

    // 2. Heavy Duty Off-Road Tires
    function createHeavyTire() {
        const tireGroup = new THREE.Group();
        
        // Main torus
        const tireGeom = new THREE.TorusGeometry(8, 3, 32, 100);
        const tireMesh = new THREE.Mesh(tireGeom, rubber);
        tireGroup.add(tireMesh);
        
        // Hundreds of tiny extruded BoxGeometry lugs
        const lugGeom = new THREE.BoxGeometry(3.5, 1.5, 1.5);
        const numLugs = 120;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const isOffset = i % 2 === 0;
            const lug = new THREE.Mesh(lugGeom, rubber);
            
            const radius = 10.5;
            lug.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                isOffset ? 1.5 : -1.5
            );
            
            lug.rotation.z = angle;
            lug.rotation.y = isOffset ? 0.2 : -0.2;
            
            tireGroup.add(lug);
            meshes.lugs.push(lug);
        }
        
        // Complex Rim (Cylinder with spoke arrays)
        const rimOuterGeom = new THREE.CylinderGeometry(6, 6, 4, 64);
        rimOuterGeom.rotateX(Math.PI / 2);
        const rimOuter = new THREE.Mesh(rimOuterGeom, darkSteel);
        tireGroup.add(rimOuter);
        
        const rimInnerGeom = new THREE.CylinderGeometry(2, 2, 4.2, 32);
        rimInnerGeom.rotateX(Math.PI / 2);
        const rimInner = new THREE.Mesh(rimInnerGeom, chrome);
        tireGroup.add(rimInner);
        
        // Spokes
        const numSpokes = 16;
        for (let i = 0; i < numSpokes; i++) {
            const spokeAngle = (i / numSpokes) * Math.PI * 2;
            
            const spokeShape = new THREE.Shape();
            spokeShape.moveTo(0, -0.5);
            spokeShape.lineTo(4, -1);
            spokeShape.lineTo(4, 1);
            spokeShape.lineTo(0, 0.5);
            
            const spokeExtrude = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 };
            const spokeGeom = new THREE.ExtrudeGeometry(spokeShape, spokeExtrude);
            spokeGeom.translate(0, 0, -0.25);
            
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.position.set(Math.cos(spokeAngle) * 2, Math.sin(spokeAngle) * 2, 0);
            spoke.rotation.z = spokeAngle;
            tireGroup.add(spoke);
        }
        
        return tireGroup;
    }

    // 3. Multi-stage Hydraulic Suspension
    function createSuspension() {
        const suspGroup = new THREE.Group();
        
        // Main strut
        const strutGeom = new THREE.CylinderGeometry(1.5, 1.5, 15, 32);
        const strut = new THREE.Mesh(strutGeom, darkSteel);
        suspGroup.add(strut);
        
        // Piston
        const pistonGeom = new THREE.CylinderGeometry(1, 1, 15, 32);
        const piston = new THREE.Mesh(pistonGeom, chrome);
        piston.position.y = -7.5;
        suspGroup.add(piston);
        meshes.pistons.push({ obj: piston, baseY: -7.5, stroke: 3, phase: Math.random() * Math.PI * 2 });
        
        // Heavy coil spring
        const springGeom = new THREE.TorusKnotGeometry(2, 0.4, 200, 16, 1, 15);
        const spring = new THREE.Mesh(springGeom, copper);
        spring.position.y = -4;
        spring.scale.set(1, 0.6, 1);
        suspGroup.add(spring);
        
        return suspGroup;
    }

    // --- CONSTRUCTING THE PLATFORM ---

    const platformGroup = new THREE.Group();
    
    // Main Chassis Base
    const chassisGeom = new THREE.BoxGeometry(40, 5, 70);
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.position.y = 15;
    platformGroup.add(chassis);

    parts.push({
        name: "Colossal Off-Road Chassis",
        description: "Massive dark-steel reinforced spine supporting the anechoic chamber.",
        material: "darkSteel",
        function: "Provides highly stable mobile platform for interdimensional travel.",
        assemblyOrder: 1,
        connections: ["Suspension Arrays", "Chamber Base"],
        failureEffect: "Structural buckling under extreme gravitational loads.",
        cascadeFailures: ["Complete System Collapse"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // Add 8 massive tires
    const tirePositions = [
        [-25, 8, -25], [25, 8, -25], [-25, 8, 0], [25, 8, 0],
        [-25, 8, 25], [25, 8, 25], [-25, 8, -45], [25, 8, -45] // 8-wheel drive
    ];

    tirePositions.forEach((pos, i) => {
        const tire = createHeavyTire();
        tire.position.set(pos[0], pos[1], pos[2]);
        // Rotate so tread faces correctly
        tire.rotation.y = Math.PI / 2;
        platformGroup.add(tire);
        meshes.tires.push(tire);

        const susp = createSuspension();
        susp.position.set(pos[0] * 0.7, pos[1] + 8, pos[2]);
        susp.rotation.z = pos[0] > 0 ? -0.2 : 0.2;
        platformGroup.add(susp);

        parts.push({
            name: `Heavy Drive Wheel & Suspension Array ${i}`,
            description: `Torus-geometry off-road tire with hundreds of box-geometry lugs and multi-stage hydraulic suspension.`,
            material: "rubber/steel/chrome",
            function: "Mobility and primary shock absorption against terrestrial noise.",
            assemblyOrder: 2 + i,
            connections: ["Colossal Off-Road Chassis", "Axle Conduits"],
            failureEffect: "Loss of mobility, un-dampened seismic noise entering the chassis.",
            cascadeFailures: ["Resonance Feedback", "Chamber Contamination"],
            originalPosition: {x: pos[0], y: pos[1], z: pos[2]},
            explodedPosition: {x: pos[0]*2, y: pos[1], z: pos[2]*1.5}
        });
    });

    // --- CONSTRUCTING THE ANECHOIC CHAMBER (God-Tier) ---
    
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(0, 40, 0);
    platformGroup.add(chamberGroup);

    // Geodesic Containment Shell
    const shellGeom = new THREE.IcosahedronGeometry(25, 4); // Extremely dense geometry
    const shellMesh = new THREE.Mesh(shellGeom, darkSteel);
    shellMesh.material.wireframe = true;
    shellMesh.material.transparent = true;
    shellMesh.material.opacity = 0.15;
    chamberGroup.add(shellMesh);
    
    parts.push({
        name: "Geodesic Containment Shell",
        description: "Macro-scale containment sphere providing structural integrity against quantum pressure.",
        material: "darkSteel",
        function: "Maintains external pressure and houses the internal fractal wedge geometry.",
        assemblyOrder: 15,
        connections: ["Primary Support Struts", "Quantum Harmonizer Ring"],
        failureEffect: "Chamber implosion due to external vacuum pressure.",
        cascadeFailures: ["Wedge Array Collapse", "Singularity Formation"],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: 0, y: 80, z: 0}
    });

    // Inner Fractal Array
    const arrayGroup = new THREE.Group();
    const numWedges = 128; // INSANE density
    
    for (let i = 0; i < numWedges; i++) {
        const phi = Math.acos(-1 + (2 * i) / numWedges);
        const theta = Math.sqrt(numWedges * Math.PI) * phi;
        
        const radius = 22;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        const wedge = createFractalWedge(2); // Fractal depth 2
        wedge.position.set(x, y, z);
        wedge.lookAt(0, 0, 0); // Pointing dead center
        
        arrayGroup.add(wedge);
        meshes.wedges.push({ mesh: wedge, baseX: x, baseY: y, baseZ: z, phase: Math.random() * 10 });

        if (i % 8 === 0) {
            parts.push({
                name: `Fractal Wedge Sector Alpha-${i}`,
                description: `Recursive acoustic/quantum absorption wedge block. Shape extruded with recursive depth scaling.`,
                material: "fractalMat",
                function: "Traps incoming scalar fields in an infinite recursion loop.",
                assemblyOrder: 20 + i,
                connections: ["Geodesic Containment Shell", `Redshift Node Array`],
                failureEffect: "Wave reflection and internal resonance cascade.",
                cascadeFailures: ["Thermal Overload", "Chamber Breach"],
                originalPosition: {x: x, y: y+40, z: z},
                explodedPosition: {x: x*2, y: y*2+40, z: z*2}
            });
        }
    }
    chamberGroup.add(arrayGroup);

    // Quantum Redshift Nodes (Glowing / Emissive)
    for(let i = 0; i < 40; i++) {
        const nodeGeom = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32, 3, 5);
        const node = new THREE.Mesh(nodeGeom, redshiftMat);
        
        const r = 14;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        node.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        node.lookAt(0, 0, 0);
        
        chamberGroup.add(node);
        meshes.redshiftZones.push({ mesh: node, phase: Math.random() * 10, speed: Math.random() * 2 + 1 });
    }
    
    parts.push({
        name: "Quantum Redshift Manifold Array",
        description: "Array of 40 toroidal knots that shift the frequency of trapped energy down to absolute zero.",
        material: "redshiftMat",
        function: "Dissipates trapped high-energy waves via continuous redshifting.",
        assemblyOrder: 40,
        connections: ["Fractal Wedge Sectors", "Central Null Void"],
        failureEffect: "Energy build-up causing catastrophic white-hole emission.",
        cascadeFailures: ["Geodesic Shell Vaporization"],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: 0, y: 40, z: 45}
    });

    // Central Null Void (Absolute Zero State)
    const voidGeom = new THREE.SphereGeometry(6, 128, 128); // Ultra smooth
    const voidMesh = new THREE.Mesh(voidGeom, absoluteZeroMat);
    chamberGroup.add(voidMesh);
    meshes.nullVoid = voidMesh;

    parts.push({
        name: "Central Null Void",
        description: "A suspended region of absolute zero energy and perfect silence.",
        material: "absoluteZeroMat",
        function: "Final destination for redshifted scalar fields; effectively a quantum sink.",
        assemblyOrder: 45,
        connections: ["Quantum Redshift Manifold Array"],
        failureEffect: "Breach of absolute zero, allowing thermal noise to leak.",
        cascadeFailures: ["Total System Failure"],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: 0, y: 40, z: -45}
    });

    // Visible Energy Fields (Incoming chaotic waves)
    for(let i = 0; i < 12; i++) {
        const fieldGeom = new THREE.CylinderGeometry(0.5, 12, 35, 64, 64, true);
        
        // Displace vertices massively to make it look incredibly chaotic and fluid
        const pos = fieldGeom.attributes.position;
        for(let j=0; j<pos.count; j++) {
            pos.setX(j, pos.getX(j) + (Math.random()-0.5)*3.5);
            pos.setZ(j, pos.getZ(j) + (Math.random()-0.5)*3.5);
        }
        fieldGeom.computeVertexNormals();
        
        const field = new THREE.Mesh(fieldGeom, energyFieldMat);
        field.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        
        chamberGroup.add(field);
        meshes.energyFields.push({ mesh: field, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), speed: Math.random() * 2 + 0.5 });
    }

    parts.push({
        name: "Chaotic Wave Intakes",
        description: "Visible energy field manifolds directing external scalar fields into the chamber.",
        material: "energyFieldMat",
        function: "Channels external disturbances directly towards the fractal wedges.",
        assemblyOrder: 46,
        connections: ["Exterior Environment", "Fractal Wedge Sectors"],
        failureEffect: "Waves bypass the array, causing environmental contamination.",
        cascadeFailures: ["Chamber Resonance"],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: -45, y: 40, z: 0}
    });

    // --- EXTERIOR HYDRAULICS, PIPING, AND CABIN ---

    // External Cryogenic Piping (Lathe & Tube mix)
    for(let i=0; i<16; i++) {
        const path = new CustomSinCurve(25, 6, i);
        const tubeGeom = new THREE.TubeGeometry(path, 150, 0.6, 12, false);
        const tube = new THREE.Mesh(tubeGeom, glass);
        tube.rotation.y = (i/16) * Math.PI * 2;
        tube.rotation.z = Math.PI / 4;
        chamberGroup.add(tube);
        
        // Inner glowing coolant
        const flowTube = new THREE.Mesh(tubeGeom.clone(), neonBlue);
        flowTube.scale.setScalar(0.7);
        tube.add(flowTube);
        meshes.conduits.push({ mesh: flowTube, phase: i });
    }
    
    parts.push({
        name: "Cryogenic Super-Coolant Loops",
        description: "Intricate web of liquid helium/nitrogen lines maintaining superconducting states.",
        material: "glass/neonBlue",
        function: "Pulls thermal energy out of the system rapidly.",
        assemblyOrder: 47,
        connections: ["Quantum Redshift Nodes", "Chassis Heat Exchangers"],
        failureEffect: "Thermal runaway in redshift nodes.",
        cascadeFailures: ["Wedge Array Melt"],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // High-Tech Operator Cabin (Hexagonal structure)
    const cabinGroup = new THREE.Group();
    
    const cabinShape = new THREE.Shape();
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        if(i===0) cabinShape.moveTo(Math.cos(angle)*8, Math.sin(angle)*8);
        else cabinShape.lineTo(Math.cos(angle)*8, Math.sin(angle)*8);
    }
    cabinShape.lineTo(Math.cos(0)*8, Math.sin(0)*8);
    
    const cabinExtrude = { depth: 10, bevelEnabled: true, bevelThickness: 0.5 };
    const cabinGeom = new THREE.ExtrudeGeometry(cabinShape, cabinExtrude);
    const cabinMesh = new THREE.Mesh(cabinGeom, darkSteel);
    cabinMesh.rotation.x = Math.PI / 2;
    cabinMesh.position.y = 5;
    cabinGroup.add(cabinMesh);

    // Front Window
    const windowGeom = new THREE.PlaneGeometry(8, 4);
    const windowMesh = new THREE.Mesh(windowGeom, tinted);
    windowMesh.position.set(0, 0, 10.1);
    cabinGroup.add(windowMesh);

    // Interior glowing screens and joysticks
    for(let i=0; i<6; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.5), glowingGreen);
        screen.position.set((i%3 - 1) * 2.5, (i>2 ? 1 : -1) * 1, 9.9);
        screen.rotation.y = Math.PI;
        cabinGroup.add(screen);
        meshes.screens.push(screen);
    }

    cabinGroup.position.set(0, 25, 40); // Mounted on front of chassis
    platformGroup.add(cabinGroup);

    parts.push({
        name: "Hex-Core Observer Isolation Deck",
        description: "Heavily shielded forward observation cabin with tinted macroscopic filters and glowing green telemetry displays.",
        material: "darkSteel/tinted/glowingGreen",
        function: "Allows observation and vehicle steering without introducing quantum observer-effect interference to the array.",
        assemblyOrder: 50,
        connections: ["Colossal Off-Road Chassis", "Telemetry Conduits"],
        failureEffect: "Observer's consciousness collapses the waveform prematurely.",
        cascadeFailures: ["Reality Splintering"],
        originalPosition: {x: 0, y: 25, z: 40},
        explodedPosition: {x: 0, y: 25, z: 70}
    });

    // Massive Exhaust Stacks for Chassis
    for(let i=0; i<4; i++) {
        const stackGeom = new THREE.CylinderGeometry(1.5, 1.5, 25, 16);
        const stack = new THREE.Mesh(stackGeom, chrome);
        stack.position.set((i%2===0 ? -22 : 22), 30, (i>1 ? 15 : -15));
        
        // Add rain caps
        const capGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 16);
        const cap = new THREE.Mesh(capGeom, darkSteel);
        cap.position.y = 13;
        cap.rotation.x = -0.3; // slightly open
        stack.add(cap);
        
        platformGroup.add(stack);
    }

    parts.push({
        name: "Quad Chrome Exhaust Stacks",
        description: "Massive vertical exhaust pipes with angled rain caps.",
        material: "chrome/darkSteel",
        function: "Vents excess heat and waste gases from the massive diesel-electric drivetrains.",
        assemblyOrder: 51,
        connections: ["Colossal Off-Road Chassis"],
        failureEffect: "Engine overheating.",
        cascadeFailures: ["Mobility Loss"],
        originalPosition: {x: 22, y: 30, z: 15},
        explodedPosition: {x: 40, y: 50, z: 15}
    });

    // Ladders and Grilles
    const grilleGeom = new THREE.BoxGeometry(20, 10, 1);
    const grille = new THREE.Mesh(grilleGeom, steel);
    grille.position.set(0, 18, 36);
    platformGroup.add(grille);

    group.add(platformGroup);

    // --- ANIMATION LOGIC (Ultra Complex) ---

    const animate = function(time, speed, meshesObj = meshes) {
        const t = time * speed;
        
        // Rotate Tires and Lugs
        if(meshesObj.tires) {
            meshesObj.tires.forEach(tire => {
                tire.rotation.z = -t * 2; // Moving forward
            });
        }
        
        // Hydraulic Suspension actuation (simulating rough terrain)
        if(meshesObj.pistons) {
            meshesObj.pistons.forEach(p => {
                // Sine wave based on time and individual phase to simulate uneven terrain
                const strokeOffset = Math.sin(t * 8 + p.phase) * p.stroke;
                p.obj.position.y = p.baseY + strokeOffset;
            });
        }

        // Fractal Wedges Pulsating and shifting
        if(meshesObj.wedges) {
            meshesObj.wedges.forEach(w => {
                const pulse = 1 + Math.sin(t * 3 + w.phase) * 0.03;
                w.mesh.scale.setScalar(pulse);
                
                // Micro-vibrations towards center
                w.mesh.position.set(
                    w.baseX * (1 + Math.sin(t*10 + w.phase)*0.01),
                    w.baseY * (1 + Math.cos(t*11 + w.phase)*0.01),
                    w.baseZ * (1 + Math.sin(t*12 + w.phase)*0.01)
                );
            });
        }

        // Quantum Redshift Nodes Erratic Spin & Glow
        if(meshesObj.redshiftZones) {
            meshesObj.redshiftZones.forEach((node, i) => {
                node.mesh.rotation.x = t * node.speed;
                node.mesh.rotation.y = t * (node.speed * 1.3);
                node.mesh.scale.setScalar(1 + Math.sin(t*7 + node.phase)*0.15);
                
                // Pulse emissive intensity dynamically
                if(node.mesh.material.emissiveIntensity !== undefined) {
                    node.mesh.material.emissiveIntensity = 1.0 + 1.5 * Math.sin(t * 12 + i);
                }
            });
        }

        // Chaotic Energy Fields Deformation and Rotation
        if(meshesObj.energyFields) {
            meshesObj.energyFields.forEach((field, i) => {
                field.mesh.rotateOnAxis(field.axis, 0.05 * field.speed);
                
                const fieldPulse = Math.max(0.2, Math.sin(t * 4 + i));
                field.mesh.scale.set(1 + fieldPulse*0.3, 1, 1 + fieldPulse*0.3);
                field.mesh.material.opacity = 0.15 + 0.2 * fieldPulse;
            });
        }

        // Null Void Breathing
        if(meshesObj.nullVoid) {
            const voidPulse = 1 + Math.sin(t * 2) * 0.08;
            meshesObj.nullVoid.scale.setScalar(voidPulse);
            meshesObj.nullVoid.rotation.y = t * -0.5;
            meshesObj.nullVoid.rotation.x = t * 0.3;
        }

        // Cryogenic Conduits Flow effect
        if(meshesObj.conduits) {
            meshesObj.conduits.forEach(c => {
                c.mesh.material.opacity = 0.4 + 0.6 * Math.sin(t * 15 - c.phase);
            });
        }

        // Screens flickering in Cabin
        if(meshesObj.screens) {
            meshesObj.screens.forEach((screen, i) => {
                screen.material.color.setHSL((t*0.2 + i*0.1)%1, 1, 0.3 + Math.random()*0.4);
            });
        }
    };

    // --- PHD LEVEL QUIZ QUESTIONS ---

    const quizQuestions = [
        {
            question: "In the context of the Ultra God Tier Anechoic Wedge Array, what happens to the entropy of a scalar field trapped within the infinite fractal recursion?",
            options: [
                "It decreases to zero, violating the Second Law of Thermodynamics.",
                "It is exponentially multiplied and radiated outwards as Hawking radiation.",
                "It is asymptotically mapped to the boundary of the Central Null Void, preserving information while eliminating macroscopic states.",
                "It creates a localized time-reversal symmetry."
            ],
            correctAnswer: 2,
            explanation: "In perfect fractal absorption systems, information cannot be destroyed; rather, the entropic microstates are mapped onto the boundary of the absolute zero sink (Holographic Principle), effectively storing the data without thermal manifestation."
        },
        {
            question: "Why must the massive off-road tires utilize a Torus geometry clad with hundreds of micro-extruded box-geometry lugs?",
            options: [
                "To increase the vehicle's top speed to Mach 1.",
                "To provide maximum surface-area displacement over non-Euclidean terrain while decoupling high-frequency seismic noise from the chassis.",
                "To generate a static electric charge to power the redshift nodes.",
                "To purely satisfy an aesthetic requirement for aggression."
            ],
            correctAnswer: 1,
            explanation: "The micro-lug array acts as a primary mechanical low-pass filter. Each lug independently deforms over complex terrain, heavily damping high-frequency seismic noise before it even reaches the hydraulic suspension."
        },
        {
            question: "What is the thermodynamic purpose of the Quantum Redshift Nodes operating at highly erratic, chaotic spin rates?",
            options: [
                "To generate centripetal force that counteracts the Null Void's gravity.",
                "To create a dynamic, non-linear tensor field that continuously shifts the wavelength of incident photons and phonons towards infinity (zero energy).",
                "To act as a gyroscope for the off-road chassis.",
                "To broadcast a distress signal across multiple dimensions."
            ],
            correctAnswer: 1,
            explanation: "Redshifting drops the energy of a wave (E=hc/λ). By spinning erratically, the nodes prevent standing waves from forming, continuously stretching the wavelengths until they approach infinity, effectively cooling the system to absolute zero."
        },
        {
            question: "How does the Hex-Core Observer Isolation Deck prevent the 'Observer Effect' from prematurely collapsing incoming quantum waveforms?",
            options: [
                "By blinding the operators with glowing green screens.",
                "By utilizing tinted macroscopic filters that heavily coarse-grain the incoming visual data, ensuring no 'which-path' information is extracted from the array.",
                "By placing the cabin exactly 40 units away on the Z-axis.",
                "By pumping hallucinogenic gas into the cabin."
            ],
            correctAnswer: 1,
            explanation: "Quantum mechanics dictates that extracting specific 'which-path' information collapses the wave function. The tinted macroscopic filters intentionally destroy this precise data (coarse-graining), allowing the observers to see the array without forcing the waves to collapse before absorption."
        },
        {
            question: "If a catastrophic failure occurs in the Hydraulic Suspension Arrays, what is the resulting cascade effect on the Anechoic Chamber?",
            options: [
                "The chassis simply lowers to the ground safely.",
                "The tires will immediately explode due to overpressure.",
                "Un-dampened seismic noise couples with the chassis, causing Resonance Feedback that contaminates the perfectly silent Central Null Void.",
                "The Cryogenic Super-Coolant Loops freeze solid."
            ],
            correctAnswer: 2,
            explanation: "The entire purpose of the multi-stage suspension is vibration isolation. Failure mechanically couples the ground to the chassis, flooding the chamber with terrestrial noise and destroying the absolute zero state."
        }
    ];

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAnechoicChamberWedgeArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
