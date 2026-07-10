import { getMaterials } from '../utils/materials.js';

export function createBlisterPackagingMachine(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Base frame
    const baseGeo = new THREE.BoxGeometry(10, 1, 4);
    const base = new THREE.Mesh(baseGeo, materials.steel);
    base.position.y = 0.5;
    group.add(base);

    // Roll holder
    const rollHolderGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    rollHolderGeo.rotateX(Math.PI / 2);
    const rollHolder = new THREE.Mesh(rollHolderGeo, materials.aluminum);
    rollHolder.position.set(-4, 2, 0);
    group.add(rollHolder);

    // Plastic sheet
    const sheetGeo = new THREE.PlaneGeometry(8, 3.8);
    sheetGeo.rotateX(-Math.PI / 2);
    const sheet = new THREE.Mesh(sheetGeo, materials.plastic);
    sheet.position.set(0, 1.5, 0);
    group.add(sheet);

    // Forming station (moves down)
    const formingStationGeo = new THREE.BoxGeometry(2, 1, 4);
    const formingStation = new THREE.Mesh(formingStationGeo, materials.brass);
    formingStation.position.set(-2, 2.5, 0);
    formingStation.name = 'formingStation';
    group.add(formingStation);

    // Sealing station (moves down)
    const sealingStationGeo = new THREE.BoxGeometry(2, 1, 4);
    const sealingStation = new THREE.Mesh(sealingStationGeo, materials.copper);
    sealingStation.position.set(2, 2.5, 0);
    sealingStation.name = 'sealingStation';
    group.add(sealingStation);

    // Animations
    const formingTimes = [0, 1, 2];
    const formingValues = [-2, 2.5, 0,  -2, 1.6, 0,  -2, 2.5, 0];
    const formingTrack = new THREE.VectorKeyframeTrack('formingStation.position', formingTimes, formingValues);

    const sealingTimes = [0, 1.5, 3];
    const sealingValues = [2, 2.5, 0,  2, 1.6, 0,  2, 2.5, 0];
    const sealingTrack = new THREE.VectorKeyframeTrack('sealingStation.position', sealingTimes, sealingValues);

    const blisterClip = new THREE.AnimationClip('BlisterAction', 3, [formingTrack, sealingTrack]);
    animationClips.push(blisterClip);

    return { group, animationClips };
}
