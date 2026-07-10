import { aluminum, titanium, glass } from '../utils/materials.js';

export function createONeillCylinder(THREE) {
    const group = new THREE.Group();
    group.name = "ONeillCylinder";
    const animationClips = [];

    // Cylinder Hull
    const hullGeometry = new THREE.CylinderGeometry(100, 100, 300, 32, 1, true);
    const hull = new THREE.Mesh(hullGeometry, aluminum);
    hull.rotation.x = Math.PI / 2;
    group.add(hull);

    // End Caps
    const capGeo = new THREE.SphereGeometry(100, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap1 = new THREE.Mesh(capGeo, titanium);
    cap1.position.z = 150;
    cap1.rotation.x = Math.PI / 2;
    group.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, titanium);
    cap2.position.z = -150;
    cap2.rotation.x = -Math.PI / 2;
    group.add(cap2);

    // Windows (panels)
    const windowGeo = new THREE.PlaneGeometry(80, 280);
    for (let i = 0; i < 3; i++) {
        const windowPane = new THREE.Mesh(windowGeo, glass);
        const angle = (i * Math.PI * 2) / 3;
        windowPane.position.set(Math.cos(angle) * 100, Math.sin(angle) * 100, 0);
        windowPane.rotation.y = -angle;
        windowPane.rotation.x = Math.PI / 2;
        group.add(windowPane);
    }

    // Animation: Cylinder spinning
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 3*Math.PI/2);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI*2);

    const spinTrack = new THREE.QuaternionKeyframeTrack(
        'ONeillCylinder.quaternion',
        [0, 2.5, 5, 7.5, 10],
        [
            q0.x, q0.y, q0.z, q0.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w
        ]
    );

    const spinClip = new THREE.AnimationClip('CylinderSpin', 10, [spinTrack]);
    animationClips.push(spinClip);

    return { group, animationClips };
}
