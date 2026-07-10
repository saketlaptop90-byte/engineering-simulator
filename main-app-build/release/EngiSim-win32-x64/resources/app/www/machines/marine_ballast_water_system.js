import { materials } from '../utils/materials.js';

export function createBallastWaterSystem(THREE) {
    const group = new THREE.Group();
    group.name = 'ballastSystem';
    const animationClips = [];

    // Main Tank
    const tankGeo = new THREE.CylinderGeometry(4, 4, 12, 32);
    const tank = new THREE.Mesh(tankGeo, materials.steel);
    tank.position.set(0, 6, 0);
    group.add(tank);

    // Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const pipe1 = new THREE.Mesh(pipeGeo, materials.plastic || materials.metal);
    pipe1.position.set(4.5, 6, 0);
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(pipeGeo, materials.plastic || materials.metal);
    pipe2.position.set(-4.5, 6, 0);
    group.add(pipe2);

    // UV Treatment Chamber
    const uvGeo = new THREE.BoxGeometry(3, 4, 3);
    const uvChamber = new THREE.Mesh(uvGeo, materials.glass || materials.metal);
    uvChamber.position.set(0, 6, 4.5);
    group.add(uvChamber);

    // Pumps
    const pumpGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const pump1 = new THREE.Mesh(pumpGeo, materials.brass || materials.metal);
    pump1.position.set(4.5, 2, 0);
    pump1.name = 'pump1';
    group.add(pump1);

    const pump2 = new THREE.Mesh(pumpGeo, materials.brass || materials.metal);
    pump2.position.set(-4.5, 2, 0);
    pump2.name = 'pump2';
    group.add(pump2);

    // Animations
    const pump1Track = new THREE.NumberKeyframeTrack('pump1.rotation[y]', [0, 1], [0, Math.PI * 2]);
    const pump2Track = new THREE.NumberKeyframeTrack('pump2.rotation[y]', [0, 1], [0, Math.PI * 2]);
    
    const clip = new THREE.AnimationClip('PumpOperation', 1, [pump1Track, pump2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
