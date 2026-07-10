export function createIoDmaController(THREE) {
    const group = new THREE.Group();

    // Create materials
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0x2266cc });
    const memMat = new THREE.MeshStandardMaterial({ color: 0x22cc66 });
    const dmaMat = new THREE.MeshStandardMaterial({ color: 0xcc22cc });
    const ioMat = new THREE.MeshStandardMaterial({ color: 0xcc6622 });
    const busMat = new THREE.MeshStandardMaterial({ color: 0x555555, transparent: true, opacity: 0.6 });
    
    const dreqMat = new THREE.MeshStandardMaterial({ color: 0x551111 });
    const dackMat = new THREE.MeshStandardMaterial({ color: 0x115511 });
    const arbMat = new THREE.MeshStandardMaterial({ color: 0x555511 });
    const intMat = new THREE.MeshStandardMaterial({ color: 0x551111 });
    const packetMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa });

    // 1. CPU Core
    const cpu = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), cpuMat);
    cpu.position.set(-4, 3, 0);

    // 2. Main Memory
    const memory = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), memMat);
    memory.position.set(0, 3, 0);

    // 3. DMA Controller
    const dmaController = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), dmaMat);
    dmaController.position.set(-4, -3, 0);

    // 4. I/O Device
    const ioDevice = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), ioMat);
    ioDevice.position.set(4, -3, 0);

    // 5. System Bus
    const systemBus = new THREE.Mesh(new THREE.BoxGeometry(11, 0.4, 2), busMat);
    systemBus.position.set(0, 0, 0);

    // 6. DMA Request Line (DREQ)
    const dreqLine = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 0.1), dreqMat);
    dreqLine.position.set(0, -3.2, 0);

    // 7. DMA Acknowledge Line (DACK)
    const dackLine = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 0.1), dackMat);
    dackLine.position.set(0, -2.8, 0);

    // 8. Arbitration Line (HOLD / HLDA)
    const arbitrationLine = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4, 0.1), arbMat);
    arbitrationLine.position.set(-4.5, 0, 0);

    // 9. Interrupt Line
    const interruptLine = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4, 0.1), intMat);
    interruptLine.position.set(-3.5, 0, 0);

    // 10. Data Packet
    const dataPacket = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), packetMat);
    dataPacket.position.set(4, -3, 0);
    dataPacket.visible = false;

    group.add(cpu);
    group.add(memory);
    group.add(dmaController);
    group.add(ioDevice);
    group.add(systemBus);
    group.add(dreqLine);
    group.add(dackLine);
    group.add(arbitrationLine);
    group.add(interruptLine);
    group.add(dataPacket);

    let time = 0;

    const setColor = (mesh, color, emissive = 0x000000) => {
        mesh.material.color.setHex(color);
        mesh.material.emissive.setHex(emissive);
    };

    const update = (delta) => {
        time = (time + delta) % 14;
        
        setColor(dreqLine, 0x551111);
        setColor(dackLine, 0x115511);
        setColor(arbitrationLine, 0x555511);
        setColor(interruptLine, 0x551111);
        setColor(cpu, 0x2266cc);
        setColor(systemBus, 0x555555);
        setColor(memory, 0x22cc66);
        dataPacket.visible = false;

        // I/O raises DMA Request
        if (time >= 1 && time < 10) {
            setColor(dreqLine, 0xff3333, 0x880000);
        }

        // DMA requests bus from CPU (HOLD)
        if (time >= 2 && time < 3) {
            setColor(arbitrationLine, 0xffaa00, 0x885500);
        } 
        // CPU grants bus to DMA (HLDA), CPU sleeps, Bus active
        else if (time >= 3 && time < 10) {
            setColor(arbitrationLine, 0x00ffaa, 0x008855);
            setColor(cpu, 0x112244);
            setColor(systemBus, 0x6688ff, 0x223388);
        }

        // DMA acknowledges I/O request (DACK)
        if (time >= 4 && time < 10) {
            setColor(dackLine, 0x33ff33, 0x008800);
        }

        // Data transfer: I/O to Bus
        if (time >= 5 && time < 6) {
            dataPacket.visible = true;
            let t = time - 5;
            dataPacket.position.set(4, -3 + 3 * t, 0);
        } 
        // Data transfer: Along Bus to Memory
        else if (time >= 6 && time < 8) {
            dataPacket.visible = true;
            let t = (time - 6) / 2;
            dataPacket.position.set(4 - 4 * t, 0, 0);
        } 
        // Data transfer: Bus into Memory
        else if (time >= 8 && time < 9) {
            dataPacket.visible = true;
            let t = time - 8;
            dataPacket.position.set(0, 3 * t, 0);
        } 
        // Data processing in Memory
        else if (time >= 9 && time < 10) {
            setColor(memory, 0xaaffaa, 0x448844);
        }

        // DMA sends Interrupt to CPU to indicate completion
        if (time >= 11 && time < 13) {
            if (Math.floor(time * 8) % 2 === 0) {
                setColor(interruptLine, 0xff0000, 0x880000);
                setColor(cpu, 0xffaaaa, 0x880000);
            }
        }
    };

    const quizzes = [
        {
            question: "What is the primary purpose of a DMA controller?",
            options: [
                "To perform mathematical calculations.",
                "To control the power supply of the CPU.",
                "To transfer data directly between I/O devices and memory without CPU intervention.",
                "To manage the display output."
            ],
            answer: 2
        },
        {
            question: "During a DMA transfer, what does the 'HOLD' signal signify?",
            options: [
                "The CPU is pausing the DMA transfer.",
                "The DMA controller is requesting the CPU to release control of the system bus.",
                "The memory is full and cannot accept more data.",
                "The I/O device is disconnected."
            ],
            answer: 1
        },
        {
            question: "After the DMA controller finishes a data block transfer, how does it typically notify the CPU?",
            options: [
                "By shutting down the system.",
                "By sending an interrupt signal to the CPU.",
                "By executing a special CPU instruction.",
                "By writing a zero to the DMA address register."
            ],
            answer: 1
        },
        {
            question: "What is the 'HLDA' (Hold Acknowledge) signal used for?",
            options: [
                "The CPU signaling the DMA controller that it has relinquished the system bus.",
                "The I/O device acknowledging receipt of data.",
                "The memory confirming data has been written.",
                "The DMA controller acknowledging an interrupt."
            ],
            answer: 0
        },
        {
            question: "Which mode of DMA transfer releases the bus back to the CPU after every byte or word transferred?",
            options: [
                "Burst mode.",
                "Block transfer mode.",
                "Cycle stealing mode.",
                "Transparent mode."
            ],
            answer: 2
        },
        {
            question: "In the context of DMA and I/O processing, what is a 'Fly-by' (or single-cycle) transfer?",
            options: [
                "Data is transferred first from I/O to the DMA controller, then to memory.",
                "Data is moved directly from the I/O device to memory in a single bus cycle.",
                "The CPU reads from I/O and immediately writes to memory.",
                "Data is broadcasted to all peripherals simultaneously."
            ],
            answer: 1
        }
    ];

    return { group, update, quizzes };
}
