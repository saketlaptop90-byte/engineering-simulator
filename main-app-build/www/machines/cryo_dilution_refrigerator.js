import { gold, copper, brass, steel, chrome, redAccent, blueAccent } from '../utils/materials.js';

export function createDilutionRefrigerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Top mounting plate
    const topPlateGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const topPlate = new THREE.Mesh(topPlateGeo, steel);
    topPlate.position.y = 10;
    group.add(topPlate);

    // 50K Plate
    const plate50KGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
    const plate50K = new THREE.Mesh(plate50KGeo, copper);
    plate50K.position.y = 8;
    group.add(plate50K);

    // 4K Plate
    const plate4KGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const plate4K = new THREE.Mesh(plate4KGeo, brass);
    plate4K.position.y = 6;
    group.add(plate4K);

    // Still (Distillation Chamber)
    const stillGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const still = new THREE.Mesh(stillGeo, chrome);
    still.position.y = 4;
    group.add(still);

    // Cold Plate
    const coldPlateGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 32);
    const coldPlate = new THREE.Mesh(coldPlateGeo, gold);
    coldPlate.position.y = 2.5;
    group.add(coldPlate);

    // Mixing Chamber
    const mixingChamberGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const mixingChamber = new THREE.Mesh(mixingChamberGeo, gold);
    mixingChamber.position.y = 1;
    group.add(mixingChamber);

    // Structural supports
    const supportGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    for(let i=0; i<3; i++) {
        const support = new THREE.Mesh(supportGeo, steel);
        const angle = (i / 3) * Math.PI * 2;
        support.position.set(Math.cos(angle) * 1.2, 5, Math.sin(angle) * 1.2);
        group.add(support);
    }

    // Coiled Heat Exchanger
    const coilGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 64);
    const coils = [];
    for(let i=0; i<10; i++) {
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.position.y = 1.5 + i * 0.2;
        coil.rotation.x = Math.PI / 2;
        group.add(coil);
        coils.push(coil);
    }

    // Animations: Isotope flow (He-3 / He-4 mix)
    const isotopeGroup = new THREE.Group();
    group.add(isotopeGroup);
    
    const isoGeo = new THREE.SphereGeometry(0.04, 8, 8);
    for(let i=0; i<20; i++) {
        const iso = new THREE.Mesh(isoGeo, i % 2 === 0 ? blueAccent : redAccent);
        iso.position.set((Math.random()-0.5)*0.5, 1 + Math.random()*3, (Math.random()-0.5)*0.5);
        isotopeGroup.add(iso);
        
        const trackY = new THREE.NumberKeyframeTrack(
            '.position[y]',
            [0, 1, 2],
            [1.0, 4.0, 1.0]
        );
        const clip = new THREE.AnimationClip(`IsotopeFlow_${i}`, 2 + Math.random(), [trackY]);
        animationClips.push({ clip, target: iso });
    }

    return { group, animationClips };
}

// Auto-generated missing stub
export function createDilutionRefrigeratorCore() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
