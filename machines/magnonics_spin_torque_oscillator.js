export function createSpinTorqueOscillator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pillar structure
    const layerGeo = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    
    // Bottom electrode
    const bottomElecMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.2 });
    const bottomElec = new THREE.Mesh(layerGeo, bottomElecMat);
    bottomElec.position.y = 0;
    group.add(bottomElec);

    // Fixed magnetic layer
    const fixedLayerMat = new THREE.MeshStandardMaterial({ color: 0xaa0000, metalness: 0.6, roughness: 0.4 });
    const fixedLayer = new THREE.Mesh(layerGeo, fixedLayerMat);
    fixedLayer.position.y = 0.2;
    group.add(fixedLayer);

    // Spacer layer (non-magnetic)
    const spacerMat = new THREE.MeshStandardMaterial({ color: 0xffffaa, metalness: 0.2, roughness: 0.8 });
    const spacer = new THREE.Mesh(layerGeo, spacerMat);
    spacer.position.y = 0.4;
    group.add(spacer);

    // Free magnetic layer (oscillating)
    const freeLayerMat = new THREE.MeshStandardMaterial({ color: 0x0000aa, metalness: 0.6, roughness: 0.4 });
    const freeLayer = new THREE.Mesh(layerGeo, freeLayerMat);
    freeLayer.position.y = 0.6;
    group.add(freeLayer);

    // Top electrode
    const topElecMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.2 });
    const topElec = new THREE.Mesh(layerGeo, topElecMat);
    topElec.position.y = 0.8;
    group.add(topElec);

    // Magnetization vector of the free layer
    const arrowGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    
    // We put it in a pivot to rotate it easily
    const pivot = new THREE.Group();
    pivot.position.set(0, 0.6, 0); // Center of free layer
    arrow.position.set(0, 0.5, 0); // Offset from pivot
    pivot.add(arrow);
    group.add(pivot);

    // Precession animation
    const qTimes = [];
    const qValues = [];
    const duration = 1;
    const frames = 30;
    const tilt = Math.PI / 4;

    for (let i = 0; i <= frames; i++) {
        const t = (i / frames) * duration;
        qTimes.push(t);
        const angle = (t / duration) * Math.PI * 2;
        
        const euler = new THREE.Euler(tilt, angle, 0, 'YXZ');
        const q = new THREE.Quaternion().setFromEuler(euler);
        qValues.push(q.x, q.y, q.z, q.w);
    }

    const track = new THREE.QuaternionKeyframeTrack(pivot.uuid + '.quaternion', qTimes, qValues);
    const clip = new THREE.AnimationClip('Precession', duration, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
