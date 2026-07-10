import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animations = [];

    // ==========================================
    // METADATA & MEGASTRUCTURE DESCRIPTIONS
    // ==========================================
    const description = `
        Shkadov Thruster Stellar Engine (Class A Megastructure) - Ultra God Tier.
        A hypothetical megastructure that utilizes radiation pressure and solar wind from a star 
        to generate asymmetrical thrust, effectively transforming the entire solar system into a spacecraft. 
        This ultra-complex, hyper-realistic engineering model features a gigantic parabolic mirror 
        wrapping halfway around the star, massive scaffolding, thermal radiator fins, magnetic 
        containment tethers, station-keeping thrusters, and a rotating biosphere habitat for the controllers. 
        The simulation includes dynamic solar wind particle bow shocks, coronal mass ejections, 
        and intricate station-keeping mechanisms maintaining gravitational equilibrium.
    `;

    // ==========================================
    // CUSTOM MEGASTRUCTURE MATERIALS
    // ==========================================
    const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 4.0,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.95
    });

    const coronaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff2200,
        emissiveIntensity: 2.5,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    const mirrorSurface = chrome.clone();
    mirrorSurface.side = THREE.DoubleSide;
    mirrorSurface.metalness = 1.0;
    mirrorSurface.roughness = 0.05;
    mirrorSurface.envMapIntensity = 2.0;

    const structuralSteel = darkSteel.clone();
    structuralSteel.roughness = 0.8;
    structuralSteel.metalness = 0.7;

    const hotCopper = copper.clone();
    hotCopper.emissive = new THREE.Color(0xff4400);
    hotCopper.emissiveIntensity = 0.5;

    const thrustPlumeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    // ==========================================
    // PROCEDURAL GENERATION CONSTANTS
    // ==========================================
    const STAR_RADIUS = 500;
    const MIRROR_RADIUS = 1200;
    const MIRROR_THICKNESS = 15;
    const HABITAT_RADIUS = 1600;

    // ==========================================
    // 1. THE CENTRAL STAR & CORONA
    // ==========================================
    const starGroup = new THREE.Group();
    
    // Core
    const coreGeo = new THREE.SphereGeometry(STAR_RADIUS, 128, 128);
    const starMesh = new THREE.Mesh(coreGeo, starMaterial);
    starGroup.add(starMesh);

    // Photosphere / Corona Layers
    const coronaGeo1 = new THREE.SphereGeometry(STAR_RADIUS * 1.05, 64, 64);
    const coronaMesh1 = new THREE.Mesh(coronaGeo1, coronaMaterial);
    starGroup.add(coronaMesh1);

    const coronaGeo2 = new THREE.SphereGeometry(STAR_RADIUS * 1.15, 64, 64);
    const coronaMaterial2 = coronaMaterial.clone();
    coronaMaterial2.opacity = 0.2;
    coronaMaterial2.color.setHex(0xffaa00);
    const coronaMesh2 = new THREE.Mesh(coronaGeo2, coronaMaterial2);
    starGroup.add(coronaMesh2);

    // Coronal Loops (Flares)
    const flareGroup = new THREE.Group();
    const flareCount = 45;
    const flareCurves = [];
    
    for (let i = 0; i < flareCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / flareCount);
        const theta = Math.sqrt(flareCount * Math.PI) * phi;

        const r1 = STAR_RADIUS;
        const r2 = STAR_RADIUS * (1.2 + Math.random() * 0.8);
        
        const p1 = new THREE.Vector3().setFromSphericalCoords(r1, phi, theta);
        const p2 = new THREE.Vector3().setFromSphericalCoords(r2, phi + (Math.random()-0.5), theta + (Math.random()-0.5));
        const p3 = new THREE.Vector3().setFromSphericalCoords(r1, phi + (Math.random()-0.5)*0.5, theta + (Math.random()-0.5)*0.5);

        const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
        flareCurves.push({ curve, mesh: null, phase: Math.random() * Math.PI * 2, speed: 0.01 + Math.random() * 0.02 });
        
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 3 + Math.random() * 5, 8, false);
        const flareMesh = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        }));
        flareGroup.add(flareMesh);
        flareCurves[i].mesh = flareMesh;
    }
    starGroup.add(flareGroup);
    group.add(starGroup);

    parts.push({
        name: "Stellar Core & Photosphere",
        description: "The captured main sequence star providing the radiation pressure and solar wind driving the Shkadov Thruster.",
        material: "Plasma / Nuclear Fusion Core",
        function: "Power generation and primary propulsion source.",
        assemblyOrder: 1,
        connections: ["Gravitational anchor to megastructure"],
        failureEffect: "Supernova or collapse, resulting in total system annihilation.",
        cascadeFailures: ["Mirror melting", "Habitat incineration", "Gravity tractor failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5000 }
    });

    parts.push({
        name: "Coronal Magnetic Containment Loops",
        description: "Massive magnetic fields induced by the megastructure to stabilize the star's coronal mass ejections.",
        material: "Electromagnetic Plasma",
        function: "Directs solar flares away from the primary parabolic mirror.",
        assemblyOrder: 2,
        connections: ["Stellar Core", "Magnetic Field Generators"],
        failureEffect: "Uncontrolled CMEs damage the mirror surface and habitats.",
        cascadeFailures: ["Mirror structural breach", "Radiation spikes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 2000, y: 2000, z: 2000 }
    });

    animations.push((time) => {
        starMesh.rotation.y = time * 0.005;
        coronaMesh1.rotation.y = time * 0.007;
        coronaMesh1.rotation.z = time * 0.002;
        coronaMesh2.rotation.x = time * 0.004;
        coronaMesh2.rotation.y = time * 0.008;

        const scaleOscillation = 1.0 + Math.sin(time * 0.5) * 0.01;
        starMesh.scale.set(scaleOscillation, scaleOscillation, scaleOscillation);

        flareCurves.forEach(flare => {
            flare.mesh.material.opacity = 0.3 + Math.sin(time * flare.speed * 50 + flare.phase) * 0.3;
            const s = 1.0 + Math.sin(time * flare.speed * 20 + flare.phase) * 0.1;
            flare.mesh.scale.set(s, s, s);
        });
    });

    // ==========================================
    // 2. THE PARABOLIC MIRROR MEGASTRUCTURE
    // ==========================================
    const mirrorGroup = new THREE.Group();
    
    // We construct a massive hemisphere-like parabolic shape using LatheGeometry for precision
    const points = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Parabola equation: x = R * sin(theta), z = -R * cos(theta)
        // Creating a spherical cap covering exactly half the sky (a hemisphere for simplicity, but flared)
        const angle = t * (Math.PI / 2.1); 
        const x = MIRROR_RADIUS * Math.sin(angle);
        const z = -(MIRROR_RADIUS * Math.cos(angle));
        points.push(new THREE.Vector2(x, z));
    }
    
    const mirrorGeo = new THREE.LatheGeometry(points, 256, 0, Math.PI * 2);
    const mirror = new THREE.Mesh(mirrorGeo, mirrorSurface);
    // Rotate to face the +Z direction (thrust direction)
    mirror.rotation.x = -Math.PI / 2;
    mirrorGroup.add(mirror);

    // Outer ablative shielding layer
    const outerShieldGeo = new THREE.LatheGeometry(points, 256, 0, Math.PI * 2);
    const outerShield = new THREE.Mesh(outerShieldGeo, structuralSteel);
    outerShield.rotation.x = -Math.PI / 2;
    // Scale slightly up to act as the back shell
    outerShield.scale.set(1.01, 1.01, 1.01);
    mirrorGroup.add(outerShield);

    parts.push({
        name: "Primary Parabolic Reflector",
        description: "A gigantic, ultra-thin multi-layered mirror structure spanning millions of kilometers. It reflects solar radiation to generate asymmetrical thrust.",
        material: "Hyper-reflective Chrome / Programmable Matter",
        function: "Generates thrust via radiation pressure.",
        assemblyOrder: 3,
        connections: ["Scaffolding Matrix", "Thermal Radiators"],
        failureEffect: "Loss of propulsion, rapid orbital decay into the star.",
        cascadeFailures: ["Complete megastructure vaporization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3000, z: -3000 }
    });

    parts.push({
        name: "Outer Ablative Shielding",
        description: "The dark-side armored shell protecting the mirror's delicate optical surface from interstellar micro-meteors and structural sheer.",
        material: "Dark Steel / Carbon Nanotube Weave",
        function: "Structural integrity and kinetic impact absorption.",
        assemblyOrder: 4,
        connections: ["Primary Parabolic Reflector", "Scaffolding Matrix"],
        failureEffect: "Micro-meteor penetrations causing stress fractures in the main mirror.",
        cascadeFailures: ["Optical degradation", "Thrust imbalance"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4000, z: -4000 }
    });


    // ==========================================
    // 3. MASSIVE SCAFFOLDING & TRUSS NETWORK
    // ==========================================
    const scaffoldGroup = new THREE.Group();
    
    const trussMaterial = steel.clone();
    trussMaterial.wireframe = false;
    
    // Create concentric truss rings supporting the back of the mirror
    const ringCount = 12;
    for (let i = 1; i <= ringCount; i++) {
        const radius = (MIRROR_RADIUS / ringCount) * i;
        // Calculate z position based on the spherical cap equation
        const angle = Math.asin(radius / MIRROR_RADIUS);
        const zPos = -(MIRROR_RADIUS * Math.cos(angle)) * 1.02; // Slightly behind the outer shield

        const ringGeo = new THREE.TorusGeometry(radius, 8, 16, 128);
        const ring = new THREE.Mesh(ringGeo, trussMaterial);
        ring.position.z = zPos;
        scaffoldGroup.add(ring);

        // Add radial struts
        const strutCount = 36;
        for (let j = 0; j < strutCount; j++) {
            const theta = (j / strutCount) * Math.PI * 2;
            const innerRadius = (MIRROR_RADIUS / ringCount) * (i - 1);
            const innerZ = -(MIRROR_RADIUS * Math.cos(Math.asin(innerRadius / MIRROR_RADIUS))) * 1.02;

            if (i > 1) {
                const distance = new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), zPos).distanceTo(
                    new THREE.Vector3(innerRadius * Math.cos(theta), innerRadius * Math.sin(theta), innerZ)
                );
                const strutGeo = new THREE.CylinderGeometry(3, 3, distance, 8);
                const strut = new THREE.Mesh(strutGeo, trussMaterial);
                
                const midX = (radius * Math.cos(theta) + innerRadius * Math.cos(theta)) / 2;
                const midY = (radius * Math.sin(theta) + innerRadius * Math.sin(theta)) / 2;
                const midZ = (zPos + innerZ) / 2;
                
                strut.position.set(midX, midY, midZ);
                strut.lookAt(new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), zPos));
                strut.rotateX(Math.PI / 2);
                scaffoldGroup.add(strut);
            }
        }
    }

    mirrorGroup.add(scaffoldGroup);

    parts.push({
        name: "Macro-Truss Scaffolding Matrix",
        description: "An incredibly complex interlocking web of structural steel and carbon-lattice struts holding the mirror in shape against immense gravitational and photonic pressures.",
        material: "Steel",
        function: "Maintains the precise parabolic geometry of the mirror.",
        assemblyOrder: 5,
        connections: ["Primary Parabolic Reflector", "Station-Keeping Thrusters"],
        failureEffect: "Mirror warp, leading to unfocused thrust and eventual structural buckling.",
        cascadeFailures: ["Reflector shattering"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3000, y: 0, z: -5000 }
    });

    // ==========================================
    // 4. THERMAL RADIATOR BANKS
    // ==========================================
    const radiatorGroup = new THREE.Group();
    const radiatorCount = 120;
    
    // Generate massive radiator fins protruding from the back of the shield
    for (let i = 0; i < radiatorCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / radiatorCount);
        const theta = Math.sqrt(radiatorCount * Math.PI) * phi;
        
        // Only place radiators on the "back" half of the structure
        if (phi > Math.PI / 2.2) {
            const radLength = 150 + Math.random() * 100;
            const finGeo = new THREE.BoxGeometry(5, radLength, 40);
            
            // Subdivide fin to look like a complex array of micro-fins
            const finMat = copper.clone();
            finMat.roughness = 0.9;
            
            const fin = new THREE.Mesh(finGeo, finMat);
            
            const r = MIRROR_RADIUS * 1.03; // Surface of outer shield
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            fin.position.set(x, y, z);
            fin.lookAt(new THREE.Vector3(0,0,0));
            
            // Add a glowing heat pipe to the base of the fin
            const pipeGeo = new THREE.CylinderGeometry(8, 8, 45, 12);
            const pipe = new THREE.Mesh(pipeGeo, hotCopper);
            pipe.rotation.x = Math.PI / 2;
            fin.add(pipe);

            radiatorGroup.add(fin);
        }
    }
    mirrorGroup.add(radiatorGroup);

    parts.push({
        name: "Hyper-Thermal Radiator Fins",
        description: "Thousands of massive copper-composite fins designed to bleed off the petawatts of waste heat absorbed from the star.",
        material: "Copper / Graphene Thermal Conduits",
        function: "Dissipates thermal energy into the vacuum of space.",
        assemblyOrder: 6,
        connections: ["Outer Ablative Shielding", "Plasma Conduit Network"],
        failureEffect: "Thermal runaway, localized melting of the mirror.",
        cascadeFailures: ["Structural steel liquefaction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5000, y: -2000, z: -4000 }
    });

    // ==========================================
    // 5. STATION-KEEPING THRUSTERS
    // ==========================================
    const thrusterGroup = new THREE.Group();
    const activeThrusters = [];
    const numThrusters = 16;
    const thrusterRadius = MIRROR_RADIUS * 1.1;

    for (let i = 0; i < numThrusters; i++) {
        const angle = (i / numThrusters) * Math.PI * 2;
        const x = thrusterRadius * Math.cos(angle);
        const y = thrusterRadius * Math.sin(angle);
        const z = -(MIRROR_RADIUS * 0.1); // Placed near the rim

        const thrusterAssembly = new THREE.Group();

        // Engine Bell
        const bellGeo = new THREE.CylinderGeometry(20, 5, 80, 32, 1, true);
        const bell = new THREE.Mesh(bellGeo, darkSteel);
        bell.rotation.x = Math.PI / 2;
        thrusterAssembly.add(bell);

        // Magnetic Coils around the engine
        for (let c = 0; c < 4; c++) {
            const coilGeo = new THREE.TorusGeometry(22 - c*2, 2, 16, 32);
            const coil = new THREE.Mesh(coilGeo, hotCopper);
            coil.position.z = 20 - c*15;
            thrusterAssembly.add(coil);
        }

        // Plasma Plume
        const plumeGeo = new THREE.ConeGeometry(18, 200, 32);
        plumeGeo.translate(0, -100, 0); // Origin at top
        const plume = new THREE.Mesh(plumeGeo, thrustPlumeMaterial);
        plume.rotation.x = -Math.PI / 2;
        plume.position.z = -40;
        thrusterAssembly.add(plume);
        
        activeThrusters.push({ plume: plume, baseScale: Math.random() * 0.5 + 0.5, phase: Math.random() * Math.PI });

        // Gimbal Mount
        const mountGeo = new THREE.BoxGeometry(40, 40, 40);
        const mount = new THREE.Mesh(mountGeo, steel);
        mount.position.z = 40;
        thrusterAssembly.add(mount);

        thrusterAssembly.position.set(x, y, z);
        
        // Point them outwards and slightly backwards to counter gravity and radiation pressure torque
        thrusterAssembly.lookAt(new THREE.Vector3(x * 2, y * 2, z - 200));
        
        thrusterGroup.add(thrusterAssembly);
    }
    mirrorGroup.add(thrusterGroup);

    parts.push({
        name: "Station-Keeping Thruster Array",
        description: "Gigantic plasma thrusters positioned around the rim of the megastructure. They counter the star's immense gravitational pull and radiation torque.",
        material: "Dark Steel / Electromagnetics",
        function: "Maintains the mirror's precise orbit and attitude relative to the star.",
        assemblyOrder: 7,
        connections: ["Macro-Truss Scaffolding Matrix", "Plasma Conduit Network"],
        failureEffect: "Attitude drift, leading to the mirror crashing into the star.",
        cascadeFailures: ["Total system vaporization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6000, z: 0 }
    });

    animations.push((time) => {
        activeThrusters.forEach(t => {
            // Pulse the thrust plumes
            const scaleZ = t.baseScale + Math.sin(time * 10 + t.phase) * 0.2;
            const scaleXY = 0.8 + Math.random() * 0.4;
            t.plume.scale.set(scaleXY, scaleZ, scaleXY);
            t.plume.material.opacity = 0.5 + Math.random() * 0.3;
        });
    });

    // ==========================================
    // 6. BIOSPHERE HABITAT & COMMAND RING
    // ==========================================
    const habGroup = new THREE.Group();
    const habZ = -(MIRROR_RADIUS * 1.5); // Deep in the shadow

    // Central Command Hub
    const hubGeo = new THREE.SphereGeometry(100, 64, 64);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    hub.position.z = habZ;
    habGroup.add(hub);

    // Glowing windows on hub
    const hubWindowsGeo = new THREE.SphereGeometry(102, 64, 16, 0, Math.PI * 2, Math.PI * 0.4, Math.PI * 0.2);
    const hubWindows = new THREE.Mesh(hubWindowsGeo, tinted);
    hubWindows.position.z = habZ;
    habGroup.add(hubWindows);

    // Massive Habitat Ring
    const habRingGeo = new THREE.TorusGeometry(HABITAT_RADIUS, 60, 64, 256);
    const habRing = new THREE.Mesh(habRingGeo, aluminum);
    habRing.position.z = habZ;
    habGroup.add(habRing);

    // Habitat Ring Segments (Bands)
    const bandGeo = new THREE.TorusGeometry(HABITAT_RADIUS + 2, 62, 16, 64);
    const bandMat = steel.clone();
    bandMat.color.setHex(0x333333);
    const bands = new THREE.Mesh(bandGeo, bandMat);
    bands.position.z = habZ;
    habGroup.add(bands);

    // Spokes connecting Ring to Hub
    const numSpokes = 8;
    for(let i=0; i<numSpokes; i++) {
        const angle = (i / numSpokes) * Math.PI * 2;
        const spokeGeo = new THREE.CylinderGeometry(15, 15, HABITAT_RADIUS, 16);
        const spoke = new THREE.Mesh(spokeGeo, steel);
        
        const midX = (HABITAT_RADIUS / 2) * Math.cos(angle);
        const midY = (HABITAT_RADIUS / 2) * Math.sin(angle);
        
        spoke.position.set(midX, midY, habZ);
        spoke.lookAt(new THREE.Vector3(HABITAT_RADIUS * Math.cos(angle), HABITAT_RADIUS * Math.sin(angle), habZ));
        spoke.rotateX(Math.PI / 2);
        
        habGroup.add(spoke);
    }

    // Connect Hub to Mirror Center
    const mainTetherGeo = new THREE.CylinderGeometry(40, 40, Math.abs(habZ - (-MIRROR_RADIUS)), 32);
    const mainTether = new THREE.Mesh(mainTetherGeo, steel);
    mainTether.position.z = (habZ + (-MIRROR_RADIUS)) / 2;
    mainTether.rotation.x = Math.PI / 2;
    habGroup.add(mainTether);

    mirrorGroup.add(habGroup);

    parts.push({
        name: "Biosphere Habitat & Command Ring",
        description: "A gigantic rotating Stanford Torus-style ring providing 1G of artificial gravity for the millions of engineers, navigators, and citizens maintaining the engine.",
        material: "Aluminum / Transparent Aluminum Windows",
        function: "Crew housing, hydroponics, and primary command center.",
        assemblyOrder: 8,
        connections: ["Main Superconducting Tether", "Scaffolding Matrix"],
        failureEffect: "Loss of crew, automated systems take over until catastrophic failure.",
        cascadeFailures: ["Manual override offline"],
        originalPosition: { x: 0, y: 0, z: habZ },
        explodedPosition: { x: 0, y: 0, z: -8000 }
    });
    
    parts.push({
        name: "Main Superconducting Tether",
        description: "An incredibly thick conduit running from the dark side of the mirror to the command hub, routing petawatts of harvested energy and data.",
        material: "Steel / Carbon Nanotube Core",
        function: "Power transmission and structural anchoring for the habitat.",
        assemblyOrder: 9,
        connections: ["Biosphere Habitat", "Primary Parabolic Reflector"],
        failureEffect: "Habitat disconnects and floats away into interstellar space.",
        cascadeFailures: ["Loss of command ring", "Total power failure to life support"],
        originalPosition: { x: 0, y: 0, z: (habZ + (-MIRROR_RADIUS)) / 2 },
        explodedPosition: { x: -2000, y: 2000, z: -6000 }
    });

    animations.push((time) => {
        // Rotate the habitat ring for artificial gravity
        habGroup.rotation.z = time * 0.1;
    });

    // ==========================================
    // 7. ENERGY HARVESTING SPIRES
    // ==========================================
    const spireGroup = new THREE.Group();
    const numSpires = 24;
    
    for (let i = 0; i < numSpires; i++) {
        const angle = (i / numSpires) * Math.PI * 2;
        // Place on the inner rim, pointing slightly inward
        const r = MIRROR_RADIUS * 0.9;
        const z = -(MIRROR_RADIUS * 0.4);
        
        const spireAssembly = new THREE.Group();
        
        const baseGeo = new THREE.CylinderGeometry(15, 30, 100, 16);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        spireAssembly.add(base);
        
        const needleGeo = new THREE.ConeGeometry(5, 400, 16);
        const needle = new THREE.Mesh(needleGeo, hotCopper);
        needle.position.y = 250;
        spireAssembly.add(needle);

        // Energy glow
        const glowGeo = new THREE.SphereGeometry(20, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.8 });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.y = 450;
        spireAssembly.add(glow);
        
        spireAssembly.position.set(r * Math.cos(angle), r * Math.sin(angle), z);
        
        // Point towards the star (origin)
        spireAssembly.lookAt(new THREE.Vector3(0,0,0));
        spireAssembly.rotateX(Math.PI / 2);
        
        spireGroup.add(spireAssembly);
    }
    mirrorGroup.add(spireGroup);

    parts.push({
        name: "Energy Harvesting Spire Network",
        description: "Massive needles protruding inward from the mirror's rim, directly absorbing high-energy gamma and X-ray radiation from the stellar corona.",
        material: "Tungsten / Hot Copper",
        function: "Provides virtually infinite power for the station-keeping thrusters and habitat.",
        assemblyOrder: 10,
        connections: ["Primary Parabolic Reflector", "Plasma Conduit Network"],
        failureEffect: "Power shortages across the megastructure.",
        cascadeFailures: ["Habitat life support failure", "Thruster flame-out"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3000 }
    });

    // ==========================================
    // 8. SOLAR WIND & PHOTON BOW SHOCK (PARTICLE SYSTEM)
    // ==========================================
    // To simulate the incredible thrust of the Shkadov engine, we need 
    // a massive particle system showing the star's radiation hitting the mirror and deflecting.
    
    const particleCount = 20000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];
    const particleColors = new Float32Array(particleCount * 3);
    
    const colorStar = new THREE.Color(0xffaa00);
    const colorThrust = new THREE.Color(0x0088ff);

    for (let i = 0; i < particleCount; i++) {
        // Initialize inside the star
        particlePositions[i * 3] = (Math.random() - 0.5) * STAR_RADIUS;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * STAR_RADIUS;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * STAR_RADIUS;
        
        // Emitted spherically
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        const vz = (Math.random() - 0.5) * 2;
        const v = new THREE.Vector3(vx, vy, vz).normalize().multiplyScalar(10 + Math.random() * 20);
        
        particleVelocities.push({
            v: v,
            reflected: false,
            life: Math.random() * 100
        });
        
        particleColors[i * 3] = colorStar.r;
        particleColors[i * 3 + 1] = colorStar.g;
        particleColors[i * 3 + 2] = colorStar.b;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);

    parts.push({
        name: "Photonic Bow Shock Field",
        description: "Not a physical solid part, but the critical reaction mass: the sheer physical pressure of countless petawatts of photons and solar plasma striking the mirror and bouncing back.",
        material: "Photons / Solar Plasma",
        function: "The actual thrust mechanism of the Stellar Engine.",
        assemblyOrder: 11,
        connections: ["Primary Parabolic Reflector"],
        failureEffect: "Thrust halts.",
        cascadeFailures: ["Orbit decay"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4000, z: 2000 }
    });

    animations.push((time, delta) => {
        // delta is simulated if not provided, assuming ~1/60s (0.016)
        const positions = particleGeo.attributes.position.array;
        const colors = particleGeo.attributes.color.array;
        
        for (let i = 0; i < particleCount; i++) {
            let p = new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]);
            let velInfo = particleVelocities[i];
            
            p.add(velInfo.v);
            velInfo.life -= 1;
            
            // Check collision with the parabolic mirror
            // Mirror equation roughly: distance to origin is MIRROR_RADIUS, z is negative
            const dist = p.length();
            if (!velInfo.reflected && p.z < 0 && dist > MIRROR_RADIUS - 50 && dist < MIRROR_RADIUS + 50) {
                // Reflect!
                // Normal of a sphere at point p is just normalize(p)
                const normal = p.clone().normalize();
                // Reflect velocity: v - 2(v dot n)n
                const dot = velInfo.v.dot(normal);
                const reflection = normal.clone().multiplyScalar(2 * dot);
                velInfo.v.sub(reflection);
                
                // Add extreme forward Z bias to simulate the collimated thrust beam
                velInfo.v.z += 15 + Math.random() * 10; 
                velInfo.v.multiplyScalar(1.5); // Speed up after reflection (energy addition from engine fields)
                
                velInfo.reflected = true;
                velInfo.life = 150; // Extend life to shoot out
                
                // Change color to bright blue thrust
                colors[i*3] = colorThrust.r;
                colors[i*3+1] = colorThrust.g;
                colors[i*3+2] = colorThrust.b;
            }
            
            // Reset particles that die or fly too far away
            if (velInfo.life <= 0 || p.z > 4000 || dist > 4000) {
                p.set((Math.random() - 0.5) * (STAR_RADIUS * 0.5), 
                      (Math.random() - 0.5) * (STAR_RADIUS * 0.5), 
                      (Math.random() - 0.5) * (STAR_RADIUS * 0.5));
                
                const vx = (Math.random() - 0.5) * 2;
                const vy = (Math.random() - 0.5) * 2;
                const vz = (Math.random() - 0.5) * 2;
                velInfo.v = new THREE.Vector3(vx, vy, vz).normalize().multiplyScalar(10 + Math.random() * 20);
                
                velInfo.reflected = false;
                velInfo.life = 100 + Math.random() * 50;
                
                colors[i*3] = colorStar.r;
                colors[i*3+1] = colorStar.g;
                colors[i*3+2] = colorStar.b;
            }
            
            positions[i*3] = p.x;
            positions[i*3+1] = p.y;
            positions[i*3+2] = p.z;
        }
        
        particleGeo.attributes.position.needsUpdate = true;
        particleGeo.attributes.color.needsUpdate = true;
    });

    // ==========================================
    // 9. PLASMA CONDUIT NETWORK (Details)
    // ==========================================
    const conduitGroup = new THREE.Group();
    const conduitMat = copper.clone();
    conduitMat.wireframe = true;
    
    // Creating intricate weaving pipes around the scaffolding
    for (let i = 0; i < 40; i++) {
        const path = [];
        let curr = new THREE.Vector3(0, 0, -(MIRROR_RADIUS * 1.05)); // Start at back of mirror
        for (let j = 0; j < 5; j++) {
            path.push(curr.clone());
            curr.x += (Math.random() - 0.5) * 600;
            curr.y += (Math.random() - 0.5) * 600;
            curr.z -= Math.random() * 200; // Move towards habitat
        }
        const pipeCurve = new THREE.CatmullRomCurve3(path);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 8, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, conduitMat);
        conduitGroup.add(pipe);
    }
    mirrorGroup.add(conduitGroup);

    parts.push({
        name: "Primary Plasma Conduit Network",
        description: "A labyrinthine network of magnetically shielded pipes transferring high-energy plasma from the harvesting spires to the thrusters and habitat.",
        material: "Copper / Magnetic Shielding",
        function: "Power and fuel distribution.",
        assemblyOrder: 12,
        connections: ["Energy Harvesting Spires", "Station-Keeping Thrusters", "Biosphere Habitat"],
        failureEffect: "Plasma breaches leading to localized structural melting.",
        cascadeFailures: ["Loss of thruster control"],
        originalPosition: { x: 0, y: 0, z: -(MIRROR_RADIUS * 1.05) },
        explodedPosition: { x: 0, y: -2000, z: -7000 }
    });

    // Add everything to main group
    group.add(mirrorGroup);

    // Main structural rotation to show it off slowly
    animations.push((time) => {
        // The whole megastructure slowly pivots around the star to adjust trajectory
        mirrorGroup.rotation.y = Math.sin(time * 0.05) * 0.1;
        mirrorGroup.rotation.x = Math.sin(time * 0.03) * 0.05;
    });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of stellar engines, what distinguishes a Shkadov thruster (Class A) from a Class B (e.g., Dyson swarm powering a Matrioshka brain) or Class C (Brakewell engine) megastructure?",
            options: [
                "It uses radiation pressure to generate asymmetrical thrust and move the entire star system.",
                "It extracts plasma directly from the star to power interstellar colony ships.",
                "It encapsulates the star entirely to block 100% of its light emissions.",
                "It uses a black hole singularity as its primary gravitational anchor."
            ],
            correctAnswer: 0,
            explanation: "A Class A stellar engine (Shkadov thruster) is uniquely defined by its asymmetrical mirror design which reflects a star's radiation back upon itself, creating a net thrust that slowly moves the entire star, and by gravitational tethering, its surrounding planetary system."
        },
        {
            question: "How does the Shkadov thruster maintain a stable position relative to the star without falling in due to gravity or being blown away by radiation pressure?",
            options: [
                "By using dark matter tethers to anchor itself to the galactic core.",
                "By balancing the inward gravitational pull of the star against the outward outward radiation pressure and solar wind, supplemented by station-keeping thrusters.",
                "By orbiting the star at a velocity exceeding the speed of light.",
                "It doesn't; it requires constant manual pushing by heavy-lift spacecraft."
            ],
            correctAnswer: 1,
            explanation: "The mirror must be positioned at a very precise distance where the gravitational force of the star exactly equals the outward pressure exerted by photons and solar wind hitting the mirror. Station-keeping thrusters handle minor perturbations and attitude control."
        },
        {
            question: "If a Shkadov thruster is deployed on a typical G-type main-sequence star like our Sun, approximately how long would it take to accelerate the solar system to 20 meters per second?",
            options: [
                "1 year",
                "1,000 years",
                "1 million years",
                "1 billion years"
            ],
            correctAnswer: 2,
            explanation: "Due to the immense mass of a star, the acceleration generated by radiation pressure is incredibly small. It would take roughly 1 million years to achieve a velocity change of 20 m/s, making it a project requiring geological timescales."
        },
        {
            question: "What is the primary risk of returning the reflected radiation directly back into the star's photosphere?",
            options: [
                "It instantly triggers a Type Ia supernova.",
                "It creates a localized cold spot on the star.",
                "It increases the star's temperature and pressure, potentially altering its hydrostatic equilibrium and increasing flare activity.",
                "It reverses the star's magnetic polarity instantly."
            ],
            correctAnswer: 2,
            explanation: "Reflecting a massive percentage of a star's energy back into it heats the outer layers, which can disrupt hydrostatic equilibrium, cause the star to expand slightly, and dramatically increase the ferocity of coronal mass ejections."
        },
        {
            question: "Why is a spherical cap (parabolic reflector) preferred over a flat mirror for a Shkadov thruster?",
            options: [
                "A flat mirror is impossible to construct in space.",
                "A spherical cap collimates the reflected radiation into a directed beam, maximizing net thrust along a single vector.",
                "A flat mirror would reflect light faster than the speed of light.",
                "A spherical cap provides better living space for the crew."
            ],
            correctAnswer: 1,
            explanation: "A parabolic or spherical cap design ensures that the diverging radiation from the star is reflected in a uniform, parallel direction (collimated). This focuses the thrust vector along a single axis, maximizing the engine's efficiency."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        // Execute all registered animation functions
        animations.forEach(animFn => animFn(time, speed));
    }

    return { group, parts, description, quizQuestions, animate };
}
