export function createSiliconLifeform(THREE) {
    const group = new THREE.Group();
    
    const crystalMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
    });
    
    const crystalGroup = new THREE.Group();
    
    // Build a cluster of crystals
    for(let i=0; i<10; i++) {
        const geo = new THREE.CylinderGeometry(0, 0.5 + Math.random(), 2 + Math.random()*3, 6);
        const mesh = new THREE.Mesh(geo, crystalMaterial);
        
        mesh.position.set(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
        );
        mesh.rotation.set(
            (Math.random() - 0.5) * 0.5,
            Math.random() * Math.PI,
            (Math.random() - 0.5) * 0.5
        );
        crystalGroup.add(mesh);
    }
    
    group.add(crystalGroup);
    
    // Grow animation
    const times = [0, 5];
    const scales = [0.1, 0.1, 0.1, 1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('.scale', times, scales);
    
    const clip = new THREE.AnimationClip('grow', 5, [scaleTrack]);
    
    return { group, animationClips: [clip] };
}
