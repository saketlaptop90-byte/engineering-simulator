import { glass, titanium, gold } from '../utils/materials.js';

export function createOpticalInterferometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base plate
    const baseGeo = new THREE.BoxGeometry(12, 0.5, 12);
    const base = new THREE.Mesh(baseGeo, titanium);
    group.add(base);

    // Beam splitter
    const splitterGeo = new THREE.BoxGeometry(1, 2, 1);
    const splitter = new THREE.Mesh(splitterGeo, glass);
    splitter.position.set(0, 1.25, 0);
    splitter.rotation.y = Math.PI / 4;
    group.add(splitter);

    // Mirrors
    const mirrorGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const mirror1 = new THREE.Mesh(mirrorGeo, gold);
    mirror1.position.set(0, 1.25, -4);
    mirror1.rotation.x = Math.PI / 2;
    group.add(mirror1);

    const mirror2 = new THREE.Mesh(mirrorGeo, gold);
    mirror2.position.set(4, 1.25, 0);
    mirror2.rotation.z = Math.PI / 2;
    mirror2.rotation.y = Math.PI / 2;
    group.add(mirror2);

    // Laser source
    const sourceGeo = new THREE.BoxGeometry(1, 1, 2);
    const source = new THREE.Mesh(sourceGeo, titanium);
    source.position.set(0, 1.25, 5);
    group.add(source);

    // Detectors
    const detectorGeo = new THREE.BoxGeometry(1.5, 1.5, 0.5);
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const detector = new THREE.Mesh(detectorGeo, detectorMat);
    detector.position.set(-5, 1.25, 0);
    detector.rotation.y = Math.PI / 2;
    group.add(detector);

    // Photon packets
    const packetGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const packet1 = new THREE.Mesh(packetGeo, packetMat);
    const packet2 = new THREE.Mesh(packetGeo, packetMat);
    group.add(packet1);
    group.add(packet2);

    // Animations
    const times = [0, 1, 2, 3];
    // Source to splitter (0-1), Splitter to mirrors (1-2), Mirrors to splitter (2-3)
    const p1Values = [0, 1.25, 4, 0, 1.25, 0, 4, 1.25, 0, 0, 1.25, 0];
    const p2Values = [0, 1.25, 4, 0, 1.25, 0, 0, 1.25, -4, 0, 1.25, 0];
    
    const track1 = new THREE.VectorKeyframeTrack(`${packet1.uuid}.position`, times, p1Values);
    const track2 = new THREE.VectorKeyframeTrack(`${packet2.uuid}.position`, times, p2Values);

    animationClips.push(new THREE.AnimationClip('Interference_Path1', 3, [track1]));
    animationClips.push(new THREE.AnimationClip('Interference_Path2', 3, [track2]));

    return { group, animationClips };
}
