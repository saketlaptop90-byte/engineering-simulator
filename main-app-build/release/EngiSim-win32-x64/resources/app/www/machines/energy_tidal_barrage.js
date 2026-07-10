import { whitePlastic, steel, aluminum, concrete } from '../utils/materials.js';

export function createTidalBarrageTurbine(THREE) {
    const group = new THREE.Group();

    // Main housing / barrage structure
    const housingGeo = new THREE.BoxGeometry(5, 5, 3);
    const housing = new THREE.Mesh(housingGeo, concrete);
    housing.position.y = 2.5;
    group.add(housing);

    // Tunnel through housing
    const tunnelGeo = new THREE.CylinderGeometry(1.8, 1.8, 3.1, 32);
    const tunnel = new THREE.Mesh(tunnelGeo, steel);
    tunnel.rotation.x = Math.PI / 2;
    tunnel.position.y = 2.5;
    group.add(tunnel);

    // Turbine rotor inside tunnel
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 2.5, 0);
    rotorGroup.name = 'TidalRotor';
    group.add(rotorGroup);

    // Hub
    const hubGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    rotorGroup.add(hub);

    // Blades
    const bladeGeo = new THREE.BoxGeometry(0.1, 2.8, 0.3);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeo, whitePlastic);
        blade.position.y = 1.4;
        blade.rotation.y = Math.PI / 4; // Pitch of the blade
        
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * 2 * Math.PI) / 4;
        pivot.add(blade);
        rotorGroup.add(pivot);
    }

    // Animation: Water flowing spins it
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 2 * Math.PI);
    
    const times = [0, 1.5, 3];
    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('TidalRotor.quaternion', times, values);
    const clip = new THREE.AnimationClip('SpinRotor', 3, [track]);

    return { group, animationClips: [clip] };
}
