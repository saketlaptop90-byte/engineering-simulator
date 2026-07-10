import { materials } from '../utils/materials.js';

export function createPrimaryCoolantPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const casingMaterial = materials.heavySteel || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.5 });
    const impellerMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });

    // Motor housing
    const motorGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const motor = new THREE.Mesh(motorGeom, casingMaterial);
    motor.position.y = 3;
    group.add(motor);

    // Pump casing (volute)
    const voluteGeom = new THREE.TorusGeometry(1.2, 0.6, 16, 32);
    const volute = new THREE.Mesh(voluteGeom, casingMaterial);
    volute.rotation.x = Math.PI / 2;
    group.add(volute);

    // Inlet / Outlet
    const pipeGeom = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    const inlet = new THREE.Mesh(pipeGeom, casingMaterial);
    inlet.position.set(0, -1, 0);
    group.add(inlet);

    const outlet = new THREE.Mesh(pipeGeom, casingMaterial);
    outlet.rotation.z = Math.PI / 2;
    outlet.position.set(2, 0, 0);
    group.add(outlet);

    // Impeller (spinning part)
    const impeller = new THREE.Group();
    impeller.name = "impeller";
    
    const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const shaft = new THREE.Mesh(shaftGeom, impellerMaterial);
    impeller.add(shaft);

    for(let i=0; i<5; i++) {
        const bladeGeom = new THREE.BoxGeometry(2, 0.1, 0.5);
        const blade = new THREE.Mesh(bladeGeom, impellerMaterial);
        blade.rotation.y = (i / 5) * Math.PI * 2;
        blade.position.y = -0.5;
        impeller.add(blade);
    }
    
    group.add(impeller);

    // Animation: Spinning impeller
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const rotTimes = [0, 0.5, 1];
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    
    const rotTrack = new THREE.QuaternionKeyframeTrack('impeller.quaternion', rotTimes, values);
    const clip = new THREE.AnimationClip('PumpSpin', 1, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
