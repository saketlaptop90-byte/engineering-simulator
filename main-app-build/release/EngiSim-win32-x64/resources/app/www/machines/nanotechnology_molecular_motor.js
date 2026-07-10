export function createMolecularMotor(THREE) {
    const group = new THREE.Group();
    group.name = 'MolecularMotor';

    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x0055aa });
    const rotorMaterial = new THREE.MeshStandardMaterial({ color: 0xaa0000 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 16), baseMaterial);
    group.add(base);

    const rotor = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 16), rotorMaterial);
    rotor.position.y = 2;
    group.add(rotor);

    const propGeometry = new THREE.BoxGeometry(4, 0.2, 0.5);
    const prop1 = new THREE.Mesh(propGeometry, rotorMaterial);
    prop1.position.y = 3.5;
    group.add(prop1);

    const prop2 = new THREE.Mesh(propGeometry, rotorMaterial);
    prop2.position.y = 3.5;
    prop2.rotation.y = Math.PI / 2;
    group.add(prop2);

    return { group, animationClips: [] };
}
