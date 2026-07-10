import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animationCallbacks = [];

    // ============================================================================
    // ADVANCED MATERIAL DEFINITIONS
    // ============================================================================
    const matVoid = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const matEventHorizon = new THREE.MeshStandardMaterial({
        color: 0x110033, emissive: 0x3300ff, emissiveIntensity: 2.0, 
        transparent: true, opacity: 0.8, side: THREE.DoubleSide
    });
    const matPhotonSphere = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 8.0, 
        transparent: true, opacity: 0.9, side: THREE.DoubleSide
    });
    const matLaserBeam = new THREE.MeshBasicMaterial({
        color: 0x00ffff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const matPlasmaRed = new THREE.MeshStandardMaterial({
        color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 6.0,
        transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const matPlasmaBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 6.0,
        transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const matNeonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 3.0 });
    const matNeonPurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0x8800ff, emissiveIntensity: 3.0 });
    const matNeonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00cc00, emissiveIntensity: 3.0 });
    const matDarkMatter = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    const matHyperChrome = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, metalness: 1.0 });
    const matGoldCoil = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.3, metalness: 0.8 });

    // ============================================================================
    // UTILITY FUNCTIONS FOR PROCEDURAL GEOMETRY
    // ============================================================================
    function createGearProfile(teeth, outerRadius, innerRadius, toothDepth) {
        const shape = new THREE.Shape();
        const steps = teeth * 2;
        const angleStep = (Math.PI * 2) / steps;
        for (let i = 0; i < steps; i++) {
            const radius = i % 2 === 0 ? outerRadius : outerRadius - toothDepth;
            const a = i * angleStep;
            if (i === 0) shape.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
            else shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
        }
        shape.closePath();
        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
        shape.holes.push(hole);
        return shape;
    }

    function createHexagonProfile(radius) {
        const shape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            if (i === 0) shape.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
            else shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
        }
        shape.closePath();
        return shape;
    }

    // ============================================================================
    // PART 1: CENTRAL KUGELBLITZ SINGULARITY
    // ============================================================================
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(4, 128, 128);
    const coreMesh = new THREE.Mesh(coreGeo, matVoid);
    coreGroup.add(coreMesh);
    group.add(coreGroup);

    parts.push({
        name: "Central_Kugelblitz_Singularity",
        description: "The primary event horizon created by the converging light. Extremely massive despite having no baryonic origin. It consumes ambient energy to maintain its Schwarzschild radius.",
        material: "Absolute Void",
        function: "Source of extreme gravitational pull and spacetime distortion. Anchors the energy matrix.",
        assemblyOrder: 25,
        connections: ["Event_Horizon_Accretion_Disk", "Photon_Convergence_Sphere"],
        failureEffect: "Instantaneous evaporation via Hawking radiation, releasing energy equivalent to 10^15 megatons of TNT.",
        cascadeFailures: ["Vaporization of the containment facility", "Destruction of the local star system"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        // Core breathing effect due to quantum fluctuations
        const scale = 1.0 + Math.sin(time * speed * 3.0) * 0.01;
        coreMesh.scale.set(scale, scale, scale);
    });

    // ============================================================================
    // PART 2: EVENT HORIZON ACCRETION DISK (PLASMA)
    // ============================================================================
    const accretionGroup = new THREE.Group();
    const diskGeo1 = new THREE.RingGeometry(5, 12, 128, 64);
    const diskMesh1 = new THREE.Mesh(diskGeo1, matPlasmaRed);
    diskMesh1.rotation.x = Math.PI / 2;
    accretionGroup.add(diskMesh1);
    
    const diskGeo2 = new THREE.RingGeometry(12, 25, 128, 64);
    const diskMesh2 = new THREE.Mesh(diskGeo2, matPlasmaBlue);
    diskMesh2.rotation.x = Math.PI / 2;
    diskMesh2.position.y = 0.5;
    accretionGroup.add(diskMesh2);

    group.add(accretionGroup);

    parts.push({
        name: "Event_Horizon_Accretion_Disk",
        description: "A hyper-accelerated disk of ionized plasma orbiting just outside the photon sphere, rotating at 0.99c. Generates immense frame-dragging.",
        material: "Ultra-hot Ionized Plasma",
        function: "Bleeds off excess angular momentum and prevents extreme Lense-Thirring effect from destabilizing the core.",
        assemblyOrder: 24,
        connections: ["Central_Kugelblitz_Singularity", "Photon_Convergence_Sphere"],
        failureEffect: "Plasma jet ejection at relativistic speeds slicing through the facility.",
        cascadeFailures: ["Gamma_Ray_Array_Equator destruction", "Magnetic containment breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        diskMesh1.rotation.z -= 0.15 * speed;
        diskMesh2.rotation.z -= 0.05 * speed;
        diskMesh1.material.opacity = 0.7 + Math.sin(time * speed * 10) * 0.2;
    });

    // ============================================================================
    // PART 3: PHOTON CONVERGENCE SPHERE
    // ============================================================================
    const convergenceGeo = new THREE.SphereGeometry(35, 64, 64);
    const convergenceMesh = new THREE.Mesh(convergenceGeo, matPhotonSphere);
    group.add(convergenceMesh);

    parts.push({
        name: "Photon_Convergence_Sphere",
        description: "The blinding focal region where thousands of gamma-ray beams overlap, creating an energy density sufficient to warp spacetime into a closed loop.",
        material: "Pure Photonic Energy",
        function: "Acts as the precursor energy state before collapse into the Kugelblitz.",
        assemblyOrder: 23,
        connections: ["Gamma_Ray_Array_North", "Gamma_Ray_Array_South"],
        failureEffect: "Loss of focal point resulting in a blinding flash that incinerates the inner rings.",
        cascadeFailures: ["Core collapse", "Runaway expansion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        const s = 1.0 + Math.sin(time * speed * 5.0) * 0.03;
        convergenceMesh.scale.set(s, s, s);
        convergenceMesh.material.emissiveIntensity = 8.0 + Math.sin(time * speed * 8.0) * 2.0;
    });

    // ============================================================================
    // PART 4: GAMMA RAY ARRAY NORTH
    // ============================================================================
    const northEmittersGroup = new THREE.Group();
    const emitterGeo = new THREE.CylinderGeometry(1, 2, 12, 16);
    emitterGeo.translate(0, 6, 0); 
    const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, 160, 8);
    beamGeo.translate(0, 80, 0); 
    
    const numEmittersNorth = 400;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const lasersNorth = [];

    for (let i = 0; i < numEmittersNorth; i++) {
        const t = i / (numEmittersNorth - 1);
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = 2 * Math.PI * goldenRatio * i;
        if (inclination > Math.PI / 3) continue; // Only top dome
        
        const r = 200;
        const x = r * Math.sin(inclination) * Math.cos(azimuth);
        const y = r * Math.cos(inclination);
        const z = r * Math.sin(inclination) * Math.sin(azimuth);
        
        const emitter = new THREE.Mesh(emitterGeo, matHyperChrome);
        emitter.position.set(x, y, z);
        
        const target = new THREE.Vector3(0, 0, 0);
        emitter.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), target.clone().sub(emitter.position).normalize());
        
        const beam = new THREE.Mesh(beamGeo, matLaserBeam);
        lasersNorth.push(beam);
        emitter.add(beam);
        northEmittersGroup.add(emitter);
    }
    group.add(northEmittersGroup);

    parts.push({
        name: "Gamma_Ray_Array_North",
        description: "A dense geodesic array of ultra-high-powered gamma-ray lasers firing continuously into the convergence center.",
        material: "HyperChrome and Sapphire Lenses",
        function: "Provides 33% of the total photonic energy required to sustain the Kugelblitz mass.",
        assemblyOrder: 15,
        connections: ["Primary_Spaceframe_Support_Structure", "Photon_Convergence_Sphere"],
        failureEffect: "Asymmetric energy distribution causing the singularity to drift off-center.",
        cascadeFailures: ["Singularity impacts containment walls", "Immediate catastrophic breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        lasersNorth.forEach((beam, idx) => {
            beam.material.opacity = 0.5 + Math.sin(time * speed * 20.0 + idx) * 0.4;
        });
    });

    // ============================================================================
    // PART 5: GAMMA RAY ARRAY SOUTH
    // ============================================================================
    const southEmittersGroup = new THREE.Group();
    const lasersSouth = [];

    for (let i = 0; i < numEmittersNorth; i++) {
        const t = i / (numEmittersNorth - 1);
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = 2 * Math.PI * goldenRatio * i;
        if (inclination < Math.PI - Math.PI / 3) continue; // Only bottom dome
        
        const r = 200;
        const x = r * Math.sin(inclination) * Math.cos(azimuth);
        const y = r * Math.cos(inclination);
        const z = r * Math.sin(inclination) * Math.sin(azimuth);
        
        const emitter = new THREE.Mesh(emitterGeo, chrome);
        emitter.position.set(x, y, z);
        
        const target = new THREE.Vector3(0, 0, 0);
        emitter.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), target.clone().sub(emitter.position).normalize());
        
        const beam = new THREE.Mesh(beamGeo, matLaserBeam);
        lasersSouth.push(beam);
        emitter.add(beam);
        southEmittersGroup.add(emitter);
    }
    group.add(southEmittersGroup);

    parts.push({
        name: "Gamma_Ray_Array_South",
        description: "The mirrored geodesic array of gamma-ray lasers on the southern hemisphere, ensuring perfect spherical symmetry of energy density.",
        material: "Chrome and Sapphire Lenses",
        function: "Provides 33% of the total photonic energy and balances the gravitational vector.",
        assemblyOrder: 16,
        connections: ["Primary_Spaceframe_Support_Structure", "Photon_Convergence_Sphere"],
        failureEffect: "Gravitational vector drift downwards.",
        cascadeFailures: ["Floor breach", "Planetary core descent"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        lasersSouth.forEach((beam, idx) => {
            beam.material.opacity = 0.5 + Math.sin(time * speed * 20.0 + idx + 100) * 0.4;
        });
    });

    // ============================================================================
    // PART 6: GAMMA RAY ARRAY EQUATOR
    // ============================================================================
    const equatorEmittersGroup = new THREE.Group();
    const numEmittersEq = 360;
    const lasersEq = [];
    
    for (let i = 0; i < numEmittersEq; i++) {
        const angle = (Math.PI * 2 / numEmittersEq) * i;
        const r = 200;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        
        const emitter = new THREE.Mesh(emitterGeo, darkSteel);
        emitter.position.set(x, 0, z);
        const target = new THREE.Vector3(0, 0, 0);
        emitter.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), target.clone().sub(emitter.position).normalize());
        
        const beam = new THREE.Mesh(beamGeo, matLaserBeam);
        lasersEq.push(beam);
        emitter.add(beam);
        equatorEmittersGroup.add(emitter);
    }
    group.add(equatorEmittersGroup);

    parts.push({
        name: "Gamma_Ray_Array_Equator",
        description: "A continuous dense ring of gamma-ray emitters slicing the accretion disk plane to counteract the Lense-Thirring frame-dragging.",
        material: "Dark Steel and Heavy Water Cooling Jackets",
        function: "Delivers equatorial counter-rotational energy flux.",
        assemblyOrder: 17,
        connections: ["Event_Horizon_Accretion_Disk", "Primary_Spaceframe_Support_Structure"],
        failureEffect: "Runaway frame dragging causing the spacetime fabric to twist catastrophically.",
        cascadeFailures: ["Spacetime localized tear", "Chronological paradox loops"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });

    animationCallbacks.push((time, speed) => {
        lasersEq.forEach((beam, idx) => {
            beam.material.opacity = 0.5 + Math.sin(time * speed * 20.0 + idx * 0.1) * 0.4;
        });
    });

    // ============================================================================
    // PART 7: SUPERCONDUCTING CONTAINMENT TORUS INNER
    // ============================================================================
    const innerTorusGeo = new THREE.TorusGeometry(50, 4, 32, 100);
    const innerTorus = new THREE.Mesh(innerTorusGeo, aluminum);
    innerTorus.rotation.x = Math.PI / 2;
    group.add(innerTorus);
    
    // Add glowing magnetic bands
    const bandGeo = new THREE.TorusGeometry(50.5, 1, 16, 100);
    const bandMesh = new THREE.Mesh(bandGeo, matNeonCyan);
    bandMesh.rotation.x = Math.PI / 2;
    group.add(bandMesh);

    parts.push({
        name: "Superconducting_Containment_Torus_Inner",
        description: "The primary inner magnetic containment ring cooled to 0.1 Kelvin, generating a 10^10 Tesla field to repel charged particles from the core.",
        material: "Niobium-Titanium Superconductor (Aluminum sheathed)",
        function: "Confines the inner accretion disk plasma and prevents it from melting the emitter arrays.",
        assemblyOrder: 10,
        connections: ["Event_Horizon_Accretion_Disk", "Superfluid_Helium_Coolant_Pipes"],
        failureEffect: "Plasma wave washes over the inner emitters.",
        cascadeFailures: ["North and South Arrays melt down", "Total Loss of Confinement"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        innerTorus.rotation.z += 0.01 * speed;
        bandMesh.rotation.z += 0.01 * speed;
        bandMesh.material.emissiveIntensity = 3.0 + Math.sin(time * speed * 10) * 1.5;
    });

    // ============================================================================
    // PART 8: SUPERCONDUCTING CONTAINMENT TORUS MID
    // ============================================================================
    const midTorusGroup = new THREE.Group();
    const midTorusGeo = new THREE.TorusGeometry(80, 6, 32, 100);
    const midTorus = new THREE.Mesh(midTorusGeo, steel);
    midTorusGroup.add(midTorus);
    
    const midBandGeo = new THREE.TorusGeometry(80.5, 1.5, 16, 100);
    const midBandMesh = new THREE.Mesh(midBandGeo, matNeonPurple);
    midTorusGroup.add(midBandMesh);
    
    midTorusGroup.rotation.x = Math.PI / 4;
    group.add(midTorusGroup);

    parts.push({
        name: "Superconducting_Containment_Torus_Mid",
        description: "A secondary containment ring operating on an off-axis orbital plane to create a perfectly spherical magnetic bottle.",
        material: "Yttrium Barium Copper Oxide (YBCO)",
        function: "Provides 3D stability to the plasma bubble and stabilizes gravitational waves.",
        assemblyOrder: 11,
        connections: ["Superfluid_Helium_Coolant_Pipes"],
        failureEffect: "Magnetic bottle leakage at the poles.",
        cascadeFailures: ["Plasma jets strike support structure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -100, y: 0, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        midTorusGroup.rotation.y += 0.02 * speed;
        midTorusGroup.rotation.z += 0.005 * speed;
    });

    // ============================================================================
    // PART 9: SUPERCONDUCTING CONTAINMENT TORUS OUTER
    // ============================================================================
    const outerTorusGroup = new THREE.Group();
    const outerTorusGeo = new THREE.TorusGeometry(120, 8, 64, 100);
    const outerTorus = new THREE.Mesh(outerTorusGeo, darkSteel);
    outerTorusGroup.add(outerTorus);
    
    const outerBandGeo = new THREE.TorusGeometry(120.5, 2, 16, 100);
    const outerBandMesh = new THREE.Mesh(outerBandGeo, matNeonGreen);
    outerTorusGroup.add(outerBandMesh);
    
    outerTorusGroup.rotation.x = -Math.PI / 4;
    group.add(outerTorusGroup);

    parts.push({
        name: "Superconducting_Containment_Torus_Outer",
        description: "The massive outer stabilization ring that acts as the final barrier. It oscillates to actively cancel low-frequency gravitational waves.",
        material: "Carbyne-Reinforced Steel",
        function: "Dampens extreme gravitational vibrations to prevent the facility from shaking itself to dust.",
        assemblyOrder: 12,
        connections: ["Gravitational_Wave_Dampening_Gears"],
        failureEffect: "Facility undergoes severe seismic disruption.",
        cascadeFailures: ["Coolant pipe ruptures", "Structural collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: 0, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        outerTorusGroup.rotation.y -= 0.015 * speed;
        outerTorusGroup.rotation.x = -Math.PI / 4 + Math.sin(time * speed * 2) * 0.05;
    });

    // ============================================================================
    // PART 10: HAWKING RADIATION COLLECTOR ARRAY
    // ============================================================================
    const hawkingGroup = new THREE.Group();
    const collectorGeo = new THREE.BoxGeometry(4, 8, 4);
    const numCollectors = 32;
    for (let i = 0; i < numCollectors; i++) {
        const angle = (Math.PI * 2 / numCollectors) * i;
        const r = 25;
        const collector = new THREE.Mesh(collectorGeo, chrome);
        collector.position.set(Math.cos(angle) * r, 20, Math.sin(angle) * r);
        collector.lookAt(0, 0, 0);
        
        // Add tiny neon panels
        const panelGeo = new THREE.PlaneGeometry(3, 3);
        const panel = new THREE.Mesh(panelGeo, matNeonCyan);
        panel.position.z = 2.1; // slightly in front
        collector.add(panel);
        
        hawkingGroup.add(collector);
    }
    group.add(hawkingGroup);

    parts.push({
        name: "Hawking_Radiation_Collector_Array",
        description: "A ring of advanced quantum sensors and energy absorbers placed just outside the photon sphere to harvest evaporating thermal energy from the singularity.",
        material: "Beryllium Mirrors and Chrome Housings",
        function: "Recaptures escaping energy to power the auxiliary systems and monitors mass loss.",
        assemblyOrder: 18,
        connections: ["Central_Kugelblitz_Singularity", "Auxiliary_Power_Capacitor_Banks"],
        failureEffect: "Waste heat buildup.",
        cascadeFailures: ["Thermal runaway in inner systems"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        hawkingGroup.rotation.y += 0.05 * speed;
    });

    // ============================================================================
    // PART 11: TIME DILATION MONITOR
    // ============================================================================
    const timeMonitorGroup = new THREE.Group();
    const monitorGeo = new THREE.OctahedronGeometry(5, 0);
    const monitorMesh = new THREE.Mesh(monitorGeo, matNeonPurple);
    monitorMesh.position.set(0, 100, 0);
    
    // Add orbiting satellites to the monitor
    const satGeo = new THREE.SphereGeometry(1, 16, 16);
    const sat1 = new THREE.Mesh(satGeo, matNeonCyan);
    sat1.position.set(8, 0, 0);
    const sat2 = new THREE.Mesh(satGeo, matNeonGreen);
    sat2.position.set(-8, 0, 0);
    monitorMesh.add(sat1);
    monitorMesh.add(sat2);
    
    timeMonitorGroup.add(monitorMesh);
    group.add(timeMonitorGroup);

    parts.push({
        name: "Time_Dilation_Monitor",
        description: "A precision atomic clock assembly hovering directly above the north pole of the core. It measures the discrepancy between local time and asymptotic time to deduce exact gravitational strength.",
        material: "Strontium Lattice and Purple Neon Indicators",
        function: "Provides real-time feedback for the Spacetime Warping Coils.",
        assemblyOrder: 19,
        connections: ["Spacetime_Warping_Helical_Coils"],
        failureEffect: "Loss of synchronization in emitter firing sequence.",
        cascadeFailures: ["Constructive interference failure", "Kugelblitz dissolution"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        monitorMesh.rotation.y -= 0.1 * speed;
        monitorMesh.rotation.x += 0.05 * speed;
        monitorMesh.position.y = 100 + Math.sin(time * speed * 2) * 5;
    });

    // ============================================================================
    // PART 12: SPACETIME WARPING HELICAL COILS
    // ============================================================================
    const helixGroup = new THREE.Group();
    const points = [];
    const numTurns = 5;
    const height = 300;
    const radius = 180;
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const angle = t * Math.PI * 2 * numTurns;
        const y = (t - 0.5) * height;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const helixCurve = new THREE.CatmullRomCurve3(points);
    const helixGeo = new THREE.TubeGeometry(helixCurve, 200, 3, 16, false);
    const helixMesh = new THREE.Mesh(helixGeo, matGoldCoil);
    helixGroup.add(helixMesh);

    // Second interwoven helix
    const points2 = [];
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const angle = t * Math.PI * 2 * numTurns + Math.PI; // offset by Pi
        const y = (t - 0.5) * height;
        points2.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const helixCurve2 = new THREE.CatmullRomCurve3(points2);
    const helixGeo2 = new THREE.TubeGeometry(helixCurve2, 200, 3, 16, false);
    const helixMesh2 = new THREE.Mesh(helixGeo2, matGoldCoil);
    helixGroup.add(helixMesh2);

    group.add(helixGroup);

    parts.push({
        name: "Spacetime_Warping_Helical_Coils",
        description: "Massive interwoven gold-plated coils that generate negative energy densities via the Casimir effect to counteract the extreme gravity well from expanding beyond the safety threshold.",
        material: "Gold-Plated Exotic Metamaterials",
        function: "Maintains the boundary conditions of the localized spacetime metric.",
        assemblyOrder: 8,
        connections: ["Primary_Spaceframe_Support_Structure", "Time_Dilation_Monitor"],
        failureEffect: "Event horizon expands uncontrollably.",
        cascadeFailures: ["Complete spaghettification of the facility"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Explodes outwards radially? Let's just say fixed
    });

    animationCallbacks.push((time, speed) => {
        helixGroup.rotation.y += 0.005 * speed;
        helixMesh.material.emissive = new THREE.Color(0xffaa00);
        helixMesh.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 3) * 0.5;
        helixMesh2.material.emissive = new THREE.Color(0xffaa00);
        helixMesh2.material.emissiveIntensity = 1.0 + Math.cos(time * speed * 3) * 0.5;
    });

    // ============================================================================
    // PART 13: PRIMARY SPACEFRAME SUPPORT STRUCTURE
    // ============================================================================
    const spaceframeGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(6, 16, 16);
    const strutGeo = new THREE.CylinderGeometry(2, 2, 1, 8);
    strutGeo.rotateX(Math.PI / 2);
    
    // Creating a massive complex icosahedron-like outer shell
    const radiusFrame = 220;
    const phi = (1 + Math.sqrt(5)) / 2;
    const icosahedronVertices = [
        [-1,  phi,  0], [ 1,  phi,  0], [-1, -phi,  0], [ 1, -phi,  0],
        [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
        [ phi,  0, -1], [ phi,  0,  1], [-phi,  0, -1], [-phi,  0,  1]
    ];
    
    const sfNodes = icosahedronVertices.map(v => {
        const vec = new THREE.Vector3(v[0], v[1], v[2]).normalize().multiplyScalar(radiusFrame);
        const node = new THREE.Mesh(nodeGeo, steel);
        node.position.copy(vec);
        spaceframeGroup.add(node);
        return vec;
    });

    for (let i = 0; i < sfNodes.length; i++) {
        for (let j = i + 1; j < sfNodes.length; j++) {
            const d = sfNodes[i].distanceTo(sfNodes[j]);
            if (d < radiusFrame * 1.2) { // connect nearest neighbors
                const strut = new THREE.Mesh(strutGeo, darkSteel);
                strut.scale.set(1, 1, d);
                strut.position.copy(sfNodes[i]).lerp(sfNodes[j], 0.5);
                strut.lookAt(sfNodes[j]);
                spaceframeGroup.add(strut);
            }
        }
    }
    group.add(spaceframeGroup);

    parts.push({
        name: "Primary_Spaceframe_Support_Structure",
        description: "The overarching skeletal framework holding all massive arrays in perfect alignment down to the sub-nanometer level.",
        material: "Titanium-Tungsten Alloy",
        function: "Provides absolute rigidity against gravitational tidal forces.",
        assemblyOrder: 1,
        connections: ["Gamma_Ray_Array_North", "Gamma_Ray_Array_South", "Gamma_Ray_Array_Equator"],
        failureEffect: "Structural shear and collapse.",
        cascadeFailures: ["Complete implosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        // Spaceframe remains rigid, but emits a very slow metallic pulse
        // (Just keeping it static for contrast to the chaos inside)
    });

    // ============================================================================
    // PART 14: SUPERFLUID HELIUM COOLANT PIPES
    // ============================================================================
    const pipesGroup = new THREE.Group();
    const pipePoints = [
        new THREE.Vector3(0, -300, 100),
        new THREE.Vector3(100, -200, 150),
        new THREE.Vector3(150, -50, 120),
        new THREE.Vector3(200, 0, 80),
        new THREE.Vector3(150, 50, 40),
        new THREE.Vector3(100, 150, 20),
        new THREE.Vector3(0, 300, 0)
    ];

    const particleSystem = [];
    const plasmaPartGeo = new THREE.SphereGeometry(3, 8, 8);

    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const pts = pipePoints.map(p => {
            const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
            const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
            return new THREE.Vector3(x, p.y, z);
        });
        const curve = new THREE.CatmullRomCurve3(pts);
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 5, 16, false);
        const pipe = new THREE.Mesh(tubeGeo, copper);
        pipesGroup.add(pipe);

        // Add animated coolant particles flowing through
        for (let j = 0; j < 5; j++) {
            const particle = new THREE.Mesh(plasmaPartGeo, matNeonCyan);
            pipesGroup.add(particle);
            particleSystem.push({ mesh: particle, curve: curve, progress: j / 5 });
        }
    }
    group.add(pipesGroup);

    parts.push({
        name: "Superfluid_Helium_Coolant_Pipes",
        description: "An intricate network of massive copper conduits pumping superfluid helium at 0.1 Kelvin to counteract the absurd heat output of the lasers.",
        material: "Oxygen-Free High Thermal Conductivity Copper",
        function: "Maintains operational temperatures for the superconductors and gamma arrays.",
        assemblyOrder: 5,
        connections: ["Superconducting_Containment_Torus_Inner", "Primary_Spaceframe_Support_Structure"],
        failureEffect: "Superconductor quench.",
        cascadeFailures: ["Magnetic containment loss", "Explosive decompression"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        particleSystem.forEach(p => {
            p.progress += speed * 0.005;
            if (p.progress > 1) p.progress -= 1;
            const pt = p.curve.getPoint(p.progress);
            p.mesh.position.copy(pt);
        });
    });

    // ============================================================================
    // PART 15: PLASMA ENERGY FEED LINES
    // ============================================================================
    const feedGroup = new THREE.Group();
    // Intertwined with coolant pipes but carrying hot plasma
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i + (Math.PI / 8); // Offset
        const pts = pipePoints.map(p => {
            const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
            const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
            return new THREE.Vector3(x * 1.1, -p.y, z * 1.1); // Inverted Y, wider
        });
        const curve = new THREE.CatmullRomCurve3(pts);
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 4, 16, false);
        const pipe = new THREE.Mesh(tubeGeo, glass);
        
        // Inner plasma line
        const plasmaLineGeo = new THREE.TubeGeometry(curve, 100, 2, 16, false);
        const plasmaLine = new THREE.Mesh(plasmaLineGeo, matPlasmaRed);
        feedGroup.add(pipe);
        feedGroup.add(plasmaLine);
    }
    group.add(feedGroup);

    parts.push({
        name: "Plasma_Energy_Feed_Lines",
        description: "Glass-sheathed magnetic tubes feeding ultra-hot plasma directly into the accretion disk to maintain angular momentum.",
        material: "Transparent Aluminum Glass and Pure Plasma",
        function: "Refuels the system with rotational kinetic energy.",
        assemblyOrder: 6,
        connections: ["Event_Horizon_Accretion_Disk"],
        failureEffect: "Disk slows down, frame dragging reverses.",
        cascadeFailures: ["Temporal shear inside the facility"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        feedGroup.rotation.y += 0.001 * speed;
    });

    // ============================================================================
    // PART 16: OPERATOR CONTROL CABIN
    // ============================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 0, 250);

    const floorShape = new THREE.Shape();
    floorShape.moveTo(-30, -20);
    floorShape.lineTo(30, -20);
    floorShape.lineTo(40, 0);
    floorShape.lineTo(30, 20);
    floorShape.lineTo(-30, 20);
    floorShape.lineTo(-40, 0);
    floorShape.lineTo(-30, -20);
    
    const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const floorGeo = new THREE.ExtrudeGeometry(floorShape, extrudeSettings);
    const floorMesh = new THREE.Mesh(floorGeo, darkSteel);
    floorMesh.rotation.x = Math.PI / 2;
    cabinGroup.add(floorMesh);
    
    // Glowing control consoles
    const consoleGeo = new THREE.BoxGeometry(15, 8, 5);
    const consoleMesh1 = new THREE.Mesh(consoleGeo, matNeonCyan);
    consoleMesh1.position.set(0, 8, -10);
    consoleMesh1.rotation.x = -Math.PI / 6;
    cabinGroup.add(consoleMesh1);
    
    const consoleMesh2 = new THREE.Mesh(consoleGeo, matNeonPurple);
    consoleMesh2.position.set(-20, 8, -5);
    consoleMesh2.rotation.x = -Math.PI / 6;
    consoleMesh2.rotation.y = Math.PI / 6;
    cabinGroup.add(consoleMesh2);
    
    const consoleMesh3 = new THREE.Mesh(consoleGeo, matNeonGreen);
    consoleMesh3.position.set(20, 8, -5);
    consoleMesh3.rotation.x = -Math.PI / 6;
    consoleMesh3.rotation.y = -Math.PI / 6;
    cabinGroup.add(consoleMesh3);

    // Blast shield glass
    const shieldGeo = new THREE.CylinderGeometry(40, 40, 30, 6, 1, true, Math.PI, Math.PI);
    const shieldMesh = new THREE.Mesh(shieldGeo, tinted);
    shieldMesh.position.set(0, 15, 0);
    shieldMesh.material.transparent = true;
    shieldMesh.material.opacity = 0.5;
    cabinGroup.add(shieldMesh);

    group.add(cabinGroup);

    parts.push({
        name: "Operator_Control_Cabin",
        description: "Suspended dangerously close to the event horizon, shielded only by extreme magnetic fields and tinted hyper-glass. Houses the mad scientists.",
        material: "Dark Steel and Tinted Aluminum Glass",
        function: "Manual override and monitoring of all quantum states.",
        assemblyOrder: 26,
        connections: ["Primary_Spaceframe_Support_Structure"],
        failureEffect: "Lethal radiation dose to all operators in nanoseconds.",
        cascadeFailures: ["No one left to press the abort button"],
        originalPosition: { x: 0, y: 0, z: 250 },
        explodedPosition: { x: 0, y: 0, z: 400 }
    });

    animationCallbacks.push((time, speed) => {
        consoleMesh1.material.emissiveIntensity = 2.0 + Math.random() * 2.0; // Flickering data
        consoleMesh2.material.emissiveIntensity = 2.0 + Math.random() * 2.0;
        consoleMesh3.material.emissiveIntensity = 2.0 + Math.random() * 2.0;
    });

    // ============================================================================
    // PART 17: MAIN POWER TRANSMISSION CABLES
    // ============================================================================
    const cableGroup = new THREE.Group();
    const cableGeo = new THREE.CylinderGeometry(2, 2, 300, 16);
    for (let i = 0; i < 4; i++) {
        const cable = new THREE.Mesh(cableGeo, rubber);
        cable.position.set((i - 1.5) * 10, -150, 240);
        cableGroup.add(cable);
        
        // Add energy pulse rings
        const ringGeo = new THREE.TorusGeometry(3, 0.5, 8, 16);
        const ring = new THREE.Mesh(ringGeo, matNeonCyan);
        ring.rotation.x = Math.PI / 2;
        cable.add(ring);
        animationCallbacks.push((time, speed) => {
            ring.position.y = ( (time * speed * 50 + i * 50) % 300 ) - 150;
        });
    }
    group.add(cableGroup);

    parts.push({
        name: "Main_Power_Transmission_Cables",
        description: "Thick rubber-insulated cables delivering the output of multiple Dyson Swarms directly into the emitter arrays.",
        material: "Super-insulative Synthetic Rubber over Carbon Nanotubes",
        function: "Carries 10^30 Watts of electrical power.",
        assemblyOrder: 2,
        connections: ["Operator_Control_Cabin", "Gamma_Ray_Array_South"],
        failureEffect: "Massive arc flash vaporizing anything within 10 miles.",
        cascadeFailures: ["Total power loss", "Core collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 0 }
    });

    // ============================================================================
    // PART 18: HYDRAULIC ARTICULATED STRUTS
    // ============================================================================
    const hydraulicGroup = new THREE.Group();
    const pistonCylinderGeo = new THREE.CylinderGeometry(5, 5, 40, 16);
    const pistonRodGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
    pistonCylinderGeo.translate(0, 20, 0);
    pistonRodGeo.translate(0, 20, 0);

    const pistons = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        const x = Math.cos(angle) * 150;
        const z = Math.sin(angle) * 150;
        
        const cyl = new THREE.Mesh(pistonCylinderGeo, steel);
        cyl.position.set(x, -200, z);
        
        const rod = new THREE.Mesh(pistonRodGeo, chrome);
        rod.position.set(0, 40, 0);
        cyl.add(rod);
        
        cyl.lookAt(0, 0, 0);
        cyl.rotateX(Math.PI / 2); // point inwards
        
        pistons.push(rod);
        hydraulicGroup.add(cyl);
    }
    group.add(hydraulicGroup);

    parts.push({
        name: "Hydraulic_Articulated_Struts",
        description: "Massive chrome and steel pistons that actively adjust the focal distance of the entire lower hemisphere to keep the singularity perfectly centered.",
        material: "Steel and Chrome",
        function: "Provides micro-adjustments to the massive structure.",
        assemblyOrder: 3,
        connections: ["Primary_Spaceframe_Support_Structure"],
        failureEffect: "Misalignment of the gamma rays.",
        cascadeFailures: ["Spacetime asymmetric tear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -250, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        pistons.forEach((rod, idx) => {
            rod.position.y = 20 + Math.sin(time * speed * 2 + idx) * 10;
        });
    });

    // ============================================================================
    // PART 19: GRAVITATIONAL WAVE DAMPENING GEARS
    // ============================================================================
    const gearGroup = new THREE.Group();
    const gearShape = createGearProfile(24, 40, 10, 5);
    const gearGeo = new THREE.ExtrudeGeometry(gearShape, { depth: 10, bevelEnabled: true, bevelThickness: 2, bevelSize: 1, bevelSegments: 3, steps: 1 });
    
    const gear1 = new THREE.Mesh(gearGeo, darkSteel);
    gear1.position.set(-150, 0, 0);
    gear1.rotation.y = Math.PI / 2;
    gearGroup.add(gear1);
    
    const gear2 = new THREE.Mesh(gearGeo, darkSteel);
    gear2.position.set(150, 0, 0);
    gear2.rotation.y = Math.PI / 2;
    gearGroup.add(gear2);

    group.add(gearGroup);

    parts.push({
        name: "Gravitational_Wave_Dampening_Gears",
        description: "Inertial flywheels crafted from ultra-dense degenerate matter, rotating to absorb and counteract macro-scale gravitational vibrations.",
        material: "Degenerate Matter (Dark Steel proxy)",
        function: "Converts dangerous gravitational waves into harmless rotational kinetic energy.",
        assemblyOrder: 13,
        connections: ["Superconducting_Containment_Torus_Outer"],
        failureEffect: "Gears shatter under immense stress.",
        cascadeFailures: ["Facility shaking itself apart"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: 0, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        gear1.rotation.z += 0.05 * speed;
        gear2.rotation.z -= 0.05 * speed;
    });

    // ============================================================================
    // PART 20: DARK ENERGY INHIBITOR RODS
    // ============================================================================
    const rodGroup = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(3, 3, 100, 16);
    
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i;
        const r = 90;
        const rod = new THREE.Mesh(rodGeo, matDarkMatter);
        rod.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        
        // pulsing core inside rod
        const innerGeo = new THREE.CylinderGeometry(1, 1, 102, 16);
        const inner = new THREE.Mesh(innerGeo, matNeonPurple);
        rod.add(inner);
        
        rodGroup.add(rod);
    }
    group.add(rodGroup);

    parts.push({
        name: "Dark_Energy_Inhibitor_Rods",
        description: "Black monolithic rods that suppress the vacuum energy of space within the containment field, preventing the rapid expansion of the newly formed universe inside the black hole.",
        material: "Exotic Dark Matter Composite",
        function: "Maintains the cosmological constant at zero locally.",
        assemblyOrder: 7,
        connections: ["Superconducting_Containment_Torus_Mid"],
        failureEffect: "Big Bang within the facility.",
        cascadeFailures: ["Creation of a new universe that overrides ours"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        rodGroup.rotation.y -= 0.01 * speed;
        rodGroup.children.forEach(rod => {
            rod.position.y = Math.sin(time * speed * 3 + rod.position.x) * 10;
        });
    });

    // ============================================================================
    // PART 21: NEUTRINO DETECTOR BANKS
    // ============================================================================
    const detectorGroup = new THREE.Group();
    const detGeo = new THREE.BoxGeometry(10, 10, 10);
    for (let i = 0; i < 8; i++) {
        const det = new THREE.Mesh(detGeo, glass);
        det.position.set((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400);
        const core = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), matNeonCyan);
        det.add(core);
        detectorGroup.add(det);
    }
    group.add(detectorGroup);

    parts.push({
        name: "Neutrino_Detector_Banks",
        description: "Scattered blocks of ultra-pure heavy water laced with scintillators to detect high-energy neutrinos escaping the core.",
        material: "Heavy Water and Glass",
        function: "Early warning system for core collapse.",
        assemblyOrder: 22,
        connections: ["Primary_Spaceframe_Support_Structure"],
        failureEffect: "Blindness to deep-core quantum changes.",
        cascadeFailures: ["None directly, but prevents avoiding other failures"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ============================================================================
    // PART 22: QUANTUM STATE DECOHERENCE SHIELDS
    // ============================================================================
    const shieldGroup = new THREE.Group();
    const hexShape = createHexagonProfile(10);
    const hexGeo = new THREE.ExtrudeGeometry(hexShape, { depth: 2, bevelEnabled: false });
    
    // Create a honeycomb pattern shield
    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            const hex = new THREE.Mesh(hexGeo, aluminum);
            const xOffset = x * 17.32 + (Math.abs(y) % 2 === 1 ? 8.66 : 0);
            const yOffset = y * 15;
            hex.position.set(xOffset, yOffset, -180);
            
            const glow = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), matNeonCyan);
            glow.position.z = 2.1;
            hex.add(glow);
            
            shieldGroup.add(hex);
        }
    }
    group.add(shieldGroup);

    parts.push({
        name: "Quantum_State_Decoherence_Shields",
        description: "A honeycomb array of plates that forces macroscopic quantum states to collapse gracefully before they entangle with the operators' brains.",
        material: "Beryllium-Aluminum Hexagons",
        function: "Protects observers from experiencing multiple contradictory realities simultaneously.",
        assemblyOrder: 21,
        connections: ["Operator_Control_Cabin"],
        failureEffect: "Operators become both dead and alive (Schrödinger's Operators).",
        cascadeFailures: ["Complete loss of sanity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -100 }
    });

    animationCallbacks.push((time, speed) => {
        shieldGroup.children.forEach((hex, idx) => {
            if(hex.children[0]) {
                hex.children[0].material.opacity = 0.5 + Math.sin(time * speed * 5 + idx) * 0.5;
            }
        });
    });

    // ============================================================================
    // PART 23: SINGULARITY MASS INJECTOR
    // ============================================================================
    const injectorGeo = new THREE.CylinderGeometry(8, 2, 80, 32);
    const injectorMesh = new THREE.Mesh(injectorGeo, chrome);
    injectorMesh.position.set(0, 200, 0);
    injectorMesh.rotation.x = Math.PI; // point down
    
    // Internal glowing beam
    const injBeamGeo = new THREE.CylinderGeometry(1.5, 1.5, 200, 16);
    const injBeam = new THREE.Mesh(injBeamGeo, matPlasmaRed);
    injBeam.position.set(0, 100, 0); // extend downwards
    injectorMesh.add(injBeam);

    group.add(injectorMesh);

    parts.push({
        name: "Singularity_Mass_Injector",
        description: "A colossal syringe that injects raw degenerate neutrons straight into the Kugelblitz to add physical mass if the photon sphere weakens.",
        material: "Chrome housing, Neutron flow",
        function: "Emergency mass-balancer to prevent complete evaporation.",
        assemblyOrder: 4,
        connections: ["Primary_Spaceframe_Support_Structure"],
        failureEffect: "Neutron spill.",
        cascadeFailures: ["Immediate fatal irradiation of the entire hemisphere"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        injBeam.material.opacity = 0.3 + Math.random() * 0.7; // frantic pulsing
    });

    // ============================================================================
    // PART 24: EMERGENCY PLASMA VENT VALVES
    // ============================================================================
    const valveGroup = new THREE.Group();
    const valveGeo = new THREE.TorusKnotGeometry(10, 3, 64, 8);
    for (let i = 0; i < 4; i++) {
        const valve = new THREE.Mesh(valveGeo, steel);
        valve.position.set((i===0?100:i===1?-100:0), 0, (i===2?100:i===3?-100:0));
        valveGroup.add(valve);
    }
    group.add(valveGroup);

    parts.push({
        name: "Emergency_Plasma_Vent_Valves",
        description: "Complex knotted tubes designed to rapidly eject hot plasma into deep space if the accretion disk becomes too massive.",
        material: "Forged Steel",
        function: "Pressure relief.",
        assemblyOrder: 9,
        connections: ["Superconducting_Containment_Torus_Outer", "Plasma_Energy_Feed_Lines"],
        failureEffect: "Valve jamming.",
        cascadeFailures: ["Accretion disk over-mass", "Singularity consumes the disk"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: 100, z: 100 }
    });

    animationCallbacks.push((time, speed) => {
        valveGroup.children.forEach(v => v.rotation.x += 0.05 * speed);
    });

    // ============================================================================
    // PART 25: AUXILIARY POWER CAPACITOR BANKS
    // ============================================================================
    const capGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(15, 15, 60, 32);
    for (let i = 0; i < 6; i++) {
        const cap = new THREE.Mesh(capGeo, darkSteel);
        const a = (Math.PI * 2 / 6) * i;
        cap.position.set(Math.cos(a)*180, -250, Math.sin(a)*180);
        
        const capBand = new THREE.Mesh(new THREE.CylinderGeometry(15.5, 15.5, 5, 32), matNeonGreen);
        cap.add(capBand);
        
        capGroup.add(cap);
    }
    group.add(capGroup);

    parts.push({
        name: "Auxiliary_Power_Capacitor_Banks",
        description: "Massive dark steel cylinders storing enough energy to power a continent, used solely to kickstart the containment fields.",
        material: "Dark Steel and Graphene Supercapacitors",
        function: "Black-start capability for the magnetic containment.",
        assemblyOrder: 20,
        connections: ["Primary_Spaceframe_Support_Structure", "Superconducting_Containment_Torus_Inner"],
        failureEffect: "Inability to start the magnetic field before laser ignition.",
        cascadeFailures: ["Lasers immediately blow up the facility"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -350, z: 0 }
    });

    animationCallbacks.push((time, speed) => {
        capGroup.children.forEach(cap => {
            cap.children[0].material.emissiveIntensity = 2.0 + Math.sin(time * speed * 2 + cap.position.x) * 1.5;
        });
    });

    // ============================================================================
    // RETURN OBJECT
    // ============================================================================
    return {
        group,
        parts,
        description: "An Ultra God-Tier Kugelblitz Black Hole Generator. This colossal machine converges thousands of hyper-focused gamma-ray lasers to a microscopic central point, creating an energy density so infinite that spacetime collapses into a singularity entirely from light. Features extreme magnetic containment, hawking radiation collectors, and spacetime warping coils. It is the pinnacle of extremely dangerous, highly animated, ultra-complex theoretical physics engineering.",
        quizQuestions: [
            {
                question: "In the context of the Kugelblitz generator, how does the Tolman-Oppenheimer-Volkoff limit analogize to pure radiation collapse, and what is the critical energy density required?",
                options: [
                    "Energy density where the Schwarzschild radius equals the Planck length, ~10^114 J/m^3",
                    "Energy density described by the Stefan-Boltzmann law, ~10^5 J/m^3",
                    "Energy density inversely proportional to the speed of light cubed, ~10^20 J/m^3",
                    "Energy density defined by the Wheeler-DeWitt equation, ~10^50 J/m^3"
                ],
                answer: 0,
                explanation: "To collapse radiation into a singularity (a Kugelblitz), the energy density must be so immense that the resulting Schwarzschild radius exceeds the physical space occupied by the energy, often approaching the Planck density (~10^114 J/m^3) at microscopic focal points."
            },
            {
                question: "As the gamma-ray lasers converge to form the Kugelblitz, what is the exact mechanism by which photons, which lack invariant mass, curve spacetime according to General Relativity?",
                options: [
                    "Photons acquire virtual mass via the Higgs mechanism at high densities.",
                    "The non-zero components of the stress-energy tensor, specifically T_00 (energy density) and momentum flux, directly source the Einstein field equations.",
                    "Photon-photon scattering produces massive electron-positron pairs which then collapse.",
                    "The intense light creates a vacuum polarization that acts as negative mass, reversing gravity."
                ],
                answer: 1,
                explanation: "In General Relativity, gravity is sourced not just by invariant mass, but by the entire stress-energy tensor. Photons have momentum and kinetic energy, contributing to the T_00 component, which warps spacetime."
            },
            {
                question: "When regulating the event horizon via the Spacetime Warping Coil Helix, what specific metric tensor component must be modulated to counteract frame-dragging (Lense-Thirring effect) induced by the rotating energy sphere?",
                options: [
                    "g_tt (Time-time component)",
                    "g_rr (Radial-radial component)",
                    "g_tφ (Time-azimuthal component)",
                    "g_θθ (Polar-polar component)"
                ],
                answer: 2,
                explanation: "In a rotating metric (like the Kerr metric), the off-diagonal g_tφ component dictates how heavily space and time are dragged along with the rotation. Modulating this dampens the Lense-Thirring effect."
            },
            {
                question: "According to the Bekenstein-Hawking entropy formula, if the Kugelblitz generator creates a black hole of 10^9 kg, what governs its entropy and evaporation rate?",
                options: [
                    "Entropy ∝ M^2, evaporation time ∝ M^3. High entropy, rapid evaporation via Hawking radiation for small masses.",
                    "Entropy ∝ M, evaporation time ∝ M^2. Low entropy, stable indefinite lifespan.",
                    "Entropy is exactly zero because it is made of pure light.",
                    "Entropy ∝ √M, evaporation time ∝ M. Evaporation slows down as mass decreases."
                ],
                answer: 0,
                explanation: "Black hole entropy scales with area (Mass squared), and its lifespan scales with Mass cubed. For a relatively 'small' black hole of 10^9 kg, evaporation via Hawking radiation is violent and extremely rapid."
            },
            {
                question: "In maintaining the Superconducting Magnetic Containment Torus, why is the Meissner effect alone insufficient to contain the high-energy plasma generated by secondary photon-photon scattering, requiring the addition of active Gravitational Wave Dampeners?",
                options: [
                    "The Meissner effect only expels electric fields, not magnetic fields.",
                    "The plasma generates intense quadrupole moments during turbulent flow, emitting gravitational waves that physically vibrate the superconductors beyond their critical temperature (Tc) via phonon excitation.",
                    "Photons do not have a charge, making magnetic fields completely useless.",
                    "Gravitational waves cause the magnetic flux to immediately drop to zero."
                ],
                answer: 1,
                explanation: "Relativistic plasma turbulence generates gravitational waves. These waves physically distort the crystalline lattice of the superconductors, creating phonons (heat) that can instantly break the superconducting state (quench) if not actively dampened."
            }
        ],
        animate: function(time, speed) {
            animationCallbacks.forEach(cb => cb(time, speed));
        }
    };
}
