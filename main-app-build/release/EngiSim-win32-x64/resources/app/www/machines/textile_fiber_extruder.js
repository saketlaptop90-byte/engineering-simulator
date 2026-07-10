import * as materials from '../utils/materials.js';

export function createFiberExtruder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metal || new THREE.MeshStandardMaterial({color: 0x999999});
    const matHot = materials.hot || new THREE.MeshStandardMaterial({color: 0xff4400, emissive: 0xaa2200});
    const matFiber = materials.plastic || new THREE.MeshStandardMaterial({color: 0xddddff, transparent: true, opacity: 0.8});

    const hopperGeo = new THREE.ConeGeometry(1, 2, 16);
    const hopper = new THREE.Mesh(hopperGeo, matMetal);
    hopper.rotation.x = Math.PI;
    hopper.position.set(0, 5, 0);
    group.add(hopper);

    const barrelGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const barrel = new THREE.Mesh(barrelGeo, matMetal);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(1.5, 4, 0);
    group.add(barrel);

    for(let i=0; i<4; i++) {
        const heater = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 8, 32), matHot);
        heater.rotation.y = Math.PI / 2;
        heater.position.set(0.5 + i*0.6, 4, 0);
        group.add(heater);
    }

    const dieGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
    const die = new THREE.Mesh(dieGeo, matHot);
    die.position.set(3, 3.5, 0);
    group.add(die);

    const tracks = [];
    for (let i = 0; i < 5; i++) {
        const xOffset = (Math.random() - 0.5) * 0.4;
        const zOffset = (Math.random() - 0.5) * 0.4;
        const fiber = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3, 8), matFiber);
        fiber.position.set(3 + xOffset, 1.75, zOffset);
        group.add(fiber);
        
        tracks.push(new THREE.NumberKeyframeTrack(`${fiber.uuid}.position[y]`, [0, 1], [1.75, 1.5]));
    }

    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 32), matMetal);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(3, -0.5, 0);
    group.add(wheel);

    tracks.push(new THREE.NumberKeyframeTrack(`${wheel.uuid}.rotation[x]`, [0, 1], [Math.PI/2, Math.PI/2 + Math.PI*2]));

    const clip = new THREE.AnimationClip('ExtrusionOperation', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
