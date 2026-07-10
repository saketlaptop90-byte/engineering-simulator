export function createNanoparticleDeliveryModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cell surface
    const cellGeo = new THREE.PlaneGeometry(10, 10);
    const cellMat = new THREE.MeshStandardMaterial({ color: 0xffcccc, side: THREE.DoubleSide });
    const cell = new THREE.Mesh(cellGeo, cellMat);
    cell.rotation.x = Math.PI / 2;
    group.add(cell);

    // Lipid Nanoparticle
    const lnpGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const lnpMat = new THREE.MeshStandardMaterial({ color: 0xccccff, transparent: true, opacity: 0.8 });
    const lnp = new THREE.Mesh(lnpGeo, lnpMat);
    lnp.position.set(0, 5, 0);
    lnp.name = 'lnp';
    group.add(lnp);

    // Payload (mRNA/drug)
    const payloadGeo = new THREE.TorusKnotGeometry(0.4, 0.1, 64, 8);
    const payloadMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const payload = new THREE.Mesh(payloadGeo, payloadMat);
    payload.position.set(0, 5, 0);
    payload.name = 'payload';
    group.add(payload);

    // Animation
    const times = [0, 2, 4, 5];
    const lnpPosValues = [0, 5, 0, 0, 1.5, 0, 0, 0, 0, 0, 0, 0];
    const lnpScaleValues = [1, 1, 1, 1, 1, 1, 2, 0.1, 2, 0, 0, 0]; // squashes and disappears
    const payloadPosValues = [0, 5, 0, 0, 1.5, 0, 0, 0, 0, 0, -2, 0]; // enters cell

    const clip = new THREE.AnimationClip('DeliveryAction', 5, [
        new THREE.VectorKeyframeTrack('lnp.position', times, lnpPosValues),
        new THREE.VectorKeyframeTrack('lnp.scale', times, lnpScaleValues),
        new THREE.VectorKeyframeTrack('payload.position', times, payloadPosValues)
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
