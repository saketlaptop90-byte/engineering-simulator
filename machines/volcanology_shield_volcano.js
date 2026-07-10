export function createShieldVolcano(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base of the shield volcano (wide and flat)
    const baseGeometry = new THREE.ConeGeometry(8, 2, 64);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.85 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1;
    group.add(base);

    // Central vent
    const ventGeometry = new THREE.CylinderGeometry(1.5, 2, 0.2, 32);
    const ventMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const vent = new THREE.Mesh(ventGeometry, ventMaterial);
    vent.position.y = 2.1;
    group.add(vent);

    // Lava lake
    const lakeGeometry = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 32);
    const lakeMaterial = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff2200 });
    const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
    lake.position.y = 2.2;
    group.add(lake);

    // Animation for lava lake bubbling (scale)
    const trackName = lake.uuid + '.scale';
    const times = [0, 1, 2];
    const values = [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('LavaLakeBubble', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
