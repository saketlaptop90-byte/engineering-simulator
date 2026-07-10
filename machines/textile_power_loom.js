import { wood, steel, iron, aluminum } from '../utils/materials.js';

export function createPowerLoom(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(8, 0.5, 6);
    const base = new THREE.Mesh(baseGeo, iron);
    base.position.y = 0.25;
    group.add(base);

    // Frame Pillars
    const pillarGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
    for(let i=0; i<4; i++) {
        const pillar = new THREE.Mesh(pillarGeo, iron);
        pillar.position.set((i%2===0?3.5:-3.5), 3.25, (i<2?2.5:-2.5));
        group.add(pillar);
    }

    // Warp beam
    const beamGeo = new THREE.CylinderGeometry(0.6, 0.6, 5, 16);
    const beamMesh = new THREE.Mesh(beamGeo, wood);
    beamMesh.rotation.z = Math.PI / 2;
    
    const beam = new THREE.Group();
    beam.position.set(0, 4, -2.5);
    beam.name = "warpBeam";
    beam.add(beamMesh);
    group.add(beam);

    // Heddles
    const heddleGroup1 = new THREE.Group();
    const heddleGroup2 = new THREE.Group();
    heddleGroup1.name = "heddleGroup1";
    heddleGroup2.name = "heddleGroup2";
    
    const heddleGeo = new THREE.BoxGeometry(6, 4, 0.1);
    const h1 = new THREE.Mesh(heddleGeo, aluminum);
    const h2 = new THREE.Mesh(heddleGeo, aluminum);
    heddleGroup1.add(h1);
    heddleGroup2.add(h2);

    heddleGroup1.position.set(0, 3, 0);
    heddleGroup2.position.set(0, 3, 0.5);
    group.add(heddleGroup1);
    group.add(heddleGroup2);

    // Shuttle
    const shuttleGeo = new THREE.BoxGeometry(0.8, 0.2, 0.3);
    const shuttle = new THREE.Mesh(shuttleGeo, wood);
    shuttle.position.set(-3, 2, 1);
    shuttle.name = "shuttle";
    group.add(shuttle);

    // Animations
    const times = [0, 0.5, 1, 1.5, 2];

    const shuttleValues = [
        -3, 2, 1,
         3, 2, 1,
         3, 2, 1,
        -3, 2, 1,
        -3, 2, 1
    ];
    const shuttleTrack = new THREE.VectorKeyframeTrack('shuttle.position', times, shuttleValues);

    const h1Values = [
        0, 2.5, 0,
        0, 3.5, 0,
        0, 2.5, 0,
        0, 3.5, 0,
        0, 2.5, 0
    ];
    const h1Track = new THREE.VectorKeyframeTrack('heddleGroup1.position', times, h1Values);

    const h2Values = [
        0, 3.5, 0.5,
        0, 2.5, 0.5,
        0, 3.5, 0.5,
        0, 2.5, 0.5,
        0, 3.5, 0.5
    ];
    const h2Track = new THREE.VectorKeyframeTrack('heddleGroup2.position', times, h2Values);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    
    const beamTrack = new THREE.QuaternionKeyframeTrack('warpBeam.quaternion', [0, 1, 2], [...q0.toArray(), ...q1.toArray(), ...q2.toArray()]);

    const clip = new THREE.AnimationClip('PowerLoomAction', 2, [shuttleTrack, h1Track, h2Track, beamTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
