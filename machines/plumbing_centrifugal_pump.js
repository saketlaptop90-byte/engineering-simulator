import { copper, brass, iron, steel, rubber } from '../utils/materials.js';

export function createCentrifugalPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Housing (cutaway) - iron
    const housingGeo = new THREE.CylinderGeometry(3, 3, 2, 32, 1, false, 0, Math.PI * 1.25);
    const housing = new THREE.Mesh(housingGeo, iron);
    housing.rotation.x = Math.PI / 2;
    group.add(housing);

    // Inlet and outlet pipes
    const inletGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const inlet = new THREE.Mesh(inletGeo, iron);
    inlet.position.z = 2;
    inlet.rotation.x = Math.PI / 2;
    group.add(inlet);

    const outletGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const outlet = new THREE.Mesh(outletGeo, iron);
    outlet.position.set(0, 3, 0);
    group.add(outlet);

    // Impeller
    const impellerGroup = new THREE.Group();
    impellerGroup.name = 'Impeller';
    
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.position.z = -1;
    shaft.rotation.x = Math.PI / 2;
    impellerGroup.add(shaft);

    const backPlateGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.2, 32);
    const backPlate = new THREE.Mesh(backPlateGeo, brass);
    backPlate.position.z = -0.8;
    backPlate.rotation.x = Math.PI / 2;
    impellerGroup.add(backPlate);

    for (let i = 0; i < 6; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 2.5, 0.8);
        const blade = new THREE.Mesh(bladeGeo, brass);
        blade.position.x = Math.cos((i * Math.PI) / 3) * 1.2;
        blade.position.y = Math.sin((i * Math.PI) / 3) * 1.2;
        blade.position.z = -0.4;
        blade.rotation.z = (i * Math.PI) / 3;
        impellerGroup.add(blade);
    }
    group.add(impellerGroup);

    // Animation: Impeller spinning
    const times = [0, 1];
    const values = [0, Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack('Impeller.rotation[z]', times, values);
    const clip = new THREE.AnimationClip('Spin', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
