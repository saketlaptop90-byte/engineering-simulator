export function createNeuronCell(THREE) {
    const root = new THREE.Group();
    root.name = "NeuronCell";

    // 1. Soma (Cell Body)
    const somaGeom = new THREE.SphereGeometry(2, 32, 32);
    const somaMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.6 });
    const soma = new THREE.Mesh(somaGeom, somaMat);
    soma.name = "Soma";
    root.add(soma);

    // 2. Nucleus
    const nucleusGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.4 });
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    nucleus.position.set(0.3, 0.2, 0.5);
    nucleus.name = "Nucleus";
    soma.add(nucleus);

    // 3. Dendrites
    const dendrites = new THREE.Group();
    dendrites.name = "Dendrites";
    const dendriteMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.7 });
    
    const numTrees = 7;
    for (let i = 0; i < numTrees; i++) {
        const angle = (i / numTrees) * Math.PI * 2;
        const rZ = Math.cos(angle);
        const rY = Math.sin(angle);
        const rX = -0.5 - Math.random() * 1.0; 
        
        const dir = new THREE.Vector3(rX, rY, rZ).normalize();
        
        const len = 2.0;
        const geom = new THREE.CylinderGeometry(0.1, 0.3, len, 8);
        geom.translate(0, len / 2, 0);
        const mesh = new THREE.Mesh(geom, dendriteMat);
        
        mesh.position.copy(dir.clone().multiplyScalar(1.8)); 
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        
        dendrites.add(mesh);
        
        // Sub-branches
        for (let j = 0; j < 2; j++) {
            const bLen = 1.5;
            const bGeom = new THREE.CylinderGeometry(0.05, 0.1, bLen, 8);
            bGeom.translate(0, bLen / 2, 0);
            const bMesh = new THREE.Mesh(bGeom, dendriteMat);
            
            const spreadX = (Math.random() - 0.5) * 0.5;
            const spreadY = (Math.random() - 0.5) * 0.5;
            const spreadZ = (Math.random() - 0.5) * 0.5;
            const bDir = dir.clone().add(new THREE.Vector3(spreadX, spreadY, spreadZ)).normalize();
            
            bMesh.position.copy(dir.clone().multiplyScalar(1.8 + len - 0.1));
            bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bDir);
            dendrites.add(bMesh);
        }
    }
    root.add(dendrites);

    // 4. Axon Hillock
    const hillockLen = 1.5;
    const hillockGeom = new THREE.ConeGeometry(1, hillockLen, 16);
    hillockGeom.translate(0, hillockLen / 2, 0);
    const hillockMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.6 });
    const hillock = new THREE.Mesh(hillockGeom, hillockMat);
    hillock.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    hillock.position.set(1.5, 0, 0); 
    hillock.name = "AxonHillock";
    root.add(hillock);

    // 5. Axon
    const axonLen = 12;
    const axonGeom = new THREE.CylinderGeometry(0.15, 0.2, axonLen, 16);
    axonGeom.translate(0, axonLen / 2, 0);
    const axonMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.5 });
    const axon = new THREE.Mesh(axonGeom, axonMat);
    axon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    axon.position.set(1.5 + hillockLen - 0.1, 0, 0); 
    axon.name = "Axon";
    root.add(axon);

    // 6. Myelin Sheath
    const myelin = new THREE.Group();
    myelin.name = "MyelinSheath";
    const myelinMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.3 });
    const numSegments = 6;
    const segmentLen = 1.5;
    const gap = 0.3; 
    
    // 7. Schwann Cells
    const schwannCells = new THREE.Group();
    schwannCells.name = "SchwannCells";
    const schwannMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.8 });

    const startX = 3.5;
    for(let i = 0; i < numSegments; i++) {
        const mGeom = new THREE.CylinderGeometry(0.35, 0.35, segmentLen, 16);
        mGeom.translate(0, segmentLen / 2, 0);
        const m = new THREE.Mesh(mGeom, myelinMat);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
        const xPos = startX + i * (segmentLen + gap);
        m.position.set(xPos, 0, 0);
        myelin.add(m);
        
        const sGeom = new THREE.SphereGeometry(0.2, 16, 16);
        const s = new THREE.Mesh(sGeom, schwannMat);
        s.scale.set(1.5, 0.8, 0.8);
        s.position.set(xPos + segmentLen / 2, 0.35, 0);
        schwannCells.add(s);
    }
    root.add(myelin);
    root.add(schwannCells);

    // 8. Axon Terminals
    const terminals = new THREE.Group();
    terminals.name = "AxonTerminals";
    const terminalMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.6 });
    
    // 9. Synaptic End Bulbs
    const endBulbs = new THREE.Group();
    endBulbs.name = "SynapticEndBulbs";
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.4 });

    const terminalBaseX = 14.9;
    const branchAngles = [-Math.PI/4, -Math.PI/8, Math.PI/8, Math.PI/4];
    branchAngles.forEach(angle => {
        const tLen = 2.0;
        const tGeom = new THREE.CylinderGeometry(0.05, 0.15, tLen, 8);
        tGeom.translate(0, tLen / 2, 0);
        const t = new THREE.Mesh(tGeom, terminalMat);
        
        const dir = new THREE.Vector3(1, Math.sin(angle), Math.cos(angle)*0.5).normalize();
        t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        t.position.set(terminalBaseX, 0, 0);
        terminals.add(t);

        const bulbGeom = new THREE.SphereGeometry(0.25, 16, 16);
        const bulb = new THREE.Mesh(bulbGeom, bulbMat);
        const bulbPos = dir.clone().multiplyScalar(tLen).add(new THREE.Vector3(terminalBaseX, 0, 0));
        bulb.position.copy(bulbPos);
        
        endBulbs.add(bulb);
    });
    root.add(terminals);
    root.add(endBulbs);

    // 10. Action Potential Signal
    const signalGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const signalMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const signal = new THREE.Mesh(signalGeom, signalMat);
    signal.name = "ActionPotentialSignal";
    
    const signalLight = new THREE.PointLight(0x00ffff, 1, 5);
    signal.add(signalLight);
    root.add(signal);

    // Kinematics Animation
    root.userData.update = function(time) {
        const duration = 2.5; 
        const t = (time % duration) / duration;
        
        if (t < 0.8) {
            // Signal traveling down the axon
            const startX = 0;
            const endX = 15;
            const currentX = startX + (t / 0.8) * (endX - startX);
            signal.position.set(currentX, 0, 0);
            signal.visible = true;
            signalLight.intensity = 1;
            
            endBulbs.children.forEach(bulb => {
                bulb.scale.setScalar(1);
            });
            bulbMat.emissive.setHex(0x000000);
        } else {
            // Neurotransmitter release flash
            signal.visible = false;
            signalLight.intensity = 0;
            
            const flash = (t - 0.8) / 0.2; 
            const scale = 1 + Math.sin(flash * Math.PI) * 0.4;
            const intensity = Math.sin(flash * Math.PI) * 0.8;
            
            endBulbs.children.forEach(bulb => {
                bulb.scale.setScalar(scale);
            });
            bulbMat.emissive.setHex(0x00ffff);
            bulbMat.emissiveIntensity = intensity;
        }
    };

    // Quiz Questions
    root.userData.quiz = [
        {
            question: "What is the primary function of the soma (cell body) in a neuron?",
            options: [
                "To receive signals from other neurons",
                "To contain the nucleus and maintain cell life",
                "To transmit electrical impulses",
                "To release neurotransmitters"
            ],
            answer: 1
        },
        {
            question: "Which structure insulates the axon to speed up signal transmission?",
            options: [
                "Dendrites",
                "Synaptic End Bulbs",
                "Myelin Sheath",
                "Axon Hillock"
            ],
            answer: 2
        },
        {
            question: "What are the gaps between the myelin sheath called, where action potentials are regenerated?",
            options: [
                "Synaptic Clefts",
                "Nodes of Ranvier",
                "Schwann Cells",
                "Axon Terminals"
            ],
            answer: 1
        },
        {
            question: "Which part of the neuron is primarily responsible for receiving incoming signals?",
            options: [
                "Axon",
                "Nucleus",
                "Dendrites",
                "Myelin Sheath"
            ],
            answer: 2
        },
        {
            question: "What is the role of Schwann cells in the peripheral nervous system?",
            options: [
                "To produce the myelin sheath",
                "To generate action potentials",
                "To synthesize neurotransmitters",
                "To connect dendrites to the soma"
            ],
            answer: 0
        },
        {
            question: "Where are neurotransmitters stored before they are released into the synaptic cleft?",
            options: [
                "Axon Hillock",
                "Nucleus",
                "Synaptic End Bulbs",
                "Nodes of Ranvier"
            ],
            answer: 2
        }
    ];

    return root;
}
