import * as THREE from 'three';

export function createBerylliumLiquidState(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes Beryllium in its molten/liquid state.
    // Atoms are still close together but disorganized and flowing freely.

    const numAtoms = 40;
    const atomGeo = new THREE.SphereGeometry(0.8, 16, 16);
    // Give them a hot, glowing metallic look (molten metal)
    const atomMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaa44,
        emissive: 0xaa2200,
        emissiveIntensity: 0.5,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0
    });

    const atoms = [];
    const containerRadius = 5;

    for (let i=0; i<numAtoms; i++) {
        const mesh = new THREE.Mesh(atomGeo, atomMat);
        // Random position within a sphere
        mesh.position.set(
            (Math.random()-0.5) * containerRadius,
            (Math.random()-0.5) * containerRadius,
            (Math.random()-0.5) * containerRadius
        );
        group.add(mesh);
        
        atoms.push({
            mesh,
            velocity: new THREE.Vector3(
                (Math.random()-0.5) * 0.1,
                (Math.random()-0.5) * 0.1,
                (Math.random()-0.5) * 0.1
            )
        });
    }

    // A glass-like container holding the liquid
    const glassGeo = new THREE.SphereGeometry(containerRadius + 1, 32, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        transmission: 0.9,
        roughness: 0.0,
        side: THREE.BackSide // see inside
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    group.add(glass);

    const light = new THREE.PointLight(0xffaa44, 5, 20);
    group.add(light);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            group.rotation.y = time * 0.1;

            // Fluid dynamics simulation (very basic)
            // Atoms move, bounce off container, and gently repel each other to maintain density
            for (let i=0; i<atoms.length; i++) {
                const a = atoms[i];
                a.mesh.position.add(a.velocity);

                // Container collision
                if (a.mesh.position.length() > containerRadius) {
                    const normal = a.mesh.position.clone().normalize();
                    a.velocity.reflect(normal).multiplyScalar(0.9); // bounce and lose a bit of energy
                    a.mesh.position.copy(normal.multiplyScalar(containerRadius));
                }

                // Inter-atom collision/repulsion
                for (let j=i+1; j<atoms.length; j++) {
                    const b = atoms[j];
                    const distSq = a.mesh.position.distanceToSquared(b.mesh.position);
                    const minDist = 1.6; // 2 * radius (0.8)
                    
                    if (distSq < minDist*minDist && distSq > 0) {
                        const dist = Math.sqrt(distSq);
                        const pushDir = new THREE.Vector3().subVectors(a.mesh.position, b.mesh.position).normalize();
                        
                        // Push apart
                        const overlap = minDist - dist;
                        const pushForce = pushDir.multiplyScalar(overlap * 0.1);
                        
                        a.velocity.add(pushForce);
                        b.velocity.sub(pushForce);
                    }
                }
                
                // Add continuous random thermal energy (Brownian motion)
                a.velocity.x += (Math.random()-0.5) * 0.02;
                a.velocity.y += (Math.random()-0.5) * 0.02;
                a.velocity.z += (Math.random()-0.5) * 0.02;
                
                // Cap speed (viscosity)
                a.velocity.clampLength(0, 0.15);
            }
            
            // Pulse emissive color to look hot
            atomMat.emissiveIntensity = 0.5 + Math.sin(time*3)*0.2;
        },
        cleanup: () => {
            atomGeo.dispose(); atomMat.dispose();
            glassGeo.dispose(); glassMat.dispose();
        }
    };
}