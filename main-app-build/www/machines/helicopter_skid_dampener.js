import { aluminum, darkSteel, carbonFiber, titanium } from '../utils/materials.js';

export function createSkidDampener(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const skidGeo = new THREE.CylinderGeometry(0.15, 0.15, 6, 16);
    skidGeo.rotateZ(Math.PI / 2);
    const skid = new THREE.Mesh(skidGeo, aluminum);
    
    const strutGroup = new THREE.Group();
    strutGroup.name = "StrutAssembly";
    group.add(strutGroup);
    
    const upperGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const upperStrut = new THREE.Mesh(upperGeo, darkSteel);
    upperStrut.position.y = 0.75;
    strutGroup.add(upperStrut);
    
    const lowerGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16);
    const lowerStrut = new THREE.Mesh(lowerGeo, titanium);
    lowerStrut.position.y = -0.25;
    lowerStrut.name = "LowerStrut";
    strutGroup.add(lowerStrut);
    
    const skidConn = skid.clone();
    lowerStrut.add(skidConn);
    skidConn.position.y = -0.75;
    
    for(let i=0; i<8; i++) {
        const ringGeo = new THREE.TorusGeometry(0.25, 0.04, 8, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, carbonFiber);
        ring.position.y = i * 0.15;
        lowerStrut.add(ring);
    }
    
    const times = [0, 1, 2, 3, 4];
    const posValues = [
        0, 0, 0,     
        0, -0.4, 0,  
        0, -0.2, 0,  
        0, -0.3, 0,  
        0, -0.2, 0   
    ];
    
    const track = new THREE.VectorKeyframeTrack('LowerStrut.position', times, posValues);
    const clip = new THREE.AnimationClip('SkidCompression', 4, [track]);
    animationClips.push(clip);
    
    return { group, animationClips };
}
