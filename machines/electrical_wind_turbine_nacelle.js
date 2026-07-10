import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createWindTurbineGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Nacelle Housing
    const nacelleGeom = new THREE.BoxGeometry(4, 3, 8);
    const nacelle = new THREE.Mesh(nacelleGeom, porcelain); // Using porcelain for white casing look
    nacelle.position.y = 1.5;
    nacelle.position.z = -2;
    group.add(nacelle);

    // Generator internally visible (partially sticking out or just modeled)
    const generatorGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const generator = new THREE.Mesh(generatorGeom, darkSteel);
    generator.rotation.x = Math.PI / 2;
    generator.position.set(0, 1.5, -3);
    group.add(generator);

    // Rotor shaft
    const shaftGroup = new THREE.Group();
    shaftGroup.name = 'shaftGroup';
    shaftGroup.position.set(0, 1.5, 2);
    group.add(shaftGroup);
    
    const shaftGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const shaft = new THREE.Mesh(shaftGeom, darkSteel);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.set(0, 0, -1);
    shaftGroup.add(shaft);
    
    // Hub
    const hubGeom = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const hub = new THREE.Mesh(hubGeom, darkSteel);
    hub.rotation.x = -Math.PI / 2;
    hub.position.z = 1;
    shaftGroup.add(hub);

    // Blades
    const bladeGeom = new THREE.BoxGeometry(0.2, 8, 0.5);
    const b1 = new THREE.Mesh(bladeGeom, porcelain);
    b1.position.y = 4;
    
    const bladePivot1 = new THREE.Group();
    bladePivot1.position.set(0, 0, 1);
    bladePivot1.add(b1);
    
    const bladePivot2 = new THREE.Group();
    bladePivot2.position.set(0, 0, 1);
    bladePivot2.rotation.z = Math.PI * 2 / 3;
    bladePivot2.add(b1.clone());
    
    const bladePivot3 = new THREE.Group();
    bladePivot3.position.set(0, 0, 1);
    bladePivot3.rotation.z = -Math.PI * 2 / 3;
    bladePivot3.add(b1.clone());

    shaftGroup.add(bladePivot1);
    shaftGroup.add(bladePivot2);
    shaftGroup.add(bladePivot3);

    // Animation (Wind turbine spinning)
    const times = [0, 2];
    const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI * 2));
    
    const track = new THREE.QuaternionKeyframeTrack('shaftGroup.quaternion', times, [...qStart.toArray(), ...qEnd.toArray()]);
    const clip = new THREE.AnimationClip('TurbineSpin', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
