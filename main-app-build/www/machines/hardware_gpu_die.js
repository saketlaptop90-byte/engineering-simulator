import * as materials from '../utils/materials.js';

export function createGPUDie(THREE) {
    const group = new THREE.Group();
    const clips = [];

    // Substrate
    const substrateGeo = new THREE.BoxGeometry(5, 0.1, 5);
    const substrate = new THREE.Mesh(substrateGeo, materials.greenPCB);
    group.add(substrate);

    // Compute Die
    const dieGeo = new THREE.BoxGeometry(2, 0.15, 2);
    const dieMat = materials.darkSteel.clone();
    dieMat.emissive = new THREE.Color(0x00ff88);
    dieMat.emissiveIntensity = 0;
    const die = new THREE.Mesh(dieGeo, dieMat);
    die.position.y = 0.125;
    die.name = "GPUDie";
    group.add(die);

    // HBM Stacks
    const hbmGeo = new THREE.BoxGeometry(0.6, 0.12, 1.8);
    const positions = [
        [-1.5, 0, 0], [1.5, 0, 0],
        [0, 0, -1.5], [0, 0, 1.5]
    ];
    positions.forEach((pos, i) => {
        const hbm = new THREE.Mesh(hbmGeo, materials.blackPlastic);
        hbm.position.set(pos[0], 0.11, pos[1]);
        if (pos[0] === 0) hbm.rotation.y = Math.PI / 2;
        group.add(hbm);
    });

    // Heat spreader rim
    const rimGeo = new THREE.BoxGeometry(4.8, 0.2, 4.8);
    const rimMat = materials.aluminum;
    const frame1 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 0.4), rimMat);
    frame1.position.set(0, 0.15, 2.2);
    const frame2 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 0.4), rimMat);
    frame2.position.set(0, 0.15, -2.2);
    const frame3 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 4.0), rimMat);
    frame3.position.set(2.2, 0.15, 0);
    const frame4 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 4.0), rimMat);
    frame4.position.set(-2.2, 0.15, 0);
    group.add(frame1, frame2, frame3, frame4);

    // Animation: Die processing pulse
    const times = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    const values = [0.1, 0.8, 0.2, 1.0, 0.3, 0.1];
    const pulseTrack = new THREE.NumberKeyframeTrack('GPUDie.material.emissiveIntensity', times, values);
    clips.push(new THREE.AnimationClip('Processing', 1, [pulseTrack]));

    return { group, animationClips: clips };
}
