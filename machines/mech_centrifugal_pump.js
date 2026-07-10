import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createCentrifugalPump(THREE) {
    const group = new THREE.Group();
    group.name = "CentrifugalPump";

    const casing = new THREE.Mesh(new THREE.TorusGeometry(2, 0.8, 16, 48, Math.PI * 1.5), darkSteel);
    group.add(casing);
    
    // Suction pipe
    const suction = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 16), darkSteel);
    suction.rotation.x = Math.PI / 2;
    suction.position.set(0, 0, 1);
    group.add(suction);

    // Discharge pipe
    const discharge = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 16), darkSteel);
    discharge.position.set(0, 2.5, 0);
    group.add(discharge);

    const impeller = new THREE.Group();
    impeller.name = "Impeller";
    
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), brass);
    hub.rotation.x = Math.PI / 2;
    impeller.add(hub);

    for(let i=0; i<6; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.6, 0.6), aluminum);
        const angle = (i / 6) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 1, Math.sin(angle) * 1, 0);
        blade.rotation.z = angle + Math.PI / 4; 
        impeller.add(blade);
    }

    group.add(impeller);

    const duration = 1;
    const tracks = [];
    const times = [];
    const values = [];
    for(let i=0; i<=8; i++) {
        times.push((i/8) * duration);
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), (i/8) * Math.PI * 2);
        values.push(q.x, q.y, q.z, q.w);
    }
    tracks.push(new THREE.QuaternionKeyframeTrack('Impeller.quaternion', times, values));

    const clip = new THREE.AnimationClip("PumpAction", duration, tracks);

    return { group, animationClips: [clip] };
}
