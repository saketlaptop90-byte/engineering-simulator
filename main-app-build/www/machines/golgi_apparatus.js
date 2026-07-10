export function createGolgiApparatus(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Material definitions
    const cisternaMat = new THREE.MeshPhongMaterial({ color: 0xaa55aa, transparent: true, opacity: 0.8 });
    const vesicleMat = new THREE.MeshPhongMaterial({ color: 0xffaa55 });

    // 1. CisFaceCisterna
    const cisFaceGeom = new THREE.SphereGeometry(3, 32, 16);
    cisFaceGeom.scale(1, 0.2, 1);
    const cisFace = new THREE.Mesh(cisFaceGeom, cisternaMat);
    cisFace.position.set(0, 2, 0);
    cisFace.userData = { name: "Cis-Face Cisterna" };
    group.add(cisFace);
    parts.push(cisFace);

    // 2. MedialCisterna1
    const med1Geom = new THREE.SphereGeometry(3.5, 32, 16);
    med1Geom.scale(1, 0.15, 1);
    const med1 = new THREE.Mesh(med1Geom, cisternaMat);
    med1.position.set(0, 1, 0);
    med1.userData = { name: "Medial Cisterna 1" };
    group.add(med1);
    parts.push(med1);

    // 3. MedialCisterna2
    const med2Geom = new THREE.SphereGeometry(3.8, 32, 16);
    med2Geom.scale(1, 0.15, 1);
    const med2 = new THREE.Mesh(med2Geom, cisternaMat);
    med2.position.set(0, 0, 0);
    med2.userData = { name: "Medial Cisterna 2" };
    group.add(med2);
    parts.push(med2);

    // 4. MedialCisterna3
    const med3Geom = new THREE.SphereGeometry(3.5, 32, 16);
    med3Geom.scale(1, 0.15, 1);
    const med3 = new THREE.Mesh(med3Geom, cisternaMat);
    med3.position.set(0, -1, 0);
    med3.userData = { name: "Medial Cisterna 3" };
    group.add(med3);
    parts.push(med3);

    // 5. TransFaceCisterna
    const transFaceGeom = new THREE.SphereGeometry(3, 32, 16);
    transFaceGeom.scale(1, 0.2, 1);
    const transFace = new THREE.Mesh(transFaceGeom, cisternaMat);
    transFace.position.set(0, -2, 0);
    transFace.userData = { name: "Trans-Face Cisterna" };
    group.add(transFace);
    parts.push(transFace);

    // 6. TransportVesicle1
    const vesGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const tVes1 = new THREE.Mesh(vesGeom, vesicleMat);
    tVes1.position.set(-2, 4, 0);
    tVes1.userData = { name: "Transport Vesicle 1" };
    group.add(tVes1);
    parts.push(tVes1);

    // 7. TransportVesicle2
    const tVes2 = new THREE.Mesh(vesGeom, vesicleMat);
    tVes2.position.set(2, 5, 0);
    tVes2.userData = { name: "Transport Vesicle 2" };
    group.add(tVes2);
    parts.push(tVes2);

    // 8. SecretoryVesicle1
    const sVes1 = new THREE.Mesh(vesGeom, vesicleMat);
    sVes1.position.set(-2, -4, 0);
    sVes1.userData = { name: "Secretory Vesicle 1" };
    group.add(sVes1);
    parts.push(sVes1);

    // 9. SecretoryVesicle2
    const sVes2 = new THREE.Mesh(vesGeom, vesicleMat);
    sVes2.position.set(2, -5, 0);
    sVes2.userData = { name: "Secretory Vesicle 2" };
    group.add(sVes2);
    parts.push(sVes2);

    // 10. LysosomalVesicle
    const lVes = new THREE.Mesh(vesGeom, vesicleMat);
    lVes.position.set(0, -4.5, 2);
    lVes.userData = { name: "Lysosomal Vesicle" };
    group.add(lVes);
    parts.push(lVes);

    const questions = [
        {
            question: "What is the primary function of the Golgi apparatus?",
            options: ["Protein synthesis", "Modifying, sorting and packaging of proteins", "ATP production", "Lipid synthesis"],
            correctAnswer: 1
        },
        {
            question: "Which face of the Golgi apparatus receives transport vesicles from the Endoplasmic Reticulum?",
            options: ["Trans face", "Medial region", "Cis face", "Lateral face"],
            correctAnswer: 2
        },
        {
            question: "Which face of the Golgi apparatus ships secretory vesicles?",
            options: ["Cis face", "Trans face", "Ventral face", "Dorsal face"],
            correctAnswer: 1
        },
        {
            question: "What are the flattened membrane sacs that make up the Golgi apparatus called?",
            options: ["Cristae", "Thylakoids", "Cisternae", "Vacuoles"],
            correctAnswer: 2
        },
        {
            question: "Which type of vesicle transports hydrolytic enzymes to lysosomes?",
            options: ["Secretory vesicle", "Transport vesicle", "Lysosomal vesicle", "Peroxisomal vesicle"],
            correctAnswer: 2
        },
        {
            question: "Which organelle works most closely with the Golgi apparatus to process proteins?",
            options: ["Mitochondria", "Nucleus", "Rough Endoplasmic Reticulum", "Smooth Endoplasmic Reticulum"],
            correctAnswer: 2
        }
    ];

    let time = 0;
    group.tick = (dt) => {
        time += dt;
        
        // Transport vesicles moving towards Cis face (y = 2)
        tVes1.position.y = 4 - (time % 2); 
        tVes1.position.x = -2 * Math.cos(time * Math.PI); 

        tVes2.position.y = 5 - ((time * 1.5) % 3); 
        tVes2.position.x = 2 * Math.cos(time * 1.5 * Math.PI);

        // Secretory vesicles budding off Trans face (y = -2)
        sVes1.position.y = -2 - ((time * 0.8) % 3); 
        sVes1.position.x = -2 * Math.sin(time);

        sVes2.position.y = -2 - ((time * 1.2) % 4);
        sVes2.position.x = 2 * Math.sin(time);

        // Lysosomal vesicle
        lVes.position.y = -2 - ((time) % 2.5);
        lVes.position.z = 2 + ((time) % 2.5);
    };

    return {
        model: group,
        parts: parts,
        questions: questions
    };
}
