import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "God-Tier Hubble Volume Mapper - A colossal, hyper-advanced supercomputer tracking and simulating the entire observable universe in real-time. Features a massive cosmic web containment sphere, dynamically articulated data-collection rings, hydraulic stabilization arrays, and quantum-entangled sensor dishes.";

    const meshes = {
        rings: [],
        nodes: [],
        filaments: [],
        dishes: [],
        pistons: [],
        boomArms: [],
        gears: [],
        holograms: []
    };

    // Custom advanced materials
    const cosmicNodeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        metalness: 0.9,
        roughness: 0.1
    });

    const filamentMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const coreHoloMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });

    // Helper: Add part
    function addPart(name, mesh, materialDesc, functionDesc, failEffect, pos, expPos) {
        mesh.position.copy(pos);
        group.add(mesh);
        parts.push({
            name: name,
            description: `Hyper-detailed component: ${name}`,
            material: materialDesc,
            function: functionDesc,
            assemblyOrder: parts.length + 1,
            connections: ['Core Structure', 'Energy Grid'],
            failureEffect: failEffect,
            cascadeFailures: ['Total System Desynchronization', 'Quantum Decoherence'],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: expPos.x, y: expPos.y, z: expPos.z }
        });
    }

    // ==========================================
    // 1. BASE AND PEDESTAL (Massive Lathe Geometries)
    // ==========================================
    const basePoints = [];
    for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const x = 50 - t * 40 + Math.sin(t * Math.PI * 10) * 2;
        const y = t * 20;
        basePoints.push(new THREE.Vector2(x, y));
    }
    const baseGeo = new THREE.LatheGeometry(basePoints, 128);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    addPart("Quantum Pedestal Base", baseMesh, "Dark Steel", "Provides structural anchoring for the massive gyroscopic arrays.", "Structural collapse.", new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, -100, 0));

    // Internal power core
    const powerCoreGeo = new THREE.CylinderGeometry(15, 15, 60, 64);
    const powerCoreMesh = new THREE.Mesh(powerCoreGeo, copper);
    addPart("Primary Energy Conduit", powerCoreMesh, "Copper", "Channels exawatts of power to the containment sphere.", "Core meltdown.", new THREE.Vector3(0, -20, 0), new THREE.Vector3(0, -150, 0));

    // Base Heat Sinks (Radial fins)
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const finGeo = new THREE.BoxGeometry(2, 30, 20);
        const finMesh = new THREE.Mesh(finGeo, aluminum);
        finMesh.position.set(Math.cos(angle) * 30, -35, Math.sin(angle) * 30);
        finMesh.lookAt(new THREE.Vector3(0, -35, 0));
        group.add(finMesh);
        parts.push({
            name: `Base Heat Sink ${i}`,
            description: "Dissipates thermal energy from the quantum calculations.",
            material: "Aluminum",
            function: "Thermal regulation.",
            assemblyOrder: parts.length + 1,
            connections: ['Pedestal'],
            failureEffect: "Overheating.",
            cascadeFailures: ['Core meltdown'],
            originalPosition: { x: finMesh.position.x, y: finMesh.position.y, z: finMesh.position.z },
            explodedPosition: { x: finMesh.position.x * 2, y: finMesh.position.y - 20, z: finMesh.position.z * 2 }
        });
    }

    // ==========================================
    // 2. THE CONTAINMENT SPHERE (The Cosmos)
    // ==========================================
    const sphereRadius = 80;
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 8); // Extremely high poly
    const sphereMesh = new THREE.Mesh(sphereGeo, coreHoloMaterial);
    addPart("Hubble Containment Sphere", sphereMesh, "Holo-Glass", "Contains the localized simulation of the cosmic web.", "Simulation breach.", new THREE.Vector3(0, 70, 0), new THREE.Vector3(0, 200, 0));

    // Inner wireframe sphere
    const innerSphereGeo = new THREE.IcosahedronGeometry(sphereRadius * 0.98, 4);
    const innerSphereMesh = new THREE.Mesh(innerSphereGeo, new THREE.MeshStandardMaterial({ color: 0x000033, wireframe: true, transparent: true, opacity: 0.3 }));
    group.add(innerSphereMesh);
    innerSphereMesh.position.set(0, 70, 0);

    // ==========================================
    // 3. COSMIC WEB SIMULATION (Nodes & Filaments)
    // ==========================================
    const numNodes = 300;
    const nodesPositions = [];
    const nodeGroup = new THREE.Group();
    nodeGroup.position.set(0, 70, 0);
    group.add(nodeGroup);
    meshes.holograms.push(nodeGroup); // For rotation

    const nodeGeo = new THREE.IcosahedronGeometry(1.5, 2);
    
    // Generate nodes using procedural clustering
    for (let i = 0; i < numNodes; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * (sphereRadius * 0.9);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        nodesPositions.push(new THREE.Vector3(x, y, z));

        const node = new THREE.Mesh(nodeGeo, cosmicNodeMaterial);
        node.position.set(x, y, z);
        nodeGroup.add(node);
        meshes.nodes.push(node);
    }

    // Generate filaments (Dark Matter web)
    let filamentCount = 0;
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const dist = nodesPositions[i].distanceTo(nodesPositions[j]);
            if (dist > 5 && dist < 25) { 
                filamentCount++;
                if (filamentCount > 600) break;

                const curve = new THREE.LineCurve3(nodesPositions[i], nodesPositions[j]);
                const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.3, 5, false);
                const tube = new THREE.Mesh(tubeGeo, filamentMaterial);
                nodeGroup.add(tube);
                meshes.filaments.push(tube);
            }
        }
    }

    parts.push({
        name: "Cosmic Web Projection Matrix",
        description: "Projects thousands of dark matter filaments and galaxy clusters in real-time.",
        material: "Photonic Construct",
        function: "Simulates large-scale universal structure.",
        assemblyOrder: parts.length + 1,
        connections: ['Containment Sphere'],
        failureEffect: "Data loss.",
        cascadeFailures: ['Simulation collapse'],
        originalPosition: { x: 0, y: 70, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });


    // ==========================================
    // 4. ORBITAL SENSOR RINGS
    // ==========================================
    const ringRadii = [110, 130, 150];
    const ringAxes = [
        new THREE.Vector3(1, 0.5, 0).normalize(),
        new THREE.Vector3(0, 1, 0.5).normalize(),
        new THREE.Vector3(0.5, 0, 1).normalize()
    ];

    for (let r = 0; r < ringRadii.length; r++) {
        const rGroup = new THREE.Group();
        rGroup.position.set(0, 70, 0);
        group.add(rGroup);
        
        meshes.rings.push({ group: rGroup, axis: ringAxes[r], speed: 0.005 + (r * 0.002) });

        const ringGeo = new THREE.TorusGeometry(ringRadii[r], 4, 32, 200);
        const ringMesh = new THREE.Mesh(ringGeo, steel);
        
        ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), ringAxes[r]);
        rGroup.add(ringMesh);

        parts.push({
            name: `Data Ring Alpha-${r}`,
            description: "Massive orbital track for quantum sensors.",
            material: "Steel",
            function: "High-speed data telemetry.",
            assemblyOrder: parts.length + 1,
            connections: ['Central Gravity Anchor'],
            failureEffect: "Ring collision.",
            cascadeFailures: ['Complete structural annihilation'],
            originalPosition: { x: 0, y: 70, z: 0 },
            explodedPosition: { x: ringAxes[r].x * 200, y: 70 + ringAxes[r].y * 200, z: ringAxes[r].z * 200 }
        });

        for(let c = 0; c < 16; c++) {
            const angle = (c / 16) * Math.PI * 2;
            const clampGeo = new THREE.BoxGeometry(12, 12, 12);
            const clamp = new THREE.Mesh(clampGeo, chrome);
            
            const x = Math.cos(angle) * ringRadii[r];
            const y = Math.sin(angle) * ringRadii[r];
            
            clamp.position.set(x, y, 0);
            clamp.lookAt(new THREE.Vector3(0,0,0));
            
            const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), ringAxes[r]);
            clamp.position.applyQuaternion(q);
            clamp.quaternion.multiplyQuaternions(q, clamp.quaternion);
            
            rGroup.add(clamp);
        }

        for(let d = 0; d < 4; d++) {
            const angle = (d / 4) * Math.PI * 2 + (r * Math.PI/4);
            const dishGroup = new THREE.Group();
            
            const dishPoints = [];
            for (let i = 0; i <= 20; i++) {
                dishPoints.push(new THREE.Vector2(i, 0.1 * i * i));
            }
            const dishGeo = new THREE.LatheGeometry(dishPoints, 64);
            const dish = new THREE.Mesh(dishGeo, aluminum);
            dish.rotation.x = Math.PI / 2;
            dishGroup.add(dish);

            const antennaGeo = new THREE.CylinderGeometry(0.5, 0.5, 25, 16);
            const antenna = new THREE.Mesh(antennaGeo, copper);
            antenna.position.set(0, 0, 12.5);
            antenna.rotation.x = Math.PI / 2;
            dishGroup.add(antenna);

            const dishBaseGeo = new THREE.CylinderGeometry(4, 4, 10, 32);
            const dishBase = new THREE.Mesh(dishBaseGeo, darkSteel);
            dishBase.position.set(0, 0, -5);
            dishBase.rotation.x = Math.PI / 2;
            dishGroup.add(dishBase);

            const dx = Math.cos(angle) * (ringRadii[r] + 15);
            const dy = Math.sin(angle) * (ringRadii[r] + 15);
            
            dishGroup.position.set(dx, dy, 0);
            dishGroup.lookAt(new THREE.Vector3(0,0,0));
            dishGroup.rotateX(Math.PI);

            const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), ringAxes[r]);
            dishGroup.position.applyQuaternion(q);
            dishGroup.quaternion.multiplyQuaternions(q, dishGroup.quaternion);

            rGroup.add(dishGroup);
            meshes.dishes.push(dishGroup);

            parts.push({
                name: `Telescopic Sensor Array ${r}-${d}`,
                description: "Captures microwave background radiation anomalies.",
                material: "Aluminum & Copper",
                function: "Data ingestion.",
                assemblyOrder: parts.length + 1,
                connections: [`Data Ring Alpha-${r}`],
                failureEffect: "Blind spots in mapping.",
                cascadeFailures: [],
                originalPosition: { x: dishGroup.position.x, y: 70 + dishGroup.position.y, z: dishGroup.position.z },
                explodedPosition: { x: dishGroup.position.x * 2.5, y: 70 + dishGroup.position.y * 2.5, z: dishGroup.position.z * 2.5 }
            });
        }
    }

    // ==========================================
    // 5. HYDRAULIC STABILIZATION PISTONS
    // ==========================================
    const numPistons = 8;
    for (let i = 0; i < numPistons; i++) {
        const angle = (i / numPistons) * Math.PI * 2;
        
        const baseX = Math.cos(angle) * 60;
        const baseY = -40;
        const baseZ = Math.sin(angle) * 60;
        
        const targetX = Math.cos(angle) * (sphereRadius - 10);
        const targetY = 70 - (sphereRadius * 0.5);
        const targetZ = Math.sin(angle) * (sphereRadius - 10);

        const startPt = new THREE.Vector3(baseX, baseY, baseZ);
        const endPt = new THREE.Vector3(targetX, targetY, targetZ);
        
        const distance = startPt.distanceTo(endPt);

        const pistonGroup = new THREE.Group();
        pistonGroup.position.copy(startPt);
        pistonGroup.lookAt(endPt);

        const cylGeo = new THREE.CylinderGeometry(5, 5, distance * 0.6, 32);
        const cyl = new THREE.Mesh(cylGeo, steel);
        cyl.rotation.x = Math.PI / 2;
        cyl.position.z = distance * 0.3;
        pistonGroup.add(cyl);

        const rodGeo = new THREE.CylinderGeometry(2.5, 2.5, distance * 0.6, 32);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.rotation.x = Math.PI / 2;
        rod.position.z = distance * 0.7;
        pistonGroup.add(rod);

        meshes.pistons.push({
            group: pistonGroup,
            rod: rod,
            baseDistance: distance
        });

        group.add(pistonGroup);

        parts.push({
            name: `Hydraulic Stabilization Piston ${i}`,
            description: "Dampens micro-vibrations from planetary rotation.",
            material: "Steel and Chrome",
            function: "Structural support.",
            assemblyOrder: parts.length + 1,
            connections: ['Pedestal', 'Containment Sphere'],
            failureEffect: "Vibrational tearing.",
            cascadeFailures: ['Sphere rupture'],
            originalPosition: { x: baseX, y: baseY, z: baseZ },
            explodedPosition: { x: baseX * 2, y: baseY - 50, z: baseZ * 2 }
        });
    }


    // ==========================================
    // 6. OPERATOR CABIN / CONTROL CENTER
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -10, 80);
    
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-20, 0);
    cabinShape.lineTo(20, 0);
    cabinShape.lineTo(25, 15);
    cabinShape.lineTo(15, 30);
    cabinShape.lineTo(-15, 30);
    cabinShape.lineTo(-25, 15);
    cabinShape.lineTo(-20, 0);

    const extrudeSettings = { depth: 30, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, extrudeSettings);
    const cabinMesh = new THREE.Mesh(cabinGeo, plastic);
    cabinMesh.position.set(0, 0, -15);
    cabinGroup.add(cabinMesh);

    const windowGeo = new THREE.PlaneGeometry(35, 18);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 15, 15.5);
    windowMesh.rotation.x = -Math.PI / 8;
    cabinGroup.add(windowMesh);

    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), screenMaterial);
        screen.position.set(-10 + i*10, 12, 10);
        screen.rotation.x = -Math.PI / 4;
        cabinGroup.add(screen);
    }

    const walkwayGeo = new THREE.BoxGeometry(10, 2, 40);
    const walkway = new THREE.Mesh(walkwayGeo, steel);
    walkway.position.set(0, 0, -20);
    cabinGroup.add(walkway);

    group.add(cabinGroup);

    parts.push({
        name: `Primary Operator Cabin`,
        description: "Life-supported control deck with neuro-link interfaces.",
        material: "Plastic & Tinted Glass",
        function: "Human oversight.",
        assemblyOrder: parts.length + 1,
        connections: ['Pedestal Walkway'],
        failureEffect: "Loss of manual control.",
        cascadeFailures: [],
        originalPosition: { x: cabinGroup.position.x, y: cabinGroup.position.y, z: cabinGroup.position.z },
        explodedPosition: { x: cabinGroup.position.x, y: cabinGroup.position.y, z: cabinGroup.position.z + 100 }
    });


    // ==========================================
    // 7. INTRICATE WIRING AND TUBING
    // ==========================================
    for(let t=0; t<40; t++) {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = angle1 + (Math.random() - 0.5);
        
        const r1 = 30 + Math.random() * 20;
        const r2 = 15;

        const p1 = new THREE.Vector3(Math.cos(angle1)*r1, -50 + Math.random()*20, Math.sin(angle1)*r1);
        const p2 = new THREE.Vector3(Math.cos(angle2)*r2, -30 + Math.random()*20, Math.sin(angle2)*r2);
        
        const cp1 = new THREE.Vector3(p1.x, p1.y + 20, p1.z);
        const cp2 = new THREE.Vector3(p2.x, p2.y - 20, p2.z);

        const curve = new THREE.CubicBezierCurve3(p1, cp1, cp2, p2);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.8 + Math.random(), 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
        
        group.add(tubeMesh);

        if (t < 5) {
            parts.push({
                name: `Coolant Line ${t}`,
                description: "Cryogenic liquid helium transport.",
                material: "Rubber",
                function: "Prevents quantum processor decoherence.",
                assemblyOrder: parts.length + 1,
                connections: ['Base', 'Core'],
                failureEffect: "Thermal throttling.",
                cascadeFailures: [],
                originalPosition: { x: p1.x, y: p1.y, z: p1.z },
                explodedPosition: { x: p1.x * 1.5, y: p1.y - 30, z: p1.z * 1.5 }
            });
        }
    }

    // ==========================================
    // 8. TIRE TREADS (Mobile Gantry Bases)
    // ==========================================
    for (let c = 0; c < 4; c++) {
        const angle = (c / 4) * Math.PI * 2 + Math.PI/4;
        const wheelRadius = 15;
        const wheelTube = 6;
        
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(Math.cos(angle) * 70, -60, Math.sin(angle) * 70);
        
        const tireGeo = new THREE.TorusGeometry(wheelRadius, wheelTube, 32, 100);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = angle;
        wheelGroup.add(tire);

        const numLugs = 60;
        for (let l = 0; l < numLugs; l++) {
            const lugAngle = (l / numLugs) * Math.PI * 2;
            const lugGeo = new THREE.BoxGeometry(wheelTube * 2.5, 2, 4);
            const lug = new THREE.Mesh(lugGeo, rubber);
            
            lug.position.set(Math.cos(lugAngle) * (wheelRadius + wheelTube), Math.sin(lugAngle) * (wheelRadius + wheelTube), 0);
            lug.rotation.z = lugAngle;
            lug.applyMatrix4(new THREE.Matrix4().makeRotationY(angle));
            
            wheelGroup.add(lug);
        }

        const rimGeo = new THREE.CylinderGeometry(wheelRadius-2, wheelRadius-2, wheelTube*2.2, 32);
        const rim = new THREE.Mesh(rimGeo, steel);
        rim.rotation.x = Math.PI / 2;
        rim.rotation.z = angle;
        wheelGroup.add(rim);

        group.add(wheelGroup);
        meshes.gears.push(wheelGroup); 

        parts.push({
            name: `Super-Heavy Crawler Wheel ${c}`,
            description: "Allows repositioning of the observatory across tectonic plates.",
            material: "Rubber & Steel",
            function: "Mobility.",
            assemblyOrder: parts.length + 1,
            connections: ['Base Gantry'],
            failureEffect: "Immobility.",
            cascadeFailures: [],
            originalPosition: { x: wheelGroup.position.x, y: wheelGroup.position.y, z: wheelGroup.position.z },
            explodedPosition: { x: wheelGroup.position.x * 1.8, y: wheelGroup.position.y, z: wheelGroup.position.z * 1.8 }
        });
    }

    // ==========================================
    // 9. ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshesObj = meshes) {
        meshesObj.rings.forEach(ringData => {
            const axis = ringData.axis;
            ringData.group.rotateOnAxis(axis, ringData.speed * speed);
        });

        meshesObj.holograms.forEach(holo => {
            holo.rotation.y += 0.001 * speed;
            holo.rotation.x += 0.0005 * speed;
        });

        meshesObj.nodes.forEach((node, idx) => {
            const scale = 1 + Math.sin(time * 0.002 * speed + idx) * 0.3;
            node.scale.set(scale, scale, scale);
        });

        meshesObj.dishes.forEach((dish, idx) => {
            if (dish.children[1]) {
                dish.children[1].rotation.y += 0.05 * speed;
            }
        });

        meshesObj.pistons.forEach((piston, idx) => {
            const extension = Math.sin(time * 0.001 * speed + idx) * 10;
            piston.rod.position.z = (piston.baseDistance * 0.7) + extension;
        });

        meshesObj.gears.forEach(wheel => {
            wheel.children[0].rotation.z += 0.01 * speed; 
            wheel.children[wheel.children.length - 1].rotation.y += 0.01 * speed; 
        });
    }

    // ==========================================
    // 10. EXTREME PHD QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "Regarding the growth of large-scale structure, the linear growth factor D(a) in a matter-dominated universe scales as 'a'. Which of the following best describes the redshift space distortion (RSD) parameter β in terms of the linear bias b and the logarithmic growth rate f = d(ln D)/d(ln a)?",
            options: [
                "β = f * b",
                "β = f / b",
                "β = b / f",
                "β = f + b"
            ],
            correctAnswer: 1,
            explanation: "In linear perturbation theory, the redshift space distortion parameter β relates the peculiar velocity field to the density field and is defined as the ratio of the logarithmic growth rate to the linear galaxy bias (f / b)."
        },
        {
            question: "In the context of baryon acoustic oscillations (BAO), the comoving sound horizon at the drag epoch, r_d, serves as a standard ruler. Which cosmological parameters most dominantly determine the physical size of r_d prior to recombination?",
            options: [
                "The dark energy equation of state w and the Hubble constant H0.",
                "The tensor-to-scalar ratio r and the scalar spectral index n_s.",
                "The physical baryon density (Ω_b h^2) and physical cold dark matter density (Ω_c h^2).",
                "The optical depth to reionization τ and the sum of neutrino masses Σm_ν."
            ],
            correctAnswer: 2,
            explanation: "The sound horizon is determined by the integral of the sound speed of the baryon-photon fluid from the Big Bang to the drag epoch, which depends critically on the matter and baryon densities."
        },
        {
            question: "The thermal Sunyaev-Zel'dovich (SZ) effect arises from inverse Compton scattering of CMB photons by hot intracluster gas. At what frequency (in the non-relativistic limit) does the change in CMB intensity vanish, crossing from a decrement to an increment?",
            options: [
                "~ 143 GHz",
                "~ 218 GHz",
                "~ 353 GHz",
                "~ 545 GHz"
            ],
            correctAnswer: 1,
            explanation: "The thermal SZ effect causes a decrement in the CMB intensity at frequencies below ~218 GHz and an increment above it, known as the SZ null frequency."
        },
        {
            question: "In Halo Occupation Distribution (HOD) modeling, how is the mean number of satellite galaxies <N_sat> residing in a dark matter halo of mass M typically parameterized?",
            options: [
                "As an exponential cutoff function at low masses.",
                "As a Gaussian distribution centered on a characteristic mass M*.",
                "As a power law of the form ((M - M_0) / M_1)^α for M > M_0.",
                "As a logarithmic function of the virial radius."
            ],
            correctAnswer: 2,
            explanation: "The standard HOD parameterization for satellites assumes a power-law form above a threshold mass M_0, dictated by the parameter M_1 (mass to host one satellite) and the power-law index α."
        },
        {
            question: "The matter power spectrum P(k) exhibits a turnover scale at k_eq, corresponding to the horizon size at matter-radiation equality. For small-scale modes entering the horizon during the radiation-dominated era (k > k_eq), what is the asymptotic behavior of the linear power spectrum?",
            options: [
                "P(k) ∝ k^1",
                "P(k) ∝ k^-2",
                "P(k) ∝ k^-3 (ln k)^2",
                "P(k) ∝ k^-4"
            ],
            correctAnswer: 2,
            explanation: "Modes that enter the horizon during radiation domination suffer the Meszaros effect (stagnation of growth). This modifies the primordial Harrison-Zel'dovich spectrum, yielding an asymptotic behavior of k^-3 (ln k)^2 at high k."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
