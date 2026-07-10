import { materials } from '../utils/materials.js';

export function createCMM(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Granite table
    const tableGeo = new THREE.BoxGeometry(3, 0.5, 2.5);
    const table = new THREE.Mesh(tableGeo, materials.stone || new THREE.MeshStandardMaterial({color: 0x555555}));
    table.position.y = 0.25;
    group.add(table);

    // Bridge Y-axis
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, 0.5, 0);
    group.add(bridgeGroup);

    const leg1Geo = new THREE.BoxGeometry(0.3, 2, 0.5);
    const leg1 = new THREE.Mesh(leg1Geo, materials.metal_dark || new THREE.MeshStandardMaterial({color: 0x333333}));
    leg1.position.set(-1.35, 1, 0);
    bridgeGroup.add(leg1);

    const leg2Geo = new THREE.BoxGeometry(0.3, 2, 0.5);
    const leg2 = new THREE.Mesh(leg2Geo, materials.metal_dark || new THREE.MeshStandardMaterial({color: 0x333333}));
    leg2.position.set(1.35, 1, 0);
    bridgeGroup.add(leg2);

    const crossBeamGeo = new THREE.BoxGeometry(3, 0.4, 0.5);
    const crossBeam = new THREE.Mesh(crossBeamGeo, materials.metal_dark || new THREE.MeshStandardMaterial({color: 0x333333}));
    crossBeam.position.set(0, 2, 0);
    bridgeGroup.add(crossBeam);

    // X-axis carriage
    const carriageGroup = new THREE.Group();
    carriageGroup.position.set(0, 2, 0);
    bridgeGroup.add(carriageGroup);

    const carriageBoxGeo = new THREE.BoxGeometry(0.4, 0.6, 0.6);
    const carriageBox = new THREE.Mesh(carriageBoxGeo, materials.plastic_grey || new THREE.MeshStandardMaterial({color: 0x888888}));
    carriageGroup.add(carriageBox);

    // Z-axis ram
    const ramGeo = new THREE.BoxGeometry(0.2, 1.5, 0.2);
    const ram = new THREE.Mesh(ramGeo, materials.metal_light || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    ram.position.set(0, -0.5, 0);
    carriageGroup.add(ram);

    // Probe
    const probeGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const probe = new THREE.Mesh(probeGeo, materials.ruby || new THREE.MeshStandardMaterial({color: 0xff0000}));
    probe.position.set(0, -1.3, 0);
    ram.add(probe); // probe moves with ram

    // Animation
    const times = [0, 1, 2, 3, 4, 5, 6];
    
    // Bridge (Y axis) movement
    const bridgeYTrack = new THREE.VectorKeyframeTrack(bridgeGroup.uuid + '.position', times, [
        0, 0.5, 0,
        0, 0.5, -0.5,
        0, 0.5, -0.5,
        0, 0.5, 0.5,
        0, 0.5, 0.5,
        0, 0.5, 0,
        0, 0.5, 0
    ]);

    // Carriage (X axis) movement
    const carriageXTrack = new THREE.VectorKeyframeTrack(carriageGroup.uuid + '.position', times, [
        0, 2, 0,
        0, 2, 0,
        -0.8, 2, 0,
        -0.8, 2, 0,
        0.8, 2, 0,
        0.8, 2, 0,
        0, 2, 0
    ]);

    // Ram (Z axis) movement
    const ramZTrack = new THREE.VectorKeyframeTrack(ram.uuid + '.position', times, [
        0, -0.5, 0,
        0, -0.5, 0,
        0, -1, 0,
        0, -0.5, 0,
        0, -0.8, 0,
        0, -0.5, 0,
        0, -0.5, 0
    ]);

    const clip = new THREE.AnimationClip('ProbePath', 6, [bridgeYTrack, carriageXTrack, ramZTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
