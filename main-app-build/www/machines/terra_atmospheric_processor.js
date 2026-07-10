import { darkSteel, aluminum, glass } from '../utils/materials.js';

export function createAtmosphereProcessor(THREE) {
    const group = new THREE.Group();
    group.name = 'Atmospheric Processor Plant';

    // Main tower
    const towerGeom = new THREE.CylinderGeometry(4, 6, 20, 16);
    const tower = new THREE.Mesh(towerGeom, darkSteel);
    tower.position.y = 10;
    group.add(tower);

    // Vents / Fans
    const fans = [];
    for (let i = 0; i < 3; i++) {
        const ventGroup = new THREE.Group();
        ventGroup.position.set(0, 5 + i * 5, 0);

        const fanGeom = new THREE.BoxGeometry(10, 0.5, 1);
        const fan = new THREE.Mesh(fanGeom, aluminum);
        fan.name = `ProcessorFan_${i}`;
        ventGroup.add(fan);
        fans.push(fan);

        group.add(ventGroup);
    }

    // Cooling ring
    const ringGeom = new THREE.TorusGeometry(8, 1, 16, 32);
    const ring = new THREE.Mesh(ringGeom, glass);
    ring.position.y = 2;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Animation: Fans spinning
    const tracks = [];
    fans.forEach((fan, i) => {
        const times = [0, 2];
        const values = [0, Math.PI * (i % 2 === 0 ? 4 : -4)]; // alternate direction
        tracks.push(new THREE.NumberKeyframeTrack(`${fan.name}.rotation[y]`, times, values));
    });

    const clip = new THREE.AnimationClip('ProcessAtmosphere', 2, tracks);

    return { group, animationClips: [clip] };
}
