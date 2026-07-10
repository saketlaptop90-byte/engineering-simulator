import { yellowAccent, steel, darkSteel, concrete } from '../utils/materials.js';

export function createSuspensionBridgeCableAnchor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Anchor Block
    const anchorGeo = new THREE.BoxGeometry(10, 8, 10);
    const anchor = new THREE.Mesh(anchorGeo, concrete);
    anchor.position.y = 4;
    group.add(anchor);

    // Steel Saddles
    const saddleGeo = new THREE.CylinderGeometry(1, 1, 8, 16);
    saddleGeo.rotateZ(Math.PI / 2);
    const saddle = new THREE.Mesh(saddleGeo, steel);
    saddle.position.set(0, 8, 0);
    group.add(saddle);

    // Cables
    const cablesGroup = new THREE.Group();
    cablesGroup.position.set(0, 8, 0);
    cablesGroup.name = "cablesGroup";
    group.add(cablesGroup);

    const cableGeo = new THREE.CylinderGeometry(0.3, 0.3, 20, 16);
    cableGeo.rotateZ(-Math.PI / 6); // angled into anchor
    for (let i = -2; i <= 2; i += 2) {
        const cable = new THREE.Mesh(cableGeo, darkSteel);
        cable.position.set(-8, 5, i);
        cablesGroup.add(cable);
    }

    // Tensioner Simulation
    // Slight vibration/pull on the cables
    const tracks = [
        new THREE.NumberKeyframeTrack('cablesGroup.position[x]', [0, 0.5, 1, 1.5, 2], [0, 0.1, 0, 0.1, 0])
    ];
    const clip = new THREE.AnimationClip('TensionCable', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
