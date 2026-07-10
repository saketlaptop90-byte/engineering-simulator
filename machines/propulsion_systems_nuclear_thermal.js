export function createNuclearThermal(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Reactor Core
    const coreGeo = new THREE.CylinderGeometry(3, 3, 6, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Propellant Tank
    const tankGeo = new THREE.SphereGeometry(4, 32, 32);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xccccaa, roughness: 0.3 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.y = 7;
    tank.scale.set(1, 2, 1);
    group.add(tank);

    // Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(1.5, 4, 5, 32);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9 });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.y = -5.5;
    group.add(nozzle);

    // Glow
    const glowGeo = new THREE.CylinderGeometry(3.1, 3.1, 6, 16);
    const glowMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, transparent: true, opacity: 0.3 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    // Animation (reactor pulse)
    const trackName = glow.uuid + '.material.opacity';
    const times = [0, 1, 2];
    const values = [0.3, 0.6, 0.3];
    const track = new THREE.NumberKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('glow_pulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
