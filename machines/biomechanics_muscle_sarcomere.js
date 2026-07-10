import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const actinGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        metalness: 0.2,
        roughness: 0.1
    });

    const myosinGlow = new THREE.MeshPhysicalMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9,
        metalness: 0.5,
        roughness: 0.3
    });

    const zDiscGlow = new THREE.MeshPhysicalMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const crossbridgeGlow = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.0,
        metalness: 0.3,
        roughness: 0.2
    });

    const titinGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.4,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    // 1. Z-Discs (Boundary of the sarcomere)
    const zDiscGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const zDiscLeftMesh = new THREE.Mesh(zDiscGeometry, zDiscGlow);
    zDiscLeftMesh.rotation.z = Math.PI / 2;
    zDiscLeftMesh.position.set(-6, 0, 0);
    group.add(zDiscLeftMesh);
    meshes.zDiscLeft = zDiscLeftMesh;

    parts.push({
        name: "Left Z-Disc",
        description: "The boundary of the sarcomere where actin filaments attach.",
        material: "Z-Disc Glow",
        function: "Anchors actin filaments and transmits force to neighboring sarcomeres.",
        assemblyOrder: 1,
        connections: ["Actin Filaments", "Titin"],
        failureEffect: "Sarcomere rupture and complete loss of force transmission.",
        cascadeFailures: ["Complete muscle tear"],
        originalPosition: { x: -6, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: 0 }
    });

    const zDiscRightMesh = new THREE.Mesh(zDiscGeometry, zDiscGlow);
    zDiscRightMesh.rotation.z = Math.PI / 2;
    zDiscRightMesh.position.set(6, 0, 0);
    group.add(zDiscRightMesh);
    meshes.zDiscRight = zDiscRightMesh;

    parts.push({
        name: "Right Z-Disc",
        description: "The opposite boundary of the sarcomere.",
        material: "Z-Disc Glow",
        function: "Anchors actin filaments on the right side.",
        assemblyOrder: 2,
        connections: ["Actin Filaments", "Titin"],
        failureEffect: "Sarcomere rupture and complete loss of force transmission.",
        cascadeFailures: ["Complete muscle tear"],
        originalPosition: { x: 6, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 }
    });

    // 2. Myosin (Thick Filaments) - Center
    meshes.myosins = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const myosinGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
            const myosinMesh = new THREE.Mesh(myosinGeo, myosinGlow);
            myosinMesh.rotation.z = Math.PI / 2;
            myosinMesh.position.set(0, i * 1.2, j * 1.2);
            group.add(myosinMesh);
            meshes.myosins.push(myosinMesh);

            parts.push({
                name: `Myosin Thick Filament (${i},${j})`,
                description: "Thick contractile filament containing myosin heads.",
                material: "Myosin Glow",
                function: "Generates force by binding to actin and performing the power stroke.",
                assemblyOrder: 3,
                connections: ["M-Line", "Crossbridges", "Titin"],
                failureEffect: "Loss of contractile force generation.",
                cascadeFailures: ["Muscle weakness (Paresis)"],
                originalPosition: { x: 0, y: i * 1.2, z: j * 1.2 },
                explodedPosition: { x: 0, y: i * 3, z: j * 3 }
            });

            // Crossbridges (Myosin heads)
            for (let k = -2; k <= 2; k++) {
                if (k === 0) continue;
                const headGeo = new THREE.SphereGeometry(0.15, 8, 8);
                const headMesh = new THREE.Mesh(headGeo, crossbridgeGlow);
                headMesh.position.set(k * 1.2, i * 1.2 + (i===0?0.3:Math.sign(i)*0.3), j * 1.2 + (j===0?0.3:Math.sign(j)*0.3));
                group.add(headMesh);
                if(!meshes.crossbridges) meshes.crossbridges = [];
                meshes.crossbridges.push({ mesh: headMesh, basePos: headMesh.position.clone(), dirX: Math.sign(k) });
            }
        }
    }

    // 3. Actin (Thin Filaments) - Attached to Z-Discs
    meshes.actinsLeft = [];
    meshes.actinsRight = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const actinGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
            
            // Left Actins
            const actinLeft = new THREE.Mesh(actinGeo, actinGlow);
            actinLeft.rotation.z = Math.PI / 2;
            actinLeft.position.set(-4, i * 0.6, j * 0.6);
            group.add(actinLeft);
            meshes.actinsLeft.push(actinLeft);

            parts.push({
                name: `Left Actin Thin Filament (${i},${j})`,
                description: "Thin filament extending from the left Z-disc.",
                material: "Actin Glow",
                function: "Provides binding sites for myosin heads.",
                assemblyOrder: 4,
                connections: ["Left Z-Disc", "Crossbridges"],
                failureEffect: "Inability of myosin to bind, causing muscle paralysis.",
                cascadeFailures: ["Atrophy"],
                originalPosition: { x: -4, y: i * 0.6, z: j * 0.6 },
                explodedPosition: { x: -8, y: i * 1.5, z: j * 1.5 }
            });

            // Right Actins
            const actinRight = new THREE.Mesh(actinGeo, actinGlow);
            actinRight.rotation.z = Math.PI / 2;
            actinRight.position.set(4, i * 0.6, j * 0.6);
            group.add(actinRight);
            meshes.actinsRight.push(actinRight);

            parts.push({
                name: `Right Actin Thin Filament (${i},${j})`,
                description: "Thin filament extending from the right Z-disc.",
                material: "Actin Glow",
                function: "Provides binding sites for myosin heads.",
                assemblyOrder: 5,
                connections: ["Right Z-Disc", "Crossbridges"],
                failureEffect: "Inability of myosin to bind, causing muscle paralysis.",
                cascadeFailures: ["Atrophy"],
                originalPosition: { x: 4, y: i * 0.6, z: j * 0.6 },
                explodedPosition: { x: 8, y: i * 1.5, z: j * 1.5 }
            });
        }
    }

    // 4. Titin (Spring-like protein)
    const titinPointsLeft = [];
    const titinPointsRight = [];
    for (let i = -2; i <= -0.5; i += 0.2) {
        titinPointsLeft.push(new THREE.Vector3(i, Math.sin(i * 20) * 0.2, 0));
        titinPointsRight.push(new THREE.Vector3(-i, Math.sin(-i * 20) * 0.2, 0)); // mirrored
    }
    const titinCurveLeft = new THREE.CatmullRomCurve3(titinPointsLeft);
    const titinCurveRight = new THREE.CatmullRomCurve3(titinPointsRight);
    
    const titinGeoLeft = new THREE.TubeGeometry(titinCurveLeft, 64, 0.05, 8, false);
    const titinGeoRight = new THREE.TubeGeometry(titinCurveRight, 64, 0.05, 8, false);
    
    meshes.titinsLeft = [];
    meshes.titinsRight = [];

    // Add a few titin springs
    for(let i of [-1.2, 1.2]) {
        for(let j of [-1.2, 1.2]) {
            const tl = new THREE.Mesh(titinGeoLeft, titinGlow);
            tl.position.set(-3, i, j);
            group.add(tl);
            meshes.titinsLeft.push({mesh: tl, baseY: i, baseZ: j});

            const tr = new THREE.Mesh(titinGeoRight, titinGlow);
            tr.position.set(3, i, j);
            group.add(tr);
            meshes.titinsRight.push({mesh: tr, baseY: i, baseZ: j});
        }
    }

    parts.push({
        name: "Titin Springs",
        description: "Giant elastic protein connecting Z-disc to M-line.",
        material: "Titin Glow",
        function: "Provides passive elasticity and stabilizes myosin filaments.",
        assemblyOrder: 6,
        connections: ["Z-Discs", "Myosin"],
        failureEffect: "Loss of passive tension, structural instability.",
        cascadeFailures: ["Overstretching damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    const description = "The Sarcomere is the fundamental contractile unit of skeletal muscle. It operates via the sliding filament theory, where myosin heads pull on actin filaments, causing the Z-discs to move closer together and generate force.";

    const quizQuestions = [
        {
            question: "According to the sliding filament theory, which of the following is responsible for generating the power stroke?",
            options: ["Actin", "Titin", "Myosin heads", "Z-disc"],
            correct: 2,
            explanation: "Myosin heads bind to actin and undergo a conformational change (power stroke) that pulls the thin filaments toward the center of the sarcomere.",
            difficulty: "Medium"
        },
        {
            question: "What protein acts as a molecular spring to provide passive elasticity to the sarcomere?",
            options: ["Actin", "Myosin", "Tropomyosin", "Titin"],
            correct: 3,
            explanation: "Titin connects the Z-disc to the M-line and acts like a spring, providing resting tension and protecting the sarcomere from overstretching.",
            difficulty: "Easy"
        },
        {
            question: "During muscle contraction, the distance between which two structures decreases?",
            options: ["M-lines", "Z-discs", "Thick filaments", "Titin molecules"],
            correct: 1,
            explanation: "As actin filaments slide over myosin, the Z-discs at opposite ends of the sarcomere are pulled closer together, shortening the sarcomere.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Contractile cycle (sliding filament theory)
        const contractionCycle = Math.sin(time * speed); // -1 (relaxed) to 1 (contracted)
        const contractionOffset = (contractionCycle + 1) * 0.5; // 0 to 1

        // Z-Discs move inwards
        const zDiscTargetLeft = -6 + contractionOffset * 1.5;
        const zDiscTargetRight = 6 - contractionOffset * 1.5;
        
        if(meshes.zDiscLeft && meshes.zDiscRight) {
            meshes.zDiscLeft.position.x = zDiscTargetLeft;
            meshes.zDiscRight.position.x = zDiscTargetRight;
        }

        // Actin filaments slide inwards
        if(meshes.actinsLeft) {
            meshes.actinsLeft.forEach(actin => {
                actin.position.x = -4 + contractionOffset * 1.5;
            });
        }
        if(meshes.actinsRight) {
            meshes.actinsRight.forEach(actin => {
                actin.position.x = 4 - contractionOffset * 1.5;
            });
        }

        // Crossbridges (Myosin heads) wobble to simulate rowing motion
        if (meshes.crossbridges) {
            meshes.crossbridges.forEach((cb, index) => {
                const phase = time * speed * 5 + index;
                const rowingX = Math.cos(phase) * 0.2;
                const rowingY = Math.sin(phase) * 0.1;
                cb.mesh.position.x = cb.basePos.x + rowingX;
                cb.mesh.position.y = cb.basePos.y + rowingY;
            });
        }

        // Titin squishes
        if(meshes.titinsLeft) {
            meshes.titinsLeft.forEach(t => {
                t.mesh.scale.x = 1 - contractionOffset * 0.3;
                t.mesh.position.x = -3 + contractionOffset * 0.75;
            });
        }
        if(meshes.titinsRight) {
            meshes.titinsRight.forEach(t => {
                t.mesh.scale.x = 1 - contractionOffset * 0.3;
                t.mesh.position.x = 3 - contractionOffset * 0.75;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createMuscleSarcomere() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
