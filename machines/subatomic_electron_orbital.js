export function createElectronOrbital(THREE) {
    const group = new THREE.Group();
    group.name = "ElectronOrbitalGroup";
    const animationClips = [];

    // Nucleus (simplified as a glowing center)
    const nucleusGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffaa00, emissiveIntensity: 2 });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    group.add(nucleus);

    // Orbital Cloud representing probability density
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
        // Create probability lobes (simulating a d-orbital or complex p-orbital)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        // Probability function to cluster points
        const r = 5 * Math.abs(Math.sin(2 * theta) * Math.sin(phi)) + Math.random() * 2;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        color.setHSL(0.55 + Math.random() * 0.1, 1.0, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const cloud = new THREE.Points(geometry, material);
    cloud.name = "orbitalCloud";
    group.add(cloud);

    // Animation: Cloud swirling
    const times = [0, 5, 10];
    const qRot0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0.5, 1, 0.2).normalize(), 0).toArray();
    const qRot1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0.5, 1, 0.2).normalize(), Math.PI).toArray();
    const qRot2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0.5, 1, 0.2).normalize(), Math.PI * 2).toArray();
    
    const rotTrack = new THREE.QuaternionKeyframeTrack('orbitalCloud.quaternion', times, [...qRot0, ...qRot1, ...qRot2]);

    const clip = new THREE.AnimationClip('OrbitalSwirl', 10, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
