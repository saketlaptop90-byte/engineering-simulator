import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "GodTierHawkingRadiationLens";

    const parts = [];
    const updatables = [];

    // ====================================================================================================
    // CUSTOM SHADERS FOR LENSING, RADIATION BEAM, AND EXOTIC MATTER
    // ====================================================================================================

    // Lensing Shader: Creates a glassy, distorted, glowing effect representing dark matter halos
    const lensingVertexShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            
            // Extreme spatiotemporal distortion physics
            vec3 pos = position;
            float distortion = sin(pos.y * 5.0 + time * 2.0) * 0.15;
            float microDistortion = cos(pos.x * 20.0 + time * 5.0) * 0.05;
            pos.x += normal.x * (distortion + microDistortion);
            pos.z += normal.z * (distortion + microDistortion);
            
            vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const lensingFragmentShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        uniform float intensity;
        
        void main() {
            vec3 viewDir = normalize(-vPosition);
            // Fresnel rim lighting for extreme glassy edge glow
            float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
            rim = smoothstep(0.6, 1.0, rim);
            
            vec3 baseColor = vec3(0.01, 0.0, 0.05);
            vec3 rimColor = vec3(0.6, 0.1, 1.0) * intensity;
            
            // Pulsing gravitational waves
            float pulse = (sin(time * 3.0 + vPosition.y) + 1.0) * 0.5;
            float interference = (cos(vPosition.x * 10.0 - time * 4.0) + 1.0) * 0.5;
            
            vec3 finalColor = mix(baseColor, rimColor, rim * pulse * interference);
            
            gl_FragColor = vec4(finalColor, 0.4 + rim * 0.6);
        }
    `;

    const lensingMaterial = new THREE.ShaderMaterial({
        vertexShader: lensingVertexShader,
        fragmentShader: lensingFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            intensity: { value: 2.0 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    // Beam Shader: A blazing, intense core of Hawking radiation
    const beamVertexShader = `
        varying vec2 vUv;
        varying float vElevation;
        uniform float time;
        void main() {
            vUv = uv;
            vElevation = position.y;
            vec3 pos = position;
            // Parabolic taper mimicking a magnetic pinch
            float taper = smoothstep(0.0, 150.0, pos.y);
            pos.x *= (1.0 - taper * 0.98);
            pos.z *= (1.0 - taper * 0.98);
            
            // Add erratic quantum jitter
            pos.x += sin(time * 50.0 + pos.y * 0.1) * 0.2;
            pos.z += cos(time * 45.0 + pos.y * 0.1) * 0.2;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const beamFragmentShader = `
        varying vec2 vUv;
        varying float vElevation;
        uniform float time;
        
        // Simplex 2D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }
        
        void main() {
            vec2 st = vUv * vec2(20.0, 100.0);
            float n = snoise(st - vec2(0.0, time * 15.0)); // Hyper-fast upward flow
            float n2 = snoise(st * 2.0 + vec2(0.0, time * 25.0));
            
            float core = smoothstep(0.4, 0.5, 1.0 - abs(vUv.x - 0.5) * 2.0);
            float intensity = core * (n * 0.5 + 0.5) * (n2 * 0.5 + 0.5) * 2.0;
            
            vec3 coreColor = vec3(1.0, 1.0, 1.0);
            vec3 edgeColor = vec3(0.0, 0.8, 1.0);
            vec3 color = mix(edgeColor, coreColor, intensity);
            
            float alpha = intensity * smoothstep(0.0, 20.0, vElevation) * smoothstep(150.0, 130.0, vElevation);
            
            gl_FragColor = vec4(color, alpha);
        }
    `;

    const beamMaterial = new THREE.ShaderMaterial({
        vertexShader: beamVertexShader,
        fragmentShader: beamFragmentShader,
        uniforms: {
            time: { value: 0.0 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });


    // ====================================================================================================
    // STRUCTURAL GENERATION
    // ====================================================================================================

    const BASE_RADIUS = 60;
    const MAX_ELEVATION = 200;

    // -----------------------------------------------------------------------------------------
    // 1. Dark Matter Halo Array
    // -----------------------------------------------------------------------------------------
    const halosGroup = new THREE.Group();
    const haloGeometries = [
        new THREE.TorusGeometry(45, 3.5, 64, 200),
        new THREE.TorusGeometry(38, 3.0, 64, 200),
        new THREE.TorusGeometry(31, 2.5, 64, 200),
        new THREE.TorusGeometry(24, 2.0, 64, 200),
        new THREE.TorusGeometry(17, 1.5, 64, 200),
        new THREE.TorusGeometry(10, 1.0, 64, 200),
        new THREE.TorusGeometry(5,  0.5, 64, 200)
    ];

    const haloMaterials = [];
    for(let i=0; i<haloGeometries.length; i++) {
        haloMaterials.push(lensingMaterial.clone());
    }

    const halos = [];
    for (let i = 0; i < haloGeometries.length; i++) {
        const haloMesh = new THREE.Mesh(haloGeometries[i], haloMaterials[i]);
        haloMesh.rotation.x = Math.PI / 2;
        haloMesh.position.y = MAX_ELEVATION - (i * 20);
        halosGroup.add(haloMesh);
        halos.push({ mesh: haloMesh, index: i });
        
        updatables.push((time, speed) => {
            haloMaterials[i].uniforms.time.value = time * speed;
            // Complex precession and nutation for dark matter stabilization
            haloMesh.rotation.z = time * speed * (0.15 + i * 0.05);
            haloMesh.rotation.x = Math.PI / 2 + Math.sin(time * speed * 0.8 + i) * 0.15;
            haloMesh.rotation.y = Math.cos(time * speed * 0.6 + i) * 0.15;
            haloMesh.position.y = MAX_ELEVATION - (i * 20) + Math.sin(time * speed * 3.0 + i) * 3.0;
        });
    }
    group.add(halosGroup);
    
    parts.push({
        name: "Dark Matter Halo Array",
        description: "A cascade of 7 artificially stabilized dark matter tori, functioning as a hyper-dense gravitational lens to magnify hawking radiation.",
        material: "Exotic Non-Baryonic Matter",
        function: "Lensing and extreme magnification of ultra-faint quantum emissions",
        assemblyOrder: 1,
        connections: ["Magnetic Containment Struts", "Quantum Focal Point"],
        failureEffect: "Uncontrolled gravitational shearing and immediate local spatiotemporal collapse",
        cascadeFailures: ["Focal Ring Destruction", "Planetary Mantle Rupture"],
        originalPosition: { x: 0, y: 140, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 2. Focused Hawking Radiation Beam
    // -----------------------------------------------------------------------------------------
    const beamGeo = new THREE.CylinderGeometry(25, 25, MAX_ELEVATION, 128, 128, true);
    const beamMesh = new THREE.Mesh(beamGeo, beamMaterial);
    beamMesh.position.y = MAX_ELEVATION / 2;
    group.add(beamMesh);
    
    updatables.push((time, speed) => {
        beamMaterial.uniforms.time.value = time * speed;
    });

    parts.push({
        name: "Focused Hawking Radiation Beam",
        description: "The concentrated stream of thermal radiation predicted by Stephen Hawking, extracted directly from the event horizon of a captive micro-black hole.",
        material: "Photonic Energy / Tachyonic Plasma",
        function: "Energy transmission, raw quantum data extraction, and mass conversion",
        assemblyOrder: 2,
        connections: ["Dark Matter Halo Array", "Base Energy Collector"],
        failureEffect: "Irradiation of the immediate parsec and total system vaporisation",
        cascadeFailures: ["Thermal Shielding Melt", "Containment Array De-sync"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 3. Foundation and Primary Containment Ring System
    // -----------------------------------------------------------------------------------------
    const rigGroup = new THREE.Group();
    
    // Main foundation ring
    const foundationGeo = new THREE.TorusGeometry(BASE_RADIUS, 8, 128, 256);
    const foundation = new THREE.Mesh(foundationGeo, darkSteel);
    foundation.rotation.x = Math.PI / 2;
    rigGroup.add(foundation);
    
    // Outer Containment Ring (elevated)
    const outerRingGeo = new THREE.TorusGeometry(BASE_RADIUS + 25, 5, 64, 256);
    const outerRing = new THREE.Mesh(outerRingGeo, steel);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 30;
    rigGroup.add(outerRing);

    // Extreme detailing: Thousands of rivets on the foundation
    const rivetGeo = new THREE.SphereGeometry(0.8, 8, 8);
    const rivetMat = chrome;
    const rivetInstanced = new THREE.InstancedMesh(rivetGeo, rivetMat, 720);
    let rivetIdx = 0;
    const dummy = new THREE.Object3D();
    for(let i=0; i<360; i+=1) {
        const angle = (i * Math.PI) / 180;
        // Top rivets
        dummy.position.set(Math.cos(angle) * BASE_RADIUS, 8, Math.sin(angle) * BASE_RADIUS);
        dummy.updateMatrix();
        rivetInstanced.setMatrixAt(rivetIdx++, dummy.matrix);
        // Outer rim rivets
        dummy.position.set(Math.cos(angle) * (BASE_RADIUS + 8), 0, Math.sin(angle) * (BASE_RADIUS + 8));
        dummy.updateMatrix();
        rivetInstanced.setMatrixAt(rivetIdx++, dummy.matrix);
    }
    rigGroup.add(rivetInstanced);

    parts.push({
        name: "Primary Containment Ring System",
        description: "Massive dark steel and reinforced steel rings establishing the foundational inertial frame for the gravitational lens. Lined with thousands of chrome micro-rivets.",
        material: "Dark Steel, Reinforced Steel, Chrome",
        function: "Anchoring the entire macro-structure against immense tidal forces",
        assemblyOrder: 3,
        connections: ["Foundation Mounts", "Pneumatic Stabilization Struts"],
        failureEffect: "Structural decoupling and massive torque shearing",
        cascadeFailures: ["Strut Disconnection", "Ring Deformation", "Tectonic Shockwave"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: -60, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 4. Heavy-Duty Pneumatic Stabilization Struts & Hydraulics
    // -----------------------------------------------------------------------------------------
    const STRUT_COUNT = 16;
    for(let i=0; i<STRUT_COUNT; i++) {
        const angle = (i / STRUT_COUNT) * Math.PI * 2;
        const strutGroup = new THREE.Group();
        
        // Base Mount (hyper-detailed)
        const mountGeo = new THREE.BoxGeometry(12, 10, 18);
        const mount = new THREE.Mesh(mountGeo, steel);
        mount.position.set(Math.cos(angle) * BASE_RADIUS, 5, Math.sin(angle) * BASE_RADIUS);
        mount.rotation.y = -angle;
        
        // Add lateral gears to the mount
        const gearGeo = new THREE.CylinderGeometry(4, 4, 1.5, 16);
        const gear1 = new THREE.Mesh(gearGeo, copper);
        gear1.rotation.x = Math.PI/2;
        gear1.position.set(6, 0, 0);
        const gear2 = new THREE.Mesh(gearGeo, copper);
        gear2.rotation.x = Math.PI/2;
        gear2.position.set(-6, 0, 0);
        mount.add(gear1);
        mount.add(gear2);
        
        updatables.push((time, speed) => {
            gear1.rotation.y = time * speed * 2.0;
            gear2.rotation.y = -time * speed * 2.0;
        });

        strutGroup.add(mount);
        
        // Main diagonal strut math
        const TOP_RADIUS = 50;
        const STRUT_TOP_Y = MAX_ELEVATION - 30;
        const dx = TOP_RADIUS * Math.cos(angle) - BASE_RADIUS * Math.cos(angle);
        const dz = TOP_RADIUS * Math.sin(angle) - BASE_RADIUS * Math.sin(angle);
        const dy = STRUT_TOP_Y - 5;
        const diagLength = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const dir = new THREE.Vector3(dx, dy, dz).normalize();
        
        // Outer Cylinder (Hydraulic Sleeve)
        const sleeveGeo = new THREE.CylinderGeometry(4, 5, diagLength * 0.6, 32);
        const sleeve = new THREE.Mesh(sleeveGeo, darkSteel);
        sleeve.position.set(
            BASE_RADIUS * Math.cos(angle),
            5,
            BASE_RADIUS * Math.sin(angle)
        );
        sleeve.position.addScaledVector(dir, diagLength * 0.3);
        
        const axis = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
        const radians = Math.acos(new THREE.Vector3(0, 1, 0).dot(dir));
        sleeve.quaternion.setFromAxisAngle(axis, radians);
        strutGroup.add(sleeve);
        
        // Inner Piston (Chrome)
        const pistonGeo = new THREE.CylinderGeometry(3, 3, diagLength * 0.6, 32);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.quaternion.copy(sleeve.quaternion);
        strutGroup.add(piston);
        
        updatables.push((time, speed) => {
            // Piston actuating animation
            const extension = Math.sin(time * speed * 3.0 + i) * 5.0;
            const centerDist = (diagLength * 0.6) / 2 + (diagLength * 0.4) + extension;
            piston.position.copy(mount.position);
            piston.position.addScaledVector(dir, diagLength * 0.7 + extension * 0.1);
        });

        // Spiraling power lines around the strut
        const spiralCurve = [];
        for(let s=0; s<=50; s++) {
            const t = s / 50;
            const l = t * diagLength * 0.9;
            const r = 6;
            const theta = t * Math.PI * 10; // 5 full turns
            
            // Local pos
            const localPos = new THREE.Vector3(Math.cos(theta)*r, l - (diagLength*0.45), Math.sin(theta)*r);
            // Transform to world
            localPos.applyQuaternion(sleeve.quaternion);
            localPos.add(mount.position);
            localPos.addScaledVector(dir, diagLength * 0.45);
            spiralCurve.push(localPos);
        }
        const spiralGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiralCurve), 100, 0.4, 8, false);
        const spiral = new THREE.Mesh(spiralGeo, rubber);
        strutGroup.add(spiral);
        
        rigGroup.add(strutGroup);
    }

    parts.push({
        name: "Pneumatic Stabilization Struts & Gear Mounts",
        description: "16 heavy-duty chrome and dark steel hydraulic struts. They dynamically adjust spatial tension via copper lateral gearings to counteract localized spatiotemporal warping.",
        material: "Chrome, Dark Steel, Rubber, Copper",
        function: "Dynamic spatial tension adjustment and vibration dampening",
        assemblyOrder: 4,
        connections: ["Foundation Ring", "Upper Stabilization Collar"],
        failureEffect: "Asymmetric tension leading to structural collapse",
        cascadeFailures: ["Halo Misalignment", "Beam Diffusion", "Singularity Drift"],
        originalPosition: { x: 0, y: 70, z: 0 },
        explodedPosition: { x: 0, y: 70, z: 200 }
    });

    // -----------------------------------------------------------------------------------------
    // 5. Upper Stabilization Collar & Magnetic Emitters
    // -----------------------------------------------------------------------------------------
    const collarGroup = new THREE.Group();
    collarGroup.position.y = MAX_ELEVATION - 30;
    
    // Main bulky collar ring
    const collarGeo = new THREE.TorusGeometry(50, 6, 64, 128);
    const collar = new THREE.Mesh(collarGeo, copper);
    collar.rotation.x = Math.PI / 2;
    collarGroup.add(collar);
    
    // Secondary inner cooling ring
    const innerCollarGeo = new THREE.TorusGeometry(43, 2, 32, 128);
    const innerCollar = new THREE.Mesh(innerCollarGeo, aluminum);
    innerCollar.rotation.x = Math.PI / 2;
    collarGroup.add(innerCollar);

    // Magnetic Containment Emitters (32 of them)
    for(let i=0; i<32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const emitterGroup = new THREE.Group();
        
        const emitterBase = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 10), steel);
        emitterBase.position.set(Math.cos(angle) * 50, 0, Math.sin(angle) * 50);
        emitterBase.rotation.y = -angle;
        emitterGroup.add(emitterBase);
        
        const emitterLens = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5, 32), glass);
        emitterLens.position.set(Math.cos(angle) * 44, 0, Math.sin(angle) * 44);
        emitterLens.rotation.z = Math.PI / 2;
        emitterLens.rotation.y = -angle;
        emitterGroup.add(emitterLens);
        
        // Glowing diode on emitter
        const diode = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 16, 16),
            new THREE.MeshStandardMaterial({ emissive: 0xff0000, emissiveIntensity: 2.0, color: 0x000000 })
        );
        diode.position.set(Math.cos(angle) * 44, 0, Math.sin(angle) * 44);
        emitterGroup.add(diode);
        
        updatables.push((time, speed) => {
            diode.material.emissiveIntensity = (Math.sin(time * speed * 15 + i) + 1.0) * 1.5;
        });
        
        collarGroup.add(emitterGroup);
    }
    
    rigGroup.add(collarGroup);
    
    parts.push({
        name: "Upper Stabilization Collar & Containment Emitters",
        description: "Massive copper-alloy collar housing 32 high-frequency magnetic containment emitters, establishing the bounding box for the dark matter fields.",
        material: "Copper, Steel, Quartz Glass, Ruby Diodes",
        function: "Shaping, confining, and constraining non-baryonic dark matter fields",
        assemblyOrder: 5,
        connections: ["Stabilization Struts", "Dark Matter Halos"],
        failureEffect: "Loss of magnetic constraint, leading to dark matter dissipation",
        cascadeFailures: ["Lensing Failure", "Hawking Beam Scatter", "Local Gravity Reversal"],
        originalPosition: { x: 0, y: 170, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 6. Base Energy Collector & Quantum Receptacle
    // -----------------------------------------------------------------------------------------
    const collectorGroup = new THREE.Group();
    
    // Core Receptacle (Chrome Hemisphere)
    const receptacleGeo = new THREE.SphereGeometry(22, 128, 64, 0, Math.PI * 2, 0.5, Math.PI);
    const receptacle = new THREE.Mesh(receptacleGeo, chrome);
    receptacle.position.y = 8;
    receptacle.rotation.x = Math.PI;
    collectorGroup.add(receptacle);
    
    // Intricate Inner Vanes (72 chronometric vanes)
    const VANE_COUNT = 72;
    for(let i=0; i<VANE_COUNT; i++) {
        const angle = (i / VANE_COUNT) * Math.PI * 2;
        const vaneGeo = new THREE.BoxGeometry(0.5, 15, 8);
        const vane = new THREE.Mesh(vaneGeo, tinted);
        vane.position.set(Math.cos(angle) * 12, 4, Math.sin(angle) * 12);
        vane.rotation.y = -angle + Math.PI/4;
        collectorGroup.add(vane);
        
        updatables.push((time, speed) => {
            // Vanes flutter slightly in the radiation wind
            vane.rotation.x = Math.sin(time * speed * 20.0 + i) * 0.1;
        });
    }
    
    // Rotating Data Extraction Rings (3 axis gyro rings)
    const ringGeo1 = new THREE.TorusGeometry(18, 1.5, 32, 128);
    const extractionRing1 = new THREE.Mesh(ringGeo1, copper);
    extractionRing1.position.y = 12;
    
    const ringGeo2 = new THREE.TorusGeometry(15, 1.2, 32, 128);
    const extractionRing2 = new THREE.Mesh(ringGeo2, aluminum);
    extractionRing2.position.y = 12;

    const ringGeo3 = new THREE.TorusGeometry(12, 0.8, 32, 128);
    const extractionRing3 = new THREE.Mesh(ringGeo3, darkSteel);
    extractionRing3.position.y = 12;
    
    collectorGroup.add(extractionRing1);
    collectorGroup.add(extractionRing2);
    collectorGroup.add(extractionRing3);
    
    updatables.push((time, speed) => {
        extractionRing1.rotation.x = time * speed * 1.5;
        extractionRing1.rotation.y = time * speed * 1.1;
        
        extractionRing2.rotation.y = -time * speed * 2.5;
        extractionRing2.rotation.z = time * speed * 1.8;
        
        extractionRing3.rotation.z = -time * speed * 3.5;
        extractionRing3.rotation.x = -time * speed * 2.1;
    });

    group.add(collectorGroup);

    parts.push({
        name: "Quantum Energy Receptacle & Gyroscopic Extractors",
        description: "A highly polished hemispherical basin lined with 72 fluttering chronometric vanes. Center houses a 3-axis gyroscopic data extraction matrix.",
        material: "Chrome, Tinted Glass, Copper, Aluminum, Dark Steel",
        function: "Energy absorption, thermal dampening, and quantum state measurement",
        assemblyOrder: 6,
        connections: ["Foundation Ring", "Hawking Radiation Beam"],
        failureEffect: "Feedback loop causing micro-singularity formation within the facility",
        cascadeFailures: ["Complete Spatiotemporal Assimilation of the Facility"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: -120, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 7. Radial Micro-Cooling Fins Array
    // -----------------------------------------------------------------------------------------
    const finGroup = new THREE.Group();
    const finGeo = new THREE.BoxGeometry(0.3, 12, 4);
    for(let i=0; i<720; i+=2) { // 360 dense fins
        const angle = (i * Math.PI) / 180;
        const fin = new THREE.Mesh(finGeo, aluminum);
        // Positioned along the outer foundation ring
        fin.position.set(Math.cos(angle) * (BASE_RADIUS + 25), 30, Math.sin(angle) * (BASE_RADIUS + 25));
        fin.rotation.y = -angle;
        finGroup.add(fin);
    }
    rigGroup.add(finGroup);
    
    parts.push({
        name: "Radial Micro-Cooling Fins (Lower Array)",
        description: "360 ultra-thin aluminum heat sinks aggressively dissipating the waste heat from the foundation's inertial dampeners.",
        material: "Aluminum",
        function: "Thermal regulation of the lower foundation",
        assemblyOrder: 7,
        connections: ["Outer Containment Ring"],
        failureEffect: "Foundation overheating and thermal expansion",
        cascadeFailures: ["Inertial Dampener Melt", "Micro-fractures"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 180 }
    });

    // -----------------------------------------------------------------------------------------
    // 8. Superfluid Helium & Cryogenic Piping Network
    // -----------------------------------------------------------------------------------------
    const pipeGroup = new THREE.Group();
    
    function createTangledPipe(startRadius, endRadius, heightOffset, mat, segments) {
        const pts = [];
        for(let i=0; i<=segments; i++) {
            const t = i / segments;
            const radius = startRadius * (1 - t) + endRadius * t;
            const angle = t * Math.PI * 8; // 4 loops
            pts.push(new THREE.Vector3(
                Math.cos(angle) * radius + (Math.random()-0.5)*5,
                t * MAX_ELEVATION + heightOffset + (Math.random()-0.5)*5,
                Math.sin(angle) * radius + (Math.random()-0.5)*5
            ));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const pipeG = new THREE.TubeGeometry(curve, segments * 4, 1.2, 16, false);
        return new THREE.Mesh(pipeG, mat);
    }

    for(let p=0; p<12; p++) {
        pipeGroup.add(createTangledPipe(BASE_RADIUS - 10, 30, 0, copper, 30));
        pipeGroup.add(createTangledPipe(BASE_RADIUS - 15, 20, 10, steel, 30));
    }
    
    // Add glowing plasma conduits among the pipes
    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 2.0, transparent: true, opacity: 0.8
    });
    for(let p=0; p<4; p++) {
        const plasmaPipe = createTangledPipe(BASE_RADIUS, 40, 5, plasmaMat, 40);
        pipeGroup.add(plasmaPipe);
        updatables.push((time, speed) => {
            plasmaPipe.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 8.0 + p) * 1.5;
        });
    }

    rigGroup.add(pipeGroup);

    parts.push({
        name: "Cryogenic Superfluid Piping & Plasma Conduits",
        description: "A chaotic but mathematically perfect routing of pipes delivering superfluid helium and venting tachyonic plasma to critical quantum junctions.",
        material: "Copper, Steel, Energized Plasma",
        function: "Cryogenic cooling and plasma bleed-off",
        assemblyOrder: 8,
        connections: ["Base Energy Collector", "Primary Containment Ring System", "Upper Collar"],
        failureEffect: "Cryogenic leak causing flash freezing, followed by plasma ignition",
        cascadeFailures: ["Thermal Shock Fracture", "Explosive Decompression"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: -150, y: 100, z: -150 }
    });

    // -----------------------------------------------------------------------------------------
    // 9. Operator Control Cabin & Monitoring Station
    // -----------------------------------------------------------------------------------------
    const cabinGroup = new THREE.Group();
    // Mount it outside the main rings
    cabinGroup.position.set(BASE_RADIUS + 40, 25, 0);
    
    // Cabin Base
    const cabinBase = new THREE.Mesh(new THREE.BoxGeometry(20, 4, 25), darkSteel);
    cabinGroup.add(cabinBase);
    
    // Cabin Body (Lead lined)
    const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(18, 15, 23), steel);
    cabinBody.position.y = 9.5;
    cabinGroup.add(cabinBody);
    
    // Wrap around tinted window
    const cabinWindowGeo = new THREE.CylinderGeometry(15, 15, 8, 32, 1, false, -Math.PI/2, Math.PI);
    const cabinWindow = new THREE.Mesh(cabinWindowGeo, tinted);
    cabinWindow.rotation.y = Math.PI / 2;
    cabinWindow.position.set(-2, 10, 0);
    cabinGroup.add(cabinWindow);
    
    // Internal Operator Details
    const consoleGeo = new THREE.BoxGeometry(4, 3, 15);
    const opConsole = new THREE.Mesh(consoleGeo, darkSteel);
    opConsole.position.set(-5, 6, 0);
    cabinGroup.add(opConsole);
    
    // Joysticks
    const stickGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
    const stick1 = new THREE.Mesh(stickGeo, chrome);
    stick1.position.set(-5, 8, 4);
    stick1.rotation.z = Math.PI/6;
    cabinGroup.add(stick1);
    const stick2 = new THREE.Mesh(stickGeo, chrome);
    stick2.position.set(-5, 8, -4);
    stick2.rotation.z = Math.PI/6;
    cabinGroup.add(stick2);
    
    // Radar / Comm Antennas on roof
    for(let i=0; i<4; i++) {
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.1, 15, 8), aluminum);
        ant.position.set((Math.random()-0.5)*15, 24, (Math.random()-0.5)*15);
        cabinGroup.add(ant);
    }
    
    // Walkway connecting to foundation
    const walkwayGeo = new THREE.BoxGeometry(30, 2, 8);
    const walkway = new THREE.Mesh(walkwayGeo, steel);
    walkway.position.set(-25, -1, 0);
    cabinGroup.add(walkway);
    
    // Guard rails for walkway
    const railMat = aluminum;
    for(let i=0; i<15; i++) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 8), railMat);
        post.position.set(-10 - i*2, 1, 3.8);
        cabinGroup.add(post);
        const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 8), railMat);
        post2.position.set(-10 - i*2, 1, -3.8);
        cabinGroup.add(post2);
    }
    const topRail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 30, 8), railMat);
    topRail1.rotation.z = Math.PI/2;
    topRail1.position.set(-25, 3, 3.8);
    cabinGroup.add(topRail1);
    const topRail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 30, 8), railMat);
    topRail2.rotation.z = Math.PI/2;
    topRail2.position.set(-25, 3, -3.8);
    cabinGroup.add(topRail2);

    group.add(cabinGroup);

    parts.push({
        name: "Operator Control Cabin & Walkway",
        description: "Heavily shielded, lead-lined monitoring station complete with joysticks, consoles, and a walkway. Operators must undergo quantum-decoherence therapy after every 2-hour shift.",
        material: "Dark Steel, Tinted Glass, Lead, Aluminum",
        function: "Local manual override, safety lockouts, and telemetry monitoring",
        assemblyOrder: 9,
        connections: ["Foundation Ring", "Outer Power Grid"],
        failureEffect: "Operator mutation and structural control loss",
        cascadeFailures: ["Manual Override Lockdown", "AI Rogue Takeover"],
        originalPosition: { x: 100, y: 25, z: 0 },
        explodedPosition: { x: 200, y: 25, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 10. Holographic Telemetry Interfaces (Hard-Light Arrays)
    // -----------------------------------------------------------------------------------------
    const holoGroup = new THREE.Group();
    const holoScreenGeo = new THREE.PlaneGeometry(15, 10);
    const holoMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    
    // Canvas texture for screens (scrolling data look)
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000'; ctx.fillRect(0,0,512,512);
    ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 3;
    ctx.font = '24px monospace';
    ctx.fillStyle = '#00ffff';
    for(let i=0; i<512; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
        ctx.fillText(`TENSOR [${i/40}]`, 10, i+20);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    const holograms = [];
    for(let i=0; i<8; i++) {
        const screenMat = holoMat.clone();
        screenMat.map = tex;
        const screen = new THREE.Mesh(holoScreenGeo, screenMat);
        const angle = (i / 8) * Math.PI * 2;
        screen.position.set(Math.cos(angle) * 75, 50 + (i%2)*20, Math.sin(angle) * 75);
        screen.lookAt(0, screen.position.y, 0);
        holoGroup.add(screen);
        holograms.push({ mesh: screen, mat: screenMat, offset: i });
    }
    group.add(holoGroup);
    
    updatables.push((time, speed) => {
        holograms.forEach(h => {
            h.mesh.position.y += Math.sin(time * speed * 2 + h.offset) * 0.1;
            h.mat.opacity = 0.3 + (Math.sin(time * speed * 10 + h.offset) * 0.5 + 0.5) * 0.5;
            h.mat.map.offset.y -= 0.01 * speed;
        });
    });

    parts.push({
        name: "Holographic Telemetry Interfaces",
        description: "Eight massive hard-light holographic projections displaying real-time tensor calculus calculations for spatial distortion mapping.",
        material: "Photonic Projection (Hard-Light)",
        function: "Macro-scale data visualization for operators and visual diagnostics",
        assemblyOrder: 10,
        connections: ["Operator Control Cabin", "Quantum Receptacle sensors"],
        failureEffect: "Data blindness and inability to parse local gravity anomalies",
        cascadeFailures: ["Operator Miscalculation"],
        originalPosition: { x: 0, y: 60, z: 0 },
        explodedPosition: { x: 150, y: 200, z: 150 }
    });

    // -----------------------------------------------------------------------------------------
    // 11. High-Voltage Quantum Transformers
    // -----------------------------------------------------------------------------------------
    const transformerGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const tBase = new THREE.Mesh(new THREE.BoxGeometry(15, 25, 15), darkSteel);
        const tTop = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 8, 32), glass);
        tTop.position.y = 16.5;
        
        const tMod = new THREE.Group();
        tMod.add(tBase);
        tMod.add(tTop);
        
        // Heavy Coils wrapped around glass core
        for(let c=0; c<10; c++) {
            const coil = new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.8, 16, 64), copper);
            coil.rotation.x = Math.PI / 2;
            coil.position.y = 13.5 + c * 0.8;
            tMod.add(coil);
        }

        // Plasma arc inside transformer
        const arcGeo = new THREE.CylinderGeometry(1, 1, 8, 16);
        const arcMat = new THREE.MeshBasicMaterial({ color: 0xaa00ff, blending: THREE.AdditiveBlending });
        const arc = new THREE.Mesh(arcGeo, arcMat);
        arc.position.y = 16.5;
        tMod.add(arc);
        
        updatables.push((time, speed) => {
            arc.scale.x = 1.0 + Math.random() * 2.0;
            arc.scale.z = 1.0 + Math.random() * 2.0;
            arc.material.opacity = Math.random();
        });
        
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        tMod.position.set(Math.cos(angle)*90, 12.5, Math.sin(angle)*90);
        tMod.rotation.y = -angle;
        transformerGroup.add(tMod);
    }
    group.add(transformerGroup);

    parts.push({
        name: "High-Voltage Quantum Transformers",
        description: "Four colossal step-down transformers generating raw lightning to convert hawking energy into a stabilized unified grid output.",
        material: "Dark Steel, Copper, Quartz Glass",
        function: "Energy conversion and planetary grid interfacing",
        assemblyOrder: 11,
        connections: ["Foundation Ring", "Outer Power Grid"],
        failureEffect: "Massive EMP and planetary grid overload",
        cascadeFailures: ["Global Power Blackout", "Transformer Detonation"],
        originalPosition: { x: 0, y: 12.5, z: 0 },
        explodedPosition: { x: 180, y: 12.5, z: 180 }
    });

    // -----------------------------------------------------------------------------------------
    // 12. Orbital Telemetry Sensor Array (Floating Hub)
    // -----------------------------------------------------------------------------------------
    const sensorGroup = new THREE.Group();
    sensorGroup.position.y = MAX_ELEVATION + 30;
    
    // Central Hub
    const centralHub = new THREE.Mesh(new THREE.OctahedronGeometry(8, 2), chrome);
    sensorGroup.add(centralHub);
    
    // Parabolic Dishes
    for(let i=0; i<3; i++) {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 30, 16), steel);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = 15;
        
        const dish = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 16, 0, Math.PI), aluminum);
        dish.position.x = 30;
        dish.rotation.y = -Math.PI / 2;
        
        // Sub-antenna in dish
        const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 8), copper);
        feed.rotation.z = Math.PI / 2;
        feed.position.set(28, 0, 0);
        
        const subGroup = new THREE.Group();
        subGroup.add(arm);
        subGroup.add(dish);
        subGroup.add(feed);
        subGroup.rotation.y = (i/3) * Math.PI * 2;
        
        sensorGroup.add(subGroup);
    }
    group.add(sensorGroup);
    
    updatables.push((time, speed) => {
        sensorGroup.rotation.y = time * speed * 0.8;
        sensorGroup.position.y = MAX_ELEVATION + 30 + Math.sin(time * speed * 2)*4;
        centralHub.rotation.x = time * speed * 1.5;
        centralHub.rotation.z = time * speed * 1.2;
    });

    parts.push({
        name: "Orbital Telemetry Sensor Array",
        description: "Rotating octahedral hub with three massive parabolic dishes. Hovering via local anti-gravity to measure the gravitational distortion field.",
        material: "Chrome, Steel, Aluminum, Copper",
        function: "Gravitational anomaly detection and anti-grav stabilization",
        assemblyOrder: 12,
        connections: ["Dark Matter Halos (Wireless)", "Data Grid"],
        failureEffect: "Blind spots in spatial monitoring",
        cascadeFailures: ["Unpredicted Spatiotemporal Tears", "Hub crash into the lens"],
        originalPosition: { x: 0, y: 230, z: 0 },
        explodedPosition: { x: 0, y: 600, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 13. Bedrock Tectonic Anchors
    // -----------------------------------------------------------------------------------------
    const anchorGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const anchorGeo = new THREE.CylinderGeometry(6, 2, 40, 32);
        const anchor = new THREE.Mesh(anchorGeo, darkSteel);
        const angle = (i/8) * Math.PI * 2;
        anchor.position.set(Math.cos(angle)*BASE_RADIUS, -20, Math.sin(angle)*BASE_RADIUS);
        
        // Add glowing seismic dampeners
        const dampGeo = new THREE.TorusGeometry(7, 1.5, 16, 64);
        const damp = new THREE.Mesh(dampGeo, new THREE.MeshStandardMaterial({ emissive: 0xff8800, emissiveIntensity: 1.5, color: 0x222222 }));
        damp.rotation.x = Math.PI / 2;
        damp.position.copy(anchor.position);
        damp.position.y += 15;
        
        anchorGroup.add(anchor);
        anchorGroup.add(damp);
        
        updatables.push((time, speed) => {
            damp.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 12 + i) * 1.0;
        });
    }
    group.add(anchorGroup);

    parts.push({
        name: "Bedrock Tectonic Anchors & Seismic Dampeners",
        description: "Massive deep-earth penetrating spikes made of dark steel and tungsten. Locked directly into the planetary crust to prevent the lens from tearing out of the ground.",
        material: "Dark Steel, Tungsten",
        function: "Planetary structural coupling and seismic isolation",
        assemblyOrder: 13,
        connections: ["Foundation Ring", "Planetary Crust"],
        failureEffect: "Facility tearing loose from the planet under gravitational stress",
        cascadeFailures: ["Catastrophic Geological Upheaval", "Crustal Shatter"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 14. Superconducting Ground Cables Array
    // -----------------------------------------------------------------------------------------
    const wiringGroup = new THREE.Group();
    for(let i=0; i<40; i++) {
        const wireGeo = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3((Math.random()-0.5)*200, 0, (Math.random()-0.5)*200),
                new THREE.Vector3((Math.random()-0.5)*150, 0.5, (Math.random()-0.5)*150),
                new THREE.Vector3((Math.random()-0.5)*80, 2, (Math.random()-0.5)*80),
                new THREE.Vector3((Math.random()-0.5)*30, 4, (Math.random()-0.5)*30)
            ]), 64, 0.4 + Math.random()*0.5, 12, false
        );
        const wire = new THREE.Mesh(wireGeo, rubber);
        wiringGroup.add(wire);
    }
    group.add(wiringGroup);
    
    parts.push({
        name: "Superconducting Ground Cables Array",
        description: "A sprawling mess of 40 ultra-thick rubber-shielded cables running along the facility floor to ground extreme voltage anomalies.",
        material: "Rubber, Superconducting Copper core",
        function: "Electrical grounding and surplus voltage bleed",
        assemblyOrder: 14,
        connections: ["Quantum Transformers", "Foundation Ring"],
        failureEffect: "Lethal floor electrification",
        cascadeFailures: ["Personnel electrocution", "Sensor fried"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // -----------------------------------------------------------------------------------------
    // 15. Quantum Particulate Exhaust & Tachyon Bloom
    // -----------------------------------------------------------------------------------------
    const particleCount = 10000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];
    
    for(let i=0; i<particleCount; i++) {
        // Initial spawn around the beam
        particlePositions[i*3] = (Math.random() - 0.5) * 60;
        particlePositions[i*3+1] = Math.random() * MAX_ELEVATION;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 60;
        
        particleVelocities.push(new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            Math.random() * 5.0 + 2.0, // fast upward
            (Math.random() - 0.5) * 0.5
        ));
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.6,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);
    
    updatables.push((time, speed) => {
        const positions = particleSystem.geometry.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            // Apply velocity
            positions[i*3] += particleVelocities[i].x * speed;
            positions[i*3+1] += particleVelocities[i].y * speed;
            positions[i*3+2] += particleVelocities[i].z * speed;
            
            // Extreme gravitational lensing pull (spiral towards the beam center)
            const dx = -positions[i*3];
            const dz = -positions[i*3+2];
            const dist = Math.sqrt(dx*dx + dz*dz);
            if(dist > 2) {
                // Orbital mechanics
                const tangentX = dz / dist;
                const tangentZ = -dx / dist;
                
                positions[i*3] += (dx/dist * 0.2 + tangentX * 0.8) * speed;
                positions[i*3+2] += (dz/dist * 0.2 + tangentZ * 0.8) * speed;
            }
            
            // Reset particles that escape the top
            if(positions[i*3+1] > MAX_ELEVATION + 50) {
                positions[i*3+1] = 0;
                // Respawn in a wide radius at base
                const angle = Math.random() * Math.PI * 2;
                const rad = 10 + Math.random() * 50;
                positions[i*3] = Math.cos(angle) * rad;
                positions[i*3+2] = Math.sin(angle) * rad;
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    });

    parts.push({
        name: "Quantum Particulate Exhaust (Tachyon Bloom)",
        description: "10,000 highly charged tachyon and positron emissions bleeding off from the main containment field, rendered as a swirling volumetric particle bloom.",
        material: "High-Energy Particles",
        function: "Pressure relief for local quantum state collapse",
        assemblyOrder: 15,
        connections: ["Hawking Radiation Beam", "Vacuum"],
        failureEffect: "Lethal radiation spikes exceeding 50,000 Sieverts",
        cascadeFailures: ["Instant Biological Sublimation", "Electronics wipe"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });


    // ====================================================================================================
    // METADATA & PHYSICS DESCRIPTIONS
    // ====================================================================================================

    const description = "The God-Tier Hawking Radiation Lens is an apex-level astrophysics megastructure. Utilizing artificially stabilized dark matter tori, it acts as an immense gravitational lens, capable of magnifying and extracting the unimaginably faint thermal radiation emanating from the event horizon of a captive micro-singularity. The structure relies on massive magnetic containment collars, 16 hydraulic dampers calculating geodesics in real-time, and extensive cryogenic cooling loops to prevent spontaneous spatiotemporal collapse. Unfathomably dangerous to operate, it represents the bleeding edge of quantum cosmology engineering.";

    const quizQuestions = [
        {
            question: "In the context of the lens's operation, how does the machine counteract the 'Information Paradox' associated with Hawking radiation extraction?",
            options: [
                "By utilizing dark matter halos to preserve quantum entanglement records across the event horizon.",
                "By freezing the radiation in time using the cryogenic cooling pipes.",
                "By absorbing all data into the holographic telemetry interfaces.",
                "By reversing the spin of the singularity."
            ],
            correctAnswer: 0,
            explanation: "The dark matter halos function not just as physical lenses, but as quantum memory buffers. As radiation is emitted, the halos entangle with the outbound particles, preserving the quantum state information that would otherwise be permanently lost or scrambled."
        },
        {
            question: "Why is superfluid helium explicitly required in the Cryogenic Piping Network instead of standard liquid nitrogen?",
            options: [
                "Superfluid helium boasts zero viscosity and near-infinite thermal conductivity, preventing catastrophic quantum thermal runaway.",
                "It looks visually better when leaking from the pipes.",
                "Liquid nitrogen freezes the dark matter too quickly, making it brittle.",
                "It conducts electricity better for the grounding wires."
            ],
            correctAnswer: 0,
            explanation: "At temperatures near absolute zero, superfluid helium exhibits zero viscosity and acts as a macroscopic quantum state, allowing it to wick heat away from the quantum junctions instantly—a necessity when dealing with the extreme thermal gradients of a micro-singularity."
        },
        {
            question: "The Pneumatic Stabilization Struts adjust dynamically to 'spatial warping'. What theoretical metric tensor defines this warping in the immediate vicinity of the lens?",
            options: [
                "The Schwarzschild metric, localized and perturbed by the dark matter mass density.",
                "The Newtonian gravitational constant squared.",
                "The Euclidean spatial matrix.",
                "The Minkowski flat space metric."
            ],
            correctAnswer: 0,
            explanation: "The machine operates near a black hole, meaning the spacetime curvature is dictated by the Schwarzschild metric (or Kerr metric if rotating). The dark matter lenses introduce extreme, localized perturbations to this metric, requiring the struts to constantly adjust to the shifting geodesics."
        },
        {
            question: "What is the primary function of the 32 magnetic containment emitters located on the Upper Stabilization Collar?",
            options: [
                "To confine the exotic, non-baryonic dark matter particles within their specific toroidal geometries.",
                "To attract stray metallic objects into the radiation beam.",
                "To generate alternating current electricity for the operator cabin.",
                "To rapidly spin the aluminum micro-cooling fins."
            ],
            correctAnswer: 0,
            explanation: "Dark matter interacts weakly (if at all) with standard electromagnetic fields. The 'magnetic' emitters here refer to specialized, high-dimensional tensor fields (colloquially called magnetic for operators) required to couple with and spatially constrain the non-baryonic mass of the halos."
        },
        {
            question: "If the Base Energy Collector suffers a feedback loop, it causes 'micro-singularity formation'. What is the critical threshold called where pure energy density collapses into a black hole?",
            options: [
                "The Bekenstein bound.",
                "The Tolman-Oppenheimer-Volkoff limit.",
                "The Kugelblitz threshold.",
                "The Chandrasekhar limit."
            ],
            correctAnswer: 2,
            explanation: "A Kugelblitz is a black hole formed strictly from radiation/energy rather than mass. If the Hawking beam is focused too intensely in the collector without adequate extraction, the photon energy density exceeds the Kugelblitz threshold, collapsing into a new micro-singularity."
        }
    ];

    // Main animation loop logic
    function animate(time, speed, meshes) {
        // Iterate through all registered update functions
        // Passing global time and speed modifier
        updatables.forEach(updateFn => updateFn(time, speed));
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
