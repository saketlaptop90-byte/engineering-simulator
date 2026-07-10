import { darkSteel, copper, titanium } from '../utils/materials.js';

export function createMagmaTap(THREE) {
    const group = new THREE.Group();
    group.name = "MagmaTap";

    // Core tapping pipe
    const pipeGeo = new THREE.CylinderGeometry(2, 2, 20, 32);
    const pipe = new THREE.Mesh(pipeGeo, darkSteel);
    pipe.position.y = 10;
    group.add(pipe);

    // Copper cooling rings
    const rings = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(2.5, 0.5, 16, 32);
        const ring = new THREE.Mesh(ringGeo, copper);
        ring.position.y = 4 + i * 3;
        ring.rotation.x = Math.PI / 2;
        rings.add(ring);
    }
    group.add(rings);

    // Storage tank
    const tankGeo = new THREE.SphereGeometry(6, 32, 32);
    const tank = new THREE.Mesh(tankGeo, titanium);
    tank.position.set(10, 6, 0);
    group.add(tank);

    // Connector pipe
    const connGeo = new THREE.CylinderGeometry(1, 1, 10, 16);
    const conn = new THREE.Mesh(connGeo, darkSteel);
    conn.rotation.z = Math.PI / 2;
    conn.position.set(5, 6, 0);
    group.add(conn);

    // Pumping Animation for rings
    const tracks = [];
    
    rings.children.forEach((ring, index) => {
        // Sequential scaling animation to simulate magma pumping through
        const times = [0, 0.2, 0.4, 1.0];
        const offset = index * 0.1;
        const adjustedTimes = times.map(t => (t + offset) % 1.0).sort();
        
        // Simplifying the animation track mapping for THREE.js vector keyframes
        const track = new THREE.VectorKeyframeTrack(
            `${ring.uuid}.scale`,
            [0, 0.5, 1],
            [1, 1, 1, 1.25, 1.25, 1.25, 1, 1, 1]
        );
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip("MagmaPump", 1, tracks);

    return { group, animationClips: [clip] };
}
