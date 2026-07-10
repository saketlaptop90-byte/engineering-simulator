import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {}; // To store references for animation

    // ==========================================
    // 1. CUSTOM SHADERS & MATERIALS
    // ==========================================

    const planetUniforms = {
        time: { value: 0.0 }
    };

    const planetVertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const planetFragmentShader = `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        // Simplex 3D Noise for gas giant procedural texture
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){ 
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
            i = mod(i, 289.0 ); 
            vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
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
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }
        
        float fbm(vec3 x) {
            float v = 0.0;
            float a = 0.5;
            vec3 shift = vec3(100.0);
            for (int i = 0; i < 6; ++i) {
                v += a * snoise(x);
                x = x * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            // Latitude-based storm bands
            float lat = vUv.y * 3.14159;
            float band = sin(lat * 20.0 + fbm(vec3(vUv.x * 15.0, vUv.y * 15.0, time * 0.02)) * 2.5);
            
            // Great storm spot approximation
            vec2 spotCenter = vec2(0.65, 0.35);
            float distToSpot = length(vUv - spotCenter);
            float spot = smoothstep(0.12, 0.01, distToSpot + fbm(vec3(vUv * 25.0, time * 0.05)) * 0.03);

            // Colors for gas giant
            vec3 colorA = vec3(0.05, 0.1, 0.25); // Deep blue/cyan
            vec3 colorB = vec3(0.1, 0.5, 0.8);   // Lighter cyan
            vec3 stormColor = vec3(0.9, 0.9, 1.0); // White storm

            vec3 base = mix(colorA, colorB, smoothstep(-1.0, 1.0, band));
            base = mix(base, stormColor, spot * 0.9);

            // Diffuse and Specular Lighting
            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
            float diff = max(dot(normal, lightDir), 0.0);
            
            vec3 viewDir = normalize(vViewPosition);
            vec3 halfDir = normalize(lightDir + viewDir);
            float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);

            vec3 finalColor = base * (diff * 0.8 + 0.2) + vec3(1.0) * spec * 0.15;
            
            // Atmospheric Rim Glow
            float rim = 1.0 - max(dot(viewDir, normal), 0.0);
            rim = smoothstep(0.5, 1.0, rim);
            finalColor += vec3(0.3, 0.6, 1.0) * rim * 0.6;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const antimatterUniforms = {
        time: { value: 0.0 }
    };

    const antimatterVertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec3 pos = position;
            // Pulsating organic/plasma effect
            pos += normal * (sin(pos.y * 15.0 + time * 8.0) * 0.03 + cos(pos.x * 15.0 - time * 6.0) * 0.03);
            vPosition = pos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const antimatterFragmentShader = `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            // Complex energy waves
            float energy1 = sin(vPosition.y * 30.0 - time * 12.0) * 0.5 + 0.5;
            float energy2 = cos(vPosition.x * 20.0 + time * 15.0) * 0.5 + 0.5;
            float energy = (energy1 + energy2) * 0.5;
            
            float glow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
            vec3 color = mix(vec3(0.4, 0.0, 1.0), vec3(1.0, 0.1, 0.8), energy); // Deep Purple to Bright Magenta
            
            gl_FragColor = vec4(color + vec3(glow * 0.8), 0.85); // Semi-transparent plasma
        }
    `;

    const energyShieldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const highTechMetal = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.4,
        envMapIntensity: 1.0
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.5
    });

    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 3.0
    });

    // ==========================================
    // 2. THE GAS GIANT CORE
    // ==========================================

    const planetRadius = 800;
    const planetGeometry = new THREE.SphereGeometry(planetRadius, 128, 128);
    const planetMaterial = new THREE.ShaderMaterial({
        uniforms: planetUniforms,
        vertexShader: planetVertexShader,
        fragmentShader: planetFragmentShader
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    group.add(planet);
    meshes.planet = planet;

    parts.push({
        name: 'Gas Giant Core (Sub-Jovian)',
        description: 'A massive procedurally generated sub-Jovian gas giant trapped in the center of the ring. Its exotic upper atmosphere is incredibly rich in primordial isotopic gasses which are harvested by the facility to synthesize antiprotons and positrons at god-tier efficiencies. The atmosphere is turbulent, governed by intricate fluid dynamic bands and super-storms.',
        material: 'Quantum Fluidic Shader',
        function: 'Source of raw isotopic matter for antimatter synthesis.',
        assemblyOrder: 1,
        connections: ['Magnetic_Scoop_Array', 'Gravity_Tether_Beams'],
        failureEffect: 'Atmospheric destabilization leading to hyper-storms that can sheer off the magnetic scoops.',
        cascadeFailures: ['Scoop destruction', 'Plasma starvation', 'Core implosion'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });


    // ==========================================
    // 3. MAIN ACCELERATOR RING (COLOSSAL)
    // ==========================================

    const ringRadius = 1400;
    const tubeRadius = 40;
    
    const acceleratorGroup = new THREE.Group();
    group.add(acceleratorGroup);
    meshes.acceleratorGroup = acceleratorGroup;

    // 3a. Inner Vacuum Tube (Glass)
    const vacuumTubeGeo = new THREE.TorusGeometry(ringRadius, tubeRadius, 64, 256);
    const vacuumTube = new THREE.Mesh(vacuumTubeGeo, glass);
    acceleratorGroup.add(vacuumTube);

    parts.push({
        name: 'Primary Particle Accelerator Vacuum Torus',
        description: 'The main high-vacuum containment torus where particles are accelerated to 99.999999% the speed of light. Constructed of advanced transparent diamondoid-glass to allow visual inspection of the plasma streams, though mostly for aesthetic dread. Contains zero particulate matter to prevent catastrophic antimatter annihilation.',
        material: 'Diamondoid Glass',
        function: 'Provides a near-perfect vacuum environment for relativistic particle acceleration.',
        assemblyOrder: 2,
        connections: ['Superconducting_Coils', 'Plasma_Injectors'],
        failureEffect: 'Micro-fractures cause immediate vacuum loss, resulting in localized antimatter annihilation and a 50-megaton explosive breach.',
        cascadeFailures: ['Loss of containment', 'Ring fracture', 'Total facility vaporization'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // 3b. Outer Structural Trussing (Complex geometry)
    const structuralTorusGeo = new THREE.TorusGeometry(ringRadius, tubeRadius + 15, 16, 128);
    const structuralTorusMat = new THREE.MeshStandardMaterial({
        color: 0x333333, metalness: 0.8, roughness: 0.2, wireframe: true
    });
    const structuralTorus = new THREE.Mesh(structuralTorusGeo, structuralTorusMat);
    acceleratorGroup.add(structuralTorus);

    // 3c. Superconducting Magnetic Coils (Wrapped around the tube)
    const coilCount = 360;
    const coilGeo = new THREE.TorusGeometry(tubeRadius + 5, 2, 8, 32);
    const coilGroup = new THREE.Group();
    
    for(let i=0; i<coilCount; i++) {
        const angle = (i / coilCount) * Math.PI * 2;
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.position.x = Math.cos(angle) * ringRadius;
        coil.position.y = Math.sin(angle) * ringRadius;
        coil.rotation.x = Math.PI / 2;
        coil.rotation.y = angle;
        coilGroup.add(coil);
    }
    acceleratorGroup.add(coilGroup);

    parts.push({
        name: 'Niobium-Titanium Superconducting Coil Array',
        description: 'An array of 360 massive superconducting electromagnetic coils wrapping the primary vacuum tube. Cooled to 1.2 Kelvin, they generate magnetic fields exceeding 150 Tesla to steer and focus the relativistic antiproton beams perfectly through the center of the torus without touching the walls.',
        material: 'Niobium-Titanium / Copper Matrix',
        function: 'Steers and focuses the particle beam.',
        assemblyOrder: 3,
        connections: ['Vacuum_Torus', 'Cryogenic_Cooling_System'],
        failureEffect: 'Quench event causing rapid heating; the magnetic field collapses and the antimatter beam strikes the tube wall.',
        cascadeFailures: ['Wall vaporization', 'Breach', 'Annihilation event'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });


    // ==========================================
    // 4. MAGNETIC GAS SCOOPS (EXTRACTORS)
    // ==========================================

    const scoopCount = 12;
    const scoopsGroup = new THREE.Group();
    group.add(scoopsGroup);
    meshes.scoopsGroup = scoopsGroup;

    // Create a complex funnel profile for the scoop
    const scoopPoints = [];
    for ( let i = 0; i < 20; i ++ ) {
        const t = i / 19;
        const radius = 10 + 60 * Math.pow(t, 2); // Flare outwards
        const height = t * -250; // Extend downwards towards planet
        scoopPoints.push( new THREE.Vector2( radius, height ) );
    }
    const scoopGeo = new THREE.LatheGeometry(scoopPoints, 32);
    
    for(let i=0; i<scoopCount; i++) {
        const angle = (i / scoopCount) * Math.PI * 2;
        
        const scoopBase = new THREE.Group();
        
        // The funnel
        const funnel = new THREE.Mesh(scoopGeo, highTechMetal);
        scoopBase.add(funnel);

        // Inner glowing ring
        const innerRingGeo = new THREE.TorusGeometry(60, 4, 16, 32);
        const innerRing = new THREE.Mesh(innerRingGeo, neonBlue);
        innerRing.position.y = -240;
        innerRing.rotation.x = Math.PI / 2;
        scoopBase.add(innerRing);

        // Support struts connecting scoop to main ring
        const strutGeo = new THREE.CylinderGeometry(3, 3, 300, 8);
        const strut1 = new THREE.Mesh(strutGeo, steel);
        strut1.position.set(20, 150, 0);
        strut1.rotation.z = -0.2;
        const strut2 = new THREE.Mesh(strutGeo, steel);
        strut2.position.set(-20, 150, 0);
        strut2.rotation.z = 0.2;
        scoopBase.add(strut1);
        scoopBase.add(strut2);

        // Position around the ring, pointing inwards towards the planet
        scoopBase.position.x = Math.cos(angle) * (ringRadius - 100);
        scoopBase.position.y = 0; 
        scoopBase.position.z = Math.sin(angle) * (ringRadius - 100);
        
        // Rotate so the funnel points exactly at the origin
        scoopBase.lookAt(0, 0, 0);
        scoopBase.rotateX(-Math.PI / 2);

        scoopsGroup.add(scoopBase);
    }

    parts.push({
        name: 'Hyper-Magnetic Atmospheric Siphons (Scoops)',
        description: 'Colossal magnetic funnels arrayed around the inner circumference of the station. These project highly focused magnetic tethers into the gas giant\'s upper atmosphere, ionizing and drawing up megatons of raw isotopic gases every second. The inner rings glow with intense Cherenkov radiation as particles are stripped of electrons.',
        material: 'High-Tech Dark Metal, Neon Emissive Coils',
        function: 'Extracts and ionizes gas from the planet.',
        assemblyOrder: 4,
        connections: ['Main_Ring_Hub', 'Gas_Giant_Atmosphere'],
        failureEffect: 'Magnetic tether collapse causes backwash of plasma, melting the scoop funnel.',
        cascadeFailures: ['Loss of intake', 'Accelerator starvation', 'Plasma imbalance'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -400, y: 0, z: 0 }
    });


    // ==========================================
    // 5. ANTIMATTER CONTAINMENT PODS
    // ==========================================

    const podCount = 24;
    const podsGroup = new THREE.Group();
    group.add(podsGroup);

    const podGeo = new THREE.CylinderGeometry(20, 20, 120, 32);
    const podCapGeo = new THREE.TorusGeometry(20, 5, 16, 32);
    
    // Shader material for the antimatter core inside the pods
    const podCoreMat = new THREE.ShaderMaterial({
        uniforms: antimatterUniforms,
        vertexShader: antimatterVertexShader,
        fragmentShader: antimatterFragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    });

    for(let i=0; i<podCount; i++) {
        const angle = (i / podCount) * Math.PI * 2;
        
        const podAssembly = new THREE.Group();

        // Glass casing
        const casing = new THREE.Mesh(podGeo, glass);
        podAssembly.add(casing);

        // Glowing antimatter core
        const coreGeo = new THREE.CylinderGeometry(12, 12, 100, 32);
        const core = new THREE.Mesh(coreGeo, podCoreMat);
        podAssembly.add(core);

        // Caps
        const topCap = new THREE.Mesh(podCapGeo, darkSteel);
        topCap.position.y = 60;
        topCap.rotation.x = Math.PI / 2;
        podAssembly.add(topCap);

        const botCap = new THREE.Mesh(podCapGeo, darkSteel);
        botCap.position.y = -60;
        botCap.rotation.x = Math.PI / 2;
        podAssembly.add(botCap);

        // Heavy containment bracing
        const braceGeo = new THREE.BoxGeometry(45, 130, 5);
        for(let j=0; j<4; j++) {
            const brace = new THREE.Mesh(braceGeo, chrome);
            brace.rotation.y = (j * Math.PI) / 2;
            podAssembly.add(brace);
        }

        podAssembly.position.x = Math.cos(angle) * (ringRadius + 150);
        podAssembly.position.z = Math.sin(angle) * (ringRadius + 150);
        podAssembly.position.y = 0;
        
        podAssembly.lookAt(0, 0, 0);
        podAssembly.rotateX(Math.PI / 2);

        podsGroup.add(podAssembly);
    }

    parts.push({
        name: 'Penning Trap Antimatter Containment Pods',
        description: '24 massive cylindrical pods located on the outer periphery. Each houses a pure vacuum where synthesized antihydrogen and antiprotons are suspended in complex magnetic and electrostatic fields (Penning traps). The magenta glow is a byproduct of trace annihilation from imperfect vacuum, safely venting energy. These hold enough destructive yield to shatter a small moon.',
        material: 'Diamondoid Glass, Chrome Bracing, Plasma Core',
        function: 'Stores synthesized antimatter safely away from baryonic matter.',
        assemblyOrder: 5,
        connections: ['Transfer_Conduits', 'Outer_Ring_Hub'],
        failureEffect: 'Trap field failure causes immediate contact between antimatter and pod walls.',
        cascadeFailures: ['Cataclysmic Annihilation', 'Chain reaction to adjacent pods', 'System vaporization'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 500, y: 0, z: 500 }
    });


    // ==========================================
    // 6. COOLING RADIATORS (HEAT DISSIPATION)
    // ==========================================

    const radiatorCount = 48;
    const radiatorsGroup = new THREE.Group();
    group.add(radiatorsGroup);

    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(100, 0);
    finShape.lineTo(80, 200);
    finShape.lineTo(20, 200);
    finShape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
    
    for(let i=0; i<radiatorCount; i++) {
        const angle = (i / radiatorCount) * Math.PI * 2;
        
        const radiatorAssembly = new THREE.Group();
        
        for(let f=0; f<5; f++) {
            const fin = new THREE.Mesh(finGeo, darkSteel);
            fin.position.z = f * 15 - 30; // offset in Z
            radiatorAssembly.add(fin);
        }

        const pipeGeo = new THREE.CylinderGeometry(8, 8, 80, 16);
        const heatPipe = new THREE.Mesh(pipeGeo, new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 2.0 }));
        heatPipe.rotation.x = Math.PI / 2;
        heatPipe.position.set(50, 50, 0);
        radiatorAssembly.add(heatPipe);

        const yOffset = (i % 2 === 0) ? 100 : -100;
        radiatorAssembly.position.x = Math.cos(angle) * (ringRadius + 50);
        radiatorAssembly.position.z = Math.sin(angle) * (ringRadius + 50);
        radiatorAssembly.position.y = yOffset;
        
        radiatorAssembly.lookAt(0, yOffset, 0);
        if (yOffset > 0) radiatorAssembly.rotateZ(Math.PI);

        radiatorsGroup.add(radiatorAssembly);
    }

    parts.push({
        name: 'Graphene-Core Thermal Radiator Arrays',
        description: 'Operating at god-tier energies generates petawatts of waste heat. These 48 radiator banks use liquid lithium pumped through graphene cores to bleed heat into the vacuum of space. The bases glow an angry orange/red from the extreme thermal load. Without them, the superconductors would quench in seconds.',
        material: 'Graphene, Dark Steel, Liquid Lithium',
        function: 'Dissipates petawatts of waste heat generated by the particle accelerators.',
        assemblyOrder: 6,
        connections: ['Superconducting_Coils', 'Coolant_Pumps'],
        failureEffect: 'Overheating of local ring sectors, followed by superconductor quench.',
        cascadeFailures: ['Magnetic containment failure', 'Antimatter breach'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });


    // ==========================================
    // 7. ENERGY SHIELD GENERATORS
    // ==========================================

    const shieldGeo = new THREE.SphereGeometry(ringRadius + 400, 64, 64);
    const shieldMesh = new THREE.Mesh(shieldGeo, energyShieldMaterial);
    shieldMesh.scale.set(1, 0.3, 1);
    group.add(shieldMesh);
    meshes.shield = shieldMesh;

    parts.push({
        name: 'Omni-Directional Plasma Deflector Shield',
        description: 'A faint, highly energetic plasma bubble sculpted by gravitational wave generators. It protects the fragile ring structure from micrometeorites, solar flares, and high-velocity debris from the gas giant. It ripples and shifts as impacts occur, maintaining a perfect equilibrium.',
        material: 'Magnetically Contained Plasma',
        function: 'Protects the facility from orbital debris and radiation.',
        assemblyOrder: 7,
        connections: ['Shield_Emitters', 'Main_Reactor'],
        failureEffect: 'Debris strikes the vacuum torus, causing physical breaches.',
        cascadeFailures: ['Vacuum loss', 'Containment failure', 'Total destruction'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });


    // ==========================================
    // 8. PARTICLE STREAMS (ANIMATED BUFFER GEOMETRY)
    // ==========================================

    const siphonParticleCount = 20000;
    const siphonGeo = new THREE.BufferGeometry();
    const siphonPositions = new Float32Array(siphonParticleCount * 3);
    const siphonLifetimes = new Float32Array(siphonParticleCount);
    const siphonAngles = new Float32Array(siphonParticleCount); 

    for(let i=0; i<siphonParticleCount; i++) {
        siphonPositions[i*3] = 0;
        siphonPositions[i*3+1] = 0;
        siphonPositions[i*3+2] = 0;
        siphonLifetimes[i] = Math.random(); 
        const scoopIndex = Math.floor(Math.random() * scoopCount);
        siphonAngles[i] = (scoopIndex / scoopCount) * Math.PI * 2;
    }
    siphonGeo.setAttribute('position', new THREE.BufferAttribute(siphonPositions, 3));
    siphonGeo.setAttribute('lifetime', new THREE.BufferAttribute(siphonLifetimes, 1));
    siphonGeo.setAttribute('angle', new THREE.BufferAttribute(siphonAngles, 1));

    const siphonMat = new THREE.PointsMaterial({
        color: 0x00ffff, size: 4.0, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
    });
    const siphonPoints = new THREE.Points(siphonGeo, siphonMat);
    group.add(siphonPoints);
    meshes.siphonPoints = siphonPoints;

    parts.push({
        name: 'Ionized Gas Intake Stream',
        description: 'A torrential flow of highly ionized isotopic gases being ripped from the planet\'s upper atmosphere and pulled into the magnetic scoops. Visually manifests as a blindingly bright cyan particle stream tracing magnetic field lines.',
        material: 'Ionized Gas (Plasma)',
        function: 'Raw material transit from planet to facility.',
        assemblyOrder: 8,
        connections: ['Gas_Giant', 'Magnetic_Scoops'],
        failureEffect: 'Stream diffuses, causing localized radiation spikes.',
        cascadeFailures: ['Efficiency drop', 'Sensor blindness'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    const beamParticleCount = 30000;
    const beamGeo = new THREE.BufferGeometry();
    const beamPositions = new Float32Array(beamParticleCount * 3);
    const beamAngles = new Float32Array(beamParticleCount);
    const beamOffsets = new Float32Array(beamParticleCount * 3);

    for(let i=0; i<beamParticleCount; i++) {
        beamAngles[i] = Math.random() * Math.PI * 2;
        const r = Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        beamOffsets[i*3] = r * Math.cos(theta); 
        beamOffsets[i*3+1] = r * Math.sin(theta); 
        beamOffsets[i*3+2] = 0; 
    }
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
    beamGeo.setAttribute('angle', new THREE.BufferAttribute(beamAngles, 1));
    beamGeo.setAttribute('offset', new THREE.BufferAttribute(beamOffsets, 3));

    const beamMat = new THREE.PointsMaterial({
        color: 0xff00ff, size: 6.0, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending
    });
    const beamPoints = new THREE.Points(beamGeo, beamMat);
    acceleratorGroup.add(beamPoints);
    meshes.beamPoints = beamPoints;

    parts.push({
        name: 'Relativistic Antiproton Beam',
        description: 'A densely packed stream of antiprotons traveling in a perfect circle at 0.9999999c. The immense energy causes surrounding vacuum fluctuations to emit a harsh magenta/violet Cherenkov glow. Collisions are strictly controlled at specific intersection points to synthesize heavier antimatter elements.',
        material: 'Antiprotons',
        function: 'Kinetic and mass energy storage/synthesis.',
        assemblyOrder: 9,
        connections: ['Vacuum_Torus'],
        failureEffect: 'Beam scatter causes catastrophic annihilation with the inner tube wall.',
        cascadeFailures: ['Facility Destruction'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });


    // ==========================================
    // 9. COMMAND NEXUS & DOCKING BAYS
    // ==========================================

    const nexusGroup = new THREE.Group();
    group.add(nexusGroup);

    const nexusBaseGeo = new THREE.CylinderGeometry(80, 100, 200, 16);
    const nexusBase = new THREE.Mesh(nexusBaseGeo, highTechMetal);
    nexusBase.position.set(ringRadius, 0, 0);
    nexusGroup.add(nexusBase);

    const nexusDomeGeo = new THREE.SphereGeometry(70, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const nexusDome = new THREE.Mesh(nexusDomeGeo, tinted);
    nexusDome.position.set(ringRadius, 100, 0);
    nexusGroup.add(nexusDome);
    
    const nexusRingGeo = new THREE.TorusGeometry(120, 5, 16, 64);
    for(let i=0; i<3; i++) {
        const nr = new THREE.Mesh(nexusRingGeo, neonBlue);
        nr.position.set(ringRadius, -50 + i * 50, 0);
        nr.rotation.x = Math.PI / 2;
        nexusGroup.add(nr);
    }

    parts.push({
        name: 'Primary Command Nexus & Observation Dome',
        description: 'The highly shielded nerve center of the factory. Encased in 50 meters of neutronium-laced armor and topped with an observation dome of tinted hyper-glass. Here, AI and specialized operators monitor containment fields, atmospheric siphon rates, and beam luminosity. Located on the outer edge of the ring to minimize radiation exposure from the central gas giant.',
        material: 'Neutronium Armor, Tinted Hyper-Glass',
        function: 'Central control and monitoring.',
        assemblyOrder: 10,
        connections: ['Main_Ring_Data_Bus', 'Life_Support'],
        failureEffect: 'Loss of facility control, automatic fail-deadly scuttling protocols engage.',
        cascadeFailures: ['Total facility lockdown', 'Scuttle detonation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 800, y: 300, z: 0 }
    });


    // ==========================================
    // 10. QUIZ QUESTIONS
    // ==========================================

    const quizQuestions = [
        {
            question: "In the context of the factory's Penning traps, what combination of fields is required to confine the synthesized antiprotons in three dimensions?",
            options: [
                "A strong, homogeneous axial magnetic field and a quadrupole electric field.",
                "A rotating dipole magnetic field and a static gravitational gradient.",
                "A toroidal electric field and a transverse magnetic field.",
                "High-frequency laser cooling fields and a strong electrostatic dipole."
            ],
            correctAnswer: 0,
            explanation: "A Penning trap uses a strong, homogeneous axial magnetic field to confine charged particles radially, and a quadrupole electric field to confine them axially."
        },
        {
            question: "The relativistic antiproton beam travels at \u03b3 (Lorentz factor) = 1000. Assuming the ring radius is 1400 meters, what is the approximate required magnetic field strength (in Tesla) to maintain circular orbit for a proton/antiproton? (Given: p = \u03b3mv, e = 1.6e-19 C, m_p = 1.67e-27 kg, c = 3e8 m/s)",
            options: [
                "~2.23 Tesla",
                "~5.40 Tesla",
                "~0.85 Tesla",
                "~14.5 Tesla"
            ],
            correctAnswer: 0,
            explanation: "Using p = qBR, B = p / (qR). p = \u03b3 * m_p * c = 1000 * 1.67e-27 * 3e8 \u2248 5e-16 kg m/s. B = 5e-16 / (1.6e-19 * 1400) = 5e-16 / 2.24e-16 \u2248 2.23 Tesla."
        },
        {
            question: "Why does the magnetic scoop system induce Cherenkov radiation in the inner coils even when operating in the upper atmosphere rather than a dense medium?",
            options: [
                "The extreme magnetic compression of the siphoned gas increases the local refractive index significantly, lowering the local speed of light below the particles' velocity.",
                "Cherenkov radiation always occurs when particles accelerate, regardless of the medium's refractive index.",
                "The coils emit tachyon particles which inherently glow blue.",
                "The siphoned gas undergoes rapid nuclear fusion, emitting blue photons."
            ],
            correctAnswer: 0,
            explanation: "Cherenkov radiation occurs when a charged particle passes through a dielectric medium at a speed greater than the phase velocity of light in that medium. By heavily compressing the gas, the refractive index increases, allowing highly energetic particles to exceed the local speed of light."
        },
        {
            question: "If a micro-breach occurs in the vacuum torus, allowing 1 microgram of atmospheric hydrogen to interact with the antiproton beam, what is the approximate energy yield of the resulting annihilation? (E=mc^2)",
            options: [
                "~180 Megajoules",
                "~90 Megajoules",
                "~360 Megajoules",
                "~1.8 Gigajoules"
            ],
            correctAnswer: 0,
            explanation: "Total mass annihilated is 1 \u03bcg of hydrogen + 1 \u03bcg of antiprotons = 2 \u03bcg = 2e-9 kg. E = mc^2 = 2e-9 * (3e8)^2 = 2e-9 * 9e16 = 18e7 = 180 Megajoules."
        },
        {
            question: "The Niobium-Titanium superconducting coils operate at 1.2 Kelvin. Which cryogenic phenomena is utilized to achieve and maintain temperatures below the lambda point of helium (2.17 K) for maximum thermal conductivity?",
            options: [
                "Superfluid Helium-4 phase transition.",
                "Laser Doppler cooling.",
                "Peltier-Seebeck thermoelectric cooling.",
                "Adiabatic demagnetization of paramagnetic salts."
            ],
            correctAnswer: 0,
            explanation: "Below 2.17 K (the lambda point), Helium-4 becomes a superfluid (He II), which has effectively zero viscosity and extremely high thermal conductivity, making it ideal for bathing superconducting magnets to prevent quench events."
        }
    ];

    // ==========================================
    // 11. ANIMATION LOOP
    // ==========================================

    const animate = (time, speed, meshesRef) => {
        const t = time * 0.001 * speed; // Base time scalar

        // 1. Update Shaders
        if (planetUniforms) planetUniforms.time.value = t * 0.5;
        if (antimatterUniforms) antimatterUniforms.time.value = t * 2.0;

        // 2. Rotate the Planet
        if (meshesRef.planet) {
            meshesRef.planet.rotation.y = t * 0.05; // Slow rotation for massive body
        }

        // 3. Rotate the Main Ring Structure
        if (meshesRef.acceleratorGroup) {
            meshesRef.acceleratorGroup.rotation.y = t * 0.1;
            meshesRef.acceleratorGroup.rotation.x = Math.sin(t * 0.02) * 0.05; // Slight wobble
            meshesRef.acceleratorGroup.rotation.z = Math.cos(t * 0.02) * 0.05;
        }

        // 4. Rotate the Shield
        if (meshesRef.shield) {
            meshesRef.shield.rotation.y = -t * 0.15;
            meshesRef.shield.rotation.z = t * 0.05;
        }

        // 5. Animate Siphon Particles (Planet to Scoops)
        if (meshesRef.siphonPoints) {
            const positions = meshesRef.siphonPoints.geometry.attributes.position.array;
            const lifetimes = meshesRef.siphonPoints.geometry.attributes.lifetime.array;
            const angles = meshesRef.siphonPoints.geometry.attributes.angle.array;

            for(let i=0; i<siphonParticleCount; i++) {
                lifetimes[i] += 0.01 * speed;
                if (lifetimes[i] > 1.0) lifetimes[i] = 0.0; // Reset

                const life = lifetimes[i];
                const currentRadius = 800 + (life * 500); 
                const angle = angles[i];
                
                const spiralAngle = angle + (life * Math.PI * 4); 
                const heightWobble = Math.sin(life * Math.PI * 10 + i) * 20 * (1.0 - life);

                positions[i*3] = Math.cos(spiralAngle) * currentRadius;
                positions[i*3+1] = heightWobble;
                positions[i*3+2] = Math.sin(spiralAngle) * currentRadius;
            }
            meshesRef.siphonPoints.geometry.attributes.position.needsUpdate = true;
        }

        // 6. Animate Accelerator Beam (Relativistic speed)
        if (meshesRef.beamPoints) {
            const positions = meshesRef.beamPoints.geometry.attributes.position.array;
            const angles = meshesRef.beamPoints.geometry.attributes.angle.array;
            const offsets = meshesRef.beamPoints.geometry.attributes.offset.array;

            for(let i=0; i<beamParticleCount; i++) {
                angles[i] += 0.5 * speed; 
                if (angles[i] > Math.PI * 2) angles[i] -= Math.PI * 2;

                const a = angles[i];
                const baseX = Math.cos(a) * ringRadius;
                const baseZ = Math.sin(a) * ringRadius;

                const offsetX = offsets[i*3];
                const offsetY = offsets[i*3+1];
                
                const rotatedOffsetX = offsetX * Math.cos(a);
                const rotatedOffsetZ = offsetX * Math.sin(a);

                positions[i*3] = baseX + rotatedOffsetX;
                positions[i*3+1] = offsetY; 
                positions[i*3+2] = baseZ + rotatedOffsetZ;
            }
            meshesRef.beamPoints.geometry.attributes.position.needsUpdate = true;
        }
    };

    return {
        group,
        parts,
        description: "The God Tier Antimatter Factory Ring is a megastructure of incomprehensible scale and complexity. Orbiting a procedurally generated sub-Jovian gas giant, it utilizes massive magnetic scoops to siphon isotopic atmospheric gases. These gases are ionized and injected into a 1400-meter radius primary particle accelerator torus, where they are driven to relativistic speeds by 360 superconducting Niobium-Titanium coils. Antimatter synthesized from controlled collisions is securely stored in 24 Penning trap pods on the periphery. The entire facility is protected by a dynamically fluctuating omni-directional plasma shield and governed from a heavily armored neutronium command nexus.",
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}
