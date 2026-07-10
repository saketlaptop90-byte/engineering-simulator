export function createGalacticRotation(THREE) {
    const group = new THREE.Group();
    group.name = 'GalacticGroup';
    const animationClips = [];

    const coreMaterial = new THREE.MeshStandardMaterial({ color: 0xffddaa, emissive: 0xffddaa, emissiveIntensity: 1 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), coreMaterial);
    group.add(core);

    const diskGroup = new THREE.Group();
    diskGroup.name = 'DiskGroup';
    
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xaaddff, emissive: 0xaaddff, emissiveIntensity: 0.6 });
    for (let i = 0; i < 200; i++) {
        const radius = 4 + Math.random() * 15;
        const angle = Math.random() * Math.PI * 2;
        const size = Math.random() * 0.2 + 0.1;
        const star = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), starMaterial);
        star.position.set(radius * Math.cos(angle), (Math.random() - 0.5) * 0.5, radius * Math.sin(angle));
        diskGroup.add(star);
    }
    
    group.add(diskGroup);

    const times = [0, 10, 20];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    const values = [...q0.toArray(), ...q1.toArray(), ...q2.toArray()];

    const track = new THREE.QuaternionKeyframeTrack('DiskGroup.quaternion', times, values);
    const clip = new THREE.AnimationClip('DiskRotation', 20, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
