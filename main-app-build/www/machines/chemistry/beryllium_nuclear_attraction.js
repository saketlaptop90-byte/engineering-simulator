import * as THREE from 'three';

export function createBerylliumNuclearAttraction(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes a "gravity well" style attraction for the nucleus pulling electrons inward
    // using a deformed grid or funnel

    // The Grid
    const gridSize = 40;
    const gridDiv = 40;
    const gridGeo = new THREE.PlaneGeometry(gridSize, gridSize, gridDiv, gridDiv);
    
    // Rotate to be horizontal
    gridGeo.rotateX(-Math.PI / 2);
    
    // Modify vertices to create a well in the center
    const positions = gridGeo.attributes.position.array;
    for(let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i+2];
        const dist = Math.sqrt(x*x + z*z);
        // Gaussian-like well
        const y = -10.0 * Math.exp(-dist * dist / 5.0);
        positions[i+1] = y;
    }
    gridGeo.computeVertexNormals();

    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x00c8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    group.add(grid);

    // Nucleus at the bottom of the well
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    nucleus.position.y = -9.5;
    group.add(nucleus);

    // Electrons orbiting inside the well
    const electronGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    const electrons = [];
    const radii = [1.5, 1.5, 3.5, 3.5]; // Core vs valence
    
    for(let i=0; i<4; i++) {
        const e = new THREE.Mesh(electronGeo, electronMat);
        group.add(e);
        electrons.push({
            mesh: e,
            r: radii[i],
            angle: Math.random() * Math.PI * 2,
            speed: 0.02 + (1.0/radii[i])*0.05
        });
    }

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Rotate grid slowly
            grid.rotation.y = time * 0.05;

            // Electrons orbit and follow the well height
            electrons.forEach(e => {
                e.angle += e.speed;
                const x = Math.cos(e.angle) * e.r;
                const z = Math.sin(e.angle) * e.r;
                
                // Calculate height of well at this radius
                const y = -10.0 * Math.exp(-(e.r * e.r) / 5.0) + 0.3; // +0.3 to float slightly above wireframe
                
                e.mesh.position.set(x, y, z);
            });
            
            // Pulse nucleus
            nucleus.scale.setScalar(1 + Math.sin(time*10)*0.1);
        },
        cleanup: () => {
            gridGeo.dispose();
            gridMat.dispose();
            nucleus.geometry.dispose();
            nucleus.material.dispose();
            electronGeo.dispose();
            electronMat.dispose();
        }
    };
}