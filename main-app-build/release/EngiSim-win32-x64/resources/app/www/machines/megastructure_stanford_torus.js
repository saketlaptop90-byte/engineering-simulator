import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- MATERIALS (Extending/Using provided materials) ---
    const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.8, roughness: 0.4 });
    const darkHullMaterial = new THREE.MeshStandardMaterial({ color: 0x223344, metalness: 0.9, roughness: 0.5 });
    const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0 });
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.6 });
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0055ff, emissiveIntensity: 2.0 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0 });
    const radiatorMaterial = new THREE.MeshStandardMaterial({ color: 0x442211, metalness: 0.7, roughness: 0.8 });
    const shieldingMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.2, roughness: 0.9 });

    // SCALE: 1 unit = 100 meters. 
    // Torus diameter: ~1.8 km => radius 9 units.
    // Torus tube thickness: ~130m => radius 0.65 units.
    
    // --- 1. MAIN HABITAT TORUS ---
    const torusGroup = new THREE.Group();
    
    // Base Torus
    const torusGeo = new THREE.TorusGeometry(9, 0.65, 64, 128);
    const torusMesh = new THREE.Mesh(torusGeo, hullMaterial);
    torusMesh.rotation.x = Math.PI / 2;
    torusGroup.add(torusMesh);
    
    parts.push({
        name: "Main Habitat Ring",
        description: "The primary living area for 10,000+ inhabitants, rotating to provide 1g of artificial gravity.",
        material: "hullMaterial",
        function: "Houses the biosphere, residential zones, and agricultural areas.",
        assemblyOrder: 1,
        connections: ["Spokes", "Radiation Shielding"],
        failureEffect: "Loss of atmosphere and artificial gravity.",
        cascadeFailures: ["Complete habitat collapse", "Biosphere death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // Outer Radiation Shielding (Slag/Regolith)
    const shieldGeo = new THREE.TorusGeometry(9.05, 0.45, 32, 128, Math.PI); // Half torus on the outside
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldingMaterial);
    shieldMesh.rotation.x = Math.PI / 2;
    torusGroup.add(shieldMesh);
    
    parts.push({
        name: "Radiation Shielding Mass",
        description: "Ten million tons of lunar slag providing protection from cosmic rays and solar flares.",
        material: "shieldingMaterial",
        function: "Passive radiation and micrometeoroid protection.",
        assemblyOrder: 2,
        connections: ["Main Habitat Ring"],
        failureEffect: "Increased radiation exposure for inhabitants.",
        cascadeFailures: ["Long-term health crises", "Electronic system degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // Inner Sky Window (Chevron or continuous transparent inner-upper section)
    const windowGeo = new THREE.TorusGeometry(8.95, 0.66, 16, 128, Math.PI / 2);
    const windowMesh = new THREE.Mesh(windowGeo, windowMaterial);
    windowMesh.rotation.x = Math.PI / 2;
    windowMesh.rotation.z = -Math.PI / 4;
    torusGroup.add(windowMesh);

    parts.push({
        name: "Sky Window",
        description: "Massive transparent sections allowing reflected sunlight into the habitat.",
        material: "windowMaterial",
        function: "Illumination and life support for the biosphere.",
        assemblyOrder: 3,
        connections: ["Main Habitat Ring", "Secondary Mirrors"],
        failureEffect: "Loss of sunlight, cooling of habitat.",
        cascadeFailures: ["Agricultural failure", "Biosphere collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // Ring external details (ribs, conduits)
    const ribsGroup = new THREE.Group();
    for(let i=0; i<128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        const ribGeo = new THREE.TorusGeometry(0.68, 0.05, 8, 16);
        const ribMesh = new THREE.Mesh(ribGeo, darkHullMaterial);
        ribMesh.position.set(Math.cos(angle) * 9, 0, Math.sin(angle) * 9);
        ribMesh.rotation.y = -angle;
        ribsGroup.add(ribMesh);
    }
    torusGroup.add(ribsGroup);

    group.add(torusGroup);

    // --- 2. CENTRAL HUB AND AXIS ---
    const hubGroup = new THREE.Group();

    // Main Hub Cylinder
    const hubGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
    const hubMesh = new THREE.Mesh(hubGeo, hullMaterial);
    hubGroup.add(hubMesh);

    parts.push({
        name: "Central Hub",
        description: "Zero-G operations center, manufacturing, and structural core.",
        material: "hullMaterial",
        function: "Anchors the spokes, manages docking, and zero-G processing.",
        assemblyOrder: 4,
        connections: ["Spokes", "Docking Bay", "Primary Axis"],
        failureEffect: "Loss of structural integrity, inability to process incoming ships.",
        cascadeFailures: ["Torus detachment", "Supply chain collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // Docking Bay (Top)
    const dockGeo = new THREE.CylinderGeometry(0.8, 1.2, 2, 32);
    const dockMesh = new THREE.Mesh(dockGeo, darkHullMaterial);
    dockMesh.position.y = 3;
    hubGroup.add(dockMesh);
    
    // Docking aperture
    const dockApertureGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.1, 16);
    const dockApertureMesh = new THREE.Mesh(dockApertureGeo, emissiveBlue);
    dockApertureMesh.position.y = 3;
    hubGroup.add(dockApertureMesh);

    parts.push({
        name: "Docking Bay",
        description: "De-spun or counter-rotating section for spacecraft to match velocities and dock safely.",
        material: "darkHullMaterial",
        function: "Cargo and passenger transfer point.",
        assemblyOrder: 5,
        connections: ["Central Hub"],
        failureEffect: "Inability to receive supplies or evacuate.",
        cascadeFailures: ["Starvation", "Resource depletion"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // --- 3. SPOKES ---
    const spokesGroup = new THREE.Group();
    const numSpokes = 6;
    const transports = []; 
    
    for (let i = 0; i < numSpokes; i++) {
        const angle = (i / numSpokes) * Math.PI * 2;
        const spokeLen = 9 - 1.2;
        
        const spokeGeo = new THREE.CylinderGeometry(0.15, 0.3, spokeLen, 16);
        const spokeMesh = new THREE.Mesh(spokeGeo, hullMaterial);
        
        spokeMesh.rotation.z = Math.PI / 2;
        spokeMesh.rotation.y = angle;
        
        // Position spoke halfway between hub and ring
        const midR = 1.2 + spokeLen / 2;
        spokeMesh.position.set(Math.cos(angle) * midR, 0, Math.sin(angle) * midR);
        
        spokesGroup.add(spokeMesh);

        // Add elevator/transport cars on the spokes
        const transGeo = new THREE.BoxGeometry(0.4, 0.4, 0.8);
        const transMesh = new THREE.Mesh(transGeo, darkSteel);
        transMesh.rotation.y = angle;
        transMesh.position.set(Math.cos(angle) * midR, 0.3, Math.sin(angle) * midR); 
        spokesGroup.add(transMesh);
        transports.push({ mesh: transMesh, angle: angle, r: midR, dir: i%2===0 ? 1 : -1 });
    }
    hubGroup.add(spokesGroup);

    parts.push({
        name: "Transit Spokes",
        description: "Pressurized elevator shafts connecting the hub to the main torus.",
        material: "hullMaterial",
        function: "Transportation of personnel and materials, and structural tension.",
        assemblyOrder: 6,
        connections: ["Central Hub", "Main Habitat Ring"],
        failureEffect: "Isolation of habitat from hub.",
        cascadeFailures: ["Structural imbalance", "Evacuation failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 10 }
    });

    group.add(hubGroup);

    // --- 4. SOLAR PANELS AND RADIATORS ---
    const powerGroup = new THREE.Group();
    
    // Radiators extending out from the bottom hub
    const numRadiators = 8;
    for (let i=0; i<numRadiators; i++) {
        const angle = (i / numRadiators) * Math.PI * 2;
        const radGeo = new THREE.BoxGeometry(10, 0.1, 2);
        const radMesh = new THREE.Mesh(radGeo, radiatorMaterial);
        radMesh.position.set(Math.cos(angle) * 6, -3, Math.sin(angle) * 6);
        radMesh.rotation.y = -angle;
        powerGroup.add(radMesh);
        
        // Heat pipes
        const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
        const pipeMesh = new THREE.Mesh(pipeGeo, copper);
        pipeMesh.rotation.z = Math.PI / 2;
        pipeMesh.rotation.y = angle;
        pipeMesh.position.set(Math.cos(angle) * 3, -3, Math.sin(angle) * 3);
        powerGroup.add(pipeMesh);
    }

    parts.push({
        name: "Thermal Radiators",
        description: "Massive fin arrays to dump waste heat into space.",
        material: "radiatorMaterial",
        function: "Thermal regulation.",
        assemblyOrder: 7,
        connections: ["Central Hub", "Coolant Pipes"],
        failureEffect: "Overheating of the station.",
        cascadeFailures: ["Equipment meltdown", "Habitat uninhabitable"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    group.add(powerGroup);

    // --- 5. MIRROR SYSTEM (Stationary / Sun-pointing) ---
    const mirrorSystem = new THREE.Group();

    // Primary Mirror - Massive angled disc
    const primaryMirrorGeo = new THREE.CylinderGeometry(12, 12, 0.2, 64);
    const primaryMirror = new THREE.Mesh(primaryMirrorGeo, mirrorMaterial);
    primaryMirror.rotation.x = Math.PI / 4;
    primaryMirror.position.y = 20; 
    
    // Support structure for primary mirror
    const mirrorSupportGeo = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);
    const mirrorSupport = new THREE.Mesh(mirrorSupportGeo, steel);
    mirrorSupport.position.y = 10;
    
    // Truss structure for mirror
    const trussGroup = new THREE.Group();
    for(let i=0; i<4; i++){
        const angle = (i/4) * Math.PI * 2;
        const truss = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 22, 8), darkSteel);
        truss.position.set(Math.cos(angle)*1.5, 10, Math.sin(angle)*1.5);
        trussGroup.add(truss);
        
        const crossGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        for(let j=0; j<5; j++){
            const cross = new THREE.Mesh(crossGeo, darkSteel);
            cross.position.set(0, j*4 + 2, 0);
            cross.rotation.x = Math.PI/2;
            cross.rotation.z = angle;
            trussGroup.add(cross);
        }
    }
    
    mirrorSystem.add(primaryMirror);
    mirrorSystem.add(mirrorSupport);
    mirrorSystem.add(trussGroup);

    parts.push({
        name: "Primary Parabolic Mirror",
        description: "A huge, non-rotating mirror fixed to face the sun, reflecting light along the central axis.",
        material: "mirrorMaterial",
        function: "Collects and directs sunlight into the colony.",
        assemblyOrder: 8,
        connections: ["Stationary Axis Truss"],
        failureEffect: "Loss of natural sunlight.",
        cascadeFailures: ["Ecosystem collapse", "Power loss"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // Secondary Mirrors
    const secondaryMirrorGeo = new THREE.ConeGeometry(3, 2, 64, 1, true);
    const secondaryMirror = new THREE.Mesh(secondaryMirrorGeo, mirrorMaterial);
    secondaryMirror.material.side = THREE.DoubleSide;
    secondaryMirror.rotation.x = Math.PI; 
    secondaryMirror.position.y = 4.5;
    mirrorSystem.add(secondaryMirror);

    parts.push({
        name: "Secondary Reflector Cone",
        description: "Stationary conical mirror array that disperses the primary beam out into the torus sky window.",
        material: "mirrorMaterial",
        function: "Light distribution.",
        assemblyOrder: 9,
        connections: ["Stationary Axis Truss", "Central Hub Bearings"],
        failureEffect: "Uneven or complete loss of light distribution.",
        cascadeFailures: ["Crop failure", "Thermal imbalances"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    group.add(mirrorSystem);

    // --- 6. ADDITIONAL HIGH TECH DETAILS ---

    // Attitude control thrusters on rim
    const thrusterGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const thrusterShell = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.8), darkSteel);
        thrusterShell.position.set(Math.cos(angle) * 9.6, 0, Math.sin(angle) * 9.6);
        thrusterShell.rotation.y = -angle;
        
        const nozzleGeo = new THREE.CylinderGeometry(0.2, 0.1, 0.3, 16);
        const nozzle = new THREE.Mesh(nozzleGeo, chrome);
        nozzle.rotation.x = Math.PI/2;
        nozzle.position.z = 0.5;
        thrusterShell.add(nozzle);
        
        // Thruster glow
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), emissiveBlue);
        glow.position.z = 0.7;
        glow.scale.z = 2;
        thrusterShell.add(glow);
        
        thrusterGroup.add(thrusterShell);
    }
    torusGroup.add(thrusterGroup);

    parts.push({
        name: "Attitude Control Thrusters",
        description: "Small RCS modules mounted on the outer rim to maintain rotation rate and correct wobble.",
        material: "darkSteel",
        function: "Spin maintenance and station keeping.",
        assemblyOrder: 10,
        connections: ["Main Habitat Ring", "Fuel Lines"],
        failureEffect: "Wobble or spin decay.",
        cascadeFailures: ["Gravity fluctuation", "Docking hazards"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // Communication Arrays
    const commsGroup = new THREE.Group();
    const dishGeo = new THREE.CylinderGeometry(1, 0.1, 0.5, 32, 1, false, 0, Math.PI * 2);
    dishGeo.scale(1, 1, 0.3);
    const dish1 = new THREE.Mesh(dishGeo, aluminum);
    dish1.position.set(1.5, -4, 0);
    dish1.rotation.z = -Math.PI / 4;
    commsGroup.add(dish1);

    const dish2 = new THREE.Mesh(dishGeo, aluminum);
    dish2.position.set(-1.5, -4, 0);
    dish2.rotation.z = Math.PI / 4;
    commsGroup.add(dish2);

    parts.push({
        name: "High-Gain Antenna Arrays",
        description: "Deep space communication dishes linking the colony to Earth and other settlements.",
        material: "aluminum",
        function: "Telemetry, communications, and data transfer.",
        assemblyOrder: 11,
        connections: ["Central Hub (Bottom)"],
        failureEffect: "Loss of communication.",
        cascadeFailures: ["Isolation", "Navigation data loss"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });
    group.add(commsGroup);
    
    // Structural tension cables
    const cablesGroup = new THREE.Group();
    for (let i = 0; i < numSpokes; i++) {
        const angle1 = (i / numSpokes) * Math.PI * 2;
        const angle2 = ((i+1) / numSpokes) * Math.PI * 2;
        
        const p1 = new THREE.Vector3(Math.cos(angle1) * 8.5, 0, Math.sin(angle1) * 8.5);
        const p2 = new THREE.Vector3(Math.cos(angle2) * 8.5, 0, Math.sin(angle2) * 8.5);
        
        const dist = p1.distanceTo(p2);
        const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, dist, 8);
        const cable = new THREE.Mesh(cableGeo, steel);
        
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        cable.position.copy(midPoint);
        cable.lookAt(p2);
        cable.rotation.x = Math.PI/2; 
        
        cablesGroup.add(cable);
    }
    torusGroup.add(cablesGroup);

    parts.push({
        name: "Tension Ring Cables",
        description: "High-tensile composite cables bracing the spokes and ring.",
        material: "steel",
        function: "Vibration dampening and structural integrity.",
        assemblyOrder: 12,
        connections: ["Main Habitat Ring", "Spokes"],
        failureEffect: "Increased vibration, material fatigue.",
        cascadeFailures: ["Structural failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // Glowing rim lights
    const rimLights = new THREE.Group();
    for(let i=0; i<360; i+=10) {
        const angle = (i * Math.PI) / 180;
        const lightGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const light = new THREE.Mesh(lightGeo, i % 30 === 0 ? emissiveRed : emissiveBlue);
        light.position.set(Math.cos(angle) * 9.7, 0.5, Math.sin(angle) * 9.7);
        light.rotation.y = -angle;
        rimLights.add(light);
    }
    torusGroup.add(rimLights);

    // Internal Habitat Details (city blocks on inner surface)
    const cityGroup = new THREE.Group();
    for(let i=0; i<500; i++) {
        const angle = (i/500) * Math.PI * 2;
        const bHeight = Math.random() * 0.2 + 0.05;
        const bGeo = new THREE.BoxGeometry(0.1, bHeight, 0.1);
        const bMat = Math.random() > 0.8 ? emissiveBlue : aluminum;
        const bMesh = new THREE.Mesh(bGeo, bMat);
        
        const theta = angle;
        const floorPhi = (Math.random() - 0.5) * 1.5; 
        const px = (9 + 0.6 * Math.cos(floorPhi)) * Math.cos(theta);
        const py = 0.6 * Math.sin(floorPhi);
        const pz = (9 + 0.6 * Math.cos(floorPhi)) * Math.sin(theta);
        
        bMesh.position.set(px, py, pz);
        bMesh.lookAt(9 * Math.cos(theta), 0, 9 * Math.sin(theta)); 
        
        cityGroup.add(bMesh);
    }
    torusGroup.add(cityGroup);

    parts.push({
        name: "Internal Biosphere & Cityscapes",
        description: "Dense urban and agricultural zones built on the inner surface of the outer hull, experiencing 1g.",
        material: "aluminum",
        function: "Habitation and life support.",
        assemblyOrder: 13,
        connections: ["Main Habitat Ring"],
        failureEffect: "Habitat destruction.",
        cascadeFailures: ["Complete loss of life"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    parts.push({
        name: "Stationary Non-Rotating Section",
        description: "The entire mirror assembly and truss, decoupled from the rotating habitat to constantly face the sun.",
        material: "steel",
        function: "Sun tracking.",
        assemblyOrder: 14,
        connections: ["Primary Bearings", "Primary Parabolic Mirror"],
        failureEffect: "Loss of solar alignment.",
        cascadeFailures: ["Power loss", "Thermal drop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });
    
    // Magnetic bearings
    const bearingGeo = new THREE.TorusGeometry(1.25, 0.1, 16, 64);
    const bearing1 = new THREE.Mesh(bearingGeo, chrome);
    bearing1.position.y = 2.5;
    bearing1.rotation.x = Math.PI/2;
    hubGroup.add(bearing1);
    
    const bearing2 = new THREE.Mesh(bearingGeo, chrome);
    bearing2.position.y = -1.0;
    bearing2.rotation.x = Math.PI/2;
    hubGroup.add(bearing2);

    parts.push({
        name: "Magnetic Bearings",
        description: "Frictionless magnetic suspension rings coupling the rotating and stationary sections.",
        material: "chrome",
        function: "Allows the station to spin while keeping the mirrors and docking ports stationary.",
        assemblyOrder: 15,
        connections: ["Central Hub", "Stationary Axis Truss"],
        failureEffect: "Friction, heat buildup, and catastrophic mechanical failure.",
        cascadeFailures: ["Station spin-down", "Tear in hull"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });


    // Ensure the rotating part (torus, spokes, hub) is in a container that we spin
    const rotatingSection = new THREE.Group();
    rotatingSection.add(torusGroup);
    rotatingSection.add(hubGroup);
    
    // The main group contains the rotating section, the non-rotating mirrors, and power radiators
    group.add(rotatingSection);

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    const animate = (time, speed, meshes) => {
        const delta = 0.01 * speed;
        
        // Spin the rotating section (Torus, Spokes, Hub)
        rotatingSection.rotation.y -= delta * 0.5;

        // Animate transport elevators along the spokes
        transports.forEach(t => {
            t.r += t.dir * delta * 2;
            if(t.r > 8.4) {
                t.r = 8.4;
                t.dir = -1;
            } else if (t.r < 1.2) {
                t.r = 1.2;
                t.dir = 1;
            }
            t.mesh.position.set(Math.cos(t.angle) * t.r, 0.3, Math.sin(t.angle) * t.r);
        });

        // Pulsing lights on the rim
        rimLights.children.forEach((light, index) => {
            if(light.material === emissiveBlue) {
                light.material.emissiveIntensity = 1 + Math.sin(time * 2 + index) * 0.5;
            } else {
                light.material.emissiveIntensity = 1 + Math.sin(time * 5 + index) * 1.5; 
            }
        });

        // Slow rotation of primary mirror to simulate tracking
        mirrorSystem.rotation.y = Math.sin(time * 0.1) * 0.1;
        mirrorSystem.rotation.z = Math.cos(time * 0.1) * 0.1;
        
        // Docking aperture pulse
        dockApertureMesh.material.emissiveIntensity = 2 + Math.sin(time * 3);
        
        // Radar dishes sweeping
        dish1.rotation.y = time * 0.5;
        dish2.rotation.y = -time * 0.3;
    };

    const description = "The Stanford Torus is a massive, highly complex space settlement design proposed in 1975. Capable of housing 10,000 to 140,000 inhabitants, it consists of a giant rotating ring 1.8 kilometers in diameter to simulate Earth-like gravity. Sunlight is directed into the interior via a system of massive stationary and secondary mirrors. The central hub handles zero-g manufacturing and docking, connected to the ring by pressurized transit spokes. Shielded by millions of tons of extracted lunar material, it represents the pinnacle of speculative megastructure engineering.";

    const quizQuestions = [
        {
            question: "What is the primary function of the enormous stationary mirror floating above the Stanford Torus?",
            options: [
                "To reflect harmful cosmic radiation away",
                "To collect and reflect sunlight into the habitat via secondary mirrors",
                "To serve as a massive solar sail for propulsion",
                "To act as a deep-space radio telescope"
            ],
            correctAnswer: 1,
            explanation: "The primary mirror reflects sunlight down to the secondary mirrors at the hub, which then disperse it through the 'sky window' into the ring's interior, providing natural light for the biosphere."
        },
        {
            question: "Why does the main habitat ring rotate?",
            options: [
                "To generate artificial gravity for the inhabitants via centrifugal force",
                "To create a magnetic field that deflects solar wind",
                "To keep the structure evenly heated by the sun",
                "To drill through orbital debris"
            ],
            correctAnswer: 0,
            explanation: "The torus rotates at about 1 RPM. The centrifugal force pushes objects toward the outer rim, simulating Earth's 1g gravity."
        },
        {
            question: "What material is primarily used for the outer radiation shielding mass on the Torus?",
            options: [
                "Lead panels",
                "Depleted uranium",
                "Extracted lunar slag and regolith",
                "Water ice tanks"
            ],
            correctAnswer: 2,
            explanation: "Lunar slag/regolith (around 10 million tons) is used as cheap, highly effective mass shielding against cosmic rays and solar flares."
        },
        {
            question: "How do inhabitants and cargo travel between the zero-G central hub and the 1g habitat ring?",
            options: [
                "Using small orbital shuttlecraft",
                "Through pressurized transit elevators running along the spokes",
                "Via teleportation pods",
                "By climbing massive internal ladders"
            ],
            correctAnswer: 1,
            explanation: "The spokes connecting the hub to the rim contain pressurized elevator shafts for transporting people and materials."
        },
        {
            question: "Why are the docking bays located at the central hub?",
            options: [
                "It's the most heavily shielded area",
                "It has the lowest rotational velocity (zero-G), making docking much easier",
                "It is closer to the primary mirror",
                "There is no space on the outer rim"
            ],
            correctAnswer: 1,
            explanation: "The central hub lies on the axis of rotation, so it experiences zero centrifugal gravity. This, along with de-spun sections, allows spacecraft to dock safely without dealing with the high velocities of the outer rim."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
