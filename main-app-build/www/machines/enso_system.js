export function createEnsoSystem(THREE) {
    const group = new THREE.Group();
    group.name = "ENSO System";

    // Materials
    const oceanMat = new THREE.MeshPhongMaterial({ color: 0x0044aa, transparent: true, opacity: 0.6 });
    const thermoclineMat = new THREE.MeshPhongMaterial({ color: 0x002266 });
    const warmPoolMat = new THREE.MeshPhongMaterial({ color: 0xdd3300, transparent: true, opacity: 0.8 });
    const upwellingMat = new THREE.MeshPhongMaterial({ color: 0x00aa88 });
    const sstMat = new THREE.MeshPhongMaterial({ color: 0xffaa00, transparent: true, opacity: 0.4 });
    const windMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const walkerMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true });
    const cloudMat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
    const rossbyMat = new THREE.MeshBasicMaterial({ color: 0xaa00aa });
    const kelvinMat = new THREE.MeshBasicMaterial({ color: 0x00aaaa });

    // 1. Equatorial Pacific Ocean (Base volume)
    const oceanGeo = new THREE.BoxGeometry(20, 4, 10);
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    group.add(ocean);

    // 2. Thermocline layer (Plane dividing warm and cold)
    const thermoclineGeo = new THREE.PlaneGeometry(20, 10);
    const thermocline = new THREE.Mesh(thermoclineGeo, thermoclineMat);
    thermocline.rotation.x = -Math.PI / 2;
    thermocline.position.y = -0.5;
    group.add(thermocline);

    // 3. Warm pool (Western Pacific initially)
    const warmPoolGeo = new THREE.BoxGeometry(8, 2, 8);
    const warmPool = new THREE.Mesh(warmPoolGeo, warmPoolMat);
    warmPool.position.set(-5, 1, 0);
    group.add(warmPool);

    // 4. Upwelling coast (Eastern Pacific)
    const upwellingGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const upwelling = new THREE.Mesh(upwellingGeo, upwellingMat);
    upwelling.position.set(9, -1, 0);
    group.add(upwelling);

    // 5. Sea surface temperature anomalies
    const sstGeo = new THREE.PlaneGeometry(19, 9);
    const sstAnomalies = new THREE.Mesh(sstGeo, sstMat);
    sstAnomalies.rotation.x = -Math.PI / 2;
    sstAnomalies.position.y = 2.1;
    group.add(sstAnomalies);

    // 6. Trade winds (Arrows pointing West)
    const windGroup = new THREE.Group();
    const windGeo = new THREE.CylinderGeometry(0.2, 0.5, 3);
    const wind1 = new THREE.Mesh(windGeo, windMat);
    wind1.rotation.z = Math.PI / 2;
    wind1.position.set(0, 4, 2);
    const wind2 = new THREE.Mesh(windGeo, windMat);
    wind2.rotation.z = Math.PI / 2;
    wind2.position.set(0, 4, -2);
    windGroup.add(wind1, wind2);
    group.add(windGroup);

    // 7. Walker circulation (Loop)
    const walkerGeo = new THREE.TorusGeometry(6, 0.2, 8, 24);
    const walker = new THREE.Mesh(walkerGeo, walkerMat);
    walker.position.set(0, 6, 0);
    walker.scale.set(1, 0.5, 1);
    group.add(walker);

    // 8. Convection zone (Clouds above warm pool)
    const convectionGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const convection = new THREE.Mesh(convectionGeo, cloudMat);
    convection.position.set(-5, 5, 0);
    group.add(convection);

    // 9. Rossby waves (Off-equator)
    const rossbyGeo = new THREE.TorusGeometry(2, 0.1, 8, 16, Math.PI);
    const rossby = new THREE.Mesh(rossbyGeo, rossbyMat);
    rossby.rotation.x = Math.PI / 2;
    rossby.position.set(-2, 2, 3);
    group.add(rossby);

    // 10. Kelvin waves (Equatorial)
    const kelvinGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const kelvin = new THREE.Mesh(kelvinGeo, kelvinMat);
    kelvin.rotation.z = Math.PI / 2;
    kelvin.position.set(-2, 0, 0);
    group.add(kelvin);

    // Animation function
    group.userData.update = function(time) {
        // ENSO cycle simulated with a slow sine wave
        // phase: -1 (La Niña) to 1 (El Niño)
        const phase = Math.sin(time * 0.6); 
        
        // Warm pool moves east during El Niño
        warmPool.position.x = -5 + (phase + 1) * 3;
        
        // Thermocline depth changes and tilts
        thermocline.rotation.y = phase * 0.05;
        thermocline.position.y = -0.5 - phase * 0.5;
        
        // Convection location shifts with the warm pool
        convection.position.x = warmPool.position.x;
        convection.scale.setScalar(1 + phase * 0.2);
        
        // Shifting trade winds (weaken during El Niño)
        const windStrength = 1 - (phase + 1) * 0.4;
        windGroup.scale.x = Math.max(0.1, windStrength);
        windGroup.position.x = Math.cos(time * 2) * 0.5;
        
        // Upwelling changes
        upwelling.position.y = -1 - (phase + 1) * 0.5;
        
        // Wave propagation
        rossby.position.x = -2 - (time % 5);
        if (rossby.position.x < -10) rossby.position.x = 10;
        
        kelvin.position.x = -5 + (time * 2 % 15);
    };

    group.userData.quiz = [
        {
            question: "What drives the normal Walker circulation in the Pacific?",
            options: ["Trade winds", "Rossby waves", "Coriolis force", "Lunar tides"],
            correctAnswer: 0
        },
        {
            question: "During an El Niño event, what happens to the trade winds?",
            options: ["They strengthen", "They weaken or reverse", "They turn into hurricanes", "They become purely vertical"],
            correctAnswer: 1
        },
        {
            question: "What happens to the thermocline in the eastern Pacific during El Niño?",
            options: ["It becomes shallower", "It disappears completely", "It deepens", "It turns vertical"],
            correctAnswer: 2
        },
        {
            question: "Where does the primary convection zone shift during an El Niño event?",
            options: ["Westward toward Indonesia", "Eastward toward the central/eastern Pacific", "Northward to the Arctic", "Southward to Antarctica"],
            correctAnswer: 1
        },
        {
            question: "What role do Kelvin waves play in ENSO dynamics?",
            options: ["They reflect off South America to create El Niño", "They transport warm water eastward across the equator", "They move cold water westward", "They create hurricanes in the Atlantic"],
            correctAnswer: 1
        },
        {
            question: "How does coastal upwelling off South America change during El Niño?",
            options: ["It intensifies", "It weakens, reducing nutrient supply", "It brings more fish", "It turns into downwelling of warm water only"],
            correctAnswer: 1
        }
    ];

    return group;
}
