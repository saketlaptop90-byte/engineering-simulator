export function createIceAlbedoFeedback(THREE) {
    const group = new THREE.Group();

    // 1. Solar input
    const sunGeo = new THREE.SphereGeometry(2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(-10, 15, 0);
    sun.userData.name = "Solar input";
    group.add(sun);

    // 2. Ice sheet
    const iceGeo = new THREE.CylinderGeometry(8, 8, 2, 32);
    const iceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const iceSheet = new THREE.Mesh(iceGeo, iceMat);
    iceSheet.position.set(0, 1, 0);
    iceSheet.userData.name = "Ice sheet";
    group.add(iceSheet);

    // 3. Dark ocean water
    const oceanGeo = new THREE.CylinderGeometry(12, 12, 1.8, 32);
    const oceanMat = new THREE.MeshStandardMaterial({ color: 0x000033 });
    const oceanWater = new THREE.Mesh(oceanGeo, oceanMat);
    oceanWater.position.set(0, 0.9, 0);
    oceanWater.userData.name = "Dark ocean water";
    group.add(oceanWater);

    // 4. Reflected radiation
    const refGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
    const refMat = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
    const reflected = new THREE.Mesh(refGeo, refMat);
    reflected.position.set(2, 6, 0);
    reflected.rotation.z = -Math.PI / 6;
    reflected.userData.name = "Reflected radiation";
    group.add(reflected);

    // 5. Absorbed radiation
    const absGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 8);
    const absMat = new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.8 });
    const absorbed = new THREE.Mesh(absGeo, absMat);
    absorbed.position.set(-6, 3, 0);
    absorbed.rotation.z = Math.PI / 4;
    absorbed.userData.name = "Absorbed radiation";
    group.add(absorbed);

    // 6. Melting edge
    const edgeGeo = new THREE.TorusGeometry(8, 0.3, 16, 32);
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb });
    const meltingEdge = new THREE.Mesh(edgeGeo, edgeMat);
    meltingEdge.position.set(0, 2, 0);
    meltingEdge.rotation.x = Math.PI / 2;
    meltingEdge.userData.name = "Melting edge";
    group.add(meltingEdge);

    // 7. Permafrost layer
    const permaGeo = new THREE.CylinderGeometry(10, 10, 2, 32);
    const permaMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const permafrost = new THREE.Mesh(permaGeo, permaMat);
    permafrost.position.set(0, -1, 0);
    permafrost.userData.name = "Permafrost layer";
    group.add(permafrost);

    // 8. Released methane
    const methaneGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const methaneMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.6 });
    const methane = new THREE.Mesh(methaneGeo, methaneMat);
    methane.position.set(5, 0, 5);
    methane.userData.name = "Released methane";
    group.add(methane);

    // 9. Surface temperature node
    const tempGeo = new THREE.BoxGeometry(1, 4, 1);
    const tempMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const tempNode = new THREE.Mesh(tempGeo, tempMat);
    tempNode.position.set(-9, 2, 5);
    tempNode.userData.name = "Surface temperature node";
    group.add(tempNode);

    // 10. Cloud formation
    const cloudGeo = new THREE.DodecahedronGeometry(2);
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.8 });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.position.set(5, 12, -2);
    cloud.userData.name = "Cloud formation";
    group.add(cloud);

    // Add ambient and directional light
    const ambientLight = new THREE.AmbientLight(0x404040);
    group.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-10, 10, 0);
    group.add(dirLight);

    let time = 0;

    group.userData.animate = function(delta) {
        time += delta;

        // Animation: ice melting (Ice sheet shrinks)
        const iceScale = 0.7 + 0.3 * Math.cos(time * 0.5); 
        iceSheet.scale.set(iceScale, 1, iceScale);
        meltingEdge.scale.set(iceScale, iceScale, 1);
        
        // Exposing dark ocean (Ocean remains same, but ice shrinks, effectively exposing it)
        
        // Absorbed radiation pulsing/increasing (more intense as ice melts)
        const absorptionIntensity = 1.0 - (iceScale - 0.4) / 0.6; // increases as ice shrinks
        absorbed.scale.set(1 + absorptionIntensity, 1 + absorptionIntensity, 1);
        absorbed.material.opacity = 0.5 + 0.5 * absorptionIntensity;
        
        // Reflected radiation decreasing as ice melts
        const reflectionIntensity = Math.max(0, (iceScale - 0.4) / 0.6); // decreases as ice shrinks
        reflected.scale.set(reflectionIntensity, reflectionIntensity, 1);

        // Methane bubbling up from permafrost
        methane.position.y = (time * 2) % 10;
        methane.scale.setScalar(1 + (methane.position.y / 5));
        
        // Temperature node going up
        tempNode.scale.y = 1 + absorptionIntensity * 0.5;
        tempNode.position.y = 2 + (tempNode.scale.y - 1) * 2;
    };

    group.userData.questions = [
        {
            question: "What does the 'albedo' of a surface refer to?",
            options: [
                "Its ability to reflect sunlight",
                "Its total mass",
                "Its heat capacity",
                "Its melting point"
            ],
            correctAnswer: 0
        },
        {
            question: "Why does dark ocean water absorb more heat than ice?",
            options: [
                "It has a higher albedo",
                "It has a lower albedo",
                "It is a liquid",
                "It contains salt"
            ],
            correctAnswer: 1
        },
        {
            question: "What happens to Earth's albedo as polar ice melts?",
            options: [
                "It increases",
                "It decreases",
                "It remains the same",
                "It fluctuates randomly"
            ],
            correctAnswer: 1
        },
        {
            question: "How does the ice-albedo feedback loop act?",
            options: [
                "As a positive feedback loop amplifying warming",
                "As a negative feedback loop cooling the Earth",
                "As a neutral process",
                "As a completely reversible cycle"
            ],
            correctAnswer: 0
        },
        {
            question: "Which secondary feedback mechanism is often triggered by polar warming?",
            options: [
                "Methane release from permafrost",
                "Increased volcanic activity",
                "Rapid tectonic plate shifting",
                "Decreased solar radiation"
            ],
            correctAnswer: 0
        },
        {
            question: "What effect does cloud formation have on this feedback?",
            options: [
                "It can both reflect sunlight and trap heat",
                "It only traps heat",
                "It only reflects sunlight",
                "It has no measurable effect"
            ],
            correctAnswer: 0
        }
    ];

    return group;
}
