import {
    yellowPaintMaterial,
    metalMaterial,
    blackRubberMaterial
} from '../utils/materials.js';

export function createWoodChipper(THREE) {
    const group = new THREE.Group();
    group.name = 'WoodChipper';
    const animationClips = [];

    // Trailer Chassis
    const chassisGeo = new THREE.BoxGeometry(3, 0.5, 6);
    const chassis = new THREE.Mesh(chassisGeo, metalMaterial);
    chassis.position.y = 1;
    group.add(chassis);

    // Wheels (2 wheels on the trailer)
    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32);
    const wheelL = new THREE.Mesh(wheelGeo, blackRubberMaterial);
    wheelL.rotation.z = Math.PI / 2;
    wheelL.position.set(1.8, 0.8, -1);
    wheelL.name = 'wheelL';
    const wheelR = new THREE.Mesh(wheelGeo, blackRubberMaterial);
    wheelR.rotation.z = Math.PI / 2;
    wheelR.position.set(-1.8, 0.8, -1);
    wheelR.name = 'wheelR';
    group.add(wheelL, wheelR);

    // Chipper Engine/Body
    const bodyGeo = new THREE.BoxGeometry(2.8, 2, 3);
    const body = new THREE.Mesh(bodyGeo, yellowPaintMaterial);
    body.position.set(0, 2.25, -1);
    group.add(body);

    // Infeed Chute
    const chuteGeo = new THREE.CylinderGeometry(1.5, 1, 2, 4);
    const chute = new THREE.Mesh(chuteGeo, yellowPaintMaterial);
    chute.rotation.x = Math.PI / 2;
    chute.rotation.y = Math.PI / 4;
    chute.position.set(0, 2, 1.5);
    group.add(chute);

    // Discharge Chute
    const dischargeGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const discharge = new THREE.Mesh(dischargeGeo, yellowPaintMaterial);
    discharge.position.set(0, 4, -2);
    discharge.rotation.x = -Math.PI / 6;
    group.add(discharge);

    // Feed Rollers (Inside the chute)
    const rollerGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16);
    const rollerTop = new THREE.Mesh(rollerGeo, metalMaterial);
    rollerTop.name = 'rollerTop';
    rollerTop.rotation.z = Math.PI / 2;
    rollerTop.position.set(0, 2.5, 0.8);
    const rollerBot = new THREE.Mesh(rollerGeo, metalMaterial);
    rollerBot.name = 'rollerBot';
    rollerBot.rotation.z = Math.PI / 2;
    rollerBot.position.set(0, 1.5, 0.8);
    group.add(rollerTop, rollerBot);

    // Spinning Chipper Drum (Inside Body)
    const drumGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.6, 16);
    const drum = new THREE.Mesh(drumGeo, metalMaterial);
    drum.name = 'chipperDrum';
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0, 2.25, -0.5);
    group.add(drum);

    // Animations
    const times = [0, 0.5, 1];
    const tracks = [];
    
    // Drum and Rollers rotation (fast spinning)
    const drumQuats = [];
    const rollerQuats = [];
    const qDrum = new THREE.Quaternion();
    const qRoller = new THREE.Quaternion();
    
    [0, Math.PI * 2, Math.PI * 4].forEach(angle => {
        qDrum.setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
        qDrum.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle));
        drumQuats.push(qDrum.x, qDrum.y, qDrum.z, qDrum.w);

        qRoller.setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
        qRoller.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle * 0.5));
        rollerQuats.push(qRoller.x, qRoller.y, qRoller.z, qRoller.w);
    });

    tracks.push(new THREE.QuaternionKeyframeTrack('chipperDrum.quaternion', times, drumQuats));
    tracks.push(new THREE.QuaternionKeyframeTrack('rollerTop.quaternion', times, rollerQuats));
    tracks.push(new THREE.QuaternionKeyframeTrack('rollerBot.quaternion', times, rollerQuats));

    // Machine Vibration
    const vibTimes = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const vibVals = [];
    for (let i=0; i<vibTimes.length; i++) {
        vibVals.push(0, (i%2 === 0 ? 0.05 : -0.05), 0);
    }
    tracks.push(new THREE.VectorKeyframeTrack('WoodChipper.position', vibTimes, vibVals));

    const clip = new THREE.AnimationClip('ChipperAction', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
