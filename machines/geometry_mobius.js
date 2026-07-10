export function createMobiusStrip(THREE) {
    const group = new THREE.Group();

    const uSegments = 100;
    const vSegments = 20;
    const R = 3;
    const w = 1;

    const vertices = [];
    const indices = [];
    const uvs = [];

    // Generate vertices
    for (let i = 0; i <= uSegments; i++) {
        const u = (i / uSegments) * Math.PI * 2;
        for (let j = 0; j <= vSegments; j++) {
            const v = (j / vSegments) * 2 * w - w; // from -w to w

            const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
            const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
            const z = v * Math.sin(u / 2);

            vertices.push(x, y, z);
            uvs.push(i / uSegments, j / vSegments);
        }
    }

    // Generate indices
    for (let i = 0; i < uSegments; i++) {
        for (let j = 0; j < vSegments; j++) {
            const a = i * (vSegments + 1) + j;
            const b = i * (vSegments + 1) + j + 1;
            const c = (i + 1) * (vSegments + 1) + j;
            const d = (i + 1) * (vSegments + 1) + j + 1;

            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Use double-sided material because Mobius strip has one side
    const material = new THREE.MeshStandardMaterial({
        color: 0xff44aa,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Create a particle that moves along the strip
    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    group.add(particle);

    // Animation for the particle
    const numFrames = 200;
    const duration = 10;
    const times = [];
    const posValues = [];
    
    for (let i = 0; i <= numFrames; i++) {
        const t = i / numFrames;
        times.push(t * duration);
        
        // Travel twice around to complete the loop (4 * PI)
        const u = t * Math.PI * 4; 
        const v = 0; // Travel along the center

        const px = (R + v * Math.cos(u / 2)) * Math.cos(u);
        const py = (R + v * Math.cos(u / 2)) * Math.sin(u);
        const pz = v * Math.sin(u / 2);

        posValues.push(px, py, pz);
    }

    const positionTrack = new THREE.VectorKeyframeTrack(
        particle.name ? particle.name + '.position' : particle.uuid + '.position',
        times,
        posValues
    );

    const clip = new THREE.AnimationClip('ParticleTravel', duration, [positionTrack]);

    return { group, animationClips: [clip] };
}
