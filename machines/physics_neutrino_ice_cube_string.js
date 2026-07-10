import { titanium, copper, gold, darkSteel } from '../utils/materials.js';

export function createNeutrinoIceCubeString(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main string cable
    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 40, 16);
    const cable = new THREE.Mesh(cableGeo, darkSteel);
    group.add(cable);

    // DOMs (Digital Optical Modules)
    const domCount = 10;
    const doms = new THREE.Group();
    doms.name = 'domArray';
    
    for (let i = 0; i < domCount; i++) {
        const domGroup = new THREE.Group();
        
        // Glass housing
        const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
        const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
        const sphere = new THREE.Mesh(sphereGeo, glassMat);
        
        // Internal electronics structure
        const innerGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
        const inner = new THREE.Mesh(innerGeo, titanium);
        
        // Photomultiplier tube
        const bottomGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const pmt = new THREE.Mesh(bottomGeo, gold);
        pmt.position.y = -0.1;
        
        domGroup.add(sphere);
        domGroup.add(inner);
        domGroup.add(pmt);
        
        domGroup.position.y = (i - domCount / 2 + 0.5) * 4;
        doms.add(domGroup);
    }
    group.add(doms);

    // Animation: DOMs pulsing/scanning (rotating array)
    const times = [0, 1, 2];
    const values = [0, 0, 0,  0, Math.PI, 0,  0, Math.PI * 2, 0];
    const domRotationTrack = new THREE.VectorKeyframeTrack('domArray.rotation', times, values);
    const domClip = new THREE.AnimationClip('SpinDOMs', 2, [domRotationTrack]);
    animationClips.push(domClip);

    // Neutrino particle passing through
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const particle = new THREE.Mesh(particleGeo, particleMat);
    particle.name = 'neutrinoParticle';
    group.add(particle);

    const pTimes = [0, 2, 4];
    const pValues = [-5, -25, 0,  5, 0, 0,  -5, 25, 0];
    const particlePosTrack = new THREE.VectorKeyframeTrack('neutrinoParticle.position', pTimes, pValues);
    const particleClip = new THREE.AnimationClip('NeutrinoPass', 4, [particlePosTrack]);
    animationClips.push(particleClip);

    return { group, animationClips };
}
