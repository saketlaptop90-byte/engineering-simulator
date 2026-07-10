import * as materials from '../utils/materials.js';

export function createHarmonicDriveGear(THREE) {
    const group = new THREE.Group();
    
    const waveGeneratorMat = materials.accentMaterial || new THREE.MeshStandardMaterial({ color: 0xdd4444 });
    const flexSplineMat = materials.plasticMaterial || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const circularSplineMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888 });

    const waveGenerator = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32), waveGeneratorMat);
    waveGenerator.scale.set(1, 1, 0.8);
    waveGenerator.name = 'WaveGenerator';
    waveGenerator.rotation.x = Math.PI / 2;
    group.add(waveGenerator);

    const flexSpline = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 16, 64), flexSplineMat);
    flexSpline.name = 'FlexSpline';
    group.add(flexSpline);

    const circularSpline = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.15, 16, 64), circularSplineMat);
    group.add(circularSpline);

    const times = [0, 2];
    const values = [0, Math.PI * 2];
    const waveTrack = new THREE.NumberKeyframeTrack(waveGenerator.name + '.rotation[y]', times, values);

    // FlexSpline rotates slower
    const flexValues = [0, -Math.PI / 4];
    const flexTrack = new THREE.NumberKeyframeTrack(flexSpline.name + '.rotation[z]', times, flexValues);

    const clip = new THREE.AnimationClip('drive', 2, [waveTrack, flexTrack]);

    return { group, animationClips: [clip] };
}
