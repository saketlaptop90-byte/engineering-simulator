import { iron, steel, darkSteel } from '../utils/materials.js';

export function createSteamDriveWheel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const wheelGroup = new THREE.Group();
    wheelGroup.name = 'wheelGroup';
    group.add(wheelGroup);

    // Main Wheel Rim
    const wheelGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
    const wheel = new THREE.Mesh(wheelGeometry, darkSteel);
    wheel.rotation.x = Math.PI / 2;
    wheelGroup.add(wheel);

    // Spokes
    for(let i=0; i<8; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.2, 0.2, 10);
        const spoke = new THREE.Mesh(spokeGeo, iron);
        spoke.rotation.z = (Math.PI / 4) * i;
        spoke.rotation.x = Math.PI / 2;
        wheelGroup.add(spoke);
    }

    // Counterweight
    const cwGeo = new THREE.BoxGeometry(4, 2, 1.2);
    const counterweight = new THREE.Mesh(cwGeo, iron);
    counterweight.position.set(0, -3.5, 0);
    wheelGroup.add(counterweight);

    // Connecting Rod Pin
    const pinGeo = new THREE.CylinderGeometry(0.5, 0.5, 2);
    const pin = new THREE.Mesh(pinGeo, steel);
    pin.position.set(0, 3, 0.5);
    pin.rotation.x = Math.PI / 2;
    wheelGroup.add(pin);

    // Animate wheel rotation
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const wheelTrack = new THREE.QuaternionKeyframeTrack('wheelGroup.quaternion', times, [
        ...q1.toArray(),
        ...q2.toArray(),
        ...q3.toArray()
    ]);
    
    const clip = new THREE.AnimationClip('Drive', 2, [wheelTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
