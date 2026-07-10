import { 
  metalMaterial, 
  darkMetalMaterial, 
  copperMaterial, 
  insulatorMaterial, 
  casingMaterial, 
  highlightMaterial 
} from '../utils/materials.js';

export function createSteamTurbineGenerator(THREE) {
    const group = new THREE.Group();
    group.name = "SteamTurbineGenerator";

    const animationClips = [];

    // Base
    const baseGeom = new THREE.BoxGeometry(10, 0.5, 3);
    const base = new THREE.Mesh(baseGeom, darkMetalMaterial);
    base.position.y = 0.25;
    group.add(base);

    // Stator/Casing
    const casingGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const casing = new THREE.Mesh(casingGeom, casingMaterial);
    casing.rotation.z = Math.PI / 2;
    casing.position.set(-2, 2, 0);
    group.add(casing);

    // Generator Casing
    const genCasingGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const genCasing = new THREE.Mesh(genCasingGeom, casingMaterial);
    genCasing.rotation.z = Math.PI / 2;
    genCasing.position.set(2.5, 2, 0);
    group.add(genCasing);

    // Rotor Assembly
    const rotorGroup = new THREE.Group();
    rotorGroup.name = "TurbineRotor";
    rotorGroup.position.set(0, 2, 0);
    group.add(rotorGroup);

    // Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 9, 16);
    const shaft = new THREE.Mesh(shaftGeom, metalMaterial);
    shaft.rotation.z = Math.PI / 2;
    rotorGroup.add(shaft);

    // Turbine Blades (Exposed part)
    const bladeGeom = new THREE.BoxGeometry(0.1, 2.5, 0.4);
    for (let stage = 0; stage < 4; stage++) {
        for (let i = 0; i < 12; i++) {
            const blade = new THREE.Mesh(bladeGeom, metalMaterial);
            const angle = (i / 12) * Math.PI * 2;
            blade.position.set(-3.5 + stage * 0.8, Math.sin(angle) * 0.7, Math.cos(angle) * 0.7);
            blade.rotation.x = angle;
            rotorGroup.add(blade);
        }
    }

    // Animation: High speed rotation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 2);
    
    const trackName = `${rotorGroup.name}.quaternion`;
    const times = [0, 0.5, 1];
    const values = [...q1.toArray(), ...q2.toArray(), ...q3.toArray()];
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Spin', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
