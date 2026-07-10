import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createScotchYoke(THREE) {
    const group = new THREE.Group();
    group.name = 'ScotchYoke';

    const crankGroup = new THREE.Group();
    crankGroup.name = 'crank';
    group.add(crankGroup);

    const crankDiskGeom = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const crankDisk = new THREE.Mesh(crankDiskGeom, darkSteel);
    crankDisk.rotation.x = Math.PI / 2;
    crankGroup.add(crankDisk);

    const pinGeom = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const pin = new THREE.Mesh(pinGeom, brass);
    pin.position.set(1.2, 0, 0.5); 
    pin.rotation.x = Math.PI / 2;
    crankGroup.add(pin);

    const yokeGroup = new THREE.Group();
    yokeGroup.name = 'yoke';
    group.add(yokeGroup);

    const slotGeom = new THREE.BoxGeometry(0.5, 4, 0.5);
    const slotLeft = new THREE.Mesh(slotGeom, aluminum);
    slotLeft.position.set(-0.55, 0, 0.5); 
    yokeGroup.add(slotLeft);

    const slotRight = new THREE.Mesh(slotGeom, aluminum);
    slotRight.position.set(0.55, 0, 0.5); 
    yokeGroup.add(slotRight);

    const rodGeom = new THREE.BoxGeometry(8, 0.5, 0.5);
    const rod = new THREE.Mesh(rodGeom, aluminum);
    rod.position.set(4, 0, 0.5);
    yokeGroup.add(rod);

    const duration = 2;
    const frames = 30;
    const times = [];
    const crankRot = [];
    const yokePos = [];

    for (let i = 0; i <= frames; i++) {
        const t = (i / frames) * duration;
        times.push(t);

        const angle = (i / frames) * Math.PI * 2;
        
        const qC = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        crankRot.push(qC.x, qC.y, qC.z, qC.w);

        const pinX = 1.2 * Math.cos(angle);
        yokePos.push(pinX, 0, 0);
    }

    const crankTrack = new THREE.QuaternionKeyframeTrack('crank.quaternion', times, crankRot);
    const yokeTrack = new THREE.VectorKeyframeTrack('yoke.position', times, yokePos);

    const clip = new THREE.AnimationClip('ScotchYokeAction', duration, [crankTrack, yokeTrack]);

    return { group, animationClips: [clip] };
}
