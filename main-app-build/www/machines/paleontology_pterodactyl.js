export function createPterodactyl(THREE) {
    const group = new THREE.Group();
    
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x6e7b6d, roughness: 0.8 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xc4b38d, roughness: 0.6 });

    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    const body = new THREE.Mesh(bodyGeo, skinMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0, 1.5);
    
    const skullGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const skull = new THREE.Mesh(skullGeo, skinMat);
    headGroup.add(skull);

    const beakGeo = new THREE.ConeGeometry(0.2, 1.5, 16);
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0, 0.8);
    headGroup.add(beak);

    const crestGeo = new THREE.ConeGeometry(0.1, 1.0, 16);
    const crest = new THREE.Mesh(crestGeo, skinMat);
    crest.rotation.x = -Math.PI / 2;
    crest.position.set(0, 0.2, -0.5);
    headGroup.add(crest);

    group.add(headGroup);

    // Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(4, -1);
    wingShape.lineTo(0.5, -2);
    wingShape.lineTo(0, -1);
    wingShape.lineTo(0, 0);

    const extrudeSettings = { depth: 0.05, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

    const wingL = new THREE.Mesh(wingGeo, skinMat);
    wingL.position.set(0.4, 0, 0);
    wingL.rotation.x = Math.PI / 2;
    group.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, skinMat);
    wingR.position.set(-0.4, 0, 0);
    wingR.rotation.x = Math.PI / 2;
    wingR.rotation.y = Math.PI;
    group.add(wingR);

    const animationClips = [];
    return { group, animationClips };
}
