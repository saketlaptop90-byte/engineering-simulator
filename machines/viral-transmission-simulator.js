export function createViralTransmissionSimulator(THREE) {
    const group = new THREE.Group();

    // 1. Base
    const baseGeo = new THREE.BoxGeometry(20, 0.5, 20);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.25;
    group.add(base);

    // 2. Population Nodes & 7. Transmission Hubs
    const nodes = [];
    const nodePositions = [
        new THREE.Vector3(-5, 2, -5),
        new THREE.Vector3(5, 3, -5),
        new THREE.Vector3(-5, 1.5, 5),
        new THREE.Vector3(5, 2.5, 5),
        new THREE.Vector3(0, 4, 0), // Hub
        new THREE.Vector3(-8, 1, 0),
        new THREE.Vector3(8, 2, 0),
        new THREE.Vector3(0, 1.5, -8),
        new THREE.Vector3(0, 2, 8)
    ];

    const nodeGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 });
    
    const hubGeo = new THREE.SphereGeometry(1, 32, 32);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x000033 });

    const nodesGroup = new THREE.Group();
    nodePositions.forEach((pos, index) => {
        const isHub = index === 4;
        const mesh = new THREE.Mesh(isHub ? hubGeo : nodeGeo, isHub ? hubMat : nodeMat.clone());
        mesh.position.copy(pos);
        nodesGroup.add(mesh);
        nodes.push({ mesh, isHub, pos });
    });
    group.add(nodesGroup);

    // 3. Connection vectors
    const connectionsGroup = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 });
    
    const edges = [
        [0, 4], [1, 4], [2, 4], [3, 4], // connect to hub
        [5, 0], [5, 2], [6, 1], [6, 3], // outer ring
        [7, 0], [7, 1], [8, 2], [8, 3]
    ];

    edges.forEach(edge => {
        const p1 = nodePositions[edge[0]];
        const p2 = nodePositions[edge[1]];
        const points = [p1, p2];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        connectionsGroup.add(line);
    });
    group.add(connectionsGroup);

    // 4. Virus particles
    const virusGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const virusMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
    const viruses = [];
    const virusesGroup = new THREE.Group();
    
    edges.forEach((edge) => {
        const v = new THREE.Mesh(virusGeo, virusMat);
        virusesGroup.add(v);
        viruses.push({ mesh: v, edge: edge, progress: Math.random() });
    });
    group.add(virusesGroup);

    // 5. Infection spreaders
    const spreaderGeo = new THREE.TetrahedronGeometry(0.8);
    const spreaderMat = new THREE.MeshStandardMaterial({ color: 0xff5500, wireframe: true });
    const spreader1 = new THREE.Mesh(spreaderGeo, spreaderMat);
    spreader1.position.copy(nodePositions[0]);
    const spreader2 = new THREE.Mesh(spreaderGeo, spreaderMat);
    spreader2.position.copy(nodePositions[3]);
    const spreadersGroup = new THREE.Group();
    spreadersGroup.add(spreader1, spreader2);
    group.add(spreadersGroup);

    // 6. Quarantine zones
    const quarantineGeo = new THREE.BoxGeometry(2, 2, 2);
    const quarantineMat = new THREE.MeshStandardMaterial({ color: 0xffff00, transparent: true, opacity: 0.2, wireframe: true });
    const qZone1 = new THREE.Mesh(quarantineGeo, quarantineMat);
    qZone1.position.copy(nodePositions[5]);
    const qZone2 = new THREE.Mesh(quarantineGeo, quarantineMat);
    qZone2.position.copy(nodePositions[8]);
    const quarantineGroup = new THREE.Group();
    quarantineGroup.add(qZone1, qZone2);
    group.add(quarantineGroup);

    // 8. Data visualization screen
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 5, -9);
    
    const screenGeo = new THREE.PlaneGeometry(8, 4);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x001122, side: THREE.DoubleSide });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screenGroup.add(screen);
    
    const barGeo = new THREE.PlaneGeometry(0.5, 1);
    const barMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const bars = [];
    for(let i=0; i<10; i++) {
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set(-3.5 + i*0.75, -1.5, 0.01);
        screenGroup.add(bar);
        bars.push(bar);
    }
    group.add(screenGroup);

    // 9. Control panel
    const panelGroup = new THREE.Group();
    panelGroup.position.set(0, 0.5, 8);
    panelGroup.rotation.x = Math.PI / 6;

    const panelGeo = new THREE.BoxGeometry(4, 1, 2);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panelGroup.add(panel);
    
    const btnGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2);
    const btnMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(1, 0.5, 0);
    panelGroup.add(btn);
    group.add(panelGroup);

    // 10. Power supply
    const powerGroup = new THREE.Group();
    powerGroup.position.set(-8, 1, -8);

    const powerGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
    const powerMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const power = new THREE.Mesh(powerGeo, powerMat);
    powerGroup.add(power);
    
    const glowGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.5, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    powerGroup.add(glow);
    group.add(powerGroup);

    group.userData.animate = function(delta, time) {
        viruses.forEach(v => {
            v.progress += delta * 0.5;
            if(v.progress > 1) v.progress = 0;
            const p1 = nodePositions[v.edge[0]];
            const p2 = nodePositions[v.edge[1]];
            v.mesh.position.lerpVectors(p1, p2, v.progress);
        });

        spreadersGroup.children.forEach((spreader, idx) => {
            spreader.rotation.x += delta;
            spreader.rotation.y += delta;
            spreader.scale.setScalar(1 + 0.2 * Math.sin(time * 3 + idx));
        });

        bars.forEach((bar, idx) => {
            const h = 1.5 + Math.sin(time * 2 + idx) * 1;
            bar.scale.y = h;
            bar.position.y = (h - 2) / 2;
        });

        glow.position.y = Math.sin(time * 2) * 0.5;
        
        nodes.forEach((node, idx) => {
            if (!node.isHub) {
                const health = Math.sin(time + idx) * 0.5 + 0.5;
                node.mesh.material.color.setRGB(health, 1-health, 0);
            }
        });
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of a viral transmission network simulator?",
            options: [
                "To map out physical internet cables",
                "To model the spread of an infection through a population over time",
                "To design new virus structures",
                "To cure computer viruses automatically"
            ],
            correctAnswer: 1
        },
        {
            question: "In network models of epidemiology, what do 'nodes' typically represent?",
            options: [
                "The infectious agent itself",
                "Geographic borders",
                "Individuals or groups of people in a population",
                "Medical treatments"
            ],
            correctAnswer: 2
        },
        {
            question: "What does an 'edge' or 'connection vector' represent in this type of simulator?",
            options: [
                "The genetic sequence of the virus",
                "The physical distance between two cities",
                "A potential transmission pathway or contact between nodes",
                "The timeline of the simulation"
            ],
            correctAnswer: 2
        },
        {
            question: "How does a 'quarantine zone' function within a network simulation?",
            options: [
                "It temporarily removes nodes or severs their connections to halt transmission",
                "It increases the mutation rate of the virus",
                "It randomly connects all nodes together",
                "It creates a new, deadlier strain of the virus"
            ],
            correctAnswer: 0
        },
        {
            question: "Which common epidemiological model is often used as the basis for these simulations?",
            options: [
                "The OSI Model",
                "The SIR (Susceptible, Infectious, Recovered) Model",
                "The Bohr Model",
                "The Standard Model of particle physics"
            ],
            correctAnswer: 1
        },
        {
            question: "Why are 'transmission hubs' (nodes with many connections) critical in viral spread?",
            options: [
                "They act as 'super-spreaders', rapidly accelerating the infection rate if infected",
                "They are always immune to the virus",
                "They slow down the simulation by requiring more computing power",
                "They strictly prevent the virus from mutating"
            ],
            correctAnswer: 0
        }
    ];

    return group;
}
