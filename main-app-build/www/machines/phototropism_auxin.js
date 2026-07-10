export function createPhototropismAuxin(THREE) {
    const group = new THREE.Group();

    // 1. Shoot Apex
    const apexGeometry = new THREE.ConeGeometry(2, 4, 16);
    const apexMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const shootApex = new THREE.Mesh(apexGeometry, apexMaterial);
    shootApex.position.y = 8;
    group.add(shootApex);

    // 2. Light Source
    const lightGeometry = new THREE.SphereGeometry(1, 16, 16);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const lightSource = new THREE.Mesh(lightGeometry, lightMaterial);
    lightSource.position.set(10, 15, 0);
    group.add(lightSource);

    // 3. Phototropin Receptor
    const receptorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const receptorMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const phototropinReceptor = new THREE.Mesh(receptorGeometry, receptorMaterial);
    phototropinReceptor.position.set(1.5, 8, 0);
    phototropinReceptor.rotation.z = Math.PI / 4;
    group.add(phototropinReceptor);

    // 4. Auxin Molecule
    const auxinGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const auxinMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const auxinMolecule = new THREE.Mesh(auxinGeometry, auxinMaterial);
    auxinMolecule.position.set(0, 8, 0);
    group.add(auxinMolecule);

    // 5. Shaded Side Cells
    const shadedGeometry = new THREE.BoxGeometry(1.5, 6, 1.5);
    const shadedMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const shadedSideCells = new THREE.Mesh(shadedGeometry, shadedMaterial);
    shadedSideCells.position.set(-1, 3, 0);
    group.add(shadedSideCells);

    // 6. Illuminated Side Cells
    const illuminatedGeometry = new THREE.BoxGeometry(1.5, 6, 1.5);
    const illuminatedMaterial = new THREE.MeshStandardMaterial({ color: 0x32cd32 });
    const illuminatedSideCells = new THREE.Mesh(illuminatedGeometry, illuminatedMaterial);
    illuminatedSideCells.position.set(1, 3, 0);
    group.add(illuminatedSideCells);

    // 7. Cell Wall
    const wallGeometry = new THREE.CylinderGeometry(2, 2, 6, 16, 1, true);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, side: THREE.DoubleSide });
    const cellWall = new THREE.Mesh(wallGeometry, wallMaterial);
    cellWall.position.y = 3;
    group.add(cellWall);

    // 8. Proton Pump
    const pumpGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const pumpMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const protonPump = new THREE.Mesh(pumpGeometry, pumpMaterial);
    protonPump.position.set(-1.5, 3, 0.75);
    group.add(protonPump);

    // 9. Expansin Protein
    const expansinGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const expansinMaterial = new THREE.MeshStandardMaterial({ color: 0x800080 });
    const expansinProtein = new THREE.Mesh(expansinGeometry, expansinMaterial);
    expansinProtein.position.set(-2, 3, 0);
    group.add(expansinProtein);

    // 10. Elongating Cell
    const elongatingGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
    const elongatingMaterial = new THREE.MeshStandardMaterial({ color: 0x00fa9a });
    const elongatingCell = new THREE.Mesh(elongatingGeometry, elongatingMaterial);
    elongatingCell.position.set(-1, 5, 0);
    group.add(elongatingCell);

    let time = 0;

    function animate(delta) {
        time += delta;

        // Animate Light Source pulsating
        const scale = 1 + 0.1 * Math.sin(time * 5);
        lightSource.scale.set(scale, scale, scale);

        // Animate Auxin moving from illuminated side to shaded side
        const t = (Math.sin(time) + 1) / 2; // 0 to 1
        auxinMolecule.position.x = 1 - 2 * t; 
        auxinMolecule.position.y = 8 - 4 * t;

        // Animate Elongating Cell stretching
        const stretch = 1 + 0.5 * t;
        elongatingCell.scale.y = stretch;
        elongatingCell.position.y = 5 + (stretch - 1);
        
        // Shoot bending towards the light (x positive)
        const bend = t * 0.2;
        shootApex.rotation.z = -bend;
        cellWall.rotation.z = -bend * 0.5;
        
        // Phototropin rotating
        phototropinReceptor.rotation.y += delta;
        
        // Proton pump moving
        protonPump.rotation.x += delta * 2;
    }

    return { group, animate };
}

export const quiz = [
    {
        question: "What is the primary role of phototropins in phototropism?",
        options: [
            "To synthesize auxin",
            "To act as photoreceptors for blue light",
            "To transport water",
            "To break down cell walls"
        ],
        answer: "To act as photoreceptors for blue light"
    },
    {
        question: "Which side of the plant stem accumulates a higher concentration of auxin during phototropism?",
        options: [
            "The illuminated side",
            "The shaded side",
            "Both sides equally",
            "The root tip"
        ],
        answer: "The shaded side"
    },
    {
        question: "What effect does increased auxin concentration have on the cells in the stem?",
        options: [
            "It inhibits cell division",
            "It causes cells to shrink",
            "It promotes cell elongation",
            "It decreases water uptake"
        ],
        answer: "It promotes cell elongation"
    },
    {
        question: "What is the role of proton pumps in the acid growth hypothesis?",
        options: [
            "They pump protons into the cell wall, lowering its pH",
            "They pump protons out of the cell wall, raising its pH",
            "They synthesize cellulose",
            "They transport auxin across the membrane"
        ],
        answer: "They pump protons into the cell wall, lowering its pH"
    },
    {
        question: "Which proteins are activated by the acidic environment in the cell wall?",
        options: [
            "Phototropins",
            "Expansins",
            "Kinases",
            "Ligases"
        ],
        answer: "Expansins"
    },
    {
        question: "What is the ultimate result of auxin redistribution in a stem exposed to directional light?",
        options: [
            "The stem bends away from the light",
            "The stem bends towards the light",
            "The stem stops growing",
            "The stem grows straight up"
        ],
        answer: "The stem bends towards the light"
    }
];
