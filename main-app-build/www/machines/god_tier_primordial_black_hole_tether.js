import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animationUpdaters = [];

    // --- CUSTOM MATERIALS (High-Tech / Glowing) ---
    const singularityMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
        emissive: 0x000000
    });
    
    const photonSphereMat = new THREE.MeshStandardMaterial({
        color: 0x4422ff,
        emissive: 0x5522ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    
    const accretionDiskMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x8a2be2,
        emissiveIntensity: 2.0
    });
    
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.5
    });

    const plasmaRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0044,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.7
    });

    // ==========================================
    // 1. SINGULARITY CORE & EVENT HORIZON
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The Primordial Black Hole itself
    const pbhGeo = new THREE.SphereGeometry(2, 64, 64);
    const pbhMesh = new THREE.Mesh(pbhGeo, singularityMat);
    coreGroup.add(pbhMesh);
    
    // Photon Sphere (Gravitationally trapped light)
    const photonGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const photonMesh = new THREE.Mesh(photonGeo, photonSphereMat);
    coreGroup.add(photonMesh);
    
    // Primary Accretion Disk
    const diskGeo = new THREE.RingGeometry(4, 18, 128, 16);
    const diskMesh = new THREE.Mesh(diskGeo, accretionDiskMat);
    diskMesh.rotation.x = Math.PI / 2;
    coreGroup.add(diskMesh);
    
    // Secondary Polar Accretion Disk (from frame-dragging)
    const diskGeo2 = new THREE.RingGeometry(4.5, 12, 128, 16);
    const diskMesh2 = new THREE.Mesh(diskGeo2, neonPurple);
    diskMesh2.rotation.y = Math.PI / 2.5;
    diskMesh2.rotation.x = Math.PI / 6;
    coreGroup.add(diskMesh2);

    // Inner chaotic plasma streams
    const streamsGeo = new THREE.TorusKnotGeometry(6, 0.5, 200, 32, 3, 7);
    const streamsMesh = new THREE.Mesh(streamsGeo, plasmaRed);
    coreGroup.add(streamsMesh);

    group.add(coreGroup);

    animationUpdaters.push((time, speed) => {
        photonMesh.rotation.y += 0.05 * speed;
        photonMesh.rotation.x += 0.03 * speed;
        diskMesh.rotation.z -= 0.02 * speed;
        diskMesh2.rotation.z += 0.03 * speed;
        streamsMesh.rotation.x += 0.04 * speed;
        streamsMesh.rotation.y -= 0.05 * speed;
        
        // Pulsate photon sphere slightly
        const scale = 1 + Math.sin(time * 5) * 0.05;
        photonMesh.scale.set(scale, scale, scale);
    });

    parts.push({
        name: "Singularity Core",
        description: "A mountain-mass primordial black hole (M ≈ 10^12 kg) captured shortly after the Big Bang. Its Schwarzschild radius is microscopic, but apparent size is enlarged by severe gravitational lensing.",
        material: "Dark Matter / Singularity",
        function: "Serves as the infinite energy source via Hawking radiation and rotational frame-dragging (Penrose process).",
        assemblyOrder: 1,
        connections: ["Event Horizon Distortion Field", "Hawking Radiation Collector Funnels"],
        failureEffect: "Instantaneous catastrophic micro-quasar emission, vaporizing the tethering station and planetary bodies within 10 AU.",
        cascadeFailures: ["Magnetic Containment Rings", "Gravitational Tethers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 2. EVENT HORIZON DISTORTION FIELD
    // ==========================================
    const distortionGroup = new THREE.Group();
    
    // Complex wireframe sphere representing spacetime metric manipulation
    const distortionGeo = new THREE.SphereGeometry(22, 64, 64);
    const distortionMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
        emissive: 0xffffff,
        emissiveIntensity: 0.2
    });
    const distortionMesh = new THREE.Mesh(distortionGeo, distortionMat);
    
    // Add intricate inner geometry to represent folding spacetime
    const foldingGeo = new THREE.IcosahedronGeometry(20, 2);
    const foldingMesh = new THREE.Mesh(foldingGeo, distortionMat);
    
    distortionGroup.add(distortionMesh);
    distortionGroup.add(foldingMesh);
    group.add(distortionGroup);

    animationUpdaters.push((time, speed) => {
        const scale = 1 + Math.sin(time * 8) * 0.02;
        distortionMesh.scale.set(scale, scale, scale);
        distortionMesh.rotation.y += 0.05 * speed;
        distortionMesh.rotation.z += 0.02 * speed;
        
        foldingMesh.rotation.x -= 0.03 * speed;
        foldingMesh.rotation.y += 0.04 * speed;
    });

    parts.push({
        name: "Event Horizon Distortion Field",
        description: "A localized Alcubierre-metric manipulation field that dynamically bends spacetime around the event horizon, artificially increasing the effective surface area for Hawking radiation emission.",
        material: "Pure Energy / Spacetime",
        function: "Accelerates black hole evaporation in a controlled manner to increase energy yields by a factor of 10^6.",
        assemblyOrder: 2,
        connections: ["Singularity Core", "Magnetic Containment Rings"],
        failureEffect: "Spacetime snaps back to its default metric, releasing a devastating shockwave of gravitational radiation.",
        cascadeFailures: ["Tension Adjustment Hydraulics", "Gravitational Tether Primary Nodes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 3. MAGNETIC CONTAINMENT RINGS (Nested Toroids)
    // ==========================================
    const containmentGroup = new THREE.Group();
    const ringRadii = [28, 34, 40, 46, 52, 58];
    const ringRotations = [
        [0, 0, 0],
        [Math.PI/4, Math.PI/4, 0],
        [-Math.PI/3, Math.PI/6, Math.PI/8],
        [Math.PI/2, 0, Math.PI/2],
        [Math.PI/8, -Math.PI/4, Math.PI/3],
        [-Math.PI/6, Math.PI/2, -Math.PI/4]
    ];
    
    const ringMeshes = [];
    
    for (let i = 0; i < ringRadii.length; i++) {
        // Base ring
        const ringGeo = new THREE.TorusGeometry(ringRadii[i], 1.8, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeo, steel);
        
        // Add extreme detail: hundreds of magnetic coil segments per ring
        const segments = 60;
        for (let j = 0; j < segments; j++) {
            const angle = (j / segments) * Math.PI * 2;
            
            // Coil block
            const coilGeo = new THREE.BoxGeometry(4.5, 4.5, 5);
            const coilMesh = new THREE.Mesh(coilGeo, copper);
            coilMesh.position.set(Math.cos(angle) * ringRadii[i], Math.sin(angle) * ringRadii[i], 0);
            coilMesh.rotation.z = angle;
            
            // Neon superconducting strip inside the coil
            const stripGeo = new THREE.BoxGeometry(4.7, 0.5, 5.2);
            const stripMesh = new THREE.Mesh(stripGeo, neonCyan);
            coilMesh.add(stripMesh);

            // Tiny hydraulic heat sinks on each coil
            const sinkGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 8);
            const sinkMesh1 = new THREE.Mesh(sinkGeo, aluminum);
            sinkMesh1.position.set(1.5, 2.5, 0);
            coilMesh.add(sinkMesh1);
            const sinkMesh2 = new THREE.Mesh(sinkGeo, aluminum);
            sinkMesh2.position.set(-1.5, 2.5, 0);
            coilMesh.add(sinkMesh2);
            
            ringMesh.add(coilMesh);
        }
        
        ringMesh.rotation.set(...ringRotations[i]);
        containmentGroup.add(ringMesh);
        ringMeshes.push(ringMesh);
    }
    
    group.add(containmentGroup);

    animationUpdaters.push((time, speed) => {
        ringMeshes[0].rotation.x += 0.005 * speed;
        ringMeshes[1].rotation.y += 0.007 * speed;
        ringMeshes[2].rotation.z += 0.004 * speed;
        ringMeshes[3].rotation.x -= 0.006 * speed;
        ringMeshes[4].rotation.y -= 0.008 * speed;
        ringMeshes[5].rotation.z += 0.010 * speed;
    });

    parts.push({
        name: "Magnetic Containment Rings",
        description: "A nested array of superconducting toroids generating a 10^15 Tesla magnetic field to counteract extreme gravitational pull and stabilize the ergosphere.",
        material: "Superconducting YBCO / Steel / Copper",
        function: "Contains the intense plasma generated by Hawking radiation and prevents the black hole from drifting into the megastructure framework.",
        assemblyOrder: 3,
        connections: ["Singularity Core", "Gravitational Tether Primary Nodes"],
        failureEffect: "The black hole would slowly drift, consuming the megastructure from the inside out and disrupting local orbital mechanics.",
        cascadeFailures: ["Gravitational Tethers", "Heat Dissipation Radiators"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // ==========================================
    // 4. HAWKING RADIATION COLLECTOR FUNNELS
    // ==========================================
    const funnelGroup = new THREE.Group();
    const funnelAngles = [
        [Math.PI/2, 0, 0], [-Math.PI/2, 0, 0], [0, Math.PI/2, 0], [0, -Math.PI/2, 0],
        [0, 0, Math.PI/2], [0, 0, -Math.PI/2]
    ];
    const funnelPositions = [
        [0, 60, 0], [0, -60, 0], [60, 0, 0], [-60, 0, 0],
        [0, 0, 60], [0, 0, -60]
    ];
    
    const funnels = [];
    
    for (let i = 0; i < 6; i++) {
        const fGroup = new THREE.Group();
        
        // Main funnel cone (lathe geometry for hyperbolic curve)
        const points = [];
        for (let j = 0; j <= 20; j++) {
            const v = j / 20;
            // Radius curves outwards quadratically
            const r = 5 + Math.pow(v, 2) * 15; 
            const y = (v - 0.5) * 40;
            points.push(new THREE.Vector2(r, y));
        }
        const fGeo = new THREE.LatheGeometry(points, 64);
        const fMesh = new THREE.Mesh(fGeo, darkSteel);
        fMesh.material.side = THREE.DoubleSide;
        fGroup.add(fMesh);
        
        // Inner glowing collector
        const innerPoints = [];
        for (let j = 0; j <= 20; j++) {
            const v = j / 20;
            const r = 4 + Math.pow(v, 2) * 14.5; 
            const y = (v - 0.5) * 39;
            innerPoints.push(new THREE.Vector2(r, y));
        }
        const innerGeo = new THREE.LatheGeometry(innerPoints, 64);
        const innerMesh = new THREE.Mesh(innerGeo, neonPurple);
        innerMesh.material.transparent = true;
        innerMesh.material.opacity = 0.5;
        innerMesh.material.side = THREE.DoubleSide;
        fGroup.add(innerMesh);
        
        // Complex structural ribs around the funnel
        for (let r = 0; r <= 20; r += 4) {
            const v = r / 20;
            const radius = 5.5 + Math.pow(v, 2) * 15.5;
            const yPos = (v - 0.5) * 40;
            
            const ribGeo = new THREE.TorusGeometry(radius, 1.2, 16, 64);
            const ribMesh = new THREE.Mesh(ribGeo, chrome);
            ribMesh.position.y = yPos;
            ribMesh.rotation.x = Math.PI / 2;
            fGroup.add(ribMesh);
        }
        
        // Exterior hydraulic support struts
        for (let s = 0; s < 8; s++) {
            const angle = (s / 8) * Math.PI * 2;
            const strutGeo = new THREE.CylinderGeometry(0.8, 0.8, 42, 16);
            const strutMesh = new THREE.Mesh(strutGeo, steel);
            
            // Positioning diagonally to support the flare
            strutMesh.position.set(Math.cos(angle) * 12, 0, Math.sin(angle) * 12);
            strutMesh.rotation.x = Math.sin(angle) * 0.2;
            strutMesh.rotation.z = -Math.cos(angle) * 0.2;
            fGroup.add(strutMesh);
        }
        
        fGroup.position.set(...funnelPositions[i]);
        
        // Rotate to point towards center
        fGroup.lookAt(0, 0, 0);
        fGroup.rotateX(Math.PI / 2);
        
        funnelGroup.add(fGroup);
        funnels.push(fGroup);
    }
    
    group.add(funnelGroup);

    animationUpdaters.push((time, speed) => {
        funnels.forEach((f, idx) => {
            // High-frequency vibration due to intense radiation pressure
            f.position.x = funnelPositions[idx][0] + (Math.random() * 0.4 - 0.2) * speed;
            f.position.y = funnelPositions[idx][1] + (Math.random() * 0.4 - 0.2) * speed;
            f.position.z = funnelPositions[idx][2] + (Math.random() * 0.4 - 0.2) * speed;
        });
    });

    parts.push({
        name: "Hawking Radiation Collector Funnels",
        description: "Massive hyperbolic metamaterial funnels that capture high-energy gamma rays and exotic particles emitted by the black hole due to quantum effects at the event horizon.",
        material: "Dark Steel / Metamaterial / Chrome",
        function: "Funneling Hawking radiation into the Gamma Ray Conversion Chambers for energy extraction.",
        assemblyOrder: 4,
        connections: ["Singularity Core", "Gamma Ray Conversion Chambers"],
        failureEffect: "Uncontrolled gamma-ray bursts irradiating the entire megastructure, melting secondary tethers instantly.",
        cascadeFailures: ["Gamma Ray Conversion Chambers", "Energy Transfer Conduits"],
        originalPosition: { x: 0, y: 60, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // ==========================================
    // 5. GRAVITATIONAL TETHER PRIMARY NODES
    // ==========================================
    const tetherGroup = new THREE.Group();
    
    // We create a geodesic arrangement of primary nodes (Icosahedron vertices)
    const nodePositions = [];
    const phi = (1 + Math.sqrt(5)) / 2;
    const tetherRadius = 120;
    
    const icosahedronVertices = [
        [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
        [0, -1,  phi], [0,  1,  phi], [0, -1, -phi], [0,  1, -phi],
        [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];
    
    icosahedronVertices.forEach(v => {
        const length = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        nodePositions.push(new THREE.Vector3(v[0]/length * tetherRadius, v[1]/length * tetherRadius, v[2]/length * tetherRadius));
    });
    
    const nodes = [];
    nodePositions.forEach(pos => {
        const nGroup = new THREE.Group();
        
        // Node heavy base housing
        const baseGeo = new THREE.DodecahedronGeometry(8, 1);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        nGroup.add(baseMesh);
        
        // Inner grav-emitter core
        const coreGeo = new THREE.SphereGeometry(6, 32, 32);
        const coreMesh = new THREE.Mesh(coreGeo, neonCyan);
        nGroup.add(coreMesh);
        
        // Exterior armor plating
        const armorGeo = new THREE.IcosahedronGeometry(9, 1);
        const armorMesh = new THREE.Mesh(armorGeo, steel);
        armorMesh.material.wireframe = true;
        nGroup.add(armorMesh);
        
        nGroup.position.copy(pos);
        tetherGroup.add(nGroup);
        nodes.push(nGroup);
        
        // Primary massive tether cables pointing to the singularity
        // Made of multiple intertwined tubes
        const distance = pos.length();
        const halfPos = pos.clone().multiplyScalar(0.5).add(pos.clone().normalize().multiplyScalar(15));
        
        // Center thick cable
        const centralCableGeo = new THREE.CylinderGeometry(1.5, 2.5, distance - 30, 32);
        const centralCableMesh = new THREE.Mesh(centralCableGeo, chrome);
        centralCableMesh.position.copy(halfPos);
        centralCableMesh.lookAt(pos);
        centralCableMesh.rotateX(Math.PI / 2);
        tetherGroup.add(centralCableMesh);
        
        // Spiral secondary cables wrapping the main cable
        for(let c=0; c<3; c++) {
            const spiralPoints = [];
            const segments = 100;
            const cableLen = distance - 30;
            for(let j=0; j<=segments; j++) {
                const z = (j / segments) * cableLen - (cableLen/2);
                const angle = (j / segments) * Math.PI * 10 + (c * (Math.PI*2/3));
                const radius = 3 + (j / segments) * 1.5; // Tapers
                spiralPoints.push(new THREE.Vector3(Math.cos(angle)*radius, Math.sin(angle)*radius, z));
            }
            const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
            const spiralGeo = new THREE.TubeGeometry(spiralCurve, 64, 0.5, 8, false);
            const spiralMesh = new THREE.Mesh(spiralGeo, copper);
            
            // Re-orient to match the central cable
            spiralMesh.position.copy(halfPos);
            spiralMesh.lookAt(pos);
            tetherGroup.add(spiralMesh);
        }
    });
    
    group.add(tetherGroup);

    parts.push({
        name: "Gravitational Tether Primary Nodes",
        description: "Massive spatial anchors positioned at icosahedral vertices, housing the graviton-tension emitters that physically bind the structure to the singularity's intense spacetime curvature.",
        material: "Dark Steel / Chrome / Copper",
        function: "Maintains structural integrity against extreme spaghettification forces.",
        assemblyOrder: 5,
        connections: ["Gravitational Tether Secondary Web", "Magnetic Containment Rings"],
        failureEffect: "Tidal forces would instantly rip the megastructure apart, dragging all debris beyond the event horizon.",
        cascadeFailures: ["Main Structural Truss Frame", "Tension Adjustment Hydraulics"],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    // ==========================================
    // 6. GRAVITATIONAL TETHER SECONDARY WEB
    // ==========================================
    const webGroup = new THREE.Group();
    // Complex inter-node webbing
    for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
            const dist = nodePositions[i].distanceTo(nodePositions[j]);
            // Icosahedron edge length is roughly 1.051 * r
            if (Math.abs(dist - (tetherRadius * 1.051)) < 10) {
                // Main truss beam between nodes
                const edgeGeo = new THREE.CylinderGeometry(2, 2, dist, 16);
                const edgeMesh = new THREE.Mesh(edgeGeo, steel);
                
                const midPoint = new THREE.Vector3().addVectors(nodePositions[i], nodePositions[j]).multiplyScalar(0.5);
                edgeMesh.position.copy(midPoint);
                edgeMesh.lookAt(nodePositions[j]);
                edgeMesh.rotateX(Math.PI/2);
                
                webGroup.add(edgeMesh);

                // Add geometric support trusses (triangular wrapping)
                for(let t=0; t<3; t++) {
                    const trussAngle = (t/3) * Math.PI*2;
                    const trussGeo = new THREE.BoxGeometry(0.8, dist, 0.8);
                    const trussMesh = new THREE.Mesh(trussGeo, darkSteel);
                    
                    trussMesh.position.set(Math.cos(trussAngle)*4, 0, Math.sin(trussAngle)*4);
                    
                    // Cross bracing
                    for(let b=-dist/2 + 5; b<dist/2; b+=10) {
                        const braceGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 8);
                        const braceMesh = new THREE.Mesh(braceGeo, aluminum);
                        braceMesh.position.y = b;
                        braceMesh.rotation.x = Math.PI/4;
                        trussMesh.add(braceMesh);
                    }
                    
                    edgeMesh.add(trussMesh);
                }
            }
        }
    }
    group.add(webGroup);

    parts.push({
        name: "Gravitational Tether Secondary Web",
        description: "The interlinking composite beams connecting primary nodes, forged from carbon-nanotube-reinforced degenerate matter. Features extensive triangular cross-bracing.",
        material: "Steel / Dark Steel / Aluminum",
        function: "Distributes the immense sheer stresses evenly across the spherical volume of the facility.",
        assemblyOrder: 6,
        connections: ["Gravitational Tether Primary Nodes"],
        failureEffect: "Localized stress fractures leading to asymmetrical gravitational pulling and catastrophic shear.",
        cascadeFailures: ["Tension Adjustment Hydraulics"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 7. TENSION ADJUSTMENT HYDRAULICS
    // ==========================================
    const hydraulicsGroup = new THREE.Group();
    // Gigantic shock absorbers placed along the tethers
    const pistons = [];
    nodePositions.forEach((pos, idx) => {
        const pGroup = new THREE.Group();
        
        // Massive outer cylinder casing
        const outGeo = new THREE.CylinderGeometry(6, 6, 20, 32);
        const outMesh = new THREE.Mesh(outGeo, copper);
        pGroup.add(outMesh);
        
        // Detail rings on casing
        for(let r= -8; r<=8; r+=4) {
            const ringGeo = new THREE.TorusGeometry(6.2, 0.6, 16, 64);
            const ringMesh = new THREE.Mesh(ringGeo, darkSteel);
            ringMesh.position.y = r;
            ringMesh.rotation.x = Math.PI/2;
            pGroup.add(ringMesh);
        }
        
        // Inner active piston rod
        const inGeo = new THREE.CylinderGeometry(4, 4, 30, 32);
        const inMesh = new THREE.Mesh(inGeo, chrome);
        inMesh.position.y = 10; // offset
        pGroup.add(inMesh);
        
        // Hydraulic fluid pressure pipes
        for (let k = 0; k < 6; k++) {
            const angle = (k / 6) * Math.PI * 2;
            
            const pipePoints = [
                new THREE.Vector3(Math.cos(angle)*7, -10, Math.sin(angle)*7),
                new THREE.Vector3(Math.cos(angle)*9, -5, Math.sin(angle)*9),
                new THREE.Vector3(Math.cos(angle)*9, 5, Math.sin(angle)*9),
                new THREE.Vector3(Math.cos(angle)*7, 10, Math.sin(angle)*7)
            ];
            const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
            const pipeGeo = new THREE.TubeGeometry(pipeCurve, 16, 0.5, 8, false);
            const pipeMesh = new THREE.Mesh(pipeGeo, rubber);
            pGroup.add(pipeMesh);
        }
        
        const dir = pos.clone().normalize();
        // Placed roughly 50 units away from center
        pGroup.position.copy(dir.clone().multiplyScalar(50));
        pGroup.lookAt(pos);
        pGroup.rotateX(Math.PI/2);
        
        hydraulicsGroup.add(pGroup);
        // Save state for animation
        pistons.push({ mesh: inMesh, baseY: 10, phase: idx });
    });
    
    group.add(hydraulicsGroup);

    animationUpdaters.push((time, speed) => {
        pistons.forEach((p) => {
            // Intense, heavy piston pumping compensating for spacetime ripples
            p.mesh.position.y = p.baseY + Math.sin(time * 3 + p.phase) * 5; 
        });
    });

    parts.push({
        name: "Tension Adjustment Hydraulics",
        description: "Macro-scale hydraulic shock absorbers filled with magneto-rheological fluid, capable of adjusting length in milliseconds to counter gravitational waves emitted by the singularity.",
        material: "Copper / Chrome / Rubber",
        function: "Actively dampens extreme vibrations and shifts in the singularity's position, preventing structural resonance.",
        assemblyOrder: 7,
        connections: ["Gravitational Tether Primary Nodes", "Main Structural Truss Frame"],
        failureEffect: "Harmonic resonance buildup leading to catastrophic shattering of the tether web.",
        cascadeFailures: ["Gravitational Tether Secondary Web"],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // ==========================================
    // 8. GAMMA RAY CONVERSION CHAMBERS
    // ==========================================
    const conversionGroup = new THREE.Group();
    
    const chamberPos = [
        [0, 140, 0], [0, -140, 0], [140, 0, 0], [-140, 0, 0],
        [0, 0, 140], [0, 0, -140]
    ];
    
    chamberPos.forEach((pos, idx) => {
        const cGroup = new THREE.Group();
        
        // Massive Main Tank
        const tankGeo = new THREE.CylinderGeometry(18, 18, 50, 64);
        const tankMesh = new THREE.Mesh(tankGeo, steel);
        cGroup.add(tankMesh);
        
        // Glowing interior core visible through venting slots
        const innerTankGeo = new THREE.CylinderGeometry(17, 17, 48, 64);
        const innerTankMesh = new THREE.Mesh(innerTankGeo, neonPurple);
        cGroup.add(innerTankMesh);
        
        // Slotted armor plating (using thick overlapping toruses)
        for (let r = -20; r <= 20; r += 5) {
            const ribGeo = new THREE.TorusGeometry(18.5, 1.5, 32, 64);
            const ribMesh = new THREE.Mesh(ribGeo, darkSteel);
            ribMesh.rotation.x = Math.PI / 2;
            ribMesh.position.y = r;
            cGroup.add(ribMesh);
        }
        
        // Heavy End Caps (Hemispheres)
        const capGeo = new THREE.SphereGeometry(18, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        
        const topCap = new THREE.Mesh(capGeo, copper);
        topCap.position.y = 25;
        cGroup.add(topCap);
        
        const botCap = new THREE.Mesh(capGeo, copper);
        botCap.position.y = -25;
        botCap.rotation.x = Math.PI;
        cGroup.add(botCap);
        
        // Control consoles and valves on the chambers
        for(let v=0; v<4; v++) {
            const vAngle = (v/4)*Math.PI*2;
            const valveGroup = new THREE.Group();
            
            const vBox = new THREE.BoxGeometry(4, 8, 4);
            const vMesh = new THREE.Mesh(vBox, aluminum);
            valveGroup.add(vMesh);
            
            const vWheelGeo = new THREE.TorusGeometry(3, 0.5, 16, 32);
            const vWheel = new THREE.Mesh(vWheelGeo, chrome);
            vWheel.position.z = 2.5;
            valveGroup.add(vWheel);
            
            valveGroup.position.set(Math.cos(vAngle)*20, 0, Math.sin(vAngle)*20);
            valveGroup.lookAt(0,0,0);
            cGroup.add(valveGroup);
        }
        
        cGroup.position.set(...pos);
        cGroup.lookAt(0, 0, 0);
        cGroup.rotateX(Math.PI/2);
        
        conversionGroup.add(cGroup);
    });
    
    group.add(conversionGroup);

    parts.push({
        name: "Gamma Ray Conversion Chambers",
        description: "Enormous high-pressure tanks containing highly engineered Bose-Einstein condensates that absorb raw gamma radiation and emit coherent electron cascades. This acts as the primary power generation step.",
        material: "Steel / Copper / Neon Purple Plasma",
        function: "Energy generation from concentrated Hawking radiation.",
        assemblyOrder: 8,
        connections: ["Hawking Radiation Collector Funnels", "Energy Transfer Conduits"],
        failureEffect: "Chamber breach, causing localized antimatter-plasma explosions and catastrophic loss of grid power.",
        cascadeFailures: ["Energy Transfer Conduits", "Main Structural Truss Frame"],
        originalPosition: { x: 0, y: 140, z: 0 },
        explodedPosition: { x: 0, y: 350, z: 0 }
    });

    // ==========================================
    // 9. ENERGY TRANSFER CONDUITS
    // ==========================================
    const conduitGroup = new THREE.Group();
    // Insanely complex network of thick curved tubes mapping out the power grid
    
    for (let i = 0; i < chamberPos.length; i++) {
        for (let j = i + 1; j < chamberPos.length; j++) {
            const p1 = new THREE.Vector3(...chamberPos[i]);
            const p2 = new THREE.Vector3(...chamberPos[j]);
            
            if (p1.distanceTo(p2) < 220) {
                // Main outer transparent conduit
                const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
                mid.normalize().multiplyScalar(180); // Bow outwards heavily
                
                const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
                
                const tubeGeo = new THREE.TubeGeometry(curve, 64, 3, 16, false);
                const tubeMesh = new THREE.Mesh(tubeGeo, glass);
                tubeMesh.material.transparent = true;
                tubeMesh.material.opacity = 0.4;
                
                // Inner blinding energy stream
                const innerGeo = new THREE.TubeGeometry(curve, 64, 1.5, 16, false);
                const innerMesh = new THREE.Mesh(innerGeo, neonCyan);
                
                // Conduit support rings
                const points = curve.getPoints(20);
                points.forEach((pt, index) => {
                    if (index > 0 && index < 20) {
                        const ringGeo = new THREE.TorusGeometry(3.5, 0.4, 16, 32);
                        const ringMesh = new THREE.Mesh(ringGeo, steel);
                        ringMesh.position.copy(pt);
                        ringMesh.lookAt(curve.getPoint((index+1)/20));
                        conduitGroup.add(ringMesh);
                    }
                });
                
                conduitGroup.add(tubeMesh);
                conduitGroup.add(innerMesh);
            }
        }
    }
    
    group.add(conduitGroup);

    parts.push({
        name: "Energy Transfer Conduits",
        description: "Vacuum-sealed transparent metamaterial tubes channeling high-energy electron cascades and exotic plasmas from the conversion chambers to the central grid.",
        material: "Transparent Metamaterial / Neon Cyan Plasma / Steel",
        function: "Power transmission across the megastructure.",
        assemblyOrder: 9,
        connections: ["Gamma Ray Conversion Chambers", "Superconducting Magnetic Coils"],
        failureEffect: "Plasma leakage causing rapid melting of adjacent struts and devastating electrical arcs.",
        cascadeFailures: ["Main Structural Truss Frame"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 10. HEAT DISSIPATION RADIATORS
    // ==========================================
    const radiatorGroup = new THREE.Group();
    // Huge fins projecting outwards to radiate waste heat
    
    const finCount = 120; // Massive array
    const radiatorRadius = 190;
    
    for (let i = 0; i < finCount; i++) {
        const angle = (i / finCount) * Math.PI * 2;
        
        const finGroup = new THREE.Group();
        
        // Main Fin Plate
        const finGeo = new THREE.BoxGeometry(60, 2, 15);
        const finMesh = new THREE.Mesh(finGeo, aluminum);
        finGroup.add(finMesh);
        
        // Glowing micro-channels for coolant
        const glowGeo = new THREE.BoxGeometry(58, 2.2, 1);
        const glowMesh = new THREE.Mesh(glowGeo, accretionDiskMat);
        finGroup.add(glowMesh);
        
        // Sub-fins for extra surface area
        for(let s=-6; s<=6; s+=3) {
            const subFin = new THREE.BoxGeometry(50, 4, 0.5);
            const subMesh = new THREE.Mesh(subFin, darkSteel);
            subMesh.position.z = s;
            finGroup.add(subMesh);
        }
        
        finGroup.position.set(Math.cos(angle) * radiatorRadius, 0, Math.sin(angle) * radiatorRadius);
        finGroup.rotation.y = -angle;
        // Pitch the fins dynamically
        finGroup.rotation.z = Math.PI / 4;
        
        radiatorGroup.add(finGroup);
    }
    
    group.add(radiatorGroup);

    parts.push({
        name: "Heat Dissipation Radiators",
        description: "An array of 120 massive aluminum-graphene composite fins designed to radiate excess thermal energy (in the petawatt range) into the vacuum of space.",
        material: "Aluminum / Graphene / Thermal Plasma",
        function: "Prevents the megastructure from melting due to the intense proximity to the accretion disk and energy conversion inefficiencies.",
        assemblyOrder: 10,
        connections: ["Main Structural Truss Frame"],
        failureEffect: "Thermal runaway, leading to the melting of the magnetic containment rings and subsequent release of the singularity.",
        cascadeFailures: ["Magnetic Containment Rings", "Singularity Core"],
        originalPosition: { x: 190, y: 0, z: 0 },
        explodedPosition: { x: 350, y: 0, z: 0 }
    });

    // ==========================================
    // 11. PLASMA ACCELERATORS
    // ==========================================
    const acceleratorGroup = new THREE.Group();
    // Gigantic rings circling the entire structure, used to induce frame-dragging
    
    const accRotations = [
        [Math.PI/2, 0, 0],
        [0, 0, Math.PI/2],
        [Math.PI/4, Math.PI/4, 0],
        [-Math.PI/4, Math.PI/4, 0]
    ];
    
    const accMeshes = [];
    const accRadius = 230;
    
    accRotations.forEach((rot) => {
        const accGeo = new THREE.TorusGeometry(accRadius, 4, 64, 256);
        const accMesh = new THREE.Mesh(accGeo, darkSteel);
        accMesh.rotation.set(...rot);
        
        // Accelerator nodes densely packed
        for(let j=0; j<48; j++) {
            const angle = (j/48)*Math.PI*2;
            const nodeGroup = new THREE.Group();
            
            const nodeGeo = new THREE.CylinderGeometry(8, 8, 12, 32);
            const nodeMesh = new THREE.Mesh(nodeGeo, chrome);
            nodeMesh.rotation.x = Math.PI/2;
            nodeGroup.add(nodeMesh);
            
            // Dual neon injection rings
            const neonGeo = new THREE.TorusGeometry(8.5, 0.8, 16, 64);
            
            const neon1 = new THREE.Mesh(neonGeo, neonPurple);
            neon1.position.z = 3;
            neon1.rotation.x = Math.PI/2;
            nodeGroup.add(neon1);
            
            const neon2 = new THREE.Mesh(neonGeo, neonPurple);
            neon2.position.z = -3;
            neon2.rotation.x = Math.PI/2;
            nodeGroup.add(neon2);
            
            nodeGroup.position.set(Math.cos(angle)*accRadius, Math.sin(angle)*accRadius, 0);
            
            accMesh.add(nodeGroup);
        }
        
        acceleratorGroup.add(accMesh);
        accMeshes.push(accMesh);
    });
    
    group.add(acceleratorGroup);

    animationUpdaters.push((time, speed) => {
        accMeshes[0].rotation.z += 0.010 * speed;
        accMeshes[1].rotation.x += 0.015 * speed;
        accMeshes[2].rotation.y -= 0.012 * speed;
        accMeshes[3].rotation.z -= 0.009 * speed;
    });

    parts.push({
        name: "Plasma Accelerators",
        description: "Gigantic particle accelerators encircling the entire structure, used to inject highly energetic matter into the accretion disk at precise angles to control the singularity's spin rate.",
        material: "Dark Steel / Chrome / Neon Purple",
        function: "Modulates the Penrose process efficiency by directly manipulating the angular momentum of the black hole.",
        assemblyOrder: 11,
        connections: ["Main Structural Truss Frame"],
        failureEffect: "Inability to control black hole spin, leading to wild frame-dragging tearing the fabric of the megastructure apart.",
        cascadeFailures: ["Event Horizon Distortion Field", "Gravitational Tether Secondary Web"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 12. STABILIZATION GYROSCOPES
    // ==========================================
    const gyroGroup = new THREE.Group();
    // 8 absolute massive gyroscopes at orbital vertices
    const gyroPos = [ 
        [200, 200, 200], [-200, 200, 200], [200, -200, 200], [-200, -200, 200],
        [200, 200, -200], [-200, 200, -200], [200, -200, -200], [-200, -200, -200]
    ];
    
    const gyros = [];
    
    gyroPos.forEach(pos => {
        const gGroup = new THREE.Group();
        
        // Tri-axis gimbals
        const gimbalGeo1 = new THREE.TorusGeometry(25, 3, 32, 64);
        const gimbal1 = new THREE.Mesh(gimbalGeo1, steel);
        gGroup.add(gimbal1);
        
        const gimbalGeo2 = new THREE.TorusGeometry(20, 3, 32, 64);
        const gimbal2 = new THREE.Mesh(gimbalGeo2, copper);
        gimbal1.add(gimbal2);
        
        const gimbalGeo3 = new THREE.TorusGeometry(15, 3, 32, 64);
        const gimbal3 = new THREE.Mesh(gimbalGeo3, darkSteel);
        gimbal2.add(gimbal3);
        
        // Central extremely dense spinning mass
        const massGeo = new THREE.SphereGeometry(10, 64, 64);
        const massMesh = new THREE.Mesh(massGeo, chrome);
        
        // Add equatorial trench to mass
        const trenchGeo = new THREE.TorusGeometry(10.2, 1, 16, 64);
        const trenchMesh = new THREE.Mesh(trenchGeo, neonCyan);
        massMesh.add(trenchMesh);
        
        gimbal3.add(massMesh);
        
        gGroup.position.set(...pos);
        gyroGroup.add(gGroup);
        gyros.push({ g1: gimbal1, g2: gimbal2, g3: gimbal3, mass: massMesh });
    });
    
    group.add(gyroGroup);

    animationUpdaters.push((time, speed) => {
        gyros.forEach((g, idx) => {
            g.g1.rotation.x += 0.02 * speed * (idx % 2 === 0 ? 1 : -1);
            g.g2.rotation.y += 0.03 * speed * (idx % 3 === 0 ? -1 : 1);
            g.g3.rotation.z += 0.04 * speed;
            g.mass.rotation.y += 0.20 * speed; // extremely fast spin
            g.mass.rotation.x -= 0.15 * speed;
        });
    });

    parts.push({
        name: "Stabilization Gyroscopes",
        description: "Ultra-massive degenerate matter spheres spun to relativistic speeds within multi-axis gimbals. They provide absolute attitude control for the megastructure.",
        material: "Steel / Copper / Chrome / Degenerate Matter",
        function: "Maintains the station's orientation against the erratic, violent frame-dragging currents of the singularity.",
        assemblyOrder: 12,
        connections: ["Main Structural Truss Frame"],
        failureEffect: "Station undergoes chaotic tumbling, resulting in the tethers wrapping around the event horizon and obliterating the entire assembly.",
        cascadeFailures: ["Gravitational Tether Primary Nodes", "Plasma Accelerators"],
        originalPosition: { x: 200, y: 200, z: 200 },
        explodedPosition: { x: 400, y: 400, z: 400 }
    });

    // ==========================================
    // 13. COMMAND AND CONTROL CITADEL
    // ==========================================
    const citadelGroup = new THREE.Group();
    
    // Main heavy armored base
    const baseGeo = new THREE.CylinderGeometry(25, 40, 30, 16);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    citadelGroup.add(baseMesh);
    
    // Habitation / Operations Deck
    const deckGeo = new THREE.CylinderGeometry(35, 25, 15, 32);
    const deckMesh = new THREE.Mesh(deckGeo, steel);
    deckMesh.position.y = 22.5;
    citadelGroup.add(deckMesh);
    
    // Continuous 360-degree observation window
    const windowGeo = new THREE.CylinderGeometry(35.5, 25.5, 6, 32);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.y = 22.5;
    citadelGroup.add(windowMesh);
    
    // Sensor arrays and communication spires
    for(let a=0; a<4; a++) {
        const aGeo = new THREE.CylinderGeometry(0.5, 2, 50, 8);
        const aMesh = new THREE.Mesh(aGeo, chrome);
        const xOffset = Math.cos((a/4)*Math.PI*2) * 15;
        const zOffset = Math.sin((a/4)*Math.PI*2) * 15;
        aMesh.position.set(xOffset, 55, zOffset);
        citadelGroup.add(aMesh);
    }
    
    // Central primary transmission spire
    const mainSpire = new THREE.CylinderGeometry(2, 5, 80, 16);
    const mainSpireMesh = new THREE.Mesh(mainSpire, darkSteel);
    mainSpireMesh.position.y = 70;
    citadelGroup.add(mainSpireMesh);
    
    // Docking bays around the base
    for(let d=0; d<6; d++) {
        const dAngle = (d/6)*Math.PI*2;
        const bayGeo = new THREE.BoxGeometry(10, 10, 15);
        const bayMesh = new THREE.Mesh(bayGeo, aluminum);
        
        bayMesh.position.set(Math.cos(dAngle)*35, 0, Math.sin(dAngle)*35);
        bayMesh.rotation.y = -dAngle;
        
        // Inner glowing bay doors
        const doorGeo = new THREE.PlaneGeometry(8, 8);
        const doorMesh = new THREE.Mesh(doorGeo, neonCyan);
        doorMesh.position.z = 7.6;
        bayMesh.add(doorMesh);
        
        citadelGroup.add(bayMesh);
    }
    
    citadelGroup.position.set(0, 260, 0);
    group.add(citadelGroup);

    parts.push({
        name: "Command and Control Citadel",
        description: "The heavily shielded nerve center of the tether, housing AGI mainframes, quantum computers, and the biological oversight crew. Protected by active magnetic deflector shields to survive random radiation spikes.",
        material: "Dark Steel / Tinted Glass / Aluminum",
        function: "Monitors singularity metrics, tether tension, energy throughput, and controls the Alcubierre distortion fields.",
        assemblyOrder: 13,
        connections: ["Main Structural Truss Frame", "Quantum Entanglement Relays"],
        failureEffect: "Loss of automated control, leading to manual fail-deadly self-destruction to prevent the black hole from wandering into populated space.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 260, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // ==========================================
    // 14. MAIN STRUCTURAL TRUSS FRAME
    // ==========================================
    const trussGroup = new THREE.Group();
    // A massive enclosing wireframe sphere made of actual thick cylinders
    
    const maxTrussRadius = 250;
    const phiTruss = (1 + Math.sqrt(5)) / 2;
    
    // We use a highly subdivided icosahedron pattern for complexity
    const icoGeo = new THREE.IcosahedronGeometry(maxTrussRadius, 1);
    const posAttr = icoGeo.attributes.position;
    const tv = [];
    for(let i=0; i<posAttr.count; i++) {
        tv.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
    }
    
    // Connect vertices to form the lattice
    // We must ensure we don't draw overlapping beams, so we keep track of pairs
    const beamPairs = new Set();
    
    for (let i = 0; i < tv.length; i++) {
        // Add giant armored node spheres at each vertex
        const nodeGeo = new THREE.SphereGeometry(6, 16, 16);
        const nodeMesh = new THREE.Mesh(nodeGeo, steel);
        nodeMesh.position.copy(tv[i]);
        trussGroup.add(nodeMesh);
        
        for (let j = i + 1; j < tv.length; j++) {
            const dist = tv[i].distanceTo(tv[j]);
            // Icosahedron subdivision edge lengths vary, we pick a threshold to connect nearest neighbors
            if (dist < 150) { 
                const pairHash = `${i}-${j}`;
                if (!beamPairs.has(pairHash)) {
                    beamPairs.add(pairHash);
                    
                    const beamGeo = new THREE.CylinderGeometry(2.5, 2.5, dist, 12);
                    const beamMesh = new THREE.Mesh(beamGeo, darkSteel);
                    
                    const mid = new THREE.Vector3().addVectors(tv[i], tv[j]).multiplyScalar(0.5);
                    beamMesh.position.copy(mid);
                    beamMesh.lookAt(tv[j]);
                    beamMesh.rotateX(Math.PI/2);
                    
                    // Inner glowing plasma structural reinforcement
                    const coreGeo = new THREE.CylinderGeometry(1, 1, dist+2, 8);
                    const coreMesh = new THREE.Mesh(coreGeo, accretionDiskMat);
                    beamMesh.add(coreMesh);
                    
                    trussGroup.add(beamMesh);
                }
            }
        }
    }
    
    group.add(trussGroup);

    parts.push({
        name: "Main Structural Truss Frame",
        description: "The primary exoskeleton of the facility, composed of neutronium-laced carbon lattices. It surrounds the entire apparatus in an impenetrable, self-repairing geodesic cage.",
        material: "Dark Steel / Neutronium / Plasma Core",
        function: "Provides the immense rigid backbone to which all secondary systems, gyros, and radiators anchor.",
        assemblyOrder: 14,
        connections: ["Everything"],
        failureEffect: "Complete structural collapse inward towards the singularity, utterly destroying the facility.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 15. SUBATOMIC PARTICLE SENSORS
    // ==========================================
    const sensorGroup = new THREE.Group();
    // Hundreds of tiny sensors scattered on the lattice
    
    for (let i = 0; i < 200; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phiAngle = Math.acos((Math.random() * 2) - 1);
        
        const r = maxTrussRadius + 10;
        const x = r * Math.sin(phiAngle) * Math.cos(theta);
        const y = r * Math.sin(phiAngle) * Math.sin(theta);
        const z = r * Math.cos(phiAngle);
        
        const sGroup = new THREE.Group();
        
        const sBox = new THREE.BoxGeometry(3, 6, 3);
        const sMesh = new THREE.Mesh(sBox, chrome);
        sGroup.add(sMesh);
        
        // Tiny radar dish
        const sDish = new THREE.CylinderGeometry(4, 0, 2, 16);
        const sDishMesh = new THREE.Mesh(sDish, copper);
        sDishMesh.position.y = 4;
        sGroup.add(sDishMesh);
        
        // Sensor laser
        const laserGeo = new THREE.CylinderGeometry(0.2, 0.2, 15, 4);
        const laserMesh = new THREE.Mesh(laserGeo, neonCyan);
        laserMesh.position.y = 10;
        sGroup.add(laserMesh);
        
        sGroup.position.set(x, y, z);
        sGroup.lookAt(0, 0, 0); // pointing inward to monitor the hole
        sGroup.rotateX(Math.PI/2);
        
        sensorGroup.add(sGroup);
    }
    group.add(sensorGroup);

    parts.push({
        name: "Subatomic Particle Sensors",
        description: "High-fidelity neutrino and tachyon detectors scattered across the outer hull, constantly analyzing the quantum froth near the event horizon down to the Planck length.",
        material: "Chrome / Copper / Neon Cyan",
        function: "Serves as a hyper-accurate early warning system for sudden Hawking radiation surges and virtual particle pair production anomalies.",
        assemblyOrder: 15,
        connections: ["Main Structural Truss Frame", "Command and Control Citadel"],
        failureEffect: "Blindness to quantum fluctuations, leading to unexpected radiation spikes melting vital components without warning.",
        cascadeFailures: ["Command and Control Citadel"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 16. EMERGENCY VENTING EXHAUSTS
    // ==========================================
    const exhaustGroup = new THREE.Group();
    // Massive exhausts pointing directly OUTWARDS to provide thrust/venting
    
    const exhaustPos = [ 
        [180, -180, 0], [-180, -180, 0], [0, -180, 180], [0, -180, -180] 
    ];
    
    exhaustPos.forEach(pos => {
        const eGroup = new THREE.Group();
        
        // Main thruster bell
        const pipeGeo = new THREE.CylinderGeometry(15, 25, 60, 32);
        const pipeMesh = new THREE.Mesh(pipeGeo, darkSteel);
        eGroup.add(pipeMesh);
        
        // Vent flaps (vectoring nozzles)
        for (let j = 0; j < 12; j++) {
            const angle = (j / 12) * Math.PI * 2;
            const flapGeo = new THREE.BoxGeometry(6, 20, 2);
            const flapMesh = new THREE.Mesh(flapGeo, steel);
            // Positioned at the bottom of the bell
            flapMesh.position.set(Math.cos(angle)*24, -30, Math.sin(angle)*24);
            flapMesh.rotation.y = -angle;
            flapMesh.rotation.x = -Math.PI / 8; // Open outwards
            eGroup.add(flapMesh);
        }
        
        // Blinding inner exhaust flame
        const glowGeo = new THREE.CylinderGeometry(14, 24, 59, 32);
        const glowMesh = new THREE.Mesh(glowGeo, plasmaRed);
        eGroup.add(glowMesh);
        
        eGroup.position.set(...pos);
        // Point them strictly OUTWARD and DOWNWARD
        eGroup.lookAt(pos[0]*2, pos[1]*2, pos[2]*2);
        eGroup.rotateX(Math.PI/2);
        
        exhaustGroup.add(eGroup);
    });
    group.add(exhaustGroup);

    parts.push({
        name: "Emergency Venting Exhausts",
        description: "Massive pressure relief valves designed to jettison superheated plasma and exotic matter into deep space in the event of a containment failure. Can double as emergency orbital thrusters.",
        material: "Dark Steel / Plasma Red",
        function: "Prevents internal explosions during massive energy spikes.",
        assemblyOrder: 16,
        connections: ["Gamma Ray Conversion Chambers"],
        failureEffect: "Internal rupture of conversion chambers due to extreme overpressure.",
        cascadeFailures: ["Gamma Ray Conversion Chambers", "Heat Dissipation Radiators"],
        originalPosition: { x: 0, y: -180, z: 0 },
        explodedPosition: { x: 0, y: -400, z: 0 }
    });

    // ==========================================
    // 17. QUANTUM ENTANGLEMENT RELAYS
    // ==========================================
    const relayGroup = new THREE.Group();
    // Complex floating relay nodes orbiting the citadel
    
    const relays = [];
    for(let i=0; i<12; i++) {
        const rGroup = new THREE.Group();
        
        // Outer containment shell
        const crystalGeo = new THREE.OctahedronGeometry(8, 2); // rounded octahedron
        const crystalMesh = new THREE.Mesh(crystalGeo, glass);
        crystalMesh.material.transparent = true;
        crystalMesh.material.opacity = 0.6;
        
        // The entangled particle matrix
        const innerCrystalGeo = new THREE.IcosahedronGeometry(4, 0);
        const innerCrystalMesh = new THREE.Mesh(innerCrystalGeo, neonPurple);
        
        // Orbiting data rings
        const ringGeo = new THREE.TorusGeometry(10, 0.5, 16, 64);
        const ring1 = new THREE.Mesh(ringGeo, chrome);
        ring1.rotation.x = Math.PI/2;
        const ring2 = new THREE.Mesh(ringGeo, chrome);
        ring2.rotation.y = Math.PI/2;
        
        rGroup.add(crystalMesh);
        rGroup.add(innerCrystalMesh);
        rGroup.add(ring1);
        rGroup.add(ring2);
        
        relayGroup.add(rGroup);
        relays.push({ 
            mesh: rGroup, 
            angle: (i/12)*Math.PI*2,
            ring1: ring1,
            ring2: ring2,
            inner: innerCrystalMesh 
        });
    }
    group.add(relayGroup);
    
    animationUpdaters.push((time, speed) => {
        relays.forEach((r, idx) => {
            r.angle += 0.005 * speed;
            // Orbiting the Citadel at Y=280
            r.mesh.position.set(
                Math.cos(r.angle) * 70,
                280 + Math.sin(time * 4 + idx) * 10, // bobbing up and down
                Math.sin(r.angle) * 70
            );
            
            r.inner.rotation.y += 0.1 * speed;
            r.ring1.rotation.x += 0.05 * speed;
            r.ring2.rotation.y += 0.05 * speed;
        });
    });

    parts.push({
        name: "Quantum Entanglement Relays",
        description: "Floating crystalline matrices housing isolated, entangled particles. They provide instantaneous, completely unjammable faster-than-light communication with the broader galactic network.",
        material: "Glass / Metamaterial / Neon Purple / Chrome",
        function: "Handles vast telemetry data and maintains a continuous off-site backup of the AGI core.",
        assemblyOrder: 17,
        connections: ["Command and Control Citadel"],
        failureEffect: "Station is completely isolated from the network, requiring unpredictable autonomous AGI decision-making during crises.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 280, z: 0 },
        explodedPosition: { x: 0, y: 600, z: 0 }
    });

    // --- MASTER ANIMATION FUNCTION ---
    const animate = (time, speed, meshes) => {
        // Run all component updaters
        animationUpdaters.forEach(fn => fn(time, speed));
        
        // Massive structure-wide vibration indicating immense gravitational stress
        const globalVibrateX = Math.sin(time * 25) * 0.3 * speed;
        const globalVibrateY = Math.cos(time * 18) * 0.3 * speed;
        const globalVibrateZ = Math.sin(time * 22) * 0.3 * speed;
        
        group.position.set(globalVibrateX, globalVibrateY, globalVibrateZ);
    };

    // --- PhD LEVEL ASTROPHYSICS QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "According to the Penrose process, what is the theoretical maximum rest-mass energy extraction efficiency from a maximally rotating (Kerr) black hole?",
            options: [
                "100%",
                "29%",
                "20.7%",
                "42%"
            ],
            correctAnswer: 2,
            explanation: "By dropping matter into the ergosphere of a Kerr black hole and splitting it so that one piece falls into the event horizon with negative orbital energy, up to 20.7% of the total mass-energy of the black hole can theoretically be extracted."
        },
        {
            question: "What dictates the temperature of the Hawking radiation emitted by a primordial black hole as it loses mass?",
            options: [
                "It remains constant regardless of mass.",
                "It decreases logarithmically with mass loss.",
                "It increases inversely proportional to its mass.",
                "It drops to absolute zero instantly upon reaching the Planck mass."
            ],
            correctAnswer: 2,
            explanation: "Hawking radiation temperature is inversely proportional to the black hole's mass (T ∝ 1/M). As the black hole evaporates and loses mass, it gets exponentially hotter and emits radiation faster, eventually ending in a flash of gamma rays."
        },
        {
            question: "Why is a massive magnetic containment ring array required for this tethered singularity?",
            options: [
                "To repel the singularity gravitationally via anti-gravity fields.",
                "To contain the dense relativistic plasma generated in the ergosphere from escaping and vaporizing the tether.",
                "To generate artificial gravity for the citadel.",
                "To slow down the spin of the black hole via magnetic braking."
            ],
            correctAnswer: 1,
            explanation: "The extreme conditions near the event horizon strip electrons from atoms, generating dense, highly energetic plasma. The magnetic rings confine this plasma and direct it away from the physical structure, preventing the immediate vaporization of the structural framework."
        },
        {
            question: "If the Tension Adjustment Hydraulics fail, the tether network experiences a phenomenon akin to spaghettification. In general relativity, this is technically caused by:",
            options: [
                "Extreme tidal forces, mathematically represented by the Weyl tensor components in vacuum.",
                "Intense Hawking radiation melting the carbon nanotubes.",
                "The Alcubierre metric reversing its polarity.",
                "Quantum entanglement breaking down across macroscopic scales."
            ],
            correctAnswer: 0,
            explanation: "Spaghettification (the noodle effect) is caused by extreme tidal forces—the gravitational gradient across an object. In vacuum, outside the source, these tidal forces are described strictly by the Weyl tensor, which stretches objects in the radial direction and compresses them in transverse directions."
        },
        {
            question: "What is the theoretical mechanism by which the 'Event Horizon Distortion Field' could artificially increase the Hawking radiation yield?",
            options: [
                "By teleporting the black hole closer to the funnels.",
                "By locally modifying the spacetime metric to reduce the effective surface gravity, effectively expanding the apparent horizon area where virtual particle pairs are separated.",
                "By creating a microscopic wormhole to a white hole.",
                "By shielding the citadel from cosmic rays, allowing for better collection."
            ],
            correctAnswer: 1,
            explanation: "Hawking radiation is dependent on surface gravity (κ). By manipulating the spacetime metric around the horizon (similar to an Alcubierre bubble), you could theoretically alter the geometry, separating virtual pairs at a much higher rate and drastically increasing the energy yield."
        }
    ];

    const description = "The Primordial Black Hole Tether (Ultra God Tier) is a theoretical megastructure designed to capture and endlessly harvest energy from a mountain-mass primordial black hole. Utilizing a devastating combination of Hawking radiation funnels, Penrose process plasma accelerators, and extreme Alcubierre metric distortion fields, it extracts infinite power directly from the fabric of spacetime itself. The sheer gravitational stresses require a neutronium-laced geodesic tether web, continuously adjusted by massive magneto-rheological hydraulics, lest the entire structure be consumed by relativistic tidal forces.";

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
