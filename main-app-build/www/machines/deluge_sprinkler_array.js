import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Helper functions for complex shapes
    function createPipe(length, radius, color = steel) {
        const geom = new THREE.CylinderGeometry(radius, radius, length, 32);
        const mesh = new THREE.Mesh(geom, color);
        return mesh;
    }

    function createElbow(radius, tubeRadius, color = steel) {
        const geom = new THREE.TorusGeometry(radius, tubeRadius, 16, 32, Math.PI / 2);
        const mesh = new THREE.Mesh(geom, color);
        return mesh;
    }

    function createFlange(radius, thickness, color = darkSteel) {
        const geom = new THREE.CylinderGeometry(radius, radius, thickness, 32);
        const mesh = new THREE.Mesh(geom, color);
        
        // Add bolt details
        const boltGeom = new THREE.CylinderGeometry(thickness * 0.2, thickness * 0.2, thickness * 1.5, 8);
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeom, chrome);
            bolt.position.set(Math.cos(angle) * radius * 0.7, 0, Math.sin(angle) * radius * 0.7);
            mesh.add(bolt);
        }
        return mesh;
    }

    function createValveBody(radius, color = steel) {
        const body = new THREE.Group();
        const centerGeom = new THREE.SphereGeometry(radius * 1.5, 32, 32);
        const center = new THREE.Mesh(centerGeom, color);
        body.add(center);

        const bonnetGeom = new THREE.CylinderGeometry(radius * 0.8, radius, radius * 2, 32);
        const bonnet = new THREE.Mesh(bonnetGeom, color);
        bonnet.position.y = radius;
        body.add(bonnet);

        const flangeTop = createFlange(radius * 1.2, radius * 0.2, color);
        flangeTop.position.y = radius * 2;
        body.add(flangeTop);

        return body;
    }

    function createHandwheel(radius, tubeRadius, spokes, color = steel) {
        const wheel = new THREE.Group();
        const rimGeom = new THREE.TorusGeometry(radius, tubeRadius, 16, 32);
        const rim = new THREE.Mesh(rimGeom, color);
        rim.rotation.x = Math.PI / 2;
        wheel.add(rim);

        const centerGeom = new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, tubeRadius * 2, 16);
        const center = new THREE.Mesh(centerGeom, color);
        wheel.add(center);

        const spokeGeom = new THREE.CylinderGeometry(tubeRadius * 0.5, tubeRadius * 0.5, radius, 16);
        for (let i = 0; i < spokes; i++) {
            const angle = (i / spokes) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, color);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = angle;
            spoke.position.set(Math.cos(angle) * radius * 0.5, 0, Math.sin(angle) * radius * 0.5);
            wheel.add(spoke);
        }
        return wheel;
    }

    function createPressureGauge(radius, color = brassMaterial) {
        const gauge = new THREE.Group();
        const bodyGeom = new THREE.CylinderGeometry(radius, radius, radius * 0.5, 32);
        const body = new THREE.Mesh(bodyGeom, color);
        body.rotation.x = Math.PI / 2;
        gauge.add(body);

        const dialGeom = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, radius * 0.52, 32);
        const dial = new THREE.Mesh(dialGeom, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }));
        dial.rotation.x = Math.PI / 2;
        gauge.add(dial);

        const needleGeom = new THREE.BoxGeometry(radius * 0.1, radius * 0.8, radius * 0.05);
        const needle = new THREE.Mesh(needleGeom, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
        needle.position.y = radius * 0.2;
        needle.position.z = radius * 0.27;
        gauge.add(needle);

        const glassGeom = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, radius * 0.55, 32);
        const glassMesh = new THREE.Mesh(glassGeom, glass);
        glassMesh.rotation.x = Math.PI / 2;
        gauge.add(glassMesh);

        // Connector
        const connGeom = new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, radius, 16);
        const conn = new THREE.Mesh(connGeom, color);
        conn.position.y = -radius * 0.8;
        gauge.add(conn);

        // Reference needle for animation
        gauge.userData.needle = needle;

        return gauge;
    }

    function createOpenSprinklerHead(color = chrome) {
        const head = new THREE.Group();
        
        // Base / Threaded connection
        const baseGeom = new THREE.CylinderGeometry(0.2, 0.25, 0.4, 32);
        const base = new THREE.Mesh(baseGeom, color);
        head.add(base);

        // Yoke arms (No bulb)
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.15, 0.2, 0),
            new THREE.Vector3(0.3, 0.5, 0),
            new THREE.Vector3(0.05, 0.9, 0)
        ]);
        const tubeGeom = new THREE.TubeGeometry(path, 20, 0.05, 8, false);
        
        const arm1 = new THREE.Mesh(tubeGeom, color);
        head.add(arm1);

        const arm2 = new THREE.Mesh(tubeGeom, color);
        arm2.rotation.y = Math.PI;
        head.add(arm2);

        // Deflector
        const deflectorShape = new THREE.Shape();
        const numTeeth = 12;
        const outerRadius = 0.4;
        const innerRadius = 0.3;
        for (let i = 0; i < numTeeth * 2; i++) {
            const angle = (i / (numTeeth * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            if (i === 0) deflectorShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else deflectorShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        deflectorShape.lineTo(outerRadius, 0);

        const extrudeSettings = { depth: 0.05, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.01, bevelThickness: 0.01 };
        const deflectorGeom = new THREE.ExtrudeGeometry(deflectorShape, extrudeSettings);
        const deflector = new THREE.Mesh(deflectorGeom, color);
        deflector.rotation.x = Math.PI / 2;
        deflector.position.y = 0.9;
        head.add(deflector);

        // Nozzle opening
        const nozzleGeom = new THREE.CylinderGeometry(0.1, 0.15, 0.2, 16);
        const nozzle = new THREE.Mesh(nozzleGeom, color);
        nozzle.position.y = 0.3;
        head.add(nozzle);

        return head;
    }

    const redMetal = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.7, roughness: 0.3 });
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.4 });
    const blueMetal = new THREE.MeshStandardMaterial({ color: 0x0044aa, metalness: 0.7, roughness: 0.3 });

    // 1. Supply Pipe
    const supplyPipe = createPipe(4, 0.5, redMetal);
    supplyPipe.position.set(0, -2, 0);
    const supplyFlange = createFlange(0.7, 0.2, darkSteel);
    supplyFlange.position.set(0, 0, 0);
    supplyPipe.add(supplyFlange);
    group.add(supplyPipe);
    
    parts.push({
        name: "Main Water Supply Header",
        description: "Large diameter pipe delivering pressurized firewater to the deluge system.",
        material: "Steel (Red Epoxy Coated)",
        function: "Provides the immense volume and pressure of water required for deluge operations.",
        assemblyOrder: 1,
        connections: ["Deluge Valve Inlet"],
        failureEffect: "Complete system failure. No water available for suppression.",
        cascadeFailures: ["Pump starvation", "Total loss of suppression capability"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Deluge Valve Body
    const delugeValve = createValveBody(0.6, redMetal);
    delugeValve.position.set(0, 0.6, 0);
    group.add(delugeValve);

    parts.push({
        name: "Deluge Valve Body",
        description: "The primary control valve that holds back the water supply until actuated. Features a massive internal diaphragm.",
        material: "Ductile Iron",
        function: "Maintains a watertight seal under high pressure until the release mechanism vents the priming chamber.",
        assemblyOrder: 2,
        connections: ["Main Water Supply Header", "Primary Manifold", "Priming Line"],
        failureEffect: "Valve fails to open or opens prematurely, causing accidental discharge.",
        cascadeFailures: ["Water damage to protected area", "Pressure loss in firewater ring main"],
        originalPosition: { x: 0, y: 0.6, z: 0 },
        explodedPosition: { x: 0, y: 0.6, z: 2 }
    });

    // 3. Deluge Valve Diaphragm Assembly (Internal, but modeled for explosion)
    const diaphragmGeom = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
    const diaphragm = new THREE.Mesh(diaphragmGeom, rubber);
    diaphragm.rotation.x = Math.PI / 2;
    diaphragm.position.set(0, 0.6, 0); // Inside valve
    group.add(diaphragm);

    parts.push({
        name: "Elastomeric Clapper Diaphragm",
        description: "Heavy-duty rubber reinforced diaphragm that seals the deluge valve clapper.",
        material: "Reinforced EPDM Rubber",
        function: "Uses the differential pressure between the priming chamber and the supply pressure to keep the valve closed.",
        assemblyOrder: 3,
        connections: ["Deluge Valve Body"],
        failureEffect: "Leakage leading to pressure drop and accidental trip of the deluge system.",
        cascadeFailures: ["False activation"],
        originalPosition: { x: 0, y: 0.6, z: 0 },
        explodedPosition: { x: -3, y: 0.6, z: 2 }
    });

    // 4. Priming Line & Solenoid Actuator
    const primingLineGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.2, 0.6),
            new THREE.Vector3(0, 1.2, 1.5),
            new THREE.Vector3(1.5, 1.2, 1.5),
            new THREE.Vector3(1.5, 0.5, 1.5)
        ]), 64, 0.05, 8, false
    );
    const primingLine = new THREE.Mesh(primingLineGeom, copper);
    group.add(primingLine);

    const solenoidBodyGeom = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const solenoidBody = new THREE.Mesh(solenoidBodyGeom, blueMetal);
    solenoidBody.position.set(1.5, 0.5, 1.5);
    
    // Solenoid Coil
    const coilGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32);
    const coil = new THREE.Mesh(coilGeom, copper);
    coil.position.set(0, 0.4, 0);
    solenoidBody.add(coil);
    
    // Conduit
    const conduitGeom = new THREE.CylinderGeometry(0.04, 0.04, 2, 16);
    const conduit = new THREE.Mesh(conduitGeom, steel);
    conduit.rotation.z = Math.PI / 2;
    conduit.position.set(1, 0, 0);
    solenoidBody.add(conduit);

    group.add(solenoidBody);

    parts.push({
        name: "Solenoid Actuation Valve & Priming Line",
        description: "Electrically operated release valve and associated copper priming trim.",
        material: "Brass, Copper, and Electromagnet Coil",
        function: "Vents the priming chamber when an electrical signal is received from the fire alarm control panel.",
        assemblyOrder: 4,
        connections: ["Deluge Valve Body", "Fire Alarm System"],
        failureEffect: "System will not activate automatically during a fire condition.",
        cascadeFailures: ["Uncontrolled fire spread", "Complete facility loss"],
        originalPosition: { x: 1.5, y: 0.5, z: 1.5 },
        explodedPosition: { x: 4, y: 0.5, z: 1.5 }
    });

    // 5. Manual Emergency Release Station
    const manualReleaseGroup = new THREE.Group();
    const boxGeom = new THREE.BoxGeometry(0.3, 0.4, 0.2);
    const box = new THREE.Mesh(boxGeom, redMetal);
    manualReleaseGroup.add(box);

    const handleGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 16);
    const handle = new THREE.Mesh(handleGeom, chrome);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 0, 0.15);
    manualReleaseGroup.add(handle);
    
    const releaseLineGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.5, 0.2, 1.5),
            new THREE.Vector3(1.5, -0.5, 1.5),
            new THREE.Vector3(2.5, -0.5, 1.5)
        ]), 32, 0.05, 8, false
    );
    const releaseLine = new THREE.Mesh(releaseLineGeom, copper);
    group.add(releaseLine);

    manualReleaseGroup.position.set(2.5, -0.5, 1.5);
    group.add(manualReleaseGroup);

    parts.push({
        name: "Manual Emergency Release",
        description: "Mechanical override valve enclosed in a protective housing.",
        material: "Cast Iron and Stainless Steel",
        function: "Allows human operators to manually vent the priming chamber and trip the deluge valve if automatic systems fail.",
        assemblyOrder: 5,
        connections: ["Priming Line"],
        failureEffect: "Inability to manually initiate suppression.",
        cascadeFailures: [],
        originalPosition: { x: 2.5, y: -0.5, z: 1.5 },
        explodedPosition: { x: 5, y: -0.5, z: 3 }
    });

    // 6. Main Riser & Primary Header
    const riserPipe = createPipe(3, 0.5, redMetal);
    riserPipe.position.set(0, 3.5, 0);
    const riserFlange = createFlange(0.7, 0.2, darkSteel);
    riserFlange.position.set(0, -1.5, 0);
    riserPipe.add(riserFlange);
    group.add(riserPipe);

    const headerCrossGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const headerCross = new THREE.Mesh(headerCrossGeom, redMetal);
    headerCross.rotation.z = Math.PI / 2;
    headerCross.position.set(0, 5, 0);
    group.add(headerCross);

    parts.push({
        name: "Main System Riser & Header Cross",
        description: "Vertical pipe section downstream of the deluge valve splitting into primary distribution branches.",
        material: "Schedule 40 Carbon Steel",
        function: "Distributes the massive flow of water evenly to the left and right sprinkler branch lines.",
        assemblyOrder: 6,
        connections: ["Deluge Valve Body", "Left Branch", "Right Branch"],
        failureEffect: "Pipe rupture causing catastrophic loss of pressure and flow to sprinklers.",
        cascadeFailures: ["Flooding", "Suppression failure"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 7. Pressure Gauges (Supply and System)
    const supplyGauge = createPressureGauge(0.2, brassMaterial);
    supplyGauge.position.set(-0.6, -1, 0);
    supplyGauge.rotation.z = Math.PI / 2;
    group.add(supplyGauge);
    
    parts.push({
        name: "Supply Water Pressure Gauge",
        description: "Bourdon tube pressure gauge monitoring the municipal/pump water supply.",
        material: "Brass Body, Glass Face, Stainless Steel Internals",
        function: "Provides visual indication of incoming water pressure to ensure it meets system design requirements.",
        assemblyOrder: 7,
        connections: ["Main Water Supply Header"],
        failureEffect: "Loss of monitoring capability. Cannot verify adequate supply pressure.",
        cascadeFailures: [],
        originalPosition: { x: -0.6, y: -1, z: 0 },
        explodedPosition: { x: -3, y: -1, z: 0 }
    });

    const systemGauge = createPressureGauge(0.2, brassMaterial);
    systemGauge.position.set(-0.6, 2.5, 0);
    systemGauge.rotation.z = Math.PI / 2;
    group.add(systemGauge);

    parts.push({
        name: "System/Priming Pressure Gauge",
        description: "Bourdon tube pressure gauge monitoring the pressure above the clapper.",
        material: "Brass Body, Glass Face, Stainless Steel Internals",
        function: "Indicates the pressure in the priming chamber, confirming the valve is set and ready.",
        assemblyOrder: 8,
        connections: ["Deluge Valve Body"],
        failureEffect: "Cannot verify if system is properly set or if slow pressure leaks exist.",
        cascadeFailures: [],
        originalPosition: { x: -0.6, y: 2.5, z: 0 },
        explodedPosition: { x: -3, y: 2.5, z: 0 }
    });


    // 8. Branch Lines and Open Sprinklers
    const branchLength = 8;
    const branchRadius = 0.3;

    function buildBranch(direction) {
        const branchGroup = new THREE.Group();
        const dirMult = direction === 'left' ? -1 : 1;
        
        // Branch pipe
        const branchPipe = createPipe(branchLength, branchRadius, redMetal);
        branchPipe.rotation.z = Math.PI / 2;
        branchPipe.position.set(dirMult * (branchLength / 2 + 0.5), 5, 0);
        group.add(branchPipe);

        parts.push({
            name: `${direction.charAt(0).toUpperCase() + direction.slice(1)} Branch Line`,
            description: "Heavy horizontal distribution pipe carrying water to the open sprinkler heads.",
            material: "Schedule 40 Carbon Steel",
            function: "Transports high-velocity water to individual nozzle drops.",
            assemblyOrder: 9,
            connections: ["Main System Riser Header", `${direction} Sprinklers`],
            failureEffect: "Loss of water flow to half the hazard area.",
            cascadeFailures: ["Partial suppression failure"],
            originalPosition: { x: dirMult * (branchLength / 2 + 0.5), y: 5, z: 0 },
            explodedPosition: { x: dirMult * 10, y: 10, z: 0 }
        });

        // Sprinklers along branch
        const numSprinklers = 4;
        const spacing = branchLength / numSprinklers;
        
        for (let i = 0; i < numSprinklers; i++) {
            const dropGroup = new THREE.Group();
            
            // Drop fitting (Tee)
            const teeGeom = new THREE.CylinderGeometry(branchRadius * 1.1, branchRadius * 1.1, branchRadius * 2, 32);
            const tee = new THREE.Mesh(teeGeom, redMetal);
            tee.rotation.z = Math.PI / 2;
            dropGroup.add(tee);

            // Drop pipe
            const dropPipe = createPipe(0.8, 0.15, redMetal);
            dropPipe.position.set(0, -0.4, 0);
            dropGroup.add(dropPipe);

            // Open Sprinkler Head
            const sprinkler = createOpenSprinklerHead(brassMaterial);
            sprinkler.position.set(0, -0.8, 0);
            sprinkler.rotation.x = Math.PI; // pointing down
            dropGroup.add(sprinkler);

            // Water particle emitter for animation
            const waterParticles = new THREE.Group();
            for(let p = 0; p < 20; p++) {
                const particleGeom = new THREE.SphereGeometry(0.02, 8, 8);
                const particleMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 });
                const particle = new THREE.Mesh(particleGeom, particleMat);
                particle.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 2, 
                    -Math.random() * 5 - 2, 
                    (Math.random() - 0.5) * 2
                );
                particle.position.set(0, -0.9, 0);
                particle.visible = false;
                waterParticles.add(particle);
            }
            dropGroup.add(waterParticles);
            dropGroup.userData.waterEmitter = waterParticles;

            const xPos = dirMult * (1.5 + (i * spacing));
            dropGroup.position.set(xPos, 5, 0);
            group.add(dropGroup);
            
            // Only add part metadata for one representative sprinkler per branch to avoid clutter
            if (i === 0) {
                parts.push({
                    name: `Open Deluge Sprinkler Nozzle (${direction} array)`,
                    description: "High-velocity water spray nozzle with no thermally sensitive glass bulb element.",
                    material: "Forged Brass",
                    function: "Atomizes and directs water into a specific geometric spray pattern for rapid fire extinguishment and cooling.",
                    assemblyOrder: 10 + i,
                    connections: [`${direction.charAt(0).toUpperCase() + direction.slice(1)} Branch Line`],
                    failureEffect: "Clogging leads to incomplete spray coverage.",
                    cascadeFailures: ["Localized fire growth"],
                    originalPosition: { x: xPos, y: 5, z: 0 },
                    explodedPosition: { x: xPos, y: 2, z: dirMult * 4 }
                });
            }
        }
    }

    buildBranch('left');
    buildBranch('right');

    // 9. Main Drain Valve
    const drainValveGroup = new THREE.Group();
    const drainPipe = createPipe(1, 0.15, redMetal);
    drainPipe.rotation.z = Math.PI / 2;
    drainPipe.position.set(-0.8, -1.5, 0);
    drainValveGroup.add(drainPipe);

    const drainValveBodyGeom = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const drainValveBody = new THREE.Mesh(drainValveBodyGeom, brassMaterial);
    drainValveBody.position.set(-1.3, -1.5, 0);
    drainValveGroup.add(drainValveBody);

    const drainHandwheel = createHandwheel(0.3, 0.04, 5, redMetal);
    drainHandwheel.position.set(-1.3, -1.2, 0);
    drainValveGroup.add(drainHandwheel);

    group.add(drainValveGroup);

    parts.push({
        name: "Main Drain / Flow Test Valve",
        description: "2-inch angle valve connected to the supply side.",
        material: "Brass Body, Steel Handwheel",
        function: "Used to drain the system for maintenance and to perform flow tests to verify water supply capacity.",
        assemblyOrder: 11,
        connections: ["Main Water Supply Header"],
        failureEffect: "Inability to drain system or verify supply.",
        cascadeFailures: [],
        originalPosition: { x: -1.3, y: -1.5, z: 0 },
        explodedPosition: { x: -4, y: -1.5, z: -2 }
    });

    // 10. Water Motor Gong / Mechanical Alarm Line
    const alarmLineGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.5, -0.6),
            new THREE.Vector3(0, 1.5, -2),
            new THREE.Vector3(-2, 1.5, -2),
            new THREE.Vector3(-2, 4, -2)
        ]), 64, 0.05, 8, false
    );
    const alarmLine = new THREE.Mesh(alarmLineGeom, steel);
    group.add(alarmLine);

    const gongGroup = new THREE.Group();
    const gongBase = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const gongMesh = new THREE.Mesh(gongBase, redMetal);
    gongMesh.rotation.x = Math.PI / 2;
    gongGroup.add(gongMesh);

    const gongDome = new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(gongDome, chrome);
    domeMesh.rotation.x = Math.PI / 2;
    domeMesh.position.z = 0.05;
    gongGroup.add(domeMesh);

    gongGroup.position.set(-2, 4, -2);
    group.add(gongGroup);

    parts.push({
        name: "Water Motor Gong & Alarm Line",
        description: "Hydraulically operated mechanical alarm bell.",
        material: "Cast Aluminum housing, Steel Bell Dome",
        function: "When the deluge valve opens, water flows through this line to mechanically spin a striker, sounding a loud local alarm without requiring electricity.",
        assemblyOrder: 12,
        connections: ["Deluge Valve Body"],
        failureEffect: "No local mechanical alarm sounds upon activation.",
        cascadeFailures: ["Delayed manual response"],
        originalPosition: { x: -2, y: 4, z: -2 },
        explodedPosition: { x: -5, y: 6, z: -5 }
    });

    // Store references for animation
    group.userData = {
        solenoid: solenoidBody,
        supplyGauge: supplyGauge,
        systemGauge: systemGauge,
        valveDiaphragm: diaphragm,
        waterEmitters: group.children.filter(c => c.userData.waterEmitter).map(c => c.userData.waterEmitter),
        manualHandle: handle,
        isTripped: false,
        tripProgress: 0,
        gong: domeMesh
    };

    const description = `The Deluge Sprinkler Array is an extreme hazard fire suppression system. 
Unlike standard wet-pipe systems, all sprinkler heads in a deluge system are OPEN (lacking heat-sensitive glass bulbs). 
The entire piping network is empty and at atmospheric pressure. 
Water is held back by the massive primary Deluge Valve. 
When a separate fire detection system (smoke, heat, or optical flame detectors) senses a fire, it sends a signal to the Solenoid Actuator. 
The solenoid vents the priming chamber, causing the pressure differential to lift the elastomeric diaphragm. 
Instantly, massive volumes of water rush into the piping network and discharge simultaneously from all open nozzles, creating a catastrophic flood of water to suppress high-challenge fires like transformer ruptures, aircraft hangars, or chemical storage facilities.`;

    const quizQuestions = [
        {
            question: "Why do deluge sprinkler heads lack the heat-sensitive glass bulbs found in typical residential/commercial sprinklers?",
            options: [
                "To save manufacturing costs on large industrial arrays.",
                "To ensure water discharges from all heads simultaneously over the entire hazard area.",
                "Because industrial environments are too hot and would accidentally break them.",
                "Glass bulbs cannot handle the extremely high water pressure of a deluge system."
            ],
            correctAnswer: 1,
            explanation: "Deluge systems are designed for extreme hazards where a fire can spread explosively. Having open heads ensures that when the main deluge valve trips, water flows from EVERY nozzle instantly, drenching the entire zone."
        },
        {
            question: "What holds the main deluge valve closed under normal standby conditions?",
            options: [
                "A massive mechanical spring.",
                "Water pressure in the priming chamber pressing down on the clapper diaphragm.",
                "An extremely powerful electromagnet.",
                "A shear pin that breaks upon activation."
            ],
            correctAnswer: 1,
            explanation: "Deluge valves typically operate on a differential pressure principle. Water pressure from the supply is routed into a priming chamber above the diaphragm. Because the surface area on top of the diaphragm is larger than on the bottom, the hydraulic force holds the valve tightly sealed."
        },
        {
            question: "What is the primary function of the Water Motor Gong?",
            options: [
                "To generate electricity to power the solenoid valve.",
                "To act as a pressure relief valve.",
                "To provide a reliable, non-electrical mechanical fire alarm.",
                "To mechanically pump water to higher elevations."
            ],
            correctAnswer: 2,
            explanation: "The water motor gong is a mechanical alarm. When the deluge valve opens, a small portion of water is routed through a line to the gong, spinning an impeller that strikes the bell. This ensures a local alarm sounds even during a total power failure."
        },
        {
            question: "If the automatic electronic fire alarm system fails completely, can the deluge system still be activated?",
            options: [
                "No, it is purely electrically dependent.",
                "Yes, by opening the Emergency Manual Release valve to vent the priming line.",
                "Yes, the sprinkler heads will eventually melt and open.",
                "Yes, by increasing the supply water pressure until the valve bursts."
            ],
            correctAnswer: 1,
            explanation: "Deluge systems are equipped with a Manual Emergency Release station. Opening this valve mechanically vents the water pressure from the priming chamber, causing the main deluge valve to trip and flood the system, bypassing all electronics."
        },
        {
            question: "What occurs in the system piping immediately AFTER the deluge valve trips but BEFORE water exits the nozzles?",
            options: [
                "A vacuum is drawn to suck the water up.",
                "The system must wait for the air compressor to stop.",
                "The piping network fills with water, expelling the air out through the open sprinkler nozzles.",
                "Chemical foam is mixed into the lines."
            ],
            correctAnswer: 2,
            explanation: "Under standby conditions, deluge piping is empty and filled with atmospheric air. When tripped, the rushing water must push all this air out through the open nozzles before water discharge begins, resulting in a slight transit delay."
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Jitter needles slightly for realism
        if (meshes.userData.supplyGauge) {
            meshes.userData.supplyGauge.userData.needle.rotation.y = Math.sin(t * 10) * 0.05 + 0.5;
        }

        // Simulate tripping mechanism (e.g. triggering every 10 seconds)
        const cycle = t % 10;
        if (cycle > 5 && cycle < 9) {
            meshes.userData.isTripped = true;
            meshes.userData.tripProgress = Math.min(1, meshes.userData.tripProgress + 0.05);
        } else {
            meshes.userData.isTripped = false;
            meshes.userData.tripProgress = Math.max(0, meshes.userData.tripProgress - 0.05);
        }

        const tp = meshes.userData.tripProgress;

        // System pressure drops when tripped (priming vented)
        if (meshes.userData.systemGauge) {
            meshes.userData.systemGauge.userData.needle.rotation.y = 0.5 * (1 - tp) + Math.sin(t * 15) * 0.02;
        }

        // Manual handle pulls down
        if (meshes.userData.manualHandle) {
            meshes.userData.manualHandle.rotation.x = (Math.PI / 2) + tp * (Math.PI / 4);
        }

        // Gong vibration when tripped
        if (meshes.userData.gong && tp > 0.5) {
            meshes.userData.gong.position.x = Math.sin(t * 50) * 0.05;
            meshes.userData.gong.position.y = Math.cos(t * 40) * 0.05;
        } else if (meshes.userData.gong) {
            meshes.userData.gong.position.x = 0;
            meshes.userData.gong.position.y = 0;
        }

        // Water particles
        const emitters = [];
        meshes.children.forEach(c => {
            if (c.userData && c.userData.waterEmitter) {
                emitters.push(c.userData.waterEmitter);
            }
        });

        emitters.forEach(emitterGroup => {
            emitterGroup.children.forEach((particle, idx) => {
                if (tp > 0.8) {
                    particle.visible = true;
                    // Move particle along velocity
                    particle.position.add(particle.userData.velocity.clone().multiplyScalar(0.1));
                    
                    // Reset if too low
                    if (particle.position.y < -15) {
                        particle.position.set(0, -0.9, 0);
                        // Randomize spread
                        particle.userData.velocity.set(
                            (Math.random() - 0.5) * 6, 
                            -Math.random() * 8 - 4, 
                            (Math.random() - 0.5) * 6
                        );
                    }
                } else {
                    particle.visible = false;
                    particle.position.set(0, -0.9, 0);
                }
            });
        });

    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createDelugeSprinklerArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
