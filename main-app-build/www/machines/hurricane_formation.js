export function createHurricaneFormation(THREE) {
    const group = new THREE.Group();
    group.userData.machineName = "Hurricane Formation";

    // 1. Warm ocean surface
    const oceanGeo = new THREE.CylinderGeometry(15, 15, 0.5, 64);
    const oceanMat = new THREE.MeshStandardMaterial({color: 0x005588, transparent: true, opacity: 0.8});
    const oceanSurface = new THREE.Mesh(oceanGeo, oceanMat);
    oceanSurface.position.y = 0;
    oceanSurface.userData.name = "Warm ocean surface";
    group.add(oceanSurface);

    // 2. Evaporation zone
    const evapGeo = new THREE.CylinderGeometry(10, 10, 2, 32);
    const evapMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.2});
    const evaporationZone = new THREE.Mesh(evapGeo, evapMat);
    evaporationZone.position.y = 1.25;
    evaporationZone.userData.name = "Evaporation zone";
    group.add(evaporationZone);

    // 3. Low pressure center
    const lowPressGeo = new THREE.SphereGeometry(1, 16, 16);
    const lowPressMat = new THREE.MeshStandardMaterial({color: 0xff0000, wireframe: true});
    const lowPressureCenter = new THREE.Mesh(lowPressGeo, lowPressMat);
    lowPressureCenter.position.y = 1;
    lowPressureCenter.userData.name = "Low pressure center";
    group.add(lowPressureCenter);

    // 4. Coriolis force deflector
    const coriolisGeo = new THREE.TorusGeometry(6, 0.2, 8, 64);
    const coriolisMat = new THREE.MeshStandardMaterial({color: 0x00ff00});
    const coriolisDeflector = new THREE.Mesh(coriolisGeo, coriolisMat);
    coriolisDeflector.rotation.x = Math.PI / 2;
    coriolisDeflector.position.y = 3;
    coriolisDeflector.userData.name = "Coriolis force deflector";
    group.add(coriolisDeflector);

    // 5. Eye of the storm
    const eyeGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
    const eyeMat = new THREE.MeshStandardMaterial({color: 0xddddff, transparent: true, opacity: 0.1});
    const eyeOfTheStorm = new THREE.Mesh(eyeGeo, eyeMat);
    eyeOfTheStorm.position.y = 5.5;
    eyeOfTheStorm.userData.name = "Eye of the storm";
    group.add(eyeOfTheStorm);

    // 6. Eyewall
    const eyewallGeo = new THREE.CylinderGeometry(3, 3, 10, 32, 1, true);
    const eyewallMat = new THREE.MeshStandardMaterial({color: 0x666666, transparent: true, opacity: 0.8, side: THREE.DoubleSide});
    const eyewall = new THREE.Mesh(eyewallGeo, eyewallMat);
    eyewall.position.y = 5.5;
    eyewall.userData.name = "Eyewall";
    group.add(eyewall);

    // 7. Spiral rainbands
    const rainbandGroup = new THREE.Group();
    const rainbandMat = new THREE.MeshStandardMaterial({color: 0x8888aa, transparent: true, opacity: 0.6});
    for(let i=0; i<4; i++) {
        const bandGeo = new THREE.TorusGeometry(5 + i, 0.5, 16, 64, Math.PI);
        const band = new THREE.Mesh(bandGeo, rainbandMat);
        band.rotation.x = Math.PI / 2;
        band.rotation.z = (Math.PI / 2) * i;
        band.position.y = 4 + i * 0.5;
        rainbandGroup.add(band);
    }
    rainbandGroup.userData.name = "Spiral rainbands";
    group.add(rainbandGroup);

    // 8. Outflow cirrus shield
    const outflowGeo = new THREE.CylinderGeometry(14, 3, 1.5, 32);
    const outflowMat = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
    const outflowCirrusShield = new THREE.Mesh(outflowGeo, outflowMat);
    outflowCirrusShield.position.y = 11;
    outflowCirrusShield.userData.name = "Outflow cirrus shield";
    group.add(outflowCirrusShield);

    // 9. Latent heat release
    const heatGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const heatMat = new THREE.MeshStandardMaterial({color: 0xff5500, emissive: 0xff5500});
    const latentHeatGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const heatPoint = new THREE.Mesh(heatGeo, heatMat);
        heatPoint.position.set(Math.cos(i * Math.PI/4) * 2.5, 5 + Math.random()*2, Math.sin(i * Math.PI/4) * 2.5);
        latentHeatGroup.add(heatPoint);
    }
    latentHeatGroup.userData.name = "Latent heat release";
    group.add(latentHeatGroup);

    // 10. Wind shear
    const shearGroup = new THREE.Group();
    const shearGeo = new THREE.ConeGeometry(0.5, 2, 16);
    const shearMat = new THREE.MeshStandardMaterial({color: 0xaa00aa});
    for(let i=0; i<3; i++) {
        const arrow = new THREE.Mesh(shearGeo, shearMat);
        arrow.rotation.z = -Math.PI / 2;
        arrow.position.set(-5 + i*5, 13, 0);
        shearGroup.add(arrow);
    }
    shearGroup.userData.name = "Wind shear";
    group.add(shearGroup);

    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        
        // Rotation
        eyewall.rotation.y = time * 0.5;
        eyeOfTheStorm.rotation.y = time * 0.8;
        rainbandGroup.rotation.y = time * 0.3;
        outflowCirrusShield.rotation.y = time * 0.2;
        coriolisDeflector.rotation.z = time; // Rotated by X initially
        
        // Air rising (evaporation pulsing)
        evaporationZone.scale.y = 1 + 0.2 * Math.sin(time * 2);
        
        // Heat pulsating and rising
        latentHeatGroup.children.forEach((point, index) => {
            point.scale.setScalar(1 + 0.5 * Math.sin(time * 3 + index));
            point.position.y += delta * 2;
            if(point.position.y > 9) {
                point.position.y = 3;
            }
        });

        // Wind shear moving
        shearGroup.position.x = Math.sin(time * 0.5) * 2;
    };

    group.userData.quiz = [
        {
            question: "What provides the primary energy source for a hurricane?",
            options: ["Wind shear", "Coriolis force", "Warm ocean surface", "High pressure center"],
            correctAnswer: 2
        },
        {
            question: "Which feature of a hurricane causes the spinning motion?",
            options: ["Outflow cirrus shield", "Coriolis force deflector", "Latent heat release", "Eye of the storm"],
            correctAnswer: 1
        },
        {
            question: "Where in a hurricane are the winds typically strongest?",
            options: ["The eye", "The eyewall", "Spiral rainbands", "Evaporation zone"],
            correctAnswer: 1
        },
        {
            question: "What is the relatively calm area at the center of the hurricane called?",
            options: ["Low pressure center", "Spiral rainbands", "Eye of the storm", "Eyewall"],
            correctAnswer: 2
        },
        {
            question: "What process releases energy that drives the storm's intensification?",
            options: ["Latent heat release", "Wind shear", "Ocean cooling", "Outflow creation"],
            correctAnswer: 0
        },
        {
            question: "Which of the following can weaken or tear apart a hurricane?",
            options: ["Warm ocean water", "High humidity", "Strong wind shear", "Low pressure"],
            correctAnswer: 2
        }
    ];

    return group;
}
