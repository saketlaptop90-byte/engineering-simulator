import * as materials from '../utils/materials.js';

export function createAdaptiveOpticsDeformableMirror(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const supportGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);
    const support = new THREE.Mesh(supportGeo, materials.darkMaterial || new THREE.MeshStandardMaterial({color: 0x222222}));
    support.position.y = -0.25;
    group.add(support);

    const actuatorGroup = new THREE.Group();
    actuatorGroup.name = 'Actuators';
    group.add(actuatorGroup);

    const spacing = 0.8;
    for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
            if (x*x + z*z < 6) {
                const actGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
                const actuator = new THREE.Mesh(actGeo, materials.metalMaterial || new THREE.MeshStandardMaterial({color: 0x777777}));
                actuator.position.set(x * spacing, 0.25, z * spacing);
                actuatorGroup.add(actuator);
            }
        }
    }

    const mirrorGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.05, 32);
    const mirror = new THREE.Mesh(mirrorGeo, materials.mirrorMaterial || new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 1, roughness: 0.1}));
    mirror.position.y = 0.525;
    mirror.name = 'Membrane';
    group.add(mirror);

    const scaleTrack = new THREE.VectorKeyframeTrack(
        'Membrane.scale',
        [0, 1, 2, 3],
        [1, 1, 1,  1, 1.2, 1,  1, 0.8, 1,  1, 1, 1]
    );

    const actuatorScaleTrack = new THREE.VectorKeyframeTrack(
        'Actuators.scale',
        [0, 1, 2, 3],
        [1, 1, 1,  1, 1.2, 1,  1, 0.8, 1,  1, 1, 1]
    );

    const clip = new THREE.AnimationClip('AdaptiveDeformation', 3, [scaleTrack, actuatorScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
