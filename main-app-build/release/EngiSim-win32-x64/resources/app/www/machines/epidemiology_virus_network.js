export function createVirusSpreadingNetwork(THREE) {
    const group = new THREE.Group();
    
    const nodeGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const matHealthy = new THREE.MeshStandardMaterial({ color: 0x95a5a6, metalness: 0.2, roughness: 0.8 });
    const matInfected = new THREE.MeshStandardMaterial({ color: 0xc0392b, metalness: 0.2, roughness: 0.8 });

    const nodes = [];
    // Patient Zero
    const p0 = new THREE.Mesh(nodeGeo, matInfected);
    p0.position.set(0, 4, 0);
    group.add(p0);
    nodes.push(p0);

    // Level 1
    for(let i=0; i<3; i++) {
        const p = new THREE.Mesh(nodeGeo, matHealthy);
        p.position.set((i-1)*2, 2, 0);
        group.add(p);
        nodes.push({mesh: p, parent: p0, timeOffset: 1 + i*0.5});
    }

    // Add connecting lines (edges)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xbdc3c7 });
    nodes.forEach(n => {
        if (n.parent) {
            const pts = [n.parent.position, n.mesh.position];
            const lGeo = new THREE.BufferGeometry().setFromPoints(pts);
            const line = new THREE.Line(lGeo, lineMat);
            group.add(line);
        }
    });

    // We can't animate materials easily with VectorKeyframeTrack, 
    // so let's animate the scale of the nodes to represent them getting infected (pulsing)
    const tracks = [];
    nodes.forEach((n, idx) => {
        if (idx === 0) return; // skip p0
        n.mesh.name = `node${idx}`;
        const t = n.timeOffset;
        const times = [0, t, t+0.5, t+1, 6];
        const values = [1,1,1,  1,1,1,  1.5,1.5,1.5,  1,1,1,  1,1,1];
        const track = new THREE.VectorKeyframeTrack(`${n.mesh.name}.scale`, times, values);
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('Spread', 6, tracks);

    return { group, animationClips: [clip] };
}
