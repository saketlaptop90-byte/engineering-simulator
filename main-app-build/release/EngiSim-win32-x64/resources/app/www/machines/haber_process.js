import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xaaccff, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1 });
    const catalystMat = new THREE.MeshStandardMaterial({ color: 0x442211, roughness: 0.9 }); // Iron catalyst

    // Reactor Vessel
    const reactorGeom = new THREE.CylinderGeometry(2, 2, 6, 32);
    const reactor = new THREE.Mesh(reactorGeom, glassMat);
    group.add(reactor);

    // Catalyst Beds
    const createBed = (y) => {
        const bedGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.5, 32);
        const bed = new THREE.Mesh(bedGeom, catalystMat);
        bed.position.y = y;
        group.add(bed);
    };
    createBed(1.5);
    createBed(0);
    createBed(-1.5);

    // Inlets (N2 and H2)
    const pipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    
    const n2Inlet = new THREE.Mesh(pipeGeom, metalMat);
    n2Inlet.rotation.z = Math.PI / 2;
    n2Inlet.position.set(-3, 2.5, 0);
    group.add(n2Inlet);
    
    const h2Inlet = new THREE.Mesh(pipeGeom, metalMat);
    h2Inlet.rotation.z = Math.PI / 2;
    h2Inlet.position.set(3, 2.5, 0);
    group.add(h2Inlet);

    // Outlet (NH3)
    const nh3Outlet = new THREE.Mesh(pipeGeom, metalMat);
    nh3Outlet.position.set(0, -4, 0);
    group.add(nh3Outlet);

    // Text labels
    const createLabel = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 40);
        
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(2, 0.5, 1);
        group.add(sprite);
    };

    createLabel("N2 (Nitrogen)", new THREE.Vector3(-4.5, 3, 0), "#aaaaff");
    createLabel("H2 (Hydrogen)", new THREE.Vector3(4.5, 3, 0), "#ffaaaa");
    createLabel("Fe Catalyst Beds", new THREE.Vector3(3, 0, 0), "white");
    createLabel("NH3 (Ammonia)", new THREE.Vector3(0, -5.5, 0), "#aaffaa");

    // Particles
    const particles = new THREE.Group();
    group.add(particles);

    const n2Mat = new THREE.MeshBasicMaterial({ color: 0xaaaaff });
    const h2Mat = new THREE.MeshBasicMaterial({ color: 0xffaaaa });
    const nh3Mat = new THREE.MeshBasicMaterial({ color: 0xaaffaa });

    const createMolecule = (mat, radius) => {
        const geom = new THREE.SphereGeometry(radius, 8, 8);
        return new THREE.Mesh(geom, mat);
    };

    const particleList = [];
    let emitTimer = 0;

    group.userData.animate = (delta) => {
        emitTimer += delta;
        if (emitTimer > 0.1) {
            emitTimer = 0;
            // Spawn N2
            const n2 = createMolecule(n2Mat, 0.15);
            n2.position.set(-4, 2.5, (Math.random()-0.5));
            n2.userData = { type: 'N2', vx: 2, vy: 0, active: true };
            particles.add(n2);
            particleList.push(n2);

            // Spawn H2 (3x as much)
            for (let i = 0; i < 3; i++) {
                const h2 = createMolecule(h2Mat, 0.1);
                h2.position.set(4, 2.5 + (Math.random()-0.5)*0.2, (Math.random()-0.5));
                h2.userData = { type: 'H2', vx: -2, vy: 0, active: true };
                particles.add(h2);
                particleList.push(h2);
            }
        }

        for (let i = particleList.length - 1; i >= 0; i--) {
            const p = particleList[i];
            
            if (p.userData.type === 'N2' || p.userData.type === 'H2') {
                if (Math.abs(p.position.x) > 1 && p.position.y > 2) {
                    p.position.x += p.userData.vx * delta;
                } else {
                    p.position.y -= 1.5 * delta;
                    p.position.x += (Math.random() - 0.5) * 5 * delta; // chaotic mixing
                }
                
                // Reaction (probability when passing through catalyst beds)
                if (p.position.y < 2 && p.position.y > -2 && Math.random() < 0.05) {
                    p.userData.type = 'NH3';
                    p.material = nh3Mat;
                    p.scale.set(1.5, 1.5, 1.5);
                }
            } else if (p.userData.type === 'NH3') {
                p.position.y -= 2 * delta;
                // funnel to outlet
                p.position.x *= 0.95;
            }
            
            // Remove when reaching bottom
            if (p.position.y < -5) {
                particles.remove(p);
                particleList.splice(i, 1);
            }
        }
    };

    return group;
}
