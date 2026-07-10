export function createPhloemTransport(THREE) {
    const group = new THREE.Group();

    // 1. Source Cell (Leaf cell producing sucrose)
    const sourceCellGeo = new THREE.BoxGeometry(2, 2, 2);
    const sourceCellMat = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green
    const sourceCell = new THREE.Mesh(sourceCellGeo, sourceCellMat);
    sourceCell.position.set(-4, 4, 0);
    sourceCell.name = 'Source Cell';
    group.add(sourceCell);

    // 2. Companion Cell (Source side)
    const companionGeo = new THREE.BoxGeometry(1, 2, 2);
    const companionMat = new THREE.MeshStandardMaterial({ color: 0x32CD32 }); // Light green
    const companionCell = new THREE.Mesh(companionGeo, companionMat);
    companionCell.position.set(-2.5, 4, 0);
    companionCell.name = 'Companion Cell';
    group.add(companionCell);

    // 3. Sieve Tube Element (The main channel)
    const sieveTubeGeo = new THREE.CylinderGeometry(1, 1, 8, 16);
    const sieveTubeMat = new THREE.MeshStandardMaterial({ color: 0x87CEFA, transparent: true, opacity: 0.6 }); // Light blue, semi-transparent
    const sieveTube = new THREE.Mesh(sieveTubeGeo, sieveTubeMat);
    sieveTube.position.set(0, 0, 0);
    sieveTube.name = 'Sieve Tube Element';
    group.add(sieveTube);

    // 4. Sieve Plate (Porous wall between sieve elements)
    const sievePlateGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.2, 16);
    const sievePlateMat = new THREE.MeshStandardMaterial({ color: 0xDAA520 }); // Golden rod
    const sievePlate = new THREE.Mesh(sievePlateGeo, sievePlateMat);
    sievePlate.position.set(0, 0, 0);
    sievePlate.name = 'Sieve Plate';
    group.add(sievePlate);

    // 5. Plasmodesmata (Channels connecting cells)
    const plasmodesmataGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const plasmodesmataMat = new THREE.MeshStandardMaterial({ color: 0xFFFF00 }); // Yellow
    const plasmodesmataGroup = new THREE.Group();
    
    const plasmodesmata1 = new THREE.Mesh(plasmodesmataGeo, plasmodesmataMat);
    plasmodesmata1.rotation.z = Math.PI / 2;
    plasmodesmata1.position.set(-3.25, 4, 0);
    plasmodesmataGroup.add(plasmodesmata1);
    
    const plasmodesmata2 = new THREE.Mesh(plasmodesmataGeo, plasmodesmataMat);
    plasmodesmata2.rotation.z = Math.PI / 2;
    plasmodesmata2.position.set(-1.5, 4, 0);
    plasmodesmataGroup.add(plasmodesmata2);
    
    plasmodesmataGroup.name = 'Plasmodesmata';
    group.add(plasmodesmataGroup);

    // 6. Sucrose Molecule (Representing the sugar being transported)
    const sucroseGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const sucroseMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White
    const sucroseGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const sucrose = new THREE.Mesh(sucroseGeo, sucroseMat);
        sucroseGroup.add(sucrose);
    }
    sucroseGroup.name = 'Sucrose Molecule';
    group.add(sucroseGroup);

    // 7. Water Flow from Xylem (Water entering the sieve tube due to osmosis)
    const waterFlowGeo = new THREE.ConeGeometry(0.3, 1, 8);
    const waterFlowMat = new THREE.MeshStandardMaterial({ color: 0x0000FF }); // Blue
    const waterFlow = new THREE.Mesh(waterFlowGeo, waterFlowMat);
    waterFlow.position.set(2, 3, 0);
    waterFlow.rotation.z = Math.PI / 2;
    waterFlow.name = 'Water Flow from Xylem';
    group.add(waterFlow);

    // 8. Pressure Gradient (Visual indicator of pressure)
    const pressureGeo = new THREE.PlaneGeometry(1, 8);
    const pressureMat = new THREE.MeshBasicMaterial({ color: 0xFF6347, side: THREE.DoubleSide }); // Tomato
    const pressureIndicator = new THREE.Mesh(pressureGeo, pressureMat);
    pressureIndicator.position.set(1.5, 0, 0);
    pressureIndicator.name = 'Pressure Gradient';
    group.add(pressureIndicator);

    // 9. Sink Cell (Root or fruit receiving sucrose)
    const sinkGeo = new THREE.BoxGeometry(2, 2, 2);
    const sinkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Saddle brown
    const sinkCell = new THREE.Mesh(sinkGeo, sinkMat);
    sinkCell.position.set(-4, -4, 0);
    sinkCell.name = 'Sink Cell';
    group.add(sinkCell);

    // 10. Starch Storage (Converted sucrose in sink cell)
    const starchGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const starchMat = new THREE.MeshStandardMaterial({ color: 0xFFD700 }); // Gold
    const starchStorage = new THREE.Mesh(starchGeo, starchMat);
    starchStorage.position.set(-4, -4, 0);
    starchStorage.name = 'Starch Storage';
    group.add(starchStorage);

    let time = 0;

    function animate(delta) {
        time += delta;

        // Animate sucrose molecules moving from Source -> Companion -> Sieve -> Sink
        sucroseGroup.children.forEach((sucrose, index) => {
            const offset = index * 2.0;
            let t = (time * 0.5 + offset) % 8; // Cycle from 0 to 8

            if (t < 2) {
                // Move from Source to Sieve Tube (-4, 4) to (0, 4)
                const progress = t / 2;
                sucrose.position.set(-4 + progress * 4, 4, 0);
            } else if (t < 6) {
                // Move down Sieve Tube (0, 4) to (0, -4)
                const progress = (t - 2) / 4;
                sucrose.position.set(0, 4 - progress * 8, 0);
            } else {
                // Move from Sieve Tube to Sink Cell (0, -4) to (-4, -4)
                const progress = (t - 6) / 2;
                sucrose.position.set(0 - progress * 4, -4, 0);
            }
        });

        // Animate Water Flow arrow pulsing
        waterFlow.position.x = 2 + Math.sin(time * 5) * 0.2;

        // Animate pressure indicator
        pressureIndicator.scale.y = 1 + Math.sin(time) * 0.1;
    }

    return { group, animate };
}

export const quiz = [
    {
        question: "What is the primary function of the phloem in plants?",
        options: [
            "Transporting water and minerals from roots to leaves",
            "Transporting sugars and organic compounds from sources to sinks",
            "Storing excess starch and lipids",
            "Providing structural support to the stem"
        ],
        answer: 1
    },
    {
        question: "According to the pressure-flow hypothesis, what drives the movement of phloem sap?",
        options: [
            "Capillary action and transpiration pull",
            "A pressure gradient established by active transport of solutes and osmosis",
            "Gravity pulling heavy sucrose molecules downward",
            "Cytoplasmic streaming within individual cells"
        ],
        answer: 1
    },
    {
        question: "What role do companion cells play in phloem transport?",
        options: [
            "They are the main tubes through which sap flows",
            "They actively load and unload sucrose into and out of sieve tube elements",
            "They provide a waterproof barrier around the phloem",
            "They synthesize water for osmosis"
        ],
        answer: 1
    },
    {
        question: "Why does water enter the sieve tube elements at the source?",
        options: [
            "Due to the high concentration of sucrose lowering the water potential, causing osmosis from the xylem",
            "Due to active transport pumps moving water molecules",
            "Because of the vacuum created by transpiration in the leaves",
            "Due to the absence of sieve plates allowing free water flow"
        ],
        answer: 0
    },
    {
        question: "What is a 'sink' in the context of phloem transport?",
        options: [
            "A mature leaf producing excess photosynthate",
            "An area of the plant where sugars are used or stored, such as roots or growing fruits",
            "The point where water exits the plant through stomata",
            "The dead cells forming the wood of the tree"
        ],
        answer: 1
    },
    {
        question: "What structure allows the movement of materials between the companion cell and the sieve tube element?",
        options: [
            "Stomata",
            "Lenticels",
            "Plasmodesmata",
            "Casparian strip"
        ],
        answer: 2
    }
];
