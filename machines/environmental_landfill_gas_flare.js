import * as materials from '../utils/materials.js';

export function createLandfillGasFlare(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Pad
    const padGeom = new THREE.BoxGeometry(6, 0.5, 6);
    const pad = new THREE.Mesh(padGeom, materials.ceramic);
    pad.position.y = 0.25;
    group.add(pad);

    // Main Flare Stack
    const stackGeom = new THREE.CylinderGeometry(1, 1.2, 15, 32);
    const stack = new THREE.Mesh(stackGeom, materials.darkSteel);
    stack.position.y = 8;
    group.add(stack);

    // Burner Head / Windshield
    const headGeom = new THREE.CylinderGeometry(1.5, 1, 2, 32);
    const head = new THREE.Mesh(headGeom, materials.steel);
    head.position.y = 16.5;
    group.add(head);

    // Blower / Compressor
    const blowerGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 16);
    const blower = new THREE.Mesh(blowerGeom, materials.castIron);
    blower.rotation.x = Math.PI / 2;
    blower.position.set(3, 1.5, 0);
    group.add(blower);

    const blowerMotor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), materials.blueAccent);
    blowerMotor.position.set(4.5, 1.5, 0);
    group.add(blowerMotor);

    // Gas Piping
    const pipeGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const pipe1 = new THREE.Mesh(pipeGeom, materials.yellowAccent);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(1.5, 1.5, 0);
    group.add(pipe1);

    // Flame
    const flameGroup = new THREE.Group();
    flameGroup.name = 'flare_flameGroup';
    flameGroup.position.set(0, 17.5, 0);
    group.add(flameGroup);

    const flameCoreGeom = new THREE.ConeGeometry(0.8, 3, 16);
    const flameCore = new THREE.Mesh(flameCoreGeom, materials.fire);
    flameCore.position.y = 1.5;
    flameGroup.add(flameCore);

    const flameOuterGeom = new THREE.ConeGeometry(1.2, 4, 16);
    const flameOuterMat = materials.fire.clone();
    flameOuterMat.transparent = true;
    flameOuterMat.opacity = 0.6;
    flameOuterMat.color.setHex(0xffaa00);
    const flameOuter = new THREE.Mesh(flameOuterGeom, flameOuterMat);
    flameOuter.position.y = 2;
    flameGroup.add(flameOuter);

    // Heat waves / Particles
    const particleGroup = new THREE.Group();
    for(let i=0; i<10; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.2, 4, 4), flameOuterMat);
        p.position.set((Math.random()-0.5)*1.5, Math.random()*3, (Math.random()-0.5)*1.5);
        particleGroup.add(p);
    }
    flameGroup.add(particleGroup);

    // Animation
    const flameScaleTrack = new THREE.VectorKeyframeTrack(
        `flare_flameGroup.scale`,
        [0, 0.25, 0.5, 0.75, 1],
        [1, 1, 1,  1.1, 1.2, 1.1,  0.9, 0.8, 0.9,  1.05, 1.1, 1.05,  1, 1, 1]
    );

    const particleTracks = [];
    particleGroup.children.forEach((p, index) => {
        p.name = `flare_particle_${index}`;
        const startY = p.position.y;
        const endY = startY + 3;
        const track = new THREE.VectorKeyframeTrack(
            `${p.name}.position`,
            [0, 1],
            [p.position.x, startY, p.position.z, p.position.x, endY, p.position.z]
        );
        particleTracks.push(track);
    });

    const clip = new THREE.AnimationClip('Flare_Burn', 1, [flameScaleTrack, ...particleTracks]);
    animationClips.push(clip);

    group.userData.animatedObjects = [flameGroup, ...particleGroup.children];

    return { group, animationClips };
}
