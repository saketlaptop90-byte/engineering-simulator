import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- MATERIALS (Custom Glowing) ---
    const comaMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.6,
        transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const carbonJetMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const cyanoJetMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 1.2,
        transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const ionTailMat = new THREE.MeshStandardMaterial({
        color: 0x0044ff, emissive: 0x0044ff, emissiveIntensity: 0.8,
        transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    const dustTailMat = new THREE.MeshStandardMaterial({
        color: 0xffddaa, emissive: 0xffddaa, emissiveIntensity: 0.1,
        transparent: true, opacity: 0.2, blending: THREE.NormalBlending, depthWrite: false, side: THREE.DoubleSide
    });
    const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, roughness: 1.0, metalness: 0.1, flatShading: true
    });
    const neonMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.0
    });
    const floodlightMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0
    });

    // --- 1. COMET NUCLEUS ---
    const nucleusGroup = new THREE.Group();
    const nucleusGeo = new THREE.IcosahedronGeometry(20, 5);
    const pos = nucleusGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
        const l = Math.sqrt(x*x + y*y + z*z);
        const n1 = Math.sin(x*0.5)*Math.cos(y*0.5)*Math.sin(z*0.5)*3.0;
        const n2 = Math.cos(x*0.2)*Math.sin(y*0.2)*4.0;
        const scale = 1 + (n1 + n2) / l;
        pos.setXYZ(i, x*scale, y*scale, z*scale*1.4); 
    }
    nucleusGeo.computeVertexNormals();
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleusGroup.add(nucleus);
    group.add(nucleusGroup);

    parts.push({
        name: "Comet Nucleus Core",
        description: "The primary rocky/icy body of the comet, experiencing intense sublimation.",
        material: "nucleusMat",
        function: "Source of outgassing and gravitational anchor for the lander.",
        assemblyOrder: 1,
        connections: ["Inner Coma", "Surface Lander"],
        failureEffect: "Structural fragmentation",
        cascadeFailures: ["Loss of lander anchor", "Coma dissipation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -50}
    });

    // --- 2. INNER COMA ---
    const comaGeo = new THREE.SphereGeometry(35, 32, 32);
    const comaMesh = new THREE.Mesh(comaGeo, comaMat);
    group.add(comaMesh);
    
    parts.push({
        name: "Cyanogen Coma Shell",
        description: "Glowing atmosphere of cyanogen gas surrounding the nucleus.",
        material: "comaMat",
        function: "Shields inner nucleus and emits distinct spectroscopic signatures.",
        assemblyOrder: 2,
        connections: ["Nucleus Core"],
        failureEffect: "Increased solar radiation on surface",
        cascadeFailures: ["Overheating of lander"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // --- 3. JETS ---
    const jetGroup = new THREE.Group();
    const jetGeo = new THREE.CylinderGeometry(0.5, 8, 40, 16, 1, true);
    
    const jet1 = new THREE.Mesh(jetGeo, carbonJetMat);
    jet1.position.set(10, 15, 0);
    jet1.rotation.z = -Math.PI / 6;
    jetGroup.add(jet1);
    
    const jet2 = new THREE.Mesh(jetGeo, cyanoJetMat);
    jet2.position.set(-8, 12, 12);
    jet2.rotation.z = Math.PI / 8;
    jet2.rotation.x = -Math.PI / 6;
    jetGroup.add(jet2);

    group.add(jetGroup);

    parts.push({
        name: "Diatomic Carbon Jet Alpha",
        description: "High-pressure sublimation vent erupting glowing green diatomic carbon.",
        material: "carbonJetMat",
        function: "Vents internal pressure from subsurface ice pockets.",
        assemblyOrder: 3,
        connections: ["Nucleus Core"],
        failureEffect: "Internal pressure buildup",
        cascadeFailures: ["Nucleus fracturing"],
        originalPosition: {x: 10, y: 15, z: 0},
        explodedPosition: {x: 30, y: 40, z: 0}
    });

    parts.push({
        name: "Cyanogen Jet Beta",
        description: "Secondary vent expelling cyanogen and water vapor.",
        material: "cyanoJetMat",
        function: "Contributes to primary coma density.",
        assemblyOrder: 4,
        connections: ["Nucleus Core"],
        failureEffect: "Asymmetric thrust",
        cascadeFailures: ["Orbital perturbation"],
        originalPosition: {x: -8, y: 12, z: 12},
        explodedPosition: {x: -20, y: 40, z: 30}
    });

    // --- 4. TAILS ---
    const tailGroup = new THREE.Group();
    const ionGeo = new THREE.CylinderGeometry(2, 20, 150, 32, 1, true);
    const ionTail = new THREE.Mesh(ionGeo, ionTailMat);
    ionTail.position.set(0, 0, -80);
    ionTail.rotation.x = Math.PI / 2;
    tailGroup.add(ionTail);

    class DustTailCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = t * 15;
            const y = -t * t * 30;
            const z = -t * 150;
            return optionalTarget.set(x, y, z);
        }
    }
    const dustCurve = new DustTailCurve();
    const dustGeo = new THREE.TubeGeometry(dustCurve, 64, 15, 16, false);
    const dustTail = new THREE.Mesh(dustGeo, dustTailMat);
    tailGroup.add(dustTail);

    // Dynamic Dust Particles
    const dustParticles = [];
    const particleGeo = new THREE.DodecahedronGeometry(0.5);
    for(let i = 0; i < 50; i++) {
        const p = new THREE.Mesh(particleGeo, dustTailMat);
        p.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            -Math.random() * 150
        );
        p.userData = {
            speed: 0.1 + Math.random() * 0.5,
            offset: Math.random() * Math.PI * 2
        };
        tailGroup.add(p);
        dustParticles.push(p);
    }
    group.add(tailGroup);

    parts.push({
        name: "Ion Tail Plasma Stream",
        description: "Straight tail of ionized gases pushed outward by solar wind.",
        material: "ionTailMat",
        function: "Carries charged particles away from the sun.",
        assemblyOrder: 5,
        connections: ["Coma"],
        failureEffect: "Plasma buildup",
        cascadeFailures: ["Magnetic anomaly"],
        originalPosition: {x: 0, y: 0, z: -80},
        explodedPosition: {x: 0, y: 0, z: -150}
    });

    parts.push({
        name: "Dust Tail Particle Stream",
        description: "Curved tail of macroscopic dust particles lagging behind orbit.",
        material: "dustTailMat",
        function: "Disperses debris along the orbital path.",
        assemblyOrder: 6,
        connections: ["Nucleus Core"],
        failureEffect: "Debris accumulation",
        cascadeFailures: ["Meteoroid shower risk"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 50, y: -20, z: -100}
    });

    // --- 5. SURFACE LANDER ---
    const landerGroup = new THREE.Group();
    landerGroup.position.set(0, 18.5, 5); 
    landerGroup.rotation.x = -Math.PI / 16;
    
    // Chassis
    const chassisGeo = new THREE.BoxGeometry(4, 2, 6);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    landerGroup.add(chassis);

    // Hydraulic Piping on Chassis
    class PipeCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            return optionalTarget.set(-2.1, 0, -3 + t * 6);
        }
    }
    const pipeGeo = new THREE.TubeGeometry(new PipeCurve(), 16, 0.1, 8, false);
    const pipeMesh1 = new THREE.Mesh(pipeGeo, copper);
    landerGroup.add(pipeMesh1);
    
    const pipeMesh2 = pipeMesh1.clone();
    pipeMesh2.position.x = 4.2; 
    landerGroup.add(pipeMesh2);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(2.5, 1.5, 3);
    const cabin = new THREE.Mesh(cabinGeo, tinted);
    cabin.position.set(0, 1.75, 0.5);
    landerGroup.add(cabin);

    // Floodlights
    const lightGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 16);
    const light1 = new THREE.Mesh(lightGeo, floodlightMat);
    light1.position.set(-1, 2.5, 2);
    light1.rotation.x = Math.PI / 2;
    landerGroup.add(light1);
    const light2 = new THREE.Mesh(lightGeo, floodlightMat);
    light2.position.set(1, 2.5, 2);
    light2.rotation.x = Math.PI / 2;
    landerGroup.add(light2);

    // Reactor
    const reactorGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const reactor = new THREE.Mesh(reactorGeo, neonMat);
    reactor.position.set(0, 1.5, -1.5);
    reactor.rotation.z = Math.PI / 2;
    landerGroup.add(reactor);

    // Plastic Sample Storage Box on Lander
    const storageGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
    const storageBox = new THREE.Mesh(storageGeo, plastic);
    storageBox.position.set(0, 2.5, -0.5);
    landerGroup.add(storageBox);

    parts.push({
        name: "Lander Main Chassis with Hydraulics",
        description: "Heavy-duty titanium reinforced chassis equipped with copper cooling pipes.",
        material: "darkSteel/copper",
        function: "Houses primary electronics and directs fluid to extremities.",
        assemblyOrder: 7,
        connections: ["Lander Cabin", "Suspension", "Reactor"],
        failureEffect: "Total structural collapse",
        cascadeFailures: ["Coolant leak", "Loss of all scientific instruments"],
        originalPosition: {x: 0, y: 18.5, z: 5},
        explodedPosition: {x: 0, y: 30, z: 20}
    });

    parts.push({
        name: "Lander Operator Cabin",
        description: "Pressurized compartment with radiation-tinted glass and twin high-intensity floodlights.",
        material: "tinted/floodlightMat",
        function: "Environmental protection and forward illumination.",
        assemblyOrder: 8,
        connections: ["Chassis"],
        failureEffect: "Depressurization",
        cascadeFailures: ["Instrument freezing", "Blindness in dark sectors"],
        originalPosition: {x: 0, y: 20.25, z: 5.5},
        explodedPosition: {x: 0, y: 40, z: 20}
    });

    parts.push({
        name: "Radioisotope Thermoelectric Generator",
        description: "Glowing neon-colored RTG providing continuous deep space power.",
        material: "neonMat",
        function: "Generates electricity and thermal management.",
        assemblyOrder: 9,
        connections: ["Chassis"],
        failureEffect: "Power loss",
        cascadeFailures: ["Lander freeze", "Communication blackout"],
        originalPosition: {x: 0, y: 20, z: 3.5},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    parts.push({
        name: "Polymer Sample Storage Receptacle",
        description: "Thermally insulated plastic container for storing core samples.",
        material: "plastic",
        function: "Preserves ice samples without chemical contamination.",
        assemblyOrder: 10,
        connections: ["Chassis"],
        failureEffect: "Sample degradation",
        cascadeFailures: ["Loss of scientific yield"],
        originalPosition: {x: 0, y: 21, z: 4.5},
        explodedPosition: {x: 0, y: 35, z: 10}
    });

    // Tires
    const wheels = [];
    const wheelPositions = [
        [-2.5, -0.5, 2.5], [2.5, -0.5, 2.5],
        [-2.5, -0.5, -2.5], [2.5, -0.5, -2.5]
    ];
    
    wheelPositions.forEach((pos, i) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(...pos);
        
        const strutGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.rotation.z = pos[0] > 0 ? Math.PI/4 : -Math.PI/4;
        strut.position.set(pos[0] > 0 ? -0.8 : 0.8, 0.5, 0);
        wheelGroup.add(strut);

        const tireGeo = new THREE.TorusGeometry(0.8, 0.35, 16, 48);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        
        const lugGeo = new THREE.BoxGeometry(0.15, 0.15, 0.8);
        for(let l=0; l<30; l++) {
            const angle = (l / 30) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0);
            lug.rotation.z = angle;
            tire.add(lug);
        }
        
        const rimGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        
        // Spoke logic for high-tech rim
        const spokeGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1);
        for(let s=0; s<5; s++) {
            const angle = (s/5)*Math.PI*2;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = angle;
            rim.add(spoke);
        }

        tire.add(rim);
        wheelGroup.add(tire);
        wheels.push(tire);
        landerGroup.add(wheelGroup);

        parts.push({
            name: `Off-Road Cometary Tire ${i+1}`,
            description: "High-traction low-gravity tire with complex spoke arrays and extruded rubber lugs.",
            material: "rubber/chrome/steel",
            function: "Provides robust mobility over jagged icy terrain.",
            assemblyOrder: 11 + i,
            connections: ["Suspension Strut"],
            failureEffect: "Immobility",
            cascadeFailures: ["Inability to reach sampling sites"],
            originalPosition: {x: pos[0], y: 18+pos[1], z: 5+pos[2]},
            explodedPosition: {x: pos[0]*3, y: 10, z: 5+pos[2]*3}
        });
    });

    // Articulated Drill Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 0.5, 3.5);
    
    const baseGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16);
    const armBase = new THREE.Mesh(baseGeo, steel);
    armGroup.add(armBase);

    const boomGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const boom = new THREE.Mesh(boomGeo, aluminum);
    boom.position.set(0, 1.5, 0);
    armGroup.add(boom);

    // Multi-segment for complexity
    const elbowGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const elbow = new THREE.Mesh(elbowGeo, chrome);
    elbow.position.set(0, 1.5, 0);
    boom.add(elbow);

    const forearmGeo = new THREE.CylinderGeometry(0.15, 0.15, 2);
    const forearm = new THREE.Mesh(forearmGeo, steel);
    forearm.position.set(0, 1.0, 0);
    elbow.add(forearm);

    const drillGeo = new THREE.CylinderGeometry(0.1, 0.3, 1.5, 16);
    const drill = new THREE.Mesh(drillGeo, darkSteel);
    drill.position.set(0, 1.0, 0);
    forearm.add(drill);

    landerGroup.add(armGroup);

    parts.push({
        name: "Articulated Ice Drill Arm Suite",
        description: "Multi-jointed boom with elbow articulation and high-speed coring drill.",
        material: "aluminum/steel/chrome",
        function: "Extracts pristine subsurface ice samples.",
        assemblyOrder: 15,
        connections: ["Chassis", "Drill Bit"],
        failureEffect: "Loss of sampling capability",
        cascadeFailures: ["Mission primary objective failure"],
        originalPosition: {x: 0, y: 19, z: 8.5},
        explodedPosition: {x: 0, y: 25, z: 30}
    });

    // Hydraulic Pistons for Drill
    const pistonGroup = new THREE.Group();
    const cylinderGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5);
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5);
    const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
    const rod = new THREE.Mesh(rodGeo, chrome);
    rod.position.y = 1.0;
    pistonGroup.add(cylinder);
    pistonGroup.add(rod);
    pistonGroup.position.set(0.6, 1.0, 3.5);
    pistonGroup.rotation.z = Math.PI / 8;
    landerGroup.add(pistonGroup);

    parts.push({
        name: "Drill Hydraulic Actuator",
        description: "High-pressure fluid piston driving the drill arm.",
        material: "darkSteel/chrome",
        function: "Provides mechanical force for boom articulation.",
        assemblyOrder: 16,
        connections: ["Arm Base", "Boom"],
        failureEffect: "Arm freezes in place",
        cascadeFailures: ["Drill stuck in surface"],
        originalPosition: {x: 0.6, y: 19.5, z: 8.5},
        explodedPosition: {x: 5, y: 20, z: 30}
    });

    // Comm Antenna
    const dishGeo = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI);
    const dish = new THREE.Mesh(dishGeo, copper);
    dish.position.set(-1.5, 3, -1.5);
    dish.rotation.x = -Math.PI / 4;
    landerGroup.add(dish);
    
    parts.push({
        name: "High-Gain Communication Dish",
        description: "Parabolic copper-coated antenna.",
        material: "copper",
        function: "Transmits high-res telemetry back to Earth.",
        assemblyOrder: 17,
        connections: ["Chassis"],
        failureEffect: "Signal loss",
        cascadeFailures: ["Data irretrievably lost"],
        originalPosition: {x: -1.5, y: 21.5, z: 3.5},
        explodedPosition: {x: -10, y: 35, z: 0}
    });

    group.add(landerGroup);

    // --- 6. ORBITAL PROBE ---
    const probeGroup = new THREE.Group();
    probeGroup.position.set(40, 20, 20);
    
    const probeBodyGeo = new THREE.OctahedronGeometry(1.5, 1); 
    const probeBody = new THREE.Mesh(probeBodyGeo, aluminum);
    probeGroup.add(probeBody);

    const solarGeo = new THREE.BoxGeometry(5, 0.1, 1.5);
    const solar1 = new THREE.Mesh(solarGeo, glass);
    solar1.position.set(3.5, 0, 0);
    
    const gridGeo = new THREE.BoxGeometry(4.8, 0.12, 1.3);
    const gridMat = new THREE.MeshStandardMaterial({color: 0x222222, wireframe: true});
    const grid1 = new THREE.Mesh(gridGeo, gridMat);
    solar1.add(grid1);

    const solar2 = new THREE.Mesh(solarGeo, glass);
    solar2.position.set(-3.5, 0, 0);
    const grid2 = new THREE.Mesh(gridGeo, gridMat);
    solar2.add(grid2);

    probeGroup.add(solar1);
    probeGroup.add(solar2);

    const sensorGeo = new THREE.ConeGeometry(0.5, 2, 16);
    const sensor = new THREE.Mesh(sensorGeo, steel);
    sensor.position.set(0, 0, 1.5);
    sensor.rotation.x = Math.PI / 2;
    probeGroup.add(sensor);

    const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
    const ring = new THREE.Mesh(ringGeo, carbonJetMat);
    ring.position.set(0, 0, 1.5);
    probeGroup.add(ring);

    group.add(probeGroup);

    parts.push({
        name: "Orbital Spectrometer Probe",
        description: "Autonomous satellite orbiting the coma with highly detailed mesh arrays.",
        material: "aluminum/glass",
        function: "Analyzes coma chemical composition from a safe distance.",
        assemblyOrder: 18,
        connections: ["Solar Arrays", "Sensor Suite"],
        failureEffect: "Loss of remote sensing",
        cascadeFailures: ["Incomplete chemical mapping"],
        originalPosition: {x: 40, y: 20, z: 20},
        explodedPosition: {x: 80, y: 40, z: 40}
    });

    parts.push({
        name: "Spectrometer Sensor Ring",
        description: "Emissive green laser scanner attached to the probe.",
        material: "carbonJetMat",
        function: "Actively sweeps the coma to detect diatomic carbon structures.",
        assemblyOrder: 19,
        connections: ["Orbital Probe Body"],
        failureEffect: "Scan calibration fails",
        cascadeFailures: ["Data artifact generation"],
        originalPosition: {x: 40, y: 20, z: 21.5},
        explodedPosition: {x: 80, y: 40, z: 50}
    });

    // --- DESCRIPTION & QUIZ ---
    const description = "A highly advanced, hyper-realistic deep space cometary nucleus simulation. Features a massive sublimating rocky/icy core, complex outgassing jets of glowing cyanogen and diatomic carbon, distinct ion and dust tails, an intricate multi-functional surface lander with hydraulic drilling equipment and off-road treads, and an orbiting spectrometer probe with glowing active laser scanners. All parts are mechanically articulated and fully animated to simulate realistic astrochemistry and engineering exploration. Built with precise geometry manipulation, custom emissive materials, and highly complex object hierarchies.";

    const quizQuestions = [
        {
            question: "What causes the comet's primary ion tail to point directly away from the sun?",
            options: ["Solar wind interactions", "Gravitational pull", "Internal pressure", "Magnetic anomalies"],
            correct: 0
        },
        {
            question: "Which component of the lander extracts pristine subsurface ice samples?",
            options: ["Off-Road Tire", "High-Gain Antenna", "Articulated Ice Drill Arm", "Orbital Spectrometer"],
            correct: 2
        },
        {
            question: "What material produces the glowing green signature in the comet's jet vents?",
            options: ["Water vapor", "Diatomic carbon", "Methane", "Iron oxide"],
            correct: 1
        },
        {
            question: "Why does the lander utilize extruded rubber lugs on its tires?",
            options: ["Aerodynamics", "Aesthetic appeal", "High-traction in low-gravity jagged terrain", "Thermal insulation"],
            correct: 2
        },
        {
            question: "What powers the surface lander in the deep space environment?",
            options: ["Solar arrays", "Radioisotope Thermoelectric Generator", "Chemical combustion", "Kinetic energy"],
            correct: 1
        }
    ];

    // --- ANIMATION ---
    const animate = (time, speed, meshes) => {
        const t = time * speed;

        // Coma pulsating
        comaMesh.scale.set(1 + Math.sin(t)*0.02, 1 + Math.cos(t*0.8)*0.02, 1 + Math.sin(t*1.2)*0.02);
        comaMat.opacity = 0.08 + Math.abs(Math.sin(t))*0.04;

        // Jet flickering
        jet1.scale.y = 1 + Math.random() * 0.15;
        carbonJetMat.opacity = 0.25 + Math.random() * 0.1;
        jet2.scale.y = 1 + Math.random() * 0.12;
        cyanoJetMat.opacity = 0.2 + Math.random() * 0.1;

        // Tail movement
        ionTail.rotation.z = Math.sin(t * 0.5) * 0.05;
        ionTailMat.opacity = 0.12 + Math.sin(t * 2.0) * 0.05;
        
        // Dust Particles animation
        dustParticles.forEach((p, index) => {
            p.position.z -= p.userData.speed;
            p.rotation.x += 0.05;
            p.rotation.y += 0.05;
            // Reset position if it goes too far
            if (p.position.z < -150) {
                p.position.set(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    0
                );
            }
        });

        // Nucleus slow rotation
        nucleusGroup.rotation.y = t * 0.02;
        nucleusGroup.rotation.x = t * 0.01;

        // Lander Drill Arm Animation (sine wave sweeping)
        armGroup.rotation.y = Math.sin(t) * 0.5;
        boom.rotation.x = Math.sin(t * 1.5) * 0.3;
        elbow.rotation.x = Math.sin(t * 2.0) * 0.4;
        drill.rotation.y = t * 15; // Spinning drill bit rapidly

        // Hydraulic Piston Sync
        rod.position.y = 1.0 + Math.sin(t * 1.5) * 0.3; 
        
        // Wheels rotating slowly as if creeping forward
        wheels.forEach(w => w.rotation.z = t * 0.8);

        // Radar dish scanning
        dish.rotation.z = t * 0.5;
        dish.rotation.y = Math.sin(t * 0.3) * 0.5;

        // Floodlight flicker
        floodlightMat.emissiveIntensity = 2.5 + Math.random() * 1.0;

        // Probe orbiting
        probeGroup.position.x = Math.cos(t * 0.3) * 55;
        probeGroup.position.z = Math.sin(t * 0.3) * 55;
        probeGroup.position.y = 20 + Math.sin(t * 0.5) * 10;
        probeGroup.rotation.y = -t * 0.3;
        probeGroup.rotation.z = Math.sin(t * 0.2) * 0.2;
        
        // Probe solar panels tracking
        solar1.rotation.x = t * 0.5;
        solar2.rotation.x = t * 0.5;

        // Scanner ring spin and pulse
        ring.rotation.z = t * 2.0;
        ring.scale.setScalar(1 + Math.sin(t * 4.0) * 0.2);
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCometaryComa() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
