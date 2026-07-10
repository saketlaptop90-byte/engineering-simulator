export function createMarkovChain(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const stateGeo = new THREE.SphereGeometry(1, 32, 32);
    
    const states = [
        {pos: new THREE.Vector3(0, 3, 0), color: 0xff3333},
        {pos: new THREE.Vector3(-3, -2, 0), color: 0x33ff33},
        {pos: new THREE.Vector3(3, -2, 0), color: 0x3333ff}
    ];
    
    states.forEach((s, i) => {
        const mat = new THREE.MeshStandardMaterial({color: s.color, transparent: true, opacity: 0.8});
        const mesh = new THREE.Mesh(stateGeo, mat);
        mesh.position.copy(s.pos);
        group.add(mesh);
    });
    
    const numParticles = 30;
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({color: 0xffffff});
    
    for (let i = 0; i < numParticles; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.name = `particle${i}`;
        group.add(p);
        
        const fromIdx = Math.floor(Math.random() * 3);
        let toIdx = Math.floor(Math.random() * 3);
        while (toIdx === fromIdx) {
            toIdx = Math.floor(Math.random() * 3);
        }
        
        const from = states[fromIdx].pos;
        const to = states[toIdx].pos;
        
        const times = [0, 2];
        const values = [
            from.x, from.y, from.z,
            to.x, to.y, to.z
        ];
        
        const track = new THREE.VectorKeyframeTrack(`${p.name}.position`, times, values);
        const clip = new THREE.AnimationClip(`particleAnim${i}`, 2, [track]);
        animationClips.push(clip);
    }
    
    return { group, animationClips };
}
