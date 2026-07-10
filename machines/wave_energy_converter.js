export function createWaveEnergyConverter(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // Materials
    const floatMat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.4, metalness: 0.2 });
    const sparMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.6, metalness: 0.5 });
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const mooringMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const statorMat = new THREE.MeshStandardMaterial({ color: 0x1133aa, roughness: 0.5, metalness: 0.6 });
    const translatorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.8 });
    const ptoMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x114411, roughness: 0.8 });
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // 1. Surface Float
    const floatGeo = new THREE.TorusGeometry(3, 1, 32, 64);
    const floatMesh = new THREE.Mesh(floatGeo, floatMat);
    // Rotating torus so it lies flat on the water
    floatMesh.rotation.x = Math.PI / 2;
    parts.push({
        name: "Surface Float",
        description: "A buoyant structure that moves up and down with the ocean waves, capturing their kinetic energy.",
        mesh: floatMesh
    });

    // 2. Central Spar
    const sparGeo = new THREE.CylinderGeometry(1, 1, 20, 32);
    const sparMesh = new THREE.Mesh(sparGeo, sparMat);
    sparMesh.position.set(0, -5, 0);
    parts.push({
        name: "Central Spar",
        description: "A vertical cylindrical shaft that provides structural stability and houses the linear generator components.",
        mesh: sparMesh
    });

    // 3. Heave Plate
    const plateGeo = new THREE.CylinderGeometry(5, 5, 0.5, 64);
    const heavePlateMesh = new THREE.Mesh(plateGeo, plateMat);
    heavePlateMesh.position.set(0, -14.75, 0);
    parts.push({
        name: "Heave Plate",
        description: "A large horizontal plate attached to the bottom of the spar to increase hydrodynamic added mass and damp its motion, keeping it relatively stationary.",
        mesh: heavePlateMesh
    });

    // 4. Anchor Block
    const anchorGeo = new THREE.BoxGeometry(10, 2, 10);
    const anchorMesh = new THREE.Mesh(anchorGeo, anchorMat);
    anchorMesh.position.set(0, -21, 0);
    parts.push({
        name: "Anchor Block",
        description: "A heavy mass resting on the seabed that securely holds the mooring lines.",
        mesh: anchorMesh
    });

    // 5. Mooring Lines
    const mooringGroup = new THREE.Group();
    const mooringGeo = new THREE.CylinderGeometry(0.1, 0.1, 5.96, 8);
    const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
    for (let i = 0; i < 4; i++) {
        const angle = angles[i];
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const anchorP = new THREE.Vector3(cosA * 4, -20, sinA * 4);
        const plateP = new THREE.Vector3(cosA * 2, -14.75, sinA * 2);
        const midP = new THREE.Vector3().addVectors(anchorP, plateP).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(plateP, anchorP).normalize();
        const line = new THREE.Mesh(mooringGeo, mooringMat);
        line.position.copy(midP);
        line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        mooringGroup.add(line);
    }
    parts.push({
        name: "Mooring Lines",
        description: "Cables that anchor the wave energy converter to the seabed, keeping it in position while allowing necessary movement.",
        mesh: mooringGroup
    });

    // 6. Linear Generator Stator
    const statorGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const statorMesh = new THREE.Mesh(statorGeo, statorMat);
    statorMesh.position.set(0, 7, 0);
    parts.push({
        name: "Linear Generator Stator",
        description: "The stationary part of the generator containing electrical coils, housed within the PTO.",
        mesh: statorMesh
    });

    // 7. Linear Generator Translator
    const translatorGeo = new THREE.CylinderGeometry(0.6, 0.6, 10, 32);
    const translatorMesh = new THREE.Mesh(translatorGeo, translatorMat);
    translatorMesh.position.set(0, 3, 0); // Center at 3, spans from -2 to 8
    parts.push({
        name: "Linear Generator Translator",
        description: "The moving part of the generator containing permanent magnets, attached to the float and sliding within the stator.",
        mesh: translatorMesh
    });

    // 8. PTO Housing
    const ptoGeo = new THREE.CylinderGeometry(1.2, 1.2, 5, 32);
    const ptoMesh = new THREE.Mesh(ptoGeo, ptoMat);
    ptoMesh.position.set(0, 7, 0);
    parts.push({
        name: "PTO Housing",
        description: "Power Take-Off enclosure that protects the generator and internal electronics from the harsh marine environment.",
        mesh: ptoMesh
    });

    // 9. Power Export Cable
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.2, 7, 0),
        new THREE.Vector3(3, 2, 1),
        new THREE.Vector3(4, -5, -1),
        new THREE.Vector3(2, -15, 2),
        new THREE.Vector3(0, -20, 0)
    ]);
    const cableGeo = new THREE.TubeGeometry(curve, 64, 0.2, 8, false);
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    parts.push({
        name: "Power Export Cable",
        description: "An underwater electrical cable that transmits the generated electricity from the device to the grid.",
        mesh: cableMesh
    });

    // 10. Navigation Light
    const lightGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const lightMesh = new THREE.Mesh(lightGeo, lightMat);
    lightMesh.position.set(0, 9.75, 0);
    parts.push({
        name: "Navigation Light",
        description: "A warning beacon placed at the top of the device to ensure visibility and prevent collisions with passing ships.",
        mesh: lightMesh
    });

    // Build hierarchy
    const stationarySparGroup = new THREE.Group();
    stationarySparGroup.add(sparMesh);
    stationarySparGroup.add(heavePlateMesh);
    stationarySparGroup.add(statorMesh);
    stationarySparGroup.add(ptoMesh);
    stationarySparGroup.add(lightMesh);

    const movingFloatGroup = new THREE.Group();
    movingFloatGroup.add(floatMesh);
    movingFloatGroup.add(translatorMesh);

    model.add(stationarySparGroup);
    model.add(movingFloatGroup);
    model.add(anchorMesh);
    model.add(mooringGroup);
    model.add(cableMesh);

    let time = 0;
    function update(deltaTime) {
        time += deltaTime;
        const waveFreq = 1.5; 
        const waveAmp = 1.8;
        
        // Float and translator move with the wave
        const floatY = Math.sin(time * waveFreq) * waveAmp;
        movingFloatGroup.position.y = floatY;
        
        // Navigation light flashes
        const flashFreq = 1.0; // 1 flash per second
        const flash = Math.sin(time * Math.PI * 2 * flashFreq) > 0;
        lightMat.color.setHex(flash ? 0xffff00 : 0x222200);
    }

    const quizzes = [
        {
            question: "What is the primary function of a Wave Energy Converter (WEC)?",
            options: [
                "To measure wave height and frequency",
                "To convert the kinetic and potential energy of ocean waves into electricity",
                "To create waves for coastal protection",
                "To store thermal energy from the ocean"
            ],
            answer: 1
        },
        {
            question: "How does a Point Absorber WEC typically capture wave energy?",
            options: [
                "By using a turbine driven by ocean currents",
                "By channeling waves into a reservoir",
                "Through the relative motion between a buoyant surface float and a stationary submerged structure",
                "By capturing wind energy at the ocean surface"
            ],
            answer: 2
        },
        {
            question: "What is the purpose of the heave plate in a Point Absorber WEC?",
            options: [
                "To increase buoyancy",
                "To generate magnetic fields",
                "To damp the vertical motion of the central spar and keep it relatively stationary",
                "To reflect waves back into the ocean"
            ],
            answer: 2
        },
        {
            question: "What role does the Power Take-Off (PTO) system play in a WEC?",
            options: [
                "It converts the mechanical motion of the device into usable electrical energy.",
                "It anchors the device to the seabed.",
                "It takes the device off the grid during a storm.",
                "It generates the magnetic field for the navigation light."
            ],
            answer: 0
        },
        {
            question: "Why is a linear generator often used in Point Absorber WECs?",
            options: [
                "Because it produces alternating current faster",
                "Because it can directly convert the up-and-down heaving motion into electricity without needing complex gearboxes",
                "Because it is completely weightless",
                "Because it uses water instead of magnets"
            ],
            answer: 1
        },
        {
            question: "What is the main function of the mooring lines in a WEC installation?",
            options: [
                "To transport electricity to the shore",
                "To keep the WEC stationary while allowing it to bob with the waves",
                "To protect the device from marine life",
                "To measure the depth of the ocean"
            ],
            answer: 1
        }
    ];

    return {
        model,
        parts,
        update,
        quizzes
    };
}
