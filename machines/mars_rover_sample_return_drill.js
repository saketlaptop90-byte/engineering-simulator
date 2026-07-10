import { aluminum, gold, blackPlastic, titanium } from '../utils/materials.js';

export function createSampleReturnDrill(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), aluminum);
    group.add(base);

    const arm = new THREE.Group();
    arm.name = "drillArm";
    arm.position.set(0, 0.25, 0);
    group.add(arm);

    const armSegment = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), titanium);
    armSegment.position.set(0, 0.5, 0);
    arm.add(armSegment);

    const drillBitGroup = new THREE.Group();
    drillBitGroup.name = "drillBit";
    drillBitGroup.position.set(0, 1, 0);
    arm.add(drillBitGroup);

    const drillBit = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), gold);
    drillBit.position.set(0, 0.3, 0);
    drillBitGroup.add(drillBit);

    const armTimes = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, 0));
    const armQuatValues = [...q1.toArray(), ...q2.toArray(), ...q1.toArray()];
    
    const armTrack = new THREE.QuaternionKeyframeTrack('drillArm.quaternion', armTimes, armQuatValues);
    
    const bitTimes = [0, 1, 2, 3, 4];
    const quatValues = [];
    for(let i=0; i<=4; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * i);
        quatValues.push(...q.toArray());
    }
    const bitTrack = new THREE.QuaternionKeyframeTrack('drillBit.quaternion', bitTimes, quatValues);

    const clip = new THREE.AnimationClip('DrillAction', 4, [armTrack, bitTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
