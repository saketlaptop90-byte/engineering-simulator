export function createXenobot(THREE) {
    const group = new THREE.Group();
    
    // Xenobot body
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const body = new THREE.Mesh(geometry, material);
    group.add(body);
    
    // Cilia (movement structures)
    for(let i=0; i<20; i++) {
        const ciliumGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
        const ciliumMat = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
        const cilium = new THREE.Mesh(ciliumGeo, ciliumMat);
        
        cilium.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        cilium.lookAt(0,0,0);
        body.add(cilium);
    }
    
    // Animation
    const times = [0, 2, 4];
    const scales = [1, 1, 1,  1.1, 0.9, 1.1,  1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('.scale', times, scales);
    
    const clip = new THREE.AnimationClip('pulsate', 4, [scaleTrack]);
    
    return { group, animationClips: [clip] };
}
