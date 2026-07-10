import * as sharedMaterials from '../utils/materials.js';

export function createDissolvedAirFlotationUnit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const steel = sharedMaterials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x778899, roughness: 0.3 });
    const water = sharedMaterials.waterMaterial || new THREE.MeshPhysicalMaterial({ color: 0x22aa99, transmission: 0.9, opacity: 0.8, transparent: true });
    const sludge = new THREE.MeshStandardMaterial({ color: 0x553311, roughness: 0.9 });

    const tank = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 2, 32, 1, true), steel);
    tank.position.y = 1.0;
    tank.material.side = THREE.DoubleSide;
    group.add(tank);

    const floor = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.1, 32), steel);
    floor.position.y = 0.05;
    group.add(floor);

    const waterVol = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 1.7, 32), water);
    waterVol.position.y = 0.95;
    group.add(waterVol);

    const sludgeLayer = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 0.1, 32), sludge);
    sludgeLayer.position.y = 1.85;
    group.add(sludgeLayer);

    const skimmer = new THREE.Group();
    skimmer.position.set(0, 1.9, 0);
    skimmer.name = 'DAF_Skimmer';
    
    const centerDrive = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5), steel);
    skimmer.add(centerDrive);

    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.2, 0.05), steel);
    arm1.position.x = 0;
    skimmer.add(arm1);

    const blade1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 0.05), new THREE.MeshStandardMaterial({color: 0x222222}));
    blade1.position.set(1.5, -0.15, 0.05);
    skimmer.add(blade1);

    const blade2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 0.05), new THREE.MeshStandardMaterial({color: 0x222222}));
    blade2.position.set(-1.5, -0.15, -0.05);
    skimmer.add(blade2);

    group.add(skimmer);

    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI*2, 0));
    
    const rotTrack = new THREE.QuaternionKeyframeTrack('DAF_Skimmer.quaternion', [0, 5, 10], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    animationClips.push(new THREE.AnimationClip('DAF_Skimmer_Rotation', 10.0, [rotTrack]));

    return { group, animationClips };
}
