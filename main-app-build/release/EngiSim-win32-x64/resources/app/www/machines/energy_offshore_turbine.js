import { whitePlastic, steel, aluminum, concrete } from '../utils/materials.js';

export function createOffshoreTurbine(THREE) {
    const group = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(2, 2, 5, 16);
    const base = new THREE.Mesh(baseGeo, concrete);
    base.position.y = 2.5;
    group.add(base);

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.5, 1, 15, 16);
    const tower = new THREE.Mesh(towerGeo, steel);
    tower.position.y = 12.5;
    group.add(tower);

    // Nacelle
    const nacelleGeo = new THREE.BoxGeometry(1.5, 1.5, 4);
    const nacelle = new THREE.Mesh(nacelleGeo, whitePlastic);
    nacelle.position.set(0, 20, 0);
    group.add(nacelle);

    // Rotor
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 20, 2);
    rotorGroup.name = 'Rotor';
    group.add(rotorGroup);

    const hubGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    rotorGroup.add(hub);

    // Blades
    const bladeGeo = new THREE.BoxGeometry(0.2, 8, 0.4);
    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(bladeGeo, whitePlastic);
        blade.position.y = 4.4; // offset so it doesn't clip through hub completely
        
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * 2 * Math.PI) / 3;
        pivot.add(blade);
        rotorGroup.add(pivot);
    }

    // Animation
    const times = [0, 1, 2];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 2 * Math.PI);
    
    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('Rotor.quaternion', times, values);
    const clip = new THREE.AnimationClip('Spin', 2, [track]);

    return { group, animationClips: [clip] };
}
