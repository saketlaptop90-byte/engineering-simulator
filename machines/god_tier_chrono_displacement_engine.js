import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM HIGH-TECH MATERIALS ---
    const quantumCoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.05,
        ior: 2.5,
        thickness: 2.0,
        specularIntensity: 1.0,
        specularColor: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide
    });

    const tachyonEmitterMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 4.0,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true
    });

    const chronotonFluxMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 3.5,
        metalness: 0.9,
        roughness: 0.1
    });

    const hyperSteelMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.95,
        roughness: 0.4,
        envMapIntensity: 1.5
    });

    const superConductorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.3,
        emissive: 0x331100,
        emissiveIntensity: 0.5
    });

    const cryoPipeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const warningStripeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        metalness: 0.1,
        roughness: 0.8
    });

    // --- PARTICLE SYSTEM UTILS ---
    const particleCount = 10000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const radius = 5 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);

        particleVelocities[i * 3] = (Math.random() - 0.5) * 0.5;
        particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

        particlePhases[i] = Math.random() * Math.PI * 2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));
    particleGeometry.setAttribute('phase', new THREE.BufferAttribute(particlePhases, 1));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const tachyonParticles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(tachyonParticles);

    // --- SHADER CORE MATERIAL ---
    const coreShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            resolution: { value: new THREE.Vector2(1024, 1024) },
            baseColor: { value: new THREE.Color(0x0055ff) },
            glowColor: { value: new THREE.Color(0xff00ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float time;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vec3 p = position;
                // Add extreme high-frequency displacement for the quantum core
                float displacement = sin(p.x * 10.0 + time * 5.0) * cos(p.y * 10.0 + time * 5.0) * sin(p.z * 10.0 + time * 5.0) * 0.2;
                p += normal * displacement;
                vPosition = (modelViewMatrix * vec4(p, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 baseColor;
            uniform vec3 glowColor;
            uniform float time;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
                intensity = pow(1.0 - abs(intensity), 2.0);
                
                vec3 viewDir = normalize(-vPosition);
                float rimLight = 1.0 - max(dot(viewDir, vNormal), 0.0);
                rimLight = smoothstep(0.6, 1.0, rimLight);
                
                float pulse = sin(time * 10.0) * 0.5 + 0.5;
                vec3 finalColor = mix(baseColor, glowColor, rimLight + pulse * 0.5);
                
                gl_FragColor = vec4(finalColor * intensity * 2.0, 0.9);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // --- MESH GENERATION FUNCTIONS ---

    const dynamicMeshes = [];

    // 1. BASE PLATFORM
    function createBasePlatform() {
        const baseGroup = new THREE.Group();
        
        // Main hexagonal pad
        const shape = new THREE.Shape();
        const hexRadius = 40;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            if (i === 0) shape.moveTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
            else shape.lineTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
        }
        shape.closePath();

        const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 5, steps: 2, bevelSize: 1, bevelThickness: 1 };
        const baseGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.rotation.x = Math.PI / 2;
        baseMesh.position.y = -20;
        baseGroup.add(baseMesh);

        // Sub-grids and warning tracks
        const gridGeo = new THREE.RingGeometry(10, 35, 64, 8);
        const gridMesh = new THREE.Mesh(gridGeo, hyperSteelMaterial);
        gridMesh.rotation.x = -Math.PI / 2;
        gridMesh.position.y = -14.9;
        baseGroup.add(gridMesh);

        // Add 12 Massive Anchors
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const anchorGeo = new THREE.BoxGeometry(4, 10, 8);
            const anchorMesh = new THREE.Mesh(anchorGeo, steel);
            anchorMesh.position.set(Math.cos(angle) * 38, -15, Math.sin(angle) * 38);
            anchorMesh.lookAt(0, -15, 0);
            baseGroup.add(anchorMesh);
        }

        return baseGroup;
    }

    // 2. CRYOGENIC SUB-COOLER ARRAYS
    function createCryoArray(x, z, rotationY) {
        const arrayGroup = new THREE.Group();
        
        // Main Tank
        const tankGeo = new THREE.CylinderGeometry(4, 4, 25, 32);
        const tankMesh = new THREE.Mesh(tankGeo, cryoPipeMaterial);
        arrayGroup.add(tankMesh);

        // Cooling Fins
        for (let i = 0; i < 20; i++) {
            const finGeo = new THREE.TorusGeometry(4.2, 0.2, 8, 64);
            const finMesh = new THREE.Mesh(finGeo, aluminum);
            finMesh.rotation.x = Math.PI / 2;
            finMesh.position.y = -10 + i * 1.05;
            arrayGroup.add(finMesh);
        }

        // Pressure valves
        const valveGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
        const valveMesh = new THREE.Mesh(valveGeo, copper);
        valveMesh.position.y = 13.5;
        arrayGroup.add(valveMesh);

        // Internal Frost Core (glowing)
        const frostGeo = new THREE.CylinderGeometry(3.8, 3.8, 24.8, 32);
        const frostMat = new THREE.MeshStandardMaterial({ color: 0xccffff, emissive: 0x00ffff, emissiveIntensity: 1.5, transparent: true, opacity: 0.6 });
        const frostMesh = new THREE.Mesh(frostGeo, frostMat);
        arrayGroup.add(frostMesh);

        arrayGroup.position.set(x, -5, z);
        arrayGroup.rotation.y = rotationY;
        
        return arrayGroup;
    }

    // 3. SUPERCAPACITOR BANKS
    function createSuperCapacitorBank(radius, count, yOffset) {
        const bankGroup = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const capGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 16);
            const capMesh = new THREE.Mesh(capGeo, superConductorMaterial);
            
            const px = Math.cos(angle) * radius;
            const pz = Math.sin(angle) * radius;
            capMesh.position.set(px, yOffset, pz);
            
            // Wiring
            const wireGeo = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 4, 0), new THREE.Vector3(0, 10, 0)), 8, 0.2, 8, false);
            const wireMesh = new THREE.Mesh(wireGeo, copper);
            capMesh.add(wireMesh);

            bankGroup.add(capMesh);
        }
        return bankGroup;
    }

    // 4. MULTI-AXIS GYROSCOPIC RINGS
    function createGyroRing(radius, thickness, axis, material, detailLevel) {
        const ringGroup = new THREE.Group();
        
        // Main Ring Structure
        const ringGeo = new THREE.TorusGeometry(radius, thickness, 64, 128);
        const ringMesh = new THREE.Mesh(ringGeo, material);
        ringGroup.add(ringMesh);

        // Add magnetic containment coils
        for (let i = 0; i < detailLevel; i++) {
            const angle = (i / detailLevel) * Math.PI * 2;
            const coilGeo = new THREE.CylinderGeometry(thickness * 1.5, thickness * 1.5, thickness * 2.5, 32);
            const coilMesh = new THREE.Mesh(coilGeo, superConductorMaterial);
            
            coilMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            coilMesh.lookAt(0, 0, 0);
            coilMesh.rotation.x = Math.PI / 2; // align to torus tube
            
            // Add tiny emitters on the coils
            const emitterGeo = new THREE.BoxGeometry(thickness * 0.5, thickness * 3, thickness * 0.5);
            const emitterMesh = new THREE.Mesh(emitterGeo, tachyonEmitterMaterial);
            coilMesh.add(emitterMesh);

            ringGroup.add(coilMesh);
        }

        // Inner glowing track
        const trackGeo = new THREE.TorusGeometry(radius - thickness * 0.8, thickness * 0.2, 32, 128);
        const trackMesh = new THREE.Mesh(trackGeo, chronotonFluxMaterial);
        ringGroup.add(trackMesh);

        if (axis === 'x') {
            ringGroup.rotation.y = Math.PI / 2;
        } else if (axis === 'y') {
            ringGroup.rotation.x = Math.PI / 2;
        }

        return { mesh: ringGroup, axis: axis };
    }

    // 5. HYDRAULIC & CRYOGENIC PIPING COMPLEX NETWORK
    function createPipeNetwork() {
        const pipeGroup = new THREE.Group();

        class CustomPath extends THREE.Curve {
            constructor(scale, seed) {
                super();
                this.scale = scale;
                this.seed = seed;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.sin(t * Math.PI * 4 + this.seed) * 20;
                const ty = (t - 0.5) * 40;
                const tz = Math.cos(t * Math.PI * 4 + this.seed) * 20;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }

        for (let i = 0; i < 24; i++) {
            const path = new CustomPath(1, i);
            const tubeGeo = new THREE.TubeGeometry(path, 64, 0.5, 8, false);
            const tubeMesh = new THREE.Mesh(tubeGeo, cryoPipeMaterial);
            pipeGroup.add(tubeMesh);
        }

        return pipeGroup;
    }

    // 6. CENTRAL DISTORTION CORE
    function createCentralCore() {
        const coreGroup = new THREE.Group();

        // Inner Quantum Singularity (Custom Shader)
        const singularityGeo = new THREE.SphereGeometry(6, 128, 128);
        const singularityMesh = new THREE.Mesh(singularityGeo, coreShaderMaterial);
        coreGroup.add(singularityMesh);
        dynamicMeshes.push({ mesh: singularityMesh, type: 'core' });

        // Glass containment shell
        const shellGeo = new THREE.IcosahedronGeometry(8, 4);
        const shellMesh = new THREE.Mesh(shellGeo, quantumCoreMaterial);
        coreGroup.add(shellMesh);

        // Structural binding rings
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(8.5, 0.5, 16, 64);
            const ringMesh = new THREE.Mesh(ringGeo, hyperSteelMaterial);
            if (i === 0) ringMesh.rotation.x = Math.PI / 2;
            if (i === 1) ringMesh.rotation.y = Math.PI / 2;
            if (i === 2) ringMesh.rotation.x = Math.PI / 4;
            coreGroup.add(ringMesh);
            dynamicMeshes.push({ mesh: ringMesh, type: 'coreRing', speed: (i + 1) * 0.5 });
        }

        // Injector nodes
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const injectorGeo = new THREE.CylinderGeometry(0.5, 1.5, 4, 16);
            const injectorMesh = new THREE.Mesh(injectorGeo, chrome);
            injectorMesh.position.set(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
            injectorMesh.lookAt(0,0,0);
            injectorMesh.rotation.x -= Math.PI / 2;
            coreGroup.add(injectorMesh);
        }

        return coreGroup;
    }

    // 7. RELATIVISTIC SHIELDING MATRIX
    function createShielding() {
        const shieldGroup = new THREE.Group();
        const shieldGeo = new THREE.SphereGeometry(30, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const shieldMesh = new THREE.Mesh(shieldGeo, new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.9,
            roughness: 0.5,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        }));
        shieldGroup.add(shieldMesh);
        
        // Add solid panels to the wireframe
        const panelGeo = new THREE.SphereGeometry(29.8, 16, 16, 0, Math.PI * 2, Math.PI/4, Math.PI/4);
        const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
        shieldGroup.add(panelMesh);

        return shieldGroup;
    }

    // --- ASSEMBLE THE MACHINE ---

    const basePlatform = createBasePlatform();
    group.add(basePlatform);

    // Add Cryo Arrays
    const cryo1 = createCryoArray(25, 0, 0);
    const cryo2 = createCryoArray(-25, 0, Math.PI);
    const cryo3 = createCryoArray(0, 25, Math.PI/2);
    const cryo4 = createCryoArray(0, -25, -Math.PI/2);
    group.add(cryo1, cryo2, cryo3, cryo4);

    // Add Capacitor Banks
    const bank1 = createSuperCapacitorBank(15, 12, -10);
    const bank2 = createSuperCapacitorBank(20, 24, -10);
    group.add(bank1, bank2);

    // Add Central Core
    const centralCore = createCentralCore();
    group.add(centralCore);

    // Add Gyro Rings
    const gyroZ = createGyroRing(12, 1.5, 'z', steel, 16);
    const gyroX = createGyroRing(18, 2.0, 'x', chrome, 24);
    const gyroY = createGyroRing(24, 2.5, 'y', darkSteel, 32);
    
    group.add(gyroZ.mesh, gyroX.mesh, gyroY.mesh);
    dynamicMeshes.push(
        { mesh: gyroZ.mesh, type: 'gyro', axis: 'z', speed: 2.0 },
        { mesh: gyroX.mesh, type: 'gyro', axis: 'x', speed: -1.5 },
        { mesh: gyroY.mesh, type: 'gyro', axis: 'y', speed: 1.0 }
    );

    // Add Shielding
    const shielding = createShielding();
    group.add(shielding);
    dynamicMeshes.push({ mesh: shielding, type: 'shield', speed: 0.1 });

    // Add Pipe Network
    const pipes = createPipeNetwork();
    group.add(pipes);

    // --- PARTS REGISTRY ---

    parts.push({
        name: "Hexagonal Containment Base",
        description: "Massive dark steel platform heavily reinforced to withstand temporal shear forces and localized gravity inversions.",
        material: "Dark Steel / Hyper-Steel",
        function: "Provides structural integrity and anchors the entire displacement engine to the spacetime manifold.",
        assemblyOrder: 1,
        connections: ["Cryogenic Sub-Cooler Array", "Temporal Anchor Struts"],
        failureEffect: "Catastrophic structural failure leading to immediate micro-black hole formation and local timeline collapse.",
        cascadeFailures: ["Everything"],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    parts.push({
        name: "Cryogenic Sub-Cooler Array Alpha",
        description: "High-capacity liquid helium and liquid nitrogen pumping station with integrated fractal cooling fins.",
        material: "Aluminum / Cryo-Pipe",
        function: "Maintains absolute zero temperatures across the super-conducting magnetic coils to prevent quantum decoherence.",
        assemblyOrder: 2,
        connections: ["Hexagonal Containment Base", "Supercapacitor Banks"],
        failureEffect: "Thermal runaway causing super-conductors to quench, resulting in explosive release of stored magnetic energy.",
        cascadeFailures: ["Supercapacitor Banks", "Axis-Z Tertiary Gyro-Stabilizer"],
        originalPosition: {x: 25, y: -5, z: 0},
        explodedPosition: {x: 80, y: -5, z: 0}
    });

    parts.push({
        name: "Supercapacitor Bank Alpha",
        description: "Dense array of zero-point energy accumulators encased in heavy copper wiring and super-conductive sheathing.",
        material: "Super-Conductor / Copper",
        function: "Provides the immense burst of localized energy required to punch through the Planck length and open a traversable wormhole.",
        assemblyOrder: 3,
        connections: ["Cryogenic Sub-Cooler Array", "Main Power Coupling"],
        failureEffect: "Energy starvation mid-displacement, trapping the payload in the quantum bulk.",
        cascadeFailures: ["Central Chronoton Distortion Core"],
        originalPosition: {x: 0, y: -10, z: 0},
        explodedPosition: {x: 0, y: -40, z: 40}
    });

    parts.push({
        name: "Axis-Y Primary Gyro-Stabilizer",
        description: "Outermost counter-rotating relativistic ring. Massive dark steel torus embedded with 32 superconducting magnetic containment coils.",
        material: "Dark Steel / Super-Conductor",
        function: "Generates the primary frame-dragging effect to warp the local metric tensor.",
        assemblyOrder: 4,
        connections: ["Axis-X Secondary Gyro-Stabilizer", "Relativistic Shielding Matrix"],
        failureEffect: "Loss of spatial orientation during temporal transit, resulting in displacement to random cosmic coordinates.",
        cascadeFailures: ["Axis-X Secondary Gyro-Stabilizer", "Central Chronoton Distortion Core"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 80, z: 0}
    });

    parts.push({
        name: "Axis-X Secondary Gyro-Stabilizer",
        description: "Middle counter-rotating relativistic ring. Chrome torus equipped with 24 high-intensity tachyon emitters.",
        material: "Chrome / Tachyon Emitter",
        function: "Induces an artificial closed timelike curve by projecting tachyonic fields ahead of the displacement vector.",
        assemblyOrder: 5,
        connections: ["Axis-Y Primary Gyro-Stabilizer", "Axis-Z Tertiary Gyro-Stabilizer"],
        failureEffect: "Tachyon field collapse leading to immediate causality paradox and localized timeline erasure.",
        cascadeFailures: ["Central Chronoton Distortion Core"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -80, y: 0, z: 0}
    });

    parts.push({
        name: "Axis-Z Tertiary Gyro-Stabilizer",
        description: "Innermost counter-rotating relativistic ring. Steel torus focusing extreme magnetic fields directly onto the core.",
        material: "Steel / Chronoton Flux",
        function: "Fine-tunes the Alcubierre warp metric to ensure safe passage of baryonic matter.",
        assemblyOrder: 6,
        connections: ["Axis-X Secondary Gyro-Stabilizer", "Central Chronoton Distortion Core"],
        failureEffect: "Spaghettification of all matter within the distortion bubble.",
        cascadeFailures: ["Central Chronoton Distortion Core"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 80}
    });

    parts.push({
        name: "Central Chronoton Distortion Core",
        description: "The heart of the machine. A contained micro-singularity enveloped in a fluctuating quantum field, utilizing custom light-warping shaders.",
        material: "Quantum Core Material / Glass",
        function: "Acts as the anchor point bridging the current spacetime coordinates with the target destination.",
        assemblyOrder: 7,
        connections: ["Axis-Z Tertiary Gyro-Stabilizer", "Hydraulic & Cryogenic Piping"],
        failureEffect: "Uncontained singularity expansion, consuming the local solar system.",
        cascadeFailures: ["Entire Engine"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0} // Core shouldn't really move in explosion, it's the anchor
    });

    parts.push({
        name: "Relativistic Shielding Matrix",
        description: "A partially opaque wireframe and solid dark steel dome encompassing the upper half of the machine.",
        material: "Dark Steel / Transparent Shielding",
        function: "Protects external observers from deadly Hawking radiation and chronological bleed-over.",
        assemblyOrder: 8,
        connections: ["Hexagonal Containment Base", "Axis-Y Primary Gyro-Stabilizer"],
        failureEffect: "Severe radiation poisoning and rapid aging of surrounding biological entities.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 100, z: 0}
    });

    parts.push({
        name: "Quantum Entanglement Manifold",
        description: "Complex network of 24 intertwining cryogenic and hydraulic tubes weaving through the engine's structure.",
        material: "Cryo-Pipe",
        function: "Distributes sub-zero coolants and synchronizes quantum states across all supercapacitors.",
        assemblyOrder: 9,
        connections: ["Cryogenic Sub-Cooler Array", "Central Chronoton Distortion Core"],
        failureEffect: "Localized hot-spots causing micro-fractures in the space-time bubble.",
        cascadeFailures: ["Axis-Z Tertiary Gyro-Stabilizer"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: -80}
    });

    parts.push({
        name: "Temporal Anchor Strut A",
        description: "One of 12 massive steel pilings bolted directly into the planetary crust.",
        material: "Steel",
        function: "Prevents the engine from shearing away from the Earth's rotational frame of reference during activation.",
        assemblyOrder: 10,
        connections: ["Hexagonal Containment Base"],
        failureEffect: "Engine violently detaches and achieves high orbit instantaneously.",
        cascadeFailures: ["Hexagonal Containment Base"],
        originalPosition: {x: 38, y: -15, z: 0},
        explodedPosition: {x: 100, y: -30, z: 0}
    });
    
    parts.push({
        name: "Tachyon Particle Emitter Array",
        description: "A dispersed cloud of 10,000 highly energized tachyon particles continuously orbiting the core.",
        material: "Cyan Energy",
        function: "Clears exotic matter blockages in the target time-stream to ensure a smooth arrival.",
        assemblyOrder: 11,
        connections: ["Central Chronoton Distortion Core"],
        failureEffect: "Arrival in an alternate timeline or immediate entombment in solid rock.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    parts.push({
        name: "Chronoton Flux Inner Track",
        description: "Glowing green torus tracks lining the inner edge of each gyroscopic ring.",
        material: "Chronoton Flux",
        function: "Channels exotic matter directly into the singularity's event horizon to modulate its spin.",
        assemblyOrder: 12,
        connections: ["Axis-Z Tertiary Gyro-Stabilizer"],
        failureEffect: "Singularity spin exceeds Kerr limits, resulting in a naked singularity.",
        cascadeFailures: ["Central Chronoton Distortion Core"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -60, z: -60}
    });

    parts.push({
        name: "Zero-Point Injector Nodes",
        description: "8 Chrome cylinders protruding radially from the central glass containment shell.",
        material: "Chrome",
        function: "Fires precisely timed pulses of zero-point energy to agitate the singularity.",
        assemblyOrder: 13,
        connections: ["Central Chronoton Distortion Core"],
        failureEffect: "Asymmetric agitation leading to spatial wobbling and severe localized earthquakes.",
        cascadeFailures: ["Temporal Anchor Strut A"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 50}
    });

    parts.push({
        name: "Main Power Coupling",
        description: "Thick bundles of superconducting wire connecting the capacitor banks to the gyro rings.",
        material: "Copper",
        function: "Transmits petawatts of power seamlessly with zero resistance.",
        assemblyOrder: 14,
        connections: ["Supercapacitor Bank Alpha", "Axis-Y Primary Gyro-Stabilizer"],
        failureEffect: "Vaporization of the coupling, instantly shutting down all temporal distortion fields.",
        cascadeFailures: ["Everything"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 60, y: 20, z: 60}
    });

    parts.push({
        name: "Telemetry & Control Interface",
        description: "Sub-harmonic frequency modulator attached to the outer casing.",
        material: "Hyper-Steel",
        function: "Allows operators to input destination spacetime coordinates.",
        assemblyOrder: 15,
        connections: ["Relativistic Shielding Matrix"],
        failureEffect: "Total loss of navigation. Destination becomes completely random.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 30},
        explodedPosition: {x: 0, y: 10, z: 120}
    });

    const description = "The God-Tier Chrono-Displacement Engine. A horrifyingly complex, multi-axis relativistic temporal distortion device capable of tearing open traversable wormholes through the quantum bulk. Features extreme tachyon particle emissions, intense magnetic containment, and a central singularity core modulated by custom shaders. Warning: Operation may violate causality and local energy conditions.";

    const quizQuestions = [
        {
            question: "Regarding the Alcubierre drive metric, how does the manipulation of spacetime energy density relate to the Weak Energy Condition (WEC) in the context of creating a localized closed timelike curve (CTC) within this engine?",
            options: [
                "It strictly adheres to the WEC by utilizing high-density baryonic matter to compress spacetime ahead of the distortion bubble.",
                "It requires a violation of the WEC via the injection of exotic matter with negative energy density to expand spacetime behind the ship and compress it ahead, enabling CTC formation.",
                "The WEC is rendered irrelevant because the tachyon emitters operate entirely within the imaginary mass domain, bypassing local spacetime metrics.",
                "It uses quantum entanglement to teleport energy states across the boundary, artificially satisfying the WEC while still bending spacetime."
            ],
            correctAnswer: 1,
            explanation: "The Alcubierre metric inherently requires regions of negative energy density to function, which explicitly violates the Weak Energy Condition (WEC). Exotic matter is necessary to create the specific spacetime warping (expansion behind, contraction ahead) that allows for apparent faster-than-light travel and potential CTC formation."
        },
        {
            question: "In the context of quantum field theory in curved spacetime, what is the exact mechanism by which the Hawking-Unruh effect would manifest along the event horizon of the micro-singularity generated within the distortion core?",
            options: [
                "The extreme acceleration of the gyroscopic rings creates a thermal bath of particles for an accelerated observer, mimicking Hawking radiation from a black hole horizon due to equivalence principle.",
                "The tachyon emissions collide with virtual particle pairs, permanently annihilating them before they can cross the horizon.",
                "The supercapacitors absorb the Hawking radiation directly, converting it into zero-point energy to fuel the core.",
                "The cryogenic cooling array suppresses all quantum fluctuations, preventing the Unruh effect from manifesting entirely."
            ],
            correctAnswer: 0,
            explanation: "The Unruh effect predicts that an accelerating observer will observe a thermal bath of particles (blackbody radiation) in an otherwise empty vacuum. Near the extreme gravitational gradients (or equivalent massive acceleration fields generated by the rings) of a micro-singularity, this is deeply analogous to Hawking radiation at a black hole's event horizon."
        },
        {
            question: "Consider the Novikov self-consistency principle applied to a macroscopic system traversing a traversable wormhole (Einstein-Rosen bridge). How do the quantum probability amplitudes for path integrals prevent paradoxical macroscopic decoherence?",
            options: [
                "The probabilities of paradoxical paths are exponentially enhanced, forcing the universe to split into multiple non-interacting branches.",
                "The path integrals for histories that result in a paradox destructively interfere, resulting in a probability amplitude of precisely zero for any self-contradictory timeline.",
                "The chronoton flux actively rewrites the observer's memory to ensure perceived consistency, regardless of the actual path taken.",
                "The principle fails at macroscopic scales; only subatomic particles can avoid paradoxical decoherence through quantum tunneling."
            ],
            correctAnswer: 1,
            explanation: "According to the Novikov self-consistency principle, formulated mathematically using path integrals, the probability of an event that would cause a paradox (changing the past in a contradictory way) is zero. The quantum amplitudes for such inconsistent histories destructively interfere and cancel out completely."
        },
        {
            question: "How does the integration of a non-abelian gauge field within the tachyon emission manifold stabilize the imaginary mass component of the tachyonic field equation?",
            options: [
                "By freezing the tachyons to absolute zero using the cryogenic arrays, forcing their mass to become real and positive.",
                "By inducing spontaneous symmetry breaking via the Higgs mechanism, which imparts a complex mass phase that counteracts the tachyonic instability (tachyon condensation).",
                "By spinning the tachyon emitters at relativistic speeds, causing time dilation to halt their reverse-temporal progression.",
                "By bombarding the field with continuous zero-point energy pulses, physically preventing the tachyons from decaying."
            ],
            correctAnswer: 1,
            explanation: "In quantum field theory, a tachyon field (with imaginary mass) represents an instability at the local maximum of a potential. Through spontaneous symmetry breaking (tachyon condensation), the field rolls down to a stable minimum where the excitations (particles) acquire real mass, similar to how the Higgs mechanism operates with non-abelian gauge fields."
        },
        {
            question: "During relativistic gyroscopic precession, how does frame-dragging (Lense-Thirring effect) induced by the ultra-dense counter-rotating rings influence the local metric tensor near the core, specifically concerning the Kerr parameter?",
            options: [
                "It causes spacetime to co-rotate with the rings, increasing the effective Kerr parameter (a) of the central singularity, potentially pushing it towards an extremal state.",
                "It perfectly cancels out the Earth's natural gravity, reducing the Kerr parameter to zero and creating a perfectly static Schwarzschild metric.",
                "It repels all incoming matter by reversing the sign of the local gravitational constant G.",
                "It causes the spatial dimensions to spontaneously compactify into Calabi-Yau manifolds, rendering the Kerr parameter undefined."
            ],
            correctAnswer: 0,
            explanation: "Frame-dragging (the Lense-Thirring effect) caused by massive rotating bodies (like the gyroscopic rings) actually 'drags' the fabric of spacetime along with the rotation. If centered around a singularity, this angular momentum contributes to the singularity's spin (Kerr parameter 'a'), potentially spinning it up to an extremal limit where the horizon could disappear (naked singularity)."
        }
    ];

    function animate(time, speed, meshes) {
        // time is in seconds
        // speed is a multiplier

        // 1. Animate Gyroscopic Rings
        dynamicMeshes.forEach(item => {
            if (item.type === 'gyro') {
                // Relativistic spinning. As they are nested, they spin on their respective axes.
                const spinRate = item.speed * speed * 2.0; 
                if (item.axis === 'x') {
                    item.mesh.rotation.x += spinRate * 0.05;
                } else if (item.axis === 'y') {
                    item.mesh.rotation.y += spinRate * 0.05;
                } else if (item.axis === 'z') {
                    item.mesh.rotation.z += spinRate * 0.05;
                }
            } else if (item.type === 'coreRing') {
                item.mesh.rotation.x += item.speed * speed * 0.1;
                item.mesh.rotation.y += item.speed * speed * 0.13;
            } else if (item.type === 'shield') {
                item.mesh.rotation.y += item.speed * speed * 0.02;
            }
        });

        // 2. Animate Core Shader
        coreShaderMaterial.uniforms.time.value = time * speed;
        // Make the core pulse wildly based on speed
        const pulse = Math.sin(time * speed * 10) * 0.5 + 1.0;
        coreShaderMaterial.uniforms.baseColor.value.setHex(0x0055ff).multiplyScalar(pulse);

        // 3. Animate Tachyon Particles
        const positions = particleGeometry.attributes.position.array;
        const velocities = particleGeometry.attributes.velocity.array;
        const phases = particleGeometry.attributes.phase.array;

        // Swirling vortex logic for particles
        for (let i = 0; i < particleCount; i++) {
            let px = positions[i * 3];
            let py = positions[i * 3 + 1];
            let pz = positions[i * 3 + 2];
            
            let vx = velocities[i * 3];
            let vy = velocities[i * 3 + 1];
            let vz = velocities[i * 3 + 2];

            // Vortex attraction towards center
            const dist = Math.sqrt(px * px + py * py + pz * pz);
            const force = 50.0 / (dist * dist + 1.0);
            
            // Tangential velocity for swirling
            const targetVx = -pz * force;
            const targetVy = (Math.sin(phases[i] + time * speed * 5) * 5.0) - py * 0.1; // Bobbing up and down + slight gravity
            const targetVz = px * force;

            // Interpolate velocity
            vx += (targetVx - vx) * 0.05 * speed;
            vy += (targetVy - vy) * 0.05 * speed;
            vz += (targetVz - vz) * 0.05 * speed;

            // Update positions
            px += vx * 0.1 * speed;
            py += vy * 0.1 * speed;
            pz += vz * 0.1 * speed;

            // Containment field logic: If particles go too far, reset them near the core
            if (dist > 40) {
                px = (Math.random() - 0.5) * 10;
                py = (Math.random() - 0.5) * 10;
                pz = (Math.random() - 0.5) * 10;
            }

            positions[i * 3] = px;
            positions[i * 3 + 1] = py;
            positions[i * 3 + 2] = pz;
            
            velocities[i * 3] = vx;
            velocities[i * 3 + 1] = vy;
            velocities[i * 3 + 2] = vz;
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}
