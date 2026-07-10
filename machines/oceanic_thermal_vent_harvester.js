import { titanium, glass, darkSteel } from '../utils/materials.js';

export function createThermalVentHarvester(THREE) {
    const group = new THREE.Group();

    // Base Cone
    const baseGeo = new THREE.ConeGeometry(4, 6, 8);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 3;
    group.add(base);

    // Turbine rotor
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 6;
    const centerGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
    const center = new THREE.Mesh(centerGeo, titanium);
    center.rotation.z = Math.PI / 2;
    rotorGroup.add(center);

    for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 4, 1);
        const blade = new THREE.Mesh(bladeGeo, titanium);
        blade.position.y = 2.5;
        const pivot = new THREE.Group();
        pivot.rotation.x = (Math.PI / 2) * i;
        pivot.add(blade);
        rotorGroup.add(pivot);
    }
    group.add(rotorGroup);
    
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI*2);
    
    const quatKF = new THREE.QuaternionKeyframeTrack(
        '.children[1].quaternion',
        [0, 1, 2],
        [q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w]
    );

    const clip = new THREE.AnimationClip('TurbineSpin', 2, [quatKF]);

    return { group, animationClips: [clip] };
}
