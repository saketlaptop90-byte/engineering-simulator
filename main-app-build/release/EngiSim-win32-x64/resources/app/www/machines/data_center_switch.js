import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatedObjects = {
        fans: [],
        leds: []
    };

    // --- Helper Functions for Complex Geometries --- //
    
    function createRoundedRect(width, height, radius) {
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2 + radius, -height / 2);
        shape.lineTo(width / 2 - radius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        shape.lineTo(width / 2, height / 2 - radius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        shape.lineTo(-width / 2 + radius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        shape.lineTo(-width / 2, -height / 2 + radius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
        return shape;
    }

    function createRJ45Shape() {
        const shape = new THREE.Shape();
        shape.moveTo(-0.3, -0.2);
        shape.lineTo(0.3, -0.2);
        shape.lineTo(0.3, 0.2);
        shape.lineTo(0.1, 0.2);
        shape.lineTo(0.1, 0.3); // Notch
        shape.lineTo(-0.1, 0.3); // Notch
        shape.lineTo(-0.1, 0.2);
        shape.lineTo(-0.3, 0.2);
        shape.lineTo(-0.3, -0.2);
        return shape;
    }

    function createFanBladeShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(0.2, 0.5, 0.6, 0.8);
        shape.quadraticCurveTo(0.8, 0.6, 0.9, 0.2);
        shape.quadraticCurveTo(0.4, 0.1, 0, 0);
        return shape;
    }

    // --- 1. Chassis Main Body --- //
    const chassisWidth = 19;
    const chassisHeight = 1.75; // 1U
    const chassisDepth = 15;
    
    const chassisShape = createRoundedRect(chassisWidth - 1, chassisHeight, 0.1);
    const chassisExtrudeOpts = { depth: chassisDepth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeOpts);
    chassisGeo.translate(0, 0, -chassisDepth / 2);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    group.add(chassisMesh);

    parts.push({
        name: "Chassis Frame",
        description: "1U High-density cold-rolled steel enclosure shielding internal components from EMI.",
        material: "Dark Steel",
        function: "Structural support and electromagnetic shielding",
        assemblyOrder: 1,
        connections: ["Motherboard", "Rack Ears", "PSUs", "Fan Modules"],
        failureEffect: "Loss of physical integrity, potential EMI interference.",
        cascadeFailures: ["Motherboard warping", "Module disconnects"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // --- 2 & 3. Rack Ears --- //
    const earShape = new THREE.Shape();
    earShape.moveTo(0, -chassisHeight/2);
    earShape.lineTo(1.5, -chassisHeight/2);
    earShape.lineTo(1.5, chassisHeight/2);
    earShape.lineTo(0, chassisHeight/2);
    const earHole1 = new THREE.Path();
    earHole1.absarc(0.75, 0.5, 0.2, 0, Math.PI * 2, false);
    const earHole2 = new THREE.Path();
    earHole2.absarc(0.75, -0.5, 0.2, 0, Math.PI * 2, false);
    earShape.holes.push(earHole1, earHole2);

    const earExtrudeOpts = { depth: 0.2, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 };
    const earGeo = new THREE.ExtrudeGeometry(earShape, earExtrudeOpts);
    
    const leftEar = new THREE.Mesh(earGeo, aluminum);
    leftEar.position.set(-chassisWidth/2 + 0.5, 0, 0);
    leftEar.rotation.y = Math.PI;
    group.add(leftEar);
    
    parts.push({
        name: "Left Rack Ear",
        description: "Heavy-duty aluminum mounting bracket for EIA-standard 19-inch racks.",
        material: "Aluminum",
        function: "Secures switch to the server rack.",
        assemblyOrder: 2,
        connections: ["Chassis Frame"],
        failureEffect: "Sagging on the left side of the rack.",
        cascadeFailures: ["Cable strain", "Port stress"],
        originalPosition: { x: -chassisWidth/2 + 0.5, y: 0, z: 0 },
        explodedPosition: { x: -chassisWidth/2 - 5, y: 0, z: 0 }
    });

    const rightEar = new THREE.Mesh(earGeo, aluminum);
    rightEar.position.set(chassisWidth/2 - 0.5, 0, -0.2);
    group.add(rightEar);

    parts.push({
        name: "Right Rack Ear",
        description: "Heavy-duty aluminum mounting bracket for EIA-standard 19-inch racks.",
        material: "Aluminum",
        function: "Secures switch to the server rack.",
        assemblyOrder: 3,
        connections: ["Chassis Frame"],
        failureEffect: "Sagging on the right side of the rack.",
        cascadeFailures: ["Cable strain", "Port stress"],
        originalPosition: { x: chassisWidth/2 - 0.5, y: 0, z: -0.2 },
        explodedPosition: { x: chassisWidth/2 + 5, y: 0, z: -0.2 }
    });

    // --- 4 & 5. 48-Port RJ45 Array & LEDs --- //
    const portGroup = new THREE.Group();
    const rj45Shape = createRJ45Shape();
    const rj45ExtrudeOpts = { depth: 0.8, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 };
    const rj45Geo = new THREE.ExtrudeGeometry(rj45Shape, rj45ExtrudeOpts);
    
    const ledGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const ledMatOn = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
    const ledMatActivity = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 2 });

    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 24; col++) {
            const px = -7.5 + col * 0.58;
            const py = 0.3 - row * 0.6;
            
            // Outer EMI Shielding
            const portOuterGeo = new THREE.BoxGeometry(0.5, 0.55, 0.9);
            const portOuter = new THREE.Mesh(portOuterGeo, chrome);
            portOuter.position.set(px, py, 0.45);
            portGroup.add(portOuter);

            // Inner Plastic Connector
            const portInner = new THREE.Mesh(rj45Geo, plastic);
            portInner.position.set(px, py, 0.1);
            portGroup.add(portInner);

            // Left LED (Link State)
            const ledL = new THREE.Mesh(ledGeo, ledMatOn.clone());
            ledL.position.set(px - 0.15, py + 0.35, 0.92);
            portGroup.add(ledL);
            
            // Right LED (Activity)
            const ledR = new THREE.Mesh(ledGeo, ledMatActivity.clone());
            ledR.position.set(px + 0.15, py + 0.35, 0.92);
            portGroup.add(ledR);

            animatedObjects.leds.push(ledR);
        }
    }
    group.add(portGroup);

    parts.push({
        name: "48x 10GBASE-T RJ45 Array",
        description: "High-density copper Ethernet port matrix with integrated PHY and magnetic shielding.",
        material: "Chrome / Plastic",
        function: "Provide multi-gigabit data ingress/egress.",
        assemblyOrder: 4,
        connections: ["Motherboard Data Bus", "LED Controllers"],
        failureEffect: "Loss of connectivity on failed blocks.",
        cascadeFailures: ["Network isolation", "Packet drops"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    parts.push({
        name: "Port Status LED Matrix",
        description: "96 high-intensity micro-LEDs indicating link state and physical layer activity.",
        material: "Glass / Semiconductor",
        function: "Visual diagnostic telemetry.",
        assemblyOrder: 5,
        connections: ["Port Controllers"],
        failureEffect: "Blind diagnostics.",
        cascadeFailures: ["Increased troubleshooting time"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 6 }
    });

    // --- 6. QSFP+ Uplink Ports --- //
    const sfpGroup = new THREE.Group();
    const sfpWidth = 0.6;
    const sfpHeight = 0.5;
    for (let i = 0; i < 4; i++) {
        const px = 7.0 + i * 0.7;
        const py = 0;
        
        const cageShape = new THREE.Shape();
        cageShape.moveTo(-sfpWidth/2, -sfpHeight/2);
        cageShape.lineTo(sfpWidth/2, -sfpHeight/2);
        cageShape.lineTo(sfpWidth/2, sfpHeight/2);
        cageShape.lineTo(-sfpWidth/2, sfpHeight/2);
        const cageHole = new THREE.Path();
        cageHole.moveTo(-0.25, -0.2);
        cageHole.lineTo(0.25, -0.2);
        cageHole.lineTo(0.25, 0.2);
        cageHole.lineTo(-0.25, 0.2);
        cageShape.holes.push(cageHole);
        
        const cageGeo = new THREE.ExtrudeGeometry(cageShape, { depth: 1.2, bevelEnabled: false });
        const cage = new THREE.Mesh(cageGeo, aluminum);
        cage.position.set(px, py, 0.1);
        sfpGroup.add(cage);

        if (i < 2) {
            const transceiverGeo = new THREE.BoxGeometry(0.48, 0.38, 1.5);
            const transceiver = new THREE.Mesh(transceiverGeo, steel);
            transceiver.position.set(px, py, 0.8);
            sfpGroup.add(transceiver);

            const tabGeo = new THREE.TorusGeometry(0.1, 0.02, 8, 16);
            const tab = new THREE.Mesh(tabGeo, rubber);
            tab.position.set(px, py, 1.6);
            tab.rotation.x = Math.PI / 2;
            sfpGroup.add(tab);

            const path = new THREE.CatmullRomCurve3([
                new THREE.Vector3(px, py, 1.6),
                new THREE.Vector3(px, py - 1, 3),
                new THREE.Vector3(px + 2, py - 2, 5)
            ]);
            const cableGeo = new THREE.TubeGeometry(path, 20, 0.05, 8, false);
            const cableMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, wireframe: false }); 
            const cable = new THREE.Mesh(cableGeo, cableMat);
            sfpGroup.add(cable);
        }
    }
    group.add(sfpGroup);

    parts.push({
        name: "4x 40G QSFP+ Uplink Cages",
        description: "High-bandwidth fiber optic transceiver cages for backbone connectivity.",
        material: "Aluminum",
        function: "Aggregate traffic to spine switches.",
        assemblyOrder: 6,
        connections: ["Core Switching ASIC"],
        failureEffect: "Severe network bottleneck or isolation.",
        cascadeFailures: ["Spanning tree recalculation", "Traffic dropping"],
        originalPosition: { x: 7.5, y: 0, z: 0 },
        explodedPosition: { x: 7.5, y: 0, z: 5 }
    });

    parts.push({
        name: "OM4 Fiber Optic Twin-Ax Cables",
        description: "Laser-optimized multimode fiber cables plugged into active transceivers.",
        material: "Glass / PVC",
        function: "Transmit optical pulses at high speeds.",
        assemblyOrder: 7,
        connections: ["QSFP+ Transceivers"],
        failureEffect: "Signal degradation or complete link loss.",
        cascadeFailures: ["CRC errors", "Link flapping"],
        originalPosition: { x: 7.5, y: 0, z: 0 },
        explodedPosition: { x: 7.5, y: -3, z: 8 }
    });

    // --- 8. Management Cluster --- //
    const mgmtGroup = new THREE.Group();
    const usbShape = new THREE.Shape();
    usbShape.moveTo(-0.15, -0.05);
    usbShape.lineTo(0.15, -0.05);
    usbShape.lineTo(0.15, 0.05);
    usbShape.lineTo(-0.15, 0.05);
    const usbGeo = new THREE.ExtrudeGeometry(usbShape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 });
    const usbMesh = new THREE.Mesh(usbGeo, chrome);
    usbMesh.position.set(-8.5, -0.2, 0.8);
    mgmtGroup.add(usbMesh);

    const consolePort = new THREE.Mesh(rj45Geo, plastic);
    consolePort.position.set(-8.5, 0.4, 0.1);
    const consoleOuter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.9), chrome);
    consoleOuter.position.set(-8.5, 0.4, 0.45);
    mgmtGroup.add(consolePort, consoleOuter);
    group.add(mgmtGroup);

    parts.push({
        name: "Out-of-Band Management Cluster",
        description: "Dedicated RJ45 serial console and USB interfaces for bare-metal provisioning.",
        material: "Chrome / Plastic",
        function: "Direct terminal access independent of data plane.",
        assemblyOrder: 8,
        connections: ["Management Processor"],
        failureEffect: "Loss of direct terminal access.",
        cascadeFailures: ["Inability to recover from software brick"],
        originalPosition: { x: -8.5, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 3, z: 3 }
    });

    // --- 9 & 10. PSUs --- //
    const psuGroup = new THREE.Group();
    const psuWidth = 3;
    const psuHeight = 1.6;
    const psuDepth = 6;
    
    for(let i=0; i<2; i++) {
        const px = -6 + i * 3.5;
        const pz = -chassisDepth + psuDepth/2;
        
        const singlePsu = new THREE.Group();

        const psuGeo = new THREE.BoxGeometry(psuWidth, psuHeight, psuDepth);
        const psuMesh = new THREE.Mesh(psuGeo, steel);
        
        const handleGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 24);
        const handle = new THREE.Mesh(handleGeo, aluminum);
        handle.position.set(0, 0, -psuDepth/2 - 0.3);
        handle.rotation.x = Math.PI/2;
        
        const c14Shape = new THREE.Shape();
        c14Shape.moveTo(-0.3, -0.2);
        c14Shape.lineTo(0.3, -0.2);
        c14Shape.lineTo(0.3, 0.2);
        c14Shape.lineTo(-0.3, 0.2);
        const c14Hole1 = new THREE.Path(); c14Hole1.absarc(-0.15, 0, 0.05, 0, Math.PI*2, false);
        const c14Hole2 = new THREE.Path(); c14Hole2.absarc(0, 0, 0.05, 0, Math.PI*2, false);
        const c14Hole3 = new THREE.Path(); c14Hole3.absarc(0.15, 0, 0.05, 0, Math.PI*2, false);
        c14Shape.holes.push(c14Hole1, c14Hole2, c14Hole3);
        
        const c14Geo = new THREE.ExtrudeGeometry(c14Shape, { depth: 0.4, bevelEnabled: false });
        const c14 = new THREE.Mesh(c14Geo, plastic);
        c14.position.set(0.8, 0, -psuDepth/2 - 0.2);
        c14.rotation.y = Math.PI;
        
        singlePsu.add(psuMesh, handle, c14);
        singlePsu.position.set(px, 0, pz);
        psuGroup.add(singlePsu);

        parts.push({
            name: `1200W Titanium PSU Module ${i+1}`,
            description: "Hot-swappable power supply unit with 96% efficiency.",
            material: "Steel / Electronics",
            function: "Convert AC input to stable DC for internal components.",
            assemblyOrder: 9 + i,
            connections: ["Power Backplane"],
            failureEffect: "Failover to secondary PSU. If both fail, total blackout.",
            cascadeFailures: ["Thermal spikes on remaining PSU"],
            originalPosition: { x: px, y: 0, z: pz },
            explodedPosition: { x: px, y: 0, z: pz - 8 }
        });
    }
    group.add(psuGroup);

    // --- 11 to 14. Cooling Fans --- //
    const fanModules = new THREE.Group();
    const fanRadius = 0.6;
    const fanDepth = 2;
    const fanBladeGeo = new THREE.ExtrudeGeometry(createFanBladeShape(), { depth: 0.05, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 });
    
    for (let i=0; i<4; i++) {
        const px = 2 + i * 2;
        const pz = -chassisDepth + fanDepth/2;
        
        const singleFan = new THREE.Group();

        const housingGeo = new THREE.BoxGeometry(1.8, 1.6, fanDepth);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        singleFan.add(housing);

        const cylinderGeo = new THREE.CylinderGeometry(fanRadius + 0.05, fanRadius + 0.05, fanDepth + 0.1, 32);
        const cylinder = new THREE.Mesh(cylinderGeo, plastic);
        cylinder.rotation.x = Math.PI/2;
        singleFan.add(cylinder);

        const rotor = new THREE.Group();
        rotor.position.set(0, 0, -fanDepth/2 + 0.2);
        
        const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const hub = new THREE.Mesh(hubGeo, plastic);
        hub.rotation.x = Math.PI/2;
        rotor.add(hub);

        for (let b = 0; b < 7; b++) {
            const blade = new THREE.Mesh(fanBladeGeo, plastic);
            const angle = (b / 7) * Math.PI * 2;
            blade.position.set(Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, 0);
            blade.rotation.z = angle;
            blade.rotation.x = 0.4;
            rotor.add(blade);
        }
        singleFan.add(rotor);
        animatedObjects.fans.push(rotor);

        const fanHandleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
        const fanHandle = new THREE.Mesh(fanHandleGeo, aluminum);
        fanHandle.position.set(0, 0, -fanDepth/2 - 0.2);
        fanHandle.rotation.z = Math.PI/2;
        singleFan.add(fanHandle);

        singleFan.position.set(px, 0, pz);
        fanModules.add(singleFan);

        parts.push({
            name: `Hot-Swap Fan Module ${i+1}`,
            description: "High-RPM counter-rotating fan module ensuring back-to-front airflow.",
            material: "Plastic / Metal",
            function: "Dissipate immense heat generated by the switching ASIC.",
            assemblyOrder: 11 + i,
            connections: ["Fan Controller Backplane"],
            failureEffect: "Remaining fans spin up to 100% (jet engine mode).",
            cascadeFailures: ["Thermal throttling of ASIC if multiple fail"],
            originalPosition: { x: px, y: 0, z: pz },
            explodedPosition: { x: px, y: 0, z: pz - 6 - (i*0.5) }
        });
    }
    group.add(fanModules);

    // --- 15. Internals (Motherboard & ASIC Heatsink) --- //
    const internalsGroup = new THREE.Group();
    const pcbGeo = new THREE.BoxGeometry(17, 0.1, 10);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x004400, roughness: 0.8, metalness: 0.2 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.position.set(0, -chassisHeight/2 + 0.1, -chassisDepth/2);
    internalsGroup.add(pcb);

    const heatsinkSize = 4;
    const heatsinkHeight = 1.0;
    const finCount = 20;
    const hsGroup = new THREE.Group();
    const hsBaseGeo = new THREE.BoxGeometry(heatsinkSize, 0.1, heatsinkSize);
    const hsBase = new THREE.Mesh(hsBaseGeo, copper);
    hsGroup.add(hsBase);
    
    for(let i = 0; i < finCount; i++) {
        const finGeo = new THREE.BoxGeometry(0.05, heatsinkHeight, heatsinkSize);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(-heatsinkSize/2 + (i * (heatsinkSize / finCount)) + 0.1, heatsinkHeight/2, 0);
        hsGroup.add(fin);
    }
    hsGroup.position.set(0, -chassisHeight/2 + 0.2, -chassisDepth/2);
    internalsGroup.add(hsGroup);

    group.add(internalsGroup);

    parts.push({
        name: "Switching ASIC & Custom Heatsink",
        description: "Terabit-class silicon processing billions of packets per second, topped with a massive copper-core finned heatsink.",
        material: "Copper / Aluminum / Silicon",
        function: "Core routing, switching logic, and packet forwarding.",
        assemblyOrder: 15,
        connections: ["Motherboard BGA", "Port Interfaces"],
        failureEffect: "Catastrophic failure. Total switch death.",
        cascadeFailures: ["Complete network segment blackout"],
        originalPosition: { x: 0, y: -chassisHeight/2 + 0.2, z: -chassisDepth/2 },
        explodedPosition: { x: 0, y: 5, z: -chassisDepth/2 }
    });

    // --- 16. VRM Capacitors --- //
    const capsGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
        const cap = new THREE.Mesh(capGeo, aluminum);
        cap.position.set(-3 + (i%5)*0.3, -chassisHeight/2 + 0.25, -6 - Math.floor(i/5)*0.3);
        capsGroup.add(cap);
    }
    group.add(capsGroup);

    parts.push({
        name: "VRM Capacitor Bank",
        description: "High-endurance solid state capacitors for voltage regulation.",
        material: "Aluminum / Electrolyte",
        function: "Smooth out voltage ripples to the ASIC.",
        assemblyOrder: 16,
        connections: ["Motherboard Power Plane"],
        failureEffect: "System instability and packet corruption under load.",
        cascadeFailures: ["ASIC micro-stutters"],
        originalPosition: { x: -3, y: -chassisHeight/2 + 0.25, z: -6 },
        explodedPosition: { x: -3, y: 10, z: -6 }
    });

    // --- 17. Power Distribution Cables --- //
    const cableLinesGeo = new THREE.Group();
    for (let i=0; i<6; i++) {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-4 + i*0.2, -0.5, -chassisDepth + 4),
            new THREE.Vector3(-5 + i*0.5, -0.2, -chassisDepth/2 + 2),
            new THREE.Vector3(2 + i*0.1, -0.5, -3)
        ]);
        const tubeGeo = new THREE.TubeGeometry(path, 32, 0.08, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
        cableLinesGeo.add(tubeMesh);
    }
    group.add(cableLinesGeo);

    parts.push({
        name: "Thick AWG Power Distribution Cables",
        description: "High-gauge insulated wiring carrying 12V DC from PSUs to the motherboard.",
        material: "Copper / Rubber",
        function: "Deliver clean, high-amperage power across the chassis.",
        assemblyOrder: 17,
        connections: ["PSU Backplane", "Motherboard VRMs"],
        failureEffect: "Power delivery drop, random resets.",
        cascadeFailures: ["VRM overload", "ASIC crash"],
        originalPosition: { x: 0, y: 0, z: -chassisDepth/2 },
        explodedPosition: { x: 0, y: 8, z: -chassisDepth/2 }
    });

    // --- 18. Top Cover --- //
    const coverGeo = new THREE.BoxGeometry(chassisWidth - 1, 0.05, chassisDepth);
    const cover = new THREE.Mesh(coverGeo, darkSteel);
    cover.position.set(0, chassisHeight/2, -chassisDepth/2);
    group.add(cover);

    parts.push({
        name: "Chassis Top Cover & Baffle",
        description: "Removable steel panel. Forces airflow tightly through the heatsinks instead of escaping upward.",
        material: "Dark Steel",
        function: "Airflow baffling and physical protection.",
        assemblyOrder: 18,
        connections: ["Chassis Frame"],
        failureEffect: "Airflow bypasses heatsinks.",
        cascadeFailures: ["ASIC overheating", "Fan overdrive"],
        originalPosition: { x: 0, y: chassisHeight/2, z: -chassisDepth/2 },
        explodedPosition: { x: 0, y: 15, z: -chassisDepth/2 }
    });

    // --- Metadata --- //
    const description = "A massive, hyper-realistic, enterprise-grade Data Center Switch. Features 48x 10G ports, 4x 40G uplinks, dual titanium PSUs, and an array of hot-swappable counter-rotating fan modules. The internal ASIC requires extreme cooling via intricate heatsinks and ducted airflow.";

    const quizQuestions = [
        {
            question: "Why does the top cover failure lead to ASIC overheating?",
            options: [
                "It disables the power supply",
                "Airflow bypasses the heatsink instead of being forced through it",
                "It causes EMI interference",
                "It severs the fiber optic cables"
            ],
            correctAnswer: 1,
            explanation: "The top cover acts as a baffle, sealing the chassis so the fans pull air forcefully through the dense heatsink fins. Without it, air takes the path of least resistance over the top."
        },
        {
            question: "What happens if one of the hot-swappable cooling fans fails?",
            options: [
                "The switch powers off immediately",
                "The LEDs flash red and data stops",
                "Remaining fans spin up to 100% to compensate",
                "The redundant PSU takes over cooling"
            ],
            correctAnswer: 2,
            explanation: "Enterprise hardware is fault-tolerant. If one fan drops RPM or fails, the fan controller detects it and instantly commands the remaining fans to maximum speed (jet engine mode) to maintain required airflow."
        },
        {
            question: "What is the purpose of the Out-of-Band Management Cluster?",
            options: [
                "To provide 40G uplink speeds",
                "To supply redundant power",
                "To allow direct terminal access independent of the main data plane",
                "To cool the ASIC"
            ],
            correctAnswer: 2,
            explanation: "OOB management (console/USB) provides a dedicated path to the switch OS even if the main switching ASIC crashes, the network is isolated, or the ports are disabled."
        },
        {
            question: "What material is utilized in the Core Switching ASIC's massive heatsink base to maximize heat transfer?",
            options: [
                "Plastic",
                "Rubber",
                "Fiberglass",
                "Copper"
            ],
            correctAnswer: 3,
            explanation: "Copper has exceptionally high thermal conductivity, making it ideal for the base of the heatsink directly touching the high-heat silicon, before dissipating into the aluminum fins."
        },
        {
            question: "What kind of cables are plugged into the QSFP+ transceivers?",
            options: [
                "CAT6 Ethernet",
                "OM4 Fiber Optic Cables",
                "Coaxial Cables",
                "Serial DB9"
            ],
            correctAnswer: 1,
            explanation: "The QSFP+ uplink cages house optical transceivers which accept high-bandwidth fiber optic cables, such as OM4, for backbone connections."
        }
    ];

    // --- Animation Loop --- //
    function animate(time, speed, meshes) {
        // High-RPM fans spinning
        const fanSpeed = speed * 1.5; // Very fast
        animatedObjects.fans.forEach((fan, i) => {
            // Counter-rotating pairs
            const direction = i % 2 === 0 ? 1 : -1;
            fan.rotation.z += fanSpeed * direction;
        });

        // Simulating network activity on LEDs
        const pulse = Math.sin(time * 10);
        animatedObjects.leds.forEach((led, i) => {
            // Pseudo-random blinking based on index and time
            const activity = Math.sin(time * 20 + i * 45) > 0.5;
            if (activity) {
                led.material.emissiveIntensity = 2.0 + pulse;
            } else {
                led.material.emissiveIntensity = 0.2;
            }
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
export function createDataCenterSwitch() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
