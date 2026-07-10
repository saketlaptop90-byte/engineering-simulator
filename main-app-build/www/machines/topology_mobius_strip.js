export function createMobiusStrip(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const radialSegments = 100;
    const tubularSegments = 20;
    const vertices = [];
    const indices = [];
    const uvs = [];

    for (let i = 0; i <= radialSegments; i++) {
        const u = (i / radialSegments) * Math.PI * 2;
        for (let j = 0; j <= tubularSegments; j++) {
            const v = ((j / tubularSegments) - 0.5) * 2;
            const r = 2;
            const halfU = u / 2;
            const x = Math.cos(u) * (r + v * Math.cos(halfU));
            const y = Math.sin(u) * (r + v * Math.cos(halfU));
            const z = v * Math.sin(halfU);
            vertices.push(x, y, z);
            uvs.push(i / radialSegments, j / tubularSegments);
        }
    }

    for (let i = 0; i < radialSegments; i++) {
        for (let j = 0; j < tubularSegments; j++) {
            const a = i * (tubularSegments + 1) + j;
            const b = i * (tubularSegments + 1) + j + 1;
            const c = (i + 1) * (tubularSegments + 1) + j;
            const d = (i + 1) * (tubularSegments + 1) + j + 1;
            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        color: 0x3498db,
        side: THREE.DoubleSide,
        metalness: 0.3,
        roughness: 0.4
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const tracks = [];
    const times = [0, 5];
    const values = [0, 0, 0, Math.PI * 2, Math.PI * 2, 0];
    const rotationTrack = new THREE.VectorKeyframeTrack('.rotation', times, values);
    tracks.push(rotationTrack);

    const clip = new THREE.AnimationClip('MobiusRotation', 5, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
