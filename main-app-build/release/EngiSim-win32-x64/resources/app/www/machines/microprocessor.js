import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createMicroprocessor(THREE) {
    const mainGroup = new THREE.Group();
    const parts = [];

    // 1. Silicon Die
    const dieGroup = new THREE.Group();
    const dieMesh = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.2, 4.5), darkSteel);
    dieMesh.position.set(0, 0.35, 0);
    dieGroup.add(dieMesh);

    parts.push({
        name: "Silicon Die",
        description: "The core computing chip containing billions of microscopic transistors.",
        group: dieGroup,
        material: "Dark Steel / Silicon",
        function: "Executes mathematical and logical operations.",
        assemblyOrder: 1,
        connections: ["Substrate PCB", "Transistor Gate Array", "TIM"],
        failureEffect: "Complete processing failure.",
        cascadeFailures: ["System halt", "Data corruption"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 2. Transistor Gate Array
    const transGroup = new THREE.Group();
    const transMat = tinted(chrome, 0x444455);
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.01, 4.3), transMat);
    baseMesh.position.set(0, 0.455, 0);
    transGroup.add(baseMesh);

    const lineMat = darkSteel;
    for (let i = -2; i <= 2; i += 0.2) {
        const vLine = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 4.3), lineMat);
        vLine.position.set(i, 0.46, 0);
        transGroup.add(vLine);
        const hLine = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.01, 0.01), lineMat);
        hLine.position.set(0, 0.46, i);
        transGroup.add(hLine);
    }

    parts.push({
        name: "Transistor Gate Array",
        description: "Microscopic grid of FinFET or GAAFET transistors forming logic gates.",
        group: transGroup,
        material: "Chrome",
        function: "Acts as digital switches to process binary data.",
        assemblyOrder: 2,
        connections: ["Silicon Die", "Cache Memory", "Microarchitecture Bus"],
        failureEffect: "Logic errors or bit flips.",
        cascadeFailures: ["Kernel panic", "Application crashes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. L1/L2 Cache Memory
    const cacheGroup = new THREE.Group();
    const cacheMat = tinted(copper, 0xbb8855);
    const coords = [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]];
    coords.forEach(([x, z]) => {
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.8), cacheMat);
        l1.position.set(x, 0.48, z);
        cacheGroup.add(l1);
        const l2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 1.2), tinted(copper, 0x886644));
        l2.position.set(x, 0.47, z);
        cacheGroup.add(l2);
    });

    parts.push({
        name: "L1/L2 Cache Memory",
        description: "Ultra-fast SRAM memory located directly on the die for quick data access.",
        group: cacheGroup,
        material: "Copper",
        function: "Stores frequently accessed instructions to prevent pipeline stalls.",
        assemblyOrder: 3,
        connections: ["Transistor Gate Array", "Microarchitecture Bus"],
        failureEffect: "Extreme performance slowdown due to cache misses.",
        cascadeFailures: ["Memory bus bottleneck", "CPU latency spikes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 4. Integrated Heat Spreader (IHS)
    const ihsGroup = new THREE.Group();
    const ihsMat = aluminum;
    const top = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.2, 7.8), ihsMat);
    top.position.set(0, 0.65, 0);
    ihsGroup.add(top);

    const wallThick = 0.6;
    const left = new THREE.Mesh(new THREE.BoxGeometry(wallThick, 0.3, 7.8), ihsMat);
    left.position.set(-3.6, 0.4, 0);
    ihsGroup.add(left);
    const right = new THREE.Mesh(new THREE.BoxGeometry(wallThick, 0.3, 7.8), ihsMat);
    right.position.set(3.6, 0.4, 0);
    ihsGroup.add(right);
    const front = new THREE.Mesh(new THREE.BoxGeometry(7.8 - wallThick*2, 0.3, wallThick), ihsMat);
    front.position.set(0, 0.4, 3.6);
    ihsGroup.add(front);
    const back = new THREE.Mesh(new THREE.BoxGeometry(7.8 - wallThick*2, 0.3, wallThick), ihsMat);
    back.position.set(0, 0.4, -3.6);
    ihsGroup.add(back);

    const fLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 8.5), ihsMat);
    fLeft.position.set(-3.9, 0.275, 0);
    ihsGroup.add(fLeft);
    const fRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 8.5), ihsMat);
    fRight.position.set(3.9, 0.275, 0);
    ihsGroup.add(fRight);

    parts.push({
        name: "Integrated Heat Spreader (IHS)",
        description: "A large metal lid covering the silicon die and components.",
        group: ihsGroup,
        material: "Aluminum",
        function: "Protects the fragile die and dissipates heat to the CPU cooler.",
        assemblyOrder: 10,
        connections: ["TIM", "Substrate PCB"],
        failureEffect: "Overheating due to poor contact.",
        cascadeFailures: ["Thermal throttling", "Die cracking"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    // 5. Substrate PCB
    const pcbGroup = new THREE.Group();
    const board = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 10), greenPCB);
    pcbGroup.add(board);
    
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 16), brass);
    dot.position.set(-4.5, 0.255, -4.5);
    pcbGroup.add(dot);

    const traceMat = tinted(greenPCB, 0x003300);
    for (let i=0; i<4; i++) {
        const trace = new THREE.Mesh(new THREE.BoxGeometry(2, 0.01, 0.1), traceMat);
        trace.position.set(2, 0.255, 3 + i*0.2);
        pcbGroup.add(trace);
        const trace2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, 2), traceMat);
        trace2.position.set(-3 - i*0.2, 0.255, -2);
        pcbGroup.add(trace2);
    }

    parts.push({
        name: "Substrate PCB",
        description: "A multi-layered fiberglass board that serves as the foundation.",
        group: pcbGroup,
        material: "Green Fiberglass",
        function: "Routes electrical signals from the microscopic die pads to the larger motherboard pins.",
        assemblyOrder: 4,
        connections: ["Silicon Die", "Capacitors", "Contact Pads / Pins"],
        failureEffect: "Broken traces or physical bending.",
        cascadeFailures: ["Signal loss", "Component isolation", "Motherboard short"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 6. Contact Pads / Pins
    const padGroup = new THREE.Group();
    const padMat = brass;
    const padGeom = new THREE.BoxGeometry(0.2, 0.01, 0.2);
    for (let x = -4.5; x <= 4.5; x += 0.4) {
        for (let z = -4.5; z <= 4.5; z += 0.4) {
            if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) continue;
            const pad = new THREE.Mesh(padGeom, padMat);
            pad.position.set(x, -0.255, z);
            padGroup.add(pad);
        }
    }

    parts.push({
        name: "Contact Pads / Pins",
        description: "A grid of flat gold pads or pins on the bottom of the PCB.",
        group: padGroup,
        material: "Gold / Brass",
        function: "Provides the electrical interface to the motherboard's CPU socket.",
        assemblyOrder: 5,
        connections: ["Substrate PCB", "Solder Balls (BGA) / LGA Array"],
        failureEffect: "Poor electrical contact.",
        cascadeFailures: ["Random reboots", "Loss of memory channels", "PCIe lane drops"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 7. Thermal Interface Material (TIM)
    const timGroup = new THREE.Group();
    const timMat = tinted(rubber, 0x999999);
    const timMesh = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.1, 4.4), timMat);
    timMesh.position.set(0, 0.5, 0);
    timGroup.add(timMesh);

    parts.push({
        name: "Thermal Interface Material (TIM)",
        description: "A layer of conductive thermal paste or liquid metal.",
        group: timGroup,
        material: "Thermal Paste",
        function: "Fills microscopic air gaps between the die and the IHS to maximize heat transfer.",
        assemblyOrder: 9,
        connections: ["Silicon Die", "Integrated Heat Spreader (IHS)"],
        failureEffect: "Drying out or pumping out over time.",
        cascadeFailures: ["Spike in core temperatures", "Unexpected shutdowns"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 }
    });

    // 8. Microarchitecture Bus
    const busGroup = new THREE.Group();
    const busMat = blueAccent;
    const trunk1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.02, 0.1), busMat);
    trunk1.position.set(0, 0.475, 0);
    busGroup.add(trunk1);
    const trunk2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 3.6), busMat);
    trunk2.position.set(0, 0.475, 0);
    busGroup.add(trunk2);

    const pulseGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const pulseMat = tinted(whitePlastic, 0x00ffff);
    const pulses = [];
    for (let i = 0; i < 12; i++) {
        const pulse = new THREE.Mesh(pulseGeom, pulseMat);
        busGroup.add(pulse);
        pulses.push({
            mesh: pulse,
            offset: i * (Math.PI / 6),
            axis: i % 2 === 0 ? 'x' : 'z',
            dir: i % 4 < 2 ? 1 : -1
        });
    }
    busGroup.userData.pulses = pulses;

    parts.push({
        name: "Microarchitecture Bus",
        description: "High-speed data highways connecting cores and caches.",
        group: busGroup,
        material: "Blue Accent / Cyan",
        function: "Transfers data and instructions across the silicon die at lightning speeds.",
        assemblyOrder: 8,
        connections: ["L1/L2 Cache Memory", "Transistor Gate Array"],
        failureEffect: "Data bottlenecks or desynchronization.",
        cascadeFailures: ["Deadlocks", "Pipeline stalls"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 9. Capacitors
    const capGroup = new THREE.Group();
    const capMat = tinted(ceramic, 0xddccaa);
    const termMat = chrome;
    const capGeom = new THREE.BoxGeometry(0.2, 0.15, 0.3);
    const termGeom = new THREE.BoxGeometry(0.22, 0.17, 0.05);

    for (let i = -4; i <= 4; i += 1.2) {
        if(Math.abs(i) < 0.5) continue; 
        const makeCap = (x, z, rotY) => {
            const cap = new THREE.Group();
            const body = new THREE.Mesh(capGeom, capMat);
            const t1 = new THREE.Mesh(termGeom, termMat);
            t1.position.z = 0.15;
            const t2 = new THREE.Mesh(termGeom, termMat);
            t2.position.z = -0.15;
            cap.add(body, t1, t2);
            cap.position.set(x, 0.325, z);
            cap.rotation.y = rotY;
            capGroup.add(cap);
        };
        makeCap(i, -4.5, 0); 
        makeCap(i, 4.5, 0);  
        makeCap(-4.5, i, Math.PI/2); 
        makeCap(4.5, i, Math.PI/2);  
    }

    parts.push({
        name: "Capacitors",
        description: "Tiny surface-mounted MLCCs arranged around the die.",
        group: capGroup,
        material: "Ceramic",
        function: "Filters and stabilizes the voltage supplied to the die.",
        assemblyOrder: 6,
        connections: ["Substrate PCB"],
        failureEffect: "Voltage ripple or instability.",
        cascadeFailures: ["Transient crashes under heavy load", "Overclocking failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 0 }
    });

    // 10. Solder Balls (BGA) / LGA Array
    const ballGroup = new THREE.Group();
    const ballMat = lead;
    const ballGeom = new THREE.SphereGeometry(0.12, 16, 16);
    for (let x = -4.5; x <= 4.5; x += 0.4) {
        for (let z = -4.5; z <= 4.5; z += 0.4) {
            if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) continue;
            const ball = new THREE.Mesh(ballGeom, ballMat);
            ball.position.set(x, -0.38, z);
            ballGroup.add(ball);
        }
    }

    parts.push({
        name: "Solder Balls (BGA) / LGA Array",
        description: "Tiny balls of solder or contact points interfacing with the socket.",
        group: ballGroup,
        material: "Lead / Solder",
        function: "Forms the final mechanical and electrical connection to the motherboard.",
        assemblyOrder: 7,
        connections: ["Contact Pads / Pins"],
        failureEffect: "Cracking due to thermal cycling.",
        cascadeFailures: ["Dead CPU", "Missing memory channels"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    parts.forEach(part => {
        mainGroup.add(part.group);
    });

    const quizQuestions = [
        {
            question: "What observation stated that the number of transistors on a microchip doubles approximately every two years?",
            options: ["Amdahl's Law", "Moore's Law", "Dennard Scaling", "Amperian Loop"],
            correctIndex: 1,
            explanation: "Gordon Moore formulated Moore's Law in 1965, observing the historical trend of transistor density doubling, which has guided the semiconductor industry for decades.",
            difficulty: "easy"
        },
        {
            question: "What happens to a microprocessor when its cooling system fails and temperatures reach critical limits?",
            options: ["Overclocking", "Thermal throttling", "Undervolting", "Hyper-threading"],
            correctIndex: 1,
            explanation: "Thermal throttling is a protective feature where the CPU intentionally slows its clock speed and reduces voltage to prevent physical damage from overheating.",
            difficulty: "medium"
        },
        {
            question: "Why do modern CPUs use a cache hierarchy (L1, L2, L3) instead of just relying on main system RAM?",
            options: [
                "To reduce the physical size of the motherboard",
                "Because RAM operates at higher voltages",
                "To bridge the speed gap between fast CPU cores and slower main memory",
                "To increase the CPU's base clock speed"
            ],
            correctIndex: 2,
            explanation: "CPU cores can process data much faster than RAM can provide it. Cache memory stores frequently used data very close to the cores to prevent pipeline stalls.",
            difficulty: "hard"
        },
        {
            question: "Which metric is combined with Clock Speed to determine the actual performance and instructions processed per second in a CPU?",
            options: [
                "IPC (Instructions Per Clock)",
                "TDP (Thermal Design Power)",
                "RPM (Revolutions Per Minute)",
                "MTBF (Mean Time Between Failures)"
            ],
            correctIndex: 0,
            explanation: "Overall CPU performance is roughly Clock Speed multiplied by IPC. A CPU with a lower clock speed but higher IPC can outperform one with a higher clock speed but lower IPC.",
            difficulty: "medium"
        },
        {
            question: "What modern manufacturing technology allows for the creation of incredibly small transistor features (e.g., 3nm nodes)?",
            options: [
                "Electron Beam Welding",
                "Extreme Ultraviolet (EUV) Photolithography",
                "Chemical Vapor Deposition",
                "Laser Ablation"
            ],
            correctIndex: 1,
            explanation: "EUV Photolithography uses extremely short wavelengths of light (13.5 nm) to etch impossibly small transistor patterns onto silicon wafers.",
            difficulty: "hard"
        },
        {
            question: "What is the primary purpose of the Integrated Heat Spreader (IHS) on a desktop microprocessor?",
            options: [
                "To process graphics data",
                "To protect the silicon die and distribute heat over a larger surface area",
                "To increase the electrical conductivity to the motherboard",
                "To store the L3 cache memory"
            ],
            correctIndex: 1,
            explanation: "The IHS acts as physical armor for the fragile silicon die and provides a large, flat surface to transfer heat efficiently to the CPU cooler.",
            difficulty: "easy"
        }
    ];

    return {
        group: mainGroup,
        parts: parts,
        description: "A high-performance CPU Microprocessor featuring silicon die, caching hierarchy, logic gates, and a thermal heat spreader.",
        quizQuestions: quizQuestions,
        animate: function(time, speed, partsList) {
            partsList.forEach(part => {
                if (part.name === 'Microarchitecture Bus' && part.group.userData.pulses) {
                    part.group.userData.pulses.forEach((p, idx) => {
                        const t = (time * speed * 3 + p.offset) % (Math.PI * 2);
                        const pos = Math.sin(t) * 1.6;
                        if (p.axis === 'x') {
                            p.mesh.position.set(pos * p.dir, 0.475, (idx % 2 === 0 ? 0.05 : -0.05));
                        } else {
                            p.mesh.position.set((idx % 2 === 0 ? 0.05 : -0.05), 0.475, pos * p.dir);
                        }
                        p.mesh.position.y = 0.475 + Math.abs(Math.cos(t * 4)) * 0.03;
                    });
                }
            });
        }
    };
}
