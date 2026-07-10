import { materials } from '../utils/materials.js';

export function createPortableSawmillBandsaw(THREE) {
    const group = new THREE.Group();
    group.name = "PortableSawmill";
    const animationClips = [];

    // Track/Bed
    const trackGeo = new THREE.BoxGeometry(6, 0.2, 1.2);
    const track = new THREE.Mesh(trackGeo, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333}));
    group.add(track);

    // Log to be sawed
    const logGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const log = new THREE.Mesh(logGeo, materials.wood || new THREE.MeshStandardMaterial({color: 0x8b5a2b}));
    log.rotation.z = Math.PI / 2;
    log.position.set(0, 0.4, 0);
    group.add(log);

    // Carriage Group
    const carriage = new THREE.Group();
    carriage.name = "Carriage";
    carriage.position.set(-2.5, 0.1, 0);

    // Carriage Base
    const baseGeo = new THREE.BoxGeometry(0.8, 0.1, 1.4);
    const carriageBase = new THREE.Mesh(baseGeo, materials.yellowMetal || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    carriage.add(carriageBase);

    // Uprights
    const uprightGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
    const leftUpright = new THREE.Mesh(uprightGeo, materials.yellowMetal || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    leftUpright.position.set(0, 0.8, -0.6);
    carriage.add(leftUpright);
    const rightUpright = new THREE.Mesh(uprightGeo, materials.yellowMetal || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    rightUpright.position.set(0, 0.8, 0.6);
    carriage.add(rightUpright);

    // Crossbeam
    const crossbeamGeo = new THREE.BoxGeometry(0.2, 0.2, 1.4);
    const crossbeam = new THREE.Mesh(crossbeamGeo, materials.yellowMetal || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    crossbeam.position.set(0, 1.5, 0);
    carriage.add(crossbeam);

    // Sawhead (moves up and down)
    const sawhead = new THREE.Group();
    sawhead.position.set(0, 0.6, 0);
    
    const bandwheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
    
    const leftWheelGroup = new THREE.Group();
    leftWheelGroup.name = "LeftWheel";
    leftWheelGroup.position.set(0, 0, -0.5);
    const leftWheel = new THREE.Mesh(bandwheelGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    leftWheel.rotation.x = Math.PI / 2;
    leftWheelGroup.add(leftWheel);
    sawhead.add(leftWheelGroup);

    const rightWheelGroup = new THREE.Group();
    rightWheelGroup.name = "RightWheel";
    rightWheelGroup.position.set(0, 0, 0.5);
    const rightWheel = new THREE.Mesh(bandwheelGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    rightWheel.rotation.x = Math.PI / 2;
    rightWheelGroup.add(rightWheel);
    sawhead.add(rightWheelGroup);

    // Blade representation
    const bladeGeo = new THREE.BoxGeometry(0.01, 0.05, 1.0);
    const blade = new THREE.Mesh(bladeGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    blade.position.set(0, -0.25, 0);
    sawhead.add(blade);

    // Blade shield
    const shieldGeo = new THREE.BoxGeometry(0.3, 0.1, 1.5);
    const shield = new THREE.Mesh(shieldGeo, materials.yellowMetal || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    shield.position.set(0, 0.3, 0);
    sawhead.add(shield);

    carriage.add(sawhead);
    group.add(carriage);

    // Animations
    const times = [0, 2, 4, 6];
    const posValues = [-2.5, 0.1, 0,  2.5, 0.1, 0,  2.5, 0.1, 0,  -2.5, 0.1, 0];
    const carriageTrack = new THREE.VectorKeyframeTrack(`${carriage.name}.position`, times, posValues);

    const smoothWheelTimes = [];
    const smoothWheelValues = [];
    for(let i=0; i<=24; i++) {
        smoothWheelTimes.push(i * 0.25);
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (i%4) * Math.PI/2);
        smoothWheelValues.push(q.x, q.y, q.z, q.w);
    }

    const leftWheelTrack = new THREE.QuaternionKeyframeTrack(`${leftWheelGroup.name}.quaternion`, smoothWheelTimes, smoothWheelValues);
    const rightWheelTrack = new THREE.QuaternionKeyframeTrack(`${rightWheelGroup.name}.quaternion`, smoothWheelTimes, smoothWheelValues);

    const clip = new THREE.AnimationClip('SawingAction', 6, [carriageTrack, leftWheelTrack, rightWheelTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
