export function createGreenhouseEffect(THREE) {
    const group = new THREE.Group();
    group.userData = {
        id: 'greenhouse_effect',
        name: 'Atmospheric Greenhouse Effect',
        description: 'Model illustrating the Earth\'s greenhouse effect.',
        parts: [],
        questions: []
    };

    const addPart = (mesh, name, description) => {
        mesh.userData = { name, description };
        group.add(mesh);
        group.userData.parts.push({ name, description });
    };

    // Materials
    const solarMat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 });
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x11aa22 });
    const irMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
    const co2Mat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const ch4Mat = new THREE.MeshStandardMaterial({ color: 0x4488ff });
    const h2oMat = new THREE.MeshStandardMaterial({ color: 0xaaddff, transparent: true, opacity: 0.5 });
    const ozoneMat = new THREE.MeshBasicMaterial({ color: 0x4400ff, transparent: true, opacity: 0.2 });
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const albedoMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const escapedMat = new THREE.MeshBasicMaterial({ color: 0xffaaaa, transparent: true, opacity: 0.5 });

    // 1. Solar radiation
    const solarGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
    const solarRay = new THREE.Mesh(solarGeometry, solarMat);
    solarRay.position.set(-10, 15, 0);
    solarRay.rotation.z = -Math.PI / 4;
    addPart(solarRay, 'Solar radiation', 'Shortwave radiation from the sun entering the atmosphere.');

    // 2. Earth's surface
    const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
    const earthSurface = new THREE.Mesh(earthGeometry, earthMat);
    earthSurface.position.set(0, -10, 0);
    addPart(earthSurface, "Earth's surface", 'The surface of the Earth, absorbing solar radiation and emitting infrared.');

    // 3. Infrared radiation
    const irGeometry = new THREE.CylinderGeometry(0.8, 0.8, 8, 8);
    const irRay = new THREE.Mesh(irGeometry, irMat);
    irRay.position.set(2, 5, 0);
    irRay.rotation.z = Math.PI / 6;
    addPart(irRay, 'Infrared radiation', 'Longwave radiation emitted by the heated Earth surface.');

    // 4. Carbon dioxide molecules
    const co2Geometry = new THREE.SphereGeometry(1, 16, 16);
    const co2Molecule = new THREE.Mesh(co2Geometry, co2Mat);
    co2Molecule.position.set(5, 8, 2);
    addPart(co2Molecule, 'Carbon dioxide molecules', 'A primary greenhouse gas that absorbs infrared radiation.');

    // 5. Methane molecules
    const ch4Geometry = new THREE.SphereGeometry(0.8, 16, 16);
    const ch4Molecule = new THREE.Mesh(ch4Geometry, ch4Mat);
    ch4Molecule.position.set(-4, 9, -3);
    addPart(ch4Molecule, 'Methane molecules', 'A potent greenhouse gas contributing to the greenhouse effect.');

    // 6. Water vapor
    const h2oGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const h2oVapor = new THREE.Mesh(h2oGeometry, h2oMat);
    h2oVapor.position.set(2, 11, -1);
    addPart(h2oVapor, 'Water vapor', 'The most abundant greenhouse gas, highly responsive to temperature changes.');

    // 7. Ozone layer
    const ozoneGeometry = new THREE.TorusGeometry(15, 2, 16, 100);
    const ozoneLayer = new THREE.Mesh(ozoneGeometry, ozoneMat);
    ozoneLayer.rotation.x = Math.PI / 2;
    addPart(ozoneLayer, 'Ozone layer', 'Absorbs most of the Sun\'s ultraviolet radiation.');

    // 8. Cloud cover
    const cloudGeometry = new THREE.BoxGeometry(4, 1, 3);
    const cloud = new THREE.Mesh(cloudGeometry, cloudMat);
    cloud.position.set(-6, 6, 2);
    addPart(cloud, 'Cloud cover', 'Can both cool the Earth by reflecting sunlight and warm it by trapping infrared.');

    // 9. Albedo reflector
    const albedoGeometry = new THREE.PlaneGeometry(5, 5);
    const albedoReflector = new THREE.Mesh(albedoGeometry, albedoMat);
    albedoReflector.rotation.x = -Math.PI / 2;
    albedoReflector.position.set(-8, -0.5, 5);
    addPart(albedoReflector, 'Albedo reflector', 'Reflective surfaces like ice and snow that bounce solar radiation back to space.');

    // 10. Escaped radiation
    const escapedGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 8);
    const escapedRay = new THREE.Mesh(escapedGeometry, escapedMat);
    escapedRay.position.set(8, 20, 0);
    escapedRay.rotation.z = Math.PI / 8;
    addPart(escapedRay, 'Escaped radiation', 'Infrared radiation that manages to escape into space without being absorbed.');

    // Animation
    group.userData.animate = (time) => {
        // Solar radiation entering
        solarRay.position.x = -15 + (time * 5) % 15;
        solarRay.position.y = 20 - (time * 5) % 15;

        // Infrared radiation rising
        irRay.position.y = 0 + (time * 3) % 15;
        irRay.scale.y = 1 + Math.sin(time) * 0.5;

        // CO2 absorbing and vibrating
        co2Molecule.position.x = 5 + Math.sin(time * 10) * 0.2;
        co2Molecule.position.y = 8 + Math.cos(time * 10) * 0.2;

        // Methane vibrating
        ch4Molecule.position.x = -4 + Math.sin(time * 12) * 0.15;
        ch4Molecule.position.y = 9 + Math.cos(time * 12) * 0.15;

        // Water vapor drifting
        h2oVapor.position.x = 2 + Math.sin(time) * 2;
        
        // Cloud cover drifting
        cloud.position.x = -6 + Math.sin(time * 0.5) * 3;

        // Escaped radiation
        escapedRay.position.y = 15 + (time * 4) % 10;
    };

    // Quiz Questions
    group.userData.questions = [
        {
            question: "What type of radiation primarily enters the Earth's atmosphere from the Sun?",
            options: ["Infrared radiation", "Shortwave radiation", "Microwaves", "X-rays"],
            correctAnswer: 1
        },
        {
            question: "Which of the following is NOT a greenhouse gas?",
            options: ["Carbon dioxide", "Methane", "Nitrogen", "Water vapor"],
            correctAnswer: 2
        },
        {
            question: "What does the Earth's surface do with the shortwave solar radiation it absorbs?",
            options: ["Turns it into matter", "Emits it as longwave infrared radiation", "Destroys it", "Reflects it completely"],
            correctAnswer: 1
        },
        {
            question: "How do greenhouse gases warm the Earth?",
            options: ["By absorbing and re-radiating infrared radiation", "By generating their own heat", "By reflecting sunlight", "By destroying the ozone layer"],
            correctAnswer: 0
        },
        {
            question: "What is 'albedo' in the context of the Earth's climate?",
            options: ["The rate of carbon emission", "The measure of reflectivity of Earth's surface", "The speed of the wind", "The density of the atmosphere"],
            correctAnswer: 1
        },
        {
            question: "Which greenhouse gas is the most abundant in the Earth's atmosphere?",
            options: ["Methane", "Ozone", "Carbon dioxide", "Water vapor"],
            correctAnswer: 3
        }
    ];

    return group;
}
