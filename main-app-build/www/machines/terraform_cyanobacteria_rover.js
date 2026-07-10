import { materials } from '../utils/materials.js';

export function createCyanobacteriaRover(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.BoxGeometry(40, 15, 60);
    const body = new THREE.Mesh(bodyGeo, materials.metallicDark || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    body.position.y = 15;
    group.add(body);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(8, 8, 10, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = materials.rubber || new THREE.MeshStandardMaterial({color: 0x111111});
    
    const wheelPositions = [
        [-22, 8, 20], [22, 8, 20],
        [-22, 8, -20], [22, 8, -20],
        [-22, 8, 0], [22, 8, 0]
    ];
    
    const tracks = [];
    const times = [0, 2];
    const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    const rotValues = [qStart.x, qStart.y, qStart.z, qStart.w, qEnd.x, qEnd.y, qEnd.z, qEnd.w];
    
    wheelPositions.forEach((pos, i) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(...pos);
        wheel.name = `wheel_${i}`;
        group.add(wheel);
        
        const track = new THREE.QuaternionKeyframeTrack(`wheel_${i}.quaternion`, times, rotValues);
        tracks.push(track);
    });

    // Seeding Arm
    const armGeo = new THREE.CylinderGeometry(2, 2, 20);
    const arm = new THREE.Mesh(armGeo, materials.metallic || new THREE.MeshStandardMaterial({color: 0x33aa33}));
    arm.position.set(0, 25, -30);
    arm.rotation.x = Math.PI / 4;
    group.add(arm);

    // Dispenser
    const dispGeo = new THREE.ConeGeometry(5, 10);
    const disp = new THREE.Mesh(dispGeo, materials.glass || new THREE.MeshStandardMaterial({color: 0x11ff11}));
    disp.position.set(0, -10, 0);
    disp.name = 'dispenser';
    arm.add(disp);

    // Dispenser animation
    const dispQStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const dispQEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
    const dispTrack = new THREE.QuaternionKeyframeTrack(`dispenser.quaternion`, [0, 1], [
        dispQStart.x, dispQStart.y, dispQStart.z, dispQStart.w,
        dispQEnd.x, dispQEnd.y, dispQEnd.z, dispQEnd.w
    ]);
    tracks.push(dispTrack);

    const driveClip = new THREE.AnimationClip('DriveAndSeed', 2, tracks);
    animationClips.push(driveClip);

    return { group, animationClips };
}
