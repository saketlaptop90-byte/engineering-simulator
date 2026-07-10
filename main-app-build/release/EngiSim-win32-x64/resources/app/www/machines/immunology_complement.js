export function createComplementSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pathogen Membrane
    const membraneGeo = new THREE.PlaneGeometry(15, 15);
    const membraneMat = new THREE.MeshStandardMaterial({
        color: 0xff6347,
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    const membrane = new THREE.Mesh(membraneGeo, membraneMat);
    membrane.rotation.x = -Math.PI / 2;
    group.add(membrane);

    // MAC (Membrane Attack Complex) pore formation
    const poreGeo = new THREE.TorusGeometry(2, 0.5, 16, 32);
    const poreMat = new THREE.MeshStandardMaterial({
        color: 0x4682b4,
        roughness: 0.3,
        metalness: 0.5
    });
    const pore = new THREE.Mesh(poreGeo, poreMat);
    pore.rotation.x = Math.PI / 2;
    pore.position.y = 5;
    group.add(pore);

    // Animation
    const times = [0, 2];
    const yValues = [5, 0];

    const posTrack = new THREE.NumberKeyframeTrack(
        pore.uuid + '.position[y]', times, yValues
    );

    const clip = new THREE.AnimationClip('MAC_Formation', 2, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
