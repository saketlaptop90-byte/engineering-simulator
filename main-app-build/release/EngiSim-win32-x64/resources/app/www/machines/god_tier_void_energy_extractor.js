import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ============================================================================
    // SHADERS & CUSTOM MATERIALS
    // ============================================================================
    
    const voidUniforms = {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x05001a) }, // Deep abyss purple/black
        color2: { value: new THREE.Color(0x3a0088) }, // High-energy void purple
    };

    const voidMaterial = new THREE.ShaderMaterial({
        uniforms: voidUniforms,
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            void main() {
                vUv = uv;
                vPosition = position;
                // Quantum fluctuation of the boundary
                vec3 pos = position;
                pos.x += sin(pos.y * 15.0 + time * 5.0) * 0.05;
                pos.z += cos(pos.x * 15.0 + time * 3.0) * 0.05;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vPosition;

            float hash(vec3 p) {
                p = fract(p * 0.3183099 + .1);
                p *= 17.0;
                return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
            }
            float noise(vec3 x) {
                vec3 i = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                               mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                           mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                               mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
            }

            void main() {
                vec3 p = vPosition * 3.0;
                float n = noise(p + time * 0.8);
                n += 0.5 * noise(p * 2.0 - time);
                n += 0.25 * noise(p * 4.0 + time * 2.0);
                n += 0.125 * noise(p * 8.0 - time * 3.0);
                
                float glow = pow(n, 2.5);
                vec3 finalColor = mix(color1, color2, glow);
                gl_FragColor = vec4(finalColor, 0.95);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });

    const energyArcUniforms = { time: { value: 0 } };
    const energyArcMaterial = new THREE.ShaderMaterial({
        uniforms: energyArcUniforms,
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                // High-frequency jitter for arcs
                pos.x += sin(pos.y * 50.0 + time * 30.0) * 0.1;
                pos.z += cos(pos.y * 45.0 + time * 25.0) * 0.1;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                float pulse = abs(sin(vUv.y * 100.0 - time * 50.0)) * 0.5 + 0.5;
                float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
                gl_FragColor = vec4(0.9, 0.5, 1.0, pulse * edge * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const emissivePurple = new THREE.MeshStandardMaterial({
        color: 0x220044,
        emissive: 0x9900ff,
        emissiveIntensity: 2.5,
        metalness: 0.8,
        roughness: 0.1
    });

    const quantumGold = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x552200,
        emissiveIntensity: 1.2,
        metalness: 1.0,
        roughness: 0.2
    });

    const superConductorMaterial = new THREE.MeshStandardMaterial({
        color: 0x111122,
        emissive: 0x112255,
        metalness: 0.9,
        roughness: 0.05,
        envMapIntensity: 2.0
    });

    // ============================================================================
    // PROCEDURAL GEOMETRY GENERATORS
    // ============================================================================

    // Generates a complex brutalist pillar with internal structure
    function createBrutalistPillar(height, radius) {
        const pillarGroup = new THREE.Group();
        
        // Main Core
        const corePoints = [];
        for (let i = 0; i <= 20; i++) {
            const h = (i / 20) * height;
            const r = radius * (1.0 + 0.1 * Math.sin(i * Math.PI / 2));
            corePoints.push(new THREE.Vector2(r, h));
        }
        const coreGeo = new THREE.LatheGeometry(corePoints, 12);
        const coreMesh = new THREE.Mesh(coreGeo, darkSteel);
        pillarGroup.add(coreMesh);

        // Exoskeleton
        const exoShape = new THREE.Shape();
        exoShape.moveTo(radius * 1.2, 0);
        exoShape.lineTo(radius * 1.5, radius * 0.3);
        exoShape.lineTo(radius * 1.5, height - radius * 0.3);
        exoShape.lineTo(radius * 1.2, height);
        exoShape.lineTo(radius * 1.1, height);
        exoShape.lineTo(radius * 1.3, height / 2);
        exoShape.lineTo(radius * 1.1, 0);

        const extrudeSettings = { depth: radius * 0.4, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        
        for (let i = 0; i < 4; i++) {
            const exoGeo = new THREE.ExtrudeGeometry(exoShape, extrudeSettings);
            const exoMesh = new THREE.Mesh(exoGeo, steel);
            exoMesh.position.z = -radius * 0.2;
            const pivot = new THREE.Group();
            pivot.add(exoMesh);
            pivot.rotation.y = (Math.PI / 2) * i;
            pillarGroup.add(pivot);

            // Add glowing conduits inside the exoskeleton gaps
            const conduitGeo = new THREE.CylinderGeometry(radius * 0.05, radius * 0.05, height * 0.9, 8);
            const conduitMesh = new THREE.Mesh(conduitGeo, emissivePurple);
            conduitMesh.position.set(Math.cos((Math.PI/2)*i + Math.PI/4) * radius * 1.1, height/2, Math.sin((Math.PI/2)*i + Math.PI/4) * radius * 1.1);
            pillarGroup.add(conduitMesh);
        }

        return pillarGroup;
    }

    // Generates complex pipe bundles
    function createPipeBundle(path, count, radius) {
        const bundleGroup = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const offsetDist = radius * Math.random();
            const ox = Math.cos(angle) * offsetDist;
            const oy = Math.sin(angle) * offsetDist;
            
            // Perturb path
            const modifiedPathPoints = path.getPoints(50).map(p => {
                return new THREE.Vector3(p.x + ox, p.y + oy, p.z);
            });
            const modPath = new THREE.CatmullRomCurve3(modifiedPathPoints);
            const pipeGeo = new THREE.TubeGeometry(modPath, 64, radius * 0.15 + Math.random() * 0.05, 8, false);
            const pipeMat = Math.random() > 0.5 ? copper : (Math.random() > 0.5 ? steel : rubber);
            const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
            bundleGroup.add(pipeMesh);
        }
        return bundleGroup;
    }

    function createCasimirPlate(radius, thickness) {
        const plateGroup = new THREE.Group();
        
        // Massive incredibly flat surface
        const surfaceGeo = new THREE.CylinderGeometry(radius, radius, thickness, 128);
        const surfaceMesh = new THREE.Mesh(surfaceGeo, superConductorMaterial);
        plateGroup.add(surfaceMesh);

        // Heat fins on the back
        const finCount = 180;
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.lineTo(radius * 0.9, 0);
        finShape.lineTo(radius * 0.8, thickness * 5);
        finShape.lineTo(0, thickness * 5);
        
        const finExtrude = { depth: 0.1, bevelEnabled: false };
        const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);
        finGeo.translate(0, thickness / 2, -0.05);

        const finRing = new THREE.Group();
        for(let i=0; i<finCount; i++) {
            const fMesh = new THREE.Mesh(finGeo, aluminum);
            fMesh.rotation.y = (Math.PI * 2 * i) / finCount;
            finRing.add(fMesh);
        }
        plateGroup.add(finRing);

        // Stabilization micro-actuators around the rim
        const actuatorCount = 36;
        for(let i=0; i<actuatorCount; i++) {
            const angle = (Math.PI * 2 * i) / actuatorCount;
            const actGroup = new THREE.Group();
            
            const baseG = new THREE.BoxGeometry(0.5, thickness * 2, 0.5);
            const baseM = new THREE.Mesh(baseG, darkSteel);
            baseM.position.y = thickness;
            actGroup.add(baseM);

            const pistonG = new THREE.CylinderGeometry(0.1, 0.1, thickness * 3, 16);
            const pistonM = new THREE.Mesh(pistonG, chrome);
            pistonM.position.y = thickness * 2.5;
            actGroup.add(pistonM);

            const crystalG = new THREE.OctahedronGeometry(0.2);
            const crystalM = new THREE.Mesh(crystalG, emissivePurple);
            crystalM.position.y = thickness * 4;
            actGroup.add(crystalM);

            actGroup.position.set(Math.cos(angle) * (radius + 0.3), -thickness/2, Math.sin(angle) * (radius + 0.3));
            actGroup.lookAt(0, -thickness/2, 0);
            plateGroup.add(actGroup);
        }

        return plateGroup;
    }

    // ============================================================================
    // CONSTRUCTING THE MACHINE
    // ============================================================================

    const CENTER_HEIGHT = 20;

    // --- 1. Brutalist Foundation & Containment Pit ---
    const foundationGroup = new THREE.Group();
    
    // Outer hexagonal retaining wall
    const hexShape = new THREE.Shape();
    const hexRadius = 40;
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        if (i === 0) hexShape.moveTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
        else hexShape.lineTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
    }
    hexShape.closePath();
    
    // Create a hole for the void pit
    const holeShape = new THREE.Path();
    const holeRadius = 25;
    holeShape.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    hexShape.holes.push(holeShape);

    const foundationExtrude = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
    const foundationGeo = new THREE.ExtrudeGeometry(hexShape, foundationExtrude);
    const foundationMesh = new THREE.Mesh(foundationGeo, darkSteel);
    foundationMesh.rotation.x = -Math.PI / 2;
    foundationMesh.position.y = -10;
    foundationGroup.add(foundationMesh);

    // Pit lining
    const pitLiningGeo = new THREE.CylinderGeometry(holeRadius, holeRadius, 20, 64, 1, true);
    const pitLiningMesh = new THREE.Mesh(pitLiningGeo, steel);
    pitLiningMesh.position.y = -10;
    foundationGroup.add(pitLiningMesh);

    // Inner Void Core (The source of extraction)
    const voidSphereGeo = new THREE.SphereGeometry(15, 128, 128);
    const voidCoreMesh = new THREE.Mesh(voidSphereGeo, voidMaterial);
    voidCoreMesh.position.y = 0;
    foundationGroup.add(voidCoreMesh);
    
    // Add multiple rotating quantum rings around the void
    const quantumRings = [];
    for(let i=0; i<3; i++) {
        const ringGroup = new THREE.Group();
        const tGeo = new THREE.TorusGeometry(18 + i*2, 0.3, 32, 100);
        const tMesh = new THREE.Mesh(tGeo, quantumGold);
        ringGroup.add(tMesh);

        // Add magnetic constraint nodes to rings
        for(let j=0; j<12; j++) {
            const angle = (Math.PI*2*j)/12;
            const nodeG = new THREE.BoxGeometry(1, 1, 1);
            const nodeM = new THREE.Mesh(nodeG, chrome);
            nodeM.position.set(Math.cos(angle)*(18+i*2), 0, Math.sin(angle)*(18+i*2));
            nodeM.rotation.y = -angle;
            ringGroup.add(nodeM);
        }

        ringGroup.position.y = 0;
        ringGroup.rotation.x = Math.PI/2;
        foundationGroup.add(ringGroup);
        quantumRings.push({ mesh: ringGroup, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), speed: 0.5 + Math.random() });
    }

    parts.push({
        name: "Containment Foundation & Void Core",
        description: "Massive brutalist retaining architecture holding back the raw vacuum energy field.",
        material: "Dark Steel, Energy Shaders",
        function: "Houses the zero-point singularity and prevents reality disintegration.",
        assemblyOrder: 1,
        connections: ["Support Pillars", "Casimir Chamber"],
        failureEffect: "Total vacuum decay, erasing the local star system.",
        cascadeFailures: ["Casimir Plates", "Cooling Array"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -30, z: 0}
    });

    group.add(foundationGroup);

    // --- 2. Brutalist Support Pillars ---
    const pillarGroup = new THREE.Group();
    const pillarCount = 6;
    for(let i=0; i<pillarCount; i++) {
        const angle = (Math.PI*2*i) / pillarCount;
        const dist = 28;
        const pillar = createBrutalistPillar(CENTER_HEIGHT * 2, 3);
        pillar.position.set(Math.cos(angle)*dist, 0, Math.sin(angle)*dist);
        pillarGroup.add(pillar);
    }
    
    parts.push({
        name: "Hyper-Tensile Support Pillars",
        description: "Six colossal, reinforced struts engineered to withstand extreme spatial warping.",
        material: "Dark Steel, Chromium",
        function: "Maintains the structural integrity of the Casimir Chamber relative to the Void Core.",
        assemblyOrder: 2,
        connections: ["Foundation", "Upper Support Ring"],
        failureEffect: "Chamber misalignment, causing immediate localized spaghettification.",
        cascadeFailures: ["Upper Support Ring"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 50}
    });
    group.add(pillarGroup);

    // --- 3. Casimir Chamber (The Core Mechanism) ---
    // Two massively huge, perfectly flat plates brought within nanometers of each other (scaled up for visualization)
    const casimirGroup = new THREE.Group();
    
    // Bottom Plate (Negative Polarity)
    const bottomPlate = createCasimirPlate(12, 0.5);
    bottomPlate.position.y = CENTER_HEIGHT - 2;
    casimirGroup.add(bottomPlate);

    // Top Plate (Positive Polarity)
    const topPlate = createCasimirPlate(12, 0.5);
    topPlate.rotation.x = Math.PI; // Face downwards
    topPlate.position.y = CENTER_HEIGHT + 2;
    casimirGroup.add(topPlate);

    // High frequency energy arcs between plates
    const arcGeo = new THREE.CylinderGeometry(10, 10, 4, 32, 16, true);
    const arcMesh = new THREE.Mesh(arcGeo, energyArcMaterial);
    arcMesh.position.y = CENTER_HEIGHT;
    casimirGroup.add(arcMesh);

    parts.push({
        name: "Casimir Resonance Plates",
        description: "Astrometrically flat super-conductor plates brought to Planck-scale proximity.",
        material: "Quantum Super-Conductor",
        function: "Exploits the Casimir effect to squeeze vacuum fluctuations into extractable macroscopic energy.",
        assemblyOrder: 3,
        connections: ["Support Pillars", "Energy Extraction Conduits"],
        failureEffect: "Plate fusion, resulting in infinite mass density spike.",
        cascadeFailures: ["Energy Conduits"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });
    group.add(casimirGroup);

    // --- 4. Upper Containment & Extraction Manifold ---
    const manifoldGroup = new THREE.Group();
    
    const manifoldCoreGeo = new THREE.IcosahedronGeometry(8, 2);
    const manifoldCoreMesh = new THREE.Mesh(manifoldCoreGeo, steel);
    manifoldCoreMesh.position.y = CENTER_HEIGHT + 15;
    manifoldGroup.add(manifoldCoreMesh);

    // Heavy routing pipelines from plates to manifold
    for(let i=0; i<6; i++) {
        const angle = (Math.PI*2*i) / 6;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*10, CENTER_HEIGHT + 4, Math.sin(angle)*10),
            new THREE.Vector3(Math.cos(angle)*15, CENTER_HEIGHT + 8, Math.sin(angle)*15),
            new THREE.Vector3(Math.cos(angle)*8, CENTER_HEIGHT + 15, Math.sin(angle)*8)
        ]);
        const bundle = createPipeBundle(curve, 20, 2);
        manifoldGroup.add(bundle);
    }

    parts.push({
        name: "Energy Extraction Manifold",
        description: "Geodesic containment vessel where raw vacuum energy is normalized into usable plasma.",
        material: "Steel, Copper, Super-conductors",
        function: "Collects, normalizes, and distributes the infinite energy bleed.",
        assemblyOrder: 4,
        connections: ["Casimir Chamber", "Grid Uplink Cables"],
        failureEffect: "Energy backlash, instantly vaporizing the surrounding hemisphere.",
        cascadeFailures: ["Grid Uplink Cables"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });
    group.add(manifoldGroup);

    // --- 5. Massive Heat Sink Array ---
    const heatSinkGroup = new THREE.Group();
    const sinkGeo = new THREE.BoxGeometry(4, 20, 10);
    for(let i=0; i<8; i++) {
        const angle = (Math.PI*2*i) / 8;
        const sinkMesh = new THREE.Mesh(sinkGeo, aluminum);
        sinkMesh.position.set(Math.cos(angle)*20, CENTER_HEIGHT + 15, Math.sin(angle)*20);
        sinkMesh.lookAt(0, CENTER_HEIGHT + 15, 0);
        
        // Add extreme fins to each sink block
        for(let f=0; f<20; f++) {
            const finGeo = new THREE.BoxGeometry(4.2, 0.2, 10.2);
            const finMesh = new THREE.Mesh(finGeo, chrome);
            finMesh.position.y = -9.5 + (f * 1.0);
            sinkMesh.add(finMesh);
        }
        heatSinkGroup.add(sinkMesh);
    }

    parts.push({
        name: "Zero-K Cryogenic Heat Sinks",
        description: "Massive aluminum-chrome fin arrays pumping liquid helium at near zero Kelvin.",
        material: "Aluminum, Chromium",
        function: "Dissipates the immense thermodynamic waste generated by violating entropy.",
        assemblyOrder: 5,
        connections: ["Manifold"],
        failureEffect: "Thermal runaway, melting the Casimir plates.",
        cascadeFailures: ["Casimir Chamber"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 30, y: 0, z: 30}
    });
    group.add(heatSinkGroup);

    // --- 6. Observation Deck & Control Cabin ---
    const deckGroup = new THREE.Group();
    
    // Annular ring catwalk
    const catwalkGeo = new THREE.RingGeometry(30, 36, 64);
    const catwalkMesh = new THREE.Mesh(catwalkGeo, steel);
    catwalkMesh.rotation.x = -Math.PI / 2;
    catwalkMesh.position.y = 15;
    deckGroup.add(catwalkMesh);

    // Railings
    const railOuterGeo = new THREE.TorusGeometry(36, 0.2, 8, 64);
    const railOuterMesh = new THREE.Mesh(railOuterGeo, aluminum);
    railOuterMesh.rotation.x = Math.PI / 2;
    railOuterMesh.position.y = 16.5;
    deckGroup.add(railOuterMesh);

    const railInnerGeo = new THREE.TorusGeometry(30, 0.2, 8, 64);
    const railInnerMesh = new THREE.Mesh(railInnerGeo, aluminum);
    railInnerMesh.rotation.x = Math.PI / 2;
    railInnerMesh.position.y = 16.5;
    deckGroup.add(railInnerMesh);

    // Control Cabin
    const cabinGroup = new THREE.Group();
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(0,0);
    cabinShape.lineTo(8,0);
    cabinShape.lineTo(10,5);
    cabinShape.lineTo(-2,5);
    
    const cabinExtrude = { depth: 10, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinExtrude);
    const cabinMesh = new THREE.Mesh(cabinGeo, darkSteel);
    cabinMesh.position.set(32, 15, -5);
    cabinMesh.rotation.y = -Math.PI/2;
    cabinGroup.add(cabinMesh);

    // Tinted Glass window
    const windowGeo = new THREE.PlaneGeometry(11, 4);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(31.8, 17.5, 0);
    windowMesh.rotation.y = -Math.PI/2 - 0.2;
    cabinGroup.add(windowMesh);

    deckGroup.add(cabinGroup);

    parts.push({
        name: "Observation Deck & Control Cabin",
        description: "Heavily shielded operations center hanging precariously close to the void core.",
        material: "Steel, Tinted Glass, Dark Steel",
        function: "Houses scientists monitoring quantum output and stabilization telemetry.",
        assemblyOrder: 6,
        connections: ["Support Pillars"],
        failureEffect: "Operator insanity from viewing unshielded vacuum fluctuations.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -40, y: 10, z: 0}
    });
    group.add(deckGroup);

    // --- 7. Hydraulic Actuation Dampeners ---
    const dampenerGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const cylG = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
        const cylM = new THREE.Mesh(cylG, darkSteel);
        
        const pistonG = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
        const pistonM = new THREE.Mesh(pistonG, chrome);
        pistonM.position.y = 5;
        
        const dPivot = new THREE.Group();
        dPivot.add(cylM);
        dPivot.add(pistonM);
        
        dPivot.position.set(Math.cos(angle)*16, CENTER_HEIGHT-6, Math.sin(angle)*16);
        dPivot.rotation.x = Math.PI / 4;
        dPivot.rotation.y = -angle;
        
        dampenerGroup.add(dPivot);
        
        // Save for animation
        updatables.push({
            mesh: pistonM,
            type: 'piston',
            baseY: 5,
            speed: 10 + Math.random() * 5,
            offset: Math.random() * Math.PI * 2
        });
    }

    parts.push({
        name: "Heavy Hydraulic Dampeners",
        description: "Titanium-cased industrial hydraulics bracing the Casimir chamber.",
        material: "Dark Steel, Chromium",
        function: "Absorbs violent kinetic shocks resulting from micro-explosions in the vacuum field.",
        assemblyOrder: 7,
        connections: ["Casimir Chamber", "Support Pillars"],
        failureEffect: "Vibrational tearing of the support structure.",
        cascadeFailures: ["Support Pillars", "Foundation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 20}
    });
    group.add(dampenerGroup);

    // --- 8. Power Grid Uplink Towers ---
    const uplinkGroup = new THREE.Group();
    const towerGeo = new THREE.CylinderGeometry(1, 2, 30, 8);
    for(let i=0; i<3; i++) {
        const angle = (Math.PI*2*i)/3 + Math.PI/6;
        const towerMesh = new THREE.Mesh(towerGeo, steel);
        towerMesh.position.set(Math.cos(angle)*45, 5, Math.sin(angle)*45);
        
        // Add tesla-coil like rings to tower
        for(let r=0; r<5; r++) {
            const trGeo = new THREE.TorusGeometry(2.5 - r*0.2, 0.2, 16, 32);
            const trMesh = new THREE.Mesh(trGeo, copper);
            trMesh.position.y = 5 + r*3;
            trMesh.rotation.x = Math.PI/2;
            towerMesh.add(trMesh);
        }

        uplinkGroup.add(towerMesh);
        
        // Cabling to manifold
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*45, 20, Math.sin(angle)*45),
            new THREE.Vector3(Math.cos(angle)*25, CENTER_HEIGHT + 20, Math.sin(angle)*25),
            new THREE.Vector3(0, CENTER_HEIGHT + 15, 0)
        ]);
        const cableGeo = new THREE.TubeGeometry(cableCurve, 64, 0.5, 8, false);
        const cableMesh = new THREE.Mesh(cableGeo, rubber);
        uplinkGroup.add(cableMesh);
    }

    parts.push({
        name: "High-Voltage Uplink Towers",
        description: "Massive transmission pylons stepped with transformer coils.",
        material: "Steel, Copper, Rubber",
        function: "Steps down infinite dimensional energy into standard planetary grid voltage.",
        assemblyOrder: 8,
        connections: ["Manifold", "External Power Grid"],
        failureEffect: "Catastrophic power surge frying the planetary electrical grid.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 50, y: 0, z: -50}
    });
    group.add(uplinkGroup);

    // --- 9. Dimensional Anchor Spikes ---
    const anchorGroup = new THREE.Group();
    const spikeGeo = new THREE.ConeGeometry(3, 15, 4);
    for(let i=0; i<4; i++) {
        const angle = (Math.PI*2*i)/4;
        const spikeMesh = new THREE.Mesh(spikeGeo, emissivePurple);
        spikeMesh.position.set(Math.cos(angle)*30, -5, Math.sin(angle)*30);
        spikeMesh.rotation.x = Math.PI; // point down
        
        const housingG = new THREE.BoxGeometry(5, 5, 5);
        const housingM = new THREE.Mesh(housingG, darkSteel);
        housingM.position.y = 7.5;
        spikeMesh.add(housingM);

        anchorGroup.add(spikeMesh);
    }

    parts.push({
        name: "Dimensional Anchor Spikes",
        description: "Tachyon-infused spikes driven into the local spacetime metric.",
        material: "Dark Steel, Emissive Void Crystals",
        function: "Prevents the facility from drifting into alternate dimensions during extraction.",
        assemblyOrder: 9,
        connections: ["Foundation"],
        failureEffect: "Machine phases out of reality.",
        cascadeFailures: ["Foundation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: -30, z: -30}
    });
    group.add(anchorGroup);

    // --- 10. Diagnostics Sensor Array ---
    const sensorGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const sGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
        const sMesh = new THREE.Mesh(sGeo, plastic);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 22;
        sMesh.position.set(r * Math.sin(phi) * Math.cos(theta), CENTER_HEIGHT + r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
        sMesh.lookAt(0, CENTER_HEIGHT, 0);
        sensorGroup.add(sMesh);
    }
    
    parts.push({
        name: "Micro-Sensor Array",
        description: "Thousands of tiny LIDAR and radiation detectors scattered in orbit.",
        material: "Plastic, Electronics",
        function: "Monitors microscopic fluctuations in the Casimir gap.",
        assemblyOrder: 10,
        connections: [],
        failureEffect: "Loss of telemetry.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 60, z: 0}
    });
    group.add(sensorGroup);

    // ============================================================================
    // ANIMATION LOOP
    // ============================================================================

    const animate = (time, speed = 1, meshes) => {
        const t = time * speed;

        // Update shaders
        voidUniforms.time.value = t;
        energyArcUniforms.time.value = t;

        // Animate Quantum Rings
        quantumRings.forEach(ringData => {
            ringData.mesh.rotateOnAxis(ringData.axis, ringData.speed * 0.05 * speed);
        });

        // Vibrate the Casimir Plates immensely
        // They are brought nanometers apart, so the vibration is micro-scale but visually violent
        const vibration = Math.sin(t * 100) * 0.05;
        bottomPlate.position.y = (CENTER_HEIGHT - 2) + vibration;
        topPlate.position.y = (CENTER_HEIGHT + 2) - vibration;

        // Vibrate the energy arc mesh
        arcMesh.scale.set(1.0 + Math.sin(t*50)*0.1, 1.0, 1.0 + Math.cos(t*45)*0.1);
        arcMesh.rotation.y += 0.1 * speed;

        // Pulsate Emissive purple materials
        emissivePurple.emissiveIntensity = 2.0 + Math.sin(t * 5) * 1.5;

        // Hydraulic Pistons pumping rapidly
        updatables.forEach(item => {
            if(item.type === 'piston') {
                item.mesh.position.y = item.baseY + Math.sin(t * item.speed + item.offset) * 1.5;
            }
        });

        // Rotate the massive manifold slowly
        manifoldCoreMesh.rotation.y = t * 0.2;
        manifoldCoreMesh.rotation.z = t * 0.1;
    };

    // ============================================================================
    // QUIZ QUESTIONS (PhD Level)
    // ============================================================================

    const quizQuestions = [
        {
            question: "In the context of the Casimir effect between perfectly conducting parallel plates, how does the Zeta function regularization technique mathematically resolve the divergence of the vacuum zero-point energy sum?",
            options: [
                "By introducing a high-frequency cutoff exponential factor and evaluating the analytic continuation of the Riemann zeta function to s = -3.",
                "By factoring out the infinite volume of spacetime using the Pauli-Villars regularization.",
                "By applying the Bekenstein bound to restrict the number of allowable modes in the cavity.",
                "By renormalizing the bare mass of the photons participating in the virtual pair creation."
            ],
            correctAnswer: 0,
            explanation: "Zeta function regularization assigns a finite value to the divergent sum $\\sum n^3$ by relating it to $\\zeta(-3) = 1/120$, providing a mathematically rigorous way to extract the finite observable energy density without relying on arbitrary cutoff functions."
        },
        {
            question: "Under the framework of Quantum Field Theory in curved spacetime, how does the Unruh effect relate the particle number operator of a Minkowski observer to that of an accelerating Rindler observer?",
            options: [
                "They share identical vacuum states, but the Rindler observer experiences time dilation.",
                "The Minkowski vacuum is perceived by the Rindler observer as a thermal bath of particles following a Bose-Einstein distribution with temperature proportional to acceleration.",
                "The Rindler observer detects an inverted spectrum of negative energy states due to the breakdown of Poincaré invariance.",
                "The particle number operator is invariant, but the energy eigenvalues undergo a continuous redshift."
            ],
            correctAnswer: 1,
            explanation: "The Unruh effect demonstrates that the concept of a 'particle' is observer-dependent; a uniformly accelerating observer in the Minkowski vacuum will perceive a thermal bath of radiation at temperature $T = \\hbar a / (2\\pi k_B c)$."
        },
        {
            question: "Which quantum electrodynamical (QED) phenomenon describes the non-perturbative creation of electron-positron pairs from the vacuum under the influence of an extremely strong, constant electric field (approaching $10^{18}$ V/m)?",
            options: [
                "The Hawking Radiation limit",
                "The Schwinger Mechanism",
                "The Casimir-Polder interaction",
                "The Aharonov-Bohm effect"
            ],
            correctAnswer: 1,
            explanation: "The Schwinger mechanism is a predicted non-perturbative effect in QED where a static electric field stronger than the Schwinger limit causes the vacuum to become unstable and spontaneously decay into electron-positron pairs."
        },
        {
            question: "How does the holographic principle, specifically the Bekenstein bound, theoretically limit the maximal amount of information (and thus entropy) that can be contained within the void energy extracted from a bounded spherical region of radius R?",
            options: [
                "The entropy is strictly proportional to the volume of the sphere $R^3$.",
                "The entropy cannot exceed the entropy of a black hole of the same radius, proportional to the surface area $R^2$.",
                "The entropy is infinite unless dynamically suppressed by string theory compactifications.",
                "The entropy is limited by the number of baryons inside the region, ignoring vacuum fluctuations."
            ],
            correctAnswer: 1,
            explanation: "The Bekenstein bound states that the maximum entropy within a region of space is proportional to its boundary area, not its volume, leading to the profound conclusion that the degrees of freedom of a spatial region scale with its area."
        },
        {
            question: "In topological quantum field theory, what is the significance of the Chern-Simons form when describing the complex vacuum structure (θ-vacua) of non-Abelian gauge theories?",
            options: [
                "It serves as a mass term for gauge bosons without breaking gauge invariance.",
                "It defines the topological winding number (Pontryagin index) of gauge field configurations, characterizing the tunneling between topologically distinct vacuum states via instantons.",
                "It eliminates the ultraviolet divergences in the perturbative expansion of the S-matrix.",
                "It represents the kinetic energy of fermions coupled to the vacuum."
            ],
            correctAnswer: 1,
            explanation: "The integral of the Chern-Simons form over the boundary of spacetime gives the winding number of the gauge field, classifying the topologically distinct vacuum sectors in theories like QCD, which are connected by instanton tunneling."
        }
    ];

    return { group, parts, description: "God-Tier Zero-Point Void Energy Extractor", quizQuestions, animate };
}
