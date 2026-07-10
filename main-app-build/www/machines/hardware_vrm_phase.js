import * as materials from '../utils/materials.js';

export function createVRMPhase(THREE) {
    const group = new THREE.Group();
    const clips = [];

    // PCB base
    const pcbGeo = new THREE.BoxGeometry(4, 0.2, 6);
    const pcb = new THREE.Mesh(pcbGeo, materials.greenPCB);
    group.add(pcb);

    // Choke (Inductor)
    const chokeBaseGeo = new THREE.BoxGeometry(2, 2, 2);
    const chokeBase = new THREE.Mesh(chokeBaseGeo, materials.darkSteel);
    chokeBase.position.set(0, 1.1, 0);
    group.add(chokeBase);

    // Expose coil slightly on top
    const coilGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
    const coilMat = materials.wireCoil.clone();
    coilMat.emissive = new THREE.Color(0xff4400);
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.rotation.x = Math.PI / 2;
    coil.position.set(0, 2.1, 0);
    coil.name = "VRMCoil";
    group.add(coil);

    // MOSFETs
    const mosfetGeo = new THREE.BoxGeometry(1, 0.2, 1.2);
    const mosfet1 = new THREE.Mesh(mosfetGeo, materials.blackPlastic);
    mosfet1.position.set(-1, 0.2, 2);
    const mosfet2 = new THREE.Mesh(mosfetGeo, materials.blackPlastic);
    mosfet2.position.set(1, 0.2, 2);
    group.add(mosfet1, mosfet2);

    // Capacitors (Solid state)
    const capGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    const cap1 = new THREE.Mesh(capGeo, materials.aluminum);
    cap1.position.set(-1, 0.7, -2);
    const cap2 = new THREE.Mesh(capGeo, materials.aluminum);
    cap2.position.set(1, 0.7, -2);
    group.add(cap1, cap2);

    // Heat pulse animation
    const times = [0, 0.5, 1];
    const values = [0, 0.8, 0];
    const pulseTrack = new THREE.NumberKeyframeTrack('VRMCoil.material.emissiveIntensity', times, values);
    clips.push(new THREE.AnimationClip('PowerPhase', 1, [pulseTrack]));

    return { group, animationClips: clips };
}
