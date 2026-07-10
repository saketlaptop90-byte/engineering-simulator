import { steel, aluminum, copper, glass, blueAccent, whitePlastic } from '../utils/materials.js';

export function createHeliumLiquefier(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base platform
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 8);
    const base = new THREE.Mesh(baseGeo, steel);
    base.position.y = 0.25;
    group.add(base);

    // Main compressor
    const compressorGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const compressor = new THREE.Mesh(compressorGeo, aluminum);
    compressor.position.set(-2, 2.5, 0);
    group.add(compressor);

    // Compressor fan
    const fanGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 16);
    const fan = new THREE.Mesh(fanGeo, blueAccent);
    fan.position.set(-2, 4.6, 0);
    group.add(fan);

    // Heat Exchanger (Cold Box)
    const coldBoxGeo = new THREE.BoxGeometry(3, 6, 3);
    const coldBox = new THREE.Mesh(coldBoxGeo, whitePlastic);
    coldBox.position.set(2, 3.5, -1);
    group.add(coldBox);

    // Expansion Turbines
    const turbineGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const turbine1 = new THREE.Mesh(turbineGeo, copper);
    turbine1.position.set(2, 2, 1.2);
    turbine1.rotation.x = Math.PI / 2;
    group.add(turbine1);
    
    const turbine2 = new THREE.Mesh(turbineGeo, copper);
    turbine2.position.set(2, 4, 1.2);
    turbine2.rotation.x = Math.PI / 2;
    group.add(turbine2);

    // Pipes connecting compressor to cold box
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const pipe = new THREE.Mesh(pipeGeo, steel);
    pipe.position.set(0, 3, 0);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    // Liquid Helium Storage Dewar
    const dewarGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const dewar = new THREE.Mesh(dewarGeo, glass);
    dewar.position.set(2, 2, 3);
    group.add(dewar);
    
    // Condensing vapor (particles)
    const vaporGroup = new THREE.Group();
    dewar.add(vaporGroup);
    const vaporGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const vapors = [];
    for(let i=0; i<20; i++) {
        const v = new THREE.Mesh(vaporGeo, blueAccent);
        v.position.set((Math.random()-0.5)*1.5, (Math.random()-0.5)*2.5, (Math.random()-0.5)*1.5);
        vaporGroup.add(v);
        vapors.push(v);
    }

    // Animations
    // 1. Fan spinning
    const fanTrack = new THREE.NumberKeyframeTrack(
        '.rotation[y]',
        [0, 1],
        [0, Math.PI * 2]
    );
    const fanClip = new THREE.AnimationClip('SpinFan', 1, [fanTrack]);
    animationClips.push({ clip: fanClip, target: fan });

    // 2. Turbines spinning
    const turbineTrack1 = new THREE.NumberKeyframeTrack(
        '.rotation[y]',
        [0, 0.5],
        [0, Math.PI * 2]
    );
    const turbineClip = new THREE.AnimationClip('SpinTurbine', 0.5, [turbineTrack1]);
    animationClips.push({ clip: turbineClip, target: turbine1 });
    animationClips.push({ clip: turbineClip, target: turbine2 });

    // 3. Vapor condensing (moving down)
    vapors.forEach((v, index) => {
        const startY = v.position.y;
        const endY = startY - 1.0;
        const track = new THREE.NumberKeyframeTrack(
            '.position[y]',
            [0, 2],
            [startY, endY < -1.2 ? 1.2 : endY]
        );
        const clip = new THREE.AnimationClip(`VaporMove_${index}`, 2, [track]);
        animationClips.push({ clip, target: v });
    });

    return { group, animationClips };
}
