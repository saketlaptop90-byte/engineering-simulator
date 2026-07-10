import { materials } from '../utils/materials.js';

export function createScaffoldingSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
    const matWood = materials.wood || new THREE.MeshStandardMaterial({ color: 0xd2b48c });

    const structure = new THREE.Group();
    structure.name = 'ScaffoldStructure';

    // Vertical poles
    for (let x = -2; x <= 2; x += 4) {
        for (let z = -1; z <= 1; z += 2) {
            const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 10);
            const pole = new THREE.Mesh(poleGeo, matSteel);
            pole.position.set(x, 5, z);
            structure.add(pole);
        }
    }

    // Horizontal supports and planks
    for (let y = 2; y <= 10; y += 2) {
        const supportGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.2);
        
        const s1 = new THREE.Mesh(supportGeo, matSteel);
        s1.rotation.z = Math.PI / 2;
        s1.position.set(0, y, -1);
        structure.add(s1);

        const s2 = new THREE.Mesh(supportGeo, matSteel);
        s2.rotation.z = Math.PI / 2;
        s2.position.set(0, y, 1);
        structure.add(s2);

        const plankGeo = new THREE.BoxGeometry(4.2, 0.1, 1.8);
        const plank = new THREE.Mesh(plankGeo, matWood);
        plank.position.set(0, y + 0.05, 0);
        structure.add(plank);
    }

    group.add(structure);

    const times = [0, 2, 4];
    const scale0 = [1, 0.01, 1];
    const scale1 = [1, 1, 1];
    const tScale = new THREE.VectorKeyframeTrack('ScaffoldStructure.scale', times, [...scale0, ...scale1, ...scale1]);
    
    const clip = new THREE.AnimationClip('ErectScaffolding', 4, [tScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
