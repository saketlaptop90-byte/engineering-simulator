import * as THREE from 'three';

export function createBerylliumElectronSpin(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes electron spin (up and down) and their associated magnetic fields
    // Represents two electrons in the same orbital (e.g., 2s)

    const eGeo = new THREE.SphereGeometry(0.8, 32, 32);
    
    // Electron 1 (Spin Up)
    const e1Mat = new THREE.MeshPhongMaterial({ color: 0xff0044, shininess: 100 });
    const e1 = new THREE.Mesh(eGeo, e1Mat);
    e1.position.set(-2, 0, 0);
    group.add(e1);

    // Electron 2 (Spin Down)
    const e2Mat = new THREE.MeshPhongMaterial({ color: 0x0044ff, shininess: 100 });
    const e2 = new THREE.Mesh(eGeo, e2Mat);
    e2.position.set(2, 0, 0);
    group.add(e2);

    // Magnetic Field Lines (Torus)
    const createFieldLines = (parent, direction) => {
        const fieldGroup = new THREE.Group();
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, wireframe: true });
        
        for (let r = 1.2; r < 3.0; r += 0.4) {
            const geo = new THREE.TorusGeometry(r, 0.05, 8, 32);
            const mesh = new THREE.Mesh(geo, lineMat);
            // Orient torus so field loops from top to bottom
            mesh.rotation.y = Math.PI / 2;
            fieldGroup.add(mesh);
        }
        
        // Add an arrow through the center showing spin axis
        const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, direction, 0),
            new THREE.Vector3(0, -1.5 * direction, 0),
            3,
            0xffff00,
            0.5,
            0.3
        );
        fieldGroup.add(arrow);
        
        parent.add(fieldGroup);
        return fieldGroup;
    };

    const f1 = createFieldLines(e1, 1);  // Spin Up
    const f2 = createFieldLines(e2, -1); // Spin Down

    const light = new THREE.PointLight(0xffffff, 2, 20);
    light.position.set(0, 5, 5);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Physical rotation of electrons
            e1.rotation.y = time * 5.0;  // rapid spin
            e2.rotation.y = -time * 5.0; // opposite spin
            
            // Animate field lines flowing
            f1.children.forEach((child, i) => {
                if(child.isMesh) {
                    child.rotation.x = time * 2.0; // flow effect
                }
            });
            
            f2.children.forEach((child, i) => {
                if(child.isMesh) {
                    child.rotation.x = -time * 2.0; // opposite flow
                }
            });

            group.rotation.y = time * 0.2;
        },
        cleanup: () => {
            eGeo.dispose();
            e1Mat.dispose(); e2Mat.dispose();
            // Complex traversal for field lines
            group.traverse(c => {
                if(c.geometry) c.geometry.dispose();
                if(c.material) c.material.dispose();
            });
        }
    };
}