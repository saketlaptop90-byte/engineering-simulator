import { 
  metalMaterial, 
  darkMetalMaterial, 
  copperMaterial, 
  insulatorMaterial, 
  casingMaterial, 
  highlightMaterial 
} from '../utils/materials.js';

export function createWindTurbineNacelle(THREE) {
    const group = new THREE.Group();
    group.name = "WindTurbineNacelle";

    const animationClips = [];

    // Tower Top
    const towerGeom = new THREE.CylinderGeometry(0.8, 1, 3, 32);
    const tower = new THREE.Mesh(towerGeom, casingMaterial);
    tower.position.y = 1.5;
    group.add(tower);

    // Nacelle Body
    const nacelleGeom = new THREE.BoxGeometry(2, 2, 5);
    const nacelle = new THREE.Mesh(nacelleGeom, casingMaterial);
    nacelle.position.set(0, 4, 0);
    group.add(nacelle);

    // Rotor Hub
    const hubGroup = new THREE.Group();
    hubGroup.name = "TurbineHub";
    hubGroup.position.set(0, 4, 2.8);
    group.add(hubGroup);

    const hubGeom = new THREE.SphereGeometry(1, 16, 16);
    const hub = new THREE.Mesh(hubGeom, casingMaterial);
    hub.scale.set(1, 1, 1.2);
    hubGroup.add(hub);

    // Blades
    const bladeGeom = new THREE.BoxGeometry(0.2, 8, 0.5);
    bladeGeom.translate(0, 4, 0); // pivot at base
    
    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(bladeGeom, casingMaterial);
        const angle = i * (Math.PI * 2 / 3);
        blade.rotation.z = angle;
        hubGroup.add(blade);
    }

    // Animation: Slow blade rotation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 2);
    
    const trackName = `${hubGroup.name}.quaternion`;
    const times = [0, 2, 4];
    const values = [...q1.toArray(), ...q2.toArray(), ...q3.toArray()];
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('RotateBlades', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
