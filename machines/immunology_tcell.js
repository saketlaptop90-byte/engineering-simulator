export function createTCellActivation(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // T-Cell
    const tCellGeo = new THREE.DodecahedronGeometry(4);
    const tCellMat = new THREE.MeshStandardMaterial({
        color: 0x1e90ff,
        roughness: 0.5,
        metalness: 0.1
    });
    const tCell = new THREE.Mesh(tCellGeo, tCellMat);
    tCell.position.set(-5, 0, 0);
    group.add(tCell);

    // APC (Antigen Presenting Cell)
    const apcGeo = new THREE.SphereGeometry(6, 16, 16);
    const apcMat = new THREE.MeshStandardMaterial({
        color: 0xffb6c1,
        roughness: 0.8,
        metalness: 0.1
    });
    const apc = new THREE.Mesh(apcGeo, apcMat);
    apc.position.set(5, 0, 0);
    group.add(apc);

    // Cytokines
    const cytokineGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const cytokineMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
    });

    const cytokines = new THREE.Group();
    for(let i=0; i<10; i++) {
        const c = new THREE.Mesh(cytokineGeo, cytokineMat);
        c.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2);
        cytokines.add(c);
    }
    cytokines.position.set(0, 0, 0);
    cytokines.scale.set(0.1, 0.1, 0.1);
    group.add(cytokines);

    // Animation
    const times = [0, 1, 3];
    const scaleValues = [
        0,0,0,
        0,0,0,
        5,5,5
    ];
    
    const scaleTrack = new THREE.VectorKeyframeTrack(
        cytokines.uuid + '.scale', times, scaleValues
    );

    const clip = new THREE.AnimationClip('Activation', 3, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
