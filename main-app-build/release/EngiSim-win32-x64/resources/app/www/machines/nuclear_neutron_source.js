import { materials } from '../utils/materials.js';

export function createNeutronSource(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.2 });
    const emitterMat = (materials?.glowBlue || new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.9 })).clone();
    const particleMat = materials?.particle || new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Shielding base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 2), baseMat);
    base.position.y = -0.25;
    group.add(base);

    // Emitter tip
    const emitter = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), emitterMat);
    emitter.position.y = 0.5;
    emitter.name = "emitterTip";
    group.add(emitter);

    // Particles (Neutrons)
    const particlesGroup = new THREE.Group();
    particlesGroup.name = "particles";
    group.add(particlesGroup);

    const numParticles = 8;
    const tracks = [];

    for (let i = 0; i < numParticles; i++) {
        const particle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), particleMat);
        particle.name = `particle${i}`;
        particlesGroup.add(particle);

        const angle = (i / numParticles) * Math.PI * 2;
        const startPos = [0, 0.5, 0];
        const endPos = [Math.cos(angle) * 3, 0.5, Math.sin(angle) * 3];

        const times = [0, 1];
        const values = [...startPos, ...endPos];
        tracks.push(new THREE.VectorKeyframeTrack(`${particle.name}.position`, times, values));
    }

    // Emitter pulse
    const scaleTrack = new THREE.VectorKeyframeTrack(`${emitter.name}.scale`, [0, 0.5, 1], [1,1,1, 1.3,1.3,1.3, 1,1,1]);
    tracks.push(scaleTrack);

    const clip = new THREE.AnimationClip('Emit', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
