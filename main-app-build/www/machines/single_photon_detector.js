import { glass, titanium, gold } from '../utils/materials.js';

export function createPhotonDetector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Housing
    const housingGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const housing = new THREE.Mesh(housingGeo, titanium);
    group.add(housing);

    // Active Area (Lens)
    const lensGeo = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.position.y = 3;
    group.add(lens);

    // Contacts
    const contactGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
    const contact1 = new THREE.Mesh(contactGeo, gold);
    contact1.position.set(-1, -3.5, 0);
    group.add(contact1);
    const contact2 = new THREE.Mesh(contactGeo, gold);
    contact2.position.set(1, -3.5, 0);
    group.add(contact2);

    // Avalanche effect spheres
    const numElectrons = 20;
    const electrons = [];
    const electronGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    for (let i = 0; i < numElectrons; i++) {
        const electron = new THREE.Mesh(electronGeo, electronMat);
        electron.position.set(0, 2, 0);
        electron.visible = false;
        electrons.push(electron);
        group.add(electron);
    }

    // Animation: Avalanche multiplication
    electrons.forEach((electron, i) => {
        const times = [0, 0.5, 1];
        // Spread downwards
        const x = (Math.random() - 0.5) * 3;
        const z = (Math.random() - 0.5) * 3;
        const values = [
            0, 2, 0,
            x * 0.5, 0, z * 0.5,
            x, -2, z
        ];
        const posTrack = new THREE.VectorKeyframeTrack(`${electron.uuid}.position`, times, values);
        
        // Visibility track (boolean converted to boolean) - we'll just scale them
        const scaleTimes = [0, 0.1, 0.9, 1];
        const scaleValues = [0,0,0, 1,1,1, 1,1,1, 0,0,0];
        const scaleTrack = new THREE.VectorKeyframeTrack(`${electron.uuid}.scale`, scaleTimes, scaleValues);
        
        animationClips.push(new THREE.AnimationClip(`Avalanche_${i}`, 1, [posTrack, scaleTrack]));
    });

    return { group, animationClips };
}
