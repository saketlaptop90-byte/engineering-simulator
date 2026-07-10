import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const localMeshes = {};

    const description = "Algebraic Matrix Multiplication Visualizer: A volumetric holographic representation demonstrating the dot-product computations of two matrices yielding a result matrix.";

    // Custom glowing/neon materials for visual flair
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x008888, emissiveIntensity: 2, transparent: true, opacity: 0.9
    });
    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0x880088, emissiveIntensity: 2, transparent: true, opacity: 0.9
    });
    const neonYellow = new THREE.MeshStandardMaterial({
        color: 0xffff00, emissive: 0x888800, emissiveIntensity: 2, transparent: true, opacity: 0.9
    });
    const holographicFrame = new THREE.MeshStandardMaterial({
        color: 0x444444, emissive: 0x222222, wireframe: true, transparent: true, opacity: 0.5
    });

    // Base Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(8, 10, 1, 32);
    const pedestal = new THREE.Mesh(pedestalGeo, darkSteel);
    pedestal.position.set(0, -5, 0);
    group.add(pedestal);
    parts.push({
        name: "Hologram Pedestal",
        description: "The main projection pedestal powering the matrix simulation.",
        material: "Dark Steel",
        function: "Provides power and spatial anchoring for the volumetric displays.",
        assemblyOrder: 1,
        connections: ["Matrix A Grid", "Matrix B Grid", "Matrix C Grid"],
        failureEffect: "Complete loss of simulation integrity.",
        cascadeFailures: ["All Projections"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });
    localMeshes.pedestal = pedestal;

    const cellGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const frameGeo = new THREE.BoxGeometry(1, 1, 1);
    
    localMeshes.matrixACells = [];
    localMeshes.matrixBCells = [];
    localMeshes.matrixCCells = [];

    // Matrix A
    const aGrp = new THREE.Group();
    aGrp.position.set(-4, 2, -2);
    group.add(aGrp);
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const frame = new THREE.Mesh(frameGeo, holographicFrame);
            const cell = new THREE.Mesh(cellGeo, neonCyan);
            frame.position.set(c * 1.5 - 1.5, -(r * 1.5 - 1.5), 0);
            cell.position.copy(frame.position);
            aGrp.add(frame);
            aGrp.add(cell);
            localMeshes.matrixACells.push(cell);
        }
    }
    parts.push({
        name: "Matrix A Operand",
        description: "The left operand in the matrix multiplication operation.",
        material: "Neon Cyan Light",
        function: "Supplies row vectors for the dot product calculations.",
        assemblyOrder: 2,
        connections: ["Pedestal"],
        failureEffect: "Row data corruption.",
        cascadeFailures: ["Result Matrix C"],
        originalPosition: { x: -4, y: 2, z: -2 },
        explodedPosition: { x: -8, y: 4, z: -4 }
    });
    localMeshes.aGrp = aGrp;

    // Matrix B
    const bGrp = new THREE.Group();
    bGrp.position.set(4, 2, -2);
    group.add(bGrp);
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const frame = new THREE.Mesh(frameGeo, holographicFrame);
            const cell = new THREE.Mesh(cellGeo, neonMagenta);
            frame.position.set(c * 1.5 - 1.5, -(r * 1.5 - 1.5), 0);
            cell.position.copy(frame.position);
            bGrp.add(frame);
            bGrp.add(cell);
            localMeshes.matrixBCells.push(cell);
        }
    }
    parts.push({
        name: "Matrix B Operand",
        description: "The right operand in the matrix multiplication operation.",
        material: "Neon Magenta Light",
        function: "Supplies column vectors for the dot product calculations.",
        assemblyOrder: 3,
        connections: ["Pedestal"],
        failureEffect: "Column data corruption.",
        cascadeFailures: ["Result Matrix C"],
        originalPosition: { x: 4, y: 2, z: -2 },
        explodedPosition: { x: 8, y: 4, z: -4 }
    });
    localMeshes.bGrp = bGrp;

    // Matrix C
    const cGrp = new THREE.Group();
    cGrp.position.set(0, 0, 3);
    group.add(cGrp);
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const frame = new THREE.Mesh(frameGeo, holographicFrame);
            const cell = new THREE.Mesh(cellGeo, glass);
            frame.position.set(c * 1.5 - 1.5, -(r * 1.5 - 1.5), 0);
            cell.position.copy(frame.position);
            cGrp.add(frame);
            cGrp.add(cell);
            localMeshes.matrixCCells.push(cell);
        }
    }
    parts.push({
        name: "Matrix C Result",
        description: "The resulting matrix from A x B.",
        material: "Glass",
        function: "Stores and displays the accumulated dot product results.",
        assemblyOrder: 4,
        connections: ["Matrix A Grid", "Matrix B Grid"],
        failureEffect: "Incorrect final computation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 3 },
        explodedPosition: { x: 0, y: -2, z: 6 }
    });
    localMeshes.cGrp = cGrp;

    // Energy pulses
    const pulseGeo = new THREE.SphereGeometry(0.2, 16, 16);
    localMeshes.pulses = [];
    for (let i = 0; i < 6; i++) {
        const pulse = new THREE.Mesh(pulseGeo, neonYellow);
        pulse.visible = false;
        group.add(pulse);
        localMeshes.pulses.push({ mesh: pulse });
    }

    const quizQuestions = [
        {
            question: "To multiply Matrix A by Matrix B, what condition must be true regarding their dimensions?",
            options: [
                "Columns of A must equal rows of B.",
                "Rows of A must equal columns of B.",
                "Both matrices must be square.",
                "Columns of A must equal columns of B."
            ],
            correct: 0,
            explanation: "Matrix multiplication A x B is only defined if the inner dimensions match: the number of columns in A must equal the number of rows in B.",
            difficulty: "Beginner"
        },
        {
            question: "If Matrix A is 3x4 and Matrix B is 4x2, what are the dimensions of the result Matrix C?",
            options: [
                "3x4",
                "4x2",
                "3x2",
                "12x8"
            ],
            correct: 2,
            explanation: "The resulting matrix takes the outer dimensions of the operands: the rows of A (3) and columns of B (2), making it 3x2.",
            difficulty: "Intermediate"
        },
        {
            question: "Which operation is performed between the row elements of A and column elements of B to find a single element in C?",
            options: [
                "Cross Product",
                "Dot Product",
                "Scalar Multiplication",
                "Matrix Addition"
            ],
            correct: 1,
            explanation: "Each element C_ij is computed by taking the dot product of the i-th row of A and the j-th column of B.",
            difficulty: "Intermediate"
        }
    ];

    function animate(time, speed, meshesObj) {
        const t = time; 
        const effectiveTime = t * 1.5; 
        const cycle = Math.abs(effectiveTime % 9); 
        const step = Math.floor(cycle);
        const pStep = cycle - step;
        
        localMeshes.aGrp.position.y = 2 + Math.sin(t) * 0.2;
        localMeshes.bGrp.position.y = 2 + Math.cos(t * 1.1) * 0.2;
        localMeshes.cGrp.position.y = 0 + Math.sin(t * 0.9) * 0.2;
        
        const rowA = Math.floor(step / 3);
        const colB = step % 3;

        localMeshes.matrixACells.forEach((cell, i) => {
            const r = Math.floor(i / 3);
            cell.scale.setScalar(r === rowA ? 1.2 : 0.8);
            cell.material.emissiveIntensity = r === rowA ? 2 + Math.sin(t * 10) : 0.5;
        });

        localMeshes.matrixBCells.forEach((cell, i) => {
            const c = i % 3;
            cell.scale.setScalar(c === colB ? 1.2 : 0.8);
            cell.material.emissiveIntensity = c === colB ? 2 + Math.sin(t * 10) : 0.5;
        });

        localMeshes.matrixCCells.forEach((cell, i) => {
            if (i < step) {
                cell.material = neonYellow;
                cell.scale.setScalar(1);
            } else if (i === step) {
                cell.material = neonYellow;
                cell.scale.setScalar(1 + Math.abs(Math.sin(t * 5)) * 0.5);
            } else {
                cell.material = glass;
                cell.scale.setScalar(0.8);
            }
        });

        for (let i = 0; i < 3; i++) {
            const pulseA = localMeshes.pulses[i];
            const pulseB = localMeshes.pulses[i + 3];

            if (pStep < 0.8) {
                pulseA.mesh.visible = true;
                pulseB.mesh.visible = true;

                const sourceA = new THREE.Vector3();
                localMeshes.matrixACells[rowA * 3 + i].getWorldPosition(sourceA);
                
                const targetC = new THREE.Vector3();
                localMeshes.matrixCCells[step].getWorldPosition(targetC);
                
                pulseA.mesh.position.lerpVectors(sourceA, targetC, pStep / 0.8);

                const sourceB = new THREE.Vector3();
                localMeshes.matrixBCells[i * 3 + colB].getWorldPosition(sourceB);
                
                pulseB.mesh.position.lerpVectors(sourceB, targetC, pStep / 0.8);
            } else {
                pulseA.mesh.visible = false;
                pulseB.mesh.visible = false;
            }
        }
        
        localMeshes.pedestal.rotation.y = t * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMatrixMultiplication() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
