export function createCentralLimitTheorem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const numBins = 20;
    const binWidth = 0.4;
    const bins = [];
    
    for (let i = 0; i < numBins; i++) {
        const geo = new THREE.BoxGeometry(binWidth, 1, binWidth);
        geo.translate(0, 0.5, 0); 
        const mat = new THREE.MeshStandardMaterial({color: 0xffaa00});
        const bin = new THREE.Mesh(geo, mat);
        bin.position.set((i - numBins/2) * (binWidth + 0.1), 0, 0);
        bin.scale.y = 0.01;
        bin.name = `bin${i}`;
        group.add(bin);
        bins.push(bin);
    }
    
    const targetHeights = [];
    const mu = numBins / 2;
    const sigma = numBins / 6;
    for (let i = 0; i < numBins; i++) {
        const x = i;
        const h = Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2))) * 10;
        targetHeights.push(Math.max(h, 0.01));
    }
    
    const times = [0, 5];
    for (let i = 0; i < numBins; i++) {
        const values = [
            1, 0.01, 1,
            1, targetHeights[i], 1
        ];
        const track = new THREE.VectorKeyframeTrack(`bin${i}.scale`, times, values);
        const clip = new THREE.AnimationClip(`binAnim${i}`, 5, [track]);
        animationClips.push(clip);
    }
    
    return { group, animationClips };
}
