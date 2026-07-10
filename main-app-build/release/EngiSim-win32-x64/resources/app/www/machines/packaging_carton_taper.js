import { materials } from '../utils/materials.js';

export function createCartonTaper(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials?.metal || new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.5 });
    const matAccent = materials?.accent || new THREE.MeshStandardMaterial({ color: 0x0055ff });
    const matBelt = materials?.belt || new THREE.MeshStandardMaterial({ color: 0x111111 });
    const matTape = materials?.tape || new THREE.MeshStandardMaterial({ color: 0xddaa77 });

    // Conveyor Base
    const baseGeo = new THREE.BoxGeometry(4, 0.8, 1.5);
    const base = new THREE.Mesh(baseGeo, matMetal);
    base.position.y = 0.4;
    group.add(base);

    const beltGeo = new THREE.BoxGeometry(4.2, 0.1, 1.3);
    const belt = new THREE.Mesh(beltGeo, matBelt);
    belt.position.y = 0.85;
    group.add(belt);

    // Side Drive Belts
    const sideBeltGeo = new THREE.BoxGeometry(2, 0.4, 0.2);
    const leftBelt = new THREE.Mesh(sideBeltGeo, matBelt);
    leftBelt.position.set(0, 1.2, 0.5);
    group.add(leftBelt);

    const rightBelt = new THREE.Mesh(sideBeltGeo, matBelt);
    rightBelt.position.set(0, 1.2, -0.5);
    group.add(rightBelt);

    // Mast and Top Tape Head
    const mastGeo = new THREE.BoxGeometry(0.3, 2, 0.3);
    const leftMast = new THREE.Mesh(mastGeo, matAccent);
    leftMast.position.set(0, 1.8, 0.8);
    group.add(leftMast);

    const rightMast = new THREE.Mesh(mastGeo, matAccent);
    rightMast.position.set(0, 1.8, -0.8);
    group.add(rightMast);

    const headGeo = new THREE.BoxGeometry(1.5, 0.4, 1.8);
    const head = new THREE.Mesh(headGeo, matAccent);
    head.position.set(0, 2.5, 0);
    group.add(head);

    // Tape Roll
    const rollGroup = new THREE.Group();
    rollGroup.position.set(0, 3, 0);
    rollGroup.name = 'TapeRoll';
    group.add(rollGroup);

    const rollGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const roll = new THREE.Mesh(rollGeo, matTape);
    roll.rotation.x = Math.PI / 2;
    rollGroup.add(roll);

    // Animation: Tape Roll Spinning
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI * 2);

    const rollTrack = new THREE.QuaternionKeyframeTrack(
        'TapeRoll.quaternion',
        [0, 0.5, 1],
        [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ]
    );

    const clip = new THREE.AnimationClip('TapeApply', 1, [rollTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
