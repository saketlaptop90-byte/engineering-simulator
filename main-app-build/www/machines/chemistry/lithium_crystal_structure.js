import * as THREE from 'three';

export function createLithiumCrystalStructure(scene, renderer, camera) {
    const group = new THREE.Group();

    // Body-Centered Cubic (BCC) Structure for Lithium
    // Corners and one in the center.

    const atomGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const atomMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xdddddd,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        envMapIntensity: 2.0
    });
    
    const highlightMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff3366,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x440011,
        clearcoat: 1.0
    });

    const size = 3;
    const atoms = [];
    
    // Helper to create atom
    function createAtom(x, y, z, isCenter = false) {
        const mesh = new THREE.Mesh(atomGeometry, isCenter ? highlightMaterial : atomMaterial);
        mesh.position.set(x, y, z);
        group.add(mesh);
        atoms.push({ mesh, x, y, z, isCenter });
        return mesh;
    }

    // Create 3x3x3 unit cells
    const cells = 2; // -1, 0, 1
    const spacing = 4;
    
    for (let x = -cells; x <= cells; x++) {
        for (let y = -cells; y <= cells; y++) {
            for (let z = -cells; z <= cells; z++) {
                // Corner atoms
                createAtom(x * spacing, y * spacing, z * spacing);
                
                // Center atoms (BCC)
                if (x < cells && y < cells && z < cells) {
                    createAtom(
                        x * spacing + spacing/2, 
                        y * spacing + spacing/2, 
                        z * spacing + spacing/2,
                        true // highlight centers
                    );
                }
            }
        }
    }

    // Draw lattice lines
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x444444, 
        transparent: true, 
        opacity: 0.3 
    });
    
    // Create grid of lines
    for(let i=0; i<atoms.length; i++) {
        for(let j=i+1; j<atoms.length; j++) {
            const a1 = atoms[i];
            const a2 = atoms[j];
            const dist = a1.mesh.position.distanceTo(a2.mesh.position);
            
            // Connect corners to centers (BCC nearest neighbors)
            // Distance is roughly sqrt(3) * spacing/2
            const expectedDist = Math.sqrt(3) * spacing / 2;
            
            if (Math.abs(dist - expectedDist) < 0.1 || Math.abs(dist - spacing) < 0.1) {
                const points = [a1.mesh.position, a2.mesh.position];
                const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeo, lineMaterial);
                group.add(line);
            }
        }
    }

    // Add dramatic lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(10, 20, 15);
    group.add(light1);
    
    const light2 = new THREE.DirectionalLight(0x00c8ff, 1);
    light2.position.set(-10, -10, -15);
    group.add(light2);

    let time = 0;

    return {
        update: () => {
            time += 0.01;
            
            // Rotate entire crystal lattice
            group.rotation.y = time * 0.2;
            group.rotation.x = Math.sin(time * 0.1) * 0.2;
            group.rotation.z = Math.cos(time * 0.15) * 0.1;
            
            // Thermal vibration
            atoms.forEach((atom, i) => {
                const phase = i * 0.1;
                const vibrationScale = atom.isCenter ? 0.08 : 0.04; // Centers vibrate more
                
                atom.mesh.position.x = atom.x + Math.sin(time * 10 + phase) * vibrationScale;
                atom.mesh.position.y = atom.y + Math.cos(time * 12 + phase) * vibrationScale;
                atom.mesh.position.z = atom.z + Math.sin(time * 11 + phase) * vibrationScale;
            });
        },
        cleanup: () => {
            atomGeometry.dispose();
            atomMaterial.dispose();
            highlightMaterial.dispose();
            lineMaterial.dispose();
        }
    };
}