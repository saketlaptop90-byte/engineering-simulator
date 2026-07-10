export function createSeifertSurface(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const radialSegments = 100;
    const tubularSegments = 30;
    const vertices = [];
    const indices = [];
    
    for (let i = 0; i <= radialSegments; i++) {
        const u = (i / radialSegments) * Math.PI * 2;
        for (let j = 0; j <= tubularSegments; j++) {
            const v = (j / tubularSegments);
            const r = 2 * v;
            const x = r * Math.sin(3 * u) * Math.cos(2 * u);
            const y = r * Math.sin(3 * u) * Math.sin(2 * u);
            const z = r * Math.cos(3 * u);
            vertices.push(x, y, z);
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
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
        color: 0xe74c3c,
        side: THREE.DoubleSide,
        shininess: 100
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const tracks = [];
    const times = [0, 6];
    const values = [0, 0, 0, Math.PI * 2, 0, Math.PI * 2];
    const rotationTrack = new THREE.VectorKeyframeTrack('.rotation', times, values);
    tracks.push(rotationTrack);

    const clip = new THREE.AnimationClip('SeifertRotation', 6, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
