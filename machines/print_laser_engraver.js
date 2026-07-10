import { materials } from '../utils/materials.js';

export function createLaserEngraver(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Plate
    const baseGeo = new THREE.BoxGeometry(5, 0.2, 5);
    const base = new THREE.Mesh(baseGeo, materials?.steel || new THREE.MeshStandardMaterial({color: 0x444444}));
    group.add(base);

    // Gantry
    const gantryGroup = new THREE.Group();
    gantryGroup.name = "Gantry";
    gantryGroup.position.set(0, 2, 0);
    group.add(gantryGroup);

    const gantryRailGeo = new THREE.BoxGeometry(4.5, 0.2, 0.2);
    const gantryRail = new THREE.Mesh(gantryRailGeo, materials?.aluminum || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    gantryGroup.add(gantryRail);

    // Head
    const headGroup = new THREE.Group();
    headGroup.name = "LaserHead";
    headGroup.position.set(-1.8, 0, 0);
    gantryGroup.add(headGroup);

    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headBase = new THREE.Mesh(headGeo, materials?.plastic || new THREE.MeshStandardMaterial({color: 0x111111}));
    headGroup.add(headBase);

    // Laser Beam
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 2);
    const beamMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0});
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.name = "LaserBeam";
    beam.position.y = -1;
    headGroup.add(beam);

    // Animate head moving along gantry (X axis)
    const times = [0, 1, 2, 3, 4];
    const headValues = [
        -1.8, 0, 0,
        1.8, 0, 0,
        1.8, 0, 0,
        -1.8, 0, 0,
        -1.8, 0, 0
    ];
    const trackHead = new THREE.VectorKeyframeTrack('LaserHead.position', times, headValues);
    
    // Animate Gantry moving along Z axis
    const gantryValues = [
        0, 2, -1.5,
        0, 2, -1.5,
        0, 2, 1.5,
        0, 2, 1.5,
        0, 2, -1.5
    ];
    const trackGantry = new THREE.VectorKeyframeTrack('Gantry.position', times, gantryValues);

    // Animate beam opacity (pulsing)
    const beamTimes = [0, 0.1, 0.9, 1.0, 2, 2.1, 2.9, 3.0, 4];
    const beamValuesOpacity = [0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0, 0];
    const trackBeam = new THREE.NumberKeyframeTrack('LaserBeam.material.opacity', beamTimes, beamValuesOpacity);

    const clip = new THREE.AnimationClip('engrave', 4, [trackHead, trackGantry, trackBeam]);
    animationClips.push(clip);

    return { group, animationClips };
}
