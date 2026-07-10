import * as materials from '../utils/materials.js';

export function createWarpTyingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x8892b0, roughness: 0.3 });
    const movingMat = materials.accentMaterial || new THREE.MeshStandardMaterial({ color: 0xe28743 });

    // Main frame
    const frameGeo = new THREE.BoxGeometry(6, 1.5, 2);
    const frame = new THREE.Mesh(frameGeo, metalMat);
    frame.position.y = 0.75;
    group.add(frame);

    // Thread carriage (moves left to right)
    const carriageGroup = new THREE.Group();
    carriageGroup.position.set(-2.5, 1.75, 0);
    
    const carriageGeo = new THREE.BoxGeometry(0.8, 0.8, 1.5);
    const carriage = new THREE.Mesh(carriageGeo, metalMat);
    carriageGroup.add(carriage);

    // Tying needle mechanism
    const needleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const needle = new THREE.Mesh(needleGeo, movingMat);
    needle.position.set(0, -0.4, 0);
    carriageGroup.add(needle);
    
    group.add(carriageGroup);

    // Animation: Carriage moves X, Needle moves Y
    const duration = 4;
    const times = [0, 1, 2, 3, 4];
    
    // Carriage sweeping
    const carriageX = [-2.5, -1.0, 0.5, 2.5, -2.5];
    const posTrack = new THREE.VectorKeyframeTrack(`${carriageGroup.uuid}.position`, times, 
        [-2.5, 1.75, 0,  -1.0, 1.75, 0,  0.5, 1.75, 0,  2.5, 1.75, 0,  -2.5, 1.75, 0]
    );

    // Needle stabbing
    const needleTimes = [];
    const needleVals = [];
    for(let i=0; i<=40; i++) {
        const t = (i/40) * duration;
        needleTimes.push(t);
        // rapid up down
        const y = -0.4 + Math.sin(t * Math.PI * 10) * 0.3;
        needleVals.push(0, y, 0);
    }
    const needleTrack = new THREE.VectorKeyframeTrack(`${needle.uuid}.position`, needleTimes, needleVals);

    const clip = new THREE.AnimationClip('WarpTying', duration, [posTrack, needleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
