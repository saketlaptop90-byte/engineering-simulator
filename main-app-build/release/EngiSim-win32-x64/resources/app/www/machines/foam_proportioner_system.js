import { redAccent, steel, brass, yellowAccent } from '../utils/materials.js';

export function createFoamProportionerSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const waterPipeGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const waterPipe = new THREE.Mesh(waterPipeGeom, redAccent);
    waterPipe.rotation.z = Math.PI / 2;
    group.add(waterPipe);

    const tankGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const tank = new THREE.Mesh(tankGeom, steel);
    tank.position.set(0, -2.5, 0);
    group.add(tank);

    const valveGeom = new THREE.SphereGeometry(0.6, 16, 16);
    const valve = new THREE.Mesh(valveGeom, brass);
    group.add(valve);

    const indPipeGeom = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
    const indPipe = new THREE.Mesh(indPipeGeom, brass);
    indPipe.position.set(0, -1, 0);
    group.add(indPipe);

    const flowGeom = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
    const flowInd = new THREE.Mesh(flowGeom, yellowAccent);
    flowInd.position.set(1.5, 0, 0);
    flowInd.rotation.x = Math.PI / 2;
    flowInd.name = "FlowIndicator";
    group.add(flowInd);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 2);
    const flowRot = new THREE.QuaternionKeyframeTrack('FlowIndicator.quaternion', [0, 1, 2], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    const clip = new THREE.AnimationClip('MixFoam', 2, [flowRot]);
    animationClips.push(clip);

    return { group, animationClips };
}
