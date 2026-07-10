export function createHeliosphericImager(THREE) {
    const group = new THREE.Group();

    // Main Body
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 5, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Aperture
    const apertureGeo = new THREE.ConeGeometry(1.5, 2, 32);
    const apertureMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    const aperture = new THREE.Mesh(apertureGeo, apertureMat);
    aperture.position.x = 3.5;
    aperture.rotation.z = -Math.PI / 2;
    group.add(aperture);

    // Solar Panels
    const panelGroup = new THREE.Group();
    panelGroup.name = 'Panels';
    group.add(panelGroup);

    const panelGeo = new THREE.BoxGeometry(4, 0.1, 2);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x002288, metalness: 0.9, roughness: 0.2 });
    
    const panel1 = new THREE.Mesh(panelGeo, panelMat);
    panel1.position.y = 1;
    panelGroup.add(panel1);

    const panel2 = new THREE.Mesh(panelGeo, panelMat);
    panel2.position.y = -1;
    panelGroup.add(panel2);

    const times = [0, 20];
    const values = [0, Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack('Panels.rotation[x]', times, values);

    const clip = new THREE.AnimationClip('track_sun', 20, [track]);

    return { group, animationClips: [clip] };
}
