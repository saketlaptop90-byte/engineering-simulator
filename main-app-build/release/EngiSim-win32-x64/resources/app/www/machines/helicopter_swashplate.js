import { aluminum, darkSteel, carbonFiber, titanium } from '../utils/materials.js';

export function createSwashplate(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const mastGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
    const mast = new THREE.Mesh(mastGeo, titanium);
    group.add(mast);
    
    const swashplateGroup = new THREE.Group();
    swashplateGroup.name = "SwashplateAssembly";
    swashplateGroup.position.y = 0;
    group.add(swashplateGroup);
    
    const nrPlateGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 32);
    nrPlateGeo.rotateX(Math.PI / 2);
    const nrPlate = new THREE.Mesh(nrPlateGeo, darkSteel);
    swashplateGroup.add(nrPlate);
    
    const rPlateGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 32);
    rPlateGeo.rotateX(Math.PI / 2);
    const rPlate = new THREE.Mesh(rPlateGeo, aluminum);
    rPlate.position.y = 0.2;
    rPlate.name = "RotatingPlate";
    swashplateGroup.add(rPlate);
    
    for (let i=0; i<3; i++) {
        const angle = (i/3)*Math.PI*2;
        const linkGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
        const link = new THREE.Mesh(linkGeo, darkSteel);
        link.position.set(Math.cos(angle)*0.6, 0.75+0.2, Math.sin(angle)*0.6);
        rPlate.add(link);
    }
    
    for (let i=0; i<3; i++) {
        const angle = (i/3)*Math.PI*2;
        const actGeo = new THREE.CylinderGeometry(0.08, 0.08, 2);
        const act = new THREE.Mesh(actGeo, titanium);
        act.position.set(Math.cos(angle)*0.6, -1, Math.sin(angle)*0.6);
        swashplateGroup.add(act);
    }
    
    const times = [0, 2, 4];
    const posValues = [
        0, -0.5, 0,
        0, 0.8, 0,
        0, -0.5, 0
    ];
    const posTrack = new THREE.VectorKeyframeTrack('SwashplateAssembly.position', times, posValues);
    
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0.2));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const rotTrack = new THREE.QuaternionKeyframeTrack('SwashplateAssembly.quaternion', times, [...q0.toArray(), ...q1.toArray(), ...q2.toArray()]);
    
    const spinTimes = [];
    const spinValues = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
        spinTimes.push((i / steps) * 4);
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (i / steps) * Math.PI * 8); 
        spinValues.push(...q.toArray());
    }
    const spinTrack = new THREE.QuaternionKeyframeTrack('RotatingPlate.quaternion', spinTimes, spinValues);
    
    const clip = new THREE.AnimationClip('SwashplateAction', 4, [posTrack, rotTrack, spinTrack]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
