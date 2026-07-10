import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updateCbs = [];

    const description = "Ultra God Tier Gravitational Wave Interferometer. A space-based observatory comprising three massive spacecraft flying in an equilateral triangle constellation. It measures relative displacements of free-falling test masses to detect ripples in spacetime caused by cataclysmic astrophysical events, such as binary black hole mergers.";

    // =========================================================================
    // SHADERS & CUSTOM MATERIALS
    // =========================================================================

    // 1. Spacetime Grid Shader
    // Renders a cosmic fabric that distorts when gravitational waves pass through it.
    const spacetimeVertexShader = `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float time;
        uniform vec3 gwSource;
        uniform float gwAmplitude;
        uniform float gwFrequency;
        uniform float gwSpeed;

        void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            
            // Calculate distance from GW source
            float dist = distance(worldPos.xyz, gwSource);
            
            // Retarded time for wave propagation
            float t = time - dist / gwSpeed;
            
            // Calculate strain (h) based on distance (1/r falloff) and time
            float strain = 0.0;
            if (t > 0.0) {
                // Chirp-like envelope approximation + ringdown
                float envelope = exp(-0.05 * t) * smoothstep(0.0, 5.0, t);
                strain = gwAmplitude * (1.0 / (dist + 0.1)) * sin(gwFrequency * t) * envelope;
            }
            
            // Quadrupolar distortion approximation (simplified for visual effect)
            // Stretches space in one direction and squeezes in the orthogonal direction
            vec3 dir = normalize(worldPos.xyz - gwSource);
            vec3 orthogonal = vec3(-dir.z, 0.0, dir.x);
            
            worldPos.xyz += orthogonal * strain * 10.0; // amplify for visual
            worldPos.y += strain * 5.0; // ripple in y
            
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
    `;

    const spacetimeFragmentShader = `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float time;
        uniform vec3 color;

        void main() {
            // Create a high-tech grid pattern
            vec2 grid = fract(vWorldPosition.xz * 0.2);
            vec2 gridLines = smoothstep(0.0, 0.05, grid) * smoothstep(1.0, 0.95, grid);
            float lineIntensity = 1.0 - (gridLines.x * gridLines.y);
            
            // Pulse the grid lines
            float pulse = (sin(time * 2.0 - length(vWorldPosition.xz) * 0.5) + 1.0) * 0.5;
            
            vec3 finalColor = mix(vec3(0.0, 0.0, 0.1), color, lineIntensity * (0.5 + 0.5 * pulse));
            
            // Add a soft glow near the center
            float glow = exp(-length(vWorldPosition.xz) * 0.01);
            finalColor += color * glow * 0.2;
            
            gl_FragColor = vec4(finalColor, lineIntensity * 0.6 + glow * 0.3);
        }
    `;

    const spacetimeUniforms = {
        time: { value: 0 },
        gwSource: { value: new THREE.Vector3(0, 0, -200) },
        gwAmplitude: { value: 0 },
        gwFrequency: { value: 2.0 },
        gwSpeed: { value: 50.0 },
        color: { value: new THREE.Color(0x00ffff) }
    };

    const spacetimeMaterial = new THREE.ShaderMaterial({
        vertexShader: spacetimeVertexShader,
        fragmentShader: spacetimeFragmentShader,
        uniforms: spacetimeUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    // 2. Black Hole Accretion Disk Shader
    // Complex FBM-based glowing disk
    const bhVertexShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const bhFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        
        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
              dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
            for (int i = 0; i < 5; ++i) {
                v += a * snoise(x);
                x = rot * x * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            // Polar coordinates
            vec2 center = vec2(0.5, 0.5);
            vec2 delta = vUv - center;
            float radius = length(delta) * 2.0;
            float angle = atan(delta.y, delta.x);
            
            // Rotation
            angle -= time * 2.0 / (radius + 0.1);
            
            vec2 polarUv = vec2(radius, angle);
            
            // Accretion disk inner/outer bounds
            float inner = smoothstep(0.2, 0.4, radius);
            float outer = smoothstep(1.0, 0.8, radius);
            float bounds = inner * outer;
            
            // Noise patterns
            float n1 = fbm(vec2(angle * 4.0, radius * 10.0 - time * 3.0));
            float n2 = fbm(vec2(angle * 8.0, radius * 20.0 + time * 1.5));
            
            float intensity = (n1 * 0.5 + 0.5) * (n2 * 0.5 + 0.5) * bounds;
            
            // Doppler beaming approximation (one side brighter)
            float doppler = 1.0 + 0.8 * sin(angle);
            intensity *= doppler;
            
            // Color mix based on radius (hotter inside)
            vec3 finalColor = mix(color2, color1, 1.0 - radius);
            
            // Core shadow (event horizon)
            float eventHorizon = smoothstep(0.2, 0.22, radius);
            
            gl_FragColor = vec4(finalColor * intensity * 5.0 * eventHorizon, intensity * eventHorizon);
        }
    `;

    // 3. Laser Link Shader
    // High-tech intense laser beams that show phase shifts
    const laserVertexShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const laserFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float time;
        uniform float phaseShift;
        uniform vec3 color;
        
        void main() {
            // Transverse intensity profile (Gaussian-like)
            float distToCenter = abs(vUv.y - 0.5) * 2.0;
            float intensity = exp(-distToCenter * distToCenter * 10.0);
            
            // Longitudinal wave pattern (Interference bands)
            float wave = sin(vUv.x * 200.0 - time * 50.0 + phaseShift);
            float bands = smoothstep(0.0, 1.0, wave * 0.5 + 0.5);
            
            // Combine
            float finalAlpha = intensity * (0.5 + 0.5 * bands);
            
            // Bright core
            vec3 coreColor = vec3(1.0, 1.0, 1.0);
            vec3 finalColor = mix(color, coreColor, intensity * bands);
            
            gl_FragColor = vec4(finalColor * 2.0, finalAlpha);
        }
    `;

    // =========================================================================
    // BLACK HOLE BINARY SYSTEM
    // =========================================================================

    const bhGroup = new THREE.Group();
    bhGroup.position.set(0, 0, -250); // Far in the background
    group.add(bhGroup);

    const bh1 = new THREE.Group();
    const bh2 = new THREE.Group();
    bhGroup.add(bh1);
    bhGroup.add(bh2);

    // Event Horizon (Pitch Black Sphere)
    const ehGeo = new THREE.SphereGeometry(4, 64, 64);
    const ehMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const ehMesh1 = new THREE.Mesh(ehGeo, ehMat);
    const ehMesh2 = new THREE.Mesh(ehGeo, ehMat);
    bh1.add(ehMesh1);
    bh2.add(ehMesh2);

    // Accretion Disk 1
    const diskGeo = new THREE.PlaneGeometry(30, 30, 64, 64);
    const diskMat1 = new THREE.ShaderMaterial({
        vertexShader: bhVertexShader,
        fragmentShader: bhFragmentShader,
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0xff4400) },
            color2: { value: new THREE.Color(0x4400ff) }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const diskMesh1 = new THREE.Mesh(diskGeo, diskMat1);
    diskMesh1.rotation.x = Math.PI / 2 - 0.2; // Slight tilt
    bh1.add(diskMesh1);

    // Accretion Disk 2
    const diskMat2 = diskMat1.clone();
    diskMat2.uniforms.color1.value = new THREE.Color(0x00ffff);
    diskMat2.uniforms.color2.value = new THREE.Color(0xff00ff);
    const diskMesh2 = new THREE.Mesh(diskGeo, diskMat2);
    diskMesh2.rotation.x = Math.PI / 2 + 0.3;
    bh2.add(diskMesh2);

    parts.push({
        name: "Binary Black Hole System",
        description: "A catastrophic merger of two supermassive black holes in a distant galaxy. Their orbital decay emits vast amounts of energy as gravitational waves, rippling through the fabric of spacetime. The glowing accretion disks are superheated plasma swirling into the event horizons.",
        material: "Singularity & Superheated Plasma",
        function: "Source of Gravitational Waves",
        assemblyOrder: 1,
        connections: ["Spacetime Grid"],
        failureEffect: "If they don't merge, no strong GW signal is produced.",
        cascadeFailures: ["No ripples detected by interferometer"],
        originalPosition: { x: 0, y: 0, z: -250 },
        explodedPosition: { x: 0, y: 50, z: -350 }
    });

    // =========================================================================
    // SPACETIME GRID
    // =========================================================================

    const gridGeo = new THREE.PlaneGeometry(800, 800, 256, 256);
    gridGeo.rotateX(-Math.PI / 2);
    const gridMesh = new THREE.Mesh(gridGeo, spacetimeMaterial);
    gridMesh.position.set(0, -20, 0); // Below the satellites
    group.add(gridMesh);

    parts.push({
        name: "Cosmic Spacetime Fabric",
        description: "The four-dimensional continuum of spacetime, visualized here as a 2D grid. According to General Relativity, massive accelerating objects distort this fabric, producing ripples that propagate outward at the speed of light.",
        material: "Vacuum Energy",
        function: "Propagation Medium",
        assemblyOrder: 2,
        connections: ["Binary Black Hole System", "Spacecraft Constellation"],
        failureEffect: "Spacetime is un-breakable, but if it were perfectly rigid, gravity would not exist.",
        cascadeFailures: ["Universal collapse of physics"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // =========================================================================
    // SPACECRAFT CONSTELLATION BUILDER
    // =========================================================================

    // Advanced Materials for Spacecraft
    const goldPlating = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 2.0
    });
    
    const solarPanelMat = new THREE.MeshStandardMaterial({
        color: 0x0a1530,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: false
    });
    
    const thermalBlanket = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.3,
        roughness: 0.8,
        bumpScale: 0.05
    }); // Needs bump map for realism, using flat for now but representing MLI

    const glowingOptics = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    // Test Mass (Proof Mass) Material
    const testMassMat = new THREE.MeshStandardMaterial({
        color: 0xffeaa7,
        metalness: 1.0,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    function createSpacecraft(namePrefix, position, rotationAngle) {
        const scGroup = new THREE.Group();
        scGroup.position.copy(position);
        scGroup.rotation.y = rotationAngle;

        // 1. Primary Bus (Hexagonal Prism)
        const busGeo = new THREE.CylinderGeometry(8, 8, 4, 6);
        const busMesh = new THREE.Mesh(busGeo, thermalBlanket);
        scGroup.add(busMesh);

        // Add greebles to the bus
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const panelGeo = new THREE.BoxGeometry(6, 3, 0.5);
            const panel = new THREE.Mesh(panelGeo, darkSteel);
            panel.position.set(Math.cos(angle) * 7.8, 0, Math.sin(angle) * 7.8);
            panel.rotation.y = -angle;
            scGroup.add(panel);

            // Micro-thruster clusters
            const thrusterGroup = new THREE.Group();
            const nozzleGeo = new THREE.CylinderGeometry(0.2, 0.4, 0.8, 16);
            const nozzle = new THREE.Mesh(nozzleGeo, chrome);
            nozzle.rotation.x = Math.PI / 2;
            
            const n1 = nozzle.clone(); n1.position.set(-1, 1.5, 0);
            const n2 = nozzle.clone(); n2.position.set(1, 1.5, 0);
            const n3 = nozzle.clone(); n3.position.set(0, -1.5, 0);
            
            thrusterGroup.add(n1, n2, n3);
            thrusterGroup.position.copy(panel.position);
            thrusterGroup.rotation.copy(panel.rotation);
            scGroup.add(thrusterGroup);
        }

        // 2. Solar Array / Sun Shield (Top)
        const solarGeo = new THREE.CylinderGeometry(12, 12, 0.5, 32);
        const solarMesh = new THREE.Mesh(solarGeo, solarPanelMat);
        solarMesh.position.y = 2.5;
        scGroup.add(solarMesh);
        
        // Solar array structural ribs
        for (let i=0; i<12; i++) {
            const ribGeo = new THREE.BoxGeometry(24, 0.6, 0.2);
            const rib = new THREE.Mesh(ribGeo, steel);
            rib.position.y = 2.5;
            rib.rotation.y = (i * Math.PI) / 6;
            scGroup.add(rib);
        }

        // High Gain Antenna (Top Center)
        const dishGeo = new THREE.LatheGeometry([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.5, 0.1),
            new THREE.Vector2(1.5, 0.5),
            new THREE.Vector2(2.5, 1.2),
            new THREE.Vector2(3.0, 2.0)
        ], 32);
        const dish = new THREE.Mesh(dishGeo, goldPlating);
        dish.position.y = 3.0;
        scGroup.add(dish);
        
        const feedGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
        const feed = new THREE.Mesh(feedGeo, aluminum);
        feed.position.set(0, 4.0, 0);
        scGroup.add(feed);

        // 3. Y-Shaped Payload Assembly (Telescopes & Optical Benches)
        // LISA satellites have two optical assemblies angled at 60 degrees.
        const payloadGroup = new THREE.Group();
        
        function createOpticalBench(angleOffset, isLeft) {
            const benchGrp = new THREE.Group();
            benchGrp.rotation.y = angleOffset;

            // Telescope Tube
            const tubeGeo = new THREE.CylinderGeometry(1.5, 2.0, 10, 32);
            tubeGeo.rotateX(Math.PI / 2);
            const tube = new THREE.Mesh(tubeGeo, darkSteel);
            tube.position.z = 5;
            benchGrp.add(tube);
            
            // Optical baffles inside tube
            for(let j=1; j<8; j++) {
                const baffleGeo = new THREE.RingGeometry(1.3, 1.5 - j*0.02, 32);
                const baffle = new THREE.Mesh(baffleGeo, steel);
                baffle.position.z = j * 1.2;
                benchGrp.add(baffle);
            }

            // Primary Mirror
            const mirrorGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
            mirrorGeo.rotateX(Math.PI / 2);
            const mirror = new THREE.Mesh(mirrorGeo, chrome);
            mirror.position.z = 0.5;
            benchGrp.add(mirror);

            // Optical Bench Base (Zerodur block approximation)
            const baseGeo = new THREE.BoxGeometry(4, 1.5, 4);
            const base = new THREE.Mesh(baseGeo, glass);
            base.position.set(0, -1, -2);
            benchGrp.add(base);

            // Interferometer components on bench (beam splitters, photodiodes)
            for(let k=0; k<8; k++) {
                const compGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
                const comp = new THREE.Mesh(compGeo, glowingOptics);
                comp.position.set(
                    (Math.random() - 0.5) * 3,
                    -0.5,
                    -2 + (Math.random() - 0.5) * 3
                );
                benchGrp.add(comp);
            }

            // Test Mass Housing (Vacuum Enclosure)
            const housingGeo = new THREE.BoxGeometry(2, 2, 2);
            const housing = new THREE.Mesh(housingGeo, new THREE.MeshStandardMaterial({
                color: 0x333333,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            }));
            housing.position.set(0, 0.5, -3);
            benchGrp.add(housing);

            // The Gold-Platinum Test Mass!
            const tmGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const tm = new THREE.Mesh(tmGeo, testMassMat);
            tm.position.copy(housing.position);
            
            // Store reference to animate it
            tm.userData = { isTestMass: true, baseX: tm.position.x, baseY: tm.position.y, baseZ: tm.position.z };
            benchGrp.add(tm);
            updateCbs.push((t, speed, strain) => {
                // Test masses vibrate slightly due to GW strain
                tm.position.x = tm.userData.baseX + Math.sin(t * speed * 5.0) * strain * 2.0;
                tm.position.z = tm.userData.baseZ + Math.cos(t * speed * 5.0) * strain * 2.0;
                // Add tiny random quantum/thermal noise
                tm.rotation.x = Math.sin(t * 10) * 0.01;
                tm.rotation.y = Math.cos(t * 11) * 0.01;
            });

            return benchGrp;
        }

        // Two arms separated by 60 degrees
        const arm1 = createOpticalBench(Math.PI / 6, true);
        const arm2 = createOpticalBench(-Math.PI / 6, false);
        payloadGroup.add(arm1);
        payloadGroup.add(arm2);

        scGroup.add(payloadGroup);
        
        return scGroup;
    }

    // Constellation setup: 3 satellites in a massive triangle
    const ARM_LENGTH = 150; // Visual scale, realistically millions of km
    const sat1Pos = new THREE.Vector3(0, 0, -ARM_LENGTH * 0.577);
    const sat2Pos = new THREE.Vector3(-ARM_LENGTH/2, 0, ARM_LENGTH * 0.288);
    const sat3Pos = new THREE.Vector3(ARM_LENGTH/2, 0, ARM_LENGTH * 0.288);

    // Orientation: Telescopes must point at each other.
    // By calculating angles carefully:
    const sat1 = createSpacecraft("Sat1", sat1Pos, 0);
    const sat2 = createSpacecraft("Sat2", sat2Pos, Math.PI * 2 / 3);
    const sat3 = createSpacecraft("Sat3", sat3Pos, -Math.PI * 2 / 3);

    group.add(sat1, sat2, sat3);

    // =========================================================================
    // PART DEFINITIONS FOR SPACECRAFT (EXTREMELY DETAILED)
    // =========================================================================
    
    // Add parts for Sat1
    parts.push({
        name: "Sat1 - Primary Service Module Bus",
        description: "The main hexagonal chassis of Spacecraft 1. It houses propulsion, power regulation, avionics, and thermal control systems. Designed to isolate external forces (like solar radiation pressure) from the inner free-falling test masses using drag-free control via micro-Newton thrusters.",
        material: "Carbon-Cyanate Ester Composite & MLI",
        function: "Structural integrity and Drag-Free Navigation",
        assemblyOrder: 3,
        connections: ["Sat1 Solar Array", "Sat1 Optical Payload"],
        failureEffect: "Loss of drag-free control; solar winds push the spacecraft, contaminating the gravitational wave signal with classical noise.",
        cascadeFailures: ["Test masses hit their housing walls", "Interferometer lock lost"],
        originalPosition: sat1Pos.clone(),
        explodedPosition: sat1Pos.clone().add(new THREE.Vector3(0, -20, 0))
    });

    parts.push({
        name: "Sat1 - Solar Array & Sun Shield",
        description: "A large circular array on top of the spacecraft, permanently pointed towards the Sun. It generates power while simultaneously shading the ultra-sensitive optical bench from thermal fluctuations that could distort the optics.",
        material: "Gallium Arsenide Cells & Structural Carbon",
        function: "Power Generation & Thermal Shielding",
        assemblyOrder: 4,
        connections: ["Sat1 Primary Service Module Bus"],
        failureEffect: "Thermal expansion of the optical bench ruins the picometer-level measurement precision.",
        cascadeFailures: ["Loss of power", "Measurement invalidation"],
        originalPosition: sat1Pos.clone().add(new THREE.Vector3(0, 2.5, 0)),
        explodedPosition: sat1Pos.clone().add(new THREE.Vector3(0, 30, 0))
    });

    parts.push({
        name: "Sat1 - Left Optical Bench & Telescope",
        description: "An ultra-stable block of Zerodur glass populated with intricately bonded beam splitters, mirrors, and photodiodes. The attached telescope expands the outgoing laser beam and collects the incoming faint beam from Satellite 2.",
        material: "Zerodur Glass-Ceramic & Silicon Carbide",
        function: "Laser Routing & Interference Measurement",
        assemblyOrder: 5,
        connections: ["Sat1 Primary Service Module Bus", "Sat1 Left Test Mass"],
        failureEffect: "Inability to properly route or interfere the lasers.",
        cascadeFailures: ["Phase measurement failure"],
        originalPosition: sat1Pos.clone().add(new THREE.Vector3(-2, 0, 2)),
        explodedPosition: sat1Pos.clone().add(new THREE.Vector3(-30, 0, 30))
    });

    parts.push({
        name: "Sat1 - Left Gravitational Reference Sensor (Test Mass)",
        description: "A 46mm, 1.96 kg cube made of a 73% Gold, 27% Platinum alloy. It is entirely disconnected from the spacecraft, floating freely inside a vacuum housing. It follows a pure geodesic through spacetime. Its position is read out electrostatically and optically.",
        material: "Au-Pt Alloy (High Density, Low Magnetic Susceptibility)",
        function: "Pure Geodesic Reference Point",
        assemblyOrder: 6,
        connections: ["Spacetime Fabric (via Gravity)"],
        failureEffect: "If stray electrostatic, magnetic, or thermal forces act on the cube, it deviates from a pure geodesic.",
        cascadeFailures: ["False gravitational wave signals detected"],
        originalPosition: sat1Pos.clone(),
        explodedPosition: sat1Pos.clone().add(new THREE.Vector3(-40, 10, 40))
    });

    // Add parts for Sat 2
    parts.push({
        name: "Sat2 - Primary Service Module Bus",
        description: "The core platform for Spacecraft 2. Maintains precise formation flying with Sat1 and Sat3 over millions of kilometers using Colloid Micro-Newton Thrusters to counteract solar radiation pressure.",
        material: "Aerospace-grade Aluminum & Titanium",
        function: "Spacecraft Support & Micro-propulsion",
        assemblyOrder: 7,
        connections: ["Sat2 Optical Payload"],
        failureEffect: "Drift in constellation formation beyond the capture range of the lasers.",
        cascadeFailures: ["Interferometer arms decouple"],
        originalPosition: sat2Pos.clone(),
        explodedPosition: sat2Pos.clone().add(new THREE.Vector3(-20, -20, -10))
    });

    parts.push({
        name: "Sat2 - Dual Optical Benches",
        description: "Houses two independent interferometer setups angled at 60 degrees to face the other two spacecraft. Employs heterodyne laser interferometry to measure the distance between test masses to a precision of picometers (smaller than an atom).",
        material: "Zerodur Base, Fused Silica Optics",
        function: "Optical Heterodyne Detection",
        assemblyOrder: 8,
        connections: ["Sat2 Primary Service Module Bus"],
        failureEffect: "Loss of interference contrast due to optical misalignment.",
        cascadeFailures: ["Signal-to-noise ratio drops to zero"],
        originalPosition: sat2Pos.clone(),
        explodedPosition: sat2Pos.clone().add(new THREE.Vector3(20, 0, -20))
    });

    parts.push({
        name: "Sat2 - Gold-Platinum Test Masses (x2)",
        description: "The literal heart of the observatory. Because they are in free-fall, when a gravitational wave passes, the space between the test masses in Sat1, Sat2, and Sat3 stretches and squeezes. The lasers simply act as a ruler to measure this stretch.",
        material: "Gold-Platinum Alloy",
        function: "Spacetime Probes",
        assemblyOrder: 9,
        connections: ["Sat2 Optical Benches (via laser & electrostatic sensing)"],
        failureEffect: "Masses become magnetically charged and interact with solar storms.",
        cascadeFailures: ["Extreme noise floods the data stream"],
        originalPosition: sat2Pos.clone(),
        explodedPosition: sat2Pos.clone().add(new THREE.Vector3(30, 10, -30))
    });

    // Add parts for Sat 3
    parts.push({
        name: "Sat3 - Master Clock & Phase Meter",
        description: "While identical structurally, let's highlight the internal electronics. Ultra-stable oscillators and digital phase meters process the interference beat notes at MHz frequencies, tracking phase changes down to microcycles to detect the minute strain of a passing wave.",
        material: "Radiation-hardened Silicon & Quartz Oscillators",
        function: "Signal Processing & Timing",
        assemblyOrder: 10,
        connections: ["Sat3 Optical Bench Photodiodes", "Sat3 Telemetry Dish"],
        failureEffect: "Clock jitter introduces phase noise that mimics gravitational waves.",
        cascadeFailures: ["TDI (Time Delay Interferometry) algorithms fail"],
        originalPosition: sat3Pos.clone(),
        explodedPosition: sat3Pos.clone().add(new THREE.Vector3(20, -20, 10))
    });

    parts.push({
        name: "Sat3 - Communication High Gain Antenna",
        description: "A large parabolic dish that transmits the compressed scientific data back to Earth over immense distances (tens of millions of kilometers) using the Deep Space Network.",
        material: "Gold-plated composite",
        function: "Earth Data Downlink",
        assemblyOrder: 11,
        connections: ["Sat3 Primary Service Module Bus"],
        failureEffect: "Data collected on the spacetime ripples cannot be sent home.",
        cascadeFailures: ["Mission becomes completely pointless"],
        originalPosition: sat3Pos.clone().add(new THREE.Vector3(0, 3, 0)),
        explodedPosition: sat3Pos.clone().add(new THREE.Vector3(0, 40, 0))
    });

    parts.push({
        name: "Sat3 - Colloid Micro-Newton Thrusters",
        description: "Electrospray thrusters that precisely eject charged droplets of ionic liquid. They provide continuous, incredibly smooth thrust (in the micro-Newton range) to keep the spacecraft perfectly centered around its free-falling test masses.",
        material: "Tungsten Emitters & Ionic Propellant",
        function: "Drag-Free Control Actuation",
        assemblyOrder: 12,
        connections: ["Sat3 Primary Service Module Bus"],
        failureEffect: "Thruster noise or failure causes the spacecraft to bump into the test mass.",
        cascadeFailures: ["Complete loss of geodesic reference"],
        originalPosition: sat3Pos.clone(),
        explodedPosition: sat3Pos.clone().add(new THREE.Vector3(30, -30, 20))
    });


    // =========================================================================
    // LASER LINKS (INTERFEROMETER ARMS)
    // =========================================================================

    const laserLinks = new THREE.Group();
    group.add(laserLinks);

    // Create a laser beam between two points
    function createLaserBeam(p1, p2, name, order, p1Offset, p2Offset) {
        const distance = p1.distanceTo(p2);
        const geo = new THREE.CylinderGeometry(0.5, 0.5, distance, 16, 64);
        geo.translate(0, distance / 2, 0);
        geo.rotateX(Math.PI / 2);

        const mat = new THREE.ShaderMaterial({
            vertexShader: laserVertexShader,
            fragmentShader: laserFragmentShader,
            uniforms: {
                time: { value: 0 },
                phaseShift: { value: 0 },
                color: { value: new THREE.Color(0x33ff33) } // 1064nm Nd:YAG typically IR, but green for visual
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(p1);
        mesh.lookAt(p2);
        
        laserLinks.add(mesh);

        // Update loop for laser
        updateCbs.push((t, speed, strain) => {
            mat.uniforms.time.value = t * speed;
            // The phase shift fluctuates wildly when the GW hits (strain is high)
            mat.uniforms.phaseShift.value = strain * 50.0;
            // Also shift color slightly based on strain
            if (strain > 0.1) {
                mat.uniforms.color.value.setHex(0xff3333); // Redshift/Blueshift visual exaggeration
            } else {
                mat.uniforms.color.value.setHex(0x33ff33); // Normal operation
            }
        });

        parts.push({
            name: name,
            description: "A continuous 2 Watt Nd:YAG infrared continuous wave laser link. Due to diffraction over millions of kilometers, the beam spreads to kilometers in width; only a tiny fraction of the photons are caught by the receiving telescope. Phase locking is used to amplify the beat signal.",
            material: "Coherent Photons (1064 nm)",
            function: "Interferometric Distance Measurement",
            assemblyOrder: order,
            connections: ["Satellites"],
            failureEffect: "Laser loses phase lock, or absolute frequency drifts beyond control loops.",
            cascadeFailures: ["Arm measurement fails", "Triangle constellation broken"],
            originalPosition: p1.clone().lerp(p2, 0.5),
            explodedPosition: p1.clone().lerp(p2, 0.5).add(new THREE.Vector3(0, 50, 0))
        });

        return mesh;
    }

    createLaserBeam(sat1Pos, sat2Pos, "Arm 1 (Sat 1 to 2)", 13);
    createLaserBeam(sat2Pos, sat3Pos, "Arm 2 (Sat 2 to 3)", 14);
    createLaserBeam(sat3Pos, sat1Pos, "Arm 3 (Sat 3 to 1)", 15);


    // =========================================================================
    // QUIZ QUESTIONS (PhD LEVEL)
    // =========================================================================

    const quizQuestions = [
        {
            question: "In a space-based interferometer like LISA, why is Time Delay Interferometry (TDI) fundamentally required to detect gravitational waves, unlike ground-based detectors like LIGO?",
            options: [
                "Because laser frequency noise overwhelms the signal if arm lengths are unequal and not synthetically matched via post-processing.",
                "Because the solar radiation pressure alters the speed of light in deep space.",
                "Because relativistic time dilation from the Sun causes clocks on different satellites to drift uncontrollably.",
                "Because the massive distance requires lasers to bounce back and forth exactly 300 times before interference is possible."
            ],
            correctAnswerIndex: 0,
            explanation: "Ground-based detectors like LIGO can physically construct arms of almost exactly equal length, causing laser frequency noise to common-mode reject at the beam splitter. In space, the arm lengths constantly change by thousands of kilometers due to orbital mechanics. TDI is a post-processing algorithm that synthetically constructs equal-path interferometers by time-shifting and combining phase measurements, effectively cancelling the overwhelming laser frequency noise."
        },
        {
            question: "A passing gravitational wave with a strain amplitude of h = 10^-21 passes perpendicularly through the detector plane. If the arm length is L = 2.5 million kilometers, what is the approximate change in arm length (ΔL) induced by the wave?",
            options: [
                "2.5 millimeters",
                "2.5 micrometers",
                "2.5 picometers",
                "2.5 femtometers"
            ],
            correctAnswerIndex: 2,
            explanation: "Strain (h) is defined roughly as ΔL / L. Therefore, ΔL = h * L.  ΔL = (10^-21) * (2.5 * 10^9 meters) = 2.5 * 10^-12 meters, which is 2.5 picometers. This is roughly the size of an atomic nucleus, measured over millions of kilometers!"
        },
        {
            question: "During the inspiral phase of a supermassive binary black hole merger, what characteristic shape does the gravitational wave strain signal exhibit in the time domain?",
            options: [
                "A constant frequency sine wave with decaying amplitude.",
                "A 'Chirp' - a sinusoid where both frequency and amplitude increase monotonically over time until the merger.",
                "A Dirac delta function spike exactly at the moment of the event horizon intersection.",
                "A random stochastic background noise with a 1/f spectral density."
            ],
            correctAnswerIndex: 1,
            explanation: "As the black holes orbit closer together due to orbital energy being radiated away as gravitational waves, their orbital speed increases. This results in the emitted waves increasing in both frequency (pitch) and amplitude (loudness). This accelerating oscillation is famously known as a 'chirp'."
        },
        {
            question: "Why must the test masses in the gravitational reference sensors be made of an alloy of roughly 73% Gold and 27% Platinum?",
            options: [
                "To maximize reflectivity for the 1064nm Nd:YAG laser.",
                "To achieve a very high density while simultaneously minimizing magnetic susceptibility, reducing external magnetic force disturbances.",
                "To prevent cold welding in the extreme vacuum of space while maintaining perfect electrical insulation.",
                "To match the thermal expansion coefficient of the Zerodur optical bench perfectly."
            ],
            correctAnswerIndex: 1,
            explanation: "Gold is very dense and diamagnetic, while Platinum is dense and paramagnetic. By alloying them in this specific ratio, the overall magnetic susceptibility is tuned to nearly zero. This prevents the interplanetary magnetic field from exerting forces on the test mass, which would ruin its pure geodesic trajectory."
        },
        {
            question: "If a gravitational wave is classified as a 'tensor perturbation' to the metric in General Relativity, how many independent polarization states does it possess in 4D spacetime, and what are they called?",
            options: [
                "One state: Scalar breathing mode.",
                "Two states: Plus (+) and Cross (x) polarizations.",
                "Three states: Plus, Cross, and Longitudinal.",
                "Six states: Plus, Cross, Vector-X, Vector-Y, Scalar-Breathing, Scalar-Longitudinal."
            ],
            correctAnswerIndex: 1,
            explanation: "In General Relativity, gravitational waves only possess two independent transverse-traceless tensor polarization states: Plus (+) and Cross (x), rotated 45 degrees from each other. Other metric theories of gravity can predict up to 6 polarizations, but GR strictly predicts exactly two."
        }
    ];

    // =========================================================================
    // ANIMATION & KINEMATICS
    // =========================================================================

    function animate(time, speed, meshes) {
        // Calculate physics states
        timeAcc += 0.01 * speed;
        
        // 1. Animate Black Hole Binary (Source)
        // Chirp dynamics: orbit gets faster and tighter over a cycle
        const cycle = (timeAcc % 20.0) / 20.0; // 0 to 1 cycle
        
        // Inspiraling phase
        let orbitRadius = 15.0 - cycle * 12.0; 
        let orbitFreq = 1.0 + cycle * cycle * 10.0; // Speeds up dramatically
        
        // Ringdown & Merger state
        let isMerged = false;
        if (cycle > 0.9) {
            orbitRadius = 0.5; // Merged
            orbitFreq = 0.0;
            isMerged = true;
        }

        const angle = timeAcc * orbitFreq;
        
        bh1.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);
        bh2.position.set(-Math.cos(angle) * orbitRadius, 0, -Math.sin(angle) * orbitRadius);
        
        // Update accretion disk uniforms
        diskMat1.uniforms.time.value = timeAcc * speed * 2.0;
        diskMat2.uniforms.time.value = timeAcc * speed * 2.0;
        
        // 2. Animate Gravitational Wave Spacetime Grid
        // Strain spikes heavily during merger
        let currentStrain = 0;
        if (cycle > 0.8 && cycle < 0.95) {
            // Massive burst
            currentStrain = Math.sin((cycle - 0.8) * Math.PI * 10.0) * 2.5;
        } else if (cycle <= 0.8) {
            // Inspiral buildup
            currentStrain = Math.sin(timeAcc * orbitFreq) * (cycle * 0.5);
        }
        
        // Update grid shader uniforms
        spacetimeMaterial.uniforms.time.value = timeAcc;
        spacetimeMaterial.uniforms.gwAmplitude.value = currentStrain * 5.0; // Exaggerate for visual
        spacetimeMaterial.uniforms.gwFrequency.value = orbitFreq * 2.0;
        
        // 3. Animate Satellites & Lasers (Response to Wave)
        // When wave hits the constellation (z=0 roughly), cause displacements
        // We simulate a time delay for the wave reaching the sats
        const distToSat = 250; // Black holes are at z=-250
        const waveSpeed = spacetimeMaterial.uniforms.gwSpeed.value;
        const delay = distToSat / waveSpeed;
        
        // Look back in time to see if wave hit
        const hitTime = timeAcc - delay;
        const hitCycle = (hitTime % 20.0) / 20.0;
        
        let localStrain = 0;
        if (hitCycle > 0.8 && hitCycle < 0.95) {
            localStrain = Math.sin((hitCycle - 0.8) * Math.PI * 10.0) * 1.5;
        } else if (hitCycle > 0.0 && hitCycle <= 0.8) {
            let hitFreq = 1.0 + hitCycle * hitCycle * 10.0;
            localStrain = Math.sin(hitTime * hitFreq) * (hitCycle * 0.2);
        }

        // Apply physical displacement to the satellites based on quadrupolar strain
        // Plus polarization: stretches X, squeezes Z (simplified)
        const displacementX = localStrain * 5.0;
        const displacementZ = -localStrain * 5.0;
        
        sat1.position.x = sat1Pos.x + displacementX * 0.1;
        sat1.position.z = sat1Pos.z + displacementZ * 1.5;
        
        sat2.position.x = sat2Pos.x - displacementX * 1.0;
        sat2.position.z = sat2Pos.z - displacementZ * 0.5;
        
        sat3.position.x = sat3Pos.x + displacementX * 1.0;
        sat3.position.z = sat3Pos.z - displacementZ * 0.5;

        // Ensure satellites keep pointing at each other perfectly by forcing LookAt or letting the laser geometries update
        // We just update the lasers and test masses via callbacks
        updateCbs.forEach(cb => cb(timeAcc, speed, Math.abs(localStrain)));
    }

    return { group, parts, description, quizQuestions, animate };
}
