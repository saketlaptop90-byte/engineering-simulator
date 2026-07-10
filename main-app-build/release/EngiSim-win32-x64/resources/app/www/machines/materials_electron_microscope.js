import { materials } from '../utils/materials.js';

export function createElectronMicroscopeColumn(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    // Build the model
    const columnGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    const columnMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const column = new THREE.Mesh(columnGeo, columnMat);
    group.add(column);

    const baseGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, columnMat);
    base.position.y = -2.25;
    group.add(base);

    const sampleStageGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const sampleStage = new THREE.Mesh(sampleStageGeo, materials.accent || new THREE.MeshStandardMaterial({ color: 0xaa2222 }));
    sampleStage.position.y = -1.9;
    group.add(sampleStage);

    // Animation: Electron beam scanning (visualized as a moving light or small cylinder)
    const beamGeo = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = -0.5;
    group.add(beam);

    const beamTrackName = beam.uuid + '.position';
    const times = [0, 1, 2, 3, 4];
    const values = [
        0, -0.5, 0,
        0.2, -0.5, 0,
        0, -0.5, 0.2,
        -0.2, -0.5, 0,
        0, -0.5, 0
    ];
    const beamKF = new THREE.VectorKeyframeTrack(beamTrackName, times, values);
    const clip = new THREE.AnimationClip('Scan', 4, [beamKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
