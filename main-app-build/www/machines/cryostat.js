export function createCryostat(THREE) {
    const group = new THREE.Group();
    group.name = 'Cryostat';

    // 1. Freezing Chamber (Main body)
    const chamberGeo = new THREE.BoxGeometry(10, 8, 8);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.9 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.set(0, 4, 0);
    chamber.name = 'Freezing Chamber';
    chamber.userData = {
        id: 'freezing_chamber',
        name: 'Freezing Chamber',
        description: 'Maintains an extremely low temperature environment for freezing and sectioning tissue samples.'
    };
    group.add(chamber);

    // 2. Freezing Shelf
    const shelfGeo = new THREE.BoxGeometry(8, 0.5, 3);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xa0a0a0 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, 5, -2);
    shelf.name = 'Freezing Shelf';
    shelf.userData = {
        id: 'freezing_shelf',
        name: 'Freezing Shelf',
        description: 'A dedicated cold shelf used to rapidly freeze tissue specimens onto object discs.'
    };
    group.add(shelf);

    // 3. Object Discs
    const discsGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const discsMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const discs = new THREE.Mesh(discsGeo, discsMat);
    discs.position.set(-2, 5.35, -2);
    discs.name = 'Object Discs';
    discs.userData = {
        id: 'object_discs',
        name: 'Object Discs',
        description: 'Metal chucks on which tissue samples are mounted and frozen.'
    };
    group.add(discs);

    // 4. Microtome Assembly
    const microGeo = new THREE.BoxGeometry(2, 3, 2);
    const microMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const microtome = new THREE.Mesh(microGeo, microMat);
    microtome.position.set(0, 3.5, 1);
    microtome.name = 'Microtome Assembly';
    microtome.userData = {
        id: 'microtome_assembly',
        name: 'Microtome Assembly',
        description: 'A precision mechanical instrument used to cut extremely thin slices of material.'
    };
    group.add(microtome);

    // 5. Blade Holder Base
    const bladeGeo = new THREE.BoxGeometry(3, 1, 1.5);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const bladeHolder = new THREE.Mesh(bladeGeo, bladeMat);
    bladeHolder.position.set(0, 2, 2);
    bladeHolder.name = 'Blade Holder Base';
    bladeHolder.userData = {
        id: 'blade_holder_base',
        name: 'Blade Holder Base',
        description: 'Securely holds the disposable or reusable microtome blade in place.'
    };
    group.add(bladeHolder);

    // 6. Anti-Roll Plate
    const antiRollGeo = new THREE.BoxGeometry(2.8, 0.1, 1.2);
    const antiRollMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 });
    const antiRoll = new THREE.Mesh(antiRollGeo, antiRollMat);
    antiRoll.position.set(0, 2.6, 2);
    antiRoll.rotation.x = Math.PI / 8;
    antiRoll.name = 'Anti-Roll Plate';
    antiRoll.userData = {
        id: 'anti_roll_plate',
        name: 'Anti-Roll Plate',
        description: 'A glass or plastic plate that prevents the tissue section from curling up as it is being cut.'
    };
    group.add(antiRoll);

    // 7. Glass Window
    const windowGeo = new THREE.BoxGeometry(8, 5, 0.2);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xadd8e6, transparent: true, opacity: 0.3 });
    const glassWindow = new THREE.Mesh(windowGeo, windowMat);
    glassWindow.position.set(0, 5, 4.1);
    glassWindow.name = 'Glass Window';
    glassWindow.userData = {
        id: 'glass_window',
        name: 'Glass Window',
        description: 'A sliding or hinged transparent cover that maintains the cold temperature while allowing visibility.'
    };
    group.add(glassWindow);

    // 8. Temperature Control Panel
    const panelGeo = new THREE.BoxGeometry(4, 1.5, 0.5);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 8.5, 3.8);
    panel.name = 'Temperature Control Panel';
    panel.userData = {
        id: 'temperature_control_panel',
        name: 'Temperature Control Panel',
        description: 'Electronic interface to monitor and adjust chamber, object head, and defrost temperatures.'
    };
    group.add(panel);

    // 9. Defrost System
    const defrostGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    const defrostMat = new THREE.MeshStandardMaterial({ color: 0xcc6666 });
    const defrost = new THREE.Mesh(defrostGeo, defrostMat);
    defrost.position.set(4, 4, -3);
    defrost.name = 'Defrost System';
    defrost.userData = {
        id: 'defrost_system',
        name: 'Defrost System',
        description: 'Automated system to periodically remove frost and ice buildup from the chamber walls.'
    };
    group.add(defrost);

    // 10. Waste Tray
    const wasteGeo = new THREE.BoxGeometry(6, 0.5, 4);
    const wasteMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const wasteTray = new THREE.Mesh(wasteGeo, wasteMat);
    wasteTray.position.set(0, 0.5, 1);
    wasteTray.name = 'Waste Tray';
    wasteTray.userData = {
        id: 'waste_tray',
        name: 'Waste Tray',
        description: 'Collects excess tissue shavings and debris generated during sectioning.'
    };
    group.add(wasteTray);

    // Animation: Move the microtome up and down to simulate slicing
    group.tick = (time) => {
        // Move microtome up and down
        microtome.position.y = 3.5 + Math.sin(time * 2) * 0.5;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of the Freezing Chamber in a Cryostat?",
            options: [
                "To maintain an extremely low temperature environment for tissue samples",
                "To rapidly heat tissue samples before cutting",
                "To store chemicals and reagents",
                "To sterilize the microtome blades"
            ],
            correctAnswer: 0
        },
        {
            question: "What does the Anti-Roll Plate do?",
            options: [
                "Prevents the entire machine from moving",
                "Stops the tissue block from rolling off the shelf",
                "Prevents the thin tissue sections from curling as they are cut",
                "Maintains the internal temperature"
            ],
            correctAnswer: 2
        },
        {
            question: "Where are tissue samples typically mounted and frozen before being sectioned?",
            options: [
                "Blade Holder Base",
                "Defrost System",
                "Waste Tray",
                "Object Discs on the Freezing Shelf"
            ],
            correctAnswer: 3
        },
        {
            question: "Which component physically cuts the frozen tissue sections?",
            options: [
                "Defrost System",
                "Microtome Assembly",
                "Glass Window",
                "Temperature Control Panel"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the Defrost System?",
            options: [
                "To cool down the tissue quickly",
                "To remove frost and ice buildup inside the chamber",
                "To sharpen the microtome blade automatically",
                "To freeze the Object Discs"
            ],
            correctAnswer: 1
        },
        {
            question: "Why is a transparent Glass Window used on the chamber?",
            options: [
                "To magnify the tissue sections",
                "To reflect light onto the microtome",
                "To allow visibility while maintaining the cold internal temperature",
                "To prevent UV light from damaging samples"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
