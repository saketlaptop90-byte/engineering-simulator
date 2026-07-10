export function createAmberEntombment(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Insect (represented by a few shapes)
    const insectGroup = new THREE.Group();
    const bodyGeo = new THREE.CapsuleGeometry(0.2, 0.6, 8, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2;
    insectGroup.add(body);
    group.add(insectGroup);

    // Resin droplet
    const resinGeo = new THREE.SphereGeometry(1, 32, 32);
    const resinMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        transparent: true, 
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1
    });
    const resin = new THREE.Mesh(resinGeo, resinMat);
    resin.position.y = 5;
    resin.scale.set(0.5, 0.5, 0.5);
    group.add(resin);

    // Animation: Resin falls, scales up, hardens (color shifts to amber, opacity increases)
    const resinPosTrack = new THREE.VectorKeyframeTrack('.children[1].position', [0, 2, 4], [0, 5, 0, 0, 0, 0, 0, 0, 0]);
    const resinScaleTrack = new THREE.VectorKeyframeTrack('.children[1].scale', [0, 2, 4], [0.5, 0.5, 0.5, 1.5, 1.2, 1.5, 2, 1.5, 2]);
    const resinColorTrack = new THREE.ColorKeyframeTrack('.children[1].material.color', [0, 2, 6], [1, 0.84, 0, 1, 0.84, 0, 0.8, 0.4, 0]); // gold to amber
    const resinOpacityTrack = new THREE.NumberKeyframeTrack('.children[1].material.opacity', [0, 2, 6], [0.4, 0.4, 0.9]);

    const clip = new THREE.AnimationClip('Entombment', 6, [resinPosTrack, resinScaleTrack, resinColorTrack, resinOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
