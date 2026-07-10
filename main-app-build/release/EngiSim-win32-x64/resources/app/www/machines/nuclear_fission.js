import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Nucleus materials
    const protonMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.3 });
    const neutronMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3 });
    const pGeom = new THREE.SphereGeometry(0.5, 16, 16);

    // Create a Uranium-235 nucleus (simplified cluster)
    const nucleus = new THREE.Group();
    group.add(nucleus);

    const particles = [];
    const numNucleons = 60; // visual representation, 235 is too many for clarity
    
    for(let i=0; i<numNucleons; i++){
        const isProton = Math.random() > 0.5;
        const mesh = new THREE.Mesh(pGeom, isProton ? protonMat : neutronMat);
        
        // Pack into a sphere
        const r = 2 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        mesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        nucleus.add(mesh);
        particles.push({ mesh, originalPos: mesh.position.clone() });
    }

    // Incoming Neutron
    const incNeutron = new THREE.Mesh(pGeom, neutronMat);
    incNeutron.position.set(-15, 0, 0);
    group.add(incNeutron);
    
    // Labels
    const createLabel = (text, pos, color) => {
        const lcan = document.createElement('canvas');
        lcan.width = 256; lcan.height = 64;
        const lctx = lcan.getContext('2d');
        lctx.fillStyle = color;
        lctx.font = 'bold 24px Arial';
        lctx.textAlign = 'center';
        lctx.fillText(text, 128, 40);
        
        const tex = new THREE.CanvasTexture(lcan);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(3, 0.75, 1);
        group.add(sprite);
        return sprite;
    };

    const lblU235 = createLabel("Uranium-235", new THREE.Vector3(0, 4, 0), "white");
    const lblNeutron = createLabel("Neutron", new THREE.Vector3(-15, 2, 0), "white");
    
    // Energy Flash
    const flashGeom = new THREE.SphereGeometry(1, 32, 32);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const flash = new THREE.Mesh(flashGeom, flashMat);
    group.add(flash);

    let state = 0; // 0: incoming, 1: oscillating, 2: fissioned
    let timer = 0;
    
    // Fission fragments
    const frag1 = new THREE.Group();
    const frag2 = new THREE.Group();
    const freeNeutrons = [];

    group.userData.animate = (delta) => {
        if(state === 0) {
            // Incoming neutron
            incNeutron.position.x += 10 * delta;
            lblNeutron.position.x = incNeutron.position.x;
            
            if(incNeutron.position.x >= -1.5) {
                // Absorption -> U-236
                state = 1;
                timer = 0;
                group.remove(incNeutron);
                group.remove(lblNeutron);
                lblU235.material.map.image.getContext('2d').clearRect(0,0,256,64);
                lblU235.material.map.image.getContext('2d').fillText("Uranium-236 (Unstable)", 128, 40);
                lblU235.material.map.needsUpdate = true;
                lblU235.material.color.setHex(0xffaa00);
            }
        } else if (state === 1) {
            // Oscillation (liquid drop model)
            timer += delta;
            
            // Stretch along X axis, compress along Y/Z
            const stretch = 1 + Math.sin(timer * 10) * 0.5 * (timer/1.5);
            const compress = 1 / Math.sqrt(stretch);
            nucleus.scale.set(stretch, compress, compress);
            
            if (timer > 1.5) {
                // Split!
                state = 2;
                timer = 0;
                group.remove(nucleus);
                group.remove(lblU235);
                
                // Distribute particles into fragments
                particles.forEach((p, idx) => {
                    p.mesh.position.copy(p.originalPos);
                    p.mesh.scale.set(1,1,1);
                    if(idx < numNucleons/2 - 1) {
                        frag1.add(p.mesh);
                    } else if (idx < numNucleons - 3) {
                        frag2.add(p.mesh);
                    } else {
                        // Free neutrons
                        const n = new THREE.Mesh(pGeom, neutronMat);
                        n.userData.vel = new THREE.Vector3((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20);
                        group.add(n);
                        freeNeutrons.push(n);
                    }
                });
                
                group.add(frag1);
                group.add(frag2);
                
                // Flash
                flash.material.opacity = 1;
                flash.scale.set(10,10,10);
                
                createLabel("Kr-92", new THREE.Vector3(-3, 3, 0), "cyan");
                createLabel("Ba-141", new THREE.Vector3(3, 3, 0), "cyan");
                createLabel("Energy!", new THREE.Vector3(0, -3, 0), "yellow");
            }
        } else if (state === 2) {
            // Fragments fly apart
            frag1.position.x -= 8 * delta;
            frag2.position.x += 8 * delta;
            
            freeNeutrons.forEach(n => {
                n.position.addScaledVector(n.userData.vel, delta);
            });
            
            if (flash.material.opacity > 0) {
                flash.material.opacity -= delta;
                flash.scale.addScalar(delta * 20);
            }
            
            timer += delta;
            if(timer > 4) {
                // Reset
                state = 0;
                timer = 0;
                
                group.remove(frag1);
                group.remove(frag2);
                freeNeutrons.forEach(n => group.remove(n));
                freeNeutrons.length = 0;
                
                // Rebuild nucleus
                group.add(nucleus);
                nucleus.scale.set(1,1,1);
                particles.forEach(p => nucleus.add(p.mesh));
                
                incNeutron.position.set(-15, 0, 0);
                group.add(incNeutron);
                group.add(lblNeutron);
                
                group.add(lblU235);
                lblU235.material.color.setHex(0xffffff);
                lblU235.material.map.image.getContext('2d').clearRect(0,0,256,64);
                lblU235.material.map.image.getContext('2d').fillStyle = 'white';
                lblU235.material.map.image.getContext('2d').fillText("Uranium-235", 128, 40);
                lblU235.material.map.needsUpdate = true;
            }
        }
    };

    return group;
}
