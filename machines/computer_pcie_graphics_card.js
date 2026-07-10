import { metalMaterial, plasticMaterial, ledMaterial, copperMaterial } from '../utils/materials.js';

export function createPCIeGraphicsCardCooler(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main PCB
    const pcbGeo = new THREE.BoxGeometry(20, 10, 0.5);
    const pcb = new THREE.Mesh(pcbGeo, plasticMaterial);
    group.add(pcb);

    // Heatsink
    const heatsinkGeo = new THREE.BoxGeometry(18, 9, 3);
    const heatsink = new THREE.Mesh(heatsinkGeo, metalMaterial);
    heatsink.position.set(0, 0, 1.75);
    group.add(heatsink);

    // Cooling Fans
    const fanGeo = new THREE.CylinderGeometry(4, 4, 1, 16);
    
    const fan1 = new THREE.Mesh(fanGeo, plasticMaterial);
    fan1.position.set(-5, 0, 3.5);
    fan1.rotation.x = Math.PI / 2;
    fan1.name = 'fan1';
    group.add(fan1);

    const fan2 = new THREE.Mesh(fanGeo, plasticMaterial);
    fan2.position.set(5, 0, 3.5);
    fan2.rotation.x = Math.PI / 2;
    fan2.name = 'fan2';
    group.add(fan2);

    // PCIe Connector Contact Array
    const pcieGeo = new THREE.BoxGeometry(10, 1, 0.5);
    const pcie = new THREE.Mesh(pcieGeo, copperMaterial);
    pcie.position.set(-3, -5.5, 0);
    group.add(pcie);

    // Fan Spinning Animation
    const t = [0, 0.25, 0.5, 0.75, 1];
    
    // Create quaternions for a full 360 rotation around local Y-axis
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const qVals = [
        ...q0.toArray(),
        ...q1.toArray(),
        ...q2.toArray(),
        ...q3.toArray(),
        ...q4.toArray()
    ];

    const track1 = new THREE.QuaternionKeyframeTrack('fan1.quaternion', t, qVals);
    const track2 = new THREE.QuaternionKeyframeTrack('fan2.quaternion', t, qVals);

    const clip = new THREE.AnimationClip('Fans_Spin', 1, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
