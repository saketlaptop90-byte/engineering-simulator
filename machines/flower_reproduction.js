export function createFlowerReproduction(THREE) {
    const group = new THREE.Group();

    // Materials
    const receptacleMat = new THREE.MeshStandardMaterial({ color: 0x8FBC8F });
    const sepalMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xFF69B4, side: THREE.DoubleSide });
    const filamentMat = new THREE.MeshStandardMaterial({ color: 0xFFFAF0 });
    const antherMat = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const pollenMat = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
    const stigmaMat = new THREE.MeshStandardMaterial({ color: 0x32CD32 });
    const styleMat = new THREE.MeshStandardMaterial({ color: 0x98FB98 });
    const ovaryMat = new THREE.MeshStandardMaterial({ color: 0x90EE90, transparent: true, opacity: 0.8 });
    const ovuleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xFFE4B5 });

    // 1. Receptacle
    const receptacleGeom = new THREE.CylinderGeometry(0.5, 0.3, 0.5, 16);
    const receptacle = new THREE.Mesh(receptacleGeom, receptacleMat);
    receptacle.position.y = -0.25;
    receptacle.userData = { id: 'receptacle', name: 'Receptacle' };
    group.add(receptacle);

    // 2. Sepal
    const sepalGeom = new THREE.TorusGeometry(0.55, 0.1, 8, 16, Math.PI * 2);
    const sepal = new THREE.Mesh(sepalGeom, sepalMat);
    sepal.position.y = 0;
    sepal.rotation.x = Math.PI / 2;
    sepal.userData = { id: 'sepal', name: 'Sepal' };
    group.add(sepal);

    // 3. Petal
    const petalGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const pGeom = new THREE.CylinderGeometry(0.1, 0.6, 2, 8);
        pGeom.translate(0, 1, 0);
        const pMesh = new THREE.Mesh(pGeom, petalMat);
        pMesh.rotation.z = Math.PI / 6;
        pMesh.rotation.y = (i * Math.PI * 2) / 5;
        pMesh.scale.z = 0.2;
        petalGroup.add(pMesh);
    }
    petalGroup.userData = { id: 'petal', name: 'Petal' };
    group.add(petalGroup);

    // 4. Filament
    const filamentGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const fGeom = new THREE.CylinderGeometry(0.02, 0.05, 1.5, 8);
        fGeom.translate(0, 0.75, 0);
        const fMesh = new THREE.Mesh(fGeom, filamentMat);
        const angle = (i * Math.PI * 2) / 6;
        fMesh.position.set(Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4);
        fMesh.rotation.x = Math.sin(angle) * 0.2;
        fMesh.rotation.z = -Math.cos(angle) * 0.2;
        filamentGroup.add(fMesh);
    }
    filamentGroup.userData = { id: 'filament', name: 'Filament' };
    group.add(filamentGroup);

    // 5. Anther
    const antherGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const aGeom = new THREE.CapsuleGeometry(0.08, 0.2, 8, 8);
        const aMesh = new THREE.Mesh(aGeom, antherMat);
        const angle = (i * Math.PI * 2) / 6;
        aMesh.position.set(Math.cos(angle) * 0.48, 1.55, Math.sin(angle) * 0.48);
        aMesh.rotation.x = Math.sin(angle) * 0.2;
        aMesh.rotation.z = -Math.cos(angle) * 0.2;
        antherGroup.add(aMesh);
    }
    antherGroup.userData = { id: 'anther', name: 'Anther' };
    group.add(antherGroup);

    // 6. Pollen Grains
    const pollenGroup = new THREE.Group();
    const pollenGeom = new THREE.SphereGeometry(0.03, 8, 8);
    const pollenGrain = new THREE.Mesh(pollenGeom, pollenMat);
    pollenGrain.position.set(0, 2, 0); 
    pollenGroup.add(pollenGrain);
    pollenGroup.userData = { id: 'pollen_grains', name: 'Pollen Grains' };
    group.add(pollenGroup);

    // 7. Stigma
    const stigmaGeom = new THREE.SphereGeometry(0.15, 16, 16);
    stigmaGeom.scale(1, 0.5, 1);
    const stigma = new THREE.Mesh(stigmaGeom, stigmaMat);
    stigma.position.y = 1.3;
    stigma.userData = { id: 'stigma', name: 'Stigma' };
    group.add(stigma);

    // 8. Style
    const styleGeom = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 16);
    const style = new THREE.Mesh(styleGeom, styleMat);
    style.position.y = 0.9;
    style.userData = { id: 'style', name: 'Style' };
    group.add(style);

    // 9. Ovary
    const ovaryGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const ovary = new THREE.Mesh(ovaryGeom, ovaryMat);
    ovary.position.y = 0.35;
    ovary.userData = { id: 'ovary', name: 'Ovary' };
    group.add(ovary);

    // 10. Ovule
    const ovuleGroup = new THREE.Group();
    const ovuleGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const ovuleMesh = new THREE.Mesh(ovuleGeom, ovuleMat);
    ovuleMesh.position.set(0, 0.35, 0);
    ovuleGroup.add(ovuleMesh);
    ovuleGroup.userData = { id: 'ovule', name: 'Ovule' };
    group.add(ovuleGroup);

    // Pollen Tube for animation
    const tubeGeom = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    tubeGeom.translate(0, -0.5, 0);
    const pollenTube = new THREE.Mesh(tubeGeom, tubeMat);
    pollenTube.position.set(0, 1.3, 0);
    pollenTube.scale.y = 0.001;
    group.add(pollenTube);

    let timeElapsed = 0;
    function animate(delta, time) {
        timeElapsed += delta;
        const cycle = timeElapsed % 10;

        if (cycle < 3) {
            const t = cycle / 3;
            pollenGrain.position.y = 2 - (0.6 * t);
            pollenTube.scale.y = 0.001;
            ovuleMesh.material.color.setHex(0xFFFFFF);
        } else if (cycle < 7) {
            const t = (cycle - 3) / 4;
            pollenGrain.position.y = 1.4;
            pollenTube.scale.y = Math.max(0.001, t * 0.95);
        } else if (cycle < 9) {
            pollenGrain.position.y = 1.4;
            pollenTube.scale.y = 0.95;
            ovuleMesh.material.color.setHex(0xFFD700);
        } else {
            pollenGrain.position.y = 2;
            pollenTube.scale.y = 0.001;
            ovuleMesh.material.color.setHex(0xFFFFFF);
        }
    }

    const questions = [
        {
            question: "Which part of the flower produces pollen grains?",
            options: ["Stigma", "Style", "Anther", "Ovary"],
            correctAnswer: 2,
            explanation: "The anther is the pollen-bearing part of the stamen."
        },
        {
            question: "What is the sticky receptive surface where pollen lands?",
            options: ["Sepal", "Stigma", "Filament", "Ovule"],
            correctAnswer: 1,
            explanation: "The stigma is located at the top of the pistil and is sticky to catch pollen grains."
        },
        {
            question: "Which structure connects the stigma to the ovary?",
            options: ["Receptacle", "Style", "Petal", "Filament"],
            correctAnswer: 1,
            explanation: "The style is the elongated part of a carpel that connects the stigma to the ovary."
        },
        {
            question: "After fertilization, what does the ovule develop into?",
            options: ["A seed", "A fruit", "A petal", "A sepal"],
            correctAnswer: 0,
            explanation: "Following fertilization, the ovule develops into a seed containing an embryo."
        },
        {
            question: "What is the collective term for the female reproductive organs of a flower?",
            options: ["Stamen", "Corolla", "Calyx", "Pistil"],
            correctAnswer: 3,
            explanation: "The pistil, composed of the stigma, style, and ovary, represents the female reproductive structure."
        },
        {
            question: "What purpose does the pollen tube serve?",
            options: ["To produce nectar", "To transport sperm cells to the ovule", "To support the anther", "To attract pollinators"],
            correctAnswer: 1,
            explanation: "The pollen tube grows down through the style to deliver male gametes (sperm) to the ovule for fertilization."
        }
    ];

    return {
        group,
        animate,
        questions
    };
}
