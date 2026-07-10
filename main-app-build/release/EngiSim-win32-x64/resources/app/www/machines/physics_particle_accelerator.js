import { materials } from '../utils/materials.js';

export function createParticleAccelerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ring
    const ringGeometry = new THREE.TorusGeometry(10, 1, 32, 100);
    const ring = new THREE.Mesh(ringGeometry, materials.titanium);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Particles Group
    const particles = new THREE.Group();
    particles.name = 'AcceleratorParticles';
    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 2 
    });
    
    for (let i = 0; i < 20; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const angle = (i / 20) * Math.PI * 2;
        particle.position.set(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
        particles.add(particle);
    }
    group.add(particles);

    // Magnets around the ring
    const magnetGeometry = new THREE.BoxGeometry(2, 2.5, 2);
    for (let i = 0; i < 8; i++) {
        const magnet = new THREE.Mesh(magnetGeometry, materials.darkSteel);
        const angle = (i / 8) * Math.PI * 2;
        magnet.position.set(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
        magnet.lookAt(0, 0, 0);
        group.add(magnet);
    }

    // Animation: High speed particle rotation
    const times = [0, 1, 2];
    const qInitial = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const qMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const qFinal = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const track = new THREE.QuaternionKeyframeTrack('AcceleratorParticles.quaternion', times, [
        qInitial.x, qInitial.y, qInitial.z, qInitial.w,
        qMid.x, qMid.y, qMid.z, qMid.w,
        qFinal.x, qFinal.y, qFinal.z, qFinal.w
    ]);
    
    const clip = new THREE.AnimationClip('AccelerateParticles', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
