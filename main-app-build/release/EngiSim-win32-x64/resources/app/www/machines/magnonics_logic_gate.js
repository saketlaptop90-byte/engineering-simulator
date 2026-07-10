export function createMagnonicLogicGate(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const baseGeo = new THREE.BoxGeometry(10, 0.2, 6);
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Waveguides
    const wgMat = new THREE.MeshStandardMaterial({ color: 0x008855, metalness: 0.6 });
    
    // Input branches
    const in1Geo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const in1 = new THREE.Mesh(in1Geo, wgMat);
    in1.position.set(-3.5, 0.2, 1.5);
    group.add(in1);

    const in2Geo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const in2 = new THREE.Mesh(in2Geo, wgMat);
    in2.position.set(-3.5, 0.2, -1.5);
    group.add(in2);

    // Interferometer arms
    const armGeo = new THREE.BoxGeometry(4, 0.2, 0.5);
    
    const arm1 = new THREE.Mesh(armGeo, wgMat);
    arm1.position.set(0, 0.2, 1.5);
    group.add(arm1);
    
    const arm2 = new THREE.Mesh(armGeo, wgMat);
    arm2.position.set(0, 0.2, -1.5);
    group.add(arm2);

    // Output combiner
    const outGeo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const out = new THREE.Mesh(outGeo, wgMat);
    out.position.set(3.5, 0.2, 0);
    group.add(out);
    
    const conn1Geo = new THREE.BoxGeometry(0.5, 0.2, 3.5);
    const conn1 = new THREE.Mesh(conn1Geo, wgMat);
    conn1.position.set(2, 0.2, 0);
    group.add(conn1);
    
    // Spin wave pulses
    const pulseMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 });
    const pulseGeo = new THREE.SphereGeometry(0.3);
    
    const p1 = new THREE.Mesh(pulseGeo, pulseMat);
    p1.position.set(-5, 0.5, 1.5);
    group.add(p1);

    const p2 = new THREE.Mesh(pulseGeo, pulseMat);
    p2.position.set(-5, 0.5, -1.5);
    group.add(p2);

    // Animate pulses moving and interfering
    const duration = 3;
    const times = [0, 1.5, 2.5, 3];
    
    // Pulse 1 path
    const p1Values = [
        -5, 0.5, 1.5,
        2, 0.5, 1.5,
        2, 0.5, 0,
        5, 0.5, 0
    ];
    
    // Pulse 2 path
    const p2Values = [
        -5, 0.5, -1.5,
        2, 0.5, -1.5,
        2, 0.5, 0,
        5, 0.5, 0
    ];

    const track1 = new THREE.VectorKeyframeTrack(p1.uuid + '.position', times, p1Values);
    const track2 = new THREE.VectorKeyframeTrack(p2.uuid + '.position', times, p2Values);

    const clip = new THREE.AnimationClip('Interference', duration, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
