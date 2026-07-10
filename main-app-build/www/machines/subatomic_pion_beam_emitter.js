import { darkSteel, glass, copper, gold } from '../utils/materials.js';

export function createPionBeamEmitter(THREE) {
    const group = new THREE.Group();
    group.name = "PionBeamEmitter";

    const base = new THREE.Mesh(new THREE.CylinderGeometry(3, 4, 2, 32), darkSteel);
    base.position.y = 1;
    group.add(base);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 10, 32), darkSteel);
    barrel.position.y = 4;
    barrel.position.z = 3;
    barrel.rotation.x = Math.PI / 2;
    group.add(barrel);

    const emitterRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.2, 16, 64), gold);
    emitterRing.name = "EmitterRing";
    emitterRing.position.set(0, 4, 8);
    group.add(emitterRing);

    const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 20, 32),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
    );
    beam.name = "PionBeam";
    beam.rotation.x = Math.PI / 2;
    beam.position.set(0, 4, 18);
    group.add(beam);

    const times = [0, 0.1, 0.2, 0.3, 0.4];
    const opacities = [0, 1, 0, 1, 0];
    const opacityTrack = new THREE.NumberKeyframeTrack('PionBeam.material.opacity', times, opacities);

    const clip = new THREE.AnimationClip('FireBeam', 0.4, [opacityTrack]);

    return { group, animationClips: [clip] };
}
