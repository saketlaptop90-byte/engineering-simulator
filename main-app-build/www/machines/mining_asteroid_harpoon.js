import { darkSteel, titanium, copper, glass } from '../utils/materials.js';

export function createAsteroidHarpoon(THREE) {
    const group = new THREE.Group();
    group.name = "AsteroidAnchoringHarpoon";

    // Base Mount
    const baseGeo = new THREE.CylinderGeometry(2.5, 3, 1, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 0.5;
    group.add(base);

    // Swivel Mount
    const swivelGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const swivel = new THREE.Mesh(swivelGeo, titanium);
    swivel.position.y = 1.5;
    group.add(swivel);

    // Launcher Tube
    const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 5, 16);
    const tube = new THREE.Mesh(tubeGeo, darkSteel);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, 1.5, 1.5);
    group.add(tube);

    // Harpoon Projectile
    const harpoonGroup = new THREE.Group();
    harpoonGroup.name = "HarpoonProjectile";
    
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const shaft = new THREE.Mesh(shaftGeo, titanium);
    shaft.rotation.x = Math.PI / 2;
    
    const tipGeo = new THREE.ConeGeometry(0.6, 1.5, 16);
    const tip = new THREE.Mesh(tipGeo, titanium);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 2.75;
    
    // Retaining Barbs
    for (let i = 0; i < 4; i++) {
        const barbGeo = new THREE.ConeGeometry(0.2, 0.8, 8);
        const barb = new THREE.Mesh(barbGeo, darkSteel);
        barb.position.z = 2.0;
        barb.rotation.x = Math.PI / 2 - 0.5;
        const pivot = new THREE.Group();
        pivot.rotation.z = (Math.PI / 2) * i;
        pivot.add(barb);
        harpoonGroup.add(pivot);
    }

    harpoonGroup.add(shaft);
    harpoonGroup.add(tip);
    harpoonGroup.position.set(0, 1.5, 2);
    group.add(harpoonGroup);

    // Tether Cable
    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    // Shift geometry so scaling from 1 origin stretches it correctly
    cableGeo.translate(0, 0.5, 0); 
    const cable = new THREE.Mesh(cableGeo, copper);
    cable.rotation.x = Math.PI / 2;
    cable.position.set(0, 1.5, 0);
    cable.name = "TetherCable";
    group.add(cable);

    // Animation: Firing, Holding, Retracting
    const times = [0, 0.5, 2.5, 3.5];
    const posValues = [
        0, 1.5, 2,  // loaded
        0, 1.5, 15, // embedded in asteroid
        0, 1.5, 15, // holding tension
        0, 1.5, 2   // retracted
    ];
    
    const cableScale = [
        1, 2, 1,
        1, 15, 1,
        1, 15, 1,
        1, 2, 1
    ];

    const harpoonTrack = new THREE.VectorKeyframeTrack('HarpoonProjectile.position', times, posValues);
    const cableTrack = new THREE.VectorKeyframeTrack('TetherCable.scale', times, cableScale);
    
    const clip = new THREE.AnimationClip('FireAndRetract', 4, [harpoonTrack, cableTrack]);

    return { group, animationClips: [clip] };
}
