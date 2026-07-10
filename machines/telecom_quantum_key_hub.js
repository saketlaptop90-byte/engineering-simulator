import * as Materials from '../utils/materials.js';

export function createQuantumKeyHub(THREE) {
    const group = new THREE.Group();
    group.name = "Quantum_Key_Hub";

    // Server Rack Base
    const rackGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const rack = new THREE.Mesh(rackGeo, Materials.darkSteel);
    rack.position.y = 0.25;
    group.add(rack);

    // Protective Dome
    const domeGeo = new THREE.CylinderGeometry(0.9, 1, 2, 32);
    const domeMat = Materials.glass.clone();
    domeMat.opacity = 0.2;
    domeMat.color.setHex(0xaaaaee);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 1.5;
    group.add(dome);

    // Cryogenic Core
    const coreGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0044ff, emissive: 0x0022cc, emissiveIntensity: 1, transparent: true, opacity: 0.8 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 1.5;
    core.name = "CryoCore";
    group.add(core);

    // Optics & Splitters
    const opticsGroup = new THREE.Group();
    opticsGroup.position.y = 1.5;
    opticsGroup.name = "OpticsGroup";
    group.add(opticsGroup);

    const splitterGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const splitterMat = Materials.chrome;

    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const splitter = new THREE.Mesh(splitterGeo, splitterMat);
        splitter.position.set(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6);
        splitter.rotation.y = -angle + Math.PI / 4;
        opticsGroup.add(splitter);
    }

    // Photon Streams
    const photonGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const photonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3 });
    const photonGroup = new THREE.Group();
    photonGroup.position.y = 1.5;
    group.add(photonGroup);

    const tracks = [];
    const duration = 2;

    for (let i = 0; i < 4; i++) {
        const photon = new THREE.Mesh(photonGeo, photonMat);
        photon.name = `photon_${i}`;
        photonGroup.add(photon);

        const angle = (i / 4) * Math.PI * 2;
        const startX = Math.cos(angle) * 0.1;
        const startZ = Math.sin(angle) * 0.1;
        const endX = Math.cos(angle) * 0.8;
        const endZ = Math.sin(angle) * 0.8;

        const times = [0, 0.5, 1, 1.5, 2];
        const positions = [
            startX, 0, startZ,
            endX, 0, endZ,
            startX, 0, startZ,
            endX, 0, endZ,
            startX, 0, startZ
        ];
        
        tracks.push(new THREE.VectorKeyframeTrack(`${photon.name}.position`, times, positions));
    }

    // Core pulsing animation
    const cTimes = [0, 1, 2];
    const cVals = [1, 3, 1];
    tracks.push(new THREE.NumberKeyframeTrack("CryoCore.material.emissiveIntensity", cTimes, cVals));

    // Rotating Optics Array
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);
    const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    tracks.push(new THREE.QuaternionKeyframeTrack("OpticsGroup.quaternion", [0, 0.5, 1.0, 1.5, 2.0], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q5.x, q5.y, q5.z, q5.w
    ]));

    const clip = new THREE.AnimationClip("QuantumOperations", duration, tracks);

    return { group, animationClips: [clip] };
}
