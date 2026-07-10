export function createIonThruster(THREE) {
    const group = new THREE.Group();

    // 1. Casing
    const casingGeo = new THREE.CylinderGeometry(2, 2, 5, 32);
    const casingMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.rotation.x = Math.PI / 2;
    group.add(casing);

    // 2. Discharge Chamber
    const chamberGeo = new THREE.CylinderGeometry(1.8, 1.8, 4.8, 32);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.8 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.rotation.x = Math.PI / 2;
    chamber.position.z = -0.1;
    group.add(chamber);

    // 3. Propellant Feed
    const feedGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const feedMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
    const feed = new THREE.Mesh(feedGeo, feedMat);
    feed.rotation.x = Math.PI / 2;
    feed.position.z = -2.8;
    group.add(feed);

    // 4. Cathode
    const cathodeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, emissive: 0x221100 });
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
    cathode.rotation.x = Math.PI / 2;
    cathode.position.z = -2.0;
    group.add(cathode);

    // 5. Anode
    const anodeGeo = new THREE.CylinderGeometry(1.7, 1.7, 3, 32, 1, true);
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.3, side: THREE.DoubleSide });
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    anode.rotation.x = Math.PI / 2;
    anode.position.z = -0.5;
    group.add(anode);

    // 6. Magnets
    const magnetsGroup = new THREE.Group();
    const magnetsGeo = new THREE.TorusGeometry(1.85, 0.1, 16, 32);
    const magnetsMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.5 });
    const magnet1 = new THREE.Mesh(magnetsGeo, magnetsMat);
    magnet1.position.z = -1;
    const magnet2 = new THREE.Mesh(magnetsGeo, magnetsMat);
    magnet2.position.z = 0;
    const magnet3 = new THREE.Mesh(magnetsGeo, magnetsMat);
    magnet3.position.z = 1;
    magnetsGroup.add(magnet1, magnet2, magnet3);
    group.add(magnetsGroup);

    // 7. Screen Grid
    const screenGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.05, 32);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.7, roughness: 0.4, wireframe: true });
    const screenGrid = new THREE.Mesh(screenGeo, screenMat);
    screenGrid.rotation.x = Math.PI / 2;
    screenGrid.position.z = 2.4;
    group.add(screenGrid);

    // 8. Accelerator Grid
    const accelGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.05, 32);
    const accelMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3, wireframe: true });
    const accelGrid = new THREE.Mesh(accelGeo, accelMat);
    accelGrid.rotation.x = Math.PI / 2;
    accelGrid.position.z = 2.5;
    group.add(accelGrid);

    // 9. Neutralizer
    const neutralizerGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const neutralizerMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.5 });
    const neutralizer = new THREE.Mesh(neutralizerGeo, neutralizerMat);
    neutralizer.position.set(2.2, 0, 2.5);
    neutralizer.rotation.x = Math.PI / 2;
    neutralizer.rotation.y = -Math.PI / 6;
    group.add(neutralizer);

    // 10. Plasma Stream
    const plasmaStream = new THREE.Group();
    plasmaStream.position.z = 6.5;

    const plasmaGeo = new THREE.CylinderGeometry(1.7, 2.5, 8, 32, 1, true);
    const plasmaMat = new THREE.MeshBasicMaterial({ 
        color: 0x00aaff, 
        transparent: true, 
        opacity: 0.6, 
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const plasmaOuter = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasmaOuter.rotation.x = Math.PI / 2;
    
    const innerPlasmaGeo = new THREE.CylinderGeometry(1.0, 1.5, 6, 32, 1, true);
    const innerPlasmaMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.8, 
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const innerPlasma = new THREE.Mesh(innerPlasmaGeo, innerPlasmaMat);
    innerPlasma.rotation.x = Math.PI / 2;
    innerPlasma.position.z = -1; 
    
    plasmaStream.add(plasmaOuter, innerPlasma);
    group.add(plasmaStream);

    // Animation
    group.tick = (time) => {
        // Pulse plasma stream opacity
        plasmaMat.opacity = 0.4 + 0.2 * Math.sin(time * 15);
        innerPlasmaMat.opacity = 0.6 + 0.2 * Math.sin(time * 15);
        
        // Pulse cathode emission
        cathode.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * 5);
        
        // Slightly rotate the plasma stream to simulate flow
        plasmaStream.rotation.z = time * 2;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary purpose of the electron cathode in an ion thruster?",
            options: [
                "To emit electrons that ionize the propellant",
                "To accelerate ions out of the engine",
                "To neutralize the ion beam",
                "To store the propellant gas"
            ],
            correctAnswer: 0
        },
        {
            question: "Which grid has a positive potential to extract ions from the plasma?",
            options: [
                "Accelerator grid",
                "Screen grid",
                "Neutralizer grid",
                "Decelerator grid"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the neutralizer in an ion thruster?",
            options: [
                "To cool the thruster",
                "To emit electrons into the ion beam to prevent spacecraft charging",
                "To turn ions back into neutral gas",
                "To act as a secondary thrust mechanism"
            ],
            correctAnswer: 1
        },
        {
            question: "Which gas is commonly used as a propellant in modern ion thrusters?",
            options: [
                "Hydrogen",
                "Oxygen",
                "Xenon",
                "Nitrogen"
            ],
            correctAnswer: 2
        },
        {
            question: "What role do the magnets play in the discharge chamber?",
            options: [
                "They steer the spacecraft",
                "They increase the path length of electrons to improve ionization efficiency",
                "They generate the electricity for the grids",
                "They hold the thruster together"
            ],
            correctAnswer: 1
        },
        {
            question: "Compared to chemical rockets, how are the thrust and specific impulse of an ion thruster characterized?",
            options: [
                "High thrust, low specific impulse",
                "Low thrust, low specific impulse",
                "Low thrust, very high specific impulse",
                "High thrust, very high specific impulse"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
