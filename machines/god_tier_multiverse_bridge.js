import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------------------
    // CUSTOM MATERIALS & SHADERS
    // -------------------------------------------------------------------------

    const exoticMatterGlow = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.8
    });

    const tachyonBeamGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const darkMatterMaterial = new THREE.MeshStandardMaterial({
        color: 0x050505,
        emissive: 0x000000,
        roughness: 0.9,
        metalness: 0.1
    });

    const goldTrim = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0x332200,
        roughness: 0.2,
        metalness: 1.0
    });

    const portalVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        void main() {
            vUv = uv;
            vPosition = position;
            // Introduce a gravitational lensing warp effect at the edges
            float dist = distance(uv, vec2(0.5));
            vec3 pos = position;
            if (dist < 0.5) {
                float warp = sin(dist * 20.0 - time * 5.0) * 0.1;
                pos.z += warp;
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const portalFragmentShader = `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // 3D Noise function for nebula effects
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) { 
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
            i = mod289(i); 
            vec4 p = permute( permute( permute( 
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                      + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                      + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 1.0/7.0; 
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m; return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vec2 center = vec2(0.5, 0.5);
            vec2 uv = vUv - center;
            float radius = length(uv);
            float angle = atan(uv.y, uv.x);
            
            if (radius > 0.5) {
                discard; // Only draw inside the ring
            }
            
            // Accretion disk math
            float r2 = pow(radius, 0.1);
            float swirl = angle + (2.0 / (radius + 0.1)) - time * 3.0;
            vec2 warpedUv = vec2(cos(swirl), sin(swirl)) * radius;
            
            // Nebula noise layers
            float n1 = snoise(vec3(warpedUv * 10.0, time * 0.2));
            float n2 = snoise(vec3(warpedUv * 20.0 - time * 0.5, time * 0.1));
            float n3 = snoise(vec3(warpedUv * 40.0 + time, time * 0.05));
            
            float fbm = n1 * 0.5 + n2 * 0.25 + n3 * 0.125;
            
            // Core singularity
            float core = smoothstep(0.1, 0.0, radius);
            
            // Event horizon ring glow
            float horizon = smoothstep(0.48, 0.5, radius);
            
            // Color mapping: Negative energy universe (Violet/Cyan/Deep Blue)
            vec3 color = vec3(0.05, 0.0, 0.1); // Deep void
            color = mix(color, vec3(0.1, 0.8, 1.0), smoothstep(0.0, 1.0, fbm)); // Cyan nebula
            color = mix(color, vec3(0.6, 0.0, 1.0), smoothstep(0.5, 1.0, fbm * fbm)); // Violet energy
            
            // Add stars
            float starNoise = snoise(vec3(uv * 150.0, 0.0));
            float stars = smoothstep(0.95, 1.0, starNoise) * (1.0 - horizon);
            color += vec3(stars);
            
            // Singularity blackness + event horizon light ring
            color = mix(color, vec3(0.0), core);
            color = mix(color, vec3(1.0, 0.5, 0.0), horizon * 2.0); // Hawking radiation ring
            
            // Dark matter rim
            float edgeFade = smoothstep(0.49, 0.5, radius);
            color = mix(color, vec3(0.0), edgeFade);
            
            gl_FragColor = vec4(color, 1.0 - edgeFade);
        }
    `;

    const portalUniforms = {
        time: { value: 0.0 }
    };

    const portalMaterial = new THREE.ShaderMaterial({
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
        uniforms: portalUniforms,
        transparent: true,
        side: THREE.DoubleSide
    });

    // -------------------------------------------------------------------------
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // -------------------------------------------------------------------------

    function createGearShape(teeth, outerRadius, innerRadius) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const angle1 = i * step;
            const angle2 = angle1 + step / 2;
            shape.lineTo(Math.cos(angle1) * outerRadius, Math.sin(angle1) * outerRadius);
            shape.lineTo(Math.cos(angle2) * innerRadius, Math.sin(angle2) * innerRadius);
        }
        shape.lineTo(Math.cos(0) * outerRadius, Math.sin(0) * outerRadius);
        return shape;
    }

    function createIntricateLugs(radius, count, width, depth, material) {
        const lugGroup = new THREE.Group();
        const lugGeo = new THREE.BoxGeometry(width, depth, width * 2);
        for (let i = 0; i < count; i++) {
            const theta = (i / count) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, material);
            lug.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
            lug.rotation.z = theta;
            lugGroup.add(lug);
        }
        return lugGroup;
    }

    function createFractalAntenna(scale) {
        const group = new THREE.Group();
        const geo = new THREE.OctahedronGeometry(scale, 1);
        const mesh = new THREE.Mesh(geo, goldTrim);
        group.add(mesh);
        
        for(let i=0; i<4; i++) {
            const subMesh = new THREE.Mesh(geo, tachyonBeamGlow);
            subMesh.scale.set(0.5, 0.5, 0.5);
            subMesh.position.set(
                (i%2 === 0 ? scale : -scale),
                (i<2 ? scale : -scale),
                0
            );
            group.add(subMesh);
        }
        return group;
    }

    // -------------------------------------------------------------------------
    // 1. BASE PLATFORM (Multi-tier hexagonal array)
    // -------------------------------------------------------------------------
    
    const baseGroup = new THREE.Group();
    
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        hexShape.lineTo(Math.cos(angle) * 300, Math.sin(angle) * 300);
    }
    hexShape.lineTo(Math.cos(0) * 300, Math.sin(0) * 300);
    
    // Base Tier 1
    const baseGeo1 = new THREE.ExtrudeGeometry(hexShape, { depth: 20, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 5, bevelThickness: 5 });
    const baseMesh1 = new THREE.Mesh(baseGeo1, darkSteel);
    baseMesh1.rotation.x = Math.PI / 2;
    baseMesh1.position.y = -50;
    baseGroup.add(baseMesh1);

    // Base Tier 2 (Inner ring structure)
    const baseShape2 = new THREE.Shape();
    baseShape2.absarc(0, 0, 200, 0, Math.PI * 2, false);
    const baseHole = new THREE.Path();
    baseHole.absarc(0, 0, 180, 0, Math.PI * 2, true);
    baseShape2.holes.push(baseHole);
    
    const baseGeo2 = new THREE.ExtrudeGeometry(baseShape2, { depth: 40, bevelEnabled: true });
    const baseMesh2 = new THREE.Mesh(baseGeo2, steel);
    baseMesh2.rotation.x = Math.PI / 2;
    baseMesh2.position.y = -30;
    baseGroup.add(baseMesh2);

    meshes.basePlatform = baseGroup;
    group.add(baseGroup);

    parts.push({
        name: 'Containment_Base_Platform',
        description: 'A colossal hexagonal substructure forged from dense collapsed-star dark steel. Provides gravitational anchoring for the enormous stress-energy tensor generated by the wormhole. Houses the primary antimatter circulation pumps.',
        material: 'Dark Steel / Titanium Alloy',
        function: 'Structural stabilization and macro-gravitational anchoring.',
        assemblyOrder: 1,
        connections: ['Reality_Tether_Anchors', 'Singularity_Core_Housing'],
        failureEffect: 'Catastrophic structural failure leading to immediate base collapse and spaghettification of the local facility.',
        cascadeFailures: ['Spacetime_Fracture_Containment_Nodes'],
        originalPosition: { x: 0, y: -30, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 2. REALITY TETHER ANCHORS (Massive mechanical claws holding the base)
    // -------------------------------------------------------------------------
    const anchorGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        
        const clawGroup = new THREE.Group();
        
        // Piston housing
        const housingGeo = new THREE.CylinderGeometry(15, 15, 80, 16);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.position.set(0, 40, 0);
        
        // Piston rod
        const rodGeo = new THREE.CylinderGeometry(8, 8, 100, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.set(0, 90, 0);
        
        // Claw grip
        const gripGeo = new THREE.BoxGeometry(40, 20, 60);
        const grip = new THREE.Mesh(gripGeo, steel);
        grip.position.set(0, -10, 30);
        
        clawGroup.add(housing);
        clawGroup.add(rod);
        clawGroup.add(grip);
        
        clawGroup.position.set(Math.cos(angle) * 310, -50, Math.sin(angle) * 310);
        
        // Look away from center
        clawGroup.rotation.y = -angle;
        clawGroup.rotation.x = -Math.PI / 4; // Angle downwards into the earth
        
        anchorGroup.add(clawGroup);
    }
    meshes.realityAnchors = anchorGroup;
    group.add(anchorGroup);

    parts.push({
        name: 'Reality_Tether_Anchors',
        description: 'Six massive hydraulic anchors employing Casimir-effect dampeners. They lock the physical platform to the absolute coordinate frame of the local universe, resisting the extreme pull of the dimensional rift.',
        material: 'Chrome / High-Tensile Steel',
        function: 'Counteracts dimensional drift and spatial warping forces.',
        assemblyOrder: 2,
        connections: ['Containment_Base_Platform'],
        failureEffect: 'The entire facility is pulled violently into the event horizon.',
        cascadeFailures: ['Dimensional_Drift_Compensators'],
        originalPosition: { x: 0, y: -50, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 3. SINGULARITY CORE HOUSING (Underneath)
    // -------------------------------------------------------------------------
    const coreHousingGeo = new THREE.SphereGeometry(60, 64, 64, 0, Math.PI*2, 0.5, Math.PI);
    const coreHousing = new THREE.Mesh(coreHousingGeo, copper);
    coreHousing.position.y = -50;
    coreHousing.rotation.x = Math.PI; // Upside down dome
    
    // Add glowing heat vents
    const ventGeo = new THREE.TorusGeometry(40, 5, 16, 64);
    const ventMesh = new THREE.Mesh(ventGeo, exoticMatterGlow);
    ventMesh.rotation.x = Math.PI / 2;
    ventMesh.position.y = -90;
    coreHousing.add(ventMesh);

    meshes.singularityCore = coreHousing;
    group.add(coreHousing);

    parts.push({
        name: 'Singularity_Core_Housing',
        description: 'An inverted copper-alloy geodesic dome housing a micro-kugelblitz (a black hole formed from light). This provides the immense continuous power output (approx 10^32 Watts) required to sustain the wormhole.',
        material: 'Copper / Exotic Matter',
        function: 'Primary power generation via Hawking radiation harvesting.',
        assemblyOrder: 3,
        connections: ['Containment_Base_Platform', 'Hawking_Radiation_Vents'],
        failureEffect: 'Micro-singularity expands and consumes the planet.',
        cascadeFailures: ['Event_Horizon_Manifold'],
        originalPosition: { x: 0, y: -50, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 4. EVENT HORIZON MANIFOLD (The Portal Surface)
    // -------------------------------------------------------------------------
    // We place this strictly in the center, vertical.
    const portalRadius = 120;
    const portalGeo = new THREE.PlaneGeometry(portalRadius * 2, portalRadius * 2, 64, 64);
    const portalMesh = new THREE.Mesh(portalGeo, portalMaterial);
    portalMesh.position.y = 150; // Elevate above base
    meshes.portal = portalMesh;
    group.add(portalMesh);

    parts.push({
        name: 'Event_Horizon_Manifold',
        description: 'The 2D projection of the 3D spherical throat of the Einstein-Rosen bridge. Governed by a custom spacetime metric allowing bidirectional traversal. Visually represented by a complex fractal GLSL shader simulating a different universe.',
        material: 'Pure Spacetime (Custom Shader)',
        function: 'The actual gateway for matter transition.',
        assemblyOrder: 15,
        connections: ['Exotic_Matter_Ring_Core'],
        failureEffect: 'Portal collapses into a lethal singularity; traversing matter is annihilated.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 500 } // pushes forward in exploded view
    });

    // -------------------------------------------------------------------------
    // 5. EXOTIC MATTER RING CORE
    // -------------------------------------------------------------------------
    const ringCoreGroup = new THREE.Group();
    ringCoreGroup.position.y = 150;
    
    // Main Torus
    const coreTorusGeo = new THREE.TorusGeometry(portalRadius, 15, 64, 128);
    const coreTorus = new THREE.Mesh(coreTorusGeo, darkMatterMaterial);
    ringCoreGroup.add(coreTorus);

    // Add intense geometry detailing (Lugs, Pipes, Nodes on the ring itself)
    const ringLugs = createIntricateLugs(portalRadius, 72, 8, 20, steel);
    ringCoreGroup.add(ringLugs);

    // Inner glowing exotic matter ring
    const innerExoticGeo = new THREE.TorusGeometry(portalRadius - 5, 4, 32, 128);
    const innerExotic = new THREE.Mesh(innerExoticGeo, exoticMatterGlow);
    ringCoreGroup.add(innerExotic);

    meshes.ringCore = ringCoreGroup;
    group.add(ringCoreGroup);

    parts.push({
        name: 'Exotic_Matter_Ring_Core',
        description: 'A colossal torus constructed from dense dark matter composites, infused with a constant stream of negative-mass exotic matter to keep the wormhole throat open and prevent topological censorship.',
        material: 'Dark Matter / Steel / Exotic Matter',
        function: 'Maintains throat stability via negative energy density.',
        assemblyOrder: 10,
        connections: ['Event_Horizon_Manifold', 'Matter_Injection_Conduits'],
        failureEffect: 'Throat pinches off instantly, crushing anything inside to infinite density.',
        cascadeFailures: ['Event_Horizon_Manifold', 'Gyroscopic_Stabilizer_Ring_Alpha'],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 6 & 7. GYROSCOPIC STABILIZER RINGS (Alpha and Beta)
    // -------------------------------------------------------------------------
    const gyroAlphaGroup = new THREE.Group();
    const gyroBetaGroup = new THREE.Group();
    gyroAlphaGroup.position.y = 150;
    gyroBetaGroup.position.y = 150;

    // Alpha Ring (Vertical Axis rotation)
    const alphaGeo = new THREE.TorusGeometry(portalRadius + 30, 8, 32, 128);
    const alphaMesh = new THREE.Mesh(alphaGeo, aluminum);
    const alphaRunes = createIntricateLugs(portalRadius + 30, 36, 12, 10, goldTrim);
    gyroAlphaGroup.add(alphaMesh);
    gyroAlphaGroup.add(alphaRunes);
    
    // Alpha track
    const alphaTrackGeo = new THREE.TorusGeometry(portalRadius + 30, 2, 16, 128);
    const alphaTrack = new THREE.Mesh(alphaTrackGeo, tachyonBeamGlow);
    gyroAlphaGroup.add(alphaTrack);

    // Beta Ring (Horizontal Axis rotation)
    const betaGeo = new THREE.TorusGeometry(portalRadius + 55, 6, 32, 128);
    const betaMesh = new THREE.Mesh(betaGeo, copper);
    const betaRunes = createIntricateLugs(portalRadius + 55, 24, 6, 15, chrome);
    gyroBetaGroup.add(betaMesh);
    gyroBetaGroup.add(betaRunes);

    // Beta Track
    const betaTrackGeo = new THREE.TorusGeometry(portalRadius + 55, 2, 16, 128);
    const betaTrack = new THREE.Mesh(betaTrackGeo, exoticMatterGlow);
    gyroBetaGroup.add(betaTrack);

    meshes.gyroAlpha = gyroAlphaGroup;
    meshes.gyroBeta = gyroBetaGroup;
    group.add(gyroAlphaGroup);
    group.add(gyroBetaGroup);

    parts.push({
        name: 'Gyroscopic_Stabilizer_Ring_Alpha',
        description: 'The inner gyroscopic stabilizer ring. Rotates at relativistic speeds to generate a frame-dragging effect (Lense-Thirring precession) that aligns the local spacetime vectors with the wormhole topology.',
        material: 'Aluminum / Gold',
        function: 'Spacetime frame-dragging and topological alignment.',
        assemblyOrder: 11,
        connections: ['Exotic_Matter_Ring_Core', 'Gyroscopic_Stabilizer_Ring_Beta'],
        failureEffect: 'Severe spatial shear forces tearing traversing objects into distinct quantum states.',
        cascadeFailures: ['Dimensional_Drift_Compensators'],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 300, y: 150, z: 0 }
    });

    parts.push({
        name: 'Gyroscopic_Stabilizer_Ring_Beta',
        description: 'The outer stabilizer ring. Induces a massive counter-rotational magnetic field to prevent the Alpha ring from instantly disintegrating due to centrifugal forces at relativistic speeds.',
        material: 'Copper / Chrome / Exotic Matter',
        function: 'Counter-rotational magnetic confinement.',
        assemblyOrder: 12,
        connections: ['Gyroscopic_Stabilizer_Ring_Alpha'],
        failureEffect: 'Alpha ring shatters, launching relativistic shrapnel across the hemisphere.',
        cascadeFailures: ['Chronosphere_Control_Spire'],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: -300, y: 150, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 8. NEGATIVE ENERGY PYLONS
    // -------------------------------------------------------------------------
    const pylonGroup = new THREE.Group();
    const numPylons = 8;
    const pylonDistance = 220;

    meshes.pylons = [];
    meshes.pylonCrystals = [];

    for (let i = 0; i < numPylons; i++) {
        const angle = (i / numPylons) * Math.PI * 2;
        const pylon = new THREE.Group();

        // Pylon Base
        const pBaseGeo = new THREE.CylinderGeometry(25, 35, 40, 8);
        const pBase = new THREE.Mesh(pBaseGeo, steel);
        pBase.position.y = 20;
        
        // Pylon Shaft (Complex Extrusion)
        const shaftGeo = new THREE.CylinderGeometry(15, 20, 180, 8);
        const shaft = new THREE.Mesh(shaftGeo, darkSteel);
        shaft.position.y = 130;

        // Energy Core (Inner Tube)
        const coreGeo = new THREE.CylinderGeometry(5, 5, 180, 16);
        const core = new THREE.Mesh(coreGeo, tachyonBeamGlow);
        core.position.y = 130;

        // Pylon Cap
        const capGeo = new THREE.CylinderGeometry(20, 25, 20, 8);
        const cap = new THREE.Mesh(capGeo, copper);
        cap.position.y = 230;

        // Floating Crystal
        const crystalGeo = new THREE.OctahedronGeometry(15, 0);
        const crystal = new THREE.Mesh(crystalGeo, exoticMatterGlow);
        crystal.position.y = 270;
        crystal.scale.set(1, 2, 1);
        meshes.pylonCrystals.push(crystal); // Save for animation

        pylon.add(pBase);
        pylon.add(shaft);
        pylon.add(core);
        pylon.add(cap);
        pylon.add(crystal);

        pylon.position.set(Math.cos(angle) * pylonDistance, -30, Math.sin(angle) * pylonDistance);
        pylon.rotation.y = -angle; // Face outward/inward
        
        pylonGroup.add(pylon);
        meshes.pylons.push(pylon);
    }
    
    group.add(pylonGroup);

    parts.push({
        name: 'Negative_Energy_Pylons',
        description: 'Eight colossal obelisks arrayed around the event horizon. These project beams of focused negative energy generated via extreme Casimir cavities to dilate the wormhole throat.',
        material: 'Dark Steel / Copper / Tachyon Cores',
        function: 'Injection of negative energy density into the gateway.',
        assemblyOrder: 5,
        connections: ['Containment_Base_Platform', 'Pylon_Focusing_Crystals'],
        failureEffect: 'Energy imbalance causes wormhole to fluctuate, leading to unpredictable temporal displacement of travelers.',
        cascadeFailures: ['Exotic_Matter_Ring_Core'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 } // Move up conceptually
    });

    parts.push({
        name: 'Pylon_Focusing_Crystals',
        description: 'Levitating synthetic dilithium-quartz matrices situated atop each pylon. They hyper-focus the negative energy beams directly into the center of the event horizon.',
        material: 'Exotic Matter Matrix',
        function: 'Energy beam collimation and targeting.',
        assemblyOrder: 6,
        connections: ['Negative_Energy_Pylons'],
        failureEffect: 'Beams scatter, irradiating the facility with lethal tachyon bursts.',
        cascadeFailures: ['Quantum_State_Decoherence_Monitors'],
        originalPosition: { x: 0, y: 270, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 9. TACHYON EMISSION ARRAY (Beam connections)
    // -------------------------------------------------------------------------
    const beamsGroup = new THREE.Group();
    meshes.beams = [];
    for (let i = 0; i < numPylons; i++) {
        const angle = (i / numPylons) * Math.PI * 2;
        
        // Beam from crystal to center of portal
        const distance = Math.sqrt(Math.pow(pylonDistance, 2) + Math.pow(270 - 150, 2));
        const beamGeo = new THREE.CylinderGeometry(2, 6, distance, 16);
        
        // Translate geometry so origin is at bottom
        beamGeo.translate(0, distance/2, 0);
        
        const beam = new THREE.Mesh(beamGeo, tachyonBeamGlow);
        beam.position.set(Math.cos(angle) * pylonDistance, 240, Math.sin(angle) * pylonDistance);
        
        // Look at center (0, 150, 0)
        beam.lookAt(new THREE.Vector3(0, 150, 0));
        beam.rotateX(Math.PI / 2); // Align cylinder to lookAt
        
        beamsGroup.add(beam);
        meshes.beams.push(beam);
    }
    group.add(beamsGroup);

    parts.push({
        name: 'Tachyon_Emission_Array',
        description: 'The visible manifestation of the negative energy streams. Tachyons are fired backward in time slightly to preemptively stabilize spacetime fluctuations before they occur.',
        material: 'Pure Energy',
        function: 'Retro-causal spacetime stabilization.',
        assemblyOrder: 13,
        connections: ['Pylon_Focusing_Crystals', 'Exotic_Matter_Ring_Core'],
        failureEffect: 'Temporal paradoxes manifest locally, causing causality loops.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 200, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 10. MATTER INJECTION CONDUITS (Complex CatmullRom Curves)
    // -------------------------------------------------------------------------
    const conduitsGroup = new THREE.Group();
    const tubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.8,
        wireframe: false
    });
    
    meshes.conduitPulses = []; // For animating glowing pulses along the tubes
    
    for (let i = 0; i < numPylons; i++) {
        const angle = (i / numPylons) * Math.PI * 2;
        const startX = Math.cos(angle) * pylonDistance * 0.8;
        const startZ = Math.sin(angle) * pylonDistance * 0.8;
        
        const endX = Math.cos(angle) * (portalRadius + 10);
        const endZ = Math.sin(angle) * (portalRadius + 10);
        
        // Create a chaotic, tangled path from base to ring
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX, -20, startZ),
            new THREE.Vector3(startX * 0.5, 40, startZ * 0.5),
            new THREE.Vector3(endX * 1.5, 90, endZ * 1.5),
            new THREE.Vector3(endX, 150, endZ)
        ]);
        
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 4, 16, false);
        const tube = new THREE.Mesh(tubeGeo, glass); // glass so we can see inside
        
        // Inner glowing liquid/matter
        const innerTubeGeo = new THREE.TubeGeometry(curve, 64, 2.5, 8, false);
        const innerTube = new THREE.Mesh(innerTubeGeo, exoticMatterGlow);
        
        conduitsGroup.add(tube);
        conduitsGroup.add(innerTube);
        meshes.conduitPulses.push(innerTube);
        
        // Add secondary smaller tangle pipes
        const curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX+10, -20, startZ-10),
            new THREE.Vector3(startX * 1.2, 60, startZ * 0.2),
            new THREE.Vector3(endX * 0.8, 120, endZ * 1.8),
            new THREE.Vector3(endX, 150, endZ)
        ]);
        const tubeGeo2 = new THREE.TubeGeometry(curve2, 64, 2, 8, false);
        const tube2 = new THREE.Mesh(tubeGeo2, tubeMaterial);
        conduitsGroup.add(tube2);
    }
    
    group.add(conduitsGroup);

    parts.push({
        name: 'Matter_Injection_Conduits',
        description: 'An intricate tangle of ultra-pressurized hyper-glass and adamantium piping. Pumps supercooled liquid exotic matter from the base directly into the Ring Core.',
        material: 'Hyper-Glass / Adamantium',
        function: 'Fuel delivery for the exotic matter ring.',
        assemblyOrder: 7,
        connections: ['Singularity_Core_Housing', 'Exotic_Matter_Ring_Core'],
        failureEffect: 'Rupture causes exotic matter to violently expand, erasing local topography.',
        cascadeFailures: ['Negative_Energy_Pylons'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 200 }
    });

    // -------------------------------------------------------------------------
    // 11. CHRONOSPHERE CONTROL SPIRE
    // -------------------------------------------------------------------------
    const spireGroup = new THREE.Group();
    
    // Spire Tower
    const spireGeo = new THREE.CylinderGeometry(5, 30, 300, 16);
    const spireMesh = new THREE.Mesh(spireGeo, darkSteel);
    spireMesh.position.set(0, 120, -350); // Placed at the back
    spireGroup.add(spireMesh);

    // Control Deck (Floating Disc)
    const deckGeo = new THREE.CylinderGeometry(40, 30, 10, 32);
    const deckMesh = new THREE.Mesh(deckGeo, steel);
    deckMesh.position.set(0, 220, -320); // Extends forward towards ring
    spireGroup.add(deckMesh);
    
    // Command Glass Dome
    const domeGeo = new THREE.SphereGeometry(25, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const domeMesh = new THREE.Mesh(domeGeo, tinted);
    domeMesh.position.set(0, 225, -320);
    spireGroup.add(domeMesh);

    // Spire Antennas / Monitors
    const antenna = createFractalAntenna(15);
    antenna.position.set(0, 290, -350);
    spireGroup.add(antenna);
    meshes.spireAntenna = antenna;

    group.add(spireGroup);

    parts.push({
        name: 'Chronosphere_Control_Spire',
        description: 'A monolithic dark-steel spire situated outside the immediate gravitational exclusion zone. Houses the quantum superposition computers and the brave technicians monitoring the bridge.',
        material: 'Dark Steel / Tinted Glass',
        function: 'Command, control, and quantum metric observation.',
        assemblyOrder: 4,
        connections: ['Containment_Base_Platform'],
        failureEffect: 'Loss of operational control; the gate becomes fully autonomous and untethered.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 120, z: -350 },
        explodedPosition: { x: 0, y: 120, z: -600 }
    });

    // -------------------------------------------------------------------------
    // 12. QUANTUM STATE DECOHERENCE MONITORS
    // -------------------------------------------------------------------------
    const monitorGroup = new THREE.Group();
    const monitorGeo = new THREE.PlaneGeometry(15, 10);
    const monitorMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    // Array of glowing holographic screens around the control deck
    for(let i=0; i<5; i++) {
        const angle = (i/4) * Math.PI - Math.PI/2;
        const screen = new THREE.Mesh(monitorGeo, monitorMat);
        screen.position.set(
            Math.cos(angle) * 35,
            230,
            -320 + Math.sin(angle) * 35
        );
        screen.lookAt(0, 230, -320);
        monitorGroup.add(screen);
    }
    
    group.add(monitorGroup);
    meshes.monitors = monitorGroup;

    parts.push({
        name: 'Quantum_State_Decoherence_Monitors',
        description: 'Holographic arrays that project higher-dimensional probability tensors into 3D space, allowing operators to visualize the multiversal branching probabilities before dialing a destination.',
        material: 'Holographic Plasma',
        function: 'Multiverse targeting and probability rendering.',
        assemblyOrder: 16,
        connections: ['Chronosphere_Control_Spire'],
        failureEffect: 'Blind navigation; extreme risk of materializing inside a stellar core or a false vacuum.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 230, z: -320 },
        explodedPosition: { x: 0, y: 350, z: -400 }
    });

    // -------------------------------------------------------------------------
    // 13. SPACETIME FRACTURE CONTAINMENT NODES
    // -------------------------------------------------------------------------
    const nodeGroup = new THREE.Group();
    meshes.fractureNodes = [];
    const nodeGeo = new THREE.DodecahedronGeometry(8);
    
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const node = new THREE.Mesh(nodeGeo, goldTrim);
        
        // Placed floating just outside the main ring
        const nx = Math.cos(angle) * (portalRadius + 20);
        const ny = 150 + Math.sin(angle * 4) * 20; // Wavy vertical offset
        const nz = Math.sin(angle) * (portalRadius + 20);
        
        node.position.set(nx, ny, nz);
        
        // Add a tiny glowing core to each node
        const coreGeo = new THREE.SphereGeometry(4);
        const core = new THREE.Mesh(coreGeo, tachyonBeamGlow);
        node.add(core);
        
        nodeGroup.add(node);
        meshes.fractureNodes.push(node);
    }
    
    group.add(nodeGroup);

    parts.push({
        name: 'Spacetime_Fracture_Containment_Nodes',
        description: '24 floating dodecahedral nodes acting as topological sutures. They continuously stitch microscopic tears in spacetime that naturally form around the edges of a macroscopic wormhole.',
        material: 'Gold-Plated Emitter Alloys',
        function: 'Micro-fracture healing in the local spacetime manifold.',
        assemblyOrder: 14,
        connections: ['Exotic_Matter_Ring_Core'],
        failureEffect: 'Micro-tears propagate, creating localized zones where time flows backward or stops entirely.',
        cascadeFailures: ['Dimensional_Drift_Compensators'],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 } // Expanded via scale in animate ideally, but static pos here
    });

    // -------------------------------------------------------------------------
    // 14. DIMENSIONAL DRIFT COMPENSATORS (Giant Gears)
    // -------------------------------------------------------------------------
    const gearGroup = new THREE.Group();
    meshes.gears = [];
    
    const gearGeo = new THREE.ExtrudeGeometry(createGearShape(12, 40, 30), { depth: 10, bevelEnabled: true });
    
    // Place gears at the bases of the pylons to look industrial/high-tech
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        const gear = new THREE.Mesh(gearGeo, copper);
        gear.rotation.x = Math.PI / 2;
        gear.position.set(
            Math.cos(angle) * 150,
            -10,
            Math.sin(angle) * 150
        );
        gearGroup.add(gear);
        meshes.gears.push({ mesh: gear, speed: (i%2 === 0 ? 1 : -1) });
    }
    
    group.add(gearGroup);

    parts.push({
        name: 'Dimensional_Drift_Compensators',
        description: 'Massive chronometal gearworks embedded in the base. They physically adjust the resonance frequency of the platform to match the ever-shifting vibrational signature of the target universe.',
        material: 'Chronometal / Copper',
        function: 'Resonance frequency matching across multiverse branes.',
        assemblyOrder: 8,
        connections: ['Containment_Base_Platform'],
        failureEffect: 'Destructive interference between realities, shattering matter on an atomic level.',
        cascadeFailures: ['Matter_Injection_Conduits'],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 15. HAWKING RADIATION VENTS
    // -------------------------------------------------------------------------
    const ventGroup = new THREE.Group();
    meshes.vents = [];
    const hVentGeo = new THREE.CylinderGeometry(15, 25, 40, 16);
    
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const vent = new THREE.Mesh(hVentGeo, chrome);
        vent.position.set(
            Math.cos(angle) * 250,
            -30,
            Math.sin(angle) * 250
        );
        vent.rotation.x = Math.PI/4; // Angled outwards
        vent.rotation.y = -angle;
        
        // Inner glow
        const glow = new THREE.Mesh(new THREE.CylinderGeometry(10, 20, 42, 16), tachyonBeamGlow);
        vent.add(glow);
        
        ventGroup.add(vent);
        meshes.vents.push(vent);
    }
    
    group.add(ventGroup);

    parts.push({
        name: 'Hawking_Radiation_Vents',
        description: 'Exhaust manifolds that safely bleed off the excess Hawking radiation generated by the singularity core, preventing the base from vaporizing in a blaze of gamma rays.',
        material: 'Chrome / Heat-Resistant Ceramics',
        function: 'Thermal and radioactive venting.',
        assemblyOrder: 9,
        connections: ['Singularity_Core_Housing'],
        failureEffect: 'Gamma-ray burst destroys the facility and sterilizes the continent.',
        cascadeFailures: ['Containment_Base_Platform'],
        originalPosition: { x: 0, y: -30, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 300 } // pushes outwards radially
    });

    // -------------------------------------------------------------------------
    // PARTICLE SYSTEM: REALITY TEARS / VOID FLAKES
    // -------------------------------------------------------------------------
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for(let i=0; i<particleCount; i++) {
        // Distribute particles around the portal
        const r = portalRadius + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const y = 150 + (Math.random() - 0.5) * 100;
        
        particlePositions[i*3] = Math.cos(theta) * r;
        particlePositions[i*3+1] = y;
        particlePositions[i*3+2] = Math.sin(theta) * r;
        
        particleVelocities.push({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
        });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);
    meshes.particles = particleSystem;
    meshes.particleVelocities = particleVelocities;

    // -------------------------------------------------------------------------
    // QUIZ QUESTIONS
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of the Morris-Thorne traversable wormhole metric, what specific violation of the energy conditions is strictly required at the wormhole throat to prevent topological collapse?",
            options: [
                "Violation of the Null Energy Condition (NEC) leading to negative energy density",
                "Violation of the Strong Energy Condition (SEC) exclusively via dark matter",
                "Strict adherence to the Weak Energy Condition (WEC) utilizing positive mass-energy",
                "Spontaneous symmetry breaking of the Higgs field at the throat perimeter"
            ],
            correctAnswer: 0,
            explanation: "Traversable wormholes require exotic matter with negative energy density to hold the throat open, directly violating the Null Energy Condition (NEC). This creates the necessary repulsive gravitational effect."
        },
        {
            question: "If this Multiverse Bridge functions by connecting two maximally extended Schwarzschild spacetimes (an Einstein-Rosen bridge), why is traversing it traditionally considered impossible without the exotic matter stabilization array?",
            options: [
                "The singularity blocks the path entirely.",
                "The throat pinches off faster than light can traverse it.",
                "Hawking radiation evaporates the traveler instantly.",
                "The metric expands exponentially, creating an infinite distance."
            ],
            correctAnswer: 1,
            explanation: "A standard Einstein-Rosen bridge is dynamic and non-traversable. The 'wormhole' throat opens and then pinches off in finite time—faster than a photon can travel through it. Exotic matter is needed to stabilize it."
        },
        {
            question: "The 'Gyroscopic_Stabilizer_Rings' utilize Lense-Thirring precession. In General Relativity, what physical mechanism causes this frame-dragging effect?",
            options: [
                "The presence of a massive, non-rotating charge.",
                "The rotation of a massive body dragging the spacetime metric around it.",
                "The expansion of spacetime due to a cosmological constant.",
                "The interaction of gravitons with the cosmic microwave background."
            ],
            correctAnswer: 1,
            explanation: "Frame-dragging, or Lense-Thirring precession, occurs when a massive rotating object twists the fabric of spacetime around it, altering the paths of free-falling objects nearby."
        },
        {
            question: "According to the ER=EPR conjecture, establishing a macroscopic wormhole (ER bridge) between two points in the multiverse is mathematically equivalent to what quantum phenomenon?",
            options: [
                "Quantum superposition of a macroscopic object.",
                "Maximum entanglement (Einstein-Podolsky-Rosen) of black hole microstates.",
                "The collapse of the wave function via the Copenhagen interpretation.",
                "Quantum decoherence in a thermal bath."
            ],
            correctAnswer: 1,
            explanation: "The ER=EPR conjecture proposes that wormholes (Einstein-Rosen bridges) and quantum entanglement (Einstein-Podolsky-Rosen pairs) are fundamentally the same phenomenon, with entanglement creating microscopic wormholes."
        },
        {
            question: "The 'Hawking_Radiation_Vents' manage output from the micro-singularity. According to Hawking's original derivation, how is the temperature of the black hole related to its mass?",
            options: [
                "Temperature is directly proportional to mass.",
                "Temperature is independent of mass.",
                "Temperature is inversely proportional to mass.",
                "Temperature increases exponentially with the square of the mass."
            ],
            correctAnswer: 2,
            explanation: "Hawking radiation temperature is inversely proportional to a black hole's mass (T ∝ 1/M). Therefore, smaller micro-singularities are vastly hotter and emit radiation at violently higher rates."
        }
    ];

    // -------------------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------------------
    function animate(time, speed, meshesObj) {
        const t = time * 0.001 * speed; // Base time scaling
        
        // 1. Shader Animation (Portal Surface)
        if (meshesObj.portal && meshesObj.portal.material.uniforms) {
            meshesObj.portal.material.uniforms.time.value = t * 2.0;
        }
        
        // 2. Gyroscopic Rings
        if (meshesObj.gyroAlpha) {
            meshesObj.gyroAlpha.rotation.y = t * 1.5;
            meshesObj.gyroAlpha.rotation.z = Math.sin(t * 0.5) * 0.1; 
        }
        if (meshesObj.gyroBeta) {
            meshesObj.gyroBeta.rotation.x = t * -1.2;
            meshesObj.gyroBeta.rotation.z = Math.cos(t * 0.5) * 0.1;
        }

        // 3. Pylon Crystals Hovering
        if (meshesObj.pylonCrystals) {
            meshesObj.pylonCrystals.forEach((crystal, index) => {
                const offset = index * Math.PI / 4;
                crystal.position.y = 270 + Math.sin(t * 3.0 + offset) * 10;
                crystal.rotation.y = t * 2.0 + offset;
            });
        }

        // 4. Energy Beams pulsing (Tachyon Array)
        if (meshesObj.beams) {
            meshesObj.beams.forEach((beam, index) => {
                const offset = index * 0.5;
                beam.scale.x = 1.0 + Math.sin(t * 10.0 + offset) * 0.5;
                beam.scale.z = 1.0 + Math.sin(t * 10.0 + offset) * 0.5;
                beam.material.opacity = 0.5 + Math.sin(t * 15.0 + offset) * 0.3;
            });
        }

        // 5. Conduit Pulses (Matter Injection)
        if (meshesObj.conduitPulses) {
            meshesObj.conduitPulses.forEach((pulse, index) => {
                // Flash the material emission intensity
                const intensity = 1.0 + Math.sin(t * 8.0 - index) * 2.0;
                pulse.material.emissiveIntensity = Math.max(0.5, intensity);
            });
        }

        // 6. Spire Antenna Rotation
        if (meshesObj.spireAntenna) {
            meshesObj.spireAntenna.rotation.y = t * 3.0;
            meshesObj.spireAntenna.rotation.z = t * 1.5;
        }

        // 7. Fracture Nodes floating orbit
        if (meshesObj.fractureNodes) {
            meshesObj.fractureNodes.forEach((node, index) => {
                const angle = (index / 24) * Math.PI * 2 + t * 0.5; // Orbital drift
                node.position.x = Math.cos(angle) * (portalRadius + 25 + Math.sin(t*2+index)*5);
                node.position.z = Math.sin(angle) * (portalRadius + 25 + Math.cos(t*2+index)*5);
                node.rotation.x = t * 2 + index;
                node.rotation.y = t * 2.5 - index;
            });
        }

        // 8. Dimensional Drift Gears
        if (meshesObj.gears) {
            meshesObj.gears.forEach(g => {
                g.mesh.rotation.z = t * g.speed * 2.0;
            });
        }

        // 9. Particle System (Reality Tears)
        if (meshesObj.particles) {
            const positions = meshesObj.particles.geometry.attributes.position.array;
            for(let i=0; i<particleCount; i++) {
                const i3 = i * 3;
                // Move based on velocity
                positions[i3] += meshesObj.particleVelocities[i].x * speed * 0.5;
                positions[i3+1] += meshesObj.particleVelocities[i].y * speed * 0.5;
                positions[i3+2] += meshesObj.particleVelocities[i].z * speed * 0.5;
                
                // Spiral towards the center (0, 150, 0)
                const dx = -positions[i3];
                const dy = 150 - positions[i3+1];
                const dz = -positions[i3+2];
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if(dist > 5) {
                    positions[i3] += (dx / dist) * 2.0 * speed;
                    positions[i3+1] += (dy / dist) * 2.0 * speed;
                    positions[i3+2] += (dz / dist) * 2.0 * speed;
                }
                
                // Reset if they hit the core
                if (dist < 10) {
                    const r = portalRadius + Math.random() * 100;
                    const theta = Math.random() * Math.PI * 2;
                    positions[i3] = Math.cos(theta) * r;
                    positions[i3+1] = 150 + (Math.random() - 0.5) * 100;
                    positions[i3+2] = Math.sin(theta) * r;
                }
            }
            meshesObj.particles.geometry.attributes.position.needsUpdate = true;
        }

        // 10. Singularity Core Vents Pulsing
        if (meshesObj.vents) {
            meshesObj.vents.forEach((vent, index) => {
                vent.scale.setScalar(1.0 + Math.sin(t * 20.0 + index) * 0.05);
            });
        }
    }

    return { group, parts, description: "A God-Tier Multiverse Bridge capable of punching a stable, traversable wormhole (Einstein-Rosen bridge) through the bulk fabric of spacetime. Requires vast quantities of negative energy and exotic matter to maintain the topological invariant of the throat.", quizQuestions, animate, meshes };
}
