import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x0088ff, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff0033, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ff44, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const scannerGlass = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 0.5, transparent: true, opacity: 0.8, roughness: 0.1 });
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5, transparent: true, opacity: 0.9 });

    // 1. Faraday Outer Shield (Complex Extrusion)
    const roomShape = new THREE.Shape();
    const roomRadius = 25;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * roomRadius;
        const y = Math.sin(angle) * roomRadius;
        if (i === 0) roomShape.moveTo(x, y);
        else roomShape.lineTo(x, y);
    }
    roomShape.lineTo(Math.cos(0) * roomRadius, Math.sin(0) * roomRadius);

    const holeShape = new THREE.Path();
    const innerRadius = 22;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * innerRadius;
        const y = Math.sin(angle) * innerRadius;
        if (i === 0) holeShape.moveTo(x, y);
        else holeShape.lineTo(x, y);
    }
    holeShape.lineTo(Math.cos(0) * innerRadius, Math.sin(0) * innerRadius);
    roomShape.holes.push(holeShape);

    const extrudeSettings = { depth: 30, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 1, bevelThickness: 1 };
    const roomGeo = new THREE.ExtrudeGeometry(roomShape, extrudeSettings);
    const roomMesh = new THREE.Mesh(roomGeo, darkSteel);
    roomMesh.rotation.x = -Math.PI / 2;
    roomMesh.position.y = -15;
    group.add(roomMesh);
    
    parts.push({
        name: "Faraday Outer Shield",
        description: "Massive octagonal structure lined with electromagnetic shielding mesh to block all incoming and outgoing wireless signals.",
        material: "darkSteel",
        function: "Provides absolute isolation from electromagnetic interference and remote access attempts.",
        assemblyOrder: 1,
        connections: ["Inner Vault Lining", "Vault Primary Door"],
        failureEffect: "Electromagnetic leakage, potentially exposing the air-gapped system to side-channel attacks.",
        cascadeFailures: ["Signal Bleed", "Data Compromise"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    // 2. Faraday Copper Lattice
    const latticeGroup = new THREE.Group();
    const latticeCount = 48;
    for (let i = 0; i < latticeCount; i++) {
        const angle = (i / latticeCount) * Math.PI * 2;
        const r = 22.5;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        
        // Vertical rods
        const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 30, 8);
        const rodMesh = new THREE.Mesh(rodGeo, copper);
        rodMesh.position.set(x, 0, z);
        latticeGroup.add(rodMesh);

        // Horizontal rings
        if (i % 6 === 0) {
            const ringGeo = new THREE.TorusGeometry(r, 0.2, 8, 48);
            const ringMesh = new THREE.Mesh(ringGeo, copper);
            ringMesh.position.y = -15 + (i / latticeCount) * 30;
            ringMesh.rotation.x = Math.PI / 2;
            latticeGroup.add(ringMesh);
        }
    }
    group.add(latticeGroup);
    parts.push({
        name: "Faraday Copper Lattice",
        description: "Dense lattice of highly conductive copper rods and rings surrounding the inner sanctum.",
        material: "copper",
        function: "Dissipates any external RF signals, completing the air gap.",
        assemblyOrder: 2,
        connections: ["Faraday Outer Shield", "Data Isolation Transformers"],
        failureEffect: "Compromised radio isolation.",
        cascadeFailures: ["RF Leakage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 3. Server Rack Frame
    const rackGroup = new THREE.Group();
    const rackW = 6;
    const rackH = 18;
    const rackD = 6;
    const rackThickness = 0.3;
    
    const pillarGeo = new THREE.CylinderGeometry(rackThickness, rackThickness, rackH, 16);
    const pillars = [
        [-rackW/2, -rackD/2], [rackW/2, -rackD/2],
        [-rackW/2, rackD/2], [rackW/2, rackD/2]
    ];
    pillars.forEach(([px, pz]) => {
        const pMesh = new THREE.Mesh(pillarGeo, aluminum);
        pMesh.position.set(px, 0, pz);
        rackGroup.add(pMesh);
    });

    const hBeamGeoX = new THREE.CylinderGeometry(rackThickness*0.8, rackThickness*0.8, rackW, 16);
    const hBeamGeoZ = new THREE.CylinderGeometry(rackThickness*0.8, rackThickness*0.8, rackD, 16);
    for(let i=0; i<=rackH; i+=3) {
        const yPos = -rackH/2 + i;
        let xb1 = new THREE.Mesh(hBeamGeoX, aluminum); xb1.rotation.z = Math.PI/2; xb1.position.set(0, yPos, -rackD/2); rackGroup.add(xb1);
        let xb2 = new THREE.Mesh(hBeamGeoX, aluminum); xb2.rotation.z = Math.PI/2; xb2.position.set(0, yPos, rackD/2); rackGroup.add(xb2);
        let zb1 = new THREE.Mesh(hBeamGeoZ, aluminum); zb1.rotation.x = Math.PI/2; zb1.position.set(-rackW/2, yPos, 0); rackGroup.add(zb1);
        let zb2 = new THREE.Mesh(hBeamGeoZ, aluminum); zb2.rotation.x = Math.PI/2; zb2.position.set(rackW/2, yPos, 0); rackGroup.add(zb2);
    }
    group.add(rackGroup);
    parts.push({
        name: "Server Rack Frame",
        description: "Reinforced aluminum skeleton designed to hold massive computing blades.",
        material: "aluminum",
        function: "Provides structural support and vibration damping for the isolated servers.",
        assemblyOrder: 3,
        connections: ["Compute Blades", "Storage Array"],
        failureEffect: "Vibration-induced hardware errors in sensitive storage media.",
        cascadeFailures: ["Hard Drive Crash"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 }
    });

    function createServerChassis(width, height, depth, mat) {
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, -depth/2);
        shape.lineTo(width/2, -depth/2);
        for(let i=0; i<20; i++) {
            const step = width / 20;
            const x = width/2 - i*step;
            shape.lineTo(x, depth/2);
            shape.lineTo(x - step*0.2, depth/2 + 0.5);
            shape.lineTo(x - step*0.8, depth/2 + 0.5);
            shape.lineTo(x - step, depth/2);
        }
        shape.lineTo(-width/2, depth/2);
        shape.lineTo(-width/2, -depth/2);
        const ex = { depth: height, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 };
        const geo = new THREE.ExtrudeGeometry(shape, ex);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }

    // 4. Server Chassis Top (Compute)
    const computeMesh = createServerChassis(rackW - 1, 4, rackD - 1, darkSteel);
    computeMesh.position.set(0, 4, 0);
    rackGroup.add(computeMesh);
    parts.push({
        name: "Quantum Compute Core",
        description: "High-density computational unit featuring massive extruded heat sinks.",
        material: "darkSteel",
        function: "Processes heavily encrypted offline data using proprietary quantum-resistant algorithms.",
        assemblyOrder: 4,
        connections: ["Server Rack Frame", "Storage Array"],
        failureEffect: "Computation halt, preventing decryption of secured data.",
        cascadeFailures: ["Thermal Runaway", "Data Lockout"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 20, z: -10 }
    });

    // 5. Server Chassis Mid (Storage)
    const storageMesh = createServerChassis(rackW - 1, 6, rackD - 1, steel);
    storageMesh.position.set(0, -1, 0);
    rackGroup.add(storageMesh);
    
    meshes.storageLights = [];
    for(let i=0; i<8; i++) {
        for(let j=0; j<4; j++) {
            const led = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8), neonBlue);
            led.rotation.x = Math.PI/2;
            led.position.set(-rackW/2 + 0.8 + i*0.6, -2 + j*0.5, rackD/2 - 0.2);
            rackGroup.add(led);
            meshes.storageLights.push(led);
        }
    }

    parts.push({
        name: "Solid State Storage Array",
        description: "Cold-storage NVMe arrays holding petabytes of highly sensitive information.",
        material: "steel",
        function: "Persistently stores critical air-gapped data.",
        assemblyOrder: 5,
        connections: ["Quantum Compute Core", "Power Delivery Module"],
        failureEffect: "Irrecoverable data loss.",
        cascadeFailures: ["Total System Failure"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -30 }
    });

    // 6. Server Chassis Bottom (Power)
    const powerMesh = createServerChassis(rackW - 1, 3, rackD - 1, plastic);
    powerMesh.position.set(0, -6, 0);
    rackGroup.add(powerMesh);
    parts.push({
        name: "Isolated Power Plant",
        description: "Internal battery and micro-reactor power supply, completely severed from external electrical grids.",
        material: "plastic",
        function: "Provides clean, unmonitorable power to the vault systems.",
        assemblyOrder: 6,
        connections: ["Server Rack Frame"],
        failureEffect: "System starvation and emergency shutdown.",
        cascadeFailures: ["Core Shutdown"],
        originalPosition: { x: 0, y: -6, z: 0 },
        explodedPosition: { x: 0, y: -20, z: -10 }
    });

    // 7. Cooling Fans Array (Animated)
    const fanGroup = new THREE.Group();
    meshes.fans = [];
    for(let f=0; f<4; f++) {
        const singleFanGroup = new THREE.Group();
        const housing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 16, 32), chrome);
        singleFanGroup.add(housing);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16), darkSteel);
        hub.rotation.x = Math.PI/2;
        singleFanGroup.add(hub);
        for(let b=0; b<7; b++) {
            const bladeShape = new THREE.Shape();
            bladeShape.moveTo(0, 0);
            bladeShape.quadraticCurveTo(0.5, 0.5, 0.2, 1.1);
            bladeShape.quadraticCurveTo(-0.2, 0.8, 0, 0);
            const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(bladeShape, {depth:0.05, bevelEnabled:false}), plastic);
            blade.position.z = -0.025;
            const pivot = new THREE.Group();
            pivot.rotation.z = (b / 7) * Math.PI * 2;
            pivot.add(blade);
            singleFanGroup.add(pivot);
        }
        singleFanGroup.position.set((f%2 === 0 ? -1.5 : 1.5), 6 - Math.floor(f/2)*3, rackD/2 + 0.5);
        fanGroup.add(singleFanGroup);
        meshes.fans.push(singleFanGroup);
    }
    rackGroup.add(fanGroup);
    parts.push({
        name: "Redundant Cooling Fans",
        description: "High-RPM titanium-infused fan blades in chrome housings.",
        material: "chrome",
        function: "Extracts immense heat generated by the quantum compute core.",
        assemblyOrder: 7,
        connections: ["Server Rack Frame"],
        failureEffect: "Overheating leading to core meltdown.",
        cascadeFailures: ["Thermal Runaway", "Hardware Fire"],
        originalPosition: { x: 0, y: 4, z: 3.5 },
        explodedPosition: { x: 0, y: 4, z: 15 }
    });

    // 8. Severed Network Cables
    const cablesGroup = new THREE.Group();
    for(let c=0; c<12; c++) {
        const start = new THREE.Vector3(-rackW/2 - 1, -2 + c*0.5, -rackD/2);
        const ctrl1 = new THREE.Vector3(-rackW/2 - 3 - Math.random()*2, -2 + c*0.5 - 2, -rackD/2 + Math.random()*4);
        const end = new THREE.Vector3(-rackW/2 - 4 - Math.random()*3, -10, -rackD/2 + Math.random()*4);
        const curve = new THREE.CatmullRomCurve3([start, ctrl1, end]);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.15, 8, false);
        const cableMesh = new THREE.Mesh(tubeGeo, rubber);
        cablesGroup.add(cableMesh);
        
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), neonRed);
        spark.position.copy(end);
        cablesGroup.add(spark);
    }
    group.add(cablesGroup);
    parts.push({
        name: "Severed Network Cables",
        description: "Physically cut, heavy-duty ethernet and fiber optic trunks hanging loosely.",
        material: "rubber",
        function: "Visual and physical proof of the air gap; guarantees no hardwired network exists.",
        assemblyOrder: 8,
        connections: ["Disconnected Fiber Optic Ports"],
        failureEffect: "None; the failure of connection is intentional and required.",
        cascadeFailures: [],
        originalPosition: { x: -5, y: -5, z: -3 },
        explodedPosition: { x: -15, y: -10, z: -10 }
    });

    // 9. Disconnected Fiber Optic Ports
    const portsGroup = new THREE.Group();
    for(let p=0; p<12; p++) {
        const port = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16), copper);
        port.rotation.z = Math.PI/2;
        port.position.set(-rackW/2 - 0.2, -2 + p*0.5, -rackD/2);
        
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16), glass);
        ring.rotation.y = Math.PI/2;
        ring.position.set(-rackW/2 - 0.5, -2 + p*0.5, -rackD/2);
        
        portsGroup.add(port);
        portsGroup.add(ring);
    }
    group.add(portsGroup);
    parts.push({
        name: "Disconnected Fiber Optic Ports",
        description: "Exposed, unplugged data ports with glass optical interfaces.",
        material: "copper",
        function: "Remains isolated to prevent light-based data transmission.",
        assemblyOrder: 9,
        connections: ["Severed Network Cables", "Storage Array"],
        failureEffect: "Accidental reconnection could bridge the air gap.",
        cascadeFailures: ["Network Breach", "Data Exfiltration"],
        originalPosition: { x: -3.2, y: -2, z: -3 },
        explodedPosition: { x: -10, y: -2, z: -3 }
    });

    // 10. Vault Primary Door (Lathe Geometry)
    const doorGroup = new THREE.Group();
    const doorPoints = [];
    doorPoints.push(new THREE.Vector2(0, 0));
    doorPoints.push(new THREE.Vector2(8, 0));
    doorPoints.push(new THREE.Vector2(8, 1));
    doorPoints.push(new THREE.Vector2(7.5, 1.5));
    doorPoints.push(new THREE.Vector2(7.5, 2.5));
    doorPoints.push(new THREE.Vector2(8.5, 3));
    doorPoints.push(new THREE.Vector2(8.5, 4));
    doorPoints.push(new THREE.Vector2(0, 4));
    
    const doorGeo = new THREE.LatheGeometry(doorPoints, 64);
    const doorMesh = new THREE.Mesh(doorGeo, steel);
    doorMesh.rotation.x = Math.PI / 2;
    doorGroup.add(doorMesh);
    
    const wheelPoints = [];
    wheelPoints.push(new THREE.Vector2(0, 0));
    wheelPoints.push(new THREE.Vector2(2, 0));
    wheelPoints.push(new THREE.Vector2(2, 0.5));
    wheelPoints.push(new THREE.Vector2(1.5, 1));
    wheelPoints.push(new THREE.Vector2(0, 1));
    const wheelGeo = new THREE.LatheGeometry(wheelPoints, 32);
    const wheelMesh = new THREE.Mesh(wheelGeo, chrome);
    wheelMesh.rotation.x = Math.PI / 2;
    wheelMesh.position.z = 4;
    doorGroup.add(wheelMesh);
    meshes.doorWheel = wheelMesh;
    
    for(let h=0; h<6; h++) {
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16), chrome);
        const angle = (h/6) * Math.PI*2;
        handle.rotation.x = Math.PI/2;
        handle.position.set(Math.cos(angle)*2.5, Math.sin(angle)*2.5, 4.5);
        handle.rotation.z = angle;
        doorGroup.add(handle);
    }
    
    doorGroup.position.set(0, 0, 22);
    group.add(doorGroup);
    meshes.doorGroup = doorGroup;
    parts.push({
        name: "Vault Primary Door",
        description: "Extremely heavy lathed steel vault door, immune to thermal lancing and explosive breaching.",
        material: "steel",
        function: "Provides physical security to the inner sanctum.",
        assemblyOrder: 10,
        connections: ["Massive Locking Bolts", "Door Hydraulic Actuators"],
        failureEffect: "Physical breach of the vault.",
        cascadeFailures: ["Hardware Theft", "Destruction"],
        originalPosition: { x: 0, y: 0, z: 22 },
        explodedPosition: { x: 0, y: 0, z: 45 }
    });

    // 11. Massive Locking Bolts (Animated)
    const boltsGroup = new THREE.Group();
    meshes.bolts = [];
    for(let b=0; b<12; b++) {
        const boltGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        const angle = (b/12) * Math.PI*2;
        bolt.rotation.x = Math.PI/2;
        bolt.rotation.z = angle;
        bolt.position.set(Math.cos(angle)*8.5, Math.sin(angle)*8.5, 2);
        
        bolt.userData.dirX = Math.cos(angle);
        bolt.userData.dirY = Math.sin(angle);
        bolt.userData.baseX = Math.cos(angle)*8.5;
        bolt.userData.baseY = Math.sin(angle)*8.5;

        boltsGroup.add(bolt);
        meshes.bolts.push(bolt);
    }
    doorGroup.add(boltsGroup);
    parts.push({
        name: "Massive Locking Bolts",
        description: "Thick chrome cylinders that engage deep into the Faraday Outer Shield.",
        material: "chrome",
        function: "Locks the primary door firmly in place when closed.",
        assemblyOrder: 11,
        connections: ["Vault Primary Door"],
        failureEffect: "Door fails to secure properly.",
        cascadeFailures: ["Physical Breach"],
        originalPosition: { x: 0, y: 0, z: 24 },
        explodedPosition: { x: 0, y: 0, z: 50 }
    });

    // 12. Door Hydraulic Actuators
    const actuatorGroup = new THREE.Group();
    const hingeCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 12, 32), darkSteel);
    hingeCylinder.position.set(9.5, 0, 22);
    actuatorGroup.add(hingeCylinder);
    
    const pistonBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 6, 32), steel);
    pistonBase.rotation.x = Math.PI/2;
    pistonBase.position.set(9.5, 3, 20);
    actuatorGroup.add(pistonBase);
    
    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 32), chrome);
    pistonRod.rotation.x = Math.PI/2;
    pistonRod.position.set(9.5, 3, 24);
    actuatorGroup.add(pistonRod);
    meshes.pistonRod = pistonRod;
    
    group.add(actuatorGroup);
    parts.push({
        name: "Door Hydraulic Actuator",
        description: "Industrial-grade hydraulic hinge and piston assembly capable of moving the multi-ton door.",
        material: "darkSteel",
        function: "Provides the immense mechanical force required to operate the vault door.",
        assemblyOrder: 12,
        connections: ["Vault Primary Door", "Faraday Outer Shield"],
        failureEffect: "Door stuck in current position.",
        cascadeFailures: ["Maintenance Lockout"],
        originalPosition: { x: 9.5, y: 0, z: 22 },
        explodedPosition: { x: 20, y: 0, z: 22 }
    });

    // 13. Biometric Retinal Scanner
    const scannerGroup = new THREE.Group();
    const panelShape = new THREE.Shape();
    panelShape.moveTo(-1.5, -2);
    panelShape.lineTo(1.5, -2);
    panelShape.lineTo(2, 0);
    panelShape.lineTo(1.5, 2);
    panelShape.lineTo(-1.5, 2);
    panelShape.lineTo(-2, 0);
    const panelGeo = new THREE.ExtrudeGeometry(panelShape, { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 });
    const panelMesh = new THREE.Mesh(panelGeo, plastic);
    scannerGroup.add(panelMesh);
    
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.2, 32), scannerGlass);
    lens.rotation.x = Math.PI/2;
    lens.position.set(0, 0, 0.5);
    scannerGroup.add(lens);
    
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 16), laserMat);
    laser.rotation.z = Math.PI/2;
    laser.position.set(0, 0, 1.1);
    scannerGroup.add(laser);
    meshes.laser = laser;

    scannerGroup.position.set(6, 0, 26);
    scannerGroup.rotation.y = -Math.PI/6;
    group.add(scannerGroup);
    parts.push({
        name: "Biometric Retinal Scanner",
        description: "High-precision retinal topology mapping device with continuous laser sweep.",
        material: "plastic",
        function: "Authenticates personnel before allowing mechanical engagement of the vault door.",
        assemblyOrder: 13,
        connections: ["Vault Primary Door"],
        failureEffect: "Authentication failure, permanently sealing the vault.",
        cascadeFailures: ["Complete Access Denial"],
        originalPosition: { x: 6, y: 0, z: 26 },
        explodedPosition: { x: 12, y: 0, z: 35 }
    });

    // 14. Keypad / Access Terminal
    const terminalGroup = new THREE.Group();
    const termBase = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 0.5), aluminum);
    terminalGroup.add(termBase);
    
    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1, 0.6), neonGreen);
    screen.position.set(0, 0.8, 0);
    terminalGroup.add(screen);
    
    for(let i=0; i<3; i++) {
        for(let j=0; j<4; j++) {
            const btn = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.6), plastic);
            btn.position.set(-0.6 + i*0.6, 0 - j*0.5, 0);
            terminalGroup.add(btn);
        }
    }
    terminalGroup.position.set(-6, 0, 25);
    terminalGroup.rotation.y = Math.PI/6;
    group.add(terminalGroup);
    parts.push({
        name: "Access Terminal",
        description: "Multi-factor numerical keypad and encrypted display screen.",
        material: "aluminum",
        function: "Secondary authentication factor requiring rotating cryptographic PINs.",
        assemblyOrder: 14,
        connections: ["Vault Primary Door"],
        failureEffect: "Inability to input override codes.",
        cascadeFailures: ["Lockout"],
        originalPosition: { x: -6, y: 0, z: 25 },
        explodedPosition: { x: -12, y: 0, z: 35 }
    });

    // 15. Status Indicator Beacons (Animated)
    const beaconsGroup = new THREE.Group();
    meshes.beacons = [];
    for(let i=0; i<4; i++) {
        const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1, 16), darkSteel);
        const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), neonRed);
        beaconLight.position.y = 0.5;
        
        const bGroup = new THREE.Group();
        bGroup.add(beaconBase);
        bGroup.add(beaconLight);
        
        const angle = (i/4) * Math.PI*2 + Math.PI/4;
        bGroup.position.set(Math.cos(angle)*24, 15, Math.sin(angle)*24);
        
        beaconsGroup.add(bGroup);
        meshes.beacons.push(beaconLight);
    }
    group.add(beaconsGroup);
    parts.push({
        name: "Status Indicator Beacons",
        description: "Pulsing alert beacons signaling vault lockdown status.",
        material: "glass",
        function: "Visual indicator of the air gap's integrity and security state.",
        assemblyOrder: 15,
        connections: ["Faraday Outer Shield"],
        failureEffect: "Loss of visual status verification.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });
    
    // 16. Data Isolation Transformers
    const transformerGroup = new THREE.Group();
    for(let i=0; i<2; i++) {
        const pts = [];
        pts.push(new THREE.Vector2(0, 0));
        pts.push(new THREE.Vector2(1.5, 0));
        pts.push(new THREE.Vector2(1.5, 0.5));
        pts.push(new THREE.Vector2(1.2, 1));
        pts.push(new THREE.Vector2(1.2, 3));
        pts.push(new THREE.Vector2(1.5, 3.5));
        pts.push(new THREE.Vector2(1.5, 4));
        pts.push(new THREE.Vector2(0, 4));
        const tGeo = new THREE.LatheGeometry(pts, 32);
        const tMesh = new THREE.Mesh(tGeo, copper);
        
        for(let f=0; f<8; f++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.1), darkSteel);
            fin.position.y = 2;
            fin.rotation.y = (f/8)*Math.PI;
            tMesh.add(fin);
        }
        
        tMesh.position.set(i === 0 ? -12 : 12, -15, -12);
        transformerGroup.add(tMesh);
    }
    group.add(transformerGroup);
    parts.push({
        name: "Data Isolation Transformers",
        description: "Massive copper-wound cores designed to physically decouple electrical signals.",
        material: "copper",
        function: "Prevents electrical surges or data transmission via the power lines.",
        assemblyOrder: 16,
        connections: ["Isolated Power Plant", "Faraday Copper Lattice"],
        failureEffect: "Electrical arcing bridging the air gap.",
        cascadeFailures: ["Hardware Destruction", "Security Breach"],
        originalPosition: { x: 0, y: -15, z: -12 },
        explodedPosition: { x: 0, y: -30, z: -25 }
    });

    return {
        group,
        parts,
        description: "Cyber Air Gapped Vault: A highly secure, mathematically isolated computing environment. Protected by an octagonal Faraday cage, massive hydraulic steel doors, severed physical network cables, and biometric scanning. Total network disconnection is visually and physically enforced.",
        quizQuestions: [
            {
                question: "What is the primary function of the Faraday Copper Lattice?",
                options: [
                    "To look shiny and high-tech",
                    "To generate electricity",
                    "To dissipate external RF signals and complete the air gap",
                    "To cool the servers"
                ],
                correctAnswer: 2,
                explanation: "The Faraday Copper Lattice surrounds the vault and blocks all incoming and outgoing electromagnetic signals, ensuring wireless isolation."
            },
            {
                question: "Why are the Network Cables explicitly severed?",
                options: [
                    "Poor cable management",
                    "To provide visual and physical proof of zero network connectivity",
                    "To save on copper costs",
                    "They are waiting for repairs"
                ],
                correctAnswer: 1,
                explanation: "In a true air-gapped system, physical separation of networking equipment is the only foolproof way to guarantee isolation."
            },
            {
                question: "What secures the Vault Primary Door to the Faraday Outer Shield?",
                options: [
                    "Velcro straps",
                    "Massive Locking Bolts that engage radially",
                    "A simple deadbolt",
                    "Electromagnets only"
                ],
                correctAnswer: 1,
                explanation: "Massive locking bolts made of chrome extend radially from the door deep into the outer shield to secure it against physical breaching."
            },
            {
                question: "What role does the Biometric Retinal Scanner play?",
                options: [
                    "It scans for viruses",
                    "It continuously sweeps a laser to authenticate personnel",
                    "It measures room temperature",
                    "It reads barcodes on server racks"
                ],
                correctAnswer: 1,
                explanation: "The scanner maps retinal topology to authenticate authorized personnel before allowing mechanical engagement of the vault door."
            },
            {
                question: "How is heat extracted from the Quantum Compute Core?",
                options: [
                    "By blowing on it",
                    "Through liquid nitrogen pipes",
                    "Via Redundant Cooling Fans in chrome housings",
                    "It does not generate heat"
                ],
                correctAnswer: 2,
                explanation: "Redundant high-RPM titanium-infused cooling fans extract the immense heat generated by the isolated computing systems."
            }
        ],
        animate: function(time, speed, meshes_arg) {
            const t = time * speed;
            
            if (meshes.fans) {
                meshes.fans.forEach((fanGroup, i) => {
                    fanGroup.children.forEach((child, index) => {
                        if (index >= 1) { 
                            child.rotation.z += 0.2 * speed; 
                        }
                    });
                });
            }

            if (meshes.storageLights) {
                meshes.storageLights.forEach((light, i) => {
                    const blinkRate = 5 + (i % 3) * 2;
                    light.material.emissiveIntensity = (Math.sin(t * blinkRate + i) > 0) ? 2 : 0;
                });
            }

            if (meshes.laser) {
                meshes.laser.position.y = Math.sin(t * 2) * 0.8;
            }

            if (meshes.beacons) {
                meshes.beacons.forEach(beacon => {
                    beacon.material.emissiveIntensity = (Math.sin(t * 1.5) + 1);
                });
            }

            if (meshes.doorWheel) {
                meshes.doorWheel.rotation.z = Math.sin(t * 0.5) * 0.5; 
            }

            if (meshes.bolts) {
                const boltExtension = (Math.sin(t * 0.5) * 0.5 + 0.5) * 1.5; 
                meshes.bolts.forEach(bolt => {
                    bolt.position.x = bolt.userData.baseX + bolt.userData.dirX * boltExtension;
                    bolt.position.y = bolt.userData.baseY + bolt.userData.dirY * boltExtension;
                });
            }

            if (meshes.pistonRod) {
                meshes.pistonRod.position.z = 24 + Math.sin(t * 0.5) * 1.5;
            }
        }
    };
}

// Auto-generated missing stub
export function createAirGappedVault() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
