import { aluminum, darkSteel, carbonFiber, titanium } from '../utils/materials.js';

export function createTurboshaftEngine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const casingGeo = new THREE.CylinderGeometry(0.8, 0.7, 3, 32);
    casingGeo.rotateZ(Math.PI / 2);
    const casing = new THREE.Mesh(casingGeo, titanium);
    group.add(casing);
    
    const shaftGroup = new THREE.Group();
    shaftGroup.name = "CompressorShaft";
    group.add(shaftGroup);
    
    const shaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.2, 16);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, darkSteel);
    shaftGroup.add(shaft);
    
    const numStages = 5;
    for (let i=0; i<numStages; i++) {
        const stageGroup = new THREE.Group();
        stageGroup.position.x = -1 + i * 0.4;
        
        const diskGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        diskGeo.rotateZ(Math.PI / 2);
        const disk = new THREE.Mesh(diskGeo, aluminum);
        stageGroup.add(disk);
        
        const numBlades = 12;
        for(let j=0; j<numBlades; j++) {
            const angle = (j / numBlades) * Math.PI * 2;
            const bladeGeo = new THREE.BoxGeometry(0.05, 0.8 - (i*0.05), 0.2);
            const blade = new THREE.Mesh(bladeGeo, darkSteel);
            blade.position.set(0, Math.cos(angle)*0.3, Math.sin(angle)*0.3);
            blade.rotation.x = angle;
            blade.rotation.y = 0.2;
            stageGroup.add(blade);
        }
        shaftGroup.add(stageGroup);
    }
    
    const combGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    combGeo.rotateY(Math.PI / 2);
    const comb = new THREE.Mesh(combGeo, carbonFiber);
    comb.position.x = 0.8;
    group.add(comb);
    
    const turbineStage = new THREE.Group();
    turbineStage.position.x = 1.2;
    const tDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.15, 16).rotateZ(Math.PI/2), aluminum);
    turbineStage.add(tDisk);
    
    for(let j=0; j<16; j++) {
        const angle = (j / 16) * Math.PI * 2;
        const bladeGeo = new THREE.BoxGeometry(0.1, 0.7, 0.3);
        const blade = new THREE.Mesh(bladeGeo, titanium);
        blade.position.set(0, Math.cos(angle)*0.3, Math.sin(angle)*0.3);
        blade.rotation.x = angle;
        blade.rotation.y = -0.3;
        turbineStage.add(blade);
    }
    shaftGroup.add(turbineStage);
    
    const duration = 0.5;
    const times = [0, duration/4, duration/2, duration*3/4, duration];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI*1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI*2);
    
    const track = new THREE.QuaternionKeyframeTrack('CompressorShaft.quaternion', times, [...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()]);
    const clip = new THREE.AnimationClip('TurbineSpin', duration, [track]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
