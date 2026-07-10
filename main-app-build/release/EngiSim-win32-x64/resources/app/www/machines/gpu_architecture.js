export function createGpuArchitecture(THREE) {
    const group = new THREE.Group();

    // Materials
    const materials = {
        scheduler: new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.4 }),
        dispatch: new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.4 }),
        registerFile: new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.3 }),
        cudaCores: new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.5, emissive: 0x000000 }),
        loadStore: new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.6 }),
        sfu: new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.5 }),
        l1Cache: new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.2 }),
        textureUnit: new THREE.MeshStandardMaterial({ color: 0x1abc9c, roughness: 0.4 }),
        tensorCores: new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5, emissive: 0x000000 }),
        interconnect: new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.7 })
    };

    const parts = [];

    // 1. Warp Scheduler
    const schedulerGeom = new THREE.BoxGeometry(4, 1.5, 2);
    const warpScheduler = new THREE.Mesh(schedulerGeom, materials.scheduler);
    warpScheduler.position.set(0, 8, -2);
    group.add(warpScheduler);
    parts.push({ name: 'Warp Scheduler', description: 'Selects which warps are ready to execute and schedules them on the execution units.' });

    // 2. Instruction Dispatch Unit
    const dispatchGeom = new THREE.BoxGeometry(4, 1.5, 2);
    const dispatchUnit = new THREE.Mesh(dispatchGeom, materials.dispatch);
    dispatchUnit.position.set(0, 6, -2);
    group.add(dispatchUnit);
    parts.push({ name: 'Instruction Dispatch Unit', description: 'Fetches instructions and dispatches them to the appropriate execution units (e.g., CUDA cores, SFUs).' });

    // 3. Register File
    const registerGeom = new THREE.BoxGeometry(8, 2, 2);
    const registerFile = new THREE.Mesh(registerGeom, materials.registerFile);
    registerFile.position.set(0, 3.5, -2);
    group.add(registerFile);
    parts.push({ name: 'Register File', description: 'Massive on-chip storage partitioned among active warps for fast access to operands.' });

    // 4. CUDA Cores (Array of cores)
    const cudaCoresGroup = new THREE.Group();
    const coreGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cudaCoreMeshes = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 8; j++) {
            const core = new THREE.Mesh(coreGeom, materials.cudaCores.clone());
            core.position.set(j * 1.2 - 4.2, i * 1.2 - 1.8, 0);
            cudaCoresGroup.add(core);
            cudaCoreMeshes.push(core);
        }
    }
    group.add(cudaCoresGroup);
    parts.push({ name: 'CUDA Cores', description: 'Execution units that perform integer and floating-point arithmetic operations in parallel.' });

    // 5. Load/Store Units
    const lsuGroup = new THREE.Group();
    const lsuGeom = new THREE.BoxGeometry(1.2, 0.8, 1);
    for (let i = 0; i < 4; i++) {
        const lsu = new THREE.Mesh(lsuGeom, materials.loadStore);
        lsu.position.set(i * 1.5 - 2.25, -3.5, 0);
        lsuGroup.add(lsu);
    }
    group.add(lsuGroup);
    parts.push({ name: 'Load/Store Units', description: 'Handles data transfer between the register file and memory hierarchy.' });

    // 6. Special Function Units
    const sfuGroup = new THREE.Group();
    const sfuGeom = new THREE.BoxGeometry(1.2, 0.8, 1);
    for (let i = 0; i < 4; i++) {
        const sfu = new THREE.Mesh(sfuGeom, materials.sfu);
        sfu.position.set(i * 1.5 - 2.25, -4.8, 0);
        sfuGroup.add(sfu);
    }
    group.add(sfuGroup);
    parts.push({ name: 'Special Function Units', description: 'Executes complex mathematical operations like sine, cosine, and square root.' });

    // 7. L1 Cache / Shared Memory
    const l1Geom = new THREE.BoxGeometry(10, 2, 2);
    const l1Cache = new THREE.Mesh(l1Geom, materials.l1Cache);
    l1Cache.position.set(0, -6.5, 0);
    group.add(l1Cache);
    parts.push({ name: 'L1 Cache / Shared Memory', description: 'Programmable on-chip memory for fast data sharing among threads within a block.' });

    // 8. Texture Unit
    const texGeom = new THREE.BoxGeometry(3, 2, 2);
    const textureUnit = new THREE.Mesh(texGeom, materials.textureUnit);
    textureUnit.position.set(-6, 0, 0);
    group.add(textureUnit);
    parts.push({ name: 'Texture Unit', description: 'Optimized for spatial locality caching and texture filtering operations.' });

    // 9. Tensor Cores
    const tensorGeom = new THREE.BoxGeometry(2, 4, 2);
    const tensorCoreMeshes = [];
    for (let i = 0; i < 2; i++) {
        const tc = new THREE.Mesh(tensorGeom, materials.tensorCores.clone());
        tc.position.set(6, i * 4.5 - 2, 0);
        group.add(tc);
        tensorCoreMeshes.push(tc);
    }
    parts.push({ name: 'Tensor Cores', description: 'Specialized units for mixed-precision matrix multiply-accumulate operations (deep learning).' });

    // 10. Interconnect Network
    const interGeom = new THREE.BoxGeometry(12, 0.5, 4);
    const interconnect = new THREE.Mesh(interGeom, materials.interconnect);
    interconnect.position.set(0, -8.5, 0);
    group.add(interconnect);
    parts.push({ name: 'Interconnect Network', description: 'Connects the multiprocessor to the L2 cache and global memory system.' });

    // Animation
    const animation = (time) => {
        const t = time * 0.002;
        
        // Warp scheduling pulses (dispatch unit flashing)
        materials.dispatch.emissive.setHex(Math.sin(t * 5) > 0.8 ? 0x2980b9 : 0x000000);

        // CUDA Cores parallel execution effect
        cudaCoreMeshes.forEach((core, index) => {
            const wave = Math.sin(t * 10 + index * 0.1);
            if (wave > 0.9) {
                core.material.emissive.setHex(0x2ecc71); // flash green
            } else {
                core.material.emissive.setHex(0x000000);
            }
        });

        // Tensor Cores deep learning calculation effect
        tensorCoreMeshes.forEach((tc, index) => {
            const pulse = Math.cos(t * 8 + index * Math.PI);
            if (pulse > 0.7) {
                tc.material.emissive.setHex(0xe74c3c); // flash red
            } else {
                tc.material.emissive.setHex(0x000000);
            }
        });
    };

    // Quiz Questions
    const questions = [
        {
            question: "What does SIMT stand for in GPU architecture?",
            options: [
                "Single Instruction, Multiple Threads",
                "Single Instruction, Multiple Tasks",
                "Synchronized Instruction, Multiple Threads",
                "Scalable Instruction, Multiple Threads"
            ],
            answer: 0
        },
        {
            question: "What is the primary function of a Warp Scheduler?",
            options: [
                "To write data to the L2 cache",
                "To group threads into blocks",
                "To select ready warps and issue them to execution units",
                "To calculate sine and cosine functions"
            ],
            answer: 2
        },
        {
            question: "Which component is heavily utilized for AI and deep learning workloads for matrix math?",
            options: [
                "Texture Unit",
                "Special Function Units",
                "Tensor Cores",
                "Load/Store Units"
            ],
            answer: 2
        },
        {
            question: "What type of memory is shared among all threads within a block for fast data exchange?",
            options: [
                "Global Memory",
                "Shared Memory",
                "Texture Memory",
                "Register File"
            ],
            answer: 1
        },
        {
            question: "Where are the operands for a thread's arithmetic instructions typically stored during execution?",
            options: [
                "L2 Cache",
                "Register File",
                "Constant Memory",
                "Instruction Cache"
            ],
            answer: 1
        },
        {
            question: "What operations do Special Function Units (SFUs) execute?",
            options: [
                "Basic integer addition",
                "Memory loads and stores",
                "Complex math operations like transcendentals (sin, cos)",
                "Matrix multiplication"
            ],
            answer: 2
        }
    ];

    return { group, parts, animation, questions };
}
