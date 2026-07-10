import { darkSteel, titanium, gold } from '../utils/materials.js';

export function createUltrasonicCellDisruptor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const body = new THREE.Mesh(bodyGeo, darkSteel);
    body.position.y = 3;
    group.add(body);

    // Horn / Probe
    const hornGeo = new THREE.CylinderGeometry(0.3, 0.05, 2, 16);
    const horn = new THREE.Mesh(hornGeo, titanium);
    horn.name = 'horn';
    horn.position.y = 1.0;
    group.add(horn);

    // Sample Vial
    const vialGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const vial = new THREE.Mesh(vialGeo, glassMat);
    vial.position.y = 0.5;
    group.add(vial);

    // Cells
    const cellsGroup = new THREE.Group();
    vial.add(cellsGroup);
    const cellGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const cellMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const cells = [];
    for(let i=0; i<15; i++) {
        const cell = new THREE.Mesh(cellGeo, cellMat);
        cell.name = `cell_${i}`;
        cell.position.set(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.5
        );
        cellsGroup.add(cell);
        cells.push({ mesh: cell, orig: cell.position.clone() });
    }

    const tracks = [];
    
    // Horn vibrating
    const hornTimes = [];
    const hornY = [];
    for(let i=0; i<=20; i++) {
        hornTimes.push(i * 0.05);
        hornY.push(1.0 + (i % 2 === 0 ? 0.02 : -0.02));
    }
    tracks.push(new THREE.VectorKeyframeTrack(`horn.position`, hornTimes, hornY.flatMap(y => [0, y, 0])));

    // Cells jittering
    cells.forEach((c) => {
        const cTimes = [];
        const cPos = [];
        for(let i=0; i<=20; i++) {
            cTimes.push(i * 0.05);
            cPos.push(
                c.orig.x + (Math.random()-0.5)*0.1,
                c.orig.y + (Math.random()-0.5)*0.1,
                c.orig.z + (Math.random()-0.5)*0.1
            );
        }
        tracks.push(new THREE.VectorKeyframeTrack(`${c.mesh.name}.position`, cTimes, cPos));
    });

    animationClips.push(new THREE.AnimationClip('DisruptorAction', 1, tracks));

    return { group, animationClips };
}
