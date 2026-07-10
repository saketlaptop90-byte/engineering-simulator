import * as THREE from 'three';

export function createBerylliumSubshells(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes splitting of energy levels into subshells (s, p, d, f)
    // For Be (n=2), we show 2s and 2p splitting due to electron penetration

    const createSubshell = (radius, yPos, color, isPopulated) => {
        const geo = new THREE.TorusGeometry(radius, 0.1, 16, 64);
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: isPopulated ? 0.8 : 0.2
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = yPos;
        group.add(mesh);
        return { mesh, radius, yPos, isPopulated };
    };

    const subshells = [];
    
    // n=1
    subshells.push(createSubshell(2, -4, 0xff0044, true));  // 1s
    
    // n=2 splitting
    subshells.push(createSubshell(4, 0, 0x00c8ff, true));   // 2s (lower energy)
    subshells.push(createSubshell(4, 1.5, 0x8888ff, false)); // 2p (higher energy, empty)

    // n=3 splitting
    subshells.push(createSubshell(6, 4, 0x888888, false));   // 3s
    subshells.push(createSubshell(6, 4.8, 0x777777, false)); // 3p
    subshells.push(createSubshell(6, 5.6, 0x666666, false)); // 3d

    // Connectors showing splitting
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    
    // 2s to 2p connection
    const l1Geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(4, 0, 0), new THREE.Vector3(4, 1.5, 0)]);
    group.add(new THREE.Line(l1Geo, lineMat));
    const l2Geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4, 0, 0), new THREE.Vector3(-4, 1.5, 0)]);
    group.add(new THREE.Line(l2Geo, lineMat));

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    nucleus.position.y = -6;
    group.add(nucleus);

    // Electrons in 1s and 2s
    const eGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const electrons = [];

    [
        { sub: subshells[0], angle: 0 },
        { sub: subshells[0], angle: Math.PI },
        { sub: subshells[1], angle: Math.PI / 2 },
        { sub: subshells[1], angle: -Math.PI / 2 }
    ].forEach(c => {
        const e = new THREE.Mesh(eGeo, eMat);
        group.add(e);
        electrons.push({
            mesh: e,
            sub: c.sub,
            angle: c.angle,
            speed: 0.03 - (c.sub.radius * 0.003)
        });
    });

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            electrons.forEach(e => {
                e.angle += e.speed;
                e.mesh.position.set(
                    Math.cos(e.angle) * e.sub.radius,
                    e.sub.yPos,
                    Math.sin(e.angle) * e.sub.radius
                );
            });
            
            group.rotation.y = time * 0.2;
            group.rotation.x = Math.sin(time*0.5) * 0.1 + 0.1;
        },
        cleanup: () => {
            subshells.forEach(s => { s.mesh.geometry.dispose(); s.mesh.material.dispose(); });
            nucleus.geometry.dispose(); nucleus.material.dispose();
            eGeo.dispose(); eMat.dispose();
            l1Geo.dispose(); l2Geo.dispose(); lineMat.dispose();
        }
    };
}