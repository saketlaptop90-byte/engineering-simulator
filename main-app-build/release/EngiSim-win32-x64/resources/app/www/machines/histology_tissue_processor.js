export function createHistologyTissueProcessor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main body
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Carousel head
    const headGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.2, 0);
    group.add(head);

    // Baskets
    for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const basketGeo = new THREE.BoxGeometry(0.3, 0.6, 0.3);
        const basketMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const basket = new THREE.Mesh(basketGeo, basketMat);
        basket.position.set(Math.cos(angle) * 1.0, -0.4, Math.sin(angle) * 1.0);
        head.add(basket);
    }

    // Animation (Carousel Rotation)
    const times = [0, 5, 10];
    const values = [0, Math.PI, 2 * Math.PI];
    const rotationTrack = new THREE.NumberKeyframeTrack('.rotation[y]', times, values);
    const clip = new THREE.AnimationClip('RotateCarousel', 10, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
