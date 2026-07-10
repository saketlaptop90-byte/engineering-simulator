export function createAntineutrinoReactor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Reactor Core
    const coreGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.5 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Fuel rods
    const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 7, 8);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00 });
    
    for(let i=0; i<6; i++) {
        const angle = (i/6)*Math.PI*2;
        const rod = new THREE.Mesh(rodGeo, rodMat);
        rod.position.set(Math.cos(angle)*1, 0, Math.sin(angle)*1);
        core.add(rod);
    }

    // Antineutrino emissions
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff });
    
    const pGroup = new THREE.Group();
    pGroup.name = "EmissionGroup";
    
    for(let i=0; i<20; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.position.set(
            (Math.random()-0.5)*10,
            (Math.random()-0.5)*10,
            (Math.random()-0.5)*10
        );
        pGroup.add(p);
    }
    group.add(pGroup);

    const scaleTrack = new THREE.VectorKeyframeTrack('EmissionGroup.scale', [0, 1, 2], [0,0,0, 2,2,2, 4,4,4]);
    
    const clip = new THREE.AnimationClip('Emissions', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
