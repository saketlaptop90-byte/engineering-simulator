import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createNeuron(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const pulseMatInner = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const pulseGlowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4 });
    const neurotransmitterMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.9 });

    // Tints
    const somaMat = tinted(whitePlastic, 0xccddee);
    const nucleusMat = tinted(glass, 0x8844cc);
    const dendriteMat = tinted(whitePlastic, 0xb0c4de);
    const axonMat = tinted(plastic, 0xffffcc);
    const myelinMat = tinted(whitePlastic, 0xffffff);
    const schwannMat = tinted(plastic, 0xddaacc);
    const nodeMat = tinted(glass, 0xffdd00); 
    const terminalMat = tinted(whitePlastic, 0xb0c4de);

    // 1. Soma
    const somaGroup = new THREE.Group();
    const somaGeo = new THREE.IcosahedronGeometry(2, 2); 
    somaGeo.scale(1, 0.9, 0.95);
    const somaMesh = new THREE.Mesh(somaGeo, somaMat);
    somaGroup.add(somaMesh);
    group.add(somaGroup);
    parts.push({
        name: "Soma (Cell Body)",
        description: "The bulbous main part of a neuron, containing the nucleus and most organelles.",
        material: "Semi-transparent membrane",
        function: "Maintains the cell and integrates incoming signals from dendrites.",
        assemblyOrder: 1,
        connections: ["Dendrites", "Nucleus", "Axon Hillock"],
        failureEffect: "Cell death and complete failure of neural signaling.",
        cascadeFailures: ["Entire Neural Circuit"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 10),
        group: somaGroup
    });

    // 2. Nucleus
    const nucleusGroup = new THREE.Group();
    const nucGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const nucMesh = new THREE.Mesh(nucGeo, nucleusMat);
    nucleusGroup.add(nucMesh);
    group.add(nucleusGroup);
    parts.push({
        name: "Nucleus",
        description: "The dense central organelle within the soma.",
        material: "Chromatin-rich nucleoplasm",
        function: "Houses the genetic material (DNA) and coordinates cell activities like protein synthesis.",
        assemblyOrder: 2,
        connections: ["Soma"],
        failureEffect: "Inability to synthesize essential proteins, leading to cell degradation.",
        cascadeFailures: ["Soma"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 20),
        group: nucleusGroup
    });

    // 3. Dendrites
    const dendritesGroup = new THREE.Group();
    const numDendrites = 8;
    for (let i = 0; i < numDendrites; i++) {
        const theta = (i / numDendrites) * Math.PI * 2;
        const phi = Math.PI * 0.6 + Math.random() * 0.3; // Branches backward (X < 0)
        
        const dir = new THREE.Vector3(
            Math.cos(phi),
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta)
        ).normalize();

        const length1 = 3 + Math.random() * 3;
        const path1 = new THREE.LineCurve3(
            dir.clone().multiplyScalar(1.8),
            dir.clone().multiplyScalar(1.8 + length1)
        );
        const tubeGeo1 = new THREE.TubeGeometry(path1, 8, 0.4, 8, false);
        const tubeMesh1 = new THREE.Mesh(tubeGeo1, dendriteMat);
        dendritesGroup.add(tubeMesh1);
        
        const bDir1 = dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0), 0.5).normalize();
        const startPoint = path1.getPoint(0.6);
        const path2 = new THREE.LineCurve3(
            startPoint,
            startPoint.clone().add(bDir1.multiplyScalar(2))
        );
        const tubeGeo2 = new THREE.TubeGeometry(path2, 8, 0.2, 8, false);
        const tubeMesh2 = new THREE.Mesh(tubeGeo2, dendriteMat);
        dendritesGroup.add(tubeMesh2);
        
        const bDir2 = dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0), -0.5).applyAxisAngle(new THREE.Vector3(1,0,0), 0.5).normalize();
        const path3 = new THREE.LineCurve3(
            startPoint,
            startPoint.clone().add(bDir2.multiplyScalar(2.5))
        );
        const tubeGeo3 = new THREE.TubeGeometry(path3, 8, 0.2, 8, false);
        const tubeMesh3 = new THREE.Mesh(tubeGeo3, dendriteMat);
        dendritesGroup.add(tubeMesh3);
    }
    group.add(dendritesGroup);
    parts.push({
        name: "Dendrites",
        description: "Tree-like extensions at the beginning of a neuron.",
        material: "Membranous extensions",
        function: "Receive chemical signals from the axon terminals of other neurons and convert them into electrical impulses.",
        assemblyOrder: 3,
        connections: ["Soma"],
        failureEffect: "Inability to receive signals, isolating the neuron from the network.",
        cascadeFailures: ["Neural Circuit Integration"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-15, 0, 0),
        group: dendritesGroup
    });

    // 4. Axon Hillock
    const hillockGroup = new THREE.Group();
    const hGeo = new THREE.CylinderGeometry(0.25, 1.5, 2.5, 32);
    hGeo.rotateZ(-Math.PI / 2);
    hGeo.translate(2.5, 0, 0); // Center at 2.5. Base at 1.25, tip at 3.75
    const hillockMesh = new THREE.Mesh(hGeo, somaMat);
    hillockGroup.add(hillockMesh);
    group.add(hillockGroup);
    parts.push({
        name: "Axon Hillock",
        description: "The cone-shaped region at the junction between the axon and the cell body.",
        material: "Membrane rich in voltage-gated channels",
        function: "The 'trigger zone' where graded potentials are summed and the action potential is initiated.",
        assemblyOrder: 4,
        connections: ["Soma", "Axon"],
        failureEffect: "Failure to initiate action potentials, halting all outgoing communication.",
        cascadeFailures: ["Axon signal propagation"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 10, 0),
        group: hillockGroup
    });

    // 5. Axon
    const axonGroup = new THREE.Group();
    const axonGeo = new THREE.CylinderGeometry(0.25, 0.25, 25, 16);
    axonGeo.rotateZ(-Math.PI / 2);
    axonGeo.translate(16, 0, 0); // Center 16, spans 3.5 to 28.5
    const axonMesh = new THREE.Mesh(axonGeo, axonMat);
    axonGroup.add(axonMesh);
    
    // Action Potential Pulse Mesh
    const pulseGeo = new THREE.SphereGeometry(0.4, 16, 16);
    pulseGeo.scale(2.5, 1.0, 1.0);
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMatInner);
    const pulseGlowGeo = new THREE.SphereGeometry(0.6, 16, 16);
    pulseGlowGeo.scale(2.5, 1.0, 1.0);
    const pulseGlowMesh = new THREE.Mesh(pulseGlowGeo, pulseGlowMat);
    pulseMesh.add(pulseGlowMesh);
    pulseMesh.userData = { isPulse: true };
    axonGroup.add(pulseMesh);

    group.add(axonGroup);
    parts.push({
        name: "Axon",
        description: "A long, slender projection of a nerve cell, or neuron.",
        material: "Axolemma membrane",
        function: "Conducts electrical impulses (action potentials) away from the neuron's cell body.",
        assemblyOrder: 5,
        connections: ["Axon Hillock", "Axon Terminals"],
        failureEffect: "Disrupted signal transmission to target cells.",
        cascadeFailures: ["Synaptic release"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -10, 0),
        group: axonGroup
    });

    // 6. Myelin Sheath
    const myelinGroup = new THREE.Group();
    const numMyelin = 6;
    const myelinLength = 3;
    const gapLength = 0.8;
    const startX = 4.5;
    for (let i = 0; i < numMyelin; i++) {
        const xPos = startX + i * (myelinLength + gapLength) + myelinLength/2;
        const mGeo = new THREE.CylinderGeometry(0.6, 0.6, myelinLength, 16);
        mGeo.rotateZ(-Math.PI / 2);
        mGeo.translate(xPos, 0, 0);
        
        const torusGeo = new THREE.TorusGeometry(0.45, 0.15, 8, 16);
        torusGeo.rotateY(Math.PI / 2);
        const t1 = new THREE.Mesh(torusGeo, myelinMat);
        t1.position.set(xPos - myelinLength/2, 0, 0);
        const t2 = new THREE.Mesh(torusGeo, myelinMat);
        t2.position.set(xPos + myelinLength/2, 0, 0);

        const mMesh = new THREE.Mesh(mGeo, myelinMat);
        myelinGroup.add(mMesh);
        myelinGroup.add(t1);
        myelinGroup.add(t2);
    }
    group.add(myelinGroup);
    parts.push({
        name: "Myelin Sheath",
        description: "A lipid-rich (fatty) insulating layer wrapped around the axon.",
        material: "Fatty myelin",
        function: "Increases the speed of electrical impulse propagation via saltatory conduction.",
        assemblyOrder: 6,
        connections: ["Axon", "Schwann Cells"],
        failureEffect: "Slowing or stopping of nerve impulses (as seen in Multiple Sclerosis).",
        cascadeFailures: ["Muscle coordination", "Sensory processing"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 15, 0),
        group: myelinGroup
    });

    // 7. Nodes of Ranvier
    const nodesGroup = new THREE.Group();
    for (let i = 0; i < numMyelin - 1; i++) {
        const xPos = startX + myelinLength + i * (myelinLength + gapLength) + gapLength/2;
        const nodeGeo = new THREE.TorusGeometry(0.28, 0.08, 16, 32);
        nodeGeo.rotateY(Math.PI / 2);
        
        const m = nodeMat.clone();
        m.emissive = new THREE.Color(0xffaa00);
        m.emissiveIntensity = 0;
        
        const nodeMesh = new THREE.Mesh(nodeGeo, m);
        nodeMesh.position.set(xPos, 0, 0);
        nodeMesh.userData = { originalScale: 1, type: 'node', xPos: xPos };
        nodesGroup.add(nodeMesh);
    }
    group.add(nodesGroup);
    parts.push({
        name: "Nodes of Ranvier",
        description: "Periodic gaps in the myelin sheath where the axonal membrane is exposed.",
        material: "Exposed Axolemma",
        function: "Facilitate rapid conduction of nerve impulses by allowing the action potential to 'jump' from node to node.",
        assemblyOrder: 7,
        connections: ["Axon", "Myelin Sheath"],
        failureEffect: "Failure to regenerate the action potential, halting signal transmission.",
        cascadeFailures: ["Signal propagation"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, -15),
        group: nodesGroup
    });

    // 8. Schwann Cells
    const schwannGroup = new THREE.Group();
    for (let i = 0; i < numMyelin; i++) {
        const xPos = startX + i * (myelinLength + gapLength) + myelinLength/2;
        const sGeo = new THREE.CapsuleGeometry(0.3, 0.8, 8, 16);
        sGeo.rotateZ(Math.PI / 2);
        const sMesh = new THREE.Mesh(sGeo, schwannMat);
        const angle = i * Math.PI * 0.7; // rotate them uniquely
        sMesh.position.set(xPos, Math.cos(angle)*0.65, Math.sin(angle)*0.65);
        sMesh.lookAt(xPos, 0, 0);
        schwannGroup.add(sMesh);
    }
    group.add(schwannGroup);
    parts.push({
        name: "Schwann Cells",
        description: "Glial cells of the peripheral nervous system.",
        material: "Glial Cell body",
        function: "Produce the myelin sheath around neuronal axons.",
        assemblyOrder: 8,
        connections: ["Myelin Sheath"],
        failureEffect: "Demyelination of peripheral nerves.",
        cascadeFailures: ["Myelin Sheath", "Axon conduction speed"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 25, 0),
        group: schwannGroup
    });

    // 9. Axon Terminals
    const terminalGroup = new THREE.Group();
    const terminalEndX = 28.5;
    const numTerminals = 6;
    const terminalPositions = [];
    const branchStart = new THREE.Vector3(terminalEndX - 2, 0, 0);

    for (let i = 0; i < numTerminals; i++) {
        const angle = (i / numTerminals) * Math.PI * 2;
        const radius = 2.5 + Math.random();
        const y = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const endPt = new THREE.Vector3(terminalEndX + 1, y, z);
        const midPt = new THREE.Vector3(terminalEndX - 0.5, y * 0.5, z * 0.5);
        const path = new THREE.QuadraticBezierCurve3(branchStart, midPt, endPt);
        
        const tGeo = new THREE.TubeGeometry(path, 12, 0.1, 8, false);
        const tMesh = new THREE.Mesh(tGeo, terminalMat);
        terminalGroup.add(tMesh);

        const boutonGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const boutonMesh = new THREE.Mesh(boutonGeo, terminalMat);
        boutonMesh.position.copy(endPt);
        terminalGroup.add(boutonMesh);
        
        terminalPositions.push(endPt.clone().add(new THREE.Vector3(0.2, 0, 0)));
    }
    group.add(terminalGroup);
    parts.push({
        name: "Axon Terminals",
        description: "The somewhat enlarged, often club-shaped endings by which axons make synaptic contacts.",
        material: "Synaptic Bouton",
        function: "Convert the electrical action potential into a chemical signal by releasing neurotransmitters.",
        assemblyOrder: 9,
        connections: ["Axon", "Synaptic Cleft"],
        failureEffect: "Failure to release neurotransmitters.",
        cascadeFailures: ["Synaptic Cleft", "Target cell activation"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(15, -10, 0),
        group: terminalGroup
    });

    // 10. Synaptic Cleft
    const cleftGroup = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    terminalPositions.forEach(pos => {
        for(let j = 0; j < 12; j++) {
            const pMesh = new THREE.Mesh(particleGeo, neurotransmitterMat);
            pMesh.position.copy(pos);
            pMesh.userData = {
                basePos: pos.clone(),
                offset: new THREE.Vector3((Math.random()-0.5)*0.2, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5),
                velocity: new THREE.Vector3(Math.random()*0.15 + 0.1, (Math.random()-0.5)*0.15, (Math.random()-0.5)*0.15),
                active: false,
                life: 0
            };
            pMesh.visible = false;
            cleftGroup.add(pMesh);
        }
    });
    group.add(cleftGroup);
    parts.push({
        name: "Synaptic Cleft & Neurotransmitters",
        description: "The microscopic gap between neurons, and the chemical messengers released into it.",
        material: "Chemical Messengers (e.g. Acetylcholine)",
        function: "Diffuse across the gap to bind with receptors on the target cell, propagating the signal.",
        assemblyOrder: 10,
        connections: ["Axon Terminals"],
        failureEffect: "Signal cannot cross to the next cell.",
        cascadeFailures: ["Inter-neuronal communication"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(25, -10, 0),
        group: cleftGroup
    });

    const description = "A Motor Neuron (nerve cell) demonstrating signal propagation. Notice the long axon coated in a myelin sheath, which enables rapid saltatory conduction (jumping) of the action potential between the Nodes of Ranvier, culminating in the release of neurotransmitters at the synapse.";

    const quizQuestions = [
        {
            question: "What is the primary function of the myelin sheath?",
            options: [
                "To synthesize neurotransmitters",
                "To insulate the axon and increase signal speed",
                "To receive incoming signals from other cells",
                "To provide energy to the neuron"
            ],
            correct: 1,
            explanation: "The myelin sheath acts as an electrical insulator, allowing the action potential to propagate rapidly via saltatory conduction.",
            difficulty: "easy"
        },
        {
            question: "What is the process called when an action potential 'jumps' between Nodes of Ranvier?",
            options: [
                "Continuous conduction",
                "Synaptic transmission",
                "Saltatory conduction",
                "Active transport"
            ],
            correct: 2,
            explanation: "Saltatory conduction (from Latin saltare, to jump) is the rapid propagation of action potentials along myelinated axons from one Node of Ranvier to the next.",
            difficulty: "medium"
        },
        {
            question: "Which part of the neuron serves as the primary 'trigger zone' for initiating an action potential?",
            options: [
                "Axon Terminals",
                "Dendrites",
                "Myelin Sheath",
                "Axon Hillock"
            ],
            correct: 3,
            explanation: "The axon hillock has a high density of voltage-gated sodium channels and is where graded potentials are summed to trigger an action potential.",
            difficulty: "medium"
        },
        {
            question: "What are the chemical messengers released into the synaptic cleft called?",
            options: [
                "Hormones",
                "Enzymes",
                "Neurotransmitters",
                "Electrolytes"
            ],
            correct: 2,
            explanation: "Neurotransmitters (like Acetylcholine, Dopamine, or Serotonin) cross the synaptic cleft to transmit the signal to the target cell.",
            difficulty: "easy"
        },
        {
            question: "Which cells are responsible for producing the myelin sheath in the peripheral nervous system?",
            options: [
                "Astrocytes",
                "Schwann Cells",
                "Microglia",
                "Oligodendrocytes"
            ],
            correct: 1,
            explanation: "Schwann cells wrap around the axons of motor and sensory neurons to form the myelin sheath in the peripheral nervous system.",
            difficulty: "medium"
        },
        {
            question: "If a neurotoxin blocked voltage-gated calcium channels at the axon terminal, what would be the immediate effect?",
            options: [
                "The action potential would speed up",
                "Myelin would degrade",
                "Neurotransmitter release would stop",
                "The dendrites would shrink"
            ],
            correct: 2,
            explanation: "Calcium influx at the axon terminal is strictly required to trigger the exocytosis (release) of neurotransmitter vesicles.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        const axonGroup = meshes[4].group;
        const nodesGroup = meshes[6].group;
        const cleftGroup = meshes[9].group;

        // Total duration for one cycle
        const cycleTime = (time * speed) % 6; 
        
        // Map 0..5 to X positions: from Soma (-2) to Terminals (32)
        const currentPulseX = -2 + cycleTime * 7.5; 

        // Animate Pulse Mesh
        let pulseMesh;
        axonGroup.children.forEach(c => {
            if (c.userData.isPulse) pulseMesh = c;
        });
        if (pulseMesh) {
            pulseMesh.position.set(currentPulseX, 0, 0);
            pulseMesh.visible = (currentPulseX > 2 && currentPulseX < 28.5);
        }

        // Animate Nodes glowing
        nodesGroup.children.forEach(node => {
            const dist = Math.abs(node.userData.xPos - currentPulseX);
            if (dist < 3.0) {
                const intensity = Math.max(0, 1.0 - dist/3.0);
                const scale = 1 + intensity * 0.5;
                node.scale.set(scale, scale, scale);
                node.material.emissiveIntensity = intensity * 2.0;
                node.material.color.setHex(0xffffff);
            } else {
                node.scale.set(1, 1, 1);
                node.material.emissiveIntensity = 0;
                node.material.color.setHex(0xffdd00);
            }
        });

        // Animate Neurotransmitters
        const isTriggered = currentPulseX > 28.5 && currentPulseX < 32;
        
        cleftGroup.children.forEach(p => {
            if (isTriggered) {
                if (!p.userData.active) {
                    p.userData.active = true;
                    p.userData.life = 0;
                    p.position.copy(p.userData.basePos).add(p.userData.offset);
                    p.visible = true;
                }
            } else if (currentPulseX < 2 || cycleTime < 0.5) { 
                 p.userData.active = false;
                 p.visible = false;
            }

            if (p.userData.active) {
                p.position.add(p.userData.velocity.clone().multiplyScalar(speed * 0.8));
                p.userData.life += Math.abs(speed) * 0.02;
                const s = Math.max(0.001, 1 - p.userData.life);
                p.scale.set(s, s, s);
                if (p.userData.life >= 1) {
                    p.visible = false;
                    p.userData.active = false;
                }
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

export { createNeuron as create };
