import { materials } from '../utils/materials.js';

export function createLogSplitter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Beam
    const beamGeo = new THREE.BoxGeometry(0.5, 0.5, 4);
    const beam = new THREE.Mesh(beamGeo, materials.steel);
    beam.position.y = 0.5;
    group.add(beam);

    // Wedge
    const wedgeGeo = new THREE.ConeGeometry(0.3, 0.8, 4);
    const wedge = new THREE.Mesh(wedgeGeo, materials.steel);
    wedge.position.set(0, 0.5, -1.8);
    wedge.rotation.x = Math.PI / 2;
    wedge.rotation.y = Math.PI / 4;
    group.add(wedge);

    // Hydraulic Cylinder
    const cylGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const cyl = new THREE.Mesh(cylGeo, materials.paintedMetal);
    cyl.position.set(0, 0.5, 1.5);
    cyl.rotation.x = Math.PI / 2;
    group.add(cyl);

    // Pusher block
    const pusherGeo = new THREE.BoxGeometry(0.6, 0.6, 0.2);
    const pusher = new THREE.Mesh(pusherGeo, materials.steel);
    pusher.position.set(0, 0.5, 0.75);
    group.add(pusher);

    // Animation
    const pusherTrack = new THREE.NumberKeyframeTrack(
        `${pusher.uuid}.position[z]`,
        [0, 2, 4],
        [0.75, -1.4, 0.75]
    );

    const clip = new THREE.AnimationClip('Split', 4, [pusherTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
