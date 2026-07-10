import { materials } from '../utils/materials.js';

export function createSuperconductingCoil(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Coil Casing
    const casingGeo = new THREE.TorusGeometry(4, 1.2, 32, 100);
    const casing = new THREE.Mesh(casingGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x777777}));
    group.add(casing);

    // Superconducting Cables
    const cableGeo = new THREE.TorusGeometry(4, 0.8, 16, 100);
    const cable = new THREE.Mesh(cableGeo, materials.superconductor_cable || new THREE.MeshStandardMaterial({color: 0xb87333, wireframe: true}));
    cable.name = 'superconducting_cable';
    group.add(cable);

    // Cryogenic Cooling System pipes
    const coolingPipe = new THREE.Mesh(
        new THREE.TorusGeometry(4.2, 0.2, 8, 100), 
        materials.cryo_pipe || new THREE.MeshStandardMaterial({color: 0xaaaaff, emissive: 0x000044})
    );
    coolingPipe.rotation.x = Math.PI / 2;
    group.add(coolingPipe);

    // Connectors
    const connectorGeo = new THREE.BoxGeometry(2, 3, 2);
    const connector = new THREE.Mesh(connectorGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0x555555}));
    connector.position.set(0, 4.5, 0);
    group.add(connector);

    // Animation: Inner cable scale pulsing slightly due to immense magnetic forces
    const pulseTrack = new THREE.VectorKeyframeTrack(
        'superconducting_cable.scale',
        [0, 1, 2],
        [1, 1, 1, 1.02, 1.02, 1.02, 1, 1, 1]
    );
    const clip = new THREE.AnimationClip('CoilMagneticPulse', 2, [pulseTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
