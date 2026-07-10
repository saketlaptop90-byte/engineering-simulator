export function createTokamakReactor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Toroidal Field Coils
    const coilCount = 16;
    const coilMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    for (let i = 0; i < coilCount; i++) {
        const coilGeo = new THREE.TorusGeometry(5, 1, 16, 32);
        const coil = new THREE.Mesh(coilGeo, coilMat);
        const angle = (i / coilCount) * Math.PI * 2;
        coil.position.x = Math.cos(angle) * 2;
        coil.position.z = Math.sin(angle) * 2;
        coil.rotation.y = -angle;
        group.add(coil);
    }

    // Plasma Ring
    const plasmaGeo = new THREE.TorusGeometry(5, 0.5, 16, 100);
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.rotation.x = Math.PI / 2;
    group.add(plasma);

    // Inner Poloidal Field Coil (Central Solenoid)
    const centralSolenoidGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
    const centralSolenoidMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const centralSolenoid = new THREE.Mesh(centralSolenoidGeo, centralSolenoidMat);
    group.add(centralSolenoid);

    // Outer Poloidal Coils
    const outerCoilGeo = new THREE.TorusGeometry(8, 0.3, 16, 64);
    const outerCoilMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const topOuterCoil = new THREE.Mesh(outerCoilGeo, outerCoilMat);
    topOuterCoil.position.y = 3;
    topOuterCoil.rotation.x = Math.PI / 2;
    const bottomOuterCoil = new THREE.Mesh(outerCoilGeo, outerCoilMat);
    bottomOuterCoil.position.y = -3;
    bottomOuterCoil.rotation.x = Math.PI / 2;
    group.add(topOuterCoil);
    group.add(bottomOuterCoil);

    // Animation
    const times = [0, 2];
    const values = [0, 0, 0, 0, 2 * Math.PI, 0];
    const track = new THREE.VectorKeyframeTrack(`${plasma.uuid}.rotation`, times, values);
    const clip = new THREE.AnimationClip('plasma_rotation', -1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
