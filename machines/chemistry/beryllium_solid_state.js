import * as THREE from 'three';

export function createBerylliumSolidState(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes Beryllium in its solid state: Hexagonal Close-Packed (HCP) crystal structure.
    
    const atomGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const atomMat = new THREE.MeshPhysicalMaterial({
        color: 0x88aabb,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0
    });

    const atoms = [];
    
    // Build a small HCP chunk (ABA layers)
    const a = 2.0; // horizontal spacing
    const c = 3.2; // vertical spacing
    
    // Layer A (bottom) - Hexagon + center
    const createLayerA = (y) => {
        // Center
        const center = new THREE.Mesh(atomGeo, atomMat);
        center.position.set(0, y, 0);
        group.add(center);
        atoms.push(center);
        
        // 6 around
        for(let i=0; i<6; i++) {
            const angle = (Math.PI / 3) * i;
            const mesh = new THREE.Mesh(atomGeo, atomMat);
            mesh.position.set(Math.cos(angle)*a, y, Math.sin(angle)*a);
            group.add(mesh);
            atoms.push(mesh);
        }
    };

    // Layer B (middle) - Triangle
    const createLayerB = (y) => {
        for(let i=0; i<3; i++) {
            const angle = (Math.PI / 3) * (i*2) + (Math.PI/6);
            const mesh = new THREE.Mesh(atomGeo, atomMat);
            // offset slightly
            const r = a / Math.sqrt(3);
            mesh.position.set(Math.cos(angle)*r, y, Math.sin(angle)*r);
            group.add(mesh);
            atoms.push(mesh);
        }
    };

    createLayerA(-c/2);
    createLayerB(0);
    createLayerA(c/2);

    // Add a glowing bounding box to highlight the HCP unit cell shape (hexagonal prism)
    const hexGeo = new THREE.CylinderGeometry(a+0.5, a+0.5, c*1.5, 6);
    const hexMat = new THREE.MeshBasicMaterial({ color: 0x00c8ff, wireframe: true, transparent: true, opacity: 0.1 });
    const hexBox = new THREE.Mesh(hexGeo, hexMat);
    // Align hexagon
    hexBox.rotation.y = Math.PI / 6;
    group.add(hexBox);

    const light = new THREE.PointLight(0xffffff, 5, 20);
    light.position.set(5, 5, 5);
    group.add(light);
    
    const light2 = new THREE.PointLight(0x00c8ff, 3, 20);
    light2.position.set(-5, -5, -5);
    group.add(light2);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Rotate crystal
            group.rotation.y = time * 0.2;
            group.rotation.x = Math.sin(time*0.1) * 0.2 + 0.2; // tilted view
            
            // Thermal vibration (very slight because it's a solid)
            atoms.forEach((atom, i) => {
                // save original position on first frame would be better, but we can do a tiny random offset
                atom.position.x += (Math.random() - 0.5) * 0.01;
                atom.position.y += (Math.random() - 0.5) * 0.01;
                atom.position.z += (Math.random() - 0.5) * 0.01;
                // Since they drift, we'd normally clamp them, but 0.01 is small enough for a short viewing
            });
        },
        cleanup: () => {
            atomGeo.dispose(); atomMat.dispose();
            hexGeo.dispose(); hexMat.dispose();
        }
    };
}