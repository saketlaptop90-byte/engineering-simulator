import * as materials from '../utils/materials.js';

export function createCO2CompressionCentrifuge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Housing
    const housingGeom = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const housing = new THREE.Mesh(housingGeom, materials.metal || new THREE.MeshStandardMaterial({color: 0x888888, side: THREE.DoubleSide}));
    group.add(housing);

    const baseGeom = new THREE.CylinderGeometry(3.2, 3.5, 1, 32);
    const base = new THREE.Mesh(baseGeom, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x222222}));
    base.position.y = -0.5;
    group.add(base);

    // Inner Centrifuge Rotor
    const rotorGeom = new THREE.CylinderGeometry(2, 2, 4, 16);
    const rotor = new THREE.Mesh(rotorGeom, materials.shinyMetal || new THREE.MeshStandardMaterial({color: 0xdddddd}));
    rotor.position.y = 2;
    rotor.name = 'centrifuge_rotor';
    group.add(rotor);

    // Rotor blades
    for(let i = 0; i < 6; i++) {
        const bladeGeom = new THREE.BoxGeometry(4.2, 3.8, 0.2);
        const blade = new THREE.Mesh(bladeGeom, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333}));
        blade.rotation.y = (Math.PI / 3) * i;
        rotor.add(blade);
    }

    // Animation
    const tracks = [];
    
    // Fast spinning animation
    const times = [0, 0.25, 0.5];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    
    const rotorTrack = new THREE.QuaternionKeyframeTrack(`${rotor.name}.quaternion`, times, values);
    tracks.push(rotorTrack);

    const clip = new THREE.AnimationClip('Spin', 0.5, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
