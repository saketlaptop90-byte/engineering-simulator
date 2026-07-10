export function createOooExecution(THREE) {
    const group = new THREE.Group();

    // Materials
    const fetchMat = new THREE.MeshStandardMaterial({ color: 0x4287f5 });
    const queueMat = new THREE.MeshStandardMaterial({ color: 0x42f5a4 });
    const ratMat = new THREE.MeshStandardMaterial({ color: 0xf5b042 });
    const robMat = new THREE.MeshStandardMaterial({ color: 0xf54242 });
    const rsMat = new THREE.MeshStandardMaterial({ color: 0xf542a1 });
    const execMat = new THREE.MeshStandardMaterial({ color: 0xb942f5 });
    const lsqMat = new THREE.MeshStandardMaterial({ color: 0x42e0f5 });
    const prfMat = new THREE.MeshStandardMaterial({ color: 0xa4f542 });
    const cdbMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x999999 });

    // 1. Fetch & Decode Unit
    const fetchGeom = new THREE.BoxGeometry(2, 2, 2);
    const fetchMesh = new THREE.Mesh(fetchGeom, fetchMat);
    fetchMesh.position.set(-6, 4, 0);
    group.add(fetchMesh);

    // 2. Instruction Queue
    const queueGeom = new THREE.BoxGeometry(1.5, 3, 1.5);
    const queueMesh = new THREE.Mesh(queueGeom, queueMat);
    queueMesh.position.set(-3, 4, 0);
    group.add(queueMesh);

    // 3. Register Alias Table
    const ratGeom = new THREE.BoxGeometry(2, 1.5, 1.5);
    const ratMesh = new THREE.Mesh(ratGeom, ratMat);
    ratMesh.position.set(0, 4, 0);
    group.add(ratMesh);

    // 4. Reorder Buffer
    const robGeom = new THREE.BoxGeometry(3, 1, 3);
    const robMesh = new THREE.Mesh(robGeom, robMat);
    robMesh.position.set(4, 4, 0);
    group.add(robMesh);

    // 5. Reservation Stations
    const rsGeom = new THREE.BoxGeometry(2, 2.5, 2);
    const rsMesh = new THREE.Mesh(rsGeom, rsMat);
    rsMesh.position.set(-3, 0, 0);
    group.add(rsMesh);

    // 6. Execution Units
    const execGeom = new THREE.BoxGeometry(4, 2, 2);
    const execMesh = new THREE.Mesh(execGeom, execMat);
    execMesh.position.set(2, 0, 0);
    group.add(execMesh);

    // 7. Load/Store Queue
    const lsqGeom = new THREE.BoxGeometry(2, 2, 2);
    const lsqMesh = new THREE.Mesh(lsqGeom, lsqMat);
    lsqMesh.position.set(-3, -3, 0);
    group.add(lsqMesh);

    // 8. Physical Register File
    const prfGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const prfMesh = new THREE.Mesh(prfGeom, prfMat);
    prfMesh.position.set(2, -3, 0);
    group.add(prfMesh);

    // 9. Common Data Bus
    const cdbGeom = new THREE.CylinderGeometry(0.2, 0.2, 12, 16);
    const cdbMesh = new THREE.Mesh(cdbGeom, cdbMat);
    cdbMesh.rotation.z = Math.PI / 2;
    cdbMesh.position.set(0, 1.5, 0);
    group.add(cdbMesh);

    // 10. Branch Predictor
    const branchGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const branchMesh = new THREE.Mesh(branchGeom, branchMat);
    branchMesh.position.set(-6, 1, 0);
    group.add(branchMesh);

    // Particles representing instructions
    const instGroup = new THREE.Group();
    group.add(instGroup);
    
    const numInst = 15;
    const instMeshes = [];
    for(let i=0; i<numInst; i++) {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.MeshBasicMaterial({color: 0xffffff})
        );
        instGroup.add(mesh);
        instMeshes.push({
            mesh,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
            stage: Math.floor(Math.random() * 4) // 0: fetch, 1: RS, 2: Exec, 3: Retire
        });
    }

    const parts = [
        { name: 'Fetch & Decode Unit', description: 'Fetches instructions from memory and decodes them into micro-operations.' },
        { name: 'Instruction Queue', description: 'Buffers decoded instructions before they are issued.' },
        { name: 'Register Alias Table', description: 'Maps architectural registers to physical registers to resolve false dependencies.' },
        { name: 'Reorder Buffer', description: 'Tracks the original order of instructions to ensure they retire in order.' },
        { name: 'Reservation Stations', description: 'Holds instructions waiting for their operands to become available.' },
        { name: 'Execution Units', description: 'Performs arithmetic, logic, and memory operations out-of-order.' },
        { name: 'Load/Store Queue', description: 'Buffers and reorders memory access operations.' },
        { name: 'Physical Register File', description: 'Stores the actual values of both architectural and renamed registers.' },
        { name: 'Common Data Bus', description: 'Broadcasts results from execution units back to reservation stations and the ROB.' },
        { name: 'Branch Predictor', description: 'Guesses the outcome of branches to keep the pipeline full.' }
    ];

    const animation = (time) => {
        // Rotate CDB
        cdbMesh.rotation.x = time;
        
        // Pulse Branch Predictor
        branchMesh.scale.setScalar(1 + Math.sin(time * 3) * 0.1);

        // Animate instructions moving through stages
        instMeshes.forEach((inst, index) => {
            const t = time * inst.speed + inst.phase;
            if (inst.stage === 0) {
                // Fetch -> Queue
                inst.mesh.position.set(-6 + Math.sin(t)*1.5, 4, Math.cos(t));
                if(Math.sin(t) > 0.9) inst.stage = 1;
            } else if (inst.stage === 1) {
                // Queue -> RS
                inst.mesh.position.set(-3 + Math.cos(t)*1.5, 2 + Math.sin(t)*2, 0);
                if(Math.sin(t) < -0.9) inst.stage = 2;
            } else if (inst.stage === 2) {
                // RS -> Exec
                inst.mesh.position.set(-0.5 + Math.sin(t)*2.5, 0, Math.cos(t)*0.5);
                if(Math.sin(t) > 0.9) inst.stage = 3;
            } else {
                // Exec -> ROB (Retire)
                inst.mesh.position.set(3 + Math.cos(t), 2 + Math.sin(t)*2, 0);
                if(Math.sin(t) > 0.9) inst.stage = 0;
            }
            
            // Color changing based on stage
            const colors = [0x4287f5, 0xf542a1, 0xb942f5, 0xf54242];
            inst.mesh.material.color.setHex(colors[inst.stage]);
        });
    };

    const questions = [
        {
            question: 'What is the primary purpose of the Register Alias Table (RAT)?',
            options: ['To store instruction operands', 'To map architectural registers to physical registers', 'To predict branch outcomes', 'To buffer memory stores'],
            answer: 1
        },
        {
            question: 'Which component ensures that instructions, despite executing out-of-order, retire in their original program order?',
            options: ['Reservation Stations', 'Execution Units', 'Reorder Buffer (ROB)', 'Common Data Bus'],
            answer: 2
        },
        {
            question: 'What do Reservation Stations hold?',
            options: ['Instructions waiting for operands', 'Completed instructions waiting to retire', 'Predicted branch paths', 'Data to be written to memory'],
            answer: 0
        },
        {
            question: 'What is the function of the Common Data Bus (CDB)?',
            options: ['To fetch instructions from memory', 'To broadcast execution results to dependent instructions', 'To store architectural state', 'To connect the CPU to RAM'],
            answer: 1
        },
        {
            question: 'Why is Branch Prediction critical in an out-of-order processor?',
            options: ['It reduces the clock cycle time', 'It prevents true data dependencies', 'It keeps the pipeline full by guessing instruction paths', 'It eliminates the need for a Reorder Buffer'],
            answer: 2
        },
        {
            question: 'Which type of dependencies does Register Renaming (via RAT) eliminate?',
            options: ['True dependencies (Read-After-Write)', 'Control dependencies', 'False dependencies (Write-After-Write, Write-After-Read)', 'Memory dependencies'],
            answer: 2
        }
    ];

    return { group, parts, animation, questions };
}
