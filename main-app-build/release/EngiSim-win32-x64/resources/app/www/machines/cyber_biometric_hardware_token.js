import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for materials
    const glowingBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
    const hologramMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const pcbGreen = new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 0.8, metalness: 0.2 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 1 });
    const carbonFiber = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.4 });
    const ceramic = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
    const scannerGlass = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.1, roughness: 0.05, transmission: 0.9, thickness: 0.1 });

    // 1. Casing Base (ExtrudeGeometry)
    const casingShape = new THREE.Shape();
    const width = 2.5, length = 5.0, radius = 0.5;
    casingShape.moveTo(-width/2 + radius, -length/2);
    casingShape.lineTo(width/2 - radius, -length/2);
    casingShape.quadraticCurveTo(width/2, -length/2, width/2, -length/2 + radius);
    casingShape.lineTo(width/2, length/2 - radius);
    casingShape.quadraticCurveTo(width/2, length/2, width/2 - radius, length/2);
    casingShape.lineTo(-width/2 + radius, length/2);
    casingShape.quadraticCurveTo(-width/2, length/2, -width/2, length/2 - radius);
    casingShape.lineTo(-width/2, -length/2 + radius);
    casingShape.quadraticCurveTo(-width/2, -length/2, -width/2 + radius, -length/2);

    const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const casingBaseGeo = new THREE.ExtrudeGeometry(casingShape, extrudeSettings);
    const casingBase = new THREE.Mesh(casingBaseGeo, carbonFiber);
    casingBase.position.set(0, 0, -0.2);
    group.add(casingBase);
    meshes.casingBase = casingBase;
    parts.push({
        name: 'Carbon Fiber Lower Chassis',
        description: 'Military-grade carbon fiber composite lower casing, providing electromagnetic shielding and physical tamper resistance.',
        material: 'Carbon Fiber',
        function: 'Houses internal components and resists physical attacks.',
        assemblyOrder: 1,
        connections: ['pcbMain', 'casingTop', 'batteryPack'],
        failureEffect: 'Exposes internal circuitry to EMP and physical damage.',
        cascadeFailures: ['tamperMesh'],
        originalPosition: { x: 0, y: 0, z: -0.2 },
        explodedPosition: { x: 0, y: 0, z: -2 }
    });

    // 2. Main PCB
    const pcbGeo = new THREE.BoxGeometry(2.3, 4.6, 0.05);
    const pcbMain = new THREE.Mesh(pcbGeo, pcbGreen);
    pcbMain.position.set(0, 0, 0.1);
    group.add(pcbMain);
    meshes.pcbMain = pcbMain;
    parts.push({
        name: 'Secure Motherboard',
        description: 'Multi-layer high-density PCB with embedded tamper-detect meshes.',
        material: 'FR4 / Gold',
        function: 'Routes signals between secure enclave, USB controller, and biometric sensors.',
        assemblyOrder: 2,
        connections: ['cryptoChip', 'fingerprintScanner', 'usbConnector', 'casingBase'],
        failureEffect: 'Device completely unresponsive. Zeroize circuitry triggers.',
        cascadeFailures: ['cryptoChip', 'usbConnector'],
        originalPosition: { x: 0, y: 0, z: 0.1 },
        explodedPosition: { x: 0, y: 0, z: -1.0 }
    });

    // 3. Crypto Chip (Secure Enclave)
    const cryptoGroup = new THREE.Group();
    const chipBodyGeo = new THREE.BoxGeometry(1.0, 1.0, 0.15);
    const chipBody = new THREE.Mesh(chipBodyGeo, ceramic);
    cryptoGroup.add(chipBody);
    
    // Add gold pins around the chip
    for(let i=0; i<8; i++) {
        const pinGeo = new THREE.BoxGeometry(0.1, 0.02, 0.02);
        const pinL = new THREE.Mesh(pinGeo, gold);
        pinL.position.set(-0.55, -0.35 + i*0.1, -0.05);
        cryptoGroup.add(pinL);
        const pinR = new THREE.Mesh(pinGeo, gold);
        pinR.position.set(0.55, -0.35 + i*0.1, -0.05);
        cryptoGroup.add(pinR);
    }
    
    // Exposed Silicon Core (glowing)
    const coreGeo = new THREE.BoxGeometry(0.4, 0.4, 0.16);
    const coreMesh = new THREE.Mesh(coreGeo, glowingBlue);
    cryptoGroup.add(coreMesh);
    meshes.coreMesh = coreMesh; 

    cryptoGroup.position.set(0, 1.0, 0.2);
    group.add(cryptoGroup);
    meshes.cryptoGroup = cryptoGroup;
    parts.push({
        name: 'Quantum-Resistant Secure Enclave',
        description: 'Hardened cryptographic coprocessor. Performs ECC and quantum-resistant lattice-based cryptography isolated from the host.',
        material: 'Ceramic / Silicon / Gold',
        function: 'Stores private keys and signs transactions.',
        assemblyOrder: 3,
        connections: ['pcbMain'],
        failureEffect: 'Inability to sign requests or authenticate.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.0, z: 0.2 },
        explodedPosition: { x: 0, y: 2.0, z: 0.5 }
    });

    // 4. USB-C Connector (Male)
    const usbGroup = new THREE.Group();
    const usbShape = new THREE.Shape();
    usbShape.moveTo(-0.4, -0.1);
    usbShape.lineTo(0.4, -0.1);
    usbShape.quadraticCurveTo(0.5, -0.1, 0.5, 0);
    usbShape.quadraticCurveTo(0.5, 0.1, 0.4, 0.1);
    usbShape.lineTo(-0.4, 0.1);
    usbShape.quadraticCurveTo(-0.5, 0.1, -0.5, 0);
    usbShape.quadraticCurveTo(-0.5, -0.1, -0.4, -0.1);
    
    const usbExtrude = { depth: 0.6, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, steps: 1, bevelSegments: 2 };
    const usbCGeo = new THREE.ExtrudeGeometry(usbShape, usbExtrude);
    const usbCMesh = new THREE.Mesh(usbCGeo, chrome);
    usbGroup.add(usbCMesh);
    
    // Internal tongue
    const tongueGeo = new THREE.BoxGeometry(0.8, 0.05, 0.5);
    const tongue = new THREE.Mesh(tongueGeo, plastic);
    tongue.position.set(0, 0, 0.25);
    usbGroup.add(tongue);
    
    // Pins on tongue
    for(let i=0; i<12; i++) {
        const pinGeo = new THREE.BoxGeometry(0.04, 0.01, 0.4);
        const pin = new THREE.Mesh(pinGeo, gold);
        pin.position.set(-0.33 + i*0.06, 0.03, 0.25);
        usbGroup.add(pin);
    }
    
    usbGroup.rotation.x = Math.PI / 2;
    usbGroup.position.set(0, 2.7, 0.1);
    group.add(usbGroup);
    meshes.usbGroup = usbGroup;
    parts.push({
        name: 'USB-C Interface Assembly',
        description: 'Titanium-reinforced USB-C male connector with gold-plated pins for reliable high-speed data transfer and power delivery.',
        material: 'Chrome / Plastic / Gold',
        function: 'Provides power and encrypted data channel to host device.',
        assemblyOrder: 4,
        connections: ['pcbMain'],
        failureEffect: 'Token cannot communicate with host device.',
        cascadeFailures: ['batteryPack'],
        originalPosition: { x: 0, y: 2.7, z: 0.1 },
        explodedPosition: { x: 0, y: 4.5, z: 0.1 }
    });

    // 5. Fingerprint Scanner Assembly
    const scannerGroup = new THREE.Group();
    // Bezel
    const bezelGeo = new THREE.TorusGeometry(0.6, 0.08, 16, 64);
    const bezel = new THREE.Mesh(bezelGeo, aluminum);
    scannerGroup.add(bezel);
    
    // Sensor Surface
    const sensorGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 64);
    const sensor = new THREE.Mesh(sensorGeo, scannerGlass);
    sensor.rotation.x = Math.PI/2;
    scannerGroup.add(sensor);
    
    // Scanning Matrix (under glass)
    const matrixGeo = new THREE.PlaneGeometry(1.1, 1.1);
    const matrixMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5 });
    const matrix = new THREE.Mesh(matrixGeo, matrixMat);
    scannerGroup.add(matrix);
    meshes.scannerMatrix = matrix;
    
    // Scanning Line
    const scanLineGeo = new THREE.BoxGeometry(1.0, 0.02, 0.02);
    const scanLine = new THREE.Mesh(scanLineGeo, glowingBlue);
    scannerGroup.add(scanLine);
    meshes.scanLine = scanLine;

    scannerGroup.position.set(0, -1.0, 0.4);
    group.add(scannerGroup);
    meshes.scannerGroup = scannerGroup;
    parts.push({
        name: 'Biometric Capacitive Sensor',
        description: 'Ultra-sonic 3D fingerprint scanner with blood-flow detection (liveness verification).',
        material: 'Sapphire Glass / Aluminum',
        function: 'Authenticates user via high-res biometric matching.',
        assemblyOrder: 5,
        connections: ['casingTop', 'pcbMain'],
        failureEffect: 'Fails to authenticate user, locking device.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1.0, z: 0.4 },
        explodedPosition: { x: 0, y: -1.0, z: 1.5 }
    });

    // 6. Casing Top (ExtrudeGeometry with cutouts)
    const topShape = new THREE.Shape();
    topShape.moveTo(-width/2 + radius, -length/2);
    topShape.lineTo(width/2 - radius, -length/2);
    topShape.quadraticCurveTo(width/2, -length/2, width/2, -length/2 + radius);
    topShape.lineTo(width/2, length/2 - radius);
    topShape.quadraticCurveTo(width/2, length/2, width/2 - radius, length/2);
    topShape.lineTo(-width/2 + radius, length/2);
    topShape.quadraticCurveTo(-width/2, length/2, -width/2, length/2 - radius);
    topShape.lineTo(-width/2, -length/2 + radius);
    topShape.quadraticCurveTo(-width/2, -length/2, -width/2 + radius, -length/2);
    
    // Hole for fingerprint scanner
    const scannerHole = new THREE.Path();
    scannerHole.absarc(0, -1.0, 0.65, 0, Math.PI * 2, false);
    topShape.holes.push(scannerHole);
    
    // Hole for Crypto Chip Window
    const chipHole = new THREE.Path();
    chipHole.moveTo(-0.6, 0.4);
    chipHole.lineTo(0.6, 0.4);
    chipHole.lineTo(0.6, 1.6);
    chipHole.lineTo(-0.6, 1.6);
    chipHole.lineTo(-0.6, 0.4);
    topShape.holes.push(chipHole);

    // Hole for Holographic Projector
    const holoHole = new THREE.Path();
    holoHole.absarc(0, 2.0, 0.2, 0, Math.PI * 2, false);
    topShape.holes.push(holoHole);

    const topExtrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const casingTopGeo = new THREE.ExtrudeGeometry(topShape, topExtrudeSettings);
    const casingTop = new THREE.Mesh(casingTopGeo, aluminum);
    casingTop.position.set(0, 0, 0.2);
    group.add(casingTop);
    meshes.casingTop = casingTop;
    parts.push({
        name: 'Aircraft-Grade Aluminum Upper Chassis',
        description: 'Top cover machined from a single block of aerospace aluminum. Features precisely milled apertures for sensors and displays.',
        material: 'Aluminum 7075',
        function: 'Protects components and serves as a passive heatsink.',
        assemblyOrder: 15,
        connections: ['casingBase', 'fingerprintScanner', 'cryptoChipWindow'],
        failureEffect: 'Loss of structural integrity.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0.2 },
        explodedPosition: { x: 0, y: 0, z: 2.5 }
    });

    // 7. Crypto Chip Window (Glass)
    const windowGeo = new THREE.BoxGeometry(1.2, 1.2, 0.05);
    const chipWindow = new THREE.Mesh(windowGeo, tinted);
    chipWindow.position.set(0, 1.0, 0.35);
    group.add(chipWindow);
    meshes.chipWindow = chipWindow;
    parts.push({
        name: 'Armored Glass Viewport',
        description: 'Scratch-resistant synthetic sapphire window allowing visual inspection of the secure enclave core.',
        material: 'Tinted Sapphire Glass',
        function: 'Physical protection while maintaining visibility of cryptographic status indicators.',
        assemblyOrder: 14,
        connections: ['casingTop'],
        failureEffect: 'Vulnerability to piercing physical attacks.',
        cascadeFailures: ['cryptoChip'],
        originalPosition: { x: 0, y: 1.0, z: 0.35 },
        explodedPosition: { x: 0, y: 1.0, z: 2.8 }
    });

    // 8. Holographic Projector Emitter
    const projectorGroup = new THREE.Group();
    const lensGeo = new THREE.SphereGeometry(0.18, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.rotation.x = -Math.PI/2;
    projectorGroup.add(lens);
    
    const emitterRingGeo = new THREE.TorusGeometry(0.18, 0.02, 16, 32);
    const emitterRing = new THREE.Mesh(emitterRingGeo, chrome);
    projectorGroup.add(emitterRing);

    projectorGroup.position.set(0, 2.0, 0.35);
    group.add(projectorGroup);
    parts.push({
        name: 'Micro-Photonic Projector Lens',
        description: 'Focuses laser arrays to create volumetric displays in the air above the token.',
        material: 'Optical Glass / Chrome',
        function: 'Emits the holographic interface for transaction verification.',
        assemblyOrder: 13,
        connections: ['casingTop', 'pcbMain'],
        failureEffect: 'No visual feedback for the user.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2.0, z: 0.35 },
        explodedPosition: { x: 0, y: 2.0, z: 2.7 }
    });

    // 9. Hologram Display
    const hologramGroup = new THREE.Group();
    const holoPlaneGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32, 1, true, -Math.PI/4, Math.PI/2);
    const holoPlane = new THREE.Mesh(holoPlaneGeo, hologramMat);
    holoPlane.rotation.x = Math.PI / 2;
    holoPlane.rotation.z = Math.PI / 4;
    hologramGroup.add(holoPlane);
    
    // Add some floating data rings in the hologram
    const holoRingGeo = new THREE.TorusGeometry(0.6, 0.01, 8, 64);
    const holoRing1 = new THREE.Mesh(holoRingGeo, glowingBlue);
    holoRing1.rotation.x = Math.PI/2;
    holoRing1.position.z = 0.3;
    hologramGroup.add(holoRing1);
    meshes.holoRing1 = holoRing1;

    const holoRing2 = new THREE.Mesh(holoRingGeo, glowingBlue);
    holoRing2.rotation.x = Math.PI/2;
    holoRing2.position.z = 0.6;
    holoRing2.scale.set(0.8, 0.8, 0.8);
    hologramGroup.add(holoRing2);
    meshes.holoRing2 = holoRing2;

    hologramGroup.position.set(0, 2.0, 0.8);
    group.add(hologramGroup);
    meshes.hologramGroup = hologramGroup;
    parts.push({
        name: 'Volumetric UI Matrix',
        description: 'Photonic interference pattern generating a 3D interface for out-of-band transaction verification.',
        material: 'Photons',
        function: 'Displays transaction details to prevent man-in-the-middle attacks.',
        assemblyOrder: 16,
        connections: ['projectorLens'],
        failureEffect: 'Blind signing risk.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2.0, z: 0.8 },
        explodedPosition: { x: 0, y: 2.0, z: 3.5 }
    });

    // 10. Tamper Mesh (Wireframe inside casing)
    const tamperGeo = new THREE.PlaneGeometry(2.2, 4.8, 20, 40);
    const tamperMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true, transparent: true, opacity: 0.3 });
    const tamperMesh = new THREE.Mesh(tamperGeo, tamperMat);
    tamperMesh.position.set(0, 0, 0.18);
    group.add(tamperMesh);
    parts.push({
        name: 'Active Tamper-Detect Grid',
        description: 'Fine lattice of conductive wires. If broken, pierced, or shorted, triggers instant zeroization of the secure enclave.',
        material: 'Copper Wire',
        function: 'Detects physical intrusion attempts.',
        assemblyOrder: 6,
        connections: ['pcbMain'],
        failureEffect: 'Device wipes all keys instantly.',
        cascadeFailures: ['cryptoChip'],
        originalPosition: { x: 0, y: 0, z: 0.18 },
        explodedPosition: { x: 0, y: 0, z: -0.5 }
    });

    // 11. Battery Pack
    const batteryGeo = new THREE.BoxGeometry(1.8, 1.2, 0.1);
    const battery = new THREE.Mesh(batteryGeo, darkSteel);
    battery.position.set(0, -1.8, 0.15);
    group.add(battery);
    parts.push({
        name: 'Solid-State Micro Battery',
        description: 'High-density solid-state battery for powering the tamper circuit when disconnected from USB.',
        material: 'Lithium / Dark Steel',
        function: 'Maintains active tamper response during transit.',
        assemblyOrder: 7,
        connections: ['pcbMain'],
        failureEffect: 'Tamper mesh goes offline, rendering token vulnerable to cold-boot attacks.',
        cascadeFailures: ['tamperMesh'],
        originalPosition: { x: 0, y: -1.8, z: 0.15 },
        explodedPosition: { x: 0, y: -2.5, z: 0.5 }
    });

    // 12. Lanyard Loop
    const loopGeo = new THREE.TorusGeometry(0.3, 0.08, 16, 32);
    const loop = new THREE.Mesh(loopGeo, steel);
    loop.position.set(0, -2.7, 0.1);
    group.add(loop);
    parts.push({
        name: 'Titanium Attachment Loop',
        description: 'Heavy-duty loop for attaching the token to a secure lanyard or biometric tether.',
        material: 'Titanium / Steel',
        function: 'Physical retention.',
        assemblyOrder: 8,
        connections: ['casingBase', 'casingTop'],
        failureEffect: 'Token is easily dropped or lost.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: -2.7, z: 0.1 },
        explodedPosition: { x: 0, y: -3.5, z: 0.1 }
    });

    // 13. Security Screws (4 corners)
    const screwPositions = [
        [-1.0, -2.2, 0.4],
        [1.0, -2.2, 0.4],
        [-1.0, 2.2, 0.4],
        [1.0, 2.2, 0.4]
    ];
    screwPositions.forEach((pos, index) => {
        const screwGroup = new THREE.Group();
        const headGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
        const head = new THREE.Mesh(headGeo, chrome);
        head.rotation.x = Math.PI/2;
        screwGroup.add(head);
        
        const indentGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 5);
        const indent = new THREE.Mesh(indentGeo, rubber);
        indent.rotation.x = Math.PI/2;
        indent.position.z = 0.01;
        screwGroup.add(indent);

        screwGroup.position.set(...pos);
        group.add(screwGroup);
        parts.push({
            name: `Torx Security Screw ${index+1}`,
            description: 'Custom-headed tamper-evident security screw.',
            material: 'Steel',
            function: 'Clamps upper and lower chassis together.',
            assemblyOrder: 17 + index,
            connections: ['casingTop', 'casingBase'],
            failureEffect: 'Chassis becomes loose.',
            cascadeFailures: [],
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            explodedPosition: { x: pos[0] * 1.5, y: pos[1] * 1.5, z: pos[2] + 1.0 }
        });
    });

    // 14. Status LEDs (Side)
    const ledPositions = [
        [1.25, 0.5, 0.1],
        [1.25, 0.2, 0.1],
        [1.25, -0.1, 0.1]
    ];
    meshes.leds = [];
    ledPositions.forEach((pos, index) => {
        const ledGeo = new THREE.BoxGeometry(0.05, 0.15, 0.05);
        const mats = [glowingGreen, glowingRed, glowingBlue];
        const led = new THREE.Mesh(ledGeo, mats[index]);
        led.position.set(...pos);
        group.add(led);
        meshes.leds.push(led);
        parts.push({
            name: `Diagnostic LED ${index+1}`,
            description: 'Micro-LED providing at-a-glance status of secure enclave, connection, and battery.',
            material: 'Epoxy / LED',
            function: 'Status indication.',
            assemblyOrder: 9 + index,
            connections: ['pcbMain'],
            failureEffect: 'Loss of quick diagnostic info.',
            cascadeFailures: [],
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            explodedPosition: { x: pos[0] + 0.5, y: pos[1], z: pos[2] }
        });
    });

    // 15. Capacitors / Microchips on PCB
    for(let i=0; i<15; i++) {
        const smdGeo = new THREE.BoxGeometry(0.1 + Math.random()*0.1, 0.1 + Math.random()*0.2, 0.05);
        const smd = new THREE.Mesh(smdGeo, ceramic);
        const px = (Math.random() - 0.5) * 1.8;
        const py = (Math.random() - 0.5) * 3.5;
        if(Math.abs(py - 1.0) < 0.8 && Math.abs(px) < 0.8) continue; 
        if(Math.abs(py + 1.0) < 0.8 && Math.abs(px) < 0.8) continue;
        smd.position.set(px, py, 0.15);
        group.add(smd);
    }
    parts.push({
        name: 'SMD Component Array',
        description: 'High-precision resistors, capacitors, and power management ICs.',
        material: 'Ceramic / Tantalum',
        function: 'Power regulation and signal conditioning.',
        assemblyOrder: 12,
        connections: ['pcbMain'],
        failureEffect: 'Power fluctuations causing secure enclave resets.',
        cascadeFailures: ['cryptoChip'],
        originalPosition: { x: -0.5, y: -0.5, z: 0.15 },
        explodedPosition: { x: -1.0, y: -0.5, z: 0.5 }
    });

    const description = "The Cyber Biometric Hardware Token is an ultra-secure, military-grade cryptographic device. It features quantum-resistant ECC processors enclosed in an active tamper-detect mesh. Biometric authentication is handled by a 3D ultrasonic blood-flow fingerprint scanner, while out-of-band transaction verification is projected via a volumetric photonic hologram. The chassis is machined from aerospace aluminum and shielded with carbon fiber composite.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Active Tamper-Detect Grid?",
            options: [
                "To provide structural support to the PCB.",
                "To detect physical intrusion and trigger zeroization.",
                "To enhance WiFi signal strength.",
                "To cool down the cryptographic processor."
            ],
            correctAnswer: 1,
            explanation: "The Active Tamper-Detect Grid is a fine lattice of conductive wires. If pierced or broken, it instantly wipes (zeroizes) the cryptographic keys to prevent extraction."
        },
        {
            question: "Why does the token project a Volumetric UI Matrix (Hologram)?",
            options: [
                "To drain excess battery power.",
                "To look futuristic and aesthetically pleasing.",
                "To provide out-of-band transaction verification, defeating man-in-the-middle attacks.",
                "To illuminate dark environments."
            ],
            correctAnswer: 2,
            explanation: "The hologram displays exactly what the user is signing. Even if the host PC is compromised by malware, the token's isolated hologram shows the true transaction details."
        },
        {
            question: "What prevents cold-boot attacks when the token is unplugged?",
            options: [
                "The Solid-State Micro Battery maintains the tamper circuit.",
                "The USB-C pins retract into the chassis.",
                "The Torx Security Screws lock the memory.",
                "The casing is made of Carbon Fiber."
            ],
            correctAnswer: 0,
            explanation: "The internal battery keeps the tamper-detection circuits alive even when the token is not connected to USB power, preventing attackers from freezing the RAM to extract keys."
        },
        {
            question: "What specific metric does the Biometric Sensor check to ensure liveness?",
            options: [
                "Skin temperature.",
                "Blood-flow detection via ultra-sonic waves.",
                "Fingerprint oil residue.",
                "Electro-dermal resistance."
            ],
            correctAnswer: 1,
            explanation: "The sensor uses ultra-sonic 3D scanning coupled with blood-flow detection to ensure the fingerprint belongs to a living person, thwarting fake silicone molds."
        },
        {
            question: "What is housed beneath the Armored Glass Viewport?",
            options: [
                "The Volumetric Projector.",
                "The Quantum-Resistant Secure Enclave.",
                "The Solid-State Battery.",
                "The Fingerprint Scanner."
            ],
            correctAnswer: 1,
            explanation: "The viewport allows visual inspection of the Secure Enclave's glowing silicon core, proving the chip's operational status."
        }
    ];

    let timeAccumulator = 0;

    function animate(time, speed, exploded) {
        timeAccumulator += speed * 0.01;

        if (meshes.coreMesh) {
            meshes.coreMesh.material.emissiveIntensity = 1.0 + Math.sin(timeAccumulator * 5) * 0.5;
        }

        if (meshes.scanLine) {
            meshes.scanLine.position.y = Math.sin(timeAccumulator * 3) * 0.4;
            meshes.scanLine.material.emissiveIntensity = 1.5 + Math.sin(timeAccumulator * 10) * 0.5;
        }

        if (meshes.hologramGroup && !exploded) {
            meshes.hologramGroup.visible = Math.random() > 0.02;
            if (meshes.holoRing1 && meshes.holoRing2) {
                meshes.holoRing1.rotation.z += 0.02 * speed;
                meshes.holoRing2.rotation.z -= 0.03 * speed;
                meshes.holoRing1.scale.setScalar(1.0 + Math.sin(timeAccumulator * 4) * 0.05);
                meshes.holoRing2.scale.setScalar(0.8 + Math.cos(timeAccumulator * 5) * 0.05);
            }
        } else if (meshes.hologramGroup && exploded) {
            meshes.hologramGroup.visible = false;
        }

        if (meshes.leds && meshes.leds.length >= 3) {
            meshes.leds[0].material.emissiveIntensity = Math.sin(timeAccumulator * 2) > 0 ? 2 : 0.2;
            meshes.leds[1].material.emissiveIntensity = Math.random() > 0.98 ? 2 : 0.0;
            meshes.leds[2].material.emissiveIntensity = 0.5 + Math.sin(timeAccumulator * 15) * 0.5;
        }

        if (exploded && meshes.usbGroup) {
            meshes.usbGroup.rotation.z = Math.sin(timeAccumulator) * 0.2;
        } else if (meshes.usbGroup) {
            meshes.usbGroup.rotation.z = 0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBiometricHardwareToken() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
