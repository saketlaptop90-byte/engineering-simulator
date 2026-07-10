import { titanium, glass, darkSteel } from '../utils/materials.js';

export function createDeepOceanTidalTurbine(THREE) {
    const group = new THREE.Group();

    // Vertical Pillar Support
    const pillarGeo = new THREE.CylinderGeometry(1.5, 2, 20, 16);
    const pillar = new THREE.Mesh(pillarGeo, darkSteel);
    pillar.position.y = 10;
    group.add(pillar);

    // Generator Head
    const headGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 16);
    const head = new THREE.Mesh(headGeo, titanium);
    head.rotation.x = Math.PI / 2;
    head.position.y = 18;
    group.add(head);

    // Massive Rotor Assembly
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 18, 3.5);
    
    const hubGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const hub = new THREE.Mesh(hubGeo, titanium);
    rotorGroup.add(hub);

    for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.5, 8, 0.2);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.position.y = 4.5;
        const pivot = new THREE.Group();
        pivot.rotation.z = (Math.PI * 2 / 3) * i;
        pivot.add(blade);
        rotorGroup.add(pivot);
    }
    group.add(rotorGroup);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI*2);

    const quatKF = new THREE.QuaternionKeyframeTrack(
        '.children[2].quaternion',
        [0, 5, 10],
        [q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w]
    );

    const clip = new THREE.AnimationClip('SlowSpin', 10, [quatKF]);

    return { group, animationClips: [clip] };
}
