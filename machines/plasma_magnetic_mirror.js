import { materials } from '../utils/materials.js';

export function createMagneticMirror(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const copperMat = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 });
    const plasmaMat = materials?.plasma || new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });

    // Chamber tube
    const tubeGeo = new THREE.CylinderGeometry(2, 2, 12, 32, 1, true);
    const tube = new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    // Magnetic Coils
    const coilGeo = new THREE.TorusGeometry(2.2, 0.4, 16, 64);
    const coilLeft = new THREE.Mesh(coilGeo, copperMat);
    coilLeft.position.x = -4;
    coilLeft.rotation.y = Math.PI / 2;
    coilLeft.name = "coilLeft";
    group.add(coilLeft);

    const coilRight = new THREE.Mesh(coilGeo, copperMat);
    coilRight.position.x = 4;
    coilRight.rotation.y = Math.PI / 2;
    coilRight.name = "coilRight";
    group.add(coilRight);

    // Central Plasma
    const plasmaGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.scale.set(4, 1, 1);
    plasma.name = "plasmaBeam";
    group.add(plasma);

    // Animations
    const pulseClip = new THREE.AnimationClip('MirrorPulse', 2, [
        new THREE.VectorKeyframeTrack('plasmaBeam.scale', [0, 1, 2], [3, 0.8, 0.8,  5, 1.2, 1.2,  3, 0.8, 0.8]),
        new THREE.VectorKeyframeTrack('coilLeft.scale', [0, 1, 2], [1, 1, 1,  1.05, 1.05, 1.05,  1, 1, 1]),
        new THREE.VectorKeyframeTrack('coilRight.scale', [0, 1, 2], [1, 1, 1,  1.05, 1.05, 1.05,  1, 1, 1])
    ]);
    animationClips.push(pulseClip);

    return { group, animationClips };
}
