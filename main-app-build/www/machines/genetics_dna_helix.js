export function createDNAHelix(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const backboneMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    // Build DNA structure
    for (let i = 0; i < 20; i++) {
        const angle = i * 0.5;
        const y = i * 0.5;

        // Base pairs
        const boxGeometry = new THREE.BoxGeometry(2, 0.2, 0.2);
        const pair = new THREE.Mesh(boxGeometry, i % 2 === 0 ? material1 : material2);
        pair.position.set(0, y, 0);
        pair.rotation.y = angle;
        group.add(pair);

        // Backbone
        const sphereGeo = new THREE.SphereGeometry(0.3);
        const back1 = new THREE.Mesh(sphereGeo, backboneMaterial);
        back1.position.set(Math.cos(angle)*1.1, y, Math.sin(angle)*1.1);
        group.add(back1);
        
        const back2 = new THREE.Mesh(sphereGeo, backboneMaterial);
        back2.position.set(Math.cos(angle + Math.PI)*1.1, y, Math.sin(angle + Math.PI)*1.1);
        group.add(back2);
    }

    // Animation: Rotating DNA
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const trackName = '.quaternion';
    const track = new THREE.QuaternionKeyframeTrack(trackName, [0, 2.5, 5], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    const clip = new THREE.AnimationClip('rotate', 5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
