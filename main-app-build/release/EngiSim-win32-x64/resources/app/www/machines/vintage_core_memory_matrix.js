import { wood, brass, copper, darkSteel, glass } from '../utils/materials.js';

export function createCoreMemoryMatrix(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const frameSize = 10;
    
    // Borders
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(frameSize + 1, 0.5, 0.5), wood);
    b1.position.y = frameSize / 2 + 0.25; group.add(b1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(frameSize + 1, 0.5, 0.5), wood);
    b2.position.y = -frameSize / 2 - 0.25; group.add(b2);
    const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, frameSize, 0.5), wood);
    b3.position.x = frameSize / 2 + 0.25; group.add(b3);
    const b4 = new THREE.Mesh(new THREE.BoxGeometry(0.5, frameSize, 0.5), wood);
    b4.position.x = -frameSize / 2 - 0.25; group.add(b4);

    const numWires = 16;
    const spacing = frameSize / numWires;

    const cores = [];

    // Wires and rings
    for(let i = 0; i < numWires; i++) {
        // Vertical wire
        const vWire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, frameSize), copper);
        vWire.position.x = -frameSize / 2 + spacing / 2 + i * spacing;
        group.add(vWire);

        // Horizontal wire
        const hWire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, frameSize), copper);
        hWire.rotation.z = Math.PI / 2;
        hWire.position.y = -frameSize / 2 + spacing / 2 + i * spacing;
        group.add(hWire);

        for(let j = 0; j < numWires; j++) {
            const coreGroup = new THREE.Group();
            coreGroup.position.set(-frameSize / 2 + spacing / 2 + i * spacing, -frameSize / 2 + spacing / 2 + j * spacing, 0);
            coreGroup.name = `core_group_${i}_${j}`;

            const ringGeom = new THREE.TorusGeometry(0.1, 0.04, 8, 16);
            const ring = new THREE.Mesh(ringGeom, darkSteel);
            ring.rotation.x = Math.PI / 4;
            ring.rotation.y = Math.PI / 4;
            coreGroup.add(ring);
            
            // Add a small inner glow object to animate
            const glowGeom = new THREE.SphereGeometry(0.08, 8, 8);
            const glowMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.8 });
            const glow = new THREE.Mesh(glowGeom, glowMat);
            glow.scale.set(0.01, 0.01, 0.01);
            glow.name = `glow_${i}_${j}`;
            coreGroup.add(glow);

            group.add(coreGroup);
            cores.push(glow);
        }
    }

    // Animation: randomly pulse the core glows
    const tracks = [];
    cores.forEach((glow) => {
        // Only animate a subset to save track space and look like busy memory
        if (Math.random() > 0.8) {
            const timeOffset = Math.random();
            const track = new THREE.VectorKeyframeTrack(
                `${glow.name}.scale`,
                [0, 0.5 + timeOffset * 0.5, 1, 1.5 + timeOffset * 0.2, 2],
                [0.01, 0.01, 0.01,   1.5, 1.5, 1.5,   0.01, 0.01, 0.01,   1.5, 1.5, 1.5,   0.01, 0.01, 0.01]
            );
            tracks.push(track);
        }
    });

    if (tracks.length > 0) {
        const clip = new THREE.AnimationClip('MemoryAccess', 2, tracks);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
