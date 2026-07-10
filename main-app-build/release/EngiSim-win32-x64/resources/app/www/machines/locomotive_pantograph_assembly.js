import { steel, iron, copper } from '../utils/materials.js';

export function createPantographAssembly(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Frame
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, iron);
    group.add(base);

    // Lower Arm
    const lowerArmGeo = new THREE.BoxGeometry(0.5, 4, 0.5);
    lowerArmGeo.translate(0, 2, 0); // Translate so pivot is at origin
    const lowerArm = new THREE.Mesh(lowerArmGeo, steel);
    lowerArm.position.set(0, 0.25, 0);
    lowerArm.name = 'lowerArm';
    group.add(lowerArm);

    // Upper Arm
    const upperArmGeo = new THREE.BoxGeometry(0.5, 4, 0.5);
    upperArmGeo.translate(0, 2, 0); // Translate so pivot is at origin
    const upperArm = new THREE.Mesh(upperArmGeo, steel);
    upperArm.position.set(0, 4, 0);
    upperArm.name = 'upperArm';
    lowerArm.add(upperArm);

    // Collector Head (Contacts overhead wire)
    const headGeo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const head = new THREE.Mesh(headGeo, copper);
    head.position.set(0, 4, 0);
    upperArm.add(head);

    // Extend and Retract Animation
    const times = [0, 2, 4];
    
    const q1Start = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/4, 0, 0));
    const q1End = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2.5, 0, 0));
    
    const q2Start = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0));
    const q2End = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/1.25, 0, 0));

    const lowerTrack = new THREE.QuaternionKeyframeTrack('lowerArm.quaternion', times, [
        ...q1Start.toArray(),
        ...q1End.toArray(),
        ...q1Start.toArray()
    ]);

    const upperTrack = new THREE.QuaternionKeyframeTrack('upperArm.quaternion', times, [
        ...q2Start.toArray(),
        ...q2End.toArray(),
        ...q2Start.toArray()
    ]);

    const clip = new THREE.AnimationClip('ExtendRetract', 4, [lowerTrack, upperTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
