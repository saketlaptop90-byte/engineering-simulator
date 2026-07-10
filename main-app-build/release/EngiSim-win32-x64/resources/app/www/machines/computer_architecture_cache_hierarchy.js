export function createCacheHierarchy(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Core
    const coreGeo = new THREE.CylinderGeometry(1, 1, 1, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 4, 0);
    group.add(coreMesh);

    // L1
    const l1Geo = new THREE.BoxGeometry(3, 0.5, 3);
    const l1Mat = new THREE.MeshStandardMaterial({ color: 0x00aa00 });
    const l1Mesh = new THREE.Mesh(l1Geo, l1Mat);
    l1Mesh.position.set(0, 2, 0);
    group.add(l1Mesh);

    // L2
    const l2Geo = new THREE.BoxGeometry(5, 0.5, 5);
    const l2Mat = new THREE.MeshStandardMaterial({ color: 0x0000aa });
    const l2Mesh = new THREE.Mesh(l2Geo, l2Mat);
    l2Mesh.position.set(0, 0, 0);
    group.add(l2Mesh);

    // L3
    const l3Geo = new THREE.BoxGeometry(8, 0.5, 8);
    const l3Mat = new THREE.MeshStandardMaterial({ color: 0xaaaa00 });
    const l3Mesh = new THREE.Mesh(l3Geo, l3Mat);
    l3Mesh.position.set(0, -2, 0);
    group.add(l3Mesh);

    // Main Memory
    const memGeo = new THREE.BoxGeometry(12, 1, 12);
    const memMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const memMesh = new THREE.Mesh(memGeo, memMat);
    memMesh.position.set(0, -4, 0);
    group.add(memMesh);

    // Animation (Data fetch)
    const dataGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const dataMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const dataMesh = new THREE.Mesh(dataGeo, dataMat);
    group.add(dataMesh);

    const trackName = `${dataMesh.uuid}.position`;
    const times = [0, 1, 2, 3, 4, 5];
    const values = [
        0, -4, 0,
        0, -2, 0,
        0, 0, 0,
        0, 2, 0,
        0, 4, 0,
        0, -4, 0
    ];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('DataFetch', 5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
