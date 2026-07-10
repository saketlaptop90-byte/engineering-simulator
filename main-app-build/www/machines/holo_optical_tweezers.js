import { glass, aluminum, gold } from '../utils/materials.js';

export function createHolographicOpticalTweezers(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const stage = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.2, 32), aluminum);
    stage.position.y = 0.1;
    group.add(stage);

    const lens = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4), glass);
    lens.position.y = 2.5;
    lens.rotation.x = Math.PI;
    group.add(lens);

    const coneGeo = new THREE.ConeGeometry(1, 2.4, 32);
    const coneMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.3, wireframe: true });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = 1.3;
    group.add(cone);

    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), gold);
    particle.position.y = 0.5;
    particle.name = 'TrappedParticle';
    group.add(particle);

    const times = [0, 1, 2, 3, 4];
    const posTrack = new THREE.VectorKeyframeTrack('TrappedParticle.position', times, [
        0, 0.5, 0,
        0.1, 0.6, 0.1,
        -0.1, 0.4, -0.1,
        0.1, 0.5, 0.1,
        0, 0.5, 0
    ]);
    const clip = new THREE.AnimationClip('Trap', 4, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
