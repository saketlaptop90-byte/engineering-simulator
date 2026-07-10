import { materials } from '../utils/materials.js';

export function createNanoparticleExtruder(THREE) {
    const group = new THREE.Group();
    group.name = 'NanoparticleExtruder';

    // Extruder body
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1, 3, 32);
    const bodyMat = materials.metallic || new THREE.MeshStandardMaterial({color: 0x999999, metalness: 0.7});
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2;
    group.add(body);

    // Nozzle
    const nozzleGeo = new THREE.ConeGeometry(0.5, 1, 16);
    const nozzleMat = materials.accent || new THREE.MeshStandardMaterial({color: 0xcc6600, roughness: 0.4});
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.y = 0;
    nozzle.rotation.x = Math.PI;
    group.add(nozzle);

    // Particle
    const particleGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const particleMat = materials.highlight || new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x004400});
    
    const p1 = new THREE.Mesh(particleGeo, particleMat);
    p1.name = 'Particle1';
    group.add(p1);

    // Animate extrusion process
    const times = [0, 1, 2];
    const valuesPos = [0, -0.5, 0, 0, -2, 0, 0, -4, 0];
    const valuesScale = [0.1, 0.1, 0.1, 1, 1, 1, 1.5, 1.5, 1.5];
    
    const posTrack = new THREE.VectorKeyframeTrack('Particle1.position', times, valuesPos);
    const scaleTrack = new THREE.VectorKeyframeTrack('Particle1.scale', times, valuesScale);
    const clip = new THREE.AnimationClip('ExtrudeParticle', 2, [posTrack, scaleTrack]);

    return { group, animationClips: [clip] };
}
