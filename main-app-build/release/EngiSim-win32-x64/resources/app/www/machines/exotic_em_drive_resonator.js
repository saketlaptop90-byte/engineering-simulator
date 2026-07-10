import { titanium, gold, glass } from '../utils/materials.js';

export function createEMDriveResonator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Truncated cone body
    const bodyGeo = new THREE.CylinderGeometry(2, 5, 10, 32);
    const body = new THREE.Mesh(bodyGeo, titanium);
    group.add(body);

    // Resonator rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3, 0.2, 16, 50), gold);
    ring1.position.y = 2;
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.2, 16, 50), gold);
    ring2.position.y = -3;
    ring2.rotation.x = Math.PI / 2;
    group.add(ring2);

    // Animation: High-frequency vibration
    const posTrack = new THREE.VectorKeyframeTrack(
        body.uuid + '.position',
        [0, 0.1, 0.2, 0.3, 0.4],
        [0,0,0,  0,0.1,0,  0,-0.1,0,  0,0.1,0,  0,0,0]
    );

    const clip = new THREE.AnimationClip('EMResonance', -1, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
