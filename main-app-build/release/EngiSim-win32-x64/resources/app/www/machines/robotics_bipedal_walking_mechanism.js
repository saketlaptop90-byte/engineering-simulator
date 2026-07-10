import * as materials from '../utils/materials.js';

export function createBipedalWalkingMechanism(THREE) {
    const group = new THREE.Group();
    
    const mat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4, metalness: 0.8 });

    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), mat);
    pelvis.name = 'Pelvis';
    group.add(pelvis);

    const leftLeg = new THREE.Group();
    leftLeg.name = 'LeftLeg';
    leftLeg.position.set(-0.6, -0.5, 0);
    pelvis.add(leftLeg);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), mat);
    leftThigh.position.y = -1;
    leftLeg.add(leftThigh);

    const rightLeg = new THREE.Group();
    rightLeg.name = 'RightLeg';
    rightLeg.position.set(0.6, -0.5, 0);
    pelvis.add(rightLeg);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), mat);
    rightThigh.position.y = -1;
    rightLeg.add(rightThigh);

    const times = [0, 0.5, 1, 1.5, 2];
    const leftRot = [0, 0.5, 0, -0.5, 0];
    const rightRot = [0, -0.5, 0, 0.5, 0];
    
    const leftTrack = new THREE.NumberKeyframeTrack(leftLeg.name + '.rotation[x]', times, leftRot);
    const rightTrack = new THREE.NumberKeyframeTrack(rightLeg.name + '.rotation[x]', times, rightRot);

    const clip = new THREE.AnimationClip('walk', 2, [leftTrack, rightTrack]);
    
    return { group, animationClips: [clip] };
}
