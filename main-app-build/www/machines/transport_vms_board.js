import { steel, darkSteel } from '../utils/materials.js';

export function createVMSBoard(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Gantry Pillars
    const pillarGeom = new THREE.CylinderGeometry(0.3, 0.3, 6);
    const pillar1 = new THREE.Mesh(pillarGeom, steel);
    pillar1.position.set(-4, 3, 0);
    group.add(pillar1);

    const pillar2 = new THREE.Mesh(pillarGeom, steel);
    pillar2.position.set(4, 3, 0);
    group.add(pillar2);

    // Gantry Crossbeam
    const beamGeom = new THREE.BoxGeometry(8.6, 0.5, 0.5);
    const beam = new THREE.Mesh(beamGeom, steel);
    beam.position.set(0, 5.5, 0);
    group.add(beam);

    // VMS Board Housing
    const boardGeom = new THREE.BoxGeometry(6, 2, 0.6);
    const board = new THREE.Mesh(boardGeom, darkSteel);
    board.position.set(0, 4.5, 0.1);
    group.add(board);

    // Screen
    const screenGeom = new THREE.PlaneGeometry(5.8, 1.8);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 4.5, 0.41);
    group.add(screen);

    // LED chevrons (animated to show direction)
    const ledMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1 });
    
    const allTracks = [];

    // Create 3 chevrons
    for (let i = 0; i < 3; i++) {
        const chevronGroup = new THREE.Group();
        chevronGroup.position.set(-1.5 + i * 1.5, 4.5, 0.42);
        chevronGroup.name = `Chevron${i}`;

        const topGeom = new THREE.BoxGeometry(0.8, 0.1, 0.05);
        const topPart = new THREE.Mesh(topGeom, ledMat);
        topPart.rotation.z = Math.PI / 4;
        topPart.position.set(0, 0.28, 0);
        chevronGroup.add(topPart);

        const botGeom = new THREE.BoxGeometry(0.8, 0.1, 0.05);
        const botPart = new THREE.Mesh(botGeom, ledMat);
        botPart.rotation.z = -Math.PI / 4;
        botPart.position.set(0, -0.28, 0);
        chevronGroup.add(botPart);

        group.add(chevronGroup);

        allTracks.push(new THREE.VectorKeyframeTrack(
            `Chevron${i}.scale`,
            [0, i * 0.5, i * 0.5 + 0.2, i * 0.5 + 0.8, 2],
            [0.01,0.01,0.01,  0.01,0.01,0.01,  1,1,1,  0.01,0.01,0.01,  0.01,0.01,0.01]
        ));
    }

    const mainClip = new THREE.AnimationClip('VMS_Animation', 2, allTracks);
    animationClips.push(mainClip);

    return { group, animationClips };
}
