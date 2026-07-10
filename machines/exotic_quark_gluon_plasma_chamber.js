import * as materials from '../utils/materials.js';

export function createQuarkGluonPlasmaChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chamber sphere
    const chamberGeo = new THREE.SphereGeometry(10, 32, 32);
    const chamberMat = materials.heatShieldMaterial || new THREE.MeshPhysicalMaterial({ color: 0xaa2200, transmission: 0.5, opacity: 0.8, transparent: true, metalness: 0.2, roughness: 0.1 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    group.add(chamber);

    // Plasma core (particles)
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0xff0000); // Red (Quark color)
    const color2 = new THREE.Color(0x00ff00); // Green (Quark color)
    const color3 = new THREE.Color(0x0000ff); // Blue (Quark color)

    for (let i = 0; i < particleCount; i++) {
        // Random position within radius 8
        const r = 8 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = r * Math.cos(phi);

        // Assign one of the 3 color charges
        const randColor = Math.random();
        let chosenColor = color1;
        if (randColor > 0.66) chosenColor = color2;
        else if (randColor > 0.33) chosenColor = color3;

        particleColors[i * 3] = chosenColor.r;
        particleColors[i * 3 + 1] = chosenColor.g;
        particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = materials.plasmaMaterial || new THREE.PointsMaterial({ size: 0.2, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Magnetic confinement coils
    const coilGeo = new THREE.TorusGeometry(10.5, 0.5, 16, 100);
    const coilMat = materials.superconductorMaterial || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 1, roughness: 0.4, emissive: 0x001133 });

    for (let i = 0; i < 4; i++) {
        const coil = new THREE.Mesh(coilGeo, coilMat);
        coil.rotation.x = (i / 4) * Math.PI;
        group.add(coil);
    }

    // Animations
    const times = [0, 2, 4];
    
    // Plasma rotation
    const particleRotTrack = new THREE.VectorKeyframeTrack('.rotation[y]', times, [0, Math.PI, Math.PI * 2]);
    const particleClip = new THREE.AnimationClip('PlasmaSwirl', 4, [particleRotTrack]);
    animationClips.push({ mesh: particles, clip: particleClip });

    // Chamber pulsing glow
    const chamberScaleTrack = new THREE.VectorKeyframeTrack('.scale', times, [1, 1, 1, 1.02, 1.02, 1.02, 1, 1, 1]);
    const chamberPulseClip = new THREE.AnimationClip('ChamberPulse', 4, [chamberScaleTrack]);
    animationClips.push({ mesh: chamber, clip: chamberPulseClip });

    return { group, animationClips };
}
