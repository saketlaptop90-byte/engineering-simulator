export function createISSSpaceStation(THREE) {
    const group = new THREE.Group();

    const materialSilver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 });
    const materialWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const materialBlue = new THREE.MeshStandardMaterial({ color: 0x113388, metalness: 0.3, roughness: 0.2 });
    const materialDark = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const setPartData = (part, id, name) => {
        part.userData = { id, name };
        part.traverse((child) => {
            if (child.isMesh) {
                child.userData = { id, name };
            }
        });
        group.add(part);
    };

    // 1. Zarya Module
    const zarya = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 16), materialSilver);
    zarya.rotation.x = Math.PI / 2;
    zarya.position.z = -2;
    setPartData(zarya, 'zarya_module', 'Zarya Module');

    // 2. Unity Node
    const unity = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2, 16), materialWhite);
    unity.rotation.x = Math.PI / 2;
    unity.position.z = 1;
    setPartData(unity, 'unity_node', 'Unity Node');

    // 3. Destiny Laboratory
    const destiny = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3.5, 16), materialSilver);
    destiny.rotation.x = Math.PI / 2;
    destiny.position.z = 3.75;
    setPartData(destiny, 'destiny_lab', 'Destiny Laboratory');

    // 4. Solar Arrays
    const solarArrays = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(16, 0.1, 4);
    const p1 = new THREE.Mesh(panelGeo, materialBlue); p1.position.set(9, 0, 0);
    const p2 = new THREE.Mesh(panelGeo, materialBlue); p2.position.set(-9, 0, 0);
    solarArrays.add(p1, p2);
    const trussGeo = new THREE.CylinderGeometry(0.2, 0.2, 18, 8);
    const truss = new THREE.Mesh(trussGeo, materialSilver);
    truss.rotation.z = Math.PI / 2;
    solarArrays.add(truss);
    solarArrays.position.set(0, 0, -2);
    setPartData(solarArrays, 'solar_arrays', 'Solar Arrays');

    // 5. Radiators
    const radiators = new THREE.Group();
    const radGeo = new THREE.BoxGeometry(6, 0.1, 2);
    const r1 = new THREE.Mesh(radGeo, materialWhite); r1.position.set(3, -1.5, 0); r1.rotation.x = Math.PI / 2;
    const r2 = new THREE.Mesh(radGeo, materialWhite); r2.position.set(-3, -1.5, 0); r2.rotation.x = Math.PI / 2;
    radiators.add(r1, r2);
    radiators.position.set(0, 0, -2);
    setPartData(radiators, 'radiators', 'Radiators');

    // 6. Canadarm2
    const canadarm = new THREE.Group();
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 8), materialWhite);
    arm1.position.set(0, 1, 0);
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 8), materialWhite);
    arm2.position.set(0, 2, 0.8);
    arm2.rotation.x = Math.PI / 4;
    canadarm.add(arm1, arm2);
    canadarm.position.set(0, 0.9, 3);
    setPartData(canadarm, 'canadarm2', 'Canadarm2');

    // 7. Cupola
    const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), materialDark);
    cupola.rotation.x = Math.PI; 
    cupola.position.set(0, -0.9, 1);
    setPartData(cupola, 'cupola', 'Cupola');

    // 8. Kibo Module
    const kibo = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.5, 16), materialSilver);
    kibo.rotation.z = Math.PI / 2;
    kibo.position.set(2.25, 0, 1);
    setPartData(kibo, 'kibo_module', 'Kibo Module');

    // 9. Columbus Module
    const columbus = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.5, 16), materialWhite);
    columbus.rotation.z = Math.PI / 2;
    columbus.position.set(-2.25, 0, 1);
    setPartData(columbus, 'columbus_module', 'Columbus Module');

    // 10. Docking Ports
    const docking = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 16), materialDark);
    docking.position.set(0, 0, 5.5);
    setPartData(docking, 'docking_ports', 'Docking Ports');

    // Animation
    group.update = function(delta) {
        // Solar arrays rotate to track the sun over time
        solarArrays.rotation.x += delta * 0.2;
    };

    // Quizzes
    group.quizzes = [
        {
            question: "Which module provides the main control and propulsion for the ISS early in its assembly?",
            options: ["Unity Node", "Zarya Module", "Destiny Laboratory", "Kibo Module"],
            answer: 1
        },
        {
            question: "What is the primary function of the large blue panels on the ISS?",
            options: ["Heat dissipation", "Communication", "Solar power generation", "Shielding from micro-meteoroids"],
            answer: 2
        },
        {
            question: "Which component is a robotic arm used to move equipment and astronauts around the station?",
            options: ["Canadarm2", "Cupola", "Columbus Module", "Unity Node"],
            answer: 0
        },
        {
            question: "What is the Cupola primarily used for?",
            options: ["Sleeping quarters", "Observation and controlling the robotic arm", "Storing scientific samples", "Docking spacecraft"],
            answer: 1
        },
        {
            question: "Which module is the Japanese Experiment Module?",
            options: ["Zarya", "Columbus", "Kibo", "Destiny"],
            answer: 2
        },
        {
            question: "What is the purpose of the white radiators on the ISS?",
            options: ["Generate power", "Radiate excess heat into space", "Provide thrust", "House astronauts"],
            answer: 1
        }
    ];

    return group;
}
