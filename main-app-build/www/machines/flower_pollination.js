export function createFlowerPollination(THREE) {
    const group = new THREE.Group();

    // 1. Pollen Grain
    const pollenGrainGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const pollenGrainMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const pollenGrain = new THREE.Mesh(pollenGrainGeom, pollenGrainMat);
    pollenGrain.position.set(2, 5, 0);
    pollenGrain.name = "Pollen Grain";
    group.add(pollenGrain);

    // 2. Anther
    const antherGeom = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    const antherMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const anther = new THREE.Mesh(antherGeom, antherMat);
    anther.position.set(2, 4.5, 0);
    anther.name = "Anther";
    group.add(anther);

    // 3. Filament
    const filamentGeom = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const filamentMat = new THREE.MeshStandardMaterial({ color: 0x88cc44 });
    const filament = new THREE.Mesh(filamentGeom, filamentMat);
    filament.position.set(2, 2.5, 0);
    filament.name = "Filament";
    group.add(filament);

    // 4. Stigma
    const stigmaGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const stigmaMat = new THREE.MeshStandardMaterial({ color: 0xff6666 });
    const stigma = new THREE.Mesh(stigmaGeom, stigmaMat);
    stigma.position.set(0, 5, 0);
    stigma.scale.set(1, 0.5, 1);
    stigma.name = "Stigma";
    group.add(stigma);

    // 5. Style
    const styleGeom = new THREE.CylinderGeometry(0.15, 0.15, 4);
    const styleMat = new THREE.MeshStandardMaterial({ color: 0x66ff66 });
    const style = new THREE.Mesh(styleGeom, styleMat);
    style.position.set(0, 3, 0);
    style.name = "Style";
    group.add(style);

    // 6. Pollen Tube
    const pollenTubeGeom = new THREE.CylinderGeometry(0.05, 0.05, 4);
    pollenTubeGeom.translate(0, -2, 0); // Origin at top
    const pollenTubeMat = new THREE.MeshStandardMaterial({ color: 0xffff88 });
    const pollenTube = new THREE.Mesh(pollenTubeGeom, pollenTubeMat);
    pollenTube.position.set(0, 5, 0);
    pollenTube.scale.y = 0.001; // Initially hidden/zero length
    pollenTube.name = "Pollen Tube";
    group.add(pollenTube);

    // 7. Ovary
    const ovaryGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const ovaryMat = new THREE.MeshStandardMaterial({ color: 0x22aa22, transparent: true, opacity: 0.8 });
    const ovary = new THREE.Mesh(ovaryGeom, ovaryMat);
    ovary.position.set(0, 0.5, 0);
    ovary.name = "Ovary";
    group.add(ovary);

    // 8. Ovule
    const ovuleGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const ovuleMat = new THREE.MeshStandardMaterial({ color: 0xddffdd });
    const ovule = new THREE.Mesh(ovuleGeom, ovuleMat);
    ovule.position.set(0, 0.5, 0);
    ovule.name = "Ovule";
    group.add(ovule);

    // 9. Male Gamete
    const gameteGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const gameteMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const maleGamete = new THREE.Mesh(gameteGeom, gameteMat);
    maleGamete.position.set(2, 5, 0);
    maleGamete.visible = false;
    maleGamete.name = "Male Gamete";
    group.add(maleGamete);

    // 10. Pollinator Insect
    const insectGeom = new THREE.ConeGeometry(0.2, 0.5, 8);
    insectGeom.rotateX(Math.PI / 2);
    const insectMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const insect = new THREE.Mesh(insectGeom, insectMat);
    insect.position.set(4, 6, 0);
    insect.name = "Pollinator Insect";
    group.add(insect);

    let time = 0;

    const animate = (delta) => {
        time += delta;

        const cycleTime = time % 12;

        if (cycleTime < 2) {
            // Insect flying to anther
            const t = cycleTime / 2;
            insect.position.lerpVectors(new THREE.Vector3(4, 6, 0), new THREE.Vector3(2, 5.2, 0), t);
            pollenGrain.position.set(2, 5, 0);
            maleGamete.visible = false;
            pollenTube.scale.y = 0.001;
        } else if (cycleTime < 4) {
            // Insect carries pollen to stigma
            const t = (cycleTime - 2) / 2;
            insect.position.lerpVectors(new THREE.Vector3(2, 5.2, 0), new THREE.Vector3(0, 5.2, 0), t);
            pollenGrain.position.copy(insect.position);
            pollenGrain.position.y -= 0.1;
        } else if (cycleTime < 7) {
            // Insect flies away
            if (cycleTime < 5) {
                const t = (cycleTime - 4);
                insect.position.lerpVectors(new THREE.Vector3(0, 5.2, 0), new THREE.Vector3(-4, 6, 0), t);
            }
            pollenGrain.position.set(0, 5, 0);
            
            // Pollen tube grows
            const tTube = (cycleTime - 4) / 3;
            pollenTube.scale.y = THREE.MathUtils.lerp(0.001, 1, tTube);
        } else if (cycleTime < 10) {
            // Male gamete travels down
            maleGamete.visible = true;
            const tGamete = (cycleTime - 7) / 3;
            maleGamete.position.lerpVectors(new THREE.Vector3(0, 5, 0), new THREE.Vector3(0, 1, 0), tGamete);
        } else {
            maleGamete.visible = false;
        }
        
        // Wing flap effect via rotation
        if (cycleTime < 5) {
            insect.rotation.z = Math.sin(time * 50) * 0.2;
        }
    };

    return { group, animate };
}

export const quiz = [
    {
        question: "What is the primary function of the anther?",
        options: ["To produce and store pollen", "To attract pollinators", "To protect the ovule", "To receive pollen"],
        answer: 0
    },
    {
        question: "Which structure connects the stigma to the ovary?",
        options: ["Filament", "Style", "Anther", "Sepal"],
        answer: 1
    },
    {
        question: "What does the pollen grain develop to transport the male gamete?",
        options: ["Root hair", "Pollen tube", "Filament", "Endosperm"],
        answer: 1
    },
    {
        question: "Where is the ovule located within the flower?",
        options: ["In the stigma", "In the anther", "In the ovary", "On the filament"],
        answer: 2
    },
    {
        question: "What is the role of the pollinator insect in pollination?",
        options: ["To produce pollen", "To digest the pollen", "To transfer pollen from anther to stigma", "To grow the pollen tube"],
        answer: 2
    },
    {
        question: "What fertilizes the ovule to form a seed?",
        options: ["The stigma", "The style", "The male gamete", "The petal"],
        answer: 2
    }
];
