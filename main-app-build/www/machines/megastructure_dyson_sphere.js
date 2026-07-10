import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // --- CUSTOM HYPER-TECH MATERIALS ---
    const starMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 5.0,
        roughness: 0.1,
        metalness: 0.1
    });

    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    
    const beamMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.9
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 4.0
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 4.0
    });

    const fieldMat = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0011ff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const darkWireframe = new THREE.MeshStandardMaterial({
        color: 0x111111,
        wireframe: true,
        roughness: 0.8,
        metalness: 1.0
    });

    // --- CENTRAL STAR ---
    const starGroup = new THREE.Group();
    const starGeo = new THREE.SphereGeometry(150, 128, 128);
    const starCore = new THREE.Mesh(starGeo, starMat);
    starGroup.add(starCore);

    const coronaGeo = new THREE.SphereGeometry(155, 64, 64);
    const starCorona = new THREE.Mesh(coronaGeo, plasmaMat);
    starGroup.add(starCorona);
    
    // Magnetic Confinement Rings
    const magRingsGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const magRingGeo = new THREE.TorusGeometry(180 + i * 10, 4, 32, 128);
        const magRing = new THREE.Mesh(magRingGeo, chrome);
        
        // Add glowing emitters on rings
        for(let j = 0; j < 8; j++) {
            const emitterGeo = new THREE.BoxGeometry(10, 10, 10);
            const emitter = new THREE.Mesh(emitterGeo, beamMat);
            const angle = (j / 8) * Math.PI * 2;
            emitter.position.set((180 + i * 10) * Math.cos(angle), (180 + i * 10) * Math.sin(angle), 0);
            magRing.add(emitter);
        }

        magRing.rotation.x = Math.random() * Math.PI;
        magRing.rotation.y = Math.random() * Math.PI;
        magRingsGroup.add(magRing);
        updatables.push({ 
            mesh: magRing, 
            type: 'spin', 
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), 
            speed: 0.02 + i * 0.01 
        });
    }
    starGroup.add(magRingsGroup);
    group.add(starGroup);

    parts.push({
        name: 'Central_Star_Core',
        description: 'The primary stellar body encapsulated by the sphere.',
        material: 'Stellar Matter (Emissive)',
        function: 'Emits continuous petawatts of radiation and plasma to be harvested.',
        assemblyOrder: 1,
        connections: ['Plasma_Containment_Field', 'Magnetic_Confinement_Rings'],
        failureEffect: 'Complete stellar collapse, supernova, or gamma-ray burst.',
        cascadeFailures: ['Total structural annihilation of the Dyson Sphere'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    parts.push({
        name: 'Plasma_Corona',
        description: 'Superheated outer atmosphere of the star bubbling with plasma loops.',
        material: 'Plasma Wireframe',
        function: 'Generates charged particles harvested by inner field collectors.',
        assemblyOrder: 2,
        connections: ['Central_Star_Core'],
        failureEffect: 'Loss of secondary plasma harvesting',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -300, y: 300, z: 300 }
    });

    parts.push({
        name: 'Magnetic_Confinement_Rings',
        description: 'Super-dense metallic torus rings weaving magnetic fields.',
        material: 'chrome, beamMat',
        function: 'Stabilizes the star to prevent erratic solar flares from damaging the shell.',
        assemblyOrder: 3,
        connections: ['Central_Star_Core'],
        failureEffect: 'Uncontrolled stellar mass ejections',
        cascadeFailures: ['Plasma_Containment_Field', 'Primary_Energy_Collectors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 400, y: -400, z: 0 }
    });
    
    // --- CONTAINMENT FIELD ---
    const fieldGeo = new THREE.SphereGeometry(250, 64, 64);
    const fieldMesh = new THREE.Mesh(fieldGeo, fieldMat);
    group.add(fieldMesh);
    
    parts.push({
        name: 'Plasma_Containment_Field',
        description: 'Holographic/Magnetic spherical barrier protecting infrastructure.',
        material: 'Energy Field',
        function: 'Absorbs rogue coronal mass ejections.',
        assemblyOrder: 4,
        connections: ['Magnetic_Confinement_Rings'],
        failureEffect: 'Severe radiation damage to inner collectors',
        cascadeFailures: ['Primary_Energy_Collectors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // --- HELPER FOR HEX PANELS ---
    function createHexPanel(radius, thickness, hasAntenna = false) {
        const panelGroup = new THREE.Group();
        
        // Base plate
        const hexGeo = new THREE.CylinderGeometry(radius, radius, thickness, 6);
        const hexMesh = new THREE.Mesh(hexGeo, darkSteel);
        hexMesh.rotation.x = Math.PI / 2;
        panelGroup.add(hexMesh);
        
        // Inner glowing collector
        const innerGeo = new THREE.CylinderGeometry(radius * 0.75, radius * 0.75, thickness * 1.1, 6);
        const innerMesh = new THREE.Mesh(innerGeo, beamMat);
        innerMesh.rotation.x = Math.PI / 2;
        panelGroup.add(innerMesh);
        
        // Heat radiators
        const finGeo = new THREE.BoxGeometry(radius * 0.05, thickness * 2.5, radius * 1.8);
        const fin1 = new THREE.Mesh(finGeo, aluminum);
        const fin2 = new THREE.Mesh(finGeo, aluminum);
        const fin3 = new THREE.Mesh(finGeo, aluminum);
        fin1.rotation.y = Math.PI / 3;
        fin2.rotation.y = -Math.PI / 3;
        fin3.rotation.y = 0;
        panelGroup.add(fin1);
        panelGroup.add(fin2);
        panelGroup.add(fin3);

        if (hasAntenna) {
            const antGeo = new THREE.CylinderGeometry(radius*0.05, radius*0.05, radius*3);
            const ant = new THREE.Mesh(antGeo, copper);
            ant.position.z = radius*1.5;
            ant.rotation.x = Math.PI/2;
            panelGroup.add(ant);
            
            const tip = new THREE.Mesh(new THREE.SphereGeometry(radius*0.2, 8, 8), neonRed);
            tip.position.y = radius*1.5;
            ant.add(tip);
            updatables.push({ mesh: tip, type: 'blink', speed: 0.05, offset: Math.random() * 10 });
        }
        
        return panelGroup;
    }

    // --- INNER SHELL (PRIMARY COLLECTORS) ---
    const primaryShell = new THREE.Group();
    const primaryCount = 600;
    const innerRadius = 400;
    
    // Use Fibonacci Sphere for even distribution
    for(let i = 0; i < primaryCount; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / primaryCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const x = innerRadius * Math.sin(phi) * Math.cos(theta);
        const y = innerRadius * Math.sin(phi) * Math.sin(theta);
        const z = innerRadius * Math.cos(phi);
        
        const panel = createHexPanel(20, 4, i % 20 === 0);
        panel.position.set(x, y, z);
        panel.lookAt(0,0,0);
        primaryShell.add(panel);
    }
    group.add(primaryShell);
    updatables.push({ mesh: primaryShell, type: 'orbit', axis: new THREE.Vector3(0, 1, 0), speed: 0.005 });

    parts.push({
        name: 'Primary_Energy_Collectors',
        description: 'Swarm of thousands of hexagonal solar arrays in inner orbit.',
        material: 'darkSteel, beamMat',
        function: 'Directly converts stellar radiation into high-yield plasma energy.',
        assemblyOrder: 5,
        connections: ['Energy_Transfer_Beams'],
        failureEffect: 'Overall power drop of 40%',
        cascadeFailures: ['Energy_Storage_Banks', 'Habitat_Life_Support'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 500, y: 500, z: 500 }
    });

    parts.push({
        name: 'Cooling_Vents',
        description: 'Massive aluminum radiator fins integrated into every panel.',
        material: 'aluminum',
        function: 'Radiates excess heat into deep space via infrared emissions.',
        assemblyOrder: 6,
        connections: ['Primary_Energy_Collectors'],
        failureEffect: 'Collector melting',
        cascadeFailures: ['Primary_Energy_Collectors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -500, y: -500, z: -500 }
    });

    // --- OUTER SHELL & HUB NODES ---
    const secondaryShell = new THREE.Group();
    const secondaryCount = 300;
    const outerRadius = 800;
    
    for(let i = 0; i < secondaryCount; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / secondaryCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const x = outerRadius * Math.sin(phi) * Math.cos(theta);
        const y = outerRadius * Math.sin(phi) * Math.sin(theta);
        const z = outerRadius * Math.cos(phi);
        
        if (i % 10 === 0) {
            // Massive Primary Hub Node
            const hubGroup = new THREE.Group();
            hubGroup.position.set(x, y, z);
            
            const hubGeo = new THREE.IcosahedronGeometry(45, 1);
            const hub = new THREE.Mesh(hubGeo, steel);
            hubGroup.add(hub);
            
            const hubCoreGeo = new THREE.IcosahedronGeometry(30, 2);
            const hubCore = new THREE.Mesh(hubCoreGeo, beamMat);
            hubGroup.add(hubCore);
            updatables.push({ mesh: hubCore, type: 'pulse', speed: 0.1, offset: i });
            
            // Extractor beams (Energy Transfer Beams) reaching to inner shell
            const beamGeo = new THREE.CylinderGeometry(5, 5, outerRadius - innerRadius, 16);
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.z = -(outerRadius - innerRadius) / 2;
            beam.rotation.x = Math.PI / 2;
            hubGroup.add(beam);

            // Hub antenna array
            const ringGeo = new THREE.TorusGeometry(60, 3, 16, 64);
            const ring = new THREE.Mesh(ringGeo, chrome);
            hubGroup.add(ring);
            updatables.push({ mesh: ring, type: 'spin_local', axis: new THREE.Vector3(0,0,1), speed: 0.05 });
            
            hubGroup.lookAt(0,0,0);
            secondaryShell.add(hubGroup);
        } else {
            const panel = createHexPanel(35, 8, false);
            panel.position.set(x, y, z);
            panel.lookAt(0,0,0);
            secondaryShell.add(panel);
        }
    }
    
    // Support Framework for Outer Shell
    const frameGeo = new THREE.IcosahedronGeometry(outerRadius, 4);
    const frame = new THREE.Mesh(frameGeo, darkWireframe);
    secondaryShell.add(frame);
    
    group.add(secondaryShell);
    updatables.push({ mesh: secondaryShell, type: 'orbit', axis: new THREE.Vector3(1, 0, 1).normalize(), speed: 0.002 });

    parts.push({
        name: 'Secondary_Energy_Collectors',
        description: 'Larger outer shell panels for secondary harvesting.',
        material: 'darkSteel, beamMat',
        function: 'Captures escaped radiation passing through the primary layer.',
        assemblyOrder: 7,
        connections: ['Support_Struts_L2'],
        failureEffect: 'Efficiency drop',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -800, y: 0, z: -800 }
    });

    parts.push({
        name: 'Primary_Hub_Nodes',
        description: 'Massive armored icosahedrons acting as energy distribution centers.',
        material: 'steel, beamMat',
        function: 'Routes petawatts of power from inner arrays to storage and habitats.',
        assemblyOrder: 8,
        connections: ['Energy_Transfer_Beams', 'Support_Struts_L2'],
        failureEffect: 'Sector blackout',
        cascadeFailures: ['Communication_Relays'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 900, z: 0 }
    });

    parts.push({
        name: 'Energy_Transfer_Beams',
        description: 'Pulsing plasma conduits bridging the void between shells.',
        material: 'Energy',
        function: 'High-voltage transfer of raw plasma.',
        assemblyOrder: 9,
        connections: ['Primary_Energy_Collectors', 'Primary_Hub_Nodes'],
        failureEffect: 'Catastrophic energy spill/radiation flood',
        cascadeFailures: ['Support_Struts_L2 melting'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 500 }
    });

    parts.push({
        name: 'Support_Struts_L2',
        description: 'Super-tensile dark matter framework locking the outer shell.',
        material: 'darkWireframe',
        function: 'Maintains structural integrity against planetary-scale gravitational shear.',
        assemblyOrder: 10,
        connections: ['Secondary_Energy_Collectors', 'Primary_Hub_Nodes'],
        failureEffect: 'Structural collapse of outer sphere sector',
        cascadeFailures: ['Orbital_Docking_Ports', 'Elevator_Shafts'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -900, z: 0 }
    });

    // --- EQUATORIAL HABITABILITY RING ---
    const ringGroup = new THREE.Group();
    const ringRadius = 1200;
    const ringTube = 60;
    
    // Main Torus Base
    const torusGeo = new THREE.TorusGeometry(ringRadius, ringTube, 128, 512);
    const ringMesh = new THREE.Mesh(torusGeo, chrome);
    ringMesh.rotation.x = Math.PI / 2;
    ringGroup.add(ringMesh);
    
    // Habitation Modules, Energy Banks, Turrets
    const habCount = 120;
    for (let i = 0; i < habCount; i++) {
        const angle = (i / habCount) * Math.PI * 2;
        const hx = ringRadius * Math.cos(angle);
        const hz = ringRadius * Math.sin(angle);
        
        const habGroup = new THREE.Group();
        habGroup.position.set(hx, 0, hz);
        habGroup.rotation.y = -angle; // Face tangentially
        
        // Massive City Blocks
        const blockGeo = new THREE.BoxGeometry(70, 100, 90);
        const block = new THREE.Mesh(blockGeo, plastic);
        habGroup.add(block);
        
        // Glowing Atriums
        const winGeo = new THREE.CylinderGeometry(40, 40, 102, 32);
        const win = new THREE.Mesh(winGeo, beamMat);
        win.rotation.x = Math.PI / 2;
        habGroup.add(win);
        
        // Energy Storage Banks (Top)
        if (i % 4 === 0) {
            const batGroup = new THREE.Group();
            batGroup.position.y = 80;
            
            const batBase = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 10, 16), steel);
            batGroup.add(batBase);
            
            const batCore = new THREE.Mesh(new THREE.CapsuleGeometry(15, 40, 16, 16), neonPurple);
            batCore.position.y = 25;
            batGroup.add(batCore);
            updatables.push({ mesh: batCore, type: 'pulse', speed: 0.08, offset: i });
            
            habGroup.add(batGroup);
        }
        
        // Anti-Asteroid Defense Turrets (Bottom)
        if (i % 6 === 0) {
            const turretGroup = new THREE.Group();
            turretGroup.position.y = -60;
            
            const baseGeo = new THREE.SphereGeometry(25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const base = new THREE.Mesh(baseGeo, darkSteel);
            base.rotation.x = Math.PI;
            turretGroup.add(base);
            
            const cannonGroup = new THREE.Group();
            cannonGroup.position.y = -10;
            
            const barrelGeo = new THREE.CylinderGeometry(4, 4, 80, 16);
            const barrel1 = new THREE.Mesh(barrelGeo, steel);
            barrel1.position.set(10, -30, 0);
            cannonGroup.add(barrel1);
            
            const barrel2 = new THREE.Mesh(barrelGeo, steel);
            barrel2.position.set(-10, -30, 0);
            cannonGroup.add(barrel2);
            
            turretGroup.add(cannonGroup);
            habGroup.add(turretGroup);
            
            updatables.push({ mesh: turretGroup, type: 'turret_track', speed: 0.02, offset: i });
        }
        
        // Communication Relays (Outward pointing)
        if (i % 15 === 0) {
            const relay = new THREE.Group();
            relay.position.x = -80; // pointing outwards
            relay.rotation.z = Math.PI / 2;
            
            const dish = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 32, 0, Math.PI*2, 0, Math.PI/2), aluminum);
            dish.rotation.x = -Math.PI / 2;
            relay.add(dish);
            
            const antenna = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 80), copper);
            antenna.position.y = 40;
            relay.add(antenna);
            
            const tip = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 16), neonRed);
            tip.position.y = 80;
            relay.add(tip);
            updatables.push({ mesh: tip, type: 'blink', speed: 0.1, offset: i });
            
            habGroup.add(relay);
        }
        
        ringGroup.add(habGroup);
    }
    
    // Connective Spokes from Outer Shell to Habitat Ring
    const spokeCount = 12;
    for (let i = 0; i < spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI * 2;
        const length = ringRadius - outerRadius;
        
        const spokeGeo = new THREE.CylinderGeometry(15, 30, length, 32);
        const spoke = new THREE.Mesh(spokeGeo, darkSteel);
        
        // Position exactly between outer radius and ring radius
        const midR = outerRadius + length / 2;
        spoke.position.set(midR * Math.cos(angle), 0, midR * Math.sin(angle));
        
        // Point outward
        spoke.rotation.x = Math.PI / 2;
        spoke.rotation.z = angle + Math.PI / 2;
        
        ringGroup.add(spoke);
    }

    group.add(ringGroup);
    updatables.push({ mesh: ringGroup, type: 'spin', axis: new THREE.Vector3(0, 1, 0), speed: 0.001 });

    parts.push({
        name: 'Equatorial_Habitability_Ring',
        description: 'Titanic rotating ring simulating gravity for planetary populations.',
        material: 'chrome, plastic',
        function: 'Civilian housing, administrative governance, and agricultural biomes.',
        assemblyOrder: 11,
        connections: ['Connective_Spokes', 'Energy_Storage_Banks'],
        failureEffect: 'Massive loss of life support',
        cascadeFailures: ['Administrative control loss'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -600, z: 0 }
    });

    parts.push({
        name: 'Energy_Storage_Banks',
        description: 'Neon purple massive capacitors capping habitat blocks.',
        material: 'neonPurple, steel',
        function: 'Stores refined plasma energy for local grid distribution.',
        assemblyOrder: 12,
        connections: ['Equatorial_Habitability_Ring'],
        failureEffect: 'Rolling blackouts across billions of homes',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 800 }
    });

    parts.push({
        name: 'Defense_Turrets',
        description: 'Gargantuan twin-barrel railguns.',
        material: 'darkSteel, steel',
        function: 'Tracks and vaporizes rogue planetary debris or hostile fleets.',
        assemblyOrder: 13,
        connections: ['Equatorial_Habitability_Ring'],
        failureEffect: 'Meteor strikes on the ring',
        cascadeFailures: ['Hull breaches', 'Decompression'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -400, z: 800 }
    });

    parts.push({
        name: 'Communication_Relays',
        description: 'Deep space quantum entanglement communicators.',
        material: 'aluminum, copper',
        function: 'Instantaneous telemetry across interstellar empires.',
        assemblyOrder: 14,
        connections: ['Equatorial_Habitability_Ring'],
        failureEffect: 'Isolation of the Dyson Sphere',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 1000, y: 0, z: 0 }
    });

    // --- POLAR DOCKING PORTS AND SPACE ELEVATORS ---
    const polarGroup = new THREE.Group();
    
    // North Pole Hub
    const northHub = new THREE.Mesh(new THREE.TorusGeometry(150, 20, 32, 128), darkSteel);
    northHub.rotation.x = Math.PI / 2;
    northHub.position.y = outerRadius + 300;
    polarGroup.add(northHub);
    
    // Glowing runway rings inside hub
    for (let i = 1; i <= 3; i++) {
        const runRing = new THREE.Mesh(new THREE.TorusGeometry(150 - i*30, 2, 16, 64), beamMat);
        runRing.rotation.x = Math.PI / 2;
        runRing.position.y = outerRadius + 300 + i*20;
        polarGroup.add(runRing);
        updatables.push({ mesh: runRing, type: 'spin_local', axis: new THREE.Vector3(0,1,0), speed: -0.05 * i });
    }

    // Space Elevators connecting North Hub to Secondary Shell
    const shaftCount = 4;
    for(let i = 0; i < shaftCount; i++) {
        const shaftLength = 300;
        const shaftGeo = new THREE.CylinderGeometry(15, 15, shaftLength, 32);
        const shaft = new THREE.Mesh(shaftGeo, glass);
        
        shaft.position.y = outerRadius + shaftLength / 2;
        
        const angle = (i / shaftCount) * Math.PI * 2;
        shaft.position.x = 130 * Math.cos(angle);
        shaft.position.z = 130 * Math.sin(angle);
        
        // Add moving elevator cars
        const carCount = 3;
        for(let j = 0; j < carCount; j++) {
            const car = new THREE.Mesh(new THREE.CapsuleGeometry(20, 40, 16, 16), chrome);
            car.position.y = -shaftLength/2 + (j * shaftLength/carCount);
            shaft.add(car);
            updatables.push({ mesh: car, type: 'elevator', speed: 2.0, limit: shaftLength/2, offset: j * (shaftLength/carCount) });
        }
        
        polarGroup.add(shaft);
    }
    
    group.add(polarGroup);
    updatables.push({ mesh: polarGroup, type: 'spin', axis: new THREE.Vector3(0, 1, 0), speed: 0.003 });

    parts.push({
        name: 'Orbital_Docking_Ports',
        description: 'Massive polar rings regulating incoming interstellar freighters.',
        material: 'darkSteel, beamMat',
        function: 'Handles import/export of exotic materials and off-world travelers.',
        assemblyOrder: 15,
        connections: ['Space_Elevator_Shafts'],
        failureEffect: 'Severe trade and logistical bottlenecks',
        cascadeFailures: ['Economic collapse'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    parts.push({
        name: 'Space_Elevator_Shafts',
        description: 'Reinforced glass and carbon-nanotube transit tubes.',
        material: 'glass, chrome',
        function: 'Transports cargo from orbital docks down to the sphere surface.',
        assemblyOrder: 16,
        connections: ['Orbital_Docking_Ports', 'Secondary_Energy_Collectors'],
        failureEffect: 'Inability to move cargo',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 1200, z: 200 }
    });

    // --- METADATA & DESCRIPTIONS ---
    const description = "The Omega-Class Dyson Sphere is a Type-II civilization megastructure entirely enveloping an active main-sequence star. It features multiple concentric shells of hexagonal solar collectors, massive energy transfer hubs, magnetic containment fields manipulating solar weather, and an equatorial habitation ring spanning thousands of kilometers to house trillions of citizens. This hyper-complex machine harnesses the total energy output of a star, generating petawatts of power for an interstellar empire.";

    const quizQuestions = [
        {
            question: "What is the critical function of the Magnetic Confinement Rings surrounding the star?",
            options: [
                "To rotate the outer protective shell",
                "To manipulate the star's magnetic field and suppress coronal mass ejections (solar flares)",
                "To store excess plasma for the civilian grid",
                "To provide a runway for interstellar freighters"
            ],
            correctAnswer: 1,
            explanation: "The massive chrome rings interact directly with the stellar magnetic field, holding back massive solar flares that would otherwise melt the inner primary collectors."
        },
        {
            question: "Why is the Equatorial Habitability Ring designed to rotate at high speeds?",
            options: [
                "To dodge incoming planetary debris",
                "To act as a massive dynamo generating backup power",
                "To generate centrifugal force, simulating Earth-like gravity for the inhabitants",
                "To cool down the atmospheric biomes via space winds"
            ],
            correctAnswer: 2,
            explanation: "In the microgravity of space, massive ring structures rotate so that the centrifugal force pins inhabitants to the inner hull, perfectly simulating a gravitational pull."
        },
        {
            question: "If the Primary Energy Collectors experience a cascade failure, what is the immediate consequence?",
            options: [
                "The central star will instantly collapse into a black hole",
                "A 40% power drop resulting in rolling blackouts in the Energy Storage Banks and life support systems",
                "The Space Elevator Shafts will shatter",
                "The Communication Relays will boost their signal automatically"
            ],
            correctAnswer: 1,
            explanation: "The primary collectors provide the bulk of the raw plasma energy. A failure there directly starves the storage banks, causing blackouts in the habitation ring."
        },
        {
            question: "What structural purpose do the massive aluminum fins (Cooling Vents) serve on the solar panels?",
            options: [
                "They radiate excess stellar heat into deep space via infrared emissions",
                "They capture deep-space radio transmissions",
                "They reflect sunlight back into the star to trigger fusion",
                "They act as physical bumpers against rogue asteroids"
            ],
            correctAnswer: 0,
            explanation: "Capturing a star's total energy output generates unimaginable waste heat. The aluminum fins act as black-body radiators, dumping heat into the void of space to prevent melting."
        },
        {
            question: "How is raw energy routed from the primary hexagonal arrays to the Secondary Shell Hub Nodes?",
            options: [
                "Through physical copper cables suspended in the vacuum",
                "Via localized quantum teleportation",
                "Through highly visible, pulsing Plasma Conduits (Energy Transfer Beams) bridging the shells",
                "By physical transport ships carrying batteries"
            ],
            correctAnswer: 2,
            explanation: "High-voltage plasma is shot through magnetic tunnels in the vacuum of space, visible as glowing cyan Energy Transfer Beams connecting the primary and secondary layers."
        }
    ];

    // --- ANIMATION LOOP ---
    let timeAcc = 0;
    function animate(time, speed, meshes) {
        timeAcc += speed * 0.016; // Standardized delta time
        
        updatables.forEach(item => {
            if (item.type === 'spin') {
                item.mesh.rotateOnAxis(item.axis, item.speed * speed);
            } else if (item.type === 'spin_local') {
                if (item.axis.x) item.mesh.rotation.x += item.speed * speed;
                if (item.axis.y) item.mesh.rotation.y += item.speed * speed;
                if (item.axis.z) item.mesh.rotation.z += item.speed * speed;
            } else if (item.type === 'orbit') {
                item.mesh.rotateOnAxis(item.axis, item.speed * speed);
            } else if (item.type === 'pulse') {
                const scale = 1 + Math.sin(timeAcc * 3 + item.offset) * item.speed;
                item.mesh.scale.set(scale, scale, scale);
                if (item.mesh.material && item.mesh.material.emissiveIntensity !== undefined) {
                    item.mesh.material.emissiveIntensity = 2 + Math.sin(timeAcc * 5 + item.offset) * 3;
                }
            } else if (item.type === 'turret_track') {
                // Turrets sweep back and forth
                item.mesh.rotation.y = Math.sin(timeAcc * item.speed + item.offset) * (Math.PI / 2);
                item.mesh.children[1].rotation.x = (Math.sin(timeAcc * item.speed * 1.5 + item.offset) * 0.5 + 0.5) * -Math.PI / 4;
            } else if (item.type === 'blink') {
                if (item.mesh.material && item.mesh.material.emissiveIntensity !== undefined) {
                    item.mesh.material.emissiveIntensity = (Math.sin(timeAcc * 15 + item.offset) > 0.5) ? 5 : 0;
                }
            } else if (item.type === 'elevator') {
                // Move elevator car up and down the shaft
                let pos = (timeAcc * item.speed * 20 + item.offset) % (item.limit * 2);
                if (pos > item.limit) {
                    pos = item.limit * 2 - pos; // go back down
                }
                item.mesh.position.y = -item.limit + pos;
            }
        });
        
        // Star corona pulsing
        starCorona.scale.setScalar(1 + Math.sin(timeAcc * 2.0) * 0.015);
        starCorona.rotation.y += 0.005 * speed;
        starCorona.rotation.x += 0.003 * speed;
        
        // Plasma containment field texture shift effect (via opacity)
        fieldMesh.material.opacity = 0.05 + (Math.sin(timeAcc * 4) * 0.5 + 0.5) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate };
}
