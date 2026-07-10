import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const dynamicMeshes = {};
    let waterParticles = [];

    // ==========================================
    // CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const castIronRed = new THREE.MeshStandardMaterial({
        color: 0x8a0f0f,
        roughness: 0.85,
        metalness: 0.15,
        bumpScale: 0.05,
    });

    const brass = new THREE.MeshStandardMaterial({
        color: 0xc5a059,
        roughness: 0.3,
        metalness: 0.8,
        clearcoat: 0.5,
    });

    const gaugeFaceMat = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        roughness: 0.9,
        metalness: 0.1,
    });

    const gaugeNeedleMat = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        roughness: 0.4,
        metalness: 0.2,
    });

    const solenoidCoilMat = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.6,
        metalness: 0.9,
        wireframe: true, // Simulates coiled wire wrapped around
    });

    const emissiveScreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
    });

    const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        transmission: 0.9,
        opacity: 0.6,
        transparent: true,
        roughness: 0.1,
        ior: 1.33,
    });

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function createHexBolt(radius, length) {
        const boltGroup = new THREE.Group();
        const headGeo = new THREE.CylinderGeometry(radius * 1.5, radius * 1.5, radius, 6);
        const head = new THREE.Mesh(headGeo, darkSteel);
        head.position.y = length / 2;
        
        const shaftGeo = new THREE.CylinderGeometry(radius, radius, length, 16);
        const shaft = new THREE.Mesh(shaftGeo, chrome);
        
        // Threads simulation
        const threadGeo = new THREE.TorusGeometry(radius * 1.05, radius * 0.1, 8, 16);
        for(let i=0; i<length * 4; i++) {
            const thread = new THREE.Mesh(threadGeo, darkSteel);
            thread.position.y = -length/2 + (i * (length / (length*4)));
            thread.rotation.x = Math.PI / 2;
            boltGroup.add(thread);
        }

        boltGroup.add(head);
        boltGroup.add(shaft);
        return boltGroup;
    }

    function createFlange(innerR, outerR, thickness, boltCount, yPos) {
        const flangeGroup = new THREE.Group();
        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerR, 0, Math.PI * 2, true);
        shape.holes.push(holePath);

        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geo, castIronRed);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = yPos + thickness / 2;
        flangeGroup.add(mesh);

        // Add bolts
        for(let i=0; i<boltCount; i++) {
            const angle = (i / boltCount) * Math.PI * 2;
            const boltR = innerR + (outerR - innerR) / 2;
            const bolt = createHexBolt(0.15, thickness * 2);
            bolt.position.set(Math.cos(angle) * boltR, yPos, Math.sin(angle) * boltR);
            flangeGroup.add(bolt);
        }
        return flangeGroup;
    }

    function createGauge(name, minVal, maxVal, unit) {
        const gaugeGroup = new THREE.Group();
        
        // Casing
        const caseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
        const casing = new THREE.Mesh(caseGeo, brass);
        casing.rotation.x = Math.PI / 2;
        gaugeGroup.add(casing);

        // Face
        const faceGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.52, 32);
        const face = new THREE.Mesh(faceGeo, gaugeFaceMat);
        face.rotation.x = Math.PI / 2;
        gaugeGroup.add(face);

        // Glass
        const glassGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.55, 32);
        const gaugeGlass = new THREE.Mesh(glassGeo, glass);
        gaugeGlass.rotation.x = Math.PI / 2;
        gaugeGroup.add(gaugeGlass);

        // Ticks
        for(let i=0; i<=20; i++) {
            const isMajor = i % 5 === 0;
            const tickGeo = new THREE.BoxGeometry(0.04, isMajor ? 0.3 : 0.15, 0.01);
            const tick = new THREE.Mesh(tickGeo, darkSteel);
            const angle = (i / 20) * (Math.PI * 1.5) - (Math.PI * 1.25);
            tick.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0.27);
            tick.rotation.z = angle + Math.PI / 2;
            gaugeGroup.add(tick);
        }

        // Needle
        const needleGroup = new THREE.Group();
        needleGroup.position.z = 0.28;
        const needleGeo = new THREE.CylinderGeometry(0.04, 0.01, 0.9, 8);
        const needle = new THREE.Mesh(needleGeo, gaugeNeedleMat);
        needle.position.y = 0.45;
        needleGroup.add(needle);
        
        const pinGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
        const pin = new THREE.Mesh(pinGeo, chrome);
        pin.rotation.x = Math.PI/2;
        needleGroup.add(pin);

        gaugeGroup.add(needleGroup);
        dynamicMeshes[`${name}Needle`] = needleGroup;

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
        const stem = new THREE.Mesh(stemGeo, brass);
        stem.position.y = -0.7;
        gaugeGroup.add(stem);

        return gaugeGroup;
    }

    // ==========================================
    // VALVE GEOMETRY GENERATION
    // ==========================================

    // 1. Lower Body (Inlet)
    const lowerBodyPoints = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        let r = 2.5;
        if (t < 0.1 || t > 0.9) r = 3.5; // Flanges
        else r = 2.5 + Math.sin(t * Math.PI) * 1.2; // Bulge
        lowerBodyPoints.push(new THREE.Vector2(r, (t * 6) - 6));
    }
    const lowerBodyGeo = new THREE.LatheGeometry(lowerBodyPoints, 64);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, castIronRed);
    group.add(lowerBody);

    const inletFlange = createFlange(2.5, 4, 0.5, 12, -6.25);
    group.add(inletFlange);

    // 2. Clapper Assembly (Internal Hinge)
    const clapperGroup = new THREE.Group();
    clapperGroup.position.set(0, 0, -1.8); // Hinge pivot point

    const clapperPlateGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.4, 32);
    const clapperPlate = new THREE.Mesh(clapperPlateGeo, brass);
    clapperPlate.position.set(0, 0, 1.8);
    
    const clapperSealGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.1, 32);
    const clapperSeal = new THREE.Mesh(clapperSealGeo, rubber);
    clapperSeal.position.set(0, -0.25, 1.8);

    const hingeArmGeo = new THREE.BoxGeometry(1, 0.2, 2);
    const hingeArm = new THREE.Mesh(hingeArmGeo, castIronRed);
    hingeArm.position.set(0, 0, 0.9);

    clapperGroup.add(clapperPlate);
    clapperGroup.add(clapperSeal);
    clapperGroup.add(hingeArm);
    group.add(clapperGroup);
    dynamicMeshes.clapper = clapperGroup;

    // 3. Upper Body & Diaphragm Chamber
    const upperBodyPoints = [];
    for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        let r = 2.5;
        if (t < 0.1 || t > 0.9) r = 3.5; // Flanges
        else if (t > 0.4 && t < 0.6) r = 4.5; // Diaphragm chamber expansion
        else r = 2.5 + Math.sin(t * Math.PI) * 0.5;
        upperBodyPoints.push(new THREE.Vector2(r, (t * 8)));
    }
    const upperBodyGeo = new THREE.LatheGeometry(upperBodyPoints, 64);
    const upperBody = new THREE.Mesh(upperBodyGeo, castIronRed);
    group.add(upperBody);

    const midFlange = createFlange(2.5, 4.2, 0.6, 16, -0.3);
    group.add(midFlange);

    const outletFlange = createFlange(2.5, 4, 0.5, 12, 8);
    group.add(outletFlange);

    // 4. Diaphragm push rod and internal spring
    const pushRodGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const pushRod = new THREE.Mesh(pushRodGeo, steel);
    pushRod.position.set(0, 3, 0);
    group.add(pushRod);
    dynamicMeshes.pushRod = pushRod;

    const springCurve = new THREE.CatmullRomCurve3(
        new Array(100).fill(0).map((_, i) => {
            const t = i / 99;
            const turns = 10;
            const r = 1.2;
            return new THREE.Vector3(Math.cos(t * Math.PI * 2 * turns) * r, t * 3, Math.sin(t * Math.PI * 2 * turns) * r);
        })
    );
    const springGeo = new THREE.TubeGeometry(springCurve, 200, 0.15, 8, false);
    const spring = new THREE.Mesh(springGeo, darkSteel);
    spring.position.set(0, 1.5, 0);
    group.add(spring);
    dynamicMeshes.spring = spring;

    // 5. Complex Priming Trim (Piping System)
    const primingCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.5, -3, 0),
        new THREE.Vector3(4.5, -3, 0),
        new THREE.Vector3(4.5, 4, 0),
        new THREE.Vector3(3.5, 4, 0)
    ]);
    const primingPipeGeo = new THREE.TubeGeometry(primingCurve, 64, 0.2, 16, false);
    const primingPipe = new THREE.Mesh(primingPipeGeo, copper);
    group.add(primingPipe);

    // 6. Solenoid Valve on Priming Line
    const solenoidGroup = new THREE.Group();
    solenoidGroup.position.set(4.5, 0.5, 0);
    
    const solenoidBodyGeo = new THREE.BoxGeometry(1.2, 1.5, 1.2);
    const solenoidBody = new THREE.Mesh(solenoidBodyGeo, brass);
    
    const coilGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const coil = new THREE.Mesh(coilGeo, solenoidCoilMat);
    coil.position.y = 1.5;
    
    const solenoidTopGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 32);
    const solenoidTop = new THREE.Mesh(solenoidTopGeo, darkSteel);
    solenoidTop.position.y = 2.6;

    // Junction box on solenoid
    const jboxGeo = new THREE.BoxGeometry(0.8, 0.8, 1);
    const jbox = new THREE.Mesh(jboxGeo, plastic);
    jbox.position.set(0, 1.5, 0.8);
    
    const ledGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const led = new THREE.Mesh(ledGeo, emissiveScreen);
    led.rotation.x = Math.PI / 2;
    led.position.set(0, 1.5, 1.3);
    dynamicMeshes.solenoidLed = led;

    solenoidGroup.add(solenoidBody);
    solenoidGroup.add(coil);
    solenoidGroup.add(solenoidTop);
    solenoidGroup.add(jbox);
    solenoidGroup.add(led);
    group.add(solenoidGroup);

    // 7. Manual Emergency Release
    const manualReleaseGroup = new THREE.Group();
    manualReleaseGroup.position.set(4.5, 3, 0);

    const bracketGeo = new THREE.BoxGeometry(0.6, 1.5, 0.8);
    const bracket = new THREE.Mesh(bracketGeo, steel);
    
    const leverGroup = new THREE.Group();
    leverGroup.position.set(0, 0, 0.4);
    
    const leverExtrudeShape = new THREE.Shape();
    leverExtrudeShape.moveTo(0, 0);
    leverExtrudeShape.lineTo(0.2, 0);
    leverExtrudeShape.lineTo(0.3, 2.5);
    leverExtrudeShape.lineTo(-0.1, 2.5);
    leverExtrudeShape.lineTo(0, 0);
    const leverGeo = new THREE.ExtrudeGeometry(leverExtrudeShape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.05 });
    const lever = new THREE.Mesh(leverGeo, castIronRed);
    lever.rotation.z = Math.PI / 4;
    leverGroup.add(lever);

    manualReleaseGroup.add(bracket);
    manualReleaseGroup.add(leverGroup);
    group.add(manualReleaseGroup);
    dynamicMeshes.manualLever = leverGroup;

    // 8. Pressure Gauges
    const supplyGauge = createGauge('supply', 0, 200, 'PSI');
    supplyGauge.position.set(3, -4, 1.5);
    supplyGauge.rotation.y = Math.PI / 4;
    group.add(supplyGauge);

    const primingGauge = createGauge('priming', 0, 200, 'PSI');
    primingGauge.position.set(3, 3, 1.5);
    primingGauge.rotation.y = Math.PI / 4;
    group.add(primingGauge);

    const systemGauge = createGauge('system', 0, 200, 'PSI');
    systemGauge.position.set(-3, 6, 1.5);
    systemGauge.rotation.y = -Math.PI / 4;
    group.add(systemGauge);

    // 9. Alarm Pressure Switch
    const alarmSwitchGroup = new THREE.Group();
    alarmSwitchGroup.position.set(-2.5, 4, 0);
    
    const alarmPipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const alarmPipe = new THREE.Mesh(alarmPipeGeo, steel);
    alarmPipe.rotation.z = Math.PI / 2;

    const switchHousingGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const switchHousing = new THREE.Mesh(switchHousingGeo, castIronRed);
    switchHousing.position.y = 1;

    alarmSwitchGroup.add(alarmPipe);
    alarmSwitchGroup.add(switchHousing);
    group.add(alarmSwitchGroup);

    // 10. Water Flow Particles Array Setup
    const particlesGroup = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    for(let i=0; i<150; i++) {
        const p = new THREE.Mesh(particleGeo, waterMat);
        p.position.set(
            (Math.random() - 0.5) * 3,
            -6 + Math.random() * 14,
            (Math.random() - 0.5) * 3
        );
        p.visible = false;
        waterParticles.push({
            mesh: p,
            speed: 5 + Math.random() * 10,
            xOffset: (Math.random() - 0.5) * 3,
            zOffset: (Math.random() - 0.5) * 3
        });
        particlesGroup.add(p);
    }
    group.add(particlesGroup);
    dynamicMeshes.particles = waterParticles;


    // ==========================================
    // PARTS METADATA
    // ==========================================
    parts.push(
        {
            name: "Lower Valve Body",
            description: "Heavy cast iron lower casing handling incoming water supply up to 300 PSI.",
            material: "Cast Iron",
            function: "Inlet flow management and primary structural foundation.",
            assemblyOrder: 1,
            connections: ["Clapper Hinge", "Priming Line", "Supply Pipe"],
            failureEffect: "Catastrophic flooding and complete loss of system pressure.",
            cascadeFailures: ["System Depressurization", "Pump Overload"],
            originalPosition: { x: 0, y: -4, z: 0 },
            explodedPosition: { x: 0, y: -10, z: 0 }
        },
        {
            name: "Upper Body / Diaphragm Chamber",
            description: "Contains the diaphragm and push-rod mechanisms that hold the clapper closed using priming pressure.",
            material: "Cast Iron",
            function: "Uses hydraulic differential pressure to securely hold back main water supply.",
            assemblyOrder: 5,
            connections: ["Priming Line", "Push Rod", "Mid Flange Bolts"],
            failureEffect: "Premature valve opening or failure to open on demand.",
            cascadeFailures: ["Water Damage", "Fire Spread"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 10, z: 0 }
        },
        {
            name: "Clapper Assembly",
            description: "Hinged brass plate with a rubber seat that acts as the primary barrier between the wet supply and dry system.",
            material: "Brass / EPDM Rubber",
            function: "Opens immediately upon release of priming pressure to allow full bore water flow.",
            assemblyOrder: 3,
            connections: ["Lower Body", "Push Rod"],
            failureEffect: "Valve fails to seal, causing continuous leakage into the dry system.",
            cascadeFailures: ["Corrosion in dry pipes", "False Alarms"],
            originalPosition: { x: 0, y: 0, z: -1.8 },
            explodedPosition: { x: -5, y: 0, z: -5 }
        },
        {
            name: "Solenoid Valve",
            description: "Electromagnetic 24V DC valve that vents the priming chamber to atmospheric pressure when triggered by the fire alarm panel.",
            material: "Brass / Copper Wiring",
            function: "Automated electrical release mechanism for the deluge valve.",
            assemblyOrder: 8,
            connections: ["Priming Trim", "Junction Box"],
            failureEffect: "Valve will not actuate automatically during a fire event.",
            cascadeFailures: ["Total System Failure"],
            originalPosition: { x: 4.5, y: 0.5, z: 0 },
            explodedPosition: { x: 10, y: 0.5, z: 0 }
        },
        {
            name: "Solenoid Coil",
            description: "Copper wire wraps generating an immense magnetic field to pull the solenoid plunger.",
            material: "Copper",
            function: "Actuation force generator.",
            assemblyOrder: 9,
            connections: ["Solenoid Body", "Electrical Conduit"],
            failureEffect: "Electrical short or open circuit.",
            cascadeFailures: ["Solenoid Valve Failure"],
            originalPosition: { x: 4.5, y: 2, z: 0 },
            explodedPosition: { x: 12, y: 2, z: 0 }
        },
        {
            name: "Manual Emergency Release",
            description: "Red lever allowing manual venting of the priming chamber without electrical power.",
            material: "Cast Iron / Steel",
            function: "Failsafe mechanical override for system activation.",
            assemblyOrder: 10,
            connections: ["Priming Trim"],
            failureEffect: "Inability to manually start the suppression system in an electrical blackout.",
            cascadeFailures: ["Delayed response"],
            originalPosition: { x: 4.5, y: 3, z: 0 },
            explodedPosition: { x: 8, y: 6, z: 2 }
        },
        {
            name: "Priming Line Trim",
            description: "Complex copper tubing routing supply pressure into the upper diaphragm chamber.",
            material: "Copper",
            function: "Maintains high pressure in the upper chamber to keep the clapper closed.",
            assemblyOrder: 7,
            connections: ["Lower Body", "Upper Body", "Solenoid"],
            failureEffect: "Loss of priming pressure causing accidental discharge.",
            cascadeFailures: ["Facility Flooding"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 5, y: 0, z: -5 }
        },
        {
            name: "Supply Pressure Gauge",
            description: "Measures the static water pressure coming from the city or fire pump.",
            material: "Brass / Glass",
            function: "Visual indication of available water supply.",
            assemblyOrder: 11,
            connections: ["Lower Body"],
            failureEffect: "Inaccurate pressure readings.",
            cascadeFailures: ["Maintenance Errors"],
            originalPosition: { x: 3, y: -4, z: 1.5 },
            explodedPosition: { x: 8, y: -6, z: 5 }
        },
        {
            name: "Priming Pressure Gauge",
            description: "Monitors the pressure inside the diaphragm holding chamber.",
            material: "Brass / Glass",
            function: "Confirms the valve is securely locked closed.",
            assemblyOrder: 12,
            connections: ["Priming Trim"],
            failureEffect: "Undetected slow leaks in the priming line.",
            cascadeFailures: ["Accidental Trip"],
            originalPosition: { x: 3, y: 3, z: 1.5 },
            explodedPosition: { x: 8, y: 4, z: 5 }
        },
        {
            name: "System Pressure Gauge",
            description: "Monitors pressure on the outlet side, normally zero in a dry deluge system.",
            material: "Brass / Glass",
            function: "Indicates if the system has tripped or is holding trapped water.",
            assemblyOrder: 13,
            connections: ["Upper Body"],
            failureEffect: "Unable to detect downstream blockages or residual water.",
            cascadeFailures: ["Freezing pipes in winter"],
            originalPosition: { x: -3, y: 6, z: 1.5 },
            explodedPosition: { x: -8, y: 8, z: 5 }
        },
        {
            name: "Alarm Pressure Switch",
            description: "Electrical switch triggered by flowing water when the clapper opens.",
            material: "Cast Iron / Plastics",
            function: "Sends a signal to the main fire alarm panel to ring the bells.",
            assemblyOrder: 14,
            connections: ["Upper Body"],
            failureEffect: "No alarm sounds during an active fire suppression event.",
            cascadeFailures: ["Delayed evacuation"],
            originalPosition: { x: -2.5, y: 4, z: 0 },
            explodedPosition: { x: -6, y: 4, z: -3 }
        },
        {
            name: "Diaphragm Push Rod",
            description: "Thick steel rod transferring force from the diaphragm to the clapper.",
            material: "Hardened Steel",
            function: "Mechanical link providing the 2:1 differential advantage to lock the clapper.",
            assemblyOrder: 4,
            connections: ["Diaphragm", "Clapper Assembly"],
            failureEffect: "Snapping or bending leads to immediate valve blow-out.",
            cascadeFailures: ["Complete system failure"],
            originalPosition: { x: 0, y: 3, z: 0 },
            explodedPosition: { x: 0, y: 15, z: 0 }
        },
        {
            name: "Main Reset Spring",
            description: "Heavy duty torsion spring that assists in closing the clapper once flow stops.",
            material: "Spring Steel",
            function: "Ensures the clapper seats properly during the reset procedure.",
            assemblyOrder: 6,
            connections: ["Push Rod", "Upper Body"],
            failureEffect: "Valve fails to reseat properly, requiring manual teardown.",
            cascadeFailures: ["Extended system downtime"],
            originalPosition: { x: 0, y: 1.5, z: 0 },
            explodedPosition: { x: 0, y: 12, z: 0 }
        },
        {
            name: "Mid Flange Bolts Array",
            description: "16x high-tensile hex bolts connecting the upper and lower halves.",
            material: "Chrome Steel",
            function: "Contains the immense hydraulic forces trying to blow the casing apart.",
            assemblyOrder: 15,
            connections: ["Upper Body", "Lower Body"],
            failureEffect: "Explosive decompression and separation of the valve halves.",
            cascadeFailures: ["Lethal shrapnel", "Total flood"],
            originalPosition: { x: 0, y: -0.3, z: 0 },
            explodedPosition: { x: 0, y: -0.3, z: 8 }
        },
        {
            name: "Drain Valve Line",
            description: "2-inch piping to safely drain the system after activation.",
            material: "Galvanized Steel",
            function: "Clears out the massive water volume post-fire to reset the system.",
            assemblyOrder: 16,
            connections: ["Lower Body"],
            failureEffect: "Unable to reset the system, leading to stagnant water corrosion.",
            cascadeFailures: ["Microbiologically Influenced Corrosion (MIC)"],
            originalPosition: { x: 0, y: -5, z: -3 },
            explodedPosition: { x: 0, y: -5, z: -8 }
        }
    );

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In a deluge system, why is the priming pressure essential?",
            options: [
                "It cools the solenoid coil.",
                "It uses differential area to hold the main clapper closed against supply pressure.",
                "It provides water to the alarm bell.",
                "It drains the system automatically."
            ],
            correctAnswer: 1,
            explanation: "The priming chamber has a larger surface area than the clapper inlet. Supply pressure is routed to the priming chamber, creating a greater downward force that firmly locks the clapper closed."
        },
        {
            question: "What is the primary function of the Solenoid Valve on the trim?",
            options: [
                "To increase water pressure to the sprinklers.",
                "To manually reset the clapper after activation.",
                "To electrically vent the priming chamber to atmosphere, allowing the valve to open.",
                "To measure the incoming water flow rate."
            ],
            correctAnswer: 2,
            explanation: "When triggered by a fire panel, the solenoid opens and bleeds off the priming pressure faster than it can be replenished. This removes the downward holding force, causing the main clapper to swing open."
        },
        {
            question: "During normal 'Set' conditions, what should the System Pressure gauge read?",
            options: [
                "Equal to the Supply pressure.",
                "Zero PSI.",
                "Double the Priming pressure.",
                "Fluctuating constantly."
            ],
            correctAnswer: 1,
            explanation: "Deluge systems have open nozzles downstream. If the clapper is closed, the downstream piping is empty and at atmospheric pressure (0 PSI)."
        },
        {
            question: "What happens if the main clapper rubber seal fails?",
            options: [
                "The alarm pressure switch will instantly burn out.",
                "Water will leak past the clapper, potentially draining out of the open nozzles and triggering false alarms.",
                "The solenoid will automatically trigger to compensate.",
                "The priming pressure will spike exponentially."
            ],
            correctAnswer: 1,
            explanation: "A compromised seat allows supply water to bypass the clapper. Since deluge nozzles are open, water will flow out of the system constantly, leading to water damage and triggering the flow alarms."
        },
        {
            question: "Why is the manual emergency release necessary?",
            options: [
                "To act as a failsafe to activate the system if electrical power or the fire panel fails.",
                "To calibrate the pressure gauges during maintenance.",
                "To speed up the flow of water during a fire.",
                "To shut off the water after the fire is out."
            ],
            correctAnswer: 0,
            explanation: "The manual pull station bypasses the electrical solenoid, manually venting the priming chamber. This guarantees the system can be deployed even during total electrical failure."
        }
    ];

    // ==========================================
    // COMPLEX ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        // We will simulate a 15 second lifecycle loop based on time.
        // 0-3s: Idle / Primed
        // 3-4s: Solenoid Triggers
        // 4-5s: Priming Pressure Drops, Clapper Opens
        // 5-12s: Full Water Flow
        // 12-15s: Reset phase
        
        const cycleLength = 15;
        const t = (time * speed) % cycleLength;
        
        const phaseIdle = t < 3;
        const phaseTrigger = t >= 3 && t < 4;
        const phaseOpening = t >= 4 && t < 5;
        const phaseFlowing = t >= 5 && t < 12;
        const phaseReset = t >= 12;

        // Needle Base Angles
        const angle0 = -Math.PI * 1.25; // 0 PSI
        const angle100 = -Math.PI * 1.25 + (Math.PI * 1.5) * 0.5; // ~100 PSI

        // 1. Supply Gauge (Always constant with minor fluctuations)
        if(dynamicMeshes.supplyNeedle) {
            const fluctuation = Math.sin(time * 10) * 0.02;
            let targetAngle = angle100 + fluctuation;
            if(phaseFlowing) targetAngle -= 0.2; // Slight pressure drop during flow
            
            // Lerp needle
            dynamicMeshes.supplyNeedle.rotation.z += (targetAngle - dynamicMeshes.supplyNeedle.rotation.z) * 0.1;
        }

        // 2. Priming Gauge & Solenoid LED
        if(dynamicMeshes.primingNeedle && dynamicMeshes.solenoidLed) {
            let targetPrimingAngle = angle100; // Normal
            
            if (phaseTrigger || phaseOpening || phaseFlowing) {
                targetPrimingAngle = angle0; // Depressurized
                dynamicMeshes.solenoidLed.material.emissiveIntensity = 2.0; // LED bright red
                dynamicMeshes.solenoidLed.material.color.setHex(0xff0000);
                dynamicMeshes.solenoidLed.material.emissive.setHex(0xff0000);
            } else {
                dynamicMeshes.solenoidLed.material.emissiveIntensity = 0.5; // LED dim green
                dynamicMeshes.solenoidLed.material.color.setHex(0x00ff00);
                dynamicMeshes.solenoidLed.material.emissive.setHex(0x00ff00);
            }
            
            dynamicMeshes.primingNeedle.rotation.z += (targetPrimingAngle - dynamicMeshes.primingNeedle.rotation.z) * 0.15;
        }

        // 3. System Gauge
        if(dynamicMeshes.systemNeedle) {
            let targetSystemAngle = angle0;
            if(phaseFlowing || phaseOpening) {
                targetSystemAngle = angle100 - 0.2; // Rises to match flowing supply pressure
            }
            dynamicMeshes.systemNeedle.rotation.z += (targetSystemAngle - dynamicMeshes.systemNeedle.rotation.z) * 0.1;
        }

        // 4. Clapper, Push Rod, and Spring Animation
        if(dynamicMeshes.clapper && dynamicMeshes.pushRod && dynamicMeshes.spring) {
            let targetClapperRot = 0; // Closed
            let targetRodY = 3.0; // Down/Locked

            if (phaseFlowing || phaseOpening) {
                targetClapperRot = -Math.PI / 2.5; // Swung open
                targetRodY = 3.8; // Pushed up
            }

            dynamicMeshes.clapper.rotation.x += (targetClapperRot - dynamicMeshes.clapper.rotation.x) * 0.1;
            dynamicMeshes.pushRod.position.y += (targetRodY - dynamicMeshes.pushRod.position.y) * 0.1;
            
            // Compress spring based on push rod position
            const compression = (dynamicMeshes.pushRod.position.y - 3.0) / 0.8; 
            dynamicMeshes.spring.scale.y = 1 - (compression * 0.4);
            dynamicMeshes.spring.position.y = 1.5 + (compression * 0.4);
        }

        // 5. Water Flow Particles (Internal view simulation)
        if(dynamicMeshes.particles) {
            const isFlowing = phaseFlowing || (phaseOpening && t > 4.5);
            dynamicMeshes.particles.forEach(p => {
                if (isFlowing) {
                    p.mesh.visible = true;
                    p.mesh.position.y += p.speed * 0.05 * speed;
                    
                    // Reset particle to bottom if it goes too high
                    if (p.mesh.position.y > 8) {
                        p.mesh.position.y = -6;
                        p.mesh.position.x = p.xOffset;
                        p.mesh.position.z = p.zOffset;
                    }
                    
                    // Add turbulent motion
                    p.mesh.position.x += Math.sin(time * 20 + p.speed) * 0.05;
                    p.mesh.position.z += Math.cos(time * 25 + p.speed) * 0.05;
                } else {
                    p.mesh.visible = false;
                    p.mesh.position.y = -6; // Reset ready for next cycle
                }
            });
        }
        
        // 6. Manual Lever Shake (simulate vibration during massive flow)
        if(dynamicMeshes.manualLever) {
            if(phaseFlowing) {
                dynamicMeshes.manualLever.rotation.z = Math.PI/4 + Math.sin(time * 50) * 0.02;
            } else {
                dynamicMeshes.manualLever.rotation.z = Math.PI/4;
            }
        }
    }

    return {
        group,
        parts,
        description: "An ultra-complex, high-capacity Deluge Valve used in specialized fire protection systems. This model features a fully articulated priming chamber, solenoid trim, manual release logic, and realistic differential pressure gauge behaviors simulating a full activation cycle.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createDelugeValve() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
