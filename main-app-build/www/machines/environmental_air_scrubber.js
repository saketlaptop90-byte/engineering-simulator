import * as materials from '../utils/materials.js';

export function createAirScrubberSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Tower
    const towerGeom = new THREE.CylinderGeometry(2.5, 2.5, 12, 32);
    const tower = new THREE.Mesh(towerGeom, materials.whitePlastic);
    tower.position.y = 6;
    group.add(tower);

    // Gas Inlet
    const inletGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    const inlet = new THREE.Mesh(inletGeom, materials.steel);
    inlet.rotation.z = Math.PI / 2;
    inlet.position.set(-3.5, 2, 0);
    group.add(inlet);

    // Gas Outlet
    const outletGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    const outlet = new THREE.Mesh(outletGeom, materials.steel);
    outlet.rotation.z = Math.PI / 2;
    outlet.position.set(3.5, 10, 0);
    group.add(outlet);

    // Liquid Inlet (Top)
    const liquidPipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const liquidPipe = new THREE.Mesh(liquidPipeGeom, materials.blueAccent);
    liquidPipe.position.set(0, 13.5, 0);
    group.add(liquidPipe);

    // Blower Fan on Gas Inlet
    const fanGroup = new THREE.Group();
    fanGroup.name = 'scrubber_fanGroup';
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.4), materials.plastic);
        blade.rotation.x = Math.PI / 6;
        blade.rotation.y = (i * Math.PI) / 2;
        fanGroup.add(blade);
    }
    fanGroup.position.set(-4.5, 2, 0);
    fanGroup.rotation.z = Math.PI / 2;
    group.add(fanGroup);

    // Spray Nozzles / Falling Liquid Mist
    const mistGroup = new THREE.Group();
    const dropGeom = new THREE.SphereGeometry(0.1, 4, 4);
    for (let i = 0; i < 30; i++) {
        const drop = new THREE.Mesh(dropGeom, materials.glass);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 2;
        drop.position.set(Math.cos(theta)*r, 10 - Math.random()*8, Math.sin(theta)*r);
        mistGroup.add(drop);
    }
    group.add(mistGroup);

    // Animations
    const fanTrack = new THREE.NumberKeyframeTrack(
        `scrubber_fanGroup.rotation[x]`,
        [0, 1],
        [0, Math.PI * 4]
    );

    const mistTracks = [];
    mistGroup.children.forEach((drop, index) => {
        drop.name = `scrubber_drop_${index}`;
        const startY = drop.position.y;
        const endY = startY - 4; // Falls down
        const track = new THREE.VectorKeyframeTrack(
            `${drop.name}.position`,
            [0, 1],
            [drop.position.x, startY, drop.position.z, drop.position.x, endY, drop.position.z]
        );
        mistTracks.push(track);
    });

    const clip = new THREE.AnimationClip('Scrubber_Operation', 1, [fanTrack, ...mistTracks]);
    animationClips.push(clip);

    group.userData.animatedObjects = [fanGroup, ...mistGroup.children];

    return { group, animationClips };
}
