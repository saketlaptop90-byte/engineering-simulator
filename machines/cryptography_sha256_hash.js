export function createSHA256Hash(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Input data
    const inputGeom = new THREE.BoxGeometry(3, 1, 1);
    const inputMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
    const input = new THREE.Mesh(inputGeom, inputMat);
    input.position.set(-4, 2, 0);
    input.name = "InputData";
    group.add(input);

    // Hash function machine
    const machineGeom = new THREE.ConeGeometry(2, 3, 4);
    const machineMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.4 });
    const machine = new THREE.Mesh(machineGeom, machineMat);
    machine.position.set(0, 0, 0);
    group.add(machine);

    // Output hash (fixed size)
    const outputGeom = new THREE.BoxGeometry(1, 1, 1);
    const outputMat = new THREE.MeshStandardMaterial({ color: 0xff5500 });
    const output = new THREE.Mesh(outputGeom, outputMat);
    output.position.set(0, -3, 0);
    output.name = "OutputHash";
    group.add(output);

    // Animation: Input goes into machine, output comes out
    
    // Input moves to machine and shrinks
    const inPosTrack = new THREE.VectorKeyframeTrack('InputData.position', [0, 1], [-4, 2, 0, 0, 1, 0]);
    const inScaleTrack = new THREE.VectorKeyframeTrack('InputData.scale', [0, 1], [1, 1, 1, 0.1, 0.1, 0.1]);
    
    // Output grows and moves out
    const outPosTrack = new THREE.VectorKeyframeTrack('OutputHash.position', [1, 2, 3], [0, 0, 0, 0, -2, 0, 4, -2, 0]);
    const outScaleTrack = new THREE.VectorKeyframeTrack('OutputHash.scale', [1, 2], [0.1, 0.1, 0.1, 1, 1, 1]);
    
    const clip = new THREE.AnimationClip('HashingProcess', 3, [inPosTrack, inScaleTrack, outPosTrack, outScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
