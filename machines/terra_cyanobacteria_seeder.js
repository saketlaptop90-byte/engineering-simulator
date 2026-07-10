import { darkSteel, aluminum, glass } from '../utils/materials.js';

export function createCyanobacteriaSeederDrone(THREE) {
    const group = new THREE.Group();
    group.name = 'Cyanobacteria Seeder Drone';

    // Drone Body
    const bodyGeometry = new THREE.CylinderGeometry(2, 2, 1, 16);
    const body = new THREE.Mesh(bodyGeometry, darkSteel);
    group.add(body);

    // Propellers
    const propellers = [];
    for (let i = 0; i < 4; i++) {
        const propGroup = new THREE.Group();
        const armGeom = new THREE.BoxGeometry(4, 0.2, 0.5);
        const arm = new THREE.Mesh(armGeom, aluminum);
        arm.position.x = 2;
        propGroup.add(arm);

        const bladeGeom = new THREE.BoxGeometry(0.2, 0.1, 3);
        const blade = new THREE.Mesh(bladeGeom, glass);
        blade.position.set(4, 0.2, 0);
        propGroup.add(blade);
        propellers.push(blade);

        propGroup.rotation.y = (Math.PI / 2) * i;
        group.add(propGroup);
    }

    // Seed Tank
    const tankGeom = new THREE.SphereGeometry(1.5, 16, 16);
    const tank = new THREE.Mesh(tankGeom, glass);
    tank.position.y = -1;
    group.add(tank);

    // Animation: Spinning propellers
    const tracks = [];
    propellers.forEach((prop, i) => {
        prop.name = `Propeller_${i}`;
        const trackName = `${prop.name}.rotation[y]`;
        const times = [0, 1];
        const values = [0, Math.PI * 10];
        tracks.push(new THREE.NumberKeyframeTrack(trackName, times, values));
    });

    const clip = new THREE.AnimationClip('Deploy', 1, tracks);

    return { group, animationClips: [clip] };
}
