import { copper, gold, glass } from '../utils/materials.js';

export function createEntangledPhotonRangefinder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main barrel
    const barrelGeo = new THREE.CylinderGeometry(0.5, 0.8, 5, 32);
    const barrel = new THREE.Mesh(barrelGeo, copper);
    barrel.rotation.x = Math.PI / 2;
    group.add(barrel);

    // Source crystal (Spontaneous Parametric Down-Conversion)
    const crystalGeo = new THREE.BoxGeometry(1, 1, 1);
    const crystal = new THREE.Mesh(crystalGeo, glass);
    crystal.position.z = -2;
    group.add(crystal);

    // Detector arrays
    const detectorGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const det1 = new THREE.Mesh(detectorGeo, gold);
    det1.position.set(1, 0, -2);
    group.add(det1);
    
    const det2 = new THREE.Mesh(detectorGeo, gold);
    det2.position.set(-1, 0, -2);
    group.add(det2);

    // Photons (small glowing spheres)
    const photonGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    
    const photon1 = new THREE.Mesh(photonGeo, photonMat);
    photon1.position.z = -1;
    group.add(photon1);

    const photon2 = new THREE.Mesh(photonGeo, photonMat);
    photon2.position.z = -1;
    group.add(photon2);

    // Animation: Photons shooting out, crystal glowing
    const p1Track = new THREE.VectorKeyframeTrack(
        '.children[4].position',
        [0, 1],
        [0, 0, -1, 0, 0, 5]
    );
    const p2Track = new THREE.VectorKeyframeTrack(
        '.children[5].position',
        [0, 0.5, 1],
        [0, 0, -1, 1, 0, -2, 0, 0, -1] // One photon goes to detector, one shoots out
    );
    
    const crystalRot = new THREE.VectorKeyframeTrack(
        '.children[1].rotation[z]',
        [0, 1],
        [0, Math.PI]
    );

    const clip = new THREE.AnimationClip('Ranging', 1, [p1Track, p2Track, crystalRot]);
    animationClips.push(clip);

    return { group, animationClips };
}
