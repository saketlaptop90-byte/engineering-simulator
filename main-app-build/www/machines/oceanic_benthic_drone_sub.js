import { titanium, glass, darkSteel } from '../utils/materials.js';

export function createBenthicDroneSub(THREE) {
    const group = new THREE.Group();

    // Drone Hull
    const hullGeo = new THREE.CapsuleGeometry(2, 6, 16, 16);
    const hull = new THREE.Mesh(hullGeo, titanium);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    // Forward Observation Window
    const windowGeo = new THREE.SphereGeometry(1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const win = new THREE.Mesh(windowGeo, glass);
    win.rotation.z = -Math.PI / 2;
    win.position.x = 3.5;
    group.add(win);

    // Propeller Array
    const propGroup = new THREE.Group();
    propGroup.position.x = -4.5;
    
    for(let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 2, 0.5);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.position.y = 1;
        const pivot = new THREE.Group();
        pivot.rotation.x = (Math.PI * 2 / 3) * i;
        pivot.add(blade);
        propGroup.add(pivot);
    }
    group.add(propGroup);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI*2);
    
    const quatKF = new THREE.QuaternionKeyframeTrack(
        '.children[2].quaternion',
        [0, 0.5, 1],
        [q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w]
    );

    const clip = new THREE.AnimationClip('PropellerSpin', 1, [quatKF]);

    return { group, animationClips: [clip] };
}
