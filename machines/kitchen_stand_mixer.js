import { aluminum, glass, plastic, redAccent } from '../utils/materials.js';

export function createStandMixer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, redAccent);
    base.position.y = 0.25;
    group.add(base);

    // Stand
    const standGeo = new THREE.CylinderGeometry(0.4, 0.6, 3, 16);
    const stand = new THREE.Mesh(standGeo, plastic);
    stand.position.set(0, 2, -1);
    group.add(stand);

    // Head
    const headGeo = new THREE.CapsuleGeometry(0.8, 2, 4, 16);
    const head = new THREE.Mesh(headGeo, redAccent);
    head.rotation.x = Math.PI / 2;
    head.position.set(0, 3.5, 0);
    group.add(head);

    // Bowl
    const bowlGeo = new THREE.CylinderGeometry(1.2, 0.8, 1.5, 32);
    const bowl = new THREE.Mesh(bowlGeo, aluminum);
    bowl.position.set(0, 1, 0.5);
    group.add(bowl);

    // Mixer attachment
    const attachmentGroup = new THREE.Group();
    attachmentGroup.name = 'MixerAttachment';
    attachmentGroup.position.set(0, 2.5, 0.5);
    
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const shaft = new THREE.Mesh(shaftGeo, aluminum);
    shaft.position.y = -0.5;
    attachmentGroup.add(shaft);

    const whiskGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const whiskMat = aluminum.clone();
    whiskMat.wireframe = true;
    const whisk = new THREE.Mesh(whiskGeo, whiskMat);
    whisk.position.y = -1.2;
    attachmentGroup.add(whisk);

    group.add(attachmentGroup);

    // Animation
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    
    const attachmentTrack = new THREE.QuaternionKeyframeTrack('MixerAttachment.quaternion', times, values);
    const clip = new THREE.AnimationClip('MixerSpin', 2, [attachmentTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
