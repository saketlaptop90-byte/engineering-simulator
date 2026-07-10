export function createHistologyLightMicroscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(1.5, 0.2, 2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Arm
    const armGeo = new THREE.BoxGeometry(0.4, 2, 0.6);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5 });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.set(0, 1.1, -0.7);
    arm.rotation.x = 0.2;
    group.add(arm);

    // Stage
    const stageGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const stageMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.set(0, 0.8, 0.2);
    group.add(stage);

    // Lens tube
    const tubeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.set(0, 1.8, 0);
    tube.rotation.x = -0.2;
    group.add(tube);

    // Animation (Focus knob turning / stage moving up/down)
    const times = [0, 1, 2];
    const values = [0.8, 0.9, 0.8];
    const stageTrack = new THREE.NumberKeyframeTrack('.position[y]', times, values);
    const clip = new THREE.AnimationClip('FocusStage', 2, [stageTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
