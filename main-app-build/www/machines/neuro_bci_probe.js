import { getMaterial } from '../utils/materials.js';

export function createBrainComputerInterfaceProbe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Processing unit base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 1);
    const baseMat = getMaterial('metal_dark', THREE) || new THREE.MeshStandardMaterial({ color: 0x444444 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Microelectrode array penetrating cortex
    const electrodesGroup = new THREE.Group();
    electrodesGroup.name = 'probe_electrodes';
    group.add(electrodesGroup);

    const electrodeGeo = new THREE.CylinderGeometry(0.02, 0.01, 2, 8);
    electrodeGeo.translate(0, -1, 0); // Origin at top, extending downwards
    const electrodeMat = getMaterial('metal_gold', THREE) || new THREE.MeshStandardMaterial({ color: 0xffd700 });

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 4; j++) {
            const electrode = new THREE.Mesh(electrodeGeo, electrodeMat);
            electrode.position.set((i - 4.5) * 0.2, -0.25, (j - 1.5) * 0.2);
            electrodesGroup.add(electrode);
        }
    }

    // Wireless data transmitter module
    const transmitterGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const transmitterMat = getMaterial('glow_blue', THREE) || new THREE.MeshBasicMaterial({ color: 0x0088ff });
    const transmitter = new THREE.Mesh(transmitterGeo, transmitterMat);
    transmitter.position.set(0, 0.5, 0);
    transmitter.name = 'bci_transmitter';
    group.add(transmitter);

    // Animation: Transmitter pulsing to represent data transfer
    const times = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    const values = [
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1,
        1, 1, 1
    ];
    const track = new THREE.VectorKeyframeTrack('bci_transmitter.scale', times, values);
    const clip = new THREE.AnimationClip('transmit', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
