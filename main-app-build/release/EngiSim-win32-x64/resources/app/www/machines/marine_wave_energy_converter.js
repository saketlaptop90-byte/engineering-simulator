import { materials } from '../utils/materials.js';

export function createWaveEnergyConverter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matOrange = materials.orangePaint || new THREE.MeshStandardMaterial({ color: 0xff6600 });
    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x444444 });

    const baseGeo = new THREE.CylinderGeometry(1, 1, 0.5);
    const base = new THREE.Mesh(baseGeo, matSteel);
    base.position.y = -5;
    group.add(base);

    const tetherGeo = new THREE.CylinderGeometry(0.1, 0.1, 5);
    const tether = new THREE.Mesh(tetherGeo, matSteel);
    tether.position.y = -2.5;
    group.add(tether);

    const buoyPivot = new THREE.Group();
    buoyPivot.name = 'buoyPivot';
    group.add(buoyPivot);

    const buoyGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const buoy = new THREE.Mesh(buoyGeo, matOrange);
    buoyPivot.add(buoy);

    const rotorPivot = new THREE.Group();
    rotorPivot.position.y = -4.8;
    rotorPivot.name = 'rotorPivot';
    group.add(rotorPivot);
    const rotorGeo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
    const rotor = new THREE.Mesh(rotorGeo, matSteel);
    rotorPivot.add(rotor);

    const duration = 4;
    const times = [0, duration / 2, duration];
    
    const buoyTrack = new THREE.VectorKeyframeTrack('buoyPivot.position', times, [
        0, 0, 0,
        0, 1.5, 0,
        0, 0, 0
    ]);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const rotorTrack = new THREE.QuaternionKeyframeTrack('rotorPivot.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ]);

    const clip = new THREE.AnimationClip('WEC_Action', duration, [buoyTrack, rotorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
