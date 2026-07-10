import { metalMaterial, glassMaterial, glowingMaterial, darkMaterial } from '../utils/materials.js';

export function createMetamaterialSoundAbsorber(THREE) {
    const group = new THREE.Group();
    const mStructure = darkMaterial || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    const mEnergy = glowingMaterial || new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, blending: THREE.AdditiveBlending });

    // creating a fractal or porous like structure
    const cells = [];
    const cellGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            for (let z = -2; z <= 2; z++) {
                if (Math.abs(x) + Math.abs(y) + Math.abs(z) > 3) continue; // spherical carving
                const cell = new THREE.Mesh(cellGeo, mStructure);
                cell.position.set(x, y, z);
                cells.push(cell);
                group.add(cell);
            }
        }
    }

    // Energy dissipation visualizing
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        positions[i] = (Math.random() - 0.5) * 6;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: 0xff4400, size: 0.1, transparent: true, opacity: 0.8 }));
    group.add(particles);

    group.userData.update = (delta, time) => {
        cells.forEach((cell, i) => {
            // Sound absorption vibration
            const noise = Math.sin(time * 20 + i) * Math.cos(time * 15 - i);
            const scale = 1 - Math.abs(noise) * 0.2; // shrinking to show absorption
            cell.scale.setScalar(scale);
        });

        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            // Particles move inward and fade (absorbed)
            let px = positions[i*3];
            let py = positions[i*3+1];
            let pz = positions[i*3+2];
            
            px *= 0.98;
            py *= 0.98;
            pz *= 0.98;

            if (Math.abs(px) < 0.1 && Math.abs(py) < 0.1 && Math.abs(pz) < 0.1) {
                px = (Math.random() - 0.5) * 6;
                py = (Math.random() - 0.5) * 6;
                pz = (Math.random() - 0.5) * 6;
            }

            positions[i*3] = px;
            positions[i*3+1] = py;
            positions[i*3+2] = pz;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    };

    return { group, animationClips: [] };
}
