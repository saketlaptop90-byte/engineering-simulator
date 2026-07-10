export function createTuningFork(THREE) {
    const group = new THREE.Group();

    const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const handle = new THREE.Mesh(handleGeo, mat);
    handle.position.y = -2;
    group.add(handle);

    // U-base
    const uBaseGeo = new THREE.TorusGeometry(1.5, 0.5, 16, 32, Math.PI);
    const uBase = new THREE.Mesh(uBaseGeo, mat);
    uBase.rotation.z = Math.PI;
    group.add(uBase);

    // Tines (Left and Right)
    const tineGeo = new THREE.BoxGeometry(1, 6, 1);
    
    const leftTine = new THREE.Mesh(tineGeo, mat);
    leftTine.position.set(-1.5, 3, 0);
    group.add(leftTine);

    const rightTine = new THREE.Mesh(tineGeo, mat);
    rightTine.position.set(1.5, 3, 0);
    group.add(rightTine);

    // Sound waves (visualizing the acoustic energy)
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true, transparent: true, opacity: 0 });
    const waves = [];
    for(let i=0; i<3; i++) {
        const waveL = new THREE.SphereGeometry(0.5, 16, 16);
        const wl = new THREE.Mesh(waveL, waveMat.clone());
        wl.position.set(-2, 4, 0);
        group.add(wl);
        
        const waveR = new THREE.SphereGeometry(0.5, 16, 16);
        const wr = new THREE.Mesh(waveR, waveMat.clone());
        wr.position.set(2, 4, 0);
        group.add(wr);
        
        waves.push({ l: wl, r: wr, offset: i * 2 });
    }

    group.userData.animate = function(time) {
        // High frequency vibration
        const vibration = Math.sin(time * 50) * 0.1;
        leftTine.rotation.z = vibration;
        rightTine.rotation.z = -vibration;

        // Radiating sound waves
        waves.forEach(w => {
            const phase = (time * 3 + w.offset) % 6;
            const scale = 1 + phase * 2;
            w.l.scale.setScalar(scale);
            w.r.scale.setScalar(scale);
            const opacity = 1 - (phase / 6);
            w.l.material.opacity = opacity * 0.5;
            w.r.material.opacity = opacity * 0.5;
        });
    };

    group.userData.quiz = [
        { question: "What property determines the pitch of the tuning fork?", options: ["Length & mass of tines", "Color", "Handle length", "Room temperature"], answer: 0 },
        { question: "What type of wave is sound in air?", options: ["Longitudinal", "Transverse", "Electromagnetic", "Standing"], answer: 0 },
        { question: "Why is a tuning fork shaped like a U?", options: ["Creates a pure fundamental frequency", "Easier to hold", "Looks cool", "Saves metal"], answer: 0 }
    ];

    return group;
}
