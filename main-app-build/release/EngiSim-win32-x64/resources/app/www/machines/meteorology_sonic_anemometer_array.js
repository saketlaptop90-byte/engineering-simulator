import * as materials from '../utils/materials.js';

export function createSonicAnemometerArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const matSensor = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x222222 });

    const poleGeom = new THREE.CylinderGeometry(0.2, 0.2, 5);
    const pole = new THREE.Mesh(poleGeom, matMetal);
    pole.position.y = 2.5;
    group.add(pole);

    const headGroup = new THREE.Group();
    headGroup.position.y = 5;
    headGroup.name = 'sonicHead';
    group.add(headGroup);

    // 3 pairs of transducers
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const armGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
        const arm = new THREE.Mesh(armGeom, matMetal);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = angle;
        arm.position.y = 0;
        headGroup.add(arm);

        const transGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.3);
        const trans1 = new THREE.Mesh(transGeom, matSensor);
        trans1.position.set(Math.cos(angle) * 0.75, 0.15, -Math.sin(angle) * 0.75);
        headGroup.add(trans1);
        
        const trans2 = new THREE.Mesh(transGeom, matSensor);
        trans2.position.set(-Math.cos(angle) * 0.75, -0.15, Math.sin(angle) * 0.75);
        headGroup.add(trans2);
    }
    
    // Slight oscillation for sonic head as a visual cue
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.2, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    const track = new THREE.QuaternionKeyframeTrack('sonicHead.quaternion', [0, 2, 4], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    const clip = new THREE.AnimationClip('OscillateHead', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
