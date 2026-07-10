import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "The Ultra God Tier Cosmic Acid-Base Neutralizer is a planetary-scale apparatus designed to balance the pH of entire worlds. Utilizing hyper-dimensional burettes filled with exotic Bose-Einstein condensate bases, it drops immense volumes of neutralizing reagents into violent, swirling oceans of superacids, stabilizing rogue planets. This god-like vehicle traverses dimensional rifts on massive hyper-tires, deploying its chemical payload with pinpoint relativistic accuracy.";

    // -------------------------------------------------------------------------
    // CUSTOM HYPER-TECH MATERIALS
    // -------------------------------------------------------------------------
    const acidMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xaa0022,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.2,
        side: THREE.DoubleSide
    });

    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0022aa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.95,
        roughness: 0.1,
        metalness: 0.3
    });

    const neutralMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00aa44,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.2
    });

    const energyCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.5,
        wireframe: true
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const shockwaveMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    // -------------------------------------------------------------------------
    // COMPLEX GEOMETRY GENERATORS
    // -------------------------------------------------------------------------
    function createGearGeometry(teeth, outerRadius, innerRadius, thickness) {
        const shape = new THREE.Shape();
        const numPoints = teeth * 4;
        const angleStep = (Math.PI * 2) / numPoints;

        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            const r = (i % 4 === 1 || i % 4 === 2) ? outerRadius : innerRadius;
            if (i === 0) {
                shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            } else {
                shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
        }
        shape.closePath();

        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRadius * 0.4, 0, Math.PI * 2, false);
        shape.holes.push(hole);

        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: thickness * 0.05,
            bevelThickness: thickness * 0.05
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createBuretteGlass() {
        const points = [];
        // Intricate lathe profile for hyper-dimensional burette
        for ( let i = 0; i <= 30; i ++ ) {
            const y = i * 4; // Height up to 120
            let x;
            if (i < 3) x = 2; // Tip
            else if (i < 5) x = 2 + (i-2)*2; // Expansion
            else if (i < 22) x = 12 + Math.sin(i * 0.5) * 2; // Main ridged body
            else if (i < 27) x = 12 - (i-21)*1.5; // Tapering top
            else x = 4.5; // Top nozzle
            points.push( new THREE.Vector2( x, y ) );
        }
        return new THREE.LatheGeometry( points, 64 );
    }

    function createBuretteCore() {
        const points = [];
        // Inner glowing liquid volume
        for ( let i = 0; i <= 25; i ++ ) {
            const y = (i * 4) + 2; 
            let x;
            if (i < 2) x = 1.5;
            else if (i < 4) x = 1.5 + (i-2)*1.8;
            else if (i < 20) x = 10;
            else if (i < 24) x = 10 - (i-19)*1.5;
            else x = 3;
            points.push( new THREE.Vector2( x, y ) );
        }
        return new THREE.LatheGeometry( points, 64 );
    }

    function createHyperTire() {
        const tireGroup = new THREE.Group();
        
        // Main torus for the massive planetary tire
        const tireGeo = new THREE.TorusGeometry(120, 45, 64, 128);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tireMesh);

        // Hundreds of tiny extruded BoxGeometry lugs around circumference
        const lugGeo = new THREE.BoxGeometry(50, 15, 30);
        const numLugs = 180;
        for(let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            const r = 120 + 45 - 5; // Embedded slightly into the torus
            
            lug.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
            lug.rotation.z = angle;
            
            // Aggressive chevron alternating pattern
            if (i % 2 === 0) {
                lug.position.z = 18;
                lug.rotation.y = Math.PI / 6;
            } else {
                lug.position.z = -18;
                lug.rotation.y = -Math.PI / 6;
            }
            tireGroup.add(lug);
        }

        // Extremely detailed rim
        const rimGeo = new THREE.CylinderGeometry(100, 100, 70, 64);
        const rimMesh = new THREE.Mesh(rimGeo, darkSteel);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);
        
        // Inner hubcap
        const hubGeo = new THREE.CylinderGeometry(40, 40, 75, 32);
        const hubMesh = new THREE.Mesh(hubGeo, chrome);
        hubMesh.rotation.x = Math.PI / 2;
        tireGroup.add(hubMesh);

        // Complex spoke arrays (overlapping rings of spokes)
        const spokeGeo = new THREE.CylinderGeometry(4, 4, 100, 16);
        const numSpokes = 24;
        for(let j = 0; j < 2; j++) {
            const zOffset = j === 0 ? 25 : -25;
            for(let i = 0; i < numSpokes; i++) {
                const spoke = new THREE.Mesh(spokeGeo, chrome);
                spoke.rotation.x = Math.PI / 2;
                spoke.rotation.z = (i / numSpokes) * Math.PI + (j * 0.1);
                spoke.position.z = zOffset;
                tireGroup.add(spoke);
            }
        }

        // Inner glowing gravity-repulsor ring
        const repulsorGeo = new THREE.TorusGeometry(80, 5, 32, 64);
        const repulsorMesh = new THREE.Mesh(repulsorGeo, neonCyan);
        tireGroup.add(repulsorMesh);

        return tireGroup;
    }

    // -------------------------------------------------------------------------
    // THE PLANETARY OCEAN
    // -------------------------------------------------------------------------
    const oceanGroup = new THREE.Group();
    const oceanRadius = 300;
    const oceanGeo = new THREE.IcosahedronGeometry(oceanRadius, 30); // Ultra-high vertex count
    const oceanMesh = new THREE.Mesh(oceanGeo, acidMaterial);
    oceanGroup.add(oceanMesh);
    
    // Store original vertices for wave manipulation
    const posAttribute = oceanGeo.attributes.position;
    const oceanVertices = [];
    for (let i = 0; i < posAttribute.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(posAttribute, i);
        oceanVertices.push({
            original: v.clone(),
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            phaseZ: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 2.0,
            amplitude: 5 + Math.random() * 15
        });
    }
    
    oceanGroup.position.set(0, -250, 0);
    group.add(oceanGroup);
    meshes.ocean = oceanMesh;
    meshes.oceanVertices = oceanVertices;
    meshes.oceanMaterial = acidMaterial;

    parts.push({
        name: 'Planetary Acid Ocean',
        description: 'A swirling, turbulent mass of hyper-corrosive exotic superacid. The target of our cosmic titration protocol.',
        material: acidMaterial,
        function: 'Central reaction vessel of the planet.',
        assemblyOrder: 1,
        connections: ['Dimensional Crust', 'Burette Impact Zones'],
        failureEffect: 'Runaway acidification, dissolving the local space-time continuum.',
        cascadeFailures: ['Atmospheric Ignition', 'Core Meltdown'],
        originalPosition: oceanGroup.position.clone(),
        explodedPosition: oceanGroup.position.clone().add(new THREE.Vector3(0, -300, 0))
    });

    // -------------------------------------------------------------------------
    // MASSIVE HYPER-TIRES & SUSPENSION
    // -------------------------------------------------------------------------
    const wheelPositions = [
        new THREE.Vector3(-450, -50, 450),
        new THREE.Vector3(450, -50, 450),
        new THREE.Vector3(-450, -50, -450),
        new THREE.Vector3(450, -50, -450)
    ];
    meshes.tires = [];
    meshes.pistons = [];

    wheelPositions.forEach((pos, index) => {
        const tire = createHyperTire();
        tire.position.copy(pos);
        // Ensure they roll along X axis primarily
        tire.rotation.y = Math.PI / 2;
        group.add(tire);
        meshes.tires.push(tire);

        parts.push({
            name: `Hyper-Tire Array ${index + 1}`,
            description: `Massive planetary-scale wheels wrapped in aggressive vulcanized lugs, capable of traversing dimensional acid-crusts.`,
            material: rubber,
            function: 'Locomotion across extreme planetary topologies.',
            assemblyOrder: 2 + index,
            connections: ['Suspension Piston'],
            failureEffect: 'Vehicle sinks into the superacid ocean.',
            cascadeFailures: ['Hull Breach', 'Total System Annihilation'],
            originalPosition: tire.position.clone(),
            explodedPosition: tire.position.clone().add(new THREE.Vector3(pos.x > 0 ? 200 : -200, 0, pos.z > 0 ? 200 : -200))
        });

        // Suspension System (Cylinder within Cylinder)
        const suspGroup = new THREE.Group();
        
        // Outer housing
        const outerGeo = new THREE.CylinderGeometry(30, 30, 200, 32);
        const outerMesh = new THREE.Mesh(outerGeo, darkSteel);
        outerMesh.position.y = 100;
        suspGroup.add(outerMesh);

        // Inner piston
        const innerGeo = new THREE.CylinderGeometry(20, 20, 250, 32);
        const innerMesh = new THREE.Mesh(innerGeo, chrome);
        innerMesh.position.y = -50;
        suspGroup.add(innerMesh);

        // Hydraulic fluid tube wrapping
        const spiralPath = [];
        for(let i=0; i<50; i++) {
            const a = i * 0.5;
            const y = i * 3 - 50;
            spiralPath.push(new THREE.Vector3(Math.cos(a)*35, y, Math.sin(a)*35));
        }
        const tubeCurve = new THREE.CatmullRomCurve3(spiralPath);
        const tubeGeo = new THREE.TubeGeometry(tubeCurve, 100, 3, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, copper);
        suspGroup.add(tubeMesh);

        suspGroup.position.copy(pos);
        suspGroup.position.y += 50; // Attach above tire
        group.add(suspGroup);
        meshes.pistons.push({ inner: innerMesh, basePos: innerMesh.position.y, phase: index * Math.PI/2 });

        parts.push({
            name: `Hydraulic Suspension Piston ${index + 1}`,
            description: `A towering shock-absorption strut designed to handle the tectonic impacts of walking on a rogue planet.`,
            material: chrome,
            function: 'Stabilizes the cosmic neutralizer frame during seismic events.',
            assemblyOrder: 6 + index,
            connections: ['Hyper-Tire', 'Main Chassis'],
            failureEffect: 'Catastrophic tilting of the burette array.',
            cascadeFailures: ['Reagent Spill', 'Asymmetric Neutralization'],
            originalPosition: suspGroup.position.clone(),
            explodedPosition: suspGroup.position.clone().add(new THREE.Vector3(0, 150, 0))
        });
    });

    // -------------------------------------------------------------------------
    // MAIN CHASSIS & HYDRAULIC NETWORK
    // -------------------------------------------------------------------------
    const chassisGroup = new THREE.Group();
    
    const beamGeo1 = new THREE.BoxGeometry(1000, 80, 200);
    const beamGeo2 = new THREE.BoxGeometry(200, 80, 600);
    
    const beamFront = new THREE.Mesh(beamGeo1, darkSteel);
    beamFront.position.set(0, 0, 400);
    const beamBack = new THREE.Mesh(beamGeo1, darkSteel);
    beamBack.position.set(0, 0, -400);
    const beamLeft = new THREE.Mesh(beamGeo2, darkSteel);
    beamLeft.position.set(-400, 0, 0);
    const beamRight = new THREE.Mesh(beamGeo2, darkSteel);
    beamRight.position.set(400, 0, 0);

    // Lots of rivets on the beams
    const rivetGeo = new THREE.SphereGeometry(3, 8, 8);
    for(let i=-450; i<=450; i+=50) {
        let r1 = new THREE.Mesh(rivetGeo, steel);
        r1.position.set(i, 40, 480);
        beamFront.add(r1);
        let r2 = new THREE.Mesh(rivetGeo, steel);
        r2.position.set(i, 40, -480);
        beamBack.add(r2);
    }

    chassisGroup.add(beamFront, beamBack, beamLeft, beamRight);
    chassisGroup.position.y = 350;
    group.add(chassisGroup);

    parts.push({
        name: 'Dimensional Main Chassis',
        description: 'The super-massive structural frame that holds the titration apparatus above the planetary ocean.',
        material: darkSteel,
        function: 'Structural integrity and load bearing.',
        assemblyOrder: 10,
        connections: ['Suspension Pistons', 'Burette Gantry', 'Operator Cabin'],
        failureEffect: 'Machine collapses instantly under hyper-gravity.',
        cascadeFailures: ['Complete Structural Failure'],
        originalPosition: chassisGroup.position.clone(),
        explodedPosition: chassisGroup.position.clone().add(new THREE.Vector3(0, 300, 0))
    });

    // -------------------------------------------------------------------------
    // OPERATOR CABIN
    // -------------------------------------------------------------------------
    const cabinGroup = new THREE.Group();
    
    // Hull
    const cabinHullGeo = new THREE.OctahedronGeometry(60, 2);
    const cabinHull = new THREE.Mesh(cabinHullGeo, aluminum);
    cabinGroup.add(cabinHull);

    // Tinted Glass Windows
    const windowGeo = new THREE.SphereGeometry(50, 32, 16, 0, Math.PI * 2, 0, Math.PI/2.5);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.rotation.x = Math.PI / 4;
    cabinGroup.add(windowMesh);

    // Glowing Control Panels inside
    const panelGeo = new THREE.BoxGeometry(40, 15, 2);
    const panelMesh = new THREE.Mesh(panelGeo, neonCyan);
    panelMesh.position.set(0, -10, 40);
    panelMesh.rotation.x = -Math.PI / 6;
    cabinGroup.add(panelMesh);

    // Joysticks
    const stickGeo = new THREE.CylinderGeometry(1, 1, 15, 8);
    const stick1 = new THREE.Mesh(stickGeo, plastic);
    stick1.position.set(-10, -5, 35);
    const stick2 = new THREE.Mesh(stickGeo, plastic);
    stick2.position.set(10, -5, 35);
    cabinGroup.add(stick1, stick2);

    // Ladders leading down to chassis
    const ladderGeo = new THREE.BoxGeometry(2, 80, 2);
    const rungGeo = new THREE.BoxGeometry(15, 1, 1);
    const ladderGroup = new THREE.Group();
    const lRail = new THREE.Mesh(ladderGeo, steel);
    lRail.position.set(-8, -40, 0);
    const rRail = new THREE.Mesh(ladderGeo, steel);
    rRail.position.set(8, -40, 0);
    ladderGroup.add(lRail, rRail);
    for(let i=0; i<10; i++) {
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.position.set(0, -75 + (i * 8), 0);
        ladderGroup.add(rung);
    }
    ladderGroup.position.set(0, -40, 50);
    cabinGroup.add(ladderGroup);

    cabinGroup.position.set(0, 500, 400); // Front-center, high up
    group.add(cabinGroup);

    parts.push({
        name: 'Command & Control Cabin',
        description: 'A pressurized, radiation-shielded command center where the Head Cosmic Chemist monitors the planetary titration progress.',
        material: aluminum,
        function: 'Houses living crew and sensitive telemetry hardware.',
        assemblyOrder: 11,
        connections: ['Main Chassis', 'Telemetry Sensors'],
        failureEffect: 'Crew exposure to exotic superacids and immediate localized time-dilation.',
        cascadeFailures: ['Loss of Control', 'Titration Runaway'],
        originalPosition: cabinGroup.position.clone(),
        explodedPosition: cabinGroup.position.clone().add(new THREE.Vector3(0, 200, 200))
    });

    // -------------------------------------------------------------------------
    // THE 6 MASSIVE HYPER-BURETTES & REGULATORS
    // -------------------------------------------------------------------------
    meshes.burettes = [];
    meshes.droplets = [];
    meshes.shockwaves = [];
    meshes.gears = [];

    const numBurettes = 6;
    const buretteRadius = 180;
    
    for(let i = 0; i < numBurettes; i++) {
        const angle = (i / numBurettes) * Math.PI * 2;
        const bGroup = new THREE.Group();
        
        // 1. Glass Chamber
        const glassGeo = createBuretteGlass();
        const glassMesh = new THREE.Mesh(glassGeo, glass);
        glassMesh.rotation.x = Math.PI; // point downwards
        bGroup.add(glassMesh);

        // 2. Inner Reagent Core (Glowing)
        const coreGeo = createBuretteCore();
        const coreMesh = new THREE.Mesh(coreGeo, baseMaterial);
        coreMesh.rotation.x = Math.PI;
        bGroup.add(coreMesh);

        // 3. Flow Regulator Gears
        const gearGeo = createGearGeometry(12, 25, 10, 5);
        const gearMesh1 = new THREE.Mesh(gearGeo, copper);
        gearMesh1.position.set(0, -90, 15);
        gearMesh1.rotation.x = Math.PI / 2;
        const gearMesh2 = new THREE.Mesh(gearGeo, copper);
        gearMesh2.position.set(25, -90, -10);
        gearMesh2.rotation.x = Math.PI / 2;
        
        bGroup.add(gearMesh1, gearMesh2);
        meshes.gears.push(gearMesh1);
        meshes.gears.push({ mesh: gearMesh2, inverted: true });

        // 4. Exhaust Stacks for Pressure Release
        const exhaustGeo = new THREE.CylinderGeometry(3, 5, 40, 16);
        const exhaustMesh = new THREE.Mesh(exhaustGeo, darkSteel);
        exhaustMesh.position.set(15, 80, 0);
        exhaustMesh.rotation.z = Math.PI / 6;
        bGroup.add(exhaustMesh);

        // Place burette in a circle around the center
        bGroup.position.set(Math.cos(angle) * buretteRadius, 250, Math.sin(angle) * buretteRadius);
        group.add(bGroup);
        
        meshes.burettes.push(bGroup);

        parts.push({
            name: `Hyper-Burette Array Module ${i+1}`,
            description: `A massive containment vessel holding exotic Bose-Einstein condensate bases. Sculpted from dimensional quartz.`,
            material: glass,
            function: 'Stores and precisely dispenses neutralizing cosmic base.',
            assemblyOrder: 12 + i,
            connections: ['Chassis Gantry', 'Flow Regulator Valves'],
            failureEffect: 'Massive uncontrolled reagent dump causing a localized matter-antimatter equivalent explosion.',
            cascadeFailures: ['Planetary Shattering'],
            originalPosition: bGroup.position.clone(),
            explodedPosition: bGroup.position.clone().add(new THREE.Vector3(Math.cos(angle)*300, 100, Math.sin(angle)*300))
        });
        
        parts.push({
            name: `Flow Regulator Gearbox ${i+1}`,
            description: `Heavy copper gearing system that controls the sub-atomic valve aperture of the burette tip.`,
            material: copper,
            function: 'Precise flow control of exotic reagents.',
            assemblyOrder: 18 + i,
            connections: ['Burette Tip', 'Telemetry Sensors'],
            failureEffect: 'Valve sticks open or closed.',
            cascadeFailures: ['Titration Inaccuracy'],
            originalPosition: new THREE.Vector3(bGroup.position.x, bGroup.position.y - 90, bGroup.position.z),
            explodedPosition: new THREE.Vector3(bGroup.position.x, bGroup.position.y - 150, bGroup.position.z)
        });

        // 5. Droplet System & Shockwaves
        // We create a drop that falls from the burette tip
        const dropGeo = new THREE.SphereGeometry(6, 16, 16);
        const dropMesh = new THREE.Mesh(dropGeo, baseMaterial);
        dropMesh.position.copy(bGroup.position);
        dropMesh.position.y -= 125; // at tip
        group.add(dropMesh);
        
        meshes.droplets.push({
            mesh: dropMesh,
            startX: bGroup.position.x,
            startY: bGroup.position.y - 125,
            startZ: bGroup.position.z,
            speed: 4 + Math.random() * 3,
            delay: Math.random() * 100 // frames before dropping
        });

        // Associated shockwave ring on the ocean surface
        const shockGeo = new THREE.TorusGeometry(10, 2, 16, 64);
        const shockMesh = new THREE.Mesh(shockGeo, shockwaveMat.clone());
        shockMesh.rotation.x = Math.PI / 2;
        // Place it just above ocean surface at this column
        shockMesh.position.set(bGroup.position.x, -5, bGroup.position.z);
        group.add(shockMesh);
        
        meshes.shockwaves.push({
            mesh: shockMesh,
            active: false,
            scale: 1,
            opacity: 1
        });
    }

    // -------------------------------------------------------------------------
    // QUANTUM SENSOR ARRAY & DIMENSIONAL ANCHORS
    // -------------------------------------------------------------------------
    meshes.sensors = [];
    const sensorGeo = new THREE.OctahedronGeometry(15, 1);
    const anchorGeo = new THREE.TorusKnotGeometry(20, 5, 64, 16);

    for(let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI/4);
        
        // Sensor
        const sensorMesh = new THREE.Mesh(sensorGeo, neonMagenta);
        sensorMesh.position.set(Math.cos(angle)*300, 350, Math.sin(angle)*300);
        group.add(sensorMesh);
        meshes.sensors.push(sensorMesh);

        // Anchor
        const anchorMesh = new THREE.Mesh(anchorGeo, energyCoreMat);
        anchorMesh.position.set(Math.cos(angle)*300, 420, Math.sin(angle)*300);
        group.add(anchorMesh);
        meshes.sensors.push(anchorMesh); // animate them together
        
        parts.push({
            name: `Quantum pH Sensor & Dimensional Anchor ${i+1}`,
            description: `Floating obelisks and toroidal knots that measure the hyper-pH of the ocean via quantum entanglement, while simultaneously locking the chassis to local spacetime.`,
            material: energyCoreMat,
            function: 'Telemetry and dimensional stability.',
            assemblyOrder: 24 + i,
            connections: ['Command Cabin Wireless Uplink'],
            failureEffect: 'Machine phases out of reality or miscalculates planetary pH.',
            cascadeFailures: ['Spacetime Shearing'],
            originalPosition: sensorMesh.position.clone(),
            explodedPosition: sensorMesh.position.clone().add(new THREE.Vector3(0, 300, 0))
        });
    }

    // -------------------------------------------------------------------------
    // MASSIVE HYDRAULIC PIPING (TubeGeometry)
    // -------------------------------------------------------------------------
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    
    for(let i = 0; i < 4; i++) {
        const signX = i % 2 === 0 ? 1 : -1;
        const signZ = i < 2 ? 1 : -1;
        
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 350, 0), // Center chassis
            new THREE.Vector3(signX * 100, 380, signZ * 100),
            new THREE.Vector3(signX * 250, 300, signZ * 250),
            new THREE.Vector3(signX * 400, 150, signZ * 400),
            new THREE.Vector3(signX * 450, 100, signZ * 450) // To suspension
        ]);
        const pipeGeo = new THREE.TubeGeometry(path, 64, 8, 16, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
        group.add(pipeMesh);

        parts.push({
            name: `Primary Hydraulic Artery ${i+1}`,
            description: `Massive braided steel hoses pumping ultra-dense hydraulic fluid to the suspension systems at immense pressures.`,
            material: darkSteel,
            function: 'Power transmission to locomotive and suspension systems.',
            assemblyOrder: 28 + i,
            connections: ['Main Pump House', `Suspension Piston ${i+1}`],
            failureEffect: 'Loss of hydraulic pressure, causing the corner to sag catastrophically.',
            cascadeFailures: ['Strut Buckling', 'Pipe Burst'],
            originalPosition: new THREE.Vector3(signX * 200, 250, signZ * 200),
            explodedPosition: new THREE.Vector3(signX * 500, 400, signZ * 500)
        });
    }

    // -------------------------------------------------------------------------
    // ANIMATION & LOGIC
    // -------------------------------------------------------------------------
    let totalDropsFallen = 0;
    const dropsToNeutralize = 1000; // It will slowly change color over time

    const animate = (time, speed, allMeshes) => {
        const t = time * speed;

        // 1. Swirling Violent Ocean
        if (meshes.oceanVertices && meshes.ocean) {
            const posAttr = meshes.ocean.geometry.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                const data = meshes.oceanVertices[i];
                // Complex interference wave formula
                const wave1 = Math.sin(t * data.speed + data.original.x * 0.05 + data.phaseX);
                const wave2 = Math.cos(t * data.speed * 0.8 + data.original.z * 0.05 + data.phaseZ);
                const wave3 = Math.sin(t * data.speed * 1.2 + data.original.y * 0.05 + data.phaseY);
                
                const displacement = (wave1 + wave2 + wave3) * data.amplitude;
                const newPos = data.original.clone().normalize().multiplyScalar(oceanRadius + displacement);
                
                posAttr.setXYZ(i, newPos.x, newPos.y, newPos.z);
            }
            posAttr.needsUpdate = true;
            meshes.ocean.geometry.computeVertexNormals();
            
            // Slow rotation of the entire ocean
            meshes.ocean.rotation.y = t * 0.1;
        }

        // 2. Tire Rotation & Locomotion Simulation
        if (meshes.tires) {
            meshes.tires.forEach(tire => {
                tire.rotation.z = -t * 0.5; // Rolling forward
            });
        }

        // 3. Hydraulic Suspension Pumping
        if (meshes.pistons) {
            meshes.pistons.forEach(piston => {
                // Sine wave pumping motion
                piston.inner.position.y = piston.basePos + Math.sin(t * 2.0 + piston.phase) * 15;
            });
        }

        // 4. Flow Regulator Gears
        if (meshes.gears) {
            meshes.gears.forEach(g => {
                if (g.inverted) {
                    g.mesh.rotation.y = -t * 2.0;
                } else {
                    g.rotation.y = t * 2.0;
                }
            });
        }

        // 5. Quantum Sensors Spinning
        if (meshes.sensors) {
            meshes.sensors.forEach((s, idx) => {
                s.rotation.x = t * 1.5 + idx;
                s.rotation.y = t * 2.0 + idx;
                s.position.y += Math.sin(t * 3.0 + idx) * 0.5; // Hover effect
            });
        }

        // 6. Droplet Falling & Shockwaves (Neutralization Logic)
        if (meshes.droplets && meshes.shockwaves) {
            meshes.droplets.forEach((drop, idx) => {
                if (drop.delay > 0) {
                    drop.delay -= speed * 10;
                    return;
                }
                
                drop.mesh.position.y -= drop.speed * speed * 20;

                // When drop hits ocean (Y approx -5)
                if (drop.mesh.position.y < -5) {
                    // Reset Drop
                    drop.mesh.position.y = drop.startY;
                    drop.delay = Math.random() * 50;
                    
                    // Trigger associated shockwave
                    const shock = meshes.shockwaves[idx];
                    shock.active = true;
                    shock.scale = 1;
                    shock.opacity = 1;
                    shock.mesh.material.opacity = 1;
                    
                    totalDropsFallen++;
                }
            });

            // Update shockwaves
            meshes.shockwaves.forEach(shock => {
                if (shock.active) {
                    shock.scale += speed * 5;
                    shock.opacity -= speed * 0.5;
                    
                    shock.mesh.scale.set(shock.scale, shock.scale, shock.scale);
                    shock.mesh.material.opacity = Math.max(0, shock.opacity);
                    
                    if (shock.opacity <= 0) {
                        shock.active = false;
                        shock.mesh.scale.set(1, 1, 1);
                    }
                }
            });
        }

        // 7. Global Color Change (Titration Progress)
        if (meshes.oceanMaterial) {
            const progress = Math.min(totalDropsFallen / dropsToNeutralize, 1.0);
            // Lerp from Acid (0xff0044) to Neutral (0x00ff88)
            const acidC = new THREE.Color(0xff0044);
            const neutralC = new THREE.Color(0x00ff88);
            meshes.oceanMaterial.color.lerpColors(acidC, neutralC, progress);
            
            // Emissive also lerps
            const acidE = new THREE.Color(0xaa0022);
            const neutralE = new THREE.Color(0x00aa44);
            meshes.oceanMaterial.emissive.lerpColors(acidE, neutralE, progress);
        }
    };

    // -------------------------------------------------------------------------
    // PHD-LEVEL COSMIC CHEMISTRY QUIZ
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In a hyper-dimensional titration of an exotic polyprotic acid (H4X) using a cosmic base (B(OH)4) where the reaction occurs in a non-Euclidean spacetime geometry causing a local time dilation factor γ = 1.5, what is the effective pKa shift due to relativistic kinetic energy modifications of the proton transfer?",
            options: [
                "1.5 log(γ)",
                "No shift, pKa is Lorentz invariant in all reference frames.",
                "-0.176 (assuming thermal equilibrium shifts proportionally to γ)",
                "Planck-scale perturbation causes an infinite shift."
            ],
            answer: 2,
            explanation: "The effective temperature of the system shifts by a factor of γ, altering the Boltzmann distribution of the proton states. The shift is calculated via the relativistic partition function, equating to approximately -0.176 in log scale for γ = 1.5."
        },
        {
            question: "When neutralizing a planetary-scale ocean of superacid (Hammett acidity function H0 < -25), what happens to the standard Gibbs free energy (ΔG°) of neutralization if the local gravity field exceeds 10^5 g and induces an extreme density gradient?",
            options: [
                "ΔG° becomes strictly positive, making the reaction non-spontaneous.",
                "The pressure-volume work term (PΔV) dominates, causing ΔG° to become highly depth-dependent and non-linear.",
                "Gravity has no effect on chemical thermodynamics.",
                "The superacid immediately solidifies due to Bose-Einstein condensation."
            ],
            answer: 1,
            explanation: "At 10^5 g, the hydrostatic pressure gradients are immense. The thermodynamic identity dG = VdP - SdT dictates that the massive pressure differential will dominate the free energy landscape, making ΔG° highly depth-dependent."
        },
        {
            question: "The cosmic burette uses magnetic monopoles to regulate the flow of antacid plasma. If the flow rate is given by J = -∇Φ_B, where Φ_B is the magnetic scalar potential, what is the required topological charge of the regulation manifold to prevent quantum backflow?",
            options: [
                "Chern number C = 0",
                "Topological charge Q = ±1 (Dirac quantization condition)",
                "An irrational winding number",
                "Magnetic monopoles do not possess a topological charge."
            ],
            answer: 1,
            explanation: "To enforce strict uni-directional flow without quantum tunneling backflow in a monopole-regulated valve, the manifold must wrap the gauge field such that the topological charge (or Dirac magnetic charge) is quantized to Q = ±1."
        },
        {
            question: "During the neutralization shockwave, the exotic planetary indicator molecules undergo a quantum phase transition rather than a simple electronic transition. Which universality class describes the critical behavior of the indicator's susceptibility near the equivalence point?",
            options: [
                "3D Ising Model",
                "1D Heisenberg Model",
                "XY Model with Berezinskii-Kosterlitz-Thouless transition",
                "Mean Field Theory"
            ],
            answer: 0,
            explanation: "Assuming the planetary ocean represents a 3-dimensional bulk fluid breaking a discrete Z2 symmetry (acid vs base phase domains near equivalence), the critical fluctuations of the indicator's susceptibility fall precisely into the 3D Ising universality class."
        },
        {
            question: "If the cosmic base reagent is composed of a macroscopic Bose-Einstein condensate (BEC) of hydroxide analogs, how does the macroscopic wave function's phase coherence affect the kinetics of the neutralization reaction across a planetary diameter of 10,000 km?",
            options: [
                "It causes the reaction rate to be limited by the speed of light.",
                "It induces instantaneous non-local neutralization via macroscopic quantum entanglement, bypassing standard diffusion limits.",
                "The reaction halts because BECs exist only at absolute zero.",
                "It causes the ocean to boil instantly due to latent heat."
            ],
            answer: 1,
            explanation: "Because the BEC is described by a single, coherent macroscopic wave function spanning the entire volume, interacting with it collapses the state globally. This allows for non-local neutralization kinetics that entirely bypass classical Fickian diffusion limits."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcidBaseTitration() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
