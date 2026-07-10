import { aluminum, copper, darkSteel } from '../utils/materials.js';

export function createBB84Simulator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Protocol Platform
    const platformGeo = new THREE.BoxGeometry(8, 0.4, 3);
    const platform = new THREE.Mesh(platformGeo, darkSteel);
    group.add(platform);

    // Alice Node (Transmitter)
    const aliceGeo = new THREE.CylinderGeometry(0.8, 1, 1.5, 32);
    const alice = new THREE.Mesh(aliceGeo, aluminum);
    alice.position.set(-3, 0.95, 0);
    group.add(alice);

    // Bob Node (Receiver)
    const bobGeo = new THREE.CylinderGeometry(0.8, 1, 1.5, 32);
    const bob = new THREE.Mesh(bobGeo, copper);
    bob.position.set(3, 0.95, 0);
    group.add(bob);

    // Quantum Channel (Optical Fiber)
    const fiberGeo = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
    const fiberMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const fiber = new THREE.Mesh(fiberGeo, fiberMat);
    fiber.rotation.z = Math.PI / 2;
    fiber.position.set(0, 1.5, 0);
    group.add(fiber);

    // Polarization Filters (Bases)
    const filterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const filterA = new THREE.Mesh(filterGeo, new THREE.MeshStandardMaterial({ color: 0xff4444 }));
    filterA.rotation.z = Math.PI / 2;
    filterA.position.set(-2, 1.5, 0);
    group.add(filterA);

    const filterB = new THREE.Mesh(filterGeo, new THREE.MeshStandardMaterial({ color: 0x4444ff }));
    filterB.rotation.z = Math.PI / 2;
    filterB.position.set(2, 1.5, 0);
    group.add(filterB);

    // Traveling Photon carrying Qubit
    const photonGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const photonMat = new THREE.MeshStandardMaterial({ 
        color: 0xffff00, 
        emissive: 0xffff00, 
        emissiveIntensity: 2 
    });
    const photon = new THREE.Mesh(photonGeo, photonMat);
    photon.position.set(-3, 1.5, 0);
    photon.name = "bb84Photon";
    group.add(photon);

    // Animation: Photon travels from Alice through filter to Bob
    const posTrack = new THREE.VectorKeyframeTrack(
        'bb84Photon.position',
        [0, 1, 1.1, 2],
        [
            -3, 1.5, 0, 
             3, 1.5, 0, 
            -3, 1.5, 0, 
            -3, 1.5, 0
        ]
    );

    // Scale Track: Photon disappears on arrival and reappears at Alice
    const scaleTrack = new THREE.VectorKeyframeTrack(
        'bb84Photon.scale',
        [0, 0.95, 1, 1.1, 2],
        [
            1, 1, 1, 
            1, 1, 1, 
            0, 0, 0, 
            1, 1, 1, 
            1, 1, 1
        ]
    );

    const clip = new THREE.AnimationClip('BB84_Transmission', 2, [posTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
