import { steel, aluminum, glass, blueAccent, whitePlastic } from '../utils/materials.js';

export function createCryogenicWindTunnelCore(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Tunnel Tube
    const tunnelGeo = new THREE.CylinderGeometry(4, 4, 20, 32, 1, true); // open ended tube
    const tunnel = new THREE.Mesh(tunnelGeo, steel);
    tunnel.rotation.z = Math.PI / 2;
    tunnel.material.side = THREE.DoubleSide;
    group.add(tunnel);

    // Test Section (glass window)
    const testSectionGeo = new THREE.CylinderGeometry(4.1, 4.1, 4, 32, 1, true, 0, Math.PI);
    const testSection = new THREE.Mesh(testSectionGeo, glass);
    testSection.rotation.z = Math.PI / 2;
    testSection.rotation.y = Math.PI;
    testSection.material.side = THREE.DoubleSide;
    group.add(testSection);

    // Liquid Nitrogen Injectors
    const injectorGeo = new THREE.BoxGeometry(1, 1, 1);
    for(let i=0; i<4; i++) {
        const injector = new THREE.Mesh(injectorGeo, whitePlastic);
        const angle = (i / 4) * Math.PI * 2;
        injector.position.set(-6, Math.cos(angle)*4.2, Math.sin(angle)*4.2);
        group.add(injector);
    }

    // Giant Turbine Fan
    const fanGroup = new THREE.Group();
    fanGroup.position.set(-8, 0, 0);
    fanGroup.rotation.z = Math.PI / 2;
    group.add(fanGroup);

    const hubGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    fanGroup.add(hub);

    const bladeGeo = new THREE.BoxGeometry(0.1, 3.5, 1);
    for(let i=0; i<8; i++) {
        const blade = new THREE.Mesh(bladeGeo, blueAccent);
        const angle = (i / 8) * Math.PI * 2;
        blade.position.set(Math.cos(angle)*2.5, 0, Math.sin(angle)*2.5);
        blade.rotation.y = -angle;
        blade.rotation.x = Math.PI / 4; // pitch
        fanGroup.add(blade);
    }

    // Sample Mount in test section
    const mountGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const mount = new THREE.Mesh(mountGeo, steel);
    mount.position.set(0, -2, 0);
    group.add(mount);
    
    // Sample (Airfoil)
    const airfoilGeo = new THREE.BoxGeometry(1, 0.1, 2);
    const airfoil = new THREE.Mesh(airfoilGeo, aluminum);
    airfoil.position.set(0, 0, 0);
    airfoil.rotation.z = Math.PI / 8; // angle of attack
    group.add(airfoil);

    // Vapor streams
    const streamGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const streams = [];
    for(let i=0; i<20; i++) {
        const stream = new THREE.Mesh(streamGeo, glass);
        stream.rotation.z = Math.PI / 2;
        stream.position.set(-4 + Math.random()*8, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
        group.add(stream);
        streams.push(stream);
    }

    // Animations
    // 1. Turbine fan spinning
    const fanTrack = new THREE.NumberKeyframeTrack(
        '.rotation[y]',
        [0, 1],
        [0, -Math.PI * 2]
    );
    const fanClip = new THREE.AnimationClip('SpinFan', 1, [fanTrack]);
    animationClips.push({ clip: fanClip, target: fanGroup });

    // 2. Vapor streams moving fast across the tunnel
    streams.forEach((stream, index) => {
        const startX = stream.position.x;
        const track = new THREE.NumberKeyframeTrack(
            '.position[x]',
            [0, 0.5],
            [startX, startX + 10]
        );
        const clip = new THREE.AnimationClip(`VaporStream_${index}`, 0.5, [track]);
        animationClips.push({ clip, target: stream });
    });

    return { group, animationClips };
}
