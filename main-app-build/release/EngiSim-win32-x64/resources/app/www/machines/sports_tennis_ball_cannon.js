import { materials } from '../utils/materials.js';

export function createTennisBallCannon(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, materials.steel);
    base.position.y = 0.25;
    group.add(base);

    const turretGroup = new THREE.Group();
    turretGroup.name = 'turret';
    turretGroup.position.y = 0.5;
    
    const turretBaseGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const turretBase = new THREE.Mesh(turretBaseGeo, materials.plastic);
    turretGroup.add(turretBase);

    const barrelPivot = new THREE.Group();
    barrelPivot.name = 'barrelPivot';
    barrelPivot.position.y = 0.4;
    
    const barrelGeo = new THREE.CylinderGeometry(0.15, 0.15, 2);
    const barrel = new THREE.Mesh(barrelGeo, materials.aluminum);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = 1;
    barrelPivot.add(barrel);
    
    turretGroup.add(barrelPivot);
    group.add(turretGroup);

    const ballGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const ball = new THREE.Mesh(ballGeo, materials.plastic);
    ball.name = 'tennisBall';
    ball.position.set(0, 0.9, 0); 
    group.add(ball);

    const times = [0, 1, 2, 3, 4];
    
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/4);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/4);
    const turretRotVals = [
        ...q0.toArray(), ...q1.toArray(), ...q1.toArray(), ...q0.toArray(), ...q0.toArray()
    ];
    const turretTrack = new THREE.QuaternionKeyframeTrack('turret.quaternion', times, turretRotVals);

    const tilt0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/8);
    const tilt1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/16);
    const tiltVals = [
        ...tilt0.toArray(), ...tilt0.toArray(), ...tilt1.toArray(), ...tilt1.toArray(), ...tilt0.toArray()
    ];
    const barrelTrack = new THREE.QuaternionKeyframeTrack('barrelPivot.quaternion', times, tiltVals);

    const ballTimes = [0, 0.9, 1.2, 1.5, 4];
    const sx = Math.sin(Math.PI/4);
    const sz = Math.cos(Math.PI/4);
    const ballPosVals = [
        0, 0.9, 0,
        0, 0.9, 0,
        sx * 5, 0.9 + Math.sin(Math.PI/8)*5, sz * 5, 
        0, 0.9, 0, 
        0, 0.9, 0
    ];
    const ballTrack = new THREE.VectorKeyframeTrack('tennisBall.position', ballTimes, ballPosVals);

    const clip = new THREE.AnimationClip('ShootAction', 4, [turretTrack, barrelTrack, ballTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
