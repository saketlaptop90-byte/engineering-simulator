import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatedObjects = {
        fans: [],
        leds: [],
        statusLights: [],
        sensorRotator: null
    };

    // Custom Materials
    const redLEDMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5, transparent: true, opacity: 0.9, roughness: 0.2, metalness: 0.1 });
    const blueLEDMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9, roughness: 0.2, metalness: 0.1 });
    const whiteLEDMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0, transparent: true, opacity: 0.9, roughness: 0.2, metalness: 0.1 });
    const farRedLEDMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, emissive: 0x8b0000, emissiveIntensity: 1.5, transparent: true, opacity: 0.9, roughness: 0.2, metalness: 0.1 });
    const statusLightMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 });
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x002200, roughness: 0.8, metalness: 0.1 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.0 });
    
    // -------------------------------------------------------------
    // 1. EXTUDED ALUMINUM HEATSINK
    // -------------------------------------------------------------
    const hsWidth = 12;
    const hsLength = 45;
    const hsBaseHeight = 0.5;
    const hsFinHeight = 2.5;
    const hsFinWidth = 0.15;
    const hsNumFins = 40;
    
    const hsShape = new THREE.Shape();
    hsShape.moveTo(0, 0);
    hsShape.lineTo(hsWidth, 0);
    hsShape.lineTo(hsWidth, hsBaseHeight);
    
    for (let i = 0; i < hsNumFins; i++) {
        const x = hsWidth - (i * (hsWidth / (hsNumFins - 1)));
        if (i > 0) hsShape.lineTo(x + hsFinWidth, hsBaseHeight);
        hsShape.lineTo(x, hsFinHeight);
        hsShape.lineTo(x - hsFinWidth, hsFinHeight);
        hsShape.lineTo(x - hsFinWidth, hsBaseHeight);
    }
    hsShape.lineTo(0, hsBaseHeight);
    hsShape.lineTo(0, 0);
    
    const hsExtrudeSettings = { depth: hsLength, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const hsGeo = new THREE.ExtrudeGeometry(hsShape, hsExtrudeSettings);
    // Center it
    hsGeo.translate(-hsWidth / 2, 0, -hsLength / 2);
    
    const heatsink = new THREE.Mesh(hsGeo, aluminum);
    heatsink.rotation.x = Math.PI; // Flip it so fins point UP
    group.add(heatsink);
    
    parts.push({
        name: "Main Extruded Aluminum Heatsink",
        description: "A precision-extruded block of 6061-T6 aluminum featuring 40 high-aspect-ratio fins. Dissipates upwards of 1200W of thermal energy to maintain optimal diode junction temperatures.",
        material: "aluminum",
        function: "Thermal Management",
        assemblyOrder: 1,
        connections: ["LED Circuit Boards", "Power Supply Chassis"],
        failureEffect: "Critical thermal runaway, leading to rapid spectral shift and diode burnout.",
        cascadeFailures: ["LED Arrays", "Power Drivers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // -------------------------------------------------------------
    // 2. THERMAL INTERFACE PADS
    // -------------------------------------------------------------
    const timGeo = new THREE.BoxGeometry(hsWidth - 0.2, 0.05, hsLength - 0.2);
    const tim = new THREE.Mesh(timGeo, rubber);
    tim.position.set(0, -0.025, 0);
    group.add(tim);

    parts.push({
        name: "Graphite Thermal Interface Pad",
        description: "An ultra-thin, highly anisotropic graphite sheet that eliminates micro-air gaps between the LED PCBs and the heatsink.",
        material: "rubber",
        function: "Thermal Conduction",
        assemblyOrder: 2,
        connections: ["Heatsink", "LED PCBs"],
        failureEffect: "Localized hotspots and uneven thermal expansion.",
        cascadeFailures: ["Deep Red Diodes Cluster"],
        originalPosition: { x: 0, y: -0.025, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // -------------------------------------------------------------
    // 3. LED CIRCUIT BOARDS (PCBs)
    // -------------------------------------------------------------
    const pcbGroup = new THREE.Group();
    const numPCBs = 4;
    const pcbLength = hsLength / numPCBs - 0.2;
    
    const pcbGeo = new THREE.BoxGeometry(hsWidth - 0.4, 0.1, pcbLength);
    
    for(let i=0; i<numPCBs; i++) {
        const pcb = new THREE.Mesh(pcbGeo, pcbMat);
        pcb.position.set(0, -0.1, -hsLength/2 + pcbLength/2 + i*(pcbLength + 0.2) + 0.1);
        pcbGroup.add(pcb);
    }
    group.add(pcbGroup);

    parts.push({
        name: "Metal-Core Printed Circuit Boards (MCPCBs)",
        description: "Four segment modular MCPCBs utilizing copper traces layered on an aluminum substrate for maximized electrical routing and thermal transport.",
        material: "plastic", 
        function: "Circuit Routing and Mounting",
        assemblyOrder: 3,
        connections: ["Thermal Interface Pad", "LED Diodes", "DC Connectors"],
        failureEffect: "Open circuit or short circuit across diode arrays.",
        cascadeFailures: ["Full Spectrum White Diodes", "Power Drivers"],
        originalPosition: { x: 0, y: -0.1, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // -------------------------------------------------------------
    // 4. LED DIODES (MASSIVE ARRAY)
    // -------------------------------------------------------------
    const ledGroup = new THREE.Group();
    const ledGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 8);
    const lensGeo = new THREE.SphereGeometry(0.08, 8, 8, 0, Math.PI*2, 0, Math.PI/2);
    
    const rows = 12;
    const cols = 60;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const xPos = -hsWidth/2 + 0.5 + r * ((hsWidth - 1) / (rows - 1));
            const zPos = -hsLength/2 + 0.5 + c * ((hsLength - 1) / (cols - 1));
            
            const localZ = (zPos + hsLength/2) % (hsLength / numPCBs);
            if (localZ > pcbLength) continue;

            let mat = whiteLEDMat;
            let type = "white";
            
            if (r % 3 === 0 && c % 2 === 0) {
                mat = redLEDMat;
                type = "red";
            } else if (r % 4 === 0 && c % 3 === 0) {
                mat = blueLEDMat;
                type = "blue";
            } else if (r === 6 && c % 5 === 0) {
                mat = farRedLEDMat;
                type = "farRed";
            }
            
            const led = new THREE.Mesh(ledGeo, pcbMat); 
            const lens = new THREE.Mesh(lensGeo, mat);
            lens.position.y = 0.075;
            led.add(lens);
            
            led.position.set(xPos, -0.15, zPos);
            led.rotation.x = Math.PI; 
            
            ledGroup.add(led);
            animatedObjects.leds.push({ mesh: lens, type: type, originalIntensity: mat.emissiveIntensity });
        }
    }
    group.add(ledGroup);

    parts.push({
        name: "Full Spectrum White Diodes Array (4000K)",
        description: "Hundreds of high-efficacy full-spectrum diodes providing the baseline photosynthetically active radiation (PAR).",
        material: "glass",
        function: "Primary Photon Emission",
        assemblyOrder: 4,
        connections: ["MCPCBs"],
        failureEffect: "Stunted plant vegetative growth.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.15, z: 0 },
        explodedPosition: { x: -10, y: 2, z: 0 }
    });
    
    parts.push({
        name: "Deep Red Diodes Cluster (660nm)",
        description: "Targeted 660nm diodes specifically tuned to peak chlorophyll A absorption for flowering and fruiting stages.",
        material: "glass",
        function: "Supplemental Spectrum Modulation",
        assemblyOrder: 5,
        connections: ["MCPCBs"],
        failureEffect: "Delayed flowering response in photoperiodic plants.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.15, z: 0 },
        explodedPosition: { x: 10, y: 2, z: 0 }
    });

    parts.push({
        name: "Far Red Diodes Cluster (730nm)",
        description: "730nm diodes to trigger the Emerson enhancement effect, accelerating photosynthetic rates and controlling photomorphogenesis.",
        material: "glass",
        function: "Photomorphogenesis Control",
        assemblyOrder: 6,
        connections: ["MCPCBs"],
        failureEffect: "Lack of stem elongation control.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.15, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -10 }
    });

    // -------------------------------------------------------------
    // 5. HIGH-FREQUENCY POWER DRIVERS
    // -------------------------------------------------------------
    const driverGroup = new THREE.Group();
    const driverWidth = 4;
    const driverLength = 12;
    const driverHeight = 2.5;

    const dShape = new THREE.Shape();
    dShape.moveTo(0.5, 0);
    dShape.lineTo(driverWidth - 0.5, 0);
    dShape.quadraticCurveTo(driverWidth, 0, driverWidth, 0.5);
    dShape.lineTo(driverWidth, driverHeight - 0.5);
    dShape.quadraticCurveTo(driverWidth, driverHeight, driverWidth - 0.5, driverHeight);
    dShape.lineTo(0.5, driverHeight);
    dShape.quadraticCurveTo(0, driverHeight, 0, driverHeight - 0.5);
    dShape.lineTo(0, 0.5);
    dShape.quadraticCurveTo(0, 0, 0.5, 0);

    const dExtrude = { depth: driverLength, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const dGeo = new THREE.ExtrudeGeometry(dShape, dExtrude);
    dGeo.translate(-driverWidth/2, 0, -driverLength/2);

    const driverA = new THREE.Mesh(dGeo, darkSteel);
    driverA.position.set(-3, hsFinHeight + 0.1, -10);
    
    const driverB = new THREE.Mesh(dGeo, darkSteel);
    driverB.position.set(3, hsFinHeight + 0.1, 10);
    
    const dRibGeo = new THREE.BoxGeometry(driverWidth - 0.4, 0.2, driverLength - 0.4);
    for(let r=0; r<10; r++) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(driverWidth - 0.2, 0.3, 0.1), chrome);
        rib.position.set(0, driverHeight, -driverLength/2 + 1 + r*(driverLength-2)/9);
        driverA.add(rib.clone());
        driverB.add(rib.clone());
    }

    driverGroup.add(driverA);
    driverGroup.add(driverB);
    group.add(driverGroup);

    parts.push({
        name: "High-Frequency Power Driver A",
        description: "Intelligent, DALI-dimmable constant current LED driver featuring active power factor correction (PFC) and 95% conversion efficiency.",
        material: "darkSteel",
        function: "Power Conversion and Dimming",
        assemblyOrder: 7,
        connections: ["AC Mains Harness", "DC Distribution Harness", "Heatsink"],
        failureEffect: "Complete array shutdown or severe flickering.",
        cascadeFailures: ["Cooling Fans"],
        originalPosition: { x: -3, y: hsFinHeight + 0.1, z: -10 },
        explodedPosition: { x: -8, y: 20, z: -15 }
    });

    parts.push({
        name: "High-Frequency Power Driver B",
        description: "Secondary driver dedicated to independent control of the Far Red and UV spectrum channels, encapsulated in thermally conductive epoxy.",
        material: "darkSteel",
        function: "Spectrum Tuning Power Supply",
        assemblyOrder: 8,
        connections: ["AC Mains Harness", "DC Distribution Harness", "Heatsink"],
        failureEffect: "Loss of supplemental spectrum control.",
        cascadeFailures: [],
        originalPosition: { x: 3, y: hsFinHeight + 0.1, z: 10 },
        explodedPosition: { x: 8, y: 20, z: 15 }
    });

    // -------------------------------------------------------------
    // 6. COOLING FANS (ACTIVE AIRFLOW)
    // -------------------------------------------------------------
    const fanGroup = new THREE.Group();
    const fanRadius = 2.5;
    
    const shroudPoints = [];
    for(let i=0; i<=10; i++) {
        const t = i/10;
        shroudPoints.push(new THREE.Vector2(fanRadius + 0.2 + Math.sin(t*Math.PI)*0.2, (t-0.5)*1.5));
    }
    const shroudGeo = new THREE.LatheGeometry(shroudPoints, 32);
    
    const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.4, 16);
    
    const bladeGeo = new THREE.BoxGeometry(fanRadius - 0.8, 0.05, 0.8);
    bladeGeo.translate((fanRadius - 0.8)/2 + 0.8, 0, 0);

    const buildFan = (x, z) => {
        const fGroup = new THREE.Group();
        const shroud = new THREE.Mesh(shroudGeo, plastic);
        const hub = new THREE.Mesh(hubGeo, chrome);
        
        const rotor = new THREE.Group();
        rotor.add(hub);
        
        for(let b=0; b<7; b++) {
            const blade = new THREE.Mesh(bladeGeo, plastic);
            blade.rotation.x = Math.PI / 6; 
            blade.rotation.y = (b / 7) * Math.PI * 2;
            rotor.add(blade);
        }
        
        const grilleGeo = new THREE.TorusGeometry(fanRadius-0.2, 0.05, 8, 32);
        const grille = new THREE.Mesh(grilleGeo, steel);
        grille.rotation.x = Math.PI/2;
        grille.position.y = 0.8;
        fGroup.add(grille);
        
        const crossGeo = new THREE.CylinderGeometry(0.05, 0.05, fanRadius*2, 8);
        const cross1 = new THREE.Mesh(crossGeo, steel);
        cross1.rotation.z = Math.PI/2;
        cross1.position.y = 0.8;
        const cross2 = new THREE.Mesh(crossGeo, steel);
        cross2.rotation.x = Math.PI/2;
        cross2.rotation.z = Math.PI/2;
        cross2.position.y = 0.8;
        fGroup.add(cross1);
        fGroup.add(cross2);
        
        fGroup.add(shroud);
        fGroup.add(rotor);
        fGroup.position.set(x, hsFinHeight + 1, z);
        
        animatedObjects.fans.push(rotor);
        
        return fGroup;
    };

    const fan1 = buildFan(-3, 10);
    const fan2 = buildFan(3, -10);
    fanGroup.add(fan1);
    fanGroup.add(fan2);
    group.add(fanGroup);

    parts.push({
        name: "Active Cooling Fan Assembly 1",
        description: "High-RPM, mag-lev bearing axial fan generating turbulent boundary layer disruption over the heatsink fins.",
        material: "plastic",
        function: "Forced Convection Cooling",
        assemblyOrder: 9,
        connections: ["Driver A", "Heatsink"],
        failureEffect: "Thermal throttling of LED drivers.",
        cascadeFailures: ["LED Arrays"],
        originalPosition: { x: -3, y: hsFinHeight + 1, z: 10 },
        explodedPosition: { x: -12, y: 18, z: 10 }
    });

    parts.push({
        name: "Active Cooling Fan Assembly 2",
        description: "High-RPM, mag-lev bearing axial fan functioning in a push-pull aerodynamic configuration with Fan 1.",
        material: "plastic",
        function: "Forced Convection Cooling",
        assemblyOrder: 10,
        connections: ["Driver B", "Heatsink"],
        failureEffect: "Reduced lifespan of driver capacitors.",
        cascadeFailures: ["Driver B"],
        originalPosition: { x: 3, y: hsFinHeight + 1, z: -10 },
        explodedPosition: { x: 12, y: 18, z: -10 }
    });

    // -------------------------------------------------------------
    // 7. WIRING AND HARNESSES (CUBIC BEZIER TUBES)
    // -------------------------------------------------------------
    const wireGroup = new THREE.Group();
    
    const createWire = (p1, p2, p3, p4, radius, color) => {
        const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, radius, 8, false);
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
        return new THREE.Mesh(tubeGeo, mat);
    };

    const wire1 = createWire(
        new THREE.Vector3(-3, driverHeight + hsFinHeight, -4), 
        new THREE.Vector3(-1, driverHeight + hsFinHeight + 1, 0),
        new THREE.Vector3(1, hsFinHeight + 1, 0),
        new THREE.Vector3(0, hsFinHeight, 0),
        0.1, 0xff0000 
    );
    const wire2 = createWire(
        new THREE.Vector3(-3.5, driverHeight + hsFinHeight, -4), 
        new THREE.Vector3(-1.5, driverHeight + hsFinHeight + 1, -1),
        new THREE.Vector3(0.5, hsFinHeight + 1, -1),
        new THREE.Vector3(-0.5, hsFinHeight, -1),
        0.1, 0x000000 
    );
    
    for(let i=0; i<3; i++) {
        const z1 = -hsLength/2 + pcbLength + i*(pcbLength + 0.2);
        const z2 = z1 + 0.2;
        const jump1 = createWire(
            new THREE.Vector3(2, -0.1, z1),
            new THREE.Vector3(2.5, -0.3, z1),
            new THREE.Vector3(2.5, -0.3, z2),
            new THREE.Vector3(2, -0.1, z2),
            0.05, 0xffaa00
        );
        wireGroup.add(jump1);
    }

    wireGroup.add(wire1);
    wireGroup.add(wire2);
    group.add(wireGroup);

    parts.push({
        name: "DC Distribution Harness",
        description: "Heavy-gauge, Teflon-insulated wiring carrying high current DC voltage from the drivers down to the individual PCB segments.",
        material: "rubber",
        function: "Current Distribution",
        assemblyOrder: 11,
        connections: ["Drivers", "MCPCBs"],
        failureEffect: "Loss of power to specific PCB segments.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: hsFinHeight, z: 0 },
        explodedPosition: { x: 5, y: 12, z: 5 }
    });

    // -------------------------------------------------------------
    // 8. ENVIRONMENTAL SENSOR & WIRELESS ANTENNA
    // -------------------------------------------------------------
    const sensorGroup = new THREE.Group();
    
    const sBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), plastic);
    sBox.position.set(0, hsFinHeight + 0.5, hsLength/2 - 2);
    sensorGroup.add(sBox);

    const sHead = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16), darkSteel);
    sHead.position.set(0, hsFinHeight + 1.2, hsLength/2 - 2);
    const slens = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), glass);
    slens.position.set(0, 0, 0.4);
    sHead.add(slens);
    sensorGroup.add(sHead);
    animatedObjects.sensorRotator = sHead;

    const antBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5), steel);
    antBase.position.set(0, hsFinHeight + 1, hsLength/2 - 0.5);
    const antStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), rubber);
    antStem.position.set(0, hsFinHeight + 2.5, hsLength/2 - 0.5);
    sensorGroup.add(antBase);
    sensorGroup.add(antStem);

    const statusLight = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), statusLightMat);
    statusLight.position.set(0.6, hsFinHeight + 1, hsLength/2 - 2);
    sensorGroup.add(statusLight);
    animatedObjects.statusLights.push(statusLight);

    group.add(sensorGroup);

    parts.push({
        name: "Environmental Sensor Node (Temp/RH/PAR)",
        description: "Integrated multi-spectral and climate sensor suite that continuously feeds data back to the master controller via Zigbee mesh.",
        material: "plastic",
        function: "Telemetry and Feedback",
        assemblyOrder: 12,
        connections: ["Driver Controller", "Zigbee Antenna"],
        failureEffect: "Loss of automated spectral adjustments based on canopy feedback.",
        cascadeFailures: ["Wireless Transceiver Antenna"],
        originalPosition: { x: 0, y: hsFinHeight + 0.5, z: hsLength/2 - 2 },
        explodedPosition: { x: 0, y: 15, z: hsLength/2 + 5 }
    });

    parts.push({
        name: "Wireless Transceiver Antenna (Zigbee)",
        description: "2.4GHz omnidirectional dipole antenna for encrypted mesh-network communication across massive indoor farming facilities.",
        material: "rubber",
        function: "Wireless Telemetry",
        assemblyOrder: 13,
        connections: ["Sensor Node"],
        failureEffect: "Fixture drops off the network, defaulting to standalone schedule.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: hsFinHeight + 2.5, z: hsLength/2 - 0.5 },
        explodedPosition: { x: 0, y: 18, z: hsLength/2 + 5 }
    });

    // -------------------------------------------------------------
    // 9. SUSPENSION CABLES AND TURNBUCKLES
    // -------------------------------------------------------------
    const suspensionGroup = new THREE.Group();
    
    const buildSuspension = (x, z) => {
        const sGroup = new THREE.Group();
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), steel);
        bracket.position.set(x, hsFinHeight + 0.25, z);
        sGroup.add(bracket);
        
        const eye = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 8, 16), chrome);
        eye.position.set(x, hsFinHeight + 0.8, z);
        eye.rotation.y = Math.PI/4;
        sGroup.add(eye);

        const tbGroup = new THREE.Group();
        const tbBody = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 8), darkSteel);
        const tbHook1 = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 16), chrome);
        tbHook1.position.y = -0.65;
        const tbHook2 = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 16), chrome);
        tbHook2.position.y = 0.65;
        tbGroup.add(tbBody);
        tbGroup.add(tbHook1);
        tbGroup.add(tbHook2);
        tbGroup.position.set(x, hsFinHeight + 1.8, z);
        sGroup.add(tbGroup);

        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 10, 8), steel);
        cable.position.set(x, hsFinHeight + 7.5, z);
        sGroup.add(cable);
        
        return sGroup;
    };

    suspensionGroup.add(buildSuspension(-hsWidth/2 + 1, -hsLength/2 + 2));
    suspensionGroup.add(buildSuspension(hsWidth/2 - 1, -hsLength/2 + 2));
    suspensionGroup.add(buildSuspension(-hsWidth/2 + 1, hsLength/2 - 2));
    suspensionGroup.add(buildSuspension(hsWidth/2 - 1, hsLength/2 - 2));
    
    group.add(suspensionGroup);

    parts.push({
        name: "Titanium Suspension Cables (x4)",
        description: "Aircraft-grade braided titanium suspension cables capable of supporting 500kg of load each, ensuring extreme safety overhead.",
        material: "steel",
        function: "Structural Support",
        assemblyOrder: 14,
        connections: ["Turnbuckles", "Ceiling Struts"],
        failureEffect: "Catastrophic mechanical collapse of the entire unit.",
        cascadeFailures: ["Turnbuckles", "Heatsink", "AC Cables"],
        originalPosition: { x: 0, y: hsFinHeight + 7.5, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    parts.push({
        name: "Cable Tensioning Turnbuckles (x4)",
        description: "Precision-machined turnbuckles allowing micro-adjustments to fixture leveling to ensure perfectly even photon distribution.",
        material: "darkSteel",
        function: "Leveling and Tensioning",
        assemblyOrder: 15,
        connections: ["Suspension Cables", "Mounting Brackets"],
        failureEffect: "Uneven fixture hanging, leading to non-uniform PAR maps.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: hsFinHeight + 1.8, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // -------------------------------------------------------------
    // 10. AC INPUT CONNECTOR BLOCK
    // -------------------------------------------------------------
    const acBlock = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 3), plastic);
    acBlock.position.set(0, hsFinHeight + 0.75, -hsLength/2 + 1.5);
    
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), rubber);
    plug.rotation.x = Math.PI/2;
    plug.position.set(0, hsFinHeight + 0.75, -hsLength/2 + 0.5);
    
    const mainCable = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 16), rubber);
    mainCable.rotation.x = Math.PI/2;
    mainCable.position.set(0, hsFinHeight + 0.75, -hsLength/2 - 4);
    
    group.add(acBlock);
    group.add(plug);
    group.add(mainCable);

    parts.push({
        name: "AC Mains Input Connector Block (IP67)",
        description: "Industrial, waterproof bayonet-style connector block handling 277V/480V 3-phase input for massive commercial daisy-chaining.",
        material: "plastic",
        function: "Primary Power Interface",
        assemblyOrder: 16,
        connections: ["Driver A", "Driver B", "Mains Power"],
        failureEffect: "Total power loss or catastrophic short to ground.",
        cascadeFailures: ["Drivers"],
        originalPosition: { x: 0, y: hsFinHeight + 0.75, z: -hsLength/2 + 1.5 },
        explodedPosition: { x: 0, y: 10, z: -hsLength/2 - 10 }
    });

    // -------------------------------------------------------------
    // QUIZ QUESTIONS
    // -------------------------------------------------------------
    const quizQuestions = [
        {
            question: "What is the primary function of the Far Red (730nm) diodes in this array?",
            options: [
                "To increase vegetative growth speed.",
                "To trigger the Emerson enhancement effect and control photomorphogenesis.",
                "To act as a primary heat source during dark periods.",
                "To kill airborne pathogens and mold."
            ],
            correctAnswer: 1,
            explanation: "Far Red (730nm) light works in tandem with deep red light to trigger the Emerson enhancement effect, which accelerates photosynthesis. It also plays a key role in photomorphogenesis (stem elongation and flowering triggers)."
        },
        {
            question: "Why are the MCPCBs (Metal-Core Printed Circuit Boards) made with an aluminum substrate?",
            options: [
                "Aluminum is a cheap electrical insulator.",
                "To provide rigidity against wind currents.",
                "To maximize thermal transport away from the LEDs into the heatsink.",
                "To reflect stray light back down towards the plants."
            ],
            correctAnswer: 2,
            explanation: "High-power LEDs generate significant heat. The aluminum core in an MCPCB quickly conducts this heat away from the diode junction and into the main heatsink, preventing thermal degradation."
        },
        {
            question: "What is the purpose of the active cooling fans in this specific design?",
            options: [
                "To cool the plants below.",
                "To disrupt the turbulent boundary layer over the heatsink fins, vastly increasing forced convection.",
                "To blow dust off the LED lenses.",
                "To act as a turbine to generate backup power."
            ],
            correctAnswer: 1,
            explanation: "While the massive aluminum heatsink provides passive cooling, the high-RPM mag-lev fans force air across the fins, disrupting the thermal boundary layer and exponentially increasing the rate of heat dissipation via forced convection."
        },
        {
            question: "What happens if the Environmental Sensor Node fails?",
            options: [
                "The entire light shuts down immediately to prevent fire.",
                "The suspension cables release, dropping the unit.",
                "Loss of automated spectral adjustments based on canopy feedback, reverting to a static schedule.",
                "The AC mains input short circuits."
            ],
            correctAnswer: 2,
            explanation: "The sensor node provides telemetry (PAR, Temp, RH) to the main controller. If it fails, the system loses closed-loop feedback and must default to a pre-programmed, standalone static schedule."
        },
        {
            question: "Why are Titanium Suspension Cables specified for this fixture?",
            options: [
                "For aesthetic appeal in commercial settings.",
                "Titanium conducts electricity better than copper.",
                "They provide extreme load-bearing safety margins and corrosion resistance in humid greenhouse environments.",
                "They are elastic and absorb seismic vibrations."
            ],
            correctAnswer: 2,
            explanation: "In massive commercial greenhouses, fixtures are heavy and the environment is extremely humid. Titanium offers unparalleled strength-to-weight ratios and is highly resistant to corrosive humidity and chemical fertilizers."
        }
    ];

    // -------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------
    const animate = (time, speed, meshes) => {
        animatedObjects.fans.forEach(fan => {
            fan.rotation.y -= 0.5 * speed;
        });

        if (animatedObjects.sensorRotator) {
            animatedObjects.sensorRotator.rotation.y = Math.sin(time * 0.002 * speed) * (Math.PI / 3);
        }

        animatedObjects.statusLights.forEach(light => {
            light.material.emissiveIntensity = 1 + Math.sin(time * 0.01 * speed) * 0.5;
        });

        animatedObjects.leds.forEach((ledData) => {
            const mesh = ledData.mesh;
            const px = mesh.parent.position.x;
            const pz = mesh.parent.position.z;
            
            const wave = Math.sin(pz * 0.5 - time * 0.005 * speed) * Math.cos(px * 0.5 + time * 0.003 * speed);
            
            if (ledData.type === 'red') {
                mesh.material.emissiveIntensity = ledData.originalIntensity + wave * 1.5;
            } else if (ledData.type === 'blue') {
                mesh.material.emissiveIntensity = ledData.originalIntensity + wave * 1.0;
            } else if (ledData.type === 'white') {
                mesh.material.emissiveIntensity = ledData.originalIntensity + Math.sin(time * 0.001 * speed) * 0.5;
            } else if (ledData.type === 'farRed') {
                mesh.material.emissiveIntensity = ledData.originalIntensity + Math.random() * 0.5;
            }
        });
    };

    return {
        group,
        parts,
        description: "An ultra-massive, high-tech commercial agricultural LED grow array. Features intricate extruded aluminum thermodynamics, modular metal-core PCBs, multi-spectral diode clusters, active aerodynamics, and integrated environmental telemetry sensors.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createLEDArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
