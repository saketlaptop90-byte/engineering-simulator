import * as THREE from 'three';

export function createBerylliumAtomicStructure(scene, renderer, camera) {
    const group = new THREE.Group();

    // Beryllium: 4 Protons, 5 Neutrons, 4 Electrons

    // Nucleus
    const nucleusGroup = new THREE.Group();
    group.add(nucleusGroup);

    const protonGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const neutronGeo = new THREE.SphereGeometry(0.3, 32, 32);
    
    const protonMat = new THREE.MeshPhysicalMaterial({
        color: 0xff1144,
        emissive: 0x440011,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0
    });
    
    const neutronMat = new THREE.MeshPhysicalMaterial({
        color: 0x1144ff,
        emissive: 0x001144,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0
    });

    const nucleons = [];
    
    // 4 Protons
    for(let i=0; i<4; i++) {
        const p = new THREE.Mesh(protonGeo, protonMat);
        p.position.set(
            (Math.random()-0.5)*0.8,
            (Math.random()-0.5)*0.8,
            (Math.random()-0.5)*0.8
        );
        nucleusGroup.add(p);
        nucleons.push({ mesh: p, start: p.position.clone() });
    }
    
    // 5 Neutrons
    for(let i=0; i<5; i++) {
        const n = new THREE.Mesh(neutronGeo, neutronMat);
        n.position.set(
            (Math.random()-0.5)*0.8,
            (Math.random()-0.5)*0.8,
            (Math.random()-0.5)*0.8
        );
        nucleusGroup.add(n);
        nucleons.push({ mesh: n, start: n.position.clone() });
    }

    // Electron Orbits
    const electronGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const electronMat = new THREE.MeshPhysicalMaterial({
        color: 0xffff00,
        emissive: 0x444400,
        roughness: 0.1,
        metalness: 0.8
    });

    const electrons = [];
    
    // n=1 shell (2 electrons)
    const n1Radius = 2.5;
    const n1OrbitGeo = new THREE.TorusGeometry(n1Radius, 0.02, 16, 100);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    
    const n1Orbit1 = new THREE.Mesh(n1OrbitGeo, orbitMat);
    n1Orbit1.rotation.x = Math.PI / 2;
    group.add(n1Orbit1);

    const n1Orbit2 = new THREE.Mesh(n1OrbitGeo, orbitMat);
    n1Orbit2.rotation.y = Math.PI / 2;
    group.add(n1Orbit2);
    
    for(let i=0; i<2; i++) {
        const e = new THREE.Mesh(electronGeo, electronMat);
        group.add(e);
        electrons.push({
            mesh: e,
            radius: n1Radius,
            speed: 0.04 + Math.random()*0.01,
            angle: Math.random() * Math.PI * 2,
            axis: i === 0 ? 'y' : 'x'
        });
    }

    // n=2 shell (2 electrons)
    const n2Radius = 5.0;
    const n2Orbit1 = new THREE.Mesh(new THREE.TorusGeometry(n2Radius, 0.02, 16, 100), orbitMat);
    n2Orbit1.rotation.x = Math.PI / 4;
    n2Orbit1.rotation.y = Math.PI / 4;
    group.add(n2Orbit1);

    const n2Orbit2 = new THREE.Mesh(new THREE.TorusGeometry(n2Radius, 0.02, 16, 100), orbitMat);
    n2Orbit2.rotation.x = -Math.PI / 4;
    n2Orbit2.rotation.y = Math.PI / 4;
    group.add(n2Orbit2);

    for(let i=0; i<2; i++) {
        const e = new THREE.Mesh(electronGeo, electronMat);
        group.add(e);
        const orbit = i === 0 ? n2Orbit1 : n2Orbit2;
        electrons.push({
            mesh: e,
            radius: n2Radius,
            speed: 0.02 + Math.random()*0.005,
            angle: Math.random() * Math.PI * 2,
            orbitMesh: orbit
        });
    }

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 2, 20);
    group.add(pointLight);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Nucleon jitter
            nucleons.forEach((n, i) => {
                n.mesh.position.x = n.start.x + Math.sin(time*10 + i)*0.05;
                n.mesh.position.y = n.start.y + Math.cos(time*11 + i)*0.05;
                n.mesh.position.z = n.start.z + Math.sin(time*12 + i)*0.05;
            });
            nucleusGroup.rotation.y = time * 0.2;
            nucleusGroup.rotation.x = time * 0.1;

            // Electron orbit
            electrons.forEach(e => {
                e.angle += e.speed;
                if (e.axis === 'y') {
                    e.mesh.position.set(Math.cos(e.angle)*e.radius, 0, Math.sin(e.angle)*e.radius);
                } else if (e.axis === 'x') {
                    e.mesh.position.set(0, Math.cos(e.angle)*e.radius, Math.sin(e.angle)*e.radius);
                } else if (e.orbitMesh) {
                    // Get local position on torus
                    const localPos = new THREE.Vector3(Math.cos(e.angle)*e.radius, Math.sin(e.angle)*e.radius, 0);
                    // Apply orbit mesh rotation to get global position
                    localPos.applyEuler(e.orbitMesh.rotation);
                    e.mesh.position.copy(localPos);
                }
            });
            
            // Slow scene rotation
            group.rotation.y = time * 0.1;
        },
        cleanup: () => {
            protonGeo.dispose();
            neutronGeo.dispose();
            protonMat.dispose();
            neutronMat.dispose();
            electronGeo.dispose();
            electronMat.dispose();
            n1OrbitGeo.dispose();
            orbitMat.dispose();
            n2Orbit1.geometry.dispose();
            n2Orbit2.geometry.dispose();
        }
    };
}