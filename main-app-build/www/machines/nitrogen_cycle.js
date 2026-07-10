export function createNitrogenCycle(THREE) {
    const group = new THREE.Group();

    // 1. Soil
    const soilGeometry = new THREE.CylinderGeometry(15, 15, 2, 32);
    const soilMaterial = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = -1;
    soil.userData.name = 'Soil';
    group.add(soil);

    // 2. Legume Plant
    const plantGroup = new THREE.Group();
    plantGroup.userData.name = 'Legume Plant';
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 2;
    plantGroup.add(stem);
    const leavesGeo = new THREE.ConeGeometry(2, 4, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x32cd32 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 4;
    plantGroup.add(leaves);
    const rootsGeo = new THREE.CylinderGeometry(0.1, 0.5, 2);
    const rootsMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const roots = new THREE.Mesh(rootsGeo, rootsMat);
    roots.position.y = -1;
    plantGroup.add(roots);
    group.add(plantGroup);

    // 3. Nitrogen-fixing Bacteria
    const nFixingGroup = new THREE.Group();
    nFixingGroup.userData.name = 'Nitrogen-fixing Bacteria';
    const bacteriaGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const nFixMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    for(let i=0; i<15; i++) {
        const bac = new THREE.Mesh(bacteriaGeo, nFixMat);
        bac.position.set((Math.random()-0.5)*1.5, -0.5 - Math.random(), (Math.random()-0.5)*1.5);
        nFixingGroup.add(bac);
    }
    group.add(nFixingGroup);

    // 4. Ammonium
    const ammoniumGroup = new THREE.Group();
    ammoniumGroup.userData.name = 'Ammonium';
    const nh4Geo = new THREE.OctahedronGeometry(0.2);
    const nh4Mat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    for(let i=0; i<20; i++) {
        const nh4 = new THREE.Mesh(nh4Geo, nh4Mat);
        nh4.position.set((Math.random()-0.5)*12, -1 - Math.random(), (Math.random()-0.5)*12);
        ammoniumGroup.add(nh4);
    }
    group.add(ammoniumGroup);

    // 5. Nitrifying Bacteria
    const nitrifyingGroup = new THREE.Group();
    nitrifyingGroup.userData.name = 'Nitrifying Bacteria';
    const nitriBacGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const nitriBacMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    for(let i=0; i<15; i++) {
        const bac = new THREE.Mesh(nitriBacGeo, nitriBacMat);
        bac.position.set((Math.random()-0.5)*12, -1 - Math.random(), (Math.random()-0.5)*12);
        nitrifyingGroup.add(bac);
    }
    group.add(nitrifyingGroup);

    // 6. Nitrates
    const nitratesGroup = new THREE.Group();
    nitratesGroup.userData.name = 'Nitrates';
    const no3Geo = new THREE.TetrahedronGeometry(0.25);
    const no3Mat = new THREE.MeshStandardMaterial({ color: 0x800080 });
    for(let i=0; i<20; i++) {
        const no3 = new THREE.Mesh(no3Geo, no3Mat);
        no3.position.set((Math.random()-0.5)*12, -0.5 - Math.random(), (Math.random()-0.5)*12);
        nitratesGroup.add(no3);
    }
    group.add(nitratesGroup);

    // 7. Denitrifying Bacteria
    const denitrifyingGroup = new THREE.Group();
    denitrifyingGroup.userData.name = 'Denitrifying Bacteria';
    const denitriBacGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const denitriBacMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    for(let i=0; i<15; i++) {
        const bac = new THREE.Mesh(denitriBacGeo, denitriBacMat);
        bac.position.set((Math.random()-0.5)*12, -0.2 - Math.random()*0.5, (Math.random()-0.5)*12);
        denitrifyingGroup.add(bac);
    }
    group.add(denitrifyingGroup);

    // 8. Atmospheric N2
    const n2Group = new THREE.Group();
    n2Group.userData.name = 'Atmospheric N2';
    const n2Geo = new THREE.SphereGeometry(0.3, 16, 16);
    const n2Mat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    for(let i=0; i<25; i++) {
        const pair = new THREE.Group();
        const a1 = new THREE.Mesh(n2Geo, n2Mat);
        a1.position.x = -0.25;
        const a2 = new THREE.Mesh(n2Geo, n2Mat);
        a2.position.x = 0.25;
        pair.add(a1);
        pair.add(a2);
        pair.position.set((Math.random()-0.5)*20, 5 + Math.random()*6, (Math.random()-0.5)*20);
        
        // Save initial parameters for animation
        pair.userData = {
            ox: pair.position.x,
            oy: pair.position.y,
            oz: pair.position.z,
            speed: Math.random() * 0.03 + 0.01,
            phase: Math.random() * Math.PI * 2
        };
        n2Group.add(pair);
    }
    group.add(n2Group);

    // 9. Herbivore
    const herbivoreGroup = new THREE.Group();
    herbivoreGroup.userData.name = 'Herbivore';
    const bodyGeo = new THREE.BoxGeometry(1.5, 1, 2.5);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    herbivoreGroup.add(body);
    const headGeo = new THREE.BoxGeometry(0.8, 0.8, 1);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 1.5, 1.5);
    herbivoreGroup.add(head);
    const legGeo = new THREE.CylinderGeometry(0.15, 0.1, 1);
    const leg1 = new THREE.Mesh(legGeo, bodyMat); leg1.position.set(0.6, 0.5, 1); herbivoreGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, bodyMat); leg2.position.set(-0.6, 0.5, 1); herbivoreGroup.add(leg2);
    const leg3 = new THREE.Mesh(legGeo, bodyMat); leg3.position.set(0.6, 0.5, -1); herbivoreGroup.add(leg3);
    const leg4 = new THREE.Mesh(legGeo, bodyMat); leg4.position.set(-0.6, 0.5, -1); herbivoreGroup.add(leg4);
    herbivoreGroup.position.set(6, 0, 2);
    group.add(herbivoreGroup);

    // 10. Decomposers
    const decomposersGroup = new THREE.Group();
    decomposersGroup.userData.name = 'Decomposers';
    const stalkGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    const stalkMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const capGeo = new THREE.ConeGeometry(0.4, 0.3, 8);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
    for(let i=0; i<6; i++) {
        const mush = new THREE.Group();
        const stalk = new THREE.Mesh(stalkGeo, stalkMat);
        stalk.position.y = 0.25;
        mush.add(stalk);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.5;
        mush.add(cap);
        mush.position.set(5 + Math.random()*3, 0, -2 + Math.random()*4);
        decomposersGroup.add(mush);
    }
    group.add(decomposersGroup);

    // Animation function
    group.userData.animation = (time) => {
        // Animate Atmospheric N2
        n2Group.children.forEach(pair => {
            pair.position.y = pair.userData.oy + Math.sin(time * pair.userData.speed + pair.userData.phase) * 2;
            pair.position.x = pair.userData.ox + Math.cos(time * pair.userData.speed * 0.5 + pair.userData.phase) * 1.5;
            pair.rotation.y += 0.02;
            pair.rotation.x += 0.01;
        });

        // Herbivore head bobbing
        head.rotation.x = Math.sin(time * 2) * 0.2;

        // Soil molecules slight pulsation to indicate activity
        ammoniumGroup.children.forEach((nh4, idx) => {
            const scale = 1 + Math.sin(time * 3 + idx) * 0.15;
            nh4.scale.set(scale, scale, scale);
        });
        nitratesGroup.children.forEach((no3, idx) => {
            const scale = 1 + Math.cos(time * 3 + idx) * 0.15;
            no3.scale.set(scale, scale, scale);
        });
    };

    // Quiz Questions
    group.userData.questions = [
        {
            text: "What is the primary reservoir of nitrogen on Earth?",
            options: ["Atmosphere", "Oceans", "Soil", "Plants"],
            correctAnswer: 0
        },
        {
            text: "Which organisms are primarily responsible for nitrogen fixation?",
            options: ["Plants", "Fungi", "Animals", "Bacteria"],
            correctAnswer: 3
        },
        {
            text: "In what form do plants typically absorb nitrogen from the soil?",
            options: ["N2 gas", "Nitrates and Ammonium", "Nitrites", "Uric acid"],
            correctAnswer: 1
        },
        {
            text: "What is the process of converting nitrates back to nitrogen gas called?",
            options: ["Nitrification", "Ammonification", "Denitrification", "Assimilation"],
            correctAnswer: 2
        },
        {
            text: "Which plants have a symbiotic relationship with nitrogen-fixing bacteria?",
            options: ["Ferns", "Legumes", "Mosses", "Conifers"],
            correctAnswer: 1
        },
        {
            text: "What role do decomposers play in the nitrogen cycle?",
            options: ["Convert N2 to ammonia", "Convert nitrates to N2", "Release nitrogen from dead matter as ammonium", "Absorb nitrogen for plants"],
            correctAnswer: 2
        }
    ];

    return group;
}
