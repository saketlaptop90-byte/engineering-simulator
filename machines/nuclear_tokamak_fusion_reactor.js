export function createNuclearTokamakFusionReactor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Toroidal Plasma
    const plasmaGeo = new THREE.TorusGeometry(5, 1.5, 16, 64);
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.rotation.x = Math.PI / 2;
    group.add(plasma);

    // Magnetic Coils
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const coilGeo = new THREE.TorusGeometry(2, 0.2, 8, 16);
        const coilMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
        const coil = new THREE.Mesh(coilGeo, coilMat);
        
        coil.position.set(Math.cos(angle) * 5, 0, Math.sin(angle) * 5);
        coil.lookAt(0, 0, 0);
        group.add(coil);
    }

    // Plasma Animation
    const track = new THREE.NumberKeyframeTrack(`${plasmaMat.uuid}.emissiveIntensity`, [0, 1, 2], [1, 3, 1]);
    const clip = new THREE.AnimationClip('PlasmaPulsate', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
