import { glass, titanium, gold } from '../utils/materials.js';

export function createPhotonicProcessor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chip substrate
    const substrateGeo = new THREE.BoxGeometry(10, 0.2, 10);
    const substrate = new THREE.Mesh(substrateGeo, titanium);
    group.add(substrate);

    // Waveguides
    const waveguideGeo = new THREE.BoxGeometry(8, 0.1, 0.1);
    for (let i = -3; i <= 3; i += 2) {
        const wg1 = new THREE.Mesh(waveguideGeo, glass);
        wg1.position.set(0, 0.15, i);
        group.add(wg1);
        
        const wg2 = new THREE.Mesh(waveguideGeo, glass);
        wg2.rotation.y = Math.PI / 2;
        wg2.position.set(i, 0.15, 0);
        group.add(wg2);
    }

    // Photons
    const photonGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const photon1 = new THREE.Mesh(photonGeo, photonMat);
    photon1.position.set(-4, 0.2, -3);
    group.add(photon1);

    const photon2 = new THREE.Mesh(photonGeo, photonMat);
    photon2.position.set(4, 0.2, 3);
    group.add(photon2);

    // Animation: Photons moving
    const times = [0, 2];
    const values1 = [-4, 0.2, -3, 4, 0.2, -3];
    const track1 = new THREE.VectorKeyframeTrack(`${photon1.uuid}.position`, times, values1);
    animationClips.push(new THREE.AnimationClip('Photon1_Move', 2, [track1]));

    const values2 = [4, 0.2, 3, -4, 0.2, 3];
    const track2 = new THREE.VectorKeyframeTrack(`${photon2.uuid}.position`, times, values2);
    animationClips.push(new THREE.AnimationClip('Photon2_Move', 2, [track2]));

    return { group, animationClips };
}
