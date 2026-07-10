export function createChondruleFurnace(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Support
    const supportGeo = new THREE.CylinderGeometry(2, 2.5, 1, 32);
    const supportMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.8, roughness: 0.5 });
    const support = new THREE.Mesh(supportGeo, supportMat);
    support.position.y = 0.5;
    group.add(support);

    // Furnace Body (Spherical)
    const bodyGeo = new THREE.SphereGeometry(2, 32, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.4, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 3;
    group.add(body);

    // Viewing Window
    const windowGeo = new THREE.SphereGeometry(1.9, 16, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xaaaaff, metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.6 });
    const window = new THREE.Mesh(windowGeo, windowMat);
    window.rotation.x = Math.PI / 2;
    window.position.set(0, 3, 0.1);
    group.add(window);

    // Chondrule (Inside)
    const chondruleGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const chondruleMat = new THREE.MeshStandardMaterial({ color: 0x884422, metalness: 0.1, roughness: 0.9 });
    // Emissive component for heating animation
    chondruleMat.emissive = new THREE.Color(0x000000);
    const chondrule = new THREE.Mesh(chondruleGeo, chondruleMat);
    chondrule.position.set(0, 3, 1); // Close to window
    group.add(chondrule);

    // Heating Coils
    const coilGeo = new THREE.TorusGeometry(0.8, 0.05, 8, 32);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.3 });
    coilMat.emissive = new THREE.Color(0x000000);
    
    const coil1 = new THREE.Mesh(coilGeo, coilMat.clone());
    coil1.position.set(0, 3, 1);
    coil1.rotation.x = Math.PI / 2;
    group.add(coil1);

    const coil2 = new THREE.Mesh(coilGeo, coilMat.clone());
    coil2.position.set(0, 3, 1);
    coil2.rotation.x = Math.PI / 2;
    coil2.rotation.y = Math.PI / 2;
    group.add(coil2);

    // Animation: Flash Heating
    const duration = 4; // 4 seconds total
    
    // Coil Glow Track (0->1->0)
    const times = [0, 1, 1.5, 3, 4];
    const coilColors = [
        0,0,0,
        1,0.2,0,
        1,0.5,0,
        0.5,0,0,
        0,0,0
    ];
    
    const coilTrack1 = new THREE.ColorKeyframeTrack(`${coil1.uuid}.material.emissive`, times, coilColors);
    const coilTrack2 = new THREE.ColorKeyframeTrack(`${coil2.uuid}.material.emissive`, times, coilColors);

    // Chondrule Melting (Color change to orange/yellow and back)
    const chondruleColors = [
        0,0,0,
        0.5,0.1,0,
        1,0.8,0.2, // Melted peak
        0.5,0.2,0,
        0,0,0
    ];
    const chondruleTrack = new THREE.ColorKeyframeTrack(`${chondrule.uuid}.material.emissive`, times, chondruleColors);

    const clip = new THREE.AnimationClip('FlashHeat', duration, [coilTrack1, coilTrack2, chondruleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
