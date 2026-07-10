export function createTidalTurbine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5, roughness: 0.8 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x2288cc, metalness: 0.4, roughness: 0.6 });

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.5, 1, 10, 16);
    const tower = new THREE.Mesh(towerGeo, baseMat);
    tower.position.y = 5;
    group.add(tower);

    // Nacelle
    const nacelleGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    nacelleGeo.rotateZ(Math.PI / 2);
    const nacelle = new THREE.Mesh(nacelleGeo, baseMat);
    nacelle.position.y = 10;
    group.add(nacelle);

    // Rotor
    const rotorGroup = new THREE.Group();
    rotorGroup.name = 'turbineRotor';
    rotorGroup.position.set(2, 10, 0);

    const hubGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const hub = new THREE.Mesh(hubGeo, baseMat);
    rotorGroup.add(hub);

    // Blades
    for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 5, 0.5);
        bladeGeo.translate(0, 2.5, 0);
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.x = (i * Math.PI * 2) / 3;
        rotorGroup.add(blade);
    }

    group.add(rotorGroup);

    // Rotation Animation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const rotTrack = new THREE.QuaternionKeyframeTrack(
        'turbineRotor.quaternion',
        [0, 2, 4],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const spinClip = new THREE.AnimationClip('SpinTurbine', 4, [rotTrack]);
    animationClips.push(spinClip);

    return { group, animationClips };
}
