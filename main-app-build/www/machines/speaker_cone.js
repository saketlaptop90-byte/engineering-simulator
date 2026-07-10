export function createSpeakerCone(THREE) {
    const group = new THREE.Group();

    // Magnet structure (back)
    const magnetGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32);
    const magnetMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.4 });
    const magnet = new THREE.Mesh(magnetGeo, magnetMat);
    magnet.position.z = -3;
    magnet.rotation.x = Math.PI / 2;
    group.add(magnet);

    // Voice Coil (center tube)
    const coilGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb87333, wireframe: true }); // Copper look
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.position.z = -1.5;
    coil.rotation.x = Math.PI / 2;
    group.add(coil);

    // Speaker Cone (Diaphragm)
    const coneGeo = new THREE.CylinderGeometry(4, 0.8, 3, 32, 1, true);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.z = 0;
    cone.rotation.x = Math.PI / 2;
    group.add(cone);

    // Dust Cap (Center dome)
    const capGeo = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.z = -1.5;
    group.add(cap);

    // Frame/Basket (connecting magnet to outer cone edge)
    const frameGeo = new THREE.CylinderGeometry(4.2, 2.2, 3, 8, 1, true);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.z = -1.5;
    frame.rotation.x = Math.PI / 2;
    group.add(frame);

    // Magnetic field visualizer
    const fieldGeo = new THREE.TorusGeometry(2, 1, 16, 32);
    const fieldMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, transparent: true, opacity: 0.2 });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.position.z = -3;
    group.add(field);

    group.userData.animate = function(time) {
        // Voice coil and cone oscillate based on simulated audio wave
        const audioSignal = Math.sin(time * 30) * Math.sin(time * 5); // Complex wave
        const displacement = audioSignal * 0.5;
        
        cone.position.z = displacement;
        coil.position.z = -1.5 + displacement;
        cap.position.z = -1.5 + displacement;
        
        // Field pulses slightly with the current
        field.scale.setScalar(1 + Math.abs(audioSignal) * 0.1);
        field.material.opacity = 0.1 + Math.abs(audioSignal) * 0.3;
    };

    group.userData.quiz = [
        { question: "What creates the magnetic field that interacts with the permanent magnet?", options: ["Voice Coil", "Dust Cap", "Diaphragm", "Spider"], answer: 0 },
        { question: "What is the purpose of the cone/diaphragm?", options: ["Push air to create sound waves", "Cool the magnet", "Look good", "Generate electricity"], answer: 0 },
        { question: "What physical principle drives a speaker?", options: ["Electromagnetism", "Gravity", "Thermodynamics", "Nuclear force"], answer: 0 }
    ];

    return group;
}
