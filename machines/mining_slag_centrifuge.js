import { darkSteel, titanium, copper, glass } from '../utils/materials.js';

export function createSlagCentrifuge(THREE) {
    const group = new THREE.Group();
    group.name = "ZeroGSlagCentrifuge";

    // Structural Frame
    const frameGeo = new THREE.BoxGeometry(6, 1, 6);
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.position.y = 0.5;
    group.add(frame);

    // Frame Supports
    for(let i = -1; i <= 1; i += 2) {
        const supportGeo = new THREE.BoxGeometry(0.5, 4, 6);
        const support = new THREE.Mesh(supportGeo, darkSteel);
        support.position.set(i * 2.75, 3, 0);
        group.add(support);
    }

    // Centrifuge Outer Shell
    const shellGeo = new THREE.CylinderGeometry(2.5, 2.5, 4.8, 32, 1, true);
    const shell = new THREE.Mesh(shellGeo, titanium);
    shell.position.y = 3;
    shell.rotation.z = Math.PI / 2;
    group.add(shell);

    // Observation Windows (Glass)
    const windowGeo = new THREE.CylinderGeometry(2.51, 2.51, 4.9, 32, 1, true, 0, Math.PI / 3);
    const windowMesh1 = new THREE.Mesh(windowGeo, glass);
    windowMesh1.position.y = 3;
    windowMesh1.rotation.z = Math.PI / 2;
    group.add(windowMesh1);

    const windowMesh2 = new THREE.Mesh(windowGeo, glass);
    windowMesh2.position.y = 3;
    windowMesh2.rotation.z = Math.PI / 2;
    windowMesh2.rotation.x = Math.PI; // opposite side
    group.add(windowMesh2);

    // Inner Spinning Drum
    const drumGroup = new THREE.Group();
    drumGroup.name = "SpinningDrum";
    drumGroup.position.y = 3;
    drumGroup.rotation.z = Math.PI / 2;

    const drumGeo = new THREE.CylinderGeometry(2.3, 2.3, 4.6, 24);
    const drum = new THREE.Mesh(drumGeo, copper);
    drumGroup.add(drum);
    
    // Slag collection ridges
    for (let i = 0; i < 8; i++) {
        const ridgeGeo = new THREE.BoxGeometry(0.2, 4.6, 0.4);
        const ridge = new THREE.Mesh(ridgeGeo, darkSteel);
        ridge.position.set(Math.cos(i * Math.PI / 4) * 2.2, 0, Math.sin(i * Math.PI / 4) * 2.2);
        ridge.rotation.y = -i * Math.PI / 4;
        drumGroup.add(ridge);
    }

    group.add(drumGroup);

    // Continuous Spinning Animation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const qTimes = [0, 1, 2];
    const qValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const spinTrack = new THREE.QuaternionKeyframeTrack('SpinningDrum.quaternion', qTimes, qValues);
    const clip = new THREE.AnimationClip('CentrifugeSpin', 2, [spinTrack]);

    return { group, animationClips: [clip] };
}
