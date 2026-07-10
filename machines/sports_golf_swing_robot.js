import { materials } from '../utils/materials.js';

export function createGolfSwingRobot(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(3, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, materials.steel);
    base.position.y = 0.25;
    group.add(base);

    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.3, 2.5);
    const pillar = new THREE.Mesh(pillarGeo, materials.aluminum);
    pillar.position.set(0, 1.5, -0.5);
    group.add(pillar);

    const shoulderGroup = new THREE.Group();
    shoulderGroup.name = 'shoulder';
    shoulderGroup.position.set(0, 2.7, 0);
    
    const shoulderJointGeo = new THREE.SphereGeometry(0.25);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeo, materials.plastic);
    shoulderGroup.add(shoulderJoint);

    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2);
    const arm = new THREE.Mesh(armGeo, materials.carbonFiber);
    arm.position.y = -0.6;
    shoulderGroup.add(arm);

    const clubGroup = new THREE.Group();
    clubGroup.name = 'clubPivot';
    clubGroup.position.y = -1.2;

    const shaftGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.0);
    const shaft = new THREE.Mesh(shaftGeo, materials.steel);
    shaft.position.y = -0.5;
    clubGroup.add(shaft);

    const headGeo = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const clubHead = new THREE.Mesh(headGeo, materials.aluminum);
    clubHead.position.set(0.05, -1.0, 0.0);
    clubGroup.add(clubHead);

    shoulderGroup.add(clubGroup);
    group.add(shoulderGroup);

    const teeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.1);
    const tee = new THREE.Mesh(teeGeo, materials.plastic);
    tee.position.set(0, 0.55, 0);
    group.add(tee);

    const ballGeo = new THREE.SphereGeometry(0.04);
    const ball = new THREE.Mesh(ballGeo, materials.plastic);
    ball.name = 'golfBall';
    ball.position.set(0, 0.64, 0);
    group.add(ball);

    const times = [0, 1.5, 1.8, 2.5, 4];

    const s0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0); 
    const s1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 0.75); 
    const s2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0); 
    const s3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI * 0.75); 
    
    const shoulderVals = [
        ...s0.toArray(), ...s1.toArray(), ...s2.toArray(), ...s3.toArray(), ...s0.toArray()
    ];
    const shoulderTrack = new THREE.QuaternionKeyframeTrack('shoulder.quaternion', times, shoulderVals);

    const c0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const c1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);
    const c2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const c3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);
    
    const clubVals = [
        ...c0.toArray(), ...c1.toArray(), ...c2.toArray(), ...c3.toArray(), ...c0.toArray()
    ];
    const clubTrack = new THREE.QuaternionKeyframeTrack('clubPivot.quaternion', times, clubVals);

    const ballTimes = [0, 1.79, 1.8, 2.5, 4];
    const b0 = [0, 0.64, 0];
    const b2 = [10, 5, 0];
    
    const ballVals = [
        ...b0, ...b0, ...b2, ...b2, ...b0 
    ];
    const ballTrack = new THREE.VectorKeyframeTrack('golfBall.position', ballTimes, ballVals);

    const clip = new THREE.AnimationClip('SwingAction', 4, [shoulderTrack, clubTrack, ballTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
