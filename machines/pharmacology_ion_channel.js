export function createIonChannelModel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Membrane
    const membraneGeo = new THREE.BoxGeometry(8, 1, 8);
    const membraneMat = new THREE.MeshStandardMaterial({ color: 0xaa88aa, transparent: true, opacity: 0.5 });
    const membrane = new THREE.Mesh(membraneGeo, membraneMat);
    group.add(membrane);

    // Channel Left/Right
    const channelGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const channelMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const channelL = new THREE.Mesh(channelGeo, channelMat);
    const channelR = new THREE.Mesh(channelGeo, channelMat);
    channelL.position.set(-0.5, 0, 0);
    channelR.position.set(0.5, 0, 0);
    channelL.name = 'channelL';
    channelR.name = 'channelR';
    group.add(channelL);
    group.add(channelR);

    // Ion
    const ionGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const ionMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const ion = new THREE.Mesh(ionGeo, ionMat);
    ion.position.set(0, 3, 0);
    ion.name = 'ion';
    group.add(ion);

    // Animations
    const times = [0, 1, 2, 3, 4];
    // Channel opens
    const leftPos = [-0.5,0,0, -1,0,0, -1,0,0, -0.5,0,0, -0.5,0,0];
    const rightPos = [0.5,0,0, 1,0,0, 1,0,0, 0.5,0,0, 0.5,0,0];
    // Ion moves down
    const ionPos = [0,3,0, 0,3,0, 0,-3,0, 0,-3,0, 0,-3,0];

    const tracks = [
        new THREE.VectorKeyframeTrack('channelL.position', times, leftPos),
        new THREE.VectorKeyframeTrack('channelR.position', times, rightPos),
        new THREE.VectorKeyframeTrack('ion.position', times, ionPos)
    ];

    const clip = new THREE.AnimationClip('IonFlowAction', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
