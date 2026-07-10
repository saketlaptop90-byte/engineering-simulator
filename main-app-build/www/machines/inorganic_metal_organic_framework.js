export function createMetalOrganicFramework(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalGeo = new THREE.IcosahedronGeometry(0.3, 0);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x33cc33, metalness: 0.5 });
    
    const linkerGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const linkerMat = new THREE.MeshStandardMaterial({ color: 0x444444 });

    const nodes = [];
    const size = 1;
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
                const nodeGroup = new THREE.Group();
                const metal = new THREE.Mesh(metalGeo, metalMat);
                nodeGroup.add(metal);
                
                if (x < size) {
                    const linker = new THREE.Mesh(linkerGeo, linkerMat);
                    linker.position.set(1, 0, 0);
                    linker.rotation.z = Math.PI / 2;
                    nodeGroup.add(linker);
                }
                if (y < size) {
                    const linker = new THREE.Mesh(linkerGeo, linkerMat);
                    linker.position.set(0, 1, 0);
                    nodeGroup.add(linker);
                }
                if (z < size) {
                    const linker = new THREE.Mesh(linkerGeo, linkerMat);
                    linker.position.set(0, 0, 1);
                    linker.rotation.x = Math.PI / 2;
                    nodeGroup.add(linker);
                }
                
                nodeGroup.position.set(x * 2, y * 2, z * 2);
                group.add(nodeGroup);
                nodes.push(nodeGroup);
            }
        }
    }

    const times = [0, 2, 4];
    const tracks = [];
    
    nodes.forEach((node, idx) => {
        const p = node.position.clone();
        const expanded = p.clone().multiplyScalar(1.2);
        const values = [
            p.x, p.y, p.z,
            expanded.x, expanded.y, expanded.z,
            p.x, p.y, p.z
        ];
        tracks.push(new THREE.VectorKeyframeTrack(`.children[${idx}].position`, times, values));
    });

    animationClips.push(new THREE.AnimationClip('breathing', 4, tracks));

    return { group, animationClips };
}
