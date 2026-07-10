import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // --- ADVANCED MATERIALS ---
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x0044ff, emissiveIntensity: 5, transparent: true, opacity: 0.9 });
    const emissivePurple = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x9900ff, emissiveIntensity: 8, transparent: true, opacity: 0.8 });
    const emissiveCyan = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ffff, emissiveIntensity: 10, transparent: true, opacity: 0.7 });
    const quantumFoamMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ffff, emissiveIntensity: 3, wireframe: true, transparent: true, opacity: 0.5 });
    const antimatterCoreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 15 });
    const goldPlating = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 });
    const darkMatterMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.9, transparent: true, opacity: 0.95 });
    const ceramicShield = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8 });
    const plasmaPink = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff00ff, emissiveIntensity: 6, transparent: true, opacity: 0.6 });

    // Store references to meshes for animation
    const meshes = {
        foamParticles: [],
        containmentRings: [],
        magneticCoils: [],
        pistons: [],
        virtualParticles: [],
        casimirPlates: [],
        plasmaConduits: [],
        thrusterVectorGimbals: [],
        coreReactor: null,
        innerSingularity: null
    };

    // --- HELPER FUNCTIONS FOR PROCEDURAL GEOMETRY ---
    function createComplexLathe(pointsArray, segments, material) {
        const points = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
        const geo = new THREE.LatheGeometry(points, segments);
        const mesh = new THREE.Mesh(geo, material);
        return mesh;
    }

    function createExtrudedGear(outerRadius, innerRadius, teeth, depth, material) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const angle = i * step;
            const nextAngle = (i + 0.5) * step;
            shape.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
            shape.lineTo(Math.cos(nextAngle) * innerRadius, Math.sin(nextAngle) * innerRadius);
        }
        shape.lineTo(Math.cos(0) * outerRadius, Math.sin(0) * outerRadius);

        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return new THREE.Mesh(geo, material);
    }

    function createPipeRing(radius, tubeRadius, segments, material) {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius, 0, 0),
            new THREE.Vector3(0, 0, radius),
            new THREE.Vector3(-radius, 0, 0),
            new THREE.Vector3(0, 0, -radius)
        ], true);
        const geo = new THREE.TubeGeometry(path, segments, tubeRadius, 16, true);
        return new THREE.Mesh(geo, material);
    }

    // --- PART 1: THE ANTIMATTER CORE & SINGULARITY (Center) ---
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(2, 4);
    meshes.coreReactor = new THREE.Mesh(coreGeo, antimatterCoreMat);
    coreGroup.add(meshes.coreReactor);

    const singularityGeo = new THREE.SphereGeometry(1, 32, 32);
    meshes.innerSingularity = new THREE.Mesh(singularityGeo, darkMatterMat);
    coreGroup.add(meshes.innerSingularity);

    // Fractal core spikes
    for(let i = 0; i < 20; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.2, 3, 16);
        const spike = new THREE.Mesh(spikeGeo, goldPlating);
        spike.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
        spike.lookAt(0,0,0);
        coreGroup.add(spike);
    }
    group.add(coreGroup);

    parts.push({
        name: "Planck-Scale Antimatter Singularity Core",
        description: "A suspended micro-singularity operating at Planck scale, generating extreme gravitational shear to unbind the vacuum.",
        material: "Dark Matter & Antimatter Plasma",
        function: "Provides the immense energy threshold required to rip virtual particles from the quantum vacuum.",
        assemblyOrder: 1,
        connections: ["Quantum Vacuum Containment Vessel", "Casimir Extraction Plates"],
        failureEffect: "Spontaneous conversion of the surrounding sector into a strangelet cascade.",
        cascadeFailures: ["Vessel Implosion", "Zero-Point Rupture"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // --- PART 2: QUANTUM VACUUM CONTAINMENT VESSEL ---
    const vesselGroup = new THREE.Group();
    const vesselPoints = [
        [3, -5], [4, -4], [4.5, -2], [5, 0], [4.5, 2], [4, 4], [3, 5], [2, 5.5], [1, 6], [0, 6]
    ];
    const vesselMesh = createComplexLathe(vesselPoints, 64, glass);
    vesselMesh.material.transparent = true;
    vesselMesh.material.opacity = 0.3;
    vesselMesh.material.side = THREE.DoubleSide;
    vesselGroup.add(vesselMesh);
    
    // Containment Webbing
    const webGeo = new THREE.WireframeGeometry(vesselMesh.geometry);
    const webMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4 });
    const webbing = new THREE.LineSegments(webGeo, webMat);
    vesselGroup.add(webbing);
    group.add(vesselGroup);

    parts.push({
        name: "Bose-Einstein Condensate Containment Vessel",
        description: "A super-cooled, hyper-transparent crystalline shell containing the vacuum fluctuations.",
        material: "Hyper-Glass & Ceramic Struts",
        function: "Prevents virtual particles from interacting with baryonic matter before annihilation.",
        assemblyOrder: 2,
        connections: ["Core", "Magnetic Coils"],
        failureEffect: "Vacuum decay scenario localized to the ship's coordinates.",
        cascadeFailures: ["Exotic Matter Venting"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 50}
    });

    // --- PART 3: SUPERCONDUCTING MAGNETIC COILS ---
    const coilGroup = new THREE.Group();
    for (let i = 0; i < 7; i++) {
        const yOffset = -4 + i * 1.5;
        const coilRadius = 5.2 - Math.abs(yOffset) * 0.1;
        const coil = createPipeRing(coilRadius, 0.3, 64, copper);
        coil.position.y = yOffset;
        
        // Add tiny emitters on the coil
        for(let j = 0; j < 12; j++) {
            const angle = (j / 12) * Math.PI * 2;
            const emitterBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), steel);
            emitterBox.position.set(Math.cos(angle)*coilRadius, yOffset, Math.sin(angle)*coilRadius);
            coilGroup.add(emitterBox);
            
            const lightBox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), emissiveBlue);
            lightBox.position.set(Math.cos(angle)*coilRadius, yOffset, Math.sin(angle)*coilRadius);
            coilGroup.add(lightBox);
        }
        
        meshes.magneticCoils.push(coil);
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    parts.push({
        name: "Yttrium-Barium-Copper Oxide Superconducting Coils",
        description: "Massive toroidal electromagnets generating fields in excess of 10^15 Tesla.",
        material: "Copper, Steel, Liquid Helium",
        function: "Guides the extracted virtual particles towards the annihilation chamber.",
        assemblyOrder: 3,
        connections: ["Containment Vessel", "Heatsinks"],
        failureEffect: "Magnetic quench leading to instantaneous vaporization of the thruster.",
        cascadeFailures: ["Core Meltdown"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -50, y: 0, z: 0}
    });

    // --- PART 4: CASIMIR EXTRACTION PLATES ---
    const casimirGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const plateMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 8, 0.1), chrome);
        plateMesh.position.set(Math.cos(angle)*4, 0, Math.sin(angle)*4);
        plateMesh.lookAt(0, 0, 0);
        
        // Inner glowing resonance lines
        const lineGeo = new THREE.BoxGeometry(0.1, 7.8, 0.15);
        const lineMesh = new THREE.Mesh(lineGeo, emissivePurple);
        lineMesh.position.set(Math.cos(angle)*3.95, 0, Math.sin(angle)*3.95);
        lineMesh.lookAt(0, 0, 0);
        
        casimirGroup.add(plateMesh);
        casimirGroup.add(lineMesh);
        meshes.casimirPlates.push(plateMesh);
    }
    group.add(casimirGroup);

    parts.push({
        name: "Macro-Scale Casimir Resonance Plates",
        description: "Angstrom-polished chrome plates separated by nanometers to suppress long-wavelength vacuum fluctuations.",
        material: "Chrome, Exotic Purple Phosphors",
        function: "Creates a negative energy density gradient to extract thrust from the vacuum.",
        assemblyOrder: 4,
        connections: ["Containment Vessel", "Plasma Conduits"],
        failureEffect: "Total loss of thrust and spontaneous Hawking radiation emission.",
        cascadeFailures: ["Vessel Rupture"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 50, y: 0, z: 0}
    });

    // --- PART 5: VIRTUAL PARTICLE ANNIHILATION CHAMBER ---
    const annihilationGroup = new THREE.Group();
    annihilationGroup.position.y = -7;
    const chamberGeo = new THREE.CylinderGeometry(4, 6, 4, 32, 1, true);
    const chamberMesh = new THREE.Mesh(chamberGeo, darkSteel);
    annihilationGroup.add(chamberMesh);

    // Injector ports
    for(let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const portGeo = new THREE.CylinderGeometry(0.5, 1, 2, 16);
        const port = new THREE.Mesh(portGeo, steel);
        port.position.set(Math.cos(angle)*5, 0, Math.sin(angle)*5);
        port.rotation.x = Math.PI / 2;
        port.rotation.z = angle;
        annihilationGroup.add(port);
        
        // Plasma conduits extending from ports
        const conduitGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*5.5, 0, Math.sin(angle)*5.5),
            new THREE.Vector3(Math.cos(angle)*7, 3, Math.sin(angle)*7),
            new THREE.Vector3(Math.cos(angle)*6, 6, Math.sin(angle)*6)
        ]), 20, 0.2, 8, false);
        const conduit = new THREE.Mesh(conduitGeo, plasmaPink);
        annihilationGroup.add(conduit);
        meshes.plasmaConduits.push(conduit);
    }
    group.add(annihilationGroup);

    parts.push({
        name: "Virtual Particle Annihilation Chamber",
        description: "The primary crucible where separated virtual pairs are forced back together in a controlled environment.",
        material: "Dark Steel, Plasma Injectors",
        function: "Converts the rest mass of virtual particles into pure kinetic gamma radiation.",
        assemblyOrder: 5,
        connections: ["Casimir Plates", "Thrust Nozzle"],
        failureEffect: "Uncontrolled gamma ray burst destroying the host ship.",
        cascadeFailures: ["Nozzle Ablation", "Gimbal Lock"],
        originalPosition: {x: 0, y: -7, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    // --- PART 6: THRUST VECTORING NOZZLE (BELL) ---
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.y = -12;
    const nozzlePoints = [
        [6, 3], [5.8, 2], [5.5, 1], [6, 0], [7, -1], [8.5, -3], [10, -5], [11.5, -8], [12, -10]
    ];
    const nozzleMesh = createComplexLathe(nozzlePoints, 64, steel);
    
    // Add cooling tubes wrapping the nozzle
    for(let i=0; i<64; i++) {
        const angle = (i/64) * Math.PI * 2;
        const tubePath = [];
        for(let j=0; j<nozzlePoints.length; j++) {
            const r = nozzlePoints[j][0] + 0.15;
            const y = nozzlePoints[j][1];
            tubePath.push(new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r));
        }
        const tubeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tubePath), 32, 0.1, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, copper);
        nozzleGroup.add(tubeMesh);
    }

    nozzleGroup.add(nozzleMesh);
    group.add(nozzleGroup);
    meshes.thrusterVectorGimbals.push(nozzleGroup);

    parts.push({
        name: "Regeneratively Cooled Hyper-Bell Nozzle",
        description: "A colossal exhaust nozzle lined with liquid helium cooling tubes to handle gamma-ray heated plasma.",
        material: "Tungsten-Steel Alloy, Copper Tubing",
        function: "Directs the annihilation energy into a coherent thrust vector.",
        assemblyOrder: 6,
        connections: ["Annihilation Chamber", "Gimbal Actuators"],
        failureEffect: "Thrust asymmetry leading to catastrophic spin.",
        cascadeFailures: ["Vector Ring Fracture"],
        originalPosition: {x: 0, y: -12, z: 0},
        explodedPosition: {x: 0, y: -80, z: 0}
    });

    // --- PART 7: GIMBAL ACTUATOR HYDRAULICS ---
    const gimbalGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        const topPivot = new THREE.Vector3(Math.cos(angle)*6.5, -6, Math.sin(angle)*6.5);
        const bottomPivot = new THREE.Vector3(Math.cos(angle)*8, -10, Math.sin(angle)*8);
        
        // Piston housing
        const housingLength = topPivot.distanceTo(bottomPivot) * 0.6;
        const housingGeo = new THREE.CylinderGeometry(0.6, 0.6, housingLength, 16);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.position.copy(topPivot).lerp(bottomPivot, 0.3);
        housing.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), bottomPivot.clone().sub(topPivot).normalize());
        gimbalGroup.add(housing);

        // Piston shaft
        const shaftLength = topPivot.distanceTo(bottomPivot) * 0.6;
        const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, shaftLength, 16);
        const shaft = new THREE.Mesh(shaftGeo, chrome);
        shaft.position.copy(topPivot).lerp(bottomPivot, 0.7);
        shaft.quaternion.copy(housing.quaternion);
        gimbalGroup.add(shaft);
        meshes.pistons.push({ shaft, housing, baseLength: shaftLength });
    }
    group.add(gimbalGroup);

    parts.push({
        name: "Quad-Axial Vectoring Hydraulics",
        description: "Massive ultra-high pressure pistons capable of directing millions of tons of thrust.",
        material: "Dark Steel, Chrome Shafts",
        function: "Provides pitch and yaw control by physically gimballing the bell nozzle.",
        assemblyOrder: 7,
        connections: ["Bell Nozzle", "Main Frame"],
        failureEffect: "Loss of directional control.",
        cascadeFailures: ["Hydraulic Line Rupture"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 30, y: -30, z: 30}
    });

    // --- PART 8: QUANTUM FOAM EMITTERS ---
    const foamGroup = new THREE.Group();
    // Huge array of floating glowing cubes simulating quantum foam boiling
    for(let i=0; i<300; i++) {
        const size = Math.random() * 0.4 + 0.1;
        const foamGeo = new THREE.BoxGeometry(size, size, size);
        const foam = new THREE.Mesh(foamGeo, quantumFoamMat);
        const r = Math.random() * 3.5;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 8;
        foam.position.set(Math.cos(theta)*r, y, Math.sin(theta)*r);
        foam.userData = {
            baseY: y,
            speed: Math.random() * 0.02 + 0.01,
            radius: r,
            angle: theta
        };
        foamGroup.add(foam);
        meshes.foamParticles.push(foam);
    }
    group.add(foamGroup);

    parts.push({
        name: "Quantum Foam Agitators",
        description: "Projectors that destabilize the local spacetime metric, inducing extreme zero-point energy fluctuations.",
        material: "Virtual Photons (Visualized)",
        function: "Thickens the vacuum to provide more 'reaction mass' for the thruster.",
        assemblyOrder: 8,
        connections: ["Containment Vessel", "Core"],
        failureEffect: "Thrust efficiency drops by 99.9%.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: 30, z: -30}
    });

    // --- PART 9: HYPERSPATIAL HEATSINKS ---
    const heatsinkGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        // Extrude a fin
        const finShape = new THREE.Shape();
        finShape.moveTo(0, -6);
        finShape.lineTo(4, -4);
        finShape.lineTo(4, 4);
        finShape.lineTo(0, 6);
        const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSize: 0.1 };
        const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
        finGeo.center();
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(Math.cos(angle)*8, 0, Math.sin(angle)*8);
        fin.lookAt(0, 0, 0);
        fin.rotation.y += Math.PI/2;
        
        // Add glowing piping to fin
        const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
        const pipe = new THREE.Mesh(pipeGeo, emissiveCyan);
        pipe.position.set(Math.cos(angle)*8.2, 0, Math.sin(angle)*8.2);
        
        heatsinkGroup.add(fin);
        heatsinkGroup.add(pipe);
    }
    group.add(heatsinkGroup);

    parts.push({
        name: "Hyperspatial Radiator Fins",
        description: "Massive aluminum cooling fins that shunt waste heat into higher-dimensional space.",
        material: "Aluminum, Cyan Plasma Coolant",
        function: "Prevents the containment vessel from vaporizing under the extreme gamma ray flux.",
        assemblyOrder: 9,
        connections: ["Magnetic Coils", "Vacuum Emitters"],
        failureEffect: "Thermal runaway and structural melting.",
        cascadeFailures: ["Coil Quench", "Vessel Implosion"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 80, y: 0, z: -80}
    });

    // --- PART 10: DARK ENERGY MANIFOLD (Top ring) ---
    const manifoldGroup = new THREE.Group();
    manifoldGroup.position.y = 8;
    const manifoldRing = createExtrudedGear(7, 5, 24, 2, steel);
    manifoldRing.rotation.x = Math.PI / 2;
    manifoldGroup.add(manifoldRing);
    
    // Add glowing embedded orbs
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), emissivePurple);
        orb.position.set(Math.cos(angle)*6, 0, Math.sin(angle)*6);
        manifoldGroup.add(orb);
    }
    group.add(manifoldGroup);

    parts.push({
        name: "Dark Energy Injection Manifold",
        description: "A heavy geared ring that regulates the flow of exotic negative-mass particles.",
        material: "Steel, Dark Energy Orbs",
        function: "Maintains the wormhole geometry required for the singularity core.",
        assemblyOrder: 10,
        connections: ["Top Frame", "Core"],
        failureEffect: "Singularity collapses into a standard black hole.",
        cascadeFailures: ["Spaghettification of the vessel"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 100, z: 0}
    });

    // --- PART 11: PHASE-CONJUGATE TRACKING ARRAY ---
    const radarGroup = new THREE.Group();
    radarGroup.position.y = 11;
    const radarDish = new THREE.Mesh(new THREE.CylinderGeometry(4, 0.5, 1, 32, 1, true), darkSteel);
    radarDish.rotation.x = Math.PI;
    radarGroup.add(radarDish);
    
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 8), copper);
    antenna.position.y = 1.5;
    radarGroup.add(antenna);
    
    const radarCore = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), emissiveBlue);
    radarCore.position.y = 3;
    radarGroup.add(radarCore);
    group.add(radarGroup);

    parts.push({
        name: "Phase-Conjugate Tracking Array",
        description: "Advanced sensor suite to measure quantum decoherence rates in the local vacuum.",
        material: "Dark Steel, Copper, Blue Optic Sensor",
        function: "Feeds real-time telemetry to the extraction plates to maintain optimal resonance.",
        assemblyOrder: 11,
        connections: ["Dark Energy Manifold"],
        failureEffect: "Thrust efficiency stutters.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 11, z: 0},
        explodedPosition: {x: 0, y: 130, z: 0}
    });

    // --- PART 12: EXOTIC MATTER INJECTORS ---
    const injectorGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2;
        const inj = new THREE.Group();
        
        const tank = new THREE.Mesh(new THREE.CapsuleGeometry(1, 4, 16, 16), plastic);
        tank.material.color.setHex(0x222222);
        tank.position.set(0, 4, 0);
        
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 16), chrome);
        pipe.position.set(0, 0.5, 0);
        
        inj.add(tank);
        inj.add(pipe);
        inj.position.set(Math.cos(angle)*7, 0, Math.sin(angle)*7);
        inj.rotation.x = Math.PI/6;
        inj.rotation.z = angle;
        
        injectorGroup.add(inj);
    }
    group.add(injectorGroup);

    parts.push({
        name: "Exotic Matter Storage Tanks",
        description: "Heavily shielded carbon-nanotube capsules holding stabilized negative mass.",
        material: "Carbon-Fiber Plastic, Chrome Piping",
        function: "Supplies the Dark Energy Manifold.",
        assemblyOrder: 12,
        connections: ["Manifold", "Outer Frame"],
        failureEffect: "Negative mass leak, causing objects to fall upwards.",
        cascadeFailures: ["Gravity Plating Inversion"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -60, y: 60, z: 60}
    });

    // --- PART 13: SUB-QUARK HARMONIC OSCILLATORS ---
    const oscGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const osc = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 32), goldPlating);
        osc.position.set(Math.cos(angle)*2.5, 5, Math.sin(angle)*2.5);
        osc.rotation.x = Math.PI/2;
        oscGroup.add(osc);
    }
    group.add(oscGroup);
    meshes.oscillators = oscGroup;

    parts.push({
        name: "Sub-Quark Harmonic Oscillators",
        description: "Gold-plated toroidal field generators operating at ultra-high frequencies.",
        material: "Gold Plating",
        function: "Dampens dangerous vibrations in the strong nuclear force near the core.",
        assemblyOrder: 13,
        connections: ["Containment Vessel Top"],
        failureEffect: "Protons in the surrounding structure decay instantly.",
        cascadeFailures: ["Total atomic dissolution"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 40, y: 40, z: -40}
    });

    // --- PART 14: STRUCTURAL LATTICE FRAME ---
    const frameGroup = new THREE.Group();
    const frameMat = darkSteel;
    // Octagonal frame surrounding the vessel
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 20, 16);
        const pillar = new THREE.Mesh(pillarGeo, frameMat);
        pillar.position.set(Math.cos(angle)*9, 0, Math.sin(angle)*9);
        frameGroup.add(pillar);
        
        // Cross bracing
        const braceGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
        const brace1 = new THREE.Mesh(braceGeo, frameMat);
        const nextAngle = ((i+1)/8) * Math.PI * 2;
        const midPoint = new THREE.Vector3(
            (Math.cos(angle)*9 + Math.cos(nextAngle)*9)/2,
            0,
            (Math.sin(angle)*9 + Math.sin(nextAngle)*9)/2
        );
        brace1.position.copy(midPoint);
        brace1.rotation.z = Math.PI/4;
        brace1.rotation.y = angle + Math.PI/8;
        frameGroup.add(brace1);
    }
    group.add(frameGroup);

    parts.push({
        name: "Adamantium Primary Lattice",
        description: "The main structural scaffolding holding the massive stresses of the thruster.",
        material: "Dark Steel (Adamantium Alloy)",
        function: "Maintains absolute rigidity to micrometer tolerances.",
        assemblyOrder: 14,
        connections: ["All major subsystems"],
        failureEffect: "Thruster tears itself apart from torsion.",
        cascadeFailures: ["Catastrophic Disassembly"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // --- PART 15: PLASMA VENTING EXHAUST STACKS ---
    const stackGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 6, 16), ceramicShield);
        stack.position.set(Math.cos(angle)*10, -5, Math.sin(angle)*10);
        stack.rotation.z = -Math.PI/8 * Math.cos(angle); // angle it outwards
        stack.rotation.x = -Math.PI/8 * Math.sin(angle);
        
        // Glowing exhaust inside stack
        const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 6.1, 16), plasmaPink);
        stack.add(glow);
        stackGroup.add(stack);
    }
    group.add(stackGroup);

    parts.push({
        name: "Emergency Plasma Vent Stacks",
        description: "Ceramic-lined chimneys for venting excess virtual plasma build-up.",
        material: "Ceramic, Plasma",
        function: "Prevents overpressure in the annihilation chamber.",
        assemblyOrder: 15,
        connections: ["Annihilation Chamber", "Frame"],
        failureEffect: "Chamber explosion.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -70, y: -20, z: -70}
    });

    // --- PART 16: CHRONO-SYNCLASTIC INFUNDIBULUM ---
    const chronoGroup = new THREE.Group();
    const chronoRing1 = new THREE.Mesh(new THREE.TorusGeometry(14, 0.5, 16, 64), chrome);
    const chronoRing2 = new THREE.Mesh(new THREE.TorusGeometry(15, 0.5, 16, 64), goldPlating);
    chronoRing1.rotation.x = Math.PI/2;
    chronoRing2.rotation.x = Math.PI/2;
    chronoGroup.add(chronoRing1);
    chronoGroup.add(chronoRing2);
    chronoGroup.position.y = -2;
    group.add(chronoGroup);
    meshes.chronoRings = [chronoRing1, chronoRing2];

    parts.push({
        name: "Chrono-Synclastic Infundibulum Rings",
        description: "Massive rotating gyroscopic rings that anchor the ship to the current timeline.",
        material: "Chrome, Gold",
        function: "Prevents the immense energies from causing accidental time dilation or time travel.",
        assemblyOrder: 16,
        connections: ["Outer Frame"],
        failureEffect: "The ship arrives at its destination before it departed.",
        cascadeFailures: ["Causality Paradox"],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -15, z: 0}
    });

    // --- DESCRIPTION ---
    const description = "The God-Tier Quantum Vacuum Thruster represents the absolute pinnacle of propulsion technology. Rather than carrying reaction mass, this colossal engine harvests virtual particles directly from the quantum foam of empty space. By utilizing a Planck-scale antimatter singularity, it rips particle-antiparticle pairs apart via the Schwinger effect before they can annihilate. The particles are channeled through immense YBCO superconducting coils and Macro-Casimir plates, falling into the annihilation chamber. The resulting pure gamma-ray photon gas is exhausted through a regeneratively cooled tungsten-alloy bell nozzle, providing theoretically infinite specific impulse. Extreme caution is advised: tampering with the Dark Energy Manifold or the Sub-Quark Harmonic Oscillators will result in localized false vacuum decay, effectively deleting the solar system.";

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the context of the Quantum Vacuum Thruster, what is the primary function of the Macro-Scale Casimir Resonance Plates?",
            options: [
                "To generate thrust by reflecting photons.",
                "To create a negative energy density gradient suppressing long-wavelength vacuum fluctuations.",
                "To cool the singularity core using liquid helium.",
                "To steer the thruster exhaust via hydraulic action."
            ],
            answer: 1,
            explanation: "The Casimir plates suppress long-wavelength virtual particles, creating a region of negative energy density relative to the surrounding vacuum, which assists in channeling the extracted virtual mass."
        },
        {
            question: "Which quantum mechanical phenomenon is responsible for unbinding virtual particle-antiparticle pairs near the Planck-Scale Singularity?",
            options: [
                "The Meissner Effect",
                "Cherenkov Radiation",
                "The Schwinger Effect",
                "Bose-Einstein Condensation"
            ],
            answer: 2,
            explanation: "The Schwinger effect predicts that in the presence of an extremely strong electric or gravitational field (like near the singularity), the vacuum itself decays into electron-positron (or other particle-antiparticle) pairs."
        },
        {
            question: "Why does the thruster require a Chrono-Synclastic Infundibulum ring system?",
            options: [
                "To prevent localized causality paradoxes and severe time dilation from the extreme energy densities.",
                "To increase the specific impulse of the exhaust gas.",
                "To provide structural support to the adamantium lattice.",
                "To act as a backup power supply."
            ],
            answer: 0,
            explanation: "The extreme mass-energy densities involved in harvesting the quantum vacuum heavily distort the local spacetime metric. The rings anchor the thruster's frame of reference to the external timeline."
        },
        {
            question: "If a magnetic quench occurs in the YBCO Superconducting Coils, what is the immediate cascade failure?",
            options: [
                "The ship loses communications.",
                "The thruster shuts down safely.",
                "Instantaneous vaporization of the thruster due to uncontained virtual particle annihilation.",
                "The dark energy manifold reverses flow."
            ],
            answer: 2,
            explanation: "The coils confine the ultra-high energy virtual particles. A quench (loss of superconductivity) drops the magnetic field, allowing the particles to strike the baryonic matter of the ship, causing immediate, catastrophic annihilation."
        },
        {
            question: "According to quantum electrodynamics, why do the Quantum Foam Agitators project virtual photons?",
            options: [
                "To provide decorative lighting.",
                "To map the surrounding space.",
                "To destabilize the local spacetime metric and 'thicken' the vacuum for higher reaction mass yield.",
                "To communicate with the Phase-Conjugate Tracking Array."
            ],
            answer: 2,
            explanation: "By actively agitating the vacuum with virtual photons, the local zero-point energy density fluctuates more violently, providing a denser source of virtual particles for the singularity to harvest."
        }
    ];

    // --- ANIMATION LOGIC ---
    let time = 0;
    function animate(delta, speed, exploded) {
        time += delta * speed;
        
        // 1. Core Singularity Rotation and Pulsation
        if (meshes.coreReactor) {
            meshes.coreReactor.rotation.x = time * 2;
            meshes.coreReactor.rotation.y = time * 3;
            const scale = 1 + Math.sin(time * 10) * 0.1;
            meshes.coreReactor.scale.set(scale, scale, scale);
            meshes.coreReactor.material.emissiveIntensity = 15 + Math.sin(time * 20) * 5;
        }

        // 2. Quantum Foam Boiling
        meshes.foamParticles.forEach((foam) => {
            foam.position.y = foam.userData.baseY + Math.sin(time * 5 + foam.userData.angle) * 2;
            foam.rotation.x += foam.userData.speed * speed;
            foam.rotation.y += foam.userData.speed * speed * 1.5;
            
            // Randomly pop in and out of existence (opacity)
            const pop = (Math.sin(time * 10 + foam.userData.angle) + 1) / 2;
            foam.material.opacity = pop > 0.8 ? 0.8 : 0.1;
        });

        // 3. Magnetic Coil Sequential Firing
        meshes.magneticCoils.forEach((coil, index) => {
            const offsetTime = time * 4 - index * 0.5;
            const active = (Math.sin(offsetTime) + 1) / 2;
            coil.children.forEach(child => {
                if (child.material === emissiveBlue) {
                    child.material.emissiveIntensity = 2 + active * 8;
                }
            });
            coil.rotation.y = time * 0.5 * (index % 2 === 0 ? 1 : -1);
        });

        // 4. Casimir Plates Resonance
        meshes.casimirPlates.forEach((plate, index) => {
            const wave = Math.sin(time * 3 + index * 0.5) * 0.2;
            if (!exploded) {
                // Slight breathing motion if not exploded
                const angle = (index / 16) * Math.PI * 2;
                plate.position.x = Math.cos(angle) * (4 + wave);
                plate.position.z = Math.sin(angle) * (4 + wave);
            }
        });

        // 5. Plasma Conduits Flow
        meshes.plasmaConduits.forEach(conduit => {
            // Pulse the emissive intensity rapidly
            conduit.material.emissiveIntensity = 4 + Math.random() * 4;
        });

        // 6. Thrust Vectoring Gimbal (Nozzle wobbling)
        if (!exploded) {
            const pitch = Math.sin(time) * 0.1;
            const yaw = Math.cos(time * 0.8) * 0.1;
            
            meshes.thrusterVectorGimbals.forEach(gimbal => {
                gimbal.rotation.x = pitch;
                gimbal.rotation.z = yaw;
            });
            
            // Adjust pistons to match gimbal
            meshes.pistons.forEach((pistonObj, index) => {
                const angle = (index/4) * Math.PI * 2 + Math.PI/4;
                const topPivot = new THREE.Vector3(Math.cos(angle)*6.5, -6, Math.sin(angle)*6.5);
                
                // Calculate where the bottom pivot is based on nozzle rotation
                const baseBottom = new THREE.Vector3(Math.cos(angle)*8, -10, Math.sin(angle)*8);
                const nozzleEuler = new THREE.Euler(pitch, 0, yaw);
                baseBottom.sub(new THREE.Vector3(0, -12, 0)); // origin of nozzle
                baseBottom.applyEuler(nozzleEuler);
                baseBottom.add(new THREE.Vector3(0, -12, 0));
                
                const newLength = topPivot.distanceTo(baseBottom);
                const stretch = newLength / pistonObj.baseLength;
                
                pistonObj.shaft.scale.y = stretch;
                pistonObj.housing.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), baseBottom.clone().sub(topPivot).normalize());
                pistonObj.shaft.quaternion.copy(pistonObj.housing.quaternion);
                
                pistonObj.housing.position.copy(topPivot).lerp(baseBottom, 0.3);
                pistonObj.shaft.position.copy(topPivot).lerp(baseBottom, 0.7);
            });
        }

        // 7. Chrono Rings Counter-Rotation
        if (meshes.chronoRings && meshes.chronoRings.length === 2) {
            meshes.chronoRings[0].rotation.z = time;
            meshes.chronoRings[0].rotation.y = Math.sin(time*0.5) * 0.2;
            meshes.chronoRings[1].rotation.z = -time * 1.5;
            meshes.chronoRings[1].rotation.x = Math.PI/2 + Math.cos(time*0.5) * 0.2;
        }

        // 8. Sub-Quark Harmonic Oscillators Spin
        if (meshes.oscillators) {
            meshes.oscillators.children.forEach((osc, index) => {
                osc.rotation.y = time * 5 + index;
                osc.rotation.z = time * 2;
            });
            meshes.oscillators.rotation.y = -time;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
