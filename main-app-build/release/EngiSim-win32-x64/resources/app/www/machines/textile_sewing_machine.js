import * as materials from '../utils/materials.js';

export function createSewingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyMat = materials.bodyMaterial || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const metalMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, bodyMat);
    base.position.set(0, 0.25, 0);
    group.add(base);

    // Arm post
    const postGeo = new THREE.BoxGeometry(0.8, 2.5, 1.5);
    const post = new THREE.Mesh(postGeo, bodyMat);
    post.position.set(1.5, 1.75, 0);
    group.add(post);

    // Top arm
    const armGeo = new THREE.BoxGeometry(3.5, 0.8, 1.5);
    const arm = new THREE.Mesh(armGeo, bodyMat);
    arm.position.set(-0.65, 2.6, 0);
    group.add(arm);

    // Needle Mechanism
    const needleGroup = new THREE.Group();
    needleGroup.position.set(-2, 2.2, 0);
    group.add(needleGroup);

    const needleBarGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const needleBar = new THREE.Mesh(needleBarGeo, metalMat);
    needleGroup.add(needleBar);

    const needleGeo = new THREE.CylinderGeometry(0.02, 0.01, 0.5);
    const needle = new THREE.Mesh(needleGeo, metalMat);
    needle.position.y = -0.75;
    needleGroup.add(needle);

    // Handwheel
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(2, 2.5, 0);
    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
    const wheel = new THREE.Mesh(wheelGeo, bodyMat);
    wheel.rotation.x = Math.PI / 2;
    wheelGroup.add(wheel);
    group.add(wheelGroup);

    // Animation
    const duration = 0.5; // Fast sewing
    const times = [];
    const needleVals = [];
    const wheelVals = [];

    for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * duration;
        times.push(t);
        
        // Needle up and down
        const ny = Math.sin((i / 20) * Math.PI * 2) * 0.4;
        needleVals.push(-2, 2.2 + ny, 0);

        // Wheel spinning
        const angle = (i / 20) * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        wheelVals.push(q.x, q.y, q.z, q.w);
    }

    const needleTrack = new THREE.VectorKeyframeTrack(`${needleGroup.uuid}.position`, times, needleVals);
    const wheelTrack = new THREE.QuaternionKeyframeTrack(`${wheelGroup.uuid}.quaternion`, times, wheelVals);

    const clip = new THREE.AnimationClip('SewingAction', duration, [needleTrack, wheelTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
