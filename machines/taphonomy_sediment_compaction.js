export function createSedimentCompaction(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Shell
    const shellGeometry = new THREE.SphereGeometry(1, 16, 16);
    shellGeometry.scale(1, 0.5, 1);
    const shellMaterial = new THREE.MeshStandardMaterial({ color: 0xffe4c4 });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    group.add(shell);

    // Sediment layers above and below
    const layerGeo = new THREE.BoxGeometry(5, 2, 5);
    const layerMat1 = new THREE.MeshStandardMaterial({ color: 0xcd853f, transparent: true, opacity: 0.8 });
    const layerMat2 = new THREE.MeshStandardMaterial({ color: 0xdeb887, transparent: true, opacity: 0.8 });
    
    const layerBottom = new THREE.Mesh(layerGeo, layerMat1);
    layerBottom.position.y = -1.5;
    group.add(layerBottom);

    const layerTop = new THREE.Mesh(layerGeo, layerMat2);
    layerTop.position.y = 1.5;
    group.add(layerTop);

    // Animation: Compaction
    const shellScaleTrack = new THREE.VectorKeyframeTrack('.children[0].scale', [0, 5], [1, 1, 1, 1, 0.2, 1]);
    const topLayerPosTrack = new THREE.VectorKeyframeTrack('.children[2].position', [0, 5], [0, 1.5, 0, 0, 0.5, 0]);
    const topLayerScaleTrack = new THREE.VectorKeyframeTrack('.children[2].scale', [0, 5], [1, 1, 1, 1, 0.5, 1]);
    const bottomLayerPosTrack = new THREE.VectorKeyframeTrack('.children[1].position', [0, 5], [0, -1.5, 0, 0, -0.5, 0]);
    const bottomLayerScaleTrack = new THREE.VectorKeyframeTrack('.children[1].scale', [0, 5], [1, 1, 1, 1, 0.5, 1]);

    const clip = new THREE.AnimationClip('Compaction', 5, [shellScaleTrack, topLayerPosTrack, topLayerScaleTrack, bottomLayerPosTrack, bottomLayerScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
