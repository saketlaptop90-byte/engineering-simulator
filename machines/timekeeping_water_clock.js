import { wood, brass, glass, gold } from '../utils/materials.js';

export function createWaterClock(THREE) {
    const group = new THREE.Group();
    group.name = 'WaterClock';

    // Base
    const baseGeo = new THREE.CylinderGeometry(2, 2.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 0.25;
    group.add(base);

    // Upper reservoir
    const upperGeo = new THREE.CylinderGeometry(1.5, 1, 2, 32);
    const upperRes = new THREE.Mesh(upperGeo, glass);
    upperRes.position.y = 3.5;
    group.add(upperRes);

    const upperBrass = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.05, 2.1, 32), brass);
    upperBrass.position.y = 3.5;
    upperBrass.material = upperBrass.material.clone();
    upperBrass.material.wireframe = true; // Decorative cage
    group.add(upperBrass);

    // Lower reservoir
    const lowerGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
    const lowerRes = new THREE.Mesh(lowerGeo, glass);
    lowerRes.position.y = 1.5;
    group.add(lowerRes);

    // Water level in lower reservoir
    const waterLevelGeo = new THREE.CylinderGeometry(1.15, 1.15, 2, 32);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8 });
    const waterLevel = new THREE.Mesh(waterLevelGeo, waterMat);
    waterLevel.position.y = 0.5; // Starts low
    waterLevel.scale.y = 0.1;
    group.add(waterLevel);

    // Water droplet
    const dropGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const drop = new THREE.Mesh(dropGeo, waterMat);
    drop.name = 'WaterDrop';
    group.add(drop);

    // Animation: Droplet falling
    const dropTrack = new THREE.VectorKeyframeTrack(
        'WaterDrop.position', 
        [0, 0.8, 1], 
        [0, 2.5, 0,  0, 1.5, 0,  0, 1.5, 0]
    );
    const scaleTrack = new THREE.VectorKeyframeTrack(
        'WaterDrop.scale', 
        [0, 0.8, 0.9, 1], 
        [1,1,1, 1,1,1, 0,0,0, 0,0,0]
    );

    const clip = new THREE.AnimationClip('WaterDrip', 1, [dropTrack, scaleTrack]);

    return { group, animationClips: [clip] };
}
