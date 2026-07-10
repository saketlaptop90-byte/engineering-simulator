import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -----------------------------------------
    // Custom High-Tech Materials
    // -----------------------------------------
    const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 });
    const siliconMaterial = new THREE.MeshPhysicalMaterial({ color: 0x111116, metalness: 0.9, roughness: 0.05, clearcoat: 1.0, iridescence: 1.0, iridescenceIOR: 1.5 });
    const pufBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.7, roughness: 0.2 });
    const glowingTraceMaterial = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const activeDataMaterial = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 2.0 });
    const tamperMeshMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4, wireframe: true });
    const ceramicMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.3 });
    const heatFinMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.5 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x8a2be2, emissive: 0x8a2be2, emissiveIntensity: 1.5 });
    
    // -----------------------------------------
    // 1. PCB Substrate (Complex shape with chamfers)
    // -----------------------------------------
    const substrateSize = 35;
    const subShape = new THREE.Shape();
    const cornerRadius = 2;
    subShape.moveTo(-substrateSize/2 + cornerRadius, -substrateSize/2);
    subShape.lineTo(substrateSize/2 - cornerRadius, -substrateSize/2);
    subShape.quadraticCurveTo(substrateSize/2, -substrateSize/2, substrateSize/2, -substrateSize/2 + cornerRadius);
    subShape.lineTo(substrateSize/2, substrateSize/2 - cornerRadius);
    subShape.quadraticCurveTo(substrateSize/2, substrateSize/2, substrateSize/2 - cornerRadius, substrateSize/2);
    subShape.lineTo(-substrateSize/2 + cornerRadius, substrateSize/2);
    subShape.quadraticCurveTo(-substrateSize/2, substrateSize/2, -substrateSize/2, substrateSize/2 - cornerRadius);
    subShape.lineTo(-substrateSize/2, -substrateSize/2 + cornerRadius);
    subShape.quadraticCurveTo(-substrateSize/2, -substrateSize/2, -substrateSize/2 + cornerRadius, -substrateSize/2);

    const subExtrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const substrateGeo = new THREE.ExtrudeGeometry(subShape, subExtrudeSettings);
    const substrate = new THREE.Mesh(substrateGeo, darkSteel);
    substrate.rotation.x = Math.PI / 2;
    substrate.position.y = 0;
    group.add(substrate);
    meshes.substrate = substrate;

    parts.push({
        name: "Advanced Organic Substrate",
        description: "Multi-layer high-density interconnect (HDI) PCB substrate. Routes signals between the microscopic die bumps and the macroscopic BGA.",
        material: "darkSteel",
        function: "Structural support and signal routing",
        assemblyOrder: 1,
        connections: ["BGA Array", "Silicon Die"],
        failureEffect: "Signal degradation, cross-talk, or complete failure to communicate with motherboard.",
        cascadeFailures: ["Data Corruption", "System Crash"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // -----------------------------------------
    // 2. Ball Grid Array (BGA) - Bottom Side
    // -----------------------------------------
    const bgaGroup = new THREE.Group();
    const bgaRadius = 0.4;
    const bgaGeo = new THREE.SphereGeometry(bgaRadius, 16, 16);
    const bgaCount = 40;
    const bgaPitch = 0.8;
    // Using instanced mesh for BGA
    const bgaInstanced = new THREE.InstancedMesh(bgaGeo, chrome, bgaCount * bgaCount);
    let bgaIndex = 0;
    const bgaMatrix = new THREE.Matrix4();
    for(let i=0; i<bgaCount; i++) {
        for(let j=0; j<bgaCount; j++) {
            // Leave a hollow center for thermal pad
            if (i > 10 && i < 30 && j > 10 && j < 30) continue;
            
            const bx = -((bgaCount-1)*bgaPitch)/2 + i*bgaPitch;
            const bz = -((bgaCount-1)*bgaPitch)/2 + j*bgaPitch;
            bgaMatrix.setPosition(bx, -0.2, bz);
            bgaInstanced.setMatrixAt(bgaIndex, bgaMatrix);
            bgaIndex++;
        }
    }
    bgaInstanced.count = bgaIndex;
    bgaGroup.add(bgaInstanced);
    bgaGroup.position.y = -1.5;
    group.add(bgaGroup);
    meshes.bgaGroup = bgaGroup;

    parts.push({
        name: "High-Density BGA Array",
        description: "Over 1200 microscopic solder balls providing power, ground, and massive parallel data I/O to the host system.",
        material: "chrome",
        function: "Electrical interfacing",
        assemblyOrder: 2,
        connections: ["Substrate", "Motherboard"],
        failureEffect: "Cold solder joints causing intermittent IO failures.",
        cascadeFailures: ["Cryptographic Desync", "Boot Loop"],
        originalPosition: {x: 0, y: -1.5, z: 0},
        explodedPosition: {x: 0, y: -40, z: 0}
    });

    // -----------------------------------------
    // 3. Silicon Die Base (The Brains)
    // -----------------------------------------
    const dieSize = 18;
    const dieThickness = 0.5;
    const dieGeo = new THREE.BoxGeometry(dieSize, dieThickness, dieSize);
    const die = new THREE.Mesh(dieGeo, siliconMaterial);
    die.position.y = 1.0;
    group.add(die);
    meshes.die = die;

    parts.push({
        name: "Monocrystalline Silicon Die",
        description: "The main integrated circuit, fabricated on a 3nm node. Contains billions of transistors forming the PUF array and cryptographic accelerators.",
        material: "glass",
        function: "Logic execution and entropy generation",
        assemblyOrder: 3,
        connections: ["Substrate", "Bonding Wires", "Tamper Mesh"],
        failureEffect: "Complete failure of cryptographic operations.",
        cascadeFailures: ["System Lockdown", "Data Loss"],
        originalPosition: {x: 0, y: 1.0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // -----------------------------------------
    // 4. Physical Unclonable Function (PUF) Core Array
    // -----------------------------------------
    const pufGroup = new THREE.Group();
    // Complex geometry for PUF cells (SRAM-like cross-coupled inverters visualized)
    const cellGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const pufGridSize = 64;
    const pufPitch = 0.15;
    const pufInstanced = new THREE.InstancedMesh(cellGeo, pufBaseMaterial, pufGridSize * pufGridSize);
    
    // We want some cells to glow to show entropy. We'll handle this in animation, but set colors now.
    const pufColors = new Float32Array(pufGridSize * pufGridSize * 3);
    const dummyColor = new THREE.Color();
    let pufIndex = 0;
    const pufMatrix = new THREE.Matrix4();
    
    for(let i=0; i<pufGridSize; i++) {
        for(let j=0; j<pufGridSize; j++) {
            const px = -((pufGridSize-1)*pufPitch)/2 + i*pufPitch;
            const pz = -((pufGridSize-1)*pufPitch)/2 + j*pufPitch;
            // slight random height variation to represent manufacturing variances (the core of PUF)
            const hVar = Math.random() * 0.1;
            pufMatrix.makeTranslation(px, hVar/2, pz);
            pufInstanced.setMatrixAt(pufIndex, pufMatrix);
            
            // Random initial state 0 or 1
            const bit = Math.random() > 0.5 ? 1 : 0;
            if(bit === 1) dummyColor.setHex(0x00e5ff); // active cell
            else dummyColor.setHex(0x111133); // inactive cell
            
            dummyColor.toArray(pufColors, pufIndex * 3);
            pufIndex++;
        }
    }
    pufInstanced.instanceColor = new THREE.InstancedBufferAttribute(pufColors, 3);
    pufGroup.add(pufInstanced);
    pufGroup.position.set(-2, 1.25 + 0.15, -2); // Offset to one side of the die
    group.add(pufGroup);
    meshes.pufInstanced = pufInstanced;

    parts.push({
        name: "PUF Entropy Array",
        description: "A dense array of SRAM cells utilizing microscopic manufacturing variations (dopant fluctuations, line edge roughness) to generate a unique, unclonable digital fingerprint.",
        material: "copper",
        function: "Unique key generation based on physical properties",
        assemblyOrder: 4,
        connections: ["Silicon Die", "Crypto Engine"],
        failureEffect: "Inability to generate the master key, rendering all encrypted data inaccessible.",
        cascadeFailures: ["Permanent Data Loss"],
        originalPosition: {x: -2, y: 1.4, z: -2},
        explodedPosition: {x: -10, y: 20, z: -10}
    });

    // -----------------------------------------
    // 5. Cryptographic Accelerator Engine
    // -----------------------------------------
    // Represented as a block of complex logic gates and glowing pathways
    const cryptoGroup = new THREE.Group();
    const cryptoBaseGeo = new THREE.BoxGeometry(6, 0.4, 6);
    const cryptoBase = new THREE.Mesh(cryptoBaseGeo, darkSteel);
    cryptoGroup.add(cryptoBase);
    
    // Add glowing hashing rings
    const ringGeo = new THREE.TorusGeometry(2, 0.1, 16, 64);
    const cryptoRing1 = new THREE.Mesh(ringGeo, neonPurple);
    cryptoRing1.rotation.x = Math.PI / 2;
    cryptoRing1.position.y = 0.25;
    cryptoGroup.add(cryptoRing1);
    
    const cryptoRing2 = new THREE.Mesh(ringGeo, activeDataMaterial);
    cryptoRing2.scale.set(0.6, 0.6, 0.6);
    cryptoRing2.rotation.x = Math.PI / 2;
    cryptoRing2.position.y = 0.3;
    cryptoGroup.add(cryptoRing2);
    
    // Add central processing pillar
    const procGeo = new THREE.CylinderGeometry(0.5, 0.8, 0.8, 16);
    const proc = new THREE.Mesh(procGeo, steel);
    proc.position.y = 0.4;
    cryptoGroup.add(proc);
    
    cryptoGroup.position.set(4, 1.2 + 0.2, 4);
    group.add(cryptoGroup);
    meshes.cryptoGroup = cryptoGroup;
    meshes.cryptoRing1 = cryptoRing1;
    meshes.cryptoRing2 = cryptoRing2;

    parts.push({
        name: "Quantum-Resistant Crypto Engine",
        description: "Dedicated hardware macro for performing AES-256, SHA-3, and post-quantum lattice-based cryptography, using the PUF response as the seed.",
        material: "darkSteel",
        function: "High-speed encryption and hashing",
        assemblyOrder: 5,
        connections: ["PUF Entropy Array", "Data Bus"],
        failureEffect: "Cryptographic operations fallback to software, reducing speed by 10,000x.",
        cascadeFailures: ["Timeout Errors", "System Halt"],
        originalPosition: {x: 4, y: 1.4, z: 4},
        explodedPosition: {x: 20, y: 30, z: 20}
    });

    // -----------------------------------------
    // 6. Secure Boot ROM & Non-Volatile Memory
    // -----------------------------------------
    const romGroup = new THREE.Group();
    const romGeo = new THREE.BoxGeometry(4, 0.3, 8);
    const romMesh = new THREE.Mesh(romGeo, plastic);
    romGroup.add(romMesh);
    // Add memory banks
    for(let i=0; i<4; i++) {
        const bankGeo = new THREE.BoxGeometry(3.5, 0.2, 1.5);
        const bank = new THREE.Mesh(bankGeo, copper);
        bank.position.set(0, 0.2, -3.2 + i*2.1);
        romGroup.add(bank);
    }
    romGroup.position.set(5, 1.25, -3);
    group.add(romGroup);
    meshes.romGroup = romGroup;

    parts.push({
        name: "Anti-Tamper Boot ROM",
        description: "Read-only memory containing the immutable root of trust code. Surrounded by active shield lines to detect micro-probing.",
        material: "plastic",
        function: "Secure boot sequence initiation",
        assemblyOrder: 6,
        connections: ["Crypto Engine", "Main Processor"],
        failureEffect: "Device refuses to boot to prevent code execution from untrusted sources.",
        cascadeFailures: ["Brick State"],
        originalPosition: {x: 5, y: 1.25, z: -3},
        explodedPosition: {x: 30, y: 15, z: -15}
    });

    // -----------------------------------------
    // 7. Gold I/O Pads
    // -----------------------------------------
    const padsGroup = new THREE.Group();
    const padGeo = new THREE.BoxGeometry(0.4, 0.05, 0.8);
    const padCountPerSide = 12;
    const dieHalf = dieSize / 2;
    const padOffset = 0.5;
    
    const allPads = []; // to store pad positions for wires
    
    function createPadLine(count, startX, startZ, stepX, stepZ, rotY) {
        for(let i=0; i<count; i++) {
            const pad = new THREE.Mesh(padGeo, goldMaterial);
            const px = startX + i*stepX;
            const pz = startZ + i*stepZ;
            pad.position.set(px, 0, pz);
            pad.rotation.y = rotY;
            padsGroup.add(pad);
            allPads.push(new THREE.Vector3(px, 1.25, pz));
        }
    }
    
    // Top Edge
    createPadLine(padCountPerSide, -dieHalf + 1.5, -dieHalf + padOffset, (dieSize-3)/(padCountPerSide-1), 0, 0);
    // Bottom Edge
    createPadLine(padCountPerSide, -dieHalf + 1.5, dieHalf - padOffset, (dieSize-3)/(padCountPerSide-1), 0, 0);
    // Left Edge
    createPadLine(padCountPerSide, -dieHalf + padOffset, -dieHalf + 1.5, 0, (dieSize-3)/(padCountPerSide-1), Math.PI/2);
    // Right Edge
    createPadLine(padCountPerSide, dieHalf - padOffset, -dieHalf + 1.5, 0, (dieSize-3)/(padCountPerSide-1), Math.PI/2);
    
    padsGroup.position.y = 1.25;
    group.add(padsGroup);

    parts.push({
        name: "Gold I/O Pads",
        description: "Ultra-pure gold contact pads distributed around the periphery of the die, serving as the electrical interface points.",
        material: "copper", 
        function: "Wirebond attachment points",
        assemblyOrder: 7,
        connections: ["Silicon Die", "Bonding Wires"],
        failureEffect: "Open circuit on specific data/power lines.",
        cascadeFailures: ["Data Bus Width Reduction", "Power Starvation"],
        originalPosition: {x: 0, y: 1.25, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // -----------------------------------------
    // 8. Microscopic Bonding Wires
    // -----------------------------------------
    const wiresGroup = new THREE.Group();
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.1 }); // Gold wire
    
    allPads.forEach((padPos, index) => {
        // Calculate a corresponding point on the substrate edge
        const dir = padPos.clone().setY(0).normalize();
        const subPos = dir.clone().multiplyScalar(dieSize/2 + 3);
        subPos.y = 0.5; // Substrate height
        
        // Control point for the arc
        const midPos = padPos.clone().lerp(subPos, 0.5);
        midPos.y += 2.5 + Math.random(); // Loop height
        
        const curve = new THREE.CatmullRomCurve3([
            padPos,
            midPos,
            subPos
        ]);
        
        const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.03, 8, false);
        const wire = new THREE.Mesh(tubeGeo, wireMat);
        wiresGroup.add(wire);
    });
    group.add(wiresGroup);

    parts.push({
        name: "Gold Bonding Wires",
        description: "25-micron thick gold wires forming ultrasonic wedge bonds between the die pads and the substrate traces.",
        material: "copper",
        function: "Electrical bridging",
        assemblyOrder: 8,
        connections: ["Gold I/O Pads", "Substrate"],
        failureEffect: "Wire sweep or lift causing short circuits or open lines.",
        cascadeFailures: ["Catastrophic Device Failure"],
        originalPosition: {x: 0, y: 2, z: 0},
        explodedPosition: {x: 0, y: 25, z: 0}
    });

    // -----------------------------------------
    // 9. Active Tamper Mesh
    // -----------------------------------------
    // A wireframe dome/grid covering the die
    const meshGroup = new THREE.Group();
    const gridGeo = new THREE.PlaneGeometry(dieSize, dieSize, 20, 20);
    // Displace vertices to make it wavy
    const posAttribute = gridGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = Math.sin(x*2)*0.1 + Math.cos(y*2)*0.1;
        posAttribute.setZ(i, z);
    }
    gridGeo.computeVertexNormals();
    const tamperMesh = new THREE.Mesh(gridGeo, tamperMeshMaterial);
    tamperMesh.rotation.x = -Math.PI / 2;
    tamperMesh.position.y = 2.0; // Above the die
    meshGroup.add(tamperMesh);
    group.add(meshGroup);
    meshes.tamperMesh = tamperMesh;

    parts.push({
        name: "Active Serpentine Tamper Mesh",
        description: "A cryptographic boundary formed by continuously monitored, tightly spaced conductive traces. Any attempt to physically probe or decap the chip breaks the mesh.",
        material: "steel",
        function: "Physical intrusion detection",
        assemblyOrder: 9,
        connections: ["Substrate", "Crypto Engine"],
        failureEffect: "Intentional destruction of the PUF master key (Zeroization).",
        cascadeFailures: ["Device Brick", "Data Unrecoverable"],
        originalPosition: {x: 0, y: 2.0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // -----------------------------------------
    // 10. High-Speed Data Traces
    // -----------------------------------------
    const tracesGroup = new THREE.Group();
    const traceCount = 15;
    const traceMeshes = [];
    
    for(let i=0; i<traceCount; i++) {
        const points = [];
        let curX = 4 + (Math.random()-0.5)*2;
        let curZ = 4 + (Math.random()-0.5)*2;
        points.push(new THREE.Vector3(curX, 1.25, curZ));
        
        for(let j=0; j<3; j++) {
            curX += (Math.random()-0.5)*4;
            curZ += (Math.random()-0.5)*4;
            points.push(new THREE.Vector3(curX, 1.25, curZ));
        }
        
        const path = new THREE.CatmullRomCurve3(points);
        const traceGeo = new THREE.TubeGeometry(path, 20, 0.05, 4, false);
        const traceMesh = new THREE.Mesh(traceGeo, glowingTraceMaterial);
        tracesGroup.add(traceMesh);
        traceMeshes.push({mesh: traceMesh, offset: Math.random() * Math.PI * 2});
    }
    group.add(tracesGroup);
    meshes.traceMeshes = traceMeshes;

    parts.push({
        name: "Photonic Data Interconnects",
        description: "On-die optical waveguides replacing traditional copper buses for ultra-fast, side-channel-resistant data transfer.",
        material: "glass",
        function: "High-bandwidth internal routing",
        assemblyOrder: 10,
        connections: ["Crypto Engine", "PUF Array", "Boot ROM"],
        failureEffect: "Data corruption or massive latency spikes.",
        cascadeFailures: ["Timing Attacks Vulnerability"],
        originalPosition: {x: 0, y: 1.25, z: 0},
        explodedPosition: {x: 0, y: 12, z: 0}
    });

    // -----------------------------------------
    // 11. Decoupling Capacitors (SMD)
    // -----------------------------------------
    const capsGroup = new THREE.Group();
    const capGeo = new THREE.BoxGeometry(0.8, 0.4, 0.4);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x997755, metalness: 0.2, roughness: 0.9 });
    const capEndGeo = new THREE.BoxGeometry(0.2, 0.45, 0.45);
    
    const capPositions = [
        {x: 10, z: 12}, {x: 12, z: 12}, {x: 14, z: 12},
        {x: -10, z: 12}, {x: -12, z: 12}, {x: -14, z: 12},
        {x: 10, z: -12}, {x: -10, z: -12},
        {x: 14, z: 0}, {x: -14, z: 0}
    ];
    
    capPositions.forEach(pos => {
        const cGrp = new THREE.Group();
        const body = new THREE.Mesh(capGeo, capMat);
        const end1 = new THREE.Mesh(capEndGeo, chrome);
        end1.position.x = -0.4;
        const end2 = new THREE.Mesh(capEndGeo, chrome);
        end2.position.x = 0.4;
        cGrp.add(body, end1, end2);
        
        cGrp.position.set(pos.x, 0.9, pos.z);
        // Random rotation 0 or 90
        if(Math.random() > 0.5) cGrp.rotation.y = Math.PI / 2;
        capsGroup.add(cGrp);
    });
    group.add(capsGroup);

    parts.push({
        name: "MLCC Decoupling Network",
        description: "Multi-Layer Ceramic Capacitors mounted directly on the substrate to filter out high-frequency noise and prevent power-analysis side-channel attacks.",
        material: "ceramic",
        function: "Power conditioning and side-channel mitigation",
        assemblyOrder: 11,
        connections: ["Substrate Power Planes"],
        failureEffect: "Increased power noise, making the chip vulnerable to Differential Power Analysis (DPA).",
        cascadeFailures: ["Secret Key Extraction"],
        originalPosition: {x: 0, y: 0.9, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // -----------------------------------------
    // 12. Clock Generator (Crystal Oscillator)
    // -----------------------------------------
    const oscGroup = new THREE.Group();
    const oscBase = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 3), darkSteel);
    const oscCan = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 2.8), aluminum);
    oscCan.position.y = 0.5;
    oscGroup.add(oscBase, oscCan);
    
    // Tiny pins
    for(let i=0; i<4; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4), goldMaterial);
        pin.position.set(i<2?-0.8:0.8, 0.1, i%2===0?-1.2:1.2);
        oscGroup.add(pin);
    }
    oscGroup.position.set(-10, 0.9, -10);
    group.add(oscGroup);

    parts.push({
        name: "Temperature-Compensated Oscillator",
        description: "Provides a highly stable 500MHz clock signal. Impervious to extreme temperature variations to prevent clock-glitching attacks.",
        material: "aluminum",
        function: "Timing synchronization",
        assemblyOrder: 12,
        connections: ["Substrate", "Silicon Die"],
        failureEffect: "System desynchronization leading to random state faults.",
        cascadeFailures: ["Fault Injection Vulnerability"],
        originalPosition: {x: -10, y: 0.9, z: -10},
        explodedPosition: {x: -25, y: 15, z: -25}
    });

    // -----------------------------------------
    // 13. Epoxy Underfill
    // -----------------------------------------
    const underfillGeo = new THREE.BoxGeometry(19, 0.6, 19);
    const underfill = new THREE.Mesh(underfillGeo, rubber);
    underfill.position.y = 0.5; // Between substrate and die
    group.add(underfill);

    parts.push({
        name: "Capillary Epoxy Underfill",
        description: "Thermosetting polymer injected between the die and substrate to distribute thermal expansion stress and protect the micro-bumps.",
        material: "rubber",
        function: "Mechanical and thermal stress relief",
        assemblyOrder: 13,
        connections: ["Silicon Die", "Substrate"],
        failureEffect: "Thermal cycling causes micro-bump fracture.",
        cascadeFailures: ["Die Delamination"],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // -----------------------------------------
    // 14. Integrated Heat Spreader (IHS) & Encapsulation
    // -----------------------------------------
    const ihsGroup = new THREE.Group();
    
    // Main casing
    const ihsShape = new THREE.Shape();
    const ihsSize = 32;
    const ihsRad = 3;
    ihsShape.moveTo(-ihsSize/2 + ihsRad, -ihsSize/2);
    ihsShape.lineTo(ihsSize/2 - ihsRad, -ihsSize/2);
    ihsShape.quadraticCurveTo(ihsSize/2, -ihsSize/2, ihsSize/2, -ihsSize/2 + ihsRad);
    ihsShape.lineTo(ihsSize/2, ihsSize/2 - ihsRad);
    ihsShape.quadraticCurveTo(ihsSize/2, ihsSize/2, ihsSize/2 - ihsRad, ihsSize/2);
    ihsShape.lineTo(-ihsSize/2 + ihsRad, ihsSize/2);
    ihsShape.quadraticCurveTo(-ihsSize/2, ihsSize/2, -ihsSize/2, ihsSize/2 - ihsRad);
    ihsShape.lineTo(-ihsSize/2, -ihsSize/2 + ihsRad);
    ihsShape.quadraticCurveTo(-ihsSize/2, -ihsSize/2, -ihsSize/2 + ihsRad, -ihsSize/2);

    const ihsExtrude = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const ihsGeo = new THREE.ExtrudeGeometry(ihsShape, ihsExtrude);
    const ihs = new THREE.Mesh(ihsGeo, plastic);
    ihs.rotation.x = Math.PI / 2;
    ihs.position.y = 4.5;
    ihsGroup.add(ihs);

    // Heat fins on top
    const finCount = 12;
    for(let i=0; i<finCount; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(28, 1, 0.5), heatFinMaterial);
        fin.position.set(0, 5, -14 + i*2.5);
        ihsGroup.add(fin);
    }
    
    // Laser engraving / logo on a central flat plate
    const logoPlate = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), aluminum);
    logoPlate.rotation.x = -Math.PI / 2;
    logoPlate.position.set(0, 5.01, 0);
    ihsGroup.add(logoPlate);

    group.add(ihsGroup);
    meshes.ihsGroup = ihsGroup;

    parts.push({
        name: "Armored Encapsulation Shell",
        description: "Opaque, chemically resistant epoxy mold compound infused with ceramic particles. Acts as an integrated heat spreader and anti-solvent physical barrier.",
        material: "plastic",
        function: "Environmental protection and thermal dissipation",
        assemblyOrder: 14,
        connections: ["Substrate"],
        failureEffect: "Thermal throttling or environmental degradation of the die.",
        cascadeFailures: ["Overheating", "Physical Compromise"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 60, z: 0}
    });

    // -----------------------------------------
    // 15. Security Probe Matrix
    // -----------------------------------------
    // Microscopic probes dropping from the encapsulation down to the die
    const probeGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 2), chrome);
        const px = (Math.random()-0.5)*15;
        const pz = (Math.random()-0.5)*15;
        probe.position.set(px, 3.5, pz);
        probeGroup.add(probe);
    }
    group.add(probeGroup);

    parts.push({
        name: "Capacitive Security Probes",
        description: "Embedded within the encapsulation, these microscopic probes continuously measure the capacitance of the package. Drilling or milling alters the capacitance, triggering zeroization.",
        material: "chrome",
        function: "Volumetric tamper detection",
        assemblyOrder: 15,
        connections: ["Encapsulation", "Tamper Mesh"],
        failureEffect: "False positive tamper detection leading to accidental self-destruction.",
        cascadeFailures: ["Unrecoverable Zeroization"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // -----------------------------------------
    // Animation Logic
    // -----------------------------------------
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // 1. Pulse the glowing traces
        if (meshes.traceMeshes) {
            meshes.traceMeshes.forEach(item => {
                const intensity = (Math.sin(t * 10 + item.offset) + 1) / 2; // 0 to 1
                item.mesh.material.emissiveIntensity = 0.5 + intensity * 2.0;
            });
        }
        
        // 2. Rotate the cryptographic hashing rings
        if (meshes.cryptoRing1 && meshes.cryptoRing2) {
            meshes.cryptoRing1.rotation.z = t * 5;
            meshes.cryptoRing2.rotation.z = -t * 8;
            
            // Pulse crypto rings
            meshes.cryptoRing2.material.emissiveIntensity = 1 + Math.sin(t * 15) * 1;
        }
        
        // 3. Animate PUF cells (entropy visualization)
        if (meshes.pufInstanced) {
            const numUpdates = 20;
            const dummyC = new THREE.Color();
            const colorsAttr = meshes.pufInstanced.instanceColor;
            for(let k=0; k<numUpdates; k++) {
                const idx = Math.floor(Math.random() * (64 * 64)); // 64 is pufGridSize
                const isHigh = Math.random() > 0.5;
                if(isHigh) dummyC.setHex(0xff0055); // sampling state
                else dummyC.setHex(0x00e5ff); 
                
                // rapidly revert some back to dark to keep it blinking
                if(Math.random() > 0.7) dummyC.setHex(0x111133);
                
                dummyC.toArray(colorsAttr.array, idx * 3);
            }
            colorsAttr.needsUpdate = true;
        }

        // 4. Oscillate the tamper mesh slightly to show "active" monitoring
        if (meshes.tamperMesh) {
            const pos = meshes.tamperMesh.geometry.attributes.position;
            for(let i=0; i<pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const z = Math.sin(x*2 + t) * 0.05 + Math.cos(y*2 - t) * 0.05;
                pos.setZ(i, z);
            }
            meshes.tamperMesh.geometry.computeVertexNormals();
            pos.needsUpdate = true;
        }
    }

    // -----------------------------------------
    // Quiz Questions
    // -----------------------------------------
    const quizQuestions = [
        {
            question: "How does the Physical Unclonable Function (PUF) generate a unique cryptographic key?",
            options: [
                "By downloading a random seed from a secure cloud server upon boot.",
                "By measuring microscopic manufacturing variations in the silicon structure that are physically impossible to replicate.",
                "By utilizing a high-frequency crystal oscillator to generate pseudo-random numbers.",
                "By reading a hardcoded serial number burned into the Boot ROM by the manufacturer."
            ],
            correctAnswer: 1,
            explanation: "PUFs exploit uncontrollable, nanoscale manufacturing variations (like dopant distribution or line edge roughness) to create a unique 'silicon fingerprint'. Because these variations are random and atomic-level, not even the original manufacturer can create an exact clone."
        },
        {
            question: "What is the primary purpose of the Active Serpentine Tamper Mesh?",
            options: [
                "To distribute power evenly across the monocrystalline silicon die.",
                "To act as a heat sink for the Cryptographic Accelerator Engine.",
                "To continuously monitor physical integrity; if the mesh is broken by a drill or probe, the chip instantly wipes its keys.",
                "To shield the chip from Electromagnetic Interference (EMI) generated by the motherboard."
            ],
            correctAnswer: 2,
            explanation: "The tamper mesh is a cryptographic boundary. It consists of delicate, tightly packed traces carrying a continuous signal. Physical intrusion (like decapsulation or micro-probing) breaks the traces, triggering an immediate 'zeroization' that destroys all sensitive data."
        },
        {
            question: "Why are Multi-Layer Ceramic Capacitors (MLCCs) mounted directly on the substrate near the die?",
            options: [
                "To filter high-frequency power noise and thwart Differential Power Analysis (DPA) side-channel attacks.",
                "To store backup power so the chip can operate for hours without main power.",
                "To amplify the optical data signals traveling through the Photonic Data Interconnects.",
                "To increase the overall weight of the package for thermal mass."
            ],
            correctAnswer: 0,
            explanation: "Cryptographic operations draw power in patterns dependent on the data being processed. DPA attacks measure these tiny power fluctuations to steal keys. On-substrate MLCCs decouple the power supply, smoothing out these fluctuations and hiding the power signature."
        },
        {
            question: "What happens if the Capillary Epoxy Underfill experiences severe thermal cycling and micro-bump fracture occurs?",
            options: [
                "The chip automatically reroutes data through the gold bonding wires.",
                "The PUF array generates a new, identical master key.",
                "The mechanical stress causes delamination and open circuits, leading to catastrophic communication failure with the substrate.",
                "The Encapsulation Shell melts and reforms to seal the fracture."
            ],
            correctAnswer: 2,
            explanation: "The underfill is crucial for absorbing the differing rates of thermal expansion between the silicon die and the PCB substrate. If it fails, the microscopic solder bumps connecting the die will shear or fracture, severing electrical connections permanently."
        },
        {
            question: "Why does the chip utilize a Temperature-Compensated Oscillator instead of a standard crystal?",
            options: [
                "To prevent attackers from using extreme heat or cold to induce 'clock glitches' that bypass security checks.",
                "Because standard crystals interfere with the quantum-resistant cryptographic algorithms.",
                "To ensure the chip runs faster when the system overheats.",
                "To provide an accurate time-of-day clock for the host operating system."
            ],
            correctAnswer: 0,
            explanation: "Attackers often use extreme temperatures to alter the frequency of standard oscillators, causing 'glitches' where instructions are skipped (such as bypassing a password check). A Temperature-Compensated Oscillator maintains a strict frequency regardless of environmental conditions, thwarting fault injection attacks."
        }
    ];

    return {
        group,
        parts,
        description: "The Cyber PUF Chip is an ultra-secure, tamper-resistant cryptographic co-processor. It relies on a Physical Unclonable Function (PUF)—leveraging atomic-level silicon manufacturing variations—to generate a unique master key that never exists outside the chip. Protected by active tamper meshes, volumetric capacitive probes, and side-channel resistant power filtering, it is designed to instantly zeroize all data upon detecting physical or electrical intrusion.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createPUFChip() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
