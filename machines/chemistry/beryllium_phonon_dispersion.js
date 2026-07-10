import * as THREE from 'three';

export function createBerylliumPhononDispersion(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizing lattice vibrations (phonons) in a Beryllium HCP (Hexagonal Close Packed) crystal
    
    const atoms = [];
    const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
    
    const a = 2.28; // lattice parameter a
    const c = 3.58; // lattice parameter c (scaled for visibility)
    
    const nx = 4, ny = 4, nz = 3;
    
    for(let i=0; i<nx; i++) {
        for(let j=0; j<ny; j++) {
            for(let k=0; k<nz; k++) {
                // HCP basis vectors
                let x = i * a + (j%2) * (a/2);
                let y = j * (a * Math.sqrt(3)/2);
                let z = k * c;
                
                // Motif (second atom)
                if (k%2 !== 0) {
                    x += a/2;
                    y += a/(2*Math.sqrt(3));
                }
                
                // Center the lattice
                x -= (nx*a)/2;
                y -= (ny*a)/2;
                z -= (nz*c)/2;

                // Color gradient based on Z position
                const color = new THREE.Color();
                color.setHSL(0.5 + (k/nz)*0.2, 0.8, 0.5);
                
                const mat = new THREE.MeshPhysicalMaterial({ color: color, metalness: 0.8, roughness: 0.2 });
                const mesh = new THREE.Mesh(sphereGeo, mat);
                
                mesh.position.set(x, y, z);
                group.add(mesh);
                
                atoms.push({
                    mesh,
                    initX: x, initY: y, initZ: z,
                    phase: x*0.5 + y*0.5 + z*0.5
                });
            }
        }
    }

    // Add axes
    const axesHelper = new THREE.AxesHelper(5);
    group.add(axesHelper);

    let time = 0;
    return {
        group,
        update: () => {
            time += 0.05;
            
            // Simulate a transverse phonon wave propagating through the lattice
            const k_vec = { x: 0.5, y: 0, z: 0.5 }; // wave vector
            const omega = 2.0; // frequency
            
            atoms.forEach(atom => {
                const dotProduct = atom.initX * k_vec.x + atom.initY * k_vec.y + atom.initZ * k_vec.z;
                const displacement = Math.sin(dotProduct - omega * time);
                
                // Transverse vibration (perpendicular to k)
                atom.mesh.position.y = atom.initY + displacement * 0.8;
                
                // Color pulse
                atom.mesh.material.emissive.setHSL(0.6, 1.0, (displacement+1)*0.2);
            });
            
            group.rotation.x = 0.5;
            group.rotation.y += 0.002;
        }
    };
}
