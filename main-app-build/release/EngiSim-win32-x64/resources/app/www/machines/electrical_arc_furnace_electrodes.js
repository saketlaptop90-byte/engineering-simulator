import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createArcFurnace(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Furnace Body
    const bowlGeom = new THREE.CylinderGeometry(5, 4, 3, 32);
    const bowl = new THREE.Mesh(bowlGeom, darkSteel);
    bowl.position.y = -1.5;
    group.add(bowl);
    
    const rimGeom = new THREE.TorusGeometry(5, 0.3, 16, 32);
    const rim = new THREE.Mesh(rimGeom, brass);
    rim.position.y = 0;
    rim.rotation.x = Math.PI / 2;
    group.add(rim);

    // Electrodes Group
    const electrodesGroup = new THREE.Group();
    electrodesGroup.name = 'electrodesGroup';
    group.add(electrodesGroup);
    
    const electrodeGeom = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
    
    // 3-phase electrodes
    const e1 = new THREE.Mesh(electrodeGeom, darkSteel); // graphite ideally, using darkSteel
    e1.position.set(0, 4, -1.5);
    electrodesGroup.add(e1);
    
    const e2 = new THREE.Mesh(electrodeGeom, darkSteel);
    e2.position.set(-1.3, 4, 0.75);
    electrodesGroup.add(e2);
    
    const e3 = new THREE.Mesh(electrodeGeom, darkSteel);
    e3.position.set(1.3, 4, 0.75);
    electrodesGroup.add(e3);

    // Arcs (visualized as bright copper or brass cylinders that flicker)
    const arcGroup = new THREE.Group();
    arcGroup.name = 'arcGroup';
    group.add(arcGroup);
    
    const arcGeom = new THREE.SphereGeometry(1, 16, 16);
    const arc1 = new THREE.Mesh(arcGeom, brass);
    arc1.position.set(0, 0, -1.5);
    arcGroup.add(arc1);
    
    const arc2 = new THREE.Mesh(arcGeom, brass);
    arc2.position.set(-1.3, 0, 0.75);
    arcGroup.add(arc2);
    
    const arc3 = new THREE.Mesh(arcGeom, brass);
    arc3.position.set(1.3, 0, 0.75);
    arcGroup.add(arc3);

    // Animation: Electrodes lowering into furnace and arcs flickering (scaling)
    const times = [0, 1, 2, 3, 4];
    
    const electrodePosValues = [
        0, 2, 0,
        0, 0, 0,
        0, 0, 0,
        0, 2, 0,
        0, 2, 0
    ];
    const electrodeTrack = new THREE.VectorKeyframeTrack('electrodesGroup.position', times, electrodePosValues);
    
    // Arc scale values
    const arcScaleValues = [
        0, 0, 0,
        1, 1, 1,
        1.5, 1.5, 1.5,
        0, 0, 0,
        0, 0, 0
    ];
    const arcTrack = new THREE.VectorKeyframeTrack('arcGroup.scale', times, arcScaleValues);

    const clip = new THREE.AnimationClip('FurnaceOperation', 4, [electrodeTrack, arcTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
