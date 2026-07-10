import { materials } from '../utils/materials.js';

export function createMemoryControllerHub(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matBoard = materials?.pcb || new THREE.MeshStandardMaterial({ color: 0x004400, roughness: 0.9 });
    const matChip = materials?.plastic || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const matData = materials?.glow || new THREE.MeshBasicMaterial({ color: 0x00ffff });

    const base = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 12), matBoard);
    group.add(base);

    const mch = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), matChip);
    mch.position.y = 0.35;
    group.add(mch);

    const slotGeo = new THREE.BoxGeometry(1, 1, 8);
    for (let i = 0; i < 4; i++) {
        const slot = new THREE.Mesh(slotGeo, matChip);
        slot.position.set(4 + i * 1.5, 0.6, 0);
        group.add(slot);
    }

    const packets = [];
    const packetGeo = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    for (let i = 0; i < 8; i++) {
        const packet = new THREE.Mesh(packetGeo, matData);
        packet.name = 'packet_' + i;
        group.add(packet);
        packets.push(packet);
    }

    const tracks = [];
    packets.forEach((packet, index) => {
        const delay = index * 0.25;
        const times = [0 + delay, 0.5 + delay, 1.0 + delay, 2.0 + delay];
        const zOff = ((index % 4) - 1.5) * 1.5;
        const track = new THREE.VectorKeyframeTrack(
            `${packet.name}.position`,
            times,
            [
                1.5, 0.4, 0,
                3.5, 0.4, zOff,
                5.0, 0.4, zOff,
                5.0, 0.4, zOff
            ]
        );
        const scaleTrack = new THREE.VectorKeyframeTrack(
            `${packet.name}.scale`,
            times,
            [0, 0, 0,  1, 1, 1,  0, 0, 0,  0, 0, 0]
        );
        tracks.push(track);
        tracks.push(scaleTrack);
    });

    const clip = new THREE.AnimationClip('DataFlow', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
