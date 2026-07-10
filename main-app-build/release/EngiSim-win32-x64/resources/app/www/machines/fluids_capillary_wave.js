export function createCapillaryWave(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const segments = 100;
    const size = 20;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshPhysicalMaterial({
        color: 0x0044ff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.33,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const dummy = new THREE.Object3D();
    const track = new THREE.NumberKeyframeTrack('.position[x]', [0, 10], [0, 10]);
    const clip = new THREE.AnimationClip('CapillaryAnim', 10, [track]);
    animationClips.push(clip);

    // Save original vertices
    const posAttribute = geometry.attributes.position;
    const originals = new Float32Array(posAttribute.array.length);
    originals.set(posAttribute.array);

    group.userData.update = (dt, time) => {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = originals[i];
            const z = originals[i + 2];
            
            const dist = Math.sqrt(x*x + z*z);
            // High frequency capillary wave
            let y = Math.sin(dist * 8.0 - time * 10.0) * Math.exp(-dist * 0.2) * 0.2;
            
            // Add some noise or secondary ripples
            y += Math.sin(x * 5.0 - time * 6.0) * Math.cos(z * 5.0 - time * 6.0) * 0.05;
            
            positions[i + 1] = y;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    };

    return { group, animationClips };
}
