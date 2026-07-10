export function createSteamCrackingFurnace(THREE) {
    const machine = new THREE.Group();
    machine.userData.parts = [];

    // Helper function to create parts
    function createPart(name, geometry, material, position, parent = machine) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.userData.name = name;
        parent.add(mesh);
        machine.userData.parts.push(mesh);
        return mesh;
    }

    // Materials
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.5 });
    const hotMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff2200, emissiveIntensity: 0.5 });
    const blueFlameMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8 });

    // 1. Refractory lining
    const bodyGeometry = new THREE.BoxGeometry(4, 8, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.9, transparent: true, opacity: 0.3 });
    createPart("Refractory lining", bodyGeometry, bodyMaterial, new THREE.Vector3(0, 4, 0));

    // 2. Exhaust stack
    const stackGeom = new THREE.CylinderGeometry(0.5, 0.8, 3, 16);
    createPart("Exhaust stack", stackGeom, darkSteelMat, new THREE.Vector3(0, 9.5, 0));

    // 3. Hydrocarbon feed line
    const feedLineGeom = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const feedLine = createPart("Hydrocarbon feed line", feedLineGeom, steelMat, new THREE.Vector3(-2.5, 6, 0));
    feedLine.rotation.z = Math.PI / 2;

    // 4. Steam injector
    const steamGeom = new THREE.CylinderGeometry(0.08, 0.08, 2, 16);
    const steamInjector = createPart("Steam injector", steamGeom, steelMat, new THREE.Vector3(-2.5, 5.5, 0));
    steamInjector.rotation.z = Math.PI / 2;

    // 5. Convection section coils
    const convectionGroup = new THREE.Group();
    convectionGroup.position.set(0, 6, 0);
    for (let i = 0; i < 5; i++) {
        const coilGeom = new THREE.TorusGeometry(1, 0.1, 8, 20);
        const coil = new THREE.Mesh(coilGeom, steelMat);
        coil.rotation.x = Math.PI / 2;
        coil.position.y = i * 0.4 - 0.8;
        convectionGroup.add(coil);
    }
    convectionGroup.userData.name = "Convection section coils";
    machine.add(convectionGroup);
    machine.userData.parts.push(convectionGroup);

    // 6. Radiant section tubes
    const radiantGroup = new THREE.Group();
    radiantGroup.position.set(0, 2.5, 0);
    const radiantTubes = [];
    for (let i = 0; i < 6; i++) {
        const tubeGeom = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
        const tube = new THREE.Mesh(tubeGeom, hotMat.clone());
        const angle = (i / 6) * Math.PI * 2;
        tube.position.x = Math.cos(angle) * 1.2;
        tube.position.z = Math.sin(angle) * 1.2;
        radiantGroup.add(tube);
        radiantTubes.push(tube);
    }
    radiantGroup.userData.name = "Radiant section tubes";
    machine.add(radiantGroup);
    machine.userData.parts.push(radiantGroup);

    // 7. Floor burners
    const burnerGroup = new THREE.Group();
    burnerGroup.position.set(0, 0.2, 0);
    const flames = [];
    for (let i = 0; i < 4; i++) {
        const burnerBaseGeom = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 16);
        const burnerBase = new THREE.Mesh(burnerBaseGeom, darkSteelMat);
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        burnerBase.position.x = Math.cos(angle) * 1.5;
        burnerBase.position.z = Math.sin(angle) * 1.5;
        
        const flameGeom = new THREE.ConeGeometry(0.15, 0.8, 16);
        const flame = new THREE.Mesh(flameGeom, blueFlameMat.clone());
        flame.position.y = 0.6;
        burnerBase.add(flame);
        flames.push(flame);

        burnerGroup.add(burnerBase);
    }
    burnerGroup.userData.name = "Floor burners";
    machine.add(burnerGroup);
    machine.userData.parts.push(burnerGroup);

    // 8. Transfer line exchanger (TLE)
    const tleGeom = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
    createPart("Transfer line exchanger (TLE)", tleGeom, steelMat, new THREE.Vector3(3, 4, 0));

    // 9. Quench oil injector
    const quenchGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const quenchOilInjector = createPart("Quench oil injector", quenchGeom, darkSteelMat, new THREE.Vector3(3, 2.5, 1));
    quenchOilInjector.rotation.x = Math.PI / 2;

    // 10. Cracked gas outlet
    const outletGeom = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    createPart("Cracked gas outlet", outletGeom, steelMat, new THREE.Vector3(3, 1, 0));

    // Animation setup
    let time = 0;
    machine.userData.update = function(delta) {
        time += delta;
        
        // Flicker burner flames
        flames.forEach(flame => {
            flame.scale.y = 1 + Math.sin(time * 15 + flame.position.x * 10) * 0.2;
            flame.material.opacity = 0.6 + Math.random() * 0.4;
        });

        // Pulse glowing radiant tubes
        const pulse = (Math.sin(time * 3) + 1) / 2;
        radiantTubes.forEach(tube => {
            tube.material.emissiveIntensity = 0.4 + pulse * 0.4;
        });
    };
    machine.userData.animations = [machine.userData.update];

    // Quiz Questions
    machine.userData.quiz = [
        {
            question: "What is the main purpose of the steam injected into the feed in a steam cracking furnace?",
            options: [
                "To lower the hydrocarbon partial pressure and reduce coke formation",
                "To act as a catalyst for the cracking reaction",
                "To directly heat the hydrocarbon feed",
                "To separate the cracked products"
            ],
            correctAnswer: 0
        },
        {
            question: "Which section of the furnace is responsible for preheating the feed using waste heat?",
            options: [
                "Radiant section",
                "Transfer Line Exchanger",
                "Convection section",
                "Exhaust stack"
            ],
            correctAnswer: 2
        },
        {
            question: "Where does the actual thermal cracking of hydrocarbons occur?",
            options: [
                "Convection section coils",
                "Radiant section tubes",
                "Transfer line exchanger (TLE)",
                "Exhaust stack"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the function of the Transfer Line Exchanger (TLE)?",
            options: [
                "To mix steam and hydrocarbons",
                "To rapidly cool the cracked gas to stop secondary reactions",
                "To compress the cracked gas",
                "To separate ethylene from propylene"
            ],
            correctAnswer: 1
        },
        {
            question: "Why is refractory lining critical in a steam cracking furnace?",
            options: [
                "To prevent the hydrocarbons from escaping",
                "To withstand extreme temperatures and reduce heat loss",
                "To generate steam for the process",
                "To cool the burner flames"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the role of floor burners in this furnace?",
            options: [
                "To ignite the cracked gas",
                "To provide the intense heat required for cracking in the radiant section",
                "To burn off coke deposits inside the tubes",
                "To preheat the feed in the convection section"
            ],
            correctAnswer: 1
        }
    ];

    return machine;
}
