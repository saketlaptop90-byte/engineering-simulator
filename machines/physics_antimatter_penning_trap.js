import { titanium, copper, gold, darkSteel } from '../utils/materials.js';

export function createAntimatterPenningTrap(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Superconducting Magnet Coils
    const coilGeo = new THREE.CylinderGeometry(4, 4, 10, 32, 1, true);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb87333, wireframe: true });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    group.add(coil);

    // Electrodes (Ring and Endcaps)
    const ringGeo = new THREE.TorusGeometry(2, 0.5, 16, 64);
    const ring = new THREE.Mesh(ringGeo, gold);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const endcapGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const endcap1 = new THREE.Mesh(endcapGeo, titanium);
    endcap1.position.y = 2;
    group.add(endcap1);

    const endcap2 = new THREE.Mesh(endcapGeo, titanium);
    endcap2.rotation.x = Math.PI;
    endcap2.position.y = -2;
    group.add(endcap2);

    // Antiproton Cloud
    const cloud = new THREE.Group();
    cloud.name = 'antimatterCloud';
    const pMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    for (let i = 0; i < 50; i++) {
        const pGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const particle = new THREE.Mesh(pGeo, pMat);
        particle.position.set(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5
        );
        cloud.add(particle);
    }
    group.add(cloud);

    // Animation: Magnetic field spin and cloud oscillating
    const times = [0, 1, 2];
    const spinVals = [0, 0, 0,  0, Math.PI, 0,  0, Math.PI * 2, 0];
    const scaleVals = [1, 1, 1,  0.5, 1.5, 0.5,  1, 1, 1];

    const track1 = new THREE.VectorKeyframeTrack('antimatterCloud.rotation', times, spinVals);
    const track2 = new THREE.VectorKeyframeTrack('antimatterCloud.scale', times, scaleVals);

    const clip = new THREE.AnimationClip('TrapActive', 2, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
