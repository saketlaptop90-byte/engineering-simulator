export function createSatelliteDish(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeometry = new THREE.CylinderGeometry(1, 1.5, 2, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1;
    group.add(base);

    const dishGeometry = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.3);
    const dishMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    const dish = new THREE.Mesh(dishGeometry, dishMaterial);
    dish.position.y = 3;
    dish.rotation.x = -Math.PI / 4;
    group.add(dish);

    const receiverGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const receiverMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const receiver = new THREE.Mesh(receiverGeometry, receiverMaterial);
    receiver.position.set(0, 4, 1.5);
    receiver.rotation.x = Math.PI / 4;
    group.add(receiver);

    return { group, animationClips };
}
