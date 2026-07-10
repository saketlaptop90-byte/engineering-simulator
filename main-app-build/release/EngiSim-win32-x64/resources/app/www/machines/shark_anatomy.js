export function createSharkAnatomy(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Helper to add parts
    function addPart(name, mesh, description) {
        mesh.name = name;
        mesh.userData = { description };
        group.add(mesh);
        parts.push({ name, mesh, description });
    }

    // 1. Snout
    const snoutGeo = new THREE.ConeGeometry(0.8, 2, 16);
    snoutGeo.rotateX(Math.PI / 2);
    const snoutMat = new THREE.MeshStandardMaterial({ color: 0x607d8b });
    const snout = new THREE.Mesh(snoutGeo, snoutMat);
    snout.position.set(0, 0, 3);
    addPart('Snout', snout, 'The pointed front part of the shark, loaded with sensory organs.');

    // 2. Jaw & Teeth
    const jawGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 16, Math.PI);
    jawGeo.rotateX(Math.PI / 2);
    const jawMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const jaw = new THREE.Mesh(jawGeo, jawMat);
    jaw.position.set(0, -0.4, 2);
    addPart('Jaw & Teeth', jaw, 'Rows of sharp teeth designed to grasp and tear prey.');

    // 3. Eye
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(0.6, 0.2, 2.2);
    const eyeR = eyeL.clone();
    eyeR.position.set(-0.6, 0.2, 2.2);
    const eyes = new THREE.Group();
    eyes.add(eyeL, eyeR);
    addPart('Eye', eyes, 'Shark eyes have a tapetum lucidum allowing them to see in dark waters.');

    // 4. Gill Slits
    const gillGeo = new THREE.BoxGeometry(0.05, 0.8, 0.8);
    const gillMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const gills = new THREE.Group();
    for(let i=0; i<5; i++) {
        const gillL = new THREE.Mesh(gillGeo, gillMat);
        gillL.position.set(0.7, 0, 1 - i*0.2);
        const gillR = gillL.clone();
        gillR.position.set(-0.7, 0, 1 - i*0.2);
        gills.add(gillL, gillR);
    }
    addPart('Gill Slits', gills, 'Five to seven slits on each side that extract oxygen from water.');

    // 5. Pectoral Fin
    const pecGeo = new THREE.ConeGeometry(0.5, 2, 3);
    pecGeo.rotateX(Math.PI / 2);
    const pecMat = new THREE.MeshStandardMaterial({ color: 0x546e7a });
    const pecL = new THREE.Mesh(pecGeo, pecMat);
    pecL.rotation.z = -Math.PI / 4;
    pecL.position.set(1.5, -0.5, 0.5);
    const pecR = pecL.clone();
    pecR.rotation.z = Math.PI / 4;
    pecR.position.set(-1.5, -0.5, 0.5);
    const pectoralFins = new THREE.Group();
    pectoralFins.add(pecL, pecR);
    addPart('Pectoral Fin', pectoralFins, 'Lift-generating fins that prevent the shark from sinking.');

    // 6. Dorsal Fin
    const dorsalGeo = new THREE.ConeGeometry(0.5, 1.5, 4);
    const dorsalMat = new THREE.MeshStandardMaterial({ color: 0x546e7a });
    const dorsal = new THREE.Mesh(dorsalGeo, dorsalMat);
    dorsal.position.set(0, 1.2, -0.5);
    addPart('Dorsal Fin', dorsal, 'Provides stability and prevents rolling during swimming.');

    // 7. Pelvic Fin
    const pelvicGeo = new THREE.ConeGeometry(0.3, 1, 3);
    pelvicGeo.rotateX(Math.PI / 2);
    const pelvicMat = new THREE.MeshStandardMaterial({ color: 0x546e7a });
    const pelvL = new THREE.Mesh(pelvicGeo, pelvicMat);
    pelvL.rotation.z = -Math.PI / 6;
    pelvL.position.set(0.5, -0.8, -1.5);
    const pelvR = pelvL.clone();
    pelvR.rotation.z = Math.PI / 6;
    pelvR.position.set(-0.5, -0.8, -1.5);
    const pelvicFins = new THREE.Group();
    pelvicFins.add(pelvL, pelvR);
    addPart('Pelvic Fin', pelvicFins, 'Located ventrally, these fins help with stabilization.');

    // 8. Anal Fin
    const analGeo = new THREE.ConeGeometry(0.2, 0.8, 3);
    const analMat = new THREE.MeshStandardMaterial({ color: 0x546e7a });
    const anal = new THREE.Mesh(analGeo, analMat);
    anal.position.set(0, -0.8, -2.5);
    anal.rotation.x = -Math.PI / 8;
    addPart('Anal Fin', anal, 'Small fin on the ventral side near the tail, adding stability.');

    // 9. Caudal Fin
    const caudalGeo = new THREE.ConeGeometry(0.8, 3, 4);
    caudalGeo.rotateX(Math.PI / 2);
    const caudalMat = new THREE.MeshStandardMaterial({ color: 0x546e7a });
    const caudal = new THREE.Mesh(caudalGeo, caudalMat);
    
    // Add a pivot group for the caudal fin animation
    const caudalPivot = new THREE.Group();
    caudalPivot.position.set(0, 0, -2.5);
    caudal.position.set(0, 0, -1.5); // relative to pivot
    caudalPivot.add(caudal);
    addPart('Caudal Fin', caudalPivot, 'The powerful tail fin responsible for propelling the shark forward.');

    // 10. Lateral Line
    const lateralGeo = new THREE.CylinderGeometry(0.02, 0.02, 5, 8);
    lateralGeo.rotateX(Math.PI / 2);
    const lateralMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const latL = new THREE.Mesh(lateralGeo, lateralMat);
    latL.position.set(0.7, 0, -0.5);
    const latR = latL.clone();
    latR.position.set(-0.7, 0, -0.5);
    const lateralLines = new THREE.Group();
    lateralLines.add(latL, latR);
    addPart('Lateral Line', lateralLines, 'A sensory organ running along the side, detecting pressure changes in water.');

    // Core Body (Connecting everything, not a distinct requested part, so not in parts array)
    const bodyGeo = new THREE.CapsuleGeometry(0.8, 4, 16, 16);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x607d8b });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Animation
    let time = 0;
    const animate = (deltaTime = 0.016) => {
        time += deltaTime;
        // Caudal fin swimming motion
        caudalPivot.rotation.y = Math.sin(time * 5) * 0.4;
        // Shark body sway
        group.position.x = Math.sin(time * 5 - Math.PI/2) * 0.1;
        group.rotation.y = Math.sin(time * 5 - Math.PI/2) * 0.05;
    };

    // Quiz Questions
    const questions = [
        {
            question: 'Which fin is primarily responsible for propelling the shark forward?',
            options: ['Pectoral Fin', 'Caudal Fin', 'Dorsal Fin', 'Pelvic Fin'],
            answer: 'Caudal Fin'
        },
        {
            question: 'What sensory organ allows sharks to detect changes in water pressure?',
            options: ['Snout', 'Lateral Line', 'Gill Slits', 'Tapetum Lucidum'],
            answer: 'Lateral Line'
        },
        {
            question: 'What is the primary function of the Pectoral Fins?',
            options: ['Generating lift', 'Propulsion', 'Chewing', 'Extracting oxygen'],
            answer: 'Generating lift'
        },
        {
            question: 'Which fins are located ventrally and help with stabilization?',
            options: ['Dorsal Fins', 'Gill Slits', 'Pelvic Fins', 'Caudal Fins'],
            answer: 'Pelvic Fins'
        },
        {
            question: 'What helps sharks see in dark waters?',
            options: ['Tapetum Lucidum', 'Lateral Line', 'Echolocation', 'Ampullae of Lorenzini'],
            answer: 'Tapetum Lucidum'
        },
        {
            question: 'How many gill slits do most sharks typically have on each side?',
            options: ['1 to 2', '3 to 4', '5 to 7', '8 to 10'],
            answer: '5 to 7'
        }
    ];

    return {
        model: group,
        parts: parts,
        animate: animate,
        questions: questions
    };
}
