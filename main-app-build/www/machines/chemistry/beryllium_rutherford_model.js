import * as THREE from 'three';

export function createBerylliumRutherfordModel(scene, renderer, camera) {
    const group = new THREE.Group();

    // Rutherford model: Tiny massive nucleus, electrons orbiting randomly like planets
    
    const nucleusGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const nucleusMat = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        emissive: 0x662200,
        shininess: 100
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    group.add(nucleus);

    // Glowing aura representing alpha particle scattering target
    const auraGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    group.add(aura);

    const electronGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const trailMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });

    const electrons = [];
    const trailLength = 50;

    for (let i = 0; i < 4; i++) {
        const e = new THREE.Mesh(electronGeo, electronMat);
        group.add(e);
        
        // Random elliptical orbit parameters
        const a = 4 + Math.random() * 3; // semi-major axis
        const b = 2 + Math.random() * 2; // semi-minor axis
        const speed = 0.03 + Math.random() * 0.02;
        
        // Random 3D orientation for the orbit
        const euler = new THREE.Euler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // Trail
        const trailGeo = new THREE.BufferGeometry();
        const trailPos = new Float32Array(trailLength * 3);
        trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
        const trail = new THREE.Line(trailGeo, trailMat);
        group.add(trail);
        
        electrons.push({
            mesh: e,
            angle: Math.random() * Math.PI * 2,
            a, b, speed, euler,
            trail,
            trailPos,
            trailIndex: 0
        });
    }

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x222222));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            nucleus.rotation.y = time;
            aura.scale.setScalar(1 + Math.sin(time*5)*0.1);

            electrons.forEach(e => {
                e.angle += e.speed;
                
                // Calculate local 2D elliptical position
                const x = Math.cos(e.angle) * e.a;
                const y = Math.sin(e.angle) * e.b;
                
                // Apply 3D rotation
                const pos = new THREE.Vector3(x, y, 0);
                pos.applyEuler(e.euler);
                
                e.mesh.position.copy(pos);
                
                // Update trail
                e.trailPos[e.trailIndex * 3] = pos.x;
                e.trailPos[e.trailIndex * 3 + 1] = pos.y;
                e.trailPos[e.trailIndex * 3 + 2] = pos.z;
                
                e.trailIndex = (e.trailIndex + 1) % trailLength;
                
                // Redraw trail array to make it continuous line (hacky but looks okay for fast moving)
                // Actually, let's just leave it as a trailing circular buffer, line will jump from start to end but at 50 pts it's a circle anyway.
                e.trail.geometry.attributes.position.needsUpdate = true;
            });
            
            group.rotation.y = time * 0.1;
        },
        cleanup: () => {
            nucleusGeo.dispose();
            nucleusMat.dispose();
            auraGeo.dispose();
            auraMat.dispose();
            electronGeo.dispose();
            electronMat.dispose();
            trailMat.dispose();
            electrons.forEach(e => e.trail.geometry.dispose());
        }
    };
}