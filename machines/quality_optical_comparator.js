import { materials } from '../utils/materials.js';

export function createOpticalComparator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, materials.metal_dark || new THREE.MeshStandardMaterial({color: 0x333333}));
    base.position.y = 0.25;
    group.add(base);

    // Screen housing
    const housingGeo = new THREE.BoxGeometry(1.5, 2, 0.5);
    const housing = new THREE.Mesh(housingGeo, materials.plastic_grey || new THREE.MeshStandardMaterial({color: 0x888888}));
    housing.position.set(0, 1.5, -0.5);
    group.add(housing);

    // Screen
    const screenGeo = new THREE.CircleGeometry(0.6, 32);
    const screen = new THREE.Mesh(screenGeo, materials.glass || new THREE.MeshPhysicalMaterial({transmission: 0.9, opacity: 1, transparent: true}));
    screen.position.set(0, 1.6, -0.24);
    group.add(screen);

    // Stage
    const stageGeo = new THREE.BoxGeometry(1, 0.1, 0.8);
    const stage = new THREE.Mesh(stageGeo, materials.metal_light || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    stage.position.set(0, 0.8, 0.3);
    group.add(stage);

    // Lens
    const lensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
    const lens = new THREE.Mesh(lensGeo, materials.glass || new THREE.MeshPhysicalMaterial({transmission: 0.9, opacity: 1, transparent: true}));
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 1, 0.1);
    group.add(lens);

    // Part to measure
    const partGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16);
    const part = new THREE.Mesh(partGeo, materials.metal_copper || new THREE.MeshStandardMaterial({color: 0xb87333}));
    part.position.set(0, 0.95, 0.3);
    group.add(part);

    // Animation: Stage moving X/Y
    const trackName = stage.uuid + '.position';
    const times = [0, 2, 4, 6, 8];
    const values = [
        0, 0.8, 0.3,
        0.2, 0.8, 0.3,
        0.2, 0.8, 0.4,
        -0.2, 0.8, 0.4,
        0, 0.8, 0.3
    ];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Measure', 8, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
