import * as sharedMaterials from '../utils/materials.js';

export function createCentrifugalFilterUnit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyMat = sharedMaterials.plasticMaterial || new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const darkMat = sharedMaterials.darkMetalMaterial || new THREE.MeshStandardMaterial({ color: 0x444444 });
    const glassMat = sharedMaterials.glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.8, transparent: true });

    // Base
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.5, 1.5, 32);
    const base = new THREE.Mesh(baseGeo, bodyMat);
    base.position.set(0, 0.75, 0);
    group.add(base);

    // Rotor
    const rotorGroup = new THREE.Group();
    rotorGroup.name = "CentrifugeRotor";
    rotorGroup.position.set(0, 1.3, 0);

    const rotorGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.4, 16);
    const rotor = new THREE.Mesh(rotorGeo, darkMat);
    rotorGroup.add(rotor);
    
    // Add vials to rotor
    for(let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const vialGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
        const vial = new THREE.Mesh(vialGeo, glassMat);
        vial.position.set(Math.cos(angle) * 0.6, 0.1, Math.sin(angle) * 0.6);
        vial.rotation.x = 0.2; // slight tilt
        rotorGroup.add(vial);
    }
    group.add(rotorGroup);

    // Lid
    const lidGroup = new THREE.Group();
    lidGroup.name = "CentrifugeLid";
    lidGroup.position.set(0, 1.5, -1.2); // hinge
    
    const lidGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const lid = new THREE.Mesh(lidGeo, glassMat);
    lid.position.set(0, 0, 1.2);
    lidGroup.add(lid);
    group.add(lidGroup);

    // Animations
    const times = [0, 1, 2, 4, 5, 6];
    
    // Lid open/close
    const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 3);
    const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const lidValues = [
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qOpen.x, qOpen.y, qOpen.z, qOpen.w
    ];
    const lidTrack = new THREE.QuaternionKeyframeTrack('CentrifugeLid.quaternion', times, lidValues);

    // Rotor spin
    const rTimes = [];
    const rValues = [];
    let angle = 0;
    for (let t = 0; t <= 6; t += 0.1) {
        rTimes.push(t);
        if (t > 1.5 && t < 4.5) {
            angle += Math.PI / 2; // spin fast
        }
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        rValues.push(q.x, q.y, q.z, q.w);
    }
    const rotorTrack = new THREE.QuaternionKeyframeTrack('CentrifugeRotor.quaternion', rTimes, rValues);

    const clip = new THREE.AnimationClip('CentrifugeSpin', 6, [lidTrack, rotorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
