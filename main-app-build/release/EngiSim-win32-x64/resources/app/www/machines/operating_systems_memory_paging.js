export function createMemoryPagingSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const ramMaterial = new THREE.MeshStandardMaterial({ color: 0x22aa22, metalness: 0.5, roughness: 0.5 });
    const diskMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.1 });
    const pageMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x442200 });

    const ram = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 1), ramMaterial);
    ram.position.set(4, 0, 0);
    group.add(ram);

    const disk = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32), diskMaterial);
    disk.rotation.x = Math.PI / 2;
    disk.position.set(-4, 0, 0);
    group.add(disk);

    const page = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.5), pageMaterial);
    page.name = "page1";
    group.add(page);

    const times = [0, 2, 4];
    const positions = [-4, 0, 0,  0, 2, 0,  4, 2, 0];
    const positionTrack = new THREE.VectorKeyframeTrack('page1.position', times, positions);
    const clip = new THREE.AnimationClip('Page_Fault_Swap', 4, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
