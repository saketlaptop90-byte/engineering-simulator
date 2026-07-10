import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "Ultra God Tier Ekpyrotic Brane Collision Simulator. A macroscopic observation matrix that forces two 3D branes (represented as 2D planes embedded in our 3D visualization) to collide, simulating the Big Bang in the cyclic universe model. Features a massive containment engine, multi-dimensional hydraulic presses, quantum fluctuators, and a highly detailed operator cabin with functional controls and displays.";

    const quizQuestions = [
        {
            question: "In the ekpyrotic scenario, what mathematical objects collide to initiate the hot Big Bang?",
            options: ["0D Point Particles", "1D Strings", "3D Branes embedded in a higher-dimensional bulk", "4D Black Holes"],
            answer: 2,
            explanation: "The ekpyrotic model proposes that the universe's Big Bang was caused by the collision of two three-dimensional branes along a hidden extra dimension."
        },
        {
            question: "What provides the attractive force between the branes in the bulk space prior to collision?",
            options: ["Electromagnetism", "Strong Nuclear Force", "A weak inter-brane scalar field potential", "Dark Energy"],
            answer: 2,
            explanation: "A specific scalar field potential, often linked to the distance between the branes in the bulk, creates an attractive force drawing them together."
        },
        {
            question: "How does the ekpyrotic model explain the scale-invariant spectrum of primordial density perturbations without cosmic inflation?",
            options: ["Through cosmic ray impacts", "Through quantum fluctuations of the branes rippling as they approach each other", "By relying on magnetic monopoles", "It doesn't, it relies on inflation"],
            answer: 1,
            explanation: "As the branes slowly approach each other, quantum fluctuations cause them to ripple. These ripples imprint a scale-invariant spectrum of density variations when they collide."
        },
        {
            question: "According to M-theory (the framework for the ekpyrotic model), how many spatial dimensions exist in the bulk where these branes reside?",
            options: ["3 macroscopic spatial dimensions", "4 macroscopic spatial dimensions (with 6 additional compactified ones)", "11 macroscopic spatial dimensions", "2 macroscopic spatial dimensions"],
            answer: 1,
            explanation: "M-theory operates in 11 spacetime dimensions (10 spatial, 1 time). In the typical Horava-Witten setup used for ekpyrosis, there are two 3-branes bounding a 4-dimensional bulk, with 6 dimensions tightly compactified."
        },
        {
            question: "What replaces the initial singularity in the ekpyrotic cyclic model?",
            options: ["A black hole", "A white hole", "A finite bounce resulting from brane collision", "An infinitely dense point"],
            answer: 2,
            explanation: "The model avoids a singularity; instead, the universe undergoes a 'bounce' as the branes collide and then separate, filling the branes with hot plasma."
        }
    ];

    // Helper to register parts
    function registerPart(name, mesh, desc, materialName, func, assembly, connections, fail, cascade, pos, expl) {
        mesh.position.set(pos.x, pos.y, pos.z);
        group.add(mesh);
        parts.push({
            name,
            description: desc,
            material: materialName,
            function: func,
            assemblyOrder: assembly,
            connections,
            failureEffect: fail,
            cascadeFailures: cascade,
            originalPosition: pos,
            explodedPosition: expl
        });
        return mesh;
    }

    // Custom Glowing Materials for the Branes
    const topBraneMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0055ff,
        emissiveIntensity: 2.0,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });

    const botBraneMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff0055,
        emissiveIntensity: 2.0,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });

    const plasmaMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 3.5,
        transparent: true,
        opacity: 0, // initially invisible
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // --- 1. THE BRANES ---
    const braneGeo = new THREE.PlaneGeometry(800, 800, 120, 120);
    const upperBrane = new THREE.Mesh(braneGeo, topBraneMat);
    upperBrane.rotation.x = -Math.PI / 2;
    registerPart("Upper Dimensional Brane", upperBrane, "A 3D spatial membrane containing a distinct universe structure.", "Quantum Matrix (Cyan)", "Approaches the lower brane to initiate ekpyrotic cycle.", 1, ["Lower Dimensional Brane", "Upper Hydraulic Press"], "Premature Big Bang", ["Everything"], {x:0, y:200, z:0}, {x:0, y:500, z:0});
    meshes.upperBrane = upperBrane;

    const lowerBrane = new THREE.Mesh(braneGeo, botBraneMat);
    lowerBrane.rotation.x = -Math.PI / 2;
    registerPart("Lower Dimensional Brane", lowerBrane, "The mirror brane in the bulk.", "Quantum Matrix (Magenta)", "Acts as the target for the collision bounce.", 2, ["Upper Dimensional Brane", "Lower Hydraulic Press"], "Asymmetric collision", ["Everything"], {x:0, y:-200, z:0}, {x:0, y:-500, z:0});
    meshes.lowerBrane = lowerBrane;

    // Save initial vertices for ripple animations
    const posUpper = upperBrane.geometry.attributes.position;
    const posLower = lowerBrane.geometry.attributes.position;
    meshes.origUpper = [];
    meshes.origLower = [];
    for(let i=0; i<posUpper.count; i++) {
        meshes.origUpper.push({x: posUpper.getX(i), y: posUpper.getY(i), z: posUpper.getZ(i)});
        meshes.origLower.push({x: posLower.getX(i), y: posLower.getY(i), z: posLower.getZ(i)});
    }

    // --- 2. PLASMA PARTICLE SYSTEM (THE BIG BANG) ---
    const particleCount = 25000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pVel = [];
    for(let i=0; i<particleCount; i++) {
        pPos[i*3] = 0; pPos[i*3+1] = 0; pPos[i*3+2] = 0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = Math.random() * 15 + 5;
        pVel.push({
            x: speed * Math.sin(phi) * Math.cos(theta),
            y: (speed * Math.sin(phi) * Math.sin(theta)) * 0.2, // flatter explosion
            z: speed * Math.cos(phi)
        });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const plasmaSys = new THREE.Points(pGeo, plasmaMat);
    registerPart("Primordial Plasma Ejecta", plasmaSys, "Raw energy and matter created during the collision.", "Energy", "Seeds the new universe.", 3, ["Upper Dimensional Brane"], "Vacuum decay", ["Universe"], {x:0, y:0, z:0}, {x:0, y:0, z:0});
    meshes.plasma = plasmaSys;
    meshes.pVel = pVel;

    // --- 3. MASSIVE CONTAINMENT RINGS ---
    // Outer Torus
    const torusGeo1 = new THREE.TorusGeometry(600, 20, 64, 128);
    const ring1 = new THREE.Mesh(torusGeo1, darkSteel);
    registerPart("Outer Bulk Containment Ring", ring1, "Generates the artificial bulk dimension.", "darkSteel", "Maintains dimensionality.", 4, ["Inner Rings"], "Dimensional collapse", ["Core", "Branes"], {x:0, y:0, z:0}, {x:800, y:0, z:0});
    meshes.ring1 = ring1;

    // Add intricate lugs/treads to the Outer Ring
    const lugsGroup = new THREE.Group();
    const lugGeo = new THREE.BoxGeometry(45, 15, 30);
    for(let i=0; i<120; i++) {
        const angle = (i / 120) * Math.PI * 2;
        const lug = new THREE.Mesh(lugGeo, steel);
        lug.position.set(Math.cos(angle)*600, Math.sin(angle)*600, 0);
        lug.rotation.z = angle;
        lugsGroup.add(lug);
    }
    registerPart("Ring Electromagnetic Lugs Array", lugsGroup, "High-tension magnetic nodes.", "steel", "Drives ring rotation.", 5, ["Outer Bulk Containment Ring"], "Ring stall", ["Ring System"], {x:0, y:0, z:0}, {x:900, y:0, z:0});
    meshes.lugs1 = lugsGroup; // We will rotate this with the ring

    const torusGeo2 = new THREE.TorusGeometry(520, 15, 64, 100);
    const ring2 = new THREE.Mesh(torusGeo2, copper);
    ring2.rotation.x = Math.PI / 2;
    registerPart("Orthogonal Stabilization Ring", ring2, "Provides Y-axis dimensional stability.", "copper", "Gyroscopic balance.", 6, ["Outer Bulk Containment Ring"], "Wobble", ["Containment Grid"], {x:0, y:0, z:0}, {x:0, y:800, z:0});
    meshes.ring2 = ring2;

    const torusGeo3 = new THREE.TorusGeometry(440, 25, 64, 120);
    const ring3 = new THREE.Mesh(torusGeo3, chrome);
    ring3.rotation.y = Math.PI / 2;
    registerPart("Tachyon Flow Ring", ring3, "Chutes for faster-than-light particles.", "chrome", "Time-syncs the collision.", 7, ["Orthogonal Stabilization Ring"], "Temporal paradox", ["Observation Cabin"], {x:0, y:0, z:0}, {x:0, y:0, z:800});
    meshes.ring3 = ring3;

    // --- 4. HYDRAULIC MULTI-DIMENSIONAL PRESSES ---
    // These drive the branes together. Placed at 4 corners.
    meshes.pistons = [];
    const cornerPositions = [
        {x: 400, z: 400}, {x: -400, z: 400}, {x: 400, z: -400}, {x: -400, z: -400}
    ];

    cornerPositions.forEach((pos, index) => {
        // Base Pillar
        const pillarGeo = new THREE.CylinderGeometry(40, 50, 800, 32);
        const pillar = new THREE.Mesh(pillarGeo, darkSteel);
        registerPart(`Hydraulic Base Pillar ${index+1}`, pillar, "Anchors the press.", "darkSteel", "Support structure.", 8+index, ["Ring System"], "Structural failure", [], {x: pos.x, y: 0, z: pos.z}, {x: pos.x*2, y: 0, z: pos.z*2});
        
        // Upper Piston (moves down)
        const topPistonGroup = new THREE.Group();
        const cylinderTopGeo = new THREE.CylinderGeometry(20, 20, 300, 32);
        const topCyl = new THREE.Mesh(cylinderTopGeo, chrome);
        topCyl.position.y = 150;
        topPistonGroup.add(topCyl);
        
        // Upper Grip mechanism
        const gripTopGeo = new THREE.BoxGeometry(100, 20, 100);
        const gripTop = new THREE.Mesh(gripTopGeo, steel);
        gripTop.position.y = 0;
        topPistonGroup.add(gripTop);
        
        registerPart(`Upper Hydraulic Piston ${index+1}`, topPistonGroup, "Pushes upper brane.", "chrome", "Drives collision.", 12+index, [`Hydraulic Base Pillar ${index+1}`], "Brane misalignment", ["Collision failure"], {x: pos.x, y: 200, z: pos.z}, {x: pos.x*1.5, y: 600, z: pos.z*1.5});
        meshes.pistons.push({ group: topPistonGroup, type: 'upper', origY: 200 });

        // Lower Piston (moves up)
        const botPistonGroup = new THREE.Group();
        const cylinderBotGeo = new THREE.CylinderGeometry(20, 20, 300, 32);
        const botCyl = new THREE.Mesh(cylinderBotGeo, chrome);
        botCyl.position.y = -150;
        botPistonGroup.add(botCyl);
        
        const gripBot = new THREE.Mesh(gripTopGeo, steel);
        gripBot.position.y = 0;
        botPistonGroup.add(gripBot);

        registerPart(`Lower Hydraulic Piston ${index+1}`, botPistonGroup, "Pushes lower brane.", "chrome", "Drives collision.", 16+index, [`Hydraulic Base Pillar ${index+1}`], "Brane misalignment", ["Collision failure"], {x: pos.x, y: -200, z: pos.z}, {x: pos.x*1.5, y: -600, z: pos.z*1.5});
        meshes.pistons.push({ group: botPistonGroup, type: 'lower', origY: -200 });
        
        // Add detailed coolant pipes around each pillar
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pos.x + 50, -400, pos.z + 50),
            new THREE.Vector3(pos.x + 80, -200, pos.z + 80),
            new THREE.Vector3(pos.x + 50, 0, pos.z + 50),
            new THREE.Vector3(pos.x + 80, 200, pos.z + 80),
            new THREE.Vector3(pos.x + 50, 400, pos.z + 50),
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 64, 8, 16, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        // Correct the pipe's internal coordinates relative to its localized position 0,0,0
        pipe.position.set(-pos.x, 0, -pos.z); // The curve was defined in world space, but we register at pos.x
        registerPart(`Pillar Coolant Loop ${index+1}`, pipe, "Circulates liquid helium.", "copper", "Prevents overheat.", 20+index, [`Hydraulic Base Pillar ${index+1}`], "Melt down", ["Press Failure"], {x: pos.x, y: 0, z: pos.z}, {x: pos.x*2, y: 0, z: pos.z*2});
    });

    // --- 5. CENTRAL ENERGY CORE ---
    // A complex array of shapes at the origin to absorb the shock
    const coreGroup = new THREE.Group();
    const coreCenterGeo = new THREE.IcosahedronGeometry(80, 2);
    const coreCenterMat = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 1.0, roughness: 0.1, wireframe: true});
    const coreCenter = new THREE.Mesh(coreCenterGeo, coreCenterMat);
    coreGroup.add(coreCenter);

    for(let i=0; i<6; i++) {
        const spikeGeo = new THREE.ConeGeometry(10, 150, 16);
        const spike = new THREE.Mesh(spikeGeo, chrome);
        spike.position.y = 75;
        const spikePivot = new THREE.Group();
        spikePivot.add(spike);
        spikePivot.rotation.x = Math.random() * Math.PI * 2;
        spikePivot.rotation.y = Math.random() * Math.PI * 2;
        coreGroup.add(spikePivot);
    }
    registerPart("Zero-Point Energy Core", coreGroup, "Harnesses residual energy from the collision.", "Mixed", "Powers the facility.", 30, ["Rings"], "Core Explosion", ["Total Facility Loss"], {x:0, y:0, z:0}, {x:0, y:0, z:0});
    meshes.core = coreGroup;


    // --- 6. DETAILED OPERATOR CABIN ---
    const cabinGroup = new THREE.Group();
    
    // Main deck floor
    const deckGeo = new THREE.CylinderGeometry(150, 120, 10, 64);
    const deck = new THREE.Mesh(deckGeo, steel);
    deck.position.y = -5;
    cabinGroup.add(deck);

    // Tinted Glass Dome
    const domeGeo = new THREE.SphereGeometry(140, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, tinted);
    dome.position.y = 0;
    cabinGroup.add(dome);

    // Main Control Console
    const consoleGeo = new THREE.BoxGeometry(80, 40, 40);
    const consoleMesh = new THREE.Mesh(consoleGeo, plastic);
    consoleMesh.position.set(0, 20, -80);
    cabinGroup.add(consoleMesh);

    // Glowing Screens on Console
    const screenGeo = new THREE.PlaneGeometry(30, 20);
    const screenMat = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5});
    const screen1 = new THREE.Mesh(screenGeo, screenMat);
    screen1.position.set(-20, 20.1, -95);
    screen1.rotation.x = -Math.PI / 4;
    cabinGroup.add(screen1);

    const screen2 = new THREE.Mesh(screenGeo, screenMat);
    screen2.position.set(20, 20.1, -95);
    screen2.rotation.x = -Math.PI / 4;
    cabinGroup.add(screen2);

    // Steering Wheel (for multiversal navigation?)
    const wheelGroup = new THREE.Group();
    const wheelGeo = new THREE.TorusGeometry(15, 2, 16, 32);
    const wheel = new THREE.Mesh(wheelGeo, rubber);
    wheelGroup.add(wheel);
    
    for(let i=0; i<3; i++) {
        const spokeGeo = new THREE.CylinderGeometry(1, 1, 15);
        const spoke = new THREE.Mesh(spokeGeo, aluminum);
        spoke.rotation.z = (i * Math.PI * 2) / 3;
        spoke.position.y = 7.5;
        
        const spokePiv = new THREE.Group();
        spokePiv.add(spoke);
        spokePiv.rotation.z = (i * Math.PI * 2) / 3;
        wheelGroup.add(spokePiv);
    }
    wheelGroup.position.set(0, 35, -60);
    wheelGroup.rotation.x = -Math.PI / 4;
    cabinGroup.add(wheelGroup);
    meshes.steeringWheel = wheelGroup;

    // Tachyon Joysticks
    const stickGeo = new THREE.CylinderGeometry(2, 2, 20);
    const ballGeo = new THREE.SphereGeometry(4, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff0000});

    const joyLeft = new THREE.Group();
    const stickL = new THREE.Mesh(stickGeo, aluminum);
    stickL.position.y = 10;
    const ballL = new THREE.Mesh(ballGeo, ballMat);
    ballL.position.y = 20;
    joyLeft.add(stickL, ballL);
    joyLeft.position.set(-30, 40, -70);
    joyLeft.rotation.x = Math.PI / 6;
    cabinGroup.add(joyLeft);
    meshes.joyLeft = joyLeft;

    const joyRight = new THREE.Group();
    const stickR = new THREE.Mesh(stickGeo, aluminum);
    stickR.position.y = 10;
    const ballR = new THREE.Mesh(ballGeo, ballMat);
    ballR.position.y = 20;
    joyRight.add(stickR, ballR);
    joyRight.position.set(30, 40, -70);
    joyRight.rotation.x = Math.PI / 6;
    cabinGroup.add(joyRight);
    meshes.joyRight = joyRight;

    // Operator Chair
    const chairGeo = new THREE.BoxGeometry(30, 40, 30);
    const chair = new THREE.Mesh(chairGeo, rubber);
    chair.position.set(0, 20, -20);
    cabinGroup.add(chair);

    // Grill and Ladders below the cabin
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(2, 2, 200);
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.set(-15, -100, 0);
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.set(15, -100, 0);
    ladderGroup.add(rail1, rail2);
    for(let i=0; i<15; i++) {
        const stepGeo = new THREE.CylinderGeometry(1.5, 1.5, 30);
        const step = new THREE.Mesh(stepGeo, aluminum);
        step.rotation.z = Math.PI / 2;
        step.position.set(0, -10 - (i*13), 0);
        ladderGroup.add(step);
    }
    cabinGroup.add(ladderGroup);

    registerPart("Command & Observation Cabin", cabinGroup, "Provides safe viewing and multiversal navigation via extreme high-tech instrumentation.", "Mixed", "Controls simulation.", 40, ["Outer Ring"], "Loss of Control", ["Catastrophic Simulation Failure"], {x: 0, y: 0, z: 900}, {x: 0, y: 500, z: 1500});


    // --- 7. EXTERIOR EXHAUST STACKS & RADIATORS ---
    const radiatorGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const exhaust = new THREE.Group();
        
        const pipeGeo = new THREE.CylinderGeometry(15, 20, 150, 16);
        const pipe = new THREE.Mesh(pipeGeo, darkSteel);
        pipe.position.y = 75;
        exhaust.add(pipe);

        // Heat fins
        for(let j=0; j<10; j++) {
            const finGeo = new THREE.TorusGeometry(25, 2, 8, 32);
            const fin = new THREE.Mesh(finGeo, copper);
            fin.rotation.x = Math.PI / 2;
            fin.position.y = 30 + j * 10;
            exhaust.add(fin);
        }

        exhaust.position.set(Math.cos(angle)*700, 0, Math.sin(angle)*700);
        exhaust.rotation.x = (Math.cos(angle) > 0 ? 1 : -1) * Math.PI/4;
        exhaust.rotation.z = (Math.sin(angle) > 0 ? 1 : -1) * Math.PI/4;

        radiatorGroup.add(exhaust);
    }
    registerPart("Hawking Radiation Exhaust Array", radiatorGroup, "Vents excess entropy from the simulation void.", "darkSteel/copper", "Thermal management.", 50, ["Containment Grid"], "Thermal Cascade", ["Core Explosion"], {x:0, y:0, z:0}, {x:0, y:-800, z:0});


    // --- 8. SUB-QUANTUM FLUCTUATION GENERATORS ---
    // Adding intricate mechanical details to the interior of the rings
    const fluctuators = new THREE.Group();
    for(let i=0; i<36; i++) {
        const angle = (i/36) * Math.PI * 2;
        const flucGeo = new THREE.BoxGeometry(20, 60, 20);
        const fluc = new THREE.Mesh(flucGeo, aluminum);
        
        const tipGeo = new THREE.ConeGeometry(10, 30, 8);
        const tip = new THREE.Mesh(tipGeo, chrome);
        tip.position.y = 45;
        fluc.add(tip);

        fluc.position.set(Math.cos(angle)*580, Math.sin(angle)*580, 0);
        fluc.rotation.z = angle + Math.PI/2;
        fluctuators.add(fluc);
    }
    registerPart("Sub-Quantum Fluctuators", fluctuators, "Induces the density perturbations on the branes prior to collision.", "aluminum", "Generates CMB anisotropies.", 60, ["Outer Ring"], "Perfectly uniform universe", ["Structure formation fails"], {x:0,y:0,z:0}, {x:1200, y:1200, z:0});


    // --- ANIMATION LOGIC ---
    let phase = 0; // 0: approach, 1: ripple, 2: collision/bang, 3: repel
    let simTime = 0;
    
    function animate(time, speed, meshesObj) {
        simTime += speed * 0.01;

        // Rotate Rings
        if(meshesObj.ring1) meshesObj.ring1.rotation.z = simTime * 0.2;
        if(meshesObj.lugs1) meshesObj.lugs1.rotation.z = simTime * 0.2;
        if(meshesObj.ring2) meshesObj.ring2.rotation.y = simTime * 0.3;
        if(meshesObj.ring3) meshesObj.ring3.rotation.x = simTime * 0.4;

        // Rotate Core
        if(meshesObj.core) {
            meshesObj.core.rotation.x = simTime * 1.5;
            meshesObj.core.rotation.y = simTime * 1.2;
        }

        // Animate Joysticks in cabin (simulating autonomous multiversal adjustments)
        if(meshesObj.joyLeft) meshesObj.joyLeft.rotation.x = Math.PI/6 + Math.sin(simTime * 2) * 0.2;
        if(meshesObj.joyRight) meshesObj.joyRight.rotation.z = Math.cos(simTime * 1.8) * 0.2;
        if(meshesObj.steeringWheel) meshesObj.steeringWheel.rotation.z = Math.sin(simTime * 0.5) * Math.PI/2;

        // EKPYROTIC CYCLE STATE MACHINE
        const cycleDuration = 20.0; // full cycle time
        const t = simTime % cycleDuration;
        
        let targetY = 200;
        let rippleIntensity = 0;
        let bangProgress = 0;

        if (t < 8.0) {
            // Phase 0: Approach
            phase = 0;
            const progress = t / 8.0; // 0 to 1
            // Ease-in curve
            targetY = 200 - (200 * Math.pow(progress, 3)); 
            rippleIntensity = progress * 50; // Ripples grow as they approach
            
            // Particles invisible
            meshesObj.plasma.material.opacity = 0;
        } else if (t < 10.0) {
            // Phase 1: High Ripple & Collision imminent
            phase = 1;
            const progress = (t - 8.0) / 2.0;
            targetY = 0;
            rippleIntensity = 50 + (progress * 150);
            
            meshesObj.plasma.material.opacity = 0;
        } else if (t < 11.0) {
            // Phase 2: COLLISION (Big Bang)
            phase = 2;
            targetY = 0;
            rippleIntensity = 0; // flatten out at moment of impact
            bangProgress = (t - 10.0) / 1.0; // 0 to 1
            
            // Flash branes
            meshesObj.upperBrane.material.emissiveIntensity = 2.0 + bangProgress * 10;
            meshesObj.lowerBrane.material.emissiveIntensity = 2.0 + bangProgress * 10;
            
            // Ignite plasma
            meshesObj.plasma.material.opacity = Math.min(1.0, bangProgress * 2);
            
            // Update particles exploding outward
            const positions = meshesObj.plasma.geometry.attributes.position.array;
            for(let i=0; i<particleCount; i++) {
                // Reset to center at start of bang
                if(bangProgress < 0.05) {
                    positions[i*3] = (Math.random() - 0.5) * 100;
                    positions[i*3+1] = (Math.random() - 0.5) * 10;
                    positions[i*3+2] = (Math.random() - 0.5) * 100;
                }
                
                // Move outward
                positions[i*3] += meshesObj.pVel[i].x * speed * 0.5;
                positions[i*3+1] += meshesObj.pVel[i].y * speed * 0.5;
                positions[i*3+2] += meshesObj.pVel[i].z * speed * 0.5;
            }
            meshesObj.plasma.geometry.attributes.position.needsUpdate = true;

        } else {
            // Phase 3: Repulsion / Bounce
            phase = 3;
            const progress = (t - 11.0) / 9.0;
            // Ease-out
            targetY = 200 * Math.pow(progress, 0.5);
            rippleIntensity = 20 * (1.0 - progress);
            
            // Cool down branes
            meshesObj.upperBrane.material.emissiveIntensity = Math.max(2.0, 12 - (progress * 10));
            meshesObj.lowerBrane.material.emissiveIntensity = Math.max(2.0, 12 - (progress * 10));
            
            // Fade and expand plasma
            meshesObj.plasma.material.opacity = 1.0 - progress;
            const positions = meshesObj.plasma.geometry.attributes.position.array;
            for(let i=0; i<particleCount; i++) {
                positions[i*3] += meshesObj.pVel[i].x * speed * 0.2;
                positions[i*3+1] += meshesObj.pVel[i].y * speed * 0.2;
                positions[i*3+2] += meshesObj.pVel[i].z * speed * 0.2;
            }
            meshesObj.plasma.geometry.attributes.position.needsUpdate = true;
        }

        // Apply positions to pistons and branes
        meshesObj.upperBrane.position.y = targetY;
        meshesObj.lowerBrane.position.y = -targetY;

        meshesObj.pistons.forEach(p => {
            if(p.type === 'upper') {
                p.group.position.y = p.origY - (200 - targetY);
            } else {
                p.group.position.y = p.origY + (200 - targetY);
            }
        });

        // Apply ripples using vertex displacement
        if (rippleIntensity > 0) {
            const posU = meshesObj.upperBrane.geometry.attributes.position;
            const posL = meshesObj.lowerBrane.geometry.attributes.position;
            
            for(let i=0; i<posU.count; i++) {
                const origU = meshesObj.origUpper[i];
                const origL = meshesObj.origLower[i];
                
                // Complex wave function based on X, Z, and time
                const wave1 = Math.sin(origU.x * 0.05 + simTime * 5);
                const wave2 = Math.cos(origU.y * 0.05 + simTime * 4); // remember y is Z before rotation
                const wave3 = Math.sin((origU.x + origU.y) * 0.02 - simTime * 3);
                
                const displacement = (wave1 + wave2 + wave3) * (rippleIntensity * 0.3);
                
                // Plane is rotated -PI/2 on X, so Z axis in local space is the visual Y axis (up/down)
                posU.setZ(i, origU.z + displacement);
                posL.setZ(i, origL.z - displacement); // opposite phase for dramatic effect
            }
            posU.needsUpdate = true;
            posL.needsUpdate = true;
        } else if (phase === 0 || phase === 2) {
            // Flatten completely at start or during bang
            const posU = meshesObj.upperBrane.geometry.attributes.position;
            const posL = meshesObj.lowerBrane.geometry.attributes.position;
            for(let i=0; i<posU.count; i++) {
                posU.setZ(i, meshesObj.origUpper[i].z);
                posL.setZ(i, meshesObj.origLower[i].z);
            }
            posU.needsUpdate = true;
            posL.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
