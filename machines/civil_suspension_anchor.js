import { materials } from '../utils/materials.js';

export function createSuspensionAnchor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base/Anchor Block (Concrete)
    const baseGeom = new THREE.BoxGeometry(20, 10, 20);
    const baseMesh = new THREE.Mesh(baseGeom, materials.concrete);
    baseMesh.position.y = 5;
    group.add(baseMesh);

    // Cable attachment point (Dark Steel)
    const attachmentGeom = new THREE.CylinderGeometry(2, 2, 8, 32);
    const attachmentMesh = new THREE.Mesh(attachmentGeom, materials.darkSteel);
    attachmentMesh.rotation.z = Math.PI / 4;
    attachmentMesh.position.set(5, 12, 0);
    group.add(attachmentMesh);

    // Main Cable (Cables)
    const cableGeom = new THREE.CylinderGeometry(0.8, 0.8, 30, 16);
    const cableMesh = new THREE.Mesh(cableGeom, materials.cables);
    cableMesh.rotation.z = Math.PI / 4;
    cableMesh.position.set(15, 22, 0);
    cableMesh.name = 'MainCable';
    group.add(cableMesh);

    // Animation: Subtle tensioning of the cable
    const cablePositionKF = new THREE.VectorKeyframeTrack(
        'MainCable.position',
        [0, 2, 4],
        [15, 22, 0, 15.2, 22.2, 0, 15, 22, 0]
    );
    const cableClip = new THREE.AnimationClip('TensionCable', 4, [cablePositionKF]);
    animationClips.push(cableClip);

    return { group, animationClips };
}
