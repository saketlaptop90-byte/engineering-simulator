import { ceramic, steel, glass, orangeAccent, titanium } from '../utils/materials.js';

export function createLunarRegolithBase(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Domes (3D printed regolith)
    const domeGeo = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome1 = new THREE.Mesh(domeGeo, ceramic);
    dome1.position.set(-20, 0, 0);
    group.add(dome1);

    const dome2 = new THREE.Mesh(domeGeo, ceramic);
    dome2.scale.set(0.8, 0.8, 0.8);
    dome2.position.set(20, 0, 0);
    group.add(dome2);

    // Connecting tunnel
    const tunnelGeo = new THREE.CylinderGeometry(5, 5, 40, 16, 1, false, 0, Math.PI);
    const tunnel = new THREE.Mesh(tunnelGeo, ceramic);
    tunnel.rotation.z = Math.PI / 2;
    tunnel.position.set(0, 0, 0);
    group.add(tunnel);

    // Airlock on dome 1
    const airlockGeo = new THREE.BoxGeometry(10, 8, 8);
    const airlock = new THREE.Mesh(airlockGeo, titanium);
    airlock.position.set(-35, 4, 0);
    group.add(airlock);

    // Airlock Door
    const doorGeo = new THREE.BoxGeometry(1, 6, 4);
    const door = new THREE.Mesh(doorGeo, orangeAccent);
    door.position.set(-40.1, 4, 0);
    group.add(door);

    // Communication Antenna
    const antennaMastGeo = new THREE.CylinderGeometry(0.5, 0.5, 10);
    const antennaMast = new THREE.Mesh(antennaMastGeo, steel);
    antennaMast.position.set(-20, 15, 5);
    group.add(antennaMast);

    const dishGeo = new THREE.SphereGeometry(3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, steel);
    dish.rotation.x = Math.PI / 2;
    
    const dishPivot = new THREE.Group();
    dishPivot.position.set(-20, 20, 5);
    dishPivot.add(dish);
    group.add(dishPivot);

    // Animations: Door sliding and Antenna rotating
    const doorTrack = new THREE.NumberKeyframeTrack(`${door.uuid}.position[z]`, [0, 2, 4, 6, 8, 10], [0, 4, 4, 0, 0, 0]);
    const doorClip = new THREE.AnimationClip('AirlockCycle', 10, [doorTrack]);
    animationClips.push(doorClip);

    const antennaTrack = new THREE.NumberKeyframeTrack(`${dishPivot.uuid}.rotation[y]`, [0, 5, 10], [0, Math.PI, Math.PI * 2]);
    const antennaClip = new THREE.AnimationClip('AntennaSweep', 10, [antennaTrack]);
    animationClips.push(antennaClip);

    return { group, animationClips };
}
