export function createGaltonBoard(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const rows = 10;
    const pegGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
    const pegMat = new THREE.MeshStandardMaterial({color: 0x888888});
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= r; c++) {
            const peg = new THREE.Mesh(pegGeo, pegMat);
            peg.position.set(c - r/2, -r, 0);
            peg.rotation.x = Math.PI / 2;
            group.add(peg);
        }
    }
    
    const numBalls = 50;
    const ballGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({color: 0xff4444});
    
    for (let b = 0; b < numBalls; b++) {
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.name = `ball${b}`;
        group.add(ball);
        
        let x = 0;
        let y = 1;
        
        const bTimes = [];
        const bValues = [];
        
        const startDelay = b * 0.2;
        bTimes.push(0 + startDelay);
        bValues.push(x, y, 0);
        
        for (let r = 0; r < rows; r++) {
            bTimes.push(startDelay + (r+1) * 0.3);
            x += (Math.random() < 0.5 ? -0.5 : 0.5);
            y -= 1;
            bValues.push(x, y, 0);
        }
        bTimes.push(startDelay + rows * 0.3 + 1);
        bValues.push(x, y, 0);
        
        const track = new THREE.VectorKeyframeTrack(`${ball.name}.position`, bTimes, bValues);
        const clip = new THREE.AnimationClip(`fall${b}`, -1, [track]);
        animationClips.push(clip);
    }
    
    return { group, animationClips };
}
