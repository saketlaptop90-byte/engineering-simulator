import { aluminum, titanium, glass, gold } from '../utils/materials.js';

export function createAirlockChamber(THREE) {
    const group = new THREE.Group();
    group.name = 'AirlockChamber';

    // Main cylindrical chamber
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 5, 16);
    const chamber = new THREE.Mesh(chamberGeo, aluminum);
    chamber.rotation.z = Math.PI / 2;
    group.add(chamber);

    // Inner hatch door
    const innerDoorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16);
    const innerDoor = new THREE.Mesh(innerDoorGeo, titanium);
    innerDoor.rotation.z = Math.PI / 2;
    innerDoor.position.x = -2.5;
    innerDoor.name = 'InnerDoor';
    group.add(innerDoor);

    // Outer hatch door
    const outerDoorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16);
    const outerDoor = new THREE.Mesh(outerDoorGeo, titanium);
    outerDoor.rotation.z = Math.PI / 2;
    outerDoor.position.x = 2.5;
    outerDoor.name = 'OuterDoor';
    group.add(outerDoor);

    // Observation viewport on the chamber
    const viewportGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.1, 16);
    const viewport = new THREE.Mesh(viewportGeo, glass);
    viewport.rotation.x = Math.PI / 2;
    group.add(viewport);

    // Animation: Airlock Depressurization / Repressurization Cycle
    // Sequences: Inner opens -> closes -> Outer opens -> closes
    const times = [0, 2, 4, 6, 8, 10];
    
    // Inner door sliding mechanism
    const innerValues = [
        -2.5, 0, 0,       // 0s: closed
        -2.5, 1.5, 0,     // 2s: open
        -2.5, 0, 0,       // 4s: closed
        -2.5, 0, 0,       // 6s: closed
        -2.5, 0, 0,       // 8s: closed
        -2.5, 0, 0        // 10s: closed
    ];
    const innerTrack = new THREE.VectorKeyframeTrack('InnerDoor.position', times, innerValues);

    // Outer door sliding mechanism
    const outerValues = [
        2.5, 0, 0,        // 0s: closed
        2.5, 0, 0,        // 2s: closed
        2.5, 0, 0,        // 4s: closed
        2.5, 1.5, 0,      // 6s: open
        2.5, 0, 0,        // 8s: closed
        2.5, 0, 0         // 10s: closed
    ];
    const outerTrack = new THREE.VectorKeyframeTrack('OuterDoor.position', times, outerValues);

    const clip = new THREE.AnimationClip('AirlockCycle', 10, [innerTrack, outerTrack]);

    return { group, animationClips: [clip] };
}
