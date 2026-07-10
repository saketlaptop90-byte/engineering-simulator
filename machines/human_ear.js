export function createHumanEar(THREE) {
    const group = new THREE.Group();

    // Colors
    const skinColor = 0xffccaa;
    const boneColor = 0xfff0e0;
    const membraneColor = 0xddddff;
    const nerveColor = 0xeeee33;
    const innerEarColor = 0xccaaff;

    const parts = {};

    // 1. Pinna (Outer Ear)
    const pinnaGeo = new THREE.TorusGeometry(3, 1, 16, 32);
    const pinnaMat = new THREE.MeshStandardMaterial({ color: skinColor });
    const pinna = new THREE.Mesh(pinnaGeo, pinnaMat);
    pinna.position.set(-6, 0, 0);
    pinna.scale.set(1, 1.5, 0.5);
    pinna.name = "Pinna";
    group.add(pinna);
    parts.pinna = pinna;

    // 2. Ear Canal
    const canalGeo = new THREE.CylinderGeometry(0.8, 0.6, 4, 16);
    const canalMat = new THREE.MeshStandardMaterial({ color: 0xaa6655 });
    const canal = new THREE.Mesh(canalGeo, canalMat);
    canal.rotation.z = Math.PI / 2;
    canal.position.set(-2, 0, 0);
    canal.name = "Ear Canal";
    group.add(canal);
    parts.canal = canal;

    // 3. Tympanic Membrane (Eardrum)
    const eardrumGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    const eardrumMat = new THREE.MeshStandardMaterial({ color: membraneColor, transparent: true, opacity: 0.8 });
    const eardrum = new THREE.Mesh(eardrumGeo, eardrumMat);
    eardrum.rotation.z = Math.PI / 2;
    eardrum.position.set(0, 0, 0);
    eardrum.name = "Tympanic Membrane";
    group.add(eardrum);
    parts.eardrum = eardrum;

    // 4. Malleus (Hammer)
    const malleusGeo = new THREE.ConeGeometry(0.2, 0.8, 8);
    const malleusMat = new THREE.MeshStandardMaterial({ color: boneColor });
    const malleus = new THREE.Mesh(malleusGeo, malleusMat);
    malleus.position.set(0.3, 0.2, 0);
    malleus.rotation.z = -Math.PI / 4;
    malleus.name = "Malleus";
    group.add(malleus);
    parts.malleus = malleus;

    // 5. Incus (Anvil)
    const incusGeo = new THREE.BoxGeometry(0.4, 0.4, 0.3);
    const incusMat = new THREE.MeshStandardMaterial({ color: boneColor });
    const incus = new THREE.Mesh(incusGeo, incusMat);
    incus.position.set(0.7, 0.3, 0);
    incus.name = "Incus";
    group.add(incus);
    parts.incus = incus;

    // 6. Stapes (Stirrup)
    const stapesGeo = new THREE.TorusGeometry(0.15, 0.05, 8, 16);
    const stapesMat = new THREE.MeshStandardMaterial({ color: boneColor });
    const stapes = new THREE.Mesh(stapesGeo, stapesMat);
    stapes.position.set(1.1, 0.2, 0);
    stapes.rotation.y = Math.PI / 2;
    stapes.name = "Stapes";
    group.add(stapes);
    parts.stapes = stapes;

    // 7. Cochlea
    const cochleaGeo = new THREE.TorusKnotGeometry(0.5, 0.2, 64, 8, 2, 3);
    const cochleaMat = new THREE.MeshStandardMaterial({ color: innerEarColor });
    const cochlea = new THREE.Mesh(cochleaGeo, cochleaMat);
    cochlea.position.set(2, 0, 0);
    cochlea.name = "Cochlea";
    group.add(cochlea);
    parts.cochlea = cochlea;

    // 8. Auditory Nerve
    const nerveGeo = new THREE.CylinderGeometry(0.2, 0.3, 3, 16);
    const nerveMat = new THREE.MeshStandardMaterial({ color: nerveColor });
    const nerve = new THREE.Mesh(nerveGeo, nerveMat);
    nerve.rotation.z = Math.PI / 2;
    nerve.position.set(3.8, 0, 0);
    nerve.name = "Auditory Nerve";
    group.add(nerve);
    parts.nerve = nerve;

    // 9. Semicircular Canals
    const canalsGeo = new THREE.TorusGeometry(0.4, 0.08, 8, 24);
    const canalsMat = new THREE.MeshStandardMaterial({ color: innerEarColor });
    const canals = new THREE.Mesh(canalsGeo, canalsMat);
    canals.position.set(1.5, 0.8, 0);
    canals.rotation.x = Math.PI / 3;
    canals.name = "Semicircular Canals";
    group.add(canals);
    parts.canals = canals;

    // 10. Eustachian Tube
    const eustachianGeo = new THREE.CylinderGeometry(0.3, 0.15, 3, 16);
    const eustachianMat = new THREE.MeshStandardMaterial({ color: 0xcc8877 });
    const eustachian = new THREE.Mesh(eustachianGeo, eustachianMat);
    eustachian.position.set(1.5, -1.5, 0);
    eustachian.rotation.z = -Math.PI / 6;
    eustachian.name = "Eustachian Tube";
    group.add(eustachian);
    parts.eustachian = eustachian;

    // Animate Function: simulate sound waves hitting the eardrum and vibrating ossicles
    group.userData.animate = function(time) {
        const t = time * 0.005;
        // Eardrum vibrates rapidly
        const vibration = Math.sin(t * 10) * 0.05;
        parts.eardrum.position.x = vibration;
        // Ossicles vibrate
        parts.malleus.rotation.z = -Math.PI / 4 + vibration * 0.5;
        parts.incus.position.x = 0.7 + vibration * 0.5;
        parts.stapes.position.x = 1.1 + vibration * 0.5;
        
        // Cochlea gentle pulse
        const pulse = 1 + Math.sin(t) * 0.02;
        parts.cochlea.scale.set(pulse, pulse, pulse);
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "Which part of the ear catches sound waves and funnels them into the ear canal?",
            options: ["Pinna", "Cochlea", "Incus", "Stapes"],
            correctAnswer: 0
        },
        {
            question: "What is the medical term for the eardrum?",
            options: ["Tympanic Membrane", "Semicircular Canal", "Eustachian Tube", "Auditory Nerve"],
            correctAnswer: 0
        },
        {
            question: "Which of these is the smallest bone in the human body?",
            options: ["Malleus", "Incus", "Stapes", "Femur"],
            correctAnswer: 2
        },
        {
            question: "Which structure converts mechanical vibrations into electrical signals?",
            options: ["Pinna", "Ear Canal", "Tympanic Membrane", "Cochlea"],
            correctAnswer: 3
        },
        {
            question: "What is the primary function of the semicircular canals?",
            options: ["Hearing high frequencies", "Balance and spatial orientation", "Equalizing pressure", "Producing earwax"],
            correctAnswer: 1
        },
        {
            question: "Which part helps equalize pressure between the middle ear and the atmosphere?",
            options: ["Auditory Nerve", "Eustachian Tube", "Malleus", "Stapes"],
            correctAnswer: 1
        }
    ];

    return group;
}
