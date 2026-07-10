export function createSpiderAnatomy(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.8 });
    const abdomenMat = new THREE.MeshStandardMaterial({ color: 0x2e251f, roughness: 0.9 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1, metalness: 0.8 });
    const fangMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const venomMat = new THREE.MeshStandardMaterial({ color: 0x88cc88, transparent: true, opacity: 0.8 });
    const silkMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.8 });
    const lungMat = new THREE.MeshStandardMaterial({ color: 0xccaaaa });

    // 1. Cephalothorax
    const cephGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const ceph = new THREE.Mesh(cephGeo, bodyMat);
    ceph.scale.set(1, 0.6, 1.2);
    ceph.position.set(0, 0, 1.5);
    group.add(ceph);
    parts.push({ mesh: ceph, name: "Cephalothorax", description: "The fused head and thorax containing the brain, poison glands, and stomach." });

    // 2. Abdomen
    const abdGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const abd = new THREE.Mesh(abdGeo, abdomenMat);
    abd.scale.set(1, 0.8, 1.4);
    abd.position.set(0, 0.5, -2);
    group.add(abd);
    parts.push({ mesh: abd, name: "Abdomen", description: "The posterior part of the body, containing the heart, reproductive organs, midgut, and silk glands." });

    // 3. Chelicerae
    const fangGroup = new THREE.Group();
    const fangGeo = new THREE.ConeGeometry(0.15, 0.6, 16);
    fangGeo.translate(0, -0.3, 0);
    const leftFang = new THREE.Mesh(fangGeo, fangMat);
    leftFang.position.set(0.4, -0.2, 3.2);
    leftFang.rotation.x = Math.PI / 4;
    const rightFang = new THREE.Mesh(fangGeo, fangMat);
    rightFang.position.set(-0.4, -0.2, 3.2);
    rightFang.rotation.x = Math.PI / 4;
    fangGroup.add(leftFang, rightFang);
    group.add(fangGroup);
    parts.push({ mesh: fangGroup, name: "Chelicerae", description: "The jaws or mouthparts, which end in hollow fangs used to inject venom into prey." });

    // 4. Pedipalps
    const pedipalpGroup = new THREE.Group();
    const palpGeo = new THREE.CylinderGeometry(0.1, 0.05, 1.5);
    palpGeo.translate(0, -0.75, 0);
    const leftPalp = new THREE.Mesh(palpGeo, bodyMat);
    leftPalp.position.set(0.8, -0.2, 3.0);
    leftPalp.rotation.x = Math.PI / 3;
    leftPalp.rotation.z = Math.PI / 8;
    const rightPalp = new THREE.Mesh(palpGeo, bodyMat);
    rightPalp.position.set(-0.8, -0.2, 3.0);
    rightPalp.rotation.x = Math.PI / 3;
    rightPalp.rotation.z = -Math.PI / 8;
    pedipalpGroup.add(leftPalp, rightPalp);
    group.add(pedipalpGroup);
    parts.push({ mesh: pedipalpGroup, name: "Pedipalps", description: "Appendages near the mouth used for sensing, manipulating prey, and in males, transferring sperm." });

    // 5. Eyes
    const eyeGroup = new THREE.Group();
    const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const eyePositions = [
        [0.3, 0.8, 3.0], [-0.3, 0.8, 3.0],
        [0.6, 0.7, 2.8], [-0.6, 0.7, 2.8],
        [0.2, 0.9, 2.7], [-0.2, 0.9, 2.7],
        [0.8, 0.5, 2.6], [-0.8, 0.5, 2.6]
    ];
    eyePositions.forEach(pos => {
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(...pos);
        eyeGroup.add(eye);
    });
    group.add(eyeGroup);
    parts.push({ mesh: eyeGroup, name: "Eyes", description: "Most spiders have eight simple eyes that detect light, motion, and in some species, form images." });

    // 6. Walking Legs
    const legGroup = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(0.08, 0.03, 5);
    legGeo.translate(0, -2.5, 0);
    const legs = [];
    for (let i = 0; i < 8; i++) {
        const leg = new THREE.Mesh(legGeo, bodyMat);
        const side = i % 2 === 0 ? 1 : -1;
        const index = Math.floor(i / 2);
        
        leg.position.set(side * 1.2, 0.2, 2.0 - index * 0.8);
        
        // Spread legs out
        leg.rotation.z = side * (Math.PI / 2 - 0.5);
        // Angle legs forward/backward
        leg.rotation.x = (1.5 - index) * 0.3;
        
        legGroup.add(leg);
        legs.push({ mesh: leg, side, index });
    }
    group.add(legGroup);
    parts.push({ mesh: legGroup, name: "Walking Legs", description: "Eight multi-jointed legs used for locomotion, sensing vibrations, and handling silk." });

    // 7. Spinnerets
    const spinneretGroup = new THREE.Group();
    const spinGeo = new THREE.CylinderGeometry(0.1, 0.2, 0.6);
    spinGeo.translate(0, -0.3, 0);
    const spin1 = new THREE.Mesh(spinGeo, bodyMat);
    spin1.position.set(0.3, 0.2, -4.8);
    spin1.rotation.x = -Math.PI / 4;
    const spin2 = new THREE.Mesh(spinGeo, bodyMat);
    spin2.position.set(-0.3, 0.2, -4.8);
    spin2.rotation.x = -Math.PI / 4;
    spinneretGroup.add(spin1, spin2);
    group.add(spinneretGroup);
    parts.push({ mesh: spinneretGroup, name: "Spinnerets", description: "Organs at the rear of the abdomen that extrude liquid silk, which hardens upon contact with air." });

    // 8. Book Lungs
    const lungGroup = new THREE.Group();
    const lungGeo = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const lung1 = new THREE.Mesh(lungGeo, lungMat);
    lung1.position.set(0.6, -0.3, -1.0);
    lung1.rotation.z = -0.2;
    const lung2 = new THREE.Mesh(lungGeo, lungMat);
    lung2.position.set(-0.6, -0.3, -1.0);
    lung2.rotation.z = 0.2;
    lungGroup.add(lung1, lung2);
    group.add(lungGroup);
    parts.push({ mesh: lungGroup, name: "Book Lungs", description: "Respiratory organs consisting of stacked, page-like tissue layers to maximize gas exchange." });

    // 9. Venom Gland
    const venomGeo = new THREE.CapsuleGeometry(0.2, 0.5, 16, 16);
    const venomGland = new THREE.Mesh(venomGeo, venomMat);
    venomGland.position.set(0, 0.6, 2.5);
    venomGland.rotation.x = Math.PI / 2;
    group.add(venomGland);
    parts.push({ mesh: venomGland, name: "Venom Gland", description: "Glands located in the cephalothorax that produce venom to paralyze or digest prey." });

    // 10. Silk Gland
    const silkGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const silkGland = new THREE.Mesh(silkGeo, silkMat);
    silkGland.scale.set(1, 0.6, 1.8);
    silkGland.position.set(0, 0.8, -2.5);
    group.add(silkGland);
    parts.push({ mesh: silkGland, name: "Silk Gland", description: "Internal abdominal glands that produce the protein fluid spun into silk threads." });

    // Animation Function
    let time = 0;
    function animate() {
        time += 0.05;
        
        // Wiggle walking legs
        legs.forEach(legObj => {
            const { mesh, side, index } = legObj;
            const offset = index * 0.5;
            // Base Z rotation + wobble
            mesh.rotation.z = side * (Math.PI / 2 - 0.5) + Math.sin(time + offset) * 0.05;
            // Base X rotation + walk cycle
            mesh.rotation.x = (1.5 - index) * 0.3 + Math.cos(time + offset) * 0.1;
        });

        // Twitch pedipalps
        leftPalp.rotation.x = Math.PI / 3 + Math.sin(time * 2) * 0.1;
        rightPalp.rotation.x = Math.PI / 3 + Math.sin(time * 2 + Math.PI) * 0.1;
    }

    // 6 Quiz Questions
    const questions = [
        {
            question: "Which of the following describes the Cephalothorax?",
            options: ["The rear body section", "The fused head and thorax", "The silk-producing organ", "The respiratory organ"],
            correctAnswer: 1
        },
        {
            question: "What is the primary function of the Book Lungs?",
            options: ["Digesting food", "Producing venom", "Respiration", "Pumping blood"],
            correctAnswer: 2
        },
        {
            question: "Which appendages are used to inject venom into prey?",
            options: ["Spinnerets", "Pedipalps", "Walking Legs", "Chelicerae"],
            correctAnswer: 3
        },
        {
            question: "What do the Spinnerets do?",
            options: ["Extrude liquid silk", "Digest prey externally", "Sense vibrations in the web", "Store sperm"],
            correctAnswer: 0
        },
        {
            question: "Which internal organ produces the fluid that becomes spider webs?",
            options: ["Venom Gland", "Silk Gland", "Midgut", "Heart"],
            correctAnswer: 1
        },
        {
            question: "What are the Pedipalps primarily used for?",
            options: ["Breathing under water", "Jumping long distances", "Sensing and manipulating prey", "Anchoring silk lines"],
            correctAnswer: 2
        }
    ];

    return {
        group,
        parts,
        animate,
        questions
    };
}
