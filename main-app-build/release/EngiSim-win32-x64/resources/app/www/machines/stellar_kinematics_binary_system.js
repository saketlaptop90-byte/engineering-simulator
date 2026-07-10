export function createBinaryStarSystem(THREE) {
    const group = new THREE.Group();
    group.name = 'BinarySystemGroup';
    const animationClips = [];

    const starMaterial1 = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.5 });
    const starMaterial2 = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x4488ff, emissiveIntensity: 0.5 });

    const star1 = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), starMaterial1);
    const star2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), starMaterial2);

    star1.position.set(-3, 0, 0);
    star2.position.set(6, 0, 0);
    
    const binaryNode = new THREE.Group();
    binaryNode.name = 'BinaryNode';
    binaryNode.add(star1);
    binaryNode.add(star2);
    group.add(binaryNode);

    const times = [0, 2, 4];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const values = [...q0.toArray(), ...q1.toArray(), ...q2.toArray()];
    
    const track = new THREE.QuaternionKeyframeTrack('BinaryNode.quaternion', times, values);
    const clip = new THREE.AnimationClip('BinaryOrbit', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
