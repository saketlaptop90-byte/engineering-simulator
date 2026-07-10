import { steel, aluminum, glass, plastic, redAccent, greenAccent } from '../utils/materials.js';

export function createTollGate(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 });

    // Island
    const islandGeom = new THREE.BoxGeometry(2, 0.2, 6);
    const island = new THREE.Mesh(islandGeom, baseMat);
    island.position.set(0, 0.1, 0);
    group.add(island);

    // Booth
    const boothGeom = new THREE.BoxGeometry(1.5, 2.5, 2);
    const booth = new THREE.Mesh(boothGeom, aluminum);
    booth.position.set(0, 1.45, -1);
    group.add(booth);

    // Booth Window
    const winGeom = new THREE.BoxGeometry(1.55, 1, 1.5);
    const win = new THREE.Mesh(winGeom, glass);
    win.position.set(0, 1.6, -1);
    group.add(win);

    // Gate Mechanism Box
    const mechGeom = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const mech = new THREE.Mesh(mechGeom, steel);
    mech.position.set(0, 0.8, 1);
    group.add(mech);

    // Boom Pivot
    const boomPivot = new THREE.Group();
    boomPivot.position.set(0.5, 1.1, 1);
    boomPivot.name = 'BoomPivot';
    group.add(boomPivot);

    // Boom Arm
    const boomGeom = new THREE.BoxGeometry(4, 0.1, 0.05);
    const boom = new THREE.Mesh(boomGeom, plastic);
    boom.position.set(2, 0, 0);
    boomPivot.add(boom);

    // Stripes on boom
    for(let i=0; i<8; i++) {
        const stripeGeom = new THREE.BoxGeometry(0.2, 0.11, 0.06);
        const stripe = new THREE.Mesh(stripeGeom, redAccent);
        stripe.position.set(0.5 + i*0.4, 0, 0);
        boom.add(stripe);
    }

    // Traffic Light
    const lightBoxGeom = new THREE.BoxGeometry(0.3, 0.6, 0.2);
    const lightBox = new THREE.Mesh(lightBoxGeom, plastic);
    lightBox.position.set(-0.2, 2.5, 1);
    group.add(lightBox);

    const redLight = new THREE.Mesh(new THREE.SphereGeometry(0.1), redAccent);
    redLight.position.set(-0.2, 2.65, 1.1);
    redLight.name = 'RedLight';
    group.add(redLight);

    const greenLight = new THREE.Mesh(new THREE.SphereGeometry(0.1), greenAccent);
    greenLight.position.set(-0.2, 2.35, 1.1);
    greenLight.scale.set(0.01, 0.01, 0.01);
    greenLight.name = 'GreenLight';
    group.add(greenLight);

    // Animations
    const boomTrack = new THREE.NumberKeyframeTrack(
        'BoomPivot.rotation[z]',
        [0, 1, 4, 5, 6],
        [0, Math.PI / 2, Math.PI / 2, 0, 0]
    );

    const redScale = new THREE.VectorKeyframeTrack(
        'RedLight.scale',
        [0, 0.5, 4.5, 5, 6],
        [1,1,1, 0.01,0.01,0.01, 0.01,0.01,0.01, 1,1,1, 1,1,1]
    );

    const greenScale = new THREE.VectorKeyframeTrack(
        'GreenLight.scale',
        [0, 0.5, 4.5, 5, 6],
        [0.01,0.01,0.01, 1,1,1, 1,1,1, 0.01,0.01,0.01, 0.01,0.01,0.01]
    );

    const clip = new THREE.AnimationClip('TollOperation', 6, [boomTrack, redScale, greenScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
