import { greenPCB, gold, darkSteel, aluminum, whitePlastic } from '../utils/materials.js';

export function createRAMDimm(THREE) {
    const group = new THREE.Group();
    group.name = 'RAMDimm';

    const pcbGeom = new THREE.BoxGeometry(13.3, 3.1, 0.15);
    const pcb = new THREE.Mesh(pcbGeom, greenPCB);
    pcb.position.set(0, 1.55, 0);
    group.add(pcb);

    const pinGeom = new THREE.BoxGeometry(0.08, 0.4, 0.16);
    for(let i=0; i<144; i++) {
        if (i === 72 || i === 73) continue;
        const pin = new THREE.Mesh(pinGeom, gold);
        pin.position.set(-6.5 + i*0.09, 0.2, 0);
        group.add(pin);
    }

    const chipGeom = new THREE.BoxGeometry(1.2, 1.5, 0.1);
    for(let i=0; i<8; i++) {
        const chipLeft = new THREE.Mesh(chipGeom, darkSteel);
        chipLeft.position.set(-5.5 + i*1.5, 1.8, 0.125);
        group.add(chipLeft);
        
        const chipRight = new THREE.Mesh(chipGeom, darkSteel);
        chipRight.position.set(-5.5 + i*1.5, 1.8, -0.125);
        group.add(chipRight);
    }

    const hsGroup = new THREE.Group();
    hsGroup.name = "HeatSpreaders";
    
    const hsGeom = new THREE.BoxGeometry(13.5, 3.3, 0.1);
    const hsFront = new THREE.Mesh(hsGeom, aluminum);
    hsFront.position.set(0, 1.65, 0.25);
    hsFront.name = "HSFront";
    hsGroup.add(hsFront);

    const hsBack = new THREE.Mesh(hsGeom, aluminum);
    hsBack.position.set(0, 1.65, -0.25);
    hsBack.name = "HSBack";
    hsGroup.add(hsBack);

    const labelGeom = new THREE.PlaneGeometry(4, 1);
    const label = new THREE.Mesh(labelGeom, whitePlastic);
    label.position.set(0, 1.65, 0.31);
    hsGroup.add(label);

    group.add(hsGroup);

    const times = [0, 1, 2, 3];
    const frontPos = [
        0, 1.65, 0.25,
        0, 1.65, 2.0,
        0, 1.65, 2.0,
        0, 1.65, 0.25
    ];
    const backPos = [
        0, 1.65, -0.25,
        0, 1.65, -2.0,
        0, 1.65, -2.0,
        0, 1.65, -0.25
    ];

    const frontTrack = new THREE.VectorKeyframeTrack("HSFront.position", times, frontPos);
    const backTrack = new THREE.VectorKeyframeTrack("HSBack.position", times, backPos);

    const explodeClip = new THREE.AnimationClip("Explode", 3, [frontTrack, backTrack]);

    return { group, animationClips: [explodeClip] };
}
