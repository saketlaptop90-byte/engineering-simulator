import * as matModule from '../utils/materials.js';

export function createBioprinter(THREE) {
    const materials = matModule.materials || matModule.default || matModule;
    const group = new THREE.Group();
    const animationClips = [];

    const frameMat = (materials && materials.aluminum) || new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.6, roughness: 0.4 });
    const bedMat = (materials && materials.glass) || new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 });
    const nozzleMat = (materials && materials.brass) || new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.2 });
    const hydrogelMat = (materials && materials.hydrogel) || new THREE.MeshStandardMaterial({ color: 0xff5555, transparent: true, opacity: 0.8 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), frameMat);
    base.position.set(0, -2, 0);
    group.add(base);

    const bed = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 3), bedMat);
    bed.position.set(0, -1.8, 0);
    group.add(bed);

    const gantryY = new THREE.Group();
    gantryY.name = 'gantryY';
    gantryY.position.set(0, 1, -1.5);
    const gantryYMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 0.2), frameMat);
    gantryY.add(gantryYMesh);
    group.add(gantryY);

    const gantryX = new THREE.Group();
    gantryX.name = 'gantryX';
    gantryX.position.set(-1.5, 0, 0);
    const gantryXMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.4), nozzleMat);
    gantryX.add(gantryXMesh);
    gantryY.add(gantryX);

    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 16), nozzleMat);
    nozzle.position.set(0, -0.35, 0);
    nozzle.rotation.x = Math.PI;
    gantryX.add(nozzle);

    const printObject = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.01, 32), hydrogelMat);
    printObject.position.set(0, -1.75, 0);
    printObject.name = 'printObject';
    group.add(printObject);

    const times = [0, 1, 2, 3, 4];
    const trackY = new THREE.VectorKeyframeTrack('gantryY.position', times, [
        0, 1, -1.5,
        0, 1, 0,
        0, 1, 1.5,
        0, 1, 0,
        0, 1, -1.5
    ]);
    const trackX = new THREE.VectorKeyframeTrack('gantryX.position', times, [
        -1.5, 0, 0,
        1.5, 0, 0,
        -1.5, 0, 0,
        1.5, 0, 0,
        -1.5, 0, 0
    ]);
    const trackObjScale = new THREE.VectorKeyframeTrack('printObject.scale', times, [
        1, 1, 1,
        1, 50, 1,
        1, 100, 1,
        1, 150, 1,
        1, 200, 1
    ]);
    const trackObjPos = new THREE.VectorKeyframeTrack('printObject.position', times, [
        0, -1.75, 0,
        0, -1.75 + 0.245, 0,
        0, -1.75 + 0.495, 0,
        0, -1.75 + 0.745, 0,
        0, -1.75 + 0.995, 0
    ]);

    const clip = new THREE.AnimationClip('Bioprinting', 4, [trackY, trackX, trackObjScale, trackObjPos]);
    animationClips.push(clip);

    return { group, animationClips };
}
