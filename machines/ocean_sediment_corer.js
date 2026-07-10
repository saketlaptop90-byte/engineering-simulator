import { materials } from '../utils/materials.js';

export function createSedimentCorer(THREE) {
    const group = new THREE.Group();
    group.name = "SedimentCorerRoot";
    const animationClips = [];

    const corerGroup = new THREE.Group();
    corerGroup.name = "Corer";
    group.add(corerGroup);

    const tubeGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 32);
    const tube = new THREE.Mesh(tubeGeo, materials.metal || new THREE.MeshStandardMaterial({color: 0x999999}));
    corerGroup.add(tube);

    const weightGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 32);
    const weight = new THREE.Mesh(weightGeo, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333}));
    weight.position.y = 1.5;
    corerGroup.add(weight);

    const finGeo = new THREE.BoxGeometry(1.2, 0.8, 0.05);
    const fin1 = new THREE.Mesh(finGeo, materials.highlight || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    fin1.position.y = 2.2;
    corerGroup.add(fin1);

    const fin2 = new THREE.Mesh(finGeo, materials.highlight || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    fin2.position.y = 2.2;
    fin2.rotation.y = Math.PI / 2;
    corerGroup.add(fin2);

    // Animation
    const dropTrack = new THREE.VectorKeyframeTrack('Corer.position', 
        [0, 1, 1.5, 3], 
        [0, 10, 0,  0, -2, 0,  0, -2, 0,  0, 10, 0]
    );

    animationClips.push(new THREE.AnimationClip('Plunge', 3, [dropTrack]));

    return { group, animationClips };
}
