import { steel, castIron, aluminum, brass } from '../utils/materials.js';

export function createVibratoryBowlFeeder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base drive unit
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 32);
    const base = new THREE.Mesh(baseGeo, castIron);
    base.position.y = 0.5;
    group.add(base);

    // Bowl
    const bowlGeo = new THREE.CylinderGeometry(1.5, 1, 1.5, 32, 1, true);
    const bowl = new THREE.Mesh(bowlGeo, aluminum);
    bowl.position.y = 1.75;
    bowl.name = "Bowl";
    group.add(bowl);

    // Inner spiral track (simplified using torus segments)
    const trackGeo = new THREE.TorusGeometry(1.2, 0.1, 8, 32, Math.PI * 1.5);
    const track = new THREE.Mesh(trackGeo, steel);
    track.rotation.x = Math.PI / 2;
    track.rotation.y = -0.2; // tilt for spiral effect
    bowl.add(track);

    // Parts to be fed
    const partGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const partsGroup = new THREE.Group();
    bowl.add(partsGroup);

    for (let i = 0; i < 5; i++) {
        const part = new THREE.Mesh(partGeo, brass);
        const angle = (i / 5) * Math.PI * 1.5;
        part.position.set(Math.cos(angle) * 1.2, i * 0.1, Math.sin(angle) * 1.2);
        part.name = `Part${i}`;
        partsGroup.add(part);
    }

    // Animation: Vibratory motion (rapid small rotations/translations)
    const times = [0, 0.025, 0.05, 0.075, 0.1];
    
    // Tiny rotational vibration around Y and slight up/down
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.02);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.02);
    
    const rotValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q1.x, q1.y, q1.z, q1.w,
        q3.x, q3.y, q3.z, q3.w,
        q1.x, q1.y, q1.z, q1.w
    ];
    const rotTrack = new THREE.QuaternionKeyframeTrack(bowl.name + '.quaternion', times, rotValues);

    const posValues = [
        0, 1.75, 0,
        0, 1.76, 0,
        0, 1.75, 0,
        0, 1.76, 0,
        0, 1.75, 0
    ];
    const posTrack = new THREE.VectorKeyframeTrack(bowl.name + '.position', times, posValues);

    // Part movement along track
    const partTracks = [];
    const partTimes = [0, 5];
    for (let i = 0; i < 5; i++) {
        const startAngle = (i / 5) * Math.PI * 1.5;
        const endAngle = startAngle + Math.PI; // Moves along spiral
        
        const startPos = [Math.cos(startAngle) * 1.2, i * 0.1, Math.sin(startAngle) * 1.2];
        const endPos = [Math.cos(endAngle) * 1.2, (i * 0.1) + 0.5, Math.sin(endAngle) * 1.2];
        
        const pTrack = new THREE.VectorKeyframeTrack(`Part${i}.position`, partTimes, [...startPos, ...endPos]);
        partTracks.push(pTrack);
    }

    // Combine fast vibration and slow part movement into one clip
    const clip = new THREE.AnimationClip('VibrateAndFeed', 5, [rotTrack, posTrack, ...partTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
