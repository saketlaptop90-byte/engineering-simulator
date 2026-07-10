import { steelMaterial, ironMaterial } from '../utils/materials.js';

export function createRackAndPinion(THREE) {
    const group = new THREE.Group();
    group.name = "RackAndPinion";

    // Rack
    const rackGeometry = new THREE.BoxGeometry(8, 0.6, 0.6);
    const rack = new THREE.Mesh(rackGeometry, ironMaterial || new THREE.MeshStandardMaterial({color: 0x555555}));
    rack.name = "Rack";
    group.add(rack);

    // Pinion
    const pinionGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 24);
    const pinionWrapper = new THREE.Group();
    pinionWrapper.name = "PinionWrapper";
    pinionWrapper.position.set(0, 1.3, 0);
    
    const pinion = new THREE.Mesh(pinionGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    pinion.rotation.x = Math.PI / 2;
    pinionWrapper.add(pinion);
    
    group.add(pinionWrapper);

    // Tie rods (visual effect)
    const tieRodGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const tieRodL = new THREE.Mesh(tieRodGeo, steelMaterial || new THREE.MeshStandardMaterial({color: 0x888888}));
    tieRodL.rotation.z = Math.PI / 2;
    tieRodL.position.set(-5, 0, 0);
    tieRodL.name = "TieRodL";
    rack.add(tieRodL);

    const tieRodR = new THREE.Mesh(tieRodGeo, steelMaterial || new THREE.MeshStandardMaterial({color: 0x888888}));
    tieRodR.rotation.z = Math.PI / 2;
    tieRodR.position.set(5, 0, 0);
    tieRodR.name = "TieRodR";
    rack.add(tieRodR);

    // Animations: Rack slides left and right, Pinion rotates
    const rackTrack = new THREE.VectorKeyframeTrack('Rack.position', [0, 1, 2, 3, 4], [
        0, 0, 0,
        -2, 0, 0,
        0, 0, 0,
        2, 0, 0,
        0, 0, 0
    ]);

    const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const qLeft = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const qRight = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI);
    
    const pinionTrack = new THREE.QuaternionKeyframeTrack('PinionWrapper.quaternion', [0, 1, 2, 3, 4], [
        qStart.x, qStart.y, qStart.z, qStart.w,
        qLeft.x, qLeft.y, qLeft.z, qLeft.w,
        qStart.x, qStart.y, qStart.z, qStart.w,
        qRight.x, qRight.y, qRight.z, qRight.w,
        qStart.x, qStart.y, qStart.z, qStart.w
    ]);

    const clip = new THREE.AnimationClip("Steer", 4, [rackTrack, pinionTrack]);
    return { group, animationClips: [clip] };
}
