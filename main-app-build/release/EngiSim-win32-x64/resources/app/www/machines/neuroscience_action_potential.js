export function createActionPotential(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Axon cylinder
    const axonGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
    const axonMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, transparent: true, opacity: 0.5 });
    const axon = new THREE.Mesh(axonGeo, axonMat);
    axon.rotation.z = Math.PI / 2;
    group.add(axon);

    // Myelin sheaths
    const myelinGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 32);
    const myelinMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1 });
    for(let i = -3; i <= 3; i+=2.5) {
        const myelin = new THREE.Mesh(myelinGeo, myelinMat);
        myelin.rotation.z = Math.PI / 2;
        myelin.position.x = i;
        group.add(myelin);
    }

    // Action potential charge
    const chargeGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const chargeMat = new THREE.MeshStandardMaterial({ color: 0x3498db, emissive: 0x3498db, emissiveIntensity: 1 });
    const charge = new THREE.Mesh(chargeGeo, chargeMat);
    charge.position.x = -5;
    group.add(charge);

    // Animation
    const times = [0, 2];
    const values = [-5, 0, 0,  5, 0, 0];
    const posTrack = new THREE.VectorKeyframeTrack(`${charge.uuid}.position`, times, values);
    const clip = new THREE.AnimationClip('SignalPropagation', 2, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
