import { aluminum, darkSteel, carbonFiber, titanium } from '../utils/materials.js';

export function createMainRotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const mastGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
    const mast = new THREE.Mesh(mastGeometry, titanium);
    mast.position.y = 1.5;
    group.add(mast);
    
    const hubGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const hub = new THREE.Mesh(hubGeometry, darkSteel);
    hub.position.y = 3;
    group.add(hub);
    
    const numBlades = 4;
    const bladeGroup = new THREE.Group();
    bladeGroup.name = "MainRotorBladeGroup";
    bladeGroup.position.y = 3;
    group.add(bladeGroup);
    
    for (let i = 0; i < numBlades; i++) {
        const angle = (i / numBlades) * Math.PI * 2;
        
        const gripGroup = new THREE.Group();
        gripGroup.rotation.y = angle;
        
        const gripGeo = new THREE.CylinderGeometry(0.15, 0.15, 1, 16);
        gripGeo.rotateZ(Math.PI / 2);
        gripGeo.translate(0.5, 0, 0);
        const grip = new THREE.Mesh(gripGeo, aluminum);
        gripGroup.add(grip);
        
        const bladeGeo = new THREE.BoxGeometry(6, 0.05, 0.6);
        bladeGeo.translate(3 + 1, 0, 0);
        const blade = new THREE.Mesh(bladeGeo, carbonFiber);
        gripGroup.add(blade);
        
        bladeGroup.add(gripGroup);
    }
    
    const duration = 2;
    const times = [0, duration/4, duration/2, duration*3/4, duration];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI*1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI*2);
    
    const hubRotTrack = new THREE.QuaternionKeyframeTrack(
        'MainRotorBladeGroup.quaternion',
        times,
        [...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()]
    );
    
    const clip = new THREE.AnimationClip('MainRotorSpin', duration, [hubRotTrack]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
