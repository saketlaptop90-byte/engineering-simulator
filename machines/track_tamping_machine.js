import { materials } from '../utils/materials.js';

export function createTrackTampingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main body
    const bodyGeo = new THREE.BoxGeometry(5, 2, 2.5);
    const body = new THREE.Mesh(bodyGeo, materials.metalPainted || new THREE.MeshStandardMaterial({color: 0xffcc00}));
    body.position.set(0, 1.5, 0);
    group.add(body);

    // Tamping unit (moves down to tamp)
    const tampingUnitGroup = new THREE.Group();
    tampingUnitGroup.name = 'tampingUnit';
    tampingUnitGroup.position.set(0, 0.5, 0);
    group.add(tampingUnitGroup);

    // Tamping tools/tines
    const tineGeo = new THREE.CylinderGeometry(0.05, 0.02, 1);
    tineGeo.translate(0, -0.5, 0);

    const tinePositions = [
        [-0.5, 0, -0.5], [0.5, 0, -0.5],
        [-0.5, 0, 0.5], [0.5, 0, 0.5]
    ];

    const tines = [];
    tinePositions.forEach((pos, idx) => {
        const tine = new THREE.Mesh(tineGeo, materials.metalDark || new THREE.MeshStandardMaterial({color: 0x333333}));
        tine.name = `tine_${idx}`;
        tine.position.set(...pos);
        tampingUnitGroup.add(tine);
        tines.push(tine);
    });

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2);
    wheelGeo.rotateX(Math.PI / 2);
    
    const wheelPositions = [
        [-2, 0.4, 1.3], [2, 0.4, 1.3],
        [-2, 0.4, -1.3], [2, 0.4, -1.3]
    ];

    wheelPositions.forEach((pos) => {
        const wheel = new THREE.Mesh(wheelGeo, materials.metal || new THREE.MeshStandardMaterial({color: 0x888888}));
        wheel.position.set(...pos);
        group.add(wheel);
    });

    // Animation: Move down, squeeze, move up
    const times = [0, 1, 1.5, 2, 3];
    const yTrack = new THREE.VectorKeyframeTrack('tampingUnit.position', times, [
        0, 0.5, 0,    // Idle
        0, -0.2, 0,   // Down
        0, -0.2, 0,   // Squeeze (hold)
        0, 0.5, 0,    // Up
        0, 0.5, 0     // Idle
    ]);

    // Tine squeeze animation
    const squeezeRotTracks = [];
    tines.forEach((tine, idx) => {
        const sign = (idx % 2 === 0) ? -1 : 1; // Pair tines squeeze towards each other
        const qIdle = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
        const qSqueeze = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, sign * Math.PI / 16));
        
        const track = new THREE.QuaternionKeyframeTrack(`${tine.name}.quaternion`, times, [
            ...qIdle.toArray(),
            ...qIdle.toArray(),
            ...qSqueeze.toArray(),
            ...qIdle.toArray(),
            ...qIdle.toArray()
        ]);
        squeezeRotTracks.push(track);
    });

    const clip = new THREE.AnimationClip('TampingCycle', 3, [yTrack, ...squeezeRotTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
