export function createIonProbe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(3, 4, 2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2;
    group.add(body);

    // Ion Beam Column
    const columnGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const column = new THREE.Mesh(columnGeo, columnMat);
    column.position.set(0, 5.5, 0);
    group.add(column);

    // Sample Chamber Extrusion
    const chamberGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.set(0, 2, 1.5);
    group.add(chamber);

    // Detector Tube
    const detectorGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 16);
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x993333, metalness: 0.5, roughness: 0.5 });
    const detector = new THREE.Mesh(detectorGeo, detectorMat);
    detector.rotation.x = Math.PI / 4;
    detector.position.set(0, 3, -1.5);
    group.add(detector);

    // Primary Ion Beam (Animated)
    const primaryBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const primaryBeamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 });
    const primaryBeam = new THREE.Mesh(primaryBeamGeo, primaryBeamMat);
    primaryBeam.position.set(0, 5.5, 0);
    group.add(primaryBeam);

    // Secondary Ions (Animated)
    const secBeamGeo = new THREE.CylinderGeometry(0.02, 0.1, 2, 8);
    const secBeamMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.7 });
    const secBeam = new THREE.Mesh(secBeamGeo, secBeamMat);
    secBeam.rotation.x = Math.PI / 4;
    secBeam.position.set(0, 3, -1.5);
    group.add(secBeam);

    // Animation
    const duration = 1.5;
    
    // Pulse Primary
    const primaryTrack = new THREE.NumberKeyframeTrack(`${primaryBeam.uuid}.material.opacity`, [0, duration/2, duration], [0.1, 0.8, 0.1]);
    
    // Pulse Secondary (offset)
    const secTrack = new THREE.NumberKeyframeTrack(`${secBeam.uuid}.material.opacity`, [0, duration/2, duration], [0.8, 0.1, 0.8]);

    const clip = new THREE.AnimationClip('IonAnalysis', duration, [primaryTrack, secTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
