export function createNormalDistribution(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    // Gaussian function
    function gaussian(x, z, sigma) {
        const d = Math.sqrt(x*x + z*z);
        return Math.exp(-(d*d) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
    }
    
    const size = 10;
    const segments = 50;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Lay flat
    
    const basePositions = new Float32Array(geometry.attributes.position.array);
    
    const material = new THREE.MeshStandardMaterial({
        color: 0x3399ff,
        wireframe: true,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    
    const sigma1 = 1.0;
    const sigma2 = 2.0;
    const sigma3 = 0.5;
    
    const pos1 = new Float32Array(basePositions.length);
    const pos2 = new Float32Array(basePositions.length);
    const pos3 = new Float32Array(basePositions.length);
    
    for (let i = 0; i < basePositions.length; i += 3) {
        const x = basePositions[i];
        const z = basePositions[i+2];
        pos1[i] = x; pos1[i+2] = z; pos1[i+1] = gaussian(x, z, sigma1) * 5;
        pos2[i] = x; pos2[i+2] = z; pos2[i+1] = gaussian(x, z, sigma2) * 5;
        pos3[i] = x; pos3[i+2] = z; pos3[i+1] = gaussian(x, z, sigma3) * 5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
    geometry.morphAttributes.position = [];
    geometry.morphAttributes.position[0] = new THREE.BufferAttribute(pos2, 3);
    geometry.morphAttributes.position[1] = new THREE.BufferAttribute(pos3, 3);
    
    mesh.updateMorphTargets();
    
    const track1 = new THREE.NumberKeyframeTrack('.morphTargetInfluences[0]', [0, 2, 4, 6], [0, 1, 0, 0]);
    const track2 = new THREE.NumberKeyframeTrack('.morphTargetInfluences[1]', [0, 2, 4, 6, 8], [0, 0, 0, 1, 0]);
    
    const clip = new THREE.AnimationClip('sigmaAnimation', 8, [track1, track2]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
