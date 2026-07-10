export function createPhononicCrystalLattice(THREE) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0x3366ff, metalness: 0.3, roughness: 0.4 });
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);

    const nodes = [];
    const size = 3;
    for (let x = -size; x <= size; x += 2) {
        for (let y = -size; y <= size; y += 2) {
            for (let z = -size; z <= size; z += 2) {
                const node = new THREE.Mesh(sphereGeometry, material);
                node.position.set(x, y, z);
                group.add(node);
                nodes.push(node);
            }
        }
    }

    const linkMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    for (let x = -size; x <= size; x += 2) {
        for (let y = -size; y <= size; y += 2) {
            if (x < size) {
                const link = new THREE.Mesh(cylinderGeometry, linkMaterial);
                link.position.set(x + 1, y, 0);
                link.rotation.z = Math.PI / 2;
                group.add(link);
            }
        }
    }

    const animationClips = [];
    const times = [0, 1, 2];
    const values = [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack('.scale', times, values);
    const clip = new THREE.AnimationClip('breath', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
