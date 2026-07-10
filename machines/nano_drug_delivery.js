import * as CustomMaterials from '../utils/materials.js';

export function createDrugDeliveryVehicle(THREE) {
    const group = new THREE.Group();
    group.name = "DrugDeliveryVehicle";
    const animationClips = [];

    const shellMat = new THREE.MeshPhysicalMaterial({ color: 0x4488ff, transmission: 0.6, transparent: true, roughness: 0.2 });
    const payloadMat = CustomMaterials.goldMaterial || new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.5, roughness: 0.4 });

    // Outer Shell
    const shellGeo = new THREE.SphereGeometry(2, 32, 32);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.name = "shell";
    group.add(shell);

    // Internal Drugs
    const drugs = new THREE.Group();
    drugs.name = "drugs";
    for(let i=0; i<10; i++) {
        const drugGeo = new THREE.CapsuleGeometry(0.2, 0.4, 8, 16);
        const drug = new THREE.Mesh(drugGeo, payloadMat);
        drug.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2);
        drugs.add(drug);
    }
    group.add(drugs);

    // Animation: Shell Opening / Drugs Releasing
    const times = [0, 2, 4];
    const scaleValues = [
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1
    ];
    const shellTrack = new THREE.VectorKeyframeTrack(`${shell.name}.scale`, times, scaleValues);
    const clip = new THREE.AnimationClip('Release_Drugs', 4, [shellTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
