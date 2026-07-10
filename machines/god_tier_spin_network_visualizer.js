import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Animation state registries
    const updatables = [];
    const rotatingRings = [];
    const pulsingNodes = [];
    const evolvingEdges = [];
    const spinFoamFaces = [];
    const hydraulicPistons = [];

    // Custom Materials
    const hologramNodeMat1 = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        transmission: 0.8,
        ior: 1.5,
        roughness: 0.1,
        metalness: 0.2
    });

    const hologramNodeMat2 = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        transmission: 0.8,
        ior: 1.5,
        roughness: 0.1,
        metalness: 0.2
    });

    const hologramEdgeMats = {
        'half': new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2.0, transparent: true, opacity: 0.6 }),
        'one': new THREE.MeshStandardMaterial({ color: 0xff00aa, emissive: 0xff00aa, emissiveIntensity: 2.5, transparent: true, opacity: 0.8 }),
        'three_halves': new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 3.0, transparent: true, opacity: 0.9 }),
        'two': new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4.0, transparent: true, opacity: 1.0 })
    };

    const hologramFaceMat = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const glowingScreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5
    });

    // ==========================================
    // 1. QUANTUM CONTAINMENT BASE PLATFORM
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Main foundation Lathe
    const basePoints = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const r = 25 - Math.pow(t, 2) * 10 + Math.sin(t * Math.PI * 8) * 0.5;
        basePoints.push(new THREE.Vector2(r, t * 8));
    }
    const baseGeo = new THREE.LatheGeometry(basePoints, 128);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = -15;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseGroup.add(baseMesh);

    // Tread plate details on top of base
    const treadGeo = new THREE.RingGeometry(15, 25, 64);
    const treadMesh = new THREE.Mesh(treadGeo, steel);
    treadMesh.rotation.x = -Math.PI / 2;
    treadMesh.position.y = -14.9;
    baseGroup.add(treadMesh);

    // Hydraulic support struts for the base
    const strutGroup = new THREE.Group();
    const numStruts = 16;
    for (let i = 0; i < numStruts; i++) {
        const angle = (i / numStruts) * Math.PI * 2;
        const strutBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 6, 16), darkSteel);
        strutBase.position.set(Math.cos(angle) * 22, -12, Math.sin(angle) * 22);
        strutBase.rotation.x = Math.PI / 6 * Math.sin(angle);
        strutBase.rotation.z = Math.PI / 6 * Math.cos(angle);
        strutGroup.add(strutBase);

        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 8, 16), chrome);
        piston.position.copy(strutBase.position);
        piston.position.y += 4;
        piston.rotation.copy(strutBase.rotation);
        strutGroup.add(piston);
        
        hydraulicPistons.push({
            mesh: piston,
            baseY: piston.position.y,
            phase: i
        });
    }
    baseGroup.add(strutGroup);

    parts.push({
        name: "Quantum Containment Foundation",
        description: "A massive, heavy-duty dark steel foundation designed to isolate quantum calculations from seismic and thermal decoherence.",
        material: "darkSteel",
        function: "Structural support and absolute quantum isolation base.",
        assemblyOrder: 1,
        connections: ["Cooling Pipes", "Hologram Projectors", "Operator Cabin"],
        failureEffect: "Environmental decoherence leading to instant collapse of the spin network visualization.",
        cascadeFailures: ["Holographic Matrix", "Confinement Rings"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // ==========================================
    // 2. CRYOGENIC SUPERFLUID COOLING MANIFOLD
    // ==========================================
    class PipeCurve extends THREE.Curve {
        constructor(scale = 1, angleOffset = 0, complexity = 1) {
            super();
            this.scale = scale;
            this.angleOffset = angleOffset;
            this.complexity = complexity;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const r = 16 + Math.sin(t * Math.PI * 6 * this.complexity) * 1.5;
            const y = -14 + t * 24;
            const theta = t * Math.PI * 1.5 + this.angleOffset;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }

    const coolingGroup = new THREE.Group();
    const numPipes = 24;
    for (let i = 0; i < numPipes; i++) {
        const pipePath = new PipeCurve(1, (i / numPipes) * Math.PI * 2, i % 2 === 0 ? 1 : -1);
        const pipeGeo = new THREE.TubeGeometry(pipePath, 128, 0.4, 16, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, glass);
        coolingGroup.add(pipeMesh);
        
        const fluidGeo = new THREE.TubeGeometry(pipePath, 128, 0.25, 8, false);
        const fluidMat = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0055ff,
            emissiveIntensity: 2.0,
            transparent: true,
            opacity: 0.8
        });
        const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
        coolingGroup.add(fluidMesh);
    }
    
    parts.push({
        name: "Superfluid Helium-4 Cooling Manifold",
        description: "Intricate network of borosilicate glass tubes circulating superfluid helium-4 to maintain extreme superconducting states for the projection core.",
        material: "glass",
        function: "Thermal regulation of the spin network generation core.",
        assemblyOrder: 2,
        connections: ["Containment Foundation", "Confinement Rings"],
        failureEffect: "Thermal runaway and melting of quantum processors, triggering catastrophic plasma venting.",
        cascadeFailures: ["Projection Core", "Magnetic Rings"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 35 }
    });

    // ==========================================
    // 3. MAGNETIC CONFINEMENT RINGS
    // ==========================================
    const ringsGroup = new THREE.Group();
    const ringConfigs = [
        { radius: 18, tube: 1.2, radialSegments: 32, tubularSegments: 200, material: steel, speed: 0.2, axis: 'y' },
        { radius: 19, tube: 0.8, radialSegments: 16, tubularSegments: 150, material: copper, speed: -0.3, axis: 'x' },
        { radius: 20, tube: 0.5, radialSegments: 16, tubularSegments: 150, material: chrome, speed: 0.4, axis: 'z' },
        { radius: 21, tube: 1.5, radialSegments: 64, tubularSegments: 256, material: darkSteel, speed: -0.1, axis: 'y' }
    ];

    ringConfigs.forEach((config, index) => {
        const rGroup = new THREE.Group();
        
        // Main torus
        const rGeo = new THREE.TorusGeometry(config.radius, config.tube, config.radialSegments, config.tubularSegments);
        const rMesh = new THREE.Mesh(rGeo, config.material);
        rGroup.add(rMesh);

        // Add magnetic nodes along the ring
        const numNodes = 12;
        for (let j = 0; j < numNodes; j++) {
            const angle = (j / numNodes) * Math.PI * 2;
            const nodeGeo = new THREE.BoxGeometry(config.tube * 3, config.tube * 3, config.tube * 3);
            const nodeMesh = new THREE.Mesh(nodeGeo, chrome);
            nodeMesh.position.set(config.radius * Math.cos(angle), config.radius * Math.sin(angle), 0);
            
            // Neon strips on nodes
            const stripGeo = new THREE.BoxGeometry(config.tube * 3.2, config.tube * 0.5, config.tube * 3.2);
            const stripMesh = new THREE.Mesh(stripGeo, glowingScreenMat);
            stripMesh.position.copy(nodeMesh.position);
            
            rGroup.add(nodeMesh);
            rGroup.add(stripMesh);
        }

        ringsGroup.add(rGroup);
        rotatingRings.push({
            group: rGroup,
            speed: config.speed,
            axis: config.axis
        });

        parts.push({
            name: `Confinement Ring Alpha-${index}`,
            description: `A hyper-dense ${config.material === copper ? 'copper' : 'steel'} torus that generates tera-Gauss magnetic fields to trap the holographic spin states.`,
            material: "mixed",
            function: "Prevents the holographic quantum states from dissipating into standard spacetime.",
            assemblyOrder: 3 + index,
            connections: ["Cooling Manifold", "Projection Core"],
            failureEffect: "Loss of containment; spin states bleed into surrounding area causing localized gravity anomalies.",
            cascadeFailures: ["Operator Cabin", "Holographic Matrix"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: (index%2===0?40:-40), y: index*10, z: (index%3===0?40:-40) }
        });
    });
    baseGroup.add(coolingGroup);
    baseGroup.add(ringsGroup);

    // ==========================================
    // 4. QUANTUM PROJECTION CORE
    // ==========================================
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(4, 2);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    coreGroup.add(coreMesh);
    
    // Core detail spikes
    const spikeCount = coreGeo.attributes.position.count;
    for(let i=0; i<spikeCount; i+=3) {
        const v = new THREE.Vector3(
            coreGeo.attributes.position.getX(i),
            coreGeo.attributes.position.getY(i),
            coreGeo.attributes.position.getZ(i)
        );
        v.normalize();
        
        const spikeGeo = new THREE.CylinderGeometry(0, 0.2, 2, 8);
        const spikeMesh = new THREE.Mesh(spikeGeo, copper);
        spikeMesh.position.copy(v).multiplyScalar(4.5);
        spikeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
        coreGroup.add(spikeMesh);
    }
    
    parts.push({
        name: "Planck-Scale Projection Core",
        description: "The highly intricate chrome icosahedron at the exact center. It calculates volume eigenvalues and emits the holographic projection of the spin network.",
        material: "chrome/copper",
        function: "Primary computational hub for Loop Quantum Gravity simulations.",
        assemblyOrder: 7,
        connections: ["Confinement Rings", "Holographic Matrix"],
        failureEffect: "Complete failure of the visualization, defaulting to a classical vacuum state.",
        cascadeFailures: ["Holographic Matrix"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // ==========================================
    // 5. OPERATOR CABIN & CONTROL TERMINAL
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -6, 28);
    
    // Cabin Body
    const cabinGeo = new THREE.BoxGeometry(10, 8, 8);
    const cabinMesh = new THREE.Mesh(cabinGeo, aluminum);
    cabinGroup.add(cabinMesh);

    // Tinted Window
    const windowGeo = new THREE.BoxGeometry(9.6, 3.5, 0.4);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 1, 4);
    cabinGroup.add(windowMesh);
    
    // Control Panels inside (visible through window if zoomed)
    const panelGeo = new THREE.BoxGeometry(8, 2, 2);
    const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
    panelMesh.position.set(0, -2, 2.5);
    panelMesh.rotation.x = -Math.PI / 4;
    cabinGroup.add(panelMesh);
    
    // Glowing Screens on panel
    const screenGeo1 = new THREE.PlaneGeometry(3, 1.5);
    const screen1 = new THREE.Mesh(screenGeo1, glowingScreenMat);
    screen1.position.set(-2, -1.8, 3.2);
    screen1.rotation.x = -Math.PI / 4;
    cabinGroup.add(screen1);
    
    const screen2 = new THREE.Mesh(screenGeo1, glowingScreenMat);
    screen2.position.set(2, -1.8, 3.2);
    screen2.rotation.x = -Math.PI / 4;
    cabinGroup.add(screen2);

    // Access ladder
    const ladderGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const rungGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.rotation.z = Math.PI / 2;
        rung.position.set(0, -14 + i, 32.5);
        ladderGroup.add(rung);
    }
    const railGeo = new THREE.CylinderGeometry(0.15, 0.15, 15);
    const railL = new THREE.Mesh(railGeo, steel);
    railL.position.set(-1.5, -7, 32.5);
    const railR = new THREE.Mesh(railGeo, steel);
    railR.position.set(1.5, -7, 32.5);
    ladderGroup.add(railL);
    ladderGroup.add(railR);
    
    baseGroup.add(cabinGroup);
    baseGroup.add(ladderGroup);

    parts.push({
        name: "Observer Cabin & Diagnostics Terminal",
        description: "Heavily shielded aluminum operations cabin with lead-tinted glass to protect the researcher from extreme hawking radiation spikes.",
        material: "aluminum/tinted",
        function: "Allows safe human monitoring and control of the quantum geometry state.",
        assemblyOrder: 8,
        connections: ["Containment Foundation"],
        failureEffect: "Lethal radiation exposure to operators.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -6, z: 28 },
        explodedPosition: { x: 0, y: -6, z: 50 }
    });

    // ==========================================
    // 6. SPIN NETWORK HOLOGRAPHIC MATRIX
    // ==========================================
    const networkGroup = new THREE.Group();
    const numNodes = 150;
    const networkRadius = 12;
    const nodesData = [];
    
    // Generate random nodes within a spherical volume
    for (let i = 0; i < numNodes; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = networkRadius * Math.cbrt(Math.random()); 
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        // Dodecahedron for nodes (representing quantized volume)
        const nodeGeo = new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.4, 0);
        const mat = Math.random() > 0.5 ? hologramNodeMat1 : hologramNodeMat2;
        const nodeMesh = new THREE.Mesh(nodeGeo, mat);
        nodeMesh.position.set(x, y, z);
        
        // Add an inner glowing core to the node
        const innerGeo = new THREE.IcosahedronGeometry(0.2, 0);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5 });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        nodeMesh.add(innerMesh);

        networkGroup.add(nodeMesh);
        
        nodesData.push({
            position: new THREE.Vector3(x, y, z),
            mesh: nodeMesh,
            innerMesh: innerMesh,
            originalScale: nodeMesh.scale.x,
            phase: Math.random() * Math.PI * 2,
            frequency: 1 + Math.random() * 3
        });
        
        pulsingNodes.push(nodesData[i]);
    }

    // Connect nodes to form Spin Network edges (representing quantized area)
    const edgesData = [];
    const maxConnectionDistance = 4.5;
    
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const dist = nodesData[i].position.distanceTo(nodesData[j].position);
            
            if (dist < maxConnectionDistance) {
                // Determine the "spin" (j) on this link which dictates the area eigenvalue
                const spinValue = Math.random();
                let spinLabel, mat, thickness;
                
                if (spinValue < 0.4) { spinLabel = 'half'; thickness = 0.05; mat = hologramEdgeMats.half; }
                else if (spinValue < 0.7) { spinLabel = 'one'; thickness = 0.1; mat = hologramEdgeMats.one; }
                else if (spinValue < 0.9) { spinLabel = 'three_halves'; thickness = 0.15; mat = hologramEdgeMats.three_halves; }
                else { spinLabel = 'two'; thickness = 0.2; mat = hologramEdgeMats.two; }
                
                const edgeGeo = new THREE.CylinderGeometry(thickness, thickness, dist, 8);
                const edgeMesh = new THREE.Mesh(edgeGeo, mat);
                
                // Position and orient the edge
                const midPoint = new THREE.Vector3().addVectors(nodesData[i].position, nodesData[j].position).multiplyScalar(0.5);
                edgeMesh.position.copy(midPoint);
                edgeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(nodesData[j].position, nodesData[i].position).normalize());
                
                networkGroup.add(edgeMesh);
                
                edgesData.push({
                    mesh: edgeMesh,
                    nodeA: i,
                    nodeB: j,
                    spin: spinLabel,
                    originalOpacity: mat.opacity,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    // Create Spin Foam Faces (Triangles between 3 connected nodes representing history/evolution)
    let faceCount = 0;
    for (let i = 0; i < edgesData.length && faceCount < 60; i++) {
        const edge1 = edgesData[i];
        for (let j = i + 1; j < edgesData.length; j++) {
            const edge2 = edgesData[j];
            
            // Check if they share exactly one node
            let sharedNode = -1;
            let unshared1 = -1;
            let unshared2 = -1;
            
            if (edge1.nodeA === edge2.nodeA) { sharedNode = edge1.nodeA; unshared1 = edge1.nodeB; unshared2 = edge2.nodeB; }
            else if (edge1.nodeA === edge2.nodeB) { sharedNode = edge1.nodeA; unshared1 = edge1.nodeB; unshared2 = edge2.nodeA; }
            else if (edge1.nodeB === edge2.nodeA) { sharedNode = edge1.nodeB; unshared1 = edge1.nodeA; unshared2 = edge2.nodeB; }
            else if (edge1.nodeB === edge2.nodeB) { sharedNode = edge1.nodeB; unshared1 = edge1.nodeA; unshared2 = edge2.nodeA; }
            
            if (sharedNode !== -1) {
                // Check if unshared1 and unshared2 are connected
                const closingEdge = edgesData.find(e => 
                    (e.nodeA === unshared1 && e.nodeB === unshared2) || 
                    (e.nodeA === unshared2 && e.nodeB === unshared1)
                );
                
                if (closingEdge) {
                    // We found a triangle! Create a face.
                    const p1 = nodesData[sharedNode].position;
                    const p2 = nodesData[unshared1].position;
                    const p3 = nodesData[unshared2].position;
                    
                    const faceGeo = new THREE.BufferGeometry();
                    const vertices = new Float32Array([
                        p1.x, p1.y, p1.z,
                        p2.x, p2.y, p2.z,
                        p3.x, p3.y, p3.z
                    ]);
                    faceGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                    faceGeo.computeVertexNormals();
                    
                    const faceMesh = new THREE.Mesh(faceGeo, hologramFaceMat.clone()); // clone to animate opacity independently
                    networkGroup.add(faceMesh);
                    
                    spinFoamFaces.push({
                        mesh: faceMesh,
                        phase: Math.random() * Math.PI * 2
                    });
                    
                    faceCount++;
                }
            }
        }
    }

    parts.push({
        name: "Holographic Spin Network & Spin Foam",
        description: "The core manifestation of quantized spacetime. Nodes represent quanta of volume, edges carry SU(2) representations (spin) denoting area, and faces map the evolutionary history (spin foam).",
        material: "photonic",
        function: "Visually resolves the Holst action equations into a discrete 3D geometric graph.",
        assemblyOrder: 9,
        connections: ["Projection Core", "Magnetic Rings"],
        failureEffect: "Graph disconnection; simulated micro-black holes may form and evaporate instantly.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -40 }
    });

    // ==========================================
    // 7. EXHAUST & ENERGY DISPERSION STACKS
    // ==========================================
    const exhaustGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        
        // Stack base
        const stackBaseGeo = new THREE.CylinderGeometry(2, 2.5, 8, 16);
        const stackBase = new THREE.Mesh(stackBaseGeo, darkSteel);
        stackBase.position.set(Math.cos(angle)*18, -10, Math.sin(angle)*18);
        exhaustGroup.add(stackBase);
        
        // Stack vent array
        for(let j=0; j<5; j++) {
            const ventGeo = new THREE.TorusGeometry(2.2, 0.2, 8, 32);
            const vent = new THREE.Mesh(ventGeo, copper);
            vent.position.copy(stackBase.position);
            vent.position.y = -13 + j*1.5;
            vent.rotation.x = Math.PI / 2;
            exhaustGroup.add(vent);
        }
        
        // Plasma exhaust glow
        const glowGeo = new THREE.CylinderGeometry(1.8, 1.8, 10, 16);
        const glowMat = new THREE.MeshStandardMaterial({
            color: 0xff5500,
            emissive: 0xff2200,
            emissiveIntensity: 3.0,
            transparent: true,
            opacity: 0.7
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        glowMesh.position.copy(stackBase.position);
        glowMesh.position.y += 1;
        exhaustGroup.add(glowMesh);
        
        // Animate the plasma stack
        updatables.push((t, s) => {
            glowMesh.scale.y = 1 + Math.sin(t * 10 + i) * 0.1;
            glowMat.opacity = 0.5 + Math.sin(t * 15 + i) * 0.3;
        });
    }
    baseGroup.add(exhaustGroup);

    parts.push({
        name: "Hawking Radiation Dispersion Stacks",
        description: "Four massive cylindrical towers that vent virtual particles and thermal radiation generated by the computational core simulating Planck-scale geometry.",
        material: "darkSteel/copper",
        function: "Maintains entropy balance within the system.",
        assemblyOrder: 5,
        connections: ["Containment Foundation"],
        failureEffect: "Thermal explosion of virtual particles.",
        cascadeFailures: ["Cooling Manifold"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: -35 }
    });


    // Add everything to main group
    group.add(baseGroup);
    group.add(coreGroup);
    group.add(networkGroup);
    
    // Overall animation of the entire hologram matrix
    updatables.push((t, speed) => {
        networkGroup.rotation.y = t * 0.1 * speed;
        networkGroup.rotation.z = Math.sin(t * 0.05 * speed) * 0.1;
        coreGroup.rotation.x = t * 0.5 * speed;
        coreGroup.rotation.y = t * 0.7 * speed;
    });

    // ==========================================
    // EXPORTED ANIMATION FUNCTION
    // ==========================================
    function animate(time, speed, meshes) {
        // 1. Rotate Confinement Rings
        rotatingRings.forEach(r => {
            r.group.rotation[r.axis] += r.speed * speed * 0.05;
        });

        // 2. Pulse Spin Network Nodes (Volume Fluctuations)
        pulsingNodes.forEach(node => {
            const scalePulse = node.originalScale + Math.sin(time * node.frequency * speed + node.phase) * 0.15;
            node.mesh.scale.set(scalePulse, scalePulse, scalePulse);
            
            // Core intensity fluctuation
            node.innerMesh.material.emissiveIntensity = 2 + Math.abs(Math.sin(time * node.frequency * 2 * speed + node.phase)) * 4;
        });

        // 3. Evolve Edges (Area eigenvalues fluctuating / spin changing)
        // Simulate discrete jumps in area by rapidly changing opacity/emissive values
        edgesData.forEach(edge => {
            // Rapid quantum jitter
            const jitter = Math.sin(time * 20 * speed + edge.phase);
            if (jitter > 0.95) {
                edge.mesh.material.opacity = edge.originalOpacity * 0.2; // Dim out
            } else {
                edge.mesh.material.opacity = edge.originalOpacity + Math.sin(time * 2 * speed + edge.phase) * 0.2;
            }
        });

        // 4. Spin Foam Faces Opacity (History generating)
        spinFoamFaces.forEach(face => {
            // Faces fade in and out slowly to represent new geometric states solidifying
            face.mesh.material.opacity = 0.1 + (Math.sin(time * 3 * speed + face.phase) + 1) * 0.15;
        });
        
        // 5. Hydraulic Pistons moving up and down slowly to simulate massive weight shifts
        hydraulicPistons.forEach(p => {
            p.mesh.position.y = p.baseY + Math.sin(time * speed + p.phase) * 0.3;
        });

        // 6. Generic updatables
        updatables.forEach(fn => fn(time, speed));
    }

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Spin Network Visualizer, what physical quantity does the 'spin' (represented by edge color and thickness) on each graph link correspond to in Loop Quantum Gravity?",
            options: [
                "The invariant mass of the node.",
                "The quantized area of the surface intersected by the link.",
                "The chronological time passed since the Big Bang.",
                "The probability amplitude of a graviton emission."
            ],
            correctAnswer: 1,
            explanation: "In Loop Quantum Gravity, the links of a spin network are labeled by spins (j = 1/2, 1, 3/2, etc.). The area operator is quantized, and its eigenvalues are proportional to sqrt(j(j+1)). Thus, edges represent discrete quanta of area."
        },
        {
            question: "If a node in the holographic matrix pulses and splits into two connected nodes, what does this represent in the simulated physics?",
            options: [
                "A localized violation of the Pauli Exclusion Principle.",
                "The emission of Hawking Radiation from a microscopic black hole.",
                "An evolution in the spin foam, representing a transition in the quantum state of 3D volume.",
                "A gauge symmetry breaking leading to cosmic inflation."
            ],
            correctAnswer: 2,
            explanation: "In spin foam models, which provide a path-integral formulation of LQG, the vertices of the spin foam (where nodes split or merge) represent transitions between different quantum geometries (spin networks) over time."
        },
        {
            question: "The device features a 'Planck-Scale Projection Core'. Which constant is fundamental to establishing the minimal measurable length in the geometry projected by this core?",
            options: [
                "The Fine-Structure Constant.",
                "The Immirzi Parameter (or Barbero-Immirzi parameter).",
                "The Cosmological Constant.",
                "The Rydberg Constant."
            ],
            correctAnswer: 1,
            explanation: "The Barbero-Immirzi parameter appears in the spectra of the area and volume operators in Loop Quantum Gravity. It sets the scale of the quantum effects and is intrinsically tied to the exact value of the minimum physical area quantum."
        },
        {
            question: "Why must the simulated Spin Network graph maintain SU(2) gauge invariance at its nodes?",
            options: [
                "Because spacetime at the Planck scale behaves identically to a strong-force gluon plasma.",
                "To satisfy the Gauss constraint, meaning the total 'flux' of the gravitational field entering a node must equal zero (geometric closure).",
                "To prevent the superfluid helium in the cooling manifold from boiling.",
                "To ensure the holographic projection remains within the visible light spectrum."
            ],
            correctAnswer: 1,
            explanation: "The Gauss constraint in LQG requires gauge invariance under SU(2) rotations. Geometrically, this translates to the requirement that the quantum 'polyhedron' surrounding a node must be closed; the sum of the outgoing area vectors (fluxes) must be zero."
        },
        {
            question: "If the magnetic confinement rings fail, the manual states 'simulated micro-black holes may form'. In LQG, how is the entropy of such a black hole calculated from the Spin Network?",
            options: [
                "By integrating the Hawking temperature over the lifespan of the machine.",
                "By counting the number of nodes inside the black hole horizon.",
                "By counting the number of microstates (spin configurations) of the spin network links that puncture the isolated horizon.",
                "By measuring the RPM of the confinement rings."
            ],
            correctAnswer: 2,
            explanation: "In Loop Quantum Gravity, the entropy of a black hole is derived by counting the degenerate quantum states of the spin network links that pierce the boundary of the black hole, known as an isolated horizon. This gives a microscopic derivation of the Bekenstein-Hawking entropy formula."
        }
    ];

    const description = "The Ultra God Tier Spin Network Visualizer is a colossal, highly complex experimental machine designed to directly map and simulate the quantum states of spacetime geometry. By utilizing a heavy-duty cryogenic base, rotating magnetic confinement rings, and a central computational core, it projects a real-time, holographic Spin Network. The nodes in the hologram represent quanta of volume, while the connecting tubes represent quantized area governed by SU(2) spin representations. As the machine runs, the matrix evolves into a 4D Spin Foam, visually representing the chaotic, quantum fluctuations of space itself at the Planck scale. Extreme caution is advised when operating near the hawking radiation dispersion stacks.";

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
