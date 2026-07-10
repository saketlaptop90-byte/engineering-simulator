import { getMaterial } from '../utils/materials.js';

export function createBionicEyeImplant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main eyeball base
    const eyeGeo = new THREE.SphereGeometry(2, 32, 32);
    const eyeMat = getMaterial('plastic_white', THREE) || new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    group.add(eye);

    // Cybernetic iris ring
    const irisGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
    const irisMat = getMaterial('metal_dark', THREE) || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const iris = new THREE.Mesh(irisGeo, irisMat);
    iris.position.set(0, 0, 1.8);
    iris.name = 'bionic_iris';
    group.add(iris);

    // Glowing artificial pupil
    const pupilGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const pupilMat = getMaterial('glow_red', THREE) || new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.set(0, 0, 1.9);
    pupil.scale.z = 0.2; // Flatten somewhat
    pupil.name = 'bionic_pupil';
    group.add(pupil);

    // Neural interface cable connecting to optic nerve
    const wireGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    wireGeo.rotateX(Math.PI / 2);
    const wireMat = getMaterial('metal_silver', THREE) || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(0, 0, -3);
    group.add(wire);

    // Animation: Iris dilation and pupil pulsing
    const times = [0, 1.5, 3];
    const irisValues = [
        1, 1, 1,
        1.5, 1.5, 1,
        1, 1, 1
    ];
    const pupilValues = [
        1, 1, 0.2,
        0.5, 0.5, 0.2,
        1, 1, 0.2
    ];
    
    const irisTrack = new THREE.VectorKeyframeTrack('bionic_iris.scale', times, irisValues);
    const pupilTrack = new THREE.VectorKeyframeTrack('bionic_pupil.scale', times, pupilValues);
    const clip = new THREE.AnimationClip('scan', 3, [irisTrack, pupilTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
