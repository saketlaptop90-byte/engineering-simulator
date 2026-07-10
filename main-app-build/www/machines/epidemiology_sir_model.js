export function createSIRModelVisualizer(THREE) {
    const group = new THREE.Group();
    
    // Susceptible S: Blue, Infected I: Red, Recovered R: Green
    const materialS = new THREE.MeshStandardMaterial({ color: 0x3498db, metalness: 0.3, roughness: 0.4 });
    const materialI = new THREE.MeshStandardMaterial({ color: 0xe74c3c, metalness: 0.3, roughness: 0.4 });
    const materialR = new THREE.MeshStandardMaterial({ color: 0x2ecc71, metalness: 0.3, roughness: 0.4 });

    const geo = new THREE.CylinderGeometry(1, 1, 1, 32);
    geo.translate(0, 0.5, 0); // anchor at bottom

    const meshS = new THREE.Mesh(geo, materialS);
    meshS.name = "Susceptible";
    meshS.position.set(-3, 0, 0);
    meshS.scale.set(1, 5, 1);
    group.add(meshS);

    const meshI = new THREE.Mesh(geo, materialI);
    meshI.name = "Infected";
    meshI.position.set(0, 0, 0);
    meshI.scale.set(1, 0.1, 1);
    group.add(meshI);

    const meshR = new THREE.Mesh(geo, materialR);
    meshR.name = "Recovered";
    meshR.position.set(3, 0, 0);
    meshR.scale.set(1, 0.1, 1);
    group.add(meshR);

    // Animation: S decreases, I increases then decreases, R increases
    const times = [0, 2, 4, 6];
    const valuesS = [1,5,1, 1,3,1, 1,1,1, 1,0.5,1];
    const valuesI = [1,0.1,1, 1,2,1, 1,3.5,1, 1,0.5,1];
    const valuesR = [1,0.1,1, 1,0.1,1, 1,0.6,1, 1,4.1,1];

    const trackS = new THREE.VectorKeyframeTrack(`${meshS.name}.scale`, times, valuesS);
    const trackI = new THREE.VectorKeyframeTrack(`${meshI.name}.scale`, times, valuesI);
    const trackR = new THREE.VectorKeyframeTrack(`${meshR.name}.scale`, times, valuesR);

    const clip = new THREE.AnimationClip('SIR_Evolution', 6, [trackS, trackI, trackR]);

    return { group, animationClips: [clip] };
}
