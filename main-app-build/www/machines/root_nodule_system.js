export function createRootNoduleSystem(THREE) {
    const group = new THREE.Group();

    // 1. Primary Root
    const primaryRootGeom = new THREE.CylinderGeometry(1, 0.5, 20, 16);
    const primaryRootMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
    const primaryRoot = new THREE.Mesh(primaryRootGeom, primaryRootMat);
    primaryRoot.position.y = -10;
    group.add(primaryRoot);

    // 2. Lateral Root
    const lateralRootGeom = new THREE.CylinderGeometry(0.5, 0.2, 10, 16);
    const lateralRootMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
    const lateralRoot = new THREE.Mesh(lateralRootGeom, lateralRootMat);
    lateralRoot.rotation.z = Math.PI / 4;
    lateralRoot.position.set(3, -5, 0);
    group.add(lateralRoot);

    // 3. Root Hair
    const rootHairGeom = new THREE.CylinderGeometry(0.1, 0.05, 3, 8);
    const rootHairMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
    const rootHair = new THREE.Mesh(rootHairGeom, rootHairMat);
    rootHair.rotation.z = Math.PI / 2;
    rootHair.position.set(6, -3, 0);
    group.add(rootHair);

    // 4. Infection Thread
    const threadGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(7.5, -3, 0),
        new THREE.Vector3(6, -3, 0),
        new THREE.Vector3(5, -4, 0),
        new THREE.Vector3(4, -4.5, 0)
    ]), 20, 0.05, 8, false);
    const threadMat = new THREE.MeshStandardMaterial({ color: 0x00FF00, transparent: true, opacity: 0.8 });
    const infectionThread = new THREE.Mesh(threadGeom, threadMat);
    group.add(infectionThread);

    // 5. Mature Nodule
    const noduleGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const noduleMat = new THREE.MeshStandardMaterial({ color: 0xFF9999 }); // Pinkish for leghemoglobin
    const matureNodule = new THREE.Mesh(noduleGeom, noduleMat);
    matureNodule.position.set(3.5, -6, 0);
    group.add(matureNodule);

    // 6. Rhizobia Bacteroids
    const bacteroidsGroup = new THREE.Group();
    const bacGeom = new THREE.CapsuleGeometry(0.1, 0.2, 4, 8);
    const bacMat = new THREE.MeshStandardMaterial({ color: 0x0000FF });
    for (let i = 0; i < 20; i++) {
        const bac = new THREE.Mesh(bacGeom, bacMat);
        bac.position.set(
            3.5 + (Math.random() - 0.5) * 2,
            -6 + (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        bac.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        bacteroidsGroup.add(bac);
    }
    group.add(bacteroidsGroup);

    // 7. Cortex Cells
    const cortexGroup = new THREE.Group();
    const cellGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cellMat = new THREE.MeshStandardMaterial({ color: 0xaaaa55, wireframe: true });
    for (let i = 0; i < 10; i++) {
        const cell = new THREE.Mesh(cellGeom, cellMat);
        cell.position.set(2 + Math.random(), -4 - Math.random() * 4, (Math.random() - 0.5) * 2);
        cortexGroup.add(cell);
    }
    group.add(cortexGroup);

    // 8. Xylem Vessels
    const xylemGeom = new THREE.CylinderGeometry(0.3, 0.3, 20, 8);
    const xylemMat = new THREE.MeshStandardMaterial({ color: 0x00FFFF }); // Blue for water
    const xylem = new THREE.Mesh(xylemGeom, xylemMat);
    xylem.position.y = -10;
    group.add(xylem);

    // 9. Phloem Vessels
    const phloemGeom = new THREE.CylinderGeometry(0.4, 0.4, 20, 8);
    const phloemMat = new THREE.MeshStandardMaterial({ color: 0xFFaa00, transparent: true, opacity: 0.5 }); // Orange for nutrients
    const phloem = new THREE.Mesh(phloemGeom, phloemMat);
    phloem.position.y = -10;
    group.add(phloem);

    // 10. Soil Particles
    const soilGroup = new THREE.Group();
    const soilGeom = new THREE.DodecahedronGeometry(0.4);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x4a3018 });
    for(let i=0; i<50; i++) {
        const particle = new THREE.Mesh(soilGeom, soilMat);
        particle.position.set(
            (Math.random() - 0.5) * 20,
            -2 - Math.random() * 15,
            (Math.random() - 0.5) * 20
        );
        soilGroup.add(particle);
    }
    group.add(soilGroup);

    const parts = [
        { name: "Primary Root", description: "The central, main root that grows downward, providing stability and accessing deep water sources." },
        { name: "Lateral Root", description: "Roots that branch off from the primary root, increasing the surface area for water and nutrient absorption." },
        { name: "Root Hair", description: "Tiny, hair-like extensions of epidermal cells that significantly increase the root's surface area for absorption." },
        { name: "Infection Thread", description: "A tubular structure formed by the plant cell inward from the root hair, allowing Rhizobia to enter the root cortex." },
        { name: "Mature Nodule", description: "A specialized root organ where nitrogen-fixing bacteria reside, appearing pinkish inside due to leghemoglobin." },
        { name: "Rhizobia Bacteroids", description: "The differentiated form of Rhizobia bacteria living inside the nodule cells, actively fixing nitrogen." },
        { name: "Cortex Cells", description: "Unspecialized cells between the epidermis and vascular tissue where the nodule primarily develops." },
        { name: "Xylem Vessels", description: "Vascular tissue responsible for transporting water and dissolved minerals from roots to the rest of the plant." },
        { name: "Phloem Vessels", description: "Vascular tissue that transports sugars and other metabolic products from leaves to the root system and nodules." },
        { name: "Soil Particles", description: "The mineral and organic matter matrix surrounding the root system, containing nutrients and soil microbes." }
    ];

    function animation(time) {
        // Nodule pulsing (breathing/growth effect)
        const scale = 1 + Math.sin(time * 2) * 0.05;
        matureNodule.scale.set(scale, scale, scale);

        // Bacteroids moving inside nodule
        bacteroidsGroup.children.forEach((bac, idx) => {
            bac.position.x += Math.sin(time * 3 + idx) * 0.005;
            bac.position.y += Math.cos(time * 3 + idx) * 0.005;
            bac.rotation.z += 0.05;
        });

        // Flow in xylem (water going up)
        xylemMat.opacity = 0.5 + Math.sin(time * 5) * 0.3;
        
        // Flow in phloem (nutrients going down)
        phloemMat.opacity = 0.5 + Math.cos(time * 4) * 0.3;

        // Infection thread glowing
        threadMat.opacity = 0.4 + Math.sin(time * 6) * 0.4;
    }

    const quizzes = [
        {
            question: "What is the primary function of the root nodule?",
            options: [
                "To store excess water for the plant",
                "To house nitrogen-fixing bacteria",
                "To perform photosynthesis underground",
                "To protect the root from predators"
            ],
            answer: "To house nitrogen-fixing bacteria"
        },
        {
            question: "Through which structure do Rhizobia bacteria initially enter the plant root?",
            options: [
                "Xylem Vessels",
                "Phloem Vessels",
                "Root Hair",
                "Cortex Cells"
            ],
            answer: "Root Hair"
        },
        {
            question: "What is the specialized form of Rhizobia called once they are inside the nodule cells?",
            options: [
                "Infection Thread",
                "Bacteroids",
                "Pathogens",
                "Spores"
            ],
            answer: "Bacteroids"
        },
        {
            question: "Why do healthy, active mature root nodules often have a pinkish interior?",
            options: [
                "Because they contain leghemoglobin",
                "Due to the presence of blood vessels",
                "Because of anthocyanin pigments",
                "It is a sign of fungal infection"
            ],
            answer: "Because they contain leghemoglobin"
        },
        {
            question: "Which plant tissue transports the nitrogen compounds produced in the nodule to the rest of the plant?",
            options: [
                "Phloem Vessels",
                "Xylem Vessels",
                "Epidermis",
                "Cortex Cells"
            ],
            answer: "Xylem Vessels"
        },
        {
            question: "What role does the infection thread play in nodule formation?",
            options: [
                "It transports water from the soil to the root",
                "It serves as a pathway for bacteria to reach cortex cells",
                "It kills harmful soil bacteria",
                "It physically breaks apart soil particles"
            ],
            answer: "It serves as a pathway for bacteria to reach cortex cells"
        }
    ];

    return { group, animation, parts, quizzes };
}
