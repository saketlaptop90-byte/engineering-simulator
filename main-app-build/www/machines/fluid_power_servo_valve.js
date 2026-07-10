import { steel, aluminum, brass, copper, redAccent, blueAccent, tinted, glass } from '../utils/materials.js';

export function createServoValve(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Valve body
    const bodyGeo = new THREE.BoxGeometry(6, 3, 3);
    const bodyMat = glass.clone();
    bodyMat.opacity = 0.3;
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Spool bore
    const boreGeo = new THREE.CylinderGeometry(0.6, 0.6, 6, 32);
    const bore = new THREE.Mesh(boreGeo, glass);
    bore.rotation.z = Math.PI/2;
    group.add(bore);

    // Spool
    const spoolGroup = new THREE.Group();
    group.add(spoolGroup);

    const spoolRodGeo = new THREE.CylinderGeometry(0.2, 0.2, 5.8, 16);
    const spoolRod = new THREE.Mesh(spoolRodGeo, steel);
    spoolRod.rotation.z = Math.PI/2;
    spoolGroup.add(spoolRod);

    const landGeo = new THREE.CylinderGeometry(0.58, 0.58, 1.2, 32);
    const land1 = new THREE.Mesh(landGeo, steel);
    land1.position.x = -1.5;
    land1.rotation.z = Math.PI/2;
    spoolGroup.add(land1);

    const land2 = new THREE.Mesh(landGeo, steel);
    land2.position.x = 1.5;
    land2.rotation.z = Math.PI/2;
    spoolGroup.add(land2);

    // Solenoids (left and right)
    const solenoidGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
    
    const solLeft = new THREE.Mesh(solenoidGeo, copper);
    solLeft.position.x = -4;
    solLeft.rotation.z = Math.PI/2;
    group.add(solLeft);

    const solRight = new THREE.Mesh(solenoidGeo, copper);
    solRight.position.x = 4;
    solRight.rotation.z = Math.PI/2;
    group.add(solRight);

    // Ports
    const portGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    // P (Pressure) port
    const portP = new THREE.Mesh(portGeo, redAccent);
    portP.position.set(0, -2, 0);
    group.add(portP);
    
    // T (Tank) ports
    const portT1 = new THREE.Mesh(portGeo, blueAccent);
    portT1.position.set(-2.5, -2, 0);
    group.add(portT1);

    const portT2 = new THREE.Mesh(portGeo, blueAccent);
    portT2.position.set(2.5, -2, 0);
    group.add(portT2);

    // A and B (Work) ports
    const portA = new THREE.Mesh(portGeo, brass);
    portA.position.set(-1.5, 2, 0);
    group.add(portA);

    const portB = new THREE.Mesh(portGeo, brass);
    portB.position.set(1.5, 2, 0);
    group.add(portB);

    // Animation: Spool shifts left and right
    const spoolTrack = new THREE.VectorKeyframeTrack(
        spoolGroup.uuid + '.position',
        [0, 1, 2, 3, 4],
        [
            0, 0, 0,
            1.0, 0, 0, 
            0, 0, 0,
            -1.0, 0, 0, 
            0, 0, 0
        ]
    );

    // Solenoid color highlights to show activation
    const colorOn = new THREE.Color(0xffaa00);
    const colorOff = new THREE.Color(0xb87333); // copper

    const leftSolColor = new THREE.ColorKeyframeTrack(
        solLeft.uuid + '.material.color',
        [0, 2, 2.1, 3, 3.9, 4],
        [
            colorOff.r, colorOff.g, colorOff.b,
            colorOff.r, colorOff.g, colorOff.b,
            colorOn.r, colorOn.g, colorOn.b,
            colorOn.r, colorOn.g, colorOn.b,
            colorOff.r, colorOff.g, colorOff.b,
            colorOff.r, colorOff.g, colorOff.b
        ]
    );

    const rightSolColor = new THREE.ColorKeyframeTrack(
        solRight.uuid + '.material.color',
        [0, 0.1, 1, 1.9, 2, 4],
        [
            colorOff.r, colorOff.g, colorOff.b,
            colorOn.r, colorOn.g, colorOn.b,
            colorOn.r, colorOn.g, colorOn.b,
            colorOff.r, colorOff.g, colorOff.b,
            colorOff.r, colorOff.g, colorOff.b,
            colorOff.r, colorOff.g, colorOff.b
        ]
    );

    solLeft.material = copper.clone();
    solRight.material = copper.clone();

    const clip = new THREE.AnimationClip('ServoValveCycle', 4, [
        spoolTrack, leftSolColor, rightSolColor
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
