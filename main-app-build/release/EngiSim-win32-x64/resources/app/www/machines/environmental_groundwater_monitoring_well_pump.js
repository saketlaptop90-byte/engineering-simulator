import * as mats from '../utils/materials.js';

export function createGroundwaterMonitoringWellPump(THREE) {
    const materials = mats.materials || mats;
    const group = new THREE.Group();
    const animationClips = [];

    const matSoil = materials.soil || new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const matAquifer = materials.aquifer || new THREE.MeshStandardMaterial({ color: 0x334455, transparent: true, opacity: 0.8 });
    const matPVC = materials.pvc || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9 });
    const matWater = materials.water || new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.7 });

    // Ground Section (Cross-section)
    const soilGeo = new THREE.BoxGeometry(6, 8, 4);
    const soil = new THREE.Mesh(soilGeo, matSoil);
    soil.position.y = -4;
    group.add(soil);

    const aquiferGeo = new THREE.BoxGeometry(6, 4, 4.1);
    const aquifer = new THREE.Mesh(aquiferGeo, matAquifer);
    aquifer.position.y = -10;
    group.add(aquifer);

    // Well Casing
    const casingGeo = new THREE.CylinderGeometry(0.4, 0.4, 13, 16);
    const casing = new THREE.Mesh(casingGeo, matPVC);
    casing.position.y = -5.5;
    group.add(casing);

    // Submersible Pump
    const pumpGroup = new THREE.Group();
    pumpGroup.name = "PumpGroup";
    const pumpGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const pump = new THREE.Mesh(pumpGeo, matMetal);
    pump.position.y = -11;
    pumpGroup.add(pump);
    group.add(pumpGroup);

    // Riser Pipe
    const riserGeo = new THREE.CylinderGeometry(0.1, 0.1, 12, 8);
    const riser = new THREE.Mesh(riserGeo, matPVC);
    riser.position.y = -5;
    group.add(riser);

    // Surface Control Box
    const boxGeo = new THREE.BoxGeometry(1, 1.5, 0.8);
    const box = new THREE.Mesh(boxGeo, matMetal);
    box.position.set(1.5, 0.75, 0);
    group.add(box);

    // Water flowing inside pipe
    const flowGroup = new THREE.Group();
    flowGroup.name = "WaterFlowGroup";
    const flowGeo = new THREE.CylinderGeometry(0.08, 0.08, 2, 8);
    for(let i=0; i<6; i++) {
        const f = new THREE.Mesh(flowGeo, matWater);
        f.position.y = -10 + i * 2;
        flowGroup.add(f);
    }
    group.add(flowGroup);

    // Animations: Pump vibration and water flow up
    const vibrationTrack = new THREE.VectorKeyframeTrack(`PumpGroup.position`, [0, 0.1, 0.2, 0.3], [
        0, 0, 0,
        0.02, 0, 0,
        -0.02, 0, 0,
        0, 0, 0
    ]);
    const flowTrack = new THREE.VectorKeyframeTrack(`WaterFlowGroup.position`, [0, 1], [
        0, 0, 0,
        0, 2, 0
    ]);
    const clip1 = new THREE.AnimationClip('PumpVibrate', 0.3, [vibrationTrack]);
    const clip2 = new THREE.AnimationClip('WaterFlowUp', 1, [flowTrack]);

    animationClips.push(clip1, clip2);

    return { group, animationClips };
}
