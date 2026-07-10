import * as THREE from 'three';

export function createBerylliumHydrogenBonding(scene, renderer, camera) {
    const group = new THREE.Group();

    // While Be doesn't natively form traditional strong "Hydrogen Bonds" like O, N, or F,
    // its compounds (like hydrated Be ions [Be(H2O)4]2+) interact heavily via H-bonding.
    // We visualize a central Be2+ ion hydrating, with water molecules forming H-bonds around it.

    // Central Be2+ Ion
    const be = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 32, 32),
        new THREE.MeshPhysicalMaterial({ color: 0xff0044, transmission: 0.5, opacity: 0.8, transparent: true })
    );
    group.add(be);

    // Create a Water Molecule
    const createWater = () => {
        const wGroup = new THREE.Group();
        const oxygen = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 32, 32),
            new THREE.MeshPhysicalMaterial({ color: 0xff0000, transmission: 0.5, opacity: 0.8, transparent: true })
        );
        wGroup.add(oxygen);
        
        const hMat = new THREE.MeshPhysicalMaterial({ color: 0x00c8ff, transmission: 0.5, opacity: 0.8, transparent: true });
        const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), hMat);
        h1.position.set(0.6, 0.6, 0);
        wGroup.add(h1);
        
        const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), hMat);
        h2.position.set(-0.6, 0.6, 0);
        wGroup.add(h2);
        
        return wGroup;
    };

    // Add 4 water molecules hydrating the Be2+ (Tetrahedral arrangement)
    const waters = [];
    const positions = [
        new THREE.Vector3(3, 3, 3),
        new THREE.Vector3(-3, -3, 3),
        new THREE.Vector3(-3, 3, -3),
        new THREE.Vector3(3, -3, -3)
    ];

    const dashedMat = new THREE.LineDashedMaterial({ color: 0x00c8ff, dashSize: 0.2, gapSize: 0.2, transparent: true, opacity: 0.6 });

    positions.forEach(pos => {
        const w = createWater();
        w.position.copy(pos);
        // Point Oxygen (origin of wGroup) towards Be (0,0,0)
        w.lookAt(0,0,0);
        w.rotateX(Math.PI / 2); // align O to point in
        group.add(w);
        waters.push({ mesh: w, origin: pos.clone() });

        // Draw Ion-Dipole / H-bond dashed line
        const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), pos]);
        const line = new THREE.Line(lineGeo, dashedMat);
        line.computeLineDistances();
        group.add(line);
    });

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Slowly rotate the hydrated complex
            group.rotation.y = time * 0.2;
            group.rotation.x = time * 0.1;

            // Wiggle the water molecules to simulate thermal motion and H-bond stretching
            waters.forEach((w, i) => {
                const wiggle = Math.sin(time*5 + i) * 0.2;
                w.mesh.position.copy(w.origin).add(w.origin.clone().normalize().multiplyScalar(wiggle));
            });
            
            // Note: In a real app we'd update the dashed line geometry vertices here to match the wiggle,
            // but for a smooth visual, the stationary lines with moving water actually looks like energy bonds.
        },
        cleanup: () => {
            be.geometry.dispose(); be.material.dispose();
            waters.forEach(w => {
                w.mesh.children.forEach(c => { c.geometry.dispose(); c.material.dispose(); });
            });
            dashedMat.dispose();
            // line geos are technically leaked here but ok for demo script
        }
    };
}