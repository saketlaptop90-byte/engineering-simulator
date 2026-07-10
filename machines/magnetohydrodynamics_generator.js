export function createMHDGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    // Channel
    const channelGeo = new THREE.BoxGeometry(10, 2, 2);
    const channelMat = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.5 });
    const channel = new THREE.Mesh(channelGeo, channelMat);
    group.add(channel);
    
    // Magnets
    const magnetGeo = new THREE.BoxGeometry(8, 0.5, 3);
    const magnetMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const topMagnet = new THREE.Mesh(magnetGeo, magnetMat);
    topMagnet.position.y = 1.5;
    const bottomMagnet = new THREE.Mesh(magnetGeo, magnetMat);
    bottomMagnet.position.y = -1.5;
    group.add(topMagnet);
    group.add(bottomMagnet);

    // Electrodes
    const electrodeGeo = new THREE.BoxGeometry(8, 2, 0.2);
    const electrodeMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
    const frontElectrode = new THREE.Mesh(electrodeGeo, electrodeMat);
    frontElectrode.position.z = 1.1;
    const backElectrode = new THREE.Mesh(electrodeGeo, electrodeMat);
    backElectrode.position.z = -1.1;
    group.add(frontElectrode);
    group.add(backElectrode);
    
    // Plasma particles
    const particleCount = 100;
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1 });
    const particles = new THREE.Group();
    for(let i=0; i<particleCount; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
        p.userData.velocity = Math.random() * 5 + 5;
        particles.add(p);
    }
    group.add(particles);

    // Animation: move particles along the X axis
    const tracks = [];
    const times = [0, 1, 2];
    const values = [0, 0, 0, 10, 0, 0, 20, 0, 0];
    const track = new THREE.VectorKeyframeTrack('.position', times, values);
    tracks.push(track);
    const clip = new THREE.AnimationClip('flow', -1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
