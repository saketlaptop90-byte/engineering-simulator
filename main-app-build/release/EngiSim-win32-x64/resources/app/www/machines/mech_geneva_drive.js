import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createGenevaDrive(THREE) {
    const group = new THREE.Group();
    
    const driveGroup = new THREE.Group();
    driveGroup.name = "DriveWheel";
    const driveBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), darkSteel);
    driveBase.rotation.x = Math.PI / 2;
    const drivePin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1, 16), brass);
    drivePin.position.set(1.5, 0.5, 0);
    drivePin.rotation.x = Math.PI / 2;
    driveGroup.add(driveBase, drivePin);
    driveGroup.position.set(-2.5, 0, 0);
    group.add(driveGroup);

    const drivenGroup = new THREE.Group();
    drivenGroup.name = "DrivenWheel";
    
    // Create the Maltese Cross base
    const drivenBase = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.4, 6), aluminum);
    drivenBase.rotation.x = Math.PI / 2;
    drivenGroup.add(drivenBase);
    
    // Add visual slots
    const slotGeom = new THREE.BoxGeometry(0.8, 3, 0.5);
    for (let i = 0; i < 4; i++) {
        const slot = new THREE.Mesh(slotGeom, darkSteel);
        slot.position.set(Math.cos(i*Math.PI/2)*1.5, Math.sin(i*Math.PI/2)*1.5, 0);
        slot.rotation.z = i*Math.PI/2;
        drivenGroup.add(slot);
    }

    drivenGroup.position.set(2.5, 0, 0);
    group.add(drivenGroup);

    const times = [];
    const driveValues = [];
    const drivenValues = [];
    
    const duration = 4;
    const steps = 60;
    
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);
        
        const driveAngle = (t / duration) * Math.PI * 2;
        const qDrive = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), driveAngle);
        driveValues.push(qDrive.x, qDrive.y, qDrive.z, qDrive.w);
        
        let drivenAngle = 0;
        const normalizedT = (t % (duration / 4)) / (duration / 4);
        const currentQuarter = Math.floor(t / (duration / 4));
        if (normalizedT > 0.8) {
            const stepProgress = (normalizedT - 0.8) / 0.2;
            drivenAngle = -(currentQuarter * Math.PI / 2 + stepProgress * Math.PI / 2);
        } else {
            drivenAngle = -(currentQuarter * Math.PI / 2);
        }
        
        const qDriven = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), drivenAngle);
        drivenValues.push(qDriven.x, qDriven.y, qDriven.z, qDriven.w);
    }
    
    const driveTrack = new THREE.QuaternionKeyframeTrack('DriveWheel.quaternion', times, driveValues);
    const drivenTrack = new THREE.QuaternionKeyframeTrack('DrivenWheel.quaternion', times, drivenValues);
    
    const clip = new THREE.AnimationClip('GenevaOperation', duration, [driveTrack, drivenTrack]);

    return { group, animationClips: [clip] };
}
