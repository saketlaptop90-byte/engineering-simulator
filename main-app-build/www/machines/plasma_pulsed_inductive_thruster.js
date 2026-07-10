import * as materials from '../utils/materials.js';

export function createPulsedInductiveThruster(THREE) {
    const group = new THREE.Group();
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.4 });
    const matCoil = materials.coil || new THREE.MeshStandardMaterial({ color: 0xdd7733, metalness: 0.5, roughness: 0.5 });
    const matPlasmaPulse = materials.plasma || new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });

    // Flat Inductive Coil (Pancake Coil geometry)
    const coilGroup = new THREE.Group();
    for(let r=0.5; r<=3; r+=0.15) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 16, 64), matCoil);
        ring.rotation.x = Math.PI / 2;
        coilGroup.add(ring);
    }
    group.add(coilGroup);

    // Propellant Injector Array radially outward
    const injectorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
    for(let a=0; a<Math.PI*2; a+=Math.PI/6) {
        const inj = new THREE.Mesh(injectorGeo, matMetal);
        inj.position.set(Math.cos(a)*1.5, 0.2, Math.sin(a)*1.5);
        group.add(inj);
    }

    // Central Base structure
    const baseGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.2, 32);
    const base = new THREE.Mesh(baseGeo, matMetal);
    base.position.y = -0.1;
    group.add(base);

    // Plasma Pulse Toroid (The plasmoid formed and accelerated)
    const pulseGeo = new THREE.TorusGeometry(1.5, 0.4, 32, 64);
    const pulse = new THREE.Mesh(pulseGeo, matPlasmaPulse);
    pulse.rotation.x = Math.PI / 2;
    pulse.position.y = 0.5;
    group.add(pulse);

    // Animation: Repeated Inductive Firing
    const animationClips = [];
    
    // Move plasmoid away from coil over time
    const posTrack = new THREE.VectorKeyframeTrack(
        pulse.uuid + '.position',
        [0, 0.1, 0.8, 1],
        [0, 0.5, 0,  0, 2, 0,  0, 10, 0,  0, 0.5, 0] // fires along Y axis rapidly, resets
    );
    
    // Scale plasmoid as it expands
    const scaleTrack = new THREE.VectorKeyframeTrack(
        pulse.uuid + '.scale',
        [0, 0.1, 0.8, 1],
        [0.01, 0.01, 0.01,  1, 1, 1,  2, 2, 2,  0.01, 0.01, 0.01]
    );
    
    const clip = new THREE.AnimationClip('PulseFire_PIT', 1, [posTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
