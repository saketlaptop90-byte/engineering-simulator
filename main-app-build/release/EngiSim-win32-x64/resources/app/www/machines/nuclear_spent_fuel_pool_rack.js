import { materials } from '../utils/materials.js';

export function createSpentFuelPoolRack(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const rackMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.4 });
    const waterMaterial = materials.water || new THREE.MeshPhysicalMaterial({ color: 0x0055ff, transparent: true, opacity: 0.5, transmission: 0.9, ior: 1.33 });
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8 }); // Cherenkov radiation

    // The Rack Grid
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            const cellGeom = new THREE.BoxGeometry(0.8, 5, 0.8);
            const cell = new THREE.Mesh(cellGeom, rackMaterial);
            cell.position.set(i * 1.0 - 1.5, 2.5, j * 1.0 - 1.5);
            
            // Fuel Assembly inside some cells
            if ((i+j) % 2 === 0) {
                const fuelGeom = new THREE.CylinderGeometry(0.3, 0.3, 4.8, 16);
                const fuel = new THREE.Mesh(fuelGeom, rackMaterial);
                fuel.position.set(0, 0, 0);
                cell.add(fuel);

                // Cherenkov glow
                const glowGeom = new THREE.CylinderGeometry(0.35, 0.35, 4.9, 16);
                const glow = new THREE.Mesh(glowGeom, glowMaterial);
                glow.name = `glow_${i}_${j}`;
                cell.add(glow);

                // Animation for pulsing glow
                const times = [0, 1, 2];
                const opacities = [0.4, 0.8, 0.4];
                const opacityTrack = new THREE.NumberKeyframeTrack(`${glow.name}.material.opacity`, times, opacities);
                const clip = new THREE.AnimationClip(`PulseGlow_${i}_${j}`, 2, [opacityTrack]);
                animationClips.push(clip);
            }
            
            group.add(cell);
        }
    }

    // Water pool
    const poolGeom = new THREE.BoxGeometry(5, 6, 5);
    const pool = new THREE.Mesh(poolGeom, waterMaterial);
    pool.position.set(0, 3, 0);
    group.add(pool);

    return { group, animationClips };
}
