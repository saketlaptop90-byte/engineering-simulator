export function createGeyserSystem(THREE) {
    const group = new THREE.Group();

    // 1. Surface Crust (Top ground layer)
    const crustGeo = new THREE.BoxGeometry(20, 2, 20);
    const crustMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    crust.position.y = 1;
    group.add(crust);

    // 2. Geyser Cone (Sinter deposit around opening)
    const coneGeo = new THREE.ConeGeometry(3, 2, 16);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = 2.5;
    group.add(cone);

    // 3. Plumbing System / Conduit (Vertical tube, cutaway)
    const tubeGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16, 1, false, 0, Math.PI);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.y = -3;
    group.add(tube);

    // 4. Reservoir (Underground water cavern)
    const cavernGeo = new THREE.SphereGeometry(3, 16, 16, 0, Math.PI);
    const cavernMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const cavern = new THREE.Mesh(cavernGeo, cavernMat);
    cavern.position.y = -8;
    group.add(cavern);

    // 5. Water Column (Inside the tube and cavern)
    const waterColumnGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16, 1, false, 0, Math.PI);
    const waterColumnMat = new THREE.MeshPhysicalMaterial({ color: 0x1ca3ec, transparent: true, opacity: 0.8 });
    const waterColumn = new THREE.Mesh(waterColumnGeo, waterColumnMat);
    waterColumn.position.y = -3;
    group.add(waterColumn);

    // 6. Magma Heat Source (Deep below)
    const heatGeo = new THREE.BoxGeometry(10, 2, 10);
    const heatMat = new THREE.MeshPhongMaterial({ color: 0xff4500 });
    const heatSource = new THREE.Mesh(heatGeo, heatMat);
    heatSource.position.y = -12;
    group.add(heatSource);

    // 7. Heat Transfer Rocks (Glowing rocks above magma)
    const hotRockGeo = new THREE.DodecahedronGeometry(2);
    const hotRockMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const hotRock1 = new THREE.Mesh(hotRockGeo, hotRockMat);
    hotRock1.position.set(-2, -10, 0);
    const hotRock2 = new THREE.Mesh(hotRockGeo, hotRockMat);
    hotRock2.position.set(2, -10, 0);
    group.add(hotRock1);
    group.add(hotRock2);

    // 8. Steam Bubbles (Rising in the water column)
    const bubbleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bubbles = [];
    for (let i = 0; i < 5; i++) {
        const b = new THREE.Mesh(bubbleGeo, bubbleMat);
        b.position.set(0, -7 + i*1.5, 0);
        group.add(b);
        bubbles.push(b);
    }

    // 9. Eruption Jet (Water shooting out of the cone)
    const jetGeo = new THREE.CylinderGeometry(0.2, 1, 6, 8);
    const jetMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }); // Hidden initially
    const eruptionJet = new THREE.Mesh(jetGeo, jetMat);
    eruptionJet.position.y = 6;
    group.add(eruptionJet);

    // 10. Geyserite Deposits (Silica formations around the cone)
    const depositGeo = new THREE.TorusGeometry(3.5, 0.5, 8, 24);
    const depositMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
    const deposit = new THREE.Mesh(depositGeo, depositMat);
    deposit.rotation.x = Math.PI / 2;
    deposit.position.y = 2;
    group.add(deposit);

    group.userData.animate = function(time) {
        // Steam bubbles rising constantly
        bubbles.forEach((b, index) => {
            b.position.y += 0.05;
            if (b.position.y > 1) b.position.y = -8;
            // Bubbles expand as pressure drops
            const scale = 1 + ((b.position.y + 8) / 9) * 2;
            b.scale.setScalar(scale);
        });

        // Eruption cycle (every ~6 seconds)
        const cycle = time % 6;
        if (cycle > 4) {
            // Erupting
            eruptionJet.material.opacity = 0.8 + Math.sin(time * 20) * 0.2; // Flickering
            waterColumn.position.y = -4; // Level drops
        } else {
            // Filling
            eruptionJet.material.opacity = 0;
            waterColumn.position.y = -3; // Full
        }
        
        // Heat source pulsing
        heatSource.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    };

    group.userData.quiz = [
        { question: "What is the primary heat source for a geyser?", options: ["Magma", "Friction", "Solar Energy", "Radioactivity"], answer: 0 },
        { question: "Why doesn't the water boil at normal temperatures deep underground?", options: ["High Pressure", "High Salinity", "Low Oxygen", "Magic"], answer: 0 },
        { question: "What mineral typically forms the cone of a geyser?", options: ["Silica (Geyserite)", "Calcium Carbonate", "Iron Oxide", "Salt"], answer: 0 },
        { question: "What causes the water to suddenly erupt?", options: ["Flashing to Steam", "Earthquake", "Tide forces", "Wind"], answer: 0 },
        { question: "Where is the most famous geyser, Old Faithful, located?", options: ["Yellowstone", "Iceland", "New Zealand", "Kamchatka"], answer: 0 },
        { question: "What acts as the 'plumbing' for a geyser?", options: ["Conduit / Tube", "Aquifer", "River", "Ocean"], answer: 0 }
    ];

    return group;
}
