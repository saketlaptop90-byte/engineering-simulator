import { glass, gold, copper, aluminum } from '../utils/materials.js';

export function createFlowCytometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chip substrate
    const subGeom = new THREE.BoxGeometry(15, 0.5, 8);
    const sub = new THREE.Mesh(subGeom, glass);
    group.add(sub);

    // Channels
    const channelMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const mainChannel = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 0.4), channelMat);
    group.add(mainChannel);

    const sortChannel1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 0.4), channelMat);
    sortChannel1.position.set(6, 0, 2);
    sortChannel1.rotation.y = Math.PI / 4;
    group.add(sortChannel1);

    const sortChannel2 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 0.4), channelMat);
    sortChannel2.position.set(6, 0, -2);
    sortChannel2.rotation.y = -Math.PI / 4;
    group.add(sortChannel2);

    // Laser & Detector
    const laserGeom = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const laser = new THREE.Mesh(laserGeom, gold);
    laser.position.set(0, 2, 0);
    group.add(laser);

    const beamGeom = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.set(0, 0.5, 0);
    group.add(beam);

    // Cells
    const cellsGroup = new THREE.Group();
    cellsGroup.name = "cells";
    group.add(cellsGroup);

    const cellGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const cellMat1 = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Type 1
    const cellMat2 = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Type 2

    const tracks = [];
    const duration = 5;

    for (let i = 0; i < 20; i++) {
        const isType1 = Math.random() > 0.5;
        const cell = new THREE.Mesh(cellGeom, isType1 ? cellMat1 : cellMat2);
        cell.name = `cell_${i}`;
        cellsGroup.add(cell);

        const delay = i * 0.3;
        const t0 = 0, t1 = delay, t2 = delay + 2, t3 = delay + 3, t4 = delay + 5;
        const times = [t0, t1, t2, t3, t4];

        let targetZ = isType1 ? 3 : -3;
        
        const values = [
            -7, 0, 0, // Start hidden/far
            -7, 0, 0,
            0, 0, 0,  // Interrogated by laser
            3, 0, 0,  // Reaching junction
            7, 0, targetZ // Sorted into respective channel
        ];

        tracks.push(new THREE.VectorKeyframeTrack(`cells/${cell.name}.position`, times, values));
    }

    const clip = new THREE.AnimationClip('Cell_Sorting', duration + 20 * 0.3, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
