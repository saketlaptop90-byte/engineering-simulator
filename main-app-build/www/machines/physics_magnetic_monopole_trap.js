import { glass, gold, darkSteel } from '../utils/materials.js';

export function createMagneticMonopoleTrap(THREE) {
    const group = new THREE.Group();
    function generateId() { return Math.random().toString(36).substr(2, 9); }
    
    const housingGeometry = new THREE.DodecahedronGeometry(3);
    const housing = new THREE.Mesh(housingGeometry, darkSteel);
    housing.material = darkSteel.clone();
    housing.material.wireframe = true;
    group.add(housing);
    
    const innerGeometry = new THREE.OctahedronGeometry(1.5);
    const inner = new THREE.Mesh(innerGeometry, glass);
    inner.name = "innerTrap_" + generateId();
    group.add(inner);
    
    const conduitGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const conduits = [];
    for (let i = 0; i < 3; i++) {
        const conduit = new THREE.Mesh(conduitGeometry, gold);
        if (i === 0) conduit.rotation.x = Math.PI / 2;
        if (i === 1) conduit.rotation.z = Math.PI / 2;
        group.add(conduit);
        conduits.push(conduit);
    }

    const animationClips = [];
    const times = [0, 1, 2];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, Math.PI, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 2, Math.PI * 2, 0));
    
    const trapTrack = new THREE.QuaternionKeyframeTrack(`${inner.name}.quaternion`, times, [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    
    const clip = new THREE.AnimationClip('TrapSpin', 2, [trapTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
