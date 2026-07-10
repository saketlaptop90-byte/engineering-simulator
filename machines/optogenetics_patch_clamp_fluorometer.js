export function createPatchClampFluorometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.4 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x111155, metalness: 0.3, roughness: 0.2 });

    // Base microscope body
    const baseGeo = new THREE.BoxGeometry(3, 1, 4);
    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    baseMesh.position.y = 0.5;
    group.add(baseMesh);

    // Objective lens
    const lensGeo = new THREE.CylinderGeometry(0.4, 0.2, 1.5);
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.position.set(0, 2, 0);
    group.add(lensMesh);

    // Patch pipette
    const pipetteGeo = new THREE.ConeGeometry(0.05, 3, 16);
    const pipetteMesh = new THREE.Mesh(pipetteGeo, glassMat);
    pipetteMesh.rotation.z = Math.PI / 4;
    pipetteMesh.position.set(1.5, 1.5, 0);
    group.add(pipetteMesh);

    // Light source
    const lightGeo = new THREE.BoxGeometry(1, 1, 1);
    const lightMesh = new THREE.Mesh(lightGeo, metalMat);
    lightMesh.position.set(0, 3, 1);
    group.add(lightMesh);

    return { group, animationClips };
}
