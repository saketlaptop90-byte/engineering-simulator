import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatables = [];
    const particleSystems = [];
    
    // ==========================================
    // LORE & DESCRIPTION
    // ==========================================
    const description = "The Ultra God Tier White Hole Emitter. A phenomenally advanced construct that harnesses a mathematically theoretical 'time-reversed' black hole. Unlike a black hole that consumes all, this singularity continuously vomits matter, plasma, and blindingly bright radiation from an inaccessible past infinity. The structure surrounding it is a megascale quantum-containment framework and energy capture array designed to siphon infinite energy while preventing the expanding spacetime metric from shredding the local galaxy.";

    // ==========================================
    // CUSTOM MATERIALS
    // ==========================================
    const blindingWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10,
        transparent: true,
        opacity: 0.95,
        roughness: 0,
        metalness: 0
    });

    const hyperBlueEmissive = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x00aaff,
        emissiveIntensity: 8,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const plasmaOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.6
    });

    const darkMatterShell = new THREE.MeshStandardMaterial({
        color: 0x050505,
        emissive: 0x020202,
        roughness: 0.9,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7
    });

    const structuralSteel = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.6,
        metalness: 0.8
    });

    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 1.0
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3
    });

    const warningRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 4
    });

    // ==========================================
    // COMPONENT 1: THE EVENT HORIZON & CORE
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // Inner Singularity (Blindingly bright)
    const singularityGeo = new THREE.SphereGeometry(15, 64, 64);
    const singularity = new THREE.Mesh(singularityGeo, blindingWhite);
    coreGroup.add(singularity);
    
    // Inner distortion shell
    const distortionGeo1 = new THREE.IcosahedronGeometry(17, 3);
    const distortion1 = new THREE.Mesh(distortionGeo1, hyperBlueEmissive);
    coreGroup.add(distortion1);
    animatables.push({ mesh: distortion1, speed: 0.05, axis: 'y' });
    animatables.push({ mesh: distortion1, speed: 0.03, axis: 'z' });

    // Outer distortion shell
    const distortionGeo2 = new THREE.IcosahedronGeometry(20, 2);
    const distortion2 = new THREE.Mesh(distortionGeo2, plasmaOrange);
    distortion2.material.wireframe = true;
    coreGroup.add(distortion2);
    animatables.push({ mesh: distortion2, speed: -0.04, axis: 'x' });
    animatables.push({ mesh: distortion2, speed: -0.02, axis: 'y' });

    // Ergosphere Torus Knot
    const ergoGeo = new THREE.TorusKnotGeometry(22, 1.5, 256, 32, 3, 7);
    const ergosphere = new THREE.Mesh(ergoGeo, neonCyan);
    coreGroup.add(ergosphere);
    animatables.push({ mesh: ergosphere, speed: 0.08, axis: 'z' });
    animatables.push({ mesh: ergosphere, speed: 0.01, axis: 'x' });

    group.add(coreGroup);

    // ==========================================
    // COMPONENT 2: CONTAINMENT RINGS & GRAVITY STABILIZERS
    // ==========================================
    const ringGroup = new THREE.Group();
    const ringCount = 4;
    const ringRadius = 45;
    
    for (let i = 0; i < ringCount; i++) {
        const ring = new THREE.Group();
        
        // Main Torus
        const tGeo = new THREE.TorusGeometry(ringRadius, 3, 64, 128);
        const tMesh = new THREE.Mesh(tGeo, darkSteel);
        ring.add(tMesh);
        
        // Add lugs and magnetic clamps around the torus
        const clampCount = 24;
        for (let j = 0; j < clampCount; j++) {
            const angle = (j / clampCount) * Math.PI * 2;
            
            const clampGeo = new THREE.BoxGeometry(8, 4, 10);
            const clamp = new THREE.Mesh(clampGeo, steel);
            clamp.position.x = Math.cos(angle) * ringRadius;
            clamp.position.y = Math.sin(angle) * ringRadius;
            clamp.rotation.z = angle;
            
            // Add emissive nodes to clamps
            const nodeGeo = new THREE.SphereGeometry(1.5, 16, 16);
            const node = new THREE.Mesh(nodeGeo, warningRed);
            node.position.z = 5;
            clamp.add(node);
            
            ring.add(clamp);
        }

        // Inner glowing tracks
        const trackGeo = new THREE.TorusGeometry(ringRadius - 2.5, 0.5, 16, 128);
        const track = new THREE.Mesh(trackGeo, neonCyan);
        ring.add(track);

        // Rotation positioning
        if (i === 1) ring.rotation.x = Math.PI / 2;
        if (i === 2) ring.rotation.y = Math.PI / 2;
        if (i === 3) {
            ring.rotation.x = Math.PI / 4;
            ring.rotation.y = Math.PI / 4;
        }

        ringGroup.add(ring);
        animatables.push({ mesh: ring, speed: 0.01 * (i % 2 === 0 ? 1 : -1), axis: 'z' });
    }
    
    group.add(ringGroup);

    // ==========================================
    // COMPONENT 3: MEGA ENERGY CAPTURE PYLONS
    // ==========================================
    const pylonGroup = new THREE.Group();
    const pylonCount = 8;
    const pylonDistance = 70;

    // Define a complex Lathe for the pylon main body
    const pylonPoints = [];
    pylonPoints.push(new THREE.Vector2(0, 0));
    pylonPoints.push(new THREE.Vector2(10, 0));
    pylonPoints.push(new THREE.Vector2(8, 5));
    pylonPoints.push(new THREE.Vector2(8, 20));
    pylonPoints.push(new THREE.Vector2(12, 25));
    pylonPoints.push(new THREE.Vector2(12, 35));
    pylonPoints.push(new THREE.Vector2(6, 40));
    pylonPoints.push(new THREE.Vector2(6, 60));
    pylonPoints.push(new THREE.Vector2(15, 65));
    pylonPoints.push(new THREE.Vector2(20, 70));
    pylonPoints.push(new THREE.Vector2(2, 70));
    pylonPoints.push(new THREE.Vector2(0, 70));

    const pylonGeo = new THREE.LatheGeometry(pylonPoints, 32);

    // Define extruded heat sinks
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(20, 0);
    finShape.lineTo(15, 60);
    finShape.lineTo(0, 60);
    finShape.lineTo(0, 0);

    const finExtrudeSettings = {
        depth: 1,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);

    for (let i = 0; i < pylonCount; i++) {
        const singlePylon = new THREE.Group();
        
        // Pylon Body
        const body = new THREE.Mesh(pylonGeo, chrome);
        
        // Add glowing core cylinder inside the pylon
        const pCoreGeo = new THREE.CylinderGeometry(4, 4, 68, 16);
        const pCore = new THREE.Mesh(pCoreGeo, hyperBlueEmissive);
        pCore.position.y = 35;
        body.add(pCore);

        // Add Heat Sink Fins around the pylon
        const finCount = 6;
        for (let f = 0; f < finCount; f++) {
            const fAngle = (f / finCount) * Math.PI * 2;
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = 5;
            fin.rotation.y = fAngle;
            // Shift outward to align with pylon edge
            fin.position.x = Math.cos(fAngle) * 8;
            fin.position.z = Math.sin(fAngle) * 8;
            body.add(fin);
        }

        // Energy receptor dish at the top
        const dishGeo = new THREE.CylinderGeometry(25, 10, 5, 32);
        const dish = new THREE.Mesh(dishGeo, goldFoil);
        dish.position.y = 72;
        body.add(dish);

        // Floating concentrator above the dish
        const conGeo = new THREE.OctahedronGeometry(6, 0);
        const con = new THREE.Mesh(conGeo, blindingWhite);
        con.position.y = 85;
        body.add(con);
        animatables.push({ mesh: con, speed: 0.05, axis: 'y' }); // Rotates
        animatables.push({ mesh: con, isHover: true, baseHoverY: 85, hoverSpeed: 2, hoverAmp: 3 });

        // Position Pylon radially
        const pAngle = (i / pylonCount) * Math.PI * 2;
        singlePylon.position.x = Math.cos(pAngle) * pylonDistance;
        singlePylon.position.z = Math.sin(pAngle) * pylonDistance;
        
        // Orient pylon so its dish points at the core (origin)
        singlePylon.lookAt(new THREE.Vector3(0, 0, 0));
        singlePylon.rotateX(Math.PI / 2); // Adjust so the top faces the core

        pylonGroup.add(singlePylon);
    }

    group.add(pylonGroup);
    // Rotate the entire pylon array slowly
    animatables.push({ mesh: pylonGroup, speed: -0.005, axis: 'y' });
    animatables.push({ mesh: pylonGroup, speed: -0.002, axis: 'z' });

    // ==========================================
    // COMPONENT 4: PLASMA CONDUITS (TUBES)
    // ==========================================
    const conduitGroup = new THREE.Group();
    for (let i = 0; i < pylonCount; i++) {
        const pAngle = (i / pylonCount) * Math.PI * 2;
        const startX = Math.cos(pAngle) * pylonDistance;
        const startZ = Math.sin(pAngle) * pylonDistance;
        
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX, 0, startZ),
            new THREE.Vector3(startX * 0.8, 30, startZ * 0.8),
            new THREE.Vector3(startX * 0.5, 45, startZ * 0.5),
            new THREE.Vector3(0, ringRadius, 0)
        ]);
        
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 2, 16, false);
        const tube = new THREE.Mesh(tubeGeo, copper);
        
        const innerTubeGeo = new THREE.TubeGeometry(curve, 64, 1.2, 16, false);
        const innerTube = new THREE.Mesh(innerTubeGeo, plasmaOrange);
        
        conduitGroup.add(tube);
        conduitGroup.add(innerTube);
    }
    group.add(conduitGroup);

    // ==========================================
    // COMPONENT 5: OPERATOR CITADEL & OBSERVATION DECK
    // ==========================================
    const citadelGroup = new THREE.Group();
    
    // Main Hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, 30);
    hullShape.lineTo(20, 10);
    hullShape.lineTo(20, -10);
    hullShape.lineTo(10, -20);
    hullShape.lineTo(-10, -20);
    hullShape.lineTo(-20, -10);
    hullShape.lineTo(-20, 10);
    hullShape.lineTo(0, 30);

    const hullExtrude = {
        depth: 40,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 2,
        bevelSize: 2,
        bevelThickness: 2
    };

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, hullExtrude);
    const hull = new THREE.Mesh(hullGeo, structuralSteel);
    hull.position.z = -20;
    citadelGroup.add(hull);

    // Observation Window
    const windowGeo = new THREE.SphereGeometry(15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const obsWindow = new THREE.Mesh(windowGeo, tinted);
    obsWindow.rotation.x = Math.PI / 2;
    obsWindow.position.y = 15;
    obsWindow.position.z = 20;
    citadelGroup.add(obsWindow);

    // Radar & Communication Dish
    const commGroup = new THREE.Group();
    const commDishGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(5, -2),
        new THREE.Vector2(10, -5),
        new THREE.Vector2(12, -8)
    ], 32);
    const commDish = new THREE.Mesh(commDishGeo, chrome);
    commGroup.add(commDish);
    
    const commAntennaGeo = new THREE.CylinderGeometry(0.5, 0.5, 15, 8);
    const commAntenna = new THREE.Mesh(commAntennaGeo, warningRed);
    commAntenna.position.y = -7.5;
    commGroup.add(commAntenna);

    commGroup.position.set(0, 35, 0);
    citadelGroup.add(commGroup);
    animatables.push({ mesh: commGroup, speed: 0.02, axis: 'y' });

    citadelGroup.position.set(0, 0, 200);
    citadelGroup.lookAt(new THREE.Vector3(0, 0, 0));
    group.add(citadelGroup);

    // ==========================================
    // COMPONENT 6: MASSIVE EJECTA PARTICLE SYSTEM
    // ==========================================
    const particleCount = 5000;
    const particleGeo = new THREE.TetrahedronGeometry(0.5, 0);
    const particleMesh = new THREE.InstancedMesh(particleGeo, blindingWhite, particleCount);
    
    const dummy = new THREE.Object3D();
    const particleData = []; 

    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 5 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        dummy.position.set(x, y, z);
        
        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        const velocity = new THREE.Vector3(x, y, z).normalize().multiplyScalar(Math.random() * 2 + 0.5);
        
        dummy.updateMatrix();
        particleMesh.setMatrixAt(i, dummy.matrix);
        
        particleData.push({
            position: new THREE.Vector3(x, y, z),
            velocity: velocity,
            rotationSpeed: new THREE.Vector3(Math.random()*0.1, Math.random()*0.1, Math.random()*0.1),
            lifespan: Math.random() * 100,
            age: 0
        });
    }
    
    group.add(particleMesh);
    particleSystems.push({ mesh: particleMesh, data: particleData, dummy: dummy });

    // ==========================================
    // PARTS ARRAY METADATA
    // ==========================================
    parts.push(
        {
            name: "Central Singularity",
            description: "The time-reversed event horizon, completely blinding and radiating infinite mass-energy.",
            material: "blindingWhite",
            function: "Outputs the infinite energy of a past universe via topological inversion.",
            assemblyOrder: 1,
            connections: ["Spacetime Continuum", "Distortion Shells"],
            failureEffect: "Instantaneous expansion of the localized spacetime, destroying the entire solar system.",
            cascadeFailures: ["Containment Rupture", "False Vacuum Decay"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 0 }
        },
        {
            name: "Inner Distortion Shell",
            description: "A highly energised geometric construct locking the ergosphere in place.",
            material: "hyperBlueEmissive",
            function: "Prevents frame-dragging from tearing apart the orbital energy siphons.",
            assemblyOrder: 2,
            connections: ["Central Singularity", "Outer Distortion Shell"],
            failureEffect: "Severe spatial shearing, causing time dilation loops for nearby personnel.",
            cascadeFailures: ["Temporal Paradoxes"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -30, y: 30, z: -30 }
        },
        {
            name: "Ergosphere Torus Knot",
            description: "Mathematical manifestation of the rotating white hole's boundary.",
            material: "neonCyan",
            function: "Channels the extreme rotational energy into the containment rings.",
            assemblyOrder: 3,
            connections: ["Containment Rings"],
            failureEffect: "Ergosphere detachment, hurling objects at superluminal speeds.",
            cascadeFailures: ["Pylon Destruction"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 50, y: -20, z: 50 }
        },
        {
            name: "Gravitational Containment Ring Alpha",
            description: "One of the massive rotating rings maintaining the macro-structure of the emitter.",
            material: "darkSteel",
            function: "Projects anti-gravity fields to counterbalance the immense repulsive forces of the white hole.",
            assemblyOrder: 4,
            connections: ["Ergosphere", "Plasma Conduits"],
            failureEffect: "Catastrophic structural collapse.",
            cascadeFailures: ["System-wide failure"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 100, y: 0, z: 0 }
        },
        {
            name: "Energy Capture Pylon Array",
            description: "Array of 8 massive pillars featuring gold-foil receptors and massive cooling fins.",
            material: "chrome/aluminum",
            function: "Siphons the raw gamma radiation and kinetic matter, converting it to useful cosmic energy.",
            assemblyOrder: 5,
            connections: ["Plasma Conduits", "Outer Shells"],
            failureEffect: "Energy overload leading to core meltdown.",
            cascadeFailures: ["Vaporization of local space"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 150, z: 0 }
        },
        {
            name: "Plasma Conduit Tubes",
            description: "Thick curved piping connecting pylons to the core.",
            material: "copper/plasmaOrange",
            function: "Transports superheated stellar matter.",
            assemblyOrder: 6,
            connections: ["Pylons", "Containment Rings"],
            failureEffect: "Plasma leakage.",
            cascadeFailures: ["Hull fires", "Radiation poisoning"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -100, z: 0 }
        },
        {
            name: "Operator Citadel",
            description: "The highly shielded command center located kilometers away from the singularity.",
            material: "structuralSteel/tinted",
            function: "Houses the scientists and engineers monitoring the flow of infinite time-reversed matter.",
            assemblyOrder: 7,
            connections: ["Remote telemetry arrays"],
            failureEffect: "Loss of control.",
            cascadeFailures: ["Core destabilization"],
            originalPosition: { x: 0, y: 0, z: 200 },
            explodedPosition: { x: 0, y: 0, z: 350 }
        }
    );

    // ==========================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the maximal analytic extension of the Schwarzschild metric (Kruskal-Szekeres coordinates), the white hole region (Region IV) is separated from the exterior universe (Region I) by what specific boundary?",
            options: [
                "The past event horizon (r = 2GM), where outgoing null geodesics originate but ingoing cannot cross.",
                "The future event horizon, where trapped surfaces form.",
                "The Cauchy horizon, where determinism breaks down.",
                "The ergosphere, where frame-dragging forces co-rotation."
            ],
            correctAnswer: 0,
            explanation: "In Kruskal-Szekeres coordinates, Region IV is the white hole. The boundary to Region I is the past event horizon. Outgoing light rays can cross from IV to I, but nothing can enter IV from I."
        },
        {
            question: "According to loop quantum gravity (LQG) models of black hole-white hole transitions, what physical phenomenon replaces the central singularity, allowing the geometry to tunnel into a white hole?",
            options: [
                "A Planck-density quantum bounce (the 'Planck star' transition) where spatial volume becomes discrete and repulsive.",
                "A breakdown of topological invariance leading to a wormhole bridge.",
                "An infinite-density string condensate that violates the null energy condition classically.",
                "A spontaneous symmetry breaking of the Higgs field localized at r=0."
            ],
            correctAnswer: 0,
            explanation: "LQG posits that space is quantized. When matter collapses to the Planck density, quantum gravitational repulsion halts the collapse, causing a 'bounce' that manifests as a white hole over immense timescales."
        },
        {
            question: "The second law of thermodynamics poses a severe conceptual problem for macroscopic white holes because they seem to decrease entropy by emitting structured matter. How is this paradox formally resolved in the context of CPT symmetry and Hawking radiation?",
            options: [
                "A white hole is simply the CPT-reversed state of a black hole collapsing; thus its entropy formally decreases, but it is indistinguishable from a black hole in thermal equilibrium due to the symmetric nature of Hawking radiation.",
                "White holes only emit tachyonic matter, which carries negative entropy, balancing the universe's total entropy.",
                "The Bekenstein-Hawking entropy formula does not apply to white holes because their surface area is purely imaginary.",
                "The entropy of a white hole is strictly zero because it is a purely classical solution with no quantum microstates."
            ],
            correctAnswer: 0,
            explanation: "Hawking (1976) argued that a black hole in thermal equilibrium with radiation is indistinguishable from a white hole in thermal equilibrium. The time-reversed state (white hole) emits radiation identically to a black hole's Hawking radiation."
        },
        {
            question: "In Penrose diagrams, how is the conformal infinity (scri) related to the white hole region of the extended Reissner-Nordström spacetime compared to the Schwarzschild spacetime?",
            options: [
                "In Reissner-Nordström, the white hole region connects to an infinite chain of asymptotically flat universes via Cauchy horizons, whereas Schwarzschild has only one white hole and one black hole region connecting two universes.",
                "Both metrics have an identical conformal structure, with only a single past null infinity connecting to the white hole.",
                "The Reissner-Nordström white hole has no past null infinity (scri minus) because of the presence of the electromagnetic field.",
                "The white hole singularity in Reissner-Nordström is spacelike, identical to Schwarzschild."
            ],
            correctAnswer: 0,
            explanation: "The charged (Reissner-Nordström) black hole has an inner Cauchy horizon and a timelike singularity, allowing geodesics to pass through into an infinite alternating chain of new white hole/black hole universes."
        },
        {
            question: "If a white hole were to exist, why do stability analyses (such as those by Eardley in 1974) suggest they would quickly transform into black holes or be destroyed?",
            options: [
                "Due to the 'blue sheet' instability; infalling radiation and matter from the exterior universe gets infinitely blueshifted at the past event horizon, creating a mass-energy accumulation that induces gravitational collapse into a black hole.",
                "The emission of Hawking radiation causes them to evaporate in a fraction of a Planck time.",
                "They are unstable to perturbations in angular momentum, which immediately tears the event horizon apart.",
                "The cosmological constant acts as a restorative force, squashing the white hole back into a singularity."
            ],
            correctAnswer: 0,
            explanation: "The blue sheet instability dictates that any ambient radiation falling toward a white hole gets infinitely blueshifted at the past horizon, creating a divergent stress-energy tensor that forces collapse into a black hole."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speedMultiplier, meshes) {
        // Handle generic rotational animations
        animatables.forEach(anim => {
            if (anim.axis && anim.mesh) {
                anim.mesh.rotation[anim.axis] += anim.speed * speedMultiplier;
            }
            if (anim.isHover && anim.mesh) {
                const t = time * anim.hoverSpeed * speedMultiplier;
                anim.mesh.position.y = anim.baseHoverY + Math.sin(t) * anim.hoverAmp;
            }
        });

        // Handle the ejecta particle system (InstancedMesh)
        particleSystems.forEach(sys => {
            const mesh = sys.mesh;
            const data = sys.data;
            const dummy = sys.dummy;

            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                p.age += speedMultiplier;

                // Move particle outward
                p.position.add(p.velocity.clone().multiplyScalar(speedMultiplier));

                // Rotate particle
                dummy.rotation.x += p.rotationSpeed.x * speedMultiplier;
                dummy.rotation.y += p.rotationSpeed.y * speedMultiplier;
                dummy.rotation.z += p.rotationSpeed.z * speedMultiplier;

                // If particle is too old or too far, reset it near the core
                if (p.age > p.lifespan || p.position.length() > 200) {
                    p.age = 0;
                    
                    const radius = Math.random() * 5 + 10;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    
                    p.position.x = radius * Math.sin(phi) * Math.cos(theta);
                    p.position.y = radius * Math.sin(phi) * Math.sin(theta);
                    p.position.z = radius * Math.cos(phi);
                    
                    p.velocity = p.position.clone().normalize().multiplyScalar(Math.random() * 2 + 0.5);
                }

                dummy.position.copy(p.position);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
