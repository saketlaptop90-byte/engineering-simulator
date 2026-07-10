export function createMRIScanner(THREE) {
    const group = new THREE.Group();
    group.name = "MRI Scanner";

    // 10 Distinct Parts
    // 1. Support Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const supportBase = new THREE.Mesh(baseGeo, baseMat);
    supportBase.position.set(0, 0.25, 0);
    supportBase.name = "Support Base";
    group.add(supportBase);

    // 2. Scanner Housing
    const housingGeo = new THREE.CylinderGeometry(2, 2, 2.5, 32);
    housingGeo.rotateZ(Math.PI / 2);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const scannerHousing = new THREE.Mesh(housingGeo, housingMat);
    scannerHousing.position.set(0, 2.5, 0);
    scannerHousing.name = "Scanner Housing";
    group.add(scannerHousing);

    // 3. Main Magnet Bore
    const boreGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.51, 32);
    boreGeo.rotateZ(Math.PI / 2);
    const boreMat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });
    const mainMagnetBore = new THREE.Mesh(boreGeo, boreMat);
    mainMagnetBore.position.set(0, 2.5, 0);
    mainMagnetBore.name = "Main Magnet Bore";
    group.add(mainMagnetBore);

    // 4. Gradient Coils
    const gradGeo = new THREE.CylinderGeometry(1.3, 1.3, 2.4, 32);
    gradGeo.rotateZ(Math.PI / 2);
    const gradMat = new THREE.MeshStandardMaterial({ color: 0xb87333, wireframe: true });
    const gradientCoils = new THREE.Mesh(gradGeo, gradMat);
    gradientCoils.position.set(0, 2.5, 0);
    gradientCoils.name = "Gradient Coils";
    group.add(gradientCoils);

    // 5. RF Coils
    const rfGeo = new THREE.CylinderGeometry(1.1, 1.1, 2.0, 16);
    rfGeo.rotateZ(Math.PI / 2);
    const rfMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, wireframe: true });
    const rfCoils = new THREE.Mesh(rfGeo, rfMat);
    rfCoils.position.set(0, 2.5, 0);
    rfCoils.name = "RF Coils";
    group.add(rfCoils);

    // 6. Patient Table
    const tableGeo = new THREE.BoxGeometry(3, 0.1, 0.8);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const patientTable = new THREE.Mesh(tableGeo, tableMat);
    patientTable.position.set(3, 1.8, 0);
    patientTable.name = "Patient Table";
    group.add(patientTable);

    // 7. Patient
    const patientGeo = new THREE.CapsuleGeometry(0.2, 1.2, 4, 8);
    patientGeo.rotateZ(Math.PI / 2);
    const patientMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
    const patient = new THREE.Mesh(patientGeo, patientMat);
    patient.position.set(0, 0.15, 0);
    patient.name = "Patient";
    patientTable.add(patient);

    // 8. Control Panel
    const panelGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const controlPanel = new THREE.Mesh(panelGeo, panelMat);
    controlPanel.position.set(2, 1, 1.5);
    controlPanel.name = "Control Panel";
    group.add(controlPanel);

    // 9. Display Screen
    const screenGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
    const displayScreen = new THREE.Mesh(screenGeo, screenMat);
    displayScreen.position.set(2, 1.6, 1.5);
    displayScreen.rotation.y = Math.PI / 4;
    displayScreen.name = "Display Screen";
    group.add(displayScreen);

    // 10. Coolant System
    const coolantGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
    const coolantMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const coolantSystem = new THREE.Mesh(coolantGeo, coolantMat);
    coolantSystem.position.set(-1.5, 1, -1.5);
    coolantSystem.name = "Coolant System";
    group.add(coolantSystem);


    // Animation setup
    group.tick = function(time) {
        // Patient table sliding into bore
        const slideCycle = (Math.sin(time * 0.5) + 1) / 2; // 0 to 1
        patientTable.position.x = 3 - (slideCycle * 3);

        // Internal rings spinning/pulsing
        rfCoils.rotation.x = time * 2;
        
        // Gradient coils pulsing
        const pulse = 1 + Math.sin(time * 10) * 0.05;
        gradientCoils.scale.set(1, pulse, pulse);

        // Screen blink
        if (Math.sin(time * 5) > 0) {
            screenMat.emissiveIntensity = 1;
        } else {
            screenMat.emissiveIntensity = 0.2;
        }
    };
    
    group.userData.tick = group.tick;

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of the Main Magnet in an MRI scanner?",
            options: [
                "To produce the RF pulses",
                "To cool the system",
                "To create a strong, uniform static magnetic field",
                "To generate the images on the display"
            ],
            correctOption: 2
        },
        {
            question: "Which component is responsible for spatial encoding of the MRI signal?",
            options: [
                "RF Coils",
                "Gradient Coils",
                "Scanner Housing",
                "Coolant System"
            ],
            correctOption: 1
        },
        {
            question: "What do the RF (Radio Frequency) coils do in an MRI?",
            options: [
                "Transmit and/or receive the RF signal",
                "Cool the main magnet",
                "Keep the patient still",
                "Generate the main magnetic field"
            ],
            correctOption: 0
        },
        {
            question: "Why is a Coolant System necessary in a superconducting MRI scanner?",
            options: [
                "To cool the patient during the scan",
                "To maintain the super-conducting coils at extremely low temperatures",
                "To prevent the computer systems from overheating",
                "To clean the gradient coils"
            ],
            correctOption: 1
        },
        {
            question: "What does MRI stand for?",
            options: [
                "Medical Resonance Imaging",
                "Magnetic Resonance Imaging",
                "Magnetic Radiation Imaging",
                "Medical Radiation Imaging"
            ],
            correctOption: 1
        },
        {
            question: "Which is NOT a safety concern regarding the MRI's strong magnetic field?",
            options: [
                "Metallic implants in the patient's body",
                "Flying ferromagnetic objects (the missile effect)",
                "Ionizing radiation exposure",
                "Interference with pacemakers"
            ],
            correctOption: 2
        }
    ];

    return group;
}
