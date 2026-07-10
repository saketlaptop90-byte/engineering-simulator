import { materials } from '../utils/materials.js';

export function createTrussBridgeJoint(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Gusset Plate (Dark Steel)
    const plateGeom = new THREE.BoxGeometry(10, 10, 0.5);
    const plateMesh = new THREE.Mesh(plateGeom, materials.darkSteel);
    group.add(plateMesh);

    // Horizontal Beam
    const hBeamGeom = new THREE.BoxGeometry(30, 2, 2);
    const hBeamMesh = new THREE.Mesh(hBeamGeom, materials.concrete);
    group.add(hBeamMesh);

    // Vertical Beam
    const vBeamGeom = new THREE.BoxGeometry(2, 20, 2);
    const vBeamMesh = new THREE.Mesh(vBeamGeom, materials.concrete);
    vBeamMesh.position.y = 10;
    group.add(vBeamMesh);

    // Diagonal Beams (Trusses)
    const dBeamGeom = new THREE.BoxGeometry(2, 28, 2);
    
    const dBeam1 = new THREE.Mesh(dBeamGeom, materials.darkSteel);
    dBeam1.rotation.z = Math.PI / 4;
    dBeam1.position.set(10, 10, 0);
    dBeam1.name = 'DiagonalBeam1';
    group.add(dBeam1);

    const dBeam2 = new THREE.Mesh(dBeamGeom, materials.darkSteel);
    dBeam2.rotation.z = -Math.PI / 4;
    dBeam2.position.set(-10, 10, 0);
    dBeam2.name = 'DiagonalBeam2';
    group.add(dBeam2);

    // Animation: Vibration/Load Stress
    const vibrationKF = new THREE.VectorKeyframeTrack(
        'DiagonalBeam1.position',
        [0, 0.1, 0.2, 0.3, 0.4],
        [
            10, 10, 0,
            10.1, 10.1, 0,
            9.9, 9.9, 0,
            10.05, 10.05, 0,
            10, 10, 0
        ]
    );
    const vibrationClip = new THREE.AnimationClip('StressVibration', 0.4, [vibrationKF]);
    animationClips.push(vibrationClip);

    return { group, animationClips };
}
