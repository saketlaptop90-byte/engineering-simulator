export function createFluxTube(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const quarkMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x880000, roughness: 0.2 });
    const antiquarkMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x008888, roughness: 0.2 }); 
    
    const quark = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), quarkMat);
    quark.name = 'Quark';
    group.add(quark);

    const antiquark = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), antiquarkMat);
    antiquark.name = 'AntiQuark';
    group.add(antiquark);

    // Flux tube
    const tubeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 32, 8, true);
    tubeGeometry.rotateZ(Math.PI / 2); // Align with X axis
    const tubeMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        transparent: true, 
        opacity: 0.7,
        emissive: 0xff8800,
        side: THREE.DoubleSide,
        wireframe: true
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMat);
    tube.name = 'FluxTube';
    group.add(tube);

    // Animations
    const times = [0, 2, 4, 6];
    const qPos = [0, 0, 0,  -3, 0, 0,  -6, 0, 0,  0, 0, 0];
    const aqPos = [0, 0, 0,  3, 0, 0,   6, 0, 0,  0, 0, 0];
    
    const qTrack = new THREE.VectorKeyframeTrack('Quark.position', times, qPos);
    const aqTrack = new THREE.VectorKeyframeTrack('AntiQuark.position', times, aqPos);

    // Tube scales and position (Length: 0 at t=0, 6 at t=2, 12 at t=4, 0 at t=6)
    const tubeScale = [0.01, 1, 1,  6, 1, 1,  12, 1, 1,  0.01, 1, 1];
    const tubeScaleTrack = new THREE.VectorKeyframeTrack('FluxTube.scale', times, tubeScale);
    
    const clip = new THREE.AnimationClip('Confinement', 6, [qTrack, aqTrack, tubeScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
