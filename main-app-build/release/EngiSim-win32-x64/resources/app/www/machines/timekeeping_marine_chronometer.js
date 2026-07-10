import { wood, brass, glass, gold } from '../utils/materials.js';

export function createMarineChronometer(THREE) {
    const group = new THREE.Group();
    group.name = 'MarineChronometer';

    // Box
    const boxGeo = new THREE.BoxGeometry(4, 2, 4);
    const box = new THREE.Mesh(boxGeo, wood);
    box.position.y = 1;
    group.add(box);

    const glassTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 3.6), glass);
    glassTop.position.y = 2.05;
    group.add(glassTop);

    // Gimbal Ring
    const gimbal = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.05, 16, 64), brass);
    gimbal.rotation.x = Math.PI / 2;
    gimbal.position.y = 1.5;
    group.add(gimbal);

    // Chronometer Body
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'ChronometerBody';
    bodyGroup.position.set(0, 1.5, 0);
    
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.8, 64), brass);
    bodyGroup.add(body);

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.85, 64), new THREE.MeshStandardMaterial({color: 0xffffff}));
    bodyGroup.add(dial);

    // Hands
    const handGroup = new THREE.Group();
    handGroup.name = 'Hands';
    handGroup.position.y = 0.45;
    
    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 1.0), gold);
    minuteHand.position.z = -0.5;
    handGroup.add(minuteHand);
    bodyGroup.add(handGroup);

    // Balance Wheel (visible)
    const balanceGroup = new THREE.Group();
    balanceGroup.name = 'BalanceWheel';
    balanceGroup.position.set(0, 0.45, 0.5);
    
    const balance = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 16, 32), gold);
    balance.rotation.x = Math.PI / 2;
    balanceGroup.add(balance);
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.02), gold);
    balanceGroup.add(spoke);
    bodyGroup.add(balanceGroup);

    group.add(bodyGroup);

    // Animations
    const bTimes = [0, 0.125, 0.25, 0.375, 0.5];
    const bQuats = [];
    const bAngle = Math.PI * 0.8;
    [0, bAngle, 0, -bAngle, 0].forEach(a => {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), a);
        bQuats.push(q.x, q.y, q.z, q.w);
    });
    const balanceTrack = new THREE.QuaternionKeyframeTrack('BalanceWheel.quaternion', bTimes, bQuats);

    const hTimes = [0, 15, 30, 45, 60];
    const hQuats = [];
    [0, -Math.PI/2, -Math.PI, -Math.PI*1.5, -Math.PI*2].forEach(a => {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), a);
        hQuats.push(q.x, q.y, q.z, q.w);
    });
    const handsTrack = new THREE.QuaternionKeyframeTrack('Hands.quaternion', hTimes, hQuats);

    const clipTick = new THREE.AnimationClip('ChronometerTick', 0.5, [balanceTrack]);
    const clipHands = new THREE.AnimationClip('HandsTurn', 60, [handsTrack]);

    return { group, animationClips: [clipTick, clipHands] };
}
