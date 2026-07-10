export function createReceptorBindingModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Membrane
    const membraneGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const membraneMat = new THREE.MeshStandardMaterial({ color: 0x88aa88, transparent: true, opacity: 0.6 });
    const membrane = new THREE.Mesh(membraneGeo, membraneMat);
    group.add(membrane);

    // Receptor
    const receptorGeo = new THREE.CylinderGeometry(1, 1.5, 3, 16);
    const receptorMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, wireframe: false });
    const receptor = new THREE.Mesh(receptorGeo, receptorMat);
    receptor.position.y = 0;
    group.add(receptor);

    // Ligand
    const ligandGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const ligandMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const ligand = new THREE.Mesh(ligandGeo, ligandMat);
    ligand.position.set(0, 4, 0);
    ligand.name = 'ligand';
    group.add(ligand);

    // Animation: Ligand moving down to bind to receptor
    const times = [0, 2, 4];
    const values = [
        0, 4, 0,
        0, 1.5, 0,
        0, 4, 0
    ];
    const ligandTrack = new THREE.VectorKeyframeTrack('ligand.position', times, values);
    const clip = new THREE.AnimationClip('BindAction', 4, [ligandTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
