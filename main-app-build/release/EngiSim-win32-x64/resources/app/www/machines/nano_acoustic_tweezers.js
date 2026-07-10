import { gold, carbon } from '../utils/materials.js';

export function createAcousticTweezers(THREE) {
    const group = new THREE.Group();
    group.name = "AcousticTweezers";
    const animationClips = [];

    const emitterMat = gold || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    
    const emitterTop = new THREE.Mesh(new THREE.ConeGeometry(2, 2, 32), emitterMat);
    emitterTop.position.y = 3;
    emitterTop.rotation.x = Math.PI; // Point downwards
    group.add(emitterTop);

    const emitterBot = new THREE.Mesh(new THREE.ConeGeometry(2, 2, 32), emitterMat);
    emitterBot.position.y = -3;
    group.add(emitterBot);

    const particleMat = carbon || new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0x550000 });
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), particleMat);
    particle.name = "TrappedParticle";
    group.add(particle);

    const waveGroup = new THREE.Group();
    waveGroup.name = "WaveGroup";
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    
    for(let i = 0; i < 3; i++) {
        const wave = new THREE.Mesh(new THREE.TorusGeometry(1 + i * 0.5, 0.05, 8, 32), waveMat);
        wave.rotation.x = Math.PI / 2;
        waveGroup.add(wave);
    }
    group.add(waveGroup);

    // Animation: Particle vibrating and waves scaling
    const times = [0, 0.25, 0.5, 0.75, 1];
    const particlePos = [
        0, 0.1, 0,
        0.1, -0.1, 0.1,
        -0.1, 0.1, -0.1,
        0, -0.1, 0,
        0, 0.1, 0
    ];
    const particleTrack = new THREE.VectorKeyframeTrack("TrappedParticle.position", times, particlePos);

    const waveScale = [1, 1, 1,  1.5, 1.5, 1.5,  2, 2, 2,  1.5, 1.5, 1.5,  1, 1, 1];
    const waveTrack = new THREE.VectorKeyframeTrack("WaveGroup.scale", times, waveScale);

    const clip = new THREE.AnimationClip('Trap', 1, [particleTrack, waveTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
