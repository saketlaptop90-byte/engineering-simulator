export function createAlienFlora(THREE) {
    const group = new THREE.Group();
    
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.4, 4, 8);
    const stemMat = new THREE.MeshStandardMaterial({
        color: 0x220055,
        roughness: 0.8
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 2;
    group.add(stem);
    
    // Bioluminescent Bulb
    const bulbGeo = new THREE.TorusKnotGeometry(1, 0.3, 64, 16);
    const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xff0088,
        emissive: 0xff0088,
        emissiveIntensity: 0.5,
        roughness: 0.2
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = 4.5;
    bulb.name = "bulb";
    group.add(bulb);
    
    // Animation (bulb rotating and glowing)
    const times = [0, 2, 4];
    
    // Rotation
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI*2, 0));
    const rotTrack = new THREE.QuaternionKeyframeTrack('bulb.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ]);
    
    const clip = new THREE.AnimationClip('bloom', 4, [rotTrack]);
    
    return { group, animationClips: [clip] };
}
