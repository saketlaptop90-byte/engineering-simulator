export function createSolidRocket(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Casing
    const casingGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    group.add(casing);

    // Nose Cone
    const noseGeo = new THREE.ConeGeometry(1.5, 3, 32);
    const nose = new THREE.Mesh(noseGeo, casingMat);
    nose.position.y = 11.5;
    group.add(nose);

    // Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(1, 2, 2, 32);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.y = -11;
    group.add(nozzle);

    // Exhaust
    const exhaustGeo = new THREE.ConeGeometry(2.5, 15, 32);
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500, transparent: true, opacity: 0.9 });
    const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaust.position.y = -19.5;
    exhaust.rotation.x = Math.PI;
    group.add(exhaust);

    // Animation (exhaust shake)
    const trackName = exhaust.uuid + '.scale';
    const times = [0, 0.05, 0.1];
    const values = [1, 1, 1, 1.05, 1, 1.05, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('shake', 0.1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
