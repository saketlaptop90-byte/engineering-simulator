export function createPseudosphere(THREE) {
    const group = new THREE.Group();

    const uSegments = 64;
    const vSegments = 64;
    
    const vertices = [];
    const indices = [];
    const uvs = [];

    // Parametric limits
    const uMin = 0;
    const uMax = Math.PI * 2;
    // v should be in (0, pi/2), avoid exactly 0 to prevent ln(0)
    const vMin = 0.05;
    const vMax = Math.PI / 2;

    for (let i = 0; i <= uSegments; i++) {
        const u = uMin + (i / uSegments) * (uMax - uMin);
        
        for (let j = 0; j <= vSegments; j++) {
            const v = vMin + (j / vSegments) * (vMax - vMin);

            const x = Math.cos(u) * Math.sin(v);
            const y = Math.sin(u) * Math.sin(v);
            const z = Math.cos(v) + Math.log(Math.tan(v / 2));

            // Scale it up a bit
            const scale = 3;
            vertices.push(x * scale, y * scale, z * scale);
            uvs.push(i / uSegments, j / vSegments);
        }
    }

    for (let i = 0; i < uSegments; i++) {
        for (let j = 0; j < vSegments; j++) {
            const a = i * (vSegments + 1) + j;
            const b = i * (vSegments + 1) + j + 1;
            const c = (i + 1) * (vSegments + 1) + j;
            const d = (i + 1) * (vSegments + 1) + j + 1;

            // Two triangles per quad
            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Use a visually striking material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        wireframe: false
    });
    
    // Grid wireframe layer for technical look
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'PseudosphereMesh';
    mesh.add(wireframe);
    
    // Group it so we can rotate the whole structure nicely
    // It's oriented along the Z axis, let's rotate it to face Y
    group.rotation.x = -Math.PI / 2;
    group.add(mesh);

    // Animation: Rotate elegantly
    const duration = 20;
    const numFrames = 100;
    const times = [];
    const quatValues = [];

    const axis = new THREE.Vector3(0, 0, 1).normalize();

    for (let i = 0; i <= numFrames; i++) {
        const t = i / numFrames;
        times.push(t * duration);

        const angle = t * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        quatValues.push(q.x, q.y, q.z, q.w);
    }

    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        mesh.name + '.quaternion',
        times,
        quatValues
    );

    const clip = new THREE.AnimationClip('PseudosphereRotation', duration, [rotationTrack]);

    return { group, animationClips: [clip] };
}
