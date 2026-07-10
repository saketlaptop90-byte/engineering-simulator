import { steel, aluminum, blackPlastic, rubber } from '../utils/materials.js';

export function createFDM3DPrinter(THREE) {
    const group = new THREE.Group();
    group.name = "FDM3DPrinter";
    const animationClips = [];

    // Frame
    const frameGeo = new THREE.BoxGeometry(4, 4, 0.2);
    const leftFrame = new THREE.Mesh(frameGeo, blackPlastic);
    leftFrame.position.set(-2, 2, 0);
    leftFrame.rotation.y = Math.PI / 2;
    group.add(leftFrame);

    const rightFrame = new THREE.Mesh(frameGeo, blackPlastic);
    rightFrame.position.set(2, 2, 0);
    rightFrame.rotation.y = Math.PI / 2;
    group.add(rightFrame);

    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 0.2), blackPlastic);
    topFrame.position.set(0, 4, 0);
    group.add(topFrame);

    // Z-axis Rods
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const leftRod = new THREE.Mesh(rodGeo, steel);
    leftRod.position.set(-1.8, 2, 0);
    group.add(leftRod);

    const rightRod = new THREE.Mesh(rodGeo, steel);
    rightRod.position.set(1.8, 2, 0);
    group.add(rightRod);

    // Build Plate (Y-axis bed)
    const bedGroup = new THREE.Group();
    bedGroup.name = "bedGroup";
    bedGroup.position.set(0, 0.5, 0);
    group.add(bedGroup);

    const bedGeo = new THREE.BoxGeometry(3, 0.1, 3);
    const bed = new THREE.Mesh(bedGeo, aluminum);
    bedGroup.add(bed);

    // X-axis Carriage
    const xCarriageGroup = new THREE.Group();
    xCarriageGroup.name = "xCarriageGroup";
    xCarriageGroup.position.set(0, 0.6, 0);
    group.add(xCarriageGroup);

    const xRodGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.6);
    const xRod = new THREE.Mesh(xRodGeo, steel);
    xRod.rotation.z = Math.PI / 2;
    xCarriageGroup.add(xRod);

    // Extruder Head
    const extruderGroup = new THREE.Group();
    extruderGroup.name = "extruderGroup";
    xCarriageGroup.add(extruderGroup);

    const extruderGeo = new THREE.BoxGeometry(0.4, 0.5, 0.4);
    const extruder = new THREE.Mesh(extruderGeo, blackPlastic);
    extruderGroup.add(extruder);

    const nozzleGeo = new THREE.CylinderGeometry(0.02, 0.1, 0.2);
    const nozzle = new THREE.Mesh(nozzleGeo, steel);
    nozzle.position.set(0, -0.3, 0);
    extruderGroup.add(nozzle);

    // Animations
    const trackX = new THREE.VectorKeyframeTrack('extruderGroup.position', 
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4], 
        [
            -1.5, 0, 0,  
            1.5, 0, 0,  
            1.5, 0, 0,  
            -1.5, 0, 0, 
            -1.5, 0, 0,
            1.5, 0, 0,
            1.5, 0, 0,
            -1.5, 0, 0,
            -1.5, 0, 0
        ]);

    const trackBedZ = new THREE.VectorKeyframeTrack('bedGroup.position',
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
        [
            0, 0.5, -1,
            0, 0.5, -1,
            0, 0.5, 0,
            0, 0.5, 0,
            0, 0.5, 1,
            0, 0.5, 1,
            0, 0.5, 0,
            0, 0.5, 0,
            0, 0.5, -1
        ]);

    const trackCarriageY = new THREE.VectorKeyframeTrack('xCarriageGroup.position',
        [0, 4],
        [0, 0.6, 0, 0, 3.8, 0]
    );

    const clip = new THREE.AnimationClip('PrintAction', 4, [trackX, trackBedZ, trackCarriageY]);
    animationClips.push(clip);

    return { group, animationClips };
}
