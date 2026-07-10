import { materials } from '../utils/materials.js';

export function createFluidCatalyticCracker(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Reactor
    const reactorGeo = new THREE.CylinderGeometry(3, 3, 15, 32);
    const reactorMat = materials.iron || new THREE.MeshStandardMaterial({ color: 0x555555 });
    const reactor = new THREE.Mesh(reactorGeo, reactorMat);
    reactor.position.x = -4;
    group.add(reactor);

    // Regenerator
    const regeneratorGeo = new THREE.CylinderGeometry(4, 4, 12, 32);
    const regeneratorMat = materials.iron || new THREE.MeshStandardMaterial({ color: 0x555555 });
    const regenerator = new THREE.Mesh(regeneratorGeo, regeneratorMat);
    regenerator.position.x = 4;
    regenerator.position.y = -1.5;
    group.add(regenerator);

    // Connecting pipes
    const pipeGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const pipeMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    // Catalyst bubbling animation
    const bubbleTracks = [];
    for(let i=0; i<20; i++) {
        const bubbleGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.set(4 + Math.random() * 4 - 2, -5 + Math.random() * 8, Math.random() * 4 - 2);
        bubble.name = `catalyst_${i}`;
        group.add(bubble);

        const times = [0, 1, 2];
        const startY = bubble.position.y;
        const values = [
            bubble.position.x, startY, bubble.position.z,
            bubble.position.x, startY + 2, bubble.position.z,
            bubble.position.x, startY, bubble.position.z
        ];
        const positionTrack = new THREE.VectorKeyframeTrack(`${bubble.name}.position`, times, values);
        bubbleTracks.push(positionTrack);
    }

    const clip = new THREE.AnimationClip('CatalystBubbling', 2, bubbleTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
