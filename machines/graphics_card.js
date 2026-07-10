import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createGraphicsCard(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. PCB (Printed Circuit Board)
    const pcbGroup = new THREE.Group();
    pcbGroup.name = "PCB";
    const pcbMesh = new THREE.Mesh(new THREE.BoxGeometry(24, 11, 0.2), greenPCB);
    pcbGroup.add(pcbMesh);
    parts.push({
        name: "PCB (Printed Circuit Board)",
        description: "The main rectangular fiberglass board that electrically connects all components of the graphics card.",
        material: "Fiberglass / Copper Traces",
        function: "Provides the physical structure and electrical pathways for data and power to travel between components.",
        assemblyOrder: 1,
        connections: ["GPU Silicon Die", "VRAM Chips", "VRM", "PCIe Connector", "I/O Ports"],
        failureEffect: "Complete failure of the graphics card. No display output or power.",
        cascadeFailures: ["GPU Die", "VRAM Chips"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 },
        group: pcbGroup
    });

    // 2. GPU Silicon Die
    const dieGroup = new THREE.Group();
    dieGroup.name = "GPU Silicon Die";
    const dieBase = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.1), greenPCB);
    dieBase.position.z = 0.15;
    const dieChip = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 0.05), tinted(glass, 0x111111));
    dieChip.position.z = 0.225;
    dieGroup.add(dieBase, dieChip);
    parts.push({
        name: "GPU Silicon Die",
        description: "The shiny central processing chip containing billions of transistors.",
        material: "Silicon",
        function: "Performs highly parallel mathematical calculations to render graphics and compute workloads.",
        assemblyOrder: 7,
        connections: ["PCB", "Heat Pipes"],
        failureEffect: "Artifacts on screen, driver crashes, or no display.",
        cascadeFailures: ["System Crash"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        group: dieGroup
    });

    // 3. VRAM Chips
    const vramGroup = new THREE.Group();
    vramGroup.name = "VRAM Chips";
    const vramPositions = [
        [-2.5, 2.5], [0, 2.5], [2.5, 2.5],  // Top row
        [2.5, 0], [2.5, -2.5],              // Right side
        [0, -2.5], [-2.5, -2.5],            // Bottom row
        [-2.5, 0]                           // Left side
    ];
    vramPositions.forEach(pos => {
        const vramMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.2), tinted(plastic, 0x1a1a1a));
        vramMesh.position.set(pos[0], pos[1], 0.2);
        vramGroup.add(vramMesh);
    });
    parts.push({
        name: "VRAM Chips",
        description: "High-speed GDDR memory modules surrounding the GPU die.",
        material: "Silicon / Plastic",
        function: "Stores textures, frame buffers, and assets for rapid access by the GPU die.",
        assemblyOrder: 6,
        connections: ["PCB", "GPU Silicon Die"],
        failureEffect: "Screen tearing, visual artifacts, or applications crashing due to memory errors.",
        cascadeFailures: ["GPU Rendering Pipeline"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        group: vramGroup
    });

    // 4. VRM / Power Delivery
    const vrmGroup = new THREE.Group();
    vrmGroup.name = "VRM / Power Delivery";
    for(let i = -4; i <= 4; i += 1.2) {
        // Capacitors
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 12), darkSteel);
        cap.rotation.x = Math.PI / 2;
        cap.position.set(8.5, i, 0.4);
        // Chokes
        const choke = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.6), tinted(steel, 0x333333));
        choke.position.set(7, i, 0.4);
        vrmGroup.add(cap, choke);
    }
    parts.push({
        name: "VRM / Power Delivery",
        description: "Voltage Regulator Modules including capacitors and chokes.",
        material: "Steel / Copper / Ceramic",
        function: "Cleans and steps down the power from the PSU to the precise voltages required by the GPU and VRAM.",
        assemblyOrder: 4,
        connections: ["PCB", "Power Connectors"],
        failureEffect: "Random shutdowns, system instability under load, or permanent board damage.",
        cascadeFailures: ["GPU Silicon Die", "VRAM Chips"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 15 },
        group: vrmGroup
    });

    // 5. PCIe Connector
    const pcieGroup = new THREE.Group();
    pcieGroup.name = "PCIe Connector";
    const pcieMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 0.8, 0.25), yellowAccent);
    pcieMesh.position.set(-1, -5.9, 0);
    pcieGroup.add(pcieMesh);
    parts.push({
        name: "PCIe Connector",
        description: "Gold contacts arrayed on the bottom edge of the PCB.",
        material: "Gold-plated Copper",
        function: "Provides the physical data interface and baseline power (up to 75W) from the motherboard.",
        assemblyOrder: 2,
        connections: ["PCB", "Motherboard"],
        failureEffect: "Card not detected by the motherboard, or reduced bandwidth performance.",
        cascadeFailures: ["System Boot Sequence"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        group: pcieGroup
    });

    // 6. Power Connectors
    const powerConnGroup = new THREE.Group();
    powerConnGroup.name = "Power Connectors";
    const connectorBase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1, 1), whitePlastic);
    connectorBase.position.set(9.5, 5.5, 0.5);
    powerConnGroup.add(connectorBase);
    parts.push({
        name: "Power Connectors",
        description: "Standardized 8-pin or 16-pin ports at the top edge of the board.",
        material: "Plastic / Copper Pins",
        function: "Receives supplementary high-wattage power directly from the power supply unit (PSU).",
        assemblyOrder: 5,
        connections: ["VRM", "PSU Cables"],
        failureEffect: "Card fails to boot, displays 'Please connect PCIe power cable' warning.",
        cascadeFailures: ["VRM", "GPU Boot Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 10, z: 0 },
        group: powerConnGroup
    });

    // 7. I/O Ports
    const ioGroup = new THREE.Group();
    ioGroup.name = "I/O Ports";
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.5, 13, 4), steel);
    bracket.position.set(-12.25, -1, 1);
    const hdmi = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.8), chrome);
    hdmi.position.set(-11.8, 2, 0.5);
    const dp1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.8), chrome);
    dp1.position.set(-11.8, 0, 0.5);
    const dp2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.8), chrome);
    dp2.position.set(-11.8, -2, 0.5);
    ioGroup.add(bracket, hdmi, dp1, dp2);
    parts.push({
        name: "I/O Ports",
        description: "Rear bracket containing HDMI and DisplayPort interfaces.",
        material: "Steel / Chrome",
        function: "Outputs the rendered visual signal to the user's monitors.",
        assemblyOrder: 3,
        connections: ["PCB", "Displays"],
        failureEffect: "No signal on monitors despite card functioning properly internally.",
        cascadeFailures: ["Display output failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 },
        group: ioGroup
    });

    // 8. Heat Pipes
    const heatPipesGroup = new THREE.Group();
    heatPipesGroup.name = "Heat Pipes";
    const pipeGeo = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
    for (let p = 0; p < 3; p++) {
        let py = (p - 1) * 1.5; // Positions: -1.5, 0, 1.5
        for (let i = -10; i <= 10; i += 1) { // 21 segments per pipe
            const segmentMat = copper.clone();
            const segment = new THREE.Mesh(pipeGeo, segmentMat);
            segment.rotation.z = Math.PI / 2;
            segment.position.set(i, py, 1.2);
            segment.userData.distFromDie = Math.abs(i);
            heatPipesGroup.add(segment);
        }
    }
    parts.push({
        name: "Heat Pipes",
        description: "Copper tubes containing a phase-change fluid running across the die.",
        material: "Copper",
        function: "Rapidly draws heat away from the GPU die and distributes it across the fin array.",
        assemblyOrder: 8,
        connections: ["GPU Silicon Die", "Aluminum Fin Array"],
        failureEffect: "Severe thermal throttling, drastically reduced performance, and emergency thermal shutdown.",
        cascadeFailures: ["GPU Die Overheat"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 20 },
        group: heatPipesGroup
    });

    // 9. Aluminum Fin Array
    const finArrayGroup = new THREE.Group();
    finArrayGroup.name = "Aluminum Fin Array";
    const finGeo = new THREE.BoxGeometry(0.1, 10.5, 2.5);
    for (let i = -11; i <= 11; i += 0.4) {
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(i, 0, 2.2);
        finArrayGroup.add(fin);
    }
    parts.push({
        name: "Aluminum Fin Array",
        description: "Massive stack of thin aluminum plates covering the board.",
        material: "Aluminum",
        function: "Provides an enormous surface area to dissipate heat into the air blown by the cooling fans.",
        assemblyOrder: 9,
        connections: ["Heat Pipes", "Cooling Fans"],
        failureEffect: "Poor heat dissipation leading to gradual thermal throttling.",
        cascadeFailures: ["Cooling Efficiency Drop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 30 },
        group: finArrayGroup
    });

    // 10. Cooling Fans
    const fansGroup = new THREE.Group();
    fansGroup.name = "Cooling Fans";
    
    // Fan Shroud
    const shroudGeo = new THREE.BoxGeometry(24, 11, 0.5);
    const shroud = new THREE.Mesh(shroudGeo, tinted(plastic, 0x111111));
    shroud.position.set(0, 0, 3.8);
    fansGroup.add(shroud);

    // Fan 1 & 2
    for(let f of [-5.5, 5.5]) {
        const fanCore = new THREE.Group();
        fanCore.name = 'FanCore';
        fanCore.position.set(f, 0, 4.0);

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 16), tinted(plastic, 0x222222));
        hub.rotation.x = Math.PI / 2;
        fanCore.add(hub);

        for (let i = 0; i < 9; i++) {
            const bladePivot = new THREE.Group();
            bladePivot.rotation.z = (i / 9) * Math.PI * 2;
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.5, 0.5), tinted(plastic, 0x050505));
            blade.position.y = 2.5; 
            blade.rotation.x = Math.PI / 6; // Angle for airflow
            bladePivot.add(blade);
            fanCore.add(bladePivot);
        }
        fansGroup.add(fanCore);
    }
    parts.push({
        name: "Cooling Fans",
        description: "High-RPM axial fans mounted in the plastic shroud.",
        material: "Plastic",
        function: "Forces cool air through the aluminum fin array to carry away dissipated heat.",
        assemblyOrder: 10,
        connections: ["Aluminum Fin Array", "PCB (Fan Header)"],
        failureEffect: "Rapid overheating under load. Fans may sound excessively loud before failing.",
        cascadeFailures: ["GPU Die", "VRAM Chips"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 45 },
        group: fansGroup
    });

    // Assemble everything
    parts.forEach(part => {
        group.add(part.group);
    });

    const quizQuestions = [
        {
            question: "What is the primary architectural difference between a GPU and a CPU?",
            options: [
                "GPUs handle sequential logic, while CPUs handle graphics.",
                "GPUs have thousands of small cores for parallel processing, while CPUs have fewer, faster cores for sequential tasks.",
                "GPUs only process 2D data, while CPUs process 3D and 4D data.",
                "There is no functional difference; they are entirely interchangeable."
            ],
            correctOptionIndex: 1,
            explanation: "GPUs feature highly parallel architectures with thousands of smaller cores, making them perfect for multitasking calculations like rendering pixels simultaneously.",
            difficulty: "easy"
        },
        {
            question: "What is the specific purpose of the VRAM in a graphics card?",
            options: [
                "To store the operating system kernel.",
                "To permanently save game files.",
                "To store textures, frame buffers, and assets for rapid access by the GPU die.",
                "To increase the speed of internet downloads."
            ],
            correctOptionIndex: 2,
            explanation: "VRAM (Video RAM) is high-speed memory placed exceptionally close to the GPU die, used to hold the textures, models, and frame buffers required for current rendering tasks.",
            difficulty: "medium"
        },
        {
            question: "What occurs during 'thermal throttling'?",
            options: [
                "The fans stop spinning to conserve power.",
                "The GPU automatically reduces its clock speed and voltage to prevent overheating.",
                "The VRM increases voltage to push past thermal limits.",
                "The GPU freezes the display to let the monitor cool down."
            ],
            correctOptionIndex: 1,
            explanation: "Thermal throttling is a protective measure where the GPU actively lowers its performance (clock speeds) to generate less heat when the cooling system is overwhelmed.",
            difficulty: "medium"
        },
        {
            question: "What dictates the maximum data transfer rate between the GPU and the motherboard?",
            options: [
                "The Cooling Fans RPM.",
                "The DisplayPort version.",
                "The PCIe (Peripheral Component Interconnect Express) bandwidth generation and lane count.",
                "The VRM choke capacity."
            ],
            correctOptionIndex: 2,
            explanation: "PCIe bandwidth (like PCIe Gen 4.0 x16) dictates how fast data can travel back and forth between the CPU/RAM and the GPU.",
            difficulty: "easy"
        },
        {
            question: "What is the role of the VRM (Voltage Regulator Module) on the GPU board?",
            options: [
                "To convert digital signals into analog signals.",
                "To step down and clean power from the PSU to the precise, safe voltages required by the delicate GPU die.",
                "To control the speed of the cooling fans via software.",
                "To encrypt display output over HDMI."
            ],
            correctOptionIndex: 1,
            explanation: "Power supplies deliver 12V power, but the GPU die operates at a highly sensitive voltage often near 1V. The VRM steps this down and filters it to ensure perfectly stable power delivery.",
            difficulty: "hard"
        },
        {
            question: "How do 'Heat Pipes' facilitate cooling in a modern GPU?",
            options: [
                "By blowing cold air directly onto the silicon.",
                "By using a phase-change fluid that evaporates at the hot die and condenses at the cool fins to transfer heat efficiently.",
                "By generating a magnetic field that repels heat energy.",
                "By acting as a water reservoir that is manually refilled."
            ],
            correctOptionIndex: 1,
            explanation: "Heat pipes contain a tiny amount of working fluid under a vacuum. It absorbs heat from the die, evaporates, travels to the colder fin section, condenses, and returns, transferring heat exceptionally well.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        meshes.forEach(meshObj => {
            if (meshObj.group.name === 'Cooling Fans') {
                meshObj.group.children.forEach(child => {
                    if (child.name === 'FanCore') {
                        // Spin fans rapidly
                        child.rotation.z -= 15 * speed;
                    }
                });
            }
            if (meshObj.group.name === 'Heat Pipes') {
                meshObj.group.children.forEach(segment => {
                    if (segment.userData.distFromDie !== undefined) {
                        const distOffset = segment.userData.distFromDie * 0.2;
                        // Calculate heat intensity changing over time and distance
                        // Will oscillate between 0 (cool/blue) and 1 (hot/red)
                        const heat = (Math.sin(time * 3 * speed - distOffset) + 1) / 2;
                        
                        // Shift from red (near die) to blue (near fins) dynamically
                        segment.material.color.setRGB(heat, 0.1 * heat, 1 - heat);
                        segment.material.emissive.setRGB(heat * 0.8, 0, (1 - heat) * 0.8);
                    }
                });
            }
        });
    }

    return {
        group,
        parts,
        description: "A high-performance Graphics Processing Unit (GPU) featuring a complex printed circuit board, VRAM, robust power delivery, and an advanced heatsink/fan cooling solution.",
        quizQuestions,
        animate
    };
}
