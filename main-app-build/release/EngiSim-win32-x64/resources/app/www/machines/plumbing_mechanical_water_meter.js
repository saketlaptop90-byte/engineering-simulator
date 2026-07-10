import { copper, brass, iron, steel, rubber } from '../utils/materials.js';

export function createMechanicalWaterMeter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main casing
    const casingGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 32);
    const casing = new THREE.Mesh(casingGeo, brass);
    group.add(casing);

    // In/Out pipes
    const pipeGeo = new THREE.CylinderGeometry(1, 1, 6, 32);
    const pipe = new THREE.Mesh(pipeGeo, brass);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.y = -0.5;
    group.add(pipe);

    // Dial face
    const dialGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.2, 32);
    const dial = new THREE.Mesh(dialGeo, copper);
    dial.position.y = 1.1;
    group.add(dial);

    // Hands
    const handGroup1 = new THREE.Group();
    handGroup1.name = 'Hand1';
    handGroup1.position.y = 1.25;
    const hand1Geo = new THREE.BoxGeometry(0.1, 0.05, 1.5);
    const hand1 = new THREE.Mesh(hand1Geo, steel);
    hand1.position.z = -0.5;
    handGroup1.add(hand1);
    group.add(handGroup1);

    const handGroup2 = new THREE.Group();
    handGroup2.name = 'Hand2';
    handGroup2.position.set(1, 1.25, 1);
    const hand2Geo = new THREE.BoxGeometry(0.05, 0.05, 0.8);
    const hand2 = new THREE.Mesh(hand2Geo, steel);
    hand2.position.z = -0.3;
    handGroup2.add(hand2);
    group.add(handGroup2);

    // Internal turbine (visible underneath)
    const turbineGroup = new THREE.Group();
    turbineGroup.name = 'Turbine';
    turbineGroup.position.y = -0.5;
    
    const centerHubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const centerHub = new THREE.Mesh(centerHubGeo, rubber);
    turbineGroup.add(centerHub);

    for(let i=0; i<8; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 1.5);
        const blade = new THREE.Mesh(bladeGeo, rubber);
        blade.position.x = Math.cos((i * Math.PI) / 4) * 0.8;
        blade.position.z = Math.sin((i * Math.PI) / 4) * 0.8;
        blade.rotation.y = -(i * Math.PI) / 4;
        turbineGroup.add(blade);
    }
    group.add(turbineGroup);

    // Animation: Turbine spins, hands spin at different rates
    const times = [0, 2];
    
    const turbineTrack = new THREE.NumberKeyframeTrack('Turbine.rotation[y]', times, [0, Math.PI * 4]);
    const hand1Track = new THREE.NumberKeyframeTrack('Hand1.rotation[y]', times, [0, -Math.PI * 2]);
    const hand2Track = new THREE.NumberKeyframeTrack('Hand2.rotation[y]', times, [0, -Math.PI / 2]);

    const clip = new THREE.AnimationClip('MeterRunning', 2, [turbineTrack, hand1Track, hand2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
