import { glass, aluminum, gold, steel } from '../utils/materials.js';

export function createOpticalSpectrometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Casing
    const casingGeo = new THREE.BoxGeometry(3, 0.8, 2);
    const casing = new THREE.Mesh(casingGeo, steel);
    casing.position.y = 0.4;
    group.add(casing);

    // Slit
    const slitGeo = new THREE.BoxGeometry(0.1, 0.4, 0.4);
    const slit = new THREE.Mesh(slitGeo, aluminum);
    slit.position.set(-1.5, 0.6, 0);
    group.add(slit);

    // Collimator Lens
    const lensGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    lensGeo.rotateZ(Math.PI / 2);
    const collimator = new THREE.Mesh(lensGeo, glass);
    collimator.position.set(-0.8, 0.6, 0);
    collimator.name = 'collimatorLens';
    group.add(collimator);

    // Diffraction Grating
    const gratingGeo = new THREE.BoxGeometry(0.4, 0.4, 0.05);
    const grating = new THREE.Mesh(gratingGeo, gold);
    grating.position.set(0, 0.6, 0);
    grating.name = 'diffractionGrating';
    group.add(grating);

    // Focusing Lens
    const focusLens = new THREE.Mesh(lensGeo, glass);
    focusLens.position.set(0.8, 0.6, 0);
    focusLens.name = 'focusLens';
    group.add(focusLens);

    // Detector Array
    const detectorGeo = new THREE.BoxGeometry(0.2, 0.4, 1.2);
    const detector = new THREE.Mesh(detectorGeo, aluminum);
    detector.position.set(1.3, 0.6, 0);
    group.add(detector);

    // Animations: Grating rotates to scan spectrum, Lenses adjust slightly
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 8);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 8);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 8);

    const gratingTrack = new THREE.QuaternionKeyframeTrack(
        'diffractionGrating.quaternion',
        [0, 2, 4],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const colLensTrack = new THREE.VectorKeyframeTrack(
        'collimatorLens.position',
        [0, 2, 4],
        [-0.8, 0.6, 0,  -0.75, 0.6, 0,  -0.8, 0.6, 0]
    );

    const focLensTrack = new THREE.VectorKeyframeTrack(
        'focusLens.position',
        [0, 2, 4],
        [0.8, 0.6, 0,  0.85, 0.6, 0,  0.8, 0.6, 0]
    );

    const clip = new THREE.AnimationClip('Spectrometer_Scan', 4, [gratingTrack, colLensTrack, focLensTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
