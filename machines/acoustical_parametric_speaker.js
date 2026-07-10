import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animationUpdaters = [];

    // =========================================================================
    // 1. CUSTOM GOD-TIER HIGH-TECH MATERIALS
    // =========================================================================
    const ultraGlowBlue = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x0055ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const plasmaCoreRed = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff1100,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.8
    });

    const carrierWaveMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const demodulatedAudioMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0022,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff88,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const goldPlating = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.1
    });

    const hazardStripes = new THREE.MeshStandardMaterial({
        color: 0xdddd00,
        roughness: 0.6,
        metalness: 0.1
    });

    // =========================================================================
    // 2. HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // =========================================================================
    function createRibbedCylinder(radius, height, radialSegments, ribs, ribDepth) {
        const geom = new THREE.CylinderGeometry(radius, radius, height, radialSegments, ribs * 2);
        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            // Alternate radius to create ribs
            const segment = Math.floor((y + height / 2) / (height / (ribs * 2)));
            if (segment % 2 === 0 && Math.abs(y) !== height / 2) {
                const x = pos.getX(i);
                const z = pos.getZ(i);
                const len = Math.sqrt(x * x + z * z);
                if (len > 0) {
                    pos.setX(i, (x / len) * (radius - ribDepth));
                    pos.setZ(i, (z / len) * (radius - ribDepth));
                }
            }
        }
        geom.computeVertexNormals();
        return geom;
    }

    function createPipeRing(radius, tubeRadius, segments, count, material) {
        const ringGroup = new THREE.Group();
        const geom = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, radius, 0),
                new THREE.Vector3(radius, 0, 0),
                new THREE.Vector3(0, -radius, 0),
                new THREE.Vector3(-radius, 0, 0)
            ], true),
            segments, tubeRadius, 8, true
        );
        for(let i=0; i<count; i++) {
            const mesh = new THREE.Mesh(geom, material);
            mesh.rotation.x = (Math.PI / count) * i;
            ringGroup.add(mesh);
        }
        return ringGroup;
    }

    function buildTruss(width, height, depth, material) {
        const trussGroup = new THREE.Group();
        const frameGeom = new THREE.BoxGeometry(width, height, depth);
        const frame = new THREE.Mesh(frameGeom, material);
        frame.position.set(0,0,0);
        
        // Inner cross-bracing
        const strutGeom = new THREE.CylinderGeometry(depth*0.3, depth*0.3, Math.sqrt(width*width + height*height), 8);
        const strut1 = new THREE.Mesh(strutGeom, material);
        strut1.rotation.z = Math.atan2(width, height);
        
        const strut2 = new THREE.Mesh(strutGeom, material);
        strut2.rotation.z = -Math.atan2(width, height);

        trussGroup.add(frame);
        trussGroup.add(strut1);
        trussGroup.add(strut2);
        return trussGroup;
    }

    // =========================================================================
    // 3. MAIN MACHINE HIERARCHY
    // =========================================================================
    const masterAnchor = new THREE.Group();
    group.add(masterAnchor);

    const azimuthPlatform = new THREE.Group();
    masterAnchor.add(azimuthPlatform);

    const elevationYoke = new THREE.Group();
    azimuthPlatform.add(elevationYoke);

    const phasedArrayHousing = new THREE.Group();
    elevationYoke.add(phasedArrayHousing);

    // =========================================================================
    // 4. FOUNDATION & MASTER ANCHOR
    // =========================================================================
    const baseShape = new THREE.Shape();
    const baseRadius = 25;
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const r = (i % 2 === 0) ? baseRadius : baseRadius - 2;
        if (i === 0) baseShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else baseShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    const baseExtrude = new THREE.ExtrudeGeometry(baseShape, { depth: 4, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.5, curveSegments: 3 });
    const baseMesh = new THREE.Mesh(baseExtrude, darkSteel);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = 0;
    masterAnchor.add(baseMesh);

    parts.push({
        name: "Hexadecagon Master Foundation Anchor",
        description: "A massive, seismically isolated platform containing the primary terrestrial lock and cooling fluid sumps.",
        material: "Dark Steel and Concrete Matrix",
        function: "Provides absolute stability against the immense recoil of acoustic pressure waves and secures the machine to bedrock.",
        assemblyOrder: 1,
        connections: ["Azimuth Bearing Ring", "Coolant Reservoir"],
        failureEffect: "Catastrophic mechanical sheer and uncontrollable wandering of the acoustic beam.",
        cascadeFailures: ["Azimuth Drive Derailment", "Waveguide Misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // Azimuth Gear Ring
    const azimuthGearGeom = new THREE.TorusGeometry(20, 1.5, 16, 128);
    const azimuthGear = new THREE.Mesh(azimuthGearGeom, steel);
    azimuthGear.rotation.x = -Math.PI / 2;
    azimuthGear.position.y = 5.5;
    masterAnchor.add(azimuthGear);

    // Gear teeth
    for (let i = 0; i < 128; i++) {
        const toothGeom = new THREE.BoxGeometry(2, 2, 4);
        const tooth = new THREE.Mesh(toothGeom, chrome);
        const angle = (i / 128) * Math.PI * 2;
        tooth.position.set(Math.cos(angle) * 20, 5.5, Math.sin(angle) * 20);
        tooth.rotation.y = -angle;
        masterAnchor.add(tooth);
    }

    // =========================================================================
    // 5. AZIMUTH PLATFORM AND YOKE
    // =========================================================================
    const platformGeom = new THREE.CylinderGeometry(21, 21, 2, 64);
    const platform = new THREE.Mesh(platformGeom, aluminum);
    platform.position.y = 7.5;
    azimuthPlatform.add(platform);

    const yokeLeftGroup = new THREE.Group();
    const yokeRightGroup = new THREE.Group();

    // Complex Yoke Arms
    const armShape = new THREE.Shape();
    armShape.moveTo(-5, 0);
    armShape.lineTo(5, 0);
    armShape.lineTo(3, 30);
    armShape.lineTo(-3, 30);
    armShape.lineTo(-5, 0);
    
    const armGeom = new THREE.ExtrudeGeometry(armShape, { depth: 8, bevelEnabled: true });
    
    const armLeft = new THREE.Mesh(armGeom, darkSteel);
    armLeft.position.set(-18, 8.5, -4);
    yokeLeftGroup.add(armLeft);
    
    const armRight = new THREE.Mesh(armGeom, darkSteel);
    armRight.position.set(10, 8.5, -4); // Note depth offset
    yokeRightGroup.add(armRight);

    azimuthPlatform.add(yokeLeftGroup);
    azimuthPlatform.add(yokeRightGroup);

    parts.push({
        name: "Dual Cantilever Yoke Assembly",
        description: "Reinforced asymmetrical arms holding the trunnions of the massive phased array housing.",
        material: "Dark Steel with Titanium Reinforcements",
        function: "Supports the array and channels power and high-pressure hydraulic fluid through internal conduits.",
        assemblyOrder: 2,
        connections: ["Azimuth Platform", "Elevation Trunnions"],
        failureEffect: "Array housing collapses, destroying the transducer matrix.",
        cascadeFailures: ["Hydraulic Line Rupture", "Power Arc Flash"],
        originalPosition: { x: 0, y: 8.5, z: 0 },
        explodedPosition: { x: -30, y: 15, z: 0 }
    });

    // Elevation Trunnions
    const trunnionGeom = new THREE.CylinderGeometry(3, 3, 40, 32);
    const trunnions = new THREE.Mesh(trunnionGeom, chrome);
    trunnions.rotation.z = Math.PI / 2;
    trunnions.position.y = 35;
    azimuthPlatform.add(trunnions);
    
    elevationYoke.position.y = 35; // Center of rotation for elevation

    // =========================================================================
    // 6. HIGH-PRESSURE HYDRAULIC ELEVATION ACTUATORS
    // =========================================================================
    const hydraulicGroup = new THREE.Group();
    const cylinderGeom = new THREE.CylinderGeometry(1.5, 1.5, 20, 16);
    const pistonGeom = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
    
    // We will animate the piston extension
    const leftHydraulic = new THREE.Mesh(cylinderGeom, steel);
    leftHydraulic.position.set(-14, 20, 10);
    leftHydraulic.rotation.x = Math.PI / 4;
    
    const leftPiston = new THREE.Mesh(pistonGeom, chrome);
    leftPiston.position.set(0, 10, 0);
    leftHydraulic.add(leftPiston);
    hydraulicGroup.add(leftHydraulic);

    const rightHydraulic = new THREE.Mesh(cylinderGeom, steel);
    rightHydraulic.position.set(14, 20, 10);
    rightHydraulic.rotation.x = Math.PI / 4;

    const rightPiston = new THREE.Mesh(pistonGeom, chrome);
    rightPiston.position.set(0, 10, 0);
    rightHydraulic.add(rightPiston);
    hydraulicGroup.add(rightHydraulic);

    azimuthPlatform.add(hydraulicGroup);

    parts.push({
        name: "Nano-Precision Hydraulic Actuators",
        description: "Dual massive pistons providing micro-radian precision for elevation targeting of the array.",
        material: "Chrome and High-Carbon Steel",
        function: "Pitches the massive array up and down while absorbing acoustic recoil.",
        assemblyOrder: 3,
        connections: ["Yoke Base", "Phased Array Backplane"],
        failureEffect: "Elevation lock loss; beam drags across unintended targets causing massive localized destruction.",
        cascadeFailures: ["Transducer Feedback Loop", "Structural Decapitation"],
        originalPosition: { x: 0, y: 20, z: 10 },
        explodedPosition: { x: 0, y: 20, z: 40 }
    });

    // =========================================================================
    // 7. MASSIVE PHASED ARRAY HOUSING & BACKPLANE
    // =========================================================================
    // Hexagonal backplane
    const backplaneShape = new THREE.Shape();
    const arrayRadius = 25;
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + (Math.PI / 2);
        if (i === 0) backplaneShape.moveTo(Math.cos(angle) * arrayRadius, Math.sin(angle) * arrayRadius);
        else backplaneShape.lineTo(Math.cos(angle) * arrayRadius, Math.sin(angle) * arrayRadius);
    }
    const backplaneGeom = new THREE.ExtrudeGeometry(backplaneShape, { depth: 4, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5 });
    const backplane = new THREE.Mesh(backplaneGeom, aluminum);
    backplane.position.z = -2;
    phasedArrayHousing.add(backplane);

    // Deep Trusses behind backplane
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const truss = buildTruss(4, 15, 2, darkSteel);
        truss.position.set(Math.cos(angle) * 15, Math.sin(angle) * 15, -6);
        truss.rotation.z = angle + Math.PI / 2;
        truss.rotation.x = Math.PI / 2;
        phasedArrayHousing.add(truss);
    }

    parts.push({
        name: "Hexagonal Acoustic Backplane & Sub-frame",
        description: "The primary structural matrix holding the millions of transducer elements, built from advanced metamaterials to dampen internal resonance.",
        material: "Aerospace Aluminum with Acoustic Metamaterial Damping",
        function: "Provides a perfectly flat, rigid mounting surface for the phased array while sinking thermal load.",
        assemblyOrder: 4,
        connections: ["Elevation Trunnions", "Transducer Modules", "Heat Exchangers"],
        failureEffect: "Array warping, leading to fatal beam divergence and phase cancellation.",
        cascadeFailures: ["Complete Loss of Demodulation Efficiency"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: -30 }
    });

    // =========================================================================
    // 8. MILLION-ELEMENT ULTRASONIC TRANSDUCER MATRIX (Simulated with InstancedMesh)
    // =========================================================================
    // To simulate a god-tier array, we use an InstancedMesh with 10,000 visible clusters.
    const transducerGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 6);
    transducerGeom.rotateX(Math.PI / 2); // Point forward along Z
    
    const transducerCount = 8000;
    const transducerMatrix = new THREE.InstancedMesh(transducerGeom, goldPlating, transducerCount);
    
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let idx = 0;
    
    // Fibonacci spiral for dense packing
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < transducerCount; i++) {
        const t = i / (transducerCount - 1);
        const radius = Math.sqrt(t) * (arrayRadius - 1);
        const theta = i * phi;
        
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        
        // Check if inside hexagon roughly
        dummy.position.set(x, y, 2.2);
        dummy.updateMatrix();
        transducerMatrix.setMatrixAt(i, dummy.matrix);
        
        // Base color gold
        transducerMatrix.setColorAt(i, color.setHex(0xffaa00));
    }
    
    phasedArrayHousing.add(transducerMatrix);

    parts.push({
        name: "Ultra-Density Piezoelectric Transducer Matrix",
        description: "An array of 8,000 visible clusters representing millions of individual nano-piezo emitters capable of 140 dB SPL each.",
        material: "Gold-plated PZT (Lead Zirconate Titanate) and Graphene",
        function: "Generates the heavily amplitude-modulated ultrasonic carrier waves that non-linearly demodulate in the atmosphere.",
        assemblyOrder: 5,
        connections: ["Backplane", "Phase Processors"],
        failureEffect: "Loss of beam coherence, resulting in lethal ultrasonic scatter in all directions.",
        cascadeFailures: ["Operator Vaporization"],
        originalPosition: { x: 0, y: 0, z: 2.2 },
        explodedPosition: { x: 0, y: 0, z: 50 }
    });

    // =========================================================================
    // 9. PHASE CONTROL PROCESSORS & ELECTRONICS RACKS
    // =========================================================================
    const electronicsGroup = new THREE.Group();
    electronicsGroup.position.z = -10;
    
    for(let i=-2; i<=2; i++) {
        for(let j=-2; j<=2; j++) {
            if(Math.abs(i)===2 && Math.abs(j)===2) continue; // skip corners
            const rackGeom = new THREE.BoxGeometry(4, 8, 4);
            const rack = new THREE.Mesh(rackGeom, darkSteel);
            rack.position.set(i * 5, j * 9, 0);
            
            // Glowing processing units inside racks
            const processorGeom = new THREE.BoxGeometry(3.5, 0.5, 3.8);
            for(let k=-3; k<=3; k++) {
                const proc = new THREE.Mesh(processorGeom, screenMat);
                proc.position.set(0, k * 0.8, 0.2);
                rack.add(proc);
            }
            electronicsGroup.add(rack);
        }
    }
    phasedArrayHousing.add(electronicsGroup);

    parts.push({
        name: "Quantum Phase Control Racks",
        description: "Supercomputing clusters that calculate the exact sub-millisecond phase delay for every individual transducer.",
        material: "Dark Steel and Silicon Carbide Electronics",
        function: "Performs real-time digital beam steering and focusing, compensating for atmospheric thermoviscous non-linearities.",
        assemblyOrder: 6,
        connections: ["Transducer Matrix", "Cooling Manifolds"],
        failureEffect: "Beam defocusing; creates massive sonic booms at random points in the atmosphere.",
        cascadeFailures: ["Grid Power Surge"],
        originalPosition: { x: 0, y: 0, z: -10 },
        explodedPosition: { x: 0, y: -50, z: -40 }
    });

    // =========================================================================
    // 10. COOLING MANIFOLDS & PUMPS
    // =========================================================================
    const coolingGroup = new THREE.Group();
    coolingGroup.position.z = -15;

    // Central Reservoir
    const reservoirGeom = new THREE.CylinderGeometry(4, 4, 12, 32);
    const reservoir = new THREE.Mesh(reservoirGeom, glass);
    reservoir.rotation.z = Math.PI / 2;
    coolingGroup.add(reservoir);

    const fluidGeom = new THREE.CylinderGeometry(3.8, 3.8, 11.8, 32);
    const fluid = new THREE.Mesh(fluidGeom, ultraGlowBlue);
    fluid.rotation.z = Math.PI / 2;
    coolingGroup.add(fluid);

    // Pipes weaving through the racks
    const pipeMaterial = copper;
    const paths = [
        [new THREE.Vector3(0,0,0), new THREE.Vector3(10,10,5), new THREE.Vector3(15,-5,8)],
        [new THREE.Vector3(0,0,0), new THREE.Vector3(-10,12,4), new THREE.Vector3(-15,0,8)],
        [new THREE.Vector3(0,0,0), new THREE.Vector3(5,-15,6), new THREE.Vector3(0,-20,10)]
    ];

    paths.forEach((points) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const pipeGeom = new THREE.TubeGeometry(curve, 20, 0.5, 8, false);
        const pipe = new THREE.Mesh(pipeGeom, pipeMaterial);
        coolingGroup.add(pipe);
    });

    phasedArrayHousing.add(coolingGroup);

    parts.push({
        name: "Cryogenic Liquid Coolant Network",
        description: "High-flow copper tubing circulating liquid nitrogen through the processing racks and transducer backplane.",
        material: "Copper Tubing and Borosilicate Glass",
        function: "Prevents the transducer array and phase processors from melting under the extreme multi-megawatt load.",
        assemblyOrder: 7,
        connections: ["Electronics Racks", "Backplane"],
        failureEffect: "Thermal runaway melting the entire array into a puddle of slag.",
        cascadeFailures: ["Cryo-explosion"],
        originalPosition: { x: 0, y: 0, z: -15 },
        explodedPosition: { x: 0, y: 0, z: -80 }
    });

    // =========================================================================
    // 11. OPERATOR CABIN & SAFETY RAILINGS
    // =========================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 1.5, 20); // Situate on the front of azimuth platform
    
    // Deck
    const deckGeom = new THREE.BoxGeometry(10, 0.5, 6);
    const deck = new THREE.Mesh(deckGeom, steel);
    cabinGroup.add(deck);

    // Console Desk
    const deskGeom = new THREE.BoxGeometry(6, 2, 2);
    const desk = new THREE.Mesh(deskGeom, plastic);
    desk.position.set(0, 1.25, -1.5);
    cabinGroup.add(desk);

    // Main Holographic Screen
    const screenMesh = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 0.1), screenMat);
    screenMesh.position.set(0, 3.5, -2);
    screenMesh.rotation.x = -0.1;
    cabinGroup.add(screenMesh);

    // Railings
    const railMat = hazardStripes;
    const postGeom = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    for(let x=-4.8; x<=4.8; x+=2.4) {
        const post = new THREE.Mesh(postGeom, steel);
        post.position.set(x, 1.5, 2.8);
        cabinGroup.add(post);
    }
    const topRailGeom = new THREE.CylinderGeometry(0.15, 0.15, 10, 8);
    const topRail = new THREE.Mesh(topRailGeom, railMat);
    topRail.rotation.z = Math.PI / 2;
    topRail.position.set(0, 3, 2.8);
    cabinGroup.add(topRail);

    azimuthPlatform.add(cabinGroup);

    parts.push({
        name: "Tactical Operations Cabin",
        description: "The primary control station for the array operator, heavily shielded against acoustic backscatter.",
        material: "Steel, Tungsten Shielding, and Hazard Plating",
        function: "Houses the master targeting computer, override switches, and safety locks.",
        assemblyOrder: 8,
        connections: ["Azimuth Platform"],
        failureEffect: "Operator is exposed to 180 dB stray acoustics, resulting in immediate physiological destruction.",
        cascadeFailures: ["Loss of Manual Control"],
        originalPosition: { x: 0, y: 1.5, z: 20 },
        explodedPosition: { x: 0, y: 20, z: 60 }
    });

    // =========================================================================
    // 12. ACOUSTIC WAVE VISUALIZER (THE BEAM)
    // =========================================================================
    const beamGroup = new THREE.Group();
    phasedArrayHousing.add(beamGroup);

    // Central targeting laser
    const laserGeom = new THREE.CylinderGeometry(0.05, 0.05, 1000, 8);
    laserGeom.translate(0, 500, 0); // Origin at bottom
    laserGeom.rotateX(Math.PI / 2); // Point along Z
    const laser = new THREE.Mesh(laserGeom, plasmaCoreRed);
    beamGroup.add(laser);

    // Carrier Wave Rings
    const ringCount = 80;
    const rings = [];
    const ringGeom = new THREE.TorusGeometry(1, 0.1, 8, 64);
    
    for (let i = 0; i < ringCount; i++) {
        const ring = new THREE.Mesh(ringGeom, carrierWaveMat.clone());
        // Initial setup, will be updated in animate
        ring.position.z = i * 10;
        beamGroup.add(ring);
        rings.push(ring);
    }

    // Demodulation Target Zone (The point where non-linear effects create the audio)
    const targetZoneGroup = new THREE.Group();
    const coreGeom = new THREE.SphereGeometry(15, 32, 32);
    const core = new THREE.Mesh(coreGeom, demodulatedAudioMat);
    targetZoneGroup.add(core);

    // Audio shockwaves expanding from target
    const shockRings = [];
    for(let i=0; i<3; i++) {
        const sr = new THREE.Mesh(new THREE.TorusGeometry(15, 1, 16, 64), demodulatedAudioMat.clone());
        targetZoneGroup.add(sr);
        shockRings.push(sr);
    }

    beamGroup.add(targetZoneGroup);

    parts.push({
        name: "Non-Linear Acoustic Beam & Demodulation Zone",
        description: "Visual representation of the ultrasonic carrier wave interacting with the air to produce a highly directional audio beam.",
        material: "Photon/Phonon Visualization (Light & Plasma)",
        function: "Projects a tight beam of silence until the waves intersect and demodulate into a deafening audio signal precisely at the target.",
        assemblyOrder: 9,
        connections: ["Transducer Matrix", "Atmosphere"],
        failureEffect: "Premature demodulation near the array.",
        cascadeFailures: ["Local Structural Shattering"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });


    // =========================================================================
    // 13. QUIZ QUESTIONS (PhD Level)
    // =========================================================================
    const quizQuestions = [
        {
            question: "In the context of non-linear acoustics for a God-Tier parametric array, what role does the Westervelt equation play?",
            options: [
                "It models the generation of difference frequencies due to finite-amplitude sound propagation in a thermoviscous fluid.",
                "It calculates the linear diffraction limits of a low-frequency wave traveling in a vacuum.",
                "It determines the physical resonance frequency of the piezoelectric transducers.",
                "It explains the Doppler shift in an accelerating non-Newtonian medium."
            ],
            correctAnswerIndex: 0,
            explanation: "The Westervelt equation is the fundamental non-linear acoustic equation that accounts for thermoviscous attenuation and non-linearity (B/A), precisely predicting how the high-frequency carrier demodulates into the low-frequency audio beam."
        },
        {
            question: "Why does a parametric array produce a highly directional low-frequency sound beam compared to a conventional loudspeaker of the same size?",
            options: [
                "The low-frequency sound is generated by the virtual array formed by the non-linear interaction of high-frequency carrier waves in the air volume, acting as an extended end-fire array.",
                "The ultrasonic transducers use active noise cancellation to artificially suppress sidelobes.",
                "The high-frequency waves create a physical vacuum tunnel that traps and guides the low-frequency waves.",
                "It uses a physical acoustic horn/waveguide to channel the sound before emission."
            ],
            correctAnswerIndex: 0,
            explanation: "The air itself acts as the speaker. The region where the ultrasonic waves non-linearly interact creates a 'virtual' array that is much longer than the physical speaker, resulting in an end-fire radiation pattern with extreme directivity."
        },
        {
            question: "What limits the conversion efficiency from the primary ultrasonic frequencies to the secondary audio frequency in a parametric speaker?",
            options: [
                "The inherent non-linearity parameter of the medium (B/A ratio) and the shock formation distance of the carrier wave.",
                "The speed of light relative to the speed of sound in the surrounding vacuum.",
                "The diffraction of the primary beams before they can even begin to interact.",
                "The mass of the vibrating cones in the transducers causing inertia lag."
            ],
            correctAnswerIndex: 0,
            explanation: "Conversion efficiency is severely limited by the air's non-linearity parameter (B/A). If amplitude is too high, the wave forms a shock wave (acoustic saturation) and energy is dissipated as heat rather than converted to the difference frequency."
        },
        {
            question: "In a phased array parametric speaker, how is the audio beam steered without physically moving the massive array?",
            options: [
                "By applying calculated sub-millisecond time delays or phase shifts to the amplitude-modulated ultrasonic signals emitted by individual transducer elements, altering the wavefront.",
                "By physically tilting the individual transducer elements using micro-servos.",
                "By selectively muting different sections of the array to change the acoustic center.",
                "By projecting a thermal gradient into the air to bend the sound via refraction."
            ],
            correctAnswerIndex: 0,
            explanation: "Electronic beam steering applies precise delays to each element. By altering the phase relationships of the ultrasonic emission, the combined wavefront can be tilted in any direction, moving the beam at the speed of computation."
        },
        {
            question: "What is the phenomenon called when the finite-amplitude ultrasonic waves distort as they propagate, eventually leading to increased absorption and self-demodulation?",
            options: [
                "Acoustic saturation and shock wave formation.",
                "Linear acoustic dispersion and chromatic aberration.",
                "The inverse piezoelectric cascade effect.",
                "Acoustic impedance mismatch bridging."
            ],
            correctAnswerIndex: 0,
            explanation: "As the high-pressure wave propagates, the peaks travel faster than the troughs due to local density/temperature changes, causing the wave to steepen into a shock wave. This is acoustic saturation, heavily increasing attenuation and enabling demodulation."
        }
    ];

    // =========================================================================
    // 14. EXTREME ANIMATION LOGIC
    // =========================================================================
    
    // We pre-calculate some arrays for instanced mesh updates
    const dummyMatrix = new THREE.Matrix4();
    const instancedColor = new THREE.Color();
    
    // Target distance for the demodulation zone
    let targetDistance = 300;
    
    function animate(delta, speed, meshes) {
        time += delta * speed * 2;

        // 1. Mechanical Sweeping (Azimuth and Elevation)
        // Array tracks a complex Lissajous figure to sweep the target area
        const targetAzimuth = Math.sin(time * 0.5) * 0.8;
        const targetElevation = Math.cos(time * 0.3) * 0.3 + 0.2; // slight upward tilt
        
        azimuthPlatform.rotation.y = targetAzimuth;
        elevationYoke.rotation.x = targetElevation;

        // 2. Hydraulic Piston Synchronization
        // Calculate the extension needed based on yoke rotation
        // A simple approximation: if yoke tilts back (positive X), back cylinders extend, etc.
        const hydraulicExtension = targetElevation * 15; 
        leftPiston.position.y = 10 - hydraulicExtension;
        rightPiston.position.y = 10 - hydraulicExtension;

        // 3. Phased Array Transducer Matrix - Visualizing the Phase Delays
        // The transducers light up in waves reflecting the phase offsets needed to steer/focus the beam
        if (time % 0.1 < 0.05) { // Throttle updates slightly for performance
            for (let i = 0; i < transducerCount; i++) {
                transducerMatrix.getMatrixAt(i, dummyMatrix);
                const pos = new THREE.Vector3().setFromMatrixPosition(dummyMatrix);
                
                // Calculate distance from center to create a sweeping phase ripple
                const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
                const phase = dist * 0.5 - time * 10;
                
                // Intensity peaks when phase matches
                let intensity = (Math.sin(phase) + 1) / 2;
                
                // Add a "steering" gradient based on azimuth/elevation to show beam forming
                const steeringX = pos.x * targetAzimuth * 0.5;
                const steeringY = pos.y * targetElevation * 0.5;
                intensity *= (Math.sin(phase + steeringX + steeringY) + 1) / 2;

                // Interpolate from gold to bright hot white/blue
                instancedColor.setHex(0xffaa00);
                instancedColor.lerp(new THREE.Color(0x00ffff), intensity * 0.8);
                
                transducerMatrix.setColorAt(i, instancedColor);
            }
            transducerMatrix.instanceColor.needsUpdate = true;
        }

        // 4. Acoustic Wave Visualizer (Carrier Wave Propagation)
        // Rings expand outwards and squeeze together (simulating compression/rarefaction and shock formation)
        targetDistance = 250 + Math.sin(time * 0.2) * 100; // Demodulation zone moves back and forth
        
        targetZoneGroup.position.z = targetDistance;
        
        for (let i = 0; i < ringCount; i++) {
            const ring = rings[i];
            // Move rings outward
            let zPos = (time * 150 + i * 15) % 600;
            ring.position.z = zPos;
            
            // As the wave travels, it diffracts linearly (expands)
            const spread = 1 + (zPos * 0.05);
            ring.scale.set(spread, spread, 1);
            
            // Color shifts as it approaches the demodulation zone
            if (zPos < targetDistance) {
                // Ultrasonic Carrier Mode
                ring.material.color.setHex(0x00ffff);
                ring.material.emissive.setHex(0x00aaff);
                ring.material.opacity = 0.15;
            } else {
                // Demodulated Audio Mode (Non-linear breakdown)
                // Represents the scattered audio wave
                ring.material.color.setHex(0xff0055);
                ring.material.emissive.setHex(0xff0022);
                // Fades out rapidly past target
                const decay = Math.max(0, 1 - ((zPos - targetDistance) / 100));
                ring.material.opacity = 0.4 * decay;
                
                // Explodes in size as audio diffuses widely compared to the tight ultrasonic beam
                ring.scale.set(spread * 3 * (1-decay+1), spread * 3 * (1-decay+1), 1);
            }
        }

        // 5. Demodulation Core Effects
        core.scale.setScalar(1 + Math.sin(time * 20) * 0.2); // Core pulsing with low frequency audio
        
        // Shockwave rings expanding from the core
        for (let i = 0; i < shockRings.length; i++) {
            const sr = shockRings[i];
            let sScale = ((time * 5 + i * (Math.PI*2/3)) % 5);
            sr.scale.setScalar(sScale);
            sr.material.opacity = Math.max(0, 1 - (sScale / 5));
        }
        
        // 6. Fluid Cooling Flow
        // Rotate the fluid texture or adjust emissive to simulate flow
        fluid.material.emissiveIntensity = 5.0 + Math.sin(time * 10) * 2.0;
        screenMesh.material.emissiveIntensity = 1.5 + Math.random() * 0.5; // Flicker screens
    }

    return {
        group,
        parts,
        description: "The Ultra God-Tier Parametric Speaker: A phased array of millions of transducers exploiting the non-linear thermoviscous properties of the atmosphere to project deafening, pinpoint-accurate audio beams across vast distances. Features dynamic quantum phase steering, cryogenic cooling, and real-time wave demodulation visualization.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createParametricArraySpeaker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
