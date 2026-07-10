import * as CustomMaterials from '../utils/materials.js';

export function createFlagellarMotor(THREE) {
    const group = new THREE.Group();
    group.name = "FlagellarMotor";
    const animationClips = [];

    const carbonMat = CustomMaterials.carbonMaterial || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.6 });
    const proteinMat = new THREE.MeshStandardMaterial({ color: 0x22aa55, roughness: 0.8 });

    // Motor Base
    const baseGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, carbonMat);
    group.add(base);

    // Rotor
    const rotorGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const rotor = new THREE.Mesh(rotorGeo, proteinMat);
    rotor.position.y = 0.75;
    rotor.name = "rotor";
    group.add(rotor);

    // Flagellum (Tail)
    const tailGeo = new THREE.TorusKnotGeometry(0.2, 0.05, 64, 8, 1, 10);
    const tail = new THREE.Mesh(tailGeo, carbonMat);
    tail.position.y = 1.5;
    rotor.add(tail);

    // Animation: Motor Spinning
    const times = [0, 1];
    const rotValues = [
        0, 0, 0,
        0, Math.PI * 2, 0
    ];
    const rotTrack = new THREE.VectorKeyframeTrack(`${rotor.name}.rotation`, times, rotValues);
    const clip = new THREE.AnimationClip('Motor_Spin', 1, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
