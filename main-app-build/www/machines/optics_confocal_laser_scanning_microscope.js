import { materials } from '../utils/materials.js';

export function createConfocalLaserScanningMicroscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(2, 6, 3);
    const body = new THREE.Mesh(bodyGeo, materials.lightMetal || materials.metallic);
    body.position.set(0, 3, -1);
    group.add(body);

    // Stage
    const stageGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const stage = new THREE.Mesh(stageGeo, materials.darkMetal);
    stage.position.set(0, 2, 1);
    group.add(stage);

    // Objective Lens
    const lensGeo = new THREE.CylinderGeometry(0.5, 0.2, 1.5);
    const lens = new THREE.Mesh(lensGeo, materials.glass);
    lens.position.set(0, 3.25, 1);
    group.add(lens);

    // Sample
    const sampleGeo = new THREE.PlaneGeometry(1, 1);
    const sampleMat = materials.glass ? materials.glass.clone() : new THREE.MeshBasicMaterial({color: 0xffffff});
    const sample = new THREE.Mesh(sampleGeo, sampleMat);
    sample.rotation.x = -Math.PI / 2;
    sample.position.set(0, 2.26, 1);
    sample.name = 'Sample';
    group.add(sample);

    // Scanning Mirrors (Galvanometer)
    const scanAssembly = new THREE.Group();
    scanAssembly.position.set(0, 5, 1);
    group.add(scanAssembly);
    
    const mirror1Geo = new THREE.BoxGeometry(0.8, 0.1, 0.8);
    const mirror1 = new THREE.Mesh(mirror1Geo, materials.metallic);
    mirror1.rotation.x = Math.PI / 4;
    mirror1.name = 'ScanMirror';
    scanAssembly.add(mirror1);

    // Laser beam going down
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
    const beam = new THREE.Mesh(beamGeo, materials.laserLight || new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.6}));
    beam.position.set(0, 3.75, 1);
    group.add(beam);

    // Animation: Scanning mirror translating slightly to simulate scanning
    const mirrorTrack = new THREE.VectorKeyframeTrack('ScanMirror.position', [0, 0.5, 1, 1.5, 2], [
        0, 0, 0,
        0.1, 0, 0,
        0, 0, 0,
        -0.1, 0, 0,
        0, 0, 0
    ]);

    // Sample scale pulsing to simulate fluorescence
    const sampleTrack = new THREE.VectorKeyframeTrack('Sample.scale', [0, 1, 2], [
        1, 1, 1,
        1.1, 1.1, 1.1,
        1, 1, 1
    ]);

    const clip = new THREE.AnimationClip('ConfocalScan', 2, [mirrorTrack, sampleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
