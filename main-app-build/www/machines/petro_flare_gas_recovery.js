import { materials } from '../utils/materials.js';

export function createFlareGasRecoverySystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Compressor
    const compGeo = new THREE.BoxGeometry(4, 3, 4);
    const compMat = materials.machinery || new THREE.MeshStandardMaterial({ color: 0x225588 });
    const compressor = new THREE.Mesh(compGeo, compMat);
    compressor.position.y = 1.5;
    group.add(compressor);

    // Knockout Drum
    const drumGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 32);
    const drumMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x999999 });
    const drum = new THREE.Mesh(drumGeo, drumMat);
    drum.position.set(-4, 2.5, 0);
    group.add(drum);

    // Connecting Piping
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const pipeMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-2, 2.5, 0);
    group.add(pipe);

    // Flare gas processing animation (pulsing scale)
    const scaleTracks = [];
    const times = [0, 0.5, 1];
    const values = [
        1, 1, 1,
        1.05, 1.05, 1.05,
        1, 1, 1
    ];
    
    compressor.name = 'compressor';
    const scaleTrack = new THREE.VectorKeyframeTrack(`${compressor.name}.scale`, times, values);
    scaleTracks.push(scaleTrack);

    const clip = new THREE.AnimationClip('CompressorOperation', 1, scaleTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
