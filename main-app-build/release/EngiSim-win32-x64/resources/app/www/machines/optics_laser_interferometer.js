import * as sharedMaterials from '../utils/materials.js';

export function createLaserInterferometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const getMat = (name, fallback) => (sharedMaterials[name] || (sharedMaterials.default && sharedMaterials.default[name]) || fallback);

    const metalMat = getMat('metal', new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.2 }));
    const glassMat = getMat('glass', new THREE.MeshPhysicalMaterial({ color: 0xccccff, transmission: 0.9, transparent: true, roughness: 0 }));
    const laserMat = getMat('laser', new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 }));
    const mirrorMat = getMat('mirror', new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0 }));

    // Base
    const baseGeom = new THREE.BoxGeometry(10, 0.5, 10);
    const base = new THREE.Mesh(baseGeom, metalMat);
    group.add(base);

    // Laser Source
    const sourceGeom = new THREE.BoxGeometry(2, 1, 1);
    const source = new THREE.Mesh(sourceGeom, metalMat);
    source.position.set(-4, 1, 0);
    group.add(source);

    // Beam Splitter
    const splitterGeom = new THREE.BoxGeometry(0.1, 1.5, 1.5);
    const splitter = new THREE.Mesh(splitterGeom, glassMat);
    splitter.position.set(0, 1, 0);
    splitter.rotation.y = Math.PI / 4;
    group.add(splitter);

    // Mirror 1 (Fixed)
    const mirror1Geom = new THREE.BoxGeometry(0.2, 1.5, 1.5);
    const mirror1 = new THREE.Mesh(mirror1Geom, mirrorMat);
    mirror1.position.set(0, 1, -4);
    group.add(mirror1);

    // Mirror 2 (Movable)
    const mirror2Geom = new THREE.BoxGeometry(0.2, 1.5, 1.5);
    const mirror2 = new THREE.Mesh(mirror2Geom, mirrorMat);
    mirror2.position.set(4, 1, 0);
    mirror2.name = 'MovableMirror';
    group.add(mirror2);

    // Detector
    const detectorGeom = new THREE.BoxGeometry(1.5, 1.5, 0.2);
    const detector = new THREE.Mesh(detectorGeom, metalMat);
    detector.position.set(0, 1, 4);
    group.add(detector);

    // Beams
    const beam1Geom = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beam1 = new THREE.Mesh(beam1Geom, laserMat);
    beam1.rotation.z = Math.PI / 2;
    beam1.position.set(-2, 1, 0);
    group.add(beam1);

    const beam2Geom = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beam2 = new THREE.Mesh(beam2Geom, laserMat);
    beam2.rotation.z = Math.PI / 2;
    beam2.position.set(2, 1, 0);
    group.add(beam2);

    const beam3Geom = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beam3 = new THREE.Mesh(beam3Geom, laserMat);
    beam3.rotation.x = Math.PI / 2;
    beam3.position.set(0, 1, -2);
    group.add(beam3);

    const beam4Geom = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const beam4 = new THREE.Mesh(beam4Geom, laserMat);
    beam4.rotation.x = Math.PI / 2;
    beam4.position.set(0, 1, 2);
    group.add(beam4);

    // Animation: Move mirror 2 back and forth to simulate changing phase
    const times = [0, 2, 4];
    const values = [
        4, 1, 0,
        4.5, 1, 0,
        4, 1, 0
    ];
    const track = new THREE.VectorKeyframeTrack('MovableMirror.position', times, values);
    const clip = new THREE.AnimationClip('MirrorOscillation', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
