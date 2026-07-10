export function createAcousticMetamaterial(THREE) {
    const group = new THREE.Group();
    const cellMaterial = new THREE.MeshStandardMaterial({ color: 0xff3366, wireframe: true });
    const massMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });

    const cellGeo = new THREE.BoxGeometry(2, 2, 2);
    const massGeo = new THREE.SphereGeometry(0.4, 16, 16);

    for (let i = -2; i <= 2; i+=2) {
        const cell = new THREE.Mesh(cellGeo, cellMaterial);
        cell.position.x = i;
        const mass = new THREE.Mesh(massGeo, massMaterial);
        mass.name = `mass_${i}`;
        mass.position.x = i;
        group.add(cell);
        group.add(mass);
    }

    const animationClips = [];
    const times = [0, 0.5, 1, 1.5, 2];
    const track = new THREE.NumberKeyframeTrack('.position[y]', times, [0, 0.5, 0, -0.5, 0]);
    const clip = new THREE.AnimationClip('vibrate', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
