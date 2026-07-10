import { getMaterial } from '../utils/materials.js';

export function createAFM(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Stage
    const stageGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const stageMat = getMaterial('metal_brushed', THREE) || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = 0.25;
    group.add(stage);

    // Cantilever holder
    const holderGeo = new THREE.BoxGeometry(1, 0.5, 3);
    const holderMat = getMaterial('metal_dark', THREE) || new THREE.MeshStandardMaterial({ color: 0x444444 });
    const holder = new THREE.Mesh(holderGeo, holderMat);
    holder.position.set(0, 2, -1);
    group.add(holder);

    // Cantilever
    const cantGeo = new THREE.BoxGeometry(0.1, 0.02, 1);
    const cantMat = getMaterial('gold', THREE) || new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const cantilever = new THREE.Mesh(cantGeo, cantMat);
    cantilever.position.set(0, 1.9, 0.5);
    cantilever.name = 'Cantilever';
    
    // Tip
    const tipGeo = new THREE.ConeGeometry(0.02, 0.1, 16);
    const tip = new THREE.Mesh(tipGeo, cantMat);
    tip.position.set(0, -0.05, 0.45);
    tip.rotation.x = Math.PI;
    cantilever.add(tip);
    
    group.add(cantilever);

    // Laser
    const laserGeo = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(0, 2.5, 0.5);
    laser.rotation.x = Math.PI / 4;
    group.add(laser);

    // Sample
    const sampleGeo = new THREE.BoxGeometry(1, 0.1, 1);
    const sampleMat = getMaterial('silicon', THREE) || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const sample = new THREE.Mesh(sampleGeo, sampleMat);
    sample.position.y = 0.55;
    group.add(sample);

    // Animation: Cantilever tapping mode
    const times = [0, 0.1, 0.2, 0.3, 0.4];
    const values = [
        0, 1.9, 0.5,
        0, 1.85, 0.5,
        0, 1.9, 0.5,
        0, 1.85, 0.5,
        0, 1.9, 0.5
    ];
    const cantTrack = new THREE.VectorKeyframeTrack(`${cantilever.name}.position`, times, values);
    const clip = new THREE.AnimationClip('TappingMode', 0.4, [cantTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
