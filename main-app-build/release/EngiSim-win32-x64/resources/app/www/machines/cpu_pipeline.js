export function createCpuPipeline(THREE) {
    const group = new THREE.Group();

    // Material definitions
    const materials = {
        fetch: new THREE.MeshStandardMaterial({ color: 0x4287f5 }),
        decode: new THREE.MeshStandardMaterial({ color: 0x42f593 }),
        execute: new THREE.MeshStandardMaterial({ color: 0xf5b042 }),
        memory: new THREE.MeshStandardMaterial({ color: 0xd442f5 }),
        writeBack: new THREE.MeshStandardMaterial({ color: 0xf54242 }),
        pc: new THREE.MeshStandardMaterial({ color: 0x888888 }),
        ir: new THREE.MeshStandardMaterial({ color: 0xaaaaaa }),
        regFile: new THREE.MeshStandardMaterial({ color: 0xffff42 }),
        control: new THREE.MeshStandardMaterial({ color: 0xffffff }),
        forwarding: new THREE.MeshStandardMaterial({ color: 0xffaa00 })
    };

    // 1. Instruction Fetch Unit
    const fetchGeo = new THREE.BoxGeometry(2, 2, 2);
    const fetchMesh = new THREE.Mesh(fetchGeo, materials.fetch);
    fetchMesh.position.set(-6, 0, 0);
    group.add(fetchMesh);

    // 2. Instruction Decode Unit
    const decodeGeo = new THREE.BoxGeometry(2, 2, 2);
    const decodeMesh = new THREE.Mesh(decodeGeo, materials.decode);
    decodeMesh.position.set(-3, 0, 0);
    group.add(decodeMesh);

    // 3. Execution Unit
    const executeGeo = new THREE.BoxGeometry(2, 2, 2);
    const executeMesh = new THREE.Mesh(executeGeo, materials.execute);
    executeMesh.position.set(0, 0, 0);
    group.add(executeMesh);

    // 4. Memory Access Unit
    const memoryGeo = new THREE.BoxGeometry(2, 2, 2);
    const memoryMesh = new THREE.Mesh(memoryGeo, materials.memory);
    memoryMesh.position.set(3, 0, 0);
    group.add(memoryMesh);

    // 5. Write Back Unit
    const wbGeo = new THREE.BoxGeometry(2, 2, 2);
    const wbMesh = new THREE.Mesh(wbGeo, materials.writeBack);
    wbMesh.position.set(6, 0, 0);
    group.add(wbMesh);

    // 6. Program Counter
    const pcGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const pcMesh = new THREE.Mesh(pcGeo, materials.pc);
    pcMesh.position.set(-8, 1, 0);
    pcMesh.rotation.z = Math.PI / 2;
    group.add(pcMesh);

    // 7. Instruction Register
    const irGeo = new THREE.BoxGeometry(1.5, 0.5, 1);
    const irMesh = new THREE.Mesh(irGeo, materials.ir);
    irMesh.position.set(-4.5, -1.5, 0);
    group.add(irMesh);

    // 8. Register File
    const regGeo = new THREE.BoxGeometry(2, 1.5, 2);
    const regMesh = new THREE.Mesh(regGeo, materials.regFile);
    regMesh.position.set(-1.5, 2, 0);
    group.add(regMesh);

    // 9. Control Unit
    const controlGeo = new THREE.SphereGeometry(1, 32, 32);
    const controlMesh = new THREE.Mesh(controlGeo, materials.control);
    controlMesh.position.set(-1.5, -2, 0);
    group.add(controlMesh);

    // 10. Forwarding Unit
    const forwardGeo = new THREE.BoxGeometry(4, 0.5, 1);
    const forwardMesh = new THREE.Mesh(forwardGeo, materials.forwarding);
    forwardMesh.position.set(1.5, 2, 0);
    group.add(forwardMesh);

    // Instructions flowing (animation particles)
    const instructions = [];
    const instGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const instMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    for (let i = 0; i < 5; i++) {
        const inst = new THREE.Mesh(instGeo, instMat);
        inst.position.set(-8 + i * 3, 0, 1.5);
        group.add(inst);
        instructions.push(inst);
    }

    const parts = [
        { name: 'Instruction Fetch Unit', description: 'Retrieves instructions from memory using the Program Counter.' },
        { name: 'Instruction Decode Unit', description: 'Translates the fetched instruction into control signals and reads registers.' },
        { name: 'Execution Unit', description: 'Performs ALU operations like arithmetic and logic computation.' },
        { name: 'Memory Access Unit', description: 'Reads from or writes to the data memory if the instruction requires it.' },
        { name: 'Write Back Unit', description: 'Writes the result of the execution or memory access back to the register file.' },
        { name: 'Program Counter', description: 'Holds the memory address of the next instruction to be fetched.' },
        { name: 'Instruction Register', description: 'Temporarily holds the currently fetched instruction.' },
        { name: 'Register File', description: 'Array of processor registers for reading operands and writing results.' },
        { name: 'Control Unit', description: 'Directs the operation of the processor by decoding instructions and generating signals.' },
        { name: 'Forwarding Unit', description: 'Resolves data hazards by bypassing the register file and directly feeding ALU outputs.' }
    ];

    const animation = (time) => {
        // Move instructions through the pipeline stages
        instructions.forEach((inst, index) => {
            // Calculate progress based on time and index offset
            const progress = ((time * 0.001) + index * 0.2) % 1;
            // Map progress 0-1 to X position -8 to 8
            inst.position.x = -8 + (progress * 16);
            
            // Pulse effect to simulate processing
            const scale = 1 + Math.sin(time * 0.01 + index) * 0.2;
            inst.scale.set(scale, scale, scale);
        });
        
        // Blink Control Unit
        controlMesh.material.emissive.setHex(Math.sin(time * 0.005) > 0 ? 0x444444 : 0x000000);
    };

    const questions = [
        {
            question: 'Which pipeline stage is responsible for performing arithmetic operations?',
            options: ['Instruction Fetch', 'Instruction Decode', 'Execution', 'Write Back'],
            answer: 2
        },
        {
            question: 'What is the primary purpose of the Forwarding Unit?',
            options: ['To fetch instructions faster', 'To resolve data hazards', 'To control memory access', 'To store the program counter'],
            answer: 1
        },
        {
            question: 'Which component holds the address of the next instruction?',
            options: ['Instruction Register', 'Control Unit', 'Program Counter', 'Register File'],
            answer: 2
        },
        {
            question: 'In a classic 5-stage RISC pipeline, what comes after the Execution stage?',
            options: ['Memory Access', 'Write Back', 'Instruction Decode', 'Instruction Fetch'],
            answer: 0
        },
        {
            question: 'What happens in the Write Back stage?',
            options: ['Data is written to main memory', 'Results are written into the Register File', 'Instructions are saved to disk', 'The PC is updated'],
            answer: 1
        },
        {
            question: 'Why are CPU pipelines used?',
            options: ['To decrease the clock speed', 'To execute a single instruction faster', 'To increase instruction throughput', 'To eliminate the need for caches'],
            answer: 2
        }
    ];

    return { group, parts, animation, questions };
}
