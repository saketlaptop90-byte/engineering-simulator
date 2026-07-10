export function createTectonicPlateBoundary(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Left plate
    const plateGeo = new THREE.BoxGeometry(10, 2, 10);
    const crustMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9, metalness: 0.1 });
    const leftPlate = new THREE.Mesh(plateGeo, crustMat);
    leftPlate.position.set(-5.5, 0, 0);
    group.add(leftPlate);

    // Right plate
    const rightPlate = new THREE.Mesh(plateGeo, crustMat);
    rightPlate.position.set(5.5, 0, 0);
    group.add(rightPlate);

    // Magma underneath
    const magmaGeo = new THREE.BoxGeometry(20, 2, 10);
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff4500, emissiveIntensity: 0.5 });
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.set(0, -2, 0);
    group.add(magma);

    // Add animation for converging plates forming mountains
    const trackNameLeft = leftPlate.uuid + '.position';
    const trackNameRight = rightPlate.uuid + '.position';
    
    const times = [0, 5, 10];
    const leftValues = [-5.5, 0, 0, -5, 1, 0, -5.5, 0, 0];
    const rightValues = [5.5, 0, 0, 5, 1, 0, 5.5, 0, 0];
    
    const leftTrack = new THREE.VectorKeyframeTrack(trackNameLeft, times, leftValues);
    const rightTrack = new THREE.VectorKeyframeTrack(trackNameRight, times, rightValues);
    
    const clip = new THREE.AnimationClip('Converge', 10, [leftTrack, rightTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
