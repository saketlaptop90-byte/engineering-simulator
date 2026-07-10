import * as materials from '../utils/materials.js';

export function createThermalCyclingChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Chamber
    const chamberGeo = new THREE.BoxGeometry(4, 5, 4);
    const chamber = new THREE.Mesh(chamberGeo, materials.steel);
    chamber.position.y = 2.5;
    group.add(chamber);

    // Door (opening)
    const doorGeo = new THREE.BoxGeometry(3.6, 4.6, 0.2);
    const door = new THREE.Mesh(doorGeo, materials.steel);
    
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-1.8, 2.5, 2);
    door.position.set(1.8, 0, 0); // Offset so pivot is on left edge
    doorPivot.add(door);
    doorPivot.name = "ChamberDoor";
    group.add(doorPivot);

    // Window on door
    const windowGeo = new THREE.BoxGeometry(2, 2, 0.22);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 });
    const win = new THREE.Mesh(windowGeo, windowMat);
    win.position.set(1.8, 0, 0);
    doorPivot.add(win);

    // Internal rack
    const rackGeo = new THREE.BoxGeometry(3, 0.1, 3);
    const rack = new THREE.Mesh(rackGeo, materials.steel);
    rack.position.set(0, 2, 0);
    group.add(rack);

    // Fan in back
    const fanGeo = new THREE.CylinderGeometry(1, 1, 0.1, 16);
    fanGeo.rotateX(Math.PI / 2);
    const fan = new THREE.Mesh(fanGeo, materials.castIron);
    fan.position.set(0, 3.5, -1.9);
    fan.name = "CirculationFan";
    group.add(fan);

    // Animation: Door opens/closes, fan spins
    const times = [0, 2, 4, 6];
    
    // Door opening
    const yAxis = new THREE.Vector3(0, 1, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 2); // Open
    const doorTrack = new THREE.QuaternionKeyframeTrack(
        `ChamberDoor.quaternion`,
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q2.x, q2.y, q2.z, q2.w, q1.x, q1.y, q1.z, q1.w] // Open, wait, close
    );

    // Fan spinning continuously
    const zAxis = new THREE.Vector3(0, 0, 1);
    const fq1 = new THREE.Quaternion().setFromAxisAngle(zAxis, 0);
    const fq2 = new THREE.Quaternion().setFromAxisAngle(zAxis, Math.PI);
    const fq3 = new THREE.Quaternion().setFromAxisAngle(zAxis, Math.PI * 2);
    const fanTrack = new THREE.QuaternionKeyframeTrack(
        `CirculationFan.quaternion`,
        [0, 0.5, 1], // fast spin
        [fq1.x, fq1.y, fq1.z, fq1.w, fq2.x, fq2.y, fq2.z, fq2.w, fq3.x, fq3.y, fq3.z, fq3.w]
    );

    const clip1 = new THREE.AnimationClip('DoorCycle', 6, [doorTrack]);
    const clip2 = new THREE.AnimationClip('FanSpin', 1, [fanTrack]);
    animationClips.push(clip1, clip2);

    return { group, animationClips };
}
