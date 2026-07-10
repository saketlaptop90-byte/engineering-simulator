export function createNestedPlatonicSolids(THREE) {
    const group = new THREE.Group();

    const geometries = [
        new THREE.TetrahedronGeometry(1.0),
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.OctahedronGeometry(2.5),
        new THREE.DodecahedronGeometry(3.5),
        new THREE.IcosahedronGeometry(4.5)
    ];

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    const meshes = [];

    geometries.forEach((geom, index) => {
        const material = new THREE.MeshStandardMaterial({
            color: colors[index],
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(geom, material);
        mesh.name = 'platonic_' + index;
        group.add(mesh);
        meshes.push(mesh);
    });

    // Animation Clips
    const duration = 10;
    const tracks = [];

    meshes.forEach((mesh, index) => {
        const times = [];
        const values = [];
        const numFrames = 60;
        
        // Define an axis of rotation unique to each solid
        const axis = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();

        const speed = (index + 1) * 0.5; // inner ones rotate slower or faster? Let's say outer rotates faster

        for (let i = 0; i <= numFrames; i++) {
            const t = i / numFrames;
            times.push(t * duration);

            const angle = t * Math.PI * 2 * speed;
            const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

            values.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }

        const trackName = (mesh.name ? mesh.name : mesh.uuid) + '.quaternion';
        tracks.push(new THREE.QuaternionKeyframeTrack(trackName, times, values));
    });

    const clip = new THREE.AnimationClip('PlatonicRotation', duration, tracks);

    return { group, animationClips: [clip] };
}
