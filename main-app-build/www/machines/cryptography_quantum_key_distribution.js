export function createQuantumKeyDistribution(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Alice and Bob stations
    const stationGeom = new THREE.CylinderGeometry(1, 1, 3, 32);
    const stationMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });
    
    const alice = new THREE.Mesh(stationGeom, stationMat);
    alice.position.set(-5, 0, 0);
    group.add(alice);

    const bob = new THREE.Mesh(stationGeom, stationMat);
    bob.position.set(5, 0, 0);
    group.add(bob);

    // Quantum channel (fiber)
    const channelGeom = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
    const channelMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const channel = new THREE.Mesh(channelGeom, channelMat);
    channel.rotation.z = Math.PI / 2;
    group.add(channel);

    // Photon
    const photonGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const photonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
    const photon = new THREE.Mesh(photonGeom, photonMat);
    photon.position.set(-5, 0, 0);
    photon.name = "Photon";
    group.add(photon);

    // Animation: photon traveling with changing polarization
    const times = [0, 2];
    const posValues = [-5, 0, 0, 5, 0, 0];
    const posTrack = new THREE.VectorKeyframeTrack('Photon.position', times, posValues);

    const scaleTimes = [0, 0.5, 1, 1.5, 2];
    const scaleValues = [1, 1, 1, 1, 2, 0.5, 2, 1, 0.5, 0.5, 2, 1, 1, 1, 1]; // simulating polarization changes
    const scaleTrack = new THREE.VectorKeyframeTrack('Photon.scale', scaleTimes, scaleValues);

    const clip = new THREE.AnimationClip('PhotonTransmission', 2, [posTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
