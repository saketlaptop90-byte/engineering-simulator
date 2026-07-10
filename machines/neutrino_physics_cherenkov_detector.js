export function createCherenkovDetector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tank
    const tankGeo = new THREE.CylinderGeometry(8, 8, 12, 32, 1, true);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide, metalness: 0.9, roughness: 0.1 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    group.add(tank);

    // Water
    const waterGeo = new THREE.CylinderGeometry(7.9, 7.9, 11.9, 32);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x001155, transparent: true, opacity: 0.8 });
    const water = new THREE.Mesh(waterGeo, waterMat);
    group.add(water);

    // Photomultiplier tubes (PMTs)
    const pmtGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const pmtMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, emissive: 0x222222 });
    
    for(let y = -5; y <= 5; y += 2) {
        for(let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const pmt = new THREE.Mesh(pmtGeo, pmtMat);
            pmt.position.set(Math.cos(angle) * 7.5, y, Math.sin(angle) * 7.5);
            group.add(pmt);
        }
    }

    // Cherenkov Cone
    const coneGeo = new THREE.ConeGeometry(3, 6, 32, 1, true);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(0, 0, 0);
    cone.rotation.x = Math.PI / 2;
    cone.name = "CherenkovCone";
    group.add(cone);

    const times = [0, 1, 2];
    const posValues = [0, -6, 0, 0, 0, 0, 0, 6, 0];
    
    // Scale animation
    const scaleTimes = [0, 1, 2];
    const scaleValues = [0.1, 0.1, 0.1, 1, 1, 1, 0.1, 0.1, 0.1];
    const scaleTrack = new THREE.VectorKeyframeTrack('CherenkovCone.scale', scaleTimes, scaleValues);
    
    const posTrack = new THREE.VectorKeyframeTrack('CherenkovCone.position', times, posValues);

    const clip = new THREE.AnimationClip('ParticlePass', 2, [posTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
