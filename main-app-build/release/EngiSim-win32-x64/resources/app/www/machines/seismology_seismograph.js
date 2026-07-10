export function createSeismograph(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Drum
    const drumGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const drumMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const drum = new THREE.Mesh(drumGeo, drumMat);
    drum.rotation.z = Math.PI / 2;
    drum.position.set(-0.5, 1, 0);
    group.add(drum);

    // Arm
    const armGeo = new THREE.BoxGeometry(2, 0.1, 0.1);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.set(1, 1.2, 0);
    group.add(arm);

    // Pen
    const penGeo = new THREE.ConeGeometry(0.05, 0.3, 16);
    const penMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const pen = new THREE.Mesh(penGeo, penMat);
    pen.rotation.z = Math.PI;
    pen.position.set(-0.5, 0, 0);
    arm.add(pen);

    // Animation: Drum rotating, arm shaking
    const times = [0, 1, 2, 3, 4];
    const drumRotations = [
        0, 0, 0, 1,
        0, 0, 0.707, 0.707,
        0, 0, 1, 0,
        0, 0, -0.707, 0.707,
        0, 0, 0, 1
    ];
    // We name the drum to target it in animation track
    drum.name = 'Drum';
    arm.name = 'Arm';
    const drumTrack = new THREE.QuaternionKeyframeTrack('Drum.quaternion', times, drumRotations);
    
    const armPositions = [
        1, 1.2, 0,
        1, 1.2, 0.2,
        1, 1.2, -0.3,
        1, 1.2, 0.1,
        1, 1.2, 0
    ];
    const armTrack = new THREE.VectorKeyframeTrack('Arm.position', times, armPositions);

    const clip = new THREE.AnimationClip('SeismographAction', 4, [drumTrack, armTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
