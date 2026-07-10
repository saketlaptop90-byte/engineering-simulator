import { wood, brass, glass, gold } from '../utils/materials.js';

export function createPendulumEscapement(THREE) {
    const group = new THREE.Group();
    group.name = 'PendulumEscapement';

    // Frame
    const frameGeo = new THREE.BoxGeometry(0.5, 6, 2);
    const frame = new THREE.Mesh(frameGeo, wood);
    frame.position.set(-1, 3, 0);
    group.add(frame);
    
    const frame2 = new THREE.Mesh(frameGeo, wood);
    frame2.position.set(1, 3, 0);
    group.add(frame2);

    // Escape Wheel
    const wheelGroup = new THREE.Group();
    wheelGroup.name = 'EscapeWheel';
    wheelGroup.position.set(0, 4.5, 0);
    
    const wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 15);
    const wheel = new THREE.Mesh(wheelGeo, brass);
    wheel.rotation.x = Math.PI / 2;
    wheelGroup.add(wheel);
    
    // Add teeth
    for(let i=0; i<15; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), gold);
        tooth.position.y = 1.6;
        const pivot = new THREE.Group();
        pivot.rotation.z = (i / 15) * Math.PI * 2;
        pivot.add(tooth);
        wheelGroup.add(pivot);
    }
    group.add(wheelGroup);

    // Anchor & Pendulum
    const anchorGroup = new THREE.Group();
    anchorGroup.name = 'AnchorGroup';
    anchorGroup.position.set(0, 5.5, 0);
    
    const anchor = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.1, 8, 32, Math.PI), brass);
    anchor.rotation.z = 0;
    anchorGroup.add(anchor);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), brass);
    rod.position.y = -2;
    anchorGroup.add(rod);

    const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32), gold);
    bob.rotation.x = Math.PI / 2;
    bob.position.y = -4;
    anchorGroup.add(bob);

    group.add(anchorGroup);

    // Animation
    const pendulumTimes = [0, 0.5, 1.0, 1.5, 2.0];
    const angle = 0.2;
    const pendulumQuats = [
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angle),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -angle),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angle)
    ];
    
    const qArray = [];
    pendulumQuats.forEach(q => qArray.push(q.x, q.y, q.z, q.w));
    const pendulumTrack = new THREE.QuaternionKeyframeTrack('AnchorGroup.quaternion', pendulumTimes, qArray);

    const wheelTimes = [0, 0.5, 1.0, 1.5, 2.0];
    const wheelStep = (Math.PI * 2) / 15;
    const wq = [
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -wheelStep * 0.5),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -wheelStep * 0.5),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -wheelStep),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -wheelStep)
    ];
    const wArray = [];
    wq.forEach(q => wArray.push(q.x, q.y, q.z, q.w));
    const wheelTrack = new THREE.QuaternionKeyframeTrack('EscapeWheel.quaternion', wheelTimes, wArray);

    const clip = new THREE.AnimationClip('EscapementTick', 2.0, [pendulumTrack, wheelTrack]);

    return { group, animationClips: [clip] };
}
