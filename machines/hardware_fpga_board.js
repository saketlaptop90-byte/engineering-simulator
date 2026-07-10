import { greenPCB, darkSteel, aluminum, blackPlastic, gold, redAccent, greenAccent } from '../utils/materials.js';

export function createFPGABoard(THREE) {
    const group = new THREE.Group();
    group.name = 'FPGABoard';

    const boardGeom = new THREE.BoxGeometry(10, 0.2, 8);
    const board = new THREE.Mesh(boardGeom, greenPCB);
    group.add(board);

    const chipGeom = new THREE.BoxGeometry(2, 0.3, 2);
    const chip = new THREE.Mesh(chipGeom, darkSteel);
    chip.position.set(0, 0.25, 0);
    group.add(chip);

    const hsGeom = new THREE.BoxGeometry(2, 0.5, 2);
    const hs = new THREE.Mesh(hsGeom, aluminum);
    hs.position.set(0, 0.65, 0);
    group.add(hs);

    const fanGroup = new THREE.Group();
    fanGroup.name = "FPGABoard_Fan";
    fanGroup.position.set(0, 1.0, 0);
    const hubGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const hub = new THREE.Mesh(hubGeom, blackPlastic);
    fanGroup.add(hub);
    
    for(let i=0; i<7; i++) {
        const bladeGeom = new THREE.BoxGeometry(0.8, 0.05, 0.3);
        const blade = new THREE.Mesh(bladeGeom, blackPlastic);
        blade.position.x = 0.5;
        const pivot = new THREE.Group();
        pivot.rotation.y = (i / 7) * Math.PI * 2;
        pivot.add(blade);
        fanGroup.add(pivot);
    }
    group.add(fanGroup);

    const ioGeom = new THREE.BoxGeometry(1, 0.8, 3);
    const io1 = new THREE.Mesh(ioGeom, aluminum);
    io1.position.set(-4.5, 0.5, 2);
    group.add(io1);

    const io2 = new THREE.Mesh(ioGeom, blackPlastic);
    io2.position.set(-4.5, 0.5, -2);
    group.add(io2);

    const gpioGroup = new THREE.Group();
    const pinGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
    for(let i=0; i<20; i++) {
        const pin = new THREE.Mesh(pinGeom, gold);
        pin.position.set(4, 0.35, -3 + i * 0.3);
        gpioGroup.add(pin);
        const pin2 = new THREE.Mesh(pinGeom, gold);
        pin2.position.set(4.3, 0.35, -3 + i * 0.3);
        gpioGroup.add(pin2);
    }
    group.add(gpioGroup);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const fanTimes = [0, 0.5, 1, 1.5, 2];
    const fanValues = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w
    ];
    
    const fanTrack = new THREE.QuaternionKeyframeTrack("FPGABoard_Fan.quaternion", fanTimes, fanValues);
    const fanClip = new THREE.AnimationClip("FanSpin", 2, [fanTrack]);

    return { group, animationClips: [fanClip] };
}
