export function createScramjet(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Inlet
    const inletGeo = new THREE.BoxGeometry(4, 2, 6);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const inlet = new THREE.Mesh(inletGeo, metalMat);
    inlet.position.z = 3;
    group.add(inlet);

    // Combustion Chamber
    const chamberGeo = new THREE.BoxGeometry(3.5, 1.5, 4);
    const chamber = new THREE.Mesh(chamberGeo, metalMat);
    group.add(chamber);

    // Nozzle
    const nozzleGeo = new THREE.BoxGeometry(4, 2, 4);
    const nozzle = new THREE.Mesh(nozzleGeo, metalMat);
    nozzle.position.z = -4;
    group.add(nozzle);

    // Flame
    const flameGeo = new THREE.ConeGeometry(1.5, 8, 4);
    const flameMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff0000, transparent: true, opacity: 0.8 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.rotation.x = -Math.PI / 2;
    flame.position.z = -10;
    group.add(flame);

    // Animation (flickering flame)
    const trackName = flame.uuid + '.scale';
    const times = [0, 0.1, 0.2, 0.3];
    const values = [1, 1, 1, 1.1, 1, 1.1, 0.9, 1, 0.9, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('flicker', 0.3, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
