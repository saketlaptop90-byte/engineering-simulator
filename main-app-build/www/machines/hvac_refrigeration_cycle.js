import { copper, steel, plastic, redAccent, blueAccent, darkSteel } from '../utils/materials.js';

export function createRefrigerationCycle(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Compressor
    const compressor = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32), darkSteel);
    compressor.position.set(-3, 0, 0);
    group.add(compressor);

    // Condenser (Hot side)
    const condenser = new THREE.Group();
    condenser.position.set(0, 3, 0);
    for(let i=0; i<5; i++) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 16), redAccent);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.y = i * 0.4 - 0.8;
        condenser.add(pipe);
    }
    group.add(condenser);

    // Expansion Valve
    const valve = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), steel);
    valve.position.set(3, 0, 0);
    group.add(valve);

    // Evaporator (Cold side)
    const evaporator = new THREE.Group();
    evaporator.position.set(0, -3, 0);
    for(let i=0; i<5; i++) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 16), blueAccent);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.y = i * 0.4 - 0.8;
        evaporator.add(pipe);
    }
    group.add(evaporator);

    // Connectors
    const connect1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), copper);
    connect1.position.set(-2, 1.5, 0);
    connect1.rotation.z = Math.PI / 4;
    group.add(connect1);

    const connect2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), copper);
    connect2.position.set(2, 1.5, 0);
    connect2.rotation.z = -Math.PI / 4;
    group.add(connect2);

    const connect3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), copper);
    connect3.position.set(2, -1.5, 0);
    connect3.rotation.z = Math.PI / 4;
    group.add(connect3);

    const connect4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), copper);
    connect4.position.set(-2, -1.5, 0);
    connect4.rotation.z = -Math.PI / 4;
    group.add(connect4);

    // Particle Flow Animation Placeholder
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const particle1 = new THREE.Mesh(particleGeo, redAccent);
    particle1.name = "Particle1";
    group.add(particle1);
    
    const times = [0, 0.25, 0.5, 0.75, 1.0];
    const pos = [
        -3, 0, 0,
        0, 3, 0,
        3, 0, 0,
        0, -3, 0,
        -3, 0, 0
    ];

    const posTrack = new THREE.VectorKeyframeTrack('Particle1.position', times, pos);
    
    const clip = new THREE.AnimationClip('cycle_flow', 2, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
