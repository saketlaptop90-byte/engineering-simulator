import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // EXOTIC & CUSTOM MATERIALS
    // ==========================================
    const cosmicStringMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 200.0,
        transparent: true,
        opacity: 0.95,
        wireframe: false,
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const tachyonGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
    });
    
    const singularityDarkness = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
    });

    // ==========================================
    // 1. THE COSMIC STRING (Topological Defect)
    // ==========================================
    const stringGroup = new THREE.Group();
    const stringRadius = 0.3;
    const stringLength = 4000;
    const stringGeo = new THREE.CylinderGeometry(stringRadius, stringRadius, stringLength, 64, 200, true);
    const cosmicStringMesh = new THREE.Mesh(stringGeo, cosmicStringMaterial);
    stringGroup.add(cosmicStringMesh);
    group.add(stringGroup);

    parts.push({
        name: 'Cosmic_String_Core',
        description: 'A 1-dimensional topological defect in spacetime from the early universe, carrying immense mass and tension. It acts as the anchor and primary power source for the Harvester.',
        material: 'cosmicStringMaterial',
        function: 'Emits intense gravitational waves and exotic particles to be harvested.',
        assemblyOrder: 1,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Instantaneous spaghettification and collapse of the entire localized spacetime metric.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 2. INNER CONTAINMENT HULL
    // ==========================================
    const hullGroup = new THREE.Group();
    const hullLength = 1200;
    
    // Lathe geometry for a highly complex hull shape
    const hullPoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const y = (t - 0.5) * hullLength;
        const r = 40 + 15 * Math.sin(t * Math.PI * 10) + 5 * Math.cos(t * Math.PI * 30);
        hullPoints.push(new THREE.Vector2(r, y));
    }
    const hullGeo = new THREE.LatheGeometry(hullPoints, 128);
    const hullMesh = new THREE.Mesh(hullGeo, darkSteel);
    hullMesh.rotation.x = Math.PI / 2; // Align with Z-axis if needed, but string is on Y
    hullGroup.add(hullMesh);
    
    // Add internal bracing to hull
    const bracingGeo = new THREE.CylinderGeometry(38, 38, hullLength, 64, 1, true);
    const bracingMesh = new THREE.Mesh(bracingGeo, steel);
    bracingMesh.material.wireframe = true;
    hullGroup.add(bracingMesh);

    group.add(hullGroup);

    parts.push({
        name: 'Inner_Containment_Hull',
        description: 'Massive dark steel shielding designed to withstand the crushing gravitational tidal forces near the cosmic string.',
        material: 'darkSteel',
        function: 'Protects the delicate harvester mechanisms from being ripped apart by spacetime curvature.',
        assemblyOrder: 2,
        connections: ['Cosmic_String_Core', 'Magnetic_Flux_Coils'],
        failureEffect: 'Hull breach leading to immediate gravitational crush of internal components.',
        cascadeFailures: ['Magnetic_Flux_Coils', 'Primary_Turbines'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 0, z: 0 }
    });

    // ==========================================
    // 3. MAGNETIC FLUX COILS
    // ==========================================
    const coilsGroup = new THREE.Group();
    const numCoils = 36;
    const coilMeshes = [];
    
    const coilGeo = new THREE.TorusGeometry(60, 4, 32, 100);
    for (let i = 0; i < numCoils; i++) {
        const coil = new THREE.Mesh(coilGeo, copper);
        const yPos = (i - numCoils/2) * (hullLength / numCoils);
        coil.position.set(0, yPos, 0);
        coil.rotation.x = Math.PI / 2;
        
        // Add tiny cooling tubes around each coil
        const coolingGeo = new THREE.TorusGeometry(66, 0.5, 8, 64);
        const coolingMesh = new THREE.Mesh(coolingGeo, glass);
        coolingMesh.rotation.x = Math.PI / 2;
        coil.add(coolingMesh);
        
        coilsGroup.add(coil);
        coilMeshes.push(coil);
    }
    group.add(coilsGroup);

    parts.push({
        name: 'Magnetic_Flux_Coils',
        description: 'Superconducting copper toroids generating a staggering 10^15 Tesla magnetic field.',
        material: 'copper',
        function: 'Contains and focuses the exotic plasma generated by string friction.',
        assemblyOrder: 3,
        connections: ['Inner_Containment_Hull', 'Power_Conduits'],
        failureEffect: 'Plasma containment failure, vaporizing the surrounding machinery.',
        cascadeFailures: ['Power_Conduits', 'Exotic_Energy_Capacitors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: 0, z: 0 }
    });

    // ==========================================
    // 4. PRIMARY & SECONDARY TURBINES
    // ==========================================
    const turbineGroup = new THREE.Group();
    const turbineMeshes = [];
    
    // Blade Profile
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -2);
    bladeShape.bezierCurveTo(15, -4, 35, 10, 45, 15);
    bladeShape.bezierCurveTo(30, 20, 10, 5, 0, 2);
    bladeShape.lineTo(0, -2);

    const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 2,
        bevelSize: 0.5,
        bevelThickness: 0.5,
        curveSegments: 12
    };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);

    const createTurbineStage = (yPos, radiusOffset, scale, isReversed, isAlpha) => {
        const stage = new THREE.Group();
        const numBlades = 64;
        
        // Hub
        const hubGeo = new THREE.CylinderGeometry(radiusOffset, radiusOffset, 10, 64);
        const hub = new THREE.Mesh(hubGeo, chrome);
        stage.add(hub);

        // Blades
        for (let i = 0; i < numBlades; i++) {
            const blade = new THREE.Mesh(bladeGeo, isAlpha ? aluminum : steel);
            const angle = (i / numBlades) * Math.PI * 2;
            blade.position.set(Math.cos(angle) * radiusOffset, 0, Math.sin(angle) * radiusOffset);
            
            // Complex orientation
            blade.rotation.y = -angle;
            blade.rotation.x = isReversed ? -Math.PI / 4 : Math.PI / 4;
            blade.scale.set(scale, scale, scale);
            
            stage.add(blade);
        }
        
        // Outer ring
        const outerRingGeo = new THREE.TorusGeometry(radiusOffset + 45 * scale, 2, 32, 128);
        const outerRing = new THREE.Mesh(outerRingGeo, darkSteel);
        outerRing.rotation.x = Math.PI / 2;
        stage.add(outerRing);

        stage.position.y = yPos;
        return stage;
    };

    const t1 = createTurbineStage(200, 70, 1.5, false, true);
    const t2 = createTurbineStage(150, 75, 1.6, true, true);
    const t3 = createTurbineStage(100, 80, 1.7, false, true);
    
    const t4 = createTurbineStage(-100, 80, 1.7, true, false);
    const t5 = createTurbineStage(-150, 75, 1.6, false, false);
    const t6 = createTurbineStage(-200, 70, 1.5, true, false);

    turbineGroup.add(t1, t2, t3, t4, t5, t6);
    turbineMeshes.push(t1, t2, t3, t4, t5, t6);
    group.add(turbineGroup);

    parts.push({
        name: 'Primary_Turbines_Alpha',
        description: 'Upper extraction array consisting of counter-rotating aluminum and chrome blades.',
        material: 'aluminum',
        function: 'Extracts kinetic and rotational frame-dragging energy from the string.',
        assemblyOrder: 4,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Severe rotational imbalance, leading to catastrophic shearing of the chassis.',
        cascadeFailures: ['Spacetime_Stabilizer_Gimbals'],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });
    
    parts.push({
        name: 'Secondary_Turbines_Beta',
        description: 'Lower extraction array made of high-density steel.',
        material: 'steel',
        function: 'Harvests secondary exotic matter outflows.',
        assemblyOrder: 5,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Loss of 40% power efficiency and tachyon buildup.',
        cascadeFailures: ['Exotic_Energy_Capacitors'],
        originalPosition: { x: 0, y: -150, z: 0 },
        explodedPosition: { x: 0, y: -400, z: 0 }
    });

    // ==========================================
    // 5. RADIATOR ARRAYS
    // ==========================================
    const radiatorsGroup = new THREE.Group();
    const numRadiatorBanks = 8;
    const finsPerBank = 120;
    
    const finGeo = new THREE.BoxGeometry(200, 4, 1);
    
    for (let b = 0; b < numRadiatorBanks; b++) {
        const bankGroup = new THREE.Group();
        const angle = (b / numRadiatorBanks) * Math.PI * 2;
        
        for (let f = 0; f < finsPerBank; f++) {
            const fin = new THREE.Mesh(finGeo, aluminum);
            const yOffset = (f - finsPerBank/2) * 6;
            fin.position.set(150, yOffset, 0); // Offset from center
            fin.rotation.z = Math.PI / 12; // Slanted up
            
            // Add tiny glowing heat lines
            if (f % 5 === 0) {
                const heatLine = new THREE.Mesh(new THREE.BoxGeometry(190, 0.5, 1.2), tachyonGlowMaterial);
                fin.add(heatLine);
            }
            
            bankGroup.add(fin);
        }
        
        bankGroup.rotation.y = angle;
        radiatorsGroup.add(bankGroup);
    }
    group.add(radiatorsGroup);

    parts.push({
        name: 'Radiator_Arrays',
        description: 'Massive banks of aluminum fins extending outward radially.',
        material: 'aluminum',
        function: 'Radiates the immense excess heat generated by spacetime friction into the cosmic microwave background.',
        assemblyOrder: 6,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Thermal runaway leading to hull melting and vaporization.',
        cascadeFailures: ['Inner_Containment_Hull', 'Magnetic_Flux_Coils'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 500 }
    });

    // ==========================================
    // 6. SPACETIME STABILIZER GIMBALS
    // ==========================================
    const gimbalsGroup = new THREE.Group();
    const gimbalMeshes = [];
    
    const createGimbal = (yPos) => {
        const gGroup = new THREE.Group();
        
        const r1 = new THREE.Mesh(new THREE.TorusGeometry(260, 10, 32, 100), chrome);
        const r2 = new THREE.Mesh(new THREE.TorusGeometry(280, 8, 32, 100), steel);
        const r3 = new THREE.Mesh(new THREE.TorusGeometry(300, 6, 32, 100), darkSteel);
        
        r1.rotation.x = Math.PI / 2;
        r2.rotation.y = Math.PI / 2;
        r3.rotation.z = Math.PI / 2;

        // Dampers connecting rings
        const damperGeo = new THREE.CylinderGeometry(3, 3, 20, 16);
        for(let i=0; i<4; i++) {
            const d = new THREE.Mesh(damperGeo, rubber);
            d.position.set(Math.cos(i*Math.PI/2)*270, Math.sin(i*Math.PI/2)*270, 0);
            r2.add(d);
        }
        
        gGroup.add(r1, r2, r3);
        gGroup.position.y = yPos;
        
        return { group: gGroup, rings: [r1, r2, r3] };
    };

    const gTop = createGimbal(450);
    const gBot = createGimbal(-450);
    gimbalsGroup.add(gTop.group, gBot.group);
    gimbalMeshes.push(gTop, gBot);
    group.add(gimbalsGroup);

    parts.push({
        name: 'Spacetime_Stabilizer_Gimbals',
        description: 'Multi-axis gyroscopic rings constructed of heavy metals and chrome.',
        material: 'chrome',
        function: 'Counteracts the unpredictable vibrations and topological snapping of the cosmic string.',
        assemblyOrder: 7,
        connections: ['Tension_Dampers'],
        failureEffect: 'Loss of attitude control, machine oscillates out of phase and shatters.',
        cascadeFailures: ['Habitat_Torus', 'Command_Nexus'],
        originalPosition: { x: 0, y: 450, z: 0 },
        explodedPosition: { x: 0, y: 700, z: 0 }
    });

    parts.push({
        name: 'Tension_Dampers',
        description: 'Hyper-elastic rubber and steel shock absorbers coupling the gimbals.',
        material: 'rubber',
        function: 'Absorbs micro-fractures in local spacetime.',
        assemblyOrder: 8,
        connections: ['Spacetime_Stabilizer_Gimbals'],
        failureEffect: 'Micro-vibrations translate into the main hull, causing metal fatigue.',
        cascadeFailures: ['Inner_Containment_Hull'],
        originalPosition: { x: 0, y: 450, z: 0 },
        explodedPosition: { x: -300, y: 700, z: 0 }
    });

    // ==========================================
    // 7. PARTICLE ACCELERATOR RINGS
    // ==========================================
    const acceleratorGroup = new THREE.Group();
    const particleRingMeshes = [];
    
    const createAccelerator = (yPos) => {
        const accGroup = new THREE.Group();
        
        // Main tunnel
        const tunnelGeo = new THREE.TorusGeometry(350, 20, 64, 128);
        const tunnel = new THREE.Mesh(tunnelGeo, steel);
        tunnel.rotation.x = Math.PI / 2;
        accGroup.add(tunnel);
        
        // Electromagnets along the ring
        const magGeo = new THREE.BoxGeometry(30, 50, 30);
        for(let i=0; i<36; i++) {
            const mag = new THREE.Mesh(magGeo, copper);
            const angle = (i / 36) * Math.PI * 2;
            mag.position.set(Math.cos(angle) * 350, 0, Math.sin(angle) * 350);
            mag.rotation.y = -angle;
            
            // Glowing node on magnet
            const node = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16), plasmaMaterial);
            node.position.y = 25;
            mag.add(node);
            
            accGroup.add(mag);
        }

        // Inner glowing plasma stream
        const streamGeo = new THREE.TorusGeometry(350, 5, 32, 128);
        const stream = new THREE.Mesh(streamGeo, plasmaMaterial);
        stream.rotation.x = Math.PI / 2;
        accGroup.add(stream);

        accGroup.position.y = yPos;
        return { group: accGroup, stream: stream };
    };

    const accTop = createAccelerator(300);
    const accBot = createAccelerator(-300);
    acceleratorGroup.add(accTop.group, accBot.group);
    particleRingMeshes.push(accTop.stream, accBot.stream);
    group.add(acceleratorGroup);

    parts.push({
        name: 'Accelerator_Ring_Upper',
        description: 'A massive circular particle accelerator.',
        material: 'steel',
        function: 'Generates antimatter to precisely balance the gravitational pull of the string.',
        assemblyOrder: 9,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Asymmetric gravitational forces pull the harvester into the string.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: 300, z: 0 },
        explodedPosition: { x: 0, y: 300, z: -500 }
    });

    parts.push({
        name: 'Accelerator_Ring_Lower',
        description: 'Secondary particle accelerator for vertical propulsion along the string.',
        material: 'copper',
        function: 'Accelerates exotic matter downwards to thrust the harvester upwards.',
        assemblyOrder: 10,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Loss of vertical mobility.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: -300, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 500 }
    });

    // ==========================================
    // 8. HABITAT TORUS & COMMAND NEXUS
    // ==========================================
    const habitatGroup = new THREE.Group();
    
    // Habitat Ring
    const habRingGeo = new THREE.TorusGeometry(450, 25, 64, 128);
    const habRing = new THREE.Mesh(habRingGeo, plastic);
    habRing.rotation.x = Math.PI / 2;
    habRing.position.y = 100;
    
    // Windows on Habitat Ring
    const windowGeo = new THREE.PlaneGeometry(10, 5);
    for(let i=0; i<72; i++) {
        const w = new THREE.Mesh(windowGeo, tinted);
        const angle = (i / 72) * Math.PI * 2;
        w.position.set(Math.cos(angle) * 476, 100, Math.sin(angle) * 476);
        w.rotation.y = -angle + Math.PI/2;
        habitatGroup.add(w);
    }
    habitatGroup.add(habRing);

    // Spokes connecting Habitat
    const spokeGeo = new THREE.CylinderGeometry(10, 10, 450, 32);
    for(let i=0; i<4; i++) {
        const spoke = new THREE.Mesh(spokeGeo, steel);
        spoke.rotation.x = Math.PI / 2;
        spoke.rotation.z = (i / 4) * Math.PI;
        spoke.position.y = 100;
        
        // Airlocks on spokes
        const airlock = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), darkSteel);
        airlock.position.y = 150;
        spoke.add(airlock);
        
        habitatGroup.add(spoke);
    }

    // Command Nexus (Top Center, suspended above top gimbal)
    const nexusGroup = new THREE.Group();
    nexusGroup.position.y = 600;
    
    const nexusCoreGeo = new THREE.SphereGeometry(40, 64, 64);
    const nexusCore = new THREE.Mesh(nexusCoreGeo, tinted);
    nexusGroup.add(nexusCore);
    
    const nexusRingGeo = new THREE.TorusGeometry(60, 5, 32, 64);
    const nexusRing = new THREE.Mesh(nexusRingGeo, chrome);
    nexusRing.rotation.x = Math.PI / 2;
    nexusGroup.add(nexusRing);
    
    // Antenna arrays
    const antennaGeo = new THREE.CylinderGeometry(1, 1, 100, 16);
    const a1 = new THREE.Mesh(antennaGeo, aluminum);
    a1.position.set(0, 70, 0);
    nexusGroup.add(a1);
    
    habitatGroup.add(nexusGroup);
    group.add(habitatGroup);

    parts.push({
        name: 'Habitat_Torus',
        description: 'A large spinning plastic and steel ring providing 1G artificial gravity.',
        material: 'plastic',
        function: 'Houses the 2,000 PhD researchers, operators, and mechanics.',
        assemblyOrder: 11,
        connections: ['Spokes', 'Inner_Containment_Hull'],
        failureEffect: 'Loss of life support and artificial gravity for crew.',
        cascadeFailures: ['Command_Nexus'],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: 800, y: 100, z: 0 }
    });

    parts.push({
        name: 'Command_Nexus',
        description: 'Spherical tinted glass and chrome observation deck.',
        material: 'tinted',
        function: 'Central control room monitoring topological stress and energy yields.',
        assemblyOrder: 12,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Loss of central command, forcing manual override from the habitat ring.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 600, z: 0 },
        explodedPosition: { x: 0, y: 900, z: 0 }
    });

    // ==========================================
    // 9. EXOTIC ENERGY CAPACITORS
    // ==========================================
    const capacitorGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(20, 20, 150, 32);
    
    for(let i=0; i<12; i++) {
        const cap = new THREE.Mesh(capGeo, glass);
        const angle = (i / 12) * Math.PI * 2;
        cap.position.set(Math.cos(angle) * 180, -250, Math.sin(angle) * 180);
        
        // Inner glowing core
        const capCore = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 140, 32), tachyonGlowMaterial);
        cap.add(capCore);
        
        // End caps
        const endGeo = new THREE.CylinderGeometry(22, 22, 10, 32);
        const topEnd = new THREE.Mesh(endGeo, darkSteel);
        topEnd.position.y = 80;
        const botEnd = new THREE.Mesh(endGeo, darkSteel);
        botEnd.position.y = -80;
        cap.add(topEnd, botEnd);
        
        capacitorGroup.add(cap);
    }
    group.add(capacitorGroup);

    parts.push({
        name: 'Exotic_Energy_Capacitors',
        description: 'Massive glass enclosures holding pure tachyonic plasma.',
        material: 'glass',
        function: 'Stores the harvested energy before it is beamed to relay stations.',
        assemblyOrder: 13,
        connections: ['Power_Conduits', 'Secondary_Turbines_Beta'],
        failureEffect: 'Tachyonic detonation, resulting in a localized causality inversion.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: -250, z: 0 },
        explodedPosition: { x: 0, y: -600, z: 0 }
    });

    // ==========================================
    // 10. POWER CONDUITS & EXHAUST VENTS
    // ==========================================
    const conduitsGroup = new THREE.Group();
    
    // Complex tube geometries snaking around the hull
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.cos(t * Math.PI * 8) * 120;
            const ty = (t - 0.5) * 800;
            const tz = Math.sin(t * Math.PI * 8) * 120;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    
    const path = new CustomSinCurve(1);
    const tubeGeo = new THREE.TubeGeometry(path, 200, 8, 16, false);
    
    for(let i=0; i<4; i++) {
        const tube = new THREE.Mesh(tubeGeo, copper);
        tube.rotation.y = (i / 4) * Math.PI * 2;
        conduitsGroup.add(tube);
    }

    // Exhaust Vents
    const ventGeo = new THREE.CylinderGeometry(15, 25, 40, 16);
    for(let i=0; i<8; i++) {
        const vent = new THREE.Mesh(ventGeo, darkSteel);
        const angle = (i / 8) * Math.PI * 2;
        vent.position.set(Math.cos(angle) * 130, -400, Math.sin(angle) * 130);
        vent.rotation.x = Math.PI / 2;
        vent.rotation.z = -angle;
        
        // Vent glow
        const ventGlow = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 42, 16), plasmaMaterial);
        ventGlow.position.y = 2;
        vent.add(ventGlow);
        
        conduitsGroup.add(vent);
    }
    group.add(conduitsGroup);

    parts.push({
        name: 'Power_Conduits',
        description: 'Thick copper piping wrapped helically around the inner hull.',
        material: 'copper',
        function: 'Transfers raw plasma from the flux coils to the capacitors.',
        assemblyOrder: 14,
        connections: ['Magnetic_Flux_Coils', 'Exotic_Energy_Capacitors'],
        failureEffect: 'Plasma leak, melting through the hull.',
        cascadeFailures: ['Inner_Containment_Hull'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 400, y: 0, z: 400 }
    });
    
    parts.push({
        name: 'Plasma_Vents',
        description: 'Directional exhaust ports at the base.',
        material: 'darkSteel',
        function: 'Vents unstable tachyon byproducts to prevent capacitor overload.',
        assemblyOrder: 15,
        connections: ['Power_Conduits'],
        failureEffect: 'Backpressure build-up causing capacitor rupture.',
        cascadeFailures: ['Exotic_Energy_Capacitors'],
        originalPosition: { x: 0, y: -400, z: 0 },
        explodedPosition: { x: 0, y: -800, z: 0 }
    });

    parts.push({
        name: 'Quantum_Locking_Nodes',
        description: 'Superconducting nodes pinning the harvester to the metric.',
        material: 'steel',
        function: 'Maintains positional stability relative to the string.',
        assemblyOrder: 16,
        connections: ['Inner_Containment_Hull'],
        failureEffect: 'Harvester slides uncontrollably along the string at relativistic speeds.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -800 }
    });

    // ==========================================
    // 11. PARTICLES & SPARKS (EXOTIC ENERGY)
    // ==========================================
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = [];
    
    for (let i = 0; i < particleCount; i++) {
        particlePos[i*3] = (Math.random() - 0.5) * 200;
        particlePos[i*3+1] = (Math.random() - 0.5) * 1000;
        particlePos[i*3+2] = (Math.random() - 0.5) * 200;
        
        particleVel.push({
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 50,
            z: (Math.random() - 0.5) * 10
        });
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    
    // Create a custom shader material for glowing sparks
    const sparkMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeo, sparkMaterial);
    group.add(particleSystem);


    // ==========================================
    // DESCRIPTION & QUIZ
    // ==========================================
    const description = "The God Tier Cosmic String Harvester. A colossal, hyper-advanced megastructure designed to clasp onto a 1-dimensional topological defect in the spacetime metric. It extracts rotational frame-dragging energy, harnesses raw tachyon plasma, and utilizes antimatter accelerators for stabilization. Built with extreme precision, it features counter-rotating multi-stage turbines, massive radiator banks, gyroscopic spacetime stabilizers, and a spinning habitat ring for the crew of theoretical physicists.";

    const quizQuestions = [
        {
            question: "In the context of cosmic strings, the metric outside a straight, infinite, static cosmic string is locally flat but has a conical singularity. What is the deficit angle Δφ in terms of the string's linear mass density μ?",
            options: [
                "A) 8πGμ",
                "B) 4πGμ",
                "C) 2Gμ / c^2",
                "D) 16πGμ"
            ],
            answer: "A) 8πGμ"
        },
        {
            question: "If a cosmic string loop oscillates and decays primarily via gravitational radiation, the power radiated is proportional to ΓGμ^2, where μ is the string tension. For typical Abelian Higgs strings, what is the order of magnitude of the dimensionless constant Γ?",
            options: [
                "A) ~1",
                "B) ~50",
                "C) ~10^5",
                "D) ~10^-3"
            ],
            answer: "B) ~50"
        },
        {
            question: "Cosmic strings can be formed during a symmetry breaking phase transition in the early universe. According to the Kibble mechanism, the correlation length ξ of the Higgs field at the time of the transition bounds the initial density of strings. This is a topological consequence of:",
            options: [
                "A) The first homotopy group π1(M) of the vacuum manifold being non-trivial.",
                "B) The second homotopy group π2(M) being non-trivial.",
                "C) The third homotopy group π3(M) being trivial.",
                "D) Exact parity conservation in the early universe."
            ],
            answer: "A) The first homotopy group π1(M) of the vacuum manifold being non-trivial."
        },
        {
            question: "The interaction between a cosmic string and surrounding plasma can generate a wake. If a cosmic string moves with transverse velocity v_s through a medium, the velocity perturbation of particles falling into the wake is approximately:",
            options: [
                "A) 4πGμv_sγ_s",
                "B) 8πGμ / v_s",
                "C) Gμ / (c^2 v_s)",
                "D) 2πGμγ_s^2"
            ],
            answer: "A) 4πGμv_sγ_s"
        },
        {
            question: "Cosmic superstrings, unlike conventional field-theoretic strings, can have multiple tensions because they can form bound states of p F-strings and q D-strings. The tension of a (p,q) string is proportional to:",
            options: [
                "A) √(p^2 + q^2/g_s^2)",
                "B) p + q/g_s",
                "C) √(p + q)/g_s",
                "D) p^2 g_s + q^2"
            ],
            answer: "A) √(p^2 + q^2/g_s^2)"
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        // String Vibration
        const intensity = 5 * speed;
        cosmicStringMesh.scale.x = 1 + Math.sin(time * 20 * speed) * 0.05;
        cosmicStringMesh.scale.z = 1 + Math.cos(time * 25 * speed) * 0.05;
        cosmicStringMaterial.emissiveIntensity = 200 + Math.sin(time * 10 * speed) * 50;

        // Turbines Rotation (Extreme RPM)
        turbineMeshes[0].rotation.y += 0.2 * speed;
        turbineMeshes[1].rotation.y -= 0.25 * speed;
        turbineMeshes[2].rotation.y += 0.3 * speed;
        
        turbineMeshes[3].rotation.y -= 0.2 * speed;
        turbineMeshes[4].rotation.y += 0.25 * speed;
        turbineMeshes[5].rotation.y -= 0.3 * speed;

        // Habitat Ring Rotation (Slower, simulating gravity)
        habitatGroup.rotation.y += 0.005 * speed;

        // Accelerator Plasma Streams (Pulsing and rotating)
        particleRingMeshes[0].rotation.z -= 0.1 * speed;
        particleRingMeshes[1].rotation.z += 0.1 * speed;
        plasmaMaterial.emissiveIntensity = 5 + Math.sin(time * 5 * speed) * 3;

        // Gimbal Gyroscope Stabilization
        gimbalMeshes.forEach((g, idx) => {
            const r1 = g.rings[0];
            const r2 = g.rings[1];
            const r3 = g.rings[2];
            
            const dir = idx === 0 ? 1 : -1;
            
            r1.rotation.y = Math.sin(time * 2 * speed) * 0.5 * dir;
            r2.rotation.x = Math.cos(time * 1.5 * speed) * 0.4 * dir;
            r3.rotation.z = Math.sin(time * 2.5 * speed) * 0.3 * dir;
        });

        // Particle System Animation
        const positions = particleSystem.geometry.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            positions[i*3] += particleVel[i].x * speed;
            positions[i*3+1] += particleVel[i].y * speed;
            positions[i*3+2] += particleVel[i].z * speed;
            
            // Constrain to cylindrical area around the string
            const dist = Math.sqrt(positions[i*3]*positions[i*3] + positions[i*3+2]*positions[i*3+2]);
            if (dist > 300 || positions[i*3+1] > 1000 || positions[i*3+1] < -1000) {
                positions[i*3] = (Math.random() - 0.5) * 50;
                positions[i*3+1] = (Math.random() - 0.5) * 2000;
                positions[i*3+2] = (Math.random() - 0.5) * 50;
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}
