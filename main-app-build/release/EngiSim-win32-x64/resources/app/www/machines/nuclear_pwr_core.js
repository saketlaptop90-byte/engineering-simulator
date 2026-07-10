import * as sharedMaterials from '../utils/materials.js';

export function createPWRCore(THREE) {
    const group = new THREE.Group();
    
    // Materials with fallback
    const casingMat = sharedMaterials.heavySteel || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const waterMat = sharedMaterials.water || new THREE.MeshPhysicalMaterial({ color: 0x0044ff, transparent: true, opacity: 0.6, transmission: 0.9 });
    const fuelMat = sharedMaterials.fuel || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    const glowMat = sharedMaterials.glowBlue || new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.4 });
    
    // Reactor Vessel
    const vesselGeo = new THREE.CylinderGeometry(5, 5, 15, 32);
    // Cut open slightly or use wireframe for visibility
    const vessel = new THREE.Mesh(vesselGeo, new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4, transparent: true, opacity: 0.3 }));
    group.add(vessel);
    
    // Coolant Water
    const waterGeo = new THREE.CylinderGeometry(4.8, 4.8, 14, 32);
    const water = new THREE.Mesh(waterGeo, waterMat);
    group.add(water);
    
    // Fuel assemblies grid
    for(let x=-3; x<=3; x+=1.5) {
        for(let z=-3; z<=3; z+=1.5) {
            // Circle constraint
            if (x*x + z*z < 12) {
                const fuelGeo = new THREE.BoxGeometry(1, 10, 1);
                const fuel = new THREE.Mesh(fuelGeo, fuelMat);
                fuel.position.set(x, -1, z);
                group.add(fuel);
            }
        }
    }
    
    // Cherenkov Radiation Glow
    const glowGeo = new THREE.CylinderGeometry(4.9, 4.9, 10, 32);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = -1;
    group.add(glow);
    
    // Animation: Pulsing Cherenkov glow indicating reactivity
    const times = [0, 1, 2];
    const values = [0.2, 0.6, 0.2];
    const trackName = glow.uuid + '.material.opacity';
    const opacityTrack = new THREE.NumberKeyframeTrack(trackName, times, values);
    
    const clip = new THREE.AnimationClip('CherenkovPulse', 2, [opacityTrack]);
    
    return { group, animationClips: [clip] };
}
