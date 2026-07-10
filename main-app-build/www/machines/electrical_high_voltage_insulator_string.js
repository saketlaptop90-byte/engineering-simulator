import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createHighVoltageInsulatorString(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure - metal caps and porcelain discs
    const discGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const capGeometry = new THREE.CylinderGeometry(1, 1, 1, 32);
    const wireGeometry = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);

    const numDiscs = 10;
    const spacing = 1.5;

    for (let i = 0; i < numDiscs; i++) {
        const disc = new THREE.Mesh(discGeometry, porcelain);
        disc.position.y = i * spacing;
        
        const cap = new THREE.Mesh(capGeometry, darkSteel);
        cap.position.y = i * spacing + 0.75;
        
        group.add(disc);
        group.add(cap);
    }

    const wire = new THREE.Mesh(wireGeometry, copper);
    wire.position.y = (numDiscs * spacing) / 2 - 0.75;
    wire.position.x = 2.5;
    group.add(wire);

    // Add a subtle swaying animation to simulate wind
    const times = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.05);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    
    group.name = 'InsulatorString';
    const track = new THREE.QuaternionKeyframeTrack('.quaternion', times, values);
    const clip = new THREE.AnimationClip('Sway', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
