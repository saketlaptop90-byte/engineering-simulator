export function createNeuronSynapse(THREE) {
    const group = new THREE.Group();
    
    // Axon terminal
    const terminalGeo = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const terminalMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, transparent: true, opacity: 0.8 });
    const terminal = new THREE.Mesh(terminalGeo, terminalMat);
    terminal.rotation.x = Math.PI;
    terminal.position.y = 2;
    group.add(terminal);

    // Dendrite spine
    const dendriteGeo = new THREE.BoxGeometry(4, 1, 4);
    const dendriteMat = new THREE.MeshStandardMaterial({ color: 0xe24a4a });
    const dendrite = new THREE.Mesh(dendriteGeo, dendriteMat);
    dendrite.position.y = -1;
    group.add(dendrite);

    // Vesicles
    const vesicles = new THREE.Group();
    const vesGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const vesMat = new THREE.MeshStandardMaterial({ color: 0xe2e24a });
    for (let i = 0; i < 10; i++) {
        const ves = new THREE.Mesh(vesGeo, vesMat);
        ves.position.set((Math.random() - 0.5) * 2, 2.5 + Math.random() * 1.5, (Math.random() - 0.5) * 2);
        vesicles.add(ves);
    }
    group.add(vesicles);

    const animationClips = [];

    // Animation for vesicles moving down
    const times = [0, 2, 4];
    const values = [0, 0, 0,  0, -1, 0,  0, 0, 0];
    const positionTrack = new THREE.VectorKeyframeTrack(`${vesicles.uuid}.position`, times, values);
    const clip = new THREE.AnimationClip('SynapseRelease', 4, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
