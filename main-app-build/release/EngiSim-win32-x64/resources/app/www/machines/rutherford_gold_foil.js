import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Alpha Particle Emitter (Lead box)
    const boxGeom = new THREE.BoxGeometry(2, 2, 2);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.5 });
    const emitter = new THREE.Mesh(boxGeom, boxMat);
    emitter.position.set(-10, 0, 0);
    group.add(emitter);
    
    // Slit
    const slitGeom = new THREE.BoxGeometry(0.1, 4, 4);
    const slitMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const slit = new THREE.Mesh(slitGeom, slitMat);
    slit.position.set(-6, 0, 0);
    group.add(slit);
    
    const slitHoleGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
    slitHoleGeom.rotateZ(Math.PI/2);
    const slitHole = new THREE.Mesh(slitHoleGeom, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    slitHole.position.set(-6, 0, 0);
    group.add(slitHole);

    // Gold Foil (Magnified view of a few atoms)
    const foilGroup = new THREE.Group();
    group.add(foilGroup);
    
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2, emissive: 0x332200 });
    const nucleusGeom = new THREE.SphereGeometry(0.5, 16, 16);
    
    const nucleiPositions = [
        new THREE.Vector3(0, 2, 0),
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(0, 0, 2),
        new THREE.Vector3(0, 0, -2),
        new THREE.Vector3(0, 0, 0)
    ];
    
    nucleiPositions.forEach(pos => {
        const nucleus = new THREE.Mesh(nucleusGeom, goldMat);
        nucleus.position.copy(pos);
        foilGroup.add(nucleus);
        
        // Electron cloud visualization (probabilistic)
        const cloudGeom = new THREE.SphereGeometry(2, 16, 16);
        const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.05, wireframe: true });
        const cloud = new THREE.Mesh(cloudGeom, cloudMat);
        cloud.position.copy(pos);
        foilGroup.add(cloud);
    });

    // Circular Detector Screen
    const detectorGeom = new THREE.CylinderGeometry(8, 8, 2, 64, 1, true, Math.PI/2 - 0.2, Math.PI*2 - Math.PI + 0.4);
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x99ff99, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const detector = new THREE.Mesh(detectorGeom, detectorMat);
    detector.rotation.x = Math.PI / 2; // Flat circle around the origin
    group.add(detector);

    // Alpha Particles
    const pGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    const alphaGroup = new THREE.Group();
    group.add(alphaGroup);
    
    const particles = [];
    let emitTimer = 0;

    // Labels
    const createLabel = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 40);
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(3, 0.75, 1);
        group.add(sprite);
    };

    createLabel("Alpha Source (Radium)", new THREE.Vector3(-10, 3, 0), "white");
    createLabel("Gold Nuclei", new THREE.Vector3(0, 5, 0), "gold");
    createLabel("Zinc Sulfide Screen", new THREE.Vector3(8, 3, 0), "lightgreen");

    // Scintillation flashes
    const flashes = [];
    const fGeom = new THREE.PlaneGeometry(0.5, 0.5);
    const fMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1, side: THREE.DoubleSide });

    group.userData.animate = (delta) => {
        emitTimer += delta;
        // Emit new alpha particle every 50ms
        if(emitTimer > 0.05) {
            emitTimer = 0;
            const p = new THREE.Mesh(pGeom, pMat);
            // Small random spread
            const spreadY = (Math.random() - 0.5) * 1.5;
            const spreadZ = (Math.random() - 0.5) * 1.5;
            p.position.set(-9, spreadY, spreadZ);
            
            p.userData = { vel: new THREE.Vector3(20, 0, 0), deflected: false };
            alphaGroup.add(p);
            particles.push(p);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Physics: Coulomb scattering
            if (p.position.x > -2 && p.position.x < 2 && !p.userData.deflected) {
                // Calculate repulsive force from all gold nuclei
                let force = new THREE.Vector3(0,0,0);
                let hitNucleus = false;
                
                nucleiPositions.forEach(nPos => {
                    const dir = p.position.clone().sub(nPos);
                    const distSq = dir.lengthSq();
                    
                    if (distSq < 0.3) {
                        // Direct hit! Bounce back violently
                        hitNucleus = true;
                    } else if (distSq < 4) {
                        // Deflection (F = k * q1q2 / r^2)
                        // Extremely simplified for visual effect
                        const fMag = 20 / distSq;
                        force.add(dir.normalize().multiplyScalar(fMag));
                    }
                });
                
                if (hitNucleus) {
                    p.userData.vel.x *= -1; // Bounce back
                    p.userData.deflected = true;
                } else {
                    p.userData.vel.add(force.multiplyScalar(delta));
                    p.userData.vel.setLength(20); // Maintain roughly same speed
                }
            }
            
            p.position.addScaledVector(p.userData.vel, delta);
            
            // Collision with detector (r = 8)
            if (p.position.lengthSq() >= 64 && p.position.x > -4) {
                // Flash
                const flash = new THREE.Mesh(fGeom, fMat.clone());
                flash.position.copy(p.position);
                flash.lookAt(0,0,0); // Face center
                group.add(flash);
                flashes.push(flash);
                
                alphaGroup.remove(p);
                particles.splice(i, 1);
            } else if (p.position.lengthSq() > 400) {
                // Lost
                alphaGroup.remove(p);
                particles.splice(i, 1);
            }
        }
        
        // Update flashes
        for (let i = flashes.length - 1; i >= 0; i--) {
            const f = flashes[i];
            f.material.opacity -= delta * 2;
            if (f.material.opacity <= 0) {
                group.remove(f);
                f.material.dispose();
                flashes.splice(i, 1);
            }
        }
    };

    return group;
}
