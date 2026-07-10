import * as materials from '../utils/materials.js';

export function createNegativeMassTrap(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Containment shell
    const shellGeometry = new THREE.DodecahedronGeometry(5, 2);
    const shellMaterial = materials.glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3, transmission: 0.9, roughness: 0.1 });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    group.add(shell);

    // Negative mass core
    const coreGeometry = new THREE.IcosahedronGeometry(2, 0);
    const coreMaterial = materials.exoticMaterial || new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, wireframe: true });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Trap rings
    const ringGeometry = new THREE.TorusGeometry(6, 0.2, 16, 100);
    const ringMaterial = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.y = Math.PI / 2;
    group.add(ring2);

    // Animations
    const times = [0, 2, 4];
    
    // Core pulsing and spinning
    const coreScaleTrack = new THREE.VectorKeyframeTrack('.scale', times, [1, 1, 1, 0.8, 0.8, 0.8, 1, 1, 1]);
    const coreRotationTrack = new THREE.VectorKeyframeTrack('.rotation[y]', times, [0, Math.PI, Math.PI * 2]);
    
    const coreClip = new THREE.AnimationClip('CorePulse', 4, [coreScaleTrack, coreRotationTrack]);
    animationClips.push({ mesh: core, clip: coreClip });

    // Rings spinning
    const ring1RotTrack = new THREE.VectorKeyframeTrack('.rotation[x]', times, [Math.PI / 2, Math.PI / 2 + Math.PI, Math.PI / 2 + Math.PI * 2]);
    const ring1Clip = new THREE.AnimationClip('Ring1Spin', 4, [ring1RotTrack]);
    animationClips.push({ mesh: ring1, clip: ring1Clip });

    const ring2RotTrack = new THREE.VectorKeyframeTrack('.rotation[y]', times, [Math.PI / 2, Math.PI / 2 + Math.PI, Math.PI / 2 + Math.PI * 2]);
    const ring2Clip = new THREE.AnimationClip('Ring2Spin', 4, [ring2RotTrack]);
    animationClips.push({ mesh: ring2, clip: ring2Clip });

    return { group, animationClips };
}
