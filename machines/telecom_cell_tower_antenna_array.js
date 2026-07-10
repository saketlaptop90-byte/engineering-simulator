import * as materials from '../utils/materials.js';

export function createCellTowerAntennaArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central Mast
    const poleGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const pole = new THREE.Mesh(poleGeo, materials.steel);
    group.add(pole);

    // Antenna Mounts
    const mountRingGeo = new THREE.TorusGeometry(1, 0.1, 16, 32);
    const mountRing1 = new THREE.Mesh(mountRingGeo, materials.aluminum);
    mountRing1.position.y = 3;
    mountRing1.rotation.x = Math.PI / 2;
    group.add(mountRing1);

    const mountRing2 = mountRing1.clone();
    mountRing2.position.y = -3;
    group.add(mountRing2);

    // Antennas (Sector Antennas)
    const antennaGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(0.8, 6, 0.2);
    const connectorGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    
    for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const panel = new THREE.Mesh(panelGeo, materials.whitePlastic);
        
        // Position panel around the mast
        panel.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
        panel.rotation.y = -angle + Math.PI / 2;
        
        // Back connectors
        const connector = new THREE.Mesh(connectorGeo, materials.darkSteel);
        connector.rotation.x = Math.PI / 2;
        connector.position.z = -0.6;
        panel.add(connector);
        
        antennaGroup.add(panel);
    }
    group.add(antennaGroup);

    // Animation: Sector Antennas Azimuth Adjustment (Sweeping)
    const trackName = `${antennaGroup.uuid}.rotation[y]`;
    const times = [0, 2, 4, 6];
    const values = [0, 0.1, -0.1, 0];
    const track = new THREE.NumberKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('AzimuthSweep', 6, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
