import { materials } from '../utils/materials.js';

export function createMineShaftElevator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Shaft frame
    const frameGeo = new THREE.BoxGeometry(1, 60, 1);
    const f1 = new THREE.Mesh(frameGeo, materials.darkSteel);
    f1.position.set(-6, 30, -6);
    const f2 = new THREE.Mesh(frameGeo, materials.darkSteel);
    f2.position.set(6, 30, -6);
    const f3 = new THREE.Mesh(frameGeo, materials.darkSteel);
    f3.position.set(-6, 30, 6);
    const f4 = new THREE.Mesh(frameGeo, materials.darkSteel);
    f4.position.set(6, 30, 6);
    group.add(f1, f2, f3, f4);

    // Cross beams
    for(let i=0; i<6; i++) {
        const y = i * 10 + 5;
        const cb1 = new THREE.Mesh(new THREE.BoxGeometry(13, 0.5, 0.5), materials.darkSteel);
        cb1.position.set(0, y, -6);
        const cb2 = new THREE.Mesh(new THREE.BoxGeometry(13, 0.5, 0.5), materials.darkSteel);
        cb2.position.set(0, y, 6);
        const cb3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 13), materials.darkSteel);
        cb3.position.set(-6, y, 0);
        const cb4 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 13), materials.darkSteel);
        cb4.position.set(6, y, 0);
        group.add(cb1, cb2, cb3, cb4);
    }

    // Top Pulley House
    const houseGeo = new THREE.BoxGeometry(14, 8, 14);
    const house = new THREE.Mesh(houseGeo, materials.yellowAccent);
    house.position.set(0, 64, 0);
    group.add(house);

    // Elevator Cage
    const cageGroup = new THREE.Group();
    cageGroup.name = "ElevatorCage";
    cageGroup.position.set(0, 50, 0);

    const cageBaseGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const cageBase = new THREE.Mesh(cageBaseGeo, materials.iron);
    const cageTop = new THREE.Mesh(cageBaseGeo, materials.iron);
    cageTop.position.set(0, 8, 0);
    
    // Cage bars
    for(let x=-4.5; x<=4.5; x+=3) {
        for(let z=-4.5; z<=4.5; z+=3) {
            if(x === -4.5 || x === 4.5 || z === -4.5 || z === 4.5) {
                const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8), materials.darkSteel);
                bar.position.set(x, 4, z);
                cageGroup.add(bar);
            }
        }
    }

    cageGroup.add(cageBase);
    cageGroup.add(cageTop);
    group.add(cageGroup);

    // Cable
    const cableGroup = new THREE.Group();
    cableGroup.name = "ElevatorCable";
    const cableGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
    cableGeo.translate(0, -0.5, 0); // length 1 extending downwards
    const cable = new THREE.Mesh(cableGeo, materials.darkSteel);
    cableGroup.position.set(0, 60, 0); // attached to house
    cableGroup.add(cable);
    group.add(cableGroup);

    // Animation: Elevator descending and ascending
    const times = [0, 4, 6, 10, 12];
    const cageValues = [
        0, 50, 0,  // Top
        0, 2, 0,   // Bottom
        0, 2, 0,   // Wait
        0, 50, 0,  // Top
        0, 50, 0   // Wait
    ];
    const cageTrack = new THREE.VectorKeyframeTrack('ElevatorCage.position', times, cageValues);

    const cableScaleValues = [
        1, 2, 1,
        1, 50, 1,
        1, 50, 1,
        1, 2, 1,
        1, 2, 1
    ];
    const cableTrack = new THREE.VectorKeyframeTrack('ElevatorCable.scale', times, cableScaleValues);

    const clip = new THREE.AnimationClip('ElevatorCycle', 12, [cageTrack, cableTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
