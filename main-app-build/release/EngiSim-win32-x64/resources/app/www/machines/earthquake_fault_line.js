export function createEarthquakeFault(THREE) {
    const group = new THREE.Group();

    // 1. Left Tectonic Block
    const leftBlockGeo = new THREE.BoxGeometry(9.8, 10, 10);
    const leftBlockMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const leftBlock = new THREE.Mesh(leftBlockGeo, leftBlockMat);
    leftBlock.position.set(-5, 0, 0);
    group.add(leftBlock);

    // 2. Right Tectonic Block
    const rightBlockGeo = new THREE.BoxGeometry(9.8, 10, 10);
    const rightBlockMat = new THREE.MeshStandardMaterial({ color: 0xa0522d });
    const rightBlock = new THREE.Mesh(rightBlockGeo, rightBlockMat);
    rightBlock.position.set(5, 0, 0);
    group.add(rightBlock);

    // 3. Fault Plane (The gap/slip surface between the blocks)
    const faultPlaneGeo = new THREE.PlaneGeometry(10, 10);
    const faultPlaneMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const faultPlane = new THREE.Mesh(faultPlaneGeo, faultPlaneMat);
    faultPlane.rotation.y = Math.PI / 2;
    group.add(faultPlane);

    // 4. Focus / Hypocenter (Where the earthquake originates underground)
    const focusGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const focusMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const hypocenter = new THREE.Mesh(focusGeo, focusMat);
    hypocenter.position.set(0, -2, 0);
    group.add(hypocenter);

    // 5. Epicenter (Point on the surface directly above focus)
    const epiGeo = new THREE.CylinderGeometry(0.5, 0, 1, 16);
    const epiMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const epicenter = new THREE.Mesh(epiGeo, epiMat);
    epicenter.position.set(0, 5.5, 0);
    group.add(epicenter);

    // 6. P-Waves (Primary waves, compressional, radiating out fast)
    const pWaveGeo = new THREE.SphereGeometry(1, 32, 32);
    const pWaveMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.5 });
    const pWave = new THREE.Mesh(pWaveGeo, pWaveMat);
    pWave.position.set(0, -2, 0);
    group.add(pWave);

    // 7. S-Waves (Secondary waves, shear, radiating slower)
    const sWaveGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const sWaveMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.5 });
    const sWave = new THREE.Mesh(sWaveGeo, sWaveMat);
    sWave.position.set(0, -2, 0);
    group.add(sWave);

    // 8. Surface Waves (Rippling along the top crust)
    const surfaceWaveGeo = new THREE.RingGeometry(0.5, 1, 32);
    const surfaceWaveMat = new THREE.MeshBasicMaterial({ color: 0xffa500, side: THREE.DoubleSide });
    const surfaceWave = new THREE.Mesh(surfaceWaveGeo, surfaceWaveMat);
    surfaceWave.rotation.x = Math.PI / 2;
    surfaceWave.position.set(0, 5.1, 0);
    group.add(surfaceWave);

    // 9. Stress Accumulation Indicator (Arrows showing friction direction)
    const arrowHelperL = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-2, 5.5, 0), 2, 0xff0000);
    const arrowHelperR = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(2, 5.5, 0), 2, 0xff0000);
    group.add(arrowHelperL);
    group.add(arrowHelperR);

    // 10. Building (To show surface destruction/shaking)
    const buildingGeo = new THREE.BoxGeometry(2, 4, 2);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.set(-3, 7, 0);
    group.add(building);

    group.userData.animate = function(time) {
        // Earthquake Cycle (Build up stress, then snap)
        const cycle = time % 5;
        
        if (cycle < 4) {
            // Building stress (Blocks slightly deform/shift)
            leftBlock.position.z = cycle * 0.1;
            rightBlock.position.z = -cycle * 0.1;
            pWave.scale.setScalar(0.01);
            sWave.scale.setScalar(0.01);
            surfaceWave.scale.setScalar(0.01);
            building.rotation.z = 0;
            hypocenter.scale.setScalar(1);
        } else {
            // SNAP! Earthquake
            leftBlock.position.z = 1;
            rightBlock.position.z = -1;
            
            // Radiating waves
            pWave.scale.setScalar(1 + (cycle - 4) * 15);
            sWave.scale.setScalar(1 + (cycle - 4) * 10);
            surfaceWave.scale.setScalar(1 + (cycle - 4) * 8);
            
            // Hypocenter flashes
            hypocenter.scale.setScalar(1 + Math.sin(time * 20) * 0.5);
            
            // Building shakes
            building.rotation.z = Math.sin(time * 30) * 0.1;
        }
    };

    group.userData.quiz = [
        { question: "What is the underground point of origin of an earthquake called?", options: ["Hypocenter (Focus)", "Epicenter", "Fault line", "Mantle"], answer: 0 },
        { question: "What is the point on the surface directly above the focus?", options: ["Epicenter", "Hypocenter", "Trench", "Caldera"], answer: 0 },
        { question: "Which seismic waves travel the fastest?", options: ["P-Waves", "S-Waves", "Surface Waves", "Love Waves"], answer: 0 },
        { question: "Which fault type involves plates sliding horizontally past each other?", options: ["Strike-Slip (Transform)", "Normal", "Reverse", "Thrust"], answer: 0 },
        { question: "What builds up along the fault line before an earthquake?", options: ["Stress / Friction", "Magma", "Water pressure", "Gas"], answer: 0 },
        { question: "What scale measures the total energy released by an earthquake?", options: ["Moment Magnitude", "Richter", "Mercalli", "Fujita"], answer: 0 }
    ];

    return group;
}
