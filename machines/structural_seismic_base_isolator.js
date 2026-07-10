import * as materials from '../utils/materials.js';

export function createSeismicBaseIsolator(THREE) {
    const group = new THREE.Group();
    group.name = "SeismicBaseIsolator";

    const concreteMat = materials.concrete || new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 });
    const rubberMat = materials.rubber || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const steelMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });

    // Ground Foundation
    const ground = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 8), concreteMat);
    ground.position.y = 0.25;
    
    // Ground Shake Group
    const groundGroup = new THREE.Group();
    groundGroup.add(ground);
    group.add(groundGroup);

    // Isolators
    const isolatorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 32);
    const isolators = [];
    const positions = [
        [-2.5, 0.8, -2.5], [2.5, 0.8, -2.5],
        [-2.5, 0.8, 2.5], [2.5, 0.8, 2.5]
    ];
    
    positions.forEach(pos => {
        const isolator = new THREE.Group();
        isolator.position.set(pos[0], pos[1], pos[2]);
        
        const bottomPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32), steelMat);
        bottomPlate.position.y = -0.3;
        const rubberCore = new THREE.Mesh(isolatorGeo, rubberMat);
        const topPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32), steelMat);
        topPlate.position.y = 0.3;
        
        isolator.add(bottomPlate, rubberCore, topPlate);
        groundGroup.add(isolator); // Attached to ground
        isolators.push({ rubberCore, topPlate });
    });

    // Superstructure (Building base)
    const buildingGroup = new THREE.Group();
    const buildingBase = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 7), concreteMat);
    buildingBase.position.y = 1.35;
    buildingGroup.add(buildingBase);
    
    // Columns
    const colGeo = new THREE.BoxGeometry(0.5, 3, 0.5);
    positions.forEach(pos => {
        const col = new THREE.Mesh(colGeo, steelMat);
        col.position.set(pos[0], 3.1, pos[2]);
        buildingGroup.add(col);
    });
    group.add(buildingGroup);

    // Animation: Ground shakes vigorously, building stays relatively stable
    const times = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
    const groundShake = [
        0, 0, 0,
        0.5, 0, 0,
        -0.5, 0, 0,
        0.4, 0, 0,
        -0.4, 0, 0,
        0.2, 0, 0,
        -0.2, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];
    
    const bldgShake = [
        0, 0, 0,
        0.1, 0, 0,
        -0.1, 0, 0,
        0.08, 0, 0,
        -0.08, 0, 0,
        0.04, 0, 0,
        -0.04, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];

    const tracks = [];
    tracks.push(new THREE.VectorKeyframeTrack(groundGroup.uuid + '.position', times, groundShake));
    tracks.push(new THREE.VectorKeyframeTrack(buildingGroup.uuid + '.position', times, bldgShake));

    const clip = new THREE.AnimationClip('Earthquake', 4, tracks);

    return { group, animationClips: [clip] };
}
