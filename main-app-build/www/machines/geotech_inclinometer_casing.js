import * as mats from '../utils/materials.js';

export function createInclinometerCasing(THREE) {
    const group = new THREE.Group();
    group.name = 'InclinometerCasing';
    
    const casingGroup = new THREE.Group();
    casingGroup.name = 'CasingDeform';
    group.add(casingGroup);

    // Create segments of the casing to show bending
    const segments = 10;
    const height = 1;
    for(let i=0; i<segments; i++) {
        const segGeo = new THREE.CylinderGeometry(0.2, 0.2, height, 16);
        const seg = new THREE.Mesh(segGeo, mats.plastic);
        seg.position.y = i * height + height/2;
        seg.name = `CasingSeg_${i}`;
        casingGroup.add(seg);
    }

    // Guide Wheels (probe)
    const probeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    const probe = new THREE.Mesh(probeGeo, mats.aluminum);
    probe.position.set(0, 9.5, 0);
    probe.name = 'InclinometerProbe';
    group.add(probe);

    // Animation: Probe going down, casing bending
    const times = [0, 2, 4];
    const probeValues = [
        0, 9.5, 0,
        0, 0.5, 0,
        0, 9.5, 0
    ];
    const probeTrack = new THREE.VectorKeyframeTrack('InclinometerProbe.position', times, probeValues);
    
    // Bend animation for a segment
    const segTimes = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0.1));
    const bendValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q1.x, q1.y, q1.z, q1.w
    ];
    
    const segTrack = new THREE.QuaternionKeyframeTrack('CasingSeg_5.quaternion', segTimes, bendValues);

    const clip = new THREE.AnimationClip('ProbeDescent', 4.0, [probeTrack, segTrack]);
    
    return { group, animationClips: [clip] };
}
