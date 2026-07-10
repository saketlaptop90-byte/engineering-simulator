import * as THREE from 'three';

export function createBerylliumEnergyLevels(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes discrete energy levels (n=1, n=2, n=3...) as glowing platforms or rings
    // For Be (Z=4), n=1 and n=2 are populated.

    const createLevel = (radius, height, color, label, isPopulated) => {
        const geo = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 64);
        const mat = new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: isPopulated ? 0.6 : 0.1,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = height;
        
        // Add a glowing grid texture effect (using wireframe overlay)
        const wireGeo = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 32, 4);
        const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: isPopulated ? 0.3 : 0.05 });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        wireMesh.rotation.x = -Math.PI / 2;
        wireMesh.position.y = height + 0.01; // slight offset
        
        group.add(mesh);
        group.add(wireMesh);
        
        return { mesh, wireMesh, radius, height, isPopulated };
    };

    const levels = [];
    // Energy spacing gets closer as n increases (E ~ -1/n^2)
    levels.push(createLevel(3, -4, 0xff0044, 'n=1', true));
    levels.push(createLevel(5, -1, 0x00c8ff, 'n=2', true));
    levels.push(createLevel(7, 0.5, 0x888888, 'n=3', false));
    levels.push(createLevel(9, 1.25, 0x555555, 'n=4', false));

    // Nucleus at the bottom
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    nucleus.position.y = -6;
    group.add(nucleus);

    // Electrons jumping around in populated levels
    const eGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    const electrons = [];
    
    // 2 in n=1, 2 in n=2
    const configs = [
        { levelIdx: 0, angle: 0 },
        { levelIdx: 0, angle: Math.PI },
        { levelIdx: 1, angle: Math.PI / 2 },
        { levelIdx: 1, angle: -Math.PI / 2 }
    ];
    
    configs.forEach(c => {
        const e = new THREE.Mesh(eGeo, eMat);
        group.add(e);
        electrons.push({
            mesh: e,
            levelIdx: c.levelIdx,
            angle: c.angle,
            speed: 0.02 - (c.levelIdx * 0.005)
        });
    });

    // Central energy axis (dashed line)
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -6, 0),
        new THREE.Vector3(0, 3, 0)
    ]);
    const axisMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.2, gapSize: 0.2 });
    const axis = new THREE.Line(axisGeo, axisMat);
    axis.computeLineDistances();
    group.add(axis);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            levels.forEach((l, i) => {
                l.mesh.rotation.z = time * 0.1 * (i % 2 === 0 ? 1 : -1);
                l.wireMesh.rotation.z = time * 0.1 * (i % 2 === 0 ? 1 : -1);
                
                if (l.isPopulated) {
                    l.mesh.material.opacity = 0.5 + Math.sin(time * 3 + i) * 0.1;
                }
            });

            electrons.forEach(e => {
                e.angle += e.speed;
                const l = levels[e.levelIdx];
                e.mesh.position.set(
                    Math.cos(e.angle) * l.radius,
                    l.height + Math.sin(time*10 + e.angle)*0.2, // bobbing up and down
                    Math.sin(e.angle) * l.radius
                );
            });
            
            group.rotation.y = time * 0.05;
            group.rotation.x = 0.2 + Math.sin(time * 0.2) * 0.1;
        },
        cleanup: () => {
            levels.forEach(l => {
                l.mesh.geometry.dispose();
                l.mesh.material.dispose();
                l.wireMesh.geometry.dispose();
                l.wireMesh.material.dispose();
            });
            nucleus.geometry.dispose();
            nucleus.material.dispose();
            eGeo.dispose();
            eMat.dispose();
            axisGeo.dispose();
            axisMat.dispose();
        }
    };
}