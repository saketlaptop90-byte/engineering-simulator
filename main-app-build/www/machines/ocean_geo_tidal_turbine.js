import { steel, copper, darkSteel, glass } from '../utils/materials.js';

export function createTidalTurbine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeom = new THREE.CylinderGeometry(2, 2, 1, 32);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    base.position.y = 0.5;
    group.add(base);

    // Tower
    const towerGeom = new THREE.CylinderGeometry(0.5, 0.8, 10, 16);
    const tower = new THREE.Mesh(towerGeom, steel);
    tower.position.y = 6;
    group.add(tower);

    // Nacelle
    const nacelleGeom = new THREE.CapsuleGeometry(1, 3, 4, 16);
    const nacelle = new THREE.Mesh(nacelleGeom, steel);
    nacelle.rotation.z = Math.PI / 2;
    nacelle.position.y = 11;
    group.add(nacelle);

    // Rotor Hub
    const hubGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const hub = new THREE.Mesh(hubGeom, darkSteel);
    hub.position.set(2, 11, 0);
    hub.name = "hub";
    group.add(hub);

    // Blades
    const bladeGeom = new THREE.BoxGeometry(0.2, 5, 0.5);
    
    const pivot1 = new THREE.Group();
    const blade1 = new THREE.Mesh(bladeGeom, steel);
    blade1.position.set(0, 2.5, 0);
    pivot1.add(blade1);

    const pivot2 = new THREE.Group();
    pivot2.rotation.x = (2 * Math.PI) / 3;
    const blade2 = new THREE.Mesh(bladeGeom, steel);
    blade2.position.set(0, 2.5, 0);
    pivot2.add(blade2);

    const pivot3 = new THREE.Group();
    pivot3.rotation.x = (4 * Math.PI) / 3;
    const blade3 = new THREE.Mesh(bladeGeom, steel);
    blade3.position.set(0, 2.5, 0);
    pivot3.add(blade3);

    hub.add(pivot1);
    hub.add(pivot2);
    hub.add(pivot3);

    // Animation (Turbine spinning)
    const times = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const qValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const hubTrack = new THREE.QuaternionKeyframeTrack(`${hub.name}.quaternion`, times, qValues);
    const clip = new THREE.AnimationClip('Spin', 4, [hubTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
