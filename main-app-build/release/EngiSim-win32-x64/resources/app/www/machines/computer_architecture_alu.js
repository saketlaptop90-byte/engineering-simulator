export function createAlu(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main ALU body
    const bodyGeo = new THREE.CylinderGeometry(2, 3, 4, 3);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2288ff });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.rotation.z = Math.PI / 2;
    group.add(bodyMesh);

    // Inputs
    const in1Geo = new THREE.BoxGeometry(1, 1, 1);
    const in1Mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const in1Mesh = new THREE.Mesh(in1Geo, in1Mat);
    in1Mesh.position.set(-2, 2, 0);
    group.add(in1Mesh);

    const in2Geo = new THREE.BoxGeometry(1, 1, 1);
    const in2Mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const in2Mesh = new THREE.Mesh(in2Geo, in2Mat);
    in2Mesh.position.set(2, 2, 0);
    group.add(in2Mesh);

    // Output
    const outGeo = new THREE.BoxGeometry(1, 1, 1);
    const outMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const outMesh = new THREE.Mesh(outGeo, outMat);
    outMesh.position.set(0, -2, 0);
    group.add(outMesh);

    // Animation: Inputs pulse, then output pulses
    const scaleTrack1Name = `${in1Mesh.uuid}.scale`;
    const scaleTrack2Name = `${in2Mesh.uuid}.scale`;
    const scaleTrackOutName = `${outMesh.uuid}.scale`;

    const times = [0, 0.5, 1, 1.5, 2];
    const inValues = [1,1,1, 1.5,1.5,1.5, 1,1,1, 1,1,1, 1,1,1];
    const outValues = [1,1,1, 1,1,1, 1,1,1, 1.5,1.5,1.5, 1,1,1];

    const track1 = new THREE.VectorKeyframeTrack(scaleTrack1Name, times, inValues);
    const track2 = new THREE.VectorKeyframeTrack(scaleTrack2Name, times, inValues);
    const trackOut = new THREE.VectorKeyframeTrack(scaleTrackOutName, times, outValues);

    const clip = new THREE.AnimationClip('AluCompute', 2, [track1, track2, trackOut]);
    animationClips.push(clip);

    return { group, animationClips };
}
