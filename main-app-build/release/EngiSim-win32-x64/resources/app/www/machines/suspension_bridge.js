export function createSuspensionBridge(THREE) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x444444 });

    // Towers
    const towerGeo = new THREE.BoxGeometry(2, 12, 2);
    const t1 = new THREE.Mesh(towerGeo, mat);
    t1.position.set(-6, 0, 0);
    group.add(t1);
    
    const t2 = new THREE.Mesh(towerGeo, mat);
    t2.position.set(6, 0, 0);
    group.add(t2);

    // Deck
    const deckGeo = new THREE.BoxGeometry(24, 0.5, 3);
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = -3;
    group.add(deck);

    // Main Suspension Cable (Parabola)
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-12, 6, 0),
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(12, 6, 0)
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.2, 8, false);
    const cable = new THREE.Mesh(tubeGeo, cableMat);
    group.add(cable);

    // Suspenders (vertical cables)
    for(let x = -11; x <= 11; x += 1.5) {
        if (Math.abs(x) === 6) continue; // Skip tower
        const yTop = (Math.pow(x, 2) * (8 / 144)) - 2; // Approximate parabola
        const yBot = -3;
        const length = yTop - yBot;
        if (length <= 0) continue;
        
        const suspGeo = new THREE.CylinderGeometry(0.05, 0.05, length);
        const susp = new THREE.Mesh(suspGeo, cableMat);
        susp.position.set(x, yBot + length/2, 0);
        group.add(susp);
    }

    // Traffic (moving cars)
    const carGeo = new THREE.BoxGeometry(0.8, 0.4, 0.4);
    const carMat1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const carMat2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    
    const cars = [];
    const car1 = new THREE.Mesh(carGeo, carMat1);
    car1.position.set(-12, -2.5, 0.5);
    group.add(car1);
    cars.push({ mesh: car1, speed: 0.1, dir: 1, z: 0.5 });
    
    const car2 = new THREE.Mesh(carGeo, carMat2);
    car2.position.set(12, -2.5, -0.5);
    group.add(car2);
    cars.push({ mesh: car2, speed: 0.12, dir: -1, z: -0.5 });

    group.userData.animate = function(time) {
        // Deck oscillates slightly due to wind/traffic
        deck.position.y = -3 + Math.sin(time * 2) * 0.1;
        
        // Move cars
        cars.forEach(car => {
            car.mesh.position.x += car.speed * car.dir;
            car.mesh.position.y = deck.position.y + 0.5;
            if (car.mesh.position.x > 12 && car.dir === 1) car.mesh.position.x = -12;
            if (car.mesh.position.x < -12 && car.dir === -1) car.mesh.position.x = 12;
        });
    };

    group.userData.quiz = [
        { question: "What element carries the main tension forces?", options: ["Main suspension cables", "The towers", "The deck", "The vertical suspenders"], answer: 0 },
        { question: "What force primarily acts on the bridge's towers?", options: ["Compression", "Tension", "Torsion", "Shear"], answer: 0 },
        { question: "Why is a suspension bridge deck often built as a truss or aerodynamically shaped?", options: ["To prevent wind-induced aerodynamic instability", "To save steel", "To make it heavier", "To increase traffic speed"], answer: 0 }
    ];

    return group;
}
