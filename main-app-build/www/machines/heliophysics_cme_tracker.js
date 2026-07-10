export function createCMETracker(THREE) {
    const group = new THREE.Group();

    // Central Hub
    const hubGeo = new THREE.DodecahedronGeometry(2);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.7, roughness: 0.3 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.name = 'Hub';
    group.add(hub);

    // Tracking Arms
    const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
    
    const arm1 = new THREE.Mesh(armGeo, armMat);
    arm1.position.x = 2.5;
    arm1.rotation.z = Math.PI / 2;
    hub.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, armMat);
    arm2.position.x = -2.5;
    arm2.rotation.z = Math.PI / 2;
    hub.add(arm2);

    const arm3 = new THREE.Mesh(armGeo, armMat);
    arm3.position.y = 2.5;
    hub.add(arm3);

    const arm4 = new THREE.Mesh(armGeo, armMat);
    arm4.position.y = -2.5;
    hub.add(arm4);

    const times = [0, 5, 10];
    const valuesX = [0, Math.PI, Math.PI * 2];
    const valuesY = [0, -Math.PI, -Math.PI * 2];

    const trackX = new THREE.NumberKeyframeTrack('Hub.rotation[x]', times, valuesX);
    const trackY = new THREE.NumberKeyframeTrack('Hub.rotation[y]', times, valuesY);

    const clip = new THREE.AnimationClip('track_cme', 10, [trackX, trackY]);

    return { group, animationClips: [clip] };
}
