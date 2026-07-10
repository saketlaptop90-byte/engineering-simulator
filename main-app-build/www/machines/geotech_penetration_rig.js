import * as mats from '../utils/materials.js';

export function createPenetrationRig(THREE) {
    const group = new THREE.Group();
    group.name = 'PenetrationRig';
    
    // Base platform
    const baseGeo = new THREE.BoxGeometry(3, 0.2, 4);
    const base = new THREE.Mesh(baseGeo, mats.darkSteel);
    base.position.y = 0.1;
    group.add(base);

    // Mast
    const mastGeo = new THREE.BoxGeometry(0.3, 8, 0.3);
    const mast = new THREE.Mesh(mastGeo, mats.steel);
    mast.position.set(0, 4.1, -1);
    group.add(mast);

    // Drill Rod
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
    const rod = new THREE.Mesh(rodGeo, mats.chrome);
    rod.position.set(0, 3, -0.6);
    group.add(rod);
    
    // Hammer
    const hammerGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const hammer = new THREE.Mesh(hammerGeo, mats.yellowAccent);
    hammer.position.set(0, 5, -0.6);
    hammer.name = 'SPTHammer';
    group.add(hammer);
    
    // Anvil
    const anvilGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const anvil = new THREE.Mesh(anvilGeo, mats.castIron);
    anvil.position.set(0, 4.1, -0.6);
    group.add(anvil);

    // Animation for hammer dropping
    const times = [0, 0.2, 0.3, 0.8, 1.0];
    const values = [
        0, 5, -0.6,
        0, 4.3, -0.6,
        0, 4.3, -0.6,
        0, 5, -0.6,
        0, 5, -0.6
    ];
    
    const hammerTrack = new THREE.VectorKeyframeTrack('SPTHammer.position', times, values);
    const clip = new THREE.AnimationClip('HammerDrop', 1.0, [hammerTrack]);
    
    return { group, animationClips: [clip] };
}
