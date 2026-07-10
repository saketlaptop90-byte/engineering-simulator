import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // Custom emissive materials for hyper-tech look
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, wireframe: false });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 2.0, wireframe: false });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff7700, emissive: 0xff7700, emissiveIntensity: 1.5 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x9900ff, emissive: 0x9900ff, emissiveIntensity: 2.0 });
    const laserGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 3.0 });
    
    // Core structural material variants
    const matteBlack = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.5 });
    const brushedTitanium = new THREE.MeshStandardMaterial({ color: 0x8899a6, roughness: 0.4, metalness: 0.8 });
    const polishedGold = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 1.0 });

    // =========================================================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // =========================================================================
    
    // Generates a complex biomechanical gear
    function createGear(radius, teeth, thickness, mat) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.75;
        const holeRadius = radius * 0.3;
        
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = (i % 2 === 0) ? radius : innerRadius;
            if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        shape.closePath();
        
        const hole = new THREE.Path();
        hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(hole);
        
        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center(); // Center the geometry
        const mesh = new THREE.Mesh(geom, mat);
        
        // Inner axle bearing
        const bearingGeom = new THREE.TorusGeometry(holeRadius * 1.1, 0.1, 16, 32);
        bearingGeom.rotateX(Math.PI / 2);
        const bearing = new THREE.Mesh(bearingGeom, chrome);
        mesh.add(bearing);
        
        return mesh;
    }

    // Generates a multi-part hydraulic piston system
    function createPiston(radius, length, extensionMax) {
        const pistonGroup = new THREE.Group();
        
        // Main cylinder
        const cylinderGeom = new THREE.CylinderGeometry(radius, radius, length, 32);
        cylinderGeom.translate(0, length / 2, 0);
        const cylinder = new THREE.Mesh(cylinderGeom, darkSteel);
        
        // Fluid inlet ports
        const portGeom = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, radius * 2.5, 16);
        portGeom.rotateZ(Math.PI / 2);
        portGeom.translate(0, length * 0.1, 0);
        const port = new THREE.Mesh(portGeom, copper);
        cylinder.add(port);
        
        // Inner rod
        const rodGeom = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.2, 32);
        rodGeom.translate(0, (length * 1.2) / 2, 0);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.y = length * 0.5; // Initial extension
        
        // Rod head joint
        const jointGeom = new THREE.SphereGeometry(radius * 1.2, 32, 32);
        jointGeom.translate(0, length * 1.2, 0);
        const joint = new THREE.Mesh(jointGeom, brushedTitanium);
        rod.add(joint);
        
        pistonGroup.add(cylinder);
        pistonGroup.add(rod);
        
        return { group: pistonGroup, cylinder, rod, extensionMax, baseLength: length };
    }

    // Custom Curve for the Cochlear Spiral Array
    class CochlearSpiral extends THREE.Curve {
        constructor(scale = 1, turns = 2.5) {
            super();
            this.scale = scale;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            // Logarithmic spiral approximation
            const radius = 3.0 * Math.exp(-0.25 * angle); 
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = t * -2.5; // Spiral descending into the cochlea structure
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }

    // =========================================================================
    // COMPONENT CONSTRUCTION
    // =========================================================================

    // 1. CRANIAL ANCHOR PLATE
    const plateShape = new THREE.Shape();
    plateShape.moveTo(0, 4);
    plateShape.bezierCurveTo(3, 4, 4, 1, 3, -3);
    plateShape.bezierCurveTo(2, -5, -2, -5, -3, -3);
    plateShape.bezierCurveTo(-4, 1, -3, 4, 0, 4);
    
    const plateExtrude = { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.2, bevelSegments: 4 };
    const plateGeom = new THREE.ExtrudeGeometry(plateShape, plateExtrude);
    const cranialPlate = new THREE.Mesh(plateGeom, brushedTitanium);
    cranialPlate.position.set(-6, 0, -2);
    cranialPlate.rotation.y = Math.PI / 4;
    group.add(cranialPlate);
    
    // Cranial Mounting Bolts
    const boltPositions = [[0, 3.5], [2.5, 0], [2, -3], [-2, -3], [-2.5, 0]];
    const bolts = new THREE.Group();
    boltPositions.forEach(pos => {
        const boltGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
        boltGeom.rotateX(Math.PI / 2);
        const bolt = new THREE.Mesh(boltGeom, chrome);
        bolt.position.set(pos[0], pos[1], 0.4);
        
        // Torx socket detail
        const socketGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.65, 6);
        socketGeom.rotateX(Math.PI / 2);
        const socket = new THREE.Mesh(socketGeom, matteBlack);
        bolt.add(socket);
        
        bolts.add(bolt);
    });
    cranialPlate.add(bolts);

    parts.push({
        name: "Titanium Cranial Anchor Plate",
        description: "Osteo-integrated mounting chassis. Secures the entire external macro-assembly directly to the temporal bone using deep cortical screws.",
        material: "Brushed Titanium & Surgical Steel",
        function: "Provides absolute stability for micro-hydraulic adjustments and prevents transmission loss.",
        assemblyOrder: 1,
        connections: ["Temporal Bone", "Processor Housing Mounts", "Hydraulic Base"],
        failureEffect: "Severe mechanical instability leading to signal decoupling.",
        cascadeFailures: ["Induction misalignment", "Tissue trauma", "Processor array disconnect"],
        originalPosition: cranialPlate.position.clone(),
        explodedPosition: new THREE.Vector3(-12, 0, -5)
    });

    // 2. MAIN NEURAL PROCESSOR HOUSING
    const housingGroup = new THREE.Group();
    
    const housingPoints = [];
    for (let i = 0; i < 20; i++) {
        housingPoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 2.5 + 1.5, (i - 10) * 0.4));
    }
    const housingGeom = new THREE.LatheGeometry(housingPoints, 64, 0, Math.PI);
    const processorHousing = new THREE.Mesh(housingGeom, plastic);
    processorHousing.rotation.z = Math.PI / 2;
    processorHousing.rotation.x = -Math.PI / 2;
    housingGroup.add(processorHousing);
    
    // Processor cooling vents (Shape with holes)
    const ventGeom = new THREE.TorusKnotGeometry(1.2, 0.2, 128, 16, 2, 5);
    const coolingVents = new THREE.Mesh(ventGeom, aluminum);
    coolingVents.position.set(0, 0, 1.0);
    coolingVents.scale.set(1, 0.5, 1);
    processorHousing.add(coolingVents);

    // Quantum Core Status Ring
    const statusRingGeom = new THREE.TorusGeometry(2.0, 0.15, 16, 64);
    const statusRing = new THREE.Mesh(statusRingGeom, neonCyan);
    statusRing.position.set(0, 0, 0.5);
    processorHousing.add(statusRing);

    cranialPlate.add(housingGroup);
    housingGroup.position.set(0, 0, 1.2);
    housingGroup.rotation.y = -Math.PI / 8;

    parts.push({
        name: "Quantum Neural Processor Housing",
        description: "Polycarbonate and titanium enclosure for the AI-driven acoustic transcription core.",
        material: "High-density Polymer & Aluminum Vents",
        function: "Filters and translates ambient multi-spectrum sound into encrypted neuro-magnetic pulses.",
        assemblyOrder: 2,
        connections: ["Cranial Anchor Plate", "Data Ribbons", "Cooling System"],
        failureEffect: "Total sensory loss or extreme auditory hallucination.",
        cascadeFailures: ["Thermal runaway", "Core logic fault"],
        originalPosition: housingGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 5, 8)
    });

    // 3. INTERNAL PROCESSOR GEARS & COOLING FANS
    const gearSystem = new THREE.Group();
    const gear1 = createGear(1.5, 16, 0.3, copper);
    gear1.position.set(-1.0, 0, 0);
    const gear2 = createGear(1.0, 10, 0.3, steel);
    gear2.position.set(1.1, 0, 0);
    
    // Fan blades inside gear 1
    const fanGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32, 1, false, 0, Math.PI * 2);
    const fanMat = darkSteel;
    const fan = new THREE.Mesh(fanGeom, fanMat);
    fan.rotation.x = Math.PI / 2;
    for (let i=0; i<8; i++) {
        const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([
            new THREE.Vector2(0.2, 0), new THREE.Vector2(1.1, 0.3), new THREE.Vector2(1.1, -0.3)
        ]), {depth:0.05}), aluminum);
        blade.rotation.z = (i / 8) * Math.PI * 2;
        blade.rotation.y = 0.4; // Pitch
        fan.add(blade);
    }
    gear1.add(fan);
    
    gearSystem.add(gear1);
    gearSystem.add(gear2);
    gearSystem.position.set(0, 0, 0.5);
    processorHousing.add(gearSystem);

    updatables.push((time) => {
        gear1.rotation.z = time * 2.0;
        gear2.rotation.z = -time * (16/10) * 2.0; // Proper gear ratio
        fan.rotation.z = time * -5.0; // Fan spins fast
    });

    parts.push({
        name: "Thermal-Kinetic Dissipation System",
        description: "Micro-machined copper and steel interlocking gears driving an active centrifugal cooling fan.",
        material: "Copper, Steel, Aluminum",
        function: "Maintains absolute zero-point thermal variance for the neural transcription core.",
        assemblyOrder: 3,
        connections: ["Processor Housing Core"],
        failureEffect: "Processor overheating and protective shutdown.",
        cascadeFailures: ["Core meltdown", "Local tissue burns"],
        originalPosition: gearSystem.position.clone(),
        explodedPosition: new THREE.Vector3(0, 0, 5)
    });

    // 4. MICRO-HYDRAULIC ARTICULATION SYSTEM
    const hydraulicSystem = new THREE.Group();
    const pistons = [];
    
    const pistonPositions = [
        { x: -1.5, y: 1.5, z: 0, rx: 0, ry: 0, rz: -Math.PI / 4 },
        { x: 1.5, y: 1.5, z: 0, rx: 0, ry: 0, rz: Math.PI / 4 },
        { x: 0, y: -2.0, z: 0, rx: 0, ry: 0, rz: 0 }
    ];

    pistonPositions.forEach((pos, idx) => {
        const p = createPiston(0.2, 2.0, 1.5);
        p.group.position.set(pos.x, pos.y, pos.z);
        p.group.rotation.set(pos.rx, pos.ry, pos.rz);
        hydraulicSystem.add(p.group);
        pistons.push(p);
    });

    processorHousing.add(hydraulicSystem);
    hydraulicSystem.position.set(0, 0, 2);

    updatables.push((time) => {
        pistons.forEach((p, idx) => {
            const offset = idx * Math.PI * 0.6;
            // Dynamic breathing/adjusting motion
            const extension = Math.sin(time * 3.0 + offset) * 0.5 + 0.5; 
            p.rod.position.y = p.baseLength * 0.5 + (extension * p.extensionMax);
        });
    });

    parts.push({
        name: "Tri-Axial Micro-Hydraulic Actuators",
        description: "Three precision-machined hydraulic pistons driven by synthetic cerebrospinal fluid.",
        material: "Dark Steel, Chrome, Copper Ports",
        function: "Continuously adjusts the induction coil angle to maximize magnetic flux alignment with the implant.",
        assemblyOrder: 4,
        connections: ["Processor Housing", "Induction Transmitter Armature"],
        failureEffect: "Misalignment of induction coil causing signal degradation.",
        cascadeFailures: ["Intermittent audio dropout", "Signal artifacting"],
        originalPosition: hydraulicSystem.position.clone(),
        explodedPosition: new THREE.Vector3(5, 5, 5)
    });

    // 5. INDUCTION TRANSMITTER HEAD (The external coil)
    const transmitterGroup = new THREE.Group();
    
    // Main casing
    const casingGeom = new THREE.CylinderGeometry(3.5, 3.8, 0.8, 64);
    casingGeom.rotateX(Math.PI / 2);
    const casing = new THREE.Mesh(casingGeom, plastic);
    transmitterGroup.add(casing);
    
    // Internal Copper Coil
    const coilGeom = new THREE.TorusGeometry(2.5, 0.4, 32, 100, Math.PI * 20); // Spiral-like tight torus
    const coil = new THREE.Mesh(coilGeom, copper);
    coil.scale.set(1, 1, 0.2);
    coil.position.z = -0.1;
    transmitterGroup.add(coil);

    // Magnetic Coupling Array (inner ring)
    const magnetGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.9, 32);
    magnetGeom.rotateX(Math.PI / 2);
    const magnet = new THREE.Mesh(magnetGeom, darkSteel);
    transmitterGroup.add(magnet);

    // Neon Pulse Emitter (Outer Edge)
    const emitterGeom = new THREE.TorusGeometry(3.6, 0.08, 16, 64);
    const emitterRing = new THREE.Mesh(emitterGeom, neonPurple);
    transmitterGroup.add(emitterRing);

    // Link transmitter to the processor via an articulating armature
    const armGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 2, 1),
            new THREE.Vector3(4, 1, 3),
            new THREE.Vector3(6, 0, 4)
        ]), 64, 0.4, 16, false
    );
    const armature = new THREE.Mesh(armGeom, matteBlack); // Using matte black instead of carbon fiber
    
    processorHousing.add(armature);
    armature.position.set(0, 0, 1);
    
    transmitterGroup.position.set(6, 0, 5);
    transmitterGroup.rotation.y = -Math.PI / 6;
    processorHousing.add(transmitterGroup);

    updatables.push((time) => {
        // Coil pulsing effect
        const pulse = Math.abs(Math.sin(time * 5.0));
        emitterRing.material.emissiveIntensity = 1.0 + pulse * 3.0;
        emitterRing.scale.setScalar(1.0 + pulse * 0.02);
        
        // Micro-adjustments
        transmitterGroup.rotation.x = Math.sin(time * 2.0) * 0.05;
        transmitterGroup.rotation.z = Math.cos(time * 1.5) * 0.05;
    });

    parts.push({
        name: "Trans-dermal Induction Transmitter",
        description: "High-flux copper induction array housed in a resonance-dampened casing.",
        material: "Copper Wire, Polycarbonate, Neodymium Magnets",
        function: "Projects power and encoded neural audio data through the scalp via RF magnetic fields.",
        assemblyOrder: 5,
        connections: ["Articulating Armature", "Implant Receiver (Wireless)"],
        failureEffect: "Complete loss of power and data transmission to the implant.",
        cascadeFailures: ["Array power-down"],
        originalPosition: transmitterGroup.position.clone(),
        explodedPosition: new THREE.Vector3(12, 0, 8)
    });

    // 6. IMPLANTED RECEIVER MODULE (Inside the skull)
    const receiverGroup = new THREE.Group();
    
    const receiverCasingGeom = new THREE.CylinderGeometry(3.2, 3.2, 0.4, 64);
    receiverCasingGeom.rotateX(Math.PI / 2);
    const receiverCasing = new THREE.Mesh(receiverCasingGeom, brushedTitanium);
    receiverGroup.add(receiverCasing);

    // Internal pickup coil (Gold for high conductivity inside body)
    const pickupGeom = new THREE.TorusGeometry(2.2, 0.2, 16, 64);
    const pickupCoil = new THREE.Mesh(pickupGeom, polishedGold);
    pickupCoil.position.z = 0.15;
    receiverGroup.add(pickupCoil);

    // Data decoder chip
    const chipGeom = new THREE.BoxGeometry(1.2, 1.2, 0.3); // One tiny cube exception for a microchip
    const chip = new THREE.Mesh(chipGeom, matteBlack);
    chip.position.z = 0.2;
    receiverGroup.add(chip);
    
    // Activity LEDs on the chip (Cyberpunk aesthetic even if internal)
    const chipLedGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const chipLed1 = new THREE.Mesh(chipLedGeom, laserGreen);
    chipLed1.position.set(0.4, 0.4, 0.15);
    const chipLed2 = new THREE.Mesh(chipLedGeom, neonRed);
    chipLed2.position.set(-0.4, 0.4, 0.15);
    chip.add(chipLed1);
    chip.add(chipLed2);

    // Position perfectly opposite to the external transmitter, spaced by "skin" thickness
    receiverGroup.position.set(6.5, 0, -1); 
    receiverGroup.rotation.y = -Math.PI / 6;
    group.add(receiverGroup);

    updatables.push((time) => {
        // Fast blinking for data processing
        chipLed1.material.emissiveIntensity = Math.random() > 0.2 ? 3.0 : 0.0;
        chipLed2.material.emissiveIntensity = Math.random() > 0.8 ? 2.0 : 0.0;
        pickupCoil.rotation.z = time * 0.5; // Slight internal rotation for tuning
    });

    parts.push({
        name: "Subdermal Titanium Receiver Module",
        description: "Implanted decoding matrix with gold-plated RF pickup coil. Hermetically sealed.",
        material: "Surgical Titanium, Gold, Silicon",
        function: "Receives inductive power and data, decodes telemetry, and drives the micro-array.",
        assemblyOrder: 6,
        connections: ["Induction Transmitter (Wireless)", "Electrode Array Leads"],
        failureEffect: "Total implant failure requiring surgical replacement.",
        cascadeFailures: ["Electrode misfire", "Neuro-toxicity if seal breaks"],
        originalPosition: receiverGroup.position.clone(),
        explodedPosition: new THREE.Vector3(15, -5, -5)
    });

    // 7. ELECTRODE ARRAY INJECTOR / BASE
    const injectorGroup = new THREE.Group();
    
    // Curved tubing leading from receiver to the cochlea
    const leadCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(6.5, 0, -1),
        new THREE.Vector3(5, -4, -3),
        new THREE.Vector3(2, -6, -4),
        new THREE.Vector3(0, -8, -5)
    ]);
    const leadGeom = new THREE.TubeGeometry(leadCurve, 64, 0.3, 16, false);
    const leadCable = new THREE.Mesh(leadGeom, rubber); // Biocompatible silicone jacket
    group.add(leadCable);

    // Injector Head at the end of the lead
    const injectorCasingGeom = new THREE.CylinderGeometry(0.8, 0.5, 2.0, 32);
    injectorCasingGeom.rotateX(Math.PI / 2);
    const injectorCasing = new THREE.Mesh(injectorCasingGeom, chrome);
    injectorGroup.position.set(0, -8, -5);
    // Orient towards spiral start
    injectorGroup.rotation.x = Math.PI / 4;
    injectorGroup.add(injectorCasing);
    
    group.add(injectorGroup);

    parts.push({
        name: "Silicone Lead & Fluidic Injector Base",
        description: "Bio-compatible routing cable terminating in a micro-fluidic pressure injector.",
        material: "Medical Grade Silicone, Chrome",
        function: "Routes signals to the deep inner ear and anchors the basal end of the array.",
        assemblyOrder: 7,
        connections: ["Receiver Module", "Cochlear Spiral Array"],
        failureEffect: "Signal attenuation or mechanical pull-out of the array.",
        cascadeFailures: ["Array slippage", "Cochlear fluid leak"],
        originalPosition: injectorGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, -15, -5)
    });

    // 8. THE CYBER COCHLEAR MICRO ARRAY (The massive spiral structure)
    const arrayGroup = new THREE.Group();
    
    const spiralPath = new CochlearSpiral(1.5, 2.75); // 2.75 turns
    const arrayTubeGeom = new THREE.TubeGeometry(spiralPath, 256, 0.25, 16, false);
    
    // Custom transparent silicone material to see inner wires
    const siliconeMat = new THREE.MeshPhysicalMaterial({
        color: 0xdddddd,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        side: THREE.DoubleSide
    });
    
    const arrayTube = new THREE.Mesh(arrayTubeGeom, siliconeMat);
    arrayGroup.add(arrayTube);

    // Internal Platinum-Iridium Wiring
    const wireGeom = new THREE.TubeGeometry(spiralPath, 256, 0.05, 8, false);
    const wireMesh = new THREE.Mesh(wireGeom, copper);
    // Slight offset to create twisting wire effect
    const wireMesh2 = new THREE.Mesh(wireGeom, polishedGold);
    wireMesh2.position.set(0.05, 0.05, 0);
    arrayTube.add(wireMesh);
    arrayTube.add(wireMesh2);

    // Generate 24 Hyper-detailed Electrode Nodes along the spiral
    const electrodes = [];
    const numElectrodes = 24;
    for (let i = 0; i < numElectrodes; i++) {
        // Distribute along the curve (skip the very beginning and end)
        const t = 0.05 + (i / numElectrodes) * 0.9;
        const pos = spiralPath.getPoint(t);
        const tangent = spiralPath.getTangent(t);
        
        const nodeGroup = new THREE.Group();
        nodeGroup.position.copy(pos);
        
        // Align node with curve tangent
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
        nodeGroup.quaternion.copy(quaternion);
        
        // Platinum contact ring
        const contactGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16);
        const contact = new THREE.Mesh(contactGeom, polishedGold);
        nodeGroup.add(contact);
        
        // Neural Interface Spikes (Micro-needles for direct nerve tapping)
        for (let j=0; j<4; j++) {
            const spikeGeom = new THREE.ConeGeometry(0.05, 0.4, 8);
            spikeGeom.rotateX(Math.PI / 2);
            spikeGeom.translate(0, 0, 0.35);
            const spike = new THREE.Mesh(spikeGeom, chrome);
            spike.rotation.y = (j / 4) * Math.PI * 2;
            nodeGroup.add(spike);
        }

        // Emissive Firing Indicator
        const glowGeom = new THREE.TorusGeometry(0.3, 0.05, 8, 16);
        glowGeom.rotateX(Math.PI / 2);
        // Alternate colors for tonotopic mapping (high freq = cyan, low freq = red/orange)
        const glowMat = (i < 8) ? neonCyan : (i < 16) ? laserGreen : neonOrange;
        const glow = new THREE.Mesh(glowGeom, glowMat.clone());
        nodeGroup.add(glow);

        arrayGroup.add(nodeGroup);
        electrodes.push({ group: nodeGroup, glow: glow, t: t });
    }

    // Attach array to the injector
    arrayGroup.position.set(0, 0, -1.0);
    injectorGroup.add(arrayGroup);

    updatables.push((time) => {
        // Complex sequential firing algorithm mimicking acoustic processing
        const waveSpeed = time * 4.0;
        electrodes.forEach((el, index) => {
            // Complex interference pattern to simulate multi-channel audio data
            const fireIntensity = Math.max(0, Math.sin(waveSpeed - el.t * 30.0)) * 
                                  Math.max(0, Math.cos(waveSpeed * 1.5 + index * 0.5));
            
            // Apply intensity to emissive material
            el.glow.material.emissiveIntensity = fireIntensity * 4.0;
            
            // Micro-pulsation of the silicone tube
            const pulseScale = 1.0 + (fireIntensity * 0.05);
            el.group.scale.setScalar(pulseScale);
        });
        
        // Array breathing effect (overall structure twisting slightly)
        arrayTube.rotation.y = Math.sin(time * 0.5) * 0.02;
    });

    parts.push({
        name: "Trans-tympanic Platinum-Iridium Spiral Array",
        description: "24-channel neuro-stimulation spiral with deep-penetrating micro-spikes.",
        material: "Platinum, Gold, Medical Silicone, Chrome",
        function: "Directly stimulates the auditory nerve fibers via tonotopic spatial mapping.",
        assemblyOrder: 8,
        connections: ["Injector Base", "Auditory Nerve (Biological)"],
        failureEffect: "Total deafness or agonizing neuro-feedback loops.",
        cascadeFailures: ["Tissue rejection", "Galvanic corrosion"],
        originalPosition: arrayGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, -20, -15)
    });

    // 9. AMBIENT DIAGNOSTIC HUD HOLOGRAPHS (Cyberpunk detail)
    const holoGroup = new THREE.Group();
    // A complex geometric floating display
    const tetraGeom = new THREE.TetrahedronGeometry(1.5, 1);
    const tetra = new THREE.Mesh(tetraGeom, new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.3 }));
    holoGroup.add(tetra);
    
    const ring1Geom = new THREE.TorusGeometry(2.0, 0.02, 16, 64);
    const ring1 = new THREE.Mesh(ring1Geom, neonCyan);
    holoGroup.add(ring1);
    
    const ring2Geom = new THREE.TorusGeometry(2.2, 0.02, 16, 64);
    const ring2 = new THREE.Mesh(ring2Geom, neonPurple);
    ring2.rotation.x = Math.PI / 2;
    holoGroup.add(ring2);

    processorHousing.add(holoGroup);
    holoGroup.position.set(0, 5, 0); // Floating above the processor

    updatables.push((time) => {
        tetra.rotation.x = time * 0.3;
        tetra.rotation.y = time * 0.5;
        ring1.rotation.y = time;
        ring1.rotation.x = Math.sin(time) * 0.2;
        ring2.rotation.z = -time * 1.5;
        ring2.scale.setScalar(1.0 + Math.sin(time * 4) * 0.05);
    });

    parts.push({
        name: "Holographic Diagnostic Reticle",
        description: "Projected biometric and telemetry overlay.",
        material: "Photon/Plasma Construct",
        function: "Displays real-time impedance arrays, core thermals, and neuro-synaptic bridging stats.",
        assemblyOrder: 9,
        connections: ["Quantum Neural Processor Housing"],
        failureEffect: "Loss of external diagnostic readouts.",
        cascadeFailures: ["None"],
        originalPosition: holoGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 12, 0)
    });

    // 10-15. Individual High-Detailed Electrodes (Extracted from array for Parts DB)
    for(let k=1; k<=6; k++) {
        parts.push({
            name: `Tonotopic Micro-Node 0${k} (High Frequency)`,
            description: `Ultra-precise platinum/iridium contact ring for high-frequency basilar membrane stimulation.`,
            material: `Platinum, Iridium`,
            function: `Triggers auditory nerve fibers responding to ${16 - k*2} kHz ranges.`,
            assemblyOrder: 9 + k,
            connections: [`Silicone Array Matrix`, `Cochlear Nerve`],
            failureEffect: `Loss of specific high-frequency audio spectrum.`,
            cascadeFailures: [`Adjacent channel cross-talk`],
            originalPosition: new THREE.Vector3(0,-10 - k,-5),
            explodedPosition: new THREE.Vector3(-10 + (k*2), -25, -20)
        });
    }

    // =========================================================================
    // METADATA & DESCRIPTIONS
    // =========================================================================

    const description = "The Cyber Cochlear Micro Array is an ultra-advanced, bio-mechanical neural prosthesis. Moving far beyond traditional hearing aids, this massive multi-stage unit physically hardwires into the temporal bone via a titanium cranial plate, using liquid-cooled quantum logic cores to process environmental acoustics. Power and encrypted audio streams are beamed through the scalp via a macro-induction coil, perfectly aligned by micro-hydraulic pistons. Inside the skull, a hermetically sealed receiver decodes the signal and drives an aggressive 24-channel, multi-spiked spiral electrode array deep into the cochlea, directly hijacking the auditory nerve with multi-spectrum neuro-magnetic pulses. Fully animated, glowing, and heavily mechanized.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Tri-Axial Micro-Hydraulic Actuators?",
            options: [
                "To pump cerebrospinal fluid into the cooling fans.",
                "To continuously adjust the induction coil angle for maximum magnetic flux alignment.",
                "To physically push the electrode array deeper into the cochlea.",
                "To dampen the sound of the internal gears."
            ],
            correctAnswer: 1,
            explanation: "The Tri-Axial Micro-Hydraulic Actuators maintain perfect alignment of the Trans-dermal Induction Transmitter, ensuring flawless power and data coupling through the scalp."
        },
        {
            question: "Why does the electrode array feature Tonotopic spatial mapping?",
            options: [
                "To ensure different audio frequencies stimulate the correct localized areas of the auditory nerve.",
                "To map the topography of the skull for mounting.",
                "To compress the audio files for faster Bluetooth transmission.",
                "To prevent the titanium from oxidizing."
            ],
            correctAnswer: 0,
            explanation: "Tonotopic mapping mimics the natural cochlea, where high frequencies are processed at the base and low frequencies at the apex, allowing precise spectrum recreation."
        },
        {
            question: "What catastrophic failure occurs if the Thermal-Kinetic Dissipation System stops working?",
            options: [
                "The user hears a loud ringing noise.",
                "The battery drains 10% faster.",
                "Processor overheating leading to protective shutdown, core meltdown, or local tissue burns.",
                "The internal magnet reverses polarity."
            ],
            correctAnswer: 2,
            explanation: "The quantum neural processor generates immense heat. Without the copper gears and centrifugal fan, thermal runaway would cause catastrophic tissue damage and core meltdown."
        },
        {
            question: "How is data and power transmitted from the external housing to the implanted receiver?",
            options: [
                "Through a physical wire piercing the skin.",
                "Via Wi-Fi 7 connection directly to the brain.",
                "Through RF magnetic fields projected by the high-flux copper induction array.",
                "Using ultrasonic soundwaves through the skull bone."
            ],
            correctAnswer: 2,
            explanation: "The Trans-dermal Induction Transmitter acts as an electromagnetic coil, coupling with the internal receiver coil through the skin without requiring a permanent physical breach."
        },
        {
            question: "What material comprises the internal wiring of the implanted array to ensure maximum bio-compatibility and conductivity?",
            options: [
                "Aluminum and Bronze",
                "Platinum and Iridium",
                "Carbon Fiber",
                "Lead and Zinc"
            ],
            correctAnswer: 1,
            explanation: "Platinum and Iridium are highly conductive and chemically inert, making them the standard for deep-tissue neural interfaces to prevent galvanic corrosion and tissue rejection."
        }
    ];

    // =========================================================================
    // ANIMATION LOOP
    // =========================================================================
    
    function animate(time, speed, meshes) {
        // Map over the updatables array and pass scaled time
        const scaledTime = time * speed;
        updatables.forEach(updateFn => updateFn(scaledTime));
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCochlearMicroArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
