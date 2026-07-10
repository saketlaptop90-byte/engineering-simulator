export function createAdenovirus(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Capsid (Icosahedron)
    const capsidGeometry = new THREE.IcosahedronGeometry(2.5, 1);
    const capsidMaterial = new THREE.MeshStandardMaterial({ color: 0x33aa88, roughness: 0.5, metalness: 0.2 });
    const capsid = new THREE.Mesh(capsidGeometry, capsidMaterial);
    group.add(capsid);

    // Fibers at vertices
    const icosahedronVertices = new THREE.IcosahedronGeometry(2.5, 0).attributes.position;
    const fiberGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    fiberGeo.translate(0, 1, 0);
    const knobGeo = new THREE.SphereGeometry(0.2, 8, 8);
    knobGeo.translate(0, 2, 0);
    const fiberMaterial = new THREE.MeshStandardMaterial({ color: 0xddaa22 });

    const vertexSet = new Set();
    for (let i = 0; i < icosahedronVertices.count; i++) {
        const x = icosahedronVertices.getX(i);
        const y = icosahedronVertices.getY(i);
        const z = icosahedronVertices.getZ(i);
        const key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
        
        if (!vertexSet.has(key)) {
            vertexSet.add(key);
            
            const fiberGroup = new THREE.Group();
            const stalk = new THREE.Mesh(fiberGeo, fiberMaterial);
            const knob = new THREE.Mesh(knobGeo, fiberMaterial);
            fiberGroup.add(stalk);
            fiberGroup.add(knob);

            const position = new THREE.Vector3(x, y, z);
            fiberGroup.position.copy(position);
            fiberGroup.lookAt(new THREE.Vector3(x * 2, y * 2, z * 2));
            fiberGroup.rotateX(Math.PI / 2);
            
            group.add(fiberGroup);
        }
    }

    // Animation (Pulsing size of capsid)
    const times = [0, 1, 2];
    const values = [1, 1, 1, 1.08, 1.08, 1.08, 1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('.children[0].scale', times, values);
    const clip = new THREE.AnimationClip('pulse', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
