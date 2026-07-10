export function createThermalDiode(THREE) {
    const group = new THREE.Group();
    const hotMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const coldMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const interfaceMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });

    const sideGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    const hotSide = new THREE.Mesh(sideGeo, hotMat);
    hotSide.position.y = 2;
    const coldSide = new THREE.Mesh(sideGeo, coldMat);
    coldSide.position.y = -2;

    const interfaceGeo = new THREE.BoxGeometry(3, 0.2, 3);
    const interfaceLayer = new THREE.Mesh(interfaceGeo, interfaceMat);

    group.add(hotSide);
    group.add(coldSide);
    group.add(interfaceLayer);

    const animationClips = [];
    const times = [0, 1, 2];
    const values = [0xff0000, 0xff5555, 0xff0000];
    const track = new THREE.ColorKeyframeTrack('.material.color', times, values);
    const clip = new THREE.AnimationClip('heat_flow', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
