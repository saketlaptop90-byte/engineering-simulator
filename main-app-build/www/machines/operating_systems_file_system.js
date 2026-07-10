export function createFileSystemTree(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const rootMaterial = new THREE.MeshStandardMaterial({ color: 0xff2222 });
    const dirMaterial = new THREE.MeshStandardMaterial({ color: 0x2222ff });
    const fileMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const packetMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x555500 });

    const root = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), rootMaterial);
    root.position.set(0, 4, 0);
    group.add(root);

    const dir1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), dirMaterial);
    dir1.position.set(-3, 0, 0);
    group.add(dir1);

    const dir2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), dirMaterial);
    dir2.position.set(3, 0, 0);
    group.add(dir2);

    const file1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), fileMaterial);
    file1.position.set(-4, -4, 0);
    group.add(file1);

    const packet = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), packetMaterial);
    packet.name = "dataPacket";
    group.add(packet);

    const times = [0, 2, 4];
    const positions = [0, 4, 0,  -3, 0, 0,  -4, -4, 0];
    const positionTrack = new THREE.VectorKeyframeTrack('dataPacket.position', times, positions);
    const clip = new THREE.AnimationClip('File_Read', 4, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
