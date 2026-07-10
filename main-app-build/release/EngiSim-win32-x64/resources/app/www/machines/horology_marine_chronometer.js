import { materials } from '../utils/materials.js';

export function createMarineChronometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Wooden Box
    const boxGeometry = new THREE.BoxGeometry(3, 2, 3);
    const box = new THREE.Mesh(boxGeometry, materials.wood);
    box.position.y = 1;
    group.add(box);

    // Gimbal Ring (Brass)
    const gimbal = new THREE.Group();
    gimbal.name = "Gimbal";
    gimbal.position.y = 2.2;
    
    const gimbalRingGeom = new THREE.TorusGeometry(1.4, 0.05, 16, 64);
    const gimbalRing = new THREE.Mesh(gimbalRingGeom, materials.brass);
    gimbalRing.rotation.x = Math.PI / 2;
    gimbal.add(gimbalRing);
    group.add(gimbal);

    // Chronometer Bowl (Brass)
    const bowl = new THREE.Group();
    bowl.name = "Bowl";
    
    const bowlGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    const bowlMesh = new THREE.Mesh(bowlGeometry, materials.brass);
    bowl.add(bowlMesh);
    gimbal.add(bowl);

    // Clock Face (Steel)
    const faceGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.05, 32);
    const face = new THREE.Mesh(faceGeometry, materials.steel);
    face.position.y = 0.4;
    bowl.add(face);
    
    // Hands
    const hand = new THREE.Group();
    hand.name = "Hand";
    hand.position.set(0, 0.45, 0);

    const handGeo = new THREE.BoxGeometry(0.05, 0.02, 0.8);
    const handMesh = new THREE.Mesh(handGeo, materials.steel);
    handMesh.position.z = -0.4; // offset so it pivots at center
    hand.add(handMesh);
    bowl.add(hand);

    // Gimbal animation: swaying
    const gimbalTrack = new THREE.NumberKeyframeTrack(
        'Gimbal.rotation[x]',
        [0, 2, 4],
        [0, 0.2, 0]
    );

    const bowlTrack = new THREE.NumberKeyframeTrack(
        'Bowl.rotation[z]',
        [0, 2.5, 5],
        [-0.15, 0.15, -0.15]
    );
    
    const handTrack = new THREE.NumberKeyframeTrack(
        'Hand.rotation[y]',
        [0, 60],
        [0, -Math.PI * 2]
    );

    const gimbalClip = new THREE.AnimationClip('GimbalSway', 4, [gimbalTrack]);
    const bowlClip = new THREE.AnimationClip('BowlSway', 5, [bowlTrack]);
    const handClip = new THREE.AnimationClip('HandTick', 60, [handTrack]);
    
    animationClips.push(gimbalClip, bowlClip, handClip);

    return { group, animationClips };
}
