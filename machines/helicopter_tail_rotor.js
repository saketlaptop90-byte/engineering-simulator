import { aluminum, darkSteel, carbonFiber, titanium } from '../utils/materials.js';

export function createTailRotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const housingGeo = new THREE.BoxGeometry(0.6, 0.6, 0.8);
    const housing = new THREE.Mesh(housingGeo, titanium);
    group.add(housing);
    
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, darkSteel);
    shaft.position.x = 0.5;
    group.add(shaft);
    
    const rotorGroup = new THREE.Group();
    rotorGroup.name = "TailRotorGroup";
    rotorGroup.position.x = 1;
    group.add(rotorGroup);
    
    const hubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    rotorGroup.add(hub);
    
    const numBlades = 4;
    for (let i = 0; i < numBlades; i++) {
        const angle = (i / numBlades) * Math.PI * 2;
        const bladeGeo = new THREE.BoxGeometry(0.05, 2, 0.3);
        bladeGeo.translate(0, 1.1, 0);
        const blade = new THREE.Mesh(bladeGeo, carbonFiber);
        blade.rotation.x = angle;
        rotorGroup.add(blade);
    }
    
    const duration = 0.5;
    const times = [0, duration/4, duration/2, duration*3/4, duration];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI*1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI*2);
    
    const track = new THREE.QuaternionKeyframeTrack(
        'TailRotorGroup.quaternion',
        times,
        [...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()]
    );
    
    const clip = new THREE.AnimationClip('TailRotorSpin', duration, [track]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
