import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createHarmonicDrive(THREE) {
    const group = new THREE.Group();
    group.name = 'HarmonicDrive';

    const circSplineGeom = new THREE.TorusGeometry(5, 0.5, 16, 100);
    const circSpline = new THREE.Mesh(circSplineGeom, darkSteel);
    group.add(circSpline);

    const waveGenGroup = new THREE.Group();
    waveGenGroup.name = 'waveGenerator';
    group.add(waveGenGroup);

    const waveGenGeom = new THREE.CylinderGeometry(4.8, 4.8, 1, 32);
    const waveGen = new THREE.Mesh(waveGenGeom, brass);
    waveGen.scale.set(1, 1, 0.85);
    waveGen.rotation.x = Math.PI / 2;
    waveGenGroup.add(waveGen);

    const flexSplineGroup = new THREE.Group();
    flexSplineGroup.name = 'flexSpline';
    group.add(flexSplineGroup);

    const flexSplineGeom = new THREE.CylinderGeometry(4.5, 4.5, 0.5, 64);
    const flexSpline = new THREE.Mesh(flexSplineGeom, aluminum);
    flexSpline.rotation.x = Math.PI / 2;
    flexSplineGroup.add(flexSpline);

    const duration = 2;
    const times = [0, 1, 2];
    
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const waveTrack = new THREE.QuaternionKeyframeTrack('waveGenerator.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w
    ]);

    const q1f = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2f = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 10);
    const q3f = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 5);

    const flexTrack = new THREE.QuaternionKeyframeTrack('flexSpline.quaternion', times, [
        q1f.x, q1f.y, q1f.z, q1f.w, q2f.x, q2f.y, q2f.z, q2f.w, q3f.x, q3f.y, q3f.z, q3f.w
    ]);

    const clip = new THREE.AnimationClip('HarmonicDriveAction', duration, [waveTrack, flexTrack]);

    return { group, animationClips: [clip] };
}
