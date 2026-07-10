import { materials } from '../utils/materials.js';

export function createGlassLaminationPress(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bottom Press Plate
    const plateGeom = new THREE.BoxGeometry(6, 0.5, 4);
    const plateMat = materials.metal ? materials.metal : new THREE.MeshStandardMaterial({ color: 0x666666 });
    const bottomPlate = new THREE.Mesh(plateGeom, plateMat);
    bottomPlate.position.y = 0.25;
    group.add(bottomPlate);

    // Top Press Plate (Movable)
    const topPlateGroup = new THREE.Group();
    topPlateGroup.position.y = 3;
    const topPlate = new THREE.Mesh(plateGeom, plateMat);
    topPlateGroup.add(topPlate);
    group.add(topPlateGroup);

    // Support Columns
    for (let x of [-2.8, 2.8]) {
        for (let z of [-1.8, 1.8]) {
            const columnGeom = new THREE.CylinderGeometry(0.15, 0.15, 4);
            const columnMat = materials.darkMetal ? materials.darkMetal : new THREE.MeshStandardMaterial({ color: 0x333333 });
            const column = new THREE.Mesh(columnGeom, columnMat);
            column.position.set(x, 2, z);
            group.add(column);
        }
    }

    // Glass Stack (Two panes with PVB layer)
    const glassStack = new THREE.Group();
    glassStack.position.y = 0.6;

    const paneGeom = new THREE.BoxGeometry(5, 0.05, 3);
    const glassMat = materials.glass ? materials.glass : new THREE.MeshPhysicalMaterial({ transmission: 0.9 });
    
    const pane1 = new THREE.Mesh(paneGeom, glassMat);
    pane1.position.y = 0;
    glassStack.add(pane1);

    const pvbGeom = new THREE.BoxGeometry(5, 0.02, 3);
    const pvbMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const pvb = new THREE.Mesh(pvbGeom, pvbMat);
    pvb.position.y = 0.035;
    glassStack.add(pvb);

    const pane2 = new THREE.Mesh(paneGeom, glassMat);
    pane2.position.y = 0.07;
    glassStack.add(pane2);

    group.add(glassStack);

    // Animation: Press moving down and up
    const times = [0, 2, 4, 6];
    const topPlatePositions = [
        0, 3, 0,
        0, 1.2, 0, // Pressed
        0, 1.2, 0, // Hold
        0, 3, 0    // Release
    ];

    const pressTrack = new THREE.VectorKeyframeTrack(`${topPlateGroup.uuid}.position`, times, topPlatePositions);
    
    // Change PVB opacity to simulate melting/clarifying
    const pvbTimes = [0, 2, 4, 6];
    const pvbOpacity = [0.5, 0.5, 0.1, 0.1];
    const pvbTrack = new THREE.NumberKeyframeTrack(`${pvb.uuid}.material.opacity`, pvbTimes, pvbOpacity);

    const clip = new THREE.AnimationClip('Lamination', 6, [pressTrack, pvbTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
