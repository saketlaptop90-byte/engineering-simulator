export function createHallEffectThruster(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(3, 3, 2, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Channel (Torus)
    const channelGeo = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const channelMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const channel = new THREE.Mesh(channelGeo, channelMat);
    channel.rotation.x = Math.PI / 2;
    channel.position.y = 1;
    group.add(channel);

    // Plasma Ring
    const plasmaGeo = new THREE.TorusGeometry(2, 0.4, 16, 100);
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, transparent: true, opacity: 0.8 });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.rotation.x = Math.PI / 2;
    plasma.position.y = 1.2;
    group.add(plasma);

    // Plume
    const plumeGeo = new THREE.CylinderGeometry(2, 4, 10, 32);
    const plumeMat = new THREE.MeshStandardMaterial({ color: 0x0044ff, transparent: true, opacity: 0.3 });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.position.y = 6;
    group.add(plume);

    // Animation (plasma flicker)
    const trackName = plasma.uuid + '.material.opacity';
    const times = [0, 0.1, 0.2];
    const values = [0.8, 1.0, 0.8];
    const track = new THREE.NumberKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('plasma_flicker', 0.2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
