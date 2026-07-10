import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials for Hyper-Realism
    const magmaMaterial = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.1 });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 1.5, roughness: 0.2 });
    const warningLightMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0 });
    const crustMaterial = new THREE.MeshStandardMaterial({ color: 0x6e5c4f, roughness: 0.9, metalness: 0.1 });
    const mantleMaterial = new THREE.MeshStandardMaterial({ color: 0x3d1c04, roughness: 0.8, metalness: 0.2 });
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.1 });

    // Helpers
    function createIBeam(length, width, height) {
        const shape = new THREE.Shape();
        const t = 0.2 * width;
        shape.moveTo(-width/2, height/2);
        shape.lineTo(width/2, height/2);
        shape.lineTo(width/2, height/2 - t);
        shape.lineTo(t, height/2 - t);
        shape.lineTo(t, -height/2 + t);
        shape.lineTo(width/2, -height/2 + t);
        shape.lineTo(width/2, -height/2);
        shape.lineTo(-width/2, -height/2);
        shape.lineTo(-width/2, -height/2 + t);
        shape.lineTo(-t, -height/2 + t);
        shape.lineTo(-t, height/2 - t);
        shape.lineTo(-width/2, height/2 - t);
        shape.lineTo(-width/2, height/2);

        const extrudeSettings = { depth: length, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return new THREE.Mesh(geo, darkSteel);
    }

    function createWheel() {
        const wheelGroup = new THREE.Group();
        
        // Main tire body
        const torusGeo = new THREE.TorusGeometry(4, 1.5, 64, 128);
        const tire = new THREE.Mesh(torusGeo, rubber);
        wheelGroup.add(tire);
        
        // Treads (Hundreds of tiny lugs)
        const lugGeo = new THREE.BoxGeometry(2.0, 0.6, 3.5);
        for (let i = 0; i < 90; i++) {
            const angle = (i / 90) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * 4.2, Math.sin(angle) * 4.2, 0);
            lug.rotation.z = angle;
            wheelGroup.add(lug);
        }
        
        // Rim
        const rimGeo = new THREE.CylinderGeometry(2.8, 2.8, 1.8, 64);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        wheelGroup.add(rim);

        // Spokes
        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, 5.6, 32);
        for (let i = 0; i < 12; i++) {
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.z = (i / 12) * Math.PI;
            spoke.rotation.x = Math.PI / 2;
            wheelGroup.add(spoke);
        }

        // Center Hub
        const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 32);
        hubGeo.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, chrome);
        wheelGroup.add(hub);

        return wheelGroup;
    }

    function createHydraulicCylinder(radius, length) {
        const group = new THREE.Group();
        
        // Outer housing
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        const outer = new THREE.Mesh(outerGeo, steel);
        outer.position.y = length / 2;
        group.add(outer);
        
        // Inner piston
        const innerGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 1.2, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = length;
        group.add(inner);
        
        // Fluid lines attached
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius, length * 0.2, 0),
            new THREE.Vector3(radius * 2, length * 0.4, 0),
            new THREE.Vector3(radius * 2, length * 0.8, 0),
            new THREE.Vector3(radius, length * 0.9, 0)
        ]);
        const lineGeo = new THREE.TubeGeometry(lineCurve, 20, radius * 0.15, 8, false);
        const line = new THREE.Mesh(lineGeo, rubber);
        group.add(line);

        return { group, inner };
    }

    function createCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main structural frame
        const frameShape = new THREE.Shape();
        frameShape.moveTo(0,0);
        frameShape.lineTo(6,0);
        frameShape.lineTo(7,4);
        frameShape.lineTo(5,7);
        frameShape.lineTo(0,7);
        frameShape.lineTo(-1,3);
        frameShape.lineTo(0,0);
        
        const extrudeSettings = { depth: 5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 };
        const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
        const frame = new THREE.Mesh(frameGeo, darkSteel);
        frame.position.z = -2.5;
        cabinGroup.add(frame);
        
        // Tinted Glass window
        const windowGeo = new THREE.PlaneGeometry(5.8, 4.8);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.set(3.2, 3.5, 2.6);
        windowMesh.rotation.y = Math.PI/2;
        windowMesh.rotation.x = -0.1;
        cabinGroup.add(windowMesh);
        
        // Steering Wheel and Dash
        const dashGeo = new THREE.BoxGeometry(2, 1, 4);
        const dash = new THREE.Mesh(dashGeo, plastic);
        dash.position.set(5, 2, 0);
        cabinGroup.add(dash);

        const wheelGeo = new THREE.TorusGeometry(0.5, 0.08, 16, 32);
        const wheel = new THREE.Mesh(wheelGeo, plastic);
        wheel.position.set(4, 2.8, 0);
        wheel.rotation.y = Math.PI/2;
        wheel.rotation.x = -Math.PI/6;
        cabinGroup.add(wheel);

        // Joysticks
        for(let z of [-1, 1]) {
            const baseGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.3, 16);
            const base = new THREE.Mesh(baseGeo, darkSteel);
            base.position.set(3.5, 2.2, z);
            cabinGroup.add(base);
            
            const stickGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
            const stick = new THREE.Mesh(stickGeo, chrome);
            stick.position.set(3.5, 2.6, z);
            cabinGroup.add(stick);
        }
        
        // Glowing Screens array
        for(let i=0; i<3; i++) {
            const screenGeo = new THREE.BoxGeometry(0.1, 1.2, 1.2);
            const screen = new THREE.Mesh(screenGeo, screenMaterial);
            screen.position.set(5.5, 3.5, -1.5 + i*1.5);
            cabinGroup.add(screen);
        }

        // Side Mirrors
        for(let side of [1, -1]) {
            const mirrorBracket = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), chrome);
            mirrorBracket.position.set(5.5, 4, side * 3);
            mirrorBracket.rotation.x = Math.PI/2;
            cabinGroup.add(mirrorBracket);
            
            const mirrorBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.6), plastic);
            mirrorBody.position.set(5.5, 4, side * 3.5);
            cabinGroup.add(mirrorBody);
            
            const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 1.1), chrome);
            mirrorGlass.position.set(5.66, 4, side * 3.5);
            mirrorGlass.rotation.y = Math.PI/2;
            cabinGroup.add(mirrorGlass);
        }
        
        // Warning beacon
        const beaconGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
        const beacon = new THREE.Mesh(beaconGeo, warningLightMaterial);
        beacon.position.set(3, 7.4, 0);
        cabinGroup.add(beacon);
        meshes.warningBeacon = beacon;

        return cabinGroup;
    }

    function createTectonicPlate(isLeft) {
        const plateGroup = new THREE.Group();
        
        // Complex extruded geology
        const width = 30;
        const depth = 20;
        
        // Crust Layer
        const crustShape = new THREE.Shape();
        crustShape.moveTo(0, 0);
        for(let x=0; x<=width; x+=2) {
            crustShape.lineTo(x, (Math.sin(x*0.5) * 1.5) + (Math.random()*0.5));
        }
        crustShape.lineTo(width, -5);
        crustShape.lineTo(0, -5);
        crustShape.lineTo(0, 0);

        const extrudeSettings = { depth: depth, bevelEnabled: false, steps: 5 };
        const crustGeo = new THREE.ExtrudeGeometry(crustShape, extrudeSettings);
        crustGeo.center();
        const crust = new THREE.Mesh(crustGeo, crustMaterial);
        crust.position.y = 5;
        plateGroup.add(crust);

        // Mantle Layer
        const mantleShape = new THREE.Shape();
        mantleShape.moveTo(0, -5);
        mantleShape.lineTo(width, -5);
        mantleShape.lineTo(width, -15);
        mantleShape.lineTo(0, -15);
        mantleShape.lineTo(0, -5);
        
        const mantleGeo = new THREE.ExtrudeGeometry(mantleShape, extrudeSettings);
        mantleGeo.center();
        const mantle = new THREE.Mesh(mantleGeo, mantleMaterial);
        mantle.position.y = -5;
        plateGroup.add(mantle);
        
        // Fault lines (fractures)
        const faultGeo = new THREE.CylinderGeometry(0.2, 0.2, 25, 8);
        for(let i=0; i<3; i++) {
            const fault = new THREE.Mesh(faultGeo, magmaMaterial);
            fault.position.set((Math.random() - 0.5)*20, 0, (Math.random() - 0.5)*15);
            fault.rotation.z = Math.random() * 0.5;
            plateGroup.add(fault);
        }

        return plateGroup;
    }

    function createCentralMountain() {
        const mountainGroup = new THREE.Group();
        
        // Lathe based peak
        const points = [];
        for ( let i = 0; i < 20; i ++ ) {
            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
        }
        const latheGeo = new THREE.LatheGeometry( points, 64 );
        const peak = new THREE.Mesh( latheGeo, crustMaterial );
        peak.rotation.x = Math.PI;
        peak.position.y = 20;
        mountainGroup.add(peak);
        
        // Snow Cap
        const snowPoints = [];
        for ( let i = 0; i < 8; i ++ ) {
            snowPoints.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 4 + 2, ( i - 5 ) * 2 ) );
        }
        const snowGeo = new THREE.LatheGeometry( snowPoints, 64 );
        const snow = new THREE.Mesh( snowGeo, snowMaterial );
        snow.rotation.x = Math.PI;
        snow.position.y = 35;
        mountainGroup.add(snow);
        
        // Scissor Lift mechanism for uplift
        const liftGroup = new THREE.Group();
        const beamGeo = new THREE.BoxGeometry(2, 25, 2);
        
        const beam1 = new THREE.Mesh(beamGeo, steel);
        beam1.rotation.z = Math.PI/4;
        liftGroup.add(beam1);
        meshes.scissor1 = beam1;
        
        const beam2 = new THREE.Mesh(beamGeo, steel);
        beam2.rotation.z = -Math.PI/4;
        liftGroup.add(beam2);
        meshes.scissor2 = beam2;
        
        liftGroup.position.y = 5;
        mountainGroup.add(liftGroup);

        return mountainGroup;
    }

    // --- MACHINE ASSEMBLY ---
    
    // Main Base Platform
    const basePlatform = createIBeam(60, 40, 5);
    basePlatform.position.y = 0;
    group.add(basePlatform);

    // Drive System
    const wheels = [];
    const wheelPositions = [
        [-25, -5, -22], [25, -5, -22],
        [-25, -5, 22], [25, -5, 22]
    ];
    wheelPositions.forEach(pos => {
        const wheel = createWheel();
        wheel.position.set(pos[0], pos[1], pos[2]);
        group.add(wheel);
        wheels.push(wheel);
    });
    meshes.wheels = wheels;

    // Operator Cabin
    const cabin = createCabin();
    cabin.position.set(-20, 5, 15);
    cabin.rotation.y = -Math.PI / 4;
    group.add(cabin);

    // Hydraulic Rams
    const leftRams = [];
    const rightRams = [];
    for(let z of [-10, 0, 10]) {
        const leftRam = createHydraulicCylinder(2, 20);
        leftRam.group.position.set(-30, 8, z);
        leftRam.group.rotation.z = -Math.PI / 2;
        group.add(leftRam.group);
        leftRams.push(leftRam.inner);

        const rightRam = createHydraulicCylinder(2, 20);
        rightRam.group.position.set(30, 8, z);
        rightRam.group.rotation.z = Math.PI / 2;
        group.add(rightRam.group);
        rightRams.push(rightRam.inner);
    }
    meshes.leftRams = leftRams;
    meshes.rightRams = rightRams;

    // Tectonic Plates
    const leftPlate = createTectonicPlate(true);
    leftPlate.position.set(-20, 15, 0);
    group.add(leftPlate);
    meshes.leftPlate = leftPlate;

    const rightPlate = createTectonicPlate(false);
    rightPlate.position.set(20, 15, 0);
    // invert geometry for right side fit
    rightPlate.scale.x = -1;
    group.add(rightPlate);
    meshes.rightPlate = rightPlate;

    // Central Suture Zone / Mountain
    const mountain = createCentralMountain();
    mountain.position.set(0, 15, 0);
    group.add(mountain);
    meshes.mountain = mountain;

    // Magma Plume underneath
    const plumeGeo = new THREE.CylinderGeometry(8, 15, 20, 32);
    const plume = new THREE.Mesh(plumeGeo, magmaMaterial);
    plume.position.set(0, 5, 0);
    group.add(plume);
    meshes.plume = plume;

    // Exhaust Stacks
    for(let x of [-15, 15]) {
        const stackGeo = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
        const stack = new THREE.Mesh(stackGeo, chrome);
        stack.position.set(x, 10, -18);
        group.add(stack);
        
        // Add ribs
        for(let y=5; y<15; y+=2) {
            const rib = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.2, 8, 16), darkSteel);
            rib.position.set(x, y, -18);
            rib.rotation.x = Math.PI/2;
            group.add(rib);
        }
    }


    // --- PARTS LIST ---
    parts.push(
        {
            name: "Main Locomotion Treads",
            description: "Massive wheel systems utilizing TorusGeometry and hundreds of BoxGeometry lugs to provide extreme grip while maneuvering the massive rig into position.",
            material: "Reinforced Rubber / Dark Steel",
            function: "Provides mobility to the entire tectonic simulator.",
            assemblyOrder: 1,
            connections: ["Main Base Platform"],
            failureEffect: "Simulator becomes immobile, risking misalignment of seismic simulation vectors.",
            cascadeFailures: ["Suspension collapse", "Axle shearing"],
            originalPosition: { x: 0, y: -5, z: -22 },
            explodedPosition: { x: 0, y: -20, z: -40 }
        },
        {
            name: "Main Base Platform",
            description: "An immensely heavy I-beam framework constructed from ExtrudeGeometry that supports the incredible forces of the simulated tectonic collision.",
            material: "Dark Steel",
            function: "Structural foundation preventing the machine from tearing itself apart during peak compression.",
            assemblyOrder: 2,
            connections: ["Main Locomotion Treads", "Hydraulic Rams", "Magma Plume"],
            failureEffect: "Catastrophic structural failure, machine implosion.",
            cascadeFailures: ["Rams detach", "Plates collapse"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -10, z: 0 }
        },
        {
            name: "Primary Hydraulic Rams (Left)",
            description: "A bank of massive hydraulic cylinders and pistons that apply immense lateral force to the left continental plate.",
            material: "Steel / Chrome",
            function: "Simulates tectonic drift driving the left plate eastward.",
            assemblyOrder: 3,
            connections: ["Main Base Platform", "Left Continental Plate"],
            failureEffect: "Loss of left-side lateral pressure.",
            cascadeFailures: ["Right plate overrides left plate", "Hydraulic fluid rupture"],
            originalPosition: { x: -30, y: 8, z: 0 },
            explodedPosition: { x: -50, y: 8, z: 0 }
        },
        {
            name: "Primary Hydraulic Rams (Right)",
            description: "A bank of massive hydraulic cylinders and pistons that apply immense lateral force to the right continental plate.",
            material: "Steel / Chrome",
            function: "Simulates tectonic drift driving the right plate westward.",
            assemblyOrder: 4,
            connections: ["Main Base Platform", "Right Continental Plate"],
            failureEffect: "Loss of right-side lateral pressure.",
            cascadeFailures: ["Subduction anomaly", "Hydraulic pressure feedback"],
            originalPosition: { x: 30, y: 8, z: 0 },
            explodedPosition: { x: 50, y: 8, z: 0 }
        },
        {
            name: "Left Continental Plate (Crust Layer)",
            description: "A highly complex extruded mesh representing the brittle, lighter crustal rock of the left continent.",
            material: "Crust Material (Composite)",
            function: "Folds and fractures upon impact to simulate orogeny (mountain building).",
            assemblyOrder: 5,
            connections: ["Left Continental Plate (Mantle Layer)", "Primary Hydraulic Rams (Left)"],
            failureEffect: "Unrealistic deformation without folding.",
            cascadeFailures: ["Suture zone collapse"],
            originalPosition: { x: -20, y: 20, z: 0 },
            explodedPosition: { x: -30, y: 35, z: 0 }
        },
        {
            name: "Left Continental Plate (Mantle Layer)",
            description: "Denser extruded layer beneath the crust simulating the lithospheric mantle.",
            material: "Mantle Material (Composite)",
            function: "Transmits the hydraulic force to the crust and central collision zone.",
            assemblyOrder: 6,
            connections: ["Left Continental Plate (Crust Layer)", "Magma Plume"],
            failureEffect: "Crust detaches from the driving mechanism.",
            cascadeFailures: ["Loss of friction data"],
            originalPosition: { x: -20, y: 10, z: 0 },
            explodedPosition: { x: -30, y: 5, z: 0 }
        },
        {
            name: "Right Continental Plate (Crust Layer)",
            description: "Extruded mesh representing the converging right continent's upper crust.",
            material: "Crust Material (Composite)",
            function: "Collides with the left plate to drive extreme vertical uplift.",
            assemblyOrder: 7,
            connections: ["Right Continental Plate (Mantle Layer)", "Primary Hydraulic Rams (Right)"],
            failureEffect: "Plate shatters prematurely.",
            cascadeFailures: ["Simulation abort"],
            originalPosition: { x: 20, y: 20, z: 0 },
            explodedPosition: { x: 30, y: 35, z: 0 }
        },
        {
            name: "Right Continental Plate (Mantle Layer)",
            description: "Thick, dense base layer of the right continent.",
            material: "Mantle Material (Composite)",
            function: "Resists subduction and forces a pure continental collision.",
            assemblyOrder: 8,
            connections: ["Right Continental Plate (Crust Layer)"],
            failureEffect: "Accidental subduction instead of collision.",
            cascadeFailures: ["Magma chamber disruption"],
            originalPosition: { x: 20, y: 10, z: 0 },
            explodedPosition: { x: 30, y: 5, z: 0 }
        },
        {
            name: "Central Suture Zone (Mountain Uplift)",
            description: "A highly complex lathed and extruded assembly that physically rises as the plates compress, mirroring the Himalayas.",
            material: "Mixed Lithology",
            function: "Demonstrates the massive accumulation and folding of rock layers in a collision.",
            assemblyOrder: 9,
            connections: ["Left Continental Plate (Crust Layer)", "Right Continental Plate (Crust Layer)", "Scissor Lift Mechanism"],
            failureEffect: "Fails to elevate, indicating a lack of horizontal compression.",
            cascadeFailures: ["Scissor lift jam"],
            originalPosition: { x: 0, y: 35, z: 0 },
            explodedPosition: { x: 0, y: 60, z: 0 }
        },
        {
            name: "Scissor Lift Mechanism",
            description: "Heavy steel box beams crossed in a scissor configuration to mechanically raise the mountain peak.",
            material: "Steel",
            function: "Translates horizontal hydraulic compression into massive vertical uplift.",
            assemblyOrder: 10,
            connections: ["Central Suture Zone (Mountain Uplift)", "Main Base Platform"],
            failureEffect: "Mountain gets crushed horizontally instead of pushed up.",
            cascadeFailures: ["Peak collapse"],
            originalPosition: { x: 0, y: 20, z: 0 },
            explodedPosition: { x: 0, y: 20, z: 20 }
        },
        {
            name: "Magma Plume Simulator",
            description: "A massive, glowing cylindrical chamber utilizing highly emissive neon materials to simulate asthenospheric heat.",
            material: "Emissive Magma Plasma",
            function: "Applies thermal expansion parameters to the bottom of the tectonic plates.",
            assemblyOrder: 11,
            connections: ["Main Base Platform", "Left Continental Plate (Mantle Layer)", "Right Continental Plate (Mantle Layer)"],
            failureEffect: "Loss of thermal buoyancy in the simulation.",
            cascadeFailures: ["Lithosphere stiffens excessively"],
            originalPosition: { x: 0, y: 5, z: 0 },
            explodedPosition: { x: 0, y: -10, z: -20 }
        },
        {
            name: "Operator Control Cabin",
            description: "A detailed glass-enclosed command center with glowing screens, joysticks, steering wheel, and warning beacons.",
            material: "Tinted Glass / Dark Steel",
            function: "Houses the scientists and engineers orchestrating the massive tectonic collision.",
            assemblyOrder: 12,
            connections: ["Main Base Platform"],
            failureEffect: "Loss of manual override capabilities.",
            cascadeFailures: ["Simulation runs out of control"],
            originalPosition: { x: -20, y: 5, z: 15 },
            explodedPosition: { x: -30, y: 5, z: 30 }
        },
        {
            name: "Exhaust Stacks",
            description: "Towering ribbed chrome cylinders that vent immense heat and pressure from the hydraulic drive systems.",
            material: "Chrome / Dark Steel",
            function: "Maintains safe operating temperatures for the machine's core.",
            assemblyOrder: 13,
            connections: ["Main Base Platform"],
            failureEffect: "Thermal runaway in hydraulic pumps.",
            cascadeFailures: ["System-wide shutdown"],
            originalPosition: { x: -15, y: 10, z: -18 },
            explodedPosition: { x: -15, y: 30, z: -30 }
        },
        {
            name: "Hydraulic Fluid Lines",
            description: "Thick rubber tubes (TubeGeometry) channeling pressurized fluid to the rams.",
            material: "Rubber",
            function: "Delivers power from the central pumps to the drive cylinders.",
            assemblyOrder: 14,
            connections: ["Primary Hydraulic Rams (Left)", "Primary Hydraulic Rams (Right)"],
            failureEffect: "Massive high-pressure fluid leak.",
            cascadeFailures: ["Instant loss of compression"],
            originalPosition: { x: -30, y: 15, z: 0 },
            explodedPosition: { x: -30, y: 25, z: 0 }
        },
        {
            name: "Snow Cap Module",
            description: "High-altitude lathed geometry placed on the central mountain peak.",
            material: "Snow Material",
            function: "Simulates the glaciation occurring on newly formed high-altitude orogenic belts.",
            assemblyOrder: 15,
            connections: ["Central Suture Zone (Mountain Uplift)"],
            failureEffect: "Inaccurate climate modeling during uplift.",
            cascadeFailures: ["Erosion calculations fail"],
            originalPosition: { x: 0, y: 50, z: 0 },
            explodedPosition: { x: 0, y: 70, z: 0 }
        }
    );

    const description = "The Tectonophysics Continental Collision Simulator is a hyper-realistic, massively scaled mechanical rig designed to physically model the sheer forces of continental drift and orogeny. Featuring gargantuan hydraulic rams, dense extruded tectonic strata, a mechanized scissor-lift mountain building zone, and a highly detailed operator cabin, this high-tech unit compresses continental plates together to form soaring peaks mirroring the Himalayas.";

    const quizQuestions = [
        {
            question: "What specific geological process is being simulated by the Scissor Lift Mechanism and the Central Suture Zone?",
            options: [
                "Subduction and trench formation",
                "Orogeny (Mountain building via continental collision)",
                "Seafloor spreading at a mid-ocean ridge",
                "Transform fault shearing"
            ],
            correctAnswer: 1,
            explanation: "When two low-density continental plates collide, neither can easily subduct. The incredible compression forces the rock upwards, folding and faulting to build massive mountain ranges, a process known as orogeny."
        },
        {
            question: "Which components supply the immense lateral forces required to drive the tectonic plates together?",
            options: [
                "The Magma Plume Simulator",
                "The Main Locomotion Treads",
                "The Exhaust Stacks",
                "The Primary Hydraulic Rams"
            ],
            correctAnswer: 3,
            explanation: "The Primary Hydraulic Rams are massive steel and chrome cylinders that generate the extreme lateral pressure needed to simulate tectonic drift."
        },
        {
            question: "Why is a dense Mantle Layer included beneath the lighter Crust Layer in the plate models?",
            options: [
                "To accurately represent the lithosphere which transmits tectonic forces.",
                "To make the plates look darker.",
                "To absorb hydraulic fluid leaks.",
                "To increase the speed of the collision."
            ],
            correctAnswer: 0,
            explanation: "Tectonic plates consist of both the crust and the uppermost solid mantle (collectively the lithosphere). The strong, dense mantle layer is crucial for transmitting the immense driving forces across the plate."
        },
        {
            question: "What happens to the Magma Plume Simulator during a purely continental collision?",
            options: [
                "It erupts into a massive stratovolcano.",
                "It primarily applies thermal buoyancy without producing major surface volcanism.",
                "It instantly cools into solid granite.",
                "It dissolves the tectonic plates completely."
            ],
            correctAnswer: 1,
            explanation: "In a continent-continent collision, the thick crust prevents magma from easily reaching the surface, so volcanic activity is rare compared to subduction zones. The plume primarily provides deep thermal buoyancy."
        },
        {
            question: "If the Simulator's Hydraulic Fluid Lines fail, what cascade failure is immediately triggered?",
            options: [
                "The snow cap instantly melts.",
                "The operator cabin detaches.",
                "There is an instant loss of compression, halting the uplift of the central mountain.",
                "The wheels spin out of control."
            ],
            correctAnswer: 2,
            explanation: "The hydraulic lines deliver the high pressure needed by the rams. A failure causes an instant loss of lateral compression, which would immediately stall the collision and the mountain building process."
        }
    ];

    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // 1. Slowly rotate the massive drive wheels
        activeMeshes.wheels.forEach(wheel => {
            wheel.rotation.x -= 0.05 * speed;
        });

        // 2. Tectonic Collision Cycle using sine wave
        // Plates move inward, mountain goes up
        const compression = (Math.sin(t * 0.5) + 1) / 2; // 0 to 1
        
        // Move plates
        activeMeshes.leftPlate.position.x = -20 + (compression * 8);
        activeMeshes.rightPlate.position.x = 20 - (compression * 8);

        // Move hydraulic pistons outward to match plate movement
        activeMeshes.leftRams.forEach(piston => {
            piston.position.y = 20 + (compression * 8);
        });
        activeMeshes.rightRams.forEach(piston => {
            piston.position.y = 20 + (compression * 8);
        });

        // 3. Central Mountain Uplift
        activeMeshes.mountain.position.y = 15 + (compression * 15);
        
        // Scissor lift articulation
        const scissorAngle = Math.PI/4 - (compression * 0.4);
        activeMeshes.scissor1.rotation.z = scissorAngle;
        activeMeshes.scissor2.rotation.z = -scissorAngle;

        // 4. Pulse the Magma Plume
        const pulse = (Math.sin(t * 2) + 1) / 2;
        activeMeshes.plume.material.emissiveIntensity = 1.5 + pulse * 2.0;
        
        // 5. Warning beacon spin
        if(activeMeshes.warningBeacon) {
            activeMeshes.warningBeacon.material.emissiveIntensity = (Math.sin(t * 10) > 0) ? 5.0 : 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createContinentalCollision() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
