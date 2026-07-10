import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "God-Tier Gravitational Singularity Drive. This propulsion system continuously generates and consumes microscopic black holes. By positioning the singularity directly ahead of the drive cone, the vessel falls endlessly into the artificial gravity well, achieving relativistic speeds without reaction mass. Extreme inertial dampening, structural integrity fields, and Hawking radiation shielding are strictly required to prevent catastrophic spaghettification and localized spacetime collapse.";

    const quizQuestions = [
        {
            question: "In the context of the Alcubierre-like localized gravitational manipulation utilized by the Singularity Drive, how does the system mitigate the extreme tidal forces (spaghettification) at the event horizon boundary?",
            options: [
                "By projecting a static Penrose spherical shell composed of exotic matter with negative energy density to flatten the local metric tensor.",
                "By rotating the singularity at precisely the Kerr parameter limit (a=M), creating an ergosphere that counteracts radial infall via frame-dragging.",
                "By synchronizing the creation and evaporation phases of the microscopic black hole at a frequency higher than the Planck time, preventing macroscopic metric distortion.",
                "By wrapping the hull in a gravito-magnetic superconductive fluid that expels the Riemann curvature tensor analogous to the Meissner effect."
            ],
            correctAnswer: 0,
            explanation: "To survive the gradient, the local metric tensor must be flattened using negative energy density (exotic matter), effectively neutralizing the tidal tensor components inside the protective shell."
        },
        {
            question: "Assuming the microscopic black holes evaporate via Hawking radiation, what is the primary relationship between the black hole's mass (M) and its radiated power (P)?",
            options: [
                "P is directly proportional to M.",
                "P is inversely proportional to M^2.",
                "P is directly proportional to M^4.",
                "P is inversely proportional to M."
            ],
            correctAnswer: 1,
            explanation: "Hawking radiation power P is inversely proportional to the square of the mass (P ∝ 1/M^2). Smaller black holes radiate exponentially more power."
        },
        {
            question: "What limits the maximum theoretical efficiency of the Singularity Drive's energy extraction when tapping into the rotational energy of a Kerr black hole via the Penrose process?",
            options: [
                "29% of the black hole's total mass-energy.",
                "50% of the black hole's total mass-energy.",
                "100% of the black hole's total mass-energy.",
                "Planck limit dictates a maximum of 5%."
            ],
            correctAnswer: 0,
            explanation: "The Penrose process allows extraction of up to approximately 29% (1 - 1/sqrt(2)) of a Kerr black hole's mass, corresponding to its maximum rotational kinetic energy."
        },
        {
            question: "The Drive Cone utilizes Hawking radiation-resistant plating. From a quantum field theory in curved spacetime perspective, what particle spectrum dominates the Hawking emission of a Schwarzschild black hole as its mass approaches the Planck mass?",
            options: [
                "Exclusively low-energy photons and gravitons.",
                "Primarily cold dark matter candidates.",
                "A thermal blackbody spectrum encompassing all fundamental particles, including massive fermions and bosons.",
                "Only massless bosons due to the infinite redshift at the event horizon."
            ],
            correctAnswer: 2,
            explanation: "As the black hole's mass decreases and temperature increases, it emits all fundamental particles, including massive ones, in a roughly thermal spectrum once the temperature exceeds their rest mass energy."
        },
        {
            question: "How does the Drive's localized metric distortion affect the passing of proper time for the crew relative to a distant, stationary observer in asymptotically flat spacetime?",
            options: [
                "Proper time diverges logarithmically due to the Cauchy horizon.",
                "The crew experiences extreme time dilation, aging significantly slower than the distant observer.",
                "The crew experiences time contraction, aging significantly faster than the distant observer.",
                "Time passes at exactly the same rate due to the exotic matter shell neutralizing the global metric."
            ],
            correctAnswer: 1,
            explanation: "Deep within a strong gravitational potential well (even a localized one driving the ship), gravitational time dilation causes proper time to pass much slower relative to an observer in flat spacetime."
        }
    ];

    // --- UTILITY GEOMETRY GENERATORS FOR EXTREME COMPLEXITY --- //

    function createIntricateLathe(pointsArray, segments, material) {
        const points = [];
        for (let i = 0; i < pointsArray.length; i++) {
            points.push(new THREE.Vector2(pointsArray[i][0], pointsArray[i][1]));
        }
        const geometry = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geometry, material);
    }

    function createComplexGear(radius, teeth, depth, holeRadius) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        const outerRadius = radius;
        const innerRadius = radius * 0.8;
        
        for (let i = 0; i < teeth; i++) {
            const angle = i * step;
            const nextAngle = (i + 1) * step;
            const midAngle1 = angle + step * 0.25;
            const midAngle2 = angle + step * 0.75;

            if (i === 0) shape.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            else shape.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);

            shape.lineTo(Math.cos(midAngle1) * outerRadius, Math.sin(midAngle1) * outerRadius);
            shape.lineTo(Math.cos(midAngle2) * outerRadius, Math.sin(midAngle2) * outerRadius);
            shape.lineTo(Math.cos(nextAngle) * innerRadius, Math.sin(nextAngle) * innerRadius);
        }

        const holePath = new THREE.Path();
        holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        return geometry;
    }

    function createTorusLugTire(radius, tube, radialSegments, tubularSegments, lugCount) {
        const tireGroup = new THREE.Group();
        const tireGeo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tireMesh);
        
        const lugGeo = new THREE.BoxGeometry(tube * 1.2, tube * 0.5, tube * 2.5);
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.x = Math.cos(angle) * radius;
            lug.position.y = Math.sin(angle) * radius;
            lug.lookAt(0,0,0);
            tireGroup.add(lug);
        }
        return tireGroup;
    }

    // --- MASSIVE SHADERS --- //

    const raymarchedBlackHoleVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // A very intense, complex raymarching shader simulating a black hole with accretion disk and lensing
    const raymarchedBlackHoleFragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;
        varying vec3 vPosition;

        #define MAX_STEPS 100
        #define MAX_DIST 100.0
        #define SURF_DIST 0.01

        // 3D Noise function for accretion disk turbulence
        float hash(float n) { return fract(sin(n) * 1e4); }
        float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
        float noise(vec3 x) {
            const vec3 step = vec3(110, 241, 171);
            vec3 i = floor(x);
            vec3 f = fract(x);
            float n = dot(i, step);
            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                           mix(hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                       mix(mix(hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                           mix(hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }

        // Distance field for black hole
        float GetDist(vec3 p) {
            float sphereDist = length(p) - 2.0; // Event horizon radius
            return sphereDist;
        }

        vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
            vec3 f = normalize(l-p),
                 r = normalize(cross(vec3(0,1,0), f)),
                 u = cross(f,r),
                 c = p+f*z,
                 i = c + uv.x*r + uv.y*u,
                 d = normalize(i-p);
            return d;
        }

        void main() {
            vec2 uv = (vUv - 0.5) * 2.0;
            
            vec3 ro = vec3(0.0, 3.0, -10.0);
            vec3 rd = GetRayDir(uv, ro, vec3(0,0,0), 1.0);

            float d0 = 0.0;
            vec3 col = vec3(0.0);
            float min_dist = 100.0;
            
            // Raymarching loop for lensing and event horizon
            for(int i=0; i<MAX_STEPS; i++) {
                vec3 p = ro + rd * d0;
                float dS = GetDist(p);
                min_dist = min(min_dist, dS);
                d0 += dS;
                if(d0 > MAX_DIST || dS < SURF_DIST) break;
                
                // Simulate gravitational lensing by bending the ray
                // Very simplified for shader performance, pull ray towards origin
                vec3 forceDir = -normalize(p);
                float forceMag = 0.05 / (length(p) * length(p));
                rd = normalize(rd + forceDir * forceMag);
            }

            if(d0 < MAX_DIST) {
                // Hit event horizon
                col = vec3(0.0);
            } else {
                // Background stars distorted by lensing
                vec3 bgDir = rd;
                float starNoise = noise(bgDir * 150.0 + time * 0.1);
                starNoise = pow(starNoise, 20.0) * 10.0;
                col += vec3(starNoise);
                
                // Accretion disk volumetric rendering approximation
                float diskRadius = 7.0;
                float diskThickness = 0.2;
                
                // Simple plane intersection for accretion disk
                float t = -ro.y / rd.y;
                if(t > 0.0) {
                    vec3 p = ro + rd * t;
                    float r = length(p.xz);
                    if(r > 2.2 && r < diskRadius) {
                        float n = noise(vec3(p.x*2.0, p.z*2.0 - time*5.0, time));
                        float alpha = smoothstep(diskRadius, 2.2, r) * smoothstep(2.2, 3.0, r);
                        vec3 diskCol = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.8, 0.2), n) * alpha;
                        col += diskCol * 2.0;
                    }
                }
                
                // Photon sphere glow
                float glow = smoothstep(0.5, 0.0, min_dist);
                col += vec3(1.0, 0.5, 0.0) * glow * 1.5;
            }

            // Alpha blending based on distance from center for a smooth edge in 3D scene
            float alpha = smoothstep(1.0, 0.8, length(uv));
            gl_FragColor = vec4(col, alpha);
        }
    `;

    // --- PART GENERATION --- //

    // 1. The Singularity & Raymarched Void
    const singularityGroup = new THREE.Group();
    singularityGroup.position.set(0, 150, 0);

    const bhGeo = new THREE.PlaneGeometry(30, 30);
    const bhMat = new THREE.ShaderMaterial({
        vertexShader: raymarchedBlackHoleVertexShader,
        fragmentShader: raymarchedBlackHoleFragmentShader,
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(800, 800) }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const bhMesh = new THREE.Mesh(bhGeo, bhMat);
    // Orient to always face camera roughly or keep flat
    bhMesh.rotation.x = -Math.PI / 4; 
    singularityGroup.add(bhMesh);
    meshes.blackHoleShader = bhMat;
    meshes.blackHoleMesh = bhMesh;
    group.add(singularityGroup);

    parts.push({
        name: "Microscopic Singularity Core",
        description: "The artificial black hole that provides the gravitational gradient. Generated dynamically via localized exotic matter compression.",
        material: "Extreme Density Null Matter",
        function: "Creates intense localized gravity well for propulsion.",
        assemblyOrder: 15,
        connections: ["Gravitational Confinement Field", "Drive Cone"],
        failureEffect: "Catastrophic spaghettification of the vessel.",
        cascadeFailures: ["Total structural vaporization", "Local spacetime collapse"],
        originalPosition: {x: 0, y: 150, z: 0},
        explodedPosition: {x: 0, y: 300, z: 0}
    });

    // 2. Giant Drive Cone / Hawking Radiation Shield
    const conePoints = [];
    for(let i=0; i<=100; i++) {
        let y = (i/100) * 120;
        let x = 30 * Math.exp(-y / 40) + 10 + Math.sin(y * 5) * 1.5; 
        conePoints.push([x, y]);
    }
    const driveCone = createIntricateLathe(conePoints, 128, darkSteel);
    meshes.driveCone = driveCone;
    group.add(driveCone);

    parts.push({
        name: "Main Drive Cone",
        description: "Directs the gravitational forces and shields the ship from Hawking radiation using overlapping dense-matter scales.",
        material: "Hawking-Resistant Exotic Alloy",
        function: "Directional propulsion channeling and primary radiation shielding.",
        assemblyOrder: 1,
        connections: ["Inertial Dampeners", "Cooling Fins"],
        failureEffect: "Exposure of crew to lethal ionizing radiation.",
        cascadeFailures: ["Electronics fried", "Crew fatality"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    // 3. Drive Cone Outer Ablative Armor (Hundreds of scales)
    const armorGroup = new THREE.Group();
    const scaleGeo = new THREE.BoxGeometry(4, 0.5, 4);
    for(let y = 10; y < 110; y += 5) {
        let radius = 30 * Math.exp(-y / 40) + 10 + Math.sin(y * 5) * 1.5 + 1.5;
        let numScales = Math.floor(radius * 1.5);
        for(let i = 0; i < numScales; i++) {
            let scale = new THREE.Mesh(scaleGeo, steel);
            let angle = (i / numScales) * Math.PI * 2;
            scale.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
            scale.lookAt(0, y, 0);
            scale.rotation.x += Math.PI / 6; // overlapping effect
            armorGroup.add(scale);
        }
    }
    meshes.armorGroup = armorGroup;
    group.add(armorGroup);

    parts.push({
        name: "Ablative Hawking Scales",
        description: "Sacrificial dense-matter plates that slowly ablate away as they absorb high-energy gamma rays from the evaporating black hole.",
        material: "Neutron-Star Degenerate Matter Composite",
        function: "Secondary radiation shielding and armor.",
        assemblyOrder: 2,
        connections: ["Main Drive Cone"],
        failureEffect: "Armor erosion and cone thermal breach.",
        cascadeFailures: ["Breach of primary drive cone", "Catastrophic vessel melting"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 100, y: 50, z: 100}
    });

    // 4. Massive Inertial Dampener Pistons
    const dampenerGroup = new THREE.Group();
    meshes.pistons = [];
    meshes.pistonCylinders = [];
    const numDampeners = 12;
    for(let i=0; i<numDampeners; i++) {
        const dGroup = new THREE.Group();
        
        // Base massive cylinder
        const baseGeo = new THREE.CylinderGeometry(4, 4, 60, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 30;
        
        // Intricate details on base
        const ribGeo = new THREE.TorusGeometry(4.2, 0.5, 16, 32);
        for(let j=0; j<5; j++) {
            const rib = new THREE.Mesh(ribGeo, copper);
            rib.position.y = 10 + j*10;
            rib.rotation.x = Math.PI/2;
            base.add(rib);
        }
        dGroup.add(base);

        // Inner rod (Piston)
        const rodGeo = new THREE.CylinderGeometry(2.5, 2.5, 70, 32);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = 65; // Extended
        
        // Piston head mounting
        const headGeo = new THREE.BoxGeometry(8, 5, 8);
        const head = new THREE.Mesh(headGeo, steel);
        head.position.y = 35;
        rod.add(head);

        // Huge massive bolts on head
        const boltGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 8);
        for(let bx=-1; bx<=1; bx+=2) {
            for(let bz=-1; bz<=1; bz+=2) {
                const bolt = new THREE.Mesh(boltGeo, darkSteel);
                bolt.position.set(bx*3, 0, bz*3);
                head.add(bolt);
            }
        }

        dGroup.add(rod);
        meshes.pistons.push(rod);
        meshes.pistonCylinders.push(base);

        const angle = (i / numDampeners) * Math.PI * 2;
        dGroup.position.x = Math.cos(angle) * 55;
        dGroup.position.z = Math.sin(angle) * 55;
        dGroup.position.y = -40;
        
        // Angle them inwards slightly
        dGroup.lookAt(0, 100, 0);
        dGroup.rotation.x -= Math.PI/2;

        dampenerGroup.add(dGroup);
    }
    meshes.dampenerGroup = dampenerGroup;
    group.add(dampenerGroup);

    parts.push({
        name: "Titan-Class Inertial Dampeners",
        description: "Giant hydraulic-magnetic shocks filled with magnetorheological fluid to prevent the ship from tearing itself apart during violent lunges toward the singularity.",
        material: "Titanium-Adamantium Alloy",
        function: "Absorbs violent g-forces when the singularity is toggled.",
        assemblyOrder: 3,
        connections: ["Main Drive Cone", "Vessel Hull Structure"],
        failureEffect: "Ship frame snaps under instantaneous infinite acceleration.",
        cascadeFailures: ["Hull breach", "Crew turned to paste", "Total loss of vessel"],
        originalPosition: {x: 0, y: -40, z: 0},
        explodedPosition: {x: -150, y: -100, z: 150}
    });

    // 5. Magnetic Containment Toroids (Extremely detailed)
    const toroidGroup = new THREE.Group();
    meshes.containmentRings = [];
    for(let i=0; i<4; i++) {
        const ringGeo = new THREE.TorusGeometry(45 - i*4, 3, 64, 128);
        const ringMat = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 0.9, roughness: 0.2});
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = 110 + i * 25;
        ring.rotation.x = Math.PI / 2;

        // Glowing inner core channel
        const coreGeo = new THREE.TorusGeometry(45 - i*4, 1.2, 32, 128);
        const coreMat = new THREE.MeshStandardMaterial({color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2.0});
        const core = new THREE.Mesh(coreGeo, coreMat);
        ring.add(core);

        // Hundreds of tiny magnetic coils wrapped around the ring
        const coilGeo = new THREE.TorusGeometry(3.5, 0.4, 8, 32);
        for(let j=0; j<72; j++) {
            const coil = new THREE.Mesh(coilGeo, copper);
            const angle = (j / 72) * Math.PI * 2;
            coil.position.set(Math.cos(angle) * (45 - i*4), Math.sin(angle) * (45 - i*4), 0);
            coil.lookAt(0,0,0);
            coil.rotation.y = Math.PI/2;
            ring.add(coil);
        }

        meshes.containmentRings.push({mesh: ring, core: coreMat});
        toroidGroup.add(ring);
    }
    group.add(toroidGroup);

    parts.push({
        name: "Superconducting Containment Toroids",
        description: "Projects the complex magnetic fields needed to stabilize the singularity's position relative to the ship, preventing it from drifting.",
        material: "Superconducting Niobium-Titanium & YBCO",
        function: "Positioning and stabilization of the event horizon.",
        assemblyOrder: 4,
        connections: ["Singularity Core", "Power Conduits"],
        failureEffect: "Singularity drifts into the ship.",
        cascadeFailures: ["Ship consumed by black hole", "Complete deletion of matter"],
        originalPosition: {x: 0, y: 110, z: 0},
        explodedPosition: {x: 0, y: 200, z: -200}
    });

    // 6. Frame-Dragging Gyroscopic Stabilizers
    const gyroGroup = new THREE.Group();
    meshes.gyros = [];
    for(let i=0; i<3; i++) {
        const outerGeo = new THREE.TorusGeometry(20, 2, 32, 64);
        const outer = new THREE.Mesh(outerGeo, steel);
        
        const middleGeo = new THREE.TorusGeometry(16, 2, 32, 64);
        const middle = new THREE.Mesh(middleGeo, darkSteel);
        outer.add(middle);

        const innerGeo = new THREE.TorusGeometry(12, 2, 32, 64);
        const inner = new THREE.Mesh(innerGeo, chrome);
        middle.add(inner);

        const coreGeo = new THREE.SphereGeometry(8, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({color: 0x9900ff, emissive: 0x4400aa, emissiveIntensity: 1.5});
        const core = new THREE.Mesh(coreGeo, coreMat);
        inner.add(core);

        const angle = (i/3) * Math.PI * 2;
        outer.position.set(Math.cos(angle)*75, 50, Math.sin(angle)*75);
        
        meshes.gyros.push({outer, middle, inner});
        gyroGroup.add(outer);
    }
    group.add(gyroGroup);

    parts.push({
        name: "Kerr-Metric Gyroscopic Stabilizers",
        description: "Massive multi-axis gyros utilizing dense osmium cores to counteract the frame-dragging effect of the rotating singularity.",
        material: "Osmium-Iridium with Quantum Entanglement Core",
        function: "Attitude control in extreme gravitational gradients.",
        assemblyOrder: 5,
        connections: ["Vessel Hull Structure", "Main Drive Cone"],
        failureEffect: "Vessel spins at relativistic speeds.",
        cascadeFailures: ["Centrifugal force obliterates crew", "Vessel torn apart"],
        originalPosition: {x: 0, y: 50, z: 0},
        explodedPosition: {x: 200, y: 50, z: -100}
    });

    // 7. Coolant Fluid Exchange Networks
    const coolantGroup = new THREE.Group();
    meshes.coolantPipes = [];
    for(let i=0; i<16; i++) {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3( Math.cos(i/16 * Math.PI*2)*35, 10, Math.sin(i/16 * Math.PI*2)*35 ),
            new THREE.Vector3( Math.cos(i/16 * Math.PI*2)*60, -20, Math.sin(i/16 * Math.PI*2)*60 ),
            new THREE.Vector3( Math.cos((i+2)/16 * Math.PI*2)*70, -60, Math.sin((i+2)/16 * Math.PI*2)*70 )
        ]);
        const pipeGeo = new THREE.TubeGeometry(path, 64, 1.5, 16, false);
        const pipeMat = new THREE.MeshStandardMaterial({color: 0x00ff88, emissive: 0x005522, transparent: true, opacity: 0.8});
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        
        // Add metallic rings around pipes
        for(let p=0.1; p<0.9; p+=0.1) {
            const pt = path.getPoint(p);
            const tan = path.getTangent(p);
            const ringGeo = new THREE.TorusGeometry(1.8, 0.3, 16, 16);
            const ring = new THREE.Mesh(ringGeo, chrome);
            ring.position.copy(pt);
            ring.lookAt(pt.clone().add(tan));
            coolantGroup.add(ring);
        }

        meshes.coolantPipes.push(pipeMat);
        coolantGroup.add(pipe);
    }
    group.add(coolantGroup);

    parts.push({
        name: "Cryogenic Liquid Helium Exchange Network",
        description: "Complex vascular network pumping near-absolute-zero liquid helium to keep the superconducting containment toroids from quenching.",
        material: "Transparent Aluminum, Cryo-resistant Polymers",
        function: "Thermal regulation of magnetic containment.",
        assemblyOrder: 6,
        connections: ["Superconducting Containment Toroids", "Heat Radiators"],
        failureEffect: "Toroid quench.",
        cascadeFailures: ["Loss of containment field", "Singularity collapse"],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: 0, y: -150, z: 0}
    });

    // 8. Heat Radiator Fins
    const radiatorGroup = new THREE.Group();
    const finShape = new THREE.Shape();
    finShape.moveTo(0,0);
    finShape.lineTo(20, -10);
    finShape.lineTo(25, -80);
    finShape.lineTo(5, -70);
    finShape.lineTo(0,0);
    const finExtrude = { depth: 1, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.2 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);

    for(let i=0; i<8; i++) {
        const fin = new THREE.Mesh(finGeo, steel);
        const angle = (i/8) * Math.PI * 2;
        fin.position.set(Math.cos(angle)*70, -20, Math.sin(angle)*70);
        fin.rotation.y = -angle + Math.PI/2;
        fin.rotation.x = -Math.PI/8;
        
        // Add glowing heat strips
        const stripGeo = new THREE.PlaneGeometry(15, 60);
        const stripMat = new THREE.MeshStandardMaterial({color: 0xff3300, emissive: 0xaa1100, side: THREE.DoubleSide});
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.set(12, -40, 1.1);
        fin.add(strip);
        
        radiatorGroup.add(fin);
    }
    group.add(radiatorGroup);

    parts.push({
        name: "Exhaust Radiator Arrays",
        description: "Massive fin structures designed to radiate extreme waste heat into the vacuum of space.",
        material: "Carbon-Tungsten Matrix with Graphene layering",
        function: "Waste heat dumping.",
        assemblyOrder: 7,
        connections: ["Cryogenic Liquid Helium Exchange Network"],
        failureEffect: "Thermal runaway in primary systems.",
        cascadeFailures: ["Coolant boils", "Drive cone melts"],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: 0, y: -100, z: 200}
    });

    // 9. Exotic Matter Injectors
    const injectorGroup = new THREE.Group();
    meshes.injectors = [];
    for(let i=0; i<6; i++) {
        const injBaseGeo = new THREE.CylinderGeometry(3, 5, 20, 16);
        const injBase = new THREE.Mesh(injBaseGeo, darkSteel);
        const angle = (i/6) * Math.PI * 2;
        injBase.position.set(Math.cos(angle)*25, 140, Math.sin(angle)*25);
        
        injBase.lookAt(0, 150, 0);
        injBase.rotation.x -= Math.PI/2;

        const nozzleGeo = new THREE.ConeGeometry(1.5, 8, 16);
        const nozzleMat = new THREE.MeshStandardMaterial({color: 0xff00ff, metalness: 0.8});
        const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
        nozzle.position.y = 14;
        injBase.add(nozzle);

        meshes.injectors.push(nozzleMat);
        injectorGroup.add(injBase);
    }
    group.add(injectorGroup);

    parts.push({
        name: "Negative Energy Injectors",
        description: "Sprays exotic matter with negative energy density to flatten the local metric tensor around the singularity, protecting the ship from tidal forces.",
        material: "Casimir-Effect Plating, Iridium",
        function: "Event horizon manipulation and ship protection.",
        assemblyOrder: 8,
        connections: ["Superconducting Containment Toroids"],
        failureEffect: "Negative energy depletion.",
        cascadeFailures: ["Spaghettification field envelops ship", "Total destruction"],
        originalPosition: {x: 0, y: 140, z: 0},
        explodedPosition: {x: -100, y: 250, z: 0}
    });

    // 10. Heavy Duty Gearbox for Mechanical Overrides
    const gearGroup = new THREE.Group();
    meshes.gears = [];
    const mainGearGeo = createComplexGear(15, 24, 4, 3);
    const mainGear = new THREE.Mesh(mainGearGeo, steel);
    mainGear.position.set(0, -90, 0);
    mainGear.rotation.x = Math.PI/2;
    gearGroup.add(mainGear);
    meshes.gears.push({mesh: mainGear, speed: 1, ratio: 1});

    for(let i=0; i<4; i++) {
        const subGearGeo = createComplexGear(8, 12, 4, 2);
        const subGear = new THREE.Mesh(subGearGeo, copper);
        const angle = (i/4) * Math.PI * 2;
        subGear.position.set(Math.cos(angle)*23.2, -90, Math.sin(angle)*23.2);
        subGear.rotation.x = Math.PI/2;
        gearGroup.add(subGear);
        meshes.gears.push({mesh: subGear, speed: -2, ratio: -2}); // Inverse direction, twice as fast
    }
    group.add(gearGroup);

    parts.push({
        name: "Mechanical Override Gearbox",
        description: "A massively over-engineered manual gearbox to physically crank the control rods of the containment field in case of total electrical failure.",
        material: "Hardened Chromium-Vanadium Steel",
        function: "Failsafe mechanical manipulation of containment parameters.",
        assemblyOrder: 9,
        connections: ["Vessel Hull Structure", "Superconducting Containment Toroids"],
        failureEffect: "Loss of manual failsafe.",
        cascadeFailures: ["Inability to SCRAM the drive during power loss"],
        originalPosition: {x: 0, y: -90, z: 0},
        explodedPosition: {x: 0, y: -250, z: 0}
    });

    // 11. Tachyon Sensor Array Hub
    const sensorHub = new THREE.Group();
    sensorHub.position.set(0, 190, 0);
    
    const domeGeo = new THREE.SphereGeometry(6, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const dome = new THREE.Mesh(domeGeo, glass);
    sensorHub.add(dome);

    const dishGeo = new THREE.CylinderGeometry(4, 0.1, 2, 16);
    const dish = new THREE.Mesh(dishGeo, chrome);
    dish.position.y = 2;
    dish.rotation.x = Math.PI;
    sensorHub.add(dish);
    
    const antennaGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const antenna = new THREE.Mesh(antennaGeo, copper);
    antenna.position.y = 5;
    sensorHub.add(antenna);
    
    meshes.sensorDish = dish;
    meshes.sensorAntenna = antenna;
    group.add(sensorHub);

    parts.push({
        name: "Tachyon Forward Sensor Array",
        description: "Monitors the curvature of spacetime light-years ahead of the ship. Tachyonic feedback loops allow the drive to \"see\" into the future to avoid micro-meteorites.",
        material: "Chronoton-Infused Platinum, Quartz Dome",
        function: "Navigational hazard detection.",
        assemblyOrder: 10,
        connections: ["Superconducting Containment Toroids"],
        failureEffect: "Blind jumping.",
        cascadeFailures: ["Collision with interstellar dust", "Vessel vaporization in a 10^20 Joule explosion"],
        originalPosition: {x: 0, y: 190, z: 0},
        explodedPosition: {x: 0, y: 350, z: 0}
    });

    // 12. Engineering Control Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -60, 80);
    
    const cabinBodyGeo = new THREE.CylinderGeometry(15, 15, 20, 32);
    const cabinBody = new THREE.Mesh(cabinBodyGeo, darkSteel);
    cabinBody.rotation.z = Math.PI/2;
    cabinGroup.add(cabinBody);
    
    const windowGeo = new THREE.CylinderGeometry(14, 14, 21, 32, 1, false, Math.PI*0.75, Math.PI*0.5);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.rotation.z = Math.PI/2;
    cabinGroup.add(windowMesh);

    // Console panels inside
    for(let i=0; i<3; i++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 1), steel);
        const angle = (i - 1) * 0.4;
        panel.position.set(Math.sin(angle)*10, -5, Math.cos(angle)*10);
        panel.lookAt(0, -5, 0);
        
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), new THREE.MeshBasicMaterial({color: 0x00ff00}));
        screen.position.z = 0.51;
        panel.add(screen);
        
        cabinGroup.add(panel);
    }
    
    group.add(cabinGroup);

    parts.push({
        name: "Engineering Control Cabin",
        description: "Heavily shielded bunker where the Chief Engineer oversees the manual overrides. Lined with 10 meters of lead and acoustic dampeners.",
        material: "Lead-Lined Titanium, Transparent Aluminum Glass",
        function: "Manual override, monitoring, and last-resort crew survival capsule.",
        assemblyOrder: 11,
        connections: ["Mechanical Override Gearbox", "Vessel Hull Structure"],
        failureEffect: "Loss of localized control.",
        cascadeFailures: ["Crew insanity from drive resonance"],
        originalPosition: {x: 0, y: -60, z: 80},
        explodedPosition: {x: 0, y: -60, z: 300}
    });

    // 13. Heavy Plasma Conduit Trunks
    const trunkGroup = new THREE.Group();
    meshes.trunks = [];
    for(let i=0; i<4; i++) {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3( 0, -80, 0 ),
            new THREE.Vector3( Math.cos(i*Math.PI/2)*20, -40, Math.sin(i*Math.PI/2)*20 ),
            new THREE.Vector3( Math.cos(i*Math.PI/2)*40, 50, Math.sin(i*Math.PI/2)*40 ),
            new THREE.Vector3( 0, 120, 0 )
        ]);
        const trunkGeo = new THREE.TubeGeometry(path, 64, 4, 16, false);
        const trunkMat = new THREE.MeshStandardMaterial({color: 0xffaa00, emissive: 0xff5500, wireframe: true, transparent: true, opacity: 0.6});
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        
        // Solid core
        const coreGeo = new THREE.TubeGeometry(path, 64, 2, 8, false);
        const coreMat = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffffff});
        const core = new THREE.Mesh(coreGeo, coreMat);
        trunk.add(core);

        meshes.trunks.push({outer: trunkMat, inner: coreMat});
        trunkGroup.add(trunk);
    }
    group.add(trunkGroup);

    parts.push({
        name: "Primary Plasma Trunks",
        description: "Massive arteries that funnel terawatts of energy directly from the ship's antimatter reactors into the singularity generation arrays.",
        material: "Magnetic Containment Fields over Tungsten-Carbide",
        function: "Primary power transmission.",
        assemblyOrder: 12,
        connections: ["Negative Energy Injectors", "Mechanical Override Gearbox"],
        failureEffect: "Power starvation.",
        cascadeFailures: ["Singularity evaporates violently", "EMP destroys ship systems"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 200, y: 0, z: 200}
    });

    // 14. Gravitational Acoustic Baffles
    const baffleGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const baffleGeo = new THREE.TorusGeometry(60, 5, 16, 64, Math.PI/2);
        const baffle = new THREE.Mesh(baffleGeo, rubber);
        const angle = (i/8) * Math.PI * 2;
        baffle.position.y = -20;
        baffle.rotation.x = Math.PI/2;
        baffle.rotation.z = angle;
        
        // Accordion folds
        const foldGeo = new THREE.TorusGeometry(62, 1, 16, 64, Math.PI/2);
        for(let j=-2; j<=2; j++) {
            const fold = new THREE.Mesh(foldGeo, plastic);
            fold.position.z = j*2; // Z in torus local space
            baffle.add(fold);
        }

        baffleGroup.add(baffle);
    }
    group.add(baffleGroup);

    parts.push({
        name: "Gravitational Acoustic Baffles",
        description: "Absorbs the literal 'screaming' of spacetime tearing. Without these, the gravitational waves would shatter every bone in the crew's bodies.",
        material: "Hyper-Elastic Metamaterial",
        function: "Gravitational wave dampening.",
        assemblyOrder: 13,
        connections: ["Titan-Class Inertial Dampeners"],
        failureEffect: "Lethal gravitational acoustics.",
        cascadeFailures: ["Crew skeleton liquefaction"],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: -250, y: -50, z: -250}
    });

    // 15. Emergency SCRAM Explosive Bolts
    const boltGroup = new THREE.Group();
    meshes.scramBolts = [];
    for(let i=0; i<24; i++) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 16), chrome);
        const angle = (i/24) * Math.PI*2;
        bolt.position.set(Math.cos(angle)*15, 0, Math.sin(angle)*15);
        bolt.rotation.x = Math.PI/2;
        bolt.rotation.z = angle;
        
        // Red explosive ring
        const charge = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.4, 8, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
        charge.rotation.x = Math.PI/2;
        bolt.add(charge);

        meshes.scramBolts.push(charge);
        boltGroup.add(bolt);
    }
    group.add(boltGroup);

    parts.push({
        name: "SCRAM Explosive Separation Bolts",
        description: "In the event of unavoidable containment failure, these bolts detonate, physically ejecting the entire Drive Cone and Singularity Core away from the main vessel at 500G.",
        material: "Octanitrocubane charges in Titanium housings",
        function: "Absolute last resort emergency jettison.",
        assemblyOrder: 14,
        connections: ["Main Drive Cone", "Vessel Hull Structure"],
        failureEffect: "Inability to jettison.",
        cascadeFailures: ["Total loss of ship during core breach"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 50}
    });

    // 16. Spacetime Anchor Tethers
    const tetherGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const tether = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 150, 16), darkSteel);
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        tether.position.set(Math.cos(angle)*40, -50, Math.sin(angle)*40);
        tether.lookAt(0, -150, 0); // Point downwards
        tether.rotation.x -= Math.PI/2;
        
        // Harpoon head
        const harpoon = new THREE.Mesh(new THREE.ConeGeometry(3, 10, 4), steel);
        harpoon.position.y = -75;
        harpoon.rotation.x = Math.PI;
        tether.add(harpoon);

        tetherGroup.add(tether);
    }
    group.add(tetherGroup);

    parts.push({
        name: "Spacetime Anchor Tethers",
        description: "Projects localized gravity wells backward to anchor the ship relative to flat spacetime, preventing accidental backward time travel during deceleration.",
        material: "Neutrino-Woven Carbon Nanotubes",
        function: "Causality preservation and deceleration anchoring.",
        assemblyOrder: 15,
        connections: ["Vessel Hull Structure"],
        failureEffect: "Temporal displacement.",
        cascadeFailures: ["Ship arrives before it left", "Causality paradox"],
        originalPosition: {x: 0, y: -50, z: 0},
        explodedPosition: {x: 200, y: -150, z: -200}
    });

    // --- EXTREME ANIMATION LOGIC --- //
    
    let enginePhase = 0;
    
    function animate(time, speed, activeMeshes) {
        enginePhase += speed * 0.1;

        // 1. Raymarched Black Hole
        if (activeMeshes.blackHoleShader) {
            activeMeshes.blackHoleShader.uniforms.time.value = time * speed;
        }
        if (activeMeshes.blackHoleMesh) {
            // Slight jitter representing the violent quantum nature of the microscopic singularity
            activeMeshes.blackHoleMesh.position.x = (Math.random() - 0.5) * 0.5 * speed;
            activeMeshes.blackHoleMesh.position.z = (Math.random() - 0.5) * 0.5 * speed;
            activeMeshes.blackHoleMesh.position.y = 150 + (Math.random() - 0.5) * 0.5 * speed;
        }

        // 2. Inertial Dampeners Lunge (Massive structural movement)
        // The drive cone and whole system lunges up towards the black hole violently
        let lunge = Math.pow(Math.sin(enginePhase * 2), 3) * 15 * speed; 
        if (lunge < 0) lunge *= 0.2; // Slow recovery, violent lunge forward
        
        group.position.y = lunge;

        // Dampeners compress to absorb the lunge
        if (activeMeshes.pistons) {
            activeMeshes.pistons.forEach((piston, idx) => {
                // Piston rod moves down relative to cylinder when ship lunges up
                piston.position.y = 65 - Math.max(0, lunge * 1.5);
            });
        }

        // 3. Magnetic Containment Toroids
        if (activeMeshes.containmentRings) {
            activeMeshes.containmentRings.forEach((ring, idx) => {
                // Complex multi-axis rotation
                ring.mesh.rotation.x = Math.PI/2 + Math.sin(time * speed * 0.5 + idx) * 0.1;
                ring.mesh.rotation.y = Math.cos(time * speed * 0.3 + idx) * 0.1;
                ring.mesh.rotation.z += 0.05 * speed * (idx % 2 === 0 ? 1 : -1);
                
                // Emissive pulsing
                let pulse = (Math.sin(time * speed * 5 + idx) + 1.0) / 2.0;
                ring.core.emissiveIntensity = 1.0 + pulse * 3.0;
                ring.core.color.setHSL(0.55, 1.0, 0.5 + pulse * 0.3);
            });
        }

        // 4. Gyroscopic Stabilizers
        if (activeMeshes.gyros) {
            activeMeshes.gyros.forEach((gyro, idx) => {
                gyro.outer.rotation.x += 0.02 * speed;
                gyro.outer.rotation.z += 0.01 * speed;
                gyro.middle.rotation.y -= 0.05 * speed;
                gyro.middle.rotation.x += 0.03 * speed;
                gyro.inner.rotation.z += 0.1 * speed;
                gyro.inner.rotation.y -= 0.08 * speed;
            });
        }

        // 5. Coolant Pipes flow
        if (activeMeshes.coolantPipes) {
            activeMeshes.coolantPipes.forEach((pipe, idx) => {
                pipe.emissiveIntensity = 0.5 + Math.sin(time * speed * 10 - idx) * 0.5;
            });
        }

        // 6. Mechanical Overrides Gearbox
        if (activeMeshes.gears) {
            activeMeshes.gears.forEach((gear) => {
                gear.mesh.rotation.z += 0.05 * speed * gear.speed;
            });
        }

        // 7. Tachyon Sensor Sweep
        if (activeMeshes.sensorDish) {
            activeMeshes.sensorDish.rotation.z = Math.sin(time * speed * 2) * Math.PI / 4;
            activeMeshes.sensorAntenna.rotation.z = Math.cos(time * speed * 3) * Math.PI / 4;
            activeMeshes.sensorAntenna.rotation.x = Math.sin(time * speed * 3) * Math.PI / 4;
        }

        // 8. Plasma Trunks
        if (activeMeshes.trunks) {
            activeMeshes.trunks.forEach((trunk, idx) => {
                // Flash white hot
                let flash = Math.pow(Math.sin(time * speed * 8 + idx * 2), 10);
                trunk.inner.emissiveIntensity = 1.0 + flash * 5.0;
            });
        }

        // 9. SCRAM Bolts blinking warning
        if (activeMeshes.scramBolts) {
            activeMeshes.scramBolts.forEach(bolt => {
                let blink = Math.floor(time * speed * 4) % 2 === 0 ? 1 : 0.1;
                bolt.material.color.setRGB(blink, 0, 0);
            });
        }

        // 10. Injectors spray (Vibration)
        if (activeMeshes.injectors) {
            activeMeshes.injectors.forEach(inj => {
                let sprayIntensity = Math.random() * speed;
                inj.emissiveIntensity = sprayIntensity * 2.0;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
