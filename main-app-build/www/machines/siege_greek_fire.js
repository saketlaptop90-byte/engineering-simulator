import { wood, iron, steel } from '../utils/materials.js';

export function createGreekFireSiphon(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure (often mounted on ships, but here a simple cart/stand)
    const baseGeo = new THREE.BoxGeometry(4, 1, 6);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 0.5;
    group.add(base);

    // Boiler / Cauldron
    const boilerGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.5, 16);
    const boiler = new THREE.Mesh(boilerGeo, iron);
    boiler.position.set(0, 2.25, 1);
    group.add(boiler);

    // Pump mechanism
    const pumpGroup = new THREE.Group();
    pumpGroup.name = 'pumpGroup';
    pumpGroup.position.set(0, 4.5, 1);

    const handleGeo = new THREE.BoxGeometry(0.2, 3, 0.2);
    const handle = new THREE.Mesh(handleGeo, wood);
    pumpGroup.add(handle);
    group.add(pumpGroup);

    // Tube/Siphon nozzle
    const tubeGeo = new THREE.CylinderGeometry(0.2, 0.4, 4, 16);
    const tube = new THREE.Mesh(tubeGeo, steel);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, 3, -1);
    group.add(tube);

    // Fire effect (simplified as scaling glowing cone)
    const fireGeo = new THREE.ConeGeometry(1, 4, 16);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.8 });
    const fire = new THREE.Mesh(fireGeo, fireMat);
    fire.name = 'fire';
    fire.rotation.x = -Math.PI / 2;
    fire.position.set(0, 3, -5);
    fire.scale.set(0.1, 0.1, 0.1); // Starts off
    group.add(fire);

    // Animation: pump handle goes up/down, fire grows
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    
    // Pump handle rotation (pumping action)
    const pumpRot = [0, Math.PI/4, 0, -Math.PI/4, 0];
    const pumpTrack = new THREE.NumberKeyframeTrack('pumpGroup.rotation[x]', times, pumpRot);

    // Fire scaling
    const fireScale = [
        0.1, 0.1, 0.1,
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1,
        0.1, 0.1, 0.1
    ];
    const fireTrack = new THREE.VectorKeyframeTrack('fire.scale', times, fireScale);

    const clip = new THREE.AnimationClip('Spray', 2, [pumpTrack, fireTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
