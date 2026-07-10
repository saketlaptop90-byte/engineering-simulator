export function createQGPExpansion(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const particles = new THREE.Group();
    particles.name = 'QGP_Particles';
    group.add(particles);

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0x00ffff, 0xff00ff, 0xffff00]; 
    
    for (let i = 0; i < 300; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const mat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.6,
            roughness: 0.1,
            metalness: 0.8
        });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 16, 16), mat);
        
        // Distribute in a dense sphere
        const r = Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        mesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        mesh.name = `Particle_${i}`;
        particles.add(mesh);
    }

    const times = [0, 5, 10];
    const valuesScale = [1, 1, 1, 6, 6, 6, 12, 12, 12];
    const scaleTrack = new THREE.VectorKeyframeTrack('QGP_Particles.scale', times, valuesScale);
    const rotationTrack = new THREE.QuaternionKeyframeTrack('QGP_Particles.quaternion', times, [
        0, 0, 0, 1,
        0, 1, 0, 0,
        0, 0, 0, -1
    ]);

    const clip = new THREE.AnimationClip('ExpandQGP', 10, [scaleTrack, rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
