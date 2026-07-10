export function createMagnonicCrystal(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base substrate
    const substrateGeo = new THREE.BoxGeometry(12, 0.5, 4);
    const substrateMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });
    const substrate = new THREE.Mesh(substrateGeo, substrateMat);
    substrate.position.y = -0.25;
    group.add(substrate);

    // Periodic lattice (the crystal)
    const numPeriods = 10;
    const periodWidth = 1.0;
    
    for (let i = 0; i < numPeriods; i++) {
        const x = -5.5 + i * periodWidth + periodWidth / 2;
        
        // Alternating materials or grooves
        const stripeGeo = new THREE.BoxGeometry(periodWidth * 0.5, 0.3, 2);
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0x55aaee, metalness: 0.7, roughness: 0.3 });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(x, 0.15, 0);
        group.add(stripe);
    }

    // Antenna for excitation
    const antennaGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.0 });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.rotation.x = Math.PI / 2;
    antenna.position.set(-5, 0.4, 0);
    group.add(antenna);

    // Spin waves interacting with the lattice
    const spins = [];
    for (let i = 0; i < 50; i++) {
        const sGeo = new THREE.SphereGeometry(0.1);
        const sMat = new THREE.MeshStandardMaterial({ color: 0xff0055 });
        const s = new THREE.Mesh(sGeo, sMat);
        s.position.set(-5 + i * 0.2, 0.5, 0);
        group.add(s);
        spins.push(s);
    }

    const duration = 2;
    const tracks = [];
    spins.forEach((spin, i) => {
        const times = [0, duration/2, duration];
        // Band gap effect: waves decay after a certain point
        const attenuation = i > 25 ? 0.2 : 1.0; 
        const offset = Math.sin(i * 0.5) * 0.3 * attenuation;
        
        const values = [
            -5 + i * 0.2, 0.5, 0,
            -5 + i * 0.2, 0.5 + offset, 0,
            -5 + i * 0.2, 0.5, 0
        ];
        tracks.push(new THREE.VectorKeyframeTrack(spin.uuid + '.position', times, values));
    });

    const clip = new THREE.AnimationClip('CrystalBandgap', duration, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
