import { materials } from '../utils/materials.js';

export function createFaradayCage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // The Cage (wireframe-like darkSteel or brass)
    const cageGeom = new THREE.BoxGeometry(5, 5, 5, 5, 5, 5);
    // Use an EdgesGeometry for a wireframe look
    const edges = new THREE.EdgesGeometry(cageGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xaaaaaa, linewidth: 2 });
    const cage = new THREE.LineSegments(edges, lineMat);
    group.add(cage);

    // Internal protected device
    const deviceGeom = new THREE.BoxGeometry(1, 2, 1);
    const device = new THREE.Mesh(deviceGeom, materials.copper);
    group.add(device);

    // External electric field (represented by a pulsating shell)
    const fieldGeom = new THREE.SphereGeometry(4, 32, 32);
    const fieldMat = new THREE.MeshBasicMaterial({ color: 0x8800ff, transparent: true, opacity: 0.2, wireframe: true });
    const field = new THREE.Mesh(fieldGeom, fieldMat);
    field.name = 'electricField';
    group.add(field);

    // Animation: Electric field pulsing and hitting the cage
    const pulseTrack = new THREE.VectorKeyframeTrack(
        'electricField.scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1]
    );
    
    const opacityTrack = new THREE.NumberKeyframeTrack(
        'electricField.material.opacity',
        [0, 0.5, 1],
        [0.1, 0.4, 0.1]
    );

    const clip = new THREE.AnimationClip('FieldPulsing', 1, [pulseTrack, opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
