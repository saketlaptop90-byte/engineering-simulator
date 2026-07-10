import { materials } from '../utils/materials.js';

export function createMitchellCamera(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.BoxGeometry(2, 2.5, 3);
    const body = new THREE.Mesh(bodyGeo, materials.darkSteel);
    group.add(body);

    // Magazines (Mickey Mouse ears)
    const magGeo = new THREE.CylinderGeometry(1, 1, 0.8, 32);
    const mag1 = new THREE.Mesh(magGeo, materials.aluminum);
    mag1.rotation.z = Math.PI / 2;
    mag1.position.set(0, 2.5, 1);
    group.add(mag1);

    const mag2 = new THREE.Mesh(magGeo, materials.aluminum);
    mag2.rotation.z = Math.PI / 2;
    mag2.position.set(0, 2.5, -1);
    group.add(mag2);

    // Lens
    const lensGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 32);
    const lens = new THREE.Mesh(lensGeo, materials.brass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 2.25);
    group.add(lens);

    // Claw Mechanism Group
    const clawGroup = new THREE.Group();
    clawGroup.position.set(1.1, 0, 1.5);
    clawGroup.name = "claw";
    group.add(clawGroup);

    const clawGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const claw = new THREE.Mesh(clawGeo, materials.darkSteel);
    clawGroup.add(claw);

    const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
    const pin = new THREE.Mesh(pinGeo, materials.brass);
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0.1, 0.3, 0);
    clawGroup.add(pin);

    // Gear
    const gearGroup = new THREE.Group();
    gearGroup.position.set(1.1, -0.5, 1.5);
    gearGroup.name = "gear";
    group.add(gearGroup);

    const gearGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const gear = new THREE.Mesh(gearGeo, materials.brass);
    gear.rotation.x = Math.PI / 2; // Making it face forward
    gearGroup.add(gear);

    // Animation
    const times = [0, 0.5, 1];
    
    // Gear rotation around Z (since it's facing forward)
    const zAxis = new THREE.Vector3(0, 0, 1);
    const q0 = new THREE.Quaternion().setFromAxisAngle(zAxis, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(zAxis, Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(zAxis, Math.PI * 2);
    
    const rotValues = [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray()
    ];
    const gearTrack = new THREE.QuaternionKeyframeTrack('gear.quaternion', times, rotValues);

    // Claw translation (up and down)
    const posValues = [
        1.1, 0, 1.5,
        1.1, 0.5, 1.5,
        1.1, 0, 1.5
    ];
    const clawTrack = new THREE.VectorKeyframeTrack('claw.position', times, posValues);

    const clip = new THREE.AnimationClip('MitchellMovement', 1, [gearTrack, clawTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
