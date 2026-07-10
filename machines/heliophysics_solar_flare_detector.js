export function createSolarFlareDetector(THREE) {
    const group = new THREE.Group();

    // Detector Base
    const baseGeo = new THREE.BoxGeometry(4, 1, 4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.6 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Lenses
    const lensContainer = new THREE.Group();
    lensContainer.name = 'LensContainer';
    lensContainer.position.y = 2;
    group.add(lensContainer);

    const lensGeo = new THREE.CylinderGeometry(0.8, 1, 2, 32);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0xff3300, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.8 });
    
    const lens1 = new THREE.Mesh(lensGeo, lensMat);
    lens1.position.x = 1;
    lensContainer.add(lens1);

    const lens2 = new THREE.Mesh(lensGeo, lensMat);
    lens2.position.x = -1;
    lensContainer.add(lens2);

    // Animation: Pulsing Lenses
    const times = [0, 1, 2];
    const scaleValues = [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1];
    const track1 = new THREE.VectorKeyframeTrack('LensContainer.scale', times, scaleValues);
    
    const clip = new THREE.AnimationClip('detect_flare', 2, [track1]);

    return { group, animationClips: [clip] };
}
