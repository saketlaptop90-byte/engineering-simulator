export function createTriceratopsSkull(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Rostral bone (Beak) - Cone
    const rostralGeo = new THREE.ConeGeometry(0.5, 1, 4);
    const rostralMat = new THREE.MeshStandardMaterial({ color: 0x8b8989 });
    const rostral = new THREE.Mesh(rostralGeo, rostralMat);
    rostral.position.set(0, -0.5, 3.5);
    rostral.rotation.x = Math.PI / 4;
    rostral.userData = { id: 'rostral_bone', name: 'Rostral bone' };
    parts.push({ id: 'rostral_bone', name: 'Rostral bone', description: 'The bone forming the core of the upper beak, unique to ceratopsians.' });

    // 2. Premaxilla - Box
    const premaxGeo = new THREE.BoxGeometry(0.8, 1, 1);
    const premaxMat = new THREE.MeshStandardMaterial({ color: 0x9c9c9c });
    const premaxilla = new THREE.Mesh(premaxGeo, premaxMat);
    premaxilla.position.set(0, 0, 2.5);
    premaxilla.userData = { id: 'premaxilla', name: 'Premaxilla' };
    parts.push({ id: 'premaxilla', name: 'Premaxilla', description: 'Paired bones of the upper jaw situated in front of the maxillae.' });

    // 3. Maxilla - Box
    const maxGeo = new THREE.BoxGeometry(1, 1.2, 1.5);
    const maxMat = new THREE.MeshStandardMaterial({ color: 0xa9a9a9 });
    const maxilla = new THREE.Mesh(maxGeo, maxMat);
    maxilla.position.set(0, 0, 1.2);
    maxilla.userData = { id: 'maxilla', name: 'Maxilla' };
    parts.push({ id: 'maxilla', name: 'Maxilla', description: 'The main upper jawbone containing most of the upper teeth.' });

    // 4. Nasal horn core - Cone
    const nasalHornGeo = new THREE.ConeGeometry(0.3, 1.2, 8);
    const nasalHornMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const nasalHorn = new THREE.Mesh(nasalHornGeo, nasalHornMat);
    nasalHorn.position.set(0, 1.2, 2.5);
    nasalHorn.rotation.x = -Math.PI / 8;
    nasalHorn.userData = { id: 'nasal_horn', name: 'Nasal horn core' };
    parts.push({ id: 'nasal_horn', name: 'Nasal horn core', description: 'The bony core of the single horn on the snout.' });

    // 5. Brow horn cores - Box acting as base, with cones for horns
    const browBaseGeo = new THREE.BoxGeometry(1.2, 0.5, 0.8);
    const browMat = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
    const browHorns = new THREE.Mesh(browBaseGeo, browMat);
    browHorns.position.set(0, 1.5, 0.5);
    browHorns.userData = { id: 'brow_horns', name: 'Brow horn cores' };
    
    const browGeo = new THREE.ConeGeometry(0.4, 3, 8);
    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(0.5, 1, 0);
    leftBrow.rotation.x = -Math.PI / 4;
    leftBrow.rotation.z = -Math.PI / 8;

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(-0.5, 1, 0);
    rightBrow.rotation.x = -Math.PI / 4;
    rightBrow.rotation.z = Math.PI / 8;

    browHorns.add(leftBrow, rightBrow);
    parts.push({ id: 'brow_horns', name: 'Brow horn cores', description: 'The large paired bony cores of the horns situated above the eyes.' });

    // 6. Parietal-squamosal frill - Cylinder segment
    const frillGeo = new THREE.CylinderGeometry(2.5, 1.5, 0.5, 16);
    const frillMat = new THREE.MeshStandardMaterial({ color: 0xb0b0b0 });
    const frill = new THREE.Mesh(frillGeo, frillMat);
    frill.position.set(0, 1.5, -1.5);
    frill.rotation.x = Math.PI / 3;
    frill.userData = { id: 'frill', name: 'Parietal-squamosal frill' };
    parts.push({ id: 'frill', name: 'Parietal-squamosal frill', description: 'The large bony shield extending from the back of the skull.' });

    // 7. Epoccipitals - Torus lining the frill
    const epGeo = new THREE.TorusGeometry(2.6, 0.15, 8, 16, Math.PI);
    const epMat = new THREE.MeshStandardMaterial({ color: 0x8f8f8f });
    const epoccipitals = new THREE.Mesh(epGeo, epMat);
    epoccipitals.position.set(0, 1.5, -1.5);
    epoccipitals.rotation.x = Math.PI / 3;
    epoccipitals.rotation.z = Math.PI;
    epoccipitals.userData = { id: 'epoccipitals', name: 'Epoccipitals' };
    parts.push({ id: 'epoccipitals', name: 'Epoccipitals', description: 'Small bony ossifications lining the edge of the ceratopsian frill.' });

    // 8. Occipital condyle - Sphere
    const condyleGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const condyleMat = new THREE.MeshStandardMaterial({ color: 0x7a7a7a });
    const condyle = new THREE.Mesh(condyleGeo, condyleMat);
    condyle.position.set(0, -0.2, -0.5);
    condyle.userData = { id: 'occipital_condyle', name: 'Occipital condyle' };
    parts.push({ id: 'occipital_condyle', name: 'Occipital condyle', description: 'The rounded knob at the base of the skull that articulates with the first vertebra.' });

    // 9. Jugal bone - Box base with cones for flares
    const jugalBaseGeo = new THREE.BoxGeometry(2.4, 0.5, 0.5);
    const jugalMat = new THREE.MeshStandardMaterial({ color: 0x9b9b9b });
    const jugal = new THREE.Mesh(jugalBaseGeo, jugalMat);
    jugal.position.set(0, -0.5, 0.5);
    jugal.userData = { id: 'jugal', name: 'Jugal bone' };

    const jugalGeo = new THREE.ConeGeometry(0.6, 1.5, 4);
    const leftJugal = new THREE.Mesh(jugalGeo, jugalMat);
    leftJugal.position.set(1.2, 0, 0);
    leftJugal.rotation.z = Math.PI / 4;

    const rightJugal = new THREE.Mesh(jugalGeo, jugalMat);
    rightJugal.position.set(-1.2, 0, 0);
    rightJugal.rotation.z = -Math.PI / 4;
    jugal.add(leftJugal, rightJugal);
    parts.push({ id: 'jugal', name: 'Jugal bone', description: 'The "cheek" bone that forms the lower margin of the eye socket and flared cheek.' });

    // 10. Dentary - Box
    const dentaryGeo = new THREE.BoxGeometry(0.9, 0.8, 2.5);
    const dentaryMat = new THREE.MeshStandardMaterial({ color: 0xa9a9a9 });
    const dentary = new THREE.Mesh(dentaryGeo, dentaryMat);
    dentary.position.set(0, -1.2, 1.5);
    dentary.userData = { id: 'dentary', name: 'Dentary' };
    parts.push({ id: 'dentary', name: 'Dentary', description: 'The main tooth-bearing bone of the lower jaw.' });

    // Assemble skull to a neck pivot
    const neckPivot = new THREE.Group();
    neckPivot.position.set(0, -0.2, -0.5); // Center around Occipital condyle
    
    // Position parts relative to neck pivot
    rostral.position.sub(neckPivot.position);
    premaxilla.position.sub(neckPivot.position);
    maxilla.position.sub(neckPivot.position);
    nasalHorn.position.sub(neckPivot.position);
    browHorns.position.sub(neckPivot.position);
    frill.position.sub(neckPivot.position);
    epoccipitals.position.sub(neckPivot.position);
    condyle.position.sub(neckPivot.position);
    jugal.position.sub(neckPivot.position);
    dentary.position.sub(neckPivot.position);

    neckPivot.add(rostral, premaxilla, maxilla, nasalHorn, browHorns, frill, epoccipitals, condyle, jugal, dentary);
    group.add(neckPivot);

    const animation = {
        update(time) {
            // Defensive posture: dipping the head down to display horns and frill
            // Sine wave to make it slowly dip and raise
            const angle = Math.sin(time * 2) * (Math.PI / 8) - (Math.PI / 8);
            neckPivot.rotation.x = angle;
        }
    };

    const quiz = [
        {
            question: "Which unique bone forms the upper beak of ceratopsian dinosaurs?",
            options: ["Premaxilla", "Rostral bone", "Maxilla", "Dentary"],
            correctAnswer: "Rostral bone",
            explanation: "The rostral bone is a unique midline bone found only in ceratopsians, forming the core of the upper beak."
        },
        {
            question: "Which of the following bones form the iconic frill of Triceratops?",
            options: ["Parietal and squamosal", "Frontal and parietal", "Squamosal and jugal", "Nasal and premaxilla"],
            correctAnswer: "Parietal and squamosal",
            explanation: "The large frill extending from the back of the skull is composed primarily of the parietal and squamosal bones."
        },
        {
            question: "What is the function of the occipital condyle?",
            options: ["It anchors the lower jaw", "It forms the base of the nasal horn", "It articulates the skull with the first vertebra of the neck", "It provides attachment for chewing muscles"],
            correctAnswer: "It articulates the skull with the first vertebra of the neck",
            explanation: "The occipital condyle is the ball-like joint at the back of the skull that connects to the atlas, the first cervical vertebra."
        },
        {
            question: "Which small bony ossifications line the margin of the ceratopsian frill?",
            options: ["Osteoderms", "Epoccipitals", "Jugal bosses", "Sclerotic rings"],
            correctAnswer: "Epoccipitals",
            explanation: "Epoccipitals are the small, often triangular bones that developed along the edge of the squamosal and parietal bones on the frill."
        },
        {
            question: "Which bone in the skull bears the distinctive 'brow horns'?",
            options: ["Nasal", "Frontal / Postorbital", "Premaxilla", "Jugal"],
            correctAnswer: "Frontal / Postorbital",
            explanation: "The large brow horns are generally considered outgrowths of the postorbital bones situated above the eyes."
        },
        {
            question: "What bone is commonly referred to as the 'cheek bone' in dinosaurs, which in Triceratops forms a pointed flare?",
            options: ["Squamosal", "Quadrate", "Dentary", "Jugal"],
            correctAnswer: "Jugal",
            explanation: "The jugal bone forms the lower edge of the orbit and the distinctive cheek flare in many ceratopsians."
        }
    ];

    return { group, parts, animation, quiz };
}
