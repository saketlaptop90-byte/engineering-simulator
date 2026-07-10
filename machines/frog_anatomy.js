export function createFrogAnatomy(THREE) {
    const group = new THREE.Group();

    // Materials
    const brainMat = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const lungMat = new THREE.MeshPhongMaterial({ color: 0xff9999 });
    const heartMat = new THREE.MeshPhongMaterial({ color: 0xff3333 });
    const liverMat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const stomachMat = new THREE.MeshPhongMaterial({ color: 0xeeddaa });
    const smallIntestineMat = new THREE.MeshPhongMaterial({ color: 0xddcc99 });
    const largeIntestineMat = new THREE.MeshPhongMaterial({ color: 0xaa8855 });
    const kidneyMat = new THREE.MeshPhongMaterial({ color: 0x883333 });
    const bladderMat = new THREE.MeshPhongMaterial({ color: 0xffffaa });
    const cloacaMat = new THREE.MeshPhongMaterial({ color: 0x885533 });

    // 1. Brain
    const brainGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const brain = new THREE.Mesh(brainGeom, brainMat);
    brain.position.set(0, 3, 0);
    brain.userData = { name: "Brain" };
    group.add(brain);

    // 2. Lungs
    const lungGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const leftLung = new THREE.Mesh(lungGeom, lungMat);
    leftLung.position.set(-0.6, 1.8, 0.2);
    leftLung.scale.set(1, 1.5, 1);
    const rightLung = new THREE.Mesh(lungGeom, lungMat);
    rightLung.position.set(0.6, 1.8, 0.2);
    rightLung.scale.set(1, 1.5, 1);
    
    const lungs = new THREE.Group();
    lungs.add(leftLung);
    lungs.add(rightLung);
    lungs.userData = { name: "Lungs" };
    group.add(lungs);

    // 3. Heart
    const heartGeom = new THREE.ConeGeometry(0.3, 0.6, 16);
    const heart = new THREE.Mesh(heartGeom, heartMat);
    heart.position.set(0, 1.8, 0.5);
    heart.rotation.x = Math.PI; // Pointing down
    heart.userData = { name: "Heart" };
    group.add(heart);

    // 4. Liver
    const liverGeom = new THREE.CylinderGeometry(0.8, 0.6, 0.8, 16);
    const liver = new THREE.Mesh(liverGeom, liverMat);
    liver.position.set(0, 1.0, 0.3);
    liver.rotation.x = Math.PI / 4;
    liver.userData = { name: "Liver" };
    group.add(liver);

    // 5. Stomach
    const stomachGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const stomach = new THREE.Mesh(stomachGeom, stomachMat);
    stomach.position.set(-0.5, 0.2, 0.1);
    stomach.scale.set(1.2, 0.8, 1);
    stomach.rotation.z = Math.PI / 6;
    stomach.userData = { name: "Stomach" };
    group.add(stomach);

    // 6. Small Intestine
    const smallIntGeom = new THREE.TorusGeometry(0.4, 0.15, 8, 32);
    const smallIntestine = new THREE.Mesh(smallIntGeom, smallIntestineMat);
    smallIntestine.position.set(0, -0.6, 0);
    smallIntestine.rotation.x = Math.PI / 2;
    smallIntestine.userData = { name: "Small Intestine" };
    group.add(smallIntestine);

    // 7. Large Intestine
    const largeIntGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const largeIntestine = new THREE.Mesh(largeIntGeom, largeIntestineMat);
    largeIntestine.position.set(0, -1.3, -0.1);
    largeIntestine.userData = { name: "Large Intestine" };
    group.add(largeIntestine);

    // 8. Kidneys
    const kidneyGeom = new THREE.CapsuleGeometry(0.2, 0.4, 8, 16);
    const leftKidney = new THREE.Mesh(kidneyGeom, kidneyMat);
    leftKidney.position.set(-0.4, -0.5, -0.4);
    const rightKidney = new THREE.Mesh(kidneyGeom, kidneyMat);
    rightKidney.position.set(0.4, -0.5, -0.4);
    
    const kidneys = new THREE.Group();
    kidneys.add(leftKidney);
    kidneys.add(rightKidney);
    kidneys.userData = { name: "Kidneys" };
    group.add(kidneys);

    // 9. Bladder
    const bladderGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const bladder = new THREE.Mesh(bladderGeom, bladderMat);
    bladder.position.set(0, -1.8, 0.2);
    bladder.scale.set(1, 0.6, 1);
    bladder.userData = { name: "Bladder" };
    group.add(bladder);

    // 10. Cloaca
    const cloacaGeom = new THREE.CylinderGeometry(0.1, 0.15, 0.4, 16);
    const cloaca = new THREE.Mesh(cloacaGeom, cloacaMat);
    cloaca.position.set(0, -2.2, -0.1);
    cloaca.userData = { name: "Cloaca" };
    group.add(cloaca);

    // Animation function
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        // Breathing animation for lungs
        const breathScale = 1 + Math.sin(time * 3) * 0.15;
        leftLung.scale.set(breathScale, 1.5 * breathScale, breathScale);
        rightLung.scale.set(breathScale, 1.5 * breathScale, breathScale);

        // Heartbeat animation
        const beatScale = 1 + Math.pow(Math.sin(time * 6), 4) * 0.15;
        heart.scale.set(beatScale, beatScale, beatScale);
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "Which organ in the frog is responsible for producing bile and filtering toxins?",
            options: ["Heart", "Liver", "Stomach", "Kidneys"],
            correctAnswer: 1
        },
        {
            question: "How many chambers does a frog's heart have?",
            options: ["Two", "Three", "Four", "Five"],
            correctAnswer: 1
        },
        {
            question: "In addition to lungs, frogs can breathe through their:",
            options: ["Eyes", "Ears", "Skin", "Stomach"],
            correctAnswer: 2
        },
        {
            question: "Which organ is the primary site of nutrient absorption in a frog?",
            options: ["Stomach", "Large Intestine", "Liver", "Small Intestine"],
            correctAnswer: 3
        },
        {
            question: "What is the common exit chamber for the digestive, excretory, and reproductive systems in a frog?",
            options: ["Bladder", "Cloaca", "Large Intestine", "Stomach"],
            correctAnswer: 1
        },
        {
            question: "Which organs filter wastes from the frog's blood?",
            options: ["Lungs", "Kidneys", "Liver", "Brain"],
            correctAnswer: 1
        }
    ];

    return group;
}
