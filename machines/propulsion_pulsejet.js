import { titanium, steel, copper } from '../utils/materials.js';

export function createPulsejet(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Aerodynamic Tube profile (V-1 argus style)
    const tubePoints = [
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(0.6, 1),
        new THREE.Vector2(1.0, 2),  // Combustion chamber widest part
        new THREE.Vector2(1.0, 3),
        new THREE.Vector2(0.4, 4),  // Tailpipe
        new THREE.Vector2(0.4, 8),
        new THREE.Vector2(0.5, 9)
    ];
    const tubeGeo = new THREE.LatheGeometry(tubePoints, 32);
    const tube = new THREE.Mesh(tubeGeo, steel);
    tube.rotation.z = -Math.PI / 2;
    tube.position.x = -2;
    group.add(tube);

    // Front Valve Grid
    const gridGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const grid = new THREE.Mesh(gridGeo, titanium);
    grid.rotation.z = Math.PI / 2;
    grid.position.x = -2;
    group.add(grid);

    // Reed Valves (Flappers)
    const flapperGroup = new THREE.Group();
    flapperGroup.name = "flappers";
    for(let i=0; i<8; i++) {
        const flapperGeo = new THREE.BoxGeometry(0.05, 0.4, 0.2);
        const flapper = new THREE.Mesh(flapperGeo, copper);
        flapper.position.y = 0.2;
        
        const pivot = new THREE.Group();
        pivot.rotation.x = (i/8) * Math.PI * 2;
        pivot.add(flapper);
        flapperGroup.add(pivot);
    }
    flapperGroup.position.x = -1.9;
    group.add(flapperGroup);

    // Exhaust Fireball
    const fireGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const fire = new THREE.Mesh(fireGeo, fireMat);
    fire.position.x = 7.5;
    fire.name = "pulseFire";
    group.add(fire);

    // Animation: High-frequency Pulse effect
    const times = [0, 0.1, 0.2, 0.3]; // Fast pulsing cycle
    
    // Fire bursting
    const fireScaleValues = [0.1, 0.1, 0.1, 2, 2, 2, 0.5, 0.5, 0.5, 0.1, 0.1, 0.1];
    const fireScaleTrack = new THREE.VectorKeyframeTrack('pulseFire.scale', times, fireScaleValues);

    // Flappers opening and closing
    const flapperScaleValues = [1, 1, 1, 1, 0.1, 1, 1, 1, 1, 1, 1, 1]; 
    const flapperScaleTrack = new THREE.VectorKeyframeTrack('flappers.scale', times, flapperScaleValues);

    const clip = new THREE.AnimationClip('PulseOperation', 0.3, [fireScaleTrack, flapperScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
