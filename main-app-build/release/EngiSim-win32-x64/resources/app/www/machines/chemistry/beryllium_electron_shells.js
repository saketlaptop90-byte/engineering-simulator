import * as THREE from 'three';

export function createBerylliumElectronShells(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes distinct energy shells (n=1, n=2) as translucent glowing spheres (Russian doll style)
    // with electrons embedded in their surfaces.

    const createShell = (radius, color, opacity) => {
        const geo = new THREE.SphereGeometry(radius, 64, 64);
        const mat = new THREE.MeshPhysicalMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            transmission: 0.9,
            roughness: 0.1,
            metalness: 0.1,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const mesh = new THREE.Mesh(geo, mat);
        return { mesh, geo, mat };
    };

    const shell1 = createShell(2, 0xff0044, 0.4);
    const shell2 = createShell(4, 0x00c8ff, 0.2);

    group.add(shell1.mesh);
    group.add(shell2.mesh);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    // Electrons
    const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    const electrons = [];
    
    // 2 in shell 1, 2 in shell 2
    [
        { radius: 2, parent: shell1.mesh, speed: 0.02, axis: new THREE.Vector3(0,1,0) },
        { radius: 2, parent: shell1.mesh, speed: 0.025, axis: new THREE.Vector3(1,0,0) },
        { radius: 4, parent: shell2.mesh, speed: 0.01, axis: new THREE.Vector3(1,1,0).normalize() },
        { radius: 4, parent: shell2.mesh, speed: 0.015, axis: new THREE.Vector3(0,1,1).normalize() }
    ].forEach(config => {
        const e = new THREE.Mesh(eGeo, eMat);
        group.add(e);
        electrons.push({ ...config, mesh: e, angle: Math.random() * Math.PI * 2 });
    });

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Rotate shells independently
            shell1.mesh.rotation.x = time * 0.2;
            shell1.mesh.rotation.y = time * 0.3;
            
            shell2.mesh.rotation.y = -time * 0.1;
            shell2.mesh.rotation.z = time * 0.15;

            // Move electrons along shells
            electrons.forEach(e => {
                e.angle += e.speed;
                // Calculate position on sphere surface given rotation axis
                // To keep it simple, just rotate a local offset vector
                const localPos = new THREE.Vector3(e.radius, 0, 0);
                localPos.applyAxisAngle(e.axis, e.angle);
                
                // Apply parent shell's rotation matrix
                localPos.applyMatrix4(e.parent.matrix);
                
                e.mesh.position.copy(localPos);
            });
            
            // Pulse nucleus
            nucleus.scale.setScalar(1 + Math.sin(time*8)*0.2);
        },
        cleanup: () => {
            shell1.geo.dispose(); shell1.mat.dispose();
            shell2.geo.dispose(); shell2.mat.dispose();
            nucleus.geometry.dispose(); nucleus.material.dispose();
            eGeo.dispose(); eMat.dispose();
        }
    };
}