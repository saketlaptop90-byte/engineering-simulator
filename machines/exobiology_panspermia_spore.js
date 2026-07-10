export function createPanspermiaSpore(THREE) {
    const group = new THREE.Group();
    
    const coreGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        roughness: 0.9,
        metalness: 0.2
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    // Spikes (radiation shielding)
    for(let i=0; i<50; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.2, 2, 8);
        const spikeMat = new THREE.MeshStandardMaterial({
            color: 0x4400aa,
            roughness: 0.5,
            metalness: 0.8
        });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        
        const phi = Math.acos(-1 + (2 * i) / 50);
        const theta = Math.sqrt(50 * Math.PI) * phi;
        
        spike.position.setFromSphericalCoords(1.5, phi, theta);
        spike.lookAt(0,0,0);
        spike.rotateX(Math.PI / 2);
        core.add(spike);
    }
    
    // Animation - slow rotation
    const times = [0, 5, 10];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI*2, 0));
    const rotTrack = new THREE.QuaternionKeyframeTrack('.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ]);
    
    const clip = new THREE.AnimationClip('drift', 10, [rotTrack]);
    
    return { group, animationClips: [clip] };
}
