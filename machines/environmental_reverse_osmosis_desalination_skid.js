import * as sharedMaterials from '../utils/materials.js';

export function createReverseOsmosisDesalinationSkid(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const steel = sharedMaterials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const bluePipe = sharedMaterials.plasticMaterial || new THREE.MeshStandardMaterial({ color: 0x1133aa, roughness: 0.3 });
    const whitePlastic = sharedMaterials.whitePlastic || new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.2 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 2.5), steel);
    base.position.y = 0.1;
    group.add(base);

    const vessels = new THREE.Group();
    for(let i=0; i<4; i++) {
        for(let j=0; j<3; j++) {
            const vessel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.5, 16), whitePlastic);
            vessel.rotation.z = Math.PI / 2;
            vessel.position.set(0.5, 0.5 + i*0.3, -0.8 + j*0.8);
            vessels.add(vessel);
        }
    }
    group.add(vessels);

    const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16), steel);
    pump.rotation.z = Math.PI / 2;
    pump.position.set(-1.8, 0.6, 0);
    group.add(pump);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), steel);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(-1.8, 0.6, 0);
    shaft.name = 'RO_PumpShaft';
    group.add(shaft);

    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, Math.PI/2));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*2, 0, Math.PI/2));
    
    const rotTrack = new THREE.QuaternionKeyframeTrack('RO_PumpShaft.quaternion', [0, 0.5, 1.0], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    animationClips.push(new THREE.AnimationClip('RO_Pump_Animation', 1.0, [rotTrack]));

    return { group, animationClips };
}
