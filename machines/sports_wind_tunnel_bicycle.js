import { materials } from '../utils/materials.js';

export function createWindTunnelBicycle(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(4, 0.2, 2);
    const base = new THREE.Mesh(baseGeo, materials.steel);
    group.add(base);

    const frameGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    const frame = new THREE.Mesh(frameGeo, materials.aluminum);
    frame.position.set(0, 1, 0);
    frame.rotation.z = Math.PI / 4;
    group.add(frame);

    const wheelGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
    const spokesGeo = new THREE.CylinderGeometry(0.02, 0.02, 1);
    
    const frontWheelGroup = new THREE.Group();
    frontWheelGroup.name = 'frontWheel';
    const frontWheel = new THREE.Mesh(wheelGeo, materials.carbonFiber);
    const spoke1 = new THREE.Mesh(spokesGeo, materials.steel);
    const spoke2 = new THREE.Mesh(spokesGeo, materials.steel);
    spoke2.rotation.x = Math.PI / 2;
    frontWheelGroup.add(frontWheel, spoke1, spoke2);
    frontWheelGroup.position.set(-1, 0.5, 0);
    group.add(frontWheelGroup);

    const backWheelGroup = frontWheelGroup.clone();
    backWheelGroup.name = 'backWheel';
    backWheelGroup.position.set(1.2, 0.5, 0);
    group.add(backWheelGroup);

    const fanGroup = new THREE.Group();
    fanGroup.name = 'fan';
    const fanHubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2);
    const fanHub = new THREE.Mesh(fanHubGeo, materials.steel);
    fanHub.rotation.z = Math.PI / 2;
    fanGroup.add(fanHub);

    for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1, 0.02);
        const blade = new THREE.Mesh(bladeGeo, materials.plastic);
        blade.position.y = 0.5;
        const pivot = new THREE.Group();
        pivot.rotation.x = (Math.PI / 2) * i;
        pivot.add(blade);
        fanGroup.add(pivot);
    }
    fanGroup.position.set(-2.5, 1, 0);
    group.add(fanGroup);

    const times = [0, 2, 4];
    
    const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const qMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI);
    const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI * 2);
    const rotVals = [...qStart.toArray(), ...qMid.toArray(), ...qEnd.toArray()];

    const wheel1Track = new THREE.QuaternionKeyframeTrack(`frontWheel.quaternion`, times, rotVals);
    const wheel2Track = new THREE.QuaternionKeyframeTrack(`backWheel.quaternion`, times, rotVals);
    
    const fStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const fMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 4);
    const fEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 8);
    const fanRotVals = [...fStart.toArray(), ...fMid.toArray(), ...fEnd.toArray()];
    
    const fanTrack = new THREE.QuaternionKeyframeTrack(`fan.quaternion`, times, fanRotVals);

    const clip = new THREE.AnimationClip('WindTunnelAction', 4, [wheel1Track, wheel2Track, fanTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
