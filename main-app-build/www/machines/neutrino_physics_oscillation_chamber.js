export function createOscillationChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Chamber
    const chamberGeo = new THREE.SphereGeometry(4, 32, 32);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.4, wireframe: true });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.y = 5;
    group.add(chamber);

    // Particles (Neutrinos)
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const electronMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 });
    const muonMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00 });
    const tauMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000aa });

    const p1 = new THREE.Mesh(particleGeo, electronMat);
    const p2 = new THREE.Mesh(particleGeo, muonMat);
    const p3 = new THREE.Mesh(particleGeo, tauMat);

    chamber.add(p1, p2, p3);

    // Animation: Particles moving and changing materials (simulated by having them orbit)
    // We'll create a simple rotation animation to show dynamic oscillation
    const trackName = '.rotation[y]';
    const times = [0, 2, 4];
    const values = [0, Math.PI, Math.PI * 2];
    
    const rotationTrack = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Oscillation', 4, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
