import { steel, copper, darkSteel, glass } from '../utils/materials.js';

export function createWaveEnergyConverter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Pillar
    const baseGeom = new THREE.CylinderGeometry(1, 1, 15, 16);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    base.position.y = 7.5;
    group.add(base);

    // Bobbing Float (Point Absorber)
    const floatGroup = new THREE.Group();
    floatGroup.name = "floatGroup";
    floatGroup.position.y = 10;
    group.add(floatGroup);

    const floatGeom = new THREE.TorusGeometry(3, 1, 16, 32);
    const floatMesh = new THREE.Mesh(floatGeom, steel);
    floatMesh.rotation.x = Math.PI / 2;
    floatGroup.add(floatMesh);

    // Generator core inside float
    const coreGeom = new THREE.CylinderGeometry(1.2, 1.2, 2, 16);
    const coreMesh = new THREE.Mesh(coreGeom, copper);
    floatGroup.add(coreMesh);

    // Connector arms
    for (let i = 0; i < 4; i++) {
        const armGeom = new THREE.CylinderGeometry(0.2, 0.2, 2);
        const arm = new THREE.Mesh(armGeom, steel);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(Math.cos(i * Math.PI / 2) * 2, 0, Math.sin(i * Math.PI / 2) * 2);
        arm.lookAt(0, 0, 0);
        floatGroup.add(arm);
    }

    // Animation (Float bobbing up and down)
    const times = [0, 1.5, 3, 4.5, 6];
    const posValues = [
        0, 10, 0,
        0, 12, 0,
        0, 10, 0,
        0, 8, 0,
        0, 10, 0
    ];

    const floatTrack = new THREE.VectorKeyframeTrack(`${floatGroup.name}.position`, times, posValues);
    const clip = new THREE.AnimationClip('Bobbing', 6, [floatTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
