import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ============================================================================
    // 1. ADVANCED CUSTOM MATERIALS
    // ============================================================================
    
    const plasmaUpperMat = new THREE.MeshStandardMaterial({
        color: 0xe0ffff, emissive: 0x00aaff, emissiveIntensity: 3.5,
        transparent: true, opacity: 0.85, roughness: 0.0, metalness: 1.0, wireframe: false
    });

    const plasmaLowerMat = new THREE.MeshStandardMaterial({
        color: 0xffe0ff, emissive: 0xff00aa, emissiveIntensity: 3.5,
        transparent: true, opacity: 0.85, roughness: 0.0, metalness: 1.0, wireframe: false
    });

    const magFieldMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xaaaaaa, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.4, wireframe: true, roughness: 0.2
    });

    const reconnectionFlashMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.0,
        transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending
    });

    const superConductorMat = new THREE.MeshStandardMaterial({
        color: 0x111111, emissive: 0x002244, emissiveIntensity: 1.2,
        roughness: 0.4, metalness: 0.9, wireframe: false
    });

    const collectorGlowMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00, emissive: 0x00ff22, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.6, wireframe: false, blending: THREE.AdditiveBlending
    });

    const structuralFrameMat = new THREE.MeshStandardMaterial({
        color: 0x222222, roughness: 0.7, metalness: 0.8
    });

    const laserMat = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5.0,
        transparent: true, opacity: 0.7
    });

    const heatShieldMat = new THREE.MeshStandardMaterial({
        color: 0x552200, roughness: 0.9, metalness: 0.1
    });

    const coolantMat = new THREE.MeshStandardMaterial({
        color: 0x0055ff, transparent: true, opacity: 0.5, roughness: 0.1, transmission: 0.9
    });

    const carbonNanotubeMat = new THREE.MeshStandardMaterial({
        color: 0x050505, roughness: 0.3, metalness: 0.9, wireframe: true
    });

    // ============================================================================
    // 2. HELPER FUNCTIONS FOR EXTREME GEOMETRIES
    // ============================================================================

    function createHexBase(radius, depth) {
        const shape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.lineTo(Math.cos(0) * radius, Math.sin(0) * radius);
        
        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 2,
            bevelSize: 2,
            bevelThickness: 2
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createPipingNetwork(radius, tubeRadius, segments, radialSegments) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius, 0, 0),
            new THREE.Vector3(0, radius, radius/2),
            new THREE.Vector3(-radius, 0, 0),
            new THREE.Vector3(0, -radius, -radius/2),
            new THREE.Vector3(radius, 0, 0)
        ]);
        return new THREE.TubeGeometry(curve, segments, tubeRadius, radialSegments, true);
    }

    function createComplexLathe(pointsArray, segments) {
        const points = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(points, segments);
    }

    function createCoilRing(radius, tube, radialSegments, tubularSegments, twists) {
        return new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, 1, twists);
    }

    function generateStrut(length, width) {
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, -width/2);
        shape.lineTo(width/2, -width/2);
        shape.lineTo(width, 0);
        shape.lineTo(width/2, width/2);
        shape.lineTo(-width/2, width/2);
        shape.lineTo(-width, 0);
        shape.lineTo(-width/2, -width/2);
        return new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: true, bevelThickness: 0.5 });
    }

    // ============================================================================
    // 3. MASSIVE MESH CONSTRUCTION
    // ============================================================================

    // --- 1. Base Platform & Containment Shell ---
    const baseGroup = new THREE.Group();
    const primaryBaseGeo = createHexBase(150, 10);
    const primaryBase = new THREE.Mesh(primaryBaseGeo, darkSteel);
    primaryBase.rotation.x = Math.PI / 2;
    primaryBase.position.y = -100;
    baseGroup.add(primaryBase);

    // Decorative floor grid
    for(let i=0; i<12; i++) {
        const gridGeo = new THREE.BoxGeometry(280, 2, 5);
        const gridMesh = new THREE.Mesh(gridGeo, chrome);
        gridMesh.position.y = -89;
        gridMesh.rotation.y = (i * Math.PI) / 12;
        baseGroup.add(gridMesh);
    }

    const outerContainmentGeo = createComplexLathe([
        [150, -100], [140, -50], [160, 0], [140, 50], [150, 100], [130, 100], [120, 50], [140, 0], [120, -50], [130, -100]
    ], 64);
    const outerContainment = new THREE.Mesh(outerContainmentGeo, structuralFrameMat);
    baseGroup.add(outerContainment);
    meshes.base = baseGroup;

    // --- 2. Upper and Lower Support Pillars (Superconducting Struts) ---
    const pillarsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const strutGeo = generateStrut(180, 8);
        const strut = new THREE.Mesh(strutGeo, superConductorMat);
        strut.position.set(Math.cos(angle)*120, -90, Math.sin(angle)*120);
        strut.rotation.x = -Math.PI / 2;
        strut.rotation.z = angle;
        pillarsGroup.add(strut);

        // Add cooling pipes to struts
        const pipeGeo = new THREE.CylinderGeometry(2, 2, 180, 16);
        const pipe = new THREE.Mesh(pipeGeo, coolantMat);
        pipe.position.set(Math.cos(angle)*110, 0, Math.sin(angle)*110);
        pillarsGroup.add(pipe);
    }
    meshes.pillars = pillarsGroup;

    // --- 3. Plasma Containment Toruses ---
    const upperTorusGeo = new THREE.TorusGeometry(40, 12, 64, 128);
    const upperTorus = new THREE.Mesh(upperTorusGeo, plasmaUpperMat);
    upperTorus.position.y = 35;
    upperTorus.rotation.x = Math.PI / 2;
    meshes.upperTorus = upperTorus;

    const lowerTorusGeo = new THREE.TorusGeometry(40, 12, 64, 128);
    const lowerTorus = new THREE.Mesh(lowerTorusGeo, plasmaLowerMat);
    lowerTorus.position.y = -35;
    lowerTorus.rotation.x = Math.PI / 2;
    meshes.lowerTorus = lowerTorus;

    // --- 4. Magnetic Field Generators (Poloidal Coils) ---
    const upperCoilsGroup = new THREE.Group();
    const lowerCoilsGroup = new THREE.Group();
    for(let i=0; i<24; i++) {
        const angle = (i/24) * Math.PI * 2;
        const coilGeo = new THREE.TorusGeometry(18, 2, 16, 64);
        
        const upperCoil = new THREE.Mesh(coilGeo, copper);
        upperCoil.position.set(Math.cos(angle)*40, 35, Math.sin(angle)*40);
        upperCoil.rotation.y = -angle;
        upperCoilsGroup.add(upperCoil);

        const lowerCoil = new THREE.Mesh(coilGeo, copper);
        lowerCoil.position.set(Math.cos(angle)*40, -35, Math.sin(angle)*40);
        lowerCoil.rotation.y = -angle;
        lowerCoilsGroup.add(lowerCoil);
    }
    meshes.upperCoils = upperCoilsGroup;
    meshes.lowerCoils = lowerCoilsGroup;

    // --- 5. Reconnection Zone Magnetic Lines (TorusKnots) ---
    const magneticLinesGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const knotGeo = createCoilRing(25, 1.5, 32, 200, 3 + i);
        const knot = new THREE.Mesh(knotGeo, magFieldMat);
        knot.rotation.x = Math.PI / 2;
        magneticLinesGroup.add(knot);
    }
    meshes.magneticLines = magneticLinesGroup;

    // --- 6. Energy Harvesting Funnels (Lathe Geometry) ---
    const funnelLatheGeo = createComplexLathe([
        [5, 0], [15, 10], [25, 25], [35, 45], [40, 70], [42, 75], [38, 75], [33, 45], [23, 25], [13, 10], [3, 0]
    ], 64);
    
    const upperFunnel = new THREE.Mesh(funnelLatheGeo, carbonNanotubeMat);
    upperFunnel.position.y = 30;
    meshes.upperFunnel = upperFunnel;

    const lowerFunnel = new THREE.Mesh(funnelLatheGeo, carbonNanotubeMat);
    lowerFunnel.rotation.x = Math.PI;
    lowerFunnel.position.y = -30;
    meshes.lowerFunnel = lowerFunnel;

    // Inner glowing collectors
    const collectorGeo = new THREE.CylinderGeometry(5, 30, 60, 32, 1, true);
    const upperCollector = new THREE.Mesh(collectorGeo, collectorGlowMat);
    upperCollector.position.y = 60;
    meshes.upperCollector = upperCollector;

    const lowerCollector = new THREE.Mesh(collectorGeo, collectorGlowMat);
    lowerCollector.rotation.x = Math.PI;
    lowerCollector.position.y = -60;
    meshes.lowerCollector = lowerCollector;

    // --- 7. Reconnection Flash Core (Explosive visual) ---
    const flashGeo = new THREE.SphereGeometry(15, 64, 64);
    const flashMesh = new THREE.Mesh(flashGeo, reconnectionFlashMat);
    meshes.flashMesh = flashMesh;

    // --- 8. High-Energy Particle System (InstancedMesh) ---
    const particleCount = 20000;
    const particleGeo = new THREE.SphereGeometry(0.3, 4, 4);
    const particleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10.0, transparent: true, opacity: 1.0
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    
    // Store original velocities and positions
    const particleData = [];
    const dummy = new THREE.Object3D();
    for(let i=0; i<particleCount; i++) {
        // Init at center, hidden by scale 0
        dummy.position.set(0,0,0);
        dummy.scale.set(0,0,0);
        dummy.updateMatrix();
        particles.setMatrixAt(i, dummy.matrix);
        
        // Random spherical direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = Math.random() * 80 + 20;

        particleData.push({
            vx: Math.sin(phi) * Math.cos(theta) * speed,
            vy: Math.sin(phi) * Math.sin(theta) * speed,
            vz: Math.cos(phi) * speed,
            life: 0,
            maxLife: Math.random() * 2 + 1,
            active: false
        });
    }
    particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    meshes.particles = particles;
    meshes.particleData = particleData;
    meshes.dummy = dummy;

    // --- 9. Laser Ignition System ---
    const laserGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const laserEmitterGeo = new THREE.CylinderGeometry(3, 3, 20, 16);
        const emitter = new THREE.Mesh(laserEmitterGeo, darkSteel);
        emitter.position.set(Math.cos(angle)*100, 0, Math.sin(angle)*100);
        emitter.lookAt(0,0,0);
        emitter.rotation.x += Math.PI/2; // Fix orientation
        laserGroup.add(emitter);

        const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 100, 8);
        const beam = new THREE.Mesh(beamGeo, laserMat);
        beam.position.set(Math.cos(angle)*50, 0, Math.sin(angle)*50);
        beam.lookAt(0,0,0);
        beam.rotation.x += Math.PI/2;
        laserGroup.add(beam);
    }
    meshes.lasers = laserGroup;

    // --- 10. Cryogenic Cooling Pipes (Intricate network) ---
    const cryptoGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const pipeCurveGeo = createPipingNetwork(80, 1.5, 64, 8);
        const pipeMesh = new THREE.Mesh(pipeCurveGeo, coolantMat);
        pipeMesh.rotation.y = angle;
        cryptoGroup.add(pipeMesh);
    }
    meshes.cryoPipes = cryptoGroup;

    // --- 11. Central Transformer Core ---
    const transformerGeo = new THREE.CylinderGeometry(20, 20, 200, 32, 10, true);
    const transformer = new THREE.Mesh(transformerGeo, magFieldMat);
    meshes.transformer = transformer;

    // --- 12. Flux Capacitors Array ---
    const capacitorGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const capGeo = new THREE.BoxGeometry(10, 40, 10);
        const cap = new THREE.Mesh(capGeo, steel);
        cap.position.set(Math.cos(angle)*130, -50, Math.sin(angle)*130);
        cap.lookAt(0, -50, 0);
        capacitorGroup.add(cap);

        // glowing inner coil
        const innerCapGeo = new THREE.CylinderGeometry(3, 3, 38, 16);
        const innerCap = new THREE.Mesh(innerCapGeo, plasmaUpperMat);
        innerCap.position.copy(cap.position);
        capacitorGroup.add(innerCap);
    }
    meshes.capacitors = capacitorGroup;

    // --- 13. Diagnostics Interferometer ---
    const diagGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const sensorGeo = new THREE.SphereGeometry(4, 16, 16);
        const sensor = new THREE.Mesh(sensorGeo, glass);
        sensor.position.set(Math.cos(angle)*80, 0, Math.sin(angle)*80);
        diagGroup.add(sensor);
        
        const mountGeo = new THREE.CylinderGeometry(1, 2, 40, 8);
        const mount = new THREE.Mesh(mountGeo, structuralFrameMat);
        mount.position.set(Math.cos(angle)*100, 0, Math.sin(angle)*100);
        mount.lookAt(sensor.position);
        mount.rotation.x += Math.PI/2;
        diagGroup.add(mount);
    }
    meshes.diagnostics = diagGroup;

    // --- 14. Bremsstrahlung Shielding Panels ---
    const shieldGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const shieldGeo = new THREE.PlaneGeometry(30, 160);
        const shield = new THREE.Mesh(shieldGeo, heatShieldMat);
        shield.position.set(Math.cos(angle)*145, 0, Math.sin(angle)*145);
        shield.rotation.y = -angle + Math.PI/2;
        shieldGroup.add(shield);
    }
    meshes.shielding = shieldGroup;

    // --- 15. Exhaust Divertors ---
    const divertorGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const divGeo = new THREE.TorusGeometry(60, 15, 32, 64, Math.PI/2);
        const div = new THREE.Mesh(divGeo, darkSteel);
        div.position.set(0, -90, 0);
        div.rotation.x = Math.PI/2;
        div.rotation.z = angle;
        divertorGroup.add(div);
    }
    meshes.divertors = divertorGroup;

    // ============================================================================
    // 4. ADD ALL TO GROUP
    // ============================================================================
    group.add(meshes.base);
    group.add(meshes.pillars);
    group.add(meshes.upperTorus);
    group.add(meshes.lowerTorus);
    group.add(meshes.upperCoils);
    group.add(meshes.lowerCoils);
    group.add(meshes.magneticLines);
    group.add(meshes.upperFunnel);
    group.add(meshes.lowerFunnel);
    group.add(meshes.upperCollector);
    group.add(meshes.lowerCollector);
    group.add(meshes.flashMesh);
    group.add(meshes.particles);
    group.add(meshes.lasers);
    group.add(meshes.cryoPipes);
    group.add(meshes.transformer);
    group.add(meshes.capacitors);
    group.add(meshes.diagnostics);
    group.add(meshes.shielding);
    group.add(meshes.divertors);

    // ============================================================================
    // 5. DEFINE METADATA AND PARTS ARRAY
    // ============================================================================
    
    parts.push({
        name: "Vacuum Vessel Hull",
        description: "Massive external containment structure engineered to withstand extreme vacuum and electromagnetic forces. It prevents atmospheric interference with the highly volatile plasma reconnection events occurring at its core.",
        material: "Dark Steel / Structural Frame",
        function: "Structural integrity and environmental isolation",
        assemblyOrder: 1,
        connections: ["Superconducting Struts", "Bremsstrahlung Shielding"],
        failureEffect: "Atmospheric implosion leading to immediate quenching of the plasma and catastrophic failure of the magnetic confinement.",
        cascadeFailures: ["Plasma Toruses", "Laser Ignition System"],
        originalPosition: {x: 0, y: -100, z: 0},
        explodedPosition: {x: 0, y: -300, z: 0}
    });

    parts.push({
        name: "Superconducting Struts",
        description: "Cryogenically cooled, ultra-dense structural pillars that suspend the inner mechanisms while routing massive amounts of electrical current to the poloidal coils without resistive losses.",
        material: "Superconductor Alloy",
        function: "Structural support and primary power bus",
        assemblyOrder: 2,
        connections: ["Vacuum Vessel Hull", "Poloidal Coils"],
        failureEffect: "Asymmetric collapse of the magnetic field geometry, causing the plasma to breach containment.",
        cascadeFailures: ["Poloidal Coils", "Upper Plasma Torus", "Lower Plasma Torus"],
        originalPosition: {x: 0, y: -90, z: 0},
        explodedPosition: {x: 300, y: 0, z: 300}
    });

    parts.push({
        name: "Upper Plasma Torus",
        description: "The primary confinement zone for the positively helicity-injected plasma. Operating at temperatures exceeding 150 million Kelvin.",
        material: "Superheated Plasma",
        function: "Fuel containment and magnetic helicity storage",
        assemblyOrder: 3,
        connections: ["Upper Poloidal Coils", "Reconnection Zone"],
        failureEffect: "Thermal breach, melting surrounding poloidal coils and unleashing massive kinetic energy into the shielding.",
        cascadeFailures: ["Upper Poloidal Coils", "Energy Harvesting Funnel (Upper)"],
        originalPosition: {x: 0, y: 35, z: 0},
        explodedPosition: {x: 0, y: 250, z: 0}
    });

    parts.push({
        name: "Lower Plasma Torus",
        description: "The secondary confinement zone for the negatively helicity-injected plasma. Designed to perfectly oppose the upper torus to set up the reconnection event.",
        material: "Superheated Plasma",
        function: "Fuel containment and opposing magnetic helicity storage",
        assemblyOrder: 4,
        connections: ["Lower Poloidal Coils", "Reconnection Zone"],
        failureEffect: "Thermal breach, destabilizing the entire reactor base.",
        cascadeFailures: ["Lower Poloidal Coils", "Exhaust Divertors"],
        originalPosition: {x: 0, y: -35, z: 0},
        explodedPosition: {x: 0, y: -250, z: 0}
    });

    parts.push({
        name: "Upper Poloidal Coils",
        description: "24 massive copper-niobium coils that generate the toroidal magnetic field required to confine the upper plasma torus.",
        material: "Copper/Niobium",
        function: "Magnetic confinement (Toroidal Field)",
        assemblyOrder: 5,
        connections: ["Upper Plasma Torus", "Superconducting Struts"],
        failureEffect: "Loss of confinement; plasma expands radially outward, destroying the vacuum vessel.",
        cascadeFailures: ["Vacuum Vessel Hull", "Diagnostics Interferometer"],
        originalPosition: {x: 0, y: 35, z: 0},
        explodedPosition: {x: 0, y: 300, z: 0}
    });

    parts.push({
        name: "Lower Poloidal Coils",
        description: "24 massive copper-niobium coils that generate the toroidal magnetic field required to confine the lower plasma torus.",
        material: "Copper/Niobium",
        function: "Magnetic confinement (Toroidal Field)",
        assemblyOrder: 6,
        connections: ["Lower Plasma Torus", "Superconducting Struts"],
        failureEffect: "Loss of confinement; plasma expands radially outward.",
        cascadeFailures: ["Vacuum Vessel Hull", "Flux Capacitors"],
        originalPosition: {x: 0, y: -35, z: 0},
        explodedPosition: {x: 0, y: -300, z: 0}
    });

    parts.push({
        name: "Magnetic Reconnection Field Lines",
        description: "The dynamically evolving magnetic field lines bridging the two toruses. As they are forced together, they undergo violent reconnection, converting magnetic energy into kinetic and thermal energy.",
        material: "Magnetic Flux",
        function: "Energy transduction via topological realignment",
        assemblyOrder: 7,
        connections: ["Upper Plasma Torus", "Lower Plasma Torus"],
        failureEffect: "Failure to reconnect results in field pile-up, eventually causing a macroscopic instability and catastrophic disruption.",
        cascadeFailures: ["Reconnection Flash Core", "Energy Harvesting Funnels"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 400}
    });

    parts.push({
        name: "Energy Harvesting Funnel (Upper)",
        description: "A specialized carbon-nanotube lathe geometry designed to catch the high-energy particle burst ejected upwards during the reconnection event, funneling it into the collectors.",
        material: "Carbon Nanotube",
        function: "Particle capture and funneling",
        assemblyOrder: 8,
        connections: ["Upper Collector", "Reconnection Zone"],
        failureEffect: "Particles bypass the collector, irradiating the upper superstructure.",
        cascadeFailures: ["Upper Collector", "Upper Poloidal Coils"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: 0, y: 400, z: 0}
    });

    parts.push({
        name: "Energy Harvesting Funnel (Lower)",
        description: "A specialized carbon-nanotube lathe geometry designed to catch the high-energy particle burst ejected downwards during the reconnection event.",
        material: "Carbon Nanotube",
        function: "Particle capture and funneling",
        assemblyOrder: 9,
        connections: ["Lower Collector", "Reconnection Zone"],
        failureEffect: "Particles bypass the collector, destroying the exhaust divertors.",
        cascadeFailures: ["Lower Collector", "Exhaust Divertors"],
        originalPosition: {x: 0, y: -30, z: 0},
        explodedPosition: {x: 0, y: -400, z: 0}
    });

    parts.push({
        name: "Upper Plasma Collector",
        description: "Direct energy conversion system utilizing inverse cyclotron mechanics to convert the kinetic energy of the funnel-captured particles directly into high-voltage direct current.",
        material: "Collector Glow Material",
        function: "Direct Energy Conversion",
        assemblyOrder: 10,
        connections: ["Energy Harvesting Funnel (Upper)", "Flux Capacitors"],
        failureEffect: "Energy surge destroys the grid connection, causing localized EMP.",
        cascadeFailures: ["Flux Capacitors"],
        originalPosition: {x: 0, y: 60, z: 0},
        explodedPosition: {x: 0, y: 500, z: 0}
    });

    parts.push({
        name: "Lower Plasma Collector",
        description: "Direct energy conversion system for the downward jet of the reconnection event.",
        material: "Collector Glow Material",
        function: "Direct Energy Conversion",
        assemblyOrder: 11,
        connections: ["Energy Harvesting Funnel (Lower)", "Flux Capacitors"],
        failureEffect: "Energy surge destroys the grid connection.",
        cascadeFailures: ["Flux Capacitors"],
        originalPosition: {x: 0, y: -60, z: 0},
        explodedPosition: {x: 0, y: -500, z: 0}
    });

    parts.push({
        name: "Reconnection Flash Core",
        description: "The absolute epicenter of the machine. The diffusion region where the frozen-in flux constraint is broken, characterized by an intense, blinding flash of extreme ultraviolet and X-ray radiation.",
        material: "Additive Blending Photon Core",
        function: "Radiation Emission / Diffusion Region",
        assemblyOrder: 12,
        connections: ["Magnetic Reconnection Field Lines"],
        failureEffect: "If not contained, radiation will vaporize the inner diagnostics.",
        cascadeFailures: ["Diagnostics Interferometer", "Bremsstrahlung Shielding"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 500, y: 0, z: 0}
    });

    parts.push({
        name: "Laser Ignition System",
        description: "Four extremely high-power, petawatt-class lasers used to pre-ionize the neutral gas and heat the initial plasma to millions of degrees before magnetic compression begins.",
        material: "Dark Steel / Laser Core",
        function: "Plasma Initiation and Heating",
        assemblyOrder: 13,
        connections: ["Vacuum Vessel Hull"],
        failureEffect: "Plasma fails to reach critical temperature, preventing reconnection.",
        cascadeFailures: ["Upper Plasma Torus", "Lower Plasma Torus"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -400, y: 0, z: 0}
    });

    parts.push({
        name: "Cryogenic Cooling Pipes",
        description: "An intricate, intertwined network of pipes circulating liquid helium at 4 Kelvin to maintain the superconducting state of the massive magnetic coils despite the proximity to the plasma.",
        material: "Translucent Coolant",
        function: "Thermal Management",
        assemblyOrder: 14,
        connections: ["Superconducting Struts", "Poloidal Coils"],
        failureEffect: "Coils undergo a quench, explosively boiling the helium and instantly destroying the magnetic field.",
        cascadeFailures: ["Poloidal Coils", "Superconducting Struts", "Vacuum Vessel Hull"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -500}
    });

    parts.push({
        name: "Flux Capacitors Array",
        description: "A ring of 16 ultra-high-density energy storage banks that catch the massive instantaneous surge of power generated by the collectors, smoothing it out for grid distribution.",
        material: "Steel / Plasma Core",
        function: "Energy Storage and Smoothing",
        assemblyOrder: 15,
        connections: ["Upper Plasma Collector", "Lower Plasma Collector"],
        failureEffect: "Capacitor rupture, leading to localized electrical plasma arcing and secondary explosions.",
        cascadeFailures: ["Vacuum Vessel Hull"],
        originalPosition: {x: 0, y: -50, z: 0},
        explodedPosition: {x: 400, y: -100, z: -400}
    });

    parts.push({
        name: "Bremsstrahlung Shielding Panels",
        description: "Heavy shielding composed of layered tungsten and borated polyethylene designed to absorb the intense Bremsstrahlung (braking radiation) emitted by the decelerating electrons in the plasma.",
        material: "Heat Shield Material",
        function: "Radiation Protection",
        assemblyOrder: 16,
        connections: ["Vacuum Vessel Hull"],
        failureEffect: "Lethal radiation doses escape the reactor, ionizing atmospheric air and frying all nearby electronics.",
        cascadeFailures: ["Diagnostics Interferometer"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -300, y: 200, z: 300}
    });


    // ============================================================================
    // 6. EXTREME PHD-LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of ideal Magnetohydrodynamics (MHD), Alfvén's theorem states that magnetic field lines are 'frozen' into a perfectly conducting plasma. Which mathematical condition in the generalized Ohm's law strictly enforces this?",
            options: [
                "The Hall term dominates over the convective term.",
                "The resistive term (eta * J) is exactly zero.",
                "The electron pressure gradient is aligned with the magnetic field.",
                "The Lundquist number approaches zero."
            ],
            correctAnswer: 1,
            explanation: "Ideal MHD assumes infinite conductivity (zero resistivity). When the resistive term (eta * J) in Ohm's law is zero, the magnetic flux through any surface moving with the fluid remains constant, effectively 'freezing' the magnetic field lines to the plasma."
        },
        {
            question: "Magnetic reconnection occurs in the 'diffusion region' where the frozen-in flux constraint is broken. In the Sweet-Parker model of reconnection, what limits the reconnection rate?",
            options: [
                "The speed of light in a vacuum.",
                "The rate at which plasma can exhaust out of the narrow diffusion region.",
                "The rate of anomalous resistivity generated by ion-acoustic turbulence.",
                "The magnetic Prandtl number exceeding the critical threshold."
            ],
            correctAnswer: 1,
            explanation: "The Sweet-Parker model describes a long, thin diffusion region. Because plasma must enter slowly along the long edge and exit quickly out of the narrow ends, the mass conservation bottleneck restricts the inflow (reconnection) rate, making it notoriously too slow to explain fast events like solar flares."
        },
        {
            question: "To explain the fast reconnection rates observed in nature (like solar flares), the Petschek model was introduced. How does the Petschek model solve the Sweet-Parker bottleneck?",
            options: [
                "By assuming the plasma is perfectly collisionless.",
                "By introducing standing slow-mode shocks that dramatically shorten the diffusion region and perform most of the magnetic energy conversion.",
                "By utilizing relativistic electron beams to bypass the diffusion region.",
                "By assuming an artificially high Spitzer resistivity."
            ],
            correctAnswer: 1,
            explanation: "Petschek proposed that the central diffusion region is actually microscopic. Outside this region, four standing slow-mode magnetic shocks form an X-shape. These shocks rapidly accelerate and heat the incoming plasma, allowing for a fast reconnection rate that is only weakly dependent on resistivity."
        },
        {
            question: "During a magnetic reconnection event, magnetic energy is violently converted. Which of the following best describes the primary energy partitioning in the immediate exhaust of the reconnection site?",
            options: [
                "100% is converted into thermal Bremsstrahlung radiation.",
                "Approximately 50% is converted into bulk kinetic energy (Alfvénic outflows) and 50% into thermal energy.",
                "It is entirely converted into rest mass through pair production.",
                "It is mostly converted into gravitational potential energy of the surrounding plasma."
            ],
            correctAnswer: 1,
            explanation: "In standard MHD models of reconnection (like Sweet-Parker), the magnetic energy is roughly partitioned equally: half goes into heating the plasma (thermal energy) via Ohmic dissipation and shock heating, and half goes into accelerating the plasma to the Alfvén speed (kinetic energy)."
        },
        {
            question: "What is the physical significance of the Lundquist number (S) in a magnetic reconnection scenario?",
            options: [
                "It is the ratio of the magnetic diffusion time to the Alfvén transit time; very high S indicates a highly conducting plasma where reconnection is difficult and localized.",
                "It is the ratio of the plasma pressure to the magnetic pressure (Plasma Beta).",
                "It dictates the threshold for the tearing mode instability to saturate.",
                "It measures the ratio of the electron Larmor radius to the system scale length."
            ],
            correctAnswer: 0,
            explanation: "The Lundquist number S = (L * v_A) / eta (where L is scale length, v_A is Alfvén speed, eta is magnetic diffusivity). It represents the ratio of the resistive diffusion timescale to the Alfvén timescale. In astrophysical plasmas (like the solar corona), S is astronomically large (10^10 to 10^14), meaning the plasma is highly ideal except in extremely thin current sheets where reconnection occurs."
        }
    ];

    // ============================================================================
    // 7. EXTREME ANIMATION LOGIC
    // ============================================================================
    
    // Animation state variables
    let cycleTime = 0;
    const cycleDuration = 12.0; // 12 seconds per massive reconnection event
    
    function animate(time, speedFactor, meshes) {
        cycleTime += 0.016 * speedFactor; // roughly 60fps time delta
        if(cycleTime > cycleDuration) cycleTime = 0;

        const phase = cycleTime / cycleDuration; // 0.0 to 1.0

        // 1. Torus Approach and Pulsation
        // Phase 0.0 - 0.4: Toruses squeeze together.
        // Phase 0.4 - 0.5: Maximum squeeze.
        // Phase 0.5 - 0.6: Snap and explode.
        // Phase 0.6 - 1.0: Retreat and reset.

        let torusDist = 35;
        let torusScale = 1.0;
        let emissivePulse = 3.5;

        if (phase < 0.4) {
            const t = phase / 0.4;
            torusDist = 35 - 15 * Math.sin(t * Math.PI / 2);
            torusScale = 1.0 + 0.1 * t;
            emissivePulse = 3.5 + 4.0 * t;
        } else if (phase < 0.5) {
            torusDist = 20;
            torusScale = 1.1;
            emissivePulse = 7.5 + Math.random() * 2.0; // Flickering at max pressure
        } else if (phase < 0.6) {
            const t = (phase - 0.5) / 0.1;
            torusDist = 20 + 15 * t;
            torusScale = 1.1 - 0.1 * t;
            emissivePulse = 7.5 - 4.0 * t;
        }

        meshes.upperTorus.position.y = torusDist;
        meshes.upperTorus.scale.set(torusScale, torusScale, torusScale);
        meshes.upperTorus.material.emissiveIntensity = emissivePulse;
        
        meshes.lowerTorus.position.y = -torusDist;
        meshes.lowerTorus.scale.set(torusScale, torusScale, torusScale);
        meshes.lowerTorus.material.emissiveIntensity = emissivePulse;

        // Rotate toruses to simulate plasma flow (opposite directions = opposite helicity)
        meshes.upperTorus.rotation.z += 0.05 * speedFactor;
        meshes.lowerTorus.rotation.z -= 0.05 * speedFactor;

        // 2. Poloidal Coils
        meshes.upperCoils.position.y = torusDist - 35; // Follow torus relative to original 35
        meshes.lowerCoils.position.y = -torusDist + 35;

        // 3. Magnetic Field Lines (TorusKnots)
        // They stretch, distort, and violently snap.
        meshes.magneticLines.children.forEach((knot, index) => {
            knot.rotation.z += (0.02 + index * 0.01) * speedFactor;
            
            if (phase < 0.4) {
                // Stretching
                knot.scale.set(1.0, 1.0, 1.0 + phase * 2.0);
                knot.material.opacity = 0.4 + phase;
                knot.material.emissiveIntensity = 1.5 + phase * 5;
            } else if (phase >= 0.4 && phase < 0.5) {
                // Critical tension
                knot.scale.set(1.0 + Math.random()*0.1, 1.0 + Math.random()*0.1, 1.8 + Math.random()*0.4);
                knot.material.emissiveIntensity = 10.0;
            } else if (phase >= 0.5 && phase < 0.55) {
                // SNAP! They break and fly outwards
                const snapT = (phase - 0.5) / 0.05;
                knot.scale.set(1.0 + snapT * 3.0, 1.0 + snapT * 3.0, 2.0 - snapT * 1.5);
                knot.material.opacity = 1.0 - snapT;
            } else {
                // Resetting slowly
                knot.scale.set(1.0, 1.0, 1.0);
                knot.material.opacity = 0.4 * ((phase - 0.55) / 0.45);
                knot.material.emissiveIntensity = 1.5;
            }
        });

        // 4. Reconnection Flash Core
        if (phase >= 0.48 && phase < 0.55) {
            const flashT = (phase - 0.48) / 0.07;
            meshes.flashMesh.material.opacity = Math.sin(flashT * Math.PI);
            meshes.flashMesh.material.emissiveIntensity = Math.sin(flashT * Math.PI) * 20.0;
            meshes.flashMesh.scale.set(1.0 + flashT*3, 1.0 + flashT*3, 1.0 + flashT*3);
        } else {
            meshes.flashMesh.material.opacity = 0;
            meshes.flashMesh.material.emissiveIntensity = 0;
            meshes.flashMesh.scale.set(0.1, 0.1, 0.1);
        }

        // 5. Particle System Explosion
        if (phase >= 0.5 && phase < 0.52) {
            // Initiate explosion
            meshes.particleData.forEach(p => {
                p.active = true;
                p.life = 0;
                // Re-randomize slightly for varied bursts
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                // Bias heavily towards up and down (the exhaust funnels)
                let biasedPhi = phi;
                if (Math.random() > 0.3) {
                    biasedPhi = Math.random() < 0.5 ? Math.random() * 0.3 : Math.PI - Math.random() * 0.3;
                }
                const speed = Math.random() * 150 + 50;
                p.vx = Math.sin(biasedPhi) * Math.cos(theta) * speed;
                p.vy = Math.cos(biasedPhi) * speed;
                p.vz = Math.sin(biasedPhi) * Math.sin(theta) * speed;
            });
        }

        // Update active particles
        meshes.particleData.forEach((p, i) => {
            if (p.active) {
                p.life += 0.016 * speedFactor;
                
                // Get current matrix
                meshes.particles.getMatrixAt(i, meshes.dummy.matrix);
                meshes.dummy.matrix.decompose(meshes.dummy.position, meshes.dummy.quaternion, meshes.dummy.scale);
                
                // If just spawned, reset position
                if (p.life <= 0.016 * speedFactor) {
                    meshes.dummy.position.set(0,0,0);
                }

                // Move particle
                meshes.dummy.position.x += p.vx * 0.016 * speedFactor;
                meshes.dummy.position.y += p.vy * 0.016 * speedFactor;
                meshes.dummy.position.z += p.vz * 0.016 * speedFactor;

                // Magnetic funneling effect (suck them into the Y axis as they move away)
                const distXZ = Math.sqrt(meshes.dummy.position.x ** 2 + meshes.dummy.position.z ** 2);
                if (Math.abs(meshes.dummy.position.y) > 20) {
                    p.vx -= (meshes.dummy.position.x / distXZ) * 50 * 0.016 * speedFactor;
                    p.vz -= (meshes.dummy.position.z / distXZ) * 50 * 0.016 * speedFactor;
                }

                // Scale fade out
                const lifeRatio = 1.0 - (p.life / p.maxLife);
                if (lifeRatio > 0) {
                    meshes.dummy.scale.set(lifeRatio, lifeRatio, lifeRatio);
                } else {
                    p.active = false;
                    meshes.dummy.scale.set(0,0,0);
                }

                meshes.dummy.updateMatrix();
                meshes.particles.setMatrixAt(i, meshes.dummy.matrix);
            }
        });
        meshes.particles.instanceMatrix.needsUpdate = true;

        // 6. Collector Glows
        if (phase > 0.52 && phase < 0.8) {
            const glowT = Math.sin(((phase - 0.52) / 0.28) * Math.PI);
            meshes.upperCollector.material.emissiveIntensity = 2.0 + glowT * 15.0;
            meshes.lowerCollector.material.emissiveIntensity = 2.0 + glowT * 15.0;
        } else {
            meshes.upperCollector.material.emissiveIntensity = 2.0;
            meshes.lowerCollector.material.emissiveIntensity = 2.0;
        }

        // 7. Ambient rotations
        meshes.lasers.rotation.y -= 0.01 * speedFactor;
        meshes.cryoPipes.rotation.y += 0.005 * speedFactor;
        meshes.capacitors.rotation.y -= 0.02 * speedFactor;
    }

    return { group, parts, description: "God Tier Magnetic Reconnection Harvester. Induces, contains, and harvests energy from star-scale plasma magnetic reconnection events.", quizQuestions, animate };
}
