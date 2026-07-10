import { materials } from '../utils/materials.js';

export function createCas12aSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Organic materials
    const proteinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8a2be2,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
    });
    
    const rnaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff4500,
        roughness: 0.4,
        metalness: 0.0,
        transmission: 0.3,
    });

    const dnaMaterial = materials.glass || new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
    });

    // Cas12a Protein (Main Body)
    const proteinGeom = new THREE.DodecahedronGeometry(2, 2);
    const cas12a = new THREE.Mesh(proteinGeom, proteinMaterial);
    group.add(cas12a);

    // crRNA (Guide RNA)
    const rnaGeom = new THREE.TorusGeometry(1.5, 0.2, 16, 100, Math.PI);
    const crRNA = new THREE.Mesh(rnaGeom, rnaMaterial);
    crRNA.position.set(0, 1, 1);
    crRNA.rotation.x = Math.PI / 2;
    group.add(crRNA);

    // Target DNA Strand
    const dnaGeom = new THREE.CylinderGeometry(0.3, 0.3, 6, 32);
    const targetDNA = new THREE.Mesh(dnaGeom, dnaMaterial);
    targetDNA.rotation.z = Math.PI / 2;
    targetDNA.position.set(0, 0, 2);
    group.add(targetDNA);

    // Animations: DNA cleavage and protein breathing
    const proteinScaleTrack = new THREE.VectorKeyframeTrack(
        cas12a.uuid + '.scale',
        [0, 1, 2],
        [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1]
    );
    
    const dnaPosTrack = new THREE.VectorKeyframeTrack(
        targetDNA.uuid + '.position',
        [0, 1, 2],
        [0, 0, 2, 0, 0, 1, 0, 0, 2]
    );

    const dnaRotTrack = new THREE.QuaternionKeyframeTrack(
        targetDNA.uuid + '.quaternion',
        [0, 1, 2],
        [...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)).toArray(),
         ...new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 4, 0, Math.PI / 2)).toArray(),
         ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)).toArray()]
    );

    const clip = new THREE.AnimationClip('Cas12a_Action', 2, [
        proteinScaleTrack,
        dnaPosTrack,
        dnaRotTrack
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
