import { aluminum, titanium, glass } from '../utils/materials.js';

export function createStratosphericAerosolJet(THREE) {
    const group = new THREE.Group();
    group.name = 'StratosphericAerosolJet';

    // Fuselage
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 10, 16);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, titanium);
    group.add(body);

    // Nose
    const noseGeo = new THREE.ConeGeometry(1, 3, 16);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, glass);
    nose.position.z = 6.5;
    group.add(nose);

    // Wings
    const wingGeo = new THREE.BoxGeometry(10, 0.2, 3);
    const wings = new THREE.Mesh(wingGeo, aluminum);
    wings.position.z = -1;
    group.add(wings);

    // Tail
    const tailGeo = new THREE.BoxGeometry(0.2, 3, 2);
    const tail = new THREE.Mesh(tailGeo, aluminum);
    tail.position.y = 1.5;
    tail.position.z = -4;
    group.add(tail);

    // Aerosol Spraying Mechanism (Nozzles)
    const nozzleGroup1 = new THREE.Group();
    nozzleGroup1.position.set(-4, -0.5, -2);
    const nozzleGroup2 = new THREE.Group();
    nozzleGroup2.position.set(4, -0.5, -2);
    group.add(nozzleGroup1);
    group.add(nozzleGroup2);
    
    const sprayGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const tracks = [];
    for(let i=0; i<3; i++) {
        const drop1 = new THREE.Mesh(sprayGeo, glass);
        drop1.name = `Drop1_${i}`;
        nozzleGroup1.add(drop1);
        
        const drop2 = new THREE.Mesh(sprayGeo, glass);
        drop2.name = `Drop2_${i}`;
        nozzleGroup2.add(drop2);

        const startY = -i * 1.5;
        const endY = -(i+1) * 1.5;
        const startScale = 1 - (i * 0.3);
        const endScale = 1 - ((i+1) * 0.3);
        
        tracks.push(new THREE.VectorKeyframeTrack(`Drop1_${i}.position`, [0, 1], [0, startY, 0, 0, endY, 0]));
        tracks.push(new THREE.VectorKeyframeTrack(`Drop2_${i}.position`, [0, 1], [0, startY, 0, 0, endY, 0]));
        
        tracks.push(new THREE.VectorKeyframeTrack(`Drop1_${i}.scale`, [0, 1], [startScale, startScale, startScale, endScale, endScale, endScale]));
        tracks.push(new THREE.VectorKeyframeTrack(`Drop2_${i}.scale`, [0, 1], [startScale, startScale, startScale, endScale, endScale, endScale]));
    }
    
    const sprayClip = new THREE.AnimationClip('Spray', 1, tracks);

    return { group, animationClips: [sprayClip] };
}
