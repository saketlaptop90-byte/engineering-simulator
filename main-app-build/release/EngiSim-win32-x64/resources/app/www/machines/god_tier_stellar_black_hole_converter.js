import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    const description = "The God-Tier Stellar Black Hole Converter is an ultra-massive, hyper-advanced megastructure designed to encapsulate a living star. Through the synchronized orchestration of massive gravity-wave projectors and dark-energy containment fields, it forcefully collapses the stellar core against its own outward radiation pressure. The resulting implosion generates a controlled supernova flash, immediately followed by the artificial genesis of a singularity. The surrounding framework then harvests the ensuing Hawking radiation, relativistic polar jets, and accretion disk plasma for infinite energy.";

    // Custom High-Tech & Energy Materials
    const starMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.95,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.1
    });

    const starCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 1.0,
    });

    const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const photonRingMat = new THREE.MeshStandardMaterial({
        color: 0xffddaa,
        emissive: 0xffbb55,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const accretionDiskMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const jetMat = new THREE.MeshStandardMaterial({
        color: 0x44aaff,
        emissive: 0x1177ff,
        emissiveIntensity: 12.0,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const beamMat = new THREE.MeshBasicMaterial({
        color: 0xaaaaff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const neonBlueMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    const structuralMat1 = darkSteel;
    const structuralMat2 = chrome;
    const accentMat = copper;

    // --- Subsystem 1: The Central Stellar Body ---
    const starGroup = new THREE.Group();
    const starGeom = new THREE.IcosahedronGeometry(80, 8);
    const starMesh = new THREE.Mesh(starGeom, starMat);
    const starCoreGeom = new THREE.IcosahedronGeometry(75, 4);
    const starCoreMesh = new THREE.Mesh(starCoreGeom, starCoreMat);
    
    starGroup.add(starMesh);
    starGroup.add(starCoreMesh);
    group.add(starGroup);

    parts.push({
        name: "Central Stellar Core",
        description: "A captured main-sequence star, currently undergoing forced core contraction via external gravitational manipulation.",
        material: "Plasma / Nuclear Fire",
        function: "Serves as the raw mass and fuel for the black hole conversion process. Its radiation pressure is actively being suppressed.",
        assemblyOrder: 1,
        connections: ["Gravity_Wave_Projector_Array_Alpha", "Magnetic_Confinement_Torus"],
        failureEffect: "Uncontrolled hypernova detonation, vaporizing the local star cluster.",
        cascadeFailures: ["Complete megastructure vaporization", "Local spacetime fracture", "Runaway nucleosynthesis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    updatables.push({ type: 'star', mesh: starMesh, core: starCoreMesh, baseScale: 1.0 });

    // --- Subsystem 2: Event Horizon ---
    const bhGroup = new THREE.Group();
    const bhGeom = new THREE.SphereGeometry(15, 64, 64);
    const blackHoleMesh = new THREE.Mesh(bhGeom, bhMat);
    blackHoleMesh.scale.set(0.001, 0.001, 0.001); // starts invisible essentially
    bhGroup.add(blackHoleMesh);
    
    const photonRingGeom = new THREE.RingGeometry(18, 22, 128);
    const photonRingMesh = new THREE.Mesh(photonRingGeom, photonRingMat);
    photonRingMesh.rotation.x = Math.PI / 2;
    bhGroup.add(photonRingMesh);

    group.add(bhGroup);

    parts.push({
        name: "Event Horizon Singularity",
        description: "The artificial singularity born from the crushed star. A region of spacetime where gravity is so strong that nothing, not even light, can escape.",
        material: "Curved Spacetime / Degenerate Matter",
        function: "Acts as the ultimate energy generator by converting infalling matter into Hawking radiation and relativistic jets.",
        assemblyOrder: 20,
        connections: ["Accretion_Disk_Plasma_Ring", "Hawking_Radiation_Siphons"],
        failureEffect: "Evaporation via Hawking radiation if unfed, or runaway growth swallowing the entire sector if overfed.",
        cascadeFailures: ["Spacetime inversion", "Information paradox manifestation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    updatables.push({ type: 'blackhole', mesh: blackHoleMesh, photonRing: photonRingMesh });

    // --- Subsystem 3: Accretion Disk ---
    const diskGroup = new THREE.Group();
    
    // Create a highly detailed accretion disk using concentric tori and particles
    for (let i = 0; i < 5; i++) {
        const diskTorusGeom = new THREE.TorusGeometry(35 + i * 15, 3 + i * 1.5, 16, 100);
        const diskMesh = new THREE.Mesh(diskTorusGeom, accretionDiskMat);
        diskMesh.rotation.x = Math.PI / 2;
        diskMesh.rotation.y = (Math.random() - 0.5) * 0.1;
        diskGroup.add(diskMesh);
        updatables.push({ type: 'disk_ring', mesh: diskMesh, speed: 0.05 - (i * 0.005) });
    }

    group.add(diskGroup);

    parts.push({
        name: "Accretion Disk Plasma Ring",
        description: "A superheated disk of spiraling plasma, formed from the shredded remnants of the star's outer layers.",
        material: "Ultra-hot Plasma / Magnetized Ions",
        function: "Feeds the singularity while emitting X-rays and gamma rays that are captured by the framework for auxiliary power.",
        assemblyOrder: 19,
        connections: ["Event_Horizon_Singularity", "Relativistic_Polar_Jets"],
        failureEffect: "Thermal runaway causing the disk to expand and melt the inner Dyson struts.",
        cascadeFailures: ["Magnetic field collapse", "Plasma wave tsunami"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    updatables.push({ type: 'accretion_disk_group', group: diskGroup });

    // --- Subsystem 4: Relativistic Polar Jets ---
    const jetGroup = new THREE.Group();
    const jetGeom = new THREE.ConeGeometry(8, 400, 32, 1, true);
    
    const topJet = new THREE.Mesh(jetGeom, jetMat);
    topJet.position.y = 200;
    
    const bottomJet = new THREE.Mesh(jetGeom, jetMat);
    bottomJet.rotation.x = Math.PI;
    bottomJet.position.y = -200;

    jetGroup.add(topJet);
    jetGroup.add(bottomJet);
    group.add(jetGroup);

    parts.push({
        name: "Relativistic Polar Jets",
        description: "Twin beams of ionized matter accelerated to near light-speed, ejected from the magnetic poles of the black hole.",
        material: "Relativistic Plasma",
        function: "Relieves angular momentum from the accretion disk and serves as a primary thrust mechanism for stellar-system relocation.",
        assemblyOrder: 21,
        connections: ["Accretion_Disk_Plasma_Ring", "Dark_Energy_Containment_Vessel"],
        failureEffect: "Misalignment of jets causing massive structural ablation of the entire framework.",
        cascadeFailures: ["Framework shearing", "Gamma-ray burst misdirection"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 0, z: 200 }
    });

    updatables.push({ type: 'jets', top: topJet, bottom: bottomJet });

    // --- Subsystem 5-7: Dyson Framework Rings ---
    const frameworkGroup = new THREE.Group();
    
    const createMegaRing = (radius, tube, segments, material, rotationAxes, name, order, explodedY) => {
        const ringGeom = new THREE.TorusGeometry(radius, tube, 32, segments);
        const ringMesh = new THREE.Mesh(ringGeom, material);
        ringMesh.rotation.set(rotationAxes.x, rotationAxes.y, rotationAxes.z);
        
        // Add intricate details to the ring
        for(let i=0; i<36; i++) {
            const detailGeom = new THREE.BoxGeometry(tube*3, tube*4, tube*3);
            const detailMesh = new THREE.Mesh(detailGeom, accentMat);
            const angle = (i / 36) * Math.PI * 2;
            detailMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            detailMesh.rotation.z = angle;
            ringMesh.add(detailMesh);
        }

        frameworkGroup.add(ringMesh);
        
        parts.push({
            name: name,
            description: `A colossal structural ring of radius ${radius}km, forging the backbone of the megastructure.`,
            material: "Neutronium-infused Dark Steel",
            function: "Houses gravitational wave conduits and anchors the tachyon strut network.",
            assemblyOrder: order,
            connections: ["Tachyon_Strut_Network", "Gravity_Wave_Projector_Array_Alpha"],
            failureEffect: "Structural buckling leading to catastrophic implosion of the entire megastructure.",
            cascadeFailures: ["Ring shear", "Debris cascade into central star"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: explodedY, z: 0 }
        });

        updatables.push({ type: 'framework_ring', mesh: ringMesh, speed: Math.random() * 0.01 + 0.005, axis: 'z' });
        return ringMesh;
    };

    const ring1 = createMegaRing(200, 8, 128, structuralMat1, {x: Math.PI/2, y: 0, z: 0}, "Primary Equatorial Ring", 2, -400);
    const ring2 = createMegaRing(220, 6, 128, structuralMat2, {x: 0, y: Math.PI/2, z: 0}, "Secondary Meridian Ring", 3, 400);
    const ring3 = createMegaRing(240, 5, 128, structuralMat1, {x: Math.PI/4, y: Math.PI/4, z: 0}, "Tertiary Azimuthal Ring", 4, 0);
    
    group.add(frameworkGroup);

    // --- Subsystem 8: Gravity Wave Projectors ---
    const projectorGroup = new THREE.Group();
    const beamGroup = new THREE.Group();
    
    const projGeom = new THREE.CylinderGeometry(2, 6, 20, 16);
    const projInnerGeom = new THREE.CylinderGeometry(1, 1, 25, 8);
    
    // Distribute projectors using Fibonacci sphere
    const numProjectors = 200;
    const projRadius = 150;
    
    for (let i = 0; i < numProjectors; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / numProjectors);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const x = projRadius * Math.sin(phi) * Math.cos(theta);
        const y = projRadius * Math.cos(phi);
        const z = projRadius * Math.sin(phi) * Math.sin(theta);
        
        const projContainer = new THREE.Group();
        projContainer.position.set(x, y, z);
        projContainer.lookAt(0, 0, 0); // Point towards the star
        projContainer.rotation.x -= Math.PI / 2; // Adjust cylinder orientation
        
        const projMesh = new THREE.Mesh(projGeom, structuralMat2);
        const projInner = new THREE.Mesh(projInnerGeom, accentMat);
        projContainer.add(projMesh);
        projContainer.add(projInner);
        
        // Add focusing rings
        for (let j=0; j<3; j++) {
            const focusRingGeom = new THREE.TorusGeometry(8 - j, 0.5, 8, 16);
            const focusRing = new THREE.Mesh(focusRingGeom, neonBlueMat);
            focusRing.position.y = -10 + j*5;
            focusRing.rotation.x = Math.PI/2;
            projContainer.add(focusRing);
            updatables.push({ type: 'focus_ring', mesh: focusRing, speed: (j+1)*0.05 });
        }
        
        // Energy beam
        const beamGeom = new THREE.CylinderGeometry(0.5, 0.5, projRadius - 80, 8);
        const beam = new THREE.Mesh(beamGeom, beamMat);
        beam.position.y = -(projRadius - 80)/2 - 10;
        beam.material.opacity = 0.0; // Initially off
        projContainer.add(beam);
        updatables.push({ type: 'gravity_beam', mesh: beam });

        projectorGroup.add(projContainer);
    }
    
    group.add(projectorGroup);

    parts.push({
        name: "Gravity Wave Projector Array",
        description: "A synchronized array of 200 ultra-dense projectors that bombard the central star with artificial gravity waves, forcing core collapse.",
        material: "Chromium / Quantum Circuitry",
        function: "Overcomes the star's radiation pressure by increasing the local gravitational constant by a factor of 10^12.",
        assemblyOrder: 5,
        connections: ["Primary_Equatorial_Ring", "Central_Stellar_Core"],
        failureEffect: "Asymmetric collapse causing the star to obliterate the array in a directional hyper-flare.",
        cascadeFailures: ["Projector overload", "Gravity shear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -300, y: 0, z: -300 }
    });

    // --- Subsystem 9: Tachyon Strut Network ---
    const strutGroup = new THREE.Group();
    // Connect the rings with intricate scaffolding
    for (let i = 0; i < 20; i++) {
        const path = new THREE.LineCurve3(
            new THREE.Vector3((Math.random()-0.5)*400, (Math.random()-0.5)*400, (Math.random()-0.5)*400),
            new THREE.Vector3((Math.random()-0.5)*400, (Math.random()-0.5)*400, (Math.random()-0.5)*400)
        );
        const tubeGeom = new THREE.TubeGeometry(path, 20, 2, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, structuralMat1);
        strutGroup.add(tubeMesh);
    }
    group.add(strutGroup);

    parts.push({
        name: "Tachyon Strut Network",
        description: "FTL-laced scaffolding connecting the outer rings, providing infinite rigidity across massive spatial distances.",
        material: "Dark Steel / Tachyon Core",
        function: "Maintains structural integrity against the extreme gravitational shearing forces produced during the black hole birth.",
        assemblyOrder: 6,
        connections: ["Primary_Equatorial_Ring", "Secondary_Meridian_Ring"],
        failureEffect: "Strut snapping causing the rings to collide at relativistic speeds.",
        cascadeFailures: ["Tachyon radiation leak", "Time dilation pockets"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 500 }
    });

    // --- Subsystem 10: Magnetic Confinement Torus ---
    const magTorusGeom = new THREE.TorusKnotGeometry(120, 10, 256, 32, 3, 4);
    const magTorusMesh = new THREE.Mesh(magTorusGeom, neonBlueMat);
    group.add(magTorusMesh);

    parts.push({
        name: "Magnetic Confinement Torus",
        description: "A super-cooled, hyper-conductive torus knot that generates a magnetic bottle to contain the star's plasma during the initial collapse phase.",
        material: "Superconducting Niobium-Titanium",
        function: "Prevents stellar matter from prematurely escaping and damaging the gravity projectors.",
        assemblyOrder: 7,
        connections: ["Tachyon_Strut_Network"],
        failureEffect: "Massive coronal mass ejections bypassing the gravity waves and incinerating the framework.",
        cascadeFailures: ["Magnetic quench", "Plasma leak"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -500 }
    });
    
    updatables.push({ type: 'mag_torus', mesh: magTorusMesh });

    // --- Subsystem 11: Supernova Flash Emitters ---
    const flashGeom = new THREE.SphereGeometry(1, 32, 32);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
    const flashMesh = new THREE.Mesh(flashGeom, flashMat);
    group.add(flashMesh);
    updatables.push({ type: 'supernova_flash', mesh: flashMesh });

    parts.push({
        name: "Quantum Flash Dampener",
        description: "A specialized shielding matrix designed to absorb and redirect the blinding light of the induced supernova.",
        material: "Metamaterial Glass",
        function: "Prevents the resulting photons from vaporizing surrounding planets.",
        assemblyOrder: 8,
        connections: ["Magnetic_Confinement_Torus"],
        failureEffect: "Complete blinding and vaporization of observers within 100 lightyears.",
        cascadeFailures: ["Photon pressure overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 500 }
    });

    // Subsystems 12-20: Add massive detail items
    const generateDetailSubsystem = (name, desc, matName, order, geomType) => {
        const subGroup = new THREE.Group();
        for(let i=0; i<12; i++) {
            let geom;
            if(geomType === 'lathe') {
                const points = [];
                for (let j = 0; j < 10; j++) points.push(new THREE.Vector2(Math.sin(j * 0.2) * 10 + 5, (j - 5) * 5));
                geom = new THREE.LatheGeometry(points, 32);
            } else if (geomType === 'extrude') {
                const shape = new THREE.Shape();
                shape.moveTo( 0, 0 );
                shape.lineTo( 0, 20 );
                shape.lineTo( 20, 20 );
                shape.lineTo( 20, 0 );
                shape.lineTo( 0, 0 );
                const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
                geom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            } else {
                geom = new THREE.OctahedronGeometry(15, 1);
            }
            
            const mesh = new THREE.Mesh(geom, structuralMat2);
            const angle = (i / 12) * Math.PI * 2;
            const dist = 260;
            mesh.position.set(Math.cos(angle) * dist, (Math.random()-0.5)*100, Math.sin(angle) * dist);
            mesh.lookAt(0,0,0);
            subGroup.add(mesh);
        }
        group.add(subGroup);
        
        parts.push({
            name: name,
            description: desc,
            material: matName,
            function: "Auxiliary support for extreme spacetime contortions.",
            assemblyOrder: order,
            connections: ["Primary_Equatorial_Ring"],
            failureEffect: "Localized spacetime tearing.",
            cascadeFailures: ["Micro-singularity formation"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: (Math.random()-0.5)*600, y: (Math.random()-0.5)*600, z: (Math.random()-0.5)*600 }
        });
        
        updatables.push({ type: 'spin_group', group: subGroup, speed: Math.random() * 0.02 - 0.01 });
    };

    generateDetailSubsystem("Dark Energy Containment Vessel", "Houses synthetic dark energy to prevent premature expansion of the stellar mass.", "Void-Forged Glass", 9, "lathe");
    generateDetailSubsystem("Radiation Shield Lattice", "Hexagonal lattices to deflect stray gamma rays.", "Lead-Titanium Composite", 10, "extrude");
    generateDetailSubsystem("Antimatter Injection Ports", "Shoots antimatter into the core to accelerate collapse.", "Magnetic Steel", 11, "octa");
    generateDetailSubsystem("Neutron Star Catalyst Nodes", "Chunks of neutron star matter used as gravitational seeds.", "Neutronium", 12, "lathe");
    generateDetailSubsystem("Hawking Radiation Siphons", "Collects the slow evaporation of the black hole for baseline power.", "Chrome", 13, "extrude");
    generateDetailSubsystem("Spacetime Fabric Tensors", "Pulls space taut around the event horizon to stabilize the ergosphere.", "Dark Steel", 14, "octa");
    generateDetailSubsystem("Singularity Stabilizer Fins", "Radiates excess heat from the innermost photon ring.", "Copper", 15, "lathe");
    generateDetailSubsystem("Hyper-dimensional Manifolds", "Folds space to reduce the physical footprint of the massive machine.", "Quantum Plastic", 16, "extrude");
    generateDetailSubsystem("Quantum Vacuum Pumps", "Extracts zero-point energy to jumpstart the gravity projectors.", "Rubber/Steel", 17, "octa");


    // -----------------------------------------------------------
    // Animation Logic State Machine
    // Time mapping: 
    // 0 - 20s : Phase 1: Startup, star pulsing, projectors spinning up, beams intensifying.
    // 20 - 30s: Phase 2: Core Collapse, star shrinks rapidly, beams at max power, red shift.
    // 30 - 32s: Phase 3: Supernova Flash, blinding white light.
    // 32 - 50s: Phase 4: Black Hole stable, accretion disk forms, jets fire, Hawking radiation.
    // 50 - 60s: Phase 5: Resetting simulation.
    // -----------------------------------------------------------

    const animate = (time, speed, meshes) => {
        const cycleLength = 60;
        const t = (time * speed) % cycleLength;

        // Determine Phase
        let phase = 1;
        if (t >= 20 && t < 30) phase = 2;
        else if (t >= 30 && t < 32) phase = 3;
        else if (t >= 32 && t < 50) phase = 4;
        else if (t >= 50) phase = 5;

        // Global variables for states
        let starScale = 1.0;
        let starColor = new THREE.Color(0xffaa00);
        let beamOpacity = 0.0;
        let bhScale = 0.001;
        let accretionOpacity = 0.0;
        let jetOpacity = 0.0;
        let flashOpacity = 0.0;
        let flashScale = 1.0;

        // Phase Logic
        if (phase === 1) {
            // Pulse star
            const pulse = Math.sin(t * 2) * 0.05;
            starScale = 1.0 + pulse;
            // Beam charge up
            beamOpacity = (t / 20) * 0.8;
            starColor.lerp(new THREE.Color(0xff5500), t / 20); // Turn reddish
        } 
        else if (phase === 2) {
            // Collapse
            const progress = (t - 20) / 10; // 0 to 1
            starScale = 1.0 - (progress * 0.95); // shrinks to 0.05
            beamOpacity = 0.8 + Math.random() * 0.2; // flickering max power
            starColor.lerp(new THREE.Color(0xff0000), progress); // Deep red shift
            
            // Wobble
            if(updatables[0].mesh) {
                updatables[0].mesh.position.x = (Math.random() - 0.5) * 5 * progress;
                updatables[0].mesh.position.y = (Math.random() - 0.5) * 5 * progress;
            }
        }
        else if (phase === 3) {
            // Flash!
            starScale = 0.0;
            beamOpacity = 0.0;
            const progress = (t - 30) / 2; // 0 to 1
            flashOpacity = 1.0 - progress;
            flashScale = 1 + progress * 500;
        }
        else if (phase === 4) {
            // Black Hole Mode
            starScale = 0.0;
            beamOpacity = 0.0;
            
            // Accretion disk and jets fade in
            const progress = Math.min((t - 32) / 5, 1.0); // fade in over 5s
            bhScale = 1.0;
            accretionOpacity = progress * 0.8;
            jetOpacity = progress * 0.6;
        }
        else if (phase === 5) {
            // Reset fade out
            const progress = (t - 50) / 10;
            bhScale = 1.0 - progress;
            accretionOpacity = 0.8 * (1.0 - progress);
            jetOpacity = 0.6 * (1.0 - progress);
            starScale = progress; // slowly grow back
            beamOpacity = 0.0;
            starColor = new THREE.Color(0xffaa00);
        }

        // Apply Updates to specific systems
        updatables.forEach(item => {
            if (item.type === 'star') {
                item.mesh.scale.set(starScale, starScale, starScale);
                item.core.scale.set(starScale, starScale, starScale);
                item.mesh.material.emissive = starColor;
                item.mesh.visible = (starScale > 0.01);
                item.core.visible = (starScale > 0.01);
                
                item.mesh.rotation.y += 0.01;
                item.core.rotation.x -= 0.02;
            }
            if (item.type === 'blackhole') {
                item.mesh.scale.set(bhScale, bhScale, bhScale);
                item.photonRing.scale.set(bhScale, bhScale, bhScale);
                item.mesh.visible = (bhScale > 0.01);
                item.photonRing.material.opacity = accretionOpacity;
                item.photonRing.rotation.z -= 0.1; // Fast spin
            }
            if (item.type === 'gravity_beam') {
                item.mesh.material.opacity = beamOpacity;
            }
            if (item.type === 'focus_ring') {
                item.mesh.rotation.z += item.speed;
            }
            if (item.type === 'framework_ring') {
                if (item.axis === 'z') item.mesh.rotation.z += item.speed;
            }
            if (item.type === 'mag_torus') {
                item.mesh.rotation.x += 0.005;
                item.mesh.rotation.y -= 0.003;
                // Pulse emissive based on phase
                item.mesh.material.emissiveIntensity = 5.0 + Math.sin(t * 10) * 2;
            }
            if (item.type === 'supernova_flash') {
                item.mesh.material.opacity = flashOpacity;
                item.mesh.scale.set(flashScale, flashScale, flashScale);
                item.mesh.visible = (flashOpacity > 0);
            }
            if (item.type === 'disk_ring') {
                item.mesh.material.opacity = accretionOpacity;
                item.mesh.rotation.z += item.speed * 5; // Spin very fast
                item.mesh.visible = (accretionOpacity > 0);
            }
            if (item.type === 'jets') {
                item.top.material.opacity = jetOpacity;
                item.bottom.material.opacity = jetOpacity;
                item.top.rotation.y += 0.2;
                item.bottom.rotation.y -= 0.2;
                item.top.visible = (jetOpacity > 0);
                item.bottom.visible = (jetOpacity > 0);
            }
            if (item.type === 'spin_group') {
                item.group.rotation.y += item.speed;
                item.group.rotation.x += item.speed * 0.5;
            }
        });
    };

    const quizQuestions = [
        {
            question: "In the context of stellar collapse, what is the theoretical limit (in solar masses) above which a neutron star is forced to collapse into a black hole due to gravity overcoming neutron degeneracy pressure?",
            options: [
                "The Chandrasekhar limit (~1.4 M☉)",
                "The Tolman-Oppenheimer-Volkoff (TOV) limit (~2.2 - 2.9 M☉)",
                "The Eddington limit",
                "The Schwarzschild limit (~5.0 M☉)"
            ],
            correctAnswer: 1,
            explanation: "The Tolman-Oppenheimer-Volkoff limit represents the upper bound to the mass of cold, non-rotating neutron stars. Beyond this mass, neutron degeneracy pressure cannot support the star against its own gravity, leading to collapse into a black hole."
        },
        {
            question: "When this megastructure collapses the star, it harvests the resulting relativistic polar jets. What physical mechanism is primarily responsible for the collimation and acceleration of these astrophysical jets in black holes?",
            options: [
                "The Blandford-Znajek process extracting spin energy via magnetic fields",
                "Thermal runaway in the accretion disk pushing plasma outwards",
                "Hawking radiation being focused by the photon sphere",
                "The Penrose process operating purely on degenerate matter"
            ],
            correctAnswer: 0,
            explanation: "The Blandford-Znajek process is the leading theory for the generation of relativistic jets in active galactic nuclei and microquasars, utilizing the frame-dragging effect of a spinning black hole to twist magnetic field lines and extract rotational energy."
        },
        {
            question: "The artificial singularity generated by this machine is bounded by an event horizon. According to the No-Hair Theorem, what are the only three independently observable macroscopic properties that characterize this resulting black hole?",
            options: [
                "Mass, Temperature, and Magnetic Field",
                "Mass, Charge, and Angular Momentum (Spin)",
                "Radius, Entropy, and Density",
                "Charge, Angular Momentum, and Baryon Number"
            ],
            correctAnswer: 1,
            explanation: "The No-Hair Theorem postulates that all black hole solutions of the Einstein-Maxwell equations of gravitation and electromagnetism in general relativity can be completely characterized by only three externally observable classical parameters: mass, electric charge, and angular momentum."
        },
        {
            question: "If this God-Tier machine were to accidentally lower the accretion rate below the critical threshold, the accretion disk would transition into an ADAF (Advection-Dominated Accretion Flow). What characterizes an ADAF compared to a standard thin disk?",
            options: [
                "It becomes geometrically thin and extremely luminous.",
                "It becomes highly efficient at radiating energy away.",
                "It becomes radiatively inefficient, geometrically thick, and extremely hot.",
                "It freezes into a solid ring of degenerate matter."
            ],
            correctAnswer: 2,
            explanation: "In an Advection-Dominated Accretion Flow (ADAF), the gas is unable to cool efficiently. Thus, the energy generated by viscous friction is not radiated away but 'advected' (carried along) with the flow into the black hole. This makes the disk geometrically thick (puffing up due to heat) and radiatively inefficient (dim)."
        },
        {
            question: "The megastructure employs 'Hawking Radiation Siphons'. For a black hole of mass M, what is the mathematical proportionality of its Hawking temperature (T) and its evaporation time (t)?",
            options: [
                "T ∝ M, t ∝ M^2",
                "T ∝ 1/M, t ∝ M^3",
                "T ∝ M^2, t ∝ 1/M",
                "T ∝ 1/M^2, t ∝ e^M"
            ],
            correctAnswer: 1,
            explanation: "Hawking temperature is inversely proportional to mass (T = ℏc^3 / 8πkGM), meaning smaller black holes are hotter. The evaporation time (lifetime) is proportional to the cube of the mass (t ∝ M^3), meaning a black hole evaporates progressively faster as it loses mass."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
