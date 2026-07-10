import { concrete, darkSteel, aluminum } from '../utils/materials.js';

export function createShieldTunnelingRing(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const ringGroup = new THREE.Group();
    ringGroup.name = 'SegmentRing';
    group.add(ringGroup);

    // Create segments of the ring
    const segmentsCount = 6;
    const radius = 5;
    const thickness = 0.5;
    const depth = 2;
    
    for (let i = 0; i < segmentsCount; i++) {
        const angleStart = (i / segmentsCount) * Math.PI * 2;
        const angleLen = (Math.PI * 2) / segmentsCount - 0.05; // slight gap
        
        const shape = new THREE.Shape();
        shape.absarc(0, 0, radius + thickness, angleStart, angleStart + angleLen, false);
        shape.absarc(0, 0, radius, angleStart + angleLen, angleStart, true);
        
        const extrudeSettings = { depth: depth, curveSegments: 16, bevelEnabled: false };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        const segmentGroup = new THREE.Group();
        segmentGroup.name = `Segment_${i}`;
        
        const mesh = new THREE.Mesh(geo, concrete);
        segmentGroup.add(mesh);
        ringGroup.add(segmentGroup);

        // Animate segment placement
        const times = [0, i*1, (i+1)*1, 6];
        const pushVec = new THREE.Vector3(
            Math.cos(angleStart + angleLen/2) * 5,
            Math.sin(angleStart + angleLen/2) * 5,
            10
        );
        
        const values = [
            pushVec.x, pushVec.y, pushVec.z,
            pushVec.x, pushVec.y, pushVec.z,
            0, 0, 0,
            0, 0, 0
        ];
        
        const track = new THREE.VectorKeyframeTrack(`${segmentGroup.name}.position`, times, values);
        
        const clip = new THREE.AnimationClip(`AssembleSegment_${i}`, 6, [track]);
        animationClips.push(clip);
    }
    
    // Cutter head group
    const cutterGroup = new THREE.Group();
    cutterGroup.position.z = depth + 1;
    cutterGroup.rotation.x = Math.PI / 2;
    group.add(cutterGroup);

    const cutterGeo = new THREE.CylinderGeometry(radius+0.6, radius+0.6, 1, 32);
    const cutter = new THREE.Mesh(cutterGeo, darkSteel);
    cutter.name = 'CutterHead';
    cutterGroup.add(cutter);

    // Cutting animation
    const rotTimes = [0, 1, 2, 3, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*1.5);
    const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);
    const rotValues = [...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray(), ...q5.toArray()];
    
    const rotTrack = new THREE.QuaternionKeyframeTrack('CutterHead.quaternion', rotTimes, rotValues);
    const clipCutter = new THREE.AnimationClip('Cutting', 4, [rotTrack]);
    animationClips.push(clipCutter);

    return { group, animationClips };
}
