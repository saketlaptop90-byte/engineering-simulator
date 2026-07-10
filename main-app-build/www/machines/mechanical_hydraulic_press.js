import { blueAccent, castIron, chrome, darkSteel, yellowAccent } from '../utils/materials.js';

export function createHydraulicPress(THREE) {
    const group = new THREE.Group();
    group.name = "HydraulicPress";

    const baseGeo = new THREE.BoxGeometry(6, 1, 4);
    const base = new THREE.Mesh(baseGeo, castIron);
    base.position.y = 0.5;
    group.add(base);

    const leftPillarGeo = new THREE.BoxGeometry(1, 8, 2);
    const leftPillar = new THREE.Mesh(leftPillarGeo, blueAccent);
    leftPillar.position.set(-2.5, 5, 0);
    group.add(leftPillar);

    const rightPillarGeo = new THREE.BoxGeometry(1, 8, 2);
    const rightPillar = new THREE.Mesh(rightPillarGeo, blueAccent);
    rightPillar.position.set(2.5, 5, 0);
    group.add(rightPillar);

    const topBeamGeo = new THREE.BoxGeometry(6, 1.5, 2.5);
    const topBeam = new THREE.Mesh(topBeamGeo, castIron);
    topBeam.position.set(0, 9.75, 0);
    group.add(topBeam);

    const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const cylinder = new THREE.Mesh(cylGeo, darkSteel);
    cylinder.position.set(0, 8.5, 0);
    group.add(cylinder);
    
    const lineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.2, 8.5, 0),
            new THREE.Vector3(-2.5, 9, 0),
            new THREE.Vector3(-3.2, 5, 0),
            new THREE.Vector3(-2.5, 1, 0)
        ]), 
        20, 0.1, 8, false
    );
    const line = new THREE.Mesh(lineGeo, yellowAccent);
    group.add(line);

    const ramGroup = new THREE.Group();
    ramGroup.name = "RamGroup";
    ramGroup.position.set(0, 7.5, 0);
    group.add(ramGroup);

    const pistonGeo = new THREE.CylinderGeometry(0.6, 0.6, 4, 32);
    const piston = new THREE.Mesh(pistonGeo, chrome);
    piston.position.y = -0.5;
    ramGroup.add(piston);

    const pressPlateGeo = new THREE.BoxGeometry(3, 0.8, 2);
    const pressPlate = new THREE.Mesh(pressPlateGeo, castIron);
    pressPlate.position.y = -2.9;
    ramGroup.add(pressPlate);
    
    const wpGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const workpiece = new THREE.Mesh(wpGeo, chrome);
    workpiece.name = "Workpiece";
    workpiece.position.set(0, 1.5, 0);
    group.add(workpiece);

    const times = [0, 1.5, 2.5, 4.0, 5.0];
    
    const ramYStart = 7.5;
    const ramYDown = 4.7;
    const ramPos = [
        0, ramYStart, 0,
        0, ramYDown, 0,
        0, ramYDown, 0,
        0, ramYStart, 0,
        0, ramYStart, 0
    ];
    
    const wpScale = [
        1, 1, 1,
        1.3, 0.4, 1.3,
        1.3, 0.4, 1.3,
        1.3, 0.4, 1.3,
        1, 1, 1
    ];

    const ramTrack = new THREE.VectorKeyframeTrack('RamGroup.position', times, ramPos);
    const wpTrack = new THREE.VectorKeyframeTrack('Workpiece.scale', times, wpScale);
    
    const wpPos = [
        0, 1.5, 0,
        0, 1.2, 0,
        0, 1.2, 0,
        0, 1.2, 0,
        0, 1.5, 0
    ];
    const wpPosTrack = new THREE.VectorKeyframeTrack('Workpiece.position', times, wpPos);

    const clip = new THREE.AnimationClip('PressCycle', 5.0, [ramTrack, wpTrack, wpPosTrack]);

    return { group, animationClips: [clip] };
}
