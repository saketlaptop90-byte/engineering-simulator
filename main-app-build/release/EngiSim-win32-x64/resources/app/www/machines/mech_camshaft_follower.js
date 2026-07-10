import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createCamshaftFollower(THREE) {
    const group = new THREE.Group();
    
    // Camshaft Assembly
    const camshaft = new THREE.Group();
    camshaft.name = "Camshaft";
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 16), darkSteel);
    shaft.rotation.z = Math.PI / 2;
    camshaft.add(shaft);
    
    // Distort a cylinder to create a teardrop/egg shaped cam lobe
    const createCamLobe = () => {
        const lobeGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
        const positions = lobeGeom.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let z = positions.getZ(i);
            if (z > 0) {
                // Elongate one side to form the lobe tip
                z += Math.pow(z, 1.5) * 0.8; 
                positions.setZ(i, z);
            }
        }
        lobeGeom.computeVertexNormals();
        return new THREE.Mesh(lobeGeom, brass);
    };

    const lobe1 = createCamLobe();
    lobe1.position.set(-2, 0, 0);
    lobe1.rotation.x = 0;
    camshaft.add(lobe1);

    const lobe2 = createCamLobe();
    lobe2.position.set(2, 0, 0);
    lobe2.rotation.x = Math.PI; // 180 degrees out of phase
    camshaft.add(lobe2);

    group.add(camshaft);

    // Follower Assembly
    const createFollower = (name) => {
        const follower = new THREE.Group();
        follower.name = name;
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 16), aluminum);
        rod.position.set(0, 2.5, 0);
        const head = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 16), darkSteel);
        follower.add(rod, head);
        return follower;
    };

    const f1 = createFollower("Follower1");
    f1.position.set(-2, 1.2, 0);
    group.add(f1);

    const f2 = createFollower("Follower2");
    f2.position.set(2, 1.2, 0);
    group.add(f2);

    // Housing guide for followers
    const guide = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 1.5), darkSteel);
    guide.position.set(0, 3, 0);
    group.add(guide);

    const duration = 2;
    const steps = 60;
    const times = [];
    const camVals = [];
    const f1Vals = [];
    const f2Vals = [];

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);
        
        const angle = (t / duration) * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
        camVals.push(q.x, q.y, q.z, q.w);
        
        // Approximate cam lift profile
        const lift1 = Math.max(0, Math.sin(angle));
        f1Vals.push(-2, 1.2 + Math.pow(lift1, 2) * 1.5, 0);
        
        const lift2 = Math.max(0, Math.sin(angle + Math.PI));
        f2Vals.push(2, 1.2 + Math.pow(lift2, 2) * 1.5, 0);
    }

    const camTrack = new THREE.QuaternionKeyframeTrack('Camshaft.quaternion', times, camVals);
    const f1Track = new THREE.VectorKeyframeTrack('Follower1.position', times, f1Vals);
    const f2Track = new THREE.VectorKeyframeTrack('Follower2.position', times, f2Vals);

    const clip = new THREE.AnimationClip('CamOperation', duration, [camTrack, f1Track, f2Track]);

    return { group, animationClips: [clip] };
}
