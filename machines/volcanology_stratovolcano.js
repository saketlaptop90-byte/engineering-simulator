export function createStratovolcano(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base of the volcano
    const baseGeometry = new THREE.ConeGeometry(5, 4, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 2;
    group.add(base);

    // Crater
    const craterGeometry = new THREE.CylinderGeometry(1, 1.5, 0.5, 32);
    const craterMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const crater = new THREE.Mesh(craterGeometry, craterMaterial);
    crater.position.y = 4.25;
    group.add(crater);

    // Lava flow
    const lavaGeometry = new THREE.BoxGeometry(0.5, 3, 0.2);
    const lavaMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff0000 });
    const lava = new THREE.Mesh(lavaGeometry, lavaMaterial);
    lava.position.set(0, 2.5, 2.5);
    lava.rotation.x = Math.PI / 4;
    group.add(lava);

    // Animation for lava pulsing
    const trackName = lava.uuid + '.material.emissiveIntensity';
    const times = [0, 1, 2];
    const values = [0.5, 1.5, 0.5];
    const track = new THREE.NumberKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('LavaPulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
