import * as materials from '../utils/materials.js';

export function createTrebuchet(THREE) {
    const group = new THREE.Group();
    
    const woodMat = materials.wood || new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const ironMat = materials.iron || materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ropeMat = materials.rope || materials.wireCoil || new THREE.MeshStandardMaterial({ color: 0xd2b48c });

    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 6), woodMat);
    group.add(base);

    const leftUpright = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 0.5), woodMat);
    leftUpright.position.set(-1.5, 3.25, 0);
    group.add(leftUpright);

    const rightUpright = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 0.5), woodMat);
    rightUpright.position.set(1.5, 3.25, 0);
    group.add(rightUpright);

    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.5), ironMat);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, 6, 0);
    group.add(axle);

    const pivot = new THREE.Group();
    pivot.name = 'TrebuchetPivot';
    pivot.position.set(0, 6, 0);
    group.add(pivot);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 9, 0.4), woodMat);
    arm.position.set(0, 2.5, 0);
    pivot.add(arm);

    const weightBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), ironMat);
    weightBox.position.set(0, -2, 0);
    pivot.add(weightBox);

    const sling = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), ropeMat);
    sling.position.set(0, 8, 1);
    sling.rotation.x = -Math.PI / 6;
    pivot.add(sling);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4);

    const times = [0, 1.5, 2.5, 4.0];
    const values = [...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray()];

    const track = new THREE.QuaternionKeyframeTrack('TrebuchetPivot.quaternion', times, values);
    const clip = new THREE.AnimationClip('FireTrebuchet', 4.0, [track]);

    pivot.quaternion.copy(q0);

    return { group, animationClips: [clip] };
}
