export function createDNAMethylation(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // DNA strand
    const dnaGeometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
    const dnaMaterial = new THREE.MeshStandardMaterial({ color: 0x0055ff, wireframe: true });
    const dnaMesh = new THREE.Mesh(dnaGeometry, dnaMaterial);
    group.add(dnaMesh);

    // Methyl groups (red spheres)
    const methylGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const methylMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    const methylGroup = new THREE.Group();
    methylGroup.name = "methylGroup";
    for (let i = 0; i < 10; i++) {
        const methyl = new THREE.Mesh(methylGeometry, methylMaterial);
        const angle = (i / 10) * Math.PI * 2;
        methyl.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 0);
        methylGroup.add(methyl);
    }
    group.add(methylGroup);

    // Animation: methyl groups attaching/detaching (pulsating)
    const times = [0, 1, 2];
    const scales = [1, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack('methylGroup.scale', times, scales);
    const clip = new THREE.AnimationClip('MethylationAction', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
