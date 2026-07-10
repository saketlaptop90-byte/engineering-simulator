import { materials } from '../utils/materials.js';

export function createPCBRoutingTraces(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matPCB = materials?.pcb || new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 0.9 });
    const matTrace = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 });
    const matSignal = materials?.glow || new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const board = new THREE.Mesh(new THREE.BoxGeometry(16, 0.2, 12), matPCB);
    group.add(board);

    const tracksData = [];
    for (let i = 0; i < 10; i++) {
        const zPos = (i - 4.5) * 1.0;
        
        // Create broken trace lines to look like routing
        const traceParts = new THREE.Group();
        const t1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.05, 0.2), matTrace);
        t1.position.set(-4, 0.125, zPos);
        traceParts.add(t1);
        
        const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 1.5), matTrace);
        const shiftZ = (i % 2 === 0) ? 0.65 : -0.65;
        t2.position.set(-2.1, 0.125, zPos + shiftZ);
        traceParts.add(t2);
        
        const t3 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.05, 0.2), matTrace);
        t3.position.set(1, 0.125, zPos + shiftZ * 2);
        traceParts.add(t3);
        
        group.add(traceParts);

        const signal = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.3), matSignal);
        signal.name = `signal_${i}`;
        group.add(signal);

        const delay = i * 0.15;
        const times = [0, delay, delay + 0.5, delay + 0.7, delay + 1.2, 3.0];
        const posTrack = new THREE.VectorKeyframeTrack(
            `${signal.name}.position`,
            times,
            [
                -6, 0.15, zPos,
                -6, 0.15, zPos,
                -2.1, 0.15, zPos,
                -2.1, 0.15, zPos + shiftZ * 2,
                4, 0.15, zPos + shiftZ * 2,
                4, 0.15, zPos + shiftZ * 2
            ]
        );
        const scaleTrack = new THREE.VectorKeyframeTrack(
            `${signal.name}.scale`,
            times,
            [0, 0, 0,  1, 1, 1,  1, 1, 1,  1, 1, 1,  0, 0, 0,  0, 0, 0]
        );
        
        tracksData.push(posTrack);
        tracksData.push(scaleTrack);
    }

    const clip = new THREE.AnimationClip('SignalFlow', 3.0, tracksData);
    animationClips.push(clip);

    return { group, animationClips };
}
