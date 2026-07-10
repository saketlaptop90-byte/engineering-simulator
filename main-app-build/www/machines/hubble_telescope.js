import * as materials from '../utils/materials.js';

export function createHubbleTelescope(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Helper to create colored materials
    const silverFoil = materials.tinted(materials.aluminum, 0xcccccc);
    const goldFoil = materials.tinted(materials.copper, 0xffcc00);
    const solarBlue = materials.tinted(materials.glass, 0x113388);
    const blackStructure = materials.tinted(materials.carbonFiber, 0x222222);

    // 1. Main Baffle
    const baffleGroup = new THREE.Group();
    const baffleMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 8, 32, 1, true),
        silverFoil
    );
    baffleMesh.material.side = THREE.DoubleSide;
    const baffleInner = new THREE.Mesh(
        new THREE.CylinderGeometry(1.98, 1.98, 8, 32, 1, true),
        blackStructure
    );
    baffleInner.material.side = THREE.DoubleSide;
    baffleGroup.add(baffleMesh, baffleInner);
    baffleGroup.position.set(0, 2, 0);
    group.add(baffleGroup);

    parts.push({
        name: "Main Baffle",
        description: "The large cylindrical tube that shields the optics from stray light and debris.",
        material: "Silver Foil (Aluminum)",
        function: "Light Baffling",
        assemblyOrder: 1,
        connections: ["Equipment Section", "Aperture Door"],
        failureEffect: "Stray light would enter the optical system, washing out faint astronomical objects.",
        cascadeFailures: ["Primary Mirror"],
        originalPosition: new THREE.Vector3(0, 2, 0),
        explodedPosition: new THREE.Vector3(0, 5, 0)
    });

    // 2. Primary Mirror
    const primaryMirrorGroup = new THREE.Group();
    const primaryMirror = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32),
        materials.chrome
    );
    const mirrorHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.25, 16),
        blackStructure
    );
    primaryMirrorGroup.add(primaryMirror, mirrorHole);
    primaryMirrorGroup.position.set(0, -1.8, 0);
    group.add(primaryMirrorGroup);

    parts.push({
        name: "Primary Mirror",
        description: "A 2.4-meter highly reflective concave mirror that collects and focuses light.",
        material: "Coated Glass (Chrome finish)",
        function: "Light Collection",
        assemblyOrder: 2,
        connections: ["Main Baffle", "Equipment Section"],
        failureEffect: "Inability to collect adequate light or focus images correctly.",
        cascadeFailures: ["Scientific Instruments"],
        originalPosition: new THREE.Vector3(0, -1.8, 0),
        explodedPosition: new THREE.Vector3(0, -1.8, 4)
    });

    // 3. Secondary Mirror
    const secondaryMirrorGroup = new THREE.Group();
    const secondaryMirror = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16),
        materials.chrome
    );
    // Spider supports
    for (let i = 0; i < 4; i++) {
        const support = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 1.7, 0.05),
            blackStructure
        );
        support.position.y = -0.85;
        support.position.x = Math.cos(i * Math.PI / 2) * 0.85;
        support.position.z = Math.sin(i * Math.PI / 2) * 0.85;
        support.rotation.z = Math.cos(i * Math.PI / 2) * Math.PI / 4;
        support.rotation.x = -Math.sin(i * Math.PI / 2) * Math.PI / 4;
        secondaryMirrorGroup.add(support);
    }
    secondaryMirrorGroup.add(secondaryMirror);
    secondaryMirrorGroup.position.set(0, 5.5, 0);
    group.add(secondaryMirrorGroup);

    parts.push({
        name: "Secondary Mirror",
        description: "Suspended at the front, it reflects light from the primary mirror back through a hole in the primary mirror to the instruments.",
        material: "Coated Glass (Chrome finish)",
        function: "Optical Focusing",
        assemblyOrder: 3,
        connections: ["Main Baffle"],
        failureEffect: "Complete loss of focused image at the focal plane.",
        cascadeFailures: ["Scientific Instruments"],
        originalPosition: new THREE.Vector3(0, 5.5, 0),
        explodedPosition: new THREE.Vector3(0, 8, 0)
    });

    // 4. Equipment Section
    const equipmentGroup = new THREE.Group();
    const equipBody = new THREE.Mesh(
        new THREE.CylinderGeometry(2.1, 2.1, 3, 32),
        materials.aluminum
    );
    equipmentGroup.add(equipBody);
    equipmentGroup.position.set(0, -3.5, 0);
    group.add(equipmentGroup);

    parts.push({
        name: "Equipment Section",
        description: "The rear cylindrical housing containing the spacecraft's power, communication, and control systems.",
        material: "Aluminum",
        function: "Spacecraft Bus",
        assemblyOrder: 4,
        connections: ["Main Baffle", "Solar Panel Arrays", "High-Gain Antenna"],
        failureEffect: "Loss of power, pointing, and communication capabilities.",
        cascadeFailures: ["Solar Panel Array 1", "Solar Panel Array 2", "High-Gain Antenna", "Fine Guidance Sensors"],
        originalPosition: new THREE.Vector3(0, -3.5, 0),
        explodedPosition: new THREE.Vector3(0, -7, 0)
    });

    // 5. Solar Panel Array 1
    const solar1Group = new THREE.Group();
    const panel1 = new THREE.Mesh(
        new THREE.BoxGeometry(6, 2.5, 0.1),
        solarBlue
    );
    panel1.position.x = -4.5;
    const arm1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2, 8),
        materials.darkSteel
    );
    arm1.rotation.z = Math.PI / 2;
    arm1.position.x = -1.5;
    solar1Group.add(panel1, arm1);
    solar1Group.position.set(0, -2.5, 0);
    group.add(solar1Group);

    parts.push({
        name: "Solar Panel Array 1",
        description: "Left massive rectangular grid of solar cells that powers the telescope.",
        material: "Photovoltaic Glass",
        function: "Power Generation",
        assemblyOrder: 5,
        connections: ["Equipment Section"],
        failureEffect: "Reduced power availability, limiting instrument usage and communication.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, -2.5, 0),
        explodedPosition: new THREE.Vector3(-8, -2.5, 0)
    });

    // 6. Solar Panel Array 2
    const solar2Group = new THREE.Group();
    const panel2 = new THREE.Mesh(
        new THREE.BoxGeometry(6, 2.5, 0.1),
        solarBlue
    );
    panel2.position.x = 4.5;
    const arm2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2, 8),
        materials.darkSteel
    );
    arm2.rotation.z = Math.PI / 2;
    arm2.position.x = 1.5;
    solar2Group.add(panel2, arm2);
    solar2Group.position.set(0, -2.5, 0);
    group.add(solar2Group);

    parts.push({
        name: "Solar Panel Array 2",
        description: "Right massive rectangular grid of solar cells that provides redundancy and full power to the telescope.",
        material: "Photovoltaic Glass",
        function: "Power Generation",
        assemblyOrder: 6,
        connections: ["Equipment Section"],
        failureEffect: "Reduced power availability, limiting instrument usage and communication.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, -2.5, 0),
        explodedPosition: new THREE.Vector3(8, -2.5, 0)
    });

    // 7. Aperture Door
    const apertureDoorGroup = new THREE.Group();
    const door = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 0.1, 32),
        materials.aluminum
    );
    door.position.set(0, 0, 1.8);
    door.rotation.x = Math.PI / 2;
    apertureDoorGroup.add(door);
    // Hinge at Y=6, Z=-2
    apertureDoorGroup.position.set(0, 6, -2);
    apertureDoorGroup.rotation.x = -Math.PI / 3; // Opened
    group.add(apertureDoorGroup);

    parts.push({
        name: "Aperture Door",
        description: "A flap at the front that can close to protect the optics from direct sunlight or space debris.",
        material: "Aluminum",
        function: "Optics Protection",
        assemblyOrder: 7,
        connections: ["Main Baffle"],
        failureEffect: "If stuck closed, the telescope is completely blinded. If stuck open, risk of sun-damage to sensors.",
        cascadeFailures: ["Primary Mirror", "Scientific Instruments"],
        originalPosition: new THREE.Vector3(0, 6, -2),
        explodedPosition: new THREE.Vector3(0, 8, -4)
    });

    // 8. High-Gain Antenna
    const antennaGroup = new THREE.Group();
    const dish = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        materials.whitePlastic
    );
    dish.rotation.x = Math.PI / 2;
    const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 2),
        materials.darkSteel
    );
    mast.position.y = -1;
    antennaGroup.add(dish, mast);
    antennaGroup.position.set(0, -4, 2.5);
    antennaGroup.rotation.x = Math.PI / 4;
    group.add(antennaGroup);

    parts.push({
        name: "High-Gain Antenna",
        description: "Communication dish used to transmit vast amounts of scientific data to Earth via TDRSS satellites.",
        material: "Composite/Plastic",
        function: "Data Transmission",
        assemblyOrder: 8,
        connections: ["Equipment Section"],
        failureEffect: "Severe reduction in the rate at which scientific images and data can be downlinked.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, -4, 2.5),
        explodedPosition: new THREE.Vector3(0, -4, 6)
    });

    // 9. Fine Guidance Sensors
    const fgsGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const sensor = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1, 0.8),
            goldFoil
        );
        sensor.position.set(
            Math.cos(i * Math.PI * 2 / 3) * 1.5,
            0,
            Math.sin(i * Math.PI * 2 / 3) * 1.5
        );
        fgsGroup.add(sensor);
    }
    fgsGroup.position.set(0, -2.5, 0);
    group.add(fgsGroup);

    parts.push({
        name: "Fine Guidance Sensors",
        description: "Highly precise optical sensors used to lock onto guide stars, keeping Hubble extremely steady.",
        material: "Gold Foil insulation",
        function: "Targeting & Pointing",
        assemblyOrder: 9,
        connections: ["Equipment Section"],
        failureEffect: "Telescope cannot maintain steady lock on targets, resulting in blurry images.",
        cascadeFailures: ["Scientific Instruments"],
        originalPosition: new THREE.Vector3(0, -2.5, 0),
        explodedPosition: new THREE.Vector3(0, -2.5, -4)
    });

    // 10. Scientific Instruments
    const instrumentsGroup = new THREE.Group();
    const instrumentBase = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        materials.aluminum
    );
    const cameraBox1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1.5, 0.8),
        silverFoil
    );
    cameraBox1.position.set(-0.5, -0.5, 1);
    const spectrographBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1.5, 0.8),
        goldFoil
    );
    spectrographBox.position.set(0.5, -0.5, -1);
    
    instrumentsGroup.add(instrumentBase, cameraBox1, spectrographBox);
    instrumentsGroup.position.set(0, -4.5, 0);
    group.add(instrumentsGroup);

    parts.push({
        name: "Scientific Instruments",
        description: "Internal rear bays containing cameras, spectrographs, and corrective optics (like COSTAR) to record data.",
        material: "Various Metallic Enclosures",
        function: "Data Collection",
        assemblyOrder: 10,
        connections: ["Equipment Section"],
        failureEffect: "Loss of primary scientific data gathering capabilities.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, -4.5, 0),
        explodedPosition: new THREE.Vector3(0, -9, 0)
    });

    const description = "The Hubble Space Telescope is a large, space-based observatory deployed in 1990. It has revolutionized astronomy by providing unprecedented clear and deep views of the universe.";

    const quizQuestions = [
        {
            question: "What optical design does the Hubble Space Telescope primarily use?",
            options: ["Newtonian reflector", "Cassegrain reflector", "Refracting telescope", "Radio interferometer"],
            correctAnswer: 1,
            explanation: "Hubble is a Ritchey-Chrétien telescope, which is a specialized type of Cassegrain reflector with two hyperbolic mirrors.",
            difficulty: "Medium"
        },
        {
            question: "What major flaw was discovered in Hubble's primary mirror shortly after launch?",
            options: ["It was cracked during launch", "It suffered from chromatic aberration", "It had spherical aberration", "The coating oxidized instantly"],
            correctAnswer: 2,
            explanation: "The primary mirror was polished too flat at the edges by about 2.2 micrometers, causing spherical aberration that blurred the images.",
            difficulty: "Easy"
        },
        {
            question: "In what type of orbit does the Hubble Space Telescope operate?",
            options: ["Low Earth Orbit (LEO)", "Geosynchronous Orbit (GEO)", "Lunar Orbit", "Heliocentric Orbit"],
            correctAnswer: 0,
            explanation: "Hubble orbits in Low Earth Orbit (LEO) at an altitude of approximately 540 kilometers.",
            difficulty: "Easy"
        },
        {
            question: "Why is Hubble placed in space rather than on Earth's surface?",
            options: ["To be closer to the stars", "To avoid atmospheric distortion and absorption", "To avoid Earth's magnetic field", "To intercept space debris"],
            correctAnswer: 1,
            explanation: "Earth's atmosphere blurs starlight and absorbs certain wavelengths (like UV and IR). Being above the atmosphere gives Hubble crystal-clear views.",
            difficulty: "Easy"
        },
        {
            question: "What wavelengths of light is Hubble designed to observe?",
            options: ["Only visible light", "X-rays and Gamma rays", "Ultraviolet, Visible, and Near-Infrared", "Radio and Microwaves"],
            correctAnswer: 2,
            explanation: "Hubble observes primarily in the Ultraviolet (UV), Visible, and Near-Infrared (NIR) spectrums.",
            difficulty: "Medium"
        },
        {
            question: "How was Hubble's mirror flaw initially corrected in space?",
            options: ["By installing a new primary mirror", "By installing COSTAR optics like 'glasses'", "By updating the software algorithms only", "By bringing it back to Earth for repairs"],
            correctAnswer: 1,
            explanation: "Astronauts installed the Corrective Optics Space Telescope Axial Replacement (COSTAR) during Servicing Mission 1 to correct the light path before it reached the instruments.",
            difficulty: "Hard"
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: function(time, speed, meshes) {
            // Slowly rotate the entire telescope as if floating in orbit
            group.rotation.y = time * 0.05 * speed;
            group.rotation.x = Math.sin(time * 0.1 * speed) * 0.05;
            group.rotation.z = Math.cos(time * 0.1 * speed) * 0.05;

            // Subtly pivot the solar arrays to "track the sun"
            if (meshes[4] && meshes[4].group) {
                meshes[4].group.rotation.y = Math.sin(time * 0.2 * speed) * 0.2;
            }
            if (meshes[5] && meshes[5].group) {
                meshes[5].group.rotation.y = Math.sin(time * 0.2 * speed) * 0.2;
            }
        }
    };
}
