export function createPlasmaThruster(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Thruster Body
    const bodyGeo = new THREE.CylinderGeometry(2, 3, 5, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Magnetic Nozzle Coils
    const coilGeo = new THREE.TorusGeometry(3.2, 0.2, 16, 64);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
    const coil1 = new THREE.Mesh(coilGeo, coilMat);
    coil1.position.z = 2.5;
    const coil2 = new THREE.Mesh(coilGeo, coilMat);
    coil2.position.z = 1.0;
    group.add(coil1);
    group.add(coil2);

    // Cathode
    const cathodeGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
    cathode.position.z = -3;
    cathode.rotation.x = Math.PI / 2;
    group.add(cathode);

    // Plasma Plume
    const plumeGeo = new THREE.ConeGeometry(2.5, 8, 32);
    const plumeMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 1.5, transparent: true, opacity: 0.6 });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.position.z = 6.5;
    plume.rotation.x = -Math.PI / 2;
    group.add(plume);

    // Animation
    const times = [0, 0.5, 1];
    const values = [1, 1, 1, 1.2, 1.2, 1.5, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack(`${plume.uuid}.scale`, times, values);
    const clip = new THREE.AnimationClip('thrust', -1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
