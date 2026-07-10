import { materials } from '../utils/materials.js';

export function createJawCrusher(THREE) {
    const group = new THREE.Group();
    group.name = "JawCrusherGroup";

    const getMat = (name, color) => (materials && materials[name]) || new THREE.MeshStandardMaterial({color});
    const frameColor = getMat('paintBlue', 0x224488);
    const wearPart = getMat('castIron', 0x333333);
    const steel = getMat('steel', 0xaaaaaa);

    // Housing frame
    const frameGeo = new THREE.BoxGeometry(8, 10, 8);
    const frame = new THREE.Mesh(frameGeo, frameColor);
    group.add(frame);

    // Hopper
    const hopperGeo = new THREE.CylinderGeometry(6, 4, 3, 4, 1, false, Math.PI/4);
    const hopper = new THREE.Mesh(hopperGeo, frameColor);
    hopper.position.set(0, 6.5, 0);
    hopper.rotation.y = Math.PI/4;
    group.add(hopper);

    // Fixed Jaw
    const fixedJawGeo = new THREE.BoxGeometry(1, 7, 6);
    const fixedJaw = new THREE.Mesh(fixedJawGeo, wearPart);
    fixedJaw.position.set(-2, 0, 0);
    fixedJaw.rotation.z = 0.15;
    group.add(fixedJaw);

    // Moving Jaw Group
    const movingJawGroup = new THREE.Group();
    movingJawGroup.position.set(2, 3, 0); // pivot at top
    movingJawGroup.name = "MovingJaw";
    group.add(movingJawGroup);

    const movingJawGeo = new THREE.BoxGeometry(1, 7, 6);
    const movingJaw = new THREE.Mesh(movingJawGeo, wearPart);
    movingJaw.position.set(0, -3.5, 0);
    movingJawGroup.add(movingJaw);
    
    // Flywheel
    const flywheelGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, steel);
    flywheel.rotation.x = Math.PI/2;
    flywheel.position.set(3, 0, 4.5);
    flywheel.name = "Flywheel";
    group.add(flywheel);

    // Animations
    const times = [0, 0.25, 0.5, 0.75, 1.0];
    const zAxis = new THREE.Vector3(0, 0, 1);
    const values = [];
    
    // Jaw crush motion
    const jawAngles = [-0.15, -0.22, -0.15, -0.08, -0.15];
    for(let a of jawAngles) {
        values.push(...new THREE.Quaternion().setFromAxisAngle(zAxis, a).toArray());
    }
    const jawTrack = new THREE.QuaternionKeyframeTrack('MovingJaw.quaternion', times, values);
    
    // Flywheel spin
    const fwValues = [];
    for(let i=0; i<5; i++) {
        fwValues.push(...new THREE.Quaternion().setFromAxisAngle(zAxis, (i/4)*Math.PI*2).toArray());
    }
    const fwTrack = new THREE.QuaternionKeyframeTrack('Flywheel.quaternion', times, fwValues);
    
    const clip = new THREE.AnimationClip('CrushOperation', 1.0, [jawTrack, fwTrack]);

    return { group, animationClips: [clip] };
}
