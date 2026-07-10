import * as THREE from 'three';

export function createBerylliumFOrbitals(scene, renderer, camera) {
    const group = new THREE.Group();

    // Beryllium has absolutely no native f-orbitals.
    // We visualize them as highly complex, faint abstract mathematical constructs.

    const createFLobe = (color) => {
        const geo = new THREE.SphereGeometry(1, 16, 16);
        // Stretch into a long petal
        const pos = geo.attributes.position.array;
        for(let i=0; i<pos.length; i+=3) {
            pos[i] *= 0.3; // very narrow
            pos[i+1] *= 2.0; // very long
            pos[i+2] *= 0.3; // very narrow
        }
        geo.computeVertexNormals();
        
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.05,
            blending: THREE.AdditiveBlending
        });

        const petal = new THREE.Mesh(geo, mat);
        return petal;
    };

    // F-orbital has 7 states, often looking like 8 petals or double donuts
    // We'll just make an 8-petal abstract shape
    const abstractF = new THREE.Group();
    
    const colors = [0xff0044, 0x00ff44, 0x4400ff, 0xffff00];
    for (let i=0; i<8; i++) {
        const petal = createFLobe(colors[i % 4]);
        
        // Arrange pointing outwards from center
        // Top 4, bottom 4
        const y = i < 4 ? 1 : -1;
        const angle = (i % 4) * (Math.PI / 2) + (i < 4 ? 0 : Math.PI/4);
        
        const dir = new THREE.Vector3(Math.cos(angle), y, Math.sin(angle)).normalize();
        petal.position.copy(dir.clone().multiplyScalar(1.5));
        
        // Look away from center
        petal.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
        
        abstractF.add(petal);
    }
    
    group.add(abstractF);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            abstractF.rotation.y = time * 0.1;
            abstractF.rotation.x = Math.sin(time*0.2) * 0.2;
            abstractF.rotation.z = Math.cos(time*0.15) * 0.2;
            
            // Ghostly pulse
            abstractF.children.forEach((child, i) => {
                if(child.isMesh && child.material.wireframe) {
                    child.material.opacity = 0.02 + Math.sin(time*3 + i)*0.03;
                }
            });
        },
        cleanup: () => {
            abstractF.children.forEach(child => {
                child.geometry.dispose();
                child.material.dispose();
            });
            nucleus.geometry.dispose();
            nucleus.material.dispose();
        }
    };
}