export function createBlockchainLedger(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const blockGeometry = new THREE.BoxGeometry(2, 2, 2);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x2244ff, transparent: true, opacity: 0.9, roughness: 0.1 });
    
    const linkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const linkMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });

    for (let i = 0; i < 4; i++) {
        const block = new THREE.Mesh(blockGeometry, blockMaterial);
        block.position.set(-4.5 + i * 3, 0, 0);
        block.name = `Block${i}`;
        group.add(block);

        if (i < 3) {
            const link = new THREE.Mesh(linkGeometry, linkMaterial);
            link.rotation.z = Math.PI / 2;
            link.position.set(-3 + i * 3, 0, 0);
            group.add(link);
        }
    }

    // Animation: new block added / glowing
    const scaleValues = [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1];
    
    const tracks = [];
    for (let i=0; i<4; i++) {
        const track = new THREE.VectorKeyframeTrack(`Block${i}.scale`, [i*0.5, i*0.5+0.5, i*0.5+1], scaleValues);
        tracks.push(track);
    }
    
    const clip = new THREE.AnimationClip('BlockMining', 3, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
