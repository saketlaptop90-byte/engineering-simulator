import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "God_Tier_Zero_Brane_Loom";

    const parts = [];
    const meshes = {}; // Store references for the animate function

    // ==========================================
    // CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9, wireframe: false });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 4.0, wireframe: true });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0, transparent: true, opacity: 0.8 });
    const quantumGold = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 0.8, metalness: 1.0, roughness: 0.1 });
    const singularityBlack = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.0, metalness: 1.0 });
    const tachyonGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, opacity: 1, metalness: 0.1, roughness: 0, ior: 1.5, thickness: 3.0, emissive: 0x00ffff, emissiveIntensity: 0.3 });
    const realityFabricMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaccff, emissiveIntensity: 0.8, wireframe: true, side: THREE.DoubleSide });
    const controlPanelMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x00ff00, emissiveIntensity: 0.6, wireframe: true });
    const redAlertMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3.0 });
    const plasmaCoreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5.0 });

    meshes.coreRings = [];
    meshes.needles = [];
    meshes.pistons = [];
    meshes.wheels = [];
    meshes.tachyonCores = [];
    meshes.exhaustParticles = [];
    meshes.spools = [];

    // ==========================================
    // HELPER: LISSAJOUS CURVES FOR HYDRAULICS
    // ==========================================
    class TachyonCurve extends THREE.Curve {
        constructor(scale, freqX, freqY, freqZ, phase) {
            super();
            this.scale = scale;
            this.freqX = freqX;
            this.freqY = freqY;
            this.freqZ = freqZ;
            this.phase = phase;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const u = t * Math.PI * 2;
            const x = Math.sin(this.freqX * u + this.phase) * 20 * this.scale;
            const y = Math.cos(this.freqY * u + this.phase) * 15 * this.scale;
            const z = Math.sin(this.freqZ * u) * 25 * this.scale;
            return optionalTarget.set(x, y, z);
        }
    }

    // ==========================================
    // 1. MAIN CHASSIS (Highly Complex Lathe + Extrude)
    // ==========================================
    const chassisGroup = new THREE.Group();
    const chassisPoints = [];
    // Generating a highly complex profile for the main hull
    chassisPoints.push(new THREE.Vector2(0.01, -20));
    chassisPoints.push(new THREE.Vector2(25, -20));
    chassisPoints.push(new THREE.Vector2(28, -18));
    chassisPoints.push(new THREE.Vector2(28, -12));
    chassisPoints.push(new THREE.Vector2(32, -8));
    chassisPoints.push(new THREE.Vector2(32, -4));
    chassisPoints.push(new THREE.Vector2(35, -2));
    chassisPoints.push(new THREE.Vector2(35, 2));
    chassisPoints.push(new THREE.Vector2(32, 4));
    chassisPoints.push(new THREE.Vector2(32, 8));
    chassisPoints.push(new THREE.Vector2(28, 12));
    chassisPoints.push(new THREE.Vector2(28, 18));
    chassisPoints.push(new THREE.Vector2(25, 20));
    chassisPoints.push(new THREE.Vector2(22, 22));
    chassisPoints.push(new THREE.Vector2(20, 24));
    chassisPoints.push(new THREE.Vector2(18, 28));
    chassisPoints.push(new THREE.Vector2(15, 30));
    chassisPoints.push(new THREE.Vector2(12, 32));
    chassisPoints.push(new THREE.Vector2(10, 36));
    chassisPoints.push(new THREE.Vector2(8, 38));
    chassisPoints.push(new THREE.Vector2(5, 40));
    chassisPoints.push(new THREE.Vector2(0.01, 40));
    
    // Add intricate micro-details to chassis profile by interpolating and adding noise
    const detailedChassisPoints = [];
    for(let i=0; i<chassisPoints.length-1; i++) {
        const p1 = chassisPoints[i];
        const p2 = chassisPoints[i+1];
        detailedChassisPoints.push(p1);
        // Intercalate 3 points between each main point for ultra-high vertex density
        for(let j=1; j<=3; j++) {
            const frac = j/4;
            const nx = p1.x * (1-frac) + p2.x * frac + (Math.random()*0.4 - 0.2);
            const ny = p1.y * (1-frac) + p2.y * frac;
            detailedChassisPoints.push(new THREE.Vector2(nx, ny));
        }
    }
    detailedChassisPoints.push(chassisPoints[chassisPoints.length-1]);
    
    const chassisGeom = new THREE.LatheGeometry(detailedChassisPoints, 128); // Massively high segment count
    const chassisMesh = new THREE.Mesh(chassisGeom, darkSteel);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisGroup.add(chassisMesh);
    
    // Add 32 intricate heavy armor plating arrays around the chassis
    for(let i=0; i<32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const plateShape = new THREE.Shape();
        plateShape.moveTo(0, 0);
        plateShape.lineTo(3, 0);
        plateShape.lineTo(5, 12);
        plateShape.lineTo(2, 18);
        plateShape.lineTo(-2, 18);
        plateShape.lineTo(-5, 12);
        plateShape.lineTo(-3, 0);
        
        const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 5, steps: 3, bevelSize: 0.5, bevelThickness: 0.5 };
        const plateGeom = new THREE.ExtrudeGeometry(plateShape, extrudeSettings);
        const plate = new THREE.Mesh(plateGeom, steel);
        plate.position.set(Math.cos(angle) * 33, Math.sin(angle) * 33, -10);
        plate.rotation.z = angle + Math.PI/2;
        plate.rotation.x = Math.PI/2;
        
        // Add rivets to the plate
        for (let r=0; r<6; r++) {
            const rivetGeom = new THREE.SphereGeometry(0.4, 8, 8);
            const rivet = new THREE.Mesh(rivetGeom, chrome);
            rivet.position.set(0, 2 + r*3, 2.5);
            plate.add(rivet);
        }
        chassisGroup.add(plate);
    }
    group.add(chassisGroup);

    parts.push({
        name: "Omni-Dimensional Dark Steel Chassis",
        description: "The primary load-bearing lattice forged from neutron star degenerate matter, heavily armored with 32 interlocking macro-plates to resist vacuum decay.",
        material: "Dark Steel / Chrome / Steel",
        function: "Maintains structural integrity against 11-dimensional topological stress during bulk-weaving.",
        assemblyOrder: 1,
        connections: ["D-Brane Anchors", "Suspension Arms", "Supergravity Pump"],
        failureEffect: "Spontaneous uncompactification of extra dimensions within a 5-mile radius.",
        cascadeFailures: ["M-Theory Core", "Dimensional Stabilizer Rings"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // ==========================================
    // 2. EXTREMELY DETAILED OFF-ROAD TREAD WHEELS
    // ==========================================
    function createComplexWheel(x, y, z, rotationY) {
        const wheelGroup = new THREE.Group();
        
        // Main rubber torus
        const tireGeom = new THREE.TorusGeometry(8, 3.5, 64, 128);
        const tire = new THREE.Mesh(tireGeom, rubber);
        
        // Aggressive Chevron Treads (ExtrudeGeometry)
        const lugShape = new THREE.Shape();
        lugShape.moveTo(-1.5, -0.8);
        lugShape.lineTo(0, 2.5);
        lugShape.lineTo(1.5, -0.8);
        lugShape.lineTo(0.8, -1.5);
        lugShape.lineTo(-0.8, -1.5);
        const lugExtrude = { depth: 4.5, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.2, bevelSegments: 3 };
        const lugGeom = new THREE.ExtrudeGeometry(lugShape, lugExtrude);
        
        const numLugs = 60;
        for (let i=0; i<numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            // Position exactly on the surface of the torus
            lug.position.set(Math.cos(angle) * 11.2, Math.sin(angle) * 11.2, -2.25);
            lug.rotation.z = angle - Math.PI/2;
            wheelGroup.add(lug);
            
            // Secondary staggered lugs for maximum grip on non-euclidean terrain
            const innerLug = new THREE.Mesh(lugGeom, rubber);
            innerLug.scale.set(0.6, 0.6, 0.6);
            innerLug.position.set(Math.cos(angle + 0.05) * 10.8, Math.sin(angle + 0.05) * 10.8, -1.35);
            innerLug.rotation.z = angle - Math.PI/2 + 0.15;
            wheelGroup.add(innerLug);
        }
        
        // Complex Spoked Rim
        const rimGeom = new THREE.CylinderGeometry(7.5, 7.5, 4.5, 64);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        const spokeGeom = new THREE.CylinderGeometry(0.4, 0.2, 15, 32);
        for (let i=0; i<24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = angle;
            wheelGroup.add(spoke);
            
            // Tangential cross braces
            const braceGeom = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
            const brace = new THREE.Mesh(braceGeom, aluminum);
            brace.position.set(Math.cos(angle)*4, Math.sin(angle)*4, 1.5);
            brace.rotation.x = Math.PI / 2;
            brace.rotation.z = angle + Math.PI/3;
            wheelGroup.add(brace);
        }
        
        // Central Gold Hub with glowing neon center
        const hubGeom = new THREE.SphereGeometry(3, 32, 32);
        const hub = new THREE.Mesh(hubGeom, quantumGold);
        wheelGroup.add(hub);
        
        const neonCenterGeom = new THREE.SphereGeometry(1.5, 16, 16);
        const neonCenter = new THREE.Mesh(neonCenterGeom, neonBlue);
        neonCenter.position.z = 2;
        wheelGroup.add(neonCenter);
        
        wheelGroup.position.set(x, y, z);
        wheelGroup.rotation.y = rotationY;
        
        meshes.wheels.push(wheelGroup);
        return wheelGroup;
    }

    const wheelPositions = [
        { x: -45, y: -25, z: -30, rot: 0 },
        { x: 45, y: -25, z: -30, rot: Math.PI },
        { x: -45, y: -25, z: 0, rot: 0 },
        { x: 45, y: -25, z: 0, rot: Math.PI },
        { x: -45, y: -25, z: 30, rot: 0 },
        { x: 45, y: -25, z: 30, rot: Math.PI },
        { x: -45, y: -25, z: 60, rot: 0 },
        { x: 45, y: -25, z: 60, rot: Math.PI }
    ];

    wheelPositions.forEach((pos, index) => {
        const wheel = createComplexWheel(pos.x, pos.y, pos.z, pos.rot);
        group.add(wheel);
        
        // Complex Suspension Arm for each wheel
        const armGroup = new THREE.Group();
        const armGeom = new THREE.BoxGeometry(20, 4, 6);
        const arm = new THREE.Mesh(armGeom, steel);
        arm.position.set(pos.x > 0 ? -10 : 10, 10, 0);
        arm.rotation.z = pos.x > 0 ? -Math.PI/6 : Math.PI/6;
        
        // Hydraulic shock absorber inside suspension
        const shockOuterGeom = new THREE.CylinderGeometry(2, 2, 15, 32);
        const shockOuter = new THREE.Mesh(shockOuterGeom, darkSteel);
        shockOuter.position.set(pos.x > 0 ? -5 : 5, 5, 0);
        
        const shockInnerGeom = new THREE.CylinderGeometry(1.5, 1.5, 18, 32);
        const shockInner = new THREE.Mesh(shockInnerGeom, chrome);
        shockInner.position.set(pos.x > 0 ? -5 : 5, 0, 0);
        
        armGroup.add(arm);
        armGroup.add(shockOuter);
        armGroup.add(shockInner);
        
        armGroup.position.set(pos.x, pos.y, pos.z);
        group.add(armGroup);
        
        parts.push({
            name: `Quantum-Tread Wheel & Suspension ${index + 1}`,
            description: `Heavy-duty all-terrain locomotion module with chevron extrusions capable of gripping fractional dimensions and curled-up Calabi-Yau manifolds.`,
            material: "Rubber / Chrome / Quantum Gold / Steel",
            function: "Provides mobility across the 11-dimensional bulk space.",
            assemblyOrder: 2,
            connections: ["Main Chassis", "Gravimetric Drive Axle"],
            failureEffect: "Loss of traction in the 5th dimension, causing the loom to slide into a parallel timeline.",
            cascadeFailures: ["Chassis Alignment"],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x * 2, y: pos.y - 20, z: pos.z * 1.5 }
        });
    });

    // ==========================================
    // 3. M-THEORY CORE (Nested, Glowing, Multi-Axis TorusKnots)
    // ==========================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 30, 0);
    
    // 11 Nested rings representing 11 dimensions
    for(let i=1; i<=11; i++) {
        const knotGeom = new THREE.TorusKnotGeometry(i * 3, 0.4 + i*0.1, 256, 32, i%4+1, i%3+2);
        const knotMat = i % 2 === 0 ? neonPurple : neonBlue;
        // Make the innermost rings plasma cores
        const finalMat = i < 3 ? plasmaCoreMat : knotMat;
        const knot = new THREE.Mesh(knotGeom, finalMat);
        
        // Add random initial rotations and unique axis speeds
        knot.rotation.x = Math.random() * Math.PI;
        knot.rotation.y = Math.random() * Math.PI;
        knot.rotation.z = Math.random() * Math.PI;
        
        meshes.coreRings.push({
            mesh: knot,
            speedX: (Math.random() - 0.5) * 2.0,
            speedY: (Math.random() - 0.5) * 2.5,
            speedZ: (Math.random() - 0.5) * 1.5
        });
        
        coreGroup.add(knot);
    }
    
    // Containment Sphere (Glass)
    const sphereGeom = new THREE.SphereGeometry(36, 64, 64);
    const sphereMesh = new THREE.Mesh(sphereGeom, tachyonGlass);
    coreGroup.add(sphereMesh);
    
    group.add(coreGroup);

    parts.push({
        name: "M-Theory Bulk Weaver Core",
        description: "The heart of the loom. 11 nested Calabi-Yau projection manifolds spinning in counter-resonance to generate a localized false-vacuum bubble.",
        material: "Tachyon Glass / Neon Plasma / Exotic Matter",
        function: "Fuses 0-branes into 1-dimensional open strings, then weaves them into localized reality membranes.",
        assemblyOrder: 3,
        connections: ["Quantum Needles", "Tachyon Manifolds", "Chassis"],
        failureEffect: "Catastrophic false-vacuum collapse obliterating the observable universe.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // ==========================================
    // 4. QUANTUM NEEDLE ARRAY & DILATON PISTONS
    // ==========================================
    const needleGroup = new THREE.Group();
    needleGroup.position.set(0, -10, -50); // Positioned where the fabric exits
    
    // Generate 24 massive complex needles
    for (let i=0; i<24; i++) {
        const xOffset = -46 + (i * 4);
        
        // Needle Shaft (Lathe)
        const nPoints = [];
        nPoints.push(new THREE.Vector2(0, 0));
        nPoints.push(new THREE.Vector2(0.1, 0));
        nPoints.push(new THREE.Vector2(0.5, 2));
        nPoints.push(new THREE.Vector2(1.5, 5));
        nPoints.push(new THREE.Vector2(0.8, 10));
        nPoints.push(new THREE.Vector2(0.8, 30));
        nPoints.push(new THREE.Vector2(1.2, 32));
        nPoints.push(new THREE.Vector2(1.2, 35));
        nPoints.push(new THREE.Vector2(0, 36));
        
        const nGeom = new THREE.LatheGeometry(nPoints, 32);
        const needle = new THREE.Mesh(nGeom, chrome);
        
        // Glowing Eye of the Needle (Torus)
        const eyeGeom = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
        const eye = new THREE.Mesh(eyeGeom, neonGreen);
        eye.position.set(0, 2, 0);
        needle.add(eye);
        
        // Dilaton Hydraulic Piston driving the needle
        const pistonOuterGeom = new THREE.CylinderGeometry(2, 2, 20, 32);
        const pistonOuter = new THREE.Mesh(pistonOuterGeom, darkSteel);
        pistonOuter.position.set(xOffset, 50, -50);
        
        const pistonInnerGeom = new THREE.CylinderGeometry(1.2, 1.2, 40, 32);
        const pistonInner = new THREE.Mesh(pistonInnerGeom, steel);
        
        needle.position.set(xOffset, 20, -50); // Will be animated
        
        meshes.pistons.push({ inner: pistonInner, outer: pistonOuter, baseY: 50 });
        meshes.needles.push({ mesh: needle, baseX: xOffset, phase: i * 0.5 });
        
        group.add(pistonOuter);
        group.add(pistonInner);
        group.add(needle);
    }

    parts.push({
        name: "Quantum Needle Array & Dilaton Pistons",
        description: "An array of 24 nanometer-sharp chrome needles driven by massive hydraulic Dilaton Pistons, oscillating at Planck frequencies.",
        material: "Chrome / Neon Green / Dark Steel",
        function: "Physically pierces the spacetime manifold, dragging 0-brane threads through higher dimensions to stitch reality.",
        assemblyOrder: 4,
        connections: ["Reality Fabric", "Supergravity Pump"],
        failureEffect: "Tears in the local spacetime continuum leading to paradox leaks.",
        cascadeFailures: ["Reality Fabric Collapse", "Tachyon Leak"],
        originalPosition: { x: 0, y: -10, z: -50 },
        explodedPosition: { x: 0, y: 100, z: -100 }
    });

    // ==========================================
    // 5. HYDRAULIC TUBE ROUTING (Tachyon Manifolds)
    // ==========================================
    const tubeGroup = new THREE.Group();
    // Create 30 complex 3D Lissajous curves routing all over the machine
    for (let i=0; i<30; i++) {
        const scale = 0.8 + Math.random() * 1.5;
        const fx = 1 + Math.floor(Math.random() * 5);
        const fy = 1 + Math.floor(Math.random() * 5);
        const fz = 1 + Math.floor(Math.random() * 5);
        const phase = Math.random() * Math.PI * 2;
        
        const curve = new TachyonCurve(scale, fx, fy, fz, phase);
        const tubeGeom = new THREE.TubeGeometry(curve, 256, 0.5 + Math.random()*0.8, 16, true);
        
        // Randomize materials between copper, glowing tubes, and rubber
        const matChoice = Math.random();
        let tubeMat;
        if (matChoice < 0.3) tubeMat = copper;
        else if (matChoice < 0.6) tubeMat = rubber;
        else if (matChoice < 0.8) tubeMat = neonBlue;
        else tubeMat = neonPurple;
        
        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        tube.position.set(0, 20, 0);
        tubeGroup.add(tube);
    }
    group.add(tubeGroup);

    parts.push({
        name: "Tachyon Manifold Sub-space Hydraulics",
        description: "A wildly complex knot of tubing tracing out multidimensional Lissajous curves.",
        material: "Copper / Rubber / Neon Condensate",
        function: "Pumps super-fluid tachyons and liquid dilaton fields to the core and pistons.",
        assemblyOrder: 5,
        connections: ["M-Theory Core", "Dilaton Pistons"],
        failureEffect: "Time runs backward locally, un-weaving reality.",
        cascadeFailures: ["Causality Inversion"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: -80, y: 80, z: 80 }
    });

    // ==========================================
    // 6. REALITY FABRIC (Highly Subdivided Plane)
    // ==========================================
    // 120 x 200 segments = 24,000 vertices for ultra-smooth wave interference
    const fabricGeom = new THREE.PlaneGeometry(100, 250, 120, 200); 
    const fabricMesh = new THREE.Mesh(fabricGeom, realityFabricMat);
    fabricMesh.rotation.x = -Math.PI / 2;
    fabricMesh.position.set(0, -15, -150);
    
    // Store original Z positions (which are currently 0 since it's a flat plane rotated)
    const positions = fabricGeom.attributes.position.array;
    const initialPositions = new Float32Array(positions.length);
    for(let i=0; i<positions.length; i++) {
        initialPositions[i] = positions[i];
    }
    fabricGeom.setAttribute('initialPosition', new THREE.BufferAttribute(initialPositions, 3));
    
    meshes.realityFabric = fabricMesh;
    group.add(fabricMesh);

    parts.push({
        name: "Emergent Reality Fabric",
        description: "A densely tessellated macro-membrane visually demonstrating the woven 11D bulk space cooling into 4D spacetime.",
        material: "Pure Spacetime (Emissive White Wireframe)",
        function: "The final product of the Loom. Literally outputs new sectors of the universe.",
        assemblyOrder: 6,
        connections: ["Quantum Needles"],
        failureEffect: "Total existential erasure.",
        cascadeFailures: ["N/A - Nothing remains to fail"],
        originalPosition: { x: 0, y: -15, z: -150 },
        explodedPosition: { x: 0, y: -50, z: -300 }
    });

    // ==========================================
    // 7. BRANE SPOOLS & TENSIONERS
    // ==========================================
    const spoolGroup = new THREE.Group();
    spoolGroup.position.set(0, 40, 80);
    
    for (let i=0; i<4; i++) {
        const spoolSub = new THREE.Group();
        
        const coreGeom = new THREE.CylinderGeometry(5, 5, 30, 64);
        const sCore = new THREE.Mesh(coreGeom, darkSteel);
        
        const flangeGeom = new THREE.CylinderGeometry(15, 15, 2, 64);
        const f1 = new THREE.Mesh(flangeGeom, chrome);
        f1.position.y = 15;
        const f2 = new THREE.Mesh(flangeGeom, chrome);
        f2.position.y = -15;
        
        // The wound 0-branes (represented by a thick glowing torus)
        const threadGeom = new THREE.TorusGeometry(10, 4, 32, 64);
        const thread = new THREE.Mesh(threadGeom, quantumGold);
        thread.scale.set(1, 1, 3);
        
        spoolSub.add(sCore);
        spoolSub.add(f1);
        spoolSub.add(f2);
        spoolSub.add(thread);
        
        spoolSub.rotation.z = Math.PI / 2;
        spoolSub.position.set(0, i * 35 - 50, 0); // Stacked vertically or horizontally
        
        meshes.spools.push(spoolSub);
        spoolGroup.add(spoolSub);
    }
    group.add(spoolGroup);

    parts.push({
        name: "Zero-Brane Spools",
        description: "Four colossal spools holding kilometers of raw 0-dimensional D-brane filament.",
        material: "Chrome / Dark Steel / Quantum Gold",
        function: "Feeds raw material into the M-Theory Core.",
        assemblyOrder: 7,
        connections: ["M-Theory Core", "String Tensioners"],
        failureEffect: "Spool unravels, tangling local space into a knot of cosmic strings.",
        cascadeFailures: ["Needle Jam", "Core Overload"],
        originalPosition: { x: 0, y: 40, z: 80 },
        explodedPosition: { x: 0, y: 150, z: 150 }
    });

    // ==========================================
    // 8. CONTROL CABIN (Extremely Detailed Interior)
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 60, 40);
    
    // Tinted Glass Dome
    const domeGeom = new THREE.SphereGeometry(18, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeom, tinted);
    cabinGroup.add(dome);
    
    // Cabin Base
    const cBaseGeom = new THREE.CylinderGeometry(18, 18, 2, 64);
    const cBase = new THREE.Mesh(cBaseGeom, darkSteel);
    cabinGroup.add(cBase);
    
    // Pilot Seat (Extrude geometries for complex ergonomic cushions)
    const seatShape = new THREE.Shape();
    seatShape.moveTo(-3, 0);
    seatShape.lineTo(3, 0);
    seatShape.lineTo(3, 6);
    seatShape.lineTo(2, 12);
    seatShape.lineTo(-2, 12);
    seatShape.lineTo(-3, 6);
    const seatExtrude = { depth: 4, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.5, bevelSegments: 3 };
    const seatGeom = new THREE.ExtrudeGeometry(seatShape, seatExtrude);
    const seat = new THREE.Mesh(seatGeom, rubber);
    seat.position.set(0, 1, -2);
    seat.rotation.x = -Math.PI / 16;
    cabinGroup.add(seat);
    
    // Massive Wrap-around Control Panel
    const panelGeom = new THREE.TorusGeometry(12, 4, 16, 64, Math.PI);
    const panel = new THREE.Mesh(panelGeom, controlPanelMat);
    panel.rotation.x = Math.PI / 2;
    panel.position.set(0, 6, 8);
    cabinGroup.add(panel);
    
    // 6 Holographic Screens
    for(let i=0; i<6; i++) {
        const screenGeom = new THREE.PlaneGeometry(6, 4);
        const screen = new THREE.Mesh(screenGeom, i%2==0 ? neonBlue : redAlertMat);
        const angle = (i/5) * Math.PI - Math.PI/2;
        screen.position.set(Math.sin(angle)*10, 10, Math.cos(angle)*10 + 5);
        screen.rotation.y = angle + Math.PI;
        cabinGroup.add(screen);
    }
    
    // Twin Joysticks
    const stickGeom = new THREE.CylinderGeometry(0.2, 0.4, 4, 16);
    const leftStick = new THREE.Mesh(stickGeom, chrome);
    leftStick.position.set(-5, 8, 5);
    leftStick.rotation.x = Math.PI / 8;
    cabinGroup.add(leftStick);
    
    const rightStick = new THREE.Mesh(stickGeom, chrome);
    rightStick.position.set(5, 8, 5);
    rightStick.rotation.x = Math.PI / 8;
    cabinGroup.add(rightStick);

    group.add(cabinGroup);

    parts.push({
        name: "God-Tier Operator Cabin",
        description: "An ergonomically perfect cockpit shielded by 5-inch thick tachyon glass, featuring wrap-around holographic UI panels.",
        material: "Tinted Glass / Rubber / Dark Steel / Holographic Emitters",
        function: "Allows a Class-V hyper-being to manually steer the loom through the 11D bulk.",
        assemblyOrder: 8,
        connections: ["Chassis", "Core Neural Link"],
        failureEffect: "Operator suffers severe cognitive dissonance resulting in multidimensional scattering of consciousness.",
        cascadeFailures: ["Manual Control Overload"],
        originalPosition: { x: 0, y: 60, z: 40 },
        explodedPosition: { x: 0, y: 200, z: 100 }
    });

    // ==========================================
    // 9. GRAVITON EXHAUST STACKS
    // ==========================================
    const exhaustGroup = new THREE.Group();
    const exhaustPositions = [
        { x: -25, z: 20 },
        { x: 25, z: 20 },
        { x: -25, z: -20 },
        { x: 25, z: -20 }
    ];
    
    exhaustPositions.forEach(pos => {
        const stackGeom = new THREE.CylinderGeometry(3, 4, 30, 32);
        const stack = new THREE.Mesh(stackGeom, chrome);
        stack.position.set(pos.x, 50, pos.z);
        
        // Add exhaust cooling fins
        for (let j=0; j<10; j++) {
            const finGeom = new THREE.TorusGeometry(4.5, 0.5, 16, 64);
            const fin = new THREE.Mesh(finGeom, darkSteel);
            fin.position.set(pos.x, 40 + j*2, pos.z);
            fin.rotation.x = Math.PI / 2;
            exhaustGroup.add(fin);
        }
        
        // Internal glowing plasma core
        const coreGeom = new THREE.CylinderGeometry(2, 2, 32, 16);
        const core = new THREE.Mesh(coreGeom, plasmaCoreMat);
        core.position.set(pos.x, 50, pos.z);
        
        meshes.exhaustParticles.push({ x: pos.x, y: 65, z: pos.z });
        
        exhaustGroup.add(stack);
        exhaustGroup.add(core);
    });
    group.add(exhaustGroup);

    parts.push({
        name: "Graviton Exhaust Stacks",
        description: "Four immense chrome chimneys with heat-dissipation fins.",
        material: "Chrome / Dark Steel / Plasma",
        function: "Vents excess gravitons and uncollapsed probability waves safely out of the loom's local light-cone.",
        assemblyOrder: 9,
        connections: ["Chassis", "M-Theory Core"],
        failureEffect: "Graviton buildup causes the machine to spontaneously form a micro black hole.",
        cascadeFailures: ["Spaghettification of Chassis"],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: 0, y: 150, z: -50 }
    });

    // ==========================================
    // DESCRIPTION & LORE
    // ==========================================
    const description = "The God-Tier Zero-Brane Loom is a monumental triumph of 11-dimensional engineering. Capable of navigating the chaotic bulk-space of M-theory, this colossal mobile factory physically weaves open strings from raw 0-branes, stabilizing them via overlapping Calabi-Yau manifolds before physically knitting them into localized sheets of spacetime. Driven by 24 Dilaton Pistons and suspended on fractional-dimension treads, it is the ultimate tool for generating custom universes on demand.";

    // ==========================================
    // STRING THEORY QUIZ (PhD Level)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the weak coupling limit of M-theory, what is the precise mathematical relationship between the 11-dimensional Planck length ($l_{11}$), the string length ($l_s$), and the string coupling constant ($g_s$)?",
            options: [
                "A) l_11 = g_s^(1/3) * l_s",
                "B) l_11 = g_s * l_s",
                "C) l_11 = g_s^(1/2) * l_s",
                "D) l_11 = g_s^(-1) * l_s"
            ],
            correctAnswer: "A) l_11 = g_s^(1/3) * l_s",
            explanation: "In M-theory compactified on a circle of radius R_11 to yield Type IIA string theory, the radius is given by R_11 = g_s * l_s. The 10-dimensional Planck length l_10 is related to the 11-dimensional one by l_10^8 = l_11^9 / R_11. Since l_10^8 is also equal to g_s^2 * l_s^8 in string theory, equating the two yields l_11^9 = g_s^3 * l_s^9, which simplifies to l_11 = g_s^(1/3) * l_s."
        },
        {
            question: "Which of the following actions accurately describes the world-volume dynamics of a Dp-brane in a general bosonic background (comprising metric, B-field, and dilaton) prior to considering non-abelian generalization for multiple coincident branes?",
            options: [
                "A) The Nambu-Goto action coupled with a Chern-Simons term.",
                "B) The Dirac-Born-Infeld (DBI) action supplemented by a Wess-Zumino (WZ) term.",
                "C) The Polyakov action with a Ramond-Ramond coupling.",
                "D) The localized Einstein-Hilbert action on the brane world-volume."
            ],
            correctAnswer: "B) The Dirac-Born-Infeld (DBI) action supplemented by a Wess-Zumino (WZ) term.",
            explanation: "The dynamics of a Dp-brane are completely governed by the DBI action, which dictates its coupling to the Neveu-Schwarz–Neveu-Schwarz (NS-NS) sector (metric, dilaton, and B-field). The Wess-Zumino (WZ) term must be added to account for the brane's topological coupling to the Ramond-Ramond (R-R) sector gauge potentials, allowing it to carry R-R charge."
        },
        {
            question: "Within the AdS/CFT correspondence relating Type IIB string theory on AdS_5 x S^5 to N=4 Super Yang-Mills (SYM) theory, what is the precise dictionary relating the AdS radius R (in string units) and the string coupling g_s to the 't Hooft coupling $\\lambda$ and Yang-Mills coupling g_YM?",
            options: [
                "A) (R / l_s)^4 = lambda,  and  4 * pi * g_s = g_YM^2",
                "B) (R / l_s)^2 = lambda,  and  g_s = g_YM^2",
                "C) (R / l_s)^4 = lambda^2, and 4 * pi * g_s = g_YM",
                "D) (R / l_s) = lambda^(1/4), and g_s = g_YM"
            ],
            correctAnswer: "A) (R / l_s)^4 = lambda,  and  4 * pi * g_s = g_YM^2",
            explanation: "The celebrated Maldacena conjecture dictates that the radius of the AdS space and the S^5 sphere is given by R^4 = 4 * pi * g_s * N * l_s^4. Since the 't Hooft coupling in the SYM theory is defined as lambda = g_YM^2 * N, and g_YM^2 = 4 * pi * g_s, we get R^4 / l_s^4 = lambda."
        },
        {
            question: "In the construction of the heterotic string theory via the covariant lattice formulation, anomaly cancellation uniquely restricts the gauge group. Which gauge groups are singled out?",
            options: [
                "A) SO(10) x SU(5) or E6",
                "B) SU(N) as N approaches infinity",
                "C) E8 x E8 or SO(32)",
                "D) U(32) or Sp(16)"
            ],
            correctAnswer: "C) E8 x E8 or SO(32)",
            explanation: "The Green-Schwarz anomaly cancellation mechanism requires that the gauge group of the resulting 10-dimensional N=1 supergravity theory has a dimension of exactly 496. In the heterotic string construction, this is realized by modular invariance requiring the internal momenta to lie on an even self-dual Euclidean lattice of dimension 16. The only two such lattices correspond to the root lattices of E8 x E8 and Spin(32)/Z2 (often referred to loosely as SO(32))."
        },
        {
            question: "Which of the following physical characteristics fundamentally distinguishes an orientifold plane (O-plane) from a standard D-brane in string theory compactifications?",
            options: [
                "A) O-planes carry negative tension and negative Ramond-Ramond charge, and are non-dynamical fixed points of a spacetime parity combined with worldsheet parity.",
                "B) O-planes are the endpoints of open strings that break half the supersymmetries, whereas D-branes break all supersymmetries.",
                "C) O-planes have dynamically fluctuating world-volumes while D-branes are rigid classical defects.",
                "D) O-planes strictly couple only to the NS-NS sector, entirely ignoring R-R fluxes."
            ],
            correctAnswer: "A) O-planes carry negative tension and negative Ramond-Ramond charge, and are non-dynamical fixed points of a spacetime parity combined with worldsheet parity.",
            explanation: "Orientifold planes arise as the fixed point locus of a discrete discrete orientifold symmetry (involving worldsheet parity reversal Omega). Unlike D-branes, they are non-dynamical objects (they do not have open string modes living on them). Crucially, to achieve stable string compactifications (such as cancelling R-R tadpoles), O-planes typically carry negative tension and negative R-R charge, counterbalancing the positive tension and charge of D-branes."
        }
    ];

    // ==========================================
    // HIGH-COMPLEXITY ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshesObj = meshes) {
        // 1. Rotate the massive wheels
        meshesObj.wheels.forEach(wheel => {
            wheel.rotation.x += 0.05 * speed;
        });
        
        // 2. Animate the M-Theory Core Rings (Multi-axis gyroscopic gimbal lock avoidance)
        meshesObj.coreRings.forEach(ring => {
            ring.mesh.rotation.x += ring.speedX * 0.02 * speed;
            ring.mesh.rotation.y += ring.speedY * 0.02 * speed;
            ring.mesh.rotation.z += ring.speedZ * 0.02 * speed;
            
            // Add a pulsing scale effect to simulate graviton fluctuation
            const scalePulse = 1.0 + Math.sin(time * 3.0 + ring.speedX) * 0.05;
            ring.mesh.scale.set(scalePulse, scalePulse, scalePulse);
        });
        
        // 3. Dilaton Pistons and Quantum Needles (Complex Sine Wave interference)
        meshesObj.needles.forEach((needleData, index) => {
            const { mesh, baseX, phase } = needleData;
            const pistonData = meshesObj.pistons[index];
            
            // Complex multi-frequency wave to simulate hyper-dimensional stitching
            const wave1 = Math.sin(time * 4.0 * speed + phase) * 15;
            const wave2 = Math.cos(time * 7.0 * speed + phase * 1.5) * 5;
            const verticalPos = wave1 + wave2; // ranges roughly -20 to +20
            
            // Move needle
            mesh.position.y = 20 + verticalPos;
            
            // Stretch the piston inner cylinder to match the needle
            // Base of outer is at Y=50. Inner cylinder needs to bridge Y=50 down to the needle at (20 + verticalPos)
            const gap = 50 - (20 + verticalPos);
            pistonData.inner.scale.y = gap / 40; // 40 is original geometry height
            pistonData.inner.position.x = baseX;
            pistonData.inner.position.y = 50 - gap / 2;
            pistonData.inner.position.z = -50;
        });
        
        // 4. Spin the Brane Spools
        meshesObj.spools.forEach((spool, index) => {
            spool.rotation.x += 0.1 * speed * (index % 2 === 0 ? 1 : -1);
        });
        
        // 5. Deform the Reality Fabric (High-performance vertex manipulation)
        if (meshesObj.realityFabric) {
            const fabric = meshesObj.realityFabric;
            const positionsAttr = fabric.geometry.attributes.position;
            const initialsAttr = fabric.geometry.attributes.initialPosition;
            
            for(let i=0; i<positionsAttr.count; i++) {
                const ix = initialsAttr.getX(i);
                const iy = initialsAttr.getY(i);
                const iz = initialsAttr.getZ(i);
                
                // 3D Wave interference pattern mimicking 11D un-compactification settling into 4D
                const waveA = Math.sin(ix * 0.1 + time * 3.0 * speed) * 3.5;
                const waveB = Math.cos(iy * 0.15 - time * 2.0 * speed) * 2.5;
                const waveC = Math.sin((ix + iy) * 0.05 + time * 1.5 * speed) * 4.0;
                const radialDist = Math.sqrt(ix*ix + iy*iy);
                const ripple = Math.sin(radialDist * 0.2 - time * 5.0 * speed) * 2.0;
                
                // Add extreme noise near the needles (which are at Y ~ -100 in the fabric's local space due to rotations)
                // We'll just apply the pure procedural noise across the board
                const finalZ = iz + waveA + waveB + waveC + ripple;
                
                positionsAttr.setZ(i, finalZ);
            }
            positionsAttr.needsUpdate = true;
            // Recompute normals for accurate lighting on the shifting fabric
            fabric.geometry.computeVertexNormals();
            
            // Slowly flow the fabric texture/wireframe backwards
            fabric.position.z = -150 - (time * 10 * speed) % 50; 
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
