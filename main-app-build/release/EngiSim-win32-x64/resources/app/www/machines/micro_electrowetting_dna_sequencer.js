import { glass, gold, copper, aluminum } from '../utils/materials.js';

export function createEWODSequencer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base layer
    const baseGeom = new THREE.BoxGeometry(12, 0.4, 12);
    const base = new THREE.Mesh(baseGeom, glass);
    group.add(base);

    // Electrode Grid (Gold)
    const gridGroup = new THREE.Group();
    group.add(gridGroup);

    const electrodeGeom = new THREE.BoxGeometry(0.8, 0.05, 0.8);
    for(let x = -5; x <= 5; x++) {
        for(let z = -5; z <= 5; z++) {
            const electrode = new THREE.Mesh(electrodeGeom, gold);
            electrode.position.set(x, 0.225, z);
            gridGroup.add(electrode);
        }
    }

    // Cover Plate (Glass, raised)
    const coverGeom = new THREE.BoxGeometry(12, 0.1, 12);
    const coverMat = glass.clone();
    coverMat.opacity = 0.3;
    const cover = new THREE.Mesh(coverGeom, coverMat);
    cover.position.y = 0.8;
    group.add(cover);

    // Droplets representing DNA samples and reagents
    const dropsGroup = new THREE.Group();
    dropsGroup.name = "ewod_drops";
    group.add(dropsGroup);

    const dropGeom = new THREE.SphereGeometry(0.3, 16, 16);
    dropGeom.scale(1, 0.5, 1);

    const dropMat1 = new THREE.MeshPhysicalMaterial({ color: 0xff00ff, transmission: 0.8, opacity: 1 });
    const dropMat2 = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transmission: 0.8, opacity: 1 });

    const tracks = [];
    
    // Sample droplet
    const sampleDrop = new THREE.Mesh(dropGeom, dropMat1);
    sampleDrop.name = "sampleDrop";
    sampleDrop.position.set(-4, 0.5, -4);
    dropsGroup.add(sampleDrop);

    // Reagent droplet
    const reagentDrop = new THREE.Mesh(dropGeom, dropMat2);
    reagentDrop.name = "reagentDrop";
    reagentDrop.position.set(4, 0.5, 4);
    dropsGroup.add(reagentDrop);

    // Animation: Movement across grid and merging
    const times = [0, 1, 2, 3, 4, 5, 6];
    
    const sampleValues = [
        -4, 0.5, -4,
        -2, 0.5, -4,
        0, 0.5, -2,
        0, 0.5, 0,
        0, 0.5, 0,
        0, 0.5, 0,
        0, 0.5, 0
    ];

    const reagentValues = [
        4, 0.5, 4,
        4, 0.5, 2,
        2, 0.5, 0,
        0, 0.5, 0,
        0, 0.5, 0,
        0, 0.5, 0,
        0, 0.5, 0
    ];

    tracks.push(new THREE.VectorKeyframeTrack(`ewod_drops/sampleDrop.position`, times, sampleValues));
    tracks.push(new THREE.VectorKeyframeTrack(`ewod_drops/reagentDrop.position`, times, reagentValues));

    // Mixing animation
    const scaleTimes = [0, 3, 3.5, 4, 6];
    const scaleValues1 = [
        1, 1, 1, 
        1.5, 1.5, 1.5, 
        0.01, 0.01, 0.01, 
        0.01, 0.01, 0.01, 
        0.01, 0.01, 0.01
    ]; 
    
    const scaleValues2 = [
        1, 1, 1, 
        1, 1, 1, 
        1.5, 1.5, 1.5, 
        2, 2, 2, 
        2, 2, 2
    ]; 
    
    tracks.push(new THREE.VectorKeyframeTrack(`ewod_drops/sampleDrop.scale`, scaleTimes, scaleValues1));
    tracks.push(new THREE.VectorKeyframeTrack(`ewod_drops/reagentDrop.scale`, scaleTimes, scaleValues2));

    const colorTimes = [0, 3.5, 4, 6];
    const colorValues = [
        0, 1, 1,   
        0, 1, 1,   
        1, 1, 1,   
        0.5, 0, 1  
    ];
    tracks.push(new THREE.ColorKeyframeTrack(`ewod_drops/reagentDrop.material.color`, colorTimes, colorValues));

    const clip = new THREE.AnimationClip('EWOD_Mixing', 6, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
