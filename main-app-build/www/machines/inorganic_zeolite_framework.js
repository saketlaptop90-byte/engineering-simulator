export function createZeoliteFramework(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const nodeGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const edgeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });

    // Create a simple sodalite cage-like or pore structure
    const size = 3;
    const nodes = [];
    for (let x = -size; x <= size; x += 1.5) {
        for (let y = -size; y <= size; y += 1.5) {
            for (let z = -size; z <= size; z += 1.5) {
                if (Math.abs(x) + Math.abs(y) + Math.abs(z) > 3) continue; // create a pore in the middle
                const node = new THREE.Mesh(nodeGeo, nodeMat);
                node.position.set(x, y, z);
                group.add(node);
                nodes.push(new THREE.Vector3(x,y,z));
            }
        }
    }

    // Add trapped ion
    const ionGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const ionMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x004444 });
    const ion = new THREE.Mesh(ionGeo, ionMat);
    group.add(ion);

    const times = [0, 1, 2, 3, 4];
    const values = [
        0, 0, 0,
        1.5, 0, 0,
        1.5, 1.5, 0,
        0, 1.5, 0,
        0, 0, 0
    ];
    const track = new THREE.VectorKeyframeTrack(`.children[${group.children.length - 1}].position`, times, values);
    animationClips.push(new THREE.AnimationClip('ion_diffusion', 4, [track]));

    return { group, animationClips };
}
