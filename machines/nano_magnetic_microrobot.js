import * as CustomMaterials from '../utils/materials.js';

export function createMagneticMicrorobot(THREE) {
    const group = new THREE.Group();
    group.name = "MagneticMicrorobot";
    const animationClips = [];

    const magnetMat = new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.9, roughness: 0.3 });
    const silverMat = CustomMaterials.carbonMaterial || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1.0, roughness: 0.2 });

    // Helical Swimmer Body
    const helixGeo = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16, 2, 8);
    const body = new THREE.Mesh(helixGeo, silverMat);
    body.name = "body";
    group.add(body);

    // Magnetic Head
    const headGeo = new THREE.ConeGeometry(0.6, 1.2, 16);
    const head = new THREE.Mesh(headGeo, magnetMat);
    head.position.z = 1.5;
    head.rotation.x = Math.PI / 2;
    body.add(head);

    // Animation: Corkscrew Swimming
    const times = [0, 2];
    const rotValues = [
        0, 0, 0,
        0, 0, Math.PI * 2
    ];
    const rotTrack = new THREE.VectorKeyframeTrack(`${body.name}.rotation`, times, rotValues);
    const clip = new THREE.AnimationClip('Corkscrew_Swim', 2, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
