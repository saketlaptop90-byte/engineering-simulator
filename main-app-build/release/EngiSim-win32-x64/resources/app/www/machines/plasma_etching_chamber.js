import { materials } from '../utils/materials.js';

export function createPlasmaEtchingChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
    const ceramicMat = materials?.ceramic || new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.9 });
    const plasmaMat = materials?.plasma || new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const waferMat = materials?.wafer || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1.0, roughness: 0.1 });

    // Chamber base and top
    const chamberGeo = new THREE.CylinderGeometry(4, 4, 6, 32, 1, true);
    const chamber = new THREE.Mesh(chamberGeo, new THREE.MeshStandardMaterial({ color: 0x555555, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
    group.add(chamber);

    const electrodeGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const topElectrode = new THREE.Mesh(electrodeGeo, metalMat);
    topElectrode.position.y = 2.5;
    group.add(topElectrode);

    const bottomElectrode = new THREE.Mesh(electrodeGeo, metalMat);
    bottomElectrode.position.y = -2.5;
    group.add(bottomElectrode);

    // Silicon Wafer
    const waferGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32);
    const wafer = new THREE.Mesh(waferGeo, waferMat);
    wafer.position.y = -2.2;
    group.add(wafer);

    // Plasma Column
    const plasmaGeo = new THREE.CylinderGeometry(2.8, 2.8, 4.5, 32);
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.position.y = 0;
    plasma.name = "etchingPlasma";
    group.add(plasma);

    // Animations
    const etchClip = new THREE.AnimationClip('EtchProcess', 3, [
        new THREE.VectorKeyframeTrack('etchingPlasma.scale', [0, 1.5, 3], [1, 0, 1,  1, 1, 1,  1, 0, 1]),
        new THREE.VectorKeyframeTrack('etchingPlasma.position', [0, 1.5, 3], [0, 0, 0,  0, 0, 0,  0, 0, 0])
    ]);
    animationClips.push(etchClip);

    return { group, animationClips };
}
