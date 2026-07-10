import { materials } from '../utils/materials.js';

export function createMichelsonLaserInterferometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const base = new THREE.Mesh(baseGeo, materials.metallic);
    base.position.y = -0.25;
    group.add(base);

    // Laser Source
    const laserGeo = new THREE.BoxGeometry(2, 1, 1);
    const laser = new THREE.Mesh(laserGeo, materials.darkMetal);
    laser.position.set(-4, 0.5, 0);
    group.add(laser);

    // Beam Splitter
    const splitterGeo = new THREE.BoxGeometry(0.1, 1, 1);
    const splitter = new THREE.Mesh(splitterGeo, materials.glass);
    splitter.rotation.y = Math.PI / 4;
    splitter.position.set(0, 0.5, 0);
    group.add(splitter);

    // Mirror 1 (Fixed)
    const mirror1Geo = new THREE.BoxGeometry(0.2, 1, 1);
    const mirror1 = new THREE.Mesh(mirror1Geo, materials.metallic);
    mirror1.position.set(0, 0.5, -4);
    group.add(mirror1);

    // Mirror 2 (Movable)
    const mirror2Geo = new THREE.BoxGeometry(0.2, 1, 1);
    const mirror2 = new THREE.Mesh(mirror2Geo, materials.metallic);
    mirror2.rotation.y = Math.PI / 2;
    mirror2.position.set(4, 0.5, 0);
    mirror2.name = 'MovableMirror';
    group.add(mirror2);

    // Detector
    const detectorGeo = new THREE.BoxGeometry(1, 1, 2);
    const detector = new THREE.Mesh(detectorGeo, materials.darkMetal);
    detector.position.set(0, 0.5, 4);
    group.add(detector);

    // Laser Beam (Source to Splitter)
    const beam1Geo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beamMat = materials.laserLight || new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.8});
    const beam1 = new THREE.Mesh(beam1Geo, beamMat);
    beam1.rotation.z = Math.PI / 2;
    beam1.position.set(-2, 0.5, 0);
    beam1.name = 'Beam1';
    group.add(beam1);

    // Beam (Splitter to Mirror 1)
    const beam2Geo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beam2 = new THREE.Mesh(beam2Geo, beamMat);
    beam2.rotation.x = Math.PI / 2;
    beam2.position.set(0, 0.5, -2);
    group.add(beam2);

    // Beam (Splitter to Mirror 2)
    const beam3Geo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beam3 = new THREE.Mesh(beam3Geo, beamMat);
    beam3.rotation.z = Math.PI / 2;
    beam3.position.set(2, 0.5, 0);
    group.add(beam3);

    // Beam (Splitter to Detector)
    const beam4Geo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beam4 = new THREE.Mesh(beam4Geo, beamMat);
    beam4.rotation.x = Math.PI / 2;
    beam4.position.set(0, 0.5, 2);
    group.add(beam4);

    // Animations: Mirror 2 oscillating to show interference pattern changes
    const times = [0, 1, 2];
    const values = [
        4, 0.5, 0,
        4.5, 0.5, 0,
        4, 0.5, 0
    ];
    const mirrorTrack = new THREE.VectorKeyframeTrack('MovableMirror.position', times, values);
    
    // Beam intensity pulse
    const beamOpacityTrack = new THREE.NumberKeyframeTrack('Beam1.material.opacity', [0, 0.5, 1], [0.8, 1.0, 0.8]);

    const clip = new THREE.AnimationClip('InterferometerOperation', 2, [mirrorTrack, beamOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
