import { steel, yellowAccent, darkSteel, plastic } from '../utils/materials.js';

export function createVibratoryPileDriver(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Soil
    const soilGeo = new THREE.BoxGeometry(10, 10, 10);
    const soil = new THREE.Mesh(soilGeo, plastic); 
    soil.position.set(0, -5, 0);
    group.add(soil);

    // Sheet pile
    const pileGeo = new THREE.BoxGeometry(4, 20, 0.2);
    const pile = new THREE.Mesh(pileGeo, steel);
    pile.position.set(0, 10, 0);
    group.add(pile);

    // Vibratory Hammer Housing
    const hammerGroup = new THREE.Group();
    hammerGroup.position.set(0, 21, 0);
    
    const housingGeo = new THREE.BoxGeometry(5, 4, 3);
    const housing = new THREE.Mesh(housingGeo, yellowAccent);
    hammerGroup.add(housing);

    // Eccentric weights
    const weightGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
    
    const weight1 = new THREE.Mesh(weightGeo, darkSteel);
    weight1.position.set(-1.5, 0, 0.5);
    hammerGroup.add(weight1);

    const weight2 = new THREE.Mesh(weightGeo, darkSteel);
    weight2.position.set(1.5, 0, 0.5);
    hammerGroup.add(weight2);

    group.add(hammerGroup);

    // Animations
    const duration = 4;
    
    // Pile drives down
    const pTimes = [0, 4];
    const pValues = [
        0, 10, 0,
        0, 0, 0
    ];
    const pTrack = new THREE.VectorKeyframeTrack(`${pile.uuid}.position`, pTimes, pValues);

    // Weights rotate rapidly
    const times = [];
    const w1Quats = [];
    const w2Quats = [];
    const vibTimes = [];
    const vibValues = [];
    const steps = 60;
    
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);
        vibTimes.push(t);
        
        const angle = i * Math.PI * 4;
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        w1Quats.push(q1.x, q1.y, q1.z, q1.w);
        
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -angle);
        w2Quats.push(q2.x, q2.y, q2.z, q2.w);
        
        const yBase = 21 - (10 * (t / duration));
        const yVib = yBase + (i % 2 === 0 ? 0.2 : -0.2);
        vibValues.push(0, yVib, 0);
    }
    
    const w1Track = new THREE.QuaternionKeyframeTrack(`${weight1.uuid}.quaternion`, times, w1Quats);
    const w2Track = new THREE.QuaternionKeyframeTrack(`${weight2.uuid}.quaternion`, times, w2Quats);
    const vibTrack = new THREE.VectorKeyframeTrack(`${hammerGroup.uuid}.position`, vibTimes, vibValues);

    const clip = new THREE.AnimationClip('DrivePile', duration, [
        pTrack, vibTrack, w1Track, w2Track
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
