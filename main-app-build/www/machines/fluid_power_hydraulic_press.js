import { steel, castIron, redAccent, blueAccent, tinted, glass } from '../utils/materials.js';

export function createHydraulicPress(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const fluidMat = tinted(glass, 0xaa2222); // red hydraulic fluid

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, castIron);
    base.position.y = 0.25;
    group.add(base);

    // Frame pillars
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const p1 = new THREE.Mesh(pillarGeo, steel); p1.position.set(-1.5, 3, 0); group.add(p1);
    const p2 = new THREE.Mesh(pillarGeo, steel); p2.position.set(1.5, 3, 0); group.add(p2);

    // Top beam
    const topGeo = new THREE.BoxGeometry(4, 0.5, 1);
    const top = new THREE.Mesh(topGeo, castIron);
    top.position.y = 5.5;
    group.add(top);

    // Hydraulic Cylinder
    const cylGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 32);
    const cylinder = new THREE.Mesh(cylGeo, blueAccent);
    cylinder.position.y = 4.25;
    group.add(cylinder);

    // Fluid inside cylinder
    const fluidGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.8, 32);
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    fluid.position.y = 4.25;
    group.add(fluid);

    // Piston Rod
    const rodGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16);
    const rod = new THREE.Mesh(rodGeo, steel);
    rod.position.y = 3;
    
    // Press Plate
    const plateGeo = new THREE.BoxGeometry(2, 0.3, 1.5);
    const plate = new THREE.Mesh(plateGeo, steel);
    plate.position.y = -1.25; // relative to rod
    rod.add(plate);
    group.add(rod);

    // Object being crushed
    const objGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const crushObj = new THREE.Mesh(objGeo, redAccent);
    crushObj.position.y = 0.9;
    group.add(crushObj);

    // Animations
    // Rod moving down and up
    const rodTrack = new THREE.VectorKeyframeTrack(
        rod.uuid + '.position',
        [0, 2, 4, 6],
        [
            0, 3, 0,
            0, 1.5, 0,
            0, 1.5, 0,
            0, 3, 0
        ]
    );

    // Fluid level changing inside the cylinder
    const fluidScaleTrack = new THREE.VectorKeyframeTrack(
        fluid.uuid + '.scale',
        [0, 2, 4, 6],
        [
            1, 0.1, 1,
            1, 1, 1,
            1, 1, 1,
            1, 0.1, 1
        ]
    );
    
    const fluidPosTrack = new THREE.VectorKeyframeTrack(
        fluid.uuid + '.position',
        [0, 2, 4, 6],
        [
            0, 5.0, 0,
            0, 4.25, 0,
            0, 4.25, 0,
            0, 5.0, 0
        ]
    );

    // Object squishing
    const crushTrack = new THREE.VectorKeyframeTrack(
        crushObj.uuid + '.scale',
        [0, 1.5, 2, 4, 4.5, 6],
        [
            1, 1, 1,
            1, 1, 1,
            1.2, 0.2, 1.2,
            1.2, 0.2, 1.2,
            1, 1, 1,
            1, 1, 1
        ]
    );

    const crushPosTrack = new THREE.VectorKeyframeTrack(
        crushObj.uuid + '.position',
        [0, 1.5, 2, 4, 4.5, 6],
        [
            0, 0.9, 0,
            0, 0.9, 0,
            0, 0.58, 0,
            0, 0.58, 0,
            0, 0.9, 0,
            0, 0.9, 0
        ]
    );

    const clip = new THREE.AnimationClip('PressCycle', 6, [rodTrack, fluidScaleTrack, fluidPosTrack, crushTrack, crushPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
