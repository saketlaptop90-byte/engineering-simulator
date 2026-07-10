import { materials } from '../utils/materials.js';

export function createAtmosphereProcessor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(50, 60, 20, 32);
    const baseMesh = new THREE.Mesh(baseGeo, materials.metallic || new THREE.MeshStandardMaterial({color: 0x555555}));
    baseMesh.position.y = 10;
    group.add(baseMesh);

    // Main Tower
    const towerGeo = new THREE.CylinderGeometry(20, 40, 150, 16);
    const towerMesh = new THREE.Mesh(towerGeo, materials.metallicDark || new THREE.MeshStandardMaterial({color: 0x333333}));
    towerMesh.position.y = 95;
    group.add(towerMesh);

    // Vents / Smokestacks
    const ventGeo = new THREE.CylinderGeometry(5, 5, 40, 8);
    const ventGroup = new THREE.Group();
    ventGroup.position.y = 170;
    
    for (let i = 0; i < 4; i++) {
        const vent = new THREE.Mesh(ventGeo, materials.metallic || new THREE.MeshStandardMaterial({color: 0x777777}));
        vent.position.x = Math.cos((i * Math.PI) / 2) * 10;
        vent.position.z = Math.sin((i * Math.PI) / 2) * 10;
        vent.position.y = 10;
        ventGroup.add(vent);
    }
    group.add(ventGroup);

    // Vents Animation (venting gas expanding)
    const gasGeo = new THREE.SphereGeometry(3, 8, 8);
    const gasMat = materials.gas || new THREE.MeshBasicMaterial({color: 0x00ffcc, transparent: true, opacity: 0.5});
    
    const gases = new THREE.Group();
    gases.position.y = 190;
    group.add(gases);

    const tracks = [];
    const times = [0, 1, 2];
    const scales = [1, 1, 1,  3, 3, 3,  1, 1, 1];

    for (let i = 0; i < 4; i++) {
        const gas = new THREE.Mesh(gasGeo, gasMat);
        gas.position.x = Math.cos((i * Math.PI) / 2) * 10;
        gas.position.z = Math.sin((i * Math.PI) / 2) * 10;
        gas.name = `gas_${i}`;
        gases.add(gas);

        const gasTrack = new THREE.VectorKeyframeTrack(`gas_${i}.scale`, times, scales);
        tracks.push(gasTrack);
    }
    
    const clip = new THREE.AnimationClip('VentGas', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
