import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animMeshes = {
        innerCoreLayers: [],
        liquidCoreParticles: [],
        dynamoCoils: [],
        fluxLines: [],
        pistons: [],
        solarWindParticles: null,
        magnetosphereShells: []
    };

    const description = "GOD-TIER ARTIFICIAL PLANETARY CORE: A Class-V hyper-advanced constructed geodynamo designed to synthetically generate, sustain, and manipulate a planetary-scale magnetosphere. It simulates the Magnetohydrodynamic (MHD) dynamos of gas giants and super-Earths. Features include a crystallized ultra-dense exotic matter inner solid core, surrounded by a multi-phasic liquid outer core fluid dynamics simulator, encompassed by god-tier MHD induction coils, cooling pistons, and an interactive solar radiation deflector shield.";

    // --- CUSTOM HIGH-TECH MATERIALS ---
    const innerCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x88bbff,
        emissiveIntensity: 2.0,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95
    });

    const innerCoreWireMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 4.0,
        wireframe: true
    });

    const magmaGlowMat = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff2200,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.4,
        transparent: true,
        opacity: 0.8
    });

    const magneticFluxMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 3.0,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    const plasmaCoilMat = new THREE.MeshPhysicalMaterial({
        color: 0x4400ff,
        emissive: 0x2200ff,
        emissiveIntensity: 2.5,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0
    });

    const superConductorMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 1.0,
        roughness: 0.0,
        envMapIntensity: 2.0
    });

    // --- SUB-SYSTEM 1: INNER SOLID CORE ---
    // A hyper-complex nested polyhedral structure representing the crystallized core.
    const innerCoreGroup = new THREE.Group();
    const icosaGeometry = new THREE.IcosahedronGeometry(10, 2);
    const dodecaGeometry = new THREE.DodecahedronGeometry(12, 1);
    const tetraGeometry = new THREE.TetrahedronGeometry(15, 3);
    
    const coreMesh1 = new THREE.Mesh(icosaGeometry, innerCoreMat);
    const coreMesh2 = new THREE.Mesh(dodecaGeometry, innerCoreWireMat);
    const coreMesh3 = new THREE.Mesh(tetraGeometry, new THREE.MeshStandardMaterial({
        color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 1.2, wireframe: true, transparent: true, opacity: 0.3
    }));

    innerCoreGroup.add(coreMesh1);
    innerCoreGroup.add(coreMesh2);
    innerCoreGroup.add(coreMesh3);
    group.add(innerCoreGroup);

    animMeshes.innerCoreLayers.push(coreMesh1, coreMesh2, coreMesh3);

    parts.push({
        name: "Crystallized Exotic Matter Inner Core",
        description: "The ultra-dense solid center of the artificial planet, rotating at extreme velocities to provide the mechanical energy required for the geodynamo.",
        material: "Exotic Matter / Quantum Crystalline Iron",
        function: "Provides the solid anchor and initial rotational inertia for the Coriolis forces driving the liquid outer core.",
        assemblyOrder: 1,
        connections: ["Liquid Outer Core Interface", "Core Stabilizer Pistons"],
        failureEffect: "Loss of primary magnetic field generation, leading to total magnetosphere collapse.",
        cascadeFailures: ["Outer Core Stagnation", "Solar Wind Shield Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    parts.push({
        name: "Primary Geodynamo Resonance Lattice",
        description: "A dodecahedral wireframe lattice composed of superconducting metallic hydrogen framing the inner core.",
        material: "Metallic Hydrogen",
        function: "Channels quantum resonance frequencies from the inner core to the surrounding plasma layers.",
        assemblyOrder: 2,
        connections: ["Inner Core", "Plasma Dynamo Torus"],
        failureEffect: "Uncontrolled vibrational feedback loops causing structural micro-fractures.",
        cascadeFailures: ["Core Stabilizer Piston Shear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: -20 }
    });

    // --- SUB-SYSTEM 2: OUTER LIQUID CORE DYNAMICS ---
    // Multi-layered particle systems simulating convective fluid flow in the outer core
    const liquidCoreGroup = new THREE.Group();
    const particleCount = 20000;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const velArray = new Float32Array(particleCount * 3); // For animation
    const colorArray = new Float32Array(particleCount * 3);

    const outerRadius = 25;
    const innerRadius = 13;

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Random point between inner and outer radius using spherical coordinates
        const r = innerRadius + Math.random() * (outerRadius - innerRadius);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);

        // Initial velocity (swirling motion)
        velArray[i] = (Math.random() - 0.5) * 0.1;
        velArray[i + 1] = (Math.random() - 0.5) * 0.1;
        velArray[i + 2] = (Math.random() - 0.5) * 0.1;

        // Color gradient based on radius
        const colorMix = (r - innerRadius) / (outerRadius - innerRadius);
        const color = new THREE.Color().lerpColors(new THREE.Color(0xffffff), new THREE.Color(0xff4500), colorMix);
        colorArray[i] = color.r;
        colorArray[i + 1] = color.g;
        colorArray[i + 2] = color.b;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    // Save velocities for custom animation
    particlesGeo.userData = { velocities: velArray, innerRadius, outerRadius };

    const particleMat = new THREE.PointsMaterial({
        size: 0.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const liquidCoreParticles = new THREE.Points(particlesGeo, particleMat);
    liquidCoreGroup.add(liquidCoreParticles);
    group.add(liquidCoreGroup);
    animMeshes.liquidCoreParticles.push(liquidCoreParticles);

    parts.push({
        name: "Convective Liquid Core Simulator",
        description: "A hyper-fluid suspension of super-heated nano-particles designed to simulate iron-alloy convection.",
        material: "Ferrofluid / Molten Iron-Nickel Alloy Surrogate",
        function: "Generates the alpha-omega dynamo effect through intense convective currents and Coriolis forces.",
        assemblyOrder: 3,
        connections: ["Inner Core", "MHD Dynamo Coils"],
        failureEffect: "Loss of magnetic field generation due to cessation of fluid convection.",
        cascadeFailures: ["Geomagnetic Reversal", "Radiation Shielding Drop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 30 }
    });

    // --- SUB-SYSTEM 3: MHD DYNAMO COILS ---
    // Massive Torus Knot geometries to represent the electromagnetic induction coils.
    const coilGroup = new THREE.Group();
    const numCoils = 4;
    for (let i = 0; i < numCoils; i++) {
        const knotGeo = new THREE.TorusKnotGeometry(28 + (i * 2), 1.5, 300, 32, 3 + i, 4 + i);
        const knotMesh = new THREE.Mesh(knotGeo, plasmaCoilMat);
        
        // Rotate coils for complex intertwining
        knotMesh.rotation.x = Math.PI / numCoils * i;
        knotMesh.rotation.y = Math.PI / numCoils * i * 0.5;
        
        coilGroup.add(knotMesh);
        animMeshes.dynamoCoils.push(knotMesh);

        parts.push({
            name: `MHD Induction Coil Array Alpha-${i+1}`,
            description: `Superconducting torus-knot coil designed to capture and amplify the electromagnetic flux generated by the liquid core.`,
            material: "Yttrium-Barium-Copper-Oxide Superconductor",
            function: "Amplifies the seed magnetic field generated by the geodynamo via self-exciting dynamo theory.",
            assemblyOrder: 4 + i,
            connections: ["Liquid Core Containment Shell", "Primary Power Conduits"],
            failureEffect: "Severe localized drop in magnetosphere intensity.",
            cascadeFailures: ["Coil Overheat", "Magnetic Flux Leakage"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -40 - (i * 15), z: 0 }
        });
    }
    group.add(coilGroup);

    // --- SUB-SYSTEM 4: CONTAINMENT RINGS & EXTRUDED FLUX EMITTERS ---
    // Creating complex extruded shapes for containment rings
    const ringGroup = new THREE.Group();
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, 35, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 33, 0, Math.PI * 2, true);
    ringShape.holes.push(holePath);

    const extrudeSettings = {
        depth: 4,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 2,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };
    const ringGeo = new THREE.ExtrudeGeometry(ringShape, extrudeSettings);

    const ringMat = darkSteel;
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -2;
    
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 2;
    ring2.position.y = -2;

    ringGroup.add(ring1, ring2);
    group.add(ringGroup);
    animMeshes.magnetosphereShells.push(ring1, ring2);

    parts.push({
        name: "Equatorial Containment Ring",
        description: "Massive dark steel ring housing hundreds of sensory nodes and flux emitters.",
        material: "Dark Steel / Titanium Alloy",
        function: "Maintains the structural integrity of the outer core pressure vessel and hosts diagnostic sensors.",
        assemblyOrder: 8,
        connections: ["MHD Induction Coils", "Coolant Pistons"],
        failureEffect: "Rupture of the liquid core pressure vessel.",
        cascadeFailures: ["Catastrophic Core Decompression", "Vessel Melt"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 60 }
    });

    parts.push({
        name: "Polar Containment Ring",
        description: "Vertical intersecting ring designed to handle polar magnetic flux.",
        material: "Dark Steel / Titanium Alloy",
        function: "Focuses the magnetic field lines emerging from the north and south poles of the core.",
        assemblyOrder: 9,
        connections: ["Equatorial Containment Ring", "MHD Induction Coils"],
        failureEffect: "Polar magnetic field destabilization.",
        cascadeFailures: ["Auroral Radiation Bleed", "Polar Atmospheric Stripping"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 60, y: 0, z: 0 }
    });

    // Sub-system 4b: Magnetic Flux Emitter Lugs (Instead of Tire Treads)
    // Hundreds of tiny lugs extruded around the rings
    const lugsGroup = new THREE.Group();
    const lugGeo = new THREE.BoxGeometry(2, 6, 2);
    for (let i = 0; i < 72; i++) {
        const theta = (i / 72) * Math.PI * 2;
        
        // Equatorial lugs
        const lugEq = new THREE.Mesh(lugGeo, copper);
        lugEq.position.set(36 * Math.cos(theta), 0, 36 * Math.sin(theta));
        lugEq.lookAt(0, 0, 0);
        lugsGroup.add(lugEq);

        // Polar lugs
        const lugPo = new THREE.Mesh(lugGeo, copper);
        lugPo.position.set(36 * Math.cos(theta), 36 * Math.sin(theta), 0);
        lugPo.lookAt(0, 0, 0);
        lugPo.rotation.z += Math.PI/2;
        lugsGroup.add(lugPo);
    }
    group.add(lugsGroup);

    parts.push({
        name: "Magnetic Flux Emitter Array (Lugs)",
        description: "144 distinct copper-alloy extrusion lugs arrayed across the containment rings.",
        material: "Hyper-Conductive Copper Alloy",
        function: "Shapes the emerging magnetic field into a stable dipole configuration, suppressing multipolar anomalies.",
        assemblyOrder: 10,
        connections: ["Containment Rings"],
        failureEffect: "Emergence of quadrupole and octupole magnetic fields, weakening the main dipole.",
        cascadeFailures: ["Multi-polar Magnetic Reversal"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -80, y: 0, z: 0 }
    });


    // --- SUB-SYSTEM 5: COOLING & STABILIZING PISTONS ---
    // Complex cylinder-within-cylinder piston arrangements
    const pistonGroup = new THREE.Group();
    const numPistons = 12;
    for (let i = 0; i < numPistons; i++) {
        const theta = (i / numPistons) * Math.PI * 2;
        const radius = 38;

        const singlePistonGroup = new THREE.Group();

        // Main housing
        const housingGeo = new THREE.CylinderGeometry(2, 2, 15, 16);
        const housing = new THREE.Mesh(housingGeo, steel);
        housing.position.y = 7.5;

        // Inner rod
        const rodGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = 15; // Extends outwards

        // Joint / Cap
        const capGeo = new THREE.SphereGeometry(2.5, 16, 16);
        const cap = new THREE.Mesh(capGeo, rubber);
        cap.position.y = 25;

        // Hydraulic fluid tube connecting to ring
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 5, 0),
            new THREE.Vector3(8, -5, 0),
            new THREE.Vector3(12, 0, 0)
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.5, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        pipe.position.y = 5;
        pipe.rotation.y = Math.PI / 2;

        singlePistonGroup.add(housing, rod, cap, pipe);

        // Position and orient piston radially outwards
        singlePistonGroup.position.set(radius * Math.cos(theta), 0, radius * Math.sin(theta));
        // Look away from center
        singlePistonGroup.lookAt(
            (radius + 1) * Math.cos(theta),
            0,
            (radius + 1) * Math.sin(theta)
        );
        // Rotate to point outward radially
        singlePistonGroup.rotation.x = Math.PI / 2;

        pistonGroup.add(singlePistonGroup);

        // Store for animation
        animMeshes.pistons.push({
            rod: rod,
            cap: cap,
            baseY: rod.position.y,
            speedOffset: Math.random() * Math.PI * 2
        });

        if (i % 4 === 0) {
            parts.push({
                name: `Hydraulic Stabilizer Piston Unit ${i/4 + 1}`,
                description: `Massive active-suspension piston utilizing magneto-rheological fluid to dampen the immense vibrations of the geodynamo.`,
                material: "Steel Housing, Chrome Rod, Vulcanized Rubber Cap, Copper Hydraulics",
                function: "Absorbs torsional oscillations and maintains absolute centering of the inner core relative to the mantle.",
                assemblyOrder: 11 + (i/4),
                connections: ["Containment Ring", "Planetary Mantle (External)"],
                failureEffect: "Core decentering, causing massive seismic disturbances in the planet's mantle.",
                cascadeFailures: ["Planetary Earthquakes", "Piston Shearing"],
                originalPosition: { x: radius * Math.cos(theta), y: 0, z: radius * Math.sin(theta) },
                explodedPosition: { x: (radius + 40) * Math.cos(theta), y: 20, z: (radius + 40) * Math.sin(theta) }
            });
        }
    }
    group.add(pistonGroup);

    // --- SUB-SYSTEM 6: MAGNETIC FIELD LINES (DIPOLE VISUALIZATION) ---
    // Sweeping curves emerging from poles and re-entering
    const fluxLineGroup = new THREE.Group();
    const numFluxLines = 24;
    for (let i = 0; i < numFluxLines; i++) {
        const theta = (i / numFluxLines) * Math.PI * 2;
        const fluxCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(2 * Math.cos(theta), 30, 2 * Math.sin(theta)), // North pole exit
            new THREE.Vector3(50 * Math.cos(theta), 60, 50 * Math.sin(theta)), // Arching out
            new THREE.Vector3(60 * Math.cos(theta), -60, 60 * Math.sin(theta)), // Arching down
            new THREE.Vector3(2 * Math.cos(theta), -30, 2 * Math.sin(theta)) // South pole entry
        );

        const fluxTubeGeo = new THREE.TubeGeometry(fluxCurve, 64, 0.4, 8, false);
        const fluxLineMesh = new THREE.Mesh(fluxTubeGeo, magneticFluxMat);
        fluxLineGroup.add(fluxLineMesh);
        animMeshes.fluxLines.push(fluxLineMesh);

        if (i === 0) {
            parts.push({
                name: "Magnetosphere Dipole Field Lines",
                description: "Visible tracing of the primary magnetic flux lines exiting the north pole and re-entering the south pole.",
                material: "Photon-Excited Plasma (Visualization)",
                function: "Deflects incoming charged particles and cosmic rays from the host star.",
                assemblyOrder: 15,
                connections: ["Polar Containment Rings", "Magnetosphere Envelope"],
                failureEffect: "Complete exposure of the planet to solar wind and ionizing radiation.",
                cascadeFailures: ["Atmospheric Stripping", "Extinction Event"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 100, z: 0 }
            });
        }
    }
    group.add(fluxLineGroup);

    // --- SUB-SYSTEM 7: SOLAR WIND DEFLECTOR SHIELD ---
    // A massive sphere of particles interacting with an invisible bow shock
    const solarWindGroup = new THREE.Group();
    const swParticleCount = 15000;
    const swGeo = new THREE.BufferGeometry();
    const swPos = new Float32Array(swParticleCount * 3);
    const swVel = new Float32Array(swParticleCount * 3);

    for (let i = 0; i < swParticleCount * 3; i += 3) {
        // Start far away on the Z axis (incoming solar wind)
        swPos[i] = (Math.random() - 0.5) * 150;     // X spread
        swPos[i + 1] = (Math.random() - 0.5) * 150; // Y spread
        swPos[i + 2] = 200 + Math.random() * 100;   // Z (coming from positive Z)

        // Velocity strictly in negative Z direction initially
        swVel[i] = 0;
        swVel[i + 1] = 0;
        swVel[i + 2] = -1.5 - Math.random(); 
    }

    swGeo.setAttribute('position', new THREE.BufferAttribute(swPos, 3));
    swGeo.userData = { velocities: swVel, originalZ: 200 };

    const swMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.6,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const swParticles = new THREE.Points(swGeo, swMat);
    solarWindGroup.add(swParticles);
    group.add(solarWindGroup);
    animMeshes.solarWindParticles = swParticles;

    parts.push({
        name: "Solar Wind / Bow Shock Deflection Matrix",
        description: "A simulated stream of highly energized charged particles representing stellar wind, visibly parting around the generated magnetosphere.",
        material: "Simulated Stellar Plasma (Protons/Electrons)",
        function: "Demonstrates the efficacy of the geodynamo in protecting the planetary environment from cosmic radiation.",
        assemblyOrder: 16,
        connections: ["Open Space"],
        failureEffect: "N/A - External Phenomenon",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 200 },
        explodedPosition: { x: 0, y: 0, z: 400 }
    });


    // --- SUB-SYSTEM 8: INTER-CORE COOLANT PIPING (HYDRAULICS) ---
    // Extensive winding pipes wrapping around the core structure
    const pipesGroup = new THREE.Group();
    for (let p = 0; p < 8; p++) {
        const pipePoints = [];
        const baseRadius = 40;
        const heightOscillation = 30;
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const angle = t * Math.PI * 4 + (p * Math.PI / 4); // Twist multiple times
            const r = baseRadius + Math.sin(t * Math.PI * 8) * 5; 
            const y = Math.cos(t * Math.PI * 2) * heightOscillation;
            pipePoints.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
        }
        
        const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 64, 0.8, 8, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, tinted);
        pipesGroup.add(pipeMesh);

        if (p === 0) {
            parts.push({
                name: "Cryogenic Liquid Helium Coolant Conduits",
                description: "Extensive network of reinforced, tinted glass tubing transporting liquid helium to cool the superconducting Dynamo Coils.",
                material: "Tinted Transparent Aluminum / Glass",
                function: "Prevents the immense heat of the liquid core from quenching the superconducting state of the MHD coils.",
                assemblyOrder: 17,
                connections: ["MHD Induction Coils", "Thermal Radiator Vents"],
                failureEffect: "Superconductor quench, resulting in explosive vaporization of coolant and loss of magnetic field.",
                cascadeFailures: ["Dynamo Coil Melt", "Explosive Decompression"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: -80, z: 80 }
            });
        }
    }
    group.add(pipesGroup);

    // --- SUB-SYSTEM 9: CORE DIAGNOSTIC SENSOR ARRAYS (TINY DETAILS) ---
    const sensorGroup = new THREE.Group();
    const sensorGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 8);
    for (let i=0; i<36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const sensor = new THREE.Mesh(sensorGeo, glass);
        sensor.position.set(26 * Math.cos(angle), 0, 26 * Math.sin(angle));
        sensor.rotation.x = Math.PI / 2;
        sensor.lookAt(0, 0, 0);
        
        // Add tiny emissive light to sensor
        const lightGeo = new THREE.SphereGeometry(0.6, 8, 8);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.z = -1.5; // at the tip pointing to core
        sensor.add(light);

        sensorGroup.add(sensor);
    }
    group.add(sensorGroup);
    
    parts.push({
        name: "Core-Mantle Boundary (CMB) Telemetry Sensors",
        description: "High-precision seismographic, thermal, and magnetic sensors probing the liquid core boundary.",
        material: "Sapphire Glass and Tungsten",
        function: "Monitors fluid viscosity, thermal convection rates, and localized magnetic flux density in real-time.",
        assemblyOrder: 18,
        connections: ["Equatorial Containment Ring", "Liquid Core Surface"],
        failureEffect: "Blind spots in geodynamo monitoring, risking undetected anomalies.",
        cascadeFailures: ["Unpredictable Magnetic Reversals"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -50, y: -50, z: -50 }
    });

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the context of the magnetohydrodynamic (MHD) dynamo theory modeled here, which dimensionless number must be sufficiently large (typically > 10) to overcome magnetic diffusion and sustain the planetary magnetic field through self-excitation?",
            options: [
                "Rossby Number",
                "Prandtl Number",
                "Magnetic Reynolds Number",
                "Rayleigh Number"
            ],
            correctAnswer: 2,
            explanation: "The Magnetic Reynolds number (Rm) represents the ratio of magnetic advection (creation of field via fluid motion) to magnetic diffusion (decay of field). A dynamo can only be sustained if Rm is greater than a critical value, typically around 10 to 100, ensuring the field is generated faster than it diffuses."
        },
        {
            question: "The swirling motion of the artificial outer core particles is strongly influenced by the Coriolis effect. In rapidly rotating bodies like planets, this forces the convective fluid into columnar structures aligned parallel to the rotation axis. What are these columns called?",
            options: [
                "Birkeland Currents",
                "Taylor-Proudman Columns",
                "Navier-Stokes Vortices",
                "Alfven Waves"
            ],
            correctAnswer: 1,
            explanation: "According to the Taylor-Proudman theorem, in a rapidly rotating, unstratified fluid (where the Rossby number is very small), fluid motion becomes two-dimensional and organizes into columns parallel to the axis of rotation, known as Taylor columns."
        },
        {
            question: "Observe the complex Torus Knot Induction Coils in the model. In planetary dynamos, the conversion of toroidal magnetic fields back into poloidal magnetic fields (closing the dynamo loop) is often driven by helical convection caused by the Coriolis force. This crucial step is known as what?",
            options: [
                "The Omega Effect",
                "The Alpha Effect",
                "The Zeeman Effect",
                "The Hall Effect"
            ],
            correctAnswer: 1,
            explanation: "The Alpha Effect describes how small-scale helical convection currents (twisted by the Coriolis force) warp toroidal magnetic field lines into small loops, which coalesce to regenerate the large-scale poloidal magnetic field. The Omega effect converts poloidal to toroidal via differential rotation."
        },
        {
            question: "If the Hydraulic Stabilizer Pistons were to fail, allowing the solid inner core to shift from the geometric center, what gravitational/dynamical phenomenon might occur, similar to theories regarding Earth's inner core?",
            options: [
                "Torsional Oscillations and Length-of-Day variations",
                "Immediate Magnetic Reversal",
                "Thermal runaway and complete mantle melting",
                "Spontaneous isotopic decay"
            ],
            correctAnswer: 0,
            explanation: "Gravitational and magnetic coupling between the inner core, outer core, and mantle lead to Torsional Oscillations. Shifts or decadal variations in these couplings transfer angular momentum, causing observable changes in the Length of Day (LOD)."
        },
        {
            question: "The Solar Wind Deflector Matrix simulates the Bow Shock. At the bow shock boundary, the solar wind undergoes a sudden transition. Which of the following best describes this physical change in the plasma as it crosses the bow shock?",
            options: [
                "It accelerates to super-Alfvénic speeds and cools down.",
                "It undergoes nuclear fusion due to high pressure.",
                "It decelerates from supersonic to subsonic speeds and heats up abruptly.",
                "It becomes completely neutral, losing all charge."
            ],
            correctAnswer: 2,
            explanation: "A bow shock is a collisionless shockwave where the supersonic (and super-Alfvénic) solar wind encounters the obstacle of the planet's magnetosphere. It is forced to decelerate to subsonic speeds, and its kinetic energy is rapidly converted into thermal energy, causing abrupt heating."
        }
    ];

    // --- ANIMATION FUNCTION ---
    const animate = (time, speed, meshes) => {
        const timeSec = time * 0.001 * speed;

        // 1. Rotate the solid inner core complexes at different extreme speeds
        if (animMeshes.innerCoreLayers.length === 3) {
            // Icosahedron (Core)
            animMeshes.innerCoreLayers[0].rotation.y = timeSec * 2.5;
            animMeshes.innerCoreLayers[0].rotation.x = timeSec * 1.2;
            
            // Dodecahedron (Lattice) - counter-rotating
            animMeshes.innerCoreLayers[1].rotation.y = -timeSec * 1.8;
            animMeshes.innerCoreLayers[1].rotation.z = timeSec * 0.9;
            
            // Tetrahedron (Resonance) - rapid erratic spin
            animMeshes.innerCoreLayers[2].rotation.x = timeSec * 4.0;
            animMeshes.innerCoreLayers[2].rotation.y = timeSec * 3.5;
        }

        // 2. Liquid Core Particle Fluid Dynamics Simulation
        if (animMeshes.liquidCoreParticles.length > 0) {
            const pts = animMeshes.liquidCoreParticles[0];
            const pos = pts.geometry.attributes.position.array;
            const userData = pts.geometry.userData;
            const vel = userData.velocities;
            const innerR = userData.innerRadius;
            const outerR = userData.outerRadius;

            // Simulate swirling Taylor Columns and convection
            for (let i = 0; i < pos.length; i += 3) {
                let x = pos[i];
                let y = pos[i + 1];
                let z = pos[i + 2];

                // Distance from center
                const r = Math.sqrt(x*x + y*y + z*z);
                
                // Coriolis swirling force (stronger at equator, i.e., larger x,z compared to y)
                const distFromAxis = Math.sqrt(x*x + z*z);
                const angularVel = (speed * 0.05) / (distFromAxis + 1); // Omega effect

                // Convection force (pushing outwards then sinking)
                const convection = Math.sin(timeSec * 2 + r) * 0.02 * speed;

                // Apply velocities
                vel[i] += (-z * angularVel + x * convection) * 0.01;
                vel[i + 1] += (Math.cos(distFromAxis) * 0.01 * speed) * 0.01; // Up/down drafts
                vel[i + 2] += (x * angularVel + z * convection) * 0.01;

                // Damping to prevent exploding simulation
                vel[i] *= 0.95;
                vel[i + 1] *= 0.95;
                vel[i + 2] *= 0.95;

                // Update positions
                pos[i] += vel[i];
                pos[i + 1] += vel[i + 1];
                pos[i + 2] += vel[i + 2];

                // Boundary collision (bounce back if out of bounds)
                const newR = Math.sqrt(pos[i]*pos[i] + pos[i+1]*pos[i+1] + pos[i+2]*pos[i+2]);
                if (newR > outerR || newR < innerR) {
                    // Normalize and place back at boundary
                    const bound = newR > outerR ? outerR : innerR;
                    pos[i] = (pos[i] / newR) * bound;
                    pos[i + 1] = (pos[i + 1] / newR) * bound;
                    pos[i + 2] = (pos[i + 2] / newR) * bound;
                    
                    // Reverse velocity
                    vel[i] *= -0.5;
                    vel[i + 1] *= -0.5;
                    vel[i + 2] *= -0.5;
                }
            }
            pts.geometry.attributes.position.needsUpdate = true;
        }

        // 3. Dynamo Coils rotation and pulsing
        animMeshes.dynamoCoils.forEach((coil, index) => {
            coil.rotation.z = timeSec * 0.5 * (index % 2 === 0 ? 1 : -1);
            // Pulse emissive intensity
            const intensity = 1.5 + Math.sin(timeSec * 5 + index) * 1.0;
            coil.material.emissiveIntensity = intensity;
        });

        // 4. Stabilizing Pistons active suspension
        animMeshes.pistons.forEach(piston => {
            // Rods pump in and out to dampen vibrations
            const extension = Math.sin(timeSec * 8 + piston.speedOffset) * 2;
            piston.rod.position.y = piston.baseY + extension;
            piston.cap.position.y = piston.baseY + 10 + extension;
        });

        // 5. Magnetic Flux Lines pulsing
        animMeshes.fluxLines.forEach((flux, index) => {
            // Rotate the entire flux cage slowly
            flux.rotation.y = timeSec * 0.2;
            // Opacity pulsing to simulate flux transfer events
            flux.material.opacity = 0.3 + Math.sin(timeSec * 3 + index * 0.5) * 0.2;
        });

        // 6. Solar Wind / Magnetosphere Interaction Simulation
        if (animMeshes.solarWindParticles) {
            const sw = animMeshes.solarWindParticles;
            const pos = sw.geometry.attributes.position.array;
            const vel = sw.geometry.userData.velocities;
            
            // Magnetopause boundary equation roughly approximated as a paraboloid or sphere
            const bowShockRadius = 75;

            for (let i = 0; i < pos.length; i += 3) {
                let x = pos[i];
                let y = pos[i + 1];
                let z = pos[i + 2];

                // Constant solar wind velocity driving them negative Z
                vel[i + 2] -= 0.1 * speed; 

                const distFromCenter = Math.sqrt(x*x + y*y + z*z);
                
                // If approaching the magnetosphere
                if (distFromCenter < bowShockRadius * 1.5 && z > 0) {
                    // Magnetic deflection force: F = q(v x B). We fake it geometrically here
                    // Deflect outwards from the Z axis based on proximity to bow shock
                    const deflectionStrength = Math.pow(bowShockRadius * 1.5 / distFromCenter, 2) * speed * 0.05;
                    
                    // Push particles away from the core radially in X and Y
                    const rxy = Math.sqrt(x*x + y*y) + 0.1; // avoid divide by zero
                    vel[i] += (x / rxy) * deflectionStrength;
                    vel[i + 1] += (y / rxy) * deflectionStrength;
                    
                    // Slow down in Z (Bow shock deceleration)
                    vel[i + 2] *= 0.8;
                }

                // Apply velocity
                pos[i] += vel[i];
                pos[i + 1] += vel[i + 1];
                pos[i + 2] += vel[i + 2];

                // Reset particles that have passed the planet far behind (Z < -150)
                if (pos[i + 2] < -150) {
                    pos[i] = (Math.random() - 0.5) * 150;
                    pos[i + 1] = (Math.random() - 0.5) * 150;
                    pos[i + 2] = sw.geometry.userData.originalZ + Math.random() * 50;
                    vel[i] = 0;
                    vel[i + 1] = 0;
                    vel[i + 2] = -1.5 - Math.random();
                }
            }
            sw.geometry.attributes.position.needsUpdate = true;
        }

        // 7. Containment Rings slow counter-rotation
        if (animMeshes.magnetosphereShells.length === 2) {
            animMeshes.magnetosphereShells[0].rotation.z = timeSec * 0.1;
            animMeshes.magnetosphereShells[1].rotation.x = timeSec * 0.08 + Math.PI/2;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}
