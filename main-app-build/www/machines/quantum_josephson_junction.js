import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createJosephsonJunction(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Superconducting layers
    const layerGeo = new THREE.BoxGeometry(2, 0.2, 2);
    
    const layer1 = new THREE.Mesh(layerGeo, aluminum);
    layer1.position.y = -0.3;
    group.add(layer1);

    const layer2 = new THREE.Mesh(layerGeo, aluminum);
    layer2.position.y = 0.3;
    group.add(layer2);

    // Insulating barrier
    const barrierGeo = new THREE.BoxGeometry(2, 0.4, 2);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x8888ff, transparent: true, opacity: 0.5, emissive: 0x2222ff });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.name = 'InsulatorBarrier';
    group.add(barrier);

    // Cooper pair tunneling animation (particles)
    const particleCount = 10;
    const particleGroup = new THREE.Group();
    group.add(particleGroup);
    
    const pGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const tracks = [];
    for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(pGeo, pMat);
        p.name = `CooperPair_${i}`;
        const x = (Math.random() - 0.5) * 1.5;
        const z = (Math.random() - 0.5) * 1.5;
        p.position.set(x, -0.2, z);
        particleGroup.add(p);

        const delay = Math.random() * 2;
        const pTimes = [0, 0.5, 1];
        const pValues = [
            x, -0.2, z,
            x, 0.0, z,
            x, 0.2, z
        ];
        
        // Create an animation for this particle tunneling
        const track = new THREE.VectorKeyframeTrack(`${p.name}.position`, pTimes, pValues);
        tracks.push(track);
    }

    const barrierGlowTimes = [0, 0.5, 1];
    const barrierGlowValues = [0.2, 0.8, 0.2];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${barrier.name}.material.opacity`, barrierGlowTimes, barrierGlowValues);
    tracks.push(opacityTrack);

    const clip = new THREE.AnimationClip('Tunneling', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
