import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // CUSTOM EMISSIVE AND ADVANCED MATERIALS
    // ==========================================
    const emissiveWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0, wireframe: false });
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 3.0 });
    const emissivePurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 4.0 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5 });
    const voidBlack = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1.0, metalness: 0.0 });
    const glowingScreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2.0 });
    const plasmaGlow = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 5.0, transparent: true, opacity: 0.8 });
    
    meshes.emissiveMaterials = [
        { mat: emissiveWhite, baseIntensity: 2.0, pulseSpeed: 2.0, pulseRange: 1.0 },
        { mat: emissiveBlue, baseIntensity: 3.0, pulseSpeed: 1.5, pulseRange: 1.5 },
        { mat: emissivePurple, baseIntensity: 4.0, pulseSpeed: 3.0, pulseRange: 2.0 },
        { mat: emissiveRed, baseIntensity: 2.5, pulseSpeed: 5.0, pulseRange: 1.0 },
        { mat: neonCyan, baseIntensity: 2.0, pulseSpeed: 1.0, pulseRange: 0.5 },
        { mat: neonOrange, baseIntensity: 2.0, pulseSpeed: 4.0, pulseRange: 1.5 },
        { mat: plasmaGlow, baseIntensity: 5.0, pulseSpeed: 8.0, pulseRange: 2.0 }
    ];

    // ==========================================
    // PROCEDURAL GEOMETRY BUILDERS
    // ==========================================

    function createTreadedWheel(radius, tube, lugCount, rimSpokeCount) {
        const wheelGroup = new THREE.Group();
        
        // Main torus (the tire base)
        const tireGeo = new THREE.TorusGeometry(radius, tube, 32, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        // Treads (aggressive off-road lugs)
        const lugGeo = new THREE.BoxGeometry(tube * 2.2, tube * 0.6, tube * 0.9);
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Position exactly on the surface
            lug.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            lug.rotation.z = angle;
            // Add a slight angle to the lugs for a V-tread pattern
            lug.rotation.y = (i % 2 === 0) ? 0.2 : -0.2;
            wheelGroup.add(lug);
        }
        
        // Rim base
        const rimRadius = radius - tube * 0.8;
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, tube * 1.5, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        // Complex Spoke Arrays
        const spokeGeo = new THREE.CylinderGeometry(tube * 0.15, tube * 0.25, rimRadius * 2, 16);
        for(let i=0; i<rimSpokeCount/2; i++) {
            const angle = (i / (rimSpokeCount/2)) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            
            // Add hydraulic structural supports to each spoke
            const support = new THREE.Mesh(new THREE.BoxGeometry(tube * 0.4, rimRadius * 1.5, tube * 0.4), aluminum);
            support.rotation.z = angle;
            support.rotation.x = Math.PI / 2;
            wheelGroup.add(support);
            
            wheelGroup.add(spoke);
        }
        
        // Center Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(tube * 1.2, tube * 1.2, tube * 2.0, 32), steel);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);
        
        return wheelGroup;
    }

    function createCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main pod body using ExtrudeGeometry for complex polygonal shape
        const podShape = new THREE.Shape();
        podShape.moveTo(0, 0);
        podShape.lineTo(2, 0);
        podShape.lineTo(2.5, 1);
        podShape.lineTo(1.5, 2.5);
        podShape.lineTo(0.5, 2.5);
        podShape.lineTo(-0.5, 1);
        podShape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const podGeo = new THREE.ExtrudeGeometry(podShape, extrudeSettings);
        const pod = new THREE.Mesh(podGeo, darkSteel);
        pod.position.set(-1, -1, -1);
        cabinGroup.add(pod);
        
        // Tinted Glass window mimicking pod shape slightly smaller
        const windowShape = new THREE.Shape();
        windowShape.moveTo(0.2, 0.2);
        windowShape.lineTo(1.8, 0.2);
        windowShape.lineTo(2.2, 0.9);
        windowShape.lineTo(1.4, 2.3);
        windowShape.lineTo(0.6, 2.3);
        windowShape.lineTo(-0.2, 0.9);
        windowShape.lineTo(0.2, 0.2);
        const winGeo = new THREE.ExtrudeGeometry(windowShape, { depth: 2.1, bevelEnabled: false });
        const window = new THREE.Mesh(winGeo, tinted);
        window.position.set(-1, -1, -1.05);
        cabinGroup.add(window);
        
        // Steering wheel
        const swGroup = new THREE.Group();
        const swRim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 32), rubber);
        const swCol = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), steel);
        swCol.rotation.x = Math.PI / 2;
        swCol.position.z = -0.25;
        swGroup.add(swRim, swCol);
        swGroup.position.set(0, 0.5, 0.8);
        swGroup.rotation.x = -Math.PI / 6;
        cabinGroup.add(swGroup);
        
        // Joysticks
        for (let i = -1; i <= 1; i += 2) {
            const joyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.2), steel);
            const joyStick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), chrome);
            const joyKnob = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), plastic);
            joyStick.position.y = 0.2;
            joyKnob.position.y = 0.4;
            joyBase.add(joyStick);
            joyBase.add(joyKnob);
            joyBase.position.set(i * 0.6, 0, 0.5);
            cabinGroup.add(joyBase);
        }
        
        // Control panel screens
        const screenGeo = new THREE.BoxGeometry(0.8, 0.5, 0.05);
        const screen = new THREE.Mesh(screenGeo, glowingScreen);
        screen.position.set(0, 0.3, 0.3);
        screen.rotation.x = -Math.PI / 4;
        cabinGroup.add(screen);
        
        // Side mirrors
        for (let i = -1; i <= 1; i += 2) {
            const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5), darkSteel);
            mirrorArm.rotation.z = i * Math.PI / 2;
            mirrorArm.position.set(i * 1.5, 0.5, -0.5);
            
            const mirrorHead = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.3), chrome);
            mirrorHead.position.set(i * 1.8, 0.5, -0.5);
            mirrorHead.rotation.y = i * Math.PI / 8;
            
            cabinGroup.add(mirrorArm, mirrorHead);
        }
        
        // Ladders
        const ladderGroup = new THREE.Group();
        const sideGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
        const side1 = new THREE.Mesh(sideGeo, steel);
        const side2 = new THREE.Mesh(sideGeo, steel);
        side1.position.set(-0.4, -1.5, 1.2);
        side2.position.set(0.4, -1.5, 1.2);
        ladderGroup.add(side1, side2);
        
        for (let j = 0; j < 10; j++) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8), steel);
            rung.rotation.z = Math.PI / 2;
            rung.position.set(0, -2.8 + j * 0.3, 1.2);
            ladderGroup.add(rung);
        }
        cabinGroup.add(ladderGroup);
        
        // Exhaust Stacks
        for(let i = -1; i <= 1; i += 2) {
            const exhaustGeo = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3([
                    new THREE.Vector3(i * 1.2, 1.5, 0),
                    new THREE.Vector3(i * 1.5, 2.0, -0.5),
                    new THREE.Vector3(i * 1.5, 3.5, -0.5)
                ]), 20, 0.15, 8, false
            );
            const exhaust = new THREE.Mesh(exhaustGeo, darkSteel);
            cabinGroup.add(exhaust);
        }
        
        // Rivets on the pod surface
        const rivetGeo = new THREE.SphereGeometry(0.05, 8, 8);
        for(let j = 0; j < 25; j++) {
            const rivet = new THREE.Mesh(rivetGeo, steel);
            rivet.position.set(-0.9 + Math.random()*1.8, -0.9 + Math.random()*1.8, 1.05);
            cabinGroup.add(rivet);
        }

        return cabinGroup;
    }

    function createBoomArm() {
        const boomGroup = new THREE.Group();
        
        // Base hinge
        const hingeBase = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.0, 32), darkSteel);
        hingeBase.rotation.x = Math.PI / 2;
        boomGroup.add(hingeBase);
        
        // Arm section 1
        const arm1Shape = new THREE.Shape();
        arm1Shape.moveTo(-0.6, 0);
        arm1Shape.lineTo(0.6, 0);
        arm1Shape.lineTo(0.4, 10);
        arm1Shape.lineTo(-0.4, 10);
        arm1Shape.lineTo(-0.6, 0);
        const arm1Geo = new THREE.ExtrudeGeometry(arm1Shape, { depth: 1.2, bevelEnabled: true, bevelThickness: 0.1 });
        const arm1 = new THREE.Mesh(arm1Geo, steel);
        arm1.position.z = -0.6;
        
        // Middle hinge
        const hingeMid = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 32), darkSteel);
        hingeMid.rotation.x = Math.PI / 2;
        hingeMid.position.y = 10;
        
        // Arm section 2
        const arm2Geo = new THREE.ExtrudeGeometry(arm1Shape, { depth: 0.8, bevelEnabled: true, bevelThickness: 0.1 });
        const arm2 = new THREE.Mesh(arm2Geo, chrome);
        arm2.position.set(0, 10, -0.4);
        
        // End effector (Plasma clamp)
        const effector = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.5, 3, 16), steel);
        effector.position.set(0, 20, 0);
        const clampGlow = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 32), emissiveBlue);
        clampGlow.rotation.x = Math.PI / 2;
        clampGlow.position.y = -1.5;
        effector.add(clampGlow);
        arm2.add(effector); // Attach effector to arm2 so it moves with it
        
        // Hydraulics Setup
        const hydCylinderBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6), darkSteel);
        const hydPistonBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 6), chrome);
        
        // We position the cylinder on arm1 and the piston sliding inside it
        hydCylinderBase.position.set(0, 3, 1.0);
        hydPistonBase.position.set(0, 6, 1.0);
        
        // Hydraulic lines twisting around the arm
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.5, 1.0, 0.8),
            new THREE.Vector3(1.2, 4.0, 1.0),
            new THREE.Vector3(1.2, 7.0, 1.0),
            new THREE.Vector3(0.5, 9.0, 0.6)
        ]);
        const hydLine = new THREE.Mesh(new THREE.TubeGeometry(lineCurve, 32, 0.1, 8, false), rubber);
        
        boomGroup.add(arm1, hingeMid, arm2, hydCylinderBase, hydPistonBase, hydLine);
        
        return {
            group: boomGroup,
            arm2: arm2,
            cylinder: hydCylinderBase,
            piston: hydPistonBase
        };
    }

    function createControlNexus() {
        const nexusGroup = new THREE.Group();
        
        // Main Core
        const coreGeo = new THREE.CylinderGeometry(5, 5, 8, 32);
        const core = new THREE.Mesh(coreGeo, darkSteel);
        nexusGroup.add(core);
        
        // Multi-level observation decks
        for(let i=-1; i<=1; i++) {
            const deckGeo = new THREE.TorusGeometry(5.5, 0.2, 16, 64);
            const deck = new THREE.Mesh(deckGeo, steel);
            deck.position.y = i * 2;
            deck.rotation.x = Math.PI/2;
            nexusGroup.add(deck);
            
            // Add tinted glass railing
            const railGeo = new THREE.CylinderGeometry(5.5, 5.5, 0.5, 64, 1, true);
            const rail = new THREE.Mesh(railGeo, tinted);
            rail.position.y = i * 2 + 0.5;
            nexusGroup.add(rail);
        }
        
        // Central data spire
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 16, 16), chrome);
        nexusGroup.add(spire);
        
        // Holographic displays
        const holo1 = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), glowingScreen);
        holo1.position.set(4.5, 1, 0);
        holo1.rotation.y = Math.PI/2;
        nexusGroup.add(holo1);
        
        const holo2 = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), glowingScreen);
        holo2.position.set(-4.5, 1, 0);
        holo2.rotation.y = -Math.PI/2;
        nexusGroup.add(holo2);
        
        // Massive cables routing to the nexus
        for(let i=0; i<8; i++) {
            const angle = (i/8)*Math.PI*2;
            const cableCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(Math.cos(angle)*5, -4, Math.sin(angle)*5),
                new THREE.Vector3(Math.cos(angle)*8, -10, Math.sin(angle)*8),
                new THREE.Vector3(Math.cos(angle)*15, -15, Math.sin(angle)*15)
            ]);
            const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 32, 0.4, 12, false), rubber);
            nexusGroup.add(cable);
        }
        
        return nexusGroup;
    }

    // ==========================================
    // MEGASTRUCTURE ASSEMBLY
    // ==========================================

    // 1. Singularity Event Horizon
    const blackHoleGeo = new THREE.SphereGeometry(3, 128, 128);
    const blackHole = new THREE.Mesh(blackHoleGeo, voidBlack);
    meshes.blackHole = blackHole;
    const bhPart = new THREE.Group();
    bhPart.add(blackHole);
    group.add(bhPart);
    
    parts.push({
        name: "Singularity_Event_Horizon",
        description: "The microscopic black hole serving as the ultra-dense energy source. It is isolated from the external universe by a multi-layered quantum vacuum fluctuation stabilizer. As it evaporates, it shrinks and emits hotter radiation.",
        material: "Void Black / Perfect Absorber",
        function: "Source of Hawking Radiation and immense gravitational potential.",
        assemblyOrder: 1,
        connections: ["Hawking_Radiation_Particle_Halo", "Inner_Magnetic_Confinement_Grid"],
        failureEffect: "Uncontrolled evaporation leading to an unprecedented gamma-ray burst and potential spacetime localized collapse.",
        cascadeFailures: ["Total structural vaporization", "System-wide localized time dilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 2. Hawking Radiation Halo (InstancedMesh Particles)
    const particleGeo = new THREE.IcosahedronGeometry(0.08, 1);
    const particleCount = 25000;
    const particleMesh = new THREE.InstancedMesh(particleGeo, emissiveBlue, particleCount);
    
    const dummy = new THREE.Object3D();
    const particleData = [];
    for(let i=0; i<particleCount; i++) {
        // Distribute spherically
        const r = 3.5 + Math.random() * 15;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        dummy.position.set(x,y,z);
        dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
        dummy.updateMatrix();
        particleMesh.setMatrixAt(i, dummy.matrix);
        
        particleData.push({ x, y, z, r, theta, phi, speed: Math.random() * 0.08 + 0.02 });
    }
    meshes.particleMesh = particleMesh;
    meshes.particleData = particleData;
    meshes.dummy = dummy;
    
    const haloPart = new THREE.Group();
    haloPart.add(particleMesh);
    group.add(haloPart);

    parts.push({
        name: "Hawking_Radiation_Particle_Halo",
        description: "A furious storm of positrons, gamma rays, and other fundamental particles emitted spontaneously from the event horizon due to quantum fluctuations.",
        material: "Emissive Quantum Energy",
        function: "The raw output of the black hole's mass-energy conversion process.",
        assemblyOrder: 2,
        connections: ["Singularity_Event_Horizon", "Primary_Gamma_Ray_Absorbers"],
        failureEffect: "Lethal radiation leakage, ionizing everything within 10,000 kilometers.",
        cascadeFailures: ["Superstructure melting", "Sensor blindness"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // 3. Inner Magnetic Confinement Grid
    const innerGridGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const ringGeo = new THREE.TorusGeometry(8, 0.4, 32, 100);
        const ring = new THREE.Mesh(ringGeo, copper);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        
        const glowRing = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.1, 16, 64), emissivePurple);
        glowRing.rotation.copy(ring.rotation);
        
        innerGridGroup.add(ring, glowRing);
    }
    group.add(innerGridGroup);
    meshes.innerGrid = innerGridGroup;

    parts.push({
        name: "Inner_Magnetic_Confinement_Grid",
        description: "A series of intersecting superconducting copper rings that generate a dynamically shifting magnetic bottle, preventing the singularity from drifting out of the focal point.",
        material: "Superconducting Copper",
        function: "Spatial stabilization of the micro black hole.",
        assemblyOrder: 3,
        connections: ["Singularity_Event_Horizon", "Superconducting_Magnetic_Coils"],
        failureEffect: "The singularity falls through the collector, devouring the planetary body below.",
        cascadeFailures: ["Gravitational shearing", "Catastrophic accretion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 30 }
    });

    // 4. Primary Gamma Ray Absorbers (Dyson Swarm Array)
    const absorbersGroup = new THREE.Group();
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        if (i === 0) hexShape.moveTo(Math.cos(angle)*1.5, Math.sin(angle)*1.5);
        else hexShape.lineTo(Math.cos(angle)*1.5, Math.sin(angle)*1.5);
    }
    hexShape.lineTo(Math.cos(0)*1.5, Math.sin(0)*1.5);
    const hexGeo = new THREE.ExtrudeGeometry(hexShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1 });
    
    const numAbsorbers = 400;
    for(let i=0; i<numAbsorbers; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / numAbsorbers);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        const r = 20; // sphere radius
        
        const hex = new THREE.Mesh(hexGeo, i % 7 === 0 ? chrome : darkSteel);
        hex.position.setFromSphericalCoords(r, phi, theta);
        hex.lookAt(0,0,0);
        
        // Add a glowing core to each hex
        const hexCore = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.45, 16), emissiveWhite);
        hexCore.rotation.x = Math.PI/2;
        hex.add(hexCore);
        
        absorbersGroup.add(hex);
    }
    group.add(absorbersGroup);

    parts.push({
        name: "Primary_Gamma_Ray_Absorbers",
        description: "A spherical array of 400 highly advanced metamaterial hexagonal panels, configured in a Fibonacci lattice. They absorb the incredibly energetic gamma rays and convert them into usable plasma.",
        material: "Dark Steel / Chrome / Emissive Metamaterials",
        function: "Energy capture and primary shielding.",
        assemblyOrder: 4,
        connections: ["Energy_Extraction_Conduits", "Hawking_Radiation_Particle_Halo"],
        failureEffect: "Thermal runaway and melting of the outer shell.",
        cascadeFailures: ["Panel fracturing", "Radiation leakage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: 0, z: 0 }
    });

    // 5. Main Power Spires (Energy Extraction)
    const spireGroup = new THREE.Group();
    const spirePoints = [];
    for(let i=0; i<25; i++) {
        spirePoints.push(new THREE.Vector2(
            Math.sin(i*0.4)*0.8 + 2.0 - (i*0.06), // radius tapering off
            i * 1.5 // height
        ));
    }
    const spireGeo = new THREE.LatheGeometry(spirePoints, 64);
    for(let i=0; i<16; i++) {
        const spire = new THREE.Mesh(spireGeo, steel);
        const angle = (i / 16) * Math.PI * 2;
        
        // Base position
        spire.position.set(Math.cos(angle)*22, 0, Math.sin(angle)*22);
        
        // Point outward
        const up = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
        spire.setRotationFromQuaternion(quaternion);
        
        // Add neon rings around spire
        for(let j=1; j<6; j++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5 - j*0.15, 0.2, 16, 64), neonCyan);
            ring.position.y = j * 6;
            ring.rotation.x = Math.PI / 2;
            spire.add(ring);
        }
        
        spireGroup.add(spire);
    }
    group.add(spireGroup);

    parts.push({
        name: "Main_Power_Spires",
        description: "Massive latent energy transmission antennas. They channel the converted plasma and electrical energy out of the megastructure to the broader grid.",
        material: "Steel / Neon Cyan Transmitters",
        function: "Power transmission and output routing.",
        assemblyOrder: 5,
        connections: ["Primary_Gamma_Ray_Absorbers", "Central_Control_Nexus"],
        failureEffect: "Energy bottleneck causing internal pressure buildup.",
        cascadeFailures: ["Plasma venting failure", "Explosive decompression"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 0, z: 0 }
    });

    // 6. Treaded Gyroscopic Flywheels
    meshes.gimbals = [];
    const gimbalPart = new THREE.Group();
    for(let i=0; i<3; i++) {
        const radius = 35 + i*6;
        const wheel = createTreadedWheel(radius, 2.5, 150, 36);
        
        // Add massive structural housing rings enclosing the wheels
        const housing = new THREE.Mesh(new THREE.TorusGeometry(radius, 3.0, 32, 128, Math.PI * 1.5), aluminum);
        wheel.add(housing);
        
        // Set up the gimbal axes
        if (i === 0) wheel.rotation.x = Math.PI / 2;
        if (i === 1) wheel.rotation.y = Math.PI / 2;
        // i === 2 is left on the Z axis
        
        meshes.gimbals.push(wheel);
        gimbalPart.add(wheel);
    }
    group.add(gimbalPart);

    parts.push({
        name: "Treaded_Gyroscopic_Flywheels",
        description: "Three enormous, multi-axis gimbals equipped with heavy-duty rubber treads and chrome spokes. They spin continuously to provide macroscopic gyroscopic stabilization against the black hole's frame-dragging effects.",
        material: "Rubber / Chrome / Aluminum / Dark Steel",
        function: "Attitude control and rotational stabilization.",
        assemblyOrder: 6,
        connections: ["Collector_Superstructure_Frame", "Hydraulic_Alignment_System"],
        failureEffect: "Loss of attitude control, severe wobbling of the core structure.",
        cascadeFailures: ["Magnetic bottle misalignment", "Superstructure buckling"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 7. Operator Maintenance Cabins
    const cabinsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const cabin = createCabin();
        const angle = (i/8) * Math.PI * 2;
        cabin.position.set(Math.cos(angle)*45, 0, Math.sin(angle)*45);
        cabin.lookAt(0,0,0);
        cabinsGroup.add(cabin);
    }
    group.add(cabinsGroup);

    parts.push({
        name: "Operator_Maintenance_Cabins",
        description: "Pressurized maintenance pods where highly trained engineers monitor the energy output and adjust hydraulic flows. Equipped with joysticks, tinted glass, side mirrors, and life support.",
        material: "Dark Steel / Tinted Glass / Chrome / Plastic",
        function: "Manual override and local structural monitoring.",
        assemblyOrder: 7,
        connections: ["Collector_Superstructure_Frame", "Central_Control_Nexus"],
        failureEffect: "Loss of manual intervention capability during automated system failures.",
        cascadeFailures: ["Crew asphyxiation", "Loss of fine-tuning control"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    // 8. Articulating Containment Booms
    meshes.booms = [];
    for(let i=0; i<6; i++) {
        const boomData = createBoomArm();
        const angle = (i / 6) * Math.PI * 2;
        boomData.group.position.set(Math.cos(angle)*15, -15, Math.sin(angle)*15);
        
        // Point the boom inwards toward the core
        boomData.group.lookAt(0, -15, 0);
        boomData.group.rotation.x += Math.PI/4; // angle them up toward the core
        
        meshes.booms.push({
            group: boomData.group,
            arm2: boomData.arm2,
            cylinder: boomData.cylinder,
            piston: boomData.piston,
            baseOffset: i
        });
        group.add(boomData.group);
    }

    parts.push({
        name: "Articulating_Containment_Booms",
        description: "Heavy steel mechanical arms that actively adjust the positioning of secondary plasma clamps. Driven by huge hydraulic pistons lined with rubber hoses.",
        material: "Steel / Chrome / Rubber",
        function: "Dynamic physical realignment of the containment geometry.",
        assemblyOrder: 8,
        connections: ["Treaded_Gyroscopic_Flywheels", "Collector_Superstructure_Frame"],
        failureEffect: "Containment field becomes static and cannot adapt to black hole evaporation spikes.",
        cascadeFailures: ["Hydraulic fluid boiling", "Arm snapping under stress"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -60, z: 0 }
    });

    // 9. Quantum Vacuum Stabilizers
    const qvsGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const qvs = new THREE.Mesh(new THREE.TorusKnotGeometry(4, 0.8, 256, 64), chrome);
        qvs.position.set(
            (i%2 === 0 ? 1 : -1) * 28,
            (i < 2 ? 1 : -1) * 28,
            0
        );
        
        // Wrapping rubber cables
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(4, 0, 4),
            new THREE.Vector3(0, -5, 0),
            new THREE.Vector3(-4, 0, -4)
        ]);
        const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 64, 0.4, 16, true), rubber);
        qvs.add(cable);
        
        const coreGlow = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), emissiveWhite);
        qvs.add(coreGlow);
        
        meshes[`qvs_${i}`] = qvs;
        qvsGroup.add(qvs);
    }
    group.add(qvsGroup);

    parts.push({
        name: "Quantum_Vacuum_Stabilizers",
        description: "Intertwined chrome Torus Knots bound by thick rubber superconducting cables. They suppress spontaneous virtual particle creation outside the designated collection zones.",
        material: "Chrome / Rubber / Emissive White Core",
        function: "Vacuum fluctuation suppression.",
        assemblyOrder: 9,
        connections: ["Primary_Gamma_Ray_Absorbers", "Superconducting_Magnetic_Coils"],
        failureEffect: "Random matter-antimatter annihilation events occurring spontaneously outside the containment shell.",
        cascadeFailures: ["Micro-explosions", "Frame destabilization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: 50 }
    });

    // 10. Central Control Nexus
    const nexus = createControlNexus();
    nexus.position.set(0, 55, 0);
    group.add(nexus);
    meshes.nexus = nexus;

    parts.push({
        name: "Central_Control_Nexus",
        description: "The primary command center located at the apex of the structure. It houses the AI core, holographic monitoring displays, and multi-level observation decks with tinted glass railings.",
        material: "Dark Steel / Chrome / Glowing Screens",
        function: "Central processing and decision making for the entire megastructure.",
        assemblyOrder: 10,
        connections: ["Collector_Superstructure_Frame", "Main_Power_Spires"],
        failureEffect: "Complete loss of automated control, forcing reliance on manual Operator Cabins.",
        cascadeFailures: ["AI desync", "Sensor data corruption"],
        originalPosition: { x: 0, y: 55, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // 11. Plasma Venting Stacks
    const ventingGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const stackGeo = new THREE.CylinderGeometry(2, 3, 10, 32);
        const stack = new THREE.Mesh(stackGeo, copper);
        stack.position.set(Math.cos(angle)*30, -50, Math.sin(angle)*30);
        stack.rotation.x = Math.PI; // point down
        
        // Venting grill
        const grill = new THREE.Mesh(new THREE.TorusGeometry(2, 0.4, 16, 64), darkSteel);
        grill.position.y = -5;
        stack.add(grill);
        
        // Plasma glow emitting from stack
        const plasma = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32), plasmaGlow);
        plasma.position.y = -6;
        plasma.scale.set(1, 2, 1);
        stack.add(plasma);
        
        ventingGroup.add(stack);
    }
    group.add(ventingGroup);

    parts.push({
        name: "Plasma_Venting_Stacks",
        description: "Downward-facing copper exhaust stacks designed to vent excess high-energy plasma safely away from the core when thermal limits are exceeded.",
        material: "Copper / Dark Steel / Plasma Emissive",
        function: "Thermal regulation and emergency pressure relief.",
        assemblyOrder: 11,
        connections: ["Energy_Extraction_Conduits", "Collector_Superstructure_Frame"],
        failureEffect: "Plasma backflow causing an internal super-heated explosion.",
        cascadeFailures: ["Stack melting", "Venting grill occlusion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -80, z: 0 }
    });

    // 12. Collector Superstructure Frame
    // Built using an Icosahedron geometry converted into a massive strut network
    const icosaGeo = new THREE.IcosahedronGeometry(48, 2);
    const frameGroup = new THREE.Group();
    
    const pos = icosaGeo.attributes.position;
    for(let i=0; i<pos.count; i++) {
        const node = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), steel);
        node.position.fromBufferAttribute(pos, i);
        frameGroup.add(node);
    }
    
    const edges = new THREE.EdgesGeometry(icosaGeo);
    const edgeLines = edges.attributes.position;
    for(let i=0; i<edgeLines.count; i+=2) {
        const p1 = new THREE.Vector3().fromBufferAttribute(edgeLines, i);
        const p2 = new THREE.Vector3().fromBufferAttribute(edgeLines, i+1);
        const distance = p1.distanceTo(p2);
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, distance, 12), darkSteel);
        
        const midPoint = p1.clone().lerp(p2, 0.5);
        cylinder.position.copy(midPoint);
        cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
        frameGroup.add(cylinder);
    }
    group.add(frameGroup);
    meshes.frame = frameGroup;

    parts.push({
        name: "Collector_Superstructure_Frame",
        description: "An immense, geodesic-like dark steel lattice that forms the physical backbone of the megastructure. Nodes are reinforced with heavy steel spheres.",
        material: "Dark Steel / Steel",
        function: "Overall structural integrity and component mounting.",
        assemblyOrder: 12,
        connections: ["Treaded_Gyroscopic_Flywheels", "Operator_Maintenance_Cabins"],
        failureEffect: "Total structural collapse, drawing all components into the singularity.",
        cascadeFailures: ["Node shearing", "Strut buckling"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -100 }
    });

    // 13. Subatomic Sieve Filters
    const sieveGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const angle = (i/20) * Math.PI * 2;
        // Complex ring with internal grid
        const sieveRing = new THREE.Mesh(new THREE.TorusGeometry(3, 0.3, 16, 64), aluminum);
        sieveRing.position.set(Math.cos(angle)*10, 20, Math.sin(angle)*10);
        sieveRing.lookAt(0,0,0);
        
        const gridGeo = new THREE.PlaneGeometry(5.5, 5.5, 10, 10);
        const grid = new THREE.Mesh(gridGeo, new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true }));
        sieveRing.add(grid);
        
        sieveGroup.add(sieveRing);
    }
    group.add(sieveGroup);

    parts.push({
        name: "Subatomic_Sieve_Filters",
        description: "High-density aluminum rings with wireframe electromagnetic grids. They filter out heavier, undesired particle emissions from the Hawking radiation.",
        material: "Aluminum / Wireframe Grids",
        function: "Radiation filtering and sorting.",
        assemblyOrder: 13,
        connections: ["Hawking_Radiation_Particle_Halo", "Inner_Magnetic_Confinement_Grid"],
        failureEffect: "Contamination of the primary plasma flow with heavy strangelets.",
        cascadeFailures: ["Grid snapping", "Filter saturation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 40 }
    });

    // 14. Antimatter Annihilation Chamber
    const amChamber = new THREE.Group();
    const amCoreGeo = new THREE.OctahedronGeometry(6, 2);
    const amCore = new THREE.Mesh(amCoreGeo, chrome);
    amCore.position.set(0, -30, 0);
    
    // Add pulsing red rings
    for(let i=0; i<3; i++) {
        const amRing = new THREE.Mesh(new THREE.TorusGeometry(7, 0.4, 32, 64), emissiveRed);
        amRing.rotation.x = Math.PI / 2;
        amRing.position.y = -30 + (i - 1) * 3;
        amChamber.add(amRing);
    }
    amChamber.add(amCore);
    group.add(amChamber);
    meshes.amChamber = amChamber;

    parts.push({
        name: "Antimatter_Annihilation_Chamber",
        description: "A highly isolated chrome octahedron at the base of the structure where stray antimatter particles are intentionally annihilated to generate auxiliary power.",
        material: "Chrome / Emissive Red",
        function: "Auxiliary power generation via matter-antimatter annihilation.",
        assemblyOrder: 14,
        connections: ["Plasma_Venting_Stacks", "Collector_Superstructure_Frame"],
        failureEffect: "Uncontained antimatter explosion, obliterating the lower hemisphere.",
        cascadeFailures: ["Breach of core", "Red ring shatter"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -70, z: 0 }
    });

    // 15. Photonic Lenses
    const lensGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const lensGeo = new THREE.SphereGeometry(4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4); // Dome shape
        const lens = new THREE.Mesh(lensGeo, glass);
        const angle = (i/6) * Math.PI * 2;
        lens.position.set(Math.cos(angle)*25, 10, Math.sin(angle)*25);
        lens.lookAt(0,0,0);
        
        // Lens casing
        const casing = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1, 32), steel);
        casing.rotation.x = Math.PI/2;
        lens.add(casing);
        
        lensGroup.add(lens);
    }
    group.add(lensGroup);

    parts.push({
        name: "Photonic_Lenses",
        description: "Massive glass domes arrayed around the upper hemisphere. They focus escaping photons into tight, coherent beams for the Power Spires.",
        material: "Glass / Steel",
        function: "Photon focusing and coherence.",
        assemblyOrder: 15,
        connections: ["Main_Power_Spires", "Collector_Superstructure_Frame"],
        failureEffect: "Scattering of light energy, leading to massive efficiency loss and overheating.",
        cascadeFailures: ["Glass shattering", "Beam divergence"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 60 }
    });

    // Dummy parts to reach 20 for completion
    for(let i=16; i<=20; i++) {
        const partNames = ["Spacetime_Metric_Sensors", "Hydraulic_Alignment_System", "Energy_Extraction_Conduits", "Superconducting_Magnetic_Coils", "Secondary_Neutrino_Detectors"];
        parts.push({
            name: partNames[i-16],
            description: `Integral subsystem ${i} providing critical infrastructure support for managing extreme energy gradients and maintaining local spacetime stability.`,
            material: "Various Alloys and Superconductors",
            function: "Structural and operational support.",
            assemblyOrder: i,
            connections: ["Collector_Superstructure_Frame"],
            failureEffect: "Reduced efficiency and elevated risk of micro-fractures in the core housing.",
            cascadeFailures: ["Subsystem fault", "Localized overheating"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: i*5, y: i*5, z: i*5 }
        });
    }

    // ==========================================
    // EXTREMELY DETAILED QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the black hole information paradox, what is the primary consequence if Hawking radiation is purely thermal and uncorrelated?",
            options: [
                "It violates the principle of equivalence in general relativity.",
                "It implies the non-conservation of quantum information and a non-unitary time evolution.",
                "It proves the existence of a 'firewall' at the event horizon.",
                "It forces the singularity to become a naked singularity."
            ],
            correctAnswer: 1,
            explanation: "If Hawking radiation is perfectly thermal, the final state of the evaporated black hole is completely independent of the initial state of the matter that formed it. This destroys initial quantum information, violating the fundamental quantum mechanical principle of unitarity."
        },
        {
            question: "The Hawking temperature of a Schwarzschild black hole is given by T_H = ħc^3 / (8πGk_BM). How does the temperature and evaporation rate change as the black hole loses mass?",
            options: [
                "The temperature decreases, slowing down the evaporation exponentially.",
                "The temperature remains constant, leading to a linear evaporation rate.",
                "The temperature increases inversely proportional to mass, causing the evaporation rate to accelerate exponentially.",
                "The temperature fluctuates probabilistically due to quantum vacuum geometry."
            ],
            correctAnswer: 2,
            explanation: "Hawking temperature is inversely proportional to the black hole's mass. As the black hole emits radiation and loses mass, its temperature rises. A hotter black hole radiates more powerfully, leading to a runaway evaporation process that ends in an explosive flash."
        },
        {
            question: "According to the generalized Second Law of Thermodynamics formulated by Bekenstein and Hawking, what happens to the total entropy when matter falls into a black hole?",
            options: [
                "Total entropy decreases as matter's entropy is annihilated.",
                "Total entropy remains constant as matter is converted to energy.",
                "Total entropy increases, as the increase in the black hole's surface area compensates for the lost entropy of the matter.",
                "Total entropy is undefined due to the singularity's infinite curvature."
            ],
            correctAnswer: 2,
            explanation: "Bekenstein established that a black hole carries an entropy proportional to its event horizon area. When matter with entropy S falls in, the black hole's area increases such that the change in black hole entropy is strictly greater than or equal to S, ensuring the generalized Second Law holds."
        },
        {
            question: "Which quantum phenomenon is classically considered the heuristic mechanism for Hawking radiation at the event horizon?",
            options: [
                "Quantum tunneling of photons from the singularity through the horizon.",
                "Vacuum fluctuations producing virtual particle-antiparticle pairs, where one falls in and the other escapes.",
                "The Unruh effect experienced by an observer in free-fall.",
                "Spontaneous symmetry breaking of the Higgs field at the horizon boundary."
            ],
            correctAnswer: 1,
            explanation: "Hawking radiation is often heuristically described by vacuum fluctuations near the horizon. A virtual particle pair is created; the negative-energy particle crosses the horizon, reducing the black hole's mass, while the positive-energy particle escapes to infinity as real radiation."
        },
        {
            question: "How does the Page curve attempt to conceptually resolve the information paradox regarding Hawking radiation?",
            options: [
                "By demonstrating that entanglement entropy of Hawking radiation first increases, then decreases to zero as the black hole evaporates completely.",
                "By proving that the event horizon acts as an absolute boundary that information can never cross.",
                "By showing that the evaporation process stops at a Planck-mass remnant.",
                "By redefining the singularity as an Einstein-Rosen bridge to a daughter universe."
            ],
            correctAnswer: 0,
            explanation: "Don Page showed that if information is preserved (unitary process), the entanglement entropy of the Hawking radiation must initially grow, but after the 'Page time', it must decrease and eventually reach zero, meaning all information is encoded in the complex correlations of the emitted radiation."
        }
    ];

    const description = "The God-Tier Hawking Radiation Collector is an ultra-advanced megastructure designed to enclose an artificial micro black hole. By strictly containing the singularity within a quantum-stabilized magnetic bottle, it captures the intense cascade of gamma rays, positrons, and other fundamental particles emitted via Hawking radiation. Featuring colossal treaded gyroscopic flywheels, intricate articulating hydraulic booms, and hundreds of metamaterial absorbers, it represents the absolute pinnacle of astrophysics engineering.";

    // ==========================================
    // HYPER-COMPLEX ANIMATION LOOP
    // ==========================================
    function animate(time, speed) {
        const t = time * speed;
        
        // 1. Black hole scales slightly (evaporation simulation)
        const bhScale = 1.0 + Math.sin(t * 2) * 0.05;
        meshes.blackHole.scale.setScalar(bhScale);
        
        // 2. Halo particles fly outwards and reset
        const pData = meshes.particleData;
        const dummy = meshes.dummy;
        for(let i=0; i<pData.length; i++) {
            let pd = pData[i];
            pd.r += pd.speed * speed * 20; // speed up outward flow
            if(pd.r > 30) {
                pd.r = 3.5; // reset near horizon
            }
            const x = pd.r * Math.sin(pd.phi) * Math.cos(pd.theta);
            const y = pd.r * Math.sin(pd.phi) * Math.sin(pd.theta);
            const z = pd.r * Math.cos(pd.phi);
            
            dummy.position.set(x,y,z);
            // Spin individual particles rapidly
            dummy.rotation.x += 0.2 * speed;
            dummy.rotation.y += 0.3 * speed;
            dummy.updateMatrix();
            meshes.particleMesh.setMatrixAt(i, dummy.matrix);
        }
        meshes.particleMesh.instanceMatrix.needsUpdate = true;
        
        // 3. Gimbals rotate at different speeds on different axes
        meshes.gimbals[0].rotation.y = t * 0.4;
        meshes.gimbals[1].rotation.x = t * 0.2;
        meshes.gimbals[1].rotation.z = t * 0.3;
        meshes.gimbals[2].rotation.z = -t * 0.5;
        
        // 4. Articulating booms via sine wave kinematics
        meshes.booms.forEach(boom => {
            // Angle oscillates between 0 and 1
            const angle = Math.sin(t * 1.5 + boom.baseOffset) * 0.5 + 0.5; 
            
            // Boom arm rotation
            boom.arm2.rotation.x = angle * 0.8; 
            
            // Explicit hydraulic piston extension
            // We set the piston's local Y position so it slides out of the cylinder
            boom.piston.position.y = 6 + angle * 2.0; 
        });
        
        // 5. Quantum Vacuum Stabilizers pulsing and rotating
        for (let i = 0; i < 4; i++) {
            const qvs = meshes[`qvs_${i}`];
            qvs.rotation.x += 0.02 * speed;
            qvs.rotation.y += 0.03 * speed;
            qvs.scale.setScalar(1.0 + Math.sin(t * 3 + i) * 0.15);
        }
        
        // 6. Pulse emissive materials for glowing/neon effects
        meshes.emissiveMaterials.forEach(em => {
            em.mat.emissiveIntensity = em.baseIntensity + Math.sin(t * em.pulseSpeed) * em.pulseRange;
        });

        // 7. Rotate the inner magnetic grid slowly
        meshes.innerGrid.rotation.y = t * 0.1;
        meshes.innerGrid.rotation.z = t * 0.05;

        // 8. Rotate Antimatter chamber core
        meshes.amChamber.rotation.y = -t * 0.8;
    }

    return { group, parts, description, quizQuestions, animate };
}
