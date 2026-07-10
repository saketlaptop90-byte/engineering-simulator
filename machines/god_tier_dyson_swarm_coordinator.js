import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "Dyson_Swarm_Coordinator_GodTier";

    const parts = [];
    
    // ==========================================
    // UTILITY & MATH FUNCTIONS
    // ==========================================
    const TWO_PI = Math.PI * 2;
    
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createGlowingMaterial(colorHex, intensity) {
        return new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: colorHex,
            emissiveIntensity: intensity,
            transparent: true,
            opacity: 0.9,
            wireframe: false,
        });
    }

    // ==========================================
    // 1. THE CENTRAL COMMAND STATION (CORE HULL)
    // ==========================================
    
    // The core is a highly complex LatheGeometry representing a multi-kilometer long structure.
    const corePoints = [];
    for ( let i = 0; i <= 100; i ++ ) {
        const t = i / 100;
        const radius = 20 + 15 * Math.sin(t * Math.PI) + 5 * Math.cos(t * Math.PI * 20) + 2 * Math.sin(t * Math.PI * 50);
        const height = (t - 0.5) * 200;
        corePoints.push( new THREE.Vector2( radius, height ) );
    }
    
    const coreGeometry = new THREE.LatheGeometry( corePoints, 128 );
    const coreMesh = new THREE.Mesh( coreGeometry, darkSteel );
    coreMesh.rotation.x = Math.PI / 2; // Orient along Z axis
    group.add(coreMesh);
    
    parts.push({
        name: "Central Hub Nexus",
        description: "The primary megastructure hull constructed from ultra-dense neutronium-laced carbon composites. Houses the primary quantum computing cores.",
        material: "darkSteel",
        function: "Main structural support, housing millions of personnel and the swarm AI.",
        assemblyOrder: 1,
        connections: ["Habitat Rings", "Fractal Antennas", "Reactor Core"],
        failureEffect: "Complete structural collapse and loss of Swarm synchronization.",
        cascadeFailures: ["Swarm Decentralization", "Reactor Overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // ==========================================
    // 2. HABITAT RINGS (EXTREME DETAIL)
    // ==========================================
    
    const ringGroup = new THREE.Group();
    const ringCount = 6;
    const rings = [];
    
    for(let r = 0; r < ringCount; r++) {
        const ringRadius = 80 + r * 30;
        const tubeRadius = 4 + (r % 2) * 2;
        const ringGeo = new THREE.TorusGeometry(ringRadius, tubeRadius, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeo, steel);
        
        // Add intricate details to the ring
        const greebleCount = 120;
        for(let g = 0; g < greebleCount; g++) {
            const theta = (g / greebleCount) * TWO_PI;
            const greebleGeo = new THREE.BoxGeometry(tubeRadius * 2.5, tubeRadius * 2.5, tubeRadius * 0.5);
            const greebleMesh = new THREE.Mesh(greebleGeo, aluminum);
            
            greebleMesh.position.x = Math.cos(theta) * ringRadius;
            greebleMesh.position.y = Math.sin(theta) * ringRadius;
            greebleMesh.lookAt(new THREE.Vector3(0,0,0));
            ringMesh.add(greebleMesh);
            
            // Add glowing windows/ports
            if (g % 3 === 0) {
                const windowGeo = new THREE.PlaneGeometry(tubeRadius, tubeRadius * 0.8);
                const windowMat = createGlowingMaterial(0x00ffff, 2.0);
                const windowMesh = new THREE.Mesh(windowGeo, windowMat);
                windowMesh.position.z = tubeRadius + 0.1;
                greebleMesh.add(windowMesh);
            }
        }
        
        // Struts connecting ring to core
        const strutCount = 12;
        for(let s = 0; s < strutCount; s++) {
            const theta = (s / strutCount) * TWO_PI;
            const strutGeo = new THREE.CylinderGeometry(1, 2, ringRadius - 20, 16);
            const strutMesh = new THREE.Mesh(strutGeo, darkSteel);
            
            strutMesh.position.x = Math.cos(theta) * (ringRadius / 2 + 10);
            strutMesh.position.y = Math.sin(theta) * (ringRadius / 2 + 10);
            
            strutMesh.rotation.z = theta + Math.PI / 2;
            ringMesh.add(strutMesh);
        }
        
        ringMesh.position.z = (r - ringCount/2) * 25;
        
        ringGroup.add(ringMesh);
        rings.push({ mesh: ringMesh, speed: (r % 2 === 0 ? 1 : -1) * (0.001 + r * 0.0005) });
        
        parts.push({
            name: `Habitat Torus Sector ${r+1}`,
            description: `Centrifugal habitat ring maintaining 1G for biological crew. Diameter: ${ringRadius * 100} meters.`,
            material: "steel/aluminum",
            function: "Life support, crew quarters, biospheres.",
            assemblyOrder: 2 + r,
            connections: ["Central Hub Nexus"],
            failureEffect: "Loss of life support, catastrophic atmospheric venting.",
            cascadeFailures: ["Biological Crew Expiration"],
            originalPosition: { x: 0, y: 0, z: ringMesh.position.z },
            explodedPosition: { x: Math.cos(r) * 200, y: Math.sin(r) * 200, z: ringMesh.position.z }
        });
    }
    
    group.add(ringGroup);

    // ==========================================
    // 3. FRACTAL COMMUNICATIONS ARRAYS
    // ==========================================
    
    const antennaGroup = new THREE.Group();
    
    function buildFractalAntenna(depth, length, radius, parentMesh) {
        if (depth === 0) return;
        
        const cylGeo = new THREE.CylinderGeometry(radius * 0.6, radius, length, 8);
        const cylMesh = new THREE.Mesh(cylGeo, copper);
        
        // Move cylinder up so its base is at origin
        cylMesh.position.y = length / 2;
        
        // Add a glowing node at the joint
        const nodeGeo = new THREE.SphereGeometry(radius * 1.5, 16, 16);
        const nodeMat = createGlowingMaterial(0xff00ff, 1.5);
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.y = length / 2;
        cylMesh.add(nodeMesh);
        
        parentMesh.add(cylMesh);
        
        // Branches
        const branches = 3;
        for(let i = 0; i < branches; i++) {
            const pivot = new THREE.Group();
            pivot.position.y = length / 2;
            
            // Rotate outward
            pivot.rotation.z = Math.PI / 4;
            // Spread around
            pivot.rotation.y = (i / branches) * TWO_PI;
            
            cylMesh.add(pivot);
            buildFractalAntenna(depth - 1, length * 0.6, radius * 0.5, pivot);
        }
    }

    const numAntennas = 4;
    for(let a = 0; a < numAntennas; a++) {
        const baseGroup = new THREE.Group();
        buildFractalAntenna(5, 40, 3, baseGroup);
        
        baseGroup.rotation.x = Math.PI / 2;
        baseGroup.rotation.y = (a / numAntennas) * TWO_PI;
        baseGroup.position.z = -100; // Place at the "top" of the core
        
        antennaGroup.add(baseGroup);
        
        parts.push({
            name: `Fractal Phase Array ${a+1}`,
            description: "Recursive hypergeometric transmitter responsible for FTL quantum-entanglement telemetry to the swarm.",
            material: "copper/gold",
            function: "Swarm coordination and telemetry gathering.",
            assemblyOrder: 10 + a,
            connections: ["Central Hub Nexus"],
            failureEffect: "Loss of command signal, swarm elements revert to autonomous safe-mode.",
            cascadeFailures: ["Swarm Misalignment", "Power Drop"],
            originalPosition: { x: baseGroup.position.x, y: baseGroup.position.y, z: baseGroup.position.z },
            explodedPosition: { x: Math.cos((a/numAntennas)*TWO_PI) * 300, y: Math.sin((a/numAntennas)*TWO_PI) * 300, z: -400 }
        });
    }
    
    group.add(antennaGroup);

    // ==========================================
    // 4. ENERGY RECEIVERS (DISHES)
    // ==========================================
    
    const dishGroup = new THREE.Group();
    const dishCount = 8;
    
    for(let d = 0; d < dishCount; d++) {
        const dishGeo = new THREE.SphereGeometry(15, 32, 16, 0, TWO_PI, 0, Math.PI / 2.5);
        const dishMesh = new THREE.Mesh(dishGeo, chrome);
        
        const innerDishMat = createGlowingMaterial(0x00ff00, 2.0);
        const innerDishMesh = new THREE.Mesh(dishGeo, innerDishMat);
        innerDishMesh.scale.set(0.98, 0.98, 0.98);
        dishMesh.add(innerDishMesh);
        
        // Positioning around the bottom hull
        const theta = (d / dishCount) * TWO_PI;
        const radiusDish = 45;
        dishMesh.position.set(Math.cos(theta) * radiusDish, Math.sin(theta) * radiusDish, 80);
        
        // Orient dish outward
        dishMesh.lookAt(dishMesh.position.x * 2, dishMesh.position.y * 2, dishMesh.position.z + 100);
        
        // Add central collector spire
        const spireGeo = new THREE.CylinderGeometry(0.5, 1, 20, 8);
        const spireMesh = new THREE.Mesh(spireGeo, steel);
        spireMesh.rotation.x = Math.PI / 2;
        spireMesh.position.z = 10;
        dishMesh.add(spireMesh);
        
        dishGroup.add(dishMesh);
        
        parts.push({
            name: `Microwave Rectenna Dish ${d+1}`,
            description: "High-efficiency rectifying antenna receiving concentrated microwave energy from the orbital swarm.",
            material: "chrome/metamaterials",
            function: "Power reception and grid distribution.",
            assemblyOrder: 15 + d,
            connections: ["Central Hub Nexus", "Energy Grid"],
            failureEffect: "12.5% drop in net energy reception. Potential thermal overload if beam is not aborted.",
            cascadeFailures: ["Grid Instability"],
            originalPosition: { x: dishMesh.position.x, y: dishMesh.position.y, z: dishMesh.position.z },
            explodedPosition: { x: dishMesh.position.x * 3, y: dishMesh.position.y * 3, z: 200 }
        });
    }
    
    group.add(dishGroup);

    // ==========================================
    // 5. HYDRAULICS, PIPING & GREEBLES
    // ==========================================
    
    const pipeGroup = new THREE.Group();
    const splineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(20, 0, -80),
            new THREE.Vector3(35, 15, -40),
            new THREE.Vector3(25, 25, 0),
            new THREE.Vector3(40, -10, 40),
            new THREE.Vector3(20, 0, 80)
        ]),
        64, 2, 8, false
    );
    
    for(let p = 0; p < 8; p++) {
        const pipeMesh = new THREE.Mesh(splineGeo, copper);
        pipeMesh.rotation.z = (p / 8) * TWO_PI;
        pipeGroup.add(pipeMesh);
    }
    
    group.add(pipeGroup);
    parts.push({
        name: "Coolant Transfer Conduits",
        description: "Superfluid helium-4 conduits regulating the immense heat from the quantum cores and microwave rectennas.",
        material: "copper/superconductors",
        function: "Thermal regulation.",
        assemblyOrder: 25,
        connections: ["Central Hub Nexus", "Radiator Fins"],
        failureEffect: "Thermal runaway resulting in localized melting of the hub.",
        cascadeFailures: ["Quantum Core Decoherence", "Rectenna Fusion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 300 }
    });


    // ==========================================
    // 6. THE STELLAR BODY (BACKGROUND STAR)
    // ==========================================
    
    // Create a massive star in the background
    const starRadius = 6000;
    const starGeo = new THREE.SphereGeometry(starRadius, 128, 128);
    
    // Custom shader for the star surface
    const starUniforms = {
        time: { value: 0.0 },
        colorA: { value: new THREE.Color(0xffaa00) },
        colorB: { value: new THREE.Color(0xff2200) }
    };
    
    const starMaterial = new THREE.ShaderMaterial({
        uniforms: starUniforms,
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 colorA;
            uniform vec3 colorB;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            // Simplex noise function
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
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute(
                           i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                         + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                         + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
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
            
            void main() {
                float noiseVal = snoise(vPosition * 0.001 + time * 0.5);
                float noiseVal2 = snoise(vPosition * 0.005 - time * 0.2);
                float finalNoise = (noiseVal + noiseVal2) * 0.5 + 0.5;
                
                vec3 color = mix(colorB, colorA, finalNoise);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.DoubleSide
    });
    
    const starMesh = new THREE.Mesh(starGeo, starMaterial);
    starMesh.position.set(0, 0, -15000); // Placed far in the background
    group.add(starMesh);
    
    // Corona / Glow effect for the star
    const coronaGeo = new THREE.PlaneGeometry(starRadius * 3, starRadius * 3);
    const coronaMat = new THREE.MeshBasicMaterial({
        map: new THREE.Texture(), // We'll simulate with radial gradient in shader
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    
    // Overriding the basic material with a custom shader for radial glow
    coronaMat.onBeforeCompile = (shader) => {
        shader.fragmentShader = `
            varying vec2 vUv;
            void main() {
                vec2 center = vec2(0.5, 0.5);
                float dist = distance(vUv, center);
                float alpha = smoothstep(0.5, 0.1, dist);
                gl_FragColor = vec4(1.0, 0.6, 0.1, alpha * 0.8);
            }
        `;
        // Inject vUv passing
        shader.vertexShader = `
            varying vec2 vUv;
            ` + shader.vertexShader.replace(
                `#include <uv_vertex>`,
                `#include <uv_vertex>
                 vUv = uv;`
            );
    };
    
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.position.copy(starMesh.position);
    coronaMesh.lookAt(0,0,0);
    group.add(coronaMesh);

    parts.push({
        name: "Local Host Star",
        description: "A G-Type main sequence star providing 3.8 x 10^26 Watts of power to the Dyson Swarm.",
        material: "plasma",
        function: "Primary energy source.",
        assemblyOrder: 0,
        connections: ["Gravity Well"],
        failureEffect: "Supernova or premature red giant expansion, destroying the entire swarm.",
        cascadeFailures: ["System Annihilation"],
        originalPosition: { x: 0, y: 0, z: -15000 },
        explodedPosition: { x: 0, y: 0, z: -15000 } // Doesn't move in explode
    });


    // ==========================================
    // 7. THE DYSON SWARM (INSTANCED MESH)
    // ==========================================
    
    // 15,000 satellites dynamically orbiting via a custom shader
    const swarmCount = 15000;
    
    // Create a highly detailed single satellite geometry
    const satGroup = new THREE.Group();
    // Central bus
    const satBusGeo = new THREE.CylinderGeometry(2, 2, 8, 6);
    // Solar sails / panels (Hexagonal)
    const satPanelGeo = new THREE.CylinderGeometry(15, 15, 0.2, 6);
    
    // Merge geometries for the instanced mesh (using BufferGeometryUtils is ideal, but we will manually construct it to avoid dependencies)
    // We will just use the panel geometry as it's the most visible part from a distance.
    
    const swarmMaterial = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        emissive: 0x113366,
        roughness: 0.2,
        metalness: 0.9,
        side: THREE.DoubleSide
    });
    
    const swarmInstanced = new THREE.InstancedMesh(satPanelGeo, swarmMaterial, swarmCount);
    
    // We will feed orbital parameters into custom attributes
    const orbitData = new Float32Array(swarmCount * 4); // radius, speed, phase, inclination
    
    const dummy = new THREE.Object3D();
    for (let i = 0; i < swarmCount; i++) {
        const radius = randomRange(starRadius + 1000, starRadius + 5000);
        const speed = randomRange(0.05, 0.2) * (Math.random() > 0.5 ? 1 : -1);
        const phase = randomRange(0, TWO_PI);
        const inclination = randomRange(-Math.PI / 4, Math.PI / 4);
        
        orbitData[i * 4 + 0] = radius;
        orbitData[i * 4 + 1] = speed;
        orbitData[i * 4 + 2] = phase;
        orbitData[i * 4 + 3] = inclination;
        
        // Initial set to origin, shader handles translation
        dummy.position.set(0,0,0);
        
        // Add some random rotation to the panels
        dummy.rotation.set(randomRange(0, TWO_PI), randomRange(0, TWO_PI), randomRange(0, TWO_PI));
        dummy.scale.set(1,1,1);
        dummy.updateMatrix();
        swarmInstanced.setMatrixAt(i, dummy.matrix);
    }
    
    swarmInstanced.instanceMatrix.needsUpdate = true;
    
    // Add custom attribute to geometry
    satPanelGeo.setAttribute('orbitData', new THREE.InstancedBufferAttribute(orbitData, 4));
    
    // Hook into the material's shader to apply orbital mechanics entirely on the GPU
    swarmMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.swarmTime = { value: 0 };
        shader.uniforms.starPos = { value: starMesh.position };
        
        swarmMaterial.userData.shader = shader; // Save ref for animation loop
        
        shader.vertexShader = `
            attribute vec4 orbitData; // x: radius, y: speed, z: phase, w: inclination
            uniform float swarmTime;
            uniform vec3 starPos;
        ` + shader.vertexShader;
        
        shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `
            float timePhase = swarmTime * orbitData.y + orbitData.z;
            float r = orbitData.x;
            float inc = orbitData.w;
            
            // Calculate orbital position
            float cx = r * cos(timePhase);
            float cz = r * sin(timePhase);
            float cy = cx * sin(inc);
            float realCx = cx * cos(inc);
            
            vec3 transformed = vec3(position);
            
            // Translate based on orbit, relative to the star's position
            transformed.x += realCx + starPos.x;
            transformed.y += cy + starPos.y;
            transformed.z += cz + starPos.z;
            `
        );
    };
    
    group.add(swarmInstanced);
    
    parts.push({
        name: "Dyson Swarm Nodes (Instanced Array)",
        description: `An array of ${swarmCount} individual solar statites and microwave transmitters orbiting the host star.`,
        material: "metamaterial/graphene",
        function: "Energy collection and transmission via phased array.",
        assemblyOrder: 99,
        connections: ["Energy Receivers", "Host Star"],
        failureEffect: "Kessler syndrome on a stellar scale; immense power loss.",
        cascadeFailures: ["Hub Blackout", "Interstellar Transmission Failure"],
        originalPosition: { x: 0, y: 0, z: -15000 },
        explodedPosition: { x: 0, y: 0, z: -15000 }
    });

    // ==========================================
    // 8. ENERGY TRANSFER BEAMS
    // ==========================================
    
    // Thousands of lines shooting from the swarm towards the dishes
    const beamCount = 300;
    const beamGeo = new THREE.BufferGeometry();
    const beamPositions = new Float32Array(beamCount * 2 * 3); // 2 vertices per beam (start, end)
    const beamOpacities = new Float32Array(beamCount * 2); 
    
    for (let i = 0; i < beamCount; i++) {
        // Start points will be updated in animation to track swarm nodes
        // End points are fixed to the dishes
        const dishIndex = i % dishCount;
        const targetDish = dishGroup.children[dishIndex];
        
        // Initialize with dummy values
        beamPositions[i*6 + 0] = 0;
        beamPositions[i*6 + 1] = 0;
        beamPositions[i*6 + 2] = -10000;
        
        beamPositions[i*6 + 3] = targetDish.position.x;
        beamPositions[i*6 + 4] = targetDish.position.y;
        beamPositions[i*6 + 5] = targetDish.position.z;
        
        beamOpacities[i*2 + 0] = 0.0;
        beamOpacities[i*2 + 1] = 1.0;
    }
    
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
    beamGeo.setAttribute('alpha', new THREE.BufferAttribute(beamOpacities, 1));
    
    const beamMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            void main() {
                vAlpha = alpha;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying float vAlpha;
            void main() {
                // Pulse effect
                float pulse = (sin(time * 10.0 + gl_FragCoord.y * 0.1) * 0.5 + 0.5);
                gl_FragColor = vec4(0.2, 1.0, 0.5, vAlpha * pulse * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const beamsMesh = new THREE.LineSegments(beamGeo, beamMaterial);
    group.add(beamsMesh);


    // ==========================================
    // 9. HOLOGRAPHIC DATA PROJECTIONS
    // ==========================================
    
    const holoGroup = new THREE.Group();
    const holoCount = 12;
    
    const holoUniforms = {
        time: { value: 0.0 }
    };
    
    const holoMaterial = new THREE.ShaderMaterial({
        uniforms: holoUniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
            
            void main() {
                // Hexagonal grid and scrolling data lines
                vec2 grid = fract(vUv * 10.0);
                float border = step(0.1, grid.x) * step(0.1, grid.y);
                
                // Scanline
                float scan = step(0.98, fract(vUv.y * 5.0 - time * 2.0));
                
                // Noise
                float noise = rand(vUv * floor(time * 10.0));
                
                vec3 color = vec3(0.0, 0.8, 1.0);
                float alpha = (1.0 - border) * 0.5 + scan * 0.8 + noise * 0.1;
                
                // Fade edges
                float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x) * 
                             smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
                
                gl_FragColor = vec4(color, alpha * edge * 0.6);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    
    for (let h = 0; h < holoCount; h++) {
        const holoGeo = new THREE.PlaneGeometry(60, 40);
        const holoMesh = new THREE.Mesh(holoGeo, holoMaterial);
        
        const theta = (h / holoCount) * TWO_PI;
        const radius = 150;
        
        holoMesh.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
        holoMesh.lookAt(0,0,0);
        
        holoGroup.add(holoMesh);
    }
    
    group.add(holoGroup);
    parts.push({
        name: "Holographic Telemetry Dashboards",
        description: "Hard-light holographic interfaces projecting real-time quantum diagnostics of the swarm array.",
        material: "photons/forcefields",
        function: "User Interface for ascended entities.",
        assemblyOrder: 30,
        connections: ["Central Hub Nexus"],
        failureEffect: "Loss of tactical overview.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // handled by parent scale/rotation
    });


    // ==========================================
    // 10. INNER REACTOR CORE (DODECAHEDRONS)
    // ==========================================
    
    const coreMat = createGlowingMaterial(0xffffff, 3.0);
    const innerCoreGeo = new THREE.DodecahedronGeometry(10, 0);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, coreMat);
    group.add(innerCoreMesh);
    
    const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5 });
    const outerCoreGeo = new THREE.DodecahedronGeometry(15, 1);
    const outerCoreMesh = new THREE.Mesh(outerCoreGeo, wireframeMat);
    innerCoreMesh.add(outerCoreMesh);
    
    parts.push({
        name: "Singularity Tap Reactor",
        description: "A contained microscopic artificial black hole serving as a secondary power backup and gravitational anchor.",
        material: "exotic matter",
        function: "Gravimetric stabilization and emergency power.",
        assemblyOrder: 3,
        connections: ["Central Hub Nexus"],
        failureEffect: "Event horizon expands, consuming the central command station.",
        cascadeFailures: ["Total Local Annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // ==========================================
    // QUIZ QUESTIONS (PhD Level)
    // ==========================================
    const quizQuestions = [
        {
            question: "In a Dyson Swarm composed of solar statites, what is the primary counterbalancing force against the host star's gravitational pull that allows them to remain stationary relative to the star?",
            options: [
                "Centrifugal force from high-velocity orbits",
                "Solar radiation pressure acting on ultra-thin sails",
                "Magnetic levitation against the stellar heliosphere",
                "Gravitational tractor beams from the central hub"
            ],
            correctAnswer: 1,
            explanation: "Statites (static satellites) use solar radiation pressure exerted on a massive, ultra-thin sail to exactly counteract the star's gravitational pull, allowing them to hover indefinitely without orbiting."
        },
        {
            question: "To transmit power efficiently from the swarm to a planetary receiver using microwaves, the diffraction limit dictates the relationship between the transmitter diameter (D_t), receiver diameter (D_r), wavelength (λ), and distance (d). Which criterion defines this?",
            options: [
                "The Chandrasekhar Limit (D_t * D_r > 1.44 M_sun)",
                "The Rayleigh Criterion (D_t * D_r ≈ 2.44 * λ * d)",
                "The Roche Limit (d < 2.44 * R * (p_M / p_m)^(1/3))",
                "The Stefan-Boltzmann Law (P = σ * A * T^4)"
            ],
            correctAnswer: 1,
            explanation: "The Rayleigh criterion for diffraction limits the focus of a beam. To achieve high transmission efficiency, the product of the transmitter and receiver diameters must be approximately 2.44 * λ * d."
        },
        {
            question: "What primary thermodynamic limitation bounds the maximum theoretical efficiency of multi-junction photovoltaic arrays deployed in the inner Dyson Swarm?",
            options: [
                "The Carnot limit combined with the Shockley-Queisser limit (bandgap thermalization)",
                "The Bekenstein bound of information density",
                "The Meissner effect preventing magnetic flux penetration",
                "The Tolman-Oppenheimer-Volkoff limit of degenerate matter"
            ],
            correctAnswer: 0,
            explanation: "Solar cells are fundamentally heat engines bounded by the Carnot efficiency (temperature of the sun vs temperature of the cell), and specifically constrained by the Shockley-Queisser limit which accounts for bandgap thermalization and non-absorption of sub-bandgap photons."
        },
        {
            question: "When modeling the secular orbital evolution of a 100-million node Dyson Swarm, which perturbative phenomenon is most likely to induce chaotic node-to-node collisions over million-year timeframes?",
            options: [
                "Yarkovsky effect drift",
                "Kozai-Lidov resonances and N-body gravitational perturbations",
                "Poynting-Robertson drag",
                "Solar wind ablation"
            ],
            correctAnswer: 1,
            explanation: "In a dense swarm of orbiting bodies, N-body gravitational interactions and resonances (like Kozai-Lidov) cause eccentricities and inclinations to oscillate, inevitably leading to orbit crossing and catastrophic collisions (Kessler syndrome) if not actively corrected."
        },
        {
            question: "Assuming a phased array laser system for energy relay within the vacuum of space, what physical law strictly governs the dissipation of waste heat from the laser's operation?",
            options: [
                "Fourier's Law of Heat Conduction",
                "Newton's Law of Cooling",
                "Stefan-Boltzmann Law (Radiation scales with T^4)",
                "Bose-Einstein Condensation statistics"
            ],
            correctAnswer: 2,
            explanation: "In the vacuum of space, conduction and convection are impossible. Heat can only be dissipated via thermal radiation, which scales with the fourth power of absolute temperature (T^4) according to the Stefan-Boltzmann law."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    
    let clock = new THREE.Clock();
    
    function animate(time, speed = 1, exploded = false) {
        const delta = clock.getDelta() * speed;
        const totalTime = time * speed;
        
        // 1. Rotate the central core slowly
        coreMesh.rotation.y = totalTime * 0.05;
        
        // 2. Rotate habitat rings at varying speeds
        rings.forEach(ringObj => {
            ringObj.mesh.rotation.z += ringObj.speed * speed * 60; // 60 is roughly FPS delta
        });
        
        // 3. Rotate fractal antennas
        antennaGroup.rotation.z = -totalTime * 0.1;
        
        // 4. Update Star Shader
        starUniforms.time.value = totalTime;
        
        // 5. Update Swarm Instanced Shader
        if (swarmMaterial.userData.shader) {
            swarmMaterial.userData.shader.uniforms.swarmTime.value = totalTime * 0.5;
        }
        
        // 6. Update Hologram Shaders
        holoUniforms.time.value = totalTime;
        holoGroup.rotation.z = totalTime * 0.02;
        holoGroup.rotation.y = totalTime * 0.05;
        
        // 7. Pulse the Reactor Core
        const pulse = Math.sin(totalTime * 5) * 0.5 + 0.5;
        coreMat.emissiveIntensity = 2.0 + pulse * 2.0;
        innerCoreMesh.rotation.x = totalTime;
        innerCoreMesh.rotation.y = totalTime * 1.3;
        outerCoreMesh.rotation.x = -totalTime * 0.5;
        outerCoreMesh.rotation.z = totalTime * 0.8;
        
        // 8. Update Energy Beams Geometry
        // We simulate beams connecting random swarm coordinates to the dishes
        beamMaterial.uniforms.time.value = totalTime;
        const positions = beamsMesh.geometry.attributes.position.array;
        
        for (let i = 0; i < beamCount; i++) {
            // Fake orbital motion for the beam source (swarm node)
            const pseudoRadius = 16000;
            const pseudoAngle = (i * 0.1) + totalTime * 0.5 + (i % 3);
            const inc = (i % 10) * 0.1 - 0.5;
            
            const sx = pseudoRadius * Math.cos(pseudoAngle) * Math.cos(inc);
            const sz = pseudoRadius * Math.sin(pseudoAngle) - 15000; // Offset by star position
            const sy = pseudoRadius * Math.cos(pseudoAngle) * Math.sin(inc);
            
            positions[i*6 + 0] = sx;
            positions[i*6 + 1] = sy;
            positions[i*6 + 2] = sz;
            
            // End position (dish) rotates with the hub, so we must calculate world pos or just keep it relative
            // For simplicity, we just leave the end points as defined initially (attached to the dish local coords relative to root)
            // But if the dishes move (exploded view), we should update them!
        }
        beamsMesh.geometry.attributes.position.needsUpdate = true;
    }

    return {
        group,
        parts,
        description: "God-Tier Dyson Swarm Coordinator. A massive megastructure commanding millions of solar statites via quantum-entangled phase arrays.",
        quizQuestions,
        animate
    };
}
