import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    const description = "God-Tier Computronium Planet (Matrioshka Brain Core): The absolute pinnacle of Type III Civilization engineering. An entire planetary mass has been atomically re-engineered into a maximally efficient computational matrix. It features a trapped primordial micro-black hole for energy generation, subterranean quantum logic matrices cooled to 2.73 Kelvin, a planetary-scale ocean of superfluid coolant, and surface continents constructed entirely of hyper-dense circuitry and skyscraper-sized logic gates. Massive transmission spires and equatorial accelerator rings facilitate interstellar data bandwidth. This construct operates at the fundamental limits of physics, maximizing Bremermann's limit and the Bekenstein bound.";

    // ============================================================================
    // CONSTANTS & CONFIGURATION
    // ============================================================================
    const RADIUS_CORE = 150;
    const RADIUS_MANTLE = 350;
    const RADIUS_OCEAN = 500;
    const RADIUS_CRUST = 505;
    const RADIUS_ATMOSPHERE = 700;
    const RADIUS_RINGS = 900;
    
    // ============================================================================
    // SHADER NOISE LIBRARIES
    // ============================================================================
    const snoise3D = `
    // Simplex 3D Noise 
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
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0; // N=7
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
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
    `;

    const voronoi3D = `
    vec3 hash3( vec3 p ) {
        p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
                  dot(p,vec3(269.5,183.3,246.1)),
                  dot(p,vec3(113.5,271.9,124.6)));
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    float voronoi( in vec3 x ) {
        vec3 p = floor( x );
        vec3 f = fract( x );
        float res = 100.0;
        for( int k=-1; k<=1; k++ )
        for( int j=-1; j<=1; j++ )
        for( int i=-1; i<=1; i++ ) {
            vec3 b = vec3( float(i), float(j), float(k) );
            vec3 r = vec3( b ) - f + hash3( p + b );
            float d = dot( r, r );
            if( d < res ) res = d;
        }
        return sqrt( res );
    }
    `;

    // ============================================================================
    // CUSTOM SHADER MATERIALS
    // ============================================================================
    
    // 1. Plasma Core Material (Micro Black Hole Accretion Disk / Hawking Radiation)
    const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color1: { value: new THREE.Color(0xff0044) },
            color2: { value: new THREE.Color(0xffaa00) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float time;
            ${snoise3D}
            void main() {
                vUv = uv;
                vNormal = normal;
                vec3 pos = position;
                float displacement = snoise(pos * 0.02 + time * 0.5) * 15.0;
                pos += normal * displacement;
                vPosition = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            ${snoise3D}
            void main() {
                float intensity = snoise(vPosition * 0.05 + time) * 0.5 + 0.5;
                vec3 finalColor = mix(color1, color2, intensity);
                float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(finalColor * (1.0 + fresnel * 2.0), 1.0);
            }
        `,
        wireframe: false,
        transparent: true
    });

    // 2. Coolant Ocean Material (Deep Cyan/Blue Rippling Superfluid)
    const oceanMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            colorBase: { value: new THREE.Color(0x001133) },
            colorGlow: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            uniform float time;
            ${snoise3D}
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vec3 pos = position;
                // Complex wave interference pattern for non-Newtonian superfluid
                float wave = snoise(pos * 0.05 + time * 0.2) * 8.0;
                wave += snoise(pos * 0.1 - time * 0.4) * 4.0;
                pos += normal * wave;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            uniform vec3 colorBase;
            uniform vec3 colorGlow;
            uniform float time;
            ${snoise3D}
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                float fresnel = dot(normal, viewDir);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                fresnel = pow(fresnel, 3.0);
                
                float surfaceNoise = snoise(vec3(vUv * 100.0, time * 0.1)) * 0.5 + 0.5;
                vec3 color = mix(colorBase, colorGlow, fresnel + surfaceNoise * 0.2);
                
                gl_FragColor = vec4(color, 0.85);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });

    // 3. Planetary Circuit Grid Material (City Lights / Trillion-node Matrix)
    const circuitMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            uniform float time;
            ${snoise3D}
            ${voronoi3D}
            void main() {
                vec3 color = vec3(0.01, 0.01, 0.02); // Dark base metal
                
                // Tech grid lines
                float gridX = step(0.98, fract(vUv.x * 500.0));
                float gridY = step(0.98, fract(vUv.y * 500.0));
                float grid = max(gridX, gridY);
                
                float n1 = snoise(vec3(vUv * 200.0, time * 0.05));
                if (grid > 0.0 && n1 > 0.0) {
                    color += vec3(0.0, 0.8, 0.4) * n1 * 2.0;
                }
                
                // Voronoi memory sectors
                float v = voronoi(vec3(vUv * 50.0, 0.0));
                float sectorGlow = step(0.8, snoise(vec3(v * 10.0, 0.0, time * 0.2)));
                color += vec3(0.8, 0.2, 1.0) * sectorGlow * 0.5;
                
                // Data Rivers (Tachyon bursts)
                float river = step(0.9, snoise(vec3(vUv.y * 10.0, vUv.x * 5.0, time * 0.5)));
                color += vec3(0.0, 0.5, 1.0) * river * 2.0;

                gl_FragColor = vec4(color, 1.0);
            }
        `
    });

    // 4. Hexagonal Atmospheric Shield Material
    const shieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vec2 p = vUv * 150.0;
                vec2 p1 = p;
                p1.x *= 1.1547;
                p1.y += 0.5 * mod(floor(p1.x), 2.0);
                vec2 f = fract(p1);
                float d = max(abs(f.x - 0.5), abs(f.y - 0.5) * 1.1547 + abs(f.x - 0.5) * 0.5773);
                float hex = smoothstep(0.42, 0.48, d);
                
                float pulse = sin(time * 2.0 + vUv.y * 20.0) * 0.5 + 0.5;
                vec3 color = vec3(0.0, 0.6, 1.0) * hex * pulse;
                
                gl_FragColor = vec4(color, hex * pulse * 0.4);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // 5. Data Beam Material
    const beamMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            uniform vec3 color;
            ${snoise3D}
            void main() {
                float stream = snoise(vec3(vUv.x * 20.0, vUv.y * 100.0 - time * 5.0, 0.0));
                stream = smoothstep(0.2, 0.8, stream);
                
                // Edge fade
                float edge = sin(vUv.x * 3.14159);
                
                gl_FragColor = vec4(color * stream * 2.0, stream * edge);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    // ============================================================================
    // GEOMETRY GENERATORS
    // ============================================================================
    
    // Generate an incredibly complex 2D shape for extrusion (Logic Gate / Circuit)
    function createComplexCircuitShape() {
        const shape = new THREE.Shape();
        const radius = 25;
        const teeth = 128;
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;
            const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
            // Generate pseudo-random tooth depth based on index to simulate complex circuitry
            const depth = 0.5 + (Math.sin(i * 13.7) * Math.cos(i * 5.1)) * 0.5; 
            const innerR = radius * (0.7 + depth * 0.1);
            const outerR = radius;
            
            shape.lineTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
            shape.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
            shape.lineTo(Math.cos(nextAngle) * outerR, Math.sin(nextAngle) * outerR);
            shape.lineTo(Math.cos(nextAngle) * innerR, Math.sin(nextAngle) * innerR);
        }
        shape.lineTo(Math.cos(0) * radius * 0.8, Math.sin(0) * radius * 0.8);
        
        // Add multiple holes (cooling vents / data shafts)
        for (let j = 0; j < 16; j++) {
            const hAngle = (j / 16) * Math.PI * 2;
            const hPath = new THREE.Path();
            const hX = Math.cos(hAngle) * radius * 0.4;
            const hY = Math.sin(hAngle) * radius * 0.4;
            hPath.absarc(hX, hY, radius * 0.08, 0, Math.PI * 2, false);
            shape.holes.push(hPath);
        }
        // Inner central shaft hole
        const centerHole = new THREE.Path();
        centerHole.absarc(0, 0, radius * 0.2, 0, Math.PI * 2, false);
        shape.holes.push(centerHole);

        return shape;
    }

    // Generate complex Lathe profile for Polar Spires
    function createSpireGeometry() {
        const points = [];
        const height = 1500;
        const segments = 250;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = t * height;
            // Extremely intricate mathematical profile
            const baseCurve = Math.exp(-t * 6) * 150;
            const fractalRipples = Math.sin(t * 150) * 8 * Math.exp(-t * 2);
            const dataNodes = Math.pow(Math.sin(t * 500), 2) * 3;
            const minimumThickness = 5;
            
            const x = baseCurve + fractalRipples + dataNodes + minimumThickness;
            points.push(new THREE.Vector2(x, y));
        }
        return new THREE.LatheGeometry(points, 64);
    }

    // Generate tube-based wireframe for the planetary shield (No simple lines)
    function createTubeWireframe(geometry, radius, material) {
        const edges = new THREE.EdgesGeometry(geometry);
        const lines = edges.attributes.position.array;
        const wireGroup = new THREE.Group();
        
        // Instantiate a cylinder for each edge
        const cylinderGeo = new THREE.CylinderGeometry(radius, radius, 1, 8);
        // Translate cylinder geometry so it scales cleanly
        cylinderGeo.translate(0, 0.5, 0);
        cylinderGeo.rotateX(Math.PI / 2);

        const edgeCount = lines.length / 6;
        const instancedMesh = new THREE.InstancedMesh(cylinderGeo, material, edgeCount);
        
        const dummy = new THREE.Object3D();
        for (let i = 0; i < lines.length; i += 6) {
            const p1 = new THREE.Vector3(lines[i], lines[i+1], lines[i+2]);
            const p2 = new THREE.Vector3(lines[i+3], lines[i+4], lines[i+5]);
            const dist = p1.distanceTo(p2);
            
            dummy.position.copy(p1);
            dummy.lookAt(p2);
            dummy.scale.set(1, 1, dist);
            dummy.updateMatrix();
            
            instancedMesh.setMatrixAt(i / 6, dummy.matrix);
        }
        wireGroup.add(instancedMesh);
        return wireGroup;
    }

    // ============================================================================
    // PART REGISTRATION & CONSTRUCTION
    // ============================================================================
    
    function addPart(name, mesh, meta) {
        group.add(mesh);
        parts.push({
            name: name,
            description: meta.desc,
            material: meta.mat,
            function: meta.func,
            assemblyOrder: meta.order,
            connections: meta.conn,
            failureEffect: meta.fail,
            cascadeFailures: meta.cascade,
            originalPosition: meta.orig,
            explodedPosition: meta.exp
        });
        if (meta.update) {
            updatables.push({ mesh, update: meta.update });
        }
    }

    // 1. Quantum Singularity Core
    const coreGeo = new THREE.IcosahedronGeometry(RADIUS_CORE, 16);
    const coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
    addPart("Primordial Black Hole Core", coreMesh, {
        desc: "A stabilized primordial micro-black hole suspended in a perfect gravitational vacuum. It serves as the ultimate energy source, emitting immense Hawking radiation which is perfectly captured by the surrounding Dyson matrix.",
        mat: "Quantum Chromodynamic Plasma (Custom GLSL Simplex Displacement Shader)",
        func: "Infinite Energy Generation via Hawking Radiation Harvesting",
        order: 1,
        conn: ["Dyson Energy Harvester", "Quantum Bus Highways"],
        fail: "Loss of gravitational confinement resulting in immediate spontaneous evaporation or runaway accretion.",
        cascade: ["total_planetary_vaporization", "local_space_time_rupture"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: 0, y: -4000, z: 0},
        update: (time, speed) => {
            coreMaterial.uniforms.time.value = time * speed;
            coreMesh.rotation.y = time * speed * 0.2;
            coreMesh.rotation.x = time * speed * 0.15;
            // Pulsate slightly
            const scale = 1.0 + Math.sin(time * speed * 2.0) * 0.05;
            coreMesh.scale.set(scale, scale, scale);
        }
    });

    // 2. Dyson Energy Harvester Sphere
    const dysonGeo = new THREE.IcosahedronGeometry(RADIUS_CORE + 20, 4);
    const dysonMesh = createTubeWireframe(dysonGeo, 2.0, darkSteel);
    addPart("Dyson Harvesting Matrix", dysonMesh, {
        desc: "A hyper-dense geodesic sphere made of incredibly heat-resistant dark steel alloys and superconducting metamaterials, designed to capture 99.999% of the Hawking radiation emitted by the core.",
        mat: "Superconducting Dark Steel Metamaterial",
        func: "Energy Capture and Initial Distribution",
        order: 2,
        conn: ["Primordial Black Hole Core", "Thermal Dissipation Mantle"],
        fail: "Meltdown of sectors leading to uncontained gamma ray bursts.",
        cascade: ["internal_mantle_scouring", "logic_gate_decoherence"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: 0, y: -3000, z: 0},
        update: (time, speed) => {
            dysonMesh.rotation.z = -time * speed * 0.1;
            dysonMesh.rotation.y = time * speed * 0.05;
        }
    });

    // 3. Subterranean Quantum Logic Mantle
    const mantleGeo = new THREE.TorusKnotGeometry(RADIUS_MANTLE * 0.6, 60, 256, 64, 3, 7);
    const mantleMat = new THREE.MeshStandardMaterial({ 
        color: 0x0044ff, 
        emissive: 0x0011ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const mantleMesh = new THREE.Mesh(mantleGeo, mantleMat);
    addPart("Subterranean Quantum Logic Mantle", mantleMesh, {
        desc: "An impossibly complex topological quantum computer wrapped around the core. Its Torus-Knot structure allows for closed-timelike-curve logic operations and non-Abelian anyon braiding at a planetary scale.",
        mat: "Topological Qubit Lattice (Glowing Blue Wireframe)",
        func: "Primary Non-Linear Quantum Computation",
        order: 3,
        conn: ["Dyson Harvesting Matrix", "Planetary Coolant Oceans"],
        fail: "Widespread quantum decoherence and irreversible data corruption.",
        cascade: ["memory_bank_wipe", "computational_hallucinations"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: -2500, y: -2000, z: 0},
        update: (time, speed) => {
            mantleMesh.rotation.x = time * speed * 0.05;
            mantleMesh.rotation.y = time * speed * 0.08;
        }
    });

    // 4. Planetary Coolant Oceans
    const oceanGeo = new THREE.IcosahedronGeometry(RADIUS_OCEAN, 32);
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMaterial);
    addPart("Primary Coolant Ocean", oceanMesh, {
        desc: "A planetary-wide reservoir of non-Newtonian superfluid helium-3 operating precisely at 2.73 Kelvin. The ocean absorbs the catastrophic heat output of the computational mantle and circulates it towards the orbital radiator arrays.",
        mat: "Superfluid Helium-3 (Custom Rippling Ocean Shader)",
        func: "Thermodynamic Entropy Dissipation",
        order: 4,
        conn: ["Subterranean Quantum Logic Mantle", "Surface Processor Crust"],
        fail: "Flash boiling of the superfluid resulting in planetary-scale thermodynamic explosion.",
        cascade: ["crust_shatter", "orbital_radiator_overload"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: 2500, y: -2000, z: 0},
        update: (time, speed) => {
            oceanMaterial.uniforms.time.value = time * speed;
        }
    });

    // 5. Surface Processor Crust
    const crustGeo = new THREE.IcosahedronGeometry(RADIUS_CRUST, 64);
    const crustMesh = new THREE.Mesh(crustGeo, circuitMaterial);
    addPart("Surface Processor Crust (Continent Alpha)", crustMesh, {
        desc: "The solid surface of the planet, composed entirely of molecular circuits, logic gates, and memory arrays. There is no natural terrain; every square millimeter is dedicated to data processing. Visible from space as a sprawling, glowing, globe-spanning city.",
        mat: "Programmable Matter (Procedural Tech/City Lights Shader)",
        func: "Classical and Hybrid Data Processing",
        order: 5,
        conn: ["Primary Coolant Ocean", "Equatorial Data Accelerator Ring", "Polar Spire Arrays"],
        fail: "Massive localized logic lockups and data traffic jams.",
        cascade: ["data_spill", "regional_meltdown"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: 0, y: 0, z: -3000},
        update: (time, speed) => {
            circuitMaterial.uniforms.time.value = time * speed;
            crustMesh.rotation.y = time * speed * 0.02; // Slow planetary rotation
        }
    });

    // 6. Macro Logic Gate Towers (Instanced Surface Greebles)
    const towerShape = createComplexCircuitShape();
    const extrudeSettings = { depth: 40, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const towerGeo = new THREE.ExtrudeGeometry(towerShape, extrudeSettings);
    towerGeo.center(); // Center geometry for proper instancing
    towerGeo.scale(0.2, 0.2, 0.5); // Make them tall
    
    const towerMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.8,
        metalness: 1.0,
        emissive: 0x003311,
        emissiveIntensity: 0.5
    });
    
    const TOWER_COUNT = 8000;
    const towerInstanced = new THREE.InstancedMesh(towerGeo, towerMat, TOWER_COUNT);
    const tDummy = new THREE.Object3D();
    const upVector = new THREE.Vector3(0, 1, 0);
    
    for (let i = 0; i < TOWER_COUNT; i++) {
        // Distribute points evenly on a sphere using Fibonacci lattice
        const phi = Math.acos(1 - 2 * (i + 0.5) / TOWER_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        
        const x = (RADIUS_CRUST - 2) * Math.sin(phi) * Math.cos(theta);
        const y = (RADIUS_CRUST - 2) * Math.cos(phi);
        const z = (RADIUS_CRUST - 2) * Math.sin(phi) * Math.sin(theta);
        
        tDummy.position.set(x, y, z);
        const normal = tDummy.position.clone().normalize();
        tDummy.quaternion.setFromUnitVectors(upVector, normal);
        
        // Randomize rotation around its own up-axis
        tDummy.rotateY(Math.random() * Math.PI * 2);
        
        // Randomize scale for variety
        const s = 0.5 + Math.random() * 1.5;
        tDummy.scale.set(s, s, s * (1.0 + Math.random() * 2.0));
        
        tDummy.updateMatrix();
        towerInstanced.setMatrixAt(i, tDummy.matrix);
    }
    
    // Parent towers to the crust so they rotate with it
    crustMesh.add(towerInstanced); 
    addPart("Macro Logic Gate Towers (Surface Greebles)", towerInstanced, {
        desc: "8,000 skyscraper-sized physical logic gates protruding from the crust. These massive structures handle specific hard-coded algorithmic subroutines that require immense physical space, such as massive parallel cryptographic cracking.",
        mat: "Industrial Dark Steel and Neon",
        func: "Hardware-Accelerated Cryptography and Hash Sorting",
        order: 6,
        conn: ["Surface Processor Crust"],
        fail: "Algorithmic bottlenecking causing planetary computation to slow by 0.04%.",
        cascade: ["request_timeouts", "data_queue_overflow"],
        orig: {x: 0, y: 0, z: 0}, // Relative to crust
        exp: {x: 0, y: 0, z: 0},
        update: null // Rotates with crust
    });

    // 7. Equatorial Data Accelerator Ring
    const ringGroup = new THREE.Group();
    // Inner solid ring
    const ringTorusGeo = new THREE.TorusGeometry(RADIUS_RINGS, 20, 64, 128);
    const ringMesh = new THREE.Mesh(ringTorusGeo, chrome);
    ringMesh.rotation.x = Math.PI / 2;
    ringGroup.add(ringMesh);
    
    // Outer floating data rails (TorusKnots)
    const railMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xaa00aa, wireframe: true });
    const rail1 = new THREE.Mesh(new THREE.TorusKnotGeometry(RADIUS_RINGS, 10, 256, 32, 2, 3), railMat);
    rail1.rotation.x = Math.PI / 2;
    const rail2 = new THREE.Mesh(new THREE.TorusKnotGeometry(RADIUS_RINGS, 10, 256, 32, 2, 3), railMat);
    rail2.rotation.x = Math.PI / 2;
    rail2.rotation.z = Math.PI / 2;
    ringGroup.add(rail1);
    ringGroup.add(rail2);

    addPart("Equatorial Data Accelerator Ring", ringGroup, {
        desc: "A massive, magnetically levitated particle accelerator encircling the planet. Instead of smashing particles, it accelerates packets of highly entangled qubits at 99.9999% the speed of light to distribute data instantaneously across hemispheres.",
        mat: "Chrome and Superconducting Magenta Rail-Tubes",
        func: "Global High-Speed Data Bus",
        order: 7,
        conn: ["Surface Processor Crust"],
        fail: "Catastrophic derailment of data packets resulting in a plasma explosion equivalent to 500 megatons of TNT.",
        cascade: ["equatorial_crust_shatter", "global_network_partitioning"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: 0, y: 2500, z: 0},
        update: (time, speed) => {
            ringGroup.rotation.y = time * speed * -0.15;
            rail1.rotation.z += speed * 0.01;
            rail2.rotation.z -= speed * 0.01;
        }
    });

    // 8. North Polar Transmission Spire
    const spireGeo = createSpireGeometry();
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2, emissive: 0x002244 });
    const northSpire = new THREE.Mesh(spireGeo, spireMat);
    northSpire.position.y = RADIUS_CRUST - 50;
    addPart("North Polar Transmission Spire", northSpire, {
        desc: "An impossibly tall, intricately sculpted antenna array extending thousands of kilometers into space from the North Pole. It utilizes focused tachyon emissions to establish zero-latency communication with other Matrioshka Brain nodes across the galaxy.",
        mat: "Dark Steel with Blue Emissive Traces (Extremely Detailed Lathe Geometry)",
        func: "Interstellar Data Transmission",
        order: 8,
        conn: ["Surface Processor Crust", "Deep Space Network"],
        fail: "Misalignment of the tachyon beam, potentially irradiating nearby planetary bodies with petabytes of raw data.",
        cascade: ["loss_of_galactic_sync"],
        orig: {x: 0, y: RADIUS_CRUST - 50, z: 0},
        exp: {x: 0, y: 3500, z: 0},
        update: (time, speed) => {
            northSpire.rotation.y = time * speed * 0.5;
        }
    });

    // 9. South Polar Reception Spire
    const southSpire = new THREE.Mesh(spireGeo, spireMat);
    southSpire.position.y = -(RADIUS_CRUST - 50);
    southSpire.rotation.x = Math.PI; // Point downwards
    addPart("South Polar Reception Spire", southSpire, {
        desc: "The counterpart to the North Spire. This massive structure acts as a hyper-sensitive quantum receiver, catching extremely faint signals from distant civilization nodes and decoding them instantly.",
        mat: "Dark Steel with Blue Emissive Traces",
        func: "Interstellar Data Reception",
        order: 9,
        conn: ["Surface Processor Crust", "Deep Space Network"],
        fail: "Signal noise drowning out galactic instructions, leading to brain isolation.",
        cascade: ["desynchronization_from_hive_mind"],
        orig: {x: 0, y: -(RADIUS_CRUST - 50), z: 0},
        exp: {x: 0, y: -3500, z: 0},
        update: (time, speed) => {
            southSpire.rotation.y = -time * speed * 0.5;
        }
    });

    // 10. Atmospheric Defense & Shielding Grid
    const shieldGeo = new THREE.IcosahedronGeometry(RADIUS_ATMOSPHERE, 32);
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMaterial);
    addPart("Atmospheric Holographic Shield Grid", shieldMesh, {
        desc: "A layer of hard-light and magnetically confined plasma forming a perfect hexagonal grid around the planet. It protects the fragile circuitry from micrometeorites, solar flares, and hostile relativistic kill vehicles.",
        mat: "Hard-Light Hexagonal Forcefield (Custom Additive Blend Shader)",
        func: "Planetary Defense and Debris Vaporization",
        order: 10,
        conn: ["Surface Processor Crust"],
        fail: "Punctures in the shield allowing K-T extinction level asteroid impacts on the processor crust.",
        cascade: ["surface_vaporization", "coolant_boil_off"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: 0, y: 0, z: 3500},
        update: (time, speed) => {
            shieldMaterial.uniforms.time.value = time * speed;
            shieldMesh.rotation.y = time * speed * 0.01;
            shieldMesh.rotation.z = time * speed * 0.005;
        }
    });

    // 11. Orbital Radiator Node Swarm
    const nodeGeo = new THREE.OctahedronGeometry(15, 2);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, metalness: 0.8 });
    const NODE_COUNT = 2000;
    const nodeSwarm = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    const nDummy = new THREE.Object3D();
    const ORBITAL_RADIUS_NODES = RADIUS_ATMOSPHERE + 400;
    
    addPart("Orbital Radiator Node Swarm", nodeSwarm, {
        desc: "A swarm of 2,000 massive autonomous satellites in high orbit. They receive excess heat beamed up from the surface via infrared lasers and radiate it away into the deep freeze of space, preventing the planet from melting its own crust.",
        mat: "Thermal Dissipation Ceramic / Hot Orange Glow",
        func: "Secondary Thermodynamic Exhaust",
        order: 11,
        conn: ["Planetary Coolant Oceans"],
        fail: "Swarm misalignment causing heat to bounce back to the surface.",
        cascade: ["thermal_runaway", "core_collapse"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: 4000, y: 4000, z: 0},
        update: (time, speed) => {
            for(let i=0; i<NODE_COUNT; i++) {
                const offset = i * Math.PI * 2 / NODE_COUNT;
                const tilt = (i % 15) * 0.15 - 1.0; 
                // Complex intersecting orbital mechanics
                const currentAngle = time * speed * (0.05 + (i%5)*0.01) + offset;
                
                const x = Math.cos(currentAngle) * (ORBITAL_RADIUS_NODES + (i%50)*2);
                const z = Math.sin(currentAngle) * (ORBITAL_RADIUS_NODES + (i%50)*2);
                const y = Math.sin(currentAngle * 3 + offset) * 300 * tilt;
                
                nDummy.position.set(x, y, z);
                nDummy.rotation.x = time * speed * 2 + offset;
                nDummy.rotation.y = time * speed * 1.5;
                nDummy.updateMatrix();
                nodeSwarm.setMatrixAt(i, nDummy.matrix);
            }
            nodeSwarm.instanceMatrix.needsUpdate = true;
        }
    });

    // 12. Massive Data Beams
    const beamGroup = new THREE.Group();
    const beamGeo = new THREE.CylinderGeometry(15, 15, 6000, 32, 128, true);
    // Align beam geometry so it emanates from the center
    beamGeo.translate(0, 3000, 0);
    
    const colors = [new THREE.Color(0x00ffff), new THREE.Color(0xff00ff), new THREE.Color(0x00ff00), new THREE.Color(0xffffff)];
    for(let i=0; i<8; i++) {
        const mat = beamMaterial.clone();
        mat.uniforms.color.value = colors[i % colors.length];
        const beam = new THREE.Mesh(beamGeo, mat);
        
        // Point beams outwards at various angles
        const phi = Math.acos(1 - 2 * (i + 0.5) / 8);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        beam.rotation.x = phi;
        beam.rotation.y = theta;
        
        beamGroup.add(beam);
        
        updatables.push({
            update: (time, speed) => {
                mat.uniforms.time.value = time * speed;
            }
        });
    }
    
    addPart("Interstellar Communication Beams", beamGroup, {
        desc: "Eight blindingly bright, highly collimated beams of modulated energy shooting directly out of the planet's surface into the cosmos. These beams carry the bulk of the planet's computational output to other star systems.",
        mat: "Pure Coherent Photonic Energy (Additive Shader)",
        func: "Macro-Scale Data Export",
        order: 12,
        conn: ["Surface Processor Crust"],
        fail: "Beam diffusion, leading to catastrophic data loss in transit across lightyears.",
        cascade: ["civilization_fragmentation"],
        orig: {x: 0, y: 0, z: 0},
        exp: {x: -4000, y: -4000, z: 0},
        update: (time, speed) => {
            beamGroup.rotation.y = time * speed * 0.01;
        }
    });

    // ============================================================================
    // QUIZ QUESTIONS (PhD Level Computer Science / Physics)
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of Landauer's principle for a reversible Matrioshka Brain operating near the cosmic microwave background temperature (2.73 K), what is the theoretical minimum energy required to logically erase one bit of information?",
            options: [
                "k_B * T * ln(2), where T = 2.73 K",
                "Planck's constant multiplied by the speed of light",
                "Zero, provided the computation is entirely logically and thermodynamically reversible",
                "1 electron-volt per bit"
            ],
            correctAnswer: 0,
            explanation: "Landauer's principle, formulated by Rolf Landauer in 1961, establishes the fundamental lower bound on the energy dissipation of a logically irreversible operation, such as the erasure of a bit. The formula is E = k_B * T * ln(2), where k_B is the Boltzmann constant, T is the absolute temperature of the heat sink, and ln(2) represents the natural logarithm of 2. For a computronium planet operating precisely at the temperature of the cosmic microwave background (2.73 K) to maximize its thermodynamic efficiency and avoid radiating detectable infrared signatures, the erasure of a single bit of information would theoretically dissipate approximately 2.6 × 10^-23 Joules. While a fully reversible computer theoretically skirts this limit during intermediate steps by never erasing information, the act of erasure itself (to reset the system) must always carry this inescapable thermodynamic cost."
        },
        {
            question: "According to Carnot efficiency limits, if the innermost Dyson shell of this Matrioshka Brain core operates at 5000 K (capturing energy from the micro-black hole's accretion disk) and the outermost orbital radiator swarm emits at exactly 3 K, what is the maximum theoretical thermodynamic efficiency of energy extraction?",
            options: [
                "99.94%",
                "100.00%",
                "60.00%",
                "99.99%"
            ],
            correctAnswer: 0,
            explanation: "The Carnot efficiency defines the maximum possible efficiency of any heat engine operating between two temperatures, T_hot and T_cold, given by the equation η = 1 - (T_cold / T_hot). A Matrioshka Brain extracts work from the temperature gradient between a central energy core (operating at 5000 K in this scenario) and the deep-space environment (the cosmic microwave background at approximately 3 K). Substituting these values yields η = 1 - (3 / 5000) = 1 - 0.0006 = 0.9994, or 99.94%. This represents the absolute physical limit of the energy converted into useful computational work, with the remaining 0.06% fundamentally lost as waste heat (entropy) which must be radiated away by the outermost spherical shell to prevent catastrophic thermal runaway."
        },
        {
            question: "Bremermann's limit sets the absolute maximum computational speed of a self-contained system in the material universe. Based on mass-energy equivalence (E=mc^2) and the Heisenberg uncertainty principle (ΔEΔt ≥ h/4π), what is this fundamental limit approximately?",
            options: [
                "1.36 × 10^50 bits per second per kilogram",
                "2.99 × 10^8 bits per second per gram",
                "6.02 × 10^23 bits per second per kilogram",
                "The Planck length divided by the Planck time"
            ],
            correctAnswer: 0,
            explanation: "Bremermann's limit, named after mathematician Hans-Joachim Bremermann, dictates the maximum computational speed of a self-contained system. It is derived by combining Einstein's mass-energy equivalence (E=mc^2) with the Heisenberg uncertainty principle (E = h / Δt). This yields a maximum processing rate of c^2 / h bits per second per kilogram of mass. Substituting the speed of light (c) and Planck's constant (h), the result is approximately 1.356 × 10^50 bits per second per kilogram. A god-tier computronium planet utilizing its entire mass-energy for computation would operate exactly at this limit, representing the physical ceiling of data processing in our universe."
        },
        {
            question: "The Bekenstein bound implies a limit on the entropy, or information, that can be contained within a given finite region of space with a finite amount of energy. For a given spherical Computronium Planet, the maximum information I (in bits) it can contain is strictly proportional to:",
            options: [
                "The product of its radius (R) and its total mass-energy (E)",
                "The volume of the spherical planet (R^3)",
                "The square of the temperature gradient across the planet's mantle",
                "The surface area of the cooling oceans (R^2) regardless of internal mass"
            ],
            correctAnswer: 0,
            explanation: "The Bekenstein bound, formulated by Jacob Bekenstein, is an upper limit on the entropy S, or information I, that can be contained within a given finite region of space. The bound states that S ≤ (2πk_B R E) / (ħ c), where R is the radius of the sphere enclosing the system, and E is its total mass-energy. Translating entropy to information in bits yields I ≤ (2π R E) / (ħ c ln 2). Therefore, the maximum information capacity is fundamentally proportional to the product of the system's radius R and its total mass-energy E. Interestingly, for a black hole (where E is proportional to R), this capacity scales with R^2 (surface area), leading to the Holographic Principle."
        },
        {
            question: "If the Computronium Planet utilizes a global topological quantum computational matrix governed by the braiding of non-Abelian anyons, which complexity class best describes the set of decision problems it can efficiently solve (in polynomial time) that classical Turing machines cannot?",
            options: [
                "BQP (Bounded-error Quantum Polynomial time)",
                "NP-Complete",
                "EXPTIME",
                "PSPACE"
            ],
            correctAnswer: 0,
            explanation: "A topological quantum computer, utilizing the braiding of non-Abelian anyons, is computationally equivalent in power to the standard quantum circuit model. Both are theoretically capable of solving any problem in the complexity class BQP (Bounded-error Quantum Polynomial time) efficiently. BQP includes problems like integer factorization (via Shor's algorithm) and simulating quantum physical processes, which are strongly believed to be outside of P (problems efficiently solvable by classical Turing machines) and outside of BPP (classical randomized polynomial time). While quantum computers provide exponential speedups for specific algorithms within BQP, it is a common misconception that they can efficiently solve NP-Complete problems, EXPTIME problems, or PSPACE-hard problems in polynomial time."
        }
    ];

    // ============================================================================
    // MAIN ANIMATION LOOP
    // ============================================================================
    const animate = (time, speed, meshes) => {
        // Iterate through all registered updatables (shaders, rotations, orbital mechanics)
        updatables.forEach(u => {
            if (u.update) u.update(time, speed);
        });
    };

    return { group, parts, description, quizQuestions, animate };
}
