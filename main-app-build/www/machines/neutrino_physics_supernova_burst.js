export function createSupernovaNeutrinoBurst(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Star Core
    const coreGeo = new THREE.SphereGeometry(2, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffaaaa });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = "StarCore";
    group.add(core);

    // Shockwave (Supernova)
    const waveGeo = new THREE.SphereGeometry(2.1, 32, 32);
    const waveMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.name = "Shockwave";
    group.add(wave);

    // Neutrino Burst
    const burstGroup = new THREE.Group();
    burstGroup.name = "BurstGroup";
    const nGeo = new THREE.SphereGeometry(0.1, 4, 4);
    const nMat = new THREE.MeshStandardMaterial({ color: 0xaaaaff, emissive: 0xaaaaff });
    
    for(let i=0; i<100; i++) {
        const phi = Math.acos( - 1 + ( 2 * i ) / 100 );
        const theta = Math.sqrt( 100 * Math.PI ) * phi;
        
        const n = new THREE.Mesh(nGeo, nMat);
        n.position.set(
            Math.cos( theta ) * Math.sin( phi ),
            Math.sin( theta ) * Math.sin( phi ),
            Math.cos( phi )
        );
        burstGroup.add(n);
    }
    group.add(burstGroup);

    // Animations
    const waveScaleTrack = new THREE.VectorKeyframeTrack('Shockwave.scale', [0, 1, 3], [1,1,1, 1.2,1.2,1.2, 10,10,10]);
    
    const burstScaleTrack = new THREE.VectorKeyframeTrack('BurstGroup.scale', [0, 0.5, 2.5], [1,1,1, 1,1,1, 15,15,15]);
    const coreScaleTrack = new THREE.VectorKeyframeTrack('StarCore.scale', [0, 1, 1.2], [1,1,1, 0.1,0.1,0.1, 0.05,0.05,0.05]);

    const clip = new THREE.AnimationClip('Supernova', 3, [waveScaleTrack, burstScaleTrack, coreScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
