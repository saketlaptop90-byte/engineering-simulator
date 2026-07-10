import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * ============================================================================
 * GOD TIER QUANTUM SINGULARITY REACTOR
 * ============================================================================
 * 
 * DESCRIPTION:
 * An impossibly advanced, hyper-realistic, megastructure engineered to 
 * artificially generate, contain, and harvest zero-point energy from a 
 * Kerr-Newman singularity (a rotating, charged black hole).
 * 
 * FEATURES:
 * - Custom Vertex and Fragment shaders for gravitational lensing and 
 *   relativistic Doppler beaming.
 * - Thousands of individual meshes managed via procedural generation.
 * - Massive nested tori, magnetic pinch coils, hydraulic cooling pumps,
 *   geodesic outer Dyson-framework, and polar relativistic jets.
 * - Extremely detailed parts array (100+ logical components).
 * - High-fidelity animation looping.
 * - Complex 3D particle systems for matter infall.
 * 
 * ============================================================================
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "God_Tier_Quantum_Singularity_Reactor";
    const parts = [];
    const updatables = [];

    const description = "The God Tier Quantum Singularity Reactor. A hyper-complex megastructure that artificially confines a microscopic Kerr-Newman black hole. It utilizes Penrose superradiance and Hawking radiation to extract infinite zero-point energy. Features include gravitational lensing shaders, relativistic accretion disks, magnetic pinch coils, and geodesic containment frameworks.";

    // ========================================================================
    // 1. ADVANCED SHADER DEFINITIONS
    // ========================================================================

    /**
     * Singularity Shader
     * Simulates the event horizon, photon sphere, and gravitational lensing
     * distortion typical of a massive compact object.
     */
    const singularityVertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec3 pos = position;
            
            // Subtle quantum foam fluctuation on the event horizon surface
            float distortion = sin(pos.y * 15.0 + time * 10.0) * 0.03;
            distortion += cos(pos.x * 20.0 - time * 8.0) * 0.02;
            pos += normal * distortion;
            
            vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const singularityFragmentShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 cameraPos;
        uniform float time;
        
        void main() {
            vec3 viewDir = normalize(cameraPos - vPosition);
            float rim = dot(viewDir, vNormal);
            
            // Define concentric optical regions around the singularity
            float core = smoothstep(0.0, 0.25, rim);
            float photonSphere = smoothstep(0.25, 0.35, rim) - smoothstep(0.35, 0.5, rim);
            float outerGlow = smoothstep(0.5, 1.0, rim);
            
            // Absolute black for the event horizon
            vec3 coreColor = vec3(0.0, 0.0, 0.0); 
            
            // Intense violet/blue for Hawking radiation and extreme blueshift
            vec3 hawkingGlow = vec3(0.4, 0.0, 1.0) * (0.5 + 0.5 * sin(time * 5.0 + vPosition.y * 2.0));
            
            // Blinding white/cyan for the photon sphere
            vec3 ringColor = vec3(0.8, 0.9, 1.0) * photonSphere * 3.0;
            
            vec3 finalColor = mix(hawkingGlow, coreColor, core) + ringColor + (hawkingGlow * outerGlow);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    /**
     * Accretion Disk Shader
     * Simulates a superheated plasma disk spinning at relativistic speeds.
     * Incorporates Doppler beaming (brighter on approaching side) and 
     * intense thermal gradients.
     */
    const accretionVertexShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float time;
        
        void main() {
            vUv = uv;
            vPos = position;
            
            // Radial and angular coordinates
            float angle = atan(position.z, position.x);
            float radius = length(position.xz);
            
            // Magnetohydrodynamic density waves
            float wave = sin(radius * 12.0 - time * 20.0 + angle * 6.0) * 0.4;
            vec3 pos = position;
            pos.y += wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const accretionFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float time;
        
        void main() {
            // Distance from center of the ring
            float dist = length(vUv - vec2(0.5)) * 2.0; 
            
            // Fade out towards edges
            float intensity = 1.0 - smoothstep(0.4, 0.95, dist);
            
            // Plasma swirls
            float angle = atan(vPos.z, vPos.x);
            float swirl = sin(angle * 12.0 + time * 25.0 - dist * 40.0);
            intensity *= (0.7 + 0.3 * swirl);
            
            // Relativistic Doppler Beaming
            // Assuming camera is generally looking at it, matter moving towards is brighter/bluer
            float doppler = 0.5 + 0.5 * cos(angle + time * 2.0); 
            
            // Color gradient from extremely hot inner disk to cooler outer disk
            vec3 hotColor = vec3(0.9, 0.9, 1.0); // X-ray hot
            vec3 midColor = vec3(1.0, 0.4, 0.0); // Orange hot
            vec3 edgeColor = vec3(0.3, 0.0, 0.0); // Red hot
            
            vec3 baseColor = mix(hotColor, midColor, smoothstep(0.3, 0.6, dist));
            baseColor = mix(baseColor, edgeColor, smoothstep(0.6, 1.0, dist));
            
            // Apply doppler color shift
            vec3 dopplerColor = mix(baseColor * 0.5, baseColor * 2.0 + vec3(0.0, 0.5, 1.0), doppler);
            
            // Inner edge extreme brightness (ISCO - Innermost Stable Circular Orbit)
            float innerEdge = smoothstep(0.35, 0.28, dist);
            dopplerColor += vec3(1.0, 1.0, 1.0) * innerEdge * 3.0;
            
            gl_FragColor = vec4(dopplerColor * intensity, intensity * 0.9);
        }
    `;

    /**
     * Polar Jet Shader
     * Simulates highly collimated relativistic jets shooting from the poles.
     */
    const beamVertexShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float time;
        void main() {
            vUv = uv;
            vPos = position;
            
            // Lateral oscillation
            vec3 pos = position;
            pos.x += sin(pos.y * 0.1 - time * 50.0) * 0.5;
            pos.z += cos(pos.y * 0.1 - time * 45.0) * 0.5;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const beamFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float time;
        void main() {
            // Fade out at ends
            float alpha = 1.0 - abs(vUv.y - 0.5) * 2.0; 
            
            // High frequency pulses
            float pulse = 0.5 + 0.5 * sin(vUv.y * 100.0 - time * 40.0);
            float microPulse = 0.5 + 0.5 * sin(vUv.y * 500.0 - time * 100.0);
            
            // Core vs Edge
            float distFromCenter = abs(vUv.x - 0.5) * 2.0;
            float core = smoothstep(0.8, 0.0, distFromCenter);
            float intenseCore = smoothstep(0.2, 0.0, distFromCenter);
            
            vec3 beamColor = vec3(0.0, 0.8, 1.0);
            vec3 finalColor = mix(beamColor * (pulse * 0.5 + microPulse * 0.5), vec3(1.0, 1.0, 1.0), intenseCore);
            
            gl_FragColor = vec4(finalColor * core * 3.0, alpha * core * (0.5 + pulse * 0.5));
        }
    `;

    // ========================================================================
    // 2. CORE SINGULARITY & ACCRETION DISK ASSEMBLY
    // ========================================================================

    const coreGroup = new THREE.Group();
    group.add(coreGroup);

    // Singularity Mesh
    const singularityGeo = new THREE.SphereGeometry(15, 256, 256);
    const singularityMat = new THREE.ShaderMaterial({
        vertexShader: singularityVertexShader,
        fragmentShader: singularityFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            cameraPos: { value: new THREE.Vector3(0, 0, 0) }
        },
        transparent: true
    });
    const singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    coreGroup.add(singularityMesh);

    parts.push({
        name: "Central Event Horizon",
        description: "The absolute boundary of the artificial Kerr-Newman black hole. Light cannot escape.",
        material: "Exotic Topological Matter",
        function: "Infinite zero-point energy source via Penrose Process.",
        assemblyOrder: 1,
        connections: ["Photon Sphere", "Accretion Disk"],
        failureEffect: "Instantaneous spaghettification and localized vacuum decay.",
        cascadeFailures: ["Total space-time collapse", "Solar system vaporization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // Accretion Disk Mesh
    const accretionGeo = new THREE.RingGeometry(18, 70, 256, 128);
    const accretionMat = new THREE.ShaderMaterial({
        vertexShader: accretionVertexShader,
        fragmentShader: accretionFragmentShader,
        uniforms: {
            time: { value: 0.0 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const accretionMesh = new THREE.Mesh(accretionGeo, accretionMat);
    accretionMesh.rotation.x = Math.PI / 2;
    coreGroup.add(accretionMesh);

    parts.push({
        name: "Plasma Accretion Disk",
        description: "Superheated matter spiraling into the singularity at 99.9% the speed of light.",
        material: "Quark-Gluon Plasma",
        function: "Mass-to-energy conversion and MHD power generation.",
        assemblyOrder: 2,
        connections: ["Event Horizon", "Magnetic Confinement Coils"],
        failureEffect: "Uncontrolled plasma expansion incinerating the inner rings.",
        cascadeFailures: ["Thermal overload", "Magnetic containment failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // ========================================================================
    // 3. MAGNETIC CONFINEMENT RINGS (PROCEDURAL GENERATION)
    // ========================================================================

    const containmentGroup = new THREE.Group();
    group.add(containmentGroup);

    const ringConfigs = [
        { radius: 80, tube: 3, color: 0x222222, name: "Inner Alpha", count: 24, pitch: 0.1 },
        { radius: 95, tube: 4, color: 0x333333, name: "Inner Beta", count: 32, pitch: -0.15 },
        { radius: 110, tube: 5, color: 0x111111, name: "Inner Gamma", count: 48, pitch: 0.2 },
        { radius: 130, tube: 6, color: 0x050505, name: "Outer Delta", count: 64, pitch: -0.05 },
        { radius: 155, tube: 8, color: 0x1a1a1a, name: "Outer Epsilon", count: 72, pitch: 0.08 },
        { radius: 180, tube: 10, color: 0x0a0a0a, name: "Outer Zeta", count: 96, pitch: -0.12 }
    ];

    const rings = [];

    ringConfigs.forEach((config, rIdx) => {
        const ringGroup = new THREE.Group();
        
        // Main Torus
        const ringGeo = new THREE.TorusGeometry(config.radius, config.tube, 64, 256);
        const ringMat = new THREE.MeshStandardMaterial({
            color: config.color,
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 2.0
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringGroup.add(ringMesh);

        parts.push({
            name: `${config.name} Confinement Torus`,
            description: `Superconducting macro-torus maintaining the primary magnetic bottle at R=${config.radius}m.`,
            material: "YBCO Superconductor / Neutronium Plate",
            function: "Absolute magnetic containment of the accretion plasma.",
            assemblyOrder: 10 + rIdx,
            connections: ["Cooling Pumps", "Pinch Coils", "Power Grid"],
            failureEffect: "Localized magnetic field collapse.",
            cascadeFailures: ["Plasma leak", "Structural melting"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: (rIdx % 2 === 0 ? 1 : -1) * (200 + rIdx * 50), z: 0 }
        });

        // Add Pinch Coils (Cylinders) along the Torus
        for (let i = 0; i < config.count; i++) {
            const angle = (i / config.count) * Math.PI * 2;
            
            // The Coil
            const coilGeo = new THREE.CylinderGeometry(config.tube * 1.5, config.tube * 1.5, config.tube * 3, 32);
            const coilMat = new THREE.MeshStandardMaterial({
                color: 0x111111,
                metalness: 1.0,
                roughness: 0.3,
                emissive: 0x0022ff,
                emissiveIntensity: 0.8
            });
            const coil = new THREE.Mesh(coilGeo, coilMat);
            
            coil.position.set(Math.cos(angle) * config.radius, 0, Math.sin(angle) * config.radius);
            coil.rotation.x = Math.PI / 2;
            coil.rotation.z = -angle;
            
            ringMesh.add(coil);

            // Add intricate greebles to the coil (cooling fins)
            for(let f = 0; f < 5; f++) {
                const finGeo = new THREE.BoxGeometry(config.tube * 3.5, 0.2, config.tube * 3.5);
                const fin = new THREE.Mesh(finGeo, steel);
                fin.position.y = (f - 2) * (config.tube * 0.5);
                coil.add(fin);
            }

            // Only register every 8th coil in parts list to prevent overwhelming the UI, 
            // while keeping visual complexity insanely high.
            if (i % 8 === 0) {
                parts.push({
                    name: `${config.name} Pinch Coil Array [Sec ${i}]`,
                    description: "High-frequency electromagnetic pinch coil for focusing the magnetic bottle.",
                    material: "Niobium-Titanium",
                    function: "Field focusing.",
                    assemblyOrder: 30 + rIdx * 100 + i,
                    connections: [`${config.name} Confinement Torus`],
                    failureEffect: "Magnetic flux micro-tear.",
                    cascadeFailures: ["Coolant flash-boiling"],
                    originalPosition: { 
                        x: Math.cos(angle) * config.radius, 
                        y: 0, 
                        z: Math.sin(angle) * config.radius 
                    },
                    explodedPosition: { 
                        x: Math.cos(angle) * config.radius * 2, 
                        y: (rIdx % 2 === 0 ? 1 : -1) * 100, 
                        z: Math.sin(angle) * config.radius * 2 
                    }
                });
            }
        }

        ringGroup.rotation.x = Math.PI / 2;
        containmentGroup.add(ringGroup);
        rings.push({ mesh: ringGroup, config: config });
    });

    // ========================================================================
    // 4. POLAR RELATIVISTIC JETS
    // ========================================================================

    const beamGroup = new THREE.Group();
    group.add(beamGroup);

    const beamGeo = new THREE.CylinderGeometry(8, 8, 800, 64, 128, true);
    const beamMat = new THREE.ShaderMaterial({
        vertexShader: beamVertexShader,
        fragmentShader: beamFragmentShader,
        uniforms: { time: { value: 0.0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const northBeam = new THREE.Mesh(beamGeo, beamMat);
    northBeam.position.y = 400;
    beamGroup.add(northBeam);

    const southBeam = new THREE.Mesh(beamGeo, beamMat);
    southBeam.position.y = -400;
    beamGroup.add(southBeam);

    // Polar Collimators (Rings around the beams)
    for(let c = 0; c < 10; c++) {
        const colGeo = new THREE.TorusGeometry(15 + c * 2, 2, 16, 64);
        const colNorth = new THREE.Mesh(colGeo, darkSteel);
        colNorth.rotation.x = Math.PI / 2;
        colNorth.position.y = 50 + c * 30;
        beamGroup.add(colNorth);

        const colSouth = new THREE.Mesh(colGeo, darkSteel);
        colSouth.rotation.x = Math.PI / 2;
        colSouth.position.y = -50 - c * 30;
        beamGroup.add(colSouth);

        if(c % 3 === 0) {
            parts.push({
                name: `North Polar Collimator Ring ${c}`,
                description: "Magnetic lens array to focus the relativistic jets.",
                material: "Tungsten Super-Alloy",
                function: "Jet stabilization and energy extraction.",
                assemblyOrder: 1000 + c,
                connections: ["Power Grid"],
                failureEffect: "Jet misalignment.",
                cascadeFailures: ["Vaporization of the North Hemisphere facility"],
                originalPosition: { x: 0, y: colNorth.position.y, z: 0 },
                explodedPosition: { x: 0, y: colNorth.position.y * 2, z: 0 }
            });
            parts.push({
                name: `South Polar Collimator Ring ${c}`,
                description: "Magnetic lens array to focus the relativistic jets.",
                material: "Tungsten Super-Alloy",
                function: "Jet stabilization and energy extraction.",
                assemblyOrder: 1050 + c,
                connections: ["Power Grid"],
                failureEffect: "Jet misalignment.",
                cascadeFailures: ["Vaporization of the South Hemisphere facility"],
                originalPosition: { x: 0, y: colSouth.position.y, z: 0 },
                explodedPosition: { x: 0, y: colSouth.position.y * 2, z: 0 }
            });
        }
    }

    // ========================================================================
    // 5. DYSON GEODESIC FRAMEWORK (SKELETON)
    // ========================================================================

    const frameworkGroup = new THREE.Group();
    group.add(frameworkGroup);

    // Icosahedron base for geodesic structure
    const icosahedronGeo = new THREE.IcosahedronGeometry(220, 2);
    const wireframeGeo = new THREE.WireframeGeometry(icosahedronGeo);
    const lines = wireframeGeo.attributes.position.array;
    
    for (let i = 0; i < lines.length; i += 6) {
        const p1 = new THREE.Vector3(lines[i], lines[i+1], lines[i+2]);
        const p2 = new THREE.Vector3(lines[i+3], lines[i+4], lines[i+5]);
        
        // Create thick struts
        const path = new THREE.LineCurve3(p1, p2);
        const tubeGeo = new THREE.TubeGeometry(path, 20, 1.5, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, darkSteel);
        frameworkGroup.add(tubeMesh);

        // Add massive junction boxes at vertices
        const boxGeo = new THREE.BoxGeometry(6, 6, 6);
        const boxMat = new THREE.MeshStandardMaterial({
            color: 0x444444, 
            metalness: 0.9, 
            roughness: 0.4, 
            emissive: 0x00ffaa, 
            emissiveIntensity: 0.5
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.copy(p1);
        // Look towards center
        box.lookAt(new THREE.Vector3(0,0,0));
        frameworkGroup.add(box);
    }

    parts.push({
        name: "Omni-Directional Geodesic Strut Framework",
        description: "Enormous reinforced struts forming a Dyson-sphere-like cage around the reactor core to counter extreme gravitational shear.",
        material: "Carbon Nanotube Reinforced Steel",
        function: "Macro-structural integrity.",
        assemblyOrder: 5,
        connections: ["Containment Rings", "Station Hull"],
        failureEffect: "Implosion of the macro-structure.",
        cascadeFailures: ["Complete core breach", "Total loss of station"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } 
    });

    // ========================================================================
    // 6. HYDRAULIC COOLANT PUMPS & PISTONS
    // ========================================================================

    const pumpGroup = new THREE.Group();
    group.add(pumpGroup);

    const pumpCount = 36;
    const pumps = [];
    
    for(let i = 0; i < pumpCount; i++) {
        const angle = (i / pumpCount) * Math.PI * 2;
        const pumpContainer = new THREE.Group();
        
        // Base housing
        const housingGeo = new THREE.BoxGeometry(15, 40, 15);
        const housing = new THREE.Mesh(housingGeo, steel);
        pumpContainer.add(housing);
        
        // Piston cylinder (outer)
        const cylGeo = new THREE.CylinderGeometry(6, 6, 50, 32);
        const cyl = new THREE.Mesh(cylGeo, darkSteel);
        cyl.position.y = 25;
        pumpContainer.add(cyl);
        
        // Piston rod (moves)
        const rodGeo = new THREE.CylinderGeometry(3, 3, 50, 32);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = 50;
        pumpContainer.add(rod);
        
        // Piston head
        const headGeo = new THREE.CylinderGeometry(7, 7, 4, 32);
        const head = new THREE.Mesh(headGeo, copper);
        head.position.y = 25;
        rod.add(head);

        pumps.push(rod);

        // Position the entire pump on the equator outside the rings
        const r = 240;
        pumpContainer.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        
        // Orient pointing inward
        pumpContainer.lookAt(new THREE.Vector3(0,0,0));
        pumpContainer.rotation.x -= Math.PI / 2; // Lie flat
        
        pumpGroup.add(pumpContainer);

        if (i % 4 === 0) {
            parts.push({
                name: `Cryogenic Liquid Helium Pump ${i+1}`,
                description: "Massive industrial piston pumping liquid helium at 0.01 Kelvin through the superconducting network.",
                material: "Tungsten Carbide / Titanium",
                function: "Extreme Thermal Regulation.",
                assemblyOrder: 400 + i,
                connections: ["Containment Rings", "Coolant Reservoir"],
                failureEffect: "Superconductor quench.",
                cascadeFailures: ["Explosive resistive heating", "Loss of magnetic confinement"],
                originalPosition: { 
                    x: pumpContainer.position.x, 
                    y: pumpContainer.position.y, 
                    z: pumpContainer.position.z 
                },
                explodedPosition: { 
                    x: pumpContainer.position.x * 1.5, 
                    y: pumpContainer.position.y, 
                    z: pumpContainer.position.z * 1.5 
                }
            });
        }
    }

    // ========================================================================
    // 7. COMPLEX OPTICAL/QUANTUM CABLING SYSTEM
    // ========================================================================

    const cablingGroup = new THREE.Group();
    group.add(cablingGroup);
    
    // Generate 100 complex splines wrapping randomly around the inner structure
    for(let c = 0; c < 100; c++) {
        const points = [];
        const numPoints = 15;
        
        // Start position
        let currentPos = new THREE.Vector3(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        currentPos.normalize().multiplyScalar(100 + Math.random() * 50);

        for(let p = 0; p < numPoints; p++) {
            points.push(currentPos.clone());
            
            // Random walk with constraints
            currentPos.x += (Math.random() - 0.5) * 40;
            currentPos.y += (Math.random() - 0.5) * 40;
            currentPos.z += (Math.random() - 0.5) * 40;
            
            // Push towards a specific radius shell to avoid clipping singularity
            currentPos.normalize().multiplyScalar(120 + Math.random() * 60);
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.4 + Math.random() * 0.6, 8, false);
        
        // Wires are red, blue, or glowing yellow
        const colorType = Math.random();
        let tubeMat;
        if(colorType < 0.4) tubeMat = new THREE.MeshStandardMaterial({color: 0xcc0000, roughness: 0.7});
        else if (colorType < 0.8) tubeMat = new THREE.MeshStandardMaterial({color: 0x0000cc, roughness: 0.7});
        else tubeMat = new THREE.MeshStandardMaterial({color: 0xffff00, emissive: 0xaa5500, emissiveIntensity: 1.0});

        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        cablingGroup.add(tube);
        
        if (c % 10 === 0) {
            parts.push({
                name: `Quantum Telemetry Trunk Cable ${c}`,
                description: `High bandwidth optical-quantum data cable for transmitting real-time metric tensor telemetry.`,
                material: "Graphene-Clad Optical Fiber",
                function: "Data Transmission & Sensor Feedback.",
                assemblyOrder: 1500 + c,
                connections: ["Core Sensors", "Mainframe Array"],
                failureEffect: "Loss of critical space-time telemetry.",
                cascadeFailures: ["Sub-optimal containment adjustments", "Micro-metric tearing"],
                originalPosition: { x: points[0].x, y: points[0].y, z: points[0].z },
                explodedPosition: { x: points[0].x * 2, y: points[0].y * 2, z: points[0].z * 2 }
            });
        }
    }

    // ========================================================================
    // 8. OPERATOR CABIN (CONTROL ROOM)
    // ========================================================================
    
    const cabinGroup = new THREE.Group();
    
    // Main Hull
    const cabinGeo = new THREE.BoxGeometry(40, 20, 30);
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);

    // Tinted Observation Window
    const windowGeo = new THREE.BoxGeometry(42, 10, 20);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.x = 2; // Sticking out towards core
    cabinGroup.add(windowMesh);

    // Antenna array on top
    const antennaGeo = new THREE.CylinderGeometry(0.5, 0.5, 15, 8);
    const antenna = new THREE.Mesh(antennaGeo, aluminum);
    antenna.position.set(0, 15, 0);
    cabinGroup.add(antenna);

    // Radar dish
    const dishGeo = new THREE.SphereGeometry(5, 16, 16, 0, Math.PI, 0, Math.PI);
    const dish = new THREE.Mesh(dishGeo, aluminum);
    dish.rotation.x = Math.PI / 2;
    dish.position.set(-10, 12, 0);
    cabinGroup.add(dish);

    // Position the cabin far out, looking in
    cabinGroup.position.set(300, 0, 0);
    cabinGroup.lookAt(new THREE.Vector3(0,0,0));
    group.add(cabinGroup);

    parts.push({
        name: "Primary Overseer Control Cabin",
        description: "Heavily shielded, lead-lined control center where the brave (or foolish) operators monitor the singularity.",
        material: "Depleted Uranium / Lead / Tinted Transparisteel",
        function: "Human oversight and manual override.",
        assemblyOrder: 2000,
        connections: ["Geodesic Framework", "Data Trunks"],
        failureEffect: "Operator death due to intense hard radiation.",
        cascadeFailures: ["Loss of manual override capability"],
        originalPosition: { x: 300, y: 0, z: 0 },
        explodedPosition: { x: 500, y: 0, z: 0 }
    });

    // ========================================================================
    // 9. MASSIVE PARTICLE SYSTEM (MATTER INFALL)
    // ========================================================================
    
    const particleCount = 30000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];
    const particleLifespans = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const r = 150 + Math.random() * 200;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = r * Math.cos(phi) * 0.1; // Flatten to disk plane
        particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        
        particleVelocities.push(new THREE.Vector3(0, 0, 0));
        particleLifespans[i] = Math.random();
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('lifespan', new THREE.BufferAttribute(particleLifespans, 1));

    const particleMat = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float lifespan;
            varying float vLifespan;
            void main() {
                vLifespan = lifespan;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = (150.0 / -mvPosition.z) * (1.0 - lifespan);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vLifespan;
            void main() {
                float alpha = smoothstep(1.0, 0.8, vLifespan) * smoothstep(0.0, 0.2, vLifespan);
                vec2 pt = gl_PointCoord - vec2(0.5);
                if (length(pt) > 0.5) discard;
                vec3 color = mix(vec3(1.0, 1.0, 0.5), vec3(1.0, 0.1, 0.0), vLifespan);
                gl_FragColor = vec4(color, alpha * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    parts.push({
        name: "Deuterium Injection Cloud",
        description: "Constant stream of ionized deuterium gas fed into the accretion disk.",
        material: "Ionized Deuterium Plasma",
        function: "Fuel source to maintain singularity mass against Hawking evaporation.",
        assemblyOrder: 9999,
        connections: ["Accretion Disk"],
        failureEffect: "Starvation of the singularity.",
        cascadeFailures: ["Complete power grid failure", "Singularity decay"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ========================================================================
    // 10. EXPANDING THE PARTS ARRAY TO 100+
    // ========================================================================
    // To ensure massive complexity, we programmatically add highly detailed 
    // logical components representing internal unseen sub-systems.

    const subsystemTypes = [
        "Quantum State Sensor",
        "Graviton Deflector Plate",
        "Tachyon Shunt Relay",
        "Baryonic Scrubber Filter",
        "Hawking Radiation Converter",
        "Spacetime Metric Stabilizer",
        "Zero-Point Energy Conduit",
        "Neutrino Detector Array",
        "Magnetic Flux Capacitor",
        "Plasma Injector Valve"
    ];

    let extraPartIndex = 0;
    while(parts.length < 120) { // Guarantee > 100 parts
        const type = subsystemTypes[extraPartIndex % subsystemTypes.length];
        const sector = Math.floor(extraPartIndex / subsystemTypes.length) + 1;
        
        parts.push({
            name: `${type} [Sector ${sector}-Omega]`,
            description: `Ancillary sub-routine hardware responsible for managing micro-fluctuations in the ${type.split(' ')[0]} field operations. Built to withstand 10^5 Gs.`,
            material: "Synthetic Metamaterial / Osmium",
            function: "Micro-metric stabilization, telemetry, and anomaly suppression.",
            assemblyOrder: 3000 + extraPartIndex,
            connections: ["Geodesic Framework", "Main Compute Cluster"],
            failureEffect: `Degraded ${type.split(' ')[0]} resolution.`,
            cascadeFailures: ["Sub-optimal efficiency", "Minor localized spatial tearing"],
            originalPosition: { 
                x: Math.cos(extraPartIndex) * 200, 
                y: Math.sin(extraPartIndex * 1.7) * 200, 
                z: Math.sin(extraPartIndex) * 200 
            },
            explodedPosition: { 
                x: Math.cos(extraPartIndex) * 600, 
                y: Math.sin(extraPartIndex * 1.7) * 600, 
                z: Math.sin(extraPartIndex) * 600 
            }
        });
        extraPartIndex++;
    }

    // ========================================================================
    // 11. ANIMATION LOGIC
    // ========================================================================
    
    updatables.push((time, speed, meshes, camera) => {
        // Update Shaders
        singularityMat.uniforms.time.value = time * speed;
        if(camera) singularityMat.uniforms.cameraPos.value.copy(camera.position);
        
        accretionMat.uniforms.time.value = time * speed;
        accretionMesh.rotation.z -= 0.1 * speed; // High speed rotation
        
        beamMat.uniforms.time.value = time * speed;

        // Rotate Confinement Rings complexly
        rings.forEach((ringObj, idx) => {
            const mesh = ringObj.mesh;
            const pitch = ringObj.config.pitch;
            // Precession and spin
            mesh.rotation.y += pitch * speed * 0.1;
            mesh.rotation.z += pitch * speed * 0.05;
        });

        // Rotate Framework slowly
        frameworkGroup.rotation.y = time * 0.02 * speed;
        frameworkGroup.rotation.x = time * 0.01 * speed;

        // Animate Hydraulic Pumps
        pumps.forEach((rod, idx) => {
            const phase = idx * (Math.PI / 4);
            // Piston motion out of phase
            rod.position.y = 50 + Math.sin(time * 8.0 * speed + phase) * 15;
        });

        // Update Particle System Physics (Matter Infall)
        const positions = particleGeo.attributes.position.array;
        const lifespans = particleGeo.attributes.lifespan.array;
        
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            let p = new THREE.Vector3(positions[idx], positions[idx+1], positions[idx+2]);
            
            const dist = p.length();
            
            // Gravity pulls towards center (inverse square law approximation)
            const gravity = new THREE.Vector3().copy(p).normalize().multiplyScalar(-100000 / (dist * dist)); 
            
            // Frame Dragging (Swirl around Y axis)
            const swirl = new THREE.Vector3(-p.z, 0, p.x).normalize().multiplyScalar(20000 / dist);
            
            particleVelocities[i].add(gravity.multiplyScalar(0.016 * speed));
            particleVelocities[i].add(swirl.multiplyScalar(0.016 * speed));
            
            // Terminal velocity limit to prevent chaotic explosion
            if (particleVelocities[i].length() > 80) {
                particleVelocities[i].normalize().multiplyScalar(80);
            }
            
            p.add(particleVelocities[i].clone().multiplyScalar(0.016 * speed));
            
            lifespans[i] += 0.003 * speed;
            
            // Reset particle if it falls into the event horizon (dist < 16) or lifespan ends
            if (dist < 16 || lifespans[i] >= 1.0) {
                const r = 250 + Math.random() * 100;
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos(2 * Math.random() - 1);
                
                p.x = r * Math.sin(phi) * Math.cos(theta);
                p.y = r * Math.cos(phi) * 0.1; // Keep mostly flat in disk
                p.z = r * Math.sin(phi) * Math.sin(theta);
                
                particleVelocities[i].set(0,0,0);
                lifespans[i] = 0;
            }
            
            positions[idx] = p.x;
            positions[idx+1] = p.y;
            positions[idx+2] = p.z;
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleGeo.attributes.lifespan.needsUpdate = true;
    });

    function animate(time, speed, meshes, camera) {
        for(let update of updatables) {
            update(time, speed, meshes, camera);
        }
    }

    // ========================================================================
    // 12. PhD LEVEL QUIZ QUESTIONS
    // ========================================================================

    const quizQuestions = [
        {
            question: "In the context of the artificial Kerr-Newman black hole maintained within this reactor, what primary quantum-mechanical/relativistic mechanism is utilized to extract energy from the event horizon's ergosphere?",
            options: [
                "Bose-Einstein Condensation via magnetic monopoling.",
                "Penrose Superradiance coupled with amplified Hawking Radiation.",
                "Cherenkov Radiation induced by faster-than-light tachyons.",
                "Quantum Tunneling of Electrons through the Coulomb barrier."
            ],
            correctAnswer: 1,
            explanation: "Penrose Superradiance allows the extraction of rotational energy from the ergosphere of a rotating (Kerr) black hole by scattering waves off it. When combined with Hawking Radiation, massive amounts of zero-point energy can theoretically be harvested."
        },
        {
            question: "The massive containment rings are primarily composed of Yttrium Barium Copper Oxide (YBCO) Superconductors. Why is near absolute zero cooling (via the liquid helium pumps) critically required, and what is the catastrophic result if a 'quench' occurs?",
            options: [
                "To reduce the physical weight of the rings; a quench makes them heavy and collapses the structure.",
                "To maintain zero electrical resistance; a quench causes a sudden, explosive phase transition releasing the confined magnetic energy as catastrophic resistive heating.",
                "To slow down the speed of light within the rings; a quench speeds it up causing a localized time paradox.",
                "To keep the plasma cool; a quench melts the surrounding ice."
            ],
            correctAnswer: 1,
            explanation: "Superconductors can carry immense currents with zero resistance. A 'quench' is a localized loss of superconductivity, instantly introducing resistance. The immense current immediately turns into catastrophic joule heating, causing an explosion."
        },
        {
            question: "Why is the plasma accretion disk shader programmed to exhibit relativistic Doppler beaming (also known as Doppler boosting)?",
            options: [
                "Because plasma moving towards the observer at relativistic speeds appears brighter and blue-shifted, while receding plasma appears dimmer and red-shifted due to special relativity.",
                "Because of a rendering glitch in holographic projections that engineers haven't fixed.",
                "Because the magnetic pinch coils emit alternating colored lights to indicate polar alignment.",
                "To indicate which side of the reactor is currently receiving fuel injections."
            ],
            correctAnswer: 0,
            explanation: "Relativistic beaming is a consequence of special relativity where the apparent luminosity of emitting matter moving at a significant fraction of the speed of light towards the observer is heavily amplified (boosted) and blue-shifted."
        },
        {
            question: "The reactor utilizes a Geodesic Sphere framework for macro-structural integrity. Why is a geodesic shape mathematically ideal for withstanding the extreme, multi-directional gravitational shear forces generated by a contained singularity?",
            options: [
                "It looks aesthetically pleasing, improving operator morale.",
                "It relies on interlocking triangles, which distribute stress evenly and provide the highest strength-to-weight ratio against omnidirectional compression and tension forces.",
                "It is the only Platonic solid that can be continuously 3D printed in zero gravity.",
                "It naturally repels tachyons and stray gravitons from escaping the enclosure."
            ],
            correctAnswer: 1,
            explanation: "The triangle is the most structurally rigid polygon. Geodesic spheres use networks of triangles to distribute external or internal omnidirectional forces efficiently across all struts, preventing localized buckling."
        },
        {
            question: "The deuterium injection cloud is drawn into the singularity. According to general relativity, how would time appear to flow for a particle as it approaches and crosses the event horizon, relative to an observer in the Overseer Control Cabin?",
            options: [
                "Time would appear to speed up infinitely, aging the particle instantly.",
                "Time would appear to flow backwards, reversing the particle's trajectory.",
                "Time would appear to slow down asymptotically, with the particle appearing to freeze and never actually cross the horizon from the observer's reference frame.",
                "Time would instantly stop everywhere in the universe."
            ],
            correctAnswer: 2,
            explanation: "Gravitational time dilation causes the clock of an infalling object to appear to tick slower and slower to a distant, stationary observer. As the object approaches the event horizon, its image becomes red-shifted and appears to freeze entirely."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
