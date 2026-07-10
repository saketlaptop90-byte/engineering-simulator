import { materials } from '../utils/materials.js';

export function createPrimeEditingComplex(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const complexMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4682b4,
        transmission: 0.5,
        opacity: 1,
        roughness: 0.1
    });

    const pegRNAMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x32cd32,
        emissive: 0x006400,
        roughness: 0.6
    });

    // Cas9 nickase + Reverse Transcriptase body
    const bodyGeom = new THREE.CapsuleGeometry(1.5, 3, 4, 16);
    const body = new THREE.Mesh(bodyGeom, complexMaterial);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // pegRNA
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 1, 0),
        new THREE.Vector3(0, 2, 1),
        new THREE.Vector3(2, 1, 0),
        new THREE.Vector3(3, -1, -1)
    ]);
    const pegRNAGeom = new THREE.TubeGeometry(curve, 20, 0.2, 8, false);
    const pegRNA = new THREE.Mesh(pegRNAGeom, pegRNAMaterial);
    group.add(pegRNA);

    // Reverse Transcriptase extension animation
    const rnaScaleTrack = new THREE.VectorKeyframeTrack(
        pegRNA.uuid + '.scale',
        [0, 2, 4],
        [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1]
    );

    const clip = new THREE.AnimationClip('Prime_Editing', 4, [rnaScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
