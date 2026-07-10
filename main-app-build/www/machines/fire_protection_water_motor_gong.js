import { materials } from '../utils/materials.js';

export function createWaterMotorGong(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const redMat = (materials && materials.redPaint) || new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const metalMat = (materials && materials.steel) || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
    const brassMat = (materials && materials.brass) || new THREE.MeshStandardMaterial({ color: 0xb5a642 });

    // Wall Plate
    const plateGeom = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const plate = new THREE.Mesh(plateGeom, redMat);
    plate.rotation.x = Math.PI / 2;
    group.add(plate);

    // Gong Bell
    const bellGeom = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const bell = new THREE.Mesh(bellGeom, redMat);
    bell.rotation.x = -Math.PI / 2;
    bell.position.set(0, 0, 0.2);
    group.add(bell);

    // Striker
    const strikerGroup = new THREE.Group();
    strikerGroup.position.set(0, 0, 0.5);
    strikerGroup.name = "strikerGroup";
    
    const armGeom = new THREE.BoxGeometry(0.2, 2, 0.2);
    const arm = new THREE.Mesh(armGeom, metalMat);
    arm.position.set(0, 1, 0);
    strikerGroup.add(arm);

    const headGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const head = new THREE.Mesh(headGeom, brassMat);
    head.position.set(0, 2, 0);
    strikerGroup.add(head);

    group.add(strikerGroup);

    // Motor Housing (Back)
    const motorGeom = new THREE.CylinderGeometry(1, 1, 1, 32);
    const motor = new THREE.Mesh(motorGeom, redMat);
    motor.rotation.x = Math.PI / 2;
    motor.position.set(0, 0, -0.6);
    group.add(motor);

    // Animation: Striker hitting bell repeatedly
    const times = [0, 0.05, 0.1, 0.15, 0.2];
    const strikerTrack = new THREE.QuaternionKeyframeTrack(
        `strikerGroup.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/8)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/8)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/8)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/8)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/8)).toArray()
        ]
    );

    const clip = new THREE.AnimationClip("Ring", 0.2, [strikerTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
