import { aluminum, glass, plastic, redAccent } from '../utils/materials.js';

export function createDishwasher(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer Body (Cutaway)
    const wallThickness = 0.2;
    const bodyMat = aluminum;

    const bottom = new THREE.Mesh(new THREE.BoxGeometry(4, wallThickness, 4), bodyMat);
    bottom.position.y = wallThickness / 2;
    group.add(bottom);

    const back = new THREE.Mesh(new THREE.BoxGeometry(4, 4, wallThickness), bodyMat);
    back.position.set(0, 2, -2 + wallThickness/2);
    group.add(back);

    const left = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, 4, 4), bodyMat);
    left.position.set(-2 + wallThickness/2, 2, 0);
    group.add(left);
    
    // Front door
    const door = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, wallThickness), glass);
    door.position.set(0, 0.75, 2 - wallThickness/2);
    group.add(door);

    // Rack
    const rackGeo = new THREE.BoxGeometry(3.5, 0.5, 3.5);
    const rackMat = new THREE.MeshBasicMaterial({color: 0xcccccc, wireframe: true});
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(0, 1.5, 0);
    group.add(rack);

    // Spray Arm
    const armGeo = new THREE.BoxGeometry(3, 0.1, 0.3);
    const arm = new THREE.Mesh(armGeo, plastic);
    arm.name = 'SprayArm';
    arm.position.set(0, 0.5, 0);
    group.add(arm);

    // Water Spray Cones (Attached to Arm)
    const waterGeo = new THREE.ConeGeometry(0.5, 2, 16, 1, true);
    const waterMat = new THREE.MeshBasicMaterial({color: 0x88ccff, transparent: true, opacity: 0.5, side: THREE.DoubleSide});
    
    const spray1 = new THREE.Mesh(waterGeo, waterMat);
    spray1.geometry.translate(0, 1, 0); 
    spray1.position.set(1, 0, 0);
    arm.add(spray1);

    const spray2 = new THREE.Mesh(waterGeo, waterMat);
    spray2.geometry.translate(0, 1, 0);
    spray2.position.set(-1, 0, 0);
    arm.add(spray2);

    // Animation
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const track = new THREE.QuaternionKeyframeTrack('SprayArm.quaternion', times, values);
    
    // Animate water spray scaling
    const scaleTimes = [0, 0.5, 1, 1.5, 2];
    const scaleVals = [
        1, 1, 1,
        1, 1.2, 1,
        1, 1, 1,
        1, 1.2, 1,
        1, 1, 1
    ];
    const scaleTrack = new THREE.VectorKeyframeTrack('SprayArm.scale', scaleTimes, scaleVals);

    const clip = new THREE.AnimationClip('Wash', 2, [track, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
