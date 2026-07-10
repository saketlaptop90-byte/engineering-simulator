export function createRNATranscription(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const dnaMat = new THREE.MeshStandardMaterial({ color: 0x2196f3 });
    const rnaMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const enzymeMat = new THREE.MeshStandardMaterial({ color: 0xff9800, transparent: true, opacity: 0.7 });

    const dnaGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const dnaStrand = new THREE.Mesh(dnaGeo, dnaMat);
    dnaStrand.rotation.z = Math.PI / 2;
    group.add(dnaStrand);

    const enzymeGeo = new THREE.TorusGeometry(1, 0.4, 8, 16);
    const enzyme = new THREE.Mesh(enzymeGeo, enzymeMat);
    enzyme.position.x = -4;
    enzyme.rotation.y = Math.PI / 2;
    enzyme.name = "RNAPolymerase";
    group.add(enzyme);

    const rnaGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
    const rnaStrand = new THREE.Mesh(rnaGeo, rnaMat);
    rnaStrand.position.set(-4, -1, 0);
    rnaStrand.rotation.z = Math.PI / 2;
    rnaStrand.name = "RNAStrand";
    group.add(rnaStrand);

    // Animation: Enzyme moving and RNA growing
    const posTrack = new THREE.VectorKeyframeTrack('RNAPolymerase.position', [0, 5], [
        -4, 0, 0,
        4, 0, 0
    ]);
    const rnaPosTrack = new THREE.VectorKeyframeTrack('RNAStrand.position', [0, 5], [
        -4, -1, 0,
        0, -1, 0
    ]);
    const rnaScaleTrack = new THREE.VectorKeyframeTrack('RNAStrand.scale', [0, 5], [
        0.1, 1, 1,
        1, 1, 1
    ]);

    const clip = new THREE.AnimationClip('transcribe', 5, [posTrack, rnaPosTrack, rnaScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
