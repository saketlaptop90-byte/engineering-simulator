import * as materials from '../utils/materials.js';

export function createCellSorterFlowCytometer(THREE) {
    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const plastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 });
    const glass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const glowingRed = materials.glowingRed || new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });

    const group = new THREE.Group();
    group.name = "CellSorterFlowCytometer";

    // Base Machine
    const baseGeo = new THREE.BoxGeometry(3, 3, 2.5);
    const base = new THREE.Mesh(baseGeo, plastic);
    base.position.y = 1.5;
    group.add(base);

    // Sample Loader
    const loaderGroup = new THREE.Group();
    loaderGroup.position.set(0, 0.5, 1.5);
    loaderGroup.name = "SampleLoader";

    const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
    const tube = new THREE.Mesh(tubeGeo, glass);
    tube.position.y = 0.4;
    loaderGroup.add(tube);

    group.add(loaderGroup);

    // Laser indicator
    const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 2);
    const laser = new THREE.Mesh(laserGeo, glowingRed);
    laser.rotation.z = Math.PI / 2;
    laser.position.set(0, 2, 0);
    laser.name = "LaserBeam";
    group.add(laser);

    // Animations: Loader moving in, laser scanning
    const times = [0, 1.5, 3, 4.5];
    
    const loaderValues = [
        0, 0.5, 1.5,
        0, 1.5, 1.5,
        0, 1.5, 0.5,
        0, 0.5, 1.5
    ];
    const loaderTrack = new THREE.VectorKeyframeTrack(loaderGroup.name + '.position', times, loaderValues);

    const laserScaleValues = [
        1, 1, 1,
        2, 1, 1,
        0.5, 1, 1,
        1, 1, 1
    ];
    const laserTrack = new THREE.VectorKeyframeTrack(laser.name + '.scale', times, laserScaleValues);

    const sortClip = new THREE.AnimationClip("SortCells", 4.5, [loaderTrack, laserTrack]);

    return { group, animationClips: [sortClip] };
}
