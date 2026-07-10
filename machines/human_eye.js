export function createHumanEye(THREE) {
    const group = new THREE.Group();
    group.userData = {};

    // 1. Iris (Opaque)
    const irisGeo = new THREE.RingGeometry(0.15, 0.45, 32);
    const irisMat = new THREE.MeshPhongMaterial({ color: 0x224488, side: THREE.DoubleSide });
    const iris = new THREE.Mesh(irisGeo, irisMat);
    iris.position.z = 0.88;
    iris.name = 'Iris';
    group.add(iris);

    // 2. Pupil (Opaque)
    const pupilGeo = new THREE.CircleGeometry(0.15, 32);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.z = 0.881;
    pupil.name = 'Pupil';
    group.add(pupil);

    // 3. Macula (Opaque)
    const maculaGeo = new THREE.CircleGeometry(0.1, 32);
    const maculaMat = new THREE.MeshBasicMaterial({ color: 0xffcc00, side: THREE.DoubleSide });
    const macula = new THREE.Mesh(maculaGeo, maculaMat);
    macula.position.set(0, 0, -0.95);
    macula.rotation.y = Math.PI;
    macula.name = 'Macula';
    group.add(macula);

    // 4. Optic Nerve (Opaque)
    const nerveGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const nerveMat = new THREE.MeshPhongMaterial({ color: 0xffffcc });
    const nerve = new THREE.Mesh(nerveGeo, nerveMat);
    nerve.position.set(0.15, -0.15, -1.1);
    nerve.rotation.x = Math.PI / 2 + 0.2;
    nerve.rotation.y = 0.2;
    nerve.name = 'Optic Nerve';
    group.add(nerve);

    // 5. Vitreous Humor (Transparent)
    const vitreousGeo = new THREE.SphereGeometry(0.94, 32, 32);
    const vitreousMat = new THREE.MeshPhongMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.1, depthWrite: false });
    const vitreous = new THREE.Mesh(vitreousGeo, vitreousMat);
    vitreous.name = 'Vitreous Humor';
    group.add(vitreous);

    // 6. Lens (Transparent)
    const lensGeo = new THREE.SphereGeometry(0.25, 32, 16);
    const lensMat = new THREE.MeshPhongMaterial({ color: 0xddddff, transparent: true, opacity: 0.5, shininess: 50 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.scale.set(1, 1, 0.5);
    lens.position.z = 0.75;
    lens.name = 'Lens';
    group.add(lens);

    // 7. Retina (Transparent)
    const retinaGeo = new THREE.SphereGeometry(0.96, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.85);
    const retinaMat = new THREE.MeshPhongMaterial({ color: 0xffaa88, transparent: true, opacity: 0.7, depthWrite: false, side: THREE.DoubleSide });
    const retina = new THREE.Mesh(retinaGeo, retinaMat);
    retina.rotation.x = -Math.PI / 2;
    retina.name = 'Retina';
    group.add(retina);

    // 8. Choroid (Transparent)
    const choroidGeo = new THREE.SphereGeometry(0.98, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.85);
    const choroidMat = new THREE.MeshPhongMaterial({ color: 0x441111, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide });
    const choroid = new THREE.Mesh(choroidGeo, choroidMat);
    choroid.rotation.x = -Math.PI / 2;
    choroid.name = 'Choroid';
    group.add(choroid);

    // 9. Sclera (Transparent)
    const scleraGeo = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.85);
    const scleraMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide });
    const sclera = new THREE.Mesh(scleraGeo, scleraMat);
    sclera.rotation.x = -Math.PI / 2;
    sclera.name = 'Sclera';
    group.add(sclera);

    // 10. Cornea (Transparent)
    const corneaGeo = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const corneaMat = new THREE.MeshPhongMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, shininess: 100, depthWrite: false });
    const cornea = new THREE.Mesh(corneaGeo, corneaMat);
    cornea.position.z = 0.5;
    cornea.rotation.x = Math.PI / 2;
    cornea.name = 'Cornea';
    group.add(cornea);

    // Animation function
    group.userData.animate = function(time) {
        // Pupil dilation animation
        const scale = 1.0 + 0.4 * Math.sin(time * 0.002);
        pupil.scale.set(scale, scale, 1);
    };

    // Quiz questions
    group.userData.quiz = [
        {
            question: "What part of the eye controls the amount of light entering?",
            options: ["Iris", "Retina", "Lens", "Cornea"],
            answer: 0
        },
        {
            question: "Which part is a clear, protective outer layer at the front of the eye?",
            options: ["Sclera", "Cornea", "Choroid", "Vitreous Humor"],
            answer: 1
        },
        {
            question: "Where are the light-sensitive photoreceptor cells located?",
            options: ["Lens", "Macula", "Retina", "Optic Nerve"],
            answer: 2
        },
        {
            question: "What structure focuses light onto the retina?",
            options: ["Iris", "Lens", "Pupil", "Cornea"],
            answer: 1
        },
        {
            question: "What part of the retina is responsible for sharp, detailed central vision?",
            options: ["Macula", "Optic Disc", "Fovea", "Sclera"],
            answer: 0
        },
        {
            question: "Which nerve transmits visual information from the retina to the brain?",
            options: ["Oculomotor Nerve", "Optic Nerve", "Olfactory Nerve", "Trigeminal Nerve"],
            answer: 1
        }
    ];

    return group;
}
