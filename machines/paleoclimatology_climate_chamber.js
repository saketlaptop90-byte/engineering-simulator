export function createClimateChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main chamber sphere
    const chamberGeo = new THREE.SphereGeometry(2, 32, 32);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0xccddff, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.6 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.y = 2.5;
    group.add(chamber);

    // Base unit
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.5, 1, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.5 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.5;
    group.add(base);

    // Gas mixing pipes
    const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    for(let i=0; i<4; i++) {
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        pipe.position.set(
            1.5 * Math.cos(i * Math.PI / 2),
            1,
            1.5 * Math.sin(i * Math.PI / 2)
        );
        group.add(pipe);
    }

    // Animation: Pulsing color inside chamber
    const light = new THREE.PointLight(0xffaa00, 1, 5);
    light.position.y = 2.5;
    group.add(light);

    const lightIntensityTrack = light.uuid + '.intensity';
    const times = [0, 1, 2];
    const values = [0.5, 2.0, 0.5];

    const intensityTrack = new THREE.NumberKeyframeTrack(lightIntensityTrack, times, values);
    const clip = new THREE.AnimationClip('PulseAction', 2, [intensityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
