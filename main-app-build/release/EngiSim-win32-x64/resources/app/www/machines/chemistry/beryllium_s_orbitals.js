import * as THREE from 'three';

export function createBerylliumSOrbitals(scene, renderer, camera) {
    const group = new THREE.Group();

    // 1s and 2s orbitals. Spherically symmetric.
    // We will render them as concentric glowing shells with cutaways so you can see inside.

    // 1s (inner)
    const geo1s = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI * 1.5); // Cutout
    const mat1s = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        transmission: 0.5,
        roughness: 0.2
    });
    const s1 = new THREE.Mesh(geo1s, mat1s);
    group.add(s1);

    // 2s (outer, has a radial node but we visualize the main outer lobe here)
    const geo2s = new THREE.SphereGeometry(4.0, 64, 64, 0, Math.PI * 1.5); // Cutout
    const mat2s = new THREE.MeshPhysicalMaterial({
        color: 0x00c8ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        transmission: 0.9,
        roughness: 0.1
    });
    const s2 = new THREE.Mesh(geo2s, mat2s);
    group.add(s2);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);
    
    // Add glowing grid on the cutout edges to highlight the cross section
    const edgeGeo1s = new THREE.EdgesGeometry(geo1s);
    const edgeMat1s = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, transparent: true, opacity: 0.5 });
    s1.add(new THREE.LineSegments(edgeGeo1s, edgeMat1s));

    const edgeGeo2s = new THREE.EdgesGeometry(geo2s);
    const edgeMat2s = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, transparent: true, opacity: 0.3 });
    s2.add(new THREE.LineSegments(edgeGeo2s, edgeMat2s));

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Rotate the orbitals slowly to show off the 3D cutout
            s1.rotation.y = time * 0.2;
            s1.rotation.x = Math.sin(time * 0.3) * 0.2;

            s2.rotation.y = time * 0.15;
            s2.rotation.x = Math.sin(time * 0.4) * 0.1;
            
            // Pulse opacity
            mat1s.opacity = 0.6 + Math.sin(time * 3) * 0.1;
            mat2s.opacity = 0.25 + Math.cos(time * 2) * 0.05;
        },
        cleanup: () => {
            geo1s.dispose(); mat1s.dispose();
            geo2s.dispose(); mat2s.dispose();
            edgeGeo1s.dispose(); edgeMat1s.dispose();
            edgeGeo2s.dispose(); edgeMat2s.dispose();
            nucleus.geometry.dispose(); nucleus.material.dispose();
        }
    };
}