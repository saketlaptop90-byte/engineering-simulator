import { darkSteel, copper, titanium } from '../utils/materials.js';

export function createTectonicMonitor(THREE) {
    const group = new THREE.Group();
    group.name = "TectonicMonitor";

    // Base
    const baseGeo = new THREE.BoxGeometry(8, 2, 8);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 1;
    group.add(base);

    // Seismic spikes
    const spikes = new THREE.Group();
    for(let i=0; i<4; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.5, 5, 16);
        const spike = new THREE.Mesh(spikeGeo, titanium);
        spike.position.set(
            (i % 2 === 0 ? 1 : -1) * 3,
            -1.5,
            (i < 2 ? 1 : -1) * 3
        );
        spike.rotation.x = Math.PI;
        spikes.add(spike);
    }
    group.add(spikes);

    // Rotating dish
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 5, 0);
    const mountGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const mount = new THREE.Mesh(mountGeo, darkSteel);
    dishGroup.add(mount);

    const dishGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const dish = new THREE.Mesh(dishGeo, copper);
    dish.position.y = 2;
    dish.rotation.x = -Math.PI / 4;
    dishGroup.add(dish);

    group.add(dishGroup);

    // Animation: Vibration for base & rotation for dish
    const tracks = [];
    
    // Dish rotation
    tracks.push(new THREE.NumberKeyframeTrack(
        `${dishGroup.uuid}.rotation[y]`,
        [0, 4],
        [0, Math.PI * 2]
    ));

    // Base vibration
    const vibTimes = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1.0];
    const vibValues = [0, 0.1, -0.1, 0.1, -0.1, 0, 0];
    tracks.push(new THREE.NumberKeyframeTrack(
        `${base.uuid}.position[x]`,
        vibTimes,
        vibValues
    ));

    const clip = new THREE.AnimationClip("MonitorActive", 1, tracks);

    return { group, animationClips: [clip] };
}
