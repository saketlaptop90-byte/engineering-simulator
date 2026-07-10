import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const animationRig = {
        timeBlock: 0,
        cycleState: 0, // 0: Inspiral, 1: Merger, 2: Ringdown, 3: Reset
        bh1: null,
        bh2: null,
        accretion1: [],
        accretion2: [],
        ripples: [],
        coils: null,
        rotors: [],
        pistons: [],
        energyCore: null,
        lensingSphere: null
    };

    // --- CUSTOM & MODIFIED MATERIALS ---
    const emissiveBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        wireframe: false,
        transparent: true,
        opacity: 0.9
    });
    const emissiveRed = new THREE.MeshStandardMaterial({
        color: 0xff1100,
        emissive: 0xff3300,
        emissiveIntensity: 2.5,
        wireframe: false
    });
    const emissivePurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0xaa22ff,
        emissiveIntensity: 1.5,
        wireframe: false
    });
    const blackHoleMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    });
    // Attempting a pseudo-lensing material utilizing physical properties
    const lensingMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        opacity: 1.0,
        metalness: 0,
        roughness: 0,
        ior: 2.5, // High index of refraction to warp background
        thickness: 5.0,
        side: THREE.FrontSide
    });
    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.8
    });
    
    // Create a modified chrome for high-tech structural components
    const ultraChrome = chrome.clone();
    ultraChrome.metalness = 1.0;
    ultraChrome.roughness = 0.1;
    
    const darkHull = darkSteel.clone();
    darkHull.roughness = 0.6;
    darkHull.metalness = 0.8;

    // --- PROCEDURAL GENERATION HELPERS ---
    
    // 1. Base Platform Structure
    function buildColossalBase() {
        const baseGroup = new THREE.Group();
        
        // Main base hexagon
        const hexRadius = 250;
        const hexShape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * hexRadius;
            const y = Math.sin(angle) * hexRadius;
            if (i === 0) hexShape.moveTo(x, y);
            else hexShape.lineTo(x, y);
        }
        hexShape.lineTo(Math.cos(0) * hexRadius, Math.sin(0) * hexRadius);
        
        const extrudeSettings = { depth: 40, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 5, bevelThickness: 5 };
        const baseGeo = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
        const baseMesh = new THREE.Mesh(baseGeo, darkHull);
        baseMesh.rotation.x = -Math.PI / 2;
        baseMesh.position.y = -40;
        baseGroup.add(baseMesh);

        // Secondary inner platform
        const innerRadius = 180;
        const innerShape = new THREE.Shape();
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x = Math.cos(angle) * innerRadius;
            const y = Math.sin(angle) * innerRadius;
            if (i === 0) innerShape.moveTo(x, y);
            else innerShape.lineTo(x, y);
        }
        innerShape.lineTo(Math.cos(0) * innerRadius, Math.sin(0) * innerRadius);
        
        const innerSettings = { depth: 20, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 3, bevelThickness: 3 };
        const innerGeo = new THREE.ExtrudeGeometry(innerShape, innerSettings);
        const innerMesh = new THREE.Mesh(innerGeo, ultraChrome);
        innerMesh.rotation.x = -Math.PI / 2;
        innerMesh.position.y = 0;
        baseGroup.add(innerMesh);

        // Cooling Vents and Grilles
        const grilleGroup = new THREE.Group();
        const grilleGeo = new THREE.BoxGeometry(10, 5, 80);
        for(let i=0; i<6; i++) {
            const angle = (i / 6) * Math.PI * 2 + (Math.PI / 6);
            const r = 210;
            for(let j=0; j<10; j++) {
                const vent = new THREE.Mesh(grilleGeo, steel);
                vent.position.set(Math.cos(angle) * r, -5, Math.sin(angle) * r);
                vent.rotation.y = -angle;
                vent.position.x += Math.cos(angle + Math.PI/2) * (j * 15 - 67.5);
                vent.position.z += Math.sin(angle + Math.PI/2) * (j * 15 - 67.5);
                grilleGroup.add(vent);
            }
        }
        baseGroup.add(grilleGroup);

        return baseGroup;
    }

    // 2. Colossal Confinement Ring
    function buildAcceleratorRing() {
        const ringGroup = new THREE.Group();
        
        // Core plasma torus
        const coreTorusGeo = new THREE.TorusGeometry(150, 8, 32, 128);
        const coreTorus = new THREE.Mesh(coreTorusGeo, plasmaMat);
        coreTorus.rotation.x = Math.PI / 2;
        coreTorus.position.y = 120;
        ringGroup.add(coreTorus);
        animationRig.energyCore = coreTorus;

        // Outer housing ring
        const housingGeo = new THREE.TorusGeometry(150, 16, 64, 128);
        const housingMat = new THREE.MeshPhysicalMaterial({
            color: 0x222222, metalness: 0.9, roughness: 0.3, clearcoat: 0.8
        });
        const housing = new THREE.Mesh(housingGeo, housingMat);
        housing.rotation.x = Math.PI / 2;
        housing.position.y = 120;
        
        // Cutouts/windows in the housing using alpha maps or just layered geometry.
        // We will fake it with a wireframe cage over it
        const cageGeo = new THREE.TorusGeometry(152, 17, 16, 128);
        const cage = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({color: 0x111111, wireframe: true, metalness: 1.0}));
        cage.rotation.x = Math.PI / 2;
        cage.position.y = 120;
        ringGroup.add(housing);
        ringGroup.add(cage);

        // Magnetic Coils (InstancedMesh for performance with massive detail)
        const coilCount = 180;
        const coilGeo = new THREE.BoxGeometry(24, 40, 48);
        const coilMesh = new THREE.InstancedMesh(coilGeo, copper, coilCount);
        
        const dummy = new THREE.Object3D();
        for(let i=0; i<coilCount; i++) {
            const angle = (i / coilCount) * Math.PI * 2;
            dummy.position.set(Math.cos(angle) * 150, 120, Math.sin(angle) * 150);
            dummy.rotation.y = -angle;
            dummy.rotation.x = 0;
            dummy.updateMatrix();
            coilMesh.setMatrixAt(i, dummy.matrix);
        }
        ringGroup.add(coilMesh);
        animationRig.coils = coilMesh; // To pulse colors or rotate later

        // Support Pylons connecting base to ring
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            
            const pylonGeo = new THREE.CylinderGeometry(8, 15, 100, 16);
            const pylon = new THREE.Mesh(pylonGeo, darkSteel);
            pylon.position.set(Math.cos(angle) * 150, 70, Math.sin(angle) * 150);
            
            // Pylon details
            const wrapGeo = new THREE.TorusGeometry(12, 3, 16, 32);
            for(let k=0; k<5; k++) {
                const wrap = new THREE.Mesh(wrapGeo, chrome);
                wrap.rotation.x = Math.PI/2;
                wrap.position.y = -40 + (k * 20);
                pylon.add(wrap);
            }
            ringGroup.add(pylon);
        }

        return ringGroup;
    }

    // 3. Binary Black Hole System
    function buildBlackHoleSystem() {
        const sysGroup = new THREE.Group();
        sysGroup.position.y = 120; // Center of the ring
        
        // The Lensing Sphere - distorts everything behind it
        const lensingGeo = new THREE.SphereGeometry(45, 64, 64);
        const lensing = new THREE.Mesh(lensingGeo, lensingMat);
        sysGroup.add(lensing);
        animationRig.lensingSphere = lensing;

        // Black Hole 1
        const bh1Group = new THREE.Group();
        const bhGeo = new THREE.SphereGeometry(12, 64, 64);
        const bh1 = new THREE.Mesh(bhGeo, blackHoleMat);
        bh1Group.add(bh1);
        
        // Accretion Disk 1
        const accGeo1 = new THREE.RingGeometry(16, 35, 64);
        const accDisk1 = new THREE.Mesh(accGeo1, emissiveRed);
        accDisk1.rotation.x = Math.PI / 2.2;
        accDisk1.rotation.y = Math.PI / 8;
        bh1Group.add(accDisk1);
        
        const accGeo2 = new THREE.RingGeometry(14, 25, 64);
        const accDisk1_inner = new THREE.Mesh(accGeo2, plasmaMat);
        accDisk1_inner.rotation.x = Math.PI / 2.2;
        accDisk1_inner.rotation.y = Math.PI / 8;
        bh1Group.add(accDisk1_inner);
        
        bh1Group.position.set(50, 0, 0);
        sysGroup.add(bh1Group);
        
        // Black Hole 2
        const bh2Group = new THREE.Group();
        const bh2 = new THREE.Mesh(bhGeo, blackHoleMat);
        bh2Group.add(bh2);
        
        // Accretion Disk 2
        const accDisk2 = new THREE.Mesh(accGeo1, emissiveBlue);
        accDisk2.rotation.x = -Math.PI / 2.2;
        accDisk2.rotation.y = -Math.PI / 8;
        bh2Group.add(accDisk2);
        
        const accDisk2_inner = new THREE.Mesh(accGeo2, plasmaMat);
        accDisk2_inner.rotation.x = -Math.PI / 2.2;
        accDisk2_inner.rotation.y = -Math.PI / 8;
        bh2Group.add(accDisk2_inner);

        bh2Group.position.set(-50, 0, 0);
        sysGroup.add(bh2Group);
        
        animationRig.bh1 = bh1Group;
        animationRig.bh2 = bh2Group;
        animationRig.accretion1.push(accDisk1, accDisk1_inner);
        animationRig.accretion2.push(accDisk2, accDisk2_inner);

        // Core central singularity point (dormant until merger)
        const mergerGlowGeo = new THREE.SphereGeometry(5, 32, 32);
        const mergerGlow = new THREE.Mesh(mergerGlowGeo, emissivePurple);
        mergerGlow.visible = false;
        sysGroup.add(mergerGlow);
        animationRig.mergerGlow = mergerGlow;

        return sysGroup;
    }

    // 4. Gravity Wave Spacetime Ripples
    function buildSpacetimeRipples() {
        const rippleGroup = new THREE.Group();
        rippleGroup.position.y = 120; // Center
        
        const rippleCount = 8;
        for(let i=0; i<rippleCount; i++) {
            // Torus to represent a 3D wave crest
            const rippleGeo = new THREE.TorusGeometry(10, 1.5, 16, 100);
            const rippleMat = new THREE.MeshStandardMaterial({
                color: 0xaaaaaa,
                emissive: 0xaa00ff,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.0,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const ripple = new THREE.Mesh(rippleGeo, rippleMat);
            ripple.rotation.x = Math.PI / 2;
            rippleGroup.add(ripple);
            
            animationRig.ripples.push({
                mesh: ripple,
                phaseOffset: (i / rippleCount), // normalized offset
                active: false
            });
        }
        
        return rippleGroup;
    }

    // 5. Cryogenic Fluid & Plasma Conduits
    function buildComplexHydraulics() {
        const conduitGroup = new THREE.Group();
        
        // Define paths for splines
        const numPipes = 16;
        for(let i=0; i<numPipes; i++) {
            const angle = (i / numPipes) * Math.PI * 2;
            const startRadius = 160;
            const endRadius = 140;
            const p1 = new THREE.Vector3(Math.cos(angle)*startRadius, 20, Math.sin(angle)*startRadius);
            const p2 = new THREE.Vector3(Math.cos(angle)*(startRadius+20), 60, Math.sin(angle)*(startRadius+20));
            const p3 = new THREE.Vector3(Math.cos(angle)*endRadius, 110, Math.sin(angle)*endRadius);
            const p4 = new THREE.Vector3(Math.cos(angle)*150, 120, Math.sin(angle)*150);
            
            const curve = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
            const tubeGeo = new THREE.TubeGeometry(curve, 32, 3, 12, false);
            const tubeMat = i % 2 === 0 ? chrome : glass;
            const pipe = new THREE.Mesh(tubeGeo, tubeMat);
            conduitGroup.add(pipe);

            if(i % 2 !== 0) {
                // Add flowing plasma inside glass tubes
                const innerGeo = new THREE.TubeGeometry(curve, 32, 1.5, 12, false);
                const innerPipe = new THREE.Mesh(innerGeo, plasmaMat);
                conduitGroup.add(innerPipe);
            }
        }
        return conduitGroup;
    }

    // 6. Central Command Citadel & Operator Pod
    function buildCommandCitadel() {
        const citadelGroup = new THREE.Group();
        
        // Support Arm
        const armGeo = new THREE.BoxGeometry(100, 15, 20);
        const arm = new THREE.Mesh(armGeo, darkSteel);
        arm.position.set(0, 80, -220);
        citadelGroup.add(arm);

        // Control Pod
        const podGeo = new THREE.CylinderGeometry(25, 20, 40, 16);
        const pod = new THREE.Mesh(podGeo, ultraChrome);
        pod.rotation.x = Math.PI / 2;
        pod.position.set(0, 80, -280);
        citadelGroup.add(pod);

        // Viewing Glass
        const glassGeo = new THREE.SphereGeometry(18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5);
        const podGlass = new THREE.Mesh(glassGeo, tinted);
        podGlass.rotation.x = -Math.PI / 2;
        podGlass.position.set(0, 80, -260);
        citadelGroup.add(podGlass);

        // Antenna Arrays on Pod
        const antGeo = new THREE.CylinderGeometry(0.5, 0.5, 30, 8);
        for(let i=-1; i<=1; i+=2) {
            const ant = new THREE.Mesh(antGeo, copper);
            ant.position.set(i * 15, 100, -280);
            citadelGroup.add(ant);
        }

        return citadelGroup;
    }

    // 7. Injector Pistons (Animated during emission)
    function buildInjectors() {
        const injectorGroup = new THREE.Group();
        const numInjectors = 12;
        
        for(let i=0; i<numInjectors; i++) {
            const angle = (i / numInjectors) * Math.PI * 2;
            
            const singleInjector = new THREE.Group();
            
            // Outer casing
            const casingGeo = new THREE.CylinderGeometry(8, 8, 40, 16);
            const casing = new THREE.Mesh(casingGeo, steel);
            casing.rotation.x = Math.PI/2;
            casing.position.set(0, 0, 170);
            singleInjector.add(casing);
            
            // Inner Piston Rod
            const rodGeo = new THREE.CylinderGeometry(4, 4, 60, 16);
            const rod = new THREE.Mesh(rodGeo, chrome);
            rod.rotation.x = Math.PI/2;
            rod.position.set(0, 0, 150);
            singleInjector.add(rod);
            
            // Emitter Head
            const headGeo = new THREE.SphereGeometry(6, 16, 16);
            const head = new THREE.Mesh(headGeo, emissivePurple);
            head.position.set(0, 0, 120);
            rod.add(head); // Child of rod to move with it
            
            singleInjector.rotation.y = -angle;
            singleInjector.position.set(0, 120, 0);
            
            injectorGroup.add(singleInjector);
            
            animationRig.pistons.push({
                rod: rod,
                baseZ: 150,
                angle: angle
            });
        }
        
        return injectorGroup;
    }

    // --- ASSEMBLE ALL COMPONENTS ---
    const theBase = buildColossalBase();
    group.add(theBase);
    
    const theRing = buildAcceleratorRing();
    group.add(theRing);
    
    const theBlackHoles = buildBlackHoleSystem();
    group.add(theBlackHoles);
    
    const theRipples = buildSpacetimeRipples();
    group.add(theRipples);
    
    const thePipes = buildComplexHydraulics();
    group.add(thePipes);
    
    const theCitadel = buildCommandCitadel();
    group.add(theCitadel);
    
    const theInjectors = buildInjectors();
    group.add(theInjectors);

    // --- PARTS DICTIONARY (MASSIVE DETAIL) ---
    parts.push(
        {
            name: "Primary Hex-Platform Support Base",
            description: "A colossal poly-alloy foundation engineered to withstand planetary-scale tectonic shear forces generated by mass-energy conversions.",
            material: "darkSteel",
            function: "Anchors the emitter to the planetary crust and absorbs resonant vibrational frequencies.",
            assemblyOrder: 1,
            connections: ["Cryogenic Pylons", "Planetary Mantle"],
            failureEffect: "Structural dismemberment leading to catastrophic underground singularities.",
            cascadeFailures: ["Total Emitter Collapse", "Seismic Rupture"],
            originalPosition: { x: 0, y: -40, z: 0 },
            explodedPosition: { x: 0, y: -200, z: 0 }
        },
        {
            name: "Superconducting Toroidal Accelerator",
            description: "A 300-meter diametric confinement track lined with yttrium-barium-copper-oxide electromagnets operating at 4 Kelvin.",
            material: "steel",
            function: "Accelerates micro-singularities to 99.999% the speed of light before collision.",
            assemblyOrder: 2,
            connections: ["Magnetic Coils", "Primary Support Pylons", "Cryo-Conduits"],
            failureEffect: "Loss of magnetic confinement; singularity escapes trajectory.",
            cascadeFailures: ["Vaporization of the Citadel", "Atmospheric Ignition"],
            originalPosition: { x: 0, y: 120, z: 0 },
            explodedPosition: { x: 0, y: 300, z: 0 }
        },
        {
            name: "YBC-Oxide Confinement Coils",
            description: "Array of 180 ultra-dense magnetic chokes. These pulse inversely to the gravitational waves to prevent backwash.",
            material: "copper",
            function: "Shapes the magnetic bottle holding the black holes in the vacuum track.",
            assemblyOrder: 3,
            connections: ["Accelerator Ring", "Coolant Network"],
            failureEffect: "Localized magnetic reconnection explosions.",
            cascadeFailures: ["Singularity Orbit Decay"],
            originalPosition: { x: 0, y: 120, z: 0 },
            explodedPosition: { x: 200, y: 120, z: -200 }
        },
        {
            name: "Alpha Micro-Singularity (BH-1)",
            description: "An artificial Kerr black hole with exactly 0.5 Earth masses, spinning near its extremal limit.",
            material: "blackHoleMat",
            function: "Primary mass-energy component for spacetime shear generation.",
            assemblyOrder: 4,
            connections: ["Accretion Disk Alpha"],
            failureEffect: "Evaporation via Hawking radiation or uncontrolled accretion.",
            cascadeFailures: ["Asymmetric Wave Emission", "Temporal Dilation Accidents"],
            originalPosition: { x: 50, y: 120, z: 0 },
            explodedPosition: { x: 150, y: 120, z: 50 }
        },
        {
            name: "Beta Micro-Singularity (BH-2)",
            description: "The binary partner to Alpha. An artificially engineered singularity with reversed spin parity.",
            material: "blackHoleMat",
            function: "Collides with BH-1 to convert orbital angular momentum into pure gravitational waves.",
            assemblyOrder: 5,
            connections: ["Accretion Disk Beta"],
            failureEffect: "Tidal disruption of the confinement track.",
            cascadeFailures: ["Total Event Horizon Merger Failure"],
            originalPosition: { x: -50, y: 120, z: 0 },
            explodedPosition: { x: -150, y: 120, z: -50 }
        },
        {
            name: "Alpha Accretion Disk",
            description: "Superheated plasma trapped in the innermost stable circular orbit (ISCO) of BH-1.",
            material: "emissiveRed",
            function: "Provides visual telemetry and charge moderation for the singularity.",
            assemblyOrder: 6,
            connections: ["BH-1"],
            failureEffect: "Plasma blowout, incinerating localized sensor arrays.",
            cascadeFailures: ["Blind Telemetry", "Thermal Overload"],
            originalPosition: { x: 50, y: 120, z: 0 },
            explodedPosition: { x: 150, y: 200, z: 50 }
        },
        {
            name: "Beta Accretion Disk",
            description: "Highly blueshifted plasma orbiting BH-2 at relativistic velocities.",
            material: "emissiveBlue",
            function: "Counter-balances the electrostatic charge of BH-1.",
            assemblyOrder: 7,
            connections: ["BH-2"],
            failureEffect: "X-ray burst leading to crew irradiation.",
            cascadeFailures: ["Biological Contamination", "Sensor Blindness"],
            originalPosition: { x: -50, y: 120, z: 0 },
            explodedPosition: { x: -150, y: 200, z: -50 }
        },
        {
            name: "Spacetime Lensing Field Array",
            description: "A macroscopic metamaterial sphere that amplifies and directs the gravitational waves.",
            material: "lensingMat",
            function: "Focuses the emitted ripple into a tight beam or broad spherical wave for communication.",
            assemblyOrder: 8,
            connections: ["Accelerator Ring Inner Edge"],
            failureEffect: "Omnidirectional wave scatter, crushing surrounding structures.",
            cascadeFailures: ["Collateral Damage", "System Wide Fracture"],
            originalPosition: { x: 0, y: 120, z: 0 },
            explodedPosition: { x: 0, y: 120, z: 250 }
        },
        {
            name: "Cryo-Plasmic Conduits",
            description: "Double-walled reinforced tubes carrying super-chilled helium III and ionized plasma.",
            material: "glass/plasmaMat",
            function: "Powers the containment electromagnets while simultaneously bleeding heat.",
            assemblyOrder: 9,
            connections: ["Base Platform", "Accelerator Ring"],
            failureEffect: "Plasma leak and instantaneous cryogenic freezing followed by thermal detonation.",
            cascadeFailures: ["Pylon Fracture", "Ring Overheat"],
            originalPosition: { x: 0, y: 70, z: 0 },
            explodedPosition: { x: 0, y: -50, z: 300 }
        },
        {
            name: "Graviton Injector Pistons",
            description: "Twelve high-speed linear actuators that pulse dark energy to stabilize the binary orbit.",
            material: "chrome",
            function: "Fires precisely timed energy packets to correct orbital decay before the final merger sequence.",
            assemblyOrder: 10,
            connections: ["Accelerator Ring Housing"],
            failureEffect: "Premature singularity merger.",
            cascadeFailures: ["Uncontrolled Spacetime Shear", "Operator Vaporization"],
            originalPosition: { x: 0, y: 120, z: 0 },
            explodedPosition: { x: 0, y: 120, z: -350 }
        },
        {
            name: "Command Citadel Pod",
            description: "A hermetically sealed observation and control deck suspended by a dampening boom arm.",
            material: "ultraChrome",
            function: "Houses the chief physicist and the quantum mainframe required to calculate orbital trajectories.",
            assemblyOrder: 11,
            connections: ["Citadel Support Arm"],
            failureEffect: "Total loss of human control over the emitter.",
            cascadeFailures: ["Rogue Emitter Operation"],
            originalPosition: { x: 0, y: 80, z: -280 },
            explodedPosition: { x: -300, y: 80, z: -400 }
        },
        {
            name: "Citadel Support Arm",
            description: "A multi-jointed tritanium boom that physically isolates the command pod from the emitter's high-frequency vibrations.",
            material: "darkSteel",
            function: "Vibration dampening and emergency pod ejection vector.",
            assemblyOrder: 12,
            connections: ["Command Citadel Pod", "Base Platform"],
            failureEffect: "Vibrations liquefy the operators inside the pod.",
            cascadeFailures: ["Citadel Collapse"],
            originalPosition: { x: 0, y: 80, z: -220 },
            explodedPosition: { x: -200, y: 80, z: -300 }
        },
        {
            name: "Quantum Telemetry Antennas",
            description: "High-gain sub-space transceivers mounted on the Citadel.",
            material: "copper",
            function: "Receives off-world targeting coordinates for the gravitational wave beam.",
            assemblyOrder: 13,
            connections: ["Command Citadel Pod"],
            failureEffect: "Loss of targeting data.",
            cascadeFailures: ["Friendly-fire Spacetime Erasure"],
            originalPosition: { x: 0, y: 100, z: -280 },
            explodedPosition: { x: 0, y: 250, z: -280 }
        },
        {
            name: "Secondary Coolant Grilles",
            description: "Massive thermal exhaust vents at the base of the structure.",
            material: "steel",
            function: "Expels waste heat generated by the magnetic coils into the atmosphere.",
            assemblyOrder: 14,
            connections: ["Base Platform"],
            failureEffect: "Base overheating leading to structural softening.",
            cascadeFailures: ["Tower Lean", "Catastrophic Toppling"],
            originalPosition: { x: 0, y: -5, z: 0 },
            explodedPosition: { x: 250, y: -50, z: 250 }
        },
        {
            name: "Event Horizon Synchronizers",
            description: "Optical sensors embedded in the ring to measure the exact diameter of the black holes.",
            material: "glass",
            function: "Ensures the two singularities possess identical mass before merger to prevent asymmetric recoil.",
            assemblyOrder: 15,
            connections: ["Accelerator Ring Inner Edge"],
            failureEffect: "The merged black hole is ejected from the containment ring at 0.1c.",
            cascadeFailures: ["Total Destruction of Sector"],
            originalPosition: { x: 0, y: 120, z: 0 },
            explodedPosition: { x: 0, y: 50, z: 0 }
        }
    );

    // --- PHD LEVEL GENERAL RELATIVITY QUIZ ---
    const quizQuestions = [
        {
            question: "In the context of the binary black hole inspiral generated by this machine, what is the origin of the 2.5 Post-Newtonian (PN) term in the phase expansion?",
            options: [
                "It represents the conservative 1-loop vacuum polarization of the graviton.",
                "It is the leading-order radiation reaction term responsible for orbital decay due to gravitational wave emission.",
                "It accounts for the spin-orbit coupling (Lense-Thirring effect) between the two singularities.",
                "It derives from the non-linear tail effect where gravitational waves scatter off the background curved spacetime."
            ],
            correctAnswer: 1,
            explanation: "The 2.5PN order is the lowest order at which dissipative effects (radiation reaction) appear in the post-Newtonian expansion. It corresponds to the energy carried away by quadrupole gravitational radiation, causing the orbit to shrink."
        },
        {
            question: "When this emitter triggers a binary black hole merger, the final state is a perturbed Kerr black hole that undergoes 'ringdown'. Which mathematical formalism is primarily used to compute the quasi-normal mode frequencies of this ringdown?",
            options: [
                "The Teukolsky master equation.",
                "The Tolman-Oppenheimer-Volkoff equation.",
                "The Raychaudhuri equation.",
                "The Wheeler-DeWitt equation."
            ],
            correctAnswer: 0,
            explanation: "The Teukolsky equation decouples and separates the equations for linear perturbations of the Kerr metric, allowing physicists to calculate the complex frequencies of the quasi-normal modes emitted during the ringdown phase."
        },
        {
            question: "To ensure the safety of the Command Citadel, the engineers must calculate the gravitational wave strain amplitude 'h'. In the transverse-traceless (TT) gauge, how does the Riemann curvature tensor relate to the metric perturbation 'h_ij' of a passing gravitational wave?",
            options: [
                "R_ij00 = -1/2 * ∂_t(h_ij)",
                "R_i0j0 = -1/2 * ∂²(h_ij) / ∂t²",
                "R_ijkl = ∇_k(h_il) - ∇_l(h_ik)",
                "The Riemann tensor vanishes in the TT gauge for plane waves."
            ],
            correctAnswer: 1,
            explanation: "In linearized gravity using the TT gauge, the components of the Riemann tensor that cause relative acceleration between test particles (geodesic deviation) are directly proportional to the second time derivative of the spatial metric perturbations: R_i0j0 = -1/2 ¨h_ij."
        },
        {
            question: "This emitter utilizes the Penrose process to extract energy from the Kerr black holes prior to merger. From which specific region of the black hole spacetime is this energy extracted?",
            options: [
                "The photon sphere.",
                "The inner Cauchy horizon.",
                "The ergosphere, where the Killing vector ∂_t becomes spacelike.",
                "The innermost stable circular orbit (ISCO)."
            ],
            correctAnswer: 2,
            explanation: "The Penrose process extracts rotational energy from a Kerr black hole by splitting a particle inside the ergosphere. In this region, frame-dragging is so extreme that the asymptotic time translation Killing vector becomes spacelike, allowing for negative energy states relative to infinity."
        },
        {
            question: "Assuming this machine generates an isolated radiative spacetime, which definition of mass accurately captures the decrease in the total mass of the system as gravitational waves are emitted to null infinity?",
            options: [
                "The ADM (Arnowitt-Deser-Misner) Mass.",
                "The Komar Mass.",
                "The Bondi-Sachs Mass.",
                "The Hawking Mass."
            ],
            correctAnswer: 2,
            explanation: "The Bondi mass measures the mass of an isolated system at null infinity and strictly decreases over time as gravitational waves carry energy away. The ADM mass is measured at spatial infinity and represents the total constant energy of the entire spacetime."
        }
    ];

    // --- ULTRA COMPLEX ANIMATION LOGIC ---
    function animate(time, speed, currentMeshes) {
        // Time multiplier for sequence
        const simTime = time * speed * 0.5;
        
        // Cycle Lengths
        const inspiralDuration = 10.0;
        const mergerDuration = 2.0;
        const ringdownDuration = 4.0;
        const resetDuration = 2.0;
        const totalCycle = inspiralDuration + mergerDuration + ringdownDuration + resetDuration;
        
        // Find current phase time
        const cycleTime = simTime % totalCycle;
        
        // Define phases
        if (cycleTime < inspiralDuration) {
            animationRig.cycleState = 0; // Inspiral
        } else if (cycleTime < inspiralDuration + mergerDuration) {
            animationRig.cycleState = 1; // Merger
        } else if (cycleTime < inspiralDuration + mergerDuration + ringdownDuration) {
            animationRig.cycleState = 2; // Ringdown
        } else {
            animationRig.cycleState = 3; // Reset
        }

        // 1. Core Rotating Elements (Always moving)
        animationRig.coils.rotation.y = simTime * 0.1;
        animationRig.energyCore.rotation.z = simTime * 0.5;
        
        // 2. State Machine Logic
        
        // STATE 0: INSPIRAL (Accelerating Orbit)
        if (animationRig.cycleState === 0) {
            // Normalized progress 0.0 to 1.0
            const progress = cycleTime / inspiralDuration;
            
            // Orbital frequency increases as they get closer (Chirp)
            // f(t) ~ (t_c - t)^(-3/8) in reality, we fake a steep curve
            const orbitalFreq = 1.0 + Math.pow(progress * 4, 3);
            const currentAngle = simTime * orbitalFreq;
            
            // Distance shrinks
            const startDist = 80;
            const endDist = 5; // right before merger
            const currentDist = startDist - (Math.pow(progress, 2) * (startDist - endDist));
            
            animationRig.bh1.position.x = Math.cos(currentAngle) * currentDist;
            animationRig.bh1.position.z = Math.sin(currentAngle) * currentDist;
            
            animationRig.bh2.position.x = Math.cos(currentAngle + Math.PI) * currentDist;
            animationRig.bh2.position.z = Math.sin(currentAngle + Math.PI) * currentDist;
            
            animationRig.bh1.visible = true;
            animationRig.bh2.visible = true;
            animationRig.mergerGlow.visible = false;
            
            // Spin the accretion disks
            animationRig.accretion1.forEach(disk => disk.rotation.z += 0.1 * orbitalFreq * speed);
            animationRig.accretion2.forEach(disk => disk.rotation.z -= 0.1 * orbitalFreq * speed);
            
            // Lensing sphere pulses slowly
            const scale = 1.0 + Math.sin(simTime * 5) * 0.02;
            animationRig.lensingSphere.scale.set(scale, scale, scale);
            
            // Pistions pump in rhythm
            animationRig.pistons.forEach((p, index) => {
                const pumpOffset = Math.sin((simTime * 2) + p.angle * 2);
                p.rod.position.z = p.baseZ + pumpOffset * 10;
            });
            
            // Hide ripples during early inspiral, start showing them at the end
            animationRig.ripples.forEach(r => r.mesh.visible = false);
        }
        
        // STATE 1: MERGER (Explosion of Energy and Ripples)
        if (animationRig.cycleState === 1) {
            const progress = (cycleTime - inspiralDuration) / mergerDuration;
            
            // BHs combine visually
            animationRig.bh1.position.lerp(new THREE.Vector3(0,0,0), progress * 0.2);
            animationRig.bh2.position.lerp(new THREE.Vector3(0,0,0), progress * 0.2);
            
            if (progress > 0.1) {
                animationRig.bh1.visible = false;
                animationRig.bh2.visible = false;
                animationRig.mergerGlow.visible = true;
                
                // Pulsar/merger flash
                const flashScale = 1.0 + Math.sin(progress * Math.PI) * 5.0;
                animationRig.mergerGlow.scale.set(flashScale, flashScale, flashScale);
                
                // Lensing sphere violently distorts
                const lensDistort = 1.0 + Math.random() * 0.5;
                animationRig.lensingSphere.scale.set(lensDistort, lensDistort, lensDistort);
            }
            
            // Emit Gravity Waves!
            animationRig.ripples.forEach((r, idx) => {
                r.mesh.visible = true;
                // Emit sequentially
                let rippleProg = (progress * 5.0) - r.phaseOffset;
                if (rippleProg > 0) {
                    let rScale = 1.0 + (rippleProg * 40.0);
                    r.mesh.scale.set(rScale, rScale, rScale);
                    // Fade out
                    let opacity = Math.max(0, 1.0 - (rippleProg / 2.0));
                    r.mesh.material.opacity = opacity;
                }
            });
            
            // Pistons lock in forward position
            animationRig.pistons.forEach(p => p.rod.position.z = p.baseZ - 20);
        }
        
        // STATE 2: RINGDOWN (Dissipation of energy, single merged BH settles)
        if (animationRig.cycleState === 2) {
            const progress = (cycleTime - inspiralDuration - mergerDuration) / ringdownDuration;
            
            animationRig.bh1.visible = false; // Stay hidden
            animationRig.bh2.visible = false;
            
            animationRig.mergerGlow.visible = true;
            // Damped harmonic oscillation
            const ringdownScale = 2.0 + Math.exp(-progress * 5) * Math.cos(progress * 40) * 2.0;
            animationRig.mergerGlow.scale.set(ringdownScale, ringdownScale, ringdownScale);
            
            // Lensing sphere settles down
            const lensScale = 1.0 + Math.exp(-progress * 3) * Math.cos(progress * 20) * 0.2;
            animationRig.lensingSphere.scale.set(lensScale, lensScale, lensScale);
            
            // Continue ripples moving outward
            animationRig.ripples.forEach((r, idx) => {
                let rippleProg = (5.0 + progress * 5.0) - r.phaseOffset;
                let rScale = 1.0 + (rippleProg * 40.0);
                r.mesh.scale.set(rScale, rScale, rScale);
                let opacity = Math.max(0, 1.0 - (rippleProg / 2.0));
                r.mesh.material.opacity = opacity;
                if(opacity <= 0) r.mesh.visible = false;
            });
            
            // Pistons retract
            animationRig.pistons.forEach(p => p.rod.position.z = p.baseZ);
        }
        
        // STATE 3: RESET (Prep for next injection)
        if (animationRig.cycleState === 3) {
            animationRig.mergerGlow.visible = false;
            animationRig.bh1.visible = true;
            animationRig.bh2.visible = true;
            
            // Slowly move back to start positions
            const progress = (cycleTime - inspiralDuration - mergerDuration - ringdownDuration) / resetDuration;
            const dist = 5 + (progress * 75); // Back to 80
            
            animationRig.bh1.position.set(dist, 0, 0);
            animationRig.bh2.position.set(-dist, 0, 0);
            
            animationRig.lensingSphere.scale.set(1,1,1);
            animationRig.ripples.forEach(r => r.mesh.visible = false);
        }
    }

    return {
        group,
        parts,
        description: "The God Tier Gravitational Wave Emitter. A Class-Omega hyper-structure designed to artificially engineer, confine, and collide binary micro-black holes. It transforms extreme orbital angular momentum into pure spacetime shear, creating directed gravitational waves capable of communicating across the cosmos or shattering planetary bodies through tidal resonance. Beware the ergosphere.",
        quizQuestions,
        animate
    };
}
