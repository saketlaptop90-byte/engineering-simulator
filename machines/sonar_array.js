export function createSonarArray(THREE) {
    const group = new THREE.Group();

    // Submarine Hull (Cutaway section)
    const hullGeo = new THREE.CylinderGeometry(5, 5, 10, 32, 1, false, Math.PI, Math.PI);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.5, side: THREE.DoubleSide });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    // Sonar Array (Cylindrical array of transducers on the bow)
    const arrayGeo = new THREE.CylinderGeometry(4.8, 4.8, 3, 32);
    const arrayMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const array = new THREE.Mesh(arrayGeo, arrayMat);
    array.rotation.z = Math.PI / 2;
    array.position.x = 4;
    group.add(array);

    // Transducers (Little dots on the array)
    const transGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const transMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    for (let r = 0; r < Math.PI * 2; r += Math.PI / 8) {
        for (let x = 3; x <= 5; x += 0.5) {
            const trans = new THREE.Mesh(transGeo, transMat);
            trans.position.set(x, Math.cos(r) * 4.85, Math.sin(r) * 4.85);
            trans.lookAt(new THREE.Vector3(x, 0, 0));
            group.add(trans);
        }
    }

    // Ping / Pings (Sound pulses going out)
    const pingGeo = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI, 0, Math.PI);
    const pingMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0 });
    
    const pings = [];
    for(let i=0; i<3; i++) {
        const ping = new THREE.Mesh(pingGeo, pingMat.clone());
        ping.position.x = 5;
        ping.rotation.z = -Math.PI / 2;
        group.add(ping);
        pings.push({ mesh: ping, offset: i * 3 });
    }

    // Target (Enemy sub or whale)
    const targetGeo = new THREE.BoxGeometry(2, 1, 1);
    const targetMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
    const target = new THREE.Mesh(targetGeo, targetMat);
    target.position.set(20, 2, -5);
    group.add(target);

    // Echo Return Wave
    const echoGeo = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI);
    const echoMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, transparent: true, opacity: 0 });
    const echo = new THREE.Mesh(echoGeo, echoMat);
    echo.position.copy(target.position);
    echo.rotation.z = Math.PI / 2;
    echo.lookAt(new THREE.Vector3(0,0,0));
    group.add(echo);

    group.userData.animate = function(time) {
        // Target moving slowly
        target.position.z = -5 + Math.sin(time * 0.5) * 5;
        echo.position.copy(target.position);

        // Ping expansion
        pings.forEach(p => {
            const phase = (time * 2 + p.offset) % 9;
            p.mesh.scale.setScalar(1 + phase * 4); // Expands to 36 distance
            
            // Fade out
            p.mesh.material.opacity = Math.max(0, 0.5 - (phase / 18));
            
            // Check collision with target
            const pingRadius = 1 + phase * 4;
            const distToTarget = Math.sqrt(Math.pow(target.position.x - 5, 2) + Math.pow(target.position.y, 2) + Math.pow(target.position.z, 2));
            
            if (Math.abs(pingRadius - distToTarget) < 1 && phase > 0) {
                // Echo triggers
                group.userData.echoPhase = 0;
            }
        });

        // Echo expansion (returning)
        if (group.userData.echoPhase !== undefined) {
            group.userData.echoPhase += 0.1;
            if (group.userData.echoPhase < 5) {
                echo.scale.setScalar(1 + group.userData.echoPhase * 4);
                echo.material.opacity = Math.max(0, 0.8 - (group.userData.echoPhase / 6));
            } else {
                echo.material.opacity = 0;
            }
        }
    };

    group.userData.quiz = [
        { question: "What does SONAR stand for?", options: ["Sound Navigation And Ranging", "Sonic Operational Network And Radar", "Sound Oscillating Network Array Receiver"], answer: 0 },
        { question: "Active sonar emits a ping. What does passive sonar do?", options: ["Only listens to sounds", "Emits low frequency hum", "Uses radar instead", "Creates bubbles"], answer: 0 },
        { question: "Why is sound used underwater instead of light or radar?", options: ["Sound travels far underwater, light and radio waves are absorbed rapidly", "Sound is cheaper", "Whales like sound", "Water is too dark"], answer: 0 }
    ];

    return group;
}
