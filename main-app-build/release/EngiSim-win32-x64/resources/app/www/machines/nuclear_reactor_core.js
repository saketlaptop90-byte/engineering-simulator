export function createNuclearReactorCore(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Containment vessel
    const vesselGeo = new THREE.CylinderGeometry(5, 5, 10, 32);
    const vesselMat = new THREE.MeshStandardMaterial({ color: 0x444455, transparent: true, opacity: 0.2 });
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    group.add(vessel);

    // Fuel rods
    const fuelGroup = new THREE.Group();
    for (let x = -2; x <= 2; x += 1) {
        for (let z = -2; z <= 2; z += 1) {
            if (x*x + z*z > 5) continue;
            const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
            const rodMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.5 });
            const rod = new THREE.Mesh(rodGeo, rodMat);
            rod.position.set(x, 0, z);
            fuelGroup.add(rod);
        }
    }
    group.add(fuelGroup);

    // Control rods (animated)
    const controlGroup = new THREE.Group();
    for (let x = -1.5; x <= 1.5; x += 1.5) {
        for (let z = -1.5; z <= 1.5; z += 1.5) {
            const crodGeo = new THREE.CylinderGeometry(0.15, 0.15, 8, 8);
            const crodMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
            const crod = new THREE.Mesh(crodGeo, crodMat);
            crod.position.set(x, 4, z);
            crod.name = `crod_${x}_${z}`;
            controlGroup.add(crod);
        }
    }
    group.add(controlGroup);

    // Light
    const light = new THREE.PointLight(0x00ff00, 2, 20);
    group.add(light);

    // Animation
    const times = [0, 2, 4];
    controlGroup.children.forEach(crod => {
        const track = new THREE.VectorKeyframeTrack(`${crod.uuid}.position`, times, [
            crod.position.x, 4, crod.position.z,
            crod.position.x, 0, crod.position.z,
            crod.position.x, 4, crod.position.z
        ]);
        const clip = new THREE.AnimationClip(`MoveControlRods_${crod.uuid}`, 4, [track]);
        animationClips.push(clip);
    });

    return { group, animationClips };
}
