import { aluminum, glass, plastic, redAccent } from '../utils/materials.js';

export function createMicrowaveOven(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.BoxGeometry(5, 3, 3);
    const body = new THREE.Mesh(bodyGeo, aluminum);
    body.position.y = 1.5;
    group.add(body);

    // Window
    const windowGeo = new THREE.PlaneGeometry(3, 2);
    const windowMesh = new THREE.Mesh(windowGeo, glass);
    windowMesh.position.set(-0.5, 1.5, 1.51);
    group.add(windowMesh);

    // Control Panel
    const panelGeo = new THREE.BoxGeometry(1, 2.5, 0.1);
    const panel = new THREE.Mesh(panelGeo, plastic);
    panel.position.set(2, 1.5, 1.5);
    group.add(panel);

    // Turntable
    const turntableGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
    const turntable = new THREE.Mesh(turntableGeo, glass);
    turntable.name = 'Turntable';
    turntable.position.set(-0.5, 0.2, 0);
    group.add(turntable);

    // Animation
    const times = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const track = new THREE.QuaternionKeyframeTrack('Turntable.quaternion', times, values);
    const clip = new THREE.AnimationClip('Spin', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
