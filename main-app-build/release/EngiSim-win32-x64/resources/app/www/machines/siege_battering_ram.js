import { wood, iron, steel } from '../utils/materials.js';

export function createBatteringRam(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ram shed/cover
    const roofGeo = new THREE.ConeGeometry(5, 4, 4);
    const roof = new THREE.Mesh(roofGeo, wood);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 8;
    group.add(roof);

    const baseGeo = new THREE.BoxGeometry(6, 0.5, 12);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 1;
    group.add(base);

    const uprightGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
    const positions = [
        [-2.5, 4, 5], [2.5, 4, 5],
        [-2.5, 4, -5], [2.5, 4, -5]
    ];
    positions.forEach(pos => {
        const pillar = new THREE.Mesh(uprightGeo, wood);
        pillar.position.set(...pos);
        group.add(pillar);
    });

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    const wheelPositions = [
        [-3.25, 1, 4], [3.25, 1, 4],
        [-3.25, 1, -4], [3.25, 1, -4]
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, wood);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
    });

    // The Ram Log
    const ramGroup = new THREE.Group();
    ramGroup.name = 'ramGroup';
    ramGroup.position.y = 4;
    
    const logGeo = new THREE.CylinderGeometry(0.6, 0.6, 14, 16);
    const log = new THREE.Mesh(logGeo, wood);
    log.rotation.x = Math.PI / 2;
    ramGroup.add(log);

    // Iron Head
    const headGeo = new THREE.ConeGeometry(0.8, 1.5, 16);
    const head = new THREE.Mesh(headGeo, iron);
    head.rotation.x = -Math.PI / 2;
    head.position.z = -7.75;
    ramGroup.add(head);

    group.add(ramGroup);

    // Ropes holding the ram
    const ropeGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const rope1 = new THREE.Mesh(ropeGeo, wood); // simplified rope material as wood
    rope1.position.set(0, 6, 3);
    group.add(rope1);
    const rope2 = new THREE.Mesh(ropeGeo, wood);
    rope2.position.set(0, 6, -3);
    group.add(rope2);

    // Animation: Swing back and forth
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    const swingZ = [0, 3, -2, 1, 0];
    
    const ramTrack = new THREE.NumberKeyframeTrack('ramGroup.position[z]', times, swingZ);
    const clip = new THREE.AnimationClip('Swing', 2, [ramTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
