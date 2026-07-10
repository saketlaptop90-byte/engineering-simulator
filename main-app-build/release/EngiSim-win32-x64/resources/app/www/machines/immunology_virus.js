export function createVirusNeutralization(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Virus
    const virusGeo = new THREE.SphereGeometry(3, 16, 16);
    const virusMat = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.7,
        metalness: 0.2
    });
    const virus = new THREE.Mesh(virusGeo, virusMat);
    group.add(virus);

    // Spike Proteins
    const spikeGeo = new THREE.ConeGeometry(0.5, 2, 8);
    const spikeMat = new THREE.MeshStandardMaterial({
        color: 0xff0000
    });
    
    for(let i=0; i<12; i++) {
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        
        spike.position.setFromSphericalCoords(3, phi, theta);
        spike.lookAt(0,0,0);
        spike.rotateX(-Math.PI/2);
        virus.add(spike);
    }

    // Neutralizing Antibodies
    const abGeo = new THREE.CylinderGeometry(0.2, 0.5, 1.5);
    const abMat = new THREE.MeshStandardMaterial({ color: 0x00fa9a });
    const abs = new THREE.Group();
    
    for(let i=0; i<12; i++) {
        const ab = new THREE.Mesh(abGeo, abMat);
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        ab.position.setFromSphericalCoords(6, phi, theta);
        ab.lookAt(0,0,0);
        ab.rotateX(-Math.PI/2);
        abs.add(ab);
    }
    group.add(abs);

    // Animation: Abs bind to spikes
    const times = [0, 2];
    const scaleValues = [
        1.5, 1.5, 1.5,
        1, 1, 1
    ];

    const scaleTrack = new THREE.VectorKeyframeTrack(
        abs.uuid + '.scale', times, scaleValues
    );

    const clip = new THREE.AnimationClip('Neutralize', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
