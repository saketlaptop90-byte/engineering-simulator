export function createReflectingTelescope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.7 });
    const mountMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0 });

    const pierGeo = new THREE.CylinderGeometry(0.6, 0.8, 4, 16);
    const pier = new THREE.Mesh(pierGeo, mountMat);
    pier.position.set(0, 2, 0);
    group.add(pier);

    const mountGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const mount = new THREE.Mesh(mountGeo, mountMat);
    mount.position.set(0, 4.75, 0);
    mount.rotation.x = Math.PI / 4; 
    group.add(mount);

    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    
    const tubePivot = new THREE.Group();
    tubePivot.position.set(0, 4.75, 1.5);
    tube.rotation.x = Math.PI / 2;
    tubePivot.add(tube);
    group.add(tubePivot);

    const primaryMirrorGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 32);
    const primaryMirror = new THREE.Mesh(primaryMirrorGeo, mirrorMat);
    primaryMirror.position.set(0, -3.8, 0);
    tube.add(primaryMirror);

    const finderGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const finder = new THREE.Mesh(finderGeo, tubeMat);
    finder.position.set(1.6, 2, 0);
    tube.add(finder);

    const eyepieceGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
    const eyepiece = new THREE.Mesh(eyepieceGeo, mountMat);
    eyepiece.rotation.z = Math.PI / 2;
    eyepiece.position.set(1.6, 3, 0);
    tube.add(eyepiece);

    return { group, animationClips };
}
