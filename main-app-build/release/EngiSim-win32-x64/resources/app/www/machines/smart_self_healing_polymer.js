import { glass, titanium } from '../utils/materials.js';

export function createSelfHealingPolymer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Scaffold structure
    const scaffoldGeo = new THREE.BoxGeometry(2, 4, 2);
    const polymerMaterial = glass.clone();
    polymerMaterial.name = 'PolymerMaterial';
    polymerMaterial.transparent = true;
    polymerMaterial.opacity = 0.8;
    if (polymerMaterial.color) polymerMaterial.color.setHex(0x00ff00);
    const scaffold = new THREE.Mesh(scaffoldGeo, polymerMaterial);
    scaffold.name = 'ScaffoldMesh';
    group.add(scaffold);

    // Particles/Nodes healing
    const particlesGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const particle1 = new THREE.Mesh(particlesGeo, titanium);
    particle1.name = 'Particle1';
    particle1.position.set(-0.8, 0, -0.8);
    group.add(particle1);
    
    const particle2 = new THREE.Mesh(particlesGeo, titanium);
    particle2.name = 'Particle2';
    particle2.position.set(0.8, 0, 0.8);
    group.add(particle2);

    // Animation: Particles moving together and material glowing
    const times = [0, 2, 4];
    const pos1 = [-0.8, 0, -0.8, 0, 0, 0, -0.8, 0, -0.8];
    const pos2 = [0.8, 0, 0.8, 0, 0, 0, 0.8, 0, 0.8];
    
    const p1Track = new THREE.VectorKeyframeTrack(`Particle1.position`, times, pos1);
    const p2Track = new THREE.VectorKeyframeTrack(`Particle2.position`, times, pos2);

    const colors = [
        0, 1, 0,
        0, 0.5, 1, // heals and turns blueish
        0, 1, 0
    ];
    const colorTrack = new THREE.ColorKeyframeTrack(`PolymerMaterial.color`, times, colors);

    const clip = new THREE.AnimationClip('Heal', 4, [p1Track, p2Track, colorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
