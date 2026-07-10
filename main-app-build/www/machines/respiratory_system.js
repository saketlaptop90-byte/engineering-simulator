export function createRespiratorySystem(THREE) {
    const group = new THREE.Group();

    // Materials
    const tissueMaterial = new THREE.MeshStandardMaterial({ color: 0xffaaaa, roughness: 0.6, metalness: 0.1 });
    const cartilageMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8, metalness: 0.0 });
    const lungMaterial = new THREE.MeshStandardMaterial({ color: 0xff6666, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.9 });
    const muscleMaterial = new THREE.MeshStandardMaterial({ color: 0xcc4444, roughness: 0.9, metalness: 0.0 });

    // 1. Pharynx
    const pharynxGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.8, 16);
    const pharynx = new THREE.Mesh(pharynxGeometry, tissueMaterial);
    pharynx.position.set(0, 3.4, 0);
    pharynx.name = "Pharynx";
    group.add(pharynx);

    // 2. Epiglottis
    const epiglottisGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.05);
    const epiglottis = new THREE.Mesh(epiglottisGeometry, cartilageMaterial);
    epiglottis.position.set(0, 3.0, 0.1);
    epiglottis.rotation.x = -Math.PI / 6;
    epiglottis.name = "Epiglottis";
    group.add(epiglottis);

    // 3. Larynx
    const larynxGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
    const larynx = new THREE.Mesh(larynxGeometry, cartilageMaterial);
    larynx.position.set(0, 2.7, 0);
    larynx.name = "Larynx";
    group.add(larynx);

    // 4. Trachea
    const tracheaGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2.0, 16);
    const trachea = new THREE.Mesh(tracheaGeometry, cartilageMaterial);
    trachea.position.set(0, 1.4, 0);
    trachea.name = "Trachea";
    group.add(trachea);

    // 5. Left Bronchus
    const leftBronchusGeometry = new THREE.CylinderGeometry(0.15, 0.12, 1.0, 16);
    const leftBronchus = new THREE.Mesh(leftBronchusGeometry, cartilageMaterial);
    leftBronchus.position.set(-0.4, 0.1, 0);
    leftBronchus.rotation.z = Math.PI / 4;
    leftBronchus.name = "Left Bronchus";
    group.add(leftBronchus);

    // 6. Right Bronchus
    const rightBronchusGeometry = new THREE.CylinderGeometry(0.15, 0.12, 1.0, 16);
    const rightBronchus = new THREE.Mesh(rightBronchusGeometry, cartilageMaterial);
    rightBronchus.position.set(0.4, 0.1, 0);
    rightBronchus.rotation.z = -Math.PI / 4;
    rightBronchus.name = "Right Bronchus";
    group.add(rightBronchus);

    // 7. Left Lung
    const leftLungGeometry = new THREE.CapsuleGeometry(1.0, 1.5, 16, 32);
    const leftLung = new THREE.Mesh(leftLungGeometry, lungMaterial);
    leftLung.position.set(-1.2, -0.2, 0);
    leftLung.name = "Left Lung";
    group.add(leftLung);

    // 8. Right Lung
    const rightLungGeometry = new THREE.CapsuleGeometry(1.0, 1.5, 16, 32);
    const rightLung = new THREE.Mesh(rightLungGeometry, lungMaterial);
    rightLung.position.set(1.2, -0.2, 0);
    rightLung.name = "Right Lung";
    group.add(rightLung);

    // 9. Diaphragm
    const diaphragmGeometry = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const diaphragm = new THREE.Mesh(diaphragmGeometry, muscleMaterial);
    diaphragm.position.set(0, -2.5, 0);
    diaphragm.scale.set(1, 0.5, 1);
    diaphragm.rotation.x = Math.PI;
    diaphragm.name = "Diaphragm";
    group.add(diaphragm);

    // 10. Alveoli
    const alveoliGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const alveoliMaterial = new THREE.MeshStandardMaterial({ color: 0xffcccc, roughness: 0.5 });
    const alveoli = new THREE.Mesh(alveoliGeometry, alveoliMaterial);
    alveoli.position.set(-0.8, -0.3, 0);
    alveoli.name = "Alveoli";
    group.add(alveoli);

    // Animation
    group.userData.animate = function(time) {
        const breathingCycle = Math.sin(time * 0.002);
        
        // Lungs expand and contract
        const lungScale = 1.0 + breathingCycle * 0.1;
        leftLung.scale.set(lungScale, lungScale, lungScale);
        rightLung.scale.set(lungScale, lungScale, lungScale);

        // Diaphragm moves up and down
        diaphragm.position.y = -2.5 - breathingCycle * 0.2;
        
        // Alveoli expand
        const alveoliScale = 1.0 + breathingCycle * 0.15;
        alveoli.scale.set(alveoliScale, alveoliScale, alveoliScale);
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "Which organ is responsible for the primary exchange of oxygen and carbon dioxide?",
            options: ["Trachea", "Alveoli", "Diaphragm", "Pharynx"],
            answer: "Alveoli"
        },
        {
            question: "What is the flap of cartilage that prevents food from entering the trachea?",
            options: ["Larynx", "Bronchi", "Epiglottis", "Pharynx"],
            answer: "Epiglottis"
        },
        {
            question: "Which muscle is primarily responsible for breathing?",
            options: ["Diaphragm", "Heart", "Intercostal muscles", "Biceps"],
            answer: "Diaphragm"
        },
        {
            question: "What is the scientific name for the windpipe?",
            options: ["Esophagus", "Pharynx", "Trachea", "Bronchus"],
            answer: "Trachea"
        },
        {
            question: "Which lung is slightly smaller to accommodate the heart?",
            options: ["Left Lung", "Right Lung", "Both are the same size", "Neither"],
            answer: "Left Lung"
        },
        {
            question: "What connects the larynx to the bronchi?",
            options: ["Pharynx", "Trachea", "Alveoli", "Epiglottis"],
            answer: "Trachea"
        }
    ];

    return group;
}
