export function createDrugMetabolismModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // CYP450 Enzyme
    const enzymeGeo = new THREE.DodecahedronGeometry(2);
    const enzymeMat = new THREE.MeshStandardMaterial({ color: 0xcc8800, roughness: 0.8 });
    const enzyme = new THREE.Mesh(enzymeGeo, enzymeMat);
    group.add(enzyme);

    // Drug Molecule
    const drugGeo = new THREE.TetrahedronGeometry(0.5);
    const drugMat = new THREE.MeshStandardMaterial({ color: 0x00ccff });
    const drug = new THREE.Mesh(drugGeo, drugMat);
    drug.position.set(-4, 0, 0);
    drug.name = 'drug';
    group.add(drug);

    // Metabolite (hidden initially)
    const metaboliteGeo = new THREE.TetrahedronGeometry(0.3);
    const metaboliteMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
    const metabolite1 = new THREE.Mesh(metaboliteGeo, metaboliteMat);
    const metabolite2 = new THREE.Mesh(metaboliteGeo, metaboliteMat);
    metabolite1.position.set(0, 0, 0);
    metabolite2.position.set(0, 0, 0);
    metabolite1.name = 'metabolite1';
    metabolite2.name = 'metabolite2';
    // scale to 0 initially
    metabolite1.scale.set(0,0,0);
    metabolite2.scale.set(0,0,0);
    group.add(metabolite1);
    group.add(metabolite2);

    // Animation
    const times = [0, 1.5, 3];
    const drugPosValues = [-4, 0, 0, 0, 0, 0, 0, 0, 0];
    const drugScaleValues = [1,1,1, 1,1,1, 0,0,0]; // disappears
    
    const met1PosValues = [0,0,0, 0,0,0, 3, 2, 0];
    const met1ScaleValues = [0,0,0, 0,0,0, 1,1,1];
    
    const met2PosValues = [0,0,0, 0,0,0, 3, -2, 0];
    const met2ScaleValues = [0,0,0, 0,0,0, 1,1,1];

    const clip = new THREE.AnimationClip('MetabolizeAction', 3, [
        new THREE.VectorKeyframeTrack('drug.position', times, drugPosValues),
        new THREE.VectorKeyframeTrack('drug.scale', times, drugScaleValues),
        new THREE.VectorKeyframeTrack('metabolite1.position', times, met1PosValues),
        new THREE.VectorKeyframeTrack('metabolite1.scale', times, met1ScaleValues),
        new THREE.VectorKeyframeTrack('metabolite2.position', times, met2PosValues),
        new THREE.VectorKeyframeTrack('metabolite2.scale', times, met2ScaleValues)
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
