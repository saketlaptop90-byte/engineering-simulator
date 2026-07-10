import * as THREE from 'three';

export function createBerylliumElectronElectronRepulsion(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes Coulomb repulsion between electrons
    // Shows repelling force vectors between orbiting electrons

    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    const electronGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    
    const electrons = [];
    
    // Distribute 4 electrons roughly
    const radii = [2, 2, 4, 4];
    for (let i=0; i<4; i++) {
        const e = new THREE.Mesh(electronGeo, electronMat);
        group.add(e);
        electrons.push({
            mesh: e,
            r: radii[i],
            angle: (Math.PI / 2) * i,
            speed: 0.01 + (1/radii[i])*0.01,
            euler: new THREE.Euler(Math.random(), Math.random(), Math.random()),
            pos: new THREE.Vector3()
        });
    }

    // Array to hold repulsion arrows between all pairs
    const repulsionArrows = [];
    for(let i=0; i<electrons.length; i++) {
        for(let j=i+1; j<electrons.length; j++) {
            const arrow = new THREE.ArrowHelper(
                new THREE.Vector3(1,0,0),
                new THREE.Vector3(0,0,0),
                1,
                0xff0000,
                0.3,
                0.15
            );
            arrow.line.material.transparent = true;
            arrow.line.material.opacity = 0.5;
            group.add(arrow);
            repulsionArrows.push({ arrow, i, j });
        }
    }

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Update electron positions
            electrons.forEach(e => {
                e.angle += e.speed;
                const localPos = new THREE.Vector3(Math.cos(e.angle)*e.r, Math.sin(e.angle)*e.r, 0);
                localPos.applyEuler(e.euler);
                e.mesh.position.copy(localPos);
                e.pos.copy(localPos);
            });

            // Update repulsion arrows
            repulsionArrows.forEach(ra => {
                const e1 = electrons[ra.i];
                const e2 = electrons[ra.j];
                
                // Vector from e1 to e2
                const dir = new THREE.Vector3().subVectors(e2.pos, e1.pos);
                const dist = dir.length();
                dir.normalize();
                
                // Draw arrow from midpoint pushing outwards to visualize repulsion
                const midpoint = new THREE.Vector3().addVectors(e1.pos, e2.pos).multiplyScalar(0.5);
                
                // The closer they are, the stronger the repulsion (longer arrow)
                const force = Math.max(0.2, 3.0 / (dist * dist)); 
                
                // Actually, let's draw two arrows from each electron pushing away from each other
                // But ArrowHelper is just one arrow. Let's make it point from midpoint towards e1
                // and scale it by force.
                ra.arrow.position.copy(midpoint);
                ra.arrow.setDirection(dir.clone().negate()); // point towards e1
                ra.arrow.setLength(force, 0.2, 0.1);
                
                // Color intensity based on force
                const intensity = Math.min(1.0, force * 0.5);
                ra.arrow.line.material.color.setHSL(0.0, 1.0, 0.5 + intensity * 0.5);
            });

            group.rotation.y = time * 0.1;
        },
        cleanup: () => {
            nucleus.geometry.dispose();
            nucleus.material.dispose();
            electronGeo.dispose();
            electronMat.dispose();
            repulsionArrows.forEach(ra => {
                ra.arrow.line.geometry.dispose();
                ra.arrow.cone.geometry.dispose();
            });
        }
    };
}