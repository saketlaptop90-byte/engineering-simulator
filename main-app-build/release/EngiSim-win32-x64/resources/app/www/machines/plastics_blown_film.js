import * as materials from '../utils/materials.js';

export function createBlownFilmExtrusionTower(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base & Die
    const baseGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const base = new THREE.Mesh(baseGeom, materials.steel);
    base.position.y = 0.5;
    group.add(base);

    const dieGeom = new THREE.CylinderGeometry(0.8, 1.0, 0.5, 32);
    const die = new THREE.Mesh(dieGeom, materials.chrome);
    die.position.y = 1.25;
    group.add(die);

    // Tower Frame
    const frameMat = materials.darkSteel;
    const postGeom = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    for (let i = 0; i < 4; i++) {
        const post = new THREE.Mesh(postGeom, frameMat);
        post.position.set(
            1.2 * Math.cos(i * Math.PI / 2),
            4,
            1.2 * Math.sin(i * Math.PI / 2)
        );
        group.add(post);
    }
    const topFrameGeom = new THREE.TorusGeometry(1.2, 0.1, 8, 4);
    topFrameGeom.rotateY(Math.PI / 4);
    topFrameGeom.rotateX(Math.PI / 2);
    const topFrame = new THREE.Mesh(topFrameGeom, frameMat);
    topFrame.position.y = 8;
    group.add(topFrame);

    // Bubble (Film)
    const bubbleGeom = new THREE.CylinderGeometry(0.1, 0.7, 6, 32, 1, true);
    // Move origin to bottom of bubble
    bubbleGeom.translate(0, 3, 0);
    const bubble = new THREE.Mesh(bubbleGeom, materials.glass);
    bubble.position.y = 1.5;
    bubble.name = 'filmBubble';
    group.add(bubble);

    // Nip Rollers
    const rollerGroup = new THREE.Group();
    const rollerGeom = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
    rollerGeom.rotateZ(Math.PI / 2);
    const roller1 = new THREE.Mesh(rollerGeom, materials.rubber);
    roller1.position.set(0, 7.6, 0.15);
    const roller2 = new THREE.Mesh(rollerGeom, materials.rubber);
    roller2.position.set(0, 7.6, -0.15);
    rollerGroup.add(roller1, roller2);
    
    roller1.name = 'roller1';
    roller2.name = 'roller2';
    group.add(rollerGroup);

    // Animations: Bubble slightly scales, rollers rotate
    const times = [0, 1, 2];
    
    // Bubble breathing scale
    const scaleValues = [
        1, 1, 1,
        1.05, 1, 1.05,
        1, 1, 1
    ];
    const bubbleScaleTrack = new THREE.VectorKeyframeTrack(`filmBubble.scale`, times, scaleValues);
    
    // Roller rotation
    const rTimes = [0, 2];
    const q1Start = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q1End = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 4);
    const q2End = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI * 4);
    
    const r1RotValues = [q1Start.x, q1Start.y, q1Start.z, q1Start.w, q1End.x, q1End.y, q1End.z, q1End.w];
    const r2RotValues = [q1Start.x, q1Start.y, q1Start.z, q1Start.w, q2End.x, q2End.y, q2End.z, q2End.w];
    
    const roller1Track = new THREE.QuaternionKeyframeTrack(`roller1.quaternion`, rTimes, r1RotValues);
    const roller2Track = new THREE.QuaternionKeyframeTrack(`roller2.quaternion`, rTimes, r2RotValues);

    const clip = new THREE.AnimationClip('ExtrusionProcess', 2, [bubbleScaleTrack, roller1Track, roller2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
