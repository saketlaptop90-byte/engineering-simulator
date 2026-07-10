import { materials } from '../utils/materials.js';

export function createTBMErector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Shield
    const shieldGeo = new THREE.CylinderGeometry(5, 5, 4, 32, 1, true);
    const shield = new THREE.Mesh(shieldGeo, materials.steel);
    shield.rotation.x = Math.PI / 2;
    group.add(shield);

    // Erector Ring
    const erectorRingGeo = new THREE.TorusGeometry(4.2, 0.3, 16, 32);
    const erectorRing = new THREE.Group();
    const erectorRingMesh = new THREE.Mesh(erectorRingGeo, materials.steel);
    erectorRing.add(erectorRingMesh);
    group.add(erectorRing);

    // Arm
    const armGeo = new THREE.BoxGeometry(0.5, 3.5, 0.5);
    const arm = new THREE.Mesh(armGeo, materials.steel);
    arm.position.y = 2;
    erectorRing.add(arm);

    // Vacuum Pad
    const padGeo = new THREE.BoxGeometry(1.5, 0.2, 1);
    const pad = new THREE.Mesh(padGeo, materials.rubber);
    pad.position.y = 3.8;
    erectorRing.add(pad);

    // Concrete Segment
    const segmentGeo = new THREE.CylinderGeometry(4.8, 4.8, 1, 32, 1, false, 0, Math.PI / 4);
    const segment = new THREE.Mesh(segmentGeo, materials.concrete);
    segment.rotation.x = Math.PI / 2;
    
    const segmentPivot = new THREE.Group();
    segmentPivot.add(segment);
    group.add(segmentPivot);

    // Animation
    const erectorRotTrack = new THREE.NumberKeyframeTrack(
        `${erectorRing.uuid}.rotation[z]`,
        [0, 2, 4, 6, 8, 10],
        [0, -Math.PI / 2, -Math.PI / 2, Math.PI / 4, Math.PI / 4, 0]
    );

    const segmentRotTrack = new THREE.NumberKeyframeTrack(
        `${segmentPivot.uuid}.rotation[z]`,
        [0, 2, 4, 6, 8, 10],
        [-Math.PI / 2, -Math.PI / 2, -Math.PI / 2, Math.PI / 4, Math.PI / 4, Math.PI / 4]
    );
    
    const armScaleTrack = new THREE.NumberKeyframeTrack(
        `${erectorRing.uuid}.scale[y]`,
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 1, 0.8, 0.8, 1, 1, 1, 1.2, 1.2, 1, 1]
    );

    const clip = new THREE.AnimationClip('SegmentErection', 10, [erectorRotTrack, segmentRotTrack, armScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
