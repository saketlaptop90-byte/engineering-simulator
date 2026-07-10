export function createCyberKnife(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(0.8, 1, 0.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    group.add(base);

    // Robotic Arm Base
    const armBaseGeo = new THREE.CylinderGeometry(0.6, 0.6, 1, 32);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const armBase = new THREE.Mesh(armBaseGeo, armMat);
    armBase.position.y = 1;
    group.add(armBase);

    // Arm Segment 1
    const arm1Group = new THREE.Group();
    arm1Group.position.set(0, 1.5, 0);
    const arm1Geo = new THREE.BoxGeometry(0.4, 1.5, 0.4);
    const arm1 = new THREE.Mesh(arm1Geo, armMat);
    arm1.position.y = 0.75;
    arm1Group.add(arm1);
    group.add(arm1Group);

    // Arm Segment 2
    const arm2Group = new THREE.Group();
    arm2Group.position.set(0, 1.5, 0);
    const arm2Geo = new THREE.BoxGeometry(0.3, 1.5, 0.3);
    const arm2 = new THREE.Mesh(arm2Geo, armMat);
    arm2.position.y = 0.75;
    arm2Group.add(arm2);
    arm1Group.add(arm2Group);

    // Linac Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.8);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.5, 0.2);
    arm2Group.add(head);

    // Patient Couch
    const couchGeo = new THREE.BoxGeometry(0.7, 0.1, 2);
    const couchMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const couch = new THREE.Mesh(couchGeo, couchMat);
    couch.position.set(1.5, 1, 0);
    group.add(couch);

    // Animations
    const times = [0, 1, 2, 3, 4];
    const arm1Rot = [0, 0, 0,  0.5, 0, 0,  0, 0, 0,  -0.5, 0, 0,  0, 0, 0];
    const arm1Track = new THREE.VectorKeyframeTrack(arm1Group.uuid + '.rotation', times, arm1Rot);

    const arm2Rot = [0, 0, 0,  0.5, 0.5, 0,  0, 0, 0,  0.5, -0.5, 0,  0, 0, 0];
    const arm2Track = new THREE.VectorKeyframeTrack(arm2Group.uuid + '.rotation', times, arm2Rot);

    const clip = new THREE.AnimationClip('CyberKnifeMotion', 4, [arm1Track, arm2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
