import { materials } from '../utils/materials.js';

export function createSteamGeneratorUTubes(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const tubeMaterial = materials.inconel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const steamMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    // Base plate
    const plateGeom = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const plate = new THREE.Mesh(plateGeom, tubeMaterial);
    group.add(plate);

    // Create U-Tubes
    const curvePoints = [];
    for(let i=0; i<=20; i++) {
        const t = i / 20;
        const angle = t * Math.PI;
        curvePoints.push(new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle) * 4 + 2, 0));
    }
    const tubePath = new THREE.CatmullRomCurve3(curvePoints);
    
    for(let i=0; i<5; i++) {
        const r = 0.5 + i * 0.3;
        const uTubeGeom = new THREE.TubeGeometry(tubePath, 20, 0.1, 8, false);
        const uTube = new THREE.Mesh(uTubeGeom, tubeMaterial);
        
        // Scale to create nested tubes
        uTube.scale.set(r, r, 1);
        uTube.position.z = (i - 2) * 0.4;
        group.add(uTube);
    }

    // Steam particles
    const particleCount = 20;
    const particles = new THREE.Group();
    particles.name = "steamParticles";
    for(let i=0; i<particleCount; i++) {
        const pGeom = new THREE.SphereGeometry(0.2, 8, 8);
        const p = new THREE.Mesh(pGeom, steamMaterial);
        p.position.set(Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2);
        particles.add(p);
    }
    group.add(particles);

    // Animate steam moving up
    const times = [0, 2];
    const yValues = [0, 5];
    const positionTrack = new THREE.NumberKeyframeTrack('steamParticles.position[y]', times, yValues);
    
    const clip = new THREE.AnimationClip('SteamRise', 2, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
