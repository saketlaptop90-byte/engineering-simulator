import * as THREE from 'three';

export function createBerylliumCopperAlloy(scene, renderer, camera) {
    const group = new THREE.Group();

    // Beryllium Copper (BeCu) is a high-strength alloy used in non-sparking tools.
    // Visualize the Cu crystal lattice with substituted Be atoms.

    const gridSize = 4;
    const spacing = 2;
    
    const cuMat = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.2 }); // Copper
    const beMat = new THREE.MeshPhysicalMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.1 }); // Beryllium
    
    const atomGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const atoms = [];

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                // FCC lattice approximation
                const px = (x - gridSize/2) * spacing;
                const py = (y - gridSize/2) * spacing;
                const pz = (z - gridSize/2) * spacing;
                
                // ~2% Be substitution
                const isBe = Math.random() < 0.05;
                const mat = isBe ? beMat : cuMat;
                
                const atom = new THREE.Mesh(atomGeo, mat);
                atom.position.set(px, py, pz);
                
                // Add connections
                if (x < gridSize - 1) {
                    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, spacing), new THREE.MeshBasicMaterial({color: 0x555555}));
                    cyl.position.set(px + spacing/2, py, pz);
                    cyl.rotation.z = Math.PI / 2;
                    group.add(cyl);
                }
                if (y < gridSize - 1) {
                    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, spacing), new THREE.MeshBasicMaterial({color: 0x555555}));
                    cyl.position.set(px, py + spacing/2, pz);
                    group.add(cyl);
                }
                if (z < gridSize - 1) {
                    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, spacing), new THREE.MeshBasicMaterial({color: 0x555555}));
                    cyl.position.set(px, py, pz + spacing/2);
                    cyl.rotation.x = Math.PI / 2;
                    group.add(cyl);
                }

                group.add(atom);
                atoms.push({ mesh: atom, isBe, initX: px, initY: py, initZ: pz });
            }
        }
    }

    return {
        group,
        update: () => {
            const time = Date.now() * 0.002;
            group.rotation.y = time * 0.1;
            group.rotation.x = time * 0.05;
            
            // Thermal vibration
            atoms.forEach(a => {
                a.mesh.position.x = a.initX + Math.sin(time * 5 + a.initY) * 0.05;
                a.mesh.position.y = a.initY + Math.cos(time * 4 + a.initZ) * 0.05;
                a.mesh.position.z = a.initZ + Math.sin(time * 6 + a.initX) * 0.05;
            });
        }
    };
}
