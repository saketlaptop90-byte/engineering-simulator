import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Animation targets registry
    const anim = {
        core: null,
        horizon: null,
        rings: [],
        lasers: [],
        wheels: [],
        pistonsOuter: [],
        pistonsInner: [],
        boomArms: [],
        thrustBell: null,
        thrustPlume: null,
        screens: [],
        joysticks: [],
        steeringWheels: [],
        radars: []
    };

    // ============================================================================
    // 1. CUSTOM ADVANCED EMISSIVE & ENERGY MATERIALS
    // ============================================================================
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 15.0,
        roughness: 0.0,
        metalness: 1.0,
        transparent: true,
        opacity: 0.98
    });

    const horizonMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x2a00ff,
        emissiveIntensity: 3.0,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const laserBeamMat = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.7
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x001100,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 4.0
    });

    // ============================================================================
    // 2. MASSIVE CRAWLER CHASSIS
    // ============================================================================
    const chassisGroup = new THREE.Group();
    group.add(chassisGroup);

    // Main central structural spine
    const spineGeo = new THREE.BoxGeometry(30, 10, 160);
    const spine = new THREE.Mesh(spineGeo, darkSteel);
    spine.position.set(0, 30, 0);
    chassisGroup.add(spine);
    
    parts.push({
        name: "Main Chassis Spine",
        description: "The central super-structure holding the immense weight of the Kugelblitz drive and its containment.",
        material: "Dark Steel",
        function: "Structural integrity and load distribution.",
        assemblyOrder: 1,
        connections: ["Suspension Arms", "Drive Mounts", "Cabin Support"],
        failureEffect: "Complete structural collapse, causing the singularity to breach containment.",
        cascadeFailures: ["Containment Loss", "Planetary Crust Fracturing"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // Lateral support wings
    for (let i = -1; i <= 1; i += 2) {
        const wingGeo = new THREE.BoxGeometry(60, 6, 120);
        const wing = new THREE.Mesh(wingGeo, steel);
        wing.position.set(i * 20, 30, 0);
        chassisGroup.add(wing);

        parts.push({
            name: `Lateral Support Wing ${i === -1 ? 'Left' : 'Right'}`,
            description: "Heavy steel outriggers providing mounting points for the hydraulic suspension system.",
            material: "Steel",
            function: "Lateral stabilization.",
            assemblyOrder: 2,
            connections: ["Spine", "Hydraulic Pillars"],
            failureEffect: "Vehicle roll-over.",
            cascadeFailures: ["Suspension Shear", "Containment Ring Misalignment"],
            originalPosition: { x: i * 20, y: 30, z: 0 },
            explodedPosition: { x: i * 80, y: 80, z: 0 }
        });
    }

    // ============================================================================
    // 3. WHEELS, TREADS, AND HYDRAULICS
    // ============================================================================
    const wheelPositions = [
        { x: -50, y: 15, z: -60 },
        { x: 50, y: 15, z: -60 },
        { x: -50, y: 15, z: -20 },
        { x: 50, y: 15, z: -20 },
        { x: -50, y: 15, z: 20 },
        { x: 50, y: 15, z: 20 },
        { x: -50, y: 15, z: 60 },
        { x: 50, y: 15, z: 60 },
    ];

    wheelPositions.forEach((pos, idx) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos.x, pos.y, pos.z);
        group.add(wheelGroup);
        anim.wheels.push(wheelGroup);

        // 3a. Torus Tire
        const tireGeo = new THREE.TorusGeometry(12, 4, 32, 100);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);

        parts.push({
            name: `Heavy Crawler Tire ${idx + 1}`,
            description: "A massive, puncture-proof synthetic rubber torus designed to bear extreme gravitational loads.",
            material: "Rubber",
            function: "Traction and primary shock absorption.",
            assemblyOrder: 10 + idx,
            connections: ["Rim", "Lugs"],
            failureEffect: "Loss of mobility on that axis.",
            cascadeFailures: ["Suspension Overload", "Axle Snapping"],
            originalPosition: pos,
            explodedPosition: { x: pos.x * 2, y: pos.y, z: pos.z * 1.5 }
        });

        // 3b. Hundreds of Extruded Box Lugs for Treads
        const lugGeo = new THREE.BoxGeometry(9, 2, 3);
        const numLugs = 60;
        for (let l = 0; l < numLugs; l++) {
            const angle = (l / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Position along the outer edge of the torus
            const radius = 15;
            lug.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
            lug.rotation.x = -angle;
            wheelGroup.add(lug);
        }

        // 3c. Cylinder Rim and Complex Spokes
        const rimGeo = new THREE.CylinderGeometry(10, 10, 8, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        for (let s = 0; s < 8; s++) {
            const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.x = (s / 8) * Math.PI;
            wheelGroup.add(spoke);
        }

        // 3d. Hydraulic Suspension (Pistons inside cylinders connecting wheel to chassis)
        const suspGroup = new THREE.Group();
        suspGroup.position.set(pos.x, pos.y + 15, pos.z);
        group.add(suspGroup);

        const outerCylGeo = new THREE.CylinderGeometry(2, 2, 15, 16);
        const outerCyl = new THREE.Mesh(outerCylGeo, steel);
        suspGroup.add(outerCyl);

        const innerCylGeo = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
        const innerCyl = new THREE.Mesh(innerCylGeo, chrome);
        innerCyl.position.y = -7.5;
        suspGroup.add(innerCyl);
        
        anim.pistonsInner.push(innerCyl);

        parts.push({
            name: `Hydraulic Suspension Assembly ${idx + 1}`,
            description: "High-pressure multi-stage hydraulic pistons to absorb the immense vibration of the Kugelblitz core.",
            material: "Steel & Chrome",
            function: "Vibration dampening and active ride height control.",
            assemblyOrder: 30 + idx,
            connections: ["Chassis Wing", "Wheel Axle"],
            failureEffect: "Severe vibration transmission to the containment field.",
            cascadeFailures: ["Laser Misalignment", "Singularity Destabilization"],
            originalPosition: { x: pos.x, y: pos.y + 15, z: pos.z },
            explodedPosition: { x: pos.x * 1.5, y: pos.y + 40, z: pos.z }
        });
    });

    // ============================================================================
    // 4. ADVANCED OPERATOR CABIN
    // ============================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 50, 60);
    group.add(cabinGroup);

    // Cabin Shell (ExtrudeGeometry)
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-15, 0);
    cabinShape.lineTo(15, 0);
    cabinShape.lineTo(20, 15);
    cabinShape.lineTo(15, 30);
    cabinShape.lineTo(-15, 30);
    cabinShape.lineTo(-20, 15);
    cabinShape.lineTo(-15, 0);

    const extrudeSettings = { depth: 25, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, extrudeSettings);
    const cabinMesh = new THREE.Mesh(cabinGeo, steel);
    cabinMesh.position.z = -12.5;
    cabinGroup.add(cabinMesh);

    parts.push({
        name: "Command Cabin Shell",
        description: "Reinforced command center shielded against extreme hawking radiation and magnetic fields.",
        material: "Steel",
        function: "Houses the crew and primary control interfaces.",
        assemblyOrder: 50,
        connections: ["Chassis Spine", "Tinted Windows"],
        failureEffect: "Crew exposure to hard radiation.",
        cascadeFailures: ["Loss of Manual Override"],
        originalPosition: { x: 0, y: 50, z: 60 },
        explodedPosition: { x: 0, y: 120, z: 120 }
    });

    // Tinted Glass Windows
    const windowGeo = new THREE.BoxGeometry(28, 12, 2);
    const frontWindow = new THREE.Mesh(windowGeo, tinted);
    frontWindow.position.set(0, 15, 13);
    cabinGroup.add(frontWindow);

    parts.push({
        name: "Anti-Radiation Tinted Glass",
        description: "Lead-infused, electromagnetically shielded smart glass.",
        material: "Tinted Glass",
        function: "Provides visibility while blocking 99.9% of gamma emissions.",
        assemblyOrder: 51,
        connections: ["Cabin Shell"],
        failureEffect: "Blinding of operators.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 65, z: 73 },
        explodedPosition: { x: 0, y: 140, z: 150 }
    });

    // Control Panels, Joysticks, and Glowing Screens
    for (let p = -1; p <= 1; p += 2) {
        const panelGeo = new THREE.BoxGeometry(8, 4, 6);
        const panel = new THREE.Mesh(panelGeo, plastic);
        panel.position.set(p * 8, 5, 8);
        panel.rotation.x = Math.PI / 6;
        cabinGroup.add(panel);

        const screenGeo = new THREE.PlaneGeometry(7, 3);
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(p * 8, 5.5, 8.5);
        screen.rotation.x = -Math.PI / 3;
        cabinGroup.add(screen);
        anim.screens.push(screen);

        const joyBaseGeo = new THREE.CylinderGeometry(0.5, 1, 2, 16);
        const joyBase = new THREE.Mesh(joyBaseGeo, darkSteel);
        joyBase.position.set(p * 8, 7, 6);
        cabinGroup.add(joyBase);

        const joyGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
        const joy = new THREE.Mesh(joyGeo, chrome);
        joy.position.set(0, 2, 0);
        joyBase.add(joy);
        anim.joysticks.push(joy);

        // Steering Wheel
        const steerGeo = new THREE.TorusGeometry(2, 0.4, 16, 32);
        const steer = new THREE.Mesh(steerGeo, rubber);
        steer.position.set(p * 8, 8, 10);
        steer.rotation.x = Math.PI / 4;
        cabinGroup.add(steer);
        anim.steeringWheels.push(steer);
    }

    // ============================================================================
    // 5. THE KUGELBLITZ CORE & EVENT HORIZON
    // ============================================================================
    const driveGroup = new THREE.Group();
    driveGroup.position.set(0, 80, -20);
    group.add(driveGroup);

    // The Singularity (High detail Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(8, 4);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    driveGroup.add(coreMesh);
    anim.core = coreMesh;

    parts.push({
        name: "Kugelblitz Singularity Core",
        description: "An artificial black hole formed entirely of trapped exawatt laser light. Emits massive Hawking radiation.",
        material: "Energy Core Emissive",
        function: "Primary energy and gravitational propulsion source.",
        assemblyOrder: 100,
        connections: ["Event Horizon Shield"],
        failureEffect: "Uncontained black hole dropping into the planet's core, consuming it.",
        cascadeFailures: ["Complete Planetary Destruction"],
        originalPosition: { x: 0, y: 80, z: -20 },
        explodedPosition: { x: 0, y: 200, z: -20 }
    });

    // Event Horizon Shield
    const horizonGeo = new THREE.IcosahedronGeometry(14, 3);
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    driveGroup.add(horizonMesh);
    anim.horizon = horizonMesh;

    parts.push({
        name: "Quantum Fluctuation Shield (Event Horizon)",
        description: "A synthesized metric field designed to maintain the Kugelblitz radius and extract energy via the Penrose process.",
        material: "Neon Wireframe",
        function: "Stabilizes the singularity and filters Hawking radiation.",
        assemblyOrder: 101,
        connections: ["Singularity Core", "Laser Nodes"],
        failureEffect: "Singularity evaporation runaway (massive explosion).",
        cascadeFailures: ["Drive Vaporization"],
        originalPosition: { x: 0, y: 80, z: -20 },
        explodedPosition: { x: 0, y: 200, z: 30 }
    });

    // ============================================================================
    // 6. CONVERGING LASER INJECTOR NODES
    // ============================================================================
    const numLasers = 32;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < numLasers; i++) {
        const t = i / numLasers;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = 2 * Math.PI * goldenRatio * i;

        const x = Math.sin(inclination) * Math.cos(azimuth);
        const y = Math.sin(inclination) * Math.sin(azimuth);
        const z = Math.cos(inclination);

        const radius = 35;
        
        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x * radius, y * radius, z * radius);
        nodeGroup.lookAt(0, 0, 0);
        driveGroup.add(nodeGroup);

        // Injector Housing
        const housingGeo = new THREE.CylinderGeometry(2, 1.5, 6, 16);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.rotation.x = Math.PI / 2;
        nodeGroup.add(housing);

        // Emissive Beam
        const beamGeo = new THREE.CylinderGeometry(0.4, 0.4, radius - 14, 8);
        const beam = new THREE.Mesh(beamGeo, laserBeamMat);
        beam.position.z = (radius - 14) / 2;
        beam.rotation.x = Math.PI / 2;
        nodeGroup.add(beam);
        
        anim.lasers.push(beam);

        parts.push({
            name: `Gamma-Ray Laser Injector Node ${i + 1}`,
            description: "Fires exawatt-class gamma rays precisely into the focal point to feed the Kugelblitz mass-energy.",
            material: "Dark Steel & Laser Beam",
            function: "Maintains the black hole mass against Hawking evaporation.",
            assemblyOrder: 120 + i,
            connections: ["Dyson Shell", "Event Horizon Shield"],
            failureEffect: "Uneven mass distribution causing gravitational sheer.",
            cascadeFailures: ["Event Horizon Warping", "Catastrophic Frame Dragging"],
            originalPosition: { x: x * radius, y: 80 + y * radius, z: -20 + z * radius },
            explodedPosition: { x: x * radius * 2, y: 80 + y * radius * 2, z: -20 + z * radius * 2 }
        });
    }

    // ============================================================================
    // 7. DYSON CONTAINMENT RINGS & HAWKING COLLECTORS
    // ============================================================================
    const ringRadii = [45, 52, 60];
    const ringAxes = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];

    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(ringRadii[i], 3, 32, 100);
        const ring = new THREE.Mesh(ringGeo, steel);
        
        const ringGroup = new THREE.Group();
        ringGroup.add(ring);
        driveGroup.add(ringGroup);
        
        anim.rings.push({ mesh: ringGroup, axis: ringAxes[i], speed: 0.02 * (i + 1) });

        // Add Hawking collector dishes along the ring
        for(let d = 0; d < 8; d++) {
            const angle = (d / 8) * Math.PI * 2;
            const dishGeo = new THREE.ConeGeometry(4, 2, 16);
            const dish = new THREE.Mesh(dishGeo, copper);
            dish.position.set(Math.cos(angle) * ringRadii[i], Math.sin(angle) * ringRadii[i], 0);
            dish.lookAt(0,0,0);
            ringGroup.add(dish);
        }

        parts.push({
            name: `Dyson Containment Ring ${i + 1}`,
            description: "Massive rotating structural rings equipped with copper Hawking radiation collector dishes.",
            material: "Steel & Copper",
            function: "Harvests evaporated energy to power the chassis and weapons systems.",
            assemblyOrder: 200 + i,
            connections: ["Laser Array", "Drive Base"],
            failureEffect: "Loss of auxiliary power, leading to containment failure.",
            cascadeFailures: ["Laser Depletion", "Singularity Evaporation"],
            originalPosition: { x: 0, y: 80, z: -20 },
            explodedPosition: { x: 0, y: 80 + (i * 20), z: -20 + (i * 20) }
        });
    }

    // ============================================================================
    // 8. MAGNETIC CONFINEMENT THRUST NOZZLE
    // ============================================================================
    const nozzlePoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        // Complex bell curve with ribs
        const radius = 8 + 30 * Math.pow(t, 2) + Math.sin(t * Math.PI * 40) * 0.5; 
        const y = -10 - 70 * t;
        nozzlePoints.push(new THREE.Vector2(radius, y));
    }
    const nozzleGeo = new THREE.LatheGeometry(nozzlePoints, 64);
    const nozzle = new THREE.Mesh(nozzleGeo, darkSteel);
    
    // Rotate to point backwards
    nozzle.rotation.x = -Math.PI / 2;
    nozzle.position.set(0, 0, -25);
    driveGroup.add(nozzle);
    anim.thrustBell = nozzle;

    parts.push({
        name: "Magnetic Confinement Thrust Nozzle",
        description: "A colossal lathe-turned bell nozzle designed to direct the explosive Hawking radiation and plasma out the rear for thrust.",
        material: "Dark Steel",
        function: "Directional propulsion generation.",
        assemblyOrder: 250,
        connections: ["Singularity Core", "Magnetic Coils"],
        failureEffect: "Thrust vectors uncontrollably, melting the chassis.",
        cascadeFailures: ["Chassis Vaporization"],
        originalPosition: { x: 0, y: 80, z: -45 },
        explodedPosition: { x: 0, y: 80, z: -150 }
    });

    // Electromagnetic Coils around the nozzle
    for(let c = 1; c <= 5; c++) {
        const coilRadius = 8 + 30 * Math.pow(c/5, 2) + 2;
        const coilGeo = new THREE.TorusGeometry(coilRadius, 2, 16, 64);
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.rotation.x = -Math.PI / 2;
        coil.position.set(0, 0, -25 - (70 * (c/5)));
        driveGroup.add(coil);
    }

    // Thrust Plume
    const plumeGeo = new THREE.ConeGeometry(35, 120, 32);
    const plume = new THREE.Mesh(plumeGeo, plasmaMat);
    plume.rotation.x = -Math.PI / 2;
    plume.position.set(0, 0, -120);
    driveGroup.add(plume);
    anim.thrustPlume = plume;

    // ============================================================================
    // 9. HYDRAULIC BOOM ARMS (Connecting chassis to drive)
    // ============================================================================
    const boomGroup = new THREE.Group();
    chassisGroup.add(boomGroup);
    
    for (let i = -1; i <= 1; i += 2) {
        const boomGeo = new THREE.CylinderGeometry(3, 3, 60, 16);
        const boom = new THREE.Mesh(boomGeo, chrome);
        boom.position.set(i * 15, 30, -10);
        boom.rotation.z = i * Math.PI / 6;
        boom.rotation.x = Math.PI / 8;
        boomGroup.add(boom);
        anim.boomArms.push(boom);

        // Pipe lines wrapping the boom
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(i * 10, 0, -5),
            new THREE.Vector3(i * 30, 30, -10),
            new THREE.Vector3(i * 5, 60, -20)
        );
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.8, 8, false);
        const pipe = new THREE.Mesh(tubeGeo, plastic);
        boomGroup.add(pipe);

        parts.push({
            name: `Hydraulic Support Boom ${i === -1 ? 'Left' : 'Right'}`,
            description: "Massive articulating booms allowing the Kugelblitz drive to pitch and yaw independently of the crawler chassis.",
            material: "Chrome & Plastic piping",
            function: "Drive vectoring and physical support.",
            assemblyOrder: 70,
            connections: ["Chassis Spine", "Drive Base"],
            failureEffect: "Drive falls onto the chassis, annihilating it.",
            cascadeFailures: ["Complete Loss of Vehicle"],
            originalPosition: { x: i * 15, y: 60, z: -10 },
            explodedPosition: { x: i * 50, y: 100, z: 0 }
        });
    }

    // ============================================================================
    // 10. ANIMATION LOGIC
    // ============================================================================
    function animate(time, speed, meshes) {
        const t = time * speed;

        // Pulse the Kugelblitz Core and Horizon
        if (anim.core) {
            const scale = 1 + Math.sin(t * 10) * 0.05;
            anim.core.scale.set(scale, scale, scale);
            anim.core.material.emissiveIntensity = 10 + Math.sin(t * 15) * 5;
            anim.core.rotation.y = t * 2;
        }

        if (anim.horizon) {
            anim.horizon.rotation.x = t * -1.5;
            anim.horizon.rotation.y = t * 1.2;
            const hScale = 1 + Math.cos(t * 8) * 0.03;
            anim.horizon.scale.set(hScale, hScale, hScale);
        }

        // Rotate Dyson Rings on multiple axes
        anim.rings.forEach(ringData => {
            ringData.mesh.rotateOnAxis(ringData.axis, ringData.speed * speed * 20);
        });

        // Pulse lasers
        anim.lasers.forEach((laser, idx) => {
            laser.material.emissiveIntensity = 5 + Math.sin(t * 20 + idx) * 4;
            laser.scale.x = 1 + Math.sin(t * 30 + idx) * 0.2;
            laser.scale.z = 1 + Math.sin(t * 30 + idx) * 0.2;
        });

        // Rotate Wheels
        anim.wheels.forEach(wheel => {
            wheel.rotation.x = t * 2; // Driving forward
        });

        // Pump Suspension Pistons
        anim.pistonsInner.forEach((piston, idx) => {
            piston.position.y = -7.5 + Math.sin(t * 5 + idx) * 2; // rough terrain
        });

        // Thruster plume oscillation
        if (anim.thrustPlume) {
            const plumeScale = 1 + Math.sin(t * 25) * 0.1;
            anim.thrustPlume.scale.set(plumeScale, plumeScale, plumeScale);
            anim.thrustPlume.material.emissiveIntensity = 5 + Math.sin(t * 35) * 3;
        }

        // Cabin Interfaces
        anim.screens.forEach((screen, idx) => {
            screen.material.emissiveIntensity = 1 + Math.random(); // Flickering screens
        });

        anim.steeringWheels.forEach(wheel => {
            wheel.rotation.z = Math.sin(t * 2) * 0.5;
        });

        anim.joysticks.forEach(joy => {
            joy.rotation.x = Math.sin(t * 4) * 0.2;
            joy.rotation.z = Math.cos(t * 3) * 0.2;
        });
        
        // Boom arm vibration
        anim.boomArms.forEach((boom, idx) => {
            boom.position.y = 30 + Math.sin(t * 15 + idx) * 0.1;
        });
    }

    // ============================================================================
    // 11. DESCRIPTION & METADATA
    // ============================================================================
    const description = "The God-Tier Mobile Kugelblitz Engine. This is an ultra-massive, hyper-realistic crawler chassis carrying an artificial black hole propulsion system. It operates by focusing 32 exawatt gamma-ray lasers into a microscopic focal point, creating an energy density so profound that it forms a Kugelblitz—a black hole made of pure trapped light. The system then harvests the intense Hawking radiation emitted by the black hole using rotating Dyson containment rings and directs it through a massive magnetic confinement nozzle for unparalleled thrust. The entire assembly is mounted on an 8-wheel articulating suspension chassis with a highly detailed, shielded command cabin.";

    // ============================================================================
    // 12. PHD LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of the Kugelblitz drive, if the black hole is formed entirely of photons, what dictates the absolute lower bound of the critical laser power required for its formation, assuming a spherical convergence volume?",
            options: [
                "The Chandrasekhar limit applied to bosonic degeneracy pressure.",
                "The Heisenberg uncertainty principle governing the photon localization within the Schwarzschild radius.",
                "The Bekenstein bound on the entropy of the converging photon field.",
                "The Tolman-Oppenheimer-Volkoff limit for radiation-dominated matter."
            ],
            answer: 1,
            explanation: "To form a Kugelblitz, the energy must be concentrated into a volume smaller than its resulting Schwarzschild radius (Rs = 2GM/c^2). The Heisenberg uncertainty principle (ΔxΔp ≥ ħ/2) sets a fundamental limit on how tightly photons can be localized based on their momentum (wavelength). If the laser wavelength is too long, it cannot be focused tightly enough to form an event horizon before scattering."
        },
        {
            question: "When harvesting energy from the Kugelblitz via the Penrose process instead of pure Hawking radiation, what specific region of the spacetime geometry must the Dyson containment rings intersect, and what is its defining characteristic?",
            options: [
                "The Ergosphere, where the time-like Killing vector becomes space-like.",
                "The Photon Sphere, where stable orbital geodesics are purely light-like.",
                "The Cauchy Horizon, where predictability completely breaks down.",
                "The Innermost Stable Circular Orbit (ISCO), where matter accretion is maximized."
            ],
            answer: 0,
            explanation: "The Penrose process extracts energy from a rotating black hole (Kerr metric) by dropping matter into the Ergosphere, where frame-dragging is so intense that space itself rotates faster than light. In this region, the time-like Killing vector changes signature, allowing for negative-energy particle trajectories that enable net positive energy extraction when the particle splits."
        },
        {
            question: "As the Kugelblitz mass decreases due to Hawking evaporation, its temperature increases inversely proportional to its mass (T ∝ 1/M). How does this affect the structural integrity requirements of the immediate Dark Steel nozzle and copper magnetic coils?",
            options: [
                "The structural stress decreases because the gravitational pull lessens.",
                "The material experiences blue-shifted photodisintegration as the peak emission shifts into hard gamma rays.",
                "The magnetic coils lose superconductivity due to the Meissner effect reversing.",
                "The nozzle undergoes spontaneous vacuum decay due to the Casimir effect."
            ],
            answer: 1,
            explanation: "According to Hawking's theory, smaller black holes are hotter and emit more energetic particles. As the Kugelblitz shrinks, its peak emission spectrum shifts from x-rays to extremely hard gamma rays. These high-energy photons possess enough energy to shatter atomic nuclei in the surrounding nozzle structures, a process known as photodisintegration."
        },
        {
            question: "What kinematic issue arises for the crawler chassis if the Kugelblitz drive's acceleration vector (thrust) perfectly aligns with the Schwarzschild radius but ignores the Lense-Thirring effect of the rapidly rotating core?",
            options: [
                "The wheels will experience uniform friction reduction.",
                "The chassis will experience a powerful torquing force perpendicular to the axis of rotation.",
                "The hydraulic fluid will undergo rapid cavitation due to gravitational time dilation.",
                "The entire machine will uniformly redshift relative to an external observer."
            ],
            answer: 1,
            explanation: "The Lense-Thirring effect (frame-dragging) induced by a rapidly rotating mass twists the local spacetime metric. If thrust is applied without compensating for this gravitomagnetic field, the chassis will experience a severe induced torque, causing the massive crawler to spin violently around the drive axis, shearing the hydraulic booms."
        },
        {
            question: "The massive suspension cylinders use a fictional 'Quantum Degenerate Fluid' for vibration dampening. If this fluid behaves as a Fermi gas at absolute zero, what prevents the suspension from bottoming out under the immense mass of the drive?",
            options: [
                "Electrostatic repulsion between the polarized fluid molecules.",
                "Pauli Exclusion Principle creating electron degeneracy pressure.",
                "Bose-Einstein condensation causing the fluid to become perfectly rigid.",
                "Hawking radiation inflating the cylinders."
            ],
            answer: 1,
            explanation: "A Fermi gas consists of fermions, which obey the Pauli Exclusion Principle (no two fermions can occupy the same quantum state). When compressed incredibly tightly (like in a white dwarf star or our advanced suspension), this principle generates 'degeneracy pressure' which is entirely independent of temperature and provides immense resistance to further compression."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
