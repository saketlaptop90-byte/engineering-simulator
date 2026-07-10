import { glass, aluminum, gold, steel } from '../utils/materials.js';

export function createScanningElectronMicroscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Stage
    const baseGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, steel);
    base.position.y = 0.25;
    group.add(base);

    // Sample Stage
    const stageGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const stage = new THREE.Mesh(stageGeo, gold);
    stage.position.y = 0.6;
    stage.name = 'sampleStage';
    group.add(stage);

    // Electron Column
    const columnGeo = new THREE.CylinderGeometry(0.3, 0.6, 3, 32);
    const column = new THREE.Mesh(columnGeo, aluminum);
    column.position.y = 2.2;
    group.add(column);

    // Detector
    const detectorGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const detector = new THREE.Mesh(detectorGeo, aluminum);
    detector.position.set(0.8, 1.0, 0);
    detector.lookAt(0, 0.6, 0);
    group.add(detector);

    // Beam (Scale animation to simulate pulsing)
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 16);
    // Use glass to simulate a semi-transparent beam
    const beam = new THREE.Mesh(beamGeo, glass);
    beam.position.y = 1.35;
    beam.name = 'electronBeam';
    group.add(beam);

    // Animations
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const stageRotTrack = new THREE.QuaternionKeyframeTrack(
        'sampleStage.quaternion',
        [0, 2, 4],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const beamTimes = [0, 0.5, 1, 1.5, 2];
    const beamScaleValues = [1, 1, 1,  1.5, 1, 1.5,  1, 1, 1,  1.5, 1, 1.5,  1, 1, 1];
    const beamScaleTrack = new THREE.VectorKeyframeTrack('electronBeam.scale', beamTimes, beamScaleValues);

    const clip = new THREE.AnimationClip('SEM_Operation', 4, [stageRotTrack, beamScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
