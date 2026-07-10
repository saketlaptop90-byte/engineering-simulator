import { redAccent, castIron, brass, blueAccent } from '../utils/materials.js';

export function createHydrantValveMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    const body = new THREE.Mesh(bodyGeom, redAccent);
    body.position.y = 1.5;
    group.add(body);

    const topGeom = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI/2);
    const top = new THREE.Mesh(topGeom, redAccent);
    top.position.y = 3;
    group.add(top);

    const outletGeom = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const outlet = new THREE.Mesh(outletGeom, castIron);
    outlet.rotation.z = Math.PI / 2;
    outlet.position.set(1, 2, 0);
    group.add(outlet);

    const spindleGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 6);
    const spindle = new THREE.Mesh(spindleGeom, brass);
    spindle.position.y = 3.25;
    spindle.name = "HydrantSpindle";
    group.add(spindle);

    const waterGeom = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const water = new THREE.Mesh(waterGeom, blueAccent);
    water.rotation.z = Math.PI / 2;
    water.position.set(2, 2, 0);
    water.name = "HydrantWater";
    water.scale.set(0.01, 0.01, 0.01);
    group.add(water);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const spindleRot = new THREE.QuaternionKeyframeTrack('HydrantSpindle.quaternion', [0, 1, 2], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    const waterScale = new THREE.VectorKeyframeTrack('HydrantWater.scale', [1, 2], [0.01, 0.01, 0.01, 1, 1, 1]);
    
    const clip = new THREE.AnimationClip('OpenHydrant', 2, [spindleRot, waterScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
