import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 1. CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const energyCoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        transmission: 0.9,
        roughness: 0.0,
        ior: 2.5,
        thickness: 2.0
    });

    const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x2222ff,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 1.0,
        thickness: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const warningMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0
    });

    const activeConduitMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 3.0,
        wireframe: true
    });

    const darkMatterMaterial = new THREE.MeshStandardMaterial({
        color: 0x050505,
        emissive: 0x110022,
        emissiveIntensity: 1.0,
        roughness: 0.9,
        metalness: 0.8
    });

    // ==========================================
    // 2. WORMHOLE SHADERS (GLSL)
    // ==========================================
    const wormholeVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const wormholeFragmentShader = `
        uniform float time;
        uniform vec3 colorCenter;
        uniform vec3 colorEdge;
        uniform float swirlSpeed;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
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

        float fbm(vec2 st) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
            for (int i = 0; i < 6; i++) {
                v += a * snoise(st);
                st = rot * st * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            float radius = length(uv);
            float angle = atan(uv.y, uv.x);
            
            // Event horizon distortion
            float distortedAngle = angle + radius * swirlSpeed - time * 2.0;
            vec2 distortedUV = vec2(cos(distortedAngle), sin(distortedAngle)) * radius;
            
            float noiseVal = fbm(distortedUV * 5.0 - time * 0.5);
            
            // Radial intensity
            float intensity = smoothstep(1.0, 0.0, radius);
            intensity = pow(intensity, 1.5) + noiseVal * 0.3 * intensity;
            
            // Deep core singularity
            float core = smoothstep(0.15, 0.0, radius);
            
            vec3 color = mix(colorEdge, colorCenter, intensity);
            color = mix(color, vec3(0.0), core); // Black hole at center
            
            // Edge fade out for smooth integration
            float alpha = smoothstep(1.0, 0.95, radius);
            alpha *= min(1.0, intensity * 2.0);
            
            gl_FragColor = vec4(color, alpha);
        }
    `;

    const alphaUniforms = {
        time: { value: 0.0 },
        colorCenter: { value: new THREE.Color(0x00ffff) },
        colorEdge: { value: new THREE.Color(0x000033) },
        swirlSpeed: { value: 8.0 }
    };
    
    const betaUniforms = {
        time: { value: 0.0 },
        colorCenter: { value: new THREE.Color(0xff0055) },
        colorEdge: { value: new THREE.Color(0x330000) },
        swirlSpeed: { value: -6.0 }
    };

    const gammaUniforms = {
        time: { value: 0.0 },
        colorCenter: { value: new THREE.Color(0x55ff00) },
        colorEdge: { value: new THREE.Color(0x003300) },
        swirlSpeed: { value: 10.0 }
    };

    const alphaShaderMat = new THREE.ShaderMaterial({
        vertexShader: wormholeVertexShader,
        fragmentShader: wormholeFragmentShader,
        uniforms: alphaUniforms,
        transparent: true,
        side: THREE.DoubleSide
    });

    const betaShaderMat = new THREE.ShaderMaterial({
        vertexShader: wormholeVertexShader,
        fragmentShader: wormholeFragmentShader,
        uniforms: betaUniforms,
        transparent: true,
        side: THREE.DoubleSide
    });

    const gammaShaderMat = new THREE.ShaderMaterial({
        vertexShader: wormholeVertexShader,
        fragmentShader: wormholeFragmentShader,
        uniforms: gammaUniforms,
        transparent: true,
        side: THREE.DoubleSide
    });

    // ==========================================
    // 3. CENTRAL NEXUS HUB
    // ==========================================
    const hubGroup = new THREE.Group();
    group.add(hubGroup);

    // 3.1 Singularity Core Housing (Extremely detailed Lathe)
    const coreProfile = [];
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        // Complex mathematical profile for the core housing
        const r = 80 * Math.sin(t * Math.PI) 
                + 15 * Math.sin(t * Math.PI * 20) 
                + 5 * Math.cos(t * Math.PI * 50);
        const y = 150 * Math.cos(t * Math.PI);
        coreProfile.push(new THREE.Vector2(r, y));
    }
    const coreGeom = new THREE.LatheGeometry(coreProfile, 128);
    const coreMesh = new THREE.Mesh(coreGeom, darkSteel);
    hubGroup.add(coreMesh);
    
    parts.push({
        name: "Nexus Singularity Core Housing",
        description: "The central hyper-dense containment vessel that stabilizes the local macroscopic quantum vacuum. Constructed from neutron-star forged dark steel to withstand the immense pressures of the zero-point energy tap.",
        material: "darkSteel",
        function: "Maintains gravitational equilibrium across the three interconnected wormhole throats.",
        assemblyOrder: 1,
        connections: ["Harmonic Resonance Arrays", "Crystalline Scaffolding"],
        failureEffect: "Spontaneous vacuum decay and catastrophic local spacetime collapse.",
        cascadeFailures: ["Wormhole Throat Collapse", "Scaffolding Shatter"],
        originalPosition: coreMesh.position.clone(),
        explodedPosition: new THREE.Vector3(0, 500, 0)
    });

    // 3.2 Inner Glowing Energy Core
    const innerCoreGeom = new THREE.IcosahedronGeometry(75, 4);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeom, energyCoreMaterial);
    hubGroup.add(innerCoreMesh);
    
    parts.push({
        name: "Zero-Point Energy Core",
        description: "A trapped region of false vacuum constantly decaying and emitting pure energy, tapped to power the metric deformation necessary for the Alcubierre-like warp gates.",
        material: "energyCoreMaterial",
        function: "Primary power generation via Casimir effect manipulation.",
        assemblyOrder: 2,
        connections: ["Nexus Singularity Core Housing"],
        failureEffect: "Total power loss, immediate collapse of traversable wormhole throats.",
        cascadeFailures: ["All Gates"],
        originalPosition: innerCoreMesh.position.clone(),
        explodedPosition: new THREE.Vector3(0, -500, 0)
    });

    // 3.3 Equatorial Stabilization Rings (Rotating Arrays)
    const hubRings = [];
    const ringRadii = [180, 220, 260, 300];
    const ringSpeeds = [1.5, -1.2, 0.8, -0.5];
    
    for (let i = 0; i < 4; i++) {
        const ringGroup = new THREE.Group();
        
        // Complex ring geometry using Torus + Greebles
        const rGeom = new THREE.TorusGeometry(ringRadii[i], 12 + i*2, 32, 128);
        const rMesh = new THREE.Mesh(rGeom, steel);
        rMesh.rotation.x = Math.PI / 2;
        ringGroup.add(rMesh);

        // Add extreme greeble details around the ring
        const greebleCount = 120 + i * 20;
        for (let j = 0; j < greebleCount; j++) {
            const angle = (j / greebleCount) * Math.PI * 2;
            const gGeom = new THREE.BoxGeometry(10, 15 + Math.random()*20, 10);
            const gMesh = new THREE.Mesh(gGeom, j % 5 === 0 ? copper : aluminum);
            
            gMesh.position.x = Math.cos(angle) * ringRadii[i];
            gMesh.position.z = Math.sin(angle) * ringRadii[i];
            gMesh.lookAt(new THREE.Vector3(0, 0, 0));
            
            // Add glowing nodes to some greebles
            if (j % 15 === 0) {
                const nodeGeom = new THREE.SphereGeometry(6, 16, 16);
                const nodeMesh = new THREE.Mesh(nodeGeom, activeConduitMaterial);
                nodeMesh.position.copy(gMesh.position);
                nodeMesh.position.y += 15;
                ringGroup.add(nodeMesh);
            }
            
            ringGroup.add(gMesh);
        }

        hubGroup.add(ringGroup);
        hubRings.push({ group: ringGroup, speed: ringSpeeds[i] });
        
        parts.push({
            name: `Equatorial Gyroscopic Stabilizer Ring ${i+1}`,
            description: `Ring ${i+1} of the Lense-Thirring frame-dragging stabilization array. Counter-rotates to negate unwanted angular momentum generated by the core singularity.`,
            material: "steel/aluminum/copper",
            function: "Frame-dragging negation and inertial dampening.",
            assemblyOrder: 3 + i,
            connections: ["Nexus Singularity Core Housing"],
            failureEffect: "Uncontrolled spin of the central hub, tearing the scaffolding apart.",
            cascadeFailures: ["Crystalline Scaffolding"],
            originalPosition: ringGroup.position.clone(),
            explodedPosition: new THREE.Vector3(0, (i%2==0? 800 : -800) + i*100, 0)
        });
    }

    // ==========================================
    // 4. WORMHOLE GATES (ALPHA, BETA, GAMMA)
    // ==========================================
    const gatePositions = [
        new THREE.Vector3(800, 0, 0),
        new THREE.Vector3(-400, 0, 692.8),
        new THREE.Vector3(-400, 0, -692.8)
    ];
    
    const gateRotations = [
        new THREE.Euler(0, Math.PI / 2, 0),
        new THREE.Euler(0, -Math.PI / 6, 0),
        new THREE.Euler(0, -5 * Math.PI / 6, 0)
    ];

    const gateNames = ["Alpha", "Beta", "Gamma"];
    const gateShaders = [alphaShaderMat, betaShaderMat, gammaShaderMat];
    const gateRotors = [];
    const gatePistons = []; // For hydraulic animations

    for (let g = 0; g < 3; g++) {
        const gateGroup = new THREE.Group();
        gateGroup.position.copy(gatePositions[g]);
        gateGroup.rotation.copy(gateRotations[g]);
        group.add(gateGroup);

        // 4.1 Stator Outer Ring (Massive)
        const statorShape = new THREE.Shape();
        statorShape.moveTo(-50, -30);
        statorShape.lineTo(50, -30);
        statorShape.lineTo(60, 0);
        statorShape.lineTo(50, 30);
        statorShape.lineTo(-50, 30);
        statorShape.lineTo(-30, 0);
        
        const extrudeSettings = {
            depth: 0,
            bevelEnabled: false,
            curveSegments: 128,
            steps: 1
        };
        
        // Hack to sweep shape along circle: Lathe is easier for rings
        const statorProfile = [
            new THREE.Vector2(350, -40),
            new THREE.Vector2(400, -50),
            new THREE.Vector2(420, -20),
            new THREE.Vector2(420, 20),
            new THREE.Vector2(400, 50),
            new THREE.Vector2(350, 40),
            new THREE.Vector2(370, 0)
        ];
        const statorGeom = new THREE.LatheGeometry(statorProfile, 256);
        const statorMesh = new THREE.Mesh(statorGeom, chrome);
        statorMesh.rotation.x = Math.PI / 2;
        gateGroup.add(statorMesh);
        
        parts.push({
            name: `Gate ${gateNames[g]} - Primary Stator Casing`,
            description: `The main structural chassis for Gate ${gateNames[g]}. Houses the exotic matter injection manifolds and superconducting magnetic coils.`,
            material: "chrome",
            function: "Structural support and exotic matter containment.",
            assemblyOrder: 10 + g * 5,
            connections: ["Scaffolding Supports"],
            failureEffect: "Gate structural integrity compromised.",
            cascadeFailures: [`Gate ${gateNames[g]} Superfluid Rotor`],
            originalPosition: gateGroup.position.clone(),
            explodedPosition: gateGroup.position.clone().multiplyScalar(1.5)
        });

        // 4.2 Superfluid Inner Rotor
        const rotorGroup = new THREE.Group();
        const rotorProfile = [
            new THREE.Vector2(320, -15),
            new THREE.Vector2(340, -15),
            new THREE.Vector2(345, 0),
            new THREE.Vector2(340, 15),
            new THREE.Vector2(320, 15)
        ];
        const rotorGeom = new THREE.LatheGeometry(rotorProfile, 256);
        const rotorMesh = new THREE.Mesh(rotorGeom, darkSteel);
        rotorMesh.rotation.x = Math.PI / 2;
        rotorGroup.add(rotorMesh);

        // Rotor Emitters (Hundreds of complex greebles)
        for(let e = 0; e < 360; e++) {
            const angle = (e / 360) * Math.PI * 2;
            const emGeom = new THREE.CylinderGeometry(2, 4, 30, 8);
            const emMesh = new THREE.Mesh(emGeom, e % 10 === 0 ? copper : steel);
            emMesh.position.x = Math.cos(angle) * 315;
            emMesh.position.y = Math.sin(angle) * 315;
            emMesh.rotation.z = angle + Math.PI/2;
            rotorGroup.add(emMesh);
            
            // Glowing tips
            if (e % 5 === 0) {
                const tipGeom = new THREE.SphereGeometry(3, 8, 8);
                const tipMesh = new THREE.Mesh(tipGeom, activeConduitMaterial);
                tipMesh.position.x = Math.cos(angle) * 300;
                tipMesh.position.y = Math.sin(angle) * 300;
                rotorGroup.add(tipMesh);
            }
        }
        
        gateGroup.add(rotorGroup);
        gateRotors.push(rotorGroup);

        parts.push({
            name: `Gate ${gateNames[g]} - Superfluid Rotor Ring`,
            description: `A ring of Bose-Einstein condensate circulating at near-light speeds to generate the negative energy density required to prop open the Morris-Thorne wormhole throat.`,
            material: "darkSteel/copper/activeConduitMaterial",
            function: "Throat stabilization via continuous negative energy flux.",
            assemblyOrder: 11 + g * 5,
            connections: [`Gate ${gateNames[g]} - Primary Stator Casing`],
            failureEffect: "Wormhole throat collapses instantly, severing the connection.",
            cascadeFailures: ["Wormhole Event Horizon"],
            originalPosition: gateGroup.position.clone(),
            explodedPosition: gateGroup.position.clone().multiplyScalar(1.2).add(new THREE.Vector3(0, 200, 0))
        });

        // 4.3 Event Horizon Manifold (The Wormhole Shader Plane)
        const horizonGeom = new THREE.CircleGeometry(310, 128);
        const horizonMesh = new THREE.Mesh(horizonGeom, gateShaders[g]);
        // Double sided is handled in shader material, but need to position correctly
        gateGroup.add(horizonMesh);
        
        parts.push({
            name: `Gate ${gateNames[g]} - Event Horizon Manifold`,
            description: `The visible boundary of the topologically non-trivial spacetime region. The visual distortions are caused by intense gravitational lensing around the throat mouth.`,
            material: "Custom Shader",
            function: "Traversable boundary for interstellar transit.",
            assemblyOrder: 12 + g * 5,
            connections: [`Gate ${gateNames[g]} - Superfluid Rotor Ring`],
            failureEffect: "Transit impossible. Matter interacting with the boundary is spaghettified.",
            cascadeFailures: [],
            originalPosition: gateGroup.position.clone(),
            explodedPosition: gateGroup.position.clone().multiplyScalar(0.8)
        });

        // 4.4 Hydraulic Control Pistons for Alignment (Extreme Detail)
        // 4 pistons per gate connecting stator to base/scaffold
        for (let p = 0; p < 4; p++) {
            const angle = (p / 4) * Math.PI * 2 + Math.PI/4;
            const pGroup = new THREE.Group();
            
            const baseX = Math.cos(angle) * 450;
            const baseY = Math.sin(angle) * 450;
            
            // Cylinder Outer
            const cylGeom = new THREE.CylinderGeometry(12, 15, 100, 16);
            const cylMesh = new THREE.Mesh(cylGeom, steel);
            cylMesh.rotation.x = Math.PI/2;
            cylMesh.position.set(baseX, baseY, 50);
            pGroup.add(cylMesh);
            
            // Shaft Inner
            const shaftGeom = new THREE.CylinderGeometry(8, 8, 120, 16);
            const shaftMesh = new THREE.Mesh(shaftGeom, chrome);
            shaftMesh.rotation.x = Math.PI/2;
            shaftMesh.position.set(baseX, baseY, 0); // Will be animated
            pGroup.add(shaftMesh);
            
            gateGroup.add(pGroup);
            gatePistons.push({
                shaft: shaftMesh,
                baseZ: 0,
                freq: 1.5 + Math.random(),
                phase: Math.random() * Math.PI * 2,
                amp: 20 + Math.random() * 15
            });
        }
    }

    // ==========================================
    // 5. CRYSTALLINE SCAFFOLDING & CONDUITS
    // ==========================================
    const scaffoldGroup = new THREE.Group();
    group.add(scaffoldGroup);
    
    // 5.1 Main lattice nodes (Octahedrons)
    const nodePositions = [];
    const radiusLayers = [250, 450, 600];
    radiusLayers.forEach((r, layerIdx) => {
        const count = 12 + layerIdx * 6;
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            
            const x = r * Math.cos(theta) * Math.sin(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(phi);
            
            // Only keep nodes that aren't inside the gates or core
            if (Math.abs(y) < 600) {
                nodePositions.push(new THREE.Vector3(x, y, z));
            }
        }
    });

    const nodeMeshes = [];
    nodePositions.forEach((pos, i) => {
        const nodeGeom = new THREE.OctahedronGeometry(20, 1);
        const nodeMesh = new THREE.Mesh(nodeGeom, crystalMaterial);
        nodeMesh.position.copy(pos);
        scaffoldGroup.add(nodeMesh);
        nodeMeshes.push(nodeMesh);
    });

    parts.push({
        name: "Crystalline Lattice Nodes",
        description: "Metamaterial octahedron nodes composed of synthetic diamond and programmable matter. They route exotic energies and dark matter between the core and the gates.",
        material: "crystalMaterial",
        function: "Structural integrity and energy routing.",
        assemblyOrder: 30,
        connections: ["Energy Core", "Gate Stators", "Conduit Tubes"],
        failureEffect: "Lattice decoupling, leading to catastrophic physical collapse of the nexus.",
        cascadeFailures: ["Entire Structure"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0, 1000, 0)
    });

    // 5.2 Connecting Tubes (CatmullRom curves between nodes)
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
            const dist = nodePositions[i].distanceTo(nodePositions[j]);
            if (dist > 50 && dist < 250) {
                const curve = new THREE.CatmullRomCurve3([
                    nodePositions[i],
                    nodePositions[i].clone().lerp(nodePositions[j], 0.5).add(new THREE.Vector3(Math.random()*40-20, Math.random()*40-20, Math.random()*40-20)),
                    nodePositions[j]
                ]);
                const tubeGeom = new THREE.TubeGeometry(curve, 20, 4, 8, false);
                const tubeMesh = new THREE.Mesh(tubeGeom, lineMat);
                scaffoldGroup.add(tubeMesh);
            }
        }
    }

    // 5.3 Heavy Support Struts to Gates
    gatePositions.forEach((gatePos, index) => {
        const strutGeom = new THREE.CylinderGeometry(25, 25, gatePos.length() - 400, 32);
        const strutMesh = new THREE.Mesh(strutGeom, steel);
        
        // Orient strut from hub to gate
        const midpoint = gatePos.clone().multiplyScalar(0.5);
        strutMesh.position.copy(midpoint);
        strutMesh.lookAt(gatePos);
        strutMesh.rotation.x += Math.PI / 2; // Fix cylinder orientation
        
        scaffoldGroup.add(strutMesh);
        
        // Add energy piping along the strut
        for(let k = 0; k < 4; k++) {
            const pipeGeom = new THREE.CylinderGeometry(5, 5, gatePos.length() - 400, 16);
            const pipeMesh = new THREE.Mesh(pipeGeom, activeConduitMaterial);
            pipeMesh.position.copy(midpoint);
            pipeMesh.lookAt(gatePos);
            pipeMesh.rotation.x += Math.PI / 2;
            
            const offset = 35;
            const angle = (k / 4) * Math.PI * 2;
            pipeMesh.translateX(Math.cos(angle) * offset);
            pipeMesh.translateZ(Math.sin(angle) * offset);
            
            scaffoldGroup.add(pipeMesh);
        }
    });

    parts.push({
        name: "Primary Umbilical Struts",
        description: "Massive titanium-steel reinforced cylinders connecting the central core directly to the gates. They carry the primary plasma conduits and dark matter pipelines.",
        material: "steel/activeConduitMaterial",
        function: "Main structural bracing and power transmission.",
        assemblyOrder: 31,
        connections: ["Hub Core", "Gate Stators"],
        failureEffect: "Gate detachment and uncontrolled trajectory into deep space.",
        cascadeFailures: ["Gate Event Horizon", "Lattice Nodes"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0, -1000, 0)
    });

    // ==========================================
    // 6. SHIPS & TRAFFIC ANIMATION LOGIC
    // ==========================================
    const fleetGroup = new THREE.Group();
    group.add(fleetGroup);
    
    const shipsData = [];

    // Factory function to build an extremely complex micro-ship
    function buildAdvancedShip() {
        const shipGroup = new THREE.Group();
        
        // Fuselage (Lathe)
        const fusePoints = [];
        for(let i=0; i<=20; i++) {
            const t = i/20;
            // Aerodynamic / Space-dynamic teardrop shape
            const r = 2 * Math.sin(t * Math.PI) * (1 - t*0.5) + 0.1;
            const z = t * 15 - 7.5;
            fusePoints.push(new THREE.Vector2(r, z));
        }
        const fuseGeom = new THREE.LatheGeometry(fusePoints, 16);
        const fuseMesh = new THREE.Mesh(fuseGeom, plastic);
        fuseMesh.rotation.x = -Math.PI / 2;
        shipGroup.add(fuseMesh);
        
        // Cockpit
        const cockpitGeom = new THREE.CapsuleGeometry(1.5, 4, 16, 16);
        const cockpit = new THREE.Mesh(cockpitGeom, tinted);
        cockpit.position.set(0, 1.5, -2);
        cockpit.rotation.x = Math.PI / 2;
        cockpit.scale.z = 0.5;
        shipGroup.add(cockpit);
        
        // Wings (Extruded Shape)
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.lineTo(6, -2);
        wingShape.lineTo(8, -6);
        wingShape.lineTo(0, -5);
        const extSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const wingGeom = new THREE.ExtrudeGeometry(wingShape, extSettings);
        
        const wingR = new THREE.Mesh(wingGeom, darkSteel);
        wingR.position.set(1.5, 0, 0);
        wingR.rotation.x = Math.PI / 2;
        shipGroup.add(wingR);
        
        const wingL = new THREE.Mesh(wingGeom, darkSteel);
        wingL.position.set(-1.5, 0, 0);
        wingL.rotation.x = Math.PI / 2;
        wingL.scale.x = -1;
        shipGroup.add(wingL);
        
        // Engine Thrusters
        const engGeom = new THREE.CylinderGeometry(0.8, 1.5, 3, 16);
        const engMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x00aaff });
        
        for(let i=0; i<2; i++) {
            const engine = new THREE.Mesh(engGeom, engMat);
            engine.position.set(i===0 ? 2 : -2, 0, 7.5);
            engine.rotation.x = Math.PI / 2;
            
            const glow = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), glowMat);
            glow.position.y = 1.5;
            engine.add(glow);
            
            shipGroup.add(engine);
        }
        
        return shipGroup;
    }

    // Generate 30 ships traveling on complex Bézier curves between gates and hub
    for (let s = 0; s < 30; s++) {
        const ship = buildAdvancedShip();
        // Scale ships appropriately
        ship.scale.setScalar(1.5 + Math.random());
        fleetGroup.add(ship);
        
        // Determine start and end points
        // 0: Hub, 1: Alpha, 2: Beta, 3: Gamma
        const startIdx = Math.floor(Math.random() * 4);
        let endIdx = Math.floor(Math.random() * 4);
        while (endIdx === startIdx) endIdx = Math.floor(Math.random() * 4);
        
        const getPoint = (idx) => {
            if (idx === 0) return new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100 + 200, (Math.random()-0.5)*100);
            return gatePositions[idx - 1].clone();
        };
        
        const startPt = getPoint(startIdx);
        const endPt = getPoint(endIdx);
        
        // Control points for sweeping space trajectories
        const cp1 = startPt.clone().add(new THREE.Vector3(Math.random()*400-200, Math.random()*400, Math.random()*400-200));
        const cp2 = endPt.clone().add(new THREE.Vector3(Math.random()*400-200, Math.random()*400, Math.random()*400-200));
        
        const curve = new THREE.CubicBezierCurve3(startPt, cp1, cp2, endPt);
        
        shipsData.push({
            mesh: ship,
            curve: curve,
            offset: Math.random(),
            speed: 0.05 + Math.random() * 0.05
        });
    }

    // ==========================================
    // 7. ANIMATION LOGIC
    // ==========================================
    function animate(time, speed = 1.0, meshes = []) {
        const timeSec = time * 0.001; // Convert to seconds if time is ms
        
        // Update Shaders
        alphaUniforms.time.value = timeSec * alphaUniforms.swirlSpeed.value * speed * 0.1;
        betaUniforms.time.value = timeSec * betaUniforms.swirlSpeed.value * speed * 0.1;
        gammaUniforms.time.value = timeSec * gammaUniforms.swirlSpeed.value * speed * 0.1;
        
        // Rotate Hub Rings (Gyroscopic effect)
        hubRings.forEach((ringObj) => {
            ringObj.group.rotation.x += ringObj.speed * 0.005 * speed;
            ringObj.group.rotation.y += ringObj.speed * 0.007 * speed;
            ringObj.group.rotation.z += ringObj.speed * 0.003 * speed;
        });
        
        // Rotate Gate Rotors (Superfluid rings)
        gateRotors[0].rotation.z += 0.02 * speed; // Alpha
        gateRotors[1].rotation.z -= 0.025 * speed; // Beta
        gateRotors[2].rotation.z += 0.018 * speed; // Gamma
        
        // Animate Pistons (Hydraulic micro-adjustments)
        gatePistons.forEach(piston => {
            const extension = Math.sin(timeSec * speed * piston.freq + piston.phase) * piston.amp;
            piston.shaft.position.z = piston.baseZ + extension;
        });
        
        // Pulse Crystalline Scaffolding Nodes
        crystalMaterial.emissiveIntensity = 0.5 + Math.sin(timeSec * speed * 3) * 0.3;
        
        // Pulse Core Energy
        energyCoreMaterial.emissiveIntensity = 3.0 + Math.sin(timeSec * speed * 10) * 2.0;
        
        // Animate Ships
        shipsData.forEach(shipObj => {
            // Loop from 0.0 to 1.0
            const t = ((timeSec * speed * shipObj.speed) + shipObj.offset) % 1.0;
            
            // Get position and derivative
            const pos = shipObj.curve.getPointAt(t);
            const tangent = shipObj.curve.getTangentAt(t).normalize();
            
            shipObj.mesh.position.copy(pos);
            
            // Look ahead
            const target = pos.clone().add(tangent);
            shipObj.mesh.lookAt(target);
            
            // Add banking roll based on curve derivative curvature (simplified as sine wave here for aesthetics)
            shipObj.mesh.rotateZ(Math.sin(t * Math.PI * 4) * 0.8);
            
            // If near wormhole (t > 0.95 or t < 0.05), scale down (spaghettification/entry effect)
            if (t > 0.95) {
                const scale = (1.0 - t) * 20;
                shipObj.mesh.scale.setScalar(scale);
            } else if (t < 0.05) {
                const scale = (t) * 20;
                shipObj.mesh.scale.setScalar(scale);
            } else {
                // Maintain base scale calculated during initialization
                // (Assumes initial scale was ~2.0, we just set it here to 2.0 for safety)
                shipObj.mesh.scale.setScalar(2.0);
            }
        });
    }

    // ==========================================
    // 8. EXTREME PHD-LEVEL QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Alcubierre warp metric utilized by this Nexus, maintaining the warp bubble requires a violation of certain energy conditions. Specifically, to generate the required negative energy density, which classical energy condition must be explicitly violated?",
            options: [
                "The Dominant Energy Condition (DEC)",
                "The Strong Energy Condition (SEC)",
                "The Weak Energy Condition (WEC)",
                "The Null Energy Condition (NEC)"
            ],
            correctAnswer: 2,
            explanation: "The Weak Energy Condition (WEC) states that the energy density measured by any observer must be non-negative. The Alcubierre metric requires regions of negative energy density to contract space ahead of the ship and expand it behind, thus violating the WEC."
        },
        {
            question: "The traversable wormhole gates (Morris-Thorne metric) rely on a 'superfluid rotor' of exotic matter. To prevent the wormhole throat from pinching off under its own gravity, this exotic matter must possess a radial tension. How must this radial tension relate to its mass-energy density (\u03c1)?",
            options: [
                "The radial tension must be exactly zero.",
                "The radial tension must exceed the mass-energy density (\u03c4 > \u03c1c\u00b2).",
                "The radial tension must equal the cosmological constant.",
                "The radial tension must be less than the pressure (\u03c4 < p)."
            ],
            correctAnswer: 1,
            explanation: "To hold the throat open against gravitational collapse, the exotic matter must exert an outward radial tension (negative pressure) that is greater in magnitude than its mass-energy density, severely violating the Null Energy Condition."
        },
        {
            question: "The central core utilizes a synthetic ergosphere to extract rotational energy, similar to a Kerr black hole. Which process describes the theoretical extraction of energy by dropping mass into the ergosphere and allowing it to split, with one part falling into the event horizon with negative orbital energy?",
            options: [
                "Hawking Radiation",
                "The Penrose Process",
                "The Blandford-Znajek Process",
                "The Casimir Effect"
            ],
            correctAnswer: 1,
            explanation: "The Penrose Process allows energy to be extracted from a rotating black hole. A particle enters the ergosphere, splits in two; one half falls past the event horizon with negative energy, and the other escapes with more energy than the original particle had."
        },
        {
            question: "The energy for the gate manifolds is partially drawn from the manipulation of the quantum vacuum using parallel plates. This phenomenon, where quantized boundary conditions alter the zero-point energy of the vacuum, is known as:",
            options: [
                "The Meissner Effect",
                "The Unruh Effect",
                "The Casimir Effect",
                "The Zeeman Effect"
            ],
            correctAnswer: 2,
            explanation: "The Casimir Effect occurs when boundary conditions (like closely spaced uncharged conductive plates) restrict the allowable vacuum fluctuation modes, resulting in an attractive force and a localized region of negative energy density relative to the standard vacuum."
        },
        {
            question: "If Gate Alpha and Gate Beta are moved relative to each other at relativistic velocities, or if one is placed deep in a gravity well relative to the other, what dangerous topological feature could the wormhole network inadvertently create?",
            options: [
                "A Closed Timelike Curve (CTC), enabling retrograde time travel.",
                "A naked singularity violating cosmic censorship.",
                "An expanding false vacuum bubble.",
                "A cosmic string network."
            ],
            correctAnswer: 0,
            explanation: "Due to special and general relativistic time dilation, the two mouths of the wormhole can age at different rates. Traversing the wormhole from the 'older' mouth to the 'younger' mouth would allow a traveler to arrive before they left, forming a Closed Timelike Curve."
        }
    ];

    // ==========================================
    // 9. FINAL EXPORT OBJECT
    // ==========================================
    return {
        group,
        parts,
        description: "GOD-TIER INTERGALACTIC WARP GATE NEXUS: An astoundingly complex macro-engineering construct that manipulates spacetime topology to bridge vast cosmic distances. Features three Morris-Thorne traversable wormholes stabilized by Alcubierre-metric frame-dragging rings, Bose-Einstein condensate superfluid rotors, and a central Kerr-metric zero-point energy singularity core.",
        quizQuestions,
        animate
    };
}
