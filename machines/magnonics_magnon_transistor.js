export function createMagnonTransistor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base substrate
    const subGeo = new THREE.BoxGeometry(8, 0.5, 4);
    const subMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const substrate = new THREE.Mesh(subGeo, subMat);
    group.add(substrate);

    // Magnonic channel (Source to Drain)
    const chanGeo = new THREE.BoxGeometry(6, 0.2, 1);
    const chanMat = new THREE.MeshStandardMaterial({ color: 0x33aa33, transparent: true, opacity: 0.8 });
    const channel = new THREE.Mesh(chanGeo, chanMat);
    channel.position.y = 0.35;
    group.add(channel);

    // Gate element (e.g. injects magnons to scatter channel magnons)
    const gateGeo = new THREE.BoxGeometry(1, 0.3, 3);
    const gateMat = new THREE.MeshStandardMaterial({ color: 0xaa3333 });
    const gate = new THREE.Mesh(gateGeo, gateMat);
    gate.position.set(0, 0.4, -1.5);
    group.add(gate);

    // Source and Drain contacts
    const contactGeo = new THREE.BoxGeometry(1, 0.4, 1.5);
    const contactMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1 });
    
    const source = new THREE.Mesh(contactGeo, contactMat);
    source.position.set(-3, 0.45, 0);
    group.add(source);

    const drain = new THREE.Mesh(contactGeo, contactMat);
    drain.position.set(3, 0.45, 0);
    group.add(drain);

    // Magnon flow (particles)
    const particleCount = 10;
    const particles = [];
    const pGeo = new THREE.SphereGeometry(0.1);
    const pMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(pGeo, pMat);
        p.position.set(-2 + Math.random() * -1, 0.5, (Math.random() - 0.5) * 0.5);
        group.add(p);
        particles.push(p);
    }

    // Gate magnon flow (blocking)
    const gGeo = new THREE.SphereGeometry(0.08);
    const gMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const g = new THREE.Mesh(gGeo, gMat);
    g.position.set(0, 0.5, -2);
    group.add(g);

    // Animation: Gate magnon hits center, channel magnons scatter or get blocked
    const duration = 2;
    const tracks = [];

    // Gate magnon moves in
    const gTimes = [0, 1, 2];
    const gValues = [
        0, 0.5, -2,
        0, 0.5, 0, // Hits center
        0, 0.5, 0  // Stays
    ];
    tracks.push(new THREE.VectorKeyframeTrack(g.uuid + '.position', gTimes, gValues));

    // Channel magnons
    particles.forEach((p, i) => {
        const pTimes = [0, 1, 2];
        const startX = -2.5 + Math.random() * 0.5;
        const startZ = (Math.random() - 0.5) * 0.5;
        
        // Before hit: move towards center
        const midX = -0.5 + Math.random() * 0.2;
        const midZ = startZ;

        // After hit: block or scatter
        const endX = midX - Math.random() * 0.5; // push back
        const endZ = startZ + (Math.random() - 0.5); // scatter

        const pValues = [
            startX, 0.5, startZ,
            midX, 0.5, midZ,
            endX, 0.5, endZ
        ];
        tracks.push(new THREE.VectorKeyframeTrack(p.uuid + '.position', pTimes, pValues));
    });

    const clip = new THREE.AnimationClip('TransistorSwitching', duration, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
