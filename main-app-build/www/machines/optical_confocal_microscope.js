import * as materials from '../utils/materials.js';

export function createConfocalMicroscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyGeo = new THREE.CylinderGeometry(1, 1.5, 6, 32);
    const body = new THREE.Mesh(bodyGeo, materials.metalMaterial || new THREE.MeshStandardMaterial({color: 0xdddddd}));
    body.position.y = 3;
    group.add(body);

    const lensGeo = new THREE.CylinderGeometry(0.5, 0.2, 1, 32);
    const lens = new THREE.Mesh(lensGeo, materials.metalMaterial || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    lens.position.y = -0.5;
    group.add(lens);

    const stageGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const stage = new THREE.Mesh(stageGeo, materials.darkMaterial || new THREE.MeshStandardMaterial({color: 0x222222}));
    stage.position.y = -2;
    stage.name = 'Stage';
    group.add(stage);

    const beamGeo = new THREE.ConeGeometry(0.1, 1.5, 16);
    const beam = new THREE.Mesh(beamGeo, materials.laserMaterial || new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.6}));
    beam.position.y = -1.25;
    group.add(beam);

    const sampleGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const sample = new THREE.Mesh(sampleGeo, materials.sampleMaterial || new THREE.MeshStandardMaterial({color: 0xff00ff}));
    sample.position.y = -1.9;
    sample.name = 'Sample';
    group.add(sample);

    const stageTrack = new THREE.VectorKeyframeTrack(
        'Stage.position',
        [0, 1, 2, 3, 4],
        [-0.5, -2, -0.5,  0.5, -2, -0.5,  0.5, -2, 0.5,  -0.5, -2, 0.5,  -0.5, -2, -0.5]
    );

    const sampleTrack = new THREE.VectorKeyframeTrack(
        'Sample.position',
        [0, 1, 2, 3, 4],
        [-0.5, -1.9, -0.5,  0.5, -1.9, -0.5,  0.5, -1.9, 0.5,  -0.5, -1.9, 0.5,  -0.5, -1.9, -0.5]
    );

    const scaleTrack = new THREE.VectorKeyframeTrack(
        'Sample.scale',
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
        [1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1]
    );

    const clip = new THREE.AnimationClip('ConfocalScan', 4, [stageTrack, sampleTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
