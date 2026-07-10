export function createHumanBrain(THREE) {
    const root = new THREE.Group();

    // Materials
    const frontalMat = new THREE.MeshStandardMaterial({ color: 0xff9999, transparent: true, opacity: 0.85, roughness: 0.6 });
    const parietalMat = new THREE.MeshStandardMaterial({ color: 0x9999ff, transparent: true, opacity: 0.85, roughness: 0.6 });
    const temporalMat = new THREE.MeshStandardMaterial({ color: 0x99ff99, transparent: true, opacity: 0.85, roughness: 0.6 });
    const occipitalMat = new THREE.MeshStandardMaterial({ color: 0xffff99, transparent: true, opacity: 0.85, roughness: 0.6 });
    const cerebellumMat = new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.7 });
    const brainstemMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
    const thalamusMat = new THREE.MeshStandardMaterial({ color: 0xcc8888, roughness: 0.4 });
    const hypothalamusMat = new THREE.MeshStandardMaterial({ color: 0x88cc88, roughness: 0.4 });
    const amygdalaMat = new THREE.MeshStandardMaterial({ color: 0x8888cc, roughness: 0.4 });
    const hippocampusMat = new THREE.MeshStandardMaterial({ color: 0xcccc88, roughness: 0.4 });

    // 1. Frontal Lobe
    const frontalGeom = new THREE.SphereGeometry(2, 32, 32);
    const frontal = new THREE.Mesh(frontalGeom, frontalMat);
    frontal.scale.set(1, 0.8, 1);
    frontal.position.set(0, 1.5, 1.5);
    frontal.name = "Frontal Lobe";
    root.add(frontal);

    // 2. Parietal Lobe
    const parietalGeom = new THREE.SphereGeometry(1.8, 32, 32);
    const parietal = new THREE.Mesh(parietalGeom, parietalMat);
    parietal.scale.set(1.1, 0.9, 1);
    parietal.position.set(0, 2.5, -0.5);
    parietal.name = "Parietal Lobe";
    root.add(parietal);

    // 3. Temporal Lobe
    const temporalGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const temporalLeft = new THREE.Mesh(temporalGeom, temporalMat);
    temporalLeft.scale.set(0.6, 0.8, 1.2);
    temporalLeft.position.set(1.8, 0.5, 0);
    const temporalRight = temporalLeft.clone();
    temporalRight.position.set(-1.8, 0.5, 0);
    const temporalLobe = new THREE.Group();
    temporalLobe.add(temporalLeft);
    temporalLobe.add(temporalRight);
    temporalLobe.name = "Temporal Lobe";
    root.add(temporalLobe);

    // 4. Occipital Lobe
    const occipitalGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const occipital = new THREE.Mesh(occipitalGeom, occipitalMat);
    occipital.scale.set(1, 0.9, 0.8);
    occipital.position.set(0, 1.2, -2.2);
    occipital.name = "Occipital Lobe";
    root.add(occipital);

    // 5. Cerebellum
    const cerebellumGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const cerebellum = new THREE.Mesh(cerebellumGeom, cerebellumMat);
    cerebellum.scale.set(1.2, 0.6, 0.8);
    cerebellum.position.set(0, -0.5, -2);
    cerebellum.name = "Cerebellum";
    root.add(cerebellum);

    // 6. Brainstem
    const brainstemGeom = new THREE.CylinderGeometry(0.4, 0.3, 2.5, 32);
    const brainstem = new THREE.Mesh(brainstemGeom, brainstemMat);
    brainstem.position.set(0, -1.5, -0.5);
    brainstem.rotation.x = -0.2;
    brainstem.name = "Brainstem";
    root.add(brainstem);

    // 7. Thalamus
    const thalamusGeom = new THREE.SphereGeometry(0.5, 32, 32);
    const thalamusLeft = new THREE.Mesh(thalamusGeom, thalamusMat);
    thalamusLeft.scale.set(0.6, 0.8, 1);
    thalamusLeft.position.set(0.4, 0.5, -0.2);
    const thalamusRight = thalamusLeft.clone();
    thalamusRight.position.set(-0.4, 0.5, -0.2);
    const thalamus = new THREE.Group();
    thalamus.add(thalamusLeft);
    thalamus.add(thalamusRight);
    thalamus.name = "Thalamus";
    root.add(thalamus);

    // 8. Hypothalamus
    const hypothalamusGeom = new THREE.SphereGeometry(0.25, 32, 32);
    const hypothalamus = new THREE.Mesh(hypothalamusGeom, hypothalamusMat);
    hypothalamus.position.set(0, 0.1, 0.2);
    hypothalamus.name = "Hypothalamus";
    root.add(hypothalamus);

    // 9. Amygdala
    const amygdalaGeom = new THREE.SphereGeometry(0.15, 32, 32);
    const amygdalaLeft = new THREE.Mesh(amygdalaGeom, amygdalaMat);
    amygdalaLeft.position.set(1.2, -0.2, 0.8);
    const amygdalaRight = amygdalaLeft.clone();
    amygdalaRight.position.set(-1.2, -0.2, 0.8);
    const amygdala = new THREE.Group();
    amygdala.add(amygdalaLeft);
    amygdala.add(amygdalaRight);
    amygdala.name = "Amygdala";
    root.add(amygdala);

    // 10. Hippocampus
    const hippocampusGeom = new THREE.TorusGeometry(0.6, 0.15, 16, 32, Math.PI);
    const hippocampusLeft = new THREE.Mesh(hippocampusGeom, hippocampusMat);
    hippocampusLeft.position.set(0.8, 0.2, 0.2);
    hippocampusLeft.rotation.y = Math.PI / 2;
    hippocampusLeft.rotation.x = Math.PI / 4;
    const hippocampusRight = new THREE.Mesh(hippocampusGeom, hippocampusMat);
    hippocampusRight.position.set(-0.8, 0.2, 0.2);
    hippocampusRight.rotation.y = -Math.PI / 2;
    hippocampusRight.rotation.x = Math.PI / 4;
    const hippocampus = new THREE.Group();
    hippocampus.add(hippocampusLeft);
    hippocampus.add(hippocampusRight);
    hippocampus.name = "Hippocampus";
    root.add(hippocampus);

    // Animation: Pulse to simulate electrical activity
    root.userData.update = function(time) {
        const pulseScale = 1 + Math.sin(time * 2) * 0.01;
        root.scale.set(pulseScale, pulseScale, pulseScale);

        frontalMat.emissive.setHex(0xff5555);
        frontalMat.emissiveIntensity = (Math.sin(time * 4.0) + 1) * 0.2;

        parietalMat.emissive.setHex(0x5555ff);
        parietalMat.emissiveIntensity = (Math.sin(time * 4.1) + 1) * 0.2;

        temporalMat.emissive.setHex(0x55ff55);
        temporalMat.emissiveIntensity = (Math.sin(time * 4.2) + 1) * 0.2;

        occipitalMat.emissive.setHex(0xffff55);
        occipitalMat.emissiveIntensity = (Math.sin(time * 4.3) + 1) * 0.2;

        cerebellumMat.emissive.setHex(0xffaa55);
        cerebellumMat.emissiveIntensity = (Math.sin(time * 5.0) + 1) * 0.15;

        brainstemMat.emissive.setHex(0xffffff);
        brainstemMat.emissiveIntensity = (Math.sin(time * 3.0) + 1) * 0.1;
    };

    root.userData.quiz = [
        {
            question: "Which part of the brain is primarily responsible for motor control and balance?",
            options: ["Cerebrum", "Cerebellum", "Brainstem", "Thalamus"],
            answer: 1
        },
        {
            question: "Which lobe of the cerebrum is associated with visual processing?",
            options: ["Frontal Lobe", "Parietal Lobe", "Temporal Lobe", "Occipital Lobe"],
            answer: 3
        },
        {
            question: "What is the primary function of the brainstem?",
            options: ["Higher order thinking", "Regulating basic life functions like breathing and heart rate", "Processing emotions", "Storing long-term memories"],
            answer: 1
        },
        {
            question: "Which brain structure is heavily involved in the formation of new memories?",
            options: ["Amygdala", "Hippocampus", "Hypothalamus", "Thalamus"],
            answer: 1
        },
        {
            question: "The amygdala is most closely associated with which function?",
            options: ["Emotion processing, particularly fear", "Balance and coordination", "Visual perception", "Language comprehension"],
            answer: 0
        },
        {
            question: "Which part of the brain acts as a sensory relay station, routing incoming signals to the appropriate areas of the cerebral cortex?",
            options: ["Hypothalamus", "Brainstem", "Thalamus", "Cerebellum"],
            answer: 2
        }
    ];

    return root;
}
