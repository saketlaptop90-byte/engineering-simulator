export function createAcousticLevitator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Transducer Arrays
    const arrayGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);
    const arrayMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    
    const bottomArray = new THREE.Mesh(arrayGeo, arrayMat);
    bottomArray.position.set(0, -4, 0);
    group.add(bottomArray);

    const topArray = new THREE.Mesh(arrayGeo, arrayMat);
    topArray.position.set(0, 4, 0);
    group.add(topArray);

    // Standing Wave Visualization (semi-transparent disks)
    for (let w = -3; w <= 3; w++) {
        const waveGeo = new THREE.TorusGeometry(2, 0.05, 8, 32);
        const waveMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.15, emissive: 0x0055aa });
        const wave = new THREE.Mesh(waveGeo, waveMat);
        wave.rotation.x = Math.PI / 2;
        wave.position.y = w + 0.5;
        group.add(wave);
    }

    // Levitated Particles
    const particleGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const particleMat = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.3, metalness: 0.1 });
    
    const particleTracks = [];
    
    for (let i = -3; i <= 3; i++) {
        const particle = new THREE.Mesh(particleGeo, particleMat);
        particle.position.set(0, i, 0);
        particle.name = `particle_${i}`;
        group.add(particle);
        
        // Slight bobbing in the acoustic nodes
        const times = [0, 0.5, 1];
        const offset = Math.random() * 0.1;
        const values = [
            0, i + offset, 0,  
            0, i + offset + 0.1, 0,  
            0, i + offset, 0
        ];
        const track = new THREE.VectorKeyframeTrack(`${particle.name}.position`, times, values);
        particleTracks.push(track);
    }

    const clip = new THREE.AnimationClip('Levitation', 1, particleTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
