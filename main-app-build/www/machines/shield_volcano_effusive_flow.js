export function createShieldVolcanoEffusiveFlow(THREE) {
    const group = new THREE.Group();
    
    // 1. CentralCaldera
    const calderaGeo = new THREE.CylinderGeometry(5, 5.5, 1, 32);
    const calderaMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const centralCaldera = new THREE.Mesh(calderaGeo, calderaMat);
    centralCaldera.position.set(0, 5, 0);
    centralCaldera.name = "CentralCaldera";
    group.add(centralCaldera);

    // 2. RiftZone
    const riftGeo = new THREE.BoxGeometry(10, 0.5, 2);
    const riftMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const riftZone = new THREE.Mesh(riftGeo, riftMat);
    riftZone.position.set(5, 2.5, 0);
    riftZone.rotation.z = -Math.PI / 6;
    riftZone.name = "RiftZone";
    group.add(riftZone);

    // 3. LavaTube
    const tubeGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xff4500 });
    const lavaTube = new THREE.Mesh(tubeGeo, tubeMat);
    lavaTube.position.set(8, 1, 2);
    lavaTube.rotation.z = -Math.PI / 4;
    lavaTube.rotation.y = Math.PI / 4;
    lavaTube.name = "LavaTube";
    group.add(lavaTube);

    // 4. PahoehoeFlow
    const pahoehoeGeo = new THREE.SphereGeometry(2, 32, 16);
    pahoehoeGeo.scale(1, 0.2, 2);
    const pahoehoeMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.1 });
    const pahoehoeFlow = new THREE.Mesh(pahoehoeGeo, pahoehoeMat);
    pahoehoeFlow.position.set(12, 0.2, 5);
    pahoehoeFlow.name = "PahoehoeFlow";
    group.add(pahoehoeFlow);

    // 5. AaFlow
    const aaGeo = new THREE.IcosahedronGeometry(2, 1);
    aaGeo.scale(1.5, 0.3, 1);
    const aaMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 1.0 });
    const aaFlow = new THREE.Mesh(aaGeo, aaMat);
    aaFlow.position.set(12, 0.3, -3);
    aaFlow.name = "AaFlow";
    group.add(aaFlow);

    // 6. FissureSwarm
    const fissureGeo = new THREE.BoxGeometry(0.2, 0.1, 4);
    const fissureMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const fissureSwarm = new THREE.Group();
    for(let i=0; i<3; i++) {
        let f = new THREE.Mesh(fissureGeo, fissureMat);
        f.position.set(i*1.5, 0, i*0.5);
        fissureSwarm.add(f);
    }
    fissureSwarm.position.set(-6, 2, 2);
    fissureSwarm.rotation.z = Math.PI / 6;
    fissureSwarm.name = "FissureSwarm";
    group.add(fissureSwarm);

    // 7. PitCrater
    const pitGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
    const pitMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const pitCrater = new THREE.Mesh(pitGeo, pitMat);
    pitCrater.position.set(-4, 3.5, -3);
    pitCrater.rotation.z = Math.PI / 8;
    pitCrater.name = "PitCrater";
    group.add(pitCrater);

    // 8. Skylight
    const skylightGeo = new THREE.CircleGeometry(0.6, 16);
    const skylightMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const skylight = new THREE.Mesh(skylightGeo, skylightMat);
    skylight.position.set(7, 2, 1.2);
    skylight.rotation.x = -Math.PI / 2;
    skylight.rotation.y = -Math.PI / 4;
    skylight.name = "Skylight";
    group.add(skylight);

    // 9. Hornito
    const hornitoGeo = new THREE.ConeGeometry(0.8, 2, 16);
    const hornitoMat = new THREE.MeshStandardMaterial({ color: 0x4b3621 });
    const hornito = new THREE.Mesh(hornitoGeo, hornitoMat);
    hornito.position.set(9, 1.5, -1);
    hornito.rotation.z = -Math.PI / 8;
    hornito.name = "Hornito";
    group.add(hornito);

    // 10. LavaFountain
    const fountainGeo = new THREE.CylinderGeometry(0.2, 0.5, 4, 16);
    fountainGeo.translate(0, 2, 0); // Translate so scaling works from bottom
    const fountainMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const lavaFountain = new THREE.Mesh(fountainGeo, fountainMat);
    lavaFountain.position.set(0, 5.5, 0); // Top of the caldera
    lavaFountain.name = "LavaFountain";
    group.add(lavaFountain);

    // Animation function
    let time = 0;
    group.userData.update = function(deltaTime) {
        time += deltaTime;
        
        // Animate Lava Fountain
        lavaFountain.scale.y = 1 + 0.4 * Math.sin(time * 8);

        // Animate Pahoehoe Flow (breathing/flowing effect)
        pahoehoeFlow.scale.x = 1 + 0.05 * Math.sin(time * 2);
        pahoehoeFlow.scale.z = 2 + 0.1 * Math.cos(time * 2);
        
        // Animate Aa Flow slightly
        aaFlow.rotation.y = 0.02 * Math.sin(time);

        // Twinkle Skylight
        skylightMat.color.setHSL(0.1 + 0.05 * Math.sin(time * 10), 1, 0.6);
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary magma type in shield volcano effusive eruptions?",
            options: ["Rhyolitic", "Andesitic", "Basaltic", "Dacitic"],
            correctAnswer: 2
        },
        {
            question: "Which type of lava flow has a smooth, ropy surface?",
            options: ["A'a", "Pahoehoe", "Block lava", "Pillow lava"],
            correctAnswer: 1
        },
        {
            question: "What feature forms when the roof of a lava tube partially collapses?",
            options: ["Pit Crater", "Hornito", "Skylight", "Fissure"],
            correctAnswer: 2
        },
        {
            question: "A rough, clinkery lava flow typical of slightly cooler basaltic magma is called:",
            options: ["Pahoehoe", "A'a", "Ignimbrite", "Obsidian"],
            correctAnswer: 1
        },
        {
            question: "Small, steep-sided spatter cones that form on the surface of a basaltic lava flow are known as:",
            options: ["Calderas", "Lava Fountains", "Rift Zones", "Hornitos"],
            correctAnswer: 3
        },
        {
            question: "Which feature is a linear fracture through which lava erupts?",
            options: ["Central Caldera", "Lava Tube", "Fissure Swarm", "Pit Crater"],
            correctAnswer: 2
        }
    ];

    return group;
}
