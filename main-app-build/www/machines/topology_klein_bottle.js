export function createKleinBottle(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const radialSegments = 100;
    const tubularSegments = 50;
    const vertices = [];
    const indices = [];
    const uvs = [];

    for (let i = 0; i <= radialSegments; i++) {
        const u = (i / radialSegments) * Math.PI * 2;
        for (let j = 0; j <= tubularSegments; j++) {
            const v = (j / tubularSegments) * Math.PI * 2;
            const r = 2;
            const x = (r + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v)) * Math.cos(u);
            const y = (r + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v)) * Math.sin(u);
            const z = Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v);
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

    const material = new THREE.MeshPhysicalMaterial({
        color: 0x9b59b6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const tracks = [];
    const times = [0, 10];
    const values = [0, 0, 0, 0, Math.PI * 2, 0];
    const rotationTrack = new THREE.VectorKeyframeTrack('.rotation', times, values);
    tracks.push(rotationTrack);

    const clip = new THREE.AnimationClip('KleinRotation', 10, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
