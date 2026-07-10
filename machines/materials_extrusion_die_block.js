import { materials } from '../utils/materials.js';

export function createExtrusionDieBlock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.7, roughness: 0.3 });
    const polymerMat = materials.polymer || new THREE.MeshStandardMaterial({ color: 0x0088ff, roughness: 0.2 });

    const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const barrel = new THREE.Mesh(barrelGeo, metalMat);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(-1.5, 0, 0);
    group.add(barrel);

    const dieBlockGeo = new THREE.BoxGeometry(1, 1.5, 1.5);
    const dieBlock = new THREE.Mesh(dieBlockGeo, metalMat);
    dieBlock.position.set(0.5, 0, 0);
    group.add(dieBlock);

    // Extrudate (Output)
    const extrudateGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
    const extrudate = new THREE.Mesh(extrudateGeo, polymerMat);
    extrudate.rotation.z = Math.PI / 2;
    extrudate.position.set(2, 0, 0);
    group.add(extrudate);

    // Animation: Extrudate flowing (scaling up/moving)
    const extrudateScaleTrack = extrudate.uuid + '.scale';
    const times = [0, 2, 2.1];
    const values = [
        0.1, 1, 1,
        1, 1, 1,
        0.1, 1, 1
    ];
    const scaleKF = new THREE.VectorKeyframeTrack(extrudateScaleTrack, times, values);
    
    const extrudatePosTrack = extrudate.uuid + '.position';
    const posValues = [
        1.1, 0, 0,
        2, 0, 0,
        1.1, 0, 0
    ];
    const posKF = new THREE.VectorKeyframeTrack(extrudatePosTrack, times, posValues);

    const clip = new THREE.AnimationClip('Extrude', 2.1, [scaleKF, posKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
