export function createBrachytherapyAfterloader(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Machine Base
    const machineGeo = new THREE.BoxGeometry(0.6, 1.2, 0.6);
    const machineMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
    const machine = new THREE.Mesh(machineGeo, machineMat);
    machine.position.set(-1, 0.6, 0);
    group.add(machine);

    // Display
    const screenGeo = new THREE.BoxGeometry(0.4, 0.3, 0.05);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-0.8, 1.0, 0.3);
    screen.rotation.y = Math.PI / 6;
    group.add(screen);

    // Tubes
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1, 0.8, 0),
        new THREE.Vector3(-0.5, 1, 0.5),
        new THREE.Vector3(0, 1, 0.5),
        new THREE.Vector3(0.5, 0.8, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tube);

    // Source Wire (animated)
    const wireGroup = new THREE.Group();
    const wireGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wireGroup.add(wire);
    group.add(wireGroup);

    // Animation along curve
    const times = [];
    const values = [];
    const duration = 4;
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        times.push(t * duration);
        const pt = curve.getPointAt(t);
        values.push(pt.x, pt.y, pt.z);
    }
    
    const track = new THREE.VectorKeyframeTrack(wireGroup.uuid + '.position', times, values);
    const clip = new THREE.AnimationClip('SourceWireMovement', duration, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
