export function createCometarySublimator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Stand
    const standGeo = new THREE.BoxGeometry(3, 1, 3);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.4 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = 0.5;
    group.add(stand);

    // Vacuum Chamber Bell Jar
    const jarGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 16, 1, false, 0, Math.PI * 2);
    const jarTopGeo = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    
    const jarMat = new THREE.MeshStandardMaterial({ color: 0xaaccff, metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.4 });
    
    const jar = new THREE.Mesh(jarGeo, jarMat);
    jar.position.y = 2.5;
    group.add(jar);
    
    const jarTop = new THREE.Mesh(jarTopGeo, jarMat);
    jarTop.position.y = 4;
    group.add(jarTop);

    // Comet Nucleus (Ice and Dust)
    const cometGeo = new THREE.DodecahedronGeometry(0.5, 2);
    const cometMat = new THREE.MeshStandardMaterial({ color: 0x99aaff, roughness: 0.8, metalness: 0.1 });
    const comet = new THREE.Mesh(cometGeo, cometMat);
    comet.position.y = 2;
    group.add(comet);

    // Heat Lamp
    const lampGeo = new THREE.ConeGeometry(0.3, 0.5, 16);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(2, 3, 0);
    lamp.rotation.z = Math.PI / 2;
    group.add(lamp);

    const lightGeo = new THREE.CylinderGeometry(0.28, 0.3, 0.1, 16);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.set(1.75, 3, 0);
    light.rotation.z = Math.PI / 2;
    group.add(light);

    // Outgassing Particles
    const particleGroup = new THREE.Group();
    particleGroup.position.y = 2;
    group.add(particleGroup);

    const particleGeo = new THREE.SphereGeometry(0.02, 4, 4);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

    const tracks = [];
    const duration = 2;

    for(let i=0; i<30; i++) {
        const particle = new THREE.Mesh(particleGeo, particleMat);
        particleGroup.add(particle);

        const angle = Math.random() * Math.PI * 2;
        const startX = Math.cos(angle) * 0.5;
        const startZ = Math.sin(angle) * 0.5;
        
        const endX = Math.cos(angle) * 1.5;
        const endZ = Math.sin(angle) * 1.5;
        const endY = 1 + Math.random();

        const times = [0, duration];
        const values = [startX, 0, startZ, endX, endY, endZ];
        const posTrack = new THREE.VectorKeyframeTrack(`${particle.uuid}.position`, times, values);
        
        const scaleTrack = new THREE.VectorKeyframeTrack(`${particle.uuid}.scale`, times, [1,1,1, 0,0,0]);
        
        tracks.push(posTrack, scaleTrack);
    }

    const clip = new THREE.AnimationClip('Sublimation', duration, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
