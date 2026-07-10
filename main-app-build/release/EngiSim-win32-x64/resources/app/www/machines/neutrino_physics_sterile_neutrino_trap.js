export function createSterileNeutrinoTrap(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Magnetic Trap Setup
    const ringGeo = new THREE.TorusGeometry(5, 0.5, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xcc8800, metalness: 1, roughness: 0.2 });
    
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -2;
    group.add(ring2);

    // Central Trap field
    const fieldGeo = new THREE.IcosahedronGeometry(3, 2);
    const fieldMat = new THREE.MeshStandardMaterial({ color: 0x8800ff, transparent: true, opacity: 0.3, wireframe: true });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.name = "TrapField";
    group.add(field);

    // Sterile Neutrino
    const neutrinoGeo = new THREE.DodecahedronGeometry(0.5);
    const neutrinoMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x555555 });
    const neutrino = new THREE.Mesh(neutrinoGeo, neutrinoMat);
    neutrino.name = "SterileNeutrino";
    group.add(neutrino);

    const posTrack = new THREE.VectorKeyframeTrack('SterileNeutrino.position', 
        [0, 1, 2, 3, 4], 
        [0,0,0, 1,1,1, -1,-1,0, 0,0,-1, 0,0,0]
    );
    const rotTrack = new THREE.VectorKeyframeTrack('TrapField.rotation',
        [0, 2, 4],
        [0,0,0, 0,Math.PI,0, 0,Math.PI*2,0]
    );

    const clip = new THREE.AnimationClip('Trapping', 4, [posTrack, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
