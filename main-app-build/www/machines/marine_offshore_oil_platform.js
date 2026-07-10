import { materials } from '../utils/materials.js';

export function createOffshoreOilPlatform(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x555555 });
    const matConcrete = materials.concrete || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const matYellow = materials.yellowPaint || new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const legGeo = new THREE.CylinderGeometry(0.5, 0.5, 10);
            const leg = new THREE.Mesh(legGeo, matConcrete);
            leg.position.set(i * 3, -5, j * 3);
            group.add(leg);
        }
    }

    const deckGeo = new THREE.BoxGeometry(8, 1, 8);
    const deck = new THREE.Mesh(deckGeo, matSteel);
    group.add(deck);

    const drillPivot = new THREE.Group();
    drillPivot.name = 'drillPivot';
    group.add(drillPivot);
    const drillGeo = new THREE.CylinderGeometry(0.2, 0.2, 12);
    const drill = new THREE.Mesh(drillGeo, matSteel);
    drill.position.y = -5;
    drillPivot.add(drill);

    const cranePivot = new THREE.Group();
    cranePivot.position.set(3, 1, 3);
    cranePivot.name = 'cranePivot';
    group.add(cranePivot);
    const craneGeo = new THREE.BoxGeometry(0.5, 4, 0.5);
    const crane = new THREE.Mesh(craneGeo, matYellow);
    crane.position.y = 2;
    cranePivot.add(crane);

    const duration = 2;
    const times = [0, duration / 2, duration];
    
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const drillTrack = new THREE.QuaternionKeyframeTrack('drillPivot.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ]);

    const cq0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 4);
    const cq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    
    const craneTrack = new THREE.QuaternionKeyframeTrack('cranePivot.quaternion', times, [
        cq0.x, cq0.y, cq0.z, cq0.w,
        cq1.x, cq1.y, cq1.z, cq1.w,
        cq0.x, cq0.y, cq0.z, cq0.w,
    ]);

    const clip = new THREE.AnimationClip('Platform_Action', duration, [drillTrack, craneTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
