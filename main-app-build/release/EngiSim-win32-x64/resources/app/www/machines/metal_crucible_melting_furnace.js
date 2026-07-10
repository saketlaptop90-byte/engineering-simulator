import * as materials from '../utils/materials.js';

export function createCrucibleMeltingFurnace(THREE) {
    const group = new THREE.Group();
    group.name = 'CrucibleMeltingFurnace';
    const animationClips = [];

    // Furnace Body
    const bodyGeo = new THREE.CylinderGeometry(2, 2, 3, 32);
    const bodyMat = materials.furnaceBrick || new THREE.MeshStandardMaterial({color: 0x8b4513, roughness: 0.9});
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.5;
    group.add(body);

    // Lid Pivot & Lid
    const lidGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.4, 32);
    const lid = new THREE.Mesh(lidGeo, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333}));
    
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 3, -2);
    lidPivot.name = 'LidPivot';
    
    lid.position.set(0, 0.2, 2);
    lidPivot.add(lid);
    group.add(lidPivot);

    // Molten Metal
    const metalGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 32);
    const metalMat = materials.moltenMetal || new THREE.MeshStandardMaterial({color: 0xff4500, emissive: 0xff2200, emissiveIntensity: 1});
    const moltenMetal = new THREE.Mesh(metalGeo, metalMat);
    moltenMetal.position.y = 2.5;
    moltenMetal.name = 'MoltenMetal';
    group.add(moltenMetal);

    // Animations
    const duration = 6;
    const times = [0, 1, 3, 4, 6];
    
    const lidRot = new THREE.NumberKeyframeTrack('LidPivot.rotation[x]', times, [0, -Math.PI/2, -Math.PI/2, 0, 0]);
    
    const bubbleTimes = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
    const bubbleValues = [2.5, 2.55, 2.5, 2.55, 2.5, 2.55, 2.5, 2.55, 2.5, 2.55, 2.5, 2.55, 2.5];
    const metalPos = new THREE.NumberKeyframeTrack('MoltenMetal.position[y]', bubbleTimes, bubbleValues);

    const clip = new THREE.AnimationClip('MeltCycle', duration, [lidRot, metalPos]);
    animationClips.push(clip);

    return { group, animationClips };
}
