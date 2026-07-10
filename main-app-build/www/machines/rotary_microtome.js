export function createRotaryMicrotome(THREE) {
    const group = new THREE.Group();

    // 1. Base Plate
    const basePlateGeom = new THREE.BoxGeometry(6, 0.5, 4);
    const basePlateMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const basePlate = new THREE.Mesh(basePlateGeom, basePlateMat);
    basePlate.position.set(0, 0.25, 0);
    basePlate.name = "Base Plate";
    basePlate.userData = {
        id: 'base_plate',
        name: 'Base Plate',
        description: 'Provides a stable foundation for the microtome, ensuring no vibration during sectioning.'
    };
    group.add(basePlate);

    // 2. Feed Mechanism
    const feedMechanismGeom = new THREE.BoxGeometry(2.5, 3, 2.5);
    const feedMechanismMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const feedMechanism = new THREE.Mesh(feedMechanismGeom, feedMechanismMat);
    feedMechanism.position.set(0, 2, -0.5);
    feedMechanism.name = "Feed Mechanism";
    feedMechanism.userData = {
        id: 'feed_mechanism',
        name: 'Feed Mechanism',
        description: 'Houses the internal gears that precisely advance the specimen towards the blade.'
    };
    group.add(feedMechanism);

    // 3. Handwheel
    const handwheelGeom = new THREE.TorusGeometry(1, 0.15, 16, 64);
    const handwheelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const handwheel = new THREE.Mesh(handwheelGeom, handwheelMat);
    handwheel.position.set(1.4, 2, -0.5);
    handwheel.rotation.y = Math.PI / 2;
    handwheel.name = "Handwheel";
    handwheel.userData = {
        id: 'handwheel',
        name: 'Handwheel',
        description: 'Manually rotated by the operator to advance the specimen and perform the cutting stroke.'
    };
    
    const spokeGeom = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
    const spoke = new THREE.Mesh(spokeGeom, handwheelMat);
    handwheel.add(spoke);
    
    const handleGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const handle = new THREE.Mesh(handleGeom, handleMat);
    handle.position.set(0, 1, 0.25);
    handle.rotation.x = Math.PI / 2;
    handwheel.add(handle);
    group.add(handwheel);

    // 4. Specimen Clamp
    const clampGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const clampMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const specimenClamp = new THREE.Mesh(clampGeom, clampMat);
    specimenClamp.position.set(0, 2, 1);
    specimenClamp.name = "Specimen Clamp";
    specimenClamp.userData = {
        id: 'specimen_clamp',
        name: 'Specimen Clamp',
        description: 'Securely holds the tissue block in place during the sectioning process.'
    };
    
    const blockGeom = new THREE.BoxGeometry(0.4, 0.4, 0.2);
    const blockMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
    const block = new THREE.Mesh(blockGeom, blockMat);
    block.position.set(0, 0, 0.5);
    specimenClamp.add(block);
    group.add(specimenClamp);

    // 5. Blade Holder
    const holderGeom = new THREE.BoxGeometry(2, 1, 1.5);
    const holderMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const bladeHolder = new THREE.Mesh(holderGeom, holderMat);
    bladeHolder.position.set(0, 1, 1.8);
    bladeHolder.name = "Blade Holder";
    bladeHolder.userData = {
        id: 'blade_holder',
        name: 'Blade Holder',
        description: 'Provides a rigid support base for the microtome blade and allows adjustment of the clearance angle.'
    };
    group.add(bladeHolder);

    // 6. Microtome Blade
    const bladeGeom = new THREE.BoxGeometry(1.8, 0.3, 0.05);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const microtomeBlade = new THREE.Mesh(bladeGeom, bladeMat);
    microtomeBlade.position.set(0, 1.6, 1.7);
    microtomeBlade.rotation.x = -Math.PI / 6;
    microtomeBlade.name = "Microtome Blade";
    microtomeBlade.userData = {
        id: 'microtome_blade',
        name: 'Microtome Blade',
        description: 'The extremely sharp cutting edge used to slice thin sections of the specimen.'
    };
    group.add(microtomeBlade);

    // 7. Section Waste Tray
    const trayGeom = new THREE.BoxGeometry(2.2, 0.2, 1.2);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const wasteTray = new THREE.Mesh(trayGeom, trayMat);
    wasteTray.position.set(0, 0.6, 2.2);
    wasteTray.name = "Section Waste Tray";
    wasteTray.userData = {
        id: 'section_waste_tray',
        name: 'Section Waste Tray',
        description: 'Collects the discarded tissue sections and wax debris generated during trimming.'
    };
    group.add(wasteTray);

    // 8. Thickness Adjustment Dial
    const dialGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const adjustmentDial = new THREE.Mesh(dialGeom, dialMat);
    adjustmentDial.position.set(-1.3, 2.5, -0.5);
    adjustmentDial.rotation.z = Math.PI / 2;
    adjustmentDial.name = "Thickness Adjustment Dial";
    adjustmentDial.userData = {
        id: 'thickness_adjustment_dial',
        name: 'Thickness Adjustment Dial',
        description: 'Allows the user to set the precise thickness of the sections to be cut, typically in micrometers.'
    };
    group.add(adjustmentDial);

    // 9. Locking Lever
    const leverGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const leverMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const lockingLever = new THREE.Mesh(leverGeom, leverMat);
    lockingLever.position.set(1.4, 3.2, -0.5);
    lockingLever.rotation.z = Math.PI / 4;
    lockingLever.name = "Locking Lever";
    lockingLever.userData = {
        id: 'locking_lever',
        name: 'Locking Lever',
        description: 'Engages a locking mechanism on the handwheel to prevent accidental movement when changing blades or specimens.'
    };
    group.add(lockingLever);

    // 10. Water Bath
    const bathGeom = new THREE.CylinderGeometry(1, 1, 0.6, 32);
    const bathMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const waterBath = new THREE.Mesh(bathGeom, bathMat);
    waterBath.position.set(-2.5, 0.3, 1.5);
    waterBath.name = "Water Bath";
    waterBath.userData = {
        id: 'water_bath',
        name: 'Water Bath',
        description: 'A heated basin used to float and flatten out the delicate tissue sections before transferring them to slides.'
    };
    
    const bathInnerGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 32);
    const bathInnerMat = new THREE.MeshStandardMaterial({ color: 0x66ccff, transparent: true, opacity: 0.8 });
    const bathInner = new THREE.Mesh(bathInnerGeom, bathInnerMat);
    bathInner.position.set(0, 0.06, 0);
    waterBath.add(bathInner);
    group.add(waterBath);

    // Animation
    group.tick = (time) => {
        const speed = 0.002;
        // Handwheel turns
        handwheel.rotation.z = -time * speed;
        // Specimen clamp moves up and down
        specimenClamp.position.y = 2 + Math.sin(time * speed) * 0.4;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of the Handwheel?",
            options: [
                "To advance the specimen and initiate the cutting stroke.",
                "To change the blade.",
                "To adjust the section thickness.",
                "To lock the microtome."
            ],
            correctAnswer: 0
        },
        {
            question: "What does the Specimen Clamp hold?",
            options: [
                "The microtome blade.",
                "The tissue block or specimen to be cut.",
                "The section waste.",
                "The locking lever."
            ],
            correctAnswer: 1
        },
        {
            question: "Which component determines the thickness of the tissue sections?",
            options: [
                "Locking Lever",
                "Section Waste Tray",
                "Thickness Adjustment Dial",
                "Water Bath"
            ],
            correctAnswer: 2
        },
        {
            question: "What is the purpose of the Water Bath in microtomy?",
            options: [
                "To wash the microtome.",
                "To cool the blade.",
                "To float and flatten the cut tissue sections.",
                "To store the specimens."
            ],
            correctAnswer: 2
        },
        {
            question: "Where do the discarded sections typically fall during trimming?",
            options: [
                "Water Bath",
                "Section Waste Tray",
                "Feed Mechanism",
                "Blade Holder"
            ],
            correctAnswer: 1
        },
        {
            question: "Why is a Locking Lever important on a microtome?",
            options: [
                "To prevent the blade from dulling.",
                "To secure the handwheel and prevent accidental cuts when changing specimens.",
                "To measure the thickness of the sections.",
                "To eject the waste tray."
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
