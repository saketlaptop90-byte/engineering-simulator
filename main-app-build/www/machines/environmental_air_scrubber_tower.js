import * as mats from '../utils/materials.js';

export function createAirScrubberTower(THREE) {
    const materials = mats.materials || mats;
    const group = new THREE.Group();
    const animationClips = [];

    const matPlastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.1 });
    const matPacking = materials.packing || new THREE.MeshStandardMaterial({ color: 0x55aa55, wireframe: true });
    const matGas = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
    const matLiquid = materials.water || new THREE.MeshBasicMaterial({ color: 0x0055ff, transparent: true, opacity: 0.5 });

    // Tower Body
    const towerGeo = new THREE.CylinderGeometry(3, 3, 12, 32);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    group.add(tower);

    // Packing Material Section
    const packingGeo = new THREE.CylinderGeometry(2.9, 2.9, 6, 16);
    const packing = new THREE.Mesh(packingGeo, matPacking);
    group.add(packing);

    // Inlets and Outlets
    const pipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    
    // Gas inlet
    const gasInlet = new THREE.Mesh(pipeGeo, matPlastic);
    gasInlet.rotation.z = Math.PI / 2;
    gasInlet.position.set(-3.5, -4.5, 0);
    group.add(gasInlet);

    // Gas outlet
    const gasOutlet = new THREE.Mesh(pipeGeo, matPlastic);
    gasOutlet.position.set(0, 6.5, 0);
    group.add(gasOutlet);

    // Liquid inlet
    const liquidInlet = new THREE.Mesh(pipeGeo, matPlastic);
    liquidInlet.rotation.z = Math.PI / 2;
    liquidInlet.position.set(3.5, 4.5, 0);
    group.add(liquidInlet);

    // Animations: Flowing gas and dripping liquid
    const gasStream = new THREE.Group();
    gasStream.name = "GasStream";
    group.add(gasStream);

    const gasParticleGeo = new THREE.SphereGeometry(0.3, 8, 8);
    for(let i=0; i<15; i++) {
        const p = new THREE.Mesh(gasParticleGeo, matGas);
        p.position.set((Math.random()-0.5)*4, -5 + i*0.8, (Math.random()-0.5)*4);
        gasStream.add(p);
    }
    
    const liquidStream = new THREE.Group();
    liquidStream.name = "LiquidStream";
    group.add(liquidStream);

    const liquidParticleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    for(let i=0; i<20; i++) {
        const p = new THREE.Mesh(liquidParticleGeo, matLiquid);
        p.position.set((Math.random()-0.5)*5, 5 - i*0.5, (Math.random()-0.5)*5);
        liquidStream.add(p);
    }

    // Move gas UP, move liquid DOWN
    const gasTrack = new THREE.VectorKeyframeTrack(`GasStream.position`, [0, 2], [
        0, 0, 0,
        0, 2, 0
    ]);
    const liquidTrack = new THREE.VectorKeyframeTrack(`LiquidStream.position`, [0, 2], [
        0, 0, 0,
        0, -2, 0
    ]);

    const gasClip = new THREE.AnimationClip('GasRise', 2, [gasTrack]);
    const liquidClip = new THREE.AnimationClip('LiquidFall', 2, [liquidTrack]);
    
    animationClips.push(gasClip, liquidClip);

    return { group, animationClips };
}
