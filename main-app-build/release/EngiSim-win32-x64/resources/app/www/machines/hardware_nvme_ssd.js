import { blueAccent, darkSteel, chrome, whitePlastic, gold, steel } from '../utils/materials.js';

export function createNVMeSSD(THREE) {
    const group = new THREE.Group();
    group.name = 'NVMeSSD';

    const ssdBody = new THREE.Group();
    ssdBody.name = "SSDBody";
    ssdBody.position.set(0, 0, 0); 

    const pcbGeom = new THREE.BoxGeometry(8.0, 0.1, 2.2);
    const pcb = new THREE.Mesh(pcbGeom, blueAccent);
    pcb.position.set(4.0, 0, 0);
    ssdBody.add(pcb);

    const pinGeom = new THREE.BoxGeometry(0.2, 0.12, 0.05);
    for(let i=0; i<30; i++) {
        if(i > 22 && i < 26) continue;
        const pin = new THREE.Mesh(pinGeom, gold);
        pin.position.set(0.1, 0, -1.0 + i*0.07);
        ssdBody.add(pin);
    }

    const ctrlGeom = new THREE.BoxGeometry(1.2, 0.15, 1.2);
    const ctrl = new THREE.Mesh(ctrlGeom, chrome);
    ctrl.position.set(1.5, 0.125, 0);
    ssdBody.add(ctrl);

    const nandGeom = new THREE.BoxGeometry(1.5, 0.2, 1.8);
    for(let i=0; i<2; i++) {
        const nand = new THREE.Mesh(nandGeom, darkSteel);
        nand.position.set(4.0 + i*1.8, 0.15, 0);
        ssdBody.add(nand);
    }

    const labelGeom = new THREE.PlaneGeometry(6.5, 2.0);
    const label = new THREE.Mesh(labelGeom, whitePlastic);
    label.rotation.x = -Math.PI / 2;
    label.position.set(4.0, 0.26, 0);
    ssdBody.add(label);
    
    group.add(ssdBody);

    const screwGroup = new THREE.Group();
    screwGroup.name = "Screw";
    screwGroup.position.set(8.0, 3.0, 0);
    
    const threadGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    const thread = new THREE.Mesh(threadGeom, steel);
    screwGroup.add(thread);
    
    const headGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.1);
    const head = new THREE.Mesh(headGeom, steel);
    head.position.set(0, 0.3, 0);
    screwGroup.add(head);

    group.add(screwGroup);

    const times = [0, 1, 2, 3];
    
    const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/6);
    const qFlat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    
    const ssdTimes = [0, 1, 2, 3];
    const ssdValues = [
        qTilt.x, qTilt.y, qTilt.z, qTilt.w,
        qFlat.x, qFlat.y, qFlat.z, qFlat.w,
        qFlat.x, qFlat.y, qFlat.z, qFlat.w,
        qFlat.x, qFlat.y, qFlat.z, qFlat.w
    ];
    const ssdTrack = new THREE.QuaternionKeyframeTrack("SSDBody.quaternion", ssdTimes, ssdValues);

    const screwPos = [
        8.0, 3.0, 0,
        8.0, 3.0, 0,
        8.0, 0.2, 0,
        8.0, 0.0, 0
    ];
    const screwPosTrack = new THREE.VectorKeyframeTrack("Screw.position", times, screwPos);

    const screwTimes = [0, 2, 2.25, 2.5, 2.75, 3]; 
    const qs0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const qs1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const qs2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);
    const qs3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*3);
    const qs4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*4);
    
    const screwRot = [
        qs0.x, qs0.y, qs0.z, qs0.w,
        qs0.x, qs0.y, qs0.z, qs0.w,
        qs1.x, qs1.y, qs1.z, qs1.w,
        qs2.x, qs2.y, qs2.z, qs2.w,
        qs3.x, qs3.y, qs3.z, qs3.w,
        qs4.x, qs4.y, qs4.z, qs4.w
    ];
    const screwRotTrack = new THREE.QuaternionKeyframeTrack("Screw.quaternion", screwTimes, screwRot);

    const animClip = new THREE.AnimationClip("Install", 3, [ssdTrack, screwPosTrack, screwRotTrack]);

    return { group, animationClips: [animClip] };
}
