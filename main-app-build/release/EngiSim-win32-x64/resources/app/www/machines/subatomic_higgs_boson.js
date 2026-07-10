export function createHiggsBosonInteraction(THREE) {
    const group = new THREE.Group();
    group.name = "HiggsInteractionGroup";
    const animationClips = [];

    // The Higgs Field represented as a dynamic grid or plane
    const gridGeo = new THREE.PlaneGeometry(30, 30, 30, 30);
    const gridMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.15,
        blending: THREE.AdditiveBlending 
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    group.add(grid);

    // Particle gaining mass
    const pGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const pMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0x00ccff, emissiveIntensity: 1.5, roughness: 0.1 });
    const particle = new THREE.Mesh(pGeo, pMat);
    particle.name = "massParticle";
    particle.position.y = 1.2;
    group.add(particle);

    // Ripples representing interaction with the Higgs field
    const rippleGeo = new THREE.TorusGeometry(1, 0.05, 16, 100);
    const rippleMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    
    const r1 = new THREE.Mesh(rippleGeo, rippleMat);
    r1.name = "ripple1";
    r1.rotation.x = -Math.PI / 2;
    group.add(r1);

    const r2 = new THREE.Mesh(rippleGeo, rippleMat);
    r2.name = "ripple2";
    r2.rotation.x = -Math.PI / 2;
    group.add(r2);

    // Animations
    const times = [0, 1, 2, 3, 4];
    
    // Particle bobbing and gaining mass (scaling)
    const pTrackPos = new THREE.VectorKeyframeTrack('massParticle.position', times, [0,1.2,0, 0,2.5,0, 0,1.2,0, 0,2.5,0, 0,1.2,0]);
    const pTrackScale = new THREE.VectorKeyframeTrack('massParticle.scale', times, [1,1,1, 1.3,1.3,1.3, 1,1,1, 1.3,1.3,1.3, 1,1,1]);

    // Ripple expanding across the field
    const r1Scale = new THREE.VectorKeyframeTrack('ripple1.scale', times, [0.1,0.1,0.1, 8,8,8, 15,15,15, 0.1,0.1,0.1, 8,8,8]);
    const r2Scale = new THREE.VectorKeyframeTrack('ripple2.scale', times, [8,8,8, 15,15,15, 0.1,0.1,0.1, 8,8,8, 15,15,15]);

    const clip = new THREE.AnimationClip('HiggsMechanism', 4, [pTrackPos, pTrackScale, r1Scale, r2Scale]);
    animationClips.push(clip);

    return { group, animationClips };
}
