import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Custom High-Tech Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 2.5, wireframe: false });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 2.0 });
    const darkRubber = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.95, metalness: 0.1 });
    const titanium = new THREE.MeshStandardMaterial({ color: 0xaabbcc, roughness: 0.3, metalness: 0.7 });
    const goldContacts = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.2, metalness: 1.0 });
    const heavyArmor = new THREE.MeshStandardMaterial({ color: 0x223333, roughness: 0.6, metalness: 0.8 });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0 });

    const animatedParts = {
        vanes: [],
        rotors: [],
        segments: [],
        pulsatingLights: [],
        hydrophones: []
    };

    // 1. Tow Cable (Armored)
    const cableGroup = new THREE.Group();
    cableGroup.position.z = -35;
    const cableGeo = new THREE.CylinderGeometry(0.4, 0.4, 30, 32);
    const towCable = new THREE.Mesh(cableGeo, darkRubber);
    towCable.rotation.x = Math.PI / 2;
    cableGroup.add(towCable);
    
    // Helical armor wraps
    const helixGeo = new THREE.TorusGeometry(0.42, 0.08, 16, 64);
    for (let i = -15; i < 15; i += 0.5) {
        const ring = new THREE.Mesh(helixGeo, heavyArmor);
        ring.position.set(0, 0, i);
        // Slightly rotate to simulate helix thread
        ring.rotation.x = 0.1;
        cableGroup.add(ring);
    }
    group.add(cableGroup);

    // 2. Tow Head (Hydrodynamic Nose Cone)
    const headGroup = new THREE.Group();
    headGroup.position.z = -15;
    const headPoints = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        headPoints.push(new THREE.Vector2(Math.sin(t * Math.PI * 0.5) * 1.8, t * 7));
    }
    const headGeo = new THREE.LatheGeometry(headPoints, 64);
    const towHead = new THREE.Mesh(headGeo, titanium);
    towHead.rotation.x = Math.PI / 2;
    headGroup.add(towHead);
    
    // Head Sensor Windows
    const windowGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.5, 32, 1, false, 0, Math.PI / 4);
    for (let i = 0; i < 4; i++) {
        const window = new THREE.Mesh(windowGeo, glass);
        window.rotation.x = Math.PI / 2;
        window.rotation.y = i * Math.PI / 2;
        window.position.z = 2; // Relative to head
        headGroup.add(window);
    }
    group.add(headGroup);

    // 3. Telemetry & Processing Hub
    const telemetryGroup = new THREE.Group();
    telemetryGroup.position.z = -6;
    
    const telemetryBodyGeo = new THREE.CylinderGeometry(1.8, 1.8, 4, 64);
    const telemetryBody = new THREE.Mesh(telemetryBodyGeo, steel);
    telemetryBody.rotation.x = Math.PI / 2;
    telemetryGroup.add(telemetryBody);

    // Telemetry Heat Sinks (Extruded details)
    const heatSinkGeo = new THREE.BoxGeometry(4.0, 0.2, 3);
    for (let i = 0; i < 8; i++) {
        const sink = new THREE.Mesh(heatSinkGeo, darkSteel);
        sink.rotation.z = i * Math.PI / 4;
        telemetryGroup.add(sink);
    }
    
    // Status Rings
    const statusRingGeo = new THREE.TorusGeometry(1.85, 0.1, 16, 64);
    const statusRing1 = new THREE.Mesh(statusRingGeo, neonBlue);
    statusRing1.position.z = -1.5;
    const statusRing2 = new THREE.Mesh(statusRingGeo, neonBlue);
    statusRing2.position.z = 1.5;
    telemetryGroup.add(statusRing1, statusRing2);
    animatedParts.pulsatingLights.push(statusRing1, statusRing2);
    group.add(telemetryGroup);

    // 4. Hydrophone Array Segments
    const numSegments = 6;
    const segmentLength = 10;
    const segmentsGroup = new THREE.Group();
    
    for (let i = 0; i < numSegments; i++) {
        const segZ = -1.5 + i * (segmentLength + 1);
        const segGroup = new THREE.Group();
        segGroup.position.z = segZ;
        segGroup.userData.originalZ = segZ;
        segGroup.userData.index = i;
        
        // Main Segment Tube
        const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, segmentLength, 64);
        const tube = new THREE.Mesh(tubeGeo, darkRubber);
        tube.rotation.x = Math.PI / 2;
        segGroup.add(tube);
        
        // Armored Ribs
        for (let r = -4; r <= 4; r += 2) {
            const ribGeo = new THREE.TorusGeometry(1.52, 0.15, 16, 64);
            const rib = new THREE.Mesh(ribGeo, heavyArmor);
            rib.position.z = r;
            segGroup.add(rib);
        }
        
        // Hydrophone Modules (Complex Arrays)
        const numBands = 5;
        for (let b = 0; b < numBands; b++) {
            const bandZ = -3 + b * 1.5;
            
            // Band base
            const bandGeo = new THREE.CylinderGeometry(1.55, 1.55, 0.6, 64);
            const band = new THREE.Mesh(bandGeo, aluminum);
            band.rotation.x = Math.PI / 2;
            band.position.z = bandZ;
            segGroup.add(band);
            
            // Individual Receivers
            const numReceivers = 16;
            for (let j = 0; j < numReceivers; j++) {
                const angle = (j / numReceivers) * Math.PI * 2;
                
                // Receiver housing
                const rxHousingGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 16);
                const rxHousing = new THREE.Mesh(rxHousingGeo, darkSteel);
                rxHousing.rotation.x = Math.PI / 2;
                rxHousing.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, bandZ);
                rxHousing.lookAt(0, 0, bandZ);
                
                // Active core
                const rxCoreGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.42, 16);
                const rxCore = new THREE.Mesh(rxCoreGeo, glowingGreen);
                rxCore.rotation.x = Math.PI / 2;
                rxCore.position.copy(rxHousing.position);
                rxCore.lookAt(0, 0, bandZ);
                
                segGroup.add(rxHousing, rxCore);
                animatedParts.hydrophones.push({ mesh: rxCore, baseAngle: angle, bandIdx: b, segIdx: i });
            }
        }
        
        // Depth Control Vanes (on even segments)
        if (i % 2 === 0) {
            const vaneBaseGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.2, 32);
            const vaneBase = new THREE.Mesh(vaneBaseGeo, steel);
            segGroup.add(vaneBase);
            
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(1.0, 3.0);
            shape.lineTo(0, 2.5);
            shape.lineTo(-1.0, 3.0);
            shape.lineTo(0, 0);
            
            const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 };
            const vaneGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
            const leftVane = new THREE.Mesh(vaneGeo, titanium);
            leftVane.position.set(1.6, 0, 0);
            leftVane.rotation.y = Math.PI / 2;
            leftVane.rotation.z = -Math.PI / 2;
            
            const rightVane = new THREE.Mesh(vaneGeo, titanium);
            rightVane.position.set(-1.6, 0, 0);
            rightVane.rotation.y = Math.PI / 2;
            rightVane.rotation.z = Math.PI / 2;
            
            const vaneAssembly = new THREE.Group();
            vaneAssembly.add(vaneBase, leftVane, rightVane);
            segGroup.add(vaneAssembly);
            
            animatedParts.vanes.push({ group: vaneAssembly, baseRot: vaneAssembly.rotation.x, phase: i });
        }
        
        // Station Keeping Thrusters (on odd segments)
        if (i % 2 === 1) {
            const thrusterMountGeo = new THREE.BoxGeometry(4.0, 0.5, 1.2);
            const thrusterMount = new THREE.Mesh(thrusterMountGeo, darkSteel);
            segGroup.add(thrusterMount);
            
            [-2.0, 2.0].forEach(x => {
                const thruster = new THREE.Group();
                thruster.position.set(x, 0, 0);
                
                // Cowling
                const cowlingGeo = new THREE.CylinderGeometry(0.8, 0.9, 2.0, 32, 1, true);
                const cowling = new THREE.Mesh(cowlingGeo, heavyArmor);
                cowling.rotation.x = Math.PI / 2;
                thruster.add(cowling);
                
                // Motor
                const motorGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
                const motor = new THREE.Mesh(motorGeo, copper);
                motor.rotation.x = Math.PI / 2;
                thruster.add(motor);
                
                // Struts
                const strutGeo = new THREE.BoxGeometry(1.6, 0.05, 0.2);
                const strut1 = new THREE.Mesh(strutGeo, steel);
                const strut2 = new THREE.Mesh(strutGeo, steel);
                strut2.rotation.z = Math.PI / 2;
                thruster.add(strut1, strut2);
                
                // Propeller
                const propGroup = new THREE.Group();
                propGroup.position.z = 0.6;
                const hubGeo = new THREE.SphereGeometry(0.25, 32, 32);
                const hub = new THREE.Mesh(hubGeo, chrome);
                propGroup.add(hub);
                
                for (let bladeIdx = 0; bladeIdx < 5; bladeIdx++) {
                    const bShape = new THREE.Shape();
                    bShape.moveTo(0, 0);
                    bShape.quadraticCurveTo(0.2, 0.5, 0.1, 0.7);
                    bShape.quadraticCurveTo(-0.2, 0.5, 0, 0);
                    const bGeo = new THREE.ExtrudeGeometry(bShape, {depth: 0.02, bevelEnabled: false});
                    const blade = new THREE.Mesh(bGeo, darkSteel);
                    blade.rotation.z = (bladeIdx * Math.PI * 2) / 5;
                    blade.rotation.x = Math.PI / 6; // pitch
                    propGroup.add(blade);
                }
                
                thruster.add(propGroup);
                segGroup.add(thruster);
                animatedParts.rotors.push(propGroup);
            });
        }
        
        // Flexible Joint to next segment
        if (i < numSegments - 1) {
            const jointGeo = new THREE.SphereGeometry(1.4, 32, 32);
            const joint = new THREE.Mesh(jointGeo, rubber);
            joint.position.z = segmentLength / 2 + 0.5;
            segGroup.add(joint);
        }
        
        segmentsGroup.add(segGroup);
        animatedParts.segments.push(segGroup);
    }
    group.add(segmentsGroup);

    // 5. Tail Drogue & End Cap
    const tailGroup = new THREE.Group();
    const finalZ = -1.5 + (numSegments - 1) * (segmentLength + 1) + segmentLength / 2;
    tailGroup.position.z = finalZ + 2;

    const droguePoints = [];
    for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        // Parabolic shape
        droguePoints.push(new THREE.Vector2(1.5 - Math.pow(t, 1.5) * 1.5, t * 8));
    }
    const drogueGeo = new THREE.LatheGeometry(droguePoints, 64);
    const tailDrogue = new THREE.Mesh(drogueGeo, titanium);
    tailDrogue.rotation.x = Math.PI / 2; // Pointing backwards
    tailGroup.add(tailDrogue);
    
    // Stabilizer Fins
    for (let i = 0; i < 4; i++) {
        const finGeo = new THREE.BoxGeometry(0.1, 2.5, 6);
        const fin = new THREE.Mesh(finGeo, heavyArmor);
        fin.position.set(Math.cos(i * Math.PI / 2) * 1.2, Math.sin(i * Math.PI / 2) * 1.2, 3);
        fin.rotation.z = i * Math.PI / 2;
        
        // Add neon edge
        const edgeGeo = new THREE.BoxGeometry(0.12, 2.5, 0.2);
        const edge = new THREE.Mesh(edgeGeo, neonOrange);
        edge.position.set(Math.cos(i * Math.PI / 2) * 1.2, Math.sin(i * Math.PI / 2) * 1.2, 6);
        edge.rotation.z = i * Math.PI / 2;
        
        tailGroup.add(fin, edge);
        animatedParts.pulsatingLights.push(edge);
    }
    
    // Exhaust / Emitter at tail
    const emitterGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const emitter = new THREE.Mesh(emitterGeo, glowingGreen);
    emitter.rotation.x = Math.PI / 2;
    emitter.position.z = 8;
    tailGroup.add(emitter);
    animatedParts.pulsatingLights.push(emitter);

    group.add(tailGroup);
    animatedParts.tail = tailGroup;

    // 6. External Umbilical Cables running along the whole length
    const totalArrayLength = (numSegments * 11) + 20; 
    
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1, length = 10) {
            super();
            this.scale = scale;
            this.length = length;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const z = t * this.length - 15; // start from head
            const x = Math.cos(t * Math.PI * 40) * 0.1 * this.scale;
            const y = Math.sin(t * Math.PI * 40) * 0.1 * this.scale;
            return optionalTarget.set(x, y, z);
        }
    }

    const umbPath1 = new CustomSinCurve(1, totalArrayLength);
    const umbGeo1 = new THREE.TubeGeometry(umbPath1, 300, 0.15, 12, false);
    
    const umbilical1 = new THREE.Mesh(umbGeo1, copper);
    umbilical1.position.set(1.6, 0.5, 0);
    const umbilical2 = new THREE.Mesh(umbGeo1, plastic);
    umbilical2.position.set(-1.6, 0.5, 0);
    group.add(umbilical1, umbilical2);

    const parts = [
        {
            name: "Armored Tow Cable",
            description: "Heavy-duty shielded umbilical providing massive power delivery and terabit fiber-optic telemetry to the entire array while withstanding tens of thousands of pounds of towing tension.",
            material: "Kevlar Core & Tungsten Steel Armor",
            function: "Power delivery and structural tether.",
            assemblyOrder: 1,
            connections: ["Hydrodynamic Tow Head", "Surface Winch"],
            failureEffect: "Loss of array control and complete signal blackout. Potential catastrophic array separation.",
            cascadeFailures: ["Array loss", "Telemetry Failure"],
            originalPosition: { x: 0, y: 0, z: -35 },
            explodedPosition: { x: 0, y: 20, z: -35 }
        },
        {
            name: "Hydrodynamic Tow Head",
            description: "Streamlined titanium nose cone designed to heavily reduce cavitation, turbulence, and water resistance at high towing speeds, ensuring quiet operation.",
            material: "Titanium Alloy & Reinforced Quartz Glass",
            function: "Drag reduction and forward obstacle detection.",
            assemblyOrder: 2,
            connections: ["Armored Tow Cable", "Telemetry Hub"],
            failureEffect: "Massive increase in acoustic noise, severely masking weak sonar signals from deep-sea sources.",
            cascadeFailures: ["Signal Degradation", "Turbulence Inducement"],
            originalPosition: { x: 0, y: 0, z: -15 },
            explodedPosition: { x: 0, y: -20, z: -15 }
        },
        {
            name: "Telemetry & Processing Hub",
            description: "The primary computational core of the array. Pre-processes massive streams of raw acoustic data before transmitting them up the tow cable.",
            material: "Steel Enclosure with Sapphire Glass Status Rings",
            function: "Data aggregation and signal digitization.",
            assemblyOrder: 3,
            connections: ["Tow Head", "Array Segment 1"],
            failureEffect: "Data bottleneck; raw analog signals cannot be digitized and are lost.",
            cascadeFailures: ["Loss of target resolution"],
            originalPosition: { x: 0, y: 0, z: -6 },
            explodedPosition: { x: 15, y: 15, z: -6 }
        },
        {
            name: "Array Segment 1 (Sensors)",
            description: "The first modular acoustic receiver segment, containing hundreds of highly sensitive piezoelectric hydrophones arranged in phase-aligned bands.",
            material: "Acoustically Transparent Rubber & Aluminum Housing",
            function: "Acoustic pressure wave detection.",
            assemblyOrder: 4,
            connections: ["Telemetry Hub", "Flexible Joint"],
            failureEffect: "Loss of forward listening sector.",
            cascadeFailures: ["Beamforming distortion"],
            originalPosition: { x: 0, y: 0, z: -1.5 },
            explodedPosition: { x: -20, y: 0, z: -1.5 }
        },
        {
            name: "Depth Control Vanes (Segment 1)",
            description: "Articulated titanium hydrofoils that dynamically adjust pitch to maintain the array at a precise depth despite surface vessel heave and swell.",
            material: "Titanium",
            function: "Active depth and attitude control.",
            assemblyOrder: 5,
            connections: ["Array Segment 1 Base"],
            failureEffect: "Array porpoising; inconsistent depth causing wild pressure variations on sensors.",
            cascadeFailures: ["Loss of acoustic calibration"],
            originalPosition: { x: 0, y: 0, z: -1.5 },
            explodedPosition: { x: 0, y: 15, z: -1.5 }
        },
        {
            name: "Array Segment 2 (Propulsion)",
            description: "Contains active station-keeping thrusters to correct lateral drift and maintain a perfectly straight line during cross-current towing.",
            material: "Heavy Armor & Dark Rubber",
            function: "Lateral stabilization.",
            assemblyOrder: 6,
            connections: ["Flexible Joint 1", "Flexible Joint 2"],
            failureEffect: "Array bowing, ruining the linear beamforming geometry.",
            cascadeFailures: ["Target bearing calculation errors"],
            originalPosition: { x: 0, y: 0, z: 9.5 },
            explodedPosition: { x: 20, y: 0, z: 9.5 }
        },
        {
            name: "Lateral Thruster Port",
            description: "High-torque electric motor driving a 5-blade skewed propeller optimized for low cavitation and ultra-quiet operation.",
            material: "Copper Windings, Chrome Hub, Dark Steel Blades",
            function: "Vector thrust for anti-drift.",
            assemblyOrder: 7,
            connections: ["Array Segment 2 Thruster Mount"],
            failureEffect: "Inability to counter port-side currents.",
            cascadeFailures: ["Array deviation"],
            originalPosition: { x: -2, y: 0, z: 9.5 },
            explodedPosition: { x: -10, y: 10, z: 9.5 }
        },
        {
            name: "Lateral Thruster Starboard",
            description: "High-torque electric motor driving a 5-blade skewed propeller optimized for low cavitation and ultra-quiet operation.",
            material: "Copper Windings, Chrome Hub, Dark Steel Blades",
            function: "Vector thrust for anti-drift.",
            assemblyOrder: 8,
            connections: ["Array Segment 2 Thruster Mount"],
            failureEffect: "Inability to counter starboard-side currents.",
            cascadeFailures: ["Array deviation"],
            originalPosition: { x: 2, y: 0, z: 9.5 },
            explodedPosition: { x: 10, y: 10, z: 9.5 }
        },
        {
            name: "Flexible Vibration Isolation Joint",
            description: "A heavy-duty elastomeric coupling between segments that absorbs mechanical vibrations from the tow vessel before they reach the acoustic sensors.",
            material: "Industrial Rubber Compound",
            function: "Mechanical decoupling.",
            assemblyOrder: 9,
            connections: ["Segment 2", "Segment 3"],
            failureEffect: "Vibrations travel down the array, drowning out weak acoustic contacts.",
            cascadeFailures: ["Self-noise saturation"],
            originalPosition: { x: 0, y: 0, z: 15 },
            explodedPosition: { x: 0, y: -15, z: 15 }
        },
        {
            name: "Array Segment 3 (Sensors)",
            description: "Mid-body acoustic receiver segment. Correlates signals with Segment 1 to determine the exact range and bearing of distant contacts.",
            material: "Acoustically Transparent Rubber & Aluminum",
            function: "Mid-range acoustic detection.",
            assemblyOrder: 10,
            connections: ["Flexible Joint 2", "Flexible Joint 3"],
            failureEffect: "Degraded triangulation capabilities.",
            cascadeFailures: ["Ranging errors"],
            originalPosition: { x: 0, y: 0, z: 20.5 },
            explodedPosition: { x: -20, y: 0, z: 20.5 }
        },
        {
            name: "Piezoelectric Hydrophone Nodes",
            description: "Thousands of microscopic crystals that generate voltage when subjected to the minute pressure variations of distant sound waves.",
            material: "Gold Contacts & Piezo-Ceramic",
            function: "Sound-to-electrical transduction.",
            assemblyOrder: 11,
            connections: ["Aluminum Receiver Bands"],
            failureEffect: "Deaf spots in the array's listening pattern.",
            cascadeFailures: ["Reduced sensitivity"],
            originalPosition: { x: 0, y: 1.6, z: 20.5 },
            explodedPosition: { x: 0, y: 25, z: 20.5 }
        },
        {
            name: "Array Segment 4 (Propulsion)",
            description: "Rear stabilizing thruster segment. Works in tandem with forward thrusters to pivot the entire array independently of the tow vessel.",
            material: "Heavy Armor & Dark Rubber",
            function: "Yaw control.",
            assemblyOrder: 12,
            connections: ["Flexible Joint 3", "Flexible Joint 4"],
            failureEffect: "Loss of rear yaw control.",
            cascadeFailures: ["Snaking maneuverability loss"],
            originalPosition: { x: 0, y: 0, z: 31.5 },
            explodedPosition: { x: 20, y: 0, z: 31.5 }
        },
        {
            name: "Array Segment 5 (Sensors)",
            description: "Aft acoustic receiver segment. Crucial for detecting targets positioned behind the towing vessel, resolving forward/aft ambiguity.",
            material: "Acoustically Transparent Rubber",
            function: "Aft acoustic detection.",
            assemblyOrder: 13,
            connections: ["Flexible Joint 4", "Flexible Joint 5"],
            failureEffect: "Blind spot in the baffles (rear of the array).",
            cascadeFailures: ["Vulnerability to tailing contacts"],
            originalPosition: { x: 0, y: 0, z: 42.5 },
            explodedPosition: { x: -20, y: 0, z: 42.5 }
        },
        {
            name: "Tail Drogue Assembly",
            description: "A large hydrodynamic cone that generates calculated drag, acting like an underwater parachute to keep the entire 3km array pulled perfectly taut.",
            material: "Titanium & Reinforced Composite",
            function: "Tension generation and tail stabilization.",
            assemblyOrder: 14,
            connections: ["Segment 5 Flexible Joint"],
            failureEffect: "The array will go slack, bunch up, and tangle, completely destroying its linear geometry.",
            cascadeFailures: ["Complete system failure", "Cable snap"],
            originalPosition: { x: 0, y: 0, z: 55.5 },
            explodedPosition: { x: 0, y: -20, z: 55.5 }
        },
        {
            name: "Aft Emitter & Bioluminescence Shield",
            description: "High-power active sonar projector and anti-fouling UV emitter located at the very tail to prevent deep-sea organisms from attaching to the array.",
            material: "Heavy Armor & UV Emitter Glass",
            function: "Active pinging and biological defense.",
            assemblyOrder: 15,
            connections: ["Tail Drogue"],
            failureEffect: "Marine growth buildup altering hydrodynamics and acoustic transparency.",
            cascadeFailures: ["Increased drag", "Sensor blinding"],
            originalPosition: { x: 0, y: 0, z: 63.5 },
            explodedPosition: { x: 0, y: 0, z: 80 }
        }
    ];

    const quizQuestions = [
        {
            question: "What is the critical function of the Tail Drogue?",
            options: [
                "To emit high-frequency communication bursts to submarines.",
                "To act as an anchor when the vessel stops.",
                "To generate hydrodynamic drag, keeping the long array taut and linear.",
                "To house the main battery banks for the entire array."
            ],
            correctAnswer: 2,
            explanation: "Towed arrays are long and flexible; without a drogue providing drag at the tail, they would go slack and tangle, destroying the required linear geometry needed for beamforming."
        },
        {
            question: "Why are there lateral thrusters mounted on specific segments of the array?",
            options: [
                "To propel the array forward in case the tow cable breaks.",
                "To counter cross-currents and prevent the array from bowing out of a straight line.",
                "To intentionally spin the array like a drill.",
                "To agitate the water and confuse enemy torpedoes."
            ],
            correctAnswer: 1,
            explanation: "Cross-currents can push the flexible array into a curve. Thrusters apply counter-force to keep the array perfectly straight, which is mathematically required to accurately calculate target bearings."
        },
        {
            question: "What material characteristic is essential for the outer housing of the sensor segments?",
            options: [
                "It must be completely rigid and inflexible.",
                "It must be acoustically transparent to allow sound waves to reach the hydrophones.",
                "It must be highly reflective to radar.",
                "It must generate its own magnetic field."
            ],
            correctAnswer: 1,
            explanation: "The rubber outer sheath must have the same acoustic impedance as seawater (acoustically transparent) so that sound waves pass through it without distortion or reflection before hitting the sensors."
        },
        {
            question: "What does the Telemetry Hub do before sending data up the tow cable?",
            options: [
                "It translates the sound waves into visual light.",
                "It physically stores all data on hard drives to be retrieved later.",
                "It aggregates, digitizes, and multiplexes massive streams of raw analog acoustic data.",
                "It commands the towing vessel on where to steer."
            ],
            correctAnswer: 2,
            explanation: "With thousands of hydrophones, sending raw analog signals up a single cable would result in massive interference. The hub digitizes and multiplexes this data for clean, high-speed fiber-optic transmission."
        },
        {
            question: "What is the primary danger of vibrations traveling down the tow cable from the surface ship?",
            options: [
                "They could snap the cable.",
                "They create 'self-noise' that drowns out the faint acoustic signals of distant targets.",
                "They attract hostile marine life.",
                "They cause the array to heat up dangerously."
            ],
            correctAnswer: 1,
            explanation: "The array is designed to listen to extreme faint sounds. If mechanical vibrations from the ship's engines travel down the cable, the array will only hear its own ship, entirely blinding its sensors."
        }
    ];

    function animate(time, speed = 1, meshes) {
        const t = time * speed;

        // 1. Undulate the array segments to simulate towing through water
        animatedParts.segments.forEach((segGroup, idx) => {
            // Sine wave moving along the Z axis
            const wavePhase = (segGroup.userData.originalZ * 0.1) - (t * 2.0);
            const xOffset = Math.sin(wavePhase) * 0.4;
            const yOffset = Math.cos(wavePhase * 0.8) * 0.2; // Complex wave
            
            segGroup.position.x = xOffset;
            segGroup.position.y = yOffset;
            
            // Calculate derivative for rotation to follow the path
            const dx = Math.cos(wavePhase) * 0.4 * 0.1; 
            const dy = -Math.sin(wavePhase * 0.8) * 0.2 * 0.08;
            
            segGroup.rotation.y = dx;
            segGroup.rotation.x = -dy;
        });

        // 2. Animate tail drogue matching the end of the wave
        if (animatedParts.tail) {
            const tailZ = animatedParts.tail.position.z;
            const wavePhase = (tailZ * 0.1) - (t * 2.0);
            animatedParts.tail.position.x = Math.sin(wavePhase) * 0.5;
            animatedParts.tail.position.y = Math.cos(wavePhase * 0.8) * 0.25;
            animatedParts.tail.rotation.y = Math.cos(wavePhase) * 0.05;
        }

        // 3. Spin Thruster Rotors
        animatedParts.rotors.forEach((rotor, idx) => {
            // Alternate rotation directions
            const dir = idx % 2 === 0 ? 1 : -1;
            // Speed fluctuates slightly based on sine wave to simulate dynamic station keeping
            const dynamicSpeed = 15.0 + Math.sin(t * 3.0 + idx) * 5.0;
            rotor.rotation.z += dynamicSpeed * dir * 0.016 * speed;
        });

        // 4. Actuate Depth Control Vanes
        animatedParts.vanes.forEach((vaneData) => {
            // Vanes tilt up and down continuously to maintain depth
            const tilt = Math.sin(t * 1.5 + vaneData.phase) * 0.3;
            vaneData.group.rotation.x = vaneData.baseRot + tilt;
        });

        // 5. Pulsating Neon/Diagnostic Lights
        const pulse = (Math.sin(t * 5.0) + 1.0) / 2.0; // 0.0 to 1.0
        animatedParts.pulsatingLights.forEach((mesh, idx) => {
            if (mesh.material.emissiveIntensity !== undefined) {
                // Different offset per light
                const localPulse = (Math.sin(t * 5.0 + idx) + 1.0) / 2.0;
                mesh.material.emissiveIntensity = 1.0 + localPulse * 2.0;
            }
        });

        // 6. Hydrophone Active Scanning (Glowing sweep effect)
        animatedParts.hydrophones.forEach((hp) => {
            // Create a sweeping activation effect down the length of the array
            const sweep = (t * 2.0 - hp.segIdx * 1.5 - hp.bandIdx * 0.2) % (Math.PI * 2);
            // Angle based activation (like a beamforming sweep)
            const angleDiff = Math.abs((sweep % (Math.PI * 2)) - hp.baseAngle);
            if (angleDiff < 0.5 || angleDiff > (Math.PI * 2 - 0.5)) {
                hp.mesh.material.emissiveIntensity = 4.0;
                hp.mesh.scale.set(1.2, 1.2, 1.2);
            } else {
                hp.mesh.material.emissiveIntensity = 0.5;
                hp.mesh.scale.set(1.0, 1.0, 1.0);
            }
        });
    }

    return {
        group,
        parts,
        description: "A highly classified, massive deep-water acoustic towed array sensor system. Spanning thousands of meters, it utilizes complex phase-aligned piezoelectric hydrophones, vector thruster station-keeping, and extreme armor to detect faint submarine signatures from across entire oceans.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createSonarArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
