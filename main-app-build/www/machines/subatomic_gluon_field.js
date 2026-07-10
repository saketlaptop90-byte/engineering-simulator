export function createGluonField(THREE) {
    const group = new THREE.Group();
    group.name = "GluonFieldGroup";
    const animationClips = [];

    // Main Flux Tube representing the Gluon Field
    const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 32, 32, true);
    const tubeMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0055ff,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.name = "fluxTube";
    group.add(tube);

    // Virtual particles (Gluons) popping in and out
    const particleGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    
    const particlesGroup = new THREE.Group();
    particlesGroup.name = "particlesGroup";
    for(let i=0; i<30; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.name = `gluon_${i}`;
        p.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 2
        );
        particlesGroup.add(p);
    }
    group.add(particlesGroup);

    // Animation: tube pulsating and rotating
    const times = [0, 1.5, 3];
    const scaleTrack = new THREE.VectorKeyframeTrack('fluxTube.scale', times, [1,1,1, 1.2,1,1.2, 1,1,1]);
    
    const qRot0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0).toArray();
    const qRot1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI).toArray();
    const qRot2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2).toArray();
    const rotTrack = new THREE.QuaternionKeyframeTrack('fluxTube.quaternion', times, [...qRot0, ...qRot1, ...qRot2]);
    const particlesRotTrack = new THREE.QuaternionKeyframeTrack('particlesGroup.quaternion', times, [...qRot0, ...qRot1, ...qRot2]);

    const clip = new THREE.AnimationClip('GluonFieldPulse', 3, [scaleTrack, rotTrack, particlesRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
