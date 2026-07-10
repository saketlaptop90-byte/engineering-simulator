import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM MATERIALS & SHADERS ---

    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.8 });
    const emissivePurple = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x8800ff, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.9 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.9 });
    const emissiveWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0 });
    const emissiveGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 1.0 });
    
    const bubbleVertexShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            vUv = uv;
            vec3 newPos = position;
            // Relativistic wave distortion
            float wave = sin(time * 3.0 + position.y * 8.0 + position.x * 5.0) * 0.05;
            newPos += normal * wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
    `;

    const bubbleFragmentShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        void main() {
            vec3 viewDir = normalize(-vPosition);
            float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
            rim = smoothstep(0.5, 1.0, rim);
            
            // Complex swirling pattern
            float swirl = sin(vUv.x * 20.0 + time * 5.0) * cos(vUv.y * 20.0 - time * 3.0);
            vec3 baseColor = mix(vec3(0.1, 0.5, 1.0), vec3(0.8, 0.0, 1.0), swirl * 0.5 + 0.5);
            
            float alpha = rim * 0.7 + (swirl * 0.1);
            gl_FragColor = vec4(baseColor, alpha);
        }
    `;

    const temporalBubbleMaterial = new THREE.ShaderMaterial({
        vertexShader: bubbleVertexShader,
        fragmentShader: bubbleFragmentShader,
        uniforms: {
            time: { value: 0.0 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const singularityVertexShader = `
        varying vec2 vUv;
        uniform float time;
        void main() {
            vUv = uv;
            vec3 pos = position;
            float pulse = sin(time * 10.0) * 0.1;
            pos *= 1.0 + pulse;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;
    
    const singularityFragmentShader = `
        varying vec2 vUv;
        uniform float time;
        void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            float core = smoothstep(0.1, 0.0, dist);
            float halo = smoothstep(0.5, 0.1, dist);
            vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 0.0), dist * 2.0);
            gl_FragColor = vec4(color, core + halo * 0.5);
        }
    `;

    const singularityMaterial = new THREE.ShaderMaterial({
        vertexShader: singularityVertexShader,
        fragmentShader: singularityFragmentShader,
        uniforms: { time: { value: 0.0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // --- PROCEDURAL GEOMETRY HELPERS ---

    function createGearGeometry(radius, teeth, depth, innerHole) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85;
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = (i % 2 === 0) ? radius : innerRadius;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        
        if (innerHole > 0) {
            const holePath = new THREE.Path();
            holePath.absarc(0, 0, innerHole, 0, Math.PI * 2, false);
            shape.holes.push(holePath);
        }

        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.translate(0, 0, -depth / 2);
        return geo;
    }

    function createComplexHydraulic(length, radius) {
        const hydGroup = new THREE.Group();
        
        const outerCyl = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const outerMesh = new THREE.Mesh(outerCyl, darkSteel);
        outerMesh.position.y = length * 0.3;
        hydGroup.add(outerMesh);

        const innerCyl = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 0.6, 32);
        const innerMesh = new THREE.Mesh(innerCyl, chrome);
        innerMesh.position.y = length * 0.7;
        hydGroup.add(innerMesh);

        const seal = new THREE.CylinderGeometry(radius * 1.1, radius * 1.1, length * 0.05, 32);
        const sealMesh = new THREE.Mesh(seal, rubber);
        sealMesh.position.y = length * 0.6;
        hydGroup.add(sealMesh);
        
        const mount1 = new THREE.BoxGeometry(radius * 2.5, radius * 2.5, radius * 2.5);
        const mount1Mesh = new THREE.Mesh(mount1, darkSteel);
        hydGroup.add(mount1Mesh);

        const mount2 = new THREE.BoxGeometry(radius * 1.5, radius * 1.5, radius * 1.5);
        const mount2Mesh = new THREE.Mesh(mount2, chrome);
        mount2Mesh.position.y = length;
        hydGroup.add(mount2Mesh);

        return hydGroup;
    }

    // --- MAIN COMPONENTS ---

    // 1. BASE PLATFORM
    const baseGroup = new THREE.Group();
    
    // Octagonal base shape
    const baseRadius = 25;
    const baseShape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + (Math.PI / 8);
        const x = Math.cos(angle) * baseRadius;
        const y = Math.sin(angle) * baseRadius;
        if (i === 0) baseShape.moveTo(x, y);
        else baseShape.lineTo(x, y);
    }
    baseShape.closePath();
    
    const baseExtrude = { depth: 2, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 4 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrude);
    baseGeo.rotateX(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = -2;
    baseGroup.add(baseMesh);

    // Grilles on the base
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const grilleGeo = new THREE.BoxGeometry(8, 0.2, 5);
        const grilleMesh = new THREE.Mesh(grilleGeo, steel);
        grilleMesh.position.set(Math.cos(angle) * 15, 0.1, Math.sin(angle) * 15);
        grilleMesh.rotation.y = -angle;
        baseGroup.add(grilleMesh);
    }

    group.add(baseGroup);
    parts.push({
        name: "Quantum Containment Base",
        description: "Massive octagonal platform heavily reinforced with neutron-star density plating to withstand gravitational shear.",
        material: "Dark Steel / Reinforced Titanium",
        function: "Anchors the entire assembly and grounds temporal energy leaks.",
        assemblyOrder: 1,
        connections: ["Graviton Pylons", "Tachyon Vents"],
        failureEffect: "Complete structural collapse and uncontained singularity expansion.",
        cascadeFailures: ["Chronos Gimbals", "Core Vessel"],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // 2. GRAVITON PYLONS
    const pylonGroup = new THREE.Group();
    const pylonMeshes = [];
    for(let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pylonRadius = 22;
        const x = Math.cos(angle) * pylonRadius;
        const z = Math.sin(angle) * pylonRadius;
        
        const singlePylonGroup = new THREE.Group();
        singlePylonGroup.position.set(x, 0, z);
        
        // Main structural column
        const columnGeo = new THREE.CylinderGeometry(1.5, 2.5, 20, 16);
        const columnMesh = new THREE.Mesh(columnGeo, darkSteel);
        columnMesh.position.y = 10;
        singlePylonGroup.add(columnMesh);
        
        // Heat sink rings
        for(let j=0; j<10; j++) {
            const ringGeo = new THREE.TorusGeometry(1.8 + (j*0.05), 0.2, 8, 32);
            const ringMesh = new THREE.Mesh(ringGeo, copper);
            ringMesh.position.y = 2 + j * 1.5;
            ringMesh.rotation.x = Math.PI / 2;
            singlePylonGroup.add(ringMesh);
        }

        // Energy coil inner
        const coilGeo = new THREE.CylinderGeometry(1.0, 1.0, 18, 16);
        const coilMesh = new THREE.Mesh(coilGeo, emissiveBlue);
        coilMesh.position.y = 10;
        singlePylonGroup.add(coilMesh);
        
        // Hydraulic brace
        const hyd = createComplexHydraulic(12, 0.5);
        hyd.position.set(0, 0, -2.5);
        hyd.rotation.x = -Math.PI / 6;
        singlePylonGroup.add(hyd);

        singlePylonGroup.lookAt(new THREE.Vector3(0, 10, 0));
        pylonGroup.add(singlePylonGroup);
        pylonMeshes.push(singlePylonGroup);
    }
    group.add(pylonGroup);

    parts.push({
        name: "Magnetic Confinement Pylons",
        description: "Array of 8 towering pylons generating localized multi-dimensional magnetic fields.",
        material: "Dark Steel, Copper, Blue Emissive Plasma",
        function: "Projects the initial confinement grid to stabilize the gimbals.",
        assemblyOrder: 2,
        connections: ["Quantum Containment Base", "Outer Gimbal Track"],
        failureEffect: "Magnetic field failure causing the gimbals to spin out of control and rip through local space.",
        cascadeFailures: ["Outer Gimbal", "Temporal Bubble"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: 50}
    });

    // 3. CENTRAL GIMBAL SUPPORT RING
    const supportRingGeo = new THREE.TorusGeometry(18, 1.5, 32, 128);
    const supportRing = new THREE.Mesh(supportRingGeo, steel);
    supportRing.position.y = 20;
    supportRing.rotation.x = Math.PI / 2;
    
    // Add intricate details to support ring
    for(let i=0; i<32; i++) {
        const angle = (i/32) * Math.PI * 2;
        const nodeGeo = new THREE.BoxGeometry(4, 3, 2);
        const nodeMesh = new THREE.Mesh(nodeGeo, chrome);
        nodeMesh.position.set(Math.cos(angle) * 18, 0, Math.sin(angle) * 18);
        nodeMesh.rotation.y = -angle;
        
        const lightGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const lightMesh = new THREE.Mesh(lightGeo, emissiveRed);
        lightMesh.position.set(2, 0, 0);
        nodeMesh.add(lightMesh);
        
        supportRing.add(nodeMesh);
    }
    group.add(supportRing);

    parts.push({
        name: "Equatorial Support Ring",
        description: "Massive static ring hovering at 20m, holding the primary axis mounts.",
        material: "Steel, Chrome, Red Emitters",
        function: "Serves as the stator for the massive electromagnetic bearings driving the gimbals.",
        assemblyOrder: 3,
        connections: ["Graviton Pylons", "Outer Gimbal"],
        failureEffect: "Structural decoupling resulting in catastrophic centrifugal explosion.",
        cascadeFailures: ["Outer Gimbal", "Middle Gimbal"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // 4. OUTER GIMBAL
    const outerGimbalGroup = new THREE.Group();
    outerGimbalGroup.position.y = 20;
    
    const ogGeo = new THREE.TorusGeometry(16, 1.2, 32, 100);
    const outerGimbalMesh = new THREE.Mesh(ogGeo, darkSteel);
    
    // Outer Gimbal Gears
    const ogGear = createGearGeometry(17, 36, 0.5, 15);
    const ogGearMesh = new THREE.Mesh(ogGear, copper);
    ogGearMesh.rotation.x = Math.PI/2;
    outerGimbalMesh.add(ogGearMesh);

    // Inner tracks on outer gimbal
    const ogTrack = new THREE.TorusGeometry(14.8, 0.2, 16, 100);
    const ogTrackMesh = new THREE.Mesh(ogTrack, emissiveBlue);
    outerGimbalMesh.add(ogTrackMesh);

    outerGimbalGroup.add(outerGimbalMesh);
    group.add(outerGimbalGroup);

    parts.push({
        name: "Outer Temporal Gimbal",
        description: "The primary rotating frame compensating for local planetary rotation and orbital drift in the time field.",
        material: "Dark Steel, Copper",
        function: "First stage spatial orientation of the temporal core.",
        assemblyOrder: 4,
        connections: ["Equatorial Support Ring", "Middle Gimbal"],
        failureEffect: "Loss of synchronization, causing time to dilate unevenly across the room.",
        cascadeFailures: ["Middle Gimbal"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 40, y: 20, z: 0}
    });

    // 5. MIDDLE GIMBAL
    const middleGimbalGroup = new THREE.Group();
    
    const mgGeo = new THREE.TorusGeometry(13, 1.0, 32, 100);
    const middleGimbalMesh = new THREE.Mesh(mgGeo, steel);
    
    // Emissive bands
    for(let i=0; i<4; i++) {
        const bandGeo = new THREE.TorusGeometry(13.2, 0.3, 16, 32, Math.PI / 4);
        const bandMesh = new THREE.Mesh(bandGeo, emissivePurple);
        bandMesh.rotation.z = (i * Math.PI) / 2;
        middleGimbalMesh.add(bandMesh);
    }

    const mgGear = createGearGeometry(13.8, 24, 0.4, 12);
    const mgGearMesh = new THREE.Mesh(mgGear, aluminum);
    mgGearMesh.rotation.x = Math.PI/2;
    middleGimbalMesh.add(mgGearMesh);

    middleGimbalGroup.add(middleGimbalMesh);
    outerGimbalGroup.add(middleGimbalGroup);

    parts.push({
        name: "Middle Temporal Gimbal",
        description: "Intermediate frame operating at relativistic velocities.",
        material: "Steel, Aluminum, Purple Emissives",
        function: "Generates the Lense-Thirring frame-dragging effect to warp spacetime.",
        assemblyOrder: 5,
        connections: ["Outer Gimbal", "Inner Gimbal"],
        failureEffect: "Spacetime shear, tearing molecular bonds apart.",
        cascadeFailures: ["Inner Gimbal"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 40}
    });

    // 6. INNER GIMBAL
    const innerGimbalGroup = new THREE.Group();
    
    const igGeo = new THREE.TorusGeometry(10, 0.8, 32, 100);
    const innerGimbalMesh = new THREE.Mesh(igGeo, chrome);
    
    // Spoke arrays
    for(let i=0; i<8; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, 20, 16);
        const spokeMesh = new THREE.Mesh(spokeGeo, darkSteel);
        spokeMesh.rotation.z = (i/8) * Math.PI;
        innerGimbalMesh.add(spokeMesh);
        
        // Add nodes on spokes
        const sNodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const sNodeMesh = new THREE.Mesh(sNodeGeo, gold);
        sNodeMesh.position.y = 8;
        spokeMesh.add(sNodeMesh);
        
        const sNodeMesh2 = new THREE.Mesh(sNodeGeo, gold);
        sNodeMesh2.position.y = -8;
        spokeMesh.add(sNodeMesh2);
    }

    innerGimbalGroup.add(innerGimbalMesh);
    middleGimbalGroup.add(innerGimbalGroup);

    parts.push({
        name: "Inner Chroniton Gimbal",
        description: "High-density chrome torus laced with gold superconductive nodes.",
        material: "Chrome, Gold, Dark Steel",
        function: "Final layer of physical containment before the singularity core.",
        assemblyOrder: 6,
        connections: ["Middle Gimbal", "Singularity Core"],
        failureEffect: "Direct exposure to the singularity, instant spaghettification.",
        cascadeFailures: ["Singularity Core"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 40}
    });

    // 7. SINGULARITY CORE
    const coreGroup = new THREE.Group();
    
    const icosaGeo = new THREE.IcosahedronGeometry(4, 2);
    const coreMesh = new THREE.Mesh(icosaGeo, new THREE.MeshStandardMaterial({
        color: 0x000000, roughness: 0.0, metalness: 1.0, envMapIntensity: 2.0
    }));
    coreGroup.add(coreMesh);
    
    // Emissive cage around core
    const cageGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const cageMesh = new THREE.Mesh(cageGeo, emissiveWhite);
    cageMesh.material.wireframe = true;
    coreGroup.add(cageMesh);

    // Strange attractor nodes around the core
    const nodeCount = 50;
    const coreNodes = [];
    for(let i=0; i<nodeCount; i++) {
        const nGeo = new THREE.OctahedronGeometry(0.3);
        const nMesh = new THREE.Mesh(nGeo, emissiveBlue);
        nMesh.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*12, (Math.random()-0.5)*12);
        coreGroup.add(nMesh);
        coreNodes.push(nMesh);
    }

    // The singularity visual distortion
    const singularityPlaneGeo = new THREE.PlaneGeometry(20, 20);
    const singularityEffect = new THREE.Mesh(singularityPlaneGeo, singularityMaterial);
    // Orient it to face camera generally (will be handled in animate or lookAt)
    coreGroup.add(singularityEffect);

    innerGimbalGroup.add(coreGroup);

    parts.push({
        name: "Naked Singularity Engine",
        description: "An artificial, contained micro-singularity powering the entire device.",
        material: "Perfect Black Body, White Plasma Cage",
        function: "Infinite energy source and focal point of extreme spacetime curvature.",
        assemblyOrder: 7,
        connections: ["Inner Gimbal"],
        failureEffect: "Event horizon expansion, consuming the local solar system.",
        cascadeFailures: ["Everything"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // 8. TEMPORAL BUBBLE BOUNDARY
    const bubbleGeo = new THREE.SphereGeometry(30, 64, 64);
    const bubbleMesh = new THREE.Mesh(bubbleGeo, temporalBubbleMaterial);
    bubbleMesh.position.y = 20;
    group.add(bubbleMesh);

    parts.push({
        name: "Chronos Field Boundary",
        description: "The distinct visible edge of the localized time dilation field. Inside, time flows differently.",
        material: "Exotic Shader Plasma",
        function: "Demarcates the area of effect and shields external reality from chronal bleed.",
        assemblyOrder: 8,
        connections: ["Singularity Core", "External Reality"],
        failureEffect: "Temporal contamination resulting in uncontrolled paradoxes.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 80, z: 0}
    });

    // 9. OPERATOR CABIN (CONTROL ROOM)
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 45, 0); // Suspended above the gimbals

    // Cabin Main Hull
    const cabinGeo = new THREE.CylinderGeometry(8, 6, 8, 16);
    const cabinMesh = new THREE.Mesh(cabinGeo, darkSteel);
    cabinGroup.add(cabinMesh);

    // Glass dome
    const domeGeo = new THREE.SphereGeometry(6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, tinted);
    domeMesh.position.y = 4;
    cabinGroup.add(domeMesh);

    // Cabin interior details
    const consoleGeo = new THREE.BoxGeometry(4, 2, 2);
    const consoleMesh = new THREE.Mesh(consoleGeo, steel);
    consoleMesh.position.set(0, -2, -3);
    cabinGroup.add(consoleMesh);

    // Glowing screens
    const screenGeo = new THREE.PlaneGeometry(1.5, 1);
    for(let i=-1; i<=1; i++) {
        const screenMesh = new THREE.Mesh(screenGeo, emissiveBlue);
        screenMesh.position.set(i*1.6, -1, -2.9);
        screenMesh.rotation.x = -Math.PI / 4;
        cabinGroup.add(screenMesh);
    }

    // Operator Seat
    const seatGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
    const seatMesh = new THREE.Mesh(seatGeo, rubber);
    seatMesh.position.set(0, -3.5, 0);
    cabinGroup.add(seatMesh);
    const backGeo = new THREE.BoxGeometry(1.5, 2, 0.5);
    const backMesh = new THREE.Mesh(backGeo, rubber);
    backMesh.position.set(0, -2, 0.5);
    cabinGroup.add(backMesh);

    // Suspension cables
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 30, 8);
        const cableMesh = new THREE.Mesh(cableGeo, steel);
        
        // Calculate vector from cabin rim to external gantry (assumed above)
        cableMesh.position.set(Math.cos(angle)*5, 15, Math.sin(angle)*5);
        cableMesh.rotation.x = Math.PI / 8 * Math.sin(angle);
        cableMesh.rotation.z = Math.PI / 8 * Math.cos(angle);
        cabinGroup.add(cableMesh);
    }

    group.add(cabinGroup);

    parts.push({
        name: "Observer Cockpit",
        description: "Heavily shielded, chronally isolated observation and control deck.",
        material: "Dark Steel, Tinted Quantum Glass, Rubber",
        function: "Allows a human operator to control the field from outside the extreme time-dilation effects, via shielded telemetry.",
        assemblyOrder: 9,
        connections: ["Gantry Suspension (External)", "Telemetry Uplinks"],
        failureEffect: "Operator rapidly ages or de-ages depending on field polarity.",
        cascadeFailures: ["Human Operator"],
        originalPosition: {x: 0, y: 45, z: 0},
        explodedPosition: {x: 0, y: 100, z: 0}
    });

    // 10. TACHYON INJECTORS (Complex Tube Structures)
    const injectorGroup = new THREE.Group();
    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.4 });
    const numTubes = 12;

    for (let i = 0; i < numTubes; i++) {
        const angle = (i / numTubes) * Math.PI * 2;
        
        // Create a chaotic path using CatmullRomCurve3
        const curvePoints = [];
        const startX = Math.cos(angle) * 25;
        const startZ = Math.sin(angle) * 25;
        
        curvePoints.push(new THREE.Vector3(startX, -2, startZ));
        curvePoints.push(new THREE.Vector3(startX * 0.9, 10, startZ * 0.9));
        curvePoints.push(new THREE.Vector3(startX * 1.1, 15, startZ * 1.1));
        curvePoints.push(new THREE.Vector3(Math.cos(angle + 0.2) * 19, 20, Math.sin(angle + 0.2) * 19));
        
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.6, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMaterial);
        
        // Add glowing ring at the injector tip
        const tipRing = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
        const tipMesh = new THREE.Mesh(tipRing, emissiveRed);
        tipMesh.position.copy(curvePoints[3]);
        tipMesh.lookAt(0, 20, 0);
        tubeMesh.add(tipMesh);

        injectorGroup.add(tubeMesh);
    }
    group.add(injectorGroup);

    parts.push({
        name: "Tachyon Injector Manifolds",
        description: "Intricate network of pipes delivering superluminal particles to the support ring.",
        material: "Reinforced Alloy, Red Emitters",
        function: "Provides the necessary exotic matter to sustain the negative energy density required for spacetime warping.",
        assemblyOrder: 10,
        connections: ["Quantum Containment Base", "Equatorial Support Ring"],
        failureEffect: "Tachyon burst, causing localized retro-causality loops.",
        cascadeFailures: ["Temporal Bubble"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 30}
    });

    // 11. PARTICLE SYSTEM (Chronal Dust)
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities = [];

    for(let i=0; i<particleCount; i++) {
        // Distribute in a spherical volume
        const r = 30 * Math.pow(Math.random(), 1/3); // uniformly in sphere
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) + 20; // center at y=20
        const z = r * Math.cos(phi);
        
        pPositions[i*3] = x;
        pPositions[i*3+1] = y;
        pPositions[i*3+2] = z;
        
        pVelocities.push({
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            vz: (Math.random() - 0.5) * 0.2,
            r: r
        });
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);

    parts.push({
        name: "Chronal Dust Excitation",
        description: "Visual manifestation of quantum foam boiling as local time accelerates.",
        material: "Cyan Point Sprites",
        function: "Passive byproduct of intense temporal friction.",
        assemblyOrder: 11,
        connections: [],
        failureEffect: "Harmless but visually blinding.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // 12. HIGH-VOLTAGE CAPACITOR BANKS
    const capGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        const capUnit = new THREE.Group();
        capUnit.position.set(Math.cos(angle) * 20, -1, Math.sin(angle) * 20);
        
        const baseBox = new THREE.BoxGeometry(6, 4, 6);
        const baseBMesh = new THREE.Mesh(baseBox, darkSteel);
        baseBMesh.position.y = 2;
        capUnit.add(baseBMesh);
        
        // Cylindrical capacitors on top
        for(let cx = -1; cx <= 1; cx+=2) {
            for(let cz = -1; cz <= 1; cz+=2) {
                const cyl = new THREE.CylinderGeometry(0.8, 0.8, 4, 16);
                const cylMesh = new THREE.Mesh(cyl, chrome);
                cylMesh.position.set(cx*1.5, 6, cz*1.5);
                
                const topNode = new THREE.SphereGeometry(0.6, 16, 16);
                const topNodeMesh = new THREE.Mesh(topNode, emissiveBlue);
                topNodeMesh.position.y = 2;
                cylMesh.add(topNodeMesh);
                
                capUnit.add(cylMesh);
            }
        }
        
        // Massive cables from capacitor to pylons
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 8, 0),
            new THREE.Vector3(0, 12, -5),
            new THREE.Vector3(Math.cos(angle)*(-2), 10, Math.sin(angle)*(-2))
        ]);
        const wireGeo = new THREE.TubeGeometry(curve, 16, 0.4, 8, false);
        const wireMesh = new THREE.Mesh(wireGeo, rubber);
        capUnit.add(wireMesh);

        capUnit.rotation.y = -angle;
        capGroup.add(capUnit);
    }
    group.add(capGroup);

    parts.push({
        name: "Zero-Point Capacitor Banks",
        description: "Four massive high-voltage storage units feeding the graviton pylons.",
        material: "Dark Steel, Chrome, Blue Emitters, Rubber",
        function: "Provides the immediate, staggering bursts of energy required to jump-start the gimbals.",
        assemblyOrder: 12,
        connections: ["Graviton Pylons", "Quantum Containment Base"],
        failureEffect: "Catastrophic arc flash, vaporizing a 50m radius.",
        cascadeFailures: ["Graviton Pylons"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 50, y: 0, z: 50}
    });

    // 13. RELATIVISTIC HEAT SINKS
    const heatSinkGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const sinkGeo = new THREE.BoxGeometry(2, 10, 0.5);
        
        // Ribbed detail
        for(let r=0; r<8; r++) {
            const rib = new THREE.BoxGeometry(2.2, 0.2, 0.6);
            const ribMesh = new THREE.Mesh(rib, copper);
            ribMesh.position.y = -4 + r*1.1;
            sinkGeo.translate(0,0,0); // Dummy to force matrix update if needed
            // To make it fully single geometry, one would use CSG or BufferGeometryUtils, 
            // but for scene graph complexity, grouping is fine.
        }
        
        const sinkMesh = new THREE.Mesh(sinkGeo, darkSteel);
        
        for(let r=0; r<8; r++) {
            const rib = new THREE.BoxGeometry(2.2, 0.2, 0.6);
            const ribMesh = new THREE.Mesh(rib, copper);
            ribMesh.position.y = -4 + r*1.1;
            sinkMesh.add(ribMesh);
        }

        sinkMesh.position.set(Math.cos(angle) * 19, 10, Math.sin(angle) * 19);
        sinkMesh.lookAt(0, 10, 0);
        heatSinkGroup.add(sinkMesh);
    }
    group.add(heatSinkGroup);

    parts.push({
        name: "Hawking Radiation Diffusers",
        description: "Radiator panels designed to bleed off immense heat generated by micro-singularity proximity.",
        material: "Dark Steel, Copper",
        function: "Prevents thermal meltdown of the equatorial ring.",
        assemblyOrder: 13,
        connections: ["Equatorial Support Ring"],
        failureEffect: "Support ring melts into slag.",
        cascadeFailures: ["Equatorial Support Ring"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: 0, y: -10, z: -40}
    });

    // 14. LORENTZ CONTRACTION DAMPENERS
    const dampenerGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2 + Math.PI/8;
        const dUnit = new THREE.Group();
        
        const cyl1 = new THREE.CylinderGeometry(1.2, 1.2, 6, 16);
        const m1 = new THREE.Mesh(cyl1, steel);
        dUnit.add(m1);
        
        const cyl2 = new THREE.CylinderGeometry(1.4, 1.4, 2, 16);
        const m2 = new THREE.Mesh(cyl2, emissiveGreen);
        m2.position.y = 2;
        dUnit.add(m2);

        dUnit.position.set(Math.cos(angle) * 14, 20, Math.sin(angle) * 14);
        dUnit.rotation.x = Math.PI / 2;
        dUnit.lookAt(0, 20, 0);
        dampenerGroup.add(dUnit);
    }
    group.add(dampenerGroup);

    parts.push({
        name: "Spatial Contraction Dampeners",
        description: "Green-glowing pneumatic-like compensators aiming directly at the core.",
        material: "Steel, Green Emitters",
        function: "Counters the physical squeezing of space caused by the immense gravitational pull.",
        assemblyOrder: 14,
        connections: ["Equatorial Support Ring", "Outer Gimbal Track"],
        failureEffect: "Machine physically shrinks and crushes itself due to extreme localized gravity.",
        cascadeFailures: ["Entire Structure"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: -30, y: 30, z: 0}
    });

    // 15. TEMPORAL POLARITY INVERTER
    const inverterGroup = new THREE.Group();
    inverterGroup.position.set(0, -1, 0); // Directly under the core, embedded in base

    const invCoreGeo = new THREE.TorusKnotGeometry(3, 0.8, 100, 16, 2, 5);
    const invCoreMesh = new THREE.Mesh(invCoreGeo, emissiveRed);
    invCoreMesh.rotation.x = Math.PI / 2;
    inverterGroup.add(invCoreMesh);
    
    group.add(inverterGroup);

    parts.push({
        name: "Chronal Polarity Inverter",
        description: "Complex toroidal knot of exotic matter housed in the base.",
        material: "Red Emissive Plasma",
        function: "Determines if time inside the bubble runs faster or slower relative to the outside.",
        assemblyOrder: 15,
        connections: ["Quantum Containment Base"],
        failureEffect: "Uncontrollable oscillations between fast and slow time, shattering physical objects.",
        cascadeFailures: ["Temporal Bubble"],
        originalPosition: {x: 0, y: -1, z: 0},
        explodedPosition: {x: 0, y: -20, z: -20}
    });

    // --- ANIMATION LOGIC ---

    const clock = new THREE.Clock();
    
    // Attractor variables for chaotic gimbal movement
    let lorenzX = 0.1;
    let lorenzY = 0;
    let lorenzZ = 0;
    const a = 10.0;
    const b = 28.0;
    const c = 8.0 / 3.0;

    function animate(time, speed, meshes) {
        const delta = clock.getDelta() * speed;
        const totalTime = clock.getElapsedTime() * speed;
        
        // 1. Shaders update
        temporalBubbleMaterial.uniforms.time.value = totalTime;
        singularityMaterial.uniforms.time.value = totalTime;
        
        // 2. Gimbal Rotations (Complex, chaotic but structured)
        
        // Lorenz attractor integration step for chaos injection
        const dt = delta * 0.5;
        const dx = (a * (lorenzY - lorenzX)) * dt;
        const dy = (lorenzX * (b - lorenzZ) - lorenzY) * dt;
        const dz = (lorenzX * lorenzY - c * lorenzZ) * dt;
        
        lorenzX += dx;
        lorenzY += dy;
        lorenzZ += dz;
        
        // Normalize lorenz for rotation bounds
        const chaoticSpeed = (lorenzX / 30.0); 

        if (outerGimbalGroup) {
            outerGimbalGroup.rotation.y += (0.2 * speed * (1 + chaoticSpeed * 0.1)) * delta * 10;
            outerGimbalGroup.rotation.z = Math.sin(totalTime * 0.5) * 0.3; 
        }
        
        if (middleGimbalGroup) {
            middleGimbalGroup.rotation.x += (0.5 * speed) * delta * 10;
            middleGimbalGroup.rotation.y = Math.cos(totalTime * 0.7) * 0.4;
        }

        if (innerGimbalGroup) {
            innerGimbalGroup.rotation.z += (1.2 * speed * (1 + Math.abs(chaoticSpeed))) * delta * 10;
            innerGimbalGroup.rotation.x += (0.8 * speed) * delta * 10;
        }

        if (coreGroup) {
            coreGroup.rotation.y -= (2.0 * speed) * delta * 10;
            coreGroup.rotation.x += (1.5 * speed) * delta * 10;
            
            // Pulse core nodes
            coreNodes.forEach((node, i) => {
                const scale = 1.0 + Math.sin(totalTime * 5.0 + i) * 0.5;
                node.scale.set(scale, scale, scale);
                node.position.x += Math.sin(totalTime * 2.0 + i) * 0.01;
            });
            
            if (singularityEffect) {
                singularityEffect.lookAt(meshes.camera ? meshes.camera.position : new THREE.Vector3(0,20,50));
            }
        }
        
        // 3. Particle System Update
        if (particleSystem) {
            const positions = particleSystem.geometry.attributes.position.array;
            for(let i=0; i<particleCount; i++) {
                const px = positions[i*3];
                const py = positions[i*3+1];
                const pz = positions[i*3+2];
                const vel = pVelocities[i];
                
                // Relativistic swirling around core
                const dxCore = px;
                const dyCore = py - 20;
                const dzCore = pz;
                const distToCore = Math.sqrt(dxCore*dxCore + dyCore*dyCore + dzCore*dzCore);
                
                // Gravity pull towards center
                const pull = 10.0 / (distToCore * distToCore + 1.0);
                vel.vx -= dxCore * pull * delta;
                vel.vy -= dyCore * pull * delta;
                vel.vz -= dzCore * pull * delta;
                
                // Swirl
                const crossX = dyCore * 1.0 - dzCore * 0.0;
                const crossY = dzCore * 0.0 - dxCore * 1.0;
                const crossZ = dxCore * 1.0 - dyCore * 0.0;
                
                vel.vx += crossX * 0.1 * delta;
                vel.vy += crossY * 0.1 * delta;
                vel.vz += crossZ * 0.1 * delta;
                
                // Speed limit (speed of light analogy)
                const currentSpeed = Math.sqrt(vel.vx*vel.vx + vel.vy*vel.vy + vel.vz*vel.vz);
                if (currentSpeed > 2.0) {
                    vel.vx *= (2.0/currentSpeed);
                    vel.vy *= (2.0/currentSpeed);
                    vel.vz *= (2.0/currentSpeed);
                }

                // Apply velocity
                positions[i*3] += vel.vx * delta * 50;
                positions[i*3+1] += vel.vy * delta * 50;
                positions[i*3+2] += vel.vz * delta * 50;
                
                // Reset if too far or too close
                const newDist = Math.sqrt(positions[i*3]*positions[i*3] + (positions[i*3+1]-20)*(positions[i*3+1]-20) + positions[i*3+2]*positions[i*3+2]);
                if (newDist > 29 || newDist < 2) {
                    // Respawn near edge
                    const r = 28;
                    const theta = Math.random() * 2 * Math.PI;
                    const phi = Math.acos(2 * Math.random() - 1);
                    positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
                    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta) + 20;
                    positions[i*3+2] = r * Math.cos(phi);
                    vel.vx = 0; vel.vy = 0; vel.vz = 0;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
            
            // Color pulsing based on time dilation factor
            const timeDilationColor = new THREE.Color().setHSL(0.5 + Math.sin(totalTime) * 0.1, 1.0, 0.5);
            particleSystem.material.color = timeDilationColor;
        }

        // 4. Polarity Inverter Spin
        if (inverterGroup) {
            inverterGroup.rotation.y += delta * 5 * speed;
        }
    }

    // --- QUIZ QUESTIONS ---

    const quizQuestions = [
        {
            question: "In the context of the Alcubierre drive metric $ds^2 = -dt^2 + (dx - v_s f(r_s) dt)^2 + dy^2 + dz^2$, what is the physical interpretation of the expansion scalar $\\theta$ of the Eulerian observers?",
            options: [
                "It represents the rate of local time dilation within the warp bubble.",
                "It dictates the volume expansion and contraction of space in front of and behind the bubble.",
                "It represents the Hawking radiation emitted by the bubble horizon.",
                "It is the scalar curvature of the background Minkowski spacetime."
            ],
            correctAnswer: 1,
            explanation: "The expansion scalar dictates that space expands behind the bubble (positive expansion) and contracts in front of it (negative expansion), enabling superluminal travel without violating local Lorentz invariance."
        },
        {
            question: "According to General Relativity, for a static, spherically symmetric spacetime described by the Schwarzschild metric, the gravitational time dilation factor between an observer at coordinate radius $r$ and an observer at infinity is given by:",
            options: [
                "$\\sqrt{1 - \\frac{r_s}{r}}$",
                "$1 - \\frac{r_s}{r}$",
                "$\\sqrt{1 - \\frac{v^2}{c^2}}$",
                "$e^{-\\frac{GM}{rc^2}}$"
            ],
            correctAnswer: 0,
            explanation: "The factor is $\\sqrt{1 - \\frac{r_s}{r}}$, where $r_s$ is the Schwarzschild radius. This shows time stops relative to infinity at the event horizon ($r = r_s$)."
        },
        {
            question: "Consider two inertial frames S and S' in standard configuration. The Lorentz transformation for the temporal coordinate is $t' = \\gamma (t - \\frac{vx}{c^2})$. What is the fundamental physical consequence of the position-dependent term $\\frac{vx}{c^2}$?",
            options: [
                "Length contraction.",
                "Relativity of simultaneity.",
                "Transverse Doppler effect.",
                "Relativistic mass increase."
            ],
            correctAnswer: 1,
            explanation: "The term $\\frac{vx}{c^2}$ means that events happening at the same time $t$ in frame S but at different $x$ locations will occur at different times $t'$ in frame S', breaking absolute simultaneity."
        },
        {
            question: "In a rotating reference frame (e.g., the periphery of the Chronos gimbal), the Sagnac effect introduces a phase shift proportional to the enclosed area. This is a consequence of which spacetime feature?",
            options: [
                "The non-vanishing Riemann curvature tensor.",
                "The breakdown of global clock synchronization due to a non-zero time-space metric component $g_{0i}$.",
                "The frame-dragging effect (Lense-Thirring effect).",
                "The cosmological constant $\\Lambda$."
            ],
            correctAnswer: 1,
            explanation: "In rotating frames, the metric has off-diagonal $g_{0i}$ terms. This prevents a global synchronization of clocks along a closed loop, leading to the Sagnac effect observable in ring lasers."
        },
        {
            question: "When near a rotating Kerr black hole (such as the simulated singularity core), the region where the time-translation Killing vector field $\\partial_t$ becomes spacelike is known as:",
            options: [
                "The event horizon.",
                "The Cauchy horizon.",
                "The ergosphere.",
                "The photon sphere."
            ],
            correctAnswer: 2,
            explanation: "In the ergosphere, space itself is dragged faster than light relative to an observer at infinity. The time-translation Killing vector becomes spacelike, meaning an observer must move in the direction of rotation to travel forward in time."
        }
    ];

    const description = "The Ultra God-Tier Chronos Field Generator. A massive, relativistic spacetime manipulation device. It utilizes a central micro-singularity, chaotic Lorenz-attractor driven gimbals, and exotic tachyon manifolds to decouple a localized 30-meter spherical volume from standard timeflow. Extreme caution is advised: chronological polarity inversion can result in rapid aging or spontaneous structural disintegration.";

    return { group, parts, description, quizQuestions, animate };
}
