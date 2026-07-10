import * as importedMaterials from '../utils/materials.js';
const materials = importedMaterials.default || importedMaterials;

export function createShipStabilizerFin(THREE) {
    const group = new THREE.Group();
    group.name = 'ShipStabilizerFin';
    
    const fallbackHull = new THREE.MeshStandardMaterial({ color: 0x990000, roughness: 0.6 });
    const fallbackFin = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.5 });
    const fallbackMetal = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7, roughness: 0.3 });
    
    const hullMat = materials?.hull || fallbackHull;
    const finMat = materials?.fin || fallbackFin;
    const metalMat = materials?.metal || fallbackMetal;

    const hullGeo = new THREE.BoxGeometry(4, 2, 1);
    const hullBox = new THREE.Mesh(hullGeo, hullMat);
    group.add(hullBox);

    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32);
    const shaft = new THREE.Mesh(shaftGeo, metalMat);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = 0.5;
    group.add(shaft);

    const finAssembly = new THREE.Group();
    finAssembly.name = 'finAssembly';
    finAssembly.position.z = 1.25;
    group.add(finAssembly);

    const finGeo = new THREE.BoxGeometry(2.5, 0.2, 1.5);
    const posAttribute = finGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const z = posAttribute.getZ(i);
        if (x > 0) {
            posAttribute.setZ(i, z * 0.5);
            posAttribute.setY(i, posAttribute.getY(i) * 0.5);
        }
    }
    finGeo.computeVertexNormals();

    const fin = new THREE.Mesh(finGeo, finMat);
    fin.position.x = 1;
    finAssembly.add(fin);

    const times = [0, 2, 4, 6, 8];
    const values = [0, Math.PI / 6, 0, -Math.PI / 6, 0];
    const finTrack = new THREE.NumberKeyframeTrack('finAssembly.rotation[x]', times, values);

    const animationClips = [
        new THREE.AnimationClip('Stabilize', 8, [finTrack])
    ];

    return { group, animationClips };
}
