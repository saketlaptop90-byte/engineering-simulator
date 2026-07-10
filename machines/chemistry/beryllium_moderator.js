import * as THREE from 'three';

export function createBerylliumModerator(scene, renderer, camera) {
    const group = new THREE.Group();

    // Beryllium as a neutron moderator/reflector
    // Shows fast neutrons entering, hitting Be atoms, and slowing down (thermalizing).

    const beGridSize = 3;
    const spacing = 3;
    const beMat = new THREE.MeshPhysicalMaterial({ color: 0x99aacc, metalness: 0.6, roughness: 0.4 });
    const beGeo = new THREE.SphereGeometry(1, 32, 32);
    
    const beAtoms = [];
    for(let x=-beGridSize; x<=beGridSize; x++) {
        for(let y=-beGridSize; y<=beGridSize; y++) {
            for(let z=-beGridSize; z<=beGridSize; z++) {
                if (Math.abs(x)+Math.abs(y)+Math.abs(z) > 4) continue;
                const mesh = new THREE.Mesh(beGeo, beMat);
                mesh.position.set(x*spacing, y*spacing, z*spacing);
                group.add(mesh);
                beAtoms.push(mesh.position);
            }
        }
    }

    // Neutrons
    const neutronGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const neutronMatFast = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Fast
    const neutronMatSlow = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Slow
    
    const neutrons = [];
    for(let i=0; i<20; i++) {
        const mesh = new THREE.Mesh(neutronGeo, neutronMatFast);
        mesh.position.set(-15, (Math.random()-0.5)*5, (Math.random()-0.5)*5);
        group.add(mesh);
        neutrons.push({
            mesh,
            velocity: new THREE.Vector3(0.5 + Math.random()*0.5, 0, 0),
            speedLevel: 1.0
        });
    }

    return {
        group,
        update: () => {
            group.rotation.y += 0.005;
            
            neutrons.forEach(n => {
                n.mesh.position.add(n.velocity);
                
                // Collision detection with Be
                let collided = false;
                beAtoms.forEach(pos => {
                    if (n.mesh.position.distanceTo(pos) < 1.2) {
                        collided = true;
                    }
                });
                
                if (collided) {
                    // Slow down and scatter
                    n.speedLevel *= 0.6;
                    n.velocity.set(
                        (Math.random()-0.5) * n.speedLevel,
                        (Math.random()-0.5) * n.speedLevel,
                        (Math.random()-0.5) * n.speedLevel
                    );
                    
                    if (n.speedLevel < 0.2) {
                        n.mesh.material = neutronMatSlow;
                    }
                }
                
                // Reset if far away
                if (n.mesh.position.length() > 20) {
                    n.mesh.position.set(-15, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
                    n.velocity.set(0.5 + Math.random()*0.5, 0, 0);
                    n.speedLevel = 1.0;
                    n.mesh.material = neutronMatFast;
                }
            });
        }
    };
}
