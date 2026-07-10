export function createMedicalLinearAccelerator(THREE) {
    const machine = new THREE.Group();

    // Materials
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.3, roughness: 0.6 });
    const metallicMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x2244aa, metalness: 0.5, roughness: 0.5 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.2 });
    const tungstenMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.4 });
    const couchMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.8 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.4, roughness: 0.5 });
    
    // Group for rotating gantry parts
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(0, 5, 0); // Center of rotation
    machine.add(gantryGroup);

    // 1. Gantry (Main rotating body)
    const gantryGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const gantry = new THREE.Mesh(gantryGeo, casingMat);
    gantry.rotation.z = Math.PI / 2;
    gantry.position.set(2, 0, 0);
    gantryGroup.add(gantry);

    const gantryHeadGeo = new THREE.BoxGeometry(2.5, 3, 2.5);
    const gantryHead = new THREE.Mesh(gantryHeadGeo, casingMat);
    gantryHead.position.set(0, -3, 0);
    gantryGroup.add(gantryHead);

    // 2. Electron Gun
    const electronGunGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const electronGun = new THREE.Mesh(electronGunGeo, metallicMat);
    electronGun.position.set(3, 0, 0);
    electronGun.rotation.z = Math.PI / 2;
    gantryGroup.add(electronGun);

    // 3. Waveguide
    const waveguideGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const waveguide = new THREE.Mesh(waveguideGeo, copperMat);
    waveguide.position.set(1, 0, 0);
    waveguide.rotation.z = Math.PI / 2;
    gantryGroup.add(waveguide);

    // 4. Bending Magnet
    const bendingMagnetGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 32, Math.PI);
    const bendingMagnet = new THREE.Mesh(bendingMagnetGeo, blueMat);
    bendingMagnet.position.set(-0.5, -0.8, 0);
    bendingMagnet.rotation.z = Math.PI / 2;
    gantryGroup.add(bendingMagnet);

    // 5. Target (Tungsten target for X-ray generation)
    const targetGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const target = new THREE.Mesh(targetGeo, tungstenMat);
    target.position.set(0, -1.8, 0);
    gantryGroup.add(target);

    // 6. Flattening Filter
    const filterGeo = new THREE.ConeGeometry(0.3, 0.4, 16);
    const flatteningFilter = new THREE.Mesh(filterGeo, metallicMat);
    flatteningFilter.position.set(0, -2.2, 0);
    gantryGroup.add(flatteningFilter);

    // 7. Collimator (Primary)
    const collimatorGeo = new THREE.BoxGeometry(1.2, 0.5, 1.2);
    const collimator = new THREE.Mesh(collimatorGeo, tungstenMat);
    collimator.position.set(0, -2.8, 0);
    gantryGroup.add(collimator);

    // 8. Multi-Leaf Collimator (MLC)
    const mlcGroup = new THREE.Group();
    mlcGroup.position.set(0, -3.5, 0);
    for (let i = 0; i < 10; i++) {
        const leafGeo = new THREE.BoxGeometry(0.8, 0.4, 0.1);
        const leaf1 = new THREE.Mesh(leafGeo, tungstenMat);
        leaf1.position.set(-0.5 + Math.random()*0.2, 0, -0.45 + i*0.1);
        const leaf2 = new THREE.Mesh(leafGeo, tungstenMat);
        leaf2.position.set(0.5 - Math.random()*0.2, 0, -0.45 + i*0.1);
        mlcGroup.add(leaf1);
        mlcGroup.add(leaf2);
    }
    gantryGroup.add(mlcGroup);

    // 9. Imaging Panel (EPID - Electronic Portal Imaging Device)
    const imagingPanelGeo = new THREE.BoxGeometry(3, 0.2, 3);
    const imagingPanel = new THREE.Mesh(imagingPanelGeo, panelMat);
    imagingPanel.position.set(0, 4, 0); // Opposite to the head
    gantryGroup.add(imagingPanel);
    
    // Support Stand for Gantry
    const standGeo = new THREE.BoxGeometry(2, 6, 4);
    const stand = new THREE.Mesh(standGeo, casingMat);
    stand.position.set(4, 2, 0);
    machine.add(stand);

    // 10. Treatment Couch
    const couchGroup = new THREE.Group();
    couchGroup.position.set(0, 1.5, 0);
    machine.add(couchGroup);

    const couchBaseGeo = new THREE.CylinderGeometry(0.8, 1, 1.5, 32);
    const couchBase = new THREE.Mesh(couchBaseGeo, casingMat);
    couchBase.position.set(0, -0.75, 4);
    couchGroup.add(couchBase);

    const couchTopGeo = new THREE.BoxGeometry(1.5, 0.2, 6);
    const couchTop = new THREE.Mesh(couchTopGeo, couchMat);
    couchTop.position.set(0, 0, 1.5);
    couchGroup.add(couchTop);

    machine.parts = [
        { name: "Gantry", description: "The main rotating body of the LINAC that revolves around the patient." },
        { name: "Electron Gun", description: "Generates electrons and injects them into the waveguide." },
        { name: "Waveguide", description: "Accelerates the electrons using microwave RF fields." },
        { name: "Bending Magnet", description: "Redirects the high-energy electron beam towards the patient." },
        { name: "Target", description: "A high-Z material (usually tungsten) that produces X-rays when struck by the electron beam." },
        { name: "Flattening Filter", description: "Makes the X-ray beam intensity uniform across the field." },
        { name: "Collimator", description: "Shapes the initial boundaries of the radiation beam." },
        { name: "Multi-Leaf Collimator", description: "Consists of individual leaves that precisely shape the beam to match the tumor profile." },
        { name: "Imaging Panel", description: "Captures X-ray images exiting the patient for position verification (EPID)." },
        { name: "Treatment Couch", description: "A robotic table that positions the patient accurately at the isocenter." }
    ];

    machine.animation = (time) => {
        // Rotate the gantry around the isocenter slowly
        gantryGroup.rotation.z = time * 0.2;
    };

    machine.quiz = [
        {
            question: "What is the primary function of the Electron Gun in a LINAC?",
            options: [
                "To accelerate electrons to the speed of light",
                "To generate and inject electrons into the waveguide",
                "To produce X-rays",
                "To bend the electron beam"
            ],
            answer: 1
        },
        {
            question: "Which component is responsible for accelerating the electrons?",
            options: [
                "Bending Magnet",
                "Electron Gun",
                "Waveguide",
                "Collimator"
            ],
            answer: 2
        },
        {
            question: "What material is typically used for the target to produce X-rays?",
            options: [
                "Copper",
                "Aluminum",
                "Tungsten",
                "Lead"
            ],
            answer: 2
        },
        {
            question: "What does the Flattening Filter do?",
            options: [
                "Filters out low-energy electrons",
                "Shapes the beam to the tumor's exact outline",
                "Makes the X-ray beam intensity uniform",
                "Bends the beam 270 degrees"
            ],
            answer: 2
        },
        {
            question: "Which part provides the most precise conformal shaping of the radiation beam?",
            options: [
                "Primary Collimator",
                "Multi-Leaf Collimator (MLC)",
                "Waveguide",
                "Imaging Panel"
            ],
            answer: 1
        },
        {
            question: "What is the purpose of the Bending Magnet in the LINAC head?",
            options: [
                "To direct the horizontal electron beam vertically towards the patient",
                "To separate X-rays from electrons",
                "To keep the patient stationary on the couch",
                "To capture images of the patient"
            ],
            answer: 0
        }
    ];

    return machine;
}
