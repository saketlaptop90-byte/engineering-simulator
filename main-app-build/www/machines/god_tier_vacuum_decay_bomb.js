import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // GOD TIER VACUUM DECAY CONTAINMENT VESSEL
    // ==========================================
    // Description: A megastructure built to contain a localized collapse of the 
    // Higgs field into a lower energy state (true vacuum). The central void 
    // expands via quantum tunneling and classical pressure, and must be held back 
    // by exotic energy fields, intense gravitational shearing, and temporal stasis.
    // 
    // ARCHITECTURE OVERVIEW:
    // 1. The True Vacuum Nucleus
    // 2. Event Horizon Distortion Shells (Inner/Outer)
    // 3. Primary Equatorial Stabilization Ring
    // 4. Secondary Polar Confinement Rings
    // 5. Tertiary Azimuthal Matrix Rings (144 individual interlaced rings)
    // 6. Quantum Fluctuation Dampener Pylons (8 massive structures)
    // 7. Dark Matter Plasma Injectors (12 clusters)
    // 8. Exotic Energy Arcs (dynamic, procedural)
    // 9. Coolant and Hydraulic Network (complex TubeGeometries)
    // 10. Subspace Anchorage Base Platform
    // 11. Command & Diagnostic Operator Cabin
    // ==========================================

    // ------------------------------------------
    // MATERIALS
    // ------------------------------------------
    
    const voidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x110022,
        emissiveIntensity: 5.0,
        roughness: 0.0,
        metalness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        iridescence: 1.0,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [100, 400],
        transmission: 0.0,
        wireframe: false
    });

    const voidShellMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3300ff,
        emissive: 0x220088,
        emissiveIntensity: 2.5,
        roughness: 0.2,
        metalness: 0.8,
        transmission: 0.9,
        opacity: 1.0,
        transparent: true,
        side: THREE.DoubleSide,
        clearcoat: 1.0,
        wireframe: true
    });

    const glowingRingsMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const exoticEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 8.0,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.8
    });

    const hyperSteelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2a2a2a,
        roughness: 0.4,
        metalness: 0.9,
        clearcoat: 0.2,
        clearcoatRoughness: 0.3,
    });

    const superConductorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0x331100,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 1.0,
        clearcoat: 0.8,
    });

    const warningLightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5.0
    });

    const plasmaGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.0,
        transmission: 1.0,
        thickness: 2.0,
        transparent: true,
        opacity: 1.0,
        ior: 2.0,
    });

    // ------------------------------------------
    // GENERATION FUNCTIONS
    // ------------------------------------------

    const animateList = []; // Elements that need updating in the animation loop
    const energyArcs = []; // Stores the arc lines for chaotic updating
    const pistons = []; // Stores hydraulic piston parts for synchronized extension

    function addPart(name, mesh, material, description, functionDesc, origPos, explPos, failure) {
        group.add(mesh);
        parts.push({
            name: name,
            description: description,
            material: material,
            function: functionDesc,
            assemblyOrder: parts.length + 1,
            connections: ['Core Matrix', 'Containment Field'],
            failureEffect: failure,
            cascadeFailures: ['Total Reality Collapse', 'False Vacuum Expansion'],
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // 1. THE TRUE VACUUM NUCLEUS
    // A highly tessellated sphere representing the expanding bubble of true vacuum.
    const nucleusRadius = 15;
    const nucleusGeo = new THREE.IcosahedronGeometry(nucleusRadius, 32); // High detail
    
    // Displace vertices slightly using noise representation (simulated in animation)
    const nucleusMesh = new THREE.Mesh(nucleusGeo, voidMaterial);
    nucleusMesh.position.set(0, 0, 0);
    // Save original vertices for animation calculation
    const nucleusPositions = nucleusGeo.attributes.position.clone();
    nucleusGeo.userData.originalPositions = nucleusPositions;
    
    addPart(
        'True Vacuum Nucleus',
        nucleusMesh,
        'Singularity / Void',
        'The epicentre of the Higgs field collapse. A localized bubble of true vacuum attempting to expand at the speed of light.',
        'Primary threat source. Must be contained at all costs.',
        {x:0, y:0, z:0},
        {x:0, y:0, z:0},
        'Instantaneous universal destruction propagating at c.'
    );
    animateList.push({ type: 'nucleus', mesh: nucleusMesh });

    // 2. EVENT HORIZON DISTORTION SHELLS
    const shell1Geo = new THREE.IcosahedronGeometry(nucleusRadius + 2, 16);
    const shell1Mesh = new THREE.Mesh(shell1Geo, voidShellMaterial);
    addPart('Inner Distortion Shell', shell1Mesh, 'Energy Matrix', 'First layer of spatial distortion slowing the vacuum expansion.', 'Reduces tunneling probability.', {x:0,y:0,z:0}, {x:0, y:50, z:0}, 'Bubble acceleration factor increases.');
    animateList.push({ type: 'shell', mesh: shell1Mesh, speed: 0.02, axis: new THREE.Vector3(1,1,0).normalize() });

    const shell2Geo = new THREE.IcosahedronGeometry(nucleusRadius + 5, 12);
    const shell2Mesh = new THREE.Mesh(shell2Geo, glowingRingsMaterial);
    shell2Mesh.material.wireframe = true;
    addPart('Outer Probability Manifold', shell2Mesh, 'Quantum Lacing', 'Hard-light wireframe that forces the vacuum state into quantum superposition.', 'Maintains metastability.', {x:0,y:0,z:0}, {x:0, y:-50, z:0}, 'Decoherence of the containment field.');
    animateList.push({ type: 'shell', mesh: shell2Mesh, speed: -0.015, axis: new THREE.Vector3(0,1,1).normalize() });

    // 3. PRIMARY EQUATORIAL STABILIZER RING
    // Massive, deeply detailed ring structure
    const eqRingOuterGeo = new THREE.TorusGeometry(35, 4, 64, 128);
    const eqRingOuterMesh = new THREE.Mesh(eqRingOuterGeo, hyperSteelMaterial);
    eqRingOuterMesh.rotation.x = Math.PI / 2;
    addPart('Primary Equatorial Stabilizer Outer Casing', eqRingOuterMesh, 'Hyper-Steel', 'Main structural anchor for the azimuthal matrix.', 'Handles 90% of the gravitational shear stress.', {x:0,y:0,z:0}, {x:0, y:0, z:100}, 'Catastrophic structural fragmentation.');
    
    const eqRingInnerGeo = new THREE.TorusGeometry(31, 2, 32, 128);
    const eqRingInnerMesh = new THREE.Mesh(eqRingInnerGeo, glowingRingsMaterial);
    eqRingInnerMesh.rotation.x = Math.PI / 2;
    addPart('Equatorial Exotic Matter Conduit', eqRingInnerMesh, 'Exotic Matter', 'Circulates negative-mass fluid to counteract the vacuum pressure.', 'Generates repulsive gravity.', {x:0,y:0,z:0}, {x:0, y:0, z:80}, 'Containment implosion followed by rapid expansion.');
    animateList.push({ type: 'pulse', mesh: eqRingInnerMesh });

    // Add immense detail to the Equatorial Ring (Lugs, Panels, Emitters)
    const lugGroup = new THREE.Group();
    const numLugs = 72;
    for (let i = 0; i < numLugs; i++) {
        const angle = (i / numLugs) * Math.PI * 2;
        const lugGeo = new THREE.BoxGeometry(6, 6, 10);
        const lugMesh = new THREE.Mesh(lugGeo, darkSteel);
        lugMesh.position.set(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
        lugMesh.lookAt(0, 0, 0);
        
        // Add glowing emitter on each lug
        const emitterGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 16);
        const emitterMesh = new THREE.Mesh(emitterGeo, warningLightMaterial);
        emitterMesh.rotation.x = Math.PI / 2;
        lugMesh.add(emitterMesh);
        
        lugGroup.add(lugMesh);
    }
    addPart('Equatorial Heat Sinks & Emitters', lugGroup, 'Mixed Alloys', 'Radiates Hawking radiation generated by the artificial event horizon.', 'Thermal management.', {x:0,y:0,z:0}, {x:0, y:0, z:120}, 'Thermal runaway leading to structural melting.');
    animateList.push({ type: 'rotate', mesh: lugGroup, speed: 0.005, axis: new THREE.Vector3(0,1,0) });

    // 4. SECONDARY POLAR CONFINEMENT RINGS
    const polarPoles = [
        { y: 25, rotX: Math.PI / 2, label: 'North' },
        { y: -25, rotX: Math.PI / 2, label: 'South' }
    ];
    polarPoles.forEach((pole, index) => {
        const pRingGeo = new THREE.TorusGeometry(20, 3, 64, 100);
        const pRingMesh = new THREE.Mesh(pRingGeo, steel);
        pRingMesh.position.y = pole.y;
        pRingMesh.rotation.x = pole.rotX;
        
        // Complex structural trusses for polar rings
        const trussGeo = new THREE.TorusGeometry(20, 3.5, 8, 100);
        const trussMesh = new THREE.Mesh(trussGeo, chrome);
        trussMesh.material.wireframe = true;
        pRingMesh.add(trussMesh);

        addPart(`${pole.label} Polar Confinement Ring`, pRingMesh, 'Titanium-Steel Alloy', 'Caps the polar ends of the containment field where instability is highest.', 'Prevents axial ruptures.', {x:0,y:pole.y,z:0}, {x:0, y:pole.y * 3, z:0}, 'Axial blowout of true vacuum.');
        animateList.push({ type: 'rotate', mesh: pRingMesh, speed: (index % 2 === 0 ? 0.01 : -0.01), axis: new THREE.Vector3(0,0,1) }); // Rotates in local Z which is global Y due to rotX
    });

    // 5. TERTIARY AZIMUTHAL MATRIX RINGS
    // Hundreds of stabilizing rings generating exotic fields
    const matrixGroup = new THREE.Group();
    const numMatrixRings = 144;
    for (let i = 0; i < numMatrixRings; i++) {
        const ringGeo = new THREE.TorusGeometry(30 + Math.random() * 5, 0.2 + Math.random() * 0.5, 8, 64);
        
        // Alternate materials
        let mat = hyperSteelMaterial;
        if (i % 5 === 0) mat = glowingRingsMaterial;
        else if (i % 7 === 0) mat = superConductorMaterial;
        
        const ringMesh = new THREE.Mesh(ringGeo, mat);
        
        // Random orientations
        ringMesh.rotation.x = Math.random() * Math.PI * 2;
        ringMesh.rotation.y = Math.random() * Math.PI * 2;
        ringMesh.rotation.z = Math.random() * Math.PI * 2;
        
        // Random slight oscillations in animation
        ringMesh.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02,
            rotSpeedZ: (Math.random() - 0.5) * 0.02
        };
        
        matrixGroup.add(ringMesh);
    }
    addPart('Tertiary Azimuthal Matrix', matrixGroup, 'Metamaterials & Superconductors', 'A chaotic cage of electromagnetic fields that dynamically adapts to vacuum fluctuations.', 'Stochastic interference containment.', {x:0,y:0,z:0}, {x:150, y:150, z:-150}, 'Loss of adaptive containment, leading to cascading field failures.');
    animateList.push({ type: 'matrix', mesh: matrixGroup });

    // 6. QUANTUM FLUCTUATION DAMPENER PYLONS
    // 8 massive extruded pylons piercing inward towards the nucleus
    const pylonGroup = new THREE.Group();
    const pylonShape = new THREE.Shape();
    pylonShape.moveTo(-2, 0);
    pylonShape.lineTo(2, 0);
    pylonShape.lineTo(4, 5);
    pylonShape.lineTo(2, 35);
    pylonShape.lineTo(-2, 35);
    pylonShape.lineTo(-4, 5);
    pylonShape.closePath();

    const extrudeSettings = {
        depth: 4,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 4,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };
    const pylonGeo = new THREE.ExtrudeGeometry(pylonShape, extrudeSettings);
    // Center the geometry
    pylonGeo.computeBoundingBox();
    const centerOffset = -0.5 * (pylonGeo.boundingBox.max.z - pylonGeo.boundingBox.min.z);
    pylonGeo.translate(0, 0, centerOffset);

    for (let i = 0; i < 8; i++) {
        const pylonMesh = new THREE.Mesh(pylonGeo, darkSteel);
        
        // Add glowing strips to pylons
        const stripGeo = new THREE.BoxGeometry(1, 30, 4.5);
        const stripMesh = new THREE.Mesh(stripGeo, glowingRingsMaterial);
        stripMesh.position.set(0, 18, 0);
        pylonMesh.add(stripMesh);

        // Position them spherically around the core, pointing inwards
        const theta = (i / 8) * Math.PI * 2;
        const radius = 25;
        pylonMesh.position.set(
            Math.cos(theta) * radius,
            (i % 2 === 0 ? 15 : -15), // Staggered Y
            Math.sin(theta) * radius
        );
        // Look at center
        pylonMesh.lookAt(0, 0, 0);
        pylonMesh.rotation.x -= Math.PI / 2; // Adjust extrude orientation

        pylonGroup.add(pylonMesh);
    }
    addPart('Quantum Fluctuation Dampener Pylons', pylonGroup, 'Neutronium-laced Steel', 'Physically anchors the containment field emitters deep into the distortion zone.', 'Direct geometric stabilization.', {x:0,y:0,z:0}, {x:0, y:0, z:200}, 'Pylons vaporized by vacuum expansion.');

    // 7. DARK MATTER PLASMA INJECTORS & HYDRAULICS
    // Massive complex of cylinders within cylinders (pistons)
    const injectorGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const r = 45;
        
        const baseGeo = new THREE.CylinderGeometry(3, 3, 20, 16);
        const baseMesh = new THREE.Mesh(baseGeo, steel);
        baseMesh.position.set(Math.cos(angle) * r, -30, Math.sin(angle) * r);
        baseMesh.lookAt(0, 0, 0);
        baseMesh.rotation.x += Math.PI / 2;

        const pistonGeo = new THREE.CylinderGeometry(1.5, 1.5, 25, 16);
        const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
        pistonMesh.position.y = 10;
        baseMesh.add(pistonMesh);

        // Record for animation
        pistons.push({
            mesh: pistonMesh,
            baseY: 10,
            phase: i * 0.5,
            speed: 0.05
        });

        // Add injector head
        const headGeo = new THREE.SphereGeometry(4, 16, 16);
        const headMesh = new THREE.Mesh(headGeo, glowingRingsMaterial);
        headMesh.position.y = 12.5;
        pistonMesh.add(headMesh);

        injectorGroup.add(baseMesh);
    }
    addPart('Dark Matter Plasma Injectors', injectorGroup, 'Composite / Plasma', 'Injects high-density dark matter into the containment perimeter to increase local gravitational mass.', 'Increases spatial curvature.', {x:0,y:0,z:0}, {x:0, y:-100, z:0}, 'Loss of gravitational lensing, field collapses.');
    animateList.push({ type: 'pistons' });

    // 8. EXOTIC ENERGY ARCS
    // Create chaotic, writhing lines connecting the inner shell to the primary ring
    const arcsGroup = new THREE.Group();
    const numArcs = 32;
    for (let i = 0; i < numArcs; i++) {
        const points = [];
        for (let j = 0; j < 10; j++) {
            points.push(new THREE.Vector3(0, 0, 0)); // Initialize at 0, updated in animation
        }
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        const arcMat = new THREE.LineBasicMaterial({ 
            color: 0xff00ff, 
            linewidth: 2, 
            transparent: true, 
            opacity: 0.7,
            blending: THREE.AdditiveBlending 
        });
        const arcMesh = new THREE.Line(arcGeo, arcMat);
        
        arcsGroup.add(arcMesh);
        energyArcs.push({
            mesh: arcMesh,
            index: i,
            phase: Math.random() * Math.PI * 2
        });
    }
    addPart('Stray Exotic Energy Arcs', arcsGroup, 'Pure Energy', 'Searing, chaotic electrical and exotic particle arcing due to field boundary friction.', 'Symptom of containment stress.', {x:0,y:0,z:0}, {x:0, y:0, z:0}, 'Harmless but visually terrifying.');
    animateList.push({ type: 'arcs' });

    // 9. COOLANT AND HYDRAULIC NETWORK
    // A massive spaghetti network of tubes wrapping the structure
    const tubeGroup = new THREE.Group();
    for(let i=0; i<50; i++) {
        const curvePoints = [];
        // Generate a random chaotic path that generally stays outside the nucleus
        let currentPoint = new THREE.Vector3(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80
        );
        // Push it outward if too close
        if (currentPoint.length() < 25) currentPoint.setLength(25 + Math.random() * 10);
        curvePoints.push(currentPoint);

        for (let j = 1; j < 5; j++) {
            let nextPoint = currentPoint.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
            ));
            if (nextPoint.length() < 25) nextPoint.setLength(25 + Math.random() * 10);
            curvePoints.push(nextPoint);
            currentPoint = nextPoint;
        }

        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.8 + Math.random() * 1.2, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, i % 3 === 0 ? superConductorMaterial : copper);
        tubeGroup.add(tubeMesh);
    }
    addPart('Cryogenic & Superfluid Helium Coolant Network', tubeGroup, 'Copper & Nanotubes', 'Circulates superfluid helium-4 at near absolute zero to maintain superconductor efficiency.', 'Heat dissipation.', {x:0,y:0,z:0}, {x:0, y:200, z:200}, 'Superconductors quench, massive explosion.');

    // 10. SUBSPACE ANCHORAGE BASE PLATFORM
    // Immense base structure holding the entire apparatus
    const baseGroup = new THREE.Group();
    
    // Main pedestal
    const pedestalGeo = new THREE.CylinderGeometry(50, 60, 20, 64);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, darkSteel);
    pedestalMesh.position.y = -60;
    baseGroup.add(pedestalMesh);

    // Secondary tier
    const tierGeo = new THREE.CylinderGeometry(65, 75, 10, 64);
    const tierMesh = new THREE.Mesh(tierGeo, hyperSteelMaterial);
    tierMesh.position.y = -75;
    baseGroup.add(tierMesh);

    // Support struts from base to equatorial ring
    const strutShape = new THREE.Shape();
    strutShape.moveTo(0, 0);
    strutShape.lineTo(4, 0);
    strutShape.lineTo(2, 60);
    strutShape.lineTo(-2, 60);
    strutShape.closePath();

    const strutExtrude = { depth: 4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const strutGeo = new THREE.ExtrudeGeometry(strutShape, strutExtrude);
    strutGeo.computeBoundingBox();
    strutGeo.translate(-2, 0, -2); // center

    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const strutMesh = new THREE.Mesh(strutGeo, steel);
        strutMesh.position.set(Math.cos(angle) * 45, -60, Math.sin(angle) * 45);
        
        // Tilt inwards towards the equatorial ring (radius 35, y=0)
        strutMesh.lookAt(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
        strutMesh.rotation.x -= Math.PI / 2;

        baseGroup.add(strutMesh);
    }

    addPart('Subspace Anchorage Platform', baseGroup, 'Ultra-Dense Concrete & Steel', 'Mechanically anchors the containment vessel against local gravitational distortions.', 'Foundational support.', {x:0,y:0,z:0}, {x:0, y:-300, z:0}, 'Vessel drifts uncontrollably through the facility.');

    // 11. COMMAND & DIAGNOSTIC OPERATOR CABIN
    // Very detailed tiny cabin showing scale
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -40, 55);
    
    const cabinBodyGeo = new THREE.BoxGeometry(10, 8, 8);
    const cabinBodyMesh = new THREE.Mesh(cabinBodyGeo, plastic);
    cabinGroup.add(cabinBodyMesh);

    const windowGeo = new THREE.BoxGeometry(10.2, 4, 8.2);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.y = 1;
    cabinGroup.add(windowMesh);

    const roofGeo = new THREE.BoxGeometry(11, 1, 9);
    const roofMesh = new THREE.Mesh(roofGeo, aluminum);
    roofMesh.position.y = 4.5;
    cabinGroup.add(roofMesh);

    // Antennas / Sensors on roof
    for (let i=0; i<3; i++) {
        const antGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
        const antMesh = new THREE.Mesh(antGeo, chrome);
        antMesh.position.set(-3 + i*3, 6.5, 0);
        cabinGroup.add(antMesh);
    }

    addPart('Observer Cabin', cabinGroup, 'Reinforced Glass & Plastic', 'On-site monitoring station for insane researchers who want a front-row seat to the end of the universe.', 'Monitoring and manual overrides.', {x:0,y:0,z:0}, {x:0, y:-40, z:150}, 'Researchers vaporized.');

    // 12. WARNING SIRENS & LIGHTS
    const sirenGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sBase = new THREE.Mesh(new THREE.CylinderGeometry(1,1,2,8), darkSteel);
        sBase.position.set(Math.cos(angle) * 70, -70, Math.sin(angle) * 70);
        
        const sLight = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), warningLightMaterial);
        sLight.position.y = 1.5;
        sBase.add(sLight);
        
        sirenGroup.add(sBase);
    }
    addPart('Containment Breach Alarms', sirenGroup, 'Glass & Electronics', 'Visual warning systems indicating field stress.', 'Alerts personnel.', {x:0,y:0,z:0}, {x:0, y:-100, z:100}, 'Nobody knows the universe is ending.');
    animateList.push({ type: 'sirens', mesh: sirenGroup });

    // ==========================================
    // QUIZ QUESTIONS (PhD Level QFT/Cosmology)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of false vacuum decay, the decay rate per unit volume via quantum tunneling is governed by the Callan-Coleman formula. What is the leading exponential factor in this rate?",
            options: [
                "exp(-B/ℏ), where B is the Euclidean bounce action of the O(4) symmetric instanton.",
                "exp(-ΔE/kT), governed purely by thermal fluctuations over the potential barrier.",
                "exp(-2πm/eE), representing the Schwinger pair production rate.",
                "exp(-S_GH), the Gibbons-Hawking entropy of the associated de Sitter space."
            ],
            correctAnswer: 0,
            explanation: "The decay rate is dominated by the semi-classical instanton solution (the 'bounce') in Euclidean space. B is the action of this O(4) symmetric solution."
        },
        {
            question: "The existence of a metastable electroweak vacuum in our universe heavily depends on the precise masses of which two Standard Model particles?",
            options: [
                "The W and Z bosons.",
                "The Up Quark and the Electron.",
                "The Top Quark and the Higgs Boson.",
                "The Muon and the Tau Neutrino."
            ],
            correctAnswer: 2,
            explanation: "The running of the Higgs quartic coupling depends strongly on the top quark Yukawa coupling (which drives it negative) and the Higgs mass (which sets the initial value). Current measurements place us in a narrow metastability band."
        },
        {
            question: "In Coleman-De Luccia tunneling, the inclusion of gravitational effects can sometimes entirely stabilize a false vacuum. What geometric condition dictates this absolute stabilization?",
            options: [
                "When the Schwarzchild radius of the bubble exceeds the Planck length.",
                "When the radius of the nucleated bubble exceeds the Hubble radius of the de Sitter space associated with the false vacuum.",
                "When the scalar curvature (Ricci scalar) becomes negative everywhere.",
                "When the ADM mass of the spacetime is exactly zero."
            ],
            correctAnswer: 1,
            explanation: "If the false vacuum energy is positive (de Sitter), there is a maximum size for the O(4) invariant instanton bounded by the cosmic horizon. If the required bubble size for tunneling is larger than the horizon, the decay is gravitationally quenched."
        },
        {
            question: "Which topological defect, if present in the early universe, could potentially act as a seed for catastrophic false vacuum decay by locally lowering the tunneling barrier (a process known as catalyzed decay)?",
            options: [
                "Cosmic strings or magnetic monopoles.",
                "Gravitational waves.",
                "Sterile neutrinos.",
                "Axion miniclusters."
            ],
            correctAnswer: 0,
            explanation: "Heavy topological defects like monopoles or cosmic strings can act as nucleation sites, significantly reducing the Euclidean bounce action required to form a bubble of true vacuum."
        },
        {
            question: "What theoretical principle guarantees that quantum information is conserved globally, even if the true vacuum state has a lower energy density, yet presents severe paradoxes for local observers crushed by the phase transition?",
            options: [
                "The Equivalence Principle.",
                "Unitarity in quantum mechanics (often analyzed via the holographic principle applied to the expanding bubble wall).",
                "The No-Hair Theorem.",
                "The Pauli Exclusion Principle."
            ],
            correctAnswer: 1,
            explanation: "Unitarity dictates that the evolution of the state vector is a reversible, norm-preserving process globally, even if the classical geometry experiences a devastating singularity or phase transition, a concept deeply linked to holographic dualities."
        }
    ];

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    const animate = (time, speed, meshes) => {
        // High-frequency chaotic time
        const t = time * speed * 2.0;

        animateList.forEach(anim => {
            if (anim.type === 'nucleus') {
                // Tremble and expand/contract the nucleus
                const scale = 1.0 + Math.sin(t * 10) * 0.05 + Math.random() * 0.02;
                anim.mesh.scale.set(scale, scale, scale);
                
                // Displace vertices for a boiling/trembling effect
                const posAttribute = anim.mesh.geometry.attributes.position;
                const origPositions = anim.mesh.geometry.userData.originalPositions;
                
                for (let i = 0; i < posAttribute.count; i++) {
                    const vertex = new THREE.Vector3();
                    vertex.fromBufferAttribute(origPositions, i);
                    
                    // Simple noise approximation using sine waves based on position and time
                    const noise = Math.sin(vertex.x * 2 + t * 15) * 
                                  Math.cos(vertex.y * 2 + t * 15) * 
                                  Math.sin(vertex.z * 2 + t * 15);
                    
                    const displacement = 0.5 * noise;
                    vertex.addScaledVector(vertex.clone().normalize(), displacement);
                    posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
                }
                posAttribute.needsUpdate = true;
                anim.mesh.rotation.y = t * 0.5;
                anim.mesh.rotation.z = t * 0.3;
                
                // Pulsate emissive intensity
                anim.mesh.material.emissiveIntensity = 5.0 + Math.random() * 5.0;
            }
            
            else if (anim.type === 'shell') {
                // Rotate the distortion shells continuously
                anim.mesh.rotateOnAxis(anim.axis, anim.speed * speed * 50);
                // Pulsate scale slightly
                const s = 1.0 + Math.sin(t * 3) * 0.02;
                anim.mesh.scale.set(s, s, s);
            }
            
            else if (anim.type === 'pulse') {
                // Pulse the inner equatorial ring's emissive properties
                anim.mesh.material.emissiveIntensity = 3.5 + Math.sin(t * 5) * 2.0;
            }
            
            else if (anim.type === 'rotate') {
                // Standard rotation for structural elements
                anim.mesh.rotateOnAxis(anim.axis, anim.speed * speed * 50);
            }
            
            else if (anim.type === 'matrix') {
                // Chaotic rotation of the 144 matrix rings
                anim.mesh.children.forEach(ring => {
                    ring.rotation.x += ring.userData.rotSpeedX * speed * 20;
                    ring.rotation.y += ring.userData.rotSpeedY * speed * 20;
                    ring.rotation.z += ring.userData.rotSpeedZ * speed * 20;
                });
            }
            
            else if (anim.type === 'pistons') {
                // Synchronized in/out movement of the dark matter injectors
                pistons.forEach(p => {
                    // Extend and retract using a sine wave
                    const ext = Math.sin(t * 5 + p.phase) * 5;
                    p.mesh.position.y = p.baseY + ext;
                });
            }
            
            else if (anim.type === 'arcs') {
                // Animate the chaotic energy arcs
                // They jump between the nucleus (radius ~15) and the primary ring (radius ~35)
                energyArcs.forEach(arc => {
                    const posAttribute = arc.mesh.geometry.attributes.position;
                    
                    // Origin on the nucleus surface
                    const theta1 = (arc.index / energyArcs.length) * Math.PI * 2 + t;
                    const phi1 = Math.sin(t * 2 + arc.phase) * Math.PI / 2;
                    const r1 = 16;
                    const start = new THREE.Vector3(
                        r1 * Math.cos(theta1) * Math.cos(phi1),
                        r1 * Math.sin(phi1),
                        r1 * Math.sin(theta1) * Math.cos(phi1)
                    );

                    // Destination on the equatorial ring
                    const theta2 = theta1 + Math.sin(t * 5 + arc.phase) * 1.0; 
                    const r2 = 33;
                    const end = new THREE.Vector3(
                        r2 * Math.cos(theta2),
                        (Math.random() - 0.5) * 4,
                        r2 * Math.sin(theta2)
                    );

                    // Interpolate points with high-frequency noise
                    for(let i=0; i<10; i++) {
                        const alpha = i / 9;
                        const pt = new THREE.Vector3().lerpVectors(start, end, alpha);
                        
                        if (i > 0 && i < 9) {
                            pt.x += (Math.random() - 0.5) * 6;
                            pt.y += (Math.random() - 0.5) * 6;
                            pt.z += (Math.random() - 0.5) * 6;
                        }
                        
                        posAttribute.setXYZ(i, pt.x, pt.y, pt.z);
                    }
                    posAttribute.needsUpdate = true;
                    
                    // Flicker visibility
                    arc.mesh.visible = Math.random() > 0.1;
                });
            }
            
            else if (anim.type === 'sirens') {
                // Flash the warning sirens
                const intensity = Math.sin(t * 15) > 0 ? 5.0 : 0.5;
                anim.mesh.children.forEach(base => {
                    base.children[0].material.emissiveIntensity = intensity;
                });
            }
        });
    };

    return {
        group,
        parts,
        description: "GOD TIER VACUUM DECAY CONTAINMENT VESSEL. A terrifyingly massive apparatus designed to hold back the collapse of reality itself. Features a writhing core of true vacuum, 144 adaptive azimuthal matrix rings, heavy dark matter plasma injectors, and stochastic energy arcing.",
        quizQuestions,
        animate
    };
}
