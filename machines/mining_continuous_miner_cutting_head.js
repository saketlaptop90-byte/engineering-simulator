import { materials } from '../utils/materials.js';

export function createContinuousMinerCuttingHead(THREE) {
    const group = new THREE.Group();
    group.name = "ContinuousMinerGroup";

    const getMat = (name, color) => (materials && materials[name]) || new THREE.MeshStandardMaterial({color});
    const bodyMat = getMat('paintOrange', 0xff7700);
    const headMat = getMat('castIron', 0x222222);
    const pickMat = getMat('tungstenCarbide', 0x8899aa);

    // Boom arm
    const boomGeo = new THREE.BoxGeometry(6, 4, 10);
    const boom = new THREE.Mesh(boomGeo, bodyMat);
    boom.position.set(0, 0, -5);
    group.add(boom);

    // Cutting Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0, 1);
    headGroup.name = "CuttingHead";
    group.add(headGroup);

    // Cylinder Drum
    const drumGeo = new THREE.CylinderGeometry(2.5, 2.5, 12, 32);
    const drum = new THREE.Mesh(drumGeo, headMat);
    drum.rotation.z = Math.PI / 2;
    headGroup.add(drum);

    // Add Cutting Picks
    const pickGeo = new THREE.ConeGeometry(0.15, 0.8, 8);
    pickGeo.translate(0, 0.4, 0);

    const totalPicks = 60;
    for (let i = 0; i < totalPicks; i++) {
        const pick = new THREE.Mesh(pickGeo, pickMat);
        
        const xPos = -5.8 + (i * 11.6 / totalPicks);
        const angle = i * Math.PI * 0.4; // create a spiral pattern
        
        pick.position.set(xPos, Math.cos(angle) * 2.5, Math.sin(angle) * 2.5);
        
        // Orient picks outward radially
        const normal = new THREE.Vector3(0, Math.cos(angle), Math.sin(angle)).normalize();
        const lookTarget = pick.position.clone().add(normal);
        pick.lookAt(lookTarget);
        pick.rotateX(Math.PI / 2);
        
        headGroup.add(pick);
    }

    // Motor housings on ends
    const motorGeo = new THREE.CylinderGeometry(2, 2, 2, 16);
    const motor1 = new THREE.Mesh(motorGeo, bodyMat);
    motor1.rotation.z = Math.PI / 2;
    motor1.position.set(-6.5, 0, 0);
    headGroup.add(motor1);

    const motor2 = new THREE.Mesh(motorGeo, bodyMat);
    motor2.rotation.z = Math.PI / 2;
    motor2.position.set(6.5, 0, 0);
    headGroup.add(motor2);

    // Animation
    const times = [0, 0.5, 1.0];
    const xAxis = new THREE.Vector3(1, 0, 0);
    const values = [
        ...new THREE.Quaternion().setFromAxisAngle(xAxis, 0).toArray(),
        ...new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI).toArray(),
        ...new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2).toArray()
    ];
    const track = new THREE.QuaternionKeyframeTrack('CuttingHead.quaternion', times, values);
    const clip = new THREE.AnimationClip('CutCoal', 1.0, [track]);

    return { group, animationClips: [clip] };
}
