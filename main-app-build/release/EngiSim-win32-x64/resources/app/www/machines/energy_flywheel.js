import { copper, aluminum, glass, gold } from '../utils/materials.js';

export function createFlywheelVault(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const chamberGeom = new THREE.CylinderGeometry(3, 3, 2, 32);
    const chamber = new THREE.Mesh(chamberGeom, glass);
    group.add(chamber);

    const bearingGeom = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
    const topBearing = new THREE.Mesh(bearingGeom, copper);
    topBearing.position.y = 0.8;
    topBearing.rotation.x = Math.PI/2;
    group.add(topBearing);

    const bottomBearing = new THREE.Mesh(bearingGeom, copper);
    bottomBearing.position.y = -0.8;
    bottomBearing.rotation.x = Math.PI/2;
    group.add(bottomBearing);

    const rotorGroup = new THREE.Group();
    rotorGroup.name = "flywheel_rotor";
    
    const rotorGeom = new THREE.CylinderGeometry(2.5, 2.5, 1, 32);
    const rotor = new THREE.Mesh(rotorGeom, aluminum);
    rotorGroup.add(rotor);

    const trimGeom = new THREE.TorusGeometry(2.5, 0.05, 16, 64);
    const topTrim = new THREE.Mesh(trimGeom, gold);
    topTrim.position.y = 0.5;
    topTrim.rotation.x = Math.PI/2;
    rotorGroup.add(topTrim);

    const bottomTrim = new THREE.Mesh(trimGeom, gold);
    bottomTrim.position.y = -0.5;
    bottomTrim.rotation.x = Math.PI/2;
    rotorGroup.add(bottomTrim);

    const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 2.5);
    const shaft = new THREE.Mesh(shaftGeom, aluminum);
    rotorGroup.add(shaft);

    group.add(rotorGroup);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const times = [0, 0.5, 1];
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const track = new THREE.QuaternionKeyframeTrack('flywheel_rotor.quaternion', times, values);
    const clip = new THREE.AnimationClip('flywheel_spin', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
