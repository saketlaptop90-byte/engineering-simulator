import * as materials from '../utils/materials.js';

export function createDarkMatterWeakInteractor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main chamber
    const chamberGeo = new THREE.CylinderGeometry(5, 5, 12, 64);
    const chamberMat = materials.darkMaterial || new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.5, clearcoat: 0.2 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    group.add(chamber);

    // Detector array
    const detectorGroup = new THREE.Group();
    const detectorGeo = new THREE.BoxGeometry(0.5, 10, 0.5);
    const detectorMat = materials.sensorMaterial || new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x442200 });

    for (let i = 0; i < 8; i++) {
        const detector = new THREE.Mesh(detectorGeo, detectorMat);
        const angle = (i / 8) * Math.PI * 2;
        detector.position.x = Math.cos(angle) * 4.5;
        detector.position.z = Math.sin(angle) * 4.5;
        detectorGroup.add(detector);
    }
    group.add(detectorGroup);

    // Dark matter anomaly (visual representation)
    const anomalyGeo = new THREE.SphereGeometry(2, 32, 32);
    const anomalyMat = materials.voidMaterial || new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8 });
    const anomaly = new THREE.Mesh(anomalyGeo, anomalyMat);
    group.add(anomaly);

    // Weak force emitters
    const emitterGeo = new THREE.ConeGeometry(1, 2, 16);
    const emitterMat = materials.emitterMaterial || new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0055ff });
    
    const topEmitter = new THREE.Mesh(emitterGeo, emitterMat);
    topEmitter.position.y = 5;
    topEmitter.rotation.x = Math.PI;
    group.add(topEmitter);

    const bottomEmitter = new THREE.Mesh(emitterGeo, emitterMat);
    bottomEmitter.position.y = -5;
    group.add(bottomEmitter);

    // Animations
    const times = [0, 5, 10];
    
    // Detector rotation
    const detectorRotTrack = new THREE.VectorKeyframeTrack('.rotation[y]', times, [0, Math.PI, Math.PI * 2]);
    const detectorClip = new THREE.AnimationClip('DetectorSpin', 10, [detectorRotTrack]);
    animationClips.push({ mesh: detectorGroup, clip: detectorClip });

    // Anomaly fluctuation
    const anomalyScaleTrack = new THREE.VectorKeyframeTrack('.scale', times, [1, 1, 1, 0.5, 1.5, 0.5, 1, 1, 1]);
    const anomalyClip = new THREE.AnimationClip('AnomalyFluctuate', 10, [anomalyScaleTrack]);
    animationClips.push({ mesh: anomaly, clip: anomalyClip });

    return { group, animationClips };
}
