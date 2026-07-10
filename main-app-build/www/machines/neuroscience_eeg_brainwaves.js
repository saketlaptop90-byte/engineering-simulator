export function createEEGBrainwaves(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Discrete blocks representing wave heights
    const blocks = new THREE.Group();
    const blockGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
    const blockMat = new THREE.MeshStandardMaterial({ color: 0x1abc9c });
    
    const waveBlocks = [];
    for(let i=0; i<20; i++) {
        const block = new THREE.Mesh(blockGeo, blockMat);
        block.position.x = (i - 10) * 0.5;
        blocks.add(block);
        waveBlocks.push(block);
    }
    group.add(blocks);

    const times = [0, 1, 2];
    const tracks = [];
    
    waveBlocks.forEach((block, index) => {
        const h1 = 1 + Math.sin(index * 0.5) * 2;
        const h2 = 1 + Math.sin(index * 0.5 + Math.PI) * 2;
        const h3 = 1 + Math.sin(index * 0.5 + Math.PI * 2) * 2;
        
        const values = [1, h1, 1,  1, h2, 1,  1, h3, 1];
        const scaleTrack = new THREE.VectorKeyframeTrack(`${block.uuid}.scale`, times, values);
        tracks.push(scaleTrack);
    });

    const clip = new THREE.AnimationClip('WaveOscillation', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
