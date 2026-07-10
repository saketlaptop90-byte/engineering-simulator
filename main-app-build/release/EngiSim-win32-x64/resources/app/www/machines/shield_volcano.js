export function createShieldVolcano(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x5a4d41, roughness: 0.9, flatShading: true });
    const darkRockMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 1.0 });
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0x8b0000, roughness: 0.2 });
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff6347, emissive: 0xaa0000, roughness: 0.4 });
    const roughLavaMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, emissive: 0x330000, roughness: 1.0, flatShading: true });
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x4a3c31, roughness: 0.9, transparent: true, opacity: 0.6 });

    // 1. Gentle Shield Profile
    const shieldGeo = new THREE.CylinderGeometry(6, 40, 12, 64);
    const shield = new THREE.Mesh(shieldGeo, rockMat);
    shield.position.y = 0;
    group.add(shield);
    parts.push({
        name: "Gentle Shield Profile",
        description: "Broad, gently sloping cone formed by highly fluid basaltic lava characteristic of shield volcanoes.",
        mesh: shield
    });

    // 2. Central Vent
    const ventGeo = new THREE.CylinderGeometry(1.5, 1.5, 13, 16);
    const vent = new THREE.Mesh(ventGeo, magmaMat);
    vent.position.y = 0;
    group.add(vent);
    parts.push({
        name: "Central Vent",
        description: "The main central conduit through which magma erupts to the surface.",
        mesh: vent
    });

    // 3. Caldera Collapse
    const calderaGeo = new THREE.CylinderGeometry(5.5, 5.5, 2, 32);
    const caldera = new THREE.Mesh(calderaGeo, darkRockMat);
    caldera.position.y = 5.5;
    group.add(caldera);
    parts.push({
        name: "Caldera Collapse",
        description: "A large basin-shaped depression formed by the collapse of the volcano's summit after an eruption.",
        mesh: caldera
    });

    // 4. Magma Ascent Pipe
    const pipeGeo = new THREE.CylinderGeometry(2, 2, 15, 16);
    const pipe = new THREE.Mesh(pipeGeo, magmaMat);
    pipe.position.y = -10;
    group.add(pipe);
    parts.push({
        name: "Magma Ascent Pipe",
        description: "The primary vertical channel delivering magma from the deep reservoir to the surface vent.",
        mesh: pipe
    });

    // 5. Shallow Magma Reservoir
    const reservoirGeo = new THREE.SphereGeometry(7, 32, 32);
    const reservoir = new THREE.Mesh(reservoirGeo, magmaMat);
    reservoir.position.y = -18;
    group.add(reservoir);
    parts.push({
        name: "Shallow Magma Reservoir",
        description: "A chamber of molten rock stored beneath the volcano.",
        mesh: reservoir
    });

    // 6. Lava Tube
    const tubeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(4, 5, 2),
        new THREE.Vector3(12, 2, 4),
        new THREE.Vector3(22, -2, 6),
        new THREE.Vector3(35, -5, 8)
    ]);
    const tubeGeo = new THREE.TubeGeometry(tubeCurve, 20, 1.5, 8, false);
    const lavaTube = new THREE.Mesh(tubeGeo, tubeMat);
    
    const innerTubeGeo = new THREE.TubeGeometry(tubeCurve, 20, 0.7, 8, false);
    const innerTube = new THREE.Mesh(innerTubeGeo, lavaMat);
    
    const lavaTubeGroup = new THREE.Group();
    lavaTubeGroup.add(lavaTube);
    lavaTubeGroup.add(innerTube);
    group.add(lavaTubeGroup);
    parts.push({
        name: "Lava Tube",
        description: "A natural conduit formed by flowing lava, allowing lava to travel great distances without cooling rapidly.",
        mesh: lavaTubeGroup
    });

    // 7. Pahoehoe Flow
    const pahoehoeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5.5, 4),
        new THREE.Vector3(2, 2, 12),
        new THREE.Vector3(5, -2, 22),
        new THREE.Vector3(10, -5, 35)
    ]);
    const pahoehoeGeo = new THREE.TubeGeometry(pahoehoeCurve, 30, 2, 16, false);
    pahoehoeGeo.scale(1, 0.2, 1);
    const pahoehoe = new THREE.Mesh(pahoehoeGeo, lavaMat);
    group.add(pahoehoe);
    parts.push({
        name: "Pahoehoe Flow",
        description: "Smooth, ropy basaltic lava flow that is highly fluid.",
        mesh: pahoehoe
    });

    // 8. Aa Flow
    const aaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, 5.5, 0),
        new THREE.Vector3(-12, 2, -2),
        new THREE.Vector3(-22, -2, -5),
        new THREE.Vector3(-35, -5, -10)
    ]);
    const aaGeo = new THREE.TubeGeometry(aaCurve, 30, 2.5, 5, false); // Low segments for blocky look
    aaGeo.scale(1, 0.4, 1);
    const aa = new THREE.Mesh(aaGeo, roughLavaMat);
    group.add(aa);
    parts.push({
        name: "Aa Flow",
        description: "Rough, blocky, and clinker-like lava flow that is cooler and more viscous than pahoehoe.",
        mesh: aa
    });

    // 9. Flank Eruption
    const flankGroup = new THREE.Group();
    const flankGeo = new THREE.ConeGeometry(3, 4, 32);
    const flank = new THREE.Mesh(flankGeo, rockMat);
    flank.position.set(-15, -1, 15);
    flank.rotation.x = -0.2;
    flank.rotation.z = 0.2;
    flankGroup.add(flank);
    
    const flankVentGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.2, 16);
    const flankVent = new THREE.Mesh(flankVentGeo, magmaMat);
    flankVent.position.set(-15, -1, 15);
    flankVent.rotation.x = -0.2;
    flankVent.rotation.z = 0.2;
    flankGroup.add(flankVent);
    
    group.add(flankGroup);
    parts.push({
        name: "Flank Eruption",
        description: "An eruption occurring on the sides (flanks) of the volcano rather than its summit.",
        mesh: flankGroup
    });

    // 10. Fissure Swarm
    const fissureGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const crackGeo = new THREE.BoxGeometry(0.8, 0.5, 8);
        const crack = new THREE.Mesh(crackGeo, magmaMat);
        crack.position.set(12 + i * 4, -0.5 - i * 0.8, -15 - i * 2.5);
        crack.rotation.y = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        crack.rotation.x = -0.05;
        crack.rotation.z = (Math.random() - 0.5) * 0.1;
        fissureGroup.add(crack);
    }
    group.add(fissureGroup);
    parts.push({
        name: "Fissure Swarm",
        description: "A series of linear volcanic vents through which lava erupts, common in shield volcano rift zones.",
        mesh: fissureGroup
    });

    // Animation: Lava droplets flowing down Pahoehoe curve
    const droplets = [];
    for(let i=0; i<15; i++) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshStandardMaterial({color: 0xffff00, emissive: 0xff8800}));
        group.add(drop);
        droplets.push({
            mesh: drop,
            progress: i / 15.0
        });
    }

    let time = 0;
    const update = function(delta) {
        time += delta;
        reservoir.scale.setScalar(1 + Math.sin(time * 2) * 0.03);
        vent.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.5;

        // Flowing droplets
        droplets.forEach(d => {
            d.progress += delta * 0.08;
            if (d.progress > 1) d.progress = 0;
            const pt = pahoehoeCurve.getPointAt(d.progress);
            d.mesh.position.copy(pt);
            d.mesh.position.y += 0.3; // hover slightly above the flattened surface
        });
    };

    const quizzes = [
        {
            question: "What characterizes the shape of a shield volcano?",
            options: [
                "Steep, conical peaks",
                "Broad, gently sloping profiles",
                "Deep, narrow craters",
                "Asymmetrical, jagged ridges"
            ],
            answer: 1
        },
        {
            question: "Which type of lava flow is smooth and ropy?",
            options: [
                "Aa",
                "Pahoehoe",
                "Blocky",
                "Pillow"
            ],
            answer: 1
        },
        {
            question: "What is a caldera?",
            options: [
                "A type of lava tube",
                "A linear fracture in the crust",
                "A large depression formed by summit collapse",
                "A small cone on the volcano's flank"
            ],
            answer: 2
        },
        {
            question: "Why do shield volcanoes have such gentle slopes?",
            options: [
                "High viscosity of the lava",
                "Frequent explosive eruptions",
                "Low viscosity (highly fluid) basaltic lava",
                "Rapid cooling of lava at the vent"
            ],
            answer: 2
        },
        {
            question: "What is the function of a lava tube?",
            options: [
                "It causes explosive eruptions",
                "It insulates lava, allowing it to flow great distances",
                "It stores magma deep underground",
                "It prevents lava from reaching the surface"
            ],
            answer: 1
        },
        {
            question: "What is an 'Aa' lava flow?",
            options: [
                "Smooth and highly fluid",
                "Erupted only underwater",
                "Rough, blocky, and clinker-like",
                "Formed exclusively from ash"
            ],
            answer: 2
        }
    ];

    return {
        group,
        parts,
        update,
        quizzes
    };
}
