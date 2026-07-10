import { metalMaterial, glowMaterial } from '../utils/materials.js';

export function createPenningTrap(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main structural materials
    const electrodeMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0xdcdcdc, metalness: 0.9, roughness: 0.2 });
    const frameMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });

    // Ring Electrode
    const ringGeom = new THREE.TorusGeometry(2, 0.4, 32, 64);
    const ring = new THREE.Mesh(ringGeom, electrodeMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Endcap Electrodes (Hyperboloidal approximation)
    const capGeom = new THREE.CylinderGeometry(0.2, 1.5, 1, 32);
    
    const topCap = new THREE.Mesh(capGeom, electrodeMat);
    topCap.position.y = 1.8;
    group.add(topCap);
    
    const bottomCap = new THREE.Mesh(capGeom, electrodeMat);
    bottomCap.position.y = -1.8;
    bottomCap.rotation.x = Math.PI;
    group.add(bottomCap);

    // Magnetic Field Coils (Helmholtz configuration)
    const coilGeom = new THREE.TorusGeometry(3.5, 0.3, 16, 64);
    const coilMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8 }); // Copper
    
    const topCoil = new THREE.Mesh(coilGeom, coilMat);
    topCoil.position.y = 2.5;
    topCoil.rotation.x = Math.PI / 2;
    group.add(topCoil);
    
    const bottomCoil = new THREE.Mesh(coilGeom, coilMat);
    bottomCoil.position.y = -2.5;
    bottomCoil.rotation.x = Math.PI / 2;
    group.add(bottomCoil);

    // Trapped Ion
    const ionGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const ionMat = glowMaterial || new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.9 });
    const ion = new THREE.Mesh(ionGeom, ionMat);
    group.add(ion);

    // Complex Ion Motion Animation (Axial, Magnetron, Modified Cyclotron)
    const times = [];
    const values = [];
    const duration = 10;
    const steps = 200;
    
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);
        
        // Superposition of motions
        const magnetronFreq = 1;
        const cyclotronFreq = 10;
        const axialFreq = 3;
        
        const rMag = 0.8;
        const rCyc = 0.2;
        
        const x = rMag * Math.cos(t * magnetronFreq) + rCyc * Math.cos(t * cyclotronFreq);
        const z = rMag * Math.sin(t * magnetronFreq) + rCyc * Math.sin(t * cyclotronFreq);
        const y = 0.5 * Math.sin(t * axialFreq);
        
        values.push(x, y, z);
    }
    
    const track = new THREE.VectorKeyframeTrack(ion.uuid + '.position', times, values);
    animationClips.push(new THREE.AnimationClip('ion_trapped_motion', duration, [track]));

    return { group, animationClips };
}
